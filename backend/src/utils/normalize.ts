import { CrmRecord, CrmStatus, DataSource } from '../types/import.js';

const allowedCrmStatuses: readonly CrmStatus[] = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
const allowedDataSources: readonly DataSource[] = [
  'leads_on_demand',
  'meridian_tower',
  'eden_park',
  'varah_swamy',
  'sarjapur_plots',
];

const phonePattern = /(?:\+?\d[\d\s().-]{6,}\d)/g;
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

export function extractEmails(text: string): string[] {
  return (text.match(emailPattern) ?? []).map((value) => value.trim());
}

export function extractPhones(text: string): string[] {
  return (text.match(phonePattern) ?? []).map((value) => value.trim());
}

function isCrmStatus(value: string): value is CrmStatus {
  return allowedCrmStatuses.includes(value as CrmStatus);
}

function isDataSource(value: string): value is DataSource {
  return allowedDataSources.includes(value as DataSource);
}

export function normalizeRecord(record: CrmRecord): CrmRecord | null {
  const email = record.email.trim();
  const mobile = record.mobile_without_country_code.trim();
  const crmStatus = record.crm_status.trim();
  const dataSource = record.data_source.trim();
  const normalizedCrmStatus: CrmRecord['crm_status'] = isCrmStatus(crmStatus) ? crmStatus : '';
  const normalizedDataSource: CrmRecord['data_source'] = isDataSource(dataSource) ? dataSource : '';

  if (!email && !mobile) {
    return null;
  }

  return {
    ...record,
    created_at: record.created_at || new Date().toISOString(),
    email,
    mobile_without_country_code: mobile,
    crm_status: normalizedCrmStatus,
    data_source: normalizedDataSource,
    crm_note: record.crm_note.trim(),
    description: record.description.trim(),
  };
}
