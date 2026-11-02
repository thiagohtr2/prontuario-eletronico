# Relatório A2: usuário intermediário (Rafael), primeiro acesso ao Atelier UI

## 1. Aviso: persona simulada

**Isto não é um teste com pessoas.** Quem percorreu o produto foi um agente de IA fazendo o papel de "Rafael", uma persona fictícia: 31 anos, analista de marketing, já fez dois sites com ChatGPT, Claude e Cursor e se frustrou com o retrabalho. O agente navegou com Playwright (Chromium, viewport 1440×900, perfil novo com `localStorage` vazio no início) e só usou o que aparecia na tela. Não leu código, README nem relatórios de outros agentes. As reações "do Rafael" são inferências sobre como uma pessoa com esse perfil provavelmente reagiria. Servem como hipóteses para validar com usuários reais, não como evidência de comportamento humano.

- Data: 02/11/2026. Endereço: http://127.0.0.1:4300/ (título da aba: "Atelier UI · Design System Studio").
- O prompt manual foi escrito **antes** de abrir o site: `prompt-manual.md`.
- Arquivos exportados pelo site: `exportados/painel-de-campanhas-master-prompt.md` (33.157 caracteres, 530 linhas) e `exportados/painel-de-campanhas-especificacao.json`.
- Capturas: `capturas/01…38`. As capturas "completa" (página inteira) às vezes mostram o header fixo ou o rodapé fixo no meio da imagem. Isso é efeito da captura, não defeito do site.
- Custo: **53 interações** (45 cliques e 8 preenchimentos de campo). Foram **~7,4 min de automação**. Uma pessoa lendo as galerias levaria, por estimativa, **25 a 45 min**. O prompt manual levou ~5 min.

---

## 2. Caminho seguido, passo a passo

Legenda dos itens: (1) o que tentou · (2) o que esperava · (3) o que aconteceu · (4) entendeu? · (5) precisou voltar? · (6) ficou confuso? · (7) algum controle parecia não funcionar? · (8) abandonaria aqui? · (9) parecia profissional? · (10) como melhorar.

### P1. Abrir o site (captura 01, 01b)
1. Abrir o endereço. 2. Uma tela para "criar meu dashboard". 3. Home com a proposta "Do site que você imagina ao site que a IA realmente constrói" e dois caminhos: **Modo Guiado** (selo "Recomendado para iniciantes") e **Modo Livre**. Abaixo, a régua "1 Esqueleto · 2 Identidade · 3 Componentes · 4 Entrega" e a frase "decidir a estrutura antes das cores evita retrabalho com a IA". 4. Sim. A frase fala exatamente da dor dele. 5. Não. 6. Um pouco: a lateral já mostra "Landing, login e cadastro" como etapa 2, e ele pensou "meu dashboard precisa disso?". 7. Não. 8. Não. 9. Sim, visual limpo e consistente. 10. Mostrar uma frase do tipo "funciona para dashboards, apps e sites" e avisar que as etapas se adaptam ao tipo de projeto.

### P2. "Começar no modo guiado" (captura 02)
1. Clicar no botão principal. 2. Um questionário. 3. "Etapa 1 de 10 · Esqueleto". O stepper divide **Esqueleto (1–5)** e **Acabamento (6–10)**, e o acabamento fica travado ("libera após aprovar o esqueleto"). 4. Sim. 5. Não. 6. Não. 7. Os itens 6–10 aparecem desabilitados, mas o texto explica o motivo. 8. Não. 9. Sim. 10. Mostrar uma estimativa de tempo ("~20 min").

### P3. Escolher o tipo "Dashboard" (captura 03 → 03b)
1. Selecionar o card "Dashboard". 2. Que o resto se adaptasse a dashboard. 3. Apareceu a "Sugestão (opcional): Dashboards precisam de espaço horizontal para gráficos: menus compactos ajudam. Para este tipo de projeto, costuma funcionar o fluxo **'Apenas login'**", com o botão "Usar esta sugestão". Também surgiram sugestões de funcionalidades: KPIs, Gráficos, Tabelas com filtros, Filtro por período, Exportar relatórios, Alertas. 4. Em parte. A justificativa fala de menus e a sugestão é sobre login: as duas coisas não se ligam. 5. Não. 6. Sim: "o que é fluxo 'Apenas login'?". 7. Não. 8. Não. 9. Sim. 10. Separar as duas dicas (menu compacto → passo 3, login → passo 2) e explicar "Apenas login = ferramenta interna, abre direto na tela de entrar".

