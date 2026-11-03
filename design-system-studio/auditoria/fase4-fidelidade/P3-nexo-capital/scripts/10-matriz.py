# Matriz de fidelidade P3: dados por requisito × site, cálculo das notas e geração das tabelas Markdown.
# Fontes das medições: out-01..08 (JSON nesta pasta) e capturas em ../capturas/.
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
S = ['dev-1', 'dev-2', 'dev-3']
DIM = {'A': 'Arquitetura', 'D': 'Desktop', 'M': 'Celular', 'P': 'Paleta e tokens', 'C': 'Componentes', 'I': 'Interações'}

# (id, requisito, escolha no Studio, instrução exportada, {site: (resultado, nota, origem)})
# origem: '—' = sem desvio; 'E' = interpretação aceitável de conflito; A/B/C/D = origem do desvio (nota < 100)
R = []
def r(i, req, esc, ins, d1, d2, d3):
    R.append(dict(id=i, req=req, esc=esc, ins=ins, res={'dev-1': d1, 'dev-2': d2, 'dev-3': d3}))

ALL = lambda txt, o='—': (txt, 100, o)

# ---------------- A ----------------
r('A1', 'Fluxo "Apenas login"', 'Etapa 2: "Apenas login"', 'l.17 "abre direto na tela de entrar"',
  ALL('1ª tela = login (hash vazio)'), ALL('1ª tela = login (#/login)'), ALL('1ª tela = login (hash vazio)'))
r('A2', 'Sem cadastro', 'Cadastro: nenhum (sem controle "confirmar sem cadastro")', 'l.18 "Cadastro: nenhum" × l.635 pendência (K13)',
  ALL('Sem cadastro nem link (NOTES 24)', 'E'), ALL('Sem cadastro nem link (NOTES 41)', 'E'), ALL('Sem cadastro nem link (NOTES 2)', 'E'))
r('A3', 'Login válido → dashboard', 'Apenas login + layout', 'l.17, l.516',
  ALL('#/painel/visao-geral'), ALL('#/painel/visao-geral'), ALL('#/app/painel/visao-geral'))
r('A4', '"Sair" volta ao login', 'Menu de perfil (header/sidebar)', 'l.179, l.227',
  ALL('Volta a #/entrar com aviso'), ALL('Volta a #/login, "Sessão encerrada com segurança."'), ALL('Volta a #/login'))
r('A5', 'HTML+CSS+JS sem build', 'Tecnologia "HTML + CSS + JavaScript"', 'l.13',
  ALL('Scripts clássicos, file:// ok, 0 erros de console; Inter via Google Fonts'), ALL('Sem build, Inter embutida, 0 erros'), ALL('Sem build, 0 erros; Inter via Google Fonts'))
r('A6', 'Domínio financeiro no conteúdo [julgamento de design]', 'Só texto livre (objetivo/funcionalidades); sem configuração de domínio', 'l.10–12; exemplos não financeiros l.205, 376, 452 (K12)',
  ALL('KPIs Receita líquida/Despesas operacionais/Resultado líquido; pagamentos; CSV'), ALL('KPIs Receita líquida/Despesas/Saldo em caixa; faturas, cobranças'),
  ('KPIs Receita líquida/Clientes ativos/Ticket médio (comerciais); atividades mistas', 50, 'A'))
r('A7', 'Troca desktop/celular em 768 px', 'Sidebar integral (desktop) × Drawer (mobile)', 'l.96, 136 × l.144 (K5)',
  ALL('<768 drawer; ≥768 trilho', 'E'), ALL('<768 drawer; ≥768 trilho', 'E'), ALL('<768 drawer; ≥768 trilho', 'E'))
r('A8', 'Mesmos destinos no desktop e no celular', '—', 'l.145',
  ALL('Drawer = sidebar + 4 abas como subitens de Painel', 'E'), ALL('Idem', 'E'), ALL('Idem (grupo "Painel analítico")', 'E'))

