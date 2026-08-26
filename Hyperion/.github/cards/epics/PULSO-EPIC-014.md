---
card_id: PULSO-EPIC-014
title: "Documentação acadêmica"
status: Backlog
type: Epic
priority: Highest
sprint: "Sprint 1"
story_points: null
reporter: "Matheus Felipe Correa"
parent: null
due_date: null
categories:
  - Documentação
  - Arquitetura
---

# [EPIC] Documentação acadêmica

> **Contexto:** Alinhar a apostila da disciplina (`docs/`) e os artefatos de gerência/INPI (`assets/`) ao produto Pulso. `1.apresentacao.md` já descreve o Pulso; o restante de `docs/` ainda é template PUC (heurística de outro projeto). `assets/` está em branco e **não há cliente externo** — atas de reunião ficam fora. Sem tasks: histórias e critérios na própria feature. Fonte: cards de produto, não inventar RF.

**Refs:** apostila `docs/1`–`docs/8` · `docs/README.md` · `assets/` · cards `PULSO-EPIC-001`–`013`

## 🎯 Objetivos

- Tirar placeholders da PUC (nomes, Heroku, persona Ana Souza, lorem, diagramas de exemplo)
- Uma feature por arquivo da apostila, mais uma só para **revisar** a apresentação já pronta
- Consolidar RF/RNF/restrições a partir dos cards atuais (VA/VR, sem VT)
- Modelagem e ATAM descrevem a arquitetura Pulso (Web React + API Node, isolamento por usuário)
- Wireframes (`docs/5`) e heurística (`docs/6`) dependem dos protótipos (`PULSO-EPIC-015`)
- Solução (`docs/7`) documenta telas do sistema **construído** — depois da implementação
- Preencher TAP, contribuição semanal e INPI **sem** parceiro externo (acordo, procuração NIT, termo de sigilo); **não** atas nem acordo com cliente externo

## 🎭 Entregas

| Arquivo | Feature | Situação atual |
|---------|---------|----------------|
| `docs/1.apresentacao.md` | Revisar (não reescrever) | Já Pulso |
| `docs/README.md` | Índice, equipe, ferramentas | Template |
| `docs/2.nosso_produto.md` | Visão, canvas, personas | Template |
| `docs/3.requisitos.md` | RF, RNF, restrições, mecanismos | Tabelas vazias |
| `docs/4.modelagem.md` | Histórias, classes, componentes, dados | Exemplos PUC |
| `docs/5.wireframe.md` | Wireframes na apostila | Só definição |
| `docs/6.avaliacao_heuristica.md` | Heurística do Pulso | Outro projeto |
| `docs/7.solucao.md` | Telas do sistema construído | Vazio |
| `docs/8.avaliacao_arquitetura.md` | ATAM | Lorem / exemplo Rails |
| `assets/` (TAP, INPI, logs) | Gerência + INPI sem cliente externo | Template; atas fora |

## 🔗 Sub-issues

- PULSO-FEAT-077
- PULSO-FEAT-078
- PULSO-FEAT-079
- PULSO-FEAT-080
- PULSO-FEAT-081
- PULSO-FEAT-082
- PULSO-FEAT-083
- PULSO-FEAT-084
- PULSO-FEAT-085
- PULSO-FEAT-099

## 📋 Resumo

### ✅ Concluído
- Descoberta dos 9 arquivos em `docs/`
- Hierarquia Epic → Feature (sem Task/Story em arquivo)

### ⏳ Pendente
- Preencher cada feature
- Encadear `docs/5` e `docs/6` com `PULSO-EPIC-015`
