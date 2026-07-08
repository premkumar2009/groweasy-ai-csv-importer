import Link from 'next/link';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-4xl font-semibold">Page not found</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">The requested route does not exist.</p>
        <Button asChild>
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}