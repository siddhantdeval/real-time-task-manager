'use client';

import React, { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { inviteTeamMemberAction } from '@/app/actions/team.actions';
import { UserPlus, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:ml-3 sm:w-auto",
        pending && "opacity-50 cursor-not-allowed"
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Send Invite
    </button>
  );
}

export default function TeamInviteModal({ isOpen, onClose }: TeamInviteModalProps) {
  const [state, formAction] = useActionState(inviteTeamMemberAction, null);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  if (!isOpen) return null;

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-500/75 dark:bg-slate-900/80 transition-opacity backdrop-blur-sm" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200 dark:border-slate-800">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
            >
              <X className="h-5 w-5" />
            </button>
            <form action={formAction}>
              <div className="bg-white dark:bg-slate-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 sm:mx-0 sm:h-10 sm:w-10">
                    <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white" id="modal-title">
                      Invite Team Member
                    </h3>
                    <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <p>Invite a new member to your team. They will receive an email invitation to join this workspace.</p>
                    </div>

                    {state?.error && (
                      <div className="mt-4 rounded-md bg-rose-50 dark:bg-rose-900/30 p-3">
                        <p className="text-sm font-medium text-rose-800 dark:text-rose-300">{state.error}</p>
                      </div>
                    )}

                    <div className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
                          Email Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full rounded-md border border-gray-300 dark:border-slate-700 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-white dark:bg-slate-900 dark:text-white"
                            placeholder="you@example.com"
                            required
                          />
                          {state?.fieldErrors?.email && (
                            <p className="mt-1 text-sm text-rose-600">{state.fieldErrors.email[0]}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
                          Role
                        </label>
                        <div className="mt-1">
                          <select
                            id="role"
                            name="role"
                            className="block w-full rounded-md border border-gray-300 dark:border-slate-700 py-2 pl-3 pr-10 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-white dark:bg-slate-900 dark:text-white"
                          >
                            <option value="Member">Member</option>
                            <option value="Lead">Lead</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                          {state?.fieldErrors?.role && (
                            <p className="mt-1 text-sm text-rose-600">{state.fieldErrors.role[0]}</p>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Members can edit tasks and create projects. Admins have full access.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 dark:border-slate-800">
                <SubmitButton />
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
