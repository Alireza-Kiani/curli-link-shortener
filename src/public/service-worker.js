const cacheName = 'curli-v1';
const staticAssets = [
    './',
    './images/favicon-blue.png',
    './images/favicon-white.png',
    './images/favicon.png',
    './images/tail-spin.svg',
    './index.html',
    './404.html',
    './js/functions.js',
    './style/clouds.css',
    './style/style.css'
];

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);


    const cachedResponse = await cache.match(req);


    return cachedResponse || fetch(req);

}

self.addEventListener('install', async event => {

    const cache = await caches.open(cacheName);


    await cache.addAll(staticAssets);


});

self.addEventListener('fetch', event => {
    const req = event.request;
    event.respondWith(cacheFirst(req));
});

