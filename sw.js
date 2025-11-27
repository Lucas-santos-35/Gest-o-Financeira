const CACHE_NAME = 'delivery-fin-v3'; // Versão atualizada do cache
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
    // Se você estiver usando ícones, adicione os caminhos aqui
    // '/icon-192x192.png',
    // '/icon-512x512.png'
];

// 📦 Instalação: Armazena os arquivos essenciais no cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Arquivos em cache.');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('SW: Falha ao cachear arquivos:', error);
            })
    );
});

// 🌐 Fetch: Estratégia Cache-First
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// 🧹 Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('SW: Deletando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
