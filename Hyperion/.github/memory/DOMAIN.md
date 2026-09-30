# Domain Model

Entities, relationships, flows, and boundaries of this project's domain.

Fonte: README do produto, `docs/3.requisitos.md`, `docs/4.modelagem.md` e o código em `Codigo/Pulso/`.

## Entities

| Entity | Description | Key attributes |
|--------|------------|----------------|
| Usuário | Estagiário, estudante ou jovem em início de carreira | perfil financeiro em formação |
| Recurso real | Dinheiro de uso livre (ex.: salário) | origem, valor |
| Benefício restrito | Recurso com restrição de uso | tipo (VA, VR), regras de uso |
| Transação | Receita, despesa ou transferência | categoria, tags, recorrência |
| Meta | Planejamento com valor-alvo e prazo | aportes, pause/retomar, reserva de emergência |
| Insight | Sugestão gerada por IA | provedor planejado: Google Gemini |
| Viagem | Planejamento de viagem com câmbio | pretensões, `metaId` opcional |
| Moeda | Cotação e conversão | favoritas, histórico (web/API) |
| Grupo | Planejamento financeiro compartilhado | membros — API ainda não ligada |

## Flows

- Registrar e acompanhar entradas/saídas, separando salário de benefícios restritos.
- Acompanhar metas e aportes.
- Planejar viagem considerando câmbio.
- Consultar insights de IA sobre a saúde financeira (módulo ainda no backlog).
- Planejar em grupo (client web/Flutter; rota `/api/grupos` comentada).

## Boundaries

- Web (React) em `Codigo/Pulso/web`, API (Node + Prisma + PostgreSQL) em `Codigo/Pulso/api`, mobile (Flutter) em `Codigo/Pulso/mobile`.
- Clientes consomem a mesma API REST; Socket.IO ainda não está no Flutter.
- Integrações ativas: Google OAuth, SMTP, cotações (AwesomeAPI/Frankfurter). Gemini e Calendar ficam nos módulos ainda não ligados.

## Business Rules

- Benefícios VA/VR não devem ser tratados como dinheiro livre.
- Produto gratuito (visão atual do time).
