from pathlib import Path
import json,re,html,copy,math
ROOT=Path(__file__).resolve().parents[1]
import subprocess
loader=r"""const fs=require('fs'),vm=require('vm');const c={window:{}};vm.createContext(c);for(const [,f] of fs.readFileSync('index.html','utf8').matchAll(/src="(data\/[^" ]+\.js)"/g)){if(/general-revision|pronunciation/.test(f))continue;vm.runInContext(fs.readFileSync(f,'utf8'),c);}const w=c.window;console.log(JSON.stringify([...new Map([...(w.WANFANG_TOPICS||[]),...(w.WANFANG_IMPORTED_TOPICS||[]),...(w.WANFANG_EXPANDED_TOPICS||[])].map(t=>[t.id,t])).values()]));"""
base={t['id']:t for t in json.loads(subprocess.check_output(['node','-e',loader],cwd=ROOT,text=True))}
updates={}; newids=[]; supplements=[]
# Recover full tab-panel text accidentally omitted by an earlier HTML import.
recovered=json.loads((ROOT/'editorial/recovered-huizhou-sections.json').read_text())
positions=['start','huizhou','hongcun','nanhu-yuezhao','water-ox-fengshui','architecture','chengzhi','clan','tunxi','merchants','paifang','calligraphy','huiink','xuanpaper','inkstone','brush','keju','tea-products','cuisine','route-script','final-long']
for topicid in ['hongcun-tunxi','hongcun','tunxi']:
 for section in base[topicid]['sections']:
  match=re.match(r'(?:szczegoly-)?(\d+)-',section.get('id',''))
  if match and len(re.sub('<[^>]*>','',section['content']).split())<80:
   original=positions[int(match[1])]
   section['content']+=recovered[original]
 updates[topicid]=copy.deepcopy(base[topicid])
# Stable anchors for a legacy topic that had no section IDs.
t=copy.deepcopy(base['hutongi'])
for i,section in enumerate(t['sections']):section.setdefault('id','hutongi-'+str(i+1))
updates['hutongi']=t
def slug(s):
 import unicodedata
 s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
 return re.sub('[^a-z0-9]+','-',s).strip('-')[:65]
def parse(path):
 out=[];t=None;s=None
 for block in re.split(r'\n\s*\n|(?=^#{1,2} )',path.read_text(),flags=re.M):
  block=block.strip()
  if not block:continue
  lines=block.split('\n')
  for i,line in enumerate(lines):
   if line.startswith('# '):
    id,title,cat=map(str.strip,line[2:].split('|'));t={'id':id,'title':title,'category':cat,'city':'Chiny','chinese':'','pronunciation':'','icon':'文','accent':'green','status':'pełne','coverage':'full','updated':'2026-09-11','tags':['CTF','Chiny','opowieść'],'sections':[],'facts':[],'quiz':[],'guideScripts':[],'sourceDocuments':[path.name],'reviewNote':'Rewizja redakcyjna 11.09.2026. Narracja do opowiadania grupie; daty i zakres danych oznaczono przy informacjach zmiennych. Polska wymowa jest przybliżona.'};out.append(t)
   elif line.startswith('## '):
    title=line[3:];s={'id':'rew-'+slug(title),'title':title,'content':''};t['sections'].append(s)
   else:
    raw='\n'.join(lines[i:]); txt=html.escape(raw)
    if raw.startswith('> '):
     typ,body=raw[2:].split(':',1);label={'fact':'Fakt / ciekawostka','legend':'Legenda / opowieść','guide':'Dla pilota'}[typ];content=f'<blockquote class="note-{typ}"><strong>{label}</strong><p>{html.escape(body.strip())}</p></blockquote>'
    elif raw.startswith('https://'):
     content=''.join(f'<p><a href="{html.escape(u)}" target="_blank" rel="noopener noreferrer">{html.escape(u.split("/")[2]+" — "+u.rstrip("/").split("/")[-1].replace("-"," "))}</a></p>' for u in raw.splitlines())
    else:
     content=f'<p>{txt}</p>'
     if re.search(r'W tej wersji nie wpisujemy|Nie wpisujemy tutaj',raw):content=f'<blockquote class="note-guide"><strong>Dla pilota</strong>{content}</blockquote>'
    s['content']+=content;break
 for t in out:
  t['summary']=re.sub('<[^>]+>','',t['sections'][0]['content']).split('\n')[0][:240].rsplit(' ',1)[0]+'…'
 return out
for p in sorted((ROOT/'editorial').glob('general*-20260911.md')):
 for t in parse(p):
  if 'supplements' in p.name:
   b=copy.deepcopy(base[t['id']]); b['sections']+=t['sections'];b['updated']=t['updated'];b['reviewNote']=t['reviewNote'];updates[t['id']]=b;supplements.append(t['id'])
  else:updates[t['id']]=t;newids.append(t['id'])
