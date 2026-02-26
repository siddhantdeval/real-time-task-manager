'use server';

import { serverFetch } from '@/lib/server-api';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function createProjectAction(prevState: any, formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      labelColor: formData.get('labelColor') as string,
    };

    await serverFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    revalidatePath('/projects', 'page');
    revalidateTag('projects', 'max');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function archiveProjectAction(projectId: string) {
  try {
    await serverFetch(`/projects/${projectId}/archive`, {
      method: 'PATCH',
    });
    revalidatePath('/projects', 'page');
    revalidateTag('projects', 'max');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