### P4. Preencher "Sobre o projeto", funcionalidades e tecnologia (captura 04)
1. Preencher nome, objetivo, descrição, público e finalidade. Clicar em 5 sugestões, adicionar "ROI por canal" e "Filtro por canal" e escolher "React + TypeScript" (13 interações). 2. Um formulário. 3. Tudo funcionou. As tags aparecem como chips removíveis e o nome "Painel de Campanhas" passa a aparecer no rodapé da barra lateral ("Salvo automaticamente neste navegador"). 4. Sim. 5. Não. 6. Não. 7. Não. 8. Não. 9. Sim, só com um detalhe: o campo "Nome do projeto" é mais alto que os vizinhos (captura 03b). 10. Permitir **campos estruturados para o domínio**: lista de métricas, canais e itens de menu (ver P22).

### P5. "Usar esta sugestão" (captura 05)
1. Aceitar a sugestão. 2. Ver o que mudou. 3. Só o texto mudou para "(já aplicada)". Nada indica que o passo 2 já veio preenchido. 4. Mais ou menos. 5. Não. 6. Sim: "aplicou o quê, e onde?". 7. Pareceu que não fez nada. 8. Não. 9. Sim. 10. Mostrar um toast: "Fluxo de entrada definido como 'Apenas login' (passo 2)".

### P6. Continuar → Passo 2 "Landing, login e cadastro" (captura 06)
1. Continuar. 2. Algo sobre o dashboard. 3. Três abas ("Como as pessoas entram / Login / Cadastro"). "Apenas login" já vinha selecionado. A caixa "Landing page não é login" explica bem a diferença. 4. Sim. 5. Não. 6. Pouco. 7. "Continuar: Desktop" ficou desabilitado ("Escolha um modelo de login."). 8. Não. 9. Sim. 10. Nada urgente.

### P7–P8. Aba Login → "Clássico central" (capturas 07 → 08)
1. Abrir a aba e escolher um modelo. 2. Poucas opções. 3. **24 composições** de login, com filtros. As miniaturas já usam o nome "Painel de Campanhas". Ao escolher, um toast avisa: "Login 'Clássico central' selecionado e incluído no Master Prompt". 4. Sim. 5. Não. 6. Não, mas pensou: "vim fazer um dashboard e estou escolhendo tela de login". 7. Não. 8. Não. 9. Sim. 10. Para dashboards, mostrar primeiro 3 ou 4 modelos recomendados e deixar "ver todos" como opção.

### P9–P10. Passo 3 "Arquitetura do computador" (capturas 09, 10 → 11)
1. Escolher o layout. 2. "Menu lateral + header", como escreveu no prompt. 3. **42 modelos em 8 famílias**, com legendas coloridas (HEADER, SIDEBAR, RAIL, CONTEÚDO, PAINEL). Há três "Sugerido": "Sidebar integral clássica · Sistemas e SaaS", "Dashboard de três colunas · Dashboards" e "Analytics com lateral direita · Analytics". Rafael escolheu "Sidebar integral clássica" no painel fixo da direita ("Escolher este modelo"), que passou a mostrar "Escolhido para o seu projeto" e as medidas (Sidebar ≈252 px, Header ≈64 px). 4. Sim. As legendas ajudam muito. 5. Não. 6. Um pouco: com três sugestões, qual vale para ele? O modelo sugerido para dashboard tem uma coluna PAINEL que ele não pediu. 7. Não. 8. Não. 9. Sim. 10. Marcar **uma** recomendação principal por tipo de projeto e explicar por quê.

### P11–P12. Passo 4 "Arquitetura do celular" (capturas 12 → 13)
1. Escolher o layout mobile. 2. Ele só tinha escrito "tem que funcionar no celular". 3. **44 modelos**, com três "Sugerido" diferentes (Bottom Navigation clássica, Topbar com abas, Drawer pela esquerda). O texto diz "Toque em um modelo para **ver**", mas o toque **já escolhe** ("Escolhido para o seu projeto"). Rafael escolheu "Bottom Navigation com cinco destinos" porque o menu dele tem 5 itens: uma decisão que ele não tomaria sozinho. A prévia mostra "Pedidos", "Clientes" e um botão **"Carrinho"**, e a descrição diz "Ideal para lojas". 4. Sim. 5. Não. 6. Sim: "vai ter carrinho no meu painel?". 7. O comportamento do toque é diferente do desktop, que tem o botão "Escolher este modelo". 8. Não. 9. Sim. 10. Usar nas prévias os itens e os dados do projeto. Manter "ver" e "escolher" separados, como no desktop.

