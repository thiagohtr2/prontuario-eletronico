# Relatório — P3 "Nexo Capital" no Design System Studio

- **Site:** http://127.0.0.1:4300/ (Atelier UI · Design System Studio, versão congelada)
- **Data:** 02/11/2026
- **Ambiente:** Chromium (Playwright 1.63) com perfil persistente novo em `perfil/` (localStorage vazio no início, conferido), viewport 1440×900.
- **Método:** usei só a interface. Não li código-fonte, documentação nem relatórios de outros agentes.
- **Scripts de automação:** em `scripts/` (apenas infraestrutura).

## 1. Passo a passo resumido

1. **Início.** O Studio abriu como "Projeto sem nome", com a chave `atelier-ui:studio:v1` criada no localStorage após a primeira edição. Escolhi o **modo Guiado** (10 etapas: 5 de esqueleto e 5 de acabamento).
2. **Etapa 1 · Objetivo.**
   - Tipo **Dashboard**. O Studio sugeriu o fluxo "Apenas login"; não cliquei em "Usar esta sugestão", mas escolhi o mesmo fluxo à mão na etapa 2.
   - Nome **Nexo Capital**, objetivo e descrição tirados da lista do cliente.
   - Funcionalidades: Login profissional, Dashboard financeiro, Tabelas de dados e o chip "Gráficos".
   - Tecnologia: chip **"HTML + CSS + JavaScript"**.
   - Captura 01.
3. **Etapa 2 · Entrada.**
   - Fluxo **"Apenas login"**.
   - Login **"Acesso corporativo"**, escolhido entre 24 composições. Fiz as prévias no computador e no celular, com estados de erro.
   - Cadastro: nenhum (não foi pedido).
   - Capturas 02a–02c, 16, 16b, 17, 17b.
4. **Etapa 3 · Desktop.** **"Sidebar integral clássica"**: sidebar e header, com KPIs, gráficos e tabela no desenho. Capturas 03, 13, 14 (detalhes técnicos: comportamento, telas menores, grid 252px/1fr).
5. **Etapa 4 · Mobile.** **"Drawer pela esquerda"**. Usei a prévia grande interativa com o menu fechado e aberto. Capturas 04–06.
6. **Etapa 5 · Revisão.**
   - O Studio apontou "Ainda faltam decisões: Escolha um fluxo de cadastro (ou confirme que não haverá cadastro)".
   - Não há como confirmar "sem cadastro" (ver B1).
   - **Aprovei o esqueleto.** O Studio permitiu a aprovação com a pendência aberta.
   - Capturas 07, 08, 22.
7. **Etapa 6 · Prévia integrada.** Capturei Aplicação, Login e Cadastro × Computador, Tablet e Celular, e o drawer aberto no celular. Capturas 15-*.
8. **Etapa 7 · Identidade.**
   - Paleta **"Azul Institucional"** (categoria Corporativas).
   - Tipografia e formas mantidas no padrão: Inter + Inter, base 15 px; cantos de 8 px, superfície contornada, sem sombra, densidade confortável.
   - Contraste WCAG: todos os pares em AA.
   - Captura 09.
9. **Etapa 8 · Headers e sidebars.**
   - Header **"Painel Analítico" · A**.
   - Sidebar **"Sóbria Corporativa" · A**.
   - Na aba "Combinação", o Studio deu os avisos "Navegação nos dois lugares" e "Logo uma vez só".
   - Capturas 10, 11, 12, 24.
10. **Etapa 9 · Componentes** (família **Compact Pro** em todos):
    - **Tabelas** (nome "Tabelas de dados");
    - **Gráficos**;
    - **Dashboard** (nome "Dashboard financeiro").
    - Não adicionei os componentes de Login, Headers e Sidebars, para não duplicar as escolhas estruturais das etapas 2 e 8.
    - Capturas 30, 32-1, 32-2, 32-3.
11. **Avaliação de "Inspiração".**
    - Template Studio: "Dashboard administrativo" avaliado e não usado.
    - Inspiration Gallery: aprovei **"ATLAS CAPITAL" (Finanças — Corporativo orientado a dados)**. O Studio abriu a contradição "Duas fontes de cor" e eu a resolvi com **"Paleta global prevalece"** (capturas 25, 25b, 25c, 26a, 26b).
    - Ao ler o Master Prompt gerado, vi que a inspiração injetava a composição de uma landing pública (faixa de cotações, hero, soluções, research, formulário de contato, footer) e títulos em Georgia. Isso conflita com "Apenas login" e com "Inter + Inter", e o Studio não sinalizou nenhum dos dois conflitos.
    - Para preservar a fidelidade, **removi a aprovação** (captura 27). O Master Prompt dessa versão intermediária ficou guardado em `exportados/nao-incluido-no-projeto/`.
