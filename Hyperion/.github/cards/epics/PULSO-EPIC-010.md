---
card_id: PULSO-EPIC-010
title: "Planejamento de Compra"
status: Backlog
type: Epic
priority: Highest
sprint: "Sprint 4"
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
  - Integração Externa
---

# [EPIC] Planejamento de Compra

> **Contexto:** Lista de desejos com prioridade, estimativa de tempo via sobra mensal, simulação à vista vs parcelado, alerta de comprometimento da renda, vínculo com meta e “Comprei!” gerando transação.

**Refs:** RF-124–129 · RN-087–093

## 🎯 Objetivos

- Registrar item desejado com nome, valor, prioridade e categoria (RF-124)
- Calcular meses para comprar: valor ÷ sobra mensal (RF-125, RN-087)
- Sobra mensal = média (receita − despesa) dos últimos 3 meses (RN-088)
- Simular à vista vs parcelado (nº de parcelas 1–48) (RF-126, RN-089)
- Alertar comprometimento de parcelas vs renda (>20% atenção, >30% arriscado) (RF-127, RN-090–091)
- Vincular item a meta existente ou criar meta no fluxo (RF-128)
- Marcar “Comprei!” → cria despesa + conclui meta vinculada (RF-129, RN-092–093)
- Imagem do item: URL, og:image do link, Wikimedia ou upload
- Painel: resumo, dicas do dia, categorias, histórico de comprados

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/purchase-planning` | Planejamento de Compra | CRUD itens, simular parcelas, vincular meta, comprar, histórico |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | `marcarComprado` cria DESPESA (categoria Compras ou informada) |
| Metas | Vincular / criar meta; concluir ao comprar (RN-093) |
| Config. financeira | `obterRendaMensalPlanejada` (`userFinanceUtils`) |
| Imagens | `purchaseItemImageService` + storage local |

## 🔗 Sub-issues

- PULSO-FEAT-052
- PULSO-FEAT-053
- PULSO-FEAT-054
- PULSO-FEAT-055
- PULSO-FEAT-056
- PULSO-FEAT-057
- PULSO-FEAT-113

## 📋 Resumo

### ✅ Concluído
- Escopo RF-124–129 e RN-087–093 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend
