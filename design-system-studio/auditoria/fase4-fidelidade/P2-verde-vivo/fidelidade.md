# Fidelidade: P2 "Verde Vivo" (loja de plantas)

**Fase 4 da auditoria independente do Design System Studio.** A pergunta é: o que foi escolhido e aprovado no Studio chegou aos três sites construídos (dev-1, dev-2, dev-3), feitos por desenvolvedores que receberam só o Master Prompt? E, onde não chegou, de quem é a falha?

## Escopo e método

### Fontes

- **Escolhas:** `fase2-projetos/P2-verde-vivo/escolhas.md`, `relatorio.md`, as capturas aprovadas no Studio e os arquivos exportados.
- **Master Prompt:** `exportados/verde-vivo-master-prompt.md`, aqui chamado **MP**, com as linhas citadas como **L*n***. O arquivo é idêntico byte a byte ao `PROMPT.md` de cada desenvolvedor (verificado com `cmp`).
- **Rubrica:** escrita antes de abrir os sites, em `rubrica.md`. São 70 requisitos em 7 dimensões, com método e limiar definidos para cada um.
- **NOTES.md de cada desenvolvedor:** usados para separar falha do prompt (B ou D) de falha do desenvolvedor (C).

### Ambiente de medição

- Playwright 1.63 com Chromium e um contexto limpo por teste.
- Os sites foram servidos em 127.0.0.1, nas portas 4521, 4522 e 4523.
- Viewports usadas:
  - 1440×900;
  - 390×844 (`isMobile`, `hasTouch`, DPR 3);
  - 768×1024;
  - varredura em 320, 360, 375, 390, 412, 430, 480, 600, 767, 768, 820, 1024, 1280, 1440 e 1920;
  - celular na horizontal: 844×390, 667×375 e 740×360.
- As fontes carregaram nos três sites: Google Fonts no dev-1 e no dev-3, arquivos locais no dev-2. A tipografia foi verificada com `document.fonts`.

### Notas

- **Fidelidade:** compara o resultado com a escolha aprovada.
- **Origem:** atribui a culpa de cada desvio:
  - A = Studio;
  - B = Master Prompt;
  - C = desenvolvedor;
  - D = conflito ou limitação da especificação;
  - E = diferença aceitável.
- **Aderência às instruções claras:** a mesma média, sem os requisitos em que a perda veio de A, B ou D.
- **[J]** marca requisito de julgamento de design.

### Ressalvas

1. **dev-2 (DESVIOS-DE-ISOLAMENTO.md):** o desenvolvedor pode ter visto capturas antigas de módulos do Studio. Não achei sinal disso no resultado:
   - o que o dev-2 tem de parecido com o Studio está escrito no MP (por exemplo, a legenda "Fig. 01" está em L567);
   - o dev-2 não ficou mais próximo das prévias do que o dev-1.

   A ressalva continua valendo para a fidelidade visual fina do dev-2.
2. **dev-3 com `reducedMotion: 'reduce'`:** a página do dev-3 entra num laço de rolagem (INT-06), e os cliques do Playwright esperavam até 30 s sem conseguir um elemento estável. Por isso as interações desktop e celular do dev-3 rodaram nesse modo. A oscilação foi medida à parte, sem esse modo (`scripts/p05-oscilacao-dev3.cjs`).
3. **dev-2 reserva a barra de rolagem** (`scrollbar-gutter: stable`). A área útil fica com 1425 px numa janela de 1440. Isso não pesou em nenhuma nota.

## Resumo

| | dev-1 | dev-2 | dev-3 |
|---|---:|---:|---:|
| **Fidelidade geral** (n=70) | **97,6%** | **96,6%** | **83,4%** |
| Aderência às instruções claras | 99,5% (n=66) | 97,6% (n=67) | 89,7% (n=57) |
| Falhas B / C / D | 3 / 2 / 1 | 3 / 6 / 0 | 11 / 17 / 2 |

- **dev-1 e dev-2 estão muito próximos do que foi escolhido.**
  - Ambos têm um header único, que junta o Mega Empório e o layout de duas linhas.
  - A landing segue a Folha Viva na ordem exata.
  - A arquitetura mobile está completa nas duas páginas.
  - Os componentes Soft Pill estão fiéis.
  - O que eles perdem vem quase todo de ambiguidade do prompt: o papel do template de moda e o número de colunas da vitrine.
- **O dev-3 seguiu o prompt ao pé da letra quando ele se contradiz.**
  - Na landing usou o "Header leve" da Folha Viva, com o logotipo "Folha Viva" e hambúrguer no celular (MP L29 e L58). Isso reproduz a prévia da landing no Studio, mas contraria o header e a arquitetura mobile escolhidos.
  - O Mega Empório só aparece na página de catálogo, e mesmo lá sem "Departamentos", endereço de entrega nem avatar.
  - Tem a falha de implementação mais grave das três: a linha 2 do header entra num laço de recolher e expandir, e a página fica "tremendo" (INT-06).
- **O que os três acertaram:**
  - paleta Floresta com 44 de 44 tokens idênticos;
  - Fraunces e Inter;
  - a composição da Folha Viva no desktop (cartões 0/48/96, citação a 25%, imagem sangrando);
  - drawer de filtros Soft Pill virando bottom sheet no celular;
  - dock flutuante com geometria exata;
  - busca em combobox;
  - nenhum overflow horizontal entre 320 e 1920 px.

## 1. Cadeia Studio → Master Prompt (por característica do briefing)

| Característica do briefing | Foi escolhida no Studio? | Chegou ao MP? | Clareza no MP | Trechos que decidem (e os que atrapalham) |
|---|---|---|---|---|
| **Landing page** | Sim: "Landing page sem login" + modelo **Folha Viva**, com as cores do modelo desligadas | Sim (L17–65) | **Clara na composição, contraditória na navegação** | Clara: a ordem das 7 seções (L28), a grade e os deslocamentos (L33–37) e o comportamento no celular (L54–57). Contradição: o header próprio da landing, "logotipo 'Folha Viva', navegação com 'Plantas', 'Vasos'…" (L29), compete com o header global. "Navegação em hambúrguer abaixo de 768 px" (L58) compete com "use a navegação móvel escolhida no layout mobile" (L59) e com "No celular, use 'Header fixo com busca e menu inferior flutuante'" (L149). O próprio Studio aprovou as duas prévias, a da landing com hambúrguer e a da arquitetura mobile, sem acusar conflito (relatório da fase 2, inconsistência 3). |
| **Catálogo de produtos** | Parcial: tipo "Loja ou catálogo" + template **E-commerce de moda**, com as partes ★ Cabeçalho, Categorias e Vitrine | Sim, como referência de template (L622–703) | **Ambígua** | O Studio não tem módulo de página de catálogo (lacuna A). O template descreve uma home inteira de 8 seções (L629), e o MP não diz se ela é uma segunda página, se entra na landing ou se é só referência. A vitrine pede "8 produtos em 4 colunas… foto 4:5" (L635), mas o card aprovado pede "Mídia (aspect-ratio 16/9)" (L330) e "grade… reduz colunas (3 → 2 → 1)" (L390). |
| **Header com navegação** | Sim: layout "Navegação superior de duas linhas" + header **Mega Empório, composição A**, sem sidebar | Sim (L67–106 e L155–213) | **Clara na estrutura; vários conflitos de detalhe** | Claro: linha 1 com 64 px, logo, busca, endereço, conta e carrinho; linha 2 com 44 px e "Departamentos (abre o mega menu) seguido de atalhos" (L174); faixa de anúncio de 36 px (L168). Conflitos: largura do mega menu, "largura total" (L76) × "até 760 px" (L184/L187); abertura em hover (L96) × clique (L187); "Mais categorias" (L100) × "Mais ▾" (L196); faixa rolável (L101) × ☰ (L197) × "compactada ou mobile" (L150) entre 768 e 1023 px; ativo na cor do texto (L165) × "cor de navegação ativa" (L211). Os itens "Departamentos, Ofertas, Mercado, Casa, Eletrônicos" (L165) são fictícios, mas o MP não diz isso (só a marca vem marcada como fictícia), e o Studio não permite editá-los (A). |
| **Cards de produtos** | Parcial: Cards **Soft Pill** personalizado (título, texto, "Ver produto", ícone Folha) | Sim (L323–397) | **Clara no componente; conflita com o template e com a geometria global** | O componente não tem campo de preço, e "Preço." foi parar dentro do texto (L342). Isso é lacuna A. "Fonte de títulos: Inter 650" (L355) conflita com títulos em Fraunces (L278). Raio de 22 px, sem borda e com sombra difusa (L349–352) conflitam com "Médios (8 px)… sombra: none" (L292–304) e com "Não adicione… sombras… cantos arredondados" (L748). "Etiqueta: Novo" (L343) é um valor de exemplo, mas pode ser lido como regra. |
| **Busca** | Sim: Busca Soft Pill ("Buscar plantas…", ⌘K) + busca larga do header + busca do header mobile | Sim (L399–476, L166, L190, L115, L134, L202) | **Clara** | Pequenos conflitos: largura de 560 (L166) × 640 (L75); campo de 44 (L115) × linha de 48 (L202); "Buscando (carregando): não" (L424, que é um estado da prévia) × "estado de carregando com spinner" (L459). |
| **Filtros** | **Lacuna:** não existe componente de filtros. A aproximação foi o Drawer Soft Pill renomeado "Painel de filtros do catálogo" | Parcial (L478–550) | **Incompleta** | O MP só traz o título "Filtros", o botão "Aplicar filtros" e o lado direito. Os critérios não existem no Studio (A), e o MP não diz quais filtros usar. No celular há coerência: "bottom sheet com altura máxima de 90dvh e alça" (L543) e o botão "Filtrar" do template (L687). |
| **Inspiração botânica** | Sim: **Verdant Atelier** com paleta Original + contradição de cor resolvida como "Paleta global prevalece" | Sim (L552–620, L757–759) | **Clara** | A decisão de prioridade (L759) foi seguida pelos três. Ruído: a inspiração traz uma terceira ordem de seções (L562), um terceiro header (L566) e outro hambúrguer no celular (L608). |
| **Navegação mobile** | Sim: "Header fixo com busca e menu inferior flutuante" | Sim (L108–146) | **Clara na estrutura; destinos indefinidos; regra horizontal impossível** | Claro: header de ≈104 px, faixa de categorias de ≈52 px, dock de 64 px com margens de 16 e raio de 22, "não converta a navegação desktop…" (L102). Indefinido: os "4 destinos" (L117), que o Studio não permite editar (A); "stories: sim" (L125) sem descrição. Conflito D: "header + menu ≤ 25% da altura" (L140), quando 104 + 52 + 64 px já ocupam 59% de uma tela de 375 px. Ruído: o Mega Empório no celular manda barra + ☰ com os 5 itens (L198), e o template manda hambúrguer com categorias em drawer (L683). |
| **Identidade visual** | Sim: paleta **Floresta**, Fraunces + Inter, formas no padrão | Sim (L215–317), além do CSS de tokens | **Clara** | A tabela de 46 tokens, a tipografia e a geometria estão completas. Lacuna A: não há como enviar logotipo, e o MP só diz "substitua pela marca real". A escala "13 / 15 / 18 / 23 / 30 / 39" (L273) não traz exceção para o título do hero, que na prévia aprovada tem uns 80 px e na inspiração uns 96 px (L567). |
| *(implícito)* **Sem login** | Sim: "Landing page sem login" | Sim (L17) | **Contraditória** | O avatar abre um menu com "Meu perfil", "Configurações", "Ajuda" e "Sair" (L167/L191). O Studio não acusou o conflito (fase 2, B3). |

