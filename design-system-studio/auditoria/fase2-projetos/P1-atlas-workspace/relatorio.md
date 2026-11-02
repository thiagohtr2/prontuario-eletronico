# Relatório — P1 Atlas Workspace no Design System Studio

- **Site:** http://127.0.0.1:4300/ (Atelier UI · Design System Studio, versão congelada)
- **Data:** 02/11/2026
- **Ambiente:** Playwright 1.63 com Chromium e perfil persistente vazio em `perfil/`; viewport 1440×900; sem leitura de código, docs ou relatórios de outros agentes. Os scripts de automação usados estão em `scripts/` (só infraestrutura de navegação).
- **Escolhas:** ver `escolhas.md`.

## 1. Passo a passo resumido

1. **Início.** Abri o site com o armazenamento vazio ("Projeto sem nome") e escolhi o modo **Guiado**, que tem 10 etapas: 5 de Esqueleto e 5 de Acabamento. O Acabamento fica bloqueado até o esqueleto ser aprovado.
2. **1. Objetivo.** Preenchi:
   - Tipo "Aplicativo ou SaaS";
   - Nome "Atlas Workspace";
   - Objetivo "SaaS profissional";
   - Tecnologia: chip "HTML + CSS + JavaScript".

   O Studio sugeriu o fluxo "Landing page com chamada para login". Não usei a sugestão.
3. **2. Entrada.** Escolhi:
   - Fluxo "Apenas login";
   - Login "Clássico central", entre 24 modelos;
   - Cadastro "Página própria de cadastro", entre 8 fluxos.

   Abri as prévias em Computador e Celular, nas telas Entrar e Criar conta.
4. **3. Desktop.** Escolhi "Sidebar integral clássica", entre 42 modelos. Um clique no desenho já faz a escolha.
5. **4. Mobile.** Escolhi "Bottom Navigation clássica", entre 44 modelos. Testei os toques na prévia do celular.
6. **5. Revisão.** Cliquei em "Aprovar esqueleto e continuar".
7. **6. Prévia integrada.** Capturei Aplicação, Login e Cadastro em Computador, Tablet e Celular. Fiz o mesmo no módulo "Live Site Preview" do modo Livre, onde também testei menus.
8. **7. Identidade visual.** Escolhi a paleta "Neutro Essencial" (categoria Minimalistas), que já vinha pré-selecionada. Inspecionei as abas Ajustar cores, Tipografia e Formas e superfícies, sem alterar nada.
9. **8. Headers e sidebars.** Escolhi:
   - Header "Trilha de Contexto · A", pelo filtro Minimalistas;
   - Sidebar "Clássica Integral · A".

   Na aba Combinação testei os arranjos da prévia.
10. **9. Componentes.** Adicionei 5 componentes, todos na família "Swiss Minimal", e mantive as configurações padrão: Cards, Tabelas, Formulários, KPIs e stat cards, Dashboard.
11. **10. Master Prompt.** A tela mostrou 15 itens, 0 retirados, **0 contradições** e 0 pendentes. Conferi as abas Itens, Contradições e Especificação JSON.
12. **Exportações.** Baixei:
    - tudo da página "Exportar e importar";
    - os botões equivalentes da etapa 10 e da Central de Prompts;
    - "CSS dos tokens" e "Prompt da identidade";
    - "Exportar especificação" do header e da sidebar;
    - os 15 prompts individuais;
    - o executor da Validação responsiva.

    Depois, um novo download do Master Prompt saiu idêntico, salvo pelo carimbo de hora. Ou seja, nada mudou no projeto depois da exportação.

## 2. Contradições

### 2.1 Apontadas pelo Studio

**Nenhuma.** A aba "Contradições (0)" diz "Nenhuma contradição encontrada — As escolhas atuais são compatíveis entre si." Captura: `capturas/42-master-prompt-aba-contradicoes-0.png`.

### 2.2 Não apontadas pelo Studio

Encontrei estas inconsistências comparando as prévias com o arquivo `exportados/atlas-workspace-master-prompt.md` (o número de linha se refere a esse arquivo). Não as resolvi, por três motivos:

- o Studio não as aponta;
- não há seletor que as elimine (o "Arranjo da prévia" não é salvo);
- a única saída seria escrever texto livre em "Adicionar observação ou exceção", o que mudaria a evidência das escolhas.

