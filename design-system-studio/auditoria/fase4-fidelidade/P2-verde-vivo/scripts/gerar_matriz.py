"""Gera as matrizes de fidelidade e as notas por dimensão a partir das medições (resultados/*.json) já interpretadas.
Cada linha: id, dimensão, requisito, escolha no Studio, instrução exportada (linhas do Master Prompt),
e por site: (resultado construído, nota 0-100, origem). Origem: '—' sem falha; A-E conforme a rubrica.
Saída: resultados/matriz.json e resultados/_matrizes.md (incluído em fidelidade.md)."""
import json, pathlib, statistics
D = pathlib.Path(__file__).parent / 'resultados'
R = []
def r(i, dim, req, esc, ins, d1, d2, d3, j=False):
    R.append(dict(id=i, dim=dim, req=req, esc=esc, ins=ins, j=j, s={'dev-1': d1, 'dev-2': d2, 'dev-3': d3}))
# ---------------- ARQUITETURA ----------------
r('ARQ-01', 'ARQ', 'Sem login / sem área restrita', '“Landing page sem login”', 'L17–18 (contradito por L167/L191: avatar com “Sair”)',
  ('Sem login; avatar com perfil fictício marcado como demonstração', 100, 'E'), ('Sem login; menu de conta fictício, itens só avisam', 100, 'E'), ('Sem login; popover “Visitante · modo demonstração”', 100, 'E'))
r('ARQ-02', 'ARQ', 'Ordem das 7 seções da Folha Viva', 'Folha Viva (Composição assimétrica)', 'L28/L41: ordem explícita',
  ('Header → hero → cartões → citação → texto+imagem → chamada → rodapé (7/7)', 100, '—'), ('7/7 na ordem', 100, '—'), ('7/7 na ordem', 100, '—'))
r('ARQ-03', 'ARQ', 'Layout desktop de 2 linhas, sem sidebar', 'Navegação superior de duas linhas', 'L19, L71–85 × L29 (header leve da landing)',
  ('2 linhas em todas as páginas', 100, '—'), ('2 linhas em todas as páginas', 100, '—'), ('Catálogo com 2 linhas; landing com header leve de 1 linha (“Folha Viva”)', 50, 'B'))
r('ARQ-04', 'ARQ', 'Arquitetura mobile: header+busca, faixa, dock', 'Header fixo com busca e menu inferior flutuante', 'L19, L112–118, L149 × L58 (hambúrguer da landing)',
  ('Presente na landing e no catálogo', 100, '—'), ('Presente na landing e no catálogo', 100, '—'), ('Presente só no catálogo; landing só com hambúrguer, sem busca, faixa nem dock', 50, 'B'))
r('ARQ-05', 'ARQ', 'Troca de arquitetura em 768 px', 'Desktop e mobile independentes', 'L102, L141 (L150 abre exceção 600–1023)',
  ('Mobile até 767, desktop a partir de 768', 100, '—'), ('Idem', 100, '—'), ('Idem (no catálogo)', 100, '—'))
r('ARQ-06', 'ARQ', 'Catálogo com cards, busca e filtros', 'Tipo “Loja ou catálogo” + template de vitrine', 'L11–12 (lista de funcionalidades)',
  ('Rota #/catalogo, 30 produtos, busca e filtros ligados', 100, '—'), ('Rota #/catalogo, 22 produtos', 100, '—'), ('Rota #/catalogo, 16 produtos', 100, '—'))
r('ARQ-07', 'ARQ', 'Partes ★ do template: Categorias (4 blocos) e Vitrine (4 col., selo, preço, parcelamento, filtrar/ordenar)', 'Template “E-commerce de moda”, partes Cabeçalho/Categorias/Vitrine', 'L629–642, L635 × L28 (ordem fechada da landing) × L390 (3→2→1)',
  ('Sem blocos de categoria; 3 colunas; selo, preço, parcelamento e filtrar/ordenar OK (4/6)', 67, 'B'), ('Sem blocos de categoria; 3 colunas; demais OK (4/6)', 67, 'B'), ('6 blocos em 4 colunas, vitrine em 4 colunas, filtrar/ordenar OK; sem parcelamento; selo só em “Novo” (4,5/6)', 75, 'C'))
