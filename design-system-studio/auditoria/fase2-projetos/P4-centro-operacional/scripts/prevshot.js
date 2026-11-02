// usa state.name, state.vh (altura viewport temporária), state.sel (nome acessível da prévia)
await page.waitForTimeout(4000);
await page.setViewportSize({width: state.vw||1440, height: state.vh||1200});
const g = page.getByRole('img',{name: state.sel});
await g.evaluate(el => el.scrollIntoView({block:'center'})); await page.waitForTimeout(500);
const b = await g.boundingBox();
await page.screenshot({path: W+'/capturas/'+state.name+'.png', clip:{x:b.x-4, y:Math.max(0,b.y-4), width:b.width+8, height:b.height+8}});
await page.setViewportSize({width:1440, height:900});
return b;
