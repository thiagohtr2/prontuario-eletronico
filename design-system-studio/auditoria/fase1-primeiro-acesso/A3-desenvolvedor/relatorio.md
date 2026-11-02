# Relatório A3: primeiro acesso como desenvolvedora frontend sênior

## 1. Aviso: persona simulada

Este **não é um teste com pessoas**. Quem fez a avaliação foi um agente de IA no papel de **"Helena"**, desenvolvedora frontend sênior (React, TypeScript, HTML/CSS avançado, design systems, arquitetura de interfaces e acessibilidade), exigente e cética com ferramentas no-code. As percepções de "entendi", "fiquei confusa" e "abandonaria" são inferências da persona. **Não são dados de usuários reais.** As evidências objetivas (capturas, árvores de acessibilidade, arquivos exportados, validações automáticas) são reais e podem ser reproduzidas.

**Condições do teste**
- Navegador Chromium (Playwright 1.63), perfil persistente limpo em `perfil/`.
- Viewport principal 1920×1080. As telas-chave foram repetidas em 1280×800.
- Data: 02/11/2026. Site: `http://127.0.0.1:4300/` ("Atelier UI · Design System Studio").
- Nada foi lido do código-fonte, do README nem da documentação. Tudo foi descoberto pela interface. Os arquivos analisados são os que o próprio site exportou, salvos em `exportados/`.
- Foram cerca de 70 interações de usuário, agrupando cada formulário preenchido como uma interação. Isso corresponde a cerca de 100 ações atômicas automatizadas.
- O console do navegador ficou **sem nenhum erro** em toda a sessão.

**Objetivo da persona:** especificar o "Orbita PM", um SaaS B2B multiempresa de gestão de projetos. Requisitos: papéis e permissões, kanban, relatórios, faturamento, configurações de organização, convites de equipe, versões desktop e mobile. O resultado deveria ser reaproveitável em React + TypeScript + Tailwind.

---

## 2. Caminho seguido

Legenda das perguntas: (1) o que tentou; (2) o que esperava; (3) o que aconteceu; (4) entendeu?; (5) voltou?; (6) ficou confusa?; (7) algum controle não funcionou?; (8) abandonaria?; (9) parece profissional?; (10) melhoria sugerida.

### P1. Tela inicial (`01-inicio-1920.png`)
1. Entender o produto e escolher um modo.
2. Esperava uma proposta clara e uma escolha entre fluxo guiado e livre.
3. O título promete "do site que você imagina ao site que a IA realmente constrói". Há dois cartões, Guiado e Livre, e uma régua em 4 fases (Esqueleto → Identidade → Componentes → Entrega).
4. Entendeu, sim.
5. Não voltou.
6. Um pouco: a barra lateral mostra ao mesmo tempo "Construtor guiado" (10 passos) e os grupos "Estrutura / Identidade…". "Objetivo do projeto" aparece duas vezes.
7. Nenhum controle falhou. Defeito visual: o texto da ilustração do cartão Guiado ("Objetivo → Entrada → Desktop → Mobile → Revisão") aparece cortado na base.
8. Não abandonaria.
9. Sim: tipografia limpa e hierarquia boa.
10. Mostrar só a navegação do modo ativo e corrigir o corte da ilustração.

### P2. Objetivo do projeto (`02-guiado-objetivo-full.png`, `03-objetivo-preenchido-full.png`)
1. Preencheu tipo "Aplicativo ou SaaS", nome, objetivo, descrição, público e finalidade, adicionou 7 módulos (kanban, RBAC, relatórios, faturamento, configurações, convites, troca de organização) e indicou a tecnologia.
2. Esperava campos estruturados para papéis/permissões e entidades.
3. Só há texto livre. Os módulos viram uma lista de rótulos. Os chips de tecnologia são **exclusivos**: depois de "React + TypeScript", clicar em "Tailwind CSS" **substitui** o valor por "Tailwind CSS", mesmo que o placeholder sugira "React + TypeScript + Tailwind". Foi preciso digitar à mão.
4. Entendeu.
5. Não voltou.
6. Ficou confusa com os chips.
7. Os chips não combinam valores.
8. Não abandonaria.
9. Parece profissional, mas o campo "Nome do projeto" é visivelmente mais alto (≈54 px) que "Objetivo" (≈40 px) na mesma linha (captura 02).
10. Chips cumulativos ou agrupados (framework, estilo, linguagem) e um campo estruturado para papéis e permissões.

### P3. Entrada: fluxo, landing, login e cadastro (`04` a `09`)
1. Escolheu "Landing page com chamada para login", a landing "Aurora Flow", o login "Acesso corporativo" (SSO) e o cadastro.
2. Para um SaaS B2B, esperava poder definir **dois** fluxos: cadastro do dono da organização (em etapas) e aceite de convite.
3. Os catálogos são grandes (24 landings, 24 logins, 8 cadastros), com prévia funcional em computador e celular (`07b-landing-previa.png`). O cadastro é de **seleção única**: ao escolher "Cadastro em etapas", "Cadastro por convite para equipe" foi desmarcado (verificado pelos `aria-pressed`).
4. Entendeu.
5. Não voltou.
6. Não ficou confusa.
7. Não houve controle quebrado. O toast "Landing … selecionada" cobre o rodapé do modal de prévia, inclusive o texto "Prompt deste elemento" (`07b`).
8. Não abandonaria.
9. Sim: as prévias são de boa qualidade.
10. Permitir vários fluxos de cadastro e não sobrepor toasts ao rodapé de modais.

### P4. Arquitetura desktop (`09b-desktop.png`, `10-desktop-selecionado.png`, `11-prompt-elemento-desktop.png`)
1. Escolheu "Sidebar integral com header global" e abriu "Prompt deste elemento".
2. Esperava largura da sidebar, altura do header e breakpoints **editáveis**.
3. As medidas aparecem só como texto: "Sidebar ≈252 px · Header ≈64 px (referência 1280 × 800 — não são fixas)". Nada é editável, nem no modo Livre (P12). O prompt individual traz `grid-template-columns: 252px minmax(0, 1fr)` ao lado de `calc(100dvh − 64 px)`. Esse `calc` usa o sinal de menos tipográfico U+2212 e põe espaço antes da unidade, o que o torna **CSS inválido** (validado no Chromium, ver §3.4).
4. Entendeu.
5. Não voltou.
6. Ficou confusa: "≈252 px" e "252px" convivem no mesmo bloco.
7. Nenhum controle falhou.
8. Não abandonaria.
9. A forma é profissional. O conteúdo técnico tem deslizes.
10. Campos numéricos para as medidas estruturais e trechos de CSS em ASCII válido.

