# Relatório — P5 "Conecta" (plataforma social mobile-first) no Design System Studio

- **Site:** http://127.0.0.1:4300/ (versão congelada), título "Atelier UI · Design System Studio". Usei somente a interface. Não li código-fonte, documentação nem relatórios de outros agentes.
- **Ambiente:** Playwright 1.63 + Chromium, perfil persistente vazio em `perfil/` (localStorage vazio no início, conferido), viewport 1440×900. Algumas capturas usaram 1440×1000/1300 (prévia grande do celular inteira) ou 390×844 com emulação móvel (indicado no nome).
- **Scripts usados:** `scripts/` (um script por passo, em `scripts/sNN.js`). Rascunhos de tela ficaram em `scripts/tmp/`.
- **Resultado:** a seleção completa está em `escolhas.md`. O Master Prompt final está em `exportados/conecta-master-prompt.md`.

## 1. Passo a passo resumido

1. **Início:** escolhi o "Modo Guiado" (padrão). Nada estava salvo ("Projeto sem nome", "Esqueleto 0/5").
2. **Etapa 1 · Objetivo do projeto** (`#/guiado/objetivo`):
   - "Outro tipo" com "Plataforma social mobile-first".
   - Nome "Conecta"; Objetivo e Descrição derivados do briefing.
   - 5 funcionalidades, uma por característica do briefing.
   - Tecnologia: botão "HTML + CSS + JavaScript".
   - Captura: `capturas/01-objetivo-preenchido.png`.
3. **Etapa 2 · Landing, login e cadastro:** "Apenas login", login "Acesso responsivo", cadastro "Cadastro na mesma tela do login".
4. **Etapa 4 · Arquitetura do celular** (fiz antes da 3 porque o mobile é a prioridade):
   - Escolhi "Stories com dock e drawer lateral" (Layouts híbridos). É a única opção que junta as três características de celular: stories no topo, menu flutuante embaixo e drawer aberto pelo botão de menu.
   - Capturas da prévia grande:
     - `04-mobile-escolhido-celular-fechado.png`
     - `04-mobile-escolhido-celular-drawer-aberto.png`
     - `04-mobile-escolhido-celular-menu-inferior-explorar.png`
     - `04-mobile-escolhido-tela.png`
5. **Etapa 3 · Arquitetura do computador:**
   - Comparei 8 candidatos (`scripts/tmp/s11-montagem.png`) e escolhi "Topbar integral fixa" (Sem sidebar). Ela mantém a estrutura header fixo + conteúdo do celular e não cria uma sidebar que não existe no mobile.
   - Capturas: `03-desktop-escolhido-detalhe.png`, `03-desktop-escolhido-tela.png`.
6. **Etapa 5 · Revisão do esqueleto:** naveguei pelos botões "Continuar" (o indicador foi de 0/5 a 4/5) e cliquei em **"Aprovar esqueleto e continuar"**, que liberou o Acabamento e levou o indicador a "Esqueleto 5/5".
   - Capturas: `05-revisao-esqueleto-antes-aprovar.png`, `06-apos-aprovar.png`.
7. **Etapa 7 · Identidade visual:** paleta "Comunidade" (Sociais · clara). Tipografia e formas ficaram no padrão.
   - Captura: `07-identidade-paleta-comunidade.png`.
8. **Etapa 8 · Headers e sidebars:** header "Praça da Comunidade" · Composição A ("Para redes e comunidades"). Nenhuma sidebar.
   - Capturas: `08-header-praca-da-comunidade-card.png`, `08-header-praca-da-comunidade-grande.png`, `08-navegacao-topo-status.png`.
9. **Etapa 9 · Componentes:** adicionei e personalizei 4 componentes da família "16. Modern Material":
   - Cards → "Card de conteúdo do feed"
   - Perfil de usuário → "Perfil do usuário"
   - Drawers → "Drawer lateral aberto pelo header", lado Esquerda
   - Layouts mobile → "Menu inferior flutuante arredondado (dock)", Dock flutuante, sem FAB
   - Capturas: `09-componentes-no-projeto.png` e `09-componente-*-editor*.png`.
