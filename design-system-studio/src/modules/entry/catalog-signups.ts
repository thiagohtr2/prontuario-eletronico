import type { ItemSpec } from '@/core/types'
import type { SignupFlow, SignupModel } from './types'

/**
 * 8 fluxos de cadastro. Somente dados (sem JSX). A tela de cadastro é renderizada com a
 * composição de login escolhida (ou a primeira, se nenhuma foi escolhida).
 */

const SECURITY_NOTE =
  'Demonstração de interface: a criação de conta real deve ser feita pela IA com backend seguro — hash de senha (Argon2id/bcrypt), verificação de e-mail, limitação de tentativas, proteção contra bots (sem expor se um e-mail já existe), sessão em cookie httpOnly/Secure/SameSite e HTTPS.'

interface Def {
  id: SignupFlow
  name: string
  description: string
  headline: string
  cta: string
  fields: string[]
  steps?: string[]
  summary: string
  structure: string[]
  behavior: string[]
  responsive: string[]
  measurements?: Record<string, string>
  notes?: string[]
}

function signup(d: Def): SignupModel {
  const spec: ItemSpec = {
    summary: d.summary,
    structure: [...d.structure, `Campos, na ordem: ${d.fields.join(', ')}.`],
    behavior: d.behavior,
    responsive: d.responsive,
    measurements: { alturaInputs: '≈44 px (desktop) / 48 px (celular)', espacoEntreCampos: '≈16 px', ...(d.measurements ?? {}) },
    notes: [...(d.notes ?? []), SECURITY_NOTE],
  }
  return {
    id: d.id,
    flow: d.id,
    name: d.name,
    description: d.description,
    headline: d.headline,
    cta: d.cta,
    fields: d.fields,
    steps: d.steps,
    tags: [d.cta],
    spec,
  }
}

