---
card_id: PULSO-EPIC-003
title: "Gerenciamento de Transações"
status: Backlog
type: Epic
priority: Highest
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Banco de Dados
  - Regra de Negócio
---

# [EPIC] Gerenciamento de Transações

> **Contexto:** Núcleo financeiro do Pulso — registrar, listar, filtrar, editar e excluir receitas, despesas e transferências; vincular categorias/tags; recorrência automática; validação recurso×categoria (VA/VR; VT rejeitado); sugestão de categoria por histórico.

**Refs:** RF-016–028

## 🎯 Objetivos

- CRUD de transações (receita, despesa, transferência) com validações de domínio
- Categorias padrão + personalizadas com `grupoBeneficio` (VA/VR)
- Tags livres M:N com criação inline no formulário
- Filtros por período, categoria, tipo, recurso; busca por descrição/tag
- Cards de resumo (receitas, despesas, saldo) sincronizados com filtros
- Recorrência RFC 5545 (semanal, quinzenal, mensal, anual) + job diário
- Transferências entre recursos sem contabilizar em totais de receita/despesa (RF-027)
- Sugestão automática de categoria ao digitar descrição (RF-028)
- Validar compatibilidade VA/VR × categoria; recurso VT rejeitado na API (RF-026)
- Exclusão recorrente "esta e futuras" preservando histórico passado

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/transactions` | Transações | Resumo, filtros, lista paginada agrupada por data |
| Modal | Nova/Editar | Toggle receita/despesa/transferência, recorrência, tags |
| Modal | Excluir | Simples ou recorrente (só esta / esta e futuras) |
| Modal | Categorias | CRUD categorias custom com preset benefício |
| Modal | Tags | CRUD tags com ícone e cor |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Categorias | Seed no cadastro; `categoryService`, `CategoryManageModal` |
| Tags | `tagService`, `TagManageModal`, `TransacaoTag` |
| Notificações | `RECEITA_REGISTRADA`, `DESPESA_REGISTRADA`, `TRANSFERENCIA_REGISTRADA` |
| Insights | `insightService.tentarGerarInsightAposTransacao` |
| Dashboard | `calcularResumo` reutilizado em `dashboardService` |
| Importação | `categorySuggestionUtils` compartilhado com import |
| Cron | `recurringTransactions.js` — 00:05 diário |

## 🔗 Sub-issues

- PULSO-FEAT-012
- PULSO-FEAT-013
- PULSO-FEAT-014
- PULSO-FEAT-015
- PULSO-FEAT-016
- PULSO-FEAT-017

## 📋 Resumo

### ✅ Concluído
- Escopo RF-016–028 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida
- Contratos API e fluxos de UI documentados como spec

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Concorrência otimista em edição (If-Match) — evolução futura
- Indicador visual de recorrência na lista — opcional
