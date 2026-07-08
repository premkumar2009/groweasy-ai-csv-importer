'use client';

import { useMemo, useRef } from 'react';
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../lib/utils';

export interface VirtualizedTableProps<TRecord extends Record<string, unknown>> {
  data: TRecord[];
  columns: Array<{ key: keyof TRecord | string; label: string; className?: string }>;
  className?: string;
  highlightSkips?: (row: TRecord) => boolean;
}

export function VirtualizedDataTable<TRecord extends Record<string, unknown>>({ data, columns, className, highlightSkips }: VirtualizedTableProps<TRecord>) {
  const tableColumns = useMemo(
    () =>
      columns.map((column) =>
        ({
          id: String(column.key),
          header: column.label,
          accessorFn: (row) => String(row[column.key as keyof TRecord] ?? ''),
          cell: (info) => String(info.getValue() ?? ''),
        }) satisfies ColumnDef<TRecord>,
      ),
    [columns],
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const parentRef = useRef<HTMLDivElement | null>(null);
  const rows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 8,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div ref={parentRef} className={cn('max-h-[640px] overflow-auto rounded-2xl border border-slate-200 bg-white/85 dark:border-slate-800 dark:bg-slate-950/70', className)}>
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50/95 text-left backdrop-blur dark:bg-slate-950/95">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody style={{ position: 'relative', height: `${totalSize}px` }}>
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            const skipped = highlightSkips?.(row.original) ?? false;

            return (
              <tr
                key={row.id}
                className={cn('absolute left-0 top-0 w-full border-b border-slate-100 transition-colors dark:border-slate-900', skipped && 'bg-rose-50/90 dark:bg-rose-950/20')}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b border-slate-100 px-4 py-3 align-top text-slate-700 dark:border-slate-900 dark:text-slate-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}