12. **Contador do esqueleto.** O topo mostrava "Esqueleto 1/5" com tudo escolhido. Ao percorrer os botões "Continuar" das etapas 1 a 4, ele passou a 5/5 (capturas 08, 23).
13. **Etapa 10 · Master Prompt.** Estado final: 12 itens, 0 retirados, 0 contradições, 1 pendência (cadastro). Fiz todos os downloads. Capturas 18, 19, 19b, 21, 28, 29.

## 2. Contradições e avisos apontados pelo Studio, e como foram tratados

| Onde | O que o Studio apontou | Tratamento |
|---|---|---|
| Revisão do esqueleto, Central de Prompts, Master Prompt (seção "Pendências") | "Escolha um fluxo de cadastro (ou confirme que não haverá cadastro)." | **Não resolvível pela interface**: não existe opção "sem cadastro", nem no módulo Cadastro, nem na aba Cadastro da etapa 2, nem no modo "Avançado". Registrei a pendência e aprovei o esqueleto assim mesmo. O Master Prompt diz "Cadastro: nenhum" (linha 18) e mantém a pendência (linha 635). |
| Headers e sidebars → Combinação | "Navegação nos dois lugares" (o header "Painel Analítico" tem links próprios e a sidebar também) e "Logo uma vez só". | É uma recomendação, não um bloqueio. Mantive: as abas do header funcionam como sub-relatórios do dashboard e a navegação principal fica na sidebar, como o próprio aviso recomenda. O aviso não aparece no Master Prompt. |
| Central de Prompts → Contradições (ao aprovar ATLAS CAPITAL) | "Duas fontes de cor: paleta global e inspiração aprovada". | Resolvida com **"Paleta global prevalece"**. Depois a inspiração foi removida, e a contradição sumiu (0). Resíduo: `source.prompt.conflictResolutions = {"cores-inspiracao":"global"}` continua no JSON. |

## 3. Bugs, dificuldades e limitações (com captura e gravidade)

