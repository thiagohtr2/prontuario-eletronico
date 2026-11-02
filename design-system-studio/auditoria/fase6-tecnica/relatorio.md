# Fase 6 — Auditoria técnica: arquitetura, frontend React/TypeScript e desempenho

Objeto: build de produção congelado (commit `e4c79f3`, servido em `http://127.0.0.1:4300/`) e o código-fonte em
`design-system-studio/`. Nada no produto foi alterado. Toda análise que precisou executar código TypeScript rodou numa
**cópia isolada** em `ferramentas/cov/` (cópia de `src/`, `tests/` e `node_modules`, com `@vitest/coverage-v8` instalado só ali).

> Documento em construção incremental — as seções 5 a 9 são completadas ao fim das medições.

## 1. Método, ambiente e interferência

| Item | Valor |
| --- | --- |
| Máquina | 4 CPUs compartilhadas, 16 GB RAM, Chromium 1243 headless (Playwright 1.63), Node 22 |
| Servidor do build | `python3 -m http.server` — HTTP/1.0, **sem compressão** e sem cabeçalhos de cache (bytes medidos = bytes brutos) |
| Interferência | load average entre **9 e 21** durante as medições (outros agentes rodando Chromium em paralelo). Todos os tempos absolutos estão inflados; as comparações relativas entre rotas/galerias são mais confiáveis que os valores absolutos. A carga do momento é registrada em cada linha dos dados brutos (`loadavg`). |
| Repetições | carga a frio: 5× desktop (1440×900) e 3× celular (390×844) por rota; galerias: 3 rodadas × 10 cliques; memória: 3 rodadas × 3 voltas por 18 rotas; Lighthouse: 3× por URL e perfil. Reporto **mediana** (e mín–máx quando relevante). |
| Verificações só de leitura no repositório | `npx tsc -b --noEmit` (0 erros, 28,7 s) e `npx vitest run` (8 arquivos, **235 testes, todos passam**, 27 s) — saídas em `dados/tsc.txt` e `dados/vitest.txt` |

Scripts (todos em `scripts/`): `analise-motor.test.ts`, `sondas.test.ts`, `variante-b.test.ts` (rodam na cópia isolada com
Vitest), `perf-lib.cjs`, `perf-carga.cjs`, `perf-galerias.cjs`, `perf-memoria.cjs`, `robustez.cjs`, `lighthouse.sh`.
Dados em `dados/` (JSON brutos + resumos).

## 2. Arquitetura

### 2.1 Estrutura e tamanho

`src/` tem 168 arquivos e **65 847 linhas**: 35 800 em renderizadores `.tsx`, 15 473 em catálogos/dados `.ts`, 10 420 de CSS e
só 4 154 de lógica `.ts` (core, prompt, store). Os seis módulos de galeria concentram 85 % do código:
navigation 11 055, inspiration 9 979, templates 9 757, layouts 8 770, entry 8 298, components 8 131 linhas. Catálogos: 60
paletas, 24 landings, 24 logins, 8 cadastros, 42 layouts desktop, 44 mobile, 36 headers, 36 sidebars, 66 categorias × 16
famílias de componentes (1 056 combinações), 20 sites de inspiração e 28 templates (`dados/analise-motor.json → catalogos`).

A organização em `core/ · ui/ · shell/ · prompt/ · modules/<módulo>/` é clara, documentada em `docs/MODULE_GUIDE.md`, e as
rotas são carregadas com `React.lazy` (`src/App.tsx:7-25`). TypeScript `strict` sem erros.

### 2.2 Fronteiras: catálogos só-dados × renderizadores

- A regra 2 do guia é cumprida no sentido literal: nenhum `catalog*.ts` importa `.tsx` (verificado por script,
  `dados/acoplamento.txt`).
