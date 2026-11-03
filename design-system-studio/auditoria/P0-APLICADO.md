# P0 aplicado (2026-11-03)

Itens B-01 a B-04 do backlog de `RELATORIO-FINAL.md`. P1–P3 ficam para a próxima etapa.

| Item | O que mudou | Onde |
| --- | --- | --- |
| B-01 Modelo de fatos único | Novo resolvedor com precedência fixa: o layout desktop define altura do header, largura da sidebar e se o header atravessa a sidebar; header/sidebar só a aparência interna; o layout mobile define toda a navegação no celular (as instruções de ☰/drawer dos modelos saem); tablet = desktop compactado; componentes herdam raio, fontes e tamanho base da identidade global; propriedade escolhida no editor prevalece sobre a da família visual. Breakpoints únicos: até 767 / 768–1023 / 1024–1439 / ≥ 1440. As decisões aparecem em “Decisões de prioridade” no Master Prompt e na aba Contradições da Central de Prompts. | `src/prompt/resolve.ts`, `src/prompt/items.ts`, `src/prompt/responsive.ts`, `src/prompt/text.ts`, `src/modules/components/describe.ts`, catálogos com 600 px |
| B-02 Conteúdo do projeto | Campo “Itens do menu principal” no objetivo do projeto (`meta.navItems`). Header, sidebar, prévia integrada e prompt usam esses itens e o nome do projeto; marcas fictícias, breadcrumbs e menus de exemplo saem do prompt; nova seção “Conteúdo do projeto”; pendência quando o menu não foi definido. | `src/core/project.ts`, `src/core/schema.ts`, `src/modules/project/ProjectGoalForm.tsx`, `src/modules/preview/*`, `src/modules/navigation/*Preview.tsx` |
| B-03 Tokens derivados | Alterar primária, secundária, destaque, fundo, superfície, texto ou navegação recalcula hover, active, foco, link, seleção etc.; a descrição da paleta no prompt cita as cores efetivas. | `src/core/theme.ts`, `src/prompt/items.ts` |
| B-04 Padrões não revisados | Paleta, tipografia e geometria nunca alteradas saem como “padrão do Studio — não revisado”; o cabeçalho do prompt não diz mais que tudo foi aprovado; textos de componentes não editados saem como “texto de exemplo”; pendência para revisar a identidade após aprovar o esqueleto. | `src/prompt/items.ts`, `src/prompt/text.ts`, `src/prompt/conflicts.ts` |

## Verificação

- `tests/unit/p0-facts.test.ts`: roda sobre os 5 backups da auditoria (P1–P5) e confere altura única do header, largura única da sidebar, ausência de 600 px, ausência de marcas fictícias, ausência de ☰/drawer em header/sidebar quando há layout mobile, raio dos componentes = identidade, tokens derivados e marcação de padrões.
- Vitest: 289 testes passando. Playwright: 77 testes passando (26 do produto + 51 de regressão).
- Regressões que deixaram de falhar (marcador `test.fail` removido): REG-03 (densidade), REG-11, REG-12 (primária manual) e REG-18 (ponto de troca único no prompt).

# Versão 4.20 concluída (2026-11-03) — B-09, B-14, B-23

| Item | O que mudou | Onde |
| --- | --- | --- |
| B-09 Composição B com medidas próprias | Cada header e sidebar tem uma especificação por composição (`specs[0]`, `specs[1]`): altura, logo, busca, navegação, submenus, rodapé e disposição da composição escolhida. O prompt não descreve mais “Composição A … Composição B …” juntas. | `src/modules/navigation/catalog.ts`, `types.ts`, `NavigationShowcase.tsx`, `src/prompt/items.ts`, `resolve.ts` |
| B-23 Observação da paleta e backup com versões | A observação escrita no item “Paleta e tokens” aparece na seção D. Importar um backup completo restaura as versões (validadas uma a uma; inválidas são ignoradas e contadas) junto com o projeto; restaurar versão também passa pela validação. | `src/prompt/text.ts`, `src/core/schema.ts`, `src/core/store.ts`, `src/modules/prompts/ExportPage.tsx` |
| B-14 Prompt enxuto | Linhas idênticas a de um item anterior não se repetem (o item aponta para onde estão); regras responsivas por tipo aparecem uma vez na seção F e só para os tipos presentes; tabela de tokens compacta; componentes sem cores iguais aos tokens globais nem medidas duplicadas; template sem repetir as seções selecionadas; referências sem as cores quando o usuário decidiu “paleta global prevalece” e sem ☰/drawer quando há layout mobile. Prompts individuais continuam autossuficientes. | `src/prompt/text.ts`, `spec.ts`, `items.ts`, `resolve.ts`, `src/modules/components/describe.ts`, `src/modules/templates/describe.ts` |

