/*
 * Boas práticas de layout — conteúdo da ferramenta (dados puros).
 *
 * Tarefas, dispositivos, ambientes, módulos de boas práticas (A–N) e presets. O gerador do prompt
 * (`prompt.ts`) e a tela (`LayoutGuidePage.tsx`) leem só daqui: para mudar um texto do prompt,
 * mude aqui.
 */

/* -------------------------------------------------------------------------- */
/* Tarefas                                                                     */
/* -------------------------------------------------------------------------- */

export type TaskId =
  | 'criar'
  | 'revisar'
  | 'corrigir-responsividade'
  | 'auditar-consistencia'
  | 'acessibilidade'
  | 'adaptar-celular'
  | 'adaptar-desktop'
  | 'revisao-completa'

export interface TaskDef {
  id: TaskId
  label: string
  /** Uma linha na tela, abaixo do nome. */
  hint: string
  /** O que a IA deve fazer (parágrafo de abertura da seção “Tarefa”). */
  goal: string
  /** Como conduzir o trabalho, em passos. */
  steps: string[]
  /** Em português simples, completando “A IA vai…”. */
  does: string
  /** A IA altera o código (true) ou entrega só um relatório/proposta (false). */
  changesCode: boolean
}

export const TASKS: TaskDef[] = [
  {
    id: 'criar',
    label: 'Criar um layout novo',
    hint: 'Desenhar e implementar uma página ou tela do zero.',
    goal: 'Crie o layout da página ou tela descrita, já responsivo e acessível desde o início, seguindo as boas práticas abaixo.',
    steps: [
      'Antes de escrever código, examine o projeto: componentes, tokens (cores, espaçamentos, tipografia), estilos globais e páginas parecidas que já existem.',
      'Reutilize componentes e tokens existentes; crie peças novas só quando nada existente servir, e no mesmo padrão.',
      'Comece pela menor largura selecionada e amplie (mobile-first), definindo como cada região se reorganiza.',
      'Descreva brevemente a estrutura escolhida (regiões, grid e comportamento por faixa de largura) antes ou junto com a implementação.',
    ],
    does: 'criar a página do zero, já funcionando em todas as telas marcadas',
    changesCode: true,
  },
  {
    id: 'revisar',
    label: 'Revisar um layout existente',
    hint: 'Encontrar problemas e propor melhorias, sem mudar nada antes de relatar.',
    goal: 'Revise o layout existente indicado e produza um relatório de problemas e melhorias, priorizado por gravidade.',
    steps: [
      'Examine a implementação atual (marcação, estilos e componentes) antes de opinar.',
      'Para cada problema, informe onde ocorre (arquivo/componente e largura de tela), o que acontece, a causa provável e a correção sugerida.',
      'Classifique os problemas: bloqueia o uso, prejudica o uso, ou acabamento.',
      'Só altere código se for pedido nas restrições; caso contrário, entregue o relatório e as correções propostas.',
    ],
    does: 'olhar a página e listar os problemas, sem mudar nada',
    changesCode: false,
  },
  {
    id: 'corrigir-responsividade',
    label: 'Corrigir problemas de responsividade',
    hint: 'Resolver sobreposições, cortes, rolagem lateral e quebras entre telas.',
    goal: 'Corrija os problemas de responsividade da página ou tela indicada em todas as larguras selecionadas.',
    steps: [
      'Reproduza cada problema na largura em que ele aparece antes de corrigir.',
      'Encontre a causa (largura fixa, posicionamento absoluto, conteúdo sem quebra, altura fixa, ordem de camadas…) em vez de esconder o sintoma com overflow: hidden ou corte.',
      'Corrija no ponto de origem, preferindo ajustar o componente ou o token compartilhado a criar exceções locais.',
      'Depois de cada correção, confira as outras larguras para não criar um problema novo.',
    ],
    does: 'consertar o código para a página funcionar em todas as telas marcadas',
    changesCode: true,
  },
  {
    id: 'auditar-consistencia',
    label: 'Auditar a consistência visual',
    hint: 'Espaçamentos, alinhamentos, tamanhos e estilos padronizados.',
    goal: 'Audite a consistência visual da interface: espaçamentos, alinhamentos, tipografia, cores, raios, sombras e estados dos componentes.',
    steps: [
      'Levante os valores realmente usados (espaçamentos, tamanhos de fonte, cores, raios, sombras) e compare com os tokens do projeto.',
      'Aponte valores soltos (fora da escala), componentes equivalentes com aparência diferente e alinhamentos quebrados.',
      'Proponha a unificação usando os tokens existentes; sugira tokens novos apenas quando faltar um valor necessário.',
      'Agrupe as correções por componente para facilitar a revisão.',
    ],
    does: 'comparar espaçamentos, tamanhos e cores e propor como padronizar',
    changesCode: false,
  },
  {
    id: 'acessibilidade',
    label: 'Melhorar acessibilidade e usabilidade',
    hint: 'Teclado, foco, contraste, toque, leitores de tela e zoom.',
    goal: 'Melhore a acessibilidade e a usabilidade da interface indicada, tendo como referência as WCAG 2.2 nível AA.',
    steps: [
      'Percorra a interface só com o teclado e com um leitor de tela (ou inspecione a árvore de acessibilidade) antes de alterar.',
      'Corrija primeiro o que impede o uso (sem acesso por teclado, sem nome acessível, contraste insuficiente, alvo de toque pequeno).',
      'Prefira HTML semântico a atributos ARIA; use ARIA só quando não houver elemento nativo adequado.',
      'Mantenha a aparência e o comportamento do projeto; acessibilidade não deve mudar a identidade visual.',
    ],
    does: 'consertar o que dificulta o uso: teclado, contraste, toque, leitores de tela e zoom',
    changesCode: true,
  },
  {
    id: 'adaptar-celular',
    label: 'Adaptar uma tela para celular',
    hint: 'Levar uma tela pensada para desktop a funcionar bem no celular.',
    goal: 'Adapte a tela indicada para celulares, mantendo todas as funcionalidades essenciais acessíveis e confortáveis ao toque.',
    steps: [
      'Liste o que a tela faz no desktop e decida a prioridade de cada parte no celular (nada essencial pode sumir).',
      'Reorganize colunas em fluxo vertical, transforme tabelas largas em listas/cartões ou rolagem horizontal contida, e reveja a navegação.',
      'Garanta alvos de toque adequados, campos que não ficam sob o teclado virtual e ações principais sempre alcançáveis.',
      'Confira retrato e paisagem e as áreas seguras de aparelhos com recorte na tela.',
    ],
    does: 'ajustar uma tela que hoje só fica boa no computador para funcionar bem no celular',
    changesCode: true,
  },
  {
    id: 'adaptar-desktop',
    label: 'Adaptar uma tela para desktop',
    hint: 'Aproveitar telas grandes sem esticar nem espalhar o conteúdo.',
    goal: 'Adapte a tela indicada para notebooks, desktops e monitores grandes, aproveitando o espaço sem prejudicar a leitura.',
    steps: [
      'Defina uma largura máxima para áreas de leitura e decida como o espaço extra é usado (colunas, painéis laterais, margens).',
      'Evite linhas de texto longas demais, formulários esticados e elementos espalhados longe uns dos outros.',
      'Garanta que interações de mouse (hover, menus, atalhos) tenham equivalentes por teclado.',
      'Confira também janelas estreitas no desktop (janela dividida, zoom alto), não só a tela cheia.',
    ],
    does: 'ajustar uma tela para aproveitar bem notebooks, monitores e telas grandes',
    changesCode: true,
  },
  {
    id: 'revisao-completa',
    label: 'Revisão completa do site',
    hint: 'Todas as páginas, todos os componentes, todas as larguras.',
    goal: 'Faça uma revisão completa do layout de todo o site: todas as páginas e componentes, em todas as larguras e ambientes selecionados.',
    steps: [
      'Monte primeiro o inventário: rotas/páginas, layouts compartilhados e componentes reutilizados.',
      'Revise componentes compartilhados antes das páginas: uma correção neles resolve várias telas de uma vez.',
      'Depois revise página por página, em cada largura selecionada, registrando os problemas encontrados.',
      'Entregue uma lista priorizada por gravidade e por quantidade de telas afetadas, e corrija na ordem dessa lista se a correção fizer parte da tarefa.',
    ],
    does: 'revisar todas as páginas do site, listar os problemas e corrigir na ordem de prioridade',
    changesCode: true,
  },
]

