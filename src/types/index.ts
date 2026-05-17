export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
}

export interface TaskTag {
  id: string;
  taskId: string;
  tagId: string;
  tag: Tag;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  order: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: TaskTag[];
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
