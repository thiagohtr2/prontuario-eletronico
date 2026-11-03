# NOTES: ambiguidades, lacunas e contradições do PROMPT.md

Cada item cita o trecho do `PROMPT.md` e a decisão tomada. Onde a especificação dá duas opções aprovadas, escolhi a que preserva a geometria declarada e a consistência com o restante.

## Fluxo, cadastro e marca

1. **Entrada e dashboard.** `B. Arquitetura geral`: "Fluxo de entrada: **Apenas login** — O endereço abre direto na tela de entrar. Sem página de apresentação." e `A.`: "Funcionalidades previstas: … Dashboard financeiro". Decisão: `#/login` é a entrada; após o login (demonstração), o usuário cai no painel. Não há landing.

2. **Cadastro.** `B.`: "Cadastro: nenhum", mas `Pendências`: "Escolha um fluxo de cadastro (ou confirme que não haverá cadastro)". Decisão: sem cadastro, como declarado em `B.`. Não há link "Criar conta" nem rota de cadastro.

3. **Marca da prévia.** `C. Header`: "marca fictícia “Seriema” na prévia — substitua pela marca real". A marca real é o nome do produto em `A.` ("Nexo Capital"). Decisão: "Nexo Capital" em todo lugar; "Seriema" não aparece.

4. **Logotipo da organização.** `Login`: "logotipo da organização à esquerda", mas nenhum arquivo ou símbolo foi entregue. Decisão: quadrado de 28 px na cor primária com a letra "N" e o texto "Nexo Capital". Substituível por um SVG.

5. **Dois textos para a mesma coisa (dashboard e tabelas).** `Pendências` e `E.`: os nomes "Tabelas de dados", "Gráficos" e "Dashboard financeiro" são nomes dados pelo usuário. Decisão: usados como títulos de seções e cartões.

## Shell (sidebar, header, drawer)

6. **Duas sidebars aprovadas.** `B. sidebar-integral-classica`: 252 px, itens de 40 a 44 px, rodapé com perfil e configurações. `C. sobria-corporativa`: 264 px, itens de 36 px, superfície `bgAlt`, composição A ou B. Decisão:
   - largura de 252 px, porque `gridColumns: 252px 1fr` é explícito;
   - itens de 40 px no desktop e 48 px no drawer (ambos dentro de 40–44 px, com o mínimo de 44 px no celular);
   - grupos, itens e rótulos da sobria (Gestão, Pessoas, Administração);
   - superfície `navBg`, não `bgAlt`, porque as duas specs listam `navBg`/`navText`/`navActive` como tokens da navegação;
   - composição: logo no topo (alinhado a 64 px), seletor de unidade ("Unidade no topo" da sobria) e perfil com cargo no rodapé com menu ⋯ (composição B), mais atalho de configurações.

7. **Cabeçalho: 64 px ou 56 px, e full width ou só a coluna principal.** `B.`: "Header de ≈64 px … O header fica somente sobre a coluna principal". `C. Painel Analítico`: "altura … 56 px, largura total da janela (full width)" e logo dentro do header. Decisão: header de 64 px sobre a coluna principal. O logo fica só na sidebar (evita dois logos). As abas do Painel Analítico ficam dentro desse header de 64 px, encaixadas na base. Período e "Exportar" ficam no cabeçalho da página, que `E. Dashboard` lista em "Cabeçalho da página (título, período, ações)".

8. **Navegação mobile.** `D. Drawer` e `B. Layout mobile` pedem drawer pela esquerda. `C. Painel Analítico` pede um painel de menu que desce abaixo do header, com os 4 itens. Decisão: drawer. Os 4 itens analíticos aparecem no drawer, no grupo "Painel analítico". A topbar mantém ☰, logo, título e avatar.

9. **Ponto de quebra tablet.** `B. Relação`: "Entre 600 e 1023 px (tablet), use a estrutura desktop compactada quando couber". `B.` e `C.`: "Abaixo de 768 px … mobile". Decisão: 768 px é o limite. De 768 a 1023 px vale o rail de 72 px (overlay ao expandir). Abaixo de 768 px vale o drawer, inclusive entre 600 e 767 px.

10. **Rail e menus do tablet.** `B.` pede rail de 72 px com tooltip e aria-label. Como o rail tem `overflow` cortado, o tooltip foi feito com CSS `position:absolute` sobre a área de conteúdo. As abas do Painel Analítico, que `C.` quer em "☰", viram o botão "Seções" com menu suspenso (só de 768 a 1023 px).

11. **Rolagem.** `B.`: "A página rola apenas na coluna de conteúdo" e "o header é sticky". Decisão: no desktop a coluna de conteúdo rola dentro do shell (o cabeçalho fica fixo sem `position: sticky`). No celular, a página rola inteira e a topbar é `sticky`.