r('ARQ-08', 'ARQ', 'Conteúdo fictício substituído', 'Marcas de exemplo da landing, do header e do template', 'L64, L164, L702 (“substitua”) × L29 (logotipo “Folha Viva”)',
  ('Nenhuma marca ou item de exemplo', 100, '—'), ('Nenhuma marca ou item de exemplo', 100, '—'), ('Landing e rodapé com a marca de exemplo “Folha Viva” (3 ocorrências)', 75, 'C'))
r('ARQ-09', 'ARQ', 'Marca “Verde Vivo” no logo e no rodapé', 'Nome do projeto “Verde Vivo”', 'L8, L64',
  ('Em todas as páginas', 100, '—'), ('Em todas as páginas', 100, '—'), ('Só no catálogo; a landing se chama “Folha Viva”', 50, 'C'))
r('ARQ-10', 'ARQ', 'Inspiração botânica (Verdant): editorial, serifa, vetores, respiro', 'Verdant Atelier, paleta global prevalece', 'L552–620, L759', 
  ('Ilustrações SVG variadas por espécie, arco no hero, serifa grande', 100, '—'), ('Idem, com legenda “Fig. 01” e rodapé invertido', 100, '—'), ('Uma única ilustração genérica repetida nos cards, título do hero pequeno e vão de ~400 px no hero', 50, 'C'), j=True)
# ---------------- DESKTOP ----------------
r('DSK-01', 'DSK', 'Hero assimétrico (título col. 1–8, itálico accent, imagem alta 440/+80, imagem sobreposta, CTA link)', 'Prévia Folha Viva', 'L30–35, L45–46',
  ('Título de 803 px e 80 px; itálico #b07d4f; imagem 440 px, mas começa 44 px abaixo do título (pede ≈80) (4,5/5)', 90, 'C'), ('Título de 845 px; imagem 468 px a +80 px; sobreposta; CTA link (5/5)', 100, '—'), ('Título só em ~4 colunas (376 px, 39 px de corpo); imagem 440/+80 OK (4,5/5)', 90, 'C'))
r('DSK-02', 'DSK', 'Cartões escalonados 0/48/96 px', 'Prévia Folha Viva', 'L35, L47', ('0/48/96', 100, '—'), ('0/48/96', 100, '—'), ('0/48/96', 100, '—'))
r('DSK-03', 'DSK', 'Citação recuada ≈25%, autor à direita', 'Prévia Folha Viva', 'L36', ('Recuo de 25%, autor à direita', 100, '—'), ('25%, autor à direita', 100, '—'), ('25%, autor à direita', 100, '—'))
r('DSK-04', 'DSK', 'Imagem sangrando até a borda direita', 'Prévia Folha Viva', 'L37', ('Borda direita = 1440', 100, '—'), ('Borda direita = 1425 (área útil, com reserva da barra de rolagem)', 100, '—'), ('Borda direita = 1440', 100, '—'))
r('DSK-05', 'DSK', 'Chamada final alinhada à esquerda', 'Prévia Folha Viva', 'L28', ('À esquerda', 100, '—'), ('À esquerda', 100, '—'), ('À esquerda', 100, '—'))
r('DSK-06', 'DSK', 'Faixa de anúncio de 36 px (primary/onPrimary, link, ✕)', 'Mega Empório', 'L168, L183',
  ('36 px, #2d6a4f/#fff, link e ✕', 100, '—'), ('Idem', 100, '—'), ('Idem no catálogo; ausente na landing', 50, 'B'))
r('DSK-07', 'DSK', 'Linha 1: 64 px, logo 28 px, busca larga 42 px, endereço, avatar, carrinho', 'Mega Empório, composição A', 'L74–75, L162–167',
  ('64 px; logo 28 px #2d6a4f + nome em 700; busca 560×42; endereço com CEP; avatar; carrinho (6/6)', 100, '—'), ('64 px; busca 640×42; todos os itens (6/6)', 100, '—'), ('Catálogo: sem endereço; “Conta” em vez de avatar (4,5/6). Landing: nenhum item', 38, 'B+C'))