**Correção encontrada no caminho:** o resolvedor do P0 alterava arrays/objetos compartilhados com os catálogos
(as notas se acumulavam a cada nova geração do prompt). `toItem` agora copia tudo; há teste que gera o prompt
duas vezes e compara.

**Tamanho do Master Prompt (caracteres):**

| Projeto | Antes da B-14 | Depois | Redução |
| --- | --- | --- | --- |
| P1 Atlas Workspace | 50 814 | 36 082 | −29% |
| P2 Verde Vivo | 47 093 | 37 151 | −21% |
| P3 Nexo Capital | 38 768 | 30 344 | −22% |
| P4 Centro Operacional | 25 586 | 19 318 | −25% |
| P5 Conecta | 42 066 | 30 676 | −27% |

Linhas de conteúdo repetidas (≥ 25 caracteres): de 41–48 por prompt para 0.

**Verificação:** Vitest 467 testes (novo `tests/unit/v420.test.ts`: 144 composições de header/sidebar, observação
da paleta, backup com versões, orçamento de tamanho, ausência de repetição, preservação de tokens e regras);
Playwright 77 testes passando.

# Versão 4.21 concluída (2026-11-03) — guiado sem gargalos, acessível e robusto

| Item | O que mudou |
| --- | --- |
| B-13 Fluxo de entrada coerente | Landing/login/cadastro fora do fluxo escolhido ficam guardados, mas inativos (`activeEntry`): não aparecem na prévia nem no prompt; não existe mais “contradição” por isso. Nova decisão explícita “Não haverá cadastro” (`entry.noSignup`), que tira a pendência e avisa a IA para não pôr “Criar conta”. A aba “Cadastro” da prévia só aparece com cadastro escolhido. |
| B-06 Etapa 2 sem gargalo | Atalho “É um sistema interno?” (apenas login, sem cadastro); “Não preciso de landing” na aba Landing; “Parte x de y” + botão “Próxima parte”; aba atual rolada para a área visível no celular. “Continuar” com pendência continua clicável: explica o que falta e abre a parte certa (aria-disabled + dica associada). |
| B-07 Recomendados | Bloco “Recomendados para <tipo>” no objetivo com “Usar recomendados e continuar”: aplica fluxo, arquiteturas e modelos de entrada sem apagar escolhas existentes e vai à revisão. |
| B-08 Entrega | “O que fazer agora”: copiar → abrir a IA num projeto vazio → colar → validar; antes disso, quantas pendências e contradições faltam (com atalho). |
| B-16 Prompts individuais | Arquivo e título com o nome do elemento (ex.: `prompt-componente-tabela-de-pedidos.md`). |
| B-17 Contador do esqueleto | `skeletonDone()` calcula as etapas pelas escolhas reais; topo, início e stepper usam a mesma regra; a revisão só diz “Esqueleto aprovado” depois de aprovar. |
| B-20 Textos | Módulos com nomes em português (Prévia integrada, Cores e identidade, Header e sidebar, Galeria de inspiração, Modelos de página, Validação responsiva, Arquitetura do computador/celular); explicações de termos ficam abertas ao clicar ou tocar (fecham com Esc ou saindo do termo). |
| B-12 Controles visíveis | Prévia da identidade acompanha o tamanho base do texto e o estilo dos ícones; densidade escolhida no editor prevalece no prompt (v4.20). |
| B-11 Acessibilidade | Galeria do celular com coluna de miniaturas sempre útil (RA-01, REG-04/17); “Pular para o conteúdo” sem trocar de rota (RA-02); menu fechado `inert` e `visibility: hidden` (RA-03); painéis fixos e celular grande descontam o rodapé do guiado, `scroll-padding` no topo e na base (RA-05, REG-14/16); texto secundário #6b6b76 (RA-06); anel de foco 2 px branco + 4 px de destaque e contorno em alto contraste (RA-07); prévia integrada abre no modo Celular em telas de celular (REG-18). |
| B-10 Robustez | Error boundary por tela e `errorElement` na rota raiz, em português, com “Tentar de novo”; gravação segura (falha avisada em faixa fixa; com cota cheia, poda versões antigas e continua salvando o projeto); dados salvos ilegíveis ou inválidos viram cópia de recuperação baixável antes de qualquer descarte; versões validadas na abertura; `migrate` para estados de outra versão; relatório de validação fora das versões. |

**Regressão:** os 15 defeitos reproduzidos pela auditoria (`test.fail`) agora são testes normais e passam.

**Verificação:** Vitest 468 testes; Playwright 86 testes (77 anteriores + 9 novos em `tests/e2e/v421.spec.ts`).

