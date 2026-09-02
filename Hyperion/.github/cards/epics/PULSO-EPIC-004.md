---
card_id: "PULSO-EPIC-004"
title: "Metas Financeiras"
status: "Backlog"
type: "Epic"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
board_sync_at: "2026-08-26T15:29:24.000Z"
categories:
  - "web"
  - "Backend"
  - "Banco de Dados"
  - "Frontend"
  - "Regra de Negócio"
---


# [EPIC] Metas Financeiras

> **Contexto:** Planejamento de objetivos financeiros — criar metas com valor-alvo e prazo, registrar aportes manuais, acompanhar progresso visual, pausar/retomar/concluir; sugerir valor mensal; meta especial de reserva de emergência com base no gasto médio.

**Refs:** RF-026–032 · RF-142 · RN-061–068

## 🎯 Objetivos

- CRUD de metas pessoais (nome, valor-alvo, prazo, descrição, prioridade, tipo curto/longo prazo)
- Aportes manuais com validação de valor restante e data não futura
- Progresso com barra, percentual e sugestão mensal (RN-067)
- Transições de status: ATIVA ↔ PAUSADA, auto-conclusão ao atingir valor (RN-063)
- Notificação `META_ATINGIDA` ao concluir meta (RF-032)
- Sugestão de reserva de emergência: média de 3 meses de despesas × N meses (RF-142, padrão 6)
- Alerta visual "Meta vencida" quando prazo passou sem conclusão (RN-068)
- Exclusão de aporte em meta concluída reabre meta para ATIVA quando aplicável
- Resumo agregado: totais, progresso médio, categorias por tipo/status, atividade recente

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/goals` | Metas Financeiras | Tabs (todas/ativas/pausadas/concluídas), busca, filtros de prazo, sidebar resumo |
| Modal | Nova/Editar meta | Campos + atalho "Reserva de Emergência"; histórico de aportes no edit |
| Modal | Registrar aporte | Valor + data; validação valor restante |
| Modal | Excluir meta | Confirmação irreversível |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | `transactionRepository.calcularAgregados` para sugestão RF-142 |
| Notificações | `META_ATINGIDA` em `registrarAporte` |
| Gamificação | `processarAposCriarMeta` em `criarMeta` |
| Dashboard | Widget `DashboardActiveGoals` (RF-013) |
| Viagens | `Viagem.metaId` 1:1 opcional — `onDelete: SetNull` (RN-073) |
| Planejamento de Compra | `ItemPlanejamentoCompra.metaId` vinculável (RF-137) |
| Grupos | Metas compartilhadas em epic separado (`MetaGrupo`) |

## 🔗 Sub-issues

- PULSO-FEAT-018
- PULSO-FEAT-019
- PULSO-FEAT-020
- PULSO-FEAT-021
- PULSO-FEAT-022

## 📋 Resumo

### ✅ Concluído
- Escopo RF-026–032, RF-142 e RN-061–068 mapeado
- Hierarquia Epic → 5 Features → 12 Tasks definida
- Contratos API e fluxos de UI documentados como spec

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Metas de grupo (RF-096–097) — epic Grupos
