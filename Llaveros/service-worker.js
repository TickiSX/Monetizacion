const CACHE_NAME = "llaveros-cache-v1";
const urlsToCache = [
  "./index.html",
  "./style.css",
  "./script.js",
  "./img/GATA.jpg",
  "./img/CONTROL.jpg",
  "./img/MUELA.jpg",
  "./img/icon-192.png",
  "./img/icon-512.png"
];

// Instalación y cacheo
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activación
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(name => {
        if (name !== CACHE_NAME) return caches.delete(name);
      })
    ))
  );
});

// Fetch (offline)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
