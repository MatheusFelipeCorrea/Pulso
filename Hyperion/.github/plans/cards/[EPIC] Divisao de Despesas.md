# [EPIC] Divisão de Despesas — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-011 | Divisão de Despesas |
| Feature | PULSO-FEAT-058 | Backend — API core de divisões |
| Feature | PULSO-FEAT-059 | Rateio igual e personalizado |
| Feature | PULSO-FEAT-060 | Pagamentos, quitação e saldo |
| Feature | PULSO-FEAT-061 | Lembrete de cobrança e limpeza |
| Feature | PULSO-FEAT-062 | Frontend — página e componentes |
| Feature | PULSO-FEAT-063 | QA — testes de divisão de despesas |
| Task | PULSO-TASK-117–128 | DB, rateio, pagamentos, lembrete, frontend, QA |

---

---
card_id: PULSO-EPIC-011
title: "Divisão de Despesas"
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
  - Banco de Dados
  - Regra de Negócio
  - Notificações
---

# [EPIC] Divisão de Despesas

> **Contexto:** Split bill standalone — despesa compartilhada com participantes por nome livre, rateio igual ou personalizado, “quem paga quem”, saldo consolidado e lembrete de cobrança no calendário.

**Refs:** RF-115–120 · RN-081–086 · RNF-016

## 🎯 Objetivos

- Registrar despesa compartilhada com valor total e participantes (RF-115, RN-081)
- Calcular quanto cada um deve — igualitário ou personalizado (RF-116–117, RN-082–083)
- Organizador (“Você”) incluído automaticamente (RN-084)
- Marcar/desmarcar quem já pagou a parte (RF-118)
- Auto-quitar quando todos pagos; reabrir se desmarcar (RN-085)
- Saldo consolidado: me devem vs eu devo (RF-119)
- Lembrete de cobrança via módulo Lembretes, N:N com participantes (RF-120, RN-086)
- Rateio em centavos inteiros determinístico (RNF-016)
- Job limpa quitadas com +180 dias; excluir ATIVA remove lembretes órfãos

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/expense-split` | Divisão de Despesas | Criar/editar, pagar, lembrete, histórico paginado |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Lembretes | `criarLembreteCobranca` → `reminderService`; M2M `_DivisaoParticipanteToLembrete` |
| Google Agenda | Sync herdado do M07 (falha preserva `sincronizado: false`) |
| Grupos / RF-095 | Integração toggle viagem ↔ `/expense-split` — evolução futura |

## 🔗 Sub-issues

- PULSO-FEAT-058
- PULSO-FEAT-059
- PULSO-FEAT-060
- PULSO-FEAT-061
- PULSO-FEAT-062
- PULSO-FEAT-063

## 📋 Resumo

### ✅ Concluído
- Escopo RF-115–120 e RN-081–086 mapeado
- Hierarquia Epic → 6 Features → 12 Tasks definida

### ⏳ Pendente
- Implementar módulo completo backend + frontend
- Vincular toggle RF-095 (Grupos) a este módulo — evolução futura

---
---
card_id: PULSO-FEAT-058
title: "Backend — API core de divisões"
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
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Backend — API core de divisões

> **Contexto:** CRUD e listagens autenticadas em `/api/divisoes`.

**Refs:** RF-115 · RN-081 · RN-084

## 📝 Descrição

Expor endpoints para criar, editar, listar ativas/histórico e excluir divisões.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/divisoes/ativas` | Lista ATIVAS do usuário |
| GET | `/divisoes/historico` | Quitadas paginadas |
| POST | `/divisoes` | Criar com participantes + `pagoPor` |
| PATCH | `/divisoes/:id` | Editar; bloqueia se QUITADA ou pagamento manual ao trocar participantes |
| DELETE | `/divisoes/:id` | Só ATIVA; remove lembretes vinculados |

Participantes por nome livre; organizador “Você” sempre incluso (RN-084)

## 🔗 Sub-issues

- PULSO-TASK-117
- PULSO-TASK-118
- PULSO-TASK-120

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- PULSO-TASK-117–120 — DB, repository e CRUD

---
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

---
---
card_id: PULSO-FEAT-060
title: "Pagamentos, quitação e saldo"
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

# [FEATURE] Pagamentos, quitação e saldo

> **Contexto:** Marcar partes pagas, auto-quitar e consolidar quanto me devem / eu devo.

**Refs:** RF-118 · RF-119 · RN-085

## 📝 Descrição

Implementar toggle de pagamento por participante e endpoint de resumo.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| PATCH | `/:id/participantes/:pid/pagar` | Marca PAGO; sincroniza status |
| PATCH | `/:id/participantes/:pid/despagar` | Volta PENDENTE; reabre se QUITADA |
| GET | `/divisoes/resumo` | `meDevem`, `euDevo`, `saldo`, `possuiDivisoes` |

