# Centro Operacional

Demonstração visual navegável de um painel operacional em uma única tela (One Screen), feita em HTML, CSS e JavaScript puro. Não há backend, login nem build: os dados são fictícios e ficam no próprio front-end.

## Como abrir

Opção 1 (mais simples): dê duplo clique em `index.html`. Funciona pelo protocolo `file://`.

Opção 2 (servidor estático, opcional):

```bash
cd caminho/para/dev-3
python3 -m http.server 8000
# abra http://localhost:8000
```

A fonte Inter é carregada do Google Fonts. Sem internet, a página usa a fonte do sistema com o mesmo layout.

## Comportamento

- **Computador (largura >= 768 px e altura >= 640 px):** a tela ocupa a viewport. Em 1280 px ou mais, a grade de indicadores e a tabela ficam ao lado da coluna de alertas (304 px). Entre 768 e 1279 px, os alertas viram a aba "Alertas", alternando com a "Grade".
- **Celular (< 768 px e altura >= 560 px):** topbar com safe-area, abas fixas (Indicadores, Dados, Alertas) e um painel por vez. Na horizontal, as abas viram um rail à esquerda.
- **Altura pequena (< 640 px no computador, < 560 px no celular):** o modo One Screen é desativado. A página rola e os painéis ficam empilhados, sem esconder nada.
- **Tempo real:** a cada 9 s entra um alerta novo no topo da lista. O botão "Pausar atualizações" interrompe isso.
- **Tabela:** ordenação por cabeçalho (`aria-sort`), busca por cliente, filtro por status, seleção com checkbox (incluindo o do cabeçalho com estado indeterminado) e botão "Detalhes".
- **Indicadores:** cada cartão tem tendência (passe o ponteiro ou use as setas com o foco) e o botão "Ver relatório" abre um diálogo com a série diária.
- **Teclado:** Tab para navegar; setas ←/→ (Home/End) trocam de aba; Esc fecha o diálogo e devolve o foco ao botão que o abriu.

### Estados para teste

Use parâmetros na URL:

| URL | O que mostra |
| --- | --- |
| `index.html` | Dados normais |
| `index.html?estado=carregando` | Skeletons por 6 s |
| `index.html?estado=vazio` | Listas, tabela e alertas vazios |
| `index.html?estado=erro` | Falha na primeira chamada de cada fonte; "Tentar novamente" funciona |

## Estrutura dos arquivos

```
index.html            Estrutura da página (cabeçalho, abas, grade, tabela, alertas, barra de status, diálogo)
css/
  tokens.css          Tokens da paleta "Neutro Essencial", tipografia, raios, espaçamentos e medidas
  components.css      Botões, campos, abas, cartões de indicador, tabela, alertas, diálogo, estados
  layout.css          Modos de layout (One Screen desktop, abas do celular, rail, modo empilhado) e movimento reduzido
js/
  data.js             Dados fictícios e simulação de carregamento (modos de estado por URL)
  ui.js               Ícones, formatação pt-BR, mensagens de estado, cartão de indicador e sparkline
  app.js              Lógica da tela: carregamento, tabela, alertas, abas, diálogo e relógio
tests/
  check.js            Teste automatizado com Playwright (layout em 35 larguras/alturas e interações)
  shots-extra.js      Gera capturas adicionais (abas do celular, horizontal, tablet)
  last-run.txt        Saída da última execução de check.js
  shots/              Capturas de tela usadas na verificação visual
NOTES.md              Ambiguidades, lacunas e contradições do PROMPT.md e as decisões tomadas
PROMPT.md             Especificação original (não alterar)
```

Os tokens de cor ficam todos em `css/tokens.css`. Para trocar a marca, altere os valores de `:root` ali.

## Executar os testes

Requer Node 22 e Playwright 1.63 (Chromium já instalado no ambiente):

```bash
cd caminho/para/dev-3
node tests/check.js
```

O teste abre `index.html` pelo `file://`, verifica overflow horizontal, rolagem da página no One Screen, alvos de toque de 44 px no celular, texto cortado, 4 indicadores, estados (carregando, vazio, erro), teclado, diálogo, ordenação, seleção, filtros e alertas em tempo real. Ao final, imprime `Todos os testes passaram` quando nenhuma verificação falha.

## Tecnologias

HTML5, CSS3 (grid, `dvh`, `env(safe-area-inset-*)`, `clamp()`) e JavaScript ES5/ES2015 em scripts clássicos. Sem frameworks, sem bundler e sem `dist/`, porque nada precisa de build.
