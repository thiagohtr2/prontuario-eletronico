# Fase 7 · Regressão dos 20 erros históricos

**Objeto:** versão congelada (commit `e4c79f3`) servida em `http://127.0.0.1:4300/`. Só usei Chromium (Playwright 1.63).
**Perfis de tela:** desktop 1440×900; celular 360×800 e 390×844 com `isMobile`/`hasTouch`/DPR 2. Onde o erro dependia da largura, também 320, 768×1024, 800×360 (celular deitado), 1024 e 1280×720.
**Entregáveis:**
- Suíte `tests/e2e/regression.spec.ts`: 20 `describe` (REG-01 … REG-20) e 51 testes.
- Configuração `auditoria/fase7-regressao/playwright.audit.config.ts`.
- Sondagens exploratórias em `scripts/`: `p01`…`p08`, mais `lib.cjs` e `resumo-json.cjs`.
- Capturas em `capturas/`.
- Saída das execuções em `resultados/`.

Os relatórios das fases 1 e 2 serviram só como pista. Reproduzi cada medida abaixo por conta própria.

**Como ler a coluna "Status do teste":**
- **protege**: teste normal que passa hoje e falha se o erro voltar.
- **falha esperada**: o teste afirma o comportamento correto e está marcado com `test.fail(true, 'REG-xx: … — ver auditoria/fase7-regressao')`. Quando o defeito for corrigido, o Playwright vai acusar "passou inesperadamente".

## Resumo