**Conclusão da cadeia:**

- Todas as características do briefing foram escolhidas e exportadas.
- As escolhas estruturais chegaram claras: paleta, tipografia, ordem da landing, geometria do dock e componentes.
- Os problemas vêm de três fontes:
  - **Composição de módulos sem regra de precedência.** A landing, o header, o template e a inspiração trazem, cada um, o seu header, a sua navegação no celular e a sua ordem de seções.
  - **Lacunas de catálogo do Studio:** página de catálogo, preço no card, critérios de filtro, destinos do dock e itens do header.
  - **Uma regra impossível:** 25% da altura na horizontal.

## 2. Notas por dimensão

Cada nota é a média simples dos requisitos da dimensão (0–100%); o *n* de cada uma aparece entre parênteses. A geral é a média dos 70 requisitos. A aderência deixa de fora os requisitos em que a perda tem origem A, B ou D. A **ARQ-10** é julgamento de design [J].

| Dimensão | dev-1 | dev-2 | dev-3 |
|---|---:|---:|---:|
| **Desktop** | 97,3% (n=13) | 98,1% (n=13) | 82,9% (n=13) |
| **Celular** | 96,1% (n=13) | 94,1% (n=13) | 81,6% (n=13) |
| **Paleta/tokens** | 100% (n=10) | 99% (n=10) | 94,2% (n=10) |
| **Componentes** | 100% (n=7) | 95,9% (n=7) | 94,3% (n=7) |
| **Interações** | 100% (n=12) | 100% (n=12) | 85,7% (n=12) |
| **Arquitetura** | 96,7% (n=10) | 96,7% (n=10) | 75% (n=10) |
| **Responsividade** | 90% (n=5) | 86,6% (n=5) | 63,4% (n=5) |
| **Geral** | 97,6% (n=70) | 96,6% (n=70) | 83,4% (n=70) |
| **Aderência às instruções claras** | 99,5% (n=66) | 97,6% (n=67) | 89,7% (n=57) |

| Origem | dev-1 | dev-2 | dev-3 | Total |
|---|---:|---:|---:|---:|
| A — Studio | 0 | 0 | 0 | 0 |
| B — Master Prompt | 3 | 3 | 11 | 17 |
| C — desenvolvedor | 2 | 6 | 17 | 25 |
| D — conflito/limitação | 1 | 0 | 2 | 3 |
| E — diferença aceitável | 3 | 3 | 2 | 8 |

A tabela de origens conta as **ocorrências na matriz**: um requisito marcado "B+C" conta nas duas. Nenhuma linha recebeu A porque a rubrica mede o resultado contra a escolha, e as lacunas do Studio aparecem como B (o MP ficou incompleto) ou como E (o desenvolvedor resolveu bem). As falhas A estão listadas na seção 5.

**Leitura por dimensão:**

- **Desktop:** dev-1 e dev-2 reproduzem a composição da Folha Viva e o header Mega Empório quase ao pixel:
  - deslocamento de cartões e citação idênticos;
  - busca de 560 ou 640 × 42 px;
  - mega menu de 760 px.

  No dev-1, a imagem alta do hero começa 44 px abaixo do título (o pedido é ≈80). O dev-3 perde porque a landing não tem o header escolhido e porque, no catálogo, a linha 2 não tem "Departamentos" e espalha as categorias pela largura toda.
- **Celular:** o dock é idêntico nos três (64 px, margens de 16, raio de 22, ativo com cor, indicador, ícone preenchido e aria-current). As perdas são:
  - dev-2: campo de busca com 15 px;
  - dev-3: landing sem a arquitetura mobile e sem faixa de anúncio no celular;
  - todos: links de rodapé com 36 px de altura.
- **Paleta/tokens:** os 44 tokens de cor aparecem com valor idêntico nos três. O dev-3 tem 7 rgba fixos em sombras e usa raio de 22 px fora dos componentes.
- **Componentes:** os três aplicaram Soft Pill só nos três componentes aprovados e mantiveram a mídia em 16/9 e o título em Inter 650. Foi a mesma leitura nos três casos. Faltas pontuais:
  - dev-2: ícone de folha no card e scale 0,98 no card;
  - dev-3: grupo "Recentes" na busca.
- **Interações:** dev-1 e dev-2 passaram em 12 de 12. O dev-3 falha no recolhimento da linha 2 (laço contínuo) e abre o mega menu em largura total.
- **Arquitetura:** dev-1 e dev-2 só perdem as "Categorias" do template, que ficou ambíguo. O dev-3 perde a arquitetura escolhida na landing e mantém a marca de exemplo.
- **Responsividade:** nenhum dos três tem overflow. O dev-2 resolveu a regra impossível da tela horizontal (17%), o dev-1 chegou a 27% e o dev-3 a 46%.

## 3. Matrizes de fidelidade (70 requisitos × 3 sites)

Colunas: requisito (id da rubrica), escolha aprovada no Studio, instrução exportada (linhas do MP), resultado medido, fidelidade e origem da falha. "—" significa sem falha; "B+C" significa perda com duas causas, detalhadas na seção 5.

