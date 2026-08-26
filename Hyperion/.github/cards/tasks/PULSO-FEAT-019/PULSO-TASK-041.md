---
card_id: PULSO-TASK-041
title: "Backend — sugestão reserva de emergência (RF-142)"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-019
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — sugestão reserva de emergência (RF-142)

> **Contexto:** Endpoint que calcula valor-alvo sugerido com base no gasto médio mensal.

## 📝 Descrição

Implementar `sugerirReservaEmergencia` agregando despesas dos últimos 3 meses via `transactionRepository`.

## 🛠️ Implementação

### `metaService.sugerirReservaEmergencia` (NOVO — CRIAR)

**Entrada:** `meses` (query, default 6, max 60)

**Saída:**
```json
{
  "mediaGastoMensal": "1234.56",
  "meses": 6,
  "valorSugerido": "7407.36",
  "mesesHistoricoAnalisado": 3
}
```

**Rota:** `GET /metas/sugestao-reserva-emergencia`

## 📋 Resumo

### ✅ Concluído
- Contrato RF-142 e dependência em transações definidos

### ⏳ Pendente
- Implementar agregação e endpoint
