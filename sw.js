const CACHE_NAME = 'cryptoshield-v3.0';
const urlsToCache = [
    '/',
    'index.html',
    'manifest.json',
    'assets/style.css',
    'assets/icon.png',
    'engine/crypto.js',
    'engine/obfuscator.js',
    'engine/antivm.js',
    'engine/ui.js'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Ativação
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepta requests para funcionar offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache first, network second
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

// Background sync para downloads (experimental)
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundUpdate());
    }
});

function doBackgroundUpdate() {
    // Simula update de cache
    return new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });
}

// Notificações push (se forem implementadas)
self.addEventListener('push', (event) => {
    const payload = event.data?.text() || 'Criptografia concluída!';
    event.waitUntil(
        self.registration.showNotification('CryptoShield', {
            body: payload,
            icon: 'assets/icon.png',
            badge: 'assets/icon.png'
        })
    );
});
