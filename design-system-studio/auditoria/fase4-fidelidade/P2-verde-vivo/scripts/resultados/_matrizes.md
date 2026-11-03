
### Matriz — dev-1

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---:|:---:|
| **ARQ-01** Sem login / sem área restrita | “Landing page sem login” | L17–18 (contradito por L167/L191: avatar com “Sair”) | Sem login; avatar com perfil fictício marcado como demonstração | 100% | E |
| **ARQ-02** Ordem das 7 seções da Folha Viva | Folha Viva (Composição assimétrica) | L28/L41: ordem explícita | Header → hero → cartões → citação → texto+imagem → chamada → rodapé (7/7) | 100% | — |
| **ARQ-03** Layout desktop de 2 linhas, sem sidebar | Navegação superior de duas linhas | L19, L71–85 × L29 (header leve da landing) | 2 linhas em todas as páginas | 100% | — |
| **ARQ-04** Arquitetura mobile: header+busca, faixa, dock | Header fixo com busca e menu inferior flutuante | L19, L112–118, L149 × L58 (hambúrguer da landing) | Presente na landing e no catálogo | 100% | — |
| **ARQ-05** Troca de arquitetura em 768 px | Desktop e mobile independentes | L102, L141 (L150 abre exceção 600–1023) | Mobile até 767, desktop a partir de 768 | 100% | — |
| **ARQ-06** Catálogo com cards, busca e filtros | Tipo “Loja ou catálogo” + template de vitrine | L11–12 (lista de funcionalidades) | Rota #/catalogo, 30 produtos, busca e filtros ligados | 100% | — |
| **ARQ-07** Partes ★ do template: Categorias (4 blocos) e Vitrine (4 col., selo, preço, parcelamento, filtrar/ordenar) | Template “E-commerce de moda”, partes Cabeçalho/Categorias/Vitrine | L629–642, L635 × L28 (ordem fechada da landing) × L390 (3→2→1) | Sem blocos de categoria; 3 colunas; selo, preço, parcelamento e filtrar/ordenar OK (4/6) | 67% | B |
| **ARQ-08** Conteúdo fictício substituído | Marcas de exemplo da landing, do header e do template | L64, L164, L702 (“substitua”) × L29 (logotipo “Folha Viva”) | Nenhuma marca ou item de exemplo | 100% | — |
| **ARQ-09** Marca “Verde Vivo” no logo e no rodapé | Nome do projeto “Verde Vivo” | L8, L64 | Em todas as páginas | 100% | — |
| **ARQ-10** Inspiração botânica (Verdant): editorial, serifa, vetores, respiro [J] | Verdant Atelier, paleta global prevalece | L552–620, L759 | Ilustrações SVG variadas por espécie, arco no hero, serifa grande | 100% | — |
| **DSK-01** Hero assimétrico (título col. 1–8, itálico accent, imagem alta 440/+80, imagem sobreposta, CTA link) | Prévia Folha Viva | L30–35, L45–46 | Título de 803 px e 80 px; itálico #b07d4f; imagem 440 px, mas começa 44 px abaixo do título (pede ≈80) (4,5/5) | 90% | C |
| **DSK-02** Cartões escalonados 0/48/96 px | Prévia Folha Viva | L35, L47 | 0/48/96 | 100% | — |
| **DSK-03** Citação recuada ≈25%, autor à direita | Prévia Folha Viva | L36 | Recuo de 25%, autor à direita | 100% | — |
| **DSK-04** Imagem sangrando até a borda direita | Prévia Folha Viva | L37 | Borda direita = 1440 | 100% | — |
| **DSK-05** Chamada final alinhada à esquerda | Prévia Folha Viva | L28 | À esquerda | 100% | — |
| **DSK-06** Faixa de anúncio de 36 px (primary/onPrimary, link, ✕) | Mega Empório | L168, L183 | 36 px, #2d6a4f/#fff, link e ✕ | 100% | — |
| **DSK-07** Linha 1: 64 px, logo 28 px, busca larga 42 px, endereço, avatar, carrinho | Mega Empório, composição A | L74–75, L162–167 | 64 px; logo 28 px #2d6a4f + nome em 700; busca 560×42; endereço com CEP; avatar; carrinho (6/6) | 100% | — |
| **DSK-08** Linha 2: 44 px, “Departamentos” + atalhos à esquerda, ativo em text/600 | Mega Empório, composição A | L76, L165, L174 × L211 | 44 px; Departamentos; à esquerda; ativo em #1b2e24 peso 600 com aria-current | 100% | — |
| **DSK-09** Header sticky (z 40) com sombra após 8 px | Mega Empório | L189 | Sticky, z 40, sombra ao rolar | 100% | — |
| **DSK-10** Conteúdo com largura máx. ≈1280 (ou 1120) | Layout de duas linhas | L74/L91 × L630 | 1280 (1216 úteis) | 100% | — |
| **DSK-11** 1024–1279: excedentes em “Mais” | Layout + Mega Empório | L100 × L196 | “Mais ▾” em 1024 | 100% | — |
| **DSK-12** 768–1023: desktop compactado sem overflow | Layout + Mega Empório | L101 × L197 × L150 (3 instruções diferentes) | 5 itens cabem; sem ☰ | 100% | — |
| **DSK-13** Vitrine em 4 colunas no desktop | Template, parte Vitrine | L635 × L390 (card 3→2→1) | 3 colunas | 75% | B |
| **MOB-01** Header fixo ≈104 px (marca + busca em largura total) com safe-area | Header fixo com busca… | L115 (× L198/L202, 56+48) | Sticky 56+48 = 104 px; busca 358 px; safe-area-inset-top | 100% | — |
| **MOB-02** Busca com fonte de 16 px que abre a tela de sugestões | Header fixo com busca… | L134, L469, L721 | 16 px; abre busca em tela cheia com Recentes/Sugestões | 100% | — |
| **MOB-03** Faixa de categorias ≈52 px (pílulas com ícone, scroll-snap, ativa) | Header fixo com busca… | L116 | 52 px, snap por proximidade, ícone + rótulo, ativa em primarySoft | 100% | — |
| **MOB-04** Dock flutuante: 64 px, margens de 16, raio 22, 4 destinos, safe-area | Header fixo com busca… | L117, L725 | 64 px, 16/16/16, 22 px, 4 itens | 100% | — |
| **MOB-05** Item ativo do dock: cor + indicador + ícone preenchido + aria-current | Header fixo com busca… | L136 | 4/4 | 100% | — |
| **MOB-06** Nada escondido atrás do dock | Header fixo com busca… | L118 | Último texto 38 px acima do dock | 100% | — |
| **MOB-07** Não trocar a navegação por drawer ou hambúrguer | Arquitetura mobile escolhida | L102, L733 × L58, L198 | Dock como navegação principal + ☰ complementar (pedido em L198) | 100% | E |
| **MOB-08** Faixa de anúncio no celular: 32 px, 1 linha, ✕ de 44 | Mega Empório | L201 | 32 px, reticências, ✕ 44×44 | 100% | — |
| **MOB-09** Filtros em bottom sheet (≤ 90dvh, com alça) | Drawer Soft Pill + template | L543, L687 | Sheet de 760 px (90dvh) com alça | 100% | — |
| **MOB-10** Vitrine com 2 colunas no celular | Template, parte Vitrine | L687 × L390 | 1 coluna | 75% | B |
| **MOB-11** Hero no celular: 1 coluna assimétrica, imagem com recuo de 40, imagem menor abaixo | Prévia Folha Viva (celular) | L54–57 | 3/3 | 100% | — |
| **MOB-12** Escalonamento dos cartões removido abaixo de 768 | Folha Viva | L56 | Removido, com recuos alternados | 100% | — |
| **MOB-13** Alvos de toque ≥ 44×44 | Regras do Studio | L146, L720 | 16/44 (landing) e 15/100 (catálogo) abaixo de 44: links do rodapé com 36 px, links inline | 74% | C |
| **PAL-01** Fundo = bg #f6faf6 | Paleta Floresta | L230 | #f6faf6 | 100% | — |
| **PAL-02** Texto = #1b2e24 | Paleta Floresta | L234 | #1b2e24 | 100% | — |
| **PAL-03** Primária #2d6a4f (botões, faixa, “Aplicar”) | Paleta Floresta | L221 | Idêntica | 100% | — |
| **PAL-04** Destaque #b07d4f (itálico do hero, contador) | Paleta Floresta | L228, L192 | Idêntico nos 2 pontos | 100% | — |
| **PAL-05** Tokens centralizados com valores exportados; sem cores fixas | Tokens exportados | L208, L753 | 44/44 tokens; só #000 como alfa de máscara | 100% | — |
| **PAL-06** Fraunces 650 nos títulos, Inter 400 no corpo, base 15 px | Tipografia Fraunces + Inter | L270–282 | 4/4 (Google Fonts) | 100% | — |
| **PAL-07** Nada < 12 px; botões e filtros ≥ 14 px | Tipografia | L275 | 0 violações | 100% | — |
| **PAL-08** Geometria global fora dos componentes: 6/8/12, contornada, sem sombra | Formas: Médios, Contornada, Sem sombra | L292–308, L748 | 3/3 | 100% | — |
| **PAL-09** Cores da inspiração não usadas | Decisão: paleta global prevalece | L759 | 0 | 100% | — |
| **PAL-10** Foco visível 2–3 px em focusRing | Estados visuais | L315 | 2 px #2d6a4f (+ halo nos componentes) | 100% | — |
| **CMP-01** Estrutura do card: mídia 16/9 → etiqueta → título → texto → rodapé “Ver produto”; ícone Folha | Card Soft Pill personalizado | L330, L341–348 (× L635 4:5) | 6/6 (etiqueta com ícone de folha) | 100% | — |
| **CMP-02** Visual Soft Pill do card: raio 22, botão pílula, sem borda, sombra difusa, #fff, primária, título Inter | Card Soft Pill | L349–359 (× L292–306) | 7/7 | 100% | — |
| **CMP-03** Estados do card: hover, active 0,98, foco, 160 ms | Card Soft Pill | L380–387 | 4/4 | 100% | — |
| **CMP-04** Busca Soft Pill: lupa, “Buscar plantas…”, ⌘K, 42 px, pílula, tonal, Recentes/Sugestões, combobox | Busca Soft Pill personalizada | L405–438 | 8/8 | 100% | — |
| **CMP-05** Drawer Soft Pill: overlay, à direita, 360–420 px, dialog modal, “Filtros”, rodapé “Aplicar filtros”, raio 22 | Drawer Soft Pill (“Painel de filtros”) | L485–531 | 7/7 (400 px) | 100% | — |
| **CMP-06** Critérios de filtro adequados a plantas | (Studio só tinha critérios genéricos) | Ausente no MP (lacuna A) | Luz, rega, porte, preço, características | 100% | E |
| **CMP-07** Estados de vazio e carregando | Regras de implementação | L752, L459 × L424 | Vazio, esqueleto e spinner na busca | 100% | — |
| **INT-01** Mega menu: clique, ≤ 760 px, 3 col. + destaque, caixa alta, foco no 1º link, Esc, clique fora | Mega Empório (prévia com mega menu) | L96, L184, L187 × L76 (largura total) | 7/7 (760 px; hover de 150 ms também) | 100% | — |
| **INT-02** Busca do header: painel ao focar com a mesma largura, Ctrl+K, setas, Esc | Mega Empório + Busca Soft Pill | L190, L458 | 5/5 | 100% | — |
| **INT-03** Busca filtra os produtos | Busca | briefing | “Costel” → 1 resultado; vazio tratado | 100% | — |
| **INT-04** Filtros aplicam e ordenação funciona | Drawer de filtros + template | L635 | 30→4; menor preço OK | 100% | — |
| **INT-05** Drawer: Esc, overlay, botão, foco preso e devolvido | Drawer Soft Pill | L533, L213 | 5/5 | 100% | — |
| **INT-06** Linha 2 recolhe ao descer e volta ao subir | Layout de duas linhas | L95 | Recolhe e volta | 100% | — |
| **INT-07** Faixa de anúncio dispensável | Mega Empório | L168 | OK | 100% | — |
| **INT-08** Carrinho: contador accent, incrementa, abre a sacola | Mega Empório + template | L192, L675 | 3/3 | 100% | — |
| **INT-09** Menu do avatar (nome/e-mail, Meu perfil… Sair) | Mega Empório | L191 × L17 | Completo, com aviso de perfil fictício | 100% | — |
| **INT-10** Toque em categoria filtra sem mover a faixa | Header fixo com busca… | L135 | 3/3 (scrollLeft 99→99) | 100% | — |
| **INT-11** Dock responde e atualiza o ativo | Header fixo com busca… | L117, L136 | Rotas com aria-current | 100% | — |
| **INT-12** prefers-reduced-motion | Regras gerais | L729 | Sim | 100% | — |
| **RSP-01** Sem overflow horizontal (320–1920) | Regras gerais | L717 | 0/15 larguras | 100% | — |
| **RSP-02** Sem texto cortado, sobreposição ou instabilidade | Regras gerais | L718–719 | Nada encontrado | 100% | — |
| **RSP-03** Inputs com ≥ 16 px no celular | Regras gerais | L721 | Todos com 16 | 100% | — |
| **RSP-04** Celular na horizontal: barras ≤ 25% da altura | Header fixo com busca… | L140, L726 (104+52+64 px não cabem em 25% de 375 px) | 27% lendo; 42% no topo | 50% | D |
| **RSP-05** Tablet 768×1024 coerente | Layout desktop compactado | L150 | OK | 100% | — |

