# Fidelidade: P5 "Conecta" (plataforma social mobile-first)

Auditoria independente da fase 4. Compara o que foi **escolhido no Studio** com os três sites feitos por desenvolvedores de IA que receberam **apenas** o Master Prompt. Os sites estão sob rótulos cegos: `dev-1`, `dev-2`, `dev-3`.

**Leitura:**

| Prefixo | Fonte |
|---|---|
| MP *n* | Linha *n* do Master Prompt exportado |
| C1–C7 | Contradições registradas em `fase2-projetos/P5-conecta/relatorio.md` |
| NOTES *n* | Item *n* do `NOTES.md` de cada desenvolvedor |

Requisitos, limiares e escala estão em `rubrica.md`, que foi escrita antes de abrir os sites.

## 0. Método, ambiente e ressalvas

- **Fontes usadas:** `escolhas.md`, `relatorio.md`, `exportados/`, `capturas/` da fase 2, e os sites (`index.html`, `README.md` só para as credenciais e `NOTES.md`). Li também `fase3-sites/DESVIOS-DE-ISOLAMENTO.md`: não há desvio relatado para P5. Os três `PROMPT.md` são idênticos byte a byte ao Master Prompt exportado (`cmp`).
- **Modelo de referência:** medi no DOM do próprio Studio (navegador limpo, contexto descartável) a prévia do layout mobile escolhido, com `scripts/studio-modelo.js` (saída em `scripts/out/studio-modelo.txt`). Valores na tela de 380 px:
  - topbar de 59 px e faixa de stories de 97 px colada a ela;
  - dock de 346 × 68 px, a 17/17/33 px das bordas, com raio de 24 px;
  - drawer de 300 px em altura total.
- **Ferramentas:** Playwright 1.63 + Chromium, ImageMagick e Pillow. Sites servidos em 4551/4552/4553 por `python3 -m http.server`; os servidores foram encerrados no fim.
- **Viewports:**
  - Celular: 390 × 844 e 360 × 800 (`isMobile`, `hasTouch`, DPR 3), 320 × 640, paisagem 844 × 390 e 667 × 375.
  - Tablet: 768 × 1024 e 820. Desktop: 1024, 1280, 1440 × 900 e 1920.
  - Varredura de 16 larguras (320 a 1920, incluindo 767), cada uma no login e em 4 rotas: feed, explorar, perfil e mensagens.
- **Scripts e dados brutos:** `scripts/` (`medir-celular.js`, `medir-desktop.js`, `medir-login.js`, `varredura.js`, `rolagem-drawer2.js`, `tokens.py`, `notas.py`, `composicoes.py`). Os JSON estão em `scripts/out/`.

**Ressalvas:**

1. **Fonte.** O Google Fonts foi bloqueado nos testes (sem rede no Chromium), e a Inter está instalada localmente, por isso o render usa Inter de verdade. Mesmo assim, a máquina mapeia `system-ui` para Inter. A tipografia foi julgada pelo `font-family` computado, não pela imagem.
2. **Safe areas.** `env(safe-area-inset-*)` não pode ser emulado no Chromium headless. Verifiquei a presença da regra no CSS (todas presentes) e `viewport-fit=cover` (presente nos três).
3. **Teclado virtual.** Não foi testado. Os três dizem que também não testaram.
4. **Artefato do Playwright.** O `click()` padrão em botão sticky com emulação móvel rolou a página antes de clicar: em dev-2 e dev-3 a rolagem caiu de 1000 para cerca de 640. Refiz o teste com toque real (`touchscreen.tap`) e com `element.click()`: **a rolagem é preservada nos três** (1000 → 1000 → 1000). Não é defeito dos sites.
5. **Hover preso.** Nas capturas de dev-3, "Salvos" aparece mais escuro no dock. É `:hover` preso, porque o ponteiro ficou na posição do botão "Entrar". Não é um segundo item ativo.
6. **Log de testes de dev-3.** O `_testes_log.txt` de dev-3 registra `EXIT 2`, embora o README diga "102 verificações aprovadas". Registro, mas não pontuo.

## 1. Cadeia Studio → Master Prompt (por característica do briefing)

| Característica do briefing | Foi escolhida no Studio? | Chegou ao Master Prompt? | Clareza (trechos) | Classe |
|---|---|---|---|---|
| **Header superior com stories** | Sim no celular (layout "Stories com dock e drawer lateral"). No desktop, **não**: nenhum layout ou header desktop tem stories (LACUNA em `escolhas.md`). | Celular: MP 143 "Topbar com hambúrguer, faixa de stories…", 146 "Topbar de ≈56 px", 147 "Faixa de stories de ≈88 px abaixo da topbar, com rolagem horizontal", 232 (observação: "a faixa de stories fica logo abaixo do header"). Desktop: nada. | Clara no celular. **Não diz** se a faixa vale para todas as telas nem se fica fixa: três sites, três respostas (§5). No desktop, silêncio. | Celular OK · desktop **A** · escopo **B** |
| **Menu inferior flutuante arredondado** | Sim: layout (dock de ≈64 px) + componente "Layouts mobile" → "Dock flutuante", FAB "não", itens Início/Explorar/Salvos/Perfil. | MP 148 "Dock flutuante de ≈64 px com 4 destinos", 176 (observação "Sem botão flutuante (FAB)…"), 594–596. | "Flutuante" claro, mas **sem medida de afastamento**. "Arredondado" só pelo nome (MP 575/644) e pelo raio da família (MP 376, 597). O texto genérico contraditório continua 4 vezes: "No celular, use navigation bar inferior com pílula ativa e FAB acima dela" (MP 418, 491, 564, 639), mais "ações flutuantes (FAB) para a tarefa principal" (MP 363, 438, 511, 587). Os três precisaram arbitrar (NOTES 26 de dev-1, NOTES 14 de dev-2, NOTES 9 de dev-3). | Geometria **A** · resíduo **B** |
| **Drawer lateral acessado pelo header** | Sim: layout (`drawer-left`) + componente Drawer (Lado Esquerda) + 2 observações do usuário. No desktop não há drawer. | MP 149 "Drawer de ≈280 px (máx. 85 %)… desliza pela esquerda, ocupando a altura total", 166–167 (foco, Esc, inert, overflow), 232, 568. | Clara **graças às observações**. O texto contraditório continua: MP 224–225 "Vão para o painel do menu… desliza logo abaixo do header em largura total"; MP 547 "largura: 360–420 px"; MP 563 "até 88vw … ou bottom sheet". | OK · resíduo **B** |
| **Cards de conteúdo** | Sim (Cards MM "Card de conteúdo do feed"). | MP 350–424: estrutura (MP 357), link estendido (MP 358), 16/9, 3 linhas. | Clara na estrutura. **Ambígua no conteúdo**: "Título: Publicação da comunidade", "Texto: Foto ou texto compartilhado…", "Etiqueta: Novo", "Ícone: Avião" (MP 368–372) aparecem como propriedades, sem dizer que são texto de exemplo. dev-3 repetiu esse texto em todos os cards; dev-1 só no primeiro; dev-2 em nenhum. | **B** |
| **Perfil do usuário** | Sim (Perfil MM). | MP 426–496. | Clara na estrutura (MP 433). Há ambiguidade entre "Botão: Seguir" (MP 445) e "Editar perfil abre formulário" (MP 480), e as abas não têm rótulo. Os três resolveram igual ("Editar perfil" no próprio perfil, "Seguir" no dos outros), mas deram nomes diferentes às abas. | **B** leve |
| **Navegação mobile prioritária** | **Não há opção** (LACUNA). Só texto livre. | MP 9 e 11 (tipo/descrição). Pior: MP 179 manda o contrário: "São decisões independentes: não derive uma da outra." | Informativa, sem regra operacional. | **A** |
| **Versão desktop coerente** | Parcial: "Topbar integral fixa" + header "Praça da Comunidade". Não há como espelhar os destinos. | MP 181 "mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões". | **Contraditória** (C4): o header tem Feed/Grupos/Eventos/Mensagens (MP 195) e o dock tem Início/Explorar/Salvos/Perfil (MP 594). dev-1 e dev-2 fizeram a união e o mapeamento; dev-3 manteve as listas e perdeu Salvos, Explorar e Conta no desktop. | **A** (mecanismo) + **B** (texto) |

**Demais escolhas:**

| Escolha | Situação no Master Prompt |
|---|---|
| Login "Acesso responsivo" e cadastro "mesma tela" | Exportados com clareza (MP 21–99). Pequenos conflitos internos: campos de 56 px × 44/48 px (MP 35 × 75) e botão fixo × não fixo (MP 46 × 92). Os três resolveram igual e registraram (D). |
| Paleta | Exportada inteira (MP 246–291 + CSS). Os três declararam os 44 tokens. |
| Tipografia e geometria globais | Conflitam com as propriedades da família Modern Material (C6: MP 297–335 × 376–389). É um conflito de especificação (**D**). |
| Corte de tablet | MP 133/172/224 (768) contra MP 180 (600) (**B**). Os três escolheram 768. |
| Header desktop | Visual aprovado diferente do exportado: na prévia, "+ Novo" é neutro (cinza), os contadores usam o laranja `accent`, o monograma é escuro e a busca é preenchida. Nada disso está no MP (**B**). Os três fizeram "+ Novo" primário, contadores magenta e monograma magenta (§5). |

## 2. Notas por dimensão

Número de requisitos testados por dimensão: Arquitetura 11, Celular 17, Desktop/tablet 10, Paleta 10, Componentes 12, Interações 14. Total: **74 por site** (222 medições). Escala 0–100. Média simples por requisito.

| Dimensão (n) | dev-1 | dev-2 | dev-3 |
|---|---|---|---|
| Arquitetura (11) | **100,0** | 98,6 | 95,0 |
| Celular (17) | 97,1 | **98,5** | 89,7 |
| Desktop/tablet (10) | **100,0** | 97,5 | **100,0** |
| Paleta e tokens (10) | **100,0** | **100,0** | 92,5 |
| Componentes e telas (12) | 98,8 | **100,0** | 98,8 |
| Interações (14) | **100,0** | **100,0** | **100,0** |
| **Geral (74)** | **99,1** | **99,1** | **95,7** |