r('DSK-08', 'DSK', 'Linha 2: 44 px, “Departamentos” + atalhos à esquerda, ativo em text/600', 'Mega Empório, composição A', 'L76, L165, L174 × L211',
  ('44 px; Departamentos; à esquerda; ativo em #1b2e24 peso 600 com aria-current', 100, '—'), ('44 px; Departamentos; ativo em navActive + 600 + sublinhado (L211)', 100, 'E'), ('Catálogo: sem “Departamentos”, categorias espalhadas na largura toda, ativo em pílula (2/4). Landing: sem linha 2', 25, 'B+C'))
r('DSK-09', 'DSK', 'Header sticky (z 40) com sombra após 8 px', 'Mega Empório', 'L189',
  ('Sticky, z 40, sombra ao rolar', 100, '—'), ('Idem', 100, '—'), ('Catálogo OK; header leve da landing sem sombra', 75, 'B'))
r('DSK-10', 'DSK', 'Conteúdo com largura máx. ≈1280 (ou 1120)', 'Layout de duas linhas', 'L74/L91 × L630',
  ('1280 (1216 úteis)', 100, '—'), ('1280', 100, '—'), ('1280 (1232 úteis)', 100, '—'))
r('DSK-11', 'DSK', '1024–1279: excedentes em “Mais”', 'Layout + Mega Empório', 'L100 × L196', ('“Mais ▾” em 1024', 100, '—'), ('“Mais categorias” em 1024', 100, '—'), ('“Mais categorias” em 1024', 100, '—'))
r('DSK-12', 'DSK', '768–1023: desktop compactado sem overflow', 'Layout + Mega Empório', 'L101 × L197 × L150 (3 instruções diferentes)',
  ('5 itens cabem; sem ☰', 100, '—'), ('Faixa rolável com esmaecimento', 100, '—'), ('7 categorias cabem; sem overflow', 100, '—'))
r('DSK-13', 'DSK', 'Vitrine em 4 colunas no desktop', 'Template, parte Vitrine', 'L635 × L390 (card 3→2→1)',
  ('3 colunas', 75, 'B'), ('3 colunas', 75, 'B'), ('4 colunas', 100, '—'))
# ---------------- CELULAR ----------------
r('MOB-01', 'MOB', 'Header fixo ≈104 px (marca + busca em largura total) com safe-area', 'Header fixo com busca…', 'L115 (× L198/L202, 56+48)',
  ('Sticky 56+48 = 104 px; busca 358 px; safe-area-inset-top', 100, '—'), ('Idem', 100, '—'), ('Catálogo: fixo de 52+44 px, busca 358 px. Landing: header leve de 65 px sem busca', 50, 'B'))
r('MOB-02', 'MOB', 'Busca com fonte de 16 px que abre a tela de sugestões', 'Header fixo com busca…', 'L134, L469, L721',
  ('16 px; abre busca em tela cheia com Recentes/Sugestões', 100, '—'), ('Abre em tela cheia, mas o campo tem 15 px (zoom no iOS) (2/3)', 67, 'C'), ('16 px; painel abaixo do header', 100, '—'))
r('MOB-03', 'MOB', 'Faixa de categorias ≈52 px (pílulas com ícone, scroll-snap, ativa)', 'Header fixo com busca…', 'L116',
  ('52 px, snap por proximidade, ícone + rótulo, ativa em primarySoft', 100, '—'), ('52 px, snap, ativa preenchida em primary', 100, '—'), ('52 px, snap, ativa com ponto e ícone preenchido', 100, '—'))
r('MOB-04', 'MOB', 'Dock flutuante: 64 px, margens de 16, raio 22, 4 destinos, safe-area', 'Header fixo com busca…', 'L117, L725',
  ('64 px, 16/16/16, 22 px, 4 itens', 100, '—'), ('Idem', 100, '—'), ('Idem (só no catálogo)', 100, '—'))
r('MOB-05', 'MOB', 'Item ativo do dock: cor + indicador + ícone preenchido + aria-current', 'Header fixo com busca…', 'L136',
  ('4/4', 100, '—'), ('4/4 (ponto + preenchimento)', 100, '—'), ('4/4', 100, '—'))