# Versão 4.22 concluída (2026-11-03) — prévia fiel

| Item | O que mudou |
| --- | --- |
| B-05 Prévia integrada fiel | Header e sidebar escolhidos mostram o nome do projeto e os itens do menu (ou, sem menu definido, as funcionalidades previstas — nunca o menu de exemplo); dentro do app, o header fica na altura do layout desktop (a mesma do Master Prompt) e sem “Entrar”, CTAs, anúncio ou faixa utilitária de site; menus e popovers do header/sidebar não são mais cortados pela região; celular com marca, título e navegação inferior do projeto (vagas fixas + “Mais”), com ícones coerentes com os rótulos; landing com o nome do projeto; botão “Tela cheia” (Esc sai); aviso de tablet alinhado à regra única (desktop compactado). |
| B-19 Prévias de navegação | Nenhum `<main>`, `<header>` ou `<nav>` dentro das prévias (eram 37 `main` e ~50 `nav "Principal"`); controles das miniaturas fora do Tab (mouse e toque continuam funcionando; teclado testa em “Ver em tamanho grande”); prévia integrada sem controles dentro de `role="img"`. |
| B-21 Galerias por tipo de tela | Headers filtrados por “Área logada do aplicativo” × “Site público”; o padrão segue o tipo de projeto. |
| B-22 Escopo estruturado | Escolhas “Em monitores grandes” (centralizado, largura total, painel extra) e “Onde aparecem os stories” (só na inicial, telas principais, todas), nas páginas de arquitetura e na revisão; sem escolha, o prompt usa o padrão marcado como não revisado. |
| B-24 Padrões únicos | Modais de modelo com rodapé padrão (“Fechar” + prompt + “Escolher este modelo”, que escolhe e fecha); toasts de 3,5 s acima de barras fixas e fechados ao trocar de tela; no guiado, sem breadcrumb nem contador do topo repetindo o stepper; “Master Prompt” secundário até o esqueleto estar quase completo e com rótulo no celular. |

**Verificação:** Vitest 470 testes; Playwright 92 testes (6 novos em `tests/e2e/v422.spec.ts`).

# Versão 4.23 concluída (2026-11-03) — exportações para desenvolvedores

| Item | O que mudou |
| --- | --- |
| B-15 JSON consumível | A especificação JSON ganhou `facts` (chaves técnicas em inglês, números com unidade separada `{ value, unit }`: altura do header e se ele atravessa a sidebar, largura da sidebar, breakpoints, vagas da navegação inferior, drawer/trilho/stories, menu, marca, identidade) e `designTokens` no formato DTCG (`$type`/`$value`: cores, raios, espaços, borda, sombra, fontes, alturas de controle, breakpoints). Novos arquivos em Exportar: **Tokens (DTCG JSON)**, **Tailwind 3** (`tailwind.config.js` com cores, raios, fontes, sombras e `screens` 768/1024/1440 apontando para as variáveis), **Tailwind 4** (`@theme`) e **TypeScript** (`tokens.ts` com cores, raios, espaços, breakpoints e fatos `as const`). |
| B-15 CSS | Sem o breakpoint divergente de 599 px (agora 767 px, igual ao prompt); campos de texto com `input:where(:not([type=checkbox], [type=radio], [type=range], [type=color], [type=file]))` (checkbox e radio voltam ao tamanho nativo); escala de espaço só em múltiplos de 4 (`--density-unit` separado); `--control-h-sm/md/lg` (32/40/48) com 44 px de toque no celular; `--bp-*` documentados. |
| Prompt | Trechos `calc()/min()/max()/clamp()` saem em CSS válido (`calc(100dvh - 64px)`, sem “−” nem “64 px”). |
| B-18 Carregamento | O modal de prompt individual (motor + catálogos) só carrega ao abrir; cada etapa do guiado carrega só o próprio módulo; a tela inicial não importa mais os catálogos; os catálogos de entrada do atalho “Usar recomendados” carregam sob demanda. JS por tela: início 884 → 345 KB, cores 1 139 → 381 KB, guiado 1 724 KB → 339 KB + a etapa aberta. Galeria de inspiração: cada site completo só é montado quando o cartão chega perto da tela. |

**Verificação:** Vitest 476 testes (novo `tests/unit/v423.test.ts`, inclusive transpilação do `tokens.ts`); Playwright 92 testes.

# Versão 5.0 concluída (2026-11-03) — fechar o ciclo

