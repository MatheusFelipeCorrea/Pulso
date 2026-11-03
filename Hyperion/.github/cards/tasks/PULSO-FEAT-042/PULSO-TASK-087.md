---
card_id: PULSO-TASK-087
title: "Backend — metas grupo e aportes"
status: "In Revision"
type: Task
priority: High
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-042
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — metas grupo e aportes

> **Contexto:** Até 5 metas ativas; aportes com auto-conclusão e notificação.

## 📝 Descrição

Implementar criação de metas em lote e registro de aportes por membro.

## 🛠️ Implementação

### Models (NOVO — CRIAR)

`MetaGrupo`, `AporteMetaGrupo`

### Endpoints

- POST `/grupos/:id/metas` — array de metas; transação Serializable; limite 5
- POST `/grupos/:id/metas/:metaId/aportes` — incrementa valorAtual

**RN-119:** auto-conclusão + `notificarMetaGrupoAtingida`

**RN-118:** aporte sempre com `usuarioId` do membro

## 👤 Responsável

- Alice Shikida (`aliceshikida`) — metas do grupo


## 📋 Resumo

### ✅ Concluído
- Regras metas grupo definidas

### ⏳ Pendente
- Implementar metas e aportes backend
