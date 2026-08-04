# 👥 Módulo 13 — Grupos — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [Modulos/Grupos.md](../Modulos/Grupos.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-088–102), `RegrasDeNegocio.md` (RN-111–120).
> Código auditado: `api/src/services/grupoService.js`, `api/src/utils/grupoMapper.js`, `api/src/routes/grupoRoutes.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** módulo complexo e confiável (RF-088–102 ✅). Isolamento RN-098/116 e admin único RN-113 corretos. **Correções aplicadas (ago/2026):** rate limit por usuário em preview/entrar por código; `@unique` em `ViagemGrupo.grupoId`; criação de metas em transação Serializable com recontagem atômica.

---

## 1. Auditoria de Status (README vs. Realidade)

Todos os RF-088 a RF-102 confirmados em `Modulos/Grupos.md` e `grupoService.js` — nenhum scaffold morto.

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. ~~**Preview por código sem rate limit.**~~ **✅ Corrigido** — `grupoInviteCodeRateLimit` (20 req/min por usuário) em `GET /grupos/preview` e `POST /grupos/entrar`.
2. **Erros genéricos de código inválido** — mantido por segurança (não revela existência do código).

---

## 3. Diagnóstico de Regras de Negócio e Validações

### ✅ Corrigido — Rate limit preview/entrada (RNF-NOVO-M1)

Middleware `grupoInviteRateLimit.js` — contador por `req.user.id`, impede varredura em massa do espaço `PULSO-XXXX`.

### ✅ Corrigido — Uma viagem por grupo (RNF-NOVO-M2)

Migration `20260804140000_viagem_grupo_grupo_id_unique` + `@@unique([grupoId])`. P2002 → 409 amigável.

### ✅ Corrigido — Limite de 5 metas ativas (RNF-NOVO-M3)

`grupoRepository.criarMetas` reconta metas ativas dentro de transação `Serializable` antes de inserir.

### Resiliência (itens que já funcionavam)

| Cenário | Resiliente? |
|---|---|
| Único admin não pode sair com outros membros | ✅ |
| Último membro sai → grupo excluído | ✅ |
| Rebaixar único admin | ✅ Bloqueado |
| Entrar de novo no mesmo grupo | ✅ Idempotente |
| Viagem pessoal → grupo sem vazar dados | ✅ RN-098/116 |
| Código de convite colidindo | ✅ `gerarCodigoUnico` |

---

## 4. 💡 Novos Requisitos Propostos

### Não funcionais

- ~~**RNF-NOVO-M1**~~ — ✅ Rate limit preview/entrar.
- ~~**RNF-NOVO-M2**~~ — ✅ Unique `ViagemGrupo.grupoId`.
- ~~**RNF-NOVO-M3**~~ — ✅ Metas atômicas Serializable.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status |
|---|---|---|
| 1 | Rate limit preview/entrada (RNF-NOVO-M1) | ✅ Feito |
| 2 | Unique viagem por grupo (RNF-NOVO-M2) | ✅ Feito |
| 3 | Limite 5 metas atômico (RNF-NOVO-M3) | ✅ Feito |

> **Deploy:** rodar `prisma migrate deploy` para `20260804140000_viagem_grupo_grupo_id_unique`.

Gaps já documentados em `Modulos/Grupos.md` (chat WebSocket, `/expense-split`) permanecem no roadmap.

---

*Próximo módulo sugerido: 14 — Orçamento Mensal.*
