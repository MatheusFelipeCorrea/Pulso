---
card_id: PULSO-FEAT-058
title: "Backend — API core de divisões"
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
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API core de divisões

> **Contexto:** CRUD e listagens autenticadas em `/api/divisoes`.

**Refs:** RF-115 · RN-081 · RN-084

## 📝 Descrição

Expor endpoints para criar, editar, listar ativas/histórico e excluir divisões.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/divisoes/ativas` | Lista ATIVAS do usuário |
| GET | `/divisoes/historico` | Quitadas paginadas |
| POST | `/divisoes` | Criar com participantes + `pagoPor` |
| PATCH | `/divisoes/:id` | Editar; bloqueia se QUITADA ou pagamento manual ao trocar participantes |
| DELETE | `/divisoes/:id` | Só ATIVA; remove lembretes vinculados |

Participantes por nome livre; organizador “Você” sempre incluso (RN-084)

## 🔗 Sub-issues

- PULSO-TASK-117
- PULSO-TASK-118
- PULSO-TASK-120

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- PULSO-TASK-117–120 — DB, repository e CRUD
