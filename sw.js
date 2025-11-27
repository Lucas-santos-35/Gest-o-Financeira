const CACHE_NAME = 'delivery-fin-v2'; // Versão atualizada do cache
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
    // Adicione os caminhos dos ícones aqui se existirem:
    // '/icon-192x192.png',
    // '/icon-512x512.png'
];

// 📦 Instalação: Armazena os arquivos essenciais no cache
self.addEventListener('install', event => {
    console.log('Service Worker: Evento de instalação recebido.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Arquivos em cache.');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Falha ao cachear arquivos:', error);
            })
    );
});

// 🌐 Fetch: Intercepta requisições e serve do cache (cache-first strategy)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna do cache se encontrado
                if (response) {
                    return response;
                }
                // Faz a requisição normal se não estiver no cache
                return fetch(event.request);
            })
    );
});

// 🧹 Ativação: Limpa caches antigos (para garantir que o usuário obtenha a versão mais recente)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Deletando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
