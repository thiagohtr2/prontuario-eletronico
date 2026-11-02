# Teste exploratório de usabilidade: persona "Diego, o impaciente" (A6)

## 1. Aviso: persona simulada

**Nenhum ser humano participou deste teste.** Ele foi feito por um agente de IA no papel de uma persona fictícia, **Diego**: 38 anos, empreendedor, sempre com pressa. Diego não lê parágrafos, passa o olho, clica no botão mais óbvio e prefere a opção padrão ou recomendada. Ele fecha a aba quando algo exige escolhas demais. Os achados são hipóteses fundamentadas, com evidências reais de tela (capturas, textos, tempos medidos e arquivos exportados). As reações emocionais ("isso está demorando", "fecharia a aba") são inferências sobre a persona e precisam ser confirmadas com usuários reais.

**Objetivo da persona:** obter uma especificação visual utilizável (Master Prompt) para o site de uma startup de entregas, com landing e área do cliente, tomando o mínimo de decisões e aceitando os padrões.

**Como o teste foi feito**
- Endereço: `http://127.0.0.1:4300/`. Nenhum código-fonte, documentação ou relatório de outro agente foi lido. Tudo foi descoberto pela tela.
- Chromium (Playwright 1.63), viewport 1440×900, perfil persistente começando vazio (`perfil/`). Cada passo foi um script com tempos medidos por `Date.now()` (`scripts/s01.cjs` … `s25.cjs`).
- **Tempo do método** = tempo medido no navegador + **3 s por bloco de texto** que um leitor apressado precisaria ler. Os tempos medidos incluem esperas fixas de 300 a 600 ms colocadas no script, então o app é na verdade mais rápido que os números.
- **Tempo realista** (estimativa complementar) = tempo do método + 1 s por clique (mover o mouse) + 2 s por rolagem + 4 s de digitação.
- **Decisão real** = escolha entre opções **sem** recomendação visível. Aceitar um item "Sugerido" ou o padrão pré-selecionado conta à parte, como "recomendação aceita".
- Um script auxiliar (`s24.cjs`) checou num perfil separado, já apagado, se existia algum atalho. Ele não entra nas métricas do Diego.

---

## 2. Linha do tempo

Tempos acumulados no formato **método / realista**. "C" = cliques no passo, "D" = decisões reais, "R" = recomendações aceitas. O detalhamento clique a clique está em `scripts/timeline.json` e em `scripts/metricas.cjs`.

| # | Passo | Medido | Leitura | C | D | R | Acumulado |
|---|---|---|---|---|---|---|---|
| P0 | Abre a home | 0,86 s | 2 blocos | 0 | 0 | 0 | 6,9 / 6,9 s |
| P1 | Clica "Master Prompt" no topo | 0,40 s | 3 | 1 | 1 | 0 | 16,3 / 17,3 s |
| P2 | Pendência "Defina o tipo" → "Aplicativo ou SaaS" → "Usar esta sugestão" → Continuar | 2,13 s | 5 | 4 | 1 | 1 | 33,4 / 38,4 s |
| P3 | Clica no "Continuar: Desktop" desabilitado | 0,30 s | 1 | 1 | 0 | 0 | 36,7 / 42,7 s |
| P4 | Aba Landing → 1º de 24 modelos | 1,27 s | 4 | 2 | 1 | 0 | 50,0 / 60,0 s |
| P5 | Aba Login → 1º de 24 modelos | 1,12 s | 2 | 2 | 1 | 0 | 57,1 / 69,1 s |
| P6 | Aba Cadastro → 1º de 8 modelos | 0,94 s | 2 | 2 | 1 | 0 | 64,0 / 78,0 s |
| P7 | Desktop: 42 modelos → 1º "Sugerido" | 1,37 s | 3 | 2 | 0 | 1 | 74,4 / 92,4 s |
| P8 | Mobile: 44 modelos → 1º "Sugerido" | 1,44 s | 3 | 2 | 0 | 1 | 84,8 / 106,8 s |
| P9 | Revisão → "Aprovar esqueleto" (ignora o aviso do nome) | 1,34 s | 4 | 2 | 0 | 0 | 98,2 / 122,2 s |
| P10 | Prévia → Cores → Navegação → Componentes → Entrega, só "Continuar" | 3,35 s | 6 | 4 | 0 | 3 | 119,5 / 147,5 s |
| P11 | Pendência "Dê um nome" → procura o campo → digita | 1,32 s | 1 | 2 | 0 | 0 | 123,8 / 159,8 s |
| P12 | "Master Prompt" no topo → "Copiar Master Prompt" | 1,21 s | 1 | 2 | 0 | 0 | **128,1 / 166,1 s** |
| (extra) | "Baixar .md", fora do total | 0,04 s | 0 | (1) | 0 | 0 | — |

