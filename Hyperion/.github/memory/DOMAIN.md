# Domain Model

Entities, relationships, flows, and boundaries of this project's domain.

## Entities

| Entity | Description | Key attributes |
|--------|------------|----------------|
| Usuario | Conta autenticada | email, sessão, OAuth, config |
| Recurso | Conta/carteira financeira | saldo, tipo |
| Transacao | Movimentação financeira | valor, categoria, tags, recorrência |
| Meta | Objetivo de poupança | prazo, aportes, progresso |
| Viagem | Planejamento de viagem + moedas | destino, pretensões, meta vinculada |
| Lembrete | Alerta / Google Calendar | vencimento, antecedência, sync |
| Grupo | Espaço compartilhado | membros, metas/viagens de grupo |
| Orcamento | Limites mensais por categoria | rollover, alertas |
| Divida | Dívida pessoal | parcelas, quitação |
| DivisaoDespesa | Rateio entre pessoas | pagamentos, saldo |
| PlanejamentoCompra | Item a comprar | sobra, parcelas, meta |
| Insight | Análise assistida por IA | score, sugestões, cache |

## Flows

- Auth → Dashboard → Transações / módulos laterais
- Importação de extratos (PDF) no dashboard
- Lembretes ↔ Google Calendar (opt-in)
- Insights: agregação de contexto → score/projeções → LLM (Gemini Insights)

## Boundaries

- Chatbot / quick-add IA (RF-139) fora do escopo dos cards de Insights atuais
- Metas/viagens de grupo tratadas no epic Grupos
- Vale-transporte e gamificação existem no produto; escopo de cards Hyperion cobriu módulos principais listados nos epics PULSO-EPIC-001–013

## Business Rules

Prefixos `RN-*` e `RF-*` em `Documentacao/01-Produto`. Cards referenciam esses IDs.
