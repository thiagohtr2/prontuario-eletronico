#!/bin/bash
# Composições lado a lado (mesma altura): prévia aprovada no Studio × site construído.
set -e
cd "$(dirname "$0")/.."
ST=../../fase2-projetos/P3-nexo-capital/capturas
C=capturas
O=composicoes
mkdir -p $O
for s in dev-1 dev-2 dev-3; do
  # (a) aplicação no computador
  convert $ST/15-previa-integrada-aplicacao-computador-recorte.png -resize x900 \( $C/$s/dashboard-1440.png -resize x900 \) +append $O/$s-a-computador-studio-x-site.png
  # (b) celular: drawer fechado e aberto
  convert $ST/15-previa-integrada-aplicacao-celular-recorte.png -resize x844 \( $C/$s/dashboard-390.png -resize x844 \) $ST/15-previa-integrada-aplicacao-celular-menu-aberto-recorte.png -resize x844 \( $C/$s/drawer-390.png -resize x844 \) +append $O/$s-b-celular-studio-x-site.png
  # (c) login computador (prévia do Studio em diálogo) e celular
  convert $ST/16-login-acesso-corporativo-previa-computador.png -resize x900 \( $C/$s/login-1440.png -resize x900 \) +append $O/$s-c1-login-computador-studio-x-site.png
  convert \( $ST/17-login-acesso-corporativo-previa-celular.png -crop 410x580+515+212 +repage -resize x844 \) \( $C/$s/login-390.png -resize x844 \) +append $O/$s-c2-login-celular-studio-x-site.png
  # (d) tablet
  convert $ST/15-previa-integrada-aplicacao-tablet-recorte.png -resize x1024 \( $C/$s/dashboard-768.png -resize x1024 \) +append $O/$s-d-tablet-studio-x-site.png
  # (e) erros do login
  convert $ST/16b-login-acesso-corporativo-computador-estados-erro.png -resize x900 \( $C/$s/login-1440-erros-vazio.png -resize x900 \) +append $O/$s-e-login-erros-studio-x-site.png
done
# (f) os três sites lado a lado em cada tamanho
convert $C/dev-1/dashboard-1440.png $C/dev-2/dashboard-1440.png $C/dev-3/dashboard-1440.png -resize x900 +append $O/tres-sites-dashboard-1440.png
convert $C/dev-1/dashboard-390.png $C/dev-2/dashboard-390.png $C/dev-3/dashboard-390.png -resize x844 +append $O/tres-sites-dashboard-390.png
convert $C/dev-1/drawer-390.png $C/dev-2/drawer-390.png $C/dev-3/drawer-390.png -resize x844 +append $O/tres-sites-drawer-390.png
convert $C/dev-1/dashboard-768.png $C/dev-2/dashboard-768.png $C/dev-3/dashboard-768.png -resize x1024 +append $O/tres-sites-dashboard-768.png
convert $C/dev-1/login-1440.png $C/dev-2/login-1440.png $C/dev-3/login-1440.png -resize x900 +append $O/tres-sites-login-1440.png
ls -la $O
