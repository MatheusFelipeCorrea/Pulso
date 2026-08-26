# 📋 Pulso — Auditoria Completa de Requisitos e Arquitetura (PO + Engenharia)

> **Leia este documento primeiro.** Sintetiza a auditoria dos módulos com código e dos RNFs. Detalhe transversal: [00-Achados-Transversais.md](./00-Achados-Transversais.md).  
> Metodologia: leitura do código (`Codigo/Pulso/api` + `web`) vs. `Requisitos/Readme.md` e `RegrasDeNegocio.md`.

> **Escopo TI5:** o produto documentado não inclui módulos dedicados de gestão de vale-transporte, relatórios produto nem gamificação.

---

## ✅ Correções pós-auditoria (ago/2026)

A auditoria original registrou achados em vários módulos. A maior parte dos itens 🔴/🟡 abaixo **já foi endereçada no código ou na documentação**:

| Área | O que mudou |
|---|---|
| **Auth (01)** | Cookies `httpOnly`, mutex refresh, cadastro resiliente SMTP, P2002→409, rate-limit por rota, fix loop F5 em `/auth/me` |
| **Dashboard / UX entrada (02, 12)** | Pós-login → `/dashboard`; landing com badges Em breve/Beta |
| **Transações (03)** | Delete recorrente preserva histórico; `grupoBeneficio` + presets VA/VR/VT |
| **Metas (04)** | `excluirAporte` em meta concluída + UI de aportes |
| **Viagens (05)** | `@unique` em `Viagem.metaId`; RN-074 (10 cat.); doc cache RF-037 |
| **Lembretes (07)** | `criarLembrete` preserva registro se sync falhar; RF-067 |
| **Grupos (13)** | Rate limit preview/entrar; `@unique` viagem/grupo; metas atômicas; Socket.IO + Premium |
| **Orçamento (14)** | Flag `orcamentoExcedeRenda` no backend |
| **Dívidas (17)** | Reabertura auto ao excluir último pagamento |
| **Planejamento compra (18)** | RN-093 meta concluída; RN-088 média 3 meses; renda unificada |

**Ainda pendente (prioridade product/infra):** `modoUso` configurável (M10), Chatbot/Insights (M06), Redis/cache compartilhado (T5), badges sidebar incompletos (RNF-NOVO-B1), RN do Onboarding (escopo TI5).

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado (Next Steps)](#5-plano-de-ação-priorizado-next-steps)

---

## 1. Auditoria de Status (README vs. Realidade)

| # | Módulo | Status README | Veredito |
|---|---|---|---|
| 01 | Autenticação | ✅ 6/6 | ✅ Confirmado; achados T3/T4/T6/T7 corrigidos |
| 02 | Dashboard | 🟡 8/9 | ✅ API + UI; falta RF-015 |
| 03 | Transações | ✅ 13/13 | ✅ Confirmado; bugs recorrente + VA/VR/VT corrigidos |
| 04 | Metas | ✅ 8/8 | ✅ Confirmado; excluir aporte corrigido |
| 05 | Viagens | ✅ 11/11 | ✅ Confirmado; doc + unique metaId |
| 06 | Insights/Chatbot | ❌ 0% | ✅ Confirmado — chatbot inexistente |
| 07 | Lembretes | ✅ 5/5 | ✅ Confirmado; sync na criação corrigido |
| 10 | Perfil | 🟡 Parcial | ⚠️ `modoUso` ainda não setável na UI |
| 12 | Homepage | ✅ 4/4 | ✅ Badges alinhados à realidade |
| 13 | Grupos | ✅ 15/15 | ✅ Maduro; Premium + Socket.IO |
| 14 | Orçamento | ✅ 7/7 | ✅ Sólido; RN-059 no backend |
| 15 | Divisão | ✅ 6/6 | ✅ Referência de engenharia |
| 16 | Calendário | ✅ 5/5 | ✅ Sem achados críticos |
| 17 | Dívidas | ✅ 7/7 | ✅ Reabertura auto corrigida |
| 18 | Planej. compra | ✅ 6/6 | ✅ RN-088/093 corrigidos |
| 19 | Onboarding (planejado TI5) | ⏳ | RN ainda não escrita |

---

## 2. Gaps de Usabilidade (estado atual)

### Landing vs realidade ✅ Mitigado

Badges **Em breve** (Chatbot) e **Beta** (IA Insights); textos ajustados.

### Gaps ainda abertos

- **`modoUso` (M10):** segmentação Estagiário/PJ/PF inacessível na UI.
- **Chatbot / Insights com Gemini:** prometidos na visão de produto, implementação parcial.

---

## 3. Diagnóstico — achados históricos vs. hoje

| Achado original | Status ago/2026 |
|---|---|
| Delete recorrente apaga passado | ✅ Corrigido (UNTIL + dataCorte) |
| `modoUso` nunca setável | ⏸ Pendente (M10) |
| Padrão T6 (efeito colateral apaga recurso) | ✅ Auth + Lembretes corrigidos |
| Padrão T7 (check-then-act) | ✅ Viagem↔Meta, Grupos viagem/metas |
| RN-088 / RN-093 (Planejamento) | ✅ Corrigidos |
| Integração custom + VA/VR/VT | ✅ `grupoBeneficio` |

---

## 4. Novos requisitos — pendências principais

### Ainda relevantes

- Tela Perfil/`modoUso` (M10)
- Cache/rate-limit compartilhado (T5) quando aplicável
- Badge "em breve" na sidebar (RNF-NOVO-B1)
- RN para Onboarding (M19)
- Integração Grupos ↔ `/expense-split`

---

## 5. Plano de ação — estado ago/2026

| Prioridade | Ação | Status |
|---|---|---|
| 🔴 | Pós-login → rota funcional | ✅ |
| 🔴 | Delete recorrente | ✅ |
| 🔴 | `modoUso` configurável | ⏸ M10 |
| 🔴 | Cookies httpOnly | ✅ |
| 🟡 | Aporte meta concluída | ✅ |
| 🟡 | grupoBeneficio VA/VR/VT | ✅ |
| 🟡 | RN-093 / RN-088 | ✅ |
| 🟡 | criarLembrete sync | ✅ |
| 🟢 | Rate limit grupos | ✅ |
| 🟢 | Unique viagem/meta/grupo | ✅ |
| 🟢 | Landing badges | ✅ |
| 🟢 | RN Onboarding (M19) | ⏸ |

---

## Perguntas em aberto

1. **`modoUso`** — quando priorizar tela de perfil/onboarding?
2. **CI com `jest --coverage`** — pipeline automatizado ou manual?

---

*Relatórios PO em `Documentacao/03-Auditorias/Product Owner/` (sem 08/09/11) · correções refletidas nos módulos 01–05, 07, 12–18.*
