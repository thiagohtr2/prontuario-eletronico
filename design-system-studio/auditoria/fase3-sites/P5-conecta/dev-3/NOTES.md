# NOTES: ambiguidades, lacunas e contradições do PROMPT.md

Cada item cita o trecho do PROMPT.md e a decisão tomada. Onde a decisão é fácil de trocar, o ponto de ajuste está indicado.

## 1. Marca

- **Trecho:** seção C, "Logo: ... marca fictícia “Quero-quero” na prévia — substitua pela marca real". Seção A: "Nome: Conecta".
- **Lacuna:** a prévia usa "Quero-quero", mas a marca real não foi informada.
- **Decisão:** usei "Conecta" (nome do projeto) com monograma "C". Troque em `index.html` (classes `.marca__nome` e `.monograma`).

## 2. Destinos de navegação diferentes entre desktop e celular

- **Trecho:** seção C (Praça), itens "Feed, Grupos, Eventos, Mensagens". Seção E (componente "Menu inferior flutuante"), itens "Início | Explorar | Salvos | Perfil". Seção B, "As regiões ... mantêm ... os mesmos destinos de navegação nas duas versões".
- **Contradição:** o texto pede os mesmos destinos nas duas versões, mas as listas aprovadas são diferentes.
- **Decisão:** mantive as listas de cada componente, porque são as escolhas aprovadas explicitamente. Desktop: Feed, Grupos, Eventos, Mensagens. Dock: Início (aponta para o feed), Explorar, Salvos, Perfil.
- **Complemento:** no celular, Grupos, Eventos e Mensagens ficam no drawer, para não ficarem inacessíveis. O drawer também tem Notificações, Configurações, Ajuda e Conta.

## 3. Menu do celular: painel ou drawer

- **Trecho:** seção C, "Vão para o painel do menu: os 4 itens de navegação". Seção C, Exceções: "o botão de menu (☰) ... abre o drawer lateral esquerdo — não usar o painel de menu em largura total". Seção B, "Divisão clara: destinos frequentes no dock; configurações, ajuda e conta no drawer".
- **Decisão:** a Exceção do próprio usuário prevalece. O ☰ do celular abre o drawer. O painel de largura total só existe entre 768 e 1023 px, como pede a seção C.

## 4. Altura do header desktop

- **Trecho:** seção C, "Barra principal com 60 px de altura". Seção B, "grid-template-rows: 64px minmax(0, 1fr)" e "header: ≈64 px".
- **Decisão:** 64 px, para bater com a linha da grade. Ajuste em `.barra` (`css/app.css`).

## 5. Tipografia: Inter ou fonte do sistema

- **Trecho:** seção D, "Tipografia: Inter + Inter": títulos 650, texto 400, base 15 px. Componentes (E): "Fonte de títulos: Fonte do sistema 500", "Fonte de texto: Fonte do sistema", "Tamanho base: 14 px".
- **Contradição:** Inter ou fonte do sistema, e 15 ou 14 px de base.
- **Decisão:** a pilha começa em Inter, com fallback para a fonte do sistema. Títulos de página usam 650 (identidade). Títulos de card, perfil e drawer usam 500 (componente). Textos dentro dos componentes usam 14 px; o restante usa 15 px. Inter é carregada do Google Fonts (o único recurso externo; sem rede, cai na fonte do sistema).

## 6. Bordas e sombras

- **Trecho:** seção D, identidade "superfícies contornada (bordas finas)", "Sem sombras em superfícies de conteúdo". Componentes: "Borda: sem borda", "Sombra: elevação tonal (Material)", "Superfície: tingida pela primária (4–10%)".
- **Decisão:** cards, perfil e drawer ficam sem borda, sobre a superfície `#fef8fa` (token de superfície do componente), sem sombra. Sombra só em elementos flutuantes (dock, popovers, modal), como a seção G permite. Demais áreas usam borda de 1 px.

## 7. Campos: contornados ou preenchidos

- **Trecho:** componentes Modern Material: "Campos preenchidos (fundo tonal, cantos superiores de 4 px, linha inferior de 1–2 px)". Identidade: superfície contornada.
- **Decisão:** login e cadastro usam campos contornados, porque são telas da seção B e não o componente Modern Material. O formulário "Editar perfil" (parte do componente Perfil) usa campos preenchidos.

## 8. Stories

- **Trecho:** seção B (Layout mobile), "Faixa de stories de ≈88 px". Seção A, "Header superior com stories". Não há faixa de stories no layout desktop.
- **Decisão:** stories só no celular. No desktop não aparecem. A faixa fica dentro do header fixo do celular, junto com a topbar (cerca de 144 px de altura fixa). Em paisagem as stories são recolhidas.
- **Gradiente:** o anel dos stories e a capa do perfil usam os tokens `gradientFrom`/`gradientTo`. Entendi que o gradiente faz parte da paleta e não é decoração extra.

