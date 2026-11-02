#!/bin/bash
# Envia código JS (stdin ou arquivo) para o daemon e mostra o resultado.
if [ -n "$1" ]; then curl -sS --max-time 300 -X POST --data-binary @"$1" http://127.0.0.1:9341/; else curl -sS --max-time 300 -X POST --data-binary @- http://127.0.0.1:9341/; fi
echo
