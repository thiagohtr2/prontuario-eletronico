# Teste exploratório de primeiro acesso — Persona A1 "Marta" (leiga)

> **Aviso: persona simulada por IA; não substitui pesquisa com pessoas.**
> Este é um teste exploratório em que um agente de IA simulou a persona. Nenhum ser humano participou. As reações descritas são inferências sobre o que uma pessoa com esse perfil provavelmente faria e sentiria. Servem para levantar hipóteses, que precisam ser confirmadas com usuários reais.

## Persona e objetivo

- **Marta, 52 anos**, dona de uma pequena loja de materiais de construção. Usa WhatsApp, e-mail e banco. Nunca programou e não conhece termos como CSS, header, sidebar, layout ou design system. Lê pouco texto técnico, quer ser conduzida e desiste quando se sente perdida.
- **Objetivo:** criar o design de um sistema para gerenciar a loja (estoque, vendas e clientes) e sair com algo que possa entregar para uma IA construir.
- **Única informação dada:** o endereço `http://127.0.0.1:4300/`.

## Método

- Chromium (Playwright 1.63), tela de 1366×768, **perfil de navegador criado vazio** em `perfil/` (sem armazenamento local, sem sessão e sem preferências).
- Cada passo é um script em `passos/` executado por `passo.cjs`. O script reabre o navegador com o mesmo perfil, volta à última URL, faz as ações e salva capturas em `capturas/` e a árvore acessível.
- **Efeito colateral do método:** entre um script e outro a página é recarregada. Estados passageiros da tela, como a aba aberta dentro de uma etapa ou uma janela de prévia, voltam ao padrão. Quando foi preciso reabrir uma aba só por causa disso, o clique **não foi contado** como interação da Marta. Por outro lado, o projeto (nome, escolhas, progresso) **sobreviveu a cerca de 30 reaberturas do navegador**, o que comprova na prática o "Salvo automaticamente neste navegador".
- Interações contadas: **45**. Interagi só pelo que estava visível (textos, botões, imagens). Não li código-fonte, documentação nem relatórios de outros agentes.
- Dicas que só aparecem ao passar o mouse e usam o recurso nativo do navegador (atributo `title`) não saem nas capturas.

---

## 1. Resumo da jornada

| Resultado | |
|---|---|
| Chegou ao Master Prompt? | **Sim**, na interação 38 (captura `38-tela-entrega.png`), mas **só porque a avaliadora continuou depois do ponto de abandono**. |
| Ponto de abandono principal | **Etapa 2 "Landing, login e cadastro"** (passos 7 e 8, interações 15 a 17, capturas `12` a `14b`). |
| Outros pontos de risco | Etapa 3 "Arquitetura do computador", com 42 modelos (passo 12, risco médio). Fim da jornada: Marta não sabe o que fazer com o Master Prompt (passos 19 e 20). |
| Saiu com algo entregável? | Sim, tecnicamente: o arquivo `downloads/loja-da-marta-master-prompt.md`, com 24.746 caracteres. **Mas ela não entende o conteúdo, não sabe onde colar e não consegue conferir se está certo.** O conteúdo inclui textos de uma landing de banco digital ("Abrir conta grátis", "Planos e preços") que não têm nada a ver com a loja dela. |

---

## 2. Caminho seguido, passo a passo

Legenda das perguntas: (1) o que tentou fazer · (2) o que esperava · (3) o que aconteceu · (4) entendeu o resultado? · (5) precisou voltar? · (6) ficou confusa? · (7) achou algum controle que parecia não funcionar? · (8) abandonaria aqui? · (9) o design parecia profissional? · (10) como melhorar.

### Passo 1 — Abrir o site (interação 1)
Capturas: `01-primeira-tela.png`, `01-primeira-tela-completa.png`
1. Abrir o endereço que o sobrinho passou.
2. Uma página que explicasse em palavras simples como "desenhar um sistema".
3. Título: "Do site que você imagina ao site que a IA realmente constrói." Subtítulo cita "Master Prompt", "Claude Code, Cursor". Há dois cartões, "Modo Guiado (Recomendado para iniciantes)" e "Modo Livre". Na lateral, cerca de 30 itens, muitos em inglês ("Live Site Preview", "Color System", "Navigation Showcase", "Inspiration Gallery", "Template Studio"). No topo aparece "Esqueleto 0/5".
4. Em parte. Entende "escolher visualmente… e no final entregar para a IA", que bate com o que o sobrinho disse. Não entende "site" (ela quer um *sistema*), "Master Prompt", "Claude Code", "Cursor", "Esqueleto 0/5".
5. Não.
6. Um pouco, por causa do menu lateral enorme e dos nomes em inglês.
7. Não.
8. Não. O selo "Recomendado para iniciantes" segura a Marta.
9. Sim, a página é limpa e bem diagramada.
10. Falar em "site **ou sistema**". Explicar "Master Prompt" em uma frase ("um texto com tudo o que você escolheu, para colar na IA"). Esconder o menu lateral completo no primeiro acesso. Curiosamente, o próprio cartão diz "Você não precisa conhecer termos como sidebar, drawer ou breakpoint", usando exatamente esses jargões.

