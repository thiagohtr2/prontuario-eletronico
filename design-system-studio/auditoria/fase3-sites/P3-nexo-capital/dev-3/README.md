# Nexo Capital: demonstração de interface

Demonstração visual e navegável da plataforma financeira "Nexo Capital", conforme o `PROMPT.md`. HTML, CSS e JavaScript puros, sem backend e sem etapa de build. Os dados são fictícios e ficam no próprio front-end.

## Como abrir

Opção 1 (sem servidor): dê dois cliques em `index.html` ou abra o arquivo no navegador (`file://`).

Opção 2 (servidor estático simples), a partir desta pasta:

```
python3 -m http.server 4433
```

Depois abra `http://localhost:4433/`. Ao final, encerre o servidor com Ctrl+C.

A fonte Inter é carregada do Google Fonts. Sem conexão, a interface usa a fonte do sistema.

## Como entrar na demonstração

| Campo | Valor |
| --- | --- |
| E-mail | `demo@nexo.example` |
| Senha | `Demo@2026` |

Qualquer outra combinação mostra "E-mail ou senha incorretos". O botão "Entrar com SSO da empresa" simula o login e entra direto no painel. A recuperação de senha mostra a mensagem neutra, sem enviar e-mail.

Rotas (hash): `#/login`, `#/recuperar`, `#/app/painel/visao-geral` (e `aquisicao`, `retencao`, `receita`), `#/app/contratos`, `#/app/fornecedores`, `#/app/compras`, `#/app/colaboradores`, `#/app/folha`, `#/app/auditoria`, `#/app/permissoes`. Sem sessão, rotas do app redirecionam para o login.

## Estrutura dos arquivos

```
index.html              página única: carrega CSS e scripts (sem módulos ES, funciona via file://)
assets/css/base.css     tokens da paleta "Azul Institucional" (:root), base, botões e tela de acesso
assets/css/shell.css    shell: sidebar integral (desktop), rail (tablet), drawer e topbar (mobile)
assets/css/ui.css       painel: cabeçalho de página, KPIs, gráfico, tabela, menus, estados
assets/js/data.js       dados fictícios, navegação, abas, status e páginas
assets/js/core.js       helpers de DOM, ícones SVG, formatação pt-BR, menus, foco preso e aviso
assets/js/login.js      tela "Acesso corporativo" e recuperação de senha
assets/js/views.js      painel analítico (KPIs, gráfico, atividades, tabela) e páginas de lista
assets/js/shell.js      shell da aplicação, sidebar/drawer/rail e roteamento por hash
tests/qa.js             testes de largura e fluxo de login (Playwright)
tests/flows.js          testes de interação: drawer, rail, tabela, gráfico, período, erro, vazio, rotas
tests/shots/            capturas geradas pelos testes (celular, tablet e computador)
NOTES.md                ambiguidades e decisões sobre a especificação
```

Os tokens de cor e de tipografia ficam em `:root` (`assets/css/base.css`). Para trocar a marca, altere `--primary` e os demais tokens, e substitua o texto "Nexo Capital" e o símbolo "N" em `index.html`, `login.js` e `shell.js`.

## Testes

Usam Playwright já instalado (`require('playwright')`, sem `playwright install`). A partir desta pasta:

```
node tests/qa.js       # 69 verificações: largura de 320 a 1920 px, login e recuperação
node tests/flows.js    # 87 verificações: interações e todas as rotas em celular e computador
```

Por padrão os testes abrem o `file://`. Para rodar contra o servidor, defina `NEXO_URL`:

```
NEXO_URL=http://localhost:4433/index.html node tests/flows.js
```

Os testes verificam, nas larguras de 320 a 1920 px, a ausência de rolagem horizontal, de `undefined`/`NaN` no texto e de erros de JavaScript. Também verificam foco, Esc e devolução de foco no drawer e no rail, ordenação e seleção da tabela, legenda e tooltip do gráfico, mudança de período, estados de erro e vazio, logout e proteção de rotas.

Limites conhecidos: nenhum backend (a autenticação real precisa de servidor, ver `NOTES.md`), teclado virtual de celular real não foi testado e não há modo escuro.
