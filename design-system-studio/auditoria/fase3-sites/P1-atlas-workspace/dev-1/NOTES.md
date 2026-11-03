# NOTES: ambiguidades, lacunas e contradições do PROMPT.md

Regra usada nos casos não resolvidos pela especificação, que ela mesma define: *"quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração"*.
Quando dois trechos se contradizem, prevalece o módulo mais específico para aquela região da tela (layout desktop/mobile > componente de navegação genérico) e as regras gerais de "Regras de implementação" (G) e "Responsividade" (F).

---

## 1. Arquitetura, rotas e sessão

**1.1 Rota `/cadastro` em um site que precisa abrir via `file://`.**
> "Página própria (rota /cadastro) com a mesma composição visual do login."

Caminhos reais (`/cadastro`) não funcionam aberto do disco, nem num servidor estático sem reescrita. **Decisão:** roteamento por hash. As rotas são `#/cadastro`, `#/entrar`, `#/recuperar-senha` e assim por diante. A página continua sendo própria, com URL dedicada.

**1.2 "Apenas login" × "Lembrar de mim".**
> "O endereço abre direto na tela de entrar. Sem página de apresentação." / "'Lembrar de mim'"

**Decisão:** sem sessão, o endereço raiz sempre abre `#/entrar`. Com "Lembrar de mim" marcado, a sessão fica no `localStorage` e a raiz leva direto ao app, que é o propósito da opção. Sem a marcação, a sessão fica no `sessionStorage` e expira ao fechar a aba. Rotas internas acessadas sem sessão redirecionam para o login e voltam à rota pedida depois de entrar (`?next=`).

**1.3 Lacuna: telas internas.** A especificação define o shell e os componentes, mas não o conteúdo de cada destino (Início, Tarefas, Calendário, Pessoas, Mensagens, Relatórios, Configurações, Ajuda).
**Decisão:** cada destino da sidebar ganhou uma tela simples e funcional, montada só com os componentes aprovados (cards, tabelas, formulários, KPIs, dashboard), para a demonstração ser navegável de ponta a ponta. Também foram criadas as telas *Meu perfil* e *Notificações*, porque são alvos de links pedidos explicitamente ("Meu perfil" no menu do avatar, "Ver todas" no popover).

**1.4 Recuperação de senha.**
> "levando ao fluxo de recuperação por e-mail com mensagem neutra" / "autocomplete adequado (… one-time-code)"

**Decisão:** página própria `#/recuperar-senha` em duas etapas: e-mail, depois código + nova senha. A mensagem neutra é "Se o e-mail existir, enviaremos um link". O campo de código usa `autocomplete="one-time-code"`. Na demonstração, qualquer código de 6 dígitos é aceito.

**1.5 Cadastro com e-mail existente × "sem expor se um e-mail já existe".**
> "Se o e-mail já existir, a mensagem é neutra e oferece 'Entrar' ou 'Recuperar senha'." / "proteção contra bots (sem expor se um e-mail já existe)"

**Decisão:** a mensagem é genérica ("Não foi possível concluir o cadastro com este e-mail. Se você já tem uma conta, entre ou recupere sua senha."), com os dois links, e não confirma que o e-mail está cadastrado.

**1.6 Credenciais de demonstração.** A especificação não diz como entrar na demo, e o erro "E-mail ou senha incorretos" precisa ser demonstrável.
**Decisão:** existe uma conta fixa (`marina@atlas.app` / `atlas1234`), informada numa linha discreta abaixo do cartão de login. Contas criadas no cadastro também funcionam. Qualquer outra combinação mostra o erro genérico.

---

## 2. Layout desktop × componente de navegação

**2.1 Largura da sidebar: 252 px × 248 px.**
> Layout: "grid-template-columns: 252px minmax(0, 1fr)" · Sidebar: "Sidebar integral de 248 px"

**Decisão:** **252 px**. Prevalece a grade do shell, que é a estrutura aprovada. O componente se ajusta à coluna.

**2.2 Faixa 1024–1279 px: 220 px × 248 px.**
> Layout: "1024–1279 px: a sidebar reduz para ≈220 px" · Sidebar: "Desktop (≥ 1024 px): … 248 px"

**Decisão:** **220 px** nessa faixa, conforme o layout.

**2.3 Altura do header: 64 px × 56 px.**
> Layout: "Header de ≈64 px" / "Topo da sidebar com a mesma altura do header (≈64 px)" · Navegação: "Barra principal com 56 px de altura"

