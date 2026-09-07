(() => {
  const d=(number,title,places,talks,checks=[])=>({number,title,places:places.split(' ').filter(Boolean),talks:talks.split(' ').filter(Boolean),checks});
  const clone=days=>JSON.parse(JSON.stringify(days));
  const arrival=d(2,'Przylot do Pekinu','pekin tiananmen','powitanie-grupy chiny-wprowadzenie',['Pora przylotu i terminal','Zakres zwiedzania po przylocie','Pierwszy posiłek i hotel']);
  const mur=d(3,'Pałac Letni, Święta Droga i Wielki Mur','palac-letni swieta-droga wielki-mur','cesarz-panstwo cixi',['Odcinek muru i kolejność wejść','Bilety i kondycja grupy','Możliwość obejrzenia obiektów olimpijskich']);
  const xian=d(5,'Xi’an — miasto, religie i Tang','xian-mury pagoda-dzikiej-gesi dzielnica-muzulmanska opera-tang','xian-warstwy jedwabny-szlak',['Zakres wejść','Posiłki i przedstawienie','Miejsca zbiórek']);
  const cht=[
    d(1,'Wylot do Chin', '', 'chiny-wprowadzenie powitanie-grupy',['Lot, terminal i spotkanie']),arrival,mur,
    d(4,'Świątynia Nieba i przejazd do Xi’anu','swiatynia-nieba zakazane-miasto','pekin szybka-kolej',['Zakazane Miasto zależnie od przylotu i rezerwacji','Dworzec, pociąg, dokumenty']),
    {...xian,places:[...xian.places,'wielki-meczet']},
    d(6,'Armia Terakotowa i Luoyang','armia-terakotowa luoyang','qin-shi-huang starozytne-chiny',['Bilety i kolejność pawilonów','Przejazd i posiłki']),
    d(7,'Longmen i Shaolin','longmen shaolin las-pagod','buddyzm wu-zetian kung-fu',['Wejścia, pokaz i tempo dnia','Dojazdy i zbiórki']),
    d(8,'Przejazd do Suzhou i Tongli','suzhou tongli','szybka-kolej wielki-kanal',['Dworce i godzina odjazdu','Rejs po kanałach']),
    d(9,'Ogród Mistrza Sieci i Szanghaj','ogrod-mistrza-sieci szanghaj','ogrody-chinskie penjing',['Przejazd do Szanghaju','Wieczorny fakultet']),
    d(10,'Bund, jedwab i nowoczesny Szanghaj','bund jedwab nanjing-road pudong','wojny-opiumowe shanghai-tower',['Fakultety: Maglev, taras i ERA','Czas wolny i zbiórki']),
    d(11,'Świątynia Jadeitowego Buddy i wylot','jadeitowy-budda szanghaj','przodkowie-pogrzeby pozegnanie-grupy',['Centrum Planowania Miasta','Lotnisko, przesiadka i bagaż']),
    d(12,'Powrót do Polski','','pozegnanie-grupy',['Lot powrotny'])
  ];
  const chtExtra=clone(cht);chtExtra[10].title='Świątynia Jadeitowego Buddy i dodatkowy nocleg';chtExtra[10].checks=['Program dodatkowego dnia','Nocleg w Szanghaju lub Suzhou'];
  chtExtra[11]=d(12,'Szanghaj i wylot','szanghaj','pozegnanie-grupy',['Zakres czasu wolnego','Transfer i lot']);chtExtra.push(d(13,'Powrót do Polski','','pozegnanie-grupy'));
  const cja=[
    d(1,'Wylot do Chin','','chiny-wprowadzenie powitanie-grupy',['Lot i punkt spotkania']),clone([arrival])[0],clone([mur])[0],
    d(4,'Pekin i przejazd do Xi’anu','swiatynia-nieba zakazane-miasto','szybka-kolej pekin',['Zakazane Miasto zależnie od przylotu i rezerwacji','Pociąg i dworce']),clone([xian])[0],
    d(6,'Armia Terakotowa i Chengdu','armia-terakotowa chengdu','qin-shi-huang geografia-chin',['Pawilony, przejazd i hotel']),
    d(7,'Pandy i Chengdu','pandy panda-base jinli','chengdu kuchnia-syczuan opera-syczuanska',['Ośrodek pand i pora wizyty','Przedstawienie wieczorne']),
    d(8,'Chongqing i zaokrętowanie','chongqing rejs-jangcy','jangcy chongqing-wojenna-stolica',['Aktualna przystań i statek','Posiłki, bagaże i odprawa']),
    d(9,'Pierwszy pełny dzień rejsu','rejs-jangcy','jangcy ryz-pszenica',['Program statku i dostępne wycieczki']),
    d(10,'Trzy Przełomy i boczne doliny','trzy-przelomy','jangcy zapora',['Boczna dolina: Daning, Strumień Bogini lub inny wariant','Poziom wody i godziny']),
    d(11,'Zapora, Yichang i Wuhan','zapora yichang wuhan','ryz-pszenica urbanizacja',['Kolejność wyokrętowania i zapory','Transfer do Wuhan']),
    d(12,'Suzhou, Tongli i Szanghaj','suzhou tongli bund','wielki-kanal szybka-kolej',['Dworce i rejs','Nocleg i wieczorny fakultet']),
    d(13,'Świątynie, jedwab i Nanjing Road','jadeitowy-budda chenghuang jedwab nanjing-road','buddyzm jadeit-nefryt',['Zakres wejść','ERA i inne fakultety']),
    d(14,'Pudong i wylot','pudong shanghai-tower swfc','szanghaj pozegnanie-grupy',['Taras widokowy','Lotnisko, terminal i transfer']),
    d(15,'Powrót do Polski','','pozegnanie-grupy')
  ];
  const cjaB=clone(cja);
  cjaB[3]=d(4,'Pekin — świątynia i pałac','swiatynia-nieba zakazane-miasto','cesarz-panstwo',['Rezerwacje i zakres wejść']);
  cjaB[4]=d(5,'Pociąg do Xi’anu i dzielnica muzułmańska','dzielnica-muzulmanska','xian-warstwy szybka-kolej');
  cjaB[5]=d(6,'Armia Terakotowa i przedstawienie Tang','armia-terakotowa opera-tang','qin-shi-huang');
  cjaB[6]=d(7,'Mury, pagoda i Chengdu','xian-mury pagoda-dzikiej-gesi','jedwabny-szlak',['Sposób i pora przejazdu do Chengdu']);
  cjaB[7]=d(8,'Pandy i Leshan','pandy leshan','chengdu buddyzm',['Bilety i wariant oglądania Buddy']);
  cjaB[8]={...clone([cja[7]])[0],number:9};cjaB[9]={...clone([cja[8]])[0],number:10};cjaB[10]={...clone([cja[9]])[0],number:11};
  cjaB[11]=d(12,'Zapora i przejazd do Suzhou','zapora yichang','szybka-kolej',['Dworzec po rejsie','Przejazd bez etapu Wuhan']);
  cjaB[12]=d(13,'Tongli i Szanghaj','tongli bund jadeitowy-budda chenghuang nanjing-road jedwab','szanghaj',['Napięty dzień: realna kolejność i fakultety']);
  const ctf=[
    d(1,'Warszawa — przesiadka w Pekinie','','chiny-wprowadzenie powitanie-grupy',['Aktualna trasa lotu']),
    d(2,'Przylot do Szanghaju i Pudong','pudong perla-orientu','powitanie-grupy szanghaj',['Przylot SHA czy PVG','Rzeczywista pora i zakres spaceru']),
    d(3,'Szanghaj — świątynie, Bund i Nanjing Road','chenghuang jadeitowy-budda bund nanjing-road','wojny-opiumowe szanghaj',['Zakres wejść i kolejność']),
    d(4,'Huangshan, Hongcun i Tunxi','hongcun-tunxi hongcun-woda tunxi','szybka-kolej architektura-huizhou',['Dworce, pociąg i przejazdy']),
    d(5,'Huangshan — Żółte Góry','huangshan','geografia-chin ogrody-chinskie',['Pogoda, szlaki i kolejki','Tempo grupy i posiłki']),
    d(6,'Changsha i przejazd do Zhangjiajie','changsha mlody-mao','mao-reformy zhangjiajie',['Pociąg i program miasta','Pomnik zależnie od realnego wariantu']),
    d(7,'Tianmen — Brama Niebios','tianmen droga-99','liczby-gesty',['Wariant biletu i kolejki','Chodniki na Tianmen, a nie most nad kanionem']),
    d(8,'Wulingyuan — krajobraz Avatara','golden-whip bailong yuanjiajie tianzi','zhangjiajie avatar tujia-miao',['Kolejność wejść i transport parkowy','Pogoda i lunch']),
    d(9,'Szklany Most i Chongqing','szklany-most nanbin-road','chongqing',['Bilety i dojazdy','Pociąg, bagaże i kolacja']),
    d(10,'Liziba, Ciqikou i Chengdu','liziba ciqikou jinli','chongqing chengdu',['Środek transportu między miastami','Kuanzhai Xiangzi i posiłki']),
    d(11,'Chengdu — pandy i świątynie','pandy wenshu wuhou jinli','chengdu kuchnia-syczuan opera-syczuanska',['Pora wizyty u pand','Zakres Wuhou i fakultet']),
    d(12,'Przelot do Pekinu i hutongi','hutongi','pekin chinska-herbata',['Lotniska i terminale','Przyjazd i program po locie']),
    d(13,'Pekin — centrum cesarskiej stolicy','swiatynia-nieba tiananmen zakazane-miasto palac-letni','cesarz-panstwo cixi',['Napięty dzień: sloty, kolejność i realne wejścia']),
    d(14,'Pekin olimpijski, Wielki Mur i Ming','pekin-olimpijski wielki-mur swieta-droga','dynastie',['Odcinek muru','Transfer na nocny lot i ewentualny pokój dzienny']),
    d(15,'Powrót do Polski','','pozegnanie-grupy',['Lot i data powrotu'])
  ];
  const ctfWeb=clone(ctf);ctfWeb[0].title='Wylot do Szanghaju';ctfWeb[1].title='Przylot do Szanghaju';ctfWeb[1].places=['szanghaj'];
  ctfWeb[2].places.push('jedwab','pudong');
  ctfWeb[12]=d(13,'Wielki Mur i Święta Droga','wielki-mur swieta-droga','cesarz-panstwo',['Odcinek muru i posiłki']);
  ctfWeb[13]=d(14,'Pekin — centrum i wylot','tiananmen zakazane-miasto swiatynia-nieba palac-letni','cixi pozegnanie-grupy',['Rezerwacje i napięty harmonogram','Transfer na lotnisko']);
  window.WANFANG_PROGRAMS=[
    {code:'CHT',name:'W krainie złotego smoka',theme:'Cesarstwo, religie i miasta',path:'Pekin · Xi’an · Luoyang · Suzhou · Szanghaj',color:'red',defaultVariant:'bazowy',source:'https://r.pl/chiny-w-krainie-zlotego-smoka/zakwaterowanie-cht',sourceDate:'2026-09-06',variants:[{id:'bazowy',name:'Program bazowy · 12 dni',days:cht},{id:'nocleg',name:'Dodatkowy nocleg · 13 dni',days:chtExtra}]},
    {code:'CJA',name:'Chiny w dół Jangcy',theme:'Rzeka, Syczuan i przemiany Chin',path:'Pekin · Xi’an · Chengdu · Chongqing · Jangcy · Szanghaj',color:'blue',defaultVariant:'wuhan',source:'https://r.pl/chiny-w-dol-jangcy/zakwaterowanie-cja',sourceDate:'2026-09-06',note:'Wariant B obejmuje Leshan i omija nocleg w Wuhan. Dodatkowy dzień w wybranych terminach wymaga dopasowania do dokumentów konkretnej grupy.',variants:[{id:'wuhan',name:'Wariant przez Wuhan · 15 dni',days:cja},{id:'leshan',name:'Wersja B z Leshan · 15 dni',days:cjaB}]},
    {code:'CTF',name:'Szlakiem Smoczych Gór',theme:'Góry Avatara, dawne wsie i metropolie',path:'Szanghaj · Huangshan · Changsha · Zhangjiajie · Chengdu · Pekin',color:'green',defaultVariant:'praktyka',source:'https://r.pl/chiny-szlakiem-smoczych-gor/zakwaterowanie-ctf',sourceDate:'2026-09-06',note:'Baza z Twojego CTF0611-CA ma 15 pozycji mimo dawnego nagłówka „16 Day”. Terminy, loty i kolejność są do potwierdzenia. Wariant katalogowy zmienia m.in. końcowe dni Pekinu.',variants:[{id:'praktyka',name:'Twoja baza CTF bez dat · 15 dni',sourceName:'CTF — opracowanie pilota dzień po dniu, 04.09.2026',days:ctf},{id:'katalog',name:'Wariant katalogowy Rainbow · 15 dni',days:ctfWeb}]}
  ];
})();
