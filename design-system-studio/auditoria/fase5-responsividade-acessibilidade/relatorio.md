# Fase 5 — Responsividade e acessibilidade do Design System Studio (Atelier UI)

Auditoria independente da versão congelada servida em `http://127.0.0.1:4300/` (rotas por hash), com leitura do
código em `design-system-studio/src`. Nada no produto foi alterado. Tudo o que está aqui pode ser reproduzido com os
scripts de `scripts/` (Node 22 + Playwright 1.63 + Chromium; axe-core 4.14 instalado em `ferramentas/`).

**Nota final: 5,8 / 10** (rubrica na seção 6). Resumo em uma frase: o Studio quase nunca estoura a largura da tela e os
modais são bem construídos (foco preso, Esc, foco devolvido), mas há um layout quebrado em toda a faixa de tablet e
notebook pequeno (galeria do celular), o link "Pular para o conteúdo" leva para a página inicial, o menu lateral fechado
continua recebendo foco no celular, a barra fixa do construtor guiado esconde o foco e os campos, e o texto secundário
e o anel de foco têm contraste baixo em todas as telas.

---

## 1. O que foi testado, o que não foi e por quê

### 1.1 Matriz de cobertura

| Bloco | Rotas / estados | Tamanhos | Medições | Dados |
| --- | --- | --- | --- | --- |
| Varredura principal | 28 rotas: início, modo livre, as 10 etapas do guiado, 14 módulos (objetivo, landing, login, cadastro, desktop, mobile, preview, cores, navegação, componentes, inspiração, templates), prompt, exportar, validação, projeto | 21 larguras: 320, 344, 360, 375, 390, 412, 430, 480, 500, 600, 640, 700, 768, 820, 900, 1024, 1100, 1280, 1440, 1600, 1920 | 588 páginas medidas | `dados/sweep-A/B/C.json`, `dados/agregado-sweep.tsv` |
| Paisagem | 28 rotas | 844×390, 915×412, 667×375 | 84 | `dados/sweep-D.json` |
| Zoom de página 200 % | 28 rotas | 640×400 sem emulação móvel (= janela 1280×800 a 200 %) | 28 | `dados/sweep-Z.json` |
| Aumento só de texto | 28 rotas com `html{font-size:200%}` injetado | 375, 1280 | 56 | `dados/sweep-E.json` |
| Estado vazio do guiado | etapas 1–5 e tentativa de abrir 6 e 10 sem esqueleto aprovado | 320×700, 375, 1280 | 21 | `dados/diversos.json` |
| Modais, gavetas e menus abertos | busca (Ctrl+K e botão), menu lateral do Studio no celular, prévias ampliadas de landing/login/cadastro, prompt individual, editor de componente, editor de template, visualizador de inspiração, detalhe de header/sidebar, confirmação de limpar projeto, gaveta do celular interativo, menu do header de prévia | 320, 375, 640, 768, 1280, 844×390, 915×412 | 14 cenários × até 8 tamanhos: geometria, foco inicial, 40 Tab + 6 Shift+Tab, Esc, devolução de foco, axe no contêiner | `dados/estados-*.json` |
| axe-core | 28 rotas | 1280 e 375 (emulação móvel) | 56 execuções (tags wcag2a/aa, wcag21a/aa, wcag22aa, best-practice) + coleta de todos os nós de contraste | `dados/axe-rotas-cheio.json`, `dados/axe-agregado.json`, `dados/axe-contraste*.{json,tsv}` |
| Teclado | link de pular, ordem de Tab, foco visível, foco coberto por barra fixa, Enter/Espaço, abas, busca, troca de rota, menu do celular | 1280, 375, 844×390 | — | `dados/teclado.json`, `dados/skip-link.json` |
| Árvore de acessibilidade | 11 telas + 2 modais (`ariaSnapshot`) | 1280 | — | `dados/aria/*.yml` |
| Outros | perda de seleção ao redimensionar, saltos de rolagem ao selecionar/filtrar, teclado virtual (altura reduzida a 420 px com campo focado), `prefers-reduced-motion`, `forced-colors`, mensagens de erro, paradas de Tab por tela | vários | — | `dados/diversos.json`, `forced-colors.json`, `erros.json`, `paradas-tab.json` |

Total: 777 páginas medidas, 1 130 capturas (`capturas/sw`, `capturas/estados`, `capturas/teclado`, `capturas/detalhes`).

Larguras abaixo de 768 px usam emulação móvel real (`isMobile`, `hasTouch`, `deviceScaleFactor: 2`, user agent Android).
Paisagem usa emulação móvel. 768 px em diante usa navegador de mesa (DPR 1).

**Estado do projeto.** "Cheio" = backup do projeto Nexo Capital exportado na fase 2 (`dados/fixture-projeto-preenchido.json`:
esqueleto aprovado, login corporativo, sidebar clássica, drawer à esquerda, header/sidebar escolhidos, 3 componentes),
injetado no `localStorage`. "Vazio" = `localStorage` limpo.

**O que cada medição detecta** (`scripts/lib.js`): overflow do documento; elementos que passam da viewport sem estar dentro
de um contêiner que rola ou corta (o `body` tem `overflow-x: hidden`, então "sem barra horizontal" não prova nada);
textos cortados (`scrollWidth > clientWidth` com corte/reticências); fonte < 12 px real (considerando a escala das
miniaturas); alvos < 44 px e < 24 px; pares de alvos a menos de 8 px; campos com fonte < 16 px; barras fixas/sticky;
elementos cobertos por outro (`elementFromPoint` percorrendo a página); largura mínima dos cartões. Elementos dentro das
prévias (miniaturas escaladas e simulações de site) são contados à parte.

### 1.2 O que não pôde ser testado

| Limitação | Motivo | Efeito na leitura |
| --- | --- | --- |
| **Sem leitor de tela real** (NVDA, JAWS, VoiceOver, TalkBack) | não há leitor de tela no contêiner | A avaliação de leitor de tela foi feita **apenas** pela árvore de acessibilidade do Chromium (`ariaSnapshot`) e pelo axe. Ordem de leitura, verbosidade e anúncios reais não foram ouvidos. |
| Só Chromium | Firefox e WebKit não instalados (proibido reinstalar navegadores) | Comportamentos do Safari iOS (zoom automático em campo < 16 px, `dvh`, teclado virtual, `position: sticky` sob teclado) não foram observados. |
| Sem aparelhos físicos | ambiente de contêiner | Toque, rolagem inercial e teclado virtual foram emulados. O teclado virtual foi **aproximado** reduzindo a altura da viewport para 420 px com o campo focado; Android/iOS modernos encolhem a viewport visual, não a de layout, então a barra fixa pode ficar atrás do teclado em vez de cobrir o campo. |
| Aumento de fonte do navegador/SO | não há configuração de fonte no Chromium headless | Simulado com `html{font-size:200%}` injetado. |
| Daltonismo, ampliador de tela, controle por voz | fora do ferramental disponível | Contraste medido numericamente; `label-content-name-mismatch` usado como indício para controle por voz. |
| Desempenho/tempos | CPU compartilhada com outros agentes | Nenhuma conclusão depende de tempo. |

---

## 2. Responsividade — problemas por página, largura e componente

### 2.1 Panorama numérico (estado cheio, 21 larguras)

* **Overflow horizontal do documento:** 0 px em 27 das 28 rotas em todas as 21 larguras e nas 3 paisagens. Única exceção:
  modo livre a 320 px (28 px), 344 px (4 px) e 667×375 (6 px).
