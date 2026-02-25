import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/settings/Sidebar';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background-light dark:bg-background-dark font-sans antialiased min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 w-full max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col md:flex-row gap-8">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
