---
card_id: PULSO-EPIC-012
title: "Dívidas Pessoais"
status: Backlog
type: Epic
priority: Highest
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Banco de Dados
  - Regra de Negócio
  - Notificações
---

# [EPIC] Dívidas Pessoais

> **Contexto:** Controle de empréstimos pessoais (me devem / eu devo) com pagamentos parciais, prazo, saldo consolidado, alertas de vencimento e histórico de quitadas — sem gerar transação automática.

**Refs:** RF-117–123 · RN-075–080

## 🎯 Objetivos

- Registrar empréstimo feito (ME_DEVEM) ou recebido (EU_DEVO) com valor, pessoa e data (RF-117–118, RN-075)
- Definir prazo de devolução opcional (RF-119)
- Marcar como paga / quitar saldo restante; registrar data de quitação (RF-120, RN-076)
- Pagamentos parciais; excluir pagamento reabre se necessário (RF-NOVO-O1)
- Saldo consolidado: total me devem vs eu devo (RF-121, RN-080)
- Histórico de ativas e quitadas com tabs/filtros (RF-122)
- Alertar próximo do vencimento (7, 2 e 0 dias) — `DIVIDA_COBRANCA` (RF-123, RN-077)
- Badge “Vencida” quando prazo passou sem quitar (RN-078)
- Dívida NÃO gera transação automaticamente (RN-079)
- Limpeza automática de quitadas após 180 dias

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/debts` | Dívidas | Tabs Me devem / Eu devo / Quitadas; CRUD; pagar; quitar; reabrir |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Notificações | Tipo `DIVIDA_COBRANCA`; link `/debts` |
| Cron | `debtAlertJob` + `debtCleanupJob` |
| Transações | Sem vínculo automático (RN-079) |

## 🔗 Sub-issues

- PULSO-FEAT-064
- PULSO-FEAT-065
- PULSO-FEAT-066
- PULSO-FEAT-067
- PULSO-FEAT-068
- PULSO-FEAT-069

## 📋 Resumo

### ✅ Concluído
- Escopo RF-117–123 e RN-075–080 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend
