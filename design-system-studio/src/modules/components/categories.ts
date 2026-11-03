import type { PropValue } from '@/core/project'
import type { ItemSpec } from '@/core/types'
import type { ComponentCategory, ComponentGroup, ParamDef } from './types'

/* -------------------------------------------------------------------------- */
/* Construtores de parâmetros (deixam o catálogo legível)                      */
/* -------------------------------------------------------------------------- */

type G = ParamDef['group']
const opt = (...pairs: [string, string][]) => pairs.map(([value, label]) => ({ value, label }))

const text = (key: string, label: string, def: string, part?: string, help?: string): ParamDef => ({ key, label, type: 'text', default: def, group: 'Conteúdo', part, help })
const area = (key: string, label: string, def: string, part?: string, help?: string): ParamDef => ({ key, label, type: 'textarea', default: def, group: 'Conteúdo', part, help })
const icon = (key: string, label: string, def: string, part = 'icon'): ParamDef => ({ key, label, type: 'icon', default: def, group: 'Conteúdo', part })
const sel = (key: string, label: string, def: string, options: { value: string; label: string }[], group: G = 'Aparência', part?: string): ParamDef => ({ key, label, type: 'select', default: def, options, group, part })
const bool = (key: string, label: string, def: boolean, group: G = 'Aparência', help?: string): ParamDef => ({ key, label, type: 'boolean', default: def, group, help })
const num = (key: string, label: string, def: number, min: number, max: number, step = 1, unit?: string, group: G = 'Tamanho'): ParamDef => ({ key, label, type: 'number', default: def, min, max, step, unit, group })
const color = (key: string, label: string, part?: string): ParamDef => ({ key, label, type: 'color', default: '', group: 'Aparência', part, help: 'Vazio = herda a paleta global.' })
const state = (key: string, label: string, def = false, help?: string): ParamDef => ({ key, label, type: 'boolean', default: def, group: 'Estados', help })

const SIZE = (def = 'md') => sel('tamanho', 'Tamanho', def, opt(['sm', 'Pequeno'], ['md', 'Médio'], ['lg', 'Grande']), 'Tamanho')
const DENSITY = (def = 'padrao') => sel('densidade', 'Densidade', def, opt(['compacta', 'Compacta'], ['padrao', 'Padrão'], ['confortavel', 'Confortável']), 'Tamanho')
const ICON_POS = (def = 'esquerda') => sel('posicaoIcone', 'Posição do ícone', def, opt(['esquerda', 'À esquerda'], ['direita', 'À direita'], ['nenhum', 'Sem ícone']))

type Def = [number, string, string, ComponentGroup, string, ParamDef[], ItemSpec]

/* -------------------------------------------------------------------------- */
/* 66 categorias                                                               */
/* -------------------------------------------------------------------------- */

