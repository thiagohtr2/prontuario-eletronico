# A5 · Celular — teste exploratório com persona simulada

## 1. Aviso e aparelhos emulados

**Este NÃO é um teste com pessoas.** Um agente de IA fez o papel da persona "Joana": 27 anos, dona de barbearia, sem computador, acostumada com Instagram e iFood, sem conhecimento de design ou programação. As reações de "entendeu/confusa/abandonaria" são inferências do agente a partir do que aparece na tela. Use como hipóteses para validar com usuárias reais.

- **Objetivo da persona:** escolher pelo celular o design de um app de agendamento (agenda, serviços, clientes, perfil) e sair com um resultado para entregar a uma IA.
- **Única informação prévia:** `http://127.0.0.1:4300/`. Não li código, README, documentação nem relatórios de outros agentes.
- **Ferramenta:** Playwright 1.63 com Chromium e perfil persistente limpo (`perfil/`). Os toques foram feitos com `locator.tap()`. A rolagem usou toque real (sequência `touchStart/touchMove/touchEnd` via CDP) e `mouse.wheel`.
- **Aparelhos emulados:**

| Aparelho | Viewport | DPR | isMobile/hasTouch | User agent |
|---|---|---|---|---|
| Android pequeno (jornada principal) | 360×800 | 3 | sim/sim | Android 13, Chrome 130 Mobile |
| iPhone do marido (partes críticas) | 390×844 | 3 | sim/sim | iOS 17.5, Safari Mobile (renderizado com Chromium) |
| Paisagem (4 telas) | 800×360 | 3 | sim/sim | Android 13, Chrome 130 Mobile |

- **Interações:** 65 registradas em `scripts/interacoes.log` (A01–A65). Os scripts que reproduzem cada passo estão em `scripts/`, as capturas em `capturas/` e o arquivo baixado em `downloads/`.
- **Limitações:**
  - Só havia Chromium, sem WebKit. O comportamento específico do Safari (download de `.md`, barra de endereço que encolhe, áreas seguras) não foi verificado.
  - O teclado virtual não aparece na emulação. Simulei o teclado aberto reduzindo a altura para 480 px.
  - O gesto `Input.synthesizeScrollGesture` não teve efeito no Chromium headless. Isso é limitação da ferramenta, não do site, e o substituí por eventos de toque reais.
  - Uma interação foi acidental (A36: a lupa de busca foi tocada por engano). Ela foi registrada como parte da exploração.

---

## 2. Caminho seguido

Legenda das 10 perguntas: (1) o que tentou · (2) o que esperava · (3) o que aconteceu · (4) entendeu? · (5) precisou voltar? · (6) ficou confusa? · (7) algum controle falhou? · (8) abandonaria? · (9) parece profissional? · (10) melhoria.

### P1 · Página inicial (A01–A03) — capturas `01-home-360-topo`, `01-home-360-pagina-inteira`, `02-home-360-rolada`
1. Entender o site e começar.
2. Um botão "começar".
3. O título e o texto são claros, e há dois cartões: "Modo Guiado (Recomendado para iniciantes)" e "Modo Livre". O botão "Começar no modo guiado" (278×48) aparece depois de uma rolagem e leva a `#/guiado/objetivo`.
4. Sim. "Você não precisa conhecer termos como sidebar, drawer" tranquiliza.
5. Não.
6. Pouco. Não há nenhuma menção a "app" ou "agendamento", só a "site".
7. Nenhum.
8. Não.
9. Sim, visual limpo e sem rolagem lateral.
10. Mostrar o botão principal já na primeira tela. Hoje o texto ocupa toda a dobra.

### P2 · Etapa 1 "Objetivo do projeto" (A04–A10) — `03-guiado-passo1-topo`, `03-guiado-passo1-inteira`, `04-objetivo-app-selecionado`, `05-objetivo-campos-preenchidos`, `06-objetivo-teclado-simulado-480`
1. Escolher o tipo de projeto e preencher nome, objetivo e público.
2. Escolher e seguir.
3. Na primeira tela só aparece **um** dos 7 cartões de tipo. A barra de progresso dupla ("Esqueleto/Acabamento") ocupa cerca de 200 px e o rodapé fixo ocupa **158 px (20% da tela)** com "Início", a dica e "Continuar" desabilitado.
   - Escolhi "Aplicativo ou SaaS". A rolagem não pulou (300→300) e o rodapé encolheu para 69 px.
   - Os campos têm 328×44 e fonte de 16 px, então não deve haver zoom no iOS. Com o teclado simulado (480 px de altura), o campo em foco continua visível: 218–262 px, acima do rodapé em 411 px.
   - O nome ficou salvo depois de recarregar.
