const CACHE_NAME = "content-hub-v1";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./songs.html",
  "./notes.html",
  "./sonstiges.html",
  "./detail.html",
  "./player.html",
  "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/js/app.js",
  "./data/content.json",
  "./assets/text/home-songs.txt",
  "./assets/text/home-notes.txt",
  "./assets/text/home-sonstiges.txt",
  "./assets/text/lyrics-akustische-skizze.txt",
  "./assets/text/lyrics-youtube-demo.txt",
  "./assets/text/lyrics-sammlung.txt",
  "./assets/text/lyrics-notiz-aufnahme.txt",
  "./assets/text/lyrics-projektplan.txt",
  "./assets/text/lyrics-archiv.txt",
  "./assets/text/lyrics-ressourcen.txt",
  "./assets/images/home-songs.png",
  "./assets/images/home-notes.png",
  "./assets/images/home-sonstiges.png",
  "./assets/images/song-akustisch.png",
  "./assets/images/song-youtube.png",
  "./assets/images/song-sammlung.png",
  "./assets/images/note-aufnahme.png",
  "./assets/images/note-plan.png",
  "./assets/images/misc-archiv.png",
  "./assets/images/misc-ressourcen.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/audio/acoustic-loop.wav",
  "./assets/pdfs/song-sheet.pdf",
  "./assets/pdfs/notes-sheet.pdf",
  "./assets/pdfs/misc-sheet.pdf"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (request.mode === "navigate") {
      return caches.match("./index.html");
    }
    throw error;
  }
}