### P13. Passo 5 "Revisão do esqueleto" (capturas 14, 14b)
1. Revisar. 2. Um resumo para aprovar. 3. Aparece "**Ainda faltam decisões:** Escolha um fluxo de cadastro (ou confirme que não haverá cadastro). Resolver". Há um título "**Esqueleto aprovado**" antes de qualquer aprovação, e o card "CADASTRO: Sem cadastro escolhido". 4. Em parte. 5. Sim (próximos passos). 6. Sim: o passo 2 deixou continuar sem cadastro e só agora isso vira pendência. 7. "Aprovar esqueleto e continuar" está habilitado mesmo com pendência. 8. Ainda não. 9. Quase. O título prematuro passa desleixo. 10. Validar no próprio passo 2 e renomear o título para "Esqueleto (a aprovar)".

### P14. Clicar em "Resolver" (captura 15) ⚠ ponto de abandono
1. Clicar em "Resolver" para confirmar que não haverá cadastro. 2. Uma opção "Não haverá cadastro". 3. O link levou para outra área, **"Início › Estrutura › Cadastro"** (modo livre). O stepper do guiado sumiu. Há **8 fluxos de cadastro e nenhuma opção "sem cadastro"**, e não existe botão "voltar à revisão". 4. Não. 5. Sim. 6. **Muito**. 7. O "Resolver" não resolve o que o próprio aviso pede. 8. **Sim, considerou desistir.** "De novo a ferramenta decidindo por mim: eu não quero cadastro." 9. Não, neste momento. 10. Incluir a opção "Sem cadastro (contas criadas pelo administrador)" e fazer o "Resolver" abrir a aba Cadastro **dentro** do guiado, com "Voltar para a revisão".

### P15–P16. Voltar ao passo 2, aba Cadastro → "Cadastro por convite para equipe" (capturas 16 → 17)
1. Procurar a opção "sem cadastro" no guiado. 2. Encontrar a opção. 3. Também não existe. Rafael cedeu e escolheu "Cadastro por convite para equipe", o que faz sentido para uso interno. 4. Sim. 5. Sim (2 interações extras). 6. Sim. 7. Não. 8. Quase. 9. Sim. 10. Igual ao P14.

### P17. Revisão → "Aprovar esqueleto e continuar" (capturas 18 → 19)
1. Voltar pelo stepper e aprovar. 2. Seguir em frente. 3. "Esqueleto completo." Toast: "Esqueleto aprovado. Agora vamos ao acabamento." 4. Sim. 5. Não. 6. Não. 7. Não. 8. Não. 9. Sim. 10. –

### P18. Passo 6 "Prévia integrada" e visão Celular (capturas 19 → 20)
1. Conferir a prévia no computador e no celular. 2. Ver o **meu** painel. 3. Aparece um dashboard genérico: KPIs "Receita, Clientes ativos, Ticket médio, Satisfação"; sidebar com "Início, Relatórios, Clientes, Agenda, Mensagens, Configurações"; e **mais** abas no header ("Visão geral, Projetos, Equipe"). O nome "Painel de Campanhas" aparece duas vezes, na sidebar e no header. No celular o conteúdo é outro ("Saldo do mês, Pedidos, Clientes"). O painel "Escolhas nesta prévia" lista tudo, com lápis para editar. 4. Sim. 5. Não. 6. Sim: "a IA vai fazer um menu com Agenda e Mensagens?". 7. Não. 8. Não. 9. Sim visualmente, não no conteúdo. 10. Gerar a prévia com os KPIs e as funcionalidades informados no passo 1 (investimento, cliques, conversões, ROI).

