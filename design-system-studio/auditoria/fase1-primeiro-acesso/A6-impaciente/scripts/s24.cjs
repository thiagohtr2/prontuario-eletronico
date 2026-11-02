// Auditor-only check (separate clean profile): is there a discoverable shortcut (template / quick start)?
const { chromium } = require('playwright');
const L=require('./lib.cjs');
(async()=>{
  const dir = L.path.join(L.BASE,'perfil-verificacao');
  const ctx = await chromium.launchPersistentContext(dir,{viewport:{width:1440,height:900}});
  const page = ctx.pages()[0]||await ctx.newPage();
  await page.goto('http://127.0.0.1:4300/',{waitUntil:'networkidle'});
  await page.keyboard.press('Control+k'); await page.waitForTimeout(400);
  await page.keyboard.type('rápido'); await page.waitForTimeout(400);
  await L.snap(page,'24-busca-rapido');
  const r1 = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog]')].map(d=>d.innerText).join('\n').slice(0,800));
  console.log('BUSCA rápido:\n',r1);
  await page.keyboard.press('Control+a'); await page.keyboard.type('template'); await page.waitForTimeout(400);
  const r2 = await page.evaluate(()=>[...document.querySelectorAll('[role=dialog]')].map(d=>d.innerText).join('\n').slice(0,800));
  console.log('BUSCA template:\n',r2);
  await page.keyboard.press('Escape');
  await page.goto('http://127.0.0.1:4300/#/templates',{waitUntil:'networkidle'}).catch(()=>{});
  await page.getByRole('link',{name:'Template Studio'}).click(); await page.waitForTimeout(600);
  await L.snap(page,'24b-template-studio');
  const t = await page.evaluate(()=>document.querySelector('main').innerText.slice(0,1500));
  console.log('TEMPLATE STUDIO:\n',t, page.url());
  await ctx.close();
})();
