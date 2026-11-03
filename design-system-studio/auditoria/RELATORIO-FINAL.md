# Auditoria do Design System Studio — relatório final

Versão auditada: commit `e4c79f3` (congelada; nenhuma linha do produto foi alterada durante a auditoria).
Período: 2 e 3 de novembro de 2026. Método, ferramentas e limitações: [`00-ambiente-e-metodo.md`](00-ambiente-e-metodo.md).

> **Situação em 03/11/2026 (pós-auditoria).** O plano de evolução da seção J foi executado até a
> versão 5.0, mais uma rodada 5.1 de refinamentos. Implementado: **todo o P0 e o P1** (B-01 a B-14),
> **P2** B-15 a B-24 e TE-04 a TE-15, TE-21; os **15 defeitos reproduzidos** pela regressão hoje passam
> como testes normais. Detalhes, medições e arquivos de cada versão: [`P0-APLICADO.md`](P0-APLICADO.md).
> **Não implementado** (refatorações grandes ou ajustes estéticos que mudam escolhas já feitas por
> usuários): TE-16 (isolar o CSS das prévias), TE-17 (kit de prévia único), TE-18 (seletores finos),
> TE-19 (dividir componentes gigantes), TE-20 (ciclos de importação), RA-16 (tamanhos em `rem`),
> RA-10/20/21/22/24/26, UX-07, UX-27, UX-28, UX-30 e os refinamentos P3 de tipografia, famílias
> visuais, modelos de SaaS e paletas. Recomenda-se **uma nova rodada de auditoria** com pessoas reais
> e os mesmos 5 projetos para medir o ganho.

> **Como ler.** Os "usuários" desta auditoria são personas interpretadas por IA, não pessoas. Os
> desenvolvedores são três modelos da mesma família (Claude Opus, Sonnet e Haiku). Os testes de
> navegador rodaram só em Chromium. Cada conclusão abaixo aponta para a evidência que a sustenta.

---

## A. Relatório executivo

**Veredito em uma frase.** O Studio entrega muito bem a parte que mais promete — **a estrutura do
site chega intacta à IA** — mas ainda **não entrega o site que o usuário imaginou**, porque o Master
Prompt mistura as escolhas do usuário com contradições internas e com conteúdo de demonstração que o
usuário nunca escolheu.

**Nota geral ponderada: 5,9 / 10** (rubrica na seção L). Não está pronto para lançamento comercial;
está a um ciclo de correções estruturais de distância de ser confiável.

### O que a auditoria provou (com números)

1. **A arquitetura é transmitida com altíssima fidelidade.** Em 15 sites construídos só a partir do
   Master Prompt, a dimensão "arquitetura" ficou entre 75% e 100% e, em 13 dos 15 sites, igual ou acima de 93%.
   Sidebar integral, header só sobre o conteúdo, One Screen, dock flutuante com stories e drawer —
   tudo apareceu como escolhido. Nenhum desenvolvedor trocou a navegação móvel escolhida por outra.
2. **Os desenvolvedores seguiram o prompt com disciplina.** Fidelidade geral ao que foi exportado:
   93,3–99,9% em 14 dos 15 sites (P2/dev-3: 83,4%). Quando algo saiu diferente, na maioria das vezes a
   causa foi o próprio prompt (tipos A, B e D), não a IA.
3. **O prompt se contradiz em todos os projetos.** A tela do Studio mostrou "0 contradições" nos
   cinco projetos; os auditores encontraram de 4 a 25 contradições ou lacunas por prompt (altura do
   header 56/64 px, sidebar 248/252/260/264 px, quebra de tablet 600/768 px, drawer × navegação
   inferior, fonte e raio da família visual × identidade global). Os desenvolvedores registraram nos seus
   NOTES.md entre 29 e 60 ambiguidades por site (nos que informaram a contagem) — centenas no total.
4. **Conteúdo de demonstração vira especificação.** Marcas fictícias ("Aurora Flow", "Tucano", "Folha
   Viva", "Seriema"), menus de exemplo ("Contratos, Compras, Folha" num app financeiro; "Receita mensal"
   num painel operacional; "Agendar test drive" numa barbearia) entram como "decisões aprovadas pelo
   usuário". Não há onde definir o conteúdo real (itens de menu, módulos, dados do domínio).
5. **A prévia integrada não representa o projeto.** Mostra marcas e conteúdo genéricos de SaaS,
   header e menus cortados. Resultado medido em P4 e P5: os sites ficaram fiéis ao prompt e **pouco
   parecidos com a prévia que o usuário aprovou** — porque a própria prévia não correspondia ao prompt.
