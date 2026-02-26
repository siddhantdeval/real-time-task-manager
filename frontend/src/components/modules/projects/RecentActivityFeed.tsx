import React from 'react';
import { ProjectActivity } from '@/types';
import moment from 'moment';
import { CircleDot } from 'lucide-react';

interface RecentActivityFeedProps {
  activities: ProjectActivity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No recent activity.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={activity.id} className="flex gap-3 relative">
              {i !== activities.length - 1 && (
                <div className="absolute left-[9px] top-6 w-px h-full bg-slate-200 dark:bg-slate-800 -z-10" />
              )}
              
              <div className="w-5 h-5 shrink-0 bg-white dark:bg-slate-900 z-10">
                <CircleDot size={20} className="text-primary" />
              </div>
              
              <div className="flex-1 pb-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {activity.actor.name || activity.actor.email.split('@')[0]}
                  </span>{' '}
                  {activity.action}
                  {activity.entityRef && <span className="font-medium"> {activity.entityRef}</span>}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {moment(activity.createdAt).fromNow()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
