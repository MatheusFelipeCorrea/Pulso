---
card_id: "PULSO-TASK-147"
title: "Backend — sugestões e conteúdo educativo no prompt"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-073"
due_date: null
board_sync_at: "2026-08-26T15:29:11.000Z"
categories:
  - "Backend"
  - "Inteligência Artificial"
  - "Regra de Negócio"
---


# [TASK] Backend — sugestões e conteúdo educativo no prompt

> **Contexto:** RF-046 + RF-NOVO-I1 — economia acionável e estudo financeiro.

## 📝 Descrição

Especificar no prompt exemplos e regras para sugestões e bloco `educacao[]`.

## 🛠️ Implementação

### Instruções ao modelo (NOVO — CRIAR no prompt)

**Sugestões (exemplos de estilo)**
- “Você almoçou em X com média R$ A; em Y a média foi R$ B (−Z%). Considere ir mais a Y.”
- “Delivery representa P% das despesas de Alimentação — reduzir Q% economizaria ~R$ R/mês.”
- Só citar estabelecimentos presentes no contexto.

**Educação `educacao[]`**
- Tipos: `instagram` | `youtube` | `artigo` | `perfil`
- Campos: `titulo`, `url`, `motivo` (por que serve a *este* usuário)
- Personalizar: alto endividamento → conteúdo de dívidas; metas fracas → planejamento; freelancer → reserva/imposto
- Preferir fontes reconhecíveis; evitar inventar handles — se incerto, omitir ou flag `verificarUrl`

Incluir exemplos few-shot no system prompt + schema Zod dos arrays.

## 📋 Resumo

### ✅ Concluído
- Estilo de sugestão/educação definido

### ⏳ Pendente
- Embutir no prompt e validar schema
