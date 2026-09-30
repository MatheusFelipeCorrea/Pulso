---
card_id: PULSO-FEAT-078
title: "Índice, equipe e ferramentas da apostila"
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
---

# [FEATURE] Índice, equipe e ferramentas da apostila

> **Contexto:** `docs/README.md` ainda é o template PUC (Aluno 1…, resumo vazio, GitHub `XXXXXXX`, Heroku, Figma placeholder).

**Arquivo:** `docs/README.md`

## 📖 Histórias

- Como **equipe**, quero o índice da apostila com nomes, e-mails e professores reais, para a capa da documentação ser a do Pulso.
- Como **avaliador**, quero links de repositório e (quando existirem) hospedagem e Figma, para a seção Ferramentas não ter URL fictícia.

## ✅ Critérios de Aceite

### Cenário 1 — Identidade
**Então** título Pulso; alunos (Matheus Felipe, Alice Shikida, Maria Clara, Sofia Vasconcelos, Vinicius Simões) e professores (Leonardo Vilela, João Paulo Aramuni, Arthur Mol); campus/curso PUC Minas.

### Cenário 2 — Resumo
**Então** o resumo contextualiza gestão financeira pessoal no Brasil (VA/VR), objetivo da descrição arquitetural e não copia o lorem do template.

### Cenário 3 — Sumário
**Então** âncoras 1–8 apontam para os `.md` existentes; a seção 1.3 e as subseções batem com os arquivos.

### Cenário 4 — Ferramentas
**Então** repositório = `https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso`; Heroku/placeholder some; Figma entra quando o epic de protótipos tiver link (pode ficar “em breve” até lá, sem URL falsa).

## 🔗 Pull Requests

- [#290](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/290) — Apostila, READMEs e mecanismos
- [#291](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/291) — Protótipos de Auth na documentação

## 📋 Resumo

### ✅ Concluído
- Estrutura do sumário PUC mapeada

### ⏳ Pendente
- Substituir template por dados do Pulso
