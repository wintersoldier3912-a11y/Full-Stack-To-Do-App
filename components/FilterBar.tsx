import React from 'react';
import { Filter, SortAsc, Search, CheckCircle } from 'lucide-react';
import { Priority, SortOption, TaskFilter } from '../types';

interface FilterBarProps {
  filter: TaskFilter;
  onFilterChange: (newFilter: TaskFilter) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filter, onFilterChange }) => {
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    let completed: boolean | undefined = undefined;
    if (val === 'completed') completed = true;
    if (val === 'active') completed = false;
    onFilterChange({ ...filter, completed });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onFilterChange({ ...filter, priority: val ? (val as Priority) : undefined });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filter, sort: e.target.value as SortOption });
  };

  const statusValue = filter.completed === undefined ? 'all' : filter.completed ? 'completed' : 'active';

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-4">
      
      {/* Search */}
      <div className="relative flex-grow md:min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filter.search}
          onChange={handleSearchChange}
          className="pl-10 w-full rounded-lg border border-slate-300 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-slate-500 hidden md:block" />
          <select
            className="rounded-lg border border-slate-300 py-2 pl-2 pr-8 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
            onChange={handleStatusChange}
            value={statusValue}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-slate-500 hidden md:block" />
          <select
            className="rounded-lg border border-slate-300 py-2 pl-2 pr-8 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
            onChange={handlePriorityChange}
            value={filter.priority || ''}
          >
            <option value="">All Priorities</option>
            <option value={Priority.HIGH}>High</option>
            <option value={Priority.MED}>Medium</option>
            <option value={Priority.LOW}>Low</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <SortAsc size={16} className="text-slate-500 hidden md:block" />
          <select
            className="rounded-lg border border-slate-300 py-2 pl-2 pr-8 text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
            onChange={handleSortChange}
            value={filter.sort}
          >
            <option value={SortOption.CREATED}>Newest</option>
            <option value={SortOption.DUE_DATE}>Due Date</option>
            <option value={SortOption.PRIORITY}>Priority (High First)</option>
          </select>
        </div>
      </div>
    </div>
  );
};