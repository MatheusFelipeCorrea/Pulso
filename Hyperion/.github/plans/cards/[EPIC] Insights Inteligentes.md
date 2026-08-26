# [EPIC] Insights Inteligentes — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-013 | Insights Inteligentes |
| Feature | PULSO-FEAT-070 | Provider Gemini Insights e configuração |
| Feature | PULSO-FEAT-071 | Agregação de contexto financeiro do usuário |
| Feature | PULSO-FEAT-072 | Score, projeções e alertas preditivos |
| Feature | PULSO-FEAT-073 | Geração LLM — resumo, sugestões e educação |
| Feature | PULSO-FEAT-074 | API, cache, job e regenerar |
| Feature | PULSO-FEAT-075 | Frontend — página Insights |
| Feature | PULSO-FEAT-076 | QA — testes de insights inteligentes |
| Task | PULSO-TASK-141–152 | Provider, contexto, score, LLM, API, frontend, QA |

---

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

---
---
card_id: PULSO-FEAT-070
title: "Provider Gemini Insights e configuração"
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
  - Integração Externa
  - Inteligência Artificial
---

# [FEATURE] Provider Gemini Insights e configuração

> **Contexto:** Isolar a chave/modelo de Insights do fluxo de PDF (RF-NOVO-I2).

## 📝 Descrição

Criar provider HTTP Gemini dedicado a insights, espelhando o padrão de `pdfParser` (`generativelanguage.googleapis.com/v1beta/...:generateContent`).

## ✅ Critérios de Aceite

| Variável | Papel |
|----------|-------|
| `GEMINI_API_KEY_INSIGHTS` | API key exclusiva de Insights (obrigatória para gerar) |
| `GEMINI_INSIGHTS_MODEL` | Default alinhado ao PDF (ex.: `gemini-3.1-flash-lite`) |

- `env.js` + `.env.example` documentados (seção separada da de PDF)
- Sem chave → `503` com mensagem clara (igual PDF)
- `responseMimeType: application/json` + temperature baixa/moderada
- Erros de cota/modelo com mensagens orientadas (reaproveitar padrão `parseGeminiError` do PDF)
- **Não** reutilizar `GEMINI_API_KEY_PDF` neste fluxo

## 🔗 Sub-issues

- PULSO-TASK-141

## 📋 Resumo

### ✅ Concluído
- Contrato de env e provider definido

### ⏳ Pendente
- PULSO-TASK-141 — provider + env

---
---
card_id: PULSO-FEAT-071
title: "Agregação de contexto financeiro do usuário"
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
  - Banco de Dados
  - Regra de Negócio
---

# [FEATURE] Agregação de contexto financeiro do usuário

> **Contexto:** Montar o “dossier” determinístico que alimenta o prompt — só dados do `usuarioId`.

## 📝 Descrição

Implementar builder de contexto + persistência do snapshot gerado.

## ✅ Critérios de Aceite

Contexto mínimo por mês de referência:

| Bloco | Conteúdo |
|-------|----------|
| Fluxo | Receitas/despesas mês atual e anteriores (3+ meses) |
| Categorias | Totais e ranking; comparação MoM |
| Estabelecimentos | Frequência/média por descrição (ex.: almoço, delivery) quando houver dados |
| Orçamento | Limites, % usado, estourados |
| Metas | Progresso, prazo, valor restante |
| Recursos | Saldos / ritmo VA-VR-VT se disponível |
| Perfil | `modoUso`, renda planejada (se houver) |

- Filtrar sempre por `usuarioId` (isolamento total)
- Snapshot persistido (model novo ou JSON em tabela dedicada) para cache/histórico
- Payload compacto o bastante para caber no prompt (agregados, não dump bruto de todas as linhas)

## 🔗 Sub-issues

- PULSO-TASK-142
- PULSO-TASK-143

## 📋 Resumo

### ✅ Concluído
- Shape do contexto definido

### ⏳ Pendente
- PULSO-TASK-142–143 — schema e builder

---
---
card_id: PULSO-FEAT-072
title: "Score, projeções e alertas preditivos"
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
  - Regra de Negócio
---

# [FEATURE] Score, projeções e alertas preditivos

> **Contexto:** Camada determinística (regras) que a IA interpreta e enriquece em linguagem natural.

**Refs:** RF-048 · RF-107 · RF-108 · RF-047 · RN-127 · RN-128

## 📝 Descrição

