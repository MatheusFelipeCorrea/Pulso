# Análise de produto — gaps e oportunidades

> **Ago/2026** — visão baseada no código em `Codigo/Pulso/` e na [auditoria PO](../03-Auditorias/Product%20Owner/00-Sumario-Executivo.md).  
> Pack de agents/skills: [`.github/INDEX.md`](../../.github/INDEX.md).

## O que já é sólido

- **Core financeiro:** auth (email + Google, cookies httpOnly), transações com recorrência, categorias com **`grupoBeneficio`**, tags, orçamento com alertas e flag `orcamentoExcedeRenda`.
- **Operacional:** vale transporte (decisão B — CLT com aviso), calendário + lembretes + sync Google Calendar.
- **Planejamento:** metas com aportes, dívidas, viagens, **planejamento de compra** (RN-088/093), **divisão de despesas** (`/expense-split`).
- **Dashboard:** `GET /dashboard` + `DashboardPage` — saldos, gráficos, alertas, metas; pós-login → **`/dashboard`**.
- **Importação:** OFX/CSV/XLSX/PDF (Gemini) — upload → preview → confirmar no modal do dashboard (RF-155–158, RF-160). Falta **RF-159** (aprendizado).
- **Grupos (social):** ver [Modulos/Grupos.md](../02-Engenharia/Modulos/Grupos.md) — rate limit em códigos de convite; remover membro / alterar papel entregues.
- **Tema:** claro/escuro na landing (`PublicHeader`) e na área autenticada (`UserMenu`).
- **Landing:** badges Em breve/Beta nos módulos incompletos.

## Gaps principais

### 1. Perfil e configurações

`modoUso`, renda fixa, VA/VR/VT e preferências existem no banco mas **não têm tela** dedicada (`/settings` / `/profile`). VT e calendário dependem disso para coleta completa.

**Sugestão:** `/settings` (RF-073–075, RF-077, RF-103–104).

### 2. IA prometida, parcial

Landing honesta com badges; backend: regra simples (maior gasto). **Gemini** já usado na importação PDF; chatbot / insights / RF-139 (quick-add) ainda sem UI completa.

### 3. Gamificação — backend sim, UI não

API: streak/conquistas; `/achievements` ainda placeholder.

### 4. Divisão de despesas ✅

Módulo **implementado** (RF-115–120). Falta **integração** com toggle RF-095 no detalhe do grupo.

### 5. Grupos — gaps restantes

| Gap | Prioridade |
|-----|------------|
| Integrar RF-095 ↔ `/expense-split` | Média |
| Chat tempo real (WebSocket) | Média — inviável em serverless |
| Testes E2E grupos | Média |

### 6. Importação — residual

| Gap | Prioridade |
|-----|------------|
| RF-159 aprendizado com ajustes do usuário | Média |
| Onboarding RF-151–154 (inclui rota import vs saldos manuais) | Alta quando for prototipar |

## Prioridade sugerida

| # | Entrega | Por quê |
|---|---------|---------|
| 1 | Perfil / `modoUso` / settings | Desbloqueia VT, calendário, onboarding |
| 2 | RF-139 quick-add no dashboard | Fecha o gap do dashboard (8/9) |
| 3 | RF-159 aprendizado na importação | Fecha o módulo de import |
| 4 | `/achievements` mínimo | Fecha loop gamificação |
| 5 | Gemini insights MVP | Diferencial landing |
| 6 | Grupos ↔ expense-split | RF-095 completo |

## Lógicas que já funcionam bem (manter)

- Estimativas de transporte com ajuste sazonal.
- Rateio em centavos (divisão de despesas).
- Jobs orçamento, lembretes, dívidas.
- Rollover de orçamento (RN-170).
- Dedupe e preview na importação de extratos.

---

*Atualize quando um gap for fechado. Correções PO: ago/2026.*
