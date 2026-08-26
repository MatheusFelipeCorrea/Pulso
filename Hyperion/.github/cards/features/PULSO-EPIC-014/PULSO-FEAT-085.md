---
card_id: PULSO-FEAT-085
title: "Avaliação da arquitetura (ATAM)"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-014
due_date: null
categories:
  - Documentação
  - Arquitetura
---

# [FEATURE] Avaliação da arquitetura (ATAM)

> **Contexto:** `docs/8.avaliacao_arquitetura.md` usa lorem e um exemplo Rails/Angular de segurança. Precisa de cenários ATAM do Pulso (JWT, isolamento de usuário, jobs, integrações).

**Arquivo:** `docs/8.avaliacao_arquitetura.md`  
**Fonte:** `docs/3` (RNF), epic Auth, grupos (isolamento RF-094), insights (só dados do usuário)

## 📖 Histórias

- Como **equipe**, quero cenários de qualidade do Pulso (não acessibilidade genérica em latim), para a seção 8 avaliar *esta* arquitetura.
- Como **equipe**, quero a tabela estímulo/mecanismo/resposta preenchida com decisões reais (cookies httpOnly, `authMiddleware`, tenant = usuário logado), para evidenciar trade-offs.

## ✅ Critérios de Aceite

### Cenário 1 — Cenários
**Então** 8.1 substitui o lorem por cenários alinhados a RNF: segurança (sessão/JWT), isolamento de dados (grupo vs. pessoal), manutenibilidade (camadas API/Web), integrações (OAuth, Gemini, cotações) — quantitativos quando o card já tiver número (rate limit, TTL de token).

### Cenário 2 — Avaliação
**Então** 8.2 usa mecanismo Pulso (não “servidor Rails + Angular”); riscos/sensibilidade/trade-off podem existir (ex.: GraphQL vs. REST no Project, Gemini vs. regras, Socket.IO long-running em grupos).

### Cenário 3 — Evidências
**Então** a subseção de evidências aponta testes, jobs ou decisões dos cards; se ainda não houver execução, declara o que será medido — sem screenshot de outro sistema.

### Cenário 4 — Sem template
**Então** some o exemplo de cadastro de produtos do administrador.

## 📋 Resumo

### ✅ Concluído
- Gap ATAM vs. domínio Pulso mapeado

### ⏳ Pendente
- Redigir cenários e tabelas com base nos RNF
