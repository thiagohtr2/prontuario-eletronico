# NOTES — ambiguidades, lacunas e contradições do PROMPT.md

Cada item cita o trecho da especificação e diz o que decidi. Segui a regra do próprio PROMPT: *"quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração."*

## 1. Arquitetura e breakpoints

**1.1 Celular x desktop entre 600 e 767 px (contradição).**
> "Abaixo de 768 px vale a arquitetura mobile escolhida separadamente no Studio" · "A partir de 768 px passa a valer a arquitetura desktop" × "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (...); caso contrário, use a estrutura mobile."

**Decisão:** o corte fica em **768 px**, porque aparece duas vezes, nas seções de cada layout. Abaixo de 768 px vale o layout mobile e de 768 a 1279 px vale o desktop compactado. A regra "quando couber" é atendida assim: entre 600 e 767 px o desktop compactado não cabe, porque KPIs e blocos ficariam estreitos demais.

**1.2 Faixa de 768 a 1023 px sem regra própria.**
> "1024–1279 px: alertas viram aba alternável com a grade." · "sidebar recolhida em rail ou menus colapsados"

**Decisão:** de 768 a 1279 px os alertas viram a aba **Painel / Alertas** no header. Não existe sidebar neste layout, então a opção "rail" não se aplica.

**1.3 Altura < 640 px no desktop.**
> "o modo One Screen é desativado — o body volta a rolar e os painéis se empilham"

**Decisão:** nesse modo **todos** os painéis ficam visíveis em sequência: conteúdo, depois alertas, depois barra de status. Isso vale também entre 768 e 1279 px: a aba Painel/Alertas some para não esconder informação. Celular na horizontal com 768 px ou mais de largura (ex.: 844×390) cai neste modo pela regra de largura. O rail vertical vale só abaixo de 768 px.

**1.4 Linhas do grid em px × fonte ampliada.**
> "grid-template-rows: 52px minmax(0, 1fr) 32px" · "Zoom do navegador até 200% e fonte ampliada do sistema: nenhum conteúdo some"

**Decisão:** usei `minmax(3.25rem, auto) minmax(0, 1fr) minmax(2rem, auto)` e a coluna de alertas com `19rem`. Com a fonte padrão isso dá exatamente 52 / 32 / 304 px, e com fonte maior header e rodapé crescem em vez de cortar texto. Os breakpoints estão em `em` (48em = 768 px, 80em = 1280 px, 40em = 640 px, 35em = 560 px), então fonte ampliada leva a menos colunas ou à troca de modo. Se nem os mínimos couberem, a área de conteúdo rola internamente e nada se sobrepõe.

**1.5 Monitores grandes sem detalhamento.**
> "Observação do usuário: Requisito do cliente: adaptação para monitores grandes."

**Decisão:** a estrutura continua a mesma (grade + coluna de alertas + barra de status), só que maior:
- a partir de 1440 px, a coluna de alertas passa a 336 px e os espaçamentos aumentam;
- a partir de 1920×1000, a escala proporcional sobe para 125 %;
- a partir de 2560×1300, sobe para 150 %;
- a partir de 3840×2000, sobe para 225 %.

O objetivo é a leitura à distância, típica de centro operacional, ocupando a área útil. Como só existem 4 linhas de pedidos (ver 3.3), ainda sobra algum espaço livre em telas muito altas.

## 2. Navegação

**2.1 Conteúdo das abas do celular não foi definido.**
> "Tela One Screen com abas fixas no topo" · "Cada painel: um destaque principal no topo e uma grade de blocos menores" · "As regiões (...) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões."

**Decisão:** quatro abas, que repetem as seções do desktop: **Indicadores · Operação · Pedidos · Alertas**. O destaque e os blocos de cada uma são:

| Aba | Destaque no topo | Blocos abaixo |
| --- | --- | --- |
| Indicadores | KPI "Receita mensal" | os outros 3 KPIs, em 2 colunas compactas |
| Operação | "Situação geral" | Filas, SLA e Equipes |
| Pedidos | valor total, busca e ações | pedidos em cartões |
| Alertas | resumo por severidade | lista |