### Passo 2 — Rolar e clicar em "Começar no modo guiado" (interações 2 e 3)
Antes: `02-antes-clique-comecar-guiado.png` · Depois: `03-depois-clique-comecar-guiado.png`, `03-depois-clique-comecar-guiado-completa.png`
1. Começar pelo caminho "para iniciantes".
2. Ser levada passo a passo.
3. Na tela de 768 px de altura, o botão aparecia só cortado na borda inferior, então foi preciso rolar. O clique abriu "Etapa 1 de 10 · Objetivo do projeto", com uma barra de etapas (Esqueleto 1–5, Acabamento 6–10 com cadeado e a frase "libera após aprovar o esqueleto").
4. Sim. "Etapa 1 de 10" e a barra numerada orientam bem.
5. Não.
6. Pouco. "Esqueleto" e "Acabamento" são metáforas que ela entende vagamente (de obra!).
7. Não.
8. Não.
9. Sim.
10. Subir o botão principal para aparecer inteiro sem rolar em 1366×768.

### Passo 3 — Escolher o tipo de projeto (interações 4 e 5)
Antes: `04-hover-loja-ou-catalogo.png` · Depois: `05-depois-escolher-aplicativo.png`
1. Dizer o que ela quer construir. Primeiro pensou em "Loja ou catálogo", porque ela *tem uma loja*. Leu "Vitrine… carrinho", percebeu que era para vender pela internet e escolheu "Aplicativo ou SaaS — Sistema com login, onde as pessoas trabalham, cadastram e acompanham informações".
2. Ver a opção marcada.
3. O cartão ganhou uma borda roxa, o ícone ficou com fundo colorido e o botão "Continuar: Entrada" passou a ficar ativo.
4. Sim, mas a marcação é discreta: só a borda, sem o selo "Selecionado" que aparece nas etapas seguintes.
5. Não.
6. Sim, com "SaaS" e "One Screen" e com a armadilha da palavra "Loja".
7. Não.
8. Não.
9. Sim.
10. Trocar o título "Aplicativo ou SaaS" por "Sistema de gestão (com login)". Avisar no cartão "Loja ou catálogo" que é para *vender pela internet*. Usar o mesmo selo "Selecionado" das outras etapas.

### Passo 4 — Preencher "Sobre o projeto" e as funcionalidades (interações 6 a 12)
Capturas: `06-rolou-ve-sobre-o-projeto.png` → `07-depois-preencher-nome-objetivo.png` → `08-depois-adicionar-modulos.png`
1. Digitar "Loja da Marta", o objetivo ("controlar o estoque, as vendas e os clientes da loja"), o público ("eu e meus 2 funcionários") e adicionar "Estoque", "Vendas" e "Clientes".
2. Que o Studio guardasse isso.
3. Funcionou. As funcionalidades viraram etiquetas com "×", apareceram sugestões ("Painel inicial", "Cadastro de clientes"…) e o rodapé do menu lateral passou de "Projeto sem nome" para "Loja da Marta · Salvo automaticamente".
4. Sim. É o momento mais "dela" da jornada.
5. Não.
6. Pouco. O formulário fica escondido abaixo dos cartões (precisa rolar), e a seção "Tecnologia desejada (opcional)" com "React + TypeScript", "Next.js", "Svelte" assusta. Ela pulou essa seção por estar marcada como opcional.
7. Não.
8. Não.
9. Sim.
10. Mostrar logo de cara que há perguntas abaixo. Esconder "Tecnologia" atrás de um "Sou técnico / meu programador vai escolher".

### Passo 5 — "Usar esta sugestão" (interação 13)
Antes: `09-antes-usar-sugestao.png` · Depois: `10-depois-usar-sugestao.png`
1. Aceitar a sugestão do Studio ("se eles sugerem, eu aceito").
2. Ver o que mudou.
3. O botão sumiu e apareceu um "(já aplicada)" pequeno no fim da frase. Nada mais mudou na tela.
4. **Não.** O texto falava em "menu lateral fixo… navegação inferior… fluxo 'Landing page com chamada para login'". Ela não sabe o que foi aplicado nem onde.
5. Não.
6. Sim.
7. Mais ou menos: o clique "não fez nada visível".
8. Não.
9. Sim.
10. Mostrar um aviso claro, por exemplo: "Pronto! Já deixamos marcado: página de apresentação + tela de entrar. Você pode mudar na etapa 2." Para um sistema usado só pela dona e 2 funcionários, sugerir "Apenas login", que o próprio Studio descreve como "Ex.: ferramenta interna de uma empresa".

