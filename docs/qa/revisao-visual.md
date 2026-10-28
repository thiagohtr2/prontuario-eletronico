# Revisão visual — fase de entrada e navegação

Comparação das capturas de cada tela com a arquitetura aprovada, feita sobre as capturas do
`scripts/qa/responsive.cjs` (320, 390, 768, 1024, 1440 px e paisagens). As imagens de referência
estão em [`telas/`](telas/).

## Estrutura aprovada × implementada

| Item aprovado | Como ficou | Captura |
| --- | --- | --- |
| Sidebar flutuante compacta (224 px, afastada do topo e da borda, sombra suave) | Sidebar de 224 px a 16 px do topo e da borda, cantos de 20 px, sombra Soft Neumorphic; recolhe para o rail | `inicio-1440.png` |
| Header de 64 px, sticky | Header flutuante de 64 px com breadcrumbs, data e menu da conta; fica preso ao rolar | `inicio-1440.png` |
| Tablet: priorizar conteúdo | Rail de 100 px com ícone e rótulo de cada destino | `inicio-768.png` |
| Celular: Dock flutuante (< 768 px, 60 px, afastado das bordas) | Dock de 60 px a 12 px das bordas e acima da safe area; header simples no topo | `inicio-390.png`, `prontuario-390.png` |
| Landing "Pixel Arcade", composição imersiva | Hero de borda a borda no vinho da marca, título grande, coração em pixels; plano, sem sombras | `landing-1440.png`, `landing-390.png` |
| Acesso "Clássico central" com cadastro na mesma tela | Formulário centralizado; Entrar e Criar conta alternam no segmented control | `entrar-390.png`, `cadastro-1440.png` |

## Problemas encontrados na revisão e corrigidos

| Problema | Onde | Correção |
| --- | --- | --- |
| "Configurações" quebrava no meio da palavra no rail | 768–1023 px | Rótulos do rail sem quebra e menos recuo lateral; nova checagem automática "rótulo transborda" |
| Data do header como "Quarta-Feira, 28 De Outubro" | ≥ 1280 px | Só a primeira letra em maiúscula: "Quarta-feira, 28 de outubro" |
| Três KPIs empilhados ocupavam meia tela | < 640 px | KPIs em linhas compactas (rótulo à esquerda, número à direita) |
| Nomes de pacientes e clínicas truncados nas listas do painel | Todas as larguras | Os nomes quebram linha em vez de cortar |
| Itens de lista e do dock a 1–2 px um do outro | Todas as larguras | Listas com 8 px entre itens; dock com 8 px entre destinos |
| Menu da conta descia sobre o dock | 568×320 | Altura máxima do menu desconta o dock |
| Campo de data e hora sem anel de foco | Teclado | `focus-within` no controle nativo |

## Pontos para decisão

- **Rótulo "Consultas" no dock:** "Atendimentos" não cabe a 320 px; no restante do app o nome
  continua "Atendimentos".
- **Exceções de cor por contraste:** texto secundário `#835866` e borda de campos no token de ícone
  (ver README, "Exceções de acessibilidade").
- **Famílias de componente:** a forma segue a família aprovada e a cor segue a paleta global; por
  isso o header Dark Luxury é claro. Halos e gradientes da família Aurora ficam para o acabamento.
