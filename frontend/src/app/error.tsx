'use client';

import { useEffect } from 'react';
import { Button } from '../components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-xl space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-soft backdrop-blur">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-slate-300">The application hit an unexpected error. You can retry the workflow without reloading the page.</p>
          <div className="flex justify-center">
            <Button onClick={reset}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}