### P5. Arquitetura do celular (`11b-mobile.png`, `12-mobile-selecionado.png`)
1. Escolheu "Topbar com Bottom Navigation" (sugerido).
2. Esperava definir **quais** destinos vão na barra inferior.
3. A prévia num celular grande é interativa, mas mostra um app financeiro genérico ("Orla", "Saldo do mês", "Pedidos"). Os destinos (Início, Buscar, Agenda, Perfil) não podem ser editados aqui. O texto "Combina com: SaaS · Apps corporativos · Us…" fica truncado, sem como ler o resto.
4. Entendeu.
5. Não voltou.
6. Não ficou confusa.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Sim.
10. Usar o nome e os módulos do projeto nas prévias e permitir editar os destinos da navegação.

### P6. Revisão e aprovação do esqueleto (`13-revisao.png`, `14-previa-integrada.png`)
1. Revisou e aprovou.
2. Esperava um resumo fiel.
3. O resumo está correto e cada item tem link "Alterar". A seção, porém, se chama **"Esqueleto aprovado" antes** da aprovação. A prévia integrada continua com conteúdo genérico (Receita, Clientes, Ticket médio, Agenda, Mensagens), sem refletir kanban, faturamento etc. O indicador "Esqueleto 5/5" segue no topo durante todo o acabamento.
4. Entendeu.
5. Não voltou.
6. Ficou levemente confusa.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Sim.
10. Renomear para "Esqueleto a aprovar" e montar a prévia com os módulos informados no passo 1.

### P7. Identidade visual (`15` a `20b`)
1. Escolheu a paleta "Azul Institucional", trocou a primária para a cor de marca `#4f46e5`, ajustou tipografia e formas.
2. Esperava que hover, active, soft, foco e link fossem **derivados** da primária. Esperava também modo escuro e escalas.
3. Resultado em três partes:
   - **Tokens derivados não acompanham a primária.** Depois de mudar `primary` para `#4f46e5`, `primaryHover` continuou `#1a46c2` (azul), `primaryActive` `#173ead`, `focusRing`, `link` e `selectedText` `#1d4ed8`, e `gradientFrom` `#1d4ed8`. A prévia mostra o botão "Primário" índigo ao lado de "Hover" azul (`17b-primaria-alterada.png`). Foi preciso editar 10 tokens à mão; a tela registra "10 token(s) alterado(s) manualmente".
   - **Validação:** o hex inválido `#zzz` é revertido em silêncio, sem mensagem e sem `aria-invalid`.
   - **Formas e superfícies** aceitam combinações contraditórias sem aviso: "Elevada (sombras)" com "Sem sombra", e "Plana (sem bordas nem sombras)" com "Bordas: 2 px" (`20-formas-conflito.png`, estado lido pelos `aria-pressed`).
   - Cada paleta é **clara ou escura**. Não existe par claro/escuro.
   - A tipografia oferece 6 fontes fixas, base de 14 a 18 px e pesos. Não há escala por nível nem altura de linha.
4. Entendeu.
5. Voltou: alternou várias vezes entre as abas Paletas e Ajustar cores.
6. Ficou confusa com a cor da marca não se propagar.
7. Não houve controle quebrado, mas a derivação automática não existe.
8. Para uma marca própria, quase abandonaria nesse ponto.
9. O painel de contraste ao vivo é profissional. A falta de derivação, não.
10. Botão "Derivar estados a partir da primária", modo escuro e regras de exclusão mútua entre superfície, sombra e borda.

### P8. Headers e sidebars (`21-navegacao.png`, `23`, `24`, `24b-combinacao.png`)
1. Escolheu o header "Trilha de Contexto" (composição B) e a sidebar "Seletor de Espaços", que tem seletor de workspace, ideal para multi-tenant.
2. Esperava coerência com a medida do layout (252 px e 64 px) e itens de menu editáveis.
3. As prévias são interativas e de alta qualidade (o seletor de espaço abre de verdade). Mas a sidebar tem **≈260 px**, contra 252 px no layout, e o header **56 px + faixa de 40 px**, contra 64 px no layout. Nenhum aviso aparece. Os itens de menu são de demonstração ("Caixa de entrada", "Marketing", "Tucano", "Quero-quero") e não há onde editá-los nesse módulo.
4. Entendeu.
5. Não voltou.
6. Ficou confusa: o próprio texto avisa que o "Layout Studio decide onde ficam" e o modelo escolhido tem outras medidas.
7. Nenhum controle falhou. Os toasts cobrem a prévia (`24b`).
8. Não abandonaria.
9. Visualmente, sim.
10. Reconciliar as medidas, ou deixar o usuário escolher qual vale, e permitir editar os itens de navegação.

### P9. Componentes (`25` a `30`, `41`)
1. Adicionou Botões, Quadros Kanban, Tabelas, Text inputs, Modais e Badges, todos na família "Compact Pro", e personalizou o Kanban.
2. Esperava uma **API de componente**: todas as variantes e tamanhos com medidas exatas, herdando a geometria global.
3. Cada item é uma **instância**: um texto, uma variante e um tamanho. Para documentar primário, secundário, fantasma e perigo é preciso "Duplicar". A família **sobrescreve a identidade global sem registrar exceção**: raio 4/6 px contra o 8 px escolhido, base 13 px contra 14 px, "sem sombras" contra a sombra "Sutil" escolhida, peso "Inter 640" contra 600. O Kanban só oferece colunas, cartões por coluna e três chaves (contadores, etiquetas, avatares). Não há limite WIP, raias, campos do cartão nem estado vazio. Existe uma categoria "Sidebars" (Componentes) além da sidebar da Navigation Showcase, o que dá duas fontes para a mesma peça (`41`).
4. Entendeu.
5. Não voltou.
6. Ficou confusa: o painel declara "Token global (somente leitura)", mas a família muda raio, fonte e sombra.
7. Nenhum controle falhou. A remoção usa confirmação inline, que é um padrão bom (`43-apos-remover.png`).
8. Não abandonaria.
9. A forma, sim. O modelo conceitual é fraco para um design system.
10. Separar "família visual" de "geometria global", mostrar o conflito e gerar a especificação de todas as variantes e tamanhos.

