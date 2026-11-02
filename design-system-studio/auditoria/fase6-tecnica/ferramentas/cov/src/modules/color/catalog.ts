import type { CatalogItem } from '@/core/types'
import { deriveTokens, type PaletteBase } from '@/core/tokens'

export type PaletteCategory =
  | 'minimalistas'
  | 'frias'
  | 'quentes'
  | 'corporativas'
  | 'tecnologicas'
  | 'profissionais'
  | 'sociais'
  | 'criativas'
  | 'elegantes'
  | 'naturais'

export const PALETTE_CATEGORIES: { id: PaletteCategory; name: string; description: string }[] = [
  { id: 'minimalistas', name: 'Minimalistas', description: 'Neutras e silenciosas. O conteúdo é o protagonista.' },
  { id: 'frias', name: 'Frias', description: 'Azuis, cianos e lilases. Transmitem calma e confiança.' },
  { id: 'quentes', name: 'Quentes', description: 'Laranjas, terracotas e corais. Energia e acolhimento.' },
  { id: 'corporativas', name: 'Corporativas', description: 'Sóbrias e confiáveis, para empresas e instituições.' },
  { id: 'tecnologicas', name: 'Tecnológicas', description: 'Contrastes intensos, neons e gradientes digitais.' },
  { id: 'profissionais', name: 'Profissionais', description: 'Saúde, direito, educação, engenharia e serviços.' },
  { id: 'sociais', name: 'Sociais', description: 'Vibrantes e amigáveis, para comunidades e conversas.' },
  { id: 'criativas', name: 'Criativas', description: 'Ousadas, artísticas e cheias de personalidade.' },
  { id: 'elegantes', name: 'Elegantes', description: 'Luxo discreto, tons profundos e metálicos.' },
  { id: 'naturais', name: 'Naturais', description: 'Verdes, terras e areias. Orgânicas e serenas.' },
]

export interface Palette extends CatalogItem {
  category: PaletteCategory
  base: PaletteBase
}

type Def = [id: string, name: string, category: PaletteCategory, description: string, base: PaletteBase]

