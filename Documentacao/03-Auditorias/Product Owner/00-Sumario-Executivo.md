# 📋 Pulso — Auditoria Completa de Requisitos e Arquitetura (PO + Engenharia)

> **Leia este documento primeiro.** Sintetiza a auditoria dos 25 módulos (18 com código, 7 planejados) e dos RNFs. Detalhe por módulo: [00-Achados-Transversais.md](./00-Achados-Transversais.md).
> Metodologia: leitura do código (`Codigo/Pulso/api` + `web`) vs. `Requisitos/Readme.md` e `RegrasDeNegocio.md`.

---

## ✅ Correções pós-auditoria (ago/2026)

A auditoria original registrou achados em **10 dos 18 módulos**. A maior parte dos itens 🔴/🟡 abaixo **já foi endereçada no código ou na documentação**:

| Área | O que mudou |
|---|---|
| **Auth (01)** | Cookies `httpOnly`, mutex refresh, cadastro resiliente SMTP, P2002→409, rate-limit por rota, fix loop F5 em `/auth/me` |
| **Dashboard / UX entrada (02, 12)** | Pós-login → `/transactions` (`DEFAULT_AUTHENTICATED_ROUTE`); landing com badges Em breve/Beta |
| **Transações (03)** | Delete recorrente preserva histórico; `grupoBeneficio` + presets VA/VR/VT |
| **Metas (04)** | `excluirAporte` em meta concluída + UI de aportes |
| **Viagens (05)** | `@unique` em `Viagem.metaId`; RN-074 (10 cat.); doc cache RF-033 |
| **Lembretes (07)** | `criarLembrete` preserva registro se sync falhar; RF-058b |
| **VT (08)** | Decisão B — CLT vende com aviso; RNs reescritas; saldo Serializable |
| **Grupos (13)** | Rate limit preview/entrar; `@unique` viagem/grupo; metas atômicas |
| **Orçamento (14)** | Flag `orcamentoExcedeRenda` no backend |
| **Dívidas (17)** | Reabertura auto ao excluir último pagamento |
| **Planejamento compra (18)** | RN-093 meta concluída; RN-088 média 3 meses; renda unificada |

**Ainda pendente (prioridade product/infra):** Dashboard MVP (RF-007+), `modoUso` configurável (M10), Chatbot/Insights (M06), Redis/cache compartilhado (T5), badges sidebar incompletos (RNF-NOVO-B1), RN módulos 19–25.

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
| 02 | Dashboard | ❌ 0/9 | ✅ Confirmado ausente; **redirect pós-login corrigido** → `/transactions` |
| 03 | Transações | ✅ 13/13 | ✅ Confirmado; bugs recorrente + VA/VR/VT corrigidos |
| 04 | Metas | ✅ 8/8 | ✅ Confirmado; excluir aporte corrigido |
| 05 | Viagens | ✅ 11/11 | ✅ Confirmado; doc + unique metaId |
| 06 | Insights/Chatbot | ❌ 0% | ✅ Confirmado — chatbot inexistente |
| 07 | Lembretes | ✅ 5/5 | ✅ Confirmado; sync na criação corrigido |
| 08 | VT | ✅ 6/6 | ✅ **Decisão B** — permitir venda CLT com aviso |
| 09 | Relatórios | ❌ 0/6 | ✅ Scaffold morto |
| 10 | Perfil | 🟡 Parcial | ⚠️ `modoUso` ainda não setável na UI |
| 11 | Gamificação | ❌ 0/7 | 🟡 Streak OK; resto parcial |
| 12 | Homepage | ✅ 4/4 | ✅ Badges alinhados à realidade |
| 13 | Grupos | ✅ 15/15 | ✅ Maduro; enumeração mitigada |
| 14 | Orçamento | ✅ 7/7 | ✅ Sólido; RN-059 no backend |
| 15 | Divisão | ✅ 6/6 | ✅ Referência de engenharia |
| 16 | Calendário | ✅ 5/5 | ✅ Sem achados críticos |
| 17 | Dívidas | ✅ 7/7 | ✅ Reabertura auto corrigida |
| 18 | Planej. compra | ✅ 6/6 | ✅ RN-088/093 corrigidos |
| 19–25 | Planejados | ⏳ | Zero RN documentada |

---

## 2. Gaps de Usabilidade (estado atual)

### ~~Porta de entrada quebrada~~ ✅ Corrigido

Login/OAuth/GuestRoute/Landing redirecionam para **`/transactions`**, não mais para `InDevelopmentPage` do Dashboard.

### Landing vs realidade ✅ Mitigado

Badges **Em breve** (Dashboard, Chatbot) e **Beta** (IA Insights); textos ajustados.

### Gaps ainda abertos

- **Dashboard e sidebar:** `/dashboard`, `/reports`, `/insights`, etc. ainda são placeholders se o usuário clicar no menu.
- **`modoUso` (M10):** segmentação Estagiário/PJ/PF inacessível na UI.
- **Chatbot / Insights com Gemini:** prometidos na visão de produto, 0% de código.

---

## 3. Diagnóstico — achados históricos vs. hoje

| Achado original | Status ago/2026 |
|---|---|
| VT CLT — bloquear vs aviso | ✅ Decisão **B** — RNs reescritas, aviso no front |
| Delete recorrente apaga passado | ✅ Corrigido (UNTIL + dataCorte) |
| `modoUso` nunca setável | ⏸ Pendente (M10) |
| Padrão T6 (efeito colateral apaga recurso) | ✅ Auth + Lembretes corrigidos |
| Padrão T7 (check-then-act) | ✅ VT, Viagem↔Meta, Grupos viagem/metas |
| RN-088 / RN-093 (Planejamento) | ✅ Corrigidos |
| Integração custom + VA/VR/VT | ✅ `grupoBeneficio` |

---

## 4. Novos requisitos — pendências principais

### Ainda relevantes

- Dashboard MVP (RF-NOVO-B2) reaproveitando endpoints existentes
- Tela Perfil/`modoUso` (M10)
- Cache/rate-limit compartilhado serverless (T5)
- Badge "em breve" na sidebar (RNF-NOVO-B1)
- RN para módulos 19–25
- Integração Grupos ↔ `/expense-split`

### Já endereçados (ver tabela no topo)

Itens RF-NOVO-B1, C1–C3, G1, H1, M1–M3, N1, O1, P1, etc.

---

## 5. Plano de ação — estado ago/2026

| Prioridade | Ação | Status |
|---|---|---|
| 🔴 | Pós-login → rota funcional | ✅ |
| 🔴 | VT CLT (decisão B) | ✅ |
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
| 🟢 | RN módulos 19–25 | ⏸ |

---

## Perguntas em aberto

1. ~~VT CLT bloquear ou aviso?~~ → **Decisão B (aviso)**.
2. **`modoUso`** — quando priorizar tela de perfil/onboarding?
3. **CI com `jest --coverage`** — pipeline automatizado ou manual?
4. **Módulo 23 (Casal)** — rateio vs privacidade (RN-116)?

---

*20 relatórios em `Documentacao/03-Auditorias/Product Owner/` · correções de código refletidas nos módulos 01–05, 07–08, 12–18.*
