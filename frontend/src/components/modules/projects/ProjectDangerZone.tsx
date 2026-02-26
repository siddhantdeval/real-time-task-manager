'use client';

import React from 'react';
import { useTransition } from 'react';
import { archiveProjectAction } from '@/app/actions/project.actions';
import { AlertTriangle } from 'lucide-react';

interface ProjectDangerZoneProps {
  projectId: string;
}

export function ProjectDangerZone({ projectId }: ProjectDangerZoneProps) {
  const [isPending, startTransition] = useTransition();

  const handleArchive = () => {
    if (confirm('Are you sure you want to archive this project? It will become read-only and be hidden from active dashboards.')) {
      startTransition(async () => {
        const result = await archiveProjectAction(projectId);
        if (result?.error) {
          alert(`Failed to archive: ${result.error}`);
        }
      });
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-semibold text-rose-600 mb-2 flex items-center gap-2">
        <AlertTriangle size={20} />
        Danger Zone
      </h3>
      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-medium text-slate-900 dark:text-rose-100">Archive this project</h4>
          <p className="text-sm text-slate-500 dark:text-rose-200/70 mt-1">
            The project will be read-only and removed from active dashboards.
          </p>
        </div>
        <button
          type="button"
          onClick={handleArchive}
          disabled={isPending}
          className="whitespace-nowrap px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900 dark:text-rose-300 dark:hover:bg-rose-800 font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Archiving...' : 'Archive Project'}
        </button>
      </div>
    </div>
  );
}
