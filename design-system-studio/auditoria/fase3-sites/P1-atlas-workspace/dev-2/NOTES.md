# NOTES — ambiguidades, lacunas e contradições do PROMPT.md

Cada item cita o trecho do `PROMPT.md` e registra a decisão tomada. Quando a especificação mandava escolher "a opção mais simples e consistente com o restante, sem adicionar decoração" (seção A), segui essa regra.

## 1. Contradições entre módulos

**1.1 Header: 56 px de largura total com logo e navegação vs. header de 64 px só sobre a coluna principal.**
- Header (C): "Barra principal com 56 px de altura, largura total da janela", "Logo: símbolo quadrado de 28 px + nome da marca", "Navegação principal com 3 itens (Projetos, Equipe, Ajustes)".
- Layout desktop (B): "Header de ≈64 px … O header fica somente sobre a coluna principal — não passa por cima da sidebar", e o topo da sidebar "contendo logo e nome do produto".
- **Decisão:** vale o layout (64 px, só sobre a coluna principal, logo na sidebar). Do módulo Header aproveitei o breadcrumb, o sino com contador e popover de 320 px, o menu do avatar, `sticky` com `z-index: 40`, a sombra após 8 px de rolagem, o hover de 120 ms e o foco de 2 px.
- **Decisão:** os 3 links de texto (Projetos, Equipe, Ajustes) **não** aparecem no header, porque duplicariam a sidebar (Projetos, Pessoas e Configurações já estão lá). O mesmo vale para o botão ☰ e o painel de menu do header.

**1.2 Largura da sidebar: 252 px vs. 248 px vs. 220 px.**
- Layout: "252px minmax(0, 1fr)", "1024–1279 px: ≈220 px". Sidebar (C): "248 px", "Desktop (≥ 1024 px): … 248 px".
- **Decisão:** usei os valores do layout, 252 px (≥1280) e 220 px (1024–1279). A largura recolhida é 72 px nos dois módulos.

**1.3 Medidas dos itens da sidebar.**
- Layout: "Itens … 40–44 px de altura, ícone de 20 px". Sidebar: "itens de 36 px", "ícones de 18 px", títulos de grupo de "11 px".
- Tipografia: "Nunca use textos menores que 12 px".
- **Decisão:** itens de 40 px (44 px nos menus móveis), ícones de 20 px (dentro da faixa 18–20) e títulos de grupo de 12 px.

**1.4 Sidebar abaixo de 768 px: drawer ou bottom navigation?**
- Sidebar: "Abaixo de 768 px: sai do fluxo e vira um drawer à esquerda … aberto por um botão ☰". Mas também: "Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria)" e Layout desktop: "Abaixo de 768 px … não converta a navegação desktop em drawer, rail ou bottom navigation".
- **Decisão:** abaixo de 768 px não existe sidebar nem drawer. Vale a arquitetura mobile aprovada: topbar + Bottom Navigation.

**1.5 Header no celular: logo, avatar e ☰ vs. topbar com "título da tela e uma ação à direita".**
- **Decisão:** vale o layout mobile. A topbar de 56 px (+ safe area) mostra o título da tela (ou "‹ Site institucional" quando há nível anterior) e, como única ação, o sino de notificações, que vira bottom sheet. O perfil e o "Sair" ficam na folha "Mais". O link único "‹ Site institucional" do módulo Header foi mantido.

**1.6 Bottom Navigation com "4 destinos" vs. 10 destinos de navegação.**
- Mobile: "4 itens de largura igual". "Relação": "mesmos destinos de navegação nas duas versões".
- **Decisão:** 3 destinos diretos (Painel, Projetos, Tarefas) + **Mais** (também rotulado, ícone de grade), que abre uma folha com Início, Calendário, Pessoas, Mensagens, Relatórios, Configurações, Ajuda, perfil, busca e Sair. A folha fecha com Esc, toque fora e botão ✕ visível, e devolve o foco ao gatilho. Quando a rota atual está dentro do "Mais", o botão fica ativo.