### P19–P20. Passo 7 "Identidade visual": busca "azul" → "Azul Institucional" (capturas 21 → 22 → 23)
1. Escolher uma paleta azul, discreta e de fundo claro. 2. Um seletor de cor. 3. **60 paletas**. A busca "Buscar por nome, clima ou cor…" filtrou por "azul". Ao escolher "Azul Institucional", a "Prévia da identidade" mudou na hora (sidebar marinho, botões azuis). 4. Sim. 5. Não. 6. Não. 7. Não. 8. Não. 9. Sim, é uma das melhores telas. 10. Avisar que a paleta escolhida deixa a navegação escura, já que ele não pediu isso.

### P21. Aba "Tipografia" (captura 24)
1. Ver as fontes, porque ele tinha pedido "fonte bonita". 2. Opções simples. 3. Seis fontes; "Inter" vem marcada como "ótima para interfaces e dashboards"; há tamanho e peso. 4. Sim. 5. Não. 6. Um pouco: o subtítulo diz que "Tipografia e cantos vêm em seguida", mas estão em abas. Quem clica em "Continuar" pula as abas e fica com o padrão. 7. Não. 8. Não. 9. Sim. 10. Corrigir o texto ou fazer o "Continuar" passar pelas abas.

### P22. Passo 8 "Headers e sidebars" (captura 25) ⚠ ponto de abandono parcial
1. Definir o menu: Visão geral, Campanhas, Canais, Relatórios, Configurações. 2. Um lugar para digitar os itens do menu. 3. **36 headers e 36 sidebars, cada um com composições A e B**. O primeiro header da lista é de landing page ("Produto, Recursos, Preços… Começar grátis"). Aparece o termo "Layout Studio", que nunca tinha sido apresentado. **Não há onde definir os itens do menu.** A etapa é "opcional". 4. Em parte. 5. Não. 6. Sim. 7. Não. 8. **Pularia a etapa** se não fosse o teste. 9. Sim. 10. Adicionar um editor "Itens do menu" (nome e ícone) que alimente as prévias e o Master Prompt. Filtrar os headers pelo tipo de projeto.

### P23. Filtro "SaaS" → header "Painel Analítico" (capturas 26 → 27)
1. Procurar um header de dashboard. 2. Título, avatar e filtro de data. 3. Encontrou "**Painel Analítico**: Para dashboards: abas de relatórios, escolha de período e botão de exportar". Selecionou e recebeu toast de confirmação. 4. Sim. 5. Não. 6. Não. 7. Não. 8. Não. 9. Sim. 10. Poder renomear as abas (vieram "Visão geral, Aquisição, Retenção, Receita").

### P24. Aba Sidebars → "Clássica Integral" (capturas 28 → 29)
1. Escolher a sidebar. 2. Uma sidebar com os itens dele. 3. "Clássica Integral" com os itens "Início, Painel, Projetos (12), Tarefas, Calendário, Pessoas" e o usuário "Marina Alves". Selecionada, com toast. 4. Sim. 5. Não. 6. Sim: os itens não são os dele. 7. Não. 8. Não. 9. Sim. 10. Igual ao P22.

### P25–P26. Passo 9 "Componentes": busca "gráfico" → "Gráficos" (capturas 30 → 31 → 32)
1. Achar os componentes de gráfico. 2. Escolher linha e barras. 3. **66 categorias × 16 famílias visuais**. A busca "gráfico" achou "KPIs e stat cards", "Gráficos" e "Dashboard". Em "Gráficos", as 16 famílias mostram o mesmo gráfico de barras "Vendas por mês"; o que muda é o estilo (Soft Pill, Swiss Minimal…), não o tipo. 4. Sim. 5. Não. 6. Um pouco. 7. Não. 8. Não. 9. Sim. 10. Para dashboard, começar por "KPIs, Gráficos e Tabelas" em vez de "Botões".

### P27. "Adicionar ao projeto" (Compact Pro) → personalizar → "Concluir" (capturas 33 → 34)
1. Adicionar o gráfico, dar nome e título. 2. Configurar "ROI por canal". 3. Abriu o modal "Personalizar: Gráficos", com abas **Normal/Hover/Focus/Active/Disabled**, "**Token global** (somente leitura)", "**Configuração da instância**" e "Exceção individual". Dá para mudar o Tipo (Barras/Linha/Área/Rosca) e o título, e o título muda na prévia em tempo real. **Não dá para definir as categorias** (canais): o eixo continua "Jan…Jun" e a legenda "2025/2024". O toast cobre parte do rodapé do modal. 4. Em parte, por causa do jargão. 5. Não. 6. Sim. 7. Não. 8. Pularia o restante da etapa (KPIs, tabela). 9. Sim. 10. Trocar o jargão ("Token global" → "Cores do projeto"; "instância" → "Este gráfico") e adicionar os campos "Eixo X / Categorias" e "Métrica".

