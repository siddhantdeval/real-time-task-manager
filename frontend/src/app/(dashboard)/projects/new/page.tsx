import React from 'react';
import { ProjectForm } from '@/components/modules/projects/ProjectForm';

export const metadata = {
  title: 'New Project | TaskFlow',
};

export default function NewProjectPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <ProjectForm mode="create" />
    </div>
  );
}
