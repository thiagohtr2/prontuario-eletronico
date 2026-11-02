const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const BASE = path.resolve(__dirname, '..');
const LOG = path.join(BASE,'scripts','timeline.json');
function loadLog(){ try{return JSON.parse(fs.readFileSync(LOG,'utf8'))}catch(e){return []} }
function saveLog(l){ fs.writeFileSync(LOG, JSON.stringify(l,null,1)); }
async function open(){
  const ctx = await chromium.launchPersistentContext(path.join(BASE,'perfil'), { viewport:{width:1440,height:900}, acceptDownloads:true });
  const page = ctx.pages()[0] || await ctx.newPage();
  page._logs=[];
  page.on('console', m=>{ if(m.type()==='error'||m.type()==='warning') page._logs.push(m.type()+': '+m.text())});
  page.on('pageerror', e=>page._logs.push('PAGEERROR: '+e.message));
  return {ctx,page};
}
async function snap(page,name,full=false){ await page.screenshot({path: path.join(BASE,'capturas',name+'.png'), fullPage:full}); }
async function info(page, opts={}){
  const text = await page.evaluate(()=>{ const m=document.querySelector('main')||document.body; return m.innerText; });
  const ctrls = await page.evaluate((onlyMain)=>{
    const root = onlyMain ? (document.querySelector('main')||document.body) : document.body;
    const els=[...root.querySelectorAll('button,a,input,select,textarea,[role=button],[role=tab],[role=radio],[role=option],[role=checkbox],[role=switch]')];
    return els.filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0}).map(e=>{const r=e.getBoundingClientRect();const st=[e.disabled?'DISABLED':'',e.getAttribute('aria-pressed')==='true'?'PRESSED':'',e.getAttribute('aria-checked')==='true'||e.checked?'CHECKED':'',e.getAttribute('aria-selected')==='true'?'SELECTED':'',e.getAttribute('aria-current')?'CURRENT':''].filter(Boolean).join(',');return `${e.tagName}${e.type&&e.tagName!=='BUTTON'?'['+e.type+']':''}${e.getAttribute('role')?'{'+e.getAttribute('role')+'}':''} "${(e.innerText||e.value||e.getAttribute('aria-label')||e.placeholder||e.title||'').trim().slice(0,70).replace(/\s*\n\s*/g,' | ')}" @${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)} ${st}`});
  }, opts.onlyMain!==false);
  const h = await page.evaluate(()=>{const m=document.querySelector('main');return {doc:document.documentElement.scrollHeight, main: m? m.scrollHeight:0}});
  return {url:page.url(), text, ctrls, h};
}
function record(entry){ const l=loadLog(); entry.n=l.length+1; l.push(entry); saveLog(l); }
module.exports={open,snap,info,record,BASE,path,fs};