| # | Erro histórico | Critério | Reproduzido? | Evidência (medida/captura) | Teste (nome) | Status do teste |
|---|---|---|---|---|---|---|
| 01 | Layout escolhido sem estado selecionado | Depois do clique ou toque: `aria-pressed=true`, `data-selected=true`, selo ≥ 60×20 px com fonte ≥ 12 px dentro do cartão, borda alterada e só 1 cartão marcado por galeria | não | 8 galerias a 1440 e 4 a 360. Selo de 94–110×26 px, fonte 12,5 px, borda trocada. `p01` | REG-01 › desktop 1440: todas as galerias…; › celular 360×800: toque marca…; › modo guiado: painel… | protege (3) |
| 02 | Miniaturas fazem a página rolar (−378 px na etapa 3, 360×800) | Toque na coordenada visível (sem auto-rolagem da ferramenta): `scrollY` antes = depois | não (o relato é artefato da ferramenta) | 0 px em 5 alturas de botão e 9 miniaturas. Com o botão sob a barra superior, `locator.tap()` rola 1375→1002 (−373 px) sozinho. `p02c`, `p02d`, `reg02-*.png` | REG-02 › etapa 3 do guiado…; › celular (etapa 4) e paletas…; › desktop 1440… | protege (3) |
| 03 | Controles que mudam o estado mas não a prévia | Cada controle altera o estilo calculado da prévia; a densidade mostrada no editor é a que vai ao prompt | **sim** | Base 15→18 px: título 22→26 px, mas corpo, botões, campo e menu ficam em 13 px. Estilo dos ícones: 0 de 83 elementos mudam. Tabela: editor "Padrão" × prompt "Densidade: confortável" (Soft Pill) ou "compacta" (Compact Pro). `reg03-*.png` | REG-03 › "Tamanho base do texto"…; › "Estilo dos ícones"…; › densidade da tabela…; › cantos, densidade global e fontes… | falha esperada (3) + protege (1) |
| 04 | Botões grudados ou sobrepostos | Nenhum par de botões sobreposto ou com menos de 4 px entre si (fora de prévias, barras fixas e cartão inteiro clicável) | **parcial** | 0 problemas em 14 telas a 360 e a 1440. A 768×1024, 800×360, 844×390 e 1024×600, o painel do celular grande (com "Escolher este modelo") fica por cima das miniaturas. `reg04-*.png` | REG-04 › desktop 1440…; › celular 360×800…; › tablet 768×1024: "Escolher este modelo"… | protege (2) + falha esperada (1) |
| 05 | Ações duplicadas nos cartões | Em cada cartão de 11 galerias: nenhum rótulo de ação repetido e no máximo 1 controle de seleção | não | Cartões com seleção + "Ver prévia" / "Prompt" / "Ver em tamanho grande"; nenhuma duplicata. `p01` | REG-05 › desktop 1440 / celular 360: cada cartão… | protege (2) |
| 06 | Sidebar do Studio estreita | ≥ 240 px no desktop, sem rótulo cortado, fonte ≥ 13 px; drawer ≥ 280 px e ≤ 90% da tela, itens ≥ 44 px | não | Desktop 268 px com fonte de 14,5 px e 0 cortes; drawer 310/360 px com itens de 44 px. `reg06-*.png` | REG-06 › desktop 1440…; › celular 360×800: drawer… | protege (2) |
| 07 | Letras pequenas em filtros | Nenhum texto de filtro, aba, contador ou select abaixo de 12 px | não | Mínimo de 12,5 px (contadores) e 13,5 px (rótulos) em 10 rotas, a 1440 e a 360 | REG-07 › desktop 1440 / celular 360… | protege (2) |
| 08 | Prévias de celular pequenas demais | Celular grande ≥ 340 px no desktop e ≥ 85% da largura no celular; aparelho da prévia da landing ≥ 280×500 px | não | Celular grande: 402 px (1440), 324/360 e 354/390. Prévia integrada no modo Celular: 380×740. Modal da landing: 304×542 (360) e 334×569 (390). `reg08-*.png` | REG-08 › desktop 1440…; › celular 360×800 / iPhone 390×844… | protege (3) |
| 09 | Menus móveis com texto ou ícone desproporcional | Nos 44 layouts, com os menus abertos: texto ≥ 10 px e ícone entre 0,75× e 2,5× o texto | não | 35 layouts com itens medidos. Proporções de 1,66 a 2,24 (barra inferior: ícone 23 px, texto 12 px; quiosque: 17 px, ×2,24) | REG-09 › nos 44 layouts móveis… | protege (1) |
| 10 | Diagramas de conteúdo parecendo menu flutuante | Regiões CONTEÚDO sem a elevação dos menus flutuantes (exceção: "Ilhas", que declara o conteúdo flutuante) e sempre com a etiqueta | não | 43 regiões de conteúdo; só `ilhas-navegacao` é elevada (é o que a especificação dele descreve); todas com etiqueta | REG-10 › regiões de CONTEÚDO… | protege (1) |
| 11 | Decisões que não chegam ao Master Prompt | Cada escolha feita na interface aparece no prompt com o valor escolhido | **parcial** | Entrada, landing, login, cadastro, layouts, header, sidebar, paleta, fonte, base, raio, ícones e componente chegam. A densidade "Compacta" escolhida na tabela sai como "confortável" | REG-11 › entrada, layouts…; › propriedade escolhida no componente… | protege (1) + falha esperada (1) |
| 12 | Paleta que não se propaga (inclusive primária manual) | Trocar a paleta muda a prévia, o celular grande, o CSS e o prompt; a primária manual recalcula hover, active, foco e link | **parcial** (a troca de paleta funciona; a primária manual não) | Primária #0b6e4f: hover continua #161618, active #131316, foco #18181b, link #18181b. Na prévia, "Primário" fica rgb(11,110,79) e "Hover" rgb(22,22,24). `reg12-*.png` | REG-12 › trocar a paleta atualiza…; › troca manual da cor primária… | protege (1) + falha esperada (1) |
| 13 | Seleções perdidas ao voltar de etapa | Voltar 3 etapas pelo "Voltar" e avançar de novo (e recarregar) mantém tudo marcado e salvo | não | Fluxo, landing, login, cadastro, desktop e mobile preservados | REG-13 › guiado: voltar até a entrada… | protege (1) |
| 14 | Exportações inválidas / download que falha no 1º clique | .md, JSON, CSS (CSSOM ≥ 40 variáveis não vazias), HTML (DOMParser) e backup válidos; primeiro clique real baixa o arquivo | **parcial** (arquivos válidos; 1º clique falha no guiado) | A 1440×900, na etapa 7, "CSS dos tokens" fica em y=835 = topo do rodapé. O clique cai em "Continuar: Navegação" (vai para `/guiado/navegacao`) e não há download. `reg14-*.png` | REG-14 › Exportar, Central…; › guiado 1440×900: o primeiro clique… | protege (1) + falha esperada (1) |
| 15 | JavaScript impedindo o carregamento | Todas as rotas sem `pageerror`, sem 4xx/5xx, a 1440 e a 360; localStorage corrompido não derruba o app | não | 19 rotas × 2 telas sem erros; 3 tipos de armazenamento corrompido abrem a home e o prompt | REG-15 › todas as rotas… (desktop / celular); › armazenamento corrompido… | protege (3) |
| 16 | Conteúdo encoberto pela barra fixa inferior | Controles centralizados na tela não ficam sob `.gd-footer`; o celular grande fixo termina acima do rodapé | **sim** | Etapa 7 a 1440×900: "Prompt da identidade" e "CSS dos tokens" cobertos pelo rodapé em qualquer rolagem. Etapa 4: base do celular 23 px sob o rodapé (35 px a 1280×720). As demais ações das etapas ficam acessíveis. `reg14-reg16-*.png`, `reg16-*.png` | REG-16 › guiado 1440×900: "Prompt da identidade"…; › guiado 1440×900 (etapa 4)…; › desktop / celular: ações principais… | falha esperada (2) + protege (2) |
| 17 | Overflow nas galerias de layouts | Sem rolagem lateral; nada passa da borda do cartão; coluna de miniaturas ≥ 128 px; nenhuma miniatura coberta | **sim** | Sem overflow a 320, 360, 1024 e 1440. Com 620–939 px úteis, `.lay-mob-list` mede **0 px** e as 44 miniaturas transbordam sob o celular grande (44/44 cobertas a 768×1024, 800×360, 844×390 e 1024×600) | REG-17 › 320/360/1024/1440 px…; › tablet 768×1024 / celular deitado 800×360… | protege (4) + falha esperada (2) |
| 18 | Incompatibilidade entre desktop e celular | O prompt cita um único ponto de troca entre mobile e desktop; as mesmas escolhas no desktop e no celular geram o mesmo prompt; no celular a prévia integrada abre no modo Celular | **sim** | O prompt diz "Abaixo de 768 px…", "A partir de 768 px…" e "Entre 600 e 1023 px (tablet), use a estrutura desktop…" (2 valores). Paridade desktop × celular idêntica. A 360 a prévia abre em "Computador" (escala ≈0,26). `reg18-*.png` | REG-18 › Master Prompt define um único…; › as mesmas escolhas…; › celular 360×800: a prévia integrada… | falha esperada (2) + protege (1) |
| 19 | Login/cadastro não correspondem à seleção | Com "Apenas login" e sem cadastro, a prévia integrada não oferece "Cadastro" | **sim** | Abas: Aplicação, Login e **Cadastro**, com um "Crie sua conta" genérico e `signupId=null`. `reg19-*.png` | REG-19 › com "Apenas login"…; › com cadastro escolhido… | falha esperada (1) + protege (1) |
| 20 | Alteração em um módulo quebra outro | Mudar o fluxo para "Aplicação diretamente" tira o login antigo do prompt e da prévia; mudanças em sequência mantêm as escolhas | **sim** | Fluxo `app-direct` com `loginId` mantido: o prompt diz "Login: Clássico central" e traz a seção de login; a prévia mostra as abas Login e Cadastro | REG-20 › trocar o fluxo…; › mudanças em sequência… | falha esperada (1) + protege (1) |