6. **O guiado é a ideia certa, com um gargalo.** "Primeiro o esqueleto" foi elogiado por quase todas
   as personas, mas a etapa 2 (landing, login e cadastro) foi o ponto de abandono da leiga, do
   impaciente e de quem usa só celular.

### Maiores acertos
- A filosofia "esqueleto antes do acabamento" funciona e diferencia o produto.
- Desenhos de layout, celular grande interativo e galeria de inspiração são de nível profissional.
- Valores simples (cores, fontes, raios, medidas de um único modelo) batem exatamente entre tela, CSS,
  JSON e texto.
- Base técnica estável no uso normal: 235 testes unitários, CLS 0, seleção sem saltos de rolagem,
  modais acessíveis, nenhuma rolagem horizontal em 27 de 28 rotas.

### Maiores riscos
1. Usuários entregam à IA um prompt que se contradiz e descreve outro negócio — e confiam nele porque
   o Studio diz "0 contradições" e "decisões aprovadas".
2. A prévia induz a aprovar algo que não será construído.
3. Perda silenciosa de dados quando o armazenamento do navegador enche (TE-06) e queda total do app se
   um módulo falhar ao carregar (TE-05).

### Potencial comercial e prontidão
O problema que o produto ataca é real e a abordagem visual é boa. O diferencial já existe na estrutura;
falta confiabilidade no conteúdo do prompt. **Não lançar** antes de resolver os quatro P0 (seção I).
Com eles resolvidos, a auditoria indica que a fidelidade ao *site imaginado* (e não só ao prompt) deve
subir para o patamar que hoje já se vê na arquitetura.

### Próximos passos recomendados
1. v4.20 — "Especificação confiável": modelo de fatos único com resolução de conflitos, conteúdo do
   projeto editável, tokens derivados recalculados, padrões marcados como padrões.
2. v4.21 — guiado sem gargalos, acessibilidade P1, robustez de persistência.
3. v4.22 — prévia integrada fiel ao projeto.
4. Repetir esta auditoria (os roteiros e testes estão prontos) e comparar.

---

## B. Usuários simulados (fase 1)

Relatórios completos em [`fase1-primeiro-acesso/`](fase1-primeiro-acesso/). Todos começaram com o
navegador limpo e só o endereço do site.

| Persona | Chegou ao Master Prompt? | Onde travou ou desistiria | Achados centrais |
| --- | --- | --- | --- |
| A1 — leiga (Marta, loja de materiais) | Só porque o avaliador continuou após o abandono (interação 38 de 45) | Etapa 2: obrigada a escolher landing para um sistema interno; "Continuar" desabilitado sem dizer o quê falta | A sugestão automática marcou "landing com login" quando "apenas login" servia; "Estoque" e "Vendas" sumiram da prévia; não sabe onde colar o resultado; jargão em inglês |
| A2 — intermediário (Rafael, dashboard de marketing) | Sim, 53 interações (~25–45 min estimados para uma pessoa) | "Resolver" o cadastro tira do guiado; etapas 8 e 9 grandes demais | Prompt 20× maior que o manual: muito mais preciso no visual, **pior no conteúdo** (menus dele trocados por menus de exemplo) |
| A3 — dev sênior (SaaS B2B) | Sim | — | Não implementável sem adivinhar: 13 contradições; JSON com rótulos em português e medidas em texto; família visual sobrescreve identidade; trocar primária não recalcula estados; modo Livre não libera parâmetros técnicos |
| A4 — designer (Lumen, finanças) | Sim | — | "Competente e consistente, porém genérico"; valores simples batem exatamente; quebra quando duas escolhas interagem; prévia integrada mistura marcas |
| A5 — só celular (barbearia) | Sim, só pelo celular | Etapa 2 (abas novas fora da tela); "Resolver" de 59×17 px; projeto não acompanha de um aparelho para outro | Barra fixa ocupa 20% da tela; prompt herdou "test drive" do modelo de carros. *Correção:* o salto de rolagem de 378 px relatado foi artefato da ferramenta de teste (REG-02) |
| A6 — impaciente (startup de entregas) | Sim, em 128 s, 26 cliques e 5 decisões | Etapa 2, aba Login (segunda galeria de 24 modelos sem recomendação) | Não há caminho rápido; prompt final não fala de entregas e mostra "0 pendências"; padrões aparecem como "aprovados pelo usuário" |

**Resposta direta:** uma pessoa leiga **não** consegue usar o Studio sem ajuda hoje — trava na etapa 2.
Usuários intermediários e experientes conseguem, mas recebem um prompt que precisam revisar.

---

## C. Relatório técnico (fase 6)

Completo em [`fase6-tecnica/relatorio.md`](fase6-tecnica/relatorio.md) — 25 problemas (TE-01 a TE-25)
com causa, sugestão, esforço e critério de aceitação. Notas: **qualidade técnica 6/10**, **confiabilidade
das exportações 4/10**.

