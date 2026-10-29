# Singulare — Prontuário eletrônico

Sistema web para médicas acompanharem seus pacientes em um único lugar, mesmo quando os
atendimentos acontecem em clínicas diferentes. Cada paciente tem um histórico único, em ordem
cronológica, reunindo todas as consultas independentemente da clínica.

## O que o sistema faz

- Página pública de apresentação (landing) em `/`.
- Acesso em uma única tela: entrar, criar conta e recuperar senha (Supabase Auth).
- Cadastro de pacientes, com busca rápida por nome ou CPF.
- Cadastro das clínicas onde a médica atende.
- Registro de atendimentos com data, horário, clínica, tipo de atendimento, queixa principal,
  história clínica, exame físico, evolução, diagnóstico, conduta, receita (medicamentos e
  orientações), solicitação de exames e observações.
- Receita em PDF com o receituário personalizado da médica (ver abaixo).
- Prontuário do paciente em uma única tela, com o histórico em formato de timeline.
- Edição e exclusão de pacientes, clínicas e atendimentos.

## Receituário em PDF

Na **Nova evolução** (ou ao editar um atendimento), a seção **Receita** recebe os
medicamentos um a um: medicamento e concentração, via, quantidade e modo de usar. Embaixo vão
as orientações. **Gerar receita em PDF** monta o arquivo com o que está na tela, mesmo antes de
salvar. Depois de salvo, o botão **Receita** no histórico do paciente gera o mesmo PDF.

O PDF traz:

- **Cabeçalho:** logomarca (ou monograma com as iniciais), nome, linha de apresentação, CRM e
  RQE, cidade e data.
- **Paciente:** nome e idade.
- **Medicamentos:** numerados e agrupados por via (Uso oral, Uso vaginal...), com a quantidade
  alinhada à direita e o modo de usar embaixo.
- **Orientações** e área de **assinatura e carimbo**.
- **Rodapé em todas as páginas:** dados da clínica do atendimento (nome, endereço, cidade,
  telefone, CNPJ) ou o endereço do consultório, contatos da médica e a mensagem personalizada.
- Mais de uma página quando precisa, sem partir um medicamento ao meio, com "Página 1 de 2".

Em **Configurações → Receituário personalizado** a médica escolhe logomarca, linha de
apresentação, RQE, e-mail, Instagram, site, endereço do consultório, mensagem do rodapé, a cor
dos detalhes (6 opções, todas com contraste de pelo menos 5,5:1 no papel) e o papel (A4 ou A5).
**Ver modelo da receita** mostra o resultado antes de salvar. A logomarca é convertida em PNG,
aparada e reduzida no navegador e guardada no próprio perfil.

O PDF é gerado no navegador (`@react-pdf/renderer`, com Cormorant Garamond e Inter embutidas) e
não sai do aparelho. A biblioteca só é baixada na primeira receita. A assinatura é feita à mão
depois de imprimir: o app não aplica assinatura digital ICP-Brasil nem gera receitas de controle
especial (notificações amarela e azul, receita branca em duas vias).

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | Landing pública |
| `/entrar`, `/cadastro`, `/recuperar-senha` | Acesso (mesma composição, alterna entre os modos) |
| `/redefinir-senha` | Destino do link de redefinição enviado por e-mail |
| `/inicio` | Painel (área autenticada) |
| `/pacientes`, `/pacientes/:id` | Pacientes e prontuário |
| `/atendimentos`, `/atendimentos/novo`, `/atendimentos/:id/editar` | Atendimentos |
| `/clinicas`, `/configuracoes` | Clínicas e perfil |

`/login` redireciona para `/entrar`.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS, com as cores vindas de tokens CSS
- React Router
- Supabase (Postgres, Auth e Row Level Security)
- Lucide Icons

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencha com as credenciais do seu projeto Supabase
npm run dev
```

O app sobe em `http://localhost:5173`. Sem o `.env`, a landing abre normalmente e as demais
telas mostram as instruções de configuração.

## Configuração do Supabase

O banco do piloto já está criado no projeto **aurelia**
(`fybdlgbyxzfuzmhhrexp`), com as migrações 0001 e 0002 aplicadas.

