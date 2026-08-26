# 📅 Módulo 16 — Calendário Financeiro — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [10-Perfil-e-Configuracoes.md](./10-Perfil-e-Configuracoes.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-121–125), `RegrasDeNegocio.md` (RN-100).
> Código auditado: `api/src/services/calendarService.js`, `api/src/utils/fixedIncomeUtils.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README **✅ 5/5**, confirmado. RN-100 respeitada. **Sem correções de código neste módulo** — dependência do Módulo 10 (`modoUso` configurável) permanece no roadmap.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status |
|---|---|---|
| RF-121 | Calendário mensal com marcadores | ✅ |
| RF-122 | Diferenciar receitas/despesas/ambos | ✅ (dados no backend) |
| RF-123 | Dias de recebimento fixo | ✅ (condicionado por `modoUso`) |
| RF-124 | Vencimentos/lembretes | ✅ |
| RF-125 | Detalhe ao clicar no dia | ✅ |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

Experiência de calendário bem resolvida. Gaps de `modoUso` (Estagiário/PJ/PF) são herança do **Módulo 10**, não deste módulo.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Confirmado — RN-100

Somente transações registradas + lembretes futuros — sem projeções fictícias.

### Dependência Módulo 10

`fixedIncomeUtils` implementa matriz VA/VR por `modoUso` (sem VT no calendário); em produção quase todos os usuários permanecem em `CLT` até haver tela de perfil.

### Positivo — `buildVariacao` reaproveitável (M09)

Evita divisão por zero (RN-155 futura) — extrair para util compartilhado se outros módulos precisarem da mesma fórmula.

### Resiliência

| Cenário | Resiliente? |
|---|---|
| Dia 31 em fevereiro | ✅ `clampDiaMes` |
| Mês anterior sem transações | ✅ `buildVariacao` |
| Dia vazio | ✅ Estrutura coerente |

---

## 4. 💡 Novos Requisitos Propostos

Nenhum RF/RNF novo — ações no M09 (reuso `buildVariacao`) e M10 (`modoUso`).

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status |
|---|---|---|
| 1 | Reaproveitar `buildVariacao` no M09 | 🟢 Pendente (M09) |
| 2 | Configurar `modoUso` no M10 | 🟢 Pendente (M10) |

---

*Próximo módulo sugerido: 17 — Dívidas Pessoais.*