### Matriz — dev-2

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---:|:---:|
| **ARQ-01** Sem login / sem área restrita | “Landing page sem login” | L17–18 (contradito por L167/L191: avatar com “Sair”) | Sem login; menu de conta fictício, itens só avisam | 100% | E |
| **ARQ-02** Ordem das 7 seções da Folha Viva | Folha Viva (Composição assimétrica) | L28/L41: ordem explícita | 7/7 na ordem | 100% | — |
| **ARQ-03** Layout desktop de 2 linhas, sem sidebar | Navegação superior de duas linhas | L19, L71–85 × L29 (header leve da landing) | 2 linhas em todas as páginas | 100% | — |
| **ARQ-04** Arquitetura mobile: header+busca, faixa, dock | Header fixo com busca e menu inferior flutuante | L19, L112–118, L149 × L58 (hambúrguer da landing) | Presente na landing e no catálogo | 100% | — |
| **ARQ-05** Troca de arquitetura em 768 px | Desktop e mobile independentes | L102, L141 (L150 abre exceção 600–1023) | Idem | 100% | — |
| **ARQ-06** Catálogo com cards, busca e filtros | Tipo “Loja ou catálogo” + template de vitrine | L11–12 (lista de funcionalidades) | Rota #/catalogo, 22 produtos | 100% | — |
| **ARQ-07** Partes ★ do template: Categorias (4 blocos) e Vitrine (4 col., selo, preço, parcelamento, filtrar/ordenar) | Template “E-commerce de moda”, partes Cabeçalho/Categorias/Vitrine | L629–642, L635 × L28 (ordem fechada da landing) × L390 (3→2→1) | Sem blocos de categoria; 3 colunas; demais OK (4/6) | 67% | B |
| **ARQ-08** Conteúdo fictício substituído | Marcas de exemplo da landing, do header e do template | L64, L164, L702 (“substitua”) × L29 (logotipo “Folha Viva”) | Nenhuma marca ou item de exemplo | 100% | — |
| **ARQ-09** Marca “Verde Vivo” no logo e no rodapé | Nome do projeto “Verde Vivo” | L8, L64 | Em todas as páginas | 100% | — |
| **ARQ-10** Inspiração botânica (Verdant): editorial, serifa, vetores, respiro [J] | Verdant Atelier, paleta global prevalece | L552–620, L759 | Idem, com legenda “Fig. 01” e rodapé invertido | 100% | — |
| **DSK-01** Hero assimétrico (título col. 1–8, itálico accent, imagem alta 440/+80, imagem sobreposta, CTA link) | Prévia Folha Viva | L30–35, L45–46 | Título de 845 px; imagem 468 px a +80 px; sobreposta; CTA link (5/5) | 100% | — |
| **DSK-02** Cartões escalonados 0/48/96 px | Prévia Folha Viva | L35, L47 | 0/48/96 | 100% | — |
| **DSK-03** Citação recuada ≈25%, autor à direita | Prévia Folha Viva | L36 | 25%, autor à direita | 100% | — |
| **DSK-04** Imagem sangrando até a borda direita | Prévia Folha Viva | L37 | Borda direita = 1425 (área útil, com reserva da barra de rolagem) | 100% | — |
| **DSK-05** Chamada final alinhada à esquerda | Prévia Folha Viva | L28 | À esquerda | 100% | — |
| **DSK-06** Faixa de anúncio de 36 px (primary/onPrimary, link, ✕) | Mega Empório | L168, L183 | Idem | 100% | — |
| **DSK-07** Linha 1: 64 px, logo 28 px, busca larga 42 px, endereço, avatar, carrinho | Mega Empório, composição A | L74–75, L162–167 | 64 px; busca 640×42; todos os itens (6/6) | 100% | — |
| **DSK-08** Linha 2: 44 px, “Departamentos” + atalhos à esquerda, ativo em text/600 | Mega Empório, composição A | L76, L165, L174 × L211 | 44 px; Departamentos; ativo em navActive + 600 + sublinhado (L211) | 100% | E |
| **DSK-09** Header sticky (z 40) com sombra após 8 px | Mega Empório | L189 | Idem | 100% | — |
| **DSK-10** Conteúdo com largura máx. ≈1280 (ou 1120) | Layout de duas linhas | L74/L91 × L630 | 1280 | 100% | — |
| **DSK-11** 1024–1279: excedentes em “Mais” | Layout + Mega Empório | L100 × L196 | “Mais categorias” em 1024 | 100% | — |
| **DSK-12** 768–1023: desktop compactado sem overflow | Layout + Mega Empório | L101 × L197 × L150 (3 instruções diferentes) | Faixa rolável com esmaecimento | 100% | — |
| **DSK-13** Vitrine em 4 colunas no desktop | Template, parte Vitrine | L635 × L390 (card 3→2→1) | 3 colunas | 75% | B |
| **MOB-01** Header fixo ≈104 px (marca + busca em largura total) com safe-area | Header fixo com busca… | L115 (× L198/L202, 56+48) | Idem | 100% | — |
| **MOB-02** Busca com fonte de 16 px que abre a tela de sugestões | Header fixo com busca… | L134, L469, L721 | Abre em tela cheia, mas o campo tem 15 px (zoom no iOS) (2/3) | 67% | C |
| **MOB-03** Faixa de categorias ≈52 px (pílulas com ícone, scroll-snap, ativa) | Header fixo com busca… | L116 | 52 px, snap, ativa preenchida em primary | 100% | — |
| **MOB-04** Dock flutuante: 64 px, margens de 16, raio 22, 4 destinos, safe-area | Header fixo com busca… | L117, L725 | Idem | 100% | — |
| **MOB-05** Item ativo do dock: cor + indicador + ícone preenchido + aria-current | Header fixo com busca… | L136 | 4/4 (ponto + preenchimento) | 100% | — |
| **MOB-06** Nada escondido atrás do dock | Header fixo com busca… | L118 | Idem (40 px) | 100% | — |
| **MOB-07** Não trocar a navegação por drawer ou hambúrguer | Arquitetura mobile escolhida | L102, L733 × L58, L198 | Só dock, faixa e busca | 100% | — |
| **MOB-08** Faixa de anúncio no celular: 32 px, 1 linha, ✕ de 44 | Mega Empório | L201 | Idem | 100% | — |
| **MOB-09** Filtros em bottom sheet (≤ 90dvh, com alça) | Drawer Soft Pill + template | L543, L687 | Idem | 100% | — |
| **MOB-10** Vitrine com 2 colunas no celular | Template, parte Vitrine | L687 × L390 | 1 coluna | 75% | B |
| **MOB-11** Hero no celular: 1 coluna assimétrica, imagem com recuo de 40, imagem menor abaixo | Prévia Folha Viva (celular) | L54–57 | 3/3 | 100% | — |
| **MOB-12** Escalonamento dos cartões removido abaixo de 768 | Folha Viva | L56 | Idem | 100% | — |
| **MOB-13** Alvos de toque ≥ 44×44 | Regras do Studio | L146, L720 | 10/37 e 11/102: links do rodapé com 36 px | 81% | C |
| **PAL-01** Fundo = bg #f6faf6 | Paleta Floresta | L230 | #f6faf6 | 100% | — |
| **PAL-02** Texto = #1b2e24 | Paleta Floresta | L234 | #1b2e24 | 100% | — |
| **PAL-03** Primária #2d6a4f (botões, faixa, “Aplicar”) | Paleta Floresta | L221 | Idêntica | 100% | — |
| **PAL-04** Destaque #b07d4f (itálico do hero, contador) | Paleta Floresta | L228, L192 | Idêntico | 100% | — |
| **PAL-05** Tokens centralizados com valores exportados; sem cores fixas | Tokens exportados | L208, L753 | 44/44; zero literais | 100% | — |
| **PAL-06** Fraunces 650 nos títulos, Inter 400 no corpo, base 15 px | Tipografia Fraunces + Inter | L270–282 | 4/4 (fontes locais) | 100% | — |
| **PAL-07** Nada < 12 px; botões e filtros ≥ 14 px | Tipografia | L275 | 4 botões de demonstração com 13 px | 90% | C |
| **PAL-08** Geometria global fora dos componentes: 6/8/12, contornada, sem sombra | Formas: Médios, Contornada, Sem sombra | L292–308, L748 | 3/3 | 100% | — |
| **PAL-09** Cores da inspiração não usadas | Decisão: paleta global prevalece | L759 | 0 | 100% | — |
| **PAL-10** Foco visível 2–3 px em focusRing | Estados visuais | L315 | 2 px + halo de 35% | 100% | — |
| **CMP-01** Estrutura do card: mídia 16/9 → etiqueta → título → texto → rodapé “Ver produto”; ícone Folha | Card Soft Pill personalizado | L330, L341–348 (× L635 4:5) | Sem ícone de folha (5/6) | 83% | C |
| **CMP-02** Visual Soft Pill do card: raio 22, botão pílula, sem borda, sombra difusa, #fff, primária, título Inter | Card Soft Pill | L349–359 (× L292–306) | 7/7 | 100% | — |
| **CMP-03** Estados do card: hover, active 0,98, foco, 160 ms | Card Soft Pill | L380–387 | Sem scale 0,98 no card (3,5/4) | 88% | C |
| **CMP-04** Busca Soft Pill: lupa, “Buscar plantas…”, ⌘K, 42 px, pílula, tonal, Recentes/Sugestões, combobox | Busca Soft Pill personalizada | L405–438 | 8/8 | 100% | — |
| **CMP-05** Drawer Soft Pill: overlay, à direita, 360–420 px, dialog modal, “Filtros”, rodapé “Aplicar filtros”, raio 22 | Drawer Soft Pill (“Painel de filtros”) | L485–531 | 7/7 (400 px) | 100% | — |
| **CMP-06** Critérios de filtro adequados a plantas | (Studio só tinha critérios genéricos) | Ausente no MP (lacuna A) | Categoria, luz, porte, cuidado, extras | 100% | E |
| **CMP-07** Estados de vazio e carregando | Regras de implementação | L752, L459 × L424 | Idem | 100% | — |
| **INT-01** Mega menu: clique, ≤ 760 px, 3 col. + destaque, caixa alta, foco no 1º link, Esc, clique fora | Mega Empório (prévia com mega menu) | L96, L184, L187 × L76 (largura total) | 7/7 | 100% | — |
| **INT-02** Busca do header: painel ao focar com a mesma largura, Ctrl+K, setas, Esc | Mega Empório + Busca Soft Pill | L190, L458 | 5/5 | 100% | — |
| **INT-03** Busca filtra os produtos | Busca | briefing | Idem | 100% | — |
| **INT-04** Filtros aplicam e ordenação funciona | Drawer de filtros + template | L635 | 22→7; OK | 100% | — |
| **INT-05** Drawer: Esc, overlay, botão, foco preso e devolvido | Drawer Soft Pill | L533, L213 | 5/5 | 100% | — |
| **INT-06** Linha 2 recolhe ao descer e volta ao subir | Layout de duas linhas | L95 | Recolhe e volta | 100% | — |
| **INT-07** Faixa de anúncio dispensável | Mega Empório | L168 | OK | 100% | — |
| **INT-08** Carrinho: contador accent, incrementa, abre a sacola | Mega Empório + template | L192, L675 | 3/3 | 100% | — |
| **INT-09** Menu do avatar (nome/e-mail, Meu perfil… Sair) | Mega Empório | L191 × L17 | Completo | 100% | — |
| **INT-10** Toque em categoria filtra sem mover a faixa | Header fixo com busca… | L135 | 3/3 (101→101) | 100% | — |
| **INT-11** Dock responde e atualiza o ativo | Header fixo com busca… | L117, L136 | Rotas ou rolagem até a seção | 100% | — |
| **INT-12** prefers-reduced-motion | Regras gerais | L729 | Sim | 100% | — |
| **RSP-01** Sem overflow horizontal (320–1920) | Regras gerais | L717 | 0/15 | 100% | — |
| **RSP-02** Sem texto cortado, sobreposição ou instabilidade | Regras gerais | L718–719 | Nada visível (o rótulo “Adicionar à sacola” fica oculto de propósito) | 100% | — |
| **RSP-03** Inputs com ≥ 16 px no celular | Regras gerais | L721 | Busca com 15 e ordenação com 14 (1/3) | 33% | C |
| **RSP-04** Celular na horizontal: barras ≤ 25% da altura | Header fixo com busca… | L140, L726 (104+52+64 px não cabem em 25% de 375 px) | 17% (header deixa de ser fixo) | 100% | — |
| **RSP-05** Tablet 768×1024 coerente | Layout desktop compactado | L150 | OK | 100% | — |

