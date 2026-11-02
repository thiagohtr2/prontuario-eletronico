# Relatório P2: Loja de plantas "Verde Vivo"

- **Ambiente:** Design System Studio (Atelier UI) em http://127.0.0.1:4300/, versão congelada.
- **Navegador:** Chromium (Playwright 1.63) com perfil persistente vazio em `perfil/` e viewport 1440×900.
- **Método:** usei só a interface. Não li código-fonte, documentação nem relatórios de outros agentes.
- **Execução:** cada passo rodou num script separado (`scripts/`), reabrindo o mesmo perfil. O estado do projeto persiste no localStorage do perfil.
- **Pastas:** `capturas/` tem as evidências e `exportados/` os downloads. `scratch/` guarda capturas auxiliares de exploração (não são evidência formal).

As escolhas, característica por característica, estão em `escolhas.md`.

## 1. Passo a passo

1. **Início.** Cliquei em "Começar no modo guiado". O armazenamento começou vazio ("Projeto sem nome").
2. **Etapa 1 · Objetivo do projeto.**
   - Tipo: "Loja ou catálogo".
   - Nome: "Verde Vivo", com objetivo e descrição tirados do briefing. Público-alvo e finalidade ficaram vazios.
   - Funcionalidades em texto livre, uma por característica: Landing page, Catálogo de produtos, Header com navegação, Cards de produtos, Busca, Filtros, Navegação mobile.
   - Tecnologia: chip "HTML + CSS + JavaScript".
   - A sugestão automática "Landing page com chamada para login" não foi usada.
   - Capturas: `etapa1-objetivo-tipo-loja-ou-catalogo.png`, `etapa1-objetivo-nome-funcionalidades-tecnologia.png`, `etapa1-objetivo-tecnologia-html-css-js.png`, `observacao-sugestao-loja-landing-com-login.png`.
3. **Etapa 2 · Landing, login e cadastro.**
   - Fluxo: "Landing page sem login".
   - Modelo de landing: "Folha Viva" (Plantas · Composição assimétrica), escolhido pela prévia e "Selecionar este modelo".
   - Capturas: `etapa2-entrada-fluxo-landing-sem-login.png`, `entrada-landing-folha-viva-selecionada-tela.png`.
4. **Etapa 3 · Arquitetura do computador.** Escolhi "Navegação superior de duas linhas" (família Sem sidebar). Capturas: `layout-desktop-escolhido-*.png`.
5. **Etapa 4 · Arquitetura do celular.** Escolhi "Header fixo com busca e menu inferior flutuante" (Layouts híbridos). Testei os botões da prévia: as categorias e o menu inferior mudam o item ativo, mas Buscar e Notificações não fazem nada. Capturas: `layout-mobile-escolhido-*.png`.
6. **Etapa 5 · Revisão do esqueleto.**
   - Conferi tudo e cliquei em **"Aprovar esqueleto e continuar"**.
   - Toast: "Esqueleto aprovado. Agora vamos ao acabamento."
   - Isso liberou as etapas 6 a 10.
   - Capturas: `revisao-esqueleto-antes-de-aprovar.png`, `etapa5-revisao-esqueleto-apos-aprovacao.png`.
7. **Etapa 6 · Prévia integrada.** Capturei o estado final em Aplicação e Landing × Computador, Tablet e Celular. Onde a prévia tem rolagem interna, há várias partes. Capturas: `previa-integrada-*.png`.
8. **Etapa 7 · Identidade visual.**
   - Paleta: "Floresta" (Naturais).
   - Tipografia: títulos em "Fraunces" e textos em "Inter".
   - Formas e superfícies: padrão.
   - Capturas: `identidade-*.png`.
9. **Etapa 8 · Headers e sidebars.**
   - Header: "Mega Empório", "Composição A", escolhido em "Ver em tamanho grande" → "Selecionar composição A".
   - Sidebar: nenhuma.
   - Testei o mega menu de Departamentos e o menu ☰ no celular.
   - Baixei "Exportar especificação" do header.
   - Capturas: `navegacao-header-mega-emporio-*.png`.
