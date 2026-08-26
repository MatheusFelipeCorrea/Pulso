---
card_id: PULSO-FEAT-031
title: "Google Calendar — OAuth e sincronização"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-006
due_date: null
categories:
  - Backend
  - Integração Externa
  - Segurança
---

# [FEATURE] Google Calendar — OAuth e sincronização

> **Contexto:** Conexão OAuth, calendário dedicado "Pulso", sync bidirecional e resync em lote.

**Refs:** RF-054 · RF-056 · RF-057 · RF-058b · RN-096 · RN-097

## 📝 Descrição

Implementar fluxo OAuth Calendar, persistência de tokens criptografados, sync de eventos e importação Google → Pulso.

## ✅ Critérios de Aceite

| Rota | Comportamento |
|------|---------------|
| `GET /calendario/google/status` | `{ conectado, email }` |
| `GET /calendario/google/url` | URL OAuth com state |
| `GET /calendario/google/callback` | Troca code; ativa integração |
| `POST /calendario/google/desconectar` | Revoga; limpa tokens |
| `GET /calendario/google/sync/pendentes` | Contadores futuros/todos |
| `POST /calendario/google/sync` | Resync em lote por escopo |

**Sync:** `garantirCalendarioPulso`, `buildEventBody` com antecedência em minutos, recreate em 404

**Import:** `importarAlteracoesDoGoogle` — título e data (RF-058b)

## 🔗 Sub-issues

- PULSO-TASK-065
- PULSO-TASK-066

## 📋 Resumo

### ✅ Concluído
- Fluxos OAuth e sync documentados

### ⏳ Pendente
- PULSO-TASK-065–066 — OAuth service e sync service
