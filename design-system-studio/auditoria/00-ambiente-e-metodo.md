# Auditoria do Design System Studio — ambiente, método e limitações

Este documento registra **o que foi usado, como e o que não pôde ser feito**. Ele vem antes de
qualquer resultado para que cada conclusão possa ser lida com o contexto certo.

## Objeto auditado

| Item | Valor |
| --- | --- |
| Produto | Atelier UI — Design System Studio |
| Versão congelada | commit `e4c79f3` (branch `claude/beautiful-sagan-1n51el`) |
| Endereço usado nos testes | `http://127.0.0.1:4300/` — cópia estática do build de produção (`vite build`) servida por `python3 -m http.server`, idêntica em código à página publicada no claude.ai |
| Por que não a URL publicada | a página do claude.ai exige login na conta do dono; agentes automatizados não têm essa sessão. O build local é o mesmo código. |
| Código-fonte | `design-system-studio/` neste repositório |
| Ambiente de construção dos sites de teste | pastas vazias e isoladas fora do repositório (scratchpad da sessão), copiadas depois para `auditoria/fase3-sites/` |

## Ferramentas efetivamente disponíveis

| Ferramenta | Situação |
| --- | --- |
| Playwright 1.63 + Chromium 1243 | disponível e usado |
| Firefox e WebKit | **não instalados** (o ambiente proíbe reinstalar navegadores). Todos os testes de navegador são só em Chromium. |
| Emulação móvel | Chromium com `isMobile`, `hasTouch`, `deviceScaleFactor` e user agent móvel (não é aparelho físico) |
| ImageMagick (`convert`) e Pillow | disponíveis, para composições lado a lado |
| Lighthouse 13 e axe-core 4 | disponíveis via npm, instalados em pastas temporárias pelos agentes que os usam |
| Agentes de IA independentes | sim — subagentes com contexto próprio, iniciados um a um, sem acesso às conversas dos outros |
| Modelos de IA para os desenvolvedores | **apenas da família Claude (Anthropic)**: Opus 5.5, Sonnet 5.5 e Haiku 5.5. Não há GPT nem outro fornecedor conectado. |

## Limitações que mudam a leitura dos resultados

1. **Usuários simulados não são pessoas.** Os agentes A1–A6 são personas interpretadas por IA. Eles
   revelam problemas de clareza, fluxo e acessibilidade observáveis, mas **não provam** que pessoas reais
   vão gostar ou entender o produto. Nenhuma conclusão deste relatório substitui pesquisa com usuários.
2. **Um único fornecedor de modelos.** "Três desenvolvedores independentes" = três modelos Claude de
   tamanhos diferentes, cada um em contexto limpo. Isso mede a robustez do prompt entre modelos de
   capacidades diferentes, mas não entre fornecedores (GPT, Gemini etc. não foram testados).
3. **Independência por instrução, não por isolamento físico.** Todos os agentes rodam no mesmo
   contêiner. A independência foi garantida por: contextos separados, instruções explícitas de não ler
   código nem relatórios alheios, pastas de trabalho separadas e, para os desenvolvedores, pastas fora do
   repositório contendo apenas o Master Prompt. Não há sandbox que impeça fisicamente um agente de ler
   outro arquivo; as transcrições ficam disponíveis para conferência.
4. **Rótulos cegos.** Os sites construídos ficam em `dev-1`, `dev-2` e `dev-3`. Os auditores de
   fidelidade não sabem qual modelo construiu qual site; o mapeamento é revelado só no relatório final.
5. **Concorrência limitada.** O contêiner tem 4 CPUs. Agentes rodam em ondas em segundo plano;
   métricas de desempenho medidas durante a auditoria podem sofrer interferência e são indicadas como tal.

## Equipe e independência

| Grupo | Agentes | Recebe | Não recebe |
| --- | --- | --- | --- |
| A — primeiro acesso | A1 leigo, A2 intermediário, A3 desenvolvedor, A4 designer, A5 celular, A6 impaciente | só o endereço e a persona | código, documentação, instruções de onde clicar, relatórios alheios |
| P — construção de projetos | P1 Atlas Workspace, P2 Verde Vivo, P3 Nexo Capital, P4 Centro Operacional, P5 Conecta | endereço + briefing do projeto | código, documentação |
| D — desenvolvedores | 3 por projeto (15 no total) | apenas o Master Prompt exportado, numa pasta vazia | capturas, estado interno do Studio, explicações, acesso ao Studio |
| F — fidelidade | 1 auditor por projeto | evidências registradas (escolhas, exportações, capturas) + os 3 sites | identidade do modelo de cada site |
| Especialistas | responsividade e acessibilidade, técnica e desempenho, regressão, crítica de design | acesso completo, depois da fase 1 | — |

## Cenário dos desenvolvedores

O usuário típico copia o Master Prompt e cola numa IA. Por isso cada desenvolvedor recebe **somente o
Master Prompt**. O JSON exportado contém o estado interno completo do Studio (`source`) e por isso não foi
entregue (seria "acesso ao estado interno"). Nos cinco projetos, o construtor informou a tecnologia
"HTML + CSS + JavaScript" no próprio Studio, para que os sites abram no navegador sem etapa de build.

## Mapeamento dos desenvolvedores (revelado só no relatório final)

Mantido fora das pastas lidas pelos auditores até a consolidação.
