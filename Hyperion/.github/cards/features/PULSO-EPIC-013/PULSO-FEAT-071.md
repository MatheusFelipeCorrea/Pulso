---
card_id: PULSO-FEAT-071
title: "Agregação de contexto financeiro do usuário"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-013
due_date: null
categories:
  - Backend
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Agregação de contexto financeiro do usuário

> **Contexto:** Montar o “dossier” determinístico que alimenta o prompt — só dados do `usuarioId`.

## 📝 Descrição

Implementar builder de contexto + persistência do snapshot gerado.

## ✅ Critérios de Aceite

Contexto mínimo por mês de referência:

| Bloco | Conteúdo |
|-------|----------|
| Fluxo | Receitas/despesas mês atual e anteriores (3+ meses) |
| Categorias | Totais e ranking; comparação MoM |
| Estabelecimentos | Frequência/média por descrição (ex.: almoço, delivery) quando houver dados |
| Orçamento | Limites, % usado, estourados |
| Metas | Progresso, prazo, valor restante |
| Recursos | Saldos / ritmo VA-VR-VT se disponível |
| Perfil | `modoUso`, renda planejada (se houver) |

- Filtrar sempre por `usuarioId` (isolamento total)
- Snapshot persistido (model novo ou JSON em tabela dedicada) para cache/histórico
- Payload compacto o bastante para caber no prompt (agregados, não dump bruto de todas as linhas)

## 🔗 Sub-issues

- PULSO-TASK-142
- PULSO-TASK-143

## 📋 Resumo

### ✅ Concluído
- Shape do contexto definido

### ⏳ Pendente
- PULSO-TASK-142–143 — schema e builder
