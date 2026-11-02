# P3 — Nexo Capital · Escolhas feitas no Design System Studio

Site auditado: http://127.0.0.1:4300/ (Atelier UI · Design System Studio), modo **Guiado**, navegador limpo (perfil novo em `perfil/`), viewport 1440×900.
Estado final: 12 itens no Master Prompt · 0 retirados · 0 contradições a decidir · **1 decisão pendente** (cadastro; ver observação da linha 1).

## Tabela principal (as 8 características do cliente)

| # | Característica | Opção escolhida no Studio (nome exato + módulo/onde) | Observação (ou LACUNA) |
|---|---|---|---|
| 1 | Login profissional | **Etapa 2 · "Landing, login e cadastro"** → aba "Como as pessoas entram": **"Apenas login"**. Na aba "Login": **"Acesso corporativo"**, com a descrição "Login corporativo com SSO e aviso de segurança" (botão "Selecionar este modelo" na prévia). Também foi adicionada a funcionalidade livre "Login profissional" na Etapa 1. | Configurado. O modelo traz extras que o cliente não pediu: o botão "Entrar com SSO da empresa", o link "Suporte de TI" e o aviso "Acesso monitorado…". Cadastro: **nenhum escolhido**, porque o cliente não pediu cadastro. A Revisão e o Master Prompt continuam a mostrar a pendência "Escolha um fluxo de cadastro (ou confirme que não haverá cadastro)", mas o Studio **não tem nenhum controle para confirmar "sem cadastro"** (ver bug B1). Capturas 02a, 02b, 02c, 16, 16b, 17. |
| 2 | Dashboard financeiro | **Etapa 1 · Objetivo** → tipo de projeto **"Dashboard"** e funcionalidade livre "Dashboard financeiro". **Etapa 9 · Componentes** → categoria **"58 Dashboard"**, família **"13. Compact Pro"**, com o nome no projeto "Dashboard financeiro" (configuração padrão: título "Visão geral", 3 KPIs, gráfico principal em Barras, menu lateral Sim, lista de atividades Sim). | Configurado **parcialmente**. Não existe um tipo, modelo ou componente "financeiro". O lado financeiro só aparece no texto livre (objetivo, descrição, funcionalidades). Alternativas avaliadas: o layout "Painel financeiro com rail" foi descartado porque usa um trilho de ícones e não uma sidebar. O template "Dashboard administrativo" foi descartado porque é um molde de admin/pedidos com paleta própria. A inspiração "ATLAS CAPITAL (Finanças)" foi aprovada e depois removida (ver relatório). Capturas 01, 32-3. |
| 3 | Tabelas de dados | **Etapa 9 · Componentes** → categoria **"37 Tabelas"**, família **"13. Compact Pro"**, com o nome no projeto "Tabelas de dados". Também foi adicionada a funcionalidade livre "Tabelas de dados" na Etapa 1. | Configurado. O título e as colunas são os exemplos padrão do Studio ("Pedidos recentes": Cliente, Status, Valor, Data). Mantive-os porque o cliente não especificou conteúdo. O editor mostra a densidade "Padrão", mas o prompt e o JSON exportam "Densidade: compacta" (bug B10). Capturas 30, 32-1, 33. |
| 4 | Gráficos | **Etapa 1** → chip de funcionalidade **"Gráficos"** (sugestão para dashboard). **Etapa 9 · Componentes** → categoria **"41 Gráficos"**, família **"13. Compact Pro"**, com o nome no projeto "Gráficos" (padrão: tipo Barras, 2 séries, legenda e grade). | Configurado. O título padrão de exemplo, "Vendas por mês", foi mantido. Captura 32-2. |
| 5 | Sidebar | **Etapa 3 · Arquitetura do computador** → família "Sidebar integral": **"Sidebar integral clássica"** ("Escolhido para o seu projeto"). **Etapa 8 · Headers e sidebars** → aba "Sidebars (36)": **"Sóbria Corporativa" · Composição A ("Unidade no topo")**. | Configurado. Os itens do menu da sidebar são exemplos fixos e não editáveis (Gestão: Painel, Contratos, Fornecedores, Compras · Pessoas: Colaboradores, Folha · Administração: Auditoria, Permissões). Eles entram no Master Prompt como especificação (bug B3). Há também uma largura de 264 px na sidebar contra 252 px no layout, sem contradição apontada (B2). Capturas 03, 12, 13, 14, 24. |
| 6 | Header | **Etapa 3** → o layout "Sidebar integral clássica" já inclui a barra superior (≈64 px). **Etapa 8 · Headers e sidebars** → aba "Headers (36)", filtro "SaaS": **"Painel Analítico" · Composição A ("Abas e filtros em uma linha")**. | Configurado. Na aba "Combinação", o Studio avisou "Navegação nos dois lugares". Mantive a escolha: as abas do header ficam como sub-relatórios e a navegação principal fica na sidebar. O header usa a marca fictícia "Seriema" e as abas de exemplo Visão geral/Aquisição/Retenção/Receita, que não são editáveis. O texto do header (56 px, largura total) conflita com o do layout (64 px, só sobre a coluna principal), e o Studio não sinalizou (B2). Capturas 10, 11. |
| 7 | Design corporativo | **Etapa 7 · Identidade visual** → aba "Paletas", categoria **"Corporativas"**: **"Azul Institucional"** (Corporativas · clara, "Azul real confiável com navegação marinho"). Complementos: a sidebar **"Sóbria Corporativa"** e a família de componentes **"Compact Pro"** ("para ferramentas profissionais"). | Configurado por meio da paleta da categoria "Corporativas". Não há família de componentes "corporativa". A tipografia (Inter + Inter, base 15 px) e as formas (Médios 8 px, Contornada, sem sombra, densidade Confortável) ficaram no **padrão do Studio**, sem escolha ativa. A inspiração "ATLAS CAPITAL — Finanças, Corporativo orientado a dados" foi aprovada, gerou uma contradição de cores que resolvi, e depois **removi** (ver relatório). Capturas 09, 25*, 26*, 27. |
| 8 | Responsividade em telas pequenas | **Etapa 4 · Arquitetura do celular** → grupo "Drawers e menus laterais": **"Drawer pela esquerda"** ("Escolhido para o seu projeto"; sugerido pelo Studio). | Configurado. As regras de responsividade são geradas automaticamente (seção F do Master Prompt: larguras de 320 a 1920 px, breakpoints xs–xl, regras por componente). Os breakpoints não são configuráveis à mão. O módulo "Validação responsiva" só testa um site já construído, com um executor local. Capturas 04, 05, 06, 15-*-celular, 15-*-tablet. |