### Passo 6 — "Continuar: Entrada" (interação 14)
Depois: `11-tela-entrada.png`, `11-tela-entrada-completa.png`
1. Ir para a próxima etapa.
2. Mais uma pergunta simples.
3. A etapa se chama "**Landing, login e cadastro**" e tem 4 abas: "Como as pessoas entram", "Landing page", "Login", "Cadastro". O fluxo sugerido já aparece com o selo "✓ Selecionado". Há uma caixa: "Landing page não é login…".
4. Em parte. Vê o "Selecionado" e acha que já está pronto.
5. Não.
6. **Sim.** O título é inteiro em inglês.
7. Ainda não.
8. Começa a hesitar.
9. Sim, os desenhos dos fluxos são claros.
10. Título em português: "Como as pessoas entram no sistema".

### Passo 7 — Clicar no "Continuar: Desktop" desabilitado (interação 15) ⚠️ início do ponto de abandono
Antes: `11-tela-entrada.png` · Depois: `12-depois-clicar-continuar-desabilitado.png`
1. Seguir em frente, já que estava escrito "Selecionado".
2. Ir para a próxima etapa.
3. Nada aconteceu. O botão está apagado, e a única pista é um texto cinza pequeno ao lado: "Escolha um modelo de landing page." A mensagem "Pronto. Agora escolha a landing page e o login e o cadastro nas abas acima." fica lá embaixo, fora da tela (aparece só em `11-tela-entrada-completa.png`).
4. **Não.** "Mas eu já escolhi… o que é landing page?"
5. —
6. **Sim, muito.**
7. **Sim.** O botão de continuar "não funciona" e não diz o que falta.
8. **Talvez.** A paciência começa a acabar aqui.
9. Sim visualmente, mas a lógica é confusa.
10. Ao clicar no botão desabilitado, rolar a tela até o que falta e destacar. Trocar a frase por uma lista visível ao lado do botão: "Falta escolher: ☐ página de apresentação ☐ tela de entrar". Deixar claro que as abas são *passos obrigatórios*, não só "outras páginas".

### Passo 8 — Aba "Landing page" e miniaturas (interações 16 e 17) 🛑 PONTO DE ABANDONO PRINCIPAL
Capturas: `13-aba-landing-page.png`, `14-miniaturas-landing.png`, `14b-miniaturas-landing-mais.png`
1. Obedecer à dica "Escolha um modelo de landing page".
2. Algo relacionado à loja dela.
3. 24 modelos de "marcas fictícias": carros elétricos, plantas, formigas, tecnologia espacial, cafeteria, eletrodomésticos… Os filtros dizem "Hero centralizado", "Hero dividido", "Bento grid", "Composição em pôster", "Tipografia monumental", "Página cinematográfica".
4. **Não.** Ela não entende por que precisa de uma "página de apresentação" se o sistema é só para ela e dois funcionários, nem o que carro e formiga têm a ver com a loja.
5. Pensa em voltar e não sabe para onde.
6. **Sim, muito.**
7. Não.
8. **SIM. Aqui a Marta provavelmente fecharia o site ou ligaria para o sobrinho.** Motivos: (a) o Studio não deixa avançar sem escolher algo que ela não quer e não entende; (b) jargão concentrado (landing, hero, bento grid); (c) nenhuma miniatura se parece com o negócio dela; (d) já são 15 interações e ela ainda está na etapa 2 de 10.
9. As miniaturas são bonitas e profissionais, mas não falam com ela.
10. Para "Sistema" com público interno, pular esta escolha (pré-selecionar "Apenas login") ou perguntar em linguagem simples: "Pessoas de fora vão ver uma página de apresentação da sua empresa? ( ) Não, só eu e minha equipe ( ) Sim". Filtros em português simples. Miniaturas adaptadas ao nome do projeto, como já acontece no login.

> **Daqui em diante a avaliadora continuou a jornada** para registrar o restante, mas mantendo as escolhas que a Marta faria. Tudo o que vem depois é "o que ela encontraria *se* não tivesse desistido".

### Passo 9 — Escolher a landing "Nexa Finance" (interação 18)
Depois: `15-depois-escolher-nexa.png`, `15b-topo-depois-escolher-nexa.png`
1. Escolher a que mais lembra uma empresa ("Todo o dinheiro da sua empresa em um painel").
2. Ver a escolha marcada.
3. Selo "✓ Selecionado", borda, aviso "Landing 'Nexa Finance' selecionada e incluída no Master Prompt" e um ✓ na aba. A caixa de resumo mostra "Landing selecionada: Nexa Finance".
4. Sim, a marcação é ótima. Mas surge um medo: "vai ficar com o nome Nexa Finance?".
5. Não.
6. Um pouco ("Master Prompt" de novo, sem explicação).
7. Não.
8. —
9. Sim.
10. Mostrar a prévia com "Loja da Marta" no lugar da marca fictícia, ou avisar: "os textos serão trocados pelos da sua loja".