| # | Contradição | Onde | Gravidade para a fidelidade |
|---|---|---|---|
| C1 | No layout, "O header fica somente sobre a coluna principal — não passa por cima da sidebar" (l.114). No header Trilha de Contexto, "Barra principal com 56 px de altura, **largura total da janela (full width)**" (l.199). | Layout desktop × Header | Alta |
| C2 | No celular, o layout escolhido é "Bottom Navigation clássica" (topbar com título e uma ação; lateral: none; sobreposição: none), e o layout desktop diz "não converta a navegação desktop em drawer" (l.139). Mesmo assim, o header diz "Abaixo de 768 px: … botão de menu ☰ … painel do menu" (l.230), a sidebar diz "Abaixo de 768 px: … vira um drawer à esquerda … ☰" (l.281) e ainda "ofereça também uma bottom navigation" (l.285), como se fosse opcional. A prévia isolada da sidebar no celular abre com um drawer (`20-sidebar-classica-integral-grande-celular.png`). Já a prévia do header no celular não mostra ☰, mostra "‹ Site institucional" (`19-header-trilha-de-contexto-grande-celular.png`). Ou seja, a prévia e o prompt divergem. | Header/Sidebar × Layout mobile | Alta |
| C3 | Logo duplicado: o topo da sidebar tem logo e nome (layout l.111; sidebar composição A), e o header também tem logo, a marca fictícia "Tucano" (l.201). Nas prévias aparecem "Ipê" na sidebar e "Tucano" no header ao mesmo tempo, e nenhum dos dois é "Atlas Workspace". A aba Combinação avisa "Logo uma vez só" apenas para o arranjo "Header por cima", que não corresponde ao layout escolhido. | Header × Sidebar × Layout | Média |
| C4 | Medidas: o header tem 56 px (Trilha de Contexto) contra ≈64 px (layout). A sidebar tem 248 px (Clássica Integral) contra ≈252 px (layout). | Header/Sidebar × Layout | Baixa |
| C5 | Na identidade global: cantos 8 px, base 15 px, títulos peso 650. Nos 5 componentes Swiss Minimal: "Raio dos contêineres: 0 px", "Tamanho base: 14 px", "Fonte de títulos: Inter 760" (l.432–440 e repetições). As "Regras de implementação" mandam preservar a identidade global. | Identidade × Componentes | Média |
| C6 | Breakpoints: "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber" (l.187), contra "A partir de 768 px passa a valer a arquitetura desktop" (l.179). | Responsividade | Baixa |
| C7 | O header lista "Navegação principal com 3 itens (Projetos, Equipe, Ajustes)" (l.202) junto com a trilha. A prévia da composição A mostra só a trilha. As descrições das composições A e B são idênticas ("logo e navegação juntos à esquerda; busca e ações…"). | Header | Baixa |
| C8 | Conteúdo de exemplo aparece como decisão aprovada: Cards "Viagem a Lisboa"/ícone Avião (l.423), Formulário "Fale com a gente" (l.573), trilha "Projetos / Site institucional / Página inicial". O cabeçalho afirma "Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário" (l.4), mas inclui padrões nunca alterados, como tipografia, geometria e a paleta pré-selecionada. | Master Prompt | Média |

## 3. Bugs encontrados

