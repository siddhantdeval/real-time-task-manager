
export default function ProjectsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <main className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Real-Time Task Manager
        </h1>
        <p className="max-w-prose text-lg text-slate-600">
          A modern, high-performance task management application built with Next.js and Node.js.
        </p>
        <div className="mt-8 flex gap-4">
          <button className="bg-primary hover:bg-primary-hover text-white font-medium rounded-md px-6 py-2 transition-colors">
            Get Started
          </button>
          <button className="bg-white hover:bg-slate-50 text-slate-700 border border-gray-300 font-medium rounded-md px-6 py-2">
            Documentation
          </button>
        </div>
      </main>
    </div>
  );
}