4. Mais ou menos. "SaaS" não quer dizer nada para ela, mas o texto "Sistema com login…" ajudou.
5. Não.
6. Um pouco, com "One Screen" e "SaaS".
7. Nenhum.
8. Não.
9. Sim.
10. Compactar a barra de progresso para algo como "Etapa 1 de 10" e mostrar os tipos já na primeira tela. Trocar "Aplicativo ou SaaS" por "Aplicativo com login (ex.: agendamento)".

### P3 · Etapa 2 "Como as pessoas entram" (A11–A14) — `07-passo2-entrada-topo`, `08-passo2-opcoes-visiveis`, `09-passo2-apos-escolher`, `10-passo2-tap-continuar-desabilitado`, `11-passo2-abas-no-topo`
1. Escolher "Landing page com chamada para login" (página da barbearia mais o botão Entrar).
2. Escolher e continuar.
3. **A primeira tela não mostra nenhuma opção**: só o progresso, o título, o aviso azul e o rodapé de 158 px.
   - Depois de rolar e escolher, o cartão mostra "Selecionado", mas **"Continuar: Desktop" segue desabilitado**. O rodapé diz "Escolha um modelo de landing page" e não há nenhum modelo à vista.
   - As novas abas (Landing page / Login / Cadastro) apareceram **acima, fora da tela** (em 443 px, com a página rolada até 550 px).
   - A frase "Pronto. Agora escolha… nas abas acima" ficou no fim da lista.
   - Tocar no botão desabilitado não dá nenhum retorno: a URL e a rolagem não mudam.
4. Não. Ela não sabe onde está o "modelo de landing page".
5. Sim, precisou rolar para cima procurando.
6. **Sim, muito.**
7. "Continuar" desabilitado sem explicação na tela.
8. **Provável ponto de abandono.**
9. O visual sim, o fluxo não.
10. Depois da escolha, rolar automaticamente até as abas ou abrir a aba "Landing page" sozinho. Trocar o botão desabilitado por "Escolher a página de apresentação →", que leve até lá.

### P4 · Etapa 2, aba "Landing page": lista, prévia ampliada e seleção (A15–A21) — `12-passo2-aba-landing`, `12b-landing-miniaturas-recorte`, `13-landing-lista-rolada-touch`, `14-previa-aberta`, `15-previa-rolada-dentro`, `16-previa-modo-computador`, `17-apos-selecionar-landing`, `18-apos-fechar-previa`
1. Ver modelos, ampliar um e escolher.
2. Grade de fotos como no Instagram e prévia em tela cheia.
3. A aba abre de novo no topo e as miniaturas só começam depois de cerca de 900 px.
   - São 24 modelos numa página de **11.333 px**. O filtro é um `select` ("Todas (24)").
   - As miniaturas são bonitas, mas o texto dentro delas tem **3,2 a 4,8 px efetivos** e só serve como imagem.
   - "Ver prévia" (115×44) abre um bottom sheet que já vem no modo **"Celular"** (bom). Porém título, alternâncias e interruptor ocupam o topo, e o celular simulado aparece em só cerca de **250 px dos 800 (31%)**.
   - Arrastar o dedo sobre o celular rola a prévia, e o fundo fica travado (body com overflow oculto).
   - No modo "Computador" o texto vira 3–5 px, ilegível.
   - "Selecionar este modelo" funciona, mas **o modal continua aberto** e o toast "Landing… selecionada" cobre os botões do rodapé. É preciso tocar no X (44×44).
   - Ao fechar, a posição na lista se mantém (1713→1713).
4. Sim, depois de abrir a prévia.
5. Não.
6. Um pouco: "Cores do modelo / Minha identidade" e "Manter as cores originais deste modelo no projeto" são confusos para ela.
7. Nenhum.
8. Não.
9. Sim.
10. Prévia em tela cheia, com os controles recolhidos num botão de "Ajustes". Fechar o modal sozinho depois de "Selecionar". Os modelos são de carros, SaaS e floricultura; mostrar exemplos com o nome do projeto, como já acontece no login.

### P5 · Etapa 2, abas "Login" e "Cadastro" (A22–A28) — `19-abas-arrastadas`, `20-aba-login`, `21-login-modelos`, `22-login-apos-tocar-miniatura`, `23-aba-cadastro`
1. Ir para "Login".
2. Ver as abas.
3. A barra de abas tem 505 px de conteúdo em 328 px visíveis. "Login" aparece cortada na borda (x=355) e **"Cadastro" fica totalmente escondida**, sem seta, sombra ou indicação. Só arrastando a barra para o lado (o arrasto funcionou, scrollLeft 177) as duas aparecem.
   - Na aba Login, os 5 filtros viram cinco "pílulas" empilhadas, uma por linha.
   - Tocar na miniatura "Clássico central" seleciona na hora, sem pulo de rolagem (770→770). O toast cobre o rodapé por alguns segundos.
   - O nome "Barbearia da Joana" aparece dentro das prévias de login. Isso é ótimo.
