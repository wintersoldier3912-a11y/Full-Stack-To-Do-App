import { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilter, Priority, SortOption } from '../types';

const STORAGE_KEY = 'taskflow_pro_db_v1';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to load from storage
const loadTasks = (): Task[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save to storage
const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const taskService = {
  getTasks: async (filter: TaskFilter): Promise<Task[]> => {
    await delay(300); // Simulate network latency
    let tasks = loadTasks();

    // Filtering
    if (filter.search) {
      const term = filter.search.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(term) || 
        (t.description && t.description.toLowerCase().includes(term))
      );
    }

    if (filter.completed !== undefined) {
      tasks = tasks.filter(t => t.completed === filter.completed);
    }

    if (filter.priority) {
      tasks = tasks.filter(t => t.priority === filter.priority);
    }

    // Sorting
    tasks.sort((a, b) => {
      switch (filter.sort) {
        case SortOption.DUE_DATE:
          // Handle missing due dates (push to end)
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case SortOption.PRIORITY:
          const priorityWeights = { [Priority.HIGH]: 3, [Priority.MED]: 2, [Priority.LOW]: 1 };
          return priorityWeights[b.priority] - priorityWeights[a.priority];
        case SortOption.CREATED:
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return tasks;
  },

  createTask: async (dto: CreateTaskDTO): Promise<Task> => {
    await delay(300);
    const tasks = loadTasks();
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...dto,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
  },

  updateTask: async (id: string, dto: UpdateTaskDTO): Promise<Task> => {
    await delay(200);
    const tasks = loadTasks();
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) throw new Error('Task not found');

    const updatedTask = {
      ...tasks[index],
      ...dto,
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    saveTasks(tasks);
    return updatedTask;
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(200);
    const tasks = loadTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasks(filtered);
  },
  
  toggleTask: async (id: string): Promise<Task> => {
    await delay(100);
    const tasks = loadTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const updatedTask = {
        ...tasks[index],
        completed: !tasks[index].completed,
        updatedAt: new Date().toISOString()
    };
    tasks[index] = updatedTask;
    saveTasks(tasks);
    return updatedTask;
  }
};