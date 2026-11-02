// Gera js/icons.js a partir do pacote lucide-static (ISC). Uso: node tools/build-icons.js <pasta-icons-lucide>
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
const names = ['search','leaf','shopping-bag','heart','user-round','menu','x','chevron-down','chevron-right','chevron-left','arrow-right','sliders-horizontal','map-pin','sun','droplets','house','sprout','flower-2','scissors','palette','package','truck','trash-2','plus','minus','check','info','circle-alert','loader-circle','history','trending-up','shield-check','gift','paw-print','log-out','settings','circle-help','cloud-sun','shovel','sparkles','clock','tag','ruler','badge-check','mail','arrow-up-right','plant-pot','clover','tree-palm','flower','tree-deciduous'];
let out = '';
for (const n of names) {
  const f = path.join(dir, n + '.svg');
  if (!fs.existsSync(f)) { console.error('faltando', n); continue; }
  const s = fs.readFileSync(f, 'utf8');
  const inner = s.replace(/<!--[\s\S]*?-->/g, '').replace(/<svg[\s\S]*?>/, '').replace(/<\/svg>\s*$/, '').replace(/\s+/g, ' ').trim();
  out += `<symbol id="i-${n}" viewBox="0 0 24 24">${inner}</symbol>`;
}
const js = `/* Sprite de ícones (lucide-static, licença ISC). Gerado por tools/build-icons.js */
(function () {
  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${out.replace(/\\/g,'\\\\').replace(/'/g, "\\'")}</svg>';
  document.body.insertAdjacentHTML('afterbegin', sprite);
})();
`;
fs.writeFileSync(path.join(__dirname, '..', 'js', 'icons.js'), js);
console.log('ok', names.length);
