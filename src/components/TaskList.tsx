import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import TaskBlock from './TaskBlock';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
  onToggleNotification: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  currentTime: Date;
  onReorder: (reorderedTasks: Task[]) => void;
  reorderingEnabled?: boolean;
  isAppDragging: boolean;
  onAppDragStart: () => void;
  onAppDragEnd: () => void;
  onSetIsOverDeleteZone: (isOver: boolean) => void;
}

const timeToMinutes = (time: string): number => {
    if (time === "00:00") return 24 * 60;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

interface DragState {
  isDragging: boolean;
  startIndex: number | null;
  draggedTaskId: number | null;
  dragOverIndex: number | null;
  initialEventY: number;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onEditTask, onToggleNotification, onDeleteTask, currentTime, onReorder, reorderingEnabled = true, isAppDragging, onAppDragStart, onAppDragEnd, onSetIsOverDeleteZone }) => {
  const nowInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startIndex: null,
    draggedTaskId: null,
    dragOverIndex: null,
    initialEventY: 0,
  });
  const [currentY, setCurrentY] = useState(0);
  const taskRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const isOverDeleteZone = (x: number, y: number): boolean => {
    const zoneX = 24;
    const zoneSize = 80;
    const zoneY = window.innerHeight - zoneSize - 24;
    
    return x >= zoneX && x <= zoneX + zoneSize && y >= zoneY && y <= zoneY + zoneSize;
  };

  const handleLongPressStart = useCallback((index: number, taskId: number, e: React.MouseEvent | React.TouchEvent) => {
    if (!reorderingEnabled) return;
    e.preventDefault();
    onAppDragStart();
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    const eventY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragState({
      isDragging: true,
      startIndex: index,
      draggedTaskId: taskId,
      dragOverIndex: index,
      initialEventY: eventY,
    });
    setCurrentY(eventY);
  }, [reorderingEnabled, onAppDragStart]);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging) return;
    e.preventDefault();

    const eventY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const eventX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setCurrentY(eventY);

    const isOverZone = isOverDeleteZone(eventX, eventY);
    onSetIsOverDeleteZone(isOverZone);

    if (isOverZone) {
      setDragState(prev => ({ ...prev, dragOverIndex: null }));
    } else {
      const newDragOverIndex = taskRefs.current.findIndex(ref => {
        if (!ref) return false;
        const rect = ref.getBoundingClientRect();
        return eventY >= rect.top && eventY <= rect.bottom;
      });

      if (newDragOverIndex !== -1) {
        setDragState(prev => ({ ...prev, dragOverIndex: newDragOverIndex }));
      }
    }
  }, [dragState.isDragging, onSetIsOverDeleteZone]);


  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging || dragState.startIndex === null) return;
    
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    const eventY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const eventX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;

    if (isOverDeleteZone(eventX, eventY) && dragState.draggedTaskId !== null) {
      onDeleteTask(dragState.draggedTaskId);
    } else if (dragState.dragOverIndex !== null && dragState.startIndex !== dragState.dragOverIndex) {
      const reorderedTasks = [...tasks];
      const [draggedItem] = reorderedTasks.splice(dragState.startIndex, 1);
      reorderedTasks.splice(dragState.dragOverIndex, 0, draggedItem);
      onReorder(reorderedTasks);
    }
    
    onAppDragEnd();
    setDragState({
      isDragging: false,
      startIndex: null,
      draggedTaskId: null,
      dragOverIndex: null,
      initialEventY: 0,
    });
  }, [dragState, tasks, onReorder, onDeleteTask, onAppDragEnd]);

  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [dragState.isDragging, handleDragMove, handleDragEnd]);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">No hay tareas para mostrar.</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Prueba a seleccionar la categoría "Todas" para ver tu lista completa.</p>
      </div>
    );
  }

  const floatingTask = dragState.isDragging && dragState.startIndex !== null ? tasks[dragState.startIndex] : null;
  const draggedElementRef = dragState.isDragging && dragState.startIndex !== null ? taskRefs.current[dragState.startIndex] : null;

  return (
    <div className="space-y-4 relative">
      {floatingTask && draggedElementRef && (
        <div style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 1000,
          left: draggedElementRef.getBoundingClientRect().left,
          top: currentY - (dragState.initialEventY - draggedElementRef.getBoundingClientRect().top),
          width: draggedElementRef.getBoundingClientRect().width,
        }}>
          <div className="transform scale-105 rotate-2 shadow-2xl transition-all duration-300">
            <TaskBlock
              task={floatingTask}
              isCurrent={false}
              onToggle={() => {}}
              onEdit={() => {}}
              onToggleNotification={() => {}}
              onDelete={() => {}}
              index={dragState.startIndex!}
              onLongPressStart={() => {}}
              reorderingEnabled={reorderingEnabled}
            />
          </div>
        </div>
      )}

      {tasks.map((task, index) => {
        const startInMinutes = timeToMinutes(task.startTime);
        const endInMinutes = timeToMinutes(task.endTime);
        const isCurrent = nowInMinutes >= startInMinutes && nowInMinutes < endInMinutes;
        
        let progressPercentage: number | undefined = undefined;
        if (isCurrent) {
            const totalDuration = endInMinutes - startInMinutes;
            const elapsedDuration = nowInMinutes - startInMinutes;
            if (totalDuration > 0) {
                progressPercentage = Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
            }
        }
        
        const isBeingDragged = dragState.isDragging && dragState.startIndex === index;
        const isDropTarget = dragState.isDragging && dragState.dragOverIndex === index && dragState.startIndex !== index;

        return (
          // FIX: The ref callback must not return a value. Changed from an implicit return to a statement inside a block.
          <div key={task.id} ref={el => { taskRefs.current[index] = el; }}>
            <TaskBlock
              task={task}
              index={index}
              isCurrent={isCurrent}
              isDropTarget={isDropTarget}
              isDraggingPlaceholder={isBeingDragged}
              onToggle={() => onToggleTask(task.id)}
              onEdit={() => onEditTask(task)}
              onToggleNotification={() => onToggleNotification(task.id)}
              onDelete={() => onDeleteTask(task.id)}
              // FIX: The inline function for onLongPressStart had an incorrect signature, causing a type error.
              // It now correctly receives index, taskId, and the event. Passing handleLongPressStart directly is cleaner as the signatures match.
              onLongPressStart={handleLongPressStart}
              reorderingEnabled={reorderingEnabled}
              progressPercentage={progressPercentage}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