Requisitos abaixo de 100 % e origem:

| Site | Requisitos | Por origem |
|---|---|---|
| dev-1 | CEL-13, CEL-16, COMP-05 | C = 3 |
| dev-2 | ARQ-08, CEL-16, DESK-07 | C = 2, B = 1 |
| dev-3 | ARQ-08, CEL-13, CEL-14, CEL-15, PAL-08, PAL-10, COMP-04, ARQ-10, PAL-06 | C = 7, B = 1, D = 1 |

O empate de dev-1 e dev-2 é numérico. As falhas são de natureza diferente:

- dev-1: alvos de toque pequenos e ações do perfil lado a lado;
- dev-2: nav do header descentralizada e "Eventos" escondido em "Mais" a 1024 px.

**Julgamento de design** (subjetivo, fora das notas), a partir das composições em `composicoes/`:

- **Arquitetura mobile:** os três reproduzem a arquitetura aprovada (topbar + faixa de stories + dock flutuante + drawer esquerdo). Lado a lado com a prévia do Studio (`celular-390-feed.png`, `celular-390-drawer.png`), a semelhança estrutural é alta nos três.
- **dev-1:** o mais próximo da prévia no drawer (bloco de conta, seções e itens com ícone) e na busca preenchida do header.
- **dev-2:** dock em cápsula, mais redondo que os 24 px do Studio, e fundo de página `bgAlt`. O resultado é mais "Material", um pouco mais distante da prévia branca.
- **dev-3:** o mais literal (textos de exemplo repetidos em todos os cards). A faixa de stories fixa no header deixa o topo pesado (145 px) e quebra a paisagem. As abas sublinhadas do perfil fogem da família.
- **Header desktop:** nenhum dos três reproduz as variações de cor do header aprovado, porque o MP não as descreve (B9).
- **Conteúdo do Studio:** a prévia do Studio mostra um painel financeiro (B4 da fase 2). A fidelidade de **conteúdo** de feed e perfil só pôde ser comparada com as prévias isoladas dos componentes (`card-celular-390.png`, `perfil-celular-390.png`, `dock-componente-390.png`).

## 3. Matrizes de fidelidade por site

`Escolha no Studio` e `Instrução exportada` são iguais nos três sites (o mesmo prompt). Os valores medidos estão em `scripts/out/<site>-*.json` e as capturas em `capturas/<site>-*.png`.