| ID | Gravidade | Descrição | Evidência |
|---|---|---|---|
| B1 | **Média** | A pendência de cadastro não pode ser resolvida. O Studio pede "confirme que não haverá cadastro", mas não oferece esse controle. O link "Resolver" leva ao módulo Cadastro, que só tem 8 fluxos de cadastro. Resultado: o Master Prompt sai com "Cadastro: nenhum" e, ao mesmo tempo, com a pendência "Escolha um fluxo de cadastro", que manda a IA "perguntar ou usar a opção mais neutra". | 07, 31, 19; `nexo-capital-master-prompt.md` linhas 18 e 635 |
| B2 | **Média** | O detector de contradições é incompleto: diz "0 contradições", mas o texto do Master Prompt tem conflitos entre itens (lista abaixo). | 28; linhas citadas |
| B3 | **Média** (fidelidade) | Os conteúdos de exemplo da navegação entram no Master Prompt como especificação e não podem ser editados. São eles os itens da sidebar (Gestão: Painel, Contratos, Fornecedores, Compras · Pessoas: Colaboradores, Folha · Administração: Auditoria, Permissões; linha 205) e as abas do header (Visão geral, Aquisição, Retenção, Receita; linha 159). Só a marca do header traz o aviso "marca fictícia 'Seriema' — substitua". Numa plataforma financeira, a IA pode construir um menu de compras e RH. | 11, 12; diálogo da sidebar sem nenhum campo editável |
| B4 | Baixa | As prévias usam marcas fictícias em vez do nome do projeto: "Orla" no celular (etapa 4 e Prévia integrada → Celular, incluindo o e-mail marina@orla.app no drawer) e "Seriema" no header da Prévia integrada (computador e tablet). As prévias de login usam "Nexo Capital" corretamente. | 04, 05, 06, 15-previa-integrada-aplicacao-* |
| B5 | Baixa | A Prévia integrada → "Cadastro" mostra uma tela "Crie sua conta" completa, embora o cadastro esteja "Não escolhido" e o fluxo seja "Apenas login". O mesmo acontece na aba "Criar conta" do diálogo do login. | 15-previa-integrada-cadastro-*, 17b |
| B6 | Baixa | O contador "Esqueleto x/5" e os checks do stepper só avançam com os botões "Continuar". Escolhas feitas pela navegação lateral não contam. O contador mostrou 1/5 com as 5 decisões tomadas e o esqueleto aprovado. | 08, 23 |
| B7 | Baixa | A Revisão mostra o título "Esqueleto aprovado" antes de qualquer aprovação. | 07 |
| B8 | Baixa | Em 1440×900, o rodapé fixo de ações cobre conteúdo. (a) A prévia grande do celular tem a base do aparelho cortada pelo botão "Continuar". (b) Os botões "Prompt da identidade" e "CSS dos tokens", embaixo do painel fixo da prévia de identidade, ficam sob o rodapé; o clique do Playwright foi interceptado pelo botão "guided-next", e só ficam acessíveis rolando até o fim da página. (c) Os toasts ficam sobre os botões: o toast de seleção do login cobriu "Prompt deste elemento" no diálogo (observado, sem captura salva); o toast de aprovação aparece sobre a prévia na captura 08. | 04, 06, 20a, 20b, 08 |
| B9 | Baixa | Os prompts individuais da aba "Itens" baixam **todos com o mesmo nome**, `prompt-elemento.md`, e com o título genérico "Prompt individual — Elemento". Por isso salvei-os com prefixo numerado (`NN-…__prompt-elemento.md`). Pelo módulo de identidade, o mesmo conteúdo sai como `prompt-identidade-visual.md`. | 21; `exportados/prompts-individuais/` |
| B10 | Baixa | Densidade da tabela: o editor mostra "Densidade: Padrão" selecionado, mas o Master Prompt e o JSON exportam "Densidade: compacta", que vem da família Compact Pro. | 33; linha 379 |
| B11 | Baixa (a11y) | A página "Headers e sidebars" tem 37 elementos `<main>`, porque as prévias de sidebar usam `<main>`. São landmarks duplicados para leitores de tela. | Erro "strict mode violation: locator('main') resolved to 37 elements" do Playwright (sem captura visual) |
| B12 | Info | A paleta "Neutro Essencial", a tipografia e as formas vêm pré-selecionadas. Quem pula a etapa 7 leva ao Master Prompt uma identidade que não escolheu, descrita como "visualizada e aprovada pelo usuário". | 09 (antes da troca, "Neutro Essencial" aparecia como pressed) |
| B13 | Info | O "Arranjo da prévia" na aba Combinação começa em "Header por cima", ao contrário do layout escolhido (sidebar integral), e não persiste ao recarregar. | 10 |

Conflitos que o detector deixou passar (B2):

- **Header:** 56 px e largura total da janela (linha 156), contra o header de ≈64 px "somente sobre a coluna principal — não passa por cima da sidebar" do layout (linha 71).
- **Sidebar:** 264 px (linhas 203 e 231) contra 252 px no layout (linha 67).
- **Densidade:** a global é "confortável" (linha 326), mas os 3 componentes declaram "Densidade: compacta" (linhas 379, 469, 542).
- **Menu no celular:** o header tem um painel próprio que "desliza logo abaixo do header" (linha 186), enquanto o layout mobile usa um drawer pela esquerda.
- **Navegação inferior:** a sidebar sugere "ofereça também uma bottom navigation" (linha 237), mas o mobile foi escolhido sem menu inferior.
- **Tablet:** a faixa começa em 600 px (linha 144) ou em 768 px (linha 95), conforme o trecho.
- **Inspiração ATLAS:** quando estava aprovada, só o conflito de cores foi detectado. A tipografia Georgia contra Inter e a composição de landing contra "Apenas login" passaram sem alerta.

Dificuldades operacionais (não são bugs do produto):

- Os switches customizados (`ui-switch`) não aceitam clique direto do Playwright; usei `check({force:true})`.
- Capturas de página inteira (fullPage) repetem os elementos fixos (header e rodapé) no meio da imagem. Isso é um artefato da captura, não um bug.

## 4. Lacunas