### P10. Entrega e Central de Prompts (`30b-entrega.png`, `31`/`32-itens.png`, `32b-json-tab.png`, `42-contradicoes.png`)
1. Revisou o Master Prompt, os itens e as contradições, e baixou `.md` e `.json`.
2. Esperava que o detector apontasse as divergências vistas em P8 e P9.
3. A tela mostra "**0 contradições a decidir**" e "As escolhas atuais são compatíveis entre si". O §3 mostra mais de 8 contradições objetivas. O prompt tem 53.680 caracteres.
4. Entendeu.
5. Não voltou.
6. Ficou confusa: a promessa de detectar contradições não se cumpre.
7. O detector de contradições não funcionou para medidas nem para geometria.
8. Não abandonaria.
9. Parece profissional, mas passa uma falsa sensação de segurança.
10. Ver os problemas 1 e 2 na §5.

### P11. Exportar e importar (`33-exportar.png`, `39-import-json.png`)
1. Baixou os 5 formatos e reimportou o JSON de especificação.
2. Esperava arquivos válidos e ida e volta sem perdas.
3. Os 5 arquivos foram baixados. A importação devolveu exatamente os tokens personalizados (`primary #4f46e5`, `primaryHover #4338ca`, `link #4338ca`). Antes de importar, o estado anterior foi salvo como versão.
4. Entendeu.
5. Não voltou.
6. Não ficou confusa.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Sim.
10. Oferecer também exportação em tokens DTCG e um tema Tailwind.

### P12. Modo Livre (`36-livre.png`, `36b-livre-desktop.png`, `40a-color-system-livre.png`, `37-template-studio.png`)
1. Procurou o que o Livre permite além do Guiado.
2. Esperava edição livre: medidas, grid, IA de navegação, tokens adicionais.
3. São **os mesmos módulos, sem nenhuma liberdade extra**. As medidas continuam só leitura. Muda apenas a ordem de acesso. Os nomes divergem entre os modos: "Identidade visual" e "Color System", "Ajustar cores" e "Tokens e cores", "Headers e sidebars" e "Navigation Showcase", "Validação responsiva" e "Responsive Validation Lab". Na grade "Todos os módulos", rótulos de status **vazam da borda do cartão** ("Cadastro em etapas progressivas", "Sidebar integral com header global"). O Template Studio só tem páginas de marketing (SaaS, loja, restaurante…). Não há modelos de tela de aplicação (faturamento, configurações, convites).
4. Entendeu.
5. Não voltou.
6. Ficou confusa com a nomenclatura duplicada.
7. Nenhum controle falhou.
8. Uma dev que entrasse pelo Livre esperando liberdade técnica provavelmente sairia aqui.
9. Parcialmente.
10. O Livre deveria expor parâmetros (medidas, escala de espaçamento, raios, breakpoints, itens de menu).

### P13. 1280×800 (`38a` a `38e`)
- Sem overflow horizontal em nenhuma das 5 telas (`scrollWidth = 1280`).
- O stepper trunca os rótulos ("8. Naveg…", "9. Comp…").
- Os rótulos de status continuam vazando dos cartões (`38a`).
- Em Identidade, a grade de paletas cai para 2 colunas e o espaço útil fica apertado, mas funciona (`38c`).

### P14. Busca e ferramentas (`39b-busca-ctrlk.png`, `40-validacao.png`)
- Ctrl+K encontra só módulos: "token" leva a Color System, e "kanban" dá "Nada encontrado", embora a categoria "Quadros Kanban" exista.
- "Validação responsiva" depende de um executor local em Python + Playwright e está marcada como "Em evolução". Não foi executada.

---

## 3. Análise técnica das exportações

### 3.1 Inventário (`exportados/`)

| Arquivo | Tamanho | Válido? |
|---|---|---|
| `exportar-orbita-pm-master-prompt.md` | 55.564 bytes (53.680 caracteres, 954 linhas) | Markdown bem formado |
| `exportar-orbita-pm-especificacao.json` | 130.446 bytes | JSON válido (`json.load` sem erro) |
| `exportar-orbita-pm-tokens.css` | 3.904 bytes | CSS válido (18 regras e 65 variáveis no CSSOM do Chromium) |
| `exportar-orbita-pm-ficha.html` | 79.016 bytes | Autônomo, sem `<script>` e sem recursos externos |
| `exportar-orbita-pm-backup.json` | 5.205 bytes | JSON válido; contém o estado do projeto |
| `prompt-elemento-botoes-compactpro.txt` | prompt individual copiado do modal | — |

As duas cópias do `.md` e do `.json`, baixadas na Entrega e na tela Exportar, diferem **apenas** no carimbo de hora (`generatedAt`), verificado com `diff`.

### 3.2 JSON: estrutura e problemas

A estrutura de topo é razoável: `project`, `architecture{entryFlow,landing,login,signup,desktop,mobile}`, `navigation{header,sidebar}`, `identity{palette,tokens,overrides,typography,geometry}`, `components[]`, `responsive{breakpoints,…}`, `implementationRules`, `conflicts`, `pending`, `items`, `source`. Há `$schema: "atelier-ui/spec@1"`, mas nenhum JSON Schema publicado acompanha o arquivo.

Problemas para consumo por máquina:

1. **Rótulos de interface viram chaves, com valores em texto.** Trecho de `components[0].properties`:
   ```json
   "Família visual": "13. Compact Pro",
   "Mostrar botão secundário ao lado": "sim",
   "Altura de controles": "30 px (mínimo 44 px de área de toque no celular)",
   "Colunas (uma por linha)": "Backlog | A fazer | Em andamento | Em revisão | Concluído"
   ```
   As chaves têm espaços, acentos e parênteses. Os booleanos são `"sim"`/`"não"`. As listas são strings separadas por `|`. Os números trazem unidade e comentário. O índice do catálogo entra no valor ("13. ").