export const taskById = (id: string) => TASKS.find((t) => t.id === id)

/* -------------------------------------------------------------------------- */
/* Contexto do projeto (todos opcionais)                                       */
/* -------------------------------------------------------------------------- */

export type ContextKey = 'nome' | 'pagina' | 'objetivo' | 'publico' | 'stack' | 'arquivos' | 'restricoes' | 'preservar' | 'referencias'

export interface ContextFieldDef {
  key: ContextKey
  label: string
  /** Rótulo da linha no prompt. */
  promptLabel: string
  multiline: boolean
  /** Fica em “Mais detalhes” (fechado por padrão). */
  advanced: boolean
  help?: string
}

export const CONTEXT_FIELDS: ContextFieldDef[] = [
  { key: 'nome', label: 'Projeto', promptLabel: 'Projeto', multiline: false, advanced: false, help: 'Nome ou uma descrição curta.' },
  { key: 'pagina', label: 'Página ou tela', promptLabel: 'Página ou tela', multiline: false, advanced: false, help: 'Qual parte será criada ou analisada.' },
  { key: 'objetivo', label: 'Objetivo da página', promptLabel: 'Objetivo principal da página', multiline: false, advanced: false },
  { key: 'publico', label: 'Público', promptLabel: 'Público que usará a interface', multiline: false, advanced: false },
  { key: 'stack', label: 'Framework, linguagem ou ferramentas', promptLabel: 'Tecnologia', multiline: false, advanced: false, help: 'Ex.: o que o projeto usa para interface e estilos.' },
  { key: 'arquivos', label: 'Componentes ou arquivos a analisar', promptLabel: 'Componentes ou arquivos a analisar', multiline: true, advanced: true, help: 'Um por linha.' },
  { key: 'restricoes', label: 'Restrições do projeto', promptLabel: 'Restrições', multiline: true, advanced: true, help: 'O que não pode mudar ou precisa ser respeitado.' },
  { key: 'preservar', label: 'Elementos a preservar', promptLabel: 'Elementos que devem ser preservados', multiline: true, advanced: true },
  { key: 'referencias', label: 'Referências visuais ou estilo desejado', promptLabel: 'Referências e estilo desejado', multiline: true, advanced: true },
]

