# NOTES - ambiguidades, lacunas e contradições do PROMPT.md

Cada item cita o trecho do PROMPT.md e a decisão tomada. Quando a especificação se contradiz, a decisão escolhe uma das fontes e a outra fica registrada.

## 1. Contradições de medidas e de composição

**1.1 Altura do header.** "Header de ≈64 px" (seção B, *Sidebar integral*, `gridRows: 64px 1fr`) x "Barra principal com 56 px de altura" (seção C, *Trilha de Contexto*). Decisão: 64 px no desktop, porque a grade da seção B é explícita. A topbar mobile usa 56 px, como pedido na seção B (*Topbar de ≈56 px*).

**1.2 Largura da sidebar.** "≈252 px" (seção B) x "248 px" (seção C, *Sidebar Clássica Integral*). Decisão: 252 px (grade explícita); 248 px não foi usado. Entre 1024 e 1279 px a largura cai para 220 px, como pedido na seção B.

**1.3 Logo e navegação no desktop.** A seção C (*Trilha na barra principal*) coloca logo e três itens de navegação (Projetos, Equipe, Ajustes) no header. A seção C (*Sidebar Clássica Integral*) e a seção B põem logo e navegação na sidebar. Decisão: sidebar com logo e navegação; header com trilha de contexto, busca, sino e avatar. Os três destinos de texto continuam acessíveis pela sidebar.

**1.4 Marca.** A prévia de *Trilha* usa "Tucano" e pede substituição pela marca real. A marca real não foi informada; usei o nome do projeto, "Atlas Workspace", com um símbolo quadrado de 28 px em `primary`.

**1.5 Navegação no celular: drawer x bottom navigation.** A seção E (*Sidebar Clássica Integral*, "Abaixo de 768 px: ... vira um drawer") e a seção E (*Trilha*, "menu ☰ com os 3 itens") pedem drawer. A seção B (*Layout mobile*) e a seção E (*Sidebars*, "siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria)") pedem bottom navigation. Decisão: somente bottom navigation no celular, com 4 destinos (Início, Projetos, Equipe, Ajustes). Não há drawer nem ☰ no celular. O drawer só aparece na faixa de 768 a 1023 px, como sobreposição da sidebar em trilho, que a própria seção E descreve.

**1.6 Ponto de troca entre desktop e celular.** A seção B diz que entre 600 e 1023 px pode-se usar a estrutura desktop compactada "quando couber". A seção F diz "Abaixo de 768 px vale a arquitetura mobile". Decisão: troca em 768 px. Entre 600 e 767 px vale a arquitetura mobile, porque o trilho de 72 px não cabe bem nessa faixa.

**1.7 Sidebar entre 768 e 1023 px.** A seção B diz trilho de 72 px com sobreposição ao toque. A seção E diz "inicia recolhida em trilho de 72 px... expande por cima do conteúdo". Decisão: trilho fixo nessa faixa; o botão ☰ do header abre a sidebar completa em sobreposição, com scrim, Esc, clique fora e retorno de foco.

**1.8 Recolher a sidebar em desktop.** A seção E pede um botão "Recolher menu" (248 ↔ 72 px, lembrado em `localStorage`). A seção B fixa a largura em 252 px. Decisão: em 1024 px ou mais, o botão alterna entre a largura da seção B e o trilho de 72 px, e a escolha é lembrada.

**1.9 Grade com header sticky.** A seção B pede `grid-template-rows: 64px minmax(0,1fr)` na coluna principal. Um header sticky dentro de uma célula de grade não acompanha a rolagem além da própria célula. Decisão: a coluna principal é um bloco que contém o header (sticky, 64 px) e o conteúdo. O resultado visual é o mesmo, com o conteúdo rolando e o header fixo.

**1.10 Nº de itens de navegação.** A seção B diz "itens de 40–44 px de altura"; a seção E (*Sidebar*) diz "itens de 36 px de altura com padding de 12 px". Decisão: 36 px no desktop (a seção E é o componente específico); no celular, a bottom navigation usa alvos de 48 px.

**1.11 Breadcrumb.** A seção C dá o exemplo "Projetos / Site institucional / Página inicial". Não há descrição de como isso varia por tela. Decisão: trilha de dois níveis, "Grupo / Página" (por exemplo, "Geral / Painel"), que combina com os grupos da sidebar.

