# Prompt — Inspiração visual: ATLAS CAPITAL

> Gerado pelo Atelier UI para o projeto “Nexo Capital” (Dashboard). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.

## Inspiração visual: ATLAS CAPITAL — Original

`id: atlas-capital` · origem: módulo “inspiracao”

Site institucional de gestora de investimentos que transmite solidez com dados: serifa clássica nos títulos, números tabulares, gráfico de área e rosca no hero, indicadores com sparklines e tabela de rentabilidade; cantos discretos (4–10 px). Usar como referência de identidade e composição — conceito “ATLAS CAPITAL” (finanças), paleta “Original”.

**Estrutura**
- Composição dominante: Corporativo orientado a dados: painel de gráficos, indicadores e tabelas.
- Seções, nesta ordem: 1. Faixa de cotações; 2. Header corporativo; 3. Hero com painel de desempenho (gráfico de área + alocação); 4. Indicadores com minigráficos; 5. Soluções em 4 colunas; 6. Tabela de rentabilidade dos fundos; 7. Research (relatórios); 8. Contato com especialista (formulário); 9. Footer com aviso legal.
- Tipografia: títulos em Georgia (Georgia, 'Times New Roman', serif); textos em Inter ('Inter Variable', Inter, system-ui, sans-serif).
- Cores: fundo #f8f7f3, superfície #ffffff, texto #0e1b2c, texto secundário #5b6676, destaque #12355b com texto #ffffff, apoio #c9a24d.
- Faixa de cotações de 34 px no topo (fundo na cor do texto): rótulo, valor e variação com ▲/▼ em verde/vermelho.
- Header branco: símbolo de globo com meridianos (destaque + apoio), “ATLAS” serifado espaçado e “CAPITAL” em versalete; navegação; “Acessar conta” com cadeado e botão “Abrir conta” (raio 4 px).
- Hero em grade 5/6: sobretítulo com traço na cor de apoio, título serifado de ~64 px, texto, CTAs retangulares e selo de regulação; à direita cartão de painel com nome da carteira, seletor de período (1M/6M/1A/5A), retorno grande em verde, gráfico de área com linha de referência tracejada (CDI), legenda e rosca de alocação com legenda em 2 colunas.
- Indicadores: 4 cartões com rótulo, número grande, sparkline e variação.
- Soluções: título serifado + texto em 2 colunas; 4 colunas sob fio grosso de 2 px, cada uma com ícone, título serifado, texto e link.
- Tabela de fundos: cabeçalho em versalete sobre fio de 2 px, retornos alinhados à direita em verde, barras de risco 1–5 e link “Investir”; aviso legal abaixo.
- Research: 3 cartões (o primeiro maior) com faixa de minigráfico de barras, editoria, título serifado e data/tempo de leitura.
- Contato: bloco da cor de destaque com frase serifada e formulário em cartão claro (nome, e-mail, faixa de patrimônio, botão).
- Footer escuro com 4 colunas de links e aviso legal em corpo pequeno.

**Propriedades**
- conceito: ATLAS CAPITAL
- segmento: Finanças
- composicao: Corporativo orientado a dados: painel de gráficos, indicadores e tabelas
- paleta: Original
- ajustesDeCor: nenhum
- fonteTitulos: Georgia
- fonteTexto: Inter
- secoes: 9
- contrasteTextoFundo: 16.2:1

**Cores**
- fundo: #f8f7f3
- superficie: #ffffff
- texto: #0e1b2c
- textoSecundario: #5b6676
- destaque: #12355b
- textoSobreDestaque: #ffffff
- apoio: #c9a24d

**Medidas recomendadas (adaptáveis)**
- conteúdo máximo: 1280 px
- título do hero: 64 px / 40 px
- raio de botões: 4 px
- raio de cartões: 8–10 px
- altura do gráfico: ≈210 px / 150 px

**Comportamento e estados**
- Gráfico: tooltip ao passar o mouse com data, valor da carteira e do CDI; troca de período anima a linha (300 ms).
- Cotações podem rolar lentamente em loop; pausam no hover.
- Linhas da tabela: hover com fundo sutil; colunas numéricas sempre com números tabulares.
- Sem animações chamativas: a sensação deve ser de precisão e calma.

