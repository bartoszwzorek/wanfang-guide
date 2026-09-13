if (typeof window !== 'undefined' && window.WANFANG_NIGHT_ECONOMY) {
  const topic = window.WANFANG_NIGHT_ECONOMY;
  topic.guideScripts = [
    {id:'60s',title:'Wersja około 60 sekund',content:'<p>Proszę państwa, kiedy patrzymy na Szanghaj [Szang-haj] nocą, warto zauważyć, że restauracje, światła i ludzie na ulicach nie działają w próżni. Chińczycy mówią o <strong>夜间经济 Yèjiān jīngjì [je-dzien dzing-dzi]</strong>, czyli nocnej gospodarce. Jednym z jej fundamentów jest poczucie bezpieczeństwa: ludzie zostają na mieście, jedzą późno i spacerują, bo zakładają, że mogą potem spokojnie wrócić. Do tego dochodzi transport — metro do późna, a po jego zamknięciu całodobowe taksówki i DiDi [Di-di] — oraz płatności mobilne, dostawy i ogromna liczba lokali. Nocna gospodarka nie zaczyna się od lampionów. Zaczyna się od tego, że człowiek chce i może zostać w mieście kilka godzin dłużej.</p>'}
  ];
  topic.sources = [
    {name:'International Services Shanghai — bezpieczeństwo',url:'https://english.shanghai.gov.cn/en-FAQHome/20231214/3bc460d513db4362930b0cac58296400.html',date:'2026-09-13'},
    {name:'Shanghai Tonight 2026',url:'https://english.shanghai.gov.cn/en-Latest-WhatsNew/20260607/5c12f98b1e014a1b82d3d49e98ce8ac3.html',date:'2026-06-07'},
    {name:'Shanghai night economy index',url:'https://english.shanghai.gov.cn/en-Latest-WhatsNew/20250730/091f98b252e64d7ba77daccc9656bafa.html',date:'2025-07-30'},
    {name:'Taking a taxi in Shanghai',url:'https://english.shanghai.gov.cn/en-Transportation/20250919/5dd5b4725b7344cab776d3ddcbce224d.html',date:'2025-09-19'},
    {name:'How to use DiDi',url:'https://english.shanghai.gov.cn/en-Individuals-MobileandInternet-Popularapps/20260826/4e46975d38f148cb9cf830021d349c46.html',date:'2026-08-26'}
  ];
  window.WANFANG_IMPORTED_TOPICS = window.WANFANG_IMPORTED_TOPICS || [];
  const ti = window.WANFANG_IMPORTED_TOPICS.findIndex(x => x.id === topic.id);
  if (ti >= 0) window.WANFANG_IMPORTED_TOPICS[ti] = topic; else window.WANFANG_IMPORTED_TOPICS.push(topic);

  window.WANFANG_CATALOG = window.WANFANG_CATALOG || [];
  const cat = {id:'nocna-gospodarka',title:'Nocna gospodarka i życie po zmroku',region:'Szanghaj / Chiny',programs:['CHT','CJA','CTF'],topicId:'nocna-gospodarka',sectionId:null,outline:['bezpieczeństwo','nocne jedzenie i markety','metro, taksówki i DiDi','Shanghai Tonight','iluminacje i przestrzeń publiczna'],aliases:['nocna gospodarka','night economy','nocne markety','życie nocne','夜间经济','Shanghai Tonight'],origin:'Wcześniejsza rozmowa o Szanghaju + aktualizacja 13.09.2026',review:'Zaktualizowano 13.09.2026'};
  const ci = window.WANFANG_CATALOG.findIndex(x => x.id === cat.id);
  if (ci >= 0) window.WANFANG_CATALOG[ci] = cat; else window.WANFANG_CATALOG.push(cat);

  const sh = window.WANFANG_IMPORTED_TOPICS.find(x => x.id === 'szanghaj');
  if (sh && !(sh.sections || []).some(x => x.id === 'nocna-gospodarka-link')) {
    sh.sections = sh.sections || [];
    sh.sections.push({id:'nocna-gospodarka-link',title:'Powiązany temat: Szanghaj [Szang-haj] po zmroku',content:'<p>Bezpieczeństwo przestrzeni publicznej, późne jedzenie, metro i całodobowe taksówki, DiDi [Di-di], dostawy, iluminacje oraz miejskie programy konsumpcji tworzą razem <strong>夜间经济 Yèjiān jīngjì [je-dzien dzing-dzi]</strong>.</p><p><a href="#topic/nocna-gospodarka"><strong>Otwórz pełny rozdział o nocnej gospodarce →</strong></a></p>'});
  }
  delete window.WANFANG_NIGHT_ECONOMY;
}
