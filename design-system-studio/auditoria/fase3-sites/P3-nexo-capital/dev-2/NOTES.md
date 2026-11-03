# NOTES — ambiguidades, lacunas e contradições do PROMPT.md

Para cada ponto: o trecho do `PROMPT.md`, o problema e a decisão tomada. A regra geral usada foi a do próprio documento (“escolha a opção mais simples e consistente com o restante, sem adicionar decoração”) e, em conflito, **o item mais específico vence o genérico**.

## 1. Header × layout desktop (seção C × seção B)

1. **Altura do header.** C: “Barra principal com 56 px de altura”; B: “grid-template-rows: 64px”, “Header de ≈64 px”, e a sidebar deve ter topo “com a mesma altura do header (≈64 px)”. → **64 px no desktop/tablet** (para a linha horizontal contínua com a sidebar) e **56 px no celular** (onde os dois trechos concordam).
2. **Largura do header.** C: “largura total da janela (full width)”; B: “O header fica somente sobre a coluna principal — não passa por cima da sidebar”. → Header só sobre a coluna principal.
3. **Logo no header.** C: “Logo: símbolo quadrado de 28 px … (marca fictícia “Seriema” … substitua pela marca real)”; B: logo e nome ficam no topo da sidebar. → O logo (símbolo quadrado de 28 px na cor primária + “Nexo Capital” em peso 700) fica no topo da sidebar; o header desktop não o repete. No celular o símbolo aparece na topbar. Não foi fornecido logotipo real: o símbolo “N” é um placeholder desenhado em SVG.
4. **Sticky dentro do grid.** B pede `grid-template-rows: 64px minmax(0, 1fr)` na coluna principal e header “sticky”. Um item sticky não sai da própria trilha de grid (64 px), então o header rolaria junto. → Grid externo de 2 colunas (sidebar sticky `100dvh`); a coluna principal é fluxo normal com header `position: sticky; top: 0` (mesmo resultado visual e comportamento pedido).
5. **Superfície do header.** C: “fundo navBg” (azul-marinho #0f1f4d) com borda inferior `border`; já a sidebar diz “fundo … (bgAlt)”. → Cada um literal: header escuro, sidebar clara. O foco sobre fundo escuro usa anel branco (ver item 9).
6. **Ações do header.** C (composição A): “busca e ações empurradas para a direita” mas lista só período, Exportar e avatar; B: “busca, notificações e avatar à direita”. → Direita do header: período, Exportar, busca (ícone que abre painel de busca de páginas), notificações e avatar com menu.
7. **Sombra no header.** C: “Após 8 px de rolagem ganha sombra suave”; D/G: “sombra: none”, “Sem sombras em superfícies de conteúdo”, “não adicione … sombras”. → Sombra só no header (específica, explícita) e em elementos flutuantes (menus, popovers, modal, sidebar sobreposta).

## 2. Navegação: dois conjuntos de destinos

8. **Abas × sidebar.** C: abas “Visão geral, Aquisição, Retenção, Receita”; sidebar: “Painel, Contratos, Fornecedores, Compras | Colaboradores, Folha | Auditoria, Permissões”. São destinos diferentes e o texto exige “mesmos destinos … nas duas versões”. → Modelo hierárquico: a sidebar escolhe o **módulo**; “Painel” tem 4 **visões**, que são as abas do header. Em módulos sem abas, o header mostra o breadcrumb (“Gestão › Contratos”). Abaixo de 1024 px (abas ocultas) as 4 visões aparecem sob “Painel” na sidebar expandida e no drawer, mantendo os mesmos destinos.
9. **Item ativo duplicado.** Sidebar e abas pedem `aria-current="page"`. → Filho (visão) recebe `page`; o pai “Painel” recebe `page` quando os filhos estão ocultos (≥1024 px) e `true` quando os filhos estão visíveis (rail/overlay/drawer), para haver um único “página atual” por contexto.
10. **Mobile: painel do menu × drawer.** C (abaixo de 768): “Painel do menu: desliza logo abaixo do header … Vão para o painel do menu: os 4 itens”; layout mobile: “Drawer pela esquerda”; e F: “siga exatamente a arquitetura mobile aprovada”. → **Drawer pela esquerda** (decisão do Studio), contendo também as 4 visões.
11. **768–1023 px.** C: “a navegação recolhe para o botão ☰”; layout: rail de 72 px + botão que expande a sidebar em sobreposição. → ☰ no header abre a sidebar completa em sobreposição (scrim, Esc, clique fora, foco preso).
12. **Limite 600 × 768 px.** “Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber … caso contrário, use a estrutura mobile” × “Abaixo de 768 px vale a arquitetura mobile”. → **768 px** é o corte (aparece em quatro trechos). De 600 a 767 px vale a arquitetura mobile.
13. **Largura da sidebar.** Layout: 252 px (1280+), 220 px (1024–1279); item de navegação: “264 px … Desktop (≥ 1024 px)”. → 252/220/72 do layout (que também define o grid). A sidebar de navegação define conteúdo e estilo.
14. **Itens da sidebar.** Altura “36 px” (nav) × “40–44 px” (layout); ícone “18 px” × “20 px”; títulos de grupo “caixa alta de 11 px” × tipografia “Nunca use textos menores que 12 px”. → Itens de 40 px, ícones de 20 px (18 px nas visões), títulos de grupo com **12 px**.
15. **Topo da sidebar.** Layout: “logo e nome do produto”; nav (composição A “Unidade no topo”): “seletor de espaço de trabalho (avatar quadrado + nome + ▾)”. Também “unidade da empresa” × “Criar espaço”. → Um só botão: símbolo + “Nexo Capital” + unidade atual (“Matriz · São Paulo”) + ▾, abrindo menu de 3 unidades (atual com ✓) e “Criar espaço” (mostra aviso: fora da demonstração). Trocar de unidade recarrega os blocos do dashboard.
16. **Rodapé da sidebar.** Layout: “perfil … e atalho de configurações”; nav: “avatar, nome, cargo e menu ⋯ que abre para cima” com “Meu perfil, Preferências, Sair”. → Perfil + ícone de configurações + ⋯ (menu para cima). “Cargo” inventado: “Analista financeira”.
17. **Cores da sidebar.** Estrutura: bgAlt, item ativo com “barra vertical de 3 px na cor primária … texto em primary”; Observações: tokens “navBg, navText, navActive, navActiveText”. → Fundo `bgAlt`, ativo com fundo `selected` + texto `selectedText`/primary + barra de 3 px. Os tokens `navBg/navText/navActive*` são usados no header.
18. **Hover.** “hover com fundo hover” (#f4f4f4) é praticamente igual a `bgAlt` (#eff1f3): invisível na sidebar. → Hover da sidebar usa `surface` (branco).
19. **Bottom navigation.** Nav: “ofereça também uma bottom navigation” × layout mobile: “inferior: none”. → Não há bottom navigation.
20. **Páginas sem especificação.** Contratos, Fornecedores, Compras, Colaboradores, Folha, Auditoria, Permissões, Configurações, Ajuda e Meu perfil não têm conteúdo descrito. “Não invente”. → Cada uma abre o título e um estado vazio honesto (“Tela fora do escopo desta demonstração”) com botão para o Painel.
21. **Foco ao navegar pelo drawer.** “ao fechar, o foco volta ao gatilho” × boa prática de mover o foco para o novo conteúdo. → Segue o texto: foco volta ao ☰ e a nova página é anunciada por região `aria-live`.

## 3. Dashboard, gráfico e tabela

22. **Quantidade de KPIs.** “Quantidade de KPIs: 3” × “KPIs 4 → 2 → 1 colunas”. → 3 KPIs; 3 colunas (≥880 px de contêiner) → 2 colunas com o terceiro ocupando a linha toda → 1 coluna. Mínimo ≈280 px por cartão.
23. **Onde fica a tabela.** Dashboard: “gráfico (2/3) + atividades (1/3)” e a tabela “Pedidos recentes” (4 colunas, checkbox, ações) não cabe em 1/3. → Tabela em largura total abaixo da linha gráfico + atividades. O contêiner (não a viewport) decide o empilhamento (2/3 + 1/3 só a partir de 900 px de largura útil).
24. **Dois filtros de período.** Gráfico: “Cabeçalho (título + filtro de período)”; dashboard: “Filtro de período atualiza todos os blocos”. → Um filtro global (header no desktop; cabeçalho da página no celular, já que a topbar só tem ☰/logo/avatar). O cabeçalho do gráfico mostra o período vigente, sem segundo filtro.
25. **Opções do período.** Só o rótulo “Últimos 30 dias ▾” é dado. → Opções: 30 dias, 90 dias, 6 meses e 12 meses. Os dados são gerados por semente (determinísticos) e a data de referência é fixa em **02/11/2026** (data do PROMPT.md), não a data real.
26. **Gráfico mensal × período em dias.** “Vendas por mês” com período “30 dias”. → Janela do gráfico = máximo entre 6 e o número de meses que o período cruza (30d → 6, 90d → 6, 6m → 7, 12m → 12). Séries nomeadas “Vendas” e “Meta” (nomes não especificados). Valores em R$ mil. “Rótulos de valores: não” respeitado; valores só no tooltip.
27. **Abas Aquisição, Retenção e Receita.** Sem conteúdo definido. → Mesmos componentes com KPIs, gráfico, atividades e tabela (mesmas colunas Cliente | Status | Valor | Data) de dados fictícios próprios.
28. **Ações da tabela.** “Ações por linha: sim” sem dizer quais; “atalhos de teclado visíveis” sem definir atalhos. → Menu “⋯” com Ver detalhes (modal), Copiar ID e Remover da lista (leva ao estado vazio, com “Restaurar”); ação em lote “Remover”; atalhos de teclado personalizados **não** foram criados (só navegação nativa, setas nos menus e no gráfico).
29. **Tabela no celular.** “rolagem horizontal local … ou … cartões” → **cartões** (abaixo de 768 px), com “Selecionar todos” e um `<select>` de ordenação no lugar dos cabeçalhos; semântica de tabela preservada com roles ARIA explícitos.
30. **Indicador de ativo.** “Item ativo marcado por sublinhado de 2 px” (Compact Pro) × aba “encaixada” (header) × barra de 3 px (sidebar). → Cada componente usa o seu: sublinhado de 2 px na coluna ordenada da tabela; aba encaixada no header; barra na sidebar.
31. **Exportar.** Sem especificação de formato. → Baixa um CSV real (separador `;`, BOM para o Excel) com as linhas visíveis da tabela.
32. **Busca e notificações.** Listadas no layout sem detalhes. → Busca: painel que filtra destinos de navegação. Notificações: 3 itens fictícios, “Marcar como lidas” leva ao estado vazio “Você está em dia”.

## 4. Identidade visual e acessibilidade

33. **Tamanho de texto.** Tipografia: base 15 px, “botões com pelo menos 14 px”, “nunca … menores que 12 px”; Compact Pro: “texto base 13 px, rótulos 12 px, controles 30 px”. → Shell, login e títulos usam a escala 13/15/18/23/30/39; botões e filtros 14 px; texto de tabela/KPIs/atividades 13 px; rótulos, badges e eixos 12 px. Controles de 30 px (44 px abaixo de 768 px e em `pointer: coarse`).
34. **Raios.** Global: 6/8/12 px; Compact Pro: controles 4 px, contêineres 6 px. → Login (fora de Compact Pro) usa 8 px nos controles e 12 px no cartão; o app usa 4/6 px. “paddingInterno 11 px” × escala de 4 px: 11 px nas células da tabela e 12 px nos cartões.
35. **Anel de foco.** “anel de 3 px … focusRing a 35%” × “Foco com anel de 2 px” × “anel de 2–3 px”. Um anel só a 35% não tem contraste suficiente. → Contorno sólido de 2 px em `focusRing` (+ halo de 4 px a 35% em botões e campos). Sobre `navBg` (header) o `focusRing` quase não contrasta (2,4:1), então ali o anel é branco (`navActiveText`).
36. **Cor “Destaque”.** Paleta global `accent` #0ea5e9 × componentes “Destaque: #0c91cd” (série 2 do gráfico). #0ea5e9 sobre branco tem 2,8:1. → Gráfico usa #0c91cd (3,5:1), exceção listada no componente; `accent` global não é usado.
37. **Contraste de texto semântico.** `warning`, `error` e `info` sobre seus fundos dão 4,4/4,0/4,4:1 (< 4,5). → Texto de badges e avisos usa versões derivadas (85% do token + `text`), todas ≥ 5:1 (tokens derivados em `tokens.css`). `placeholder` (#848993) dá 3,5:1 sobre branco: mantido como no PROMPT.md; todos os campos têm label visível.
38. **Gradiente.** Os tokens `gradientFrom/To` existem, mas “não adicione decoração (… gradientes …)”. → Definidos e não usados.
39. **Dark mode, fontes e ícones.** Não especificados. → Só tema claro. Inter embutida (subconjunto latin, OFL) para funcionar offline; ícones Lucide embutidos (traço 1,75, outline).

## 5. Login

40. **Autenticação real × demonstração.** Observações: “Implemente a autenticação real com backend seguro (hash Argon2id, rate limit, CSRF…)”, repetida duas vezes, mas a tarefa pede “sem backend”. → Interface fiel e comportamento simulado no navegador (credenciais fictícias exibidas em `<details>`); nada disso substitui um backend real.
41. **Cadastro.** “Cadastro: nenhum” × Pendências: “Escolha um fluxo de cadastro (ou confirme que não haverá cadastro)”. → Sem cadastro e sem link “Criar conta” (opção mais neutra).
42. **Dois botões “principais”.** SSO “em destaque” × “Botão principal com estado de carregamento (‘Entrando…’)”. → SSO é o botão primário sólido; “Entrar” (e-mail/senha) é secundário (contorno), com “Entrando…” e desabilitado durante o envio. O SSO mostra “Redirecionando…” (texto não especificado).
43. **Fluxo de entrada.** “O endereço abre direto na tela de entrar”. → Sem sessão, qualquer endereço leva ao login. Com sessão ativa na aba (`sessionStorage`), recarregar mantém o painel; “Sair” volta ao login com aviso “Sessão encerrada com segurança.”.
44. **Resumo de erros.** “Validação ao enviar e ao sair do campo: mensagem abaixo do campo … e resumo no topo”. Atualizar o resumo no `blur` deslocava o botão entre mousedown e mouseup e perdia o clique. → Mensagem sob o campo no `blur` e no envio; resumo (`role="alert"`) montado no envio. O `blur` causado pelo clique no próprio botão não valida.
45. **Credenciais inválidas.** Resumo com “E-mail ou senha incorretos” e nenhum campo marcado; limpa a senha e devolve o foco a ela.
46. **“Suporte de TI”.** Sem destino. → `mailto:suporte.ti@nexocapital.example` (endereço fictício).
47. **Dimensões.** “larguraFormulario ≈360–400 px”: formulário interno de 376 px (cartão de 440 px com 32 px de padding); no celular o cartão ocupa a largura toda, sem bordas laterais.

## 6. Outros

48. **Estados forçados por URL.** Não previsto no PROMPT.md; `?estado=erro|vazio|carregando` foi adicionado só para demonstrar os estados exigidos (seção G) sem depender de falhas reais. Documentado no README.
49. **Roteamento por hash.** Necessário para funcionar em `file://`; por isso o link “Ir para o conteúdo” é tratado por JavaScript (não altera o hash).
50. **Pendências do PROMPT.md.** A única pendência listada (cadastro) foi resolvida como descrito no item 41.
