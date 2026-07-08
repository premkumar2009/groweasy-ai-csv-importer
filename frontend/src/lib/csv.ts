import Papa from 'papaparse';

export type CsvPreviewRow = Record<string, string>;

export interface CsvPreviewResult {
  fileName: string;
  headers: string[];
  rows: CsvPreviewRow[];
}

export async function parseCsvPreview(file: File, limit = 100): Promise<CsvPreviewResult> {
  const text = await file.text();
  const parsed = Papa.parse<CsvPreviewRow>(text, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    const firstError = parsed.errors[0];
    throw new Error(firstError.message || 'Unable to parse CSV file.');
  }

  const rows = (parsed.data ?? []).filter((row) => Object.values(row).some((value) => String(value ?? '').trim().length > 0)).slice(0, limit);
  const headers = parsed.meta.fields ?? [];

  if (headers.length === 0 || rows.length === 0) {
    throw new Error('The CSV file is empty or missing usable data.');
  }

  return {
    fileName: file.name,
    headers,
    rows,
  };
}