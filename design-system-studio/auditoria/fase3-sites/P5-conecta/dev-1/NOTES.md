# NOTES — ambiguidades, lacunas e contradições do PROMPT.md

Cada item cita o trecho da especificação e diz o que foi decidido. A regra de desempate foi a da própria especificação: *“quando algo não estiver especificado, escolha a opção mais simples e consistente com o restante, sem adicionar decoração”*. Quando dois trechos conflitam, o mais específico (componente ou exceção do usuário) prevaleceu sobre o genérico.

## Arquitetura e navegação

1. **Destinos diferentes entre desktop e celular.** O header lista “Navegação principal com 4 itens (Feed, Grupos, Eventos, Mensagens)”. O dock lista “Itens da navegação: Início | Explorar | Salvos | Perfil”. E a regra geral diz que as regiões “mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões”.
   **Decisão:** usei a união dos destinos e fiz um mapeamento para que todos existam nas duas versões:
   - Feed = Início, a mesma rota `#/feed`. No dock o rótulo é “Início”; no header e no drawer, “Feed”. O título da página acompanha: “Início” no celular, “Feed” no computador.
   - Explorar: no computador, é o destino da busca do header (Enter leva a `#/explorar?q=…`). No celular, é um item do dock (e o ícone de busca da topbar também leva para lá).
   - Salvos: no computador, entrou no menu do avatar (ver item 2).
   - Perfil: no computador, “Meu perfil” no menu do avatar.
   - Grupos, Eventos e Mensagens: no celular, ficam no drawer (“Vão para o painel do menu: os 4 itens de navegação” + exceção “o botão de menu abre o drawer”).

2. **Menu do avatar.** Trecho: “o avatar abre um menu com nome e e-mail, ‘Meu perfil’, ‘Configurações’, ‘Ajuda’ e ‘Sair’”. **Decisão:** acrescentei “Salvos”, porque é o único jeito de manter esse destino do dock acessível no computador (regra dos “mesmos destinos”). Os demais itens são exatamente os listados.

3. **Conteúdo do drawer.** O layout pede “configurações, ajuda e conta no drawer”. O header pede que os 4 itens de navegação vão para o painel do menu, e esse painel virou o drawer pela exceção. **Decisão:** o drawer tem o resumo da conta (avatar, nome e e-mail, com link para o perfil); a seção “Navegar” com Feed, Grupos, Eventos, Mensagens e Notificações; a seção “Conta e ajuda” com Configurações e Ajuda; e, no rodapé fixo, “Sair da conta” (o “Botão principal” do componente).

4. **Notificações no celular.** A barra do celular é “logo, ícone de busca, avatar, botão de menu ☰”, sem sino. **Decisão:** as notificações (com contador) ficam no drawer e numa página própria `#/notificacoes`, que também é o destino do link “Ver todas” do popover no computador.

5. **“+ Novo” no celular.** A lista explícita da barra mobile não inclui a ação principal. Já as regras de header dizem “o logo e a ação principal continuam visíveis” (seções C e F). **Decisão:** a ação principal continua visível como um botão só com ícone “+” (44 × 44 px; nome acessível “Novo: criar publicação”). Sem FAB, conforme a exceção do usuário.

6. **Painel em largura total × drawer abaixo de 768 px.** O header descreve um “painel do menu” abaixo do header no celular, mas a exceção do usuário manda usar o drawer lateral. **Decisão:** abaixo de 768 px vale o drawer. O painel abaixo do header só existe entre 768 e 1023 px (“os links recolhem em um botão ‘Menu’ que abre um painel abaixo do header”).

7. **Ponto de corte do tablet.** Trecho: “Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber… caso contrário, use a estrutura mobile”. Mas também: “A partir de 768 px passa a valer a arquitetura desktop” e “Abaixo de 768 px: barra única de 56 px…”. **Decisão:** corte único em 768 px. De 600 a 767 px vale o layout mobile; de 768 a 1023 px, o desktop compactado.

