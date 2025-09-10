import React from 'react';
import { Category } from '../types';
import { CATEGORY_STYLES } from '../constants';
import FilterDropdown from './FilterDropdown';

interface HeaderProps {
  completedCount: number;
  totalCount: number;
  onPrepareNextDay: () => void;
  onOpenAddTaskModal: () => void;
  sortOrder: 'asc' | 'desc';
  onToggleSortOrder: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeCategory: Category | null;
  onCategoryFilterChange: (category: Category | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  completionFilter: 'all' | 'completed' | 'incomplete';
  onCompletionFilterChange: (status: 'all' | 'completed' | 'incomplete') => void;
}

const Header: React.FC<HeaderProps> = ({ completedCount, totalCount, onPrepareNextDay, onOpenAddTaskModal, sortOrder, onToggleSortOrder, theme, onToggleTheme, activeCategory, onCategoryFilterChange, searchQuery, onSearchChange, completionFilter, onCompletionFilterChange }) => {
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const categoryOptions = [
    { value: null, label: 'Todas', activeStyle: 'bg-cyan-500 text-white border-cyan-500' },
    ...Object.values(Category).map((cat: Category) => ({
      value: cat,
      label: cat,
      activeStyle: CATEGORY_STYLES[cat].buttonActive,
    }))
  ];

  const statusOptions = [
    { value: 'all', label: 'Todas', activeStyle: 'bg-cyan-500 text-white border-cyan-500' },
    { value: 'incomplete', label: 'Incompletas', activeStyle: 'bg-yellow-500 text-white border-yellow-500' },
    { value: 'completed', label: 'Completas', activeStyle: 'bg-green-500 text-white border-green-500' },
  ];

  return (
    <header className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-300">Focus Block</h1>
        <button
          onClick={onToggleTheme}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors duration-300"
          aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      <div>
          <button
            onClick={onPrepareNextDay}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300 text-center"
          >
            Preparar Día
          </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            <span>Progreso Diario</span>
            <span>{completedCount} / {totalCount} Bloques</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-cyan-500 dark:bg-cyan-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
            <input
                type="search"
                placeholder="Buscar actividad..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-200 dark:bg-gray-700 border border-transparent rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-300"
                aria-label="Buscar tareas por actividad"
            />
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex w-full gap-4">
            <div className="flex-1">
              <FilterDropdown
                label="Categoría"
                options={categoryOptions}
                selectedValue={activeCategory}
                onSelect={onCategoryFilterChange}
              />
            </div>
            <div className="flex-1">
              <FilterDropdown
                label="Estado"
                options={statusOptions}
                selectedValue={completionFilter}
                onSelect={onCompletionFilterChange}
              />
            </div>
          </div>
            
          <div className="flex items-center justify-between gap-4">
            <button
                onClick={onOpenAddTaskModal}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-10 w-10 rounded-lg transition-colors duration-300 flex items-center justify-center flex-shrink-0"
                aria-label="Agregar nueva tarea"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>
            
            <button
              onClick={onToggleSortOrder}
              className="flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              aria-label={`Ordenar por hora ${sortOrder === 'asc' ? 'ascendente' : 'descendente'}`}
            >
              <span>Hora</span>
              {sortOrder === 'asc' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;