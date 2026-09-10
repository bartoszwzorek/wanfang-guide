"""Build reviewed CTF topic data from the supplied DOCX text export.
Usage: python scripts/build_ctf_revision.py source.json baseline.json
Source documents remain the user's originals; this script records the editorial merge.
"""
import json,re,html,sys,math,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
raw=json.load(open(sys.argv[1])); baseline=json.load(open(sys.argv[2])); old={t['id']:t for t in baseline['topics']}
def esc(s):return html.escape(s,quote=True)
def plain(s):return html.unescape(re.sub('<[^>]+>',' ',s))
def note(kind,label,text):return '<blockquote class="note-'+kind+'"><strong>'+esc(label)+'</strong><p>'+esc(text)+'</p></blockquote>'
def ps(text):return ''.join('<p>'+esc(p.strip())+'</p>' for p in text.split('\n') if p.strip())
def section(title,text,sid):return {'id':sid,'title':title,'content':ps(text)}
# Index in the complete 32-document export; two Huangshan accounts are merged below.
rows=[
(0,'pogrzeby','Pogrzeby i pamięć o zmarłych','Chiny',''),
(1,'miasta-duchow','Miasta duchów i niedokończone osiedla','Chiny','Lànwěilóu [lan-łej-lou]'),
(2,'konfucjanizm','Konfucjanizm — rodzina, rytuał i edukacja','Chiny','Kǒngzǐ [kung-dzy]'),
(3,'rodzina-malzenstwo','Rodzina, społeczeństwo i sytuacja kobiet','Chiny','Guānxì [głan-si] · Miànzi [mien-dzy]'),
(4,'emerytury','Emerytury w Chinach — systemy i różnice','Chiny',''),
(5,'jedno-dziecko','Polityka jednego dziecka i jej następstwa','Chiny',''),
(6,'mao-zedong','Mao Zedong — droga do władzy i rządy','Chiny','Máo Zédōng [Mao Dze-dung]'),
(7,'sluby','Śluby, swatanie i targi małżeńskie','Chiny','Xiāngqīn [siang-cin] · Cǎilǐ [caj-li]'),
(8,'feng-shui','Feng shui — krajobraz, dom i tradycja','Chiny','Fēngshuǐ [feng-szłej]'),
(9,'huangshan','Huangshan — Żółte Góry','Anhui','Huángshān [Hłang-szan]'),
(11,'kuchnia-hui','Kuchnia Hui — smaki Anhui','Anhui','Huīcài [hłej-caj]'),
(12,'kult-przodkow','Kult przodków i rody Huizhou','Anhui','Huīzhōu [hłej-dżou]'),
(13,'hongcun','Hongcun — woda, domy i życie rodu','Anhui','Hóngcūn [hung-cun]'),
(14,'tunxi','Tunxi — stara ulica i rzemiosło Huizhou','Anhui','Túnxī [tun-si]'),
(15,'wenshu','Klasztor Wenshu — spacer i buddyzm','Chengdu','Wénshū Yuàn [łen-szu jüen]'),
(16,'wuhou','Wuhou — Liu Bei, Zhuge Liang i pamięć','Chengdu','Wǔhóu Cí [łu-hou cy] · Zhūgě Liàng [dżu-ge liang]'),
(17,'pandy','Pandy — biologia, ochrona i Panda Base','Chengdu','Chéngdū [czeng-du] · Dàxióngmāo [da-siung-mao]'),
(18,'trzy-krolestwa','Trzy Królestwa — historia i bohaterowie','Chengdu','Sānguó [san-gło]'),
(19,'liu-bei','Liu Bei — założyciel Shu Han','Chengdu','Liú Bèi [liou-bej] · Shǔ Hàn [szu-han]'),
(20,'wyspa-pomaranczowa','Wyspa Pomarańczowa — Juzizhou','Changsha','Júzǐzhōu [dziu-dzy-dżou]'),
(21,'tianmen','Tianmen — góra Bramy Niebios','Zhangjiajie','Tiānmén Shān [tien-men szan]'),
(22,'kuchnia-hunan','Kuchnia Hunan — ostrość i codzienny stół','Hunan','Xiāngcài [siang-caj]'),
(23,'gory-avatara','Góry Avatara i Potok Złotego Bicza','Zhangjiajie','Zhāngjiājiè [dżang-dzia-dzie] · Jīnbiānxī [dzin-bien-si]'),
(24,'changsha','Changsha — miasto nad Xiang','Changsha','Chángshā [czang-sza] · Xiāng Jiāng [siang dziang]'),
(25,'chenghuang','Stare Miasto, Chenghuang Miao i Yuyuan','Szanghaj','Chénghuáng Miào [czeng-hłang miao] · Yùyuán [jü-jüen]'),
(26,'rewolucja-kulturalna','Rewolucja kulturalna — przebieg i pamięć','Chiny','Wénhuà Dà Gémìng [łen-hła da ge-ming]'),
(27,'jadeitowy-budda','Świątynia Jadeitowego Buddy — pełny spacer','Szanghaj','Yùfó Sì [jü-fo sy]'),
(28,'nanbin-road','Nanbin Road — Chongqing od strony rzeki','Chongqing','Nánbīn Lù [nan-bin lu]'),
(29,'ciqikou','Ciqikou — port, porcelana i stare uliczki','Chongqing','Cíqìkǒu [cy-ci-kou]'),
(30,'chongqing','Chongqing — rzeki, wzgórza i historia','Chongqing','Chóngqìng [czung-cing]'),
(31,'liziba','Liziba — jak kolej przejeżdża przez budynek','Chongqing','Lǐzǐbà [li-dzy-ba]')]
fixes=[]
def split(text):
 lines=text.splitlines();result=[];title='Wprowadzenie';body=[]
 for l in lines:
  l=l.strip()
  if not l:continue
  m=re.match(r'^\d+[.)]\s+(.+)',l)
  if m:
   if body:result.append(section(title,'\n'.join(body),'opowiesc-'+str(len(result)+1)))
   title=m[1];body=[]
  elif re.match(r'^CZĘŚĆ [IVX]+',l) or (not result and not body and l.isupper() and len(l)>15):continue
  elif re.search(r'(?:rozwinięta wersja|20 rozwiniętych punktów|20 najważniejszych punktów)',l,re.I) and len(l)<110:continue
  else:body.append(l)
 if body:result.append(section(title,'\n'.join(body),'opowiesc-'+str(len(result)+1)))
 return result