### Matriz — dev-3

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---:|:---:|
| **ARQ-01** Sem login / sem área restrita | “Landing page sem login” | L17–18 (contradito por L167/L191: avatar com “Sair”) | Sem login; popover “Visitante · modo demonstração” | 100% | E |
| **ARQ-02** Ordem das 7 seções da Folha Viva | Folha Viva (Composição assimétrica) | L28/L41: ordem explícita | 7/7 na ordem | 100% | — |
| **ARQ-03** Layout desktop de 2 linhas, sem sidebar | Navegação superior de duas linhas | L19, L71–85 × L29 (header leve da landing) | Catálogo com 2 linhas; landing com header leve de 1 linha (“Folha Viva”) | 50% | B |
| **ARQ-04** Arquitetura mobile: header+busca, faixa, dock | Header fixo com busca e menu inferior flutuante | L19, L112–118, L149 × L58 (hambúrguer da landing) | Presente só no catálogo; landing só com hambúrguer, sem busca, faixa nem dock | 50% | B |
| **ARQ-05** Troca de arquitetura em 768 px | Desktop e mobile independentes | L102, L141 (L150 abre exceção 600–1023) | Idem (no catálogo) | 100% | — |
| **ARQ-06** Catálogo com cards, busca e filtros | Tipo “Loja ou catálogo” + template de vitrine | L11–12 (lista de funcionalidades) | Rota #/catalogo, 16 produtos | 100% | — |
| **ARQ-07** Partes ★ do template: Categorias (4 blocos) e Vitrine (4 col., selo, preço, parcelamento, filtrar/ordenar) | Template “E-commerce de moda”, partes Cabeçalho/Categorias/Vitrine | L629–642, L635 × L28 (ordem fechada da landing) × L390 (3→2→1) | 6 blocos em 4 colunas, vitrine em 4 colunas, filtrar/ordenar OK; sem parcelamento; selo só em “Novo” (4,5/6) | 75% | C |
| **ARQ-08** Conteúdo fictício substituído | Marcas de exemplo da landing, do header e do template | L64, L164, L702 (“substitua”) × L29 (logotipo “Folha Viva”) | Landing e rodapé com a marca de exemplo “Folha Viva” (3 ocorrências) | 75% | C |
| **ARQ-09** Marca “Verde Vivo” no logo e no rodapé | Nome do projeto “Verde Vivo” | L8, L64 | Só no catálogo; a landing se chama “Folha Viva” | 50% | C |
| **ARQ-10** Inspiração botânica (Verdant): editorial, serifa, vetores, respiro [J] | Verdant Atelier, paleta global prevalece | L552–620, L759 | Uma única ilustração genérica repetida nos cards, título do hero pequeno e vão de ~400 px no hero | 50% | C |
| **DSK-01** Hero assimétrico (título col. 1–8, itálico accent, imagem alta 440/+80, imagem sobreposta, CTA link) | Prévia Folha Viva | L30–35, L45–46 | Título só em ~4 colunas (376 px, 39 px de corpo); imagem 440/+80 OK (4,5/5) | 90% | C |
| **DSK-02** Cartões escalonados 0/48/96 px | Prévia Folha Viva | L35, L47 | 0/48/96 | 100% | — |
| **DSK-03** Citação recuada ≈25%, autor à direita | Prévia Folha Viva | L36 | 25%, autor à direita | 100% | — |
| **DSK-04** Imagem sangrando até a borda direita | Prévia Folha Viva | L37 | Borda direita = 1440 | 100% | — |
| **DSK-05** Chamada final alinhada à esquerda | Prévia Folha Viva | L28 | À esquerda | 100% | — |
| **DSK-06** Faixa de anúncio de 36 px (primary/onPrimary, link, ✕) | Mega Empório | L168, L183 | Idem no catálogo; ausente na landing | 50% | B |
| **DSK-07** Linha 1: 64 px, logo 28 px, busca larga 42 px, endereço, avatar, carrinho | Mega Empório, composição A | L74–75, L162–167 | Catálogo: sem endereço; “Conta” em vez de avatar (4,5/6). Landing: nenhum item | 38% | B+C |
| **DSK-08** Linha 2: 44 px, “Departamentos” + atalhos à esquerda, ativo em text/600 | Mega Empório, composição A | L76, L165, L174 × L211 | Catálogo: sem “Departamentos”, categorias espalhadas na largura toda, ativo em pílula (2/4). Landing: sem linha 2 | 25% | B+C |
| **DSK-09** Header sticky (z 40) com sombra após 8 px | Mega Empório | L189 | Catálogo OK; header leve da landing sem sombra | 75% | B |
| **DSK-10** Conteúdo com largura máx. ≈1280 (ou 1120) | Layout de duas linhas | L74/L91 × L630 | 1280 (1232 úteis) | 100% | — |
| **DSK-11** 1024–1279: excedentes em “Mais” | Layout + Mega Empório | L100 × L196 | “Mais categorias” em 1024 | 100% | — |
| **DSK-12** 768–1023: desktop compactado sem overflow | Layout + Mega Empório | L101 × L197 × L150 (3 instruções diferentes) | 7 categorias cabem; sem overflow | 100% | — |
| **DSK-13** Vitrine em 4 colunas no desktop | Template, parte Vitrine | L635 × L390 (card 3→2→1) | 4 colunas | 100% | — |
| **MOB-01** Header fixo ≈104 px (marca + busca em largura total) com safe-area | Header fixo com busca… | L115 (× L198/L202, 56+48) | Catálogo: fixo de 52+44 px, busca 358 px. Landing: header leve de 65 px sem busca | 50% | B |
| **MOB-02** Busca com fonte de 16 px que abre a tela de sugestões | Header fixo com busca… | L134, L469, L721 | 16 px; painel abaixo do header | 100% | — |
| **MOB-03** Faixa de categorias ≈52 px (pílulas com ícone, scroll-snap, ativa) | Header fixo com busca… | L116 | 52 px, snap, ativa com ponto e ícone preenchido | 100% | — |
| **MOB-04** Dock flutuante: 64 px, margens de 16, raio 22, 4 destinos, safe-area | Header fixo com busca… | L117, L725 | Idem (só no catálogo) | 100% | — |
| **MOB-05** Item ativo do dock: cor + indicador + ícone preenchido + aria-current | Header fixo com busca… | L136 | 4/4 | 100% | — |
| **MOB-06** Nada escondido atrás do dock | Header fixo com busca… | L118 | Idem (34 px) | 100% | — |
| **MOB-07** Não trocar a navegação por drawer ou hambúrguer | Arquitetura mobile escolhida | L102, L733 × L58, L198 | Catálogo OK; na landing o ☰ substitui o dock | 50% | B |
| **MOB-08** Faixa de anúncio no celular: 32 px, 1 linha, ✕ de 44 | Mega Empório | L201 | Ausente no celular (decisão do desenvolvedor) | 0% | C |
| **MOB-09** Filtros em bottom sheet (≤ 90dvh, com alça) | Drawer Soft Pill + template | L543, L687 | Idem | 100% | — |
| **MOB-10** Vitrine com 2 colunas no celular | Template, parte Vitrine | L687 × L390 | 2 colunas | 100% | — |
| **MOB-11** Hero no celular: 1 coluna assimétrica, imagem com recuo de 40, imagem menor abaixo | Prévia Folha Viva (celular) | L54–57 | 3/3 | 100% | — |
| **MOB-12** Escalonamento dos cartões removido abaixo de 768 | Folha Viva | L56 | Idem | 100% | — |
| **MOB-13** Alvos de toque ≥ 44×44 | Regras do Studio | L146, L720 | 7/12 e 11/56: botões de 42 px, links de 36 e 28 px | 61% | C |
| **PAL-01** Fundo = bg #f6faf6 | Paleta Floresta | L230 | #f6faf6 | 100% | — |
| **PAL-02** Texto = #1b2e24 | Paleta Floresta | L234 | #1b2e24 | 100% | — |
| **PAL-03** Primária #2d6a4f (botões, faixa, “Aplicar”) | Paleta Floresta | L221 | Idêntica | 100% | — |
| **PAL-04** Destaque #b07d4f (itálico do hero, contador) | Paleta Floresta | L228, L192 | Idêntico | 100% | — |
| **PAL-05** Tokens centralizados com valores exportados; sem cores fixas | Tokens exportados | L208, L753 | 44/44; 7 rgba fixos em sombras | 85% | C |
| **PAL-06** Fraunces 650 nos títulos, Inter 400 no corpo, base 15 px | Tipografia Fraunces + Inter | L270–282 | 4/4 (Google Fonts) | 100% | — |
| **PAL-07** Nada < 12 px; botões e filtros ≥ 14 px | Tipografia | L275 | Rótulos do dock (botões) com 12 px | 90% | C |
| **PAL-08** Geometria global fora dos componentes: 6/8/12, contornada, sem sombra | Formas: Médios, Contornada, Sem sombra | L292–308, L748 | Raio 22 em seções e CTAs em pílula fora dos componentes (2/3) | 67% | C |
| **PAL-09** Cores da inspiração não usadas | Decisão: paleta global prevalece | L759 | 0 | 100% | — |
| **PAL-10** Foco visível 2–3 px em focusRing | Estados visuais | L315 | 2 px #2d6a4f | 100% | — |
| **CMP-01** Estrutura do card: mídia 16/9 → etiqueta → título → texto → rodapé “Ver produto”; ícone Folha | Card Soft Pill personalizado | L330, L341–348 (× L635 4:5) | Etiqueta só nos itens “Novo” (5,5/6) | 92% | B |
| **CMP-02** Visual Soft Pill do card: raio 22, botão pílula, sem borda, sombra difusa, #fff, primária, título Inter | Card Soft Pill | L349–359 (× L292–306) | 7/7 | 100% | — |
| **CMP-03** Estados do card: hover, active 0,98, foco, 160 ms | Card Soft Pill | L380–387 | 4/4 | 100% | — |
| **CMP-04** Busca Soft Pill: lupa, “Buscar plantas…”, ⌘K, 42 px, pílula, tonal, Recentes/Sugestões, combobox | Busca Soft Pill personalizada | L405–438 | Sem o grupo “Recentes” (7/8) | 88% | C |
| **CMP-05** Drawer Soft Pill: overlay, à direita, 360–420 px, dialog modal, “Filtros”, rodapé “Aplicar filtros”, raio 22 | Drawer Soft Pill (“Painel de filtros”) | L485–531 | 7/7 (400 px) | 100% | — |
| **CMP-06** Critérios de filtro adequados a plantas | (Studio só tinha critérios genéricos) | Ausente no MP (lacuna A) | Categoria, luz, porte, cuidado, preço | 100% | E |
| **CMP-07** Estados de vazio e carregando | Regras de implementação | L752, L459 × L424 | Vazio e esqueleto; sem spinner na busca (“Buscando: não”) | 80% | B |
| **INT-01** Mega menu: clique, ≤ 760 px, 3 col. + destaque, caixa alta, foco no 1º link, Esc, clique fora | Mega Empório (prévia com mega menu) | L96, L184, L187 × L76 (largura total) | Painel em largura total (1440), aberto por categoria (6/7) | 86% | B |
| **INT-02** Busca do header: painel ao focar com a mesma largura, Ctrl+K, setas, Esc | Mega Empório + Busca Soft Pill | L190, L458 | 5/5 | 100% | — |
| **INT-03** Busca filtra os produtos | Busca | briefing | Idem (filtro ao vivo) | 100% | — |
| **INT-04** Filtros aplicam e ordenação funciona | Drawer de filtros + template | L635 | 16→5; OK | 100% | — |
| **INT-05** Drawer: Esc, overlay, botão, foco preso e devolvido | Drawer Soft Pill | L533, L213 | 5/5 | 100% | — |
| **INT-06** Linha 2 recolhe ao descer e volta ao subir | Layout de duas linhas | L95 | Entra em laço: altura de 24–42 px e scrollY oscilando sem parar depois de uma única rolagem | 0% | C |
| **INT-07** Faixa de anúncio dispensável | Mega Empório | L168 | OK (catálogo) | 100% | — |
| **INT-08** Carrinho: contador accent, incrementa, abre a sacola | Mega Empório + template | L192, L675 | 3/3 | 100% | — |
| **INT-09** Menu do avatar (nome/e-mail, Meu perfil… Sair) | Mega Empório | L191 × L17 | Itens presentes; “Visitante” no lugar de nome e e-mail | 75% | D |
| **INT-10** Toque em categoria filtra sem mover a faixa | Header fixo com busca… | L135 | Filtra, mas a faixa se desloca 14 px (2/3) | 67% | C |
| **INT-11** Dock responde e atualiza o ativo | Header fixo com busca… | L117, L136 | Início, Catálogo, Buscar (foca o campo), Sacola (drawer) | 100% | — |
| **INT-12** prefers-reduced-motion | Regras gerais | L729 | Sim | 100% | — |
| **RSP-01** Sem overflow horizontal (320–1920) | Regras gerais | L717 | 0/15 | 100% | — |
| **RSP-02** Sem texto cortado, sobreposição ou instabilidade | Regras gerais | L718–719 | Página “treme” por causa do laço do header (INT-06); vão no hero | 50% | C |
| **RSP-03** Inputs com ≥ 16 px no celular | Regras gerais | L721 | Newsletter com 14 (2/3) | 67% | C |
| **RSP-04** Celular na horizontal: barras ≤ 25% da altura | Header fixo com busca… | L140, L726 (104+52+64 px não cabem em 25% de 375 px) | 46% lendo; 54% no topo | 0% | D |
| **RSP-05** Tablet 768×1024 coerente | Layout desktop compactado | L150 | OK | 100% | — |
