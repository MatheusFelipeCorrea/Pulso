# Code review — Fase 1: backend

**Projeto:** Pulso · **Locale:** pt-BR · **IDs:** `DEV-1-NN`  
**Escopo:** API Node (`Codigo/Pulso/api`) — auth, transações, metas, moedas, viagens, Prisma.  
**Não editado:** somente auditoria.

## 1. Resumo executivo

A API está bem estruturada (rotas → controllers → services → repositories → Prisma) e a validação Zod nas boundaries é consistente. Os problemas que importam não são estilo: são **corrida em aportes**, **job de recorrência incompleto para transferências**, **filtro `periodo` em fuso do servidor**, **bypass do gate Premium** e **sessão OAuth/refresh com falhas de uso único**.

Qualidade geral do backend no escopo: **média-alta em organização, média em consistência de dados**. Há poucos testes que exercitam transação de banco ou fuso `America/Sao_Paulo` (Vercel = UTC).

## 2. Escopo e contexto detectado

| Item | Valor |
|------|--------|
| Stack | Express, Prisma/PostgreSQL, Zod, JWT + cookies httpOnly, bcrypt |
| Auth | `authService`, `authRoutes`, `authMiddleware` (JWT sem lookup de usuário) |
| Transações | `transactionService` + `transactionRepository` + job `recurringTransactions` |
| Metas | `metaService` + `AporteMeta` (valorAtual denormalizado) |
| Moedas | `moedaService` + AwesomeAPI/Frankfurter |
| Viagens | `viagemService` + `requirePremium` em todas as rotas `/viagens` |
| Overlay | `project.yml` → `audits.overlay: null` |
| N/A | Rotas comentadas (`/grupos`, notificações HTTP, orçamento, etc.) — schema Prisma já tem Grupo |

## 3. Achados priorizados

### Bugs

#### DEV-1-01 — Aporte de meta não é atômico (lost update / estouro do alvo)

- **Tipo:** bug confirmado  
- **Evidência:** `Codigo/Pulso/api/src/services/metaService.js:297-326` e ausência de `$transaction` em `Codigo/Pulso/api/src`  
- **Cenário:** dois POSTs simultâneos em `/metas/:id/aportes` com valor que, somados, ultrapassam `valorRestante`. Ambos leem o mesmo `valorAtual`, passam em `valorAporte > valorRestante` e gravam aportes + `valorAtual` independente.  
- **Impacto:** meta com `valorAtual` > `valorAlvo`; histórico de aportes inconsistente com o saldo.  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:** uma transação Prisma com `UPDATE ... SET valor_atual = valor_atual + $1 WHERE id = $2 AND valor_atual + $1 <= valor_alvo` (ou `SELECT FOR UPDATE` da meta).

```javascript
await prisma.$transaction(async (tx) => {
  const meta = await tx.meta.findFirst({
    where: { id: metaId, usuarioId, status: 'ATIVA' },
  });
  const restante = roundMoney(meta.valorAlvo) - roundMoney(meta.valorAtual);
  if (valorAporte > restante) throw new AppError('...', 400);
  await tx.aporteMeta.create({ data: { metaId, valor: valorAporte, data } });
  return tx.meta.update({
    where: { id: metaId },
    data: { valorAtual: { increment: valorAporte } },
  });
});
```

- **Teste sugerido:** dois `registrarAporte` concorrentes no mesmo alvo; um deve falhar e `valorAtual` não pode ultrapassar `valorAlvo`.

#### DEV-1-02 — Job de recorrência não copia `recursoDestino`

- **Tipo:** bug confirmado  
- **Evidência:** `Codigo/Pulso/api/src/jobs/recurringTransactions.js:70-81` vs criação em `transactionService.js:264-275`  
- **Cenário:** usuário cria transferência recorrente DINHEIRO → POUPANCA. O cron diário gera filhas `tipo: TRANSFERENCIA` **sem** `recursoDestino`. `calcularSaldosPorRecurso` só credita o destino se `recursoDestino` existir (`resourceBalanceUtils.js:22-26`).  
- **Impacto:** origem é debitada para sempre; destino nunca recebe; saldos de carteira/benefício ficam errados.  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:**

```javascript
const filha = await transactionRepository.criar({
  usuarioId: mae.usuarioId,
  categoriaId: mae.categoriaId,
  tipo: mae.tipo,
  recurso: mae.recurso,
  recursoDestino: mae.recursoDestino ?? null,
  valor: mae.valor,
  descricao: mae.descricao,
  data: startOfDay(new Date()),
  recorrente: false,
  regraRecorrencia: null,
  paiId: mae.id,
});
```

- **Teste sugerido:** mãe `TRANSFERENCIA` com `recursoDestino: 'POUPANCA'`; assert no `criar` da filha.

#### DEV-1-03 — Filtro `periodo` usa timezone do processo, não `America/Sao_Paulo`