> **Pendente no piloto:** aplicar `supabase/migrations/0003_receituario.sql` (SQL Editor →
> colar o arquivo → Run). Ela só acrescenta colunas opcionais. Sem ela, salvar o perfil, a
> clínica ou um atendimento mostra o aviso "O banco ainda não tem os campos do receituário".

Para recriar o banco do zero em outro projeto:

1. Crie um projeto no [Supabase](https://supabase.com).
2. No **SQL Editor**, execute na ordem os arquivos de `supabase/migrations/`:
   - `0001_prontuario_init.sql` — tabelas `doctors`, `clinics`, `patients` e `encounters`,
     índices, gatilhos de `updated_at`, criação automática do perfil do médico no cadastro
     e políticas de Row Level Security.
   - `0002_endurece_funcoes_e_indices.sql` — fixa o `search_path` das funções, remove o
     acesso público às funções de gatilho e indexa a chave estrangeira de clínica.
   - `0003_receituario.sql` — campos do receituário no perfil (`doctors`), cidade e CNPJ da
     clínica e a lista de medicamentos do atendimento (`encounters.prescricao_itens`).
3. Em **Project Settings → API**, copie a **Project URL** e a **anon/publishable key**.
4. Preencha o `.env`:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

### Autenticação: ajustes necessários no painel

- **Authentication → URL Configuration → Redirect URLs**: inclua
  `https://SEU-DOMINIO/redefinir-senha` e `https://SEU-DOMINIO/inicio` (e as versões
  `http://localhost:5173/...` para desenvolvimento). Sem isso, os links de redefinição de
  senha e de confirmação de e-mail voltam para a URL padrão do projeto.
- **Authentication → Providers → Email → Minimum password length**: use **8**, o mesmo
  mínimo que o app exige no cadastro e na redefinição.
- **Confirm email**: por padrão o Supabase exige confirmação de e-mail no cadastro. A tela de
  cadastro já mostra o estado "Confirme seu e-mail", com reenvio limitado a um a cada 60 s.
- **Rate limits** (Authentication → Rate Limits): o Supabase limita tentativas de login e
  envios de e-mail no servidor. O app traduz essas respostas ("aguarde N segundos").

As mensagens de erro não revelam se um e-mail tem conta: a recuperação de senha sempre
responde "se houver uma conta com este e-mail, o link já está a caminho", e o cadastro de um
e-mail já existente recebe uma mensagem neutra. Nenhum provedor social (SSO) está ativo.

A sessão é gerenciada pelo `supabase-js` (token de acesso e de renovação no armazenamento do
navegador, padrão para aplicações SPA). Senhas nunca são guardadas pelo app.

### Segurança dos dados

Todas as tabelas usam Row Level Security: cada médica só enxerga e altera os próprios
pacientes, clínicas e atendimentos (`doctor_id = auth.uid()`). Nenhum dado é compartilhado
entre contas.

## Deploy no Netlify

O `netlify.toml` já está configurado:

- Build: `npm run build`
- Publicação: `dist`
- Redirect SPA: `/*` → `/index.html`

No painel do Netlify, em **Site configuration → Environment variables**, defina
`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

> **Importante:** variáveis `VITE_*` são embutidas no JavaScript durante o build, não lidas
> quando a página abre. Cadastrá-las não afeta um site já publicado — é preciso publicar de
> novo em **Deploys → Trigger deploy → Clear cache and deploy site**.

O `netlify.toml` também define `SECRETS_SCAN_OMIT_KEYS` para as duas variáveis. Sem isso, o
detector de segredos do Netlify encontra a chave publicável dentro do JavaScript gerado e
falha o deploy. A chave é pública por natureza — como manda a documentação do Supabase, ela
vai no frontend, e a proteção dos dados vem do Row Level Security.

## Estrutura

```
src/
  styles/           design-tokens.css — fonte única das cores e da geometria
  components/       Layout (sidebar, header, dock), logo, busca, timeline, diálogos
    ui/             Componentes reutilizáveis (Button, IconButton, Field, Card, Modal,
                    Menu, SegmentedControl, Breadcrumbs, Badge, estados)
  context/          Autenticação e notificações (toast)
  forms/            Formulários de paciente e clínica (modais)
  lib/              Cliente Supabase, navegação, tipos, acesso a dados e formatação
  pages/            Landing, acesso e telas do sistema
scripts/qa/         Testes de responsividade e teclado em navegador real
supabase/
  migrations/       Script SQL de criação do banco
```

## Identidade visual

A fonte de verdade é `src/styles/design-tokens.css`. O Tailwind só aponta para esses tokens
(`tailwind.config.js`); nenhum componente define cor própria.

- **Paleta:** Burgundy (Vinho editorial). Primária `#881337` (hover `#75102f`, pressionado
  `#660e29`), fundo `#fff7f8`, superfícies `#ffffff`, texto `#4c0519`, bordas `#e6d5d9`.
  Estados semânticos: sucesso `#15803d`, aviso `#a16207`, erro `#b91c1c`, informação `#0369a1`.