def replace_text(ss,a,b):
 for s in ss:s['content']=s['content'].replace(esc(a),esc(b))
def find(ss,hint):return next(s for s in ss if hint.lower() in s['title'].lower())
def replace_section(ss,hint,text):find(ss,hint)['content']=ps(text)

facts={
'pogrzeby':'Obrzędy pogrzebowe różnią się między regionami, rodzinami i wspólnotami religijnymi. Biel jest tradycyjnym kolorem żałoby, ale nie opisuje całego współczesnego ceremoniału.',
'miasta-duchow':'Puste, ukończone mieszkania i niedokończone budowy to dwa różne zjawiska. Sam widok pustych okien nie mówi jeszcze, z którym mamy do czynienia.',
'konfucjanizm':'Konfucjańskie pojęcie li obejmuje rytuał i właściwe zachowanie: od ceremonii po codzienne relacje.',
'rodzina-malzenstwo':'Różnice między pokoleniami, miastem i wsią oraz sytuacją ekonomiczną rodzin są kluczowe dla zrozumienia współczesnych Chin.',
'emerytury':'Emerytura pracownicza i podstawowe świadczenie w systemie mieszkańców to różne kategorie. Ich kwot nie należy przedstawiać jako jednej średniej.',
'jedno-dziecko':'Polityka jednego dziecka miała wyjątki i zmieniała się w czasie. Jej skutki społeczne trwają po zniesieniu ograniczenia.',
'mao-zedong':'Długi Marsz rozpoczął się od odwrotu. Później stał się jednym z najważniejszych elementów opowieści KPCh o własnych początkach.',
'sluby':'Ceremonia weselna, bankiet i prawna rejestracja małżeństwa są odrębnymi wydarzeniami i nie muszą odbywać się tego samego dnia.',
'huangshan':'Huangshan leży w Anhui. Zhangjiajie i góra Tianmen leżą w Hunan — to dwa różne regiony i odmienne krajobrazy.',
'kuchnia-hui':'Kuchnia Hui w tym materiale oznacza tradycję Huizhou w Anhui. Nie należy utożsamiać jej z kuchnią muzułmańskiej społeczności Hui.',
'kult-przodkow':'Sala przodków służyła pamięci rodu i jego organizacji. Nie każdy budynek z kadzidłami jest klasztorem buddyjskim.',
'hongcun':'Kanały Hongcun tworzą działający układ wodny. Plan opisywany jako ciało wołu pomaga zapamiętać jego elementy.',
'tunxi':'Cztery Skarby Gabinetu to pędzel, tusz, papier i kamień do rozcierania tuszu. Każdy wymaga innego rzemiosła.',
'wenshu':'Wenshu to chińskie imię bodhisattwy Mandziuśriego. Jego miecz symbolizuje mądrość przecinającą niewiedzę.',
'wuhou':'Wuhou jest miejscem upamiętnienia postaci historycznych. Kult bohaterów i pamięć polityczna wyjaśniają ten kompleks lepiej niż sam opis buddyzmu.',
'pandy':'Panda wielka jest niedźwiedziem. Jej pozorny szósty palec to powiększona kość nadgarstka pomagająca chwytać bambus.',
'三':'',
'wyspa-pomaranczowa':'Juzizhou jest wyspą w rzece Xiang. Pomnik przedstawia młodego Mao, co łączy to miejsce z jego latami spędzonymi w Changshy.',
'tianmen':'Tianmen, park Wulingyuan i Wielki Kanion ze szklanym mostem są osobnymi miejscami. Nie łączy ich jeden wspólny bilet ani jedna kolejka.',
'kuchnia-hunan':'Hunańska ostrość często opiera się na świeżej, suszonej i fermentowanej papryce. Syczuańskie mala łączy ostrość z drętwieniem od pieprzu syczuańskiego.',
'gory-avatara':'Filary Wulingyuan zbudowane są przede wszystkim z piaskowców kwarcowych. Granitowy krajobraz Huangshan powstał w innych skałach.',
'changsha':'Changsha jest stolicą Hunan. Anhui, z Huangshan i Hongcun, to odrębna prowincja.',
'chenghuang':'Stare Miasto jest dawnym centrum chińskiego Szanghaju. Określenie Chinatown bywa używane turystycznie, ale nie oznacza tu dzielnicy emigrantów.',
'rewolucja-kulturalna':'Rewolucja kulturalna trwała w latach 1966–1976. Nie jest tym samym wydarzeniem co wcześniejszy Wielki Skok Naprzód.',
'jadeitowy-budda':'Mniejszy leżący Budda z jadeitu i późniejszy, większy posąg z marmuru to dwie różne rzeźby.',
'nanbin-road':'Nanbin Road leży w Chongqing, na południowym brzegu Jangcy. Nazwa nie oznacza miasta Nankin.',
'ciqikou':'Ciqikou wiąże swoją historię z portem nad Jialing. Dzisiejszy spacer prowadzi przez miejsce silnie przekształcone przez turystykę.',
'chongqing':'Chongqing to miasto wydzielone o rozległym obszarze administracyjnym. Liczby mieszkańców całej jednostki nie opisują wyłącznie zwartego centrum.',
'liziba':'Tor i budynek projektowano równocześnie. Konstrukcja kolejowa ma własne podpory, oddzielone od konstrukcji budynku.'}
tips={
'wuhou':'Przed wejściem przypomnij, kim byli Liu Bei i Zhuge Liang. Rozbudowane dzieje Trzech Królestw zostaw na przejazd; na miejscu wracaj do osób związanych z oglądanym dziedzińcem.',
'liu-bei':'To rozwinięcie biografii do przejazdu lub przygotowania. Jeśli grupa zna już opowieść o Trzech Królestwach, przy Wuhou wybierz historię relacji Liu Bei z Zhuge Liangiem.',
'trzy-krolestwa':'Najpierw wprowadź trzech rywali i położenie ich państw. Potem dodawaj bohaterów. Przy kolejnych wizytach przypominaj tylko wątek związany z oglądanym miejscem.',
'liziba':'Najpierw pokaż belkę i wjazd do budynku. Dopiero potem wyjaśnij konstrukcję. Nie zatrzymuj grupy na ciągu komunikacyjnym stacji.',
'jadeitowy-budda':'Rozpoznawaj figury po podpisach, atrybutach i kontekście całego ołtarza. Zasady fotografowania odczytaj z aktualnych oznaczeń w danym pawilonie.',
'emerytury':'Przy każdej kwocie podaj rok, region i rodzaj świadczenia. Przykład osoby z długim stażem nie jest gwarantowaną taryfą za liczbę lat pracy.',
'feng-shui':'Wyjaśniaj feng shui jako tradycję interpretowania przestrzeni. Przekonań o energii, szczęściu i zdrowiu nie przedstawiaj jako potwierdzonych praw przyrody.',
'huangshan':'Trasę, otwarte szczyty i kolejkę dobierz do aktualnych komunikatów parku oraz kondycji grupy. Z notatki z dawnego wyjazdu nie wynika dostępność przejścia dzisiaj.',
'pandy':'Pokaż najpierw zwierzę, potem opowiedz o jego zachowaniu. Aktywność pand zależy od pogody i pory dnia; nie obiecuj konkretnego zachowania ani dostępności młodych.',
'rewolucja-kulturalna':'Ten tekst służy też do przygotowania pilota. Na trasie wybieraj wątek związany z miejscem i pytaniami grupy; nie trzeba opowiadać całości podczas jednego przejazdu.'}
links={
'wuhou':['trzy-krolestwa','liu-bei'],'liu-bei':['trzy-krolestwa','wuhou'],'trzy-krolestwa':['wuhou','liu-bei'],
'huangshan':['hongcun','tunxi','kuchnia-hui'],'hongcun':['kult-przodkow','feng-shui','tunxi'],'tunxi':['hongcun','kuchnia-hui'],
'rodzina-malzenstwo':['sluby','jedno-dziecko','emerytury'],'pogrzeby':['kult-przodkow','feng-shui'],
'mao-zedong':['wyspa-pomaranczowa','rewolucja-kulturalna'],'changsha':['wyspa-pomaranczowa','mao-zedong','kuchnia-hunan'],
'gory-avatara':['tianmen'],'chongqing':['liziba','ciqikou','nanbin-road'],'jadeitowy-budda':['wenshu','rewolucja-kulturalna']}
review=[];topics=[]
for idx,tid,title,city,pron in rows:
 ss=split(raw[idx]['text'])
 replace_text(ss,'Chińskie słowo Huangshan oznacza dosłownie „Góry Żółtego Cesarza”.','Znak huang oznacza „żółty”, a shan „górę”. Tradycyjne objaśnienie nazwy wiąże ją z Huangdi, Żółtym Cesarzem.')
 replace_text(ss,'miłość stała się podstawą małżeństwa','wybór partnera i uczucia zyskały większe znaczenie w wielu środowiskach')
 if tid=='jadeitowy-budda':
  s=find(ss,'Główna Sala')
  content=s['content']
  start=content.index('<p>Budda Przeszłości')
  end=content.index('<p>Dlaczego ci trzej')
  background=content[start:end]
  background=re.sub(r'<p>Wygląd posągu</p>.*?(?=<p>Budda (?:Teraźniejszości|Przyszłości)|$)','',background,flags=re.S)
  background=re.sub(r'<p>W Wielkiej Sali Mahawiry przedstawiany.*?</p>','',background)
  background=background.replace('dlatego wiele osób błędnie utożsamia go z właściwym Maitreją.','warto więc rozróżniać historycznego Buddę Siakjamuniego od przedstawień Maitrei i Budaia.')
  s['content']=ps('Proszę spojrzeć na główny ołtarz. Kilka podobnych, złoconych postaci nie musi oznaczać tej samej osoby w różnych momentach życia. W buddyzmie mahajany spotykamy wielu buddów, a dobór figur wyraża konkretną naukę.\nW opisach głównej sali tej świątyni wymieniani są Siakjamuni, Amitabha i Budda Medycyny. Siakjamuni jest historycznym nauczycielem, którego nauki zapoczątkowały buddyzm. Amitabha wiąże się z Zachodnią Czystą Krainą, a Budda Medycyny z uzdrawianiem i uwalnianiem od cierpienia w tradycji religijnej.\nTo ważne rozróżnienie: istnieją również przedstawienia buddów przeszłości, teraźniejszości i przyszłości, ale tego schematu nie można automatycznie przenieść na każdy ołtarz. Identyfikację zacznijmy od podpisów i atrybutów. Sama pozycja po lewej lub prawej stronie nie wystarcza.\nGłówna sala służy wspólnym praktykom religijnym. Patrząc na posągi, zwróćmy więc uwagę również na to, gdzie stoją wierni, jak składają ukłony i w jaki sposób poruszają się między ołtarzami. Taki układ pokazuje świątynię jako miejsce praktyki, a nie tylko zbiór rzeźb.')+'<p><a href="https://www.thehistoryhub.com/jade-buddha-temple-facts-pictures.htm">Opis wyposażenia głównej sali</a></p>'
  ss.insert(ss.index(s)+1,{'id':'buddyzm-trzy-czasy','title':'Buddowie trzech czasów — tło religijne','content':note('legend','Tradycja buddyjska','Poniższe postacie wyjaśniają ideę buddów trzech czasów. Nie jest to lista posągów głównego ołtarza tej świątyni.')+background})
  s=find(ss,'podczas rewolucji');s['content']=note('legend','Opowieść o ocaleniu świątyni','Historia drukarni i wizerunków Mao jest przekazywana jako opowieść o przetrwaniu kompleksu. Szczegóły tej relacji należy odróżniać od potwierdzonej chronologii świątyni.')+s['content'].replace('Świątynia Jadeitowego Buddy ocalała w dość nietypowy sposób.','Według popularnej relacji świątynia ocalała w nietypowy sposób.')
  replace_text(ss,'W środku nie robimy zdjęć.','W pawilonie stosujemy się do aktualnych oznaczeń dotyczących fotografowania.')
  replace_text(ss,'ogranicza ryzyko uszkodzenia niezwykle cennego zabytku.','pozwala gospodarzom ustalać zasady korzystania z przestrzeni sakralnej.')
  fixes.append('Jadeitowy Budda: oddzielono ikonografię konkretnego ołtarza od buddów trzech czasów; opowieść o ocaleniu oznaczono jako relację; zasady zdjęć zależą od oznaczeń.')
 if tid=='liziba':
  s=find(ss,'2004');s['title']='Stacja powstała przed internetową popularnością'
  replace_text(ss,'Stację ukończono w 2004 roku, kiedy uruchamiano linię numer 2.','Stacja powstała w pierwszej połowie lat 2000., przed okresem jej światowej popularności w mediach społecznościowych. Ukończenie budowy, jazdy próbne i regularne przewozy są różnymi etapami inwestycji.')
  # Join repeated explanations under the relevant topic, retaining distinct detail.
  for target,source in [('Budynek i stacja','dziurą w bloku'),('Stacja działa','Najciekawszy moment')]:
   a=find(ss,target);b=find(ss,source);a['content']+=b['content'];ss.remove(b)
  ss.append({'id':'zrodlo-konstrukcja','title':'Konstrukcja — źródło','content':'<p><a href="https://www.ichongqing.info/2022/01/06/which-came-first-liziba-station-or-its-residential-building/">Wywiad z Ye Tianyi, kierownikiem zespołu projektowego</a></p>'})
  fixes.append('Liziba: rozdzielono etapy uruchamiania; połączono powtarzające się rozdziały konstrukcyjne.')
 if tid=='emerytury':
  replace_section(ss,'Szanghaj i Pekin pokazują','Szanghaj i Pekin dobrze pokazują, dlaczego w rozmowie o emeryturach potrzebujemy nazwy systemu oraz regionu. Podstawowe świadczenie mieszkańców jest ustalane i podwyższane administracyjnie, a jego poziom może się istotnie różnić między miejscami.\nInaczej wygląda emerytura osoby przez wiele lat zatrudnionej i ubezpieczonej w systemie pracowniczym. Składają się na nią elementy zależne od historii składek i regionalnych podstaw. Dlatego mieszkaniec tego samego miasta może otrzymywać zupełnie inną kwotę.\nPorównanie dwóch miast ma sens dopiero wtedy, gdy zestawiamy ten sam rodzaj świadczenia w tym samym roku. Sama etykieta „emerytura w Szanghaju” jest zbyt ogólna. Trzeba też pamiętać o kosztach życia: wyższa nominalna wypłata nie oznacza automatycznie proporcjonalnie wyższego poziomu życia.')
  for s in ss:
   s['content']=re.sub(r'<p>12\.</p>[\s\S]*$','',s['content'])
  replace_text(ss,'Ponad 320 milionów mieszkańców Chin ma już 60 lat lub więcej. Oznacza to, że mniej więcej co czwarty mieszkaniec kraju zbliża się do wieku emerytalnego lub już go osiągnął.','Rosnąca liczba osób starszych zmienia proporcję między potencjalnymi pracownikami a osobami pobierającymi świadczenia. Wiek 60 lat nie oznacza jednak jednakowego statusu emerytalnego dla każdego mieszkańca.')
  ss.append(section('Jak porównywać świadczenia','Najpierw pytamy o system, następnie o region i rok. Dopiero potem porównujemy kwoty.\nLiczba lat pracy sama nie wyznacza jednej gwarantowanej wypłaty. Dwie osoby z trzydziestoletnim stażem mogą mieć inne podstawy i historię składek. Przykładowej kwoty nie należy traktować jak cennika za staż.','porownanie-swiadczen'))
  ss.append({'id':'zrodla-reforma','title':'Reforma — źródło i data','content':'<p>Zmiany wieku emerytalnego są stopniowe, od 2025 roku. Docelowe granice nie są wspólnym wiekiem emerytalnym wszystkich osób w 2026 roku.</p><p><a href="https://www.reuters.com/world/china/chinas-legislature-approves-draft-proposal-raise-retirement-age-2024-09-13/">Opis przyjętej reformy, 13 września 2024</a></p>'})
  fixes.append('Emerytury: usunięto nieudokumentowaną tabelę kwot i pozorny cennik za staż; zachowano reformę oraz rozróżnienie systemów.')
 if tid=='pandy':
  for s in ss:
   s['content']=re.sub(r'<p>[^<]*8[–\-]12[^<]*</p>','<p>Odchodzenie od mleka matki i usamodzielnianie są procesami. Ich przebieg zależy od rozwoju młodego oraz warunków życia i opieki; nie należy sprowadzać ich do jednej sztywnej granicy wieku.</p>',s['content'])
 # Mark explicit legends paragraph by paragraph, never convert ordinary claims to verified facts.
 for s in ss:
  s['content']=re.sub(r'<p>((?:Według legendy|Legenda mówi|Według opowieści|Zgodnie z legendą)[\s\S]*?)</p>',lambda m:'<blockquote class="note-legend"><strong>Legenda / opowieść</strong><p>'+m[1]+'</p></blockquote>',s['content'])
  s['content']=re.sub(r'<p>\d+\.</p>','',s['content'])
  # Remove exact paragraph repetition within a chapter only.
  seen=set()
  def dedup(m):
   p=m[0]
   if len(plain(p))<80:return p
   if p in seen:return ''
   seen.add(p);return p
  s['content']=re.sub(r'<p>[^<]*</p>',dedup,s['content'])
 ss=[s for s in ss if plain(s['content']).strip()]
 fact=facts.get(tid)
 if fact:ss[0]['content']=note('fact','Fakt / ciekawostka',fact)+ss[0]['content']
 tip=tips.get(tid)
 if tip:ss.insert(0,{'id':'dla-pilota','title':'Jak poprowadzić opowieść','content':note('guide','Dla pilota',tip)})
 if tid=='feng-shui':ss.insert(1,{'id':'tradycja','title':'Jak rozumieć język feng shui','content':note('legend','Tradycja i wierzenia','Qi, smocze żyły i wpływ przestrzeni na pomyślność należą do tradycyjnego systemu przekonań. Jego znaczenie kulturowe jest czymś innym niż naukowe potwierdzenie działania.')})
 t={'id':tid,'title':title,'city':city,'category':'Kultura i zwyczaje' if city=='Chiny' else 'Miasta i trasy','pronunciation':pron,'chinese':'','status':'pełne','coverage':'full','updated':'2026-09-10','icon':'文','accent':'green','tags':['CTF',city,'opowieść'],'summary':' · '.join(s['title'] for s in ss if s['id']!='dla-pilota')[:380],'facts':[fact] if fact else [],'quiz':[],'guideScripts':[],'sections':ss,'sourceDocuments':[raw[idx]['name']]}
 topics.append(t)
