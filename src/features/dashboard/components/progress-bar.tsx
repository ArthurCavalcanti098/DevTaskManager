"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={cn("rounded-lg border border-border-default bg-bg-secondary p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">Progresso geral</span>
        <span className="text-sm font-medium text-text-primary">{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-bg-tertiary">
        <div
          className="h-full rounded-full bg-accent-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-text-muted">
        {value} de {max} tarefas concluídas
      </p>
    </div>
  );
}
