import React from 'react';
import { Calendar, Trash2, Edit2 } from 'lucide-react';
import { Priority, Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  
  const priorityBadgeStyles = {
    [Priority.HIGH]: 'bg-red-100 text-red-700 border-red-200',
    [Priority.MED]: 'bg-orange-100 text-orange-700 border-orange-200',
    [Priority.LOW]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  const priorityBorderStyles = {
    [Priority.HIGH]: 'border-l-red-500',
    [Priority.MED]: 'border-l-orange-500',
    [Priority.LOW]: 'border-l-emerald-500',
  };

  const priorityLabels = {
    [Priority.HIGH]: 'High',
    [Priority.MED]: 'Medium',
    [Priority.LOW]: 'Low',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`group relative bg-white p-4 rounded-xl border border-l-4 transition-all duration-200 hover:shadow-md 
      ${task.completed 
        ? 'border-slate-200 bg-slate-50 border-l-slate-300' 
        : `border-slate-200 ${priorityBorderStyles[task.priority]}`
      }
    `}>
      <div className="flex items-start gap-3">
        
        {/* Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-base font-medium truncate ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
              {task.title}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider ${priorityBadgeStyles[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-2 line-clamp-2 ${task.completed ? 'text-slate-400' : 'text-slate-600'}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                <Calendar size={14} />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                {isOverdue && <span className="ml-1">(Overdue)</span>}
              </div>
            )}
            
            {/* Created At (Subtle) */}
            <span className="hidden sm:inline-block text-slate-400">
              Added {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this task?')) {
                onDelete(task.id);
              }
            }}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