### Passo 10 — Aba "Login": ver prévia e selecionar (interações 19 a 21)
Capturas: `16-aba-login.png`, `16b-aba-login-miniaturas.png` → `17-previa-login-classico.png` → `18-depois-selecionar-login.png`, `19-modal-continua-aberto-apos-selecionar.png`
1. Escolher a tela de entrar ("Clássico central — o formato mais conhecido").
2. Ver como fica e escolher.
3. **As miniaturas e a prévia mostram "Loja da Marta".** A prévia é grande e dá para testar. Depois de "Selecionar este modelo", aparece o aviso de confirmação, mas a **janela continua aberta**, com o botão virando "Modelo selecionado" (apagado). É preciso fechar no "X".
4. Sim. "Olha, minha loja!" é o melhor momento da jornada.
5. Não.
6. Pouco. Esperava que a janela fechasse sozinha.
7. Leve: a janela parada passa a sensação de "e agora?".
8. Não.
9. Sim, muito.
10. Fechar a janela automaticamente depois de selecionar, ou oferecer "Selecionar e continuar".

### Passo 11 — Aba "Cadastro", escolher e continuar (interações 22 a 24)
Capturas: `20-aba-cadastro.png`, `20b-aba-cadastro-miniaturas.png` → `21-depois-escolher-cadastro-simplificado.png` → `22-tela-desktop.png`
1. Escolher o cadastro. Para a Marta, "cadastro" é **cadastro de clientes e produtos**. Só ao ver as miniaturas ("Crie sua conta") entende que é outra coisa. Escolheu "Cadastro simplificado — o mínimo possível".
2. Ver marcado e continuar.
3. Selo "Selecionado" e aviso de confirmação. "Continuar: Desktop" levou à etapa 3.
4. Sim.
5. Não.
6. Sim, com o duplo sentido de "Cadastro".
7. Não.
8. Não.
9. Sim.
10. Renomear para "Criação de conta de usuário".

### Passo 12 — "Arquitetura do computador": escolher o esqueleto (interações 25 e 26) ⚠️ risco médio de abandono
Capturas: `22-tela-desktop.png`, `23-layouts-desktop-miniaturas.png`, `23b-layouts-desktop-miniaturas-mais.png` → antes `24-antes-clicar-sidebar-classica.png` → depois `25-depois-clicar-sidebar-classica.png`
1. Escolher "onde ficam o header (barra do topo), a sidebar (menu lateral) e o conteúdo".
2. Poucas opções.
3. **42 modelos em 8 famílias** ("Sidebar integral", "Sidebars flutuantes", "Rail e navegação dupla", "One Screen"…). Mas as miniaturas têm etiquetas coloridas (SIDEBAR roxa, HEADER azul, CONTEÚDO verde), há um painel de detalhe à direita e a marca "**Sugerido** · Sistemas e SaaS" na primeira opção. Um clique no cartão já escolhe: aparece o selo "✓ Escolhido" e "Escolhido para o seu projeto".
4. Sim, mas **escolheu porque estava escrito "Sugerido"**, não por entender as diferenças.
5. Não.
6. Sim, com a quantidade e com termos como "Rail", "topbar", "Medidas recomendadas… 252 px".
7. Não.
8. Risco médio. Só continua graças ao "Sugerido".
9. Sim.
10. Mostrar primeiro só as 2 ou 3 sugeridas para o tipo de projeto e um "ver todos os 42 modelos". Esconder as medidas em px.

### Passo 13 — "Arquitetura do celular" (interações 27 e 28)
Capturas: `27-tela-mobile.png`, `27b-tela-mobile-miniaturas.png` → `28-depois-escolher-bottom-nav.png`
1. Escolher como fica no celular.
2. O mesmo comportamento da etapa anterior.
3. 44 modelos ("Bottom Navigation clássica", "Drawer", "Dock flutuante", "Topbar"). Há um celular grande com "Saldo do mês R$ 12.480, Pedidos 128, Clientes 64", que ela entende. **Aqui clicar no cartão só mostra a prévia**: foi preciso apertar "Escolher este modelo". Depois disso: "Escolhido para o seu projeto".
4. Sim.
5. Não.
6. Um pouco: os nomes estão em inglês e a forma de escolher é diferente da etapa anterior.
7. Não.
8. Não.
9. Sim.
10. Nomes em português ("Menu embaixo, com 4 ícones"). A mesma forma de escolher em todas as etapas.

### Passo 14 — Revisão e "Aprovar esqueleto e continuar" (interações 29 e 30)
Capturas: `29-tela-revisao.png`, `29-tela-revisao-completa.png` → `30-depois-aprovar-previa.png`
1. Conferir e aprovar.
2. Um resumo.
3. Bom resumo: nome, tipo, objetivo, funcionalidades e miniaturas de cada escolha com "Alterar". Detalhes: o topo ainda dizia "**Esqueleto 4/5**" enquanto a página dizia "Esqueleto completo", o título "Esqueleto aprovado" aparece *antes* de aprovar, e o cadastro está "Sem prévia". Ao aprovar: aviso "Esqueleto aprovado. Agora vamos ao acabamento." e as etapas 6 a 10 foram liberadas.
4. Sim.
5. Não.
6. Pouco (4/5 contra "completo").
7. Não.
8. Não.
9. Sim.
10. Alinhar o contador. Trocar o título para "Seu esqueleto".