### P28. Passo 10 "Master Prompt" (captura 35)
1. Ver o resultado. 2. Um prompt pronto. 3. Contadores: "11 itens · 0 retirados · **0 contradições a decidir** · 0 decisões pendentes". Abas Master Prompt / Itens / Contradições / Especificação JSON. Texto de 33.157 caracteres. 4. Sim. 5. Não. 6. Não, até ler o conteúdo (ver seção 3). 7. Não. 8. Não. 9. Sim. 10. Ver a seção 3.

### P29. Baixar .md, copiar, baixar JSON (capturas 36, 37, 38)
1. Exportar. 2. Arquivos. 3. `painel-de-campanhas-master-prompt.md` e `painel-de-campanhas-especificacao.json` baixaram com nomes claros. "Copiar" mostrou "Copiado para a área de transferência." 4. Sim. 5. Não. 6. Não. 7. Não. 8. Não. 9. Sim. 10. –

---

## 3. Prompt manual × Master Prompt gerado

| | Prompt manual (Rafael) | Master Prompt (site) |
|---|---|---|
| Tamanho | ~225 palavras, ~1,5 mil caracteres | 5.361 palavras, 33.157 caracteres (**~20× maior**) |
| Tempo para produzir | ~5 min | ~7 min de automação; estimativa humana de 25–45 min, 53 interações |
| Cores | "azul como cor principal, mas nada muito chamativo… fundo claro" | Tabela com 44 tokens hex: `primary #1d4ed8`, `navBg #0f1f4d`, `bg #f8fafc`… |
| Layout | "menu lateral… header em cima com o nome… e a foto do usuário" | Grid `252px minmax(0,1fr)` / `64px 1fr`, sidebar sticky `100dvh`, header sticky, padding 24–32 px |
| Menu | "**Visão geral, Campanhas, Canais, Relatórios, Configurações**" | Sidebar: "Início, Painel, Projetos (12), Tarefas, Calendário \| Pessoas, Mensagens (3), Relatórios \| Configurações, Ajuda"; header: "Visão geral, Aquisição, Retenção, Receita" |
| Métricas e gráficos | cards de investimento, cliques, conversões e ROI; gráfico de linha (evolução) e de barras (canais); tabela de campanhas; CPC/CPA | Só o texto livre copiado da descrição (seção A) e **1** componente: "Gráfico de ROI por canal — Tipo: Barras, Séries: 2" |
| Filtros | "últimos 7 dias, 30 dias, mês atual" + filtro por canal | Header com "seletor de período 'Últimos 30 dias ▾'" e "Exportar"; filtro por canal só como palavra na lista de funcionalidades |
| Celular | "tem que funcionar no celular" | Bottom nav de 5 itens, safe areas, 15 larguras de teste, toque ≥ 44 px |
| Anti-retrabalho | "não muda o layout… não inventa cores… não coloca coisas que eu não pedi" | Seção G: "Não modifique escolhas aprovadas…", "Não adicione decoração por conta própria…" |

### O que o site acrescentou de valor
- **Precisão visual que o Rafael nunca daria.** A frase vaga "azul nada chamativo" virou `primary #1d4ed8`, `textMuted #686d7a` e assim por diante. "Fonte bonita" virou "Inter… peso 650… tamanho base 15 px… escala 13/15/18/23/30/39". É justamente aqui que a IA costuma "decidir sozinha".
- **Estrutura e responsividade explícitas**, como "Abaixo de 768 px vale a arquitetura mobile escolhida… não converta a navegação desktop em drawer, rail ou bottom navigation por conta própria" e "Nenhum overflow horizontal… de 320 px a 1920 px".
- **Estados, acessibilidade e segurança** que nem passavam pela cabeça dele: `aria-current="page"`, foco visível, "senhas com hash (Argon2id ou bcrypt)… cookie httpOnly", "Implemente estados de carregamento, vazio e erro".
- **O header "Painel Analítico"** trouxe seletor de período e "Exportar", alinhados ao pedido dele de filtro de data, mais a função de exportar que veio das sugestões do passo 1.
- **Regras anti-retrabalho formalizadas** (seção G), uma versão mais forte do "IMPORTANTE" do prompt dele.

