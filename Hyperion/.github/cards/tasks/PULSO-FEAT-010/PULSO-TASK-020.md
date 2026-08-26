---
card_id: PULSO-TASK-020
title: "Backend — importação de extratos"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-010
due_date: null
categories:
  - Backend
  - Integração Externa
  - Regra de Negócio
  - Inteligência Artificial
---

# [TASK] Backend — importação de extratos

> **Contexto:** API de analyze/confirm para RF-155–158 e RF-160.

## 📝 Descrição

Implementar parse multi-formato, sugestão de categorias, dedupe e gravação em lote de transações importadas.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `POST` | `/api/importacoes/analisar` | Upload multipart → linhas + resumo + `precisaMapeamento` |
| `POST` | `/api/importacoes/confirmar` | Grava linhas válidas; ajuste saldo se necessário |

**Origens:** `CONTA`, `VA`, `VR`, `VT` — mapeiam recurso (`DINHEIRO`, `VA`, `VR`, `VT`)

## 🛠️ Implementação

### Service (NOVO — CRIAR)

`Codigo/Pulso/api/src/services/importService.js`

```javascript
// analisarArquivo(usuarioId, { arquivo, origem, mapeamento })
// confirmarImportacao(usuarioId, body)
```

### Parsers (NOVO — CRIAR)

`Codigo/Pulso/api/src/parsers/` — OFX, CSV (delimitador/encoding), XLSX, PDF (Gemini)

### Utils (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `importHashUtils.js` | `buildImportHash` dedupe |
| `importCategoryRules.js` | Regras descrição → categoria |
| `importBeneficioUtils.js` | Saldo extrato, ajuste benefício |
| `categorySuggestionUtils.js` | Sugestão por histórico |

### HTTP (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `importController.js` | `analisarArquivo`, `confirmarImportacao` |
| `importRoutes.js` | Rotas + `handleStatementUpload` middleware |
| `schemas/importSchemas.js` | Zod validate |
| `routes/index.js` | `router.use('/importacoes', importRoutes)` |

**Env PDF:** `GEMINI_API_KEY_PDF`, `GEMINI_PDF_MODEL`

## 📐 Regras de Negócio

- Dedupe: hash estável data+valor+descrição normalizada (RF-158)
- Categorização: regras + histórico + categoria ajuste saldo para benefícios
- Preview obrigatório antes de confirmar (RF-157)

## 📋 Resumo

### ✅ Concluído
- Fluxo analyze/confirm e mapa de parsers definidos

### ⏳ Pendente
- Implementar importService + parsers
- Middleware upload e schemas
