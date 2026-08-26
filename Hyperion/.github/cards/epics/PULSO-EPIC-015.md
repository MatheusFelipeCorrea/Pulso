---
card_id: PULSO-EPIC-015
title: "Protótipos de interface"
status: Backlog
type: Epic
priority: High
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
categories:
  - Protótipo
  - UX / UI
  - Web
  - Mobile
---

# [EPIC] Protótipos de interface

> **Contexto:** Protótipo de alta fidelidade (Figma) das telas já especificadas nos epics de produto. Uma feature por módulo. **Não** há card de layout nem de dark mode: o chrome `MainLayout` (sidebar/header) é pressuposto; **claro e escuro** vão juntos, tela a tela, em cada feature. Sem tasks: histórias, estados e critérios ficam no próprio card.

**Produto:** `PULSO-EPIC-001`–`013` · **Apostila:** alimenta `PULSO-FEAT-082` (`docs/5`)

## 🎯 Objetivos

- Cobrir as rotas e modais listados nas seções “Telas e fluxos” dos epics de produto
- Cada tela em **desktop e mobile**, **tema claro e tema escuro**
- Estados vazios, carregando, erro e preenchido quando o fluxo existir no card de produto
- Não prototipar callback OAuth, APIs, jobs, QA nem o miolo de implementação
- Não redesenhar a sidebar em 13 arquivos: um frame compartilhado no Figma, conteúdo por feature

## 🎭 Módulos

| Feature | Telas (produto) |
|---------|-----------------|
| Auth | login, cadastro, e-mails enviados, forgot/reset (`AuthLayout`) |
| Público | `/`, `/termos`, `/privacidade` |
| Dashboard | `/dashboard` + modal importação |
| Transações | `/transactions` + modais |
| Metas | `/goals` + modais |
| Viagens | `/trips`, `/trips/:id` + modais |
| Calendário | `/calendar` + lembrete / Google |
| Grupos | `/groups`, `/groups/:id` |
| Orçamento | `/budget` |
| Compras | `/purchase-planning` |
| Divisão | `/expense-split` |
| Dívidas | `/debts` |
| Insights | `/insights` |

## 🔗 Sub-issues

- PULSO-FEAT-086
- PULSO-FEAT-087
- PULSO-FEAT-088
- PULSO-FEAT-089
- PULSO-FEAT-090
- PULSO-FEAT-091
- PULSO-FEAT-092
- PULSO-FEAT-093
- PULSO-FEAT-094
- PULSO-FEAT-095
- PULSO-FEAT-096
- PULSO-FEAT-097
- PULSO-FEAT-098

## 📋 Resumo

### ✅ Concluído
- Inventário de telas a partir dos epics 001–013
- Hierarquia Epic → Feature (sem Task; claro/escuro na mesma feature)

### ⏳ Pendente
- Prototipar módulo a módulo no Figma
- Publicar recorte em `docs/5` (`PULSO-FEAT-082`)
