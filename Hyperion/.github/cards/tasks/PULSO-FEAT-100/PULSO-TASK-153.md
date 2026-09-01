---
card_id: PULSO-TASK-153
title: "Backend — geminiChatbotProvider, env e rate limit"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-100
due_date: null
categories:
  - Backend
  - Integração Externa
  - Inteligência Artificial
---

# [TASK] Backend — geminiChatbotProvider, env e rate limit

> **Contexto:** Gemini Flash exclusivo do chat, cota por usuário.

## 📝 Descrição

Configurar env, provider HTTP e rate limit do chatbot.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `config/env.js` | `GEMINI_API_KEY_CHATBOT`, `GEMINI_CHATBOT_MODEL` (default Flash) |
| `.env.example` | Seção `# 🤖 GOOGLE GEMINI — chatbot` |
| `providers/geminiChatbotProvider.js` | `generateChatReply({ systemPrompt, messages, userContext })` |
| middleware/util de rate limit | Limite por `usuarioId` → `429` |

Espelhar Insights/PDF: `generateContent`, tratamento 429/404 de modelo.

**Não** usar chaves de PDF nem de Insights.

## 📋 Resumo

### ✅ Concluído
- Padrão Insights/PDF → Chatbot documentado

### ⏳ Pendente
- Implementar provider, env e rate limit