4. Sim, depois de achar as abas.
5. Sim, precisou subir de novo.
6. Sim, para achar "Cadastro".
7. Nenhum.
8. Talvez.
9. Sim.
10. Trocar as abas roláveis por um passo a passo "1 Página · 2 Login · 3 Cadastro" que caiba em 360 px, ou por um indicador de rolagem.

### P6 · Etapa 3 "Arquitetura do computador" (A29–A31) — `24-passo3-desktop-topo`, `24b-desktop-miniaturas-recorte`, `25-desktop-exemplo`, `26-desktop-apos-escolher`
1. Escolher algo rápido, porque ela não tem computador.
2. Poder pular.
3. A etapa é obrigatória, com 42 modelos numa página de **18.384 px**.
   - O texto usa termos técnicos: "Sidebar ≈252 px", "Header ≈64 px", "rail", "referência 1280 × 800".
   - Toquei em "Escolher este modelo" no exemplo sugerido e **a página pulou 378 px para cima** (1380→1002). O botão sumiu e o cartão mudou de tamanho.
4. Pouco.
5. Não.
6. Sim. Ela pensa "por que o computador, se o app é no celular?".
7. Nenhum.
8. Talvez.
9. Sim.
10. Permitir "usar a sugestão" com um toque e deixar a etapa opcional para quem só tem celular. Manter a rolagem estável ao escolher.

### P7 · Etapa 4 "Arquitetura do celular" (A32–A39) — `27-passo4-mobile-topo`, `27-passo4-mobile-inteira`, `28-mobile-fileira-miniaturas`, `29-mobile-fileira-deslizada`, `30-mobile-apos-tocar-miniatura`, `31-mobile-celular-grande`, `32-mobile-celular-grande-apos-toque`, `33-mobile-celular-grande-criar-novo`
1. Escolher como o app fica no celular.
2. Ver e escolher.
3. **É a melhor tela do fluxo.**
   - Há uma fileira horizontal de 44 miniaturas (cartões de 134×341) que rola com o dedo: o arrasto moveu 274 px.
   - Logo abaixo fica um celular grande e interativo. "Criar novo", de 51×51, responde ao toque.
   - Tocar numa miniatura já marca "Escolhido", sem pulo de rolagem (561→561). Porém o texto diz "Toque em um modelo para **ver** no celular grande", e o toque na verdade **escolhe**.
   - A lista horizontal soma 6.532 px, sem encaixe nem indicador de posição.
   - O botão de "Notificações" dentro da prévia tem 37×37.
   - Toquei sem querer na lupa do topo. A busca abriu como bottom sheet, com foco automático no campo (o teclado subiria) e fonte de 16 px. O X fecha.
4. Sim, mas os nomes são todos em inglês ("Bottom Navigation", "Dock", "Topbar", "Drawer").
5. Não.
6. Com os nomes, sim.
7. Nenhum.
8. Não.
9. Sim, muito.
10. Usar esse padrão (fileira horizontal mais prévia grande) nas etapas 2, 3 e 7. Nomes em português ("Menu embaixo com botão central").

### P8 · Etapa 5 "Revisão": "Resolver" leva para fora do guiado (A40–A44) — `34-passo5-revisao-topo`, `34-passo5-revisao-inteira`, `35-resolver-leva-para`, `36-cadastro-escolhido`, `37-drawer-aberto`, `38-revisao-pelo-menu`
1. Resolver a pendência "Escolha um fluxo de cadastro".
2. Voltar para a aba Cadastro e retornar à revisão.
3. O link "Resolver" tem **59×17 px**. Ele levou a `#/modulos/cadastro`, um **módulo do modo livre, sem o rodapé do guiado e sem botão de voltar para a revisão**.
   - A lista tem 8 cadastros e nenhuma opção visível de "sem cadastro", embora a revisão diga "ou confirme que não haverá cadastro".
   - Escolhi "Cadastro simplificado" tocando no cartão. Funcionou, sem pulo de rolagem.
   - Para voltar, abri o menu ☰. A gaveta de 310 px cobre 86% da tela, tem fundo escurecido e trava a rolagem; os itens têm 285×44.
   - No menu, a etapa "3 Arquitetura do computador" **aparece sem o ✓**, apesar de escolhida.
   - O toast ficou por cima da gaveta.
   - Tocar em "5 Revisão do esqueleto" fecha a gaveta e volta para a revisão, agora "Esqueleto completo".
   - Na revisão, os links "Alterar" têm 46×17 e 294×21 px, e o bloco ainda tem o título "Esqueleto aprovado" antes da aprovação.