Dois detalhes de largura:
- No compactado de 768 a 1279 px só há duas abas (Painel/Alertas), porque a especificação manda apenas os alertas virarem aba.
- Em 320 px as 4 abas não cabem com texto de 14 px. A barra de abas rola horizontalmente dentro dela mesma, com fade na borda, e a aba ativa é trazida para a vista.

**2.2 `aria-current="page"` × abas.**
> "anunciado a leitores de tela (`aria-current="page"`)" × "role="tablist" com aria-selected"

**Decisão:** tela única não tem links de página. As abas usam `role="tab"` com `aria-selected`, que é o padrão correto. O ARIA dos painéis muda conforme o modo: `role="tabpanel"` só quando eles estão de fato em abas.

**2.3 Indicação do item ativo.**
> "cor de navegação ativa" (navegação) × "Item ativo marcado por sublinhado de 2 px" (Compact Pro)

**Decisão:** uso os dois: fundo `navActive` com texto `navActiveText` mais sublinhado de 2 px na cor primária. No rail vertical da horizontal, o sublinhado vira uma barra de 2 px à esquerda.

**2.4 Barra de status no celular.**
> Desktop: "barra de status de ≈32 px com relógio, conexão e última atualização" × Mobile: "inferior: none"

**Decisão:** no celular não há barra inferior. Conexão e última atualização vão para uma linha sob o título da topbar ("Conectado · Atualizado 19:06"). O relógio fica de fora no celular, porque a barra do próprio aparelho já mostra a hora. Em 320 px essa linha quebra em duas e a topbar passa um pouco dos 56 px, o que é preferível a cortar texto.

**2.5 Conteúdo do header não foi especificado.**
> "Headers: (...) o logo e a ação principal continuam visíveis."

**Decisão:** o header tem:
- a marca: ícone `activity` e o nome;
- a ação principal **Atualizar**, botão primário sólido;
- um menu **Simular**, só de demonstração (ver 5.1).

No celular os dois botões viram ícones de 44×44 px, com nome acessível.

## 3. Componentes

**3.1 "Grade de blocos de status (filas, SLA, equipes)" não é um componente aprovado.**
> "Grade central de blocos de status (filas, SLA, equipes) com cores semânticas acompanhadas de ícone e texto." (layout) × "2 componente(s) aprovados" (Indicadores e Dados operacionais)

**Decisão:** o layout exige os blocos, então eles existem. Usei a mesma família visual Compact Pro: 13 px, raio de 6 px, borda de 1 px e números tabulares. Cada linha mostra um badge com cor semântica, ícone e texto: Normal, Atenção ou Crítico. Limiares inventados:

| Bloco | Normal | Atenção | Crítico |
| --- | --- | --- | --- |
| Filas (espera máxima) | até 10 min | até 30 min | mais de 30 min |
| SLA | na meta ou acima | até 5 p.p. abaixo da meta | mais de 5 p.p. abaixo |
| Equipes (fração online) | 85 % ou mais | 60 % ou mais | menos de 60 % |

**3.2 Só um KPI foi configurado, mas a grade é "4 → 2 → 1".**
> "Rótulo: Receita mensal · Valor: R$ 48,2 mil · Variação: +12,4% · Comparativo: vs. mês anterior · Ícone: Carteira (lucide: Wallet) · Tendência: Alta"

**Decisão:** fiz 4 cartões. O primeiro usa exatamente os valores aprovados. Os outros três são fictícios e mostram as três cores de variação pedidas:
- "Pedidos hoje", positiva;
- "Entregas no prazo", negativa;
- "Ticket médio", neutra.

Para "positiva = sucesso", escolhi indicadores em que subir é bom, assim direção e cor coincidem.

**3.3 Quantidade de linhas da tabela.**
> "Linhas de exemplo: 4"

**Decisão:** mantive exatamente 4 pedidos. A tabela tem a altura do conteúdo e rola internamente se faltar espaço.

**3.4 Ações da tabela e por linha não definidas.**
> "Título + ações da tabela" · "Ações por linha: sim" · "Seleção com checkbox: sim"

