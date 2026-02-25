import React from 'react';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthSplitLayout({ children, title, subtitle }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left side - Marketing Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col p-12 text-white justify-between">
        <div className="flex items-center gap-2">
          {/* Simple logo placeholder */}
          <div className="w-8 h-8 bg-violet-600 rounded-md"></div>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </div>
        
        <div className="max-w-md">
          <h1 className="text-4xl font-semibold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            {subtitle}
          </p>

          <div className="space-y-4">
            <FeatureItem text="Instant updates across all your devices" />
            <FeatureItem text="Collaborative task boards for your entire team" />
            <FeatureItem text="Advanced analytics and progress tracking" />
          </div>
        </div>

        <div className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} TaskFlow Inc.
        </div>
      </div>

      {/* Right side - Form Panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-violet-600 rounded-md"></div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">TaskFlow</span>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
        <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-slate-300">{text}</span>
    </div>
  );
}