**Total:** 10 dos 20 erros reproduzidos, 6 por completo (03, 16, 17, 18, 19, 20) e 4 em parte (04, 11, 12, 14). Os outros 10 não se reproduziram e ficaram protegidos por testes normais.

## Detalhes das reproduções

### REG-02 · Salto de 378 px (não reproduzido: artefato de automação)
- **Passos:** etapa 3 do guiado a 360×800 (`isMobile`). Rolar até o painel de destaque e tocar "Escolher este modelo".
- **Esperado:** a rolagem não muda.
- **Observado:**
  - Com toque por coordenada (`touchscreen.tap`), o botão em y = 92, 142, 322 e 522 gerou delta de **0 px**.
  - Nas miniaturas 4, 19 e 36 também deu 0 px.
  - `keepScroll` (`src/ui/index.tsx:455`) restaura a posição.
- **De onde veio o relato:** reproduzi o número exato com o botão em y≈5, sob a barra superior fixa de 60 px. Nessa situação `locator.tap()` rola o alvo para o centro antes de tocar (1375→1002, −373 px; ver `scripts/p02d-artefato.cjs`). Uma pessoa não toca num botão escondido.
- **Achado relacionado:** com o botão em y=642, o toque cai no rodapé do guiado e não escolhe nada (ver REG-16).

