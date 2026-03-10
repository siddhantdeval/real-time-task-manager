'use server';

import { serverFetch } from '@/lib/server-api';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['Admin', 'Member', 'Viewer']),
});

export async function inviteTeamMemberAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email'),
      role: formData.get('role'),
    };

    const validatedData = inviteSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    // Creating a user in the backend requires a password as per the API reference
    await serverFetch('/users', {
      method: 'POST',
      body: JSON.stringify({
        email: validatedData.data.email,
        password: 'TemporaryPassword123!', // Required by API, ideally a random string in real app
        role: validatedData.data.role.toLowerCase() === 'admin' ? 'admin' : 'member',
      }),
    });

    revalidatePath('/team', 'page');
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to send invite. Please try again later.' };
  }
}
