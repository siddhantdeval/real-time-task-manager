import React from 'react';
import Link from 'next/link';
import { User, Bell, Shield, CreditCard } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-24">
        <div className="mb-6 px-3">
          <h1 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account settings</p>
        </div>
        <nav className="flex flex-col gap-1">
          {/* Active Item: Profile */}
          <Link href="/settings/profile" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary transition-all">
            <User className="size-5 filled" />
            <span className="text-sm font-medium">Profile</span>
          </Link>
          {/* Inactive Items */}
          <Link href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <Bell className="size-5" />
            <span className="text-sm font-medium">Notifications</span>
          </Link>
          <Link href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <Shield className="size-5" />
            <span className="text-sm font-medium">Security</span>
          </Link>
          <Link href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <CreditCard className="size-5" />
            <span className="text-sm font-medium">Billing</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
