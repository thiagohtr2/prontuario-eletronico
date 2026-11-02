const { chromium } = require('playwright');
const W = '/home/user/prontuario-eletronico/design-system-studio/auditoria/fase2-projetos/P2-verde-vivo';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + W + '/exportados/verde-vivo-ficha.html');
  await p.waitForTimeout(800);
  console.log('title', await p.title(), 'errors', errs);
  await p.screenshot({ path: W + '/capturas/ficha-html-exportada-aberta.png' });
  await b.close();
})();
