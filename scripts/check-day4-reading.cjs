const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),ctx={window:{}};
vm.createContext(ctx);
for(const f of ['data/topics.js','data/compendium-topics.js','data/programs.js','data/catalog.js','data/expanded-topics.js'])vm.runInContext(read(f),ctx);
const w=ctx.window,topics=[...new Map([...w.WANFANG_TOPICS,...w.WANFANG_IMPORTED_TOPICS,...w.WANFANG_EXPANDED_TOPICS].map(t=>[t.id,t])).values()];
ctx.item=id=>w.WANFANG_CATALOG.find(c=>c.id===id);ctx.topicFor=c=>topics.find(t=>t.id===c.topicId);ctx.esc=s=>String(s);ctx.button=()=>'<button>Navigation</button>';
const src=read('assets/compendium.js');vm.runInContext(src.slice(src.indexOf('  function trialDayMaterials('),src.indexOf('  function fullDayMaterials(')),ctx);
const day=w.WANFANG_PROGRAMS.find(p=>p.code==='CTF').variants[0].days.find(d=>d.number===4),ids=[...new Set([...day.places,...day.talks])],result=ctx.trialDayMaterials(ids);
assert.equal(result.materials.length,5);assert.deepEqual(Array.from(result.materials,m=>m.key),ids);
assert.equal((result.html.match(/ open>/g)||[]).length,1);assert(!/Część \d+ z \d+/.test(result.html));assert(!result.html.includes('reading-section-anchor'));assert(!/<h[1-6]\b/.test(result.html));
for(const m of result.materials){assert(m.sections.length>0,m.key);for(const s of m.sections)assert(result.html.includes(s.content.replace(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi,'')));}
assert.equal(ctx.trialDayMaterials([...ids,'praktyczne-alipay']).materials.length,6);
assert.equal(ctx.trialDayMaterials([]).html,'');
assert(src.includes("const trial=p.code==='CTF'&&d.number===4;"));
console.log('PASS: CTF day 4 has five independent texts, first open, full prose retained, added topics visible');
