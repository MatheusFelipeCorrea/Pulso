---
card_id: PULSO-EPIC-013
title: "Insights Inteligentes"
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
  - Integração Externa
  - Inteligência Artificial
  - Regra de Negócio
  - Notificações
---

# [EPIC] Insights Inteligentes

> **Contexto:** Painel personalizado com IA (Gemini) que lê os dados financeiros do próprio usuário e devolve resumo do mês, variação por categoria, score de saúde, projeções (otimista/atual/pessimista), sugestões de economia, alertas (cobertura/metas) e conteúdos educativos (Instagram, YouTube, sites). Cada usuário recebe insights diferentes porque o contexto é só o dele.

**Refs:** RF-044–048 · RF-107–108 · RF-143 · RN-125–128 · RF-014 (Dashboard score)  
**Novos (este épico):** RF-NOVO-I1 conteúdo educativo personalizado · RF-NOVO-I2 chave Gemini dedicada Insights

## 🎯 Objetivos

- Provider Gemini separado do PDF: `GEMINI_API_KEY_INSIGHTS` + `GEMINI_INSIGHTS_MODEL` (mesmo padrão de URL/`generateContent` do `pdfParser`)
- Agregar contexto do usuário (transações, categorias, orçamento, metas, saldos/recursos, VT) — **nunca** dados de outros usuários
- Resumo mensal em linguagem natural (RF-044)
- Variação por categoria vs mês anterior / “você vs você mesmo” (RF-045, RF-143)
- Score de saúde financeira 0–100 + persistência em `HistoricoScore` (RF-048, RN-127); alinhar/enriquecer `calcularSaudeFinanceira` do dashboard
- Projeções 3/6/12 meses em 3 cenários + dias até negativo (RF-107–108, RN-128)
- Sugestões acionáveis (ex.: almoçar em X com gasto menor que a média; reduzir delivery em Y%) (RF-046)
- Alertas: cobertura de gastos (VA/orçamento), meta no prazo / atrasada (RF-047)
- Orientação educativa: perfis/vídeos/artigos de finanças relevantes ao perfil do usuário (RF-NOVO-I1)
- Geração automática fim de mês (job) + regenerar sob demanda com cota (RN-125–126)
- Tela `/insights` (hoje `InDevelopmentPage`)
- Substituir insight “regra fixa” atual (`insightService` / `geradoPor: regras`) por payload real de IA

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/insights` | Insights Inteligentes | Ver painel do mês, regenerar, abrir links educativos, deep-link alertas |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Gemini | Chave **Insights** distinta de `GEMINI_API_KEY_PDF` |
| Transações / Orçamento / Metas / VT | Fonte do contexto agregado |
| Dashboard | Score/saúde reutilizável ou sincronizado |
| Notificações | `INSIGHT_IA` com `geradoPor: 'gemini'` + link `/insights` |
| Cron | Job mensal (+ opcional score diário RN-127) |

## 🚫 Fora de escopo

- **Chatbot** (RF-049–053, RN-121–124/129–130) — épico separado
- Revisão semanal guiada (RF-144) — evolução futura

## 🔗 Sub-issues

- PULSO-FEAT-070
- PULSO-FEAT-071
- PULSO-FEAT-072
- PULSO-FEAT-073
- PULSO-FEAT-074
- PULSO-FEAT-075
- PULSO-FEAT-076

## 📋 Resumo

### ✅ Concluído
- Escopo RF-044–048 / 107–108 / 143 + RF-NOVO-I1/I2 mapeado
- Hierarquia Epic → 7 Features → 12 Tasks definida
- Padrão Gemini PDF documentado como referência de implementação

### ⏳ Pendente
- Implementar provider, agregação, geração, API, job e UI
