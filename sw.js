/* Explicit, complete offline snapshots; partial downloads never replace a working snapshot. */
importScripts('./precache.js');
const markerCache='wanfang-complete',marker=new URL('./offline-ready',self.registration.scope).href;
let downloading;

/* Repair imported photo cards at runtime. Older materials contain empty links to
   Wikimedia thumbnails. Build a stable Commons Special:Redirect URL from the
   original filename instead of depending on a particular thumbnail host/path. */
const photoRepair=`
;(()=>{
  const isImageUrl=url=>/\\.(?:jpe?g|png|webp|gif)(?:[?#]|$)/i.test(url||'');
  const wikimediaFileUrl=raw=>{
    try{
      const u=new URL(raw,location.href);
      if(!/(?:upload|thumb)\\.wikimedia\\.org$/i.test(u.hostname))return u.href;
      const parts=u.pathname.split('/').filter(Boolean);
      const thumbIndex=parts.indexOf('thumb');
      let filename='';
      if(thumbIndex>=0&&parts.length>thumbIndex+3) filename=parts[thumbIndex+3];
      else if(parts.length>=4) filename=parts[parts.length-1];
      if(!filename)return u.href;
      return 'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(decodeURIComponent(filename))+'?width=1400';
    }catch{return raw;}
  };
  const removePreviewNotices=()=>{
    document.querySelectorAll('strong').forEach(strong=>{
      if(!/Gdy podgląd blokuje obraz/i.test(strong.textContent||''))return;
      const parent=strong.parentElement;
      if(!parent)return;
      const html=parent.innerHTML;
      parent.innerHTML=html.replace(/<br\\s*\\/?>?\\s*<strong>Gdy podgląd blokuje obraz:<\\/strong>\\s*kliknij kartę zdjęcia\\.?/gi,'').replace(/<strong>Gdy podgląd blokuje obraz:<\\/strong>\\s*kliknij kartę zdjęcia\\.?/gi,'');
    });
  };
  const repairPhotos=()=>{
    document.querySelectorAll('figure > a[href]').forEach(link=>{
      const raw=link.getAttribute('href')||'';
      if(!isImageUrl(raw))return;
      const href=wikimediaFileUrl(raw);
      const figure=link.closest('figure');
      const caption=figure?.querySelector('figcaption');
      let img=link.querySelector('img');
      if(!img){
        img=document.createElement('img');
        img.alt=((caption?.textContent||'Zdjęcie').replace(/Źródło obrazu:[\\s\\S]*$/i,'').trim()||'Zdjęcie');
        img.loading='lazy';
        img.decoding='async';
        img.referrerPolicy='no-referrer';
        img.style.cssText='display:block;width:100%;height:auto;max-height:70vh;object-fit:cover;border-radius:14px;';
        link.appendChild(img);
      }
      link.href=href;
      if(img.dataset.wanfangSrc!==href){img.dataset.wanfangSrc=href;img.src=href;}
    });
    removePreviewNotices();
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
