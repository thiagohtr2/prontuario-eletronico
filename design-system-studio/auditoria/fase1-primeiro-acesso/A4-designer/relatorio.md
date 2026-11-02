# Relatório A4: designer de produto sênior construindo a identidade do "Lumen"

## 1. Aviso de persona simulada

**Este não é um teste com pessoas.** O relatório foi escrito por um agente de IA que fez o papel de **Bruno**, designer de produto sênior (10 anos, usa Figma todo dia, mantém bibliotecas e design systems, é exigente com tipografia, grid, espaçamento e hierarquia). O que está escrito aqui é o julgamento que essa persona faria, apoiado em medidas reais tiradas da página. Não substitui sessões com designers de verdade.

**Como o teste foi feito**
- Endereço: `http://127.0.0.1:4300/` (o produto se chama "Atelier UI · Design System Studio").
- Ferramentas: Chromium headless com Playwright, sem nenhum dado prévio no navegador.
- Telas: 1440×900 como padrão. Também olhei 1920×1080 e, só para conferir, 390×844.
- Volume: cerca de 55 execuções de script, cada uma com uma ou várias ações.
- Tudo foi descoberto pela interface. Não li código, README nem relatórios de outros agentes. Só analisei os arquivos que o site exportou.

**Ressalva de infraestrutura (não é defeito do produto)**
- O `launchPersistentContext` não guardava o `localStorage` de um script para o outro. Até uma chave de teste que eu mesmo gravei sumia.
- Dentro de uma mesma sessão, o salvamento automático do produto funcionou: recarreguei a página e os dados continuaram lá.
- Solução adotada: salvar o estado com `storageState` em `perfil/state.json` ao fim de cada script e carregá-lo no script seguinte.

**Onde estão os arquivos**
- Capturas: `capturas/`.
- Arquivos exportados: `exportados/`:
  - `lumen-master-prompt.md`
  - `lumen-especificacao.json`
  - `prompt-identidade-modal.txt`
  - `lumen-tokens-capturado-do-blob.css`: copiado do blob que o botão "CSS dos tokens" gera; o download em si não aconteceu (ver P8).
- Scripts: `scripts/`.

**O que escolhi para o Lumen**

| Item | Escolha |
| --- | --- |
| Tipo de projeto | Aplicativo ou SaaS |
| Fluxo de entrada | Landing page com chamada para login |
| Landing | Nexa Finance |
| Login | Produto em destaque |
| Cadastro | Página própria |
| Layout do computador | Painel financeiro com rail |
| Layout do celular | Topbar com Bottom Navigation |
| Paleta | Oceano Profundo, com a primária trocada por #0B6E4F |
| Tipografia | Títulos em Space Grotesk 600, textos em Inter 400, base de 16 px |
| Formas | Cantos grandes (14 px), superfícies elevadas, sombra sutil |
| Navegação | Header "Painel de Trabalho" (A) e sidebar "Trilho de Ícones" (A) |
| Componente | Botões, família Apple Precision |

---

## 2. Caminho seguido

Cada passo responde às 10 perguntas pedidas:
(1) o que tentei; (2) o que esperava; (3) o que aconteceu; (4) entendi?; (5) precisei voltar?; (6) achei confuso?; (7) algum controle não funcionou?; (8) abandonaria?; (9) parece profissional?; (10) o que melhoraria.

### Passo 1: página inicial e escolha do modo
Capturas: `01-home-1440-full.png`, `01-home-1440-viewport.png`

1. Tentei entender o que é o produto e escolher entre o modo Guiado e o Livre.
2. Esperava um começo rápido.
3. Encontrei:
   - Um hero claro ("Do site que você imagina ao site que a IA realmente constrói").
   - Dois cartões, um para cada modo.
   - Uma faixa de quatro etapas no fim da página.
4. Entendi, sim.
5. Não precisei voltar.
6. Não achei confuso. Só o fato de haver um "Construtor guiado" com 10 itens e uma lista "Estrutura/Identidade" com os mesmos módulos na mesma sidebar já sugere redundância.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Parece profissional, mas com cara de SaaS genérico: Inter, índigo #4C46DC, cartões arredondados, check-lists.
10. Melhorias:
    - Na faixa de quatro etapas, os títulos estão desalinhados: "Estrutura do site" em y=965, "Cores e tipografia" e "Menus, botões…" em y=980, "Master Prompt" em y=973.
    - Os títulos deveriam ficar na mesma linha de base.

### Passo 2: objetivo do projeto
Capturas: `02-guiado-objetivo.png`, `03b-objetivo-form-viewport.png`

1. Escolhi o tipo de projeto e preenchi nome, objetivo, descrição, público, finalidade, módulos e tecnologia.
2. Esperava um formulário alinhado e o botão de continuar liberado.
3. Funcionou, e as sugestões de módulos são úteis. Porém:
   - O campo "Nome do projeto" tem **53,5 px de altura**; os vizinhos têm **40 px**.
   - Ele começa 13 px abaixo do campo "Objetivo", na mesma linha da grade.
   - Nos cartões de tipo, a distância entre título e descrição varia de 3 px a 13 px conforme o tamanho do texto.
4. Entendi.
5. Não precisei voltar.
6. Não achei confuso.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Parece profissional, com deslizes de alinhamento.
10. Melhorias:
    - Dar a mesma altura a todos os campos e reservar espaço para o texto de ajuda.
    - Alinhar as descrições dos cartões pelo topo.