## 9. FAB e ação de criar

- **Trecho:** seção E, componentes, "ações flutuantes (FAB) para a tarefa principal". Seção B (Exceções do dock): "Sem botão flutuante (FAB)".
- **Decisão:** sem FAB. No desktop, "+ Novo" abre um modal de nova publicação, que adiciona o texto ao feed em memória. No celular não há ação de criar publicação, o que é uma lacuna do próprio PROMPT.md.

## 10. Cards do feed

- **Trecho:** seção E, componente "Card de conteúdo do feed": "Título: Publicação da comunidade", "Texto: Foto ou texto compartilhado por um perfil que você segue.", "Etiqueta: Novo".
- **Decisão:** título, texto e etiqueta aparecem iguais em todos os cards, como as propriedades aprovadas. Variam apenas autor, horário e ilustração. O ícone Plane fica num círculo tonal no rodapé. O cartão inteiro é clicável por link estendido, sem botões aninhados.
- **Imagens:** o PROMPT não traz imagens. Usei ilustrações SVG próprias, com as cores dos tokens, sem arquivos externos.

## 11. Ação "Salvos"

- **Lacuna:** "Salvos" é um destino do dock, mas o PROMPT não define a ação de salvar.
- **Decisão:** a tela existe e mostra o estado vazio, com link para o início. Não há botão de salvar nos cards.

## 12. Breakpoint 1024 a 1279 px e item "Mais"

- **Trecho:** seção C, "links excedentes vão para um item 'Mais' com menu suspenso".
- **Decisão:** a medição mostrou que os 4 itens cabem em 1024 px, com a busca em 180 px. Não criei o "Mais", porque ele nunca seria acionado. Se o conteúdo crescer, a regra precisa ser implementada.

## 13. Layout da navegação desktop

- **Trecho:** seção C, "grid 1fr auto 1fr" (composição "Ícones no centro").
- **Decisão:** em 1024 px ou mais usei `auto 1fr auto`: logo, navegação no espaço central e ações. Com `1fr auto 1fr`, a busca e o "+ Novo" invadiam a navegação. A navegação fica centralizada no espaço livre, não exatamente no centro da barra.

## 14. Paisagem do celular e limite de 25% da altura

- **Trecho:** seção F, "barras fixas não podem ocupar mais de 25% da altura" na orientação horizontal. Seção B, topbar de ≈56 px e dock de ≈52 px em paisagem.
- **Contradição:** 56 + 52 px passam de 25% em celulares de cerca de 390 px de altura.
- **Decisão:** em paisagem, a topbar cai para 48 px. Com isso, 48 + 52 = 100 px, o que equivale a 25% de uma tela de 400 px.

## 15. Login: o botão "Entrar" fixo

- **Trecho:** seção B, "No celular o botão 'Entrar' fica fixo na base, acima do teclado virtual". Cadastro: "sem position: fixed sobre o teclado".
- **Decisão:** no login, o botão fica fixo na base (`position: fixed`, deslocado pela altura do teclado calculada com `visualViewport`). No cadastro, o botão fica logo abaixo do último campo. Não testei teclado virtual real: a lógica só foi conferida na estrutura.

## 16. Campos de login: "E-mail | Telefone"

- **Trecho:** seção B, "Alternância segmentada 'E-mail | Telefone' no topo do formulário".
- **Decisão:** a alternância usa radios estilizados como controle segmentado. Ao trocar, o campo não usado fica oculto, com o valor preservado. Telefone aceita 10 ou 11 dígitos com DDD, sem máscara.

## 17. Autenticação: demonstração

- **Trecho:** seção B, "A autenticação real deve ser implementada pela IA com backend seguro: senhas com hash, limitação de tentativas, sessão em cookie httpOnly..., proteção CSRF e HTTPS obrigatório". Cadastro: "sem expor se um e-mail já existe".
- **Decisão:** não há backend, como pede a regra de trabalho. Credenciais fixas da demonstração: `demo@conecta.app` ou telefone `(11) 91234-5678`, senha `demo1234`. Mensagem genérica "E-mail ou senha incorretos." sem revelar o campo errado. Erro de formato (e-mail mal escrito) aparece no campo, o que revela só o formato.
- **Sessão:** guardada em `sessionStorage` apenas para a demonstração. Não é segurança real.
- **Dica na tela:** a linha "Demonstração: ..." sob o botão Entrar foi acrescentada para o revisor. Remova em produção.
- **Não implementado (depende do backend):** hash de senha, rate limit, cookies, CSRF, verificação real de e-mail e checagem de e-mail já existente.

## 18. Código de confirmação no cadastro

