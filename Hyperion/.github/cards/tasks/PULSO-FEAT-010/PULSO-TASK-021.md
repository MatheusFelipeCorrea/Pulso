---
card_id: "PULSO-TASK-021"
title: "Frontend — modal ImportStatementModal"
status: "Backlog"
type: "Task"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-010"
due_date: null
board_sync_at: "2026-08-26T15:31:11.000Z"
categories:
  - "web"
  - "Frontend"
  - "Integração Externa"
  - "UX / UI"
---


# [TASK] Frontend — modal ImportStatementModal

> **Contexto:** UI multi-step acionada pelo botão "Importar extrato" no dashboard.

## 📝 Descrição

Implementar wizard modal: escolher tipo → upload → (mapping CSV) → preview editável → confirmar.

## ✅ Critérios de Aceite

### Cenário 1 — Steps
**Então** fluxo `pick` → `mapping?` → `preview` → `balance?` → confirmar.

### Cenário 2 — Tipos suportados
**Então** CONTA (OFX/CSV/XLSX/PDF), VA/VR/VT conforme `importStatementTypes.js`.

### Cenário 3 — Preview
**Então** editar categoria por linha, marcar ignorar duplicata, ver totais.

### Cenário 4 — Sucesso
**Então** `onImported()` recarrega dashboard; toast de confirmação.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `ImportStatementModal.jsx` | Orquestrador steps + upload |
| `ImportColumnMappingStep.jsx` | Mapeamento colunas CSV |
| `ImportPreviewStep.jsx` | Tabela editável + dedupe |
| `ImportManualBalanceStep.jsx` | Ajuste saldo manual quando necessário |

### Serviços (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/importService.js` | `analisarExtrato`, `confirmarImportacao` |
| `utils/importStatementTypes.js` | Tipos, validação extensão, labels |

**Hook:** `useTransactionFilterOptions` para lista de categorias no preview

## 📋 Resumo

### ✅ Concluído
- Spec de steps e integração com dashboard definida

### ⏳ Pendente
- Implementar modal e sub-componentes
- Wire botão no header do DashboardPage
