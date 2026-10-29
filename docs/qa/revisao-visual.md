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

## Receituário em PDF

Os PDFs foram gerados pelo próprio app no Chromium (`npm run qa:receita`), baixados e convertidos em
imagem para revisão: modelo nas configurações (A5, rosé, logomarca em SVG), receita de um atendimento
salvo (A4) e receita gerada no editor antes de salvar. Capturas: `receita-a4.png` e
`receita-a5-logomarca.png`.

| Problema | Onde | Correção |
| --- | --- | --- |
| Nome da médica invadia "Receituário" no cabeçalho | A5 | Bloco de identidade com largura flexível e quebra de linha |
| Contatos sobrepostos ao endereço da clínica no rodapé | A4 e A5 | Colunas com largura definida; endereço e telefone/CNPJ em linhas separadas |
| Rodapé sumia em receitas com 2 páginas | Receitas longas | O número da página saiu do bloco do rodapé (bug do react-pdf 4.9 com texto dinâmico) |
| Número da página não aparecia | Receitas longas | `lineHeight` saiu do estilo da página, que impedia o desenho de textos dinâmicos |
| Grupo de medicamentos pulava inteiro para a página seguinte | Receitas longas | Cabeçalhos de via e itens no mesmo nível: a quebra acontece item a item |
| Numeração fora de ordem quando as vias se alternam | Itens intercalados | Numeração feita depois de agrupar por via |
| Numerais antigos da Cormorant ("1" parecia "I") | Todos | Números em Inter, dentro de um círculo na cor escolhida |

As seis cores do receituário passam de 5,5:1 sobre o branco e sobre o fundo suave do painel da
paciente.
