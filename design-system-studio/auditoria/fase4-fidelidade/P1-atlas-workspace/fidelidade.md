# Fidelidade — P1 Atlas Workspace (SaaS profissional)

Auditoria independente da Fase 4. A pergunta é se o que foi **escolhido** no Design System Studio aparece nos três sites que desenvolvedores de IA construíram recebendo **apenas** o Master Prompt (rótulos cegos `dev-1`, `dev-2` e `dev-3`). A rubrica foi escrita antes de abrir os sites: `rubrica.md`. Todos os números saem de medições no DOM (Playwright 1.63/Chromium) registradas em `medicoes/*.json`, de capturas em `capturas/` e de composições lado a lado em `composicoes/`.

## 1. Resumo

| Dimensão (nº de requisitos) | dev-1 | dev-2 | dev-3 |
|---|---|---|---|
| Arquitetura (10) | 95,0 % | **100,0 %** | 90,0 % |
| Desktop (13) | **97,5 %** | 94,2 % | 90,6 % |
| Celular (13) | **91,2 %** | 90,0 % | 89,6 % |
| Paleta e identidade (17) | **100,0 %** | 98,5 % | 97,1 % |
| Componentes (15) | 98,5 % | **99,0 %** | 96,4 % |
| Interações (20) | **100,0 %** | **100,0 %** | 98,8 % |
| Responsividade (8) | **96,9 %** | 90,6 % | 90,6 % |
| **Geral (96)** | **97,4 %** | **96,7 %** | **94,2 %** |

Cada site teve **96 requisitos** testados. Três deles são julgamento de design (`[J]`): DSK-13, CEL-13 e CMP-15. A nota geral é a média simples dos 96.

**Leitura rápida**

- **Muito acertado.** Os três sites reproduzem com exatidão o esqueleto aprovado:
  - "Apenas login";
  - sidebar integral de 252 px do topo à base, com header de 64 px só sobre a coluna principal;
  - trilho de 72 px entre 768 e 1023 px;
  - bottom navigation de 4 itens abaixo de 768 px, sem drawer;
  - os 44 tokens de cor idênticos aos exportados;
  - componentes Swiss Minimal;
  - fluxos de login, cadastro e recuperação completos;
  - nenhum overflow horizontal de 320 a 1920 px.

  O Master Prompt trazia várias contradições (seção 3.3), e os três desenvolvedores resolveram quase todas **do mesmo jeito**, a favor da escolha estrutural.
- **Onde se perde fidelidade.** O que mais pesa é a informação que existe só nas prévias do Studio e não foi exportada (origem A): os 4 destinos da bottom nav e a página inicial do app. Depois vêm defeitos pontuais dos desenvolvedores (origem C): sidebar que deixa de ser fixa no Painel (dev-2 e dev-3) e alvos de toque abaixo de 44 px.
- **Falhas por tipo** (desvios com nota abaixo de 100 % nos 3 sites): A = 8, B = 2, C = 15, D = 7, E = 2. Além disso, 14 problemas "latentes" de origem B no prompt não derrubaram nota, mas obrigaram os desenvolvedores a escolher e geraram interpretações diferentes (seção 7.3).

## 2. Evidências e método

- **O que foi escolhido:** `fase2-projetos/P1-atlas-workspace/escolhas.md`, `relatorio.md`, as capturas aprovadas (`capturas/08-*`, `07-*`, `09-*`, `11-*`, `19-*`, `20-*`, `25-*`, `34-*`, `36-*`) e `exportados/atlas-workspace-master-prompt.md`. Os trechos do prompt aparecem neste relatório como **l.N**, a linha desse arquivo.
- **Prompt recebido pelos desenvolvedores:** o `PROMPT.md` de cada site é byte a byte idêntico ao Master Prompt exportado (conferido com `cmp`).
- **Isolamento:** `fase3-sites/DESVIOS-DE-ISOLAMENTO.md` não registra nenhum desvio para os sites de P1. Também li o `NOTES.md` de cada site, usado para classificar as falhas como B ou D.
- **Ambiente:**
  - sites servidos por `python3 -m http.server` em 4511, 4512 e 4513; encerrei os servidores ao terminar;
  - Chromium sem opções;
  - celular emulado com `isMobile`, `hasTouch` e escala 2;
  - a fonte Inter está instalada no sistema (`fc-list`), então a tipografia renderizada é a Inter real nos três sites.
- **Scripts (`scripts/`):**
  - `s01` exploração;
  - `s02` capturas-base;
  - `s04` shell desktop e faixas de largura;
  - `s04b` sidebar sticky;
  - `s05` e `s05b` celular, toques e horizontal;
  - `s06` login, recuperação e cadastro;
  - `s07` capturas dos componentes;
  - `s08` componentes;
  - `s09`, `s09b` e `s09c` interações do shell, tabela e sparkline;
  - `s10` varredura de 14 larguras;
  - `s11` análise estática de CSS e JS;
  - `s12` composições;
  - `s13` trilha e foco preso;
  - `s14` formulário no celular;
  - `s15` notas;
  - `s16` geração destas matrizes.
- **Referência de fidelidade:**
  - Quando o Master Prompt é explícito, ele é o registro formal da escolha.
  - Quando o prompt se cala e a prévia aprovada mostra algo, vale a prévia, e o desvio recebe origem A se a informação não foi exportada.
  - Quando o prompt e a prévia se contradizem, ou o próprio prompt se contradiz, qualquer leitura coerente recebe nota cheia (D/E).
- **Classificação das origens:**
  - **A:** a informação existe só na prévia ou no Studio e não chegou ao prompt.
  - **B:** está no prompt, mas ambígua, incompleta ou contraditória, e isso causou o desvio.
  - **C:** havia instrução clara e o desenvolvedor não a cumpriu.
  - **D:** conflito ou limitação da especificação, como prévias do Studio que divergem entre si.
  - **E:** diferença aceitável.
- **Limitações:**
  - O teclado virtual e aparelhos iOS e Android reais não foram testados.
  - A contagem de alvos de toque é uma amostra da primeira tela a 390 px no app, no login e no cadastro. Links dentro de frases ficaram de fora (exceção "inline" da WCAG 2.5.8).
  - Não reabri o Studio: as capturas da Fase 2 bastaram como registro do que foi aprovado.

## 3. Cadeia Studio → Master Prompt

### 3.1 Característica do briefing → escolha → prompt

| Característica | Escolhida no Studio? | Chegou ao Master Prompt? | Clareza (trechos) |
|---|---|---|---|
| Login | Sim: "Apenas login" + "Clássico central" | Sim, l.15–57 | **Clara.** Estrutura (l.25–30), medidas (l.33–36), estados (l.39–44). Diverge da prévia em detalhes (3.2). |
| Cadastro | Sim: "Página própria de cadastro" | Sim, l.59–100 | **Clara, com 2 lacunas.** (a) l.87 "indicação dos requisitos de senha" não diz quais são, embora a prévia mostre "8 caracteres, uma maiúscula, um número". (b) l.83 "mensagem neutra que oferece Entrar ou Recuperar senha" × l.100 "sem expor se um e-mail já existe". Os três desenvolvedores resolveram (b) do mesmo jeito. |
| Sidebar integral no desktop | Sim: layout "Sidebar integral clássica" + estilo "Clássica Integral · A" | Sim, l.102–144 e l.242–295 | **Clara na estrutura, contraditória nos números:** 252 × 248 px (l.110 × l.249); 1024–1279: 220 × 248 px (l.137 × l.279); itens 40–44 × 36 px (l.112 × l.252); ícone 20 × 18 px; títulos de 11 px × "nunca < 12 px" (l.253 × l.357). Contém também regras de celular que contrariam a bottom nav (l.281–285, C2). |
| Header minimalista | Aproximada: "Trilha de Contexto · A", pelo filtro "Minimalistas" (não há opção com esse nome) | Sim, l.192–240 | **Contraditória:** "largura total da janela" (l.199) × "não passa por cima da sidebar" (l.114) (C1); logo "Tucano" no header (l.201) × logo no topo da sidebar (l.111) (C3); "3 itens (Projetos, Equipe, Ajustes)" (l.202) × composição A, só com a trilha (l.210) (C7); 56 × 64 px; ☰ abaixo de 768 px (l.230) × bottom nav (C2). |
| Dashboard com indicadores | Aproximada: componentes "Dashboard" + "KPIs e stat cards" (o esqueleto não tem dashboard) | Sim, l.629–772 | **Clara** (3 KPIs, barras, atividades, 2/3 + 1/3). **Lacuna:** o prompt não diz que o painel é a página inicial do app, que a prévia integrada mostra (A). |
| Cards | Sim: "Cards · Swiss Minimal" | Sim, l.405–479 | **Clara no estilo.** O conteúdo de exemplo ("Viagem a Lisboa", ícone Avião) aparece como propriedade aprovada (C8). |
| Tabelas | Sim: "Tabelas · Swiss Minimal" | Sim, l.480–553 | **Clara.** "Estilo do cabeçalho: Destacado" (l.504) não é definido e gerou 2 leituras. |
| Formulários | Sim: "Formulários · Swiss Minimal" | Sim, l.555–627 | **Clara no estilo.** Os campos do "Fale com a gente" não são listados (lacuna aceitável). |
| Navegação inferior no celular | Sim: "Bottom Navigation clássica" | Sim, l.146–183 | **Incompleta:** os 4 destinos da prévia (Início, Buscar, Agenda, Perfil) não foram exportados (A). Também conflita com l.188 "os mesmos destinos nas duas versões" e com as regras de ☰/drawer do header e da sidebar (C2). A regra da horizontal (altura < 500 px, l.178) colide com o corte de 768 px: um celular deitado a 844×390 cai na arquitetura desktop (D). |
| Identidade minimalista | Sim: paleta "Neutro Essencial" (pré-selecionada); tipografia e formas ficaram no padrão | Sim, l.297–399 | **Clara nos tokens** (tabela l.301–346, idêntica ao CSS exportado). **Contraditória com a família Swiss:** raio 8 × 0 px, base 15 × 14 px, títulos 650 × 760 (l.382 × l.431, l.362 × l.440, l.363 × l.437), enquanto l.299 diz que "exceções só onde estiverem explicitamente listadas" (C5). |

**Resultado da cadeia:** 10 de 10 características foram escolhidas, 8 diretamente e 2 por aproximação (header e dashboard). As 10 chegaram ao prompt. Chegaram com clareza: login, cadastro, dashboard, tabelas, formulários, cards e paleta. Chegaram ambíguas ou contraditórias: sidebar (números e celular), header (largura, logo, links, celular), bottom nav (destinos) e identidade × Swiss.

### 3.2 Divergências entre a prévia aprovada e o prompt exportado

