# 🤝 Módulo 17 — Dívidas Pessoais — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [04-Metas-Financeiras.md](./04-Metas-Financeiras.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-126–132), `RegrasDeNegocio.md` (RN-075–080).
> Código auditado: `api/src/services/debtService.js`, `api/src/utils/debtBalanceUtils.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README **✅ 7/7**. **Correção aplicada (ago/2026):** ao excluir o último pagamento de dívida quitada, `sincronizarQuitacao` **reabre automaticamente** a dívida (RF-NOVO-O1) — elimina exibição fabricada de 100% pago sem pagamentos reais.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status |
|---|---|---|
| RF-126–132 | CRUD, pagamentos, saldo, histórico, alertas | ✅ |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. ~~**Remover único pagamento de dívida quitada deixa tela enganosa.**~~ **✅ Corrigido** — reabertura automática; saldo volta a refletir valor total em aberto.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### ✅ Corrigido — Reabertura ao excluir último pagamento (RF-NOVO-O1)

`sincronizarQuitacao`: se `quitada && pagamentos.length === 0 && valorRestante > 0` → `debtRepository.reabrir`.

Fluxo `quitarDivida` sempre registra pagamento quando há saldo — cenário de perdão sem pagamento não passa pela API normal.

### Resiliência

| Cenário | Resiliente? |
|---|---|
| Pagamento > saldo | ✅ Bloqueado |
| Editar valor abaixo do pago | ✅ Bloqueado |
| Quitar com saldo restante | ✅ Via `registrarPagamento` |
| Excluir dívida quitada | ✅ Bloqueado (180 dias) |
| Excluir último pagamento de quitada | ✅ Reabre automaticamente |

---

## 4. 💡 Novos Requisitos Propostos

- ~~**RF-NOVO-O1**~~ — ✅ Reabertura automática implementada.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status |
|---|---|---|
| 1 | Reabrir ao excluir último pagamento (RF-NOVO-O1) | ✅ Feito |

---

*Próximo módulo sugerido: 18 — Planejamento de Compra.*
