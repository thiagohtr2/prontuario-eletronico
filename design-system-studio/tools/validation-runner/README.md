# Responsive Validation Runner

Executor local, separado da interface do Studio, que testa um site real em várias larguras de tela e gera
um relatório JSON de problemas de responsividade.

## Instalação

```bash
python -m venv .venv && source .venv/bin/activate   # opcional
pip install playwright
python -m playwright install chromium
```

## Uso

1. No Studio, abra **Ferramentas → Validação responsiva**, preencha URL, rotas e larguras e clique em
   **Baixar configuração**.
2. Rode:

```bash
python runner.py --config validation-config.json --out report.json
```

3. Importe `report.json` no Studio e gere o **prompt de correção** para o Claude Code, Cursor ou outra IA.

## Sites com login

Marque **Login manual** na configuração. O executor abre uma janela do navegador; entre com uma
**conta de teste** e pressione Enter no terminal. A senha nunca passa pelo script e a sessão não é salva.

## Verificações

| Tipo | O que detecta |
| --- | --- |
| `overflow-horizontal` | Rolagem horizontal involuntária da página |
| `elemento-mais-largo-que-a-tela` | Elementos que ultrapassam a largura da tela (fora de contêineres com rolagem própria) |
| `fora-da-tela` | Elementos que começam antes da borda esquerda |
| `alvo-de-toque-pequeno` | Botões e links menores que o mínimo configurado (padrão 44 px), em telas < 768 px |
| `fonte-pequena-em-campo` | Campos com fonte < 16 px em telas < 768 px (zoom automático no iOS) |

## Segurança

- Visita somente a URL base e as rotas configuradas (mesma origem). Não clica nem envia formulários.
- Prefira ambientes de staging, contas de teste e dados fictícios.
- O relatório não inclui cookies, tokens, textos da página nem capturas de tela — só seletores e medidas.
- Nunca coloque senhas no arquivo de configuração nem no Master Prompt.
