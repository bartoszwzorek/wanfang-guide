const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=require('path').resolve(__dirname,'..'),c={window:{}};vm.createContext(c);
const index=fs.readFileSync(root+'/index.html','utf8');
const files=[...index.matchAll(/<script defer src="(data\/[^"]+)"/g)].map(m=>m[1]);
files.forEach(p=>vm.runInContext(fs.readFileSync(root+'/'+p,'utf8'),c,{filename:p}));
const w=c.window,ts=[...new Map([...w.WANFANG_TOPICS,...w.WANFANG_IMPORTED_TOPICS,...w.WANFANG_EXPANDED_TOPICS].map(t=>[t.id,t])).values()],map=new Map(ts.map(t=>[t.id,t]));
assert.equal(w.WANFANG_CTF_REVIEWED.length,31);
for(const t of ts.filter(t=>t.updated==='2026-09-10')){
 assert.equal(new Set(t.sections.map(s=>s.id)).size,t.sections.length,t.id+' duplicate chapter');
 for(const s of t.sections){assert(s.content.trim(),t.id+' empty');for(const m of s.content.matchAll(/href="#topic\/([^"/]+)(?:\/([^"/]+))?"/g)){assert(map.has(m[1]),t.id+' broken topic '+m[1]);if(m[2])assert(map.get(m[1]).sections.some(s=>s.id===m[2]),'broken chapter '+m[0]);}}
}
const sources=new Set(w.WANFANG_CTF_REVIEWED.flatMap(t=>t.sourceDocuments).filter(s=>s.endsWith('.docx')));assert.equal(sources.size,32);
for(const item of w.WANFANG_CATALOG.filter(t=>t.review==='Redakcja CTF 2026-09-10')){assert(map.has(item.topicId),'catalog '+item.id);if(item.sectionId)assert(map.get(item.topicId).sections.some(s=>s.id===item.sectionId),'catalog chapter '+item.id);}
const catIds=new Set(w.WANFANG_CATALOG.map(t=>t.id));assert.equal(catIds.size,w.WANFANG_CATALOG.length);
for(const v of w.WANFANG_PROGRAMS.find(p=>p.code==='CTF').variants)for(const d of v.days)for(const id of [...d.places,...d.talks])assert(catIds.has(id),'day topic '+id);
assert(map.get('opera-syczuanska').sections[0].content.includes('Opera syczuańska'));
assert(!map.get('opera-syczuanska').sections[0].content.includes('Dujiangyan'));
assert(!map.get('jadeitowy-budda').sections.find(s=>s.title.includes('Główna Sala')).content.includes('Budda Przeszłości'));
assert(!map.get('emerytury').sections.map(s=>s.content).join('').includes('1555'));
for(const id of ['wenshu','wuhou','pandy','liziba','ciqikou','jadeitowy-budda'])assert(map.get(id).sections.map(s=>s.title+' '+s.content.replace(/<[^>]+>/g,' ')).join(' ').split(/\s+/).length>1500,id+' narrative lost');
for(const id of ['szczegoly-huiink','szczegoly-brush','szczegoly-inkstone'])assert(map.get('tunxi').sections.some(s=>s.id===id),'craft lost');
const cache={self:{}};vm.createContext(cache);vm.runInContext(fs.readFileSync(root+'/precache.js','utf8'),cache);
for(const p of ['data/ctf-revision.js','data/ctf-revision-links.js','assets/ctf-notes.css'])assert(cache.self.WANFANG_CACHE_FILES.includes(p),'offline asset '+p);
fs.writeFileSync(root+'/editorial/ctf-validation.json',JSON.stringify({topics:ts.length,newNarratives:31,sourceDocuments:sources.size,catalogue:w.WANFANG_CATALOG.length,checks:'source coverage, content lengths, catalogue and internal links, programme references, factual corrections, retained craft chapters, offline manifest'},null,2));
console.log('PASS: 31 narratives from 32 documents; links, CTF days, corrections, retained chapters and offline assets.');
