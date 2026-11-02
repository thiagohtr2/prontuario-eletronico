# Desvios da regra de isolamento dos desenvolvedores

Relatados pelos próprios desenvolvedores ao concluir. Ficam registrados porque podem afetar a
independência dos resultados.

| Site | Desvio relatado | Risco de contaminação |
| --- | --- | --- |
| P2 Verde Vivo — dev-3 | Criou por engano dois arquivos fora da própria pasta (script de depuração e log do servidor) e depois os apagou. | Baixo: escreveu fora da pasta, não relatou ter lido arquivos de outros. |
| P2 Verde Vivo — dev-2 | Moveu por engano arquivos da pasta compartilhada `scratchpad/shots` para a própria pasta e depois os devolveu; gravou e apagou um `shot.js` na raiz do scratchpad (pode ter sobrescrito um arquivo homônimo). A pasta `shots` continha capturas antigas dos módulos do Studio (ex.: sites da Inspiration Gallery, telas de cadastro). | Médio: não se sabe se abriu essas capturas. Os auditores devem tratar a fidelidade visual de P2/dev-2 com essa ressalva. |

Os demais desenvolvedores não relataram desvios até o momento.