| # | Bug | Gravidade | Evidência |
|---|---|---|---|
| B1 | O contador "Esqueleto N/5" só conta as etapas confirmadas pelo botão "Continuar". Com as 5 etapas preenchidas pela barra lateral, a Revisão mostrava "Esqueleto 0/5" e "Esqueleto completo", e já tinha o título "Esqueleto aprovado" antes da aprovação. Depois de aprovar, o contador foi para "1/5". Só chegou a 5/5 quando cliquei "Continuar" em cada etapa. | Média | `12-revisao-esqueleto-antes-aprovar-full.png`, `13-bug-contador-esqueleto-1de5-apos-aprovar.png` |
| B2 | Na Prévia integrada e no Live Site Preview, a marca aparece duplicada e fictícia: "Ipê" na sidebar e "Tucano" no header. O nome do projeto ("Atlas Workspace") só aparece nas telas de login e cadastro. | Média | `34-previa-integrada-aplicacao-computador-palco.png`, `21-combinacao-previa-sidebar-inteira-viewport.png` |
| B3 | No Live Site Preview (desktop), o popover de Notificações do header fica cortado: só aparece a linha "Notificações · 2 novas". Na prévia isolada do header ele funciona. | Média | `36-live-preview-desktop-notificacoes.png` × `19-header-trilha-de-contexto-celular-notificacoes.png` |
| B4 | Em Identidade visual, a 1440×900, os botões "Prompt da identidade" e "CSS dos tokens" do painel fixo ficam escondidos sob a barra fixa "Voltar / Continuar: Navegação" durante quase toda a rolagem. O clique cai em "Continuar". Só ficam acessíveis no fim da página (scrollY ≈ 8850). Por isso a primeira tentativa de baixar o CSS dos tokens não gerou download. | Média | `40-bug-botoes-prompt-css-identidade-ocultos-sob-barra-fixa.png`, `40-identidade-fim-da-pagina-botoes-css.png` |
| B5 | No Live Site Preview, "Recolher menu" transforma a sidebar em trilho, mas a coluna mantém a largura original e sobra uma faixa branca vazia. | Baixa | `36-live-preview-desktop-sidebar-recolhida.png` |
| B6 | Em Central de Prompts › Itens › "Prompt deste elemento", o diálogo tem o título genérico "Prompt individual — Elemento" e **todos os 15 downloads saem com o mesmo nome `prompt-elemento.md`**, que se sobrescrevem ou duplicam. Na etapa Desktop, o mesmo recurso mostra o nome do elemento. | Baixa | `43-bug-prompt-individual-titulo-generico-elemento.png` |
| B7 | Em Componentes, clicar no cartão de uma família mostra o selo "Escolhido", mas o componente não entra no projeto: o painel continua "No projeto 0" até clicar em "Adicionar ao projeto". Isso induz a erro. | Baixa | `23-bug-familia-marcada-escolhido-sem-estar-no-projeto.png` |
| B8 | Na prévia de Tabelas · Swiss Minimal, o badge "CANCELADO" aparece cortado ("CANCELADC"). | Baixa | `25-personalizar-tabelas.png` |
| B9 | Na prévia do celular (Bottom Navigation clássica), Buscar, Agenda e Perfil só movem o destaque: o título e o conteúdo continuam "Início". "Notificações" não faz nada. O item ativo não expõe estado (pressed ou current) na árvore de acessibilidade. | Baixa | `11-mobile-previa-toque-*.png`, `37-live-preview-celular-toque-*.png` |
| B10 | Na Revisão do esqueleto, o cartão "Cadastro · Página própria de cadastro" mostra "Sem prévia", embora a prévia exista na etapa 2. | Baixa | `12-revisao-esqueleto-antes-aprovar-full.png` |
| B11 | Na aba Combinação, o "Arranjo da prévia" abre em "Header por cima" mesmo com o layout "Sidebar integral clássica" (sidebar inteira). A troca para "Sidebar inteira" não persiste depois de recarregar. | Baixa | `21-combinacao-arranjo-header-por-cima-padrao.png`, `21-combinacao-arranjo-sidebar-inteira.png` |
| B12 | Na prévia em Tablet, o e-mail do rodapé da sidebar aparece truncado ("marina@exemplo.c"). | Baixa | `34-previa-integrada-aplicacao-tablet.png` |
| B13 | Acessibilidade (árvore acessível): as abas de Identidade visual não têm `tabpanel`; a prévia da Combinação tem dois landmarks `main` aninhados; o botão "Abrir menu lateral" da prévia da sidebar mantém esse rótulo com `aria-expanded=true`. | Baixa | observado via `ariaSnapshot` (sem captura específica) |

## 4. Dificuldades e limitações

- **"Header minimalista"** não existe como opção nomeada. Precisei escolher dentro do filtro "Minimalistas", e a escolha exigiu julgamento.
- **"Dashboard com indicadores"** não tem lugar no esqueleto. Só pode ser coberto em Componentes (Dashboard + KPIs) ou com o template "Dashboard administrativo".
- O **tipo de projeto** aceita um único valor: "Aplicativo ou SaaS" ou "Dashboard".
- **Padrões viram "decisões aprovadas".** A paleta veio pré-selecionada. Tipografia, geometria e o conteúdo de exemplo dos componentes entram no Master Prompt mesmo sem nenhuma ação do usuário.
- Os **downloads estão espalhados** por vários pontos:
  - Master Prompt e JSON aparecem em 3 lugares;
  - o CSS aparece em 2 lugares;
  - há prompts individuais por item;
  - o header e a sidebar têm "Exportar especificação".

  Os arquivos baixados de pontos diferentes são equivalentes: diferem só no carimbo de hora e no campo de etapa atual.
- **Validação responsiva:** "Baixar configuração" fica desabilitado, porque exige a URL de um site já construído. O `runner.py` foi baixado, mas **não foi executado**.
- **Capturas em página inteira** sobrepõem a barra fixa "Voltar / Continuar" no meio da imagem. É um efeito da técnica de captura, não um bug do site. Por isso usei também capturas de viewport ou só da área da prévia (arquivos `*-palco.png`).

## 5. Lacunas

Nenhuma lacuna absoluta. Há duas aproximações, registradas em `escolhas.md`: Header minimalista e Dashboard com indicadores.

## 6. Arquivos exportados (`exportados/`)

Página **Exportar e importar** (arquivos principais):

