# Análise de produto — gaps e oportunidades

> **Ago/2026** — visão baseada no código em `Codigo/Pulso/` e na [auditoria PO](./Análises/PO/00-Sumario-Executivo.md).

## O que já é sólido

- **Core financeiro:** auth (email + Google, cookies httpOnly), transações com recorrência, categorias com **`grupoBeneficio`**, tags, orçamento com alertas e flag `orcamentoExcedeRenda`.
- **Operacional:** vale transporte (decisão B — CLT com aviso), calendário + lembretes + sync Google Calendar.
- **Planejamento:** metas com aportes, dívidas, viagens, **planejamento de compra** (RN-088/093), **divisão de despesas** (`/expense-split`).
- **Grupos (social):** ver [Modulos/Grupos.md](./Modulos/Grupos.md) — rate limit em códigos de convite.
- **Entrada do produto:** pós-login vai para **`/transactions`** (não mais dashboard vazio).
- **Landing:** badges Em breve/Beta nos módulos incompletos.

## Gaps principais

### 1. Navegação vs realidade

A sidebar ainda lista módulos placeholder: `/dashboard`, `/reports`, `/insights`, `/chatbot`, `/achievements`, `/profile`, `/settings`.

**Feito:** redirect pós-auth → `/transactions`.  
**Pendente:** dashboard MVP ou ocultar/badge itens incompletos na sidebar.

### 2. Perfil e configurações

`modoUso`, renda fixa, VA/VR/VT e preferências existem no banco mas **não têm tela**. VT e calendário dependem disso.

**Sugestão:** `/settings` (RF-073–077, RF-103–104).

### 3. IA prometida, parcial

Landing honesta com badges; backend: regra simples (maior gasto). **Gemini** e chatbot ainda sem provider.

### 4. Gamificação — backend sim, UI não

API: streak/conquistas; `/achievements` ainda placeholder.

### 5. Divisão de despesas ✅

Módulo **implementado** (RF-115–120). Falta **integração** com toggle RF-095 no detalhe do grupo.

### 6. Grupos — gaps restantes

| Gap | Prioridade |
|-----|------------|
| Integrar RF-095 ↔ `/expense-split` | Média |
| Chat tempo real (WebSocket) | Média — inviável em serverless |
| Testes E2E grupos | Média |

## Prioridade sugerida

| # | Entrega | Por quê |
|---|---------|---------|
| 1 | Dashboard mínimo | Primeira tela útil além de transações |
| 2 | Perfil / `modoUso` | Desbloqueia VT, calendário, onboarding |
| 3 | `/achievements` mínimo | Fecha loop gamificação |
| 4 | Gemini insights MVP | Diferencial landing |
| 5 | Grupos ↔ expense-split | RF-095 completo |

## Lógicas que já funcionam bem (manter)

- Estimativas de transporte com ajuste sazonal.
- Rateio em centavos (divisão de despesas).
- Jobs orçamento, lembretes, dívidas.
- Rollover de orçamento (RN-170).

---

*Atualize quando um gap for fechado. Correções PO: ago/2026.*