### P0: Home (`capturas/01-home.png`)
1. **Tentou:** entender em 5 segundos onde fica "o botão que gera".
2. **Esperava:** um campo "descreva seu site" ou um botão "Gerar".
3. **Aconteceu:** a página carregou em 0,86 s. Ela mostra o título, dois cartões (Modo Guiado "Recomendado para iniciantes" e Modo Livre) e, no topo, um botão roxo "Master Prompt". São duas ações primárias competindo, mais uma secundária.
4. **Entendeu?** Em parte. Ele entendeu que o produto termina num "Master Prompt" e que esse botão existe no topo.
5. **Voltou?** Não.
6. **Confuso?** Leve. "Guiado ou Livre? Eu quero só o prompt."
7. **Controle que falhou:** nenhum.
8. **Abandonaria?** Não.
9. **Profissional?** Sim. Visual limpo e rápido.
10. **Melhoria:** um terceiro caminho explícito, "Rápido: 3 perguntas e pronto", ou um único CTA primário.

### P1: Atalho "Master Prompt" no topo (`02-master-prompt-direto.png`, `exportados/00-master-prompt-zero-decisoes.md`)
1. **Tentou:** pegar o prompt direto, com zero decisões.
2. **Esperava:** um prompt pronto, ou um aviso "faltam X coisas".
3. **Aconteceu:** abriu a "Central de Prompts" com **um Master Prompt de 10.652 caracteres já gerado**, mas sem nada do projeto ("Tipo de aplicação: Não definido", "Layout desktop: não definido · Layout mobile: não definido"). Acima dele, um bloco laranja "Pendências" lista **5 links** clicáveis.
4. **Entendeu?** Sim. As pendências funcionam como checklist: "preciso fazer 5 coisas".
5. **Voltou?** Não. Seguiu pelo 1º link.
6. **Confuso?** Sim. O botão "Copiar Master Prompt" fica ativo e convidativo mesmo com o prompt vazio. Um Diego mais apressado copiaria isso e iria embora com um resultado inútil.
7. **Controle que falhou:** nenhum, mas o atalho engana: entrega um prompt em 16 s que não serve.
8. **Abandonaria?** Não. As pendências o seguraram.
9. **Profissional?** Sim, mas o texto do prompt diz "Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário" quando nenhuma decisão foi tomada.
10. **Melhoria:** com pendências de esqueleto, trocar o CTA principal por "Completar em 3 passos com recomendações" e avisar "este prompt ainda não descreve o seu site".

### P2: Objetivo do projeto (`03-objetivo.png`, `04-objetivo-saas.png`, `05-sugestao-aplicada.png`)
1. **Tentou:** escolher o tipo e seguir.
2. **Esperava:** uma pergunta só.
3. **Aconteceu:** 7 tipos, nenhum "landing + área do cliente" e **nenhum recomendado**. Diego hesitou entre "Landing page" e "Aplicativo ou SaaS" e escolheu o 1º. Na hora apareceu "Sugestão (opcional): … fluxo 'Landing page com chamada para login' · Usar esta sugestão", que é exatamente o caso dele. Ele clicou, e o texto mudou para "(já aplicada)", sem toast. O campo "Nome do projeto" e o aviso "Só o nome é realmente necessário" ficam abaixo da dobra, e "Continuar" fica habilitado sem nome.
4. **Entendeu?** Sim.
5. **Voltou?** Não.
6. **Confuso?** Sim, com o **"não sei o que escolher" nº 1**: "Meu site é landing ou app?"
7. **Controle que falhou:** nenhum. A sugestão só pré-seleciona o fluxo de entrada, não os layouts desktop e mobile que ela mesma cita.
8. **Abandonaria?** Não.
9. **Profissional?** Sim.
10. **Melhoria:** fazer "Usar esta sugestão" aplicar também os layouts sugeridos (desktop e mobile) e os modelos de landing, login e cadastro. Pôr o campo de nome no topo da etapa.