r('MOB-06', 'MOB', 'Nada escondido atrás do dock', 'Header fixo com busca…', 'L118', ('Último texto 38 px acima do dock', 100, '—'), ('Idem (40 px)', 100, '—'), ('Idem (34 px)', 100, '—'))
r('MOB-07', 'MOB', 'Não trocar a navegação por drawer ou hambúrguer', 'Arquitetura mobile escolhida', 'L102, L733 × L58, L198',
  ('Dock como navegação principal + ☰ complementar (pedido em L198)', 100, 'E'), ('Só dock, faixa e busca', 100, '—'), ('Catálogo OK; na landing o ☰ substitui o dock', 50, 'B'))
r('MOB-08', 'MOB', 'Faixa de anúncio no celular: 32 px, 1 linha, ✕ de 44', 'Mega Empório', 'L201', ('32 px, reticências, ✕ 44×44', 100, '—'), ('Idem', 100, '—'), ('Ausente no celular (decisão do desenvolvedor)', 0, 'C'))
r('MOB-09', 'MOB', 'Filtros em bottom sheet (≤ 90dvh, com alça)', 'Drawer Soft Pill + template', 'L543, L687', ('Sheet de 760 px (90dvh) com alça', 100, '—'), ('Idem', 100, '—'), ('Idem', 100, '—'))
r('MOB-10', 'MOB', 'Vitrine com 2 colunas no celular', 'Template, parte Vitrine', 'L687 × L390', ('1 coluna', 75, 'B'), ('1 coluna', 75, 'B'), ('2 colunas', 100, '—'))
r('MOB-11', 'MOB', 'Hero no celular: 1 coluna assimétrica, imagem com recuo de 40, imagem menor abaixo', 'Prévia Folha Viva (celular)', 'L54–57', ('3/3', 100, '—'), ('3/3', 100, '—'), ('3/3', 100, '—'))
r('MOB-12', 'MOB', 'Escalonamento dos cartões removido abaixo de 768', 'Folha Viva', 'L56', ('Removido, com recuos alternados', 100, '—'), ('Idem', 100, '—'), ('Idem', 100, '—'))
r('MOB-13', 'MOB', 'Alvos de toque ≥ 44×44', 'Regras do Studio', 'L146, L720',
  ('16/44 (landing) e 15/100 (catálogo) abaixo de 44: links do rodapé com 36 px, links inline', 74, 'C'), ('10/37 e 11/102: links do rodapé com 36 px', 81, 'C'), ('7/12 e 11/56: botões de 42 px, links de 36 e 28 px', 61, 'C'))
# ---------------- PALETA ----------------
r('PAL-01', 'PAL', 'Fundo = bg #f6faf6', 'Paleta Floresta', 'L230', ('#f6faf6', 100, '—'), ('#f6faf6', 100, '—'), ('#f6faf6', 100, '—'))
r('PAL-02', 'PAL', 'Texto = #1b2e24', 'Paleta Floresta', 'L234', ('#1b2e24', 100, '—'), ('#1b2e24', 100, '—'), ('#1b2e24', 100, '—'))
r('PAL-03', 'PAL', 'Primária #2d6a4f (botões, faixa, “Aplicar”)', 'Paleta Floresta', 'L221', ('Idêntica', 100, '—'), ('Idêntica', 100, '—'), ('Idêntica', 100, '—'))
r('PAL-04', 'PAL', 'Destaque #b07d4f (itálico do hero, contador)', 'Paleta Floresta', 'L228, L192', ('Idêntico nos 2 pontos', 100, '—'), ('Idêntico', 100, '—'), ('Idêntico', 100, '—'))
r('PAL-05', 'PAL', 'Tokens centralizados com valores exportados; sem cores fixas', 'Tokens exportados', 'L208, L753',
  ('44/44 tokens; só #000 como alfa de máscara', 100, '—'), ('44/44; zero literais', 100, '—'), ('44/44; 7 rgba fixos em sombras', 85, 'C'))