# ---------------- D ----------------
r('D1', 'Sidebar integral (topo à base, sem margem/raio/sombra)', 'Sidebar integral clássica', 'l.67, 99, 624',
  ALL('x0 y0 h900, raio 0, sem sombra'), ALL('x0 y0 h900, raio 0, sem sombra'), ALL('x0 y0 h900, raio 0, sem sombra'))
r('D2', 'Largura da sidebar 252/264 px', 'Layout 252 · Sóbria 264', 'l.66–67 × l.203 (K3)',
  ALL('252 px', 'E'), ALL('252 px', 'E'), ALL('252 px', 'E'))
r('D3', 'Sidebar fixa com rolagem interna', 'Layout (comportamento)', 'l.88, 228',
  ALL('sticky 100dvh; nav com overflow-y:auto (testado 1280×560)'), ALL('sticky; nav rola (1280×560)'),
  ('Fica fixa, mas a lista não rola: em janelas < ~720 px de altura a lista invade o rodapé (texto sobreposto, 1280×560)', 75, 'C'))
r('D4', 'Altura do header 56/64 px', 'Layout ≈64 · Painel Analítico 56', 'l.66, 71 × l.156 (K1)',
  ALL('64 px (56 no celular)', 'E'), ALL('64 px (56 no celular)', 'E'), ALL('64 px (56 no celular)', 'E'))
r('D5', 'Header só sobre a coluna principal', 'Layout + prévia integrada', 'l.71 × l.156 "full width" (K2)',
  ALL('header x=252 = borda da sidebar', 'E'), ALL('x=252', 'E'), ALL('x=252', 'E'))
r('D6', 'Topo da sidebar alinhado ao header', 'Layout', 'l.68',
  ALL('bloco do topo 64 px = header', 'E'), ALL('64 px = header', 'E'), ALL('linha do logo 64 px = header (seletor de unidade abaixo)', 'E'))
r('D7', 'Header sticky', 'Layout + header "fixo"', 'l.89, 178',
  ALL('top 0 após rolar 700 px'), ALL('top 0 após rolar'), ALL('top 0 (conteúdo rola na coluna)'))
r('D8', 'Header A: abas, período, Exportar, avatar 32', 'Painel Analítico · Composição A', 'l.158–160, 166 (K11, K19)',
  ALL('4 abas + período + Exportar + avatar (e busca/notificações)', 'E'), ALL('4 abas + período + Exportar + avatar (e busca/notificações)', 'E'),
  ('4 abas + busca + notificações + avatar; período e Exportar foram para o cabeçalho da página', 50, 'B'))
r('D9', 'Fundo do header navBg #0f1f4d + borda 1 px', 'Painel Analítico', 'l.157',
  ALL('#0f1f4d; borda #e6e6e6 (sombra interna 1 px)'), ALL('#0f1f4d; borda 1 px #e6e6e6'), ALL('#0f1f4d; borda 1 px #313e66 (não é o token border)'))
r('D10', 'Fundo da sidebar bgAlt #eff1f3', 'Sóbria Corporativa (prévia clara)', 'l.204 × l.242 (K9)',
  ALL('#eff1f3'), ALL('#eff1f3'), ('#0f1f4d (navBg): sidebar marinho, contrária à prévia aprovada', 50, 'B'))
r('D11', 'Itens/grupos da sidebar (caixa alta, ícone, 36–44 px, indicador)', 'Sóbria A + layout', 'l.69, 206–207, 225 (K17)',
  ALL('grupo 12 px caixa alta 650 textMuted; itens 40 px, ícone 20; barra 3 px primary + fundo selected', 'E'),
  ALL('idem; barra 3 px primary', 'E'), ALL('grupo 11 px navText; itens 40 px; barra 3 px accent (não primary)', 'E'))
r('D12', 'Rodapé: perfil com avatar, nome, cargo, ⋯', 'Sóbria A', 'l.70, 208',
  ALL('"Ana Ribeiro · Controller financeira" + ⋯ + engrenagem', 'E'), ALL('"Ana Souza · Analista financeira" + engrenagem + ⋯', 'E'),
  ALL('"Camila Ribeiro · Gerente de Controla…" (cortado) + ⋯ + Configurações', 'E'))