Causas raiz que explicam a maior parte dos problemas de fidelidade:

| Id | Causa raiz | Onde |
| --- | --- | --- |
| TE-01 | O detector tem 8 regras fixas de sim/não; não compara números, posições nem comportamento móvel. Cada catálogo escreve medidas em texto livre, sem um modelo de fatos comum. | `src/prompt/conflicts.ts:32-164` |
| TE-02 | Exceções de token são aplicadas **depois** da derivação; trocar a primária deixa 11 tokens antigos. | `src/core/theme.ts:10-12` |
| TE-03 | O projeto não tem campos de conteúdo; o prompt copia o conteúdo de exemplo do catálogo. | `src/modules/navigation/catalog.ts` e demais catálogos |
| TE-04 | A composição B de header/sidebar é exportada com as medidas da composição A. | `navigation/catalog.ts:270, 1662` |
| TE-05 | Sem error boundary: um módulo que falha derruba o Studio. | `App.tsx:32-60`, `Shell.tsx:376` |
| TE-06/07 | Erro de cota do localStorage não tratado; estado salvo inválido é descartado sem aviso; sem `migrate`. | store Zustand (persist) |
| TE-14/15 | Code splitting anulado (tela inicial baixa 874 KB de JS; rotas 1,1–1,7 MB); galeria de inspiração com 9 111 nós e Lighthouse móvel 39. | imports do motor de prompts |

Pontos fortes: TypeScript estrito sem erros, 235 testes passando, interações rápidas (INP 24–88 ms),
memória estável, exportações sintaticamente válidas e sem XSS encontrado.

---

## D. Relatório UI/UX (fase 8)

Completo em [`fase8-design/relatorio.md`](fase8-design/relatorio.md) — 14 propostas com os 8 pontos
pedidos, 10 oportunidades de produto e 44 problemas (UX-01 a UX-44). Notas: **qualidade visual 7,0/10**
(≈35% julgamento estético) e **experiência 5,2/10** (quase toda objetiva).

**O que é bonito e por quê:** identidade branca com um único acento índigo, coerente com a referência
de clareza desejada; galerias com cartões consistentes, prévias reais e seleção clara; desenhos de
layout didáticos e limpos.

**O que é fraco e onde:**
- *Objetivo:* três formatos de rodapé de modal; duas formas diferentes de escolher; toasts cobrindo
  botões; quatro indicadores de posição na mesma tela do guiado; texto auxiliar abaixo de AA (4,12:1).
- *Objetivo:* a prévia integrada perde o nome do projeto ao escolher um header e mostra links de site
  de marketing dentro de um sistema logado.
- *Julgamento estético:* escala tipográfica com degraus de 1 px e 13 pesos; modelos de SaaS seguem a
  mesma fórmula; Soft Pill, Bento Soft e Modern Material próximos entre si; paletas com valores padrão
  do Tailwind.

**Propostas de maior ganho** (detalhes e protótipos na seção K): conteúdo do projeto nas prévias e no
prompt; itens de menu editáveis como fonte única; "Recomendados para você" + "Usar recomendados e
continuar"; etapa 2 em subetapas com "não preciso disso"; barra de ações que lista o que falta; entrega
com "o que fazer agora"; menos indicadores de posição; componentes seguindo a identidade por padrão.

---

## E. Responsividade e acessibilidade (fase 5)

Completo em [`fase5-responsividade-acessibilidade/relatorio.md`](fase5-responsividade-acessibilidade/relatorio.md)
— 777 páginas medidas (28 rotas × 21 larguras, paisagem, zoom 200%, texto 200%), 14 estados abertos,
56 execuções do axe-core, 1 130 capturas. Nota **5,8/10**; 0 P0, 6 P1, 13 P2, 7 P3.

| Id | Problema | Página / largura | Prioridade |
| --- | --- | --- | --- |
| RA-01 = REG-17 | Galeria "Layout mobile" com coluna de miniaturas de 0 px; nenhum dos 44 modelos pode ser escolhido | módulo mobile e etapa 4, 620–1279 px | P1 |
| RA-02 | "Pular para o conteúdo" leva para a página inicial (hash cai no `*` do roteador) | todas | P1 |
| RA-03 | Menu lateral fechado continua focável; a 375 px, 36 das 45 primeiras paradas de Tab ficam fora da tela | < 1024 px | P1 |
| RA-05 = REG-16 | Barra fixa do guiado cobre o elemento focado, botões ("CSS dos tokens") e a base da prévia do celular | guiado, todas | P1 |
| RA-06 | Texto secundário `#7c7c87` com 4,12:1 (~1 100 nós) | todas | P1 |
| RA-07 | Anel de foco com 1,56:1 e invisível em `forced-colors` | todas | P1 |
| RA-04 | Menu lateral aberto no celular não prende nem devolve o foco | < 1024 px | P2 |
| RA-11 | Prévias interativas inflam a navegação (495 paradas de Tab na página de navegação) | navegação | P2 |
| Novo | **37 elementos `<main>`** na aba Sidebars da página de navegação (cada prévia usa `<main>`); 1 na aba Headers, 2 na Combinação — por isso os relatos pareciam divergir | navegação | P2 |
| RA-08 | Rolagem horizontal no modo livre | 320–344 px | P2 |