- **"Financeiro":** não há configuração de domínio. Fica só nos textos livres (objetivo, descrição, funcionalidades). Os conteúdos de exemplo (menus, abas, títulos "Pedidos recentes" e "Vendas por mês") não são financeiros. Mantive os títulos padrão dos componentes para não inventar requisitos.
- **Navegação:** os itens de menu da sidebar e as abas do header não são configuráveis.
- **Cadastro:** não existe opção explícita "sem cadastro".
- **Restrição "sem etapa de build":** o campo Tecnologia aceita só o texto "HTML + CSS + JavaScript"; o Master Prompt não menciona a ausência de build.
- **Componentes:** não há família visual "corporativa". Usei "Compact Pro" ("ferramentas profissionais").
- Nenhuma das 8 características ficou totalmente sem opção (ver `escolhas.md`).

## 5. Arquivos exportados (`exportados/`)

Exportação principal (página "Exportar e importar", estado final, todos com `failure=null`):

| Arquivo | Origem | Tamanho |
|---|---|---|
| `nexo-capital-master-prompt.md` | Master Prompt (.md) → Baixar | 37 880 B |
| `nexo-capital-especificacao.json` | Especificação JSON → Baixar | 85 643 B |
| `nexo-capital-tokens.css` | CSS de referência → Baixar | 3 853 B |
| `nexo-capital-ficha.html` | Ficha do projeto (HTML) → Baixar | 59 671 B |
| `nexo-capital-backup.json` | Backup completo → Baixar (0 versões salvas) | 3 736 B |

Os botões "Baixar .md" e "Baixar JSON" da Central de Prompts e da etapa 10 geram os mesmos arquivos, com os mesmos nomes. Comparei: só muda o carimbo de hora. Por isso não dupliquei. O "CSS dos tokens" da etapa 7 é idêntico a `nexo-capital-tokens.css`.

Downloads por elemento:

- `prompts-individuais/01…12-*__prompt-elemento.md`: os 12 prompts individuais da aba "Itens". O nome original de todos é `prompt-elemento.md` (B9); o prefixo foi acrescentado para não sobrescrever.
- `especificacoes-navegacao/header-painel-analitico-composicao-a.json` e `especificacoes-navegacao/sidebar-sobria-corporativa-composicao-a.json`: botão "Exportar especificação" dos diálogos de header e sidebar.
- `outros/prompt-identidade-visual.md`: "Prompt da identidade" → Baixar .md.
- `outros/runner.py`: "Validação responsiva" → "Baixar executor (runner.py)". É uma ferramenta genérica, não específica do projeto. Não executei.

Não baixado:

- "Baixar configuração" da Validação responsiva fica **desabilitado** sem a URL de um site já construído. Não se aplica.
- As demonstrações dos outros 27 templates e 19 inspirações não foram baixadas, por não fazerem parte do projeto.

Fora do projeto final (`nao-incluido-no-projeto/`):

- `inspiracao-atlas-capital/atlas-capital-original.css`, `.json`, `.html` e `prompt-atlas-capital.md`: exportações do conceito ATLAS CAPITAL, aprovado e depois removido.
- `nexo-capital-master-prompt__versao-com-inspiracao-atlas-removida.md`: o Master Prompt da versão intermediária com ATLAS, como evidência dos conflitos não sinalizados.

**Master Prompt final:** `/home/user/prontuario-eletronico/design-system-studio/auditoria/fase2-projetos/P3-nexo-capital/exportados/nexo-capital-master-prompt.md`

## 6. Capturas (`capturas/`)

| Grupo | Arquivos |
|---|---|
| Objetivo | 01 |
| Entrada | 02a, 02b, 02c |
| Desktop | 03, 13, 14 |
| Mobile | 04, 05, 06 (menu aberto) |
| Revisão | 07, 08, 22, 23 |
| Identidade | 09, 20a, 20b |
| Header e sidebar | 10, 11, 12, 24 |
| Prévia integrada (Aplicação, Login, Cadastro × computador, tablet, celular; recortes; drawer aberto) | 15-* |
| Login (computador, erros, celular, aba "Criar conta") | 16, 16b, 17, 17b |
| Exportar | 18 |
| Master Prompt final | 19, 19b |
| Prompt individual | 21 |
| Inspiração ATLAS e contradição | 25, 25b, 25c, 26a, 26b, 27 |
| Contradições = 0 | 28 |
| Itens | 29 |
| Componentes | 30, 32-1, 32-2, 32-3 |
| Bugs | 31 (cadastro), 33 (densidade) |
