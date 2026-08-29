# Diagramas do Pulso (PlantUML + PNG)

Versão 2.1 (TI5). Fontes `.puml` e imagens renderizadas. A apostila anexa os PNG em [`docs/4.modelagem.md`](../../4.modelagem.md).

| Pasta | Fonte | Imagem | Seção na apostila |
|-------|--------|--------|-------------------|
| `Arquitetura/` | `prompt-arquitetura.md` | `DiagramaArquiteturaPulso.jpg` | 4 (visão geral, Fig. 1) |
| `Caso de Uso/` | `caso-de-uso.puml` | `DiagramadeCasodeUso.png` | 4.1 (Fig. 2) |
| `Classes/` | `classes.puml` | `DiagramadeClasses.png` | 4.2 (Fig. 3) |
| `Componentes/` | `componentes.puml` | `DiagramadeComponentes.png` | 4.2 (Fig. 4) |
| `Pacotes/` | `pacotes.puml` | `DiagramadePacotes.png` | 4.2 (Fig. 5) |
| `Implantacao/` | `implantacao.puml` | `DiagramaImplantacao.png` | 4.2 (Fig. 6) |
| `Modelo de Dados/` | `modelo-dados.puml` | `ModelodeDados.png` | 4.3 (Fig. 7) |
| `Sequencia/` | `sequencia.puml` | `DiagramadeSequencia.png` | 4.4 (Fig. 8) |
| `Comunicacao/` | `comunicacao.puml` | `DiagramadeComunicacao.png` | 4.4 (Fig. 9) |
| `Estado/` | `estado.puml` | `DiagramadeEstado.png` | 4.4 (Fig. 10) |
| `Fluxo de Dados/` | `fluxo-dados.puml` | `FluxodeDados.png` | 4.4 (Fig. 11) |

## Arquitetura multi-cliente

- **Web:** React + Vite (`code/front`)
- **Backend:** Node.js + Express (`code/back`) — API única `/api`
- **Mobile:** Flutter — planejado; mesma REST + Socket.IO

Render (a partir desta pasta):

```bash
java -jar plantuml.jar -tpng "**/*.puml"
```
