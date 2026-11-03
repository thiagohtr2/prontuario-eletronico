const lum = h => { const c = [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255).map(v => v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4)); return .2126*c[0]+.7152*c[1]+.0722*c[2]; };
const cr = (a,b) => { const [x,y] = [lum(a),lum(b)].sort((p,q)=>q-p); return (x+.05)/(y+.05); };
const pairs = [
 ['text on bg','#18181b','#ffffff'],['textMuted on bg','#707072','#ffffff'],['textMuted on bgAlt','#707072','#f6f6f6'],['textMuted on hover','#707072','#f4f4f4'],['textMuted on surfaceAlt','#707072','#f5f5f5'],['textMuted on active (#ebebeb)','#707072','#ebebeb'],
 ['placeholder on bg','#8c8c8d','#ffffff'],['navText on navBg','#4b4b4d','#ffffff'],['navText on hover','#4b4b4d','#f4f4f4'],['navActiveText on navActive','#18181b','#e3e3e4'],
 ['success on bg','#117e39','#ffffff'],['success on hover','#117e39','#f4f4f4'],['error on bg','#dc2626','#ffffff'],['error on hover','#dc2626','#f4f4f4'],['text on errorBg','#18181b','#fbe5e5'],['text on successBg','#18181b','#e3f4e9'],['text on warningBg','#18181b','#faefe1'],['text on infoBg','#18181b','#e5ecfd'],
 ['onPrimary on primary','#ffffff','#18181b'],['textMuted on selected (#e3e3e4)','#707072','#e3e3e4'],['text on selected','#18181b','#e3e3e4'],['accent on bg (link/focus)','#2563eb','#ffffff'],['icon on bg','#525254','#ffffff'],['textMuted on primarySoft','#707072','#e3e3e4'],
];
pairs.forEach(([n,f,b]) => { const r = cr(f,b); console.log((r >= 4.5 ? 'ok  ' : 'LOW ') + r.toFixed(2).padStart(5) + '  ' + n); });