### REG-03 · Controles sem efeito na prévia
1. **Tamanho base do texto** (Identidade › Tipografia, 15→18 px).
   - Só "Visão geral" muda (22→26 px). "Ana Souza", "Primário", "Placeholder…", "Início" e os alertas ficam em 13/12,5 px.
   - **Causa:** `src/modules/color/IdentityPreview.tsx` define a base só na raiz (`fontSize: ty.baseSize - 1`, l.44) e no título (l.88). Os filhos têm tamanhos fixos: l.24 (botões 13), l.75 (menu 13), l.89 (12,5), l.108/112 (campo 13), l.121 (linhas 13), l.130 (alertas 12,5).
   - **Sugestão:** derivar os tamanhos em `em`/escala a partir de `ty.baseSize` (ex.: `Math.round(base*0.87)`).
2. **Estilo dos ícones** (Contorno/Preenchido/Duotone).
   - É salvo e vai ao prompt, mas 0 de 83 elementos da prévia mudam.
   - **Causa:** a prévia usa ícones lucide sem ler `geometry.iconStyle` (l.79, 94–95, 131). Só `src/modules/navigation/SidebarPreview.tsx:318,323` lê o estilo, e ali duotone é tratado como preenchido.
   - **Sugestão:** um componente de ícone comum que aplique fill/duotone conforme o token.
3. **Densidade da tabela.**
   - O editor mostra **"Padrão"**, mas o prompt grava "Densidade: confortável" (família Soft Pill) ou "compacta" (Compact Pro, caso relatado no P3/P4).
   - **Causa:** `src/modules/components/describe.ts:80-82` grava o parâmetro da categoria em `properties['Densidade']`. Em seguida, `Object.assign` (l.84-96) sobrescreve a mesma chave com a densidade da **família** (`Densidade: s.density < 0.9 ? 'compacta' …`, l.93). O rótulo do parâmetro vem de `categories.ts:22` (`'Densidade'`).
   - **Sugestão:** renomear a chave da família ("Densidade da família") ou não sobrescrever parâmetros escolhidos.
   - **Captura:** `reg03-editor-tabela-densidade-padrao.png`.

### REG-04 / REG-17 · Galeria do celular em larguras intermediárias
- **Passos:** `/#/modulos/mobile` a 768×1024 (tablet), 800×360 ou 844×390 (celular deitado), ou 1024×600 (com a sidebar do Studio).
- **Esperado:** grade de miniaturas ao lado ou acima do celular grande, todas clicáveis.
- **Observado:**
  - O modo `medium` deixa a coluna `.lay-mob-list` com **0 px** de largura.
  - As miniaturas (mínimo de 128 px) transbordam para baixo do painel fixo. `elementFromPoint` no centro das **44/44** miniaturas acerta `.lay-mob-info`/`.lay-mob-stage`, então nenhuma pode ser escolhida pela grade.
  - O botão "Escolher este modelo" fica por cima de 3 cartões.
  - O texto do painel sobrepõe as miniaturas, o que confirma a "sobreposição em paisagem" do A5.
- **Causa:**
  - `src/modules/layouts/layouts.css:1520-1523` usa `grid-template-columns: minmax(0, 1fr) auto` no modo `medium`.
  - A coluna `auto` cresce até o max-content do texto de `.lay-mob-info` (`width: 100%`, l.1581-1583) e esmaga a coluna `1fr`, cujo mínimo é 0.
  - O modo vem de `MobileStudio.tsx:126` (620–939 px).
- **Sugestão:**
  - `grid-template-columns: minmax(280px, 1fr) minmax(0, max-content)`, com largura explícita do estágio (`phoneW`) e `max-width` no painel de informações.
  - Ou empilhar (estágio acima, grade abaixo) nesse modo.