r('D13', 'Seletor de unidade no topo', 'Composição A "Unidade no topo"', 'l.208, 214 × l.68 (K10)',
  ALL('botão único logo + "Matriz — São Paulo"', 'E'), ALL('botão único logo + unidade', 'E'), ALL('logo numa linha + seletor de unidade abaixo', 'E'))
r('D14', 'Padding 24–32 px; cartões ≥ 280 px', 'Layout', 'l.72',
  ALL('padding 32; KPIs ≥ 283 px'), ALL('padding 32; KPIs ≥ 283 px'), ALL('padding 32; KPIs ≥ 311 px'))
r('D15', '768–1023: trilho de 72 px', 'Layout (telas menores)', 'l.95, 232 × l.184 (K6)',
  ALL('72 px em 768/820/1000', 'E'), ALL('72 px', 'E'), ALL('72 px', 'E'))
r('D16', '1024–1279: sidebar ≈220 px', 'Layout', 'l.94 × l.231 (K4)',
  ALL('220 px (1024–1279), 252 ≥ 1280', 'E'), ALL('220/252', 'E'), ALL('220/252', 'E'))

# ---------------- M ----------------
r('M1', 'Topbar ≈56 px com ☰ à esquerda', 'Drawer pela esquerda', 'l.110, 123',
  ALL('56 px, ☰ 44×44 em x=10'), ALL('56 px, ☰ em x=8'), ALL('56 px, ☰ em x=8'))
r('M2', 'Drawer ≈280 px (máx. 85 %)', 'Drawer pela esquerda', 'l.111, 124, 134',
  ALL('280 (390) / 272 (320)'), ALL('280 / 272'), ALL('280 / 272'))
r('M3', 'Drawer pela esquerda, altura total, sobreposto, scrim', 'Drawer pela esquerda', 'l.107, 111, 140',
  ALL('x0, h=844, conteúdo parado, scrim 55 %'), ALL('idem'), ALL('idem (scrim 50 %)'))
r('M4', 'Conteúdo do drawer (cabeçalho, ícone+rótulo, 48 px, secundário+Sair)', 'Drawer pela esquerda', 'l.112, 125',
  ALL('completo; itens 48 px'), ALL('completo; itens 48 px; Sair fixo no rodapé'),
  ('completo, mas cabeçalhos de grupo 41 px, "Configurações" 40 px e duplicado (elemento only-desktop visível)', 75, 'C'))
r('M5', 'Sem bottom navigation', 'Mobile "inferior: none"', 'l.117 × l.237 (K7)',
  ALL('ausente', 'E'), ALL('ausente', 'E'), ALL('ausente', 'E'))
r('M6', 'Topbar com safe-area-inset-top', '—', 'l.110, 600',
  ALL('presente (shell.css:525)'), ALL('presente (shell.css:774)'), ALL('presente (shell.css:112)'))
r('M7', 'Tabela: rolagem local ou cartões', 'Tabelas Compact Pro', 'l.424–426 (K14)',
  ALL('cartões (< 768), sem overflow', 'E'), ALL('cartões + <select> de ordenação', 'E'), ALL('cartões (< 640)', 'E'))
r('M8', 'Gráfico no celular (≥200 px, legenda abaixo, menos rótulos, nada cortado)', 'Gráficos Compact Pro', 'l.499, 614',
  ALL('220 px; legenda abaixo; 12→4 rótulos; nada cortado'), ('224 px; legenda abaixo; 6 rótulos (= desktop, não reduz); nada cortado', 75, 'C'),
  ('191 px (< 200); legenda abaixo; 6→3 rótulos; nada cortado', 75, 'C'))
r('M9', 'KPIs 4→2→1; gráfico e atividades empilham', 'Dashboard (3 KPIs)', 'l.572 × l.527 (K18)',
  ALL('1 col (390), 2+1 (768); empilhados', 'E'), ALL('idem', 'E'), ALL('idem', 'E'))