### Passo 15 — "Prévia integrada": ver no celular e ir para Cores (interações 31 e 32)
Capturas: `30-depois-aprovar-previa.png`, `31-previa-no-celular.png` → `32-tela-cores.png`
1. Ver o sistema montado.
2. Ver *o sistema dela*.
3. Aparece "Loja da Marta", mas o menu lateral mostra "Início, Relatórios, Clientes, **Agenda, Mensagens**, Configurações", com "Projetos/Equipe", "Plano Pro", "Ana Vieira" e "Receita R$ 48,2 mil". **"Estoque" e "Vendas", que ela digitou, não aparecem.**
4. Em parte: "Cadê o Estoque? Cadê as Vendas?".
5. Não.
6. Sim, fica com medo de que o sistema não tenha estoque.
7. Não.
8. Não, mas ela perde a confiança.
9. Sim.
10. Usar as funcionalidades declaradas como itens do menu e títulos da prévia.

### Passo 16 — Cores: buscar "laranja" e escolher a paleta (interações 33 e 34)
Capturas: `33-busca-laranja.png` → antes `34-antes-escolher-engenharia.png` → depois `34b-depois-escolher-engenharia.png`
1. Achar as cores da loja (laranja).
2. Ver opções laranja.
3. A busca funcionou (10 resultados). Ela achou "**Engenharia — Azul técnico e laranja de segurança**", perfeita para material de construção. Selo "Selecionado" e a prévia ao lado mudou de cor na hora.
4. Sim.
5. Não.
6. Pouco. O texto fala em "tokens", e a prévia mostra "Primário", "Hover", "Placeholder…", "Com foco". A prévia diz "Marca" em vez de "Loja da Marta".
7. Não.
8. Não.
9. Sim.
10. Trocar "tokens" por "cores do sistema". Rótulos da prévia em linguagem comum ("Botão principal", "Ao passar o mouse"). Mostrar o nome do projeto na prévia.

### Passo 17 — "Headers e sidebars": clicar no termo "Header" (interações 35 e 36)
Capturas: `35-tela-navegacao.png`, `35b-tela-navegacao-rolada.png`, `36-clique-termo-header.png`
1. Entender o que é "Header" clicando na palavra sublinhada.
2. Uma explicação.
3. **Nada apareceu ao clicar.** O título da etapa está em inglês e o texto cita "Layout Studio", um nome que nunca apareceu no modo guiado. Há 36 headers e 36 sidebars, com composições A e B. Os exemplos são cabeçalhos de site de marketing ("Ipê", "Começar grátis", "Sacola"). A etapa diz "Etapa opcional".
4. Não. Ela pula porque é opcional.
5. Não.
6. Sim.
7. **Sim: o termo sublinhado "não funciona" com clique** (veja o passo 23).
8. Não, porque "opcional" deixa pular.
9. Sim.
10. Título "Aparência dos menus". Fazer a explicação abrir com clique. Remover a referência a "Layout Studio".

### Passo 18 — Pular "Componentes" e chegar ao Master Prompt (interações 37 e 38)
Capturas: `37-tela-componentes.png`, `37b-tela-componentes-rolada.png` → `38-tela-entrega.png`, `38-tela-entrega-completa.png`
1. Pular mais uma etapa opcional ("Text inputs", "Soft Pill", "Glassmorphism", "Neo Brutalist"…) e terminar.
2. Uma tela final dizendo "pronto, agora faça isto".
3. "Etapa 10 de 10 · Master Prompt": "Copie, baixe ou exporte em JSON e CSS". Há indicadores (9 itens, 0 contradições…), abas "Itens / Contradições / Especificação JSON", os botões "Copiar Master Prompt" e "Baixar .md" e um texto técnico de **24.746 caracteres**.
4. **Não.** Ela não sabe o que é JSON, CSS ou .md, nem onde colar.
5. Não.
6. **Sim, muito.**
7. Não.
8. Não abandona o site, mas **não consegue concluir o objetivo sozinha** ("liga para o sobrinho").
9. Sim, mas é intimidante.
10. Começar a etapa final com "**O que fazer agora**": 1) Copie; 2) abra a sua IA (Claude, ChatGPT…); 3) cole e envie. Mostrar um resumo em linguagem simples antes do texto técnico. Trocar "Baixar .md" por "Baixar arquivo de texto".

### Passo 19 — "Copiar Master Prompt" e "Baixar .md" (interações 39 e 40)
Capturas: `39-depois-copiar.png`, `40-depois-baixar-md.png` · arquivos: `downloads/master-prompt-copiado.md`, `downloads/loja-da-marta-master-prompt.md`
1. Pegar o resultado.
2. Confirmação.
3. O botão virou "✓ Copiado" e apareceu o aviso "Copiado para a área de transferência" (24.746 caracteres). O download gerou `loja-da-marta-master-prompt.md` (25.673 bytes). O conteúdo **cita "Estoque" só 2 vezes** (no objetivo e na lista de funcionalidades), não descreve nenhuma tela de estoque ou de vendas, mas **descreve em detalhe a landing de banco digital** ("logotipo 'Nexa'", "CTA 'Abrir conta grátis'", "Planos e preços em 3 colunas"). Traz ainda 92 ocorrências de "px", além de termos como `aria-pressed`, "hero", "CTA" e "tokens".
4. Entendeu que copiou e baixou. Não entende o conteúdo.
5. Não.
6. Sim.
7. Não.
8. —
9. Sim.
10. Adaptar os textos da landing ao projeto. Gerar uma seção por funcionalidade declarada (Estoque, Vendas, Clientes).