Calcular score 0–100, cenários de projeção e alertas estruturados antes/depois do LLM.

## ✅ Critérios de Aceite

### Score (RF-048 / RN-127)
- Fórmula documentada (base: fluxo, orçamento, metas — alinhar a `calcularSaudeFinanceira` do dashboard)
- Persistir em `HistoricoScore` (`score` + `detalhes` JSON)
- Job/recalc diário opcional; sempre recalcular na geração de insights

### Projeções (RF-107 / RN-128)
- Base: média 3 meses receitas/despesas
- Cenários: **otimista**, **atual**, **pessimista** em horizontes 3, 6 e 12 meses
- RF-108: `diasAteNegativo` no ritmo atual (ou `null` se não aplicável)

### Alertas (RF-047)
- Cobertura de recurso/orçamento (ex.: VA no ritmo atual)
- Meta dentro/fora do prazo
- Estrutura: `{ tipo, severidade, mensagem, entidadeId? }`

## 🔗 Sub-issues

- PULSO-TASK-144
- PULSO-TASK-145

## 📋 Resumo

### ✅ Concluído
- Regras de score/projeção/alerta mapeadas

### ⏳ Pendente
- PULSO-TASK-144–145 — engines determinísticos

---
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

---
---
card_id: PULSO-FEAT-074
title: "API, cache, job e regenerar"
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
  - Notificações
  - Regra de Negócio
---

# [FEATURE] API, cache, job e regenerar

> **Contexto:** Expor insights via HTTP, controlar custo e disparar geração mensal.

**Refs:** RN-125 · RN-126

## 📝 Descrição

Endpoints autenticados, cache mensal, regeneração com cota e job de fim de mês.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| GET | `/insights` | Retorna snapshot do mês (`?mes=YYYY-MM`); se ausente, gera ou 404 conforme política |
| GET | `/insights/score` | Score atual + histórico recente |
| POST | `/insights/regenerar` | Força nova geração (cota N/mês); invalida cache |

- Auto: job mensal (RN-125) independente de registrar transação
- Regenerar: permitido sob demanda com limite (ex.: 3/mês) — **não** bloquear após 1 geração automática (corrige `jaGerouInsightNoMes` atual)
- Notificação `INSIGHT_IA` com `geradoPor: 'gemini'`, `linkAcao: '/insights'`
- Sem chave Insights → endpoints degradam com 503 (ou fallback só score/regras, documentado)
- Substituir/encurtar efeito colateral em `transactionService` (não depender só dele)

## 🔗 Sub-issues

- PULSO-TASK-148
- PULSO-TASK-149

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP e política de cota definidos

### ⏳ Pendente
- PULSO-TASK-148–149 — API e job

---
---
card_id: PULSO-FEAT-075
title: "Frontend — página Insights"
status: Backlog
type: Feature
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-013
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Frontend — página Insights

> **Contexto:** Substituir `InDevelopmentPage` em `/insights` por painel completo.

**Refs:** RF-044–048 · RF-107–108 · RF-143 · RF-NOVO-I1

## 📝 Descrição

Implementar UI do painel personalizado e ações de regenerar.

## ✅ Critérios de Aceite

- Rota `/insights` autenticada (já no sidebar)
- Seções: resumo, variação categorias, gauge de score, projeções (3 cenários), sugestões, alertas, educação
- Seletor de mês; empty state se poucos dados
- Botão Regenerar (loading + toast cota/erro 503)
- Cards educativos com deep-link externo (`rel="noopener noreferrer"`)
- Client `insightsService.js` + `insights.css`
- Estados: loading, erro Gemini, sem chave, sucesso

## 🔗 Sub-issues

- PULSO-TASK-150
- PULSO-TASK-151

## 📋 Resumo

### ✅ Concluído
- Mapa de UI definido

### ⏳ Pendente
- PULSO-TASK-150–151 — página e componentes

---
---
card_id: PULSO-FEAT-076
title: "QA — testes de insights inteligentes"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-013
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [FEATURE] QA — testes de insights inteligentes

> **Contexto:** Regressão para contexto, score, projeções, provider mock e UI.

## 📝 Descrição

Suites unitárias com Gemini mockado (sem chamada real).

## 🔗 Sub-issues

- PULSO-TASK-152

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- PULSO-TASK-152 — implementar suites

---
---
card_id: PULSO-TASK-141
title: "Backend — geminiInsightsProvider e env"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-070
due_date: null
categories:
  - Backend
  - Integração Externa
  - Inteligência Artificial
