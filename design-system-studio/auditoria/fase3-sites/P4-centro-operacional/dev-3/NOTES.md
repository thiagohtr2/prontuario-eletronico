# Notas de implementação: Centro Operacional

Cada item indica a linha do `PROMPT.md` (numeração do arquivo) e a decisão tomada. Onde a especificação tinha duas regras conflitantes, a decisão segue a regra mais específica do item (ou a mais restritiva para acessibilidade).

## 1. Contradições

**1.1 Ponto de troca entre desktop e celular**
- L58: "Abaixo de 768 px vale a arquitetura mobile"; L98: "A partir de 768 px passa a valer a arquitetura desktop"; L106: "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber... caso contrário, use a estrutura mobile".
- Decisão: corte fixo em 768 px, que é o valor que as duas regras específicas dos itens citam. Entre 600 e 767 px vale o mobile. Entre 768 e 1023 px vale o desktop compactado: alertas viram aba, indicadores em 2 colunas, sem rail lateral. A regra "quando couber" não foi implementada como troca adaptativa.

**1.2 Abas em modo horizontal x altura mínima do celular**
- L95: com altura útil menor que 560 px, o One Screen é desativado. L97: na horizontal, "abas viram rail vertical à esquerda para economizar altura".
- Celulares na horizontal têm sempre altura menor que 560 px, então a tela nunca fica One Screen nesse caso.
- Decisão: a regra de altura prevalece (página empilhada e rolável). O rail lateral é mantido. Nesse modo empilhado, as abas não escondem seções: ao tocar numa aba, a página rola até a seção correspondente. Assim nada importante fica oculto.

**1.3 Clique no sparkline x botão de relatório**
- L281: "Tooltip no sparkline com valores; clique abre o relatório detalhado."
- Decisão: o tooltip aparece com o ponteiro ou com as setas ←/→ quando o sparkline está focado. Clicar no sparkline não abre o relatório, porque um gráfico não é um controle acessível. O relatório abre pelo botão "Ver relatório", que funciona com teclado e leitor de tela.

**1.4 Indicador "Receita mensal" em um centro operacional**
- L243–249 traz a instância aprovada do indicador (Receita mensal, R$ 48,2 mil, +12,4%, vs. mês anterior, ícone Wallet). L12 e L17 descrevem um painel operacional.
- Decisão: mantive a instância aprovada como primeiro indicador, sem alterar valores. Os demais (Atendimentos concluídos, SLA cumprido, Equipes ativas) seguem o mesmo componente com configuração própria, como exige L223. O cliente deve confirmar se a Receita deve permanecer no painel.

**1.5 Escala tipográfica e tamanho base**
- L172 e L182: texto base de 15 px. L229 e L235 (Compact Pro): texto base 13 px e rótulos 12 px. L177: "filtros e botões com pelo menos 14 px".
- Decisão: 15 px no texto geral (cabeçalho, diálogo). Dentro dos componentes de dados, 13 px no texto da tabela e dos indicadores e 12 px nos rótulos. Botões, campos e abas com 14 px. Nenhum texto abaixo de 12 px.

**1.6 Peso dos títulos**
- L172 e L183: títulos em Inter 650. L256 e L333: Inter 640 nos componentes Compact Pro.
- Decisão: 650 nos títulos globais (cabeçalho, diálogo) e 640 nos títulos de cartão e painel.

**1.7 Raios de borda**
- L202–204: raioPequeno 6 px, raioMedio 8 px, raioGrande 12 px. L236: Compact Pro usa 4 px nos controles e 6 px nos contêineres.
- Decisão: controles com 4 px, contêineres (cartões, tabela, resumo, painéis) com 6 px e diálogo com 8 px. Não há raio de 12 px, porque nenhum elemento o exige.

**1.8 Densidade**
- L208: densidade "comfortable". L261: Compact Pro com densidade "compacta".
- Decisão: densidade compacta nos componentes de dados (a regra do componente é mais específica). O restante da interface segue a densidade confortável.

**1.9 Padding de 11 px fora da escala de 4 px**
- L278: paddingInterno 11 px. L197: escala de espaçamento em múltiplos de 4 px.
- Decisão: 12 px, o múltiplo de 4 mais próximo e coerente com a redução de 25% de L234. A altura de controle de 30 px foi mantida porque L234 e L260 a especificam explicitamente, mesmo não sendo múltiplo de 4.

