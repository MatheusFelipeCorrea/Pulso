---
card_id: PULSO-FEAT-093
title: "Protótipo — grupos"
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

# [FEATURE] Protótipo — grupos

> **Contexto:** `/groups` e `/groups/:id` (viagem compartilhada, metas, membros, chat, modo de divisão). Claro e escuro na mesma feature. Gate Premium pode aparecer como badge/estado.

**Produto:** `PULSO-EPIC-008` · **Refs:** RF-084–098

## 📖 Histórias

- Como **usuário**, quero listar grupos, criar e entrar com código, para o convite `PULSO-XXXX` existir no Figma.
- Como **membro**, quero o detalhe com os quatro blocos (viagem, metas, membros, chat), para o RF-097 aparecer numa tela.
- Como **usuário**, quero lista e detalhe em claro e escuro, para chat e cards continuarem usáveis.

## 🎭 Telas

| Rota / UI | Tela |
|-----------|------|
| `/groups` | Lista + criar / entrar / convite |
| `/groups/:id` | Detalhe (4 blocos + toggle RF-091) |
| Empty | Sem grupos |
| Estado | Gate Premium / não membro |

## ✅ Critérios de Aceite

### Cenário 1 — Lista
**Então** cards de grupo, CTA criar, entrar por código, sair/excluir (admin).

### Cenário 2 — Detalhe
**Então** viagem compartilhada, metas de grupo, membros/papéis, chat; toggle *por pretensão* / *divisão igual*.

### Cenário 3 — Temas e viewport
**Então** ambas as rotas em claro **e** escuro, desktop **e** mobile.

### Cenário 4 — Fora de escopo
**Então** `/groups/join/:codigo` pode ser um estado de “entrando…”; Socket.IO não precisa de frame técnico.

## 📋 Resumo

### ✅ Concluído
- Lista e detalhe do epic 008 mapeados

### ⏳ Pendente
- Frames Figma claro/escuro