- **Tipo:** bug confirmado (consumido pelo Flutter)  
- **Evidência:** `Codigo/Pulso/api/src/repositories/transactionRepository.js:30-35` vs `startOfDayInTimezone` em `dateTimezone.js:28-37`  
- **Cenário:** mobile envia `periodo=2026-01` (`transaction_models.dart` `toQuery`). Na Vercel (UTC), `new Date(2026, 0, 1)` é `2026-01-01T00:00:00.000Z` (= 21:00 do dia 31/12 em SP). `fim` em 31/01 23:59 UTC corta o fim da noite de 31/01 em SP.  
- **Impacto:** transações no fim/início do mês caem no mês errado no app Flutter; totais do resumo divergem da web (web usa `dataInicio`/`dataFim` com timezone util).  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:** derivar o intervalo com `startOfDayInTimezone(`${year}-${month}-01`)` e `endOfDayInTimezone` do último dia civil em SP.  
- **Teste sugerido:** `TZ=UTC` + transação em `2026-01-31T03:00:00.000Z` (meia-noite SP) deve entrar em janeiro.

#### DEV-1-04 — Recorrência mensal no dia 31 nunca dispara em meses curtos

- **Tipo:** bug confirmado (edge)  
- **Evidência:** `Codigo/Pulso/api/src/jobs/recurringTransactions.js:36-38`  
- **Cenário:** transação mãe em 31/01, `FREQ=MONTHLY`. Em fevereiro `hoje.getDate() === 31` é falso.  
- **Impacto:** assinaturas/aluguéis “todo dia 31” somem em fev/abr/jun/set/nov.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** se o dia-base > último dia do mês corrente, usar o último dia (regra civil comum) ou RRULE `BYMONTHDAY`.  
- **Teste sugerido:** fake timers em 2026-02-28 com mãe em 2026-01-31.

#### DEV-1-05 — Insight do mês ignora despesas do dia 1 de manhã

- **Tipo:** bug confirmado  
- **Evidência:** `Codigo/Pulso/api/src/services/insightService.js:27-34`  
- **Cenário:** `inicioMes = new Date('YYYY-MM-01T12:00:00.000Z')`. Transações gravadas em `T03:00:00.000Z` (início do dia SP) no dia 1 **não** satisfazem `gte` meio-dia UTC.  
- **Impacto:** insight “maior gasto do mês” subestima ou escolhe categoria errada.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** `startOfDayInTimezone(`${mes}-01`)`.  
- **Teste sugerido:** despesa em `2026-01-01T03:00:00.000Z` deve entrar no groupBy de janeiro.

#### DEV-1-06 — `criarTransacao` notifica depois do INSERT; falha vira 500 com linha persistida

- **Tipo:** bug confirmado  
- **Evidência:** `Codigo/Pulso/api/src/services/transactionService.js:264-287` (`insightService` está em try/catch; `criarNotificacao` não)  
- **Cenário:** `notificationRepository.criar` lança (constraint, DB). Cliente recebe 500; recarrega e vê a transação; retry duplica.  
- **Impacto:** duplicata de receita/despesa e UX de “falhou mas salvou”.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** try/catch em volta de `notificarTransacaoRegistrada` (mesmo padrão de `tentarGerarInsightAposTransacao`) **ou** transação única create+tags+notify.  
- **Teste sugerido:** mock de `criarNotificacao` rejeitando; `criarTransacao` ainda retorna 201 e não propaga.

#### DEV-1-07 — Tipo de observação `DICA` / `DOCUMENTOS` é aceito e descartado

- **Tipo:** bug confirmado (contrato)  
- **Evidência:** schema `viagemSchemas.js:162-186` vs `viagemService.js:338-381` (`inferirTipoObservacao` ignora `dados.tipo`)  
- **Cenário:** cliente envia `tipo: 'DOCUMENTOS'`. Persistido como `GERAL`/`CHECKLIST`/`LINK`.  
- **Impacto:** enum Prisma e UI de tipos não batem com o que o banco guarda.  
- **Severidade:** Baixa · **Confiança:** Alta  
- **Recomendação:** se `dados.tipo` for um dos `TIPOS_OBSERVACAO`, persistir; senão inferir.  
- **Teste sugerido:** POST observação `{ tipo: 'DOCUMENTOS', titulo: 'Passaporte' }` → `tipo` na resposta.

### Riscos

#### DEV-1-08 — `PATCH /auth/me/plano` permite PREMIUM sem billing

- **Tipo:** risco / backdoor de produto  
- **Evidência:** `authRoutes.js:78`, `authService.js:540-555`, gate em `viagemRoutes.js:22-23` + `requirePremium.js:21-28`  
- **Cenário:** qualquer sessão autenticada envia `{ "plano": "PREMIUM" }` e passa em `/viagens`. Comentário “TI5 demo” não impede uso em produção.  
- **Impacto:** freemium inútil; viagens Premium abertas.  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:** remover a rota em produção, ou restringir a `NODE_ENV !== 'production'` / secret de demo.  
- **Teste sugerido:** em config de prod, PATCH plano deve 404/403.

