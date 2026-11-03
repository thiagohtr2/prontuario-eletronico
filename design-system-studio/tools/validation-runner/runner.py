#!/usr/bin/env python3
"""
Atelier UI — Responsive Validation Runner

Executor local que abre um site em várias larguras de tela e procura problemas de
responsividade. Desde a versão 1.1 também confere o site contra os fatos da especificação
exportada pelo Studio (marca, itens do menu, altura do header, largura da sidebar, navegação
inferior do celular, fontes e cor primária). Gera um relatório JSON que pode ser importado no Studio
(Ferramentas → Validação responsiva) para gerar um prompt de correção.

Uso:
    pip install playwright
    python -m playwright install chromium
    python runner.py --config validation-config.json --out report.json

Segurança:
    - Visita SOMENTE a URL base e as rotas listadas na configuração (mesma origem).
    - Não clica, não envia formulários e não executa ações destrutivas.
    - Com "manualLogin": true, abre uma janela para você entrar com SUA conta de teste;
      a senha nunca passa por este script e a sessão não é salva em disco.
    - O relatório não contém cookies, tokens, textos da página nem capturas de tela:
      apenas seletores dos elementos, medidas e descrições dos problemas.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
from urllib.parse import urljoin, urlparse

TOOL_NAME = "atelier-ui-validation-runner/1.1"

DETECTOR_JS = r"""
(opts) => {
  const vw = window.innerWidth;
  const issues = [];
  const isMobile = vw < 768;

  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const cls = (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/).filter(Boolean).slice(0, 3);
    if (cls.length) s += '.' + cls.join('.');
    const role = el.getAttribute('role');
    if (role) s += `[role="${role}"]`;
    return s.slice(0, 140);
  };

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) return false;
    // Elementos posicionados acima do início do documento (ex.: link "pular para o conteúdo") não são visíveis.
    if (r.bottom + window.scrollY <= 0) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0;
  };

  // Elementos dentro de contêineres com rolagem/corte horizontal próprios não "vazam" a página.
  const clippedByAncestor = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX;
      if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') return true;
    }
    return false;
  };

  const all = Array.from(document.body.querySelectorAll('*')).filter((el) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'BR'].includes(el.tagName));

  if (opts.horizontalOverflow) {
    const sw = document.documentElement.scrollWidth;
    if (sw > vw + 1) {
      issues.push({
        type: 'overflow-horizontal',
        severity: 'alta',
        element: 'document',
        description: `A página tem ${sw - vw}px de rolagem horizontal involuntária (largura do conteúdo ${sw}px em uma tela de ${vw}px).`,
        suggestion: 'Encontre o elemento mais largo que a tela (lista abaixo) e use max-width: 100%, min-width: 0 em filhos flex/grid, quebra de texto (overflow-wrap: anywhere) ou rolagem local (overflow-x: auto) em tabelas.',
      });
      const culprits = all.filter((el) => {
        if (!visible(el) || clippedByAncestor(el)) return false;
        const r = el.getBoundingClientRect();
        return r.right > vw + 1;
      });
      // Mantém os mais internos (cujos filhos não vazam), que costumam ser a causa.
      const leaf = culprits.filter((el) => !culprits.some((o) => o !== el && el.contains(o)));
      leaf.slice(0, 10).forEach((el) => {
        const r = el.getBoundingClientRect();
        issues.push({
          type: 'elemento-mais-largo-que-a-tela',
          severity: 'alta',
          element: describe(el),
          description: `Elemento termina em ${Math.round(r.right)}px (largura ${Math.round(r.width)}px), além da tela de ${vw}px.`,
          suggestion: 'Limite a largura (max-width: 100%), permita quebra de linha ou mova o conteúdo largo para um contêiner com overflow-x: auto.',
        });
      });
    }
  }

  if (opts.offscreen) {
    all
      .filter((el) => visible(el) && !clippedByAncestor(el))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.left < -1 && r.right > 0;
      })
      .filter((el, _i, arr) => !arr.some((o) => o !== el && o.contains(el)))
      .slice(0, 10)
      .forEach((el) => {
        const r = el.getBoundingClientRect();
        issues.push({
          type: 'fora-da-tela',
          severity: 'media',
          element: describe(el),
          description: `Elemento começa ${Math.round(-r.left)}px antes da borda esquerda da tela e fica parcialmente cortado.`,
          suggestion: 'Revise margens negativas, transformações e posicionamento absoluto; em telas pequenas mantenha o elemento dentro da área visível.',
        });
      });
  }

  if (opts.tapTargets && isMobile) {
    const selector = 'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [onclick]';
    Array.from(document.querySelectorAll(selector))
      .filter(visible)
      .filter((el) => {
        // Exceção WCAG 2.5.8: alvos inline dentro de uma frase (links, termos com explicação).
        if (getComputedStyle(el).display === 'inline') {
          let block = el.parentElement;
          while (block && ['inline', 'contents'].includes(getComputedStyle(block).display)) block = block.parentElement;
          if (block && block.textContent.trim().length > el.textContent.trim().length + 3) return false;
        }
        const r = el.getBoundingClientRect();
        return r.width < opts.minTapTarget || r.height < opts.minTapTarget;
      })
      .slice(0, 25)
      .forEach((el) => {
        const r = el.getBoundingClientRect();
        issues.push({
          type: 'alvo-de-toque-pequeno',
          severity: 'media',
          element: describe(el),
          description: `Área de toque de ${Math.round(r.width)}×${Math.round(r.height)}px, menor que ${opts.minTapTarget}×${opts.minTapTarget}px.`,
          suggestion: `Aumente a área clicável para pelo menos ${opts.minTapTarget}×${opts.minTapTarget}px (padding ou min-height/min-width) e mantenha 8px entre alvos vizinhos.`,
        });
      });
  }

  if (opts.inputFontSize && isMobile) {
    Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), select, textarea'))
      .filter(visible)
      .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
      .slice(0, 15)
      .forEach((el) => {
        issues.push({
          type: 'fonte-pequena-em-campo',
          severity: 'baixa',
          element: describe(el),
          description: `Campo com fonte de ${getComputedStyle(el).fontSize}; no iOS, menos de 16px provoca zoom automático ao focar.`,
          suggestion: 'Use font-size: 16px (ou maior) em inputs, selects e textareas em telas pequenas.',
        });
      });
  }

  return issues;
}
"""

FIDELITY_JS = r"""
(opts) => {
  const out = [];
  const vw = window.innerWidth, vh = window.innerHeight;
  const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 1 && r.height > 1 && r.right > 0 && r.left < vw && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0;
  };
  const add = (id, label, expected, measured, ok) => out.push({ id, label, width: vw, expected: String(expected), measured: String(measured), ok: Boolean(ok) });
  const leafTexts = () =>
    Array.from(document.querySelectorAll('a, button, [role="tab"], [role="menuitem"], li, span, p, strong, h1, h2, h3, h4, div'))
      .filter((el) => el.matches('a, button, [role="tab"], [role="menuitem"]') || el.children.length === 0)
      .filter(visible)
      .map((el) => norm(el.textContent));
  const hasText = (texts, item) => texts.some((t) => t === norm(item) || t.startsWith(norm(item) + ' ') || t.endsWith(' ' + norm(item)));
  const rgb = (hex) => {
    const h = (hex || '').replace('#', '');
    if (h.length !== 6) return null;
    return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
  };
  const sidebarLike = () =>
    Array.from(document.querySelectorAll('aside, nav, [role="navigation"], [class*="sidebar" i]'))
      .filter(visible)
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.left <= 24 && r.height >= vh * 0.6 && r.width >= 48 && r.width <= 440);

  if (opts.brand) {
    const found = norm(document.body.innerText).includes(norm(opts.brand));
    add('brand', 'Marca do projeto visível', `“${opts.brand}”`, found ? 'encontrada' : 'não encontrada', found);
  }

  if (opts.phase === 'desktop') {
    if (opts.navItems && opts.navItems.length) {
      const texts = leafTexts();
      const found = opts.navItems.filter((n) => hasText(texts, n));
      add('nav-desktop', 'Itens do menu visíveis no computador', `${opts.navItems.length} itens`, `${found.length} encontrados`, found.length === opts.navItems.length);
    }
    if (opts.headerHeight) {
      const cands = Array.from(document.querySelectorAll('header, [role="banner"], [class*="header" i], [class*="topbar" i]'))
        .filter(visible)
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.top <= 4 && r.height >= 32 && r.height <= 200 && r.width >= vw * 0.4);
      const pick = cands.find(({ el }) => el.matches('header, [role="banner"]')) || cands[0];
      if (pick) {
        const h = Math.round(pick.r.height);
        add('header-height', 'Altura do header', `${opts.headerHeight} px`, `${h} px`, Math.abs(h - opts.headerHeight) <= 4);
      } else add('header-height', 'Altura do header', `${opts.headerHeight} px`, 'header não encontrado', false);
    }
    if (opts.sidebarWidth) {
      const cands = sidebarLike();
      if (cands.length) {
        const w = Math.round(Math.max(...cands.map((r) => r.width)));
        add('sidebar-width', 'Largura da sidebar', `${opts.sidebarWidth} px`, `${w} px`, Math.abs(w - opts.sidebarWidth) <= 8);
      } else add('sidebar-width', 'Largura da sidebar', `${opts.sidebarWidth} px`, 'sidebar não encontrada', false);
    }
    if (opts.fonts) {
      const bodyFont = norm(getComputedStyle(document.body).fontFamily);
      add('font-body', 'Fonte dos textos', opts.fonts.body, bodyFont.split(',')[0] || '—', bodyFont.includes(norm(opts.fonts.body)));
      const heading = Array.from(document.querySelectorAll('h1, h2')).find(visible);
      if (heading) {
        const hf = norm(getComputedStyle(heading).fontFamily);
        add('font-heading', 'Fonte dos títulos', opts.fonts.heading, hf.split(',')[0] || '—', hf.includes(norm(opts.fonts.heading)));
      }
    }
    const primary = rgb(opts.primary);
    if (primary) {
      const used = Array.from(document.querySelectorAll('button, a, [role="button"], [aria-current], [class*="active" i]'))
        .filter(visible)
        .some((el) => { const cs = getComputedStyle(el); return cs.backgroundColor === primary || cs.color === primary || cs.borderColor === primary; });
      add('primary', 'Cor primária em ações', opts.primary, used ? 'usada' : 'não usada em botões, links ou item ativo', used);
    }
  } else {
    if (opts.bottomSlots) {
      const bars = Array.from(document.querySelectorAll('nav, [role="navigation"], [role="tablist"], footer, div'))
        .filter(visible)
        .map((el) => ({ el, r: el.getBoundingClientRect(), pos: getComputedStyle(el).position }))
        .filter(({ r, pos }) => (pos === 'fixed' || pos === 'sticky') && r.bottom >= vh - 8 && r.height <= 140 && r.width >= vw * 0.6);
      const bar = bars.find(({ el }) => el.querySelectorAll('a, button, [role="tab"]').length >= 2);
      const count = bar ? Array.from(bar.el.querySelectorAll('a, button, [role="tab"]')).filter(visible).length : 0;
      const expected = Math.min(opts.bottomSlots, Math.max(opts.navItems ? opts.navItems.length : opts.bottomSlots, 1));
      add('bottom-nav', 'Navegação inferior no celular', `${expected} destinos`, bar ? `${count} destinos` : 'barra inferior não encontrada', Boolean(bar) && count === expected);
    }
    if (opts.drawer) {
      const trigger = Array.from(document.querySelectorAll('button, [role="button"]')).filter(visible).find((el) => /menu/i.test(el.getAttribute('aria-label') || '') || el.hasAttribute('aria-controls'));
      add('drawer-trigger', 'Botão do menu lateral (☰) no celular', 'presente', trigger ? 'presente' : 'ausente', Boolean(trigger));
    }
    if (opts.sidebarWidth) {
      const cands = sidebarLike().filter((r) => r.width < vw * 0.9);
      add('sidebar-hidden-mobile', 'Sidebar do computador fora da tela no celular', 'oculta', cands.length ? 'visível' : 'oculta', cands.length === 0);
    }
  }
  return out;
}
"""


def load_config(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as fh:
        cfg = json.load(fh)
    if cfg.get("kind") == "atelier-ui/validation-config":
        cfg = cfg.get("config", cfg)
    url = (cfg.get("url") or "").strip()
    if not url or urlparse(url).scheme not in ("http", "https"):
        raise SystemExit("Configuração inválida: informe uma URL http(s) em \"url\".")
    widths = [int(w) for w in cfg.get("widths") or []]
    if not widths:
        raise SystemExit("Configuração inválida: informe ao menos uma largura em \"widths\".")
    routes = [r.strip() or "/" for r in cfg.get("routes") or ["/"]]
    checks = {
        "horizontalOverflow": True,
        "offscreen": True,
        "tapTargets": True,
        "inputFontSize": True,
        **(cfg.get("checks") or {}),
    }
    return {
        "url": url,
        "routes": routes,
        "widths": widths,
        "manualLogin": bool(cfg.get("manualLogin")),
        "waitMs": int(cfg.get("waitMs") or 800),
        "minTapTarget": int(cfg.get("minTapTarget") or 44),
        "checks": checks,
        "expect": cfg.get("expect") if checks.get("fidelity", True) else None,
    }


def same_origin(a: str, b: str) -> bool:
    pa, pb = urlparse(a), urlparse(b)
    return (pa.scheme, pa.netloc) == (pb.scheme, pb.netloc)


def run(cfg: dict, headed: bool, channel: str | None = None, browser_path: str | None = None) -> dict:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:  # pragma: no cover - mensagem amigável
        raise SystemExit("Playwright não instalado. Rode: pip install playwright && python -m playwright install chromium")

    issues: list[dict] = []
    pages: list[str] = []
    with sync_playwright() as p:
        launch_args: dict = {"headless": not (headed or cfg["manualLogin"])}
        if channel:
            launch_args["channel"] = channel
        if browser_path:
            launch_args["executable_path"] = browser_path
        browser = p.chromium.launch(**launch_args)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        if cfg["manualLogin"]:
            page.goto(cfg["url"], wait_until="load")
            print("\nUma janela do navegador foi aberta.")
            print("Faça login com uma CONTA DE TESTE e, quando terminar, pressione Enter aqui.")
            input("Pressione Enter para continuar… ")

        for route in cfg["routes"]:
            target = urljoin(cfg["url"], route)
            if not same_origin(target, cfg["url"]):
                print(f"Ignorando rota fora da origem autorizada: {route}")
                continue
            pages.append(route)
            for width in cfg["widths"]:
                height = 800 if width >= 768 else 780
                page.set_viewport_size({"width": width, "height": height})
                try:
                    page.goto(target, wait_until="load", timeout=45000)
                except Exception as exc:  # noqa: BLE001
                    issues.append({
                        "page": route, "width": width, "type": "erro-ao-carregar", "severity": "alta",
                        "element": "document", "description": f"A página não carregou: {type(exc).__name__}.",
                        "suggestion": "Verifique se a rota existe e se o servidor está acessível.",
                    })
                    continue
                page.wait_for_timeout(cfg["waitMs"])
                found = page.evaluate(DETECTOR_JS, {**cfg["checks"], "minTapTarget": cfg["minTapTarget"]})
                for item in found:
                    issues.append({"page": route, "width": width, **item})
                print(f"  {route} @ {width}px — {len(found)} ocorrência(s)")

        fidelity: list[dict] = []
        if cfg.get("expect") and pages:
            target = urljoin(cfg["url"], pages[0])
            exp = cfg["expect"]
            for phase, width in (("desktop", int(exp.get("desktopWidth") or 1280)), ("mobile", int(exp.get("mobileWidth") or 390))):
                page.set_viewport_size({"width": width, "height": 800 if width >= 768 else 780})
                try:
                    page.goto(target, wait_until="load", timeout=45000)
                    page.wait_for_timeout(cfg["waitMs"])
                    fidelity.extend(page.evaluate(FIDELITY_JS, {**exp, "phase": phase}))
                except Exception as exc:  # noqa: BLE001
                    print(f"  fidelidade @ {width}px não conferida: {type(exc).__name__}")
            ok = sum(1 for r in fidelity if r.get("ok"))
            print(f"  fidelidade à especificação: {ok}/{len(fidelity)} fato(s) conferem")

        context.close()
        browser.close()

    return {
        "tool": TOOL_NAME,
        "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "baseUrl": cfg["url"],
        "widths": cfg["widths"],
        "pages": pages,
        "issues": issues,
        "fidelity": fidelity,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Atelier UI — validação de responsividade")
    parser.add_argument("--config", required=True, help="Arquivo JSON de configuração exportado pelo Studio")
    parser.add_argument("--out", default="report.json", help="Arquivo de relatório a gerar (padrão: report.json)")
    parser.add_argument("--headed", action="store_true", help="Mostra a janela do navegador durante os testes")
    parser.add_argument("--channel", help="Usa um navegador instalado no sistema: chrome ou msedge")
    parser.add_argument("--browser-path", help="Caminho de um executável Chromium/Chrome específico")
    args = parser.parse_args(argv)

    cfg = load_config(args.config)
    print(f"Validando {cfg['url']} em {len(cfg['routes'])} rota(s) × {len(cfg['widths'])} largura(s)…")
    report = run(cfg, args.headed, args.channel, args.browser_path)
    with open(args.out, "w", encoding="utf-8") as fh:
        json.dump(report, fh, ensure_ascii=False, indent=2)
    print(f"\nRelatório salvo em {args.out}: {len(report['issues'])} ocorrência(s).")
    print("Importe-o no Studio em Ferramentas → Validação responsiva.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
