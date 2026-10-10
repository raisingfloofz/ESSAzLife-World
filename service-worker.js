const CACHE_NAME = "essazlife-world-v3";

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
                    .filter(name =>
    name.startsWith("essazlife-world-") &&
    name !== CACHE_NAME
)
                    .map(name => caches.delete(name))
            );
        })
    );

    self.clients.claim();
});


// FETCH — NETWORK FIRST, OFFLINE FALLBACK
self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    // Only handle requests from ESSAzLife World's own website.
    if (
        new URL(event.request.url).origin !==
        self.location.origin
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {

                if (networkResponse.ok) {

                    const responseCopy =
                        networkResponse.clone();

                    event.waitUntil(
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                return cache.put(
                                    event.request,
                                    responseCopy
                                );
                            })
                    );
                }

                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});