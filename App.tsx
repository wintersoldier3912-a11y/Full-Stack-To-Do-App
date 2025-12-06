import React, { useState, useEffect, useCallback } from 'react';
import { Plus, ListTodo, Github } from 'lucide-react';
import { Task, TaskFilter, SortOption, Priority, CreateTaskDTO, UpdateTaskDTO } from './types';
import { taskService } from './services/taskService';
import { TaskItem } from './components/TaskItem';
import { TaskForm } from './components/TaskForm';
import { FilterBar } from './components/FilterBar';
import { Modal } from './components/Modal';
import { Button } from './components/Button';

const App: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>({
    search: '',
    sort: SortOption.CREATED
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  // Fetch Tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks(filter);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    // Debounce the fetch for search input
    const timeoutId = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchTasks]);

  // Handlers
  const handleCreateTask = async (data: CreateTaskDTO) => {
    await taskService.createTask(data);
    setIsModalOpen(false);
    fetchTasks();
  };

  const handleUpdateTask = async (data: CreateTaskDTO) => {
    if (!editingTask) return;
    await taskService.updateTask(editingTask.id, data);
    setEditingTask(undefined);
    setIsModalOpen(false);
    fetchTasks();
  };

  const handleToggleTask = async (id: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      await taskService.toggleTask(id);
    } catch (err) {
      // Revert on error
      fetchTasks();
    }
  };

  const handleDeleteTask = async (id: string) => {
    await taskService.deleteTask(id);
    fetchTasks();
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Derived state for stats
  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ListTodo size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">TaskFlow Pro</h1>
          </div>
          <div className="flex items-center gap-4">
             <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
               <Github size={20} />
             </a>
             <Button onClick={openCreateModal} size="sm" className="hidden sm:flex">
               <Plus size={18} className="mr-1" /> New Task
             </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Welcome / Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Hello, Achiever! 👋</h2>
          <p className="text-slate-600">
            You have <span className="font-bold text-indigo-600">{activeCount}</span> active tasks and <span className="font-bold text-green-600">{completedCount}</span> completed.
          </p>
        </div>

        {/* Filters */}
        <FilterBar filter={filter} onFilterChange={setFilter} />

        {/* List */}
        <div className="space-y-4">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="animate-spin mb-4">
                  <ListTodo size={32} />
                </div>
                <p>Loading your tasks...</p>
             </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                <ListTodo size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No tasks found</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                {filter.search ? "Try adjusting your search or filters to find what you're looking for." : "Get started by adding your first task to the list."}
              </p>
              {!filter.search && (
                <Button onClick={openCreateModal}>Create First Task</Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {tasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onEdit={openEditModal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      <button 
        onClick={openCreateModal}
        className="sm:hidden fixed bottom-6 right-6 h-14 w-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-40 active:scale-95 transition-transform"
      >
        <Plus size={28} />
      </button>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm 
          initialData={editingTask} 
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

    </div>
  );
};

export default App;