### Passo 3: como as pessoas entram
Capturas: `04-entrada.png`, `05-entrada-escolhida.png`

1. Escolhi "Landing page com chamada para login".
2. Esperava diagramas claros.
3. Os diagramas são bons conceitualmente, mas os rótulos internos ("Landing", "Login", "Sistema") têm cerca de 8 px e mal se leem a 1440. Antes da escolha, a barra de abas tem uma aba só.
4. Entendi.
5. Não precisei voltar.
6. Pouco confuso.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Parece profissional.
10. Aumentar os rótulos dos diagramas e esconder a barra de abas quando houver uma aba só.

### Passo 4: galeria de landing pages e prévia
Capturas: `06-landing-galeria-viewport.png`, `06-landing-galeria-full.png`, `07-card-*.png`, `09` a `11-preview-nexa-*.png`

1. Procurei uma landing adequada a uma fintech pessoal e abri a prévia.
2. Esperava ver as miniaturas logo e uma prévia fiel.
3. Aconteceu o seguinte:
   - A 1440×900, **a primeira linha de miniaturas aparece só com cerca de 70 px acima da dobra**. Antes dela vêm breadcrumb, stepper, título, abas, aviso, barra de seleção e 14 filtros.
   - A prévia em modal funciona (computador e celular, "Cores do modelo" e "Minha identidade").
   - A miniatura mostra o azul original (#0F62FE), mas a prévia abre em "Minha identidade" (na hora, preto neutro).
   - Há três controles para a mesma ideia: as abas "Cores do modelo / Minha identidade" e o interruptor "Manter as cores originais".
   - O toast de confirmação cobre o botão "Prompt deste elemento" no rodapé do modal (`09-preview-nexa-desktop.png`).
   - O botão "Modelo selecionado" tem o lilás claro de um botão desabilitado.
4. Entendi, depois de ler.
5. Não precisei voltar.
6. Achei confuso o trio de controles de cor.
7. Nenhum controle falhou.
8. Não abandonaria.
9. As miniaturas são bem feitas. A prévia é boa.
10. Melhorias:
    - Compactar o cabeçalho das galerias.
    - Juntar os controles de cor em um só.
    - Diferenciar visualmente "selecionado" de "desabilitado".
    - Mostrar o toast fora da área de ações.

### Passo 5: login e cadastro
Capturas: `12-login-galeria-full.png`, `12-cadastro-galeria-full.png`

1. Escolhi "Produto em destaque" para o login e "Página própria" para o cadastro.
2. Esperava modelos fáceis de distinguir.
3. Há 24 logins e 8 cadastros, todos renderizados com a identidade do projeto, o que é ótimo. Mas cerca de 8 logins viram "um cartão branco centralizado" na miniatura e só se distinguem pelo nome (detalhes na seção 3).
4. Entendi.
5. Não precisei voltar.
6. Não achei confuso.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Parece profissional.
10. Usar miniaturas maiores ou destacar na miniatura o que diferencia cada modelo (o QR, o avatar, as etapas).

### Passo 6: arquitetura do computador
Capturas: `14-desktop-viewport.png`, `14-desktop-full.png`, `15-desktop-painel-financeiro.png`

1. Escolhi "Painel financeiro com rail".
2. Esperava um esqueleto com medidas.
3. São 42 esquemas em 8 famílias, legendas coloridas, painel de detalhe com medidas (Header ≈64 px, Rail ≈76 px, Faixa ≈112 px) e boa descrição. Problemas:
   - O selo "✓ Escolhido" cobre o rótulo "INDICADORES" da miniatura.
   - Ao chegar, o toast da etapa anterior ainda está na tela.
4. Entendi.
5. Não precisei voltar.
6. Não achei confuso.
7. Nenhum controle falhou.
8. Não abandonaria.
9. É a etapa mais profissional do fluxo. As proporções da prévia batem com as medidas (ver seção 4).
10. Posicionar o selo fora da área do desenho e limpar os toasts ao trocar de etapa.

### Passo 7: arquitetura do celular
Capturas: `16-mobile-viewport.png`, `16-mobile-full.png`

1. Escolhi "Topbar com Bottom Navigation".
2. Esperava comparar miniaturas lado a lado.
3. São 44 modelos, mas a galeria ocupa **uma coluna estreita de cerca de 314 px com 2 miniaturas minúsculas**; o painel de detalhe toma dois terços da largura. A página tem 9.647 px de altura.
4. Entendi.
5. Não precisei voltar.
6. Não achei confuso.
7. Nenhum controle falhou.
8. Ficaria cansado.
9. A diagramação é fraca.
10. Mais colunas na galeria e o celular grande em painel fixo ou modal.

### Passo 8: revisão do esqueleto
Captura: `18-revisao-full.png`

1. Conferi tudo antes de aprovar.
2. Esperava um resumo fiel.
3. O resumo é bom, com links "Alterar". Mas há três falhas:
   - O título da seção diz **"Esqueleto aprovado" antes da aprovação**.
   - O cartão do cadastro mostra **"Sem prévia"**, embora a etapa 6 tenha prévia do cadastro (`22-previa-cadastro.png`).
   - A miniatura do celular usa a marca "Orla" e números de e-commerce (Pedidos, Clientes).
4. Entendi.
5. Não precisei voltar.
6. Pouco confuso.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Parece profissional, mas o texto contradiz o estado.
10. Escrever "Esqueleto para aprovar", mostrar a prévia do cadastro e usar o nome do projeto nas prévias.

### Passo 9: prévia integrada
Capturas: `19-previa-integrada-full.png`, `20-previa-zoom-indicadores.png`, `21-previa-celular.png`, `22-previa-*.png`, `49-previa-app-identidade-final.png`

1. Quis ver o produto montado.
2. Esperava um painel de finanças pessoais com saldo, receitas e despesas, como a descrição do layout promete.
3. Aconteceu o seguinte:
   - A faixa **"Indicadores" mostra um cartão de contato ("Marina Costa", "Plano / Pro anual") cortado ao meio**: `overflow:hidden`, altura de 70 px para um conteúdo de 274 px.
   - Os KPIs são de CRM: Receita, Clientes ativos, Ticket médio, Satisfação.
   - A marca muda conforme a tela: "Lumen" no computador, "Orla" no celular e, depois de escolher o header, "Jacarandá".
   - Há dois logotipos, um no rail e outro no header.
4. Entendi.
5. Não precisei voltar.
6. Achei confuso ver que "o meu" painel não é meu.
7. A faixa de indicadores está quebrada visualmente.
8. Neste ponto um cliente perderia confiança.
9. Não parece profissional neste trecho.
10. Usar conteúdo coerente com o layout escolhido, o nome do projeto em todas as prévias e corrigir o corte.

### Passo 10: identidade, paletas
Capturas: `23-cores-viewport.png`, `23-cores-full.png`, `24-cores-oceano.png`

1. Escolhi uma paleta para a fintech (Oceano Profundo).
2. Esperava comparar paletas com facilidade.
3. São 60 paletas em 11 grupos, com busca, numa grade de 2 colunas de cartões com a mesma mini-UI. A página tem 9.750 px.
   - A busca ("Oceano") funcionou.
   - O selo "Selecionado" cobre a barra superior da miniatura.
   - A 1920 não há resumo de "paleta atual" no topo (`44-1920-identidade.png`).
4. Entendi.
5. Não precisei voltar.
6. Não achei confuso.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Parece profissional, mas os valores são previsíveis (ver seção 3).
10. Mais colunas, uma barra fixa com a paleta atual e um modo de comparar paletas lado a lado.

### Passo 11: ajustar cores
Capturas: `25b-ajustar-cores-viewport.png`, `26-primaria-alterada.png`

1. Troquei a primária para a cor da marca (#0B6E4F).
2. Esperava que hover, active, soft, foco, link e selected fossem recalculados.
3. **Nada foi recalculado**:
   - Hover continua #035F91 (azul), active #025481, soft #E1EDF4, foco #0369A1, link #0369A1.
   - Na prévia aparece um botão "Primário" verde ao lado de um "Hover" azul.
   - Rótulos truncados: "Primária — ho…", "Texto sobre pr…".
   - Os selos de contraste WCAG, por outro lado, são ótimos.
4. Entendi o que aconteceu.
5. Voltei a conferir.
6. Achei confuso.
7. Faltou a derivação automática dos tokens, que eu esperava.
8. Um designer refaria 8 tokens à mão.
9. Não é profissional como sistema de tokens.
10. Oferecer "Regenerar tokens derivados a partir da primária", ou pelo menos avisar que há tokens dependentes.

### Passo 12: tipografia
Capturas: `27-tipografia-viewport.png`, `28-tipografia-escolhida.png`

1. Escolhi Space Grotesk para títulos, peso Semi-negrito e base de 16 px.
2. Esperava amostras reais e controle de escala.
3. Há só **6 fontes** (Inter, fonte do sistema, Space Grotesk, Fraunces, Georgia, JetBrains Mono).
   - A amostra é só "Ag".
   - Não há números, algarismos tabulares, entrelinha ou espaçamento entre letras.
   - Mudar o tamanho base **só altera o título da prévia** (22 → 26 → 23 px); o corpo fica em 13 px.
   - As fontes carregaram corretamente.
4. Entendi.
5. Voltei para medir.
6. Não achei confuso.
7. O tamanho base não aparece na prévia como esperado.
8. Para a persona, é raso.
9. Parece pouco profissional.
10. Mostrar amostras com números e valores em moeda, oferecer escala, entrelinha e tabular-nums, e fazer a prévia respeitar o tamanho base.

### Passo 13: formas e superfícies
Captura: `30-formas-escolhidas.png`

1. Escolhi cantos grandes (14 px), superfície elevada e sombra sutil.
2. Esperava que a prévia refletisse a escolha.
3. Refletiu: botão com raio de 14 px, cartão com 20 px, linha selecionada com 10 px e sombra idêntica à exportada. Mas, em botões de 34 px, "Grandes" já parece pílula.
4. Entendi.
5. Não precisei voltar.
6. Não achei confuso.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Parece profissional.
10. Mostrar a escala 10/14/20 junto da opção e uma amostra de cartão grande.

### Passo 14: headers e sidebars
Capturas: `33-navegacao-viewport.png`, `34b-header-selecionado.png`, `35-sidebar-trilho.png`, `36-combinacao.png`

1. Escolhi o header "Painel de Trabalho" e a sidebar "Trilho de Ícones", e conferi a combinação.
2. Esperava prévias interativas coerentes.
3. As prévias são interativas e bem acabadas, e herdam a paleta. Porém:
   - A página tem 18.517 px.
   - A palavra "Selecionar" do texto de instrução está em negrito como se fosse um botão (cliquei nela por engano).
   - Na combinação, **o header usa navBg #0C4A6E e o rail usa #091420**: duas cores de navegação na mesma tela.
   - Há duas marcas fictícias juntas ("Jacarandá" e "S").
4. Entendi.
5. Precisei refazer a seleção da sidebar.
6. Pouco confuso.
7. Nenhum controle falhou.
8. Não abandonaria.
9. Parece profissional, com ressalvas.
10. Usar o mesmo token de navegação nas duas peças e a marca do projeto nas prévias.

### Passo 15: componentes
Capturas: `37-componentes-full.png`, `38-comparativo-botoes-semelhantes.png`, `39-botao-adicionado.png`

1. Adicionei Botões na família Apple Precision.
2. Esperava variações claras e respeito à identidade.
3. São 16 "famílias", mas várias são quase iguais (ver seção 3). Na família escolhida:
   - O botão sai com **fonte do sistema e raio de 10 px**, não com a minha Inter/Space Grotesk e o raio de 14 px.
   - O painel "Token global" afirma "Aa Space Grotesk".
   - O painel de personalização em si (estados Normal/Hover/Focus/Active/Disabled, instância, exceção) é muito bom.
4. Entendi.
5. Não precisei voltar.
6. Achei confusa a promessa de herança.
7. A herança de fonte e raio não é cumprida.
8. Não abandonaria.
9. O painel é profissional; as famílias são clichê.
10. Deixar explícito "esta família substitui fonte e raio" ou oferecer "seguir identidade".

### Passo 16: Master Prompt e exportação
Capturas: `40-entrega-viewport.png`, `41-entrega-json.png`, `42-entrega-contradicoes.png`, `43-entrega-itens.png`

1. Baixei o .md e o JSON, e tentei baixar o CSS dos tokens.
2. Esperava uma especificação fiel e sem contradições.
3. Aconteceu o seguinte:
   - O .md (34.714 caracteres) e o JSON foram baixados.
   - O contador diz **"0 contradições"**, mas há várias (seção 4).
   - O botão "CSS dos tokens" gerou um blob `lumen-tokens.css` (3.920 bytes) e clicou num link, mas **nenhum download aconteceu e não houve nenhum aviso**. No mesmo navegador, o "Baixar .md" funcionou.
4. Entendi.
5. Precisei voltar para investigar.
6. Não achei confuso.
7. O botão "CSS dos tokens" e o detector de contradições falharam.
8. Para a persona, isso põe em dúvida o artefato principal do produto.
9. Profissional na forma, frágil no conteúdo.
10. Fazer o detector cruzar componentes, identidade e layout, e corrigir o download do CSS.

### Passo 17: 1920×1080 e modo Livre (Inspiração e Templates)
Capturas: `44-1920-*.png`

1. Olhei a ferramenta em tela grande e as galerias que o modo Guiado não mostra.
2. Esperava melhor uso do espaço.
3. Aconteceu o seguinte:
   - O conteúdo fica limitado a 1.360 px com 178 px de respiro à esquerda.
   - A 1920 o stepper mostra "9. Componentes" inteiro; a 1440 aparece truncado ("9. Componen…").
   - A **Inspiration Gallery** (20 sites) tem os visuais mais autorais do produto (Verdant, Formica, Terra/Form).
   - O **Template Studio** tem um modelo "Fintech — Conta digital" mais adequado ao Lumen do que a Nexa. **Nenhum dos dois aparece no fluxo guiado.**
4. Entendi.
5. Não precisei voltar.
6. Achei confuso ter três galerias de páginas ("Landing pages", "Templates" e "Inspiração").
7. Nenhum controle falhou.
8. Não abandonaria.
9. As galerias livres são as mais profissionais.
10. Levar a Inspiração e os Templates relevantes para dentro do fluxo guiado e unificar a taxonomia.

---

## 3. Crítica das galerias e modelos

### O que é bonito, e por quê
- **Inspiration Gallery** (`44-1920-inspiracao.png`): Verdant Atelier (Fraunces itálico, moldura em arco, papel creme), VOLT/MOTORS e Formica têm direção de arte real, contraste tipográfico e composição assimétrica. É o único lugar que não parece template.
- **Landings editoriais e de pôster** (`06-landing-galeria-full.png`):
  - Sapore Café: tipografia em pôster sobre laranja, com bom peso visual.
  - North Studio e Éter Fashion: tipografia monumental bem resolvida.
  - Monograma: logotipo central e fios editoriais.
  - Variedade real de arquitetura; não são só trocas de cor.
- **Prévia da Nexa** (`10-preview-nexa-scroll2.png`): a tabela de planos tem boa hierarquia (preço 28–32 px, rótulo "Mais escolhido" bem posicionado, checks alinhados). A versão no celular (`11-preview-nexa-celular.png`) reorganiza com critério.
- **Esquemas de layout** (`15-desktop-painel-financeiro.png`): desenhos esquemáticos com legenda por cor e proporções corretas, num nível didático raro.
- **Sidebars e headers** (`35-sidebar-trilho.png`): prévias interativas e bem detalhadas, com estados e contadores, que herdam a paleta.

### O que é fraco, e por quê
- **Cara de template de IA nas peças de SaaS.** Aurora Flow, Nexa, Atlas Learn e Metric Studio repetem a mesma fórmula:
  - selo-pílula "Novo: …" acima do título;
  - título centralizado em duas linhas;
  - dois CTAs;
  - linha de letras miúdas ("14 dias grátis · sem cartão");
  - mockup de dashboard em moldura de navegador.

  A tipografia é Inter em todas, o fundo é lavanda ou azul em degradê.
- **Mockups clonados.** Nexa (`07-card-Nexa.png`) e Metric Studio (`07-card-MetricStudio.png`) usam o mesmo esqueleto de dashboard: sidebar "Visão geral", 4 KPIs, "Últimos 30 dias" e **as mesmas variações (▲ 4,0% / ▲ 7,1% / ▲ 10,2% / — estável)**. Muda só a cor.
- **Viúvas tipográficas** nos títulos: "fluxo" sozinho na terceira linha (Aurora Flow, `07-card-AuroraFlow.png`) e "painel" sozinho no celular (`11-preview-nexa-celular.png`).
- **Legenda do cartão**: o separador "·" fica órfão no fim da linha ("Plataforma financeira ·", com a categoria na linha de baixo; `07-card-Nexa.png`).
- **Paletas com valores padrão do Tailwind.** Exemplos na Oceano Profundo:
  - primária #0369A1 (sky-700), secundária #0E7490 (cyan-700), destaque #06B6D4 (cyan-500), fundo #F0F9FF (sky-50), navegação #0C4A6E (sky-900);
  - info #2563EB (blue-600), erro #DC2626 (red-600).

  Um designer reconhece isso na hora como "default de framework".

### Variantes que só mudam de cor, ou quase iguais
- **Botões** (`38-comparativo-botoes-semelhantes.png`): Soft Pill, Soft Neumorphic, Bento Soft e Modern Material dão praticamente o mesmo par "pílula verde + pílula tonal". Só o Neumorphic acrescenta sombra. Apple Precision e Compact Pro também ficam próximos.
- **Headers SaaS** (`34b-header-selecionado.png`): Jacarandá, Babaçu, Sapucaia, Seriema e Tucano são a mesma barra navy com logo, abas, busca e avatar. Todos repetem o mesmo corpo (R$ 48,2 mil, 1.284, 312).
- **Logins** (`12-login-galeria-full.png`): Clássico central, Tela cheia clean, Bem-vindo de volta, Janela compacta, Acesso com etapas e Link mágico, todos como cartão branco centralizado na miniatura.
- **Paletas**: os 60 cartões têm a mesma mini-UI; a comparação depende só das tarjas de cor.

### O que falta, olhando para o Lumen (finanças pessoais B2C)
- Landing de **finanças pessoais B2C**: a Nexa é B2B ("Conta PJ"). Existe "Fintech — Conta digital" no Template Studio, mas fora do fluxo.
- **Componentes de dados financeiros**: anel ou barra de meta, gráfico de gastos por categoria (donut ou treemap), lista de transações agrupada por dia, valores com sinal e algarismos tabulares. A prévia integrada mostra CRM.
- **Tipografia para números**: falta especímen com números, cifrões e tabular-nums.
- **Modo escuro da mesma paleta**: as paletas são "clara" ou "escura", não pares.

---

## 4. Fidelidade: escolha visual × especificação exportada

### O que bate (medido na tela e conferido no export)

| Escolha | Medida na tela | Master Prompt / CSS / JSON | Resultado |
| --- | --- | --- | --- |
| Raios (Grandes) | botão 14 px, cartão 20 px, linha selecionada 10 px | `raioPequeno 10px · raioMedio 14px · raioGrande 20px`; `--radius-sm/md/lg: 10/14/20px` | ✅ |
| Sombra sutil | `rgba(16,16,24,.06) 0 1px 2px, rgba(16,16,24,.05) 0 1px 3px` no cartão | `--shadow-surface: 0 1px 2px rgba(16,16,24,.06), 0 1px 3px rgba(16,16,24,.05)` | ✅ idêntico |
| Fontes | títulos em "Space Grotesk Variable" 600, texto em "Inter Variable" 400 | "Títulos em Space Grotesk (peso 600) e textos em Inter (peso 400), tamanho base 16 px" | ✅ |
| Rail e header do layout | prévia de 454×283 px: rail de 27 px (= 76 px em 1280), header de 23 px (≈ 65 px em 800) | `grid-template-columns: 76px …; grid-template-rows: 64px 112px …` | ✅ |
| Primária manual | #0B6E4F | "Tokens ajustados manualmente pelo usuário: `primary` = #0b6e4f" | ✅ registrada |
| Tokens | 44 valores lidos nos campos hex | tabela da seção D do .md = `:root` do CSS = `identity.tokens` do JSON | ✅ consistentes entre os três formatos |

### O que não bate, ou se contradiz (e o detector marcou "0 contradições")

1. **Primária verde com estados azuis.**
   - O CSS exportado tem `--color-primary: #0b6e4f;` e logo abaixo `--color-primary-hover: #035f91;`, `--color-focus-ring: #0369a1;`, `--color-link: #0369a1;`, `--color-selected-text: #0369a1;`.
   - A IA vai implementar um botão verde que fica azul no hover. A prévia mostra exatamente isso (`26-primaria-alterada.png`).
2. **O prompt da paleta descreve a cor antiga.**
   - Trecho de `prompt-identidade-modal.txt`: "**Estrutura** – Primária #0369a1, …" e, mais abaixo, "**Exceções** – Token alterado pelo usuário: Cor primária = #0b6e4f."
   - A cor da marca aparece como "exceção" de si mesma.
3. **O componente contradiz a identidade.**
   - No .md, Componente Botões: "Fonte de títulos: Fonte do sistema 650", "Fonte de texto: Fonte do sistema", "Tamanho base: 14 px", "Raio dos controles: 10 px".
   - Na seção D: Space Grotesk / Inter, base de 16 px, raioMedio de 14 px.
   - Na tela, o botão mediu `system-ui`, 14 px, peso 560, raio de 10 px, 38 px de altura.
4. **Uma cor que não existe na paleta.** O componente traz "Destaque: #048da5"; o accent aprovado é #06B6D4.
5. **Três regras de foco no mesmo item.**
   - "anel de 3 px em … focusRing a 35%";
   - "Foco com anel de 4 px na primária a 30%";
   - "focus-visible com estilo de foco da família".

   A identidade diz "anel de 2–3 px na cor focusRing".
6. **Hover e active duplicados.** "Hover: fundo primária-hover; active: primária-active" convive com "Hover sutil (fundo +4%); active com opacidade 0,7".
7. **Altura do header.** O layout diz `grid-template-rows: 64px …` e "header ≈64 px"; o header escolhido diz "Barra principal com 60 px de altura". Na prévia da navegação mediu 58 px.
8. **Largura do rail.** O layout diz "Rail integral de ≈76 px"; a sidebar escolhida diz "Formato trilho compacto de 72 px".
9. **Cor da sidebar.**
   - O item diz "Superfície: faixa escura invertida (derivada da cor de texto principal)" e, nas observações, "Cores dos tokens … (navBg …)".
   - Medido: rail #091420 na prévia de navegação e navBg #0C4A6E na prévia integrada.
10. **Landing com CTA duplicado.** O .md diz "Header: … CTA 'Abrir conta grátis'" e, duas linhas depois, "Header com navegação, 'Entrar' e CTA de teste grátis." (regra genérica da arquitetura misturada à específica).
11. **Altura de botão.**
    - Na prévia da identidade, o botão mede 34 px.
    - O CSS exportado diz `.btn-primary { min-height: 44px }`.
    - O componente diz "controles com 38 px" e "alturaMd: 40–44 px".
12. **Raio fora da escala.** Na prévia integrada, o CTA da landing mediu `border-radius: 12px`, valor que não está na escala 10/14/20.
13. **Escala de espaçamento.** "unidadeDeEspaco: 8px" contra "múltiplos de 4 px". O componente traz "paddingInterno: 13 px", fora das duas.
14. **Prévia × descrição do layout.** O layout promete uma "faixa com os principais números (saldo, receitas, despesas)"; a prévia integrada mostra Receita, Clientes ativos, Ticket médio e Satisfação, e um cartão de contato cortado (`20-previa-zoom-indicadores.png`).
15. **Tamanho base.** Escolhi 16 px e o export diz `--font-size-base: 16px`, mas a prévia mantém o corpo em 13 px para qualquer valor (14 a 18).

**Conclusão desta seção**
- Para valores simples (raio, sombra, fonte, hex de tokens, medidas do layout), a exportação é **fiel** ao que vi.
- A fidelidade quebra quando **duas escolhas interagem**: primária × derivados, família × identidade, layout × header/sidebar. Nesses casos o Master Prompt entrega instruções contraditórias e afirma não haver contradição.

---

## 5. Crítica da interface da própria ferramenta

### Objetivo (medido)
- **Muitos tamanhos de fonte com meio pixel.** Só na página inicial encontrei 16 combinações de tamanho e peso: 46/720, 17/650, 15.5/700, 15/700, 14.5/520, 14.5/560, 14.5/600, 13.5/600, 13.5/650, 12.5/600, 11.5/650, entre outras. Os pesos 520, 560, 650 e 720 aparecem misturados, o que indica escala tipográfica sem disciplina.
- **Desalinhamentos:**
  - títulos da faixa de quatro etapas da home desalinhados até 15 px;
  - campo "Nome do projeto" com 53,5 px contra 40 px nos outros campos, e 13 px fora da linha;
  - espaço entre título e descrição de 3 a 13 px nos cartões de tipo de projeto.
- **Sobreposições:**
  - selo "Escolhido" sobre o rótulo do esquema;
  - selo "Selecionado" sobre a miniatura da paleta;
  - selo "Prévia interativa" sobre o gráfico dos headers;
  - toasts sobre botões de rodapé e de modal, que **persistem ao trocar de etapa** (`14-desktop-viewport.png`).
- **Truncamentos:** "9. Componen…" no stepper a 1440; "Primária — ho…", "Primária — act…", "Texto sobre pr…" nos tokens.
- **Rótulos ilegíveis:** rótulos de cerca de 8 px nos diagramas de entrada.
- **Densidade:**
  - a 1440×900 as galerias começam abaixo da dobra;
  - alturas de página de 7.972 px (desktop), 9.647 px (mobile), 9.750 px (paletas) e 18.517 px (navegação).
- **Estado confundível:** "Modelo selecionado" e o botão "Continuar" desabilitado usam o mesmo índigo a 50% de opacidade, com texto branco (contraste aproximado de 2,4:1).
- **Microcopy contraditória:** "Esqueleto aprovado" antes de aprovar.
- **Responsivo da ferramenta:** a 390 px não há rolagem horizontal (`47-390-*.png`).

### Preferência (julgamento estético da persona)
- **Visual competente, mas genérico:** Inter, índigo #4C46DC, cartões com borda fina e raio de 8 px, pílulas de filtro, faixa lateral roxa nos avisos. Lembra muitos painéis "shadcn/Linear-like" e não tem assinatura própria.
- **Excesso de explicação:** cada etapa abre com título, parágrafo, aviso "Como escolher" e texto de filtro. Para um designer sênior é ruído. Seria bom um modo "especialista" com cabeçalho compacto.
- **Hierarquia do índigo:** os CTAs "Adicionar ao projeto" em índigo forte competem com os componentes que estão sendo avaliados. Botões secundários seriam mais neutros.
- **Sidebar duplicada:** a lista "Construtor guiado" e a lista "Estrutura/Identidade" repetem os módulos. Eu esconderia a segunda no modo Guiado.
- **Ponto positivo:** consistência. Os mesmos componentes (abas, chips com contador, cartões, rodapé fixo Voltar/Continuar) se repetem em todas as etapas; a ferramenta tem um sistema.

---

## 6. Problemas

Gravidade: **Alta** (compromete o resultado entregue), **Média** (atrapalha ou engana), **Baixa** (acabamento).

| # | Título | Onde | Evidência | Gravidade | Sugestão concreta |
| --- | --- | --- | --- | --- | --- |
| P1 | Trocar a primária não recalcula os tokens derivados | Etapa 7 › Ajustar cores | `26-primaria-alterada.png`; CSS: `--color-primary:#0b6e4f` com `--color-primary-hover:#035f91`, `--color-focus-ring:#0369a1` | Alta | Recalcular hover, active, soft, focus, link, selected e gradiente a partir da primária (ou oferecer "regenerar"), com aviso dos tokens dependentes |
| P2 | Detector diz "0 contradições" com várias contradições reais | Etapa 10 › Contradições | `42-entrega-contradicoes.png`; seção 4, itens 3 a 13 | Alta | Cruzar família × identidade (fonte, raio, base), layout × header/sidebar (64/60, 76/72) e regras de foco e hover duplicadas |
| P3 | A família do componente substitui fonte e raio da identidade sem avisar | Etapa 9 › Botões | `39-botao-adicionado.png` (painel diz "Space Grotesk"); medido system-ui, raio 10 px; .md "Fonte do sistema… Raio dos controles: 10 px" | Alta | Opção "seguir identidade" como padrão e, quando a família mudar algo, registrar como exceção explícita |
| P4 | Prompt da paleta descreve a primária antiga e trata a cor da marca como exceção | Etapa 7 › Prompt da identidade | `prompt-identidade-modal.txt`: "Primária #0369a1" + "Exceções – … Cor primária = #0b6e4f" | Alta | Gerar a estrutura com os valores efetivos e listar como exceção só o que foge da paleta |
| P5 | Prévia integrada: faixa "Indicadores" cortada e conteúdo de CRM | Etapa 6 | `20-previa-zoom-indicadores.png` (altura 70 px, scrollHeight 274 px); KPIs Receita, Clientes, Ticket, Satisfação | Média-Alta | Mostrar KPIs de saldo, receitas e despesas como o layout descreve, sem cortar, e usar dados do domínio do projeto |
| P6 | Marca inconsistente nas prévias (Lumen / Orla / Jacarandá / Marca / "S") | Etapas 5, 6, 7 e 8 | `18-revisao-full.png`, `21-previa-celular.png`, `36-combinacao.png`, `49-previa-app-identidade-final.png` | Média | Injetar o nome do projeto em todas as prévias e mostrar um logotipo só |
| P7 | "Tamanho base do texto" só altera os títulos da prévia | Etapa 7 › Tipografia | corpo em 13 px para 15, 16 e 18; título em 22, 23 e 26 px | Média | Aplicar a base ao corpo, aos campos e aos botões da prévia |
| P8 | "CSS dos tokens" não baixa nada e não dá retorno | Etapa 7 | `32-css-tokens-clique.png`; blob `lumen-tokens.css` de 3.920 bytes criado e link clicado, sem download (o ".md" funciona no mesmo navegador) | Média (provável defeito; confirmar em navegador real) | Usar o mesmo mecanismo do "Baixar .md" e mostrar um aviso de sucesso |
| P9 | Medidas conflitantes entre layout e navegação | Etapas 3 e 8 → Master Prompt | header de 64 px no layout × 60 px no header (58 px medidos); rail de 76 × 72 px | Média | Uma fonte de verdade: o layout usa a medida da peça escolhida, ou o contrário |
| P10 | Duas cores de navegação na combinação header + sidebar | Etapa 8 › Combinação | header #0C4A6E × rail #091420 (`36-combinacao.png`) | Média | Usar o token navBg nas duas peças, ou declarar a variação como exceção |
| P11 | Variantes quase idênticas (botões, headers SaaS, logins, mockups clonados) | Etapas 2, 8 e 9 | `38-comparativo-botoes-semelhantes.png`; Nexa e Metric Studio com os mesmos ▲4,0/7,1/10,2% | Média (estética) | Fundir variantes redundantes e garantir pelo menos 3 diferenças visíveis entre famílias |
| P12 | Galerias começam abaixo da dobra a 1440×900 | Etapas 2 a 4 e 7 | `06-landing-galeria-viewport.png`, `14-desktop-viewport.png`, `16-mobile-viewport.png` | Média | Cabeçalho compacto e recolhível, filtros numa linha com rolagem horizontal, aviso "Como escolher" fechável |
| P13 | Galeria mobile espremida em coluna de cerca de 314 px | Etapa 4 (Mobile) | `16-mobile-viewport.png` | Média | Grade de 4 a 6 colunas e o celular grande num painel fixo menor ou em modal |
| P14 | Tipografia rasa para um design system | Etapa 7 › Tipografia | 6 fontes, amostra "Ag", sem escala, entrelinha ou tabular | Média | Especímen com números e moeda, controle de escala e entrelinha, opção de tabular-nums (essencial em finanças) |
| P15 | Taxonomia de galerias sobreposta; o melhor conteúdo fica fora do Guiado | Modo Livre | `44-1920-inspiracao.png`, `44-1920-templates.png` | Média | Mostrar Inspiração e Templates relevantes dentro da etapa 2 (ex.: "Fintech — Conta digital") |
| P16 | Toasts persistem entre etapas e cobrem ações | Global | `09-preview-nexa-desktop.png`, `14-desktop-viewport.png`, `39-botao-adicionado.png` | Baixa-Média | Fechar o toast ao trocar de rota e posicioná-lo acima do rodapé fixo |
| P17 | Revisão: "Esqueleto aprovado" antes da aprovação; cadastro "Sem prévia" | Etapa 5 | `18-revisao-full.png` | Baixa | Ajustar o texto e reaproveitar a prévia do cadastro da etapa 6 |
| P18 | Selos sobrepõem o conteúdo das miniaturas | Etapas 3 e 7 | `15-desktop-painel-financeiro.png`, `23-cores-viewport.png` | Baixa | Selo fora da área do desenho, ou só borda e check no canto da legenda |
| P19 | Campo "Nome do projeto" fora do padrão (53,5 × 40 px, deslocado 13 px) | Etapa 1 | `03b-objetivo-form-viewport.png` | Baixa | Mesma altura e alinhamento; espaço reservado para o texto de ajuda |
| P20 | Títulos desalinhados na faixa de quatro etapas da home | Início | y = 965 / 980 / 980 / 973 | Baixa | Grade com alinhamento pelo topo, sem distribuição vertical |
| P21 | Truncamentos (stepper, rótulos de token) e rótulos de cerca de 8 px nos diagramas | Etapas 1 a 10 e 7 | `14-desktop-viewport.png`, `25b-ajustar-cores-viewport.png`, `04-entrada.png` | Baixa | Rótulo curto no stepper ("9. Comp."), tokens em uma coluna, legendas de no mínimo 11 px |
| P22 | Paletas com valores padrão do Tailwind | Etapa 7 | Oceano: #0369A1, #0E7490, #06B6D4, #F0F9FF, #0C4A6E | Baixa (estética) | Ajustar matizes e luminosidade próprios por paleta, ou declarar a origem |
| P23 | CTA de landing com raio de 12 px, fora da escala 10/14/20 | Etapa 6 › Landing | medido `border-radius: 12px` | Baixa | Mapear todos os raios para os tokens |
| P24 | "Selecionado" com cara de desabilitado | Modal de prévia | botão "Modelo selecionado" lilás claro (`10-preview-nexa-cores-modelo.png`) | Baixa | Estado selecionado com check e cor plena, ou botão secundário "Remover seleção" |

---

## 7. O que funcionou bem

- **Ordem do fluxo:** primeiro o esqueleto, depois o acabamento. O bloqueio do acabamento até aprovar a estrutura é uma boa decisão de produto.
- **Arquitetura desktop e mobile:** 42 e 44 esquemas, legendas por cor, medidas recomendadas e proporções corretas na prévia (rail de 76 px e header de 64 px conferidos).
- **Herança da paleta:** landing, login, cadastro, headers e sidebars passaram a usar a paleta, a fonte e o raio escolhidos (`48-previa-landing-com-identidade-final.png`).
- **Contraste WCAG automático** nos pares importantes, com razão numérica.
- **Fidelidade dos valores simples:** raios, sombra, fontes e os 44 tokens são idênticos na tela, no CSS, no .md e no JSON. A troca manual da primária fica registrada.
- **Painel de personalização de componente:** estados Normal/Hover/Focus/Active/Disabled, configuração da instância e exceção individual, bem estruturados.
- **Prévias interativas** de headers e sidebars (menus abrem, sidebar recolhe) e prévia de landing no computador e no celular com reorganização coerente.
- **Master Prompt rico em requisitos não visuais:** acessibilidade, estados, responsividade de 320 a 1920 px, `100dvh`, safe areas, segurança de autenticação e formatação de moeda em pt-BR.
- **Inspiration Gallery:** direção de arte com personalidade; é o melhor conteúdo visual do produto.
- **Salvamento automático** confiável dentro da sessão e sem rolagem horizontal da ferramenta a 390 px.