r('M10', 'Alvos de toque ≥ 44×44', 'Regras gerais', 'l.174, 595, 615',
  ('50/56 = 89 % (falham: link da marca 129×28; checkboxes 28×44)', 89, 'C'), ALL('45/45 = 100 %'),
  ('39/49 = 80 % (avatar 32×32; checkboxes 20×20; grupos do drawer 41 px; ⋯ 36×36)', 80, 'C'))
r('M11', 'Sem overflow horizontal 320–1920', 'Regras gerais', 'l.592',
  ALL('14/14 larguras (login e painel)'), ALL('14/14'), ALL('14/14'))
r('M12', 'Campos 16 px / 48 px no celular', 'Login', 'l.47, 596',
  ALL('16 px / 48 px'), ALL('16 px / 48 px'), ALL('16 px / 48 px'))
r('M13', 'Login no celular: header 56 px, cartão na largura', 'Login', 'l.46',
  ALL('56 px; cartão 358 px (margem 16)', 'E'), ALL('56 px; cartão 390 px sem borda'), ALL('56 px; cartão 358 px (margem 16)', 'E'))
r('M14', 'Sem texto cortado/sobreposição (320–480)', 'Regras gerais', 'l.593–594',
  ALL('nenhum caso (toast pós-login cobre o rodapé por ~3 s)'), ALL('nenhum caso'), ALL('nenhum caso no celular'))

# ---------------- P ----------------
r('P1', 'primary #1d4ed8 na ação principal', 'Azul Institucional', 'l.255',
  ALL('SSO #1d4ed8'), ALL('SSO #1d4ed8'), ALL('SSO #1d4ed8'))
r('P2', 'bg #f8fafc', 'Azul Institucional', 'l.264', ALL('#f8fafc'), ALL('#f8fafc'), ALL('#f8fafc'))
r('P3', 'surface #ffffff nos cartões', 'Azul Institucional', 'l.266', ALL('#ffffff'), ALL('#ffffff'), ALL('#ffffff'))
r('P4', 'text #0f172a', 'Azul Institucional', 'l.268', ALL('#0f172a'), ALL('#0f172a'), ALL('#0f172a'))
r('P5', 'border 1 px #e6e6e6', 'Contornada', 'l.272, 386', ALL('1 px #e6e6e6'), ALL('1 px #e6e6e6'), ALL('1 px #e6e6e6'))
r('P6', 'textMuted #686d7a', 'Azul Institucional', 'l.269', ALL('#686d7a'), ALL('#686d7a'), ALL('#686d7a'))
r('P7', 'success #117e39 / error #dc2626', 'Azul Institucional', 'l.282, 286, 351',
  ALL('deltas e erros com os tokens exatos'), ('erro de campo/resumo e deltas em tons derivados (#bd2427, #116e37); token só em bordas', 50, 'D'),
  ('erro de campo #dc2626; deltas sem cor; badges com texto derivado (#0f6a30)', 50, 'D'))
r('P8', 'Tokens de navegação nos papéis certos', 'Azul Institucional', 'l.293–296',
  ALL('header navBg/navText; aba ativa bg'), ALL('idem'), ALL('header e sidebar navBg; ativo navActive'))
r('P9', 'Fonte Inter', 'Inter + Inter (padrão)', 'l.300–316',
  ALL('Inter (Google Fonts, fallback do sistema)', 'E'), ALL('Inter embutida (woff2)'), ALL('Inter (Google Fonts)', 'E'))
r('P10', 'Base 15 px / componentes 13 px', 'Inter 15 · Compact Pro 13', 'l.314 × l.393 (K8)',
  ALL('body 15, tabela 13', 'E'), ALL('body 15, tabela 13', 'E'), ALL('body 15, tabela 13', 'E'))
r('P11', 'Peso de títulos 650/640', 'Inter 650 · Compact Pro 640', 'l.315, 390',
  ALL('h1 650; valores 640', 'E'), ALL('650', 'E'), ALL('650', 'E'))
