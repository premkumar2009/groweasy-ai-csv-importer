'use client';

import dynamic from 'next/dynamic';
import { ChangeEvent, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Upload, FileSpreadsheet, ArrowRight, RefreshCcw } from 'lucide-react';
import { parseCsvPreview, type CsvPreviewRow } from '../lib/csv';
import { importCsv, type CrmRecord, type ImportResponse } from '../lib/api';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';

const PreviewTable = dynamic(() => import('./preview-table').then((module) => module.PreviewTable), {
  ssr: false,
  loading: () => <PreviewSkeleton />,
});

const ResultsTable = dynamic(() => import('./results-table').then((module) => module.ResultsTable), {
  ssr: false,
  loading: () => <ResultsSkeleton />,
});

interface PreviewState {
  file: File | null;
  fileName: string;
  headers: string[];
  rows: CsvPreviewRow[];
}

const emptyPreview: PreviewState = {
  file: null,
  fileName: '',
  headers: [],
  rows: [],
};

function acceptsCsv(file: File) {
  return file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
}

export function CsvImporterApp() {
  const [preview, setPreview] = useState<PreviewState>(emptyPreview);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canImport = Boolean(preview.file && preview.rows.length > 0 && !loadingPreview && !submitting);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    if (!acceptsCsv(file)) {
      setError('Please upload a valid CSV file.');
      toast.error('Please upload a valid CSV file.');
      return;
    }

    setError(null);
    setLoadingPreview(true);
    setResult(null);

    try {
      const parsed = await parseCsvPreview(file);
      setPreview({ file, fileName: parsed.fileName, headers: parsed.headers, rows: parsed.rows });
      toast.success(`Loaded ${parsed.rows.length} preview rows.`);
    } catch (previewError) {
      const message = previewError instanceof Error ? previewError.message : 'Failed to parse the CSV file.';
      setError(message);
      toast.error(message);
      setPreview(emptyPreview);
    } finally {
      setLoadingPreview(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const summary = useMemo(() => {
    if (!result) {
      return null;
    }

    return [
      { label: 'Imported', value: result.totalImported },
      { label: 'Skipped', value: result.totalSkipped },
      { label: 'Total', value: result.totalImported + result.totalSkipped },
    ];
  }, [result]);

  async function handleImport() {
    if (!preview.file) {
      toast.error('Please upload a CSV first.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await importCsv(preview.file);
      setResult(response);
      toast.success('CSV import completed successfully.');
    } catch (importError) {
      const message = importError instanceof Error ? importError.message : 'Import failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function resetWorkflow() {
    setPreview(emptyPreview);
    setResult(null);
    setError(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-8 text-white shadow-soft md:px-10 md:py-12">
        <div className="max-w-3xl space-y-5">
          <Badge variant="secondary" className="w-fit bg-white/10 text-white">
            GrowEasy AI CSV Importer
          </Badge>
          <div className="space-y-3">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight md:text-6xl">
              Import messy CSVs into clean CRM records.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Upload arbitrary CSV files, preview the data, and let Gemini map unknown columns into CRM-ready fields with resilient batch processing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            <Badge variant="outline" className="border-white/20 text-white">Batching</Badge>
            <Badge variant="outline" className="border-white/20 text-white">Retries</Badge>
            <Badge variant="outline" className="border-white/20 text-white">Responsive</Badge>
            <Badge variant="outline" className="border-white/20 text-white">Accessible</Badge>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 1. Upload CSV</CardTitle>
              <CardDescription>Drag and drop a CSV file or browse your device.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={cn(
                  'relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all',
                  isDragActive ? 'border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-900/60' : 'border-slate-300 bg-slate-50/70 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/30 dark:hover:border-slate-500',
                )}
              >
                <input {...getInputProps()} />
                <Upload className="mb-4 h-12 w-12 text-slate-500" />
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {isDragActive ? 'Drop the CSV file here' : 'Drag & Drop CSV here'}
                </p>
                <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
                  Supports comma-separated files with any column layout. Validation happens before AI processing.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <Button type="button" onClick={open} variant="secondary" className="gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Browse Files
                  </Button>
                  <Button type="button" onClick={resetWorkflow} variant="ghost" className="gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="grid gap-4 md:grid-cols-2">
                <Input value={preview.fileName} readOnly placeholder="No file selected" />
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
                  CSV validation checks file type, emptiness, and parseability before import.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2. Preview</CardTitle>
              <CardDescription>First 100 rows parsed with PapaParse. No AI processing yet.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPreview ? (
                <PreviewSkeleton />
              ) : preview.rows.length > 0 ? (
                <PreviewTable headers={preview.headers} rows={preview.rows} />
              ) : (
                <EmptyState message="Upload a CSV to preview rows here." />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Step 3. Confirm Import</CardTitle>
              <CardDescription>Send the file to the backend for Gemini-assisted mapping.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="button" size="lg" onClick={handleImport} disabled={!canImport} className="w-full gap-2">
                {submitting ? 'Processing import...' : 'Confirm Import'}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                <div className={cn('h-1 rounded-full bg-slate-900 transition-all dark:bg-white', submitting ? 'w-full animate-pulse' : 'w-0')} />
                <div className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {submitting ? 'Loading overlay active while the backend processes batches.' : 'Button remains disabled until a valid CSV is loaded.'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 4. Results</CardTitle>
              <CardDescription>Imported CRM records and skipped totals are shown after processing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {summary ? (
                <div className="grid grid-cols-3 gap-3">
                  {summary.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{item.label}</div>
                      <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">{item.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="Imported rows will appear here after the backend finishes." />
              )}

              {result ? <ResultsTable records={result.records} totalSkipped={result.totalSkipped} /> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
      {message}
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-[360px] w-full" />
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-[360px] w-full" />
    </div>
  );
}