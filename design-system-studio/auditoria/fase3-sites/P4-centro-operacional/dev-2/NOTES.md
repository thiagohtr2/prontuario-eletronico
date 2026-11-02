# NOTES: ambiguidades, lacunas e contradições do PROMPT.md

Cada item cita o trecho da especificação e registra a decisão tomada.

## A. Breakpoints e modos de layout

1. **Onde começa o desktop?**
   - "Abaixo de 768 px vale a arquitetura mobile" e "A partir de 768 px passa a valer a arquitetura desktop" contradizem "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (...); caso contrário, use a estrutura mobile".
   - Decisão: o limite é **768 px**, como dizem os dois itens de layout (mais específicos). Entre 600 e 767 px vale a arquitetura mobile (nesse intervalo os blocos da aba ocupam 2 colunas). Não há sidebar para "recolher em rail", então essa parte da regra de tablet não se aplica.

2. **768–1023 px não tem regra própria.** Só existe "1024–1279 px: alertas viram aba alternável com a grade". Decisão: 768–1279 usa o mesmo modo (abas Painel/Alertas no cabeçalho).

3. **Altura útil.** "Altura útil menor que ≈640 px" (desktop) e "≈560 px" (celular) não definem se é a viewport ou a área sem barras. Decisão: altura da viewport (`min-height` em media query), sem descontar header/footer.

4. **Celular na horizontal.**
   - "Horizontal: abas viram rail vertical à esquerda" conflita com "a partir de 768 px vale o desktop": um celular em 844 × 390 já é desktop pela largura.
   - Decisão: o rail vertical vale para largura < 768 em paisagem. Com largura >= 768 e altura < 640 o One Screen é desligado e os painéis se empilham, sem abas.
   - O rail também convive com "One Screen desativado" (altura < 560): a página rola, o rail fica fixo (sticky) e só o painel ativo aparece.

5. **Desktop com altura < 640 px.** "Os painéis se empilham": empilhei KPIs, status, tabela e alertas numa coluna; as abas somem porque tudo está visível. No celular com altura < 560 px as abas continuam e só o painel ativo aparece, com blocos empilhados.

6. **"body overflow: hidden" × "nunca use overflow: hidden para esconder conteúdo".** `overflow: hidden` fica só no body/shell nos modos One Screen. Toda região que pode ter mais conteúdo (conteúdo central, tabela, alertas, grades do celular) usa `overflow: auto` com fade de borda e vira região focável por teclado quando rola. `overflow: clip` só arredonda os cantos do cartão da tabela.

7. **Medidas em px × zoom/fonte ampliada.** 52 px, 32 px, 304 px etc. são escritas em `rem/15`: valem exatamente 52/32/304 px com a fonte padrão e crescem com a fonte do sistema (o texto não é reduzido, o layout se reorganiza).

8. **"Cards: altura definida pelo conteúdo" × "linhas em fr" no celular.** Usei `grid-auto-rows: minmax(min-content, 1fr)`: as linhas dividem a altura, mas nunca ficam menores que o conteúdo (o excedente rola dentro do painel).

## B. Navegação

9. **"Nenhum modelo específico de header ou sidebar".** Inventei o mínimo: marca, botão "Pausar/Retomar" e botão primário "Relatório". O "Relatório" é a ação principal porque o KPI diz "clique abre o relatório detalhado" e os componentes citam "Ação principal: primária sólida" sem dizer qual.

10. **Quais são as abas?**
    - O desktop só prevê grade ⇄ alertas; o celular só diz "abas" e "um destaque + grade de blocos" por painel.
    - Decisão: 768–1279 tem 2 abas (Painel, Alertas). No celular, a grade vira 3 painéis para caber em uma tela: Indicadores, Operação (filas/SLA/equipes), Dados (tabela), mais Alertas.
    - Isso contradiz em parte "mesmos destinos de navegação nas duas versões"; registrei como subdivisão da mesma região.

11. **`aria-current="page"` × `aria-selected` das abas.** Usei os dois na aba ativa, com `role="tab"`, roving tabindex e setas ←/→ (Home/End; ↑/↓ só no rail vertical).

12. **Marcador do item ativo.** "Item ativo marcado por sublinhado de 2 px" (família) e "cor de navegação ativa" (paleta): apliquei os dois (fundo `navActive`, texto `navActiveText` e sublinhado de 2 px em `primary`). A ordenação ativa da tabela também usa sublinhado de 2 px.

## C. Tipografia, tamanhos e foco

13. **Tamanho base.** Global: 15 px. Componentes Compact Pro: 13 px (rótulos 12 px). Decisão: 15 px no shell (cabeçalho, títulos, alertas) e 13/12 px dentro de KPIs, blocos e tabela.

14. **Peso de título.** Global "Inter 650" × componentes "Inter 640": 650 nos títulos do shell, 640 nos componentes.

15. **"Filtros e botões com pelo menos 14 px" × "texto base 13 px, controles 30 px".** Botões, filtros, chips e abas usam 14 px (altura 30 px); o corpo dos componentes fica em 13 px. No celular: controles de 44 px e campos de 16 px.

16. **Anel de foco.** "2–3 px", "3 px a 35%" e "anel de 2 px" divergem. Decisão: contorno sólido de 2 px em `focusRing` + halo de 3 px a 35% (o halo sozinho daria só ~2,4:1 de contraste). Dentro de áreas rolantes o anel fica por dentro para não ser cortado.

17. **Alvo de toque.** "Controles 30 px (44 px no celular)": o critério de celular é largura < 768 px (não `pointer: coarse`). Em tablets com toque (>= 768) os controles ficam em 30 px.

## D. Cor e contraste (WCAG AA × tokens fixos)