4. Não, saiu do caminho.
5. Sim.
6. **Sim.**
7. "Resolver" funciona, mas leva para outro contexto.
8. **Provável ponto de abandono.**
9. Parcialmente.
10. "Resolver" deve abrir a aba Cadastro da etapa 2 dentro do guiado, com "Voltar para a revisão", e incluir "Não terá cadastro" como opção. Os links precisam de área de toque ≥44 px.

### P9 · Aprovar e Etapa 6 "Prévia integrada" (A45–A48) — `39-passo6-previa-integrada-topo`, `39-passo6-previa-integrada-inteira`, `40-reabertura-etapa6-mostrou-revisao-de-novo`, `41-reabertura-etapa6-pede-aprovar-de-novo`, `42-passo6-apos-reaprovar-topo`
1. Aprovar e ver tudo junto.
2. Ver o app no celular.
3. "Aprovar esqueleto e continuar" levou à Prévia integrada, com o toast "Esqueleto aprovado".
   - A prévia abre em **"Computador"** mesmo no celular, com texto de cerca de 3–5 px.
   - Ao reabrir o navegador nessa etapa (`#/guiado/preview`), **o app mostrou de novo o conteúdo da revisão e pediu "Aprovar esqueleto e continuar"**. A primeira aprovação parece não ter ficado salva. Foi preciso aprovar outra vez, e depois disso persistiu.
   - O caso foi visto uma vez e não reproduzido.
   - Na barra de progresso, "Desktop" continua cinza.
4. Mais ou menos.
5. Sim, aprovou duas vezes.
6. Sim.
7. A aprovação não persistiu na primeira vez.
8. Talvez.
9. Sim.
10. Abrir a prévia em "Celular" quando a tela tiver menos de 600 px. Salvar a aprovação imediatamente.

### P10 · Etapa 7 "Identidade visual" (A49–A51) — `43-passo7-identidade-topo`, `43-passo7-identidade-inteira`, `43b-identidade-paletas-recorte`, `44-paletas-quentes`, `45-paleta-escolhida`
1. Escolher cores (tons quentes e escuros, de barbearia).
2. Ver paletas e tocar.
3. As paletas só começam depois de uma grande prévia de componentes (cerca de 1.300 px). São 60 paletas numa página de **19.837 px**, com 11 filtros empilhados em 5 linhas.
   - O filtro "Quentes" funciona. Escolhi "Brasa" (escura) sem pulo de rolagem (2770→2770).
   - Há botões "CSS dos tokens" e "Prompt" (jargão), e um link "um link" de 42×15 px.
4. Sim.
5. Não.
6. Pouco.
7. Nenhum.
8. Não.
9. Sim.
10. Mostrar as paletas primeiro e a prévia depois, ou fixar uma mini-prévia. Esconder "CSS/tokens" num "Avançado".

### P11 · Etapas 8 "Headers e sidebars" e 9 "Componentes" (A51–A53) — `46-passo8-navegacao-topo`, `47-passo9-componentes-topo`
1. Seguir em frente, porque as duas são "Etapa opcional".
2. Poder pular.
3. Pulou com "Continuar".
   - A etapa 8 tem **28.511 px** e fala em "Sidebar", um menu lateral que não existe no app de celular escolhido.
   - Os termos de glossário "Header" (52×24) e "Sidebar" (55×24) são botões pequenos.
   - Dentro das prévias há "Dispensar anúncio" com 44×32 e campos "Buscar" com 217×23.
   - A etapa 9 diz "Escolha um tipo de componente **à esquerda**… **Clique** em Adicionar", mas no celular a categoria é um `select` acima.
4. Sim, entendeu que era opcional.
5. Não.
6. Com o texto da etapa 9, sim.
7. Nenhum.
8. Não, porque pulou.
9. Sim.
10. Textos adaptados ao celular ("toque", "acima"). Esconder Sidebar quando o celular usa menu inferior.

### P12 · Etapa 10 "Master Prompt": copiar e baixar (A53–A57) — `48-passo10-master-topo`, `48-passo10-master-inteira`, `49-master-botoes-visiveis`, `50-master-apos-copiar`, `51-master-apos-baixar`, `52-master-rolando-texto`
1. Pegar o resultado para mandar para a IA.
2. Botão "Copiar" ou "Compartilhar".
3. Na primeira tela em 360 px **não aparece nem "Copiar" nem "Baixar"**: o rodapé tem duas linhas e **125 px**, e o botão "Copiar Master Prompt" (em 721 px) fica atrás dele. O botão principal do rodapé é "Abrir Central de Prompts", que não é o que ela quer.
   - Depois de rolar:
     - **Copiar funciona**: a área de transferência recebeu 25.029 caracteres, o botão virou "✓ Copiado" e apareceu o toast "Copiado para a área de transferência".
     - **Baixar .md funciona**: arquivo `barbearia-da-joana-master-prompt.md` com 25.950 bytes e 400 linhas, em `downloads/`.
   - O texto aparece numa caixa de 328×720 com fonte de 13 px e rolagem própria; o arrasto rola a caixa e não a página (scrollTop 363).
   - **Problema de conteúdo:** o prompt da barbearia descreve a landing "VOLTA Motors — Carros elétricos", com navegação "Modelos, Tecnologia, Recarga, Lojas" e o botão "Agendar test drive" (7 menções a carro, VOLTA ou test drive).