Bom: nenhuma rolagem horizontal em 27 de 28 rotas em todas as larguras, paisagem e zoom; 12 modais com
foco preso, Esc e devolução de foco; selecionar/filtrar não move a rolagem; controles de 44 px e campos
de 16 px no celular; `prefers-reduced-motion` respeitado. Não houve teste com leitor de tela real.

---

## F. Fidelidade dos prompts (fases 2–4)

Relatórios por projeto em [`fase4-fidelidade/`](fase4-fidelidade/), com rubrica escrita antes de abrir
os sites, matriz requisito a requisito, composições lado a lado e redação corrigida para cada falha B.

### F.1 Notas por site (fidelidade ao que o Studio exportou)

| Projeto | Req. por site | dev-1 | dev-2 | dev-3 |
| --- | ---: | ---: | ---: | ---: |
| P1 Atlas Workspace | 96 | 97,4 | 96,7 | 94,2 |
| P2 Verde Vivo | 70 | 97,6 | 96,6 | 83,4 |
| P3 Nexo Capital | 87 | 99,9 | 98,6 | 95,7 |
| P4 Centro Operacional | 71 | 97,9 | 98,0 | 93,3 |
| P5 Conecta | 74 | 99,1 | 99,1 | 95,7 |

Por dimensão (15 sites):

| Dimensão | Faixa observada | Observação |
| --- | --- | --- |
| Arquitetura | 75–100 | 100 em 7 de 15 sites e ≥ 93 em 13; o 75 é P2/dev-3, que seguiu o header do modelo de landing por causa de instrução contraditória |
| Desktop | 82,9–100 | |
| Celular | 81,6–100 | nenhuma troca da navegação móvel escolhida |
| Paleta | 81,9–100 | P4/dev-3 não aplicou a fonte (Times New Roman) |
| Componentes | 94,3–100 | |
| Interações | 85,7–100 | |

**Importante:** essas notas medem a fidelidade **ao prompt**. A semelhança com a **prévia aprovada no
Studio** foi baixa em P1, P4 e P5 por falha do Studio (a prévia não corresponde ao prompt: em P1 ela
mostrava cartões arredondados e destinos de navegação que nunca foram exportados) — registrada como
julgamento de design, fora das notas.

### F.2 Origem das falhas

| Projeto | A — Studio | B — Master Prompt | C — desenvolvedor | D — conflito | E — aceitável |
| --- | ---: | ---: | ---: | ---: | ---: |
| P1 | 8 | 2 + 14 de redação (sem perda de nota) | 15 | 7 | 2 |
| P2 | 6 lacunas (à parte) | 17 | 25 | 3 | 8 |
| P3 | 1 nos sites + 8 na cadeia | 3 nos sites + 25 B/D na cadeia | 8 | 4 | 77 (contradições do prompt resolvidas de forma aceitável) |
| P4 | 4 | 12 | 8 | 7 | 9 |
| P5 | 4 na cadeia | 2 nos sites + 13 na cadeia | 12 | 1 + 5 na cadeia | 15 |

Leitura: as falhas de desenvolvedor (C) concentram-se num único modelo (ver F.4). As falhas A, B e D se
repetem nos cinco projetos e são do Studio.

### F.3 O que os modelos interpretam de forma diferente com mais frequência (= ambiguidade do prompt)

1. **Pontos de quebra** — o prompt dá 600, 768 e 1023 px; os 15 desenvolvedores apontaram e quase
   todos escolheram 768.
2. **Medidas de header e sidebar** — 56 × 64 px; 248 × 252 × 260 × 264 px, conforme a seção.
3. **Navegação móvel duplicada** — o texto do header/sidebar manda "☰ + drawer abaixo de 768 px" mesmo
   quando o layout mobile escolhido é navegação inferior ou dock.
4. **Família visual × identidade global** — raio 0/4/6/10/20 contra o raio escolhido; "fonte do sistema"
   contra a fonte escolhida; cor de destaque fora da paleta.