/* -------------------------------------------------------------------------- */
/* Dispositivos e ambientes                                                    */
/* -------------------------------------------------------------------------- */

export type DeviceId = 'cel-pequeno' | 'cel-padrao' | 'cel-grande' | 'tablet-retrato' | 'tablet-paisagem' | 'notebook' | 'desktop' | 'ultrawide'

export interface DeviceDef {
  id: DeviceId
  label: string
  /** Faixa de larguras de viewport (CSS px). */
  range: string
  /** Larguras sugeridas para teste. */
  widths: number[]
  note: string
  /** Família de aparelho (para explicar em português simples o que está incluído). */
  group: DeviceGroup
}

export type DeviceGroup = 'celular' | 'tablet' | 'computador' | 'tela-grande'

export const DEVICE_GROUPS: { id: DeviceGroup; label: string }[] = [
  { id: 'celular', label: 'Celular' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'computador', label: 'Computador' },
  { id: 'tela-grande', label: 'Monitor grande' },
]

export const DEVICES: DeviceDef[] = [
  { id: 'cel-pequeno', label: 'Celular pequeno', range: '320–359 px', widths: [320, 344], note: 'telas estreitas e aparelhos dobráveis fechados', group: 'celular' },
  { id: 'cel-padrao', label: 'Celular padrão', range: '360–399 px', widths: [360, 375, 390], note: 'a faixa mais comum', group: 'celular' },
  { id: 'cel-grande', label: 'Celular grande', range: '400–480 px', widths: [412, 430], note: 'modelos “Plus/Max” e Androids grandes', group: 'celular' },
  { id: 'tablet-retrato', label: 'Tablet em retrato', range: '600–900 px', widths: [768, 820], note: 'também janelas estreitas no desktop', group: 'tablet' },
  { id: 'tablet-paisagem', label: 'Tablet em paisagem', range: '1000–1200 px', widths: [1024, 1180], note: 'toque com tela larga', group: 'tablet' },
  { id: 'notebook', label: 'Notebook', range: '1280–1440 px', widths: [1280, 1366, 1440], note: 'inclui escalonamento de 125–150% do sistema', group: 'computador' },
  { id: 'desktop', label: 'Desktop', range: '1536–1920 px', widths: [1536, 1920], note: 'monitores Full HD', group: 'computador' },
  { id: 'ultrawide', label: 'Monitor grande ou ultrawide', range: '2560 px ou mais', widths: [2560, 3440], note: 'conteúdo não pode esticar sem limite', group: 'tela-grande' },
]

export type EnvId = 'navegadores' | 'windows' | 'macos' | 'linux' | 'android' | 'ios'

export interface EnvDef {
  id: EnvId
  label: string
  /** Pontos de atenção específicos, que vão para o prompt. */
  attention: string
}

export const ENVS: EnvDef[] = [
  {
    id: 'navegadores',
    label: 'Navegadores modernos',
    attention:
      'Navegadores modernos: Chrome, Edge, Firefox e Safari, nas versões que o projeto declara suportar (se não houver política declarada, use as versões estáveis atuais e informe isso). Não use recursos de CSS sem suporte nesses navegadores sem um comportamento alternativo aceitável.',
  },
  { id: 'windows', label: 'Windows', attention: 'Windows: barras de rolagem ocupam espaço na largura da página; fontes são renderizadas de forma diferente (texto pode ficar mais largo); é comum escalonamento de tela de 125% ou 150%.' },
  { id: 'macos', label: 'macOS', attention: 'macOS: barras de rolagem sobrepostas costumam ficar ocultas e podem esconder rolagem lateral durante os testes; confira também no Safari.' },
  { id: 'linux', label: 'Linux', attention: 'Linux: fontes de sistema e fontes de substituição variam; uma fonte substituta pode alterar larguras e quebras de linha.' },
  { id: 'android', label: 'Android', attention: 'Android: Chrome e o navegador do fabricante; o teclado virtual reduz a área visível; o tamanho de fonte do sistema pode estar ampliado.' },
  {
    id: 'ios',
    label: 'iOS e iPadOS',
    attention:
      'iOS e iPadOS: todos os navegadores usam o motor do Safari; a barra de endereço muda a altura visível (cuidado com 100vh — considere dvh/svh); respeite as áreas seguras (env(safe-area-inset-*)); campos com fonte menor que 16 px causam zoom automático ao focar.',
  },
]

/* -------------------------------------------------------------------------- */
/* Opções que ajustam o texto de alguns módulos                                */
/* -------------------------------------------------------------------------- */

export type SpacingScale = 'existente' | 'base4' | 'base8'