- **Mas os catálogos misturam três responsabilidades**: a receita visual (`look`), o **conteúdo de demonstração** (marca,
  itens de menu, breadcrumbs, textos) e a **geração do texto do prompt**. Exemplo: `headerSpec()` em
  `src/modules/navigation/catalog.ts:132-245` monta frases como “Navegação principal com 4 itens (Produto, Recursos, Preços,
  Sobre)” diretamente da receita de demonstração (linhas 149, 153, 167); `sidebarSpec()` faz o mesmo em `:1555-1565`
  (“Itens: “Geral”: Início, Painel, Projetos (12)…”). É essa mistura que leva o conteúdo fictício para o Master Prompt (ver 4.3).
- A spec de header/sidebar é gerada **uma única vez por modelo, a partir da composição A** (`spec: headerSpec(d)` em
  `catalog.ts:270` e `sidebarSpec(d)` em `:1662`); a composição B (que altera altura, logo, utilitários) não gera texto
  próprio. Medido: em `gazeta-aurora` a variante B tem 60 px, mas o prompt da variante B diz “altura (desktop): 88 px”; o
  mesmo em `blocos-bento` (56 × 76 px). 7 sidebars também têm receita B diferente (`dados/variante-b.json`).

### 2.3 Acoplamento

Grafo de imports entre áreas (`dados/acoplamento.txt`):

- `prompt/` importa catálogos e `describe` de **7 módulos** (`src/prompt/items.ts:1-17`, `conflicts.ts:1-6`), e os 7 módulos
  importam `prompt/` (por causa do `PromptButton`) → **dependência circular prompt ↔ módulos** em todos os módulos de galeria.
- `core/` depende de um módulo: `src/core/theme.ts:2` importa `@/modules/color/catalog` (core ↔ modules/color).
- `PromptButton` (`src/prompt/PromptButton.tsx:6-7`) importa estaticamente `items.ts` + `text.ts`, logo **qualquer página que
  mostre um botão “Prompt deste elemento” baixa o motor inteiro e todos os catálogos** (10 arquivos de módulos o usam).
- `modules/home/status.ts:1-7` importa os 7 catálogos só para mostrar nomes no início → a tela inicial baixa 874 KB de JS
  (ver seção 5).
- `modules/guided` importa 9 outras áreas (é o orquestrador do modo guiado) → a rota `/guiado/*` baixa 38 arquivos e
  1,69 MB de JS de uma vez.

Consequência prática: o code splitting existe, mas é anulado pelo grafo — cada rota de módulo carrega entre 1,10 e 1,48 MB de
JS bruto (338–434 KB gzip) mesmo quando o módulo em si tem poucos KB (ex.: `ColorPage` = 0,8 KB, mas a rota pesa 1,12 MB).

### 2.4 Código duplicado entre módulos (kits de prévia)

Cada galeria tem o próprio “kit” de primitivas de prévia, com a mesma função reimplementada:

| Primitiva | Implementações |
| --- | --- |
| `Btn` (botão de prévia) | 5 — `components/kit.tsx:294`, `templates/render/kit.tsx:449`, `navigation/stages.tsx:20`, `entry/LandingPreview.tsx:173`, `entry/AuthPreview.tsx:287` |
| `Avatar` | 4 — `components/kit.tsx:628`, `templates/render/kit.tsx:600`, `inspiration/sites/kit.tsx:164`, `layouts/phone.tsx:308` |
| `Wrap` (contêiner) | 3 — `templates/render/kit.tsx:289`, `inspiration/sites/kit.tsx:72`, `entry/LandingPreview.tsx:165` |
| Ícones | 4 sistemas — `components/icons.tsx` + `Ico`, `navigation/icons.tsx`, `templates/render/kit.tsx:229`, `inspiration/sites/kit.tsx:141` |
| Moldura/miniatura escalada | 5 — `entry/frames.tsx` (ScaledThumb, FitFrame), `templates/frames.tsx`, `inspiration/SiteFrames.tsx` (BrowserFrame, PhoneFrame), `navigation/stages.tsx:512` (PhoneFrame), `layouts/shared.tsx` (FitSchematic) |
| Hook de largura com ResizeObserver | 4 — `entry/frames.tsx:6`, `layouts/shared.tsx:10` (ambos `useElementWidth`, com assinaturas diferentes), `navigation/menu.tsx:266`, `preview/LiveSitePreview.tsx:29` |
| Modelo de cor/tema | 4 — `core/theme` (`ResolvedTheme`), `templates/theme.ts`, `inspiration/palette.ts` (com outro `applyOverrides`), `navigation/palette.ts` |

