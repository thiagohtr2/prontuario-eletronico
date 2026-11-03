# Fidelidade — P4 "Centro Operacional" (Fase 4)

Auditoria cega dos sites dev-1, dev-2 e dev-3. Comparo o que foi **escolhido no Design System Studio** com o que os desenvolvedores construíram tendo **apenas o Master Prompt**. A rubrica (`rubrica.md`) foi escrita antes de abrir qualquer site e não foi alterada depois. Achados que surgiram fora dela estão na seção 8 e não entram nas notas.

## 0. Resumo

| Dimensão (n requisitos) | dev-1 | dev-2 | dev-3 |
| --- | --- | --- | --- |
| Arquitetura (7) | 100% | 100% | 100% |
| Desktop (15) | 100% | 97,8% | 92,3% |
| Celular (12) | 95,8% | 100% | 95,3% |
| Paleta, tipografia e tokens (13) | 92,6% | 94,0% | 81,9% |
| Componentes (12) | 100% | 97,2% | 95,8% |
| Interações (12) | 100% | 100% | 98,3% |
| **Geral (71)** | **97,9%** | **98,0%** | **93,3%** |
| Requisitos abaixo de 100% | MOB6, PAL1, PAL5, PAL13 | DSK14, PAL1, PAL5, PAL13, CMP12 | DSK7, DSK13, MOB6, MOB9, PAL2, PAL7, PAL8, PAL13, CMP9, INT7 |

**Como ler as notas.** Elas medem a fidelidade à escolha **registrada e exportada**, ou seja, ao Master Prompt e aos tokens. Nesse aspecto, os três desenvolvedores foram muito disciplinados. A semelhança visual com as **prévias que o usuário aprovou** no Studio é bem menor, e pelo mesmo motivo nos três sites: a prévia integrada não representa o layout escolhido, e vários detalhes visuais das prévias não chegam ao prompt (seção 6, julgamento de design). Essa diferença é principalmente falha A, do Studio, e não dos desenvolvedores.

**Falhas encontradas.** A: 4 · B: 12 · C: 7 pontuadas, mais 1 fora da rubrica · D: 7 · E: 9 (lista completa na seção 7).

**As 5 mais importantes:**
1. **C1 (dev-3).** A fonte Inter foi definida em `--font`, mas nunca aplicada: o site inteiro aparece em Times New Roman, inclusive nas capturas que o próprio desenvolvedor anexou.
2. **C4 (dev-3).** A grade central de blocos de status (filas, SLA, equipes), que é o núcleo do layout "Painel operacional", foi omitida.
3. **A1 (Studio).** Não há opção estruturada para "monitores grandes". Os três sites deram três respostas diferentes: escala de 125%/150%, reorganização mais escala de 113%/133%, e nenhuma adaptação.
4. **A3 (Studio).** A prévia integrada aprovada (conteúdo SaaS, ficha de cliente na coluna "Alertas", rodapé com links) não corresponde ao layout escolhido nem ao prompt. Nenhum site tinha como se parecer com o que o usuário viu.
5. **B2 (prompt).** O conteúdo de exemplo de vendas ("Receita mensal", "Pedidos recentes") foi exportado como "aprovado" e contradiz o domínio operacional ("filas, SLA, equipes"). dev-2 e dev-3 registraram o conflito explicitamente nos NOTES; dev-1 o contornou. Os três misturaram receita e pedidos com filas e SLA.

## 1. Evidências e método

**Escolhas.** Fontes usadas:
- `fase2-projetos/P4-centro-operacional/escolhas.md` e `relatorio.md`;
- o Master Prompt (`exportados/centro-operacional-master-prompt.md`; os três `PROMPT.md` são byte a byte iguais a ele);
- tokens CSS e JSON;
- capturas 08, 12, 13, 17–21, 25, 31, 33–36, 38, 44, 52 e 57.

**Sites.**
- Servidos com `python3 -m http.server` nas portas 4541–4543. Os servidores foram encerrados ao final.
- Li `index.html`, `README.md` e `NOTES.md` de cada um. Os NOTES serviram de evidência para separar falhas B/D de falhas C.

**Medições** (Playwright 1.63, Chromium):
- Viewports principais: 1440×900, 1920×1080, 768×1024 e 390×844 (`isMobile`/`hasTouch`).
- Viewports extras: 1280×800, 1180×800, 1024×768, 820×1180, 1280×600, 2560×1440, 360×780, 375×667, 412×915, 430×932, 390×500, 740×360, 844×390.
- Varredura de 14 larguras, de 320 a 1920 px.
- No DOM: `getBoundingClientRect` das regiões; cor, fonte, raio, borda e sombra computados; texto cortado (recorte por ancestrais com overflow hidden); sobreposição (retângulos de texto contra caixas opacas, confirmada com `elementFromPoint`); alvos de toque em todas as abas.
- Interações: seleção, ordenação, hover, menus, diálogos, tooltip, estados, tempo real, Tab/foco, `reducedMotion` e abas por toque e por teclado.

**Saídas.**
- Scripts: `scripts/` (capturas, medir, interacoes, dev1-complemento, espacamento, cores-finas, campos-celular, composicoes, notas, matrizes).
- Dados brutos: `medicoes/*.json`.
- Capturas: `capturas/`.
- Composições: `composicoes/`.

**Limitações.**
- Testei só Chromium headless. Não testei aparelhos reais nem zoom de 200% ou fonte ampliada do sistema (não estavam na rubrica).
- A Inter está instalada na máquina de auditoria. Por isso, um site que declara "Inter" sem carregá-la renderizaria Inter aqui. Não é o caso do dev-3, que nunca declara `font-family`.
- O carregamento pelo Google Fonts (dev-1 e dev-3) depende de rede.

**Independência.** Não li `RETOMADA.md`, `00-ambiente-e-metodo.md`, `_orquestracao/` nem relatórios das fases 1 e 5–8. Não alterei os sites nem o Studio.

## 2. Cadeia Studio → Master Prompt

| Característica do briefing | Escolhida no Studio? | Chegou ao Master Prompt? | Clareza e trechos | Classe |
| --- | --- | --- | --- | --- |
| Uma única tela principal | **Sim**, estruturada: tipo "One Screen", entrada "Aplicação diretamente" e layout "Painel operacional" | **Sim**: L9, L17–20, L29 ("O shell ocupa exatamente a viewport (height: 100dvh … overflow: hidden no body)") | Clara | — |
| Dados operacionais | **Parcial**: "Tabelas · Compact Pro" renomeada "Dados operacionais" + texto livre | **Sim, com conteúdo de exemplo como se fosse escolha**: L319–320 ("Título: Pedidos recentes", "Colunas: Cliente \| Status \| Valor \| Data"). O layout diz "Grade central de blocos de status (filas, SLA, equipes)" (L31) | Contraditória quanto ao domínio. L4 afirma que "Todas as decisões abaixo foram visualizadas e aprovadas" | **B2** |
| Indicadores | **Sim**: "KPIs e stat cards · Compact Pro", nome "Indicadores" | **Sim**: L225–298. Propriedades de exemplo: "Rótulo: Receita mensal · Valor: R$ 48,2 mil" (L243–244). Comportamento de catálogo: "clique abre o relatório detalhado" (L281) | Estrutura clara; domínio e alvo do clique ambíguos | **B2, B5** |
| Conteúdo em colunas | **Indireta**: estrutura fixa do layout (`minmax(0,1fr) 304px`) | **Sim**: L30, L35. A grade interna (L31) não diz quantas colunas | Clara para as 2 colunas principais; a grade interna fica livre | — |
| Sem rolagem principal quando couber | **Sim**: One Screen no desktop e no celular | **Sim**: L20, L49; "Altura útil menor que ≈640 px … o modo One Screen é desativado" (L56); ≈560 px no celular (L95) | Clara, com limiares explícitos | — |
| Monitores grandes | **Não, LACUNA.** Paliativo em texto livre | **Só** "Observação do usuário: Requisito do cliente: adaptação para monitores grandes." (L61). Há ainda o breakpoint "xl: Monitores grandes (1440 px ou mais)" (L385) e a validação "até 1920" (L378) | Vaga: nenhuma regra concreta | **A1** |
| Comportamento móvel definido explicitamente | **Sim**: "One Screen com painel em abas" | **Sim**: L67–102. Problemas: faixa de troca contraditória (L58/L98 × L106); conteúdo das abas não definido; "Horizontal: abas viram rail" (L97) contra "A partir de 768 px passa a valer a arquitetura desktop" (L98) | Estrutura clara; transições ambíguas | **B1, B3, D4** |
| Identidade (Neutro Essencial, Inter, 8 px, contornada, sem sombra) | Sim (padrões do Studio) | Sim: L119–219, tabela de tokens completa | Clara. Conflita com a família Compact Pro dos componentes (L229–261) | **D1** |
| Densidade da tabela | UI do Studio: "Padrão" (captura 52) | Prompt e JSON: "Densidade: compacta" (L322) | O exportado não é o que a UI mostrava | **A2** |
| Prévia integrada aprovada | Mostrada e aprovada (capturas 17, 20, 21) | Nada dela vai ao prompt, e ela não representa o desenho do layout (capturas 08 e 57) | — | **A3** |