const DEFS: Def[] = [
  // Minimalistas
  ['neutro-essencial', 'Neutro Essencial', 'minimalistas', 'Preto, branco e um azul discreto para ações.', { primary: '#18181b', secondary: '#52525b', accent: '#2563eb', bg: '#ffffff', surface: '#ffffff', text: '#18181b' }],
  ['papel-branco', 'Papel Branco', 'minimalistas', 'Fundo de papel levemente quente com destaque carmim.', { primary: '#1f2937', secondary: '#6b7280', accent: '#e11d48', bg: '#fafaf9', surface: '#ffffff', text: '#1c1917' }],
  ['grafite-suave', 'Grafite Suave', 'minimalistas', 'Cinzas grafite e um ciano para pontos de atenção.', { primary: '#3f3f46', secondary: '#71717a', accent: '#0284c7', bg: '#f4f4f5', surface: '#ffffff', text: '#27272a' }],
  ['monocromo-noturno', 'Monocromo Noturno', 'minimalistas', 'Modo escuro radical em preto puro com verde-limão.', { primary: '#fafafa', secondary: '#a1a1aa', accent: '#a3e635', bg: '#0a0a0a', surface: '#171717', text: '#fafafa' }],
  ['areia-clara', 'Areia Clara', 'minimalistas', 'Neutros terrosos com um laranja queimado discreto.', { primary: '#44403c', secondary: '#78716c', accent: '#c2410c', bg: '#fafaf7', surface: '#ffffff', text: '#292524' }],
  ['nevoa', 'Névoa', 'minimalistas', 'Cinzas azulados e um índigo suave.', { primary: '#334155', secondary: '#64748b', accent: '#6366f1', bg: '#f8fafc', surface: '#ffffff', text: '#0f172a' }],
  // Frias
  ['oceano-profundo', 'Oceano Profundo', 'frias', 'Azul petróleo com navegação escura e ciano luminoso.', { primary: '#0369a1', secondary: '#0e7490', accent: '#06b6d4', bg: '#f0f9ff', surface: '#ffffff', text: '#0c1a2b', nav: '#0c4a6e' }],
  ['glacial', 'Glacial', 'frias', 'Cianos gelados e índigo, muito luminosa.', { primary: '#0891b2', secondary: '#155e75', accent: '#6366f1', bg: '#f5fdff', surface: '#ffffff', text: '#083344' }],
  ['azul-ardosia', 'Azul Ardósia', 'frias', 'Azul acinzentado sóbrio com destaque celeste.', { primary: '#3b5b8c', secondary: '#64748b', accent: '#0ea5e9', bg: '#f6f8fb', surface: '#ffffff', text: '#1e293b' }],
  ['lavanda-fria', 'Lavanda Fria', 'frias', 'Lilás azulado com verde-água como contraponto.', { primary: '#6d5bd0', secondary: '#818cf8', accent: '#0d9488', bg: '#f7f6fe', surface: '#ffffff', text: '#1e1b3a' }],
  ['noite-polar', 'Noite Polar', 'frias', 'Modo escuro azul-noite com azuis e turquesa.', { primary: '#60a5fa', secondary: '#818cf8', accent: '#2dd4bf', bg: '#0b1220', surface: '#111a2e', text: '#e2e8f0' }],
  ['menta-gelada', 'Menta Gelada', 'frias', 'Verde-azulado fresco com azul de apoio.', { primary: '#0f766e', secondary: '#14b8a6', accent: '#0284c7', bg: '#f3fbf9', surface: '#ffffff', text: '#102a27' }],
  // Quentes
  ['terracota', 'Terracota', 'quentes', 'Barro cozido, laranja queimado e âmbar.', { primary: '#c2410c', secondary: '#9a3412', accent: '#f59e0b', bg: '#fff8f3', surface: '#ffffff', text: '#2a1a12' }],
  ['por-do-sol', 'Pôr do Sol', 'quentes', 'Laranja e magenta com gradiente quente.', { primary: '#ea580c', secondary: '#db2777', accent: '#facc15', bg: '#fffaf5', surface: '#ffffff', text: '#2b1608', gradient: ['#f97316', '#db2777'] }],
  ['canela', 'Canela', 'quentes', 'Marrons acolhedores, ideais para cafés e confeitarias.', { primary: '#9a5b2c', secondary: '#c08457', accent: '#e11d48', bg: '#fbf6f1', surface: '#fffdfa', text: '#2e2018' }],
  ['coral-vivo', 'Coral Vivo', 'quentes', 'Coral intenso e amarelo ensolarado.', { primary: '#e5484d', secondary: '#f97066', accent: '#f5a524', bg: '#fff7f6', surface: '#ffffff', text: '#2b1414' }],
  ['mostarda', 'Mostarda', 'quentes', 'Amarelo mostarda com verde-garrafa.', { primary: '#b7791f', secondary: '#744210', accent: '#2f855a', bg: '#fffbeb', surface: '#ffffff', text: '#2a2108' }],
  ['brasa', 'Brasa', 'quentes', 'Modo escuro em carvão com laranjas incandescentes.', { primary: '#f97316', secondary: '#ef4444', accent: '#fbbf24', bg: '#160d08', surface: '#22150d', text: '#fdeee3' }],
  // Corporativas
  ['azul-institucional', 'Azul Institucional', 'corporativas', 'Azul real confiável com navegação marinho.', { primary: '#1d4ed8', secondary: '#1e3a8a', accent: '#0ea5e9', bg: '#f8fafc', surface: '#ffffff', text: '#0f172a', nav: '#0f1f4d' }],
  ['executivo-grafite', 'Executivo Grafite', 'corporativas', 'Grafite quase preto com azul de ação.', { primary: '#111827', secondary: '#374151', accent: '#2563eb', bg: '#f9fafb', surface: '#ffffff', text: '#111827', nav: '#111827' }],
  ['verde-banco', 'Verde Banco', 'corporativas', 'Verde financeiro sólido e azul de apoio.', { primary: '#047857', secondary: '#065f46', accent: '#0ea5e9', bg: '#f6faf8', surface: '#ffffff', text: '#0b1f17' }],
  ['marinho-classico', 'Marinho Clássico', 'corporativas', 'Azul marinho com destaque coral.', { primary: '#1e3a5f', secondary: '#3d5a80', accent: '#ee6c4d', bg: '#f7f9fc', surface: '#ffffff', text: '#14213d', nav: '#14213d' }],
  ['vinho-corporativo', 'Vinho Corporativo', 'corporativas', 'Bordô profundo com âmbar.', { primary: '#881337', secondary: '#4c0519', accent: '#d97706', bg: '#fdf8f9', surface: '#ffffff', text: '#1f0a10' }],
  ['cinza-azulado', 'Cinza Azulado', 'corporativas', 'Ardósia neutra com verde-azulado.', { primary: '#475569', secondary: '#334155', accent: '#0d9488', bg: '#f1f5f9', surface: '#ffffff', text: '#0f172a' }],
  // Tecnológicas
  ['neon-grid', 'Neon Grid', 'tecnologicas', 'Escuro profundo com ciano, violeta e gradiente.', { primary: '#22d3ee', secondary: '#a855f7', accent: '#84cc16', bg: '#05070d', surface: '#0d1220', text: '#e5f6ff', gradient: ['#22d3ee', '#a855f7'] }],
  ['violeta-digital', 'Violeta Digital', 'tecnologicas', 'Violeta e índigo com gradiente para ciano.', { primary: '#7c3aed', secondary: '#4f46e5', accent: '#0891b2', bg: '#faf8ff', surface: '#ffffff', text: '#1b1035', gradient: ['#7c3aed', '#06b6d4'] }],
  ['terminal', 'Terminal', 'tecnologicas', 'Verde fósforo sobre preto, estética de console.', { primary: '#4ade80', secondary: '#22c55e', accent: '#facc15', bg: '#070b08', surface: '#0f1611', text: '#d9fbe5' }],
  ['eletrico', 'Elétrico', 'tecnologicas', 'Azul elétrico, violeta e rosa vibrante.', { primary: '#2563eb', secondary: '#7c3aed', accent: '#f43f5e', bg: '#f7f9ff', surface: '#ffffff', text: '#0b1330' }],
  ['cyber-rosa', 'Cyber Rosa', 'tecnologicas', 'Rosa e lilás neon sobre roxo profundo.', { primary: '#f472b6', secondary: '#818cf8', accent: '#2dd4bf', bg: '#0d0614', surface: '#170c22', text: '#fbe8f6', gradient: ['#f472b6', '#818cf8'] }],
  ['silicio', 'Silício', 'tecnologicas', 'Preto-azulado, azul e verde de status.', { primary: '#0f172a', secondary: '#3b82f6', accent: '#10b981', bg: '#f8fafc', surface: '#ffffff', text: '#020617' }],
  // Profissionais
  ['clinico', 'Clínico', 'profissionais', 'Azul-petróleo higiênico com verde de confirmação.', { primary: '#0e7490', secondary: '#155e75', accent: '#16a34a', bg: '#f7fbfc', surface: '#ffffff', text: '#0b2530' }],
  ['juridico', 'Jurídico', 'profissionais', 'Azul tinta com dourado envelhecido.', { primary: '#1f2a44', secondary: '#8b6f47', accent: '#b45309', bg: '#faf9f6', surface: '#ffffff', text: '#1a1f2e' }],
  ['consultoria', 'Consultoria', 'profissionais', 'Azul aço com amarelo de destaque.', { primary: '#334e68', secondary: '#627d98', accent: '#f0b429', bg: '#f5f7fa', surface: '#ffffff', text: '#102a43' }],
  ['engenharia', 'Engenharia', 'profissionais', 'Azul técnico e laranja de segurança.', { primary: '#2b6cb0', secondary: '#4a5568', accent: '#dd6b20', bg: '#f7fafc', surface: '#ffffff', text: '#1a202c' }],
  ['educacao', 'Educação', 'profissionais', 'Índigo estudioso com âmbar e ciano.', { primary: '#4338ca', secondary: '#0891b2', accent: '#f59e0b', bg: '#f8f8ff', surface: '#ffffff', text: '#1e1b4b' }],
  ['contabil', 'Contábil', 'profissionais', 'Verde sóbrio, grafite e azul.', { primary: '#166534', secondary: '#1f2937', accent: '#2563eb', bg: '#f8faf8', surface: '#ffffff', text: '#111827' }],
  // Sociais
  ['comunidade', 'Comunidade', 'sociais', 'Magenta e violeta com gradiente caloroso.', { primary: '#d6336c', secondary: '#7048e8', accent: '#f59f00', bg: '#ffffff', surface: '#ffffff', text: '#1b1b1f', gradient: ['#f59f00', '#d6336c'] }],
  ['conversa', 'Conversa', 'sociais', 'Verde de mensagem, azul e laranja.', { primary: '#2f9e44', secondary: '#1971c2', accent: '#f76707', bg: '#f8f9fa', surface: '#ffffff', text: '#212529' }],
  ['pulso-social', 'Pulso Social', 'sociais', 'Modo escuro com violeta, rosa e verde-água.', { primary: '#845ef7', secondary: '#f06595', accent: '#20c997', bg: '#101014', surface: '#1a1a21', text: '#f1f0f5' }],
  ['amizade', 'Amizade', 'sociais', 'Laranja amigável, amarelo e azul.', { primary: '#e8590c', secondary: '#f59f00', accent: '#4263eb', bg: '#fffaf3', surface: '#ffffff', text: '#2b1d0e' }],
  ['ceu-aberto', 'Céu Aberto', 'sociais', 'Azul céu com coral.', { primary: '#1c7ed6', secondary: '#4dabf7', accent: '#ff6b6b', bg: '#f5f9ff', surface: '#ffffff', text: '#0b2240' }],
  ['festival', 'Festival', 'sociais', 'Roxo, vermelho e amarelo festivos.', { primary: '#ae3ec9', secondary: '#f03e3e', accent: '#fcc419', bg: '#fff8fd', surface: '#ffffff', text: '#2a0d33', gradient: ['#ae3ec9', '#f03e3e'] }],
  // Criativas
  ['estudio-pop', 'Estúdio Pop', 'criativas', 'Rosa, azul e amarelo de pôster.', { primary: '#ff4d6d', secondary: '#4361ee', accent: '#ffd60a', bg: '#fffdf7', surface: '#ffffff', text: '#14121f' }],
  ['risografia', 'Risografia', 'criativas', 'Laranja e azul de impressão artesanal.', { primary: '#ff6b35', secondary: '#004e89', accent: '#f7c548', bg: '#fbf5ea', surface: '#fffdf8', text: '#1a1a2e' }],
  ['aquarela', 'Aquarela', 'criativas', 'Lilás, rosa e verde suaves.', { primary: '#6c63ff', secondary: '#ff8fab', accent: '#43aa8b', bg: '#fdfbff', surface: '#ffffff', text: '#22223b' }],
  ['neo-brutal', 'Neo Brutal', 'criativas', 'Preto puro, laranja e amarelo chapados.', { primary: '#111111', secondary: '#ff5c00', accent: '#ffe600', bg: '#fff9e6', surface: '#ffffff', text: '#111111' }],
  ['galeria-noturna', 'Galeria Noturna', 'criativas', 'Escuro de galeria com coral e amarelo.', { primary: '#ff7a59', secondary: '#ffd166', accent: '#06d6a0', bg: '#121212', surface: '#1d1d1d', text: '#f5f5f5' }],
  ['tropical', 'Tropical', 'criativas', 'Verde-água, coral e amarelo de verão.', { primary: '#00a896', secondary: '#f25f5c', accent: '#ffe066', bg: '#f7fffd', surface: '#ffffff', text: '#0b2b26' }],
  // Elegantes
  ['ouro-noturno', 'Ouro Noturno', 'elegantes', 'Preto quente com dourado e champanhe.', { primary: '#d4af37', secondary: '#b08d57', accent: '#e8d5a3', bg: '#0c0b09', surface: '#16140f', text: '#f3ead7' }],
  ['marfim', 'Marfim', 'elegantes', 'Marfim, carvão e couro.', { primary: '#2d2a26', secondary: '#8a7f72', accent: '#a47148', bg: '#fbf8f2', surface: '#fffdf9', text: '#1f1c18' }],
  ['champagne', 'Champagne', 'elegantes', 'Bege champanhe com bronze.', { primary: '#8c6a43', secondary: '#a8987f', accent: '#4a4a48', bg: '#faf6ef', surface: '#ffffff', text: '#2b241c' }],
  ['esmeralda-real', 'Esmeralda Real', 'elegantes', 'Verde esmeralda profundo com ouro.', { primary: '#065f46', secondary: '#b08d57', accent: '#c9a227', bg: '#f7faf8', surface: '#ffffff', text: '#0f1f19' }],
  ['ameixa-luxo', 'Ameixa Luxo', 'elegantes', 'Ameixa, rosé antigo e nude.', { primary: '#5b2a4b', secondary: '#a26769', accent: '#c08b80', bg: '#fbf7f9', surface: '#ffffff', text: '#2b1625' }],
  ['obsidiana', 'Obsidiana', 'elegantes', 'Preto vulcânico com prata e lilás.', { primary: '#e5e5e5', secondary: '#9ca3af', accent: '#c084fc', bg: '#09090b', surface: '#141417', text: '#f4f4f5' }],
  // Naturais
  ['floresta', 'Floresta', 'naturais', 'Verdes de mata com madeira clara.', { primary: '#2d6a4f', secondary: '#40916c', accent: '#b07d4f', bg: '#f6faf6', surface: '#ffffff', text: '#1b2e24' }],
  ['musgo', 'Musgo', 'naturais', 'Oliva, verde-escuro e caramelo.', { primary: '#606c38', secondary: '#283618', accent: '#bc6c25', bg: '#fefae0', surface: '#fffdf3', text: '#283618' }],
  ['argila', 'Argila', 'naturais', 'Siena, marrom e verde-sálvia.', { primary: '#a0522d', secondary: '#6b4226', accent: '#5f8a64', bg: '#faf4ee', surface: '#fffaf5', text: '#2f1f14' }],
  ['salvia', 'Sálvia', 'naturais', 'Sálvia acinzentada com amarelo-mel.', { primary: '#52796f', secondary: '#84a98c', accent: '#c99a2e', bg: '#f7f9f7', surface: '#ffffff', text: '#1f2d2a' }],
  ['mar-e-areia', 'Mar e Areia', 'naturais', 'Verde-mar com pêssego de areia.', { primary: '#1d7874', secondary: '#679289', accent: '#e3955f', bg: '#fbf8f3', surface: '#ffffff', text: '#102a28' }],
  ['noite-na-mata', 'Noite na Mata', 'naturais', 'Modo escuro verde-floresta com laranja.', { primary: '#95d5b2', secondary: '#52b788', accent: '#f4a261', bg: '#0b1410', surface: '#13201a', text: '#e3f2e9' }],
]