r('PAL-06', 'PAL', 'Fraunces 650 nos títulos, Inter 400 no corpo, base 15 px', 'Tipografia Fraunces + Inter', 'L270–282',
  ('4/4 (Google Fonts)', 100, '—'), ('4/4 (fontes locais)', 100, '—'), ('4/4 (Google Fonts)', 100, '—'))
r('PAL-07', 'PAL', 'Nada < 12 px; botões e filtros ≥ 14 px', 'Tipografia', 'L275',
  ('0 violações', 100, '—'), ('4 botões de demonstração com 13 px', 90, 'C'), ('Rótulos do dock (botões) com 12 px', 90, 'C'))
r('PAL-08', 'PAL', 'Geometria global fora dos componentes: 6/8/12, contornada, sem sombra', 'Formas: Médios, Contornada, Sem sombra', 'L292–308, L748',
  ('3/3', 100, '—'), ('3/3', 100, '—'), ('Raio 22 em seções e CTAs em pílula fora dos componentes (2/3)', 67, 'C'))
r('PAL-09', 'PAL', 'Cores da inspiração não usadas', 'Decisão: paleta global prevalece', 'L759', ('0', 100, '—'), ('0', 100, '—'), ('0', 100, '—'))
r('PAL-10', 'PAL', 'Foco visível 2–3 px em focusRing', 'Estados visuais', 'L315', ('2 px #2d6a4f (+ halo nos componentes)', 100, '—'), ('2 px + halo de 35%', 100, '—'), ('2 px #2d6a4f', 100, '—'))
# ---------------- COMPONENTES ----------------
r('CMP-01', 'CMP', 'Estrutura do card: mídia 16/9 → etiqueta → título → texto → rodapé “Ver produto”; ícone Folha', 'Card Soft Pill personalizado', 'L330, L341–348 (× L635 4:5)',
  ('6/6 (etiqueta com ícone de folha)', 100, '—'), ('Sem ícone de folha (5/6)', 83, 'C'), ('Etiqueta só nos itens “Novo” (5,5/6)', 92, 'B'))
r('CMP-02', 'CMP', 'Visual Soft Pill do card: raio 22, botão pílula, sem borda, sombra difusa, #fff, primária, título Inter', 'Card Soft Pill', 'L349–359 (× L292–306)',
  ('7/7', 100, '—'), ('7/7', 100, '—'), ('7/7', 100, '—'))
r('CMP-03', 'CMP', 'Estados do card: hover, active 0,98, foco, 160 ms', 'Card Soft Pill', 'L380–387', ('4/4', 100, '—'), ('Sem scale 0,98 no card (3,5/4)', 88, 'C'), ('4/4', 100, '—'))
r('CMP-04', 'CMP', 'Busca Soft Pill: lupa, “Buscar plantas…”, ⌘K, 42 px, pílula, tonal, Recentes/Sugestões, combobox', 'Busca Soft Pill personalizada', 'L405–438',
  ('8/8', 100, '—'), ('8/8', 100, '—'), ('Sem o grupo “Recentes” (7/8)', 88, 'C'))
r('CMP-05', 'CMP', 'Drawer Soft Pill: overlay, à direita, 360–420 px, dialog modal, “Filtros”, rodapé “Aplicar filtros”, raio 22', 'Drawer Soft Pill (“Painel de filtros”)', 'L485–531',
  ('7/7 (400 px)', 100, '—'), ('7/7 (400 px)', 100, '—'), ('7/7 (400 px)', 100, '—'))
r('CMP-06', 'CMP', 'Critérios de filtro adequados a plantas', '(Studio só tinha critérios genéricos)', 'Ausente no MP (lacuna A)',
  ('Luz, rega, porte, preço, características', 100, 'E'), ('Categoria, luz, porte, cuidado, extras', 100, 'E'), ('Categoria, luz, porte, cuidado, preço', 100, 'E'))