---

# [TASK] Backend — geminiInsightsProvider e env

> **Contexto:** Chave/modelo Insights separados do PDF (RF-NOVO-I2).

## 📝 Descrição

Configurar env e provider HTTP Gemini para insights.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `config/env.js` | `GEMINI_API_KEY_INSIGHTS`, `GEMINI_INSIGHTS_MODEL` (default flash-lite) |
| `.env.example` | Seção `# 🤖 GOOGLE GEMINI — insights` |
| `providers/geminiInsightsProvider.js` | `generateInsightsJson({ systemPrompt, userPayload })` |

Espelhar `pdfParser`: URL `.../v1beta/models/{model}:generateContent`, `responseMimeType: application/json`, tratamento 429/404 de modelo.

**Não** usar `GEMINI_API_KEY_PDF` neste provider.

## 📋 Resumo

### ✅ Concluído
- Padrão PDF → Insights documentado

### ⏳ Pendente
- Implementar provider e env

---
---
card_id: PULSO-TASK-142
title: "Banco de dados — snapshot de insights"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-071
due_date: null
categories:
  - Banco de Dados
---

# [TASK] Banco de dados — snapshot de insights

> **Contexto:** Persistir painel gerado por mês (cache + histórico).

## 📝 Descrição

Criar model de snapshot e reutilizar `HistoricoScore`.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

**Model sugerido `InsightSnapshot`:**

| Campo | Notas |
|-------|-------|
| usuarioId | FK |
| mesReferencia | Date (@db.Date) 1º dia do mês |
| payload | Json — resposta validada do painel |
| geradoPor | `gemini` \| `regras` \| `hibrido` |
| regeneracoesNoMes | Int default 0 |
| contextoHash | String? — invalidação opcional |
| criadoEm / atualizadoEm | timestamps |

`@@unique([usuarioId, mesReferencia])`

Reusar `HistoricoScore` para série temporal do score (já existe no schema).

**Migration:** `add_insight_snapshots`

## 📋 Resumo

### ✅ Concluído
- Spec de persistência definida

### ⏳ Pendente
- Criar model + migration

---
---
card_id: PULSO-TASK-143
title: "Backend — insightContextBuilder"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-071
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — insightContextBuilder

> **Contexto:** Agregar só dados do usuário para o prompt.

## 📝 Descrição

Implementar builder determinístico de contexto mensal.

## 🛠️ Implementação

### `services/insightContextBuilder.js` (NOVO — CRIAR)

| Seção | Fonte |
|-------|-------|
| `fluxo` | Transações RECEITA/DESPESA — mês atual + 3 anteriores |
| `categorias` | groupBy categoria; MoM |
| `estabelecimentos` | Top descrições DESPESA (frequência, média, min) — base para sugestões tipo “almoçar em X” |
| `orcamento` | Status do mês (`budgetService` / repository) |
| `metas` | Ativas: progresso, prazo, restante |
| `recursos` | Saldos / ritmo VT-VA-VR se disponível |
| `perfil` | modoUso, rendaMensalPlanejada |

Sempre `where: { usuarioId }`. Retornar objeto serializável e enxuto (agregados).

## 📋 Resumo

### ✅ Concluído
- Mapa de fontes definido

### ⏳ Pendente
- Implementar builder

---
---
card_id: PULSO-TASK-144
title: "Backend — score de saúde e HistoricoScore"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-072
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — score de saúde e HistoricoScore

> **Contexto:** RF-048 / RN-127 — score 0–100 persistido.

## 📝 Descrição

Extrair/evoluir cálculo de saúde financeira e gravar histórico.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR / REUSAR)

| Item | Função |
|------|--------|
| `services/financialHealthService.js` | `calcularScore(usuarioId, mes)` — documentar pesos |
| Base | Alinhar a `dashboardService.calcularSaudeFinanceira` (fluxo, orçamento, metas) |
| Persistência | `HistoricoScore.create({ score, detalhes })` |
| Job opcional | Recalc diário (RN-127) via cron |

`detalhes`: checklist, fatores, label (Excelente/Bom/Regular/Atenção).

## 📋 Resumo

### ✅ Concluído
- Faixas de score alinhadas ao dashboard UI

### ⏳ Pendente
- Implementar service + persistência

---
---
card_id: PULSO-TASK-145
title: "Backend — projeções e alertas determinísticos"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-072
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — projeções e alertas determinísticos

