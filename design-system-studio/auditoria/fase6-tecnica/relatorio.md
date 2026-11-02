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

## 5. Desempenho do build congelado

<!-- SECAO5 -->

## 6. Tratamento de erros, segurança e testabilidade

### 6.1 Tratamento de erros (medido no build congelado — `scripts/robustez.cjs`, `cota.cjs`, `xss-import.cjs`)

| Cenário | O que acontece | Evidência |
| --- | --- | --- |
| Chunk de um módulo falha ao carregar (rede instável, ou deploy novo que troca os hashes enquanto a aba está aberta) | **O Studio inteiro some** e aparece a página padrão do React Router, em inglês, com a pilha: “Unexpected Application Error! Failed to fetch dynamically imported module …/TemplatesPage-B3gY76Be.js”. Topbar e menu desaparecem; só volta trocando o endereço. O comentário de `App.tsx:6` (“um erro em um módulo não derruba o Studio inteiro”) não se confirma: não há `errorElement` nas rotas (`App.tsx:32-60`) nem error boundary em volta do `<Outlet/>` (`Shell.tsx:376-378`). Único error boundary do app: `ComponentPreview.tsx:32`. | `dados/robustez.json → chunkLazyFalha`, `dados/capturas/r1-chunk-falhou.png` |
| Qualquer exceção de renderização (ex.: restaurar uma versão incompleta) | Mesma tela branca “Unexpected Application Error! Cannot read properties of undefined (reading 'showLegends')”. Ao recarregar, o projeto “restaurado” (incompleto, completado com padrões) é o que fica salvo. | `robustez.json → restaurarVersaoCorrompida`, `capturas/r8-…png` |
| localStorage com JSON corrompido | O app abre com projeto vazio, **sem aviso**; o primeiro clique sobrescreve o conteúdo salvo (não há cópia de segurança do valor ilegível). | `robustez.json → localStorageJsonCorrompido` |
| Projeto salvo que não passa no Zod | Abre vazio, sem aviso; após o primeiro clique o nome salvo vira “” (projeto perdido); o histórico, não validado, é mantido. | `projetoSalvoInvalido` |
| Estado salvo com outra `version` | Descartado; só `console.error("…couldn't be migrated since no migrate function was provided")`. | `versaoDiferenteSemMigrate` |
| localStorage indisponível | O app funciona, mas nada é salvo e **o usuário não é avisado** (apenas `console.warn` do Zustand a cada clique). | `localStorageIndisponivel` |
| Cota do localStorage estourada (capacidade medida: 5 242 368 caracteres) | `QuotaExceededError` não tratado dentro do `set` do Zustand: a versão aparece na tela mas **não é gravada**, o toast de sucesso nem aparece, e **todas as alterações seguintes também deixam de ser gravadas em silêncio** (paleta na tela “lavanda-fria”, gravada “papel-branco”; ao recarregar volta a antiga). | `dados/cota.json`, `capturas/r6-cota-estourada.png` |
| Importar JSON inválido / com tipo errado | Bem tratado: “O arquivo não contém um JSON válido.” / “identity.typography.baseSize: Expected number, received string”. Mensagens do Zod em inglês. | `robustez.json → importacao` |
| Importar ids que não existem no catálogo | Aceito sem aviso; as escolhas somem do prompt e não viram pendência. | idem, `ids-inexistentes.json` |
| Importar descrição de 3 MB | Aceito e gravado (3 008 774 caracteres). A importação seguinte falha com a mensagem crua do navegador, em inglês: “Failed to execute 'setItem' on 'Storage' … exceeded the quota.” | `dados/xss-import.json` |
| Arquivo de backup com versões | Importa o projeto e **descarta as versões** do arquivo. | `dados/sondas.json` |

### 6.2 Segurança

- **XSS na interface: não encontrado.** Não há `dangerouslySetInnerHTML`, `innerHTML`, `eval` nem `new Function` em `src/`.
  Importei um projeto com `<img src=x onerror=…>` e `<script>` no nome, objetivo e observações e percorri 9 rotas: nada
  executou, nenhum `<img src="x">` no DOM (`xss-import.json`).
