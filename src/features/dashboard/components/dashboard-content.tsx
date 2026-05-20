"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { StatCard } from "./stat-card";
import { ProgressBar } from "./progress-bar";
import { TasksByStatus } from "./tasks-by-status";
import { TasksByPriority } from "./tasks-by-priority";
import { RecentTasks } from "./recent-tasks";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useTags } from "@/features/tags/hooks/use-tags";

export function DashboardContent() {
  const { tasks, isLoading } = useTasks();
  const tagsData = useTags();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const review = tasks.filter((t) => t.status === "REVIEW").length;
  const urgent = tasks.filter((t) => t.priority === "URGENT").length;

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          tasks={tasks}
          tags={tagsData.tags}
          onLogout={() => setLogoutDialogOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-bg-primary p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
              <p className="text-sm text-text-secondary mt-1">
                Visão geral das suas tarefas
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-lg border border-border-default bg-bg-secondary"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <StatCard
                    label="Total"
                    value={total}
                    icon={LayoutDashboard}
                    color="text-text-secondary"
                  />
                  <StatCard
                    label="Concluídas"
                    value={done}
                    icon={CheckCircle2}
                    color="text-green-400"
                  />
                  <StatCard
                    label="Em andamento"
                    value={inProgress}
                    icon={Clock}
                    color="text-amber-400"
                  />
                  <StatCard
                    label="Em revisão"
                    value={review}
                    icon={Eye}
                    color="text-purple-400"
                  />
                  <StatCard
                    label="Urgentes"
                    value={urgent}
                    icon={AlertCircle}
                    color="text-red-500"
                  />
                </div>

                <div className="mt-6">
                  <ProgressBar value={done} max={total} />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <TasksByStatus tasks={tasks} />
                  <TasksByPriority tasks={tasks} />
                </div>

                <div className="mt-6">
                  <RecentTasks tasks={tasks} />
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Sair da conta"
        description="Tem certeza que deseja sair?"
        confirmLabel="Sair"
        variant="default"
        onConfirm={() => signOut({ callbackUrl: "/login" })}
      />
    </div>
  );
}
