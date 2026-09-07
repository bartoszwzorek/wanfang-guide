// Editorial changes only. Source facts are retained; approval concerns the Alipay chapter.
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),ctx={window:{}};vm.createContext(ctx);
for(const f of ['data/topics.js','data/compendium-topics.js','data/ctf-briefings.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
const audit=[];
const pairs=[
 ['Warto mówić o tym z energią:',''],
 ['Na murze warto mówić też o tym, że','Stojąc na murze, pamiętajmy, że'],
 ['Przewodnicko warto dać rady:','Przy jedzeniu warto pamiętać o prostych zasadach:'],
 ['przewodnicko obraz działa świetnie:','obraz jest sugestywny:'],
 ['Nie trzeba uczyć grupy szczegółów, ale warto pokazać, że','Pamiętajmy, że'],
 ['Przewodnicko trzeba dać ludziom klucz, bo inaczej zobaczą „dużo kamieni z napisami”.','Spróbujmy zobaczyć w tych stelach coś więcej niż kamienie z napisami.'],
 ['dlatego w materiale przewodnickim najlepiej trzymać się opisu działań.','dlatego przyjrzyjmy się konkretnym działaniom.'],
 ['Przewodnicko bardzo pomaga prosta oś:','Uporządkujmy to w czasie:'],
 ['W przewodnickiej narracji legalizm dobrze tłumaczy, dlaczego','Legalizm pomaga zrozumieć, dlaczego'],
 ['naukowo i przewodnicko bywa ciekawsza.','pozwala lepiej poznać organizację dawnej armii.'],
 ['W przewodnickiej opowieści warto odwrócić perspektywę.','Odwróćmy na chwilę perspektywę.'],
 ['Ale przewodnicko najważniejsze jest coś innego:','Zwróćmy uwagę na jeszcze jedną rzecz:'],
 ['Źródła i opisy różnią się co do szczegółów modelu, więc przewodnicko najlepiej mówić ostrożnie:','Źródła i opisy różnią się co do szczegółów modelu:'],
 ['przewodnicki sens jest mocny:','pozostaje wyraźny kontrast:'],
 ['gotowe spięcie dla grupy','Zakończenie spaceru'],
 ['I to jest super jako materiał przewodnicki, bo tutaj nie trzeba na siłę udawać, że każdy kamień ma epicką legendę.','Nie każdy kamień musi tutaj mieć własną legendę. Wiele o mieście mówi jego codzienne życie.'],
 ['Można tu też powiedzieć o cesarskim myśleniu o świecie.','Przypomnijmy sobie, jak cesarze wyobrażali sobie porządek świata.'],
 ['Dobry temat przy spokojniejszym spacerze.',''],
 ['Dobry temat, kiedy lokalny mówi „galeria”.',''],
 ['Dlatego tu warto mówić lekko, z humorem.',''],
 ['To jest świetna ciekawostka dla grupy, bo można powiedzieć:',''],
 ['To jest dobry moment, żeby powiedzieć turystom, że','Zwróćcie Państwo uwagę, że'],
 ['Warto mówić jednocześnie o dawnym handlu i o tym, jak współczesne Chiny zamieniają dziedzictwo w produkt czasu wolnego.','Spotykają się tutaj dawny handel i współczesna turystyka, która nadaje starym ulicom nowe funkcje.'],
 ['Warto wyjaśnić różnicę między','Przyjrzyjmy się różnicy między'],
 ['Podkreśl, że','Pamiętajmy, że'],
 ['Nie warto przedstawiać ich jako prostych przeciwieństw;','Nie są prostymi przeciwieństwami;'],
 ['W autokarze można krótko zwrócić uwagę na','Spójrzcie Państwo przez okno i zwróćcie uwagę na'],
 ['Warto pokazać świątynię jak administrację świata niewidzialnego:','Świątynia przypomina administrację świata niewidzialnego:'],
 ['Stań tak, by grupa widziała oba brzegi.','Spójrzmy na oba brzegi rzeki.'],
 ['Możesz zapytać grupę, co bardziej kojarzy im się z Chinami:','Co bardziej kojarzy się Państwu z Chinami:'],
 ['dla grupy najważniejsza jest praktyka:','podczas naszego przejazdu pamiętajmy o praktycznej kwestii:'],
 ['Warto patrzeć na Hongcun jak na działający organizm, nie jak na przypadkową kolekcję fotogenicznych fasad.','Spójrzmy na Hongcun jak na działającą całość: domy, ulice i wodę, które służyły codziennemu życiu mieszkańców.'],
 ['Wnętrza i bramy można wykorzystać do rozmowy o','Wnętrza i bramy wiele mówią o'],
 ['Na starej ulicy można przejść od handlu do kultury pisma:','Na starej ulicy, obok handlu, spotkamy kulturę pisma:'],
 ['Najbezpieczniej oddzielić rolę w zwycięstwie rewolucji od oceny późniejszych kampanii i pokazać, że','Oddzielmy rolę w zwycięstwie rewolucji od oceny późniejszych kampanii. Pamiętajmy, że'],
 ['Jutro i pojutrze grupa zobaczy','Podczas zwiedzania zobaczymy'],
 ['Warto powiedzieć, że','Pamiętajmy, że'],
 ['Można opowiedzieć, jak w Chinach','Przyjrzyjmy się, jak w Chinach'],
 ['To dobry temat o rozwoju turystyki krajowej i o tym, jak','To przykład rozwoju turystyki krajowej. Widzimy tu, jak'],
 ['Liczby warto podać tylko raz, a potem przełożyć na obraz:','Wyobraźmy sobie ten krajobraz:'],
 ['Warto poprosić grupę, by patrzyła','Spójrzcie Państwo'],
 ['Można zachęcić grupę, by sama nazwała jedną z formacji.','Spróbujcie Państwo sami nadać nazwę jednej z tych formacji. Co wam przypomina?'],
 ['Można zestawić to z wczorajszą windą Bailong i pokazać, że','Porównajmy to z windą Bailong:'],
 ['Można połączyć budowę łapy z obserwacją sposobu jedzenia.','Zwróćcie Państwo uwagę, jak budowa łapy pomaga pandzie podczas jedzenia.'],
 ['Warto oddzielić kronikę historyczną od powieści','Oddzielmy kronikę historyczną od powieści'],
 ['Dzięki temu hutong można opowiadać nie tylko jako romantyczną starówkę, ale też jako','Hutong to również'],
 ['Z jednego punktu można omawiać','Rozejrzyjmy się: zobaczymy'],
 ['Nie trzeba zasypywać grupy detalami; wybierz trzy elementy i za każdym razem pokaż, jak architektura komunikuje status.','Przyjrzyjmy się, jak oś, symetria i podział dziedzińców podkreślają rangę poszczególnych miejsc.'],
 ['Legendę można opowiedzieć jako symbol, nie jako dokładny wynik inwentaryzacji.','To symboliczna opowieść; nie jest dokładnym wynikiem inwentaryzacji.'],
 ['Można mówić o przekierowaniu części środków, ale nie sprowadzać kryzysu państwa do jednej kobiety i jednego pawilonu.','Przekierowanie części środków nie wyjaśnia całego kryzysu państwa. Nie sprowadzajmy go do jednej kobiety i jednego pawilonu.'],
 ['Można opowiadać o igrzyskach jako prezentacji nowoczesności, ale też o kosztach, bezpieczeństwie i długim życiu infrastruktury po ceremonii zamknięcia.','Igrzyska były prezentacją nowoczesności. Wiązały się również z kosztami, przygotowaniami do zapewnienia bezpieczeństwa i pytaniem o wykorzystanie obiektów po ceremonii zamknięcia.'],
 ['To pomaga grupie zamienić serię atrakcji w spójną mapę.','W ten sposób kolejne miejsca łączą się w spójną mapę naszej podróży.'],
 ['Można zestawić granit Huangshan','Porównajmy granit Huangshan'],
 ['Dla grupy warto od razu ustawić prosty filtr:','Przyjmijmy prostą zasadę:'],
 ['Dla grupy bezpieczniej powiedzieć:','Według tradycyjnego chińskiego liczenia:'],
 ['Dla turystów to często zaskoczenie:','Może Państwa zaskoczyć, że'],
 ['Dla turysty najlepsza zabawa polega na „czytaniu” figury:','Spróbujmy „przeczytać” figurę:'],
 ['Należy powiedzieć grupie, że','Pamiętajmy, że'],
 ['Jako przewodnik możesz zastosować tę logikę nawet wtedy, gdy organizacja ruchu się zmieni.','Taki sposób patrzenia na znaleziska pomaga je zrozumieć niezależnie od kolejności zwiedzania.'],
 ['I tu od razu pytanie, które lubię zadawać grupie:','I tu od razu pytanie:'],
 ['Dobrze jest o tym powiedzieć turystom, bo wtedy nie widzą tylko „hałasu w zabytku”.','Słysząc te dźwięki, pamiętajmy, że to także żywa przestrzeń spotkań, a nie wyłącznie zabytek.'],
 ['Dla turystów to może być mocne, bo często Chiny ogląda się przez wielkie liczby.','Chiny często oglądamy przez wielkie liczby.'],
 ['Dla turysty to może być niewidoczne.','Podczas krótkiego pobytu możemy tego nie zauważyć.'],
 ['Dla turystów temat szkolnictwa działa świetnie, bo pozwala połączyć starą i nową kulturę.','W szkolnictwie spotykają się dawne tradycje i współczesne ambicje.'],
 ['To porównanie świetnie działa na grupie:','Porównajmy oba miejsca:'],
 ['Gotowa odpowiedź dla grupy:',''],
 ['Jako przewodnik powiedziałbym:',''],
 ['Dla turystów z Europy Pekin / Beijing (Bej-dżing) może być czasem trudny emocjonalnie, bo nie daje się łatwo oswoić.','Pekin / Beijing (Bej-dżing) nie daje się od razu oswoić.'],
 ['Dla turystów to często jest równie ciekawe jak zabytek, bo pomaga poczuć, że','Takie sceny bywają równie ciekawe jak zabytki. Przypominają nam, że'],
 ['Dla turysty to trochę jak przejść','Możemy poczuć się, jakbyśmy przechodzili'],
 ['Najważniejsza myśl dla grupy:',''],
 ['I to jest bardzo ważne dla turysty, bo pozwala zrozumieć, dlaczego','To pomaga nam zrozumieć, dlaczego'],
 ['Dla turysty może to być czasem mylące.','Na pierwszy rzut oka może nas to zmylić.'],
 ['Dla turystów z Europy świetne jest porównanie do różnicy między północą a południem naszego kontynentu.','Porównajmy to z różnicami między północą a południem Europy.'],
 ['Warto tutaj powiedzieć turystom jedną rzecz:','Pamiętajmy o jednej rzeczy:'],
 ['To świetny haczyk dla turystów:','Zwróćcie Państwo uwagę:'],
 ['Dla turysty to jest ważne, bo łatwo patrzeć na mnichów jak na akrobatów.','Patrząc na popisy sprawności, łatwo zobaczyć w mnichach samych akrobatów.'],
 ['Dla turysty z Europy ciekawe jest też to, że','Zwróćcie Państwo również uwagę, że'],
 ['I to jest bardzo fajne dla grupy, bo nagle każdy może to zrozumieć.','W ten sposób łatwiej zrozumieć tę zależność.'],
 ['Dla grupy najlepsze jest porównanie:','Możemy porównać te kuchnie następująco:'],
 ['Dlatego ja bym ten temat opowiadał tak:',''],
 ['I to jest fajne zdanie dla grupy:',''],
 ['A dla grupy, praktycznie:',''],
 ['Warto też powiedzieć grupie, że','Zwróćcie Państwo uwagę, że'],
 ['Dla turysty filary są widokiem.','Podziwiamy skalne filary przede wszystkim jako krajobraz.'],
 ['To też jest świetne miejsce, żeby powiedzieć grupie o skali.','Rozejrzyjmy się i spróbujmy uchwycić skalę tego krajobrazu.'],
 ['Dla turystów może wyglądać dziwnie, ale jej sens jest bardzo prosty:','Na pierwszy rzut oka może wyglądać dziwnie, ale jej sens jest prosty:'],
 ['A przy okazji jej nazwa i kształt dają fajny obraz dla turystów:','Zwróćcie Państwo uwagę na jej nazwę i kształt:'],
 ['To daje świetną puentę dla grupy.',''],
 ['I właśnie dlatego warto opowiedzieć o planach pięcioletnich, po chińsku można powiedzieć','Ważną rolę odgrywają plany pięcioletnie, po chińsku'],
 ['To jest świetny temat do autokaru, bo można go podpiąć pod wszystko, co grupa widzi przez okno.','Skutki tych decyzji możemy dostrzec podczas przejazdu przez miasto.'],
 ['Dla turysty brzmi to technicznie, ale można to opowiedzieć bardzo prosto.','Wyobraźmy sobie, co to oznacza w codziennym życiu.'],
 ['Dla porównania z Polską można powiedzieć tak:','Porównajmy to z Polską:'],
 ['Dla grupy turystycznej świetnie działa prosty kontrast:','Porównajmy dwa miasta:'],
 ['Dla nawijki świetnie działa zestawienie:','Spójrzmy na te budowle obok siebie:'],
 ['Dla turystów świetnie działa porównanie:','Porównajmy odległości:'],
 ['Dla turystów można to opowiedzieć przez prostą obserwację ulicy.','Zwróćcie Państwo uwagę na ruch uliczny.'],
 ['Najuczciwiej powiedzieć turystom tak:',''],
 ['Dla dobrej nawijki warto to rozdzielić.','Są to różne zjawiska i warto je rozróżniać.'],
 ['Dla turystów ważne jest też, żeby nie robić z Chińczyków ludzi żyjących w ciągłym strachu przed punktami.','Nie zakładajmy, że wszyscy mieszkańcy żyją w ciągłym strachu przed punktami.'],
 ['Dla turysty pierwsze wrażenie często jest proste:','Nasze pierwsze wrażenie często jest proste:'],
 ['Dla nawijki bardzo dobrze działa porównanie do Polski.','Porównajmy tę sytuację z Polską.'],
 ['W nawijce warto unikać dwóch skrajności.','Unikajmy dwóch skrajnych ocen.'],
 ['Trzeba wyraźnie oddzielić legendę od historii:','To legenda, a nie potwierdzona historia:'],
 ['Ważne, by nie obiecywać chmur ani widoku','Nie zawsze zobaczymy morze chmur lub rozległy widok'],
 ['W klasztorze warto mówić nie tylko o posągach, lecz o funkcji miejsca:','Zwróćcie Państwo uwagę na życie klasztoru:'],
 ['Można zacząć od pokazania, że','Spójrzcie Państwo:'],
 ['Dobrze wyjaśnić, że','Pamiętajmy, że'],
 ['Warto podkreślić, że','Zwróćcie Państwo uwagę, że'],
 ['Można pokazać, że','Widzimy tutaj, że'],
 ['To warto opowiedzieć z humorem.',''],
 ['Bardzo ładnie można opowiedzieć kaligrafię.','Przyjrzyjmy się kaligrafii.'],
 ['A dobra nawijka przewodnicka działa wtedy, gdy ludzie czują, że wszystko się łączy.','W ten sposób poszczególne miejsca łączą się w historię miasta.'],
 ['To są krótkie, mocne „wrzutki”, które można dorzucić między tematami, kiedy w autokarze robi się cisza albo gdy trzeba płynnie przejść do kolejnego punktu programu. Nie są osobną drugą wersją tekstu — to amunicja do głównej nawijki.',''],
 ['To jest miejsce na najbardziej obrazową nawijkę.',''],
 ['Na sytuacje, kiedy nie ma czasu na pełną nawijkę albo trzeba szybko zebrać uwagę grupy.',''],
 ['Na szybki strzał','W skrócie'],
];
const finalPairs=[
 ['To dobry punkt wyjścia do rozmowy o skali państwa, o różnicy czasu z Polską oraz o tym, dlaczego w zachodnich prowincjach słońce może wschodzić i zachodzić bardzo późno według zegarka.','Dlatego w zachodnich prowincjach słońce może wschodzić i zachodzić bardzo późno według zegarka. Urzędowa godzina jest ta sama co w Pekinie, choć położenie względem Słońca jest inne.'],
 ['dzisiejszych tytułów &#x27;najdłuższy&#x27; lub &#x27;najwyższy&#x27; nie warto powtarzać bez aktualnego sprawdzenia, bo kolejne konstrukcje szybko zmieniają ranking.','od tego czasu powstawały kolejne konstrukcje, więc historycznego rekordu nie należy mylić z dzisiejszym miejscem w rankingu.'],
 ['Rozróżnijmy językiem mówionym','Przyjrzyjmy się różnicy między językiem mówionym'],
 ['życie klasztoru: modlitwie, składaniu ofiar, nauce i wspólnocie mnichów','życie klasztoru: modlitwę, składanie ofiar, naukę i wspólnotę mnichów'],
 ['Hutong to również gęstą przestrzeń','Hutong to również gęsta przestrzeń'],
 ['Dobry motyw przewodni to &#x27;wiele różnych Chin w jednym kraju&#x27;:','Zobaczymy wiele różnych Chin w jednym kraju:'],
 ['To świetny kadr do późniejszej opowieści: zachodnia','Zachodnia'],
 ['Nie próbuj od razu wyjaśniać całego kraju. Lepiej zapowiedzieć, że te elementy będą wracały na kolejnych etapach i dopiero wtedy pokażemy, skąd się wzięły.','Te elementy będą nam towarzyszyły na kolejnych etapach podróży. Przyjrzymy się im bliżej po drodze.'],
 ['Co bardziej kojarzy się Państwu z Chinami: fabryka świata czy jeden z największych rynków konsumenckich.','Co bardziej kojarzy się Państwu z Chinami: fabryka świata czy jeden z największych rynków konsumenckich?'],
 ['Opowieść dobrze łączy buddyzm, pielgrzymowanie i morskie kontakty Szanghaju. Na miejscu odróżnij materiał, pozę i znaczenie przedstawień; szczegóły dotyczące aktualnie eksponowanych figur potwierdź z lokalnym przewodnikiem.','W tej historii spotykają się buddyzm, pielgrzymowanie i morskie kontakty Szanghaju. Przyjrzyjmy się materiałowi, pozie i znaczeniu przedstawień.'],
 ['Pociąg jest dobrym momentem, by wyjaśnić kontrolę tożsamości, rolę paszportu, duże dworce i różnicę między nazwą miasta a konkretną stacją.','Przed podróżą pociągiem pamiętajmy o paszportach, kontroli tożsamości i nazwie konkretnej stacji. Jedno miasto może mieć kilka dworców.'],
 ['Jednocześnie trzeba zaznaczyć, że dzisiejsza wieś','Dzisiejsza wieś'],
 ['spotkamy kulturę pisma: pędzla, tuszu, papieru i kamienia','spotkamy przedmioty związane z kulturą pisma: pędzel, tusz, papier i kamień'],
 ['To dobry moment, by pokazać, że &#x27;kuchnia chińska&#x27;','&#x27;Kuchnia chińska&#x27;'],
 ['Opowiadaj chronologicznie: najpierw uczeń i organizator, później działacz komunistyczny; nie zaczynaj od pomnika jak od gotowego kultu jednostki.','Zanim stał się przywódcą państwa, był uczniem, organizatorem i działaczem politycznym.'],
 ['Nie należy opisywać ich po prostu jako wapiennego krasu podobnego do Guilin.','To inny krajobraz niż wapienny kras znany z okolic Guilin.'],
 ['Na początku uporządkuj geografię.','Uporządkujmy geografię.'],
 ['Jeśli akademia lub muzeum pozostają w programie, połącz je z wcześniejszym shanshui.','W malarstwie shanshui wracają góry i woda.'],
 ['Dzięki temu wizyta nie jest przypadkowym dodatkiem, tylko domknięciem opowieści o tym, jak Chińczycy &#x27;czytają&#x27; góry.','Obraz pokazuje nam więc również sposób patrzenia na góry.'],
 ['To dobry moment na pytanie:','Zastanówmy się:'],
 ['Nie należy jednak mówić, że film był tutaj kręcony albo że każda filmowa skała jest cyfrową kopią konkretnego filaru. Bezpieczniej mówić o wizualnym podobieństwie, materiałach referencyjnych i późniejszym, bardzo skutecznym marketingu miejsca.','Podobieństwo krajobrazu nie oznacza, że film kręcono tutaj ani że każda filmowa skała odtwarza konkretny filar. Rozpoznawalność miejsca wzrosła dzięki wizualnym skojarzeniom z filmem i późniejszej promocji.'],
 ['Zamiast udawać, że wszystko jest oryginalne, pokaż warstwy: dawny plan, zachowane lub odtworzone formy, współczesne kawiarnie i potrzeby turystyki miejskiej.','Zobaczymy tu kilka warstw: dawny plan, zachowane lub odtworzone formy i współczesne kawiarnie odpowiadające na potrzeby turystyki miejskiej.'],
 ['Nie sprowadzaj ochrony do samego rozmnażania: ważne są także siedliska, korytarze ekologiczne i ochrona całego górskiego ekosystemu.','Ochrona gatunku obejmuje również siedliska, korytarze ekologiczne i cały górski ekosystem.'],
 ['W publicznej przestrzeni polityczne tematy przedstawiaj rzeczowo, krótko i bez improwizowanej prowokacji.',''],
 ['Koniecznie odróżnij ten kompleks od Yuanmingyuan, Starego Pałacu Letniego, którego ruiny są osobnym miejscem.','Nie mylmy tego kompleksu z Yuanmingyuan, Starym Pałacem Letnim, którego ruiny są osobnym miejscem.'],
 ['Zamiast powtarzać jedną legendarną tabelę dymów, opowiedz o codzienności: żołnierzach, zaopatrzeniu, zimnie, odległości od rodzin i konieczności utrzymania długiej infrastruktury.','Za sprawnym systemem sygnałów stała codzienna praca żołnierzy: obserwacja, zaopatrzenie i utrzymanie posterunków, często w zimnie i daleko od rodzin.'],
 ['W podsumowaniu wróć do kontrastów:','Przypomnijmy sobie różne oblicza Chin:'],
 ['Poproś o sprawdzenie paszportów, bagażu podręcznego i bramek, a dopiero potem o krótką informację zwrotną. Dobre pytanie brzmi: &#x27;Które miejsce najbardziej zmieniło Państwa wcześniejszy obraz Chin i dlaczego?&#x27;. Odpowiedzi dostarczą też materiału do ulepszania kolejnej opowieści.','Proszę sprawdzić paszporty, bagaż podręczny i numer bramki. A kiedy wszystko będzie gotowe, mam do Państwa pytanie: które miejsce najbardziej zmieniło wasz wcześniejszy obraz Chin i dlaczego?']
];
function wording(value){
 let s=value;
 for(const [a,b] of pairs)s=s.split(a).join(b);
 for(const [a,b] of finalPairs)s=s.split(a).join(b);
 s=s.replace(/(?:I tutaj |I to jest |To jest |To |I )?(?:(?:kapitalny|dobry|świetny) moment, żeby |świetna ciekawostka dla grupy, bo można |warto )?powiedzieć (?:grupie|turystom)(?: coś bardzo ważnego)?\s*:\s*/gi,'');
 s=s.replace(/(?:Dlatego |Można więc |Można )powiedzieć grupie(?: tak)?\s*:\s*/gi,'');
 s=s.replace(/Dla grupy można to (?:powiedzieć|ująć|zakończyć)(?: bardzo)? (?:prosto|tak)\s*:\s*/gi,'');
 s=s.replace(/Jeśli (jedziemy|widzimy)([^.!?]*?), można powiedzieć:/g,'Jeśli $1$2, pamiętajmy:');
 s=s.replace(/Dla turystów — piękne zdjęcie\./g,'Możemy zobaczyć w nim piękny temat do zdjęcia.');
 s=s.replace(/(?:Hak do|PLAN) NAWIJKI/gi,'').replace(/Połączona nawijka do mówienia i czytania/gi,'Starożytne Chiny').replace(/Długa nawijka przewodnicka/gi,'Pełna opowieść');
 const forms={'nawijkami':'opowieściami','nawijkach':'opowieściach','nawijkom':'opowieściom','nawijkę':'opowieść','nawijką':'opowieścią','nawijki':'opowieści','nawijce':'opowieści','nawijka':'opowieść','nawijek':'opowieści'};
 s=s.replace(/nawijkami|nawijkach|nawijkom|nawijkę|nawijką|nawijki|nawijce|nawijka|nawijek/gi,w=>{let r=forms[w.toLowerCase()];return w===w.toUpperCase()?r.toUpperCase():w[0]===w[0].toUpperCase()?r[0].toUpperCase()+r.slice(1):r;});
 return s;
}
function rich(value){
 // Text nodes only: links and original source filenames remain intact.
 let s=value.split(/(<[^>]*>)/g).map(x=>x.startsWith('<')?x:wording(x)).join('');
 s=s.replace(/<h[23][^>]*>\s*(?:Opowieść|Plan sekcji|Plan opowieści)\s*<\/h[23]>/gi,'');
 s=s.replace(/<div[^>]*>\s*<strong>Plan sekcji:<\/strong>[\s\S]*?<\/div>/gi,'');
 s=s.replace(/<p[^>]*>\s*(?:W sekcji „Gotowe opowieści” znajdziesz|Masz gotowe opowieści)[\s\S]*?<\/p>/gi,'');
 s=s.replace(/<p[^>]*>\s*<\/p>/g,'');
 s=s.replace(/(<p[^>]*>\s*)([a-ząćęłńóśźż])/g,(_,a,b)=>a+b.toUpperCase());
 return s;
}
function walk(value,key=''){
 if(typeof value==='string')return ['id','url','source','src','href','name'].includes(key)?value:rich(value);
 if(Array.isArray(value))return value.map(v=>walk(v,key));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,walk(v,k)]));
 return value;
}
function markdownBody(markdown){return markdown.trim().split(/\n\n+/).slice(1).map(p=>'<p>'+p.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>')+'</p>').join('\n');}
const approved=markdownBody(fs.readFileSync(path.join(root,'materials/alipay-wechat-pay-zatwierdzony.md'),'utf8'));
for(const [file,key] of [['data/topics.js','WANFANG_TOPICS'],['data/compendium-topics.js','WANFANG_IMPORTED_TOPICS']]){
 const list=ctx.window[key].map(t=>{
  const next=walk(t);
  if(t.id==='praktyczne-alipay'){
   next.title='Alipay, WeChat Pay i życie bez portfela';next.summary='Od zakupów i rozmów ze znajomymi do płatności QR, miniprogramów i codziennych usług.';
   next.sections=[{id:t.sections?.[0]?.id||'platnosci-aplikacje',title:next.title,content:approved}];
   next.quickTalk=approved.match(/<p>([\s\S]*?)<\/p>/)[1];
   next.guideScripts=[];next.facts=[];next.stats=[];next.status='pełne';next.coverage='material';next.updated='2026-09-07';next.editorialStatus='Zaakceptowany przez użytkownika';
   next.sources=[{name:'Rozdział zaakceptowany w rozmowie; odnośniki źródłowe w tekście',date:'2026-09-07'}];next.reviewNote='Zatwierdzono redakcję tekstu. Zasady usług i płatności mogą się zmieniać.';
   next.readingTime=Math.ceil(approved.replace(/<[^>]+>/g,' ').split(/\s+/).length/150);
  }else{
   next.editorialStatus='Redakcja językowa; informacje zmienne do sprawdzenia';
   if(t.id==='powitanie-grupy'&&!t.preparationSections){
    next.preparationSections=next.sections.filter(s=>s.id.startsWith('punkt-'));
    next.sections=next.sections.filter(s=>!s.id.startsWith('punkt-'));
    // The trailing checklist belongs to preparation, not to the spoken closing.
    for(const s of next.sections){const m=s.content.search(/Checklista 72 godziny/i);if(m>=0){next.preparationSections.push({id:'checklista',title:'Przygotowanie odprawy',content:s.content.slice(m)});s.content=s.content.slice(0,m).replace(/<p>\s*$/,'')+'</p>';}}
    next.quickTalk='Dzień dobry, nazywam się Bartek i będę z Państwem na trasie po Chinach.';next.guideScripts=[];
   }
   if(t.id==='rejs-jangcy'&&!t.preparationSections){
    next.preparationSections=next.sections;next.sections=[{id:'rejs-rozmowa',title:'Przed rejsem',content:'<p>Przed wejściem na statek potwierdzimy miejsce odprawy, sposób przekazania bagaży i najbliższą zbiórkę. Dokładny rozkład dnia otrzymamy zgodnie z programem naszego statku. Proszę zwracać uwagę na przekazywane godziny: program wycieczek i miejsce cumowania mogą zależeć od warunków na rzece.</p>'}];next.quickTalk='Przed wejściem na statek omówimy zasady bagażu, posiłków i zbiórek.';next.guideScripts=[];next.coverage='fragment';
   }
  }
  if(JSON.stringify(next)!==JSON.stringify(t))audit.push({file,id:t.id,title:next.title,editorialStatus:next.editorialStatus});
  return next;
 });
 fs.writeFileSync(path.join(root,file),`window.${key} = `+JSON.stringify(list,null,2)+';\n');
}
fs.writeFileSync(path.join(root,'data/ctf-briefings.js'),'window.WANFANG_CTF_BRIEFINGS = '+JSON.stringify(walk(ctx.window.WANFANG_CTF_BRIEFINGS),null,2)+';\n');
for(const f of ['index.html','assets/app.js','assets/compendium.js','data/catalog.js']){
 const p=path.join(root,f);fs.writeFileSync(p,wording(fs.readFileSync(p,'utf8')));
}
// A portable updated copy of the user's HTML; all substantive chapters retained.
const input=process.argv[2];
if(input){
 let s=fs.readFileSync(input,'utf8');
 s=s.replace(/<section id="platnosci-aplikacje">[\s\S]*?<\/section>/,'<section id="platnosci-aplikacje"><h2>Alipay, WeChat Pay i życie bez portfela</h2><div class="narration">'+approved+'</div></section>');
 s=rich(s).replace(/<section id="(?:jak-uzywac|zakonczenie)">[\s\S]*?<\/section>/g,'').replace(/<a href="#(?:jak-uzywac|zakonczenie)">[\s\S]*?<\/a>/g,'');
 s=s.replace(/<div class="plan">[\s\S]*?<\/div>/g,'').replace(/<div class="transition">[\s\S]*?<\/div>/g,'');
 s=s.replace(/<div class="note">[\s\S]*?<\/div>\s*<\/div>/,'');
 s=s.replace(/<header>[\s\S]*?<\/header>/,'<header><div class="header-inner"><h1>Chiny — nasze kompendium</h1><p>Historia, codzienność i miejsca na trasie.</p></div></header>');
 fs.writeFileSync(path.join(root,'materials/wanfang-kompendium-po-redakcji.html'),s);
}
fs.writeFileSync(path.join(root,'docs/redakcja-2026-09-07.json'),JSON.stringify({date:'2026-09-07',approvedTopic:'praktyczne-alipay',topics:37,importedTopics:31,briefings:15,changesInLastScriptRun:audit,scope:'Redakcja językowa dostępnego zbioru. Lista changesInLastScriptRun obejmuje tylko ostatnie uruchomienie skryptu, nie cały zakres zmian. Nie jest to pełna aktualizacja merytoryczna wszystkich faktów.',publication:'Kopia lokalna; zmiany niewysłane na GitHub i nieopublikowane na stronie konta firmowego.'},null,2));
console.log(JSON.stringify({records:audit.length,approved:'praktyczne-alipay',briefings:ctx.window.WANFANG_CTF_BRIEFINGS.length}));