r('P12', 'Raios 4–12 px', 'Médios 8 · Compact Pro 4/6', 'l.335 × l.384–385 (K8)',
  ALL('cartões 6, controles 4–8, login 12', 'E'), ALL('cartões 6, controles 4, login 8/12', 'E'), ALL('cartões 6, controles 4, login 8/6', 'E'))
r('P13', 'Sem sombra em superfícies de conteúdo', 'Sem sombra', 'l.330, 338, 623',
  ALL('nenhuma (só header rolado e flutuantes)', 'E'), ALL('nenhuma', 'E'), ALL('nenhuma', 'E'))
r('P14', 'Tokens centralizados em variáveis', 'Regras G', 'l.628',
  ALL('36/36 tokens em :root; 0 hex soltos'), ALL('36/36; 1 hex solto (meta theme-color)'), ALL('35/36; 3 hex soltos'))
r('P15', 'Densidade (linhas 28–52 px)', 'Confortável × compacta (K8)', 'l.326 × l.379',
  ALL('linhas 38–39 px; controles 30', 'E'), ALL('linhas 38', 'E'), ALL('linhas 39', 'E'))
r('P16', 'Foco 2–3 px em focusRing', 'Estados visuais', 'l.349, 416, 420',
  ALL('conteúdo 2 px #1d4ed8; header: anel branco + #1d4ed8', 'E'), ('conteúdo 2 px #1d4ed8; header: anel só branco', 75, 'D'),
  ('conteúdo 2 px #1d4ed8 + halo 35 %; header/sidebar: anel branco', 75, 'D'))
r('P17', 'Contraste AA nos pares principais', 'Regras G', 'l.629',
  ALL('textMuted/bgAlt 4,57; navText/navBg 10,1; branco/primary 6,7'), ALL('idem'),
  ('marca "Nexo Capital" #0f172a sobre navBg = 1,13:1 (invisível) no topo da sidebar', 50, 'C'))

# ---------------- C ----------------
r('C1', 'Login "Acesso corporativo" (8 elementos)', 'Login: Acesso corporativo', 'l.25–31',
  ALL('8/8'), ALL('8/8'), ALL('8/8'))
r('C2', 'Formulário 360–400 px; inputs ≈44', 'Login', 'l.34–35',
  ALL('form 334 (cartão 400); inputs 44'), ALL('form 374 (cartão 440); 44'), ALL('form 350 (cartão 400); 44'))
r('C3', 'Labels e atributos dos campos', 'Login', 'l.38',
  ALL('for/id, email, inputmode, username, current-password'), ALL('idem'), ALL('idem'))
r('C4', 'Dashboard: cabeçalho → KPIs → gráfico 2/3 + atividades 1/3', 'Dashboard financeiro (Compact Pro)', 'l.515 (K19)',
  ALL('título + período aplicado + Atualizar; razão 0,667'), ('título + descrição, sem período/ações no cabeçalho da página (ficam no header); razão 0,667', 87.5, 'B'),
  ALL('título + período + Exportar; razão 0,667'))
r('C5', '3 KPIs', 'Quantidade de KPIs: 3', 'l.527 (K18)', ALL('3'), ALL('3'), ALL('3'))
r('C6', 'Tabela semântica completa (8 sub-itens)', 'Tabelas Compact Pro', 'l.364–386',
  ALL('8/8 (th scope, badges, tabular-nums à direita, checkbox, ações, cabeçalho #f5f5f5, sem zebra)'), ALL('8/8'), ALL('8/8'))
r('C7', 'Gráfico de barras 2 séries, legenda, grade, alternativa', 'Gráficos Compact Pro', 'l.440–458 (K15)',
  ALL('7/7; série 2 #0c91cd', 'E'), ALL('7/7; série 2 #0c91cd', 'E'), ALL('7/7; série 2 #0c91cd', 'E'))
