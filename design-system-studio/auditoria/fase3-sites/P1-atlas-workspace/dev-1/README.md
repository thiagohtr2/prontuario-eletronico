# Atlas Workspace — demonstração navegável

Demonstração visual e interativa do SaaS **Atlas Workspace**, construída a partir do `PROMPT.md`.
Não há backend: todos os dados são fictícios e ficam no próprio front-end (memória e `localStorage`/`sessionStorage` do navegador).

- Tecnologia: **HTML + CSS + JavaScript puros** (sem framework, sem etapa de build, sem dependências).
- Fonte Inter carregada do Google Fonts. Sem internet, o navegador usa a fonte do sistema e o resto funciona igual.
- Ícones no estilo Lucide (traço de 1,5 px), embutidos em `js/icons.js`, então funcionam offline.

## Como executar

**Opção 1: abrir direto do disco.** Dê dois cliques em `index.html` (ou abra `file:///…/index.html`). Tudo funciona via `file://`, porque as rotas usam hash (`#/painel`) e os scripts são clássicos, não módulos ES.

**Opção 2: servidor estático.**

```bash
python3 -m http.server 4411
# abra http://localhost:4411/
```

### Acesso de demonstração

O endereço abre direto na tela **Entrar**.

| E-mail | Senha |
| --- | --- |
| `marina@atlas.app` | `atlas1234` |

Você também pode criar uma conta em **Criar conta**. Ela fica guardada só neste navegador.
Com **Lembrar de mim** marcado, a sessão fica no `localStorage` e você não precisa entrar de novo. Sem a marcação, a sessão dura até fechar a aba. Para voltar à tela de login, use **Sair** (no menu do perfil ou na página *Mais* do celular).

## O que dá para fazer

| Rota | Tela |
| --- | --- |
| `#/entrar` | Login "Clássico central": validação ao sair do campo e no envio, resumo com `role="alert"`, mostrar/ocultar senha, estado "Entrando…" e erro genérico de credenciais |
| `#/cadastro` | Cadastro em página própria: força da senha (fraca/média/forte, com texto), requisitos, confirmação em tempo real, aceite dos termos e mensagem neutra quando o e-mail já existe |
| `#/recuperar-senha` | Recuperação: mensagem neutra, código `one-time-code` (qualquer código de 6 dígitos funciona) e nova senha |
| `#/inicio` | Saudação, tarefas do dia (marcar como concluída e desfazer), agenda e projetos recentes |
| `#/painel` | Dashboard "Visão geral": filtro de período (atualiza todos os blocos, com carregamento por bloco), 3 KPIs com sparkline e tooltip, gráfico de barras (tooltip por mouse, toque ou setas do teclado, mais a alternativa em tabela), atividades, exportação CSV real e a tabela "Pedidos recentes" (ordenação com `aria-sort`, seleção com checkbox geral/indeterminado, ações por linha e em massa, busca e estados) |
| `#/projetos` | 12 cards Swiss com link estendido, filtro por status, busca, estados e modal "Novo projeto" com validação |
| `#/projetos/site-institucional` | Detalhe do projeto: resumo, páginas, tarefas e equipe |
| `#/projetos/site-institucional/pagina-inicial` | 3º nível da trilha "Projetos / Site institucional / Página inicial": checklist de seções e comentários |
| `#/tarefas` | Nova tarefa (formulário Swiss), filtros, busca, concluir e excluir (com desfazer) |
| `#/calendario` | Grade mensal ou modo Agenda (padrão em telas estreitas) e detalhes do evento |
| `#/pessoas` | Diretório em tabela, que vira cartões no celular. Inclui convite de pessoa |
| `#/mensagens`, `#/mensagens/c1` | Conversas: abrir uma conversa zera o contador de não lidas. Também dá para enviar mensagem |
| `#/relatorios`, `#/relatorios/receita` | Relatórios: o clique num KPI do painel abre o detalhado |
| `#/configuracoes` | Formulário Swiss de perfil e preferências, que atualiza o nome no shell e o menu recolhido |
| `#/ajuda` | Perguntas frequentes e formulário "Fale com a gente" (2 colunas, termos, "Enviando…") |
| `#/perfil`, `#/notificacoes` | Meu perfil e lista completa de notificações |
| `#/mais` | Só no celular: destino "Mais" da bottom navigation, com busca e os demais destinos |

