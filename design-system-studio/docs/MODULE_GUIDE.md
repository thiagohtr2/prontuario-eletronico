# Guia de módulos — Atelier UI / Design System Studio

Leia antes de mexer em qualquer módulo. Vale para pessoas e agentes.

## Stack

React 18 + TypeScript (strict) + Vite 5, Zustand 5 (estado), Zod (importação), lucide-react (ícones),
Vitest + Testing Library (unidade), Playwright (E2E). Rotas por hash (`#/modulos/landing`), para funcionar
como site estático e em arquivo único. Alias `@/` = `src/`.

## Mapa

```
src/core/       tipos, projeto (fonte única da verdade), store, tokens, cores, tema, glossário, download
src/ui/         primitivas do Studio (Button, OptionCard, Modal, Segmented, FilterChips, Field, Switch, ...)
src/shell/      topbar, sidebar, busca de funcionalidades, breadcrumbs
src/prompt/     motor de prompts: itens, conflitos, especificação JSON, texto, CSS, PromptButton
src/modules/    um diretório por módulo
tests/unit/     Vitest        tests/e2e/   Playwright
```

## Regras de arquitetura

1. **Fonte única da verdade.** Todas as escolhas do projeto ficam em `useStudio().project`
   (`src/core/project.ts`, `src/core/store.ts`). Use somente as ações da store para alterar o projeto.
   Estado de interface passageiro (filtro aberto, aba, modal) pode ser `useState` local.
2. **Dados separados da renderização.** `catalog.ts` contém apenas dados tipados — sem JSX, sem
   importar `.tsx`. O motor de prompts e os testes leem os catálogos sem renderizar nada.
   Renderizadores ficam em `.tsx`. Mantenha os nomes exportados dos catálogos e das funções `…ById`.
3. **Cada item de catálogo tem `spec`** (`ItemSpec`): `summary`, `structure`, `behavior`,
   `responsive` (obrigatório, nunca vazio), `measurements`, `notes`. É daí que sai o Master Prompt.
   Escreva specs técnicas e específicas do item, não genéricas.
4. **Herança global.** Prévias que herdam a identidade recebem `ResolvedTheme`
   (`useResolvedTheme()` de `@/core/theme`) e usam `theme.tokens.*` e `theme.metrics.*` em estilos
   inline. Nada de cores fixas onde a herança se aplica. `surfaceStyle(theme)` (de `@/core/tokens`)
   devolve o fundo/borda/sombra da superfície conforme a geometria escolhida.
5. **Seletores da store.** Em Zustand 5, um seletor que devolve objeto/array novo a cada chamada causa
   loop infinito. Selecione primitivos (`useProject(p => p.layout.desktopId)`) ou use `useShallow`
   (`zustand/react/shallow`) para objetos.
6. **Seleção sem deslocar a rolagem.** Clique em miniatura, filtro ou opção nunca move a página:
   - use `OptionCard` (já envolve o clique em `keepScroll`) ou chame `keepScroll(fn)` de `@/ui`;
   - nunca `scrollTo`/`scrollIntoView`/`focus()` sem `preventScroll` após uma seleção;
   - não desmonte/remonte a galeria ao selecionar; não use `key` que mude com a seleção;
   - painéis de prévia têm **tamanho fixo** (a troca de modelo não muda a altura da página);
   - o estado "selecionado" é borda + selo absoluto, sem alterar a altura do cartão.
7. **Hierarquia de ações, sem duplicação.** Em cada cartão: a ação principal é o próprio clique
   (selecionar = aprovar e incluir no Master Prompt). Ações secundárias: "Ver prévia"/"Personalizar".
   Terciária: `<PromptButton target={…} />` (de `@/prompt/PromptButton`) = "Gerar prompt deste
   elemento". Nunca dois botões com a mesma finalidade no mesmo cartão.
8. **Identidade do Studio (White Canvas).** Interface branca, bordas finas (`--s-border`),
   tipografia e espaço para separar — sem fundos cinza para diferenciar caixas e sem sombras
   decorativas (só modais/popovers/toasts). Escala de espaço 4/8/12/16/20/24/32/40 (`--sp-1..8`).
   Fontes mínimas: 12,5 px em metadados, 13,5 px em filtros/botões pequenos. Áreas de toque ≥ 36–44 px.
   **Prévias de sites/componentes preservam as próprias cores** — não confunda com a identidade do Studio.
9. **CSS do módulo.** Um arquivo `.css` por módulo, importado pelo `.tsx`, com prefixo próprio de classes
   (ex.: `.lay-`, `.ent-`). Não sobrescreva classes `ui-*`/`shell-*`. Use as variáveis de `styles/tokens.css`.
10. **Responsivo de verdade.** Toda página do Studio funciona de 320 px a 1920 px sem overflow horizontal.
    Grids com `minmax(0, 1fr)`, `min-width: 0` em filhos flex/grid, textos que quebram.
11. **Acessível.** Botões são `<button>`, seleção com `aria-pressed`, menus por teclado (Esc fecha),
    `aria-label` em botões de ícone, foco visível.
12. **Para leigos.** Textos em português do Brasil, simples. Termos técnicos com explicação curta
    (`<Term id="drawer" />` de `@/ui` usa `src/core/glossary.ts`). Respeite `project.prefs.showHints`
    (dicas) e `project.prefs.showLegends` (etiquetas dos desenhos, compartilhada desktop/mobile).
13. **Conteúdo original.** Marcas fictícias. Não copie sites, logos ou identidades reais.
    Ilustrações em SVG/CSS inline (o Studio funciona offline — nada de imagens externas).
14. **Modo guiado.** As galerias exportadas recebem `guided?: boolean`. No modo guiado: menos filtros
    técnicos, mais explicação, sem parâmetros desnecessários. Mesmos dados e mesma store.

## Primitivas disponíveis (`@/ui`)

`Button` (variant primary|secondary|ghost|soft|danger, size sm|md|lg, icon), `IconButton` (label obrigatório),
`Actions` (grupo com gap), `Switch`, `Segmented`, `DeviceToggle`, `FilterChips`, `Badge`, `Field`, `Input`,
`Textarea`, `Select`, `SearchInput`, `PageHeader`, `Section`, `Callout`, `EmptyState`, `Tabs`, `OptionCard`,
`keepScroll`, `Term`, `Modal`, `toast`, `CopyButton`, `copyText`, `cx`.
Classes úteis: `ui-page`, `ui-grid` (com `--min`), `ui-toolbar`, `ui-card`, `ui-code`, `u-stack`, `u-row`, `u-muted`.

Download/exportação: `downloadFile`, `downloadJson`, `htmlDocument`, `slugify` (`@/core/download`).
CSS de tokens: `themeToCssVariables(theme)` (`@/prompt/css`). Fontes: `FONT_OPTIONS`, `fontStack(id)` (`@/core/tokens`).

## Verificação

- Tipos do seu módulo: `npx tsc -p tsconfig.app.json --noEmit 2>&1 | grep "src/modules/<modulo>"` (vazio = ok).
- Testes: `npx vitest run tests/unit/<arquivo>`.
- Visual: `npx vite --port <porta>` e um script Node com `require('playwright')` (`chromium.launch()` sem opções)
  para capturar telas em 1440 px e 375 px, checar erros de console e
  `document.documentElement.scrollWidth <= window.innerWidth`.
