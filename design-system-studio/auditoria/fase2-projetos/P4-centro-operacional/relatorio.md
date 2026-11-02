# Relatório — P4 "Centro Operacional" no Design System Studio

- Site: http://127.0.0.1:4300/ (Atelier UI · Design System Studio), usado só pela interface.
- Ambiente: Chromium (Playwright 1.63) com perfil persistente vazio em `perfil/` e viewport 1440×900. Downloads foram capturados com `waitForEvent('download')`. O localStorage estava vazio no início (verificado).
- Data: 02/11/2026.
- Tabela de escolhas: `escolhas.md`.

## 1. Passo a passo resumido

1. **Início**: cliquei em "Começar no modo guiado" (captura 00).
2. **Etapa 1 · Objetivo do projeto**:
   - Tipo: **One Screen** (02).
   - Nome: "Centro Operacional". Objetivo e Descrição em texto livre, com as características do cliente.
   - Funcionalidades: "Dados operacionais" e "Indicadores".
   - Tecnologia: "HTML + CSS + JavaScript".
   - Apliquei a sugestão do Studio, o fluxo "Aplicação diretamente" (03).
3. **Etapa 2 · Entrada**: ficou "Aplicação diretamente", sem landing, login nem cadastro (04).
4. **Etapa 3 · Arquitetura do computador**: filtrei a família "One Screen" (6 modelos) e escolhi **"Painel operacional"**, descrito como "central de operações em uma tela só: blocos de status no centro, alertas à direita e barra de status embaixo" (06–09). Baixei o prompt individual.
5. **Etapa 4 · Arquitetura do celular**: grupo "One Screen móvel", modelo **"One Screen com painel em abas"**. Testei as abas Hoje/Semana e o botão Buscar na prévia do celular (11–14).
6. **Etapa 5 · Revisão do esqueleto**: conferi e cliquei em **"Aprovar esqueleto e continuar"**. Mensagem: "Esqueleto aprovado. Agora vamos ao acabamento." Contador: Esqueleto 5/5 (15, 16).
7. **Etapa 6 · Prévia integrada**: capturei Computador, Tablet e Celular, e também o Studio a 1440×900 e 1920×1080 (16–21).
8. **Etapa 7 · Identidade visual**: mantive os padrões ("Neutro Essencial", Inter, 8 px, contornada). Olhei as 4 abas e baixei "CSS dos tokens" e o "Prompt da identidade" (22–26).
9. **Etapa 8 · Headers e sidebars** (opcional): não selecionei nada (27, 28).
10. **Etapa 9 · Componentes** (opcional): adicionei "KPIs e stat cards" (Compact Pro), com o nome "Indicadores", e "Tabelas" (Compact Pro), com o nome "Dados operacionais" (29–36).
11. **Exploração de outros módulos** para as lacunas:
    - Layout desktop (modo Livre), também em "Profundidade dos controles: Avançado" (depois voltei para Essencial).
    - Live Site Preview, Validação responsiva, Projeto e versões, Template Studio.
    - Busca Ctrl+K (37–40, 46–49).
12. **Etapa 10 · Master Prompt**: 8 itens, 0 retirados, **0 contradições**, 0 pendências. No item "Layout desktop" adicionei a observação "Requisito do cliente: adaptação para monitores grandes." Ela entra no prompt como "Exceções → Observação do usuário" (41–44).
13. **Exportação**:
    - Em "Exportar e importar": Master Prompt (.md), Especificação JSON, CSS de referência, Ficha do projeto (HTML) e Backup completo (45, 50).
    - Na Etapa 10: .md e JSON. São idênticos aos anteriores, exceto pelo carimbo de data.
    - Prompts individuais: os 8 itens, além do desktop, do mobile e da identidade.
    - O executor da validação responsiva.
    - Telas finais: 54–56. A ficha HTML abre corretamente (58).

## 2. Contradições apontadas pelo Studio

- **Nenhuma.** A aba "Contradições (0)" diz "Nenhuma contradição encontrada. As escolhas atuais são compatíveis entre si" (42). Não havia nada a resolver.
- O Studio deixou passar incoerências no próprio Master Prompt (veja os bugs B1 e B2).

## 3. Lacunas