10. **Etapa 6 · Prévia integrada:** capturei computador, tablet e celular nas páginas Aplicação e Login, e o celular com o drawer aberto.
    - Capturas: `06-previa-integrada-*.png`.
    - Também capturei o módulo "Live Site Preview": `13-live-site-preview-modulo.png`.
11. **Etapa 10 · Master Prompt:** o Studio mostrou "13 itens no Master Prompt · 0 retirados · **0 contradições a decidir** · 0 decisões pendentes".
    - Li o texto gerado e encontrei contradições que o Studio não apontou (seção 4).
    - Resolvi as que comprometiam o briefing com **3 "observações ou exceções"** na aba "Itens". Elas entram no prompt como "Exceções — Observação do usuário".
    - Capturas: `10-entrega-itens-observacoes.png`, `10-entrega-aba-contradicoes.png`, `10-master-prompt-tela-final.png`, `12-central-de-prompts.png`.
12. **Exportação:** baixei tudo o que é oferecido (seção 6). Abri a ficha HTML exportada direto do arquivo, sem build e sem erros: `15-ficha-html-exportada.png`.
13. **Conferência em 390×844 (emulação móvel):** sem rolagem horizontal. Capturas: `14-studio-390-*.png`.

## 2. Dificuldades encontradas

- **No desktop e no mobile, clicar num card de layout já troca a escolha.** Não há modo de só comparar: comparar 8 layouts desktop trocou a seleção 8 vezes. Tive de clicar de novo no escolhido no fim. Risco de troca acidental.
- **Prévia grande do celular a 1440×900:** a prévia tem 782 px de altura e fica fixa na rolagem. A barra de ações fixa do rodapé ("Voltar / Continuar") cobre a parte de baixo, justamente onde fica o menu inferior. Para capturar o celular inteiro usei 1440×1000 com a página rolada (bug B10).
- **Catálogos muito grandes:** 42 layouts desktop, 44 mobile, 36 headers, 36 sidebars, 60 paletas, 66 categorias × 16 famílias de componentes. Não há filtro por "rede social" nos layouts (só nos headers "Praça da Comunidade" e nas paletas "Sociais").
- **Componentes:** a "família" é só estilo visual. O conteúdo de exemplo de alguns componentes não corresponde ao uso. O Drawer é um painel de filtros (Status, Ativos, Pausados…) e só título e botão são editáveis. O card mantém o ícone "Avião".
- **Sidebar no desktop:** não ficou claro se o estilo de sidebar seria aplicado ao drawer do celular. Optei por não escolher sidebar, porque o layout desktop não tem uma. O JSON confirmou `sidebar: null`.

## 3. Bugs e problemas (com captura e gravidade)

