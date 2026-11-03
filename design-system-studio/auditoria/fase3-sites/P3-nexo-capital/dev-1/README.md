# Nexo Capital — demonstração de interface

Demonstração navegável e interativa da plataforma financeira **Nexo Capital**, implementada a partir do `PROMPT.md`:
login corporativo com SSO, dashboard financeiro com KPIs, gráfico de barras e atividades, tabelas de dados e
navegação com sidebar integral (desktop), trilho (tablet) e drawer pela esquerda (celular).

Não há backend: todos os dados são fictícios e gerados no próprio navegador (de forma determinística, com data de
referência fixa em 02/11/2026).

## Como executar

Sem build e sem dependências. Duas opções:

1. **Direto do disco:** abra `index.html` no navegador (funciona via `file://`).
2. **Servidor estático:** na pasta do projeto, rode `python3 -m http.server 4431` e acesse `http://localhost:4431/`.

O endereço abre direto na tela de entrar. Para acessar:

- **E-mail e senha:** `ana.ribeiro@nexocapital.com.br` / `Nexo@2026` (qualquer outra combinação mostra o erro genérico “E-mail ou senha incorretos”); ou
- **“Entrar com SSO da empresa”**, que simula o redirecionamento ao provedor de identidade.

A fonte Inter é carregada do Google Fonts; sem internet, a página usa a fonte do sistema.

### O que dá para testar

| Área | Interações |
| --- | --- |
| Login | Validação ao enviar e ao sair do campo (mensagem abaixo do campo + resumo `role="alert"`), mostrar/ocultar senha, estado “Entrando…”, erro genérico, “Esqueci minha senha” com mensagem neutra, SSO simulado. |
| Shell | Sidebar com grupos recolhíveis (estado lembrado), seletor de unidade (troca os dados), menu do perfil que abre para cima, atalho de configurações. 768–1023 px: trilho de 72 px com tooltips e sidebar completa em sobreposição. < 768 px: topbar + drawer com foco preso, Esc, toque no scrim e botão Fechar. |
| Header | Abas Visão geral / Aquisição / Retenção / Receita (encaixadas), seletor de período, Exportar (CSV), busca (`/`), notificações, menu do perfil, sombra após 8 px de rolagem. |
| Dashboard | 3 KPIs com variação vs. período anterior, gráfico “Vendas por mês” (tooltip por mouse, toque e setas do teclado; legenda liga/desliga séries; tabela alternativa para leitor de tela), atividades recentes, tabela “Pedidos recentes”. O período e a unidade recarregam todos os blocos, cada um com seu estado de carregamento. |
| Tabelas | Ordenação com `aria-sort`, seleção com checkbox (todos/indeterminado) e ações em lote, filtro por status (sublinhado de 2 px) e por texto, ações por linha (detalhes, marcar como pago, excluir com “Desfazer”…), paginação, “Novo pedido” com validação. No celular cada linha vira cartão. |
| Estados | Em **Configurações → Demonstração** (ou com `?estado=loading|empty|error` na URL) é possível simular carregando, vazio e erro em todos os blocos; “Tentar novamente” recarrega o bloco. |
| Atalhos | `/` busca · `R` atualizar · `?` ajuda · `Esc` fecha menus, painéis e diálogos · setas no gráfico focado. |

## Estrutura dos arquivos

```
index.html            Marcação do login e do esqueleto da aplicação; carrega CSS e JS (scripts clássicos, sem módulos, para funcionar via file://)
css/
  tokens.css          Todos os tokens da identidade (paleta Azul Institucional, tipografia, geometria, camadas). Únicas cores do projeto.
  base.css            Reset, tipografia, botões, campos, badges, avatar, menus, tooltip, toast, diálogos.
  login.css           Tela “Acesso corporativo”.
  shell.css           Layout: sidebar integral, header do painel, trilho (tablet), topbar e drawer (celular), popovers do header.
  components.css      Componentes Compact Pro: página, KPIs, gráfico, atividades, tabela, páginas de conta.
js/
  icons.js            Ícones de contorno (estilo Lucide, traço 1,75) e o símbolo da marca.
  data.js             Dados fictícios determinísticos: usuário, unidades, períodos, registros do painel e das páginas.
  ui.js               Utilitários: formatação pt-BR, armazenamento protegido, popovers/menus acessíveis, sobreposição com foco preso, tooltip, toast, diálogo, CSV.
  chart.js            Gráfico de barras agrupadas em SVG (componente reutilizável).
  table.js            Tabela de dados (componente reutilizável).
  login.js            Comportamento do login e da recuperação de senha.
  shell.js            Sidebar, header, drawer, menus, busca e notificações.
  pages.js            Páginas: Painel (4 visões), Contratos, Fornecedores, Compras, Colaboradores, Folha, Auditoria, Permissões, Meu perfil, Configurações, Ajuda.
  app.js              Estado global, sessão de demonstração e roteamento por hash (#/entrar, #/painel/visao-geral, #/contratos…).
tests/                Scripts Playwright usados na validação (não fazem parte da entrega visual):
  responsive.js       Verifica overflow horizontal em 20 larguras (320–1920 px) × 16 rotas.
  interactions.js     Login, drawer, trilho, menus, tabela, gráfico, estados; salva capturas em tests/shots/.
  extra.js            Celular na horizontal, foco preso no drawer, foco no header, prefers-reduced-motion.
NOTES.md              Ambiguidades e contradições da especificação e a decisão tomada em cada caso.
```

Para rodar os testes (Node + Playwright instalados): `node tests/responsive.js`, `node tests/interactions.js`, `node tests/extra.js`.

## Observações importantes

- **Autenticação é só visual.** Em produção: SSO via SAML 2.0 ou OpenID Connect; backend com hash de senha
  (Argon2id/bcrypt), limitação de tentativas, sessão em cookie httpOnly + Secure + SameSite, proteção CSRF e HTTPS.
  A “sessão” da demo fica em `sessionStorage` (e em memória, se o armazenamento estiver bloqueado).
- Preferências (grupos recolhidos, unidade e período padrão) ficam em `localStorage`, sempre com `try/catch`;
  a página funciona sem armazenamento.
- Exportar gera um CSV (separador `;`, UTF-8 com BOM) com os registros do período.
