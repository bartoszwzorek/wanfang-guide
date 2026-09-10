/* Connect reviewed narratives to the existing catalogue and saved topic routes. */
(()=>{
 const reviewed=window.WANFANG_CTF_REVIEWED;
 const expanded=window.WANFANG_EXPANDED_TOPICS;
 const previous=new Map([...(window.WANFANG_TOPICS||[]),...(window.WANFANG_IMPORTED_TOPICS||[]),...expanded].map(t=>[t.id,t]));
 const cat=window.WANFANG_CATALOG;
 const strip=s=>String(s).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const upsert=t=>{const i=expanded.findIndex(x=>x.id===t.id);if(i<0)expanded.push(t);else expanded[i]=t;};
 reviewed.forEach(upsert);
 const byId=id=>expanded.find(t=>t.id===id)||previous.get(id);
 function bind(id,topicId,sectionId=null){const c=cat.find(c=>c.id===id);if(c){c.topicId=topicId;c.sectionId=sectionId;c.review='Redakcja CTF 2026-09-10';}}
 function entry(t){if(!cat.some(c=>c.id===t.id))cat.push({id:t.id,title:t.title,region:t.city,programs:['CTF','CHT','CJA'],topicId:t.id,sectionId:null,outline:t.sections.map(s=>s.title),aliases:[t.title,t.pronunciation||''],origin:'Materiały przewodnickie CTF',review:'Redakcja CTF 2026-09-10'});else bind(t.id,t.id);}
 reviewed.forEach(entry);
 // Relocate previously mixed paragraphs into the subjects they actually describe.
 const chengduParagraphs=previous.get('ctf-chengdu-komplet').sections.flatMap(s=>s.content.match(/<p>[\s\S]*?<\/p>/g)||[]);
 function focused(id,title,city,paragraphs){const t={id,title,city,category:'Miasta i trasy',chinese:'',pronunciation:'',icon:'文',accent:'green',status:'szkic',coverage:'fragment',updated:'2026-09-10',tags:['CTF',city],summary:strip(paragraphs[0]||''),sections:[{id:'opowiesc',title,content:paragraphs.join('')}],facts:[],quiz:[],guideScripts:[],readingTime:Math.max(1,Math.ceil(strip(paragraphs.join('')).split(' ').length/130))};upsert(t);entry(t);return t;}
 focused('chengdu','Chengdu — kotlina, woda i herbaciarnie','Chengdu',chengduParagraphs.filter(p=>/Chengdu \[|irygacyjny Dujiangyan|Herbaciarnia jest/.test(p)));
 focused('opera-syczuanska','Opera syczuańska i zmiana masek','Chengdu',chengduParagraphs.filter(p=>/Opera syczuańska/.test(p)));
 focused('jinli','Jinli i Kuanzhai Xiangzi','Chengdu',chengduParagraphs.filter(p=>/Jinli oraz/.test(p)));
 focused('kuchnia-syczuan','Kuchnia syczuańska — mala i hot pot','Chengdu',chengduParagraphs.filter(p=>/Kuchnia syczuańska/.test(p)));
 // Keep garden details with the garden, not under Jade Buddha history.
 const gardens=previous.get('ctf-szanghaj-swiatynie').sections.flatMap(s=>s.content.match(/<p>[\s\S]*?<\/p>/g)||[]).filter(p=>/ogród Yuyuan|Ogród Yuyuan/.test(p));
 const garden=byId('chenghuang');garden.sections.push({id:'yuyuan-kompozycja',title:'Yuyuan — jak oglądać ogród',content:gardens.join('')});
 const aliases={'panda-base':'pandy','hongcun-woda':'hongcun','mlody-mao':'wyspa-pomaranczowa','mao-reformy':'mao-zedong','przodkowie-pogrzeby':'pogrzeby','evergrande':'miasta-duchow','avatar':'gory-avatara','yuanjiajie':'gory-avatara','golden-whip':'gory-avatara','bailong':'gory-avatara','tianzi':'gory-avatara','droga-99':'tianmen'};
 Object.entries(aliases).forEach(([id,to])=>bind(id,to));
 // Catalogue links to retained specialist chapters remain precise.
 bind('bailong','gory-avatara','szczegoly-s7');bind('droga-99','tianmen','szczegoly-s13');
 const chapter=(id,topic,hint)=>{const t=byId(topic),s=t.sections.find(s=>s.title.toLowerCase().includes(hint));if(s)bind(id,topic,s.id);};
 chapter('tianzi','gory-avatara','tianzi');chapter('golden-whip','gory-avatara','golden whip');chapter('yuanjiajie','gory-avatara','yuanjiajie');
 chapter('chongqing-wojenna-stolica','chongqing','wojen');chapter('hongyadong','chongqing','hongya');chapter('raffles-city','chongqing','raffles');
 // A legacy regional link opens the full revised narrative; old specialist anchors remain.
 function regional(id,target,extras=[]){const base=previous.get(id)||byId(target),source=byId(target);const sections=source.sections.map(s=>({...s}));for(const s of (previous.get(id)?.sections||[])){if(extras.includes(s.id))sections.push({...s});}upsert({...base,...source,id,sections,sourceDocuments:source.sourceDocuments});}
 regional('ctf-huangshan-huizhou','huangshan');
 regional('zhangjiajie','gory-avatara',['s2','s3','s12','s15','s19','sources']);bind('zhangjiajie','zhangjiajie');bind('szklany-most','zhangjiajie','s15');
 regional('ctf-zhangjiajie-komplet','zhangjiajie');regional('ctf-changsha-mao','changsha');
 // Saved master links retain access to complete chapters, grouped by real subject.
 function collection(id,title,ids){const original=previous.get(id)||byId(ids[0]);const sections=ids.map(tid=>{const t=byId(tid);return {id:tid,title:t.title,content:`<p><a href="#topic/${tid}">Otwórz osobne opracowanie</a></p>`+t.sections.filter(s=>s.id!=='powiazane').map(s=>'<h3>'+escape(s.title)+'</h3>'+s.content).join('')};});const words=strip(sections.map(s=>s.content).join('')).split(' ').length;upsert({...original,id,title,summary:'Pełne opracowania: '+ids.map(id=>byId(id).title).join('; '),sections,guideScripts:[],stats:[],quickTalk:'',facts:[],quiz:[],status:'pełne',coverage:'full',updated:'2026-09-10',readingTime:Math.ceil(words/130)});}
 collection('ctf-chengdu-komplet','Chengdu — komplet opowieści',['chengdu','pandy','wenshu','trzy-krolestwa','wuhou','liu-bei','jinli','kuchnia-syczuan','opera-syczuanska']);
 collection('ctf-chongqing-komplet','Chongqing — komplet opowieści',['chongqing','liziba','ciqikou','nanbin-road']);
 collection('ctf-szanghaj-swiatynie','Szanghaj — świątynie i Stare Miasto',['jadeitowy-budda','chenghuang']);
 // Keep detailed Huizhou material accessible, with the new voice at the start.
 const huizhou=previous.get('hongcun-tunxi');
 upsert({...huizhou,sections:[{id:'nowe-opowiesci',title:'Hongcun i Tunxi — opowieści na trasę',content:'<p>Hongcun pokazuje organizację wsi i życia rodu, Tunxi — handel oraz rzemiosło tego samego regionu. Zacznij od opowieści o miejscu, w którym jesteśmy; szczegółowe tematy wybierz z dalszych rozdziałów.</p><ul><li><a href="#topic/hongcun">Hongcun — pełny spacer</a></li><li><a href="#topic/tunxi">Tunxi — stara ulica i rzemiosło</a></li><li><a href="#topic/kult-przodkow">Kult przodków</a></li><li><a href="#topic/kuchnia-hui">Kuchnia Hui</a></li></ul>'},...huizhou.sections],updated:'2026-09-10'});
 // Topic lists accompany the existing day and variant, without rewriting personal plans.
 const additions={3:['rewolucja-kulturalna','sluby'],4:['hongcun','kult-przodkow','feng-shui','kuchnia-hui'],5:['kuchnia-hui'],6:['wyspa-pomaranczowa','mao-zedong','kuchnia-hunan'],7:['rodzina-malzenstwo'],8:['gory-avatara'],9:['emerytury','sluby'],10:['trzy-krolestwa','liu-bei'],11:['wenshu','wuhou','pandy']};
 const program=window.WANFANG_PROGRAMS.find(p=>p.code==='CTF');
 for(const v of program.variants)for(const day of v.days){const field=Array.isArray(day.topics)?'topics':'talks';if(Array.isArray(day[field]))day[field]=[...new Set([...day[field],...(additions[day.number]||[])])];}
 // The attachment is a partial field notebook, not a replacement full itinerary.
 const notebook={id:'ctf-notatki-program',title:'CTF — program i notatki z objazdu',city:'Chiny',category:'Praktyczne',chinese:'',pronunciation:'',icon:'路',accent:'blue',status:'pełne',updated:'2026-09-10',tags:['CTF','program'],summary:'Różnice między arkuszem CTF.xlsx a dotychczasowym planem oraz wskazówki do przygotowania konkretnego wyjazdu.',facts:[],quiz:[],guideScripts:[],sections:[
 {id:'zakres',title:'Jak korzystać z arkusza',content:'<blockquote class="note-guide"><strong>Dla pilota</strong><p>Arkusz CTF.xlsx z paczki PROGRAMY jest zapisem części trasy. Zaczyna od dnia 0 w Szanghaju i kończy na przejeździe do Chengdu. Pod koniec Liziba, Ciqikou i Chengdu mają osobne numery dni, choć dotychczasowy plan łączy te etapy inaczej. Nie ma tu kompletnego programu dalszej części wycieczki ani aktualnych dokumentów konkretnej grupy.</p></blockquote><p>W kompendium pozostaje dotychczasowy pełny plan. Poniższy zapis pomaga porównać jego zakres z doświadczeniami z wcześniejszego objazdu. Nie przenosimy z niego automatycznie godzin, hoteli ani numeracji dni.</p>'},
 {id:'szanghaj',title:'Szanghaj — różnica wariantów',content:'<p>Arkusz rozdziela przylot z kolacją i hotelem, dzień z Bundem, Shanghai Tower, jedwabiem, Maglevem i ERA oraz dzień ze Świątynią Jadeitowego Buddy, Nanjing Road i Starym Miastem.</p><p>Dotychczasowa baza kompendium wymienia przy przylocie Pudong i Perłę Orientu. Shanghai Tower i Perła Orientu są odrębnymi obiektami. O wejściu na konkretny taras decydują dokumenty i rezerwacje bieżącej grupy.</p><ul><li><a href="#catalog/shanghai-tower">Shanghai Tower</a></li><li><a href="#catalog/perla-orientu">Perła Orientu</a></li><li><a href="#topic/jadeitowy-budda">Świątynia Jadeitowego Buddy</a></li></ul>'},
 {id:'etapy',title:'Dalsze etapy zapisane w arkuszu',content:'<ol><li>Przejazd do Anhui: Hongcun, Tunxi i nocleg.</li><li>Huangshan: transport parkowy, kolejka, szlaki i posiłek; wieczorem Tunxi.</li><li>Changsha i Wyspa Pomarańczowa, następnie przejazd w stronę Zhangjiajie.</li><li>Tianmen, szklane chodniki i galeria obrazów tworzonych z piasku.</li><li>Wulingyuan: dolina, winda Bailong, punkty widokowe i Tianzi; przedstawienie kultury lokalnej.</li><li>Szklany Most Wielkiego Kanionu, przejazd do Chongqingu, Nanbin Road oraz nocna panorama.</li><li>Liziba, Ciqikou i przejazd do Chengdu — kolejność zanotowana, podział na dni odmienny od obecnej bazy.</li></ol>'},
 {id:'praktyka',title:'Co wykorzystać z doświadczenia pilota',content:'<blockquote class="note-guide"><strong>Przed każdym etapem</strong><p>Ustal toalety i miejsce zbiórki przed zmianą środka transportu. Na dworcu przygotuj grupę do wysiadania wcześniej. W parkach policz osoby po każdym przejeździe busem, kolejką lub windą. Na Tianmen sprawdź konkretny wariant biletu i kolejki — opis wagonika w dawnych notatkach nie identyfikuje całej trasy.</p></blockquote><p>Podane w arkuszu ceny posiłków, masażu, czasy wolne i godziny przedstawień dotyczą zapisanej wizyty. Nie są aktualnym cennikiem ani gwarantowanym czasem dojazdu. Przy planowaniu dnia korzystaj z bieżących rezerwacji i informacji lokalnego przewodnika.</p>'}
 ]};upsert(notebook);entry(notebook);
 for(const v of program.variants){if(v.days[0])v.days[0].talks=[...new Set([...v.days[0].talks,'ctf-notatki-program'])];}
 // Link the new social narratives from older overview pages as well.
 for(const [id,targets] of Object.entries({'urbanizacja':['miasta-duchow'],'chiny-spoleczenstwo-komplet':['rodzina-malzenstwo','sluby','emerytury','jedno-dziecko'],'chiny-kultura-komplet':['pogrzeby','kult-przodkow','feng-shui','konfucjanizm']})){
 const t=byId(id);if(t)upsert({...t,sections:[{id:'opowiesci-ctf',title:'Rozwinięte opowieści',content:'<ul>'+targets.map(id=>'<li><a href="#topic/'+id+'">'+escape(byId(id).title)+'</a></li>').join('')+'</ul>'},...t.sections]});
 }
 // Refresh lengths after supplements and retain catalogue identity for saved plans.
 for(const t of expanded){if(t.updated==='2026-09-10')t.readingTime=Math.max(1,Math.ceil(strip(t.sections.map(s=>s.content).join(' ')).split(' ').length/130));}
 window.WANFANG_CTF_MATERIALS={...window.WANFANG_CTF_MATERIALS,updated:'2026-09-10',reviewedTopics:reviewed.length,sourceDocuments:32};
})();
