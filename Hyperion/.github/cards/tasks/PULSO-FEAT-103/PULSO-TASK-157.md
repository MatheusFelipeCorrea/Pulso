---
card_id: PULSO-TASK-157
title: "Backend — agregar contexto financeiro do usuário"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-103
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — agregar contexto financeiro do usuário

> **Contexto:** RF-059 — só dados da conta autenticada.

## 📝 Descrição

Montar um payload resumido (saldos, transações recentes, metas, categorias) filtrado por `usuarioId`.

## 🛠️ Implementação

Reutilizar services/repositórios existentes de transação, meta e saldo. **Nunca** query sem filtro de usuário. Recorte pequeno o bastante para caber no prompt (não despejar o banco inteiro).

## 📋 Resumo

### ✅ Concluído
- Isolamento e recorte de contexto definidos

### ⏳ Pendente
- Implementar agregador
