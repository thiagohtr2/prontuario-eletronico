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