| # | Prévia aprovada (captura) | Prompt exportado | Origem | Efeito nos sites |
|---|---|---|---|---|
| P1 | Bottom nav com **Início, Buscar, Agenda, Perfil** (`11-mobile-previa-toque-agenda.png`) | Só "4 destinos rotulados" (l.150) | **A** | 3 conjuntos diferentes, nenhum igual à prévia (CEL-3) |
| P2 | O app abre em **"Visão geral"** com "Início" ativo (`34-…-aplicacao-computador-palco.png`) | Não diz qual é a página inicial | **A** | dev-1 e dev-3 abrem numa página de saudação (ARQ-4) |
| P3 | Prévia integrada com cartões **arredondados (8 px)** e cinza claro: montada na etapa 6, antes da escolha dos componentes, e nunca atualizada | Componentes Swiss com raio 0 e borda de tinta (l.409–444…) | **D** | Os três sites seguem o prompt (Swiss), e por isso o visual difere da prévia integrada (DSK-13, CMP-15) |
| P4 | Tablet: sidebar **completa com rótulos** (`34-…-aplicacao-tablet-palco.png`) | Trilho de 72 px entre 768 e 1023 px (l.138) | B | Os três seguem o prompt (trilho). Nota cheia, mas a prévia aprovou outra coisa |
| P5 | Login: título e subtítulo **centralizados**; "Esqueci minha senha" ao lado do rótulo "Senha"; rodapé com "Ajuda" | "Lembrar de mim" + "Esqueci minha senha" na mesma linha (l.27); rodapé "Termos e Privacidade" (l.29) | A/B (pequena) | Os três seguem o prompt: título alinhado à esquerda, link na linha do "Lembrar" |
| P6 | Cadastro: requisitos "8 caracteres · uma maiúscula · um número" | "indicação dos requisitos de senha" (l.87), sem regras | A | 3 conjuntos de regras diferentes |
| P7 | Header no celular: "‹ Site institucional", sem ☰ (`19-…-grande-celular.png`) | ☰ + painel de menu abaixo de 768 px (l.230–231) | B | Ninguém pôs ☰ no celular (decisão correta, apoiada em l.139/l.286) |
| P8 | Arranjo "Sidebar inteira" testado na Combinação, mas **não persiste** (B11 do relatório da Fase 2) | Header "largura total da janela" (l.199) | A → B | Os três puseram o header só sobre a coluna principal (correto, pelo l.114) |

### 3.3 Contradições internas do prompt e como cada site as resolveu

| Contradição (relatório da Fase 2) | dev-1 | dev-2 | dev-3 | Leitura |
|---|---|---|---|---|
| C1 header full width × só sobre a coluna principal | Só sobre a coluna | Idem | Idem | Unânime → resolvível, mas custou decisão |
| C2 ☰/drawer no celular × bottom nav | Sem ☰ e sem drawer | Idem | Idem | Unânime |
| C3 logo no header ("Tucano") × logo na sidebar | Logo só na sidebar; "Atlas Workspace" | Idem | Idem | Unânime |
| C4 252/248, 64/56, 40–44/36, 20/18 | 252/64/40/20 | 252/64/40/20 | 252/64/**36**/20 | Quase unânime |
| C5 identidade (8 px, 15 px, 650) × Swiss (0, 14, 760) | Global no shell e no auth; Swiss no conteúdo | Idem (variáveis na classe `.swiss`) | Idem, mas cartões de "Início" arredondados | Quase unânime |
| C6 tablet 600–1023 × corte em 768 | Corte em 768 | Idem | Idem | Unânime |
| C7 3 links no header | Omitidos | Omitidos | Omitidos (viraram destinos da bottom nav!) | Unânime no desktop; no celular afetou dev-3 |
| C8 conteúdo de exemplo como decisão | Mantido literal, encaixado no produto | Mantido literal ("universo de agência de viagens") | Mantido literal | Unânime, mas mistura domínios (projetos × viagens × pedidos) |

## 4. Matrizes de fidelidade por site

As colunas "Escolha no Studio" e "Instrução exportada" se repetem nas três matrizes; muda só o resultado. "—" na origem indica requisito atendido. Notas: 100 % = atende; 75 % = desvio pequeno; 50 % = parcial; 25 % = vestígio; 0 % = ausente. Requisitos com várias partes recebem a fração das partes atendidas. Os requisitos marcados [J] são julgamento de design.

### Matriz — dev-1

