"use client";

import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  return (
    <header className="border-b border-border-default bg-bg-secondary">
      <div className="flex h-14 items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary">
            <LayoutGrid className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-text-primary">DevTasks</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Search tasks..."
              className="pl-9 bg-bg-tertiary border-border-default"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