Isso não é só estética de código: são quatro modelos de cor diferentes alimentando prévias que deveriam “herdar a
identidade global”, o que torna difícil garantir que prévia, prompt e exportação mostrem o mesmo valor.

### 2.5 CSS

- Prefixos por módulo são respeitados quase sempre (`.lay-`, `.nvs-`, `.cmp-`, `.ins-`, `.tpl-`…), sem `!important` relevante
  (24 no total) — `dados/css-analise.txt`.
- A regra 9 (“não sobrescreva `ui-*`”) é violada em 6 arquivos: `components.css` redefine 9 classes `ui-*` (`ui-btn`,
  `ui-input`, `ui-label`, `ui-option__media`…), `entry.css`, `inspiration.css`, `layouts.css` 3 cada. Quase todas vêm escopadas
  por um ancestral do módulo (`.cmp-quick__row .ui-input`), o que limita o dano; como o CSS dos chunks nunca é descarregado,
  o risco é a ordem de carga mudar a aparência depois de visitar outro módulo.
- **As prévias não são isoladas do CSS do Studio**: `src/styles/base.css` aplica a todos os `h1–h4` peso 650,
  `letter-spacing: -0.012em` e `line-height: 1.25`, a todos os `a` a cor de destaque do Studio, `button { font: inherit }` e
  `body { line-height: 1.55 }`. As prévias de sites/componentes são renderizadas no mesmo documento (sem iframe/shadow DOM),
  então herdam esses valores; o HTML exportado e o site que a IA construir não os terão. É uma fonte silenciosa de
  diferença entre “o que a pessoa aprovou” e “o que foi especificado”.
- Folhas grandes: `navigation.css` 3 636 linhas / 639 regras; `layouts.css` 1 646 linhas.

### 2.6 Tamanho e complexidade

Funções mais longas (`dados/funcoes-longas.txt`, contagem de ramos = if/?:/case/&&/||/??):

| Função | Arquivo | Linhas | Ramos |
| --- | --- | --- | --- |
| `PhonePreview` | `layouts/phone.tsx:474` | 1 362 | 245 |
| `AuthScreen` | `entry/AuthPreview.tsx:701` | 1 215 | 396 |
| `Art` | `templates/render/kit.tsx:688` | 658 | 81 |
| `Content` | `layouts/schematic.tsx:854` | 537 | 107 |
| `resolveLook` | `components/look.ts:115` | 487 | 218 |
| `SidebarPreview` | `navigation/SidebarPreview.tsx:667` | 394 | 126 |
| `HeaderPreview` | `navigation/HeaderPreview.tsx:1001` | 350 | 86 |

Componentes de mais de mil linhas com centenas de ramos são praticamente impossíveis de revisar e de testar por partes; os
testes atuais só verificam que “renderiza sem erro”.

## 3. Estado e persistência

### 3.1 Store Zustand

Pontos fortes: uma única store (`src/core/store.ts`), todas as alterações por ações imutáveis via `edit()` (`:103-105`),
seletores primitivos na maior parte do código, `useShallow` onde se seleciona objeto (9 usos) — nenhum seletor instável
encontrado. Pontos fracos:

- **9 componentes assinam o projeto inteiro** (`useStudio((s) => s.project)`): `ColorSystem.tsx:321` (raiz do módulo de cores),
  `NavigationShowcase.tsx:328`, `SkeletonReview.tsx:41`, `FreeHome.tsx:10`, `ExportPage.tsx:58`, `PromptWorkspace.tsx:90`,
  `ValidationPage.tsx:21,104`, `PromptButton.tsx:36`. Qualquer alteração (inclusive digitar uma observação) re-renderiza essas
  árvores inteiras; no caso do `ColorSystem`, a galeria de 60 paletas.