2. **Medidas não numéricas:** `"measurements": {"sidebar": "≈252 px", "header": "≈64 px"}` e `"padding horizontal": "24–32 px (16 px no celular)"`. Nenhum desses valores pode ser parseado sem heurística.
3. **`identity.tokens` mistura cores e flags:** `"mode": "light"` e `"gradientEnabled": false` ficam no mesmo objeto que os 44 hex. Não segue o formato W3C Design Tokens (sem `$value`/`$type`).
4. **O JSON, que diz ser a "fonte da verdade", tem menos informação que o CSS.** `geometry.radius = "medium"` vem sem valor em px. O JSON não contém escala de espaçamento, valor de sombra nem escala tipográfica (busca por `space`, `lineHeight`, `fontSize`, `duration`: 0 ocorrências). O CSS traz `--radius-sm/md/lg`, `--space-1..8` e `--shadow-surface`.
5. **Redundância tripla:** a mesma informação aparece em `architecture`/`navigation`/`components`, de novo em `items[17]` e, em forma crua, em `source`. Os mesmos 20 pares de propriedades da família (raio, borda, sombra…) se repetem nos 6 componentes.
6. **`"conflicts": []`** convive com divergências objetivas no próprio arquivo:
   - `architecture.desktop.properties.gridColumns = "252px 1fr"` contra `navigation.sidebar.measurements.largura = "260 px"`.
   - `gridRows = "64px 1fr"` contra `navigation.header.measurements["altura (desktop)"] = "56 px"`, com composição B de mais 40 px.
7. **Contradição de plataforma:** `architecture.mobile.properties.lateral = "none"` (sem drawer), mas `navigation.sidebar.measurements["drawer no celular"] = "min(85vw, 280 px)"`.
8. **Dados de demonstração vazam para a especificação** em campos que não editei. Tabela: `"Título": "Pedidos recentes"`, `"Cliente | Status | Valor | Data"`. Input: `"Texto de ajuda": "Usaremos para enviar o recibo."`. Nada disso pertence ao domínio do projeto.
9. **Cor sem explicação:** `components[*].colors["Destaque"] = "#0c91cd"`, enquanto `tokens.accent = "#0ea5e9"`. O arquivo não registra de onde vem essa cor nem a trata como exceção.

### 3.3 CSS: utilizável, com ressalvas

O que está bom:
- Variáveis em `:root` com nomes kebab-case (`--color-primary`, `--color-text-muted`…).
- `box-sizing` global, `:focus-visible`, `prefers-reduced-motion`.
- Inputs com 16 px no celular.

Problemas:

1. **O seletor global `input` afeta checkbox, radio e range.** Medido no Chromium com o CSS exportado: checkbox e radio ficam com `height: 44px`; o range ganha `border: 1px solid` e `border-radius: 8px`.
   ```css
   input, select, textarea { font: inherit; min-height: 44px; border: var(--border-width) solid var(--color-border-strong); … }
   ```
   O correto seria algo como `input:not([type=checkbox]):not([type=radio]):not([type=range])`.
2. **Escala de espaçamento incoerente:** `--space-unit: 6px`, mas `--space-1..8` = 4/8/12/16/20/24/32/40 (base 4), e o prompt fala em "escala de 4 px".
3. **`.btn-primary { min-height: 44px; border-radius: var(--radius-md) }`** (8 px) contra o botão "Compact Pro" do JSON e do prompt: "controles de 30 px", "raio de 4 px".
4. **`.surface { border-radius: var(--radius-lg) }`** dá 12 px nos contêineres. A identidade global escolhida tem cantos médios de 8 px, e a família diz "6 px em contêineres". São três valores para o mesmo conceito.
5. **Breakpoint `@media (max-width: 599px)`**, enquanto o prompt manda trocar para a arquitetura mobile "abaixo de 768 px". Os breakpoints do JSON (`md` de 600 a 1023) não coincidem com 768 nem com o padrão do Tailwind (640/768/1024/1280).
6. **`--gradient-brand: none`** convive com `--color-gradient-from/to` definidos. É coerente com `gradientEnabled: false`, mas confunde.
7. **Fontes:** `--font-heading: 'Inter Variable', Inter, …` sem `@font-face`/`@import`, e o prompt não menciona como carregar a fonte.
8. **`body { overflow-wrap: anywhere; }`** em escala global quebra palavras no meio em títulos de cartões e cabeçalhos de tabela. Deveria ser aplicado apenas a conteúdo longo, como o próprio prompt recomenda ("em conteúdos longos (e-mails, URLs, códigos)").
9. **Tokens ausentes:** modo escuro (só `color-scheme: light`), escala tipográfica (só `--font-size-base`), altura de linha, z-index, duração/curva de movimento, breakpoints e alturas de controle por tamanho.

**Reuso com Tailwind.** As cores podem ir para o tema em cerca de 15 minutos, como abaixo. A partir daí o trabalho é manual.
```js
// tailwind.config (v3) — mapeamento manual necessário
colors: { primary: { DEFAULT: 'var(--color-primary)', hover: 'var(--color-primary-hover)' }, … }
```
- Os modificadores de opacidade (`bg-primary/50`) não funcionam em v3, porque as variáveis são hex e não canais RGB. Em v4 funcionam via `color-mix()`.
- Raios, espaçamentos e tipografia precisam ser reconciliados à mão por causa das divergências acima.
- O JSON não serve como entrada direta de um gerador (Style Dictionary/Tokens Studio) sem um script de limpeza: filtrar `mode`/`gradientEnabled`, converter "medium" em px e parsear "≈252 px".

### 3.4 Master Prompt: precisão e prolixidade

**Tamanho e repetição:** 53.680 caracteres, 798 linhas não vazias e só 489 únicas. **26 % dos caracteres estão em linhas repetidas** (medido). Cada um dos 6 componentes repete o mesmo bloco de 20 propriedades da família, com 6 ocorrências de "Inter 640", "Raio de 4 px…" e "Movimento: Rápido (100 ms)".

**Contradições internas, todas com "0 contradições" na interface:**

