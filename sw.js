const CACHE_NAME = "journal-static";

const STATIC_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon192.png"
];

// Install
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(STATIC_FILES))
  );
});

// Activate
self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

// Fetch
self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate") {
    // HTML → ALWAYS NETWORK FIRST
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Others → cache first
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