### Matriz — dev-1

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---:|:---:|
| **ARQ-01** Sem login / sem área restrita | “Landing page sem login” | L17–18 (contradito por L167/L191: avatar com “Sair”) | Sem login; avatar com perfil fictício marcado como demonstração | 100% | E |
| **ARQ-02** Ordem das 7 seções da Folha Viva | Folha Viva (Composição assimétrica) | L28/L41: ordem explícita | Header → hero → cartões → citação → texto+imagem → chamada → rodapé (7/7) | 100% | — |
| **ARQ-03** Layout desktop de 2 linhas, sem sidebar | Navegação superior de duas linhas | L19, L71–85 × L29 (header leve da landing) | 2 linhas em todas as páginas | 100% | — |
| **ARQ-04** Arquitetura mobile: header+busca, faixa, dock | Header fixo com busca e menu inferior flutuante | L19, L112–118, L149 × L58 (hambúrguer da landing) | Presente na landing e no catálogo | 100% | — |
| **ARQ-05** Troca de arquitetura em 768 px | Desktop e mobile independentes | L102, L141 (L150 abre exceção 600–1023) | Mobile até 767, desktop a partir de 768 | 100% | — |
| **ARQ-06** Catálogo com cards, busca e filtros | Tipo “Loja ou catálogo” + template de vitrine | L11–12 (lista de funcionalidades) | Rota #/catalogo, 30 produtos, busca e filtros ligados | 100% | — |
| **ARQ-07** Partes ★ do template: Categorias (4 blocos) e Vitrine (4 col., selo, preço, parcelamento, filtrar/ordenar) | Template “E-commerce de moda”, partes Cabeçalho/Categorias/Vitrine | L629–642, L635 × L28 (ordem fechada da landing) × L390 (3→2→1) | Sem blocos de categoria; 3 colunas; selo, preço, parcelamento e filtrar/ordenar OK (4/6) | 67% | B |
| **ARQ-08** Conteúdo fictício substituído | Marcas de exemplo da landing, do header e do template | L64, L164, L702 (“substitua”) × L29 (logotipo “Folha Viva”) | Nenhuma marca ou item de exemplo | 100% | — |
| **ARQ-09** Marca “Verde Vivo” no logo e no rodapé | Nome do projeto “Verde Vivo” | L8, L64 | Em todas as páginas | 100% | — |
| **ARQ-10** Inspiração botânica (Verdant): editorial, serifa, vetores, respiro [J] | Verdant Atelier, paleta global prevalece | L552–620, L759 | Ilustrações SVG variadas por espécie, arco no hero, serifa grande | 100% | — |
| **DSK-01** Hero assimétrico (título col. 1–8, itálico accent, imagem alta 440/+80, imagem sobreposta, CTA link) | Prévia Folha Viva | L30–35, L45–46 | Título de 803 px e 80 px; itálico #b07d4f; imagem 440 px, mas começa 44 px abaixo do título (pede ≈80) (4,5/5) | 90% | C |
| **DSK-02** Cartões escalonados 0/48/96 px | Prévia Folha Viva | L35, L47 | 0/48/96 | 100% | — |
| **DSK-03** Citação recuada ≈25%, autor à direita | Prévia Folha Viva | L36 | Recuo de 25%, autor à direita | 100% | — |
| **DSK-04** Imagem sangrando até a borda direita | Prévia Folha Viva | L37 | Borda direita = 1440 | 100% | — |
| **DSK-05** Chamada final alinhada à esquerda | Prévia Folha Viva | L28 | À esquerda | 100% | — |
| **DSK-06** Faixa de anúncio de 36 px (primary/onPrimary, link, ✕) | Mega Empório | L168, L183 | 36 px, #2d6a4f/#fff, link e ✕ | 100% | — |
| **DSK-07** Linha 1: 64 px, logo 28 px, busca larga 42 px, endereço, avatar, carrinho | Mega Empório, composição A | L74–75, L162–167 | 64 px; logo 28 px #2d6a4f + nome em 700; busca 560×42; endereço com CEP; avatar; carrinho (6/6) | 100% | — |
| **DSK-08** Linha 2: 44 px, “Departamentos” + atalhos à esquerda, ativo em text/600 | Mega Empório, composição A | L76, L165, L174 × L211 | 44 px; Departamentos; à esquerda; ativo em #1b2e24 peso 600 com aria-current | 100% | — |
| **DSK-09** Header sticky (z 40) com sombra após 8 px | Mega Empório | L189 | Sticky, z 40, sombra ao rolar | 100% | — |
| **DSK-10** Conteúdo com largura máx. ≈1280 (ou 1120) | Layout de duas linhas | L74/L91 × L630 | 1280 (1216 úteis) | 100% | — |
| **DSK-11** 1024–1279: excedentes em “Mais” | Layout + Mega Empório | L100 × L196 | “Mais ▾” em 1024 | 100% | — |
| **DSK-12** 768–1023: desktop compactado sem overflow | Layout + Mega Empório | L101 × L197 × L150 (3 instruções diferentes) | 5 itens cabem; sem ☰ | 100% | — |
| **DSK-13** Vitrine em 4 colunas no desktop | Template, parte Vitrine | L635 × L390 (card 3→2→1) | 3 colunas | 75% | B |
| **MOB-01** Header fixo ≈104 px (marca + busca em largura total) com safe-area | Header fixo com busca… | L115 (× L198/L202, 56+48) | Sticky 56+48 = 104 px; busca 358 px; safe-area-inset-top | 100% | — |
| **MOB-02** Busca com fonte de 16 px que abre a tela de sugestões | Header fixo com busca… | L134, L469, L721 | 16 px; abre busca em tela cheia com Recentes/Sugestões | 100% | — |
| **MOB-03** Faixa de categorias ≈52 px (pílulas com ícone, scroll-snap, ativa) | Header fixo com busca… | L116 | 52 px, snap por proximidade, ícone + rótulo, ativa em primarySoft | 100% | — |
| **MOB-04** Dock flutuante: 64 px, margens de 16, raio 22, 4 destinos, safe-area | Header fixo com busca… | L117, L725 | 64 px, 16/16/16, 22 px, 4 itens | 100% | — |
| **MOB-05** Item ativo do dock: cor + indicador + ícone preenchido + aria-current | Header fixo com busca… | L136 | 4/4 | 100% | — |
| **MOB-06** Nada escondido atrás do dock | Header fixo com busca… | L118 | Último texto 38 px acima do dock | 100% | — |
| **MOB-07** Não trocar a navegação por drawer ou hambúrguer | Arquitetura mobile escolhida | L102, L733 × L58, L198 | Dock como navegação principal + ☰ complementar (pedido em L198) | 100% | E |
| **MOB-08** Faixa de anúncio no celular: 32 px, 1 linha, ✕ de 44 | Mega Empório | L201 | 32 px, reticências, ✕ 44×44 | 100% | — |
| **MOB-09** Filtros em bottom sheet (≤ 90dvh, com alça) | Drawer Soft Pill + template | L543, L687 | Sheet de 760 px (90dvh) com alça | 100% | — |
| **MOB-10** Vitrine com 2 colunas no celular | Template, parte Vitrine | L687 × L390 | 1 coluna | 75% | B |
| **MOB-11** Hero no celular: 1 coluna assimétrica, imagem com recuo de 40, imagem menor abaixo | Prévia Folha Viva (celular) | L54–57 | 3/3 | 100% | — |
| **MOB-12** Escalonamento dos cartões removido abaixo de 768 | Folha Viva | L56 | Removido, com recuos alternados | 100% | — |
| **MOB-13** Alvos de toque ≥ 44×44 | Regras do Studio | L146, L720 | 16/44 (landing) e 15/100 (catálogo) abaixo de 44: links do rodapé com 36 px, links inline | 74% | C |
| **PAL-01** Fundo = bg #f6faf6 | Paleta Floresta | L230 | #f6faf6 | 100% | — |
| **PAL-02** Texto = #1b2e24 | Paleta Floresta | L234 | #1b2e24 | 100% | — |
| **PAL-03** Primária #2d6a4f (botões, faixa, “Aplicar”) | Paleta Floresta | L221 | Idêntica | 100% | — |
| **PAL-04** Destaque #b07d4f (itálico do hero, contador) | Paleta Floresta | L228, L192 | Idêntico nos 2 pontos | 100% | — |
| **PAL-05** Tokens centralizados com valores exportados; sem cores fixas | Tokens exportados | L208, L753 | 44/44 tokens; só #000 como alfa de máscara | 100% | — |
| **PAL-06** Fraunces 650 nos títulos, Inter 400 no corpo, base 15 px | Tipografia Fraunces + Inter | L270–282 | 4/4 (Google Fonts) | 100% | — |
| **PAL-07** Nada < 12 px; botões e filtros ≥ 14 px | Tipografia | L275 | 0 violações | 100% | — |
| **PAL-08** Geometria global fora dos componentes: 6/8/12, contornada, sem sombra | Formas: Médios, Contornada, Sem sombra | L292–308, L748 | 3/3 | 100% | — |
| **PAL-09** Cores da inspiração não usadas | Decisão: paleta global prevalece | L759 | 0 | 100% | — |
| **PAL-10** Foco visível 2–3 px em focusRing | Estados visuais | L315 | 2 px #2d6a4f (+ halo nos componentes) | 100% | — |
| **CMP-01** Estrutura do card: mídia 16/9 → etiqueta → título → texto → rodapé “Ver produto”; ícone Folha | Card Soft Pill personalizado | L330, L341–348 (× L635 4:5) | 6/6 (etiqueta com ícone de folha) | 100% | — |
| **CMP-02** Visual Soft Pill do card: raio 22, botão pílula, sem borda, sombra difusa, #fff, primária, título Inter | Card Soft Pill | L349–359 (× L292–306) | 7/7 | 100% | — |
| **CMP-03** Estados do card: hover, active 0,98, foco, 160 ms | Card Soft Pill | L380–387 | 4/4 | 100% | — |
| **CMP-04** Busca Soft Pill: lupa, “Buscar plantas…”, ⌘K, 42 px, pílula, tonal, Recentes/Sugestões, combobox | Busca Soft Pill personalizada | L405–438 | 8/8 | 100% | — |
| **CMP-05** Drawer Soft Pill: overlay, à direita, 360–420 px, dialog modal, “Filtros”, rodapé “Aplicar filtros”, raio 22 | Drawer Soft Pill (“Painel de filtros”) | L485–531 | 7/7 (400 px) | 100% | — |
| **CMP-06** Critérios de filtro adequados a plantas | (Studio só tinha critérios genéricos) | Ausente no MP (lacuna A) | Luz, rega, porte, preço, características | 100% | E |
| **CMP-07** Estados de vazio e carregando | Regras de implementação | L752, L459 × L424 | Vazio, esqueleto e spinner na busca | 100% | — |
| **INT-01** Mega menu: clique, ≤ 760 px, 3 col. + destaque, caixa alta, foco no 1º link, Esc, clique fora | Mega Empório (prévia com mega menu) | L96, L184, L187 × L76 (largura total) | 7/7 (760 px; hover de 150 ms também) | 100% | — |
| **INT-02** Busca do header: painel ao focar com a mesma largura, Ctrl+K, setas, Esc | Mega Empório + Busca Soft Pill | L190, L458 | 5/5 | 100% | — |
| **INT-03** Busca filtra os produtos | Busca | briefing | “Costel” → 1 resultado; vazio tratado | 100% | — |
| **INT-04** Filtros aplicam e ordenação funciona | Drawer de filtros + template | L635 | 30→4; menor preço OK | 100% | — |
| **INT-05** Drawer: Esc, overlay, botão, foco preso e devolvido | Drawer Soft Pill | L533, L213 | 5/5 | 100% | — |
| **INT-06** Linha 2 recolhe ao descer e volta ao subir | Layout de duas linhas | L95 | Recolhe e volta | 100% | — |
| **INT-07** Faixa de anúncio dispensável | Mega Empório | L168 | OK | 100% | — |
| **INT-08** Carrinho: contador accent, incrementa, abre a sacola | Mega Empório + template | L192, L675 | 3/3 | 100% | — |
| **INT-09** Menu do avatar (nome/e-mail, Meu perfil… Sair) | Mega Empório | L191 × L17 | Completo, com aviso de perfil fictício | 100% | — |
| **INT-10** Toque em categoria filtra sem mover a faixa | Header fixo com busca… | L135 | 3/3 (scrollLeft 99→99) | 100% | — |
| **INT-11** Dock responde e atualiza o ativo | Header fixo com busca… | L117, L136 | Rotas com aria-current | 100% | — |
| **INT-12** prefers-reduced-motion | Regras gerais | L729 | Sim | 100% | — |
| **RSP-01** Sem overflow horizontal (320–1920) | Regras gerais | L717 | 0/15 larguras | 100% | — |
| **RSP-02** Sem texto cortado, sobreposição ou instabilidade | Regras gerais | L718–719 | Nada encontrado | 100% | — |
| **RSP-03** Inputs com ≥ 16 px no celular | Regras gerais | L721 | Todos com 16 | 100% | — |
| **RSP-04** Celular na horizontal: barras ≤ 25% da altura | Header fixo com busca… | L140, L726 (104+52+64 px não cabem em 25% de 375 px) | 27% lendo; 42% no topo | 50% | D |
| **RSP-05** Tablet 768×1024 coerente | Layout desktop compactado | L150 | OK | 100% | — |

