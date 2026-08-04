# 🚌 Módulo 08 — Gestão de Vale Transporte — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-059–066), `RegrasDeNegocio.md` (RN-013, RN-040–045).
> Código auditado: `api/src/services/transportService.js`, `api/src/repositories/transportRepository.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **✅ 6/6**. Funcionalidade central confirmada. **Decisão de produto B (ago/2026):** CLT pode registrar venda de VT **com aviso** — por conta e responsabilidade do usuário. RN-013, RN-040 e RN-045 reescritas para refletir isso; `MSG_CLT_WARNING` reforçada; frontend exibe `toast.warning`. **Correção RNF-NOVO-H1:** transações Serializable em venda/uso VT (`transportRepository.js`).

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-059 | Registrar valor mensal recebido de VT | ✅ | Confirmado — calculado a partir de `configuracoes_usuario.valor_vt` via `periodUtils` |
| RF-060 | Registrar uso real do VT | ✅ | Confirmado, `registrarUsoVt` — transação Serializable |
| RF-061 | Registrar venda de VT (comprador, data, nominal, recebido) | ✅ | Confirmado, `registrarVendaVt` — CLT recebe aviso, não bloqueio (decisão B) |
| RF-062 | Histórico de vendas | ✅ | Confirmado, `listarVendas`, com paginação e totais do período |
| RF-063 | Calcular diferença nominal vs. recebido | ✅ | Confirmado, `mapVenda:75-86` (`diferenca`) |
| RF-066 | Saldo atual (recebido − usado − vendido) | ✅ | Confirmado, `obterSaldoVt:59` — fórmula bate com RN-044 |

**RF-064/065 (removidos):** confirmado que não há intervalo entre vendas — consistente com nota do README.

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Aviso CLT exibido via toast no frontend** (`TransportVoucherPage.jsx:206-207`) — decisão B mantém flexibilidade com comunicação visível. Chamadas diretas à API também recebem `warning` no payload.
2. **Mensagens de bloqueio por modo de uso são claras e específicas** (`MSG_BLOQUEIO_PJ` vs `MSG_BLOQUEIO`) — ponto positivo.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### ✅ Resolvido — CLT venda VT (decisão B: permitir com aviso)

**Regras atualizadas:**
- **RN-013:** VT descontado em folha (6%); registrar venda no Pulso é **permitido com aviso** — responsabilidade do usuário.
- **RN-040:** Estagiário sem restrição; CLT com aviso (RN-013/045).
- **RN-045:** CLT pode registrar venda com aviso explícito; Pulso não bloqueia.

**Código:** `registrarVendaVt` retorna `warning` para CLT (`MSG_CLT_WARNING` reforçada). PJ/Pessoa Física continuam bloqueados por `assertModoPermitido`.

### ✅ Corrigido — Concorrência de saldo (RNF-NOVO-H1)

`criarVendaComTransacao` e `criarUsoVtAtomico` usam `prisma.$transaction(..., { isolationLevel: 'Serializable' })` — elimina janela check-then-act que permitia saldo negativo por requisições paralelas.

### Resiliência a estados extremos (demais itens verificados)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Venda/uso para modo que não usa VT | Bloqueado (`assertModoPermitido`) | ✅ |
| Criação de venda + transação de receita | Atômico via `$transaction` Serializable | ✅ |
| Alternar `vtHabilitado` fora do modo PJ | Bloqueado explicitamente | ✅ |
| Data de venda/uso inválida | Validada | ✅ |
| CLT vende VT | Permitido + `warning` (decisão B) | ✅ (por design) |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- ~~**RF-NOVO-H1 (decisão de produto)**~~ — ✅ Decisão **B** aplicada: permitir com aviso; RNs reescritas.

### Não funcionais

- ~~**RNF-NOVO-H1 (Integridade financeira)**~~ — ✅ Transações Serializable em venda/uso.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status | Esforço |
|---|---|---|---|
| 1 | Decisão CLT/venda VT + atualizar RNs (RF-NOVO-H1) | ✅ Feito (decisão B) | — |
| 2 | Proteção transacional saldo VT (RNF-NOVO-H1) | ✅ Feito | — |

---

## ❓ Perguntas clarificadoras

1. ~~Permissão CLT com aviso~~ — **Resolvido:** decisão B — flexibilidade com aviso e responsabilidade do usuário; documentação alinhada.
2. ~~Concorrência de saldo~~ — **Resolvido:** Serializable nas transações de venda/uso.

---

*Próximo módulo sugerido: 09 — Relatórios e Histórico.*
