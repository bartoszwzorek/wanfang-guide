(() => {
  const baseTopics = window.WANFANG_TOPICS || [];
  const state = {
    query: "", city: "", category: "", layout: "grid", currentTopicId: null,
    favorites: new Set(JSON.parse(localStorage.getItem("wanfang:favorites") || "[]")),
    route: JSON.parse(localStorage.getItem("wanfang:route") || "[]"),
    customTopics: JSON.parse(localStorage.getItem("wanfang:customTopics") || "[]")
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

  const views = {home:$("#homeView"),library:$("#libraryView"),favorites:$("#favoritesView"),route:$("#routeView"),topic:$("#topicView")};
  let factTopicId = null;

  function save(){
    localStorage.setItem("wanfang:favorites", JSON.stringify([...state.favorites]));
    localStorage.setItem("wanfang:route", JSON.stringify(state.route));
    localStorage.setItem("wanfang:customTopics", JSON.stringify(state.customTopics));
  }
  function toast(message){ const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove("show"),2200); }
  function escapeHtml(s=""){return s.replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"}[c]));}
  function slug(s=""){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}
  function colorFor(topic){return accentMap[topic.accent] || "var(--red)";}
  function artworkFor(topic){
    if(artworkMap[topic.id]) return artworkMap[topic.id];
    return ({"Historia":"assets/illustrations/ming-tombs.svg","Kultura i zwyczaje":"assets/illustrations/tea.svg","Życie codzienne":"assets/illustrations/society.svg","Praktyczne":"assets/illustrations/payments.svg","Miasta i trasy":"assets/illustrations/xian.svg","Nawijki":"assets/illustrations/forbidden-city.svg"})[topic.category] || "assets/illustrations/hero-atlas.svg";
  }
  function categorySymbol(category){return ({"Miasta i trasy":"城","Historia":"史","Kultura i zwyczaje":"礼","Życie codzienne":"人","Praktyczne":"行","Nawijki":"话"})[category]||"录";}

  function topicCard(t){
    const fav=state.favorites.has(t.id); const inRoute=state.route.includes(t.id);
    return `<article class="topic-card" style="--card-accent:${colorFor(t)}" data-id="${t.id}">
      <div class="topic-card-visual" style="background-image:url('${artworkFor(t)}')">
        <span class="status ${t.status}">${t.status}</span>
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
      ["Nawijki","话","Gotowe wersje 30 sekund, 2 minuty i długie opowieści"]
    ];
    $("#categoryGrid").innerHTML=cats.map(([name,cn,desc])=>`<button class="category-card" data-home-category="${name}"><span class="cn">${cn}</span><small>${all.filter(t=>t.category===name).length} materiałów</small><strong>${name}</strong><p>${desc}</p></button>`).join("");
    $$('[data-home-category]').forEach(b=>b.onclick=()=>{state.category=b.dataset.homeCategory;location.hash="library";renderLibrary();});
    $("#featuredTopics").innerHTML=all.slice(0,6).map(topicCard).join(""); bindCards($("#featuredTopics"));
    const cities=new Set(all.map(t=>t.city));
    $("#statTopics").textContent=all.length; $("#statCities").textContent=cities.size; $("#statTalks").textContent=all.filter(t=>t.quickTalk).length; $("#statFavorites").textContent=state.favorites.size;
  }

  function renderFilters(){
    const all=topics(); const cities=[...new Set(all.map(t=>t.city))].sort(); const categories=[...new Set(all.map(t=>t.category))].sort();
    $("#cityFilter").innerHTML='<option value="">Wszystkie miasta</option>'+cities.map(c=>`<option ${state.city===c?'selected':''}>${escapeHtml(c)}</option>`).join("");
    $("#categoryFilter").innerHTML='<option value="">Wszystkie kategorie</option>'+categories.map(c=>`<option ${state.category===c?'selected':''}>${escapeHtml(c)}</option>`).join("");
  }
  function stripHtml(html=""){const box=document.createElement("div");box.innerHTML=html;return box.textContent||"";}
  function filteredTopics(source=topics()){
    const q=state.query.trim().toLowerCase();
    return source.filter(t=>{
      const sectionText=(t.sections||[]).map(s=>`${s.title||""} ${s.subtitle||""} ${stripHtml(s.content||"")}`).join(" ");
      const haystack=[t.title,t.chinese,t.pronunciation,t.city,t.category,t.summary,...(t.tags||[]),sectionText].join(" ").toLowerCase();
      return (!state.city||t.city===state.city)&&(!state.category||t.category===state.category)&&(!q||haystack.includes(q));
    });
  }
  function renderLibrary(){
    renderFilters(); const found=filteredTopics(); const grid=$("#libraryGrid"); grid.classList.toggle("list-layout",state.layout==="list"); grid.innerHTML=found.map(topicCard).join(""); bindCards(grid);
    $("#libraryEmpty").hidden=found.length>0; $("#librarySummary").textContent=`Znaleziono ${found.length} z ${topics().length} materiałów${state.query?` dla „${state.query}”`:""}.`;
  }
  function renderFavorites(){
    const fav=topics().filter(t=>state.favorites.has(t.id)); $("#favoritesGrid").innerHTML=fav.map(topicCard).join(""); bindCards($("#favoritesGrid")); $("#favoritesEmpty").hidden=fav.length>0;
  }
  function renderRoute(){
    const list=state.route.map(id=>topics().find(t=>t.id===id)).filter(Boolean); const root=$("#routeList");
    root.innerHTML=list.map((t,i)=>`<div class="route-item"><div class="route-number">${i+1}</div><div><h3><a href="#topic/${t.id}">${escapeHtml(t.title)}</a></h3><p>${escapeHtml(t.city)} · ${t.readingTime||5} min czytania · ${escapeHtml(t.category)}</p></div><div class="route-actions"><button data-up="${i}" title="Przesuń wyżej">↑</button><button data-down="${i}" title="Przesuń niżej">↓</button><button data-remove-route="${t.id}" title="Usuń">×</button></div></div>`).join("");
    $("#routeEmpty").hidden=list.length>0;
    $$('[data-up]',root).forEach(b=>b.onclick=()=>moveRoute(+b.dataset.up,-1)); $$('[data-down]',root).forEach(b=>b.onclick=()=>moveRoute(+b.dataset.down,1)); $$('[data-remove-route]',root).forEach(b=>b.onclick=()=>toggleRoute(b.dataset.removeRoute));
  }
  function moveRoute(index,delta){const to=index+delta;if(to<0||to>=state.route.length)return;[state.route[index],state.route[to]]=[state.route[to],state.route[index]];save();renderRoute();updateCounts();}
  function toggleFavorite(id){state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);save();updateCounts();renderHome();renderLibrary();renderFavorites(); if(state.currentTopicId===id) renderTopic(id);toast(state.favorites.has(id)?"Dodano do ulubionych":"Usunięto z ulubionych");}
  function toggleRoute(id){state.route.includes(id)?state.route=state.route.filter(x=>x!==id):state.route.push(id);save();updateCounts();renderHome();renderLibrary();renderFavorites();renderRoute();if(state.currentTopicId===id)renderTopic(id);toast(state.route.includes(id)?"Dodano do planu trasy":"Usunięto z planu trasy");}
  function updateCounts(){const all=topics();$("#allCount").textContent=all.length;$("#favoriteCount").textContent=state.favorites.size;$("#routeCount").textContent=state.route.length;}

  function renderTopic(id){
    const t=topics().find(x=>x.id===id); if(!t){location.hash="library";return;} state.currentTopicId=id;
    const notes=localStorage.getItem(`wanfang:notes:${id}`)||""; const fav=state.favorites.has(id),inRoute=state.route.includes(id);
    views.topic.style.setProperty("--topic-accent",colorFor(t));
    const sections=t.sections||[]; const facts=t.facts||[]; const tags=t.tags||[]; const scripts=t.guideScripts||[];
    const sectionAnchor=(s,i)=>`topic-section-${s.id||i+1}`;
    const fallbackStats=[
      {value:`${t.readingTime||5} min`,label:"orientacyjny czas czytania"},
      {value:String(sections.length),label:"głównych rozdziałów"},
      {value:String(facts.length),label:"ciekawostek do grupy"},
      {value:t.updated||"—",label:"ostatnia aktualizacja"}
    ];
    const statCards=(t.stats?.length?t.stats:fallbackStats).slice(0,4);
    const scriptsHtml=scripts.length?`<section class="guide-scripts-panel" id="guide-scripts">
      <div class="guide-scripts-head"><div><span class="tiny-label">TRYB PRZEWODNIKA · GOTOWE TEKSTY</span><h2>Wybierz długość nawijki</h2><p>Możesz czytać prawie słowo w słowo albo potraktować tekst jako rusztowanie własnej opowieści.</p></div></div>
      <div class="guide-script-tabs">${scripts.map(s=>`<button class="guide-script-tab ${s.id===(t.defaultGuideScript||scripts[0].id)?'active':''}" data-guide-script="${escapeHtml(s.id)}">${escapeHtml(s.label)}</button>`).join("")}</div>
      ${scripts.map(s=>`<div class="guide-script-content ${s.id===(t.defaultGuideScript||scripts[0].id)?'active':''}" data-guide-script-panel="${escapeHtml(s.id)}">${s.content}</div>`).join("")}
    </section>`:"";
    const guideNav=`<div class="guide-mode-nav"><button data-guide-jump="guide-scripts">🎤 Nawijki</button>${sections.some(s=>s.id==='trasa')?'<button data-guide-jump="topic-section-trasa">🧭 Trasa 12 punktów</button>':''}<button data-guide-font="-1">A−</button><button data-guide-font="1">A+</button></div>`;
    views.topic.innerHTML=`<button class="guide-exit" id="guideExit">× Wyjdź</button>${guideNav}
    <header class="topic-hero" style="--topic-image:url('${artworkFor(t)}')">
      <div class="topic-hero-art"><div class="topic-hero-seal">${t.icon||categorySymbol(t.category)}</div><div class="topic-hero-caption"><span>WANFANG GUIDE · ${escapeHtml(t.city)}</span><strong>${escapeHtml(t.category)} opowiedziane jak historia, nie jak podręcznik.</strong></div></div>
      <div class="topic-hero-copy"><div class="topic-breadcrumbs"><a href="#library">Baza wiedzy</a> / ${escapeHtml(t.city)} / ${escapeHtml(t.category)}</div><span class="tiny-label">${escapeHtml(t.city)} · ${escapeHtml(t.category)}</span><h1>${escapeHtml(t.title)}</h1><div class="cn-title">${escapeHtml(t.chinese||"")} ${t.pronunciation?`· ${escapeHtml(t.pronunciation)}`:""}</div><p class="topic-lead">${escapeHtml(t.summary)}</p><div class="topic-meta"><span>${escapeHtml(t.status)}</span><span>⏱ ${t.readingTime||5} min</span><span>${sections.length} rozdziałów</span>${tags.slice(0,4).map(x=>`<span>#${escapeHtml(x)}</span>`).join("")}</div></div>
    </header>
    <div class="topic-toolbar"><button id="backLibrary">← Baza</button><button id="topicFav">${fav?'★ Ulubione':'☆ Ulubione'}</button><button id="topicRoute">${inRoute?'✓ W trasie':'＋ Do trasy'}</button><span class="spacer"></span><button class="hide-mobile" id="printTopic">Drukuj / PDF</button><button id="enterGuide">🎤 Tryb przewodnika</button></div>
    <div class="topic-stat-row">${statCards.map(s=>`<div class="topic-stat"><strong>${escapeHtml(String(s.value))}</strong><span>${escapeHtml(String(s.label))}</span></div>`).join("")}</div>
    <section class="talk-box"><span class="tiny-label">OTWARCIE DO GRUPY · GOTOWA NAWIJKA</span><p>${escapeHtml(t.quickTalk||t.summary)}</p></section>
    ${scriptsHtml}
    <div class="facts-panel">${facts.map((f,i)=>`<div class="fact-card"><span class="tiny-label">CIEKAWOSTKA ${String(i+1).padStart(2,'0')}</span><p>${escapeHtml(f)}</p></div>`).join("")}</div>
    <div class="topic-layout"><aside class="topic-toc"><strong>SPIS TREŚCI</strong>${scripts.length?'<a href="#guide-scripts" data-scroll="guide-scripts">🎤 Gotowe nawijki</a>':''}${sections.map((s,i)=>`<a href="#${sectionAnchor(s,i)}" data-scroll="${sectionAnchor(s,i)}">${String(i+1).padStart(2,"0")}. ${escapeHtml(s.title)}</a>`).join("")}<a href="#personal-notes" data-scroll="personal-notes">Moje notatki</a></aside><div class="topic-article">${sections.map((s,i)=>`<section class="article-section rich-section" id="${sectionAnchor(s,i)}" data-section-id="${escapeHtml(s.id||String(i+1))}" data-cn="${t.icon||categorySymbol(t.category)}"><span class="tiny-label">${String(i+1).padStart(2,"0")}</span><h2>${escapeHtml(s.title)}</h2>${s.subtitle?`<p class="article-subtitle">${escapeHtml(s.subtitle)}</p>`:""}${s.content}</section>`).join("")}<section class="notes-panel" id="personal-notes"><span class="tiny-label">TYLKO DLA CIEBIE</span><h2>Moje notatki do tego tematu</h2><textarea id="topicNotes" placeholder="Dopisz pytania turystów, własne żarty, punkt zbiórki, informacje praktyczne…">${escapeHtml(notes)}</textarea><div class="notes-actions"><button class="button primary" id="saveNotes">Zapisz notatki</button></div></section></div></div>`;
    $("#backLibrary").onclick=()=>location.hash="library"; $("#topicFav").onclick=()=>toggleFavorite(id); $("#topicRoute").onclick=()=>toggleRoute(id); $("#printTopic").onclick=()=>window.print(); $("#enterGuide").onclick=enterGuide; $("#guideExit").onclick=exitGuide;
    $("#saveNotes").onclick=()=>{localStorage.setItem(`wanfang:notes:${id}`,$("#topicNotes").value);toast("Notatki zapisane");};
    $$(`[data-scroll]`, views.topic).forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById(a.dataset.scroll)?.scrollIntoView({behavior:"smooth",block:"start"});});
    $$(`[data-guide-jump]`, views.topic).forEach(b=>b.onclick=()=>document.getElementById(b.dataset.guideJump)?.scrollIntoView({behavior:"smooth",block:"start"}));
    $$(`[data-guide-font]`, views.topic).forEach(b=>b.onclick=()=>{const current=parseInt(getComputedStyle(document.body).getPropertyValue('--guide-font-size'))||26;const next=Math.max(20,Math.min(36,current+(+b.dataset.guideFont)*2));document.body.style.setProperty('--guide-font-size',`${next}px`);toast(`Tekst: ${next}px`);});
    $$('.guide-script-tab',views.topic).forEach(btn=>btn.onclick=()=>{$$('.guide-script-tab',views.topic).forEach(x=>x.classList.toggle('active',x===btn));$$('.guide-script-content',views.topic).forEach(x=>x.classList.toggle('active',x.dataset.guideScriptPanel===btn.dataset.guideScript));});
    $$('.tab[data-tab]',views.topic).forEach(btn=>btn.onclick=()=>{$$('.tab[data-tab]',views.topic).forEach(x=>x.classList.toggle('active',x===btn));$$('.talk',views.topic).forEach(x=>x.classList.toggle('active',x.id===btn.dataset.tab));});
    $$('.map-stop[data-target]',views.topic).forEach(g=>g.onclick=()=>document.getElementById(g.dataset.target)?.scrollIntoView({behavior:'smooth',block:'start'}));
    initTopicQuiz(t);
  }
  function initTopicQuiz(t){
    const quiz=t.quiz||[]; const question=$("#quizQuestion",views.topic),answers=$("#quizAnswers",views.topic),feedback=$("#quizFeedback",views.topic),next=$("#nextQuestion",views.topic);
    if(!quiz.length||!question||!answers||!feedback||!next)return;let qi=0,locked=false;
    const draw=()=>{locked=false;const item=quiz[qi];question.textContent=item.question;feedback.textContent="";answers.innerHTML="";item.answers.forEach((txt,i)=>{const b=document.createElement('button');b.type='button';b.textContent=txt;b.onclick=()=>{if(locked)return;locked=true;[...answers.children].forEach((x,j)=>x.classList.add(j===item.correct?'correct':(j===i?'wrong':'')));feedback.textContent=(i===item.correct?'Dobrze. ':'Nie tym razem. ')+item.explanation;};answers.appendChild(b);});};
    next.onclick=()=>{qi=(qi+1)%quiz.length;draw();};draw();
  }
  function openTopic(id){location.hash=`topic/${id}`;}
  function enterGuide(){document.body.classList.add("guide-mode");window.scrollTo({top:0,behavior:"smooth"});}
  function exitGuide(){document.body.classList.remove("guide-mode");}

  function showView(name){Object.values(views).forEach(v=>v.classList.remove("active-view"));(views[name]||views.home).classList.add("active-view");$$('.nav-link').forEach(a=>a.classList.toggle("active",a.dataset.view===name));$("#mainContent").focus({preventScroll:true});}
  function routeHash(){const raw=location.hash.slice(1)||"home";if(raw.startsWith("topic/")){const id=raw.split("/")[1];showView("topic");renderTopic(id);}else if(raw==="library"){showView("library");renderLibrary();}else if(raw==="favorites"){showView("favorites");renderFavorites();}else if(raw==="route"){showView("route");renderRoute();}else{showView("home");renderHome();}closeSidebar();window.scrollTo(0,0);}

  function randomFact(){const candidates=topics().filter(t=>t.facts?.length);const t=candidates[Math.floor(Math.random()*candidates.length)];const fact=t.facts[Math.floor(Math.random()*t.facts.length)];factTopicId=t.id;$("#randomFactContent").innerHTML=`<h3>${escapeHtml(t.title)} · ${escapeHtml(t.city)}</h3><blockquote>${escapeHtml(fact)}</blockquote>`;if(!$("#factDialog").open)$("#factDialog").showModal();}
  function closeSidebar(){$("#sidebar").classList.remove("open");$("#sidebarBackdrop").classList.remove("show");}
  function initEvents(){
    window.addEventListener("hashchange",routeHash);
    $("#searchInput").addEventListener("input",e=>{state.query=e.target.value; if(location.hash!=="#library")location.hash="library";else renderLibrary();});
    document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#searchInput").focus();}if(e.key==="Escape")exitGuide();});
    $("#cityFilter").onchange=e=>{state.city=e.target.value;renderLibrary();}; $("#categoryFilter").onchange=e=>{state.category=e.target.value;renderLibrary();};
    $("#clearFiltersButton").onclick=()=>{state.city="";state.category="";state.query="";$("#searchInput").value="";renderLibrary();};
    $$('[data-layout]').forEach(b=>b.onclick=()=>{state.layout=b.dataset.layout;$$('[data-layout]').forEach(x=>x.classList.toggle("active",x===b));renderLibrary();});
    $$('[data-category]').forEach(b=>b.onclick=()=>{state.category=b.dataset.category;location.hash="library";renderLibrary();});
    $("#themeButton").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("wanfang:dark",document.body.classList.contains("dark")?"1":"0");};
    $("#guideModeButton").onclick=()=>{if(state.currentTopicId)enterGuide();else toast("Najpierw otwórz wybrany temat");};
    $("#menuButton").onclick=()=>{$("#sidebar").classList.add("open");$("#sidebarBackdrop").classList.add("show");};$("#sidebarBackdrop").onclick=closeSidebar;
    $("#randomTopicButton").onclick=randomFact;$("#anotherFactButton").onclick=randomFact;$("#openFactTopicButton").onclick=()=>{if(factTopicId){$("#factDialog").close();openTopic(factTopicId);}};
    $("#addTopicButton").onclick=()=>$("#topicDialog").showModal();
    $("#saveTopicButton").onclick=e=>{e.preventDefault();const form=$("#topicForm");if(!form.reportValidity())return;const fd=new FormData(form);const title=fd.get("title").trim();const id=`custom-${slug(title)}-${Date.now().toString().slice(-5)}`;const raw=fd.get("content").trim();state.customTopics.push({id,title,city:fd.get("city").trim(),category:fd.get("category"),chinese:fd.get("chinese").trim(),pronunciation:"",status:"szkic",readingTime:Math.max(2,Math.ceil(raw.split(/\s+/).length/180)),updated:new Date().toLocaleDateString("pl-PL"),icon:categorySymbol(fd.get("category")),accent:"gold",summary:fd.get("summary").trim(),tags:[fd.get("city").trim(),fd.get("category")],facts:[],quickTalk:fd.get("summary").trim(),sections:[{title:"Roboczy materiał",content:`<p>${escapeHtml(raw||"Treść do uzupełnienia.").replace(/\n/g,"</p><p>")}</p>`}],media:[]});save();updateCounts();renderHome();form.reset();$("#topicDialog").close();openTopic(id);toast("Temat został dodany");};
    $("#clearRouteButton").onclick=()=>{state.route=[];save();renderRoute();updateCounts();toast("Plan trasy wyczyszczony");};$("#printRouteButton").onclick=()=>window.print();
    $("#backupButton").onclick=exportBackup;$("#importInput").onchange=importBackup;
    window.addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;$("#readingProgress").style.width=(max>0?scrollY/max*100:0)+"%";});
  }
  function exportBackup(){const notes={};topics().forEach(t=>{const n=localStorage.getItem(`wanfang:notes:${t.id}`);if(n)notes[t.id]=n;});const data={version:1,date:new Date().toISOString(),favorites:[...state.favorites],route:state.route,customTopics:state.customTopics,notes};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`wanfang-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);}
  function importBackup(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const d=JSON.parse(reader.result);state.favorites=new Set(d.favorites||[]);state.route=d.route||[];state.customTopics=d.customTopics||[];Object.entries(d.notes||{}).forEach(([id,n])=>localStorage.setItem(`wanfang:notes:${id}`,n));save();updateCounts();renderHome();renderLibrary();renderFavorites();renderRoute();toast("Kopia została wczytana");}catch{toast("Nie udało się wczytać pliku");}};reader.readAsText(file);e.target.value="";}
  function init(){if(localStorage.getItem("wanfang:dark")==="1")document.body.classList.add("dark");updateCounts();renderHome();renderLibrary();renderFavorites();renderRoute();initEvents();routeHash();}
  init();
})();
