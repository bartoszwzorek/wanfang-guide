(()=>{
  const imported=window.WANFANG_IMPORTED_TOPICS||[];
  const all=[...imported,...(window.WANFANG_TOPICS||[]),...(window.WANFANG_EXPANDED_TOPICS||[])];
  const topic=all.find(t=>t&&t.id==='powitanie-grupy');
  if(topic){
    topic.title='Powitanie grupy — najważniejsze informacje na start';
    topic.status='pełne';
    topic.updated='13.09.2026';
    topic.readingTime=10;
    topic.summary='Gotowa odprawa na pierwsze minuty po przylocie: kontakt i QR do WhatsAppa oraz WeChata, skala i czas Chin, waluta, płatności, internet, tłumaczenie, AMap, paszport, skutery, toalety, różnice kulturowe, bezpieczeństwo i zasady zbiórek.';
    topic.quickTalk='Dzień dobry, nazywam się Bartek i będę z Państwem podczas naszego objazdu. Mój numer dostali Państwo na lotnisku, a za chwilę puszczę w autokarze QR do WhatsAppa i WeChata. Proszę zrobić zdjęcie obu kodów. Dalej kilka praktycznych rzeczy: czas, waluta, płatności, internet, mapy, tłumaczenie, paszport, ruch uliczny i zasady zbiórek.';
    topic.sections=window.WANFANG_WELCOME_SECTIONS||topic.sections;
    topic.preparationSections=[];
    topic.reviewNote='';
    topic.reviewState='zweryfikowane';
  }

  const appTopic={
    id:'praktyczne-aplikacje-chiny',
    title:'Aplikacje w Chinach — tłumaczenie, mapy i kontakt',
    chinese:'高德地图 · 翻译',
    pronunciation:'Gāodé Dìtú [gao-de di-tu] · fānyì [fan-i]',
    city:'Chiny',
    category:'Praktyczne',
    status:'pełne',
    readingTime:9,
    updated:'13.09.2026',
    icon:'📱',
    accent:'blue',
    summary:'Co zainstalować przed wyjazdem: tłumacz offline, AMap/高德地图 [gao-de di-tu], WhatsApp i WeChat; dlaczego Google Maps jest słabym wyborem w Chinach, dlaczego Apple Maps działa lepiej i jak naprawdę działa „przesunięcie GPS”.',
    tags:['AMap','Gaode','高德地图','Google Translate','tłumaczenie','mapy','Google Maps','Apple Maps','GCJ-02','WGS-84','WeChat','WhatsApp','paszport','angielski'],
    facts:[
      'Nie ma wiarygodnej oficjalnej statystyki mówiącej, że tylko 1% Chińczyków zna angielski. EF EPI 2025 klasyfikuje Chiny jako kraj o niskiej biegłości i umieszcza je na 86. miejscu wśród 123 badanych krajów i regionów.',
      'Według chińskiej administracji imigracyjnej liczba ważnych zwykłych paszportów przekroczyła 160 mln w lipcu 2025 r. Przy populacji około 1,405 mld daje to z grubsza 11–12%, czyli około jedną osobę na dziewięć.',
      'AMap / 高德地图 Gāodé Dìtú [gao-de di-tu] używa w Chinach systemu współrzędnych GCJ-02, wymaganego dla internetowych map w Chinach kontynentalnych.',
      'To nie satelity GPS „przesuwają” pozycję. GPS/GNSS operuje w WGS-84; przesunięcie pojawia się przy publikowanych mapach, gdy współrzędne są transformowane do GCJ-02 albo gdy warstwy z różnych systemów nie są poprawnie dopasowane.',
      'Apple Maps w Chinach korzysta z usług mapowych AMap, dlatego działa tam znacznie lepiej niż Google Maps.'
    ],
    quickTalk:'Przed wyjazdem do Chin oprócz Alipay i WeChata warto mieć dwie rzeczy: tłumacz z pobranym chińskim offline oraz AMap, czyli 高德地图 Gāodé Dìtú [gao-de di-tu]. Nie liczymy na to, że przypadkowo spotkana osoba będzie mówiła po angielsku. Google Maps w Chinach jest słabym wyborem; Apple Maps działa lepiej, bo korzysta z lokalnych danych AMap. I ważne: nie GPS jest „przesunięty” — problem wynika z różnych systemów współrzędnych używanych przez mapy.',
    sections:[
      {
        id:'minimum',
        title:'1. Minimum aplikacji przed wyjazdem',
        content:`<p>Proszę Państwa, w Chinach telefon jest naprawdę częścią podstawowego wyposażenia turysty. Tak jak warto mieć Alipay [ali-pej] do płatności i WeChat [łi-czat] do kontaktu, tak samo warto przygotować dwie kolejne rzeczy: <strong>tłumacz</strong> oraz <strong>dobrą lokalną mapę</strong>.</p><p>Moje minimum przed wyjazdem to: Alipay, WeChat, WhatsApp jako kontakt z pilotem, aplikacja do tłumaczenia z pobranym językiem chińskim oraz <strong>AMap / 高德地图 Gāodé Dìtú [gao-de di-tu]</strong>. Dobrze zrobić to jeszcze w Polsce, zalogować się tam, gdzie trzeba, i pobrać dane offline.</p>`
      },
      {
        id:'tlumaczenie',
        title:'2. Tłumaczenie — nie zakładaj, że ktoś będzie mówił po angielsku',
        content:`<p>Warto mieć aplikację tłumaczącą nawet wtedy, gdy sami dobrze znamy angielski. W Chinach angielski jest powszechnie nauczany w szkołach, ale <strong>praktyczna umiejętność swobodnej rozmowy jest bardzo nierówna</strong>. W hotelach wyższej klasy, na lotniskach i w części atrakcji turystycznych porozumiemy się po angielsku znacznie łatwiej niż w małym sklepie, lokalnej restauracji czy z przypadkowym przechodniem.</p><p>Często można spotkać twierdzenie, że „tylko 1% Chińczyków mówi po angielsku”. <strong>Nie używałbym tej liczby</strong>, bo nie znalazłem solidnej oficjalnej statystyki, która by ją potwierdzała. Lepszy punkt odniesienia daje EF English Proficiency Index 2025: Chiny kontynentalne zajęły 86. miejsce na 123 badane kraje i regiony i zostały sklasyfikowane jako poziom <strong>niski</strong>. Badanie nie mierzy jednak procentu całej populacji mówiącej po angielsku, tylko poziom uczestników testu.</p><p>Jeżeli używacie <strong>Google Translate</strong>, pobierzcie przed wyjazdem język chiński uproszczony do tłumaczenia offline. Google oficjalnie pozwala pobrać pakiet językowy i tłumaczyć bez połączenia z internetem; w części urządzeń dostępne jest też tłumaczenie aparatem. To ważne, bo usługi Google na zwykłym chińskim połączeniu internetowym mogą być niedostępne.</p><p>W praktyce bardzo dobrze działa prosty schemat: wpisujemy po polsku albo angielsku krótkie zdanie, pokazujemy tłumaczenie na ekranie, a rozmówca odpowiada do telefonu. Im prostsze zdania, tym lepiej.</p><p><a href="https://www.ef.com/wwen/epi/regions/asia/china/" target="_blank" rel="noreferrer noopener">EF EPI 2025 — China</a> · <a href="https://support.google.com/translate/answer/6142473" target="_blank" rel="noreferrer noopener">Google Translate — języki offline</a></p>`
      },
      {
        id:'amap',
        title:'3. AMap / 高德地图 Gāodé Dìtú [gao-de di-tu] — mapa, którą warto mieć',
        content:`<p>Do poruszania się po Chinach polecam przede wszystkim <strong>AMap</strong>, po chińsku <strong>高德地图 Gāodé Dìtú [gao-de di-tu]</strong>. To jedna z głównych chińskich platform mapowych. Ma bardzo dobre lokalne dane o ulicach, komunikacji publicznej, ruchu, restauracjach, hotelach i punktach usługowych.</p><p>Od 2025 roku AMap rozwija wersję przeznaczoną dla użytkowników zagranicznych. Dostępny jest interfejs angielski, a następnie dodano kolejne języki. W 2026 roku wersja AMap Global rozszerzała funkcje dla turystów, obejmując m.in. nawigację, lokalne rekomendacje, informacje praktyczne oraz zamawianie przejazdów.</p><p>Dla turysty oznacza to jedną bardzo praktyczną rzecz: zamiast szukać chińskiej restauracji w zagranicznej bazie, korzystamy z aplikacji, z której korzystają ludzie na miejscu i która ma bieżące dane o chińskich ulicach i usługach.</p><p><a href="https://english.shanghai.gov.cn/en-EasyShanghai/20260713/379bcea6e1bd4defaa7db2451d68d3dd.html" target="_blank" rel="noreferrer noopener">Shanghai — AMap dla zagranicznych użytkowników</a></p>`
      },
      {
        id:'google-apple-gps',
        title:'4. Google Maps, Apple Maps i „przesunięty GPS” — co naprawdę się dzieje?',
        content:`<p>Tu warto sprostować popularny mit. <strong>Chiński rząd nie przesuwa sygnału satelitów GPS.</strong> Telefon nadal może wyznaczyć pozycję w globalnym układzie WGS-84. Problem pojawia się na poziomie map publikowanych w Chinach.</p><p>Chińskie internetowe serwisy mapowe używają systemu <strong>GCJ-02</strong>. AMap w swojej dokumentacji wprost podaje, że korzysta z GCJ-02, który jest oparty na WGS-84, ale zawiera transformację współrzędnych. Jeśli dane GPS albo zdjęcia satelitarne w WGS-84 zostaną nałożone na warstwę dróg w GCJ-02 bez właściwego przeliczenia, na ekranie może wyglądać tak, jakby droga, budynek albo nasza pozycja były przesunięte o setki metrów.</p><p>To nie jest stałe przesunięcie typu „zawsze 300 metrów na wschód”. Zależy od miejsca i trzeba je prawidłowo przeliczać.</p><p><strong>Google Maps</strong> jest w Chinach słabym wyborem nie tylko z powodu dostępu do usług Google, ale również dlatego, że jego lokalne dane nie są tak kompletne i aktualne jak w chińskich serwisach. Natomiast <strong>Apple Maps to inna historia</strong>: Apple oficjalnie podaje, że w Chinach korzysta z usług mapowych AMap. Dlatego Apple Maps na iPhonie może działać całkiem dobrze i nie powinno się wrzucać go do jednego worka z Google Maps. Mimo to AMap daje zwykle więcej lokalnych informacji i funkcji.</p><p><a href="https://developer.amap.com/faq/advisory/others/39838" target="_blank" rel="noreferrer noopener">AMap — system współrzędnych GCJ-02</a> · <a href="https://www.apple.com/sg/legal/privacy/data/en/apple-maps/" target="_blank" rel="noreferrer noopener">Apple — Maps Service in China</a></p>`
      },
      {
        id:'paszport',
        title:'5. Ciekawostka: ilu Chińczyków ma paszport?',
        content:`<p>To dobry kontekst do rozmowy o tym, dlaczego zagraniczny turysta i swobodna komunikacja po angielsku nie są czymś, z czym każdy Chińczyk ma codzienny kontakt.</p><p>Według chińskiej National Immigration Administration w lipcu 2025 roku liczba <strong>ważnych zwykłych paszportów przekroczyła 160 milionów</strong>. Populacja Chin pod koniec 2025 roku wynosiła około <strong>1,405 miliarda osób</strong>. Zestawiając te dwie liczby, wychodzi mniej więcej <strong>11–12% populacji</strong>, czyli około <strong>jedna osoba na dziewięć</strong>.</p><p>To tylko przybliżenie: dane o paszportach i populacji pochodzą z różnych momentów roku, a liczba paszportów nadal rośnie. Nie oznacza też, że każdy posiadacz ważnego paszportu regularnie podróżuje za granicę. Daje jednak dobrą skalę: większość mieszkańców Chin nadal nie posiada ważnego zwykłego paszportu.</p><p><a href="https://english.www.gov.cn/archive/statistics/202507/30/content_WS6889afe6c6d0868f4e8f48b7.html" target="_blank" rel="noreferrer noopener">Rząd Chin / NIA — ponad 160 mln ważnych paszportów</a> · <a href="https://www.stats.gov.cn/english/PressRelease/202602/t20260228_1962661.html" target="_blank" rel="noreferrer noopener">National Bureau of Statistics — populacja 2025</a></p>`
      },
      {
        id:'checklista',
        title:'6. Checklista telefonu przed wylotem',
        content:`<ul><li><strong>Alipay [ali-pej]</strong> — podpięta karta i zrobiona mała transakcja testowa.</li><li><strong>WeChat [łi-czat]</strong> — konto uruchomione; zdjęcie QR pilota zapisane w telefonie.</li><li><strong>WhatsApp</strong> — numer pilota zapisany; główny kanał kontaktu z grupą.</li><li><strong>Tłumacz</strong> — pobrany chiński uproszczony do pracy offline.</li><li><strong>AMap / 高德地图 Gāodé Dìtú [gao-de di-tu]</strong> — zainstalowana aktualna wersja międzynarodowa.</li><li><strong>Adres pierwszego hotelu po chińsku</strong> — screenshot zapisany lokalnie.</li><li><strong>DiDi [di-di]</strong> — przydatne do samodzielnych powrotów.</li><li>Telefon, powerbank i dostęp do danych mobilnych gotowe jeszcze przed wyjściem z lotniska.</li></ul>`
      }
    ],
    guideScripts:[]
  };

  if(!all.some(t=>t&&t.id===appTopic.id)) imported.push(appTopic);

  const catalog=window.WANFANG_CATALOG;
  if(Array.isArray(catalog)){
    const i=catalog.findIndex(c=>c&&c.id==='powitanie-grupy');
    if(i>=0){
      const e=catalog.splice(i,1)[0];
      e.title='Powitanie grupy — najważniejsze informacje na start';
      e.topicId='powitanie-grupy';
      e.sectionId=null;
      catalog.unshift(e);
    }
    if(!catalog.some(c=>c&&c.id==='praktyczne-aplikacje-chiny')){
      catalog.splice(1,0,{id:'praktyczne-aplikacje-chiny',title:appTopic.title,region:'Chiny',programs:['CHT','CJA','CTF'],topicId:appTopic.id,sectionId:null,outline:['Google Translate offline','AMap / 高德地图','Google Maps a Apple Maps','GCJ-02 i WGS-84','angielski w Chinach','paszporty'],aliases:['aplikacje chiny','amap','gaode','google translate','google maps','apple maps','gcj-02','tlumacz'],origin:'Materiały praktyczne i aktualizacja 13.09.2026',review:'Zweryfikowane źródła 2025–2026'});
    }
  }
  delete window.WANFANG_WELCOME_SECTIONS;
})();