- `PromptWorkspace` recalcula `buildProjectSpec` + `renderMasterPrompt` + `JSON.stringify` (≈100 KB) a cada alteração do
  projeto, inclusive quando a aba JSON não está aberta (`PromptWorkspace.tsx:92-94`). O motor é rápido (1–4 ms por geração
  medido em Node), então hoje é aceitável.

### 3.2 Persistência no localStorage

Configuração em `store.ts:272-292`: chave `atelier-ui:studio:v1`, `version: 1`, **sem `migrate`**, `merge` próprio que valida o
projeto com Zod e **não valida o histórico**. Cada alteração grava o estado inteiro (projeto + até 30 versões, `MAX_SNAPSHOTS`
em `:29`) de forma síncrona.

Tamanhos reais (projetos da fase 2, `dados/analise-motor.json → persistencia`):

| Projeto | Projeto (caracteres) | Projeto + 30 versões |
| --- | --- | --- |
| P1 Atlas Workspace | 2 358 | 75 654 |
| P2 Verde Vivo | 2 755 | 87 961 |
| P3 Nexo Capital | 2 383 | 76 429 |
| P4 Centro Operacional | 2 269 | 72 895 |
| P5 Conecta | 3 699 | 117 225 |

Para o uso típico a cota está longe (≈2 % de 5 M caracteres). **O risco real é o relatório de validação**: ele é guardado
dentro do `project` (`setValidationReport`, `store.ts:249`) e, portanto, copiado em cada uma das 30 versões e reescrito a cada
clique. O executor gera até ≈61 ocorrências por página × largura (limites em `runner.py:86-151`); com 10 larguras e 5 rotas,
centenas a milhares de ocorrências são plausíveis:

| Ocorrências no relatório | Estado salvo com 30 versões |
| --- | --- |
| 100 | 0,88 M caracteres |
| 1 000 | **8,0 M** (acima da cota medida do Chromium) |
| 3 000 | 24 M |

O comportamento ao estourar a cota e sem localStorage está medido na seção 6.

### 3.3 Migração, validação de importação e consistência com o que é exportado

- **Sem migração**: com `version: 1` e sem `migrate`, o Zustand descarta qualquer estado salvo com outra versão (apenas
  `console.error`) e o próximo clique sobrescreve o que estava salvo. A primeira mudança de esquema apagará os projetos de
  todos os usuários.
- **Falha de validação = perda silenciosa**: se o projeto salvo não passa no Zod (ex.: um valor de enum removido numa versão
  futura), `merge` devolve um projeto novo (`store.ts:280-285`) sem avisar; o primeiro clique grava por cima.
- **Versões não validadas**: `restoreSnapshot` (`store.ts:252-257`) aplica `structuredClone(snap.project)` sem passar pelo
  Zod. Sonda: restaurar uma versão incompleta quebra o motor com
  `Cannot read properties of undefined (reading 'paletteId')` (`dados/sondas.json`). `ProjectPage.tsx:101` ainda lê
  `h.project.meta.name` ao listar versões.
- **Backup não restaura as versões**: a exportação diz “Projeto atual e N versão(ões) salva(s)” (`ExportPage.tsx:114-115`), mas
  `parseProjectFile` extrai só `raw.project` (`schema.ts:140`) e `importProject` grava só o projeto (`store.ts:259-265`).
  Sonda: backup com 2 versões → nenhuma versão restaurada.
- **Validação Zod é de tipo, não de domínio**: ids de catálogo são `z.string()` — um projeto com `desktopId: "nao-existe"` é
  aceito, some do prompt e **não gera pendência** (o prompt diz “Layout desktop: não definido” e a lista de pendências não o
  menciona, porque `detectPending` testa só `!desktopId`). Chaves de `overrides` são livres (`mode`, `gradientEnabled` são
  aceitas e sobrescrevem campos não-cor do tema). `validation.report` é `z.any()` (`schema.ts:116`). Não há limite de
  tamanho para textos.