### Passo 20 — "Abrir Central de Prompts" (interação 41)
Captura: `41-central-de-prompts.png`
1. Clicar no botão principal do canto inferior direito, esperando o "próximo passo".
2. Instruções do que fazer com o texto.
3. Abriu outra página, "Central de Prompts", **praticamente igual** à etapa 10 (mesmos indicadores, abas e botões), agora fora do modo guiado (o caminho no topo diz "Início › Entrega › Central de Prompts").
4. Não: "já não estava aqui?".
5. Sim, mentalmente.
6. Sim.
7. Sim, um botão que "não leva a lugar nenhum novo".
8. —
9. Sim.
10. Na etapa final, trocar este botão por "Como usar com a IA" ou "Concluir".

### Passo 21 — Experimentar "Livre" e voltar para "Guiado" (interações 42 e 43)
Capturas: `42-depois-clicar-livre.png` → `43-depois-voltar-guiado.png`
1. Entender a diferença entre os modos.
2. —
3. "Livre" abre "Todos os módulos": cartões com o status de cada escolha ("✓ Nexa Finance", "✓ Engenharia"…), com nomes em inglês ("Live Site Preview", "Color System", "Navigation Showcase"). "Guiado" voltou exatamente para a etapa 10.
4. Sim: o Livre é "a lista de tudo"; o Guiado, "o passo a passo".
5. Não.
6. Pouco.
7. Não.
8. Não.
9. Sim.
10. Nomes dos módulos em português.

### Passo 22 — Ícone de pasta no topo (interação 44)
Capturas: `44-hover-icone-pasta.png` → `44b-depois-clicar-icone-pasta.png`
1. Descobrir o que é o ícone de pasta com seta.
2. —
3. O ícone não tem texto (só a dica nativa "Exportar e importar" ao passar o mouse). Leva a "Exportar e importar", onde finalmente aparece a frase mais útil da jornada: "**Master Prompt (.md) — Texto completo com todas as decisões aprovadas, pronto para colar na IA**". Também há "Especificação JSON", "CSS de referência", "Ficha do projeto (HTML)" e "Backup completo".
4. Em parte.
5. Não.
6. Sim (JSON, CSS, backup).
7. Não.
8. —
9. Sim.
10. Levar a frase "pronto para colar na IA" para a etapa 10. Dar texto ao ícone ("Salvar/baixar").

### Passo 23 — Passar o mouse e clicar no termo "Sidebar" (interação 45)
Capturas: `45-hover-termo-sidebar.png` → `45b-clique-termo-sidebar.png`
1. Confirmar se as palavras sublinhadas explicam algo.
2. —
3. **Ao passar o mouse** aparece a explicação "Menu ou painel de navegação na lateral da tela". **Ao clicar, ela some.** Isso explica o passo 17: quem clica, como a Marta, nunca vê a explicação.
4. Agora sim.
5. —
6. —
7. **Sim, confirmado.**
8. —
9. Sim.
10. O clique (e o toque, no celular) deve abrir e manter a explicação.

---

## 3. Respostas finais

| Pergunta | Resposta | Evidência |
|---|---|---|
| Entende a proposta do produto? | **Parcialmente.** Entende "escolher visualmente e no fim entregar para a IA", mas a página fala em "site" (ela quer um sistema) e usa "Master Prompt", "Claude Code" e "Cursor" sem explicar. | `01-primeira-tela.png` |
| Sabe por onde começar? | **Sim.** "Modo Guiado — Recomendado para iniciantes", com botão grande. Ressalva: o botão fica na borda da tela em 1366×768. | `01`, `02`, `03` |
| Entende a diferença entre Guiado e Livre? | **Parcialmente.** Entende "Guiado = me explica e me conduz", que é o que basta para escolher. "Livre = acesso direto a qualquer módulo" é abstrato até ela ver a lista de módulos com nomes em inglês. | `02`, `42`, `43` |
| Reconhece o que é um header? | **Só com a tradução ao lado** ("header (barra do topo)") e as etiquetas coloridas nos desenhos. Sem isso, não. A explicação ao passar o mouse existe, mas some ao clicar. | `22`, `23`, `36`, `45`, `45b` |
| E uma sidebar? | **Igual ao header.** "Sidebar (menu lateral)" e a etiqueta roxa nas miniaturas ajudam. | `23`, `25`, `45` |
| Entende as miniaturas? | **Depende.** As de login e a prévia integrada, com "Loja da Marta", ela entende bem. As landings de marcas fictícias (carros, formigas) entende como "exemplos", mas não vê relação com o negócio. Os esqueletos de layout em cinza, com etiquetas coloridas, entende em parte. O celular grande com valores em R$ entende bem. | `14`, `14b`, `16b`, `17`, `23`, `27b`, `30` |
| Consegue escolher um layout sem explicação externa? | **Sim, mas pelo selo "Sugerido"**, não por compreender as 42 e 44 opções. | `23`, `25`, `27b`, `28` |
| Percebe quando uma opção foi selecionada? | **Sim, na maioria das vezes.** Selos "✓ Selecionado/Escolhido", borda, avisos "incluído no Master Prompt" e ✓ nas abas e etapas. Exceções: na etapa 1 há só uma borda discreta, e "Usar esta sugestão" quase não dá retorno. | `05`, `10`, `15`, `21`, `25`, `28`, `34b` |
| Consegue chegar ao Master Prompt? | **Sim, tecnicamente** (interação 38), **mas a persona provavelmente teria desistido antes, na etapa 2.** | `38` |
| Entende o que fazer com o resultado? | **Não.** Não há instrução de onde colar. O texto é técnico (24.746 caracteres), ".md/JSON/CSS" não significam nada para ela, o botão seguinte leva a uma página repetida, e a única frase "pronto para colar na IA" fica escondida atrás de um ícone sem texto. | `38`, `39`, `41`, `44b` |

