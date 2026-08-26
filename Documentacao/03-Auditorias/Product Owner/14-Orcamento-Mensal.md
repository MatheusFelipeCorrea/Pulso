# 📊 Módulo 14 — Orçamento Mensal — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-099–114, RF-105), `RegrasDeNegocio.md` (RN-055–060, RN-170).
> Código auditado: `api/src/services/budgetService.js`, `api/src/utils/budgetRolloverUtils.js`, `api/src/repositories/budgetRepository.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README **✅ 7/7** — um dos módulos mais sólidos. Rollover (RN-170) e dedup de alertas corretos. **Correção aplicada (ago/2026):** flag `orcamentoExcedeRenda` no backend (RN-059 / RNF-NOVO-N1) + aviso na tela de orçamento. Dependência do Módulo 10 (configurar renda) permanece para o aviso ser útil na prática.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Status | Notas |
|---|---|---|
| RF-099–114, RF-105 | ✅ | Confirmado — rollover, alertas 80%/100%, upsert |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. ~~**RN-059 só no frontend.**~~ **✅ Corrigido** — `obterStatusOrcamento` retorna `resumo.orcamentoExcedeRenda`; `BudgetSummaryCards` exibe aviso permanente quando true.
2. **`rendaMensalPlanejada` depende do Módulo 10** — pendente; com renda = 0 o aviso não dispara (comportamento intencional).

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Rollover (RN-170) — ✅ Confirmado

`calcularValorRollover` correto nos dois pontos de entrada (`salvarOrcamentos`, `copiarParaMes`).

### ✅ Corrigido — RN-059 no backend (RNF-NOVO-N1)

```js
orcamentoExcedeRenda = rendaMensalPlanejada > 0 && orcamentoTotal > rendaMensalPlanejada
```

Retornado em `resumo` de `GET /orcamentos/status`.

### Resiliência

| Cenário | Resiliente? |
|---|---|
| Copiar para mês com orçamentos | ✅ 409 |
| Categoria inválida | ✅ 403 |
| Transação não bloqueia orçamento (RN-058) | ✅ |
| Dedup alertas 80%/100% | ✅ |
| Lista vazia remove orçamentos do mês | ✅ (comportamento documentado) |

---

## 4. 💡 Novos Requisitos Propostos

- ~~**RNF-NOVO-N1**~~ — ✅ Flag `orcamentoExcedeRenda` no backend + UI.
- **RNF-NOVO-N2** — Módulo 10: expor configuração de `rendaMensalPlanejada` (pendente).

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status |
|---|---|---|
| 1 | RN-059 no backend + aviso na UI (RNF-NOVO-N1) | ✅ Feito |
| 2 | Configuração de renda (Módulo 10 / RNF-NOVO-N2) | 🟢 Pendente |

---

*Próximo módulo sugerido: 15 — Divisão de Despesas.*
