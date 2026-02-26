import React from 'react';

interface ProjectProgressBarProps {
  total: number;
  done: number;
  percentage: number;
}

export function ProjectProgressBar({ total, done, percentage }: ProjectProgressBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Project Progress</h3>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {done} / {total} Tasks
        </span>
      </div>

      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-3 text-sm">
        <span className="text-primary font-semibold">{percentage}% Completed</span>
        <span className="text-slate-500 dark:text-slate-400">Target: End of Q4</span>
      </div>
    </div>
  );
}