| # | Gravidade | Descrição | Evidência |
|---|---|---|---|
| B1 | Baixa | O indicador "Esqueleto 0/5" no topo **não reflete as escolhas feitas**. Fiquei em 0/5 com objetivo, entrada, desktop e mobile definidos, porque naveguei pelos links. Ao mesmo tempo, a Revisão dizia "Esqueleto completo". O indicador só conta cliques em "Continuar". Os checks verdes das etapas 6–10 da barra lateral também nunca aparecem sem "Continuar". | `capturas/bug-01-02-indicador-0de5-e-titulo-esqueleto-aprovado-antes-de-aprovar.png`, `capturas/05-revisao-indicador-4de5-apos-usar-continuar.png` |
| B2 | Baixa | A Revisão do esqueleto mostra o título **"Esqueleto aprovado"** antes de o usuário aprovar. | mesma captura de B1 |
| B3 | Média | **As prévias da aplicação não usam o nome do projeto.** O celular mostra a marca "Orla" (e "marina@orla.app" no drawer); computador e tablet mostram "Quero-quero" (marca fictícia do header). Já a prévia de Login mostra "Conecta". Antes de escolher o header, a prévia do computador mostrava "Conecta". | `06-previa-integrada-aplicacao-computador.png`, `06-previa-integrada-aplicacao-celular-recorte.png`, `06-previa-integrada-login-computador.png`, `04-mobile-escolhido-celular-drawer-aberto.png` |
| B4 | Média (limitação) | **O conteúdo das prévias é de painel financeiro/SaaS** (Saldo do mês, Pedidos, Receita, Ticket médio, Clientes recentes). O drawer de exemplo lista Pedidos / Clientes / Relatórios / Agenda. A prévia integrada não mostra os componentes escolhidos (cards de conteúdo, perfil), e "Escolhas nesta prévia" não lista componentes. Quem decide pela prévia não vê uma rede social. | `06-previa-integrada-*.png`, `13-live-site-preview-modulo.png` |
| B5 | Baixa | "Escolhas nesta prévia" mostra **"Sidebar: Padrão da identidade"**, embora nenhuma sidebar tenha sido escolhida e o layout seja "Sem sidebar". O JSON exportado tem `sidebar: null`. | `13-live-site-preview-modulo.png`, `06-previa-integrada-aplicacao-computador.png` |
| B6 | Baixa | **Todos os prompts individuais da aba "Itens" têm título "Prompt individual — Elemento" e são baixados com o mesmo nome `prompt-elemento.md`**, o que gera colisão de arquivos. O mesmo prompt de identidade, baixado pelo módulo Cores, sai como `prompt-identidade-visual.md` (conteúdo idêntico). | `capturas/bug-04-prompt-individual-titulo-generico-elemento.png`, `exportados/prompts-individuais/*/prompt-elemento.md` |
| B7 | Baixa (UX) | Em Componentes, clicar na família mostra o selo **"✓ Escolhido"**, mas o componente não entra no projeto ("No projeto 0") até clicar em "Adicionar ao projeto". | `capturas/bug-05-familia-escolhido-mas-no-projeto-0.png` |
| B8 | Baixa | O toast "Header … selecionado e incluído no Master Prompt" **cobre os botões do rodapé** do modal "Ver em tamanho grande" (o botão "…r especificação" fica oculto). | `capturas/08-header-praca-da-comunidade-grande.png` |
| B9 | Média | **O Studio informa "0 contradições", mas o texto gerado tem contradições.** Detalhes e resolução na seção 4. | `capturas/10-entrega-aba-contradicoes.png`, `scripts/master-prompt-ANTES-das-observacoes.md` |
| B10 | Baixa | A 1440×900, a barra de ações fixa cobre a base da prévia grande do celular, onde fica o menu inferior. | `capturas/bug-06-celular-grande-coberto-pela-barra-de-acoes-1440x900.png` |
| B11 | Baixa | Na prévia "Tablet", o header mostra 3 links (Feed, Grupos, Eventos), sem Mensagens. A especificação do header diz que entre 768 e 1023 px "a navegação recolhe para o botão ☰". | `06-previa-integrada-aplicacao-tablet-recorte.png` |

Uma observação não reproduzida: uma vez o modal "Personalizar" pareceu renderizar com grande área vazia depois de alternar um switch. Ao reabrir, renderizou normalmente (`09-componente-menu-inferior-dock-editor-config.png`). Provável artefato de rolagem da automação; não conto como bug.

Não vi erros de página (`pageerror`) nem diálogos inesperados nas saídas dos scripts, que registram esses eventos. Nenhum download falhou.

## 4. Contradições

### 4.1 Apontadas pelo Studio
Nenhuma. A aba "Contradições (0)" diz "Nenhuma contradição encontrada. As escolhas atuais são compatíveis entre si." (`10-entrega-aba-contradicoes.png`).

### 4.2 Encontradas por mim no Master Prompt e não apontadas (B9)
Texto original preservado em `scripts/master-prompt-ANTES-das-observacoes.md`.

