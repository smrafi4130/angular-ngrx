export type TaskStatus = 'todo' | 'doing' | 'done';
export const TASK_STATUSES: TaskStatus[] = ['todo', 'doing', 'done'];

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: number;
}

export type StatusFilter = TaskStatus | 'all';
