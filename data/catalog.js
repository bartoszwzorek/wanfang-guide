/* One catalogue entry per subject. A reference can point to a chapter in a larger material. */
(() => {
  const all=[...new Map([...(window.WANFANG_TOPICS||[]),...(window.WANFANG_IMPORTED_TOPICS||[])].map(t=>[t.id,t])).values()];
  const fold=s=>String(s||'').toLowerCase().replace(/ł/g,'l').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  // id | title | region | programmes | source topic | chapter hint | proposed scope
  const rows=`
pekin|Pekin: początki, nazwa i rozwój|Pekin|CHT CJA CTF|pekin||Oś miasta; dawne stolice; współczesne dzielnice
wielki-mur|Wielki Mur Chiński|Pekin|CHT CJA CTF|wielki-mur||Historia wielu murów; Ming; życie żołnierzy; fakty i legendy
mur-odcinki|Odcinki Wielkiego Muru|Pekin|CHT CJA CTF|||Badaling; Juyongguan; Mutianyu; warianty wejścia i dopasowanie do grupy
zakazane-miasto|Zakazane Miasto|Pekin|CHT CJA CTF|zakazane-miasto||Układ pałacu; dynastie; życie dworu; trasa i detale
tiananmen|Tiananmen i portret Mao|Pekin|CHT CJA CTF|zakazane-miasto|tian|Plac, brama, portret; symbole państwa; historia XX wieku
jingshan|Jingshan — Wzgórze Węglowe|Pekin|CHT CJA CTF|zakazane-miasto|jingshan|Panorama osi; powstanie wzgórza; Chongzhen
palac-letni|Pałac Letni — Yiheyuan|Pekin|CHT CJA CTF|palac-letni||Jezioro Kunming; Cixi; korytarz; kamienny statek; most
cixi|Cixi i schyłek dynastii Qing|Pekin|CHT CJA CTF|palac-letni|kobieta|Pozycja cesarzowej wdowy; finanse dworu; reformy i legendy
swieta-droga|Święta Droga i Grobowce Ming|Pekin|CHT CJA CTF|swieta-droga||Paifang; bixi; aleja zwierząt i urzędników; nekropolia
dingling|Dingling i losy cesarskich grobowców|Pekin|CHT CJA CTF|swieta-droga|dingling|Wykopaliska; konserwacja; zniszczenia; granice zwiedzania
swiatynia-nieba|Świątynia Nieba|Pekin|CHT CJA CTF|swiatynia-nieba||Rytuał cesarski; Niebo i Ziemia; pawilony; liczba dziewięć
hutongi|Hutongi i siheyuan|Pekin|CHT CJA CTF|hutongi||Uliczka a dom; dziedziniec; hierarchia rodzinna; rewitalizacja
pekin-olimpijski|Pekin olimpijski: 2008 i 2022|Pekin|CHT CJA CTF|pekin-olimpijski||Ptasie Gniazdo; Kostka Wody; wieże; ponowne wykorzystanie obiektów
pekin-lotniska|Lotniska Pekinu: PEK i Daxing|Pekin|CHT CJA CTF|||Różne porty i terminale; architektura; dojazdy i spotkania
pekin-metro|Metro, rowery i ruch uliczny w Pekinie|Pekin|CHT CJA CTF|||Metro; rowery miejskie; tablice rejestracyjne; elektryczne skutery
xian-warstwy|Xi’an i Chang’an — dawne stolice|Xi’an|CHT CJA|xian-warstwy||Geografia; dynastie; wielokulturowość; porównanie z Pekinem
armia-terakotowa|Armia Terakotowa|Xi’an|CHT CJA|armia-terakotowa||Odkrycie; pawilony; produkcja figur; barwy; grobowiec
qin-shi-huang|Qin Shi Huang i zjednoczenie Chin|Xi’an|CHT CJA CTF|starozytne-chiny|Qin|Reformy; standaryzacja; praca przymusowa; upadek Qin
xian-mury|Mury i bramy Xi’anu|Xi’an|CHT CJA|xian-warstwy|mury|Prostokątny plan; bramy; obrona; perspektywa miasta
xian-wieze|Wieże Bębna i Dzwonu|Xi’an|CHT CJA|xian-warstwy|bramy|Pomiar i ogłaszanie czasu; położenie w mieście
dzielnica-muzulmanska|Dzielnica Muzułmańska Xi’anu|Xi’an|CHT CJA|xian-warstwy|dzielnica muzu|Hui; kupcy; ulice; jedzenie i rytm życia
wielki-meczet|Wielki Meczet w Xi’anie|Xi’an|CHT CJA|xian-warstwy|wielki meczet|Dziedzińce; chińska architektura; islam; kierunek modlitwy
pagoda-dzikiej-gesi|Wielka Pagoda Dzikiej Gęsi|Xi’an|CHT CJA|xian-warstwy|pagoda|Xuanzang; tłumaczenia; buddyzm; świątynia
xuanzang|Xuanzang i Wędrówka na Zachód|Xi’an|CHT CJA|xian-warstwy|xuanzang|Podróż do Indii; pisma; postać historyczna i literatura
jedwabny-szlak|Dawny Jedwabny Szlak|Chiny|CHT CJA CTF|xian-warstwy|jedwabny szlak|Sieć szlaków; Zhang Qian; towary; religie i idee
zhang-qian|Zhang Qian — wyprawy na zachód|Xi’an|CHT CJA|xian-warstwy|zhang qian|Dyplomacja Han; kontakty; powstawanie sieci wymiany
opera-tang|Przedstawienie dynastii Tang|Xi’an|CHT CJA|xian-warstwy|tang|Kontekst epoki; instrumenty; taniec; współczesna inscenizacja
kuchnia-xian|Kuchnia Xi’anu|Xi’an|CHT CJA|xian-warstwy|jedzenie|Roujiamo; paomo; kumin; pierogi; napój śliwkowy
biangbiang|Biangbiang i niezwykły znak|Xi’an|CHT CJA|xian-warstwy|biang|Makaron; zapis; tradycja i legendy
beilin|Las Stel i kamienne pismo|Xi’an|CHT CJA|xian-warstwy|las stel|Stele; kaligrafia; trwałość i obieg tekstów
luoyang|Luoyang — dawna stolica i peonie|Luoyang / Shaolin|CHT|||Historia stolicy; rzeka Luo; buddyzm; peonie
longmen|Groty Longmen|Luoyang / Shaolin|CHT|||Rzeka Yi; dynastie; wielkie posągi; fundatorzy i zniszczenia
wu-zetian|Wu Zetian|Luoyang / Shaolin|CHT CJA CTF|||Droga do władzy; Luoyang; patronat buddyjski; źródła i legendy
shaolin|Klasztor Shaolin|Luoyang / Shaolin|CHT|shaolin||Historia; zabudowa; religia; sztuki walki; współczesność
bodhidharma|Bodhidharma, Huike i buddyzm chan|Luoyang / Shaolin|CHT|shaolin|bodhidharma|Medytacja; tradycje o dziewięciu latach; odcięta ręka; granice legendy
kung-fu|Kung fu, Bruce Lee i obraz Shaolin|Luoyang / Shaolin|CHT|shaolin|kung|Historia treningu; kino; różne szkoły i style
las-pagod|Las Pagód Shaolin|Luoyang / Shaolin|CHT|shaolin|las pag|Grobowce mnichów; formy pagód; inskrypcje; chronologia
shaolin-detale|Detale w Shaolin|Luoyang / Shaolin|CHT|||Stele i bixi; drzewa ze śladami; strażnicy; postacie przy bramach
suzhou|Suzhou — historia i kanały|Suzhou / Tongli|CHT CJA|||Miasto kupców; kanały; jedwab; współczesny przemysł
tongli|Tongli — miasteczko wodne|Suzhou / Tongli|CHT CJA|||Układ kanałów; mosty; domy; transport i życie mieszkańców
ogrod-mistrza-sieci|Ogród Mistrza Sieci|Suzhou / Tongli|CHT CJA|||Historia właścicieli; staw; pawilony; trasa i kadry
ogrody-chinskie|Jak czytać chiński ogród|Chiny|CHT CJA CTF|palac-letni|kamienie|Odkrywanie widoków; skały i woda; pożyczony krajobraz; perspektywa
moon-gates|Bramy księżycowe, okna i pawilony|Chiny|CHT CJA CTF|||Kadrowanie; funkcje pomieszczeń; ruch po ogrodzie
penjing|Penjing i bonsai|Chiny|CHT CJA CTF|||Miniaturowy krajobraz; tradycja chińska; rozwój w Japonii
wielki-kanal|Wielki Kanał|Chiny|CHT CJA CTF|||Transport zboża; cesarskie stolice; handel; śluzy i współczesność
jedwab|Jedwab — od kokonów do tkaniny|Chiny|CHT CJA CTF|||Jedwabnik; hodowla; nić; tkanie; historia handlu i pamiątki
szanghaj|Szanghaj — powstanie i rozwój|Szanghaj|CHT CJA CTF|szanghaj||Port; koncesje; handel; reformy; Pudong
bund|Bund i jego budynki|Szanghaj|CHT CJA CTF|szanghaj||Banki; firmy żeglugowe; style; spacer po nabrzeżu
bund-most-pomnik|Most Waibaidu i pomnik nad Bundem|Szanghaj|CHT CJA CTF|||Most stalowy; Suzhou Creek; pomnik i park Huangpu
pudong|Pudong i Lujiazui|Szanghaj|CHT CJA CTF|szanghaj||Przemiana dzielnicy; panorama; finanse; rozwój od lat dziewięćdziesiątych
shanghai-tower|Shanghai Tower|Szanghaj|CHT CJA CTF|shanghai-tower||Konstrukcja; fasada; tarasy; porównania i status rekordów
perla-orientu|Perła Orientu|Szanghaj|CHT CJA CTF|||Symbolika formy; funkcja wieży; historia budowy
swfc|Shanghai World Financial Center|Szanghaj|CHT CJA CTF|||Otwieracz; projekt; wieżowiec a taras; porównanie trzech ikon
nanjing-road|Nanjing Road i handel|Szanghaj|CHT CJA CTF|szanghaj||Domy towarowe; konsumpcja; piesza ulica; współczesne zakupy
jadeitowy-budda|Świątynia Jadeitowego Buddy|Szanghaj|CHT CJA CTF|||Huigen; posągi; odbudowy; rewolucja kulturalna; współczesne święta
chenghuang|Świątynia Bóstwa Miasta i Yuyuan|Szanghaj|CHT CJA CTF|||Chenghuang; religia ludowa; bazar; ogród jako osobny obiekt
szanghaj-gangsterzy|Gangsterzy i Paryż Wschodu|Szanghaj|CHT CJA CTF|wojny-opiumowe|szanghaj|Zielony Gang; hazard; koncesje; życie portowego miasta
kpch-szanghaj|Początki KPCh w Szanghaju|Szanghaj|CHT CJA CTF|||Pierwszy kongres; Mao; Komintern; robotnicy i miasto
szanghaj-port|Port Szanghaju i handel morski|Szanghaj|CHT CJA CTF|||Yangshan; ujście Jangcy; kontenery; zaplecze przemysłowe
szanghaj-lotniska|Pudong i Hongqiao — lotniska|Szanghaj|CHT CJA CTF|||PVG a SHA; terminale; rozwój; porównanie z Polską
maglev-metro|Maglev i metro Szanghaju|Szanghaj|CHT CJA CTF|szybka-kolej||Różne technologie; znaczenie sieci; aktualne prędkości i zasady
era-show|ERA Show i akrobatyka|Szanghaj|CHT CJA CTF|||Tradycje akrobatyczne; język widowiska; praktyczne wprowadzenie
szanghaj-zoo|Zoo w Szanghaju i porównania|Szanghaj|CHT CJA|||Położenie; rola ogrodu; pandy; porównanie ze Śląskim Zoo
chengdu|Chengdu i Kotlina Syczuańska|Chengdu|CJA CTF|chengdu||Geografia; Kraina Obfitości; tempo życia; herbaciarnie
pandy|Pandy — biologia i ochrona|Chengdu|CJA CTF|chengdu|panda|Bambus; rozród; ochrona siedlisk; ośrodki hodowli
panda-base|Panda Base — prowadzenie grupy|Chengdu|CJA CTF|chengdu|panda|Układ wizyty; pora obserwacji; badania; zasady parku
wenshu|Klasztor Wenshu|Chengdu|CJA CTF|chengdu|wenshu|Bodhisattwa mądrości; życie religijne; herbata; zabudowa
wuhou|Wuhou, Zhuge Liang i Trzy Królestwa|Chengdu|CJA CTF|chengdu|wuhou|Pamięć o bohaterach; świątynia; powieść a historia
jinli|Jinli i Kuanzhai Xiangzi|Chengdu|CJA CTF|chengdu|jinli|Rekonstrukcja historycznych ulic; jedzenie; kultura wypoczynku
opera-syczuanska|Opera syczuańska i zmiana masek|Chengdu|CJA CTF|chengdu|opera|Bian lian; role; teatr cieni; herbaciarnia
kuchnia-syczuan|Syczuan, mala i hot pot|Chengdu / Chongqing|CJA CTF|chengdu|kuchnia|Chili; pieprz syczuański; drętwienie; wspólny stół
leshan|Wielki Budda w Leshan|Syczuan|CJA|||Wariant B programu; historia posągu; rzeki; sposoby oglądania
chongqing|Chongqing — miasto w pionie|Chongqing|CJA CTF|chongqing||Geografia; mosty; różne poziomy; granice administracyjne
chongqing-wojenna-stolica|Chongqing jako wojenna stolica|Chongqing|CJA CTF|rejs-jangcy|chongqing|Wojna z Japonią; bombardowania; schrony; pamięć miasta
liziba|Liziba — kolejka w budynku|Chongqing|CJA CTF|chongqing|liziba|Transport szynowy; topografia; stacja i dom
ciqikou|Ciqikou|Chongqing|CJA CTF|rejs-jangcy|ciqikou|Portowa przeszłość; handel; herbaciarnie; spacer
hongyadong|Hongyadong|Chongqing|CJA CTF|||Zabudowa na zboczu; współczesny kompleks; nocna panorama
raffles-city|Raffles City i Chaotianmen|Chongqing|CJA CTF|||Architektura; przystań; połączenie rzek; dawne bramy
nanbin-road|Nanbin Road i rzeki Chongqingu|Chongqing|CJA CTF|chongqing|nanbin|Jangcy i Jialing; panoramy; przeciwległe brzegi
jangcy|Jangcy — geografia i cywilizacja|Jangcy|CJA CTF|geografia-chin|huang he|Bieg rzeki; dorzecze; rolnictwo; przemysł i żegluga
rejs-jangcy|Rejs po Jangcy — odprawy i życie na statku|Jangcy|CJA|rejs-jangcy||Zaokrętowanie; bagaże; program dnia; fakultety; wyokrętowanie
trzy-przelomy|Trzy Przełomy Jangcy|Jangcy|CJA|rejs-jangcy|przełom|Qutang; Wu; Xiling; krajobraz; poziom wody
zapora|Zapora Trzech Przełomów|Jangcy|CJA|rejs-jangcy|zapora|Energia; ochrona przeciwpowodziowa; żegluga; przesiedlenia; środowisko
biale-miasto|Miasto Białego Cesarza|Jangcy|CJA|rejs-jangcy|białego|Baidicheng; Trzy Królestwa; poezja i lokalne opowieści
strumien-bogini|Strumień Bogini i boczne doliny|Jangcy|CJA|rejs-jangcy|bogini|Wariant fakultetu; krajobraz; lokalni mieszkańcy; legendy
szczyt-przelomow|Szczyt Trzech Przełomów|Jangcy|CJA|rejs-jangcy|szczyt|Punkt widokowy; krajobraz; odróżnienie wycieczek
yichang|Yichang i zakończenie rejsu|Jangcy|CJA|rejs-jangcy|wyokrętowanie|Położenie; zapora; transfer; różne porty
wuhan|Wuhan — trzy miasta i dwie rzeki|Wuhan|CJA|||Wuchang; Hankou; Hanyang; Han i Jangcy; transport i przemysł
huangshan|Huangshan — Żółte Góry|Huangshan / Anhui|CTF|huangshan||Geologia; sosny; morze chmur; malarstwo shanshui
hongcun-tunxi|Hongcun, Tunxi i Huizhou|Huangshan / Anhui|CTF|hongcun-tunxi||Kupcy; rody; architektura; woda; rzemiosło
hongcun-woda|Hongcun — wół, kanały i stawy|Huangshan / Anhui|CTF|hongcun-tunxi|wół|Nanhu; Yuezhao; układ osady; symbolika a funkcja
architektura-huizhou|Domy i rody Huizhou|Huangshan / Anhui|CTF|hongcun-tunxi|architektura|Białe ściany; dachy; dziedzińce; dom kupca i świątynia przodków
tunxi|Tunxi Old Street|Huangshan / Anhui|CTF|hongcun-tunxi|tunxi old|Handel; warsztaty; lokalne towary; dawna i współczesna ulica
cztery-skarby|Cztery Skarby Gabinetu|Chiny|CHT CJA CTF|hongcun-tunxi|cztery skarby|Pędzel; tusz; papier; kamień do tuszu
changsha|Changsha i Hunan|Changsha / Hunan|CTF|changsha||Historia; rzeka Xiang; tożsamość regionu; nowoczesność
mlody-mao|Młody Mao i Wyspa Pomarańczowa|Changsha / Hunan|CTF|changsha|młody mao|Młodość; szkoła; polityka; pomnik i jego znaczenie
kuchnia-hunan|Kuchnia Hunan|Changsha / Hunan|CTF|changsha|kuchnia|Chili; świeżość; dymienie; porównanie z Syczuanem
zhangjiajie|Zhangjiajie i Wulingyuan|Zhangjiajie|CTF|zhangjiajie||Geologia; krajobraz; kultura; rozróżnienie obszarów
avatar|Avatar — inspiracja i marketing|Zhangjiajie|CTF|zhangjiajie|avatar|Krajobraz; inspiracja wizualna; nazwy i turystyka
yuanjiajie|Yuanjiajie i naturalne mosty|Zhangjiajie|CTF|zhangjiajie|yuanjiajie|Platformy widokowe; filary; most pod niebem
bailong|Winda Bailong|Zhangjiajie|CTF|zhangjiajie|bailong|Inżynieria; skala; rekord we właściwej kategorii
tianzi|Tianzi Mountain|Zhangjiajie|CTF|zhangjiajie|tianzi|Nazwa; lokalna legenda; Helong; punkty widokowe
golden-whip|Golden Whip Stream i doliny|Zhangjiajie|CTF|zhangjiajie|jinbian|Perspektywa z dołu; flora; makaki; spacer
tianmen|Tianmen — Brama Niebios|Zhangjiajie|CTF|zhangjiajie|tianmen shan|Osobna góra; jaskinia; kolejka; górskie chodniki
droga-99|Droga 99 zakrętów i symbolika dziewiątki|Zhangjiajie|CTF|zhangjiajie|99|Infrastruktura; schody; symbolika; wariant biletu
szklany-most|Szklany Most Wielkiego Kanionu|Zhangjiajie|CTF|zhangjiajie|grand canyon|Osobny obiekt; konstrukcja; historia rekordów; zasady wejścia
tujia-miao|Tujia, Miao i Bai|Zhangjiajie / Hunan|CTF|zhangjiajie|tujia|Ludzie regionu; tradycje; stroje; przedstawienia
chiny-wprowadzenie|Jak patrzeć na Chiny|Chiny|CHT CJA CTF|chiny-wprowadzenie||Skala; ciągłość; regionalne różnice; unikanie uogólnień
geografia-chin|Geografia Chin|Chiny|CHT CJA CTF|geografia-chin||Wschód i zachód; północ i południe; góry; rzeki i klimat
huang-he|Huang He i początki cywilizacji|Chiny|CHT CJA CTF|geografia-chin|huang he|Less; powodzie; rolnictwo; porównanie z Jangcy
ryz-pszenica|Ryż, pszenica i chińska wieś|Chiny|CHT CJA CTF|geografia-chin|północ|Różnice regionalne; irygacja; praca i krajobraz
klimat-anomalie|Klimat, powodzie i anomalie pogodowe|Chiny|CHT CJA CTF|||Monsun; pory roku; upały; powodzie; aktualne alerty
starozytne-chiny|Od neolitu do pierwszego cesarstwa|Chiny|CHT CJA CTF|starozytne-chiny||Shang; Zhou; Walczące Państwa; Qin; źródła archeologiczne
dynastie|Dynastie Chin — chronologia|Chiny|CHT CJA CTF|starozytne-chiny||Oś czasu; Han, Tang, Song, Yuan, Ming i Qing; stolice
cesarz-panstwo|Cesarz i Mandat Niebios|Chiny|CHT CJA CTF|cesarz-panstwo||Legitymizacja; rytuał; nieurodzaj; porządek władzy
egzaminy-urzednicze|Egzaminy urzędnicze i uczeni|Chiny|CHT CJA CTF|cesarz-panstwo|urzędnicy|Keju; konfucjańskie teksty; awans; ograniczenia systemu
wynalazki|Chińskie wynalazki i ich wędrówki|Chiny|CHT CJA CTF|||Papier; druk; kompas; proch; kontakty z Japonią i Europą
wojny-opiumowe|Wojny opiumowe|Chiny|CHT CJA CTF|wojny-opiumowe||Herbata; srebro; opium; Kompania; traktaty i skutki
srebro-waluta|Srebro, yuan i renminbi|Chiny|CHT CJA CTF|wojny-opiumowe|srebro|Globalny handel; pieniądz; nazwy waluty; współczesne banknoty
kompania-indyjska|Kompania Wschodnioindyjska|Chiny|CHT CJA CTF|wojny-opiumowe|opium|Korporacja; armia; Indie; handel; odpowiedzialność
hongkong-makau|Hongkong, Makau i nierówne traktaty|Chiny|CHT CJA CTF|wojny-opiumowe|hongkong|Kolonializm; traktaty; powroty; odrębne systemy
puyi|Puyi — ostatni cesarz|Chiny|CHT CJA CTF|zakazane-miasto|puyi|Abdykacja; życie w pałacu; Mandżukuo; losy powojenne
republika|Republika i rozpad cesarstwa|Chiny|CHT CJA CTF|wojny-opiumowe|upadek|Sun Jat-sen; 1911; militaryści; nowa polityka
wojna-z-japonia|Wojna z Japonią|Chiny|CHT CJA CTF|||Mandżuria; opór; okupacja; Chongqing; pamięć historyczna
wojna-domowa-tajwan|Wojna domowa i Tajwan|Chiny|CHT CJA CTF|||Kuomintang; KPCh; rok 1949; współczesne pojęcia i stanowiska
mao-reformy|Mao, Wielki Skok i rewolucja kulturalna|Chiny|CHT CJA CTF|||Reformy ziemskie; kolektywizacja; głód; represje; dziedzictwo
deng-reformy|Deng Xiaoping i reformy gospodarcze|Chiny|CHT CJA CTF|||Otwarcie; strefy ekonomiczne; wieś; przemysł; zmiana życia
kpch|Jak działa KPCh i państwo|Chiny|CHT CJA CTF|||Partia; administracja; szczeble władzy; aktualne instytucje
plany-piecioletnie|Plany pięcioletnie|Chiny|CHT CJA CTF|plany-piecioletnie||Mechanizm planowania; cele; realizacja; rozróżnienie epok
plan-15|Piętnasty plan: 2026–2030|Chiny|CHT CJA CTF|||Aktualny dokument; priorytety; różnice względem planu 2021–2025
nowy-jedwabny-szlak|Nowy Jedwabny Szlak i Polska|Chiny|CHT CJA CTF|||Transport; kredyty; porty; kolej; polskie plany i rzeczywiste projekty
urbanizacja|Urbanizacja i nowe miasta|Chiny|CHT CJA CTF|urbanizacja||Migracja; infrastruktura; nowe dzielnice; mieszkania
evergrande|Nieruchomości i Evergrande|Chiny|CHT CJA CTF|urbanizacja||Model finansowania; mieszkania jako inwestycja; zadłużenie; aktualny stan
hukou|Hukou i migracje wewnętrzne|Chiny|CHT CJA CTF|hukou||Meldunek; szkoła; świadczenia; migranci; reformy lokalne
jedno-dziecko|Polityka jednego dziecka i demografia|Chiny|CHT CJA CTF|||Historia polityki; wyjątki; skutki; starzenie; kolejne zmiany
rodzina-malzenstwo|Rodzina, małżeństwa i dziadkowie|Chiny|CHT CJA CTF|cesarz-panstwo|rodzina|Relacje; opieka; oczekiwania; różnice pokoleniowe
gaokao|Szkolnictwo i gaokao|Chiny|CHT CJA CTF|gaokao||Szkoła; egzamin; presja; region i szanse
praca-996|Praca, zarobki i 996|Chiny|CHT CJA CTF|||Branże; rozkład czasu; praktyka i prawo; aktualne dane
emerytury|Emerytury w Chinach|Chiny|CHT CJA CTF|||Różne systemy; wiek emerytalny; finansowanie; wieś i miasto
sluzba-zdrowia|Opieka zdrowotna w Chinach|Chiny|CHT CJA CTF|sluzba-zdrowia||Ubezpieczenia; szpitale; koszty; dostęp regionalny
medycyna-chinska|Medycyna chińska i qi|Chiny|CHT CJA CTF|||Tradycja; pojęcia; praktyki; odróżnienie kultury od dowodów medycznych
buddyzm|Buddyzm w Chinach|Chiny|CHT CJA CTF|xian-warstwy|buddyzm|Indie; przenikanie religii; karma; samsara; szkoły
mudry-bodhisattwowie|Budda, bodhisattwowie i mudry|Chiny|CHT CJA CTF|||Pozy; gesty; Guanyin; Wenshu; atrybuty i identyfikacja figur
taoizm|Taoizm i religia ludowa|Chiny|CHT CJA CTF|||Dao; świątynie; bóstwa; praktyki; połączenia tradycji
konfucjanizm|Konfucjanizm i społeczeństwo relacji|Chiny|CHT CJA CTF|cesarz-panstwo|konfucjusz|Rodzina; rytuał; edukacja; hierarchia; współczesne odczytania
islam-hui|Islam, Hui i Ujgurzy|Chiny|CHT CJA CTF|xian-warstwy|islam|Różne społeczności; handel; praktyki; unikanie utożsamiania grup
przodkowie-pogrzeby|Kult przodków, pogrzeby i cmentarze|Chiny|CHT CJA CTF|||Pamięć rodzinna; obrzędy; kremacja; regionalne zwyczaje
papierowe-dary|Papierowe dary i srebrne łódeczki|Chiny|CHT CJA CTF|||Yuanbao; symbolika; obrzędy; święta i lokalne zasady
swieta|Chiński kalendarz i święta|Chiny|CHT CJA CTF|||Nowy Rok; Qingming; Święto Środka Jesieni; Święto Duchów; daty ruchome
jezyk-pinyin|Język, pinyin i chińskie nazwy|Chiny|CHT CJA CTF|||Znaki a wymowa; tony; języki regionalne; praktyczna fonetyka
kaligrafia|Kaligrafia i kultura pisma|Chiny|CHT CJA CTF|xian-warstwy|kaligrafia|Pędzel; ruch; znaki; szkoły; rola pisma w administracji
liczby-gesty|Liczby, przesądy i gesty 1–10|Chiny|CHT CJA CTF|||Cztery; osiem; dziewięć; piętra; gesty regionalne
chinski-smok|Smok, feniks i cesarskie symbole|Chiny|CHT CJA CTF|chinski-smok||Znaczenie; formy; cesarz; różnice względem europejskiego smoka
lwy-bixi|Lwy, bixi i strażnicy bram|Chiny|CHT CJA CTF|swieta-droga|bixi|Atrybuty; para lwów; stela; tradycja synów smoka
paifang|Paifang i pailou|Chiny|CHT CJA CTF|hongcun-tunxi|paifang|Brama honorowa; ród; zasługi; napisy
chinska-herbata|Herbata — rodzaje i parzenie|Chiny|CHT CJA CTF|chinska-herbata||Sześć rodzin; obróbka; naczynia; codzienność i degustacja
herbata-klipry|Herbata, klipry i torebki|Chiny|CHT CJA CTF|wojny-opiumowe|brytyjski|Handel; tempo żeglugi; przechowywanie; pochodzenie torebek
kuchnie-regionalne|Kuchnie Chin i zachowanie przy stole|Chiny|CHT CJA CTF|||Regiony; pałeczki; wspólne dania; smaki; alergie
jadeit-nefryt|Jadeit, nefryt, perły i bransoletki|Chiny|CHT CJA CTF|||Materiały; symbolika; obróbka; rozpoznanie granic własnej oceny
porcelana|Porcelana i rzemiosło|Chiny|CHT CJA CTF|||Technologia; piece; eksport; style i wzory
praktyczne-alipay|Alipay, WeChat i płatności|Chiny|CHT CJA CTF|praktyczne-alipay||Konfiguracja; test płatności; gotówka; problemy i rozwiązania
samochody-elektryczne|Elektryki, BYD i baterie|Chiny|CHT CJA CTF|samochody-elektryczne||Rozwój przemysłu; baterie; autobusy; eksport
szybka-kolej|Szybka kolej i chińskie dworce|Chiny|CHT CJA CTF|szybka-kolej||Budowa sieci; klasy pociągów; bilety; kontrola; polskie porównania
social-credit|Social credit i monitoring|Chiny|CHT CJA CTF|social-credit||Rejestry; czarne listy; lokalne rozwiązania; popularne mity
aplikacje-dostawy|Aplikacje, DiDi, zakupy i dostawy|Chiny|CHT CJA CTF|praktyczne-alipay||Superaplikacje; platformy; kurierzy; codzienne usługi
codzienne-zwyczaje|Codzienne zwyczaje i życie ulicy|Chiny|CHT CJA CTF|||Ćwiczenia w parkach; ciocia i wujek; przykuc; gorąca woda; Beijing belly
miasta-porownania|Jak porównywać chińskie miasta|Chiny|CHT CJA CTF|urbanizacja||Granice administracyjne; obszar zabudowany; rankingi; rok danych
chiny-polska|Chiny a Polska i Europa|Chiny|CHT CJA CTF|||Lotniska; kolej; budynki; skala; porównywalne definicje
powitanie-grupy|Powitanie grupy i odprawa|Chiny|CHT CJA CTF|powitanie-grupy||Kontakt; plan; paszporty; płatności; toalety; zbiórki
paszporty-wjazd|Paszporty i zasady wjazdu|Chiny|CHT CJA CTF|powitanie-grupy|paszporty|Dokumenty; aktualne zasady zależne od obywatelstwa; utrata paszportu
sim-esim|SIM, eSIM i internet|Chiny|CHT CJA CTF|powitanie-grupy|telefon|Pakiety; lokalny numer; roaming; plan kontaktu
toalety|Toalety i komunikaty praktyczne|Chiny|CHT CJA CTF|powitanie-grupy|toalety|Kabiny; papier; oznaczenia; przygotowanie do transferu
bezpieczenstwo|Bezpieczeństwo grupy|Chiny|CHT CJA CTF|powitanie-grupy|bezpieczeństwo|Skutery; tłum; oszustwa; kontakt; sytuacje awaryjne
zbiorki|Zbiórki i kontakt z grupą|Chiny|CHT CJA CTF|powitanie-grupy|zbiórek|Dokładne miejsce; gotowość i odjazd; pinezka; opóźnienia
bagaz-pociagi|Bagaż, pociągi i loty krajowe|Chiny|CHT CJA CTF|||Limity przewoźnika; kontrola; powerbanki; dokument i terminal
zakupy-praktyka|Zakupy i pamiątki|Chiny|CHT CJA CTF|||Jakość; targowanie; rozmiary; ostrożne oceny autentyczności
pozegnanie-grupy|Pożegnanie i podsumowanie Chin|Chiny|CHT CJA CTF|chiny-wprowadzenie|klucz|Połączenie wątków; codzienność; zmiana perspektywy; pytania grupy
`.trim().split('\n');
  window.WANFANG_CATALOG=rows.map(line=>{
    const [id,title,region,codes,topicId,hint,scope]=line.split('|');
    const topic=all.find(t=>t.id===topicId);
    const section=hint&&topic?.sections?.find(s=>fold(s.title).includes(fold(hint)));
    return {id,title,region,programs:codes.split(' '),topicId:topicId||null,sectionId:section?.id||null,outline:scope.split(';').map(x=>x.trim()),aliases:[id.replace(/-/g,' '),scope],origin:'Zakres kompendium i wcześniejsze materiały przewodnickie',review:'Do przeglądu'};
  });
})();