* **Elementos fora da viewport (Studio):** só o mesmo caso do modo livre. Dentro das prévias, os casos são carrosséis
  horizontais intencionais (galeria do celular ≤ 640 px).
* **Fonte < 12 px no Studio:** 0–15 elementos por tela. São o `kbd` "Ctrl K" (11,5 px), o número das etapas no menu
  (11,5 px), as etiquetas de legenda dos desenhos (10 px) e os rótulos SVG dos esquemas de entrada (11 unidades). Nas
  miniaturas, o texto chega a 2,6 px reais (é miniatura, existe visão ampliada).
* **Alvos < 44 px no celular (≤ 720 px):** 0 em 20 das 28 telas. Exceções: 26×26 px (remover funcionalidade), campos de
  36 px (nomes das instâncias de componente), termos do glossário (20 px, em linha), `summary` de 36–42 px.
* **Alvos < 44 px em tablet (721–1023 px, com toque):** 5 a 164 por tela (navegação 164, cores 80, landing 69), porque a
  regra de 44 px só vale até 720 px.
* **Altura das páginas no celular:** navegação 28 586 px a 320 px (cerca de 36 telas), cores 19 901, layout desktop 17 399 a
  20 425 (480–500 px), landing 14 289, login 15 053 a 600 px.
* **Seleções e filtros ao redimensionar:** preservados (aba, filtro de grupo, modelo escolhido) de 1280 → 375 → 768 → 1280.
* **Saltos de rolagem ao selecionar/filtrar:** nenhum (4000 → 4000 px, 547 → 547 px, 6000 → 6000 px).
* **Zoom de página 200 % (640×400):** 0 overflow nas 28 rotas.
* **Aumento só de texto (200 %):** a interface **não responde**. A altura de todas as páginas fica idêntica (início
  2 377 → 2 377 px; cores 19 449 → 19 449 px), porque tudo é definido em px.

### 2.2 Tabela de problemas de responsividade

| # | Página | Larguras | Componente | Medição | Captura |
| --- | --- | --- | --- | --- | --- |
| 1 | Layout mobile (módulo **e** etapa 4 do guiado) | 700–1100 (modo `medium`), também 844×390 e 915×412 | grade `.lay-mob` (lista × palco) | coluna da lista com 0 px (700, 1024), 31 px (1100), 99 px (900). Cartões de 128 px invadem o palco e o texto "Escolhido para o seu projeto / Drawer pela esquerda" fica por cima dos cartões. O palco é sticky, tem 949 px numa viewport de 1024 e fundo transparente | `capturas/detalhes/mobile-900-rolada.png`, `mobile-1024-rolada.png`, `g-mobile-1024-rolada.png`, `mobile-galeria-768-rolada.png` |
| 2 | Modo livre | 320, 344, 667×375 | `.free-card__status` | o texto "Painel Analítico + Sóbria Corporativa" vai até x = 348 px (sai do cartão e da tela). Com emulação móvel, a viewport de layout passa a 348 px (`innerWidth` 348) e a busca/modais fixos ficam 28 px cortados à direita | `capturas/detalhes/livre-320-status-vazando.png`, `livre-320-busca-cortada.png` |
| 3 | Guiado, todas as etapas | 1024, 1100 (8 rótulos), 1280/1440 (1–2), 915×412 (5–6) | `.gd-step__text` | `scrollWidth` 67–107 px > `clientWidth` 62 px, cortados com reticências ("2. En…", "3. De…") | `capturas/detalhes/stepper-guiado-1024.png` |
| 4 | Guiado | ≤ 600 | stepper | rótulos ocultos (`display:none`): só 10 barras sem texto | `capturas/detalhes/guiado-vazio-desktop-320.png` |
| 5 | Guiado (barra fixa) | 320–375 sem seleção; 844×390 | `.gd-footer` | 158 px = 20–23 % da altura no estado vazio (dica + botão quebram em 3 linhas); em paisagem, barra de 65 px + topbar de 60 px = 32 % de 390 px | `capturas/detalhes/guiado-vazio-desktop-320.png`, `capturas/sw/g-objetivo--844x390.png` |
| 6 | Guiado (barra fixa × foco) | 1280, 375, 844×390 | `.gd-footer` | de 5 a 28 paradas de foco **100 % cobertas** por tela (ver RA-05) | `capturas/teclado/foco-coberto-identidade-1280x900.png` e demais `foco-coberto-*` |
| 7 | Guiado — objetivo (teclado virtual) | 375×420 | `.gd-footer` × campos | 7 de 7 campos cobertos de 44 a 69 px depois de focados; área útil de 291 px | `capturas/detalhes/teclado-virtual-guiado-objetivo-375x420.png` |
| 8 | Modais: visualizador de inspiração e prévias ampliadas | 844×390, 915×412 | `.ui-modal__body` | corpo útil de 151 px (inspiração, 39 % da altura) e 199 px (landing/login); restam cerca de 70 px da prévia visíveis sem rolar | `capturas/estados/visualizador-inspiracao--844x390.png`, `previa-landing--844x390.png` |
| 9 | Modais | 320–375 | `.ui-modal__foot` | rodapé de 129 a 181 px (ações quebram em 2–3 linhas); corpo de 440 a 537 px em 800 | `capturas/estados/visualizador-inspiracao--375.png`, `editor-componente--375.png` |
| 10 | Central de Prompts e etapa 10 | 320–375 | `.ui-tabs` | `scrollWidth` 535 > `clientWidth` 288/343; "Contradições" e "Especificação JSON" ficam fora da tela, sem barra de rolagem visível (`scrollbar-width:none`) | `capturas/sw/prompt--375.png` |
| 11 | Layout mobile/desktop | todas | `.lay-detail__tags` | 385/343 px cortado com reticências ("Combina com: … Da…"); texto completo só no `title` | `capturas/sw/m-mobile--375--full.png` |
| 12 | Navegação, componentes | 320–430 e 600–768 | descrições dos cartões (`line-clamp`) | 20–35 textos cortados por tela a 320 px | `capturas/sw/m-navegacao--320--full.png` |
| 13 | Layout mobile | ≤ 1100 | `.lay-mob-card` | cartões de 128–136 px de largura; nomes cortados em 3 linhas ("Bottom Navigation com drawer de opçõe…") | `capturas/sw/m-mobile--375.png` |
| 14 | Desenhos com legenda | todas | `.lay-chip`, `.ui-legend` | 10 px; no celular grande, a etiqueta CONTEÚDO cobre o link "Ver tudo" | `capturas/sw/m-mobile--375--full.png` |
| 15 | Páginas de galeria | 320–600 | página inteira | 28 586 px (navegação, 320), 19 901 (cores), 20 425 (desktop a 500); sem "voltar ao topo" nem filtros fixos | `capturas/sw/m-navegacao--320--full.png` |
| 16 | Todas (tablet) | 768, 820, 900 | botões, chips, campos | 5–164 alvos < 44 px; campos com 14,5 px | `capturas/sw/m-navegacao--768.png` |
| 17 | Guiado | 375 | `.ui-toasts` × `.gd-footer` | o toast cobre 45 px do botão "Continuar" por 3,2 s | `capturas/detalhes/toast-sobre-barra-guiado-375.png` |
| 18 | Todas | 375 com `html{font-size:200%}` | tokens em px | 0 px de diferença de altura em 28/28 rotas | `dados/agregado-D-E.tsv` |