**1.7 Tablet: 600–1023 px "estrutura desktop compactada" vs. quebra em 768 px.**
- Relação: "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber … caso contrário, use a estrutura mobile". Mobile e Layout desktop: "A partir de 768 px passa a valer a arquitetura desktop".
- **Decisão:** a quebra é **768 px**. De 600 a 767 px vale o layout mobile, porque a estrutura desktop compactada não cabe (trilho de 72 px + conteúdo). De 768 a 1023 px, trilho de 72 px com sobreposição.

**1.8 Recolhimento da sidebar: botão do usuário vs. trilho automático.**
- Sidebar: "Botão de recolher alterna entre 248 e 72 px … O estado é lembrado". Layout: "768–1023 px: a sidebar recolhe para um rail … um botão expande em sobreposição".
- **Decisão:** as duas regras convivem. Em ≥1024 px o botão alterna e o estado vai para `localStorage`. Em 768–1023 px o trilho é o padrão e o mesmo botão abre a sobreposição.
- No trilho, o botão de recolher/expandir ocupa o topo no lugar do logo, porque 72 px não comportam os dois com área de toque adequada.

**1.9 Composição da sidebar: "Logo … perfil no rodapé" vs. comportamento de busca.**
- A composição escolhida é "Logo no topo com botão de recolher, grupos … e o bloco de perfil fixo no rodapé" (sem campo de busca). Mas "A busca filtra os itens enquanto a pessoa digita" descreve a composição B.
- **Decisão:** não há busca dentro da sidebar. A busca fica no header, como manda o layout ("busca, notificações e avatar à direita"). Ela filtra páginas, projetos, pessoas e tarefas, ignora maiúsculas e acentos e mostra "Nada encontrado". No celular a busca fica na folha "Mais".
- O rodapé segue o layout: perfil, atalho de configurações (engrenagem) e o menu ⋯ que abre para cima (Meu perfil, Preferências, Sair).

**1.10 Item ativo da sidebar: "pílula" vs. "indicador lateral".**
- Sidebar: "item ativo em pílula … fundo navActive". Layout: "fundo de seleção, cor de texto ativa e indicador lateral".
- **Decisão:** os dois: fundo `navActive` com cantos de 8 px, texto `navActiveText` em peso 650 e uma barra lateral de 3 px, além de `aria-current="page"`.

**1.11 Geometria global (8 px, borda clara) vs. família Swiss Minimal (raio 0, borda na cor do texto).**
- Identidade (D): "Cantos médios (8 px), bordas de 1 px", e "Todos os componentes … herdam estes tokens … Exceções só onde estiverem explicitamente listadas". Componentes (E): "geometria reta (0 px), linhas de 1 px na cor do texto", "Raio dos contêineres: 0 px".
- **Decisão:** os 5 componentes aprovados (Cards, Tabelas, Formulários, KPIs, Dashboard) e as páginas que os usam seguem Swiss Minimal, que é a exceção listada. O restante segue a geometria global de 8 px: login, cadastro, sidebar, header, popovers, menus, diálogos e toasts. Isso aparece como uma troca de linguagem entre o shell (arredondado, bordas `border`) e o conteúdo (reto, linhas em `text`).
- A troca é feita por variáveis CSS (`--c-radius`, `--c-border`, `--ctl-h`) na classe `.swiss` do `<main>`.

**1.12 Tamanho base 15 px vs. 14 px.**
- Tipografia: "tamanho base 15 px". Componentes: "Tamanho base: 14 px".
- **Decisão:** shell e telas de entrada em 15 px, conteúdo dos componentes Swiss em 14 px.

**1.13 Peso dos títulos: 650 / 750 / 760.**
- Tipografia: 650. Componentes: "Títulos pesados (750)" e "Fonte de títulos: Inter 760".
- **Decisão:** 650 no shell e no login; **760** nos componentes Swiss (o valor explícito da propriedade vence o texto genérico).

**1.14 Padding interno de 14 px fora da escala de 4 px.**
- Componentes: "paddingInterno: 14 px". Seção G: "escala de 4 px".
- **Decisão:** 16 px nos cartões e nas células de tabela com 14 px horizontais, que são o que a medida recomendada pede.

