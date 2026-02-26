"use client";

import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Project } from "@/types";
import { clientFetch } from "@/lib/client-api";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProjectProgressBar } from "./ProjectProgressBar";
import { RecentActivityFeed } from "./RecentActivityFeed";
import { X, ExternalLink, Calendar } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ProjectDetailsModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailsModal({ projectId, isOpen, onClose }: ProjectDetailsModalProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !projectId) return;

    let isMounted = true;
    setLoading(true);

    clientFetch(`/projects/${projectId}`)
      .then((res) => {
        if (isMounted) setProject(res.data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load project details");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [projectId, isOpen]);

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-background dark:bg-slate-950 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 fade-in duration-200">
          <DialogTitle hidden>efe</DialogTitle>
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading project details...</div>
          ) : error || !project ? (
            <div className="p-12 text-center text-rose-500">{error || "Project not found"}</div>
          ) : (
            <>
              {/* Header */}
              <div className="px-8 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between sticky top-0 z-10">
                <div className="flex gap-5">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm flex-shrink-0"
                    style={{ backgroundColor: project.labelColor || "#6366f1" }}
                  >
                    {getInitials(project.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Dialog.Title className="text-2xl font-bold text-slate-900 dark:text-white">
                        {project.name}
                      </Dialog.Title>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> Created{" "}
                        {moment(project.created_at).format("MMM D, YYYY")}
                      </span>
                      <span>
                        Owner: {project.owner?.name || project.owner?.email.split("@")[0]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/projects/${projectId}/edit`)}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit Project
                  </button>
                  <Dialog.Close asChild>
                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="p-8 overflow-y-auto flex-1 flex flex-col lg:flex-row gap-8">
                {/* Left Column (Main Info & Progress) */}
                <div className="flex-1 space-y-8">
                  {project.description && (
                    <section>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-lg">
                        About
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                        {project.description}
                      </p>
                    </section>
                  )}

                  <ProjectProgressBar
                    total={project.progress?.total || 0}
                    done={project.progress?.done || 0}
                    percentage={project.progress?.percentage || 0}
                  />

                  <RecentActivityFeed activities={project.activities || []} />
                </div>

                {/* Right Column (Team) */}
                <div className="w-full lg:w-72 space-y-6">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900 dark:text-white">Project Team</h3>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full font-medium">
                        {(project.members || []).length} members
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(project.members || []).slice(0, 5).map((member) => (
                        <div key={member.id} className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 bg-cover bg-center shrink-0"
                            style={{
                              backgroundImage: member.user.avatar_url
                                ? `url(${member.user.avatar_url})`
                                : "none",
                            }}
                          >
                            {!member.user.avatar_url &&
                              getInitials(member.user.name || member.user.email)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                              {member.user.name || member.user.email.split("@")[0]}
                            </p>
                            <p className="text-[11px] text-slate-500 capitalize truncate">
                              {member.role.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {(project.members || []).length > 5 && (
                        <button className="w-full mt-2 text-sm text-primary font-medium hover:underline text-left">
                          View all members
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