**Itens verificados sem problema:** prévia do celular na Live Preview proporcional no celular (343×740, escala 1;
`capturas/detalhes/preview-celular-375.png`); gavetas e menus dentro das prévias abrem, fecham ao tocar fora e com Esc
(`dados/previa-menus.json`); nenhum modal com botões fora da tela ou sem rolagem interna (0 controles fora da tela em
12 modais × 7 tamanhos); seleções preservadas ao mudar de resolução.

---

## 3. Acessibilidade — axe, teclado e semântica

### 3.1 axe-core 4.14 nas 28 rotas (1280 e 375)

| Regra | Gravidade axe | Nós (1280 / 375) | Rotas | Onde | Exemplo |
| --- | --- | --- | --- | --- | --- |
| `color-contrast` (1.4.3) | séria | 1 871 (1 141 / 730) | 28/28 | ≈ 1 100 nós são do próprio Studio: `#7c7c87` sobre branco = **4,12:1**; `#7c7c87` sobre `#f1f0fd` = 3,65:1 (contagem dos chips). O resto está nas prévias (etiquetas dos desenhos 3,19–3,68:1; textos de sites fictícios) | `.shell-brand__sub` "Design System Studio", `.shell-group__toggle` "ESTRUTURA", `.free-card__status` "Ainda não escolhido", `.ui-option__meta`, `.search-item__desc` |
| `label-content-name-mismatch` (2.5.3) | séria | 516 (286 / 230) | 28/28 | o `aria-label` dos cartões (nome + descrição) substitui o texto visível (nome + metadados); marca e busca | `.ui-option__hit aria-label="Sidebar integral clássica. Menu fixo…"`; `.shell-search-btn aria-label="Buscar funcionalidades (Ctrl+K)"` |
| `target-size` (2.5.8) | séria | 44 (16 / 28) | 2 (preview, guiado/preview) | itens das sidebars simuladas na Live Preview (122×18 px; 64×11 px) | `.nvs-si`, `.nvs-ws` |
| `scrollable-region-focusable` (2.1.1) | séria | 8 | 4 | `<pre>` do Master Prompt (`max-height: 720`) e conteúdo rolável do celular interativo, sem foco | `pre.ui-code[data-testid=master-prompt-text]`, `.lay-ph-content` |
| `nested-interactive` (4.1.2) | séria | 4 (+28 na busca) | 2 | `.lp-frame role="img"` com 18 controles focáveis dentro; na busca, `li role=option` contém `button` | `div.lp-frame[role=img]`, `li[role=option] > button.search-item` |
| `aria-allowed-attr` (4.1.2) | crítica | 12 | 2 (navegação) | `aria-expanded` em `input type=search` nos headers simulados | `input[aria-haspopup=listbox][aria-expanded]` |
| `landmark-unique` / `landmark-no-duplicate-banner` / `landmark-*-is-top-level` | moderada | 8 + estados | navegação, modais | dezenas de `<nav aria-label="Principal">` e `<header>` vindos das prévias | `nav.nvs-hnav[aria-label=Principal]` |
| `heading-order` | moderada | 6 | 4 | h1 → h3 nas galerias desktop/mobile | `h3.lay-section__title` |

Nos modais, gavetas e menus (`dados/estados-*.json`), os resultados foram: `nested-interactive` ×28 e contraste ×12 na
busca; `aria-required-children` ×5 (linhas `role=row` da tabela simulada) no editor de componente; `scrollable-region-focusable`
no prompt individual e no editor de template; landmarks duplicados no visualizador de inspiração e no detalhe de header;
`aria-required-parent` ×4 (`menuitem` sem `menu`) no menu do header de prévia.

**O que o axe não acusou** (bom sinal): campos sem rótulo, botões ou links sem nome, imagens sem alternativa, `aria-hidden`
com foco dentro, ids duplicados, `lang` ausente.

### 3.2 Teclado

| Teste | Resultado | Evidência |
| --- | --- | --- |
| Link "Pular para o conteúdo" | aparece no 1º Tab (visível, top = 8 px), mas **Enter ou clique leva à página inicial** em 3/3 rotas testadas (`#/modulos/cores` → `#/`) | `dados/skip-link.json`, `capturas/teclado/skip-link-1280.png`, `skip-link-depois-enter-cores.png` |
| Ordem de Tab (1280) | lógica: topbar → menu lateral → trilha → conteúdo → barra do guiado. Paradas por tela: 43 a 501; navegação tem 495, das quais 256 estão dentro das prévias | `dados/teclado.json`, `dados/paradas-tab.json` |
| Tab no celular (375) | **36 das 45 primeiras paradas estão fora da tela** (menu lateral fechado). O primeiro conteúdo visível só chega no Tab nº 42. 37 alvos focáveis invisíveis em todas as rotas < 1024 px | `capturas/teclado/foco-invisivel-menu-fechado-375-tab12.png` (foco em x = −314 px) |
| Foco visível | todo controle tem indicador, mas o anel `box-shadow` de botões, chips, cartões, abas, segmentados e etapas é `#cdcbf5` (1,56:1 sobre branco). Em `forced-colors` (alto contraste) **some** em chips, cartões, abas e botões; só os links mantêm contorno | `capturas/teclado/foco-chip-1280.png`, `foco-cartao-1280.png`, `forced-colors-*.png`, `dados/forced-colors.json` |
| Foco coberto pela barra fixa do guiado (80 Tabs) | 1280×900: 7 / 16 / 15 paradas 100 % cobertas (desktop / identidade / componentes); 375×800: 5 / 7 / 23; 844×390: 6 / 14 / 28 | `capturas/teclado/foco-coberto-*.png` |
| Enter e Espaço em chips e cartões | funcionam; a rolagem não muda; o foco continua no controle | `dados/teclado.json` → `enterSpace` |
| Esc | fecha os 12 modais, o menu do Studio, a gaveta do celular interativo e o menu do header de prévia | `dados/estados-*.json`, `dados/previa-menus.json` |
| Armadilha de foco | 12 modais: 0 fugas em 46 Tab/Shift+Tab, em 7–8 tamanhos. **Menu lateral do celular:** foco fica no botão ao abrir, 4 fugas, sem armadilha | idem |
| Devolução de foco | modais 7/7. **Menu do Studio 0/6**: depois do Esc, o foco fica num botão do menu já escondido | idem, `teclado.json → mobileMenuKeyboard` |
| Ctrl+K | abre a busca em qualquer tela, com foco no campo. Setas mudam `aria-selected`, mas o campo não tem `role=combobox` nem `aria-activedescendant`; "Nada encontrado" não é anunciado | `teclado.json → search`, `dados/aria/modal-busca.yml` |
| Abas (`role=tab`) | setas não fazem nada, não há `aria-controls`, há 0 `role=tabpanel` | `teclado.json → tabs` |
| Troca de rota | o título é sempre "Atelier UI · Design System Studio"; o foco fica no link clicado (no guiado, no botão "Continuar" no fim da nova etapa); nada é anunciado | `teclado.json → routeChange`, `dados/detalhes5.json` |
| `prefers-reduced-motion` | respeitado: 26 elementos animados → 0 | `dados/diversos.json` |

### 3.3 Semântica e árvore de acessibilidade

* **Landmarks:** 1 `<main>` em 28/28 rotas; `banner` (topbar) presente; trilha `nav "Você está em"` e
  `nav "Etapas do construtor guiado"`. O menu do Studio é um `aside` (`complementary "Navegação do Studio"`), não um `nav`.
  Na tela de navegação, as prévias trazem cerca de 50 `nav "Principal"` e vários `header`.