5. **Conteúdo de exemplo × domínio do projeto** — marcas, menus, KPIs e títulos de demonstração.
6. **Escopo e destinos** — em que telas aparecem os stories; destinos do header × do dock; destinos da
   navegação inferior que a prévia mostrava mas não foram exportados (P1: três conjuntos diferentes nos
   três sites); página inicial do app não exportada (P1); onde fica o seletor de período (P3 pede em
   três lugares).
7. **Regras inalcançáveis** — "barras ≤ 25% da altura em paisagem" quando as medidas obrigatórias já
   ocupam 59%; anéis de foco e textos semânticos em cores que não passam no WCAG (os desenvolvedores
   desviaram de propósito para cumprir acessibilidade).

### F.4 Comparação entre modelos (mapeamento revelado)

**dev-1 = Claude Opus 5.5 · dev-2 = Claude Sonnet 5.5 · dev-3 = Claude Haiku 5.5.**

- Opus e Sonnet: 96,6–99,9% nos cinco projetos; diferenças entre eles dentro do ruído.
- Haiku: o menor resultado nos cinco projetos (83,4–95,7%) e a maioria das falhas tipo C (fonte não
  aplicada, página tremendo, nome do projeto invisível, regras de paisagem não cumpridas).
- Os três registraram as mesmas contradições do prompt, o que confirma que elas estão no texto, não na
  leitura de um modelo específico.
- Limitação: todos são Claude. Não foi possível testar GPT ou outros fornecedores (não conectados).

---

## G. Sites construídos

Em [`fase3-sites/`](fase3-sites/): 5 projetos × 3 sites, cada um com `index.html` (abre direto do
disco ou com `python3 -m http.server`), `README.md` (como executar e credenciais de demonstração),
`NOTES.md` (ambiguidades encontradas e decisões) e `PROMPT.md` (o Master Prompt exatamente como
recebido). Todos em HTML, CSS e JavaScript puros, sem build. Desvios de isolamento relatados pelos
próprios desenvolvedores: [`fase3-sites/DESVIOS-DE-ISOLAMENTO.md`](fase3-sites/DESVIOS-DE-ISOLAMENTO.md)
(dois casos no P2; o auditor não encontrou sinal de contaminação no resultado).

## H. Evidências

- Escolhas, exportações e capturas das prévias aprovadas: [`fase2-projetos/`](fase2-projetos/)
  (`escolhas.md`, `relatorio.md`, `exportados/`, `capturas/` de cada projeto).
- Capturas lado a lado Studio × sites nas mesmas dimensões: `fase4-fidelidade/*/composicoes/`.
- Medições brutas e scripts reproduzíveis em cada fase (`dados/`, `scripts/`, `resultados/`).
- Testes de regressão: [`../tests/e2e/regression.spec.ts`](../tests/e2e/regression.spec.ts) — 51
  testes (36 passam, 15 marcados como falha esperada); rodar com
  `npx playwright test -c auditoria/fase7-regressao/playwright.audit.config.ts`.

---

## I. Backlog priorizado

Problemas de mesma origem agrupados. Ids de origem entre parênteses: TE (técnico), RA (acessibilidade),
UX (design), REG (regressão), A1–A6 / P1–P5 (agentes). Esforço: baixo / médio / alto.

### P0 — bloqueantes (corrompem a especificação)

**B-01 · Modelo de fatos único e resolução de conflitos no Master Prompt**
- *Descrição:* medidas e comportamentos são escritos em texto livre por cada catálogo; o prompt sai
  com valores incompatíveis e o detector não vê.
- *Evidência:* TE-01; contradições em 5 de 5 prompts (A2, A3, A4, P1–P5); falhas B/D nas cinco auditorias de fidelidade; REG-18.
- *Reproduzir:* escolher "Sidebar integral clássica" + qualquer header de largura total + "Bottom
  Navigation clássica"; abrir a Central de Prompts.
- *Esperado:* uma única altura de header, largura de sidebar, conjunto de breakpoints e navegação móvel; contradições restantes listadas para o usuário decidir.
- *Observado:* "0 contradições"; header 56 e 64 px, ☰ + drawer e bottom navigation no mesmo texto.
- *Causa:* ausência de um modelo estruturado (`header.height`, `sidebar.width`, `breakpoints`,
  `mobile.navigation`, `radius`, `font`) e de regras de precedência; `conflicts.ts` com 8 regras sim/não.
- *Solução:* catálogos passam a declarar fatos tipados; um resolvedor aplica precedência (layout define
  estrutura e medidas; modelo de header/sidebar define aparência interna; identidade global define
  cor/fonte/raio, salvo exceção explícita da família ou instância); o texto é gerado só a partir dos
  fatos resolvidos; o detector compara fatos.