**RN-085:** todos PAGO → QUITADA; desmarcar → ATIVA

Bloqueios: não despagar quem `pagouAConta`; não pagar duas vezes

**Resumo:** se organizador pagou a conta → soma pendentes dos outros = meDevem; se organizador pendente → euDevo

## 🔗 Sub-issues

- PULSO-TASK-121
- PULSO-TASK-122

## 📋 Resumo

### ✅ Concluído
- Fluxos RF-118/119 definidos

### ⏳ Pendente
- PULSO-TASK-121–122 — pagamentos e resumo

---
---
card_id: PULSO-FEAT-061
title: "Lembrete de cobrança e limpeza"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-011
due_date: null
categories:
  - Backend
  - Notificações
  - Regra de Negócio
---

# [FEATURE] Lembrete de cobrança e limpeza

> **Contexto:** RF-120 cria Lembrete real; job remove quitadas antigas.

**Refs:** RF-120 · RN-086

## 📝 Descrição

Criar lembrete de cobrança para 1+ pendentes e limpar histórico antigo.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| POST | `/:id/lembrete` | Lembrete cobrindo participantes pendentes selecionados |

- Não criar para quem já pagou / pagou a conta
- Um participante não pode ter 2 lembretes ativos
- Cancelar lembrete quando todos cobertos quitam
- Excluir divisão remove lembretes vinculados
- Job diário: excluir QUITADA com `quitadaEm` > 180 dias
- Excluir QUITADA manualmente → 400 (só limpeza automática)

## 🔗 Sub-issues

- PULSO-TASK-123
- PULSO-TASK-124

## 📋 Resumo

### ✅ Concluído
- Fluxos lembrete e retenção definidos

### ⏳ Pendente
- PULSO-TASK-123–124 — lembrete e job

---
---
card_id: PULSO-FEAT-062
title: "Frontend — página e componentes"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-011
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — página e componentes

> **Contexto:** UI `/expense-split` com resumo, ativas, histórico e modais.

**Refs:** RF-115–120

## 📝 Descrição

Implementar página, cards, histórico e fluxos de criar/pagar/lembrar/excluir.

## ✅ Critérios de Aceite

- Rota autenticada `/expense-split`
- `ExpenseSplitSummaryCards` — meDevem / euDevo / saldo
- Lista de ativas + histórico paginado
- Modais: form (igual/personalizado), detalhes (pagar/despagar), lembrete, delete
- Client `expenseSplitService.js` + `expense-split.css`

## 🔗 Sub-issues

- PULSO-TASK-125
- PULSO-TASK-126
- PULSO-TASK-127

## 📋 Resumo

### ✅ Concluído
- Mapa de UI definido

### ⏳ Pendente
- PULSO-TASK-125–127 — página, listas e modais

---
---
card_id: PULSO-FEAT-063
title: "QA — testes de divisão de despesas"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-011
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de divisão de despesas

> **Contexto:** Regressão para rateio, pagamentos, lembrete e cleanup.

## 📝 Descrição

Implementar suites unitárias API e Web do módulo.

## 🔗 Sub-issues

- PULSO-TASK-128

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- PULSO-TASK-128 — implementar suites

---
---
card_id: PULSO-TASK-117
title: "Banco de dados — Divisao e participantes"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-058
due_date: null
categories:
  - Banco de Dados
---

# [TASK] Banco de dados — Divisao e participantes

> **Contexto:** Persistência de divisões, participantes e vínculo N:N com lembretes.

## 📝 Descrição

Criar models Prisma, enums e migrations.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

| Model | Campos principais |
|-------|-------------------|
| `Divisao` | titulo, valorTotal, tipo, status, data, icone, cor, observacao, quitadaEm |
| `DivisaoParticipante` | nome, valor, ehOrganizador, pagouAConta, status, dataPagamento |

**Enums:** `TipoRateioDivisao` (IGUAL, PERSONALIZADA), `StatusDivisao`, `StatusParticipanteDivisao`

**M2M:** `Lembrete.divisaoParticipantes` ↔ tabela `_DivisaoParticipanteToLembrete`

**Migrations:** `20260714163000_add_expense_split_module`, `20260715130000_lembrete_divisao_m2m`

## 📋 Resumo

### ✅ Concluído
- Spec models definida

### ⏳ Pendente
- Criar/aplicar migrations

---
---
card_id: PULSO-TASK-118
title: "Backend — expenseSplitRepository e mapper"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-058
due_date: null
categories:
  - Backend
  - Banco de Dados
---

# [TASK] Backend — expenseSplitRepository e mapper

