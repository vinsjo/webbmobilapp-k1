/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} sw */
const sw = self;

const cacheName = 'vinsjo-timetracker-pwa-cache';

sw.addEventListener('install', (ev) => {
    ev.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(cacheName);
                await cache.addAll(['/', '/favicon.svg']);
            } catch (err) {
                console.error(err instanceof Error ? err.message : err);
            }
        })()
    );
});

sw.addEventListener('fetch', (ev) => {
    console.log(ev.request);
    ev.respondWith(
        (async () => {
            try {
                let response = await caches.match(ev.request);
                if (!response) response = await fetch(ev.request);
                return response;
            } catch (err) {
                console.error(err instanceof Error ? err.message : err);
                return new Response('Uh oh, an error occurred :(');
            }
        })()
    );
});