const DEFS: Def[] = [
  /* ---------------------------- Estilo e fundamentos ---------------------------- */
  [1, 'tipografia', 'Tipografia', 'fundamentos', 'Como os títulos e textos aparecem: fontes, tamanhos e pesos que dão a voz do site.', [
    text('titulo', 'Título de exemplo', 'Design que respira', 'title'),
    area('texto', 'Parágrafo de exemplo', 'Textos com boa altura de linha e contraste são lidos com menos esforço em qualquer tela.', 'body'),
    text('sobretitulo', 'Sobretítulo', 'Capítulo 01', 'overline'),
    sel('escala', 'Escala tipográfica', 'equilibrada', opt(['compacta', 'Compacta (1,2)'], ['equilibrada', 'Equilibrada (1,25)'], ['expressiva', 'Expressiva (1,333)']), 'Tamanho'),
    sel('alinhamento', 'Alinhamento', 'esquerda', opt(['esquerda', 'À esquerda'], ['centro', 'Centralizado'])),
    bool('mostrarEscala', 'Mostrar amostra da escala', true),
  ], {
    summary: 'Sistema tipográfico com escala modular, pares de fonte título/texto e hierarquia de pesos.',
    structure: ['Sobretítulo pequeno → título (h1–h3) → parágrafo → legenda.', 'Escala modular a partir do tamanho base (ex.: 13 / 15 / 18 / 22 / 28 / 36 px).', 'Altura de linha 1.2–1.3 em títulos e 1.5–1.6 em textos; largura de leitura de 60–75 caracteres.'],
    behavior: ['Links dentro de texto sublinhados no hover e com foco visível.', 'Seleção de texto com fundo na primária suave.'],
    responsive: ['Títulos com clamp() (ex.: clamp(24px, 6vw, 36px)); texto base nunca abaixo de 15 px no celular.', 'Linhas longas quebram com overflow-wrap: anywhere em URLs e códigos.'],
    measurements: { medidaLeitura: '60–75 caracteres', baseTexto: '15–16 px' },
  }],
  [2, 'paletas-cores', 'Paletas e cores', 'fundamentos', 'A amostra das cores do projeto aplicadas: principal, destaque, fundos e cores de aviso.', [
    text('titulo', 'Título', 'Paleta do projeto', 'title'),
    sel('formato', 'Formato das amostras', 'faixas', opt(['faixas', 'Faixas'], ['circulos', 'Círculos'], ['cartoes', 'Cartões'])),
    bool('mostrarNomes', 'Mostrar nomes dos tokens', true),
    bool('mostrarSemanticas', 'Mostrar cores de status', true),
  ], {
    summary: 'Painel de amostras da paleta global com tokens de marca, superfícies, texto e cores semânticas.',
    structure: ['Linha de marca: primária, secundária, destaque.', 'Linha de base: fundo, superfície, texto, borda.', 'Linha semântica: sucesso, aviso, erro, informação (cor + fundo).', 'Cada amostra mostra o nome do token e o valor hexadecimal.'],
    behavior: ['Clique na amostra copia o valor hexadecimal com feedback ("Copiado").'],
    responsive: ['Amostras quebram em grade de 2–3 colunas no celular; nomes longos quebram linha sem cortar o hex.'],
  }],
  [3, 'espacamentos', 'Espaçamentos', 'fundamentos', 'A régua de distâncias entre elementos. Espaços consistentes deixam tudo organizado.', [
    text('titulo', 'Título', 'Escala de espaço', 'title'),
    sel('base', 'Unidade base', '4', opt(['4', '4 px'], ['8', '8 px'])),
    bool('mostrarValores', 'Mostrar valores', true),
    bool('mostrarExemplo', 'Mostrar exemplo aplicado', true),
  ], {
    summary: 'Escala de espaçamento em múltiplos da unidade base, aplicada a padding, gap e margens.',
    structure: ['Escala: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px.', 'Padding interno de controles = 0,75–1× a unidade × densidade; gap entre cards = 16–24 px.', 'Seções separadas por 48–96 px.'],
    responsive: ['No celular, reduza os espaços maiores (≥ 32 px) em um degrau da escala; padding lateral de página de 16 px.'],
    measurements: { unidade: '4 px', paddingPagina: '16 px (celular) / 32 px (desktop)' },
  }],
  [4, 'bordas-sombras', 'Bordas e sombras', 'fundamentos', 'O formato dos cantos, as linhas de contorno e as sombras que dão profundidade.', [
    text('titulo', 'Título', 'Cantos, linhas e profundidade', 'title'),
    sel('elevacao', 'Nível de elevação de exemplo', 'media', opt(['nenhuma', 'Nenhuma'], ['baixa', 'Baixa'], ['media', 'Média'], ['alta', 'Alta'])),
    bool('mostrarRotulos', 'Mostrar rótulos', true),
  ], {
    summary: 'Tokens de raio (pequeno, médio, grande), espessura/estilo de borda e níveis de elevação.',
    structure: ['Três amostras: raio de controle, raio de contêiner e elevação flutuante.', 'Bordas na espessura e estilo da família; sombras apenas onde a família permite.', 'Elevação alta reservada para elementos flutuantes (menus, modais, toasts).'],
    responsive: ['Raios e bordas se mantêm em todas as larguras; sombras grandes reduzem 30% no celular.'],
  }],
  [5, 'icones', 'Ícones', 'fundamentos', 'Os pequenos desenhos que ajudam a reconhecer ações. Aqui você escolhe o estilo e o tratamento.', [
    icon('icone', 'Ícone em destaque', 'Sparkles'),
    text('legenda', 'Legenda', 'Favoritos', 'label'),
    sel('tratamento', 'Tratamento', 'familia', opt(['familia', 'Da família visual'], ['sem-fundo', 'Sem fundo'], ['circulo', 'Em círculo'], ['quadrado', 'Em quadrado'])),
    color('cor', 'Cor do ícone', 'icon'),
    num('tamanho', 'Tamanho do ícone', 24, 16, 40, 2, 'px'),
  ], {
    summary: 'Conjunto de ícones de traço consistente (lucide), tamanho padronizado e tratamento de fundo da família.',
    structure: ['Grade de ícones com o ícone escolhido em destaque e sua legenda.', 'Traço único por família (1,25–2,5 px); tamanhos 16 / 20 / 24 px.', 'Ícones decorativos com aria-hidden; ícones isolados com aria-label.'],
    behavior: ['Ícones interativos mudam de cor no hover (ícone → primária) e têm foco visível no contêiner.'],
    responsive: ['Ícones nunca encolhem (flex: none); alvos de toque com 44 × 44 px no celular mesmo com ícone de 20 px.'],
  }],
  [6, 'fundos-superficies', 'Fundos e superfícies', 'fundamentos', 'As camadas da interface: fundo da página, cartões por cima e elementos flutuantes.', [
    text('titulo', 'Título', 'Camadas da interface', 'title'),
    num('niveis', 'Quantidade de camadas', 3, 2, 4, 1, undefined, 'Aparência'),
    color('tinta', 'Tingimento do fundo', 'background'),
    bool('mostrarRotulos', 'Mostrar rótulos', true),
  ], {
    summary: 'Hierarquia de superfícies: fundo → superfície → superfície elevada → sobreposição.',
    structure: ['Fundo da página (bg) recebe superfícies (cards) que recebem elementos elevados (menus).', 'Cada camada diferencia-se pela regra da família: borda, sombra, tom ou translucidez.', 'Sobreposições (overlay) escurecem o fundo a 45%.'],
    responsive: ['As camadas mantêm a mesma lógica no celular; superfícies ocupam a largura total com margens de 16 px.'],
  }],
  [7, 'separadores', 'Separadores', 'fundamentos', 'Linhas ou espaços que separam blocos de conteúdo, às vezes com um texto no meio.', [
    text('rotulo', 'Texto do separador', 'ou continue com', 'label'),
    sel('estilo', 'Estilo', 'com-texto', opt(['linha', 'Linha'], ['tracejado', 'Tracejado'], ['com-texto', 'Com texto'], ['espaco', 'Só espaço'])),
    num('espessura', 'Espessura', 1, 1, 4, 1, 'px'),
    color('cor', 'Cor da linha', 'line'),
  ], {
    summary: 'Divisores horizontais/verticais (linha, tracejado, com rótulo central ou espaço).',
    structure: ['Linha de 1 px na cor de borda; variante com rótulo centralizado entre duas linhas.', 'Separadores em listas recuados até o início do texto.', 'Usar role="separator" quando não for puramente decorativo.'],
    responsive: ['Separadores verticais viram horizontais quando o conteúdo empilha no celular.'],
  }],

  /* ---------------------------- Campos e controles ---------------------------- */
  [8, 'campos-busca', 'Campos de busca', 'campos', 'A caixa onde a pessoa digita o que procura, com lupa, atalho e sugestões.', [
    text('placeholder', 'Texto de exemplo (placeholder)', 'Buscar produtos, pedidos…', 'field'),
    icon('icone', 'Ícone', 'Search'),
    bool('atalho', 'Mostrar atalho de teclado (⌘K)', true),
    bool('sugestoes', 'Mostrar sugestões abertas', true),
    bool('botaoLimpar', 'Botão de limpar', false),
    SIZE(),
    state('carregando', 'Buscando (carregando)'),
  ], {
    summary: 'Campo de busca com ícone à esquerda, atalho de teclado e painel de sugestões.',
    structure: ['Ícone de lupa à esquerda, campo, atalho/limpar à direita.', 'Painel de sugestões abaixo com grupos (Recentes, Sugestões) e item ativo destacado.', 'Usar role="combobox" com aria-expanded e listbox de resultados.'],
    behavior: ['Atalho ⌘K/Ctrl+K foca o campo; Esc limpa ou fecha; setas navegam nas sugestões e Enter abre.', 'Debounce de 200–300 ms ao digitar; estado de carregando com spinner no lugar da lupa.'],
    responsive: ['No celular, a busca pode expandir para tela cheia ao focar; fonte de 16 px; atalho de teclado oculto.'],
    measurements: { altura: '40–44 px', larguraMinima: '220 px' },
  }],
  [9, 'text-inputs', 'Text inputs', 'campos', 'O campo de texto comum, com título, dica e mensagem de erro.', [
    text('rotulo', 'Rótulo', 'E-mail', 'label'),
    text('placeholder', 'Placeholder', 'voce@empresa.com', 'field'),
    text('ajuda', 'Texto de ajuda', 'Usaremos para enviar o recibo.', 'help'),
    icon('icone', 'Ícone', 'Mail'),
    ICON_POS(),
    bool('obrigatorio', 'Campo obrigatório (*)', true),
    SIZE(),
    state('erro', 'Mostrar erro'),
    text('mensagemErro', 'Mensagem de erro', 'Informe um e-mail válido.', 'error'),
  ], {
    summary: 'Campo de texto com rótulo visível, placeholder, ícone opcional, texto de ajuda e estado de erro.',
    structure: ['Rótulo acima (label for/id) → campo → ajuda ou erro abaixo.', 'Ícone dentro do campo à esquerda ou à direita.', 'Asterisco de obrigatório com texto acessível.'],
    behavior: ['Hover reforça a borda; focus-visible aplica o anel/estilo de foco da família.', 'Erro: borda e mensagem na cor de erro, aria-invalid e aria-describedby apontando a mensagem.', 'Disabled: fundo desabilitado e cursor not-allowed.'],
    responsive: ['Largura 100% do contêiner; fonte 16 px no celular; o campo focado permanece visível com o teclado aberto.'],
    measurements: { altura: '40–44 px', espacoRotulo: '6 px' },
  }],
  [10, 'textareas', 'Textareas', 'campos', 'Campo para textos longos, como mensagens e descrições, com contador de caracteres.', [
    text('rotulo', 'Rótulo', 'Mensagem', 'label'),
    text('placeholder', 'Placeholder', 'Conte um pouco sobre o seu projeto…', 'field'),
    num('linhas', 'Linhas visíveis', 4, 2, 8),
    bool('contador', 'Contador de caracteres', true),
    num('limite', 'Limite de caracteres', 280, 50, 2000, 10, undefined, 'Conteúdo'),
    state('erro', 'Mostrar erro'),
  ], {
    summary: 'Área de texto multilinha com rótulo, contador de caracteres e redimensionamento vertical.',
    structure: ['Rótulo → área de texto → linha inferior com ajuda à esquerda e contador à direita.', 'resize: vertical; altura mínima pelas linhas visíveis.'],
    behavior: ['Contador muda para aviso a 90% e erro ao exceder o limite.', 'Auto-crescimento opcional até um máximo, depois rolagem interna.'],
    responsive: ['Largura total no celular, fonte 16 px; altura máxima de 40dvh com rolagem interna.'],
  }],
  [11, 'selects-dropdowns', 'Selects e dropdowns', 'campos', 'Caixa que abre uma lista para escolher uma opção.', [
    text('rotulo', 'Rótulo', 'País', 'label'),
    text('valor', 'Opção escolhida', 'Brasil', 'field'),
    area('opcoes', 'Opções (uma por linha)', 'Brasil\nPortugal\nAngola\nMoçambique', 'options'),
    icon('icone', 'Ícone', 'Globe'),
    bool('aberto', 'Mostrar lista aberta', true),
    bool('comBusca', 'Busca dentro da lista', false),
    SIZE(),
  ], {
    summary: 'Seleção única com gatilho em forma de campo e lista suspensa com item selecionado marcado.',
    structure: ['Gatilho: ícone opcional, valor, chevron.', 'Lista flutuante com opções, check no item selecionado e item em foco destacado.', 'Implementar com <select> nativo ou listbox ARIA completo.'],
    behavior: ['Abre com clique, Enter, Espaço ou seta; Esc fecha e devolve o foco ao gatilho; digitar salta para a opção.', 'A lista reposiciona para cima se não houver espaço abaixo.'],
    responsive: ['No celular, a lista vira bottom sheet ou usa o seletor nativo; opções com 44 px de altura.'],
  }],
  [12, 'combobox', 'Combobox', 'campos', 'Campo em que você digita e ele sugere opções que combinam com o texto.', [
    text('rotulo', 'Rótulo', 'Responsável', 'label'),
    text('digitado', 'Texto digitado', 'an', 'field'),
    area('opcoes', 'Opções (uma por linha)', 'Ana Souza\nAndré Melo\nJuliana Antunes', 'options'),
    bool('aberto', 'Mostrar sugestões', true),
    bool('avatares', 'Mostrar avatares', true),
    bool('criarNovo', 'Opção "Criar novo"', true),
  ], {
    summary: 'Campo com autocompletar: filtra opções conforme a digitação e destaca o trecho correspondente.',
    structure: ['Campo de texto + lista de sugestões com o trecho digitado em negrito.', 'Opção final "Criar “texto”" quando permitido.', 'role="combobox", aria-autocomplete="list", aria-activedescendant.'],
    behavior: ['Setas navegam, Enter confirma, Esc fecha; mostra "Nenhum resultado" quando vazio.', 'Busca assíncrona com estado de carregamento.'],
    responsive: ['No celular, a lista ocupa a largura do campo com no máximo 50dvh de altura e rolagem interna.'],
  }],
  [13, 'multi-select', 'Multi-select', 'campos', 'Escolha várias opções de uma vez; cada escolha vira uma etiqueta removível.', [
    text('rotulo', 'Rótulo', 'Áreas de interesse', 'label'),
    area('selecionados', 'Selecionados (um por linha)', 'Design\nProduto\nMarketing', 'chips'),
    area('opcoes', 'Outras opções (uma por linha)', 'Engenharia\nVendas', 'options'),
    num('limiteVisivel', 'Etiquetas visíveis antes de "+N"', 3, 1, 6, 1, undefined, 'Aparência'),
    bool('aberto', 'Mostrar lista aberta', false),
  ], {
    summary: 'Seleção múltipla com etiquetas (chips) removíveis dentro do campo e lista com checkboxes.',
    structure: ['Campo contém chips dos itens escolhidos + resumo "+N" quando excede o limite.', 'Lista suspensa com checkbox em cada opção e ação "Limpar".'],
    behavior: ['Backspace remove o último chip; cada chip tem botão remover com aria-label.', 'A lista permanece aberta durante múltiplas escolhas.'],
    responsive: ['Chips quebram em várias linhas no celular; a lista vira bottom sheet com botão "Concluir".'],
  }],
  [14, 'checkbox', 'Checkbox', 'campos', 'Caixinha de marcar para aceitar algo ou escolher várias opções.', [
    text('rotulo', 'Rótulo', 'Aceito os termos de uso', 'label'),
    text('descricao', 'Descrição', 'Você pode mudar isso depois nas configurações.', 'help'),
    sel('layout', 'Layout', 'lista', opt(['lista', 'Lista'], ['cartao', 'Cartão selecionável'])),
    state('marcado', 'Marcado', true),
    state('indeterminado', 'Indeterminado'),
  ], {
    summary: 'Caixa de seleção com rótulo clicável, descrição, estados marcado/indeterminado e variante em cartão.',
    structure: ['Caixa 18–20 px + rótulo + descrição; todo o conjunto é clicável (label).', 'Variante cartão: borda envolvente que muda para primária quando marcado.'],
    behavior: ['Espaço alterna; focus-visible no quadrado; indeterminado com traço horizontal (aria-checked="mixed").'],
    responsive: ['Área de toque de 44 px de altura no celular incluindo o rótulo; rótulos longos quebram linha alinhados ao texto.'],
  }],
  [15, 'radios', 'Radio buttons', 'campos', 'Bolinhas para escolher uma única opção entre poucas.', [
    text('titulo', 'Pergunta', 'Tipo de entrega', 'title'),
    area('opcoes', 'Opções (uma por linha)', 'Econômica — 5 dias úteis\nExpressa — 2 dias úteis\nRetirar na loja', 'options'),
    num('selecionado', 'Opção marcada', 2, 1, 5, 1, undefined, 'Estados'),
    sel('layout', 'Layout', 'lista', opt(['lista', 'Lista'], ['cartoes', 'Cartões'])),
  ], {
    summary: 'Grupo de opções exclusivas (radiogroup) em lista ou cartões selecionáveis.',
    structure: ['Legenda do grupo (fieldset/legend) + opções com círculo, rótulo e detalhe.', 'Variante em cartões: cada opção é um cartão com borda e marcação.'],
    behavior: ['Setas mudam a seleção dentro do grupo; Tab entra/sai do grupo.'],
    responsive: ['Cartões empilham em uma coluna no celular com 44 px de altura mínima.'],
  }],
  [16, 'switches', 'Switches', 'campos', 'Interruptor de liga/desliga para configurações que valem na hora.', [
    text('rotulo', 'Rótulo', 'Notificações por e-mail', 'label'),
    text('descricao', 'Descrição', 'Receba um resumo diário das atividades.', 'help'),
    sel('posicao', 'Posição do interruptor', 'direita', opt(['direita', 'À direita'], ['esquerda', 'À esquerda'])),
    SIZE(),
    state('ligado', 'Ligado', true),
  ], {
    summary: 'Interruptor binário com efeito imediato, rótulo e descrição.',
    structure: ['Trilho + botão deslizante; rótulo e descrição ao lado.', 'role="switch" com aria-checked.'],
    behavior: ['Clique ou Espaço alterna com animação de 150 ms; mudança salva na hora (sem botão salvar).'],
    responsive: ['Linhas de configuração com 48 px de altura no celular; interruptor alinhado à direita.'],
  }],
  [17, 'sliders', 'Sliders', 'campos', 'Barra deslizante para escolher um valor ou uma faixa de valores.', [
    text('rotulo', 'Rótulo', 'Faixa de preço', 'label'),
    num('valor', 'Valor (%)', 62, 0, 100, 1, '%', 'Estados'),
    bool('faixa', 'Faixa (dois controles)', true),
    bool('mostrarValor', 'Mostrar valor', true),
    text('prefixo', 'Prefixo do valor', 'R$', 'value'),
    bool('marcas', 'Marcas de escala', false),
  ], {
    summary: 'Controle deslizante de valor único ou faixa, com trilho preenchido e valores visíveis.',
    structure: ['Rótulo e valor atual acima; trilho com porção preenchida na primária; polegar(es).', 'Marcas opcionais de escala abaixo.'],
    behavior: ['Arrastar, clicar no trilho ou usar setas (Shift = passo maior); role="slider" com aria-valuenow.', 'Polegar com anel de foco e leve aumento no active.'],
    responsive: ['No celular, polegar com área de toque de 44 px; ofereça campo numérico como alternativa.'],
  }],
  [18, 'date-pickers', 'Date pickers', 'campos', 'Campo de data que abre um calendário para escolher o dia.', [
    text('rotulo', 'Rótulo', 'Data de entrega', 'label'),
    text('valor', 'Data escolhida', '14/03/2025', 'field'),
    text('mes', 'Mês exibido', 'Março 2025', 'title'),
    bool('aberto', 'Mostrar calendário aberto', true),
    bool('intervalo', 'Seleção de intervalo', false),
  ], {
    summary: 'Campo de data com máscara dd/mm/aaaa e calendário suspenso mensal.',
    structure: ['Campo com ícone de calendário; popover com navegação de mês, grade 7 × 6 e ações Hoje/Limpar.', 'Dia atual com contorno, dia selecionado preenchido na primária; intervalo com faixa tonal.'],
    behavior: ['Digitação direta com validação; setas navegam pelos dias, PageUp/PageDown trocam o mês, Esc fecha.'],
    responsive: ['No celular, o calendário abre como bottom sheet ou usa input type="date" nativo; células com 40 px.'],
  }],
  [19, 'time-pickers', 'Time pickers', 'campos', 'Campo para escolher um horário, com lista de horários ou colunas de horas e minutos.', [
    text('rotulo', 'Rótulo', 'Horário da reunião', 'label'),
    text('valor', 'Horário escolhido', '14:30', 'field'),
    sel('formato', 'Formato', '24h', opt(['24h', '24 horas'], ['12h', '12 horas (AM/PM)'])),
    sel('intervalo', 'Intervalo entre horários', '30', opt(['15', '15 min'], ['30', '30 min'], ['60', '1 hora'])),
    bool('aberto', 'Mostrar opções abertas', true),
  ], {
    summary: 'Seletor de horário com campo mascarado e colunas de horas/minutos ou lista de intervalos.',
    structure: ['Campo com ícone de relógio; popover com colunas roláveis (horas, minutos, AM/PM).', 'Horário selecionado destacado; horários indisponíveis desabilitados.'],
    behavior: ['Digitação direta; setas incrementam; Enter confirma; Esc fecha.'],
    responsive: ['No celular, use input type="time" nativo ou bottom sheet com colunas de 44 px.'],
  }],
  [20, 'upload-dropzone', 'Upload e dropzone', 'campos', 'Área para arrastar ou escolher arquivos, com progresso do envio.', [
    text('titulo', 'Título', 'Arraste arquivos para cá', 'title'),
    text('subtitulo', 'Instrução', 'PNG, JPG ou PDF até 10 MB', 'help'),
    text('botao', 'Texto do botão', 'Selecionar arquivos', 'button'),
    icon('icone', 'Ícone', 'CloudUpload'),
    bool('mostrarArquivo', 'Mostrar arquivo enviando', true),
    num('progresso', 'Progresso do envio', 64, 0, 100, 1, '%', 'Estados'),
    state('arrastando', 'Arquivo sobre a área (drag over)'),
  ], {
    summary: 'Zona de soltar arquivos com botão de seleção, validação de tipo/tamanho e lista de envios com progresso.',
    structure: ['Área tracejada com ícone, título, instrução e botão.', 'Lista de arquivos: ícone do tipo, nome, tamanho, barra de progresso e remover.'],
    behavior: ['Drag over destaca a área (borda primária + fundo tonal).', 'Erros por arquivo (tipo/tamanho) com mensagem; cancelar envio; input file acessível pelo teclado.'],
    responsive: ['No celular, oculte o texto "arraste" e mostre só o botão de escolher; nomes longos truncam no meio.'],
  }],
  [21, 'campos-senha', 'Campos de senha', 'campos', 'Campo de senha com botão de mostrar/ocultar e medidor de força.', [
    text('rotulo', 'Rótulo', 'Senha', 'label'),
    sel('forca', 'Força exibida', 'media', opt(['fraca', 'Fraca'], ['media', 'Média'], ['forte', 'Forte']), 'Estados'),
    bool('requisitos', 'Mostrar requisitos', true),
    bool('linkEsqueci', 'Link "Esqueci minha senha"', true),
    state('visivel', 'Senha visível'),
  ], {
    summary: 'Campo de senha com alternância de visibilidade, medidor de força em segmentos e lista de requisitos.',
    structure: ['Rótulo (+ link "Esqueci" à direita) → campo com botão olho → medidor de 4 segmentos → requisitos com check.'],
    behavior: ['Botão olho com aria-label "Mostrar senha"/"Ocultar senha" e aria-pressed.', 'Medidor atualiza ao digitar; autocomplete="new-password" no cadastro e "current-password" no login.'],
    responsive: ['Fonte 16 px no celular; requisitos em uma coluna; botão olho com 44 px de área.'],
  }],
  [22, 'formularios', 'Formulários', 'campos', 'Conjunto completo de campos com título, botão de envio e mensagens de validação.', [
    text('titulo', 'Título', 'Fale com a gente', 'title'),
    text('descricao', 'Descrição', 'Respondemos em até 1 dia útil.', 'body'),
    text('botao', 'Botão de envio', 'Enviar mensagem', 'button'),
    sel('colunas', 'Colunas no desktop', '2', opt(['1', 'Uma coluna'], ['2', 'Duas colunas'])),
    bool('termos', 'Checkbox de termos', true),
    state('enviando', 'Enviando'),
  ], {
    summary: 'Formulário com título, campos agrupados, validação por campo e ação primária no rodapé.',
    structure: ['Título + descrição → grade de campos (1 ou 2 colunas) → termos → ações (primária à direita/largura total).', 'Campos relacionados lado a lado (nome/sobrenome), mensagens abaixo de cada campo.'],
    behavior: ['Validação ao sair do campo e no envio; resumo de erros no topo com links para os campos.', 'Botão mostra "Enviando…" com spinner e fica desabilitado; nunca apague o que foi digitado.'],
    responsive: ['Uma coluna no celular; botão de envio com largura total e visível com o teclado aberto; Enter avança/envia.'],
  }],

  /* ---------------------------- Botões e navegação ---------------------------- */
  [23, 'botoes', 'Botões', 'navegacao', 'O botão de ação: o texto, o ícone, o tamanho e o estilo de cada um.', [
    text('texto', 'Texto do botão', 'Começar agora', 'label'),
    icon('icone', 'Ícone', 'ArrowRight'),
    sel('posicaoIcone', 'Posição do ícone', 'direita', opt(['esquerda', 'À esquerda'], ['direita', 'À direita'], ['nenhum', 'Sem ícone'], ['somente', 'Somente ícone'])),
    sel('variante', 'Variante', 'primario', opt(['primario', 'Primário'], ['secundario', 'Secundário'], ['fantasma', 'Fantasma'], ['perigo', 'Perigo'])),
    bool('mostrarSecundario', 'Mostrar botão secundário ao lado', true),
    text('textoSecundario', 'Texto do secundário', 'Saiba mais', 'secondary'),
    SIZE(),
    bool('larguraTotal', 'Largura total', false, 'Tamanho'),
    state('carregando', 'Carregando'),
  ], {
    summary: 'Botões com variantes (primário, secundário, fantasma, perigo), tamanhos, ícone opcional e estados completos.',
    structure: ['Conteúdo: [ícone] texto [ícone]; gap de 8 px; ícone de 16–18 px.', 'Hierarquia: um primário por área; secundário ao lado com menos peso.', 'Sempre <button> (ou <a> para navegação) com type correto.'],
    behavior: ['Hover: fundo primária-hover; active: primária-active + leve pressão; focus-visible com estilo de foco da família.', 'Disabled: fundo/texto desabilitados, sem sombra; carregando: spinner no lugar do ícone e aria-busy.'],
    responsive: ['Altura mínima de 44 px no celular; em grupos, empilham com largura total quando não cabem lado a lado.'],
    measurements: { alturaSm: '32–36 px', alturaMd: '40–44 px', alturaLg: '48–52 px' },
  }],
  [24, 'botoes-icone', 'Botões de ícone', 'navegacao', 'Botões só com ícone, como favoritar, fechar ou compartilhar.', [
    icon('icone', 'Ícone', 'Heart'),
    text('rotuloAcessivel', 'Rótulo acessível (lido por leitores de tela)', 'Favoritar', 'label'),
    sel('variante', 'Variante', 'suave', opt(['solido', 'Sólido'], ['suave', 'Suave'], ['contorno', 'Contorno'], ['fantasma', 'Fantasma'])),
    sel('formato', 'Formato', 'familia', opt(['familia', 'Da família'], ['circulo', 'Círculo'], ['quadrado', 'Quadrado'])),
    num('tamanho', 'Tamanho', 44, 32, 56, 2, 'px'),
    bool('contador', 'Selo de contador', true),
    state('ativo', 'Ativado (toggle)'),
  ], {
    summary: 'Botões quadrados/circulares apenas com ícone, com rótulo acessível, tooltip e estado de toggle.',
    structure: ['Contêiner quadrado com ícone centralizado; selo de contador opcional no canto superior direito.', 'aria-label obrigatório + tooltip com o mesmo texto.'],
    behavior: ['Toggle com aria-pressed (ex.: favoritar preenche o ícone).', 'Hover com fundo de hover; foco visível; disabled com opacidade.'],
    responsive: ['Área de toque mínima de 44 × 44 px no celular, mesmo que o desenho seja menor.'],
  }],
  [25, 'headers-topbars', 'Headers e topbars', 'navegacao', 'A barra do topo com logo, links do menu, busca e botão de ação.', [
    text('logo', 'Nome da marca', 'Nimbo', 'logo'),
    area('links', 'Links (um por linha)', 'Produto\nPreços\nRecursos\nContato', 'links'),
    num('ativo', 'Link ativo', 1, 1, 6, 1, undefined, 'Estados'),
    text('cta', 'Botão de ação', 'Começar', 'cta'),
    bool('busca', 'Mostrar busca', true),
    bool('avatar', 'Mostrar avatar', false),
    sel('altura', 'Altura', 'padrao', opt(['compacta', 'Compacta (52 px)'], ['padrao', 'Padrão (64 px)'], ['alta', 'Alta (76 px)']), 'Tamanho'),
  ], {
    summary: 'Barra superior com marca, navegação primária, busca e ação principal/avatar.',
    structure: ['Esquerda: logo; centro/esquerda: links com item ativo marcado; direita: busca, CTA ou avatar.', 'position: sticky; top: 0; z-index acima do conteúdo.', '<header> com <nav aria-label="Principal">.'],
    behavior: ['Item ativo com aria-current="page"; hover nos links; menus suspensos abrem por clique e teclado.', 'Ao rolar, pode ganhar borda inferior ou sombra conforme a família.'],
    responsive: ['No celular, links vão para a navegação móvel aprovada (hamburguer/drawer/bottom nav); logo e ação principal permanecem; altura 56 px.'],
    measurements: { altura: '56–64 px', larguraMaximaConteudo: '1200–1280 px' },
  }],
  [26, 'sidebars', 'Sidebars', 'navegacao', 'O menu lateral com a marca, as seções do sistema e o usuário no rodapé.', [
    text('marca', 'Nome da marca', 'Nimbo', 'logo'),
    text('secao', 'Título da seção', 'Workspace', 'section'),
    area('itens', 'Itens (um por linha)', 'Início\nProjetos\nRelatórios\nEquipe\nAjustes', 'items'),
    num('ativo', 'Item ativo', 2, 1, 8, 1, undefined, 'Estados'),
    bool('icones', 'Mostrar ícones', true),
    bool('usuario', 'Mostrar usuário no rodapé', true),
    state('recolhida', 'Recolhida (só ícones)'),
  ], {
    summary: 'Navegação lateral com marca, grupos de itens com ícone, item ativo e área do usuário.',
    structure: ['Topo: marca; meio: seções com título e itens (ícone + texto + contador opcional); rodapé: usuário/ajustes.', 'Estado recolhido (rail) mostra só ícones com tooltip.'],
    behavior: ['Item ativo com aria-current; hover com fundo; grupos recolhíveis por teclado.', 'Botão de recolher persiste a preferência.'],
    responsive: ['No celular, segue exatamente a arquitetura mobile aprovada (não transforme em drawer por conta própria).'],
    measurements: { largura: '240–272 px', larguraRecolhida: '64–72 px' },
  }],
  [27, 'tabs', 'Tabs', 'navegacao', 'Abas para alternar entre partes do conteúdo sem sair da página.', [
    area('abas', 'Abas (uma por linha)', 'Visão geral\nAtividade\nArquivos\nAjustes', 'tabs'),
    num('ativa', 'Aba ativa', 1, 1, 6, 1, undefined, 'Estados'),
    sel('estilo', 'Estilo', 'familia', opt(['familia', 'Da família'], ['sublinhado', 'Sublinhado'], ['pilula', 'Pílula'], ['cartao', 'Cartão'])),
    bool('contador', 'Mostrar contador', true),
    bool('icones', 'Mostrar ícones', false),
  ], {
    summary: 'Abas (tablist) com indicador de aba ativa, contadores opcionais e painel associado.',
    structure: ['role="tablist" com role="tab" (aria-selected, aria-controls) e role="tabpanel".', 'Indicador de ativo conforme a família (sublinhado, pílula, bloco, barra).'],
    behavior: ['Setas movem entre abas, Home/End vão ao início/fim; troca de painel sem recarregar.'],
    responsive: ['No celular, abas rolam horizontalmente dentro do próprio contêiner (sem overflow da página) com a ativa visível; ou viram select.'],
  }],
  [28, 'segmented-controls', 'Segmented controls', 'navegacao', 'Botões colados para alternar visualizações, como Dia / Semana / Mês.', [
    area('opcoes', 'Opções (uma por linha)', 'Dia\nSemana\nMês', 'options'),
    num('ativa', 'Opção ativa', 2, 1, 5, 1, undefined, 'Estados'),
    bool('larguraTotal', 'Largura total', false, 'Tamanho'),
    bool('icones', 'Mostrar ícones', false),
  ], {
    summary: 'Grupo de opções exclusivas em trilho único com segmento ativo destacado.',
    structure: ['Trilho com 2–5 segmentos de largura igual; segmento ativo elevado/preenchido.', 'role="radiogroup" ou botões com aria-pressed.'],
    behavior: ['Transição do indicador deslizando (150–200 ms); setas trocam a opção.'],
    responsive: ['No celular, ocupa a largura total; acima de 4 opções, prefira select ou abas roláveis.'],
  }],
  [29, 'breadcrumbs', 'Breadcrumbs', 'navegacao', 'A trilha que mostra onde você está: Início › Produtos › Detalhe.', [
    area('caminho', 'Caminho (um nível por linha)', 'Início\nProjetos\nNimbo App\nConfigurações', 'path'),
    sel('separador', 'Separador', 'chevron', opt(['chevron', 'Seta ›'], ['barra', 'Barra /'], ['ponto', 'Ponto ·'])),
    bool('iconeInicio', 'Ícone de início', true),
    bool('recolher', 'Recolher níveis do meio (…)', false),
  ], {
    summary: 'Trilha de navegação hierárquica com links para os níveis anteriores e página atual em destaque.',
    structure: ['<nav aria-label="Trilha"> com <ol>; último item com aria-current="page" sem link.', 'Separadores decorativos (aria-hidden).'],
    behavior: ['Links com hover sublinhado; nível recolhido "…" abre menu com os níveis ocultos.'],
    responsive: ['No celular, mostre apenas "‹ nível anterior" ou recolha os níveis do meio; nunca quebre a página na horizontal.'],
  }],
  [30, 'menus-contextuais', 'Menus contextuais', 'navegacao', 'O menu que aparece ao clicar nos "três pontinhos" ou com o botão direito.', [
    text('titulo', 'Título do menu', 'Projeto Nimbo', 'title'),
    area('itens', 'Itens (um por linha)', 'Editar\nDuplicar\nCompartilhar\nArquivar', 'items'),
    text('perigo', 'Ação destrutiva', 'Excluir', 'danger'),
    num('destacado', 'Item em foco', 2, 1, 6, 1, undefined, 'Estados'),
    bool('atalhos', 'Mostrar atalhos', true),
    bool('icones', 'Mostrar ícones', true),
  ], {
    summary: 'Menu flutuante (role="menu") com itens, ícones, atalhos, separadores e ação destrutiva no fim.',
    structure: ['Cabeçalho opcional → itens (ícone, texto, atalho) → separador → ação destrutiva em vermelho.', 'Ancorado ao gatilho, com seta opcional.'],
    behavior: ['Abre por clique/Shift+F10/botão direito; setas navegam; Enter ativa; Esc fecha e devolve o foco.', 'Fecha ao clicar fora.'],
    responsive: ['No celular, vira bottom sheet com itens de 48 px; reposiciona para não sair da viewport.'],
  }],
  [31, 'mega-menus', 'Mega menus', 'navegacao', 'Menu grande que abre com várias colunas de links e um destaque.', [
    text('gatilho', 'Texto do menu', 'Produtos', 'trigger'),
    num('colunas', 'Colunas de links', 2, 1, 3, 1, undefined, 'Aparência'),
    bool('destaque', 'Cartão de destaque', true),
    text('tituloDestaque', 'Título do destaque', 'Novo: relatórios com IA', 'feature'),
  ], {
    summary: 'Painel suspenso largo com colunas de links agrupados (ícone + título + descrição) e cartão promocional.',
    structure: ['Gatilho no header → painel com 2–3 colunas de grupos e um cartão de destaque à direita.', 'Links com ícone, título e descrição curta.'],
    behavior: ['Abre por clique (e hover com atraso de 150 ms no desktop); Esc fecha; foco preso enquanto aberto.'],
    responsive: ['No celular, vira acordeão dentro do menu móvel; o destaque vai para o fim da lista.'],
  }],
  [32, 'paginacao', 'Paginação', 'navegacao', 'Os números para navegar entre páginas de uma lista longa.', [
    num('paginaAtual', 'Página atual', 3, 1, 20, 1, undefined, 'Estados'),
    num('totalPaginas', 'Total de páginas', 12, 2, 50, 1, undefined, 'Conteúdo'),
    sel('estilo', 'Estilo', 'numeros', opt(['numeros', 'Números'], ['simples', 'Anterior / Próxima'], ['compacta', 'Compacta (3 de 12)'])),
    bool('mostrarTotal', 'Mostrar "Mostrando 21–30 de 118"', true),
  ], {
    summary: 'Paginação com anterior/próxima, números com reticências e indicação da página atual.',
    structure: ['<nav aria-label="Paginação"> com botões; página atual com aria-current="page".', 'Reticências quando há mais de 7 páginas; resumo de itens à esquerda.'],
    behavior: ['Anterior desabilitado na primeira página e próxima na última; foco visível.'],
    responsive: ['No celular, mostre só anterior/próxima + "3 de 12"; botões de 44 px.'],
  }],
  [33, 'step-indicators', 'Step indicators', 'navegacao', 'Indicador de etapas de um processo, como Conta › Endereço › Pagamento.', [
    area('passos', 'Etapas (uma por linha)', 'Conta\nEndereço\nPagamento\nRevisão', 'steps'),
    num('atual', 'Etapa atual', 2, 1, 6, 1, undefined, 'Estados'),
    sel('orientacao', 'Orientação', 'horizontal', opt(['horizontal', 'Horizontal'], ['vertical', 'Vertical'])),
    bool('numeros', 'Mostrar números', true),
  ], {
    summary: 'Indicador de progresso em etapas com concluídas (check), atual (destaque) e futuras (neutras).',
    structure: ['Marcador (número/check) + rótulo + conector; lista ordenada com aria-current="step".'],
    behavior: ['Etapas concluídas podem ser clicáveis para voltar; futuras desabilitadas.'],
    responsive: ['No celular, horizontal vira "Etapa 2 de 4" + barra de progresso, ou lista vertical.'],
  }],
  [34, 'drawers', 'Drawers', 'navegacao', 'Painel que desliza da lateral (ou de baixo) com filtros, detalhes ou menu.', [
    text('titulo', 'Título', 'Filtros', 'title'),
    text('botao', 'Botão principal', 'Aplicar filtros', 'button'),
    sel('lado', 'Lado', 'direita', opt(['direita', 'Direita'], ['esquerda', 'Esquerda'], ['baixo', 'Baixo (bottom sheet)'])),
    bool('rodape', 'Rodapé com ações', true),
    bool('overlay', 'Escurecer o fundo', true),
  ], {
    summary: 'Painel deslizante modal com cabeçalho, conteúdo rolável e rodapé de ações fixo.',
    structure: ['Overlay + painel ancorado à borda; cabeçalho (título + fechar), corpo rolável, rodapé fixo.', 'role="dialog" aria-modal="true".'],
    behavior: ['Abre com animação de 200–250 ms; Esc, clique no overlay e botão fechar fecham; foco preso e devolvido ao gatilho.'],
    responsive: ['No celular, largura de até 88vw (lateral) ou bottom sheet com altura máxima de 90dvh e alça de arraste.'],
    measurements: { largura: '360–420 px' },
  }],

  /* ---------------------------- Dados e componentes ---------------------------- */
  [35, 'cards', 'Cards', 'dados', 'Cartões que agrupam uma informação: imagem, título, texto e ação.', [
    text('titulo', 'Título', 'Viagem a Lisboa', 'title'),
    area('texto', 'Texto', '7 dias com roteiro guiado, hospedagem e passeios inclusos.', 'body'),
    text('etiqueta', 'Etiqueta', 'Novo', 'badge'),
    text('botao', 'Botão', 'Ver detalhes', 'button'),
    icon('icone', 'Ícone', 'Plane'),
    sel('layout', 'Layout', 'vertical', opt(['vertical', 'Vertical'], ['horizontal', 'Horizontal'])),
    bool('midia', 'Mostrar imagem/ilustração', true),
    bool('rodape', 'Mostrar rodapé', true),
  ], {
    summary: 'Cartão de conteúdo com mídia, etiqueta, título, texto, metadados e ação.',
    structure: ['Mídia (aspect-ratio 16/9) → etiqueta → título → texto (até 3 linhas) → rodapé com meta e ação.', 'O cartão inteiro pode ser clicável (link estendido) sem aninhar botões.'],
    behavior: ['Hover conforme a família (elevação, borda ou deslocamento); foco visível no link principal.'],
    responsive: ['Altura definida pelo conteúdo; grade de cards reduz colunas (3 → 2 → 1); horizontal vira vertical no celular.'],
  }],
  [36, 'kpis-stat-cards', 'KPIs e stat cards', 'dados', 'Cartões de número importante, como receita do mês, com variação e mini gráfico.', [
    text('rotulo', 'Rótulo', 'Receita mensal', 'label'),
    text('valor', 'Valor', 'R$ 48,2 mil', 'value'),
    text('variacao', 'Variação', '+12,4%', 'delta'),
    text('comparativo', 'Comparativo', 'vs. mês anterior', 'help'),
    icon('icone', 'Ícone', 'Wallet'),
    sel('tendencia', 'Tendência', 'alta', opt(['alta', 'Alta (positiva)'], ['baixa', 'Baixa (negativa)'], ['neutra', 'Neutra'])),
    bool('sparkline', 'Mini gráfico', true),
  ], {
    summary: 'Cartão de indicador com rótulo, valor em destaque, variação colorida e mini gráfico de tendência.',
    structure: ['Rótulo + ícone → valor grande (tabular-nums) → variação (seta + %) e comparativo → sparkline.', 'Variação positiva em sucesso, negativa em erro, neutra em texto secundário.'],
    behavior: ['Tooltip no sparkline com valores; clique abre o relatório detalhado.'],
    responsive: ['Grade de KPIs: 4 → 2 → 1 colunas (ou 2 colunas compactas no celular); valor reduz com clamp() sem cortar.'],
  }],
  [37, 'tabelas', 'Tabelas', 'dados', 'Tabela com linhas e colunas para comparar dados, com cabeçalho e status.', [
    text('titulo', 'Título', 'Pedidos recentes', 'title'),
    area('colunas', 'Colunas (uma por linha)', 'Cliente\nStatus\nValor\nData', 'columns'),
    num('linhas', 'Linhas de exemplo', 4, 2, 6, 1, undefined, 'Conteúdo'),
    area('dados', 'Linhas (uma por linha, colunas separadas por “|”)', '', 'rows', 'Vazio = linhas de exemplo. Colunas chamadas Status/Situação viram etiquetas coloridas.'),
    DENSITY(),
    bool('zebra', 'Linhas zebradas', false),
    sel('cabecalho', 'Estilo do cabeçalho', 'destacado', opt(['simples', 'Simples'], ['destacado', 'Destacado'], ['escuro', 'Escuro'])),
    bool('selecao', 'Seleção com checkbox', true),
    bool('acoes', 'Ações por linha', true),
  ], {
    summary: 'Tabela de dados com cabeçalho, linhas com status em badge, valores alinhados à direita e ações por linha.',
    structure: ['Título + ações da tabela → <table> semântica (<thead>, <th scope="col">) → linhas.', 'Números alinhados à direita com tabular-nums; status como badge; ações no fim.', 'Estados de carregando (skeleton), vazio e erro.'],
    behavior: ['Hover na linha; seleção com checkbox no cabeçalho (todos/indeterminado); ordenação por clique no cabeçalho com aria-sort.'],
    responsive: ['No celular: rolagem horizontal local dentro do contêiner (overflow-x: auto) com a primeira coluna fixa, ou representação em cartões (cada linha vira um cartão rótulo: valor).'],
  }],
  [38, 'grids-de-dados', 'Data grids', 'dados', 'Tabela avançada com filtros, ordenação, seleção e paginação — para muitos dados.', [
    text('titulo', 'Título', 'Clientes', 'title'),
    bool('filtros', 'Barra de filtros', true),
    bool('ordenacao', 'Indicadores de ordenação', true),
    num('linhaSelecionada', 'Linha selecionada', 2, 0, 5, 1, undefined, 'Estados'),
    DENSITY('compacta'),
    bool('rodape', 'Rodapé com paginação', true),
  ], {
    summary: 'Grade de dados interativa com barra de filtros, colunas ordenáveis/redimensionáveis, seleção de linhas e paginação.',
    structure: ['Barra: busca, filtros como chips, ações em massa → cabeçalho fixo (sticky) → linhas virtualizadas → rodapé com contagem e paginação.', 'Colunas com ícone de ordenação; linha selecionada com fundo selected.'],
    behavior: ['Navegação por teclado entre células (role="grid"); Shift+clique seleciona intervalo; ações em massa aparecem com seleção.'],
    responsive: ['No celular: rolagem horizontal local com primeira coluna fixa e cabeçalho sticky, ou modo cartão; filtros vão para um drawer.'],
  }],
  [39, 'badges-tags', 'Badges e tags', 'dados', 'Etiquetas pequenas para status (Ativo, Pendente) ou categorias.', [
    area('textos', 'Etiquetas (uma por linha)', 'Ativo\nPendente\nErro\nRascunho', 'badges'),
    sel('estilo', 'Estilo', 'suave', opt(['suave', 'Suave'], ['solido', 'Sólido'], ['contorno', 'Contorno'], ['ponto', 'Com ponto'])),
    sel('formato', 'Formato', 'familia', opt(['familia', 'Da família'], ['pilula', 'Pílula'], ['quadrado', 'Quadrado'])),
    bool('removivel', 'Removível (×)', false),
    color('cor', 'Cor personalizada da 1ª etiqueta', 'badge'),
  ], {
    summary: 'Etiquetas compactas para status semânticos e categorias, com variantes suave, sólida, contorno e ponto.',
    structure: ['Altura 22–26 px, texto 12 px peso 600, padding horizontal 8–10 px.', 'Cores semânticas: sucesso, aviso, erro, neutro; nunca só cor — o texto diz o status.'],
    behavior: ['Tags removíveis têm botão × com aria-label "Remover <tag>".'],
    responsive: ['Grupos de tags quebram linha; textos longos truncam com reticências e title completo.'],
  }],
  [40, 'listas', 'Listas', 'dados', 'Listas de itens com avatar, texto, detalhe e ação — pessoas, arquivos, mensagens.', [
    text('titulo', 'Título', 'Equipe', 'title'),
    area('itens', 'Itens (Nome — detalhe, um por linha)', 'Ana Souza — Design\nBruno Lima — Produto\nCarla Dias — Engenharia', 'items'),
    bool('avatares', 'Avatares', true),
    bool('divisores', 'Divisores', true),
    sel('acao', 'Ação à direita', 'chevron', opt(['chevron', 'Seta'], ['switch', 'Interruptor'], ['botao', 'Botão'], ['nenhuma', 'Nenhuma'])),
  ], {
    summary: 'Lista vertical de itens com elemento inicial (avatar/ícone), texto em duas linhas e elemento final (meta/ação).',
    structure: ['Item: [avatar] título + subtítulo ··· [meta/ação]; divisórias recuadas.', '<ul> semântica; item clicável como um único alvo.'],
    behavior: ['Hover/pressed por item; seleção com fundo selected; swipe actions opcionais no celular.'],
    responsive: ['Itens com 56–64 px de altura no celular; textos truncam em uma linha com o título completo acessível.'],
  }],
  [41, 'graficos', 'Gráficos', 'dados', 'Gráficos de barras, linhas, área ou pizza para mostrar números de forma visual.', [
    text('titulo', 'Título', 'Vendas por mês', 'title'),
    sel('tipo', 'Tipo', 'barras', opt(['barras', 'Barras'], ['linha', 'Linha'], ['area', 'Área'], ['pizza', 'Rosca'])),
    num('series', 'Séries', 2, 1, 2, 1, undefined, 'Conteúdo'),
    bool('legenda', 'Legenda', true),
    bool('grade', 'Linhas de grade', true),
    bool('valores', 'Rótulos de valores', false),
  ], {
    summary: 'Gráfico com título, eixos, grade discreta, séries nas cores da paleta e legenda.',
    structure: ['Cabeçalho (título + filtro de período) → área do gráfico → legenda.', 'Série 1 na primária, série 2 no destaque; grade em borda a 50%.', 'Tabela alternativa ou aria-label descritivo para acessibilidade.'],
    behavior: ['Tooltip no hover/toque com valores; legenda clicável liga/desliga séries.'],
    responsive: ['No celular: menos rótulos no eixo X (a cada 2–3), legenda abaixo do gráfico, altura mínima de 200 px, valores nunca cortados.'],
  }],
  [42, 'timelines', 'Timelines', 'dados', 'Linha do tempo com eventos em ordem, como o rastreio de um pedido.', [
    area('itens', 'Eventos (Título — hora, um por linha)', 'Pedido criado — 09:12\nPagamento aprovado — 09:15\nEnviado — 14:02\nEntregue — previsto', 'items'),
    num('atual', 'Evento atual', 3, 1, 6, 1, undefined, 'Estados'),
    sel('orientacao', 'Orientação', 'vertical', opt(['vertical', 'Vertical'], ['horizontal', 'Horizontal'])),
    bool('icones', 'Ícones nos marcadores', true),
  ], {
    summary: 'Sequência cronológica com marcadores, conector, título, horário e estado (concluído/atual/futuro).',
    structure: ['Marcador + conector vertical; conteúdo com título, horário e descrição opcional.', 'Concluídos na primária, atual com destaque/anel, futuros neutros.'],
    behavior: ['Itens podem expandir detalhes; ordem cronológica clara (lista ordenada).'],
    responsive: ['Horizontal vira vertical no celular; horários abaixo do título.'],
  }],
  [43, 'accordions', 'Accordions', 'dados', 'Perguntas que abrem e fecham para mostrar a resposta, como num FAQ.', [
    area('itens', 'Perguntas (uma por linha)', 'Como funciona o teste grátis?\nPosso cancelar quando quiser?\nVocês emitem nota fiscal?', 'items'),
    area('resposta', 'Resposta do item aberto', 'Você usa todos os recursos por 14 dias, sem cartão de crédito.', 'body'),
    num('aberto', 'Item aberto', 1, 0, 5, 1, undefined, 'Estados'),
    sel('icone', 'Ícone', 'chevron', opt(['chevron', 'Seta'], ['mais', 'Mais / menos'])),
    bool('separados', 'Itens separados (cartões)', false),
  ], {
    summary: 'Lista de seções recolhíveis com cabeçalho clicável, ícone de estado e painel animado.',
    structure: ['Cabeçalho <button aria-expanded aria-controls> + painel (region); ícone gira ao abrir.', 'Itens divididos por linha ou separados em cartões.'],
    behavior: ['Enter/Espaço alternam; animação de altura 200 ms; opção de vários abertos ao mesmo tempo.'],
    responsive: ['Cabeçalhos com 48 px de altura mínima no celular; textos quebram linha.'],
  }],
  [44, 'avatares', 'Avatares', 'dados', 'A foto ou as iniciais da pessoa, com indicador de online e grupos.', [
    text('nome', 'Nome', 'Ana Souza', 'name'),
    sel('tipo', 'Tipo', 'iniciais', opt(['iniciais', 'Iniciais'], ['ilustracao', 'Ilustração'], ['icone', 'Ícone'])),
    sel('status', 'Status', 'online', opt(['online', 'Online'], ['ausente', 'Ausente'], ['ocupado', 'Ocupado'], ['nenhum', 'Sem status']), 'Estados'),
    sel('formato', 'Formato', 'circulo', opt(['circulo', 'Círculo'], ['quadrado', 'Quadrado arredondado'])),
    num('tamanho', 'Tamanho', 52, 28, 72, 2, 'px'),
    bool('grupo', 'Mostrar grupo empilhado', true),
    color('cor', 'Cor de fundo', 'avatar'),
  ], {
    summary: 'Avatar com imagem/iniciais/ícone, tamanhos padronizados, indicador de status e grupo empilhado (+N).',
    structure: ['Tamanhos 24/32/40/56/72 px; iniciais em peso 600; status no canto inferior direito com borda da superfície.', 'Grupo: sobreposição de −8 px com anel da superfície e contador "+N".'],
    behavior: ['Fallback para iniciais quando a imagem falha; alt com o nome.'],
    responsive: ['Grupos mostram menos avatares no celular (máx. 3 + contador).'],
  }],
  [45, 'calendarios', 'Calendários', 'dados', 'Calendário do mês com eventos marcados, como uma agenda.', [
    text('mes', 'Mês', 'Março 2025', 'title'),
    num('diaSelecionado', 'Dia selecionado', 14, 1, 31, 1, undefined, 'Estados'),
    sel('visao', 'Visão', 'mes', opt(['mes', 'Mês'], ['agenda', 'Agenda (lista)'])),
    bool('eventos', 'Mostrar eventos', true),
    sel('inicioSemana', 'Semana começa em', 'dom', opt(['dom', 'Domingo'], ['seg', 'Segunda'])),
  ], {
    summary: 'Calendário mensal com navegação, dia atual, dia selecionado e eventos coloridos, com visão de agenda.',
    structure: ['Cabeçalho: mês + anterior/próximo + seletor de visão; grade 7 colunas; eventos como pontos/barras.', 'role="grid" com dias como botões e aria-selected.'],
    behavior: ['Setas navegam dias; clique no dia mostra eventos; arrastar cria intervalo (opcional).'],
    responsive: ['No celular, ofereça modo agenda (lista) quando a grade mensal ficar apertada; eventos viram pontos.'],
  }],
  [46, 'quadros-kanban', 'Quadros Kanban', 'dados', 'Quadro com colunas (A fazer, Fazendo, Feito) e cartões de tarefas.', [
    area('colunas', 'Colunas (uma por linha)', 'A fazer\nFazendo\nFeito', 'columns'),
    num('cartoes', 'Cartões por coluna', 2, 1, 3, 1, undefined, 'Conteúdo'),
    area('tarefas', 'Cartões (um por linha: Coluna | Título | Etiqueta | Data)', '', 'columns', 'Vazio = cartões de exemplo.'),
    bool('contadores', 'Contadores', true),
    bool('etiquetas', 'Etiquetas nos cartões', true),
    bool('avatares', 'Avatares nos cartões', true),
  ], {
    summary: 'Quadro de colunas com cartões arrastáveis, contadores e ação de adicionar.',
    structure: ['Colunas lado a lado (largura fixa 260–300 px) com título, contador e "+"; cartões com etiqueta, título, avatar e data.'],
    behavior: ['Arrastar e soltar entre colunas com alternativa por teclado (mover para…); placeholder durante o arraste.'],
    responsive: ['No celular, colunas rolam horizontalmente com scroll-snap (uma por vez) ou abas por coluna.'],
  }],
  [47, 'barras-progresso', 'Barras de progresso', 'dados', 'Barra que mostra quanto de uma tarefa já foi concluído.', [
    text('rotulo', 'Rótulo', 'Enviando arquivos', 'label'),
    text('detalhe', 'Texto abaixo da barra', '3 de 5 arquivos · cerca de 20 s restantes', 'label'),
    num('valor', 'Progresso', 68, 0, 100, 1, '%', 'Estados'),
    sel('tipo', 'Tipo', 'linear', opt(['linear', 'Linear'], ['circular', 'Circular'], ['etapas', 'Em segmentos'])),
    bool('percentual', 'Mostrar porcentagem', true),
    bool('listrado', 'Listrado animado', false),
    SIZE(),
  ], {
    summary: 'Indicador de progresso determinado (linear, circular ou segmentado) com rótulo e porcentagem.',
    structure: ['role="progressbar" com aria-valuenow/min/max; trilho neutro e preenchimento na primária.', 'Rótulo à esquerda e porcentagem à direita.'],
    behavior: ['Transição de largura 300 ms; estado indeterminado com animação contínua; respeita prefers-reduced-motion.'],
    responsive: ['Largura fluida; rótulo e porcentagem quebram em duas linhas em telas estreitas.'],
  }],
  [48, 'empty-states', 'Empty states', 'dados', 'O que aparece quando ainda não há nada: explicação amigável e um botão para começar.', [
    text('titulo', 'Título', 'Nenhum projeto ainda', 'title'),
    area('texto', 'Texto', 'Crie seu primeiro projeto para organizar tarefas e convidar a equipe.', 'body'),
    text('botao', 'Botão', 'Criar projeto', 'button'),
    icon('icone', 'Ícone', 'FolderOpen'),
    bool('secundaria', 'Ação secundária', true),
  ], {
    summary: 'Estado vazio com ilustração/ícone, título, explicação curta e ação principal.',
    structure: ['Centralizado: ícone/ilustração → título → texto (máx. 2 linhas) → ação primária + link secundário.'],
    behavior: ['Variações: primeiro uso, busca sem resultados (com "Limpar filtros") e erro (com "Tentar novamente").'],
    responsive: ['Ilustração reduz no celular; botões com largura total.'],
  }],
  [49, 'skeleton-loaders', 'Skeleton loaders', 'dados', 'Blocos cinza que imitam o conteúdo enquanto ele carrega.', [
    sel('layout', 'Layout', 'cartao', opt(['cartao', 'Cartão'], ['lista', 'Lista'], ['tabela', 'Tabela'], ['perfil', 'Perfil'])),
    num('linhas', 'Linhas', 3, 1, 5, 1, undefined, 'Conteúdo'),
    sel('animacao', 'Animação', 'brilho', opt(['pulso', 'Pulso'], ['brilho', 'Brilho'], ['nenhuma', 'Nenhuma'])),
  ], {
    summary: 'Placeholders com a forma do conteúdo final (texto, avatar, mídia) e animação de brilho/pulso.',
    structure: ['Formas na cor de superfície alternativa com o mesmo raio da família; larguras variadas para texto.'],
    behavior: ['aria-busy="true" no contêiner; animação de 1,2–1,6 s; desliga com prefers-reduced-motion.'],
    responsive: ['Skeletons seguem o mesmo layout responsivo do conteúdo real, evitando saltos (CLS).'],
  }],

  /* ---------------------------- Sobreposições e alertas ---------------------------- */
  [50, 'modais', 'Modais', 'sobreposicoes', 'Janela que aparece por cima da página pedindo atenção ou confirmação.', [
    text('titulo', 'Título', 'Excluir projeto?', 'title'),
    area('texto', 'Texto', 'Esta ação não pode ser desfeita. Todos os arquivos do projeto serão removidos.', 'body'),
    text('botaoPrimario', 'Botão principal', 'Excluir projeto', 'primary'),
    text('botaoSecundario', 'Botão secundário', 'Cancelar', 'secondary'),
    sel('tipo', 'Tipo', 'perigo', opt(['confirmacao', 'Confirmação'], ['perigo', 'Ação perigosa'], ['formulario', 'Formulário'], ['informativo', 'Informativo'])),
    icon('icone', 'Ícone', 'TriangleAlert'),
    bool('fechar', 'Botão fechar (×)', true),
  ], {
    summary: 'Diálogo modal com overlay, ícone, título, texto, ações e botão fechar.',
    structure: ['Overlay (45%) + painel centralizado: cabeçalho (ícone, título, ×) → corpo → rodapé com ações (secundária, primária).', 'role="dialog" aria-modal="true" aria-labelledby.'],
    behavior: ['Foco vai para o painel e fica preso; Esc e clique no overlay fecham (exceto em ações críticas); foco volta ao gatilho.', 'Ação perigosa em vermelho; animação de entrada 160 ms.'],
    responsive: ['Altura máxima de 90dvh com rolagem interna; ações sempre visíveis; no celular vira bottom sheet ou tela cheia.'],
    measurements: { largura: '420–560 px' },
  }],
  [51, 'popovers', 'Popovers', 'sobreposicoes', 'Balão com conteúdo extra que abre ao clicar em um botão.', [
    text('gatilho', 'Texto do gatilho', 'Compartilhar', 'trigger'),
    text('titulo', 'Título', 'Compartilhar projeto', 'title'),
    area('texto', 'Texto', 'Qualquer pessoa com o link poderá visualizar.', 'body'),
    text('botao', 'Botão', 'Copiar link', 'button'),
    sel('posicao', 'Posição', 'baixo', opt(['baixo', 'Abaixo'], ['cima', 'Acima'])),
    bool('seta', 'Mostrar seta', true),
  ], {
    summary: 'Painel flutuante não modal ancorado ao gatilho, com título, conteúdo e ação.',
    structure: ['Gatilho com aria-expanded + painel com seta apontando para o gatilho.', 'Conteúdo interativo (diferente do tooltip).'],
    behavior: ['Abre por clique; Esc e clique fora fecham; foco vai para o primeiro elemento.'],
    responsive: ['Reposiciona automaticamente para caber na viewport; no celular pode virar bottom sheet.'],
  }],
  [52, 'tooltips', 'Tooltips', 'sobreposicoes', 'Pequena dica que aparece ao passar o mouse ou focar em um elemento.', [
    text('texto', 'Texto da dica', 'Copiar link', 'tip'),
    text('atalho', 'Atalho', '⌘C', 'shortcut'),
    sel('gatilho', 'Elemento', 'icone', opt(['icone', 'Botão de ícone'], ['botao', 'Botão'], ['texto', 'Texto'])),
    sel('posicao', 'Posição', 'cima', opt(['cima', 'Acima'], ['baixo', 'Abaixo'])),
    bool('seta', 'Mostrar seta', true),
  ], {
    summary: 'Dica textual curta, não interativa, exibida no hover e no foco, com atalho opcional.',
    structure: ['role="tooltip" referenciado por aria-describedby; texto de até ~60 caracteres; seta opcional.', 'Fundo de alto contraste (texto sobre superfície invertida).'],
    behavior: ['Aparece após 300–500 ms no hover e imediatamente no foco; some no Esc; não contém links.'],
    responsive: ['No toque, aparece em long-press ou é substituído por rótulo visível; nunca sai da viewport.'],
  }],
  [53, 'toasts', 'Toasts', 'sobreposicoes', 'Mensagem rápida no canto da tela, como "Alterações salvas".', [
    text('titulo', 'Título', 'Alterações salvas', 'title'),
    text('texto', 'Texto', 'O projeto foi atualizado agora há pouco.', 'body'),
    text('acao', 'Ação', 'Desfazer', 'action'),
    sel('tipo', 'Tipo', 'sucesso', opt(['sucesso', 'Sucesso'], ['erro', 'Erro'], ['info', 'Informação'], ['aviso', 'Aviso'])),
    bool('fechar', 'Botão fechar', true),
    bool('progresso', 'Barra de tempo', true),
  ], {
    summary: 'Notificação temporária com ícone de tipo, título, texto, ação e fechamento automático.',
    structure: ['Ícone semântico → título + texto → ação → ×; barra de tempo opcional.', 'Pilha no canto inferior direito (desktop) com no máximo 3 visíveis; role="status" (ou "alert" para erro).'],
    behavior: ['Some após 4–6 s; pausa no hover/foco; ação Desfazer; arrastar para dispensar no celular.'],
    responsive: ['No celular, largura total com margens de 12 px, no topo ou acima da navegação inferior, respeitando a safe area.'],
  }],
  [54, 'alertas', 'Alertas', 'sobreposicoes', 'Faixa de aviso dentro da página: informação, sucesso, atenção ou erro.', [
    text('titulo', 'Título', 'Seu teste termina em 3 dias', 'title'),
    area('texto', 'Texto', 'Escolha um plano para continuar usando todos os recursos.', 'body'),
    text('acao', 'Ação', 'Ver planos', 'action'),
    sel('tipo', 'Tipo', 'aviso', opt(['info', 'Informação'], ['sucesso', 'Sucesso'], ['aviso', 'Aviso'], ['erro', 'Erro'])),
    sel('estilo', 'Estilo', 'suave', opt(['suave', 'Suave'], ['contorno', 'Contorno'], ['solido', 'Sólido'], ['barra', 'Barra lateral'])),
    bool('fechavel', 'Pode fechar', true),
  ], {
    summary: 'Alerta em linha com ícone semântico, título, texto, ação e fechamento opcional.',
    structure: ['Ícone → título + texto → ação → ×; cores do token semântico (fundo + texto).', 'role="alert" para erros urgentes, role="status" para informativos.'],
    behavior: ['Fechar remove com animação e não volta na sessão; ação como link/botão.'],
    responsive: ['No celular, a ação vai para baixo do texto; largura total.'],
  }],
  [55, 'notificacoes', 'Notificações', 'sobreposicoes', 'A central de notificações: o sino com contador e a lista de avisos.', [
    text('titulo', 'Título', 'Notificações', 'title'),
    num('naoLidas', 'Não lidas', 3, 0, 9, 1, undefined, 'Estados'),
    area('itens', 'Avisos (um por linha: Quem | o quê | quando)', '', 'title', 'Vazio = avisos de exemplo.'),
    bool('abas', 'Abas Todas / Não lidas', true),
    bool('avatares', 'Avatares', true),
    text('marcarTodas', 'Ação "marcar todas"', 'Marcar todas como lidas', 'action'),
  ], {
    summary: 'Painel de notificações com sino e contador, abas, itens lidos/não lidos e ação de marcar todas.',
    structure: ['Gatilho sino com selo numérico → painel: cabeçalho (título, marcar todas) → abas → itens (avatar, texto, tempo, ponto de não lida).'],
    behavior: ['Itens não lidos com fundo selected e ponto; clique marca como lida e navega; atualizações via aria-live.'],
    responsive: ['No celular, o painel abre em tela cheia ou bottom sheet; itens com 64 px.'],
  }],
  [56, 'carregamentos', 'Carregamentos', 'sobreposicoes', 'Indicadores de espera: spinner, pontinhos, barra ou tela de carregamento.', [
    text('texto', 'Texto', 'Carregando seus dados…', 'label'),
    sel('tipo', 'Tipo', 'spinner', opt(['spinner', 'Spinner'], ['pontos', 'Pontos'], ['barra', 'Barra indeterminada'], ['pagina', 'Tela de carregamento'])),
    SIZE(),
    bool('overlay', 'Sobre o conteúdo (overlay)', false),
  ], {
    summary: 'Indicadores de carregamento indeterminado (spinner, pontos, barra, tela) com texto de contexto.',
    structure: ['Indicador + texto; role="status" com texto acessível.', 'Overlay translúcido quando bloqueia uma área.'],
    behavior: ['Mostrar só após 300 ms (evita piscar); respeitar prefers-reduced-motion.'],
    responsive: ['Centralizado na área carregada; tela de carregamento usa 100dvh.'],
  }],
  [57, 'command-palette', 'Command palette', 'sobreposicoes', 'Caixa de comandos (⌘K) para buscar e executar ações rapidamente pelo teclado.', [
    text('placeholder', 'Placeholder', 'Digite um comando ou busque…', 'field'),
    num('destacado', 'Item em foco', 1, 1, 5, 1, undefined, 'Estados'),
    bool('grupos', 'Agrupar resultados', true),
    bool('atalhos', 'Mostrar atalhos', true),
    bool('rodape', 'Rodapé com dicas de teclado', true),
  ], {
    summary: 'Paleta de comandos modal com busca, resultados agrupados, atalhos e navegação por teclado.',
    structure: ['Campo de busca no topo → lista agrupada (Navegação, Ações) com ícone, nome e atalho → rodapé com teclas.', 'role="dialog" + combobox/listbox.'],
    behavior: ['Abre com ⌘K/Ctrl+K; setas navegam; Enter executa; Esc fecha; busca fuzzy.'],
    responsive: ['No celular, ocupa a tela toda com campo no topo; atalhos ocultos.'],
  }],

  /* ---------------------------- Páginas e experiências ---------------------------- */
  [58, 'dashboard', 'Dashboard', 'paginas', 'Página de painel com indicadores, gráfico e lista — o resumo do negócio.', [
    text('titulo', 'Título', 'Visão geral', 'title'),
    num('kpis', 'Quantidade de KPIs', 3, 2, 4, 1, undefined, 'Conteúdo'),
    sel('grafico', 'Gráfico principal', 'barras', opt(['barras', 'Barras'], ['linha', 'Linha'])),
    bool('sidebar', 'Mostrar menu lateral', true),
    bool('lista', 'Mostrar lista de atividades', true),
  ], {
    summary: 'Página de painel com cabeçalho, linha de KPIs, gráfico principal e lista/tabela de atividades.',
    structure: ['Cabeçalho da página (título, período, ações) → KPIs → gráfico (2/3) + atividades (1/3).', 'Usa a arquitetura desktop/mobile aprovada para a navegação.'],
    behavior: ['Filtro de período atualiza todos os blocos; estados de carregando por bloco.'],
    responsive: ['KPIs 4 → 2 → 1 colunas; gráfico e lista empilham; nada de overflow horizontal.'],
  }],
  [59, 'login', 'Login', 'paginas', 'A tela de entrar no sistema com e-mail, senha e opções de acesso.', [
    text('marca', 'Marca', 'Nimbo', 'logo'),
    text('titulo', 'Título', 'Bem-vindo de volta', 'title'),
    text('botao', 'Botão', 'Entrar', 'button'),
    sel('layout', 'Layout', 'centralizado', opt(['centralizado', 'Cartão central'], ['dividido', 'Dividido com painel'])),
    bool('social', 'Entrar com Google/Apple', true),
    bool('lembrar', 'Lembrar de mim', true),
  ], {
    summary: 'Tela de login com marca, título, e-mail, senha, lembrar, recuperar senha, login social e link de cadastro.',
    structure: ['Marca → título → campos (e-mail, senha com olho) → lembrar + esqueci → botão → separador → social → link cadastro.'],
    behavior: ['Erros claros sem revelar se o e-mail existe; botão com carregando; autocomplete email/current-password.'],
    responsive: ['Uma coluna no celular; painel ilustrado do layout dividido é ocultado abaixo de 900 px; teclado não cobre o botão.'],
    notes: ['Demonstração de interface: implemente autenticação real e segura no backend.'],
  }],
  [60, 'cadastro-onboarding', 'Cadastro e onboarding', 'paginas', 'Criar conta e os primeiros passos guiados depois do cadastro.', [
    text('titulo', 'Título', 'Conte sobre sua equipe', 'title'),
    num('passo', 'Etapa atual', 2, 1, 4, 1, undefined, 'Estados'),
    num('totalPassos', 'Total de etapas', 3, 2, 4, 1, undefined, 'Conteúdo'),
    text('botao', 'Botão', 'Continuar', 'button'),
    bool('progresso', 'Barra de progresso', true),
  ], {
    summary: 'Fluxo de cadastro em etapas com progresso, perguntas por cartões selecionáveis e navegação voltar/continuar.',
    structure: ['Progresso (etapa X de N) → título + subtítulo → opções em cartões ou campos → rodapé (Voltar, Pular, Continuar).'],
    behavior: ['Salva o progresso por etapa; validação antes de avançar; pular etapas opcionais.'],
    responsive: ['Uma coluna no celular com rodapé fixo de ações (safe area); cartões em 1–2 colunas.'],
  }],
  [61, 'paginas-detalhes', 'Páginas de detalhes', 'paginas', 'A página de um item (produto, pedido, imóvel) com imagem, informações e ação.', [
    text('titulo', 'Título', 'Tênis Aurora Run', 'title'),
    text('preco', 'Preço', 'R$ 499,90', 'price'),
    text('status', 'Status', 'Em estoque', 'badge'),
    text('botao', 'Botão', 'Adicionar ao carrinho', 'button'),
    bool('galeria', 'Galeria de miniaturas', true),
    bool('abas', 'Abas de informações', true),
  ], {
    summary: 'Página de detalhe com mídia/galeria, título, preço/status, ações principais e abas de informação.',
    structure: ['Trilha → mídia (galeria) + painel de informações (título, preço, status, opções, ação) → abas (Descrição, Especificações, Avaliações).'],
    behavior: ['Galeria por teclado; ação principal com feedback; abas com URL própria.'],
    responsive: ['No celular, mídia no topo em carrossel e ação principal fixa na base (safe area).'],
  }],
  [62, 'perfil-usuario', 'Perfil de usuário', 'paginas', 'A página da pessoa: foto, nome, números e abas de atividade.', [
    text('nome', 'Nome', 'Ana Souza', 'name'),
    text('cargo', 'Cargo', 'Product Designer', 'role'),
    text('botao', 'Botão', 'Seguir', 'button'),
    bool('capa', 'Imagem de capa', true),
    bool('estatisticas', 'Estatísticas', true),
    bool('abas', 'Abas', true),
  ], {
    summary: 'Página de perfil com capa, avatar sobreposto, nome, cargo, ações, estatísticas e abas.',
    structure: ['Capa → avatar (sobreposto −50%) + nome/cargo + ações → estatísticas → abas → conteúdo.'],
    behavior: ['Editar perfil abre formulário; abas mudam o conteúdo sem recarregar.'],
    responsive: ['No celular, avatar e textos centralizados; estatísticas em 3 colunas compactas; ações em largura total.'],
  }],
  [63, 'configuracoes', 'Configurações', 'paginas', 'A página de ajustes da conta com seções, interruptores e zona de perigo.', [
    text('titulo', 'Título', 'Configurações', 'title'),
    area('secoes', 'Seções (uma por linha)', 'Conta\nNotificações\nPrivacidade\nCobrança', 'sections'),
    num('ativa', 'Seção ativa', 2, 1, 6, 1, undefined, 'Estados'),
    sel('layout', 'Layout', 'lateral', opt(['lateral', 'Menu lateral'], ['abas', 'Abas no topo'])),
    bool('perigo', 'Zona de perigo', true),
  ], {
    summary: 'Página de configurações com navegação por seções, linhas de ajuste (rótulo, descrição, controle) e zona de perigo.',
    structure: ['Navegação de seções (lateral ou abas) → grupos com título → linhas: rótulo + descrição ··· controle.', 'Zona de perigo no fim com borda de erro e ação destrutiva.'],
    behavior: ['Interruptores salvam na hora; formulários com "Salvar alterações" que aparece só quando há mudanças.'],
    responsive: ['No celular, o menu lateral vira lista de seções (navegação em níveis) ou abas roláveis; controles abaixo do rótulo se faltar espaço.'],
  }],
  [64, 'layouts-mobile', 'Layouts mobile', 'paginas', 'Como o app aparece no celular: barra de baixo, menu, botão flutuante.', [
    text('titulo', 'Título da tela', 'Início', 'title'),
    sel('navegacao', 'Navegação', 'bottom-nav', opt(['bottom-nav', 'Barra inferior'], ['dock', 'Dock flutuante'], ['topbar', 'Topbar com menu'], ['abas', 'Abas no topo'])),
    area('itens', 'Itens da navegação (um por linha)', 'Início\nBuscar\nPedidos\nPerfil', 'nav'),
    num('ativa', 'Item ativo', 1, 1, 5, 1, undefined, 'Estados'),
    bool('fab', 'Botão flutuante (FAB)', true),
  ], {
    summary: 'Tela de celular com topbar, conteúdo em cartões e navegação móvel (barra inferior, dock, topbar ou abas).',
    structure: ['Topbar (título, ações) → conteúdo rolável → navegação fixa com 3–5 itens (ícone + rótulo) e FAB opcional.'],
    behavior: ['Item ativo com indicador da família; FAB para a ação principal; barras escondem ao rolar (opcional).'],
    responsive: ['Respeita safe areas (env(safe-area-inset-bottom)); alvos de 48 px; funciona de 320 a 430 px e na horizontal.'],
  }],
  [65, 'hero-sections', 'Hero sections', 'paginas', 'A primeira seção de uma página: título grande, frase e botões de ação.', [
    text('selo', 'Selo', 'Novo · versão 2.0', 'badge'),
    text('titulo', 'Título', 'Organize tudo em um só lugar', 'title'),
    area('subtitulo', 'Subtítulo', 'Projetos, tarefas e equipe na mesma tela. Comece em minutos.', 'body'),
    text('cta', 'Botão principal', 'Começar grátis', 'cta'),
    text('ctaSecundario', 'Botão secundário', 'Ver demonstração', 'secondary'),
    sel('layout', 'Layout', 'centralizado', opt(['centralizado', 'Centralizado'], ['dividido', 'Texto + imagem'])),
    bool('midia', 'Mostrar ilustração', true),
  ], {
    summary: 'Seção de abertura com selo, título de impacto, subtítulo, CTAs e mídia ilustrativa.',
    structure: ['Selo → h1 → subtítulo (máx. 2 linhas) → CTA primário + secundário → prova social/mídia.', 'Layout centralizado ou dividido (texto à esquerda, mídia à direita).'],
    behavior: ['CTA principal destacado; animações de entrada sutis e desligáveis.'],
    responsive: ['No celular, título com clamp(28px, 8vw, 48px), CTAs empilhados em largura total e mídia abaixo do texto.'],
  }],
  [66, 'pricing-planos', 'Pricing e planos', 'paginas', 'Tabela de preços com planos lado a lado e o plano recomendado em destaque.', [
    num('planos', 'Quantidade de planos', 3, 2, 3, 1, undefined, 'Conteúdo'),
    area('itens', 'Planos (um por linha: Nome | Preço | recurso; recurso)', '', 'title', 'Vazio = planos de exemplo.'),
    num('destaque', 'Plano em destaque', 2, 1, 3, 1, undefined, 'Estados'),
    sel('periodo', 'Período', 'mensal', opt(['mensal', 'Mensal'], ['anual', 'Anual (com desconto)'])),
    text('botao', 'Botão', 'Assinar', 'button'),
    text('seloDestaque', 'Selo do destaque', 'Mais popular', 'badge'),
    bool('recursos', 'Lista de recursos', true),
  ], {
    summary: 'Comparativo de planos em cartões com preço, período, recursos, plano recomendado e seletor mensal/anual.',
    structure: ['Seletor mensal/anual → cartões: nome, preço (tabular), período, descrição, botão, recursos com check.', 'Plano recomendado com selo e destaque de borda/cor.'],
    behavior: ['Troca de período atualiza preços com animação; botão do destaque é primário, os demais secundários.'],
    responsive: ['No celular, cartões empilham com o recomendado primeiro (ou carrossel com scroll-snap); preços nunca quebram.'],
  }],
]

export const componentCategoriesData: ComponentCategory[] = DEFS.map(([number, id, name, group, description, params, spec]) => ({
  number,
  id,
  name,
  group,
  description,
  params,
  spec,
}))

/** Padrões de todos os parâmetros de uma categoria. */
export function defaultValues(params: ParamDef[]): Record<string, PropValue> {
  return Object.fromEntries(params.map((p) => [p.key, p.default]))
}
