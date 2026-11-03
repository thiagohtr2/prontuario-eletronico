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