* **Títulos:** 1 `h1` visível para tecnologia assistiva em 28/28 rotas. Os h1 das miniaturas estão em `aria-hidden`
  (landing 24, inspiração 20, templates 8, login 2), então não poluem. Salto h1 → h3 nas galerias desktop/mobile.
* **Nomes:** botões de ícone usam `IconButton` com `aria-label` (e `title`). Cartões são `button aria-pressed` com nome
  descritivo. Etapas do stepper com `aria-current="step"`; no celular o texto fica oculto e o nome vem só do `title`.
  Links do menu com `aria-current="page"` (NavLink). Chips e segmentados com `aria-pressed`. Switch real
  (`input role=switch`).
* **Campos:** todos rotulados (axe `label` sem violações). Mas `Field` não liga ajuda/erro ao campo: o URL inválido em
  Validação não tem `aria-invalid` nem `aria-describedby` (`dados/erros.json`).
* **Anúncios:** `Toaster` com `role=status aria-live=polite` sempre montado. Erros de toast também saem como `polite`.
  Erro de importação em `Callout` de perigo com `role=alert` (anunciado). Dica do botão desabilitado do guiado sem ligação
  programática.
* **Contraste:** ver 3.1. Texto principal (`#15151a`, 18:1), texto 2 (`#55555f`, 7,4:1), acento (`#4c46dc`, 6,5:1) e
  sinais (verde 5,0:1, âmbar 5,5:1) estão bons. Falham o texto 3 (`#7c7c87`, 4,12:1) e três cores das etiquetas didáticas
  (verde `#0f9d6b` 3,47:1; laranja `#d97706` 3,19:1; ciano `#0891b2` 3,68:1, todas com 10 px).
* **Leitor de tela:** não houve teste com leitor de tela. Pela árvore (`dados/aria/*.yml`), a página é compreensível
  (banner, menu, main, h1, cartões com estado `pressed`), com três ressalvas: (1) no celular o menu fechado continua na
  árvore e no Tab; (2) a Live Preview é `img` com controles dentro; (3) a busca não comunica a opção ativa.

---

## 4. Lista consolidada de problemas

Gravidade: **P0** bloqueia o uso; **P1** grave, afeta um fluxo principal ou um grupo inteiro de usuários; **P2**
importante; **P3** menor. Esforço estimado para quem conhece o código.

### RA-01 — Galeria "Layout mobile" sobrepõe cartões e texto entre 700 e 1 279 px (inclui a etapa 4 do guiado)
* **Evidência:** `capturas/detalhes/mobile-galeria-768-rolada.png`, `mobile-900-rolada.png`, `mobile-1024-rolada.png`, `g-mobile-1024-rolada.png`.
  Medição (`scripts/detalhes2.js`): coluna da lista com 0 px a 700 e 1024, 99 px a 900, 31 px a 1100. Os cartões têm
  128 px e invadem o palco. A 1280 (modo `wide`) não há sobreposição.
* **Passos:** abrir `#/guiado/mobile` ou `#/modulos/mobile` numa janela de 768–1100 px (ou tablet em paisagem 844×390)
  e rolar a página.
* **Esperado:** lista de modelos ao lado (ou acima) do celular grande, sem invadir.
* **Observado:** os cartões passam por baixo do título "Drawer pela esquerda", do selo "Escolhido…" e do botão "Prompt
  deste elemento". O palco é sticky, transparente e mais alto que a viewport (949 px em 1024).
* **Causa provável:** `src/modules/layouts/layouts.css:1520-1523` (`grid-template-columns: minmax(0, 1fr) auto`). A coluna
  `auto` do palco cresce até o max-content do texto e a lista encolhe a 0. Também `MobileStudio.tsx:126` (modo `medium`
  a partir de 620 px de contêiner) e `layouts.css:1575` (palco sticky sem fundo).
* **Sugestão:** no modo `medium`, usar `grid-template-columns: minmax(272px, 1fr) minmax(0, calc(var(--phone-w) + 24px))`
  (ou limitar `.lay-mob-info` a `max-width: var(--phone-w)`); subir o limite do `medium` para ~760 px; dar
  `background: var(--s-bg)` ao palco; desligar o sticky quando a altura do palco > viewport. Incluir 768/1024 nos testes E2E.
* **Gravidade:** P1 · **Esforço:** baixo.

### RA-02 — "Pular para o conteúdo" leva para a página inicial
* **Evidência:** `dados/skip-link.json` (3/3 rotas: `#/modulos/cores`, `#/guiado/desktop`, `#/prompt` → `#/`);
  `capturas/teclado/skip-link-depois-enter-cores.png`.
* **Passos:** abrir qualquer tela que não seja a inicial, apertar Tab e Enter (ou clicar no link).
* **Esperado:** foco no `<main>` da mesma tela.
* **Observado:** o hash vira `#conteudo`, o roteador não reconhece e redireciona para `/`. A pessoa perde a tela (e, no
  guiado, a etapa).
* **Causa provável:** `src/shell/Shell.tsx:340` (`<a href="#conteudo">` num `createHashRouter`) somado a
  `src/App.tsx:57` (`path: '*'` → `<Navigate to="/" />`).
* **Sugestão:** `onClick={(e) => { e.preventDefault(); document.getElementById('conteudo')?.focus() }}` (o `main` já tem
  `tabIndex={-1}`), ou trocar por `<button>`. Adicionar teste E2E.
* **Gravidade:** P1 · **Esforço:** baixo.

