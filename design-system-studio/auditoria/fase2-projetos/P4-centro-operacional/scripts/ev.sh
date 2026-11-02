#!/bin/bash
# Uso: ev.sh 'código js'  (ou via stdin com ev.sh -)
if [ "$1" = "-" ]; then BODY=$(cat); else BODY="$1"; fi
curl -s -m 300 -X POST --data-binary "$BODY" http://127.0.0.1:4391/eval
echo