### O que é ruído (ou pior: instrução errada)
- **Conteúdo de demonstração tratado como especificação.** A introdução manda "Implemente exatamente o que está descrito", e o prompt traz a sidebar "Projetos (12), Tarefas, Calendário, Pessoas, Mensagens (3)", o header com "Aquisição, Retenção, Receita", o mobile com "ações (busca, carrinho)" e "badge em itens como Carrinho", e o cadastro com "Ana Ribeiro convidou você para a equipe Projeto Aurora". Só a marca é marcada como substituível ("marca fictícia 'Seriema'… substitua"). Na prática, **isso reproduz o problema que o Rafael queria evitar**: a IA monta um menu que ele não pediu.
- **Contradições internas**, apesar de a tela afirmar "0 contradições":
  - A arquitetura diz "O header fica somente sobre a coluna principal — não passa por cima da sidebar". O header escolhido diz "largura total da janela (full width)".
  - O header aparece com "≈64 px" em um lugar e "56 px de altura" em outro. A sidebar aparece com "≈252 px" e com "248 px".
  - Celular: "Bottom Navigation com 5 itens", mas o header diz "Abaixo de 768 px… botão de menu ☰… Vão para o painel do menu: os 4 itens", e a sidebar diz "Abaixo de 768 px: sai do fluxo e vira um drawer". Duas linhas depois, a própria sidebar diz "no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria)".
  - O login traz "Abaixo do cartão: 'Não tem conta? Criar conta'", mas o cadastro é "por convite para equipe".
  - Há **duas navegações principais** (abas no header e sidebar) com itens diferentes.
- **Volume que não serve ao objetivo dele**: ~100 das 530 linhas são de login e cadastro, que ele nem tinha pedido. Também há repetição (a observação sobre autenticação aparece duas vezes, nas linhas 59 e 61, e as regras de responsividade se repetem por item e de novo na seção F) e regras sem relação com o projeto ("Calendários: no celular, ofereça modo de lista/agenda").

### O que ficou faltando para um dashboard de marketing
- **Métricas como dados estruturados**: lista de KPIs (investimento, cliques, conversões, ROI, CPC, CPA, CTR), **fórmulas** (ex.: ROI = (receita − investimento) / investimento), formato de moeda R$ com separador de milhar e comparação com o período anterior (Δ%).
- **Tipos de gráfico por métrica**: o prompt manual pedia linha (evolução) e barras (canais). O Master Prompt tem só um gráfico de barras, sem categorias (os canais Google Ads, Meta Ads, LinkedIn e e-mail não aparecem estruturados) e com "Séries: 2" sem dizer quais.
- **Tabela de campanhas**: colunas, ordenação, paginação, ação na linha.
- **Filtros**: valores do período (7 dias, 30 dias, mês atual, personalizado), filtro por canal, comportamento ao mudar o filtro e se os filtros ficam guardados na URL.
- **Dados de exemplo e origem** (mock, CSV, API do Google/Meta), atualização ("Atualizado há 5 minutos" aparece só na prévia).
- **Itens do menu reais** do usuário.

### Veredito sobre redução de retrabalho
**Reduz em parte e cria retrabalho novo.** O site reduz bem o retrabalho em **cores, tipografia, grid, responsividade e acessibilidade**, as áreas em que a IA "decidia sozinha" para o Rafael. Por outro lado, na parte que define *o que* é o painel (menu, métricas, gráficos, filtros), o resultado é **pior que o prompt manual**: ele troca os itens que o Rafael escreveu por itens de demonstração e manda implementá-los "exatamente". Somando as contradições não detectadas, o Rafael provavelmente teria de pedir correções de menu e de navegação mobile, o mesmo retrabalho de antes. Em resumo, o resultado é **mais longo e mais preciso no visual, mais fraco no conteúdo**. Para esta persona, o melhor uso hoje seria juntar o prompt manual (conteúdo) com as seções D, F e G do Master Prompt (identidade, responsividade e regras).

