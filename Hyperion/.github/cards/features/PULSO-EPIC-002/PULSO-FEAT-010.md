---
card_id: "PULSO-FEAT-010"
title: "Importação de extratos via dashboard"
status: "Backlog"
type: "Feature"
priority: "High"
sprint: null
story_points: null
reporter: null
parent: "PULSO-EPIC-002"
due_date: null
board_sync_at: "2026-08-26T15:29:43.000Z"
categories:
  - "web"
  - "Backend"
  - "Frontend"
  - "Integração Externa"
  - "Inteligência Artificial"
  - "Regra de Negócio"
---


# [FEATURE] Importação de extratos via dashboard

> **Contexto:** Fluxo upload → preview editável → confirmar, acionado pelo botão "Importar extrato" no dashboard (RF-155–158, RF-160).

**Refs:** RF-155 · RF-156 · RF-157 · RF-158 · RF-160

## 📝 Descrição

Suportar importação de extratos bancários (OFX, CSV, XLSX, PDF via Gemini), benefícios VA/VR/VT, preview editável com dedupe, mapeamento manual de colunas CSV e ajuste de saldo quando necessário.

## ✅ Critérios de Aceite

### Cenário 1 — Upload
**Quando** seleciono tipo (CONTA, VA, VR, VT) e arquivo válido,  
**Então** `POST /importacoes/analisar` retorna linhas parseadas ou pede mapeamento.

### Cenário 2 — Mapeamento CSV
**Quando** CSV desconhecido,  
**Então** step mapping para data/valor/descrição antes do preview.

### Cenário 3 — Preview editável
**Então** usuário edita categorias, ignora duplicatas sinalizadas (hash data+valor+descrição).

### Cenário 4 — Confirmar
**Quando** `POST /importacoes/confirmar`,  
**Então** transações gravadas em lote; modal fecha e dashboard recarrega.

### Cenário 5 — PDF
**Quando** PDF de extrato,  
**Então** parser via Gemini (`GEMINI_API_KEY_PDF` / `GEMINI_PDF_MODEL`).

## 🔗 Sub-issues

- PULSO-TASK-020
- PULSO-TASK-021

## 📋 Resumo

### ✅ Concluído
- Fluxo multi-step e contratos analyze/confirm definidos

### ⏳ Pendente
- PULSO-TASK-020 — backend parsers + importService
- PULSO-TASK-021 — ImportStatementModal + steps frontend
- RF-159 aprendizado de categorização (evolução futura)
