import { CrmRecord } from '../types/import.js';

const allowedCrmStatuses = new Set(['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE']);
const allowedDataSources = new Set(['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots']);

const phonePattern = /(?:\+?\d[\d\s().-]{6,}\d)/g;
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

export function extractEmails(text: string): string[] {
  return (text.match(emailPattern) ?? []).map((value) => value.trim());
}

export function extractPhones(text: string): string[] {
  return (text.match(phonePattern) ?? []).map((value) => value.trim());
}

export function normalizeRecord(record: CrmRecord): CrmRecord | null {
  const email = record.email.trim();
  const mobile = record.mobile_without_country_code.trim();
  const crmStatus = record.crm_status.trim();
  const dataSource = record.data_source.trim();

  if (!email && !mobile) {
    return null;
  }

  return {
    ...record,
    created_at: record.created_at || new Date().toISOString(),
    email,
    mobile_without_country_code: mobile,
    crm_status: allowedCrmStatuses.has(crmStatus) ? crmStatus : '',
    data_source: allowedDataSources.has(dataSource) ? dataSource : '',
    crm_note: record.crm_note.trim(),
    description: record.description.trim(),
  };
}