8. **Item “Mais” (1024–1279 px).** O layout pede que “links excedentes vão para um item ‘Mais’”. O header, nessa faixa, só reduz o espaço para 16 px e a busca para 180 px. Com 4 links, tudo cabe em 1024 px. **Decisão:** implementei “Mais” de forma dinâmica. Ele só aparece se os links realmente não couberem (fonte ampliada, rótulos maiores, zoom), abre por hover e por clique, fecha com Esc e com clique fora, e marca o item ativo quando ele está dentro do menu.

9. **Altura do header.** Layout desktop: “grid-template-rows: 64px minmax(0, 1fr)” e “header: ≈64 px”. Header do componente: “Barra principal com 60 px de altura” e “altura (desktop): 60 px”. **Decisão:** 60 px, a medida do componente de header (mais específica). A estrutura em grid `header / content` foi mantida.

10. **Menus suspensos nos links.** Trecho: “Links com menu suspenso (dropdown ou mega menu) abrem em hover e clique”. Nenhum dos 4 links tem submenu. **Decisão:** esse comportamento vale só para o “Mais”. Os popovers de notificações e de perfil abrem por clique/toque e teclado.

11. **Header no celular: fixo, esconder ao rolar e limite de 25% na horizontal.** Trechos: “Continua fixo no celular; recomendado esconder ao rolar para baixo”, e “Funcione na orientação horizontal: barras fixas não podem ocupar mais de 25% da altura”. Topbar de 56 px + dock de 52 px passam de 25% num celular deitado (ex.: 320 px de altura). **Decisão:**
    - Na vertical: topbar `sticky`, que se esconde ao rolar para baixo e volta ao rolar para cima.
    - Na horizontal (largura < 768 px e altura ≤ 500 px): a topbar deixa de ser fixa e rola com a página; o dock fica com 52 px; só ele permanece fixo (cerca de 18% da altura).
    - No computador, o header nunca se esconde (“não esconde ao rolar”).

12. **“Horizontal: stories recolhem”.** O trecho não diz se recolher é esconder ou compactar. **Decisão:** compactar. A faixa fica com avatares de 46 px, sem nomes (os nomes continuam no `aria-label`), para não perder a funcionalidade.

13. **Stories no computador e em outras páginas.** O layout desktop não fala em stories, mas a funcionalidade “Header superior com stories” vale para o produto. **Decisão:** os stories aparecem no topo do Feed nas duas versões, logo abaixo do header. Nas demais páginas não aparecem, para não repetir conteúdo.

## Login e cadastro

14. **Altura dos campos na mesma tela.** Login: “Campos grandes (56 px)”. Cadastro: “alturaInputs: ≈44 px (desktop) / 48 px (celular)”. **Decisão:** segui cada módulo ao pé da letra: aba Entrar e recuperação com 56 px; aba Criar conta com 48 px no celular e 44 px no computador. Os botões de envio têm 48 px em ambas.

15. **Telefone: senha ou código?** Pede-se a alternância “E-mail | Telefone”, e a lista de autocomplete cita `one-time-code`. Não há fluxo de SMS descrito. **Decisão:** a forma mais simples, telefone + senha (`type="tel"`, `inputMode="tel"`, `autoComplete="tel"`, com máscara (11) 98765-4321). O `one-time-code` não é usado porque não há etapa de código.

16. **Botão “Entrar” fixo × ancorado.** No celular, “fica fixo na base, acima do teclado virtual (visualViewport)”. No cadastro, “o botão ‘Criar conta’ permanece visível logo abaixo do último campo (sem position: fixed)”. **Decisão:** “Entrar” fica fixo na base só abaixo de 768 px (usa visualViewport e safe area, mais `scroll-padding` para o campo focado). No computador, fica ancorado no fim do painel. “Criar conta” e “Enviar link” ficam no fluxo normal.

17. **Validação ao sair do campo.** Trecho: “Validação ao enviar e ao sair do campo”. **Decisão:** ao sair do campo, valida se a pessoa já digitou nele ou se ele já mostra erro. Assim, só passar pelos campos com Tab não enche a tela de erros. Também não valida no blur quando o próximo alvo é o botão de envio: a mensagem empurrava o botão e o clique se perdia, e o envio valida tudo de qualquer forma. Nada do que a pessoa digita é apagado, nem após erro de credenciais.