new={t['id']:t for t in topics}
# Retain the second Huangshan account as complementary passages selected by scope.
extra=split(raw[10]['text'])
for s in extra:
 if any(w in s['title'].lower() for w in ['sosn','tragarz','schod','turyst']):
  s['id']='drugi-tekst-'+s['id'];new['huangshan']['sections'].append(s)
new['huangshan']['sourceDocuments'].append(raw[10]['name'])
# Detailed older chapters add what the new guide scripts omit.
supplements={
'huangshan':('ctf-huangshan-huizhou',['flora','animals','heavengate','cableway','stairs','safety','pines']),
'hongcun':('hongcun-tunxi',['6-chengzhi-tang-czeng-dzy-tang-dom-kupca-jako-prywatne-imperium-d','10-paifang-paj-fang-pailou-paj-lou-brama-jako-kamienne-cv-rodu']),
'tunxi':('hongcun-tunxi',['huiink','13-xuanzhi-suan-dzy-papier-xuan-ktory-pamieta-kazdy-ruch-reki','inkstone','brush','16-keju-ke-dziu-egzaminy-urzednicze-czyli-pedzel-jako-droga-do-wl']),
'gory-avatara':('zhangjiajie',['s7','s10','s11','s16','s17','s18']),
'tianmen':('zhangjiajie',['s13','s14']),
'changsha':('changsha',['wymowa'])}
for tid,(source,ids) in supplements.items():
 for s in old[source]['sections']:
  if s['id'] in ids:
   s=dict(s);s['id']='szczegoly-'+s['id'];s['title']='Więcej: '+s['title'];new[tid]['sections'].append(s)
 new[tid]['sourceDocuments'].append('Dotychczasowe kompendium: '+source)