r('CMP-07', 'CMP', 'Estados de vazio e carregando', 'Regras de implementação', 'L752, L459 × L424', ('Vazio, esqueleto e spinner na busca', 100, '—'), ('Idem', 100, '—'), ('Vazio e esqueleto; sem spinner na busca (“Buscando: não”)', 80, 'B'))
# ---------------- INTERAÇÕES ----------------
r('INT-01', 'INT', 'Mega menu: clique, ≤ 760 px, 3 col. + destaque, caixa alta, foco no 1º link, Esc, clique fora', 'Mega Empório (prévia com mega menu)', 'L96, L184, L187 × L76 (largura total)',
  ('7/7 (760 px; hover de 150 ms também)', 100, '—'), ('7/7', 100, '—'), ('Painel em largura total (1440), aberto por categoria (6/7)', 86, 'B'))
r('INT-02', 'INT', 'Busca do header: painel ao focar com a mesma largura, Ctrl+K, setas, Esc', 'Mega Empório + Busca Soft Pill', 'L190, L458', ('5/5', 100, '—'), ('5/5', 100, '—'), ('5/5', 100, '—'))
r('INT-03', 'INT', 'Busca filtra os produtos', 'Busca', 'briefing', ('“Costel” → 1 resultado; vazio tratado', 100, '—'), ('Idem', 100, '—'), ('Idem (filtro ao vivo)', 100, '—'))
r('INT-04', 'INT', 'Filtros aplicam e ordenação funciona', 'Drawer de filtros + template', 'L635', ('30→4; menor preço OK', 100, '—'), ('22→7; OK', 100, '—'), ('16→5; OK', 100, '—'))
r('INT-05', 'INT', 'Drawer: Esc, overlay, botão, foco preso e devolvido', 'Drawer Soft Pill', 'L533, L213', ('5/5', 100, '—'), ('5/5', 100, '—'), ('5/5', 100, '—'))
r('INT-06', 'INT', 'Linha 2 recolhe ao descer e volta ao subir', 'Layout de duas linhas', 'L95',
  ('Recolhe e volta', 100, '—'), ('Recolhe e volta', 100, '—'), ('Entra em laço: altura de 24–42 px e scrollY oscilando sem parar depois de uma única rolagem', 0, 'C'))
r('INT-07', 'INT', 'Faixa de anúncio dispensável', 'Mega Empório', 'L168', ('OK', 100, '—'), ('OK', 100, '—'), ('OK (catálogo)', 100, '—'))
r('INT-08', 'INT', 'Carrinho: contador accent, incrementa, abre a sacola', 'Mega Empório + template', 'L192, L675', ('3/3', 100, '—'), ('3/3', 100, '—'), ('3/3', 100, '—'))
r('INT-09', 'INT', 'Menu do avatar (nome/e-mail, Meu perfil… Sair)', 'Mega Empório', 'L191 × L17',
  ('Completo, com aviso de perfil fictício', 100, '—'), ('Completo', 100, '—'), ('Itens presentes; “Visitante” no lugar de nome e e-mail', 75, 'D'))
r('INT-10', 'INT', 'Toque em categoria filtra sem mover a faixa', 'Header fixo com busca…', 'L135', ('3/3 (scrollLeft 99→99)', 100, '—'), ('3/3 (101→101)', 100, '—'), ('Filtra, mas a faixa se desloca 14 px (2/3)', 67, 'C'))
r('INT-11', 'INT', 'Dock responde e atualiza o ativo', 'Header fixo com busca…', 'L117, L136', ('Rotas com aria-current', 100, '—'), ('Rotas ou rolagem até a seção', 100, '—'), ('Início, Catálogo, Buscar (foca o campo), Sacola (drawer)', 100, '—'))
r('INT-12', 'INT', 'prefers-reduced-motion', 'Regras gerais', 'L729', ('Sim', 100, '—'), ('Sim', 100, '—'), ('Sim', 100, '—'))
# ---------------- RESPONSIVIDADE ----------------
r('RSP-01', 'RSP', 'Sem overflow horizontal (320–1920)', 'Regras gerais', 'L717', ('0/15 larguras', 100, '—'), ('0/15', 100, '—'), ('0/15', 100, '—'))
r('RSP-02', 'RSP', 'Sem texto cortado, sobreposição ou instabilidade', 'Regras gerais', 'L718–719', ('Nada encontrado', 100, '—'), ('Nada visível (o rótulo “Adicionar à sacola” fica oculto de propósito)', 100, '—'), ('Página “treme” por causa do laço do header (INT-06); vão no hero', 50, 'C'))
r('RSP-03', 'RSP', 'Inputs com ≥ 16 px no celular', 'Regras gerais', 'L721', ('Todos com 16', 100, '—'), ('Busca com 15 e ordenação com 14 (1/3)', 33, 'C'), ('Newsletter com 14 (2/3)', 67, 'C'))
r('RSP-04', 'RSP', 'Celular na horizontal: barras ≤ 25% da altura', 'Header fixo com busca…', 'L140, L726 (104+52+64 px não cabem em 25% de 375 px)',
  ('27% lendo; 42% no topo', 50, 'D'), ('17% (header deixa de ser fixo)', 100, '—'), ('46% lendo; 54% no topo', 0, 'D'))
