# Conecta — demonstração de interface

Plataforma social mobile-first (stories, feed de cards, perfil, drawer lateral e dock flutuante), implementada a partir do `PROMPT.md`. É uma **demonstração navegável sem backend**: todos os dados são fictícios e ficam no próprio navegador.

## Como executar

Não há etapa de build. Escolha uma das opções:

1. **Direto do disco:** abra `index.html` no navegador (funciona em `file://`).
2. **Servidor estático:** dentro desta pasta, rode
   ```bash
   python3 -m http.server 4451
   ```
   e acesse <http://localhost:4451/>.

O endereço abre direto na tela **Entrar**. Conta de demonstração (também há um botão “Preencher dados de demonstração” na tela):

| Campo    | Valor             |
| -------- | ----------------- |
| E-mail   | `ana@conecta.app` |
| Telefone | `(11) 98765-4321` |
| Senha    | `conecta123`      |

Qualquer outra combinação mostra o erro genérico “E-mail ou senha incorretos”. A aba **Criar conta** também funciona: a nova conta fica salva só neste navegador. Para ver o link direto do cadastro, use `index.html?aba=cadastro`.

A fonte Inter vem do Google Fonts. Sem internet, a página usa a fonte do sistema.

## O que dá para testar

- **Login / cadastro na mesma tela:** abas “Entrar | Criar conta” (`?aba=cadastro`), alternância “E-mail | Telefone”, validação ao sair do campo e ao enviar (mensagem abaixo do campo + resumo `role="alert"`), mostrar/ocultar senha, checklist de requisitos, “Esqueci minha senha” com mensagem neutra, botão com estado “Entrando…”.
- **Celular (< 768 px):** topbar de 56 px com ☰, logo, busca, “+” e avatar; faixa de stories; dock flutuante (Início, Explorar, Salvos, Perfil); drawer esquerdo de 280 px (foco preso, fundo `inert`, fecha com Esc, com toque no scrim ou no ✕, e devolve o foco).
- **Tablet (768–1023 px):** header compacto com botão “Menu” que abre um painel abaixo do header.
- **Computador (≥ 1024 px):** topbar integral fixa (60 px), navegação central com sublinhado, busca que cresce ao focar (Enter busca, Esc limpa), “+ Novo”, sino com popover e avatar com menu. Um item “Mais” aparece só se os links não couberem (por exemplo, com fonte ampliada).
- **Páginas:** Feed, Explorar (busca + filtros por tema), Salvos, Perfil (abas, editar perfil, seguir), Grupos, Eventos, Mensagens (conversa com envio e resposta simulada), Notificações, Configurações, Ajuda e detalhe da publicação (curtir, salvar, comentar).
- **Estados:** carregamento (esqueleto), vazio (ex.: Salvos sem itens, “Meus grupos”) e erro. Para ver o erro, ative **Configurações › Demonstração › Simular falha de conexão**: cada lista falha uma vez e “Tentar novamente” recarrega.
- **Configurações › Restaurar dados da demonstração** volta tudo ao estado inicial.

## Estrutura

```
index.html          Marcação da tela de login/cadastro, do shell do app (header, painel, main, dock) e do drawer
css/
  tokens.css        Tokens centralizados: paleta "Comunidade", tipografia, geometria, movimento, família Modern Material
  base.css          Reset, foco visível, botões, campos, avatares, badges, chips, switches
  login.css         Login "Acesso responsivo" + cadastro "mesma tela"
  app.css           Header, popovers, painel, stories, cards, perfil, listas, mensagens, drawer, dock, modais, responsividade
js/
  icons.js          Ícones lucide (contorno, traço 2 px) embutidos como SVG
  data.js           Dados fictícios (usuários, posts, stories, grupos, eventos, conversas, notificações)
  ui.js             Utilitários: camadas modais (foco preso + inert), popovers, toasts, modal/bottom sheet, validação
  login.js          Lógica do login, do cadastro e da recuperação de senha
  app.js            Estado, roteador por hash (#/feed, #/perfil…), navegação, páginas e ações
tests/              Scripts Playwright usados na validação (opcionais)
NOTES.md            Ambiguidades da especificação e as decisões tomadas
```

Tecnologia: HTML + CSS + JavaScript puro (scripts clássicos, sem módulos, para funcionar em `file://`). Sem dependências nem build.

## Testes (opcional)

Com Node e Playwright disponíveis:

```bash
node tests/smoke.js         # abre, entra e tira capturas (celular e computador)
node tests/responsive.js    # overflow horizontal em 18 larguras (320 a 1920 px) × 13 rotas + login
node tests/interactions.js  # login/cadastro, drawer, painel, popovers, stories, publicação, estados
node tests/mais.js          # item "Mais" com fonte ampliada
```

As capturas vão para `tests/shots/` (ou para a pasta indicada em `SHOTS`). Os testes usam `file://` por padrão; `BASE=http://localhost:4451/index.html node tests/interactions.js` roda contra o servidor.

> Observação de segurança: a autenticação aqui é só de interface. Em produção, implemente backend seguro (hash Argon2id/bcrypt, limite de tentativas, cookie httpOnly + Secure + SameSite, CSRF, HTTPS, verificação de e-mail), como pede a especificação.
