import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { TaskList } from "@/features/tasks/components/task-list";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-bg-primary p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-text-primary">All Tasks</h1>
              <p className="text-sm text-text-secondary mt-1">
                Manage and organize your development tasks
              </p>
            </div>
            <TaskList />
          </div>
        </main>
      </div>
    </div>
  );
}
