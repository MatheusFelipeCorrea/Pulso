---
card_id: PULSO-TASK-074
title: "Frontend — landingData.js"
status: "In Revision"
type: Task
priority: High
sprint: "Sprint 5"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-037
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — landingData.js

> **Contexto:** Fonte única de conteúdo marketing — módulos, badges e links.

## 📝 Descrição

Centralizar dados estáticos da landing para fácil manutenção de copy e badges RF-082.

## 🛠️ Implementação

### `landingData.js` (NOVO — CRIAR)

| Export | Conteúdo |
|--------|----------|
| `NAV_LINKS` | Âncoras header (funcionalidades, para-quem, diferenciais, preços, roadmap) |
| `HIGHLIGHTS` | 4 cards destaque |
| `FEATURES` | 8 módulos com `tone`, `badge` opcional ("Em breve", "Beta") |
| `AUDIENCE` | 4 personas |
| `BENEFITS` | Lista diferenciais |
| `TESTIMONIALS` | 3 depoimentos |
| `FOOTER_LINKS` | navegacao, recursos, comunidade |
| `APP_DOWNLOADS` | APK/IPA paths em `public/downloads/` |

**Badges:** Dashboard e Chatbot "Em breve"; IA Insights "Beta"

## 👤 Responsável

- Matheus Felipe Correa (`MatheusFelipeCorrea`)


## 📋 Resumo

### ✅ Concluído
- Estrutura de dados RF-082 definida

### ⏳ Pendente
- Implementar landingData.js
