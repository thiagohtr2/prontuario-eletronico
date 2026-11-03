# Nexo Capital — demonstração visual

Plataforma financeira (login corporativo, dashboard, tabela de dados e gráficos) implementada a partir do `PROMPT.md`.
É uma **demonstração de interface**: HTML + CSS + JavaScript puro, sem backend, sem build e sem dependências de rede. Todos os dados são fictícios e ficam no front-end.

## Como executar

**Opção 1 — abrir direto do disco:** dê duplo clique em `index.html` (funciona em `file://`; o roteamento usa `#hash` e não há módulos ES, por isso não precisa de servidor).

**Opção 2 — servidor estático simples:**

```bash
cd <esta pasta>
python3 -m http.server 4432
# abra http://localhost:4432/
```

Não há `dist/`: a pasta já é o resultado final.

### Acesso de demonstração

| Campo | Valor |
| --- | --- |
| E-mail | `ana.souza@nexocapital.com.br` |
| Senha | `Nexo@2026` |

O botão **Entrar com SSO da empresa** simula o redirecionamento e entra direto. Qualquer outra combinação de e-mail/senha mostra o erro genérico “E-mail ou senha incorretos”. A sessão fica só em `sessionStorage` (some ao fechar a aba).

### Estados de carregando, erro e vazio

Além de aparecerem naturalmente (período alterado = skeleton por bloco; filtro sem resultado; remover todas as linhas da tabela), é possível forçar os estados do dashboard pela URL:

- `#/painel/visao-geral?estado=erro` — todos os blocos falham; cada um tem “Tentar novamente”.
- `#/painel/visao-geral?estado=vazio` — KPIs, gráfico, atividades e tabela sem dados.
- `#/painel/visao-geral?estado=carregando` — blocos presos em skeleton.

## O que foi implementado

- **Login “Acesso corporativo”**: header fino com logotipo e “Suporte de TI”, cartão com SSO em destaque, divisor “ou”, e-mail + senha (mostrar/ocultar com `aria-pressed`), validação ao sair do campo e ao enviar (mensagem sob o campo + resumo `role="alert"`), erro de credenciais genérico, botão com “Entrando…”, “Esqueci minha senha” com mensagem neutra, aviso de segurança no rodapé. Sem cadastro.
- **Shell desktop**: sidebar integral (252 px ≥1280, 220 px em 1024–1279, rail de 72 px em 768–1023 com tooltip e expansão em sobreposição com scrim/Esc/clique fora), header de 64 px sticky somente sobre a coluna principal com abas “encaixadas” (Visão geral, Aquisição, Retenção, Receita), seletor de período, Exportar (gera CSV de verdade), busca, notificações e menu do perfil; grupos da sidebar recolhem e lembram o estado; seletor de unidade com menu.
- **Shell mobile (< 768 px)**: topbar de 56 px (+ safe area) com ☰, logo, título, notificações e avatar; esconde ao rolar para baixo e volta ao rolar para cima; drawer pela esquerda (min(85vw, 280px), 320 px em paisagem) com foco preso, `inert` no fundo, Esc/scrim/X, retorno do foco ao gatilho e trava de rolagem; `prefers-reduced-motion` troca o deslize por fade.
- **Dashboard financeiro (Compact Pro)**: 3 KPIs, gráfico de barras “Vendas por mês” (SVG próprio, 2 séries, grade discreta, legenda clicável, tooltip por mouse/toque/teclado, tabela alternativa oculta), lista de atividades e tabela “Pedidos recentes” (checkbox com selecionar todos/indeterminado, ordenação com `aria-sort`, filtro, ações por linha com menu, detalhes em `<dialog>`, estados carregando/vazio/erro; vira cartões no celular). O filtro de período atualiza todos os blocos, cada um com seu próprio carregamento. As 4 abas do Painel têm conteúdo próprio.
- Demais destinos da sidebar (Contratos, Fornecedores… Permissões, Configurações, Ajuda, Meu perfil) abrem uma tela de estado vazio explicando que estão fora do escopo — veja `NOTES.md`.

## Estrutura de arquivos

```
index.html                 login + shell + drawer (marcação estática)
assets/
  css/
    tokens.css             TODOS os tokens da paleta Azul Institucional, tipografia, geometria, espaçamento
    base.css               reset, foco, botões, campos, badge, skeleton, estados, menu/popover, tooltip, toast, modal
    login.css              tela de login
    shell.css              sidebar, rail, header, abas, drawer e breakpoints do shell
    dashboard.css          KPIs, gráfico, atividades, tabela e cartões mobile (Compact Pro)
  js/
    icons.js               ícones Lucide embutidos (traço 1.75, estilo outline)
    data.js                dados fictícios determinísticos, formatadores pt-BR, modelo de navegação
    ui.js                  popover/menu com reposicionamento na viewport, tooltip, toast, foco preso, inert, trava de rolagem
    login.js               validação, SSO simulado, recuperação de senha
    chart.js               gráfico de barras em SVG
    table.js               tabela de dados
    dashboard.js           composição e estados por bloco do dashboard, exportação CSV
    shell.js               navegação, drawer, rail, menus, busca, notificações, comportamento do header
    app.js                 roteador por hash e sessão simulada
  fonts/                   Inter variável (subconjunto latin, licença OFL incluída)
NOTES.md                   ambiguidades da especificação e decisões tomadas
```

Rotas (hash): `#/login`, `#/recuperar`, `#/painel/{visao-geral|aquisicao|retencao|receita}`, `#/contratos` … `#/permissoes`, `#/configuracoes`, `#/ajuda`, `#/perfil`.

## Tecnologias

HTML5 semântico, CSS com variáveis (tokens centralizados em `tokens.css`, container queries para o dashboard, `100dvh`, `env(safe-area-inset-*)`), JavaScript ES5/ES2015 sem frameworks e sem build. Fonte Inter (@fontsource-variable/inter, OFL) e ícones Lucide (ISC) embutidos localmente, então funciona offline.

## Como foi testado

Playwright + Chromium, abrindo via `file://`: 27 larguras entre 320 e 1920 px (incluindo 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 e intermediárias) em login, três telas do app, sem overflow horizontal e com alvos de toque ≥ 44 px abaixo de 768 px; paisagem de celular (667×375); fluxo de login (validação, erro, SSO, recuperação, sair); drawer (foco preso, Esc, scrim, retorno de foco); rail/overlay do tablet; ordenação, seleção, remoção/restauração, filtro e exportação CSV; auditoria axe-core (WCAG 2.1 A/AA) sem violações nas telas principais.
