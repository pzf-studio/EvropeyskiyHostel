const CACHE_NAME = 'evropeyskiy-hostel-v1.2';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Критические ресурсы для кэширования
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/booking.html',
  '/style.css',
  '/booking.css',
  '/script.js',
  '/booking.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching Static Assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('Service Worker: Removing Old Cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch события
self.addEventListener('fetch', event => {
  // Пропускаем нетрадиционные запросы
  if (!(event.request.url.startsWith('http'))) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэш если есть
        if (response) return response;

        // Иначе делаем сетевой запрос
        return fetch(event.request)
          .then(fetchResponse => {
            // Кэшируем динамические запросы
            if (event.request.url.startsWith('http') && 
                !event.request.url.includes('/api/')) {
              return caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(event.request.url, fetchResponse.clone());
                  return fetchResponse;
                });
            }
            return fetchResponse;
          })
          .catch(() => {
            // Fallback для страниц
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});