export const signups: SignupModel[] = [
  signup({
    id: 'mesma-tela',
    name: 'Cadastro na mesma tela do login',
    description: 'Entrar e criar conta ficam no mesmo lugar, separados por duas abas. A pessoa troca com um toque.',
    headline: 'Criar conta',
    cta: 'Criar conta',
    fields: ['Nome', 'E-mail', 'Senha'],
    summary: 'Cadastro integrado ao login por abas “Entrar | Criar conta” no topo do formulário, sem trocar de página.',
    structure: [
      'Abas “Entrar | Criar conta” (role="tablist") no topo do formulário, com a aba ativa sublinhada na cor primária.',
      'A aba “Criar conta” mostra nome, e-mail, senha com requisitos e o botão “Criar conta”.',
      'Texto de aceite dos termos abaixo do botão, com links.',
    ],
    behavior: [
      'Trocar de aba mantém o e-mail já digitado e atualiza a URL (?aba=cadastro) para permitir link direto.',
      'Erros por campo com mensagem abaixo (ex.: “Use pelo menos 8 caracteres”) e resumo com role="alert" quando o envio falhar.',
      'Senha com botão mostrar/ocultar e checklist de requisitos que marca cada regra cumprida enquanto a pessoa digita.',
      'Na aba Entrar, o link “Esqueci minha senha” leva à recuperação por e-mail.',
      'Labels associados; autocomplete name, email e new-password no cadastro e current-password no login.',
    ],
    responsive: [
      'No celular as abas ocupam a largura total (50% cada) com altura ≥ 44 px.',
      'Com o teclado virtual aberto, o botão “Criar conta” permanece visível logo abaixo do último campo (sem position: fixed sobre o teclado).',
      'Em telas de 320 px os requisitos de senha quebram em lista vertical.',
    ],
  }),
  signup({
    id: 'pagina-propria',
    name: 'Página própria de cadastro',
    description: 'Uma página só para criar conta, com todos os campos e a confirmação de senha.',
    headline: 'Crie sua conta',
    cta: 'Criar conta',
    fields: ['Nome completo', 'E-mail', 'Senha', 'Confirmar senha', 'Aceite dos termos'],
    summary: 'Cadastro em página dedicada com nome, e-mail, senha, confirmação de senha, aceite dos termos e link de volta para o login.',
    structure: [
      'Página própria (rota /cadastro) com a mesma composição visual do login.',
      'Título “Crie sua conta”, subtítulo curto e campos em uma coluna.',
      'Checkbox obrigatório de aceite dos termos com links para Termos e Privacidade.',
      'Rodapé do formulário: “Já tem conta? Entrar”.',
    ],
    behavior: [
      'Validação ao sair de cada campo; “Confirmar senha” mostra erro “As senhas não coincidem” em tempo real após o primeiro envio.',
      'Indicador de força da senha (fraca/média/forte) com texto, não só cor.',
      'Botões mostrar/ocultar independentes nos dois campos de senha.',
      'Se o e-mail já existir, a mensagem é neutra e oferece “Entrar” ou “Recuperar senha”.',
      'Autocomplete: name, email, new-password (nos dois campos de senha).',
    ],
    responsive: [
      'No celular, uma coluna com 20 px de margem; o checkbox de termos tem área de toque de 44 px.',
      'O formulário rola normalmente com o teclado aberto; o campo focado fica visível (scroll-margin ≈ 96 px).',
      'Funciona a partir de 320 px sem rolagem horizontal.',
    ],
  }),
  signup({
    id: 'etapas',
    name: 'Cadastro em etapas progressivas',
    description: 'O cadastro é dividido em 3 passos curtos, com um indicador mostrando em que etapa a pessoa está.',
    headline: 'Vamos começar',
    cta: 'Continuar',
    fields: ['E-mail', 'Senha', 'Nome', 'Empresa', 'Cargo', 'Interesses'],
    steps: ['Conta', 'Perfil', 'Preferências'],
    summary: 'Cadastro progressivo em 3 etapas (Conta → Perfil → Preferências) com indicador de passos e navegação Voltar/Continuar.',
    structure: [
      'Indicador de etapas no topo: 3 círculos numerados ligados por linhas, com nomes; etapa atual destacada, concluídas com ícone de verificação.',
      'Etapa 1 — Conta: e-mail e senha. Etapa 2 — Perfil: nome, empresa e cargo. Etapa 3 — Preferências: interesses em chips selecionáveis.',
      'Botões “Voltar” (secundário) e “Continuar” (principal); na última etapa o principal vira “Concluir cadastro”.',
    ],
    behavior: [
      '“Continuar” valida apenas os campos da etapa atual e mostra os erros abaixo de cada campo, com foco no primeiro inválido.',
      'Dados das etapas anteriores são preservados ao voltar; a conta é criada na etapa 1 e o restante pode ser pulado (“Pular por agora”).',
      'Senha com mostrar/ocultar e requisitos visíveis; login com “Esqueci minha senha” na tela de entrar.',
      'O indicador usa aria-current="step" e texto “Etapa 2 de 3” para leitores de tela.',
      'Autocomplete: email, new-password, name, organization, organization-title.',
    ],
    responsive: [
      'No celular o indicador mostra só os círculos e o nome da etapa atual (“2 de 3 · Perfil”).',
      'Botões Voltar/Continuar lado a lado na base do formulário; acima do teclado virtual quando ele estiver aberto.',
      'Chips de interesses quebram em várias linhas, sem rolagem horizontal, a partir de 320 px.',
    ],
    measurements: { indicadorEtapas: '≈28 px por círculo', alturaBotoes: '≈44 px (desktop) / 48 px (celular)' },
  }),
  signup({
    id: 'convite',
    name: 'Cadastro por convite para equipe',
    description: 'A pessoa chega por um convite: o sistema mostra quem convidou e para qual equipe, e pede só nome e senha.',
    headline: 'Você foi convidado',
    cta: 'Aceitar convite',
    fields: ['E-mail (preenchido pelo convite)', 'Nome', 'Senha'],
    summary: 'Cadastro por convite: faixa com quem convidou e a equipe, e-mail já preenchido e bloqueado, nome e senha.',
    structure: [
      'Faixa de convite no topo do formulário: avatar de quem convidou, texto “Ana Ribeiro convidou você para a equipe Projeto Aurora” e iniciais da equipe.',
      'E-mail preenchido pelo convite, somente leitura, com ícone de cadeado e texto de ajuda.',
      'Botão principal “Aceitar convite” e link “Não é você? Recusar convite”.',
    ],
    behavior: [
      'O convite expira (ex.: 7 dias); convite expirado mostra estado de erro com opção “Pedir novo convite”.',
      'Erros por campo com mensagem clara; senha com mostrar/ocultar e requisitos.',
      'Se a pessoa já tem conta, mostra “Entrar para aceitar” e o link “Esqueci minha senha”.',
      'O campo somente leitura usa readOnly (não disabled) para continuar legível e enviável; autocomplete username, name e new-password.',
    ],
    responsive: [
      'No celular a faixa de convite empilha avatar e texto; o nome da equipe pode quebrar em duas linhas.',
      'Com o teclado aberto, o botão “Aceitar convite” continua visível abaixo do campo de senha.',
      'Uma coluna a partir de 320 px.',
    ],
    notes: ['O token do convite deve ser de uso único, com expiração, vinculado ao e-mail convidado e validado no servidor.'],
  }),
  signup({
    id: 'sem-senha',
    name: 'Acesso sem senha',
    description: 'Sem senha para lembrar: a pessoa informa o e-mail e recebe um código de 6 números para confirmar.',
    headline: 'Criar conta sem senha',
    cta: 'Enviar código',
    fields: ['E-mail', 'Código de 6 dígitos'],
    summary: 'Cadastro e acesso sem senha: e-mail → código de 6 dígitos enviado por e-mail (ou link mágico), com reenvio temporizado.',
    structure: [
      'Etapa 1: campo de e-mail e botão “Enviar código”.',
      'Etapa 2: texto “Enviamos um código para nome@empresa.com”, campo do código com 6 posições visuais, botão “Confirmar” e “Reenviar em 30 s”.',
      'Alternativa: link mágico no mesmo e-mail (“ou toque no link que enviamos”).',
    ],
    behavior: [
      'Campo do código é um único input com autoComplete="one-time-code", inputMode="numeric" e pattern de 6 dígitos (aceita colar).',
      'Erros claros: “Código incorreto. Restam 2 tentativas.” e “Código expirado — envie um novo.”',
      'Reenvio bloqueado por 30 s com contagem visível; “Alterar e-mail” volta à etapa 1.',
      'Não há senha para mostrar/ocultar nem recuperar: a recuperação é o próprio envio do código.',
      'Labels associados; e-mail com autoComplete="email".',
    ],
    responsive: [
      'No celular o teclado numérico abre automaticamente no campo do código; o botão “Confirmar” fica logo abaixo, visível com o teclado aberto.',
      'As 6 posições do código cabem em 320 px (≈40 px cada com 8 px de espaço).',
    ],
    notes: ['Códigos com 6 dígitos, validade de ≈10 min, uso único e limite de tentativas por e-mail e por IP.'],
  }),
  signup({
    id: 'social-sso',
    name: 'Cadastro com conta social ou SSO',
    description: 'Botões para criar a conta usando uma conta que a pessoa já tem (ou a da empresa), além do e-mail.',
    headline: 'Criar conta',
    cta: 'Criar conta com e-mail',
    fields: ['Provedor de identidade (opcional)', 'Nome', 'E-mail', 'Senha'],
    summary: 'Cadastro com botões de provedores (conta social e SSO corporativo) no topo, divisor “ou” e formulário de e-mail abaixo.',
    structure: [
      'Botões de largura total no topo: “Continuar com conta social”, “Continuar com SSO da empresa” e “Continuar com outro provedor” — texto neutro e ícone genérico.',
      'Divisor horizontal com “ou”.',
      'Formulário de e-mail: nome, e-mail e senha, com botão “Criar conta com e-mail”.',
    ],
    behavior: [
      'Os botões de provedor reais devem seguir as diretrizes de marca de cada provedor escolhido pelo projeto (logotipo e texto oficiais).',
      'Erro de provedor (cancelado ou negado) aparece como mensagem acima dos botões, sem perder o formulário.',
      'Formulário de e-mail com erros por campo, senha com mostrar/ocultar e “Esqueci minha senha” na tela de entrar.',
      'Autocomplete name, email e new-password; botões de provedor com texto completo (não só ícone).',
    ],
    responsive: [
      'No celular os botões de provedor ficam empilhados em largura total (altura 48 px).',
      'Com o teclado aberto, o botão de envio permanece visível abaixo do último campo.',
      'Funciona a partir de 320 px; textos dos botões quebram em duas linhas se necessário.',
    ],
    notes: ['Use OAuth 2.0/OpenID Connect com PKCE e state; vincule contas pelo e-mail verificado do provedor.'],
  }),
  signup({
    id: 'perfil',
    name: 'Escolha de perfil de usuário',
    description: 'Antes dos dados, a pessoa escolhe que tipo de usuário é (cliente, profissional ou empresa).',
    headline: 'Como você vai usar?',
    cta: 'Criar conta',
    fields: ['Tipo de perfil', 'Nome', 'E-mail', 'Senha'],
    summary: 'Cadastro com escolha de perfil em cartões (Cliente, Profissional, Empresa) antes dos campos, adaptando o restante do formulário.',
    structure: [
      'Grupo de 3 cartões de perfil com ícone, título e uma linha de descrição; o escolhido fica com borda e fundo na cor primária suave.',
      'Abaixo, nome, e-mail e senha (o rótulo do nome muda para “Nome da empresa” no perfil Empresa).',
      'Botão “Criar conta” e link “Já tem conta? Entrar”.',
    ],
    behavior: [
      'Cartões são um radiogroup (role="radiogroup", setas do teclado navegam); sem perfil escolhido, o envio mostra “Escolha um tipo de perfil”.',
      'Erros por campo abaixo de cada input; senha com mostrar/ocultar e requisitos.',
      'Recuperação de senha pelo link “Esqueci minha senha” da tela de entrar.',
      'Autocomplete name/organization, email e new-password conforme o perfil.',
    ],
    responsive: [
      'No celular os cartões de perfil viram linhas horizontais empilhadas (ícone à esquerda, texto à direita) com 56 px de altura.',
      'O botão de envio fica visível acima do teclado virtual quando o último campo está focado.',
      'Funciona a partir de 320 px.',
    ],
  }),
  signup({
    id: 'simplificado',
    name: 'Cadastro simplificado',
    description: 'O mínimo possível: e-mail e senha. O resto a pessoa completa depois, dentro do sistema.',
    headline: 'Comece em segundos',
    cta: 'Criar conta grátis',
    fields: ['E-mail', 'Senha'],
    summary: 'Cadastro mínimo com apenas e-mail e senha, botão de destaque e aceite implícito dos termos em texto pequeno.',
    structure: [
      'Título curto, dois campos (e-mail e senha) e botão “Criar conta grátis”.',
      'Texto pequeno abaixo do botão: “Ao continuar, você aceita os Termos e a Política de Privacidade”.',
      'Link “Já tem conta? Entrar”.',
    ],
    behavior: [
      'Validação ao sair do campo; mensagem de erro abaixo de cada campo e resumo com role="alert" no envio.',
      'Senha com mostrar/ocultar e regra única visível (“Mínimo de 8 caracteres”).',
      'Na tela de entrar, “Esqueci minha senha” leva à recuperação por e-mail.',
      'Autocomplete email e new-password; nome e demais dados pedidos depois, no primeiro acesso.',
    ],
    responsive: [
      'No celular os dois campos e o botão cabem na primeira tela mesmo com o teclado aberto (≈375 × 667).',
      'Botão em largura total com 48 px de altura; funciona a partir de 320 px.',
    ],
  }),
]
