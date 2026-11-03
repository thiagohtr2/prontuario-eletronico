#!/usr/bin/env python3
"""Monta fidelidade.md a partir de scripts/fidelidade-modelo.md + scripts/out/matrizes.md. Uso: python3 -I montar-relatorio.py"""
import pathlib
H = pathlib.Path(__file__).resolve().parent
t = (H / 'fidelidade-modelo.md').read_text()
m = (H / 'out' / 'matrizes.md').read_text()
(H.parent / 'fidelidade.md').write_text(t.replace('<!-- MATRIZES -->', m))
print('ok', len(t), len(m))