---

## 4. Problemas encontrados

| # | Título | Onde | Evidência | Gravidade | Sugestão concreta |
|---|---|---|---|---|---|
| P1 | Etapa obriga a escolher uma landing page que a pessoa não quer nem entende | `#/guiado/entrada`, aba "Landing page" | `12`, `13`, `14`, `14b` | **Bloqueante** (ponto de abandono) | Para "Sistema" com público interno, sugerir "Apenas login" (o próprio Studio diz "Ex.: ferramenta interna de uma empresa"). Perguntar em linguagem simples se pessoas de fora vão ver uma página de apresentação. Tornar a landing opcional. |
| P2 | Botão "Continuar" desabilitado não diz o que falta e não reage ao clique | `#/guiado/entrada` (e as outras etapas) | `12`, `11-tela-entrada-completa` (aviso "Pronto…" fora da tela) | **Alta** | Mostrar ao lado do botão uma lista do que falta, com links. Ao clicar no botão desabilitado, rolar até o item pendente e destacá-lo. Deixar claro que as abas Landing, Login e Cadastro são passos obrigatórios. |
| P3 | Etapa final não explica o que fazer com o Master Prompt | `#/guiado/entrega`, `#/prompt` | `38`, `39`, `41`, `44b` | **Alta** | Bloco "O que fazer agora" com 3 passos (copiar → abrir a IA → colar). Resumo em linguagem simples antes do texto técnico. Trazer a frase "pronto para colar na IA" (hoje só em `#/exportar`). Trocar "Abrir Central de Prompts", que leva a uma página repetida, por "Como usar com a IA". |
| P4 | Funcionalidades declaradas (Estoque, Vendas) somem da prévia e quase somem do Master Prompt, enquanto o conteúdo fictício da landing de banco digital entra detalhado | `#/guiado/preview`, Master Prompt | `30`, `31`, `downloads/loja-da-marta-master-prompt.md` (linhas 20–41) | **Alta** (risco de a IA construir algo errado sem a pessoa perceber) | Usar as funcionalidades como itens do menu da prévia. Gerar no prompt uma seção por funcionalidade. Trocar marca e textos do modelo pelos do projeto ("Loja da Marta" no lugar de "Nexa", sem "Abrir conta grátis" e "Planos e preços"). |
| P5 | Jargão em inglês e técnico em todo o fluxo guiado, que promete o contrário | Todas as etapas e o menu lateral | `01`, `11`, `13`, `22`, `27b`, `32`, `35`, `37b`, `42` | **Alta** | Rótulos em português primeiro, termo técnico entre parênteses ("Página de apresentação (landing)", "Menu embaixo (bottom navigation)"). Renomear "Headers e sidebars" para "Aparência dos menus" e "Landing, login e cadastro" para "Como as pessoas entram". Remover "Layout Studio", "tokens", "Hover", "Placeholder", "Soft Pill", "Glassmorphism" da visão do iniciante. |
| P6 | Excesso de opções sem um caminho curto | Landing (24), Login (24), Desktop (42), Mobile (44), Paletas (60), Headers/Sidebars (36+36), Componentes (66×16) | `14`, `16b`, `22`, `27b`, `32`, `35b`, `37b` | **Média** | Mostrar 3 recomendadas para o tipo de projeto e um "Ver todas as N". |
| P7 | Explicações dos termos sublinhados somem ao clicar | `#/guiado/navegacao` (e os outros termos sublinhados) | `36`, `45`, `45b` | **Média** | Clique e toque abrem e mantêm a explicação; fecha com Esc ou clique fora. |
| P8 | Formas diferentes de escolher conforme a etapa | Desktop (clique no cartão escolhe), Mobile (clique só mostra a prévia, precisa de "Escolher este modelo"), prévia do Login (janela não fecha depois de selecionar) | `25`, `27b`, `28`, `18`, `19` | **Média** | Um padrão único. Fechar a janela depois de "Selecionar este modelo" ou oferecer "Selecionar e continuar". |
| P9 | "Cadastro" tem duplo sentido para quem tem comércio | `#/guiado/entrada`, aba "Cadastro" | `20`, `20b` | **Média** | "Criação de conta de usuário". |
| P10 | "Usar esta sugestão" quase não dá retorno e aplica algo que a pessoa não vê | `#/guiado/objetivo` | `09`, `10` | **Média** | Aviso dizendo o que foi aplicado e onde mudar. Rever a sugestão para sistemas internos (P1). |
| P11 | Contador e títulos incoerentes na revisão | `#/guiado/revisao` | `29-tela-revisao-completa` | **Baixa** | Topo dizia "Esqueleto 4/5" com a página dizendo "Esqueleto completo"; "Esqueleto aprovado" aparece antes de aprovar. Alinhar. |
| P12 | Conteúdo importante abaixo da dobra em 1366×768 | Início (botão "Começar…"), Objetivo (formulário "Sobre o projeto"), Entrada (aviso "Pronto…") | `01`, `03`, `11-tela-entrada-completa` | **Baixa** | Subir o botão principal. Indicar "mais perguntas abaixo". Mostrar o aviso de pendência perto do botão Continuar. |
| P13 | Ícone sem texto no topo e indicador "Esqueleto 0/5" sem explicação | Topo de todas as telas | `01`, `44` | **Baixa** | Rótulo visível ("Salvar/baixar"). Explicar "Esqueleto" com uma dica ou no primeiro acesso. |
| P14 | Chamada da página inicial fala em "site", e a pessoa quer um "sistema" | `#/` | `01` | **Baixa** | "Do site **ou sistema** que você imagina…". |
| P15 | Etapas opcionais puladas ficam com ✓ de concluídas | Barra de etapas e menu lateral (8. Navegação, 9. Componentes) | `38`, `45` | **Baixa** | Marcar como "pulada (opcional)" em vez de ✓, para não sugerir que algo foi escolhido. |