| Arquivo (nome original) | Botão de origem | Tamanho |
|---|---|---|
| `atlas-workspace-master-prompt.md` | Master Prompt (.md) › Baixar | 49.120 B |
| `atlas-workspace-especificacao.json` | Especificação JSON › Baixar | 112.928 B |
| `atlas-workspace-tokens.css` | CSS de referência › Baixar | 3.856 B |
| `atlas-workspace-ficha.html` | Ficha do projeto (HTML) › Baixar. Abre sem erros e sem requisições externas (`41-ficha-html-exportada-topo.png`) | 72.007 B |
| `atlas-workspace-backup.json` | Backup completo › Baixar (projeto atual + 0 versões) | 3.849 B |

Outros pontos de download (`exportados/outros-botoes/`):

- `etapa10-entrega/atlas-workspace-master-prompt.md` e `etapa10-entrega/atlas-workspace-especificacao.json`: etapa 10, "Baixar .md" e "Baixar JSON".
- `central-de-prompts/atlas-workspace-master-prompt.md` e `central-de-prompts/atlas-workspace-especificacao.json`: Central de Prompts.
- `identidade/atlas-workspace-tokens.css`: "CSS dos tokens", idêntico ao CSS de referência. A primeira tentativa falhou (ver B4) e a segunda funcionou.
- `identidade/prompt-identidade-visual.md`: "Prompt da identidade" › Baixar .md.
- `headers-e-sidebars/header-trilha-contexto-composicao-a.json` e `headers-e-sidebars/sidebar-classica-integral-composicao-a.json`: "Exportar especificação" no diálogo "Ver em tamanho grande".
- `validacao-responsiva/runner.py`: Validação responsiva › "Baixar executor (runner.py)". Não executado.

Prompts individuais (`exportados/prompts-individuais/`): 15 arquivos, um por item da aba Itens.

- O nome original de todos é `prompt-elemento.md` (ver B6). Para não sobrescrever, salvei o 1º com o nome original e acrescentei `__itemN` aos demais.
- Ordem: 1 Fluxo de entrada, 2 Login, 3 Cadastro, 4 Layout desktop, 5 Layout mobile, 6 Header, 7 Sidebar, 8 Paleta, 9 Tipografia, 10 Geometria, 11 Cards, 12 Tabelas, 13 Formulários, 14 KPIs, 15 Dashboard.

**Falhas de download:** nenhuma definitiva. Só a primeira tentativa de "CSS dos tokens" falhou (B4).

**Caminho do Master Prompt exportado:** `/home/user/prontuario-eletronico/design-system-studio/auditoria/fase2-projetos/P1-atlas-workspace/exportados/atlas-workspace-master-prompt.md`

## 7. Capturas principais (`capturas/`)

- **Site inteiro, prévia integrada:**
  - `34-previa-integrada-{aplicacao,login,cadastro}-{computador,tablet,celular}.png`, com a tela inteira e o painel "Escolhas nesta prévia";
  - `*-palco.png`, só a área da prévia;
  - `36-live-site-preview-aplicacao-{computador,tablet,celular}.png`.
- **Layout desktop em tamanho grande:** `09-desktop-sidebar-integral-classica-previa-grande.png` (e `-sem-legendas`), `09-desktop-prompt-do-elemento.png`.
- **Celular em tamanho grande:** `11-mobile-bottom-nav-classica-previa.png` e `11-mobile-previa-toque-*.png`, `37-live-preview-celular-*.png`. O único menu da Bottom Navigation clássica são as abas; "Notificações" não abre nada.
- **Entrada:** `08-login-classico-central-previa-{desktop,celular}.png`, `08-login-tela-criar-conta-{desktop,celular}.png`, `07-cadastro-previa-{desktop,celular}.png`. Não há landing ("Apenas login").
- **Identidade:** `16-paleta-neutro-essencial-minimalistas.png`, `16-identidade-previa-neutro-essencial.png`, `15-identidade-aba-{tipografia,formas}-padrao.png`.
- **Header e sidebar:** `19-header-trilha-de-contexto-{card,grande,grande-celular}.png`, `20-sidebar-classica-integral-{card,grande,grande-computador,grande-celular}.png`, `21-combinacao-*.png`.
- **Componentes:** `25-personalizar-{cards,tabelas,formularios,kpis-e-stat-cards,dashboard}.png`, `26-componentes-no-projeto.png`.
- **Master Prompt final:** `42-master-prompt-tela-final-etapa10.png`, `42-central-de-prompts-master-prompt.png`, `42-master-prompt-aba-{itens-15,contradicoes-0,json}.png`.
- **Exportação:** `39-exportar-pagina.png`, `41-ficha-html-exportada-topo.png`.
