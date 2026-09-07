"""Import approved Wanfang HTML materials using only the Python standard library.

Run with --source-dir, --ctf (Library-extracted JSON), --rejs and --provenance.
The source documents remain external inputs; personal contact directories are not published.
"""
import argparse, copy, html, json, re, unicodedata
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
class Node:
    def __init__(self, tag='root', attrs=(), parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []
    def text(self):
        return ''.join(c if isinstance(c,str) else c.text() for c in self.children)
    def walk(self):
        yield self
        for c in self.children:
            if isinstance(c,Node): yield from c.walk()

class Tree(HTMLParser):
    VOID = {'br','hr','img','meta','link','input','source','wbr','area','col','embed','param'}
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.root=Node(); self.stack=[self.root]; self.feed(text)
    def handle_starttag(self, tag, attrs):
        n=Node(tag,attrs,self.stack[-1]);self.stack[-1].children.append(n)
        if tag not in self.VOID:self.stack.append(n)
    def handle_startendtag(self,tag,attrs):
        self.handle_starttag(tag,attrs)
        if tag not in self.VOID:self.handle_endtag(tag)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag:
                self.stack=self.stack[:i];break
    def handle_data(self,data):self.stack[-1].children.append(data)

DROP={'script','style','nav','button','input','textarea','select','option','svg','iframe','form','noscript'}
SAFE={'p','div','section','article','h3','h4','h5','ul','ol','li','b','strong','em','i','span','a','br','hr','blockquote','table','thead','tbody','tr','th','td','details','summary','dl','dt','dd','small','figure','figcaption','code'}
def clean(n,omit=None):
    if isinstance(n,str):return html.escape(n)
    if n is omit or n.tag in DROP:return ''
    inside=''.join(clean(c,omit) for c in n.children)
    if n.tag not in SAFE:return inside
    attrs=''
    if n.tag=='a':
        href=n.attrs.get('href','')
        if href.startswith(('https://','http://')):
            attrs=' href="'+html.escape(href,quote=True)+'" target="_blank" rel="noopener noreferrer"'
        else:return inside
    if n.tag in {'td','th'}:
        for k in ['colspan','rowspan']:
            if str(n.attrs.get(k,'')).isdigit():attrs+=' '+k+'="'+n.attrs[k]+'"'
    if n.tag=='details':attrs+=' open'
    if n.tag in {'br','hr'}:return '<'+n.tag+'>'
    return '<'+n.tag+attrs+'>'+inside+'</'+n.tag+'>'

def plain(s):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',s))).strip()
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',s.lower().replace('ł','l')) if not unicodedata.combining(c))
def slug(s):return re.sub(r'[^a-z0-9]+','-',norm(s)).strip('-')
def js(name,data,path):path.write_text('window.'+name+' = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n')
def paras(text):return ''.join('<p>'+html.escape(re.sub(r'\s*\n\s*',' ',p).strip())+'</p>' for p in text.split('\n\n') if p.strip())

def extract(path):
    root=Tree(path.read_text()).root
    found=[];used=set()
    for h in [n for n in root.walk() if n.tag=='h2']:
        title=plain(h.text())
        if any(x in norm(title) for x in ['spis tresci','standard tryb','jak uzywac tego pliku']):continue
        par=h.parent
        while par.parent and par.tag not in {'section','article'}:
            if par.tag=='div' and len(par.text())>len(h.text())+160:break
            par=par.parent
        if par is root or par.tag in {'body','main'} or sum(n.tag=='h2' for n in par.walk())>1:
            par=h.parent
            seq=[];start=False
            for c in par.children:
                if c is h:start=True;continue
                if start and isinstance(c,Node) and c.tag=='h2':break
                if start:seq.append(clean(c))
            content=''.join(seq)
        else:content=clean(par,h)
        if len(plain(content))<65:continue
        key=norm(plain(content))
        if key in used:continue
        used.add(key)
        found.append({'id':par.attrs.get('id') or slug(title)[:65], 'title':re.sub(r'^\d+[.\s]*','',title), 'content':content})
    return found

def main():
    p=argparse.ArgumentParser();p.add_argument('--source-dir',type=Path,required=True);p.add_argument('--ctf',type=Path,required=True);p.add_argument('--rejs',type=Path,required=True);p.add_argument('--provenance',type=Path,required=True);a=p.parse_args()
    t=(ROOT/'data/topics.js').read_text();base=json.loads(t[t.index('['):t.rindex(']')+1]);byid={x['id']:x for x in base}
    prov=json.loads(a.provenance.read_text());imported=[];register=[]
    def source(name):return {'name':name,'date':(prov.get(name,{}).get('created') or '')[:10],'kind':'Archiwum własnych opracowań'}
    def make(id,title,city,category,sections,names,summary='',coverage='material'):
        old=copy.deepcopy(byid.get(id,{})); words=len(re.findall(r'\S+',' '.join(plain(x['content']) for x in sections)))
        quick=old.get('quickTalk','')
        if not quick:
            candidates=[plain(x) for sec in sections for x in re.findall('<p[^>]*>(.*?)</p>',sec['content'],re.S) if len(plain(x).split())>=35]
            quick=next((x for x in candidates if len(x.split())<=180),candidates[0] if candidates else summary)
        old.update(id=id,title=title,city=city,category=category,sections=sections,status='pełne' if words>1800 else 'materiał',readingTime=max(1,round(words/150)),updated='06.09.2026',summary=summary or plain(quick)[:290],quickTalk=quick,coverage=coverage,reviewState='do-przegladu',reviewNote='Materiał odzyskany z archiwum. Data importu nie oznacza ponownej weryfikacji wszystkich faktów.',importedAt='2026-09-06',wordCount=words,sources=[source(n) for n in names],tags=list(dict.fromkeys(old.get('tags',[])+[city,title])),facts=old.get('facts',[]),icon=old.get('icon','文'),accent=old.get('accent','red'),chinese=old.get('chinese',''),pronunciation=old.get('pronunciation',''))
        old.pop('stats',None)
        if not old.get('guideScripts'):
            old['guideScripts']=[{'id':'otwarcie','label':'Otwarcie','content':paras(quick)}] if quick else []
        imported.append(old);register.append({'id':id,'title':title,'words':words,'sections':len(sections),'sources':names,'coverage':coverage,'review':'Do przeglądu'})
        return old
    mapping=[
      ('wielki-mur','Wielki Mur Chiński','Pekin','Miasta i trasy','nawijka_wielki_mur_chinski.html'),
      ('palac-letni','Pałac Letni, Yiheyuan i Cixi','Pekin','Miasta i trasy','letni_palac_pekin_przewodnik_interaktywny.html'),
      ('swieta-droga','Święta Droga i Grobowce Ming','Pekin','Historia','Swieta_Droga_Grobowce_Ming_przewodnik.html'),
      ('swiatynia-nieba','Świątynia Nieba — rytuał i architektura','Pekin','Kultura i zwyczaje','nawijka_temple_of_heaven_tiantan.html'),
      ('hukou','Hukou — meldunek, migracje i rodzina','Chiny','Życie codzienne','nawijka_hukou_chiny.html'),
      ('pekin','Pekin — historia, oś miasta i codzienność','Pekin','Miasta i trasy','chiny_rozdzial_4_pekin.html'),
      ('cesarz-panstwo','Cesarz, państwo i porządek społeczny','Chiny','Historia','chiny_rozdzial_3_cesarz_panstwo_porządek.html'),
      ('chiny-wprowadzenie','Chiny — skala, ciągłość i kontrasty','Chiny','Nawijki','chiny_rozdzial_1_cywilizacja_skali.html'),
      ('geografia-chin','Geografia Chin — rzeki, regiony i miasta','Chiny','Miasta i trasy','chiny_rozdzial_2_geografia.html'),
      ('starozytne-chiny','Starożytne Chiny i pierwsze cesarstwo','Chiny','Historia','starozytne_chiny_nawijka_polaczona.html'),
      ('wojny-opiumowe','Chiny, srebro i wojny opiumowe','Chiny','Historia','chiny_srebro_opium_pelne_nawijki_FINAL_v2.html'),
      ('shaolin','Shaolin — chan, kung fu i Las Pagód','Luoyang / Shaolin','Miasta i trasy','chiny_rozdzial_20_shaolin.html'),
      ('hongcun-tunxi','Hongcun, Tunxi i kultura Huizhou','Huangshan / Anhui','Miasta i trasy','hongcun_tunxi_anhui_panel_przewodnika.html'),
      ('changsha','Changsha i młody Mao','Changsha / Hunan','Miasta i trasy','changsha_przewodnik_nawijka_v2.html'),
      ('zhangjiajie','Zhangjiajie, Tianmen i góry Avatara','Zhangjiajie','Miasta i trasy','zhangjiajie_tryb_pilot_chiny(1).html'),
      ('pekin-olimpijski','Pekin olimpijski — stadiony, wieże i parki','Pekin','Miasta i trasy','nawijka_wioska_olimpijska_pekin_fixed.html')]
    for id,title,city,cat,name in mapping:
        sections=extract(a.source_dir/name)
        assert sections, name
        topic=make(id,title,city,cat,sections,[name])
        if id=='wielki-mur':
            extra=extract(a.source_dir/'wielki_mur_chinski_przewodnik_interaktywny.html')
            topic['sources'].append(source('wielki_mur_chinski_przewodnik_interaktywny.html'))
            topic['guideScripts']=[{'id':'otwarcie','label':'Otwarcie','content':paras(topic['quickTalk'])}]
            for sec in extra:
                if any(x in norm(sec['title']) for x in ['3–5','3-5','60–90','60-90','zakonczenie']):
                    topic['guideScripts'].append({'id':sec['id'],'label':sec['title'],'content':sec['content']})
                elif 'pytania' in norm(sec['title']):topic['sections'].append(sec)
    fname='chiny_dodatkowe_tematy_nawijki_porządnie.html';extra=extract(a.source_dir/fname)
    specs=[('plany-piecioletnie','Plany pięcioletnie','Chiny','Historia','plany pięcioletnie'),('gaokao','Szkoła i gaokao','Chiny','Życie codzienne','szkolnictwo'),('sluzba-zdrowia','Opieka zdrowotna w Chinach','Chiny','Życie codzienne','służba zdrowia'),('szanghaj','Szanghaj — port, Bund i Pudong','Szanghaj','Miasta i trasy','szanghaj /'),('shanghai-tower','Shanghai Tower','Szanghaj','Miasta i trasy','shanghai tower'),('szybka-kolej','Szybka kolej w Chinach','Chiny','Praktyczne','szybka kolej'),('samochody-elektryczne','Samochody elektryczne, BYD i baterie','Chiny','Życie codzienne','samochody elektryczne'),('praktyczne-alipay','Alipay, WeChat Pay i życie bez portfela','Chiny','Praktyczne','wechat'),('social-credit','Social credit i monitoring — fakty i mity','Chiny','Życie codzienne','social credit'),('urbanizacja','Urbanizacja i nowe dzielnice','Chiny','Życie codzienne','urbanizacja')]
    for id,title,city,cat,key in specs:
        matches=[s for s in extra if norm(key) in norm(s['title'])]
        assert len(matches)==1,(id,len(matches))
        if id=='plany-piecioletnie':
            matches[0]['content']=matches[0]['content'].replace('Aktualny czternasty plan','Czternasty plan')
            matches.insert(0,{'id':'aktualnosc','title':'Zakres czasowy materiału','content':'<p>Ten tekst opisuje przede wszystkim czternasty plan na lata 2021–2025. Nie traktuj go jako opisu bieżącego planu. Rozdział o piętnastym planie 2026–2030 wymaga osobnego opracowania na podstawie aktualnych dokumentów.</p>'})
        make(id,title,city,cat,matches,[fname])
    docs=json.loads(a.ctf.read_text());raw='\n'.join(docs[0]['content'])
    raw=re.sub(r'<PARSED TEXT FOR PAGE:.*?>','',raw)
    raw=re.sub(r'RAINBOW \| CTF \| GÓRY AVATARA OPRACOWANIE PILOTA\s*Strona \d+','',raw)
    parts=re.split(r'Dzień (\d{1,2})\. ([^\n]+)\n',raw)
    days=[]
    for i in range(1,len(parts),3):
        num=int(parts[i]);title=parts[i+1];body=parts[i+2]
        narrative=body.split('Nawijka po drodze - proponowana kolejność',1)[-1].split('MIT / UPROSZCZENIE',1)[0]
        blocks=re.split(r'([^\n]+)\s*\|\s*([^\n]*?min)\s*\n',narrative)
        sections=[]
        for j in range(1,len(blocks),3):
            text=blocks[j+2].strip()
            sections.append({'id':'blok-'+str(len(sections)+1),'title':blocks[j].strip(),'content':paras(text),'suggestedTime':blocks[j+1].strip()})
        if not sections:sections=[{'id':'nawijka','title':'Nawijka po drodze','content':paras(narrative)}]
        myth=body.split('MIT / UPROSZCZENIE',1)[-1].split('Pigułka na zakończenie dnia')[0].strip() if 'MIT / UPROSZCZENIE' in body else ''
        close=body.split('GOTOWE DO POWIEDZENIA',1)[-1].split('DO POTWIERDZENIA')[0].strip() if 'GOTOWE DO POWIEDZENIA' in body else ''
        days.append({'day':num,'title':title,'narration':sections,'myth':re.sub(r'\s+',' ',myth),'closing':re.sub(r'\s+',' ',close)})
    assert [x['day'] for x in days]==list(range(1,16)),[x['day'] for x in days]
    js('WANFANG_CTF_BRIEFINGS',days,ROOT/'data/ctf-briefings.js')
    for id,title,city,nums in [('huangshan','Huangshan — góry w chińskim krajobrazie','Huangshan / Anhui',[5]),('chongqing','Chongqing — miasto w pionie','Chongqing',[9,10]),('chengdu','Chengdu — pandy, świątynie i Syczuan','Chengdu',[11])]:
        secs=[copy.deepcopy(s) for d in days if d['day'] in nums for s in d['narration']]
        for j,s in enumerate(secs):s['id']='blok-'+str(j+1)
        make(id,title,city,'Miasta i trasy',secs,[docs[0]['name']],coverage='fragment')
    welcome='\n'.join(docs[1]['content']).split('Gotowa krótka nawijka powitalna',1)[-1].split('Czego nie mówić jako pewnik',1)[0]
    welcome=re.sub(r'<PARSED TEXT FOR PAGE:.*?>|RAINBOW \| CTF \| GÓRY AVATARA WERSJA BEZTERMINOWA\s*Strona \d+','',welcome)
    pieces=re.split(r'\n([1-8])\. ([^\n]+)\n',welcome)
    secs=[{'id':'punkt-'+pieces[i],'title':pieces[i+1],'content':paras(pieces[i+2])} for i in range(1,len(pieces),3)]
    make('powitanie-grupy','Powitanie grupy — gotowa odprawa','Chiny','Praktyczne',secs,[docs[1]['name']],coverage='material')
    rejs=a.rejs.read_text();rs=[]
    for match in re.finditer(r'^#{1,3} (.+)\n([\s\S]*?)(?=^#{1,3} |\Z)',rejs,re.M):
        title,txt=match.groups()
        if len(txt.strip())<60:continue
        txt=re.sub(r'\*\*(.*?)\*\*',r'\1',txt)
        rs.append({'id':'rejs-'+str(len(rs)+1),'title':title,'content':paras(txt.replace('\n- ','\n\n• '))})
    topic=make('rejs-jangcy','Rejs po Jangcy — przebieg i odprawy','Jangcy','Praktyczne',rs,['Wklejony kod markdown.md'],coverage='material')
    topic['reviewNote']='Wskazówki ze wcześniejszego rejsu. Statek, przystań, godziny, ceny i fakultety trzeba potwierdzić dla konkretnej grupy.'
    for topic in imported:
        ids=set()
        for n,s in enumerate(topic['sections']):
            if not s.get('id') or s['id'] in ids:s['id']='sekcja-'+str(n+1)
            ids.add(s['id'])
    js('WANFANG_IMPORTED_TOPICS',imported,ROOT/'data/compendium-topics.js')
    (ROOT/'docs').mkdir(exist_ok=True)
    (ROOT/'docs/import-register.json').write_text(json.dumps(register,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'imported':len(imported),'words':sum(x['wordCount'] for x in imported),'ctfDays':len(days),'sections':sum(len(x['sections']) for x in imported)},ensure_ascii=False))

if __name__=='__main__':main()