| Característica | Situação |
| --- | --- |
| Adaptação para monitores grandes | **LACUNA.** Não há opção estruturada. Só existe texto genérico e fixo ("1280 × 800 ou maior", breakpoint xl ≥ 1440 px, validação até 1920 px). Contornei com uma observação em texto livre no item Layout desktop. |
| Conteúdo organizado em colunas | **Parcial / indireta.** Não há um controle de colunas. As colunas vêm da estrutura fixa do layout "Painel operacional" (`1fr 304px`). |
| Dados operacionais | **Parcial.** Não existe uma opção semântica para isso. Usei o componente "Tabelas" e o conteúdo de exemplo (vendas/pedidos) foi para o prompt. |
| Restrição "sem etapa de build" | Não é característica do cliente, mas o Studio não tem como registrá-la. O prompt só traz "Tecnologia desejada: HTML + CSS + JavaScript". |

## 4. Bugs e problemas encontrados

| # | Descrição | Gravidade | Evidência |
| --- | --- | --- | --- |
| B1 | **Faixas de tablet incoerentes no Master Prompt.** A seção "Relação entre desktop e celular" diz "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada … (sidebar recolhida em rail …)". O layout mobile diz "A partir de 768 px passa a valer a arquitetura desktop". O layout desktop diz "Abaixo de 768 px vale a arquitetura mobile" e "1024–1279 px: alertas viram aba". Ficam dois limites (600 e 768), e o texto cita uma sidebar que o layout escolhido não tem. O detector de contradições marca 0. | Média | `exportados/centro-operacional-master-prompt.md` (linhas ~58, 98, 106); capturas 42 e 54 |
| B2 | **A densidade da tabela diverge entre a interface e o prompt.** No diálogo "Personalizar: Dados operacionais", o grupo "Densidade" mostra **"Padrão"** selecionado. O Master Prompt e o JSON registram **"Densidade: compacta"**. | Média | Captura 52; master-prompt linha ~322 |
| B3 | **A prévia integrada não representa o layout escolhido.** O desenho do "Painel operacional" tem grade de status + coluna de alertas + barra de status. A prévia mostra conteúdo genérico de SaaS (Receita, Clientes, gráfico, "Clientes recentes"). A coluna "Alertas" mostra a ficha de um cliente ("Marina Costa … Abrir ficha") em vez de alertas. O rodapé é "© 2026 … Privacidade Termos Ajuda" em vez de barra de status com relógio e conexão. O mesmo acontece no Live Site Preview. | Média | Capturas 17, 20, 21, 40 vs 08, 57 |
| B4 | **Texto cortado na prévia do tablet.** Na coluna Alertas, "Pro anua[l]", "mar/202[4]", "há 2 dia[s]" e "marina@empresa.co[m]" aparecem cortados na borda direita. Isso contraria a regra do próprio Studio, "Nenhum texto cortado". | Média | Captura 18 |
| B5 | **Prompt individual com título e nome de arquivo genéricos.** Na Etapa 10 (aba Itens) e na lista "No projeto" dos Componentes, todo diálogo se chama "Prompt individual — Elemento" e baixa `prompt-elemento.md`. Os 8 downloads se sobrescrevem. O conteúdo é o correto. No módulo de layout, o nome é específico (`prompt-painel-operacional.md`). | Baixa/Média | Captura 53; `exportados/itens-entrega/*/prompt-elemento.md` |
| B6 | **Conteúdo de exemplo vira "decisão aprovada".** O Master Prompt afirma "Todas as decisões abaixo foram visualizadas e aprovadas pelo usuário". Mesmo assim, inclui como propriedades valores de exemplo que não editei: "Receita mensal R$ 48,2 mil", "Pedidos recentes: Cliente/Status/Valor/Data". Inclui também comportamentos padrão do layout ("Atualização em tempo real", relógio/conexão) e do KPI ("clique abre o relatório detalhado"). É um risco de fidelidade numa auditoria. | Média (fidelidade) | master-prompt seções B e E |
| B7 | **Título "Esqueleto aprovado" antes da aprovação.** Na Revisão, o bloco já se chama "Esqueleto aprovado" com o contador em 4/5, antes de clicar em "Aprovar". | Baixa | Captura 15 |
| B8 | **Botão "Buscar" sem efeito na prévia do celular** ("One Screen com painel em abas"). As abas funcionam, mas a busca não abre nada. | Baixa | Captura 14 |
| B9 | **Acessibilidade da prévia móvel.** As abas da prévia são botões com `aria-pressed` dentro de `tablist`. O prompt gerado exige `role="tablist"` com `aria-selected`. | Baixa | Snapshot de acessibilidade (passo 5) |
| B10 | **A busca de funcionalidades (Ctrl+K) não acha modelos.** "TV" não encontra nada, embora exista o layout "Kiosk ou TV". "monitor" e "telas grandes" também não retornam nada. | Baixa | Captura 48 |
| B11 | **Selo "One Screen One Screen" duplicado** no painel de detalhes do layout. Além disso, o botão "Prompt deste elemento" do painel fica sob a barra fixa inferior a 900 px de altura (exige rolar). | Cosmética | Capturas 07, 08 |
| B12 | **Etapas opcionais marcadas como concluídas sem seleção.** A Etapa 8 aparece com ✓ (e `guided.completed` contém "navegacao") sem header ou sidebar escolhidos. O prompt deixa isso claro ("Nenhum modelo … foi escolhido"), então é apenas ambíguo. | Baixa | Capturas 30, 54 |

