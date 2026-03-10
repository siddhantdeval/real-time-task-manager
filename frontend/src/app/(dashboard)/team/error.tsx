'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
        <AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Something went wrong!</h2>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
        We encountered an error while loading the team data. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      >
        Try again
      </button>
    </div>
  );
}