- **Tipografia:** Cormorant Garamond nos títulos (refinada, editorial) e Inter no texto e na
  interface. Campos usam 16 px para evitar o zoom automático do iOS.
- **Layout desktop:** Sidebar flutuante compacta (224 px), afastada do topo e da borda,
  com header flutuante de 64 px e espaçamento de 16 px. Pode ser recolhida para o rail.
- **Tablet (768–1023 px):** a mesma topologia, com o rail de ícones e rótulos.
- **Celular (< 768 px):** Dock flutuante na base, com Início, Pacientes, Novo atendimento,
  Consultas e Clínicas. Configurações e Sair ficam no menu da conta, no topo. O dock
  respeita a safe area e some enquanto o teclado virtual está aberto.
- **Componentes:** botões e botões de ícone Soft Pill; header e cards Dark Luxury (cantos de
  17 px, borda fina, sombra profunda); sidebar e menus Soft Neumorphic; KPIs e passos Swiss
  Minimal (cantos de 6 px, borda de 1 px); segmented controls e breadcrumbs Soft Pill;
  diálogos com a geometria dos Drawers (bottom sheet no celular). As famílias definem forma e
  estrutura; as cores vêm sempre da paleta global (por isso o header Dark Luxury é claro, e não
  grafite). Halos e gradientes da família Aurora ficam para a fase de acabamento visual.
- **Páginas de entrada:** landing imersiva (composição "Pixel Arcade" adaptada: hero em
  vinho de borda a borda e um coração em pixels como símbolo de cuidado) e acesso "Clássico
  central" com cadastro na mesma tela. Acabamento plano: sem sombras, gradientes ou
  transparências.
- **Espaçamento:** escala de 4/8/12/16/20/24/32 px; pelo menos 8 px entre controles e alvos
  de toque de 44×44 px.
- Datas no padrão brasileiro (DD/MM/AAAA) e horários em 24 h.

### Exceções de acessibilidade (aguardando aprovação)

Duas cores derivadas foram adicionadas para cumprir o WCAG 2.2 AA. Estão no bloco 2 de
`design-tokens.css` e podem ser revistas:

| Uso | Token aprovado | Problema | Solução aplicada |
| --- | --- | --- | --- |
| Texto secundário | `textMuted` `#a27984` | 3,75:1 no branco (exige 4,5:1) | `--text-secondary` `#835866` (5,91:1 no branco, 4,75:1 no `primarySoft`) |
| Borda de campos | `border` `#e6d5d9` | 1,41:1 (exige 3:1 para limites de controles) | campos usam o token `icon` `#a27984` (3,75:1) |

O `textMuted` original continua em ícones, texto grande e estados desabilitados. Verde e
âmbar não atingem 4,5:1 sobre os próprios fundos suaves; nesses selos o texto usa a cor de
leitura e a cor semântica fica no ícone.

## Testes de responsividade e teclado

Os testes rodam o app de verdade no Chromium (Playwright), com o Supabase **simulado**: as
chamadas de rede são interceptadas e respondidas com dados fictícios (`scripts/qa/mock-supabase.cjs`).
Nenhum dado real é lido ou gravado.

```bash
npm run qa:build                 # build apontando para o Supabase simulado (.env.qa)
npm run qa:responsive            # mede todas as telas em 21 tamanhos de tela
node scripts/qa/keyboard.cjs     # navegação por Tab, Escape e prisão de foco
npm run qa:receita               # gera e baixa receitas reais pelo app (perfil, prontuário, editor)
```

Requer Playwright com Chromium (`npm i -D playwright && npx playwright install chromium`).
O relatório mais recente está em [`docs/qa/responsividade.md`](docs/qa/responsividade.md).
