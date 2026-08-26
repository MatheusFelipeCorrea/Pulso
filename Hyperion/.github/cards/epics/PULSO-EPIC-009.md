---
card_id: PULSO-EPIC-009
title: "Orçamento Mensal"
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
  - Notificações
---

# [EPIC] Orçamento Mensal

> **Contexto:** Limites mensais por categoria de despesa, progresso visual, rollover opcional, alertas 80%/100% e cópia entre meses — sem bloquear o registro de transações.

**Refs:** RF-109–114 · RF-150 · RN-055–060 · RN-170

## 🎯 Objetivos

- Definir limite mensal de gasto por categoria de despesa (RF-109, RN-055)
- Exibir progresso gasto vs limite e resumo do que ainda pode gastar (RF-110, RF-114)
- Alertar em 80% e ao estourar 100% do limite (RF-111, RF-112, RN-056–057)
- Editar limites a qualquer momento; lista vazia remove orçamentos do mês (RF-113)
- Rollover ativável por categoria: sobra positiva do mês anterior soma ao limite ao criar o mês (RF-150, RN-170)
- Orçamento não bloqueia transação — apenas alerta (RN-058)
- Warning permanente se orçamento total > renda planejada (RN-059)
- Categorias sem limite não geram alertas (RN-060)
- Copiar orçamentos de um mês para outro (destino vazio → 409 se já houver)
- Job/cron + sync pós-transação para notificações com dedup

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/budget` | Orçamento Mensal | Filtrar mês, ver status, editar limites, copiar mês anterior |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | Gastos agregados por categoria no mês; sync alertas via `userSyncService` |
| Categorias | Apenas categorias `DESPESA` do usuário |
| Dashboard | `obterStatusOrcamento` no agregado; widget `DashboardBudgetAlerts` |
| Notificações | Tipos `ALERTA_ORCAMENTO` e `ORCAMENTO_ESTOURADO`; link `/budget` |
| Config. financeira | `rendaMensalPlanejada` (Módulo 10) — aviso RN-059 só dispara se renda > 0 |

## 🔗 Sub-issues

- PULSO-FEAT-046
- PULSO-FEAT-047
- PULSO-FEAT-048
- PULSO-FEAT-049
- PULSO-FEAT-050
- PULSO-FEAT-051

## 📋 Resumo

### ✅ Concluído
- Escopo RF-109–114, RF-150 e RN-055–060 / RN-170 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Configuração de renda mensal (Módulo 10 / RNF-NOVO-N2) — evolução futura