> **Contexto:** RF-107–108 / RF-047 / RN-128 — números antes da narrativa da IA.

## 📝 Descrição

Calcular cenários e alertas estruturados a partir do contexto.

## 🛠️ Implementação

### `utils/insightProjectionUtils.js` + `insightAlertUtils.js` (NOVO — CRIAR)

**Projeções**
- Base = média 3 meses (receita/despesa)
- Otimista: −gasto / +receita (fatores documentados, ex. −10% / +5%)
- Atual: ritmo médio
- Pessimista: +gasto / −receita
- Horizontes: 3, 6, 12 meses (saldo projetado)
- `diasAteNegativo` no cenário atual

**Alertas**
- Orçamento/categoria perto do limite
- Meta com ritmo insuficiente para o prazo
- Recurso (VA/VR/VT) com esgotamento previsto

Saída tipada para o prompt e para a UI (mesmo sem Gemini).

## 📋 Resumo

### ✅ Concluído
- Fórmulas documentadas

### ⏳ Pendente
- Implementar utils de projeção/alerta

---
---
card_id: PULSO-TASK-146
title: "Backend — prompt e orquestração generateInsights"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-073
due_date: null
categories:
  - Backend
  - Inteligência Artificial
---

# [TASK] Backend — prompt e orquestração generateInsights

> **Contexto:** Montar prompt, chamar provider e validar JSON (RF-044+).

## 📝 Descrição

Implementar orquestrador principal de geração.

## 🛠️ Implementação

### `services/insightGenerationService.js` (NOVO — CRIAR)

1. `buildContext` + score + projeções + alertas
2. Montar system prompt (PT-BR, só finanças do usuário, schema JSON fixo)
3. `geminiInsightsProvider.generateInsightsJson`
4. Validar/normalizar campos (Zod schema)
5. Merge: preferir números determinísticos de score/projeção; LLM narra e sugere
6. Salvar `InsightSnapshot`; notificar `INSIGHT_IA`

Fallback se Gemini falhar: painel parcial só com regras (score + projeções + alerta simples), `geradoPor: 'regras'|'hibrido'`.

Substituir conteúdo de `insightService.js` legado (maior gasto) ou delegar a este fluxo.

## 📋 Resumo

### ✅ Concluído
- Pipeline de geração definido

### ⏳ Pendente
- Implementar orquestração + validação

---
---
card_id: PULSO-TASK-147
title: "Backend — sugestões e conteúdo educativo no prompt"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-073
due_date: null
categories:
  - Backend
  - Inteligência Artificial
  - Regra de Negócio
---

# [TASK] Backend — sugestões e conteúdo educativo no prompt

> **Contexto:** RF-046 + RF-NOVO-I1 — economia acionável e estudo financeiro.

## 📝 Descrição

Especificar no prompt exemplos e regras para sugestões e bloco `educacao[]`.

## 🛠️ Implementação

### Instruções ao modelo (NOVO — CRIAR no prompt)

**Sugestões (exemplos de estilo)**
- “Você almoçou em X com média R$ A; em Y a média foi R$ B (−Z%). Considere ir mais a Y.”
- “Delivery representa P% das despesas de Alimentação — reduzir Q% economizaria ~R$ R/mês.”
- Só citar estabelecimentos presentes no contexto.

**Educação `educacao[]`**
- Tipos: `instagram` | `youtube` | `artigo` | `perfil`
- Campos: `titulo`, `url`, `motivo` (por que serve a *este* usuário)
- Personalizar: alto endividamento → conteúdo de dívidas; metas fracas → planejamento; freelancer → reserva/imposto
- Preferir fontes reconhecíveis; evitar inventar handles — se incerto, omitir ou flag `verificarUrl`

Incluir exemplos few-shot no system prompt + schema Zod dos arrays.

## 📋 Resumo

### ✅ Concluído
- Estilo de sugestão/educação definido

### ⏳ Pendente
- Embutir no prompt e validar schema

---
---
card_id: PULSO-TASK-148
title: "Backend — rotas /insights e regenerar"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-074
due_date: null
categories:
  - Backend
  - Regra de Negócio
---

# [TASK] Backend — rotas /insights e regenerar

> **Contexto:** API autenticada + cota de regeneração (RN-126).

## 📝 Descrição

Expor controllers, schemas e políticas de cache/cota.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `routes/insightRoutes.js` | Montar em `/insights` |
| `controllers/insightController.js` | Handlers |
| `schemas/insightSchemas.js` | query mes, regenerar |
| `repositories/insightRepository.js` | CRUD snapshot |

