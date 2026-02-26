import React from 'react';
import { Project } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MoreVertical, Users, CheckCircle2 } from 'lucide-react';
import moment from 'moment';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit: () => void;
  onArchive: () => void;
}

export function ProjectCard({ project, onClick, onEdit, onArchive }: ProjectCardProps) {
  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();
  const members = project.members || [];
  const displayMembers = members.slice(0, 3);
  const remainingMembers = members.length > 3 ? members.length - 3 : 0;
  
  const percentage = project.progress?.percentage || 0;

  return (
    <div 
      onClick={onClick}
      className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer h-full min-h-[220px]"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm"
          style={{ backgroundColor: project.labelColor || '#6366f1' }}
        >
          {getInitials(project.name)}
        </div>
        
        {/* Dropdown Menu - Stop click propagation to avoid opening modal */}
        <div className="relative group" onClick={(e) => e.stopPropagation()}>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            <MoreVertical size={18} />
          </button>
          <div className="absolute right-0 top-8 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-md py-1 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto z-10">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Edit Project
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onArchive(); }}
              className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Archive
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1 line-clamp-1">
          {project.name}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
          {project.description || 'No description provided.'}
        </p>
      </div>

      {/* Progress & Members Footer */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StatusBadge status={project.status} />
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <CheckCircle2 size={14} className="text-slate-400" />
            {percentage}%
          </div>
        </div>

        <div className="flex -space-x-2">
          {displayMembers.map((member) => (
            <div 
              key={member.id} 
              className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-600 bg-cover bg-center"
              style={{ backgroundImage: member.user.avatar_url ? `url(${member.user.avatar_url})` : 'none' }}
              title={member.user.name || member.user.email}
            >
              {!member.user.avatar_url && getInitials(member.user.name || member.user.email)}
            </div>
          ))}
          {remainingMembers > 0 && (
            <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-medium text-slate-500">
              +{remainingMembers}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