### Matriz — dev-2

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---:|:---:|
| **ARQ-01** Sem login / sem área restrita | “Landing page sem login” | L17–18 (contradito por L167/L191: avatar com “Sair”) | Sem login; menu de conta fictício, itens só avisam | 100% | E |
| **ARQ-02** Ordem das 7 seções da Folha Viva | Folha Viva (Composição assimétrica) | L28/L41: ordem explícita | 7/7 na ordem | 100% | — |
| **ARQ-03** Layout desktop de 2 linhas, sem sidebar | Navegação superior de duas linhas | L19, L71–85 × L29 (header leve da landing) | 2 linhas em todas as páginas | 100% | — |
| **ARQ-04** Arquitetura mobile: header+busca, faixa, dock | Header fixo com busca e menu inferior flutuante | L19, L112–118, L149 × L58 (hambúrguer da landing) | Presente na landing e no catálogo | 100% | — |
| **ARQ-05** Troca de arquitetura em 768 px | Desktop e mobile independentes | L102, L141 (L150 abre exceção 600–1023) | Idem | 100% | — |
| **ARQ-06** Catálogo com cards, busca e filtros | Tipo “Loja ou catálogo” + template de vitrine | L11–12 (lista de funcionalidades) | Rota #/catalogo, 22 produtos | 100% | — |
| **ARQ-07** Partes ★ do template: Categorias (4 blocos) e Vitrine (4 col., selo, preço, parcelamento, filtrar/ordenar) | Template “E-commerce de moda”, partes Cabeçalho/Categorias/Vitrine | L629–642, L635 × L28 (ordem fechada da landing) × L390 (3→2→1) | Sem blocos de categoria; 3 colunas; demais OK (4/6) | 67% | B |
| **ARQ-08** Conteúdo fictício substituído | Marcas de exemplo da landing, do header e do template | L64, L164, L702 (“substitua”) × L29 (logotipo “Folha Viva”) | Nenhuma marca ou item de exemplo | 100% | — |
| **ARQ-09** Marca “Verde Vivo” no logo e no rodapé | Nome do projeto “Verde Vivo” | L8, L64 | Em todas as páginas | 100% | — |
| **ARQ-10** Inspiração botânica (Verdant): editorial, serifa, vetores, respiro [J] | Verdant Atelier, paleta global prevalece | L552–620, L759 | Idem, com legenda “Fig. 01” e rodapé invertido | 100% | — |
| **DSK-01** Hero assimétrico (título col. 1–8, itálico accent, imagem alta 440/+80, imagem sobreposta, CTA link) | Prévia Folha Viva | L30–35, L45–46 | Título de 845 px; imagem 468 px a +80 px; sobreposta; CTA link (5/5) | 100% | — |
| **DSK-02** Cartões escalonados 0/48/96 px | Prévia Folha Viva | L35, L47 | 0/48/96 | 100% | — |
| **DSK-03** Citação recuada ≈25%, autor à direita | Prévia Folha Viva | L36 | 25%, autor à direita | 100% | — |
| **DSK-04** Imagem sangrando até a borda direita | Prévia Folha Viva | L37 | Borda direita = 1425 (área útil, com reserva da barra de rolagem) | 100% | — |
| **DSK-05** Chamada final alinhada à esquerda | Prévia Folha Viva | L28 | À esquerda | 100% | — |
| **DSK-06** Faixa de anúncio de 36 px (primary/onPrimary, link, ✕) | Mega Empório | L168, L183 | Idem | 100% | — |
| **DSK-07** Linha 1: 64 px, logo 28 px, busca larga 42 px, endereço, avatar, carrinho | Mega Empório, composição A | L74–75, L162–167 | 64 px; busca 640×42; todos os itens (6/6) | 100% | — |
| **DSK-08** Linha 2: 44 px, “Departamentos” + atalhos à esquerda, ativo em text/600 | Mega Empório, composição A | L76, L165, L174 × L211 | 44 px; Departamentos; ativo em navActive + 600 + sublinhado (L211) | 100% | E |
| **DSK-09** Header sticky (z 40) com sombra após 8 px | Mega Empório | L189 | Idem | 100% | — |
| **DSK-10** Conteúdo com largura máx. ≈1280 (ou 1120) | Layout de duas linhas | L74/L91 × L630 | 1280 | 100% | — |
| **DSK-11** 1024–1279: excedentes em “Mais” | Layout + Mega Empório | L100 × L196 | “Mais categorias” em 1024 | 100% | — |
| **DSK-12** 768–1023: desktop compactado sem overflow | Layout + Mega Empório | L101 × L197 × L150 (3 instruções diferentes) | Faixa rolável com esmaecimento | 100% | — |
| **DSK-13** Vitrine em 4 colunas no desktop | Template, parte Vitrine | L635 × L390 (card 3→2→1) | 3 colunas | 75% | B |
| **MOB-01** Header fixo ≈104 px (marca + busca em largura total) com safe-area | Header fixo com busca… | L115 (× L198/L202, 56+48) | Idem | 100% | — |
| **MOB-02** Busca com fonte de 16 px que abre a tela de sugestões | Header fixo com busca… | L134, L469, L721 | Abre em tela cheia, mas o campo tem 15 px (zoom no iOS) (2/3) | 67% | C |
| **MOB-03** Faixa de categorias ≈52 px (pílulas com ícone, scroll-snap, ativa) | Header fixo com busca… | L116 | 52 px, snap, ativa preenchida em primary | 100% | — |
| **MOB-04** Dock flutuante: 64 px, margens de 16, raio 22, 4 destinos, safe-area | Header fixo com busca… | L117, L725 | Idem | 100% | — |
| **MOB-05** Item ativo do dock: cor + indicador + ícone preenchido + aria-current | Header fixo com busca… | L136 | 4/4 (ponto + preenchimento) | 100% | — |
| **MOB-06** Nada escondido atrás do dock | Header fixo com busca… | L118 | Idem (40 px) | 100% | — |
| **MOB-07** Não trocar a navegação por drawer ou hambúrguer | Arquitetura mobile escolhida | L102, L733 × L58, L198 | Só dock, faixa e busca | 100% | — |
| **MOB-08** Faixa de anúncio no celular: 32 px, 1 linha, ✕ de 44 | Mega Empório | L201 | Idem | 100% | — |
| **MOB-09** Filtros em bottom sheet (≤ 90dvh, com alça) | Drawer Soft Pill + template | L543, L687 | Idem | 100% | — |
| **MOB-10** Vitrine com 2 colunas no celular | Template, parte Vitrine | L687 × L390 | 1 coluna | 75% | B |
| **MOB-11** Hero no celular: 1 coluna assimétrica, imagem com recuo de 40, imagem menor abaixo | Prévia Folha Viva (celular) | L54–57 | 3/3 | 100% | — |
| **MOB-12** Escalonamento dos cartões removido abaixo de 768 | Folha Viva | L56 | Idem | 100% | — |
| **MOB-13** Alvos de toque ≥ 44×44 | Regras do Studio | L146, L720 | 10/37 e 11/102: links do rodapé com 36 px | 81% | C |
| **PAL-01** Fundo = bg #f6faf6 | Paleta Floresta | L230 | #f6faf6 | 100% | — |
| **PAL-02** Texto = #1b2e24 | Paleta Floresta | L234 | #1b2e24 | 100% | — |
| **PAL-03** Primária #2d6a4f (botões, faixa, “Aplicar”) | Paleta Floresta | L221 | Idêntica | 100% | — |
| **PAL-04** Destaque #b07d4f (itálico do hero, contador) | Paleta Floresta | L228, L192 | Idêntico | 100% | — |
| **PAL-05** Tokens centralizados com valores exportados; sem cores fixas | Tokens exportados | L208, L753 | 44/44; zero literais | 100% | — |
| **PAL-06** Fraunces 650 nos títulos, Inter 400 no corpo, base 15 px | Tipografia Fraunces + Inter | L270–282 | 4/4 (fontes locais) | 100% | — |
| **PAL-07** Nada < 12 px; botões e filtros ≥ 14 px | Tipografia | L275 | 4 botões de demonstração com 13 px | 90% | C |
| **PAL-08** Geometria global fora dos componentes: 6/8/12, contornada, sem sombra | Formas: Médios, Contornada, Sem sombra | L292–308, L748 | 3/3 | 100% | — |
| **PAL-09** Cores da inspiração não usadas | Decisão: paleta global prevalece | L759 | 0 | 100% | — |
| **PAL-10** Foco visível 2–3 px em focusRing | Estados visuais | L315 | 2 px + halo de 35% | 100% | — |
| **CMP-01** Estrutura do card: mídia 16/9 → etiqueta → título → texto → rodapé “Ver produto”; ícone Folha | Card Soft Pill personalizado | L330, L341–348 (× L635 4:5) | Sem ícone de folha (5/6) | 83% | C |
| **CMP-02** Visual Soft Pill do card: raio 22, botão pílula, sem borda, sombra difusa, #fff, primária, título Inter | Card Soft Pill | L349–359 (× L292–306) | 7/7 | 100% | — |
| **CMP-03** Estados do card: hover, active 0,98, foco, 160 ms | Card Soft Pill | L380–387 | Sem scale 0,98 no card (3,5/4) | 88% | C |
| **CMP-04** Busca Soft Pill: lupa, “Buscar plantas…”, ⌘K, 42 px, pílula, tonal, Recentes/Sugestões, combobox | Busca Soft Pill personalizada | L405–438 | 8/8 | 100% | — |
| **CMP-05** Drawer Soft Pill: overlay, à direita, 360–420 px, dialog modal, “Filtros”, rodapé “Aplicar filtros”, raio 22 | Drawer Soft Pill (“Painel de filtros”) | L485–531 | 7/7 (400 px) | 100% | — |
| **CMP-06** Critérios de filtro adequados a plantas | (Studio só tinha critérios genéricos) | Ausente no MP (lacuna A) | Categoria, luz, porte, cuidado, extras | 100% | E |
| **CMP-07** Estados de vazio e carregando | Regras de implementação | L752, L459 × L424 | Idem | 100% | — |
| **INT-01** Mega menu: clique, ≤ 760 px, 3 col. + destaque, caixa alta, foco no 1º link, Esc, clique fora | Mega Empório (prévia com mega menu) | L96, L184, L187 × L76 (largura total) | 7/7 | 100% | — |
| **INT-02** Busca do header: painel ao focar com a mesma largura, Ctrl+K, setas, Esc | Mega Empório + Busca Soft Pill | L190, L458 | 5/5 | 100% | — |
| **INT-03** Busca filtra os produtos | Busca | briefing | Idem | 100% | — |
| **INT-04** Filtros aplicam e ordenação funciona | Drawer de filtros + template | L635 | 22→7; OK | 100% | — |
| **INT-05** Drawer: Esc, overlay, botão, foco preso e devolvido | Drawer Soft Pill | L533, L213 | 5/5 | 100% | — |
| **INT-06** Linha 2 recolhe ao descer e volta ao subir | Layout de duas linhas | L95 | Recolhe e volta | 100% | — |
| **INT-07** Faixa de anúncio dispensável | Mega Empório | L168 | OK | 100% | — |
| **INT-08** Carrinho: contador accent, incrementa, abre a sacola | Mega Empório + template | L192, L675 | 3/3 | 100% | — |
| **INT-09** Menu do avatar (nome/e-mail, Meu perfil… Sair) | Mega Empório | L191 × L17 | Completo | 100% | — |
| **INT-10** Toque em categoria filtra sem mover a faixa | Header fixo com busca… | L135 | 3/3 (101→101) | 100% | — |
| **INT-11** Dock responde e atualiza o ativo | Header fixo com busca… | L117, L136 | Rotas ou rolagem até a seção | 100% | — |
| **INT-12** prefers-reduced-motion | Regras gerais | L729 | Sim | 100% | — |
| **RSP-01** Sem overflow horizontal (320–1920) | Regras gerais | L717 | 0/15 | 100% | — |
| **RSP-02** Sem texto cortado, sobreposição ou instabilidade | Regras gerais | L718–719 | Nada visível (o rótulo “Adicionar à sacola” fica oculto de propósito) | 100% | — |
| **RSP-03** Inputs com ≥ 16 px no celular | Regras gerais | L721 | Busca com 15 e ordenação com 14 (1/3) | 33% | C |
| **RSP-04** Celular na horizontal: barras ≤ 25% da altura | Header fixo com busca… | L140, L726 (104+52+64 px não cabem em 25% de 375 px) | 17% (header deixa de ser fixo) | 100% | — |
| **RSP-05** Tablet 768×1024 coerente | Layout desktop compactado | L150 | OK | 100% | — |