### P3: Entrada: botão desabilitado (`06-entrada.png`)
1. **Tentou:** clicar "Continuar: Desktop", porque o fluxo já vinha "Selecionado".
2. **Esperava:** avançar.
3. **Aconteceu:** o botão estava desabilitado e o clique não fez nada. Ao lado, em cinza, aparece "Escolha um modelo de landing page.". A instrução "Agora escolha a landing page e o login e o cadastro nas abas acima" fica **abaixo dos cartões, fora da viewport**.
4. **Entendeu?** Depois de ler a dica, sim.
5. **Voltou?** Não.
6. **Confuso?** Sim, com o **"isso está demorando" nº 1**: "Escolhi e não anda?"
7. **Controle que falhou:** o "Continuar" desabilitado não leva até o que falta (1 clique desperdiçado).
8. **Abandonaria?** Ainda não.
9. **Profissional?** Sim.
10. **Melhoria:** o botão deveria virar "Próximo: escolher a landing" e trocar de aba ao ser clicado.

### P4: Galeria de landing (`07-landing-tab.png`, `08-landing-scroll.png`, `08b-landing-escolhida.png`)
1. **Tentou:** escolher qualquer landing aceitável.
2. **Esperava:** uma landing "recomendada para SaaS" já marcada.
3. **Aconteceu:** **24 modelos e 12 filtros**, com nome técnico ("Composição assimétrica", "Tipografia monumental"…). Nenhum selo "recomendado" (busca por "recomend", "sugest" e "padrão" na página: 0 ocorrências). As miniaturas começam em y≈762, quase fora da tela. Ele rolou e clicou no 1º ("Aurora Flow"). Um toast confirmou: "Landing 'Aurora Flow' selecionada e incluída no Master Prompt". A aba **não avança** sozinha: a dica muda para "Escolha um modelo de login.".
4. **Entendeu?** Sim.
5. **Voltou?** Não.
6. **Confuso?** Sim, com o **"não sei o que escolher" nº 2**: as marcas fictícias (carro elétrico, floricultura, foguete) não têm nada a ver com entregas.
7. **Controle que falhou:** nenhum.
8. **Abandonaria?** **Risco alto.** Aos 47 a 56 s ele está na "Etapa 2 de 10" diante de 24 cartões.
9. **Profissional?** Sim. As miniaturas são bonitas.
10. **Melhoria:** pré-selecionar um modelo por tipo de projeto com o selo "Recomendado", e trocar de aba automaticamente depois da escolha.

### P5: Galeria de login (`09-login-tab.png`, `10-login-escolhido.png`)
1. **Tentou:** passar rápido.
2. **Esperava:** acabar a etapa.
3. **Aconteceu:** **mais 24 modelos e 5 filtros**, de novo sem recomendação. Escolheu o 1º ("Clássico central").
4. **Entendeu?** Sim.
5. **Voltou?** Não.
6. **Confuso?** Sim, com o **"isso está demorando" nº 2**: "De novo 24? Ainda estou na etapa 2 de 10."
7. **Controle que falhou:** nenhum.
8. **Abandonaria?** **Este é o ponto de abandono mais provável** (57 a 69 s): a segunda galeria grande dentro da mesma etapa, e o contador mostra que faltam 8 etapas. Se cada etapa fosse assim, seriam mais de 10 minutos.
9. **Profissional?** Sim.
10. **Melhoria:** um botão "Usar recomendados nesta etapa", que preenche landing, login e cadastro de uma vez.