r('C8', 'Abas encaixadas', 'Painel Analítico', 'l.159, 177',
  ALL('ativa bg #f8fafc + bordas 1 px'), ALL('idem'), ALL('idem'))
r('C9', 'Estados carregando/vazio/erro', 'Tabelas', 'l.366, 627',
  ALL('3/3 (Configurações → Demonstração ou ?estado=)'), ALL('3/3 (?estado= no hash)'), ALL('3/3 (skeleton; Fornecedores vazio; Auditoria com erro)', 'E'))
r('C10', 'nav "Principal", nav "Menu lateral", aria-current', 'Header + Sidebar', 'l.194, 243, 245',
  ALL('3/3'), ALL('3/3'), ALL('3/3'))

# ---------------- I ----------------
r('I1', 'Validação no envio e ao sair do campo', 'Login', 'l.40',
  ALL('envio, blur, aria-invalid/describedby, resumo role=alert'), ('igual, mas o blur é ignorado quando o Tab vai para "Esqueci minha senha"', 87.5, 'C'),
  ALL('completo (valida também campo vazio atravessado)'))
r('I2', 'Erro genérico de credenciais', 'Login', 'l.41', ALL('"E-mail ou senha incorretos"'), ALL('idem'), ALL('idem'))
r('I3', 'Mostrar/ocultar senha', 'Login', 'l.39', ALL('type, aria-label, aria-pressed'), ALL('idem'), ALL('idem'))
r('I4', 'Esqueci minha senha → mensagem neutra', 'Login', 'l.42', ALL('"Se o e-mail existir, enviaremos um link…"'), ALL('idem'), ALL('idem'))
r('I5', '"Entrando…" desabilitado', 'Login', 'l.43', ALL('sim'), ALL('sim + aria-busy'), ALL('sim + aria-busy'))
r('I6', 'SSO demonstrativo', 'Login', 'l.25, 54 (K16)', ALL('"Redirecionando para o provedor…" e entra', 'E'), ALL('"Redirecionando…"', 'E'), ALL('"Redirecionando…"', 'E'))
r('I7', 'Drawer: foco, trap, inert, 3 formas de fechar, retorno, scroll lock', 'Drawer pela esquerda', 'l.128–129',
  ALL('6/6'), ALL('6/6'), ALL('6/6'))
r('I8', 'Destino do drawer navega e fecha', 'Drawer', 'l.131', ALL('sim'), ALL('sim'), ALL('sim'))
r('I9', 'Animação 200–250 ms + reduced-motion', 'Drawer', 'l.130', ALL('220 ms ease-out; reduced-motion'), ALL('230 ms'), ALL('240 ms'))
r('I10', 'Trilho expande em sobreposição (scrim, Esc, fora)', 'Layout 768–1023', 'l.95, 232', ALL('4/4'), ALL('4/4'), ALL('4/4'))
r('I11', 'Menu do perfil (avatar)', 'Painel Analítico', 'l.179', ALL('nome, e-mail, 4 itens; Esc e fora'), ALL('idem'), ALL('idem'))
r('I12', 'Seletor de unidade (✓, criar)', 'Sóbria A', 'l.226', ALL('✓ + "Criar unidade"', 'E'), ALL('✓ + "Criar espaço"'), ALL('✓ + "Criar unidade"', 'E'))
r('I13', 'Menu ⋯ abre para cima', 'Sóbria A', 'l.227', ALL('Meu perfil, Preferências, Sair'), ALL('idem'), ALL('idem'))
r('I14', 'Período atualiza todos os blocos', 'Dashboard', 'l.562', ALL('KPIs, gráfico, atividades e tabela recarregam com skeleton'), ALL('idem'), ALL('idem (taxas não escalam, documentado)'))
r('I15', 'Abas trocam o sub-relatório', 'Painel Analítico', 'l.159', ALL('h1 e KPIs mudam'), ALL('idem'), ALL('idem'))
r('I16', 'Ordenação com aria-sort', 'Tabelas', 'l.414', ALL('sim'), ALL('sim'), ALL('sim'))
r('I17', 'Selecionar todos / indeterminado', 'Tabelas', 'l.414', ALL('sim (+ ações em lote)'), ALL('sim'), ALL('sim'))
r('I18', 'Tooltip do gráfico', 'Gráficos', 'l.489', ALL('sim'), ALL('sim'), ALL('sim'))
r('I19', 'Legenda liga/desliga séries', 'Gráficos', 'l.489', ALL('sim, aria-pressed'), ALL('sim'), ALL('sim'))
r('I20', 'Sombra do header após rolar', 'Painel Analítico', 'l.178', ALL('sim'), ALL('sim'), ALL('sim'))
r('I21', 'Exportar com ação', 'Painel Analítico', 'l.160', ALL('baixa CSV'), ALL('baixa CSV'), ALL('aviso "Exportação simulada"'))
r('I22', 'Hover e foco distintos na navegação', 'Layout/Sóbria', 'l.90, 225', ALL('hover #f4f4f4; foco 2 px'), ALL('hover branco; foco 2 px', 'E'), ALL('hover navActive; foco branco'))