r('RSP-05', 'RSP', 'Tablet 768×1024 coerente', 'Layout desktop compactado', 'L150', ('OK', 100, '—'), ('OK', 100, '—'), ('OK', 100, '—'))

DIMS = [('DSK', 'Desktop'), ('MOB', 'Celular'), ('PAL', 'Paleta/tokens'), ('CMP', 'Componentes'), ('INT', 'Interações'), ('ARQ', 'Arquitetura'), ('RSP', 'Responsividade')]
SITES = ['dev-1', 'dev-2', 'dev-3']
res = {}
for s in SITES:
    o = {}
    for k, nome in DIMS:
        v = [x['s'][s][1] for x in R if x['dim'] == k]
        o[k] = (round(statistics.mean(v), 1), len(v))
    allv = [x['s'][s][1] for x in R]
    o['GERAL'] = (round(statistics.mean(allv), 1), len(allv))
    clear = [x['s'][s][1] for x in R if not (x['s'][s][1] < 100 and any(c in x['s'][s][2] for c in 'ABD'))]
    o['ADERENCIA'] = (round(statistics.mean(clear), 1), len(clear))
    cnt = {c: sum(1 for x in R if c in x['s'][s][2] and (x['s'][s][1] < 100 or c == 'E')) for c in 'ABCDE'}
    o['ORIGENS'] = cnt
    o['J'] = [x['id'] for x in R if x['j']]
    res[s] = o
json.dump({'linhas': R, 'notas': res}, open(D / 'matriz.json', 'w'), indent=1, ensure_ascii=False)
# markdown
md = []
for s in SITES:
    md.append(f'\n### Matriz — {s}\n')
    md.append('| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |')
    md.append('|---|---|---|---|---:|:---:|')
    for x in R:
        res_t, sc, org = x['s'][s]
        req = f"**{x['id']}** {x['req']}" + (' [J]' if x['j'] else '')
        md.append(f"| {req} | {x['esc']} | {x['ins']} | {res_t} | {sc}% | {org} |")
md_notas = ['| Dimensão | dev-1 | dev-2 | dev-3 |', '|---|---:|---:|---:|']
for k, nome in DIMS + [('GERAL', 'Geral'), ('ADERENCIA', 'Aderência às instruções claras')]:
    cells = []
    for s in SITES:
        v, n = res[s][k]; cells.append(f"{str(v).replace('.', ',')}% (n={n})")
    md_notas.append(f'| **{nome}** | ' + ' | '.join(cells) + ' |')
md_or = ['| Origem | dev-1 | dev-2 | dev-3 | Total |', '|---|---:|---:|---:|---:|']
for c, nome in [('A', 'A — Studio'), ('B', 'B — Master Prompt'), ('C', 'C — desenvolvedor'), ('D', 'D — conflito/limitação'), ('E', 'E — diferença aceitável')]:
    vals = [res[s]['ORIGENS'][c] for s in SITES]
    md_or.append(f'| {nome} | ' + ' | '.join(map(str, vals)) + f' | {sum(vals)} |')
(D / '_matrizes.md').write_text('\n'.join(md) + '\n')
(D / '_notas.md').write_text('\n'.join(md_notas) + '\n\n' + '\n'.join(md_or) + '\n')
print('\n'.join(md_notas)); print(); print('\n'.join(md_or)); print('linhas', len(R))
