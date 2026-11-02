# Centro Operacional

Demonstração visual e interativa do sistema One Screen descrito em `PROMPT.md`: indicadores e dados operacionais em uma única tela, sem login e sem backend (todos os dados são fictícios e ficam no próprio front-end).

Tecnologia: **HTML + CSS + JavaScript puro**, sem build, sem dependências em tempo de execução.

## Como executar

Opção 1, direto do disco: abra `index.html` no navegador (funciona via `file://`; os scripts são clássicos, sem módulos ES, justamente por isso).

Opção 2, servidor estático:

```bash
python3 -m http.server 4442
# abra http://localhost:4442/
```

Não há `dist/`: o resultado já é a própria pasta.

## Estrutura

```
index.html            marcação, sprite de ícones Lucide inline, regiões da tela
css/tokens.css        tokens: paleta "Neutro Essencial", tipografia, espaçamento, geometria, escala
css/base.css          @font-face, reset, utilitários (.sr-only), ícones, foco visível
css/layout.css        modos de layout (desktop, médio, celular, empilhado) e dicas de rolagem
css/components.css    botões, abas, KPIs, blocos de status, badges, tabela/cartões, alertas, menu, diálogo, toasts
js/data.js            dados fictícios, formatação pt-BR, regras de status
js/ui.js              componentes reutilizáveis: menu/bottom sheet, diálogo, toasts, rolagem, lista de abas
js/app.js             renderização, tempo real simulado, estados, interações, atalhos
fonts/                Inter (variável, subsets latin e latin-ext), servida localmente
NOTES.md              ambiguidades da especificação e decisões tomadas
```

Todas as cores vêm de variáveis CSS em `css/tokens.css`; nenhum valor de cor fica espalhado pelo código.

## O que a tela faz

- **Painel operacional (>= 1280 px, altura >= 640 px)**: grade `minmax(0,1fr) 304px` × `52px minmax(0,1fr) 32px`, cabeçalho, grade central (4 indicadores, blocos Filas/SLA/Equipes, tabela "Pedidos recentes"), coluna de alertas e barra de status (relógio, conexão, última atualização). Sem rolagem da página; cada painel rola localmente com fade na borda quando há mais conteúdo.
- **Monitores grandes (>= 1440 px)**: a tabela passa para o lado dos blocos de status; a partir de 1920 / 2560 / 3200 px a escala geral cresce (1 px de design = 1/15 rem).
- **768–1279 px**: os alertas viram uma aba alternável com a grade (abas "Painel" e "Alertas" no cabeçalho).
- **Menos de 768 px**: One Screen móvel, topbar (56 px + safe area) + abas fixas (Indicadores, Operação, Dados, Alertas), um painel por aba com um destaque no topo e uma grade de blocos menores. Tabela vira cartões. Na horizontal as abas viram rail vertical.
- **Altura pequena** (< 640 px no desktop, < 560 px no celular): One Screen desligado, a página rola e os painéis se empilham.
- **Tempo real simulado** (a cada 5 s): KPIs, sparklines, filas, SLA e equipes variam; novos alertas entram no topo com animação discreta (`aria-live="polite"`) sem deslocar quem lê mais abaixo. Botão "Pausar/Retomar" (atalho `P`).
- **Indicadores**: tooltip com valores no sparkline (mouse e setas do teclado); clique abre o relatório detalhado (diálogo com seletor de indicador, gráfico, tabela de valores e exportação CSV).
- **Tabela**: ordenação por cabeçalho (`aria-sort`), checkbox por linha e no cabeçalho (indeterminado), filtro por cliente, menu de ações por linha (ver detalhes, marcar como pago, cancelar), exportação CSV, estados de carregando (skeleton), vazio e erro.
- **Simular estado** (botão na tabela): força Normal, Carregando, Vazio ou Erro de conexão na tabela e na lista de alertas (o erro também muda a barra de status; "Tentar novamente" recupera).
- **Atalhos**: `P` pausa/retoma, `R` abre o relatório, `/` foca o filtro. Setas esquerda/direita (e Home/End) trocam de aba.

## Acessibilidade

HTML semântico, `role="tablist"`/`aria-selected` (e `aria-current="page"` na aba ativa), papéis `tabpanel` aplicados só nos modos em que há abas, `<dialog>` modal com foco preso e retorno de foco, menus com setas/Esc/clique fora, foco visível (anel de 2 px + halo de 35%), `prefers-reduced-motion`, regiões roláveis focáveis por teclado, alvos de 44 px no celular, campos de 16 px no celular.

## Testes realizados

Verificado em Chromium (Playwright) nas larguras 320, 344, 360, 375, 390, 412, 430, 480, 500, 600, 700, 767, 768, 820, 900, 1024, 1100, 1279, 1280, 1366, 1440, 1600, 1920 e 2560 px, em várias alturas (400 a 1080 px), com fonte do sistema ampliada (125% e 150%): sem overflow horizontal, sem texto cortado, sem rolagem da página nos modos One Screen e alvos de toque >= 44 px no celular. Também foram exercitados por script: diálogo, menus, ordenação, seleção, filtro, estados simulados, filtros de alertas, inserção de alerta, atalhos e abas por teclado. Não foi testado em Safari/Firefox.

## Créditos

Inter (SIL OFL 1.1, via `@fontsource-variable/inter`) e ícones Lucide (ISC, embutidos como sprite SVG em `index.html`).