**Decisão:**
- Ações da tabela: busca por cliente e **Concluir selecionados**. É uma ação em lote, primária sólida, que fica desabilitada (`aria-disabled`) quando nada concluível está selecionado.
- Ações por linha, num menu (⋯): **Ver detalhes** (modal), **Marcar como concluído** e **Cancelar pedido**, este com confirmação.
- A busca também é o jeito natural de ver o estado vazio.

**3.5 Tabela no celular (contradição leve).**
> "rolagem horizontal local (...) com a primeira coluna fixa, **ou** representação em cartões" × "tabelas viram cartões"

**Decisão:** no celular cada linha vira um **cartão** com pares rótulo/valor, o que atende às duas frases. Como cartão não tem cabeçalho, a ordenação passa a um seletor "Ordenar por" e a seleção total a um checkbox "Selecionar todos".

**3.6 "Relatório detalhado" não foi descrito.**
> "Tooltip no sparkline com valores; clique abre o relatório detalhado."

**Decisão:** o clique abre um modal com:
- valor atual e variação;
- mínimo, máximo e média;
- um gráfico maior com eixos;
- uma tabela com os 12 períodos e a variação de cada um.

Os valores nunca são cortados: no celular o gráfico mostra menos rótulos no eixo X, e todos os valores estão na tabela. Pelo teclado, com foco no cartão, `←`/`→` percorrem os pontos do mini gráfico.

**3.7 Atalhos de teclado "visíveis", mas nenhum foi definido.**
> "Hover com fundo de hover; atalhos de teclado visíveis."

**Decisão:** dois atalhos, mostrados com `<kbd>` e declarados em `aria-keyshortcuts`:
- `R` atualiza;
- `/` vai para a busca.

Eles são ignorados enquanto se digita em campos, com modal ou menu aberto e quando há tecla modificadora. Em telas de toque os `<kbd>` ficam ocultos.

## 4. Identidade visual

**4.1 Foco visível (contradição).**
> "anel de 3 px em focusRing a 35%" × "Foco com anel de 2 px" (mesmo bloco) × global "anel de 2–3 px na cor focusRing"

**Decisão:** `outline` de 2 px sólido em `focusRing` com afastamento de 2 px. A versão a 35 % sobre branco teria contraste de cerca de 1,9:1, abaixo dos 3:1 exigidos para indicadores de foco (WCAG AA). As duas outras frases ficam atendidas.

**4.2 Tamanho do texto.**
> Global: "tamanho base 15 px", "filtros e botões com pelo menos 14 px" × Compact Pro: "Texto base 13 px, rótulos 12 px"

**Decisão:**
- Shell (header, alertas, modal): base global.
- Componentes (KPIs, tabela, blocos): 13 px no texto e 12 px nos rótulos.
- Botões, campos e itens de menu: 14 px em todo lugar, e campos com 16 px no celular.
- Exceção consciente: os botões de ordenação nos cabeçalhos da tabela seguem os "rótulos 12 px" do componente, porque são os rótulos das colunas.
- Nada fica abaixo de 12 px.

**4.3 Peso dos títulos.**
> Global "Inter (peso 650)" × Compact Pro "Fonte de títulos: Inter 640"

**Decisão:** 650 nos títulos do shell e 640 nos títulos e valores dos componentes. A Inter é carregada como fonte variável (400–700), então os dois pesos são reais.

**4.4 Raios e padding.**
> Global "Cantos médios (8 px)", raios 6/8/12 × Compact Pro "Raio de 4 px em controles e 6 px em contêineres" · "paddingInterno: 11 px" × "Escala de espaçamento em múltiplos de 4 px"

**Decisões:**
- Raios: componentes usam 4/6 px. Elementos globais usam 6 px (botões do header), 8 px (menus) e 12 px (modal).
- Padding interno: **12 px** em vez de 11 px. É o "16 px − 25 %" do próprio texto do componente e respeita a escala de 4 px; os 11 px aparecem como "medida recomendada (adaptável)".

**4.5 Contraste das cores semânticas.**
> "Mensagens: success/warning/error/info com os fundos semânticos correspondentes" · "contraste WCAG AA"