4. Sim, depois de rolar.
5. Não.
6. Um pouco, com o primeiro botão e o tamanho do texto.
7. Nenhum.
8. Não, conseguiu.
9. Sim.
10. Pôr "Copiar" e "Compartilhar" no rodapé fixo e usar o menu de compartilhar do celular (WhatsApp/e-mail) via `navigator.share`. Avisar que textos de marcas de exemplo serão trocados, ou já gerar o prompt sem eles.

### P13 · iPhone 390×844 (A58–A60) — `53-iphone-limpo-sem-projeto`, `54-iphone-passo2-topo`, `55-iphone-previa-modal`, `56-iphone-master-topo`, `57-iphone-master-copiado`
1. Continuar no iPhone do marido.
2. Ver o projeto.
3. **Num navegador limpo o projeto não existe**: aparece "Projeto sem nome" e a revisão lista 5 pendências.
   - O botão "Aprovar esqueleto e continuar" aparece **habilitado** mesmo assim. Não toquei nele.
   - No mesmo navegador do Android, mas em 390×844, a prévia ampliada mostra o celular em cerca de **277 de 844 px (33%)**.
   - Na etapa 10, o rodapé cabe em uma linha (69 px) e "Copiar" fica visível sem rolar. Copiar funcionou (25.029 caracteres).
   - Nenhum alvo menor que 44 px nem rolagem lateral nessa tela.
4. Não. Ela acha que perdeu tudo.
5. Teria que voltar ao Android.
6. **Sim.**
7. Nenhum.
8. **Provável abandono se começar no iPhone.**
9. Sim.
10. Avisar desde a primeira etapa que o projeto fica salvo "só neste celular" e oferecer "Continuar em outro aparelho" (link ou código) ou "Salvar arquivo do projeto". Existe "Exportar e importar" no menu, mas o fluxo guiado não o sugere.

### P14 · Paisagem 800×360 (A61–A64) — `58-paisagem-passo2`, `59-paisagem-passo4-topo`, `60-paisagem-passo4-rolado`, `61-paisagem-previa-modal`, `62-paisagem-master`
1. Virar o celular para ver as prévias maiores.
2. Mais espaço.
3. Topo de 60 px mais rodapé de 65 px ocupam **125 de 360 px**, deixando **235 px (65%)** para o conteúdo.
   - Na etapa 2 a tela inteira é progresso. Os rótulos mostram "3. Desktop" e "6. Prévia" sem ✓.
   - Na etapa 4 há **texto sobreposto**: "Navegação inferior · 6 modelos" fica embaixo de "✓ Escolhido para o seu projeto".
   - A prévia ampliada vira um modal de 768×328 em "Computador", e a área do celular aparece em só cerca de **38 px**.
   - Os botões ficam com **40 px** de altura: "Selecionar este modelo" 222×40, X 40×40, "Copiar" 212×40.
   - Não há rolagem lateral.
4. Mais ou menos.
5. Não.
6. Sim.
7. Nenhum.
8. Viraria o celular de volta.
9. A sobreposição parece defeito.
10. Em paisagem, esconder o rodapé ao rolar, manter 44 px nos botões e corrigir a sobreposição.

---

## 3. Tabela de medições

Valores em px CSS, medidos com `getBoundingClientRect` e `getComputedStyle`.

