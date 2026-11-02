# Verde Vivo: demonstração da loja de plantas

Site estático em HTML, CSS e JavaScript puro, sem backend e sem etapa de build. Os dados (plantas, categorias, preços) são fictícios e ficam no front-end.

## Como abrir

- **Direto do disco:** dê duplo clique em `index.html`. Funciona via `file://`.
- **Servidor estático simples:** dentro desta pasta, rode `python3 -m http.server 4423` e acesse `http://localhost:4423/`.

Não há pasta `dist/`, porque não há build.

Sem internet, as fontes do Google (Fraunces e Inter) não carregam e o site usa Georgia e a fonte do sistema. O layout continua funcionando.

## Telas e rotas

- `#/` (ou sem hash): landing **Folha Viva**, com header leve, hero assimétrico, cartões escalonados, citação, faixa que sangra, chamada final e rodapé.
- `#/catalogo`: catálogo **Verde Vivo** com campanha, benefícios, categorias (clique abre a ampliação), vitrine com busca, filtros e ordenação, origem, newsletter e rodapé.
- Parâmetros opcionais em `#/catalogo`: `cat` (`interior`, `exterior`, `suculentas`, `vasos`, `cuidados`, `acessorios`), `luz` (`sombra`, `meia`, `sol`), `porte`, `cuidado`, `preco`, `q` (busca), `ord` (`relevancia`, `menor`, `maior`, `nome`) e `erro=1` (simula falha ao carregar).

Layouts: abaixo de 768 px vale o header fixo com busca, faixa de categorias e dock inferior. A partir de 768 px vale a topbar de duas linhas, com mega menu.

## Estrutura

```
index.html          Marcação das duas telas, sprite de ícones, drawers e dialogs
css/tokens.css      Tokens da paleta "Floresta", tipografia, base, botões e campos
css/header.css      Topbar desktop, header móvel, faixa de categorias, dock, popover da conta
css/landing.css     Landing Folha Viva (grade de 12 colunas, cartões, citação, faixa)
css/catalog.css     Campanha, categorias, vitrine, cards, drawers, dialogs, formulário, rodapé
js/data.js          Dados fictícios e gerador das ilustrações SVG (cores pelos tokens)
js/core.js          Utilitários, camadas (foco preso, Esc, clique fora), rotas por hash, toast
js/catalog-list.js  Estado dos filtros, busca, grade e estados (carregando, vazio, erro), faixa, categorias
js/catalog-ui.js    Topbar e mega menu, combobox de busca, conta, sacola, dock, rolagem, newsletter
js/landing.js       Ilustrações da landing, menu do celular e inicialização
tests/smoke.js      Teste de navegador (Playwright): estouro horizontal em 320 a 1920 px e fluxos
NOTES.md            Ambiguidades e contradições da especificação e as decisões tomadas
```

Todas as cores vêm de variáveis CSS em `:root` (`css/tokens.css`). Para trocar a marca, altere os tokens e os textos fictícios em `index.html` e `js/data.js`.

## Teste

Com o servidor da porta 4423 no ar e o Playwright disponível:

```
node tests/smoke.js
```

O teste verifica estouro horizontal nas larguras 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1000, 1024, 1280, 1440 e 1920 px. Também percorre mega menu, busca com teclado, filtros, produto, sacola, ampliação, newsletter e o menu da landing no celular.