10. **Etapa 9 · Componentes.** Adicionei três componentes da família Soft Pill e personalizei cada um:
    - Cards → "Card de produto do catálogo".
    - Campos de busca → "Busca de produtos (plantas)".
    - Drawers → "Painel de filtros do catálogo".
    - Capturas: `componente-*.png`, `componentes-no-projeto-3-itens.png`.
11. **Inspiration Gallery (modo Livre).**
    - Conceito "Verdant Atelier" (Plantas e botânica), paleta "Original" → "Aprovar conceito".
    - Exportei CSS de referência, JSON e HTML demonstrativo.
    - Capturas: `inspiracao-verdant-atelier-paleta-original.png`, `inspiracao-galeria-verdant-aprovado.png`.
12. **Template Studio (modo Livre).**
    - Template "E-commerce de moda", com as cores ajustadas aos valores da paleta Floresta e cantos "Médios".
    - Partes marcadas: Cabeçalho, Categorias e Vitrine → "Usar este template no projeto".
    - Exportei CSS, Especificação JSON e HTML demonstrativo.
    - Captura: `template-ecommerce-moda-usado-no-projeto.png`.
13. **Etapa 10 · Master Prompt.**
    - O resumo mostrava 13 itens e **1 contradição a decidir**, que resolvi (seção 4).
    - Estado final: 13 itens · 0 retirados · 0 contradições a decidir · 0 decisões pendentes.
    - Captura: `master-prompt-tela-final-guiado-etapa10.png`.
14. **Exportar e importar.** Baixei Master Prompt (.md), Especificação JSON, CSS de referência, Ficha do projeto (HTML) e Backup completo. Todos deram certo.
    - O "Baixar .md" da Central de Prompts gera um arquivo idêntico ao da página Exportar, salvo o horário de geração. Por isso não foi duplicado em `exportados/`.
    - Abri a ficha HTML exportada para conferir: renderiza sem erros (`ficha-html-exportada-aberta.png`).

## 2. Contradições apontadas pelo Studio e como foram resolvidas

| Contradição (texto do Studio) | Opções oferecidas | Decisão |
|---|---|---|
| "Duas fontes de cor: paleta global e inspiração aprovada". A identidade global usa a paleta "Floresta" e a inspiração "Verdant Atelier" tem paleta própria. | (a) "Paleta global prevalece"; (b) "Cores da inspiração prevalecem", que usa as cores da inspiração nas páginas públicas e a paleta global "para a área logada" | **(a) Paleta global prevalece.** O projeto não tem área logada, e a Floresta já é botânica. Capturas: `contradicao-apontada-antes.png`, `contradicao-resolvida-paleta-global-prevalece.png`. O Master Prompt registra isso em "Decisões de prioridade". |

**Inconsistências que o Studio não apontou** (ficam registradas aqui, sem resolução dentro do Studio):

1. **"Landing page sem login" contra elementos de conta.** O fluxo diz "Não existe área restrita", mas:
   - o header Mega Empório tem avatar com menu "Meu perfil, Configurações, Ajuda, Sair" (linhas 167 e 191 do Master Prompt);
   - o menu inferior mobile tem o destino "Perfil";
   - o template de moda tem "ícones de conta".
2. **Conteúdo fictício que não é de plantas entra como especificação.**
   - Itens do header: "Departamentos, Ofertas, Mercado, Casa, Eletrônicos" (linha 165). Só a *marca* é marcada como fictícia.
   - Template "E-commerce de moda" com a marca "Linho & Cia". Esse caso é marcado como fictício.
3. **Dois headers diferentes.** A landing Folha Viva tem header próprio ("Plantas, Vasos, Cuidados, Ateliê", com hambúrguer no celular), diferente do header Mega Empório escolhido.

## 3. Bugs (com captura e gravidade)

