'use client';

import React, { useState } from 'react';
import { ProjectMember } from '@/types';
import { UserPlus, X, Search } from 'lucide-react';
import { clientFetch } from '@/lib/client-api';
import { useRouter } from 'next/navigation';

interface ProjectMembersListProps {
  projectId: string;
  initialMembers: ProjectMember[];
}

export function ProjectMembersList({ projectId, initialMembers }: ProjectMembersListProps) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const filteredMembers = members.filter(m => 
    m.user.email.toLowerCase().includes(search.toLowerCase()) || 
    (m.user.name && m.user.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    try {
      // In a real app this might use a Server Action, doing fetch here for simplicity of optimistic UI
      const res = await clientFetch(`/projects/${projectId}/members`, {
        method: 'POST',
        body: JSON.stringify({ email: newEmail, role: 'MEMBER' })
      });
      setMembers([...members, res.data]);
      setNewEmail('');
      setIsInviting(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to invite user');
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm('Remove this member?')) return;
    try {
      await clientFetch(`/projects/${projectId}/members/${memberId}`, { method: 'DELETE' });
      setMembers(members.filter(m => m.id !== memberId));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Project Members</h3>
          <p className="text-sm text-slate-500">{members.length} members</p>
        </div>
        <button 
          onClick={() => setIsInviting(!isInviting)}
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
          title="Invite Member"
        >
          <UserPlus size={18} />
        </button>
      </div>

      {isInviting && (
        <form onSubmit={handleInvite} className="mb-4 flex gap-2">
          <input
            type="email"
            placeholder="User email to invite..."
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-transparent focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
          <button type="submit" className="px-3 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
            Add
          </button>
        </form>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Find team members"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-[300px] space-y-4 pr-2">
        {filteredMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 bg-cover bg-center"
                style={{ backgroundImage: member.user.avatar_url ? `url(${member.user.avatar_url})` : 'none' }}
              >
                {!member.user.avatar_url && (member.user.name?.[0] || member.user.email[0]).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white leading-tight">
                  {member.user.name || member.user.email.split('@')[0]}
                </p>
                <p className="text-xs text-slate-500 capitalize">{member.role.toLowerCase()}</p>
              </div>
            </div>
            {/* Show delete button only if it isn't the current user/owner - simplified for now */}
            <button 
              type="button"
              onClick={() => handleRemove(member.id)}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md opacity-0 group-hover:opacity-100 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {filteredMembers.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-500">
            No members found.
          </div>
        )}
      </div>
    </div>
  );
}