export const SPACING_OPTIONS: { id: SpacingScale; label: string; text: string }[] = [
  {
    id: 'existente',
    label: 'A do projeto',
    text: 'Use a escala de espaçamento (tokens) que o projeto já tem. Se não houver uma, proponha uma escala curta e consistente antes de aplicar e declare essa decisão.',
  },
  { id: 'base4', label: 'Base 4 px', text: 'Use uma escala de base 4 px: 4, 8, 12, 16, 20, 24, 32, 40, 48 e 64 px (ou o equivalente em rem). Se o projeto já tiver tokens de espaçamento, mapeie a escala para eles em vez de criar valores paralelos.' },
  { id: 'base8', label: 'Base 8 px', text: 'Use uma escala de base 8 px: 8, 16, 24, 32, 48, 64 e 96 px, com 4 px apenas para ajustes finos (ou o equivalente em rem). Se o projeto já tiver tokens de espaçamento, mapeie a escala para eles em vez de criar valores paralelos.' },
]

export type TouchTarget = 44 | 48

export const TOUCH_OPTIONS: { id: TouchTarget; label: string }[] = [
  { id: 44, label: '44 × 44 px' },
  { id: 48, label: '48 × 48 px' },
]

/* -------------------------------------------------------------------------- */
/* Módulos de boas práticas                                                    */
/* -------------------------------------------------------------------------- */

export type ModuleId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N'

export interface RuleOptions {
  spacing: SpacingScale
  touch: TouchTarget
  darkMode: boolean
}

export interface ModuleDef {
  id: ModuleId
  title: string
  /** Uma linha na tela. */
  summary: string
  /** Nome em português simples (para a frase “a IA vai cuidar de…”). */
  plain: string
  /** Ativo na configuração padrão. */
  defaultOn: boolean
  /** Regras que entram no prompt (algumas dependem das opções). */
  rules: (o: RuleOptions) => string[]
}

const touchRule = (o: RuleOptions) =>
  `Alvos de toque com pelo menos ${o.touch} × ${o.touch} px (área clicável, não só o desenho) e espaço entre alvos vizinhos; o mínimo absoluto aceito pelas WCAG 2.2 (critério 2.5.8) é 24 × 24 px.`

