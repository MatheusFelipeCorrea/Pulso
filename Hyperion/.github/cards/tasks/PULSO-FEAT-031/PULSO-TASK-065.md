---
card_id: PULSO-TASK-065
title: "Backend — googleCalendarService OAuth"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-031
due_date: null
categories:
  - Backend
  - Integração Externa
  - Segurança
---

# [TASK] Backend — googleCalendarService OAuth

> **Contexto:** Fluxo OAuth Calendar distinto do login; tokens criptografados.

## 📝 Descrição

Implementar conexão, callback, status e desconexão do Google Agenda.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/googleCalendarService.js` | obterStatus, obterUrlConexao, callback, desconectar |
| `utils/googleOAuth.js` | `createOAuthClient` |
| `utils/googleTokenCrypto.js` | `encryptTokens` / `decryptTokens` AES-256-GCM |

**Scopes:** `calendar`, `userinfo.email`

**Env:** `GOOGLE_CALENDAR_CALLBACK_URL`, credenciais Google OAuth

**Desconectar:** limpa tokens; opcionalmente remove calendário Pulso

## 📋 Resumo

### ✅ Concluído
- Fluxo RF-054/RF-057 especificado

### ⏳ Pendente
- Implementar OAuth service e crypto
