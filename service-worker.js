const CACHE_NAME = 'japaneseflow-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/characters.html',
  '/quiz.html',
  '/search.html',
  '/song.html',
  '/katakana-song.html',
  '/kanji-levels.html',
  '/stories.html',
  '/story-viewer.html',
  '/viewer.html',
  '/srs-review.html',
  '/style.css',
  '/srs.js',
  '/dashboard.js',
  '/data-loader.js',
  '/characters.js',
  '/quiz.js',
  '/search.js',
  '/stories.js',
  '/story-viewer.js',
  '/viewer.js',
  '/srs-review.js',
  '/flute.mp3',
  '/data/manifest.json',
  '/data/kana/hiragana.json',
  '/data/kana/katakana.json',
  '/data/kanji/n5.json',
  '/data/kanji/n4.json',
  '/data/kanji/n3.json',
  '/data/kanji/n2.json',
  '/data/kanji/n1.json',
  '/data/stories/index.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cache hit or fetch from network
        return response || fetch(event.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        });
      })
      .catch(() => {
        // Fallback for offline mode if needed
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});