| ID | Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---|---|---|
| ARQ-1 | Fluxo "Apenas login" | Fluxo "Apenas login" | l.15: abre direto na tela de entrar | Abre em `#/entrar` (login) | 100 % | — |
| ARQ-2 | Cadastro em rota própria, ida e volta | "Página própria de cadastro" | l.66 rota /cadastro; l.28, l.69 | `#/cadastro`; "Criar conta" ↔ "Já tem conta? Entrar" | 100 % | E (hash por causa do file://) |
| ARQ-3 | Fluxo de recuperação de senha | Login Clássico central | l.43 | `#/recuperar-senha` em 2 etapas (e-mail; código + nova senha) | 100 % | — |
| ARQ-4 | Primeira tela do app = painel "Visão geral" | Prévia integrada: o app abre em "Visão geral", com "Início" ativo | Ausente (o MP só dá o título do Dashboard, l.721) | Abre em "Início" (saudação, tarefas, agenda); o painel fica em `#/painel` | 50 % | A |
| ARQ-5 | Destinos e grupos da sidebar | Clássica Integral · A | l.251 | 10/10 itens, 3 grupos, contadores 12 e 3 | 100 % | — |
| ARQ-6 | Troca de arquitetura em 768 px | Desktop × mobile independentes | l.139, l.179 (× l.187, C6) | 767: bottom nav · 768: trilho | 100 % | — |
| ARQ-7 | 768–1023 px: trilho de 72 px + sobreposição | Sidebar integral clássica | l.138, l.280 | 72 px; ☰ no topo do trilho abre sidebar de 252 px fixa com scrim | 100 % | — |
| ARQ-8 | 1024–1279 px: ≈220 px | Sidebar integral clássica | l.137 (× l.279: 248 px) | 220 px | 100 % | — |
| ARQ-9 | Marca "Atlas Workspace" no lugar de "Tucano"/"Ipê" | Nome do projeto | l.201 "substitua pela marca real" | Só na sidebar (desktop) e na topbar (celular) | 100 % | — |
| ARQ-10 | Mesmos destinos no desktop e no celular | 4 destinos na prévia × 10 na sidebar | l.188 × l.150 ("4 itens") | Início, Painel, Projetos + "Mais" (página com todos os outros destinos) | 100 % | — |
| DSK-1 | Sidebar integral do topo à base | Sidebar integral clássica | l.106, l.110, l.142 | x 0, y 0, 252×900, raio 0, sem sombra, sticky | 100 % | — |
| DSK-2 | Largura ≈252/248 px | Idem (o Studio mostra as duas medidas) | l.109 × l.249 (C4) | 252 px | 100 % | E |
| DSK-3 | Header só sobre a coluna principal | Layout (o arranjo "Sidebar inteira" não persiste) | l.114 × l.199 "full width" (C1) | Header em x 252, largura 1188 | 100 % | — |
| DSK-4 | Altura do header 64/56 px | Layout + Trilha de Contexto | l.109 × l.199 | 64 px | 100 % | — |
| DSK-5 | Header sticky + borda 1 px `border` | Trilha de Contexto | l.132, l.200, l.222 | top 0 depois de rolar; 1 px #e6e6e6 | 100 % | — |
| DSK-6 | Topo da sidebar alinhado ao header, com logo + nome | Layout | l.111 | 64 = 64 px; símbolo + "Atlas Workspace" | 100 % | — |
| DSK-7 | Títulos de grupo, ícones e altura dos itens | Clássica Integral | l.112, l.252–253 (11 px × mínimo de 12 px, l.357) | Títulos 12 px/650/0,08em/caixa alta/#707072; itens 40 px; ícones 20 px, traço 1,5 | 100 % | E (12 px resolve D) |
| DSK-8 | Item ativo | Clássica Integral | l.112, l.272 | Fundo #e3e3e4, texto #18181b, raio 8 px, barra lateral de 3 px, aria-current | 100 % | — |
| DSK-9 | Rodapé: perfil + atalho de configurações | Composição A | l.113, l.254 | Avatar, nome, cargo, engrenagem e ⋯ | 100 % | — |
| DSK-10 | Header: trilha, sino com contador, avatar de 32 px | Trilha de Contexto · A | l.203–204, l.210 | Trilha dinâmica (3 níveis na página do projeto), último nível 600 + aria-current; sino; avatar de 40 px | 92 % | C (avatar) |
| DSK-11 | Sidebar fixa; a página rola só no conteúdo | Sidebar integral | l.131, l.276 | Fica em top 0 em todas as páginas testadas | 100 % | — |
| DSK-12 | Padding do conteúdo 24–32 px; nenhum cartão < 280 px | Layout | l.115 | 32 px; menor cartão 359 px | 100 % | — |
| DSK-13 | [J] Semelhança com a prévia aprovada (computador) | Prévia integrada / Live Site Preview | — | Mesma estrutura. Linguagem Swiss (cantos retos, réguas de tinta) no lugar dos cartões arredondados da prévia integrada | 75 % | D |
| CEL-1 | Bottom nav fixa ≈64 px + safe area | Bottom Navigation clássica | l.154, l.166–167 | fixed, 390×65, base 844 | 100 % | — |
| CEL-2 | 4 itens iguais, ícone 24, rótulo 12 | Idem | l.150, l.154 | 4 × 87,5 px; 24 px; 12 px | 100 % | — |
| CEL-3 | Destinos Início, Buscar, Agenda, Perfil | Prévia da Bottom Navigation clássica | Ausente (l.150 só diz "4 destinos rotulados") | Início, Painel, Projetos, Mais (1/4) | 25 % | A |
| CEL-4 | Item ativo: aria-current + indicador além da cor | Idem | l.171 | aria-current; pílula #e3e3e4; peso 650 | 100 % | — |
| CEL-5 | Topbar ≈56 px, título + uma ação | Idem (prévia: "Início" + sino) | l.153 (× l.230: logo, avatar, ☰) | 56 px: logo, título e avatar (menu do perfil com ponto de notificação) | 100 % | E |
| CEL-6 | Sem sidebar/drawer/☰ no celular | lateral: none; sobreposição: none | l.139, l.159–161, l.286 (× l.230, l.281: C2) | Nenhum | 100 % | — |
| CEL-7 | Conteúdo não fica atrás da barra | Idem | l.155 | Último conteúdo em y 741 < 779 | 100 % | — |
| CEL-8 | Alvos da barra ≥ 48×48 | Idem | l.168, l.183 | 87,5×64 | 100 % | — |
| CEL-9 | Safe areas + viewport-fit=cover | Idem | l.153–154, l.794 | top e bottom; cover | 100 % | — |
| CEL-10 | Horizontal: barra ≈48 px, barras fixas ≤ 25 % | Idem | l.178, l.795 | 667×375: 44 + 45 px = 23,7 %; 740×360: 24,7 % | 100 % | — |
| CEL-11 | Login no celular | Clássico central | l.47–48 | Sem cartão, 20 px de margem, inputs 16 px/48 px | 100 % | — |
| CEL-12 | Cadastro no celular | Página própria | l.92, l.790 | 1 coluna; inputs 16/48; termos com área 350×51 | 100 % | — |
| CEL-13 | [J] Semelhança com a prévia aprovada do celular | Prévia da Bottom Navigation | — | Topbar com logo; 1ª tela de saudação; destinos diferentes | 60 % | A |
| PAL-1 | `primary`/`onPrimary` no botão principal | Neutro Essencial | l.303, l.306 | #18181b / #ffffff | 100 % | — |
| PAL-2 | `text` no corpo | Idem | l.316 | #18181b | 100 % | — |
| PAL-3 | `bgAlt` de tela cheia no login | Idem | l.26, l.313 | #f6f6f6, 900 px de altura | 100 % | — |
| PAL-4 | `border` estrutural | Idem | l.200, l.250 | 1 px #e6e6e6 no header e na sidebar | 100 % | — |
| PAL-5 | `navActive`/`navActiveText` | Idem | l.343–344 | #e3e3e4 / #18181b | 100 % | — |
| PAL-6 | `textMuted` em textos secundários | Idem | l.317 | #707072 | 100 % | — |
| PAL-7 | `accent` só em pequenos marcadores | Idem + Swiss | l.310, l.417 | Praticamente não usado | 100 % | — |
| PAL-8 | success na variação positiva; error nas mensagens de erro | Idem | l.330, l.334, l.637 | +12,4 % em #117e39; erro do campo em #dc2626 | 100 % | — |
| PAL-9 | Inter | Inter + Inter (padrão) | l.348–361 | Declarada e renderizada (`document.fonts.check` verdadeiro) | 100 % | — |
| PAL-10 | Base 15 px (global) / 14 px (Swiss) | Padrão + Swiss | l.362 × l.440 (C5) | Corpo 15 px; células 14 px | 100 % | E (resolve D) |
| PAL-11 | Peso dos títulos 650/750/760 | Idem | l.363 × l.416, l.437 | Login 650; h1 760 | 100 % | — |
| PAL-12 | Raios coerentes: global fora dos componentes, 0 px nos Swiss | Médios (8 px) + Swiss 0 px | l.382–384 × l.431–432 (C5) | Auth 8/12 px; conteúdo 0 px | 100 % | E |
| PAL-13 | Sem sombra em superfícies de conteúdo | Sem sombra | l.378, l.386 | Todas `none` | 100 % | — |
| PAL-14 | Tokens centralizados | Regras G | l.822 | 44/44 tokens de cor; 0 literais fora dos tokens | 100 % | — |
| PAL-15 | Swiss: borda 1 px na cor do texto | Swiss Minimal | l.414, l.433, l.452 | KPI, card e tabela com 1 px #18181b | 100 % | — |
| PAL-16 | Ícones de contorno, traço 1,5 | Contorno | l.379, l.443 | SVG fill none, traço 1,5 | 100 % | — |
| PAL-17 | Foco visível de 2 px em focusRing | Idem | l.397, l.464 | 2 px #18181b, afastamento 2 px | 100 % | — |
| CMP-1 | Anatomia do login Clássico central | Clássico central | l.23–36 | 10/10; cartão de 400 px com padding 32; mais uma linha de credenciais de demonstração | 100 % | E |
| CMP-2 | Inputs ≈44 px no desktop | Idem | l.34 | 44 px | 100 % | — |
| CMP-3 | Anatomia do cadastro | Página própria | l.63–87 | 6/6: 5 campos na ordem, termos com links, "Já tem conta? Entrar", requisitos + força | 100 % | — |
| CMP-4 | Dashboard: cabeçalho → KPIs → gráfico 2/3 + atividades 1/3 | Dashboard Swiss | l.710 | 4 períodos + "Exportar CSV"; 733/367 px (0,67) | 100 % | — |
| CMP-5 | 3 KPIs | Dashboard: "Quantidade de KPIs: 3" | l.722 | 3 | 100 % | — |
| CMP-6 | Anatomia do KPI | KPIs Swiss | l.636–653 | 6/6: Receita mensal, R$ 48,2 mil, +12,4 %, "vs. mês anterior", ícone, sparkline | 100 % | — |
| CMP-7 | KPI no estilo Swiss | Idem | l.638–657 | Raio 0, 1 px #18181b, sem sombra, rótulo em caixa alta 0,08em | 100 % | — |
| CMP-8 | Cards Swiss | Cards Swiss | l.409–444 | 16/9, etiqueta, título, texto, rodapé, raio 0, tinta. Numeração "01" no canto da mídia em vez do sobretítulo "01 —" | 92 % | C |
| CMP-9 | Tabela "Pedidos recentes" | Tabelas Swiss | l.484–519 | 8/8: semântica, colunas, badge, valores à direita (tabular), checkbox, ações, cabeçalho destacado, sem zebra; 4 linhas | 100 % | — |
| CMP-10 | Tabela no estilo Swiss | Idem | l.490–495 | Raio 0, réguas de 1 px, cabeçalho em caixa alta 0,08em | 100 % | — |
| CMP-11 | Formulário Swiss | Formulários Swiss | l.559–592 | Sublinhado (inclusive a textarea), 2 colunas, termos, "ENVIAR MENSAGEM" | 100 % | — |
| CMP-12 | Tipografia Swiss | Swiss | l.416, l.437–439 | Títulos 750–760 com letter-spacing negativo; rótulos e botões em caixa alta 0,08em | 100 % | — |
| CMP-13 | Popover de notificações + menu de perfil | Trilha de Contexto | l.203, l.223–224 | 320 px, não lidas, "Ver todas"; perfil com os 4 itens | 100 % | — |
| CMP-14 | Estados de carregando, vazio e erro | Tabelas + Regras G | l.489, l.821 | Seletor "Simular estado" + `?estado=` | 100 % | — |
| CMP-15 | [J] Semelhança com as prévias Swiss | Capturas 25-* | — | Muito próxima | 85 % | D |
| INT-1 | Login vazio: erros por campo + resumo role=alert | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.41 | aria-invalid + describedby; resumo com 2 links | 100 % | — |
| INT-2 | Validação ao sair do campo | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.41 | "Digite um e-mail válido…" | 100 % | — |
| INT-3 | Erro genérico de credenciais | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.42 | "E-mail ou senha incorretos." | 100 % | — |
| INT-4 | Mostrar/ocultar senha | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.40 | Dentro do campo; aria-label alterna; aria-pressed | 100 % | — |
| INT-5 | "Entrando…" desabilitado | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.44 | Sim | 100 % | — |
| INT-6 | Recuperação com mensagem neutra | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.43 | "Se o e-mail existir, enviaremos um link." | 100 % | — |
| INT-7 | Comportamentos do cadastro (8) | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.80–89 | 8/8 | 100 % | — |
| INT-8 | Cadastro válido conclui | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.63 | Entra no app | 100 % | — |
| INT-9 | Recolher/expandir 252↔72, tooltip, localStorage | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.273 | 4/4 (252 em vez de 248: E) | 100 % | — |
| INT-10 | Clique na sidebar marca o ativo | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.272 | Sim | 100 % | — |
| INT-11 | Popovers: Esc, clique fora, dentro da viewport | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.223–232 | Sim; no celular viram bottom sheet | 100 % | — |
| INT-12 | Menu ⋯ abre para cima | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.275 | Sim (Meu perfil, Preferências, Sair) | 100 % | — |
| INT-13 | Sair volta ao login | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.224 | Sim | 100 % | — |
| INT-14 | Sombra do header após 8 px | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.222 | Sim | 100 % | — |
| INT-15 | Sobreposição do tablet: scrim, Esc, clique fora | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.138 | Sim + foco preso e devolvido | 100 % | — |
| INT-16 | Bottom nav: troca, toque no ativo, rolagem por destino | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.171–173 | 3/3 (600 px preservados; toque no ativo leva a 0) | 100 % | — |
| INT-17 | Tabela: selecionar todos/indeterminado, aria-sort, ações | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.506, l.537 | 3/3 (menu de ações) | 100 % | — |
| INT-18 | Formulário: validação, resumo com links, "Enviando…" | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.610–611 | 4/4 | 100 % | — |
| INT-19 | Filtro de período atualiza todos os blocos | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.757 | Sim, com esqueletos | 100 % | — |
| INT-20 | Teclado: foco, Esc devolve o foco, foco preso | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.287, l.294–295 | 3/3 | 100 % | — |
| RSP-1 | Sem overflow no app (14 larguras × 5 rotas) | Validação em celular, tablet e desktop | l.786 | 0 casos | 100 % | — |
| RSP-2 | Sem overflow no login/cadastro (14 larguras) | Validação em celular, tablet e desktop | l.50, l.94 | 0 casos | 100 % | — |
| RSP-3 | Sem texto cortado nem sobreposição | Validação em celular, tablet e desktop | l.787–788 | 0 casos | 100 % | — |
| RSP-4 | Alvos ≥ 44×44 a 390 px (links dentro de frases excluídos) | Validação em celular, tablet e desktop | l.789 | 28/31 = 90 % (botões de olho 44×40) | 75 % | C |
| RSP-5 | Tabela no celular | Validação em celular, tablet e desktop | l.547 | Cartões | 100 % | — |
| RSP-6 | KPIs 3 → 2 → 1 sem corte | Validação em celular, tablet e desktop | l.695 | 3/2/1 colunas a 1440/820/390 | 100 % | — |
| RSP-7 | Inputs ≥ 16 px no celular | Validação em celular, tablet e desktop | l.48, l.790 | 16 px no login, no cadastro e no formulário | 100 % | — |
| RSP-8 | 100dvh e prefers-reduced-motion | Validação em celular, tablet e desktop | l.796, l.798 | Ambos | 100 % | — |

### Matriz — dev-2

| ID | Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---|---|---|
| ARQ-1 | Fluxo "Apenas login" | Fluxo "Apenas login" | l.15: abre direto na tela de entrar | Abre na raiz já com o login | 100 % | — |
| ARQ-2 | Cadastro em rota própria, ida e volta | "Página própria de cadastro" | l.66 rota /cadastro; l.28, l.69 | Idem | 100 % | E |
| ARQ-3 | Fluxo de recuperação de senha | Login Clássico central | l.43 | `#/recuperar` | 100 % | — |
| ARQ-4 | Primeira tela do app = painel "Visão geral" | Prévia integrada: o app abre em "Visão geral", com "Início" ativo | Ausente (o MP só dá o título do Dashboard, l.721) | Abre em "Painel / Visão geral" | 100 % | — |
| ARQ-5 | Destinos e grupos da sidebar | Clássica Integral · A | l.251 | 10/10, 3 grupos, 12 e 3 | 100 % | — |
| ARQ-6 | Troca de arquitetura em 768 px | Desktop × mobile independentes | l.139, l.179 (× l.187, C6) | Idem | 100 % | — |
| ARQ-7 | 768–1023 px: trilho de 72 px + sobreposição | Sidebar integral clássica | l.138, l.280 | 72 px; "Expandir menu" abre 252 px com scrim | 100 % | — |
| ARQ-8 | 1024–1279 px: ≈220 px | Sidebar integral clássica | l.137 (× l.279: 248 px) | 220 px | 100 % | — |
| ARQ-9 | Marca "Atlas Workspace" no lugar de "Tucano"/"Ipê" | Nome do projeto | l.201 "substitua pela marca real" | Só na sidebar | 100 % | — |
| ARQ-10 | Mesmos destinos no desktop e no celular | 4 destinos na prévia × 10 na sidebar | l.188 × l.150 ("4 itens") | Painel, Projetos, Tarefas + "Mais" (folha com o restante) | 100 % | — |
| DSK-1 | Sidebar integral do topo à base | Sidebar integral clássica | l.106, l.110, l.142 | Idem | 100 % | — |
| DSK-2 | Largura ≈252/248 px | Idem (o Studio mostra as duas medidas) | l.109 × l.249 (C4) | 252 px | 100 % | E |
| DSK-3 | Header só sobre a coluna principal | Layout (o arranjo "Sidebar inteira" não persiste) | l.114 × l.199 "full width" (C1) | Idem | 100 % | — |
| DSK-4 | Altura do header 64/56 px | Layout + Trilha de Contexto | l.109 × l.199 | 64 px | 100 % | — |
| DSK-5 | Header sticky + borda 1 px `border` | Trilha de Contexto | l.132, l.200, l.222 | Idem | 100 % | — |
| DSK-6 | Topo da sidebar alinhado ao header, com logo + nome | Layout | l.111 | Idem | 100 % | — |
| DSK-7 | Títulos de grupo, ícones e altura dos itens | Clássica Integral | l.112, l.252–253 (11 px × mínimo de 12 px, l.357) | Idem (12 px; 40 px) | 100 % | E |
| DSK-8 | Item ativo | Clássica Integral | l.112, l.272 | Idem | 100 % | — |
| DSK-9 | Rodapé: perfil + atalho de configurações | Composição A | l.113, l.254 | Idem | 100 % | — |
| DSK-10 | Header: trilha, sino com contador, avatar de 32 px | Trilha de Contexto · A | l.203–204, l.210 | Trilha de 3 níveis; sino; avatar de 32 px | 100 % | — |
| DSK-11 | Sidebar fixa; a página rola só no conteúdo | Sidebar integral | l.131, l.276 | No Painel o documento fica 120 px maior que o shell; no fim da rolagem a sidebar sobe 120 px (o logo some e sobra uma faixa branca) | 50 % | C |
| DSK-12 | Padding do conteúdo 24–32 px; nenhum cartão < 280 px | Layout | l.115 | 24/32 px; 359 px | 100 % | — |
| DSK-13 | [J] Semelhança com a prévia aprovada (computador) | Prévia integrada / Live Site Preview | — | Idem, com marcadores quadrados azuis | 75 % | D |
| CEL-1 | Bottom nav fixa ≈64 px + safe area | Bottom Navigation clássica | l.154, l.166–167 | fixed, 390×65 | 100 % | — |
| CEL-2 | 4 itens iguais, ícone 24, rótulo 12 | Idem | l.150, l.154 | 4 × 97,5 px; 24; 12 | 100 % | — |
| CEL-3 | Destinos Início, Buscar, Agenda, Perfil | Prévia da Bottom Navigation clássica | Ausente (l.150 só diz "4 destinos rotulados") | Painel, Projetos, Tarefas, Mais (0/4) | 0 % | A |
| CEL-4 | Item ativo: aria-current + indicador além da cor | Idem | l.171 | Idem | 100 % | — |
| CEL-5 | Topbar ≈56 px, título + uma ação | Idem (prévia: "Início" + sino) | l.153 (× l.230: logo, avatar, ☰) | 56 px: título + sino | 100 % | — |
| CEL-6 | Sem sidebar/drawer/☰ no celular | lateral: none; sobreposição: none | l.139, l.159–161, l.286 (× l.230, l.281: C2) | Nenhum | 100 % | — |
| CEL-7 | Conteúdo não fica atrás da barra | Idem | l.155 | 695 < 779 | 100 % | — |
| CEL-8 | Alvos da barra ≥ 48×48 | Idem | l.168, l.183 | 97,5×64 | 100 % | — |
| CEL-9 | Safe areas + viewport-fit=cover | Idem | l.153–154, l.794 | top e bottom; cover | 100 % | — |
| CEL-10 | Horizontal: barra ≈48 px, barras fixas ≤ 25 % | Idem | l.178, l.795 | 44 + 49 px = 24,8 %; 360 px: 13,6 % | 100 % | — |
| CEL-11 | Login no celular | Clássico central | l.47–48 | Idem (fundo branco) | 100 % | — |
| CEL-12 | Cadastro no celular | Página própria | l.92, l.790 | 1 coluna; 16/48; 350×61 | 100 % | — |
| CEL-13 | [J] Semelhança com a prévia aprovada do celular | Prévia da Bottom Navigation | — | Título + sino como na prévia; 1ª tela com KPIs; destinos diferentes | 70 % | A |
| PAL-1 | `primary`/`onPrimary` no botão principal | Neutro Essencial | l.303, l.306 | #18181b / #ffffff | 100 % | — |
| PAL-2 | `text` no corpo | Idem | l.316 | #18181b | 100 % | — |
| PAL-3 | `bgAlt` de tela cheia no login | Idem | l.26, l.313 | #f6f6f6, 900 px de altura | 100 % | — |
| PAL-4 | `border` estrutural | Idem | l.200, l.250 | 1 px #e6e6e6 no header e na sidebar | 100 % | — |
| PAL-5 | `navActive`/`navActiveText` | Idem | l.343–344 | #e3e3e4 / #18181b | 100 % | — |
| PAL-6 | `textMuted` em textos secundários | Idem | l.317 | #707072 | 100 % | — |
| PAL-7 | `accent` só em pequenos marcadores | Idem + Swiss | l.310, l.417 | Marcadores quadrados azuis nos sobretítulos e no fim do sparkline | 100 % | — |
| PAL-8 | success na variação positiva; error nas mensagens de erro | Idem | l.330, l.334, l.637 | #117e39; erro do campo em #18181b, com a cor de erro na borda e no ícone (NOTES §3, contraste) | 75 % | E |
| PAL-9 | Inter | Inter + Inter (padrão) | l.348–361 | Declarada e renderizada (`document.fonts.check` verdadeiro) | 100 % | — |
| PAL-10 | Base 15 px (global) / 14 px (Swiss) | Padrão + Swiss | l.362 × l.440 (C5) | Corpo 15 px; células 14 px | 100 % | E (resolve D) |
| PAL-11 | Peso dos títulos 650/750/760 | Idem | l.363 × l.416, l.437 | Login 650; h1 760 | 100 % | — |
| PAL-12 | Raios coerentes: global fora dos componentes, 0 px nos Swiss | Médios (8 px) + Swiss 0 px | l.382–384 × l.431–432 (C5) | Auth 8 px; conteúdo 0 px | 100 % | E |
| PAL-13 | Sem sombra em superfícies de conteúdo | Sem sombra | l.378, l.386 | Todas `none` | 100 % | — |
| PAL-14 | Tokens centralizados | Regras G | l.822 | 44/44; 0 literais | 100 % | — |
| PAL-15 | Swiss: borda 1 px na cor do texto | Swiss Minimal | l.414, l.433, l.452 | KPI, card e tabela com 1 px #18181b | 100 % | — |
| PAL-16 | Ícones de contorno, traço 1,5 | Contorno | l.379, l.443 | SVG fill none, traço 1,5 | 100 % | — |
| PAL-17 | Foco visível de 2 px em focusRing | Idem | l.397, l.464 | 2 px #18181b, afastamento 2 px | 100 % | — |
| CMP-1 | Anatomia do login Clássico central | Clássico central | l.23–36 | 10/10; 400 px, padding 32; linha de demonstração | 100 % | E |
| CMP-2 | Inputs ≈44 px no desktop | Idem | l.34 | 44 px | 100 % | — |
| CMP-3 | Anatomia do cadastro | Página própria | l.63–87 | 6/6: 5 campos na ordem, termos com links, "Já tem conta? Entrar", requisitos + força | 100 % | — |
| CMP-4 | Dashboard: cabeçalho → KPIs → gráfico 2/3 + atividades 1/3 | Dashboard Swiss | l.710 | 3 períodos + "Atualizar"; 597/364 px (0,62) | 100 % | — |
| CMP-5 | 3 KPIs | Dashboard: "Quantidade de KPIs: 3" | l.722 | 3 | 100 % | — |
| CMP-6 | Anatomia do KPI | KPIs Swiss | l.636–653 | 6/6: Receita mensal, R$ 48,2 mil, +12,4 %, "vs. mês anterior", ícone, sparkline | 100 % | — |
| CMP-7 | KPI no estilo Swiss | Idem | l.638–657 | Idem | 100 % | — |
| CMP-8 | Cards Swiss | Cards Swiss | l.409–444 | 6/6 | 100 % | — |
| CMP-9 | Tabela "Pedidos recentes" | Tabelas Swiss | l.484–519 | 8/8: semântica, colunas, badge, valores à direita (tabular), checkbox, ações, cabeçalho destacado, sem zebra; 4 linhas | 100 % | — |
| CMP-10 | Tabela no estilo Swiss | Idem | l.490–495 | Raio 0, réguas de 1 px, cabeçalho em caixa alta 0,08em | 100 % | — |
| CMP-11 | Formulário Swiss | Formulários Swiss | l.559–592 | Idem | 100 % | — |
| CMP-12 | Tipografia Swiss | Swiss | l.416, l.437–439 | Títulos 750–760 com letter-spacing negativo; rótulos e botões em caixa alta 0,08em | 100 % | — |
| CMP-13 | Popover de notificações + menu de perfil | Trilha de Contexto | l.203, l.223–224 | Idem | 100 % | — |
| CMP-14 | Estados de carregando, vazio e erro | Tabelas + Regras G | l.489, l.821 | Seletor "Estado da demonstração" | 100 % | — |
| CMP-15 | [J] Semelhança com as prévias Swiss | Capturas 25-* | — | Muito próxima | 85 % | D |
| INT-1 | Login vazio: erros por campo + resumo role=alert | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.41 | Idem | 100 % | — |
| INT-2 | Validação ao sair do campo | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.41 | "Informe um e-mail válido…" | 100 % | — |
| INT-3 | Erro genérico de credenciais | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.42 | "E-mail ou senha incorretos." | 100 % | — |
| INT-4 | Mostrar/ocultar senha | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.40 | Dentro do campo; aria-label alterna; aria-pressed | 100 % | — |
| INT-5 | "Entrando…" desabilitado | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.44 | Sim (+aria-busy) | 100 % | — |
| INT-6 | Recuperação com mensagem neutra | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.43 | "Se o e-mail existir, enviaremos um link." | 100 % | — |
| INT-7 | Comportamentos do cadastro (8) | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.80–89 | 8/8 | 100 % | — |
| INT-8 | Cadastro válido conclui | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.63 | Tela neutra "Verifique seu e-mail" (igual para e-mail novo ou existente) | 100 % | — |
| INT-9 | Recolher/expandir 252↔72, tooltip, localStorage | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.273 | 4/4 (252 em vez de 248: E) | 100 % | — |
| INT-10 | Clique na sidebar marca o ativo | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.272 | Sim | 100 % | — |
| INT-11 | Popovers: Esc, clique fora, dentro da viewport | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.223–232 | Sim; sheet no celular | 100 % | — |
| INT-12 | Menu ⋯ abre para cima | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.275 | Sim | 100 % | — |
| INT-13 | Sair volta ao login | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.224 | Sim | 100 % | — |
| INT-14 | Sombra do header após 8 px | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.222 | Sim | 100 % | — |
| INT-15 | Sobreposição do tablet: scrim, Esc, clique fora | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.138 | Sim + foco preso e devolvido | 100 % | — |
| INT-16 | Bottom nav: troca, toque no ativo, rolagem por destino | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.171–173 | 3/3 (600 px preservados; toque no ativo leva a 0) | 100 % | — |
| INT-17 | Tabela: selecionar todos/indeterminado, aria-sort, ações | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.506, l.537 | 3/3 (menu de ações) | 100 % | — |
| INT-18 | Formulário: validação, resumo com links, "Enviando…" | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.610–611 | 4/4 | 100 % | — |
| INT-19 | Filtro de período atualiza todos os blocos | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.757 | Sim, com esqueletos | 100 % | — |
| INT-20 | Teclado: foco, Esc devolve o foco, foco preso | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.287, l.294–295 | 3/3 | 100 % | — |
| RSP-1 | Sem overflow no app (14 larguras × 5 rotas) | Validação em celular, tablet e desktop | l.786 | 0 casos | 100 % | — |
| RSP-2 | Sem overflow no login/cadastro (14 larguras) | Validação em celular, tablet e desktop | l.50, l.94 | 0 casos | 100 % | — |
| RSP-3 | Sem texto cortado nem sobreposição | Validação em celular, tablet e desktop | l.787–788 | Reticências em "Gerente de produto" (≥ 1024 px) e em "Atlas Workspace" e "Marina Alves" (1024 px): 3 casos | 50 % | C |
| RSP-4 | Alvos ≥ 44×44 a 390 px (links dentro de frases excluídos) | Validação em celular, tablet e desktop | l.789 | 23/27 = 85 % (logo 187×28, rodapé 32 px) | 75 % | C |
| RSP-5 | Tabela no celular | Validação em celular, tablet e desktop | l.547 | Rolagem local com coluna fixa | 100 % | — |
| RSP-6 | KPIs 3 → 2 → 1 sem corte | Validação em celular, tablet e desktop | l.695 | 3/2/1 colunas a 1440/820/390 | 100 % | — |
| RSP-7 | Inputs ≥ 16 px no celular | Validação em celular, tablet e desktop | l.48, l.790 | 16 px no login, no cadastro e no formulário | 100 % | — |
| RSP-8 | 100dvh e prefers-reduced-motion | Validação em celular, tablet e desktop | l.796, l.798 | Ambos | 100 % | — |

### Matriz — dev-3

| ID | Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---|---|---|
| ARQ-1 | Fluxo "Apenas login" | Fluxo "Apenas login" | l.15: abre direto na tela de entrar | Abre em `#/entrar` (login) | 100 % | — |
| ARQ-2 | Cadastro em rota própria, ida e volta | "Página própria de cadastro" | l.66 rota /cadastro; l.28, l.69 | Idem | 100 % | E |
| ARQ-3 | Fluxo de recuperação de senha | Login Clássico central | l.43 | `#/recuperar` | 100 % | — |
| ARQ-4 | Primeira tela do app = painel "Visão geral" | Prévia integrada: o app abre em "Visão geral", com "Início" ativo | Ausente (o MP só dá o título do Dashboard, l.721) | Abre em "Início" (saudação); o painel fica em `#/app/painel` | 50 % | A |
| ARQ-5 | Destinos e grupos da sidebar | Clássica Integral · A | l.251 | 10/10, 3 grupos, 12 e 3 | 100 % | — |
| ARQ-6 | Troca de arquitetura em 768 px | Desktop × mobile independentes | l.139, l.179 (× l.187, C6) | Idem | 100 % | — |
| ARQ-7 | 768–1023 px: trilho de 72 px + sobreposição | Sidebar integral clássica | l.138, l.280 | 72 px; ☰ no header abre 252 px com scrim | 100 % | — |
| ARQ-8 | 1024–1279 px: ≈220 px | Sidebar integral clássica | l.137 (× l.279: 248 px) | 220 px | 100 % | — |
| ARQ-9 | Marca "Atlas Workspace" no lugar de "Tucano"/"Ipê" | Nome do projeto | l.201 "substitua pela marca real" | Só na sidebar | 100 % | — |
| ARQ-10 | Mesmos destinos no desktop e no celular | 4 destinos na prévia × 10 na sidebar | l.188 × l.150 ("4 itens") | Início, Projetos, "Equipe" (= Pessoas), "Ajustes" (= Configurações). Painel, Tarefas, Calendário, Mensagens, Relatórios e Ajuda ficam sem acesso pela barra | 50 % | B |
| DSK-1 | Sidebar integral do topo à base | Sidebar integral clássica | l.106, l.110, l.142 | Idem | 100 % | — |
| DSK-2 | Largura ≈252/248 px | Idem (o Studio mostra as duas medidas) | l.109 × l.249 (C4) | 252 px | 100 % | E |
| DSK-3 | Header só sobre a coluna principal | Layout (o arranjo "Sidebar inteira" não persiste) | l.114 × l.199 "full width" (C1) | Idem | 100 % | — |
| DSK-4 | Altura do header 64/56 px | Layout + Trilha de Contexto | l.109 × l.199 | 64 px | 100 % | — |
| DSK-5 | Header sticky + borda 1 px `border` | Trilha de Contexto | l.132, l.200, l.222 | Idem | 100 % | — |
| DSK-6 | Topo da sidebar alinhado ao header, com logo + nome | Layout | l.111 | Idem | 100 % | — |
| DSK-7 | Títulos de grupo, ícones e altura dos itens | Clássica Integral | l.112, l.252–253 (11 px × mínimo de 12 px, l.357) | Títulos 11 px/650/0,08em/#707072; itens 36 px; ícones 20 px | 100 % | — |
| DSK-8 | Item ativo | Clássica Integral | l.112, l.272 | Idem | 100 % | — |
| DSK-9 | Rodapé: perfil + atalho de configurações | Composição A | l.113, l.254 | Avatar, nome, cargo e ⋯; sem atalho de configurações (só "Preferências" dentro do menu) | 75 % | C |
| DSK-10 | Header: trilha, sino com contador, avatar de 32 px | Trilha de Contexto · A | l.203–204, l.210 | Trilha só "Grupo / Página" (ex.: "Geral / Painel"); sino; avatar de 40 px | 83 % | B (trilha) + C (avatar) |
| DSK-11 | Sidebar fixa; a página rola só no conteúdo | Sidebar integral | l.131, l.276 | Mesmo defeito no Painel: a sidebar sobe 152 px | 50 % | C |
| DSK-12 | Padding do conteúdo 24–32 px; nenhum cartão < 280 px | Layout | l.115 | 32 px; 374 px | 100 % | — |
| DSK-13 | [J] Semelhança com a prévia aprovada (computador) | Prévia integrada / Live Site Preview | — | Idem. A variação do KPI quebra (seta acima do número) | 70 % | D |
| CEL-1 | Bottom nav fixa ≈64 px + safe area | Bottom Navigation clássica | l.154, l.166–167 | fixed, 390×64 | 100 % | — |
| CEL-2 | 4 itens iguais, ícone 24, rótulo 12 | Idem | l.150, l.154 | 4 × 97,5 px; 24; 12 | 100 % | — |
| CEL-3 | Destinos Início, Buscar, Agenda, Perfil | Prévia da Bottom Navigation clássica | Ausente (l.150 só diz "4 destinos rotulados") | Início, Projetos, Equipe, Ajustes (1/4) | 25 % | A |
| CEL-4 | Item ativo: aria-current + indicador além da cor | Idem | l.171 | Idem, com ícone preenchido | 100 % | — |
| CEL-5 | Topbar ≈56 px, título + uma ação | Idem (prévia: "Início" + sino) | l.153 (× l.230: logo, avatar, ☰) | 56 px: título + sino | 100 % | — |
| CEL-6 | Sem sidebar/drawer/☰ no celular | lateral: none; sobreposição: none | l.139, l.159–161, l.286 (× l.230, l.281: C2) | Nenhum | 100 % | — |
| CEL-7 | Conteúdo não fica atrás da barra | Idem | l.155 | 725 < 780 | 100 % | — |
| CEL-8 | Alvos da barra ≥ 48×48 | Idem | l.168, l.183 | 97,5×63 | 100 % | — |
| CEL-9 | Safe areas + viewport-fit=cover | Idem | l.153–154, l.794 | top e bottom; cover | 100 % | — |
| CEL-10 | Horizontal: barra ≈48 px, barras fixas ≤ 25 % | Idem | l.178, l.795 | 48 + 48 px = 25,6 % e 26,7 % | 75 % | C |
| CEL-11 | Login no celular | Clássico central | l.47–48 | Cartão branco sem borda a 20 px + padding 20 px; inputs 16 px/48 px | 100 % | E (l.36 "paddingCartao 20 px") |
| CEL-12 | Cadastro no celular | Página própria | l.92, l.790 | 1 coluna; 16/48; 310×44 | 100 % | — |
| CEL-13 | [J] Semelhança com a prévia aprovada do celular | Prévia da Bottom Navigation | — | Título + sino; cartões arredondados parecidos com a prévia; destinos diferentes | 65 % | A |
| PAL-1 | `primary`/`onPrimary` no botão principal | Neutro Essencial | l.303, l.306 | #18181b / #ffffff | 100 % | — |
| PAL-2 | `text` no corpo | Idem | l.316 | #18181b | 100 % | — |
| PAL-3 | `bgAlt` de tela cheia no login | Idem | l.26, l.313 | #f6f6f6, 900 px de altura | 100 % | — |
| PAL-4 | `border` estrutural | Idem | l.200, l.250 | 1 px #e6e6e6 no header e na sidebar | 100 % | — |
| PAL-5 | `navActive`/`navActiveText` | Idem | l.343–344 | #e3e3e4 / #18181b | 100 % | — |
| PAL-6 | `textMuted` em textos secundários | Idem | l.317 | #707072 | 100 % | — |
| PAL-7 | `accent` só em pequenos marcadores | Idem + Swiss | l.310, l.417 | Só como "info" no badge "Em análise" | 100 % | — |
| PAL-8 | success na variação positiva; error nas mensagens de erro | Idem | l.330, l.334, l.637 | #117e39; erro do campo em #18181b; alerta com errorBg e borda error | 75 % | E |
| PAL-9 | Inter | Inter + Inter (padrão) | l.348–361 | Declarada e renderizada (`document.fonts.check` verdadeiro) | 100 % | — |
| PAL-10 | Base 15 px (global) / 14 px (Swiss) | Padrão + Swiss | l.362 × l.440 (C5) | Corpo 15 px; células 14 px | 100 % | E (resolve D) |
| PAL-11 | Peso dos títulos 650/750/760 | Idem | l.363 × l.416, l.437 | Login 650; h1 750 | 100 % | — |
| PAL-12 | Raios coerentes: global fora dos componentes, 0 px nos Swiss | Médios (8 px) + Swiss 0 px | l.382–384 × l.431–432 (C5) | Auth 8 px; Swiss 0 px, mas os cartões da página Início são arredondados dentro da área de conteúdo | 75 % | D |
| PAL-13 | Sem sombra em superfícies de conteúdo | Sem sombra | l.378, l.386 | Todas `none` | 100 % | — |
| PAL-14 | Tokens centralizados | Regras G | l.822 | 44/44; 1 literal (rgba na sombra do header) | 100 % | — |
| PAL-15 | Swiss: borda 1 px na cor do texto | Swiss Minimal | l.414, l.433, l.452 | KPI, card e tabela com 1 px #18181b | 100 % | — |
| PAL-16 | Ícones de contorno, traço 1,5 | Contorno | l.379, l.443 | SVG fill none, traço 1,5 | 100 % | — |
| PAL-17 | Foco visível de 2 px em focusRing | Idem | l.397, l.464 | 2 px #18181b, afastamento 0 | 100 % | — |
| CMP-1 | Anatomia do login Clássico central | Clássico central | l.23–36 | 10/10; 400 px, padding 32 | 100 % | — |
| CMP-2 | Inputs ≈44 px no desktop | Idem | l.34 | 44 px | 100 % | — |
| CMP-3 | Anatomia do cadastro | Página própria | l.63–87 | 6/6: 5 campos na ordem, termos com links, "Já tem conta? Entrar", requisitos + força | 100 % | — |
| CMP-4 | Dashboard: cabeçalho → KPIs → gráfico 2/3 + atividades 1/3 | Dashboard Swiss | l.710 | 3 períodos, sem ação no cabeçalho; 734/368 px (0,67) | 88 % | C |
| CMP-5 | 3 KPIs | Dashboard: "Quantidade de KPIs: 3" | l.722 | 3 | 100 % | — |
| CMP-6 | Anatomia do KPI | KPIs Swiss | l.636–653 | 6/6: Receita mensal, R$ 48,2 mil, +12,4 %, "vs. mês anterior", ícone, sparkline | 100 % | — |
| CMP-7 | KPI no estilo Swiss | Idem | l.638–657 | Idem (KPIs em faixa com bordas compartilhadas) | 100 % | — |
| CMP-8 | Cards Swiss | Cards Swiss | l.409–444 | 6/6 | 100 % | — |
| CMP-9 | Tabela "Pedidos recentes" | Tabelas Swiss | l.484–519 | 8/8: semântica, colunas, badge, valores à direita (tabular), checkbox, ações, cabeçalho destacado, sem zebra; 4 linhas | 100 % | — |
| CMP-10 | Tabela no estilo Swiss | Idem | l.490–495 | Raio 0, réguas de 1 px, cabeçalho em caixa alta 0,08em | 100 % | — |
| CMP-11 | Formulário Swiss | Formulários Swiss | l.559–592 | Idem, mas a textarea tem caixa completa | 90 % | C |
| CMP-12 | Tipografia Swiss | Swiss | l.416, l.437–439 | Títulos 750–760 com letter-spacing negativo; rótulos e botões em caixa alta 0,08em | 100 % | — |
| CMP-13 | Popover de notificações + menu de perfil | Trilha de Contexto | l.203, l.223–224 | 320 px; menu com "Preferências" no lugar de "Configurações" | 88 % | C |
| CMP-14 | Estados de carregando, vazio e erro | Tabelas + Regras G | l.489, l.821 | Filtro sem resultado, `?erro=1`, esqueletos no painel | 100 % | — |
| CMP-15 | [J] Semelhança com as prévias Swiss | Capturas 25-* | — | Próxima; filtro de período preenchido em vez de sublinhado | 80 % | D |
| INT-1 | Login vazio: erros por campo + resumo role=alert | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.41 | Idem (resumo sem links) | 100 % | — |
| INT-2 | Validação ao sair do campo | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.41 | "Informe um e-mail válido…" | 100 % | — |
| INT-3 | Erro genérico de credenciais | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.42 | "E-mail ou senha incorretos." | 100 % | — |
| INT-4 | Mostrar/ocultar senha | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.40 | Dentro do campo; aria-label alterna; aria-pressed | 100 % | — |
| INT-5 | "Entrando…" desabilitado | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.44 | Sim (+aria-busy) | 100 % | — |
| INT-6 | Recuperação com mensagem neutra | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.43 | "Se o e-mail existir, enviaremos um link." | 100 % | — |
| INT-7 | Comportamentos do cadastro (8) | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.80–89 | 8/8 | 100 % | — |
| INT-8 | Cadastro válido conclui | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.63 | Entra no app | 100 % | — |
| INT-9 | Recolher/expandir 252↔72, tooltip, localStorage | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.273 | 4/4 (252 em vez de 248: E) | 100 % | — |
| INT-10 | Clique na sidebar marca o ativo | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.272 | Sim | 100 % | — |
| INT-11 | Popovers: Esc, clique fora, dentro da viewport | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.223–232 | Sim; popover cabe a 390 px | 100 % | — |
| INT-12 | Menu ⋯ abre para cima | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.275 | Sim (+Ajuda) | 100 % | — |
| INT-13 | Sair volta ao login | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.224 | Sim | 100 % | — |
| INT-14 | Sombra do header após 8 px | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.222 | Sim | 100 % | — |
| INT-15 | Sobreposição do tablet: scrim, Esc, clique fora | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.138 | Sim + foco preso e devolvido | 100 % | — |
| INT-16 | Bottom nav: troca, toque no ativo, rolagem por destino | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.171–173 | 3/3 (600 px preservados; toque no ativo leva a 0) | 100 % | — |
| INT-17 | Tabela: selecionar todos/indeterminado, aria-sort, ações | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.506, l.537 | 3/3 (botão "Ver" por linha) | 100 % | — |
| INT-18 | Formulário: validação, resumo com links, "Enviando…" | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.610–611 | Resumo sem links para os campos | 75 % | C |
| INT-19 | Filtro de período atualiza todos os blocos | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.757 | Sim, com carregamento por bloco | 100 % | — |
| INT-20 | Teclado: foco, Esc devolve o foco, foco preso | Login/Cadastro/Header/Sidebar/Componentes escolhidos | l.287, l.294–295 | 3/3 | 100 % | — |
| RSP-1 | Sem overflow no app (14 larguras × 5 rotas) | Validação em celular, tablet e desktop | l.786 | 0 casos | 100 % | — |
| RSP-2 | Sem overflow no login/cadastro (14 larguras) | Validação em celular, tablet e desktop | l.50, l.94 | 0 casos | 100 % | — |
| RSP-3 | Sem texto cortado nem sobreposição | Validação em celular, tablet e desktop | l.787–788 | "Atlas Workspace" cortado a 1024 px: 1 caso | 75 % | C |
| RSP-4 | Alvos ≥ 44×44 a 390 px (links dentro de frases excluídos) | Validação em celular, tablet e desktop | l.789 | 22/30 = 73 % ("Esqueci minha senha" 23 px, rodapé 36 px, checkboxes de tarefa 40 px) | 50 % | C |
| RSP-5 | Tabela no celular | Validação em celular, tablet e desktop | l.547 | Cartões | 100 % | — |
| RSP-6 | KPIs 3 → 2 → 1 sem corte | Validação em celular, tablet e desktop | l.695 | 3/2/1 colunas a 1440/820/390 | 100 % | — |
| RSP-7 | Inputs ≥ 16 px no celular | Validação em celular, tablet e desktop | l.48, l.790 | 16 px no login, no cadastro e no formulário | 100 % | — |
| RSP-8 | 100dvh e prefers-reduced-motion | Validação em celular, tablet e desktop | l.796, l.798 | Ambos | 100 % | — |

## 5. Notas por dimensão

As notas são médias simples dos requisitos de cada dimensão. Notação: % (número de requisitos).

| Dimensão | dev-1 | dev-2 | dev-3 | O que derruba a nota |
|---|---|---|---|---|
| Arquitetura | 95,0 % (10) | 100,0 % (10) | 90,0 % (10) | Página inicial não exportada (A) em dev-1 e dev-3. Destinos móveis renomeados ou inacessíveis (B) em dev-3 |
| Desktop | 97,5 % (13) | 94,2 % (13) | 90,6 % (13) | Sidebar sai do lugar no Painel (C) em dev-2 e dev-3. Avatar de 40 px (C). Trilha de 2 níveis (B) e rodapé sem atalho (C) em dev-3. Semelhança visual `[J]` (D) |
| Celular | 91,2 % (13) | 90,0 % (13) | 89,6 % (13) | Destinos da bottom nav (A) nos três. Barras acima de 25 % na horizontal (C) em dev-3 |
| Paleta e identidade | 100,0 % (17) | 98,5 % (17) | 97,1 % (17) | Erro de campo em cor de texto (E) em dev-2 e dev-3. Geometria mista na página Início (D) em dev-3 |
| Componentes | 98,5 % (15) | 99,0 % (15) | 96,4 % (15) | Sobretítulo "01 —" (C) em dev-1. Ação no cabeçalho do painel, textarea com caixa e menu de perfil (C) em dev-3 |
| Interações | 100,0 % (20) | 100,0 % (20) | 98,8 % (20) | Resumo de erros sem links (C) em dev-3 |
| Responsividade | 96,9 % (8) | 90,6 % (8) | 90,6 % (8) | Alvos de toque menores que 44 px (C). Reticências na sidebar (C) em dev-2 e dev-3 |
| **Geral** | **97,4 % (96)** | **96,7 % (96)** | **94,2 % (96)** | |

Os três julgamentos de design `[J]` foram:

| Requisito | dev-1 | dev-2 | dev-3 | Origem |
|---|---|---|---|---|
| DSK-13 | 75 | 75 | 70 | D |
| CEL-13 | 60 | 70 | 65 | A |
| CMP-15 | 85 | 85 | 80 | D |

Sem eles, a nota geral fica em 98,2 % (dev-1), 97,3 % (dev-2) e 94,9 % (dev-3), sobre 93 requisitos.

## 6. Comparação entre os três sites

### 6.1 Decisões interpretadas de forma diferente (indício de ambiguidade no prompt)

| Decisão | dev-1 | dev-2 | dev-3 | Trecho do prompt responsável |
|---|---|---|---|---|
| 4 destinos da bottom nav | Início, Painel, Projetos, Mais | Painel, Projetos, Tarefas, Mais | Início, Projetos, Equipe, Ajustes | l.150 "4 itens" sem nomes; l.188 "mesmos destinos"; l.202 (3 links do header) |
| Acesso aos outros destinos no celular | Página "Mais" (com busca e Sair) | Folha "Mais" (bottom sheet) | Nenhum (6 destinos sem acesso pela barra) | Idem + l.285 "ofereça também uma bottom navigation" |
| Primeira tela depois do login | Início (saudação) | Painel "Visão geral" | Início (saudação) | Não especificado (prévia: "Visão geral") |
| Ação única da topbar do celular | Avatar (menu do perfil com notificações) + logo | Sino | Sino | l.153 "uma ação" × l.230 "logo, avatar, ☰" |
| Trilha do header | Dinâmica por rota, 3 níveis na página do projeto | Idem | "Grupo / Página" | l.204 dá um exemplo fixo sem regra |
| Cabeçalho "Destacado" da tabela | `surfaceAlt` | `surfaceAlt` | `primarySoft` | l.504 sem definição |
| Tabela no celular | Cartões | Rolagem local com coluna fixa | Cartões | l.547 permite as duas (aceitável) |
| Regras de senha | 8 caracteres; letras e números; maiúsculas/minúsculas ou símbolo | 8; maiúsculas e minúsculas; número; símbolo recomendado | 8 com letras e números | l.87 sem regras (a prévia tinha) |
| "Lembrar de mim" | Sessão persistente | Só lembra o e-mail | Sessão persistente | Não especificado |
| Altura do item e título de grupo da sidebar | 40 px / 12 px | 40 px / 12 px | 36 px / 11 px | l.112 × l.252–253 × l.357 |
| Períodos do painel | 7 d / 30 d / 90 d / 12 m | 30 d / 90 d / 12 m | 7 d / 30 d / 90 d | l.757 "filtro de período", sem opções |
| Avatar do header | 40 px | 32 px | 40 px | l.203 é claro (32 px): ver C |
| Indicador de ativo no filtro (Swiss "sublinhado de 2 px") | Sublinhado | Sublinhado | Botão preenchido | l.417 é claro: ver CMP-15 |

### 6.2 O que os três acertaram

- **Entrada:**
  - "Apenas login";
  - login "Clássico central" com cartão de 400 px e padding de 32 px;
  - inputs de 44 px (48 px e fonte de 16 px no celular);
  - erros por campo com `aria-invalid`/`aria-describedby` e resumo `role="alert"`;
  - erro genérico de credenciais;
  - botão de mostrar senha com `aria-pressed`;
  - "Entrando…" desabilitado;
  - recuperação com mensagem neutra;
  - cadastro com os 5 campos na ordem, força da senha com texto, "As senhas não coincidem" em tempo real, toggles independentes, termos obrigatórios e mensagem neutra para e-mail existente.
- **Shell desktop:**
  - sidebar integral de 252×900 px em x 0, sem raio e sem sombra;
  - topo de 64 px alinhado ao header de 64 px, que fica só sobre a coluna principal, sticky, com borda #e6e6e6 e sombra após rolar;
  - item ativo com #e3e3e4, raio de 8 px, barra lateral e `aria-current`;
  - recolher para 72 px com tooltip e `localStorage`;
  - 220 px entre 1024 e 1279 px;
  - trilho de 72 px com sobreposição, scrim, Esc e foco preso entre 768 e 1023 px.
- **Celular:**
  - corte exato em 768 px;
  - topbar de 56 px com título e uma ação;
  - bottom nav fixa de 4 itens iguais, ícone de 24 px e rótulo de 12 px, com pílula e `aria-current`;
  - safe areas e `viewport-fit=cover`;
  - conteúdo nunca escondido atrás da barra;
  - rolagem preservada por destino;
  - toque no destino ativo leva ao topo;
  - nenhum drawer.
- **Identidade:**
  - 44/44 tokens de cor exportados presentes, com valores idênticos;
  - praticamente nenhuma cor fixa fora dos tokens;
  - Inter;
  - base de 15 px;
  - sem gradientes decorativos nem sombras em superfícies.
- **Componentes:**
  - 3 KPIs com a anatomia completa ("Receita mensal, R$ 48,2 mil, +12,4 %, vs. mês anterior") e sparkline;
  - gráfico de barras e atividades em 2/3 + 1/3;
  - tabela semântica "Pedidos recentes" com 4 linhas, ordenação `aria-sort`, seleção com indeterminado, ações por linha e estados;
  - formulário Swiss sublinhado em 2 colunas;
  - cards Swiss 16/9.
- **Responsividade:** nenhum overflow horizontal em 14 larguras, nas 5 rotas do app e nas telas públicas.

### 6.3 Observações não pontuadas (fora da rubrica fixada antes)

- **KPI, tooltip e clique** (l.685). dev-1 e dev-2 têm tooltip real com valor ("19/10–20/10: R$ 1.773,00"; "jun: R$ 40,2 mil"). dev-3 usa só `<title>` nativo com valores normalizados ("Ponto 3: 52"). O clique leva ao relatório nos três.
- **Accordion de grupos** (facultativo, l.133): os três implementaram.
- **Busca:** os três puseram a busca no header (l.114). A busca da sidebar pertence à composição B, que não foi escolhida, e os três notaram isso.
- **Celular na horizontal a 844×390** (largura ≥ 768): os três mostram a arquitetura desktop com trilho. O corte de 768 px e a regra da horizontal se contradizem (D), então não pontuei.

## 7. Falhas por tipo

### 7.1 Contagem (desvios com nota abaixo de 100 %)

| Origem | dev-1 | dev-2 | dev-3 | Total |
|---|---|---|---|---|
| A — Studio não registrou/exportou | 3 | 2 | 3 | **8** |
| B — Master Prompt ambíguo/incompleto/contraditório | 0 | 0 | 2 | **2** |
| C — Desenvolvedor não seguiu instrução clara | 3 | 3 | 9 | **15** |
| D — Conflito/limitação da especificação | 2 | 2 | 3 | **7** |
| E — Diferença aceitável (com perda pequena) | 0 | 1 | 1 | **2** |
| **Total** | **8** | **8** | **18** | **34** |

Também houve diferenças aceitáveis com nota cheia (E), por exemplo:

- rotas por hash (`#/cadastro`);
- 252 em vez de 248 px;
- títulos de grupo de 12 px;
- linha de credenciais de demonstração;
- logo na topbar do celular;
- recolher 252↔72.

### 7.2 Lista das falhas

**A — Studio**

| Falha | Sites | Evidência | Recomendação ao Studio |
|---|---|---|---|
| A1. Destinos da bottom nav ausentes do prompt (CEL-3, CEL-13) | dev-1 25 %, dev-2 0 %, dev-3 25 % | Prévia `11-mobile-previa-toque-agenda.png` × l.150 "4 destinos rotulados" | Exportar a lista: "Destinos (na ordem): Início, Buscar, Agenda, Perfil; ícones home, search, calendar, user" |
| A2. Página inicial do app ausente (ARQ-4) | dev-1 e dev-3, 50 % | Prévia integrada abre em "Visão geral" com "Início" ativo; o prompt não diz | Exportar: "Depois do login, a rota inicial é o Dashboard 'Visão geral', que corresponde ao item 'Início' da sidebar" |
| A3 (latente). Regras de senha da prévia não exportadas | Divergência entre os 3 | `07-cadastro-previa-desktop.png` × l.87 | Exportar: "Requisitos: mínimo de 8 caracteres, 1 letra maiúscula e 1 número" |
| A4 (latente). Arranjo "Sidebar inteira" não persiste | Nenhum site falhou | Relatório da Fase 2, B11 | Persistir o arranjo e derivar a largura do header a partir dele |

**B — Master Prompt (falhas que causaram desvio)**

| Falha | Site | Trecho atual | Redação corrigida sugerida |
|---|---|---|---|
| B1. "4 destinos" × "mesmos destinos nas duas versões" (ARQ-10) | dev-3 (50 %) | l.150 "Bottom Navigation fixa … com 4 itens de largura igual"; l.188 "As regiões … mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões."; l.202 "Navegação principal com 3 itens (Projetos, Equipe, Ajustes)" | "Bottom Navigation com 4 destinos fixos: **Início, Buscar, Agenda e Perfil**, com os mesmos rótulos usados na sidebar quando o destino existir nela. Os demais destinos da sidebar (Painel, Projetos, Tarefas, Pessoas, Mensagens, Relatórios, Configurações, Ajuda) continuam acessíveis no celular a partir de Perfil ou de uma tela 'Mais', sem drawer. Não use os links do header como destinos." |
| B2. Trilha dada como exemplo fixo (DSK-10) | dev-3 (83 %) | l.204 "Breadcrumbs 'Projetos / Site institucional / Página inicial' dentro da barra, logo após o logo" | "Breadcrumbs dinâmicos que mostram a hierarquia de **páginas** da rota atual (Seção / Página / Subpágina; ex.: em uma subpágina de projeto, 'Projetos / Site institucional / Página inicial'). O nome do grupo da sidebar não entra na trilha. O último nível tem peso 600 e `aria-current='page'`." |

**C — Desenvolvedor**

| Falha | Site | Instrução clara (trecho) | Resultado |
|---|---|---|---|
| C1. Sidebar deixa de ser fixa no Painel (DSK-11) | dev-2 e dev-3 (50 %) | l.131 "A sidebar é fixa (position: sticky; top: 0; height: 100dvh) … a página rola apenas na coluna de conteúdo" | Um elemento oculto (tabela para leitor de tela) aumenta o documento em 120 ou 152 px. No fim da rolagem, a sidebar sobe, o logo sai da tela e sobra uma faixa branca (`capturas/dev-3-sticky-fim-apppainel.png`) |
| C2. Alvos de toque menores que 44 px (RSP-4) | dev-1 90 %, dev-2 85 %, dev-3 73 % | l.789 "Alvos de toque com no mínimo 44 × 44 px no celular" | dev-1: botão de olho 44×40. dev-2: logo 187×28 e rodapé com 32 px. dev-3: "Esqueci minha senha" com 23 px, rodapé com 36 px e checkboxes de tarefa com 40 px |
| C3. Reticências e texto cortado (RSP-3) | dev-2 (3 casos), dev-3 (1) | l.787 "Nenhum texto cortado" | dev-2: "Gerente de pr…" a partir de 1024 px. dev-3: "Atlas Workspace" a 1024 px |
| C4. Avatar de 40 px (DSK-10) | dev-1 e dev-3 | l.203 "avatar circular de 32 px" | 40 px |
| C5. Sobretítulo numerado (CMP-8) | dev-1 | l.416 "sobretítulos numerados (01 —)" | "01" no canto da mídia |
| C6. Rodapé sem atalho de configurações (DSK-9) | dev-3 | l.113 "Rodapé da sidebar com perfil do usuário e atalho de configurações" | Só o menu ⋯ |
| C7. Barras acima de 25 % na horizontal (CEL-10) | dev-3 | l.178 "barras fixas somadas nunca passam de 25% da altura" | 25,6 % e 26,7 % |
| C8. Painel sem ações no cabeçalho (CMP-4) | dev-3 | l.710 "Cabeçalho da página (título, período, ações)" | Só o seletor de período |
| C9. Textarea com caixa completa (CMP-11) | dev-3 | l.565 "Campos sublinhados (apenas linha inferior)" | Borda nos 4 lados |
| C10. Menu de perfil com "Preferências" no lugar de "Configurações" (CMP-13) | dev-3 | l.224 "'Meu perfil', 'Configurações', 'Ajuda' e 'Sair'" | Meu perfil, Preferências, Ajuda, Sair |
| C11. Resumo de erros sem links (INT-18) | dev-3 | l.610 "resumo de erros no topo com links para os campos" | Resumo em texto |

**D — Especificação**

| Falha | Sites | Conflito |
|---|---|---|
| D1. Visual do app difere da prévia integrada (DSK-13, CMP-15) | Os três | A prévia integrada, que o usuário aprovou na etapa 6, tem cartões arredondados. Os componentes Swiss escolhidos depois (raio 0, tinta) não atualizaram a prévia. O prompt manda Swiss |
| D2. Geometria mista na página Início (PAL-12) | dev-3 | l.299 "Exceções só onde estiverem explicitamente listadas" × Swiss "Raio 0 em tudo": o prompt não diz se painéis genéricos da área de conteúdo são Swiss |

**E — Aceitáveis com perda pequena**

- E1 (PAL-8), dev-2 e dev-3: a mensagem de erro sob o campo usa a cor `text`, e o vermelho fica na borda e no ícone. A escolha é justificada nas NOTES pelo contraste de `error` sobre `errorBg`. O prompt não fixa a cor desse texto.

### 7.3 Problemas latentes de origem B no prompt (sem perda de nota, mas obrigaram decisões)

| # | Trecho atual | Efeito observado | Redação corrigida sugerida |
|---|---|---|---|
| L1 (C1) | l.199 "Barra principal com 56 px de altura, largura total da janela (full width)" | Os 3 ignoraram, com razão | "Barra principal de 64 px sobre a coluna principal, à direita da sidebar integral; não passa por cima da sidebar." |
| L2 (C2) | l.230 "Abaixo de 768 px: barra única de 56 px com logo, avatar, botão de menu ☰"; l.281 "vira um drawer à esquerda…"; l.285 "ofereça também uma bottom navigation" | Os 3 descartaram o ☰ e o drawer, depois de registrar a contradição | Com o layout mobile "Bottom Navigation clássica": "Abaixo de 768 px a navegação é a Bottom Navigation aprovada. O header vira a topbar de 56 px com título e **uma** ação (sino). Não há ☰, painel de menu nem drawer." |
| L3 (C3) | l.201 "Logo: … (marca fictícia 'Tucano' na prévia — substitua pela marca real)" | Os 3 tiraram o logo do header | "No layout Sidebar integral, o logo (símbolo de 28 px + 'Atlas Workspace') aparece só no topo da sidebar; o header não repete o logo." |
| L4 (C4) | l.109/110 "252px" × l.249 "248 px"; l.137 "220 px" × l.279 "≥ 1024: 248 px"; l.112 "40–44 px" × l.252 "36 px"; l.253 "11 px" × l.357 "nunca < 12 px" | 2 leituras de altura de item e de corpo do título | Um único valor por medida: "Sidebar 252 px (≥ 1280), 220 px (1024–1279), trilho de 72 px (768–1023); header 64 px; itens 40 px; ícones 20 px; títulos de grupo 12 px." |
| L5 (C5) | l.299 "Exceções só onde estiverem explicitamente listadas" × componentes "Raio 0", "14 px", "Inter 760" | Os 3 inventaram a mesma fronteira; dev-3 deixou painéis arredondados no conteúdo | "Exceção explícita à identidade global: a área de conteúdo do app (cards, tabelas, formulários, KPIs, dashboard e painéis de página) usa Swiss Minimal (raio 0, borda de 1 px em `text`, base 14 px, títulos 760). Login, cadastro, sidebar, header, bottom nav e elementos flutuantes usam a identidade global (raio 8 px, borda `border`, base 15 px, títulos 650)." |
| L6 (C6) | l.187 "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber" | Os 3 cortaram em 768 px | "A estrutura desktop vale a partir de 768 px (trilho até 1023 px); abaixo de 768 px vale a Bottom Navigation." |
| L7 (C7) | l.202 "Navegação principal com 3 itens (Projetos, Equipe, Ajustes)" | Omitidos no desktop; viraram destinos móveis no dev-3 | Remover da composição A: "A composição A não tem links de navegação no header; a navegação é a sidebar." |
| L8 (C8) | l.423 "Título: Viagem a Lisboa", l.573 "Título: Fale com a gente", l.4 "Todas as decisões abaixo foram … aprovadas" | Mistura de domínios (viagens × workspace) | Marcar como exemplo: "Conteúdo de exemplo, substituível pelo domínio do produto: …". No cabeçalho, distinguir "escolhido pelo usuário" de "padrão do Studio". |
| L9 | l.504 "Estilo do cabeçalho: Destacado" | 2 leituras (`surfaceAlt` × `primarySoft`) | "Cabeçalho destacado: fundo `surfaceAlt`, rótulos de 12 px em caixa alta (650, 0,08em), régua inferior de 1 px em `text`." |
| L10 | l.83 "Se o e-mail já existir, a mensagem é neutra e oferece 'Entrar' ou 'Recuperar senha'" × l.100 "sem expor se um e-mail já existe" | Os 3 resolveram com mensagem genérica | "Depois do envio, mostre sempre a mesma mensagem neutra ('Se este e-mail puder ser usado, enviaremos as instruções; se você já tem conta, Entrar ou Recuperar senha'), exista ou não a conta." |
| L11 | l.27 "'Lembrar de mim'" sem comportamento | dev-2 só lembra o e-mail; dev-1 e dev-3 mantêm a sessão | "'Lembrar de mim' mantém a sessão entre visitas; sem a marcação, a sessão termina ao fechar o navegador." |
| L12 | l.178 "Na horizontal (altura < 500 px), a barra inferior reduz para ≈48 px" × l.179 "A partir de 768 px passa a valer a arquitetura desktop" | A 844×390, os 3 mostram o desktop | "Celular na horizontal: se a largura for menor que 768 px, … ; com largura ≥ 768 px e altura < 500 px, mantenha a Bottom Navigation compacta (48 px) em vez do trilho." (ou declarar que vale o desktop) |
| L13 | l.273 "alterna entre 248 e 72 px" | Os 3 usaram 252↔72 | Usar o mesmo número do layout (252 px). |
| L14 | l.87 "indicação dos requisitos de senha" (sem regras); l.757 "Filtro de período" (sem opções) | 3 regras de senha e 3 conjuntos de período diferentes | Listar as regras (ver A3) e as opções: "Períodos: 7 dias, 30 dias (padrão), 90 dias, 12 meses." |

## 8. As 5 falhas mais importantes

1. **A1. Destinos da bottom navigation não exportados (A).** O Studio mostrou Início, Buscar, Agenda e Perfil. O prompt só diz "4 destinos". Saíram três conjuntos diferentes, e nenhum é o da prévia (CEL-3: 25/0/25 %). É o maior desvio do celular nos três sites.
2. **C1. Sidebar deixa de ser fixa no Painel (C), em dev-2 e dev-3.** No fim da rolagem, a sidebar sobe 120 ou 152 px, o logo some e aparece uma faixa branca. Isso quebra o "integral do topo à base" na página principal (DSK-11: 50 %).
3. **A2. Página inicial do app não exportada (A).** dev-1 e dev-3 abrem numa saudação ("Bom dia…") em vez do painel "Visão geral" da prévia (ARQ-4: 50 %).
4. **C2. Alvos de toque menores que 44 px no celular (C).** A conformidade foi de 90 % no dev-1, 85 % no dev-2 e 73 % no dev-3, sobretudo em links secundários, no logo e nos checkboxes.
5. **B1. "4 destinos" × "mesmos destinos nas duas versões" (B),** somado às regras contraditórias de ☰/drawer. dev-3 deixou 6 destinos sem acesso pela barra e renomeou Pessoas → "Equipe" e Configurações → "Ajustes" (ARQ-10: 50 %).

Logo depois vem **D1**: a prévia integrada aprovada não reflete os componentes Swiss escolhidos depois. O usuário aprovou um visual (cartões arredondados) diferente do que o prompt manda construir (DSK-13 e CMP-15 nos três sites).

## 9. Arquivos

- **Rubrica:** `rubrica.md`.
- **Capturas** (`capturas/`, 175 arquivos):
  - `dev-N-{login,cadastro}-{1440x900,390x844}[-full].png`;
  - `dev-N-painel-{1440x900,768x1024,390x844}[-full].png`;
  - `dev-N-app-inicial-*.png`;
  - telas de erro, recuperação e cadastro: `dev-N-login-erros-vazio.png`, `-erro-credenciais.png`, `-recuperacao-enviada.png`, `-cadastro-email-existente.png`, `-cadastro-sucesso.png`;
  - shell: `-sidebar-recolhida-1440.png`, `-notificacoes-1440.png`, `-menu-perfil-1440.png`, `-menu-sidebar-1440.png`, `-tablet-sobreposicao-900.png`;
  - celular: `-cel-toque-N.png`, `-cel-horizontal-*.png`, `-cel-fim-da-rolagem.png`;
  - sidebar sticky: `-sticky-fim-*.png`;
  - componentes: `-tabela-*.png`, `-form-*.png`, `-cards-*.png`, `-sparkline-tooltip.png`, `-trilha-*.png`.
- **Composições lado a lado** (`composicoes/`, Studio × dev-1 × dev-2 × dev-3, mesma altura):
  - `01` app desktop;
  - `02` primeira tela;
  - `03` e `04` login e cadastro desktop;
  - `05` e `06` celular;
  - `07` e `08` login e cadastro no celular;
  - `09` tablet;
  - `10` tabela;
  - `11` formulário;
  - `12` cards;
  - `13` KPI e dashboard;
  - `14` sidebar recolhida;
  - `15` menu do perfil.
- **Medições:** `medicoes/*.json` (saída bruta de cada script) e `medicoes/s15-notas.json` (notas consolidadas).
- **Scripts:** `scripts/`. Rodam com Node 22 + Playwright e exigem os servidores nas portas 4511, 4512 e 4513.