12. **Sombra do header.** `C.`: "Após 8 px de rolagem ganha sombra suave". Essa sombra é a única decoração de superfície de conteúdo permitida, porque a especificação a pede explicitamente. Aplicada ao cabeçalho e à topbar.

## Tipografia, cores e geometria

13. **Tamanhos de texto.** `D. Tipografia`: texto base de 15 px. `E.` (Compact Pro): base de 13 px. `C.`: "Nunca use textos menores que 12 px; filtros e botões com pelo menos 14 px". Decisão: login com 15 px; painel com 13 px no texto de tabelas e gráficos; rótulos de 12 px; botões, filtros, itens de menu e de navegação com 14 px.

14. **Raios.** `D. Geometria`: "Médios (8 px)". `E.`: "Raio de 4 px em controles e 6 px em contêineres". Decisão: tela de acesso com cartão de 8 px e campos de 6 px; painel com controles de 4 px, cartões de 6 px e badges de 4 px. Nos itens de navegação, 6 px.

15. **Anel de foco.** `C.` diz anel de 2 px; `E.` diz anel de 3 px a 35%. Decisão: `outline` de 2 px na cor `focusRing` mais um halo de 3 px com 35% de opacidade. Na sidebar escura, o azul `focusRing` (#1d4ed8) tem pouco contraste sobre `navBg`; por isso o anel usa um espaço `navBg` e depois `navActiveText` (branco).

16. **Indicador do item ativo.** `C.` (sobria): barra de 3 px "na cor primária". Sobre `navActive` (#313e66) a cor primária (#1d4ed8) tem contraste muito baixo. Decisão: barra de 3 px na cor de destaque global `accent` (#0ea5e9).

17. **Cor "Destaque" do gráfico.** `E. Gráficos`: "Destaque: #0c91cd" (exceção listada). `D.`: `accent` = #0ea5e9. Decisão: série 2 com #0c91cd, a exceção listada no componente.

18. **Contraste de textos semânticos.** `D.` dá `error` #dc2626 sobre `errorBg` #fbe5e5 (cerca de 4,1:1, abaixo de AA para texto normal), e `info` #2563eb sobre `infoBg` (cerca de 4,1:1). Decisão: textos sobre fundos semânticos usam tons mais escuros que o token, adicionados como `--error-text` (#b91c1c), `--info-text` (#1e40af) e `--success-text` (#0f6a30). Cores de fundo e ícones seguem os tokens.

19. **Gradientes e decoração.** `D.` lista `gradientFrom` e `gradientTo`, mas `G.`: "Não adicione decoração … gradientes". Decisão: gradientes não usados.

20. **Modo escuro.** Não especificado. Decisão: só tema claro, conforme a paleta aprovada.

21. **Ícones.** `E.`: "lucide, traço 1.75 px". `D.`: "Ícones no estilo contorno". Decisão: SVG inline em estilo lucide com traço de 1,75 px, sem CDN. A aplicação funciona offline (exceto a fonte Inter, que vem do Google Fonts e cai para `system-ui` se faltar).

## Dashboard e tabelas

22. **Quantidade de KPIs.** `E. Dashboard`: "Quantidade de KPIs: 3", mas `Responsividade`: "KPIs 4 → 2 → 1 colunas". Decisão: três KPIs, com 1 coluna no celular, 2 nos tablets e notebooks (o terceiro ocupa a linha inteira) e 3 colunas a partir de 1280 px, onde cabem com 280 px mínimos.

23. **Gráfico 2/3 e atividades 1/3.** `E.`: "gráfico (2/3) + atividades (1/3)". Em 1024–1279 px, 1/3 de uma área de ~756 px dá menos de 280 px, violando `C.`: "nenhum cartão encolhe abaixo de ≈280 px". Decisão: lado a lado só a partir de 1280 px; abaixo disso, empilhado.

24. **Tabela "Pedidos recentes".** `E. Dashboard` lista só KPIs, gráfico e atividades. A tabela é um componente próprio (`E. Tabelas`). Decisão: incluí-la no painel, abaixo da linha de gráfico e atividades, para cobrir "Tabelas de dados" (funcionalidade listada em `A.`). Foi uma adição, não uma especificação de layout.

25. **Linhas de exemplo.** `E. Tabelas`: "Linhas de exemplo: 4". Decisão: a tabela começa com 4 linhas em 30 dias. O conjunto tem 6 pedidos, e o filtro de período muda o número de linhas (7 dias: 3; 90 dias: 6).

26. **Responsividade da tabela.** `F.`: "rolagem horizontal local … ou representação em cartões". Decisão: abaixo de 640 px, cada linha vira um cartão com rótulos (`data-label`). Sem rolagem horizontal. Acima de 640 px: tabela com cabeçalho destacado e rolagem local se precisar.

27. **Período de filtro.** `E.`: "Filtro de período atualiza todos os blocos", sem opções definidas. Decisão: "Últimos 7 dias", "Últimos 30 dias" (padrão, pelo mockup do Painel Analítico) e "Últimos 90 dias". Linhas e atividades são filtradas pela data; KPIs de volume e gráficos de volume escalam pelo fator do período; taxas não escalam.

28. **Estados de carregamento, vazio e erro.** `G.`: "Implemente estados de carregamento, vazio e erro". Decisão: cada bloco do painel mostra skeleton antes do conteúdo. Vazio: página Fornecedores, sem registros. Erro: página Auditoria falha na primeira carga, com "Tentar novamente" (role="alert"). Vazio com filtro: "Nenhum resultado para …".

29. **Gráfico acessível.** `E. Gráficos`: "Tabela alternativa ou aria-label descritivo". Decisão: os dois. O SVG tem `role="img"` com aria-label, e uma tabela oculta visualmente com os valores. As barras são focáveis e mostram o tooltip também com teclado.

30. **Ações da tabela.** `E.`: "Ações por linha: sim", "Seleção com checkbox: sim", "ordenação … com aria-sort". Implementado: checkbox por linha e no cabeçalho (indeterminado), ordenação em 2 cliques com `aria-sort`, menu de ações por linha com Esc e devolução de foco.

31. **Ações simuladas.** Exportar, Novo registro, Configurações, Preferências e Ajuda mostram um aviso ("demonstração"). Nada é gravado.

## Login e recuperação

32. **Credenciais da demonstração.** Nenhuma credencial é especificada. Decisão: conta fixa `demo@nexo.example` / `Demo@2026`, documentada no README. Erros usam a mensagem genérica "E-mail ou senha incorretos", e os dois campos recebem `aria-invalid` (sem revelar qual está errado).

33. **Autenticação real (conflito com a tarefa).** `Observações`: "A autenticação real deve ser implementada pela IA com backend seguro: senhas com hash (Argon2id ou bcrypt), limitação de tentativas, sessão em cookie httpOnly + Secure + SameSite, proteção CSRF e HTTPS obrigatório." A tarefa diz: "sem backend: dados fictícios no próprio front-end". Decisão: seguir a tarefa. Nada disso foi implementado, e a limitação de tentativas não é simulada. A sessão de demonstração fica em `sessionStorage` (por aba). Isso precisa ser implementado no backend antes de produção.

34. **SSO.** `Observações`: SSO real exige SAML 2.0 ou OpenID Connect. Decisão: o botão "Entrar com SSO da empresa" simula o redirecionamento (800 ms) e entra na demonstração. Não há integração com provedor.

35. **Recuperação de senha.** `Login`: "levando ao fluxo de recuperação por e-mail com mensagem neutra". O fluxo não é detalhado. Decisão: uma tela com e-mail, botão "Enviar link" e a mensagem neutra "Se o e-mail existir, enviaremos um link." Nenhum e-mail é enviado. Há o link "Voltar para entrar".

36. **Posição de "Esqueci minha senha".** `Login`: "perto do campo de senha". Decisão: à direita do rótulo "Senha", na mesma linha.

37. **Validação.** `Login`: "Validação ao enviar e ao sair do campo". Decisão: campos obrigatórios e e-mail válido são validados ao sair do campo e ao enviar. O resumo no topo do formulário é `role="alert"` e lista "Corrija os campos destacados para continuar.". A senha é limpa após erro de credenciais.

38. **Teclado virtual.** `Login`: "use 100dvh, sem height: 100vh fixo, e scroll-padding". Implementado com `min-height: 100dvh` e `scroll-padding-top`. Não foi testado com teclado virtual real (o Playwright não simula).

39. **Carregamento do botão de envio.** `Login`: "Botão principal com estado de carregamento ("Entrando…") e desabilitado durante o envio". Implementado com `aria-busy`. O botão SSO também fica desabilitado durante o envio.

40. **Mostrar e ocultar senha.** `Login`: botão dentro do campo, com `aria-label` alternando e `aria-pressed`. Decisão: 36 px no desktop e 44 px no celular, para atender ao alvo mínimo de toque.

41. **Formatação.** Não especificado. Decisão: moeda em reais (R$) e datas em dd/mm/aaaa, pt-BR.

42. **Estado dos grupos da sidebar.** `C.`: "Grupos … lembram o estado". Decisão: estado de cada grupo (aberto ou fechado) salvo em `localStorage`, com `try/catch`.

## Pendências não resolvidas

- Cadastro: não implementado (decisão 2).
- Autenticação real com backend e rate limit: fora do escopo desta entrega (decisão 33).
- Teste com teclado virtual de celular real e leitores de tela reais: não executado; a verificação foi feita com Playwright e pelos atributos ARIA.
