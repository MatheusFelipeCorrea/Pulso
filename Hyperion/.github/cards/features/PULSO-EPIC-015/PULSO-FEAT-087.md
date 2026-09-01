---
card_id: PULSO-FEAT-087
title: "Protótipo — homepage pública e páginas legais"
status: "In Progress"
type: Feature
priority: High
sprint: "Sprint 1"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-015
due_date: null
categories:
  - Protótipo
  - UX / UI
  - Web
  - Mobile
---

# [FEATURE] Protótipo — homepage pública e páginas legais

> **Contexto:** Marketing e documentos estáticos, sem `MainLayout`. Header/footer públicos e paleta Vital Purple. Claro e escuro na mesma feature.

**Produto:** `PULSO-EPIC-007` · **Refs:** RF-080–083

## 📖 Histórias

- Como **visitante**, quero uma landing que explique o Pulso e me leve a cadastrar ou entrar, para o primeiro contato não ser um formulário seco.
- Como **visitante**, quero termos e privacidade no mesmo visual, para o rodapé não apontar para páginas vazias.
- Como **designer**, quero a landing em claro e escuro, para o toggle de tema do header público aparecer de verdade.

## 🎭 Telas

| Rota | Tela |
|------|------|
| `/` | Landing (hero, módulos, público, CTA, preview) |
| `/termos` | Termos de uso |
| `/privacidade` | Política de privacidade |

## ✅ Critérios de Aceite

### Cenário 1 — Landing
**Então** seções alinhadas ao epic (funcionalidades, para quem, benefícios, depoimentos se houver, CTA cadastro/login); preview ilustrativo pode ser mock, sem dados reais.

### Cenário 2 — Legais
**Então** `/termos` e `/privacidade` usam layout de documento (não a sidebar logada).

### Cenário 3 — Temas e viewport
**Então** as três rotas em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** não se prototipa o download real de APK/IPA; um bloco “em breve” basta.

## 📋 Resumo

### ✅ Concluído
- Rotas públicas mapeadas

### ⏳ Pendente
- Frames Figma claro/escuro