#### DEV-1-09 — Exchange OAuth JWT reutilizável por 60s

- **Tipo:** risco  
- **Evidência:** `authService.js:459-497` (`OAUTH_EXCHANGE_TTL = '60s'`, `jwt.verify` sem jti/store)  
- **Cenário:** token na query `/auth/callback?exchange=` (logs, Referer, histórico). Replay gera nova sessão completa.  
- **Impacto:** sequestro de sessão se o URL vazar no TTL.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** gravar jti de uso único (Redis/tabela) e invalidar no primeiro `exchangeOAuthSession`.  
- **Teste sugerido:** segundo POST `/auth/oauth/exchange` com o mesmo token → 401.

#### DEV-1-10 — Rotação de refresh: segundo uso revoga **todas** as sessões

- **Tipo:** risco (race)  
- **Evidência:** `authService.js:266-277`  
- **Cenário:** duas abas (ou web + retry) apresentam o mesmo refresh quase juntos. A primeira rotaciona; a segunda vê `revogado` e chama `revokeAllRefreshTokensForUser`.  
- **Impacto:** logout forçado de todos os devices; o mutex do axios (`api.js`) não cobre **duas origens** nem dois processos.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** graça de reuse (ex.: 10s) ou não revogar a família no primeiro replay; hash do token + lock no UPDATE.  
- **Teste sugerido:** dois `refreshAccessToken` paralelos com o mesmo valor.

#### DEV-1-11 — Job de limpeza de contas não verificadas nunca entra no cron

- **Tipo:** risco / dead path  
- **Evidência:** `unverifiedAccountCleanupJob.js:10-24` vs `cronController.js:19-31` (só `runTokenCleanup` + `runRecurringTransactions`)  
- **Cenário:** contas EMAIL `verificado: false` acumulam > 30 dias.  
- **Impacto:** lixo no banco; tokens de verificação órfãos. A limpeza de tokens **não** apaga o usuário.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** chamar `runUnverifiedAccountCleanup` em `/cron/daily`.  
- **Teste sugerido:** teste de integração do `daily` mockando o job.

### Dívida

#### DEV-1-12 — `resend-verification` revela se o e-mail existe (404)

- **Tipo:** dívida de consistência (auth)  
- **Evidência:** `authService.js:140-146` vs `requestPasswordReset` silencioso em `325-336`  
- **Cenário:** POST `/auth/resend-verification` com e-mail desconhecido → 404.  
- **Impacto:** enumeração de contas.  
- **Severidade:** Baixa · **Confiança:** Alta  
- **Recomendação:** mesma resposta genérica 200 do forgot-password.  
- **Teste sugerido:** e-mail inexistente não distingue 404.

## 4. Pontos positivos

- Validação Zod com `excluirFuturas` transformado de string (`transactionSchemas.js:101-105`) — evita o clássico `"false"` truthy.  
- `dataInicio`/`dataFim` passam por `dateTimezone.js` (`America/Sao_Paulo`).  
- Listagem de transações com `orderBy` estável (`transactionRepository.js:78-81`).  
- Ownership nas queries (`buscarPorId` + `usuarioId`).  
- `requirePremium` no router de viagens (gate no servidor).  
- Rotação de refresh + revogação em reset de senha.  
- OAuth `returnTo` com allowlist (`googleReturnTo.js`).  
- Conversão de moedas com fallback Frankfurter e cache TTL.

## 5. Quick wins

1. Copiar `recursoDestino` no job de recorrência (DEV-1-02).  
2. try/catch na notificação pós-create (DEV-1-06).  
3. Trocar `periodo` para helpers de timezone (DEV-1-03).  
4. `inicioMes` do insight com `startOfDayInTimezone` (DEV-1-05).  
5. Encaixar cleanup de não verificados no cron daily (DEV-1-11).  
6. Guardar `PATCH /me/plano` atrás de flag de demo (DEV-1-08).

## 6. Roadmap e riscos

| Prazo | Itens |
|-------|--------|
| Imediato | DEV-1-01, DEV-1-02, DEV-1-03, DEV-1-08 |
| Curto | Recorrência mensal (31), OAuth jti, refresh race, insight |
| Estrutural | `prisma.$transaction` em create transação+tags e aportes; unificar `startOfDay` local vs SP |
| Residual | Módulos HTTP ainda comentados (`/grupos`) vs schema Prisma |

**N/A:** workers além do cron Vercel; filas além de `emailBridge`.

---

**Contagem fase 1:** Crítica 0 · Alta 4 · Média 6 · Baixa 2