Observação não verificada: na "Prévia integrada", os links "Alterar" do painel "Escolhas nesta prévia" apontam para `#/modulos/...`, as páginas do modo Livre (vi isso na árvore acessível, mas não cliquei). Se for o caso, tiram a pessoa do fluxo guiado.

---

## 5. O que funcionou bem para a Marta (com evidência)

1. **Entrada clara para iniciantes**: o selo "Recomendado para iniciantes" e o botão "Começar no modo guiado" fizeram a escolha sem esforço (`01`, `02`).
2. **Orientação de progresso**: "Etapa X de 10", barra numerada, ✓ verdes nas etapas concluídas e cadeado com "libera após aprovar o esqueleto" (`03`, `22`, `30`).
3. **Retorno de seleção forte** na maioria das escolhas: selo "✓ Selecionado/Escolhido", borda e aviso "incluído no Master Prompt" (`15`, `21`, `25`, `28`, `34b`).
4. **Personalização com o nome do projeto** nas telas de login e na prévia integrada, com "Loja da Marta". Foi o momento de maior confiança (`16b`, `17`, `30`).
5. **Selo "Sugerido"** permitiu escolher entre 42 e 44 layouts sem entender as diferenças (`23`, `27b`).
6. **Etiquetas coloridas nas miniaturas** (SIDEBAR, HEADER, CONTEÚDO) com tradução ("barra superior", "menu lateral") ligam o jargão à imagem (`22`, `23`).
7. **Busca de paletas por palavra comum**: "laranja" achou "Engenharia — laranja de segurança", ideal para material de construção, e a prévia mudou de cor na hora (`33`, `34b`).
8. **Formulário de objetivo simples**, com etiquetas e sugestões de funcionalidades (`08`).
9. **Salvamento automático real**: "Salvo automaticamente neste navegador", e o projeto sobreviveu a cerca de 30 reaberturas do navegador durante o teste.
10. **Etapas opcionais sinalizadas** ("Etapa opcional") permitiram pular Navegação e Componentes sem culpa (`35`, `37`).
11. **Revisão com resumo e "Alterar"** em cada item (`29`).
12. **Copiar com confirmação** ("✓ Copiado" e aviso) e **arquivo baixado com nome reconhecível** (`loja-da-marta-master-prompt.md`) (`39`, `40`).
13. **Visual profissional e consistente** em todas as telas.

---

## Arquivos

- Relatório: `relatorio.md` (este arquivo)
- Capturas: `capturas/` (64 PNG, numeradas pelo passo)
- Scripts: `passo.cjs` (executor) e `passos/*.cjs` (um por passo)
- Perfil do navegador: `perfil/`
- Saídas obtidas: `downloads/loja-da-marta-master-prompt.md`, `downloads/master-prompt-copiado.md`, `downloads/texto-visivel-tela-entrega.txt`
