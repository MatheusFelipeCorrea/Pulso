---
card_id: PULSO-FEAT-060
title: "Pagamentos, quitação e saldo"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-011
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Pagamentos, quitação e saldo

> **Contexto:** Marcar partes pagas, auto-quitar e consolidar quanto me devem / eu devo.

**Refs:** RF-118 · RF-119 · RN-085

## 📝 Descrição

Implementar toggle de pagamento por participante e endpoint de resumo.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| PATCH | `/:id/participantes/:pid/pagar` | Marca PAGO; sincroniza status |
| PATCH | `/:id/participantes/:pid/despagar` | Volta PENDENTE; reabre se QUITADA |
| GET | `/divisoes/resumo` | `meDevem`, `euDevo`, `saldo`, `possuiDivisoes` |

**RN-085:** todos PAGO → QUITADA; desmarcar → ATIVA

Bloqueios: não despagar quem `pagouAConta`; não pagar duas vezes

**Resumo:** se organizador pagou a conta → soma pendentes dos outros = meDevem; se organizador pendente → euDevo

## 🔗 Sub-issues

- PULSO-TASK-121
- PULSO-TASK-122

## 📋 Resumo

### ✅ Concluído
- Fluxos RF-118/119 definidos

### ⏳ Pendente
- PULSO-TASK-121–122 — pagamentos e resumo
