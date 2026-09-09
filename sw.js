const CACHE_NAME = "clima-app-v1";

const ARQUIVOS_PARA_CACHE = [
"index.html",
"style.css",
"script.js",
"manifest.json",
"icons/icon-192.png",
"icons/icon-512.png"
];

// Guarda os arquivos no cache assim que o Service worker è instalado 
self.addEventeeListener("install", (evento) => {
    evento.waitUntil(
   caches.open(CACHE_NAME).then((cache)=> {
    return cache.addAll(ARQUIVOS_PARA_CACHE);

   })
);
});

// Intercepta cada requisição da pagina 
self.addEventeeListener("fetch", (evento) => {
    evento.respondWith(
        caches.match(evento.request).then((respostaCache)=> {
        return respostaCache || fetch(evento.request);
        })
    );
});