export const MODULES: ModuleDef[] = [
  {
    id: 'A',
    title: 'Responsividade e adaptação de tela',
    summary: 'Telas pequenas a ultrawide, retrato e paisagem, zoom e janelas estreitas.',
    plain: 'adaptar a página a cada tamanho de tela',
    defaultOn: true,
    rules: () => [
      'O layout funciona em telas pequenas, médias, grandes e ultrawide, sem depender de uma resolução única.',
      'Use unidades flexíveis quando apropriado (%, rem, em, vw, fr) e limites com min(), max() e clamp().',
      'Defina breakpoints onde o conteúdo realmente quebra, não por modelo de aparelho; as larguras de teste da seção de dispositivos são referência, não pontos de quebra obrigatórios.',
      'Evite larguras fixas que causem rolagem horizontal; use max-width e min-width: 0 em itens de flex/grid que precisam encolher.',
      'Colunas, cartões, menus e áreas de conteúdo se reorganizam conforme o espaço disponível (empilham, quebram linha ou mudam de posição).',
      'Hierarquia, legibilidade e prioridade do conteúdo se mantêm em cada tamanho: o mais importante continua primeiro e visível.',
      'Considere retrato e paisagem, o zoom do navegador (até 200%) e o escalonamento de tela do sistema operacional.',
      'Funcionalidades essenciais não são escondidas em telas pequenas; podem mudar de forma (menu, aba, lista), mas continuam disponíveis.',
      'A navegação continua clara em celulares e tablets.',
      'Verifique também janelas estreitas no desktop (janela dividida, painel lateral do navegador), não só aparelhos móveis.',
    ],
  },
  {
    id: 'B',
    title: 'Margens, espaçamento e alinhamento',
    summary: 'Escala de espaçamento, respiro, alinhamentos e áreas seguras.',
    plain: 'espaçamentos e alinhamentos',
    defaultOn: true,
    rules: (o) => [
      SPACING_OPTIONS.find((s) => s.id === o.spacing)!.text,
      'Margens e preenchimentos consistentes entre seções, cartões, formulários, listas e botões equivalentes.',
      'Nenhum conteúdo colado às bordas da tela: margens laterais responsivas (menores no celular, maiores no desktop).',
      'Títulos, textos, campos, cartões, imagens e ações seguem alinhamentos coerentes (mesma borda, mesma grade).',
      'Grupos relacionados ficam próximos e separados de outros grupos por um espaço maior (proximidade comunica relação).',
      'Sem espaçamentos excessivos que dificultem a leitura ou empurrem conteúdo importante para longe.',
      'A hierarquia entre título, subtítulo, conteúdo, controles e ações fica clara pelo espaçamento.',
      'Respeite as áreas seguras de aparelhos móveis (recortes da tela, barra de gestos) quando houver elementos encostados nas bordas.',
      'O espaçamento continua consistente quando componentes quebram de linha ou mudam de posição (use gap em vez de margens assimétricas).',
    ],
  },
  {
    id: 'C',
    title: 'Botões, links e ações',
    summary: 'Sem sobreposição ou corte, toque confortável e estados distintos.',
    plain: 'botões e links',
    defaultOn: true,
    rules: (o) => [
      'Botões nunca se sobrepõem, colidem ou ficam parcialmente cobertos por outros elementos.',
      'Botões não são cortados, comprimidos nem empurrados para fora da tela.',
      'Textos longos em botões são tratados: o botão cresce, o texto quebra linha de forma legível ou o rótulo é revisto; nada de texto cortado sem alternativa.',
      'Em telas pequenas, grupos de botões podem quebrar em linhas ou ocupar a largura disponível.',
      touchRule(o),
      'Estados de foco, hover, pressionado, desabilitado, carregando e erro são visualmente distinguíveis.',
      'A área clicável corresponde ao elemento visual (sem áreas fantasmas nem alvos menores que o desenho).',
      'Links navegam e botões executam ações; a aparência de cada um corresponde à função.',
      'A ordem e a prioridade das ações (principal, secundária, destrutiva) continuam claras em telas menores.',
      'Nada depende só de hover: em telas de toque não há hover convencional, então toda informação e ação também precisa estar acessível por toque e teclado.',
    ],
  },
  {
    id: 'D',
    title: 'Textos, títulos e conteúdo',
    summary: 'Nada cortado ou sobreposto, quebra de palavras longas, legibilidade.',
    plain: 'textos e títulos',
    defaultOn: true,
    rules: () => [
      'Nenhum texto fica sobre outro texto ou sobre imagens, botões, campos, ícones ou outros elementos de forma não intencional.',
      'Nenhum título, legenda, rótulo, botão ou conteúdo é cortado ou escondido.',
      'Textos longos podem ocupar mais de uma linha quando necessário.',
      'Palavras longas, URLs, códigos, nomes extensos e valores sem espaços não estouram o contêiner (overflow-wrap: anywhere ou break-word; hifenização quando fizer sentido).',
      'Tamanhos de fonte legíveis em todas as telas (texto de leitura em torno de 16 px no celular; use clamp() para títulos).',
      'Altura de linha e largura de linha favorecem a leitura (cerca de 45 a 75 caracteres por linha em textos corridos).',
      'Títulos não ocupam espaço desproporcional no celular.',
      'Rótulos e mensagens de erro ficam próximos do campo a que pertencem.',
      'Idioma, acentuação e caracteres especiais são exibidos corretamente (codificação UTF-8 e atributo lang correto).',
      'Conteúdo dinâmico, nomes compridos, listas extensas e valores inesperados não quebram a interface.',
      'Não use altura fixa em áreas de texto quando isso puder cortar conteúdo.',
      'Não resolva problemas de conteúdo com ocultação automática ou truncamento silencioso. Quando precisar limitar, use uma solução explícita e acessível: expandir/recolher, quebra de linha ou indicação de continuação com o texto completo disponível.',
    ],
  },
  {
    id: 'E',
    title: 'Imagens, ícones e mídia',
    summary: 'Proporções, cortes, alinhamento de ícones e estados de carregamento.',
    plain: 'imagens e ícones',
    defaultOn: true,
    rules: () => [
      'Imagens nunca aparecem distorcidas.',
      'Proporções consistentes quando apropriado (aspect-ratio) e reserva de espaço para evitar saltos de layout.',
      'Imagens se ajustam ao contêiner sem ultrapassar os limites (max-width: 100%; height: auto).',
      'Comportamento de corte definido e intencional (object-fit e object-position), sem cortar a parte importante da imagem.',
      'Ícones alinhados com textos e controles, em tamanho legível, sem deformação, e com nome acessível quando têm função (ou ocultos de leitores de tela quando são decorativos).',
      'Estados previstos para imagem ausente, carregando e com erro.',
      'Imagens otimizadas (formatos modernos, tamanhos responsivos com srcset/sizes, carregamento tardio fora da primeira tela) sem perda visível de qualidade.',
      'Imagens não cobrem informações nem controles importantes.',
      'Textos alternativos descritivos e legendas quando aplicável.',
    ],
  },
  {
    id: 'F',
    title: 'Fundos, cores e contraste',
    summary: 'Contraste suficiente, hierarquia sem depender de cor, temas.',
    plain: 'cores e contraste',
    defaultOn: true,
    rules: (o) => [
      'Fundos coerentes com a identidade visual existente; preserve as cores e os tokens do design system do projeto.',
      'Contraste mínimo WCAG AA: 4,5:1 para texto normal, 3:1 para texto grande (a partir de 24 px, ou 18,66 px em negrito) e 3:1 para ícones, bordas de campos e outros componentes de interface.',
      'Fundos, gradientes e efeitos não prejudicam a leitura.',
      'A hierarquia visual não depende só de cor (use também peso, tamanho, posição, ícones ou texto).',
      'Gradientes, transparências e imagens de fundo testados em telas variadas: o contraste vale em todos os pontos onde há texto.',
      o.darkMode
        ? 'O projeto tem tema claro e escuro: confira os dois temas em todas as larguras, com contraste e estados equivalentes.'
        : 'Se o projeto oferecer tema claro e escuro, confira os dois.',
      'Evite mudanças de contraste causadas por transparência, sobreposição ou troca de fundo durante a rolagem.',
    ],
  },
  {
    id: 'G',
    title: 'Formulários e campos',
    summary: 'Rótulos, mensagens de erro, foco, teclado virtual e estados.',
    plain: 'formulários',
    defaultOn: true,
    rules: (o) => [
      'Campos alinhados e com espaçamento consistente.',
      'Rótulos, valores, ícones, textos de ajuda e mensagens de erro nunca se sobrepõem.',
      'O campo em foco é claramente identificável.',
      'Campos se ajustam à largura disponível em telas pequenas (largura total no celular, larguras compatíveis com o conteúdo esperado no desktop).',
      'O teclado virtual não cobre o campo ativo nem os botões de envio (role o campo para a área visível e não fixe a ação na base sem considerar o teclado).',
      'Mensagens de validação ficam junto do campo correspondente e são anunciadas a leitores de tela.',
      'Erro não é indicado só por cor: use texto e, se fizer sentido, ícone.',
      'Os dados preenchidos são preservados quando a interface se reorganiza (rotação, redimensionamento, troca de etapa).',
      touchRule(o),
      'Estados de preenchido, erro, desabilitado, sucesso e carregando estão previstos.',
      'Tipos de campo e teclados adequados (type, inputmode, autocomplete) e fonte de pelo menos 16 px em campos no celular.',
    ],
  },
  {
    id: 'H',
    title: 'Navegação, cabeçalho e menus',
    summary: 'Menus em telas estreitas, página atual, camadas e elementos fixos.',
    plain: 'menus e cabeçalho',
    defaultOn: true,
    rules: () => [
      'A navegação é visível, compreensível e utilizável em todas as larguras.',
      'Menus se adaptam a telas estreitas sem sobrepor conteúdo de forma indevida.',
      'Menus e submenus nunca saem dos limites da tela.',
      'Menus abrem e fecham por teclado, toque e tecnologias assistivas (com aria-expanded e foco previsível).',
      'O cabeçalho não fica alto demais no celular.',
      'Está definido o que acontece quando há muitos itens de navegação (agrupar, “Mais”, rolagem contida).',
      'A página atual é indicada claramente quando aplicável (aria-current).',
      'Menus, modais e painéis não ficam escondidos atrás de outros elementos.',
      'Camadas (z-index) seguem uma escala definida e documentada, sem valores aleatórios.',
      'Elementos fixos ou grudados (cabeçalho, barra inferior, botão flutuante) não cobrem conteúdo, botões nem campos; reserve o espaço que ocupam.',
    ],
  },
  {
    id: 'I',
    title: 'Modais, painéis, notificações e menus flutuantes',
    summary: 'Cabem na tela, rolam por dentro, foco controlado e Esc.',
    plain: 'janelas e avisos que abrem por cima',
    defaultOn: true,
    rules: () => [
      'Modais cabem na área visível em qualquer largura e altura.',
      'O conteúdo interno do modal rola sem mover o fundo da página.',
      'Botões de confirmar e cancelar continuam acessíveis (sem sumir abaixo da dobra do modal).',
      'Painéis laterais se adaptam a telas pequenas (largura total ou folha inferior).',
      'Notificações não cobrem ações importantes e não ficam fora da tela.',
      'Menus flutuantes, popovers e dicas são posicionados dentro da área visível (invertem o lado quando falta espaço).',
      'Em modais, o foco vai para dentro ao abrir, fica preso enquanto aberto e volta ao elemento de origem ao fechar.',
      'A tecla Esc fecha o elemento quando apropriado.',
      'A ordem de sobreposição é consistente entre modais, menus e notificações.',
      'Todos esses componentes podem ser operados por teclado e por toque.',
    ],
  },
  {
    id: 'J',
    title: 'Acessibilidade e interação',
    summary: 'Teclado, foco visível, semântica, leitores de tela, movimento e zoom.',
    plain: 'acessibilidade (teclado, leitores de tela, zoom)',
    defaultOn: true,
    rules: (o) => [
      'Toda a interface pode ser usada pelo teclado, com ordem de foco lógica (a mesma da leitura).',
      'Foco sempre visível e com contraste suficiente.',
      'Rótulos associados aos campos; controles com nomes acessíveis.',
      'HTML semântico (landmarks, títulos em ordem, listas, botões e links reais).',
      'Informação não depende só de cor, animação ou posição.',
      'Compatível com leitores de tela (mudanças dinâmicas anunciadas quando relevante).',
      'Respeite a preferência de movimento reduzido do sistema (prefers-reduced-motion).',
      touchRule(o),
      'Animações não atrapalham a leitura nem a interação.',
      'Conteúdo e controles continuam utilizáveis com zoom de até 200% e com reflow em 320 px de largura (critério 1.4.10).',
      'Textos ampliados e o tamanho de fonte do sistema não quebram o layout (use rem/em e evite alturas fixas em volta de texto).',
    ],
  },
  {
    id: 'K',
    title: 'Compatibilidade e comportamento técnico',
    summary: 'Navegadores, Flexbox/Grid, alturas do celular e saltos de layout.',
    plain: 'diferenças entre navegadores e sistemas',
    defaultOn: true,
    rules: () => [
      'Teste nos navegadores e sistemas selecionados e nos que o projeto declara suportar.',
      'Considere diferenças de renderização de fontes, campos de formulário, barras de rolagem e elementos nativos.',
      'Não dependa de medidas que mudam com as barras do navegador ou o teclado móvel (prefira dvh/svh/lvh conscientemente a 100vh).',
      'Organize o fluxo principal com Flexbox, Grid e fluxo normal; posicionamento absoluto só quando realmente necessário (camadas, ícones dentro de campos, decorações).',
      'Defina dimensões e proporções de mídia e de áreas reservadas para evitar mudanças bruscas durante o carregamento (CLS).',
      'Verifique o efeito de fontes, imagens e conteúdos que carregam depois da página.',
      'Animações e transições não mudam a posição de elementos de forma inesperada (prefira transform e opacity).',
      'O layout continua funcional com zoom e redimensionamento da janela.',
    ],
  },
  {
    id: 'L',
    title: 'Estados e conteúdo variável',
    summary: 'Carregando, vazio, erro, sucesso, dados longos, sem permissão…',
    plain: 'telas de carregando, vazio e erro',
    defaultOn: true,
    rules: () => [
      'Revise a interface nos estados: carregando; vazio; erro; sucesso; dados muito longos; listas grandes; sem imagem; usuário sem permissão; conexão lenta; elementos desabilitados; mensagens inesperadas; conteúdo que aparece ou desaparece após uma interação.',
      'Em cada estado, a interface continua compreensível e organizada, sem saltos de layout desnecessários.',
      'Estados de carregamento ocupam o mesmo espaço do conteúdo final (placeholders/esqueletos) sempre que possível.',
      'Estados vazios e de erro explicam o que aconteceu e oferecem o próximo passo.',
    ],
  },
  {
    id: 'M',
    title: 'Impressão (opcional)',
    summary: 'Só quando o conteúdo precisa ser impresso.',
    plain: 'impressão',
    defaultOn: false,
    rules: () => [
      'O conteúdo importante aparece na impressão.',
      'Fundos e cores não tornam o material ilegível nem desperdiçam tinta (estilos @media print).',
      'Menus, botões e controles desnecessários ficam ocultos na versão impressa.',
      'Tabelas, textos e imagens não são cortados entre páginas (break-inside, cabeçalhos de tabela repetidos).',
      'Links e informações essenciais continuam acessíveis no papel (por exemplo, o endereço do link impresso ao lado do texto).',
    ],
  },
  {
    id: 'N',
    title: 'Verificação visual e checklist de saída',
    summary: 'O que a IA deve conferir e relatar antes de concluir.',
    plain: 'conferência final e relatório do que foi feito',
    defaultOn: true,
    rules: () => [
      'Examine a implementação existente antes de propor alterações.',
      'Identifique as causas dos problemas de layout em vez de apenas esconder os sintomas.',
      'Preserve conteúdo, funcionalidades e identidade visual, exceto quando uma alteração for necessária e justificada.',
      'Faça mudanças consistentes com os componentes e tokens existentes.',
      'Revise cada tela em cada largura listada em “Dispositivos, larguras e ambientes”.',
      'Verifique a ausência de rolagem horizontal indevida.',
      'Verifique sobreposição, corte, colisão, desalinhamento e conteúdo fora da tela.',
      'Verifique botões, textos, campos, menus, modais, imagens e mensagens de erro.',
      'Revise a navegação por teclado, o foco visível e o uso em telas de toque.',
      'Informe quais arquivos ou componentes foram alterados e resuma os problemas corrigidos.',
      'Se não puder fazer uma verificação visual real (abrir a página no navegador nas larguras indicadas), diga isso claramente e liste o que ainda precisa ser conferido por uma pessoa.',
    ],
  },
]

