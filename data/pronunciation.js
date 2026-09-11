/* Editorial pronunciation helper: change display text only, never identifiers or URLs.
   Polish approximations intentionally omit tones; pinyin/Chinese remain useful for navigation. */
(()=>{
const names={
'Beijing':'bej-dzing','Běijīng':'bej-dzing','Pekin':'pe-kin','Pekinie':'pe-ki-nie','Pekinu':'pe-ki-nu',
'Shanghai':'szang-haj','Shànghǎi':'szang-haj','Szanghaj':'szang-haj','Szanghaju':'szang-haju','Szanghajem':'szang-hajem',
'Chengdu':'czeng-du','Chéngdū':'czeng-du','Chongqing':'czung-ćing','Chóngqìng':'czung-ćing',
'Huangshan':'hłang-szan','Huángshān':'hłang-szan','Huangshanu':'hłang-szanu','Zhangjiajie':'dżang-dzia-dzie','Zhāngjiājiè':'dżang-dzia-dzie',
'Pudong':'pu-dung','Pǔdōng':'pu-dung','Pudongu':'pu-dungu','Puxi':'pu-si','Pǔxī':'pu-si','Lujiazui':'lu-dzia-dzłej','Lùjiāzuǐ':'lu-dzia-dzłej',
'Huangpu':'hłang-pu','Huángpǔ':'hłang-pu','Jangcy':'jang-cy','Yangtze':'jang-cy','Chang Jiang':'czang dziang',
'Sichuan':'sy-czuan','Sìchuān':'sy-czuan','Syczuan':'sy-czuan','Syczuanie':'sy-czuanie','Syczuanu':'sy-czuanu',
'Guangdong':'głang-dung','Guǎngdōng':'głang-dung','Guangzhou':'głang-dżou','Guǎngzhōu':'głang-dżou','Shenzhen':'szen-dżen','Shēnzhèn':'szen-dżen',
'Anhui':'an-hłej','Ānhuī':'an-hłej','Huizhou':'hłej-dżou','Huīzhōu':'hłej-dżou','Hongcun':'hung-cun','Hóngcūn':'hung-cun','Tunxi':'tun-si','Túnxī':'tun-si',
'Hunan':'hu-nan','Húnán':'hu-nan','Hubei':'hu-bej','Húběi':'hu-bej','Henan':'he-nan','Hebei':'he-bej',
'Changsha':'czang-sza','Chángshā':'czang-sza','Jiangxi':'dziang-si','Jiāngxī':'dziang-si','Zunyi':'dzun-i','Zūnyì':'dzun-i',
'Yan’an':'jen-an',"Yan'an":'jen-an','Yán’ān':'jen-an',"Xi'an":'si-an','Xi’an':'si-an','Xī’ān':'si-an','Xian':'si-an',
'Nanjing':'nan-dzing','Nánjīng':'nan-dzing','Nankin':'nan-kin','Nankinu':'nan-kinu','Nankinie':'nan-kinie','Hangzhou':'hang-dżou','Hángzhōu':'hang-dżou',
'Fujian':'fu-dzien','Fújiàn':'fu-dzien','Zhejiang':'dże-dziang','Zhèjiāng':'dże-dziang','Jiangsu':'dziang-su','Shandong':'szan-dung','Yunnan':'jun-nan','Yúnnán':'jun-nan',
'Xinjiang':'sin-dziang','Tianjin':'tien-dzin','Wuhan':'łu-han','Taipei':'taj-pej','Tajpej':'taj-pej','Tajwan':'taj-łan','Tajwanie':'taj-łanie','Tajwanu':'taj-łanu',
'Mao Zedong':'mao dze-dung','Máo Zédōng':'mao dze-dung','Mao Zedonga':'mao dze-dunga','Mao Zedongiem':'mao dze-dungiem','Mao':'mao',
'Deng Xiaoping':'deng siao-ping','Dèng Xiǎopíng':'deng siao-ping','Deng Xiaopinga':'deng siao-pinga','Deng':'deng',
'Xi Jinping':'si dzin-ping','Xí Jìnpíng':'si dzin-ping','Xi Jinpinga':'si dzin-pinga','Zhou Enlai':'dżou en-laj','Zhou Enlaia':'dżou en-laja',
'Czang Kaj-szek':'czang kaj-szek','Czang Kaj-szeka':'czang kaj-szeka','Chiang Kai-shek':'czang kaj-szek','Jiang Jieshi':'dziang dzie-szy',
'Sun Yat-sen':'sun jat-sen','Sun Jat-sen':'sun jat-sen','Sun Jat-sena':'sun jat-sena','Sun Zhongshan':'sun dżung-szan',
'Cixi':'cy-si','Cíxǐ':'cy-si','Puyi':'pu-i','Pǔyí':'pu-i','Pu Yi':'pu-i','Qin Shi Huang':'ćin szy hłang','Qin Shi Huanga':'ćin szy hłanga',
'Hongwu':'hung-łu','Yongle':'jung-le','Qianlong':'ćien-lung','Kangxi':'kang-si','Guangxu':'głang-siu','Zeng Liansong':'dzeng lien-sung',
'Laozi':'lao-dzy','Lao Zi':'lao-dzy','Kongzi':'kung-dzy','Kongfuzi':'kung-fu-dzy','Konfucjusz':'kon-fu-cjusz','Konfucjusza':'kon-fu-cjusza',
'Zhuangzi':'dżłang-dzy','Mencjusz':'men-cjusz','Mengzi':'meng-dzy','Cai Lun':'caj lun','Cai Luna':'caj luna','Bi Sheng':'bi szeng',
'Qu Yuan':'ćiu juen','Qu Yuana':'ćiu juena','Chang’e':'czang-e',"Chang'e":'czang-e','Hou Yi':'hou i','Meng Jiangnü':'meng dziang-niü',
'Guanyin':'głan-in','Guānyīn':'głan-in','Maitreya':'maj-tre-ja','Mile':'mi-le','Wenshu':'łen-szu','Puxian':'pu-sien','Dizang':'di-dzang',
'Sheyan':'sze-jen','Maobi':'mao-bi','Jingxian':'dzing-sien','Xiucai':'siou-caj','Juren':'dziu-ren','Jinshi':'dzin-szy','guan':'głan','Shengzhi':'szeng-dży','Tangyue':'tang-jüe','Shexian':'sze-sien','Huishang':'hłej-szang','Nanhu':'nan-hu','Yuezhao':'jüe-dżao','Chengzhi Tang':'czeng-dży tang','Wang':'łang',
'Jingdezhen':'dzing-de-dżen','Jǐngdézhèn':'dzing-de-dżen','Longjing':'lung-dzing','Lóngjǐng':'lung-dzing','Biluochun':'bi-luo-czun',
'Tieguanyin':'tie-głan-in','Da Hong Pao':'da hung pao','Dahongpao':'da-hung-pao','Pu’er':'pu-er',"Pu'er":'pu-er','pu-erh':'pu-er','oolong':'łu-lung','wulong':'łu-lung',
'Huangshan Maofeng':'hłang-szan mao-feng','Qimen':'ći-men','Keemun':'ći-men','Taiping Houkui':'taj-ping hou-kłej','Liu’an Guapian':'liou-an gła-pien',
'Chunjie':'czun-dzie','Chūnjié':'czun-dzie','chunyun':'czun-jün','Qingming':'ćing-ming','Qīngmíng':'ćing-ming','Duanwu':'dłan-łu','Duānwǔ':'dłan-łu','Zhongqiu':'dżung-ćiou','Zhōngqiū':'dżung-ćiou',
'feng shui':'feng szłej','fēng shuǐ':'feng szłej','yin i yang':'in i jang','yin':'in','yang':'jang','qi':'ći','dao':'dao','wuwei':'łu-łej','Daodejing':'dao-de-dzing',
'guanxi':'głan-si','Guānxì':'głan-si','mianzi':'mien-dzy','Miànzi':'mien-dzy','hukou':'hu-kou','hùkǒu':'hu-kou','gaokao':'gao-kao','gāokǎo':'gao-kao','keju':'ke-dziu','kējǔ':'ke-dziu',
'paifang':'paj-fang','páifāng':'paj-fang','pailou':'paj-lou','páilóu':'paj-lou','wenfang sibao':'łen-fang sy-bao','wénfáng sìbǎo':'łen-fang sy-bao','xuanzhi':'süen-dży','xuan':'süen','hui mo':'hłej mo','huimo':'hłej-mo',
'Shanmen':'szan-men','Tianwang Dian':'tien-łang dien','Daxiong Baodian':'da-siung bao-dien','Yaoshi Dian':'jao-szy dien','Tian’anmen':'tien-an-men',"Tian'anmen":'tien-an-men','Wumen':'łu-men','Jingshan':'dzing-szan',
'Han':'han','Tang':'tang','Song':'sung','Yuan':'juen','Ming':'ming','Qing':'ćing','Qin':'ćin','Sui':'słej','Shang':'szang','Zhou':'dżou',
'Kuomintang':'kuo-min-tang','Guomindang':'gło-min-dang','Yidai Yilu':'i-daj i-lu','Yi Dai Yi Lu':'i daj i lu','tang ping':'tang ping','tǎng píng':'tang ping','neijuan':'nej-dżüen',
'DiDi':'di-di','Didi':'di-di','Meituan':'mej-tłan','Ele.me':'e-le-me','Alipay':'ali-pej','WeChat':'łi-czat','Weixin':'łej-sin','Zhifubao':'dży-fu-bao','BYD':'bi-łaj-di',
'putonghua':'pu-tung-hła','pinyin':'pin-in','ni hao':'ni hał','xiexie':'sie-sie','mala':'ma-la','dim sum':'dim sam',
'feicui':'fej-cłej','hetian yu':'he-tien jü','Hetian':'he-tien','yu':'jü','yuanbao':'juen-bao','lanweilou':'lan-łej-lou','long':'lung',
'wu nian jihua':'łu nien dzi-hła','wunian guihua':'łu-nien głej-hła','Shaoshan':'szao-szan','Jinggangshan':'dzing-gang-szan','Ruijin':'żłej-dzin','Luding':'lu-ding','Dadu':'da-du','Jinsha':'dzin-sza','Lushan':'lu-szan'
};
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp('(?<![\\p{L}\\p{N}])('+Object.keys(names).sort((a,b)=>b.length-a.length).map(escape).join('|')+')(?![\\p{L}\\p{N}])','giu');
const lookup=Object.fromEntries(Object.entries(names).map(([k,v])=>[k.toLowerCase(),v]));
function text(raw){
 // Bracket contents and HTML attributes are never rewritten.
 return raw.split(/(<[^>]*>|\[[^\]]*\])/g).map((part,i,parts)=>{
  if(part.startsWith('<')||part.startsWith('['))return part;
  return part.replace(pattern,(name,_,offset)=>{
   const rest=part.slice(offset+name.length);
   if(/^\s*$/.test(rest)&&parts[i+1]?.startsWith('['))return name;
   return name+' ['+lookup[name.toLowerCase()]+']';
  });
 }).join('');
}
function clean(raw){
 // Standardize existing phonetics following recognized names when recognizable as sound guides.
 const standardized=raw.split(/(<[^>]*>|\[[^\]]*\])/g).map(part=>part.startsWith('<')||part.startsWith('[')?part:part.replace(new RegExp('(?<![\\p{L}])('+Object.keys(names).sort((a,b)=>b.length-a.length).map(escape).join('|')+')\\s*\\(([^()<>]{1,45})\\)','giu'),(all,name,gloss)=>{
  if(/\d|czyli|ang\.|dynastia|obecnie|dawniej|wymowa/i.test(gloss))return all;
  if(/^[\p{L}’' -]+$/u.test(gloss)&& (gloss.includes('-')||gloss.toLowerCase()===lookup[name.toLowerCase()]))return name+' ['+lookup[name.toLowerCase()]+']';
  return all;
 })).join('');
 return text(standardized);
}
for(const key of ['WANFANG_TOPICS','WANFANG_IMPORTED_TOPICS','WANFANG_EXPANDED_TOPICS'])for(const t of window[key]||[]){
 for(const field of ['title','summary','pronunciation'])if(t[field])t[field]=clean(t[field]);
 for(const s of t.sections||[]){s.title=clean(s.title||'');s.content=clean(s.content||'');}
 t.facts=(t.facts||[]).map(f=>typeof f==='string'?clean(f):f);
 for(const s of t.guideScripts||[])for(const field of ['title','content','text'])if(typeof s[field]==='string')s[field]=clean(s[field]);
}
for(const c of window.WANFANG_CATALOG||[]){c.title=clean(c.title);c.outline=(c.outline||[]).map(clean);}
window.WANFANG_PRONUNCIATION={names,format:clean};
})();