| # | Gravidade | Bug | Evidência |
|---|---|---|---|
| B1 | **Alta** | Na **Prévia integrada / Live Site Preview** (Aplicação), o header escolhido (Mega Empório, cerca de 144 px: faixa de anúncio + 2 linhas) fica cortado dentro da região de cabeçalho do layout. No computador aparecem só a faixa de anúncio e metade da linha de logo e busca. No tablet aparece só a faixa de anúncio. A linha de categorias nunca aparece. Logo, a prévia não mostra o header escolhido. | `bug-previa-integrada-header-mega-emporio-cortado-computador.png`, `bug-previa-integrada-header-mega-emporio-cortado-tablet.png`, `previa-integrada-aplicacao-tablet-parte1.png` |
| B2 | Média | A **Prévia integrada "Aplicação"** ignora o tipo de projeto (Loja ou catálogo) e o nome. Mostra um dashboard SaaS (Receita, Clientes ativos, Clientes recentes, Projetos) e, no celular, "Orla" com "Saldo do mês R$ 12.480". Depois de escolher o header, a marca "Verde Vivo" (que aparecia logo após a aprovação) é trocada pela fictícia "Empório Murici". | `previa-integrada-logo-apos-aprovar-mostrava-verde-vivo-antes-do-header.png`, `previa-integrada-aplicacao-computador-parte1.png`, `previa-integrada-aplicacao-celular-parte1.png` |
| B3 | Média | O **Studio não detecta** a inconsistência entre "Landing page sem login" e um header com avatar/menu de perfil ("Sair"), o destino "Perfil" no mobile e o template com ícones de conta. O Master Prompt sai com instruções que se contradizem. | `navegacao-header-mega-emporio-grande-computador.png`, `layout-mobile-escolhido-interacao-perfil.png`, linhas 17, 167 e 191 de `exportados/verde-vivo-master-prompt.md` |
| B4 | Baixa/Média | O **indicador "Esqueleto N/5"** não reflete o progresso. Mostra "0/5" com as etapas 1–4 concluídas e "Esqueleto completo." na revisão, e "1/5" depois de aprovar o esqueleto inteiro (até o fim). O stepper e a barra lateral só marcam a etapa 5 como concluída. | `bug-contador-esqueleto-0de5-antes-de-aprovar.png`, `bug-contador-esqueleto-1de5-apos-aprovar-tudo.png`, `master-prompt-tela-final-guiado-etapa10.png` |
| B5 | Baixa | A opção (b) da contradição fala em "área logada" num projeto sem login. O texto não se adapta ao fluxo escolhido. | `contradicao-apontada-antes.png` |
| B6 | Baixa | Na **Revisão do esqueleto**, o título "Esqueleto aprovado" aparece *antes* da aprovação. | `revisao-esqueleto-antes-de-aprovar.png` |
| B7 | Baixa | Na prévia grande do celular (etapa 4 · Arquitetura do celular), tocar em "Buscar" e em "Notificações" não faz nada. O Master Prompt descreve que "O campo de busca abre a tela de busca". | `layout-mobile-escolhido-interacao-busca.png`, `layout-mobile-escolhido-interacao-notificacoes.png` |
| B8 | Baixa | Em 1440×900, a prévia grande do celular (etapa 4) fica com a base coberta pela barra fixa "Continuar: Revisão". O título do painel aparece truncado: "Header fixo com busca e men…". | `layout-mobile-escolhido-previa-grande-tela.png`, `layout-mobile-escolhido-previa-grande-celular.png` |
| B9 | Baixa | A Prévia integrada lista "Sidebar: Padrão da identidade", embora o layout escolhido seja "Sem sidebar" e nenhuma sidebar tenha sido selecionada. | `previa-integrada-aplicacao-computador-parte1.png` |
| B10 | Baixa | A **busca global (Ctrl+K)** só indexa módulos: "busca", "Campos de busca", "filtro", "catálogo" e "produto" dão "Nada encontrado", mesmo existindo a categoria "Campos de busca". | `limitacao-busca-global-busca-sem-resultado.png` |
| B11 | Baixa (acessibilidade) | Na etapa "Headers e sidebars", as prévias de sidebar inserem dezenas de elementos `<main>` (37 landmarks *main* na página). Detectei isso pela árvore de acessibilidade (o seletor `main` deu "strict mode violation: resolved to 37 elements"), por isso não há captura visual. | (sem captura) |

