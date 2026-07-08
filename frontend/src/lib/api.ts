import axios from 'axios';

export interface CrmRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

export interface ImportResponse {
  success: boolean;
  totalImported: number;
  totalSkipped: number;
  records: CrmRecord[];
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 120000,
});

export async function importCsv(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ImportResponse>('/api/import', formData);

  return response.data;
}