| # | Contradição | Como ficou |
|---|---|---|
| C1 | O header "Praça da Comunidade" diz que "Abaixo de 768 px … Vão para o painel do menu: os 4 itens" e que o "Painel do menu desliza logo abaixo do header em largura total". O layout mobile diz "Drawer de ≈280 px … que desliza pela esquerda". Isso ameaça a característica "drawer lateral acessado pelo header". | **Resolvida** com observação no item Header: "No celular (abaixo de 768 px) prevalece o layout mobile … o botão de menu (☰) do header abre o drawer lateral esquerdo — não usar o painel de menu em largura total abaixo do header — e a faixa de stories fica logo abaixo do header." |
| C2 | Os 4 componentes Modern Material repetem "No celular, use navigation bar inferior com pílula ativa e FAB acima dela" e "ações flutuantes (FAB)". Mas o dock foi configurado com "Botão flutuante (FAB): não", e o layout usa dock flutuante, não navigation bar. | **Resolvida** com observação no item Layout mobile: "Sem botão flutuante (FAB): as recomendações genéricas … não se aplicam; o menu inferior é o dock flutuante arredondado deste layout." O texto genérico continua nos componentes. |
| C3 | O componente Drawer recomenda "largura: 360–420 px" e "até 88vw". O layout mobile recomenda "≈280 px (máx. 85% da largura)". | **Resolvida** com observação no componente Drawer: "≈280 px (máx. 85% da largura), conforme o layout mobile", abre pelo botão de menu do header, pela esquerda. |
| C4 | "As regiões … mantêm a mesma hierarquia e os mesmos destinos de navegação nas duas versões". Porém o header desktop tem Feed / Grupos / Eventos / Mensagens e o dock tem Início / Explorar / Salvos / Perfil. | **Só registrada.** Os itens do header não são editáveis. Alinhar os do dock exigiria inventar destinos que o briefing não define. Afeta a "versão desktop coerente". |
| C5 | "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada … (sidebar recolhida em rail …)" contra "A partir de 768 px passa a valer a arquitetura desktop" (layout mobile). Os cortes são diferentes (600 contra 768) e o texto cita uma sidebar inexistente. | Só registrada. |
| C6 | Identidade global: Inter 15 px, cantos 8 px, superfícies contornadas, "Sem sombras em superfícies de conteúdo". Os componentes Modern Material dizem "Fonte do sistema 500", "Tamanho base: 14 px", raio 20/12 px, "sem borda", "elevação tonal". O Studio diz que trocar a família "muda só este componente", mas a regra G diz "Preserve a identidade global". | Só registrada. É efeito da família escolhida; o Studio não alerta. |
| C7 | O layout desktop diz "busca e ações/carrinho à direita" (texto genérico de loja). O header desktop tem 60 px e o layout recomenda ≈64 px. | Só registrada (menor). |

## 5. Lacunas (características sem opção estruturada)

- **Navegação mobile prioritária:** LACUNA. Não há opção de prioridade mobile-first. O Studio trata desktop e mobile como decisões independentes. Ficou só em texto livre (Tipo, Objetivo, Descrição).
- **Versão desktop coerente:** LACUNA parcial. Não há como espelhar ou derivar o desktop do mobile, nem harmonizar os destinos de navegação (C4).
- **Stories no desktop:** LACUNA. Nenhum layout ou header desktop tem faixa de stories; só o layout mobile.
- **Drawer no desktop:** não existe com o layout e o header escolhidos (o header só mostra ☰ abaixo de 1024 px).
- **"Arredondado" do menu inferior:** não é parâmetro explícito. Vem do raio da família e do texto livre.
- **Conteúdo social nas prévias:** limitação (B4). As prévias não permitem validar visualmente cards de conteúdo e perfil no contexto do site.

## 6. Arquivos exportados (`exportados/`, nomes originais)

Exportados pela página "Exportar e importar" (`#/exportar`), todos com sucesso:

| Arquivo | Origem no Studio | Tamanho |
|---|---|---|
| `conecta-master-prompt.md` | "Master Prompt (.md)" → Baixar | 40 424 B |
| `conecta-especificacao.json` | "Especificação JSON" → Baixar | 93 640 B |
| `conecta-tokens.css` | "CSS de referência" → Baixar | 3 885 B |
| `conecta-ficha.html` | "Ficha do projeto (HTML)" → Baixar | 62 913 B |
| `conecta-backup.json` | "Backup completo" → Baixar | 5 314 B |