- **O que o estado tem e a exportação perde**:
  - a observação do usuário no item “Paleta e tokens” vai para `exceptions` do item (`items.ts:102`), mas o Master Prompt
    **não renderiza o item da paleta** (`text.ts:106` filtra `kind !== 'palette'`). Sonda: nota na paleta → ausente do prompt;
    nota na tipografia → presente;
  - itens retirados do prompt continuam gerando contradições (sonda: header excluído ainda produz
    `header-flutuante-vs-integral`), e a instrução de prioridade cita um header que não está no prompt;
  - a composição B de headers/sidebars é exportada com as medidas da composição A (2.2).

## 4. Motor de prompts — como funciona e por que perde fidelidade

### 4.1 Pipeline

1. `collectPromptItems(project)` (`src/prompt/items.ts:205-339`) percorre as escolhas e transforma cada uma num `PromptItem`
   a partir do `spec` textual do catálogo (`describeCatalogItem`, `src/core/describe.ts:24`) ou de funções `describe…`
   (componentes, inspiração, templates). `toItem()` acrescenta regras responsivas por tipo (`rulesFor`, `items.ts:100`) e a
   observação do usuário em `exceptions` (`:102`).
2. `buildProjectSpec()` (`src/prompt/spec.ts:70-138`) agrupa os itens por seção, adiciona tokens, regras globais
   (`COMPONENT_RESPONSIVE_RULES` inteiro, `:131`), contradições (`detectConflicts`) e pendências, e embute o estado completo
   (`source`).
3. `renderMasterPrompt()` (`src/prompt/text.ts:41-156`) concatena seções A–G em Markdown; cada item vira um bloco com até 9
   subtítulos (`renderItem`, `:16-33`); no fim vêm “Decisões de prioridade” e “Pendências”.

Cada item descreve **a si mesmo, com seus próprios números, “como na prévia”**. Não existe uma etapa que reúna os fatos de
todos os itens e decida qual valor vale. O preâmbulo manda a IA “implementar exatamente o que está descrito” (`text.ts:48`) e a
regra G1 proíbe “modificar escolhas aprovadas” — então duas descrições divergentes viram duas ordens contraditórias.

### 4.2 Por que o detector marca “Contradições (0)” enquanto o texto se contradiz

**Causa raiz:** `detectConflicts()` (`src/prompt/conflicts.ts:32-164`) é uma lista fixa de 8 regras sobre booleanos e
existência de regiões (header sem região, header flutuante × integral, sidebar sem região, sidebar flutuante × integral, login
ou landing fora do fluxo, One Screen, cor da inspiração, cor do template). Ele **não compara nenhum valor numérico, nenhum
posicionamento, nenhum comportamento no celular e nada de tipografia/geometria**. E nem poderia: os valores só existem como
texto livre dentro das `spec` de cada catálogo, sem um modelo de fatos comum. Cobertura de testes de `conflicts.ts`: 53 % das
linhas (sidebar, One Screen, cores de inspiração/template nunca exercitados).

Medição nos 5 projetos da fase 2 (fatos extraídos dos dados estruturados — `dados/analise-motor.json`):