- **Capturas:** `reg04-768x1024-…`, `reg04-800x360-…`, `reg04-844x390-…`, `reg04-1024x600-…`.
- **Por que dois itens:** a mesma causa reproduz o REG-17 (overflow na galeria) e o REG-04 (sobreposição). Nas larguras padrão (360 e 1440) não há botões sobrepostos nem grudados.

### REG-11 · Densidade escolhida não chega ao prompt
- **Passos:** Componentes › Tabelas › Soft Pill › "Adicionar". No editor, Densidade = **Compacta** (salvo em `props.densidade = 'compacta'`).
- **Observado:** o prompt traz "Densidade: confortável".
- **Causa e correção:** iguais às do REG-03 item 3.
- **O que chega corretamente** (teste "entrada, layouts…"): nome, tipo, fluxo, landing, login, cadastro, layouts desktop e mobile, header, sidebar, paleta, fonte dos títulos, base de 17 px, raio de 14 px, ícones duotone, família e categoria do componente.

### REG-12 · Primária manual não recalcula os derivados
- **Passos:** Identidade › Tokens e cores › Cor primária = `#0b6e4f` + Enter.
- **Observado:**
  - Primária — hover continua #161618, active #131316, foco #18181b e link #18181b (valores da paleta "Neutro Essencial").
  - Na prévia, o botão "Primário" fica verde e o "Hover" quase preto.
- **Causa:** `src/core/theme.ts:12` aplica `applyOverrides(deriveTokens(palette.base), overrides)`. `applyOverrides` (`src/core/tokens.ts:191-197`) só troca a chave alterada. A derivação de hover, active, soft, foco, link, selectedText e navActive (`tokens.ts:122-188`) parte sempre da primária da paleta.
- **Sugestão:** quando `overrides.primary` existir, chamar `deriveTokens({ ...palette.base, primary: overrides.primary })` antes de aplicar as demais exceções. Ou oferecer "Regenerar derivados" e listar os tokens dependentes.
- **O que funciona:** a troca de paleta se propaga para a prévia da identidade, o celular grande, o CSS exportado (`--color-primary`) e o prompt (nome e hex).

### REG-14 / REG-16 · Botões da prévia de identidade sob o rodapé do guiado
- **Passos:** guiado, etapa 7 (Identidade visual), a 1440×900. Rolar a página: o painel `.clr-aside` é fixo (`position: sticky`, `src/modules/color/color.css:7-9`).
- **Observado:**
  - O painel termina em y≈871. O rodapé fixo `.gd-footer` (`src/modules/guided/guided.css:119-122`, `z-index: 30`) começa em y=835.
  - Os botões "Prompt da identidade" e "CSS dos tokens" (`ColorSystem.tsx:342-347`) ficam **inteiramente atrás do rodapé** em qualquer rolagem (captura `reg14-reg16-css-tokens-sob-rodape-1440-rolado.png`).
  - Um clique real nessa posição acerta "Continuar: Navegação", leva para `/guiado/navegacao` e **não baixa** o CSS. Isso explica a "1ª tentativa falhou" do P1 e do A4.
- **Arquivos exportados:** todos válidos.
  - O .md tem o título correto.
  - O JSON passa no `JSON.parse` com `$schema` correto.
  - O CSS é aceito pelo CSSOM, com 44 variáveis não vazias.
  - O HTML passa no DOMParser com doctype.
  - O backup tem `kind` correto.
  - O "CSS dos tokens" do módulo livre baixa no 1º clique e é idêntico ao CSS de referência.
- **Etapa 4 (celular grande):** a altura `phoneW = (vh − 60 − 44)/2.06` (`MobileStudio.tsx:128-131`) não desconta o rodapé do guiado (~65 px). A base do aparelho fica 23 px sob o rodapé a 1440×900 e 35 px a 1280×720 (`reg16-guiado-celular-sob-rodape-1440.png`).
- **Sugestão:**
  - No guiado, limitar `max-height` dos painéis fixos a `100dvh − topbar − altura do rodapé` (exposta como variável CSS `--gd-footer-h`).
  - Ou dar `scroll-padding-bottom`/`bottom` ao sticky.
  - Na etapa 4, subtrair a altura do rodapé no cálculo de `phoneW` quando `guided`.
