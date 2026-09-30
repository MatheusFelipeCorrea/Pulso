---
card_id: PULSO-FEAT-077
title: "Revisar apresentação do projeto"
status: Done
type: Feature
priority: Medium
sprint: "Sprint 1"
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-EPIC-014
due_date: null
categories:
  - Documentação
---

# [FEATURE] Revisar apresentação do projeto

> **Contexto:** `docs/1.apresentacao.md` já descreve o Pulso (problema, objetivos arquiteturais, glossário). Esta feature **não reescreve** o documento: só revisa consistência com README, memória e cards atuais (VA/VR, sem VT).

**Arquivo:** `docs/1.apresentacao.md`

## 📖 Histórias

- Como **equipe da disciplina**, quero revisar a apresentação já preenchida, para a apostila não divergir do produto nos cards.
- Como **leitor da apostila**, quero problema, objetivos e abreviaturas alinhados ao Pulso, para a seção 1 servir de base ao restante da documentação.

## ✅ Critérios de Aceite

### Cenário 1 — Consistência de produto
**Dado** o texto atual da apresentação,  
**Quando** comparado a `README.md`, `Hyperion/.github/memory/PROJECT.md` e epics de produto,  
**Então** renda/benefícios citam **VA e VR** (não VT); domínio (transações, orçamento, metas, dívidas, grupos, importação) permanece coerente.

### Cenário 2 — Objetivos
**Então** o objetivo geral continua sendo a **descrição arquitetural** do Pulso; os específicos (camadas Web/API, domínio, isolamento, integrações, qualidade) não contradizem os cards.

### Cenário 3 — Glossário e referências
**Então** a tabela 1.3 e as referências bibliográficas seguem válidas; termos obsoletos ou de template PUC não reaparecem.

### Cenário 4 — Sem retrabalho
**Então** não se substitui a seção por template; mudanças são pontuais (typo, alinhamento, abreviatura).

## 👤 Responsável

- Matheus Felipe Correa (`MatheusFelipeCorrea`)

## 📋 Resumo

### ✅ Concluído
- Documento já existe no repositório como texto Pulso

### ⏳ Pendente
- Nenhum
