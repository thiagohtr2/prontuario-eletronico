# Relatório de responsividade

Gerado em 29/10/2026, 07:26:40 por `scripts/qa/responsive.cjs`,
no Chromium (Playwright), com o Supabase simulado e dados fictícios propositalmente longos
(nomes, e-mails, endereços e textos clínicos extensos).

**468 combinações de tela × tamanho medidas — 0 com problemas.**

## Resultado por tamanho de tela

| Viewport | Telas | Overflow horizontal | Fora do viewport | Alvo < 44 px | Gap < 8 px | Sobreposição | Coberto pelo dock | Rótulo transborda | Estado não reproduzido | Texto truncado* | Resultado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 344 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 360 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 375 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 390 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 412 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 430 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 480 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 600 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 640 (1280 @ 200%) | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 768 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 820 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 1024 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 32 | ✅ aprovado |
| 1280 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 32 | ✅ aprovado |
| 1440 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 32 | ✅ aprovado |
| 1920 | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 32 | ✅ aprovado |
| 568×320 paisagem | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |
| 844×390 paisagem | 26 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ✅ aprovado |

\* Texto truncado é listado para revisão, não reprova: só é aceito em conteúdo secundário cujo
valor completo aparece em outro lugar (ver abaixo).

## Resultado por tela e estado

| Tela / estado | Rota | Tamanhos | Problemas |
| --- | --- | --- | --- |
| entrar | `/entrar` | 18 | 0 ✅ |
| cadastro | `/cadastro` | 18 | 0 ✅ |
| recuperar | `/recuperar-senha` | 18 | 0 ✅ |
| redefinir-invalido | `/redefinir-senha` | 18 | 0 ✅ |
| inicio | `/inicio` | 18 | 0 ✅ |
| pacientes | `/pacientes` | 18 | 0 ✅ |
| redefinir-senha | `/redefinir-senha` | 18 | 0 ✅ |
| entrar-erros-campo | `/entrar` | 18 | 0 ✅ |
| entrar-erro-servidor | `/entrar` | 18 | 0 ✅ |
| cadastro-sucesso | `/cadastro` | 18 | 0 ✅ |
| prontuario-excluir-aberto | `/pacientes/p1` | 18 | 0 ✅ |
| inicio-vazio | `/inicio` | 18 | 0 ✅ |
| pacientes-vazio | `/pacientes` | 18 | 0 ✅ |
| inicio-carregando | `/inicio` | 18 | 0 ✅ |
| inicio-menu-aberto | `/inicio` | 18 | 0 ✅ |
| pacientes-modal-aberto | `/pacientes` | 18 | 0 ✅ |
| prontuario | `/pacientes/p1` | 18 | 0 ✅ |
| atendimentos | `/atendimentos` | 18 | 0 ✅ |
| nova-evolucao | `/atendimentos/novo` | 18 | 0 ✅ |
| editar-atendimento | `/atendimentos/e1/editar` | 18 | 0 ✅ |
| clinicas | `/clinicas` | 18 | 0 ✅ |
| configuracoes | `/configuracoes` | 18 | 0 ✅ |
| prontuario-receita-aberta | `/pacientes/p1` | 18 | 0 ✅ |
| configuracoes-modelo-aberto | `/configuracoes` | 18 | 0 ✅ |
| clinicas-form-aberto | `/clinicas` | 18 | 0 ✅ |
| landing | `/` | 18 | 0 ✅ |

## Texto truncado

- span "Dra. Ana Carolina Vasconcellos de Albuqu" — em 1024, 1280, 1440, 1920
- span "Ginecologia, Obstetrícia e Medicina Repr" — em 1024, 1280, 1440, 1920

Truncamentos aceitos de propósito: nome e especialidade no botão da conta, no header do desktop.
Os dois aparecem completos no topo do menu da conta, aberto pelo mesmo botão. Nomes de pacientes,
clínicas, horários, datas e status nunca são truncados: quebram linha.

## O que é medido

- **Overflow horizontal:** `document.documentElement.scrollWidth > clientWidth` (tolerância de 1 px).
- **Fora do viewport:** qualquer elemento visível que ultrapasse as bordas e não esteja dentro de um
  container com rolagem própria.
- **Alvo < 44 px:** links, botões, campos, abas e itens de menu visíveis com largura ou altura
  menor que 44 px. Links dentro de frases são listados à parte (exceção do WCAG 2.5.8).
- **Gap < 8 px / sobreposição:** distância real entre caixas (`getBoundingClientRect`) de controles
  distintos na mesma camada, recortadas pelos containers roláveis. Partes de um mesmo controle
  (opções do segmented control, botão de mostrar senha dentro do campo) não contam.
- **Rótulo transborda:** rótulos que não podem quebrar (navegação) e não cabem no próprio controle.
- **Coberto pelo dock:** no fim da rolagem, o último conteúdo da página precisa terminar acima do dock.
- Com um diálogo aberto, só o conteúdo do diálogo é medido (o resto fica sob o overlay).

## Teclado

`scripts/qa/keyboard.cjs` percorre landing, acesso, painel, pacientes, prontuário e nova evolução com
Tab a 390 e 1440 px. Confere indicador de foco visível em cada elemento, que nenhum foco fique
inteiramente escondido sob o header fixo ou o dock (WCAG 2.4.11), Escape e retorno de foco no menu
da conta, e a prisão de foco e o retorno ao fechar o diálogo.

```
586 focos verificados.
Nenhum problema de teclado encontrado.
```

## Erros de console

Nenhum erro inesperado. (O estado "entrar-erro-servidor" registra o 400 que o teste provoca de propósito com a senha errada.)

## Revisão visual

Ver [`revisao-visual.md`](revisao-visual.md) e as capturas em [`telas/`](telas/).

## Não testado nesta rodada

- Aparelhos reais (iPhone/Safari e Android/Chrome) e os motores WebKit e Gecko: só o Chromium foi usado.
- Teclado virtual real: o dock some quando a área visível encolhe (`visualViewport`), mas isso não foi
  exercitado em aparelho.
- Leitores de tela (VoiceOver, TalkBack, NVDA): a semântica (landmarks, rótulos, `aria-*`) foi revisada no
  código, não com o leitor ligado.
- Zoom do navegador em si: o zoom de 200% foi emulado como viewport de 640 px (1280 ÷ 2) e o de 400%
  pela largura de 320 px; aumento só de texto (sem zoom da página) não foi testado.
- Fluxos reais do Supabase: envio de e-mails de confirmação e redefinição, limites de tentativas e
  sessões reais. As respostas foram simuladas.