- **Sem problema:** Copiar e Baixar da etapa 10, últimas miniaturas das etapas 3 e 4 e links "Alterar" da revisão podem ser trazidos acima do rodapé, a 1440 e a 360.

### REG-18 · Desktop × celular
1. **Pontos de troca contraditórios no Master Prompt.**
   - O layout mobile diz "A partir de 768 px passa a valer a arquitetura desktop" (`src/modules/layouts/catalog.mobile.ts:29`).
   - O desktop diz "Abaixo de 768 px vale a arquitetura mobile" (`catalog.desktop.ts:42`).
   - A seção "Relação entre desktop e celular" diz "Entre **600** e 1023 px (tablet), use a estrutura desktop compactada… (sidebar recolhida em rail…)" (`src/prompt/text.ts:79`). Ela cita a sidebar mesmo quando o layout não tem uma.
   - **Sugestão:** um único `MOBILE_DESKTOP_BREAKPOINT` usado nos três textos, e a frase da sidebar só quando o layout tiver sidebar.
2. **Prévia integrada no celular.**
   - Abre sempre em "Computador": `useState<Device>('desktop')`, `src/modules/preview/LiveSitePreview.tsx:106`.
   - A 360 px o quadro de 1280 px cai para escala ≈0,26, com texto de 3–5 px (`reg18-previa-integrada-360-abre-em-computador.png`).
   - **Sugestão:** valor inicial `useMediaQuery('(max-width: 600px)') ? 'mobile' : 'desktop'`.
- **Sem problema:** as mesmas escolhas feitas pela interface a 1440×900 e a 360×800 geram o mesmo `entry`, `layout`, `identity` e o mesmo Master Prompt (sem as linhas de data).

### REG-19 · Aba "Cadastro" sem cadastro
- **Passos:** fluxo "Apenas login", login "Clássico central", nenhum cadastro. Abrir Prévia integrada.
- **Observado:** as abas são Aplicação, Login e **Cadastro**. A aba mostra "Crie sua conta" genérico (Nome completo, E-mail, Senha), embora a lista de escolhas diga "Cadastro: Não escolhido".
- **Causa:** `LiveSitePreview.tsx:121` usa `...(login ? [{ value: 'signup', label: 'Cadastro' }] : [])`, ou seja, depende de `login` e não de `signup`. O `AuthPreview` cai nos textos padrão (`AuthPreview.tsx:1198-1202`).
- **Sugestão:** exibir a aba só com `signup` escolhido (ou com um selo "sem cadastro definido"). Esconder o link "Criar conta" do login quando não houver cadastro.

### REG-20 · Trocar o fluxo deixa decisões órfãs
- **Passos:**
  1. Escolher um login em `/modulos/login`.
  2. Na etapa Entrada, escolher "Aplicação diretamente" (sem apresentação nem login).
- **Observado:**
  - O Master Prompt diz "Fluxo de entrada: Aplicação diretamente", mas na mesma seção traz "Landing: nenhuma · Login: **Clássico central**" e a especificação completa do login.
  - A Prévia integrada continua oferecendo Login e Cadastro.
  - A mudança no módulo de Entrada contradiz o que os módulos de Login, Prompt e Prévia mostram.
- **Causa:**
  - `setEntryFlow` (`src/core/store.ts:135`) não limpa nem marca `landingId`/`loginId`/`signupId`.
  - `collectPromptItems` (`src/prompt/items.ts:228-238`) inclui o login sem olhar o fluxo. Só a landing recebe a nota "o fluxo não prevê landing" (l.222).
  - A prévia decide as abas pela existência dos IDs (`LiveSitePreview.tsx:118-121`).
- **Sugestão:** filtrar landing, login e cadastro por `flow.needsLanding`/`needsLogin` no prompt e na prévia. Guardar os IDs para o caso de a pessoa voltar ao fluxo anterior, mas sem emiti-los.
- **Sem problema:** uma sequência de mudanças em Desktop, Mobile, Cores, Navegação, Componentes, Templates e Inspiração mantém as escolhas anteriores e todas as telas abrindo sem erro.