- *Impacto:* muito alto · *Esforço:* alto · *Dependências:* nenhuma.
- *Aceitação:* para os 5 projetos desta auditoria (backups em `fase2-projetos/*/exportados/`), zero
  valores conflitantes de header, sidebar, breakpoints, navegação móvel, raio e fonte; regressões REG-18 e
  REG-11 passando; teste unitário para cada regra de precedência.

**B-02 · Conteúdo do projeto como fonte única; conteúdo de exemplo fora do prompt**
- *Evidência:* TE-03; A1, A2, A3, A5, A6; P1–P5; falhas A em P1–P5 (em P1, os destinos da navegação
  inferior mostrados na prévia não foram exportados e cada site inventou os seus) (menus "Contratos, Compras, Folha"
  em app financeiro, "Receita mensal" em painel operacional, "Agendar test drive" na barbearia).
- *Esperado:* menu, módulos, marca e principais dados vêm do que o usuário informou; exemplos de modelo
  nunca aparecem como decisão.
- *Solução:* campos editáveis de navegação (itens, destinos desktop × celular reconciliados) e de
  domínio, alimentados pelas "funcionalidades previstas"; prévias e prompt usam esses dados; textos de
  exemplo ficam marcados como ilustrativos e saem do prompt.
- *Impacto:* muito alto · *Esforço:* alto · *Dependências:* B-01 (mesmo modelo de dados).
- *Aceitação:* nenhum nome de marca ou item de menu de catálogo no prompt dos 5 projetos; menus
  editados aparecem iguais na prévia e no prompt.

**B-03 · Tokens derivados recalculados ao alterar a cor primária**
- *Evidência:* TE-02, REG-12, A3, A4 (botão verde que fica azul no hover).
- *Esperado:* hover, active, foco, link, seleção e navegação ativa acompanham a nova primária (exceto
  tokens que o usuário editou explicitamente).
- *Causa:* exceções aplicadas depois da derivação (`theme.ts:10-12`).
- *Solução:* derivar a partir da base já com as exceções de marca aplicadas; distinguir "editado pelo
  usuário" de "derivado".
- *Impacto:* alto · *Esforço:* baixo · *Aceitação:* REG-12 passando; teste unitário cobrindo os 11 tokens.

**B-04 · Decisões padrão marcadas como padrão, não como "aprovadas pelo usuário"**
- *Evidência:* A6 (etapas 6–9 não mudaram o prompt), P4.
- *Solução:* registrar se cada valor foi tocado; o prompt diz "padrão do Studio (não revisado)"; a lista
  de pendências inclui decisões importantes nunca revisadas.
- *Impacto:* alto · *Esforço:* baixo · *Aceitação:* prompt de projeto sem nenhuma interação não usa a
  palavra "aprovado" para valores padrão.

### P1 — alta prioridade

| Id | Título | Evidência | Solução resumida | Esforço |
| --- | --- | --- | --- | --- |
| B-05 | Prévia integrada fiel ao projeto | P1–P5, A4, UX, fidelidade P4/P5 | usar conteúdo do projeto (B-02), um único nome, regiões do layout com o header/sidebar escolhidos sem cortes; tela cheia | médio |
| B-06 | Etapa 2 sem gargalo | A1, A5, A6, A2, P3, UX, protótipos 01/02/06 | subetapas visíveis; "não preciso de landing/cadastro"; sugestão "apenas login" para sistemas internos; "Continuar" sempre explica o que falta e leva até lá | médio |
| B-07 | Recomendados por tipo de projeto + caminho rápido | A6, A1, UX, protótipo 03 | bloco "Recomendados", botão "Usar recomendados e continuar" | médio |
| B-08 | Entrega com "o que fazer agora" e verificação antes de exportar | A1, UX, protótipo 05 | passos copiar → abrir a IA → colar; checklist de pendências e conflitos | baixo |
| B-09 | Composição B exportada com medidas da A | TE-04 | gerar spec por composição | baixo |
| B-10 | Robustez: error boundaries, cota do armazenamento, estado inválido, migração, relatório de validação fora das versões | TE-05/06/07/08 | boundary por rota; tratar erro de cota com aviso; validar e migrar; guardar relatório à parte | médio |
| B-11 | Acessibilidade P1 | RA-01..07, REG-16, REG-17 | grid da galeria mobile; skip link sem hash de rota; `inert`/`visibility` no menu fechado; `scroll-padding` e espaço para a barra fixa; texto secundário ≥ 4,5:1; anel de foco ≥ 3:1 e visível em forced-colors | baixo |
| B-12 | Controles sem efeito visível | REG-03 | tamanho base e estilo de ícones aplicados à prévia; densidade da tela = densidade do prompt | baixo |
| B-13 | Fluxo de entrada coerente com login/cadastro | REG-19, REG-20, P3 | limpar login/cadastro ao trocar o fluxo; esconder aba Cadastro sem cadastro; opção explícita "sem cadastro" | baixo |
| B-14 | Prompt enxuto | A3 (26% de linhas repetidas, 53 mil caracteres), A2 | deduplicar regras globais; seções por item só com o que é específico | médio |

