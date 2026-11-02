// Linha do tempo do Diego: ms medidos (Date.now() nos scripts s01..s23) + blocos de leitura (3 s cada)
const steps = [
 // [id, ação, msMedido, blocos, cliques, decisaoReal, recAceita, tela, extraS(scroll/digitação)]
 [0,'Abre a home (carregamento)',858,2,0,0,0,'Home',0],
 [1,'Clica "Master Prompt" (header)',401,3,1,1,0,'Central de Prompts',0],
 [2,'Clica pendência "Defina o tipo de projeto."',614,2,1,0,0,'Objetivo',0],
 [3,'Escolhe "Aplicativo ou SaaS"',424,1,1,1,0,'Objetivo',0],
 [4,'Clica "Usar esta sugestão"',507,0,1,0,1,'Objetivo',0],
 [5,'Clica "Continuar: Entrada"',587,2,1,0,0,'Entrada',0],
 [6,'Clica "Continuar: Desktop" desabilitado (sem efeito)',300,1,1,0,0,'Entrada',0],
 [7,'Clica aba "Landing page"',789,3,1,0,0,'Entrada/Landing',2],
 [8,'Escolhe 1º modelo "Aurora Flow"',484,1,1,1,0,'Entrada/Landing',0],
 [9,'Clica aba "Login"',668,2,1,0,0,'Entrada/Login',0],
 [10,'Escolhe 1º modelo "Clássico central"',450,0,1,1,0,'Entrada/Login',0],
 [11,'Clica aba "Cadastro"',456,2,1,0,0,'Entrada/Cadastro',0],
 [12,'Escolhe 1º modelo "Cadastro na mesma tela"',488,0,1,1,0,'Entrada/Cadastro',0],
 [13,'Clica "Continuar: Desktop"',712,3,1,0,0,'Desktop',2],
 [14,'Escolhe "Sidebar integral clássica" (Sugerido)',659,0,1,0,1,'Desktop',0],
 [15,'Clica "Continuar: Mobile"',803,3,1,0,0,'Mobile',2],
 [16,'Escolhe "Bottom Navigation clássica" (Sugerido)',641,0,1,0,1,'Mobile',0],
 [17,'Clica "Continuar: Revisão"',608,2,1,0,0,'Revisão',0],
 [18,'Clica "Aprovar esqueleto" ignorando aviso do nome',730,2,1,0,0,'Prévia',0],
 [19,'Clica "Continuar: Cores"',681,2,1,0,0,'Cores',0],
 [20,'Clica "Continuar: Navegação" (aceita paleta padrão)',1071,1,1,0,1,'Navegação',0],
 [21,'Clica "Continuar: Componentes" (etapa opcional)',864,1,1,0,1,'Componentes',0],
 [22,'Clica "Continuar: Entrega" (etapa opcional)',730,2,1,0,1,'Entrega',0],
 [23,'Clica pendência "Dê um nome ao projeto."',687,1,1,0,0,'Objetivo',2],
 [24,'Clica no campo e digita "Vai Já Entregas"',633,0,1,0,0,'Objetivo',4],
 [25,'Clica "Master Prompt" (header)',665,1,1,0,0,'Central de Prompts',0],
 [26,'Clica "Copiar Master Prompt"',548,0,1,0,0,'Central de Prompts',0],
];
let cum=0, cumReal=0; const rows=[];
for(const s of steps){ const t = s[2]/1000 + s[3]*3; cum+=t; const real = t + (s[4]?1:0) + s[8]; cumReal+=real;
  rows.push({n:s[0],acao:s[1],medido_ms:s[2],blocos:s[3],passo_s:+t.toFixed(1),acum_s:+cum.toFixed(1),acum_realista_s:+cumReal.toFixed(1)}); }
console.table(rows);
const sum=(i)=>steps.reduce((a,s)=>a+s[i],0);
console.log({medido_total_s:(sum(2)/1000).toFixed(1), blocos:sum(3), leitura_s:sum(3)*3, cliques:sum(4), decisoesReais:sum(5), recAceitas:sum(6), extras_s:sum(8),
 total_metodo_s:cum.toFixed(1), total_realista_s:cumReal.toFixed(1), telasUnicas:new Set(steps.map(s=>s[7].split('/')[0])).size});
require('fs').writeFileSync(__dirname+'/timeline.json', JSON.stringify(rows,null,1));
