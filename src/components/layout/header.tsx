"use client";

import { LayoutGrid } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border-default bg-bg-secondary">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary">
            <LayoutGrid className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-text-primary">DevTasks</span>
        </div>
      </div>
    </header>
  );
}
