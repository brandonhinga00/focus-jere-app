import React, { useRef, useState } from 'react';
import { Task } from '../types';
import { CATEGORY_STYLES } from '../constants';

interface TaskBlockProps {
  task: Task;
  isCurrent: boolean;
  onToggle: () => void;
  onEdit: (task: Task) => void;
  onDelete: () => void;
  index: number;
  onLongPressStart: (index: number, taskId: number, e: React.MouseEvent | React.TouchEvent) => void;
  isDraggingPlaceholder?: boolean;
  isDropTarget?: boolean;
  reorderingEnabled?: boolean;
  progressPercentage?: number;
}

const SWIPE_THRESHOLD = 80;

const TaskBlock: React.FC<TaskBlockProps> = ({ task, isCurrent, onEdit, onToggle, onDelete, index, onLongPressStart, isDraggingPlaceholder = false, isDropTarget = false, reorderingEnabled = true, progressPercentage }) => {
  const { emoji, activity, startTime, endTime, category, completed } = task;
  
  const [dragState, setDragState] = useState({
    startX: 0,
    currentX: 0,
    isSwiping: false,
    isIntentional: false,
  });
  const [isExiting, setIsExiting] = useState(false);
  const [isLongPressActive, setIsLongPressActive] = useState(false);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressEventRef = useRef<React.MouseEvent | React.TouchEvent | null>(null);
  const lastTap = useRef(0);
  const taskNodeRef = useRef<HTMLDivElement>(null);

  const handlePressDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, [role="button"]')) return;
    
    setIsLongPressActive(false);
    pressEventRef.current = e;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragState({ startX: clientX, currentX: clientX, isSwiping: false, isIntentional: false });

    if (!completed && reorderingEnabled) {
      longPressTimer.current = setTimeout(() => {
        if (pressEventRef.current) {
          setIsLongPressActive(true);
          setDragState(prev => ({ ...prev, isSwiping: false, isIntentional: false })); // Prevent swipe
          onLongPressStart(index, task.id, pressEventRef.current);
        }
      }, 300);
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isLongPressActive) return;
    if (dragState.startX === 0) return;

    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = currentX - dragState.startX;

    if (!dragState.isIntentional && Math.abs(deltaX) > 10) {
      clearLongPressTimer();
      setDragState(prev => ({ ...prev, isSwiping: true, isIntentional: true }));
    }

    if (dragState.isSwiping) {
        // Prevent swiping left on completed tasks
        if (completed && deltaX < 0) {
             setDragState(prev => ({ ...prev, currentX: prev.startX }));
             return;
        }
       setDragState(prev => ({ ...prev, currentX }));
    }
  };
  
  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePressUp = () => {
    clearLongPressTimer();
    
    if (isLongPressActive) {
      setIsLongPressActive(false);
      setDragState({ startX: 0, currentX: 0, isSwiping: false, isIntentional: false });
      return;
    }
    
    if (dragState.isSwiping) {
      const deltaX = dragState.currentX - dragState.startX;
      let actionTaken = false;

      if (deltaX > SWIPE_THRESHOLD) {
        onToggle();
        actionTaken = true;
      } else if (deltaX < -SWIPE_THRESHOLD && !completed) {
        setIsExiting(true);
        setTimeout(() => onDelete(), 150);
        actionTaken = true;
      }
      
      if (!actionTaken && taskNodeRef.current) {
        taskNodeRef.current.style.transition = 'transform 0.3s ease';
        taskNodeRef.current.style.transform = 'translateX(0px)';
      }
    } else {
      const now = new Date().getTime();
      const DOUBLE_PRESS_DELAY = 300;
      if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
        onEdit(task);
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    }

    setDragState({ startX: 0, currentX: 0, isSwiping: false, isIntentional: false });
  };
  
  const handleGestureCancel = () => {
    clearLongPressTimer();
    setIsLongPressActive(false);

    if (dragState.isSwiping) {
      // If a swipe was in progress, animate it back to origin
      if (taskNodeRef.current) {
        taskNodeRef.current.style.transition = 'transform 0.3s ease';
        taskNodeRef.current.style.transform = 'translateX(0px)';
      }
    }

    // Reset state without triggering any actions
    setDragState({ startX: 0, currentX: 0, isSwiping: false, isIntentional: false });
  };

  const deltaX = dragState.isSwiping ? dragState.currentX - dragState.startX : 0;
  const opacity = Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1);
  const transform = `translateX(${deltaX}px)`;

  const categoryColorClass = CATEGORY_STYLES[category].block;
  
  const containerClasses = `
    relative transition-transform duration-300
    ${isDropTarget ? 'pt-2' : ''}
    ${isDraggingPlaceholder ? 'opacity-30' : 'opacity-100'}
  `;

  const taskWrapperClasses = `
    transition-all duration-300
    ${isExiting ? 'opacity-0 scale-90' : (completed ? 'scale-95' : 'scale-100')}
  `;

  const taskBlockClasses = `
    flex items-center p-4 rounded-xl border relative overflow-hidden w-full
    ${categoryColorClass}
    ${completed ? 'opacity-60' : ''}
    ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900 ring-cyan-500 dark:ring-cyan-400' : ''}
    ${(!completed && reorderingEnabled) || completed ? 'cursor-grab' : ''}
  `;
   const textClasses = `
    transition-colors duration-300
    ${completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}
  `;

  return (
    <div className={containerClasses}>
       <div className={taskWrapperClasses}>
          <div 
            className={`absolute inset-0 rounded-xl flex justify-between items-center transition-opacity duration-100 ${deltaX > 0 ? 'bg-green-500' : 'bg-red-600'}`} 
            style={{ opacity: opacity }}
            aria-hidden="true"
          >
            <div className={`flex items-center pl-6 text-white transition-opacity duration-100 ${deltaX < 0 ? 'opacity-100' : 'opacity-0'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
            </div>
            <div className={`flex items-center pr-6 text-white transition-opacity duration-100 ${deltaX > 0 ? 'opacity-100' : 'opacity-0'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </div>
          </div>
          <div 
            ref={taskNodeRef}
            className={taskBlockClasses}
            style={{ transform: transform, transition: dragState.isSwiping ? 'none' : 'transform 0.3s ease' }}
            onMouseDown={handlePressDown}
            onMouseMove={handleMove}
            onMouseUp={handlePressUp}
            onMouseLeave={handleGestureCancel}
            onTouchStart={handlePressDown}
            onTouchMove={handleMove}
            onTouchEnd={handlePressUp}
            onTouchCancel={handleGestureCancel}
          >
            <div className="text-4xl mr-4 select-none">{completed ? '✅' : emoji}</div>
            <div className="flex-grow">
              <p className={`font-bold text-lg ${textClasses}`}>{activity}</p>
              <p className={`text-sm ${completed ? 'text-gray-500 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>{startTime} - {endTime}</p>
            </div>
            
            {isCurrent && !completed && typeof progressPercentage === 'number' && (
              <div 
                  className="absolute bottom-0 left-0 h-1 bg-cyan-500/50 dark:bg-cyan-400/50"
                  style={{ width: `${progressPercentage}%`, transition: 'width 1s linear' }}
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progreso de la tarea actual"
              ></div>
            )}
          </div>
       </div>
    </div>
  );
};

export default TaskBlock;