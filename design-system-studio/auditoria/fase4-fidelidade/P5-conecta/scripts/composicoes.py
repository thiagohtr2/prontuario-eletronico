#!/usr/bin/env python3
"""Composições lado a lado: captura aprovada no Studio + dev-1, dev-2, dev-3 (mesma altura, com rótulo).
Uso: python3 -I composicoes.py"""
import pathlib
from PIL import Image, ImageDraw, ImageFont

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent / 'composicoes'
CAP = HERE.parent / 'capturas'
ST = HERE.parents[2] / 'fase2-projetos/P5-conecta/capturas'
OUT.mkdir(exist_ok=True)
try:
    FONT = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-SemiBold.otf', 22)
except Exception:
    FONT = ImageFont.load_default()

def load(path, crop=None):
    im = Image.open(path).convert('RGB')
    if crop:
        x, y, w, h = crop
        im = im.crop((x, y, x + w, y + h))
    return im

def row(items, height, name, gap=16, label_h=36):
    ims = []
    for label, im in items:
        r = height / im.height
        ims.append((label, im.resize((max(1, round(im.width * r)), height), Image.LANCZOS)))
    W = sum(i.width for _, i in ims) + gap * (len(ims) + 1)
    canvas = Image.new('RGB', (W, height + label_h + gap * 2), (235, 235, 238))
    d = ImageDraw.Draw(canvas)
    x = gap
    for label, im in ims:
        d.text((x, gap // 2), label, fill=(27, 27, 31), font=FONT)
        canvas.paste(im, (x, label_h + gap))
        x += im.width + gap
    canvas.save(OUT / name)
    print(name, canvas.size)

def devs(suffix, crop=None):
    return [(f'dev-{i}', load(CAP / f'dev-{i}-{suffix}.png', crop)) for i in (1, 2, 3)]

# Celular 390x844: tela do app (Studio: prévia integrada do celular, aparelho 380 px)
st_cel = load(ST / '06-previa-integrada-aplicacao-celular-recorte.png', (10, 10, 360, 721))
row([('Studio (prévia integrada)', st_cel)] + devs('m390-feed'), 844, 'celular-390-feed.png')
st_cel2 = load(ST / '04-mobile-escolhido-celular-fechado.png', (22, 22, 378, 758))
row([('Studio (layout mobile)', st_cel2)] + devs('m390-feed'), 844, 'celular-390-feed-layout-mobile.png')
# Drawer aberto
st_dr = load(ST / '06-previa-integrada-aplicacao-celular-drawer-aberto.png', (10, 10, 360, 721))
row([('Studio (drawer aberto)', st_dr)] + devs('m390-drawer'), 844, 'celular-390-drawer.png')
# 360x800
row([('Studio (prévia integrada)', st_cel)] + devs('m360-feed'), 800, 'celular-360-feed.png')
row([('Studio (drawer aberto)', st_dr)] + devs('m360-drawer'), 800, 'celular-360-drawer.png')
# Dock (base da tela) – recorte dos últimos 120 px
st_dock = load(ST / '06-previa-integrada-aplicacao-celular-recorte.png', (10, 610, 360, 100))
dd = [(f'dev-{i}', load(CAP / f'dev-{i}-m390-feed.png', (0, 2532 - 330, 1170, 330))) for i in (1, 2, 3)]
row([('Studio (dock)', st_dock)] + dd, 160, 'celular-390-dock-detalhe.png')
# Topo: topbar + stories
st_top = load(ST / '06-previa-integrada-aplicacao-celular-recorte.png', (10, 40, 360, 150))
dt = [(f'dev-{i}', load(CAP / f'dev-{i}-m390-feed.png', (0, 0, 1170, 470))) for i in (1, 2, 3)]
row([('Studio (topbar + stories)', st_top)] + dt, 200, 'celular-390-topo-detalhe.png')
# Login celular
st_lg = load(ST / '06-previa-integrada-login-celular.png', (509, 398, 387, 437))
row([('Studio (login celular)', st_lg)] + devs('m390-login-tela'), 844, 'login-celular-390.png')
# Perfil (componente aprovado) x perfil construído
st_pf = load(ST / '09-componente-perfil-editor.png', (134, 204, 629, 242))
row([('Studio (componente Perfil)', st_pf)] + devs('m390-perfil'), 600, 'perfil-celular-390.png')
# Card aprovado x feed
st_cd = load(ST / '09-componente-card-conteudo-editor.png', (284, 218, 329, 374))
row([('Studio (componente Card)', st_cd)] + devs('m390-feed', (0, 600, 1170, 1350)), 600, 'card-celular-390.png')
# Dock (componente) x dock construído
st_dk = load(ST / '09-componente-menu-inferior-dock-editor.png', (348, 272, 200, 263))
row([('Studio (componente Dock)', st_dk)] + devs('m390-feed'), 600, 'dock-componente-390.png')
# Desktop 1440x900
st_dk1440 = load(ST / '06-previa-integrada-aplicacao-computador-recorte.png', (0, 0, 804, 440))
row([('Studio (computador)', st_dk1440)] + devs('d1440-feed'), 900, 'desktop-1440-feed.png')
# Header desktop
st_hd = load(ST / '08-header-praca-da-comunidade-card.png', (2, 2, 1104, 62))
for i in (1, 2, 3):
    pass
hd = [(f'dev-{i}', load(CAP / f'dev-{i}-d1440-feed.png', (0, 0, 1440, 70))) for i in (1, 2, 3)]
# empilhado (mesma largura)
ims = [('Studio (header Praça da Comunidade A)', st_hd)] + hd
Wt = 1440
blocks = []
for label, im in ims:
    r = Wt / im.width
    blocks.append((label, im.resize((Wt, round(im.height * r)), Image.LANCZOS)))
H = sum(b.height + 44 for _, b in blocks) + 16
canvas = Image.new('RGB', (Wt + 32, H), (235, 235, 238))
d = ImageDraw.Draw(canvas)
y = 8
for label, b in blocks:
    d.text((16, y), label, fill=(27, 27, 31), font=FONT); y += 32
    canvas.paste(b, (16, y)); y += b.height + 12
canvas.save(OUT / 'header-desktop-1440.png'); print('header-desktop-1440.png', canvas.size)
# Login desktop
st_ld = load(ST / '06-previa-integrada-login-computador.png', (301, 398, 802, 437))
row([('Studio (login computador)', st_ld)] + devs('d1440-login'), 600, 'login-desktop-1440.png')
# Tablet 768
st_tb = load(ST / '06-previa-integrada-aplicacao-tablet.png')
row(devs('t768-feed'), 900, 'tablet-768-feed.png')
row(devs('t768-painel'), 900, 'tablet-768-painel-menu.png')
# Paisagem
row(devs('land667-feed'), 375, 'paisagem-667x375.png')
row(devs('land667-feed-rolado'), 375, 'paisagem-667x375-rolado.png')
row(devs('land-feed'), 390, 'paisagem-844x390.png')
# 320
row(devs('m320-feed'), 640, 'celular-320-feed.png')
row(devs('m320-drawer'), 640, 'celular-320-drawer.png')
