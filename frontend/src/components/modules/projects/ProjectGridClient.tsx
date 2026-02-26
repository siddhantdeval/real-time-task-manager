'use client';

import React, { useState } from 'react';
import { Project } from '@/types';
import { ProjectCard } from './ProjectCard';
import { NewProjectCard } from './NewProjectCard';
import { useRouter } from 'next/navigation';
import { ProjectDetailsModal } from './ProjectDetailsModal';
import { archiveProjectAction } from '@/app/actions/project.actions';

interface ProjectGridClientProps {
  initialProjects: Project[];
}

export function ProjectGridClient({ initialProjects }: ProjectGridClientProps) {
  const router = useRouter();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleCreate = () => {
    router.push('/projects/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/projects/${id}/edit`);
  };

  const handleArchive = async (id: string) => {
    if (confirm('Are you sure you want to archive this project?')) {
      const res = await archiveProjectAction(id);
      if (res?.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="h-full">
          <NewProjectCard onClick={handleCreate} />
        </div>
        
        {initialProjects.map((project) => (
          <div key={project.id} className="h-full">
            <ProjectCard
              project={project}
              onClick={() => setSelectedProjectId(project.id)}
              onEdit={() => handleEdit(project.id)}
              onArchive={() => handleArchive(project.id)}
            />
          </div>
        ))}
      </div>

      <ProjectDetailsModal
        projectId={selectedProjectId!}
        isOpen={!!selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />
    </>
  );
}
