# Snippets

---

## Register the Service Worker

```html
<!-- Register the ServiceWorker -->
<script>
    if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js')
    }
</script>
```

And create the file.

---

## Make it run offline

In serviceworker.js

```js
const cacheName = 'static-v1'

const storeFiles = () => {
	return caches.open(cacheName).then(cache => {
		return cache.addAll([
			'/index.html',
			'/dist/build.js',
		])
	})
}

// Install Event
self.addEventListener('install', event => {
    console.log('Service worker install event -', cacheName)
    event.waitUntil(storeFiles())
})

// Fetch Event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    )
})
```

---

## Tell the browser it can be native

Add a manifest.json
```json
{
	"name": "Pokédex",
	"start_url": "/",
	"scope": "/",
	"display": "standalone",
	"theme_color": "#cc1f1a",
	"background_color": "#cc1f1a",
	"icons": [
		{
			"src": "/src/assets/icon.png",
			"sizes": "512x512",
			"type": "image/png"
		}
	]
}
```

to index.html
```html
<link rel="manifest" href="/manifest.json">
```
