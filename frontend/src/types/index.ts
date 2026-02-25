export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'member';
  avatar_url?: string;
  created_at: string;
}
