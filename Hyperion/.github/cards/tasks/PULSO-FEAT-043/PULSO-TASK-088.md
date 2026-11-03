---
card_id: PULSO-TASK-088
title: "Backend — chat e grupoNotificationService"
status: "In Revision"
type: Task
priority: Medium
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-043
due_date: null
categories:
  - Backend
  - Notificações
---

# [TASK] Backend — chat e grupoNotificationService

> **Contexto:** Mensagens paginadas e notificações de atividade do grupo.

## 📝 Descrição

Implementar chat do grupo e serviço centralizado de notificações.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `MensagemChatGrupo` model | grupoId, usuarioId, conteudo |
| `grupoService.listarMensagens` | Paginação 20, order desc |
| `grupoService.enviarMensagem` | Validar membro |
| `services/grupoNotificationService.js` | GRUPO_ATIVIDADE, META_ATINGIDA, exclusão |

Eventos notificados: entrar, sair, removido, pretensão, meta criada, meta atingida, excluir grupo (RN-120)

## 👤 Responsáveis

- Alice Shikida (`aliceshikida`) — API chat
- Matheus Felipe Correa (`MatheusFelipeCorrea`) — Socket.IO no Flutter


## 📋 Resumo

### ✅ Concluído
- Eventos RF-098 e RN-120 mapeados

### ⏳ Pendente
- Implementar chat e notification service