export const moduleById = (id: string) => MODULES.find((m) => m.id === id)
export const MODULE_IDS = MODULES.map((m) => m.id)

/* -------------------------------------------------------------------------- */
/* Configuração e presets                                                      */
/* -------------------------------------------------------------------------- */

export interface GuideConfig {
  task: TaskId
  context: Record<ContextKey, string>
  devices: DeviceId[]
  envs: EnvId[]
  modules: ModuleId[]
  options: RuleOptions
}

export const emptyContext = (): Record<ContextKey, string> => Object.fromEntries(CONTEXT_FIELDS.map((f) => [f.key, ''])) as Record<ContextKey, string>

export const DEFAULT_OPTIONS: RuleOptions = { spacing: 'existente', touch: 44, darkMode: false }

/** Seleções padrão (o contexto começa vazio: nada de dado de exemplo). */
export function defaultSelections(): Omit<GuideConfig, 'context'> {
  return {
    task: 'revisar',
    devices: ['cel-pequeno', 'cel-padrao', 'cel-grande', 'tablet-retrato', 'tablet-paisagem', 'notebook', 'desktop'],
    envs: ['navegadores'],
    modules: MODULES.filter((m) => m.defaultOn).map((m) => m.id),
    options: { ...DEFAULT_OPTIONS },
  }
}

