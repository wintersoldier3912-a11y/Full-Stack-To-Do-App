export enum Priority {
  LOW = 'low',
  MED = 'med',
  HIGH = 'high'
}

export enum SortOption {
  DUE_DATE = 'due',
  PRIORITY = 'priority',
  CREATED = 'created'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO Date string
  priority: Priority;
  completed: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface TaskFilter {
  search: string;
  completed?: boolean; // undefined = all, true = completed, false = active
  priority?: Priority;
  sort: SortOption;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {
  completed?: boolean;
}