---
card_id: "PULSO-TASK-088"
title: "Backend — chat e grupoNotificationService"
status: "Backlog"
type: "Task"
priority: "Medium"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-043"
due_date: null
board_sync_at: "2026-08-26T15:32:16.000Z"
categories:
  - "Backend"
  - "Notificações"
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

## 📋 Resumo

### ✅ Concluído
- Eventos RF-102 e RN-120 mapeados

### ⏳ Pendente
- Implementar chat e notification service
