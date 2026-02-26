import React from 'react';
import { serverFetch } from '@/lib/server-api';
import { Project } from '@/types';
import { ProjectGridClient } from '@/components/modules/projects/ProjectGridClient';

export const metadata = {
  title: 'My Projects | TaskFlow',
};

export default async function ProjectsPage() {
  // Fetch projects from the backend via the serverFetch wrapper
  // This automatically uses the HttpOnly session cookie
  let projects: Project[] = [];
  try {
    const response = await serverFetch('/projects/me', {
      next: { tags: ['projects'] }, // Allows revalidateTag
    });
    projects = response.data || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
            My Projects
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your workspaces and team collaboration.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
            <button className="px-3 py-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md transition-colors">
              Grid
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              List
            </button>
          </div>
        </div>
      </div>

      <ProjectGridClient initialProjects={projects} />
    </div>
  );
}
