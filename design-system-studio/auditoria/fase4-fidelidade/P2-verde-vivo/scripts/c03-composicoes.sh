#!/usr/bin/env bash
# Composições lado a lado: captura aprovada no Studio + dev-1 + dev-2 + dev-3, mesma altura, com rótulo.
set -e
ST=../../../fase2-projetos/P2-verde-vivo/capturas
CA=../capturas
CO=../composicoes
TMP=$(mktemp -d)
lab() { # lab entrada saida rotulo altura
  convert "$1" -resize x"$4" -background white -gravity north -splice 0x44 -font DejaVu-Sans -pointsize 26 -fill '#1b2e24' -annotate +0+8 "$3" -bordercolor '#888' -border 2 "$2"; }
row() { # saida altura rotulo-studio studio dev1 dev2 dev3
  local out=$1 h=$2; shift 2
  lab "$2" $TMP/a.png "$1" $h; lab "$3" $TMP/b.png "dev-1" $h; lab "$4" $TMP/c.png "dev-2" $h; lab "$5" $TMP/d.png "dev-3" $h
  convert $TMP/a.png $TMP/b.png $TMP/c.png $TMP/d.png -background white -splice 12x0 +append "$out"; }
# 1. landing desktop (dobra 1440x900)
row $CO/01-landing-desktop-dobra.png 900 "Studio: Folha Viva (computador)" $ST/landing-folha-viva-previa-computador-minha-identidade-parte1.png $CA/dev-1-desktop-landing-dobra.png $CA/dev-2-desktop-landing-dobra.png $CA/dev-3-desktop-landing-dobra.png
# 2. landing desktop completa: Studio (partes 1-5, área da prévia) empilhado x páginas inteiras
for i in 1 2 3 4 5; do convert $ST/landing-folha-viva-previa-computador-minha-identidade-parte$i.png -crop 1050x537+195+253 +repage $TMP/p$i.png; done
convert $TMP/p1.png $TMP/p2.png $TMP/p3.png $TMP/p4.png $TMP/p5.png -append $TMP/studio-landing.png
row $CO/02-landing-desktop-pagina-inteira.png 2600 "Studio: Folha Viva (5 partes)" $TMP/studio-landing.png $CA/dev-1-desktop-landing-inteira.png $CA/dev-2-desktop-landing-inteira.png $CA/dev-3-desktop-landing-inteira.png
# 3. header + mega menu
row $CO/03-header-mega-menu-desktop.png 900 "Studio: Mega Empório A (mega menu)" $ST/navegacao-header-mega-emporio-grande-mega-menu-aberto.png $CA/dev-1-desktop-mega-menu.png $CA/dev-2-desktop-mega-menu.png $CA/dev-3-desktop-mega-menu.png
# 4. arquitetura mobile (catálogo)
row $CO/04-arquitetura-mobile-catalogo.png 844 "Studio: header+busca+dock" $ST/layout-mobile-escolhido-previa-grande-celular.png $CA/dev-1-mobile-catalogo-dobra.png $CA/dev-2-mobile-catalogo-dobra.png $CA/dev-3-mobile-catalogo-dobra.png
# 5. arquitetura mobile (landing)
row $CO/05-arquitetura-mobile-landing.png 844 "Studio: header+busca+dock" $ST/layout-mobile-escolhido-previa-grande-celular.png $CA/dev-1-mobile-landing-dobra.png $CA/dev-2-mobile-landing-dobra.png $CA/dev-3-mobile-landing-dobra.png
# 6. landing celular: Folha Viva celular
convert $ST/landing-folha-viva-previa-celular-minha-identidade-parte1.png -crop 400x520+520+270 +repage $TMP/fvcel.png
row $CO/06-landing-celular-hero.png 844 "Studio: Folha Viva celular" $TMP/fvcel.png $CA/dev-1-mobile-landing-dobra.png $CA/dev-2-mobile-landing-dobra.png $CA/dev-3-mobile-landing-dobra.png
# 7. header Mega Empório no celular
convert $ST/navegacao-header-mega-emporio-grande-celular.png -crop 380x580+535+212 +repage $TMP/mecel.png
row $CO/07-header-mega-emporio-celular.png 844 "Studio: Mega Empório celular" $TMP/mecel.png $CA/dev-1-mobile-catalogo-topo.png $CA/dev-2-mobile-catalogo-topo.png $CA/dev-3-mobile-catalogo-topo.png
# 8. card de produto Soft Pill
convert $ST/componente-card-produto-soft-pill-personalizado.png -crop 330x376+284+216 +repage $TMP/card.png
row $CO/08-card-produto.png 440 "Studio: Card Soft Pill" $TMP/card.png $CA/dev-1-recorte-card.png $CA/dev-2-recorte-card.png $CA/dev-3-recorte-card.png
# 9. busca Soft Pill (desktop, foco)
convert $ST/componente-busca-soft-pill-personalizado.png -crop 650x420+124+194 +repage $TMP/busca.png
convert $CA/dev-1-desktop-busca-foco.png -crop 760x520+240+30 +repage $TMP/b1.png; convert $CA/dev-2-desktop-busca-foco.png -crop 760x520+250+30 +repage $TMP/b2.png; convert $CA/dev-3-desktop-busca-foco.png -crop 760x520+200+30 +repage $TMP/b3.png
row $CO/09-busca-sugestoes.png 520 "Studio: Busca Soft Pill" $TMP/busca.png $TMP/b1.png $TMP/b2.png $TMP/b3.png
# 10. drawer de filtros
convert $ST/componente-drawer-filtros-soft-pill.png -crop 650x420+124+194 +repage $TMP/drw.png
row $CO/10-drawer-filtros-desktop.png 900 "Studio: Drawer Soft Pill" $TMP/drw.png $CA/dev-1-desktop-drawer-filtros.png $CA/dev-2-desktop-drawer-filtros.png $CA/dev-3-desktop-drawer-filtros.png
# 11. bottom sheet no celular
row $CO/11-filtros-celular.png 844 "Studio: Drawer Soft Pill" $TMP/drw.png $CA/dev-1-mobile-filtros-sheet.png $CA/dev-2-mobile-filtros-sheet.png $CA/dev-3-mobile-filtros-sheet.png
# 12. tablet 768
row $CO/12-tablet-768-landing.png 1024 "Studio: layout duas linhas" $ST/layout-desktop-escolhido-previa-grande.png $CA/dev-1-tablet-landing-dobra.png $CA/dev-2-tablet-landing-dobra.png $CA/dev-3-tablet-landing-dobra.png
rm -rf $TMP
ls -la $CO
