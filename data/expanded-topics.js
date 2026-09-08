(() => {
  const updated='2026-09-08';
  const p=text=>text.trim().split(/\n\n+/).map(x=>`<p>${x.trim()}</p>`).join('');
  const make=(id,title,city,category,text,sources=[],tags=[])=>({
    id,title,city,category,chinese:'',pronunciation:'',summary:text.trim().split(/\n\n/)[0],quickTalk:text.trim().split(/\n\n/)[0],status:'pełne',coverage:'material',accent:'red',updated,
    readingTime:Math.max(3,Math.ceil(text.trim().split(/\s+/).length/150)),tags,sections:[{id:'pelny-tekst',title,content:p(text)}],guideScripts:[],facts:[],stats:[],sources:sources.map(name=>({name,date:updated})),editorialStatus:'Pierwsze pełne opracowanie — do wspólnej redakcji'
  });
  const S={
    unesco:'https://whc.unesco.org/',stats:'https://www.stats.gov.cn/english/PressRelease/202602/t20260228_1962661.html',gov:'https://english.www.gov.cn/',
    shanghai:'https://english.shanghai.gov.cn/',panda:'https://www.iucnredlist.org/species/712/121745669',rail:'https://english.www.gov.cn/news/202501/06/content_WS677b132bc6d0868f4e8ee879.html'
  };
  const topics=[];
  topics.push(make('ctf-szanghaj-komplet','Szanghaj — port, Bund i Pudong','Szanghaj','Miasta i trasy',`
Proszę Państwa, Szanghaj najlepiej czytać od rzeki Huangpu [Hłang-pu]. Po zachodniej stronie stoi Bund [Band], czyli rząd dawnych banków, konsulatów i siedzib firm handlowych. Po wschodniej stronie wyrasta Pudong [Pu-dung], panorama wieżowców zbudowana głównie w ciągu ostatnich kilku dekad. Jedno spojrzenie obejmuje więc dwie epoki: czas portu traktatowego oraz Chiny, które po reformach gospodarczych zaczęły pokazywać własną siłę finansową i technologiczną.

Jeszcze w pierwszej połowie XIX wieku nie było tutaj globalnej metropolii w dzisiejszym znaczeniu. Przełom przyniosła pierwsza wojna opiumowa i traktat nankiński z 1842 roku. Szanghaj został otwarty dla zagranicznego handlu, a Brytyjczycy, Amerykanie i Francuzi uzyskali własne strefy. Nie były to klasyczne kolonie obejmujące całe miasto, lecz obszary posiadające odrębne instytucje, policję i szczególne prawa. Dla jednych oznaczało to handel i karierę, dla innych nierówność oraz obecność cudzoziemców korzystających z przywilejów na chińskiej ziemi.

Bund jest materialnym śladem tej epoki. Zobaczymy fasady kojarzące się z Londynem, banki, dawne kluby i urzędy celne. Metalowy most Waibaidu [Łaj-baj-du] przy ujściu Suzhou Creek jest jednym z najbardziej rozpoznawalnych punktów starego Szanghaju. W pobliżu stoi Pomnik Bohaterów Ludowych, którego trzy betonowe formy spotykają się wysoko nad ziemią. Upamiętnia ludzi uznanych przez państwo za uczestników walk rewolucyjnych. To ciekawe zestawienie: monument nowej politycznej pamięci stoi na brzegu zabudowanym symbolami dawnego zagranicznego kapitału.

Po drugiej stronie rzeki widzimy Pudong. Na początku lat dziewięćdziesiątych państwo przyspieszyło rozwój tej części miasta. Perła Orientu, otwarta w 1995 roku, była pierwszą wielką ikoną nowej panoramy. Jej kule miały wyglądać futurystycznie, a zarazem odwoływać się do obrazu pereł spadających na jadeitową tacę. Później powstały Jin Mao Tower, Shanghai World Financial Center, nazywany przez turystów otwieraczem do butelek, oraz skręcona Shanghai Tower. Te budynki nie powstały przypadkiem obok siebie. Miały stworzyć czytelny znak, że Szanghaj wraca do roli jednego z najważniejszych centrów finansowych Azji.

Miasto żyje jednak nie tylko wieżowcami. Nanjing Road pokazuje narodziny nowoczesnego handlu, domy towarowe, reklamy i konsumpcję. Dawna Dzielnica Francuska przypomina o kosmopolitycznym życiu międzywojennego miasta, artystach, uchodźcach, gangsterach i wielkich nierównościach. Szanghaj nazywano Paryżem Wschodu, lecz ten elegancki obraz miał także ciemną stronę: przemoc półświatka, prostytucję, narkotyki oraz dzielnice biedy sąsiadujące z klubami dla zamożnych.

Dzisiejszy port Szanghaju jest częścią znacznie większej historii. Dawne nabrzeża w centrum nie wystarczały dla współczesnych kontenerowców, dlatego ogromną rolę przejął port głębokowodny Yangshan, połączony z lądem długim mostem. Szanghaj łączy fabryki delty Jangcy z handlem światowym. Kiedy patrzymy na statki na Huangpu, widzimy więc ostatni odcinek drogi towarów, które zaczynały podróż w setkach miast i zakładów produkcyjnych.

Najlepsza puenta tego widoku jest prosta. Bund mówi o czasie, gdy zagraniczne mocarstwa narzucały Chinom warunki. Pudong mówi o czasach, gdy Chiny same próbują wyznaczać warunki w globalnej gospodarce. Rzeka ich nie rozdziela; ona pozwala oglądać oba rozdziały jednocześnie.`,[S.shanghai,'https://whc.unesco.org/en/list/1612'],['Szanghaj','Bund','Pudong','port']));

  topics.push(make('ctf-szanghaj-swiatynie','Świątynie Szanghaju — Jadeitowy Budda, Chenghuang i Yuyuan','Szanghaj','Kultura i zwyczaje',`
Proszę Państwa, świątynie Szanghaju pokazują inną twarz miasta niż Bund i Pudong. W centrum finansowej metropolii nadal spotykamy kadzidła, ofiary, wróżby i ludzi proszących o zdrowie, powodzenie albo spokój dla zmarłych. Nie jest to skansen dawnej religii. To żywa praktyka, w której buddyzm, taoizm i religia ludowa często istnieją obok siebie, a zwykły odwiedzający nie zawsze zastanawia się nad ostrymi granicami między nimi.

Świątynia Jadeitowego Buddy wiąże się z mnichem Huigenem [Hłej-gen], który pod koniec XIX wieku podróżował do Birmy. Przywiózł stamtąd jadeitowe przedstawienia Buddy. Dwa z nich pozostały w Szanghaju: siedzący Budda w pozycji medytacyjnej oraz mniejsza postać leżąca, przedstawiająca wejście w parinirwanę, czyli ostateczne wyzwolenie po śmierci. Materiał nazywany potocznie jadeitem jest tutaj równie ważny jak forma. Jasny kamień, sprowadzony z Birmy, podkreśla czystość i wyjątkowość przedstawienia.

Patrząc na posąg, zwróćcie Państwo uwagę na gesty dłoni, spokojną twarz i pozycję ciała. Budda nie jest bogiem-stwórcą. Jest nauczycielem, który wskazuje drogę wyjścia z cierpienia. Leżący Budda nie przedstawia zwykłego snu. Pokazuje ostatni moment ziemskiego życia i przejście poza cykl kolejnych narodzin. Dlatego smutek miesza się tutaj ze spokojem.

Kompleks przetrwał burzliwy XX wiek, lecz nie oznacza to, że działał bez przerw i zniszczeń. Podczas rewolucji kulturalnej praktyki religijne były ograniczane, świątynie zamykano, a przedmioty kultu niszczono. Ocalenie najważniejszych figur tłumaczy się działaniami mnichów i lokalnych opiekunów. Po okresie reform świątynię ponownie otwarto i odnowiono. Dzisiejszy wygląd jest więc połączeniem dawnej fundacji, odbudowy i współczesnego życia religijnego.

Inny charakter ma Świątynia Bóstwa Miasta, Chenghuang Miao [Czeng-hłang Miao]. Bóstwo miasta można porównać do nadprzyrodzonego urzędnika i opiekuna lokalnej wspólnoty. W tradycyjnych wyobrażeniach świat niewidzialny przypominał administrację: istniały hierarchie, sądy, dokumenty i odpowiedzialność za konkretne terytorium. Świątynia łączyła religię z tożsamością miejską.

Obok znajduje się ogród Yuyuan [Jü-jüan]. Nie jest wielkim parkiem z długimi osiami widokowymi. To przestrzeń komponowana jak seria obrazów. Mur, okno i zakręt ścieżki ukrywają kolejną scenę, aby zwiedzający nie zobaczył wszystkiego naraz. Skały symbolizują góry, staw zastępuje jezioro, a niewielki pawilon może stworzyć wrażenie oddzielnego świata. Właśnie dlatego chiński ogród najlepiej oglądać w ruchu: każdy krok zmienia kadr.

W tej części miasta religia, ogród, restauracje i sklepy mieszają się ze sobą. Nie odbiera to miejscu znaczenia. Pokazuje raczej, że tradycja w Chinach bardzo często funkcjonuje jednocześnie jako praktyka rodzinna, atrakcja, handel i element miejskiej tożsamości.`,[S.shanghai,'https://www.metmuseum.org/toah/hd/budd/hd_budd.htm'],['buddyzm','Szanghaj','ogród','religia']));

  topics.push(make('ctf-huangshan-huizhou','Huangshan, Hongcun, Tunxi i kultura Huizhou','Huangshan / Anhui','Miasta i trasy',`
Proszę Państwa, region Huangshan [Hłang-szan] pokazuje krajobraz, który Chińczycy przez stulecia nie tylko oglądali, lecz także malowali, opisywali i obdarzali symbolicznym znaczeniem. Granitowe szczyty, poskręcane sosny, mgła i morze chmur tworzą widok przypominający zwój malarski. W tradycji shanshui [szan-szłej], czyli „gór i wód”, nie chodziło o fotograficzne kopiowanie natury. Artysta próbował pokazać jej rytm oraz miejsce człowieka w większym porządku.

Nazwa Huangshan oznacza Żółte Góry i wiąże się z legendarnym Żółtym Cesarzem. Według tradycji miał tu poszukiwać eliksiru nieśmiertelności. Dzisiejszą nazwę nadano górom w epoce Tang. Najbardziej znane obrazy tego miejsca to sosny wyrastające ze szczelin, skały o fantazyjnych nazwach, gorące źródła oraz chmury wypełniające doliny. Widok zależy od pogody. Mgła nie musi oznaczać nieudanego dnia, ponieważ zasłanianie i odsłanianie szczytów jest częścią doświadczenia tych gór.

Skały otrzymują nazwy przypominające zwierzęta, ludzi i sceny z legend. Nie trzeba widzieć dokładnie tego samego co autor nazwy. Zabawa polega na uruchomieniu wyobraźni. Jedna osoba zobaczy małpę patrzącą na morze, inna siedzącą postać. To podobne do patrzenia na chmury, lecz tutaj wyobrażenia zostały utrwalone przez pokolenia poetów, malarzy i przewodników.

U podnóża gór leży Hongcun [Hong-cun], wieś kupieckich rodów Huizhou. Jej układ tradycyjnie porównuje się do ciała wołu: wzgórze jest głową, drzewa rogami, domy tułowiem, mosty nogami, a kanały układem krwionośnym. Nie jest to plan techniczny w nowoczesnym sensie, lecz symboliczny sposób opowiadania o przestrzeni. Woda doprowadzana kanałami służyła mieszkańcom, pomagała w razie pożaru i tworzyła charakterystyczne odbicia białych ścian.

Architekturę Huizhou rozpoznamy po jasnych murach, ciemnych dachówkach i wysokich ścianach schodkowych. Te ostatnie ograniczały rozprzestrzenianie się ognia między drewnianymi domami, a jednocześnie stały się znakiem regionu. Zamożność wielu rodzin pochodziła z handlu. Kupcy wyjeżdżali na długo, a pieniądze inwestowali w domy, edukację synów, świątynie przodków i reprezentacyjne bramy.

Tunxi Old Street pokazuje handlową stronę tej kultury. Spotkamy tu herbatę, tusz, papier, pędzle i kamienie do rozcierania tuszu. Cztery Skarby Gabinetu nie były zwykłymi przyborami szkolnymi. Tworzyły podstawowe narzędzia urzędnika, uczonego i kaligrafa. W kulturze, w której awans państwowy przez stulecia wiązał się z edukacją i pismem, dobry pędzel oraz papier należały do świata prestiżu.

Huangshan i wsie Huizhou łączą więc trzy historie: naturę przekształconą w symbol, bogactwo kupców oraz kulturę pisma. Góry dawały obraz, handel pieniądze, a edukacja pozycję społeczną.`,['https://whc.unesco.org/en/list/547','https://whc.unesco.org/en/list/1002'],['Huangshan','Hongcun','Huizhou','Tunxi']));

  topics.push(make('ctf-changsha-mao','Changsha, Hunan i młody Mao','Changsha / Hunan','Historia',`
Proszę Państwa, Changsha [Czang-sza] jest dobrym miejscem, aby zobaczyć Mao Zedonga przed czasem wielkich portretów i oficjalnych pomników. Mao pochodził z pobliskiego Shaoshan w prowincji Hunan. Do Changshy przyjechał jako młody człowiek, uczył się, czytał, organizował grupy samokształceniowe i obserwował rozpad dawnego porządku cesarskiego. Nie był jeszcze przywódcą państwa. Był jednym z wielu młodych ludzi szukających odpowiedzi na pytanie, dlaczego Chiny są słabe i jak je przebudować.

Początek XX wieku był czasem gwałtownych zmian. Dynastia Qing upadła w 1911 roku, lecz republika nie przyniosła od razu stabilności. Kraj dzielili lokalni dowódcy wojskowi, obce mocarstwa zachowywały wpływy, a młoda inteligencja dyskutowała o nauce, demokracji, nacjonalizmie i rewolucji. Mao czytał zarówno klasyczne teksty chińskie, jak i tłumaczenia zachodnich autorów. W Changshy organizował stowarzyszenia uczniowskie i zdobywał doświadczenie polityczne.

Ogromna głowa młodego Mao na Wyspie Pomarańczowej przedstawia go nie jako starszego przewodniczącego, lecz jako młodego człowieka z rozwianymi włosami. To świadomy wybór. Pomnik łączy biografię z późniejszą legendą: patrzymy na młodzieńca, o którym wiemy, że stanie się jedną z najważniejszych i najbardziej kontrowersyjnych postaci XX wieku. W oficjalnej narracji podkreśla się jego energię, patriotyzm i determinację. Pełny obraz wymaga jednak pamięci również o kosztach jego późniejszych kampanii.

Po zwycięstwie komunistów w 1949 roku Mao stał się twórcą nowego państwa. Wielki Skok Naprzód miał błyskawicznie zwiększyć produkcję przemysłową i rolną. Eksperymenty gospodarcze, zawyżanie wyników, przymusowe kolektywizowanie i błędne decyzje przyczyniły się do katastrofalnego głodu. Rewolucja kulturalna, rozpoczęta w 1966 roku, uderzyła w szkoły, zabytki, ludzi nauki i osoby uznane za przeciwników politycznych. Młodzieżowe Czerwone Gwardie niszczyły symbole „starej kultury”, a miliony ludzi prześladowano lub wysyłano do pracy i reedukacji.

Dzisiejszy stosunek do Mao jest złożony. Państwo przedstawia go jako założyciela Chińskiej Republiki Ludowej, a jego wizerunek pozostaje na placu Tiananmen i banknotach. Wiele rodzin pamięta awans społeczny, zjednoczenie kraju lub poprawę pozycji Chin. Inne pamiętają głód, przemoc i utracone lata. Te wspomnienia mogą istnieć jednocześnie.

Hunan ma także bardzo wyrazistą kuchnię. Jest pikantna, ale inaczej niż kuchnia syczuańska. Syczuan słynie z połączenia ostrości i drętwienia wywoływanego pieprzem syczuańskim. W Hunan częściej dominuje czyste ciepło świeżych i marynowanych papryczek, kwaśne dodatki oraz wędzenie. To region, w którym jedzenie pasuje do lokalnego stereotypu ludzi bezpośrednich, energicznych i odpornych.

Changsha pozwala więc rozpocząć historię Mao od właściwego miejsca: od młodości, edukacji i epoki kryzysu. Dopiero później dochodzimy do rewolucji, władzy oraz pytań o cenę wielkich eksperymentów.`,['https://www.marxists.org/reference/archive/mao/works/','https://www.britannica.com/biography/Mao-Zedong'],['Changsha','Mao','Hunan']));

  topics.push(make('ctf-zhangjiajie-komplet','Zhangjiajie, Tianmen i krajobraz Avatara','Zhangjiajie','Miasta i trasy',`
Proszę Państwa, filary Zhangjiajie [Dżang-dzia-dzie] wyglądają jak pojedyncze kamienne wieże, ale powstały jako część większego płaskowyżu. Piaskowiec kwarcowy był przez miliony lat przecinany szczelinami, wodą, mrozem i roślinnością. Bardziej miękki materiał znikał, a odporniejsze fragmenty pozostawały. Dlatego widzimy tysiące wysokich kolumn oddzielonych głębokimi dolinami. To nie wapienny kras taki jak w Guilin, lecz inny rodzaj krajobrazu i skały.

Wulingyuan został wpisany na Listę Światowego Dziedzictwa UNESCO w 1992 roku. Ochrona przyrody spotyka się tutaj z potężną turystyką. Autobusy parkowe, kolejki linowe i winda Bailong pomagają obsłużyć ogromną liczbę odwiedzających. Winda przyklejona do skalnej ściany może wyglądać jak zaprzeczenie dzikiej natury, ale pokazuje chiński sposób udostępniania trudnego terenu: infrastruktura ma przenieść tłum wysoko i szybko.

Yuanjiajie słynie z naturalnych mostów oraz filarów oglądanych z górnych tarasów. Tianzi Mountain wiąże nazwę z Xiang Dakunem, przywódcą ludu Tujia, który według lokalnej tradycji wystąpił przeciw władzy i nazywał się Synem Nieba. Golden Whip Stream prowadzi doliną, gdzie skalne ściany oglądamy od dołu. Te same formacje zmieniają charakter zależnie od perspektywy: z góry są archipelagiem wysp, z dołu przypominają pionowe mury.

Związek z filmem „Avatar” trzeba opowiadać ostrożnie. Krajobraz Zhangjiajie był wskazywany jako jedna z wizualnych inspiracji dla latających gór Pandory, a lokalna turystyka znakomicie wykorzystała podobieństwo. Jeden z filarów otrzymał nawet marketingową nazwę związaną z filmem. Nie oznacza to jednak, że film kręcono na miejscu ani że każda filmowa skała jest kopią konkretnego chińskiego filaru. To historia inspiracji, skojarzenia i skutecznej promocji.

Tianmen Shan jest osobnym obszarem od głównego parku Wulingyuan. Słynie z ogromnego naturalnego otworu zwanego Bramą Niebios, kolejki linowej oraz drogi z dziewięćdziesięcioma dziewięcioma zakrętami. Liczba dziewięć kojarzyła się z pełnią, trwałością i cesarskim prestiżem. Powtórzenie dziewiątki wzmacnia symbolikę, choć faktyczna liczba zakrętów bywa też częścią sposobu promowania trasy.

Szklane chodniki i mosty należą do nowej kultury atrakcji. Dawniej pielgrzym wchodził w góry dla świątyni, poezji albo kontaktu z naturą. Dzisiejszy turysta szuka także kontrolowanego lęku, zdjęcia i dowodu, że przeszedł nad przepaścią. Szklany Most Wielkiego Kanionu leży w innym miejscu niż chodniki na Tianmen, dlatego nie należy ich mieszać. Rekordy mostów szybko się zmieniają; ważniejsza jest rola tego obiektu w rozwoju regionu.

Region jest ojczyzną między innymi społeczności Tujia i Miao. Kolorowe stroje na pokazach nie opowiadają całego ich życia. Są to współczesne społeczności pracujące w miastach, szkołach i turystyce, a tradycyjna architektura, pieśni i obrzędy są jednocześnie dziedzictwem oraz częścią lokalnej gospodarki.

Zhangjiajie pokazuje zatem trzy warstwy: niezwykłą geologię, lokalne kultury i masową turystykę. „Avatar” jest tylko jednym z wejść do tej opowieści, a prawdziwa historia zaczęła się miliony lat wcześniej.`,['https://whc.unesco.org/en/list/640'],['Zhangjiajie','Tianmen','Avatar','Tujia']));

  topics.push(make('ctf-chongqing-komplet','Chongqing — miasto w pionie, dwie rzeki i pamięć wojny','Chongqing','Miasta i trasy',`
Proszę Państwa, Chongqing [Czong-cing] jest miastem, w którym mapa na telefonie nie zawsze wystarcza. Dwie ulice mogą wyglądać na położone obok siebie, a w rzeczywistości dzieli je kilkanaście pięter, schody albo stromy stok. Centrum leży na półwyspie między Jangcy a rzeką Jialing [Dzia-ling]. Góry wymusiły budowanie w pionie, dlatego wejście do budynku z jednej strony może prowadzić na parter, a z drugiej na dziesiąte piętro.

Najbardziej znanym symbolem tej przestrzeni jest Liziba. Pociąg lekkiej kolei przejeżdża przez bryłę budynku mieszkalno-usługowego. Nie oznacza to, że najpierw zbudowano dom, a potem brutalnie przebito go tunelem. Transport i budynek projektowano jako zintegrowane rozwiązanie. Konstrukcje są oddzielone, aby ograniczyć drgania i hałas. Dla mieszkańców jest to codzienny przystanek, a dla przyjezdnych jedna z najbardziej fotografowanych scen miasta.

Ciqikou [Cy-ci-kou] znaczy dosłownie Port Porcelany. Dawne miasteczko rozwijało się dzięki położeniu nad rzeką, handlowi i transportowi towarów. Dzisiejsze uliczki są mocno skomercjalizowane: znajdziemy przekąski, pamiątki i tłumy. Pod warstwą turystyczną nadal można jednak odczytać historię portowego przedmieścia, świątyń, warsztatów i domów ustawionych na stromym terenie.

Hongyadong wygląda wieczorem jak ogromna drewniana twierdza przyklejona do zbocza. Obecny kompleks jest współczesną rekonstrukcją i centrum handlowo-rozrywkowym inspirowanym tradycyjną zabudową diaojiaolou, czyli domami wspartymi na słupach. Nie oglądamy nietkniętej starówki. Oglądamy nowoczesną atrakcję, która wykorzystuje regionalną formę architektoniczną i nocne oświetlenie. Jej popularność pokazuje siłę chińskich mediów społecznościowych w tworzeniu nowych ikon miasta.

Chaotianmen [Czao-tien-men] to miejsce spotkania Jangcy i Jialing. Nad cyplem wyrasta Raffles City, zespół wież połączonych wysoko położoną konstrukcją nazywaną Kryształem. Forma kompleksu ma przypominać żagle. To współczesna brama miasta ustawiona tam, gdzie przez stulecia przybywały statki i poselstwa.

Chongqing ma także trudną historię wojenną. Podczas wojny chińsko-japońskiej pełnił funkcję stolicy rządu Republiki Chińskiej. Miasto było wielokrotnie bombardowane, a ludność chroniła się w tunelach i schronach wykutych w skałach. Dzisiejsze tunele drogowe oraz podziemne przestrzenie przypominają, że górzyste położenie było nie tylko utrudnieniem, lecz także ochroną.

Kiedy patrzymy z Nanbin Road na oświetlone centrum, widzimy rezultat połączenia geografii i ogromnych inwestycji. Rzeki wyznaczyły handel, góry wymusiły pionową zabudowę, wojna nadała miastu znaczenie polityczne, a internet uczynił z niego turystyczną sensację. Chongqing nie jest chaotyczny bez powodu. Ma logikę, tyle że jest to logika trzech wymiarów.`,[S.gov,'https://www.britannica.com/place/Chongqing'],['Chongqing','Liziba','Hongyadong','Chaotianmen']));

  topics.push(make('ctf-chengdu-komplet','Chengdu — pandy, świątynie, Trzy Królestwa i Syczuan','Chengdu','Miasta i trasy',`
Proszę Państwa, Chengdu [Czeng-du] ma opinię miasta spokojniejszego niż chińskie metropolie wschodniego wybrzeża. Herbaciarnie, mahjong i kuchnia budują obraz miejsca, które potrafi cieszyć się codziennością. Jednocześnie jest to ogromne centrum gospodarcze zachodnich Chin. Dawny rytm i nowoczesne biurowce nie wykluczają się tutaj, lecz funkcjonują obok siebie.

Najbardziej znanym mieszkańcem regionu jest panda wielka. Jej układ pokarmowy nadal przypomina układ mięsożercy, choć dieta składa się głównie z bambusa. Bambus ma mało energii, dlatego panda poświęca jedzeniu dużą część dnia i ogranicza wysiłek. Charakterystyczny „dodatkowy kciuk” nie jest prawdziwym szóstym palcem, lecz powiększoną kością nadgarstka pomagającą przytrzymywać łodygi.

Pandy rodzą wyjątkowo małe młode. W warunkach naturalnych samica zwykle nie jest w stanie skutecznie wychować bliźniąt jednocześnie, natomiast ośrodki hodowlane mogą stosować rotacyjną opiekę. Rozmnażanie to tylko część ochrony gatunku. Równie ważne są górskie lasy bambusowe, łączenie rozdzielonych siedlisk i ochrona całego ekosystemu. Panda działa jak gatunek parasolowy: chroniąc jej środowisko, chroni się również wiele innych organizmów.

Klasztor Wenshu [Łen-szu] pokazuje żywy buddyzm. Oprócz posągów zobaczymy dziedzińce, miejsca składania ofiar, kadzidła i przestrzenie wspólnoty mnichów. W chińskich świątyniach buddyjskich często pojawiają się także lokalni opiekunowie oraz elementy religii ludowej. Dla odwiedzających najważniejsza jest praktyka: zapalenie kadzidła, ukłon, modlitwa za rodzinę albo wsparcie klasztoru.

Wuhou Shrine wiąże się z epoką Trzech Królestw. Zhuge Liang [Dżu-ge Liang], strateg państwa Shu, stał się symbolem inteligencji, lojalności i dalekowzroczności. Historyczna kronika i późniejsza powieść nie są tym samym. „Opowieść o Trzech Królestwach” rozbudowała postacie, sceny bitewne oraz fortele, przez co dla wielu ludzi bohaterowie są jednocześnie postaciami historycznymi i bohaterami kultury popularnej.

Jinli oraz Kuanzhai Xiangzi pokazują, jak dawne formy miejskie otrzymują nowe życie poprzez restauracje, sklepy i turystykę. Nie wszystko, co wygląda staro, jest oryginalne. Warto patrzeć na warstwy: historyczny układ, odtworzone fasady, lokalne przekąski i współczesny biznes.

Kuchnia syczuańska nie oznacza wyłącznie ostrości. Jej znakiem jest mala [ma-la]: ma to drętwienie wywoływane przez pieprz syczuański, a la oznacza ostrość papryczki. Hot pot pozwala regulować intensywność, wybierać składniki i długo siedzieć przy wspólnym stole. Jedzenie staje się wydarzeniem społecznym.

Opera syczuańska łączy śpiew, komedię, muzykę, akrobatykę oraz słynną zmianę masek bian lian [bien lien]. Technika opiera się na błyskawicznych ruchach i sprytnie przygotowanych elementach kostiumu, a jej dokładne metody są chronione przez wykonawców. Najważniejsza nie jest odpowiedź, gdzie schowano maskę, lecz tempo, gest oraz kontakt artysty z publicznością.

Chengdu można więc zapamiętać przez cztery obrazy: pandę oszczędzającą energię, herbaciarnię pełną mahjonga, pieprz syczuański wywołujący mrowienie oraz stratega Zhuge Lianga, który od stuleci pozostaje wzorem sprytu.`,[S.panda,'https://whc.unesco.org/en/list/1213'],['Chengdu','pandy','Syczuan','Wuhou']));

  topics.push(make('ctf-pekin-codzienny','Pekin praktyczny — lotniska, metro, rowery i hutongi','Pekin','Życie codzienne',`
Proszę Państwa, Pekin jest miastem zbudowanym w ogromnej skali. Odległość widoczna na mapie jako niewielki fragment może oznaczać długi przejazd, a nazwa „Pekin” przy bilecie nie mówi jeszcze, z którego lotniska albo dworca odjeżdżamy. Stolica korzysta przede wszystkim z lotniska Capital, oznaczanego PEK, oraz nowego lotniska Daxing, oznaczanego PKX. Leżą po różnych stronach miasta i nie można traktować ich wymiennie.

Daxing otwarto w 2019 roku. Terminal ma centralny rdzeń i promieniście rozchodzące się ramiona, co ma skracać drogę pasażera. Kształt bywa porównywany do rozgwiazdy lub feniksa. Capital Airport rozwijał się etapami, a jego ogromny Terminal 3 otwarto przed igrzyskami olimpijskimi w 2008 roku. W praktyce przy każdym locie sprawdzamy nie tylko godzinę, ale również kod lotniska, terminal i miejsce spotkania.

Metro jest jednym z najważniejszych sposobów poruszania się po Pekinie. Kontrole bezpieczeństwa przy wejściach, duże odległości między przesiadkami i tłok w godzinach szczytu mogą zaskoczyć. Sieć rozwija się wraz z miastem, dlatego liczba linii oraz stacji zmienia się i nie warto zapamiętywać jej na zawsze. Najważniejsze jest rozpoznawanie znaków, numerów wyjść i ostatnich kursów.

Na ulicach zobaczymy rowery współdzielone i ogromną liczbę skuterów elektrycznych. Skutery są ciche, więc łatwo ich nie usłyszeć. Zielone światło dla pieszego nie zwalnia z obserwowania skręcających pojazdów. Rowery miejskie można odblokować kodem w aplikacji, a ich rozmieszczenie jest na bieżąco regulowane. To przykład połączenia dawnej kultury rowerowej z telefonem i platformami cyfrowymi.

Hutongi są przeciwieństwem monumentalnych arterii. Słowo hutong oznacza wąską uliczkę lub zaułek. Wzdłuż nich budowano domy siheyuan [sy-he-jüan], skupione wokół dziedzińca. Układ pomieszczeń odzwierciedlał hierarchię rodziny, strony świata i potrzebę prywatności. Za szarym murem mogło istnieć kilka kolejnych dziedzińców, niewidocznych z ulicy.

W XX wieku wiele dawnych rezydencji podzielono między liczne rodziny. Dziedzińce zapełniły się dobudówkami, kuchniami, rowerami i przedmiotami codziennego użytku. Część hutongów zburzono przy budowie dróg i nowych dzielnic, część odnowiono, a część zmieniła się w drogie okolice z kawiarniami i hotelami. Dlatego romantyczny obraz starówki trzeba uzupełnić historią ciasnych mieszkań, wspólnych toalet, przesiedleń i rosnących cen.

Pekin najlepiej zrozumieć przez kontrast. Wielka oś cesarska i szerokie aleje pokazują władzę państwa. Hutongi pokazują codzienne życie rodziny i sąsiedztwa. Metro, lotniska oraz aplikacje rowerowe przypominają natomiast, że współczesne miasto stale rośnie poza granice dawnej stolicy.`,['https://english.beijing.gov.cn/','https://www.bdia.com.cn/'],['Pekin','lotniska','metro','hutongi']));

  topics.push(make('ctf-mur-ming','Wielki Mur — odcinki, żołnierze i grobowce Ming','Pekin','Historia',`
Proszę Państwa, Wielki Mur nie jest jednym murem zbudowanym w jednej epoce. To zbiorcza nazwa systemów fortyfikacji powstających i przebudowywanych przez wiele stuleci. Pierwsze państwa wznosiły własne wały jeszcze przed zjednoczeniem Chin. Pierwszy cesarz Qin połączył i rozbudował część północnych umocnień, lecz większość ceglanych fragmentów oglądanych dziś w okolicach Pekinu pochodzi z dynastii Ming.

Mur Mingów miał utrudniać najazdy, kontrolować przejścia, wspierać komunikację i nadzorować handel. Sam mur nie zatrzymywał całej armii jak magiczna bariera. Działał razem z garnizonami, fortami, drogami, magazynami i systemem obserwacji. Wieże przekazywały alarm za pomocą dymu, ognia, wystrzałów i innych sygnałów, ale szczegółowe legendy o jednej uniwersalnej tabeli sygnałów należy traktować ostrożnie, ponieważ zasady zmieniały się zależnie od miejsca i epoki.

Badaling jest najbardziej znanym i najłatwiej dostępnym odcinkiem. Został wcześnie odrestaurowany i przyjmuje ogromne grupy. Mutianyu ma długi odnowiony fragment, liczne wieże i bardziej górski charakter. Jinshanling łączy partie odrestaurowane z bardziej surowymi, a Simatai słynie ze stromego terenu. Kiedy ktoś mówi, że „był na Wielkim Murze”, warto więc zapytać: na którym odcinku?

Za monumentalnym widokiem kryje się codzienność żołnierzy. Trzeba było dostarczać żywność, opał, broń i ubrania do posterunków oddalonych od miast. Garnizon żył w zimnie, wietrze i izolacji. Ważne były drogi zaopatrzenia oraz możliwość szybkiego przerzucenia ludzi. To właśnie utrzymanie całego systemu, a nie samo ustawienie cegieł, stanowiło największe wyzwanie.

Mur nie jest widoczny gołym okiem z Księżyca. Z niskiej orbity można w sprzyjających warunkach dostrzec różne obiekty stworzone przez człowieka, lecz mur jest wąski i kolorystycznie zlewa się z terenem. Popularny mit powstał jeszcze zanim ludzie polecieli w kosmos. Nie ma również podstaw, aby każdy fragment przedstawiać jako masowy grobowiec robotników. Budowa pochłonęła wiele ofiar, ale opowieść o ciałach powszechnie zamurowywanych w konstrukcji należy do legend.

Święta Droga i grobowce Ming pokazują drugą stronę tej samej dynastii. Mur chronił północną granicę, a nekropolia miała zabezpieczyć pamięć i pośmiertny porządek cesarzy. Kamienne zwierzęta i urzędnicy stoją wzdłuż drogi prowadzącej symbolicznie do świata zmarłych. Nie są przypadkową dekoracją: tworzą honorową eskortę władcy.

Dingling jest grobowcem cesarza Wanli. Podziemny pałac otwarto w latach pięćdziesiątych XX wieku. Archeolodzy zdobyli niezwykły dostęp do cesarskiego pochówku, lecz brak odpowiednich metod konserwacji spowodował zniszczenie wielu wydobytych tkanin i przedmiotów. Podczas rewolucji kulturalnej szczątki cesarza i cesarzowych zostały publicznie potępione i spalone. Dingling opowiada więc nie tylko o Mingach, ale również o tym, jak polityka XX wieku potraktowała przeszłość.

Stojąc na murze, widzimy ostatecznie nie „najdłuższy budynek świata”, lecz krajobraz obronny: góry, przełęcze, wieże i drogi. Mur miał działać dlatego, że ludzie obserwowali, przekazywali informacje i utrzymywali posterunki. Bez nich pozostawał tylko długą konstrukcją na wzgórzach.`,['https://whc.unesco.org/en/list/438','https://whc.unesco.org/en/list/439'],['Wielki Mur','Ming','Dingling']));

  topics.push(make('chiny-wspolczesne-komplet','Chiny współczesne — wojny, Mao, Deng, KPCh i plany rozwoju','Chiny','Historia',`
Proszę Państwa, współczesnych Chin nie da się zrozumieć bez doświadczenia wojny i rozpadu państwa. Po upadku cesarstwa w 1911 roku republika była słaba, kraj dzielili dowódcy wojskowi, a Japonia stopniowo rozszerzała kontrolę. Pełnoskalowa wojna chińsko-japońska wybuchła w 1937 roku. Nankin stał się miejscem masowych zbrodni, Szanghaj wielkiej bitwy, a Chongqing wojenną stolicą bombardowaną z powietrza. Pamięć tej wojny pozostaje ważną częścią chińskiej tożsamości i relacji z Japonią.

Po kapitulacji Japonii wróciła wojna domowa między Kuomintangiem a komunistami. W 1949 roku Mao ogłosił powstanie Chińskiej Republiki Ludowej, a rząd Republiki Chińskiej wycofał się na Tajwan. Od tego czasu obie strony rozwijały się oddzielnie. Pekin uważa Tajwan za część Chin i nie wyklucza użycia siły, a na wyspie istnieje własny demokratyczny rząd, armia i waluta. To temat politycznie wrażliwy, dlatego trzymajmy się faktów i rozróżniajmy stanowiska stron.

Epoka Mao przyniosła zjednoczenie państwa, przebudowę społeczną i poprawę części wskaźników zdrowia, ale także katastrofalne kampanie. Wielki Skok Naprzód przyczynił się do głodu, a rewolucja kulturalna do prześladowań, chaosu edukacyjnego i niszczenia dziedzictwa. Po śmierci Mao kierunek zmienił Deng Xiaoping. Od końca lat siedemdziesiątych wprowadzano mechanizmy rynkowe, otwierano specjalne strefy gospodarcze i przyciągano zagraniczny kapitał. Państwo pozostało rządzone przez partię komunistyczną, lecz gospodarka zaczęła korzystać z konkurencji, prywatnego biznesu i handlu światowego.

KPCh liczy dziesiątki milionów członków i działa poprzez struktury obecne od centrum po zakłady pracy oraz osiedla. Najważniejsze decyzje polityczne zapadają w systemie partyjnym, a instytucje państwa je realizują. Nie oznacza to, że każdy urzędnik podejmuje dowolne decyzje. Istnieją ministerstwa, samorządy, sądy, przepisy i spory interesów, ale partia zachowuje nadrzędną rolę i nie rywalizuje o władzę w wyborach wielopartyjnych.

Plany pięcioletnie nie są jedną tabelą nakazującą każdej fabryce dokładną produkcję. Wyznaczają cele, priorytety inwestycji i kierunki polityki. Piętnasty plan obejmuje lata 2026–2030. W chwili redagowania materiału należy korzystać z przyjętego tekstu planu, a nie wcześniejszych zapowiedzi. Powracają tematy technologii, bezpieczeństwa gospodarczego, zielonej transformacji, konsumpcji, starzenia ludności i zmniejszania zależności od zagranicznych rozwiązań.

Inicjatywa Pasa i Szlaku, ogłoszona w 2013 roku, łączy inwestycje kolejowe, portowe, energetyczne i finansowe. Polska pojawia się na mapie połączeń kolejowych między Chinami a Europą, szczególnie przez terminale logistyczne, ale nie stała się centralnym węzłem całego projektu. Wojna w Ukrainie, relacje UE–Chiny oraz konkurencja gospodarcza zmieniły warunki współpracy. Najuczciwiej mówić o sieci projektów o różnych rezultatach, a nie o jednym gotowym „Nowym Jedwabnym Szlaku”.`,[S.gov,S.stats,'https://www.un.org/development/desa/dpad/wp-content/uploads/sites/45/publication/CDP-bp-2023-56.pdf'],['Mao','Deng','KPCh','Tajwan','plan pięcioletni']));

  topics.push(make('chiny-spoleczenstwo-komplet','Rodzina, demografia, praca, zarobki i emerytury','Chiny','Życie codzienne',`
Proszę Państwa, polityka jednego dziecka nie oznaczała jednego identycznego zakazu dla wszystkich przez cały okres jej obowiązywania. Od końca lat siedemdziesiątych państwo ograniczało liczbę urodzeń, lecz zasady zależały od miejsca, pochodzenia etnicznego i sytuacji rodziny. W miastach kontrola była zwykle ostrzejsza, na wsi istniały wyjątki. System przyczynił się do spadku dzietności, ale także do starzenia społeczeństwa, nierównowagi płci i modelu rodziny, w którym jedno dziecko może opiekować się dwojgiem rodziców oraz czworgiem dziadków.

W 2016 roku wprowadzono możliwość posiadania dwojga dzieci, a w 2021 roku trojga. Samo zniesienie limitów nie odwróciło trendu. Młodzi ludzie wskazują wysokie koszty mieszkań, edukacji i opieki, presję pracy oraz zmianę stylu życia. Według chińskiego urzędu statystycznego ludność kraju ponownie zmniejszyła się w 2025 roku. To ważna zmiana: państwo, które przez dekady ograniczało urodzenia, obecnie próbuje je zachęcać.

Rynek pracy jest równie zróżnicowany jak kraj. Wynagrodzenia w Szanghaju, Pekinie czy Shenzhen są znacznie wyższe niż w małych miastach i na wsi, ale wyższe są także koszty mieszkań. System hukou łączy dostęp do części usług publicznych z miejscem rejestracji. Migrant może przez lata pracować w metropolii, a jednocześnie mieć ograniczony dostęp do lokalnej szkoły lub świadczeń. Reformy stopniowo łagodzą system, szczególnie w mniejszych miastach, lecz największe metropolie nadal kontrolują napływ ludności.

Hasło 996 oznacza pracę od dziewiątej rano do dziewiątej wieczorem przez sześć dni w tygodniu. Taki rozkład nie jest legalnym ogólnokrajowym standardem. Stał się symbolem nadgodzin w firmach technologicznych i ostrej konkurencji. Chińskie sądy oraz organy pracy podkreślały, że nadmierne nadgodziny naruszają prawo. Mimo to różnica między przepisem a praktyką może być duża, szczególnie tam, gdzie pracownik obawia się utraty zatrudnienia.

Dostawcy jedzenia i kierowcy platform pokazują nową gospodarkę usług. Aplikacja przydziela zamówienia, wyznacza trasę i ocenia pracę. Elastyczność przyciąga ludzi, ale dochód zależy od liczby zleceń, czasu, kosztów pojazdu i zasad platformy. Widząc pędzącego kuriera, patrzymy nie tylko na indywidualny pośpiech, lecz również na algorytm i oczekiwanie klienta.

System emerytalny obejmuje różne programy dla pracowników miejskich, mieszkańców wsi i osób samozatrudnionych. Wysokość świadczeń jest bardzo nierówna. Chiny rozpoczęły stopniowe podnoszenie wieku emerytalnego, ponieważ wcześniejsze granice należały do najniższych na świecie, a społeczeństwo szybko się starzeje. Rodzina nadal odgrywa wielką rolę w opiece, lecz migracja dzieci i mniejsze gospodarstwa domowe sprawiają, że tradycyjny model staje się trudniejszy.

Nie istnieje więc jedna odpowiedź na pytanie, jak żyje „przeciętny Chińczyk”. Inaczej wygląda życie specjalisty w Shenzhen, dostawcy w Chengdu, emeryta na wsi i rodziny z pekińskim hukou. Łączy ich szybka zmiana: pokolenie dziadków pamięta niedobory, rodzice wielką industrializację, a dzieci dorastają z telefonem, presją edukacyjną i pytaniem, czy stać je na własne mieszkanie oraz rodzinę.`,[S.stats,'https://www.ilo.org/'],['demografia','996','zarobki','emerytury','hukou']));

  topics.push(make('chiny-kultura-komplet','Religie, przodkowie, święta, symbole i chińskie rzemiosło','Chiny','Kultura i zwyczaje',`
Proszę Państwa, chińska kultura religijna nie zawsze mieści się w europejskich szufladkach. Jedna osoba może odwiedzić świątynię buddyjską, złożyć ofiarę lokalnemu bóstwu i pielęgnować rytuały przodków, nie widząc w tym sprzeczności. Buddyzm przyszedł do Chin z Indii i Azji Centralnej, taoizm wyrósł z tradycji chińskiej, a religia ludowa wypełniła świat opiekunami miejsc, bohaterami oraz duchami rodzin.

Budda jest nauczycielem drogi do wyzwolenia, a bodhisattwa odkłada ostateczne odejście, aby pomagać innym istotom. Gesty dłoni, czyli mudry, wskazują znaczenie przedstawienia: medytację, nauczanie, ochronę albo kontakt z ziemią. Taoizm podkreśla zgodność z dao, naturalnym biegiem rzeczy, oraz działanie bez wymuszania. Popularne praktyki dodały do filozofii świątynie, kapłanów, rytuały i rozbudowany świat bóstw.

Kult przodków opiera się na pamięci i odpowiedzialności rodziny. Przy grobach składa się jedzenie, pali kadzidła i papierowe odpowiedniki pieniędzy albo przedmiotów. Srebrne papierowe łódeczki przypominają dawne sztabki srebra. Spalenie daru symbolicznie przenosi go do świata zmarłych. Nie jest to kupowanie miejsca w niebie, lecz troska o przodków oraz podtrzymywanie więzi między pokoleniami.

Kalendarz świąt wyznacza rytm rodzinny. Nowy Rok Księżycowy oznacza powroty do domów, kolacje i czerwone koperty. Qingming jest czasem porządkowania grobów. Święto Smoczych Łodzi przypomina postać poety Qu Yuana, a Święto Środka Jesieni łączy pełnię księżyca z rodzinnym spotkaniem i ciasteczkami księżycowymi.

Chiński smok różni się od europejskiego potwora pilnującego skarbu. Łączy władzę nad wodą, deszczem, płodnością i cesarskim majestatem. Feniks kojarzy się z harmonią oraz dostojnością. Liczba osiem brzmi podobnie do słowa związanego z bogaceniem się, a cztery do słowa „śmierć”, dlatego numery wpływają na ceny telefonów, mieszkań i tablic. Dziewięć miało szczególny związek z cesarzem i trwałością.

Pismo jest osobnym filarem kultury. Pinyin zapisuje wymowę alfabetem łacińskim, ale nie zastępuje znaków. Kaligrafia łączy informację, gest i osobowość autora. Pędzel, papier, tusz i kamień do rozcierania tuszu nazywa się Czterema Skarbami Gabinetu. Porcelana, jedwab i papier należą do wynalazków oraz produktów, które zmieniły handel między Chinami a światem.

Herbatę dzieli się w Chinach według sposobu obróbki, a nie zachodniego koloru naparu. Mamy herbaty zielone, białe, żółte, oolong, ciemne oraz nazywane w Chinach czerwonymi, czyli nasze czarne. Podobnie jade nie jest jednym minerałem: pod tą nazwą funkcjonują przede wszystkim nefryt i jadeit. Ważny jest kolor, przejrzystość, struktura i obróbka, a wysoka cena bez wiarygodnego badania nie gwarantuje autentyczności.

Te zwyczaje łączy jedna cecha: rzeczy materialne niosą relacje. Herbata tworzy spotkanie, papierowy dar więź ze zmarłym, znak kaligraficzny obecność autora, a jadeit życzenie ochrony lub powodzenia.`,['https://www.metmuseum.org/toah/','https://ich.unesco.org/'],['buddyzm','taoizm','przodkowie','święta','jadeit','herbata']));

  topics.push(make('chiny-praktyczne-komplet','Chiny praktycznie — internet, transport, toalety, zakupy i bezpieczeństwo','Chiny','Praktyczne',`
Proszę Państwa, najważniejszym dokumentem podczas podróży jest paszport. Będzie potrzebny nie tylko na lotnisku, ale również w hotelu, przy pociągu i czasem przy wejściu do atrakcji. Trzymajmy go w stałym, bezpiecznym miejscu i nie wkładajmy do bagażu nadawanego. Przepisy wjazdowe oraz zasady ruchu bezwizowego mogą się zmieniać, dlatego sprawdzamy je przed konkretnym wyjazdem.

Telefon pełni w Chinach rolę portfela, biletu, mapy i komunikatora. Alipay oraz WeChat obsługują zagraniczne karty w wielu zwykłych płatnościach, ale konfigurację najlepiej zakończyć przed wyjazdem. eSIM zapewniający transmisję danych nie zawsze daje chiński numer telefonu. Niektóre usługi wymagają numeru lokalnego, a zagraniczny roaming lub eSIM może inaczej obsługiwać strony blokowane w chińskiej sieci.

Na dworcach przychodzimy z wyprzedzeniem. Paszport może pełnić funkcję biletu, lecz trzeba znaleźć właściwe wejście, kontrolę i peron. Miasto ma często kilka dużych stacji, dlatego sama nazwa „Pekin” albo „Szanghaj” nie wystarcza. Bagaż pozostaje pod naszą kontrolą; duża walizka trafia na półkę przy końcu wagonu, a wartościowe rzeczy bierzemy do siedzenia.

W toaletach warto mieć własny papier i środek do dezynfekcji rąk. Toalety kucane są powszechne, choć w nowych obiektach zwykle znajdziemy również kabiny zachodnie. Papier często znajduje się przy wejściu, a nie w każdej kabinie. Wody z kranu nie pijemy bez przegotowania albo odpowiedniego filtra.

Chiny są generalnie bezpieczne pod względem brutalnej przestępczości, ale tłum nie zwalnia z pilnowania telefonu, paszportu i portfela. Największe codzienne zagrożenia to ruch uliczny, ciche skutery elektryczne, upał, mokre schody i pośpiech. Przy zbiórce zapisujemy nazwę hotelu, numer do pilota oraz lokalizację spotkania. Zdjęcie punktu zbiórki jest często bardziej użyteczne niż długi opis.

Przy zakupach pytamy o cenę przed usługą, sprawdzamy jakość i nie zakładamy, że słowo „jade” gwarantuje kamień jubilerski. Na targach negocjacje bywają częścią gry, w oficjalnych sklepach ceny są zwykle stałe. Pamiątka ma przypominać podróż; nie musi udawać kosztownego antyku. Wywóz autentycznych zabytków i części chronionych produktów podlega ograniczeniom.

Klimat zmienia się między regionami bardzo mocno. Szanghaj może być wilgotny i gorący, Huangshan chłodny oraz mokry, a Pekin suchy. Powodzie, tajfuny i osunięcia mogą zmieniać program. Nie obiecujemy widoku w górach ani konkretnego przejazdu bez sprawdzenia warunków. Dobre przygotowanie oznacza naładowany telefon, powerbank, wodę, lekką warstwę przeciwdeszczową i cierpliwość.

Pod koniec podróży pamiętajmy, że codzienne sceny mówią o Chinach równie dużo jak zabytki: dziadkowie odbierający dzieci, dostawca na skuterze, taniec w parku, kolejka do popularnej restauracji i kod płatniczy na małym straganie.`,['https://en.nia.gov.cn/',S.rail,S.gov],['praktyczne','SIM','pociągi','bezpieczeństwo','zakupy']));

  topics.push(make('luoyang-komplet','Luoyang, Longmen, Wu Zetian i Shaolin','Luoyang / Shaolin','Historia',`
Proszę Państwa, Luoyang [Luo-jang] należy do wielkich dawnych stolic Chin. Położenie nad rzeką Luo i blisko ważnych szlaków sprawiło, że kolejne dynastie budowały tu pałace, świątynie i magazyny. Miasto kojarzy się również z peoniami, kwiatami prestiżu i bogactwa, których kwitnienie stało się lokalnym świętem.

Groty Longmen powstawały od końca V wieku, gdy dynastia Północna Wei przeniosła stolicę do Luoyangu. W wapiennych ścianach nad rzeką Yi wykuto tysiące nisz i przedstawień. Małe figury były prywatnymi aktami pobożności, wielkie realizacje wymagały wsparcia dworu. Najsłynniejszy Budda Vairocana w świątyni Fengxian pochodzi z epoki Tang. Tradycja łączy jego rysy z cesarzową Wu Zetian, ale należy przedstawiać to jako interpretację, a nie pewny portret.

Wu Zetian była jedyną kobietą, która przyjęła w Chinach pełny tytuł cesarski. Budowała własną legitymację poprzez buddyzm, administrację i poparcie nowych elit. Luoyang stał się jej wschodnią stolicą. Późniejsze kroniki, pisane w świecie niechętnym kobiecie na tronie, przedstawiały ją jako bezwzględną uzurpatorkę. Była brutalnym politykiem, ale zarazem skuteczną władczynią wspierającą egzaminy i ludzi spoza najstarszej arystokracji.

Shaolin [Szao-lin] łączy klasztor buddyzmu chan z tradycjami sztuk walki. Nie każdy mnich był wojownikiem, a kung-fu nie powstało jednego dnia dzięki jednemu przybyszowi. Klasztor posiadał ziemię, angażował się w konflikty i rozwijał ćwiczenia, które z czasem obrosły legendami. Bodhidharma jest ważną postacią tradycji chan, lecz opowieści o stworzeniu przez niego całego systemu walki powstały znacznie później.

Las Pagód jest cmentarzem wybitnych mnichów. Kształt, liczba kondygnacji i inskrypcje mówią o pozycji zmarłego oraz epoce. W samym klasztorze zobaczymy stele na kamiennych żółwiach, opiekunów wejść i drzewa z zagłębieniami przedstawianymi jako ślady ćwiczeń palców. Te ślady są przede wszystkim częścią opowieści miejsca, a nie dowodem nadludzkiej techniki.

Longmen i Shaolin pokazują dwa oblicza buddyzmu: monumentalną sztukę sponsorowaną przez władzę oraz wspólnotę klasztorną, która budowała własną legendę przez stulecia.

W grotach warto patrzeć nie tylko na największy posąg. Setki małych nisz pokazują, że fundatorami byli urzędnicy, mnisi, rodziny i stowarzyszenia. Uszkodzone twarze mają różne przyczyny: erozję, dawne prześladowania religijne, kradzieże oraz handel sztuką. W Shaolin podobnie oddzielamy zabytkowy klasztor od współczesnych szkół działających w okolicy. Uczniowie w jednakowych strojach nie muszą być wyświęconymi mnichami; często trenują w świeckich akademiach.`,['https://whc.unesco.org/en/list/1003','https://whc.unesco.org/en/list/1305'],['Luoyang','Longmen','Wu Zetian','Shaolin']));

  topics.push(make('suzhou-komplet','Suzhou, Tongli, ogrody, Wielki Kanał i jedwab','Suzhou / Tongli','Miasta i trasy',`
Proszę Państwa, Suzhou [Su-dżou] rozwinęło się dzięki wodzie. Miasto leży w delcie Jangcy, przy sieci kanałów i Wielkim Kanale łączącym północ z południem Chin. Kanał pozwalał transportować zboże, podatki, jedwab i towary do stolic. Nie był jedną inwestycją z jednego okresu: łączono oraz rozbudowywano wcześniejsze odcinki przez kolejne dynastie.

Bogactwo handlu stworzyło kulturę prywatnych ogrodów. Ogród Mistrza Sieci jest niewielki, ale wydaje się większy dzięki kompozycji. Budynki, woda, skały, rośliny i okna tworzą zmieniające się kadry. Brama księżycowa nie jest wyłącznie dekoracją: obramowuje widok i prowadzi do kolejnej sceny. Skała zastępuje górę, staw jezioro, a miniaturowy krajobraz penjing pozwala budować naturę w donicy.

Tongli zachowało charakter miasta wodnego z mostami, kanałami i domami stojącymi przy nabrzeżu. Kanał był dawniej ulicą: dowoził towary, ludzi i informacje. Dzisiejsze łodzie wożą głównie turystów, lecz układ miasta nadal pokazuje dawną logikę transportu.

Suzhou słynie z jedwabiu. Jedwabnik tworzy kokon z bardzo długiego włókna. Kokony ogrzewa się, aby przerwać rozwój poczwarki i ułatwić rozwijanie nici. Kilka cienkich włókien łączy się w nić wystarczająco mocną do tkania. Tajemnica produkcji przez stulecia dawała Chinom przewagę, a jedwab stał się towarem, walutą, darem dyplomatycznym i znakiem statusu.

Ogrody, kanały i jedwab łączy precyzja. Włókno jest cienkie, ogród niewielki, kanał wąski, lecz razem stworzyły bogactwo oraz styl życia uczonych i kupców delty Jangcy.

Zwróćcie Państwo uwagę na sposób prowadzenia wzroku. Przez okrągłe przejście widzimy fragment pawilonu, odbicie dachu pojawia się w wodzie, a skała zasłania dalszą część ścieżki. Ogród nie pokazuje wszystkiego od razu. Podobnie miasto wodne odsłania się kolejno spod mostów i zza zakrętów kanału. To przestrzeń zaprojektowana do powolnego oglądania, nawet jeżeli dzisiejszy program daje nam na nią ograniczony czas.`,['https://whc.unesco.org/en/list/813','https://whc.unesco.org/en/list/1443'],['Suzhou','Tongli','Wielki Kanał','jedwab']));

  topics.push(make('jangcy-komplet','Jangcy — Trzy Przełomy, zapora i życie na rzece','Jangcy','Miasta i trasy',`
Proszę Państwa, Jangcy jest najdłuższą rzeką Azji i osią komunikacyjną Chin. Łączy wnętrze kraju z deltą i Szanghajem. Rejs przez Trzy Przełomy pokazuje jednocześnie krajobraz, historię żeglugi i skalę współczesnej inżynierii.

Trzy główne przełomy to Qutang [Czü-tang], Wu [U] i Xiling [Si-ling]. Qutang jest najkrótszy i najbardziej dramatyczny, Wu słynie z wysokich ścian oraz legend, a Xiling jest najdłuższy. Po podniesieniu poziomu wody część dawnych nurtów i niebezpiecznych mielizn zniknęła, a linia brzegowa się zmieniła. Góry nadal dominują nad statkiem, ale oglądamy krajobraz przekształcony przez zbiornik.

Miasto Białego Cesarza stoi przy wejściu do Qutang i wiąże się z historią Liu Beia z epoki Trzech Królestw. Boczne doliny, takie jak Strumień Bogini, pozwalają zejść z wielkiej rzeki do węższego krajobrazu. Dokładny wariant zależy od statku, poziomu wody i programu.

Zapora Trzech Przełomów produkuje ogromne ilości energii, pomaga w kontroli powodzi i poprawiła warunki żeglugi. Jej budowa wymagała przesiedlenia ponad miliona ludzi, zatopiła miejscowości i stanowiska archeologiczne oraz zmieniła ekosystem. Nie jest wyłącznie triumfem ani wyłącznie katastrofą. To projekt, w którym korzyści energetyczne i transportowe mają potężną cenę społeczną oraz środowiskową.

Śluzy podnoszą i opuszczają statki etapami, a podnośnia umożliwia szybsze przenoszenie mniejszych jednostek. Po wyokrętowaniu w Yichang kończy się rejs, ale nie znaczenie rzeki. Jangcy pozostaje korytarzem fabryk, miast, rolnictwa i transportu.

Na statku pamiętajmy, że godziny wycieczek, przystań i kolejność atrakcji mogą się zmieniać. Rzeka podporządkowuje program pogodzie, poziomowi wody i ruchowi jednostek.

Przed budową zapory przełomy budziły respekt pilotów rzecznych. Nurty, skały i zmienny poziom wody utrudniały żeglugę, a łodzie korzystały z wiedzy lokalnych załóg. Dziś większe jednostki płyną spokojniej, lecz dawne opowieści o burłakach, sygnałach i niebezpiecznych odcinkach pomagają zrozumieć, jak wielką zmianę przyniosła regulacja rzeki. Rejs jest zatem podróżą po współczesnym zbiorniku i jednocześnie przez pamięć dawnej Jangcy.`,['https://www.ctg.com.cn/','https://www.britannica.com/place/Yangtze-River'],['Jangcy','Trzy Przełomy','zapora']));

  topics.push(make('leshan-wuhan-komplet','Leshan i Wuhan — Budda, rzeki i miasta środkowych Chin','Syczuan / Wuhan','Miasta i trasy',`
Proszę Państwa, Wielki Budda w Leshan został wykuty w klifie przy zbiegu trzech rzek. Prace rozpoczął w VIII wieku mnich Haitong. Według tradycji wierzył, że obecność Buddy uspokoi niebezpieczne nurty i ochroni żeglarzy. Sama budowa mogła rzeczywiście zmniejszyć zagrożenie, ponieważ ogromna ilość kamienia zrzucona do rzeki przekształciła dno przy brzegu.

Posąg przedstawia Maitreyę, Buddę przyszłości, i ma około siedemdziesięciu metrów wysokości. System ukrytych kanałów odprowadza wodę z głowy oraz ciała, choć erozja i wilgoć nadal są poważnym problemem. Oglądając figurę z łodzi widzimy całość, a schodząc przy klifie odczuwamy skalę poszczególnych części.

Wuhan powstał z połączenia trzech historycznych miast: Wuchang, Hankou i Hanyang. Leży przy spotkaniu Jangcy i rzeki Han. Hankou rozwinęło się jako port handlowy, Wuchang jako centrum administracyjne i edukacyjne, a Hanyang jako ośrodek przemysłowy. Most przez Jangcy, otwarty w 1957 roku, połączył sieci kolejowe północy i południa.

Miasto ma szczególne miejsce w historii rewolucji 1911 roku, ponieważ powstanie w Wuchangu uruchomiło wydarzenia prowadzące do upadku dynastii Qing. Współcześnie Wuhan jest wielkim centrum transportowym, przemysłowym i uniwersyteckim. Świat poznał jego nazwę podczas pandemii COVID-19, lecz sprowadzenie miasta wyłącznie do epidemii usuwa ponad dwa tysiące lat jego historii.

Leshan pokazuje próbę oswojenia rzeki poprzez religię i pracę w skale. Wuhan pokazuje, jak rzeki budują handel, przemysł i węzeł komunikacyjny. W obu przypadkach woda jest głównym bohaterem.

W Leshan wielkość posągu miała działać również na wyobraźnię ludzi płynących rzeką. Budda nie stoi w odizolowanej galerii; jest częścią góry i szlaku wodnego. Wuhan rozwija tę samą zależność w nowoczesnej skali: porty, mosty, koleje i dzielnice powstały wokół przepraw. Patrząc na oba miejsca, widzimy, jak rzeka może być jednocześnie zagrożeniem, drogą, źródłem bogactwa i osią pamięci.`,['https://whc.unesco.org/en/list/779','https://english.wuhan.gov.cn/'],['Leshan','Wuhan']));

  const supplements={
    'ctf-szanghaj-komplet':`
Warto jeszcze zwrócić uwagę na samą skalę zmiany. Pudong nie jest po prostu nową dzielnicą mieszkaniową. To obszar zaplanowany jako wizytówka finansów, handlu i usług, połączony z lotniskami, portem oraz zapleczem przemysłowym delty Jangcy. Dlatego panorama ma znaczenie praktyczne i symboliczne jednocześnie. Wieżowce mieszczą biura i hotele, ale ich sylwetki pracują również jak logo miasta.

Szanghaj bywa nazywany najbardziej międzynarodowym miastem Chin, jednak jego rozwój zawsze zależał także od przybyszów z innych części kraju. Robotnicy portowi, kupcy, urzędnicy, uchodźcy i późniejsi migranci przynosili własne dialekty, kuchnie oraz doświadczenia. Lokalny szanghajski należy do grupy języków wu i brzmi inaczej niż mandaryński. Współczesne miasto posługuje się wspólnym językiem państwowym, ale lokalna mowa pozostaje ważną częścią tożsamości.`,
    'ctf-szanghaj-swiatynie':`
W świątyni łatwo zauważyć, że ludzie nie zachowują się identycznie. Jedni składają dłonie, inni zapalają trzy kadzidła, ktoś losuje wróżbę, a ktoś tylko przechodzi między pawilonami. Trzy kadzidła bywają tłumaczone jako szacunek dla Buddy, nauki i wspólnoty albo jako symbol nieba, ziemi i człowieka. Nie istnieje jednak jeden gest obowiązujący wszystkich chińskich buddystów. Praktyka zależy od świątyni, rodziny i osobistej intencji.

Ogród Yuyuan pozwala zauważyć podobną zasadę w architekturze. Pełnia powstaje z przeciwieństw: skała stoi obok wody, ciemny korytarz prowadzi ku jasnemu dziedzińcowi, a małe wnętrze otwiera się na szerszy widok. Smocze mury nie są wyłącznie dekoracją. Prowadzą wzrok i dzielą przestrzeń, a ich falująca linia sprawia, że nieruchomy mur wydaje się żywy. Wizyta w świątyni i ogrodzie pokazuje więc dwie metody porządkowania świata: rytuał porządkuje relacje ludzi z tym, co niewidzialne, a ogród porządkuje krajobraz w miniaturze.`,
    'ctf-huangshan-huizhou':`
W domach Huizhou warto spojrzeć w górę. Wewnętrzne dziedzińce tianjing, czyli „studnie nieba”, wpuszczają światło i deszcz do zwartego domu. Woda spływająca do środka symbolicznie gromadzi pomyślność zamiast pozwalać jej odpłynąć. Rzeźbione belki, kamienne portale i drewniane przegrody informowały o zamożności oraz ambicjach rodziny, nawet jeśli zewnętrzne ściany pozostawały oszczędne.

Kupcy Huizhou odnosili sukcesy między innymi w handlu solą, herbatą, drewnem i zastawach finansowych. Ponieważ prestiż w cesarskich Chinach należał przede wszystkim do wykształconych urzędników, rodzina kupiecka próbowała zamienić pieniądze w kulturę: finansowała szkołę, bibliotekę, świątynię przodków albo naukę syna do egzaminów. Dlatego tutejsza architektura nie jest tylko opowieścią o bogactwie. Jest opowieścią o próbie zdobycia społecznego uznania poprzez edukację, pamięć rodu i dobry smak.`,
    'ctf-changsha-mao':`
Rzeka Xiang przepływająca przez Changshę była dla młodego Mao miejscem ćwiczeń, spacerów i spotkań. W późniejszej poezji wraca obraz człowieka stojącego wobec nurtu historii i pytającego, kto zdecyduje o przyszłości kraju. Wyspa Pomarańczowa łączy więc konkretną biografię z oficjalnie budowanym symbolem młodości oraz rewolucyjnej energii.

Warto oddzielić trzy rzeczy: historycznego Mao, legendę tworzoną przez państwo oraz prywatne wspomnienia rodzin. Te obrazy nie zawsze do siebie pasują. Można uznawać jego rolę w zjednoczeniu państwa i jednocześnie mówić o katastrofalnych skutkach Wielkiego Skoku oraz rewolucji kulturalnej. Taka podwójna perspektywa nie rozmywa historii. Przeciwnie, pozwala zrozumieć, dlaczego portret tej samej osoby może wywoływać dumę, nostalgię, milczenie albo bolesne wspomnienia.`,
    'ctf-zhangjiajie-komplet':`
Najbardziej charakterystyczne sosny nie stoją tu przypadkiem. Korzenie wykorzystują pęknięcia skały, a wilgotny klimat pomaga roślinności utrzymać się na stromych ścianach. Korzenie dodatkowo poszerzają szczeliny, więc życie uczestniczy w powolnym rozpadzie skały. Mgła wzmacnia wrażenie, że filary unoszą się w powietrzu, ponieważ zasłania ich podstawy. Ten sam krajobraz w pełnym słońcu wygląda geologicznie i monumentalnie, a we mgle niemal nierealnie.

Nazwy punktów widokowych często opowiadają legendę, zanim zobaczymy skałę. „Pierwszy Most pod Niebem”, „Ogród w Powietrzu” czy „Żołnierze Cesarza” kierują wyobraźnią. To stary chiński sposób oswajania krajobrazu: góra przestaje być anonimowym obiektem i staje się sceną historii. Współczesny marketing Avatara korzysta więc z mechanizmu znacznie starszego od kina — nadaje skale nazwę i podpowiada, co mamy w niej zobaczyć.`,
    'ctf-chongqing-komplet':`
Kolejnym kluczem do miasta jest hot pot. W Chongqingu tradycyjny wywar bywa bardzo intensywny, z chili, pieprzem syczuańskim i warstwą tłuszczu utrzymującą temperaturę. Składniki gotuje się wspólnie, ale każdy pilnuje własnego kawałka mięsa, tofu lub warzyw. Dawniej tanie podroby i mocne przyprawy pasowały do robotniczego miasta portowego. Dzisiaj hot pot jest jednocześnie codziennym posiłkiem, rytuałem spotkania i rozpoznawalną marką Chongqingu.

Schody, kolejki, promy i linie metra pokazują, że transport musi negocjować z terenem. W wielu płaskich miastach rzeka jest jedną z granic centrum. Tutaj dwie rzeki i strome zbocza tworzą kolejne poziomy. Dlatego najbardziej uczciwy sposób oglądania Chongqingu polega na zmianie perspektywy: z mostu, z nabrzeża, z wagonu i z ulicy położonej wysoko nad rzeką. Dopiero wtedy pozorny chaos układa się w całość.`,
    'ctf-chengdu-komplet':`
Chengdu leży w żyznej Kotlinie Syczuańskiej, a jej rolniczą stabilność przez stulecia wspierał system irygacyjny Dujiangyan. Zamiast zatrzymać rzekę jedną wielką zaporą, starożytni inżynierowie rozdzielili nurt, odprowadzili nadmiar wody i skierowali część jej przepływu na pola. System działa po kolejnych modernizacjach do dzisiaj. Pokazuje to, że historia regionu nie zaczyna się od pandy ani ostrej kuchni, lecz od umiejętnego zarządzania wodą.

Herbaciarnia jest dobrym miejscem, aby zobaczyć lokalny rytm. Można siedzieć długo nad jednym naczyniem, rozmawiać, obserwować graczy w mahjonga albo skorzystać z tradycyjnego czyszczenia uszu, które dla przyjezdnych bywa zaskakującym widowiskiem. Ten obraz leniwego Chengdu jest częściowo stereotypem, bo miasto pracuje szybko i rozwija nowe technologie. Stereotyp utrzymał się jednak dlatego, że mieszkańcy rzeczywiście cenią przestrzenie wspólnego odpoczynku.`,
    'ctf-pekin-codzienny':`
Hutong nie oznacza pojedynczego domu, lecz uliczkę tworzoną przez zespoły dziedzińcowych domów siheyuan. Klasyczny układ podporządkowywał przestrzeń hierarchii rodziny i kierunkom świata. Najważniejszy budynek stał zwykle po północnej stronie i był zwrócony ku południu, boczne skrzydła zajmowali inni członkowie rodziny, a dziedziniec tworzył półprywatne centrum codzienności. W praktyce wiele takich domów dzielono później między liczne rodziny i dobudowywano prowizoryczne pomieszczenia.

Dzisiejszy Pekin próbuje jednocześnie chronić wybrane hutongi i poprawiać warunki życia mieszkańców. Powstaje napięcie między autentyczną dzielnicą, drogim odrestaurowanym domem, kawiarnią dla odwiedzających i zwykłą potrzebą łazienki czy ogrzewania. Dlatego spacer po hutongu opowiada nie tylko o cesarskiej przeszłości. Pokazuje także pytanie, czy historyczne centrum ma być zabytkiem, przestrzenią turystyczną, luksusowym adresem czy nadal miejscem codziennego życia.`,
    'ctf-mur-ming':`
Na murze dobrze widać, że nie jest to jedna identyczna konstrukcja biegnąca od morza po pustynię. Budowano go w różnych epokach z materiałów dostępnych na miejscu: ubijanej ziemi, kamienia, cegły i drewna. Odcinki odwiedzane koło Pekinu są głównie dziełem dynastii Ming, która po utracie władzy nad stepem wzmacniała północną granicę. Wieże służyły obserwacji, schronieniu, przekazywaniu sygnałów i organizacji obrony.

Grobowce Ming uzupełniają tę historię. Mur miał chronić państwo od zewnątrz, a nekropolia porządkowała pamięć dynastii od wewnątrz. Święta Droga prowadzi między kamiennymi urzędnikami i zwierzętami, jakby cesarski dwór trwał również po śmierci. Dingling pokazuje natomiast cenę archeologicznej ciekawości: po otwarciu grobowca w latach pięćdziesiątych część przedmiotów źle zabezpieczono, a późniejsze wydarzenia polityczne przyniosły dalsze zniszczenia.`,
    'chiny-wspolczesne-komplet':`
Reformy nie oznaczały jednego dnia, w którym gospodarka centralnie planowana zmieniła się w rynek. Był to proces eksperymentów: odpowiedzialność gospodarstw wiejskich za produkcję, specjalne strefy ekonomiczne, otwieranie na inwestycje i stopniowa zgoda na prywatną przedsiębiorczość. Popularne określenie „przechodzenie przez rzekę, wyczuwając kamienie” dobrze oddaje ostrożny sposób testowania rozwiązań w wybranych miejscach, zanim rozszerzono je na większą skalę.

Współczesne plany państwowe nie są dokładnym rozkazem opisującym każdą decyzję firmy czy rodziny. Wyznaczają priorytety, finansowanie i kierunek działania administracji: technologie, bezpieczeństwo energetyczne, rozwój regionów, konsumpcję lub ochronę środowiska. Ich znaczenie najlepiej oceniać po przyjętym tekście i późniejszym wykonaniu, a nie po samych zapowiedziach. W ten sposób można mówić o chińskim planowaniu bez tworzenia obrazu kraju sterowanego jednym przyciskiem.`,
    'chiny-spoleczenstwo-komplet':`
Polityka jednego dziecka nigdy nie działała identycznie wobec wszystkich. Przepisy, wyjątki i ich egzekwowanie zależały od okresu, prowincji, miejsca zamieszkania oraz przynależności etnicznej. W miastach ograniczenie było zwykle silniejsze, podczas gdy część rodzin wiejskich i mniejszości mogła korzystać z wyjątków. Skutki są jednak widoczne szeroko: mniejsze roczniki młodych ludzi, szybkie starzenie się społeczeństwa oraz model rodziny, w którym jedno dziecko może czuć odpowiedzialność za rodziców i dziadków.

Migracja ze wsi do miast zbudowała ogromną część współczesnych Chin. System hukou przypisuje rejestrację do miejsca i typu gospodarstwa, co przez lata utrudniało migrantom równy dostęp do części usług publicznych w mieście. Reformy stopniowo zmieniają zasady, ale sytuacja różni się między metropoliami i mniejszymi ośrodkami. Za panoramą nowych dzielnic stoją więc nie tylko deweloperzy i państwo, lecz także miliony ludzi, którzy przyjechali budować, produkować, dostarczać przesyłki i obsługiwać miejskie życie.`,
    'chiny-kultura-komplet':`
Wspólnym elementem wielu zwyczajów jest relacja, a nie abstrakcyjna reguła. Herbata może być napojem, prezentem, przeprosinami albo znakiem szacunku. Czerwony kolor może ozdabiać wesele i święto, ale w innym kontekście samo użycie barwy nie gwarantuje szczęścia. Liczby, smoki, lwy oraz bramy nabierają sensu poprzez sytuację, miejsce i ludzi. Dlatego chińskiej symboliki nie warto uczyć się jak tabeli, w której jeden znak zawsze oznacza jedną rzecz.

Podobnie działa kult przodków. Nie musi wykluczać buddyzmu, taoizmu ani świeckiego życia. Rodzina może odwiedzić grób podczas Qingming, zapalić kadzidło w świątyni i jednocześnie nie określać siebie jako religijnej. Papierowe dary spalane dla zmarłych pokazują wyobrażenie, że więź rodzinna nie kończy się wraz ze śmiercią. Nowoczesne wersje papierowych telefonów czy samochodów dowodzą, że stary rytuał potrafi wchłonąć przedmioty współczesnego świata.`,
    'chiny-praktyczne-komplet':`
W codziennej podróży najwięcej spokoju daje przygotowanie kilku rzeczy przed wyjściem: adresu po chińsku, naładowanego telefonu, działającej metody płatności i zdjęcia najważniejszej rezerwacji. Nazwa zapisana alfabetem łacińskim może nie wystarczyć kierowcy, ponieważ ten sam zapis da się źle wymówić, a duże miasto ma wiele podobnie brzmiących miejsc. Chińskie znaki oraz pinezka na mapie rozwiązują problem szybciej niż długa rozmowa.

Na dworcach i lotniskach dokument tożsamości jest częścią biletu. Kontrola może odbywać się kilka razy: przy wejściu do terminala, przed peronem i podczas wejścia do pociągu. W zatłoczonych miejscach warto umawiać punkt zbiórki opisany konkretnym numerem wyjścia, bramką albo widocznym sklepem. „Spotykamy się przy wejściu” jest ryzykowne, gdy wejść jest kilkanaście. Dobra odprawa nie polega na mnożeniu ostrzeżeń, lecz na podaniu jednej jasnej kolejności działań.`,
    'luoyang-komplet':`
Groty Longmen powstawały przez kilka stuleci, dlatego nie tworzą jednej jednolitej galerii. Zmieniają się proporcje postaci, twarze, stroje i skala kompozycji. Wczesne rzeźby zachowują smukłość oraz wpływy sztuki przybyłej Jedwabnym Szlakiem, późniejsze dzieła dynastii Tang mają pełniejsze formy i większą monumentalność. Najsłynniejszy Budda Wajroczana w świątyni Fengxian uosabia kosmiczny wymiar buddy i potęgę państwa.

Z cesarzową Wu Zetian łączy się popularna opowieść, że twarz posągu otrzymała jej rysy. Nie ma na to prostego dowodu, ale legenda jest użyteczna, ponieważ przypomina o jej patronacie i niezwykłej pozycji. Wu była jedyną kobietą w historii cesarskich Chin, która przyjęła pełny tytuł cesarza i założyła własną dynastię Zhou. Wspierała buddyzm także dlatego, że teksty i proroctwa religijne mogły legitymizować władzę wykraczającą poza konfucjański model kobiety na dworze.`,
    'suzhou-komplet':`
Suzhou wzbogaciło się dzięki położeniu w delcie Jangcy, kanałom, jedwabiowi i bliskości Wielkiego Kanału. Kanał nie jest pojedynczym wykopem wykonanym w jednej epoce. Kolejne państwa łączyły rzeki i wcześniejsze odcinki, aż powstał system transportowy spinający południowe obszary produkcji ryżu z polityczną północą. Barki przewoziły zboże, towary i podatki, a miasta leżące przy trasie rozwijały handel oraz rzemiosło.

Jedwab zaczyna się od niepozornego kokonu. Gąsienica jedwabnika tworzy długie włókno, które po zmiękczeniu kokonu można odwinąć, połączyć z innymi nićmi i utkać. Uzyskanie tkaniny wymagało hodowli morwy, troski o jedwabniki oraz wyspecjalizowanej pracy. Tajemnica produkcji nie pozostała w Chinach na zawsze, ale przez stulecia jedwab był jednym z najbardziej pożądanych chińskich towarów i dał nazwę całej sieci szlaków handlowych.

W Tongli kanał nadal organizuje układ miasta. Mosty nie są jedynie dekoracją do fotografii; łączyły sąsiedztwa i wyznaczały codzienną drogę mieszkańców. Słynne Trzy Mosty odwiedza się jako symbol pomyślności, spokoju i długiego życia. Spacer między nimi pokazuje, że „wodne miasto” to nie chińska wersja Wenecji w miniaturze, lecz własny model osady, w której tylne drzwi domu mogły wychodzić bezpośrednio na drogę wodną.`,
    'jangcy-komplet':`
Trzy Przełomy mają własne charaktery. Qutang jest najkrótszy i najbardziej dramatyczny, ze stromymi ścianami zwężającymi rzekę. Wu kojarzy się z mgłą, długimi grzbietami oraz Dwunastoma Szczytami. Xiling jest najdłuższy i dawniej słynął z niebezpiecznych mielizn oraz wirów. Budowa zapory i podniesienie poziomu wody zmieniły krajobraz oraz warunki żeglugi, ale nie usunęły skalnych bram wyznaczających przełomy.

Zapora Trzech Przełomów ma kilka ról: produkuje energię elektryczną, pomaga kontrolować wezbrania i poprawia żeglugę na górnej Jangcy. Jednocześnie jej budowa oznaczała przesiedlenie ogromnej liczby mieszkańców, zatopienie miejscowości i stanowisk historycznych oraz trwałą zmianę ekosystemu. Tych skutków nie da się zamknąć w prostym zdaniu „dobra” albo „zła”. Jest to projekt o olbrzymich korzyściach technicznych i równie olbrzymiej cenie społecznej oraz środowiskowej.

Podczas rejsu rzeka zmienia funkcję każdego dnia. Raz jest drogą transportową, raz krajobrazem, raz zbiornikiem energetycznym. Miasto Białego Cesarza otwiera opowieść o historii i poezji, boczne doliny pokazują mniejszą skalę dopływów, a Yichang kieruje uwagę ku nowoczesnej inżynierii. Najlepszą osią całej podróży jest więc pytanie, jak kolejne pokolenia próbowały żyć z potężną rzeką, korzystać z niej i ograniczać jej zagrożenia.`,
    'leshan-wuhan-komplet':`
Budowa Wielkiego Buddy trwała około dziewięćdziesięciu lat i rozpoczęła się w epoce Tang. Mnich Haitong wierzył, że obecność Maitrei uspokoi niebezpieczne wody u zbiegu rzek. Legenda mówi, że gdy urzędnicy próbowali przejąć zebrane pieniądze, mnich wyłupił sobie oko, aby pokazać determinację. Historycznie ważny był także praktyczny skutek prac: kamień usuwany ze zbocza trafiał do rzeki i mógł zmienić miejscowe prądy oraz płycizny.

Wuhan tworzą historyczne ośrodki Wuchang, Hankou i Hanyang. Wuchang kojarzy się z administracją i powstaniem 1911 roku, Hankou z handlem oraz portem, a Hanyang z przemysłem. Most na Jangcy otwarty w 1957 roku połączył kolejowo i drogowo brzegi wielkiej rzeki, stając się symbolem nowego państwa. Żółty Żurawi Pawilon, choć wielokrotnie niszczony i odbudowywany, przechowuje natomiast starszą pamięć miasta w poezji oraz legendzie.

Jeziora są równie ważne jak rzeki. East Lake należy do największych miejskich obszarów wodnych w Chinach i przypomina, że Wuhan nie jest wyłącznie węzłem mostów oraz fabryk. To także miasto uniwersytetów, parków i sezonu kwitnących wiśni. Dzięki temu obraz staje się pełniejszy: rewolucja, przemysł, edukacja i codzienne życie spotykają się między Jangcy a Han. `
  };
  for(const topic of topics){
    const extra=supplements[topic.id];
    if(!extra) continue;
    topic.sections[0].content+=p(extra);
    const total=topic.sections[0].content.replace(/<[^>]+>/g,' ').trim().split(/\s+/).filter(Boolean).length;
    topic.readingTime=Math.max(3,Math.ceil(total/150));
  }
  const finalSupplements={
    'ctf-huangshan-huizhou':`Herbata z okolic Huangshan, zwłaszcza Huangshan Maofeng, przypomina jeszcze o związku krajobrazu z gospodarką. Wilgotne zbocza i mgły sprzyjają uprawie, a nazwa herbaty odwołuje się do delikatnych pąków przypominających szczyty pokryte jasnym meszkiem. Filiżanka łączy więc góry, pracę rolników i kupieckie szlaki Huizhou.`,
    'ctf-changsha-mao':`Muzeum prowincji Hunan dodaje do tej historii znacznie starszą warstwę. Grobowce w Mawangdui zachowały tkaniny, przedmioty codzienne i ciało markizy Dai z epoki Han. Dzięki nim Changsha nie jest wyłącznie miastem Mao. Pokazuje ponad dwa tysiące lat lokalnej elity, medycyny, kuchni i wyobrażeń o życiu po śmierci.`,
    'ctf-chongqing-komplet':`Warto też spróbować spojrzeć na miasto za dnia i po zmroku. Dzienne światło odsłania beton, wilgoć i strome osiedla; nocne iluminacje zamieniają te same bryły w widowisko. Oba obrazy są prawdziwe. Internet zwykle pokazuje drugi, ale codzienne Chongqing składa się również z wind, targów, dostawców i mozolnego pokonywania różnic wysokości.`,
    'ctf-pekin-codzienny':`Metro rozwiązuje wielkie odległości, lecz wymaga przejścia kontroli bezpieczeństwa i odnalezienia właściwego wyjścia. Stacja może mieć kilka lub kilkanaście wyjść prowadzących na różne strony szerokiego skrzyżowania. Dlatego numer wyjścia jest częścią adresu. W Pekinie pomyłka o jedną literę potrafi oznaczać długi spacer do przejścia podziemnego.`,
    'luoyang-komplet':`Luoyang był stolicą wielu dynastii i leży blisko miejsca, które tradycja łączy z klasztorem Shaolin. Sam klasztor należy odróżnić od pokazowej wersji kung-fu. Chan, medytacja, dyscyplina klasztorna, ćwiczenia fizyczne i późniejsza kultura widowiskowa nakładały się na siebie przez stulecia. Dzisiejszy pokaz jest częścią tej historii, ale nie jej całością.`,
    'suzhou-komplet':`Ogród Mistrza Sieci zawdzięcza nazwę uczonemu, który marzył o prostszym życiu rybaka. Niewielka powierzchnia nie jest wadą: dzięki proporcjom budynków, wodzie i pożyczonym widokom ogród wydaje się większy. Każde okno działa jak rama obrazu. Ten sam fragment skały oglądany z pawilonu i korytarza staje się dwiema różnymi scenami.`,
    'jangcy-komplet':`Na statku warto rozróżniać czas żeglugi od czasu wycieczek lądowych. Poziom wody, pogoda i decyzje operatora mogą zmieniać miejsce postoju oraz kolejność zwiedzania. Najpewniejsza informacja pochodzi więc z odprawy danego wieczoru. Rzeka jest częścią programu, ale pozostaje działającym szlakiem transportowym, a nie scenografią ustawioną wyłącznie dla wycieczki.`,
    'leshan-wuhan-komplet':`W Leshan system ukrytych kanałów odwadniających pomaga chronić rzeźbę przed wodą spływającą po skale. Mimo to wilgoć, roślinność, zanieczyszczenia i tłum odwiedzających stale wpływają na stan zabytku. Monumentalna skala nie oznacza niezniszczalności. Wielki Budda przetrwał dzięki połączeniu pierwotnego projektu, kolejnych napraw i współczesnej konserwacji. To również historia cierpliwej opieki nad kamieniem.`
  };
  for(const topic of topics){
    const extra=finalSupplements[topic.id];
    if(!extra) continue;
    topic.sections[0].content+=p(extra);
    const total=topic.sections[0].content.replace(/<[^>]+>/g,' ').trim().split(/\s+/).filter(Boolean).length;
    topic.readingTime=Math.max(3,Math.ceil(total/150));
  }

  window.WANFANG_EXPANDED_TOPICS=topics;
  const binding={
    'szanghaj':'ctf-szanghaj-komplet','pudong':'ctf-szanghaj-komplet','perla-orientu':'ctf-szanghaj-komplet','swfc':'ctf-szanghaj-komplet','bund':'ctf-szanghaj-komplet','bund-most-pomnik':'ctf-szanghaj-komplet','szanghaj-gangsterzy':'ctf-szanghaj-komplet','szanghaj-port':'ctf-szanghaj-komplet','nanjing-road':'ctf-szanghaj-komplet',
    'jadeitowy-budda':'ctf-szanghaj-swiatynie','chenghuang':'ctf-szanghaj-swiatynie','ogrody-chinskie':'ctf-szanghaj-swiatynie','moon-gates':'ctf-szanghaj-swiatynie','penjing':'ctf-szanghaj-swiatynie',
    'huangshan':'ctf-huangshan-huizhou','hongcun-tunxi':'hongcun-tunxi','hongcun-woda':'hongcun-tunxi','architektura-huizhou':'hongcun-tunxi','tunxi':'hongcun-tunxi','cztery-skarby':'hongcun-tunxi',
    'changsha':'changsha','mlody-mao':'changsha','mao-reformy':'ctf-changsha-mao','kuchnia-hunan':'ctf-changsha-mao',
    'zhangjiajie':'zhangjiajie','tianmen':'zhangjiajie','droga-99':'zhangjiajie','golden-whip':'zhangjiajie','bailong':'zhangjiajie','yuanjiajie':'zhangjiajie','tianzi':'zhangjiajie','avatar':'zhangjiajie','tujia-miao':'zhangjiajie','szklany-most':'zhangjiajie',
    'chongqing':'ctf-chongqing-komplet','liziba':'ctf-chongqing-komplet','ciqikou':'ctf-chongqing-komplet','hongyadong':'ctf-chongqing-komplet','raffles-city':'ctf-chongqing-komplet','nanbin-road':'ctf-chongqing-komplet','chongqing-wojenna-stolica':'ctf-chongqing-komplet',
    'chengdu':'ctf-chengdu-komplet','pandy':'ctf-chengdu-komplet','panda-base':'ctf-chengdu-komplet','wenshu':'ctf-chengdu-komplet','wuhou':'ctf-chengdu-komplet','jinli':'ctf-chengdu-komplet','kuchnia-syczuan':'ctf-chengdu-komplet','opera-syczuanska':'ctf-chengdu-komplet',
    'pekin-lotniska':'ctf-pekin-codzienny','pekin-metro':'ctf-pekin-codzienny','hutongi':'ctf-pekin-codzienny',
    'wielki-mur':'wielki-mur','mur-odcinki':'wielki-mur','dingling':'swieta-droga','swieta-droga':'swieta-droga'
  };
  Object.assign(binding,{
    'wojna-z-japonia':'chiny-wspolczesne-komplet','wojna-domowa-tajwan':'chiny-wspolczesne-komplet','deng-reformy':'chiny-wspolczesne-komplet','kpch':'chiny-wspolczesne-komplet','plan-15':'chiny-wspolczesne-komplet','nowy-jedwabny-szlak':'chiny-wspolczesne-komplet','kpch-szanghaj':'chiny-wspolczesne-komplet',
    'jedno-dziecko':'chiny-spoleczenstwo-komplet','praca-996':'chiny-spoleczenstwo-komplet','emerytury':'chiny-spoleczenstwo-komplet',
    'medycyna-chinska':'chiny-kultura-komplet','mudry-bodhisattwowie':'chiny-kultura-komplet','taoizm':'chiny-kultura-komplet','przodkowie-pogrzeby':'chiny-kultura-komplet','papierowe-dary':'chiny-kultura-komplet','swieta':'chiny-kultura-komplet','jezyk-pinyin':'chiny-kultura-komplet','liczby-gesty':'chiny-kultura-komplet','chinski-smok':'chiny-kultura-komplet','paifang':'chiny-kultura-komplet','chinska-herbata':'chiny-kultura-komplet','kuchnie-regionalne':'chiny-kultura-komplet','jadeit-nefryt':'chiny-kultura-komplet','porcelana':'chiny-kultura-komplet','wynalazki':'chiny-kultura-komplet',
    'paszporty-wjazd':'chiny-praktyczne-komplet','sim-esim':'chiny-praktyczne-komplet','toalety':'chiny-praktyczne-komplet','bezpieczenstwo':'chiny-praktyczne-komplet','zbiorki':'chiny-praktyczne-komplet','bagaz-pociagi':'chiny-praktyczne-komplet','zakupy-praktyka':'chiny-praktyczne-komplet','klimat-anomalie':'chiny-praktyczne-komplet','codzienne-zwyczaje':'chiny-praktyczne-komplet','chiny-polska':'chiny-praktyczne-komplet','pozegnanie-grupy':'chiny-praktyczne-komplet',
    'luoyang':'luoyang-komplet','longmen':'luoyang-komplet','wu-zetian':'luoyang-komplet','shaolin-detale':'luoyang-komplet',
    'suzhou':'suzhou-komplet','tongli':'suzhou-komplet','ogrod-mistrza-sieci':'suzhou-komplet','wielki-kanal':'suzhou-komplet','jedwab':'suzhou-komplet',
    'rejs-jangcy':'jangcy-komplet','trzy-przelomy':'jangcy-komplet','zapora':'jangcy-komplet','biale-miasto':'jangcy-komplet','strumien-bogini':'jangcy-komplet','szczyt-przelomow':'jangcy-komplet','yichang':'jangcy-komplet',
    'leshan':'leshan-wuhan-komplet','wuhan':'leshan-wuhan-komplet',
    'szanghaj-lotniska':'ctf-szanghaj-komplet','era-show':'ctf-szanghaj-komplet','szanghaj-zoo':'ctf-szanghaj-komplet'
  });
  Object.assign(binding,{'cixi':'palac-letni','swiatynia-nieba':'swiatynia-nieba','kompania-indyjska':'wojny-opiumowe','hongkong-makau':'wojny-opiumowe','hukou':'hukou','gaokao':'gaokao','lwy-bixi':'zakazane-miasto'});
  for(const c of window.WANFANG_CATALOG||[]){if(binding[c.id]){c.topicId=binding[c.id];c.sectionId=null;}}
})();