**1.12 Sombra do header.** A seção C pede "após 8 px de rolagem ganha sombra suave", mas a seção G proíbe sombras além do especificado. Decisão: sombra suave só no header sticky, depois de 8 px de rolagem; é o único elemento fixo com sombra, fora dos cards.

## 2. Contradições de estilo

**2.1 Raio de canto.** A seção E (*Cards*, *Tabelas*, *Formulários*, *KPIs*, *Dashboard*) pede raio 0 px. A seção D (*Geometria*) pede 8 px ("Médios"). Decisão: raio 0 px dentro dos cinco componentes Swiss; 8 px no restante (login, cadastro, sidebar, popovers, campos e botões fora desses componentes).

**2.2 Campos.** A seção E (Swiss) pede campos sublinhados ("apenas linha inferior"). A seção D e as telas de autenticação pedem campos com caixa. Decisão: sublinhados só no formulário Swiss da Ajuda; caixa em todo o restante.

**2.3 Caixa alta.** "Caixa de rótulos e botões: caixa alta, espaçamento 0.08em" vale para os componentes Swiss. Aplicar isso ao botão "Entrar" o transformaria em "ENTRAR". Decisão: caixa alta apenas dentro dos componentes Swiss.

**2.4 Tamanho base.** "Tamanho base: 15 px" (seção D, Tipografia) x "Tamanho base: 14 px" (componentes Swiss). Decisão: 15 px no corpo geral; 14 px nos textos dos componentes Swiss.

**2.5 Gradiente.** Os tokens `gradientFrom` e `gradientTo` existem, mas a seção G proíbe gradientes sem pedido. Decisão: os tokens estão definidos em `:root` e não são usados em nenhuma superfície.

**2.6 Cabeçalho "destacado" da tabela.** "Estilo do cabeçalho: Destacado" não define o visual. Decisão: fundo `primarySoft` e rótulos em caixa alta.

**2.7 Modo escuro.** Não é mencionado. Não foi implementado.

## 3. Lacunas de fluxo e de dados

**3.1 Rotas.** A seção B e a seção C falam em "rota /cadastro" e "o endereço abre direto na tela de entrar". Decisão: roteamento por hash (`#/entrar`, `#/cadastro`), para o protótipo funcionar em `file://` sem regras de servidor. Abrir a página sem hash cai em `#/entrar`. Quem já tem sessão e abre `#/entrar` continua vendo a tela de entrar; a sessão só protege as rotas do app.

**3.2 Credenciais da demonstração.** A especificação não define como o login de demonstração deve aceitar ou recusar. Decisão: `demo@atlas.app` / `demo1234` entram; qualquer outra combinação recebe erro genérico. Os nomes de contas "já cadastradas" para o cadastro são `ana@atlas.app` e `contato@atlas.app`.

**3.3 Autenticação real.** A seção B exige backend seguro (Argon2id/bcrypt, limitação de tentativas, cookie httpOnly/Secure/SameSite, CSRF, HTTPS). Não há backend neste protótipo. Não foi implementado nada disso; a seção B diz que a autenticação real "deve ser implementada pela IA com backend seguro" e fica como pendência.

**3.4 "Lembrar de mim".** A especificação não diz o que a opção faz. Decisão: mantém a sessão de demonstração em `localStorage` (persiste) ou em `sessionStorage` (só nesta aba).

**3.5 Requisitos de senha.** Não estão definidos. Decisão: mínimo de 8 caracteres com letras e números (exibido como texto). O indicador "Fraca / Média / Forte" usa a contagem de critérios atendidos e mostra o texto, não só a cor.

**3.6 Nome completo.** O campo se chama "Nome completo", mas a especificação não diz que deve ter sobrenome. Decisão: exige pelo menos duas palavras ("Informe nome e sobrenome.").

**3.7 Mensagem de e-mail já existente.** A seção E diz "a mensagem é neutra e oferece Entrar ou Recuperar senha". Decisão: um aviso genérico ("Não foi possível criar a conta com estes dados. Se você já tem uma conta, entre ou recupere sua senha.") com os dois botões. Não confirma nem nega que o e-mail existe.

**3.8 Recuperação de senha.** Decisão: formulário com e-mail e a mensagem neutra da seção B ("Se o e-mail existir, enviaremos um link.").