- **Ficha HTML:** textos escapados com `esc()` (`ExportPage.tsx:16`), `<title>` escapa `<` (`download.ts:85`); o
  `renderToStaticMarkup` da prévia só recebe tokens (cores validadas como `#RRGGBB` pelo Zod). Aberta num navegador, a ficha
  com o projeto malicioso não executou nada. Os HTML demonstrativos de templates/inspiração não usam texto do usuário (fontes
  passam por `validFont`, cores por regex).
- **CSS de referência:** o nome do projeto entra cru num comentário (`css.ts:35`). Um nome com `*/` fecha o comentário e injeta
  CSS (sonda: `Nome */ body{display:none} /*` → regra ativa). Baixo impacto (arquivo de referência), correção trivial.
- **Master Prompt (.md):** textos do usuário entram sem escape (HTML cru e quebras de linha que criam itens/títulos novos). Para
  o próprio usuário não é vulnerabilidade, mas um projeto importado de terceiros pode carregar **injeção de prompt** para a IA
  que vai implementar o site, e um visualizador Markdown com HTML habilitado executaria o `<img onerror>`. Sugestão: colocar
  textos livres entre aspas/bloco de citação e normalizar quebras de linha.
- **localStorage:** contém só o projeto (sem credenciais). O relatório de validação passa por `parseReport` com um filtro de
  termos sensíveis em `element` (`src/prompt/validation.ts:25-32`), mas fica guardado dentro do projeto e é copiado para cada
  versão e para o `source` da especificação exportada.
- **Executor Python** (`tools/validation-runner/runner.py`): bom desenho — só abre a URL e rotas da mesma origem
  (`same_origin`, `runner.py:198` e checagem em `:229`), não clica nem envia formulários, login manual pelo próprio usuário,
  relatório sem cookies/textos/capturas, saída limitada (≤ ≈61 ocorrências por página × largura). Observações menores: o
  seletor reportado pode conter crases e quebrar o Markdown do prompt de correção (`validation.ts:86`); não há testes
  automatizados do executor.

### 6.3 Testabilidade — cobertura real e o que os testes não protegem

Cobertura medida (Vitest + V8, cópia isolada, `dados/coverage-summary.json`): **87,5 % das linhas, 76,5 % das funções**. O número
é inflado pelos catálogos (dados contam como linhas cobertas ao serem importados). Por área:

| Área | Linhas cobertas |
| --- | --- |
| templates, inspiration | 99 % |
| navigation, components, layouts, entry | 86–93 % |
| core | 90 % (store 86 %, download 32 %) |
| prompt | 84,5 % — **conflicts.ts 53 %**, PromptButton 42 % |
| ui | 70 % |
| color | 18 % |
| shell, guided, home, preview, project, **prompts (Central/Exportar)**, validation, App | **0 %** |

E2E (Playwright, 22 declarações de teste — 26 casos com as 5 larguras parametrizadas — em 4 arquivos — não executados por mim, por instrução): abrem todas as rotas, checam overflow,
downloads válidos, importação de backup, persistência após recarregar, seleção sem rolar a página.

O que **nenhum** teste protege hoje (todos os defeitos desta auditoria passaram pelos 235 testes verdes):

1. coerência entre itens do prompt (medidas, posição, navegação móvel, tipografia/raio) — os testes de prompt verificam
   presença de seções e de itens, não contradições;
2. que trocar a primária atualiza os tokens derivados (o teste `aplica e remove exceções de token` só olha o token alterado);
3. que a composição B gera medidas da composição B (`navigation.test.tsx:131` só confere o nome da variante);
4. ausência de conteúdo de demonstração no prompt; duplicação/tamanho do prompt;
5. erros de carregamento de chunk, error boundaries, cota do localStorage, localStorage indisponível/corrompido, migração;
6. importação de backup **com histórico**, ids inexistentes, limites de tamanho;
7. ExportPage/PromptWorkspace (0 % de cobertura unitária), a ficha HTML e o CSS com textos hostis;
8. desempenho (nenhum orçamento de bundle ou de interação), e o executor Python.

Os testes de renderização dos módulos são majoritariamente “renderiza sem erro” — úteis contra quebras, mas não verificam
que a prévia corresponde à spec que vai para o prompt.

