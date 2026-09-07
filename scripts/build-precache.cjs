const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const files=['index.html','manifest.webmanifest'];
function walk(dir){for(const name of fs.readdirSync(path.join(root,dir))){const rel=dir+'/'+name,st=fs.statSync(path.join(root,rel));if(st.isDirectory())walk(rel);else files.push(rel);}}
walk('assets');walk('data');
const hash=crypto.createHash('sha256');for(const name of files.sort())hash.update(name).update(fs.readFileSync(path.join(root,name)));
fs.writeFileSync(path.join(root,'precache.js'),'self.WANFANG_CACHE_VERSION='+JSON.stringify(hash.digest('hex').slice(0,16))+';\nself.WANFANG_CACHE_FILES='+JSON.stringify(files,null,2)+';\n');
console.log('Offline files:',files.length);