### RA-03 — Menu lateral fechado continua no Tab e na árvore de acessibilidade abaixo de 1 024 px
* **Evidência:** 37 alvos focáveis fora da tela em todas as rotas de 320 a 900 px (`dados/agregado-sweep.tsv`, linha "foco
  fora da tela"). A 375 px, 36 das 45 primeiras paradas de Tab ficam fora da tela e o 1º conteúdo vem no Tab 42
  (`dados/teclado.json`). Captura `capturas/teclado/foco-invisivel-menu-fechado-375-tab12.png`: foco em
  "Landing, login e cadastro", x = −314 px, nada visível.
* **Passos:** em 375 px (ou tablet com teclado), apertar Tab a partir do topo.
* **Esperado:** o menu fechado fica fora da ordem de foco e da árvore.
* **Observado:** foco invisível por cerca de 36 paradas; leitores de tela leem o menu como se estivesse aberto.
* **Causa provável:** `src/shell/shell.css:316-333`: só `transform: translateX(-102%)`, sem `visibility: hidden` nem
  `inert`. `Shell.tsx:142` não marca o `aside` quando fechado.
* **Sugestão:** `inert={!open && isMobile}` no `aside` (ou `visibility: hidden` com `transition: visibility 0s .2s`
  quando fechado).
* **Gravidade:** P1 · **Esforço:** baixo.

### RA-04 — Menu lateral aberto no celular não se comporta como diálogo
* **Evidência:** `dados/estados-*.json` → `menu-studio`: foco inicial fora do menu (6/6 tamanhos), 4 fugas em 46 Tabs,
  foco devolvido 0/6; `dados/teclado.json → mobileMenuKeyboard` (após abrir, os Tabs passam pela marca, busca e Master
  Prompt atrás do véu; após o Esc o foco fica num botão do menu oculto). Captura `capturas/estados/menu-studio--375.png`.
* **Passos:** a 375 px, focar "Abrir menu", Enter, Tab, Esc.
* **Esperado:** foco vai para "Fechar menu"; Tab preso no menu; resto inerte; Esc devolve o foco a "Abrir menu".
* **Observado:** nada disso; o `aside` não tem `role="dialog"` nem `aria-modal`.
* **Causa provável:** `src/shell/Shell.tsx:331-336` (só trata Esc) e componente `Sidebar` (`Shell.tsx:126-180`).
* **Sugestão:** reaproveitar a lógica do `Modal` (`ui/index.tsx:529-595`): focar o botão de fechar, prender Tab, aplicar
  `inert` em `header` e `main` enquanto aberto, devolver o foco ao botão.
* **Gravidade:** P2 · **Esforço:** baixo.

### RA-05 — A barra fixa do construtor guiado esconde o elemento focado e os campos
* **Evidência:** `dados/teclado.json`. Paradas 100 % cobertas em 80 Tabs: 1280×900 → 7 (desktop), 16 (identidade), 15
  (componentes); 375×800 → 5, 7, 23; 844×390 → 6, 14, 28. Teclado virtual aproximado (375×420) em `/guiado/objetivo`:
  7/7 campos cobertos de 44 a 69 px (`dados/diversos.json`). Capturas `capturas/teclado/foco-coberto-identidade-1280x900.png`
  (botão "Prompt" focado, invisível sob a barra) e `capturas/detalhes/teclado-virtual-guiado-objetivo-375x420.png`.
* **Passos:** em `#/guiado/identidade`, avançar com Tab pela galeria de paletas.
* **Esperado:** WCAG 2.4.11: o foco nunca fica totalmente escondido.
* **Observado:** o navegador rola o elemento só até a borda inferior da viewport, onde está a barra sticky.
* **Causa provável:** `src/modules/guided/guided.css:119-131` (`.gd-footer` sticky) sem `scroll-padding` correspondente.
  A topbar sticky (`shell.css:25-38`) também não tem `scroll-padding-top`.
* **Sugestão:** `html { scroll-padding-top: calc(var(--topbar-h) + 8px); scroll-padding-bottom: calc(var(--gd-footer-h, 0px) + 8px) }`,
  com a variável definida quando a barra existe. Em `@media (max-height: 520px)`, deixar a barra estática. Ao focar
  campos, usar `scrollIntoView({ block: 'center' })`.
* **Gravidade:** P1 · **Esforço:** baixo.

### RA-06 — Texto secundário do Studio abaixo de 4,5:1 em todas as telas
* **Evidência:** `dados/axe-contraste-pares.tsv`: 1 092 nós do Studio com `#7c7c87` sobre `#ffffff` (4,12:1) e 21 com
  `#7c7c87` sobre `#f1f0fd` (3,65:1), em 28/28 rotas. Exemplos: subtítulo da marca, títulos dos grupos do menu
  ("ESTRUTURA", 12 px), "Ainda não escolhido", metadados dos cartões, descrições da busca, contagens dos chips, texto do
  botão de busca, `kbd`.
* **Passos:** rodar `scripts/axe-contraste.js`, ou medir qualquer `.u-muted`/`--s-text-3`.
* **Esperado:** ≥ 4,5:1 (WCAG 1.4.3 AA).
* **Observado:** 4,12:1 e 3,65:1, em textos de 12 a 14,5 px.
* **Causa provável:** `src/styles/tokens.css:24` (`--s-text-3: #7c7c87`).
* **Sugestão:** `--s-text-3: #6b6b76` (≈ 5,2:1 sobre branco e ≈ 4,6:1 sobre `--s-accent-soft`); contagem dos chips
  ativos em `--s-accent`. Revisar `--s-text-disabled` só para estados realmente desabilitados.
* **Gravidade:** P1 · **Esforço:** baixo (1 token, revisão visual).

### RA-07 — Anel de foco quase invisível (1,56:1) e ausente no modo de alto contraste
* **Evidência:** `capturas/teclado/foco-chip-1280.png`, `foco-cartao-1280.png`, `foco-aba-1280.png`. Cor efetiva do anel
  `#cdcbf5` = 1,56:1 sobre branco e 1,38:1 sobre `#f1f0fd`. Com `forced-colors: active`, chips, cartões, abas e botões
  ficam **sem nenhum indicador** (`outline: none`, `box-shadow: none`); `dados/forced-colors.json`,
  `capturas/teclado/forced-colors-*.png`.
* **Passos:** navegar com Tab pelos chips/cartões de `#/modulos/cores`; repetir com alto contraste do Windows.
* **Esperado:** indicador ≥ 3:1 contra o fundo (WCAG 1.4.11; 2.4.13 AAA), mantido em `forced-colors`.
* **Observado:** halo lilás claro; em alto contraste, nada.
* **Causa provável:** `src/styles/tokens.css:86` (`--focus-ring: 0 0 0 3px rgba(76,70,220,.28)`) somado aos
  `outline: none` em `ui.css:29-31, 114-116, 224, 326-328, 413-415, 829-831`, `guided.css:70-74`, `home.css:158`,
  `color.css:149`, `project.css:31` etc.
* **Sugestão:** `--focus-ring: 0 0 0 2px #fff, 0 0 0 4px var(--s-accent)` e trocar `outline: none` por
  `outline: 2px solid transparent` (que aparece em `forced-colors`), ou simplesmente manter o `:focus-visible` global de
  `base.css` (2 px sólido, 6,5:1).
* **Gravidade:** P1 · **Esforço:** baixo.

### RA-08 — Status do cartão do modo livre vaza da tela em 320–344 px e "alarga" a viewport
* **Evidência:** `capturas/detalhes/livre-320-status-vazando.png` ("Sóbria Corporativa" cortado na borda);
  `dados/viewport-320.json`: `innerWidth` 348 em 320 px; `capturas/detalhes/livre-320-busca-cortada.png` (modal fixo com
  348 px, 28 px cortados).
* **Passos:** projeto com header e sidebar escolhidos; abrir `#/livre` a 320 px; abrir a busca.
* **Esperado:** o texto quebra dentro do cartão.
* **Observado:** overflow de 28 px (4 px a 344, 6 px a 667×375) e elementos fixos cortados.
* **Causa provável:** `src/modules/home/home.css:184-192` (`.free-card__status { display: inline-flex }` sem
  `max-width`/`flex-wrap`), usado em `FreeHome.tsx:36`.
* **Sugestão:** `display: flex; flex-wrap: wrap; max-width: 100%` e `overflow-wrap: anywhere` no texto (ou usar o
  `.u-truncate` que já existe no outro estado).
* **Gravidade:** P2 · **Esforço:** baixo.

### RA-09 — Barra fixa do guiado ocupa espaço demais em celular pequeno e em paisagem
* **Evidência:** `dados/diversos.json → guidedEmpty`: 158 px (23 % de 700 px) a 320 px e 158 px (20 %) a 375 px no estado
  vazio; 65 px + topbar 60 px = 32 % da altura a 844×390 (`dados/sweep-D.json`). Captura
  `capturas/detalhes/guiado-vazio-desktop-320.png`.
* **Passos:** projeto vazio, `#/guiado/desktop` a 320 px.
* **Esperado:** barra de uma linha (≤ 64 px) e que não fique fixa em telas baixas.
* **Observado:** dica + "Voltar" + "Continuar" em 3 linhas; em paisagem sobram 265 px de conteúdo.
* **Causa provável:** `guided.css:119-136` (flex-wrap sem versão compacta) e `GuidedStep.tsx:198-216`.
* **Sugestão:** no celular, "Voltar" só com ícone, dica em uma linha truncada acima da barra (ou dentro do botão como
  `aria-describedby`); `@media (max-height: 520px) { .gd-footer { position: static } }`.
* **Gravidade:** P2 · **Esforço:** baixo.

### RA-10 — Modais com pouca área útil em paisagem e rodapés altos no celular
* **Evidência:** `dados/estados-844x390_915x412.json`: corpo do visualizador de inspiração com 151 px (39 % de 390),
  prévias de landing/login/cadastro e editores com 199 px, prompt individual com 176 px. Em 320–375 px, rodapé de 129 a
  181 px (`estados-375.json`). Capturas `capturas/estados/visualizador-inspiracao--844x390.png`,
  `previa-landing--844x390.png`, `visualizador-inspiracao--375.png`.
* **Passos:** abrir qualquer prévia ampliada em 844×390.
* **Esperado:** a prévia ocupa a maior parte da tela.
* **Observado:** cabeçalho (subtítulo longo) + controles + rodapé deixam cerca de 70 px da prévia visíveis.
* **Causa provável:** `ui.css:674-748` (modal com cabeçalho e rodapé fixos; só há regra para largura ≤ 600 px, não para
  altura).
* **Sugestão:** `@media (max-height: 520px)`: modal em tela cheia, subtítulo oculto ou em 1 linha, rodapé em linha única
  com botões compactos (ícone + rótulo curto, como já faz `ins-short`), controles de dispositivo dentro do corpo rolável.
* **Gravidade:** P2 · **Esforço:** médio.

### RA-11 — Prévias interativas inflam a navegação por teclado e por landmarks
* **Evidência:** `dados/paradas-tab.json`: `/modulos/navegacao` tem 495 paradas de Tab (256 em prévias), Live Preview tem
  18 controles dentro de `role="img"` (`nested-interactive`). axe: `landmark-unique` (cerca de 50 `nav "Principal"`),
  `landmark-no-duplicate-banner` e `landmark-banner/contentinfo-is-top-level` nos modais.
* **Passos:** em `#/modulos/navegacao`, tentar chegar por Tab ao fim da página, ou listar landmarks com um leitor de tela.
* **Esperado:** prévia é um bloco único; quem quer testá-la entra explicitamente.
* **Observado:** centenas de paradas sem atalho, combinadas com o link de pular quebrado (RA-02).
* **Causa provável:** `HeaderPreview.tsx:1013`/`SidebarPreview.tsx` (`interactive` verdadeiro nas listas),
  `LiveSitePreview.tsx:47` (`role="img"` com filhos focáveis), marcação `<header>/<nav>/<footer>` nas prévias.
* **Sugestão:** nas listas, prévias inertes (`useInert` já existe em `navigation/menu.tsx:283`) com botão "Testar
  menus" que libera uma de cada vez; trocar `role="img"` por `role="group"` + `aria-roledescription="prévia"`, ou deixar
  inerte; nas prévias, usar `div` com `role="none"` no lugar de landmarks.
* **Gravidade:** P2 · **Esforço:** médio.

### RA-12 — Troca de rota sem título nem foco
* **Evidência:** `dados/teclado.json → routeChange` e `dados/detalhes5.json`: `document.title` igual em 28/28 rotas; após
  "Continuar" no guiado, o foco fica no botão "Continuar: Revisão" no fim da nova etapa, enquanto a página volta ao topo.
* **Passos:** com leitor de tela/teclado, navegar pelo menu ou pelos botões do guiado.
* **Esperado:** título da aba por tela (WCAG 2.4.2) e foco/anúncio no novo `h1`.
* **Observado:** nada indica que a tela mudou.
* **Causa provável:** `src/shell/Shell.tsx:307-312` (só `scrollTo` e fecha o menu) e título fixo em `index.html`.
* **Sugestão:** no mesmo efeito, `document.title = \`${rótulo} · Atelier UI\`` e focar o `h1` (`tabIndex={-1}`) ou o
  `main`, preservando o foco quando a navegação vem do próprio menu no desktop.
* **Gravidade:** P2 · **Esforço:** baixo.

### RA-13 — Busca (Ctrl+K) com listbox mal formado
* **Evidência:** axe `nested-interactive` ×28 (`li role=option > button`); `dados/teclado.json → search`: o campo não tem
  `role`, `aria-controls` nem `aria-activedescendant`; "Nada encontrado" sem região viva; `dados/aria/modal-busca.yml`.
* **Passos:** Ctrl+K, digitar "paleta", apertar seta para baixo.
* **Esperado:** padrão combobox: o leitor anuncia a opção ativa e a quantidade de resultados.
* **Observado:** só a mudança visual.
* **Causa provável:** `src/shell/Shell.tsx:182-275` (`FeatureSearch`; campo em 229-252, lista em 255-272).
* **Sugestão:** `input role="combobox" aria-expanded aria-controls="lista" aria-activedescendant={id ativo}`; `li role="option" id=…`
  com o clique no próprio `li` (sem `button` dentro, ou `button` com `role="presentation"` e `tabIndex={-1}`); região
  `sr-only` `aria-live="polite"` com "N resultados".
* **Gravidade:** P2 · **Esforço:** médio.

### RA-14 — Abas sem o padrão do teclado e com abas escondidas no celular
* **Evidência:** `dados/teclado.json → tabs` (setas não movem, `aria-controls` nulo, 0 `tabpanel`);
  `dados/detalhes4.json`: Central de Prompts a 320/375 px com `scrollWidth` 535 > 288/343 e 2 de 4 abas fora da tela;
  `capturas/sw/prompt--375.png` ("Contradições (0" cortado).
* **Passos:** em `#/modulos/cores` focar uma aba e apertar → ; em `#/prompt` a 375 px, procurar "Especificação JSON".
* **Esperado:** setas trocam de aba, `tabpanel` rotulado; abas visíveis ou com indicação de rolagem.
* **Observado:** como descrito.
* **Causa provável:** `src/ui/index.tsx:381-386` (Tabs) e `src/styles/ui.css:784-794` (`overflow-x: auto; scrollbar-width: none`).
* **Sugestão:** `tabIndex` móvel + setas/Home/End, `id` + `aria-controls` + `role="tabpanel"`; no celular, `flex-wrap`
  ou gradiente na borda + rolar a aba ativa para a vista.
* **Gravidade:** P2 · **Esforço:** baixo.

### RA-15 — Erros e botões desabilitados não explicados de forma programática
* **Evidência:** `dados/erros.json`: o campo "URL do site" inválido não tem `aria-invalid` nem `aria-describedby`, e o erro
  não tem `role`/`aria-live` (`capturas/detalhes/validacao-erro-url-375.png`). Botão "Continuar" do guiado com `disabled`
  (sai da ordem de Tab) e dica sem `aria-describedby` (`dados/diversos.json → guidedEmpty`).
* **Esperado:** WCAG 3.3.1/1.3.1: erro associado e anunciado; quem usa teclado descobre por que não pode avançar.
* **Causa provável:** `src/ui/index.tsx:207-226` (`Field` não gera ids para ajuda/erro) e `GuidedStep.tsx:211-212`.
* **Sugestão:** `Field` com `useId`, `aria-describedby` e `aria-invalid` passados ao filho, e erro com `role="alert"`; no
  guiado, `aria-disabled="true"` + `aria-describedby` apontando para a dica, e um clique que mostra/anuncia a pendência.
* **Gravidade:** P2 · **Esforço:** baixo.

### RA-16 — Tamanhos em px: a interface ignora o aumento só de texto
* **Evidência:** `dados/sweep-E.json` e `agregado-D-E.tsv`: com `html{font-size:200%}`, a altura de todas as 28 páginas é
  idêntica à base (ex.: início 2 377 px; cores 19 449 px). O zoom de página a 200 % funciona (640×400 sem overflow,
  `sweep-Z.json`).
* **Esperado:** respeitar a preferência de tamanho de fonte do navegador/SO (WCAG 1.4.4 é cumprido pelo zoom, mas quem
  só aumenta a fonte não ganha nada).
* **Causa provável:** `src/styles/tokens.css:73-80` (`--fs-*` em px), e alturas de controles também em px.
* **Sugestão:** migrar `--fs-*`, `--control-*` e espaçamentos para `rem` (14,5 px = 0,906 rem etc.); testar com 200 %.
* **Gravidade:** P2 · **Esforço:** médio.

### RA-17 — Etiquetas didáticas dos desenhos: 10 px e contraste baixo
* **Evidência:** `dados/axe-contraste-pares.tsv`: branco sobre `#0f9d6b` 3,47:1 (CONTEÚDO, 190 nós), `#d97706` 3,19:1
  (PAINEL, INSPECTOR, CHAT, 60), `#0891b2` 3,68:1 (RAIL, 36). Fonte de 10 px. No celular grande, a etiqueta CONTEÚDO cobre
  o link "Ver tudo" (`capturas/sw/m-mobile--375--full.png`).
* **Causa provável:** `src/styles/tokens.css:43-51` (`--legend-*`), `src/styles/ui.css:926` e
  `src/modules/layouts/layouts.css:1212` (10 px); posição fixa das etiquetas em `phone.tsx:1750-1770` (CONTEÚDO na linha 1762).
* **Sugestão:** `--legend-content: #0b7a53`, `--legend-panel: #b45309`, `--legend-rail: #0e7490` (≥ 4,5:1), fonte de
  11–12 px, e etiquetas posicionadas fora de elementos interativos (ou com `pointer-events: none` + opacidade).
* **Gravidade:** P2 · **Esforço:** baixo.

### RA-18 — Alvos de toque pequenos em tablets e alguns no celular
* **Evidência:** `dados/agregado-sweep.tsv`: 5 a 164 alvos < 44 px por tela em 768/820/900 px; campos de 14,5 px nessas
  larguras. No celular: "Remover funcionalidade" 26×26 px, campos de nome das instâncias de componente com 36 px,
  segmentado "Guiado/Livre" do menu com 32 px de altura, termos do glossário com 20 px (em linha, exceção da 2.5.8).
* **Causa provável:** `src/styles/tokens.css:98-106` (44 px só em `max-width: 720px`); `project.css:90-91`;
  `components.css:410-411`; `ui.css:390`.
* **Sugestão:** aplicar os tokens de toque com `@media (pointer: coarse)` (cobre tablets e notebooks com toque);
  corrigir as três exceções.
* **Gravidade:** P2 · **Esforço:** baixo.

### RA-19 — Regiões roláveis sem acesso por teclado
* **Evidência:** axe `scrollable-region-focusable` ×8 (Master Prompt `<pre style="max-height:720px">`, prompt individual,
  conteúdo do celular interativo, prévia do editor de template).
* **Esperado:** WCAG 2.1.1: rolar com as setas.
* **Causa provável:** `src/modules/prompts/PromptWorkspace.tsx:157, 214`, `prompt/PromptButton.tsx:62` (`pre.ui-code`),
  `layouts/phone.tsx:1794`.
* **Sugestão:** `tabIndex={0}`, `role="region"` e `aria-label="Texto do Master Prompt"` no `<pre>`; o mesmo nas áreas
  roláveis das prévias.
* **Gravidade:** P2 · **Esforço:** baixo.

### RA-20 — Etapas do guiado cortadas em notebooks e sem rótulo no celular
* **Evidência:** `capturas/detalhes/stepper-guiado-1024.png` (8 rótulos com reticências a 1024 e 1100);
  `capturas/detalhes/guiado-vazio-desktop-320.png` (≤ 600 px só barras; nome só no `title`).
* **Causa provável:** `src/modules/guided/guided.css:1-11` (2 colunas mesmo com a sidebar aberta), `75-90`.
* **Sugestão:** até 1 279 px com sidebar, stepper em 1 coluna ou só números + rótulo da etapa atual; no celular, texto
  "3/10 · Desktop" e nomes acessíveis visíveis no foco.
* **Gravidade:** P3 · **Esforço:** baixo.

### RA-21 — Páginas de galeria muito longas no celular
* **Evidência:** navegação 28 586 px a 320 px, cores 19 901, desktop 20 425 a 500 px, landing 14 289
  (`dados/agregado-sweep.tsv`); filtros só no topo; sem "voltar ao topo".
* **Sugestão:** "Mostrar mais" por família, chips de filtro sticky compactos, botão "voltar ao topo", índice das famílias.
* **Gravidade:** P3 · **Esforço:** médio.

### RA-22 — Textos cortados sem forma de ler o restante
* **Evidência:** `.lay-detail__tags` "Combina com: …" cortado com reticências em todas as larguras (385 > 343 px; texto
  completo só em `title`, inacessível ao toque); nomes dos modelos mobile em cartões de 128–136 px; descrições com
  `line-clamp` (20–35 por tela a 320 px). Capturas em `capturas/sw/m-mobile--375--full.png`, `m-navegacao--320--full.png`.
* **Causa provável:** `layouts.css:1374-1381`, `1542-1549`.
* **Sugestão:** permitir 2 linhas e quebra; mostrar a descrição completa no painel de detalhe; evitar `title` como único
  meio.
* **Gravidade:** P3 · **Esforço:** baixo.

### RA-23 — Nome acessível diferente do texto visível (controle por voz)
* **Evidência:** axe `label-content-name-mismatch` 516 nós (cartões, marca, botão de busca).
* **Causa provável:** `ui/index.tsx:400-446` (o `aria-label` do `OptionCard`, linha 435, substitui o conteúdo); `Shell.tsx:347, 358`.
* **Sugestão:** `aria-labelledby` (título) + `aria-describedby` (descrição) em vez de `aria-label`; marca sem
  `aria-label` (o texto já basta); busca com `aria-keyshortcuts="Control+K"` em vez de colocar o atalho no nome.
* **Gravidade:** P3 · **Esforço:** baixo.

### RA-24 — Hierarquia e landmarks do shell
* **Evidência:** h1 → h3 nas galerias desktop/mobile (axe `heading-order`); menu do Studio é `aside` sem `nav`;
  `.lay-legend-key` com `aria-label` num `div` sem papel (`layouts/shared.tsx:80`).
* **Sugestão:** h2 nas famílias; `<nav aria-label="Navegação do Studio">` dentro do `aside`; `role="group"` na legenda.
* **Gravidade:** P3 · **Esforço:** baixo.

### RA-25 — Toast cobre a barra do guiado; erros anunciados como `polite`
* **Evidência:** `dados/detalhes5.json`: sobreposição de 45 px sobre o botão "Continuar" por 3,2 s a 375 px
  (`capturas/detalhes/toast-sobre-barra-guiado-375.png`); `Toaster` único com `aria-live="polite"` também para erros
  (`ui/index.tsx:654-665`).
* **Sugestão:** subir os toasts acima da barra quando ela existe (`bottom: calc(var(--gd-footer-h) + 12px)`); erros com
  `role="alert"`.
* **Gravidade:** P3 · **Esforço:** baixo.

### RA-26 — ARIA inválido dentro das prévias
* **Evidência:** axe `aria-allowed-attr` ×12 (`aria-expanded` em `input type=search`), `aria-required-children` ×5
  (`role=row` sem `table/rowgroup` no editor de componente), `aria-required-parent` ×4 (`menuitem` sem `menu` no menu do
  header de prévia).
* **Causa provável:** `navigation/HeaderPreview.tsx` (busca com sugestões e folha de menu), `components/render-*.tsx`.
* **Sugestão:** `role="combobox"` no campo; `role="table"`/`rowgroup` ou tabela nativa; `role="menu"` no contêiner ou
  botões simples sem `menuitem`.
* **Gravidade:** P3 · **Esforço:** baixo.

**Contagem:** P0 = 0 · P1 = 6 (RA-01, 02, 03, 05, 06, 07) · P2 = 13 · P3 = 7.

---

## 5. O que está bom (com evidência)

* **Quase nenhum overflow horizontal:** 0 px em 27/28 rotas × 21 larguras, nas 3 paisagens e no zoom de 200 %
  (`dados/agregado-sweep.tsv`, `sweep-D.json`, `sweep-Z.json`). Galerias trocam para carrossel horizontal a ≤ 640 px de
  forma controlada.
* **Modais bem construídos:** nos 12 modais × 7–8 tamanhos, o foco entra no diálogo, fica preso (0 fugas em 46
  Tab/Shift+Tab), Esc fecha, o foco volta ao gatilho (7/7), a rolagem da página é bloqueada, o corpo rola por dentro e
  nenhum botão fica fora da tela. No celular viram bottom sheet (`ui.css:728-748`). Modais empilhados respeitam a pilha
  (`MODAL_STACK`).
* **Rolagem estável:** selecionar cartões e trocar filtros não move a página (`keepScroll`; 4000 → 4000, 547 → 547,
  6000 → 6000 px, `dados/diversos.json`), inclusive com teclado.
* **Seleções preservadas ao mudar de resolução** (aba, filtro, modelo escolhido; `dados/diversos.json → resize`).
* **Celular ≤ 720 px pensado para toque:** controles de 44 px via tokens; 0 alvos < 44 px em 20/28 telas a 375; campos
  com 16 px (evita o zoom do iOS); bottom sheets; safe areas (`env(safe-area-inset-*)`).
* **Prévias de celular corretas:** a Live Preview mostra o celular em escala 1 (343×740 a 375 px); gavetas e menus das
  prévias abrem, recebem foco, fecham com Esc e ao tocar fora, e devolvem o foco (`dados/previa-menus.json`).
* **Semântica de base sólida:** `lang="pt-BR"`, 1 `main`, 1 `h1` visível por tela, `banner`, trilha em `nav` com
  `aria-current="page"`, stepper com `aria-current="step"`, cartões como `button aria-pressed`, chips e segmentados com
  `aria-pressed`, switch real, botões de ícone sempre com nome, miniaturas `aria-hidden`/inertes, nenhum campo sem
  rótulo, nenhum `aria-hidden` com foco dentro (axe).
* **Anúncios:** região `role=status` sempre montada para toasts; erro de importação em `role=alert` (`dados/erros.json`).
* **`prefers-reduced-motion` respeitado** (26 elementos animados → 0).
* **Enter, Espaço e Esc** funcionam em todos os controles testados; Ctrl+K abre a busca de qualquer lugar com foco no campo.
* **Contraste das cores principais:** texto (18:1), texto 2 (7,4:1), acento (6,5:1), sucesso (5,0:1), aviso (5,5:1),
  perigo do Studio.

---

## 6. Nota: 5,8 / 10 em "Responsividade e acessibilidade"

### Rubrica (100 pontos, convertidos para 0–10)

| Critério | Peso | Pontos | Justificativa |
| --- | --- | --- | --- |
| **R1. Sem overflow e sem corte de conteúdo** | 10 | 9 | só o modo livre a 320–344 px; truncamentos menores (RA-08, RA-22) |
| **R2. Layout correto em todas as faixas (celular, tablet, notebook, desktop)** | 15 | 8 | a galeria do celular quebra de 700 a 1 279 px, inclusive na etapa 4 do guiado (RA-01); stepper cortado (RA-20) |
| **R3. Barras fixas, modais e telas baixas (paisagem, teclado virtual)** | 10 | 5 | barra do guiado cobre foco e campos e ocupa 20–32 % da altura (RA-05, RA-09); modais com pouca área em paisagem (RA-10) |
| **R4. Alvos de toque e legibilidade** | 10 | 6 | bom no celular; tablets sem 44 px (RA-18); etiquetas de 10 px (RA-17); texto não escala (RA-16) |
| **R5. Estabilidade (rolagem, seleção, redimensionamento, movimento)** | 5 | 5 | sem saltos, seleções preservadas, movimento reduzido respeitado |
| **A1. Operação por teclado** | 15 | 7 | modais exemplares, mas link de pular quebrado (RA-02), menu fechado no Tab (RA-03), menu aberto sem armadilha (RA-04), regiões roláveis sem foco (RA-19), centenas de paradas nas prévias (RA-11) |
| **A2. Foco visível e gestão de foco** | 10 | 3,5 | anel 1,56:1 e ausente em alto contraste (RA-07), foco coberto (RA-05), troca de rota sem foco (RA-12) |
| **A3. Contraste** | 10 | 4 | texto secundário 4,12:1 em todas as telas (RA-06); etiquetas 3,2–3,7:1 (RA-17) |
| **A4. Semântica, nomes e ARIA** | 10 | 6,5 | base boa; listbox da busca, abas, landmarks das prévias, `role=img` com controles, nome ≠ texto visível |
| **A5. Anúncios, erros e estados** | 5 | 3 | toasts e `alert` de importação ok; erros de campo e botão desabilitado não associados; título fixo |
| **Total** | **100** | **57** | → **5,7**; somando 0,1 por não haver P0 e pela robustez dos modais, **5,8 / 10** |

Leitura da nota: para quem usa mouse em desktop ≥ 1 280 px ou celular em retrato, o Studio é bem responsivo (≈ 7–8).
A nota cai por causa da faixa de tablet e notebook pequeno, das telas baixas e, principalmente, de quem navega por teclado,
usa leitor de tela ou precisa de contraste. Os seis P1 têm esforço baixo: corrigidos RA-01, RA-02, RA-03, RA-05, RA-06 e
RA-07 (cerca de 1–2 dias de trabalho), a nota estimada passa de 7,5.

---

### Arquivos desta fase

* `scripts/lib.js`: navegação, injeção de estado, medições de layout, axe.
* `scripts/sweep.js`: varredura de rotas × larguras (paisagem, zoom e texto via argumentos).
* `scripts/estados.js`: modais/gavetas/menus abertos.
* `scripts/teclado.js`, `skip.js`, `forced.js`, `tabcount.js`, `aria.js`: teclado e semântica.
* `scripts/axe-rotas.js`, `axe-contraste.js`, `analisa-axe.js`, `analisa-sweep.js`: axe e agregações.
* `scripts/diversos.js`, `previa-menus.js`, `erros.js`, `detalhes1-7.js`: verificações pontuais e capturas de evidência.
* `ferramentas/`: `axe-core` 4.14 e `@axe-core/playwright` (instalados só aqui).
* `dados/`: resultados brutos (JSON/TSV/YAML) citados acima.
* `capturas/sw/<rota>--<tamanho>[--full].png`: varredura (PNG reduzido a 256 cores para economizar espaço);
  `capturas/estados/`, `capturas/teclado/`, `capturas/detalhes/`: evidências dos problemas.
