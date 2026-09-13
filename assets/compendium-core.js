(function (root) {
  'use strict';
  const fold = value => String(value || '').toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const text = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = value => text(value).split(/\s+/).filter(Boolean).length;
  const matches = (haystack, query) => fold(query).trim().split(/\s+/).filter(Boolean).every(token => fold(haystack).includes(token));
  const unique = list => [...new Set(list)];
  const validId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,110}$/.test(value) && !['__proto__','constructor','prototype'].includes(value);
  function dateForDay(start, offset) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start || '')) return '';
    const date = new Date(start + 'T12:00:00Z');
    if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0,10) !== start || !Number.isInteger(offset)) return '';
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  }
  function validateTrip(t) {
    return t && validId(t.id) && typeof t.name === 'string' && t.name.length <= 200 &&
      ['CHT', 'CJA', 'CTF'].includes(t.program) && typeof t.variant === 'string' &&
      Array.isArray(t.order) && t.order.length <= 40 && t.order.every(n => Number.isInteger(n) && n > 0 && n <= 40) &&
      unique(t.order).length === t.order.length &&
      (!t.startDate || Boolean(dateForDay(t.startDate,0)));
  }
  function cleanTrip(t) {
    if (!validateTrip(t)) throw new Error('Nieprawidłowy objazd w kopii.');
    const strings = obj => Object.fromEntries(Object.entries(obj || {}).filter(([k,v]) => validId(k) && typeof v === 'string').map(([k,v]) => [k, v.slice(0,100000)]));
    return {id:t.id,name:t.name,program:t.program,variant:t.variant,startDate:t.startDate || '',order:[...t.order],notes:strings(t.notes),titles:strings(t.titles),told:unique((t.told || []).filter(validId)),confirmed:unique((t.confirmed || []).filter(n=>Number.isInteger(n)&&t.order.includes(n))),lastDay:Number(t.lastDay)||t.order[0],created:t.created || ''};
  }
  function mergeExtension(current, incoming) {
    if (!incoming) return current;
    if (!Array.isArray(incoming.trips) || incoming.trips.length > 300) throw new Error('Nieprawidłowa lista objazdów.');
    const trips = new Map((current.trips || []).map(t => [t.id, cleanTrip(t)]));
    for (const t of incoming.trips) {
      const fresh=cleanTrip(t), old=trips.get(fresh.id);
      if (old) {
        fresh.notes={...old.notes,...fresh.notes};fresh.titles={...old.titles,...fresh.titles};
        fresh.told=unique([...old.told,...fresh.told]);
      }
      trips.set(fresh.id,fresh);
    }
    const progress=Object.fromEntries(Object.entries({...current.progress,...incoming.progress}).filter(([id,p])=>validId(id)&&p&&validId(p.section)&&Number.isFinite(p.updated)).map(([id,p])=>[id,{section:p.section,updated:p.updated}]));
    const bindings=Object.fromEntries(Object.entries({...current.bindings,...incoming.bindings}).filter(([id,topic])=>validId(id)&&validId(topic)));
    const validDayKey=value=>/^(?:(?:CHT|CJA|CTF)\/[a-zA-Z0-9_-]+|trip\/[a-zA-Z0-9_-]+)\/(?:[1-9]|[1-3][0-9]|40)$/.test(value);
    const dayTopics=Object.fromEntries(Object.entries({...current.dayTopics,...incoming.dayTopics}).filter(([key,ids])=>validDayKey(key)&&Array.isArray(ids)&&ids.length<=100).map(([key,ids])=>[key,unique(ids.filter(validId))]));
    return {version:2,trips:[...trips.values()],activeTrip:trips.has(incoming.activeTrip)?incoming.activeTrip:current.activeTrip || '',progress,bindings,dayTopics};
  }
  function topicFromCatalog(item, topics) { return topics.find(t => t.id === item.topicId); }
  function materialInfo(item, topics) {
    const topic=topicFromCatalog(item,topics);
    if (!topic) return {status:'missing',label:'Do opracowania',words:0};
    const sections=item.sectionId ? topic.sections.filter(s=>s.id===item.sectionId) : topic.sections || [];
    const count=words(sections.map(s=>s.content).join(' '));
    const short=topic.coverage==='fragment' || topic.status==='szkic' || count<350;
    return {status:short?'fragment':'material',label:short?'Krótki materiał':'Materiał',words:count};
  }
  function talkOptions(topic, minutes) {
    return (topic.guideScripts || []).map(script => ({...script,minutes:Math.max(1,Math.ceil(words(script.content)/130))})).filter(script=>script.minutes<=minutes);
  }
  const api={fold,text,words,matches,unique,validId,dateForDay,validateTrip,cleanTrip,mergeExtension,topicFromCatalog,materialInfo,talkOptions};
  root.WanfangCore=api;
  if (typeof module !== 'undefined' && module.exports) module.exports=api;
})(typeof window !== 'undefined' ? window : globalThis);