### Matriz — dev-3

| Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade | Origem |
|---|---|---|---|---:|:---:|
| **ARQ-01** Sem login / sem área restrita | “Landing page sem login” | L17–18 (contradito por L167/L191: avatar com “Sair”) | Sem login; popover “Visitante · modo demonstração” | 100% | E |
| **ARQ-02** Ordem das 7 seções da Folha Viva | Folha Viva (Composição assimétrica) | L28/L41: ordem explícita | 7/7 na ordem | 100% | — |
| **ARQ-03** Layout desktop de 2 linhas, sem sidebar | Navegação superior de duas linhas | L19, L71–85 × L29 (header leve da landing) | Catálogo com 2 linhas; landing com header leve de 1 linha (“Folha Viva”) | 50% | B |
| **ARQ-04** Arquitetura mobile: header+busca, faixa, dock | Header fixo com busca e menu inferior flutuante | L19, L112–118, L149 × L58 (hambúrguer da landing) | Presente só no catálogo; landing só com hambúrguer, sem busca, faixa nem dock | 50% | B |
| **ARQ-05** Troca de arquitetura em 768 px | Desktop e mobile independentes | L102, L141 (L150 abre exceção 600–1023) | Idem (no catálogo) | 100% | — |
| **ARQ-06** Catálogo com cards, busca e filtros | Tipo “Loja ou catálogo” + template de vitrine | L11–12 (lista de funcionalidades) | Rota #/catalogo, 16 produtos | 100% | — |
| **ARQ-07** Partes ★ do template: Categorias (4 blocos) e Vitrine (4 col., selo, preço, parcelamento, filtrar/ordenar) | Template “E-commerce de moda”, partes Cabeçalho/Categorias/Vitrine | L629–642, L635 × L28 (ordem fechada da landing) × L390 (3→2→1) | 6 blocos em 4 colunas, vitrine em 4 colunas, filtrar/ordenar OK; sem parcelamento; selo só em “Novo” (4,5/6) | 75% | C |
| **ARQ-08** Conteúdo fictício substituído | Marcas de exemplo da landing, do header e do template | L64, L164, L702 (“substitua”) × L29 (logotipo “Folha Viva”) | Landing e rodapé com a marca de exemplo “Folha Viva” (3 ocorrências) | 75% | C |
| **ARQ-09** Marca “Verde Vivo” no logo e no rodapé | Nome do projeto “Verde Vivo” | L8, L64 | Só no catálogo; a landing se chama “Folha Viva” | 50% | C |
| **ARQ-10** Inspiração botânica (Verdant): editorial, serifa, vetores, respiro [J] | Verdant Atelier, paleta global prevalece | L552–620, L759 | Uma única ilustração genérica repetida nos cards, título do hero pequeno e vão de ~400 px no hero | 50% | C |
| **DSK-01** Hero assimétrico (título col. 1–8, itálico accent, imagem alta 440/+80, imagem sobreposta, CTA link) | Prévia Folha Viva | L30–35, L45–46 | Título só em ~4 colunas (376 px, 39 px de corpo); imagem 440/+80 OK (4,5/5) | 90% | C |
| **DSK-02** Cartões escalonados 0/48/96 px | Prévia Folha Viva | L35, L47 | 0/48/96 | 100% | — |
| **DSK-03** Citação recuada ≈25%, autor à direita | Prévia Folha Viva | L36 | 25%, autor à direita | 100% | — |
| **DSK-04** Imagem sangrando até a borda direita | Prévia Folha Viva | L37 | Borda direita = 1440 | 100% | — |
| **DSK-05** Chamada final alinhada à esquerda | Prévia Folha Viva | L28 | À esquerda | 100% | — |
| **DSK-06** Faixa de anúncio de 36 px (primary/onPrimary, link, ✕) | Mega Empório | L168, L183 | Idem no catálogo; ausente na landing | 50% | B |
| **DSK-07** Linha 1: 64 px, logo 28 px, busca larga 42 px, endereço, avatar, carrinho | Mega Empório, composição A | L74–75, L162–167 | Catálogo: sem endereço; “Conta” em vez de avatar (4,5/6). Landing: nenhum item | 38% | B+C |
| **DSK-08** Linha 2: 44 px, “Departamentos” + atalhos à esquerda, ativo em text/600 | Mega Empório, composição A | L76, L165, L174 × L211 | Catálogo: sem “Departamentos”, categorias espalhadas na largura toda, ativo em pílula (2/4). Landing: sem linha 2 | 25% | B+C |
| **DSK-09** Header sticky (z 40) com sombra após 8 px | Mega Empório | L189 | Catálogo OK; header leve da landing sem sombra | 75% | B |
| **DSK-10** Conteúdo com largura máx. ≈1280 (ou 1120) | Layout de duas linhas | L74/L91 × L630 | 1280 (1232 úteis) | 100% | — |
| **DSK-11** 1024–1279: excedentes em “Mais” | Layout + Mega Empório | L100 × L196 | “Mais categorias” em 1024 | 100% | — |
| **DSK-12** 768–1023: desktop compactado sem overflow | Layout + Mega Empório | L101 × L197 × L150 (3 instruções diferentes) | 7 categorias cabem; sem overflow | 100% | — |
| **DSK-13** Vitrine em 4 colunas no desktop | Template, parte Vitrine | L635 × L390 (card 3→2→1) | 4 colunas | 100% | — |
| **MOB-01** Header fixo ≈104 px (marca + busca em largura total) com safe-area | Header fixo com busca… | L115 (× L198/L202, 56+48) | Catálogo: fixo de 52+44 px, busca 358 px. Landing: header leve de 65 px sem busca | 50% | B |
| **MOB-02** Busca com fonte de 16 px que abre a tela de sugestões | Header fixo com busca… | L134, L469, L721 | 16 px; painel abaixo do header | 100% | — |
| **MOB-03** Faixa de categorias ≈52 px (pílulas com ícone, scroll-snap, ativa) | Header fixo com busca… | L116 | 52 px, snap, ativa com ponto e ícone preenchido | 100% | — |
| **MOB-04** Dock flutuante: 64 px, margens de 16, raio 22, 4 destinos, safe-area | Header fixo com busca… | L117, L725 | Idem (só no catálogo) | 100% | — |
| **MOB-05** Item ativo do dock: cor + indicador + ícone preenchido + aria-current | Header fixo com busca… | L136 | 4/4 | 100% | — |
| **MOB-06** Nada escondido atrás do dock | Header fixo com busca… | L118 | Idem (34 px) | 100% | — |
| **MOB-07** Não trocar a navegação por drawer ou hambúrguer | Arquitetura mobile escolhida | L102, L733 × L58, L198 | Catálogo OK; na landing o ☰ substitui o dock | 50% | B |
| **MOB-08** Faixa de anúncio no celular: 32 px, 1 linha, ✕ de 44 | Mega Empório | L201 | Ausente no celular (decisão do desenvolvedor) | 0% | C |
| **MOB-09** Filtros em bottom sheet (≤ 90dvh, com alça) | Drawer Soft Pill + template | L543, L687 | Idem | 100% | — |
| **MOB-10** Vitrine com 2 colunas no celular | Template, parte Vitrine | L687 × L390 | 2 colunas | 100% | — |
| **MOB-11** Hero no celular: 1 coluna assimétrica, imagem com recuo de 40, imagem menor abaixo | Prévia Folha Viva (celular) | L54–57 | 3/3 | 100% | — |
| **MOB-12** Escalonamento dos cartões removido abaixo de 768 | Folha Viva | L56 | Idem | 100% | — |
| **MOB-13** Alvos de toque ≥ 44×44 | Regras do Studio | L146, L720 | 7/12 e 11/56: botões de 42 px, links de 36 e 28 px | 61% | C |
| **PAL-01** Fundo = bg #f6faf6 | Paleta Floresta | L230 | #f6faf6 | 100% | — |
| **PAL-02** Texto = #1b2e24 | Paleta Floresta | L234 | #1b2e24 | 100% | — |
| **PAL-03** Primária #2d6a4f (botões, faixa, “Aplicar”) | Paleta Floresta | L221 | Idêntica | 100% | — |
| **PAL-04** Destaque #b07d4f (itálico do hero, contador) | Paleta Floresta | L228, L192 | Idêntico | 100% | — |
| **PAL-05** Tokens centralizados com valores exportados; sem cores fixas | Tokens exportados | L208, L753 | 44/44; 7 rgba fixos em sombras | 85% | C |
| **PAL-06** Fraunces 650 nos títulos, Inter 400 no corpo, base 15 px | Tipografia Fraunces + Inter | L270–282 | 4/4 (Google Fonts) | 100% | — |
| **PAL-07** Nada < 12 px; botões e filtros ≥ 14 px | Tipografia | L275 | Rótulos do dock (botões) com 12 px | 90% | C |
| **PAL-08** Geometria global fora dos componentes: 6/8/12, contornada, sem sombra | Formas: Médios, Contornada, Sem sombra | L292–308, L748 | Raio 22 em seções e CTAs em pílula fora dos componentes (2/3) | 67% | C |
| **PAL-09** Cores da inspiração não usadas | Decisão: paleta global prevalece | L759 | 0 | 100% | — |
| **PAL-10** Foco visível 2–3 px em focusRing | Estados visuais | L315 | 2 px #2d6a4f | 100% | — |
| **CMP-01** Estrutura do card: mídia 16/9 → etiqueta → título → texto → rodapé “Ver produto”; ícone Folha | Card Soft Pill personalizado | L330, L341–348 (× L635 4:5) | Etiqueta só nos itens “Novo” (5,5/6) | 92% | B |
| **CMP-02** Visual Soft Pill do card: raio 22, botão pílula, sem borda, sombra difusa, #fff, primária, título Inter | Card Soft Pill | L349–359 (× L292–306) | 7/7 | 100% | — |
| **CMP-03** Estados do card: hover, active 0,98, foco, 160 ms | Card Soft Pill | L380–387 | 4/4 | 100% | — |
| **CMP-04** Busca Soft Pill: lupa, “Buscar plantas…”, ⌘K, 42 px, pílula, tonal, Recentes/Sugestões, combobox | Busca Soft Pill personalizada | L405–438 | Sem o grupo “Recentes” (7/8) | 88% | C |
| **CMP-05** Drawer Soft Pill: overlay, à direita, 360–420 px, dialog modal, “Filtros”, rodapé “Aplicar filtros”, raio 22 | Drawer Soft Pill (“Painel de filtros”) | L485–531 | 7/7 (400 px) | 100% | — |
| **CMP-06** Critérios de filtro adequados a plantas | (Studio só tinha critérios genéricos) | Ausente no MP (lacuna A) | Categoria, luz, porte, cuidado, preço | 100% | E |
| **CMP-07** Estados de vazio e carregando | Regras de implementação | L752, L459 × L424 | Vazio e esqueleto; sem spinner na busca (“Buscando: não”) | 80% | B |
| **INT-01** Mega menu: clique, ≤ 760 px, 3 col. + destaque, caixa alta, foco no 1º link, Esc, clique fora | Mega Empório (prévia com mega menu) | L96, L184, L187 × L76 (largura total) | Painel em largura total (1440), aberto por categoria (6/7) | 86% | B |
| **INT-02** Busca do header: painel ao focar com a mesma largura, Ctrl+K, setas, Esc | Mega Empório + Busca Soft Pill | L190, L458 | 5/5 | 100% | — |
| **INT-03** Busca filtra os produtos | Busca | briefing | Idem (filtro ao vivo) | 100% | — |
| **INT-04** Filtros aplicam e ordenação funciona | Drawer de filtros + template | L635 | 16→5; OK | 100% | — |
| **INT-05** Drawer: Esc, overlay, botão, foco preso e devolvido | Drawer Soft Pill | L533, L213 | 5/5 | 100% | — |
| **INT-06** Linha 2 recolhe ao descer e volta ao subir | Layout de duas linhas | L95 | Entra em laço: altura de 24–42 px e scrollY oscilando sem parar depois de uma única rolagem | 0% | C |
| **INT-07** Faixa de anúncio dispensável | Mega Empório | L168 | OK (catálogo) | 100% | — |
| **INT-08** Carrinho: contador accent, incrementa, abre a sacola | Mega Empório + template | L192, L675 | 3/3 | 100% | — |
| **INT-09** Menu do avatar (nome/e-mail, Meu perfil… Sair) | Mega Empório | L191 × L17 | Itens presentes; “Visitante” no lugar de nome e e-mail | 75% | D |
| **INT-10** Toque em categoria filtra sem mover a faixa | Header fixo com busca… | L135 | Filtra, mas a faixa se desloca 14 px (2/3) | 67% | C |
| **INT-11** Dock responde e atualiza o ativo | Header fixo com busca… | L117, L136 | Início, Catálogo, Buscar (foca o campo), Sacola (drawer) | 100% | — |
| **INT-12** prefers-reduced-motion | Regras gerais | L729 | Sim | 100% | — |
| **RSP-01** Sem overflow horizontal (320–1920) | Regras gerais | L717 | 0/15 | 100% | — |
| **RSP-02** Sem texto cortado, sobreposição ou instabilidade | Regras gerais | L718–719 | Página “treme” por causa do laço do header (INT-06); vão no hero | 50% | C |
| **RSP-03** Inputs com ≥ 16 px no celular | Regras gerais | L721 | Newsletter com 14 (2/3) | 67% | C |
| **RSP-04** Celular na horizontal: barras ≤ 25% da altura | Header fixo com busca… | L140, L726 (104+52+64 px não cabem em 25% de 375 px) | 46% lendo; 54% no topo | 0% | D |
| **RSP-05** Tablet 768×1024 coerente | Layout desktop compactado | L150 | OK | 100% | — |

