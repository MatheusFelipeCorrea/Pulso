---
card_id: PULSO-FEAT-073
title: "Geração LLM — resumo, sugestões e educação"
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
  - Inteligência Artificial
  - Regra de Negócio
---

# [FEATURE] Geração LLM — resumo, sugestões e educação

> **Contexto:** Prompt + resposta JSON do Gemini personalizada por usuário.

**Refs:** RF-044–046 · RF-143 · RF-NOVO-I1

## 📝 Descrição

Orquestrar chamada Gemini com contexto agregado e validar o JSON de saída.

## ✅ Critérios de Aceite

### Schema de resposta (JSON)

| Campo | Conteúdo |
|-------|----------|
| `resumoMensal` | Texto natural do mês (RF-044) |
| `variacaoCategorias[]` | MoM + comentário (RF-045/143) |
| `score` | Valor/label/fatores (eco do cálculo determinístico + narrativa) |
| `projecoes` | 3 cenários + `diasAteNegativo` |
| `sugestoes[]` | Economia acionável (local mais barato, % delivery, etc.) (RF-046) |
| `alertas[]` | Cobertura / metas / ritmo |
| `educacao[]` | `{ tipo: instagram\|youtube\|artigo\|perfil, titulo, url, motivo }` (RF-NOVO-I1) |

### Regras de prompt
- Responder **somente** com base no contexto enviado; não inventar saldos/transações
- Sugestões concretas e rastreáveis aos dados (citar categoria/estabelecimento quando existir)
- Educação alinhada ao perfil (ex.: CLT vs freelancer; alto delivery → conteúdo sobre gastos por impulso)
- Links: preferir fontes conhecidas; se URL incerta, marcar `verificarUrl: true` e deixar UI abrir com cuidado
- PT-BR

## 🔗 Sub-issues

- PULSO-TASK-146
- PULSO-TASK-147

## 📋 Resumo

### ✅ Concluído
- Contrato JSON e regras de prompt definidos

### ⏳ Pendente
- PULSO-TASK-146–147 — prompt e geração
