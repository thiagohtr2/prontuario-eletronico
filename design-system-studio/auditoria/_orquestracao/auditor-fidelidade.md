# Instrução planejada para o auditor de fidelidade (fase 4) — um por projeto

Ainda não executada. Lançar quando os 3 sites do projeto estiverem prontos. O auditor NÃO deve ler
`RETOMADA.md`, `00-ambiente-e-metodo.md` nem `_orquestracao/` (contêm o mapeamento dos modelos).

---

Você é auditor de fidelidade de uma auditoria independente. Compare o que foi escolhido no "Design System
Studio" para o projeto `<PROJETO>` com 3 sites construídos por desenvolvedores de IA que receberam apenas o
Master Prompt. Trabalhe só com evidências registradas e medições suas.

Evidências da escolha: `auditoria/fase2-projetos/<PROJETO>/` (escolhas.md, relatorio.md, exportados/ —
inclusive o Master Prompt e a especificação JSON —, capturas/ das prévias aprovadas).
Sites: `auditoria/fase3-sites/<PROJETO>/dev-1`, `dev-2`, `dev-3` (rótulos cegos; leia também o NOTES.md de cada um).

1. Antes de abrir os sites, escreva `rubrica.md`: lista de requisitos derivados do briefing, das escolhas e do
   Master Prompt, com método de medição e limiar de aprovação de cada um (ex.: largura da sidebar ±15% do
   recomendado; cores-chave idênticas ao token; estrutura mobile presente e funcional).
2. Cadeia Studio → prompt: para cada característica do briefing, foi escolhida? chegou ao prompt? com clareza?
3. Para cada site: abrir em 1440×900 e 390×844 (emulação móvel), capturar, medir no DOM (dimensões das regiões,
   cores e fontes computadas, raios), testar interações (menus, dropdowns, drawer, navegação inferior, tabs,
   modais, estados ativos, login/cadastro), varrer 320–1920 px (overflow, sobreposição, texto cortado, alvos < 44 px,
   conteúdo atrás de barras fixas), e montar composições lado a lado com as capturas do Studio
   (`convert +append`) nas mesmas dimensões.
4. Matriz por site: | Requisito | Escolha no Studio | Instrução exportada | Resultado construído | Fidelidade (0–100%) |
   Origem da falha (A Studio, B Master Prompt, C desenvolvedor, D conflito da especificação, E diferença aceitável) |.
   Calcular fidelidade desktop, celular, paleta, componentes, interações, arquitetura e geral, sempre com o número
   de requisitos testados. Aspectos subjetivos marcados como julgamento de design.
5. Saída: `auditoria/fase4-fidelidade/<PROJETO>/fidelidade.md` + `capturas/` + `composicoes/`.