## 4. Comparação entre os sites

### 4.1 Decisões interpretadas de formas diferentes (indício de ambiguidade no prompt)

| Decisão | dev-1 | dev-2 | dev-3 | Trecho do MP que permite as leituras |
|---|---|---|---|---|
| Header da landing | Mega Empório + duas linhas, igual em todo o site | Igual ao dev-1 | "Header leve" da Folha Viva, com logotipo "Folha Viva", só na landing; o Mega Empório fica no catálogo | L29 × L71–77 × L155–174 |
| Navegação da landing no celular | Arquitetura mobile + ☰ complementar | Arquitetura mobile, sem ☰ | Hambúrguer apenas, sem busca, faixa nem dock | L58 × L59/L102/L149 × L198 |
| ☰ dentro da arquitetura mobile | Mantido, com os 5 itens (L198) | Não (L102: "não converta") | Não no catálogo | L198 × L102 |
| Papel do template de moda | Só a vitrine (página de catálogo) | Só a vitrine | As 8 seções do template viram a página de catálogo | L622–642 sem regra de onde entra |
| Colunas da vitrine | 3 → 2 → 1 | 3 → 2 → 1 | 4 → 3 → 2 → 1 | L390 × L635/L687 |
| Mega menu | 760 px, aberto por "Departamentos" | 760 px, aberto por "Departamentos" | Largura total, aberto por cada categoria | L76 × L184/L187 |
| Linha 2 desktop | Alinhada à esquerda | Alinhada à esquerda, com separador | Espaçamento uniforme na largura toda | L76 ("espaçamento uniforme") × L169 ("alinhada à esquerda") |
| Destinos do dock | Início · Catálogo · Favoritos · Sacola | Início · Plantas · Cuidados · Ateliê | Início · Catálogo · Buscar · Sacola | L117: "4 destinos", sem nomes (o Studio não deixa editar) |
| "stories: sim" | Lido como a faixa de categorias | Não implementado | Não implementado | L125, sem descrição |
| Faixa de anúncio no celular | Sim, 32 px | Sim, 32 px | Removida | L201 (clara); o dev-3 alegou conflito com L115 |
| Endereço de entrega | Popover com CEP | Popover com CEP | Omitido | L167 (claro, sem comportamento definido) |
| Tamanho do título do hero | 80 px | 78 px | 39 px (topo da escala) | L273 (escala até 39) × prévia de ~80 px e L567 (~96 px) |
| Celular na horizontal | Header de uma linha + dock que se esconde (27%) | Header deixa de ser fixo (17%) | Barras compactas (46%) | L140 (impossível com L115–117) |
| Etiqueta do card | Em todos os cards (categoria, Novo, Oferta…) | Em todos os cards | Só "Novo", e só nos produtos novos | L343 ("Etiqueta: Novo") |

