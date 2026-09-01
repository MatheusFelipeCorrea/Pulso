---
card_id: PULSO-FEAT-100
title: "Provider Gemini Flash e rate limit do chatbot"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-016
due_date: null
categories:
  - Backend
  - Integração Externa
  - Inteligência Artificial
---

# [FEATURE] Provider Gemini Flash e rate limit do chatbot

> **Contexto:** IA do chat via Gemini Flash (free tier), chave e cota separadas de PDF e de Insights. Rate limit por usuário.

## 📝 Descrição

Isolar o provider HTTP do chatbot e aplicar limite de requisições por usuário autenticado.

## ✅ Critérios de Aceite

| Variável | Papel |
|----------|-------|
| `GEMINI_API_KEY_CHATBOT` | API key exclusiva do chat |
| `GEMINI_CHATBOT_MODEL` | Default Flash (free tier) |

- Sem chave → `503` com mensagem clara (mesmo padrão Insights/PDF)
- **Não** reutilizar `GEMINI_API_KEY_PDF` nem `GEMINI_API_KEY_INSIGHTS`
- Rate limit por usuário; excesso → `429`
- Resumos mensais cacheados **não** são responsabilidade deste provider (epic Insights)

## 🔗 Sub-issues

- PULSO-TASK-153

## 📋 Resumo

### ✅ Concluído
- Contrato de env, modelo Flash e cota por usuário definido

### ⏳ Pendente
- PULSO-TASK-153 — provider + rate limit
