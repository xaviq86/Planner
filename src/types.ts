export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Step {
  id?: number;
  taskId: number;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface Task {
  id?: number;
  title: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
}