**Decisão:** **64 px no desktop/tablet**, alinhado ao topo da sidebar para formar a linha contínua pedida. **56 px no celular**, valor em que os dois módulos concordam.

**2.4 Header de largura total × header só sobre a coluna principal.**
> Navegação: "largura total da janela (full width)" · Layout: "O header fica somente sobre a coluna principal — não passa por cima da sidebar."

**Decisão:** o header fica **só sobre a coluna principal**, já que a sidebar integral vai do topo à base.

**2.5 Logo no header × logo no topo da sidebar.**
> Navegação: "Logo: símbolo quadrado de 28 px … (marca fictícia 'Tucano' na prévia — substitua pela marca real)" / "Logo seguido da trilha"

No desktop o logo já está no topo da sidebar, alinhado ao header. Repeti-lo seria redundante. **Decisão:** desktop e tablet mostram o logo na sidebar (inclusive no trilho de 72 px). No celular o logo aparece na topbar. A marca "Tucano" foi substituída por **Atlas Workspace**, com um símbolo quadrado de 28 px na cor `primary`.

**2.6 "Navegação principal com 3 itens (Projetos, Equipe, Ajustes)" × composição escolhida.**
> "Navegação principal com 3 itens (Projetos, Equipe, Ajustes)" × "composicao: Trilha na barra principal: Logo seguido da trilha … Notificações e avatar à direita."

A composição aprovada não inclui esses 3 links, e os mesmos destinos já estão na sidebar. **Decisão:** sem os 3 links no header. O header tem a trilha, a busca, as notificações e o avatar.

**2.7 Busca no header.**
> Layout: "busca, notificações e avatar à direita" · Composição: "Notificações e avatar à direita"

**Decisão:** a busca entra (layout e composição A falam em "busca e ações empurradas para a direita"). É um combobox acessível que busca páginas, projetos, pessoas e tarefas sem diferenciar maiúsculas e acentos, e mostra "Nada encontrado". O comportamento de busca descrito para a sidebar pertence à composição B, que não foi a escolhida. Ele foi aplicado a essa busca do header e à página *Mais* do celular.

**2.8 Trilha "Projetos / Site institucional / Página inicial".**
**Decisão:** a trilha é dinâmica e reflete a rota atual. O texto exato da especificação aparece em `#/projetos/site-institucional/pagina-inicial`. Cada nível anterior é clicável e o último tem peso 600 e `aria-current="page"`.

**2.9 Altura e ícone dos itens da sidebar: 40–44 px / 20 px × 36 px / 18 px.**
> Layout: "Itens de navegação com 40–44 px de altura, ícone de 20 px" · Sidebar: "ícones de linha de 18 px … itens de 36 px de altura"

**Decisão:** **40 px e ícone de 20 px**. Atende ao layout e fica dentro da faixa "ícones: 18–20 px" do próprio componente.

**2.10 Item ativo: "indicador lateral" × "pílula".**
> Layout: "fundo de seleção, cor de texto ativa e indicador lateral" · Sidebar: "fundo navActive e texto navActiveText em cantos radiusMd"

**Decisão:** os dois combinados. Pílula `navActive` com raio de 8 px e uma barra de 3 px em `primary` encostada na borda esquerda.

**2.11 Título de grupo com 11 px × mínimo de 12 px.**
> Sidebar: "Títulos de grupo: caixa alta de 11 px" · Tipografia: "Nunca use textos menores que 12 px"

**Decisão:** **12 px** (caixa alta, peso 650, 0,08em, `textMuted`).

**2.12 Rodapé da sidebar.**
> Layout: "Rodapé da sidebar com perfil do usuário e atalho de configurações" · Sidebar: "bloco de perfil … menu ⋯ que abre para cima … Meu perfil, Preferências, Sair"

**Decisão:** os dois. Avatar, nome e cargo, botão de Configurações e botão ⋯ com o menu para cima. "Preferências" leva à seção Preferências de Configurações. No trilho, o avatar vira o gatilho do menu, que abre à direita.

**2.13 Accordion de grupos no trilho.**
> "Grupos de navegação podem recolher (accordion) e lembram o estado"

**Decisão:** no modo expandido, os grupos recolhem e o estado fica no `localStorage`. No trilho de 72 px não há títulos visíveis, então todos os ícones aparecem sempre, para nenhum destino ficar inacessível.

**2.14 Sombra da sidebar.**
> "sem sombra flutuante" × (tablet) "expande por cima do conteúdo (overlay com sombra)"

