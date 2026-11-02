# Atelier UI — Design System Studio

Plataforma visual para quem constrói sites com IA (Claude Code, Cursor, ChatGPT…) definir **com precisão**
como o site deve ser — sem precisar saber design, CSS ou programação. Cada decisão é feita olhando
exemplos; no final o Studio gera um **Master Prompt** e uma **especificação JSON** com tudo o que foi aprovado.

> Princípio: primeiro uma arquitetura excelente, depois uma experiência visual extraordinária.

## Como rodar

```bash
cd design-system-studio
npm install
npm run dev          # http://localhost:5180
```

| Comando | O que faz |
| --- | --- |
| `npm run build` | Gera `dist/` (site estático; funciona em qualquer hospedagem, rotas por hash) |
| `npm run build:standalone` | Gera `dist-standalone/index.html`: um único arquivo que abre direto do disco, sem servidor |
| `npm run typecheck` | Verificação de tipos (TypeScript strict) |
| `npm test` | Testes unitários (Vitest) |
| `npm run test:e2e` | Testes E2E (Playwright) — rode `npm run build` antes |
| `npm run check` | Tudo acima, em sequência |

Os recursos de criação não dependem de servidor: o projeto fica salvo no navegador (localStorage) e pode
ser exportado/importado como arquivo.

## O que existe

**Modos.** Guiado (passo a passo, com explicações para leigos) e Livre (acesso direto a qualquer módulo).
Os dois usam o mesmo objeto de projeto — alternar não perde nada.

**Construtor guiado.** Esqueleto primeiro — Objetivo → Landing, login e cadastro → Desktop → Mobile →
Revisão — e só depois da aprovação o acabamento: Prévia integrada → Identidade visual → Headers e
sidebars → Componentes → Master Prompt.

**Módulos.**

| Módulo | Conteúdo |
| --- | --- |
| Objetivo do projeto | Tipo, nome, objetivo, público, funcionalidades, tecnologia, sugestões opcionais |
| Landing pages | 24 conceitos em 12 arquiteturas, prévia computador/celular, fluxos de entrada |
| Login / Cadastro | 24 composições de login e 8 fluxos de cadastro, prévia interativa Entrar ↔ Criar conta |
| Layout desktop | 42 arquiteturas em 8 famílias, desenhos didáticos com legendas, medidas recomendadas |
| Layout mobile | 44 arquiteturas, celular grande interativo (drawers, sheets, docks, stories, One Screen) |
| Live Site Preview | Todas as escolhas estruturais juntas, em computador, tablet e celular |
| Color System | 60 paletas em 10 categorias, 40+ tokens semânticos, contraste WCAG, tipografia e geometria |
| Navigation Showcase | 36 headers e 36 sidebars, duas composições cada, filtros e interatividade |
| Componentes | 66 categorias × 16 famílias visuais, editor paramétrico com edição por clique e ícones |
| Inspiration Gallery | 20 sites fictícios completos com 8 propostas de paleta cada |
| Template Studio | Templates reutilizáveis com cores, fontes, cantos e partes editáveis |
| Central de Prompts | Master Prompt, itens registrados, prompts individuais, contradições, JSON |
| Exportar e importar | Master Prompt, JSON, CSS, ficha HTML, backup; importação validada |
| Validation Lab | Configuração + executor local (`tools/validation-runner`) + prompt de correção |
| Projeto e versões | Preferências, versões salvas, restauração e limpeza com confirmação |

## Arquitetura

```
src/core/      Projeto (fonte única da verdade), store Zustand com persistência e histórico,
               validação de importação (Zod), tokens e cores, tema resolvido, glossário
src/ui/        Primitivas do Studio (White Canvas): botões, cartões selecionáveis, modais…
src/shell/     Topbar, sidebar com grupos recolhíveis, busca (Ctrl+K), breadcrumbs
src/prompt/    Motor de prompts: itens → especificação JSON → texto; conflitos; CSS; validação
src/modules/   Um diretório por módulo; `catalog.ts` só com dados, renderizadores em `.tsx`
tests/unit/    Vitest            tests/e2e/   Playwright
tools/validation-runner/   Executor local em Python + Playwright
```

- **JSON é a fonte da verdade.** `buildProjectSpec(project)` monta a especificação; o Master Prompt em texto é
  gerado a partir dela. Nada é copiado à mão entre módulos.
- **Herança global.** Prévias recebem um `ResolvedTheme` derivado da paleta + exceções explícitas.
- **Seleção sem deslocar a rolagem.** Cartões usam `keepScroll`, prévias têm tamanho fixo, nada de `scrollTo`
  ao selecionar — protegido por testes E2E.
- Regras completas para quem for mexer nos módulos: [`docs/MODULE_GUIDE.md`](docs/MODULE_GUIDE.md).

## Responsive Validation Lab

Veja [`tools/validation-runner/README.md`](tools/validation-runner/README.md). Em resumo: configure no Studio,
baixe `validation-config.json` e `runner.py`, rode `python runner.py --config validation-config.json`, importe
o `report.json` e copie o prompt de correção.