18. **URL das abas.** Pede-se “?aba=cadastro”. **Decisão:** além disso, a recuperação usa `?aba=recuperar`, e a aba Entrar limpa o parâmetro. A URL é atualizada com `history.replaceState`, testado em `file://` e em http.

19. **Requisitos de senha.** Só há o exemplo “Use pelo menos 8 caracteres”. **Decisão:** três regras com checklist ao vivo: 8+ caracteres, uma letra, um número. A lista fica em linha com quebra; abaixo de 360 px vira lista vertical, como pedido.

20. **Instruções ao lado (computador).** Trecho: “painel central com instruções curtas ao lado”. **Decisão:** o painel do formulário fica à esquerda e as instruções à direita (mesma ordem do DOM), com a conta de demonstração. No celular sobra só o quadro da conta de demonstração, abaixo do formulário.

21. **Autenticação.** As observações pedem backend seguro. **Decisão:** fora do escopo, porque a tarefa é uma demo sem backend. Contas criadas ficam no `localStorage` só para a demo funcionar, com comentário no código avisando que isso não deve ir para produção. O cadastro nunca revela se um e-mail já existe.

## Identidade visual e componentes

22. **Fonte global × fonte do componente.** Identidade: “Títulos em Inter (peso 650) e textos em Inter (peso 400), tamanho base 15 px”. Componentes: “Fonte de títulos: Fonte do sistema 500 / Fonte de texto: Fonte do sistema / Tamanho base: 14 px”. **Decisão:** Inter em tudo (com a pilha de fontes do sistema como fallback), porque a identidade diz que todos os componentes herdam os tokens e não há exceção listada para fonte. Mantive dos componentes o tamanho de 14 px e os títulos com peso 500 (cards, perfil, drawer, dock), que são propriedades de densidade da instância. Títulos de página usam 650.

23. **Cores do componente × paleta global.** Os componentes listam “Texto secundário: #646466” e “Destaque: #be7b00”, diferentes de `textMuted` #727274 e `accent` #f59f00. A especificação diz que “a família apenas transforma” a paleta. **Decisão:** dentro dos 4 componentes uso os valores do componente (tokens `--mm-*`); no resto, os tokens globais. `#be7b00` só aparece em ícones, porque não tem contraste AA para texto pequeno.

24. **Anel de foco a 35%.** Componentes: “anel de 3 px em focusRing a 35%”. Global: “anel de 2–3 px na cor focusRing, sempre visível”. A 35% o anel tem contraste de cerca de 1,5:1 e fica pouco visível. **Decisão:** nos componentes Modern Material, uma linha sólida de 1 px em `focusRing` mais o halo de 3 px a 35%. No resto do site, anel sólido de 2 px.

25. **Sombras.** Geometria: “Sem sombras em superfícies de conteúdo. Apenas elementos realmente flutuantes… podem ter elevação”. Componentes: “Borda: sem borda / Sombra: elevação tonal”. Header: “Após 8 px de rolagem ganha sombra suave”. **Decisão:** cards e perfil sem sombra (só superfície tingida `#fef8fa`). Sombra suave apenas no header após 8 px, em popovers, modais, no painel do tablet e no dock. O dock flutua sobre cards da mesma cor e, sem sombra, sumiria. O drawer usa scrim, sem sombra.

26. **FAB.** Todos os componentes repetem “No celular, use navigation bar inferior com pílula ativa e FAB acima dela”, mas a exceção do usuário diz “Sem botão flutuante (FAB)”. **Decisão:** sem FAB. O dock é a navegação inferior, com indicador de ativo em pílula tonal.

27. **Largura do drawer.** Componente: “largura: 360–420 px” e “No celular, largura de até 88vw”. Exceção: “≈280 px (máx. 85% da largura)”. **Decisão:** `min(280px, 85vw)`, conforme a exceção e o layout mobile. A alça de arraste / bottom sheet não se aplica a um drawer lateral.

