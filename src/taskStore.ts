import { Task, Priority } from "./types";

// In-memory store; a real implementation would persist to disk or a DB.
let tasks: Task[] = [];
let nextId = 1;

function generateId(): string {
  // TODO: replace with a proper UUID generator (e.g. crypto.randomUUID)
  return String(nextId++);
}

export function addTask(
  title: string,
  priority: Priority = "medium",
  description?: string,
  tags: string[] = []
): Task {
  const task: Task = {
    id: generateId(),
    title,
    description,
    priority,
    done: false,
    createdAt: new Date(),
    tags,
  };
  tasks.push(task);
  return task;
}

export function getTask(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function listTasks(filter?: { done?: boolean; priority?: Priority }): Task[] {
  let result = [...tasks];
  if (filter?.done !== undefined) {
    result = result.filter((t) => t.done === filter.done);
  }
  if (filter?.priority !== undefined) {
    result = result.filter((t) => t.priority === filter.priority);
  }
  result.sort((a, b) => {
    const rankDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (rankDiff !== 0) return rankDiff;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
  return result;
}

export function completeTask(id: string): Task | undefined {
  const task = getTask(id);
  if (task) {
    task.done = true;
  }
  return task;
}

export function deleteTask(id: string): boolean {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);
  return tasks.length < before;
}

export function searchTasks(query: string): Task[] {
  // TODO: extend search to also match against task tags
  const q = query.toLowerCase();
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      (t.description ?? "").toLowerCase().includes(q)
  );
}

// Exposed for tests only.
export function _reset(): void {
  tasks = [];
  nextId = 1;
}
