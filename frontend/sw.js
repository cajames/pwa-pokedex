
const cacheName = 'static-v5'
const imageCache = 'pokestrites'

// Store Files in Cache
const storeFiles = () => {
	return caches.open(cacheName).then(cache => {
		return cache.addAll([
            '/index.html',
            '/dist/icon.png',
			'/dist/build.js',
		])
	})
}

const clearOtherCaches = () => {
	return caches.keys()
		.then(keys => {
			const deletes = keys.map(name => {
				if (cacheName !== name && name.indexOf('static') === 0) {
					return caches.delete(name)
				}
			})
			return Promise.all(deletes)
		})
}

// Load files from Cache
const loadOfflineFiles = (event) => {
	return caches.match(event.request).then(match => {
		return match || fetch(event.request)
	})
}


const handlePokeImage = (event) => {
	const networkFetch = fetch(event.request)
	event.waitUntil(handleNetworkPokeImage(event, networkFetch))
	return caches.match(event.request).then(match => {
		return match || networkFetch
	})
}

const handleNetworkPokeImage = (event, fetchRequest) => {
	fetchRequest.then(response => {

        const clone = response.clone()

		caches.open(imageCache).then(cache => {
			return cache.put(event.request, clone)
		})
	})
}

// Install Event
self.addEventListener('install', event => {
    console.log('Service worker install event -', cacheName)
    event.waitUntil(storeFiles())
})

self.addEventListener('activate', event => {
    console.log('Service worker activate event -', cacheName)
    event.waitUntil(clearOtherCaches())
})


// Fetch Event
self.addEventListener('fetch', event => {
	const url = new URL(event.request.url)

	if (url.origin === 'https://raw.githubusercontent.com') {
		event.respondWith(handlePokeImage(event))
		return;
	}

	if (url.origin === location.origin && url.pathname === '/') {
		event.respondWith(caches.match('/index.html'))
		return;
	}

	event.respondWith(loadOfflineFiles(event))
})