**1.15 Sombras.**
- Login: "o cartão perde borda e sombra" no celular, o que sugere sombra no desktop. Geometria: "Sem sombras em superfícies de conteúdo". Header: "Após 8 px de rolagem ganha sombra suave".
- **Decisão:** o cartão do login usa só borda de 1 px, sem sombra. O header ganha a sombra suave pedida (é barra de navegação fixa, regra explícita). Sombra apenas em elementos flutuantes: popovers, menus, diálogos, sidebar sobreposta e toasts. As sombras são derivadas do token `text`.

**1.16 Largura do formulário do login.**
- "Cartão de ≈400 px", "larguraFormulario ≈360–400", "paddingCartao ≈32 px" (400 − 64 = 336).
- **Decisão:** cartão de 400 px no total, com padding de 32 px. O formulário fica com 336 px.

**1.17 Hover dos cards "elevação, borda ou deslocamento" vs. "nenhuma sombra".**
- **Decisão:** sem elevação nem deslocamento. O hover usa o fundo `hover`, o botão vai a `primaryHover` e o texto secundário passa para a cor do texto (para manter o contraste). Nos KPIs o título é sublinhado.

**1.18 Cadastro: e-mail duplicado.**
- "Se o e-mail já existir, a mensagem é neutra e oferece 'Entrar' ou 'Recuperar senha'" vs. Observações: "sem expor se um e-mail já existe".
- **Decisão:** a resposta ao envio é **idêntica** exista ou não a conta: "Verifique seu e-mail … Se esse e-mail já tiver uma conta, você pode entrar ou recuperar a senha", com os botões Entrar, Recuperar senha e "Voltar e revisar os dados". Assim a regra de neutralidade vale sempre. Uma conta nova é gravada no `localStorage` e o e-mail volta preenchido no login.

**1.19 Cadastro: "rota /cadastro".**
- **Decisão:** como a entrega precisa abrir via `file://`, a rota é `#/cadastro` (roteador por hash).

## 2. Lacunas preenchidas

**2.1 Credenciais de demonstração.** Nada define como "entrar" na demonstração e há "Erro de credenciais genérico". Criei a conta `demo@atlas.com` / `Atlas@2026` e acrescentei uma linha discreta sob o cartão do login informando isso. É o único texto fora da estrutura listada do login. Qualquer outro par, ou uma conta criada no cadastro, produz "E-mail ou senha incorretos".

**2.2 Fluxo de entrada.** "O endereço abre direto na tela de entrar." Mesmo com sessão ativa, o endereço sem hash mostra o login. "Lembrar de mim" só guarda o e-mail para preencher o campo; a sessão simulada vive em `sessionStorage`.

**2.3 Requisitos e força da senha.** O texto pede "indicação dos requisitos" e "força (fraca/média/forte) com texto", sem definir as regras.
- Obrigatórios: mínimo de 8 caracteres, maiúsculas e minúsculas, e um número.
- Recomendado: um símbolo.
- Fraca, Média e Forte são calculadas por pontos: comprimento ≥ 8 e ≥ 12, caixa mista, número e símbolo.
- A força aparece como texto + 3 segmentos, e os requisitos têm ícone ✓/○ além da cor.

**2.4 Autocomplete.** O e-mail do login usa `username` (o texto aceita `username` ou `email`). `one-time-code` está listado na seção de cadastro, mas não há etapa de código na demonstração, então não foi usado.

**2.5 Conteúdo de domínio misturado.** Os exemplos dos componentes são de agência de viagens ("Viagem a Lisboa", "Pedidos recentes", "Receita mensal") e o nome do produto é um workspace de projetos. Mantive o conteúdo literal dos componentes e completei os demais dados num mesmo universo de agência de viagens (pacotes, projetos de site/app/pagamentos, pedidos, equipe), para que a demonstração faça sentido.

**2.6 Mídia do card.** "Mostrar imagem/ilustração: sim" sem imagem fornecida. Usei um bloco 16/9 em `surfaceAlt` com o ícone lucide do card (Plane), sem inventar ilustrações nem gradientes.