| Tela | Elemento | Medida | Problema |
|---|---|---|---|
| Todas (360) | Topo fixo (`shell-topbar`, sticky) | 360×60 | Ok sozinho; somado ao rodapé reduz a área útil |
| Etapas 1 e 2 antes de escolher (360) | Rodapé guiado (`gd-footer`, sticky) | 328×**158** (20% de 800) | Conteúdo escondido; nenhuma opção visível na 1ª tela da etapa 2 |
| Etapas 5, 6, 8 e 10 (360) | Rodapé em 2 linhas | 328×**125** (medido na etapa 10; o mesmo formato aparece nas capturas `34`, `41` e `46`) | "Copiar Master Prompt" (y=721) fica atrás do rodapé (y=675) no 1º acesso |
| Etapa 10 (390) | Rodapé em 1 linha | 358×69 | Ok: "Copiar" visível |
| Paisagem 800×360 | Topo e rodapé | 60 + 65 = 125 de 360 | Só 235 px úteis (65%) |
| Etapas 1, 2 e 10 | Barra de progresso dupla | ~200 px de altura; segmentos com área de toque 62×44 e barra visual de ~4 px | Ocupa 1/4 da dobra; não parece tocável |
| Home | "Abrir menu", "Buscar", "Master Prompt" | 44×44, 44×44, 51×44 | Ok |
| Home | "Pular para o conteúdo" (só com foco) | 181×**39** | < 44 |
| Etapa 1 | Campos de texto | 328×44, fonte **16 px** | Ok, sem zoom no iOS; placeholder truncado |
| Etapa 1 | Rótulos (label) | 328×21, fonte 13,5 px | Rótulo pequeno (área de toque do label) |
| Etapa 1 | Cartões de tipo | 328×98–117 | Ok |
| Etapa 2 | Miniaturas de fluxo (legendas "Landing/Login/Sistema/site") | fonte 9,5–11 px | Ilegível |
| Etapa 2 | Barra de abas | conteúdo 505 / visível 328; "Login" em x=355; "Cadastro" fora da tela | Abas escondidas sem indicação |
| Etapa 2, Landing | Texto dentro das miniaturas | 3,2–4,8 px efetivos | Só imagem (há "Ver prévia") |
| Etapa 2, Landing | Altura da página | 11.333 px | Rolagem longa (24 modelos) |
| Prévia ampliada (360) | Celular visível no modal | ~250 de 800 px (31%) | Prévia pequena |
| Prévia ampliada (390) | Celular visível | 277 de 844 px (33%) | Prévia pequena |
| Prévia ampliada (800×360) | Celular visível | ~38 px; botões 222×40 e 40×40 | Quase invisível; botões < 44 |
| Prévia ampliada, modo Computador | Fonte efetiva | 3,2–4,8 px | Ilegível |
| Prévia da landing (dentro do mock) | "Abrir menu" | 31×31 | < 44 |
| Etapa 3 | Altura da página | 18.384 px | 42 modelos |
| Etapa 3 | Rolagem ao "Escolher este modelo" | pulo de **−378 px** | Perde a posição |
| Etapa 4 | Cartões do carrossel | 134×341; carrossel com 6.532 px de largura | Ok; sem indicador de posição |
| Etapa 4 | Celular grande: "Notificações" / "Criar novo" | **37×37** / 51×51 | 37 < 44 |
| Etapa 4 (paisagem) | Título do grupo | texto sobreposto ao selo "Escolhido" | Defeito visual |
| Etapa 5 | Link "Resolver" | **59×17** | < 44 |
| Etapa 5 | Link "Alterar" (nome) / "Alterar" (cartões, ×5) | **46×17** / 294×**21** | < 44 |
| Etapa 5 | Rótulos das miniaturas (SIDEBAR/HEADER) | fonte 7,5 px | Ilegível |
| Gaveta (menu ☰) | Largura / itens | 310 px (86%) / 285×44, fonte 14,5 px; números 11,5 px; títulos de grupo 12 px | Ok; fontes de 11,5–12 px pequenas |
| Etapa 7 | Altura da página / link "um link" | 19.837 px / **42×15** | Rolagem longa; alvo pequeno |
| Etapa 8 | Termos "Header" / "Sidebar" | **52×24** / **55×24** | < 44 |
| Etapa 8 (prévias) | "Dispensar anúncio" / campo "Buscar" | 44×**32** / 217×**23** | < 44 |
| Etapa 8 | Altura da página | 28.511 px | Rolagem muito longa |
| Etapa 10 | Caixa do prompt (`pre`) | 328×720, fonte 13 px, 25.029 caracteres, rolagem interna | Rolagem dentro de rolagem |
| Etapa 10 | "Copiar Master Prompt" / "Baixar .md" | 212×44 / 133×44 | Ok em tamanho; escondidos atrás do rodapé em 360 |
| 360, 390 e 800 | Rolagem lateral (scrollWidth × viewport) | 360=360, 390=390, 800=800 | Nenhuma ✓ |

---

## 4. Problemas encontrados