> **Contexto:** Persistência Prisma e DTOs de divisão/participante.

## 📝 Descrição

Implementar repository e mapper.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `repositories/expenseSplitRepository.js` | CRUD, listar ativas/histórico, participantes, lembretes, cleanup |
| `utils/expenseSplitMapper.js` | `mapDivisao`, `mapParticipante` |

Include participantes; `pagador` derivado de `pagouAConta`.

## 📋 Resumo

### ✅ Concluído
- Shape DTO definido

### ⏳ Pendente
- Implementar repository e mapper

---
---
card_id: PULSO-TASK-119
title: "Backend — expenseSplitUtils (centavos)"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-059
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — expenseSplitUtils (centavos)

> **Contexto:** Rateio determinístico em centavos inteiros (RNF-016).

## 📝 Descrição

Implementar utilitários puros de split.

## 🛠️ Implementação

### `utils/expenseSplitUtils.js` (NOVO — CRIAR)

| Função | Comportamento |
|--------|---------------|
| `splitEqual(valorTotal, n)` | floor centavos; resto +1 nos primeiros índices |
| `validarSomaPersonalizada(total, valores)` | soma centavos === total centavos |

Usar `roundMoney` de `debtBalanceUtils` na conversão.

## 📋 Resumo

### ✅ Concluído
- Algoritmo RNF-016 documentado

### ⏳ Pendente
- Implementar utils

---
---
card_id: PULSO-TASK-120
title: "Backend — service CRUD e rotas"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-058
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — service CRUD e rotas

> **Contexto:** Criar/editar/listar/excluir com `construirParticipantes`.

## 📝 Descrição

Implementar service core, schemas, controller e rotas.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `services/expenseSplitService.js` | `criarDivisao`, `editarDivisao`, listagens, `excluirDivisao` |
| `schemas/expenseSplitSchemas.js` | Zod criar/editar/query/params |
| `controllers/expenseSplitController.js` | Handlers |
| `routes/expenseSplitRoutes.js` | Montar em `/divisoes` |

**construirParticipantes:** inclui “Você”; aplica IGUAL/PERSONALIZADA; resolve `pagoPor`

Editar participantes bloqueado se já houver pagamento manual.

## 📋 Resumo

### ✅ Concluído
- Fluxos CRUD especificados

### ⏳ Pendente
- Implementar service e HTTP

---
---
card_id: PULSO-TASK-121
title: "Backend — marcar/desmarcar pago e quitação"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-060
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — marcar/desmarcar pago e quitação

> **Contexto:** RF-118 / RN-085 — ciclo de pagamento e status da divisão.

## 📝 Descrição

Implementar pagar/despagar e `sincronizarStatusDivisao`.

## 🛠️ Implementação

### Funções (NOVO — CRIAR)

| Função | Regra |
|--------|-------|
| `marcarParticipantePago` | Status PAGO + dataPagamento; cancela lembretes se todos cobertos quitados |
| `desmarcarParticipantePago` | Volta PENDENTE; não aplica a `pagouAConta` |
| `sincronizarStatusDivisao` | Todos PAGO → QUITADA; senão reabre ATIVA |

Rotas PATCH `.../pagar` e `.../despagar`.

## 📋 Resumo

### ✅ Concluído
- Regras RN-085 documentadas

### ⏳ Pendente
- Implementar pagamentos e sync

---
---
card_id: PULSO-TASK-122
title: "Backend — saldo consolidado (resumo)"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-060
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — saldo consolidado (resumo)

> **Contexto:** RF-119 — quanto me devem vs quanto eu devo nas ativas.

## 📝 Descrição

Implementar `GET /divisoes/resumo` via `calcularResumo`.

## 🛠️ Implementação

### Lógica

Para cada divisão ATIVA:

| Situação do organizador | Efeito |
|-------------------------|--------|
| `pagouAConta` | Soma valores dos outros PENDENTE → `meDevem` |
| status PENDENTE | Soma valor do organizador → `euDevo` |

Retorno: `{ meDevem, euDevo, saldo: meDevem − euDevo, possuiDivisoes }`

## 📋 Resumo

### ✅ Concluído
- Fórmula RF-119 definida

### ⏳ Pendente
- Implementar calcularResumo

---
---
card_id: PULSO-TASK-123
title: "Backend — lembrete de cobrança (RF-120)"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-061
due_date: null
categories:
  - Backend
  - Notificações
  - Regra de Negócio
---

# [TASK] Backend — lembrete de cobrança (RF-120)

> **Contexto:** RN-086 — cria Lembrete de calendário para 1+ pendentes.

## 📝 Descrição

Implementar `POST /:id/lembrete` e cancelamento automático.

