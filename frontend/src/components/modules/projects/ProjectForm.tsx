'use client';

import React, { useActionState, useState, useEffect } from 'react';
import { Project } from '@/types';
import { createProjectAction } from '@/app/actions/project.actions';
import { ProjectColorPicker } from './ProjectColorPicker';
import { ProjectDangerZone } from './ProjectDangerZone';
import { ProjectMembersList } from './ProjectMembersList';
import { clientFetch } from '@/lib/client-api'; // Client-side fetch wrapper
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface ProjectFormProps {
  mode: 'create' | 'edit';
  project?: Project;
}

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createProjectAction, null);
  
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [labelColor, setLabelColor] = useState(project?.labelColor || '#6366f1');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Handle redirect on successful creation
  useEffect(() => {
    if (state?.success) {
      router.push('/projects');
      router.refresh();
    }
  }, [state, router]);

  // If we are in edit mode, we bypass the Server Action for the update because it's a PUT
  // For standard Server Actions, you'd typically have `createAction` and `updateAction`.
  // We'll use a direct fetch here for Edit to handle the PUT request cleanly.
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') return;
    
    setIsUpdating(true);
    try {
      await clientFetch(`/projects/${project!.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, description, labelColor })
      });
      router.push('/projects');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update project');
    } finally {
      setIsUpdating(false);
    }
  };

  const isSaving = isPending || isUpdating;

  return (
    <div className="max-w-[1200px] mx-auto w-full pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {mode === 'create' ? 'Create New Project' : `Edit Project: ${project?.name}`}
          </h1>
          <p className="text-slate-500 mt-1">
            Configure your project settings, member access, and metadata.
          </p>
        </div>
        <button 
          type="button" 
          onClick={() => router.push('/projects')}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - General Info */}
        <div className="flex-1 space-y-8">
          <form 
            id="project-form"
            action={mode === 'create' ? formAction : undefined}
            onSubmit={mode === 'edit' ? handleUpdate : undefined}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl p-6 lg:p-8"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">General Information</h2>
            
            {state?.error && (
              <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium border border-rose-100">
                {state.error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Website Redesign Q4"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent text-slate-900 dark:text-white transition-shadow"
                />
              </div>

              <div>
                <label htmlFor="description" className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Description</span>
                  <span className="text-slate-400 font-normal">Supports Markdown</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the goals and scope of this project..."
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent text-slate-900 dark:text-white transition-shadow resize-y"
                />
              </div>

              <ProjectColorPicker value={labelColor} onChange={setLabelColor} />
            </div>

            {mode === 'edit' && project && (
              <ProjectDangerZone projectId={project.id} />
            )}
          </form>
        </div>

        {/* Right Column - Members (Only visible in edit mode per Stitch design) */}
        {mode === 'edit' && project && (
          <div className="w-full lg:w-[400px]">
            <ProjectMembersList projectId={project.id} initialMembers={project.members || []} />
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 z-40">
        <div className="max-w-[1200px] mx-auto flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/projects')}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            form="project-form"
            disabled={isSaving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : mode === 'create' ? 'Create Project' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