**Decisões que o site fez o Rafael tomar e que ele não tomaria sozinho:** fluxo de entrada (login sim ou não), modelo de login (entre 24), cadastro (entre 8, **sem poder dizer "nenhum"**), arquitetura mobile (bottom nav de 5 destinos, entre 44), paleta concreta (Azul Institucional com navegação marinho), tipografia (Inter 15 px), estilo de header com seletor de período, estilo de sidebar e família visual e tipo do gráfico. Metade delas melhora a especificação (mobile, paleta, header analítico). A outra metade (login e cadastro obrigatórios) foi custo sem benefício para um painel interno.

---

## 4. Problemas encontrados

| # | Título | Onde | Evidência | Gravidade | Sugestão concreta |
|---|---|---|---|---|---|
| 1 | Itens de menu de demonstração viram especificação "exata" | Passos 8 e 10; Master Prompt seções C e B | Linhas 205 e 251 do .md ("Projetos (12), Tarefas, Calendário…", "Aquisição, Retenção, Receita") + linha 4 "Implemente exatamente…"; capturas 27, 29 | **Alta** | Criar o campo "Itens do menu" (passo 1 ou 8) e usá-lo nas prévias e no prompt. Até lá, marcar no prompt: "itens da prévia são ilustrativos, use os itens do projeto". |
| 2 | Contradições não detectadas ("0 contradições") | Passo 10 / Master Prompt | Header full width × "não passa por cima da sidebar"; 56 × 64 px; 248 × 252 px; bottom nav × ☰ com 4 itens × drawer (linhas 157, 231, 281 e 286); "Criar conta" × cadastro por convite | **Alta** | Cruzar header, sidebar e layout desktop/mobile antes de gerar e listar os conflitos na aba "Contradições". Na navegação mobile, a escolha do passo 4 deve sobrescrever as regras de responsividade do header e da sidebar. |
| 3 | Não existe "sem cadastro", e "Resolver" tira o usuário do guiado | Passo 5 → "Resolver" | Aviso "(ou confirme que não haverá cadastro)"; captura 15 (rota `#/modulos/cadastro`, 8 fluxos, nenhuma opção "sem"); captura 16 | **Alta** (ponto de abandono) | Opção "Sem cadastro: contas criadas pelo administrador". Fazer "Resolver" abrir a aba no guiado, com "Voltar para a revisão". |
| 4 | Prévias e componentes ignoram o conteúdo do projeto | Passos 4, 6, 8, 9 | Capturas 13 e 20 ("Pedidos", "Carrinho"), 19 ("Receita, Clientes ativos…"), 32 ("Vendas por mês", Jan–Jun) | **Alta** | Gerar as prévias com os KPIs e as funcionalidades do passo 1. No gráfico, permitir "Categorias / Eixo X" e "Métrica". |
| 5 | Ruído de outro domínio no prompt | Master Prompt seções B e Cadastro | "ações (busca, carrinho)", "badge em itens como Carrinho" (linhas 156–158); "Ana Ribeiro… Projeto Aurora" (linha 70) | Média | Separar "texto de demonstração" de "regra" e omitir exemplos que não combinam com o tipo de projeto. |
| 6 | Excesso de opções sem filtrar pelo tipo de projeto | Passos 2, 3, 4, 7, 8, 9 | 24 logins, 42 desktop, 44 mobile, 60 paletas, 36+36 (×2) de navegação, 66×16 componentes; o 1º header é de landing (captura 25) | Média | Para "Dashboard", abrir cada galeria com 3 a 5 recomendadas e deixar "ver todas" como opção. Ordenar por adequação. |
| 7 | Várias "Sugerido" conflitantes | Passos 3 e 4 | Desktop: 3 sugestões (captura 09/10); mobile: 3 (captura 12) | Média | Uma recomendação principal por tipo de projeto, com o motivo. |
| 8 | Validação tardia do cadastro | Passo 2 → 5 | "Continuar: Desktop" habilitado sem cadastro (captura 08); pendência só na revisão (captura 14) | Média | Validar ou perguntar no passo 2 ("Haverá cadastro?"). |
| 9 | Jargão técnico no modal de componente e no passo 8 | Passo 9 (modal), passo 8 | "Token global", "Configuração da instância", "Exceção individual", Hover/Focus/Active/Disabled num gráfico (captura 33); "Layout Studio" (captura 25) | Média | Usar linguagem leiga ("Cores do projeto", "Este gráfico") e esconder os estados atrás de "Avançado". |
| 10 | Sugestão "Apenas login" com justificativa sem relação | Passo 1 | "menus compactos ajudam… costuma funcionar o fluxo 'Apenas login'" (captura 03b); só "(já aplicada)" como retorno (captura 05) | Baixa-média | Separar as dicas e confirmar com toast o que foi aplicado e onde. |
| 11 | "Toque para ver" seleciona de imediato | Passo 4 | Texto "Toque em um modelo para ver no celular grande"; após o toque, "Escolhido para o seu projeto" (captura 13) | Baixa | Igualar ao desktop (prévia + "Escolher este modelo") ou mudar o texto. |
| 12 | Título "Esqueleto aprovado" antes da aprovação | Passo 5 | Captura 14b | Baixa | "Esqueleto para aprovar". |
| 13 | Abas de Tipografia e Formas são puladas sem aviso | Passo 7 | "Tipografia e cantos vêm em seguida", mas são abas; "Continuar: Navegação" vai direto (capturas 21, 24) | Baixa | Ajustar o texto ou incluir as abas no fluxo. |
| 14 | 37 elementos `<main>` e 38 `<nav>` na mesma página | Passo 8 | Contagem no DOM via Playwright (prévias interativas usam `<main>`) | Baixa-média (leitor de tela) | Nas prévias, trocar `<main>`/`<nav>` por `div` com `role="presentation"`, ou isolar em iframe. |
| 15 | Toast sobrepõe o rodapé do modal | Passo 9 | Captura 33 (cobre "Prompt deste elemento") | Baixa | Posicionar o toast acima do modal ou no topo. |
| 16 | Campo "Nome do projeto" com altura diferente | Passo 1 | Captura 03b | Baixa | Igualar a altura dos inputs. |
| 17 | Barra superior mostra só "Esqueleto 5/5" no acabamento | Topo, passos 6–10 | Capturas 19–35 | Baixa | Mostrar o progresso total ("Etapa 8/10"). |
| 18 | Repetições no Master Prompt | Master Prompt | Linhas 59 e 61 iguais; regras de responsividade repetidas por item e na seção F | Baixa | Deduplicar e usar referências cruzadas. |