## 4. Lacunas e limitações (características sem opção fiel)

- **Filtros: LACUNA parcial.** Não há componente "Filtros". Usei o Drawer de filtros (Soft Pill), cujos critérios de exemplo (Status, Ativos/Pausados, Somente favoritos, Com anexos) não podem ser configurados.
- **Catálogo de produtos: parcial.** Não há módulo de página de catálogo. O mais próximo é o template "E-commerce de moda" (categorias + vitrine), com conteúdo de moda.
- **Cards de produtos: parcial.** O componente Cards não tem campo de preço e mostra uma avaliação fixa ("4,9"). O exemplo base é de viagem.
- **Inspiração botânica nos componentes:** nenhuma das 16 famílias visuais é orgânica ou botânica. A inspiração vem da paleta, da landing e da Inspiration Gallery.
- **Identidade visual:** não há upload de logotipo nem símbolo.
- **Conteúdo editável:** não dá para editar itens de navegação do header, destinos do menu inferior mobile ou categorias da faixa mobile.
- **Tecnologia:** o campo é texto livre, preenchido com "HTML + CSS + JavaScript". Não há como registrar a restrição "abrir no navegador sem etapa de build". O Master Prompt só repete a tecnologia na seção A.
- **Validação responsiva:** "Baixar configuração" fica desabilitado sem URL de um site já construído. Só consegui baixar o executor genérico `runner.py`.

## 5. Dificuldades encontradas

- O shell do Studio tem header e barra de ações fixos. Por isso, capturas "página inteira" saem com sobreposições, e prévias altas (tablet, celular, landing com rolagem interna) precisaram ser capturadas em várias partes de 1440×900. Isso é limitação de captura, não bug.
- Os modelos de landing, header e mobile só ficam selecionados depois de clicar no botão de confirmação dentro da prévia ("Selecionar este modelo", "Selecionar composição A"). Em desktop e mobile, clicar no desenho já seleciona.

## 6. Arquivos exportados (`exportados/`, nomes originais)

| Arquivo | Origem no Studio | Bytes |
|---|---|---|
| `verde-vivo-master-prompt.md` | Exportar e importar → Master Prompt (.md) → Baixar | 46346 |
| `verde-vivo-especificacao.json` | Exportar e importar → Especificação JSON → Baixar | 105904 |
| `verde-vivo-tokens.css` | Exportar e importar → CSS de referência → Baixar | 3850 |
| `verde-vivo-ficha.html` | Exportar e importar → Ficha do projeto (HTML) → Baixar | 68776 |
| `verde-vivo-backup.json` | Exportar e importar → Backup completo → Baixar (0 versões salvas) | 4304 |
| `header-mega-emporio-composicao-a.json` | Headers e sidebars → Mega Empório → Ver em tamanho grande → Exportar especificação | 6049 |
| `verdant-atelier-original.css` / `.json` / `.html` | Inspiration Gallery → Verdant Atelier → Exportar (CSS de referência, JSON, HTML demonstrativo) | 3027 / 5678 / 111550 |
| `template-ecommerce-moda.css` / `.json` / `.html` | Template Studio → E-commerce de moda → Exportar (CSS, Especificação JSON, HTML demonstrativo) | 4968 / 9258 / 96811 |
| `runner.py` | Validação responsiva → Baixar executor (runner.py). Ferramenta genérica, não é exportação do projeto, e não foi executada. | 12402 |

Nenhum download falhou. O único download que não pôde ser feito foi "Baixar configuração" da Validação responsiva, que fica desabilitado sem URL.

**Master Prompt exportado:** `/home/user/prontuario-eletronico/design-system-studio/auditoria/fase2-projetos/P2-verde-vivo/exportados/verde-vivo-master-prompt.md`
