# Prompt — Cadastro: Página própria de cadastro

> Gerado pelo Atelier UI para o projeto “Atlas Workspace” (Aplicativo ou SaaS). Este prompt é autossuficiente: implemente somente este elemento, exatamente como descrito.

## Cadastro: Página própria de cadastro — pagina-propria

`id: pagina-propria` · origem: módulo “cadastro”

Cadastro em página dedicada com nome, e-mail, senha, confirmação de senha, aceite dos termos e link de volta para o login.

**Estrutura**
- Página própria (rota /cadastro) com a mesma composição visual do login.
- Título “Crie sua conta”, subtítulo curto e campos em uma coluna.
- Checkbox obrigatório de aceite dos termos com links para Termos e Privacidade.
- Rodapé do formulário: “Já tem conta? Entrar”.
- Campos, na ordem: Nome completo, E-mail, Senha, Confirmar senha, Aceite dos termos.

**Propriedades**
- campos: Nome completo, E-mail, Senha, Confirmar senha, Aceite dos termos

**Medidas recomendadas (adaptáveis)**
- alturaInputs: ≈44 px (desktop) / 48 px (celular)
- espacoEntreCampos: ≈16 px

**Comportamento e estados**
- Validação ao sair de cada campo; “Confirmar senha” mostra erro “As senhas não coincidem” em tempo real após o primeiro envio.
- Indicador de força da senha (fraca/média/forte) com texto, não só cor.
- Botões mostrar/ocultar independentes nos dois campos de senha.
- Se o e-mail já existir, a mensagem é neutra e oferece “Entrar” ou “Recuperar senha”.
- Autocomplete: name, email, new-password (nos dois campos de senha).
- Estados de erro por campo, com mensagem clara abaixo do campo e resumo no topo em caso de envio inválido.
- Validação ao sair do campo e no envio; nunca apague o que a pessoa digitou.
- Botão para mostrar/ocultar senha e indicação dos requisitos de senha.
- Link de recuperação de senha visível na tela de login.
- Labels acessíveis (label for/id), autocomplete adequado (name, email, new-password, current-password, one-time-code).

**Responsividade deste item**
- No celular, uma coluna com 20 px de margem; o checkbox de termos tem área de toque de 44 px.
- O formulário rola normalmente com o teclado aberto; o campo focado fica visível (scroll-margin ≈ 96 px).
- Funciona a partir de 320 px sem rolagem horizontal.
- Layout adaptado ao teclado virtual: o campo focado e o botão de envio permanecem visíveis.
- Funciona em telas a partir de 320 px, com uma coluna no celular.
- Formulários: uma coluna no celular, labels sempre visíveis, botão de envio acessível com o teclado virtual aberto (role o campo focado para a área visível).

**Observações**
- Demonstração de interface: a criação de conta real deve ser feita pela IA com backend seguro — hash de senha (Argon2id/bcrypt), verificação de e-mail, limitação de tentativas, proteção contra bots (sem expor se um e-mail já existe), sessão em cookie httpOnly/Secure/SameSite e HTTPS.

## Identidade herdada
- Paleta “Neutro Essencial” (clara): primária #18181b (texto #ffffff), secundária #52525b, destaque #2563eb.
- Fundo #ffffff, superfície #ffffff, texto #18181b, texto secundário #707072, borda #e6e6e6.
- Estados: hover #f4f4f4, active #ebebeb, selected #e3e3e4/#18181b, disabled #f0f0f0/#979798, foco #18181b.
- Semânticos: success #117e39, warning #a85c04, error #dc2626, info #2563eb.
- Tipografia: títulos Inter 650, textos Inter 400, base 15 px.
- Geometria: cantos “medium”, borda 1 px, sombra “none”, superfícies “outlined”, densidade “comfortable”.

## Responsividade obrigatória
Valide em 320, 344, 360, 375, 390, 412, 430, 480, 600, 768, 820, 1024, 1280, 1440, 1920 px.
- Nenhum overflow horizontal involuntário em nenhuma largura de 320 px a 1920 px (inclusive larguras intermediárias).
- Nenhum texto cortado: use quebra de linha, `min-width: 0` em itens flex/grid e `overflow-wrap: anywhere` em conteúdos longos (e-mails, URLs, códigos).
- Nenhuma sobreposição indevida entre elementos, inclusive com o teclado virtual aberto.
- Alvos de toque com no mínimo 44 × 44 px no celular e espaçamento de pelo menos 8 px entre alvos adjacentes.
- Campos de formulário com fonte de pelo menos 16 px no celular (evita zoom automático no iOS).
- Imagens e mídias responsivas (`max-width: 100%`, `aspect-ratio` definido) sem distorção.
- Grids adaptáveis: reduza colunas progressivamente; nunca comprima cartões abaixo de uma largura legível.
- Suporte a zoom de até 200% e a fonte ampliada do sistema sem perda de conteúdo ou funcionalidade.
- Respeite as safe areas (`env(safe-area-inset-*)`) em barras fixas, docks e menus inferiores.
- Funcione na orientação horizontal do celular: barras fixas não podem ocupar mais de 25% da altura.
- Use `100dvh` (com fallback) em vez de `100vh` para alturas de tela cheia.
- Menus acessíveis por mouse, toque e teclado (Tab, Enter, Espaço, Esc), com foco visível.
- Respeite `prefers-reduced-motion` reduzindo animações.

## Regras de implementação
- Não modifique escolhas aprovadas nesta especificação sem solicitação explícita do usuário.
- Preserve a identidade global: todos os componentes usam os tokens definidos; exceções só onde estiverem listadas.
- Não adicione decoração por conta própria (sombras, gradientes, vidro, animações, cantos arredondados) além do especificado.
- Respeite a geometria escolhida: se a sidebar é integral, ela vai do topo à base; se é flutuante, tem afastamento das bordas. Não converta uma na outra.
- Evite overflow e colisões; valide em todas as larguras de referência.
- Mantenha consistência de espaçamentos (escala de 4 px), tipografia e estados de interação (hover, focus-visible, active, disabled, selected).
- Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários.
- Use componentes reutilizáveis e tokens centralizados (variáveis CSS ou tema); nada de cores fixas espalhadas pelo código.
- Garanta acessibilidade: HTML semântico, labels, contraste WCAG AA, navegação por teclado e leitores de tela.
- Teste o resultado (visual e funcional) em celular, tablet e desktop antes de concluir.
