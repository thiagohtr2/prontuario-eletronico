# NOTES: ambiguidades, lacunas e contradições do PROMPT.md

Cada item cita a linha do `PROMPT.md` e a decisão tomada. Quando duas partes da especificação se contradizem, a decisão segue a seção aprovada específica para o caso (por exemplo, o layout escolhido no Studio prevalece sobre a referência de template).

## A. Escopo e arquitetura

1. **Linha 17-18 (“Landing page sem login… Não existe área restrita”, “Login: nenhum”) x linhas 12 e 319-324 (catálogo, busca, filtros, cards).** A especificação pede uma landing sem login, mas também um catálogo. **Decisão:** o site tem duas telas: landing (`#/`) e catálogo (`#/catalogo`). Nenhuma das duas exige login.

2. **Linhas 190-191 (avatar com “Meu perfil”, “Sair”) e template linha 631 (ícones de conta).** Sem login, esses itens não têm função. **Decisão:** o botão “Conta” abre um popover de demonstração com um aviso de que não há login. Os itens aparecem desabilitados e avisam ao clicar.

3. **Linhas 66-67 (“Layout desktop”) x linhas 155-170 (“Mega Empório”, com marca “Empório Murici”, itens Ofertas, Mercado, Casa, Eletrônicos).** A seção Mega Empório é de outro e-commerce, com marca e categorias que não são de uma loja de plantas. **Decisão:** a topbar de duas linhas aprovada na seção B é a navegação desktop. Os comportamentos da seção Mega Empório (mega menu, sugestões de busca, popover, sombra após 8 px, faixa de aviso) foram aplicados à topbar, com as categorias e a marca Verde Vivo.

4. **Linha 115 (header fixo no celular) x linhas 198-199 (barra de 56 px com ☰ no celular, da seção Mega Empório) x linha 102 (“não converta a navegação desktop em drawer”).** **Decisão:** no celular vale só o layout mobile aprovado (header fixo, faixa e dock). A barra de 56 px e o painel ☰ da seção Mega Empório não foram implementados.

5. **Linhas 150-151 e 141 (tablet de 600 a 1023 px com estrutura desktop “quando couber”) x linhas 141 e 102 (desktop a partir de 768 px).** **Decisão:** corte fixo em 768 px. Abaixo, layout mobile. A partir de 768 px, topbar. Tablets entre 768 e 1023 px usam a topbar com a linha de categorias rolável.

6. **Linha 17 x linha 12 (“Funcionalidades previstas”).** Entre a landing e o catálogo não há um fluxo definido. **Decisão:** a landing tem um link “Escolher minha planta” para o catálogo, e o catálogo tem links de volta (logo, dock “Início”).

## B. Landing (Folha Viva)

