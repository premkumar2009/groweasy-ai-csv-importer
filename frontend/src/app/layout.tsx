import type { Metadata } from 'next';
import { Space_Grotesk, Manrope } from 'next/font/google';
import { ThemeScript } from '../components/theme-script';
import { Toaster } from 'sonner';
import './globals.css';
import type { ReactNode } from 'react';

const heading = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'GrowEasy AI CSV Importer',
  description: 'Upload CSVs, preview rows, and import CRM-ready records with Gemini-powered mapping.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${heading.variable} ${body.variable} bg-[var(--background)] font-[family-name:var(--font-body)] text-[var(--foreground)] antialiased`}>
        <ThemeScript />
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.08),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.04),_transparent_28%)]">
          <header className="sticky top-0 z-40 border-b border-white/5 bg-white/70 backdrop-blur dark:bg-slate-950/70">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">GrowEasy</p>
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold">AI CSV Importer</h2>
              </div>
              <div className="flex items-center gap-3">
                <a href="#workflow" className="hidden text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white md:inline">
                  Workflow
                </a>
              </div>
            </div>
          </header>
          <main id="workflow">{children}</main>
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}