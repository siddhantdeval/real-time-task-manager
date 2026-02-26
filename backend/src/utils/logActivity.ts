import { db } from '../services/db.service';

/**
 * Writes a lightweight audit entry for a project action.
 * Fire-and-forget — do not await in hot paths if you want non-blocking behavior.
 */
export async function logActivity(
  projectId: string,
  actorId: string,
  action: string,
  entityRef: string | null = null,
  tx?: any
): Promise<void> {
  const client = tx || db;
  await client.projectActivity.create({
    data: { projectId, actorId, action, entityRef },
  });
}
