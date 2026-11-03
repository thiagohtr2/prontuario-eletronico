# NOTES — ambiguidades, lacunas e contradições do PROMPT.md

Regra usada quando dois trechos se contradizem: (1) a **arquitetura** (seção B: layouts desktop/mobile) define estrutura
e geometria; os módulos de navegação (seção C) definem conteúdo e aparência dentro dessa estrutura; (2) regras globais
explícitas (seções D, F e G) prevalecem sobre detalhes de componente quando há conflito de acessibilidade; (3) no resto,
“a opção mais simples e consistente com o restante, sem adicionar decoração” (cabeçalho do PROMPT).

## 1. Estrutura do shell (sidebar × header)

1. **Header em largura total × sidebar integral.**
   - Header: “Barra principal com 56 px de altura, largura total da janela (full width)”.
   - Layout: “O header fica somente sobre a coluna principal — não passa por cima da sidebar” e seção G: “se a sidebar é integral, ela vai do topo à base”.
   - **Decisão:** a sidebar vai do topo à base e o header ocupa só a coluna principal (geometria aprovada da arquitetura).

2. **Altura do header: 56 × 64 px.**
   - Header: “altura (desktop): 56 px”. Layout: “gridRows: 64px 1fr” e “Topo da sidebar com a mesma altura do header (≈64 px)”.
   - **Decisão:** 64 px no desktop/tablet (a grade do shell é explícita e o topo da sidebar precisa alinhar com o header); 56 px no celular, onde os dois módulos concordam (“Topbar de ≈56 px”, “altura (celular): 56 px”).

3. **Conteúdo do header: dois conjuntos diferentes.**
   - Layout: “título da página ou breadcrumb à esquerda; busca, notificações e avatar à direita”.
   - Header: “Logo + abas encaixadas à esquerda; seletor de período, ‘Exportar’ e avatar à direita” (e a composição A cita “busca e ações empurradas para a direita”).
   - **Decisão:** união dos dois. Direita: busca, período, Exportar, notificações e avatar. Esquerda: as 4 abas quando a página é o **Painel**; nas demais páginas, o breadcrumb (“Gestão / Contratos”), que é o que o layout pede e evita abas sem relação com a página.

4. **Onde fica o logo (três pedidos para o mesmo lugar).**
   - Header: “Logo: símbolo quadrado de 28 px … + nome da marca”. Layout: topo da sidebar “contendo logo e nome do produto”. Sidebar (composição escolhida): “Seletor de unidade da empresa no topo”.
   - **Decisão:** o topo da sidebar é um único botão-seletor de unidade que contém o símbolo de 28 px + “Nexo Capital” + a unidade atual + ▾ (cumpre layout e sidebar ao mesmo tempo). No desktop o header não repete o logo (ficaria duplicado lado a lado); abaixo de 1024 px, quando a sidebar vira trilho/drawer, o logo aparece no header, como o header pede (“continuam visíveis o logo e a ação principal”).

5. **Marca da prévia.** “marca fictícia ‘Seriema’ na prévia — substitua pela marca real” → usei **Nexo Capital** (seção A).

6. **Largura da sidebar: 252 × 264 px; 1024–1279: 220 × 264 px.**
   - Layout: “grid-template-columns: 252px …” e “1024–1279 px: a sidebar reduz para ≈220 px”. Sidebar: “264 px de largura” e “Desktop (≥ 1024 px) … 264 px”.
   - **Decisão:** valores do shell (252 px / 220 px), porque a coluna é definida pela grade do layout. A sidebar expandida em sobreposição no tablet também usa 252 px.

7. **Itens de navegação: 40–44 px × 36 px; ícones 20 × 18 px.**
   - Layout: “Itens de navegação com 40–44 px de altura, ícone de 20 px”. Sidebar: “itens de 36 px de altura”, “ícones: 18–20 px”.
   - **Decisão:** 40 px e ícones de 20 px (atende ao intervalo do layout e ao limite superior da sidebar). No drawer, 48 px (“itens de 48 px” do layout mobile, ≥ 44 px pedidos pela sidebar).

8. **Títulos de grupo com 11 px × “Nunca use textos menores que 12 px”.**
   - **Decisão:** 12 px, mantendo caixa alta, peso 650, espaçamento 0,08em e cor textMuted.

