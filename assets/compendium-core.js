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
    return {version:1,trips:[...trips.values()],activeTrip:trips.has(incoming.activeTrip)?incoming.activeTrip:current.activeTrip || '',progress,bindings};
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
