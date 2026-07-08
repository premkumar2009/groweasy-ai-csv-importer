'use client';

import { type CsvPreviewRow } from '../lib/csv';
import { VirtualizedDataTable } from './virtualized-data-table';

export function PreviewTable({ headers, rows }: { headers: string[]; rows: CsvPreviewRow[] }) {
  const columns = headers.map((header) => ({ key: header, label: header }));

  return <VirtualizedDataTable data={rows} columns={columns} />;
}