| # | Título | Onde | Largura/aparelho | Evidência | Gravidade | Sugestão concreta |
|---|---|---|---|---|---|---|
| 1 | Depois de escolher a entrada, o próximo passo fica fora da tela e "Continuar" desabilitado não explica nada | Etapa 2 | 360 (vale para todos) | `09`, `10`, `11`: abas em 443 px com a página rolada até 550 px; o toque no botão desabilitado não muda nada | **Alta** (provável abandono) | Rolar até as abas ou abrir a aba Landing sozinho; trocar o botão desabilitado por um ativo que leve à próxima escolha |
| 2 | Abas "Login" e "Cadastro" escondidas na barra rolável | Etapa 2 | 360 | `12`, `19`, `20`: tablist com 505/328 px; "Cadastro" invisível | **Alta** | Passos numerados que caibam em 360 px, ou sombra/seta de rolagem e rótulos curtos |
| 3 | "Resolver" na revisão tira a pessoa do guiado | Etapa 5 → `#/modulos/cadastro` | 360 | `35`, `36`, `37`, `38`: sem rodapé nem volta; só pelo menu | **Alta** | Abrir a aba Cadastro da etapa 2 dentro do guiado, com "Voltar para a revisão"; oferecer "Sem cadastro" |
| 4 | Projeto preso a um navegador | Todo o app | iPhone 390 (perfil limpo) | `53`: "Projeto sem nome" e 5 pendências | **Alta** para a persona (dois aparelhos) | Aviso "salvo só neste celular" e "Continuar em outro aparelho" (link/código/arquivo) já na etapa 1; sugerir "Exportar" no fim |
| 5 | Master Prompt da barbearia herda os textos de carro do modelo de exemplo | Etapa 10 / arquivo `.md` | Todas | `downloads/barbearia-da-joana-master-prompt.md`, linhas 19–63: "VOLTA", "Modelos, Tecnologia, Recarga, Lojas", "Agendar test drive" (7 menções) | **Média-alta** (o resultado entregue à IA sai errado) | Trocar textos e marca do exemplo pelos dados do projeto, ou incluir "use só a estrutura, não o conteúdo"; mostrar o aviso antes de selecionar |
| 6 | Rodapé fixo alto e progresso grande comem a tela | Etapas 1, 2, 5, 6, 8, 10 e paisagem | 360 e 800×360 | Rodapé 158 px (20%) e 125 px; paisagem com 235/360 px úteis; `07-topo`, `12`, `48-topo` sem conteúdo útil | **Média** | Rodapé de 1 linha com rótulo curto ("Continuar →"), dica como texto acima do botão só quando necessária, esconder ao rolar; progresso compacto ("Etapa 2 de 10") que expande ao tocar |
| 7 | Botões de copiar/baixar escondidos atrás do rodapé e ação errada em destaque | Etapa 10 | 360 | `48-passo10-master-topo`: Copiar em 721 px e rodapé a partir de 675 px; botão principal "Abrir Central de Prompts" | **Média** | Pôr "Copiar" e "Compartilhar" (`navigator.share`) no rodapé da última etapa |
| 8 | Indicador de progresso inconsistente | Barra de progresso, menu, paisagem | Todas | `37` (item 3 sem ✓), `48-topo`, `58` ("3. Desktop" e "6. Prévia" cinzas depois de feitos) | **Média** (gera desconfiança: "faltou algo?") | Marcar a etapa 3 como concluída ao escolher e a etapa 6 ao visitar/continuar |
| 9 | Prévia ampliada pequena e modal que não fecha depois de selecionar | Etapa 2 (Landing) | 360: 31%; 390: 33%; paisagem: ~38 px | `14`, `17`, `55`, `61` | **Média** | Botão "Tela cheia"; recolher alternâncias e interruptor em "Ajustes"; fechar e mostrar ✓ ao selecionar; em paisagem esconder o cabeçalho do modal |
| 10 | Listas gigantes e filtros inconsistentes | Etapas 2, 3, 7 e 8 | 360 | Alturas de 11.333, 18.384, 19.837 e 28.511 px; filtro em `select` (landing), pílulas empilhadas (login, paletas) e pílulas roláveis (desktop) | **Média** | Reusar o carrossel horizontal da etapa 4; 3 sugestões no topo conforme o tipo de projeto; botão "voltar ao topo"; um padrão único de filtro |
| 11 | Rolagem pula ao escolher | Etapa 3 | 360 | `25`→`26`: 1380→1002 (−378 px) | **Média** | Manter a âncora no cartão escolhido (compensar a mudança de altura) |
| 12 | Aprovação do esqueleto não persistiu uma vez | Etapa 5→6 | 360 | `40`, `41`: ao reabrir `#/guiado/preview` voltou a pedir aprovação; na 2ª vez persistiu | **Média** (intermitente, não reproduzido) | Gravar a aprovação de forma síncrona; se a rota exigir aprovação, explicar o motivo |
| 13 | Prévia integrada abre em "Computador" no celular | Etapa 6 | 360 | `39`, `42`: texto de ~3–5 px | **Média** | Padrão "Celular" em telas < 600 px |
| 14 | Jargão e textos de mouse | Várias etapas | Todas | "SaaS", "Landing", "Sidebar", "Rail", "Drawer", "Bottom Navigation", "Dock", "px", "tokens", "CSS", "JSON"; "Clique", "à esquerda" (etapa 9, `47`) | **Média** para a persona | Nomes em português com o termo técnico entre parênteses; "toque" e "acima" no celular |
| 15 | Texto sobreposto em paisagem | Etapa 4 | 800×360 | `60`: título do grupo embaixo de "✓ Escolhido para o seu projeto" | **Média** | Selo em linha própria ou com `flex-wrap` |
| 16 | Alvos de toque < 44 px | Revisão, etapas 7 e 8, prévias, paisagem | 360 e 800×360 | "Resolver" 59×17, "Alterar" 46×17 e 294×21, "Header" 52×24, "Sidebar" 55×24, "um link" 42×15, 37×37, 31×31, 44×32, 217×23; botões de 40 px em paisagem | **Média/Baixa** | Padding vertical para 44 px; manter 44 px também no breakpoint ≥ 800 px quando `pointer: coarse` |
| 17 | Fontes muito pequenas | Etapa 2, revisão, menu | 360 | 9,5–11 px (legendas dos fluxos), 7,5 px (rótulos da revisão), 11,5–12 px (menu) | **Baixa** | Mínimo de 12–13 px em texto informativo; em miniaturas, usar ícones em vez de texto |
| 18 | Toasts cobrem os botões do rodapé e a gaveta | Etapas 2, 6, 10 e menu | 360 | `17`, `22`, `37`, `42`, `50` | **Baixa** | Toast acima do rodapé (bottom = altura do rodapé) e abaixo da gaveta; menos tempo na tela |
| 19 | O texto diz "ver", mas o toque escolhe | Etapa 4 | Todas | `30`: "Toque em um modelo para ver no celular grande" e o cartão vira "Escolhido" | **Baixa** | "Toque para escolher e ver no celular grande" |
| 20 | Revisão com título "Esqueleto aprovado" antes de aprovar, e botão "Aprovar" habilitado com pendências | Etapa 5 | 360 e 390 | `34-inteira`; `53` (5 pendências, botão habilitado) | **Baixa** | Título "Seu esqueleto"; desabilitar ou explicar o botão quando houver pendências |
| 21 | Busca abre com foco automático | Topo (lupa) | 360 | `32` | **Baixa** (o teclado cobre metade da lista) | No toque, não focar automaticamente; ou mostrar a lista acima do teclado |
| 22 | Nenhum passo para as telas do domínio | Fluxo guiado percorrido | Todas | As prévias mostram "Saldo do mês", "Pedidos", "R$"; não há escolha visual de agenda, serviços, clientes ou perfil (só o campo opcional "Módulos e funcionalidades" na etapa 1) | **Média** para o objetivo da persona | Sugerir módulos a partir do tipo e objetivo (ex.: "agendamento" → Agenda, Serviços, Clientes, Perfil) e mostrar prévias com esses nomes |

