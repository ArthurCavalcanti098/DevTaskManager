"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Task, Tag } from "@/types";

interface SidebarProps {
  className?: string;
  tasks: Task[];
  tags: Tag[];
  onOpenTagManager?: () => void;
  onLogout?: () => void;
}

export function Sidebar({ className, tasks, tags, onOpenTagManager, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Todas as tarefas", count: tasks.length },
    { icon: Clock, label: "Em andamento", count: tasks.filter((t) => t.status === "IN_PROGRESS").length },
    { icon: Eye, label: "Em revisão", count: tasks.filter((t) => t.status === "REVIEW").length },
    { icon: AlertCircle, label: "Urgentes", count: tasks.filter((t) => t.priority === "URGENT").length },
    { icon: CheckCircle2, label: "Concluídas", count: tasks.filter((t) => t.status === "DONE").length },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border-default bg-bg-secondary transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border-default px-4">
        {!collapsed && (
          <span className="text-sm font-medium text-text-secondary">Navigation</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors",
                item.label === "All Tasks" && "bg-bg-hover text-text-primary"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className="text-xs text-text-muted">{item.count}</span>
                </>
              )}
            </button>
          ))}
        </div>

        {!collapsed && (
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Tags
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onOpenTagManager}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <div
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span>{tag.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="border-t border-border-default p-2">
        <button
          onClick={onLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