### P6: Galeria de cadastro (`10b-cadastro-tab.png`, `11-cadastro-escolhido.png`)
1. **Tentou:** o mesmo dos passos anteriores.
2. **Esperava:** que esta fosse a última aba.
3. **Aconteceu:** 8 modelos. Escolheu o 1º ("Cadastro na mesma tela do login"). "Continuar: Desktop" ficou habilitado.
4. **Entendeu?** Sim.
5. **Voltou?** Não.
6. **Confuso?** Sim, com o **"não sei o que escolher" nº 3**: "Mesma tela, página própria, em etapas? Tanto faz."
7. **Controle que falhou:** nenhum.
8. **Abandonaria?** Risco médio, porque a etapa já se arrasta.
9. **Profissional?** Sim.
10. **Melhoria:** um padrão pré-selecionado coerente com o login escolhido.

### P7 e P8: Arquitetura desktop e mobile (`12-desktop.png`, `13b-desktop-clicou-card.png`, `14-mobile.png`, `15b-mobile-escolhido.png`)
1. **Tentou:** pegar o "Sugerido".
2. **Esperava:** um padrão já marcado, porque a sugestão do P2 dizia "menu lateral fixo no computador e navegação inferior no celular".
3. **Aconteceu:** **42 modelos** (desktop) e **44 modelos** (mobile), com **3 selos "Sugerido" em cada tela**. Nada vem pré-selecionado. Um clique no 1º sugerido já escolhe, e um painel lateral confirma: "Escolhido para o seu projeto". As páginas são longas: 7.972 px e 9.647 px.
4. **Entendeu?** Sim. As legendas HEADER/SIDEBAR/CONTEÚDO ajudam.
5. **Voltou?** Não.
6. **Confuso?** Pouco. Três "Sugerido" diluem a recomendação (**"não sei o que escolher" nº 4**, leve).
7. **Controle que falhou:** nenhum.
8. **Abandonaria?** Risco baixo a médio. São rápidas porque o 1º sugerido está no topo.
9. **Profissional?** Sim. Os desenhos são claros.
10. **Melhoria:** já chegar com o sugerido pré-selecionado (a sugestão do P2 já sabia qual era) e usar um único "Recomendado para você".

### P9: Revisão e aprovação (`16-revisao.png`, `17-apos-aprovar.png`)
1. **Tentou:** aprovar.
2. **Esperava:** o prompt.
3. **Aconteceu:** o aviso "Ainda faltam decisões: Dê um nome ao projeto. Resolver" aparece, mas "Aprovar esqueleto e continuar" está habilitado. Ele aprovou e caiu na "Etapa 6 de 10 · Acabamento", com o toast "Esqueleto aprovado. Agora vamos ao acabamento.". Detalhe: o título "Esqueleto aprovado" já aparece na revisão **antes** da aprovação.
4. **Entendeu?** Sim.
5. **Voltou?** Não.
6. **Confuso?** Sim, com o **"isso está demorando" nº 3**: "Aprovei e ainda faltam 5 etapas?"
7. **Controle que falhou:** nenhum.
8. **Abandonaria?** Risco médio (98 a 122 s). O botão "Master Prompt" no topo é a válvula de escape.
9. **Profissional?** Sim.
10. **Melhoria:** depois de aprovar, oferecer "Gerar Master Prompt agora (acabamento padrão)" ao lado de "Personalizar acabamento".

