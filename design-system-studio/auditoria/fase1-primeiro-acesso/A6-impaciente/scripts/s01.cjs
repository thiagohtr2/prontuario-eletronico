const { chromium } = require('playwright');
const path = require('path');
const BASE = path.resolve(__dirname, '..');
(async () => {
  const t0 = Date.now();
  const ctx = await chromium.launchPersistentContext(path.join(BASE,'perfil'), { viewport:{width:1440,height:900}, acceptDownloads:true });
  const page = ctx.pages()[0] || await ctx.newPage();
  const logs=[];
  page.on('console', m=>logs.push(m.type()+': '+m.text()));
  page.on('pageerror', e=>logs.push('PAGEERROR: '+e.message));
  await page.goto('http://127.0.0.1:4300/', {waitUntil:'networkidle'});
  const tLoad = Date.now()-t0;
  await page.screenshot({path: path.join(BASE,'capturas','01-home.png')});
  await page.screenshot({path: path.join(BASE,'capturas','01-home-full.png'), fullPage:true});
  const title = await page.title();
  const url = page.url();
  const text = await page.evaluate(()=>document.body.innerText);
  const ctrls = await page.evaluate(()=>{
    const els=[...document.querySelectorAll('button,a,input,select,textarea,[role=button],[role=tab],[role=link]')];
    return els.filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0}).map(e=>{const r=e.getBoundingClientRect();return `${e.tagName}${e.type?'['+e.type+']':''} "${(e.innerText||e.value||e.getAttribute('aria-label')||e.placeholder||'').trim().slice(0,60).replace(/\n/g,' ')}" @${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}${e.disabled?' DISABLED':''}`});
  });
  const h = await page.evaluate(()=>document.documentElement.scrollHeight);
  console.log(JSON.stringify({tLoad,title,url,scrollHeight:h},null,1));
  console.log('---TEXT---\n'+text);
  console.log('---CTRLS---\n'+ctrls.join('\n'));
  console.log('---LOGS---\n'+logs.join('\n'));
  await ctx.close();
})();
