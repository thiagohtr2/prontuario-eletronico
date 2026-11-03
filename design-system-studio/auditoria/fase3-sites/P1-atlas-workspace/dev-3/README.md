# Atlas Workspace - demonstração de interface

Protótipo navegável em HTML, CSS e JavaScript puro, sem backend e sem etapa de build. Os dados são fictícios e ficam no próprio front-end. Não há `dist/`: o que está na raiz já é a entrega.

## Como abrir

Opção 1 (sem servidor): dê dois cliques em `index.html`. Funciona via `file://`, porque o roteamento usa `#/...` e os scripts são clássicos (sem módulos ES).

Opção 2 (servidor estático):

```bash
cd <esta pasta>
python3 -m http.server 4413
# abra http://127.0.0.1:4413/
```

A tela inicial é a de entrar. Credencial da demonstração: `demo@atlas.app` / `demo1234`. Qualquer outra combinação recebe a mensagem genérica "E-mail ou senha incorretos.". Também é possível criar conta em `#/cadastro`; o e-mail `ana@atlas.app` simula "já cadastrado".

Rotas principais: `#/entrar`, `#/cadastro`, `#/recuperar`, `#/termos`, `#/privacidade` (públicas) e `#/app/inicio`, `#/app/painel`, `#/app/projetos`, `#/app/tarefas`, `#/app/calendario`, `#/app/equipe`, `#/app/mensagens`, `#/app/relatorios`, `#/app/configuracoes`, `#/app/ajuda` (exigem sessão de demonstração). Em `#/app/relatorios?erro=1` a tabela abre no estado de erro.

## Estrutura

```
index.html                 documento único; carrega CSS e scripts na ordem certa
css/
  base.css                 tokens (:root, paleta "Neutro Essencial"), controles, autenticação,
                           família Swiss (cards, tabelas, formulários, KPIs, dashboard)
  layout.css               shell: sidebar (252/220/72 px), header de 64 px, topbar de 56 px,
                           Bottom Navigation, popovers, breakpoints e ajustes móveis
js/
  icons.js                 ícones de traço (estilo Lucide) em SVG inline
  core.js                  utilitários, sessão de demonstração, roteador por hash,
                           popovers, armadilha de foco, validação de formulários
  auth.js                  entrar, cadastro, recuperação de senha, páginas legais
  shell.js                 sidebar, overlay de 768-1023 px, header, busca, notificações,
                           menu do perfil, Bottom Navigation
  pages-a.js               Início, Painel (dashboard), Projetos (cards), Tarefas, Calendário
  pages-b.js               Pessoas, Mensagens, Relatórios (tabela), Configurações, Ajuda (formulário)
  main.js                  inicialização
tests/
  smoke.js                 fluxo de entrada, rotas, overflow horizontal de 320 a 1920 px, console
  interact.js              sidebar, overlay, popovers, busca, painel, tabela, formulários, badges
  shots.js                 capturas de tela para revisão visual (grava em qa-shots/)
NOTES.md                   ambiguidades, lacunas e contradições da especificação e as decisões
```

Preferências guardadas no navegador (por visitante): estado recolhido da sidebar e dos grupos, sessão de demonstração (`localStorage` com "Lembrar de mim", `sessionStorage` sem ele). Todo acesso ao armazenamento tem try/catch.

## Testes

Os testes usam o Playwright já instalado (`require('playwright')`, Chromium sem opções). Não é preciso instalar nada.

```bash
node tests/smoke.js                              # usa o index.html desta pasta
node tests/smoke.js http://127.0.0.1:4413/index.html
node tests/interact.js
node tests/shots.js                              # opcional: capturas em qa-shots/
```

Os scripts imprimem PASS/FAIL e terminam com código 1 se houver falhas.

## Observações

- Não há autenticação real. A especificação exige backend seguro (hash Argon2id/bcrypt, rate limit, cookie httpOnly/Secure/SameSite, CSRF, verificação de e-mail, HTTPS); nada disso foi implementado aqui.
- Ícones: traços SVG inline no estilo Lucide, sem CDN, para funcionar offline.
- Fonte: Inter via Google Fonts; sem internet, cai para a fonte do sistema.
- Não há modo escuro (a especificação não o pede).