**Responsividade deste item**
- Faixa de cotações no celular: uma linha com rolagem horizontal própria (sem quebrar a página).
- Header: símbolo + nome e hambúrguer; “Abrir conta” dentro do menu e como CTA no hero.
- Hero: texto e CTAs empilhados; painel abaixo com gráfico mais baixo (≈150 px) e legenda da rosca em 1 coluna.
- Indicadores em 2×2.
- Soluções em lista vertical (ícone à esquerda).
- Tabela de fundos vira lista de cartões (nome, % do CDI, retorno de 12 meses em destaque) — nunca tabela espremida.
- Research e contato empilhados.
- Footer em 2 colunas, aviso legal em largura total.

**Observações**
- Use dados reais e disclaimers exigidos pelo regulador; os números desta página são fictícios.
- Referência de identidade e composição: não copiar marcas, logotipos, textos ou imagens de terceiros — criar conteúdo original para o projeto.
- Adapte a identidade (paleta, tipografia, composição e ritmo) ao conteúdo real do projeto; os textos e a marca do conceito são apenas ilustrativos.

## Identidade herdada
- Paleta “Azul Institucional” (clara): primária #1d4ed8 (texto #ffffff), secundária #1e3a8a, destaque #0ea5e9.
- Fundo #f8fafc, superfície #ffffff, texto #0f172a, texto secundário #686d7a, borda #e6e6e6.
- Estados: hover #f4f4f4, active #ebebeb, selected #e4eafa/#1d4ed8, disabled #f0f0f0/#93979f, foco #1d4ed8.
- Semânticos: success #117e39, warning #a85c04, error #dc2626, info #2563eb.
- Tipografia: títulos Inter 650, textos Inter 400, base 15 px.
- Geometria: cantos “medium”, borda 1 px, sombra “none”, superfícies “outlined”, densidade “comfortable”.

## Responsividade obrigatória
Valide em 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px.
- Nenhum overflow horizontal involuntário em nenhuma largura de 320 px a 1920 px (inclusive larguras intermediárias).
- Nenhum texto cortado: use quebra de linha, `min-width: 0` em itens flex/grid e `overflow-wrap: anywhere` em conteúdos longos (e-mails, URLs, códigos).
- Nenhuma sobreposição indevida entre elementos, inclusive com o teclado virtual aberto.
- Alvos de toque com no mínimo 44 × 44 px no celular e espaçamento de pelo menos 8 px entre alvos adjacentes.
- Campos de formulário com fonte de pelo menos 16 px no celular (evita zoom automático no iOS).
- Imagens e mídias responsivas (`max-width: 100%`, `aspect-ratio` definido) sem distorção.
- Grids adaptáveis: reduza colunas progressivamente; nunca comprima cartões abaixo de uma largura legível.
- Suporte a zoom de até 200% e a fonte ampliada do sistema sem perda de conteúdo ou funcionalidade.
- Respeite as safe areas (`env(safe-area-inset-*)`) em barras fixas, docks e menus inferiores.
- Funcione na orientação horizontal do celular: barras fixas não podem ocupar mais de 25% da altura.
- Use `100dvh` (com fallback) em vez de `100vh` para alturas de tela cheia.
- Menus acessíveis por mouse, toque e teclado (Tab, Enter, Espaço, Esc), com foco visível.
- Respeite `prefers-reduced-motion` reduzindo animações.

## Regras de implementação
- Não modifique escolhas aprovadas nesta especificação sem solicitação explícita do usuário.
- Preserve a identidade global: todos os componentes usam os tokens definidos; exceções só onde estiverem listadas.
- Não adicione decoração por conta própria (sombras, gradientes, vidro, animações, cantos arredondados) além do especificado.
- Respeite a geometria escolhida: se a sidebar é integral, ela vai do topo à base; se é flutuante, tem afastamento das bordas. Não converta uma na outra.
- Evite overflow e colisões; valide em todas as larguras de referência.
- Mantenha consistência de espaçamentos (escala de 4 px), tipografia e estados de interação (hover, focus-visible, active, disabled, selected).
- Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários.
- Use componentes reutilizáveis e tokens centralizados (variáveis CSS ou tema); nada de cores fixas espalhadas pelo código.
- Garanta acessibilidade: HTML semântico, labels, contraste WCAG AA, navegação por teclado e leitores de tela.
- Teste o resultado (visual e funcional) em celular, tablet e desktop antes de concluir.