### P2 — média prioridade

| Id | Título | Evidência |
| --- | --- | --- |
| B-15 | JSON consumível por código (chaves em inglês, valores numéricos, unidades separadas, raio e sombra em px) e CSS sem breakpoint divergente nem `input` global de 44 px em checkbox/radio | A3 |
| B-16 | Prompts individuais com nome próprio (hoje todos `prompt-elemento.md`) | P1, P3, P4, P5 |
| B-17 | Contador "Esqueleto x/5" e texto "Esqueleto aprovado" corretos | P1, P2, P3, P5, A4 |
| B-18 | Code splitting real; galeria de inspiração mais leve | TE-14, TE-15 |
| B-19 | 37 `<main>` e excesso de paradas de Tab nas prévias de navegação | verificação do auditor-chefe, RA-11 |
| B-20 | Jargão em inglês no guiado; explicações que somem ao clicar | A1, A5 |
| B-21 | Galerias filtradas pelo tipo de tela (headers de site × de app) | A2, UX |
| B-22 | Opções estruturadas para monitores grandes e escopo de stories | P4, P5 |
| B-23 | Observação na paleta some do prompt; backup completo não restaura versões | TE-09, TE-10 |
| B-24 | Padrões de interface únicos (rodapé de modal, toasts que não cobrem botões, menos indicadores de posição) | UX |

### P3 — refinamentos

Escala tipográfica (menos degraus e pesos); amostras de fonte com texto real e algarismos tabulares;
diferenciar mais Soft Pill / Bento Soft / Modern Material; variar a fórmula dos modelos de SaaS;
paletas menos dependentes de valores padrão do Tailwind (UX, A4).

---

## J. Plano de evolução

| Versão | Foco | Itens | Critério de saída |
| --- | --- | --- | --- |
| **4.20 — Especificação confiável** | corrigir o que corrompe o prompt | B-01, B-02, B-03, B-04, B-09, B-14, B-23 | os 15 testes `test.fail` relacionados passam a ser testes normais; reauditoria dos 5 projetos sem contradições numéricas |
| **4.21 — Guiado sem gargalos e acessível** | fluxo e robustez | B-06, B-07, B-08, B-10, B-11, B-12, B-13, B-16, B-17, B-20 | persona leiga e impaciente concluem sem abandono; axe sem violações sérias; RA P1 resolvidos |
| **4.22 — Prévia fiel** | "é exatamente assim que quero meu site" | B-05, B-19, B-21, B-22, B-24 | auditoria de fidelidade comparando também prévia × site (não só prompt × site) |
| **4.23 — Exportações para desenvolvedores** | reuso em projeto real | B-15, B-18; exportação para Tailwind/CSS variables por framework | A3 consegue importar tokens sem reconciliação manual |
| **5.0 — Fechar o ciclo** | construir e verificar | verificação automática de fidelidade (Validation Lab mede o site construído contra os fatos da especificação), comparação entre versões, projetos nomeados | fidelidade prompt × site e prévia × site medidas automaticamente |

---

## K. Propostas visuais

Seis protótipos "antes × depois" na mesma dimensão, com o "antes" capturado do produto real, em
[`fase8-design/prototipos/`](fase8-design/prototipos/):

1. `01-etapa-entrada` — etapa 2 com recomendação e subetapas.
2. `02-continuar-checklist` — "Continuar" desabilitado × lista do que falta.
3. `03-galeria-recomendados` — galeria com recomendados por tipo de projeto.
4. `04-previa-projeto` — prévia com o conteúdo do projeto e menu editável.
5. `05-entrega` — entrega com "o que fazer agora".
6. `06-celular-entrada` — etapa de entrada no celular, sem abas escondidas.

Cada um tem `*-antes.png`, `*-depois.html`, `*-depois.png` e `*-comparativo.png`. Os textos de
recomendação são ilustrativos; as regras reais ainda precisam ser escritas.

---

## L. Notas

| Dimensão | Peso | Nota | Base |
| --- | ---: | ---: | --- |
| Fidelidade dos prompts e especificações | 25% | 6,5 | arquitetura e tokens transmitidos com ≥ 93% de fidelidade em 13 de 15 sites; contradições e conteúdo de exemplo em 5 de 5 prompts; prévia ≠ prompt |
| Experiência do usuário e facilidade de uso | 20% | 5,2 | crítica de design (fase 8) + abandono na etapa 2 por 3 de 6 personas |
| Qualidade visual e consistência de design | 20% | 7,0 | fase 8 (≈35% julgamento estético) e A4 |
| Responsividade e acessibilidade | 15% | 5,8 | fase 5 |
| Qualidade técnica e estabilidade | 10% | 6,0 | fase 6 |
| Confiabilidade das exportações | 10% | 4,0 | fase 6 + A3 |
| **Nota geral ponderada** | | **5,9** | |