### 4.2 O que todos acertaram (instruções claras e eficazes)

- Paleta global Floresta com 44 de 44 tokens idênticos e nenhuma cor da inspiração ou da demonstração (L759 funcionou).
- Fraunces 650 nos títulos e Inter 400 a 15 px no corpo.
- Folha Viva no desktop:
  - ordem das 7 seções;
  - cartões escalonados 0/48/96 px;
  - citação recuada 25% com o autor à direita;
  - imagem sangrando até a borda;
  - chamada final alinhada à esquerda;
  - CTA do hero como link com seta.
- Hero no celular com recuos alternados e escalonamento removido abaixo de 768 px.
- Soft Pill aplicado só aos 3 componentes aprovados.
  - O card com mídia 16/9, raio de 22 px, botão pílula, sombra difusa e título em Inter 650 foi lido do mesmo jeito pelos três, apesar da contradição com a geometria global.
- Drawer de filtros com 400 px à direita no desktop e bottom sheet de 90dvh com alça no celular; foco preso e devolvido; Esc e overlay fecham.
- Critérios de filtro inventados e adequados a plantas (luz, porte, rega ou cuidado, preço). Os três supriram a mesma lacuna do Studio.
- Busca em combobox, Ctrl+K, painel com a mesma largura do campo, setas e Esc.
- Dock com geometria exata e item ativo identificável sem depender só da cor.
- Menu do avatar resolvido como "perfil de demonstração" sem login: a mesma saída para o conflito L17 × L191.
- Nenhum overflow horizontal em 15 larguras, e nada escondido atrás do dock.
- Estados de vazio e de esqueleto, e `prefers-reduced-motion`.

## 5. Falhas por tipo (A–E)

### A — Falhas do Studio (escolha impossível ou não registrável)

| # | Falha | Efeito observado nos sites |
|---|---|---|
| A1 | Não existe módulo de **página de catálogo**. A escolha teve de passar por um template de moda. | Cada desenvolvedor montou o catálogo de um jeito diferente: só a vitrine (dev-1 e dev-2) ou o template inteiro (dev-3). |
| A2 | O **card não tem campo de preço** e mostra uma nota "4,9" fixa. | Os três puseram o preço no rodapé do card, por conta própria. |
| A3 | Não existe componente de **filtros**, e os critérios do drawer não são configuráveis. | O MP não define critérios. Os três inventaram critérios de plantas, por isso CMP-06 ficou como E. |
| A4 | **Itens de navegação do header, destinos do dock e categorias da faixa** não são editáveis. | O MP exporta itens de eletrônicos e "4 destinos" sem nome. Saíram três conjuntos de destinos diferentes no dock. |
| A5 | Não há upload de **logotipo**. | Cada um desenhou um símbolo de folha. |
| A6 | O Studio aprova prévias incompatíveis sem acusar conflito: a landing Folha Viva no celular, com hambúrguer, e a arquitetura mobile, com dock. O mesmo vale para "sem login" e o menu de perfil. | É a raiz das falhas B1, B2 e B9. |

### B — Falhas do Master Prompt (registrado, mas ambíguo, incompleto ou contraditório), com redação corrigida

| # | Trecho do MP | Efeito | Redação corrigida sugerida |
|---|---|---|---|
| B1 | L29: "Header: logotipo 'Folha Viva', navegação com 'Plantas', 'Vasos', 'Cuidados', 'Ateliê' e CTA…". Compete com L71–77 (layout de duas linhas) e L155–174 (Mega Empório). | O dev-3 usou um header diferente, com outra marca, na landing (ARQ-03, DSK-06 a 09). | "O header de **todas as páginas, inclusive a landing**, é o Mega Empório (composição A) sobre o layout de duas linhas. Do 'Header leve' da Folha Viva aproveite só o conteúdo: os itens Plantas, Vasos, Cuidados e Ateliê vão para a linha 2 depois de 'Departamentos', e o CTA 'Escolher minha planta' fica no fim da linha 2. A marca é Verde Vivo." |
| B2 | L58: "Navegação em hambúrguer abaixo de 768 px". Compete com L59, L102 e L149, e há ainda L198 (☰ do header), L608 (Verdant) e L683 (template). | Landing do dev-3 sem dock, busca nem faixa (ARQ-04, MOB-01, MOB-07). O dev-1 manteve um ☰ extra. | "Abaixo de 768 px, **todas as páginas** usam a arquitetura mobile escolhida (header fixo com busca, faixa de categorias e menu inferior flutuante). Ignore as instruções de hambúrguer da landing, do template e da inspiração. Um menu ☰ com os itens do header é **opcional** e nunca substitui o menu inferior." |
| B3 | L622–642: o template "E-commerce de moda", com as partes ★ Categorias e Vitrine, não tem regra de onde entra. L28 dá uma ordem fechada para a landing. | dev-1 e dev-2 omitiram os blocos de categoria; o dev-3 transformou o template inteiro no catálogo (ARQ-07). | "O site tem duas páginas. **Landing:** Folha Viva, na ordem de L28. **Catálogo:** estrutura do template, com Categorias (4 blocos com imagem e nome sobreposto, 4 colunas) no topo e a Vitrine logo abaixo, com filtrar/ordenar no topo. Campanha, Benefícios, Nossa origem e Newsletter são opcionais. O header é o global." |
| B4 | L390: "grade de cards reduz colunas (3 → 2 → 1)". Compete com L635 ("8 produtos em 4 colunas… foto 4:5") e L687 ("2 colunas compactas"). | Colunas diferentes em cada site (DSK-13, MOB-10). | "Vitrine do catálogo: 4 colunas a partir de 1280 px, 3 entre 1024 e 1279, 2 entre 600 e 1023 e **2 compactas abaixo de 600 px**. A mídia do card de produto é **16/9** (o componente aprovado prevalece sobre a foto 4:5 do template)." |
| B5 | L76: "cada categoria pode abrir um mega menu de largura total". Compete com L184/L187 ("até 760 px… ancorado") e L174 ("'Departamentos' (abre o mega menu)"). | Mega menu do dev-3 em largura total, aberto por categoria (INT-01). | "Só **'Departamentos'** abre o mega menu: painel de até 760 px, ancorado logo abaixo do gatilho. Os demais itens da linha 2 são links diretos, alinhados à esquerda." |
| B6 | L332 e L349–355 (Soft Pill: raio de 999/22, sem borda, sombra, "Fonte de títulos: Inter 650") × L278 e L292–306 (Fraunces, 8 px, contornada, sem sombra) e L748. | Os três convergiram (o componente vence), mas cada um gastou um item do NOTES para decidir. | Acrescentar em E: "**Precedência:** nos 3 componentes listados, as propriedades da família Soft Pill (raios, borda, sombra e fonte dos títulos internos) prevalecem sobre a geometria global e são as únicas exceções. Fora deles vale a geometria global." |
| B7 | L424: "Buscando (carregando): não" (estado da prévia). Compete com L459: "estado de carregando com spinner". | O dev-3 omitiu o spinner (CMP-07). | Exportar os estados de prévia como "Estado exibido na prévia: …" ou não exportá-los, e manter só o comportamento: "Durante a busca, troque a lupa por um spinner." |
| B8 | L343: "Etiqueta: Novo". | O dev-3 só mostra etiqueta nos produtos novos (CMP-01). | "Todo card mostra **uma etiqueta** derivada do produto (ex.: Novo, Mais vendida, Pet friendly); 'Novo' é o texto de exemplo." |
| B9 | L17 "Não existe área restrita" × L191 (menu com "Meu perfil… Sair"). | Os três criaram um perfil fictício de demonstração (ARQ-01 = E; INT-09 = D no dev-3). | Quando o fluxo é "sem login": "Troque o avatar por um ícone de ajuda ou contato; **não crie menu de perfil nem 'Sair'**." |
| B10 | L125: "stories: sim", sem descrição. | O dev-1 interpretou como a faixa de categorias; dev-2 e dev-3 ignoraram. | Remover, ou descrever: "Faixa de stories: círculos de 64 px com rótulo, abaixo da faixa de categorias…" |
| B11 | L273: escala até 39 px, sem exceção para o hero, cuja prévia tem ~80 px (L567 fala em ~96 px). | dev-3 com título de 39 px numa coluna estreita (DSK-01, ARQ-10). | "Exceção à escala: o título do hero da landing usa `clamp(40px, 6vw, 80px)` e ocupa as colunas 1–8." |
| B12 | L76: "categorias… com espaçamento uniforme" × L169: "navegação alinhada à esquerda". | Linha 2 do dev-3 espalhada pela largura (DSK-08). | "Linha 2 alinhada à esquerda, com 20–24 px entre itens." |
| B13 | L101 (faixa rolável) × L197 (☰) × L150 ("compactada ou mobile") para 768–1023 px. | Três soluções diferentes, todas aceitáveis (sem perda de nota). | Escolher uma: "De 768 a 1023 px a linha 2 vira uma faixa rolável com esmaecimento; não use ☰." |

