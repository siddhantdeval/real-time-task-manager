import React from 'react';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-transparent font-sans antialiased min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
