export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'member';
  avatar_url?: string;
  created_at: string;
}

export type ProjectStatus = 'ACTIVE' | 'PLANNING' | 'DRAFT' | 'BLOCKED' | 'ARCHIVED';
export type MemberRole = 'LEAD' | 'MEMBER' | 'VIEWER';

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  user: User;
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  actorId: string;
  action: string;
  entityRef?: string | null;
  createdAt: string;
  actor: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  labelColor: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
  
  // Included relations
  owner?: User;
  members?: ProjectMember[];
  activities?: ProjectActivity[];
  
  // Computed values
  _count?: {
    tasks: number;
  };
  progress?: {
    total: number;
    done: number;
    percentage: number;
  };
}
