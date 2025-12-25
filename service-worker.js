const staticCacheName = 'static-site-v1'
const dynamicCacheName = 'dynamic-site-v1'

const ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/offline.html',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZc10EJ-Vdg-TuiaDsNcThQ8t0.woff2',
]

// install event
self.addEventListener('install', async (event) => {
    const cache = await caches.open(staticCacheName)
    await cache.addAll(ASSETS)
})

// activate event
self.addEventListener('activate', async (event) => {
    const cachesKeysArr = await caches.keys()
    await Promise.all(cachesKeysArr.filter(key => key !== staticCacheName).map(key => caches.delete(key)))
})

// fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(cacheFirst(event.request))
})

async function cacheFirst(request) {
    const cached = await caches.match(request)
    try {
        return cached ?? await fetch(request)

    } catch (e) {
        return networkFirst(request)
    }
}

async function networkFirst(request) {
    const cache = await caches.open(dynamicCacheName)
    try {
        const response = await fetch(request)
        await cache.put(request, response.clone())
        return response
    } catch (e) {
        const cached = await cache.match(request)
        return await caches.match('/offline.html')
    }
}

