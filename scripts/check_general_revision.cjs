const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),w={};const ctx=vm.createContext({window:w});
for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/src="(data\/[^" ]+\.js)"/g))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
const topics=[...new Map([...(w.WANFANG_TOPICS||[]),...(w.WANFANG_IMPORTED_TOPICS||[]),...(w.WANFANG_EXPANDED_TOPICS||[])].map(t=>[t.id,t])).values()],map=new Map(topics.map(t=>[t.id,t]));
const m=JSON.parse(fs.readFileSync(path.join(root,'editorial/general-revision-manifest.json')));const errors=[];
for(const id of m.dedicated){const c=w.WANFANG_CATALOG.find(c=>c.id===id);if(!c||c.topicId!==id||c.sectionId)errors.push('Wrong catalog '+id);const t=map.get(id);if(!t||t.sections.length<2)errors.push('Missing narrative '+id);}
for(const t of topics){const ids=t.sections.map(s=>s.id);if(new Set(ids).size!==ids.length)errors.push('Duplicate sections '+t.id);}
for(const c of w.WANFANG_CATALOG){const t=map.get(c.topicId);if(c.topicId&&!t)errors.push('Missing target '+c.id+' => '+c.topicId);if(t&&c.sectionId&&!t.sections.some(s=>s.id===c.sectionId))errors.push('Missing section '+c.id+' => '+c.sectionId);}
for(const id of m.dedicated.concat(m.supplemented)){const t=map.get(id);for(const s of t.sections)for(const [,target,section]of s.content.matchAll(/href="#topic\/([^"/]+)(?:\/([^"]+))?"/g)){if(!map.has(target))errors.push('Broken link '+id+' => '+target);if(section&&!map.get(target)?.sections.some(s=>s.id===section))errors.push('Broken section link '+id);}}
const fmt=w.WANFANG_PRONUNCIATION.format;
for(const [input,want]of [['Pudong','Pudong [pu-dung]'],['Mao Zedong','Mao Zedong [mao dze-dung]'],['Pudong [pu-dung]','Pudong [pu-dung]'],['<a href="#topic/Pudong">Pudong</a>','<a href="#topic/Pudong">Pudong [pu-dung]</a>']])if(fmt(input)!==want)errors.push('Pronunciation '+input+' => '+fmt(input));
const report={date:'2026-09-11',topicCount:topics.length,catalogCount:w.WANFANG_CATALOG.length,errors,wordCounts:Object.fromEntries([...m.dedicated,...m.supplemented,...m.preservedZipNarratives].map(id=>[id,map.get(id).sections.map(s=>s.content.replace(/<[^>]+>/g,' ')).join(' ').split(/\s+/).length]))};
fs.writeFileSync(path.join(root,'editorial/general-validation.json'),JSON.stringify(report,null,2));fs.writeFileSync('/tmp/general-topics.json',JSON.stringify(topics));
console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
