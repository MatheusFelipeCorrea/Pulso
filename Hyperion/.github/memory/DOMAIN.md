# Domain Model

Entities, relationships, flows, and boundaries of this project's domain.

Fonte: README do produto. Sem modelagem formal ainda (`docs/3.requisitos.md` e `docs/4.modelagem.md` estão em template).

## Entities

| Entity | Description | Key attributes |
|--------|------------|----------------|
| Usuário | Estagiário, estudante ou jovem em início de carreira | perfil financeiro em formação |
| Recurso real | Dinheiro de uso livre (ex.: salário) | origem, valor |
| Benefício restrito | Recurso com restrição de uso | tipo (VA, VR, VT), regras de uso |
| Insight | Sugestão gerada por IA | provedor planejado: Google Gemini |
| Viagem | Planejamento de viagem com câmbio | câmbio integrado |
| Grupo | Planejamento financeiro compartilhado | membros |

## Flows

- Registrar e acompanhar entradas/saídas, separando salário de benefícios restritos.
- Consultar insights de IA sobre a saúde financeira.
- Planejar viagem considerando câmbio.
- Planejar em grupo.

## Boundaries

- Web (React), API (Node) e mobile (Flutter) ainda não implementados.
- Integração Gemini, câmbio e persistência: a definir no scaffold.

## Business Rules

- Benefícios VA/VR/VT não devem ser tratados como dinheiro livre.
- Produto gratuito (visão atual do time).
