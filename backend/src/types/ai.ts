import { CrmRecord } from './import.js';

export interface AiRowsPayload {
  rows: Array<Record<string, string>>;
  rowNumbers: number[];
}

export interface AiResponsePayload {
  records: Array<CrmRecord | null>;
}
