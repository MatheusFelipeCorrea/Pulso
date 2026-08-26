---
card_id: PULSO-TASK-145
title: "Backend — projeções e alertas determinísticos"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-072
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — projeções e alertas determinísticos

> **Contexto:** RF-107–108 / RF-047 / RN-128 — números antes da narrativa da IA.

## 📝 Descrição

Calcular cenários e alertas estruturados a partir do contexto.

## 🛠️ Implementação

### `utils/insightProjectionUtils.js` + `insightAlertUtils.js` (NOVO — CRIAR)

**Projeções**
- Base = média 3 meses (receita/despesa)
- Otimista: −gasto / +receita (fatores documentados, ex. −10% / +5%)
- Atual: ritmo médio
- Pessimista: +gasto / −receita
- Horizontes: 3, 6, 12 meses (saldo projetado)
- `diasAteNegativo` no cenário atual

**Alertas**
- Orçamento/categoria perto do limite
- Meta com ritmo insuficiente para o prazo
- Recurso (VA/VR/VT) com esgotamento previsto

Saída tipada para o prompt e para a UI (mesmo sem Gemini).

## 📋 Resumo

### ✅ Concluído
- Fórmulas documentadas

### ⏳ Pendente
- Implementar utils de projeção/alerta