9. **Cores da sidebar: bgAlt × tokens de navegação.**
   - Sidebar: “Superfície: fundo levemente diferente da página (bgAlt)” × Observações: “Cores dos tokens … (navBg, navText, navActive, navActiveText …)”.
   - navText (#caced8) sobre bgAlt (#eff1f3) seria ilegível. **Decisão:** sidebar em bgAlt com textos text/textMuted e item ativo selected/selectedText/primary; os tokens nav* são usados no header (que pede “fundo navBg”).

10. **Item ativo da sidebar.** Layout: “fundo de seleção, cor de texto ativa e indicador lateral”; sidebar: “barra vertical de 3 px na cor primária … e texto em primary”. **Decisão:** os dois juntos (fundo selected + texto primary + barra de 3 px encostada na borda esquerda da sidebar). Hover usa o token hover, como pedido (o contraste com bgAlt é sutil; o ícone também escurece no hover para ficar distinguível).

11. **Grupos recolhíveis.** “Grupos de navegação podem recolher (accordion) e lembram o estado” → implementado com `aria-expanded` e `localStorage`; em Configurações é possível desligar a memória.

12. **Rodapé da sidebar.** Layout: “perfil do usuário e atalho de configurações”; sidebar: “avatar, nome, cargo e menu ⋯ que abre para cima”. **Decisão:** ambos (bloco de perfil com ⋯ + botão de engrenagem). O menu do ⋯ tem exatamente “Meu perfil, Preferências, Sair”; “Preferências” leva à página Configurações.

13. **Dois menus de perfil diferentes.** Header: “Meu perfil”, “Configurações”, “Ajuda” e “Sair”; sidebar: “Meu perfil, Preferências, Sair”. **Decisão:** mantive os dois como especificados.

## 2. Tablet e celular

14. **Faixa 600–767 px.** Seção B: “Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber” × layouts: “Abaixo de 768 px vale a arquitetura mobile” e “A partir de 768 px passa a valer a arquitetura desktop”. **Decisão:** a troca acontece em 768 px (dois módulos explícitos); 600–767 px usa o drawer.

15. **Tablet: dois botões de menu.** Header (768–1023): “a navegação recolhe para o botão ☰”; layout: “um botão expande a sidebar completa em sobreposição”. Dois ☰ com funções diferentes confundiriam. **Decisão:** um único botão ☰ no topo do trilho abre a sidebar completa em sobreposição (scrim, Esc, clique fora, foco preso), e nela as 4 abas aparecem como subitens de “Painel”. O header do tablet mantém logo, busca, período, Exportar, notificações e avatar.

16. **Celular: painel do header × drawer.** Header: “Vão para o painel do menu: os 4 itens … desliza logo abaixo do header em largura total”; layout mobile: drawer pela esquerda; seção F: “Headers: … use a navegação móvel escolhida no layout mobile”. **Decisão:** só o drawer. As 4 abas ficam no drawer como subitens de “Painel”, preservando a hierarquia (“mesmos destinos de navegação nas duas versões”).

17. **Cabeçalho do drawer × composição da sidebar.** Layout mobile: “cabeçalho com avatar, nome e botão Fechar … ‘Sair’ no rodapé”; sidebar: seletor de unidade no topo e perfil no rodapé. **Decisão:** segui o layout mobile (“siga exatamente a arquitetura mobile aprovada”) e coloquei o seletor de unidade como primeiro elemento da lista, para não perder a função no celular.

18. **Topbar do celular.** Header: “barra única de 56 px com logo, avatar, botão de menu ☰”. Por isso busca, notificações, período e Exportar não ficam na topbar; período e Exportar passam para o cabeçalho da página (o dashboard já pede “Cabeçalho da página (título, período, ações)”). Busca e notificações não existem no celular nesta demo.

19. **Foco ao fechar o drawer.** “ao fechar, o foco volta ao gatilho” — implementado para Esc, scrim e ✕. Quando o fechamento é causado por **navegação** (“Tocar em um destino navega e fecha o drawer”), o foco vai para o título da nova página, que é o comportamento esperado por leitores de tela após trocar de página.

20. **Larguras do drawer.** ≈280 px (máx. 85%); 320–359 px: 85%; horizontal: 320 px com rolagem interna — implementado exatamente assim.

21. **Opções “recomendadas”/condicionais não implementadas** (escolhi a opção mais simples):
    - “recomendado esconder ao rolar para baixo e reaparecer ao rolar para cima” → o header continua fixo.
    - “Se o app for usado principalmente no celular, ofereça também uma bottom navigation” → não há indicação disso e o layout mobile diz “inferior: none”.
    - “no celular podem virar bottom sheet” (popovers) → menus continuam como popovers reposicionados; diálogos viram bottom sheet no celular.

## 3. Conteúdo e navegação

22. **Itens de navegação genéricos para um app financeiro.** Sidebar: “Gestão: Painel, Contratos, Fornecedores, Compras | Pessoas: Colaboradores, Folha | Administração: Auditoria, Permissões”; abas: “Visão geral, Aquisição, Retenção, Receita”. Só a marca foi marcada como placeholder, então **mantive os rótulos aprovados** e preenchi cada destino com conteúdo financeiro fictício (as abas são visões do Painel; cada item da sidebar é uma página de tabela).

23. **Páginas sem especificação.** Contratos, Fornecedores, Compras, Colaboradores, Folha, Auditoria, Permissões, Meu perfil, Configurações e Ajuda não têm descrição. **Decisão:** reutilizar o componente de tabela aprovado (Compact Pro) em todas as páginas de dados, e páginas simples de conta. Ações por linha variam conforme o sentido (ex.: Auditoria só tem “Ver detalhes”; Permissões tem “Revogar acesso”).

24. **Pendência de cadastro.** “Escolha um fluxo de cadastro (ou confirme que não haverá cadastro)” e seção B: “Cadastro: nenhum”. **Decisão:** sem cadastro e sem link para ele (opção mais neutra).

## 4. Dashboard, gráfico e tabela

25. **Três seletores de período.** Header: “seletor de período ‘Últimos 30 dias ▾’”; dashboard: “Cabeçalho da página (título, período, ações)”; gráfico: “Cabeçalho (título + filtro de período)”; e “Filtro de período atualiza todos os blocos”. **Decisão:** um único estado de período. O controle fica no header (≥ 768 px) e no cabeçalho da página no celular; o cabeçalho da página mostra o intervalo aplicado e o do gráfico mostra o período destacado — sem um segundo filtro que pudesse divergir.

26. **“Vendas por mês” × “Últimos 30 dias”.** Com 30 dias o gráfico mensal teria uma barra. **Decisão:** o gráfico mostra os 12 últimos meses fechados e destaca com uma faixa (token selected) os meses que caem no período escolhido; ao trocar o período o bloco recarrega. KPIs, atividades e tabela usam exatamente o período.

27. **Quantidade de KPIs: 3 × “KPIs 4 → 2 → 1 colunas”.** **Decisão:** 3 colunas → 2 colunas (o terceiro ocupa a linha inteira) → 1 coluna, respeitando “nenhum cartão encolhe abaixo de ≈280 px — reduza colunas antes” (as colunas são calculadas pela largura do conteúdo com container queries).

28. **Cor da série 2.** Gráfico: “Série 1 na primária, série 2 no destaque”; paleta global: accent #0ea5e9; família: “Destaque: #0c91cd”. #0ea5e9 sobre branco tem contraste < 3:1 (WCAG 1.4.11). **Decisão:** #0c91cd, registrado como token derivado `--accent-strong` (a família “apenas transforma” a paleta).

29. **Anel de foco.** Componentes: “anel de 3 px … a 35%” e, no mesmo bloco, “Foco com anel de 2 px”; global: “anel de 2–3 px na cor focusRing”. Um anel a 35% não atinge 3:1. **Decisão:** anel sólido de 2 px em focusRing em toda a interface; no header escuro (navBg) o anel ganha um halo claro interno para continuar visível.

30. **Pesos de título 650 × 640.** Identidade: “Títulos em Inter (peso 650)”; componentes: “Fonte de títulos: Inter 640”. **Decisão:** 650 nos títulos de página/login e 640 nos títulos internos dos componentes (dois tokens).

31. **Texto base 13 px × “filtros e botões com pelo menos 14 px”.** **Decisão:** células e textos dos componentes em 13 px, rótulos em 12 px, e botões, filtros, abas de status e legenda clicável em 14 px.

32. **“paddingInterno: 11 px” × “Escala de espaçamento em múltiplos de 4 px”.** **Decisão:** 12 px.

33. **Badges de status e contraste AA.** Texto semântico sobre o fundo semântico correspondente (ex.: error #dc2626 sobre #fbe5e5 ≈ 4,0:1) não atinge 4,5:1 em 12 px. **Decisão:** badge com fundo semântico, ponto na cor semântica e texto em `text`.

34. **“Linhas de exemplo: 4”.** **Decisão:** a tabela “Pedidos recentes” (e as tabelas das outras abas do Painel) mostra 4 linhas por página, com paginação sobre todos os registros do período; nas páginas de dados são 10 por página.

35. **“Item ativo marcado por sublinhado de 2 px”** nos componentes Compact Pro → aplicado ao filtro de status ativo da tabela e à coluna ordenada.

36. **“Atalhos de teclado visíveis”** → `/` (busca, com `<kbd>` visível no campo de busca ≥ 1440 px), `R` (atualizar, com `<kbd>` no botão) e `?` (ajuda); a lista está na página Ajuda.

37. **Estados de carregando/vazio/erro** (“Estados de carregando (skeleton), vazio e erro”; seção G) só aparecem naturalmente por instantes numa demo. **Decisão:** cada bloco carrega com skeleton estático (sem animação, por G: “Não adicione … animações”); os estados vazio/erro/carregando podem ser simulados em Configurações → Demonstração ou com `?estado=` na URL; “Tentar novamente” recarrega só aquele bloco.

38. **Período em páginas de cadastro.** Filtrar Fornecedores, Colaboradores ou Permissões por data de cadastro não faz sentido. **Decisão:** nessas páginas o seletor de período fica desabilitado (`aria-disabled`, com explicação); nas páginas de movimentação (Contratos, Compras, Folha, Auditoria) ele filtra os registros.

39. **Exportar** não tem comportamento descrito → gera CSV dos registros exibidos no período (e “Exportar seleção” na barra de ações em lote). Entre 1024 e 1279 px e no tablet o botão fica só com ícone (com `aria-label` e tooltip) para que as abas caibam sem rolagem.

40. **Busca e notificações** não têm conteúdo descrito → a busca encontra páginas, visões do painel e clientes (cliente abre “Pedidos recentes” filtrado); notificações mostram 4 itens fictícios com “Marcar todas como lidas”.

41. **Seletor de unidade: “Criar espaço” × “unidade”.** Comportamento: “abre um menu com os espaços … e ‘Criar espaço’”; composição escolhida: “Seletor de unidade da empresa”. **Decisão:** terminologia única “unidade” (“Criar unidade”), que abre um diálogo com validação.

## 5. Login

42. **Dois botões “principais”.** “botão ‘Entrar com SSO da empresa’ em destaque” × “Botão principal com estado de carregamento (‘Entrando…’)”. **Decisão:** SSO em primária sólida (destaque); “Entrar” do formulário em contorno, mas com o estado “Entrando…” e desabilitado durante o envio. O SSO também mostra “Redirecionando para o provedor…” e entra na demo (SSO real exige SAML/OIDC).

43. **“Validação ao enviar e ao sair do campo”.** Validar ao sair de um campo vazio que o usuário só atravessou (ou ao clicar no SSO) mostraria erros indevidos. **Decisão:** ao sair do campo valida se ele foi alterado ou se já houve tentativa de envio; ao enviar valida tudo. O resumo `role="alert"` é refeito apenas no envio (atualizá-lo no blur deslocava o botão sob o clique).

44. **Credenciais da demo.** Para o erro genérico ser demonstrável é preciso uma credencial válida; exibo-a numa nota discreta no cartão (só na demo).

45. **“Suporte de TI”** não tem destino definido → link `mailto:` para um endereço fictício.

46. **“o cartão ocupa a largura total”** (celular) → o cartão ocupa toda a largura disponível dentro da margem lateral de 16 px usada em todo o app.

## 6. Identidade e decoração

47. **Sombra do header × “Sem sombras em superfícies de conteúdo”.** O header pede “Após 8 px de rolagem ganha sombra suave” e só flutua sobre o conteúdo quando rolado → aplicada só nesse caso. Menus, popovers, drawer, sidebar em sobreposição, diálogos e toasts usam elevação (elementos flutuantes, permitidos).

48. **Borda inferior do header.** “borda inferior de 1 px (token border)” → desenhada como sombra interna de 1 px para que a aba ativa “encaixada” (fundo da página + bordas laterais/superior) cubra a linha, como pedido.

49. **Gradiente.** Os tokens gradientFrom/gradientTo foram definidos, mas não usados: nenhum componente aprovado pede gradiente e a seção G proíbe decoração extra.

50. **Dados de referência.** A especificação é de 02/11/2026; os dados fictícios usam essa data fixa como “hoje” para que números e intervalos sejam reproduzíveis.
