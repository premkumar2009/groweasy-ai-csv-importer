import { Readable } from 'node:stream';
import csvParser from 'csv-parser';
import { ParsedCsvRow } from '../types/import.js';

function sanitizeHeader(header: string): string {
  return header.replace(/^\uFEFF/, '').trim();
}

export async function parseCsvBuffer(buffer: Buffer): Promise<ParsedCsvRow[]> {
  const rows: ParsedCsvRow[] = [];
  let rowNumber = 1;

  await new Promise<void>((resolve, reject) => {
    Readable.from([buffer.toString('utf8')])
      .pipe(csvParser({ mapHeaders: ({ header }) => sanitizeHeader(header) }))
      .on('data', (row: Record<string, string>) => {
        rows.push({ rowNumber: rowNumber, raw: row });
        rowNumber += 1;
      })
      .on('end', resolve)
      .on('error', reject);
  });

  if (rows.length === 0) {
    throw new Error('CSV is empty or invalid.');
  }

  return rows;
}

export function hasCsvExtension(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.csv');
}
