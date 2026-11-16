// Garde une copie de l'appli pour qu'elle s'ouvre même sans réseau (réseau d'abord, copie sinon).
const CACHE = 'routines-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin && u.hostname !== 'cdnjs.cloudflare.com') return;
  e.respondWith(
    fetch(r).then((res) => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy)); }
      return res;
    }).catch(() => caches.match(r, { ignoreSearch: true }))
  );
});
