const CACHE_NAME = 'focus-jere-cache-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/components/Header.tsx',
  '/components/TaskList.tsx',
  '/components/TaskBlock.tsx',
  '/components/EditTaskModal.tsx',
  '/components/DeleteConfirmationModal.tsx',
  '/components/DailySummaryModal.tsx',
  '/components/AddTaskModal.tsx',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2c0a3251a3.mp3?filename=notification-121855.mp3',
  'https://cdn-icons-png.flaticon.com/512/1001/1001296.png',
  'https://cdn-icons-png.flaticon.com/512/7518/7518748.png'
];

let tasks = [];
let notifiedTaskIds = new Set();
let notificationTimer = null;

const timeToMinutes = (time) => {
    if (!time || typeof time !== 'string') return 0;
    if (time === "00:00") return 24 * 60;
    const parts = time.split(':').map(Number);
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
        return 0;
    }
    return parts[0] * 60 + parts[1];
};

function checkTasksAndNotify() {
  const now = new Date();
  const nowInMinutes = now.getHours() * 60 + now.getMinutes();

  if (!tasks || tasks.length === 0) {
    return;
  }
  
  tasks.forEach(task => {
    if (task.notificationsEnabled && !task.completed && !notifiedTaskIds.has(task.id)) {
      const taskStartInMinutes = timeToMinutes(task.startTime);

      if (nowInMinutes === taskStartInMinutes) {
        self.registration.showNotification(`Es hora de: ${task.activity}`, {
          body: `Esta tarea comienza ahora a las ${task.startTime}.`,
          icon: 'https://cdn-icons-png.flaticon.com/512/7518/7518748.png',
          tag: `task-${task.id}-${task.startTime}`,
          vibrate: [200, 100, 200],
        });
        notifiedTaskIds.add(task.id);
      }
    }
  });
}

function startNotificationTimer() {
    if (notificationTimer) {
        clearInterval(notificationTimer);
    }
    checkTasksAndNotify(); 
    notificationTimer = setInterval(checkTasksAndNotify, 1000 * 60);
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE).catch(error => {
            console.error('Failed to cache URLs:', error);
        });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated. Starting notification checker.');
      startNotificationTimer();
      return self.clients.claim();
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'UPDATE_DATA') {
    tasks = event.data.tasks;
    notifiedTaskIds = new Set(event.data.notifiedTaskIds);
    startNotificationTimer();
  }
});