### Limitações e observações de infraestrutura

- **Sem prévia em tamanho real ou tela cheia.** A "visualização do site inteiro" existe apenas como miniatura escalada dentro do Studio (Prévia integrada e Live Site Preview).
  - Não há modo tela cheia, nova aba nem "Ver em tamanho grande" para os layouts. Esse recurso só existe para headers.
  - Por isso, as capturas "1440×900" e "1920×1080" mostram o Studio nessas resoluções, com a miniatura dentro (20, 21).
  - A maior visualização do desenho desktop está na captura 57.
- **Download intermitente.** Em 2 de ~10 tentativas, o clique em "CSS dos tokens" não gerou download quando outro download tinha acabado de ocorrer. A repetição funcionou sempre, e numa bateria de 4 cliques após navegação todos funcionaram. A causa provável é o navegador limitando downloads seguidos. Não atribuo com certeza ao Studio. Nenhum arquivo ficou sem baixar.
- **Validação responsiva** é uma ferramenta para testar um site já construído, não uma configuração do projeto.
  - "Baixar configuração" fica desabilitado sem uma URL. Não baixei porque o site ainda não existe.
  - Baixei apenas o executor `runner.py`, e não o executei.
- As capturas `fullPage` mostram a barra superior e o rodapé fixos repetidos no meio da imagem (ex.: 03). É um artefato da captura, não um bug do Studio.
- **Demonstrações HTML** de templates e inspirações não são do projeto e não foram baixadas.

## 5. Arquivos exportados (`exportados/`)

| Arquivo (nome original) | Origem no Studio |
| --- | --- |
| `centro-operacional-master-prompt.md` | Exportar e importar → Master Prompt (.md) → Baixar. **É o Master Prompt final**, idêntico ao "Baixar .md" da Etapa 10, exceto pelo carimbo de data. |
| `centro-operacional-especificacao.json` | Exportar e importar → Especificação JSON. Idêntico ao "Baixar JSON" da Etapa 10, exceto pelos carimbos de data. |
| `centro-operacional-tokens.css` | Exportar e importar → CSS de referência. Byte a byte igual ao "CSS dos tokens" da Identidade visual, que tem o mesmo nome. |
| `centro-operacional-ficha.html` | Exportar e importar → Ficha do projeto (HTML). |
| `centro-operacional-backup.json` | Exportar e importar → Backup completo (0 versões salvas). |
| `prompt-painel-operacional.md` | Etapa 3 → Prompt deste elemento → Baixar .md. Versão final, com a observação de monitores grandes. |
| `prompt-one-screen-com-painel-em-abas.md` | Etapa 4 → Prompt deste elemento → Baixar .md. |
| `prompt-identidade-visual.md` | Etapa 7 → Prompt da identidade → Baixar .md. |
| `itens-entrega/01…08-*/prompt-elemento.md` | Etapa 10 → Itens → Prompt deste elemento → Baixar .md, um arquivo por item. Todos têm o mesmo nome original (bug B5), por isso ficaram em subpastas. O mesmo arquivo baixado da lista de Componentes também se chama `prompt-elemento.md` (duplicado de 07/08, descartado). |
| `ferramenta-validacao/runner.py` | Validação responsiva → Baixar executor (runner.py). É uma ferramenta, não especificação. |

Nenhum download falhou de forma definitiva.

## 6. Capturas (`capturas/`)

| Tema | Capturas |
| --- | --- |
| Fluxo guiado | 00–16 |
| Prévia integrada: computador, tablet e celular | 17, 18, 19 |
| Studio com a prévia a 1440×900 e 1920×1080 | 20, 21 |
| Layout desktop escolhido (grande) | 08, 57 |
| Celular escolhido (grande) | 12 (aba Hoje), 13 (aba Semana), 14 (botão Buscar) |
| Paleta e identidade | 22–26 |
| Componentes | 29–36 |
| Master Prompt (tela final) | 54, 55, 56 |
| Evidências de bugs e lacunas | 15, 18, 38, 44, 47, 48, 52, 53 |
