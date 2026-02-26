import React from 'react';
import { Plus } from 'lucide-react';

interface NewProjectCardProps {
  onClick: () => void;
}

export function NewProjectCard({ onClick }: NewProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-transparent border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group h-full min-h-[220px] w-full"
    >
      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
        <Plus className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors" />
      </div>
      <h3 className="text-slate-900 dark:text-white font-medium mb-1 group-hover:text-primary transition-colors">
        Create new project
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
        Set up a new workspace for your team
      </p>
    </button>
  );
}