def score(site, dims=None):
    xs = [x['res'][site][1] for x in R if dims is None or x['id'][0] in dims]
    return round(sum(xs) / len(xs), 1), len(xs)

out = {}
for s in S:
    out[s] = {DIM[k]: score(s, k) for k in DIM}
    out[s]['Geral'] = score(s)
counts = {s: {} for s in S}
for s in S:
    for x in R:
        o = x['res'][s][2]
        counts[s][o] = counts[s].get(o, 0) + 1
json.dump({'notas': out, 'origens': counts}, open(os.path.join(HERE, 'out-10-notas.json'), 'w'), ensure_ascii=False, indent=1)

def md_matrix(site):
    lines = ['| Req. | Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |', '|---|---|---|---|---|---|---|']
    for x in R:
        res, n, o = x['res'][site]
        if res.lower().startswith('idem'):  # "idem" remete ao texto do dev-1; expande para a tabela ficar autônoma
            rest = res[4:].strip()
            res = 'igual ao dev-1: ' + x['res']['dev-1'][0] + ((' ' + rest) if rest else '')
        nn = ('%g' % n) + ' %'
        lines.append(f"| {x['id']} | {x['req']} | {x['esc']} | {x['ins']} | {res} | {nn} | {o} |")
    return '\n'.join(lines)

def md_scores():
    head = '| Dimensão (nº de requisitos) | ' + ' | '.join(S) + ' |'
    lines = [head, '|---|---|---|---|']
    for k in list(DIM.values()) + ['Geral']:
        n = out['dev-1'][k][1]
        lines.append(f"| {k} ({n}) | " + ' | '.join(('%.1f' % out[s][k][0]).replace('.', ',') + ' %' for s in S) + ' |')
    return '\n'.join(lines)

def md_counts():
    keys = ['—', 'E', 'A', 'B', 'C', 'D']
    lines = ['| Site | sem desvio | E (interpretação aceitável) | A | B | C | D |', '|---|---|---|---|---|---|---|']
    for s in S:
        lines.append(f"| {s} | " + ' | '.join(str(counts[s].get(k, 0)) for k in keys) + ' |')
    lines.append('| **Total** | ' + ' | '.join(str(sum(counts[s].get(k, 0) for s in S)) for k in keys) + ' |')
    return '\n'.join(lines)

tpl = open(os.path.join(HERE, 'fidelidade-template.md'), encoding='utf-8').read()
tpl = tpl.replace('{{NOTAS}}', md_scores()).replace('{{CONTAGEM}}', md_counts())
for s in S:
    tpl = tpl.replace('{{MATRIZ_' + s + '}}', md_matrix(s))
open(os.path.join(HERE, '..', 'fidelidade.md'), 'w', encoding='utf-8').write(tpl)
print(json.dumps(out, ensure_ascii=False, indent=1))
print(json.dumps(counts, ensure_ascii=False))