**2.7 KPIs.** Só o primeiro está especificado (Receita mensal, R$ 48,2 mil, +12,4%, vs. mês anterior, Wallet). Os outros dois são inventados: "Novos clientes" (variação negativa, para mostrar a cor de erro) e "Ticket médio" (0,0%, neutra). A variação sempre traz seta, sinal e texto para leitor de tela, nunca só a cor. Com 3 KPIs, a regra "4 → 2 → 1" virou 3 → 2 → 1.

**2.8 Dashboard.**
- O período não define opções: usei 30 dias, 90 dias e 12 meses. Trocar o período atualiza KPIs, gráfico e atividades, com esqueleto por bloco, escalonado.
- O botão "Atualizar" repete a carga.
- "gráfico (2/3) + atividades (1/3)": a divisão em colunas ocorre por container query (largura útil do conteúdo ≥ 960 px), não pela largura da janela, porque a sidebar muda a área disponível. Abaixo disso empilham.
- Gráfico de barras de série única, em cor de texto, com marcador quadrado de destaque (accent) no valor ativo, tooltip, navegação por setas, tabela oculta para leitores de tela e legenda abaixo no celular.

**2.9 Formulário "Fale com a gente".** Só há título, descrição, botão, duas colunas e termos. Os campos (Nome, Sobrenome, E-mail, Assunto, Mensagem) são inventados. Ele fica na página Ajuda. O erro de envio só é simulado quando o navegador está offline (mantendo o que foi digitado). Em condições normais o envio sempre dá certo e o formulário é limpo.

**2.10 Páginas sem especificação.** Nenhuma tela além do dashboard foi descrita, mas a navegação tem 10 destinos. Todos funcionam, reaproveitando os componentes aprovados:
- Início → cards.
- Projetos → cards, detalhe e página do projeto (para formar a trilha de 3 níveis).
- Tarefas, Pessoas e Relatórios → tabela.
- Mensagens → lista.
- Configurações e Ajuda → formulários.
- Calendário → apenas **agenda em lista**. A grade mensal exigiria um componente não aprovado, e a regra "no celular, ofereça modo de lista/agenda" fica atendida em todas as larguras.

**2.11 Tabela.**
- "Estilo do cabeçalho: Destacado" é ambíguo. Usei fundo `surfaceAlt`, caixa alta em peso 700 e réguas de 1 px na cor do texto.
- "Linhas de exemplo: 4" vale para "Pedidos recentes". As outras tabelas têm mais linhas.
- No celular escolhi a rolagem horizontal local, com a coluna de seleção e a primeira coluna fixas (a especificação permite cartões ou rolagem).
- Ações por linha: menu com "Ver detalhes" e "Excluir" (a exclusão é só visual, sem persistência).
- Extras: "Exportar CSV" gera um arquivo de verdade e há exclusão em lote.

**2.12 Seletor "Estado da demonstração".** A seção G exige estados de carregando, vazio e erro para listas, tabelas e formulários, mas não diz como mostrá-los. Acrescentei um seletor discreto (Dados, Carregando, Vazio, Erro) acima de cada lista, para o avaliador ver os estados. Na tela de erro, "Tentar novamente" recarrega.

**2.13 Notificações.** "link 'Ver todas'" sem página de destino: leva a Mensagens. O sino mostra 4 não lidas e a sidebar mostra "Mensagens (3)", que são contagens distintas. Clicar numa notificação marca como lida e atualiza o contador.

**2.14 Sidebar: badges.** "Projetos (12)" e "Mensagens (3)" refletem os dados reais (12 projetos; 3 mensagens não lidas, e o número cai ao ler). No trilho viram um ponto.

**2.15 Destino inicial após o login.** Não é especificado. Escolhi **Painel** (peça central da especificação). "Início" continua sendo o primeiro item da sidebar.

**2.16 "Cada destino preserva a própria posição de rolagem e pilha de navegação"** (mobile). Implementado em memória, na sessão da página: a última rota de cada destino e a posição de rolagem. Tocar no destino ativo rola ao topo, e, se estiver numa subpágina, volta à raiz do destino. Não persiste após recarregar.

