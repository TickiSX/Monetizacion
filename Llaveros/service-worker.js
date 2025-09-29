const CACHE_NAME = "llaveros-pwa-v2";

// Archivos esenciales para precache
const PRECACHE_ASSETS = [
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./img/GATA.jpg",
  "./img/CONTROL.jpg",
  "./img/MUELA.jpg",
  "./img/icon-192.png",
  "./img/icon-512.png"
];

// Instalación → guarda en caché los archivos básicos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación → limpia caches viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Estrategia de fetch
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Para páginas HTML → network first
  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Para CSS, JS, imágenes, etc → cache first
  event.respondWith(cacheFirst(req));
});

// Estrategia: network first (HTML)
async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    return caches.match(req) || caches.match("./index.html");
  }
}

// Estrategia: cache first (assets)
async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  const fresh = await fetch(req);
  const cache = await caches.open(CACHE_NAME);
  cache.put(req, fresh.clone());
  return fresh;
}
