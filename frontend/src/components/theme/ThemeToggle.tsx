"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure hydration matches by only rendering after mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex size-10 items-center justify-center rounded-lg bg-background-light text-slate-400 dark:bg-slate-800 transition-colors">
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-background-light dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-5 transition-all text-amber-500" />
      ) : (
        <Moon className="size-5 transition-all text-slate-700" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