## 7. Lista consolidada de problemas

Prioridade: P0 = compromete o objetivo do produto (o site construído pela IA sai diferente do aprovado); P1 = perda de dados
ou de confiança, ou fidelidade relevante; P2 = qualidade/desempenho/manutenção com impacto perceptível; P3 = melhoria.

| ID | Título | Evidência | Causa | Sugestão concreta | Prior. | Esforço | Depende de | Critério de aceitação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TE-01 | Detector marca 0 contradições com 4–17 contradições no texto | 4.2; `conflicts.ts:32-164`; P1 tem 15, P5 17; `conflicts.ts` 53 % coberto | 8 regras fixas sobre booleanos; valores só existem em texto livre de cada catálogo; preâmbulo “implemente exatamente” | Modelo de fatos estruturados por item + resolvedor por precedência (4.6-1); prompt renderizado a partir do valor resolvido; “perguntar” só onde a política exigir | P0 | alto | — | Nos 5 projetos da fase 2, cada chave (altura do header, largura da sidebar, posição do header, navegação móvel, raio/fonte/tamanho/sombra dos componentes) aparece com **um** valor no prompt ou como contradição aberta; teste com o backup de P1 |
| TE-02 | Trocar a primária não atualiza hover, active, foco, link, seleção, navegação ativa, gradiente | 4.4; 11 tokens; `theme.ts:10-12`, `tokens.ts:191` | overrides aplicados depois de `deriveTokens` | Overrides de base antes da derivação; overrides de derivados “travados” depois (4.6-3) | P0 | baixo | — | Com primária `#e11d48` em `neutro-essencial`, `primaryHover/link/focusRing/selectedText/navActiveText/gradientFrom` são derivados da nova cor no editor, prompt, CSS e ficha; teste unitário |
| TE-03 | Conteúdo de demonstração (marca, menus, breadcrumbs, contadores) entra como especificação | 4.3; 1–14 ocorrências por projeto; `navigation/catalog.ts:149,153,167,197,1555-1565` | projeto sem campos de conteúdo; spec interpola a receita de demonstração | `project.content` (marca, itens de navegação, grupos, CTA); gerador usa esses campos ou escreve “rótulos ilustrativos” (4.6-2) | P0 | médio | TE-01 (mesma refatoração dos geradores) | Nenhum rótulo de `look.nav`, `look.groups`, `breadcrumbs`, `brand` aparece no prompt sem confirmação do usuário; teste automatizado com os 72 modelos |
| TE-04 | Composição B de headers/sidebars é exportada com a estrutura e as medidas da composição A | 2.2; `gazeta-aurora` B = 60 px, prompt diz 88 px; 7 sidebars | `spec: headerSpec(d)` gerado uma vez a partir de `d.look` (`navigation/catalog.ts:270,1662`) | Gerar spec sob demanda com `headerLookFor/sidebarLookFor(model, variant)` | P1 | baixo | — | Para os 72 modelos × 2 composições, altura/largura/logo do prompt = receita da composição escolhida (teste parametrizado) |
| TE-05 | Erro de carregamento de chunk ou de renderização derruba o Studio inteiro (tela em inglês com pilha) | 6.1; `capturas/r1-…png`; sem `errorElement` (`App.tsx:32-60`) | nenhum error boundary no nível de rota/Outlet | `errorElement` na rota raiz + `ErrorBoundary` em volta do `<Outlet/>` com mensagem em português, botão “Tentar de novo” (re-import do chunk) e “Recarregar”; `vite:preloadError` → recarregar uma vez | P1 | baixo | — | Com o chunk de Templates bloqueado, topbar e menu continuam visíveis, aparece mensagem em português e o retry funciona; teste E2E com `page.route(abort)` |
| TE-06 | Falhas de gravação são silenciosas (cota estourada, localStorage indisponível) | 6.1; `dados/cota.json`: versão na tela, não gravada; alterações seguintes perdidas | `QuotaExceededError` propagado de dentro do `set` do Zustand; nenhum `onRehydrateStorage`/aviso | `storage` próprio com `try/catch` que publica um estado “não salvo” na store; faixa persistente “Suas alterações não estão sendo salvas — exporte um backup”; poda automática de versões antigas ao estourar | P1 | baixo | — | Com a cota cheia, o usuário vê o aviso em ≤ 1 s, nenhum erro não tratado no console, e a poda permite continuar salvando o projeto atual |
| TE-07 | Hidratação descarta dados sem aviso e sem cópia (JSON ilegível, projeto inválido, outra versão) e não há `migrate` | 3.3, 6.1; `store.ts:272-292` | `merge` devolve projeto novo; Zustand descarta versão diferente; próximo clique sobrescreve | Antes de descartar, copiar o valor bruto para `atelier-ui:studio:v1:recuperacao-<data>` e avisar com opção de baixar; implementar `migrate(state, version)` com testes por versão; validar `history` com o mesmo esquema (descartando só as versões inválidas) | P1 | médio | — | Os três cenários de `robustez.cjs` mostram aviso e preservam o conteúdo original; teste de migração v1→v2 |
| TE-08 | Relatório de validação guardado no projeto e copiado em 30 versões | 3.2; 1 000 ocorrências = 8 M caracteres > cota de 5,24 M | `validation.report` dentro de `Project` | Guardar o relatório fora do projeto (chave própria ou IndexedDB), fora dos snapshots e do `source` exportado; limitar ocorrências por tipo | P1 | baixo | TE-06 | Importar um relatório de 3 000 ocorrências e salvar 30 versões não estoura a cota |
| TE-09 | Observação do usuário no item “Paleta e tokens” some do Master Prompt | 3.3; `dados/sondas.json`; `text.ts:106` | o render filtra o item `palette`, onde a nota é guardada | Renderizar `exceptions`/`notes` do item da paleta na seção D (ou nota global de identidade) | P1 | baixo | — | Nota na paleta aparece no prompt; teste unitário |
| TE-10 | Backup “completo” não restaura as versões | 3.3; `ExportPage.tsx:114`, `schema.ts:140`, `store.ts:259-265` | parse e import usam só `raw.project` | `importProject` aceita `history` validado (mesclando ou substituindo, com escolha) | P2 | baixo | TE-07 | Importar backup com N versões restaura as N versões; teste |
| TE-11 | Restaurar versão incompleta quebra o app | 6.1; `store.ts:252-257`; sonda `paletteId` | snapshots não passam pelo Zod | `restoreSnapshot` usa `parseProjectFile`; `ProjectPage.tsx:101` com `?.` | P2 | baixo | TE-05 | Versão incompleta é recusada com mensagem; nenhuma tela de erro |
| TE-12 | Importação valida tipos, não domínio: ids inexistentes aceitos sem pendência; chaves livres em `overrides`; textos sem limite (3 MB aceitos); `report: z.any()` | 3.3, 6.1 | esquema Zod com `z.string()` livre | `z.enum`/`refine` contra os catálogos (ou aviso “item não encontrado” + pendência); `z.enum(TOKEN_KEYS)` nas chaves; `.max()` em textos; esquema do relatório | P2 | baixo | — | Os arquivos `ids-inexistentes.json` e `texto-gigante.json` geram aviso claro; prompt lista a pendência |
| TE-13 | Prompt longo e repetitivo | 4.5; 23–47 KB; 2,5–10,7 KB repetidos; regras de tabela sem tabela | regras por tipo anexadas ao item **e** no fim; família repetida por instância | Deduplicar no render, filtrar regras pelos tipos presentes, família descrita uma vez (4.6-5) | P2 | médio | TE-01 | −20 % de caracteres nos 5 projetos sem perder fatos (comparação por chaves); nenhuma linha ≥ 25 caracteres repetida fora dos subtítulos |
| TE-14 | Code splitting anulado pelo grafo de imports | 2.3, 5; home 874 KB; rotas 1,10–1,69 MB | `PromptButton` importa o motor e os catálogos; `home/status.ts` importa 7 catálogos; `GuidedStep` importa 9 áreas | `PromptButton` com `import()` dinâmico do motor ao abrir o modal; `status.ts` usar um índice leve `{id → nome}` gerado dos catálogos; `GuidedStep` com `lazy` por etapa | P2 | médio | — | Home ≤ 350 KB de JS bruto; rota de cores ≤ 500 KB; medir com `scripts/perf-carga.cjs` |
| TE-15 | Galeria de inspiração e galerias de layouts pesadas | 5; inspiração: <!--INS--> | 20 sites completos (desktop) renderizados como miniaturas ao abrir a página; layouts: 42–44 esquemas/celulares interativos | Miniaturas estáticas (SVG/PNG gerados no build) ou renderização sob demanda com `IntersectionObserver` + `content-visibility: auto`; prévia completa só no visualizador | P2 | médio | — | Inspiração: LCP (Lighthouse mobile) < 4 s e < 2 500 nós na abertura |
| TE-16 | Prévias não isoladas do CSS global do Studio | 2.5; `styles/base.css` (h1–h4, a, button, body) | prévias no mesmo documento, sem reset escopado | Renderizar prévias de sites/componentes dentro de um contêiner com `all: revert`/reset próprio ou shadow DOM; garantir que o HTML exportado use o mesmo reset | P2 | médio | — | Comparação visual prévia × HTML exportado sem diferença de tipografia em 5 modelos |
| TE-17 | Kits de prévia duplicados (Btn ×5, Avatar ×4, molduras ×5, hook de largura ×4, 4 modelos de cor) | 2.4 | cada módulo nasceu isolado | Pacote `src/preview-kit/` (primitivas + tema único derivado de `ResolvedTheme`) e migração gradual | P2 | alto | TE-02 | Nenhuma primitiva duplicada; todas as prévias recebem `ResolvedTheme` |
| TE-18 | Assinaturas do projeto inteiro causam re-render amplo | 3.1, 5 (<!--REN-->) | 9 componentes com `useStudio((s) => s.project)` | Seletores finos (`useShallow` de fatias), `memo` nos cartões, mover cálculos derivados para seletores memorizados | P3 | baixo | — | Clique em paleta renderiza ≤ 60 componentes (medido com o gancho de `perf-lib.cjs`) |
| TE-19 | Componentes gigantes | 2.6; `PhonePreview` 1 362 linhas/245 ramos; `AuthScreen` 1 215/396 | renderização condicional acumulada | Quebrar por região (topo, inferior, lateral, sobreposições) em componentes com testes de contrato | P3 | alto | TE-17 | Nenhuma função > 300 linhas nos renderizadores |
| TE-20 | Dependências circulares prompt ↔ módulos e core → módulo | 2.3; `theme.ts:2` | `PromptButton` dentro de `prompt/` e `describe` dentro dos módulos | Mover `PromptButton` para `ui/` (com import dinâmico); `core` recebe as paletas por injeção | P3 | médio | TE-14 | Grafo sem ciclos entre áreas (script `dados/acoplamento.txt`) |
| TE-21 | Textos do usuário sem escape no CSS e no Markdown | 6.2; `css.ts:35` | interpolação direta | Remover `*/` do nome no comentário; citar textos livres no Markdown e normalizar quebras | P3 | baixo | — | Sondas de `scripts/sondas.test.ts`/`analise-motor.test.ts` passam a dar `false` |
| TE-22 | Testes não protegem fidelidade nem modos de falha | 6.3; prompts/shell 0 %, `conflicts.ts` 53 % | testes focados em “renderiza” e “contém seção” | Suíte de fidelidade (contradições, tokens derivados, composição B, conteúdo de demonstração, tamanho) usando os 5 backups da fase 2 como fixtures; E2E de falhas (chunk, cota, storage corrompido); orçamento de bundle no CI | P1 | médio | TE-01…TE-08 | Cada defeito P0/P1 desta lista tem um teste que falha no commit `e4c79f3` e passa após a correção |
| TE-23 | Fontes e build autônomo pesados | 5; 18 arquivos woff2 (422 KB), autônomo 3,1 MB com 19 fontes base64 | importa os pacotes `@fontsource-variable` completos (todos os subsets) | Importar só `latin` e `latin-ext` (`@fontsource-variable/inter/wght.css` com subset) e, no autônomo, só Inter | P3 | baixo | — | Autônomo < 2 MB |
| TE-24 | Violações da regra 9 do CSS (classes `ui-*` redefinidas em 6 arquivos) | 2.5 | estilos de ajuste por módulo | Variantes/props nas primitivas ou variáveis CSS em vez de sobrescrever `ui-*` | P3 | baixo | — | Nenhuma regra de módulo com seletor `.ui-*` no sujeito |
| TE-25 | Itens retirados do prompt continuam gerando contradições | 3.3; sonda | `detectConflicts` lê o projeto, não os itens incluídos | Detectar sobre os itens incluídos (ou fatos resolvidos) | P3 | baixo | TE-01 | Header excluído não gera contradição |

