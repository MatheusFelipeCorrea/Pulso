# 💸 Módulo 15 — Divisão de Despesas — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [07-Lembretes-e-Google-Agenda.md](./07-Lembretes-e-Google-Agenda.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-106–120), `RegrasDeNegocio.md` (RN-081–086, RNF-016).
> Código auditado: `api/src/services/expenseSplitService.js`, `api/src/utils/expenseSplitUtils.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README **✅ 6/6**. Módulo maduro — rateio em centavos (RNF-016), limpeza de lembretes órfãos ao excluir divisão, mensagens de erro orientadas. **Sem ações isoladas pendentes** — beneficia-se da correção RF-NOVO-G1 do Módulo 07 (já aplicada).

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status |
|---|---|---|
| RF-106–120 | Divisão, rateio, pagamentos, saldo, lembrete | ✅ Confirmado |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

Nenhum gap de severidade relevante. Mensagens de erro específicas e orientadas (padrão de referência para outros módulos).

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Confirmado — RNF-016 (rateio em centavos)

`splitEqual` e `validarSomaPersonalizada` operam em centavos inteiros — determinístico e correto.

### Confirmado — Limpeza de lembretes ao excluir divisão

`excluirDivisao` remove lembretes de cobrança antes de excluir a divisão — boa prática replicável.

### ✅ Herdado — RF-NOVO-G1 (Módulo 07)

`criarLembreteCobranca` usa `reminderService.criarLembrete` — falha de sync Google **preserva** o lembrete com `sincronizado: false` (corrigido no M07).

### Resiliência

| Cenário | Resiliente? |
|---|---|
| Todos pagos → QUITADA | ✅ |
| Desmarcar pagamento reabre divisão | ✅ |
| Editar com pagamentos registrados | ✅ Bloqueado |
| Excluir divisão quitada | ✅ Bloqueado (180 dias) |
| Lembrete para quem já pagou | ✅ Bloqueado |

---

## 4. 💡 Novos Requisitos Propostos

Nenhum RF/RNF novo — itens cobertos por M07 (RF-NOVO-G1) e nota transversal T7 (concorrência lembrete, risco baixo).

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status |
|---|---|---|
| 1 | Beneficiar-se de RF-NOVO-G1 (M07) | ✅ Feito |

---

*Próximo módulo sugerido: 16 — Calendário Financeiro.*
