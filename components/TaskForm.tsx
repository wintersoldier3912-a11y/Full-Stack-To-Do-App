import React, { useState, useEffect } from 'react';
import { CreateTaskDTO, Priority, Task } from '../types';
import { Button } from './Button';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: CreateTaskDTO) => Promise<void>;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.LOW);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      // Convert ISO to YYYY-MM-DD for input
      if (initialData.dueDate) {
        setDueDate(initialData.dueDate.split('T')[0]);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
      });
    } catch (err) {
      setError('Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { 
      label: 'Low', 
      value: Priority.LOW, 
      activeClass: 'bg-emerald-600 text-white border-emerald-600'
    },
    { 
      label: 'Medium', 
      value: Priority.MED, 
      activeClass: 'bg-orange-500 text-white border-orange-500'
    },
    { 
      label: 'High', 
      value: Priority.HIGH, 
      activeClass: 'bg-red-600 text-white border-red-600'
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="e.g., Buy Groceries"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="Details about the task..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Priority
          </label>
          <div className="flex rounded-md shadow-sm" role="group">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPriority(option.value)}
                className={`flex-1 px-4 py-2 text-sm font-medium border first:rounded-l-md last:rounded-r-md focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${
                  priority === option.value
                    ? option.activeClass
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm h-[38px]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