# Preserve the nine full ZIP narratives; only correct specific language defects.
retained=['pogrzeby','miasta-duchow','konfucjanizm','rodzina-malzenstwo','emerytury','jedno-dziecko','mao-zedong','sluby','feng-shui']
for id in retained:
 t=copy.deepcopy(base[id]);updates[id]=t
 for s in t['sections']:
  s['content']=s['content'].replace('Chińczycy mają nawet specjalne określenie jako „niedokończony budynek”.','Nie chodzi więc o opuszczone zabytki, lecz o budynki, których nie udało się ukończyć.').replace('emeryturę liczona','emeryturę liczoną')
# Correct an unfounded etymology while preserving the complete EV chapter.
for s in updates['samochody-elektryczne']['sections']:
 s['content']=s['content'].replace('Nazwa pochodzi od angielskiego Build Your Dreams, czyli „buduj swoje marzenia”, choć sama firma zaczynała nie jako producent samochodów, ale jako producent baterii.','Firma posługuje się angielskim hasłem Build Your Dreams, czyli „buduj swoje marzenia”. Hasła nie należy utożsamiać z potwierdzoną pierwotną etymologią nazwy. Przedsiębiorstwo zaczynało od baterii, zanim weszło w produkcję samochodów.').replace('Najbardziej znaną firmą jest dziś BYD','Jedną z najbardziej rozpoznawalnych firm jest BYD')
updates['plany-piecioletnie']['sections'][0]['content']='<p>Poniższa opowieść wyjaśnia mechanizm planowania na przykładzie XIV planu z lat 2021–2025. Aktualny okres opisuje osobny rozdział: <a href="#topic/plan-15">XV plan 2026–2030</a>.</p>'
# Expose existing long source chapters as actual dedicated catalog material.
def extract(id,title,source,selectors):
 t=copy.deepcopy(base[source]);t.update(id=id,title=title,city='Chiny',summary=title+' — rozwinięte rozdziały z dotychczasowych materiałów.',tags=['CTF','Chiny','kultura'],quiz=[],guideScripts=[],facts=[])
 t['sections']=[copy.deepcopy(s) for s in base[source]['sections'] if any(x(s) for x in selectors)]
 t['sections'].append({'id':'material-zrodlowy','title':'Czytaj w kontekście miejsca','content':f'<p>Pełny materiał: <a href="#topic/{source}">{base[source]["title"]}</a>.</p>'})
 t['sourceDocuments']=[source];updates[id]=t;newids.append(id)
extract('paifang','Paifang i pailou — kamienna pamięć rodu','hongcun-tunxi',[lambda s:'10-paifang' in s['id']])
extract('cztery-skarby','Cztery skarby gabinetu — pędzel, tusz, papier i kamień','hongcun-tunxi',[lambda s:any(x in s['id'] for x in ['11-kaligrafia','huiink','13-xuanzhi','inkstone','brush'])])
extract('egzaminy-urzednicze','Egzaminy cesarskie — pędzel jako droga do władzy','hongcun-tunxi',[lambda s:'16-keju' in s['id']])
updates['egzaminy-urzednicze']['sections'].insert(-1,copy.deepcopy(next(s for s in base['cesarz-panstwo']['sections'] if s['id']=='urzedy')))
extract('papierowe-dary','Papierowe dary — materialna pamięć o zmarłych','pogrzeby',[lambda s:s['id'] in ['opowiesc-13','opowiesc-14','opowiesc-15','opowiesc-16']])
extract('mudry-bodhisattwowie','Gesty i bodhisattwowie — jak czytać świątynię','jadeitowy-budda',[lambda s:s['id'] in ['opowiesc-5','opowiesc-7','opowiesc-8','opowiesc-9','opowiesc-10','opowiesc-11','opowiesc-12','buddyzm-trzy-czasy','opowiesc-13','opowiesc-14','opowiesc-15']])
updates['mudry-bodhisattwowie']['sections'].insert(0,{'id':'gesty','title':'Ręce także opowiadają','content':'<p>Proszę Państwa, zanim przeczytamy podpis pod posągiem, spójrzmy na dłonie. Gest może wyrażać uspokojenie, medytację, nauczanie albo przywołanie ziemi na świadka. Takie gesty nazywa się mudrami. To termin pochodzenia indyjskiego. Nie rozpoznajemy jednak każdej postaci po jednej ręce: znaczenie mają również atrybuty, otoczenie i lokalna tradycja.</p><p>Bodhisattwa jest związany z ideałem dążenia do przebudzenia i pomocy innym istotom. W chińskiej praktyce szczególne miejsce zajmuje Guanyin [głan-in], postać współczucia. Płeć i forma przedstawienia zmieniały się w historii; wygląd jednego posągu nie wyczerpuje całej tradycji.</p>'})
# Contextual navigation makes related material discoverable without merging unrelated chapters.
related={'praca-996':['aplikacje-dostawy','rodzina-okreslenia','emerytury'],'chinska-herbata':['cztery-skarby','kuchnie-regionalne'],'jadeit-nefryt':['perly','jadeitowy-budda','zakupy-praktyka'],'gaokao':['egzaminy-urzednicze','rodzina-malzenstwo'],'mao-zedong':['kpch','wojna-z-japonia','wojna-domowa-tajwan','rewolucja-kulturalna','mao-papierosy'],'plan-15':['plany-piecioletnie','energia-chiny','nowy-jedwabny-szlak'],'rodzina-malzenstwo':['rodzina-okreslenia','sluby','jedno-dziecko'],'pogrzeby':['papierowe-dary','kult-przodkow'],'swieta':['pogrzeby','liczby-gesty'],'chiny-polska':['nowy-jedwabny-szlak','praca-996'],'zakupy-praktyka':['perly','jadeit-nefryt','porcelana','chinska-herbata']}
alltopics={**base,**updates}
for id,links in related.items():
 if id not in updates:updates[id]=copy.deepcopy(base[id])
 links=[x for x in links if x in alltopics]
 updates[id]['sections'].append({'id':'czytaj-dalej-rewizja','title':'Dalszy ciąg opowieści','content':'<ul>'+''.join(f'<li><a href="#topic/{x}">{html.escape(alltopics[x]["title"])}</a></li>' for x in links)+'</ul>'})
