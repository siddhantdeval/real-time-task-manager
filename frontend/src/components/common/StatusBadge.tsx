import React from 'react';
import { ProjectStatus } from '@/types';
import { cn } from '@/lib/utils'; // Assuming clsx/tailwind-merge utility exists

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const statusMap: Record<ProjectStatus, { label: string; bg: string; text: string; dot: string }> = {
  ACTIVE: { label: 'Active', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  PLANNING: { label: 'Planning', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  DRAFT: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
  BLOCKED: { label: 'Blocked', bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
  ARCHIVED: { label: 'Archived', bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status] || statusMap.DRAFT;

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium", config.bg, config.text, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </div>
  );
}