| # | Tema | Trecho A | Trecho B |
|---|---|---|---|
| 1 | Altura do header | Layout: "grid-template-rows: 64px minmax(0, 1fr)" | Header: "Barra principal com 56 px" + "linha inferior de 40 px" (≈96 px) |
| 2 | Largura da sidebar | Layout: "252px minmax(0, 1fr)" | Sidebar: "Formato integral… com 260 px de largura" |
| 3 | Posição da sidebar | Layout: "a sidebar é sticky em top: 64 px com altura calc(100dvh − 64 px)" | Sidebar: "position: sticky; top: 0; height: 100dvh" |
| 4 | Altura dos itens do menu | Layout: "Itens de navegação com 40–44 px de altura" | Sidebar: "itens de 36 px de altura" |
| 5 | Sidebar no celular | Sidebar: "Abaixo de 768 px: sai do fluxo e vira um drawer à esquerda…" | Mesma seção, linhas depois: "Sidebars: no celular, siga exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria)" |
| 6 | Navegação mobile | Mobile: "a navegação principal fica só embaixo" (bottom nav) | Header: "Abaixo de 768 px: barra única de 56 px com logo, avatar, botão de menu ☰ … Vão para o painel do menu: os 3 itens" |
| 7 | Tablet | Layout: "768–1023 px: a sidebar recolhe para rail de ≈72 px" | Header: "De 768 a 1023 px: a navegação recolhe para o botão ☰"; Relação: "Entre 600 e 1023 px … caso contrário, use a estrutura mobile" |
| 8 | Altura dos controles | Botões: "Altura de controles 30 px" | Botões, na mesma seção: "alturaMd: 40–44 px"; Login: "alturaInputs: ≈44 px"; CSS: `min-height: 44px` |
| 9 | Raio | Geometria global: "Cantos médios (8 px)" | Componentes: "Raio de 4 px em controles e 6 px em contêineres"; CSS `.surface`: 12 px |
| 10 | Foco | Botões: "anel de 3 px … a 35%" | Mesma seção: "Foco com anel de 2 px"; Estados: "anel de 2–3 px"; CSS: `outline: 2px` |
| 11 | Tipografia | Tipografia: "filtros e botões com pelo menos 14 px" | Compact Pro: "Texto base 13 px, rótulos 12 px" |
| 12 | Espaçamento | Geometria: "Escala de espaçamento em múltiplos de 4 px" | Mesma seção: "unidadeDeEspaco: 6px" |
| 13 | Sombra | Geometria global: "sombra sutil" | Componentes: "sem sombras" |