## 8. O que está bom

- **Base técnica limpa**: TypeScript `strict` sem nenhum erro; 235 testes unitários verdes; estrutura de pastas e guia de
  módulos claros; nomes e textos consistentes em português.
- **Fonte única da verdade de fato**: todas as escolhas vivem em `project`, alteradas só por ações imutáveis; modos Guiado e
  Livre leem o mesmo estado; seletores estáveis (nenhum loop de `getSnapshot`), `useShallow` onde necessário.
- **Exportações tecnicamente válidas e seguras**: JSON reimportável, ficha HTML autônoma e escapada, nenhum XSS encontrado
  com entradas hostis, nenhum uso de `innerHTML`/`eval`; o executor Python tem um modelo de segurança cuidadoso (mesma origem,
  sem cliques, login manual, sem segredos).
- **Importação com Zod**: tipos errados e JSON inválido são recusados com mensagem objetiva; arquivos parciais são completados
  com padrões; o estado anterior vira versão antes de importar/restaurar/limpar.
- **Desempenho de interação aceitável na maior parte das galerias** (ver seção 5), **CLS = 0** em todas as rotas e perfis, e
  **memória estável**: após 3 voltas por 18 rotas o heap fica em ≈12 MB e o número de nós e de listeners volta ao inicial —
  sem vazamento detectável.