for tid,others in links.items():
 new[tid]['sections'].append({'id':'powiazane','title':'Powiązane opowieści','content':'<ul>'+''.join('<li><a href="#topic/'+x+'">'+esc(new[x]['title'])+'</a></li>' for x in others)+'</ul>'})
# A short pronunciation reference supports reading aloud without interrupting sentences.
pronunciations={'Huangshan':'Huángshān [hłang-szan]','Huangdi':'Huángdì [hłang-di]','Huizhou':'Huīzhōu [hłej-dżou]','Hongcun':'Hóngcūn [hung-cun]','Tunxi':'Túnxī [tun-si]','Anhui':'Ānhuī [an-hłej]','Hunan':'Húnán [hu-nan]','Chengdu':'Chéngdū [czeng-du]','Chongqing':'Chóngqìng [czung-cing]','Changsha':'Chángshā [czang-sza]','Zhangjiajie':'Zhāngjiājiè [dżang-dzia-dzie]','Tianmen':'Tiānmén [tien-men]','Wulingyuan':'Wǔlíngyuán [łu-ling-jüen]','Yuanjiajie':'Yuánjiājiè [jüen-dzia-dzie]','Tianzi':'Tiānzǐ [tien-dzy]','Bailong':'Bǎilóng [baj-lung]','Juzizhou':'Júzǐzhōu [dziu-dzy-dżou]','Wenshu':'Wénshū [łen-szu]','Wuhou':'Wǔhóu [łu-hou]','Liu Bei':'Liú Bèi [liou-bej]','Zhuge Liang':'Zhūgě Liàng [dżu-ge liang]','Cao Cao':'Cáo Cāo [cao-cao]','Sun Quan':'Sūn Quán [sun-cüen]','Guan Yu':'Guān Yǔ [głan-jü]','Zhang Fei':'Zhāng Fēi [dżang-fej]','Mao Zedong':'Máo Zédōng [mao dze-dung]','Jiangxi':'Jiāngxī [dziang-si]','Zunyi':'Zūnyì [dzun-i]','Yan’an':'Yán’ān [jen-an]','Ciqikou':'Cíqìkǒu [cy-ci-kou]','Liziba':'Lǐzǐbà [li-dzy-ba]','Nanbin':'Nánbīn [nan-bin]','Yuyuan':'Yùyuán [jü-jüen]','Guanyin':'Guānyīn [głan-in]','Huigen':'Huìgēn [hłej-gen]','feng shui':'Fēngshuǐ [feng-szłej]','hukou':'Hùkǒu [hu-kou]','guanxi':'Guānxì [głan-si]','mianzi':'Miànzi [mien-dzy]'}
summaries={
'pogrzeby':'Od przygotowania ceremonii i rodzinnej żałoby po papierowe dary, pochówek oraz pamięć o zmarłych.',
'miasta-duchow':'Jak sprzedaż mieszkań przed ukończeniem budowy napędzała inwestycje i dlaczego kupujący zostawali z kredytem oraz niedokończonym lokalem.',
'konfucjanizm':'Rodzina, właściwe zachowanie, edukacja i władza — pojęcia, które pomagają zrozumieć społeczną historię Chin.',
'rodzina-malzenstwo':'Rodzice, dziadkowie, edukacja, mieszkanie i wybory młodych ludzi na tle różnic pokoleniowych oraz materialnych.',
'emerytury':'Dwa główne systemy, znaczenie składek, regionalne nierówności i stopniowe podnoszenie wieku emerytalnego.',
'jedno-dziecko':'Od ograniczania urodzeń i wyjątków od zasad po życie jedynaków, starzenie się rodziców oraz próby zwiększenia liczby narodzin.',
'mao-zedong':'Młodość, walka o władzę, Długi Marsz i rządy Mao — wraz z rozróżnieniem historii, oficjalnej opowieści i ludzkich doświadczeń.',
'sluby':'Swatki, targi małżeńskie, negocjacje rodzinne, ceremonia herbaciana i wesele — z uwzględnieniem zmian współczesnych obyczajów.',
'feng-shui':'Jak tradycyjne wyobrażenia o krajobrazie i pomyślności wpływały na wybór miejsca domu, grobu oraz organizację przestrzeni.',
'huangshan':'Granitowe skały, sosny i morze chmur, ich znaczenie w kulturze oraz szczegóły przyrody i organizacji górskiego spaceru.',
'kuchnia-hui':'Produkty górskiego regionu, suszenie, fermentacja i duszenie jako klucz do smaków Huizhou.',
'kult-przodkow':'Pamięć rodzinna, sale przodków i organizacja rodu — szczególnie ważne podczas spaceru po dawnych wsiach Anhui.',
'hongcun':'Spacer przez wieś, której kanały, stawy i domy pokazują, jak organizowano wodę, bogactwo i życie wspólnoty.',
'tunxi':'Handlowa ulica Huizhou oraz szczegółowe opowieści o tuszu, papierze, pędzlach i kamieniach do kaligrafii.',
'wenshu':'Żyjący klasztor, jego dziedzińce, postacie i rytuały objaśnione w kolejności przydatnej podczas zwiedzania.',
'wuhou':'Miejsce pamięci Liu Beia i Zhuge Lianga: władza, lojalność oraz bohaterowie historii i powieści.',
'pandy':'Bambusowa dieta, chwytne łapy, rozród i ochrona siedlisk — oraz sposób oglądania zwierząt w Panda Base.',
'trzy-krolestwa':'Rozpad władzy Han, rywalizacja państw i bohaterowie, których pamięć spotykamy w Chengdu.',
'liu-bei':'Droga założyciela Shu Han, jego sojusze i relacja z Zhuge Liangiem, rozwinięte jako osobna opowieść.',
'wyspa-pomaranczowa':'Rzeka Xiang, panorama Changshy i wizerunek młodego Mao — połączenie krajobrazu z historią miasta.',
'tianmen':'Brama w górze, kolejki, schody, zakręty i szklane chodniki — z wyraźnym rozdzieleniem miejsc regionu Zhangjiajie.',
'kuchnia-hunan':'Papryka, fermentacja, lokalne potrawy i różnice między kuchnią Hunan a Syczuańską.',
'gory-avatara':'Skalne filary Wulingyuan, Yuanjiajie, Tianzi i doliny, z uzupełnieniami o windzie Bailong, przyrodzie i mieszkańcach regionu.',
'changsha':'Stolica Hunan nad rzeką Xiang: historia, dawne grobowce, edukacja, młody Mao i współczesne życie miasta.',
'chenghuang':'Dawne centrum Szanghaju, opiekuńcze bóstwo miasta, handel i sposób komponowania ogrodu Yuyuan.',
'rewolucja-kulturalna':'Przyczyny, przebieg, prześladowania i codzienne doświadczenia lat 1966–1976 oraz ich miejsce w pamięci rodzinnej.',
'jadeitowy-budda':'Historia jadeitowych figur, spacer przez pawilony, rozpoznawanie postaci i znaczenie praktyk buddyjskich.',
'nanbin-road':'Widok na Chongqing od strony Jangcy: brzegi, zabudowa, historia portu i wieczorna panorama.',
'ciqikou':'Dawny port nad Jialing, historia porcelany i spacer po ulicach przekształconych przez współczesną turystykę.',
'chongqing':'Jak rzeki i wzgórza ukształtowały miasto, jego transport, historię wojenną i współczesne centrum.',
'liziba':'Belka, gumowe koła, osobne podpory i wspólny projekt budynku ze stacją — wyjaśnienie niezwykłego widoku krok po kroku.'}
for t in topics:
 t['summary']=summaries[t['id']]
 combined=plain(' '.join(s['content'] for s in t['sections']))
 glossary=[(k,v) for k,v in pronunciations.items() if re.search(r'(?<!\w)'+re.escape(k)+r'(?!\w)',combined,re.I)]
 if glossary:t['sections'].insert(0,{'id':'wymowa-nazw','title':'Wymowa nazw','content':'<p>Pomocnicza wymowa polska jest przybliżeniem; nie oddaje dokładnie chińskich tonów.</p><ul>'+''.join('<li>'+esc(v)+'</li>' for k,v in glossary)+'</ul>'})

for t in topics:t['readingTime']=max(1,math.ceil(len(plain(' '.join(s['content'] for s in t['sections'])).split())/130))
(ROOT/'data/ctf-revision.js').write_text('/* CTF editorial revision, 2026-09-10. Full narratives and retained specialist chapters. */\nwindow.WANFANG_CTF_REVIEWED='+json.dumps(topics,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(ROOT/'editorial/ctf-revision-manifest.json').write_text(json.dumps({'date':'2026-09-10','sources':len(raw),'topics':[{'id':t['id'],'sources':t['sourceDocuments'],'sections':len(t['sections']),'words':len(plain(' '.join(s['content'] for s in t['sections'])).split())} for t in topics],'corrections':fixes,'verification':'Editorial integration with targeted factual corrections; not an exhaustive independent fact-check of every supplied claim.'},ensure_ascii=False,indent=2),encoding='utf-8')
print('Built',len(topics),'topics;',sum(len(t['sections']) for t in topics),'chapters')
