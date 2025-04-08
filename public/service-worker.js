// Nom du cache
const CACHE_NAME = 'heig-schedule-v1';

// Liste des ressources à mettre en cache
const RESOURCES_TO_CACHE = [
    '/',
    '/index.html',
    '/main.js',
    '/style.css',
    '/assets/heig-vd.png',
    'https://chabloz.eu/files/horaires/all'
];

// Installation du service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(RESOURCES_TO_CACHE);
            })
    );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Réponse depuis le cache si disponible
                if (response) {
                    return response;
                }

                // Sinon, faire la requête réseau
                return fetch(event.request)
                    .then(response => {
                        // Ne pas mettre en cache si la réponse n'est pas valide
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Mettre en cache la nouvelle ressource
                        let responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // En cas d'erreur, tenter de servir une page offline si c'est une requête pour une page
                        if (event.request.mode === 'navigate') {
                            return caches.match('/');
                        }
                    });
            })
    );
});