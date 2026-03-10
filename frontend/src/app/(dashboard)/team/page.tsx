import { serverFetch } from '@/lib/server-api';
import TeamMembersList from '@/components/modules/team/TeamMembersList';

export const metadata = {
  title: 'Team | TaskFlow',
};

export default async function TeamPage() {
  // Fetch users from the backend
  // We use cache: 'no-store' to ensure we always get fresh data for the team list
  const response = await serverFetch('/users', {
    cache: 'no-store',
  });
  
  return <TeamMembersList initialData={response?.data || []} />;
}
