const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/app.js'),'utf8');
const showView=source.slice(source.indexOf('  function showView('),source.indexOf('  function routeHash('));
const input={value:''},main={focus(){context.document.activeElement=this;}},view={classList:{remove(){},add(){}}};
const context={views:{home:view,compendium:view,topic:view},document:{activeElement:input},location:{hash:'#topics'},$:(id)=>id==='#searchInput'?input:main,$$:()=>[]};
vm.createContext(context);vm.runInContext(showView,context);
for(const letter of 'swieta droga'){
  assert.equal(context.document.activeElement,input,'Input lost focus before next letter');
  input.value+=letter;context.showView('compendium');
}
assert.equal(input.value,'swieta droga');assert.equal(context.document.activeElement,input);
context.location.hash='#topic/pekin';context.showView('topic');
assert.equal(context.document.activeElement,main,'Normal navigation still focuses main content');
context.document.activeElement={};context.location.hash='#topics';context.showView('compendium');
assert.equal(context.document.activeElement,main,'Normal library navigation still focuses main content');
console.log('PASS: whole-word live search retains focus; normal navigation remains accessible');