**Erros factuais e técnicos:**
- **Contraste reprovado por instrução do próprio prompt.** O header manda usar fundo `navBg` (#0f1f4d) e diz: "o ativo usa a cor de texto principal e peso 600, os demais textMuted". O texto principal #0f172a sobre #0f1f4d dá **1,13:1**; `textMuted` sobre `navBg` dá **3,07:1**. A sidebar pede "hover com fundo hover" (#f4f4f4) sobre `navBg`, e o `navText` (#caced8) sobre esse hover dá **1,43:1**. O painel de contraste da interface só confere `navText` sobre `navBg` (10,1:1) e não enxerga esse uso.
- **CSS inválido se copiado literalmente:** `calc(100dvh − 64 px)`, `min(85vw, 280 px)` e `calc(100vw − 16 px)` retornam `CSS.supports(...) === false`, por causa do U+2212 e do espaço antes da unidade. `calc(100dvh - 64px)` retorna `true`.
- **Texto idêntico para composições diferentes** (cópia defeituosa): "A “Trilha na barra principal” = logo e navegação juntos à esquerda; busca e ações empurradas para a direita; B “Menu + trilha embaixo” = logo e navegação juntos à esquerda; busca e ações empurradas para a direita." Além disso, "Breadcrumbs … dentro da barra, logo após o logo" contradiz a composição B escolhida (trilha numa faixa inferior).
- **Regras irrelevantes coladas em componentes:** em Botões e no Kanban aparece "tabelas viram cartões" e "Item ativo marcado por sublinhado de 2 px".
- **Vazamento de marca fictícia:** "Header: logotipo “Aurora Flow”…" (3 ocorrências), "marca fictícia “Tucano”", breadcrumbs "Projetos / Site institucional / Página inicial". Há um aviso "substitua pela marca real", mas o nome do projeto (Orbita PM) era conhecido e deveria ser usado.
- **O prompt nunca cita os nomes das variáveis CSS** (0 ocorrências de `--color`). Ele fala em `primary`, `navBg` etc., e quem implementa precisa adivinhar o mapeamento para `--color-primary`, `--color-nav-bg`. A tecnologia escolhida inclui Tailwind (1 ocorrência, só na seção A), e o prompt não diz como integrar os tokens ao Tailwind.

**O que o prompt faz bem:**
- Orientações concretas de acessibilidade e segurança: `autoComplete="current-password"`, erro genérico de credenciais, `aria-invalid` + `aria-describedby`, resumo com `role="alert"`, hash Argon2id/bcrypt, cookies httpOnly.
- Responsividade bem trabalhada: safe areas, `100dvh`, 44×44 px, landscape ≤25 % de barras fixas.
- Alternativa de teclado no arrastar-e-soltar do kanban.

### 3.5 Contraste dos tokens exportados (WCAG 2.x, calculado)

| Par | Razão | Situação |
|---|---|---|
| `warning` #a85c04 sobre `warningBg` | 4,41:1 | abaixo de AA para texto normal |
| `error` #dc2626 sobre `errorBg` | 4,01:1 | abaixo de AA |
| `info` #2563eb sobre `infoBg` | 4,37:1 | abaixo de AA |
| `borderStrong` #c7c7c7 sobre `surface` (borda de input) | 1,69:1 | reprova o 1.4.11 (3:1) |
| `focusRing` #4f46e5 sobre `navBg` | 2,52:1 | foco pouco visível na sidebar e no header escuros |
| `placeholder` sobre `surface` | 3,51:1 | aceitável para placeholder, mas abaixo de 4,5 |
| `textDisabled` sobre `surface` | 2,51:1 | aceitável: desabilitado é isento |

O painel "Contraste (WCAG)" da interface verifica só 7 pares e marca todos como "AA" (`17b`). Os alertas semânticos (exibidos na própria prévia) e as bordas de input ficam fora da verificação.

### 3.6 O que falta para uma dev implementar sem adivinhar

1. Um valor **único e exato** por medida estrutural: altura do header, largura da sidebar, alturas de controle sm/md/lg, raios por nível.
2. Escala tipográfica completa (tamanho e altura de linha por nível) no JSON e no CSS. Hoje ela existe só como frase no prompt: "12 / 14 / 17 / 21 / 28 / 36 px".
3. Breakpoints únicos e coerentes entre JSON, CSS e prompt.
4. Tema escuro, ou a declaração explícita de que não haverá.
5. A arquitetura de informação da navegação: lista de destinos de desktop e mobile, com ícones e permissões por papel.
6. Especificação das telas do domínio: faturamento (planos, uso, faturas), configurações da organização, convites (estados pendente, aceito, expirado), matriz de papéis × permissões, troca de organização, relatórios. Hoje elas são só itens de uma lista na seção A.
7. Kanban: limite WIP, raias, campos do cartão, ordenação, estados vazio e de erro, regras de permissão para mover cartões.
8. A API de cada componente: todas as variantes, tamanhos e estados, não apenas a instância configurada.
9. Mapeamento entre tokens do JSON, variáveis CSS e tema Tailwind.

---

## 4. Modo Livre, limitações, decisões não configuráveis e redundâncias

### 4.1 Modo Livre
O Livre é **apenas navegação não sequencial pelos mesmos módulos** (`36-livre.png`). Ele não abre nenhum parâmetro técnico adicional: as medidas do layout continuam só leitura (`36b`), não há editor de grid, não há escala de espaçamento, não há edição de itens de navegação no Navigation Showcase. A promessa "Layouts, paletas, componentes, galerias, editor e Master Prompt" sugere um editor livre que não existe para a estrutura.

### 4.2 Limitações técnicas observadas
- A cor primária não deriva os estados.
- Não há modo escuro nem tema duplo.
- São 6 fontes fixas, sem fonte personalizada nem monoespaçada separada.
- O raio é um valor único na interface, embora o CSS gere sm/md/lg (6/8/12) sem controle do usuário.
- Seleção única em cadastro e nos chips de tecnologia.
- As prévias não usam o nome nem os módulos do projeto.
- O detector de contradições não cobre medidas, geometria nem navegação mobile.
- A busca (Ctrl+K) encontra apenas módulos.
- A validação responsiva exige um executor local (Python).
- Tablists sem `tabpanel`/`aria-controls` (0 `[role=tabpanel]` na Central de Prompts).
- O fluxo de entrada usa `button[aria-pressed]` em vez de `radiogroup` para uma escolha exclusiva.

### 4.3 Decisões que deveriam ser configuráveis e não são
1. Largura da sidebar, altura do header e altura da sub-faixa do header, além de qual valor prevalece quando o layout e o modelo de navegação divergem.
2. Breakpoints (e o ponto de troca desktop → mobile).
3. Escala de espaçamento (unidade e passos) e escala de raios.
4. Escala tipográfica e alturas de linha.
5. Alturas de controle por tamanho (sm/md/lg) e largura do anel de foco.
6. Itens de navegação de header, sidebar e bottom nav (rótulo, ícone, ordem, destino).
7. Derivação automática dos estados a partir da primária (ou travar manualmente).
8. Modo escuro (par de paletas).
9. Vários fluxos de cadastro (self-serve + convite).
10. Se a família visual do componente pode ou não sobrescrever a geometria global.
11. Nome e logo do produto usados nas prévias e no prompt, no lugar de marcas fictícias.
12. Formato do JSON: DTCG, chaves técnicas em inglês, valores numéricos.

### 4.4 Redundâncias
- Dois menus para as mesmas telas: "Construtor guiado" e "Estrutura/Identidade" aparecem juntos na barra lateral do modo Guiado, com "Objetivo do projeto" duplicado.
- Nomes duplicados em português e inglês para a mesma tela (P12).
- Sidebar definida em dois lugares: Navigation Showcase ("Seletor de Espaços", 260 px) e Componentes › Sidebars (Compact Pro, itens próprios), além da categoria "Headers e topbars" em Componentes.
- Os tokens `active` e `pressed` são separados (#ebebeb e #e0e0e0) sem diferença semântica clara em CSS (`:active`).
- JSON com `items` e `source` repetindo as seções. Prompt com 26 % de linhas repetidas.
- Na Central de Prompts, a mesma ação aparece em três lugares: "Copiar/Baixar" na Entrega, na Central de Prompts e em Exportar.

---

## 5. Problemas

Escala de gravidade: **Crítica** impede o uso confiável do resultado; **Alta** exige retrabalho significativo; **Média** prejudica qualidade e confiança; **Baixa** é cosmética ou menor.

1. **Detector de contradições ignora divergências de medida e de navegação**
   - **Onde:** Central de Prompts › Contradições; Master Prompt; JSON `conflicts`.
   - **Evidência:** `42-contradicoes.png` mostra "0"; tabela §3.4 (13 contradições); JSON: `gridColumns "252px 1fr"` contra sidebar `"260 px"`.
   - **Gravidade:** Crítica.
   - **Sugestão:** comparar automaticamente as medidas do layout com as dos modelos de header e sidebar e com a geometria das famílias, e listar cada caso com a opção "qual prevalece". Na geração, emitir um valor único, por exemplo: "Header: 96 px (56 px + faixa de trilha de 40 px). grid-template-rows: 96px minmax(0, 1fr). Sidebar: 260 px; grid-template-columns: 260px minmax(0, 1fr)."

2. **Navegação mobile contraditória: drawer e hambúrguer contra bottom nav**
   - **Onde:** Master Prompt, seções Header, Sidebar e Layout mobile.
   - **Evidência:** §3.4, itens 5 e 6.
   - **Gravidade:** Crítica.
   - **Sugestão:** quando o layout mobile tem `lateral: none`, suprimir das seções Header e Sidebar todas as regras abaixo de 768 px e substituí-las por: "Abaixo de 768 px, header e sidebar desktop não são renderizados. A navegação é exclusivamente a definida em ‘Layout mobile’: topbar de 56 px (logo, busca, notificações, avatar) e bottom navigation com os destinos [lista]. Não crie drawer nem botão ☰."

3. **Família do componente sobrescreve a identidade global sem registrar exceção**
   - **Onde:** Componentes; prompt §E; JSON `components[*].properties`.
   - **Evidência:** "Raio de 4 px em controles e 6 px em contêineres", "Texto base 13 px" e "sem sombras", contra os valores globais 8 px, 14 px e sutil. "Destaque #0c91cd" contra o token `accent` #0ea5e9.
   - **Gravidade:** Alta.
   - **Sugestão:** mostrar o aviso "Esta família altera: raio 8→4 px, base 14→13 px, sombra sutil→nenhuma. Manter a identidade global / Aceitar como exceção". No prompt, listar em "Exceções" e não como propriedade normal.

4. **Mudar a cor primária não atualiza os tokens derivados**
   - **Onde:** Identidade › Ajustar cores (Tokens e cores).
   - **Evidência:** `17b-primaria-alterada.png`; `primaryHover` ficou #1a46c2 com `primary` #4f46e5.
   - **Gravidade:** Alta.
   - **Sugestão:** derivar automaticamente hover, active, soft, focusRing, selected, selectedText, link, linkHover e gradientFrom (por exemplo em OKLCH, com −8 %/−16 % de luminosidade), com um cadeado por token para manter um valor manual.

5. **O prompt gera combinações com contraste reprovado**
   - **Onde:** prompt, seções Header e Sidebar; painel WCAG.
   - **Evidência:** `text` sobre `navBg` 1,13:1; `navText` sobre `hover` 1,43:1; `focusRing` sobre `navBg` 2,52:1; `error` sobre `errorBg` 4,01:1 (§3.5).
   - **Gravidade:** Alta.
   - **Sugestão de redação para o prompt:** "Links do header sobre `navBg`: cor `navText`; item ativo `navActiveText`, peso 600, fundo `navActive`. Hover: fundo `navActive` a 60 %, nunca o token `hover` (claro). Foco visível: anel de 2 px em `navActiveText` (≥ 3:1 sobre `navBg`)." Ampliar o painel WCAG para todos os pares texto/fundo usados, incluindo semânticos e bordas de input.

6. **O JSON não é consumível por máquina e está incompleto**
   - **Onde:** `exportar-orbita-pm-especificacao.json`.
   - **Evidência:** §3.2, itens 1 a 4. Rótulos em português como chaves, `"sim"`, `"≈252 px"`, raio `"medium"`, sem espaçamento nem sombra.
   - **Gravidade:** Alta.
   - **Sugestão:** chaves técnicas estáveis (`controlHeight`, `showSecondary`), valores tipados (`{ "value": 252, "unit": "px" }`), arrays de verdade, um bloco `tokens` em formato DTCG (`{"color":{"primary":{"$type":"color","$value":"#4f46e5"}}}`) contendo radius, space, shadow, typography e breakpoints, e um JSON Schema publicado.

7. **CSS: o seletor `input` afeta checkbox, radio e range, e há valores incoerentes**
   - **Onde:** `exportar-orbita-pm-tokens.css`.
   - **Evidência:** checkbox e radio medidos com 44 px; range com borda; `--space-unit: 6px` contra a escala de 4; `.btn-primary` com 44 px contra 30 px no prompt; breakpoint 599 contra 768.
   - **Gravidade:** Alta.
   - **Sugestão:** `input:where(:not([type=checkbox],[type=radio],[type=range],[type=color]))`, `--space-unit: 4px`, alturas por tamanho (`--control-h-sm/md/lg`), breakpoint igual ao do prompt, e tokens de modo escuro em `[data-theme=dark]`.

8. **Trechos CSS inválidos no prompt**
   - **Onde:** prompt e prompts individuais.
   - **Evidência:** `calc(100dvh − 64 px)` dá `CSS.supports === false`.
   - **Gravidade:** Média.
   - **Sugestão:** gerar trechos de código em ASCII, entre crases: `` `height: calc(100dvh - 64px)` ``, `` `width: min(85vw, 280px)` ``.

9. **Prompt prolixo: 26 % de linhas repetidas e regras fora de contexto**
   - **Onde:** Master Prompt §E.
   - **Evidência:** 53.680 caracteres; blocos idênticos nos 6 componentes; "tabelas viram cartões" dentro de Botões.
   - **Gravidade:** Média.
   - **Sugestão:** declarar a família uma única vez ("Família Compact Pro — aplica-se a todos os componentes abaixo: …") e, em cada componente, só o que é específico. Filtrar as regras responsivas por tipo de componente.

10. **Texto idêntico para as composições A e B do header**
    - **Onde:** prompt › Header Trilha de Contexto.
    - **Evidência:** §3.4, erros factuais.
    - **Gravidade:** Média.
    - **Sugestão de redação:** "Composição escolhida: B. Faixa superior de 56 px (logo, links Projetos/Equipe/Ajustes, notificações, avatar) e faixa inferior de 40 px (breadcrumbs à esquerda, ação contextual à direita). Altura total: 96 px." Citar só a composição escolhida.

11. **Conteúdo de demonstração vaza e a IA da navegação não é editável**
    - **Onde:** Prévias, Navigation Showcase, prompt, JSON.
    - **Evidência:** "Aurora Flow" (3×), "Tucano", "Site institucional", "Pedidos recentes", "recibo"; `14-previa-integrada.png` mostra Receita/Clientes.
    - **Gravidade:** Média.
    - **Sugestão:** usar o nome e os módulos do projeto em prévias e textos, e oferecer um editor único de destinos de navegação compartilhado entre header, sidebar e bottom nav.

12. **Sem modo escuro**
    - **Onde:** Identidade.
    - **Evidência:** cada paleta é "clara" ou "escura"; o CSS só tem `color-scheme: light`.
    - **Gravidade:** Média.
    - **Sugestão:** paletas em par claro/escuro e exportação `[data-theme="dark"]{…}`.

13. **Seleção única onde o B2B precisa de mais de uma**
    - **Onde:** Cadastro; chips de tecnologia.
    - **Evidência:** P2 e P3, estado lido pelos `aria-pressed`.
    - **Gravidade:** Média.
    - **Sugestão:** cadastro com "fluxo principal + fluxos adicionais (convite, SSO)" e chips cumulativos.

14. **Controles contraditórios em Formas e superfícies**
    - **Onde:** Identidade › Formas.
    - **Evidência:** `20-formas-conflito.png` (Elevada + Sem sombra; Plana + 2 px).
    - **Gravidade:** Média.
    - **Sugestão:** fazer a superfície definir sombra e borda por padrão e mostrar um aviso de conflito ao divergir.

15. **Componente modelado como instância, não como API**
    - **Onde:** Componentes › Personalizar.
    - **Evidência:** P9 (uma variante e um tamanho por item).
    - **Gravidade:** Média.
    - **Sugestão:** a aba "Especificação" deveria gerar a tabela de variantes × tamanhos × estados com medidas exatas. A instância fica como exemplo de uso.

16. **Kanban raso para um produto de gestão de projetos**
    - **Onde:** Componentes › Quadros Kanban.
    - **Evidência:** `29-kanban-editor.png`.
    - **Gravidade:** Média.
    - **Sugestão:** opções de limite WIP, raias, campos do cartão (prioridade, prazo, responsável), coluna vazia e permissão de mover.

17. **Telas do domínio sem especificação**
    - **Onde:** fluxo completo; Template Studio.
    - **Evidência:** as features aparecem só na lista da seção A; o Template Studio só tem páginas de marketing.
    - **Gravidade:** Média.
    - **Sugestão:** modelos de tela de aplicação: Configurações da organização, Membros e convites, Papéis e permissões (matriz), Faturamento (plano, uso, faturas), Relatórios.

18. **Modo Livre não acrescenta liberdade, e a nomenclatura duplica**
    - **Onde:** Modo Livre.
    - **Evidência:** `36-livre.png`, `36b`, `40a`.
    - **Gravidade:** Baixa.
    - **Sugestão:** expor no Livre os parâmetros da §4.3 e unificar os nomes (só português ou só inglês).

19. **Medidas aproximadas ("≈", "24–32 px") em vez de valores exatos**
    - **Onde:** prompt e JSON.
    - **Evidência:** 30 ocorrências de "≈" no prompt.
    - **Gravidade:** Baixa.
    - **Sugestão:** emitir um valor exato e, quando houver tolerância, separá-la: "padding: 24px (mín. 16px no celular)".

20. **Defeitos visuais na própria ferramenta**
    - **Onde:** vários.
    - **Evidência:**
      - status vazando do cartão (`36-livre.png`, `38a`);
      - stepper truncado a 1280 (`38c`);
      - ilustração cortada (`01`);
      - toasts sobre rodapés de modal (`07b`, `26`);
      - inputs com alturas diferentes (`02`);
      - "Esqueleto aprovado" antes de aprovar (`13`).
    - **Gravidade:** Baixa.
    - **Sugestão:** `min-width:0`, quebra de linha nos rótulos de status, toasts fora da área do rodapé do modal, renomear a seção para "Esqueleto a aprovar".

21. **Acessibilidade da própria interface**
    - **Onde:** tablists, fluxo de entrada, campo hex.
    - **Evidência:** 0 `role=tabpanel`; grupo de `button[aria-pressed]` para escolha exclusiva; hex inválido revertido sem mensagem.
    - **Gravidade:** Baixa.
    - **Sugestão:** `role=tabpanel` + `aria-controls`, `radiogroup` com `radio` e mensagem de erro com `aria-invalid` no campo hex.

22. **Busca Ctrl+K limitada a módulos**
    - **Onde:** Ctrl+K.
    - **Evidência:** "kanban" dá "Nada encontrado" (P14).
    - **Gravidade:** Baixa.
    - **Sugestão:** indexar categorias de componentes, modelos e tokens.

23. **Prompt não liga os tokens às variáveis CSS nem ao Tailwind**
    - **Onde:** Master Prompt §D.
    - **Evidência:** 0 ocorrências de `--color`.
    - **Gravidade:** Baixa.
    - **Sugestão de redação:** acrescentar na §D: "Os tokens estão no arquivo de CSS exportado como `--color-<token-em-kebab-case>` (ex.: `primary` → `--color-primary`, `navBg` → `--color-nav-bg`). Em Tailwind, mapeie `theme.extend.colors` para essas variáveis; não copie os hex."

---

## 6. O que funcionou bem

- **Ida e volta de dados fiel:** a importação do JSON exportado restaurou os tokens personalizados e salvou antes o estado anterior como versão (`39-import-json.png`; P11).
- **Arquivos tecnicamente válidos:** JSON parseável, CSS sem erro de parse (18 regras e 65 variáveis no CSSOM), ficha HTML autônoma sem scripts nem dependências externas.
- **Fluxo guiado bem pensado:** a ordem "esqueleto antes do acabamento" com bloqueio das etapas 6 a 10 até aprovar, a revisão com links "Alterar" e o progresso persistente salvo automaticamente no navegador.
- **Catálogo amplo e prévias interativas de verdade:** headers com menus que abrem, seletor de workspace funcional, celular com barras clicáveis, alternância computador/tablet/celular (`07b`, `12`, `24b`).
- **Rastreabilidade das decisões:** cada item tem id, origem, interruptor "No Master Prompt" e "Prompt deste elemento". Os tokens alterados ficam contados ("10 token(s) alterado(s) manualmente") e reversíveis um a um ou todos de uma vez.
- **Painel de contraste ao vivo** que atualiza quando um token muda (6,7 para 6,3:1 em "Texto sobre primária").
- **Conteúdo de acessibilidade e segurança no prompt acima da média:** atributos de `autocomplete`, erro genérico de credenciais, `aria-invalid`/`aria-describedby`, `role="alert"`, Argon2id/bcrypt, safe areas, `100dvh`, `prefers-reduced-motion`, alternativa de teclado para o arrastar-e-soltar.
- **Robustez:** nenhum erro de console na sessão e nenhum overflow horizontal a 1280×800.
- **Confirmação de remoção inline**, sem modal intrusivo (`43-apos-remover.png`).

---

### Veredito da persona
Como **briefing visual e ponto de partida de conversa com uma IA**, o Studio é rápido e agradável. Como **especificação implementável sem adivinhar**, ainda não serve:
- O Master Prompt tem 13 contradições objetivas entre seções, que o detector não encontra.
- O JSON não é consumível por máquina sem um script de limpeza.
- O CSS precisa de correções antes de entrar num projeto.

O reaproveitável de imediato são as **cores** do CSS, que levam cerca de 15 minutos para virar tema Tailwind. Raios, espaçamentos, tipografia, medidas estruturais e navegação mobile exigiriam reconciliação manual.
