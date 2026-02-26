import React from 'react';
import { ProjectForm } from '@/components/modules/projects/ProjectForm';
import { serverFetch } from '@/lib/server-api';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Project | TaskFlow',
};

export default async function EditProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  try {
    const res = await serverFetch(`/projects/${id}`, { cache: 'no-store' });
    if (!res?.data) return notFound();

    return (
      <div className="animate-in fade-in duration-500">
        <ProjectForm mode="edit" project={res.data} />
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