## Itens não reproduzidos (critério e medida)

| # | Medida |
|---|---|
| REG-01 | Selo "Escolhido/Selecionado" de 94–110×26 px, fonte 12,5 px; borda muda; 1 selecionado por galeria |
| REG-05 | Nenhum rótulo repetido. Observação: na biblioteca de componentes, clicar no cartão marca "Escolhido" só na interface local, e "Adicionar ao projeto" é a ação que vale. Não é duplicata, mas pode confundir |
| REG-06 | 268 px no desktop; drawer de 310 px (86%) |
| REG-07 | Mínimo de 12,5 px |
| REG-08 | Ver tabela; a prévia da landing no celular agora tem 304×542 px (o A5 viu ~250 px úteis) |
| REG-09 | Proporções de 1,66 a 2,24 |
| REG-10 | Só "Ilhas" tem conteúdo elevado, por especificação |
| REG-13 | Seleções e sub-aba preservadas (a sub-aba aberta por último é lembrada, por isso o teste volta para "Como as pessoas entram") |
| REG-15 | 0 erros; armazenamento corrompido tratado |

## O que não foi automatizável de forma confiável
- **Sensação visual** em REG-04, REG-09 e REG-10 ("parece grudado", "parece menu flutuante"). Usei critérios geométricos substitutos: folga ≥ 4 px, sobreposição, proporção ícone/texto e elevação da região. Eles detectam regressões objetivas, não a percepção estética.
- **REG-02 com gesto de rolagem por inércia:** o `Input.synthesizeScrollGesture` não age no Chromium headless (já notado pelo A5). Os testes usam rolagem programática + toque por coordenada, que é o que importa para a seleção.
- **Navegadores:** só Chromium. Safari/iOS (download de .md, barra que encolhe, safe areas) e Firefox ficaram sem cobertura.
- **Escopo do REG-14:** o teste prova que o 1º clique falha no guiado por causa do rodapé. O caso relatado pelo P4 (2 de cerca de 10 cliques sem download, logo após outro download) parece ser limitação do navegador para downloads seguidos e não foi reproduzido.

## Execução da suíte

Comando, a partir de `design-system-studio/`:

```
npx playwright test -c auditoria/fase7-regressao/playwright.audit.config.ts
```

A configuração usa 3 workers, sem webServer, com `baseURL` em http://127.0.0.1:4300.

| Execução | Carga da máquina (load avg 1 min) | Resultado | Duração |
|---|---|---|---|
| 1 | 1,1 (média de 15 min: 9,0) | **51 conforme o esperado**: 36 aprovados + 15 falhas esperadas; 0 inesperados; 0 instáveis | 2,0 min |
| 2 | 7,4 | **51 conforme o esperado**: 36 aprovados + 15 falhas esperadas; 0 inesperados; 0 instáveis | 2,0 min |

Uma rodada anterior, idêntica exceto por um ajuste no `baseURL` do teste de paridade do REG-18, também deu 51/51 duas vezes, com carga de 6,5 e 16,2.

**Arquivos de resultado:**
- Saída completa: `resultados/execucao-1.txt` e `execucao-2.txt`.
- JSON: `resultados/resultado-execucao-{1,2}.json`.
- Resumo com o motivo de cada falha esperada: `resultados/resumo-execucao-{1,2}.txt`.
- Traços das falhas esperadas: `resultados/artefatos/`.

Conferi as 15 falhas esperadas uma a uma. Todas falham na asserção do defeito (ex.: "Expected > 13, Received 13"; "Expected 'padrão', Received 'confortável'"; "largura da coluna de miniaturas: Received 0"; "Expected length 1, Received 2"), e nenhuma por seletor ou tempo de espera.

As 15 falhas esperadas: REG-03 (3), REG-04, REG-11, REG-12, REG-14, REG-16 (2), REG-17 (2), REG-18 (2), REG-19 e REG-20.

Não alterei nada em `src/` nem nos testes existentes. A suíte nova pode rodar também na configuração padrão do projeto (`npm run test:e2e`, porta 4173), porque só usa caminhos relativos e os helpers de `tests/e2e/helpers.ts`.
