'use client';

import { Badge } from './ui/badge';
import { VirtualizedDataTable } from './virtualized-data-table';
import { type CrmRecord } from '../lib/api';

const columns = [
  { key: 'created_at', label: 'Created At' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'mobile_without_country_code', label: 'Mobile' },
  { key: 'company', label: 'Company' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'country', label: 'Country' },
  { key: 'lead_owner', label: 'Lead Owner' },
  { key: 'crm_status', label: 'CRM Status' },
  { key: 'crm_note', label: 'CRM Note' },
  { key: 'data_source', label: 'Data Source' },
  { key: 'possession_time', label: 'Possession Time' },
  { key: 'description', label: 'Description' },
];

export function ResultsTable({ records, totalSkipped }: { records: CrmRecord[]; totalSkipped: number }) {
  const skippedPreview = totalSkipped > 0 ? [{ created_at: 'Skipped rows', name: `Total skipped: ${totalSkipped}` }] : [];
  const mergedRows = [...records, ...(skippedPreview as Array<Record<string, unknown>>)].map((record) => ({
    ...record,
    __skipped: 'created_at' in record && record.created_at === 'Skipped rows',
  }));

  return (
    <div className="space-y-3">
      {totalSkipped > 0 ? <Badge variant="danger">Skipped rows are highlighted in the table below.</Badge> : null}
      <VirtualizedDataTable
        data={mergedRows}
        columns={columns}
        highlightSkips={(row) => Boolean(row.__skipped)}
      />
    </div>
  );
}