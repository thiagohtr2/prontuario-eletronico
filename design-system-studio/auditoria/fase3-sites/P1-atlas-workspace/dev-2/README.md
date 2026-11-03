# Atlas Workspace — demonstração visual

Demonstração navegável e interativa do SaaS descrito em `PROMPT.md`. Tudo roda no navegador, com dados fictícios e sem backend.

**Tecnologia:** HTML + CSS + JavaScript puro (sem framework e sem etapa de build). Por isso não existe pasta `dist/`: a própria raiz é a entrega.

## Como executar

Opção 1 (mais simples): abra o arquivo `index.html` direto no navegador (`file://`). O roteador usa `#hash` e scripts clássicos, então funciona sem servidor.

Opção 2: sirva a pasta com qualquer servidor estático.

```bash
python3 -m http.server 4412
# abra http://localhost:4412/
```

O endereço abre direto na tela de **entrar** (fluxo "Apenas login", sem página de apresentação).

### Acesso de demonstração

| Campo | Valor |
| --- | --- |
| E-mail | `demo@atlas.com` |
| Senha | `Atlas@2026` |

Também é possível criar uma conta em **Criar conta**. Depois de criada, ela passa a funcionar no login, mas só no navegador atual (`localStorage`; a senha fica guardada como hash SHA-256, apenas para a demonstração).

A autenticação é **simulada**. Uma versão real precisa de backend seguro: hash Argon2id/bcrypt, limite de tentativas, cookie httpOnly + Secure + SameSite, CSRF e HTTPS. Os textos da especificação sobre isso estão preservados nas observações do `PROMPT.md`.

## Rotas

| Rota | Conteúdo |
| --- | --- |
| `#/login` (padrão) | Login "Clássico central" |
| `#/cadastro` | Cadastro em página própria |
| `#/recuperar` | Recuperação de senha (mensagem neutra) |
| `#/termos`, `#/privacidade` | Textos de demonstração |
| `#/painel` | Dashboard "Visão geral": 3 KPIs, gráfico de barras e atividades, com filtro de período |
| `#/inicio` | Cards (Swiss Minimal) |
| `#/projetos`, `#/projetos/:id`, `#/projetos/:id/:pagina` | Cards, detalhe e trilha de 3 níveis, como `Projetos / Site institucional / Página inicial` |
| `#/tarefas`, `#/pessoas`, `#/relatorios` | Tabelas (ordenação, seleção, ações, exportar CSV, estados) |
| `#/calendario` | Agenda em lista |
| `#/mensagens` | Caixa de entrada (lidas/não lidas atualizam as contagens) |
| `#/configuracoes`, `#/ajuda` | Formulários Swiss (a Ajuda traz o "Fale com a gente") e FAQ |

Rotas internas sem sessão redirecionam para o login e, depois de entrar, voltam ao destino pedido.

Nas listas e tabelas há um seletor **"Estado da demonstração"** (Dados, Carregando, Vazio, Erro) para exibir os estados exigidos em `PROMPT.md` seção G.

## Layout

| Largura | Estrutura |
| --- | --- |
| 1280 px ou mais | Sidebar integral de 252 px + header de 64 px só sobre a coluna principal |
| 1024–1279 px | Sidebar de 220 px |
| 768–1023 px | Trilho de 72 px (ícones com tooltip); o botão expande a sidebar completa em sobreposição, com scrim, Esc e clique fora |
| abaixo de 768 px | Topbar de 56 px + Bottom Navigation de 4 destinos (Painel, Projetos, Tarefas e **Mais**, que abre uma folha com o restante) |

No desktop o botão "Recolher menu" alterna entre 252 e 72 px e o estado fica salvo em `localStorage`.

## Estrutura dos arquivos

```
index.html            página única; carrega CSS e scripts na ordem certa
assets/favicon.svg
css/
  tokens.css          TODOS os tokens (paleta Neutro Essencial, raios, espaços, z-index, medidas)
  base.css            reset, foco, botões, campos, checkbox, alertas, utilitários
  auth.css            login, cadastro, recuperação, páginas legais
  shell.css           sidebar, header, bottom nav, popovers, menus, diálogos/sheets, tooltip, toast
  swiss.css           componentes Swiss Minimal: cards, KPIs, gráfico, tabela, formulário, estados
js/
  util.js             helpers, storage seguro, foco/scroll lock, formatação pt-BR
  icons.js            ícones de contorno (estilo lucide, traço 1.5)
  overlay.js          popover, menu, diálogo/bottom sheet, tooltip, toast
  data.js             dados fictícios
  forms.js            validação (ao sair do campo e no envio), resumo de erros, botão de carregando
  auth.js             login, cadastro, recuperação, sessão simulada
  search.js           busca global com listbox acessível
  shell.js            sidebar, header, bottom nav, notificações, folha "Mais"
  ui-basic.js         cabeçalho de página, cards, KPIs, sparkline, gráfico de barras, estados
  ui-table.js         tabela
  ui-form.js          formulário Swiss genérico
  pages.js            páginas internas e resolução de rotas
  main.js             roteador por hash e inicialização
tests/                scripts Playwright usados na verificação (opcionais)
NOTES.md              ambiguidades e decisões
```

Nenhuma cor fica fixa fora de `css/tokens.css`. O CSS e o JS consomem `var(--token)`.

## Fonte e ícones

- **Inter** é a fonte declarada (`--font`). Nenhum arquivo foi embutido porque não havia acesso à rede ao montar a entrega. O navegador usa a Inter instalada no sistema e, sem ela, `system-ui`. Para embutir, siga o comentário no topo de `css/tokens.css`.
- Os **ícones** são SVGs inline no estilo lucide (contorno, traço 1.5), redesenhados em `js/icons.js`.

## Testes (opcional)

Com Node e Playwright instalados:

```bash
node tests/func.js      # fluxos: login, cadastro, shell, popovers, dashboard, tabela, formulários, mobile
node tests/widths.js    # sem overflow horizontal de 320 a 1920 px, rotas públicas e internas
node tests/kbd.js       # foco visível, setas, Esc, retorno de foco, trap de Tab
node tests/touch.js     # alvos de toque >= 44 px e fontes mínimas no celular
node tests/mobile2.js   # paisagem (barras <= 25% da altura) e topbar que esconde ao rolar
node tests/contrast.js  # contraste WCAG dos pares de tokens
```
