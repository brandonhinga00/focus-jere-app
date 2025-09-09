import React from 'react';
import { Task } from '../types';

interface SummaryData {
  completedCount: number;
  incompleteCount: number;
  totalCount: number;
  completedTimeFormatted: string;
  totalTimeFormatted: string;
  incompleteTasks: Task[];
}

interface DailySummaryModalProps {
  summary: SummaryData;
  onClose: () => void;
  onConfirm: () => void;
}

const DailySummaryModal: React.FC<DailySummaryModalProps> = ({ summary, onClose, onConfirm }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="summary-title" className="text-2xl font-bold mb-4 text-cyan-600 dark:text-cyan-300">Resumen del Día</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Tareas</p>
                <p className="text-2xl font-bold">{summary.totalCount}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-300">Completadas</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-200">{summary.completedCount}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/40 p-3 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-300">Incompletas</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-200">{summary.incompleteCount}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg col-span-2 md:col-span-3">
                 <p className="text-sm text-gray-500 dark:text-gray-400">Tiempo de Foco</p>
                <p className="text-lg font-semibold">{summary.completedTimeFormatted} / <span className="text-base font-normal">{summary.totalTimeFormatted}</span></p>
            </div>
        </div>
        
        {summary.incompleteTasks.length > 0 && (
          <div className="flex-1 overflow-y-auto mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Tareas Pendientes:</h3>
            <ul className="space-y-2 pr-2">
              {summary.incompleteTasks.map(task => (
                <li key={task.id} className="text-sm bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md flex items-center">
                   <span className="mr-2">{task.emoji}</span> 
                   <span className="flex-grow">{task.activity}</span>
                   <span className="text-xs text-gray-500 dark:text-gray-400">{task.startTime} - {task.endTime}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Al continuar, marcarás todas las tareas como incompletas para el nuevo día.</p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                Confirmar y Preparar Día
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummaryModal;