**Decisão:** sem sombra no estado integral. Com sombra só na sobreposição do tablet, que é um elemento flutuante.

**2.15 Sombra do header × "sombra: none".**
> Header: "Após 8 px de rolagem ganha sombra suave" · Geometria: "Sem sombras em superfícies de conteúdo"

**Decisão:** a sombra suave após 8 px foi implementada, porque é pedida explicitamente pelo módulo do header e o header não é superfície de conteúdo.

---

## 3. Tablet e celular

**3.1 Faixa 600–767 px.**
> "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber" × "Abaixo de 768 px vale a arquitetura mobile" / "A partir de 768 px passa a valer a arquitetura desktop"

**Decisão:** corte único em **768 px**. Abaixo disso, arquitetura mobile. A partir disso, desktop (com trilho até 1023 px).

**3.2 Drawer, ☰ e painel de menu no celular × bottom navigation.**
> Sidebar: "Abaixo de 768 px: … vira um drawer à esquerda … aberto por um botão ☰" · Header: "Abaixo de 768 px: barra única de 56 px com logo, avatar, botão de menu ☰" × Layout desktop: "não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria" · Regras: "Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria)" · Mobile: "lateral: none · sobreposicao: none"

**Decisão:** no celular **não há drawer nem ☰**. Vale só a arquitetura mobile aprovada: topbar e Bottom Navigation.

**3.3 Quais são os 4 destinos da bottom navigation (lacuna) × "mesmos destinos nas duas versões".**
> "Bottom Navigation fixa … com 4 itens" × sidebar com 10 destinos · "As regiões … mantêm … os mesmos destinos de navegação nas duas versões."

**Decisão:** **Início, Painel, Projetos e Mais**. "Mais" é um destino (uma página, não uma sobreposição) que lista os outros destinos com os mesmos grupos da sidebar, mais busca, notificações, perfil e Sair. Assim os 10 destinos continuam acessíveis no celular sem drawer. Todos os rótulos têm até 10 caracteres.

**3.4 Topbar: "uma ação à direita" × "logo, avatar, ☰".**
> Mobile: "Topbar de ≈56 px com título da tela e uma ação à direita." · Header: "barra única de 56 px com logo, avatar, botão de menu ☰"

**Decisão:** logo, título da tela e **avatar** como ação única. Notificações no celular ficam no menu do avatar ("Notificações (3 não lidas)") e na página Mais. O avatar mostra um ponto quando há não lidas, e o número completo vai no `aria-label`.

**3.5 Trilha no celular.**
> "No celular os breadcrumbs viram um único link '‹ Site institucional' para o nível anterior." · "breadcrumbs (na barra ou numa faixa própria)"

**Decisão:** o link "‹ Nível anterior" fica numa faixa própria logo abaixo da topbar, que continua com o título da tela.

**3.6 Header no tablet.**
> "De 768 a 1023 px: a navegação recolhe para o botão ☰; continuam visíveis o logo e a ação principal."

**Decisão:** o botão ☰ fica no topo do trilho, logo abaixo do logo, e abre a sidebar completa em sobreposição (scrim, Esc, clique fora, foco preso e foco devolvido). Não foi duplicado no header.

**3.7 "Ação principal" (lacuna).** O header cita "a ação principal", mas não a define.
**Decisão:** as ações principais ficam no cabeçalho de cada página (por exemplo, "Novo projeto", "Convidar pessoa", "Exportar CSV"), visíveis em todas as larguras.

**3.8 Celular na horizontal: barra de ≈48 px × limite de 25%.**
> "a barra inferior reduz para ≈48 px com rótulos ao lado dos ícones; barras fixas somadas nunca passam de 25% da altura."

Com 360 px de altura, 56 + 48 px passa de 25%. **Decisão:** na horizontal, topbar de 44 px e bottom nav de 44 px, com ícone e rótulo lado a lado. Os alvos continuam com ≥ 44 px e as duas barras somam cerca de 25% da altura. A topbar também se esconde ao rolar para baixo, como recomendado.

**3.9 Esconder a topbar ao rolar.**
> "recomendado esconder ao rolar para baixo e reaparecer ao rolar para cima"

**Decisão:** implementado no celular (instantâneo com `prefers-reduced-motion`).

**3.10 Tocar no destino ativo × pilha por destino.**
> "Tocar no destino ativo rola a tela daquele destino para o topo." / "Cada destino preserva a própria posição de rolagem e pilha de navegação."

