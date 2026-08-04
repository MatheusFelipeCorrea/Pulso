# 🛒 Módulo 18 — Planejamento de Compra — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [14-Orcamento-Mensal.md](./14-Orcamento-Mensal.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-133–138), `RegrasDeNegocio.md` (RN-087–093).
> Código auditado: `api/src/services/purchasePlanningService.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README **✅ 6/6**. **Correções aplicadas (ago/2026):** RN-093 — meta vinculada concluída ao marcar "Comprei!"; RN-088 — sobra mensal como **média de 3 meses** (receita − despesa); RNF-NOVO-P2 — `obterRendaMensalPlanejada` centralizada em `userFinanceUtils.js` (Orçamento + Planejamento alinhados).

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status |
|---|---|---|
| RF-133 | Registrar item desejado | ✅ |
| RF-134 | Tempo para comprar (sobra mensal) | ✅ Média 3 meses (RN-088) |
| RF-135 | Simular à vista vs. parcelado | ✅ |
| RF-136 | Alerta % renda comprometida | ✅ |
| RF-137 | Vincular meta | ✅ |
| RF-138 | Marcar comprado + transação + meta | ✅ RN-093 aplicada |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. ~~**"Comprei!" não fecha meta vinculada.**~~ **✅ Corrigido** — `marcarComprado` define meta como `CONCLUIDA`.
2. ~~**Sobra sensível a outlier de um mês.**~~ **✅ Corrigido** — média dos últimos 3 meses.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### ✅ Corrigido — RN-093

`marcarComprado`: se `item.metaId`, atualiza meta para `CONCLUIDA` com `concluidaEm`.

### ✅ Corrigido — RN-088

`calcularSobraMensal`: agrega receita − despesa por mês, média de **3 meses** (`MESES_MEDIA_SOBRA`).

### ✅ Corrigido — Renda mensal unificada (RNF-NOVO-P2)

`userFinanceUtils.obterRendaMensalPlanejada` — `rendaMensalPlanejada ?? valorSalario` — usada por Orçamento e Planejamento de Compra.

### Resiliência

| Cenário | Resiliente? |
|---|---|
| Editar item comprado | ✅ Bloqueado |
| Meta concluída/cancelada no vínculo | ✅ Bloqueado |
| Categoria Compras ausente | ✅ Erro claro |

---

## 4. 💡 Novos Requisitos Propostos

- ~~**RF-NOVO-P1**~~ — ✅ RN-093 implementada.
- ~~**RNF-NOVO-P1**~~ — ✅ Média 3 meses.
- ~~**RNF-NOVO-P2**~~ — ✅ `userFinanceUtils.js`.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status |
|---|---|---|
| 1 | Concluir meta ao comprar (RF-NOVO-P1) | ✅ Feito |
| 2 | Sobra média 3 meses (RNF-NOVO-P1) | ✅ Feito |
| 3 | Unificar renda mensal (RNF-NOVO-P2) | ✅ Feito |

---

*Próximo bloco: Módulos 19–25 (planejados, sem código).*