/* 2026-09-13: pełny materiał „Praca, zarobki i 996” oraz powiązania z gaokao, hukou i urbanizacją. */
if (typeof window !== 'undefined') {
  const topic = {
    id: 'praca-996',
    title: 'Praca, zarobki i wykształcona młodzież w Chinach',
    city: 'Chiny',
    category: 'Życie codzienne',
    status: 'materiał',
    updated: '13.09.2026',
    icon: '工',
    accent: 'blue',
    summary: 'Od gaokao i studiów do pierwszej pracy: ile naprawdę zarabia się w Chinach, dlaczego dyplom coraz rzadziej gwarantuje dobry etat, skąd wysokie bezrobocie młodych, czym jest 996 i dlaczego część pokolenia odpowiada na presję hasłami nèijuǎn [nej-dżüen] i tǎng píng [tang ping].',
    tags: ['praca','zarobki','996','absolwenci','młodzież','bezrobocie','gaokao','hukou','tang ping','neijuan','Chiny'],
    facts: [
      'W 2026 roku liczba absolwentów chińskich szkół wyższych ma wynieść około 12,7 mln — rekordowo dużo.',
      'W lipcu 2026 r. stopa bezrobocia w miastach w grupie 16–24 lata, po wyłączeniu studentów, wyniosła 17,9%; w grupie 25–29 lat 7,2%.',
      'W 2025 r. średnie roczne wynagrodzenie w miejskich jednostkach prywatnych wyniosło 71 590 RMB, a w szeroko rozumianych jednostkach nieprywatnych 129 441 RMB.',
      'Oficjalne dane NBS za lipiec 2026 mówiły o średnio 48,2 godziny pracy tygodniowo w przedsiębiorstwach.',
      'System 996 — 9:00–21:00 przez 6 dni w tygodniu — nie jest legalnym standardem czasu pracy; chińskie organy pracy i sądy wskazywały takie praktyki jako naruszające prawo.'
    ],
    quickTalk: 'Współczesny paradoks Chin polega na tym, że kraj nigdy nie miał tylu wykształconych młodych ludzi, a jednocześnie dla wielu z nich sam dyplom przestał być gwarancją dobrego życia. W 2026 roku na rynek pracy wchodzi około 12,7 miliona absolwentów. W lipcu bezrobocie wśród osób 16–24 lata poza systemem edukacji wynosiło 17,9%. A kiedy pracę już znajdą, różnice są ogromne: od kilku tysięcy juanów miesięcznie w usługach po znacznie wyższe zarobki w IT, finansach czy zawodach technicznych. Do tego dochodzi kultura nadgodzin, presja na mieszkanie, ślub i wsparcie rodziców. Dlatego żeby zrozumieć dzisiejszą chińską młodzież, trzeba połączyć gaokao, rynek pracy, 996, nèijuǎn [nej-dżüen] i tǎng píng [tang ping] w jedną historię.',
    sections: [
      {
        id: 'pigulka',
        title: 'Najważniejsze informacje w skrócie',
        content: `<div class="plan"><ul>
<li><strong>Nie ma jednej „chińskiej pensji”.</strong> Inaczej zarabia się w Szanghaju czy Shenzhen [Szen-dżen], inaczej w mieście trzeciego rzędu, inaczej w IT, a inaczej w gastronomii.</li>
<li><strong>2026 to rekordowa fala absolwentów:</strong> około 12,7 mln osób kończących szkoły wyższe.</li>
<li><strong>Bezrobocie młodych pozostaje wysokie:</strong> w lipcu 2026 r. 17,9% w grupie 16–24 lata poza studentami oraz 7,2% w grupie 25–29 lat.</li>
<li><strong>Średnie zarobki bardzo zależą od definicji:</strong> w 2025 r. 71 590 RMB rocznie w miejskich jednostkach prywatnych i 129 441 RMB w jednostkach nieprywatnych.</li>
<li><strong>Wykształcenie nadal jest ogromnie ważne, ale sam dyplom już nie wystarcza.</strong> Problemem jest niedopasowanie kierunków studiów i oczekiwań do liczby dobrych stanowisk.</li>
<li><strong>996 nie jest legalnym „systemem pracy”.</strong> To skrót od 9:00–21:00 przez sześć dni w tygodniu i symbol kultury skrajnych nadgodzin.</li>
<li><strong>Presja nie kończy się na znalezieniu pracy.</strong> Dochodzi mieszkanie, małżeństwo, pomoc rodzicom i oczekiwanie awansu.</li>
<li><strong>nèijuǎn [nej-dżüen]</strong> opisuje poczucie wyścigu bez końca, a <strong>tǎng píng [tang ping]</strong> — próbę wycofania się z części tego wyścigu.</li>
</ul></div>
<div class="trivia"><strong>Powiązane tematy:</strong> <a href="#topic/gaokao">Szkoła i gāokǎo [gao-kao]</a> · <a href="#topic/hukou">Hùkǒu [hu-kou] i migracje</a> · <a href="#topic/urbanizacja">Urbanizacja i nowe miasta</a> · <a href="#catalog/rodzina-malzenstwo">Rodzina, małżeństwa i dziadkowie</a> · <a href="#catalog/aplikacje-dostawy">DiDi, dostawy i praca platformowa</a></div>`
      },
      {
        id: 'intro',
        title: '1. Mocne wejście — dyplom, który kiedyś był biletem w górę',
        content: `<p>Proszę państwa, kiedy mówimy o chińskiej młodzieży, bardzo łatwo zatrzymać się na jednym obrazku: dzieci uczące się po nocach, rodzice czekający przed szkołą podczas egzaminu, uczniowie przygotowujący się do <strong>gāokǎo [gao-kao]</strong>. I wtedy naturalnie zakładamy: skoro człowiek przejdzie przez ten cały wyścig, dostanie się na uczelnię, skończy studia i będzie miał dyplom, to później już musi być dobrze.</p>
<p>I właśnie tutaj zaczyna się jedna z najciekawszych opowieści o współczesnych Chinach. Bo przez bardzo długi czas edukacja rzeczywiście była jedną z najbardziej oczywistych dróg awansu społecznego. W dawnych Chinach zdanie egzaminów urzędniczych mogło wynieść rodzinę do świata prestiżu. W XX i XXI wieku studia, szczególnie na dobrej uczelni, stały się nowoczesną wersją podobnego marzenia: dziecko się uczy, rodzina inwestuje, młody człowiek jedzie do wielkiego miasta i dzięki wykształceniu wchodzi do klasy średniej.</p>
<p>Tyle że Chiny wykształciły ogromną liczbę ludzi. Szkolnictwo wyższe przestało być klubem dla nielicznych. W 2026 roku liczba absolwentów szkół wyższych ma osiągnąć około <strong>12,7 miliona</strong>. To znaczy, że każdego roku na rynek pracy wchodzi populacja porównywalna z dużym europejskim państwem albo kilkoma wielkimi metropoliami naraz.</p>
<p>I nagle pojawia się problem: gospodarka może tworzyć miliony miejsc pracy, ale niekoniecznie tworzy tyle samo miejsc pracy, jakich oczekują absolwenci. Ktoś studiował pięć lat, rodzice wydali pieniądze, rodzina poświęciła ogrom czasu i energii, a na końcu okazuje się, że oferta to przeciętna pensja, długie godziny, praca niezgodna z kierunkiem albo konieczność przeprowadzki do mniejszego miasta.</p>
<p>To właśnie jest punkt, w którym spotykają się edukacja, gospodarka, demografia, ceny mieszkań, rodzina i kultura pracy. Dlatego temat zarobków w Chinach nie powinien zaczynać się od pytania: „ile zarabia Chińczyk?”. Lepsze pytanie brzmi: <strong>jaką drogę musi przejść młody Chińczyk, żeby zamienić edukację w stabilne dorosłe życie?</strong></p>
<div class="transition"><strong>Przejście do innego materiału:</strong> jeśli grupa pyta, skąd bierze się ta presja edukacyjna, otwórz <a href="#topic/gaokao">„Szkoła i gāokǎo [gao-kao]”</a>.</div>`
      },
      {
        id: 'zarobki',
        title: '2. Ile zarabia się w Chinach? Najpierw trzeba uważać na statystyki',
        content: `<p>Jeśli ktoś zapyta: „dobra, ale ile oni właściwie zarabiają?”, najgorsze, co możemy zrobić, to podać jedną liczbę i udawać, że opisuje ona cały kraj. Chiny są zbyt duże, zbyt nierówne regionalnie i zbyt zróżnicowane branżowo.</p>
<p>Najświeższe pełne dane Narodowego Biura Statystycznego Chin, czyli NBS, dotyczą roku 2025. Według nich średnie roczne wynagrodzenie pracowników w <strong>miejskich jednostkach prywatnych</strong> wyniosło <strong>71 590 RMB</strong>. To w prostym podziale daje około <strong>5 966 RMB miesięcznie</strong>. W szerokiej kategorii <strong>miejskich jednostek nieprywatnych</strong> średnia wyniosła <strong>129 441 RMB rocznie</strong>, czyli około <strong>10 787 RMB miesięcznie</strong>.</p>
<p>Ale uwaga: „jednostki nieprywatne” w statystyce NBS nie znaczą po prostu „budżetówka”. To szersza kategoria obejmująca między innymi część jednostek publicznych i państwowych, ale również inne typy podmiotów. Z kolei badanie miejskich jednostek nie obejmuje wszystkich samozatrudnionych i freelancerów. Dlatego te liczby są świetne do pokazania skali, ale nie wolno przedstawiać ich jako pensji typowego Chińczyka „na rękę”.</p>
<p>Różnice branżowe są jeszcze większe. W jednostkach nieprywatnych sektor informacji, oprogramowania i IT miał w 2025 roku średnią około <strong>248 752 RMB rocznie</strong>, finanse około <strong>211 164 RMB</strong>, podczas gdy hotele i gastronomia około <strong>62 461 RMB</strong>. W sektorze prywatnym IT to około <strong>128 166 RMB rocznie</strong>, finanse około <strong>140 451 RMB</strong>, a nieruchomości około <strong>53 338 RMB</strong>.</p>
<p>To pokazuje coś ważnego: w Chinach ten sam dyplom może prowadzić do kompletnie innego standardu życia zależnie od miasta, firmy i branży. Młody programista w Shenzhen [Szen-dżen] może zarabiać wielokrotność pracownika restauracji w mniejszym mieście, ale jednocześnie płacić znacznie więcej za mieszkanie, dojazdy i całe miejskie życie.</p>
<p>Jeszcze inną perspektywę daje dochód rozporządzalny mieszkańców. W 2025 roku dochód rozporządzalny na osobę wynosił średnio <strong>56 502 RMB w miastach</strong> i <strong>24 456 RMB na wsi</strong>. To nie jest pensja, tylko szerszy wskaźnik dochodu gospodarstwa domowego przypadającego na osobę, ale bardzo dobrze pokazuje przepaść miejsko-wiejską.</p>
<div class="trivia"><strong>Dobra puenta do grupy:</strong> „W Chinach nie ma jednej średniej pensji tak samo, jak nie ma jednego kosztu życia. Pytanie o zarobki bez pytania o miasto i branżę jest trochę jak pytanie: ile zarabia Europejczyk?”</div>`
      },
      {
        id: 'absolwenci',
        title: '3. 12,7 miliona absolwentów — kiedy sukces edukacyjny tworzy nowy problem',
        content: `<p>W 2026 roku Chiny spodziewają się około <strong>12,7 miliona absolwentów szkół wyższych</strong>, o około 480 tysięcy więcej niż rok wcześniej. To rekord. I sam w sobie jest to przecież sukces: coraz więcej ludzi ma dostęp do studiów, coraz więcej rodzin może posłać dzieci na uczelnię, a państwo dysponuje ogromną bazą wykształconych pracowników.</p>
<p>Ale kiedy system edukacyjny produkuje miliony absolwentów rocznie, następuje coś, co znamy także z Europy: <strong>sam dyplom przestaje automatycznie odróżniać człowieka od konkurencji</strong>. To, co dla pokolenia rodziców było wyjątkowym atutem, dla pokolenia dzieci staje się często punktem wyjścia.</p>
<p>W Chinach ten efekt jest szczególnie silny, bo skala jest gigantyczna. Dobra uczelnia nadal ma znaczenie. Kierunek nadal ma znaczenie. Kontakty, praktyki, znajomość technologii, języków, lokalizacja i reputacja uczelni też mają znaczenie. Ale absolwent nie konkuruje już z kilkoma tysiącami ludzi o miejski etat. Konkuruje w systemie, w którym miliony podobnie wykształconych osób w tym samym momencie próbują wejść na rynek.</p>
<p>Do tego dochodzi niedopasowanie kwalifikacji. Państwo samo przyznaje, że trzeba lepiej łączyć ofertę uczelni z realnym zapotrzebowaniem gospodarki. W okresie czternastego planu pięcioletniego uczelnie dodały tysiące nowych programów, ale tysiące innych zawiesiły lub zlikwidowały. To nie jest kosmetyka. To próba odpowiedzi na bardzo praktyczny problem: gospodarka potrzebuje ludzi w AI, nowych energiach, zaawansowanej produkcji, opiece zdrowotnej czy usługach, a część absolwentów kończy kierunki, po których liczba atrakcyjnych stanowisk jest ograniczona.</p>
<p>Dlatego można mieć sytuację pozornie absurdalną: firma produkcyjna szuka techników i operatorów, a jednocześnie absolwent kierunku akademickiego mówi, że „nie ma pracy”. Oczywiście praca istnieje — problem polega na tym, czy odpowiada jego kwalifikacjom, oczekiwaniom, miejscu zamieszkania i temu, na co rodzina przez lata go przygotowywała.</p>
<div class="transition">To jest bezpośrednia kontynuacja rozdziału <a href="#topic/gaokao">„Szkoła i gāokǎo [gao-kao]”</a>: egzamin otwiera drzwi do uczelni, ale uczelnia nie gwarantuje już automatycznie dobrego etatu.</div>`
      },
      {
        id: 'bezrobocie-mlodych',
        title: '4. Bezrobocie młodych — dlaczego ogólny wynik wygląda dobrze, a absolwenci czują kryzys',
        content: `<p>I tutaj pojawia się liczba, która robi wrażenie. W lipcu 2026 roku stopa bezrobocia w miastach dla osób w wieku <strong>16–24 lata, po wyłączeniu studentów, wyniosła 17,9%</strong>. Dla grupy <strong>25–29 lat było to 7,2%</strong>. Dla całej miejskiej gospodarki wskaźnik był w tym samym czasie znacznie niższy — około 5,2%.</p>
<p>To jest bardzo dobry przykład, dlaczego jedna średnia potrafi zasłonić problem. Ogólny rynek pracy może być względnie stabilny, a jednocześnie wejście młodych ludzi do świata zawodowego może być bardzo trudne.</p>
<p>Trzeba też uczciwie dodać, że lipiec i sierpień są sezonowo trudne, bo wtedy ogromna fala absolwentów kończy szkoły i studia, przestaje być liczona jako uczniowie czy studenci i wchodzi do grupy aktywnej zawodowo. Dlatego skok w lecie nie oznacza, że w jednym miesiącu nagle „zepsuło się” kilka milionów miejsc pracy. Część tego ruchu jest sezonowa.</p>
<p>Ale wysoki poziom utrzymujący się wśród młodych pokazuje realny problem: firmy są ostrożniejsze w rekrutacji, część tradycyjnych sektorów zwalnia, nieruchomości nie są już takim silnikiem jak kiedyś, a automatyzacja i sztuczna inteligencja zmieniają część stanowisk biurowych. Jednocześnie młodzi ludzie nie zawsze chcą brać pierwszą lepszą pracę, bo po latach edukacji oczekują stanowiska odpowiadającego ich inwestycji.</p>
<p>Warto więc powiedzieć grupie: <strong>bezrobocie młodych w Chinach nie oznacza, że młodzi nic nie robią</strong>. Część przedłuża edukację, przygotowuje się do egzaminów państwowych, odbywa staże, pracuje dorywczo, wraca do rodzinnego miasta albo wchodzi w gospodarkę platformową. Statystyka pokazuje napięcie, ale za nią kryje się wiele różnych strategii przetrwania.</p>`
      },
      {
        id: '996',
        title: '5. 996 — mit legalnego systemu i rzeczywistość długich godzin',
        content: `<p>Jednym z najbardziej znanych symboli chińskiej kultury pracy stało się hasło <strong>996</strong>: praca od 9 rano do 9 wieczorem, sześć dni w tygodniu. Daje to 72 godziny obecności w pracy tygodniowo. Przez lata 996 kojarzono szczególnie z technologią, startupami i firmami, które budowały swoją przewagę tempem i agresywnym wzrostem.</p>
<p>Ale trzeba wyraźnie powiedzieć: <strong>996 nie jest legalnym standardem czasu pracy w Chinach</strong>. Chińskie prawo pracy przewiduje normalny czas pracy, a w 2021 roku Sąd Najwyższy i resort odpowiedzialny za zasoby ludzkie opublikowały przykładowe sprawy, w których nadmierne nadgodziny i system 996 zostały wskazane jako niezgodne z prawem.</p>
<p>To jednak nie znaczy, że długie godziny zniknęły. Oficjalne dane NBS z lipca 2026 pokazywały, że pracownicy przedsiębiorstw pracowali średnio około <strong>48,2 godziny tygodniowo</strong>. Średnia jest oczywiście daleka od 72 godzin 996, ale nadal pokazuje, że tydzień pracy bywa dłuższy niż klasyczne europejskie 40 godzin.</p>
<p>W praktyce presja może przyjmować formy, których nie widać w regulaminie: zostawanie po godzinach, wiadomości na WeChat [Łi-czat] wieczorem, kultura „wszyscy jeszcze siedzą, więc ja też siedzę”, cele sprzedażowe, rankingi, premie zależne od wyniku. Dlatego opowiadając o 996 lepiej nie mówić, że „Chińczycy pracują w systemie 996”. Lepiej powiedzieć: <strong>996 to symbol i skrajny model kultury nadgodzin, który stał się przedmiotem społecznego buntu i sporów o granice pracy.</strong></p>
<div class="trivia"><strong>Mit do skorygowania:</strong> 996 nie jest oficjalnym chińskim prawem ani obowiązkowym grafikiem całego kraju.</div>`
      },
      {
        id: 'white-collar-gig',
        title: '6. Dyplom kontra dostawy, DiDi i gospodarka platformowa',
        content: `<p>Jedną z najbardziej wymownych historii współczesnych Chin jest sytuacja, w której człowiek z dyplomem uczelni zaczyna pracować jako kierowca, kurier albo dostawca jedzenia. Nie dlatego, że edukacja „nie ma sensu”, tylko dlatego, że platformy potrafią zaoferować natychmiastowe wejście do pracy bez wielomiesięcznej rekrutacji.</p>
<p>Gospodarka elastyczna działa jak ogromny zawór bezpieczeństwa. Kiedy ktoś traci pracę w biurze albo nie może znaleźć pierwszego stanowiska zgodnego z kierunkiem, może zacząć wozić pasażerów, dostarczać jedzenie, sprzedawać przez livestream, wykonywać drobne zlecenia online albo wejść w handel internetowy.</p>
<p>Problem polega na tym, że taka praca często daje mniej bezpieczeństwa. Dochód może zależeć od liczby zleceń, algorytmu, pory dnia i konkurencji. Ubezpieczenia społeczne i emerytalne są trudniejsze do zorganizowania niż przy klasycznym etacie. A im więcej ludzi wchodzi na platformę, tym bardziej może spadać opłacalność pojedynczego kursu czy dostawy.</p>
<p>To świetny moment, żeby spojrzeć z autokaru na skutery dostawcze i powiedzieć: „Proszę państwa, te skutery są nie tylko symbolem wygody. One są również częścią chińskiego rynku pracy. Za aplikacją, dzięki której obiad przyjeżdża w 25 minut, stoi ogromna grupa ludzi pracujących pod presją czasu i algorytmu”.</p>
<div class="transition">Jeśli chcesz rozwinąć ten wątek, przejdź do <a href="#catalog/aplikacje-dostawy">„Aplikacje, DiDi, zakupy i dostawy”</a>.</div>`
      },
      {
        id: 'mieszkanie-rodzina',
        title: '7. Praca to dopiero początek: mieszkanie, ślub i oczekiwania rodziny',
        content: `<p>W Chinach problem młodego absolwenta nie kończy się na znalezieniu pracy. Następne pytanie brzmi: czy ta praca pozwala zbudować dorosłe życie?</p>
<p>W wielkich miastach koszty mieszkania i zakupu nieruchomości przez lata rosły szybciej niż wynagrodzenia wielu młodych ludzi. Mieszkanie ma też szczególne znaczenie społeczne. Dla części rodzin własne lokum jest symbolem stabilności, sukcesu, a czasem wręcz nieformalnym warunkiem małżeństwa. Szczególnie wobec młodych mężczyzn może istnieć oczekiwanie: dobra praca, mieszkanie, samochód, możliwość utrzymania rodziny.</p>
<p>Do tego dochodzi struktura demograficzna. Pokolenia wychowane podczas polityki jednego dziecka często mają relatywnie mało rodzeństwa. Jedno dorosłe dziecko może więc czuć odpowiedzialność nie tylko za własną przyszłość, ale również za dwoje rodziców i czworo dziadków. W praktyce rodziny pomagają młodym — finansują edukację, wkład własny do mieszkania, opiekę nad dziećmi — ale ta pomoc tworzy też oczekiwania.</p>
<p>Dlatego pensja w wysokości 8 czy 10 tysięcy juanów może wyglądać dobrze na papierze, ale jej znaczenie będzie zupełnie inne w małym mieście i inne w Szanghaju [Szang-haj] czy Shenzhen [Szen-dżen]. Stąd bierze się część frustracji: człowiek osiągnął więcej edukacyjnie niż pokolenie rodziców, a mimo to nie zawsze czuje, że żyje łatwiej.</p>
<div class="transition">Tutaj dobrze łączą się dwa osobne materiały: <a href="#catalog/rodzina-malzenstwo">„Rodzina, małżeństwa i dziadkowie”</a> oraz <a href="#topic/urbanizacja">„Urbanizacja i nowe miasta”</a>.</div>`
      },
      {
        id: 'hukou-mobilnosc',
        title: '8. Lepsza praca jest w mieście — ale hùkǒu [hu-kou] przypomina, skąd jesteś',
        content: `<p>Jeszcze jeden element komplikuje chiński rynek pracy: <strong>hùkǒu [hu-kou]</strong>, czyli system rejestracji ludności. Przez dekady miliony ludzi jechały ze wsi i mniejszych miast do wielkich ośrodków, bo tam były fabryki, usługi i wyższe pensje. Ale przeprowadzka nie zawsze oznaczała pełny dostęp do wszystkich lokalnych świadczeń.</p>
<p>Dla dobrze wykształconych absolwentów sytuacja bywa łatwiejsza niż dla nisko opłacanych migrantów, ponieważ największe miasta potrafią używać wykształcenia, kwalifikacji i zatrudnienia jako elementów systemów punktowych czy programów przyciągania talentów. Ale sedno pozostaje: rynek pracy jest związany nie tylko z tym, <em>co umiesz</em>, ale również z tym, <em>gdzie możesz się osiedlić i na jakich zasadach</em>.</p>
<p>To dlatego młody człowiek może dostać atrakcyjniejszą ofertę w Pekinie [Pe-kin] czy Szanghaju [Szang-haj], a jednocześnie kalkulować, czy wysokie koszty życia i trudniejszy dostęp do lokalnego statusu są warte tej pensji. Czasem powrót do Chengdu [Czeng-du], Changsha [Czang-sza] czy rodzinnego miasta może oznaczać niższą wypłatę nominalną, ale lepszy stosunek zarobków do kosztów życia i większą pomoc rodziny.</p>
<div class="transition">Pełne wyjaśnienie systemu znajdziesz w rozdziale <a href="#topic/hukou">„Hùkǒu [hu-kou] i migracje wewnętrzne”</a>.</div>`
      },
      {
        id: 'neijuan-tangping',
        title: '9. Nèijuǎn [nej-dżüen] i tǎng píng [tang ping] — bunt przeciwko wyścigowi',
        content: `<p>Żeby zrozumieć emocje młodych Chińczyków, warto znać dwa słowa, które zrobiły ogromną karierę w internecie.</p>
<p>Pierwsze to <strong>nèijuǎn [nej-dżüen]</strong>, często tłumaczone jako „inwolucja”. W codziennym użyciu chodzi o sytuację, w której wszyscy wkładają coraz więcej wysiłku, ale nagroda wcale proporcjonalnie nie rośnie. Kiedyś wystarczało skończyć studia — teraz trzeba skończyć lepsze studia. Kiedy wszyscy mają licencjat, część idzie na magisterkę. Kiedy wszyscy robią staż, trzeba zrobić dwa. Kiedy wszyscy zostają do 19:00, ktoś zostaje do 21:00. Wyścig trwa, ale meta się oddala.</p>
<p>Drugie hasło to <strong>tǎng píng [tang ping]</strong>, dosłownie „leżeć płasko”. To internetowy symbol odmowy uczestniczenia w części tego wyścigu. Nie oznacza dosłownie, że miliony ludzi rzuciły pracę i położyły się na kanapie. To raczej postawa: nie muszę mieć największego mieszkania, nie muszę pracować po nocach, nie muszę brać udziału w każdym konkursie statusu, nie muszę spełniać wszystkich oczekiwań rodziny i firmy.</p>
<p>Państwo i część starszego pokolenia patrzą na to krytycznie, bo Chiny przez dekady budowały swój sukces na ciężkiej pracy, oszczędzaniu i ambicji. Z punktu widzenia młodego człowieka odpowiedź może jednak brzmieć: „skoro mam pracować coraz więcej, a mieszkanie i stabilność wciąż się oddalają, to może zmienię definicję sukcesu”.</p>
<p>I to jest niezwykle uniwersalny temat. Możemy go porównać z zachodnim „quiet quitting”, krytyką hustle culture czy młodymi Europejczykami, którzy wolą mniejsze zarobki i więcej czasu. Chińska wersja jest jednak osadzona w znacznie bardziej konkurencyjnym systemie edukacji i w bardzo silnych oczekiwaniach rodzinnych.</p>
<div class="trivia"><strong>Jedno zdanie do zapamiętania:</strong> nèijuǎn [nej-dżüen] to „wszyscy biegną coraz szybciej, ale prawie nikt nie przesuwa się do przodu”; tǎng píng [tang ping] to „to ja może przestanę biec”.</div>`
      },
      {
        id: 'stabilnosc-panstwo',
        title: '10. Dlaczego młodzi szturmują egzaminy do administracji',
        content: `<p>Kiedy sektor prywatny kojarzy się z niepewnością, zwolnieniami i nadgodzinami, rośnie atrakcyjność stabilnych miejsc pracy: administracji, instytucji publicznych, przedsiębiorstw państwowych i innych stanowisk postrzeganych jako bezpieczniejsze.</p>
<p>W Chinach istnieje nawet osobny internetowy świat przygotowań do egzaminów urzędniczych. W rekrutacji do centralnej służby cywilnej na 2026 rok planowano około <strong>38,1 tysiąca miejsc</strong>. Według danych przytaczanych przez Caixin zarejestrowało się prawie <strong>3,72 miliona kandydatów</strong>, a do egzaminu faktycznie przystąpiło około 2,83 miliona osób. To daje mniej więcej 74 zdających na jedno miejsce.</p>
<p>Nie każdy kandydat jest świeżym absolwentem, ale trend dobrze pokazuje zmianę priorytetów. W czasach najszybszego wzrostu technologicznego marzeniem mogła być prywatna firma, szybki awans i duże premie. Kiedy gospodarka zwalnia, stabilność zaczyna być częścią wynagrodzenia. Pensja może być niższa niż w najlepszej firmie technologicznej, ale ważne stają się przewidywalność, świadczenia i mniejsze ryzyko nagłej utraty pracy.</p>
<p>To również ciekawy powrót do starego chińskiego motywu. Przez wieki ambitny młody człowiek uczył się do egzaminów, aby wejść do administracji cesarstwa. Oczywiście dzisiejszy system jest zupełnie inny, ale emocjonalne echo jest uderzające: rodzina inwestuje w naukę, kandydat przygotowuje się do wielkiego egzaminu, a nagrodą jest stabilny status urzędnika.</p>`
      },
      {
        id: 'panstwo-reaguje',
        title: '11. Co robi państwo? Miejsca pracy, staże, szkolenia i przebudowa kierunków',
        content: `<p>Wysokie bezrobocie młodych jest dla chińskich władz problemem gospodarczym, społecznym i politycznym, dlatego nie jest pozostawione wyłącznie rynkowi. W 2026 roku rząd ogłosił kolejne programy mające zwiększać zatrudnienie absolwentów.</p>
<p>Wśród narzędzi są dopłaty dla firm zatrudniających młodych, programy stażowe, rozwijanie stanowisk badawczych i asystenckich, rekrutacja do usług lokalnych i społecznych, szkolenia zawodowe oraz zachęcanie absolwentów do pracy w mniejszych miejscowościach i na poziomie lokalnym. Państwo próbuje też dostosowywać kierunki studiów do sektorów uznawanych za perspektywiczne: AI, samochodów nowej energii, zaawansowanej produkcji czy nowych usług.</p>
<p>To ważne, bo pokazuje, że problem nie jest przedstawiany jako „młodzi są leniwi”. Oficjalne dokumenty bardzo wyraźnie mówią o konieczności lepszego dopasowania podaży absolwentów do popytu na pracowników. Innymi słowy: jeśli miliony młodych ludzi zdobywają dyplomy, a gospodarka potrzebuje innych kompetencji, trzeba zmieniać również system edukacji.</p>
<p>W pierwszej połowie 2026 roku Chiny stworzyły około <strong>6,95 miliona nowych miejsc pracy w miastach</strong>, a ogólna stopa bezrobocia pozostawała w okolicach 5,2%. To znów pokazuje paradoks: gospodarka nadal tworzy dużo pracy, tylko nie każda z tych prac jest tym, czego szuka młody absolwent po kilku latach studiów.</p>`
      },
      {
        id: 'jak-opowiadac',
        title: '12. Jak opowiadać ten temat grupie — bez spłaszczania Chin do jednej liczby',
        content: `<p>Najlepiej prowadzić ten temat jak historię jednego młodego człowieka.</p>
<p>Wyobraźmy sobie dziewczynę albo chłopaka z prowincji. Rodzina od dziecka inwestuje w edukację. Przychodzi <strong>gāokǎo [gao-kao]</strong>. Udaje się dostać do dobrej uczelni. Potem cztery lata studiów i przeprowadzka do wielkiego miasta. I wtedy pojawia się pierwsze zderzenie: na jedno dobre stanowisko jest kilkudziesięciu albo kilkuset kandydatów.</p>
<p>Znajduje pracę. Pensja wygląda nieźle, ale wynajem w mieście jest drogi. Rodzice pytają o stabilność. Firma oczekuje nadgodzin. Znajomi robią magisterkę. Ktoś przygotowuje się do egzaminu do administracji. Ktoś inny jedzie do Shenzhen [Szen-dżen] do IT. Kolega po studiach zaczyna jeździć dla DiDi [Di-di]. W internecie wszyscy mówią o <strong>nèijuǎn [nej-dżüen]</strong>, a część odpowiada <strong>tǎng píng [tang ping]</strong>.</p>
<p>I dopiero wtedy grupa rozumie, że „chińskie zarobki” to nie jest tabelka. To cała ścieżka życiowa: szkoła, egzamin, uczelnia, migracja, hùkǒu [hu-kou], praca, mieszkanie, rodzina i pytanie, ile wysiłku człowiek jest gotów poświęcić, żeby wejść do klasy średniej.</p>
<div class="trivia"><strong>Najlepsze miejsca do użycia:</strong> dłuższy przejazd przez nowe dzielnice mieszkaniowe; widok biurowców Pudong [Pu-dung] lub Shenzhen [Szen-dżen]; mijanie kampusu; rozmowa o gāokǎo [gao-kao]; widok kurierów i skuterów dostawczych; pytanie grupy „ile oni zarabiają?”.</div>
<div class="transition"><strong>Odnośniki:</strong> <a href="#topic/gaokao">gāokǎo [gao-kao]</a> → <a href="#topic/praca-996">praca i zarobki</a> → <a href="#topic/hukou">hùkǒu [hu-kou]</a> → <a href="#topic/urbanizacja">urbanizacja</a>. Te cztery teksty najlepiej czytać jako jeden blok o współczesnym awansie społecznym.</div>`
      },
      {
        id: 'dane-zrodla',
        title: 'Dane do aktualizacji i źródła',
        content: `<p><strong>Uwaga redakcyjna:</strong> liczby o płacach, bezrobociu i absolwentach są zmienne. Ten rozdział zaktualizowano 13.09.2026 i przy kolejnym sezonie warto sprawdzić nowsze dane.</p>
<ul>
<li>NBS — wynagrodzenia za 2025: <a href="https://www.stats.gov.cn/english/PressRelease/202605/t20260518_1963740.html" target="_blank" rel="noopener">Average Annual Wages of Employees in Urban Units in 2025</a>.</li>
<li>NBS — rynek pracy i średni tygodniowy czas pracy, lipiec 2026: <a href="https://www.stats.gov.cn/english/PressRelease/202608/t20260817_1965057.html" target="_blank" rel="noopener">National Economy, first seven months of 2026</a>.</li>
<li>SCIO / rząd — około 12,7 mln absolwentów w 2026: <a href="https://english.scio.gov.cn/m/pressroom/2026-03/20/content_118393458_7.html" target="_blank" rel="noopener">Briefing on the Government Work Report</a>.</li>
<li>Rząd Chin — polityka zatrudnienia absolwentów 2026: <a href="https://big5.www.gov.cn/gate/big5/www.gov.cn/zhengce/zhengceku/202603/content_7063305.htm" target="_blank" rel="noopener">MHRSS / Ministry of Finance notice</a>.</li>
<li>China Employment / MHRSS — przykład wskazujący nielegalność 996: <a href="https://chinajob.mohrss.gov.cn/c/2021-09-24/325203.shtml" target="_blank" rel="noopener">实行“996”工作制违法</a>.</li>
</ul>`
      }
    ],
    guideScripts: [
      {
        id: '60s',
        title: 'Wersja około 60 sekund',
        content: `<p>Proszę państwa, ciekawy paradoks współczesnych Chin polega na tym, że kraj ma dziś rekordowo dużo wykształconych młodych ludzi, ale sam dyplom nie gwarantuje już dobrej pracy. W 2026 roku na rynek wchodzi około 12,7 miliona absolwentów szkół wyższych. W lipcu bezrobocie w grupie 16–24 lata, po wyłączeniu studentów, wynosiło 17,9%. Do tego dochodzą ogromne różnice w pensjach: inaczej IT i finanse, inaczej gastronomia czy mniejsze miasta. Symbolem presji stało się 996 — 9 rano do 9 wieczorem, sześć dni w tygodniu — choć taki system nie jest legalnym standardem. Dlatego młodzi mówią o nèijuǎn [nej-dżüen], czyli wyścigu bez końca, i o tǎng píng [tang ping], czyli próbie wycofania się z części tej presji.</p>`
      },
      {
        id: '4min',
        title: 'Wersja około 4 minut',
        content: `<p>Proszę państwa, jeśli chcemy zrozumieć współczesną chińską młodzież, trzeba połączyć kilka tematów, które zwykle opowiada się osobno. Najpierw jest gāokǎo [gao-kao] — gigantyczny egzamin i ogromna presja rodziny. Potem studia. A potem następuje moment, o którym mówi się rzadziej: wejście na rynek pracy.</p><p>W 2026 roku Chiny spodziewają się około 12,7 miliona absolwentów szkół wyższych. To rekordowa fala. Dyplom nadal jest ważny, ale skoro miliony ludzi mają dyplom, przestaje on być automatycznym biletem do klasy średniej. W lipcu 2026 bezrobocie w grupie 16–24 lata, po wyłączeniu studentów, wynosiło 17,9%.</p><p>Do tego nie istnieje jedna chińska pensja. Oficjalna średnia za 2025 rok w miejskich firmach prywatnych wynosiła około 71,6 tysiąca juanów rocznie, a w szerokiej kategorii jednostek nieprywatnych około 129,4 tysiąca. Ale IT, finanse i zawody techniczne potrafią płacić znacznie więcej niż gastronomia, usługi czy nieruchomości. I jeszcze trzeba zapytać, gdzie człowiek mieszka, bo 8 tysięcy juanów w mniejszym mieście i 8 tysięcy w Szanghaju [Szang-haj] to dwa różne życia.</p><p>Symbolem kultury pracy stało się hasło 996: 9 rano–9 wieczorem przez sześć dni. To nie jest legalny standard, ale dobrze opisuje presję, która była szczególnie silna w technologii i startupach. Oficjalne dane z lipca 2026 pokazywały przeciętnie około 48,2 godziny pracy tygodniowo w przedsiębiorstwach.</p><p>I stąd dwa modne słowa. Nèijuǎn [nej-dżüen] — wszyscy biegną coraz szybciej, ale nagroda nie rośnie. Tǎng píng [tang ping] — to ja może przestanę brać udział w każdym wyścigu. I wtedy widać, że problem młodych Chińczyków nie jest tak egzotyczny. Oni zadają dokładnie to samo pytanie co młodzi ludzie w Europie: ile życia mam oddać pracy, żeby osiągnąć stabilność?</p>`
      }
    ],
    editorialStatus: 'Pełny materiał; dane płacowe i rynek pracy aktualizować przed sezonem.'
  };

  const list = window.WANFANG_IMPORTED_TOPICS || (window.WANFANG_IMPORTED_TOPICS = []);
  const old = list.findIndex(item => item.id === topic.id);
  if (old >= 0) list.splice(old, 1, topic); else list.push(topic);

  const catalogItem = (window.WANFANG_CATALOG || []).find(item => item.id === 'praca-996');
  if (catalogItem) {
    catalogItem.topicId = 'praca-996';
    catalogItem.sectionId = null;
    catalogItem.title = 'Praca, zarobki i wykształcona młodzież';
    catalogItem.outline = ['Zarobki i różnice branżowe', 'Absolwenci i bezrobocie młodych', '996 i czas pracy', 'nèijuǎn i tǎng píng', 'powiązania z gaokao, hukou i urbanizacją'];
    catalogItem.review = 'Zaktualizowano 13.09.2026';
  }
}
