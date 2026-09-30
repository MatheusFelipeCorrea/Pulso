---
card_id: PULSO-EPIC-004
title: "Metas Financeiras"
status: "In Revision"
type: Epic
priority: Highest
sprint: "Sprint 3"
story_points: null
reporter: "Matheus Felipe Correa"
parent: null
due_date: null
categories:
  - Backend
  - Frontend
  - Web
  - Banco de Dados
  - Regra de Negócio
---

# [EPIC] Metas Financeiras

> **Contexto:** Planejamento de objetivos financeiros — criar metas com valor-alvo e prazo, registrar aportes manuais, acompanhar progresso visual, pausar/retomar/concluir; sugerir valor mensal; meta especial de reserva de emergência com base no gasto médio.

**Refs:** RF-029–036 · RF-036 · RN-061–068

## 🎯 Objetivos

- CRUD de metas pessoais (nome, valor-alvo, prazo, descrição, prioridade, tipo curto/longo prazo)
- Aportes manuais com validação de valor restante e data não futura
- Progresso com barra, percentual e sugestão mensal (RN-067)
- Transições de status: ATIVA ↔ PAUSADA, auto-conclusão ao atingir valor (RN-063)
- Notificação `META_ATINGIDA` ao concluir meta (RF-035)
- Sugestão de reserva de emergência: média de 3 meses de despesas × N meses (RF-036, padrão 6)
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
| Transações | `transactionRepository.calcularAgregados` para sugestão RF-036 |
| Notificações | `META_ATINGIDA` em `registrarAporte` |
| Dashboard | Widget `DashboardActiveGoals` (RF-013) |
| Viagens | `Viagem.metaId` 1:1 opcional — `onDelete: SetNull` (RN-073) |
| Planejamento de Compra | `ItemPlanejamentoCompra.metaId` vinculável (RF-128) |
| Grupos | Metas compartilhadas em epic separado (`MetaGrupo`) |

## 🔗 Sub-issues

- PULSO-FEAT-018
- PULSO-FEAT-019
- PULSO-FEAT-020
- PULSO-FEAT-021
- PULSO-FEAT-022
- PULSO-FEAT-109

## 📋 Resumo

### ✅ Concluído
- Escopo RF-029–036, RF-036 e RN-061–068 mapeado
- API + Web + Flutter mergeados na Sprint-3 (In Revision)
- Hierarquia Epic → Features → Tasks definida

### ⏳ Pendente
- PULSO-TASK-166 — protótipos de metas na apostila
- Metas de grupo (RF-092–093) — epic Grupos
