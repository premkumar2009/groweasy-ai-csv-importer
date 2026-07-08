import type { Express } from 'express';
import { chunkArray } from '../utils/batch.js';
import { parseCsvBuffer } from '../utils/csv.js';
import { normalizeRecord, extractEmails, extractPhones } from '../utils/normalize.js';
import { AiRowsPayload } from '../types/ai.js';
import { CrmRecord, ImportResult, ParsedCsvRow } from '../types/import.js';
import { mapRowsWithGemini } from './geminiService.js';

function rowLooksUseful(row: ParsedCsvRow): boolean {
  const joinedValues = Object.values(row.raw).join(' ');
  return extractEmails(joinedValues).length > 0 || extractPhones(joinedValues).length > 0;
}

function createFallbackRecord(row: ParsedCsvRow): CrmRecord {
  const values = Object.values(row.raw).join(' | ');
  const emails = extractEmails(values);
  const phones = extractPhones(values);

  return {
    created_at: new Date().toISOString(),
    name: row.raw['name'] ?? row.raw['full name'] ?? row.raw['customer name'] ?? '',
    email: emails[0] ?? '',
    country_code: '',
    mobile_without_country_code: phones[0] ?? '',
    company: row.raw['company'] ?? row.raw['organization'] ?? '',
    city: row.raw['city'] ?? '',
    state: row.raw['state'] ?? '',
    country: row.raw['country'] ?? '',
    lead_owner: row.raw['lead owner'] ?? '',
    crm_status: '',
    crm_note: values,
    data_source: '',
    possession_time: '',
    description: values,
  };
}

async function processBatch(rows: ParsedCsvRow[]): Promise<{ records: CrmRecord[]; skipped: number }> {
  const payload: AiRowsPayload = {
    rows: rows.map((row) => row.raw),
    rowNumbers: rows.map((row) => row.rowNumber),
  };

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const aiResult = await mapRowsWithGemini(payload);
      if (aiResult.records.length !== rows.length) {
        throw new Error('Gemini returned a mismatched record count.');
      }

      const records = rows
        .map((row, index) => normalizeRecord(aiResult.records[index] ?? createFallbackRecord(row)))
        .filter((record): record is CrmRecord => Boolean(record));

      const skipped = rows.length - records.length;
      return { records, skipped };
    } catch (error) {
      if (attempt === 3) {
        break;
      }
    }
  }

  const fallbackRecords = rows.map((row) => normalizeRecord(createFallbackRecord(row))).filter((record): record is CrmRecord => Boolean(record));
  return {
    records: fallbackRecords,
    skipped: rows.length - fallbackRecords.length,
  };
}

export async function runCsvImport(file: Express.Multer.File): Promise<ImportResult> {
  if (!file || !file.buffer) {
    throw new Error('A valid CSV file upload is required.');
  }

  const parsedRows = await parseCsvBuffer(file.buffer);
  const usefulRows = parsedRows.filter(rowLooksUseful);
  const skippedByFilter = parsedRows.length - usefulRows.length;

  if (usefulRows.length === 0) {
    return {
      success: true,
      totalImported: 0,
      totalSkipped: parsedRows.length,
      records: [],
    };
  }

  const batches = chunkArray(usefulRows, 20);
  const records: CrmRecord[] = [];
  let skipped = skippedByFilter;

  for (const batch of batches) {
    const batchResult = await processBatch(batch);
    records.push(...batchResult.records);
    skipped += batchResult.skipped;
  }

  return {
    success: true,
    totalImported: records.length,
    totalSkipped: skipped,
    records,
  };
}