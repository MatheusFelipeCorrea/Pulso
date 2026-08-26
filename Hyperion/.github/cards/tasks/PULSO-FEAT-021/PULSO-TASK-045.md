---
card_id: PULSO-TASK-045
title: "Frontend — GoalFormModal e reserva de emergência"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-021
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Regra de Negócio
---

# [TASK] Frontend — GoalFormModal e reserva de emergência

> **Contexto:** Formulário criar/editar meta com atalho RF-142 e inferência de tipo.

## 📝 Descrição

Modal completo com validação client, sugestão mensal inline e botão "Usar sugestão de reserva de emergência".

## 🛠️ Implementação

### `GoalFormModal.jsx` (NOVO — CRIAR)

Campos:
- Nome, valor-alvo (`InputMoney`), prazo (`DatePicker`), descrição
- Tipo curto/longo (inferido via `inferirTipoMeta` / `calcMesesAtePrazo`)
- Preview sugestão mensal (`calcValorMensalSugerido`)
- Botão reserva: chama `sugerirReservaEmergencia()` e preenche nome/valor

**Utils espelhados:** `web/src/utils/goalBalanceUtils.js`

**Modos:** create | edit — pausar/retomar via actions no footer

## 📋 Resumo

### ✅ Concluído
- Spec de campos e fluxo RF-142 definida

### ⏳ Pendente
- Implementar GoalFormModal