### P10: Acabamento só com "Continuar" (`17-apos-aprovar.png`, `18-cores.png`, `19-navegacao.png`, `20-componentes.png`, `21-entrega.png`)
1. **Tentou:** pular tudo.
2. **Esperava:** que as etapas fossem puláveis.
3. **Aconteceu:** o "Continuar" já vem habilitado nas 4 telas. Em Cores, a paleta "Neutro Essencial" está pré-selecionada entre **60 paletas e 11 filtros**. Navegação (**36 headers + 36 sidebars**, página de **18.517 px**) e Componentes (**66 categorias × 16 famílias**) dizem "Etapa opcional". Cada tela custou 1 clique.
4. **Entendeu?** Sim. O "Etapa opcional" ajuda quem lê o subtítulo.
5. **Voltou?** Não.
6. **Confuso?** Não.
7. **Controle que falhou:** nenhum. Mas **nada disso mudou o prompt**: o diff entre o prompt logo após o esqueleto (`exportados/01-checkpoint-apos-esqueleto.md`) e o final difere só no nome, na data e na seção de pendências. Foram 4 telas e cerca de 21 a 25 s sem nenhum ganho para quem aceita os padrões.
8. **Abandonaria?** Risco baixo, porque os cliques são rápidos.
9. **Profissional?** Sim.
10. **Melhoria:** marcar no stepper as etapas 6 a 9 como puláveis e oferecer "pular para a entrega".

### P11: Dar nome ao projeto (`21-entrega.png`, `22-nome-link.png`, `22b-nome-digitado.png`)
1. **Tentou:** resolver a única pendência.
2. **Esperava:** cair no campo de nome.
3. **Aconteceu:** o link levou ao **topo** da etapa "Objetivo". O foco ficou no `BODY`, a rolagem em 0 e o campo "Nome do projeto" em y≈1000, **fora da viewport de 900 px**. Ele teve que rolar e procurar. O rodapé só oferece "Continuar: Entrada", que o faria refazer o fluxo inteiro.
4. **Entendeu?** Depois de rolar, sim.
5. **Voltou?** Sim. Teve que voltar ao prompt pelo botão do topo.
6. **Confuso?** Sim: "O link não funcionou? Cadê o campo?"
7. **Controle que falhou:** o link da pendência não rola nem foca o campo.
8. **Abandonaria?** Baixo risco, mas é irritante.
9. **Profissional?** Parece inacabado.
10. **Melhoria:** editar o nome direto na Central de Prompts, ou usar âncora com foco no campo.

### P12: Pegar o prompt (`23-prompt-final.png`, `23b-copiado.png`)
1. **Tentou:** copiar.
2. **Esperava:** um feedback.
3. **Aconteceu:** "0 decisões pendentes, 9 itens". "Copiar Master Prompt" mostrou o toast "Copiado para a área de transferência." e o botão mudou para "Copiado". A área de transferência tinha 25.365 caracteres. "Baixar .md" gerou `vai-ja-entregas-master-prompt.md`, idêntico ao copiado.
4. **Entendeu?** Sim.
5. **Voltou?** Não.
6. **Confuso?** Não.
7. **Controle que falhou:** nenhum.
8. **Abandonaria?** Não, missão cumprida.
9. **Profissional?** Sim.
10. **Melhoria:** junto do botão, um resumo de uma linha do que está e do que não está especificado (ex.: "sem descrição do negócio, sem componentes").

---

## 3. Métricas finais

