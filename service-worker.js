const CACHE_NAME = "essazlife-world-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./ESSAzLife.World.Icon.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png",

    // Handler Edition
    "./apps/handler/index.html",
    "./apps/handler/style.css",
    "./apps/handler/script.js",

    // PlayMode
    "./apps/playmode/index.html",
    "./apps/playmode/style.css",
    "./apps/playmode/script.js",

    // Chorez
    "./apps/chorez/index.html",
    "./apps/chorez/style.css",
    "./apps/chorez/script.js"
];


// INSTALL
self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();
});


// ACTIVATE
self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(cacheNames => {

            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );

    self.clients.claim();
});


// FETCH
self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(networkResponse => {

                        const responseCopy =
                            networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(
                                    event.request,
                                    responseCopy
                                );
                            });

                        return networkResponse;
                    });
            })
    );
});