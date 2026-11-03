### Matriz dev-1

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---|---|
| **ARQ-01** Fluxo "Apenas login" (abre direto em Entrar) | Entrada "Apenas login" | MP 17: clara | Abre em Entrar; sem landing | 100 % | — |
| **ARQ-02** Celular: topbar fixa com ☰ à esquerda | Layout mobile "Stories com dock e drawer lateral" | MP 146, 152, 227: clara | sticky top 0; ☰ 44×44 em x=16; some ao rolar para baixo e volta ao subir (MP 227 recomenda) | 100 % | — |
| **ARQ-03** Celular: faixa de stories logo abaixo da topbar, com rolagem horizontal | Mesmo layout (stories: sim) | MP 147, 156, 232: clara no celular; não diz se a faixa aparece em todas as telas nem se é fixa | Faixa colada à topbar (gap 0), overflow-x auto, 9 stories; só na tela Feed (NOTES 13) | 100 % | — |
| **ARQ-04** Celular: dock com Início/Explorar/Salvos/Perfil, sem FAB | Layout + componente "Menu inferior flutuante arredondado (dock)", FAB: não | MP 148, 176, 594-596: clara; resíduo contraditório "navigation bar + FAB" em MP 418/491/564/639 | 4 rótulos exatos; nenhum FAB | 100 % | — |
| **ARQ-05** Celular: drawer esquerdo aberto pelo ☰ da topbar | Layout (drawer-left) + componente Drawer (Lado: Esquerda) + 2 observações | MP 149, 232, 568: clara graças às observações; resíduo contraditório MP 224-225 | ☰ abre drawer à esquerda | 100 % | — |
| **ARQ-06** Celular: dock não trocado por bottom navigation encostada nas bordas | Dock flutuante | MP 143, 148: "flutuante", sem medida de afastamento | Dock destacado das bordas | 100 % | — |
| **ARQ-07** Desktop: topbar integral fixa, sem sidebar, conteúdo ≤ ≈1200 px | "Topbar integral fixa" (Sem sidebar) | MP 105-118, 126: clara | Header com 100 % da largura, sticky; conteúdo de 1200 px (+32 px de padding); sem sidebar | 100 % | — |
| **ARQ-08** Desktop: header "Praça da Comunidade" A (logo, 4 abas no centro, busca, + Novo, sino, avatar) | Header "Praça da Comunidade" · Composição A | MP 192-203: clara | 7/7 elementos; centro da nav a 57 px do centro da barra (1440) | 100 % | — |
| **ARQ-09** Corte de arquitetura em 768 px | Duas arquiteturas independentes | MP 133, 172, 224 (768) contra MP 180 (600): contraditória, mas 768 domina | 767 = celular; 768 = desktop compacto | 100 % | — |
| **ARQ-10** Mesmos destinos de navegação no desktop e no celular | Sem mecanismo no Studio (LACUNA parcial) | MP 181 contradito por MP 195 e 594 (C4): contraditória | União mapeada: Explorar pela busca, Salvos no menu do avatar, Perfil = "Meu perfil"; Grupos/Eventos/Mensagens no drawer | 100 % | — |
| **ARQ-11** Marca "Conecta" no header e no login | Nome do projeto "Conecta" | MP 8, 194 ("substitua pela marca real"): clara | "Conecta" com monograma "C" | 100 % | — |
| **CEL-01** Topbar com ≈56 px | Layout mobile | MP 146, 207: clara | 57 px (56 + 1 de borda) | 100 % | — |
| **CEL-02** Topbar soma safe-area-inset-top | Layout mobile | MP 146: clara | .header-inner usa env(safe-area-inset-top) | 100 % | — |
| **CEL-03** Faixa de stories com ≈88 px | Layout mobile | MP 147, 160: clara | 89 px | 100 % | — |
| **CEL-04** Dock com ≈64 px | Layout mobile | MP 148, 161: clara | 64 px | 100 % | — |
| **CEL-05** Dock flutuante: afastado das bordas (Studio: 17/17/33 px) | Dock flutuante | MP 148: só "flutuante" (afastamento não exportado) | 12/12/12 px (a 390, 360 e 320) | 100 % | — |
| **CEL-06** Dock arredondado (Studio: raio de 24 px) | Só pelo nome e pela família (LACUNA parcial) | MP 376/597 (raio 20 px da família) + nome MP 644: indireta | 20 px | 100 % | — |
| **CEL-07** Dock respeita safe-area-inset-bottom | Componente Dock | MP 638, 667: clara | .dock usa safe-area-inset-bottom | 100 % | — |
| **CEL-08** Item ativo do dock em pílula tonal + aria-current | Família MM (indicador tonal) | MP 173, 389, 586: clara | Pílula 56×30 #fae7ed, texto #bc2d5f, aria-current="page" | 100 % | — |
| **CEL-09** Drawer com ≈280 px, máx. 85 % | Layout + observação no Drawer | MP 149, 170, 568: clara; resíduo MP 547/563 (360-420 px, 88vw) | 280 px (390 e 360); 272 px a 320 (85 %) | 100 % | — |
| **CEL-10** Drawer em altura total, sobre topbar e dock, com scrim | Layout + Drawer (escurecer fundo: sim) | MP 149, 520: clara | x 0, y 0, altura = viewport; scrim rgba(27,27,31,.5) cobre topbar e dock | 100 % | — |
| **CEL-11** Conteúdo não fica escondido atrás do dock | (regra geral) | MP 661, 667: clara | Último conteúdo termina em 721 px; o dock começa em 768 px | 100 % | — |
| **CEL-12** Sem overflow horizontal de 320 a 767 px | (regra geral) | MP 50, 659: clara | 0 overflow (9 larguras × login + 4 rotas) | 100 % | — |
| **CEL-13** Alvos de toque ≥ 44 × 44 px | (regra geral + família MM) | MP 211, 386, 662: clara | 4 links de autor com 19 px de altura nos cards (a 390); marca com 36×44 a 320 | 75 % | C |
| **CEL-14** Paisagem: stories recolhem; dock com ≈52 px | Layout mobile | MP 171: "recolhem" é ambíguo (esconder ou compactar) | 667×375: stories compactadas para 65 px, sem nomes (NOTES 12); dock 52 px | 100 % | — |
| **CEL-15** Paisagem: barras fixas ≤ 25 % da altura | (regra geral) | MP 668: clara (conflita com 56 + 52 px de MP 146/171 em telas baixas) | Topbar deixa de ser fixa; só o dock de 52 px (14 %) | 100 % | — |
| **CEL-16** Nenhum texto cortado | (regra geral) | MP 660: clara | Prévias de conversa em Mensagens cortadas com reticências de 320 a 430 px | 75 % | C |
| **CEL-17** Inputs ≥ 16 px e ≥ 48 px no celular | Login "Acesso responsivo" | MP 48, 663: clara | 56 px / 16 px | 100 % | — |
| **DESK-01** Header desktop de 60 a 64 px | Header + layout desktop | MP 192/206 (60) contra MP 108/122 (64): contraditória, ambas aceitas | 60 px + 1 de borda | 100 % | — |
| **DESK-02** Header sticky, fundo navBg, borda inferior de 1 px | Header | MP 126, 193, 215: clara | sticky; #fff; borda de 1 px #e6e6e6 | 100 % | — |
| **DESK-03** Sombra suave após 8 px de rolagem | Header | MP 215: clara | none → 0 2px 8px | 100 % | — |
| **DESK-04** Ativo com sublinhado de 2 px primário + aria-current | Header | MP 195, 214, 236: clara | ::after de 2 px #d6336c na base; aria-current | 100 % | — |
| **DESK-05** Busca ≈220 × 36 px, "Buscar…", cresce para 300 px | Header | MP 196, 216: clara | 220×36 → 300 px; lupa; "Buscar…" | 100 % | — |
| **DESK-06** Logo: monograma circular de 32 px + nome | Header | MP 194: clara | Círculo de 32 px + "Conecta" | 100 % | — |
| **DESK-07** 1024-1279 px: espaço de 16 px, busca de 180 px, links visíveis | Header + layout | MP 222 (só compacta) contra MP 131 ("Mais"): ambígua | A 1024 px: busca de 180 px e 4 links visíveis ("Mais" só se não couber) | 100 % | — |
| **DESK-08** 768-1023 px: navegação em ☰/"Menu" com painel de largura total abaixo do header | Header + layout | MP 132, 223: clara | "Menu" abre painel de 768 px abaixo do header; logo, busca e + Novo visíveis | 100 % | — |
| **DESK-09** Sem overflow de 768 a 1920 px | (regra geral) | MP 659: clara | 0 overflow | 100 % | — |
| **DESK-10** Grade de cards reduz colunas; altura pelo conteúdo | Componente Card | MP 417, 419: clara | 3 → 2 → 1 colunas | 100 % | — |
| **PAL-01** Os 44 tokens de cor exportados declarados | Paleta "Comunidade" | MP 246-291 + conecta-tokens.css: clara | 44/44 | 100 % | — |
| **PAL-02** Primária #d6336c nas ações principais | Paleta | MP 248, 381: clara | Entrar, + Novo, Ver publicação, Editar perfil e Sair = #d6336c | 100 % | — |
| **PAL-03** Fundo #fff/#f6f6f6 e texto #1b1b1f | Paleta | MP 257-261: clara | body #fff / #1b1b1f | 100 % | — |
| **PAL-04** Tokens de navegação (navBg/navText/navActive/navActiveText) | Paleta | MP 286-289: clara | inativo #4d4d50; ativo #bc2d5f sobre #fae7ed | 100 % | — |
| **PAL-05** Inter, base 15 px, títulos 650 | Tipografia padrão "Inter + Inter" | MP 297-309 contra MP 382-385 ("Fonte do sistema 500", 14 px): contraditória (C6) | Inter 15 px; h1 650; títulos dos componentes 500 e texto 14 px (leitura da família, D documentado) | 100 % | — |
| **PAL-06** Raios: global 6/8/12 px; componentes 20/12 px | Geometria "Médios (8 px)" + família MM | MP 327-329 e 376-377: duas escalas, sem limite de escopo explícito | Botões dos componentes 20 px; cards 12 px; botões globais 8 px | 100 % | — |
| **PAL-07** Sombra/borda: sem sombra nas superfícies de conteúdo; elevação só no que flutua | Geometria "Contornada / Sem sombra" + família MM | MP 319/323 contra MP 378-379: contraditória (C6) | Cards sem borda e sem sombra; elevação no dock e nos popovers | 100 % | — |
| **PAL-08** Superfície dos componentes tingida (#fef8fa) | Família MM | MP 380, 394: clara | #fef8fa em cards, perfil, drawer e dock | 100 % | — |
| **PAL-09** Foco: anel de 2-3 px em focusRing #d6336c | Estados globais | MP 214, 342, 409: clara | 2 px sólido #d6336c (+ halo de 35 % nos componentes) | 100 % | — |
| **PAL-10** Sem cores fixas espalhadas (tokens centralizados) | (regra geral) | MP 235, 695: clara | 1 literal em JS | 100 % | — |
| **COMP-01** Card: mídia 16/9 → etiqueta → título → texto (3 linhas) → rodapé | Componente Cards "Card de conteúdo do feed" | MP 357: clara | 5/5; mídia 1,78; clamp de 3 linhas | 100 % | — |
| **COMP-02** Card MM: contêiner de 12 px; "Ver publicação" em pílula primária | Componente Cards (MM) | MP 371, 376-381: clara | 12 px; pílula de 20 px #d6336c | 100 % | — |
| **COMP-03** Card com link estendido, sem botões aninhados | Componente Cards | MP 358: clara | ::after do "Ver publicação" (inset 0); 0 aninhamentos | 100 % | — |
| **COMP-04** Perfil: capa → avatar −50 % → nome/cargo → ações → 3 estatísticas → abas | Componente "Perfil do usuário" (MM) | MP 433, 446-448: clara (abas sem rótulos; "Seguir" × "Editar perfil" ambíguo) | 7/7; avatar sobreposto em 46 %; abas Publicações/Mídia/Sobre | 100 % | — |
| **COMP-05** Perfil no celular: centralizado, 3 colunas, ações em largura total | Componente Perfil | MP 490: clara | Centralizado, 3 colunas; ações lado a lado (2 × 159 px), não em largura total | 85 % | C |
| **COMP-06** Drawer: dialog/aria-modal, título "Menu", ✕, corpo rolável, rodapé "Sair da conta" | Componente "Drawer lateral aberto pelo header" | MP 505-519: clara | dialog + aria-modal; "Menu"; ✕; corpo com overflow auto; "Sair da conta" em pílula | 100 % | — |
| **COMP-07** Drawer com configurações, ajuda e conta | Layout mobile | MP 165: clara | Conta + Navegar + Configurações/Ajuda | 100 % | — |
| **COMP-08** Dock na família MM (ícone + rótulo, pílula, elevação) | Componente Dock (MM) | MP 582-599: clara | Ícone + rótulo, pílula, superfície tingida, sombra | 100 % | — |
| **COMP-09** Login: "Entrar", subtítulo, E-mail\|Telefone, campos de 56 px, "Esqueci minha senha" | Login "Acesso responsivo" | MP 25-42: clara | 5/5 | 100 % | — |
| **COMP-10** Login: "Entrar" fixo na base no celular; painel com instruções no desktop | Login "Acesso responsivo" | MP 29-30, 46: clara | Barra fixa na base (12 px); painel de instruções à direita no desktop | 100 % | — |
| **COMP-11** Cadastro na mesma tela: abas, Nome/E-mail/Senha, checklist, termos | Cadastro "mesma tela" | MP 63-72: clara | 5/5 | 100 % | — |
| **COMP-12** Topbar do celular com ☰, marca e busca | Layout mobile + header | MP 146, 224: clara (MP 228/674 pedem também a "ação principal"; MP 224 não a lista) | ☰, marca, busca, "+" e avatar | 100 % | — |
| **INT-01** Ao abrir o drawer, foco em "Fechar" sem rolar a página | Layout mobile | MP 166: clara | Foco em "Fechar menu"; rolagem preservada (1000 → 1000) | 100 % | — |
| **INT-02** Fecha com Esc, scrim e ✕; foco volta ao ☰ | Layout + Drawer | MP 166, 553: clara | Esc, clique e toque no scrim e ✕ fecham; foco volta | 100 % | — |
| **INT-03** Foco preso; fundo inert/aria-hidden | Layout mobile | MP 166, 240: clara | 21/21 Tabs dentro do painel; #app com inert e aria-hidden | 100 % | — |
| **INT-04** Body não rola; drawer com overscroll contain | Layout mobile | MP 167: clara | body overflow hidden; corpo do drawer com overscroll contain | 100 % | — |
| **INT-05** Dock troca destino e item ativo | Componente Dock | MP 173: clara | 4/4; aria-current acompanha | 100 % | — |
| **INT-06** Stories rolam na horizontal; itens focáveis | Layout mobile | MP 147: clara (comportamento do toque não especificado) | Rolagem ok; toque abre visualizador (extra, E) | 100 % | — |
| **INT-07** Card: foco visível no link principal | Componente Cards | MP 407-409: clara | Anel visível | 100 % | — |
| **INT-08** Perfil: abas trocam conteúdo sem recarregar | Componente Perfil | MP 480: clara | Troca sem recarregar | 100 % | — |
| **INT-09** Login: validação, resumo role=alert, erro genérico, aria-pressed, "Entrando…" | Login | MP 38-43: clara | 5/5 | 100 % | — |
| **INT-10** Cadastro: mantém e-mail, ?aba=cadastro, checklist ao digitar | Cadastro | MP 79, 81: clara | 3/3 | 100 % | — |
| **INT-11** Desktop: popover de notificações (320 px) e menu do avatar; Esc e clique fora | Header | MP 217-218, 239: clara | 320 px + "Ver todas"; menu do avatar com "Salvos" a mais (NOTES 2, E); Esc e clique fora fecham | 100 % | — |
| **INT-12** Busca: Esc limpa e tira o foco | Header | MP 216: clara | Esc limpa e tira o foco; Enter → #/explorar?q= | 100 % | — |
| **INT-13** Login de demonstração entra; "Sair" volta ao login | (fluxo) | MP 17: clara | Entra e sai | 100 % | — |
| **INT-14** prefers-reduced-motion respeitado | (regra geral) | MP 671: clara | Presente | 100 % | — |

### Matriz dev-2

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---|---|
| **ARQ-01** Fluxo "Apenas login" (abre direto em Entrar) | Entrada "Apenas login" | MP 17: clara | Abre em Entrar; sem landing | 100 % | — |
| **ARQ-02** Celular: topbar fixa com ☰ à esquerda | Layout mobile "Stories com dock e drawer lateral" | MP 146, 152, 227: clara | sticky top 0; ☰ 44×44 em x=16; some ao rolar para baixo e volta ao subir | 100 % | — |
| **ARQ-03** Celular: faixa de stories logo abaixo da topbar, com rolagem horizontal | Mesmo layout (stories: sim) | MP 147, 156, 232: clara no celular; não diz se a faixa aparece em todas as telas nem se é fixa | Gap 0, overflow-x auto; faixa em todas as telas, rola com a página | 100 % | — |
| **ARQ-04** Celular: dock com Início/Explorar/Salvos/Perfil, sem FAB | Layout + componente "Menu inferior flutuante arredondado (dock)", FAB: não | MP 148, 176, 594-596: clara; resíduo contraditório "navigation bar + FAB" em MP 418/491/564/639 | 4 rótulos exatos; nenhum FAB | 100 % | — |
| **ARQ-05** Celular: drawer esquerdo aberto pelo ☰ da topbar | Layout (drawer-left) + componente Drawer (Lado: Esquerda) + 2 observações | MP 149, 232, 568: clara graças às observações; resíduo contraditório MP 224-225 | ☰ abre drawer à esquerda | 100 % | — |
| **ARQ-06** Celular: dock não trocado por bottom navigation encostada nas bordas | Dock flutuante | MP 143, 148: "flutuante", sem medida de afastamento | Dock destacado das bordas | 100 % | — |
| **ARQ-07** Desktop: topbar integral fixa, sem sidebar, conteúdo ≤ ≈1200 px | "Topbar integral fixa" (Sem sidebar) | MP 105-118, 126: clara | Header com 100 % da largura, sticky; conteúdo de 1200 px; sem sidebar | 100 % | — |
| **ARQ-08** Desktop: header "Praça da Comunidade" A (logo, 4 abas no centro, busca, + Novo, sino, avatar) | Header "Praça da Comunidade" · Composição A | MP 192-203: clara | 7/7 + item "Mais" permanente; nav deslocada 166 px à esquerda do centro (1440 e 1920). NOTES 3 alega falta de espaço, mas a 1440 px cabe (dev-1) | 85 % | C |
| **ARQ-09** Corte de arquitetura em 768 px | Duas arquiteturas independentes | MP 133, 172, 224 (768) contra MP 180 (600): contraditória, mas 768 domina | 767 = celular; 768 = desktop compacto | 100 % | — |
| **ARQ-10** Mesmos destinos de navegação no desktop e no celular | Sem mecanismo no Studio (LACUNA parcial) | MP 181 contradito por MP 195 e 594 (C4): contraditória | Explorar e Salvos no menu "Mais", Perfil = "Meu perfil"; Grupos/Eventos/Mensagens no drawer | 100 % | — |
| **ARQ-11** Marca "Conecta" no header e no login | Nome do projeto "Conecta" | MP 8, 194 ("substitua pela marca real"): clara | "Conecta" com monograma "C" | 100 % | — |
| **CEL-01** Topbar com ≈56 px | Layout mobile | MP 146, 207: clara | 56 px | 100 % | — |
| **CEL-02** Topbar soma safe-area-inset-top | Layout mobile | MP 146: clara | .site-header usa env(safe-area-inset-top) | 100 % | — |
| **CEL-03** Faixa de stories com ≈88 px | Layout mobile | MP 147, 160: clara | 100 px no contêiner; lista de 88 px | 100 % | — |
| **CEL-04** Dock com ≈64 px | Layout mobile | MP 148, 161: clara | 64 px | 100 % | — |
| **CEL-05** Dock flutuante: afastado das bordas (Studio: 17/17/33 px) | Dock flutuante | MP 148: só "flutuante" (afastamento não exportado) | 16/16/12 px | 100 % | — |
| **CEL-06** Dock arredondado (Studio: raio de 24 px) | Só pelo nome e pela família (LACUNA parcial) | MP 376/597 (raio 20 px da família) + nome MP 644: indireta | 999 px (cápsula) | 100 % | — |
| **CEL-07** Dock respeita safe-area-inset-bottom | Componente Dock | MP 638, 667: clara | .dock usa safe-area-inset-bottom | 100 % | — |
| **CEL-08** Item ativo do dock em pílula tonal + aria-current | Família MM (indicador tonal) | MP 173, 389, 586: clara | O item inteiro vira pílula #fae7ed / #bc2d5f; aria-current | 100 % | — |
| **CEL-09** Drawer com ≈280 px, máx. 85 % | Layout + observação no Drawer | MP 149, 170, 568: clara; resíduo MP 547/563 (360-420 px, 88vw) | 280 px (390 e 360); 272 px a 320 (85 %) | 100 % | — |
| **CEL-10** Drawer em altura total, sobre topbar e dock, com scrim | Layout + Drawer (escurecer fundo: sim) | MP 149, 520: clara | x 0, y 0, altura = viewport; scrim .5 cobre topbar e dock | 100 % | — |
| **CEL-11** Conteúdo não fica escondido atrás do dock | (regra geral) | MP 661, 667: clara | Último conteúdo termina em 728 px; o dock começa em 768 px | 100 % | — |
| **CEL-12** Sem overflow horizontal de 320 a 767 px | (regra geral) | MP 50, 659: clara | 0 overflow (9 larguras × login + 4 rotas) | 100 % | — |
| **CEL-13** Alvos de toque ≥ 44 × 44 px | (regra geral + família MM) | MP 211, 386, 662: clara | 0 alvos pequenos a 390 px (marca com 32×44 só a 320/344) | 100 % | — |
| **CEL-14** Paisagem: stories recolhem; dock com ≈52 px | Layout mobile | MP 171: "recolhem" é ambíguo (esconder ou compactar) | 667×375: stories ocultas; dock 52 px | 100 % | — |
| **CEL-15** Paisagem: barras fixas ≤ 25 % da altura | (regra geral) | MP 668: clara (conflita com 56 + 52 px de MP 146/171 em telas baixas) | Topbar static; só o dock de 52 px (14 %) | 100 % | — |
| **CEL-16** Nenhum texto cortado | (regra geral) | MP 660: clara | Descrições de conversa (list-card__desc) cortadas com reticências de 320 a 480 px | 75 % | C |
| **CEL-17** Inputs ≥ 16 px e ≥ 48 px no celular | Login "Acesso responsivo" | MP 48, 663: clara | 56 px / 16 px | 100 % | — |
| **DESK-01** Header desktop de 60 a 64 px | Header + layout desktop | MP 192/206 (60) contra MP 108/122 (64): contraditória, ambas aceitas | 64 px | 100 % | — |
| **DESK-02** Header sticky, fundo navBg, borda inferior de 1 px | Header | MP 126, 193, 215: clara | sticky; #fff; borda de 1 px #e6e6e6 | 100 % | — |
| **DESK-03** Sombra suave após 8 px de rolagem | Header | MP 215: clara | none → 0 2px 8px | 100 % | — |
| **DESK-04** Ativo com sublinhado de 2 px primário + aria-current | Header | MP 195, 214, 236: clara | ::after de 2 px #d6336c na base; aria-current | 100 % | — |
| **DESK-05** Busca ≈220 × 36 px, "Buscar…", cresce para 300 px | Header | MP 196, 216: clara | 220×36 → 300 px | 100 % | — |
| **DESK-06** Logo: monograma circular de 32 px + nome | Header | MP 194: clara | Círculo de 32 px + "Conecta" | 100 % | — |
| **DESK-07** 1024-1279 px: espaço de 16 px, busca de 180 px, links visíveis | Header + layout | MP 222 (só compacta) contra MP 131 ("Mais"): ambígua | A 1024 px "Eventos" vai para "Mais" (o "Mais" fixo com Explorar/Salvos ocupa espaço) | 75 % | B |
| **DESK-08** 768-1023 px: navegação em ☰/"Menu" com painel de largura total abaixo do header | Header + layout | MP 132, 223: clara | "Menu" abre painel de largura total em y=64 (não trava a rolagem do body: observação) | 100 % | — |
| **DESK-09** Sem overflow de 768 a 1920 px | (regra geral) | MP 659: clara | 0 overflow | 100 % | — |
| **DESK-10** Grade de cards reduz colunas; altura pelo conteúdo | Componente Card | MP 417, 419: clara | 3 → 2 → 1 colunas | 100 % | — |
| **PAL-01** Os 44 tokens de cor exportados declarados | Paleta "Comunidade" | MP 246-291 + conecta-tokens.css: clara | 44/44 | 100 % | — |
| **PAL-02** Primária #d6336c nas ações principais | Paleta | MP 248, 381: clara | Entrar, + Novo, Ver publicação, Editar perfil e Sair = #d6336c | 100 % | — |
| **PAL-03** Fundo #fff/#f6f6f6 e texto #1b1b1f | Paleta | MP 257-261: clara | body #f6f6f6 (bgAlt, E) / #1b1b1f | 100 % | — |
| **PAL-04** Tokens de navegação (navBg/navText/navActive/navActiveText) | Paleta | MP 286-289: clara | inativo #4d4d50; ativo #bc2d5f sobre #fae7ed | 100 % | — |
| **PAL-05** Inter, base 15 px, títulos 650 | Tipografia padrão "Inter + Inter" | MP 297-309 contra MP 382-385 ("Fonte do sistema 500", 14 px): contraditória (C6) | Inter 15 px; títulos 650 também nos cards (leitura global, D documentado) | 100 % | — |
| **PAL-06** Raios: global 6/8/12 px; componentes 20/12 px | Geometria "Médios (8 px)" + família MM | MP 327-329 e 376-377: duas escalas, sem limite de escopo explícito | Botões dos componentes 20 px; cards 12 px; botões globais 8 px | 100 % | — |
| **PAL-07** Sombra/borda: sem sombra nas superfícies de conteúdo; elevação só no que flutua | Geometria "Contornada / Sem sombra" + família MM | MP 319/323 contra MP 378-379: contraditória (C6) | Cards sem borda e sem sombra; elevação no dock, no drawer e nos popovers | 100 % | — |
| **PAL-08** Superfície dos componentes tingida (#fef8fa) | Família MM | MP 380, 394: clara | #fef8fa em cards, perfil e drawer; dock ≈#fbeff3 | 100 % | — |
| **PAL-09** Foco: anel de 2-3 px em focusRing #d6336c | Estados globais | MP 214, 342, 409: clara | 2 px sólido #d6336c + halo | 100 % | — |
| **PAL-10** Sem cores fixas espalhadas (tokens centralizados) | (regra geral) | MP 235, 695: clara | 0 literais fora de :root | 100 % | — |
| **COMP-01** Card: mídia 16/9 → etiqueta → título → texto (3 linhas) → rodapé | Componente Cards "Card de conteúdo do feed" | MP 357: clara | 5/5; mídia 1,78; clamp de 3 linhas | 100 % | — |
| **COMP-02** Card MM: contêiner de 12 px; "Ver publicação" em pílula primária | Componente Cards (MM) | MP 371, 376-381: clara | 12 px; pílula de 20 px #d6336c | 100 % | — |
| **COMP-03** Card com link estendido, sem botões aninhados | Componente Cards | MP 358: clara | ::after do "Ver publicação"; botão Salvar irmão acima (z-index); 0 aninhamentos | 100 % | — |
| **COMP-04** Perfil: capa → avatar −50 % → nome/cargo → ações → 3 estatísticas → abas | Componente "Perfil do usuário" (MM) | MP 433, 446-448: clara (abas sem rótulos; "Seguir" × "Editar perfil" ambíguo) | 7/7; avatar sobreposto em 50 %; abas Publicações/Fotos/Sobre | 100 % | — |
| **COMP-05** Perfil no celular: centralizado, 3 colunas, ações em largura total | Componente Perfil | MP 490: clara | Centralizado; 3 colunas; ações com 326 px (largura total) | 100 % | — |
| **COMP-06** Drawer: dialog/aria-modal, título "Menu", ✕, corpo rolável, rodapé "Sair da conta" | Componente "Drawer lateral aberto pelo header" | MP 505-519: clara | dialog + aria-modal; "Menu"; ✕; corpo com overflow auto; "Sair da conta" em pílula | 100 % | — |
| **COMP-07** Drawer com configurações, ajuda e conta | Layout mobile | MP 165: clara | Conta + Comunidade + Meu perfil/Configurações/Ajuda | 100 % | — |
| **COMP-08** Dock na família MM (ícone + rótulo, pílula, elevação) | Componente Dock (MM) | MP 582-599: clara | Ícone + rótulo, pílula, superfície tingida, sombra | 100 % | — |
| **COMP-09** Login: "Entrar", subtítulo, E-mail\|Telefone, campos de 56 px, "Esqueci minha senha" | Login "Acesso responsivo" | MP 25-42: clara | 5/5 | 100 % | — |
| **COMP-10** Login: "Entrar" fixo na base no celular; painel com instruções no desktop | Login "Acesso responsivo" | MP 29-30, 46: clara | Sticky na base; painel de passos à direita no desktop | 100 % | — |
| **COMP-11** Cadastro na mesma tela: abas, Nome/E-mail/Senha, checklist, termos | Cadastro "mesma tela" | MP 63-72: clara | 5/5 | 100 % | — |
| **COMP-12** Topbar do celular com ☰, marca e busca | Layout mobile + header | MP 146, 224: clara (MP 228/674 pedem também a "ação principal"; MP 224 não a lista) | ☰, marca, busca, "+" e avatar | 100 % | — |
| **INT-01** Ao abrir o drawer, foco em "Fechar" sem rolar a página | Layout mobile | MP 166: clara | Foco em "Fechar menu"; rolagem preservada (1000 → 1000) | 100 % | — |
| **INT-02** Fecha com Esc, scrim e ✕; foco volta ao ☰ | Layout + Drawer | MP 166, 553: clara | Esc, clique e toque no scrim e ✕ fecham; foco volta | 100 % | — |
| **INT-03** Foco preso; fundo inert/aria-hidden | Layout mobile | MP 166, 240: clara | 21/21; #shell com inert e aria-hidden | 100 % | — |
| **INT-04** Body não rola; drawer com overscroll contain | Layout mobile | MP 167: clara | html overflow hidden (equivalente); overscroll contain | 100 % | — |
| **INT-05** Dock troca destino e item ativo | Componente Dock | MP 173: clara | 4/4; aria-current acompanha | 100 % | — |
| **INT-06** Stories rolam na horizontal; itens focáveis | Layout mobile | MP 147: clara (comportamento do toque não especificado) | Rolagem ok; visualizador com progresso e pausa (extra, E) | 100 % | — |
| **INT-07** Card: foco visível no link principal | Componente Cards | MP 407-409: clara | Anel visível | 100 % | — |
| **INT-08** Perfil: abas trocam conteúdo sem recarregar | Componente Perfil | MP 480: clara | Troca sem recarregar | 100 % | — |
| **INT-09** Login: validação, resumo role=alert, erro genérico, aria-pressed, "Entrando…" | Login | MP 38-43: clara | 5/5 | 100 % | — |
| **INT-10** Cadastro: mantém e-mail, ?aba=cadastro, checklist ao digitar | Cadastro | MP 79, 81: clara | 3/3 | 100 % | — |
| **INT-11** Desktop: popover de notificações (320 px) e menu do avatar; Esc e clique fora | Header | MP 217-218, 239: clara | 320 px + "Ver todas"; menu do avatar com os itens pedidos; Esc e clique fora fecham | 100 % | — |
| **INT-12** Busca: Esc limpa e tira o foco | Header | MP 216: clara | Esc limpa e tira o foco; Enter → #/explorar?q= | 100 % | — |
| **INT-13** Login de demonstração entra; "Sair" volta ao login | (fluxo) | MP 17: clara | Entra e sai | 100 % | — |
| **INT-14** prefers-reduced-motion respeitado | (regra geral) | MP 671: clara | Presente | 100 % | — |

### Matriz dev-3

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---|---|
| **ARQ-01** Fluxo "Apenas login" (abre direto em Entrar) | Entrada "Apenas login" | MP 17: clara | Abre em Entrar; sem landing | 100 % | — |
| **ARQ-02** Celular: topbar fixa com ☰ à esquerda | Layout mobile "Stories com dock e drawer lateral" | MP 146, 152, 227: clara | sticky top 0; ☰ 44×44 em x=8; sempre visível | 100 % | — |
| **ARQ-03** Celular: faixa de stories logo abaixo da topbar, com rolagem horizontal | Mesmo layout (stories: sim) | MP 147, 156, 232: clara no celular; não diz se a faixa aparece em todas as telas nem se é fixa | Gap 0, overflow-x auto, 5 stories; fixa dentro do header em todas as telas | 100 % | — |
| **ARQ-04** Celular: dock com Início/Explorar/Salvos/Perfil, sem FAB | Layout + componente "Menu inferior flutuante arredondado (dock)", FAB: não | MP 148, 176, 594-596: clara; resíduo contraditório "navigation bar + FAB" em MP 418/491/564/639 | 4 rótulos exatos; nenhum FAB | 100 % | — |
| **ARQ-05** Celular: drawer esquerdo aberto pelo ☰ da topbar | Layout (drawer-left) + componente Drawer (Lado: Esquerda) + 2 observações | MP 149, 232, 568: clara graças às observações; resíduo contraditório MP 224-225 | ☰ abre drawer à esquerda | 100 % | — |
| **ARQ-06** Celular: dock não trocado por bottom navigation encostada nas bordas | Dock flutuante | MP 143, 148: "flutuante", sem medida de afastamento | Dock destacado das bordas | 100 % | — |
| **ARQ-07** Desktop: topbar integral fixa, sem sidebar, conteúdo ≤ ≈1200 px | "Topbar integral fixa" (Sem sidebar) | MP 105-118, 126: clara | Barra de 1200 px centralizada; conteúdo de 1200 px; sem sidebar | 100 % | — |
| **ARQ-08** Desktop: header "Praça da Comunidade" A (logo, 4 abas no centro, busca, + Novo, sino, avatar) | Header "Praça da Comunidade" · Composição A | MP 192-203: clara | 7/7; nav deslocada 161 px à esquerda do centro (grid auto 1fr auto; NOTES 13) | 85 % | C |
| **ARQ-09** Corte de arquitetura em 768 px | Duas arquiteturas independentes | MP 133, 172, 224 (768) contra MP 180 (600): contraditória, mas 768 domina | 767 = celular; 768 = desktop compacto | 100 % | — |
| **ARQ-10** Mesmos destinos de navegação no desktop e no celular | Sem mecanismo no Studio (LACUNA parcial) | MP 181 contradito por MP 195 e 594 (C4): contraditória | Manteve as listas (NOTES 2): no desktop não há link para Salvos, Explorar (só a busca → #/busca) nem Conta | 60 % | B |
| **ARQ-11** Marca "Conecta" no header e no login | Nome do projeto "Conecta" | MP 8, 194 ("substitua pela marca real"): clara | "Conecta" com monograma "C" | 100 % | — |
| **CEL-01** Topbar com ≈56 px | Layout mobile | MP 146, 207: clara | 56 px | 100 % | — |
| **CEL-02** Topbar soma safe-area-inset-top | Layout mobile | MP 146: clara | .topo-movel usa env(safe-area-inset-top) | 100 % | — |
| **CEL-03** Faixa de stories com ≈88 px | Layout mobile | MP 147, 160: clara | 88 px | 100 % | — |
| **CEL-04** Dock com ≈64 px | Layout mobile | MP 148, 161: clara | 64 px | 100 % | — |
| **CEL-05** Dock flutuante: afastado das bordas (Studio: 17/17/33 px) | Dock flutuante | MP 148: só "flutuante" (afastamento não exportado) | 12/12/12 px (a 390, 360 e 320) | 100 % | — |
| **CEL-06** Dock arredondado (Studio: raio de 24 px) | Só pelo nome e pela família (LACUNA parcial) | MP 376/597 (raio 20 px da família) + nome MP 644: indireta | 20 px | 100 % | — |
| **CEL-07** Dock respeita safe-area-inset-bottom | Componente Dock | MP 638, 667: clara | .dock usa safe-area-inset-bottom | 100 % | — |
| **CEL-08** Item ativo do dock em pílula tonal + aria-current | Família MM (indicador tonal) | MP 173, 389, 586: clara | Pílula 56×30 #fae7ed, texto #bc2d5f, aria-current | 100 % | — |
| **CEL-09** Drawer com ≈280 px, máx. 85 % | Layout + observação no Drawer | MP 149, 170, 568: clara; resíduo MP 547/563 (360-420 px, 88vw) | 280 px (390 e 360); 272 px a 320 (85 %) | 100 % | — |
| **CEL-10** Drawer em altura total, sobre topbar e dock, com scrim | Layout + Drawer (escurecer fundo: sim) | MP 149, 520: clara | x 0, y 0, altura = viewport; scrim .4 cobre topbar e dock | 100 % | — |
| **CEL-11** Conteúdo não fica escondido atrás do dock | (regra geral) | MP 661, 667: clara | Último conteúdo termina em 733 px; o dock começa em 768 px | 100 % | — |
| **CEL-12** Sem overflow horizontal de 320 a 767 px | (regra geral) | MP 50, 659: clara | 0 overflow (9 larguras × login + 4 rotas) | 100 % | — |
| **CEL-13** Alvos de toque ≥ 44 × 44 px | (regra geral + família MM) | MP 211, 386, 662: clara | "Ver publicação" e "Editar perfil" com 40 px, marca 32 px, links de título/autor com 16-21 px, "Ver perfil" 40 px: mais de 6 alvos | 50 % | C |
| **CEL-14** Paisagem: stories recolhem; dock com ≈52 px | Layout mobile | MP 171: "recolhem" é ambíguo (esconder ou compactar) | 667×375: stories continuam com 88 px (a regra prometida no CSS e no NOTES 8 não existe); dock 52 px | 50 % | C |
| **CEL-15** Paisagem: barras fixas ≤ 25 % da altura | (regra geral) | MP 668: clara (conflita com 56 + 52 px de MP 146/171 em telas baixas) | Header fixo de 136 px (48 + 88) + dock de 52 px = 188 px = 50 % da altura | 25 % | C |
| **CEL-16** Nenhum texto cortado | (regra geral) | MP 660: clara | Nenhum corte | 100 % | — |
| **CEL-17** Inputs ≥ 16 px e ≥ 48 px no celular | Login "Acesso responsivo" | MP 48, 663: clara | 56 px / 16 px | 100 % | — |
| **DESK-01** Header desktop de 60 a 64 px | Header + layout desktop | MP 192/206 (60) contra MP 108/122 (64): contraditória, ambas aceitas | 64 px + 1 de borda | 100 % | — |
| **DESK-02** Header sticky, fundo navBg, borda inferior de 1 px | Header | MP 126, 193, 215: clara | sticky; #fff; borda de 1 px #e6e6e6 | 100 % | — |
| **DESK-03** Sombra suave após 8 px de rolagem | Header | MP 215: clara | none → 0 2px 8px | 100 % | — |
| **DESK-04** Ativo com sublinhado de 2 px primário + aria-current | Header | MP 195, 214, 236: clara | ::after de 2 px #d6336c na base; aria-current | 100 % | — |
| **DESK-05** Busca ≈220 × 36 px, "Buscar…", cresce para 300 px | Header | MP 196, 216: clara | Campo de 220 px (input 166×34) → 300 px | 100 % | — |
| **DESK-06** Logo: monograma circular de 32 px + nome | Header | MP 194: clara | Círculo de 32 px + "Conecta" | 100 % | — |
| **DESK-07** 1024-1279 px: espaço de 16 px, busca de 180 px, links visíveis | Header + layout | MP 222 (só compacta) contra MP 131 ("Mais"): ambígua | A 1024 px: busca de 180 px; 4 links visíveis; sem "Mais" | 100 % | — |
| **DESK-08** 768-1023 px: navegação em ☰/"Menu" com painel de largura total abaixo do header | Header + layout | MP 132, 223: clara | ☰ à direita abre painel de largura total em y=64 | 100 % | — |
| **DESK-09** Sem overflow de 768 a 1920 px | (regra geral) | MP 659: clara | 0 overflow | 100 % | — |
| **DESK-10** Grade de cards reduz colunas; altura pelo conteúdo | Componente Card | MP 417, 419: clara | 3 → 2 → 1 colunas | 100 % | — |
| **PAL-01** Os 44 tokens de cor exportados declarados | Paleta "Comunidade" | MP 246-291 + conecta-tokens.css: clara | 44/44 | 100 % | — |
| **PAL-02** Primária #d6336c nas ações principais | Paleta | MP 248, 381: clara | Entrar, + Novo, Ver publicação, Editar perfil e Sair = #d6336c | 100 % | — |
| **PAL-03** Fundo #fff/#f6f6f6 e texto #1b1b1f | Paleta | MP 257-261: clara | body #fff / #1b1b1f | 100 % | — |
| **PAL-04** Tokens de navegação (navBg/navText/navActive/navActiveText) | Paleta | MP 286-289: clara | inativo #4d4d50; ativo #bc2d5f sobre #fae7ed | 100 % | — |
| **PAL-05** Inter, base 15 px, títulos 650 | Tipografia padrão "Inter + Inter" | MP 297-309 contra MP 382-385 ("Fonte do sistema 500", 14 px): contraditória (C6) | Inter 15 px; h1 650; títulos dos componentes 500 e texto 14 px (D documentado) | 100 % | — |
| **PAL-06** Raios: global 6/8/12 px; componentes 20/12 px | Geometria "Médios (8 px)" + família MM | MP 327-329 e 376-377: duas escalas, sem limite de escopo explícito | Pílula de 20 px também nos botões globais (Entrar, + Novo), contra os 8 px da geometria global | 75 % | D |
| **PAL-07** Sombra/borda: sem sombra nas superfícies de conteúdo; elevação só no que flutua | Geometria "Contornada / Sem sombra" + família MM | MP 319/323 contra MP 378-379: contraditória (C6) | Cards sem borda e sem sombra; elevação no dock e nos popovers | 100 % | — |
| **PAL-08** Superfície dos componentes tingida (#fef8fa) | Família MM | MP 380, 394: clara | Cards, drawer e dock em #fef8fa; perfil sem contêiner tingido (fundo transparente) | 75 % | C |
| **PAL-09** Foco: anel de 2-3 px em focusRing #d6336c | Estados globais | MP 214, 342, 409: clara | 2 px sólido #d6336c + halo | 100 % | — |
| **PAL-10** Sem cores fixas espalhadas (tokens centralizados) | (regra geral) | MP 235, 695: clara | 11 rgba() fixos fora de :root (sombras, scrim, halo de foco) | 75 % | C |
| **COMP-01** Card: mídia 16/9 → etiqueta → título → texto (3 linhas) → rodapé | Componente Cards "Card de conteúdo do feed" | MP 357: clara | 5/5; mídia 1,78; clamp de 3 linhas; textos de exemplo repetidos em todos os cards (NOTES 10) | 100 % | — |
| **COMP-02** Card MM: contêiner de 12 px; "Ver publicação" em pílula primária | Componente Cards (MM) | MP 371, 376-381: clara | 12 px; pílula de 20 px #d6336c | 100 % | — |
| **COMP-03** Card com link estendido, sem botões aninhados | Componente Cards | MP 358: clara | ::after no link do título; 0 aninhamentos | 100 % | — |
| **COMP-04** Perfil: capa → avatar −50 % → nome/cargo → ações → 3 estatísticas → abas | Componente "Perfil do usuário" (MM) | MP 433, 446-448: clara (abas sem rótulos; "Seguir" × "Editar perfil" ambíguo) | Avatar sobreposto em só 33 %; abas sublinhadas em vez de pílula tonal; abas Publicações/Sobre | 85 % | C |
| **COMP-05** Perfil no celular: centralizado, 3 colunas, ações em largura total | Componente Perfil | MP 490: clara | Centralizado; 3 colunas; ação com 358 px (largura total) | 100 % | — |
| **COMP-06** Drawer: dialog/aria-modal, título "Menu", ✕, corpo rolável, rodapé "Sair da conta" | Componente "Drawer lateral aberto pelo header" | MP 505-519: clara | dialog + aria-modal; "Menu"; ✕; corpo com overflow auto; "Sair da conta" em pílula | 100 % | — |
| **COMP-07** Drawer com configurações, ajuda e conta | Layout mobile | MP 165: clara | Grupos, Eventos, Mensagens, Notificações, Configurações, Ajuda, Conta | 100 % | — |
| **COMP-08** Dock na família MM (ícone + rótulo, pílula, elevação) | Componente Dock (MM) | MP 582-599: clara | Ícone + rótulo, pílula, superfície tingida, sombra | 100 % | — |
| **COMP-09** Login: "Entrar", subtítulo, E-mail\|Telefone, campos de 56 px, "Esqueci minha senha" | Login "Acesso responsivo" | MP 25-42: clara | 5/5 | 100 % | — |
| **COMP-10** Login: "Entrar" fixo na base no celular; painel com instruções no desktop | Login "Acesso responsivo" | MP 29-30, 46: clara | Fixo na base; instruções à esquerda no desktop | 100 % | — |
| **COMP-11** Cadastro na mesma tela: abas, Nome/E-mail/Senha, checklist, termos | Cadastro "mesma tela" | MP 63-72: clara | 5/5 + etapa de código de confirmação (extra, E) | 100 % | — |
| **COMP-12** Topbar do celular com ☰, marca e busca | Layout mobile + header | MP 146, 224: clara (MP 228/674 pedem também a "ação principal"; MP 224 não a lista) | ☰, marca, busca, avatar (sem ação principal: observação B) | 100 % | — |
| **INT-01** Ao abrir o drawer, foco em "Fechar" sem rolar a página | Layout mobile | MP 166: clara | Foco em "Fechar menu"; rolagem preservada (1000 → 1000) | 100 % | — |
| **INT-02** Fecha com Esc, scrim e ✕; foco volta ao ☰ | Layout + Drawer | MP 166, 553: clara | Esc, clique e toque no scrim e ✕ fecham; foco volta | 100 % | — |
| **INT-03** Foco preso; fundo inert/aria-hidden | Layout mobile | MP 166, 240: clara | 21/21; #app com inert e aria-hidden | 100 % | — |
| **INT-04** Body não rola; drawer com overscroll contain | Layout mobile | MP 167: clara | body overflow hidden; corpo do drawer com overscroll contain | 100 % | — |
| **INT-05** Dock troca destino e item ativo | Componente Dock | MP 173: clara | 4/4; aria-current acompanha | 100 % | — |
| **INT-06** Stories rolam na horizontal; itens focáveis | Layout mobile | MP 147: clara (comportamento do toque não especificado) | overflow-x auto com 5 stories (10 px de excesso); focáveis; toque abre o perfil (não especificado, E) | 100 % | — |
| **INT-07** Card: foco visível no link principal | Componente Cards | MP 407-409: clara | Anel visível | 100 % | — |
| **INT-08** Perfil: abas trocam conteúdo sem recarregar | Componente Perfil | MP 480: clara | Troca sem recarregar | 100 % | — |
| **INT-09** Login: validação, resumo role=alert, erro genérico, aria-pressed, "Entrando…" | Login | MP 38-43: clara | 5/5 | 100 % | — |
| **INT-10** Cadastro: mantém e-mail, ?aba=cadastro, checklist ao digitar | Cadastro | MP 79, 81: clara | 3/3 | 100 % | — |
| **INT-11** Desktop: popover de notificações (320 px) e menu do avatar; Esc e clique fora | Header | MP 217-218, 239: clara | 320 px + "Ver todas"; menu do avatar com os itens pedidos; Esc e clique fora fecham | 100 % | — |
| **INT-12** Busca: Esc limpa e tira o foco | Header | MP 216: clara | Esc limpa e tira o foco; Enter → #/busca?q= | 100 % | — |
| **INT-13** Login de demonstração entra; "Sair" volta ao login | (fluxo) | MP 17: clara | Entra e sai | 100 % | — |
| **INT-14** prefers-reduced-motion respeitado | (regra geral) | MP 671: clara | Presente | 100 % | — |
