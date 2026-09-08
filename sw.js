/* Explicit, complete offline snapshots; partial downloads never replace a working snapshot. */
importScripts('./precache.js');
const markerCache='wanfang-complete',marker=new URL('./offline-ready',self.registration.scope).href;
let downloading;

/* Imported materials sometimes contain an empty <a href="...jpg"></a> inside a figure.
   The source link is valid, but without an <img> the browser has nothing to render.
   Append a tiny client-side repair to app.js so every such photo card works everywhere. */
const photoRepair=`
;(()=>{
  const isImageUrl=url=>/\\.(?:jpe?g|png|webp|gif)(?:[?#]|$)/i.test(url||'');
  const cleanCaption=caption=>{
    if(!caption)return;
    caption.innerHTML=caption.innerHTML.replace(/<br\\s*\\/?>\\s*<strong>Gdy podgląd blokuje obraz:<\\/strong>\\s*kliknij kartę zdjęcia\\.?/gi,'');
  };
  const repairPhotos=()=>{
    document.querySelectorAll('figure > a[href]').forEach(link=>{
      const href=link.getAttribute('href')||'';
      if(link.querySelector('img')||!isImageUrl(href))return;
      const figure=link.closest('figure');
      const caption=figure?.querySelector('figcaption');
      const img=document.createElement('img');
      img.src=href;
      img.alt=((caption?.textContent||'Zdjęcie').replace(/Źródło obrazu:[\\s\\S]*$/i,'').trim()||'Zdjęcie');
      img.loading='lazy';
      img.decoding='async';
      img.referrerPolicy='no-referrer';
      img.style.cssText='display:block;width:100%;height:auto;max-height:70vh;object-fit:cover;border-radius:14px;';
      link.appendChild(img);
      cleanCaption(caption);
    });
  };
  const start=()=>{
    repairPhotos();
    new MutationObserver(repairPhotos).observe(document.body||document.documentElement,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
`;

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
async function repairAppResponse(response,url){
 if(!response||!url.pathname.endsWith('/assets/app.js'))return response;
 const headers=new Headers(response.headers);
 headers.delete('content-length');
 headers.set('content-type','application/javascript; charset=utf-8');
 return new Response((await response.text())+'\n'+photoRepair,{status:response.status,statusText:response.statusText,headers});
}
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 event.respondWith((async()=>{
  const complete=await caches.open(markerCache),saved=await complete.match(marker);
  try{return await repairAppResponse(await fetch(event.request),url);}
  catch(error){
   if(saved){const cache=await caches.open(await saved.text());const exact=await cache.match(event.request,{ignoreSearch:true});if(exact)return repairAppResponse(exact,url);if(event.request.mode==='navigate'){const index=await cache.match(new URL('./index.html',scope).href);if(index)return index;}}
   throw error;
  }
 })());
});
