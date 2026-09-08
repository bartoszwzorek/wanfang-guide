(() => {
  const C = window.WanfangCore;
  const baseTopics = [...new Map([...(window.WANFANG_TOPICS || []), ...(window.WANFANG_IMPORTED_TOPICS || []), ...(window.WANFANG_EXPANDED_TOPICS || [])].map(t=>[t.id,t])).values()];
  const storedArray = key => {try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[];}catch{return [];}};
  const state = {
    query: "", city: "", category: "", layout: "grid", currentTopicId: null,
    favorites: new Set(storedArray("wanfang:favorites").filter(C.validId)),
    route: C.unique(storedArray("wanfang:route").filter(C.validId)),
    customTopics: storedArray("wanfang:customTopics").filter(t=>t&&C.validId(t.id)&&typeof t.title==='string').map(cleanCustomTopic)
  };
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const topics = () => [...baseTopics, ...state.customTopics];
  const accentMap = {red:"var(--red)",green:"var(--jade)",gold:"var(--gold)",blue:"var(--blue)",stone:"var(--stone)"};
  const artworkMap = {
    "zakazane-miasto":"assets/illustrations/forbidden-city.svg",
    "hutongi":"assets/illustrations/hutong.svg",
    "xian-warstwy":"assets/illustrations/xian.svg",
    "swieta-droga":"assets/illustrations/ming-tombs.svg",
    "swiatynia-nieba":"assets/illustrations/temple-heaven.svg",
    "chinski-smok":"assets/illustrations/dragon.svg",
    "hukou":"assets/illustrations/society.svg",
    "gaokao":"assets/illustrations/society.svg",
    "chinska-herbata":"assets/illustrations/tea.svg",
    "praktyczne-alipay":"assets/illustrations/payments.svg"
  };

  const views = {home:$("#homeView"),library:$("#libraryView"),favorites:$("#favoritesView"),route:$("#routeView"),topic:$("#topicView"),compendium:$("#compendiumView")};
  let factTopicId = null;

  function save(){
    try {
    localStorage.setItem("wanfang:favorites", JSON.stringify([...state.favorites]));
    localStorage.setItem("wanfang:route", JSON.stringify(state.route));
    localStorage.setItem("wanfang:customTopics", JSON.stringify(state.customTopics));
    } catch {toast('Brak miejsca na zapis. Wyeksportuj kopię swoich danych.');}
  }
  function toast(message){ const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove("show"),2200); }
  function escapeHtml(s=""){return String(s??'').replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"}[c]));}
  function safeRich(html){
    const template=document.createElement('template');template.innerHTML=String(html||'');
    const allowed=new Set(['P','BR','B','STRONG','I','EM','UL','OL','LI','H2','H3','H4','BLOCKQUOTE','TABLE','THEAD','TBODY','TR','TH','TD','DETAILS','SUMMARY','A']);
    [...template.content.querySelectorAll('*')].reverse().forEach(el=>{
      if(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','SVG','MATH','FORM'].includes(el.tagName)){el.remove();return;}
      if(!allowed.has(el.tagName)){el.replaceWith(...el.childNodes);return;}
      const href=el.getAttribute('href');[...el.attributes].forEach(a=>el.removeAttribute(a.name));
      if(el.tagName==='A'&&/^https?:\/\//i.test(href||'')){el.setAttribute('href',href);el.setAttribute('rel','noreferrer noopener');}
    });return template.innerHTML;
  }
  function cleanCustomTopic(t){
    const value=key=>String(t[key]||'').slice(0,10000);
    return {id:t.id,title:value('title'),city:value('city'),category:value('category'),chinese:value('chinese'),pronunciation:value('pronunciation'),summary:value('summary'),quickTalk:value('quickTalk'),status:'szkic',accent:'gold',readingTime:Number(t.readingTime)||5,updated:value('updated'),tags:(Array.isArray(t.tags)?t.tags:[]).filter(s=>typeof s==='string'),facts:(Array.isArray(t.facts)?t.facts:[]).filter(s=>typeof s==='string'),sections:(Array.isArray(t.sections)?t.sections:[]).map((s,i)=>({id:C.validId(s.id)?s.id:`wlasny-${i+1}`,title:String(s.title||'Materiał'),content:safeRich(s.content)})),guideScripts:(Array.isArray(t.guideScripts)?t.guideScripts:[]).map((s,i)=>({id:`wlasna-${i+1}`,label:String(s.label||'Opowieść'),content:safeRich(s.content)}))};
  }
  function slug(s=""){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}
  function colorFor(topic){return accentMap[topic.accent] || "var(--red)";}
  function artworkFor(topic){
    if(artworkMap[topic.id]) return artworkMap[topic.id];
    return ({"Historia":"assets/illustrations/ming-tombs.svg","Kultura i zwyczaje":"assets/illustrations/tea.svg","Życie codzienne":"assets/illustrations/society.svg","Praktyczne":"assets/illustrations/payments.svg","Miasta i trasy":"assets/illustrations/xian.svg","Opowieści":"assets/illustrations/forbidden-city.svg"})[topic.category] || "assets/illustrations/hero-atlas.svg";
  }
  function categorySymbol(category){return ({"Miasta i trasy":"城","Historia":"史","Kultura i zwyczaje":"礼","Życie codzienne":"人","Praktyczne":"行","Opowieści":"话"})[category]||"录";}

  function topicCard(t){
    const fav=state.favorites.has(t.id); const inRoute=state.route.includes(t.id);
    return `<article class="topic-card" style="--card-accent:${colorFor(t)}" data-id="${t.id}">
      <div class="topic-card-visual" style="background-image:url('${artworkFor(t)}')">
        <span class="status ${t.status==='szkic'?'szkic':'gotowe'}">${C.materialInfo({topicId:t.id},[t]).label}</span>
        <span class="visual-city">${escapeHtml(t.city)} · ${escapeHtml(t.category)}</span>
        <span class="card-cn">${t.icon||categorySymbol(t.category)}</span>
        <button class="favorite-button ${fav?'active':''}" data-fav="${t.id}" title="Ulubione">${fav?'★':'☆'}</button>
      </div>
      <div class="topic-card-body"><div class="meta">${t.readingTime||5} min czytania · aktualizacja ${escapeHtml(t.updated||'—')}</div><h3>${escapeHtml(t.title)}</h3><div class="chinese">${escapeHtml(t.chinese||"")} ${t.pronunciation?`· ${escapeHtml(t.pronunciation)}`:""}</div><p>${escapeHtml(t.summary)}</p>
      <div class="topic-card-footer"><button class="button open-topic" data-open="${t.id}">Otwórz rozdział</button><button class="button route-button" data-route="${t.id}" title="Dodaj do trasy">${inRoute?'✓ Trasa':'＋ Trasa'}</button></div></div></article>`;
  }

  function bindCards(root=document){
    $$('[data-open]',root).forEach(b=>b.onclick=()=>openTopic(b.dataset.open));
    $$('[data-fav]',root).forEach(b=>b.onclick=(e)=>{e.stopPropagation();toggleFavorite(b.dataset.fav);});
    $$('[data-route]',root).forEach(b=>b.onclick=(e)=>{e.stopPropagation();toggleRoute(b.dataset.route);});
  }

  function renderHome(){
    const all=topics(), cats=[
      ["Miasta i trasy","城","Pekin, Xi’an, Szanghaj i kolejne punkty objazdu"],
      ["Historia","史","Dynastie, cesarze, przełomy i chronologia"],
      ["Kultura i zwyczaje","礼","Symbole, religie, herbata i codzienne zachowania"],
      ["Życie codzienne","人","Hukou, szkoła, praca, rodzina i społeczeństwo"],
      ["Praktyczne","行","Płatności, transport, internet i komunikaty dla grupy"],
      ["Opowieści","话","Gotowe wersje 30 sekund, 2 minuty i długie opowieści"]
    ];
    $("#categoryGrid").innerHTML=cats.map(([name,cn,desc])=>`<button class="category-card" data-home-category="${name}"><span class="cn">${cn}</span><small>${all.filter(t=>t.category===name).length} materiałów</small><strong>${name}</strong><p>${desc}</p></button>`).join("");
    $$('[data-home-category]').forEach(b=>b.onclick=()=>{state.category=b.dataset.homeCategory;location.hash="library";renderLibrary();});
    $("#featuredTopics").innerHTML=all.slice(0,6).map(topicCard).join(""); bindCards($("#featuredTopics"));
    const cities=new Set(all.map(t=>t.city));
    $("#statTopics").textContent=all.length; $("#statCities").textContent=cities.size; $("#statTalks").textContent=all.filter(t=>t.quickTalk).length; $("#statFavorites").textContent=state.favorites.size;
    window.WanfangCompendium.home();
  }

  function renderFilters(){
    const all=topics(); const cities=[...new Set(all.map(t=>t.city))].sort(); const categories=[...new Set(all.map(t=>t.category))].sort();
    $("#cityFilter").innerHTML='<option value="">Wszystkie miasta</option>'+cities.map(c=>`<option ${state.city===c?'selected':''}>${escapeHtml(c)}</option>`).join("");
    $("#categoryFilter").innerHTML='<option value="">Wszystkie kategorie</option>'+categories.map(c=>`<option ${state.category===c?'selected':''}>${escapeHtml(c)}</option>`).join("");
  }
  function stripHtml(html=""){const box=document.createElement("div");box.innerHTML=html;return box.textContent||"";}
  function decorateReading(scope=document){
    $$('.article-section,.reading-copy section,.guide-script-content',scope).forEach(section=>{
      $$('.note,.research-note,.fact-check',section).forEach(el=>el.classList.add('reading-context'));
      $$('.detail,blockquote',section).forEach(el=>el.classList.add('reading-curiosity'));
      $$('.say',section).forEach(el=>el.classList.add('reading-takeaway'));
      const paragraphs=$$('p',section).filter(p=>!p.closest('.reading-context,.reading-curiosity,.reading-takeaway'));
      const mark=(pattern,className)=>{const p=paragraphs.find(el=>pattern.test(el.textContent.trim()));if(p)p.classList.add(className);};
      mark(/^(ciekawostka|przy okazji|warto (jeszcze |też )?(wiedzieć|zwrócić uwagę))/iu,'reading-curiosity');
      mark(/^(najważniejsza puenta|najlepsza puenta|puenta|do zapamiętania|najważniejsze jest)/iu,'reading-takeaway');
    });
  }
  const searchCache=new WeakMap();
  function topicSearchText(t){
    if(searchCache.has(t))return searchCache.get(t);
    const sectionText=(t.sections||[]).map(s=>`${s.title||""} ${s.subtitle||""} ${stripHtml(s.content||"")}`).join(" ");
    const quizText=(t.quiz||[]).map(q=>`${q.question||""} ${(q.answers||[]).join(" ")} ${q.explanation||""}`).join(" ");
    const aliases=(window.WANFANG_CATALOG||[]).filter(c=>c.topicId===t.id).map(c=>[c.title,...c.aliases].join(' ')).join(' ');
    const result=C.fold([t.title,t.chinese,t.pronunciation,t.city,t.category,t.summary,...(t.tags||[]),aliases,sectionText,quizText].join(' '));searchCache.set(t,result);return result;
  }
  function filteredTopics(source=topics()){
    const q=state.query.trim().toLowerCase();
    return source.filter(t=>(!state.city||t.city===state.city)&&(!state.category||t.category===state.category)&&(!q||C.matches(topicSearchText(t),q)));
  }
  function renderLibrary(){
    renderFilters(); const found=filteredTopics(); const grid=$("#libraryGrid"); grid.classList.toggle("list-layout",state.layout==="list"); grid.innerHTML=found.map(topicCard).join(""); bindCards(grid);
    $("#libraryEmpty").hidden=found.length>0; $("#librarySummary").textContent=`Znaleziono ${found.length} z ${topics().length} materiałów${state.query?` dla „${state.query}”`:""}.`;
  }
  function renderFavorites(){
    const fav=topics().filter(t=>state.favorites.has(t.id)); $("#favoritesGrid").innerHTML=fav.map(topicCard).join(""); bindCards($("#favoritesGrid")); $("#favoritesEmpty").hidden=fav.length>0;
  }
  function routeTopics(){return state.route.map(id=>topics().find(t=>t.id===id)).filter(Boolean);}
  function renderRoute(){
    const list=routeTopics(); const root=$("#routeList");
    root.innerHTML=list.map((t,i)=>`<div class="route-item"><div class="route-number">${i+1}</div><div><h3><a href="#topic/${t.id}">${escapeHtml(t.title)}</a></h3><p>${escapeHtml(t.city)} · ${t.readingTime||5} min czytania · ${escapeHtml(t.category)}</p></div><div class="route-actions"><button class="route-play" data-start-route="${t.id}" title="Uruchom trasę od tego tematu">▶</button><button data-up="${i}" title="Przesuń wyżej">↑</button><button data-down="${i}" title="Przesuń niżej">↓</button><button data-remove-route="${t.id}" title="Usuń">×</button></div></div>`).join("");
    $("#routeEmpty").hidden=list.length>0;
    $$('[data-start-route]',root).forEach(b=>b.onclick=()=>startRoute(b.dataset.startRoute));
    $$('[data-up]',root).forEach(b=>b.onclick=()=>moveRoute(+b.dataset.up,-1)); $$('[data-down]',root).forEach(b=>b.onclick=()=>moveRoute(+b.dataset.down,1)); $$('[data-remove-route]',root).forEach(b=>b.onclick=()=>toggleRoute(b.dataset.removeRoute));
    const start=$("#startRouteButton"); if(start){start.disabled=!list.length;start.textContent=list.length?"▶ Uruchom trasę":"▶ Najpierw dodaj tematy";}
  }
  function moveRoute(index,delta){const to=index+delta;if(to<0||to>=state.route.length)return;[state.route[index],state.route[to]]=[state.route[to],state.route[index]];save();renderRoute();updateCounts();}
  function toggleFavorite(id){state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);save();updateCounts();renderHome();renderLibrary();renderFavorites(); if(state.currentTopicId===id) renderTopic(id);toast(state.favorites.has(id)?"Dodano do ulubionych":"Usunięto z ulubionych");}
  function toggleRoute(id){state.route.includes(id)?state.route=state.route.filter(x=>x!==id):state.route.push(id);save();updateCounts();renderHome();renderLibrary();renderFavorites();renderRoute();if(state.currentTopicId===id)renderTopic(id);toast(state.route.includes(id)?"Dodano do planu trasy":"Usunięto z planu trasy");}
  function updateCounts(){const all=topics();if($("#allCount"))$("#allCount").textContent=all.length;$("#favoriteCount").textContent=state.favorites.size;$("#routeCount").textContent=state.route.length;}

  function renderTopic(id){
    const t=topics().find(x=>x.id===id); if(!t){location.hash="library";return;} state.currentTopicId=id;
    const notes=localStorage.getItem(`wanfang:notes:${id}`)||""; const fav=state.favorites.has(id),inRoute=state.route.includes(id);
    views.topic.style.setProperty("--topic-accent",colorFor(t));
    const rawSections=t.sections||[]; const sections=rawSections.filter(s=>s.id!=="quiz"); const facts=t.facts||[]; const tags=t.tags||[]; const scripts=t.guideScripts||[];
    const sectionAnchor=(s,i)=>`topic-section-${s.id||i+1}`;
    const fallbackStats=[
      {value:`${t.readingTime||5} min`,label:"orientacyjny czas czytania"},
      {value:String(sections.length),label:"głównych rozdziałów"},
      {value:String(facts.length),label:"ciekawostek do grupy"},
      {value:t.updated||"—",label:"ostatnia aktualizacja"}
    ];
    const statCards=(t.stats?.length?t.stats:fallbackStats).slice(0,4);
    const scriptsHtml=scripts.length?`<section class="guide-scripts-panel" id="guide-scripts">
      <div class="guide-scripts-head"><div><h2>Wybierz wersję</h2></div></div>
      <div class="guide-script-tabs">${scripts.map(s=>`<button class="guide-script-tab ${s.id===(t.defaultGuideScript||scripts[0].id)?'active':''}" data-guide-script="${escapeHtml(s.id)}">${escapeHtml(s.label)}</button>`).join("")}</div>
      ${scripts.map(s=>`<div class="guide-script-content ${s.id===(t.defaultGuideScript||scripts[0].id)?'active':''}" data-guide-script-panel="${escapeHtml(s.id)}">${s.content}</div>`).join("")}
    </section>`:"";
    const guideNav=`<div class="guide-mode-nav"><button data-guide-jump="guide-scripts">🎤 Opowieści</button>${sections.some(s=>s.id==='trasa')?'<button data-guide-jump="topic-section-trasa">🧭 Trasa 12 punktów</button>':''}<button data-guide-font="-1">A−</button><button data-guide-font="1">A+</button></div>`;
    const routeList=routeTopics(),routeIndex=routeList.findIndex(x=>x.id===id),isRouteTopic=routeIndex>=0;
    const guideRouteBar=`<div class="guide-route-bar ${isRouteTopic?'has-route':'standalone'}" id="guideRouteBar">
      <button class="guide-plan-button" id="guideRoutePlan" type="button">← Plan</button>
      <div class="guide-route-summary"><span id="guideRouteKicker">${isRouteTopic?`TRASA · ${routeIndex+1} Z ${routeList.length}`:'TRYB PRZEWODNIKA'}</span><strong>${escapeHtml(t.title)}</strong><div class="guide-progress-labels"><span>Temat: <b id="guideTopicPercent">0%</b></span><span>Cała trasa: <b id="guideRoutePercent">${isRouteTopic?Math.round(routeIndex/Math.max(routeList.length,1)*100):0}%</b></span></div><div class="guide-route-progress"><i id="guideRouteProgressFill"></i></div></div>
      <div class="guide-route-controls">
        <button id="guidePrevTopic" type="button" title="Poprzedni temat" ${!isRouteTopic||routeIndex===0?'disabled':''}>←</button>
        <select id="guideRouteSelect" aria-label="Przejdź do tematu z planu trasy"><option value="">${routeList.length?'Przejdź do tematu…':'Plan trasy jest pusty'}</option>${routeList.map((x,i)=>`<option value="${x.id}" ${x.id===id?'selected':''}>${i+1}. ${escapeHtml(x.title)}</option>`).join('')}</select>
        <button id="guideNextTopic" type="button" title="Następny temat" ${!isRouteTopic||routeIndex===routeList.length-1?'disabled':''}>→</button>
      </div>
      <div class="guide-database-search"><span>⌕</span><input id="guideSearchInput" type="search" placeholder="Szukaj w całej bazie…" autocomplete="off"><div class="guide-search-results" id="guideSearchResults"></div></div>
      <button class="guide-close-button" id="guideExit" type="button">× Wyjdź</button>
    </div>`;
    views.topic.innerHTML=`${guideRouteBar}${guideNav}
    <header class="topic-hero" style="--topic-image:url('${artworkFor(t)}')">
      <div class="topic-hero-art"><div class="topic-hero-seal">${t.icon||categorySymbol(t.category)}</div><div class="topic-hero-caption"><span>WANFANG GUIDE · ${escapeHtml(t.city)}</span><strong>${escapeHtml(t.category)} opowiedziane jak historia, nie jak podręcznik.</strong></div></div>
      <div class="topic-hero-copy"><div class="topic-breadcrumbs"><a href="#topics">Wszystkie tematy</a> / ${escapeHtml(t.city)} / ${escapeHtml(t.category)}</div><span class="tiny-label">${escapeHtml(t.city)} · ${escapeHtml(t.category)}</span><h1>${escapeHtml(t.title)}</h1><div class="cn-title">${escapeHtml(t.chinese||"")} ${t.pronunciation?`· ${escapeHtml(t.pronunciation)}`:""}</div><p class="topic-lead">${escapeHtml(t.summary)}</p><div class="topic-meta"><span>${escapeHtml(t.status)}</span><span>⏱ ${t.readingTime||5} min</span><span>${sections.length} rozdziałów</span>${tags.slice(0,4).map(x=>`<span>#${escapeHtml(x)}</span>`).join("")}</div></div>
    </header>
    <div class="topic-toolbar"><button id="backLibrary">← Baza</button><button id="topicFav">${fav?'★ Ulubione':'☆ Ulubione'}</button><button id="topicRoute">${inRoute?'✓ W trasie':'＋ Do trasy'}</button><span class="spacer"></span><button class="hide-mobile" id="printTopic">Drukuj / PDF</button><button id="enterGuide">🎤 Tryb przewodnika</button></div>
    <div class="topic-stat-row">${statCards.map(s=>`<div class="topic-stat"><strong>${escapeHtml(String(s.value))}</strong><span>${escapeHtml(String(s.label))}</span></div>`).join("")}</div>
    ${t.id==='praktyczne-alipay'?'':`<section class="talk-box"><span class="tiny-label">W SKRÓCIE</span><p>${escapeHtml(t.quickTalk||t.summary)}</p></section>`}
    ${scriptsHtml}
    <div class="facts-panel">${facts.map((f,i)=>`<div class="fact-card"><span class="tiny-label">CIEKAWOSTKA ${String(i+1).padStart(2,'0')}</span><p>${escapeHtml(f)}</p></div>`).join("")}</div>
    <div class="topic-layout"><aside class="topic-toc"><strong>SPIS TREŚCI</strong>${scripts.length?'<a href="#guide-scripts" data-scroll="guide-scripts">🎤 Gotowe opowieści</a>':''}${sections.map((s,i)=>`<a href="#${sectionAnchor(s,i)}" data-scroll="${sectionAnchor(s,i)}">${String(i+1).padStart(2,"0")}. ${escapeHtml(s.title)}</a>`).join("")}<a href="#personal-notes" data-scroll="personal-notes">Moje notatki</a></aside><div class="topic-article">${sections.map((s,i)=>`<section class="article-section rich-section" id="${sectionAnchor(s,i)}" data-section-id="${escapeHtml(s.id||String(i+1))}" data-cn="${t.icon||categorySymbol(t.category)}"><div class="reading-section-anchor"><span>Część ${i+1} z ${sections.length}</span><strong>${escapeHtml(s.title)}</strong></div><h2>${escapeHtml(s.title)}</h2>${s.subtitle?`<p class="article-subtitle">${escapeHtml(s.subtitle)}</p>`:""}${s.content}</section>`).join("")}<section class="notes-panel" id="personal-notes"><span class="tiny-label">TYLKO DLA CIEBIE</span><h2>Moje notatki do tego tematu</h2><textarea id="topicNotes" placeholder="Dopisz pytania turystów, własne żarty, punkt zbiórki, informacje praktyczne…">${escapeHtml(notes)}</textarea><div class="notes-actions"><button class="button primary" id="saveNotes">Zapisz notatki</button></div></section></div></div>`;
    // Keep the reading page compact; source materials remain stored unchanged.
    $$('.topic-hero-art,.topic-stat-row,.guide-scripts-panel,.talk-box,.reading-section-anchor',views.topic).forEach(el=>el.remove());
    $$('[data-scroll="guide-scripts"]',views.topic).forEach(el=>el.remove());
    const toc=$('.topic-toc',views.topic);toc.id='topic-contents';toc.tabIndex=-1;
    const tocButton=document.createElement('button');tocButton.className='reading-toc-return';tocButton.type='button';tocButton.textContent='↑ Spis treści';
    tocButton.onclick=()=>{document.body.classList.remove('guide-mode');toc.scrollIntoView({behavior:'smooth',block:'start'});toc.focus({preventScroll:true});};
    views.topic.append(tocButton);
    $$('[data-guide-jump="guide-scripts"]',views.topic).forEach(el=>{el.dataset.guideJump='topic-contents';el.textContent='Spis treści';el.onclick=tocButton.onclick;});
    $("#backLibrary").onclick=()=>location.hash="library"; $("#topicFav").onclick=()=>toggleFavorite(id); $("#topicRoute").onclick=()=>toggleRoute(id); $("#printTopic").onclick=()=>window.print(); $("#enterGuide").onclick=enterGuide;
    bindGuideRouteBar(t,routeList,routeIndex);
    $("#saveNotes").onclick=()=>{localStorage.setItem(`wanfang:notes:${id}`,$("#topicNotes").value);toast("Notatki zapisane");};
    $$(`[data-scroll]`, views.topic).forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById(a.dataset.scroll)?.scrollIntoView({behavior:"smooth",block:"start"});});
    $$(`[data-guide-jump]`, views.topic).forEach(b=>b.onclick=()=>{if(b.dataset.guideJump==='topic-contents'){tocButton.onclick();return;}document.getElementById(b.dataset.guideJump)?.scrollIntoView({behavior:"smooth",block:"start"});});
    $$(`[data-guide-font]`, views.topic).forEach(b=>b.onclick=()=>{const current=parseInt(getComputedStyle(document.body).getPropertyValue('--guide-font-size'))||(matchMedia('(max-width:620px)').matches?17:26);const next=Math.max(15,Math.min(36,current+(+b.dataset.guideFont)*2));document.body.style.setProperty('--guide-font-size',`${next}px`);toast(`Tekst: ${next}px`);});
    $$('.guide-script-tab',views.topic).forEach(btn=>btn.onclick=()=>{$$('.guide-script-tab',views.topic).forEach(x=>x.classList.toggle('active',x===btn));$$('.guide-script-content',views.topic).forEach(x=>x.classList.toggle('active',x.dataset.guideScriptPanel===btn.dataset.guideScript));});
    $$('.tab[data-tab]',views.topic).forEach(btn=>btn.onclick=()=>{$$('.tab[data-tab]',views.topic).forEach(x=>x.classList.toggle('active',x===btn));$$('.talk',views.topic).forEach(x=>x.classList.toggle('active',x.id===btn.dataset.tab));});
    $$('.map-stop[data-target]',views.topic).forEach(g=>g.onclick=()=>document.getElementById(g.dataset.target)?.scrollIntoView({behavior:'smooth',block:'start'}));
    decorateReading(views.topic);
    window.WanfangCompendium.onTopic(t,views.topic);
  }
  function bindGuideRouteBar(t,routeList,routeIndex){
    const plan=$("#guideRoutePlan",views.topic),exit=$("#guideExit",views.topic),prev=$("#guidePrevTopic",views.topic),next=$("#guideNextTopic",views.topic),select=$("#guideRouteSelect",views.topic),input=$("#guideSearchInput",views.topic),results=$("#guideSearchResults",views.topic);
    if(plan)plan.onclick=()=>{exitGuide();location.hash="route";};
    if(exit)exit.onclick=exitGuide;
    if(prev)prev.onclick=()=>navigateRoute(-1);
    if(next)next.onclick=()=>navigateRoute(1);
    if(select)select.onchange=()=>{if(select.value)openTopicInGuide(select.value);};
    if(input&&results){
      const drawResults=()=>{
        const q=input.value.trim().toLowerCase();
        if(!q){results.innerHTML="";results.classList.remove("show");return;}
        const found=topics().filter(x=>C.matches(topicSearchText(x),q)).slice(0,8);
        results.innerHTML=found.length?found.map(x=>`<button type="button" data-guide-open="${x.id}"><strong>${escapeHtml(x.title)}</strong><small>${escapeHtml(x.city)} · ${escapeHtml(x.category)}</small></button>`).join(""):`<div class="guide-search-empty">Nic nie znalazłem.</div>`;
        results.classList.add("show");
        $$('[data-guide-open]',results).forEach(b=>b.onclick=()=>openTopicInGuide(b.dataset.guideOpen));
      };
      input.oninput=drawResults;
      input.onfocus=drawResults;
      input.onkeydown=e=>{if(e.key==="Escape"){input.value="";drawResults();input.blur();}};
    }
    updateReadingProgress();
  }
  function navigateRoute(delta){
    const list=routeTopics(),index=list.findIndex(x=>x.id===state.currentTopicId),next=index+delta;
    if(index<0||next<0||next>=list.length){toast(delta>0?"To już koniec planu trasy":"To jest pierwszy temat trasy");return;}
    openTopicInGuide(list[next].id);
  }
  function openTopicInGuide(id){
    document.body.classList.add("guide-mode");
    localStorage.setItem("wanfang:lastRouteTopic",id);
    if(state.currentTopicId===id&&location.hash===`#topic/${id}`){renderTopic(id);window.scrollTo({top:0,behavior:"smooth"});}
    else location.hash=`topic/${id}`;
  }
  function startRoute(id){
    const list=routeTopics(); const target=id||localStorage.getItem("wanfang:lastRouteTopic")||list[0]?.id;
    if(!target||!list.some(x=>x.id===target)){
      if(!list.length){toast("Najpierw dodaj materiały do planu trasy");return;}
      return openTopicInGuide(list[0].id);
    }
    openTopicInGuide(target);
  }
  function currentTopicProgress(){
    if(!state.currentTopicId||!views.topic.classList.contains("active-view"))return 0;
    const startEl=$(".talk-box",views.topic)||views.topic;
    const endEl=$(".topic-article",views.topic)||views.topic;
    const start=startEl.getBoundingClientRect().top+window.scrollY-130;
    const end=endEl.getBoundingClientRect().bottom+window.scrollY-window.innerHeight+45;
    if(end<=start)return 1;
    return Math.max(0,Math.min(1,(window.scrollY-start)/(end-start)));
  }
  function updateReadingProgress(){
    const toc=$('.topic-toc',views.topic),tocButton=$('.reading-toc-return',views.topic);
    if(tocButton)tocButton.hidden=!views.topic.classList.contains('active-view')||(!document.body.classList.contains('guide-mode')&&toc.getBoundingClientRect().bottom>parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar')));
    const docMax=document.documentElement.scrollHeight-window.innerHeight;
    const page=docMax>0?Math.max(0,Math.min(1,window.scrollY/docMax)):0;
    let visible=page;
    const topicFraction=currentTopicProgress();
    const list=routeTopics(),index=list.findIndex(x=>x.id===state.currentTopicId);
    if(document.body.classList.contains("guide-mode")&&index>=0&&list.length)visible=(index+topicFraction)/list.length;
    $("#readingProgress").style.width=`${visible*100}%`;
    const topicPct=$("#guideTopicPercent",views.topic),routePct=$("#guideRoutePercent",views.topic),fill=$("#guideRouteProgressFill",views.topic),kicker=$("#guideRouteKicker",views.topic);
    if(topicPct)topicPct.textContent=`${Math.round(topicFraction*100)}%`;
    if(routePct)routePct.textContent=index>=0&&list.length?`${Math.round(((index+topicFraction)/list.length)*100)}%`:`${Math.round(topicFraction*100)}%`;
    if(fill)fill.style.width=index>=0&&list.length?`${((index+topicFraction)/list.length)*100}%`:`${topicFraction*100}%`;
    if(kicker&&index>=0)kicker.textContent=`TRASA · ${index+1} Z ${list.length}`;
  }
  function openTopic(id){location.hash=`topic/${id}`;}
  function enterGuide(){document.body.classList.add("guide-mode");updateReadingProgress();window.scrollTo({top:0,behavior:"smooth"});}
  function exitGuide(){document.body.classList.remove("guide-mode");updateReadingProgress();}

  function showView(name){
    // Live search must not move focus off the input (or dismiss a phone keyboard).
    const keepSearchFocus=name==='compendium'&&location.hash==='#topics'&&document.activeElement===$("#searchInput");
    Object.values(views).forEach(v=>v.classList.remove("active-view"));
    (views[name]||views.home).classList.add("active-view");
    $$('.nav-link').forEach(a=>a.classList.toggle("active",a.dataset.view===name));
    if(!keepSearchFocus)$("#mainContent").focus({preventScroll:true});
  }
  function routeHash(){
    const raw=location.hash.slice(1)||'home';
    if(raw.startsWith('topic/')){showView('topic');renderTopic(raw.split('/')[1]);}
    else{document.body.classList.remove('guide-mode');if(!window.WanfangCompendium.route(raw)){
      if(raw==='library'){showView('library');renderLibrary();}else if(raw==='favorites'){showView('favorites');renderFavorites();}else if(raw==='route'){showView('route');renderRoute();}else{showView('home');renderHome();}
    }}
    closeSidebar();window.scrollTo(0,0);requestAnimationFrame(()=>{updateReadingProgress();if(raw.startsWith('topic/')){const section=raw.split('/')[2];if(section)document.getElementById('topic-section-'+section)?.scrollIntoView({block:'start'});}});
  }

  function randomFact(){const candidates=topics().filter(t=>t.facts?.length);const t=candidates[Math.floor(Math.random()*candidates.length)];const fact=t.facts[Math.floor(Math.random()*t.facts.length)];factTopicId=t.id;$("#randomFactContent").innerHTML=`<h3>${escapeHtml(t.title)} · ${escapeHtml(t.city)}</h3><blockquote>${escapeHtml(fact)}</blockquote>`;if(!$("#factDialog").open)$("#factDialog").showModal();}
  function closeSidebar(){$("#sidebar").classList.remove("open");$("#sidebarBackdrop").classList.remove("show");}
  function initEvents(){
    window.addEventListener("hashchange",routeHash);
    $("#searchInput").addEventListener("input",e=>{state.query=e.target.value;window.WanfangCompendium.setTopicFilters({query:e.target.value});if(location.hash!=="#topics")location.hash="topics";else window.WanfangCompendium.route('topics');});
    document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();const guideSearch=$("#guideSearchInput",views.topic);(document.body.classList.contains("guide-mode")&&guideSearch?guideSearch:$("#searchInput")).focus();}if(e.key==="Escape"&&document.body.classList.contains("guide-mode")&&!$("#guideSearchInput",views.topic)?.matches(":focus"))exitGuide();});
    $("#cityFilter").onchange=e=>{state.city=e.target.value;renderLibrary();}; $("#categoryFilter").onchange=e=>{state.category=e.target.value;renderLibrary();};
    $("#clearFiltersButton").onclick=()=>{state.city="";state.category="";state.query="";$("#searchInput").value="";renderLibrary();};
    $$('[data-layout]').forEach(b=>b.onclick=()=>{state.layout=b.dataset.layout;$$('[data-layout]').forEach(x=>x.classList.toggle("active",x===b));renderLibrary();});
    $$('[data-category]').forEach(b=>b.onclick=()=>{state.category=b.dataset.category;window.WanfangCompendium.setTopicFilters({category:b.dataset.category});if(location.hash!=="#topics")location.hash="topics";else window.WanfangCompendium.route('topics');});
    $("#themeButton").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("wanfang:dark",document.body.classList.contains("dark")?"1":"0");};
    $("#guideModeButton").onclick=()=>{if(state.currentTopicId)openTopicInGuide(state.currentTopicId);else toast("Najpierw otwórz wybrany temat");};
    $("#menuButton").onclick=()=>{$("#sidebar").classList.add("open");$("#sidebarBackdrop").classList.add("show");};$("#sidebarBackdrop").onclick=closeSidebar;
    $("#randomTopicButton").onclick=randomFact;$("#anotherFactButton").onclick=randomFact;$("#openFactTopicButton").onclick=()=>{if(factTopicId){$("#factDialog").close();openTopic(factTopicId);}};
    $("#addTopicButton").onclick=()=>$("#topicDialog").showModal();
    $("#saveTopicButton").onclick=e=>{e.preventDefault();const form=$("#topicForm");if(!form.reportValidity())return;const fd=new FormData(form);const title=fd.get("title").trim();const id=`custom-${slug(title)}-${Date.now().toString().slice(-5)}`;const raw=fd.get("content").trim();state.customTopics.push({id,title,city:fd.get("city").trim(),category:fd.get("category"),chinese:fd.get("chinese").trim(),pronunciation:"",status:"szkic",readingTime:Math.max(2,Math.ceil(raw.split(/\s+/).length/180)),updated:new Date().toLocaleDateString("pl-PL"),icon:categorySymbol(fd.get("category")),accent:"gold",summary:fd.get("summary").trim(),tags:[fd.get("city").trim(),fd.get("category")],facts:[],quickTalk:fd.get("summary").trim(),sections:[{title:"Roboczy materiał",content:`<p>${escapeHtml(raw||"Treść do uzupełnienia.").replace(/\n/g,"</p><p>")}</p>`}],media:[]});save();window.WanfangCompendium.onCustomTopic(id);updateCounts();renderHome();form.reset();$("#topicDialog").close();openTopic(id);toast("Temat został dodany lokalnie — pamiętaj o eksporcie kopii");};
    $("#clearRouteButton").onclick=()=>{state.route=[];save();renderRoute();updateCounts();toast("Plan trasy wyczyszczony");};$("#printRouteButton").onclick=()=>window.print();$("#startRouteButton").onclick=()=>startRoute();
    $("#backupButton").onclick=exportBackup;$("#importInput").onchange=importBackup;
    window.addEventListener("scroll",updateReadingProgress,{passive:true});window.addEventListener("resize",updateReadingProgress);
  }
  function exportBackup(){
    const notes={};topics().forEach(t=>{const n=localStorage.getItem(`wanfang:notes:${t.id}`);if(n)notes[t.id]=n;});
    const data={version:2,date:new Date().toISOString(),favorites:[...state.favorites],route:state.route,customTopics:state.customTopics,notes,compendium:window.WanfangCompendium.exportData()};
    window.WanfangCompendium.download(`wanfang-backup-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(data,null,2),'application/json');
  }
  async function importBackup(e){
    const file=e.target.files[0];e.target.value='';if(!file)return;
    try{
      if(file.size>30000000)throw new Error('Kopia jest większa niż 30 MB.');
      const d=JSON.parse(await file.text());
      if(![1,2].includes(d.version)||!Array.isArray(d.favorites)||!Array.isArray(d.route)||!Array.isArray(d.customTopics)||d.customTopics.length>1000)throw new Error('To nie jest obsługiwana kopia Wanfang.');
      const ids=list=>{if(!list.every(C.validId))throw new Error('Nieprawidłowe identyfikatory w kopii.');return list;};
      const favorites=ids(d.favorites),route=ids(d.route);
      const customs=d.customTopics.map(t=>{if(!t||!C.validId(t.id)||!t.id.startsWith('custom-')||typeof t.title!=='string')throw new Error('Nieprawidłowy własny temat.');return cleanCustomTopic(t);});
      const extension=window.WanfangCompendium.prepareImport(d.compendium);
      const notes=Object.entries(d.notes||{}).filter(([id,n])=>C.validId(id)&&typeof n==='string');
      state.favorites=new Set([...state.favorites,...favorites]);state.route=C.unique([...state.route,...route]);
      state.customTopics=[...new Map([...state.customTopics,...customs].map(t=>[t.id,t])).values()];
      for(const [id,n] of notes){const old=localStorage.getItem(`wanfang:notes:${id}`)||'';localStorage.setItem(`wanfang:notes:${id}`,old&&old!==n&&!old.includes(n)?old+'\n\n— Z importowanej kopii —\n'+n:n||old);}
      window.WanfangCompendium.applyImport(extension);save();updateCounts();renderHome();renderLibrary();renderFavorites();renderRoute();routeHash();toast('Kopia połączona z bieżącymi danymi.');
    }catch(error){toast(error.message||'Nie udało się wczytać kopii.');}
  }
  function init(){if(localStorage.getItem("wanfang:dark")==="1")document.body.classList.add("dark");updateCounts();renderHome();renderLibrary();renderFavorites();renderRoute();initEvents();routeHash();}
  window.Wanfang={topics,state,toast,escapeHtml,showView,openTopic,startRoute,save,exportBackup,renderHome,renderTopic,routeHash,updateCounts,decorateReading};
  window.WanfangCompendium.init(window.Wanfang);
  init();
})();
