---
card_id: PULSO-TASK-089
title: "Frontend — GroupsPage e modais lista"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-044
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — GroupsPage e modais lista

> **Contexto:** Lista de grupos com criar, entrar e convidar.

## 📝 Descrição

Implementar página `/groups` e modais de lista.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/GroupsPage.jsx` | Fetch lista; modais |
| `GroupList.jsx` / `GroupCard.jsx` | Cards com imagemExibicao |
| `CreateGroupModal.jsx` + `GroupImagePicker` | Criar com foto opcional |
| `JoinGroupModal.jsx` | Entrar por código |
| `InviteGroupModal.jsx` | Link, WhatsApp, QR code |
| `DeleteGroupModal.jsx` / `LeaveGroupModal.jsx` | Confirmar ações |
| `GroupsJoinBanner.jsx` | CTA entrar |
| `pages/GroupJoinRedirect.jsx` | `/groups/join/:codigo` |
| `services/grupoService.js` | Client HTTP |

**Rota:** `App.jsx` → `/groups`, `/groups/join/:codigo`

## 📋 Resumo

### ✅ Concluído
- Fluxos lista especificados

### ⏳ Pendente
- Implementar GroupsPage e modais
