(() => {
  'use strict';
  const C=window.WanfangCore, programs=window.WANFANG_PROGRAMS, catalog=window.WANFANG_CATALOG;
  const $=(s,r=document)=>r.querySelector(s);
  let A, root, pending='', returnDay='', storage, bookmarkTimer;
  const empty=()=>({version:1,trips:[],activeTrip:'',progress:{},bindings:{}});
  const filters={query:'',program:'',status:''};
  const esc=v=>A.escapeHtml(v), program=code=>programs.find(p=>p.code===code);
  const variant=(p,id)=>p?.variants.find(v=>v.id===id)||p?.variants[0];
  const active=()=>storage.trips.find(t=>t.id===storage.activeTrip);
  const item=id=>{const c=catalog.find(c=>c.id===id);return c&&storage.bindings[id]?{...c,topicId:storage.bindings[id],sectionId:null}:c;};
  const info=c=>C.materialInfo(c,A.topics());
  const href=c=>c.topicId?`#topic/${c.topicId}${c.sectionId?'/'+c.sectionId:''}`:`#catalog/${c.id}`;
  function persist(){try{localStorage.setItem('wanfang:compendium',JSON.stringify(storage));return true;}catch{A.toast('Nie udało się zapisać danych. Wyeksportuj kopię.');return false;}}
  function download(name,text,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  const button=(label,action,value='',extra='')=>`<button class="button" data-action="${action}" data-value="${esc(value)}" ${extra}>${label}</button>`;
  const header=(label,title,description='')=>`<header class="page-header"><div><span class="tiny-label">${esc(label)}</span><h1>${esc(title)}</h1>${description?`<p>${esc(description)}</p>`:''}</div></header>`;
  const badge=c=>{const i=info(c);return `<span class="material-badge ${i.status}">${i.label}</span>`;};
  function cards(){return programs.map(p=>`<a class="program-card" href="#program/${p.code}/${p.defaultVariant}"><span class="program-code">${p.code}</span><h2>${esc(p.name)}</h2><p>${esc(p.path)}</p><strong>Otwórz dni programu →</strong></a>`).join('');}
  function home(){
    if(!A)return;$('#homePrograms').innerHTML=cards();$('#catalogCount').textContent=catalog.length;
    const last=Object.entries(storage.progress).sort((a,b)=>b[1].updated-a[1].updated)[0];
    const topic=last&&A.topics().find(t=>t.id===last[0]);
    $('#continueReading').innerHTML=active()?`<a href="#trip/${active().id}">Wróć do objazdu: ${esc(active().name)} →</a>`:topic?`<a href="#topic/${topic.id}/${last[1].section}">Czytaj dalej: ${esc(topic.title)} →</a>`:'';
    offlinePanel();
  }
  function resource(id,trip){const c=item(id);if(!c)return '';return `<div class="resource-row"><div><a href="${href(c)}">${esc(c.title)}</a><small>${esc(c.region)}${c.topicId&&c.topicId!==c.id?' · rozdział powiązany':''}</small></div>${badge(c)}${trip?button(trip.told.includes(id)?'✓ Opowiedziane':'Oznacz jako opowiedziane','told',id,`aria-pressed="${trip.told.includes(id)}"`):''}</div>`;}
  function programPage(code,vid){const p=program(code);if(!p)return missing();const v=variant(p,vid);
    root.innerHTML=header(p.code,p.name,p.theme)+`<div class="work-actions"><label>Wariant programu <select id="programVariant">${p.variants.map(x=>`<option value="${x.id}" ${x.id===v.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label><a class="button primary" href="#trip/new/${p.code}/${v.id}">Utwórz mój objazd</a></div><p class="source-note">Program wzorcowy. Kolejność, rezerwacje i przejazdy potwierdź dla konkretnej grupy. ${esc(p.note||'')} <a href="${p.source}" target="_blank" rel="noreferrer">Program organizatora ↗</a></p><div class="day-grid">${v.days.map(d=>dayCard(p,v,d)).join('')}</div>`;
    $('#programVariant').onchange=e=>location.hash=`program/${p.code}/${e.target.value}`;
  }
  function dayCard(p,v,d,trip,index){const ids=C.unique([...d.places,...d.talks]), gaps=ids.filter(id=>item(id)&&info(item(id)).status==='missing').length;
    const number=trip?index+1:d.number, date=trip?C.dateForDay(trip.startDate,index):'';
    const target=trip?`#trip/${trip.id}/${d.number}`:`#day/${p.code}/${v.id}/${d.number}`;
    return `<article class="day-card"><span class="tiny-label">DZIEŃ ${number}${date?' · '+date:''}</span><h2><a href="${target}">${esc(trip?.titles[d.number]||d.title)}</a></h2><p>${ids.length} tematów · ${gaps} do opracowania${trip?.confirmed.includes(d.number)?' · ✓ plan potwierdzony':''}</p><div class="work-actions"><a class="text-link" href="${target}">Przygotuj dzień →</a>${trip?button('↑','move',`${d.number}:-1`,`aria-label="Przesuń dzień wyżej" ${index===0?'disabled':''}`)+button('↓','move',`${d.number}:1`,`aria-label="Przesuń dzień niżej" ${index===trip.order.length-1?'disabled':''}`):''}</div></article>`;
  }
  function fullDayMaterials(ids){
    const topics=A.topics(), grouped=new Map();
    for(const id of ids){
      const c=item(id),t=c?.topicId&&topics.find(x=>x.id===c.topicId);if(!t)continue;
      if(!grouped.has(t.id))grouped.set(t.id,{topic:t,entries:[]});
      grouped.get(t.id).entries.push(c);
    }
    const materials=[];
    for(const {topic:t,entries} of grouped.values()){
      const whole=entries.some(c=>!c.sectionId);
      const sections=whole?t.sections:C.unique(entries.map(c=>c.sectionId).filter(Boolean)).map(id=>t.sections.find(s=>s.id===id)).filter(Boolean);
      if(!sections.length)continue;
      const words=sections.reduce((n,s)=>n+s.content.replace(/<[^>]*>/g,' ').trim().split(/\s+/).filter(Boolean).length,0);
      const title=whole?t.title:entries.map(c=>c.title).filter((x,i,a)=>a.indexOf(x)===i).join(' · ');
      materials.push(`<details class="full-material"><summary><span>${esc(title)}</span><small>${words.toLocaleString('pl-PL')} słów · około ${Math.max(1,Math.ceil(words/130))} min czytania</small></summary><div class="reading-copy">${sections.map(s=>`<section id="day-${esc(t.id)}-${esc(s.id||'section')}"><h3>${esc(s.title||t.title)}</h3>${s.content}</section>`).join('')}</div><p><a class="text-link" href="#topic/${t.id}${!whole&&sections.length===1?'/'+sections[0].id:''}">Otwórz jako osobny materiał →</a></p></details>`);
    }
    return materials.join('');
  }
  function dayPage(p,v,d,trip){
    if(!d)return missing();const order=trip?trip.order:v.days.map(x=>x.number), position=order.indexOf(d.number);
    const link=n=>trip?`#trip/${trip.id}/${n}`:`#day/${p.code}/${v.id}/${n}`;
    returnDay=link(d.number);
    if(trip){storage.activeTrip=trip.id;trip.lastDay=d.number;persist();}
    const ids=C.unique([...d.places,...d.talks]);
    const available=C.unique(ids.map(id=>item(id)?.topicId).filter(Boolean)).map(id=>A.topics().find(t=>t.id===id)).filter(Boolean);
    const full=fullDayMaterials(ids);
    const short=available.flatMap(t=>C.talkOptions(t,5).slice(0,1).map(s=>({topic:t,script:s})));
    const briefing=p.code==='CTF'&&v.id==='praktyka'?window.WANFANG_CTF_BRIEFINGS.find(b=>b.day===d.number):null;
    root.innerHTML=`<a class="text-link" href="${trip?'#trip/'+trip.id:'#program/'+p.code+'/'+v.id}">← ${trip?'Mój objazd':'Dni programu'}</a>`+header(`${p.code} · DZIEŃ ${position+1}${trip?.startDate?' · '+C.dateForDay(trip.startDate,position):''}`,trip?.titles[d.number]||d.title,v.name)+
      `<div class="work-actions">${button('Czytaj materiały kolejno','read-day',available.map(t=>t.id).join(','),available.length?'':'disabled')}${button('Drukuj dzień / PDF','print')}<a class="button" href="#catalog">Uzupełnij materiały</a></div>
      <div class="day-columns"><section><h2>Na miejscu</h2>${d.places.map(id=>resource(id,trip)).join('')||'<p>To dzień podróży — wykorzystaj tematy na przejazd.</p>'}<h2>Do opowiedzenia w drodze</h2>${d.talks.map(id=>resource(id,trip)).join('')}</section><aside class="day-checks"><span class="tiny-label">PRZED WYJŚCIEM</span><h2>Do potwierdzenia</h2><ul>${d.checks.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><p>Godziny i bilety sprawdź w odprawie swojej grupy.</p>${trip?`<label class="check-label"><input id="confirmDay" type="checkbox" ${trip.confirmed.includes(d.number)?'checked':''}> Plan tego dnia potwierdzony</label>`:`<a href="#trip/new/${p.code}/${v.id}">Utwórz objazd, żeby zapisywać ustalenia →</a>`}</aside></div>
      <section class="full-materials"><span class="tiny-label">TEKSTY DO CZYTANIA I OPOWIADANIA</span><h2>Pełne materiały na ten dzień</h2><p>Otwórz wybrany temat — poniżej znajduje się cała treść przypisana do tego dnia, a nie jej skrót.</p>${full||'<p>Do tego dnia nie odzyskano jeszcze pełnego tekstu. Dostępne hasła są oznaczone wyżej jako „Do opracowania”.</p>'}</section>
      <details class="quick-panel compact-panel"><summary><strong>Mam tylko 5 minut — pokaż skróty</strong></summary><p>Wybierz jedną krótką wersję. Czas szacowany przy około 130 słowach na minutę.</p>${short.map(({topic:t,script:s})=>`<details><summary>${esc(t.title)} · około ${s.minutes} min</summary><div class="reading-copy">${s.content}</div><a href="#topic/${t.id}">Pełny materiał →</a></details>`).join('')||'<p>Do tego dnia nie ma jeszcze krótkiej wersji.</p>'}</details>
      ${briefing?`<details class="preparation-panel editorial-only"><summary><strong>Odprawa robocza CTF i informacje do sprawdzenia</strong></summary><p>Materiał pomocniczy do przygotowania dnia. Pełne teksty znajdują się wyżej.</p>${briefing.narration.map(n=>`<details><summary>${esc(n.title)}</summary><div class="reading-copy">${n.content}</div></details>`).join('')}${briefing.myth?`<p><strong>Do sprawdzenia:</strong> ${esc(briefing.myth)}</p>`:''}${briefing.closing?`<p><strong>Domknięcie dnia:</strong> ${esc(briefing.closing)}</p>`:''}</details>`:''}
      ${trip?`<section class="notes-panel"><h2>Notatki z tego dnia</h2><label>Nazwa dnia w Twoim objeździe<input id="dayTitle" maxlength="200" value="${esc(trip.titles[d.number]||d.title)}"></label><label>Ustalenia, pytania grupy i nowe ciekawostki<textarea id="dayNotes" rows="8" placeholder="Co warto dopisać do kompendium po powrocie?">${esc(trip.notes[d.number]||'')}</textarea></label><p id="noteStatus" role="status">Zapis lokalny na tym urządzeniu. Eksport kopii przenosi notatki między urządzeniami.</p>${button('Eksportuj kopię z notatkami','backup')}</section>`:''}
      <nav class="day-pagination" aria-label="Sąsiednie dni">${position>0?`<a class="button" href="${link(order[position-1])}">← Poprzedni dzień</a>`:'<span></span>'}${position<order.length-1?`<a class="button" href="${link(order[position+1])}">Następny dzień →</a>`:''}</nav>`;
    if(trip){$('#dayNotes').oninput=e=>{trip.notes[d.number]=e.target.value;$('#noteStatus').textContent=persist()?'Zapisano na tym urządzeniu.':'Zapis nie powiódł się — wyeksportuj kopię.';};$('#dayTitle').onchange=e=>{trip.titles[d.number]=e.target.value;persist();};$('#confirmDay').onchange=e=>{trip.confirmed=e.target.checked?C.unique([...trip.confirmed,d.number]):trip.confirmed.filter(n=>n!==d.number);persist();};}
  }
  function catalogPage(){root.innerHTML=header('ZAKRES KOMPENDIUM','Katalog tematów i braków','Dostępny materiał może być szkicem lub rozdziałem szerszego opracowania. Status nie oznacza zakończonej weryfikacji.')+`<div class="catalog-filters"><label>Szukaj tematu<input type="search" id="catalogSearch" value="${esc(filters.query)}" placeholder="np. Longmen, jedwab, rodzina"></label><label>Program<select id="catalogProgram"><option value="">Wszystkie</option>${programs.map(p=>`<option ${filters.program===p.code?'selected':''}>${p.code}</option>`).join('')}</select></label><label>Materiał<select id="catalogStatus"><option value="">Wszystkie</option>${[['missing','Do opracowania'],['fragment','Krótkie materiały'],['material','Materiały']].map(([id,label])=>`<option value="${id}" ${filters.status===id?'selected':''}>${label}</option>`).join('')}</select></label>${button('Eksportuj katalog','catalog-export')}</div><p id="catalogSummary" role="status"></p><div id="catalogResults"></div>`;
    const draw=()=>{const found=catalog.map(c=>item(c.id)).filter(c=>(!filters.program||c.programs.includes(filters.program))&&(!filters.status||info(c).status===filters.status)&&C.matches([c.title,c.region,...c.aliases].join(' '),filters.query));$('#catalogSummary').textContent=`${found.length} z ${catalog.length} tematów`;$('#catalogResults').innerHTML=found.map(c=>`<article class="catalog-row"><div><a href="#catalog/${c.id}"><strong>${esc(c.title)}</strong></a><small>${esc(c.region)} · ${c.programs.join(' · ')}</small></div>${badge(c)}<a class="text-link" href="${href(c)}">${c.topicId?'Czytaj →':'Zobacz zakres →'}</a></article>`).join('')||'<p>Brak wyników. Zmień hasło lub filtry.</p>';};
    $('#catalogSearch').oninput=e=>{filters.query=e.target.value;draw();};$('#catalogProgram').onchange=e=>{filters.program=e.target.value;draw();};$('#catalogStatus').onchange=e=>{filters.status=e.target.value;draw();};draw();
  }
  function catalogItem(id){const c=item(id);if(!c)return missing();const topic=A.topics().find(t=>t.id===c.topicId);
    const days=programs.flatMap(p=>p.variants.flatMap(v=>v.days.filter(d=>[...d.places,...d.talks].includes(c.id)).map(d=>`<li><a href="#day/${p.code}/${v.id}/${d.number}">${p.code} · ${esc(v.name)} · dzień ${d.number}: ${esc(d.title)}</a></li>`)));
    root.innerHTML=`<a class="text-link" href="#catalog">← Katalog</a>`+header(c.programs.join(' · '),c.title,c.region)+badge(c)+`<section class="quick-panel"><h2>Co powinno znaleźć się w opracowaniu</h2><ul>${c.outline.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>${topic?`<p>Powiązany tekst: <a href="${href(c)}">${esc(topic.title)} →</a>. Zakres tego hasła może wymagać rozwinięcia.</p>`:'<p>Nie znaleziono osobnego materiału w odzyskanych opracowaniach.</p>'}<div class="work-actions">${topic?`<a class="button primary" href="${href(c)}">Otwórz materiał</a>`:''}${button('Wklej własne opracowanie','add-material',c.id)}</div><p class="source-note">Własny tekst zapisuje się na tym urządzeniu. Uwzględnij go w eksporcie kopii.</p></section><section><h2>W programach</h2>${days.length?`<ul class="related-days">${days.join('')}</ul>`:'<p>Temat ogólny, do wykorzystania na przejazdach we wszystkich przypisanych programach.</p>'}</section>`;
  }
  function tripList(){root.innerHTML=header('TWOJE GRUPY','Moje objazdy','Każdy wyjazd ma osobne notatki, kolejność dni i listę opowiedzianych tematów.')+`<div class="work-actions"><a class="button primary" href="#trip/new">Nowy objazd</a>${button('Eksportuj kopię','backup')}</div><p class="source-note">Dane są zapisane w tej przeglądarce. Przed zmianą telefonu lub wyczyszczeniem danych wykonaj kopię.</p><div class="day-grid">${storage.trips.map(t=>`<article class="day-card"><span class="tiny-label">${t.program} · ${t.startDate||'BEZ DATY'}</span><h2><a href="#trip/${t.id}">${esc(t.name)}</a></h2><p>${t.order.length} dni · ${t.told.length} opowiedzianych tematów</p><a class="text-link" href="#trip/${t.id}/${t.lastDay}">Wróć do dnia →</a></article>`).join('')||'<p>Utwórz pierwszy objazd na podstawie CHT, CJA albo CTF.</p>'}</div>`;}
  function tripForm(code,vid){const p=program(code)||programs[0],v=variant(p,vid||p.defaultVariant);
    root.innerHTML=header('NOWY OBJAZD','Przygotuj wyjazd','Program wzorcowy skopiujemy do osobnego planu Twojej grupy.')+`<form id="tripForm" class="trip-form"><label>Nazwa wyjazdu<input name="name" required maxlength="200" placeholder="np. CTF — moja wrześniowa grupa"></label><label>Program<select id="tripProgram">${programs.map(x=>`<option ${x===p?'selected':''}>${x.code}</option>`).join('')}</select></label><label>Wariant<select id="tripVariant">${p.variants.map(x=>`<option value="${x.id}" ${x===v?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label><label>Pierwszy dzień programu — opcjonalnie<input type="date" name="startDate"></label><p>Daty liczymy od pierwszego dnia programu, zwykle wylotu. Kolejność dni możesz później zmienić.</p><button class="button primary" type="submit">Utwórz objazd</button></form>`;
    $('#tripProgram').onchange=e=>{const next=program(e.target.value);$('#tripVariant').innerHTML=next.variants.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('');};
    $('#tripForm').onsubmit=e=>{e.preventDefault();const form=e.currentTarget,code=$('#tripProgram').value,v=variant(program(code),$('#tripVariant').value),fd=new FormData(form);const t=C.cleanTrip({id:'trip-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:fd.get('name').trim(),program:code,variant:v.id,startDate:fd.get('startDate'),order:v.days.map(d=>d.number),created:new Date().toISOString()});storage.trips.push(t);storage.activeTrip=t.id;persist();location.hash=`trip/${t.id}`;};
  }
  function tripPage(id){const t=storage.trips.find(t=>t.id===id);if(!t)return missing();const p=program(t.program),v=variant(p,t.variant);storage.activeTrip=t.id;persist();
    root.innerHTML=`<a class="text-link" href="#trip">← Wszystkie objazdy</a>`+header(t.program,t.name,v.name)+`<div class="work-actions"><a class="button primary" href="#trip/${t.id}/${t.lastDay}">Otwórz ostatni dzień</a>${button('Eksportuj kopię','backup')}${button('Drukuj plan / PDF','print')}</div><p class="source-note">Strzałki zmieniają kolejność całych dni wraz z ich materiałami i notatkami. Daty wynikają z nowej kolejności. Szczegóły zmiany planu wpisz w notatce dnia.</p><div class="day-grid">${t.order.map((n,i)=>{const d=v.days.find(d=>d.number===n);return d?dayCard(p,v,d,t,i):'';}).join('')}</div>`;
  }
  function missing(){root.innerHTML=header('NIE ZNALEZIONO','Ten widok nie istnieje')+'<a href="#programs">Wróć do programów →</a>';}
  function route(raw){const [name,a,b,c]=raw.split('/');if(!['programs','program','day','catalog','trip'].includes(name))return false;
    A.showView('compendium');document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.view===(name==='day'||name==='program'?'programs':name)));
    if(name==='programs')root.innerHTML=header('TRZY DROGI PRZEZ CHINY','Wybierz program','Jedna baza wiedzy, materiały przypisane do kolejnych dni.')+`<div class="program-grid">${cards()}</div>`;
    if(name==='program')programPage(a,b);
    if(name==='day'){const p=program(a),v=variant(p,b);if(p&&v)dayPage(p,v,v.days.find(d=>d.number===+c));else missing();}
    if(name==='catalog')a?catalogItem(a):catalogPage();
    if(name==='trip'){if(a==='new')tripForm(b,c);else if(a&&b){const t=storage.trips.find(t=>t.id===a),p=t&&program(t.program),v=t&&variant(p,t.variant);if(t&&v)dayPage(p,v,v.days.find(d=>d.number===+b),t);else missing();}else if(a)tripPage(a);else tripList();}return true;
  }
  function onTopic(t,view){const old=storage.progress[t.id],trip=active();
    const panel=document.createElement('section');panel.className='source-panel';panel.innerHTML=`<div class="work-actions">${returnDay?`<a class="button" href="${returnDay}">← Wróć do dnia</a>`:''}${old?`<a class="button" href="#topic/${t.id}/${old.section}">Wznów od zapisanej sekcji</a>`:''}${button('Zapisz miejsce czytania','bookmark',t.id)}</div><details><summary>Pochodzenie i przegląd materiału</summary><p>${esc(t.reviewNote||'Materiał z dotychczasowej bazy. Przed użyciem sprawdź informacje zmienne i źródła w tekście.')}</p>${t.importedAt?`<p>Włączono do kompendium: ${esc(t.importedAt)}. Jest to data importu, nie weryfikacji faktów.</p>`:''}<ul>${(t.sources||[]).map(s=>`<li>${esc(s.name)}${s.date?' · '+esc(s.date):''}</li>`).join('')}</ul></details>${trip?`<p>Aktywny objazd: <a href="#trip/${trip.id}">${esc(trip.name)}</a>. Oznaczanie opowiedzianych tematów znajdziesz w karcie dnia.</p>`:''}`;
    $('.topic-toolbar',view).after(panel);if(returnDay&&$('#guideRoutePlan',view))$('#guideRoutePlan',view).onclick=()=>location.hash=returnDay;
    if(t.preparationSections?.length){
      const preparation=document.createElement('div');preparation.className='preparation-panel';
      preparation.innerHTML='<details><summary>Przygotowania i ustalenia organizacyjne</summary><p>Archiwalne ustalenia. Potwierdź je dla swojej grupy przed użyciem.</p>'+t.preparationSections.map(s=>`<section><h3>${esc(s.title)}</h3>${s.content}</section>`).join('')+'</details>';
      panel.after(preparation);
    }
    if(!t.guideScripts?.length){const jump=view.querySelector('[data-guide-jump="guide-scripts"]');if(jump){jump.dataset.guideJump='topic-section-'+(t.sections?.[0]?.id||1);jump.textContent='Czytaj';}}
    $('#topicNotes',view).oninput=e=>{try{localStorage.setItem(`wanfang:notes:${t.id}`,e.target.value);}catch{A.toast('Nie udało się zapisać notatki.');}};
  }
  function bookmark(id,explicit=false){if(!$('#topicView').classList.contains('active-view'))return;const sections=[...document.querySelectorAll('#topicView [data-section-id]')];const section=sections.filter(s=>s.getBoundingClientRect().top<window.innerHeight/2).at(-1)|| (explicit?sections[0]:null);if(!section)return;storage.progress[id]={section:section.dataset.sectionId,updated:Date.now()};persist();if(explicit)A.toast('Zapisano miejsce czytania.');}
  let offlineText='Sprawdź gotowość przed wyjazdem. Pobranie obejmuje teksty i ilustracje.',offlineBusy=false;
  function offlinePanel(){const el=$('#homeOffline');if(el)el.innerHTML=`<div><span class="tiny-label">W DRODZE BEZ INTERNETU</span><h2>Kompendium offline</h2><p role="status">${esc(offlineText)}</p></div>${button(offlineBusy?'Pobieranie…':'Pobierz / odśwież offline','offline','',offlineBusy?'disabled':'')}`;}
  async function offline(){if(!('serviceWorker' in navigator)){offlineText='Ta przeglądarka nie obsługuje pobierania offline.';offlinePanel();return;}offlineBusy=true;offlinePanel();try{await navigator.serviceWorker.register('./sw.js');const reg=await navigator.serviceWorker.ready;const worker=reg.active;await new Promise((resolve,reject)=>{const channel=new MessageChannel(),timeout=setTimeout(()=>reject(new Error('Przekroczono czas pobierania. Spróbuj ponownie z internetem.')),120000);channel.port1.onmessage=e=>{if(e.data.error){clearTimeout(timeout);reject(new Error(e.data.error));}else if(e.data.done){clearTimeout(timeout);resolve();}else{offlineText=`Pobrano ${e.data.count} z ${e.data.total} plików…`;offlinePanel();}};worker.postMessage({type:'DOWNLOAD'},[channel.port2]);});offlineText='Pobrano pełny zestaw tej wersji. Otwieraj ten sam adres w tej przeglądarce. Zewnętrzne odnośniki wymagają internetu.';}catch(e){offlineText='Nie ukończono pobierania. '+e.message;}finally{offlineBusy=false;offlinePanel();}}
  function init(api){A=api;root=$('#compendiumView');try{storage=C.mergeExtension(empty(),JSON.parse(localStorage.getItem('wanfang:compendium')||'null'))||empty();}catch{storage=empty();setTimeout(()=>A.toast('Nie można odczytać zapisanych objazdów. Wczytaj kopię.'),500);}
    document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const value=b.dataset.value;switch(b.dataset.action){
      case 'print':window.print();break;case 'backup':A.exportBackup();break;case 'offline':offline();break;
      case 'bookmark':bookmark(value,true);break;
      case 'read-day':{const ids=value.split(',').filter(C.validId);if(ids.length){A.state.route=ids;A.save();A.updateCounts();A.startRoute(ids[0]);}break;}
      case 'told':{const t=active();if(t){t.told=t.told.includes(value)?t.told.filter(id=>id!==value):[...t.told,value];persist();b.textContent=t.told.includes(value)?'✓ Opowiedziane':'Oznacz jako opowiedziane';b.setAttribute('aria-pressed',String(t.told.includes(value)));}break;}
      case 'move':{const t=active();if(t){const [n,delta]=value.split(':').map(Number),i=t.order.indexOf(n),j=i+delta;if(i>=0&&j>=0&&j<t.order.length){[t.order[i],t.order[j]]=[t.order[j],t.order[i]];persist();tripPage(t.id);}}break;}
      case 'catalog-export':download('wanfang-katalog.json',JSON.stringify(catalog.map(c=>({...item(c.id),material:info(item(c.id))})),null,2),'application/json');break;
      case 'add-material':{const c=item(value);if(c){pending=c.id;const form=$('#topicForm');form.reset();form.elements.title.value=c.title;form.elements.city.value=c.region;form.elements.summary.value=c.outline.join('; ');$('#topicDialog').showModal();}break;}
    }});
    $('#topicDialog').addEventListener('close',()=>{pending='';});
    window.addEventListener('scroll',()=>{clearTimeout(bookmarkTimer);bookmarkTimer=setTimeout(()=>{if(A.state.currentTopicId)bookmark(A.state.currentTopicId);},800);},{passive:true});
    if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
    if('caches' in window)caches.open('wanfang-complete').then(cache=>cache.match('./offline-ready')).then(r=>{if(r){offlineText='Na tym urządzeniu jest pobrana wersja offline. Przed kolejnym wyjazdem odśwież ją z internetem.';offlinePanel();}}).catch(()=>{});
  }
  window.WanfangCompendium={init,home,route,onTopic,download,exportData:()=>structuredClone(storage),prepareImport:data=>C.mergeExtension(storage,data),applyImport:data=>{storage=data;persist();},onCustomTopic:id=>{if(pending){storage.bindings[pending]=id;persist();pending='';}}};
})();