- **Trecho:** seção B, autocomplete "one-time-code"; Observações de cadastro: "verificação de e-mail".
- **Decisão:** o PROMPT não descreve o fluxo. Criei uma segunda etapa: após preencher os dados, aparece o campo "Código de confirmação" (6 dígitos). O código da demonstração é `123456`, mostrado na própria tela.

## 19. Recuperação de senha

- **Trecho:** "Esqueci minha senha" leva ao fluxo de recuperação por e-mail com mensagem neutra.
- **Decisão:** a recuperação é uma terceira visão da mesma tela (`?aba=recuperar`), e não uma página separada. A mensagem exata é "Se o e-mail existir, enviaremos um link."

## 20. Termos de uso e política de privacidade

- **Trecho:** "Texto de aceite dos termos abaixo do botão, com links."
- **Lacuna:** o texto dos documentos não foi fornecido.
- **Decisão:** os links abrem um modal com texto reservado, para o cliente preencher.

## 21. Contadores

- **Trecho:** seção C, "contador de mensagens" em Mensagens; "sino de notificações com contador".
- **Decisão:** o contador de Mensagens soma as conversas não lidas (3). O sino mostra as notificações não lidas (3). Os dois são calculados a partir dos mesmos dados fictícios.

## 22. Menu do perfil

- **Trecho:** seção C, "avatar ... abre um menu com nome e e-mail, 'Meu perfil', 'Configurações', 'Ajuda' e 'Sair'".
- **Decisão:** no celular, o menu do avatar vira bottom sheet, o que o PROMPT permite ("podem virar bottom sheet"). No desktop é um popover de 240 px.

## 23. Perfil de outras pessoas

- **Trecho:** seção E, perfil do usuário: "Botão: Seguir".
- **Decisão:** em outros perfis aparece "Seguir" (que vira "Seguindo"). No próprio perfil o botão é "Editar perfil". As abas são "Publicações" e "Sobre".

## 24. Erro, vazio e carregamento

- **Trecho:** seção G, "Implemente estados de carregamento, vazio e erro para listas, tabelas e formulários".
- **Decisão:** cada tela mostra esqueleto enquanto carrega (300 a 800 ms, simulados). O erro é simulado com `index.html?falha=feed`, que faz a primeira carga do feed falhar. Há botão "Tentar novamente". Estados vazios: salvos, busca sem resultado, notificações e conversas.

## 25. Contraste

- **Trecho:** seção G, "contraste WCAG AA".
- **Contradição:** o token `placeholder` (`#8d8d8f`) tem contraste de cerca de 3,3:1 sobre branco, abaixo de 4,5:1.
- **Decisão:** mantive o token, porque o PROMPT o define. Todos os campos têm label visível, então o placeholder não é a única pista. Os pares principais que calculei passam em AA: primária sobre branco (cerca de 4,6:1), texto secundário sobre a superfície tingida (cerca de 5,6:1), texto de seleção sobre a seleção (cerca de 4,8:1) e erro de campo sobre branco (cerca de 4,8:1). Não fiz uma auditoria completa de contraste.
- **Foco:** o anel de 3 px a 35% do PROMPT é pouco visível sozinho. Por isso acrescentei um contorno sólido de 2 px na cor `focusRing`, mantendo o halo de 35% por cima.

## 26. Modo escuro

- **Lacuna:** o PROMPT não pede modo escuro. Não implementei.

## 27. Zoom e fonte ampliada

- **Trecho:** seção F, "Suporte a zoom de até 200%".
- **Decisão:** o layout usa unidades relativas e quebra linha. Não testei o zoom de 200% com captura. Os testes cobrem larguras de 320 a 1920 px, sem rolagem horizontal.

## 28. Movimento

- **Trecho:** "Movimento: Ênfase (250 ms, easing emphasized)"; seção F, "prefers-reduced-motion".
- **Decisão:** drawer, scrim e pílula do dock usam 250 ms (ou 200 ms) com curva de desaceleração. Com `prefers-reduced-motion`, as transições caem para 0,01 ms.

## 29. Tipo do campo de busca

- **Decisão:** a busca usa `type="search"`, então o navegador mostra o botão de limpar nativo. Enter envia; Esc limpa e tira o foco.

## Testes executados

- Chromium headless via Playwright 1.63 (`tests/teste-navegador.js`).
- Sem rolagem horizontal nas 15 larguras (320 a 1920 px), na entrada e no app logado.
- 102 verificações de comportamento, todas aprovadas, sem erro de console. Cobrem login, cadastro, recuperação, drawer (foco, Esc, scrim), popovers, modal, abas, busca, perfil e estados.
- Capturas em `_testes/`.
- **Não testado:** teclado virtual real de iOS e Android, leitor de tela, zoom de 200%, e orientação paisagem em aparelho.