18. **Placeholder `#8c8c8d` tem 3,36:1** em branco, abaixo de 4,5:1. Usei `textMuted` (4,94:1) no placeholder; o campo tem sempre rótulo visível.

19. **Texto semântico em fundo semântico.** `error/errorBg` = 4,01:1, `warning/warningBg` = 4,41:1, `info/infoBg` = 4,37:1. Decisão: o texto das badges usa `text` (14:1) e a cor semântica fica no ícone e na barra; o texto semântico direto só aparece sobre branco (>= 4,8:1).

20. **Bordas.** `border` (1,25:1) é só separador. Campos e checkbox usam `textMuted` na borda (WCAG 1.4.11, 3:1); botões secundários usam `borderStrong`. Linhas selecionadas (`selected`) não usam texto `textMuted` (3,85:1).

21. **Gradiente.** Os tokens `gradientFrom/To` existem mas não são usados ("não adicione gradientes"). A única exceção é o fade de borda de rolagem (superfície → transparente), exigido em "sombra interna ou fade na borda".

22. **Sombras.** "Sem sombras" nas superfícies: só menu, diálogo, tooltip e toasts (flutuantes) têm elevação.

23. **Cor da variação do KPI.** "Variação positiva em sucesso, negativa em erro" foi lido como favorável/desfavorável: a seta mostra a direção e a cor mostra o efeito. Em "Tempo médio de espera" a queda é verde e a alta é vermelha; |variação| < 0,5% é neutra (texto secundário).

## E. Conteúdo e dados

24. **Tema × dados dos componentes.** O sistema é operacional (filas, SLA, equipes), mas os componentes aprovados trazem "Receita mensal / R$ 48,2 mil / +12,4% / vs. mês anterior" e "Pedidos recentes (Cliente | Status | Valor | Data)". Mantive esses valores literalmente. Os outros 3 KPIs (SLA cumprido, Pedidos concluídos hoje, Tempo médio de espera) são inventados, pois "4 → 2 → 1 colunas" pressupõe vários cartões.

25. **Blocos de status.** "Grade central de blocos de status (filas, SLA, equipes)" não define campos: criei Filas (na fila, espera, status), SLA (percentual, meta, barra) e Equipes (online/total). Status = ícone + texto + cor semântica (Normal/Atenção/Crítico) calculado por limites inventados.

26. **Linhas de exemplo: 4.** Mantive 4 e não acrescento linhas ao vivo. Em monitores grandes o painel da tabela ocupa só a altura do conteúdo (sobra área vazia embaixo); a alternativa seria inventar linhas.

27. **"Seleção com checkbox: sim", "Ações por linha: sim"** sem dizer quais ações: menu "Ver detalhes / Marcar como pago / Cancelar pedido", com itens desabilitados quando não se aplicam (`aria-disabled`). A seleção alimenta "Exportar seleção (n)".

28. **Estados de carregando/vazio/erro sem gatilho.** Há skeleton na carga inicial (~0,7 s), estado vazio ao filtrar sem resultados e o botão "Simular estado" (Normal/Carregando/Vazio/Erro de conexão), que afeta tabela e alertas, e o erro também muda a barra de status. Um botão de simulação não está na especificação; coloquei-o na barra de ferramentas da tabela para poder demonstrar os estados.

29. **Tabela no celular.** "Rolagem horizontal ... ou cartões": escolhi cartões (rótulo: valor). Como o cabeçalho some, ordenar e "selecionar todos" ganham controles próprios (select "Ordenar" e checkbox "Todos"). O título "Pedidos recentes" aparece como primeiro item do bloco de destaque do painel.

30. **Destaque dos painéis do celular.** "Um destaque principal no topo e uma grade de blocos menores": Indicadores = primeiro KPI em largura total; Operação = bloco Filas; Dados = faixa de resumo (pedidos, valor total, em aberto); Alertas = faixa de filtros com contagens.

31. **Barra de status no celular.** O celular tem "inferior: none" (navegação), mas a barra de status (relógio, conexão, última atualização) é só informativa; mantive uma versão compacta, que quebra linha em 320 px.

32. **Monitores grandes.** "Requisito do cliente: adaptação para monitores grandes" não é detalhado. Decisão: >= 1440 px reorganiza (tabela ao lado das filas/SLA/equipes); a partir de 1920 / 2560 / 3200 px escala o tamanho geral (113% / 133% / 160%). A escala só aumenta; nunca reduz fonte.

33. **Diálogo e menus no celular.** Menus viram bottom sheet ("podem virar bottom sheet"). O diálogo de relatório mantém formato de cartão com altura máx. 90dvh e rolagem interna; botões de ação ficam sempre visíveis.

34. **Tooltip do sparkline.** Mouse: passa o ponteiro. Teclado: foco no cartão + ←/→. Toque: sem tooltip (toque abre o relatório, que lista todos os valores).

35. **"Atalhos de teclado visíveis".** Sem lista definida: criei P (pausar), R (relatório) e / (filtro), mostrados como `kbd` nos botões. Ficam ocultos abaixo de 1024 px e em dispositivos de toque.

36. **Abas muito estreitas.** Em 320 px com fonte ampliada as abas quebram em duas linhas, em vez de estourar a largura ou encolher o texto.

37. **Dados em tempo real.** Simulados no cliente: ciclo de 5 s e um alerta novo a cada 15–25 s. "Pausar" interrompe, e os eventos `offline/online` do navegador mudam a conexão. A data da tabela é relativa ao dia atual (a especificação traz 02/11/2026, mas a demonstração não depende dela).

38. **Fontes e ícones offline.** Inter variável (latin + latin-ext) foi empacotada localmente e os ícones Lucide (traço 1,75) estão num sprite SVG inline; sem CDN, para funcionar em `file://`. Sem `type="module"`, que não carrega via `file://`.
