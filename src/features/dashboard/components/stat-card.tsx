"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, color, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-default bg-bg-secondary p-4",
        "hover:border-border-strong transition-colors",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">{label}</span>
        <Icon className={cn("h-4 w-4", color)} />
      </div>
      <p className="mt-2 text-2xl font-semibold text-text-primary">{value}</p>
    </div>
  );
}
