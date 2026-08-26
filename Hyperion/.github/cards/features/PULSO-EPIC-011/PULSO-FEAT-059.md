---
card_id: PULSO-FEAT-059
title: "Rateio igual e personalizado"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-011
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [FEATURE] Rateio igual e personalizado

> **Contexto:** Cálculo determinístico de valores por participante (RNF-016).

**Refs:** RF-116 · RF-117 · RN-082 · RN-083 · RNF-016

## 📝 Descrição

Implementar `splitEqual` e validação de soma personalizada em centavos.

## ✅ Critérios de Aceite

- `IGUAL`: valor total ÷ N participantes; resto de centavos distribuído nos primeiros (RN-082)
- `PERSONALIZADA`: soma dos valores (outros + `valorOrganizador`) = total em centavos (RN-083)
- Nomes únicos (case-insensitive) e ≠ “Você”
- `pagoPor` deve ser um participante ou `VOCE`; quem pagou a conta nasce `PAGO`
- Valores > 0 para todos na personalizada

## 🔗 Sub-issues

- PULSO-TASK-119

## 📋 Resumo

### ✅ Concluído
- Regras de rateio mapeadas

### ⏳ Pendente
- PULSO-TASK-119 — utils de centavos
