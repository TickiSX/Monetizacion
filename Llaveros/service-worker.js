const CACHE_NAME = "llaveros-pwa-v2";

// Archivos para precache
const PRECACHE_ASSETS = [
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./img/gata.jpg",
  "./img/control.jpg",
  "./img/muela.jpg",
  "./img/icon-192.png",
  "./img/icon-512.png"
];

// Instalación → precache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// Activación → limpiar caches viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
  self.clients.claim();
});

// Fetch → cache-first para assets, network-first para HTML
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

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

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  const fresh = await fetch(req);
  const cache = await caches.open(CACHE_NAME);
  cache.put(req, fresh.clone());
  return fresh;
}
