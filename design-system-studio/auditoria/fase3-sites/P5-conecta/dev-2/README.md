# Conecta — demonstração de interface

Plataforma social mobile-first (stories, feed de cards, perfil, dock flutuante e drawer lateral). Implementação em **HTML + CSS + JavaScript puros**, sem build e sem backend: todos os dados são fictícios e vivem no front-end.

## Como executar

Abra o arquivo `index.html` direto no navegador (duplo clique ou `file://`). Não há dependências nem etapa de build.

Opcionalmente, com um servidor estático:

```bash
python3 -m http.server 4452   # dentro desta pasta
# abra http://localhost:4452/
```

A fonte Inter é carregada do Google Fonts quando há rede; sem rede o app usa a fonte do sistema (o layout continua íntegro).

### Acesso de demonstração

- E-mail: `ana@conecta.demo` · Telefone: `(11) 91234-5678` · Senha: `Conecta123`
- Qualquer outra combinação mostra o erro genérico "E-mail ou senha incorretos".
- Também é possível criar uma conta na aba "Criar conta" (nada é persistido; recarregar a página volta à tela de entrar).
- Links diretos: `index.html?aba=cadastro` e `index.html?aba=recuperar`.

## Estrutura de arquivos

```
index.html            Estrutura: tela de entrada, casca do app (header, stories, main, dock, drawer), sprite de ícones
css/tokens.css        Tokens da paleta "Comunidade", geometria, espaçamento, tipografia, escopo .mm (Modern Material)
css/base.css          Reset, tipografia, foco visível, utilitários
css/components.css    Botões, campos, abas, chips, popovers, diálogos/bottom sheet, toasts, estados
css/layout.css        Header, navegação desktop (+ "Mais"), painel Menu (tablet), stories, dock, drawer
css/auth.css          Tela de entrada (login | cadastro | recuperar)
css/views.css         Cards, publicação, perfil, listas, visualizador de stories, ilustrações
js/util.js            Helpers ($, esc, ícones, avatar, focáveis)
js/data.js            Dados fictícios e estado em memória
js/art.js             Ilustrações planas em SVG inline (sem imagens externas)
js/ui.js              Diálogos (foco preso, inert, trava de rolagem), popovers/menus, toasts, bottom sheet
js/auth.js            Login, cadastro, recuperação, validação, teclado virtual (visualViewport)
js/shell.js           Header, navegação, drawer, painel Menu, stories e visualizador
js/views.js           Páginas: feed, explorar, salvos, post, perfil, grupos, eventos, mensagens...
js/app.js             Roteador (hash), sessão, ações globais, compor publicação, editar perfil
tests/                Scripts Playwright usados na verificação (overflow, funcional, capturas)
NOTES.md              Ambiguidades da especificação e decisões tomadas
```

Os scripts são clássicos (sem `type="module"`), pois módulos ES não carregam via `file://`; compartilham o namespace `window.Conecta`.

## Arquitetura responsiva

- **>= 1024 px**: topbar fixa de 64 px com navegação inline (Feed, Grupos, Eventos, Mensagens + menu "Mais"), busca, "+ Novo", notificações e avatar. Links excedentes migram para "Mais".
- **768–1023 px**: links recolhem no botão "Menu" (painel de largura total abaixo do header).
- **< 768 px**: topbar com ☰ (abre o drawer esquerdo), faixa de stories, dock flutuante de 4 destinos. Na horizontal os stories recolhem e o dock fica com 52 px.

## Testes executados

```bash
cd tests
NODE_PATH=$(npm root -g) node overflow.js     # 22 larguras (320–1920) x 13 telas, sem overflow horizontal
NODE_PATH=$(npm root -g) node functional.js   # ~100 verificações de comportamento/acessibilidade
NODE_PATH=$(npm root -g) node shots.js        # capturas em tests/shots
```