| Projeto | Contradições detectadas pelo Studio | Contradições que o texto contém e o detector não vê |
| --- | --- | --- |
| P1 Atlas Workspace | 0 | 15 — header 64 × 56 px; header “só sobre a coluna principal” × “largura total da janela”; sidebar 252 × 248 px; sidebar “vira drawer abaixo de 768 px” × mobile Bottom Navigation (e × a regra “não transforme em drawer” anexada ao **mesmo** item); header “☰ + painel de menu” × bottom navigation; 5 componentes com raio 0 px (Swiss Minimal) × identidade “médio 8 px” e base 14 × 15 px |
| P2 Verde Vivo | 1 (cores da inspiração) | 13 — header com ☰ × dock inferior; 3 componentes Soft Pill: raio 999/22 px × 8 px, Inter × Fraunces nos títulos, 14 × 15 px, sombra “soft” × identidade “sem sombra” + regra “não adicione decoração” |
| P3 Nexo Capital | 0 | 9 — header 64 × 56 px; header full width × coluna; sidebar 252 × 264 px; 3 componentes Compact Pro: raio 4/6 × 8 px, 13 × 15 px |
| P4 Centro Operacional | 0 | 4 — 2 componentes Compact Pro: raio e tamanho base divergentes |
| P5 Conecta | 0 | 17 — header 64 × 60 px; 4 componentes Modern Material: raio 20/12 × 8 px, fonte do sistema × Inter, sombra tonal × “sem sombra” |

Os quatro casos relatados pelos agentes de primeiro acesso (header 56 × 64, sidebar 252 × 260/248/264, drawer × bottom
navigation, raio/fonte da família × identidade) são todos instâncias dessa mesma causa. Trecho real (P1, `master-prompt.md`):
linha 114 “Header de ≈64 px … O header fica somente sobre a coluna principal”; linha 199 “Barra principal com 56 px de altura,
largura total da janela (full width)”; a sidebar diz na mesma lista “Abaixo de 768 px: sai do fluxo e vira um drawer” e
“Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria)”.

### 4.3 Por que textos de exemplo entram no prompt como especificação

**Causa raiz:** o modelo de projeto não tem campos de conteúdo (marca, itens de menu, grupos da sidebar, CTAs) —
`ProjectMeta` (`src/core/project.ts:33-43`) só guarda nome, objetivo, descrição, público, finalidade, tipo, funcionalidades e
tecnologia. Os geradores de spec interpolam o conteúdo da **receita de demonstração** do catálogo:
`navigation/catalog.ts:149` (marca), `:153` (itens do menu, com mega menu/dropdown), `:167` (breadcrumbs), `:197` (itens do menu
de perfil), `:1555-1565` (grupos e itens da sidebar, com contadores “Projetos (12)”, “Mensagens (3)”);
`templates/describe.ts:26,43` (`marcaDeExemplo`) e `inspiration/describe.ts:21-25` (nome do conceito vira o nome do item).
Somente a marca do header leva a ressalva “substitua pela marca real”; os itens de menu não. Medido: 13 textos de
demonstração no prompt de P1, 9 em P2, 14 em P3, 1 em P4, 6 em P5 (ex.: P3 recebe o menu “Visão geral, Aquisição, Retenção,
Receita” e a sidebar “Painel, Contratos, Fornecedores, Compras, Colaboradores” de um modelo genérico).

### 4.4 Por que trocar a cor primária não atualiza hover, foco e link