**Decisão:** se a tela estiver rolada, o toque no destino ativo leva ao topo. Se já estiver no topo, um novo toque volta à raiz do destino (por exemplo, de *Pessoas* para *Mais*). Trocar de destino restaura a última rota e a rolagem daquele destino.

---

## 4. Identidade visual × família Swiss Minimal

**4.1 Duas geometrias no mesmo produto.**
> Geometria global: "Cantos médios (8 px) … superfícies contornada" · Componentes: "Raio 0 em tudo. Bordas de 1 px na cor do texto (tinta)" · Login: "Cores, fontes, cantos e superfícies vêm da identidade global do projeto"

**Decisão:**
- **Identidade global** (raio de 8/12 px, borda `border`): login, cadastro, recuperação, sidebar, header, bottom nav e elementos flutuantes (popovers, menus, bottom sheets, modais, toasts, tooltips).
- **Swiss Minimal** (raio 0, linhas de 1 px em tinta, caixa alta com 0,08em, títulos 760): tudo que está na área de conteúdo (cards, tabelas, formulários do app, KPIs, dashboard, listas).
- O avatar do header é circular, como pede o módulo do header. Dentro do conteúdo Swiss, os avatares são quadrados.

**4.2 Pesos e tamanhos tipográficos: 650 × 750 × 760; base 15 × 14.**
> Tipografia: "Títulos em Inter (peso 650) … tamanho base 15 px" · Swiss: "Títulos pesados (750)" e "Fonte de títulos: Inter 760" · "Tamanho base: 14 px"

**Decisão:** shell e telas de autenticação usam títulos 650 e base 15 px. O conteúdo Swiss usa títulos 760 (valor das propriedades, mais específico que o texto descritivo "750") e base 14 px. Inputs ficam com 15 px (16 px no celular).

**4.3 Botões Swiss em caixa alta × "botões com pelo menos 14 px".**
**Decisão:** 14 px, caixa alta, peso 600 e espaçamento de 0,08em.

**4.4 `primaryHover` praticamente igual a `primary`.** Os valores #18181b → #161618 → #131316 são quase indistinguíveis.
**Decisão:** os tokens aprovados não foram alterados ("Não modifique escolhas aprovadas"). Para o hover dos cards ficar perceptível, ele também sublinha o título. Botões secundários Swiss invertem no hover, como especificado.

**4.5 Contraste dos textos semânticos sobre fundos semânticos.** `error` sobre `errorBg` tem ≈ 4,0:1 e `warning` sobre `warningBg` ≈ 4,4:1, abaixo do AA (4,5:1) exigido em "contraste WCAG AA".
**Decisão:** caixas de mensagem usam o fundo semântico com texto `text`, e a cor semântica fica na borda esquerda e no ícone. Badges usam texto em tinta com um pequeno marcador quadrado colorido, o que também atende "Cor de destaque usada só em pequenos marcadores quadrados". Mensagens de erro sob campos usam `error` sobre branco (4,8:1).

**4.6 Gradiente na paleta × "sem gradientes".** Os tokens `gradientFrom`/`gradientTo` existem, mas a família Swiss proíbe gradientes.
**Decisão:** os tokens estão declarados em `tokens.css`, mas não são usados.

---

## 5. Componentes

**5.1 Card: "Botão: Ver detalhes" × "cartão inteiro clicável sem aninhar botões".**
**Decisão:** o título é o link, com área estendida a todo o cartão. "Ver detalhes" tem a aparência da ação primária, mas é decorativo (`aria-hidden`), para não aninhar elementos interativos. O foco visível aparece no contorno do cartão inteiro.

**5.2 Card: "texto (até 3 linhas)" × "Nenhum texto cortado".**
**Decisão:** a descrição do card é limitada a 3 linhas, como pede o componente, e o texto completo está no detalhe do projeto. Fora disso, nada é truncado. No calendário, os nomes dos eventos quebram linha em vez de usar reticências.

**5.3 Card: mídia sem imagem fornecida.**
> "Mostrar imagem/ilustração: sim" · "Ícone: Avião (lucide: Plane)"

**Decisão:** a mídia em 16/9 é um bloco `surfaceAlt` com o ícone de contorno do projeto e a numeração "01, 02…" (composição Swiss com numeração). Nenhuma imagem externa.

