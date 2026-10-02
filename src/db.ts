import Dexie, { type Table } from "dexie";
import type { Task, Step } from './types';

export class PlannerDatabase extends Dexie {
  tasks!: Table<Task, number>;
  steps!: Table<Step, number>;

  constructor() {
    super('PlannerDB')
    this.version(1).stores({
      tasks: '++id, status, dueDate',
      steps: '++id, taskId'
    });
  }
}

export const db = new PlannerDatabase();