**3.9 Dados do painel.** A seção E (*Dashboard*) fixa 3 KPIs e um gráfico de barras, mas não diz quais indicadores nem quais dados. Decisão: "Receita mensal" (exemplo da seção E, *KPIs*), "Tarefas concluídas" e "Novos clientes" (escolhidos por mim). O filtro de período (7, 30 e 90 dias) atualiza KPIs, gráfico e tooltips; cada bloco tem o próprio estado de carregamento.

**3.10 Gráfico principal.** "Barras" (seção E) sem mais detalhes. Decisão: barras HTML com tooltip no hover e no foco, e tabela oculta equivalente para leitores de tela.

**3.11 Onde fica a tabela "Pedidos recentes".** O componente Tabelas (seção E) dá esse título, mas não diz em qual tela. Decisão: página Relatórios. A especificação pede 4 linhas de exemplo, e foram usadas 4.

**3.12 Destino de "Ver detalhes" nos cards.** A seção E (*Cards*) não diz para onde leva. Decisão: diálogo modal nativo (`<dialog>`) com o resumo do projeto. O link do título também abre o diálogo, e o card inteiro é clicável pelo link estendido.

**3.13 Calendário.** A sidebar lista "Calendário", e a seção F diz que no celular se oferece "modo de lista/agenda" quando a grade mensal ficar apertada. Não há especificação de grade mensal. Decisão: somente lista/agenda, em qualquer largura.

**3.14 Destinos da bottom navigation.** A seção B diz "4 destinos rotulados", sem nomes. Decisão: Início, Projetos, Equipe e Ajustes, que coincidem com os três itens da *Trilha* mais o início. Telas que não têm aba própria (Painel, Tarefas, Calendário, Relatórios, Mensagens, Ajuda) mantêm uma aba ativa do grupo a que pertencem. Tocar na aba ativa rola a página para o topo. Cada destino guarda a posição de rolagem ao sair.

**3.15 Busca do header.** A especificação não diz o que a busca pesquisa. Decisão: busca nas páginas do app (sem diferenciar maiúsculas e acentos). Enter abre o primeiro resultado; sem resultado, aparece "Nada encontrado".

**3.16 Ações sem backend.** "Novo projeto", "Convidar pessoa" e o botão "Exportar" não têm destino na demonstração. Decisão: mostram um aviso ("não está disponível nesta demonstração") em vez de fingir a ação. Nas preferências, os checkboxes não são persistidos.

**3.17 Notificações.** A seção C pede popover de 320 px com "Ver todas". Não há página de notificações. Decisão: "Ver todas" leva a Mensagens.

**3.18 Badges.** A sidebar pede "Projetos (12)" e "Mensagens (3)". Decisão: valores fixos nesses itens; o contador de mensagens diminui conforme as conversas são abertas ou marcadas como lidas.

**3.19 Ícones.** A especificação pede Lucide, com traço de 1,5 px. Não há CDN nem pacote no ambiente. Decisão: caminhos SVG desenhados à mão no estilo Lucide, com `stroke-width` 1,5, inline. Os nomes dos ícones (Plane, Wallet) seguem a especificação.

**3.20 Fonte.** Inter pedida e carregada do Google Fonts (domínio permitido para folha de estilo). Offline, cai para a fonte do sistema.

**3.21 Tela de cadastro com "one-time-code".** A seção B pede autocomplete "one-time-code" e a seção E pede "name, email, new-password". Decisão: "one-time-code" não se aplica a um formulário sem verificação de e-mail, então não foi usado.

## 4. Itens verificados

- Entrar: labels visíveis, `type=email`, `inputmode=email`, `autocomplete` corretos, botão de mostrar e ocultar senha com `aria-pressed`, validação ao sair do campo e no envio, resumo com `role="alert"`, erro genérico, botão com "Entrando…" desabilitado.
- Cadastro: senha e confirmação com botões independentes, "As senhas não coincidem" em tempo real após o primeiro envio, valores mantidos após erros.
- Desktop, tablet e celular: nenhum overflow horizontal de 320 a 1920 px nas telas do app e nas telas de autenticação (checado por `tests/smoke.js`).
- Alvos de toque de 44 px no celular, fontes de campo de 16 px no celular, `100dvh` nas alturas de tela cheia, `scroll-margin` nos campos, `prefers-reduced-motion` respeitado.