Nota de fidelidade de cada site construído: seção F.1.

---

## M. Respostas às 15 perguntas

1. **Uma pessoa leiga consegue usar sem ajuda?** Não, hoje. A1 travou na etapa 2 e só chegou ao prompt
   porque o avaliador continuou; não saberia onde colar o resultado (B-06, B-08, B-20).
2. **O guiado é intuitivo?** A ordem é intuitiva e foi elogiada; a execução tem um gargalo na etapa 2 e
   etapas finais grandes demais (72 headers/sidebars, 66 × 16 componentes) sem recomendação.
3. **O modo Livre é poderoso para experientes?** Parcialmente. Dá acesso direto a tudo, mas não libera
   parâmetros técnicos além do guiado, e o JSON não é consumível por código (A3, B-15).
4. **Os layouts têm variedade real e boa qualidade?** Sim. Desenhos didáticos e variados; a arquitetura
   escolhida apareceu nos sites em 13 de 15 casos com ≥ 93%. Ressalva: galeria mobile quebrada entre 620
   e 1279 px (REG-17).
5. **As prévias representam fielmente o que se escolhe?** As prévias de cada galeria, sim. A prévia
   integrada, não: conteúdo genérico, marcas trocadas, regiões cortadas; em P4 e P5 os sites se pareceram
   com o prompt e não com a prévia.
6. **Todas as decisões são registradas?** Não todas: densidade do componente não chega ao prompt
   (REG-11), composição B sai com medidas da A (TE-04), observação na paleta some (TE-09), destinos da
   navegação inferior e página inicial mostrados na prévia não são exportados (fidelidade P1), login
   antigo permanece após trocar o fluxo (REG-20).
7. **O Master Prompt comunica sem ambiguidade?** Não. É muito preciso em cores, tokens, arquitetura e
   regras de responsividade, mas se contradiz em medidas, breakpoints e navegação móvel, e mistura
   conteúdo de exemplo.
8. **IAs diferentes constroem sites semelhantes?** Na estrutura, sim — muito semelhantes (P1: os três
   reproduziram sidebar integral de 252 px, header de 64 px só sobre o conteúdo e bottom nav sem drawer). Nos pontos
   ambíguos, cada uma decide de um jeito (escopo dos stories, abas do celular, seletor de período, cor
   dos selos). Testado apenas entre modelos Claude.
9. **O que os modelos mais interpretam de forma diferente?** Seção F.3: breakpoints, medidas de header e
   sidebar, navegação móvel duplicada, família × identidade, conteúdo de exemplo, escopo/destinos, regras
   inalcançáveis.
10. **É responsivo e acessível?** Responsivo, em boa parte (sem rolagem horizontal em 27 de 28 rotas);
    acessível, parcialmente: seis falhas P1 de esforço baixo (seção E).
11. **O design é competitivo?** Em acabamento, está próximo de ferramentas modernas (7,0); em
    experiência, ainda não (5,2), principalmente por prévia infiel e excesso de opções sem recomendação.
12. **O que é confuso, redundante ou desnecessário?** Etapa 2 em abas escondidas; quatro indicadores de
    posição; dois caminhos de escolha; "Resolver" que tira do guiado; prompt com 26% de linhas repetidas;
    jargão em inglês.
13. **O que falta?** Conteúdo do projeto (menus, módulos, dados); opção "sem cadastro"; recomendados;
    opções para monitores grandes e escopo de stories; página de catálogo, preço no card e componente de
    filtros (P2); upload de logo; instruções de entrega.
14. **Maiores ganhos reais?** B-01 (modelo de fatos), B-02 (conteúdo do projeto) e B-05 (prévia fiel) —
    juntos atacam a distância entre o site imaginado e o site construído, que hoje vem do Studio, não das IAs.
15. **O que corrigir antes de lançar?** Os quatro P0 (B-01 a B-04) e, no mínimo, B-06, B-10 e B-11.

---

## N. O que não foi testado

- Pessoas reais (todas as personas são simulações por IA).
- Firefox, Safari/WebKit e aparelhos físicos (só Chromium com emulação móvel).
- Leitor de tela real (só árvore de acessibilidade).
- Outros fornecedores de IA (GPT, Gemini etc.).
- A página publicada no claude.ai (exige login do dono); foi testado o mesmo build servido localmente.
- Métricas de desempenho sob carga normal (a máquina estava compartilhada; valores são medianas com interferência declarada).
