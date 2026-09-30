---
card_id: PULSO-FEAT-080
title: "Requisitos funcionais, não funcionais e mecanismos"
status: Done
type: Feature
priority: High
sprint: "Sprint 1"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-014
due_date: null
categories:
  - Documentação
  - Arquitetura
---

# [FEATURE] Requisitos funcionais, não funcionais e mecanismos

> **Contexto:** `docs/3.requisitos.md` está vazio (RF001 sem descrição, restrição de exemplo Python/Django). Os RFs já vivem nos epics `PULSO-EPIC-001`–`013`. Esta feature **consolida** o que os cards já mapearam — não inventa módulo novo.

**Arquivo:** `docs/3.requisitos.md`  
**Fonte:** frontmatter/`**Refs:**` dos epics e features de produto

## 📖 Histórias

- Como **equipe**, quero a tabela de RF do Pulso na apostila, para a disciplina ver cobertura arquitetural.
- Como **equipe**, quero RNF, restrições e mecanismos (análise → design → implementação) alinhados à stack planejada, para a seção 3 não citar Django/Rails.

## ✅ Critérios de Aceite

### Cenário 1 — Requisitos funcionais
**Então** 3.1 lista RF essenciais dos módulos: auth, dashboard, transações (incl. VA/VR e RF-025 de incompatibilidade recurso×categoria), metas, viagens, lembretes, homepage, grupos, orçamento, compras, divisão, dívidas, insights, importação. Prioridade/plataforma/sprint podem começar vazios ou “Backlog”, mas **descrição não**.

### Cenário 2 — Não funcionais
**Então** 3.2 cobre itens de impacto arquitetural já implícitos nos cards: autenticação JWT/cookies, isolamento por usuário (LGPD), rate limit auth, jobs/cron, responsividade, tema claro/escuro, disponibilidade da API.

### Cenário 3 — Restrições
**Então** 3.3 **não** diz Python/Django; registra o que limita a solução (ex.: Web React, API Node, produto gratuito no escopo TI5, dados do usuário autenticado).

### Cenário 4 — Mecanismos
**Então** 3.4 preenche Análise / Design / Implementação (persistência, front, back, integração OAuth/Gemini/cotações, log, teste, deploy) sem produto inventado além do que memória/cards já dizem; se o scaffold ainda não existir, a coluna Implementação pode dizer “a definir no scaffold” em vez de Hibernate.

## 👤 Responsáveis

- Matheus Felipe Correa (`MatheusFelipeCorrea`)
- Alice Shikida (`aliceshikida`)

## 📋 Resumo

### ✅ Concluído
- Inventário de RFs nos epics 001–013
- Transcrição em `docs/3.requisitos.md` (RF-001–139, RNF-001–016, restrições e mecanismos); check vazio e status Pendente

### ⏳ Pendente
- Nenhum
