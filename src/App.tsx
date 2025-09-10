import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import EditTaskModal from './components/EditTaskModal';
import DailySummaryModal from './components/DailySummaryModal';
import AddTaskModal from './components/AddTaskModal';
import Snackbar from './components/Snackbar';
import OnboardingModal from './components/OnboardingModal';
import { Task, Category } from './types';
import { SCHEDULE_DATA } from './constants';

const initializeTasks = (): Task[] => {
  return SCHEDULE_DATA.map((task, index) => ({
    ...task,
    id: index,
    completed: false,
    notificationsEnabled: true, // Notifications are on by default
  }));
};

const timeToMinutes = (time: string): number => {
    if (time === "00:00") return 24 * 60;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const calculateDuration = (startTime: string, endTime: string): number => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    return endMinutes - startMinutes;
};

const formatMinutes = (totalMinutes: number): string => {
    if (totalMinutes <= 0) return '0 minutos';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let result = '';
    if (hours > 0) {
        result += `${hours} hora${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
        if (result) result += ' ';
        result += `${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
    return result || '0 minutos';
};


const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          return parsedTasks;
        }
      }
    } catch (error) {
      console.error("Error al cargar tareas desde localStorage:", error);
    }
    return initializeTasks();
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('notifiedTaskIds');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error al cargar IDs de tareas notificadas desde localStorage:", error);
    }
    return new Set<number>();
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );
  
  const [lastAction, setLastAction] = useState<{ task: Task; originalIndex: number; type: 'deleted' | 'toggled' } | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error("Error al guardar tareas en localStorage:", error);
    }
  }, [tasks]);

  useEffect(() => {
    try {
        localStorage.setItem('notifiedTaskIds', JSON.stringify(Array.from(notifiedTaskIds)));
    } catch (error) {
        console.error("Error al guardar IDs de tareas notificadas en localStorage:", error);
    }
  }, [notifiedTaskIds]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Request notification permission on initial load
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);
  
  useEffect(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'UPDATE_DATA',
            tasks,
            notifiedTaskIds: Array.from(notifiedTaskIds)
        });
    }
  }, [tasks, notifiedTaskIds]);
  
  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000 * 30);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const isModalOpen = isSummaryModalOpen || isAddTaskModalOpen || !!editingTask || showOnboarding;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSummaryModalOpen, isAddTaskModalOpen, editingTask, showOnboarding]);

  const summaryData = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed);
    const incompleteTasks = tasks.filter(t => !t.completed);
    
    const completedTime = completedTasks.reduce((acc, task) => acc + calculateDuration(task.startTime, task.endTime), 0);
    const totalTime = tasks.reduce((acc, task) => acc + calculateDuration(task.startTime, task.endTime), 0);

    return {
        completedCount: completedTasks.length,
        incompleteCount: incompleteTasks.length,
        totalCount: tasks.length,
        completedTimeFormatted: formatMinutes(completedTime),
        totalTimeFormatted: formatMinutes(totalTime),
        incompleteTasks: incompleteTasks,
    };
  }, [tasks]);

  const handleUndo = useCallback(() => {
    if (!lastAction) return;

    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      if (lastAction.type === 'deleted') {
        newTasks.splice(lastAction.originalIndex, 0, lastAction.task);
      } else if (lastAction.type === 'toggled') {
        // Restore the task to its pre-toggled state
        const taskExists = newTasks.some(t => t.id === lastAction.task.id);
        if (taskExists) {
             return newTasks.map(t => t.id === lastAction.task.id ? lastAction.task : t);
        }
      }
      return newTasks;
    });

    setLastAction(null);
    setSnackbarMessage(null);
  }, [lastAction]);

  const handleDismissSnackbar = useCallback(() => {
    setSnackbarMessage(null);
    setLastAction(null);
  }, []);
  
  const handleToggleTask = useCallback((taskId: number) => {
    let originalTask: Task | undefined;
    let originalIndex = -1;

    setTasks(prevTasks => {
        originalIndex = prevTasks.findIndex(t => t.id === taskId);
        if (originalIndex === -1) return prevTasks;
        
        originalTask = prevTasks[originalIndex];

        return prevTasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
    });

    if (originalTask) {
        setLastAction({ task: originalTask, originalIndex, type: 'toggled' });
        setSnackbarMessage(originalTask.completed ? 'Tarea marcada como incompleta' : 'Tarea completada');
    }
  }, []);
  
  const handleDeleteTask = useCallback((taskId: number) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const taskToDelete = tasks[taskIndex];
    setLastAction({ task: taskToDelete, originalIndex: taskIndex, type: 'deleted' });
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setSnackbarMessage('Tarea eliminada');
  }, [tasks]);


  const handleOpenSummaryModal = useCallback(() => {
    setIsSummaryModalOpen(true);
  }, []);

  const handleCloseSummaryModal = useCallback(() => {
    setIsSummaryModalOpen(false);
  }, []);

  const handleConfirmPrepareNextDay = useCallback(() => {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error("Error al guardar el estado actual de las tareas:", error);
    }

    setTasks(prevTasks =>
      prevTasks.map(task => ({ ...task, completed: false }))
    );
    setNotifiedTaskIds(new Set<number>());
    handleCloseSummaryModal();
  }, [tasks, handleCloseSummaryModal]);
  
  const handleOpenEditModal = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingTask(null);
  }, []);
  
  const handleOpenAddTaskModal = useCallback(() => {
    setIsAddTaskModalOpen(true);
  }, []);

  const handleCloseAddTaskModal = useCallback(() => {
    setIsAddTaskModalOpen(false);
  }, []);
  
  const handleAddTask = useCallback((newTaskData: Omit<Task, 'id' | 'completed'>) => {
    setTasks(prevTasks => {
      const newId = prevTasks.length > 0 ? Math.max(...prevTasks.map(t => t.id)) + 1 : 0;
      const newTask: Task = {
        ...newTaskData,
        id: newId,
        completed: false,
      };
      const updatedTasks = [...prevTasks, newTask];
      
      const sorted = updatedTasks.sort((a, b) => {
          const timeA = timeToMinutes(a.startTime);
          const timeB = timeToMinutes(b.startTime);
          return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
      return sorted;
    });
    handleCloseAddTaskModal();
  }, [sortOrder, handleCloseAddTaskModal]);


  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    handleCloseEditModal();
  }, [handleCloseEditModal]);
  
  const handleToggleSortOrder = useCallback(() => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const sorted = [...tasks].sort((a, b) => {
        const timeA = timeToMinutes(a.startTime);
        const timeB = timeToMinutes(b.startTime);
        return newSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
    setTasks(sorted);
    setSortOrder(newSortOrder);
  }, [tasks, sortOrder]);
  
  const handleToggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleReorder = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  const handleCategoryFilterChange = useCallback((category: Category | null) => {
    setActiveCategory(category);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCompletionFilterChange = useCallback((status: 'all' | 'completed' | 'incomplete') => {
    setCompletionFilter(status);
  }, []);

  const handleCloseOnboarding = useCallback(() => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
  }, []);

  const completedCount = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);
  const totalCount = tasks.length;

  const filteredTasks = useMemo(() => {
    let currentTasks = tasks;

    if (completionFilter === 'completed') {
      currentTasks = currentTasks.filter(task => task.completed);
    } else if (completionFilter === 'incomplete') {
      currentTasks = currentTasks.filter(task => !task.completed);
    }

    if (activeCategory) {
      currentTasks = currentTasks.filter(task => task.category === activeCategory);
    }
    
    if (searchQuery.trim() !== '') {
      currentTasks = currentTasks.filter(task =>
        task.activity.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }

    return currentTasks;
  }, [tasks, activeCategory, searchQuery, completionFilter]);


  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Header
          completedCount={completedCount}
          totalCount={totalCount}
          onPrepareNextDay={handleOpenSummaryModal}
          onOpenAddTaskModal={handleOpenAddTaskModal}
          sortOrder={sortOrder}
          onToggleSortOrder={handleToggleSortOrder}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          activeCategory={activeCategory}
          onCategoryFilterChange={handleCategoryFilterChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          completionFilter={completionFilter}
          onCompletionFilterChange={handleCompletionFilterChange}
        />
        <main className="mt-8">
          <TaskList
            tasks={filteredTasks}
            onToggleTask={handleToggleTask}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleDeleteTask}
            currentTime={currentTime}
            onReorder={handleReorder}
            reorderingEnabled={!activeCategory && !searchQuery.trim()}
          />
        </main>
        <footer className="text-center mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">v1.5.0</p>
        </footer>
      </div>
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={handleCloseEditModal}
          onSave={handleUpdateTask}
        />
      )}
      {isSummaryModalOpen && (
        <DailySummaryModal
          summary={summaryData}
          onClose={handleCloseSummaryModal}
          onConfirm={handleConfirmPrepareNextDay}
        />
      )}
      {isAddTaskModalOpen && (
        <AddTaskModal
          onClose={handleCloseAddTaskModal}
          onAdd={handleAddTask}
        />
      )}
      {snackbarMessage && (
        <Snackbar
          message={snackbarMessage}
          onUndo={handleUndo}
          onDismiss={handleDismissSnackbar}
          key={Date.now()}
        />
      )}
      {showOnboarding && (
        <OnboardingModal onClose={handleCloseOnboarding} />
      )}
    </div>
  );
}

export default App;
