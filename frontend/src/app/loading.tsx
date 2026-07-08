import { Skeleton } from '../components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <Skeleton className="mb-6 h-48 w-full rounded-[2rem]" />
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-[420px] w-full rounded-3xl" />
        <Skeleton className="h-[420px] w-full rounded-3xl" />
      </div>
    </div>
  );
}