**Causa raiz:** as alterações manuais são aplicadas **depois** da derivação. `projectTokens()` faz
`applyOverrides(deriveTokens(palette.base), overrides)` (`src/core/theme.ts:10-12`; `applyOverrides` em
`src/core/tokens.ts:191-197`): `deriveTokens` calcula hover, active, foco, link, seleção e navegação a partir da primária
**da paleta**, e só depois a primária nova substitui o token `primary`. Medido com a paleta `neutro-essencial` e primária
`#e11d48` (`dados/analise-motor.json → tokensDerivados`): **11 tokens ficam com o valor da primária antiga** —
`primaryHover` (#161618, esperado #cb1a41), `primaryActive`, `primarySoft`, `focusRing` (#18181b, esperado #e11d48),
`selected`, `selectedText`, `link` (#18181b, esperado #e11d48), `linkHover`, `navActive`, `navActiveText`, `gradientFrom`.
Esses valores errados seguem para a tabela de tokens do Master Prompt, para o CSS de referência (`css.ts:12`), para as cores
dos componentes (`components/describe.ts:73-74` resolve o “look” a partir desses tokens) e para a ficha HTML.

### 4.5 Tamanho e duplicação do prompt

| Projeto | Master Prompt | Linhas | Tokens (≈ caracteres/3,6) | Linhas repetidas (≥ 25 caracteres) | Caracteres desperdiçados | JSON da especificação |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | 47 461 | 825 | ≈13 200 | 42 linhas distintas, 165 repetições | 10 662 | 110 190 |
| P2 | 44 728 | 760 | ≈12 400 | 38 / 92 | 5 618 | 103 185 |
| P3 | 36 588 | 636 | ≈10 200 | 40 / 90 | 5 483 | 83 580 |
| P4 | 23 060 | 427 | ≈6 400 | 35 / 43 | 2 520 | 51 037 |
| P5 | 38 975 | 698 | ≈10 800 | 39 / 125 | 7 682 | 91 243 |

Causas: (a) as regras por tipo de componente são anexadas a cada item (`items.ts:100`) **e** o dicionário inteiro
`COMPONENT_RESPONSIVE_RULES` (11 regras) é repetido no fim (`text.ts:135`), inclusive regras de tabela em projetos sem tabela
(P2, P5); (b) instâncias da mesma família repetem as mesmas 5–8 linhas de estilo (P1: “Raio 0 em tudo…” 5×); (c) cada item
traz até 9 subtítulos fixos. O JSON carrega cada item duas vezes (na seção e em `items[]`) e o estado completo em `source`
(inclui o relatório de validação, se houver).

### 4.6 Correções de arquitetura propostas

1. **Modelo de fatos + resolução por precedência.** Cada catálogo passa a expor, além do texto, fatos estruturados
   (`{ chave: 'header.altura.desktop', valor: 56, unidade: 'px', origem: 'navigation.header' }`, `'sidebar.largura'`,
   `'header.posicao' = 'coluna' | 'janela'`, `'mobile.navegacao' = 'bottom-nav' | 'drawer'…`, `'componente.raio'`,
   `'componente.fonte'`). Um resolvedor agrupa por chave e aplica uma tabela de precedência explícita, por exemplo:
   decisão do usuário > esqueleto (layout desktop/mobile: posição, dimensões, navegação móvel) > modelo de navegação (estilo
   interno) > identidade global (cores, tipografia, raio, sombra) > família visual do componente (só o que a identidade não
   define, salvo exceção marcada). O texto do prompt é renderizado **a partir do valor resolvido** (um único número) e os
   valores perdedores vão para um apêndice “substituído por precedência”. Conflitos cuja política é “perguntar” aparecem na
   aba Contradições. O detector deixa de ser uma lista de `if` e passa a ser “mesma chave, valores diferentes”.
2. **Campos de conteúdo no projeto** (`project.content`: nome da marca, itens de navegação principal, grupos da sidebar,
   CTA principal), preenchidos opcionalmente no objetivo/navegação. Os geradores de spec usam esses campos; quando vazios,
   escrevem “itens: use as funcionalidades da seção A; os rótulos da prévia são ilustrativos” em vez de listar o conteúdo de
   demonstração.
3. **Derivação de tokens em duas camadas**: `overrides` de base (`primary`, `secondary`, `accent`, `bg`, `surface`, `text`,
   `nav`, semânticas) aplicados ao `PaletteBase` **antes** de `deriveTokens`; overrides de tokens derivados aplicados depois e
   marcados como “travados” na interface (com ação “voltar a derivar”).
4. **Spec por composição**: gerar a spec de header/sidebar com `headerLookFor(model, variant)` / `sidebarLookFor`.
5. **Deduplicação no render**: regras por componente só uma vez, filtradas pelos tipos presentes; `Set` de linhas por seção;
   família visual descrita uma vez e referenciada pelas instâncias; JSON sem `items[]` duplicado (ou só com chaves).
   Estimativa: −20 a −35 % de tamanho sem perder informação.
