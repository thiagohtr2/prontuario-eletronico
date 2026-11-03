"""Gera as matrizes de fidelidade por site (markdown) a partir das medições consolidadas.
Confere as notas com medicoes/s15-notas.json. Saída: caminho passado como argumento."""
import json, sys, pathlib

HERE = pathlib.Path(__file__).resolve().parent
notas = json.loads((HERE.parent / 'medicoes' / 's15-notas.json').read_text())['notas']

# (id, requisito, escolha no Studio, instrução exportada, [(resultado, %, origem) x3])
R = [
# ---------------- ARQUITETURA
('ARQ-1', 'Fluxo "Apenas login"', 'Fluxo "Apenas login"', 'l.15: abre direto na tela de entrar', [
 ('Abre em `#/entrar` (login)', 100, '—'), ('Abre na raiz já com o login', 100, '—'), ('Abre em `#/entrar` (login)', 100, '—')]),
('ARQ-2', 'Cadastro em rota própria, ida e volta', '"Página própria de cadastro"', 'l.66 rota /cadastro; l.28, l.69', [
 ('`#/cadastro`; "Criar conta" ↔ "Já tem conta? Entrar"', 100, 'E (hash por causa do file://)'), ('Idem', 100, 'E'), ('Idem', 100, 'E')]),
('ARQ-3', 'Fluxo de recuperação de senha', 'Login Clássico central', 'l.43', [
 ('`#/recuperar-senha` em 2 etapas (e-mail; código + nova senha)', 100, '—'), ('`#/recuperar`', 100, '—'), ('`#/recuperar`', 100, '—')]),
('ARQ-4', 'Primeira tela do app = painel "Visão geral"', 'Prévia integrada: o app abre em "Visão geral", com "Início" ativo', 'Ausente (o MP só dá o título do Dashboard, l.721)', [
 ('Abre em "Início" (saudação, tarefas, agenda); o painel fica em `#/painel`', 50, 'A'), ('Abre em "Painel / Visão geral"', 100, '—'), ('Abre em "Início" (saudação); o painel fica em `#/app/painel`', 50, 'A')]),
('ARQ-5', 'Destinos e grupos da sidebar', 'Clássica Integral · A', 'l.251', [
 ('10/10 itens, 3 grupos, contadores 12 e 3', 100, '—'), ('10/10, 3 grupos, 12 e 3', 100, '—'), ('10/10, 3 grupos, 12 e 3', 100, '—')]),
('ARQ-6', 'Troca de arquitetura em 768 px', 'Desktop × mobile independentes', 'l.139, l.179 (× l.187, C6)', [
 ('767: bottom nav · 768: trilho', 100, '—'), ('Idem', 100, '—'), ('Idem', 100, '—')]),
('ARQ-7', '768–1023 px: trilho de 72 px + sobreposição', 'Sidebar integral clássica', 'l.138, l.280', [
 ('72 px; ☰ no topo do trilho abre sidebar de 252 px fixa com scrim', 100, '—'), ('72 px; "Expandir menu" abre 252 px com scrim', 100, '—'), ('72 px; ☰ no header abre 252 px com scrim', 100, '—')]),
('ARQ-8', '1024–1279 px: ≈220 px', 'Sidebar integral clássica', 'l.137 (× l.279: 248 px)', [
 ('220 px', 100, '—'), ('220 px', 100, '—'), ('220 px', 100, '—')]),
('ARQ-9', 'Marca "Atlas Workspace" no lugar de "Tucano"/"Ipê"', 'Nome do projeto', 'l.201 "substitua pela marca real"', [
 ('Só na sidebar (desktop) e na topbar (celular)', 100, '—'), ('Só na sidebar', 100, '—'), ('Só na sidebar', 100, '—')]),
('ARQ-10', 'Mesmos destinos no desktop e no celular', '4 destinos na prévia × 10 na sidebar', 'l.188 × l.150 ("4 itens")', [
 ('Início, Painel, Projetos + "Mais" (página com todos os outros destinos)', 100, '—'), ('Painel, Projetos, Tarefas + "Mais" (folha com o restante)', 100, '—'),
 ('Início, Projetos, "Equipe" (= Pessoas), "Ajustes" (= Configurações). Painel, Tarefas, Calendário, Mensagens, Relatórios e Ajuda ficam sem acesso pela barra', 50, 'B')]),
# ---------------- DESKTOP
('DSK-1', 'Sidebar integral do topo à base', 'Sidebar integral clássica', 'l.106, l.110, l.142', [
 ('x 0, y 0, 252×900, raio 0, sem sombra, sticky', 100, '—'), ('Idem', 100, '—'), ('Idem', 100, '—')]),
('DSK-2', 'Largura ≈252/248 px', 'Idem (o Studio mostra as duas medidas)', 'l.109 × l.249 (C4)', [
 ('252 px', 100, 'E'), ('252 px', 100, 'E'), ('252 px', 100, 'E')]),
('DSK-3', 'Header só sobre a coluna principal', 'Layout (o arranjo "Sidebar inteira" não persiste)', 'l.114 × l.199 "full width" (C1)', [
 ('Header em x 252, largura 1188', 100, '—'), ('Idem', 100, '—'), ('Idem', 100, '—')]),
('DSK-4', 'Altura do header 64/56 px', 'Layout + Trilha de Contexto', 'l.109 × l.199', [
 ('64 px', 100, '—'), ('64 px', 100, '—'), ('64 px', 100, '—')]),
('DSK-5', 'Header sticky + borda 1 px `border`', 'Trilha de Contexto', 'l.132, l.200, l.222', [
 ('top 0 depois de rolar; 1 px #e6e6e6', 100, '—'), ('Idem', 100, '—'), ('Idem', 100, '—')]),
('DSK-6', 'Topo da sidebar alinhado ao header, com logo + nome', 'Layout', 'l.111', [
 ('64 = 64 px; símbolo + "Atlas Workspace"', 100, '—'), ('Idem', 100, '—'), ('Idem', 100, '—')]),
('DSK-7', 'Títulos de grupo, ícones e altura dos itens', 'Clássica Integral', 'l.112, l.252–253 (11 px × mínimo de 12 px, l.357)', [
 ('Títulos 12 px/650/0,08em/caixa alta/#707072; itens 40 px; ícones 20 px, traço 1,5', 100, 'E (12 px resolve D)'), ('Idem (12 px; 40 px)', 100, 'E'), ('Títulos 11 px/650/0,08em/#707072; itens 36 px; ícones 20 px', 100, '—')]),
('DSK-8', 'Item ativo', 'Clássica Integral', 'l.112, l.272', [
 ('Fundo #e3e3e4, texto #18181b, raio 8 px, barra lateral de 3 px, aria-current', 100, '—'), ('Idem', 100, '—'), ('Idem', 100, '—')]),
('DSK-9', 'Rodapé: perfil + atalho de configurações', 'Composição A', 'l.113, l.254', [
 ('Avatar, nome, cargo, engrenagem e ⋯', 100, '—'), ('Idem', 100, '—'), ('Avatar, nome, cargo e ⋯; sem atalho de configurações (só "Preferências" dentro do menu)', 75, 'C')]),
('DSK-10', 'Header: trilha, sino com contador, avatar de 32 px', 'Trilha de Contexto · A', 'l.203–204, l.210', [
 ('Trilha dinâmica (3 níveis na página do projeto), último nível 600 + aria-current; sino; avatar de 40 px', 92, 'C (avatar)'), ('Trilha de 3 níveis; sino; avatar de 32 px', 100, '—'),
 ('Trilha só "Grupo / Página" (ex.: "Geral / Painel"); sino; avatar de 40 px', 83, 'B (trilha) + C (avatar)')]),
('DSK-11', 'Sidebar fixa; a página rola só no conteúdo', 'Sidebar integral', 'l.131, l.276', [
 ('Fica em top 0 em todas as páginas testadas', 100, '—'),
 ('No Painel o documento fica 120 px maior que o shell; no fim da rolagem a sidebar sobe 120 px (o logo some e sobra uma faixa branca)', 50, 'C'),
 ('Mesmo defeito no Painel: a sidebar sobe 152 px', 50, 'C')]),
('DSK-12', 'Padding do conteúdo 24–32 px; nenhum cartão < 280 px', 'Layout', 'l.115', [
 ('32 px; menor cartão 359 px', 100, '—'), ('24/32 px; 359 px', 100, '—'), ('32 px; 374 px', 100, '—')]),
('DSK-13', '[J] Semelhança com a prévia aprovada (computador)', 'Prévia integrada / Live Site Preview', '—', [
 ('Mesma estrutura. Linguagem Swiss (cantos retos, réguas de tinta) no lugar dos cartões arredondados da prévia integrada', 75, 'D'), ('Idem, com marcadores quadrados azuis', 75, 'D'), ('Idem. A variação do KPI quebra (seta acima do número)', 70, 'D')]),
# ---------------- CELULAR
('CEL-1', 'Bottom nav fixa ≈64 px + safe area', 'Bottom Navigation clássica', 'l.154, l.166–167', [
 ('fixed, 390×65, base 844', 100, '—'), ('fixed, 390×65', 100, '—'), ('fixed, 390×64', 100, '—')]),
('CEL-2', '4 itens iguais, ícone 24, rótulo 12', 'Idem', 'l.150, l.154', [
 ('4 × 87,5 px; 24 px; 12 px', 100, '—'), ('4 × 97,5 px; 24; 12', 100, '—'), ('4 × 97,5 px; 24; 12', 100, '—')]),
('CEL-3', 'Destinos Início, Buscar, Agenda, Perfil', 'Prévia da Bottom Navigation clássica', 'Ausente (l.150 só diz "4 destinos rotulados")', [
 ('Início, Painel, Projetos, Mais (1/4)', 25, 'A'), ('Painel, Projetos, Tarefas, Mais (0/4)', 0, 'A'), ('Início, Projetos, Equipe, Ajustes (1/4)', 25, 'A')]),
('CEL-4', 'Item ativo: aria-current + indicador além da cor', 'Idem', 'l.171', [
 ('aria-current; pílula #e3e3e4; peso 650', 100, '—'), ('Idem', 100, '—'), ('Idem, com ícone preenchido', 100, '—')]),
('CEL-5', 'Topbar ≈56 px, título + uma ação', 'Idem (prévia: "Início" + sino)', 'l.153 (× l.230: logo, avatar, ☰)', [
 ('56 px: logo, título e avatar (menu do perfil com ponto de notificação)', 100, 'E'), ('56 px: título + sino', 100, '—'), ('56 px: título + sino', 100, '—')]),
('CEL-6', 'Sem sidebar/drawer/☰ no celular', 'lateral: none; sobreposição: none', 'l.139, l.159–161, l.286 (× l.230, l.281: C2)', [
 ('Nenhum', 100, '—'), ('Nenhum', 100, '—'), ('Nenhum', 100, '—')]),
('CEL-7', 'Conteúdo não fica atrás da barra', 'Idem', 'l.155', [
 ('Último conteúdo em y 741 < 779', 100, '—'), ('695 < 779', 100, '—'), ('725 < 780', 100, '—')]),
('CEL-8', 'Alvos da barra ≥ 48×48', 'Idem', 'l.168, l.183', [
 ('87,5×64', 100, '—'), ('97,5×64', 100, '—'), ('97,5×63', 100, '—')]),
('CEL-9', 'Safe areas + viewport-fit=cover', 'Idem', 'l.153–154, l.794', [
 ('top e bottom; cover', 100, '—'), ('top e bottom; cover', 100, '—'), ('top e bottom; cover', 100, '—')]),
('CEL-10', 'Horizontal: barra ≈48 px, barras fixas ≤ 25 %', 'Idem', 'l.178, l.795', [
 ('667×375: 44 + 45 px = 23,7 %; 740×360: 24,7 %', 100, '—'), ('44 + 49 px = 24,8 %; 360 px: 13,6 %', 100, '—'), ('48 + 48 px = 25,6 % e 26,7 %', 75, 'C')]),
('CEL-11', 'Login no celular', 'Clássico central', 'l.47–48', [
 ('Sem cartão, 20 px de margem, inputs 16 px/48 px', 100, '—'), ('Idem (fundo branco)', 100, '—'), ('Cartão branco sem borda a 20 px + padding 20 px; inputs 16 px/48 px', 100, 'E (l.36 "paddingCartao 20 px")')]),
('CEL-12', 'Cadastro no celular', 'Página própria', 'l.92, l.790', [
 ('1 coluna; inputs 16/48; termos com área 350×51', 100, '—'), ('1 coluna; 16/48; 350×61', 100, '—'), ('1 coluna; 16/48; 310×44', 100, '—')]),
('CEL-13', '[J] Semelhança com a prévia aprovada do celular', 'Prévia da Bottom Navigation', '—', [
 ('Topbar com logo; 1ª tela de saudação; destinos diferentes', 60, 'A'), ('Título + sino como na prévia; 1ª tela com KPIs; destinos diferentes', 70, 'A'), ('Título + sino; cartões arredondados parecidos com a prévia; destinos diferentes', 65, 'A')]),
# ---------------- PALETA
('PAL-1', '`primary`/`onPrimary` no botão principal', 'Neutro Essencial', 'l.303, l.306', [('#18181b / #ffffff', 100, '—')] * 3),
('PAL-2', '`text` no corpo', 'Idem', 'l.316', [('#18181b', 100, '—')] * 3),
('PAL-3', '`bgAlt` de tela cheia no login', 'Idem', 'l.26, l.313', [('#f6f6f6, 900 px de altura', 100, '—')] * 3),
('PAL-4', '`border` estrutural', 'Idem', 'l.200, l.250', [('1 px #e6e6e6 no header e na sidebar', 100, '—')] * 3),
('PAL-5', '`navActive`/`navActiveText`', 'Idem', 'l.343–344', [('#e3e3e4 / #18181b', 100, '—')] * 3),
('PAL-6', '`textMuted` em textos secundários', 'Idem', 'l.317', [('#707072', 100, '—')] * 3),
('PAL-7', '`accent` só em pequenos marcadores', 'Idem + Swiss', 'l.310, l.417', [
 ('Praticamente não usado', 100, '—'), ('Marcadores quadrados azuis nos sobretítulos e no fim do sparkline', 100, '—'), ('Só como "info" no badge "Em análise"', 100, '—')]),
('PAL-8', 'success na variação positiva; error nas mensagens de erro', 'Idem', 'l.330, l.334, l.637', [
 ('+12,4 % em #117e39; erro do campo em #dc2626', 100, '—'), ('#117e39; erro do campo em #18181b, com a cor de erro na borda e no ícone (NOTES §3, contraste)', 75, 'E'), ('#117e39; erro do campo em #18181b; alerta com errorBg e borda error', 75, 'E')]),
('PAL-9', 'Inter', 'Inter + Inter (padrão)', 'l.348–361', [('Declarada e renderizada (`document.fonts.check` verdadeiro)', 100, '—')] * 3),
('PAL-10', 'Base 15 px (global) / 14 px (Swiss)', 'Padrão + Swiss', 'l.362 × l.440 (C5)', [('Corpo 15 px; células 14 px', 100, 'E (resolve D)')] * 3),
('PAL-11', 'Peso dos títulos 650/750/760', 'Idem', 'l.363 × l.416, l.437', [
 ('Login 650; h1 760', 100, '—'), ('Login 650; h1 760', 100, '—'), ('Login 650; h1 750', 100, '—')]),
('PAL-12', 'Raios coerentes: global fora dos componentes, 0 px nos Swiss', 'Médios (8 px) + Swiss 0 px', 'l.382–384 × l.431–432 (C5)', [
 ('Auth 8/12 px; conteúdo 0 px', 100, 'E'), ('Auth 8 px; conteúdo 0 px', 100, 'E'), ('Auth 8 px; Swiss 0 px, mas os cartões da página Início são arredondados dentro da área de conteúdo', 75, 'D')]),
('PAL-13', 'Sem sombra em superfícies de conteúdo', 'Sem sombra', 'l.378, l.386', [('Todas `none`', 100, '—')] * 3),
('PAL-14', 'Tokens centralizados', 'Regras G', 'l.822', [
 ('44/44 tokens de cor; 0 literais fora dos tokens', 100, '—'), ('44/44; 0 literais', 100, '—'), ('44/44; 1 literal (rgba na sombra do header)', 100, '—')]),
('PAL-15', 'Swiss: borda 1 px na cor do texto', 'Swiss Minimal', 'l.414, l.433, l.452', [('KPI, card e tabela com 1 px #18181b', 100, '—')] * 3),
('PAL-16', 'Ícones de contorno, traço 1,5', 'Contorno', 'l.379, l.443', [('SVG fill none, traço 1,5', 100, '—')] * 3),
('PAL-17', 'Foco visível de 2 px em focusRing', 'Idem', 'l.397, l.464', [
 ('2 px #18181b, afastamento 2 px', 100, '—'), ('2 px #18181b, afastamento 2 px', 100, '—'), ('2 px #18181b, afastamento 0', 100, '—')]),
# ---------------- COMPONENTES
('CMP-1', 'Anatomia do login Clássico central', 'Clássico central', 'l.23–36', [
 ('10/10; cartão de 400 px com padding 32; mais uma linha de credenciais de demonstração', 100, 'E'), ('10/10; 400 px, padding 32; linha de demonstração', 100, 'E'), ('10/10; 400 px, padding 32', 100, '—')]),
('CMP-2', 'Inputs ≈44 px no desktop', 'Idem', 'l.34', [('44 px', 100, '—')] * 3),
('CMP-3', 'Anatomia do cadastro', 'Página própria', 'l.63–87', [('6/6: 5 campos na ordem, termos com links, "Já tem conta? Entrar", requisitos + força', 100, '—')] * 3),
('CMP-4', 'Dashboard: cabeçalho → KPIs → gráfico 2/3 + atividades 1/3', 'Dashboard Swiss', 'l.710', [
 ('4 períodos + "Exportar CSV"; 733/367 px (0,67)', 100, '—'), ('3 períodos + "Atualizar"; 597/364 px (0,62)', 100, '—'), ('3 períodos, sem ação no cabeçalho; 734/368 px (0,67)', 88, 'C')]),
('CMP-5', '3 KPIs', 'Dashboard: "Quantidade de KPIs: 3"', 'l.722', [('3', 100, '—')] * 3),
('CMP-6', 'Anatomia do KPI', 'KPIs Swiss', 'l.636–653', [('6/6: Receita mensal, R$ 48,2 mil, +12,4 %, "vs. mês anterior", ícone, sparkline', 100, '—')] * 3),
('CMP-7', 'KPI no estilo Swiss', 'Idem', 'l.638–657', [
 ('Raio 0, 1 px #18181b, sem sombra, rótulo em caixa alta 0,08em', 100, '—'), ('Idem', 100, '—'), ('Idem (KPIs em faixa com bordas compartilhadas)', 100, '—')]),
('CMP-8', 'Cards Swiss', 'Cards Swiss', 'l.409–444', [
 ('16/9, etiqueta, título, texto, rodapé, raio 0, tinta. Numeração "01" no canto da mídia em vez do sobretítulo "01 —"', 92, 'C'), ('6/6', 100, '—'), ('6/6', 100, '—')]),
('CMP-9', 'Tabela "Pedidos recentes"', 'Tabelas Swiss', 'l.484–519', [('8/8: semântica, colunas, badge, valores à direita (tabular), checkbox, ações, cabeçalho destacado, sem zebra; 4 linhas', 100, '—')] * 3),
('CMP-10', 'Tabela no estilo Swiss', 'Idem', 'l.490–495', [('Raio 0, réguas de 1 px, cabeçalho em caixa alta 0,08em', 100, '—')] * 3),
('CMP-11', 'Formulário Swiss', 'Formulários Swiss', 'l.559–592', [
 ('Sublinhado (inclusive a textarea), 2 colunas, termos, "ENVIAR MENSAGEM"', 100, '—'), ('Idem', 100, '—'), ('Idem, mas a textarea tem caixa completa', 90, 'C')]),
('CMP-12', 'Tipografia Swiss', 'Swiss', 'l.416, l.437–439', [('Títulos 750–760 com letter-spacing negativo; rótulos e botões em caixa alta 0,08em', 100, '—')] * 3),
('CMP-13', 'Popover de notificações + menu de perfil', 'Trilha de Contexto', 'l.203, l.223–224', [
 ('320 px, não lidas, "Ver todas"; perfil com os 4 itens', 100, '—'), ('Idem', 100, '—'), ('320 px; menu com "Preferências" no lugar de "Configurações"', 88, 'C')]),
('CMP-14', 'Estados de carregando, vazio e erro', 'Tabelas + Regras G', 'l.489, l.821', [
 ('Seletor "Simular estado" + `?estado=`', 100, '—'), ('Seletor "Estado da demonstração"', 100, '—'), ('Filtro sem resultado, `?erro=1`, esqueletos no painel', 100, '—')]),
('CMP-15', '[J] Semelhança com as prévias Swiss', 'Capturas 25-*', '—', [
 ('Muito próxima', 85, 'D'), ('Muito próxima', 85, 'D'), ('Próxima; filtro de período preenchido em vez de sublinhado', 80, 'D')]),
]
# ---------------- INTERAÇÕES
INT = [
('INT-1', 'Login vazio: erros por campo + resumo role=alert', 'l.41', ['aria-invalid + describedby; resumo com 2 links', 'Idem', 'Idem (resumo sem links)']),
('INT-2', 'Validação ao sair do campo', 'l.41', ['"Digite um e-mail válido…"', '"Informe um e-mail válido…"', '"Informe um e-mail válido…"']),
('INT-3', 'Erro genérico de credenciais', 'l.42', ['"E-mail ou senha incorretos."'] * 3),
('INT-4', 'Mostrar/ocultar senha', 'l.40', ['Dentro do campo; aria-label alterna; aria-pressed'] * 3),
('INT-5', '"Entrando…" desabilitado', 'l.44', ['Sim', 'Sim (+aria-busy)', 'Sim (+aria-busy)']),
('INT-6', 'Recuperação com mensagem neutra', 'l.43', ['"Se o e-mail existir, enviaremos um link."'] * 3),
('INT-7', 'Comportamentos do cadastro (8)', 'l.80–89', ['8/8'] * 3),
('INT-8', 'Cadastro válido conclui', 'l.63', ['Entra no app', 'Tela neutra "Verifique seu e-mail" (igual para e-mail novo ou existente)', 'Entra no app']),
('INT-9', 'Recolher/expandir 252↔72, tooltip, localStorage', 'l.273', ['4/4 (252 em vez de 248: E)'] * 3),
('INT-10', 'Clique na sidebar marca o ativo', 'l.272', ['Sim'] * 3),
('INT-11', 'Popovers: Esc, clique fora, dentro da viewport', 'l.223–232', ['Sim; no celular viram bottom sheet', 'Sim; sheet no celular', 'Sim; popover cabe a 390 px']),
('INT-12', 'Menu ⋯ abre para cima', 'l.275', ['Sim (Meu perfil, Preferências, Sair)', 'Sim', 'Sim (+Ajuda)']),
('INT-13', 'Sair volta ao login', 'l.224', ['Sim'] * 3),
('INT-14', 'Sombra do header após 8 px', 'l.222', ['Sim'] * 3),
('INT-15', 'Sobreposição do tablet: scrim, Esc, clique fora', 'l.138', ['Sim + foco preso e devolvido'] * 3),
('INT-16', 'Bottom nav: troca, toque no ativo, rolagem por destino', 'l.171–173', ['3/3 (600 px preservados; toque no ativo leva a 0)'] * 3),
('INT-17', 'Tabela: selecionar todos/indeterminado, aria-sort, ações', 'l.506, l.537', ['3/3 (menu de ações)', '3/3 (menu de ações)', '3/3 (botão "Ver" por linha)']),
('INT-18', 'Formulário: validação, resumo com links, "Enviando…"', 'l.610–611', ['4/4', '4/4', 'Resumo sem links para os campos']),
('INT-19', 'Filtro de período atualiza todos os blocos', 'l.757', ['Sim, com esqueletos', 'Sim, com esqueletos', 'Sim, com carregamento por bloco']),
('INT-20', 'Teclado: foco, Esc devolve o foco, foco preso', 'l.287, l.294–295', ['3/3'] * 3),
]
RSP = [
('RSP-1', 'Sem overflow no app (14 larguras × 5 rotas)', 'l.786', [('0 casos', '—')] * 3),
('RSP-2', 'Sem overflow no login/cadastro (14 larguras)', 'l.50, l.94', [('0 casos', '—')] * 3),
('RSP-3', 'Sem texto cortado nem sobreposição', 'l.787–788', [('0 casos', '—'), ('Reticências em "Gerente de produto" (≥ 1024 px) e em "Atlas Workspace" e "Marina Alves" (1024 px): 3 casos', 'C'), ('"Atlas Workspace" cortado a 1024 px: 1 caso', 'C')]),
('RSP-4', 'Alvos ≥ 44×44 a 390 px (links dentro de frases excluídos)', 'l.789', [('28/31 = 90 % (botões de olho 44×40)', 'C'), ('23/27 = 85 % (logo 187×28, rodapé 32 px)', 'C'), ('22/30 = 73 % ("Esqueci minha senha" 23 px, rodapé 36 px, checkboxes de tarefa 40 px)', 'C')]),
('RSP-5', 'Tabela no celular', 'l.547', [('Cartões', '—'), ('Rolagem local com coluna fixa', '—'), ('Cartões', '—')]),
('RSP-6', 'KPIs 3 → 2 → 1 sem corte', 'l.695', [('3/2/1 colunas a 1440/820/390', '—')] * 3),
('RSP-7', 'Inputs ≥ 16 px no celular', 'l.48, l.790', [('16 px no login, no cadastro e no formulário', '—')] * 3),
('RSP-8', '100dvh e prefers-reduced-motion', 'l.796, l.798', [('Ambos', '—')] * 3),
]

def fmt(p):
    return f'{p} %'

out = []
for i, dev in enumerate(['dev-1', 'dev-2', 'dev-3']):
    out.append(f'### Matriz — {dev}\n')
    out.append('| ID | Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |')
    out.append('|---|---|---|---|---|---|---|')
    for rid, req, esc, ins, res in R:
        t, p, o = res[i]
        assert notas[rid][i] == p, (rid, dev, p, notas[rid][i])
        out.append(f'| {rid} | {req} | {esc} | {ins} | {t} | {fmt(p)} | {o} |')
    for rid, req, ins, res in INT:
        p = notas[rid][i]
        o = '—' if p == 100 else 'C'
        out.append(f'| {rid} | {req} | Login/Cadastro/Header/Sidebar/Componentes escolhidos | {ins} | {res[i]} | {fmt(p)} | {o} |')
    for rid, req, ins, res in RSP:
        p = notas[rid][i]
        t, o = res[i]
        out.append(f'| {rid} | {req} | Validação em celular, tablet e desktop | {ins} | {t} | {fmt(p)} | {o} |')
    out.append('')
pathlib.Path(sys.argv[1]).write_text('\n'.join(out))
print('ok', len(R) + len(INT) + len(RSP), 'linhas por site')
