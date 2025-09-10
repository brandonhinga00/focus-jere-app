import React, { useRef } from 'react';
import { Task } from '../types';
import { CATEGORY_STYLES } from '../constants';

interface TaskBlockProps {
  task: Task;
  isCurrent: boolean;
  onToggle: () => void;
  onEdit: (task: Task) => void;
  onToggleNotification: () => void;
  onDelete: () => void;
  index: number;
  onLongPressStart: (index: number, taskId: number, e: React.MouseEvent | React.TouchEvent) => void;
  isDraggingPlaceholder?: boolean;
  isDropTarget?: boolean;
  reorderingEnabled?: boolean;
  progressPercentage?: number;
}

const CheckboxIcon: React.FC<{ checked: boolean }> = ({ checked }) => (
  <div
    className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all duration-300
    ${checked ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'}`}
  >
    {checked && (
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    )}
  </div>
);

const EditIcon: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
    <button
      onClick={onClick}
      aria-label="Editar tarea"
      className="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all duration-300 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
      </svg>
    </button>
);

const NotificationIcon: React.FC<{ enabled: boolean; onClick: (e: React.MouseEvent) => void }> = ({ enabled, onClick }) => (
  <button
    onClick={onClick}
    aria-label={enabled ? "Desactivar notificaciones" : "Activar notificaciones"}
    className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all duration-300 ${enabled ? 'bg-yellow-500 hover:bg-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-500' : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'}`}
  >
    {enabled ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M13.707 14.707a1 1 0 01-1.414 0L10 12.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 11 6.293 8.707a1 1 0 011.414-1.414L10 9.586l2.293-2.293a1 1 0 011.414 1.414L11.414 11l2.293 2.293a1 1 0 010 1.414zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd" />
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
      </svg>
    )}
  </button>
);

const DeleteIcon: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
    <button
      onClick={onClick}
      aria-label="Eliminar tarea"
      className="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all duration-300 bg-gray-300 hover:bg-red-500 dark:bg-gray-600 dark:hover:bg-red-600 group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
      </svg>
    </button>
);


const TaskBlock: React.FC<TaskBlockProps> = ({ task, isCurrent, onEdit, onToggle, onToggleNotification, onDelete, index, onLongPressStart, isDraggingPlaceholder = false, isDropTarget = false, reorderingEnabled = true, progressPercentage }) => {
  const { emoji, activity, startTime, endTime, category, completed, notificationsEnabled } = task;
  const categoryColorClass = CATEGORY_STYLES[category].block;

  // FIX: Using ReturnType<typeof setTimeout> for environment-agnostic timer ID typing.
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressEventRef = useRef<React.MouseEvent | React.TouchEvent | null>(null);

  const handlePressDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, [role="button"]')) {
      return;
    }
    pressEventRef.current = e;
    longPressTimer.current = setTimeout(() => {
      if (pressEventRef.current) {
        onLongPressStart(index, task.id, pressEventRef.current);
      }
    }, 300);
  };

  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePressUp = () => {
    clearLongPressTimer();
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (pressEventRef.current) {
      const startX = 'touches' in pressEventRef.current ? pressEventRef.current.touches[0].clientX : pressEventRef.current.clientX;
      const startY = 'touches' in pressEventRef.current ? pressEventRef.current.touches[0].clientY : pressEventRef.current.clientY;
      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const distance = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));

      if (distance > 10) { 
        clearLongPressTimer();
      }
    }
  };


  const containerClasses = `
    flex items-center p-4 rounded-xl border transition-all duration-300 relative overflow-hidden
    ${categoryColorClass}
    ${completed ? 'opacity-50 scale-95' : 'scale-100'}
    ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900 ring-cyan-500 dark:ring-cyan-400' : ''}
    ${isDropTarget ? 'border-t-4 border-t-cyan-500 dark:border-t-cyan-400' : ''}
    ${isDraggingPlaceholder ? 'opacity-30' : 'opacity-100'}
    ${!completed && reorderingEnabled ? 'cursor-grab' : ''}
  `;

  const textClasses = `
    transition-all duration-300
    ${completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}
  `;
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };
  
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };
  
  const handleNotificationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleNotification();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };


  return (
    <div 
      className={containerClasses}
      onMouseDown={handlePressDown}
      onMouseUp={handlePressUp}
      onMouseLeave={handlePressUp}
      onTouchStart={handlePressDown}
      onTouchEnd={handlePressUp}
      onTouchMove={handleMove}
    >
      <div className="text-4xl mr-4">{completed ? '✅' : emoji}</div>
      <div className="flex-grow">
        <p className={`font-bold text-lg ${textClasses}`}>{activity}</p>
        <p className={`text-sm ${completed ? 'text-gray-500 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>{startTime} - {endTime}</p>
      </div>
      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        {!completed ? (
          <>
            <NotificationIcon enabled={notificationsEnabled} onClick={handleNotificationClick} />
            <EditIcon onClick={handleEditClick} />
            <DeleteIcon onClick={handleDeleteClick} />
          </>
        ) : (
          <div className="w-28 h-8"></div>
        )}
        <div onClick={handleToggleClick} role="button" aria-label={`Marcar ${activity} como ${completed ? 'incompleta' : 'completada'}`}>
            <CheckboxIcon checked={completed} />
        </div>
      </div>
       {isCurrent && !completed && typeof progressPercentage === 'number' && (
        <div 
            className="absolute bottom-0 left-0 h-1 bg-cyan-500/50 dark:bg-cyan-400/50 transition-all duration-500 ease-linear"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso de la tarea actual"
        ></div>
      )}
    </div>
  );
};

export default TaskBlock;