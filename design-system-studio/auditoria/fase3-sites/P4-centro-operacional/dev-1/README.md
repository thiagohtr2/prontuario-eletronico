# Centro Operacional — demonstração

Tela única ("One Screen") para acompanhar dados operacionais e indicadores, feita a partir do `PROMPT.md`.
É uma demonstração navegável e interativa, **sem backend**: todos os dados são fictícios e ficam no próprio front-end.

Tecnologia: **HTML + CSS + JavaScript puros** (sem framework, sem build, sem dependências).
A única fonte externa é a Inter (Google Fonts); sem internet, o navegador usa a fonte do sistema e tudo continua funcionando.

## Como executar

**Opção 1 — direto do disco:** abra `index.html` no navegador (funciona em `file://`; os scripts são clássicos, não módulos).

**Opção 2 — servidor estático:**

```bash
cd caminho/da/pasta
python3 -m http.server 4441
# abra http://localhost:4441/
```

Não há etapa de build nem pasta `dist/`.

## O que dá para fazer na demonstração

| Área | Interações |
| --- | --- |
| **Header** | **Atualizar** (atalho `R`) recarrega os dados mostrando os estados de carregamento. **Simular** (menu só de demonstração): gerar alerta, simular falha/retorno de conexão, esvaziar/restaurar os dados. |
| **Indicadores** (Compact Pro) | 4 cartões; passe o mouse no mini gráfico para ver o valor de cada ponto (no teclado: foco no cartão + `←`/`→`). Clique (ou `Enter`) abre o **relatório detalhado** em modal. |
| **Operação** | Blocos de status de **filas, SLA e equipes**, com cor semântica + ícone + texto e a "situação geral". Os números variam a cada 10 s; mudanças de nível geram alertas. |
| **Pedidos recentes** (Compact Pro) | Ordenação clicando nos cabeçalhos (`aria-sort`), seleção com checkbox (todos/indeterminado), ação em lote "Concluir selecionados", busca por cliente (atalho `/`), menu de ações por linha (ver detalhes, concluir, cancelar com confirmação). Estados de carregando, vazio e erro. |
| **Alertas** | Lista cronológica com severidade; novos alertas entram no topo com animação discreta e `aria-live="polite"`. Se a lista estiver rolada, nada "pula": aparece o aviso "N novos alertas". |
| **Barra de status** | Relógio, estado da conexão e horário da última atualização. |

## Comportamento por tamanho de tela

| Viewport | Layout |
| --- | --- |
| ≥ 1280 px de largura e ≥ 640 px de altura | Painel operacional completo: grade + coluna de alertas (≈304 px) + barra de status (≈32 px). Sem rolagem da página; áreas internas rolam com "fade" indicando mais conteúdo. |
| 768–1279 px (altura ≥ 640) | Mesma estrutura; os alertas viram uma aba **Painel / Alertas** no header. |
| ≥ 768 px com altura < 640 px (notebook pequeno, zoom 150–200 %) | One Screen desativado: a página rola e os painéis se empilham. |
| < 768 px (celular) | Topbar (≈56 px + safe area) + abas **Indicadores / Operação / Pedidos / Alertas** (≈44 px), cada painel com destaque no topo e blocos abaixo; tabela vira cartões. Na horizontal, as abas viram um rail vertical à esquerda. Com altura < 560 px a tela volta a rolar. |
| ≥ 1440 px / ≥ 1920×1000 / ≥ 2560×1300 / ≥ 3840×2000 | Monitores grandes: coluna de alertas mais larga e escala proporcional (125 % / 150 % / 225 %) para leitura à distância. |

Os breakpoints usam `em`, então a fonte ampliada do sistema também reorganiza o layout (menos colunas) em vez de cortar texto.

## Estrutura de arquivos

```
index.html            Shell da página (header, abas, conteúdo, alertas, barra de status, modal)
css/
  tokens.css          Todos os tokens (paleta Neutro Essencial, tipografia, geometria, Compact Pro, medidas do shell)
  base.css            Reset, tipografia base, foco visível, utilitários, prefers-reduced-motion
  components.css      Botões, abas, badges, KPI, blocos de status, tabela, alertas, menus, modal, estados; ajustes de celular
  layout.css          Grid do shell e os modos (full, compact, stacked, mobile, rail, monitores grandes)
js/
  icons.js            Ícones lucide (contorno, traço 1.75) embutidos como SVG
  data.js             Dados fictícios (KPIs, filas/SLA/equipes, pedidos, alertas e gerador de alertas)
  ui.js               Utilitários reutilizáveis: formatação pt-BR, anúncios para leitor de tela, fade de rolagem, menu, modal, abas
  app.js              Estado, renderização, simulação em tempo real, modos de layout e atalhos
tests/
  check.js            Layout em 23 tamanhos (320×568 a 2560×1440): sem overflow horizontal, sem rolagem da página no modo One Screen, sem texto cortado
  interact.js         Interações (tooltip, modal, ordenação, seleção, menus, estados, alertas, abas, alvos de toque de 44 px, campos de 16 px)
  font.js             Fonte ampliada (150 %): sem sobreposição nem overflow
NOTES.md              Ambiguidades da especificação e decisões tomadas
PROMPT.md             Especificação original do cliente
```

## Testes automatizados (opcional)

Requer Node + Playwright e o servidor estático da opção 2 rodando na porta 4441:

```bash
node tests/check.js      # adicione --shots para salvar capturas em tests/shots/
node tests/interact.js
node tests/font.js
```

`window.CO.debug` expõe alguns ganchos (`pushAlert`, `refresh`, `setOnline`, `setEmpty`) usados pelos testes.