| Item | O que mudou |
| --- | --- |
| Fidelidade automática | O executor local (`runner.py` 1.1) confere o site construído contra os fatos da especificação, em 1280 px e 390 px: marca visível, itens do menu, altura do header (±4 px), largura da sidebar (±8 px), fontes de títulos e textos, cor primária em ações, navegação inferior com o número certo de destinos, botão do drawer quando previsto e sidebar fora da tela no celular. A configuração exportada leva só as expectativas (sem segredos); o relatório traz só “confere/não confere” e medidas, nunca textos do site. O Validation Lab mostra “x de y fatos conferem” e o prompt de correção ganha a seção “Fidelidade à especificação”. Nova opção “Fidelidade à especificação” nas verificações. |
| Comparação entre versões | “Comparar com o atual” em cada versão salva: tabela das decisões que mudaram (projeto, entrada, arquitetura, navegação, identidade, componentes, referências) e quantas linhas do Master Prompt saíram e entraram; dali é possível restaurar a versão. |
| Projetos nomeados | “Seus projetos”: vários projetos no mesmo navegador, cada um com as próprias versões; “Novo projeto” e “Abrir” guardam o atual automaticamente; “Duplicar o atual” cria uma variação; o backup completo leva também os outros projetos. Com o armazenamento cheio, as versões dos outros projetos são as últimas a sair (os projetos ficam). |

**Verificação:** Vitest 483 testes (novo `tests/unit/v50.test.ts`); Playwright 96 testes (novo `tests/e2e/v50.spec.ts`, que roda o script de fidelidade do executor num site fiel e num site com desvios).

# Versão 5.1 concluída (2026-11-03) — refinamentos P2/P3

| Item | O que mudou |
| --- | --- |
| TE-12 Importação | Chaves de tokens desconhecidas recusadas (“token desconhecido”); limites de tamanho em textos (nome ≤ 200, descrições ≤ 5.000 caracteres, listas limitadas); relatório de validação guardado só se for válido; modelos que não existem no Studio (arquivo de outra versão ou editado à mão) viram pendência “escolha outro”. |
| TE-21 Escape | Nome do projeto seguro em comentários de CSS, JS e TS (`*/` e quebras de linha); textos livres no Master Prompt em uma linha, sem virar título, lista, citação ou HTML. |
| RA-13 / UX-23 Busca | Campo `combobox` + `listbox` correto (sem botões dentro das opções, `aria-activedescendant`); busca sem acento e sem plural (“botão” encontra “Botões”); índice de modelos, paletas, famílias, componentes, inspirações e templates carregado ao abrir a busca. |
| RA-14 Abas | Padrão de teclado do WAI-ARIA: só a aba ativa no Tab; setas, Home e End trocam de aba. |
| RA-04 Menu no celular | Aberto, o menu lateral é `role="dialog"` com o foco dentro dele (Tab não escapa) e devolve o foco ao fechar. |
| RA-09, RA-12, RA-19, RA-25 | Rodapé do guiado deixa de ser fixo em telas baixas (celular deitado); título da aba do navegador acompanha a tela; blocos de código roláveis acessíveis pelo teclado; erros anunciados com `role="alert"`. |
| UX-22, UX-29, UX-34, UX-35, UX-37, UX-41, UX-42, UX-43, UX-44 | “Prompt” nos 60 cartões de paleta só no modo Avançado; prévia da identidade com o nome e o menu do projeto; texto da etapa 7 coerente; aviso ao aplicar a sugestão de fluxo; categorias de componente sem número de catálogo (parecia contagem); selo “Prévia interativa” abaixo da prévia; textos sem caixa errada (“SaaS”); `#/livre` ativa o modo livre; etapas opcionais puladas aparecem como “(pulada)”, não como concluídas. |

**Verificação:** Vitest 483 testes; Playwright 101 testes (novo `tests/e2e/v51.spec.ts`).

## O que ficou de fora (e por quê)

- **Refatorações grandes sem efeito visível para quem usa** (TE-16 isolar o CSS das prévias, TE-17 kit
  de prévia único, TE-18 seletores finos, TE-19 dividir componentes gigantes, TE-20 ciclos de
  importação): alto esforço e risco; valem uma versão dedicada com testes de comparação visual.
- **RA-16** (interface inteira em `rem` para respeitar “só aumentar o texto”): mexe em todo o CSS.
- **Ajustes estéticos P3** (escala tipográfica do Studio, espécime de fontes, diferenciar Soft Pill /
  Bento Soft / Modern Material, variar os modelos de SaaS, paletas menos dependentes do Tailwind) e
  **UX-07/27/28/30**: mudam catálogos já escolhidos por usuários; pedem decisão de design antes.
- **RA-10, RA-20, RA-21, RA-22, RA-24, RA-26**: melhorias menores de modais em paisagem, stepper,
  galerias longas e landmarks; não bloqueiam o uso.
