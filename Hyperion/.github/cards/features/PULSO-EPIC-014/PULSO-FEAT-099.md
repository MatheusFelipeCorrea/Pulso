---
card_id: PULSO-FEAT-099
title: "Artefatos de gerência, INPI e contribuição semanal"
status: Backlog
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

# [FEATURE] Artefatos de gerência, INPI e contribuição semanal

> **Contexto:** Pacote `assets/` ainda é template PUC. **Não há cliente nem parceiro externo** — atas de reunião (`assets/atas/`, visita ao cliente) e `AtaAcordoInicialComClienteExterno.docx` ficam **fora**. Cliente no TAP = equipe / disciplina PUC Minas; beneficiário do produto é o usuário do Pulso.

**Pasta:** `assets/`

## 📖 Histórias

- Como **equipe**, quero o TAP do Pulso preenchido, para a gerência deixar de ser o nº 9999 / Aluno 1.
- Como **equipe**, quero os termos INPI **sem** parceiro externo (acordo, procuração NIT e sigilo) com os dados do time, para o registro não usar o modelo de cliente externo.
- Como **aluno**, quero um arquivo de contribuição semanal com o meu nome, para o log da sprint não ser `alunoX.md`.

## 🎭 Arquivos

| Caminho | Entra? | Entrega |
|---------|--------|---------|
| `assets/README.md` | Sim | Índice Pulso do que existe de fato |
| `assets/gerencia/README.md` | Sim | Apontar arquivos reais (não `.docx` fantasma) |
| `assets/gerencia/termo_de_abertura_do_projeto.md` | Sim | TAP preenchido |
| `assets/inpi/AtaAcordo-SemParceiroExterno.docx` | Sim | Preencher (acordo **sem** parceiro) |
| `assets/inpi/PROCURACAO_NIT_PUC_MINAS.docx` | Sim | Preencher (outorga ao NIT) |
| `assets/inpi/Termo de Sigilo e Confidencialidade-1.docx` | Sim | Preencher (sigilo entre integrantes / PUC) |
| `assets/contribuicao_semanal/alunoX.md` | Sim | Substituir por 1 arquivo por aluno |
| `assets/atas/` | **Não** | Sem cliente externo; sem visita; sem atas formais |
| `assets/inpi/AtaAcordoInicialComClienteExterno.docx` | **Não** | Modelo errado para este projeto |

Partes interessadas e declaração de escopo: se a disciplina ainda pedir, criar markdown em `gerencia/` (hoje só existem no README). Senão, o TAP §5 cobre interessados.

## ✅ Critérios de Aceite

### Cenário 1 — Índice
**Então** `assets/README.md` descreve `/gerencia`, `/inpi` e `/contribuicao_semanal`; some ata 2020; `/atas` fica “não se aplica (sem cliente externo)” ou some do índice; `/inpi` cita só os três `.docx` usados.

### Cenário 2 — TAP
**Então** nome **Pulso**, os 5 alunos e 3 professores, tipo “desenvolvimento de novo produto”, **cliente = equipe / disciplina (PUC Minas)** — não empresa terceira. Escopo/contra-escopo alinhados à apresentação e aos epics (VA/VR, sem VT). Prazo da disciplina (não `9999`). §5 com time e professores.

### Cenário 3 — INPI (sem parceiro externo)
**Então** os três arquivos abaixo estão preenchidos com identidade Pulso e integrantes reais (não “Aluno 1”):
- `AtaAcordo-SemParceiroExterno.docx`
- `PROCURACAO_NIT_PUC_MINAS.docx`
- `Termo de Sigilo e Confidencialidade-1.docx`  
**Não** se preenche `AtaAcordoInicialComClienteExterno.docx`.

### Cenário 4 — Contribuição semanal
**Então** um `.md` por integrante (Matheus, Alice, Maria Clara, Sofia, Vinicius) no lugar de `alunoX.md`; semanas podem começar vazias, sem datas `01/01` de exemplo.

### Cenário 5 — Fora de escopo
**Então** esta feature **não** cria nem preenche atas em `assets/atas/` (abertura, sprint, visita ao cliente).

## 📋 Resumo

### ✅ Concluído
- Inventário de `assets/` e recorte sem cliente externo

### ⏳ Pendente
- Preencher TAP, três documentos INPI e logs por aluno; atualizar índices
