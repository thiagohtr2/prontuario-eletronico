#!/usr/bin/env bash
# Lighthouse 13 (desempenho) no build congelado — 3 execuções por URL e formato.
# Uso: bash lighthouse.sh
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
LH="$HERE/../ferramentas/lh/node_modules/.bin/lighthouse"
OUT="$HERE/../dados/lighthouse"
mkdir -p "$OUT"
export CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
for url in "http://127.0.0.1:4300/#/" "http://127.0.0.1:4300/#/modulos/mobile" "http://127.0.0.1:4300/#/modulos/inspiracao"; do
  slug=$(echo "$url" | sed 's#.*\#/##; s#/#-#g'); [ -z "$slug" ] && slug=home
  for preset in mobile desktop; do
    for i in 1 2 3; do
      extra=""; [ "$preset" = desktop ] && extra="--preset=desktop"
      "$LH" "$url" $extra --only-categories=performance --output=json --output-path="$OUT/$slug-$preset-$i.json" \
        --chrome-flags="--headless --no-sandbox" --quiet || echo "falhou $slug $preset $i"
      echo "$(date +%T) $slug $preset $i load=$(cut -d' ' -f1 /proc/loadavg)" >> "$OUT/execucoes.log"
    done
  done
done
