# Verde Vivo — loja de plantas (demonstração)

Demonstração visual, navegável e interativa da loja de plantas **Verde Vivo**, implementada a partir do `PROMPT.md`.
Não há backend: catálogo, preços, perfil e estoque são dados fictícios no próprio front-end.

## Como executar

Não há etapa de build nem dependências.

- **Direto do disco:** abra `index.html` no navegador (funciona em `file://`).
- **Servidor estático (opcional):**
  ```bash
  python3 -m http.server 4421
  # depois acesse http://localhost:4421/
  ```

As fontes Fraunces e Inter vêm do Google Fonts. Sem internet, a página usa Georgia e a fonte do sistema, sem perder nenhuma funcionalidade.

## O que dá para fazer

| Rota (hash) | Conteúdo |
| --- | --- |
| `#/` | Landing assimétrica "Folha Viva" adaptada à Verde Vivo: hero com título deslocado, imagem alta e imagem sobreposta; cartões escalonados; citação recuada; texto com imagem que sangra até a borda direita; chamada final; rodapé com newsletter |
| `#/catalogo` | Catálogo com cards de produto, categoria (`?cat=`), busca (`?q=`), filtros (`luz`, `rega`, `porte`, `preco`, `extra`) e ordenação (`sort`) |
| `#/produto/<id>` | Página do produto: quantidade, adicionar à sacola (abre o minicarrinho), favoritar, produtos relacionados |
| `#/favoritos` | Produtos favoritados (salvos no navegador) |
| `#/sacola` | Sacola com quantidades, remoção, frete grátis acima de R$ 199 e resumo |

Interações principais:

- **Header desktop (≥ 768 px):** faixa de anúncio dispensável, linha 1 com logo, busca larga, endereço de entrega (CEP com validação), favoritos, perfil e sacola com contador; linha 2 com "Departamentos ▾" (mega menu por clique, teclado ou hover com atraso de 150 ms) e atalhos. A linha 2 recolhe ao rolar para baixo e volta ao rolar para cima. Entre 1024 e 1279 px o 5º item vai para "Mais ▾"; entre 768 e 1023 px a linha vira faixa rolável com indicação de continuidade.
- **Celular (< 768 px):** barra de 56 px (logo, sacola, perfil, ☰), campo de busca sempre visível que abre a tela de busca em tela cheia, faixa de categorias com rolagem e scroll-snap (recolhe ao rolar), menu ☰ com acordeão de departamentos e menu inferior flutuante com 4 destinos.
- **Busca:** combobox acessível com grupos (Recentes / Sugestões; Produtos / Categorias ao digitar), debounce de 250 ms com spinner, setas + Enter, Esc fecha/limpa, atalho **⌘K / Ctrl+K**.
- **Filtros:** drawer lateral à direita no desktop e bottom sheet com alça de arraste no celular; contagem ao vivo, "Limpar" e "Aplicar filtros"; filtros ativos viram chips removíveis.
- **Estados:** carregamento (esqueleto), vazio e erro em listas e formulários.
  - Erro do catálogo: abra `#/catalogo?simular=erro` e use "Tentar novamente".
  - Erro da newsletter: assine com `erro@exemplo.com`.
  - Produto esgotado: `#/produto/lirio-da-paz` (botão desabilitado).

Sacola, favoritos, buscas recentes, CEP e o aviso dispensado ficam no `localStorage` apenas por conveniência. Tudo funciona normalmente se o armazenamento estiver bloqueado.

## Estrutura dos arquivos

```
index.html                 Estrutura da página (landmarks vazios preenchidos pelo JS) e ordem dos scripts
assets/css/
  tokens.css               Paleta "Floresta", tipografia, raios, espaçamentos, sombras, tokens das ilustrações
  base.css                 Reset, tipografia, foco visível, botões e formulários globais (geometria 8 px)
  header.css               Faixa de anúncio, header de duas linhas, mega menu, popovers, header móvel,
                           faixa de categorias, menu ☰ e menu inferior flutuante
  components.css           Componentes "Soft Pill": card de produto, busca, drawer de filtros/bottom sheet,
                           chips, toasts, estados vazio/erro
  pages.css                Landing, catálogo, produto, sacola, rodapé e classes das ilustrações SVG
assets/js/
  icons.js                 Sprite de ícones no estilo lucide (contorno, traço 2 px)
  data.js                  Categorias, filtros e 31 produtos fictícios
  illustrations.js         Ilustrações botânicas vetoriais geradas em SVG (cores via tokens)
  store.js                 Estado: sacola, favoritos, buscas recentes, endereço
  ui.js                    Utilitários: trap de foco, trava de rolagem, popover, drawer, toasts
  search.js                Componente de busca (combobox + listbox)
  header.js                Header, menu ☰, tela de busca, dock, rodapé e comportamento de rolagem
  pages.js                 Páginas (início, catálogo, produto, favoritos, sacola, 404) e drawers
  app.js                   Roteador por hash e inicialização
NOTES.md                   Ambiguidades e contradições da especificação e as decisões tomadas
```

Tecnologia: HTML + CSS + JavaScript puro (scripts clássicos, sem módulos ES, para funcionar em `file://`).

## Testes realizados

Com Playwright (Chromium), servido em `http://localhost:4421` e também via `file://`:

- Sem overflow horizontal em 320, 344, 360, 375, 390, 412, 430, 480, 600, 700, 768, 820, 900, 1024, 1100, 1280, 1440 e 1920 px, em todas as rotas.
- Celular na horizontal (667 × 375), menus por teclado (Tab, Enter, setas, Esc), trap de foco e devolução de foco ao gatilho nos menus e drawers, arraste do bottom sheet, `prefers-reduced-motion`.
- Nenhum erro de console.
