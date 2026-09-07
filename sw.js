/* Explicit, complete offline snapshots; partial downloads never replace a working snapshot. */
importScripts('./precache.js');
const markerCache='wanfang-complete',marker=new URL('./offline-ready',self.registration.scope).href;
let downloading;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
async function snapshot(port){
 const name='wanfang-snapshot-'+self.WANFANG_CACHE_VERSION,cache=await caches.open(name);
 let count=0;
 for(const file of self.WANFANG_CACHE_FILES){
  const url=new URL(file,self.registration.scope).href,response=await fetch(url,{cache:'no-store',credentials:'same-origin'});
  if(!response.ok||response.redirected)throw new Error('Nie można pobrać pliku: '+file);
  await cache.put(url,response);count++;port?.postMessage({count,total:self.WANFANG_CACHE_FILES.length});
 }
 const complete=await caches.open(markerCache);await complete.put(marker,new Response(name));
 return name;
}
self.addEventListener('message',event=>{
 if(event.data?.type!=='DOWNLOAD')return;
 const port=event.ports[0];
 event.waitUntil((async()=>{try{if(!downloading)downloading=snapshot(port).finally(()=>{downloading=null;});await downloading;port?.postMessage({done:true});}catch(e){port?.postMessage({error:e.message});}})());
});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 event.respondWith((async()=>{
  const complete=await caches.open(markerCache),saved=await complete.match(marker);
  if(saved){const cache=await caches.open(await saved.text());const exact=await cache.match(event.request,{ignoreSearch:true});if(exact)return exact;if(event.request.mode==='navigate'){const index=await cache.match(new URL('./index.html',scope).href);if(index)return index;}}
  return fetch(event.request);
 })());
});