### C — Falhas dos desenvolvedores (instrução clara não respeitada)

| Site | Falha | Requisito | Instrução clara |
|---|---|---|---|
| dev-3 | **A linha 2 do header entra num laço:** depois de uma única rolagem, a altura oscila entre 24 e 42 px e o scrollY entre 979 e 997, sem parar. A página "treme", e o Playwright não conseguiu clicar em elementos estáveis. | INT-06, RSP-02 | L95 |
| dev-3 | A marca de exemplo **"Folha Viva"** ficou na landing e no rodapé, e o catálogo se chama "Verde Vivo". | ARQ-08, ARQ-09 | L64 "Marca… fictícios: substitua"; L8 |
| dev-3 | Linha 1 sem endereço de entrega e com "Conta" no lugar do avatar; linha 2 sem "Departamentos". | DSK-07, DSK-08 | L167, L174 |
| dev-3 | Faixa de anúncio removida no celular. | MOB-08 | L201 |
| dev-3 | Vitrine sem parcelamento; selo só nos itens "Novo"; busca sem o grupo "Recentes". | ARQ-07, CMP-04 | L635, L407 |
| dev-3 | Raio de 22 px e CTAs em pílula fora dos componentes; 7 rgba fixos; botões de 42 px no celular; rótulos do dock com 12 px; newsletter com 14 px. | PAL-08, PAL-05, MOB-13, PAL-07, RSP-03 | L292–308, L753, L146, L275, L721 |
| dev-3 | Título do hero em ~4 colunas, o que abre um vão de ~400 px antes do texto; ilustração genérica repetida. | DSK-01, ARQ-10 [J] | L33 ("colunas 1–8") |
| dev-3 | A faixa de categorias se desloca 14 px ao tocar numa pílula. | INT-10 | L135 |
| dev-2 | Campo de busca com **15 px** e ordenação com 14 px no celular (provoca zoom no iOS). | MOB-02, RSP-03 | L134, L469, L721 |
| dev-2 | Card sem o ícone Folha; card sem scale 0,98 ao pressionar; botões de demonstração com 13 px. | CMP-01, CMP-03, PAL-07 | L345, L385, L275 |
| dev-1 | A imagem alta do hero começa 44 px abaixo do título (o pedido é ≈80). | DSK-01 | L33, L45 |
| dev-1, dev-2, dev-3 | Links de rodapé com 36 px de altura e links inline abaixo de 44 px. | MOB-13 | L146, L720 |

### D — Conflito ou limitação da especificação

| # | Conflito | Efeito |
|---|---|---|
| D1 | L140/L726 pedem "header + menu ≤ 25% da altura" na horizontal. Com as medidas obrigatórias (104 + 52 + 64 = 220 px), isso dá 59% de 375 px. | dev-1 ficou com 27% e dev-3 com 46%. O dev-2 só cumpriu tirando o header fixo (RSP-04). |
| D2 | "Sem login" (L17) × menu de perfil obrigatório (L191). | Perfis de demonstração. O dev-3 mostra "Visitante" sem nome nem e-mail (INT-09). |

### E — Diferenças aceitáveis

| Diferença | Por que é aceitável |
|---|---|
| Avatar e menu de perfil fictícios com aviso de demonstração (os três) | Saída razoável para B9. |
| ☰ complementar ao dock (dev-1) | Pedido em L198, sem substituir o dock. |
| Ativo da linha 2 com fundo `navActive` (dev-2) | L211 também manda usar a "cor de navegação ativa". |
| Critérios de filtro inventados (os três) | Lacuna A3, bem resolvida. |
| "Ctrl K" no lugar de "⌘K" fora do macOS (dev-1, dev-2) | Adaptação ao sistema operacional. |
| Fontes locais (dev-2) × Google Fonts (dev-1, dev-3) | O prompt não especifica. O dev-2 funciona offline. |

## 6. As 5 falhas mais importantes

1. **Landing do dev-3 sem o header e sem a arquitetura mobile escolhidos** (header leve "Folha Viva" e hambúrguer). Origem **B**: L29 e L58 contra L59, L102 e L149. A raiz é **A6**: o Studio aprovou prévias incompatíveis. Afeta 9 requisitos.
2. **Laço de recolher e expandir a linha 2 no dev-3:** a página oscila sem parar. Origem **C** (L95).
3. **Marca de exemplo "Folha Viva" mantida no dev-3**, com a loja aparecendo sob dois nomes. Origem **C** (L64).
4. **Template de moda sem regra de uso:** dev-1 e dev-2 omitiram os blocos ★ Categorias, e as colunas da vitrine divergem (3/1 contra 4/2). Origem **B** (L28 × L629–642; L390 × L635/L687), com raiz **A1**.
5. **Header do dev-3 incompleto no catálogo:** sem "Departamentos", sem endereço, sem avatar e com mega menu em largura total. Origem **C** (L167, L174) + **B** (L76 × L187).

Também pesa o campo de busca do dev-2 com 15 px no celular (C).

## 7. Evidências

- **Rubrica:** `rubrica.md`.
- **Capturas** (`capturas/`):
  - `dev-N-{desktop|tablet|mobile}-{landing|catalogo}-{dobra|inteira}.png`;
  - estados: `-mega-menu`, `-busca-foco`, `-busca-digitando`, `-busca-vazia`, `-drawer-filtros`, `-apos-adicionar`, `-sacola`, `-perfil`, `-foco-teclado`, `-header-rolando-para-{baixo|cima}`;
  - celular: `-mobile-*-topo|rolada|fim`, `-busca-toque`, `-categoria-tocada`, `-filtros-sheet`, `-hamburguer-*`, `-horizontal-*`;
  - larguras: `dev-N-w{320|768|820|1024|1920}-*.png`;
  - recortes: `dev-N-recorte-card.png`.
- **Composições lado a lado** (`composicoes/`): Studio × dev-1 × dev-2 × dev-3 na mesma altura.

  | Arquivo | Conteúdo |
  |---|---|
  | `01` | Landing desktop, dobra |
  | `02` | Landing desktop, página inteira |
  | `03` | Header e mega menu |
  | `04` | Arquitetura mobile, catálogo |
  | `05` | Arquitetura mobile, landing |
  | `06` | Hero da landing no celular |
  | `07` | Header Mega Empório no celular |
  | `08` | Card de produto |
  | `09` | Busca |
  | `10` | Drawer de filtros |
  | `11` | Filtros no celular |
  | `12` | Tablet 768 |

- **Scripts e dados** (`scripts/`):

  | Arquivo | O que faz |
  |---|---|
  | `lib.cjs`, `cfg.cjs` | Viewports e seletores por site |
  | `c01` a `c03` | Capturas e composições |
  | `m01` | Medições estáticas no desktop |
  | `m02` | Interações no desktop |
  | `m03`, `m04` | Celular e horizontal |
  | `m05` | Varredura de larguras e alvos de toque |
  | `m06-tokens.py` | Tokens e literais de cor |
  | `m07` | Tipografia e geometria |
  | `m08` | Verificações pontuais |
  | `p01` a `p05` | Sondagens, incluindo a oscilação do dev-3 |
  | `gerar_matriz.py` | Gera matriz e notas a partir das medições interpretadas |

  Os resultados brutos estão em `scripts/resultados/*.json`.
