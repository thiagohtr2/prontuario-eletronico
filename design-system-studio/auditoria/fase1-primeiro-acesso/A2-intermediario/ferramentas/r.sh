#!/bin/bash
# uso: r.sh 'codigo js'
curl -s -X POST --data-binary "$1" http://127.0.0.1:9377/run