**5.4 Conteúdo de exemplo dos componentes.** O card ("Viagem a Lisboa"), a tabela ("Pedidos recentes"), o formulário ("Fale com a gente") e o KPI ("Receita mensal R$ 48,2 mil, +12,4%") são exemplos genéricos.
**Decisão:** foram mantidos com os textos exatos e encaixados no produto. "Viagem a Lisboa" é um dos 12 projetos (o número bate com "Projetos (12)"). "Pedidos recentes" é a seção 04 do Painel, com as 4 linhas pedidas. "Fale com a gente" está em Ajuda. O KPI de receita é o primeiro do Painel no período de 30 dias.

**5.5 KPIs: "Quantidade de KPIs: 3" × "Grade de KPIs: 4 → 2 → 1".**
**Decisão:** o Painel tem 3 KPIs (3 → 2 → 1 colunas). A página Relatórios usa 4 indicadores (4 → 2 → 1). Nenhum cartão fica abaixo de cerca de 280 px.

**5.6 Tabela: estilo de cabeçalho "Destacado" (não definido).**
**Decisão:** fundo `surfaceAlt`, rótulos em caixa alta 12 px/650 e régua inferior de 1 px em tinta.

**5.7 Tabela no celular.**
> "rolagem horizontal local … ou representação em cartões"

**Decisão:** abaixo de 600 px de largura do contêiner, cada linha vira um cartão "rótulo: valor". Como o cabeçalho some, uma barra própria oferece "Selecionar todos" e "Ordenar por".

**5.8 Como demonstrar carregando, vazio e erro (lacuna).**
**Decisão:** a tabela "Pedidos recentes" tem um seletor rotulado *Simular estado (demonstração)*. Nas demais listas o estado pode ser forçado pela URL (`?estado=carregando|vazio|erro`). Busca sem resultado e filtros vazios mostram o estado vazio naturalmente.

**5.9 "Clique [no KPI] abre o relatório detalhado" (destino não definido).**
**Decisão:** cada KPI leva a `#/relatorios/<id>`, com resumo, gráfico de 12 meses e tabela de dados.

**5.10 Gráfico: legenda de uma série.**
> "legendas (abaixo do gráfico no celular)"

**Decisão:** há uma só série (receita), então a legenda é uma linha abaixo do gráfico em todas as larguras ("■ Receita (R$)" e uma dica de interação). O gráfico tem tooltip por mouse e toque, navegação pelas setas com anúncio em região viva e a alternativa "Ver tabela".

**5.11 Formulários Swiss: "Enter avança/envia".**
**Decisão:** nos formulários de Ajuda e Configurações, Enter num campo leva ao próximo, e no último envia. No compositor de mensagens, Enter envia e Shift+Enter quebra a linha.

**5.12 Validação ao sair do campo × clique em "Enviar".** A mensagem que aparece no blur pode empurrar o botão entre o *mousedown* e o *mouseup* e perder o clique.
**Decisão:** quando o foco sai de um campo direto para o botão de envio, a validação do blur é adiada. O envio valida tudo de uma vez e mostra o resumo com links para os campos.

**5.13 Ações destrutivas (lacuna).**
**Decisão:** excluir tarefa, pedido ou pessoa e concluir tarefa mostram um toast com "Desfazer", em vez de um diálogo de confirmação. É a opção mais simples que evita perda acidental.

---

## 6. Outras decisões técnicas

- **Fonte Inter:** carregada do Google Fonts (o pedido é só "HTML + CSS + JavaScript", sem build). Sem internet, entra a fonte do sistema. Nada quebra.
- **Data da demonstração:** os dados fictícios usam 02/11/2026 como "hoje" (data da especificação), para o calendário, os prazos e as séries do painel ficarem coerentes. A saudação ("Bom dia/Boa tarde/Boa noite") usa o relógio real.
- **Persistência:** sessão, contas criadas, menu recolhido, grupos da sidebar e preferências ficam no `localStorage`/`sessionStorage`, com todo acesso em try/catch. As alterações de conteúdo (tarefas, projetos, mensagens) ficam em memória e voltam ao original ao recarregar.
- **Segurança:** é só demonstração. As senhas das contas criadas são guardadas com um hash não criptográfico (apenas para não ficarem em texto puro). As recomendações de backend do PROMPT (Argon2id/bcrypt, rate limit, cookies httpOnly, CSRF, HTTPS) estão no README.
- **Foco e leitores de tela:** a cada troca de rota, o foco vai para o `<h1>` da página. Os títulos focados programaticamente não exibem contorno, porque não são interativos. Os elementos interativos sempre mostram o anel de foco de 2 px.