**1.10 Anel de foco**
- L217: "2–3 px"; L283: "3 px a 35%"; L287: "anel de 2 px".
- Decisão: contorno sólido de 2 px na cor `focusRing` (#18181b, que garante contraste) mais um halo de 3 px a 35%. Atende às três variantes e continua visível no fundo branco.

**1.11 aria-current em abas**
- L113 pede `aria-current="page"` no item ativo. L91 pede `role="tablist"` com `aria-selected`.
- Decisão: as abas têm os dois atributos. `aria-current="page"` é semanticamente impróprio para abas de visão (não são páginas), mas foi exigido pelo item. Mantido como pedido.

## 2. Lacunas

**2.1 Grade de status "filas, SLA, equipes" (L31)**
- Não há indicador de filas. SLA e equipes estão implementados como indicadores.
- Motivo: uma fila tem melhora quando diminui, e a regra de cor de L233 (variação negativa = erro) mostraria vermelho numa melhora. Deixei de fora para não induzir o operador ao erro. Precisa de uma regra de cor por indicador, que a especificação não define.

**2.2 Navegação**
- L111: nenhum header ou sidebar foi escolhido no Navigation Showcase.
- Decisão: cabeçalho simples com título, abas e ações. Sem sidebar. Dropdowns: só existe o `<select>` nativo de status, que já funciona com teclado (L114).

**2.3 Logo e marca**
- Não há logo na especificação. Usei o nome "Centro Operacional" como texto no cabeçalho (L8).

**2.4 Frequência da atualização em tempo real**
- L51 pede novos alertas em tempo real, sem frequência definida.
- Decisão: um alerta novo a cada 9 s, para demonstração. Incluí o botão "Pausar atualizações" (aria-pressed), exigido pelo WCAG 2.2.2 para conteúdo em movimento, mesmo sem previsão na especificação.

**2.5 Tema escuro**
- Não especificado. Não implementado. `color-scheme: light` em `tokens.css`.

**2.6 Gradientes**
- Os tokens `gradientFrom` e `gradientTo` estão definidos em `:root`, mas não são usados (L419: sem decoração). A única exceção é o fade de indicação de rolagem (L49), que vai da cor de superfície a transparente.

**2.7 Estados de formulário (L423)**
- O único formulário são os filtros da tabela (busca e status). Têm estados: vazio com "Limpar filtros", erro com "Tentar novamente" e carregamento com skeleton. Não há formulário de envio.

**2.8 Atalhos de teclado visíveis (L286)**
- Não há atalhos além das setas ←/→ e Home/End nas abas. Nenhum atalho foi criado.

**2.9 Tabela no celular (L367)**
- A especificação permite rolagem horizontal ou cartões. Escolhi a rolagem horizontal, com a coluna de seleção e a coluna Cliente fixas. Não há indicador visual para conteúdo à direita (só para rolagem vertical).

**2.10 Dados de exemplo (L320–321)**
- Colunas Cliente, Status, Valor e Data, com 4 linhas. Clientes fictícios.
- As datas são fixas e derivadas de 02/11/2026 (data de hoje informada). Não são calculadas com o relógio do navegador.
- Sparklines têm 14 valores fixos, sem eixos nem legenda. L410 (legenda abaixo do gráfico no celular) não se aplica.

**2.11 Nomes visíveis**
- L297 e L373 usam "Indicadores" e "Dados operacionais" como nomes internos dos componentes. Título visível da tabela: "Pedidos recentes" (L319). Aba do celular: "Dados", porque "Dados operacionais" não cabe em 320 px.

**2.12 Modais no celular (L409)**
- O diálogo vira bottom sheet abaixo de 768 px, com altura máxima de 90dvh e rolagem interna.

**2.13 Requisito do cliente: monitores grandes (L61)**
- Atendido pela grade fluida: 4 colunas de indicadores, texto com `clamp()` e coluna de alertas de 304 px. Testado em 1920×1080 e 1536×864, sem rolagem da página.

## 3. Limitações e contraste (deixadas como estão)

**3.1 Borda de controles (L140)**
- A borda `#e6e6e6` tem cerca de 1,2:1 sobre branco, abaixo dos 3:1 exigidos pelo WCAG 1.4.11 para limites de componentes. Os campos usam `borderStrong` (`#c7c7c7`, cerca de 1,7:1), que também fica abaixo de 3:1. Os campos têm rótulo visível. A paleta não tem um token de borda com 3:1: recomendo acrescentar um.

**3.2 Placeholder (L139)**
- `#8c8c8d` tem cerca de 3,4:1 sobre branco, abaixo de 4,5:1. Usado só no campo de busca, que já tem rótulo visível.

**3.3 Fonte Inter**
- Carregada do Google Fonts. Sem internet, cai para a fonte do sistema e o layout continua correto.

**3.4 Não verificado**
- Teclado virtual aberto (L390), zoom de 200% com fonte ampliada do sistema (L57), dispositivos reais, Safari e Firefox. Testei apenas Chromium em modo headless, com resoluções de 320 a 1920 px e alturas de 375 a 1080 px, incluindo os limites de 560 e 640 px.
- Safe-area (`env(safe-area-inset-*)`) testada só com valor zero, que é o que o navegador de desktop reporta.

**3.5 Overflow da tela One Screen**
- L29 pede `overflow: hidden` no body. Usei apenas no shell do modo One Screen. Nenhum conteúdo fica escondido: as áreas com conteúdo variável rolam dentro do próprio bloco (L49–50).