## 🛠️ Implementação

### `criarLembreteCobranca` (NOVO — CRIAR)

1. Validar participantes pendentes (não `pagouAConta` / PAGO)
2. Bloquear se já houver lembrete ativo no participante
3. `reminderService.criarLembrete` — título default `Cobrar {nomes} — {titulo}`
4. Vincular M2M aos participantes
5. Vencimento default: +2 dias; valor = soma das partes

**cancelarLembretesQuitados:** marca lembrete como pago quando todos cobertos quitam

## 📋 Resumo

### ✅ Concluído
- Fluxo RF-120 / RN-086 documentado

### ⏳ Pendente
- Implementar lembrete de cobrança

---
---
card_id: PULSO-TASK-124
title: "Backend — exclusão e cleanup 180 dias"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-061
due_date: null
categories:
  - Backend
---

# [TASK] Backend — exclusão e cleanup 180 dias

> **Contexto:** Remover lembretes órfãos e limpar quitadas antigas.

## 📝 Descrição

Implementar exclusão segura e job de retenção.

## 🛠️ Implementação

### Arquivos / funções (NOVO — CRIAR)

| Item | Comportamento |
|------|---------------|
| `excluirDivisao` | Bloqueia QUITADA; remove lembretes via `reminderService.removerLembrete` |
| `jobs/expenseSplitCleanupJob.js` | `excluirQuitadasAntigas(180)` |
| Cron / server | Registrar job diário |

Constante: `DIAS_RETENCAO_QUITADAS = 180`

## 📋 Resumo

### ✅ Concluído
- Política de retenção definida

### ⏳ Pendente
- Implementar exclusão e job

---
---
card_id: PULSO-TASK-125
title: "Frontend — ExpenseSplitPage e client"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-062
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — ExpenseSplitPage e client

> **Contexto:** Página `/expense-split` orquestrando resumo, ativas e histórico.

## 📝 Descrição

Implementar página e serviço HTTP.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/ExpenseSplitPage.jsx` | Load resumo/ativas/histórico; modais |
| `services/expenseSplitService.js` | resumo, ativas, historico, CRUD, pagar, lembrete |
| Rota | `App.jsx` → `/expense-split`; sidebar + `appRoutes.js` |

Paginação do histórico; empty states quando sem divisões.

## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar página e client

---
---
card_id: PULSO-TASK-126
title: "Frontend — cards, resumo e histórico"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-062
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — cards, resumo e histórico

> **Contexto:** Componentes de lista e saldo consolidado.

## 📝 Descrição

Implementar cards de resumo, ativas e linhas de histórico.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `ExpenseSplitSummaryCards.jsx` | meDevem / euDevo / saldo |
| `ExpenseSplitCard.jsx` | Divisão ativa; ações rápidas |
| `ExpenseSplitHistoryRow.jsx` | Item quitado |
| `utils/expenseSplitUtils.js` | `getParticipantesVisiveis` e helpers UI |

## 📋 Resumo

### ✅ Concluído
- Componentes RF-119 mapeados

### ⏳ Pendente
- Implementar cards e histórico

---
---
card_id: PULSO-TASK-127
title: "Frontend — modais e CSS"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-062
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — modais e CSS

> **Contexto:** Formulário, detalhes, lembrete, exclusão e estilos.

## 📝 Descrição

Implementar modais do módulo e folha de estilos.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `ExpenseSplitFormModal.jsx` | Criar/editar; tipo IGUAL/PERSONALIZADA; pagoPor |
| `ExpenseSplitDetailsModal.jsx` | Lista participantes; pagar/despagar |
| `ExpenseSplitReminderModal.jsx` | Selecionar pendentes → RF-120 |
| `DeleteExpenseSplitModal.jsx` | Confirmar exclusão |
| `styles/expense-split.css` | Layout, cards, histórico, mobile |

## 📋 Resumo

### ✅ Concluído
- Mapa de modais definido

### ⏳ Pendente
- Implementar modais e CSS

---
---
card_id: PULSO-TASK-128
title: "QA — testes de divisão de despesas"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-063
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes de divisão de despesas

> **Contexto:** Regressão para rateio, pagamentos, lembrete e cleanup.

## 📝 Descrição

Implementar suites unitárias API e Web.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/expenseSplitUtils.test.js` | splitEqual resto centavos; soma personalizada |
| `unit/utils/expenseSplitMapper.test.js` | mapDivisao / pagador |
| `unit/services/expenseSplitService.test.js` | CRUD, pagar, resumo, lembrete, excluir |
| `unit/jobs/expenseSplitCleanupJob.test.js` | retenção 180 dias |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/utils/expenseSplitUtils.test.js` | helpers UI |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites

---