28. **Gradiente.** Há tokens `gradientFrom` e `gradientTo`, e também “Não adicione decoração (… gradientes …)”. **Decisão:** o gradiente aparece num único lugar, o anel dos stories ainda não vistos (o uso clássico desse padrão). Stories vistos ficam com anel `borderStrong`.

29. **Mídia dos cards.** A especificação pede “Mídia (aspect-ratio 16/9)” mas não fornece imagens. **Decisão:** ilustrações tonais (fundo derivado da paleta + ícone lucide em círculo tonal), sem imagens externas, para funcionar offline e em `file://`. O primeiro card usa exatamente o exemplo: “Publicação da comunidade”, etiqueta “Novo”, ícone Avião, botão “Ver publicação”.

30. **Card clicável × ações.** Trechos: “O cartão inteiro pode ser clicável (link estendido) sem aninhar botões” e o rodapé tem “meta e ação”. **Decisão:** “Ver publicação” é o link estendido que cobre o card. Curtir, Salvar, Compartilhar e comentários ficam na página da publicação. Assim o card não tem botões aninhados e a funcionalidade de Salvos continua possível. Um selo “Salvo” aparece no card quando for o caso.

31. **Texto até 3 linhas × “nenhum texto cortado”.** O card pede “texto (até 3 linhas)” e a regra geral diz “Nenhum texto cortado”. **Decisão:** o card corta em 3 linhas (regra explícita do componente), e o texto completo está sempre na página da publicação.

32. **Perfil próprio × “Botão: Seguir”.** O componente de perfil mostra “Ana Souza / Product Designer / Botão: Seguir” e diz “Editar perfil abre formulário”. **Decisão:** Ana Souza é a pessoa logada. No perfil próprio, as ações são “Editar perfil” (abre formulário com campos preenchidos da família Modern Material) e “Compartilhar”. No perfil de outras pessoas, “Seguir”/“Seguindo” e “Mensagem”. As abas, cujo conteúdo não foi especificado, são Publicações, Mídia e Sobre.

33. **Logo.** Trechos: “monograma circular de 32 px” e “logo: ≈ 28 px de altura”; marca de prévia “Quero-quero — substitua pela marca real”. **Decisão:** monograma de 32 px com “C” + “Conecta”. Abaixo de 360 px fica só o monograma, para caber na barra de 56 px com alvos de 44 px e 8 px de espaço entre eles.

34. **Busca do header fora de 1280 px.** O texto define 220 → 300 px ao focar e 180 px entre 1024 e 1279 px, mas não diz quanto cresce nas faixas menores. **Decisão:** de 1024 a 1279 px, 180 → 232 px; de 768 a 1023 px, 180 → 240 px. Crescer até 300 px nessas faixas causaria overflow. Fonte de 16 px para evitar zoom no iPad.

35. **Contador de Mensagens.** “contador de mensagens” não diz se conta conversas ou mensagens. **Decisão:** soma de mensagens não lidas. Abrir uma conversa zera a contagem dela.

36. **Estados de carregamento, vazio e erro.** São exigidos, mas não há backend que falhe. **Decisão:** listas mostram um esqueleto estático (sem shimmer, para não acrescentar animação) na primeira carga. Há estados vazios reais (Salvos, Meus grupos, Confirmados, busca sem resultado). O erro é reproduzido pelo interruptor **Configurações › Demonstração › Simular falha de conexão**. Botões em carregamento só trocam o texto (“Entrando…”, “Publicando…”), sem spinner.

37. **Popovers e modais no celular.** Trechos: “no celular podem virar bottom sheet” / “Modais… no celular podem ocupar a tela ou virar bottom sheet”. **Decisão:** os modais (nova publicação, editar perfil, termos) viram bottom sheet abaixo de 768 px, com altura máxima de 90dvh. O visualizador de story ocupa a tela toda. O menu do avatar continua popover, limitado a `calc(100vw − 16px)`.

38. **Tipografia mínima.** Trecho: “Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px”. **Decisão:** 12 px só em badges, rótulos do dock, nomes dos stories e etiquetas. Botões e chips usam 14 px; campos usam 16 px em todas as larguras.
