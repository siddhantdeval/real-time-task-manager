'use client';

import React, { useState } from 'react';
import { Edit, Mail } from 'lucide-react';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('Jane Doe');
  const [bio, setBio] = useState('Product Manager | Task Enthusiast. Always looking for new ways to optimize workflows.');
  const [email] = useState('jane@example.com');

  return (
    <div className="flex-1 min-w-0">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Public Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This information will be displayed publicly so be careful what you share.</p>
        </div>

        {/* Profile Form */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="relative group">
              <div
                className="size-24 rounded-full bg-cover bg-center border-4 border-slate-50 dark:border-slate-800 shadow-inner"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAagg-G1-5vy6Grx-1ZZDUTtj_VnQCVbN16KBp8GwQb2P4sMjBV2QH1bCwg3amce0FU4uXIliE74K_41BhirygybUWMdXEzongPb8s4Pn-vbvzhW92FaHJmlHN1JQwvTTtkb8zy2-ry-eDjxtZAUYrRFN13GoBE7Hm5cjGdKWDYSyl-Y0DmD1s2UR9iQiycYxlKd-bqWOgKyJw3oXHhaSJidjyxR2WfMAibH7hVCn0WGMdlH5KS4sJHE4gefyDVJEmLs3geYnD5C9M")' }}
              ></div>
              <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm text-slate-600 dark:text-slate-200 hover:text-primary hover:border-primary dark:hover:border-primary transition-colors">
                <Edit className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Profile Picture</h3>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                  Upload new
                </button>
                <button className="px-4 py-2 bg-transparent rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  Remove
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800"></div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 gap-6 max-w-2xl">
            {/* Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 items-start">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 pt-2">Full Name</label>
              <div className="sm:col-span-2">
                <input
                  className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-3 border"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 items-start">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 pt-2">Email Address</label>
              <div className="sm:col-span-2 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="size-[18px]" />
                </span>
                <input
                  className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 shadow-sm sm:text-sm py-2.5 pl-10 px-3 cursor-not-allowed border"
                  disabled
                  type="email"
                  value={email}
                />
                <p className="mt-1.5 text-xs text-slate-500">Email address is managed by your organization.</p>
              </div>
            </div>

            {/* Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 items-start">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 pt-2">Bio</label>
              <div className="sm:col-span-2">
                <textarea
                  className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 placeholder:text-slate-400 border"
                  placeholder="Write a few sentences about yourself."
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
                <div className="mt-1.5 flex justify-between text-xs text-slate-500">
                  <span>Brief description for your profile.</span>
                  <span>{bio.length}/240</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
          <button className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all flex items-center gap-2">
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 px-1">
        <div className="flex justify-between items-center py-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Deactivate Account</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This will shut down your account and remove your data.</p>
          </div>
          <button className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
}