| Métrica | Valor |
|---|---|
| Tempo até a 1ª ação útil (clique em "Master Prompt") | **6,9 s** (carregamento de 0,86 s + 2 blocos de leitura) |
| Tempo até a 1ª decisão de design (tipo de projeto) | 26,3 s |
| Tempo até ter "um" Master Prompt (atalho do topo, 0 decisões, inutilizável) | 16,3 s |
| **Tempo total até ter o Master Prompt utilizável copiado** | **128,1 s pelo método (≈2 min 8 s); ≈166 s realista (≈2 min 46 s)** |
| Tempo de resposta do sistema somado (26 interações + carga) | 17,1 s (inclui esperas fixas do script; nenhuma transição passou de 1,1 s) |
| Leitura estimada | 37 blocos = 111 s (87% do tempo do método) |
| **Cliques** | **26** (1 desperdiçado em botão desabilitado), mais 1 opcional (Baixar .md) |
| Rolagens / campos digitados | 4 / 1 |
| **Decisões reais** (sem recomendação) | **5**: caminho na home, tipo de projeto, landing (24), login (24), cadastro (8) |
| Recomendações e padrões aceitos | 6: fluxo de entrada, desktop, mobile, paleta e tipografia, navegação (pulada), componentes (pulada) |
| Telas únicas / visitas a telas | 12 rotas / 14 visitas, mais 3 abas internas na etapa Entrada |
| Etapas do construtor percorridas | 10 de 10 |
| Opções visuais exibidas no caminho | ≈280 (7 + 24 + 24 + 8 + 42 + 44 + 60 + 72), mais 66 categorias de componentes |
| Página mais longa | Headers e sidebars: 18.517 px |
| Momentos "isso está demorando" | 3 (P3, P5, P9) |
| Momentos "não sei o que escolher" | 4 (P2, P4, P6, P7/P8) |
| Pontos de abandono | **Alto:** P5 (aba Login, 57–69 s) e P4 (aba Landing, 47–56 s). **Médio:** P9 ("Etapa 6 de 10", 98–122 s) |
| Linhas do prompt acrescentadas pelas etapas 6 a 9 (só padrões) | **0** |
| Tamanho do prompt final | 25.365 caracteres, 400 linhas, 9 itens, 0 pendências |
| Erros de console | 0 |

---

## 4. Qualidade do resultado mínimo

Arquivo: `exportados/vai-ja-entregas-master-prompt.md` (idêntico a `02-master-prompt-copiado.md`).

### O que é útil (pronto para uma IA construir)
- **Estrutura técnica concreta** do shell desktop:
  > "Grid de duas colunas: grid-template-columns: 252px minmax(0, 1fr); a coluna principal tem grid-template-rows: 64px minmax(0, 1fr)"
- **Mobile bem definido**, com safe areas e alvos de toque:
  > "Bottom Navigation fixa (position: fixed; bottom: 0) com 4 itens de largura igual … Altura de ≈64 px + env(safe-area-inset-bottom)"
- **Login e cadastro** com acessibilidade e segurança:
  > "Erro de credenciais genérico (“E-mail ou senha incorretos”) …" e "senhas com hash (Argon2id ou bcrypt), limitação de tentativas, sessão em cookie httpOnly"
- **Tabela completa de tokens** (45 tokens), tipografia (escala 13/15/18/23/30/39), geometria (raios 6/8/12, sem sombra), regras de responsividade (320–1920 px) e de implementação.
- **A relação desktop/celular é explícita**, o que evita que a IA "invente" um drawer.
- Quando havia pendência, o prompt incluía a seção "Pendências: … Não invente: pergunte ou use a opção mais neutra". É uma boa proteção.

### O que é genérico ou inadequado
- **Nenhuma palavra sobre entregas.** "entrega", "pedido" e "rastre" só aparecem no nome "Vai Já Entregas". O tipo é "Aplicativo ou SaaS". A IA vai construir um SaaS genérico de produtividade.
- **Conteúdo do modelo fictício vaza para a especificação:**
  > "Header: logotipo “Aurora Flow”, navegação com “Produto”, “Soluções”, “Preços”, “Recursos”…"
  > "Mockup do aplicativo (quadro kanban com barra lateral)…"
  > "Microtexto sob os CTAs: “14 dias de teste grátis · sem cartão de crédito”."
  > "…legenda “Equipes que já trabalham no fluxo”."

  Existe a ressalva "Marca, textos e números são fictícios: substitua…", mas o nome do projeto já é conhecido e não foi aplicado. A landing também cita outra paleta: "Demonstração original: … primária #5b4cf0", o que pode confundir.