7. **Linha 63 (“Demonstração original: fundo #f4f1e8… primária #2f6b3a, destaque #d9a441… Por padrão a landing herda a paleta global”) x linha 217 (paleta Floresta para todos os componentes).** **Decisão:** a landing usa a paleta global Floresta, que é o padrão indicado. A paleta original da demonstração não foi aplicada.

8. **Linha 51 (parallax “opcional”).** **Decisão:** não implementado. É opcional e foi omitido para manter a demonstração simples.

9. **Linha 28 (“Header leve”) x linha 31 (“Imagem alta… imagem menor”).** O texto das seções “Cuidados” e “Ateliê” do menu não tem destino definido. **Decisão:** “Cuidados” leva aos cartões escalonados e “Ateliê” à faixa que sangra.

10. **Linha 26 e linha 36 (“Citação recuada em ≈25% da largura”).** O texto e o autor da citação não foram fornecidos. **Decisão:** texto e autor fictícios (“Marina S., cliente em Curitiba”). O autor fica alinhado à direita.

11. **Linhas 54-55 (celular: imagem alta com recuo à esquerda) e linha 59 (“o logo e a ação principal continuam visíveis”).** Em 320 px não cabem logo, hambúrguer e o botão “Escolher minha planta” lado a lado. **Decisão:** no celular, o botão do header vai para o menu (hambúrguer). A ação principal continua visível pelo CTA do hero e pelo botão de chamada final.

12. **Linha 41 (“secoes”) e linha 33 (“Grade de 12 colunas… título nas colunas 1–8”).** A composição foi feita com grade de 12 colunas, como descrito. A “imagem menor sobreposta” fica na coluna 7 a 9, sobre a divisa entre o texto e a imagem alta.

13. **Linha 25 (“título serifado deslocado”) x linha 567 da referência (“moldura em arco”).** A referência Verdant Atelier é “inspiração”. **Decisão:** da referência foram aproveitados a moldura em arco da imagem do hero, a tipografia e a composição. Não foram implementados o selo circular rotativo, a seção de oficinas e o footer invertido, porque não são parte da landing aprovada.

## C. Topbar desktop e mega menu

14. **Linha 74 (“conteúdo limitado a ≈1280 px”) x linha 184 (mega menu “até 760 px de largura”) x linha 169 (“mega menu de largura total”).** **Decisão:** a topbar tem largura total e o conteúdo fica limitado a 1280 px. O mega menu segue a mesma largura. Usa até 3 colunas de links mais um cartão de destaque.

15. **Linha 163 (“sem borda inferior”) x linha 77 (“separação entre as linhas por borda fina”).** **Decisão:** há uma borda fina entre as duas linhas e outra embaixo da topbar, porque a separação por borda é a especificação aprovada da topbar.

16. **Linha 95 (“a linha 2 recolhe e a linha 1 permanece sticky”).** **Decisão:** a topbar inteira é sticky. Ao rolar para baixo a linha 2 recolhe (altura 0). Ao rolar para cima ela volta. O efeito é o mesmo para o usuário.

17. **Linha 74 (`grid-template-rows: 64px 44px minmax(0, 1fr)`) x linha 81 (`gridRows: 64px 44px 1fr`).** **Decisão:** as duas linhas da topbar usam 64 px e 44 px. O restante da página é o fluxo normal de documento, porque o site é “One Page” (linha 105).

18. **Linha 165 (“Departamentos ▾” e “Ofertas”, etc.).** Substituído pelas categorias de plantas. O mega menu abre pelas categorias com grupos.

19. **Linha 202 (“No celular a busca larga vira uma segunda linha de 48 px”).** **Decisão:** no celular, a busca fica no header fixo (linha de 52 px de busca, com campo de 44 px). Essa é a arquitetura mobile aprovada.

20. **Linha 168 (faixa de anúncio de 32 px no celular) x linha 115 (header fixo de 104 px).** **Decisão:** a faixa de anúncio aparece só no desktop. No celular o header fixo já ocupa o topo.

21. **Linha 201 (“faixa de anúncio… reticências… botão ✕”).** Implementada no desktop, com o botão ✕ e o texto como link.

22. **Linha 203 (“recomendado esconder [o header] ao rolar”).** **Decisão:** a faixa de categorias do celular recolhe ao rolar para baixo e volta ao subir. O header fixo não se esconde.

## D. Layout mobile

23. **Linha 119 (“menu inferior flutuante… 4 destinos”).** Os destinos não estão definidos. **Decisão:** Início (landing), Catálogo, Buscar (foca o campo do header) e Sacola (abre o minicarrinho).

24. **Linha 123 (“stories: sim”).** Não há descrição do que são stories. **Decisão:** não implementado.

25. **Linha 140 (“header + menu ≤ 25% da altura” na horizontal).** Com 104 px de header, 52 px de faixa e 64 px de dock, a altura de 390 px em paisagem não cabe em 25%. **Decisão:** em paisagem e altura até 500 px, as barras ficam mais compactas (brand 44 px, busca 48 px, faixa 40 px, dock 56 px). O limite de 25% não é atingido, porque manter alvos de 44 px tem prioridade.

26. **Linha 136 (item ativo com `aria-current="page"`) e linha 139 (rótulos de até 10 caracteres).** **Decisão:** a pílula ativa usa `aria-current="page"`, cor primária, ícone preenchido e um ponto. Os rótulos das categorias têm até 10 caracteres.

## E. Identidade, tipografia e geometria

27. **Linha 270 (“tamanho base 15 px”) x linhas 358, 434 e 510 (“Tamanho base: 14 px” nos componentes).** **Decisão:** texto do corpo em 15 px. Os componentes usam 14 px, como especificado em cada um.

28. **Linha 278 (títulos em Fraunces, peso 650) x linhas 355, 431 e 507 (“Fonte de títulos: Inter 650” nos cards, busca e drawer).** **Decisão:** títulos gerais em Fraunces. Títulos de cards, da busca e dos drawers em Inter 650, porque são exceções listadas nos próprios componentes.

29. **Linhas 240 e 382 (“anel de 3 px em focusRing a 35%”).** Um anel a 35% de opacidade tem contraste insuficiente para o indicador de foco (WCAG 1.4.11). **Decisão:** há um contorno sólido de 2 px em `focusRing` e, por cima, um halo de 3 px a 35%.

30. **Linhas 296 e 304 (“sem sombras em superfícies de conteúdo”, “sombra: none”) x linhas 336 e 352 (cards com “sombra difusa e baixa”).** **Decisão:** os cards Soft Pill mantêm sombra difusa, porque o componente aprovado a exige. As outras superfícies não têm sombra. Elementos flutuantes (dock, drawers, popovers, mega menu) têm elevação.

31. **Linha 305 (“superfície: outlined”) x linhas 337 e 351 (“zero bordas”).** **Decisão:** cards de produto sem borda. Cards da landing com borda de 1 px, por serem superfícies outlined.

32. **Linha 345 (“Ícone: Folha (lucide: Leaf)”) e linha 297 (ícones outline).** Não há acesso à biblioteca Lucide neste ambiente. **Decisão:** os ícones são SVG de contorno desenhados à mão, no estilo Lucide, com as formas do Leaf e dos ícones usados nas outras telas.

## F. Componentes

33. **Linha 330 (mídia 16:9 nos cards) x linha 635 (template: “foto 4:5”).** **Decisão:** cards de produto em 16:9, porque é a especificação aprovada do componente. Os blocos de categoria usam 4:5, como no template.

34. **Linha 343 (etiqueta “Novo”).** Não há indicação de quais plantas são novas. **Decisão:** a etiqueta aparece apenas nos produtos marcados como novos nos dados fictícios.

35. **Linha 344 (botão “Ver produto”) x ausência de página de produto.** **Decisão:** o card inteiro é um link que abre o diálogo do produto, com o botão “Adicionar à sacola”.

36. **Linha 679 (“Hover no produto mostra segunda foto e botão ‘Adicionar’”).** Não há segunda foto. **Decisão:** o botão “Ver produto” fica sempre visível, para não depender de hover no toque.

37. **Linha 424 (“Buscando (carregando): não”) x linha 459 (“estado de carregando com spinner no lugar da lupa”).** **Decisão:** a propriedade explícita (sem carregamento) prevalece. Não há spinner na busca. O estado de carregamento aparece na grade (skeleton), que é o estado de lista pedido na linha 752.

38. **Linha 422 (“Botão de limpar: não”) x linha 458 (Esc “limpa ou fecha”).** **Decisão:** sem botão de limpar. A tecla Esc limpa o campo.

39. **Linha 469 (busca expandida em tela cheia no celular, opcional).** **Decisão:** o painel de sugestões abre logo abaixo do header fixo, com a mesma largura.

40. **Linha 498 (drawer de filtros à direita) x linha 543 (no celular, bottom sheet ou lateral).** **Decisão:** no desktop, drawer à direita. No celular, bottom sheet com alça e altura máxima de 90dvh.

41. **Linha 549 (“Filtros”, sem tipo de seleção).** **Decisão:** categoria, luz, porte, cuidado e preço são de escolha única, com pílulas. Escolha única evita combinações de categorias que a grade não suporta.

## G. Template Linho & Cia (marca, seções e grade)

42. **Linhas 646 e 702 (“Linho & Cia”, moda) x catálogo de plantas.** O template é de moda e a marca de exemplo não se aplica. **Decisão:** a estrutura das 8 seções foi mantida (cabeçalho, campanha, benefícios, categorias, vitrine, origem, newsletter e rodapé), com textos e imagens de plantas.

43. **Linhas 629-642 (ordem das 8 seções) x linha 639 (3 partes priorizadas).** **Decisão:** as 8 seções foram implementadas. Cabeçalho, categorias e vitrine receberam atenção prioritária.

44. **Linha 636 (“1 linhas alternadas de imagem e texto”).** Texto com erro de digitação, provavelmente “2 linhas”. **Decisão:** duas linhas em zigue-zague no desktop e imagem sobre o texto no celular.

45. **Linha 683 (cabeçalho do template no celular com hambúrguer e categorias em drawer) x linha 115 (header móvel aprovado com faixa de categorias).** **Decisão:** vale o layout mobile aprovado. Não há hambúrguer no catálogo, e as categorias ficam na faixa.

46. **Linha 687 (vitrine em 2 colunas no celular) x linha 723 (“nunca comprima cartões abaixo de uma largura legível”) x linha 635 do template (vitrine em 4 colunas).** **Decisão:** vitrine com 4 colunas a partir de 1280 px, 3 entre 1024 e 1279, 2 entre 380 e 1023 e 1 coluna abaixo de 380 px.

47. **Linha 670 e 682 (respiro e breakpoints do template: 599 e 1023 px) x linha 709 (breakpoints de referência xs a xl).** **Decisão:** a grade segue os breakpoints do Studio (767 e 1024 px) e os das colunas acima.

48. **Linha 683 (“A faixa de aviso fica em uma linha com texto truncado”).** **Decisão:** a faixa de aviso fica só no desktop, como em (20).

49. **Linhas 631-650 (“Partes selecionadas”, exceções de cor e canto).** As cores do template foram substituídas pela paleta Floresta e os cantos de 8 px foram aplicados, como nas exceções listadas.

## H. Estados, acessibilidade e movimento

50. **Linha 752 (“estados de carregamento, vazio e erro para listas, tabelas e formulários”).** **Decisão:** a grade tem estados de carregamento (skeleton), vazio (com botão “Limpar filtros”) e erro (com “Tentar de novo”). O erro pode ser simulado com `#/catalogo?erro=1`. O formulário da newsletter tem erro de validação e confirmação.

51. **Linha 729 (`prefers-reduced-motion`).** **Decisão:** transições e rolagem suave são desligadas. Os pulsos do skeleton também. O rolamento automático dos scrolls ao escolher um filtro usa `auto` nesse caso.

52. **Linha 428 (sombra) e linha 390 (“horizontal vira vertical no celular”).** Os cards já são verticais em todas as larguras. Não houve transformação adicional.

## I. Decisões funcionais que a especificação não cobre

53. **Busca global.** Ao começar um termo de busca, a categoria volta para “Todas” e os filtros de facetas são limpos. Assim o resultado não fica preso a uma categoria em que o termo não existe.

54. **Ordenação e filtros.** As opções de ordenação (relevância, menor preço, maior preço, nome) não estavam definidas e foram criadas com dados fictícios.

55. **Checkout e favoritos.** Não existem nas especificações. A sacola tem contador, minicarrinho, quantidade e remoção. “Finalizar compra” mostra apenas uma mensagem de demonstração.

56. **Endereço de entrega (seção Mega Empório).** Não foi implementado, porque o site não tem login nem entrega.

57. **Modo escuro.** Não está especificado. Não foi implementado. Os tokens estão em `:root` para facilitar a inclusão.

58. **Tokens de gradiente (`gradientFrom`, `gradientTo`).** Estão definidos em `css/tokens.css`. O gradiente da campanha usa a variável `--shade` (escuro sobre a imagem), que é a finalidade de legibilidade descrita no template.

59. **Contraste do placeholder.** O placeholder (`#89948d`) tem contraste abaixo de 4,5:1 em fundo branco. Foi mantido porque é o token aprovado, e o rótulo do campo é sempre visível.

60. **Ilustrações e textos.** Todas as imagens são SVG placeholder gerados por `VV.art` em `js/data.js`, com texto alternativo (`role="img"`, `aria-label`). Marca, textos e preços são fictícios.

## Verificação

- `tests/smoke.js` roda em 16 larguras, de 320 a 1920 px. Não há estouro horizontal nem erro de página.
- Os fluxos principais foram verificados no Chromium: mega menu com Esc, busca com ⌘K e combobox, filtros, produto, sacola, ampliação de categoria, newsletter, dock e menu da landing.
- A página abre por `file://`, sem build.
