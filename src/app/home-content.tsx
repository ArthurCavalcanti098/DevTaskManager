"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { TaskList } from "@/features/tasks/components/task-list";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useTags } from "@/features/tags/hooks/use-tags";

export function HomeContent() {
  const tasksData = useTasks();
  const tagsData = useTags();
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          tasks={tasksData.tasks}
          tags={tagsData.tags}
          onOpenTagManager={() => setTagManagerOpen(true)}
          onLogout={() => setLogoutDialogOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-bg-primary p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-text-primary">Todas as tarefas</h1>
              <p className="text-sm text-text-secondary mt-1">
                Gerencie e organize suas tarefas de desenvolvimento
              </p>
            </div>
            <TaskList
              tasks={tasksData.tasks}
              isLoadingTasks={tasksData.isLoading}
              createTask={tasksData.createTask}
              updateTask={tasksData.updateTask}
              deleteTask={tasksData.deleteTask}
              tags={tagsData.tags}
              createTag={tagsData.createTag}
              updateTag={tagsData.updateTag}
              deleteTag={tagsData.deleteTag}
              tagManagerOpen={tagManagerOpen}
              onTagManagerChange={setTagManagerOpen}
            />
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
