// The cache name is versioned. When you deploy a new version of the app,
// increment this version number. This will trigger the 'activate' event,
// which will clean up old caches and ensure users get the new files.
const CACHE_NAME = 'focus-jere-cache-v1.5.0';

// These are the core files that make up the "application shell".
// They are cached on install.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/',
  'https://cdn-icons-png.flaticon.com/512/7518/7518748.png'
];

// IMPORTANT: User data (tasks, progress, etc.) is NOT stored by the service worker.
// It is safely stored in localStorage by the main application thread (App.tsx).
// This service worker only holds a temporary, in-memory copy of task data
// received via messages, solely for the purpose of scheduling notifications.
// This data is not persisted by the service worker and is refreshed by the app.
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

// When the service worker is installed, cache the application shell files.
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

// Serve requests from the cache first, falling back to the network.
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

// When the new service worker activates, delete any old caches.
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
      // Take control of all open clients immediately.
      return self.clients.claim();
    })
  );
});

// Listen for messages from the main app to update task data for notifications.
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'UPDATE_DATA') {
    tasks = event.data.tasks;
    notifiedTaskIds = new Set(event.data.notifiedTaskIds);
    startNotificationTimer();
  }
});