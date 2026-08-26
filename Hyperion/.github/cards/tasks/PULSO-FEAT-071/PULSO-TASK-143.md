---
card_id: PULSO-TASK-143
title: "Backend — insightContextBuilder"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-071
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — insightContextBuilder

> **Contexto:** Agregar só dados do usuário para o prompt.

## 📝 Descrição

Implementar builder determinístico de contexto mensal.

## 🛠️ Implementação

### `services/insightContextBuilder.js` (NOVO — CRIAR)

| Seção | Fonte |
|-------|-------|
| `fluxo` | Transações RECEITA/DESPESA — mês atual + 3 anteriores |
| `categorias` | groupBy categoria; MoM |
| `estabelecimentos` | Top descrições DESPESA (frequência, média, min) — base para sugestões tipo “almoçar em X” |
| `orcamento` | Status do mês (`budgetService` / repository) |
| `metas` | Ativas: progresso, prazo, restante |
| `recursos` | Saldos / ritmo VT-VA-VR se disponível |
| `perfil` | modoUso, rendaMensalPlanejada |

Sempre `where: { usuarioId }`. Retornar objeto serializável e enxuto (agregados).

## 📋 Resumo

### ✅ Concluído
- Mapa de fontes definido

### ⏳ Pendente
- Implementar builder