**Estados de carregamento, vazio e erro.** A tabela "Pedidos recentes" tem o seletor *Simular estado (demonstração)*. Nas listas também dá para forçar o estado pela URL: `#/projetos?estado=erro`, `#/tarefas?estado=vazio`, `#/pessoas?estado=carregando`, `#/notificacoes?estado=erro`, `#/painel?estado=carregando`.

### Layout por largura

- **≥ 1280 px:** sidebar integral de 252 px e header de 64 px só sobre a coluna principal.
- **1024–1279 px:** sidebar de 220 px. O botão ao lado do logo recolhe o menu para um trilho de 72 px, e a escolha fica guardada no `localStorage`.
- **768–1023 px:** trilho de 72 px com tooltips. O botão ☰ abre a sidebar completa em sobreposição (com scrim, Esc, clique fora e foco preso).
- **< 768 px:** topbar de 56 px (logo, título e avatar) e bottom navigation com 4 destinos (Início, Painel, Projetos, Mais). Cada destino guarda a própria rolagem e pilha. Popovers viram bottom sheets.

## Estrutura dos arquivos

```
index.html            página única; carrega CSS e JS (scripts clássicos, compatíveis com file://)
css/
  tokens.css          tokens da paleta "Neutro Essencial", tipografia, geometria, camadas, movimento
  base.css            reset, botões/campos globais, mensagens, popover/menu/bottom sheet, modal, toast
  auth.css            login, cadastro e recuperação ("Clássico central")
  shell.css           sidebar integral/trilho, header com trilha e busca, topbar e bottom nav do celular
  swiss.css           família Swiss Minimal: página, botões, filtros, campos, cards, KPIs, gráfico, tabela, estados
  pages.css           estilos específicos de cada página (tarefas, calendário, mensagens, ajuda, mais…)
js/
  icons.js            ícones SVG embutidos
  util.js             utilitários (escape, storage seguro, formatação pt-BR, foco, popovers, tooltip, toast, modal)
  data.js             dados fictícios (pessoas, projetos, tarefas, eventos, mensagens, pedidos, séries do painel)
  forms.js            validação reutilizável (ao sair do campo e no envio, resumo com links, força da senha)
  auth.js             sessão de demonstração e telas de entrar, cadastro e recuperação
  components.js       componentes Swiss: cabeçalhos, card, KPI + sparkline, gráfico de barras, tabela de dados
  shell.js            shell do app (sidebar, header, busca, notificações, menus, bottom nav, pilhas por destino)
  pages-main.js       Início, Painel, Projetos, Projeto, Página do projeto, Tarefas
  pages-more.js       Calendário, Pessoas, Mensagens, Relatórios, Configurações, Ajuda, Perfil, Notificações, Mais
  app.js              roteador por hash e proteção das rotas do app
tests/                scripts Playwright usados na validação (opcionais)
NOTES.md              ambiguidades e contradições da especificação e as decisões tomadas
```

Todas as cores vêm de variáveis CSS em `css/tokens.css`. Nenhuma outra folha declara cores fixas.

## Testes (opcional)

Precisa de Node 22 e Playwright instalados no ambiente.

```bash
node tests/smoke.js          # entra com a conta demo e percorre todas as rotas
node tests/interactions.js   # 76 verificações de comportamento (validação, sidebar, popovers, tabela, celular…)
node tests/overflow.js       # procura overflow horizontal de 320 a 1920 px em todas as rotas
node tests/shots.js          # capturas de tela em tests/.shots (SIZES=1280x800,390x844 ROUTES='#/painel')
```

## Avisos

Isto é uma **demonstração de interface**. A autenticação é simulada no navegador: a senha das contas criadas é guardada com um hash não criptográfico, só para não ficar em texto puro. Em produção, implemente backend seguro, como pede a especificação: hash de senha (Argon2id/bcrypt), limitação de tentativas, verificação de e-mail, sessão em cookie httpOnly + Secure + SameSite, proteção CSRF e HTTPS.