- **Derivação de tokens com contraste garantido** (`ensureContrast`, testes de AA em 60 paletas) — o problema é só a ordem de
  aplicação dos overrides (TE-02), não o algoritmo.
- **Motor de prompts rápido** (1–4 ms por geração) e determinístico a partir do estado, o que torna as correções
  arquiteturais propostas baratas de testar.

## 9. Notas

| Dimensão | Nota (0–10) |
| --- | --- |
| Qualidade técnica e estabilidade | **6** |
| Confiabilidade das exportações | **4** |

**Rubrica — Qualidade técnica e estabilidade.** 9–10: falhas tratadas com recuperação (error boundaries, migração, aviso de
persistência), orçamento de bundle, testes nos caminhos críticos, pouca duplicação. 7–8: sólido, lacunas localizadas. 5–6:
funciona bem no caminho feliz e é estável em uso normal (sem erros de console, memória estável, CLS 0, tipos e testes verdes),
mas os modos de falha derrubam o app ou perdem dados em silêncio, o code splitting é anulado e há dívida de manutenção
relevante (duplicação, componentes de mais de mil linhas). 3–4: falhas frequentes no uso normal. 0–2: inutilizável.
→ **6**: o caminho feliz é robusto; TE-05, TE-06, TE-07 e TE-14/17/19 impedem nota maior.

**Rubrica — Confiabilidade das exportações.** 9–10: todo valor exportado é igual ao estado e à prévia, sem contradições nem
conteúdo de demonstração, ida e volta sem perda. 7–8: divergências raras e sinalizadas. 5–6: arquivos válidos, algumas
divergências silenciosas pontuais. 3–4: arquivos válidos, mas o conteúdo é sistematicamente contraditório ou inexato de formas
que mudam o site construído. 0–2: arquivos inválidos ou ilegíveis.
→ **4**: os arquivos são válidos, completos e seguros (por isso não 2–3), mas em 5 de 5 projetos o Master Prompt contém
contradições não sinalizadas (4–17), conteúdo de demonstração tratado como especificação (1–14), tokens derivados errados
quando a primária é alterada, medidas da composição errada e uma observação do usuário descartada; o backup perde as versões.