Outros downloads oferecidos:

| Arquivo | Origem no Studio | Tamanho |
|---|---|---|
| `prompt-identidade-visual.md` | Identidade visual → "Prompt da identidade" → "Baixar .md" | 3 546 B |
| `prompts-individuais/NN-<item>/prompt-elemento.md` (13 arquivos) | Master Prompt → aba "Itens (13)" → "Prompt deste elemento" → "Baixar .md". Todos vêm com o mesmo nome original (B6), por isso guardei cada um numa subpasta numerada com o nome do item. | 3,5–7,8 kB cada |

Downloads conferidos e **não duplicados**, por terem o mesmo nome e o mesmo conteúdo:

- Central de Prompts "Baixar .md" e aba "Especificação JSON" → "Baixar JSON": iguais a `conecta-master-prompt.md` e `conecta-especificacao.json`. Só o carimbo de data/hora muda.
- Identidade visual → "CSS dos tokens": baixa `conecta-tokens.css`, byte a byte idêntico.

Não baixei as demonstrações HTML do "Template Studio" e da "Inspiration Gallery". São modelos genéricos de página (landing, loja etc.), não fazem parte do projeto, e nenhum template foi escolhido, já que o fluxo é "Apenas login".

**Master Prompt exportado (final, com as 3 observações):** `/home/user/prontuario-eletronico/design-system-studio/auditoria/fase2-projetos/P5-conecta/exportados/conecta-master-prompt.md`

## 7. Capturas (`capturas/`)

| Grupo | Arquivos |
|---|---|
| Objetivo | `01-objetivo-preenchido.png` |
| Desktop escolhido | `03-desktop-escolhido-detalhe.png`, `03-desktop-escolhido-tela.png` |
| Celular escolhido (prévia grande) | `04-mobile-escolhido-celular-fechado.png`, `04-mobile-escolhido-celular-drawer-aberto.png`, `04-mobile-escolhido-celular-menu-inferior-explorar.png`, `04-mobile-escolhido-tela.png` |
| Revisão e aprovação | `05-revisao-esqueleto-antes-aprovar.png`, `05-revisao-indicador-4de5-apos-usar-continuar.png`, `06-apos-aprovar.png` |
| Prévia integrada | Aplicação: `06-previa-integrada-aplicacao-{computador,tablet,celular}.png` (+ `-recorte`) e `06-previa-integrada-aplicacao-celular-drawer-aberto.png`. Login: `06-previa-integrada-login-{computador,tablet,celular}.png` |
| Identidade | `07-identidade-paleta-comunidade.png` |
| Header | `08-header-praca-da-comunidade-card.png`, `08-header-praca-da-comunidade-grande.png`, `08-navegacao-topo-status.png` |
| Componentes | `09-componentes-no-projeto.png`, `09-componente-card-conteudo-editor.png`, `09-componente-perfil-editor.png`, `09-componente-drawer-editor.png`, `09-componente-menu-inferior-dock-editor.png`, `09-componente-menu-inferior-dock-editor-config.png` |
| Entrega | `10-master-prompt-guiado.png` (antes das observações), `10-master-prompt-tela-final.png`, `10-entrega-aba-itens.png`, `10-entrega-itens-observacoes.png`, `10-entrega-aba-contradicoes.png`, `10-entrega-aba-json.png` |
| Exportação e módulos | `11-exportar-e-importar.png`, `12-central-de-prompts.png`, `13-live-site-preview-modulo.png` |
| 390×844 e ficha | `14-studio-390-previa-integrada.png`, `14-studio-390-arquitetura-celular.png`, `14-studio-390-previa-celular.png`, `15-ficha-html-exportada.png` |
| Bugs | `bug-01-02-…`, `bug-04-…`, `bug-05-…`, `bug-06-…` |
