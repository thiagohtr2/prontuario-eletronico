# Conecta: demonstração visual

Plataforma social mobile-first, implementada como demonstração navegável. HTML, CSS e JavaScript puros, sem build e sem backend. Os dados são fictícios e ficam na memória da página.

## Como abrir

Duas opções, sem instalar nada:

1. **Direto do disco:** dê duplo clique em `index.html`. Funciona por `file://`.
2. **Servidor estático:** dentro desta pasta, rode `python3 -m http.server 4453` e abra `http://localhost:4453/`.

A tela de entrada abre primeiro. Não há página de apresentação.

**Credenciais da demonstração**

- E-mail: `demo@conecta.app`
- Telefone: `(11) 91234-5678`
- Senha: `demo1234`
- Código de confirmação no cadastro: `123456`

## Parâmetros de URL

| URL | Efeito |
| --- | --- |
| `index.html` | Tela de entrar (aba Entrar) |
| `index.html?aba=cadastro` | Aba Criar conta (link direto) |
| `index.html?aba=recuperar` | Recuperação de senha |
| `index.html?falha=feed` | A primeira carga do feed falha, para ver o estado de erro |

## Rotas do app (depois de entrar)

Endereços com `#/`: `feed` (também em "Início" e "Feed"), `explorar`, `salvos`, `perfil`, `perfil/<id>`, `grupos`, `eventos`, `mensagens`, `notificacoes`, `busca?q=...`, `publicacao/<id>`, `configuracoes`, `ajuda` e `conta`.

## Estrutura

```
index.html              Shell: tela de entrada, app, dock, drawer, modal
css/
  tokens.css            Tokens da paleta "Comunidade", base, botões, ícones, estados
  auth.css              Tela de entrada: login, cadastro (abas), recuperação
  app.css               Header desktop (Praça), topbar e stories do celular, dock, drawer, popovers, modal
  conteudo.css          Cards do feed, perfil, listas, busca, páginas
js/
  icones.js             Ícones SVG de traço (sem dependências)
  dados.js              Dados fictícios e ilustrações SVG
  ui.js                 Utilitários: foco preso, Esc, abas por teclado, anúncios, sessão
  auth.js               Login, cadastro e recuperação com validação e estados
  views.js              Telas e estados de carregamento, vazio e erro
  app.js                Roteamento por hash, cabeçalho, drawer, popovers, modal
tests/
  teste-navegador.js    Teste Playwright (ver abaixo)
_testes/                Capturas de tela da última execução do teste
NOTES.md                Ambiguidades e decisões sobre o PROMPT.md
```

## Layouts

- **Desktop (768 px ou mais):** topbar fixa de 64 px com logo, navegação (Feed, Grupos, Eventos, Mensagens), busca, "+ Novo", notificações e avatar. Em 768 a 1023 px a navegação recolhe em um botão "Menu" que abre um painel abaixo do header.
- **Celular (menos de 768 px):** topbar com hambúrguer, busca e avatar, faixa de stories, conteúdo, dock flutuante (Início, Explorar, Salvos, Perfil) e drawer lateral esquerdo (Grupos, Eventos, Mensagens, Notificações, Configurações, Ajuda, Conta e "Sair da conta").

## Teste no navegador

Requer Node 22 com Playwright (`require('playwright')`). Não é preciso instalar navegadores extras para este teste, que usa o Chromium já disponível.

```
node tests/teste-navegador.js
```

O teste abre `index.html` por `file://`, verifica sem rolagem horizontal de 320 a 1920 px, percorre os fluxos principais e grava capturas em `_testes/`. Último resultado: 102 verificações aprovadas, sem erro de console.

## Pontos de ajuste

- Marca e monograma: `index.html` (`.marca__nome`, `.monograma`).
- Cores e medidas: `css/tokens.css`.
- Dados fictícios (pessoas, publicações, notificações): `js/dados.js`.
- Textos da demonstração de login (credenciais): `js/auth.js` (constantes `DEMO_*`) e a linha "Demonstração" em `index.html`.

## Limitações

Esta é uma demonstração de interface. Não há autenticação real, persistência entre aparelhos, envio de e-mail nem API. Para produção, o backend precisa cuidar de hash de senha, limitação de tentativas, sessão em cookie httpOnly, Secure e SameSite, proteção CSRF e HTTPS. As decisões e lacunas estão em `NOTES.md`.