---

## 5. O que funcionou bem

- **Sem rolagem lateral** em 360, 390 e 800 px (scrollWidth sempre igual à largura). Nenhum elemento vaza da tela.
- **Campos com fonte de 16 px**, sem zoom automático no iOS. Com o teclado simulado, o campo em foco ficou visível acima do rodapé.
- **Botões principais com 44–48 px** no retrato (Continuar, Voltar, Ver prévia, Copiar, Baixar, ☰, lupa, X).
- **Gaveta do menu bem resolvida:** fundo escurecido, trava a rolagem do fundo, itens de 44 px e fecha ao navegar.
- **Modais em bottom sheet** com X de 44×44, fundo travado e rolagem interna da prévia funcionando com o dedo. A prévia de landing abre em "Celular" por padrão no retrato.
- **Etapa 4 (arquitetura do celular)** é exemplar: carrossel horizontal que rola com o dedo e celular grande interativo, que responde ao toque.
- **Seleção sem pulo de rolagem** na maioria das telas (landing, login, cadastro, celular, paleta: 0 px de deslocamento) e lista preservada ao fechar a prévia.
- **Personalização:** o nome "Barbearia da Joana" aparece nas prévias de login e cadastro e no título do Master Prompt e do arquivo.
- **Salvamento automático:** nome, tipo e escolhas sobreviveram ao fechar e reabrir o navegador (com a exceção do problema 12).
- **Exportação pelo celular funciona:** "Copiar" põe os 25.029 caracteres na área de transferência, mostra "✓ Copiado" e um toast; "Baixar .md" gera `barbearia-da-joana-master-prompt.md` (25.950 bytes, 400 linhas, seções A–G). No iPhone (390) o "Copiar" fica visível sem rolar.
- **Retorno visual claro:** selos "Selecionado/Escolhido" e toasts que confirmam "incluído no Master Prompt".