**Conclusão da cadeia.**
- Das 7 características do briefing, 5 foram escolhidas de forma estruturada e chegaram claras ao prompt.
- "Dados operacionais" e "Indicadores" chegaram com conteúdo de exemplo contraditório (B).
- "Monitores grandes" não tem representação estruturada (A).
- O comportamento móvel chegou claro na estrutura, mas ambíguo nas faixas de transição (B/D).

## 3. Leitura por dimensão

**Desktop.**
- Os três reproduzem exatamente a grade do layout em 1440×900:
  - header de 52 px, coluna de alertas de 304 px e barra de status de 32 px;
  - `gap 0`, sem rolagem do documento;
  - alertas com rolagem interna, `overscroll-behavior: contain` e fade;
  - aba de alertas entre 1024 e 1279 px;
  - modo empilhado com altura de 600 px.
- dev-3 perde pontos pela ausência da grade de status (DSK7, C) e pela falta de adaptação a monitores grandes (DSK13, A).
- dev-2 tem sobreposição em 768 e 820 px (DSK14, C): ver `composicoes/evidencia-dev-2-768-sobreposicao-sla.png`.

**Celular.**
- Os três têm topbar de 56 px e abas de 44 px no topo, com `tablist`/`aria-selected`/setas, safe area e nenhuma rolagem principal em cinco celulares.
- Abaixo de 560 px de altura a tela volta a rolar, e em paisagem as abas viram rail.
- A tabela vira cartões (dev-1 e dev-2) ou rolagem horizontal com coluna fixa (dev-3). As duas formas são permitidas.
- Só dev-2 faz a grade de blocos "ocupar o restante da altura" (MOB6, julgamento de design).