### Matriz dev-1

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---|---|
| **ARQ-01** Fluxo "Apenas login" (abre direto em Entrar) | Entrada "Apenas login" | MP 17: clara | Abre em Entrar; sem landing | 100 % | — |
| **ARQ-02** Celular: topbar fixa com ☰ à esquerda | Layout mobile "Stories com dock e drawer lateral" | MP 146, 152, 227: clara | sticky top 0; ☰ 44×44 em x=16; some ao rolar para baixo e volta ao subir (MP 227 recomenda) | 100 % | — |
| **ARQ-03** Celular: faixa de stories logo abaixo da topbar, com rolagem horizontal | Mesmo layout (stories: sim) | MP 147, 156, 232: clara no celular; não diz se a faixa aparece em todas as telas nem se é fixa | Faixa colada à topbar (gap 0), overflow-x auto, 9 stories; só na tela Feed (NOTES 13) | 100 % | — |
| **ARQ-04** Celular: dock com Início/Explorar/Salvos/Perfil, sem FAB | Layout + componente "Menu inferior flutuante arredondado (dock)", FAB: não | MP 148, 176, 594-596: clara; resíduo contraditório "navigation bar + FAB" em MP 418/491/564/639 | 4 rótulos exatos; nenhum FAB | 100 % | — |
| **ARQ-05** Celular: drawer esquerdo aberto pelo ☰ da topbar | Layout (drawer-left) + componente Drawer (Lado: Esquerda) + 2 observações | MP 149, 232, 568: clara graças às observações; resíduo contraditório MP 224-225 | ☰ abre drawer à esquerda | 100 % | — |
| **ARQ-06** Celular: dock não trocado por bottom navigation encostada nas bordas | Dock flutuante | MP 143, 148: "flutuante", sem medida de afastamento | Dock destacado das bordas | 100 % | — |
| **ARQ-07** Desktop: topbar integral fixa, sem sidebar, conteúdo ≤ ≈1200 px | "Topbar integral fixa" (Sem sidebar) | MP 105-118, 126: clara | Header com 100 % da largura, sticky; conteúdo de 1200 px (+32 px de padding); sem sidebar | 100 % | — |
| **ARQ-08** Desktop: header "Praça da Comunidade" A (logo, 4 abas no centro, busca, + Novo, sino, avatar) | Header "Praça da Comunidade" · Composição A | MP 192-203: clara | 7/7 elementos; centro da nav a 57 px do centro da barra (1440) | 100 % | — |
| **ARQ-09** Corte de arquitetura em 768 px | Duas arquiteturas independentes | MP 133, 172, 224 (768) contra MP 180 (600): contraditória, mas 768 domina | 767 = celular; 768 = desktop compacto | 100 % | — |
| **ARQ-10** Mesmos destinos de navegação no desktop e no celular | Sem mecanismo no Studio (LACUNA parcial) | MP 181 contradito por MP 195 e 594 (C4): contraditória | União mapeada: Explorar pela busca, Salvos no menu do avatar, Perfil = "Meu perfil"; Grupos/Eventos/Mensagens no drawer | 100 % | — |
| **ARQ-11** Marca "Conecta" no header e no login | Nome do projeto "Conecta" | MP 8, 194 ("substitua pela marca real"): clara | "Conecta" com monograma "C" | 100 % | — |
| **CEL-01** Topbar com ≈56 px | Layout mobile | MP 146, 207: clara | 57 px (56 + 1 de borda) | 100 % | — |
| **CEL-02** Topbar soma safe-area-inset-top | Layout mobile | MP 146: clara | .header-inner usa env(safe-area-inset-top) | 100 % | — |
| **CEL-03** Faixa de stories com ≈88 px | Layout mobile | MP 147, 160: clara | 89 px | 100 % | — |
| **CEL-04** Dock com ≈64 px | Layout mobile | MP 148, 161: clara | 64 px | 100 % | — |
| **CEL-05** Dock flutuante: afastado das bordas (Studio: 17/17/33 px) | Dock flutuante | MP 148: só "flutuante" (afastamento não exportado) | 12/12/12 px (a 390, 360 e 320) | 100 % | — |
| **CEL-06** Dock arredondado (Studio: raio de 24 px) | Só pelo nome e pela família (LACUNA parcial) | MP 376/597 (raio 20 px da família) + nome MP 644: indireta | 20 px | 100 % | — |
| **CEL-07** Dock respeita safe-area-inset-bottom | Componente Dock | MP 638, 667: clara | .dock usa safe-area-inset-bottom | 100 % | — |
| **CEL-08** Item ativo do dock em pílula tonal + aria-current | Família MM (indicador tonal) | MP 173, 389, 586: clara | Pílula 56×30 #fae7ed, texto #bc2d5f, aria-current="page" | 100 % | — |
| **CEL-09** Drawer com ≈280 px, máx. 85 % | Layout + observação no Drawer | MP 149, 170, 568: clara; resíduo MP 547/563 (360-420 px, 88vw) | 280 px (390 e 360); 272 px a 320 (85 %) | 100 % | — |
| **CEL-10** Drawer em altura total, sobre topbar e dock, com scrim | Layout + Drawer (escurecer fundo: sim) | MP 149, 520: clara | x 0, y 0, altura = viewport; scrim rgba(27,27,31,.5) cobre topbar e dock | 100 % | — |
| **CEL-11** Conteúdo não fica escondido atrás do dock | (regra geral) | MP 661, 667: clara | Último conteúdo termina em 721 px; o dock começa em 768 px | 100 % | — |
| **CEL-12** Sem overflow horizontal de 320 a 767 px | (regra geral) | MP 50, 659: clara | 0 overflow (9 larguras × login + 4 rotas) | 100 % | — |
| **CEL-13** Alvos de toque ≥ 44 × 44 px | (regra geral + família MM) | MP 211, 386, 662: clara | 4 links de autor com 19 px de altura nos cards (a 390); marca com 36×44 a 320 | 75 % | C |
| **CEL-14** Paisagem: stories recolhem; dock com ≈52 px | Layout mobile | MP 171: "recolhem" é ambíguo (esconder ou compactar) | 667×375: stories compactadas para 65 px, sem nomes (NOTES 12); dock 52 px | 100 % | — |
| **CEL-15** Paisagem: barras fixas ≤ 25 % da altura | (regra geral) | MP 668: clara (conflita com 56 + 52 px de MP 146/171 em telas baixas) | Topbar deixa de ser fixa; só o dock de 52 px (14 %) | 100 % | — |
| **CEL-16** Nenhum texto cortado | (regra geral) | MP 660: clara | Prévias de conversa em Mensagens cortadas com reticências de 320 a 430 px | 75 % | C |
| **CEL-17** Inputs ≥ 16 px e ≥ 48 px no celular | Login "Acesso responsivo" | MP 48, 663: clara | 56 px / 16 px | 100 % | — |
| **DESK-01** Header desktop de 60 a 64 px | Header + layout desktop | MP 192/206 (60) contra MP 108/122 (64): contraditória, ambas aceitas | 60 px + 1 de borda | 100 % | — |
| **DESK-02** Header sticky, fundo navBg, borda inferior de 1 px | Header | MP 126, 193, 215: clara | sticky; #fff; borda de 1 px #e6e6e6 | 100 % | — |
| **DESK-03** Sombra suave após 8 px de rolagem | Header | MP 215: clara | none → 0 2px 8px | 100 % | — |
| **DESK-04** Ativo com sublinhado de 2 px primário + aria-current | Header | MP 195, 214, 236: clara | ::after de 2 px #d6336c na base; aria-current | 100 % | — |
| **DESK-05** Busca ≈220 × 36 px, "Buscar…", cresce para 300 px | Header | MP 196, 216: clara | 220×36 → 300 px; lupa; "Buscar…" | 100 % | — |
| **DESK-06** Logo: monograma circular de 32 px + nome | Header | MP 194: clara | Círculo de 32 px + "Conecta" | 100 % | — |
| **DESK-07** 1024-1279 px: espaço de 16 px, busca de 180 px, links visíveis | Header + layout | MP 222 (só compacta) contra MP 131 ("Mais"): ambígua | A 1024 px: busca de 180 px e 4 links visíveis ("Mais" só se não couber) | 100 % | — |
| **DESK-08** 768-1023 px: navegação em ☰/"Menu" com painel de largura total abaixo do header | Header + layout | MP 132, 223: clara | "Menu" abre painel de 768 px abaixo do header; logo, busca e + Novo visíveis | 100 % | — |
| **DESK-09** Sem overflow de 768 a 1920 px | (regra geral) | MP 659: clara | 0 overflow | 100 % | — |
| **DESK-10** Grade de cards reduz colunas; altura pelo conteúdo | Componente Card | MP 417, 419: clara | 3 → 2 → 1 colunas | 100 % | — |
| **PAL-01** Os 44 tokens de cor exportados declarados | Paleta "Comunidade" | MP 246-291 + conecta-tokens.css: clara | 44/44 | 100 % | — |
| **PAL-02** Primária #d6336c nas ações principais | Paleta | MP 248, 381: clara | Entrar, + Novo, Ver publicação, Editar perfil e Sair = #d6336c | 100 % | — |
| **PAL-03** Fundo #fff/#f6f6f6 e texto #1b1b1f | Paleta | MP 257-261: clara | body #fff / #1b1b1f | 100 % | — |
| **PAL-04** Tokens de navegação (navBg/navText/navActive/navActiveText) | Paleta | MP 286-289: clara | inativo #4d4d50; ativo #bc2d5f sobre #fae7ed | 100 % | — |
| **PAL-05** Inter, base 15 px, títulos 650 | Tipografia padrão "Inter + Inter" | MP 297-309 contra MP 382-385 ("Fonte do sistema 500", 14 px): contraditória (C6) | Inter 15 px; h1 650; títulos dos componentes 500 e texto 14 px (leitura da família, D documentado) | 100 % | — |
| **PAL-06** Raios: global 6/8/12 px; componentes 20/12 px | Geometria "Médios (8 px)" + família MM | MP 327-329 e 376-377: duas escalas, sem limite de escopo explícito | Botões dos componentes 20 px; cards 12 px; botões globais 8 px | 100 % | — |
| **PAL-07** Sombra/borda: sem sombra nas superfícies de conteúdo; elevação só no que flutua | Geometria "Contornada / Sem sombra" + família MM | MP 319/323 contra MP 378-379: contraditória (C6) | Cards sem borda e sem sombra; elevação no dock e nos popovers | 100 % | — |
| **PAL-08** Superfície dos componentes tingida (#fef8fa) | Família MM | MP 380, 394: clara | #fef8fa em cards, perfil, drawer e dock | 100 % | — |
| **PAL-09** Foco: anel de 2-3 px em focusRing #d6336c | Estados globais | MP 214, 342, 409: clara | 2 px sólido #d6336c (+ halo de 35 % nos componentes) | 100 % | — |
| **PAL-10** Sem cores fixas espalhadas (tokens centralizados) | (regra geral) | MP 235, 695: clara | 1 literal em JS | 100 % | — |
| **COMP-01** Card: mídia 16/9 → etiqueta → título → texto (3 linhas) → rodapé | Componente Cards "Card de conteúdo do feed" | MP 357: clara | 5/5; mídia 1,78; clamp de 3 linhas | 100 % | — |
| **COMP-02** Card MM: contêiner de 12 px; "Ver publicação" em pílula primária | Componente Cards (MM) | MP 371, 376-381: clara | 12 px; pílula de 20 px #d6336c | 100 % | — |
| **COMP-03** Card com link estendido, sem botões aninhados | Componente Cards | MP 358: clara | ::after do "Ver publicação" (inset 0); 0 aninhamentos | 100 % | — |
| **COMP-04** Perfil: capa → avatar −50 % → nome/cargo → ações → 3 estatísticas → abas | Componente "Perfil do usuário" (MM) | MP 433, 446-448: clara (abas sem rótulos; "Seguir" × "Editar perfil" ambíguo) | 7/7; avatar sobreposto em 46 %; abas Publicações/Mídia/Sobre | 100 % | — |
| **COMP-05** Perfil no celular: centralizado, 3 colunas, ações em largura total | Componente Perfil | MP 490: clara | Centralizado, 3 colunas; ações lado a lado (2 × 159 px), não em largura total | 85 % | C |
| **COMP-06** Drawer: dialog/aria-modal, título "Menu", ✕, corpo rolável, rodapé "Sair da conta" | Componente "Drawer lateral aberto pelo header" | MP 505-519: clara | dialog + aria-modal; "Menu"; ✕; corpo com overflow auto; "Sair da conta" em pílula | 100 % | — |
| **COMP-07** Drawer com configurações, ajuda e conta | Layout mobile | MP 165: clara | Conta + Navegar + Configurações/Ajuda | 100 % | — |
| **COMP-08** Dock na família MM (ícone + rótulo, pílula, elevação) | Componente Dock (MM) | MP 582-599: clara | Ícone + rótulo, pílula, superfície tingida, sombra | 100 % | — |
| **COMP-09** Login: "Entrar", subtítulo, E-mail\|Telefone, campos de 56 px, "Esqueci minha senha" | Login "Acesso responsivo" | MP 25-42: clara | 5/5 | 100 % | — |
| **COMP-10** Login: "Entrar" fixo na base no celular; painel com instruções no desktop | Login "Acesso responsivo" | MP 29-30, 46: clara | Barra fixa na base (12 px); painel de instruções à direita no desktop | 100 % | — |
| **COMP-11** Cadastro na mesma tela: abas, Nome/E-mail/Senha, checklist, termos | Cadastro "mesma tela" | MP 63-72: clara | 5/5 | 100 % | — |
| **COMP-12** Topbar do celular com ☰, marca e busca | Layout mobile + header | MP 146, 224: clara (MP 228/674 pedem também a "ação principal"; MP 224 não a lista) | ☰, marca, busca, "+" e avatar | 100 % | — |
| **INT-01** Ao abrir o drawer, foco em "Fechar" sem rolar a página | Layout mobile | MP 166: clara | Foco em "Fechar menu"; rolagem preservada (1000 → 1000) | 100 % | — |
| **INT-02** Fecha com Esc, scrim e ✕; foco volta ao ☰ | Layout + Drawer | MP 166, 553: clara | Esc, clique e toque no scrim e ✕ fecham; foco volta | 100 % | — |
| **INT-03** Foco preso; fundo inert/aria-hidden | Layout mobile | MP 166, 240: clara | 21/21 Tabs dentro do painel; #app com inert e aria-hidden | 100 % | — |
| **INT-04** Body não rola; drawer com overscroll contain | Layout mobile | MP 167: clara | body overflow hidden; corpo do drawer com overscroll contain | 100 % | — |
| **INT-05** Dock troca destino e item ativo | Componente Dock | MP 173: clara | 4/4; aria-current acompanha | 100 % | — |
| **INT-06** Stories rolam na horizontal; itens focáveis | Layout mobile | MP 147: clara (comportamento do toque não especificado) | Rolagem ok; toque abre visualizador (extra, E) | 100 % | — |
| **INT-07** Card: foco visível no link principal | Componente Cards | MP 407-409: clara | Anel visível | 100 % | — |
| **INT-08** Perfil: abas trocam conteúdo sem recarregar | Componente Perfil | MP 480: clara | Troca sem recarregar | 100 % | — |
| **INT-09** Login: validação, resumo role=alert, erro genérico, aria-pressed, "Entrando…" | Login | MP 38-43: clara | 5/5 | 100 % | — |
| **INT-10** Cadastro: mantém e-mail, ?aba=cadastro, checklist ao digitar | Cadastro | MP 79, 81: clara | 3/3 | 100 % | — |
| **INT-11** Desktop: popover de notificações (320 px) e menu do avatar; Esc e clique fora | Header | MP 217-218, 239: clara | 320 px + "Ver todas"; menu do avatar com "Salvos" a mais (NOTES 2, E); Esc e clique fora fecham | 100 % | — |
| **INT-12** Busca: Esc limpa e tira o foco | Header | MP 216: clara | Esc limpa e tira o foco; Enter → #/explorar?q= | 100 % | — |
| **INT-13** Login de demonstração entra; "Sair" volta ao login | (fluxo) | MP 17: clara | Entra e sai | 100 % | — |
| **INT-14** prefers-reduced-motion respeitado | (regra geral) | MP 671: clara | Presente | 100 % | — |

### Matriz dev-2

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---|---|
| **ARQ-01** Fluxo "Apenas login" (abre direto em Entrar) | Entrada "Apenas login" | MP 17: clara | Abre em Entrar; sem landing | 100 % | — |
| **ARQ-02** Celular: topbar fixa com ☰ à esquerda | Layout mobile "Stories com dock e drawer lateral" | MP 146, 152, 227: clara | sticky top 0; ☰ 44×44 em x=16; some ao rolar para baixo e volta ao subir | 100 % | — |
| **ARQ-03** Celular: faixa de stories logo abaixo da topbar, com rolagem horizontal | Mesmo layout (stories: sim) | MP 147, 156, 232: clara no celular; não diz se a faixa aparece em todas as telas nem se é fixa | Gap 0, overflow-x auto; faixa em todas as telas, rola com a página | 100 % | — |
| **ARQ-04** Celular: dock com Início/Explorar/Salvos/Perfil, sem FAB | Layout + componente "Menu inferior flutuante arredondado (dock)", FAB: não | MP 148, 176, 594-596: clara; resíduo contraditório "navigation bar + FAB" em MP 418/491/564/639 | 4 rótulos exatos; nenhum FAB | 100 % | — |
| **ARQ-05** Celular: drawer esquerdo aberto pelo ☰ da topbar | Layout (drawer-left) + componente Drawer (Lado: Esquerda) + 2 observações | MP 149, 232, 568: clara graças às observações; resíduo contraditório MP 224-225 | ☰ abre drawer à esquerda | 100 % | — |
| **ARQ-06** Celular: dock não trocado por bottom navigation encostada nas bordas | Dock flutuante | MP 143, 148: "flutuante", sem medida de afastamento | Dock destacado das bordas | 100 % | — |
| **ARQ-07** Desktop: topbar integral fixa, sem sidebar, conteúdo ≤ ≈1200 px | "Topbar integral fixa" (Sem sidebar) | MP 105-118, 126: clara | Header com 100 % da largura, sticky; conteúdo de 1200 px; sem sidebar | 100 % | — |
| **ARQ-08** Desktop: header "Praça da Comunidade" A (logo, 4 abas no centro, busca, + Novo, sino, avatar) | Header "Praça da Comunidade" · Composição A | MP 192-203: clara | 7/7 + item "Mais" permanente; nav deslocada 166 px à esquerda do centro (1440 e 1920). NOTES 3 alega falta de espaço, mas a 1440 px cabe (dev-1) | 85 % | C |
| **ARQ-09** Corte de arquitetura em 768 px | Duas arquiteturas independentes | MP 133, 172, 224 (768) contra MP 180 (600): contraditória, mas 768 domina | 767 = celular; 768 = desktop compacto | 100 % | — |
| **ARQ-10** Mesmos destinos de navegação no desktop e no celular | Sem mecanismo no Studio (LACUNA parcial) | MP 181 contradito por MP 195 e 594 (C4): contraditória | Explorar e Salvos no menu "Mais", Perfil = "Meu perfil"; Grupos/Eventos/Mensagens no drawer | 100 % | — |
| **ARQ-11** Marca "Conecta" no header e no login | Nome do projeto "Conecta" | MP 8, 194 ("substitua pela marca real"): clara | "Conecta" com monograma "C" | 100 % | — |
| **CEL-01** Topbar com ≈56 px | Layout mobile | MP 146, 207: clara | 56 px | 100 % | — |
| **CEL-02** Topbar soma safe-area-inset-top | Layout mobile | MP 146: clara | .site-header usa env(safe-area-inset-top) | 100 % | — |
| **CEL-03** Faixa de stories com ≈88 px | Layout mobile | MP 147, 160: clara | 100 px no contêiner; lista de 88 px | 100 % | — |
| **CEL-04** Dock com ≈64 px | Layout mobile | MP 148, 161: clara | 64 px | 100 % | — |
| **CEL-05** Dock flutuante: afastado das bordas (Studio: 17/17/33 px) | Dock flutuante | MP 148: só "flutuante" (afastamento não exportado) | 16/16/12 px | 100 % | — |
| **CEL-06** Dock arredondado (Studio: raio de 24 px) | Só pelo nome e pela família (LACUNA parcial) | MP 376/597 (raio 20 px da família) + nome MP 644: indireta | 999 px (cápsula) | 100 % | — |
| **CEL-07** Dock respeita safe-area-inset-bottom | Componente Dock | MP 638, 667: clara | .dock usa safe-area-inset-bottom | 100 % | — |
| **CEL-08** Item ativo do dock em pílula tonal + aria-current | Família MM (indicador tonal) | MP 173, 389, 586: clara | O item inteiro vira pílula #fae7ed / #bc2d5f; aria-current | 100 % | — |
| **CEL-09** Drawer com ≈280 px, máx. 85 % | Layout + observação no Drawer | MP 149, 170, 568: clara; resíduo MP 547/563 (360-420 px, 88vw) | 280 px (390 e 360); 272 px a 320 (85 %) | 100 % | — |
| **CEL-10** Drawer em altura total, sobre topbar e dock, com scrim | Layout + Drawer (escurecer fundo: sim) | MP 149, 520: clara | x 0, y 0, altura = viewport; scrim .5 cobre topbar e dock | 100 % | — |
| **CEL-11** Conteúdo não fica escondido atrás do dock | (regra geral) | MP 661, 667: clara | Último conteúdo termina em 728 px; o dock começa em 768 px | 100 % | — |
| **CEL-12** Sem overflow horizontal de 320 a 767 px | (regra geral) | MP 50, 659: clara | 0 overflow (9 larguras × login + 4 rotas) | 100 % | — |
| **CEL-13** Alvos de toque ≥ 44 × 44 px | (regra geral + família MM) | MP 211, 386, 662: clara | 0 alvos pequenos a 390 px (marca com 32×44 só a 320/344) | 100 % | — |
| **CEL-14** Paisagem: stories recolhem; dock com ≈52 px | Layout mobile | MP 171: "recolhem" é ambíguo (esconder ou compactar) | 667×375: stories ocultas; dock 52 px | 100 % | — |
| **CEL-15** Paisagem: barras fixas ≤ 25 % da altura | (regra geral) | MP 668: clara (conflita com 56 + 52 px de MP 146/171 em telas baixas) | Topbar static; só o dock de 52 px (14 %) | 100 % | — |
| **CEL-16** Nenhum texto cortado | (regra geral) | MP 660: clara | Descrições de conversa (list-card__desc) cortadas com reticências de 320 a 480 px | 75 % | C |
| **CEL-17** Inputs ≥ 16 px e ≥ 48 px no celular | Login "Acesso responsivo" | MP 48, 663: clara | 56 px / 16 px | 100 % | — |
| **DESK-01** Header desktop de 60 a 64 px | Header + layout desktop | MP 192/206 (60) contra MP 108/122 (64): contraditória, ambas aceitas | 64 px | 100 % | — |
| **DESK-02** Header sticky, fundo navBg, borda inferior de 1 px | Header | MP 126, 193, 215: clara | sticky; #fff; borda de 1 px #e6e6e6 | 100 % | — |
| **DESK-03** Sombra suave após 8 px de rolagem | Header | MP 215: clara | none → 0 2px 8px | 100 % | — |
| **DESK-04** Ativo com sublinhado de 2 px primário + aria-current | Header | MP 195, 214, 236: clara | ::after de 2 px #d6336c na base; aria-current | 100 % | — |
| **DESK-05** Busca ≈220 × 36 px, "Buscar…", cresce para 300 px | Header | MP 196, 216: clara | 220×36 → 300 px | 100 % | — |
| **DESK-06** Logo: monograma circular de 32 px + nome | Header | MP 194: clara | Círculo de 32 px + "Conecta" | 100 % | — |
| **DESK-07** 1024-1279 px: espaço de 16 px, busca de 180 px, links visíveis | Header + layout | MP 222 (só compacta) contra MP 131 ("Mais"): ambígua | A 1024 px "Eventos" vai para "Mais" (o "Mais" fixo com Explorar/Salvos ocupa espaço) | 75 % | B |
| **DESK-08** 768-1023 px: navegação em ☰/"Menu" com painel de largura total abaixo do header | Header + layout | MP 132, 223: clara | "Menu" abre painel de largura total em y=64 (não trava a rolagem do body: observação) | 100 % | — |
| **DESK-09** Sem overflow de 768 a 1920 px | (regra geral) | MP 659: clara | 0 overflow | 100 % | — |
| **DESK-10** Grade de cards reduz colunas; altura pelo conteúdo | Componente Card | MP 417, 419: clara | 3 → 2 → 1 colunas | 100 % | — |
| **PAL-01** Os 44 tokens de cor exportados declarados | Paleta "Comunidade" | MP 246-291 + conecta-tokens.css: clara | 44/44 | 100 % | — |
| **PAL-02** Primária #d6336c nas ações principais | Paleta | MP 248, 381: clara | Entrar, + Novo, Ver publicação, Editar perfil e Sair = #d6336c | 100 % | — |
| **PAL-03** Fundo #fff/#f6f6f6 e texto #1b1b1f | Paleta | MP 257-261: clara | body #f6f6f6 (bgAlt, E) / #1b1b1f | 100 % | — |
| **PAL-04** Tokens de navegação (navBg/navText/navActive/navActiveText) | Paleta | MP 286-289: clara | inativo #4d4d50; ativo #bc2d5f sobre #fae7ed | 100 % | — |
| **PAL-05** Inter, base 15 px, títulos 650 | Tipografia padrão "Inter + Inter" | MP 297-309 contra MP 382-385 ("Fonte do sistema 500", 14 px): contraditória (C6) | Inter 15 px; títulos 650 também nos cards (leitura global, D documentado) | 100 % | — |
| **PAL-06** Raios: global 6/8/12 px; componentes 20/12 px | Geometria "Médios (8 px)" + família MM | MP 327-329 e 376-377: duas escalas, sem limite de escopo explícito | Botões dos componentes 20 px; cards 12 px; botões globais 8 px | 100 % | — |
| **PAL-07** Sombra/borda: sem sombra nas superfícies de conteúdo; elevação só no que flutua | Geometria "Contornada / Sem sombra" + família MM | MP 319/323 contra MP 378-379: contraditória (C6) | Cards sem borda e sem sombra; elevação no dock, no drawer e nos popovers | 100 % | — |
| **PAL-08** Superfície dos componentes tingida (#fef8fa) | Família MM | MP 380, 394: clara | #fef8fa em cards, perfil e drawer; dock ≈#fbeff3 | 100 % | — |
| **PAL-09** Foco: anel de 2-3 px em focusRing #d6336c | Estados globais | MP 214, 342, 409: clara | 2 px sólido #d6336c + halo | 100 % | — |
| **PAL-10** Sem cores fixas espalhadas (tokens centralizados) | (regra geral) | MP 235, 695: clara | 0 literais fora de :root | 100 % | — |
| **COMP-01** Card: mídia 16/9 → etiqueta → título → texto (3 linhas) → rodapé | Componente Cards "Card de conteúdo do feed" | MP 357: clara | 5/5; mídia 1,78; clamp de 3 linhas | 100 % | — |
| **COMP-02** Card MM: contêiner de 12 px; "Ver publicação" em pílula primária | Componente Cards (MM) | MP 371, 376-381: clara | 12 px; pílula de 20 px #d6336c | 100 % | — |
| **COMP-03** Card com link estendido, sem botões aninhados | Componente Cards | MP 358: clara | ::after do "Ver publicação"; botão Salvar irmão acima (z-index); 0 aninhamentos | 100 % | — |
| **COMP-04** Perfil: capa → avatar −50 % → nome/cargo → ações → 3 estatísticas → abas | Componente "Perfil do usuário" (MM) | MP 433, 446-448: clara (abas sem rótulos; "Seguir" × "Editar perfil" ambíguo) | 7/7; avatar sobreposto em 50 %; abas Publicações/Fotos/Sobre | 100 % | — |
| **COMP-05** Perfil no celular: centralizado, 3 colunas, ações em largura total | Componente Perfil | MP 490: clara | Centralizado; 3 colunas; ações com 326 px (largura total) | 100 % | — |
| **COMP-06** Drawer: dialog/aria-modal, título "Menu", ✕, corpo rolável, rodapé "Sair da conta" | Componente "Drawer lateral aberto pelo header" | MP 505-519: clara | dialog + aria-modal; "Menu"; ✕; corpo com overflow auto; "Sair da conta" em pílula | 100 % | — |
| **COMP-07** Drawer com configurações, ajuda e conta | Layout mobile | MP 165: clara | Conta + Comunidade + Meu perfil/Configurações/Ajuda | 100 % | — |
| **COMP-08** Dock na família MM (ícone + rótulo, pílula, elevação) | Componente Dock (MM) | MP 582-599: clara | Ícone + rótulo, pílula, superfície tingida, sombra | 100 % | — |
| **COMP-09** Login: "Entrar", subtítulo, E-mail\|Telefone, campos de 56 px, "Esqueci minha senha" | Login "Acesso responsivo" | MP 25-42: clara | 5/5 | 100 % | — |
| **COMP-10** Login: "Entrar" fixo na base no celular; painel com instruções no desktop | Login "Acesso responsivo" | MP 29-30, 46: clara | Sticky na base; painel de passos à direita no desktop | 100 % | — |
| **COMP-11** Cadastro na mesma tela: abas, Nome/E-mail/Senha, checklist, termos | Cadastro "mesma tela" | MP 63-72: clara | 5/5 | 100 % | — |
| **COMP-12** Topbar do celular com ☰, marca e busca | Layout mobile + header | MP 146, 224: clara (MP 228/674 pedem também a "ação principal"; MP 224 não a lista) | ☰, marca, busca, "+" e avatar | 100 % | — |
| **INT-01** Ao abrir o drawer, foco em "Fechar" sem rolar a página | Layout mobile | MP 166: clara | Foco em "Fechar menu"; rolagem preservada (1000 → 1000) | 100 % | — |
| **INT-02** Fecha com Esc, scrim e ✕; foco volta ao ☰ | Layout + Drawer | MP 166, 553: clara | Esc, clique e toque no scrim e ✕ fecham; foco volta | 100 % | — |
| **INT-03** Foco preso; fundo inert/aria-hidden | Layout mobile | MP 166, 240: clara | 21/21; #shell com inert e aria-hidden | 100 % | — |
| **INT-04** Body não rola; drawer com overscroll contain | Layout mobile | MP 167: clara | html overflow hidden (equivalente); overscroll contain | 100 % | — |
| **INT-05** Dock troca destino e item ativo | Componente Dock | MP 173: clara | 4/4; aria-current acompanha | 100 % | — |
| **INT-06** Stories rolam na horizontal; itens focáveis | Layout mobile | MP 147: clara (comportamento do toque não especificado) | Rolagem ok; visualizador com progresso e pausa (extra, E) | 100 % | — |
| **INT-07** Card: foco visível no link principal | Componente Cards | MP 407-409: clara | Anel visível | 100 % | — |
| **INT-08** Perfil: abas trocam conteúdo sem recarregar | Componente Perfil | MP 480: clara | Troca sem recarregar | 100 % | — |
| **INT-09** Login: validação, resumo role=alert, erro genérico, aria-pressed, "Entrando…" | Login | MP 38-43: clara | 5/5 | 100 % | — |
| **INT-10** Cadastro: mantém e-mail, ?aba=cadastro, checklist ao digitar | Cadastro | MP 79, 81: clara | 3/3 | 100 % | — |
| **INT-11** Desktop: popover de notificações (320 px) e menu do avatar; Esc e clique fora | Header | MP 217-218, 239: clara | 320 px + "Ver todas"; menu do avatar com os itens pedidos; Esc e clique fora fecham | 100 % | — |
| **INT-12** Busca: Esc limpa e tira o foco | Header | MP 216: clara | Esc limpa e tira o foco; Enter → #/explorar?q= | 100 % | — |
| **INT-13** Login de demonstração entra; "Sair" volta ao login | (fluxo) | MP 17: clara | Entra e sai | 100 % | — |
| **INT-14** prefers-reduced-motion respeitado | (regra geral) | MP 671: clara | Presente | 100 % | — |

### Matriz dev-3

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---|---|
| **ARQ-01** Fluxo "Apenas login" (abre direto em Entrar) | Entrada "Apenas login" | MP 17: clara | Abre em Entrar; sem landing | 100 % | — |
| **ARQ-02** Celular: topbar fixa com ☰ à esquerda | Layout mobile "Stories com dock e drawer lateral" | MP 146, 152, 227: clara | sticky top 0; ☰ 44×44 em x=8; sempre visível | 100 % | — |
| **ARQ-03** Celular: faixa de stories logo abaixo da topbar, com rolagem horizontal | Mesmo layout (stories: sim) | MP 147, 156, 232: clara no celular; não diz se a faixa aparece em todas as telas nem se é fixa | Gap 0, overflow-x auto, 5 stories; fixa dentro do header em todas as telas | 100 % | — |
| **ARQ-04** Celular: dock com Início/Explorar/Salvos/Perfil, sem FAB | Layout + componente "Menu inferior flutuante arredondado (dock)", FAB: não | MP 148, 176, 594-596: clara; resíduo contraditório "navigation bar + FAB" em MP 418/491/564/639 | 4 rótulos exatos; nenhum FAB | 100 % | — |
| **ARQ-05** Celular: drawer esquerdo aberto pelo ☰ da topbar | Layout (drawer-left) + componente Drawer (Lado: Esquerda) + 2 observações | MP 149, 232, 568: clara graças às observações; resíduo contraditório MP 224-225 | ☰ abre drawer à esquerda | 100 % | — |
| **ARQ-06** Celular: dock não trocado por bottom navigation encostada nas bordas | Dock flutuante | MP 143, 148: "flutuante", sem medida de afastamento | Dock destacado das bordas | 100 % | — |
| **ARQ-07** Desktop: topbar integral fixa, sem sidebar, conteúdo ≤ ≈1200 px | "Topbar integral fixa" (Sem sidebar) | MP 105-118, 126: clara | Barra de 1200 px centralizada; conteúdo de 1200 px; sem sidebar | 100 % | — |
| **ARQ-08** Desktop: header "Praça da Comunidade" A (logo, 4 abas no centro, busca, + Novo, sino, avatar) | Header "Praça da Comunidade" · Composição A | MP 192-203: clara | 7/7; nav deslocada 161 px à esquerda do centro (grid auto 1fr auto; NOTES 13) | 85 % | C |
| **ARQ-09** Corte de arquitetura em 768 px | Duas arquiteturas independentes | MP 133, 172, 224 (768) contra MP 180 (600): contraditória, mas 768 domina | 767 = celular; 768 = desktop compacto | 100 % | — |
| **ARQ-10** Mesmos destinos de navegação no desktop e no celular | Sem mecanismo no Studio (LACUNA parcial) | MP 181 contradito por MP 195 e 594 (C4): contraditória | Manteve as listas (NOTES 2): no desktop não há link para Salvos, Explorar (só a busca → #/busca) nem Conta | 60 % | B |
| **ARQ-11** Marca "Conecta" no header e no login | Nome do projeto "Conecta" | MP 8, 194 ("substitua pela marca real"): clara | "Conecta" com monograma "C" | 100 % | — |
| **CEL-01** Topbar com ≈56 px | Layout mobile | MP 146, 207: clara | 56 px | 100 % | — |
| **CEL-02** Topbar soma safe-area-inset-top | Layout mobile | MP 146: clara | .topo-movel usa env(safe-area-inset-top) | 100 % | — |
| **CEL-03** Faixa de stories com ≈88 px | Layout mobile | MP 147, 160: clara | 88 px | 100 % | — |
| **CEL-04** Dock com ≈64 px | Layout mobile | MP 148, 161: clara | 64 px | 100 % | — |
| **CEL-05** Dock flutuante: afastado das bordas (Studio: 17/17/33 px) | Dock flutuante | MP 148: só "flutuante" (afastamento não exportado) | 12/12/12 px (a 390, 360 e 320) | 100 % | — |
| **CEL-06** Dock arredondado (Studio: raio de 24 px) | Só pelo nome e pela família (LACUNA parcial) | MP 376/597 (raio 20 px da família) + nome MP 644: indireta | 20 px | 100 % | — |
| **CEL-07** Dock respeita safe-area-inset-bottom | Componente Dock | MP 638, 667: clara | .dock usa safe-area-inset-bottom | 100 % | — |
| **CEL-08** Item ativo do dock em pílula tonal + aria-current | Família MM (indicador tonal) | MP 173, 389, 586: clara | Pílula 56×30 #fae7ed, texto #bc2d5f, aria-current | 100 % | — |
| **CEL-09** Drawer com ≈280 px, máx. 85 % | Layout + observação no Drawer | MP 149, 170, 568: clara; resíduo MP 547/563 (360-420 px, 88vw) | 280 px (390 e 360); 272 px a 320 (85 %) | 100 % | — |
| **CEL-10** Drawer em altura total, sobre topbar e dock, com scrim | Layout + Drawer (escurecer fundo: sim) | MP 149, 520: clara | x 0, y 0, altura = viewport; scrim .4 cobre topbar e dock | 100 % | — |
| **CEL-11** Conteúdo não fica escondido atrás do dock | (regra geral) | MP 661, 667: clara | Último conteúdo termina em 733 px; o dock começa em 768 px | 100 % | — |
| **CEL-12** Sem overflow horizontal de 320 a 767 px | (regra geral) | MP 50, 659: clara | 0 overflow (9 larguras × login + 4 rotas) | 100 % | — |
| **CEL-13** Alvos de toque ≥ 44 × 44 px | (regra geral + família MM) | MP 211, 386, 662: clara | "Ver publicação" e "Editar perfil" com 40 px, marca 32 px, links de título/autor com 16-21 px, "Ver perfil" 40 px: mais de 6 alvos | 50 % | C |
| **CEL-14** Paisagem: stories recolhem; dock com ≈52 px | Layout mobile | MP 171: "recolhem" é ambíguo (esconder ou compactar) | 667×375: stories continuam com 88 px (a regra prometida no CSS e no NOTES 8 não existe); dock 52 px | 50 % | C |
| **CEL-15** Paisagem: barras fixas ≤ 25 % da altura | (regra geral) | MP 668: clara (conflita com 56 + 52 px de MP 146/171 em telas baixas) | Header fixo de 136 px (48 + 88) + dock de 52 px = 188 px = 50 % da altura | 25 % | C |
| **CEL-16** Nenhum texto cortado | (regra geral) | MP 660: clara | Nenhum corte | 100 % | — |
| **CEL-17** Inputs ≥ 16 px e ≥ 48 px no celular | Login "Acesso responsivo" | MP 48, 663: clara | 56 px / 16 px | 100 % | — |
| **DESK-01** Header desktop de 60 a 64 px | Header + layout desktop | MP 192/206 (60) contra MP 108/122 (64): contraditória, ambas aceitas | 64 px + 1 de borda | 100 % | — |
| **DESK-02** Header sticky, fundo navBg, borda inferior de 1 px | Header | MP 126, 193, 215: clara | sticky; #fff; borda de 1 px #e6e6e6 | 100 % | — |
| **DESK-03** Sombra suave após 8 px de rolagem | Header | MP 215: clara | none → 0 2px 8px | 100 % | — |
| **DESK-04** Ativo com sublinhado de 2 px primário + aria-current | Header | MP 195, 214, 236: clara | ::after de 2 px #d6336c na base; aria-current | 100 % | — |
| **DESK-05** Busca ≈220 × 36 px, "Buscar…", cresce para 300 px | Header | MP 196, 216: clara | Campo de 220 px (input 166×34) → 300 px | 100 % | — |
| **DESK-06** Logo: monograma circular de 32 px + nome | Header | MP 194: clara | Círculo de 32 px + "Conecta" | 100 % | — |
| **DESK-07** 1024-1279 px: espaço de 16 px, busca de 180 px, links visíveis | Header + layout | MP 222 (só compacta) contra MP 131 ("Mais"): ambígua | A 1024 px: busca de 180 px; 4 links visíveis; sem "Mais" | 100 % | — |
| **DESK-08** 768-1023 px: navegação em ☰/"Menu" com painel de largura total abaixo do header | Header + layout | MP 132, 223: clara | ☰ à direita abre painel de largura total em y=64 | 100 % | — |
| **DESK-09** Sem overflow de 768 a 1920 px | (regra geral) | MP 659: clara | 0 overflow | 100 % | — |
| **DESK-10** Grade de cards reduz colunas; altura pelo conteúdo | Componente Card | MP 417, 419: clara | 3 → 2 → 1 colunas | 100 % | — |
| **PAL-01** Os 44 tokens de cor exportados declarados | Paleta "Comunidade" | MP 246-291 + conecta-tokens.css: clara | 44/44 | 100 % | — |
| **PAL-02** Primária #d6336c nas ações principais | Paleta | MP 248, 381: clara | Entrar, + Novo, Ver publicação, Editar perfil e Sair = #d6336c | 100 % | — |
| **PAL-03** Fundo #fff/#f6f6f6 e texto #1b1b1f | Paleta | MP 257-261: clara | body #fff / #1b1b1f | 100 % | — |
| **PAL-04** Tokens de navegação (navBg/navText/navActive/navActiveText) | Paleta | MP 286-289: clara | inativo #4d4d50; ativo #bc2d5f sobre #fae7ed | 100 % | — |
| **PAL-05** Inter, base 15 px, títulos 650 | Tipografia padrão "Inter + Inter" | MP 297-309 contra MP 382-385 ("Fonte do sistema 500", 14 px): contraditória (C6) | Inter 15 px; h1 650; títulos dos componentes 500 e texto 14 px (D documentado) | 100 % | — |
| **PAL-06** Raios: global 6/8/12 px; componentes 20/12 px | Geometria "Médios (8 px)" + família MM | MP 327-329 e 376-377: duas escalas, sem limite de escopo explícito | Pílula de 20 px também nos botões globais (Entrar, + Novo), contra os 8 px da geometria global | 75 % | D |
| **PAL-07** Sombra/borda: sem sombra nas superfícies de conteúdo; elevação só no que flutua | Geometria "Contornada / Sem sombra" + família MM | MP 319/323 contra MP 378-379: contraditória (C6) | Cards sem borda e sem sombra; elevação no dock e nos popovers | 100 % | — |
| **PAL-08** Superfície dos componentes tingida (#fef8fa) | Família MM | MP 380, 394: clara | Cards, drawer e dock em #fef8fa; perfil sem contêiner tingido (fundo transparente) | 75 % | C |
| **PAL-09** Foco: anel de 2-3 px em focusRing #d6336c | Estados globais | MP 214, 342, 409: clara | 2 px sólido #d6336c + halo | 100 % | — |
| **PAL-10** Sem cores fixas espalhadas (tokens centralizados) | (regra geral) | MP 235, 695: clara | 11 rgba() fixos fora de :root (sombras, scrim, halo de foco) | 75 % | C |
| **COMP-01** Card: mídia 16/9 → etiqueta → título → texto (3 linhas) → rodapé | Componente Cards "Card de conteúdo do feed" | MP 357: clara | 5/5; mídia 1,78; clamp de 3 linhas; textos de exemplo repetidos em todos os cards (NOTES 10) | 100 % | — |
| **COMP-02** Card MM: contêiner de 12 px; "Ver publicação" em pílula primária | Componente Cards (MM) | MP 371, 376-381: clara | 12 px; pílula de 20 px #d6336c | 100 % | — |
| **COMP-03** Card com link estendido, sem botões aninhados | Componente Cards | MP 358: clara | ::after no link do título; 0 aninhamentos | 100 % | — |
| **COMP-04** Perfil: capa → avatar −50 % → nome/cargo → ações → 3 estatísticas → abas | Componente "Perfil do usuário" (MM) | MP 433, 446-448: clara (abas sem rótulos; "Seguir" × "Editar perfil" ambíguo) | Avatar sobreposto em só 33 %; abas sublinhadas em vez de pílula tonal; abas Publicações/Sobre | 85 % | C |
| **COMP-05** Perfil no celular: centralizado, 3 colunas, ações em largura total | Componente Perfil | MP 490: clara | Centralizado; 3 colunas; ação com 358 px (largura total) | 100 % | — |
| **COMP-06** Drawer: dialog/aria-modal, título "Menu", ✕, corpo rolável, rodapé "Sair da conta" | Componente "Drawer lateral aberto pelo header" | MP 505-519: clara | dialog + aria-modal; "Menu"; ✕; corpo com overflow auto; "Sair da conta" em pílula | 100 % | — |
| **COMP-07** Drawer com configurações, ajuda e conta | Layout mobile | MP 165: clara | Grupos, Eventos, Mensagens, Notificações, Configurações, Ajuda, Conta | 100 % | — |
| **COMP-08** Dock na família MM (ícone + rótulo, pílula, elevação) | Componente Dock (MM) | MP 582-599: clara | Ícone + rótulo, pílula, superfície tingida, sombra | 100 % | — |
| **COMP-09** Login: "Entrar", subtítulo, E-mail\|Telefone, campos de 56 px, "Esqueci minha senha" | Login "Acesso responsivo" | MP 25-42: clara | 5/5 | 100 % | — |
| **COMP-10** Login: "Entrar" fixo na base no celular; painel com instruções no desktop | Login "Acesso responsivo" | MP 29-30, 46: clara | Fixo na base; instruções à esquerda no desktop | 100 % | — |
| **COMP-11** Cadastro na mesma tela: abas, Nome/E-mail/Senha, checklist, termos | Cadastro "mesma tela" | MP 63-72: clara | 5/5 + etapa de código de confirmação (extra, E) | 100 % | — |
| **COMP-12** Topbar do celular com ☰, marca e busca | Layout mobile + header | MP 146, 224: clara (MP 228/674 pedem também a "ação principal"; MP 224 não a lista) | ☰, marca, busca, avatar (sem ação principal: observação B) | 100 % | — |
| **INT-01** Ao abrir o drawer, foco em "Fechar" sem rolar a página | Layout mobile | MP 166: clara | Foco em "Fechar menu"; rolagem preservada (1000 → 1000) | 100 % | — |
| **INT-02** Fecha com Esc, scrim e ✕; foco volta ao ☰ | Layout + Drawer | MP 166, 553: clara | Esc, clique e toque no scrim e ✕ fecham; foco volta | 100 % | — |
| **INT-03** Foco preso; fundo inert/aria-hidden | Layout mobile | MP 166, 240: clara | 21/21; #app com inert e aria-hidden | 100 % | — |
| **INT-04** Body não rola; drawer com overscroll contain | Layout mobile | MP 167: clara | body overflow hidden; corpo do drawer com overscroll contain | 100 % | — |
| **INT-05** Dock troca destino e item ativo | Componente Dock | MP 173: clara | 4/4; aria-current acompanha | 100 % | — |
| **INT-06** Stories rolam na horizontal; itens focáveis | Layout mobile | MP 147: clara (comportamento do toque não especificado) | overflow-x auto com 5 stories (10 px de excesso); focáveis; toque abre o perfil (não especificado, E) | 100 % | — |
| **INT-07** Card: foco visível no link principal | Componente Cards | MP 407-409: clara | Anel visível | 100 % | — |
| **INT-08** Perfil: abas trocam conteúdo sem recarregar | Componente Perfil | MP 480: clara | Troca sem recarregar | 100 % | — |
| **INT-09** Login: validação, resumo role=alert, erro genérico, aria-pressed, "Entrando…" | Login | MP 38-43: clara | 5/5 | 100 % | — |
| **INT-10** Cadastro: mantém e-mail, ?aba=cadastro, checklist ao digitar | Cadastro | MP 79, 81: clara | 3/3 | 100 % | — |
| **INT-11** Desktop: popover de notificações (320 px) e menu do avatar; Esc e clique fora | Header | MP 217-218, 239: clara | 320 px + "Ver todas"; menu do avatar com os itens pedidos; Esc e clique fora fecham | 100 % | — |
| **INT-12** Busca: Esc limpa e tira o foco | Header | MP 216: clara | Esc limpa e tira o foco; Enter → #/busca?q= | 100 % | — |
| **INT-13** Login de demonstração entra; "Sair" volta ao login | (fluxo) | MP 17: clara | Entra e sai | 100 % | — |
| **INT-14** prefers-reduced-motion respeitado | (regra geral) | MP 671: clara | Presente | 100 % | — |


## 4. Itens do briefing fora da nota (perda do Studio, origem A)

| Item | dev-1 | dev-2 | dev-3 | Leitura |
|---|---|---|---|---|
| BR-01 Stories no desktop | Sim, no Feed, abaixo do header | Sim, em todas as telas | Não | O MP não diz nada (A). Cada um adivinhou. |
| BR-02 Mobile-first | CSS com 9 `min-width` / 10 `max-width`; celular completo | 12 / 19 | 11 / 3 (o mais mobile-first no CSS) | Não verificável como requisito: só texto livre (A) e MP 179 contrário. |
| BR-03 Desktop coerente | Destinos unificados | Destinos unificados ("Mais") | Destinos divergentes | Ver ARQ-10 (B). |
| BR-04 Drawer no desktop | Não (menu do avatar; painel "Menu" no tablet) | Não ("Mais" e painel no tablet) | Não (painel no tablet) | O header escolhido não tem ☰ acima de 1024 px. Os três foram coerentes com isso. |

## 5. Comparação entre os três sites

**O que os três acertaram** (instruções claras chegaram íntegras):

- A arquitetura mobile inteira:
  - topbar sticky de 56 px com ☰ à esquerda e safe-area-top;
  - faixa de stories colada (gap 0) com rolagem horizontal;
  - dock fixo de 64 px, afastado 12–16 px das bordas, raio ≥ 20 px, 4 destinos exatos, sem FAB, pílula tonal + `aria-current`;
  - drawer de 280 px (272 px a 320) em altura total, sobre topbar e dock, com scrim;
  - foco em "Fechar", foco preso, `inert` no fundo, Esc/scrim/✕ e retorno do foco.
- Conteúdo nunca fica atrás do dock. Corte em 768 px. Nenhum overflow em 16 larguras × 5 telas.
- Header desktop "Praça da Comunidade" com os 7 elementos, sticky, sombra após rolar, sublinhado de 2 px, busca 220 → 300 px, popovers de 320 px, menu do avatar e Esc/clique fora.
- Login "Acesso responsivo" e cadastro "mesma tela" completos: validação ARIA, erro genérico, "Entrando…", `?aba=cadastro`, checklist, termos.
- Os 44 tokens declarados. Primária nas ações. Inter 15 px. Foco de 2 px em `focusRing`. `prefers-reduced-motion`.
- As três observações do usuário (FAB, painel × drawer, largura do drawer) funcionaram: **nenhum** site caiu no painel de largura total, no drawer de 360–420 px nem em navigation bar com FAB.

**Onde divergiram** (indício de ambiguidade do prompt):

| Decisão | dev-1 | dev-2 | dev-3 | Causa no prompt |
|---|---|---|---|---|
| Destinos desktop × celular | União, mapeada | União (via "Mais") | Listas separadas (perde Salvos/Explorar/Conta no desktop) | B1 (MP 181 × 195/594) |
| Altura do header desktop | 60 px | 64 px | 64 px | B6 (MP 192/206 × 108/122) |
| Item "Mais" | Dinâmico (só se não couber) | Sempre (Explorar/Salvos) e engole "Eventos" a 1024 | Nunca | B7 (MP 131 × 222) |
| Escopo da faixa de stories | Só no Feed (celular e desktop) | Todas as telas, rola com a página, também no desktop | Todas as telas, fixa no header, só no celular | B10 + A1 |
| "Stories recolhem" na paisagem | Compacta (65 px, sem nomes) | Esconde | Diz que esconde, mas não esconde (C) | B11 |
| Tipografia dos componentes | 500 / 14 px (família) | 650 / 15 px (global) | 500 / 14 px (família) | D1 (C6) |
| Raio dos botões globais | 8 px | 8 px | 20 px (pílula em tudo) | D1 |
| Textos de exemplo dos cards | Só no 1º card | Nenhum (conteúdo variado) | Todos os cards iguais | B8 |
| "+ Novo" no celular | Botão "+" | Botão "+" | Ausente | B12 (MP 224 × 228/674) |
| Abas do perfil | Publicações/Mídia/Sobre | Publicações/Fotos/Sobre | Publicações/Sobre | B13 |
| Toque num story | Visualizador | Visualizador com progresso | Abre o perfil | Não especificado (E) |
| Paisagem 844 × 390 (iPhone deitado) | Header de tablet, sem dock | Header de tablet, sem dock | Header de tablet, sem dock | D/B11: o corte por largura (768) torna a regra "Horizontal: dock ≈52 px" inalcançável em celulares com ≥ 768 px de largura deitados. Os três foram coerentes entre si. |

**Todos divergiram igualmente da prévia aprovada** (falha do prompt, não dos desenvolvedores):

- "+ Novo" primário em vez de neutro;
- contadores magenta em vez do `accent` laranja;
- monograma magenta em vez de escuro;
- dock tingido em vez de branco.

O MP não carrega esses detalhes (B9).

## 6. Falhas por tipo

Contagem das falhas **pontuadas** nas matrizes:

| Origem | dev-1 | dev-2 | dev-3 | Total |
|---|---|---|---|---|
| A | 0 | 0 | 0 | 0 |
| B | 0 | 1 | 1 | 2 |
| C | 3 | 2 | 7 | 12 |
| D | 0 | 0 | 1 | 1 |

Contagem na **cadeia Studio → prompt** (afetam os três sites, fora da nota): **A = 4, B = 13, D = 5**. Diferenças aceitáveis registradas: **E = 15** (5 por site).

### 6.1 Falhas A (Studio: escolha não registrada ou não exportada)

| # | Falha | Evidência | Efeito nos sites |
|---|---|---|---|
| A1 | Sem opção de stories no desktop | `escolhas.md` (LACUNA parcial) | Cada site decidiu sozinho (BR-01) |
| A2 | Sem opção "mobile-first/prioridade do celular" | `escolhas.md`; MP 179 diz o contrário | Nenhuma regra operacional |
| A3 | Sem mecanismo para alinhar os destinos do header desktop aos do dock (itens do header não editáveis) | `relatorio.md` C4 | Origem de B1 |
| A4 | Geometria do dock não exportada: afastamento (Studio 17/33 px), raio (24 px), superfície branca e sombra só existem na prévia; "arredondado" é só o nome | MP 148, 575; `scripts/out/studio-modelo.txt` | Os três acertaram por inferência (12–16 px; 20–999 px), mas sem garantia |

### 6.2 Falhas B (Master Prompt: registrado, mas ambíguo, incompleto ou contraditório), com redação sugerida

| # | Trecho atual | Problema / efeito | Redação corrigida sugerida |
|---|---|---|---|
| B1 | MP 181 "As regiões (header, sidebar, conteúdo, painéis) mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões." | Contradiz MP 195 (Feed, Grupos, Eventos, Mensagens) e 594 (Início, Explorar, Salvos, Perfil). dev-3 perdeu Salvos/Explorar/Conta no desktop (ARQ-10). | "Destinos: desktop = header (Feed, Grupos, Eventos, Mensagens) + menu do avatar (Meu perfil, **Salvos**, Configurações, Ajuda, Sair) + busca (leva a **Explorar**). Celular = dock (Início = Feed, Explorar, Salvos, Perfil) + drawer (Grupos, Eventos, Mensagens, Notificações, Configurações, Ajuda, Conta). Todo destino deve existir nas duas versões." |
| B2 | MP 418/491/564/639 "No celular, use navigation bar inferior com pílula ativa e FAB acima dela…" e MP 363/438/511/587 "ações flutuantes (FAB)" | Texto genérico da família mantido apesar de "FAB: não" e da observação MP 176. Todos precisaram arbitrar. | Retirar essas linhas quando o projeto tem layout mobile próprio, ou trocar por: "No celular, a navegação inferior é a definida no layout mobile (dock flutuante, sem FAB)." |
| B3 | MP 224–225 "Abaixo de 768 px: … Vão para o painel do menu… Painel do menu: desliza logo abaixo do header em largura total…" | Contradiz o layout e só foi neutralizado pela observação MP 232. | "Abaixo de 768 px o header segue o layout mobile escolhido: ☰ à esquerda abre o **drawer lateral esquerdo** (≈280 px); os 4 itens de navegação vão para o drawer." |
| B4 | MP 547 "largura: 360–420 px"; MP 563 "até 88vw … ou bottom sheet" | Resíduo do componente genérico × MP 149/568. | "Largura: ≈280 px, máx. 85 % da viewport (definida pelo layout mobile)." Remover a alternativa bottom sheet. |
| B5 | MP 180 "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber (sidebar recolhida em rail…)" | Corte diferente (600 × 768) e cita uma sidebar inexistente. | "Até 767 px vale o layout mobile; de 768 a 1023 px, o desktop compactado (links recolhidos no botão 'Menu'); a partir de 1024 px, o desktop completo." |
| B6 | MP 108/122 "64px" × MP 192/206 "60 px" | Três sites, dois valores. | Um valor único: "Header desktop: 60 px (o header escolhido prevalece sobre a medida genérica do layout)." |
| B7 | MP 131 "links excedentes vão para um item 'Mais'" × MP 222 "o espaço entre itens cai para 16 px e a busca encolhe para 180 px" | Três interpretações. dev-2 esconde "Eventos" a 1024 (DESK-07). | "De 1024 a 1279 px os 4 links continuam visíveis (espaço de 16 px, busca de 180 px). Use 'Mais' só se, com fonte ampliada, algum link não couber." |
| B8 | MP 368–372 "Título: Publicação da comunidade / Texto: … / Etiqueta: Novo / Ícone: Avião" | Parecem conteúdo obrigatório. dev-3 repetiu em todos os cards. | "Textos de exemplo (substitua por conteúdo real e variado): …"; "Ícone: (só se houver lugar na estrutura)". |
| B9 | MP 197 "Ações: botão '+ Novo'; sino de notificações com contador…" | Não diz a variante visual aprovada (botão neutro `surfaceAlt`, contadores em `accent`, monograma em `text`, busca preenchida). Os três divergem da prévia da mesma forma. | "'+ Novo': botão secundário neutro (fundo surfaceAlt, texto text); contadores em accent/onAccent; monograma com fundo text e inicial em bg; busca preenchida (surfaceAlt, sem borda)." |
| B10 | MP 147 "Faixa de stories de ≈88 px abaixo da topbar" | Não diz em que telas aparece, se é fixa nem o que fazer no desktop. Três respostas diferentes. | "A faixa de stories aparece só no Feed, logo abaixo da topbar, e rola com o conteúdo (não é fixa). No desktop, a faixa fica no topo do Feed, dentro do container de 1200 px." (ou a decisão oposta, desde que explícita) |
| B11 | MP 171 "Horizontal: stories recolhem; dock com ≈52 px" + MP 172 "A partir de 768 px passa a valer a arquitetura desktop" | "Recolhem" é ambíguo. A regra também é inalcançável num celular comum deitado (844 × 390 ≥ 768 → desktop). | "Celular na horizontal (altura ≤ 500 px, qualquer largura até 932 px): mantenha o layout mobile; a faixa de stories fica oculta, a topbar deixa de ser fixa e o dock fica com 52 px." |
| B12 | MP 224 "barra única de 56 px com logo, ícone de busca, avatar, botão de menu ☰" × MP 228/674 "o logo e a ação principal continuam visíveis" | dev-3 não tem ação de criar no celular. | Incluir "botão '+' (Novo, só ícone, 44 × 44 px)" na lista da barra mobile, ou dizer explicitamente que a ação principal fica no drawer. |
| B13 | MP 445 "Botão: Seguir" × MP 480 "Editar perfil abre formulário"; abas sem rótulo | Resolvido igual pelos três, mas por dedução; abas com nomes diferentes. | "Perfil próprio: 'Editar perfil' (primária) + 'Compartilhar'. Perfil de outra pessoa: 'Seguir/Seguindo' + 'Mensagem'. Abas: Publicações, Mídia, Sobre." |

Falha B pontuada nas matrizes: **DESK-07** de dev-2 (B7) e **ARQ-10** de dev-3 (B1). Ruído menor, sem efeito medido: MP 109 "busca e ações/carrinho à direita" (texto genérico de loja), ignorado pelos três.

### 6.3 Falhas C (desenvolvedor: instrução clara não respeitada)

| Site | Requisito | Instrução clara | Resultado |
|---|---|---|---|
| dev-3 | **CEL-15** | MP 668 "barras fixas não podem ocupar mais de 25 % da altura" | 667 × 375: header fixo de 136 px (topbar 48 + stories 88) + dock 52 = **50 %** da altura (`composicoes/paisagem-667x375.png`) |
| dev-3 | **CEL-14** | MP 171 "Horizontal: stories recolhem" | Stories continuam com 88 px. O CSS tem o comentário "stories recolhidos" e o NOTES 8 diz "Em paisagem as stories são recolhidas", mas a regra não existe (`css/conteudo.css` linhas 573–590) |
| dev-3 | **CEL-13** | MP 386 "mínimo 44 px de área de toque no celular", MP 662 | "Ver publicação" e "Editar perfil" com 40 px, marca com 32 px, links de 16–21 px |
| dev-3 | COMP-04 | MP 433 "avatar (sobreposto −50 %)", MP 437/462 "Item ativo em pílula tonal / Indicador de ativo: tonal" | Sobreposição de 33 %; abas sublinhadas |
| dev-3 | PAL-08 | MP 434 "Superfícies 'container' = superfície misturada à primária" | Perfil sem contêiner tingido |
| dev-3 | PAL-10 | MP 695 "nada de cores fixas espalhadas" | 11 `rgba()` fixos fora de `:root` (valores derivados dos tokens) |
| dev-2, dev-3 | ARQ-08 | MP 198 "A 'Ícones no centro' = … navegação centralizada na barra … (grid 1fr auto 1fr)" | Nav deslocada 166/161 px do centro a 1440 px. Os NOTES (dev-2 NOTES 3, dev-3 NOTES 13) alegam falta de espaço, mas dev-1 centraliza a ±57 px a 1280/1440. Atenuante: a 1024 px a limitação é real (dev-1 também fica a 117 px). |
| dev-1, dev-2 | CEL-16 | MP 660 "Nenhum texto cortado: use quebra de linha…" | Prévias de conversa em Mensagens com reticências, de 320 a 430/480 px (lista não especificada; impacto baixo) |
| dev-1 | CEL-13 | MP 662 | 4 links de nome de autor com 19 px de altura nos cards |
| dev-1 | COMP-05 | MP 490 "ações em largura total" | "Editar perfil" e "Compartilhar" lado a lado (2 × 159 px) |

### 6.4 Falhas D (conflito ou limitação da especificação)

| # | Conflito | Efeito |
|---|---|---|
| D1 | Identidade global (Inter 15 px/650, cantos de 8 px, "contornada", "sem sombra") × família MM (fonte do sistema 500, 14 px, raio de 20/12 px, "sem borda", "elevação tonal"). MP 297–335 × 376–389 (C6). | Tipografia dos cards divergente (dev-2 650/15 × dev-1 e dev-3 500/14). dev-3 aplicou a pílula também aos botões globais (PAL-06, pontuada como D). |
| D2 | Paisagem: "barras fixas ≤ 25 %" (MP 668) × topbar de 56 + dock de 52 (MP 146/171) | dev-1 e dev-2 tiraram a fixação da topbar (solução correta e registrada). dev-3 não. |
| D3 | "Texto até 3 linhas" (MP 357) × "Nenhum texto cortado" (MP 660) | Os três aplicaram o clamp de 3 linhas, com o texto completo na publicação. Aceito. |
| D4 | Foco "anel de 3 px … a 35 %" (MP 409) × "anel de 2–3 px … sempre visível" (MP 342) | Os três somaram anel sólido + halo. Aceito. |
| D5 | Login: "Entrar" fixo e campos de 56 px (MP 35/46) × cadastro: botão não fixo e campos de 44/48 px (MP 75/92), na mesma tela | Os três aplicaram cada regra na sua aba. Aceito. |

### 6.5 Diferenças aceitáveis (E), com nota 100 %

| Site | Diferenças |
|---|---|
| dev-1 | "Salvos" a mais no menu do avatar, para manter o destino no desktop; visualizador de stories; topbar que se esconde ao rolar (MP 227 recomenda); stories só no Feed; login desktop sem o painel tingido da prévia |
| dev-2 | Fundo de página `bgAlt`; dock em cápsula (999 px); sombra no drawer; visualizador de stories com progresso; stories em todas as telas e no desktop |
| dev-3 | Etapa de código de confirmação no cadastro; toque no story abre o perfil; menu do avatar em bottom sheet no celular; stories fixas no header (retrato); instruções do login à esquerda |

## 7. As 5 falhas mais importantes

1. **Destinos desktop × celular contraditórios** (B1, MP 181 × 195/594). É a falha que mais afeta a característica "versão desktop coerente". dev-3, seguindo as listas aprovadas, deixou Salvos, Explorar e Conta sem acesso no desktop (ARQ-10 = 60 %). Raiz: A3, porque o Studio não permite alinhar os destinos.
2. **Paisagem de dev-3** (C): header fixo com stories + dock ocupam 50 % da altura a 667 × 375, e as stories não recolhem (CEL-14 = 50 %, CEL-15 = 25 %). As instruções eram claras.
3. **Regra de paisagem inalcançável e ambígua** (B11/D2). Com corte por largura em 768 px, um celular comum deitado (844 × 390) recebe o header de tablet nos três sites. "Stories recolhem" gerou três comportamentos.
4. **Escopo dos stories e stories no desktop** (A1 + B10). O briefing pedia "header superior com stories" e coerência desktop. O Studio não oferece stories no desktop e o MP não diz em quais telas a faixa aparece. Resultado: dev-1 só no Feed, dev-2 em todas as telas e no desktop, dev-3 só no celular e fixa.
5. **Visual do header e do dock aprovado, mas não exportado** (B9/A4). Na prévia aprovada, "+ Novo" é neutro, os contadores são laranja, o monograma é escuro e o dock é branco com raio de 24 px e afastamentos de 17/33 px. Nada disso está no MP, e os três divergem igualmente da prévia. Também entra aqui o texto genérico "navigation bar + FAB" que sobrou 4 vezes (B2): foi neutralizado só pela observação manual do usuário.

**Menção:** alvos de toque < 44 px (C) em dev-3 (mais de 6 alvos) e dev-1 (4 links), e nav desalinhada do centro (C) em dev-2 e dev-3.

## 8. Arquivos

| Pasta ou arquivo | Conteúdo |
|---|---|
| `rubrica.md` | Requisitos, métodos e limiares, escritos antes de abrir os sites |
| `capturas/` | 183 PNG: `<site>-m390-*`, `-m360-*`, `-m320-*`, `-land*`, `-t768-*`, `-t820/767-*`, `-d1024/1280/1440/1920-*` e `-varredura-*` |
| `composicoes/` | Lado a lado Studio × dev-1/2/3 na mesma altura: `celular-390-feed`, `celular-390-feed-layout-mobile`, `celular-390-drawer`, `celular-360-*`, `celular-390-dock-detalhe`, `celular-390-topo-detalhe`, `login-celular-390`, `perfil-celular-390`, `card-celular-390`, `dock-componente-390`, `desktop-1440-feed`, `header-desktop-1440`, `login-desktop-1440`. Só sites (sem equivalente no Studio): `tablet-768-*`, `paisagem-*`, `celular-320-*` |
| `scripts/` | Scripts de medição e `out/` com JSON brutos, `matrizes.md` e `notas.json` |