**2.17 Topbar que esconde ao rolar.** É "recomendado" no módulo Header: implementado (120 ms, respeita `prefers-reduced-motion`). Em paisagem (< 500 px de altura), a topbar cai para 44 px e a barra inferior para ≈48 px (≈25% em 375 px). Abaixo de 368 px de altura a topbar deixa de ser fixa, para que as barras fixas nunca passem de 25% da altura.

**2.18 Cores sem token.** Modo escuro não é pedido e não foi feito. Os tokens de gradiente existem em `tokens.css`, mas ficam sem uso, porque a seção G proíbe gradientes.

## 3. Conflitos com acessibilidade (contraste WCAG AA)

A seção G pede "contraste WCAG AA", mas alguns pares de tokens não chegam a 4,5:1 (medidos em `tests/contrast.js`):

| Par | Razão | Tratamento |
| --- | --- | --- |
| `placeholder` #8c8c8d sobre branco | 3,36:1 | Mantido, pois é o token aprovado. Todo campo tem label visível e o placeholder é só exemplo. |
| `error` sobre `errorBg` | ≈ 4,0:1 | Texto de mensagens e resumos usa a cor `text`. O erro aparece em borda, ícone e fio do campo. |
| `warning` sobre `warningBg` | ≈ 4,4:1 | Os badges usam texto na cor `text`, com borda e marcador na cor semântica. |
| `textMuted` sobre `hover` | 4,49:1 | Nas superfícies em hover o texto secundário assume a cor do texto. |
| `error` sobre `hover` | 4,39:1 | A variação negativa não fica sobre fundo `hover`. |

Também: `primaryHover` (#161618) e `primaryActive` (#131316) são quase idênticos a `primary` (#18181b). O hover do botão principal é quase imperceptível por definição da paleta; segui os tokens sem inventar outra cor. `focusRing` é igual a `text`, então o anel de 2 px usa `outline-offset: 2px` para continuar visível sobre botões escuros.

## 4. Limitações do ambiente

- **Fonte Inter:** não consegui baixar o arquivo (a rede estava bloqueada), então não vai embutida. O CSS usa a Inter instalada e cai em `system-ui`. Instruções para embutir estão em `css/tokens.css` e no README.
- **Ícones lucide:** pelo mesmo motivo, os traços foram redesenhados à mão em `js/icons.js`, no mesmo estilo (24×24, contorno, traço 1.5). São semelhantes, mas não são os arquivos oficiais.
- **Favicon:** `assets/favicon.svg` é um arquivo isolado e por isso traz as cores `#18181b` e `#ffffff` fixas (não consegue ler os tokens do CSS).
- **Teclado virtual:** verificado apenas por emulação no Chromium (viewport reduzido, `100dvh`, `scroll-margin` e `scrollIntoView` ao focar). Não testei em iOS ou Android reais.
- **Zoom de 200%:** coberto indiretamente pelo teste de overflow em 320 px (equivale a 640 px a 200%). Não houve teste com fonte ampliada do sistema.

## 5. Verificação feita

Em Chromium (Playwright), abrindo por `file://`:
- Overflow horizontal: nenhum em 24 larguras entre 320 e 1920 px (incluindo 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440 e 1920), em 4 rotas públicas e 10 internas.
- Fluxos de login, cadastro e recuperação; toggle de senha; sidebar (recolher, lembrar, tooltips, accordion, sticky); sobreposição de tablet (Esc, scrim, trap de foco); popovers; busca; dashboard; tabela; formulários; folha "Mais"; bottom sheet do sino; paisagem; topbar que esconde; alvos de toque ≥ 44 px; anel de foco.
- Os scripts estão em `tests/`.

Durante os testes corrigi dois problemas reais: (1) a mensagem de erro da validação "ao sair do campo" empurrava o botão de envio no meio do clique e o envio se perdia, então o botão agora valida tudo no envio sem disparar a validação por blur; (2) elementos `sr-only` posicionados de forma absoluta dentro do cabeçalho da tabela ampliavam a área rolável da página no celular.
