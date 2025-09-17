// service-worker.js
const CACHE = "llaveros-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./style.css",
  "./script.js",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/GATA.jpg",
  "./img/CONTROL.jpg",
  "./img/MUELA.jpg"
  // Si luego agregas más páginas/recursos, añádelos aquí.
];

// Instalar: precache
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

// Activar: limpiar caches viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estrategia: cache-first con actualización en segundo plano
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Evita cachear llamadas no-GET
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((res) => {
          // guarda una copia si es respuesta válida
          if (res && res.status === 200 && res.type === "basic") {
            const resClone = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, resClone));
          }
          return res;
        })
        .catch(() => cached || caches.match("./index.html")); // fallback offline

      return cached || networkFetch;
    })
  );
});