export const palettes: Palette[] = DEFS.map(([id, name, category, description, base]) => {
  const t = deriveTokens(base)
  return {
    id,
    name,
    category,
    description,
    base,
    tags: [category, t.mode === 'dark' ? 'escura' : 'clara', ...(base.gradient ? ['gradiente'] : [])],
    spec: {
      summary: `Paleta "${name}" (${t.mode === 'dark' ? 'modo escuro' : 'modo claro'}): ${description}`,
      structure: [
        `Primária ${base.primary}, secundária ${base.secondary}, destaque ${base.accent}.`,
        `Fundo ${base.bg}, superfície ${base.surface}, texto ${base.text}.`,
        `Navegação com fundo ${t.navBg} e texto ${t.navText}.`,
        base.gradient ? `Gradiente permitido de ${base.gradient[0]} para ${base.gradient[1]}, apenas onde for explicitamente escolhido.` : 'Sem gradientes: superfícies em cores sólidas.',
      ],
      behavior: [
        `Hover ${t.hover}, active ${t.active}, selected ${t.selected} com texto ${t.selectedText}.`,
        `Foco visível com anel ${t.focusRing}.`,
      ],
      responsive: ['A paleta é a mesma em todas as larguras de tela; nunca troque cores por breakpoint sem solicitação.'],
    },
  }
})

export const paletteById = (id: string): Palette | undefined => palettes.find((p) => p.id === id)
