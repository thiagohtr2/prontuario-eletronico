// args: state.name
await page.setViewportSize({width:1440, height:1000});
const g = page.getByRole('group',{name:/Prévia do celular/});
await g.evaluate(el => el.scrollIntoView({block:'center'})); await page.waitForTimeout(400);
const b = await g.boundingBox();
await page.screenshot({path: W+'/capturas/'+state.name+'.png', clip:{x:b.x-10, y:b.y-10, width:b.width+20, height:b.height+20}});
await page.setViewportSize({width:1440, height:900});
return b;