# Hub pages remain useful indexes, not destinations for unrelated catalog aliases.
for id,targets in [('chiny-kultura-komplet',['wynalazki','medycyna-chinska','taoizm','mudry-bodhisattwowie','papierowe-dary','swieta','jezyk-pinyin','liczby-gesty','chinski-smok','paifang','cztery-skarby','egzaminy-urzednicze','chinska-herbata','kuchnie-regionalne','jadeit-nefryt','perly','porcelana']),('chiny-praktyczne-komplet',[x for x in newids if updates[x]['category']=='Praktyczne']),('chiny-wspolczesne-komplet',['wojna-z-japonia','wojna-domowa-tajwan','deng-reformy','kpch','plan-15','nowy-jedwabny-szlak','flaga-chin','mao-papierosy'])]:
 t=copy.deepcopy(base[id]);t['sections'].insert(0,{'id':'pelne-rozdzialy','title':'Wybierz opowieść','content':'<ul>'+''.join(f'<li><a href="#topic/{x}">{html.escape(updates[x]["title"])}</a></li>' for x in targets)+'</ul>'});updates[id]=t
for t in updates.values():
 count=len(re.sub('<[^>]+>',' ',' '.join(s['content'] for s in t['sections'])).split());t['readingTime']=max(1,round(count/130));t['updated']='2026-09-11'
 if t['id'] in newids:
  t['coverage']='briefing' if t['category']=='Praktyczne' else 'full'
  t['sections'].insert(0,{'id':'plan-opowiesci','title':'Plan opowieści','content':'<ol>'+''.join('<li>'+html.escape(s['title'])+'</li>' for s in t['sections'] if s['title']!='Źródła')+'</ol>'})
output='/* Generated by scripts/build_general_revision.py. Keep source narratives in editorial/. */\n(()=>{\nconst revised='+json.dumps(list(updates.values()),ensure_ascii=False,indent=2)+';\nconst ids=new Set(revised.map(t=>t.id));\nwindow.WANFANG_EXPANDED_TOPICS=(window.WANFANG_EXPANDED_TOPICS||[]).filter(t=>!ids.has(t.id)).concat(revised);\nconst dedicated='+json.dumps(list(dict.fromkeys(newids)),ensure_ascii=False)+';\nconst catalog=window.WANFANG_CATALOG||[];\nfor(const id of dedicated){const t=revised.find(t=>t.id===id);let c=catalog.find(c=>c.id===id);if(c){c.topicId=id;c.sectionId=null;c.review="Zrewidowano 11.09.2026";}else catalog.push({id,title:t.title,region:"Chiny",programs:["CTF"],topicId:id,sectionId:null,outline:t.sections.filter(s=>!["plan-opowiesci","czytaj-dalej-rewizja"].includes(s.id)).map(s=>s.title),aliases:[id],origin:"Rewizja tematów ogólnych 11.09.2026",review:"Zrewidowano 11.09.2026"});}\nfor(const c of catalog){if(c.id==="kaligrafia"){c.topicId="cztery-skarby";c.sectionId=null;}if(c.id==="praca-996"){c.topicId="praca-996";c.sectionId=null;}}\n})();\n'
(ROOT/'data/general-revision.js').write_text(output)
manifest={'date':'2026-09-11','dedicated':list(dict.fromkeys(newids)),'supplemented':supplements,'preservedZipNarratives':retained,'updatedTopics':len(updates)}
(ROOT/'editorial/general-revision-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps(manifest,ensure_ascii=False))
