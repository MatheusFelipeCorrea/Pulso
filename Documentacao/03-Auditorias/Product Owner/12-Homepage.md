# 🏠 Módulo 12 — Homepage (Landing Page) — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [02-Dashboard.md](./02-Dashboard.md), [06-Insights-e-Chatbot.md](./06-Insights-e-Chatbot.md), [11-Gamificacao.md](./11-Gamificacao.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-084–087).
> Código auditado: `web/src/pages/LandingPage.jsx`, `web/src/components/features/landing/landingData.js`, `web/src/components/features/landing/LandingHero.jsx`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **✅ 4/4**, confirmado tecnicamente. **Correções aplicadas (ago/2026):** badges "Em breve" (Dashboard, Chatbot) e "Beta" (IA Insights); textos ajustados para refletir o que existe hoje; redirect pós-login de `/dashboard` → `/transactions` via `DEFAULT_AUTHENTICATED_ROUTE` (RF-NOVO-B1/L1).

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-084 | Homepage pública apresentando o Pulso | ✅ | Confirmado |
| RF-085 | CTAs (Cadastrar e Entrar) | ✅ | Confirmado |
| RF-086 | Seções com os principais módulos | ✅ | Confirmado — cards com badges onde aplicável |
| RF-087 | Responsiva, paleta Vital Purple | ✅ | Confirmado (design system) |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. ~~**Redirect autenticado para `/dashboard` quebrado.**~~ **✅ Corrigido** — `LandingPage`, `GuestRoute`, `Login`, `AuthCallback` e `TransportVoucherPage` usam `/transactions`.
2. ~~**Sem indicador "em breve" nos módulos não implementados.**~~ **✅ Corrigido** — badges nos cards de Dashboard, Chatbot e IA Insights; texto de Gamificação sem prometer desafios.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### ✅ Corrigido — Descompasso marketing vs. realidade (RF-NOVO-L1/L2)

| Feature | Ajuste aplicado |
|---|---|
| Dashboard | Badge **Em breve** |
| IA Insights | Badge **Beta** + texto: alerta de maior gasto do mês |
| Chatbot | Badge **Em breve** |
| Gamificação | Texto sem "desafios" — sequências e conquistas apenas |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- ~~**RF-NOVO-L1**~~ — ✅ Badges "Em breve"/"Beta" nos cards.
- ~~**RF-NOVO-L2**~~ — ✅ Texto de IA Insights ajustado.
- ~~**RF-NOVO-B1** (Módulo 02)~~ — ✅ Redirect pós-auth para `/transactions`.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status |
|---|---|---|
| 1 | Badges Dashboard/Chatbot (RF-NOVO-L1) | ✅ Feito |
| 2 | Texto IA Insights (RF-NOVO-L2) | ✅ Feito |
| 3 | Redirect pós-login → `/transactions` (RF-NOVO-B1) | ✅ Feito |

---

*Próximo módulo sugerido: 13 — Grupos.*