| Rota | Regra |
|------|-------|
| GET `/` | Snapshot do mês; gera sob demanda se vazio (flag config) |
| GET `/score` | Último score + últimos N de `HistoricoScore` |
| POST `/regenerar` | Incrementa `regeneracoesNoMes`; 429 se excedeu cota (ex. 3) |

Remover trava “1 insight/mês impede tudo” do service legado.

## 📋 Resumo

### ✅ Concluído
- Contratos HTTP definidos

### ⏳ Pendente
- Implementar rotas e cota

---
---
card_id: PULSO-TASK-149
title: "Backend — job mensal e wire no cron"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-074
due_date: null
categories:
  - Backend
  - Notificações
---

# [TASK] Backend — job mensal e wire no cron

> **Contexto:** RN-125 — geração automática sem depender de lançar transação.

## 📝 Descrição

Job que gera insights do mês para usuários ativos e opcionalmente recalcula score.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `jobs/insightGenerationJob.js` | Para cada usuário com atividade recente: gerar se sem snapshot do mês |
| Cron | Incluir em `cronController` daily (ou schedule mensal dedicado) |
| Score | Opcional: `financialHealthJob` diário (RN-127) |

Política: pular se `GEMINI_API_KEY_INSIGHTS` ausente (log warn); não falhar o batch inteiro se 1 usuário falhar.

Desacoplar `tentarGerarInsightAposTransacao` (manter no máximo notificação leve ou remover).

## 📋 Resumo

### ✅ Concluído
- Política de job definida

### ⏳ Pendente
- Implementar job + cron

---
---
card_id: PULSO-TASK-150
title: "Frontend — InsightsPage e client"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-075
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — InsightsPage e client

> **Contexto:** Página `/insights` orquestrando o painel.

## 📝 Descrição

Implementar página e serviço HTTP.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/InsightsPage.jsx` | Load snapshot; mês; regenerar |
| `services/insightsService.js` | GET painel, GET score, POST regenerar |
| Rota | `App.jsx` → `/insights` (trocar `InDevelopmentPage`) |

Estados: loading, empty (poucos dados), 503 Gemini, erro genérico, sucesso.

## 📋 Resumo

### ✅ Concluído
- Fluxos da página especificados

### ⏳ Pendente
- Implementar página e client

---
---
card_id: PULSO-TASK-151
title: "Frontend — seções do painel e CSS"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-075
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — seções do painel e CSS

> **Contexto:** Componentes visuais do insight personalizado.

## 📝 Descrição

Implementar cards/seções e estilos responsivos.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR) em `features/insights/`

| Componente | Função |
|------------|--------|
| `InsightSummaryCard` | Resumo mensal |
| `InsightCategoryVariance` | MoM por categoria |
| `InsightScoreGauge` | Score 0–100 (reusar ideia do dashboard health) |
| `InsightProjectionCharts` | Otimista / atual / pessimista |
| `InsightSuggestionsList` | Sugestões de economia |
| `InsightAlertsList` | Alertas cobertura/metas |
| `InsightEducationList` | Links Instagram/YouTube/artigos |
| `InsightRegenerateButton` | CTA + cota restante |

`styles/insights.css` — layout mobile-first.

## 📋 Resumo

### ✅ Concluído
- Mapa de seções definido

### ⏳ Pendente
- Implementar componentes e CSS

---
---
card_id: PULSO-TASK-152
title: "QA — testes de insights inteligentes"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-076
due_date: null
categories:
  - QA / Testes
  - Backend
  - Frontend
  - Web
---

# [TASK] QA — testes de insights inteligentes

> **Contexto:** Regressão com Gemini mockado.

## 📝 Descrição

Suites unitárias API/Web sem chamada real à Google.

## 🛠️ Implementação

### API — `api/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/providers/geminiInsightsProvider.test.js` | 503 sem chave; parse JSON |
| `unit/services/insightContextBuilder.test.js` | Isolamento usuarioId; agregados |
| `unit/utils/insightProjectionUtils.test.js` | 3 cenários; diasAteNegativo |
| `unit/services/insightGenerationService.test.js` | Validação schema; cota regenerar; fallback |
| `unit/services/financialHealthService.test.js` | Score faixas |

### Web — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/services/insightsService.test.js` | HTTP client |

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- Escrever/expandir suites

---
