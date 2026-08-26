# Análise de produto — gaps e oportunidades

> **Ago/2026** — visão baseada no código em `Codigo/Pulso/` e na [auditoria PO](../03-Auditorias/Product%20Owner/00-Sumario-Executivo.md).  
> Pack de agents/skills: [`.github/INDEX.md`](../../.github/INDEX.md).

## O que já é sólido

- **Core financeiro:** auth (email + Google, cookies httpOnly), transações com recorrência, categorias com **`grupoBeneficio`** (VA/VR/VT como tipos de recurso), tags, orçamento com alertas e flag `orcamentoExcedeRenda`.
- **Operacional:** calendário + lembretes + sync Google Calendar; jobs via cron e, quando configurado, **RabbitMQ** (`pulso.alerts` / `pulso.reminders` / `pulso.emails`).
- **Planejamento:** metas com aportes, dívidas, viagens (estimativas de **transporte** / passagens + moedas), **planejamento de compra** (RN-088/093), **divisão de despesas** (`/expense-split`).
- **Dashboard:** `GET /dashboard` + `DashboardPage` — saldos, gráficos, alertas, metas; pós-login → **`/dashboard`**.
- **Importação:** OFX/CSV/XLSX/PDF (Gemini) — upload → preview → confirmar no modal do dashboard (RF-155–158, RF-160). Falta **RF-159** (aprendizado).
- **Grupos (Premium):** ver [Modulos/Grupos.md](../02-Engenharia/Modulos/Grupos.md) — convites, viagem/metas compartilhadas, **chat Socket.IO**; rate limit em códigos de convite.
- **Planos Free/Premium:** gate no backend (`requirePremium` em grupos); demo sem billing.
- **Tema:** claro/escuro na landing (`PublicHeader`) e na área autenticada (`UserMenu`).
- **Landing:** badges Em breve/Beta nos módulos incompletos.

## Gaps principais

### 1. Perfil e configurações

`modoUso`, renda fixa, VA/VR/VT e preferências existem no banco mas **não têm tela** dedicada (`/settings` / `/profile`).

**Sugestão:** `/settings` (RF-073–075, RF-077, RF-103–104).

### 2. IA prometida, parcial

Landing honesta com badges; backend: regra simples (maior gasto). **Gemini** já usado na importação PDF; chatbot / insights / RF-139 (quick-add) ainda sem UI completa.

### 3. Divisão de despesas ✅

Módulo **implementado** (RF-115–120). Falta **integração** com toggle RF-095 no detalhe do grupo.

### 4. Grupos — gaps restantes

| Gap | Prioridade |
|-----|------------|
| Integrar RF-095 ↔ `/expense-split` | Média |
| Testes E2E grupos | Média |

### 5. Importação — residual

| Gap | Prioridade |
|-----|------------|
| RF-159 aprendizado com ajustes do usuário | Média |
| Onboarding RF-151–154 (inclui rota import vs saldos manuais) | Alta quando for prototipar |

### 6. Hospedagem TI5

Web na Vercel + API long-running para Socket.IO/RabbitMQ — ver [TI5-Hospedagem.md](../02-Engenharia/Deploy/TI5-Hospedagem.md).

## Prioridade sugerida

| # | Entrega | Por quê |
|---|---------|---------|
| 1 | Perfil / `modoUso` / settings | Desbloqueia calendário completo e onboarding |
| 2 | RF-139 quick-add no dashboard | Fecha o gap do dashboard (8/9) |
| 3 | RF-159 aprendizado na importação | Fecha o módulo de import |
| 4 | Gemini insights MVP | Diferencial landing |
| 5 | Grupos ↔ expense-split | RF-095 completo |

## Lógicas que já funcionam bem (manter)

- Estimativas de transporte com ajuste sazonal (viagens).
- Rateio em centavos (divisão de despesas).
- Jobs orçamento, lembretes, dívidas (cron e/ou filas RabbitMQ).
- Rollover de orçamento (RN-170).
- Dedupe e preview na importação de extratos.
- Chat de grupos em tempo real (Socket.IO).

---

*Atualize quando um gap for fechado. Correções PO: ago/2026.*