export const defaultConfig = (): GuideConfig => ({ ...defaultSelections(), context: emptyContext() })

export interface PresetDef {
  id: string
  /** Nome técnico do atalho. */
  label: string
  /** A situação da pessoa, em português simples (título do cartão). */
  situation: string
  /** O que acontece, em português simples. */
  explain: string
  description: string
  task: TaskId
  devices: DeviceId[]
  envs: EnvId[]
  modules: ModuleId[]
}

const ALL_DEVICES = DEVICES.map((d) => d.id)
const ALL_ENVS = ENVS.map((e) => e.id)

export const PRESETS: PresetDef[] = [
  {
    id: 'responsivo-completo',
    label: 'Layout responsivo completo',
    situation: 'Vou criar uma página nova',
    explain: 'A IA cria a página já funcionando no celular, no tablet e no computador. Não precisa pedir a versão de celular depois.',
    description: 'Do celular pequeno ao ultrawide, com todas as práticas de estrutura.',
    task: 'criar',
    devices: ALL_DEVICES,
    envs: ['navegadores', 'android', 'ios', 'windows', 'macos'],
    modules: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N'],
  },
  {
    id: 'celular',
    label: 'Revisão para celular',
    situation: 'Minha página não fica boa no celular',
    explain: 'A página já existe e funciona no computador. A IA ajusta para celulares e tablets em pé.',
    description: 'Celulares e tablet em retrato, toque, teclado virtual e áreas seguras.',
    task: 'adaptar-celular',
    devices: ['cel-pequeno', 'cel-padrao', 'cel-grande', 'tablet-retrato'],
    envs: ['navegadores', 'android', 'ios'],
    modules: ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J', 'K', 'L', 'N'],
  },
  {
    id: 'desktop',
    label: 'Revisão de desktop',
    situation: 'Minha página fica estranha em tela grande',
    explain: 'Conteúdo esticado, espalhado ou pequeno demais no notebook ou no monitor. A IA ajusta para telas grandes.',
    description: 'Tablet em paisagem, notebook, desktop e monitores grandes.',
    task: 'adaptar-desktop',
    devices: ['tablet-paisagem', 'notebook', 'desktop', 'ultrawide'],
    envs: ['navegadores', 'windows', 'macos', 'linux'],
    modules: ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'K', 'L', 'N'],
  },
  {
    id: 'sobreposicoes',
    label: 'Auditoria de sobreposições e cortes',
    situation: 'Tem coisa sobreposta, cortada ou saindo da tela',
    explain: 'Botão em cima de botão, texto cortado, página que rola para o lado. A IA acha a causa e conserta em todas as telas.',
    description: 'Elementos sobrepostos, textos cortados e conteúdo fora da tela.',
    task: 'corrigir-responsividade',
    devices: ALL_DEVICES,
    envs: ['navegadores'],
    modules: ['A', 'C', 'D', 'E', 'H', 'I', 'K', 'L', 'N'],
  },
  {
    id: 'acessibilidade',
    label: 'Acessibilidade e usabilidade',
    situation: 'Quero que todo mundo consiga usar',
    explain: 'Teclado, contraste, tamanho de toque, leitores de tela e zoom. A IA corrige o que dificulta o uso.',
    description: 'Teclado, foco, contraste, toque, leitores de tela e zoom.',
    task: 'acessibilidade',
    devices: ['cel-padrao', 'tablet-retrato', 'notebook', 'desktop'],
    envs: ['navegadores', 'android', 'ios', 'windows', 'macos'],
    modules: ['C', 'D', 'F', 'G', 'H', 'I', 'J', 'L', 'N'],
  },
  {
    id: 'site-completo',
    label: 'Revisão completa do site',
    situation: 'Quero revisar o site inteiro',
    explain: 'Todas as páginas, em todas as telas e sistemas. A IA lista os problemas e corrige por ordem de importância.',
    description: 'Todas as páginas, larguras, ambientes e práticas (impressão é opcional).',
    task: 'revisao-completa',
    devices: ALL_DEVICES,
    envs: ALL_ENVS,
    modules: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N'],
  },
]

/** Aplica um preset: muda só tarefa, telas, ambientes e módulos. Contexto e opções ficam como estão. */
export function applyPreset(cfg: GuideConfig, presetId: string): GuideConfig {
  const p = PRESETS.find((x) => x.id === presetId)
  if (!p) return cfg
  return { ...cfg, task: p.task, devices: [...p.devices], envs: [...p.envs], modules: [...p.modules] }
}

/** Preset que corresponde exatamente às seleções atuais (para marcar o botão como ativo). */
export function matchingPreset(cfg: GuideConfig): PresetDef | undefined {
  const same = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x))
  return PRESETS.find((p) => p.task === cfg.task && same(p.devices, cfg.devices) && same(p.envs, cfg.envs) && same(p.modules, cfg.modules))
}