**Decisão:** texto semântico sobre o fundo semântico não passa AA em 12–13 px: `error` sobre `errorBg` dá cerca de 4,0:1 e `info` sobre `infoBg` cerca de 4,4:1. Por isso os badges usam:
- o fundo semântico;
- o **ícone** na cor semântica, com contraste de 3:1 ou mais;
- o **texto** na cor `text`.

A informação nunca depende só de cor. As variações de KPI ficam em verde/vermelho sobre branco, com 4,8:1 ou mais.

**4.6 Sombras.**
> "sombra: none" · "Apenas elementos realmente flutuantes (modais, popovers, menus) podem ter elevação."

**Decisão:** nenhuma superfície de conteúdo tem sombra. Têm elevação apenas o modal, os menus e o aviso flutuante "N novos alertas". O indicador de "há mais conteúdo" é um fade por máscara, uma das opções citadas pelo PROMPT.

**4.7 Cor do mini gráfico.** A especificação não define. **Decisão:** `accent` (#2563eb) em todos os cartões. Quem carrega o significado é a variação colorida e com ícone.

**4.8 Tokens de gradiente.** `gradientFrom`/`gradientTo` estão definidos em `tokens.css`, mas não são usados, porque a regra é "não adicione (...) gradientes".

**4.9 "Indicadores" sem título visível no desktop.** Para economizar uma linha da altura útil (com isso, as 4 linhas da tabela cabem em 1366×768), o título "Indicadores" fica visualmente oculto e continua disponível para leitores de tela. Os cartões já se identificam pelo rótulo.

## 5. Estados, dados e tempo real

**5.1 Como demonstrar os estados sem backend.**
> "Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários."

**Decisão:** onde cada estado aparece:
- **Carregamento** (skeleton estático, sem animação extra): na abertura e ao clicar em Atualizar.
- **Vazio**: numa busca sem resultado, ou pelo menu **Simular → Esvaziar dados**.
- **Erro**: pelo menu **Simular → Simular falha de conexão**. A barra de status mostra "Sem conexão", a tabela e os blocos mostram erro com "Tentar novamente", e os alertas mantêm a lista com um aviso no topo.

O menu Simular **não faz parte da especificação**: é um recurso de demonstração e está identificado como tal.

**5.2 Fonte dos dados em "tempo real".** Tudo é fictício e gerado localmente:
- os números de filas, SLA e equipes oscilam a cada 10 s;
- mudanças de nível nesses blocos viram alertas;
- chega um alerta aleatório a cada 25–45 s;
- a simulação pausa com a aba do navegador oculta ou offline.

Datas e horários são relativos ao momento em que a página abre.

**5.3 "Atualização em tempo real sem 'pular' o layout".** Números tabulares e larguras mínimas nos badges evitam tremor. Quando a lista de alertas está rolada e chega um alerta novo:
- a posição de rolagem é compensada, então o que estava sendo lido não se move;
- aparece o botão "N novos alertas", que volta ao topo.

Se a lista de alertas estiver oculta (aba Painel ou outra aba no celular), o alerta é anunciado por uma região `role="status"` à parte, porque uma região `aria-live` oculta não seria lida.

**5.4 Conteúdo variável no celular.**
> "Conteúdo variável rola dentro do próprio bloco"

**Decisão:** dentro de cada aba, o destaque fica fixo e a área de blocos abaixo dele rola, com fade. Os blocos têm a altura do conteúdo e não são espremidos individualmente.

## 6. Itens assumidos sem conflito

- Tecnologia: HTML + CSS + JavaScript sem build, que funcionam também em `file://`. Por isso os scripts são clássicos, e não módulos ES.
- Ícones lucide embutidos como SVG, para funcionar offline, com traço 1.75 e tamanhos de 14–20 px.
- `prefers-reduced-motion`: anula a animação de entrada dos alertas e as transições de 100 ms.
- Safe areas: topbar (topo), laterais e base do conteúdo e do modal no celular. Viewport com `viewport-fit=cover`.
- Na horizontal do celular as barras fixas ficam abaixo de 25 % da altura: topbar de 56 px em 375 px dá cerca de 15 %, e o rail é lateral.