**Paleta e tokens.**
- Os tokens estão centralizados nos três (0–3 literais fora de `:root`). Bordas, texto secundário, estados e semânticos são exatos.
- dev-3 falha em três instruções claras: fonte (Times New Roman), cor do texto principal (#000 em 74% dos caracteres) e tamanho base (16 px).
- dev-1 e dev-2 usam `bgAlt` como fundo da área de conteúdo (B10) e texto escuro nos badges semânticos, por contraste (D2).
- Os três têm micro-espaçamentos fora da escala de 4 px (D3).

**Componentes.**
- Os três montam o KPI com os 6 elementos e a instância aprovada literal ("Receita mensal · R$ 48,2 mil · +12,4% · vs. mês anterior · Wallet").
- A tabela é semântica, com as 4 colunas aprovadas, badges, cabeçalho destacado, checkbox e ações.
- dev-3 alinha "Valor" à esquerda (C).
- As linhas do dev-2 têm 44–45 px. Isso coincide com a densidade "Padrão" que a UI do Studio mostrava (A2).

**Interações.**
- Os três passam em praticamente todos os testes: seleção com estado indeterminado, ordenação com `aria-sort`, hover nos tokens, estados de carregando/vazio/erro, menus com Esc/clique fora/retorno de foco, tooltip, relatório, alerta novo no topo com animação e `aria-live`, relógio, foco de 2 px em #18181b e `reduced-motion`.
- dev-3 abre o relatório por um botão "Ver relatório", não pelo clique no cartão (B5).

## 4. Matrizes de fidelidade

Legenda de origem:
- **—**: sem falha.
- **A**: Studio.
- **B**: Master Prompt.
- **C**: desenvolvedor.
- **D**: conflito ou limitação da especificação.
- **E**: diferença aceitável.

Os números de linha (Lnn) referem-se ao Master Prompt. "[JD]" marca julgamento de design.

### 4.1 Matriz — dev-1

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
| --- | --- | --- | --- | --- | --- |
| ARQ1 Entrada direta | "Aplicação diretamente" (Etapa 2) | L17–18: abre direto, sem landing/login | Abre direto no painel | 100% | — |
| ARQ2 Regiões do Painel operacional | Layout "Painel operacional" | L26–40: header/content/panel/footer | 4 regiões | 100% | — |
| ARQ3 Celular com arquitetura própria | "One Screen com painel em abas" | L58, L71, L80–83, L105 | Abas no topo; sem drawer, rail ou bottom nav | 100% | — |
| ARQ4 Sem header/sidebar de catálogo | Nenhum (Etapa 8) | L111 | Sem sidebar | 100% | — |
| ARQ5 HTML+CSS+JS puros | Tecnologia "HTML + CSS + JavaScript" | L13 | Puro; Inter via Google Fonts | 100% | — |
| ARQ6 Landmarks semânticos | — (regra global) | L425 | header/main/aside/footer | 100% | — |
| ARQ7 Os 2 componentes na tela | Indicadores + Dados operacionais | L223 | KPIs + tabela em 1440 e 390 | 100% | — |
| DSK1 Sem rolagem do documento | One Screen | L20, L29 | 0 px em 1280×800, 1440×900, 1920×1080 | 100% | — |
| DSK2 Conteúdo + alertas à direita | Painel operacional | L30, L37 | Grid 2 colunas; alertas de y=52 até o rodapé | 100% | — |
| DSK3 Header ≈52 px | Medida "Header ≈52 px" | L30, L44 | 52 px | 100% | — |
| DSK4 Painel ≈304 px | Medida "Painel ≈304 px" | L30, L45 | 304 px (1280); 336 px (1440, regra ≥ 1440) | 100% | E |
| DSK5 Barra de status ≈32 px com relógio, conexão e atualização | Medida "Rodapé ≈32 px" | L30, L32, L46 | 32 px na base; conexão, última atualização, relógio | 100% | — |
| DSK6 gap 0 / padding 0 | Propriedades do layout | L38–39 | gap 0, padding 0, arestas encostadas | 100% | — |
| DSK7 Grade de status (filas, SLA, equipes) | Descrição do layout | L31 | Filas, SLA e Equipes (4 linhas cada); badge com ícone e texto | 100% | — |
| DSK8 Alertas: cronologia, severidade, rolagem interna, fade | Coluna de alertas | L32, L49 | Cronológica; severidade; auto + contain; fade por mask | 100% | — |
| DSK9 Nada cortado (1280/1440) | One Screen | L49–50, L64 | Nenhum corte detectado | 100% | — |
| DSK10 1024–1279: alertas em aba | Texto fixo do layout | L55 | Abas Painel/Alertas em 1024 e 1180; alterna; sem rolagem | 100% | — |
| DSK11 768–1023: desktop compactado | Texto fixo (contradição L106) | L58, L98 × L106 | Desktop compactado com aba de alertas em 768/820 | 100% | E |
| DSK12 Altura < 640: One Screen desativado | Texto fixo do layout | L56 | Rola 1073 px, painéis empilhados, nada cortado | 100% | — |
| DSK13 Monitores grandes **[JD]** | LACUNA, só texto livre | L61 (+ L385 xl) | Regras ≥ 1440 (painel 336), ≥ 1920×1000 (escala 125%: header 65, painel 420, valor 34,6 px), 2560 (150%) | 100% | A (inventado) |
| DSK14 Varredura 768–1920 | Regras globais | L388–390 | 6/6 larguras sem defeito | 100% | — |
| DSK15 100dvh + fallback; overflow condicionado | One Screen | L29, L398 | height 100vh → 100dvh; overflow hidden só nas media queries One Screen | 100% | — |
| MOB1 Topbar + abas no topo, sem nav inferior | One Screen com painel em abas | L71, L80–83 | Topbar + 4 abas | 100% | — |
| MOB2 Topbar ≈56 / abas ≈44 | Medidas do modelo | L74, L88 | 56 / 44 px | 100% | — |
| MOB3 Sem rolagem principal (altura ≥ 560) | One Screen móvel | L75 | 0 px em 390×844, 360×780, 375×667, 412×915, 430×932 | 100% | — |
| MOB4 Abas funcionais e estáveis | Prévia com abas | L71, L92 | 4 abas trocam; shell 844; sem rolagem | 100% | — |
| MOB5 ARIA + setas | — | L91 | tablist/tab; aria-selected; ←/→ | 100% | — |
| MOB6 Destaque + grade ocupando a altura **[JD]** | Prévia (captura 12) | L77 | Destaque + blocos, mas blocos com altura do conteúdo (sobra área vazia) | 50% | D |
| MOB7 Safe area no topo | — | L74, L396 | env(safe-area-inset-top) na topbar | 100% | — |
| MOB8 Altura < 560 rola; paisagem → rail | Texto fixo | L95, L97 | 390×500 rola (aba ativa); 740×360 rail vertical | 100% | — |
| MOB9 Alvos ≥ 44×44 (todas as abas) | — | L234, L391 | 0 de 40 alvos < 44 | 100% | — |
| MOB10 Tabela no celular (cartões ou rolagem com 1ª coluna fixa) | — | L367–369 | Cartões + "Ordenar por" + "Selecionar todos" | 100% | E |
| MOB11 KPIs em 1 ou 2 colunas | — | L291 | Destaque em 1 coluna + 2 colunas compactas | 100% | — |
| MOB12 Varredura 320–600 | Regras globais | L388–391 | 8/8 larguras sem defeito | 100% | — |
| PAL1 Fundo bg / superfícies | Neutro Essencial | L132–134 | Área em bgAlt #f6f6f6; superfícies #ffffff | 75% | B |
| PAL2 Texto #18181b | Neutro Essencial | L136 | #18181b | 100% | — |
| PAL3 Texto secundário #707072 | Neutro Essencial | L137 | #707072 | 100% | — |
| PAL4 Borda #e6e6e6 | Neutro Essencial | L140 | #e6e6e6, 1 px | 100% | — |
| PAL5 Semânticos e fundos | Neutro Essencial (prévia 25) | L150–157, L219 | Fundo e ícone semânticos exatos; texto em #18181b (contraste) | 75% | D |
| PAL6 Estados (primary, hover, selected, navActive, foco) | Neutro Essencial | L123, L143–147, L163 | #18181b / #161618 / #f4f4f4 / #e3e3e4 / navText #4b4b4d | 100% | — |
| PAL7 Fonte Inter | Inter + Inter | L168–181 | Inter | 100% | — |
| PAL8 Base 15 (13 nos componentes), mín. 12, pesos 640–650 | Inter 15 px, títulos 650 | L172–184, L235 | 15 / 13 / 12 px; 650 / 640 | 100% | — |
| PAL9 Raios 6/8 (contêiner), 4/6/8 (controle) | Médios (8 px) + Compact Pro | L202–204, L236 | Cartões 6 px; controles 4/6 px | 100% | — |
| PAL10 Sem sombra e sem gradiente | "Sem sombra" | L198, L419 | Nenhuma sombra em superfície; só fades de rolagem | 100% | — |
| PAL11 Borda 1 px (contornada) | "Contornada", borda 1 px | L194, L205–207 | 1 px | 100% | — |
| PAL12 Tokens centralizados | — | L424 | 0 literais fora dos tokens | 100% | — |
| PAL13 Espaçamento múltiplo de 4 | Unidade 8 px | L197, L422 | 54% (fora: 2, 3, 5, 6, 10 px) | 54% | D/C |
| CMP1 KPI: 6 elementos | KPIs Compact Pro | L229, L232 | Rótulo, ícone, valor, variação com seta, comparativo, sparkline | 100% | — |
| CMP2 Cor da variação | KPIs Compact Pro | L233 | #117e39 / #dc2626 / #707072 | 100% | — |
| CMP3 tabular-nums | Compact Pro | L232, L235 | tabular-nums | 100% | — |
| CMP4 KPI 13/12 px, raio 6, borda 1, sem sombra | Compact Pro | L235–236, L250–253 | 12–13 px, 6 px, 1 px, sem sombra | 100% | — |
| CMP5 Instância "Receita mensal…" | Valores do cartão (exemplo) | L243–249 | 1º KPI literal; outros 3 inventados | 100% | E |
| CMP6 Grade de KPIs com 4 colunas | — | L291 | 4 colunas | 100% | — |
| CMP7 Tabela semântica | Tabelas Compact Pro | L307 | table/thead/th scope=col | 100% | — |
| CMP8 Instância "Pedidos recentes" | Valores da tabela (exemplo) | L319–321 | "Pedidos recentes"; Cliente/Status/Valor/Data; 4 linhas | 100% | — |
| CMP9 Badge de status; valores à direita | Tabelas Compact Pro | L304, L308 | Badges; Valor à direita, tabular | 100% | — |
| CMP10 Cabeçalho destacado, sem zebra | "Destacado", zebra não | L323–324 | th #f5f5f5; sem zebra | 100% | — |
| CMP11 Checkbox e ações por linha | Seleção sim, ações sim | L325–326 | Checkbox + menu ⋯ | 100% | — |
| CMP12 Densidade compacta | UI: "Padrão" × prompt: "compacta" (bug B2) | L310–312, L322 | Linhas 36–37 px; 13 px; 6 px | 100% | — |
| INT1 Selecionar todos / indeterminado | — | L357 | 1 linha → indeterminado; cabeçalho → todas | 100% | — |
| INT2 Ordenação com aria-sort | — | L357 | 4 colunas; aria-sort asc/desc | 100% | — |
| INT3 Hover de linha #f4f4f4 | — | L357, L143 | #f4f4f4 | 100% | — |
| INT4 Estados carregando/vazio/erro | — | L309, L423 | Skeleton (abertura/Atualizar); vazio e erro pelo menu "Simular" | 100% | — |
| INT5 Ações por linha (Esc, clique fora, foco) | — | L326, L114–115 | Menu abre; Esc, clique fora, foco volta | 100% | — |
| INT6 Tooltip no sparkline | Comportamento do KPI | L281 | "jul/26 · R$ 41,0 mil" | 100% | — |
| INT7 Clique abre relatório | Comportamento do KPI | L281 | Cartão inteiro abre o relatório; Esc; foco volta | 100% | — |
| INT8 Tempo real sem pular layout | Comportamento do layout | L51 | Alerta no topo em 36,5 s; animação 0,2 s; polite; shell inalterado | 100% | — |
| INT9 Relógio e última atualização | Barra de status | L32 | Relógio avança; última atualização presente | 100% | — |
| INT10 Foco visível 2–3 px #18181b | — | L217, L283, L287 | 9/9: outline 2 px #18181b | 100% | — |
| INT11 prefers-reduced-motion | — | L400 | @media presente; transições ≈ 0 | 100% | — |
| INT12 Hover de controles com tokens | — | L216, L282 | primária → #161618; secundária → #f4f4f4 | 100% | — |

**Notas de dev-1**: Arquitetura **100.0%** (n=7) · Desktop **100.0%** (n=15) · Celular **95.8%** (n=12) · Paleta/tokens **92.6%** (n=13) · Componentes **100.0%** (n=12) · Interações **100.0%** (n=12) · Geral **97.9%** (n=71)

### 4.2 Matriz — dev-2

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
| --- | --- | --- | --- | --- | --- |
| ARQ1 Entrada direta | "Aplicação diretamente" (Etapa 2) | L17–18: abre direto, sem landing/login | Abre direto no painel | 100% | — |
| ARQ2 Regiões do Painel operacional | Layout "Painel operacional" | L26–40: header/content/panel/footer | 4 regiões | 100% | — |
| ARQ3 Celular com arquitetura própria | "One Screen com painel em abas" | L58, L71, L80–83, L105 | Abas no topo; sem drawer, rail ou bottom nav | 100% | — |
| ARQ4 Sem header/sidebar de catálogo | Nenhum (Etapa 8) | L111 | Sem sidebar | 100% | — |
| ARQ5 HTML+CSS+JS puros | Tecnologia "HTML + CSS + JavaScript" | L13 | Puro; Inter local (woff2) | 100% | — |
| ARQ6 Landmarks semânticos | — (regra global) | L425 | header/main/aside/footer (obs.: sem h1) | 100% | E |
| ARQ7 Os 2 componentes na tela | Indicadores + Dados operacionais | L223 | KPIs + tabela em 1440 e 390 | 100% | — |
| DSK1 Sem rolagem do documento | One Screen | L20, L29 | 0 px em 1280×800, 1440×900, 1920×1080 | 100% | — |
| DSK2 Conteúdo + alertas à direita | Painel operacional | L30, L37 | Grid 2 colunas; alertas de y=52 até o rodapé | 100% | — |
| DSK3 Header ≈52 px | Medida "Header ≈52 px" | L30, L44 | 52 px | 100% | — |
| DSK4 Painel ≈304 px | Medida "Painel ≈304 px" | L30, L45 | 304 / 304 px | 100% | — |
| DSK5 Barra de status ≈32 px com relógio, conexão e atualização | Medida "Rodapé ≈32 px" | L30, L32, L46 | 32 px; data + relógio, conexão, atualizado | 100% | — |
| DSK6 gap 0 / padding 0 | Propriedades do layout | L38–39 | gap 0, padding 0, arestas encostadas | 100% | — |
| DSK7 Grade de status (filas, SLA, equipes) | Descrição do layout | L31 | Filas, SLA (barra de meta) e Equipes; badge com ícone e texto | 100% | — |
| DSK8 Alertas: cronologia, severidade, rolagem interna, fade | Coluna de alertas | L32, L49 | Cronológica; filtros de severidade; auto + contain; fade ::after | 100% | — |
| DSK9 Nada cortado (1280/1440) | One Screen | L49–50, L64 | Nenhum corte detectado | 100% | — |
| DSK10 1024–1279: alertas em aba | Texto fixo do layout | L55 | Abas Painel/Alertas; alterna | 100% | — |
| DSK11 768–1023: desktop compactado | Texto fixo (contradição L106) | L58, L98 × L106 | Desktop compactado com aba de alertas em 768/820 | 100% | E |
| DSK12 Altura < 640: One Screen desativado | Texto fixo do layout | L56 | Rola 774 px, empilhado | 100% | — |
| DSK13 Monitores grandes **[JD]** | LACUNA, só texto livre | L61 (+ L385 xl) | ≥ 1440 reorganiza (tabela ao lado da grade de status); 1920 escala 113% (header 59, painel 344); 2560 133% | 100% | A (inventado) |
| DSK14 Varredura 768–1920 | Regras globais | L388–390 | 4/6: em 768 e 820 o badge "Normal" cobre "95,6% · meta 95,0%" (SLA) | 67% | C |
| DSK15 100dvh + fallback; overflow condicionado | One Screen | L29, L398 | height 100vh → 100dvh; overflow hidden só nas media queries One Screen | 100% | — |
| MOB1 Topbar + abas no topo, sem nav inferior | One Screen com painel em abas | L71, L80–83 | Topbar + 4 abas (mantém barra de status de 32 px embaixo, informativa) | 100% | E/B |
| MOB2 Topbar ≈56 / abas ≈44 | Medidas do modelo | L74, L88 | 56 / 44 px | 100% | — |
| MOB3 Sem rolagem principal (altura ≥ 560) | One Screen móvel | L75 | 0 px em 390×844, 360×780, 375×667, 412×915, 430×932 | 100% | — |
| MOB4 Abas funcionais e estáveis | Prévia com abas | L71, L92 | 4 abas; estável | 100% | — |
| MOB5 ARIA + setas | — | L91 | tablist/tab; aria-selected; ←/→ | 100% | — |
| MOB6 Destaque + grade ocupando a altura **[JD]** | Prévia (captura 12) | L77 | Destaque + blocos que ocupam a altura (minmax(min-content,1fr)) | 100% | — |
| MOB7 Safe area no topo | — | L74, L396 | env(safe-area-inset-top) na topbar | 100% | — |
| MOB8 Altura < 560 rola; paisagem → rail | Texto fixo | L95, L97 | 390×500 rola; rail | 100% | — |
| MOB9 Alvos ≥ 44×44 (todas as abas) | — | L234, L391 | 0 de 45 | 100% | — |
| MOB10 Tabela no celular (cartões ou rolagem com 1ª coluna fixa) | — | L367–369 | Cartões + "Ordenar" + "Todos" | 100% | E |
| MOB11 KPIs em 1 ou 2 colunas | — | L291 | Destaque em 1 coluna + 2 colunas compactas | 100% | — |
| MOB12 Varredura 320–600 | Regras globais | L388–391 | 8/8 larguras sem defeito | 100% | — |
| PAL1 Fundo bg / superfícies | Neutro Essencial | L132–134 | body #ffffff, shell #f6f6f6; superfícies #ffffff | 75% | B |
| PAL2 Texto #18181b | Neutro Essencial | L136 | #18181b | 100% | — |
| PAL3 Texto secundário #707072 | Neutro Essencial | L137 | #707072 | 100% | — |
| PAL4 Borda #e6e6e6 | Neutro Essencial | L140 | #e6e6e6, 1 px | 100% | — |
| PAL5 Semânticos e fundos | Neutro Essencial (prévia 25) | L150–157, L219 | Idem dev-1 | 75% | D |
| PAL6 Estados (primary, hover, selected, navActive, foco) | Neutro Essencial | L123, L143–147, L163 | #18181b / #161618 / #f4f4f4 / #e3e3e4 / navText #4b4b4d | 100% | — |
| PAL7 Fonte Inter | Inter + Inter | L168–181 | Inter (local) | 100% | — |
| PAL8 Base 15 (13 nos componentes), mín. 12, pesos 640–650 | Inter 15 px, títulos 650 | L172–184, L235 | 15 / 13 / 12 px; 650 / 640 | 100% | — |
| PAL9 Raios 6/8 (contêiner), 4/6/8 (controle) | Médios (8 px) + Compact Pro | L202–204, L236 | Cartões 6 px; controles 4/6 px | 100% | — |
| PAL10 Sem sombra e sem gradiente | "Sem sombra" | L198, L419 | Nenhuma sombra em superfície; só fades de rolagem | 100% | — |
| PAL11 Borda 1 px (contornada) | "Contornada", borda 1 px | L194, L205–207 | 1 px | 100% | — |
| PAL12 Tokens centralizados | — | L424 | 1 (meta theme-color) | 100% | — |
| PAL13 Espaçamento múltiplo de 4 | Unidade 8 px | L197, L422 | 72% (47% bruto; 11 px vem do prompt) | 72% | D |
| CMP1 KPI: 6 elementos | KPIs Compact Pro | L229, L232 | Rótulo, ícone, valor, variação com seta, comparativo, sparkline | 100% | — |
| CMP2 Cor da variação | KPIs Compact Pro | L233 | #117e39 / #dc2626 / #707072 | 100% | — |
| CMP3 tabular-nums | Compact Pro | L232, L235 | tabular-nums | 100% | — |
| CMP4 KPI 13/12 px, raio 6, borda 1, sem sombra | Compact Pro | L235–236, L250–253 | 12–13 px, 6 px, 1 px, sem sombra | 100% | — |
| CMP5 Instância "Receita mensal…" | Valores do cartão (exemplo) | L243–249 | 1º KPI literal; outros 3 inventados | 100% | E |
| CMP6 Grade de KPIs com 4 colunas | — | L291 | 4 colunas | 100% | — |
| CMP7 Tabela semântica | Tabelas Compact Pro | L307 | table/thead/th scope=col | 100% | — |
| CMP8 Instância "Pedidos recentes" | Valores da tabela (exemplo) | L319–321 | "Pedidos recentes"; Cliente/Status/Valor/Data; 4 linhas | 100% | — |
| CMP9 Badge de status; valores à direita | Tabelas Compact Pro | L304, L308 | Badges; Valor à direita, tabular | 100% | — |
| CMP10 Cabeçalho destacado, sem zebra | "Destacado", zebra não | L323–324 | th #f5f5f5; sem zebra | 100% | — |
| CMP11 Checkbox e ações por linha | Seleção sim, ações sim | L325–326 | Checkbox + menu ⋮ | 100% | — |
| CMP12 Densidade compacta | UI: "Padrão" × prompt: "compacta" (bug B2) | L310–312, L322 | Linhas 44–45 px (2 linhas: cliente + código); 13 px; 6 px | 67% | A |
| INT1 Selecionar todos / indeterminado | — | L357 | 1 linha → indeterminado; cabeçalho → todas | 100% | — |
| INT2 Ordenação com aria-sort | — | L357 | 4 colunas; aria-sort | 100% | — |
| INT3 Hover de linha #f4f4f4 | — | L357, L143 | #f4f4f4 | 100% | — |
| INT4 Estados carregando/vazio/erro | — | L309, L423 | Skeleton; vazio; erro ("Simular estado") | 100% | — |
| INT5 Ações por linha (Esc, clique fora, foco) | — | L326, L114–115 | Menu abre; Esc, clique fora, foco volta | 100% | — |
| INT6 Tooltip no sparkline | Comportamento do KPI | L281 | "R$ 44,6 mil · Ago/26" | 100% | — |
| INT7 Clique abre relatório | Comportamento do KPI | L281 | Cartão abre o relatório (gráfico, tabela, CSV) | 100% | — |
| INT8 Tempo real sem pular layout | Comportamento do layout | L51 | Alerta no topo em 2,5 s; 0,2 s; polite | 100% | — |
| INT9 Relógio e última atualização | Barra de status | L32 | Relógio avança; última atualização presente | 100% | — |
| INT10 Foco visível 2–3 px #18181b | — | L217, L283, L287 | 9/9: 2 px + halo 35% | 100% | — |
| INT11 prefers-reduced-motion | — | L400 | @media presente; transições ≈ 0 | 100% | — |
| INT12 Hover de controles com tokens | — | L216, L282 | primária → #161618; secundária → #f4f4f4 | 100% | — |

**Notas de dev-2**: Arquitetura **100.0%** (n=7) · Desktop **97.8%** (n=15) · Celular **100.0%** (n=12) · Paleta/tokens **94.0%** (n=13) · Componentes **97.2%** (n=12) · Interações **100.0%** (n=12) · Geral **98.0%** (n=71)

### 4.3 Matriz — dev-3

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
| --- | --- | --- | --- | --- | --- |
| ARQ1 Entrada direta | "Aplicação diretamente" (Etapa 2) | L17–18: abre direto, sem landing/login | Abre direto no painel | 100% | — |
| ARQ2 Regiões do Painel operacional | Layout "Painel operacional" | L26–40: header/content/panel/footer | 4 regiões (conteúdo sem grade de status, ver DSK7) | 100% | — |
| ARQ3 Celular com arquitetura própria | "One Screen com painel em abas" | L58, L71, L80–83, L105 | Abas no topo; sem drawer, rail ou bottom nav | 100% | — |
| ARQ4 Sem header/sidebar de catálogo | Nenhum (Etapa 8) | L111 | Sem sidebar | 100% | — |
| ARQ5 HTML+CSS+JS puros | Tecnologia "HTML + CSS + JavaScript" | L13 | Puro; Google Fonts (fonte não aplicada, PAL7) | 100% | — |
| ARQ6 Landmarks semânticos | — (regra global) | L425 | header/main/aside/footer | 100% | — |
| ARQ7 Os 2 componentes na tela | Indicadores + Dados operacionais | L223 | KPIs + tabela em 1440 e 390 | 100% | — |
| DSK1 Sem rolagem do documento | One Screen | L20, L29 | 0 px em 1280×800, 1440×900, 1920×1080 | 100% | — |
| DSK2 Conteúdo + alertas à direita | Painel operacional | L30, L37 | Grid 2 colunas; alertas de y=52 até o rodapé | 100% | — |
| DSK3 Header ≈52 px | Medida "Header ≈52 px" | L30, L44 | 52 px | 100% | — |
| DSK4 Painel ≈304 px | Medida "Painel ≈304 px" | L30, L45 | 304 / 304 px | 100% | — |
| DSK5 Barra de status ≈32 px com relógio, conexão e atualização | Medida "Rodapé ≈32 px" | L30, L32, L46 | 32 px; conexão, hora, última atualização | 100% | — |
| DSK6 gap 0 / padding 0 | Propriedades do layout | L38–39 | gap 0, padding 0, arestas encostadas | 100% | — |
| DSK7 Grade de status (filas, SLA, equipes) | Descrição do layout | L31 | **Ausente**: não há filas; SLA e equipes só como KPIs | 25% | C |
| DSK8 Alertas: cronologia, severidade, rolagem interna, fade | Coluna de alertas | L32, L49 | Cronológica; severidade; auto + contain; fade ::after | 100% | — |
| DSK9 Nada cortado (1280/1440) | One Screen | L49–50, L64 | Nenhum corte detectado | 100% | — |
| DSK10 1024–1279: alertas em aba | Texto fixo do layout | L55 | Abas Grade/Alertas; alterna | 100% | — |
| DSK11 768–1023: desktop compactado | Texto fixo (contradição L106) | L58, L98 × L106 | Desktop compactado com aba de alertas em 768/820 | 100% | E |
| DSK12 Altura < 640: One Screen desativado | Texto fixo do layout | L56 | Rola 355 px, empilhado | 100% | — |
| DSK13 Monitores grandes **[JD]** | LACUNA, só texto livre | L61 (+ L385 xl) | Sem regra: 1920 e 2560 iguais a 1440 (header 52, painel 304, valor ≤ 30 px); grande área vazia | 60% | A |
| DSK14 Varredura 768–1920 | Regras globais | L388–390 | 6/6 | 100% | — |
| DSK15 100dvh + fallback; overflow condicionado | One Screen | L29, L398 | height 100vh → 100dvh; overflow hidden só nas media queries One Screen | 100% | — |
| MOB1 Topbar + abas no topo, sem nav inferior | One Screen com painel em abas | L71, L80–83 | Topbar + 3 abas | 100% | — |
| MOB2 Topbar ≈56 / abas ≈44 | Medidas do modelo | L74, L88 | 56 / 44 px | 100% | — |
| MOB3 Sem rolagem principal (altura ≥ 560) | One Screen móvel | L75 | 0 px em 390×844, 360×780, 375×667, 412×915, 430×932 | 100% | — |
| MOB4 Abas funcionais e estáveis | Prévia com abas | L71, L92 | 3 abas; estável | 100% | — |
| MOB5 ARIA + setas | — | L91 | tablist/tab; aria-selected; ←/→ | 100% | — |
| MOB6 Destaque + grade ocupando a altura **[JD]** | Prévia (captura 12) | L77 | Destaque + grade sem preencher a altura; sem aba Operação | 50% | D/C |
| MOB7 Safe area no topo | — | L74, L396 | env(safe-area-inset-top) na topbar | 100% | — |
| MOB8 Altura < 560 rola; paisagem → rail | Texto fixo | L95, L97 | 390×500 rola (todas as seções); rail | 100% | — |
| MOB9 Alvos ≥ 44×44 (todas as abas) | — | L234, L391 | 2 de 33: "Valor" 40×44, "Data" 37×44 (aba Dados) | 94% | C |
| MOB10 Tabela no celular (cartões ou rolagem com 1ª coluna fixa) | — | L367–369 | Rolagem horizontal local, checkbox e Cliente fixos | 100% | E |
| MOB11 KPIs em 1 ou 2 colunas | — | L291 | Destaque em 1 coluna + 2 colunas compactas | 100% | — |
| MOB12 Varredura 320–600 | Regras globais | L388–391 | 8/8 larguras sem defeito | 100% | — |
| PAL1 Fundo bg / superfícies | Neutro Essencial | L132–134 | Branco (padrão do navegador; token não aplicado no body); superfícies #ffffff | 100% | E |
| PAL2 Texto #18181b | Neutro Essencial | L136 | body #000000 (padrão): 74% dos caracteres em #000 | 25% | C |
| PAL3 Texto secundário #707072 | Neutro Essencial | L137 | #707072 | 100% | — |
| PAL4 Borda #e6e6e6 | Neutro Essencial | L140 | #e6e6e6, 1 px | 100% | — |
| PAL5 Semânticos e fundos | Neutro Essencial (prévia 25) | L150–157, L219 | Texto e ícone semânticos sobre fundo semântico | 100% | — |
| PAL6 Estados (primary, hover, selected, navActive, foco) | Neutro Essencial | L123, L143–147, L163 | #18181b / #161618 / #f4f4f4 / #e3e3e4 / navText #4b4b4d | 100% | — |
| PAL7 Fonte Inter | Inter + Inter | L168–181 | **Times New Roman** em todo o site (`--font` nunca aplicado) | 0% | C |
| PAL8 Base 15 (13 nos componentes), mín. 12, pesos 640–650 | Inter 15 px, títulos 650 | L172–184, L235 | body 16 px (padrão); mín. 12; 650 / 640 | 67% | C |
| PAL9 Raios 6/8 (contêiner), 4/6/8 (controle) | Médios (8 px) + Compact Pro | L202–204, L236 | Cartões 6 px; controles 4/6 px | 100% | — |
| PAL10 Sem sombra e sem gradiente | "Sem sombra" | L198, L419 | Nenhuma sombra em superfície; só fades de rolagem | 100% | — |
| PAL11 Borda 1 px (contornada) | "Contornada", borda 1 px | L194, L205–207 | 1 px | 100% | — |
| PAL12 Tokens centralizados | — | L424 | 3 rgba (halo/fade) | 100% | — |
| PAL13 Espaçamento múltiplo de 4 | Unidade 8 px | L197, L422 | 73% (fora: 2, 6 px) | 73% | D/C |
| CMP1 KPI: 6 elementos | KPIs Compact Pro | L229, L232 | Rótulo, ícone, valor, variação com seta, comparativo, sparkline | 100% | — |
| CMP2 Cor da variação | KPIs Compact Pro | L233 | #117e39 / #dc2626 / #707072 | 100% | — |
| CMP3 tabular-nums | Compact Pro | L232, L235 | tabular-nums | 100% | — |
| CMP4 KPI 13/12 px, raio 6, borda 1, sem sombra | Compact Pro | L235–236, L250–253 | 12–13 px, 6 px, 1 px, sem sombra | 100% | — |
| CMP5 Instância "Receita mensal…" | Valores do cartão (exemplo) | L243–249 | 1º KPI literal; outros 3 inventados | 100% | E |
| CMP6 Grade de KPIs com 4 colunas | — | L291 | 4 colunas | 100% | — |
| CMP7 Tabela semântica | Tabelas Compact Pro | L307 | table/thead/th scope=col | 100% | — |
| CMP8 Instância "Pedidos recentes" | Valores da tabela (exemplo) | L319–321 | "Pedidos recentes"; Cliente/Status/Valor/Data; 4 linhas | 100% | — |
| CMP9 Badge de status; valores à direita | Tabelas Compact Pro | L304, L308 | Badges; **Valor alinhado à esquerda** | 50% | C |
| CMP10 Cabeçalho destacado, sem zebra | "Destacado", zebra não | L323–324 | th #f6f6f6; sem zebra | 100% | — |
| CMP11 Checkbox e ações por linha | Seleção sim, ações sim | L325–326 | Checkbox + botão "Detalhes" | 100% | E |
| CMP12 Densidade compacta | UI: "Padrão" × prompt: "compacta" (bug B2) | L310–312, L322 | Linhas 40 px; 13 px; 6 px | 100% | — |
| INT1 Selecionar todos / indeterminado | — | L357 | 1 linha → indeterminado; cabeçalho → todas | 100% | — |
| INT2 Ordenação com aria-sort | — | L357 | Cliente/Valor/Data; aria-sort (Status não ordena) | 100% | E |
| INT3 Hover de linha #f4f4f4 | — | L357, L143 | #f4f4f4 | 100% | — |
| INT4 Estados carregando/vazio/erro | — | L309, L423 | Skeleton; vazio; erro (?estado=) | 100% | — |
| INT5 Ações por linha (Esc, clique fora, foco) | — | L326, L114–115 | Diálogo de detalhes; Esc; foco volta | 100% | — |
| INT6 Tooltip no sparkline | Comportamento do KPI | L281 | "29/10: R$ 45,1 mil" | 100% | — |
| INT7 Clique abre relatório | Comportamento do KPI | L281 | Cartão/sparkline não abrem; botão "Ver relatório" abre | 80% | B |
| INT8 Tempo real sem pular layout | Comportamento do layout | L51 | Alerta no topo em 6 s; 0,3 s; polite | 100% | — |
| INT9 Relógio e última atualização | Barra de status | L32 | Relógio avança; última atualização presente | 100% | — |
| INT10 Foco visível 2–3 px #18181b | — | L217, L283, L287 | 9/9: 2 px + halo 3 px 35% | 100% | — |
| INT11 prefers-reduced-motion | — | L400 | @media presente; transições ≈ 0 | 100% | — |
| INT12 Hover de controles com tokens | — | L216, L282 | primária → #161618; secundária → #f4f4f4 | 100% | — |

**Notas de dev-3**: Arquitetura **100.0%** (n=7) · Desktop **92.3%** (n=15) · Celular **95.3%** (n=12) · Paleta/tokens **81.9%** (n=13) · Componentes **95.8%** (n=12) · Interações **98.3%** (n=12) · Geral **93.3%** (n=71)


## 5. Comparação entre os três sites

### 5.1 Decisões interpretadas de forma diferente (indícios de ambiguidade)

| Tema | dev-1 | dev-2 | dev-3 | Trecho do prompt | Leitura |
| --- | --- | --- | --- | --- | --- |
| Monitores grandes | ≥ 1440: painel de 336 px; ≥ 1920×1000: escala de 125%; 2560: 150%; 3840: 225% | ≥ 1440: reorganiza (tabela ao lado da grade de status); 1920/2560/3200: 113/133/160% | Nada além do fluido (`clamp` até 30 px) | "Requisito do cliente: adaptação para monitores grandes." (L61) | **A1**: três soluções sem base comum |
| Abas do celular | Indicadores · Operação · Pedidos · Alertas | Indicadores · Operação · Dados · Alertas | Indicadores · Dados · Alertas | "abas fixas no topo que alternam painéis" (L71); "mesmos destinos de navegação" (L107) | **B3**. Nenhum usou "Hoje / Semana / Mês", que aparece na prévia aprovada (captura 12) |
| Barra de status no celular | Conexão e atualização na topbar; sem relógio | Barra de 32 px mantida embaixo | Conexão e atualização na topbar | "inferior: none" (L81) × "barra de status … relógio, conexão" (L32) | **B7** |
| Texto dos badges semânticos | `text` + ícone semântico | `text` + ícone semântico | Texto semântico sobre o fundo semântico | "success/warning/error/info com os fundos semânticos correspondentes" (L219) × "contraste WCAG AA" (L425) | **D2** |
| Anel de foco | 2 px sólido | 2 px + halo de 35% | 2 px + halo de 3 px a 35% | "2–3 px" (L217) · "3 px … a 35%" (L283) · "anel de 2 px" (L287) | **B4** |
| Cor da variação | Pela direção; escolheu KPIs em que subir é bom | Pelo efeito (favorável/desfavorável) | Pela direção; deixou "filas" de fora por causa disso | "Variação positiva em sucesso, negativa em erro" (L233) | **B6** |
| Gatilho do relatório | Cartão inteiro é `<button>` | Cartão inteiro é `<button>` | Botão "Ver relatório" | "Tooltip no sparkline com valores; clique abre o relatório detalhado." (L281) | **B5** |
| Ação principal do header | "Atualizar" | "Relatório" | "Atualizar" (+ "Pausar atualizações") | "o logo e a ação principal continuam visíveis" (L403); nenhum header escolhido (L111) | **B9** |
| Fundo da área de conteúdo | `bgAlt` #f6f6f6 | `bgAlt` #f6f6f6 (no shell) | Branco | `bg` "Fundo principal" / `bgAlt` "Fundo secundário" (L132–133) | **B10**. O desenho do layout (57) é cinza; a prévia integrada (17) é branca |
| Padding interno | 12 px | 11 px | 12 px | "paddingInterno: 11 px" (L278) × "múltiplos de 4 px" (L197) | **D3** |
| Fonte | Google Fonts | woff2 local | Google Fonts (e nunca aplicada) | Só "Inter" (L168–181) | **B8** |
| Gatilho dos estados | Menu "Simular" no header | Menu "Simular estado" na tabela | Parâmetro `?estado=` | "Estados de carregando (skeleton), vazio e erro" (L309) | **B11** |
| Ações por linha | Menu ⋯ (detalhes/concluir/cancelar) | Menu ⋮ (detalhes/pago/cancelar) | Botão "Detalhes" | "Ações por linha: sim" (L326) | **B12** |
| Cor do sparkline | `accent` (azul) | Semântica (verde, vermelho, cinza) | `primary` (preto) | Não especificada. A prévia do Studio mostra azul com área preenchida | **A4** (detalhe visual não exportado) |
| Blocos do painel do celular | Altura do conteúdo | Ocupam a altura | Altura do conteúdo | "ocupando o restante da altura" (L77) × "altura definida pelo conteúdo" (L293) | **D5** |

### 5.2 O que os três acertaram

- **Estrutura desktop.**
  - Grid `1fr 304px` × `52px 1fr 32px` com `gap 0`.
  - One Screen sem rolagem em 1280, 1440 e 1920.
  - Alertas com rolagem interna, `overscroll` contido e fade.
  - Barra de status com relógio, conexão e atualização.
  - Aba de alertas entre 768 e 1279 px.
  - Modo empilhado com altura < 640 px.
- **Celular.**
  - Topbar de 56 px, abas de 44 px, safe area e ARIA das abas com setas.
  - Sem rolagem principal com altura ≥ 560 px; rola de novo abaixo de 560 px; rail em paisagem.
  - Nenhum overflow, corte ou alvo pequeno de 320 a 600 px (exceto 2 alvos no dev-3).
- **Tokens.**
  - Paleta centralizada; borda #e6e6e6; texto secundário #707072.
  - hover #f4f4f4 / #161618, selected e navActive #e3e3e4.
  - Raios de 4/6 px, nenhuma sombra em superfície, nenhum gradiente decorativo.
- **Componentes.**
  - Instância literal do KPI e da tabela; `tabular-nums`; cores da variação.
  - Cabeçalho destacado; checkbox com estado indeterminado; ordenação com `aria-sort`.
  - Estados de carregando/vazio/erro; tooltip; relatório; tempo real com `aria-live`; `reduced-motion`.
- **Contradições resolvidas da mesma forma.**
  - Os três usaram o corte de 768 px (B1), a mesma leitura de paisagem (D4) e a mesma divisão "shell global / componentes Compact Pro" (D1).
  - **Os três registraram nos NOTES:** a contradição 600 × 768 px (B1), o anel de foco (B4) e a falta de regra para monitores grandes (A1).
  - **Registros parciais:**
    - Conflito de domínio "Receita mensal × centro operacional" (B2): dev-2 (item 24) e dev-3 (item 1.4) explicitamente; dev-1 só indiretamente (3.1–3.2).
    - Padding de 11 px (D3): dev-1 (4.4) e dev-3 (1.9).
    - Pares semânticos × AA (D2): dev-1 (4.5) e dev-2 (19). dev-3 registrou apenas o contraste da borda e do placeholder.

## 6. Comparação visual com as capturas do Studio (julgamento de design, fora das notas)

Composições em `composicoes/`, todas com a mesma altura:
- `desktop-1440x900-studio-previa-vs-sites.png`
- `desktop-1920x1080-studio-layout-vs-sites.png`
- `tablet-768x1024-studio-vs-sites.png`
- `celular-390x844-studio-vs-sites.png`
- `componente-kpi-studio-vs-sites.png`
- `componente-tabela-studio-vs-sites.png`
- `paleta-identidade-studio-vs-sites.png`
- `evidencia-dev-2-768-sobreposicao-sla.png`

| Captura do Studio | dev-1 | dev-2 | dev-3 | Observação | Origem |
| --- | --- | --- | --- | --- | --- |
| Desenho do layout (08, 57): header, grade de blocos, coluna "Alertas", barra "Status" | Alta | Alta | Média | Os três reproduzem as 4 regiões. Os 6 gráficos do desenho são placeholders e ninguém os reproduziu, corretamente, pois o prompt fala em "blocos de status". dev-3 não tem grade de blocos | C (dev-3) |
| Prévia integrada, computador e tablet (17, 18, 20, 21) | Baixa | Baixa | Baixa | A prévia mostra navegação "Visão geral/Projetos/Equipe", "Filtros/Novo", gráfico de barras, "Clientes recentes", ficha de cliente em "Alertas" e rodapé "© … Privacidade Termos Ajuda". Nada disso está no prompt nem no desenho do layout | **A3** |
| Celular (12, 13, 19): "Painel" + busca, abas Hoje/Semana/Mês, destaque invertido (fundo #18181b), grade 2×2 que ocupa a altura | Média | Média-alta (a grade ocupa a altura) | Média-baixa (serifada, sem grade de status) | O prompt não leva os rótulos das abas, o destaque invertido nem o ícone de busca | **A4 / B3** |
| KPI Compact Pro (31, 33) | Alta (sparkline azul) | Média (sparkline semântico) | Baixa (serifada, sparkline preto, link "Ver relatório") | A variação aparece na prévia como pílula com `successBg` e o sparkline tem área preenchida. Nada disso foi exportado | **A4** + C1 (dev-3) |
| Tabela Compact Pro (34, 35) | Alta | Alta (tem "Exportar CSV", como o "Exportar" da prévia) | Média-baixa (serifada, Valor à esquerda, botão "Detalhes") | Avatares e botão "Exportar" da prévia não foram exportados | **A4** + C5 (dev-3) |
| Identidade (25): badges com texto colorido sobre fundo tingido | Média (texto escuro) | Média (texto escuro) | Alta nos badges; baixa na tipografia | Ver D2 e C1 | D2 / C1 |

## 7. Falhas por tipo

### A — Studio (4)

| # | Falha | Evidência | Efeito |
| --- | --- | --- | --- |
| A1 | Sem opção estruturada para monitores grandes. Só texto livre, sem regra. A busca Ctrl+K não encontra "monitor", "TV" nem "telas grandes" | `escolhas.md`; capturas 44, 47, 48; L61 | Três soluções diferentes. dev-3 sem adaptação (DSK13: 60%) |
| A2 | A densidade da tabela diverge: a UI mostra "Padrão" e o prompt exporta "compacta" (bug B2 da Fase 2) | Captura 52; L322 | dev-2 com linhas de 44–45 px (CMP12: 67%). Não dá para afirmar que é erro do desenvolvedor |
| A3 | A prévia integrada não representa o layout escolhido: conteúdo SaaS genérico, ficha de cliente em "Alertas", rodapé com links | Capturas 17, 20, 21 × 08, 57 | O usuário aprovou uma imagem que nenhum site reproduz (seção 6) |
| A4 | Detalhes visuais das prévias de componentes e do celular não são exportados: sparkline `accent` com área, variação em pílula, avatares, botão "Exportar", destaque invertido, abas por período e ícone de busca | Capturas 12, 31, 34 × L225–374 | Cada desenvolvedor escolheu uma cor de sparkline e um estilo de destaque |

### B — Master Prompt (12), com redação corrigida sugerida

| # | Trecho atual | Problema | Redação sugerida |
| --- | --- | --- | --- |
| B1 | "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (sidebar recolhida em rail ou menus colapsados); caso contrário, use a estrutura mobile." (L106) × "Abaixo de 768 px vale a arquitetura mobile" (L58) / "A partir de 768 px passa a valer a arquitetura desktop" (L98) | Dois limites (600 e 768 px) e menção a uma sidebar que não existe. O intervalo de 768 a 1023 px fica sem regra | "Até 767 px: arquitetura mobile ("One Screen com painel em abas"). De 768 a 1279 px: estrutura do Painel operacional com os alertas em aba alternável (Grade \| Alertas) no header. A partir de 1280 px: grade + coluna de alertas visíveis. Este layout não tem sidebar." |
| B2 | "Todas as decisões abaixo foram visualizadas e aprovadas" (L4) + "Rótulo: Receita mensal · Valor: R$ 48,2 mil" (L243–244) + "Título: Pedidos recentes · Colunas: Cliente \| Status \| Valor \| Data" (L319–320) × "blocos de status (filas, SLA, equipes)" (L31) | Conteúdo de exemplo apresentado como decisão, em conflito com o domínio operacional | "Conteúdo ilustrativo (não definido pelo usuário): os rótulos e valores abaixo são exemplos do catálogo. Use dados do domínio do projeto (operação: filas, SLA, equipes) mantendo a estrutura do componente." Alternativa: marcar cada propriedade como `exemplo` ou `definida pelo usuário`. |
| B3 | "Tela One Screen com abas fixas no topo que alternam painéis…" (L71); "mesmos destinos de navegação" (L107) | Não diz quais são as abas. A prévia mostrava "Hoje / Semana / Mês" | "Abas do celular (nesta ordem): Indicadores · Operação (filas, SLA, equipes) · Dados operacionais · Alertas. Cada aba corresponde a uma região do desktop." Ou exportar os rótulos que a prévia mostra. |
| B4 | "anel de 2–3 px na cor focusRing" (L217) · "anel de 3 px em … focusRing a 35%" (L283) · "Foco com anel de 2 px" (L287) | Três regras para o mesmo estado | "Foco visível: contorno sólido de 2 px na cor focusRing (#18181b) com afastamento de 2 px. Opcional: halo externo de 3 px na mesma cor a 35%." |
| B5 | "Tooltip no sparkline com valores; clique abre o relatório detalhado." (L281) | Não diz onde se clica | "O cartão inteiro é um `<button>`: clique ou Enter abre o relatório detalhado em diálogo. O sparkline mostra tooltip com o valor do ponto ao passar o ponteiro ou ao navegar com ←/→ com foco no cartão." |
| B6 | "Variação positiva em sucesso, negativa em erro, neutra em texto secundário." (L233) | Positiva por direção ou por efeito? | "A cor indica o efeito: favorável = success, desfavorável = error, \|Δ\| < 0,5% = textMuted. A seta indica a direção. Em indicadores em que cair é bom (filas, tempo de espera), queda é favorável." |
| B7 | "inferior: none" (L81) × "barra de status de ≈32 px com relógio, conexão e última atualização" (L32) | Não diz se a barra de status existe no celular | "No celular não há barra inferior: conexão e última atualização ficam numa linha sob o título da topbar; o relógio é omitido." (Ou o contrário, mas explícito.) |
| B8 | "Tipografia: Inter + Inter … Títulos em Inter (peso 650) e textos em Inter (peso 400)" (L168–172) | Não diz como carregar a fonte | "Carregue a Inter variável (400–700) localmente com `@font-face` (woff2 empacotado, `font-display: swap`) e aplique `font-family: 'Inter', system-ui, sans-serif` no `body`." |
| B9 | "Nenhum modelo específico de header ou sidebar foi escolhido…" (L111); "o logo e a ação principal continuam visíveis" (L403) | A ação principal não é definida | O Studio deveria perguntar qual é a ação principal. Na falta dela: "Header: nome do sistema à esquerda; à direita, apenas os controles exigidos pelos componentes. Não há ação principal definida." |
| B10 | "Fundo principal `bg` #ffffff · Fundo secundário `bgAlt` #f6f6f6" (L132–133) | Não diz onde se usa cada um | "Fundo da área de conteúdo: `bgAlt`; cartões, painéis e barras: `surface` com borda `border`." Ou "tudo em `bg`", conforme a prévia aprovada. |
| B11 | "Estados de carregando (skeleton), vazio e erro." (L309); "Implemente estados…" (L423) | Sem gatilho para demonstrar sem backend | "Para demonstração, permita forçar os estados com `?estado=carregando\|vazio\|erro` (sem controles extras na interface)." |
| B12 | "Título + ações da tabela" (L307); "Ações por linha: sim" (L326) | Não diz quais ações | Exportar o que a prévia mostra: "Ação da tabela: Exportar. Ações por linha: menu ⋯ com Ver detalhes." |

### C — Desenvolvedor (7 pontuadas + 1 fora da rubrica)

| # | Site | Falha | Instrução clara | Evidência |
| --- | --- | --- | --- | --- |
| C1 | dev-3 | `--font` definido e nunca aplicado: todo o texto aparece em "Times New Roman" | "Títulos em Inter (peso 650) e textos em Inter (peso 400)" (L172) | `font-family` computado; `css/tokens.css:68` sem uso; `tests/shots/*.png` do próprio dev; PAL7: 0% |
| C2 | dev-3 | Texto principal em #000000 (cor padrão) em 833 de 1.132 caracteres | `text` #18181b (L136) | `medicoes/cores-finas.json`; PAL2: 25% |
| C3 | dev-3 | Corpo em 16 px, padrão do navegador | "tamanho base 15 px" (L172, L182) | PAL8: 67% |
| C4 | dev-3 | Grade de blocos de status (filas, SLA, equipes) ausente; o celular também perde a aba Operação | "Grade central de blocos de status (filas, SLA, equipes) com cores semânticas acompanhadas de ícone e texto." (L31) | NOTES 2.1 justifica pela regra de cor da variação (L233), que trata de KPIs e não de blocos de status; DSK7: 25% |
| C5 | dev-3 | Coluna "Valor" alinhada à esquerda | "valores alinhados à direita" (L304); "Números alinhados à direita com tabular-nums" (L308) | CMP9: 50% |
| C6 | dev-3 | Botões de ordenação "Valor" (40×44) e "Data" (37×44) no celular | "Alvos de toque com no mínimo 44 × 44 px no celular" (L391) | MOB9: 94% |
| C7 | dev-2 | Em 768 e 820 px, o badge "Normal" cobre o fim do texto "95,6% · meta 95,0%" nos três itens de SLA | "Nenhuma sobreposição indevida entre elementos" (L390) | `composicoes/evidencia-dev-2-768-sobreposicao-sla.png`; DSK14: 67% |
| C8* | dev-2 | Campos no celular com 15 px (o README diz 16) | "Inputs com 16 px no celular" (L188, L392) | `scripts/campos-celular.cjs`. *Fora da rubrica, não pontuado |

### D — Conflitos ou limitações da especificação (7)

| # | Conflito | Trechos | Como os sites resolveram |
| --- | --- | --- | --- |
| D1 | Identidade global × família Compact Pro | "densidade confortável", "Cantos médios (8 px)", "tamanho base 15 px" (L194, L172) × "Densidade: compacta", "Texto base 13 px", "Raio de 4 px … 6 px" (L235–236, L261) | Os três: shell no global, componentes no Compact Pro |
| D2 | Pares semânticos × WCAG AA | L219 × L425. error/errorBg ≈ 4,0:1 e info/infoBg ≈ 4,4:1 em 12–13 px | dev-1 e dev-2: texto em `text`. dev-3: literal (PAL5: 75 / 75 / 100) |
| D3 | Escala de 4 px × medidas da família | "múltiplos de 4 px" (L197) × "paddingInterno: 11 px" (L278), "padding reduzido em 25%" (L234) | dev-2: 11 px. dev-1 e dev-3: 12 px. Os três têm 2/3/5/6/10 px (PAL13) |
| D4 | Paisagem × corte de 768 px | "Horizontal: abas viram rail vertical" (L97) × "A partir de 768 px … arquitetura desktop" (L98) | Os três: rail abaixo de 768 px; desktop empilhado em 844×390 |
| D5 | Altura dos blocos móveis | "grade de blocos menores ocupando o restante da altura" (L77) × "altura definida pelo conteúdo" (L293, L412) | dev-2: `minmax(min-content, 1fr)`. dev-1 e dev-3: altura do conteúdo (MOB6: 50%) |
| D6 | `aria-current="page"` × abas | L113 × L91 | dev-2 e dev-3 usam os dois. dev-1 usa só `aria-selected` (correto para abas). Sem efeito na nota |
| D7 | `overflow: hidden` no body × "Nunca use overflow: hidden para esconder conteúdo" | L29 × L64 | Os três: só no modo One Screen, com rolagem interna nos painéis |

### E — Diferenças aceitáveis (9)

1. dev-1 alarga o painel de alertas para 336 px a partir de 1440 px (dentro de ±15%; L65 "adapte à tela").
2. Tabela no celular em cartões (dev-1, dev-2) ou com rolagem horizontal e coluna fixa (dev-3). As duas são permitidas (L367).
3. Status no celular: na topbar (dev-1, dev-3) ou em barra informativa (dev-2).
4. Recursos extras de demonstração: "Simular" (dev-1, dev-2), "Pausar" (dev-2, dev-3, por WCAG 2.2.2), atalhos `R`, `/`, `P` e exportação CSV (dev-2).
5. Três KPIs extras inventados para a grade "4 → 2 → 1" (L291), mantendo o primeiro literal.
6. dev-3: coluna Status não ordenável. O prompt não exige todas as colunas.
7. dev-3: `body` sem `background`. O resultado é branco, visualmente igual a `bg`.
8. dev-3: ação por linha como botão "Detalhes", em vez de menu.
9. dev-2: sem `<h1>` (os landmarks estão completos).

## 8. Achados fora da rubrica (não pontuados)

- **C8 (dev-2):** campos com 15 px no celular, contra os 16 px exigidos.
- **Testes do próprio dev-3:** `tests/check.js` e as capturas não detectaram a fonte serifada. O `last-run.txt` só registra "OK".
- **Dependência de rede (dev-1, dev-3):** a fonte vem do Google Fonts e, offline, cai para a fonte do sistema. dev-2 empacota a Inter.
- **Diferenças da prévia do celular:** nenhum site reproduz o destaque invertido nem as abas "Hoje / Semana / Mês" (A4/B3).
- **Comportamentos que viraram "aprovados" sem pedido do cliente:** "Atualização em tempo real" (L51) e "clique abre o relatório detalhado" (L281) são padrões do catálogo, e os três os implementaram como se fossem requisitos (bug B6 da Fase 2, ligado a B2).

## 9. Arquivos

- `rubrica.md`: requisitos, métodos e limiares, escritos antes de abrir os sites.
- `capturas/`:
  - `dev-N-<viewport>.png`: 12 viewports por site.
  - `dev-N-390x844-abaK.png`: cada aba do celular.
  - `dev-N-1024x768-aba-alertas.png` e `dev-N-1180x800-aba-alertas.png`.
  - `dev-N-estado-*.png`.
  - `dev-N-int-*.png`: tooltip, relatório e ação por linha.
  - `dev-N-recorte-*.png`: KPI, tabela e alertas.
- `composicoes/`: 7 composições Studio × sites + 1 evidência.
- `medicoes/`:
  - `dev-N-medicoes.json`: DOM em 17 viewports + varredura de 14 larguras.
  - `dev-N-interacoes.json`.
  - `dev-1-complemento.json`.
  - `espacamento-fonte.json`.
  - `cores-finas.json`.
  - `notas.json`.
  - `matrizes.md`.
- `scripts/`: `lib.cjs`, `capturas.cjs`, `medir.cjs`, `interacoes.cjs`, `dev1-complemento.cjs`, `espacamento.cjs`, `cores-finas.cjs`, `campos-celular.cjs`, `composicoes.cjs`, `notas.py`, `matrizes.py`.