- **A paleta padrão "Neutro Essencial" é anônima** (primária #18181b, destaque #2563eb). Não há nenhuma identidade de marca.
- **Navegação e componentes vazios:**
  > "Nenhum modelo específico de header ou sidebar foi escolhido…" / "Nenhum componente foi personalizado na biblioteca."
- **Afirmação incorreta:**
  > "Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário."

  Diego nunca viu a tipografia nem a geometria, e aceitou a paleta sem olhar. A mesma frase aparece no prompt com zero decisões (`00-master-prompt-zero-decisoes.md`).
- **Repetições:** em Login, a observação de autenticação segura aparece duas vezes (linhas 100 e 102). Em Cadastro, as regras de erro por campo, mostrar senha e autocomplete se repetem (linhas 125/129, 126/131, 128/133).

### O que ficou pendente sem que o produto avisasse
- Objetivo, descrição, público-alvo, finalidade principal e módulos (ex.: "Rastrear pedido", "Endereços", "Histórico de entregas") estavam vazios e **foram omitidos em silêncio**. O painel mostra "**0 decisões pendentes**", o que dá falsa sensação de completude.
- Os destinos da sidebar e da bottom navigation (os "4 destinos") não estão definidos.

**Veredito:** o resultado é **utilizável como esqueleto técnico e visual**: layout, responsividade, tokens e telas de autenticação. Mas **não descreve o produto**. Uma IA que receber esse prompt vai entregar um SaaS genérico com textos de "Aurora Flow". Para um site de entregas, Diego ainda precisaria escrever o contexto do negócio por conta própria.

---

## 5. Problemas

Escala de gravidade: Crítica, Alta, Média, Baixa.

| # | Problema | Onde | Evidência | Gravidade | Sugestão concreta |
|---|---|---|---|---|---|
| 1 | Etapa 2 esconde 4 decisões e 3 galerias sem recomendação | Construtor › Landing, login e cadastro | 24 landings + 12 filtros, 24 logins + 5 filtros, 8 cadastros; 0 selos "recomendado"; sem troca automática de aba (`07`, `09`, `10b`) | **Alta** (abandono provável) | Pré-selecionar landing, login e cadastro recomendados conforme o tipo; botão "Usar recomendados nesta etapa"; avançar de aba depois de cada escolha |
| 2 | Não existe "caminho rápido" com padrões | Global | A sugestão do P2 só aplica o fluxo de entrada; desktop e mobile começam vazios; Ctrl K "rápido" → "Nada encontrado" (`24-busca-rapido.png`); 26 cliques no mínimo | **Alta** | Depois de tipo + nome, oferecer "Gerar com recomendações" que preenche todo o esqueleto e abre o Master Prompt (≈3 decisões, menos de 30 s) |
| 3 | Prompt mínimo sem contexto do negócio e com "0 pendências" | Central de Prompts / Objetivo | Nenhuma menção a entregas; campos de objetivo, público e módulos omitidos sem aviso | **Alta** | Tratar objetivo e módulos como pendências recomendadas; pedir "Em uma frase, o que o seu site faz?" na 1ª tela; incluir no prompt "Contexto não informado: pergunte antes de inventar" |
| 4 | Textos do modelo fictício entram na especificação | Prompt › Landing | "logotipo 'Aurora Flow'", "14 dias de teste grátis", "quadro kanban" | Média-Alta | Trocar a marca do modelo pelo nome do projeto e marcar os textos como placeholders (`[título do produto]`) |
| 5 | Atalho "Master Prompt" entrega um prompt vazio que parece pronto | Botão do topo / Central de Prompts | 10.652 caracteres com "Não definido", botão "Copiar" ativo (`02`) | Média | Com pendências de esqueleto, mostrar um CTA "Completar em 3 passos" acima do prompt e um selo "incompleto" no botão Copiar |
| 6 | Afirmação "decisões visualizadas e aprovadas pelo usuário" é falsa para padrões | Cabeçalho do prompt | Presente no prompt com 0 decisões e nos padrões nunca vistos | Média | Separar "Escolhido pelo usuário" de "Padrão do Studio (não revisado)" no texto e no JSON |
| 7 | Etapas 6 a 9 não acrescentam nada para quem aceita padrões | Prévia, Cores, Navegação, Componentes | Diff checkpoint × final = só nome e data; 4 telas, 4 cliques, ≈21–25 s | Média | Depois de aprovar o esqueleto: "Ir para o Master Prompt (acabamento padrão)"; stepper indicando as etapas opcionais |
| 8 | "Continuar" desabilitado não guia até o que falta | Rodapé da etapa Entrada | Clique sem efeito; a instrução fica abaixo da dobra (`06`) | Média | Botão ativo com o rótulo "Próximo: escolher landing", que troca de aba |
| 9 | Link da pendência "Dê um nome" não leva ao campo | Pendências → Objetivo | Rolagem 0, foco em BODY, campo em y≈1000 com viewport de 900 (`22-nome-link.png`) | Média | Edição inline do nome na Central, ou âncora + `focus()` no campo |
| 10 | Nome pedido tarde e abaixo da dobra | Etapa 1 / Revisão | "Continuar" habilitado sem nome; aviso só na Revisão, que também aprova com pendência (`16`) | Baixa-Média | Campo "Como se chama seu projeto?" no topo da etapa 1, ou na home |
| 11 | Excesso de opções e páginas longas | Todas as galerias | ≈280 opções visuais; páginas de 7.972, 9.647 e 18.517 px | Média | Mostrar só 3 recomendados primeiro, com "Ver todos os 42" colapsado |
| 12 | Vários "Sugerido" por tela diluem a recomendação | Desktop e Mobile | 3 selos em cada tela; nada pré-selecionado | Baixa | Um único "Recomendado para você", pré-selecionado; os outros como "também combina" |
| 13 | Contadores e rótulos inconsistentes | Topo / Revisão | "Esqueleto 1/5" enquanto mostra "Etapa 2 de 10"; título "Esqueleto aprovado" antes de aprovar | Baixa | Um só contador de progresso; título "Esqueleto (a aprovar)" |
| 14 | Texto duplicado no prompt | Prompt › Login/Cadastro | Linhas 100/102, 125/129, 126/131, 128/133 | Baixa | Remover duplicatas ao gerar o prompt |
| 15 | Duas ações primárias concorrentes na home | Home | Botão "Master Prompt" no topo × "Começar no modo guiado" | Baixa | Um CTA primário único ("Começar"), com "Modo livre" como secundário |

---

## 6. O que funcionou bem

- **Velocidade:** carregamento em 0,86 s, todas as transições abaixo de cerca de 1,1 s (com as esperas do script) e nenhum erro de console. Para o Diego, o produto nunca pareceu lento: a lentidão vem da quantidade de escolhas.
- **"Master Prompt" sempre visível no topo**, e a **lista de pendências clicável** funciona como checklist. Foi o que segurou o Diego no P1.
- **A sugestão contextual** depois de escolher o tipo ("Usar esta sugestão") acertou exatamente o fluxo de landing + login. Só deveria ir além.
- **Seleção em 1 clique**, com feedback claro: selos "Selecionado"/"Escolhido", toasts ("…incluída no Master Prompt"), painel "Escolhido para o seu projeto" e dica ao lado do botão desabilitado.
- **Padrões no acabamento:** a paleta, a tipografia e a geometria pré-selecionadas, mais o "Etapa opcional" em Navegação e Componentes, permitiram atravessar 4 telas com 1 clique cada.
- **Revisão do esqueleto** com resumo e links "Alterar"; **stepper com checks**; **salvamento automático** ("Salvo automaticamente neste navegador").
- **Entrega sem atrito:** "Copiar" com confirmação; arquivo `.md` com nome derivado do projeto; o conteúdo copiado é idêntico ao baixado.
- **Qualidade técnica do prompt:** medidas, responsividade, acessibilidade, segurança de autenticação e tokens. É um esqueleto sólido para uma IA de código.

---

### Arquivos deste teste
- Capturas: `capturas/01-home.png` … `capturas/24b-template-studio.png` (com versões `-full` de página inteira)
- Exportados: `exportados/00-master-prompt-zero-decisoes.md`, `exportados/01-checkpoint-apos-esqueleto.md`, `exportados/02-master-prompt-copiado.md`, `exportados/vai-ja-entregas-master-prompt.md`
- Scripts e métricas: `scripts/s01.cjs` … `scripts/s25.cjs`, `scripts/lib.cjs`, `scripts/metricas.cjs`, `scripts/timeline.json`