---

## 5. O que funcionou bem

- **Proposta e caminho iniciais claros.** A home tem dois modos, "Recomendado para iniciantes" e a frase "decidir a estrutura antes das cores evita retrabalho" (captura 01). Fala direto à dor da persona.
- **Esqueleto antes de acabamento**, com o acabamento travado e o motivo explicado (captura 02). É um bom modelo mental contra o "a IA mudou tudo".
- **O tipo de projeto gera sugestões úteis**: KPIs, Gráficos, Filtro por período e Exportar relatórios (captura 04). Rafael não tinha pensado em "Exportar" e o site lembrou.
- **Explicações em linguagem leiga**: "Landing page não é login…" (captura 06) e legendas coloridas HEADER/SIDEBAR/RAIL/CONTEÚDO nos desenhos (captura 09).
- **Confirmações constantes**: toasts "…incluído no Master Prompt" (capturas 08, 27, 29), "Esqueleto aprovado…" (captura 19), "Copiado…" (captura 37), e o salvamento automático visível na barra lateral.
- **Revisão com lista de pendências** e links "Alterar" por item (captura 14). O conceito é ótimo, apesar do problema 3.
- **Busca de paleta por cor**, com prévia que muda ao vivo (capturas 22, 23).
- **Header "Painel Analítico" feito para dashboards** (seletor de período + Exportar), encontrado em 2 cliques pelo filtro "SaaS" (captura 27).
- **Personalização com efeito imediato**: o título "ROI por canal" muda na prévia enquanto se digita, e há os tipos Barras/Linha/Área/Rosca (captura 34).
- **Entrega organizada**: contadores, abas Itens/Contradições/JSON e downloads .md e .json com nomes claros (capturas 35–38).
- **Qualidade técnica do Master Prompt no visual**: tokens hex completos, grid, sticky, breakpoints, acessibilidade e segurança de login. É um nível de detalhe que uma pessoa como o Rafael não alcançaria sozinha.
