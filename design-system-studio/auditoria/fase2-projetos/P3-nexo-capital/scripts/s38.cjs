const { open, W } = require('./lib.cjs');
(async () => {
  const { ctx, page } = await open();
  page.setDefaultTimeout(8000);
  page.on('download', d => console.log('DOWNLOAD EVENT', d.suggestedFilename()));
  await page.goto('http://127.0.0.1:4300/#/guiado/identidade', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const b = page.getByRole('button', { name: 'CSS dos tokens' });
  console.log('count', await b.count(), await b.evaluate(e => e.outerHTML.slice(0, 300)));
  await b.scrollIntoViewIfNeeded(); await page.screenshot({ path: W + '/scripts/tmp-43a.png' }); await b.click({ timeout: 5000 }).catch(e => console.log('CLICK FAIL', e.message.split('\n').slice(0,12).join(' || ')));
  await page.waitForTimeout(1500);
  const st = page.getByRole('status');
  console.log('status:', (await st.allInnerTexts()).join(' / '));
  console.log('dialogs', await page.getByRole('dialog').count());
  await page.screenshot({ path: W + '/scripts/tmp-43.png' });
  await ctx.close();
})();