## Outros campos preenchidos

| Campo | Valor | Onde |
|---|---|---|
| Nome do projeto | Nexo Capital | Etapa 1 · Objetivo → "Nome do projeto" |
| Tipo de projeto | Dashboard | Etapa 1 → "O que você pretende construir?" (não usei "Usar esta sugestão") |
| Objetivo | "Plataforma financeira com dashboard financeiro, tabelas de dados e gráficos." | Etapa 1 → "Objetivo" |
| Descrição resumida | "Plataforma financeira "Nexo Capital": login profissional, dashboard financeiro com tabelas de dados e gráficos, navegação com sidebar e header, design corporativo e responsividade em telas pequenas." | Etapa 1 → "Descrição resumida" |
| Público-alvo / Finalidade principal | (em branco: não informados pelo cliente) | Etapa 1 |
| Funcionalidades | Login profissional; Dashboard financeiro; Tabelas de dados; Gráficos | Etapa 1 → "Módulos e funcionalidades previstas" (3 digitadas + chip "Gráficos") |
| Tecnologia desejada | **HTML + CSS + JavaScript** (chip) | Etapa 1 → "Tecnologia desejada (opcional)". Não há campo para a restrição "sem etapa de build"; ela não aparece no Master Prompt (LACUNA da restrição do cenário). |
| Esqueleto | **Aprovado** ("Aprovar esqueleto e continuar") | Etapa 5 · Revisão do esqueleto |
| Contradições | 0 no estado final (1 apontada e resolvida durante o teste da inspiração ATLAS; ver relatório) | Central de Prompts → "Contradições" |

## Lacunas

- Nenhuma das 8 características ficou totalmente sem opção. Lacunas parciais:
  - "Financeiro": não há configuração de domínio. Fica só no texto livre, e os conteúdos de exemplo (menus, abas, tabelas) não são financeiros.
  - Itens de navegação da sidebar e do header: **não configuráveis**.
  - Confirmação de "sem cadastro": **não existe**.
  - Restrição "sem etapa de build": **não existe campo**.
