# Code review — Fase 3: testes e integração

**Projeto:** Pulso · **Locale:** pt-BR · **IDs:** `DEV-3-NN`  
**Escopo:** `Codigo/Pulso/api/tests`, testes web Vitest, `Codigo/Pulso/mobile/test`.  
**Contexto informado:** `flutter analyze` limpo; **19 testes Flutter passaram**. Isso **não** implica cobertura dos bugs das fases 1–2.  
**Não editado:** somente auditoria.

## 1. Resumo executivo

Há volume razoável de **unitários com mock** na API e utilitários na web. Quase **não há** teste HTTP/Prisma, nem concorrência, nem fuso UTC, nem o caminho de sessão que mata o login na web. Os 19 testes Flutter exercitam parsers, repositórios com Dio **scriptado 200**, e regras de senha — **não** telas, **não** `parseMoney('10.50')`, **não** 404 de `/grupos`.

Conclusão: a suíte **passaria verde com os bugs confirmados ainda no código**.

## 2. Escopo e contexto detectado

| Camada | O que existe | O que não existe |
|--------|----------------|------------------|
| API | ~40 arquivos Jest em `tests/unit` (services, jobs, middlewares, utils) | `supertest`, DB de teste, testes de corrida, contrato OpenAPI |
| Web | ~35 Vitest: utils, 2 pages (`goalsPage`, `tripsPage`), `api.test.js` | Playwright/Cypress, AuthBootstrap, pretensão FX |
| Flutter | 5 arquivos / 19 testes | widget tests de forms, golden, integração API real |
| Integração | N/A | web↔API↔Flutter no mesmo fluxo |

Mocks típicos: `jest.mock` de repositories (`transactionService.test.js:1-16`, `metaService.test.js:1-8`). O job de recorrência mocka `criar` e **não** inspeciona `recursoDestino`.

## 3. Achados priorizados

### Gaps que deixam bugs vivos

#### DEV-3-01 — Zero teste de integração na API; mocks escondem invariantes de persistência

- **Tipo:** gap de teste (qualidade)  
- **Evidência:** apenas `tests/unit/**`; `metaService.test.js:72-90` registra aporte **sequencial** com mock de `atualizar`; nenhum `prisma.$transaction`; `transactionRepository` período sem caso `TZ=UTC`  
- **Cenário:** DEV-1-01 (aportes paralelos) e DEV-1-03 (`periodo` UTC) **não falhariam** a suíte atual.  
- **Impacto:** regressão de saldo/mês só aparece em produção (Neon/Vercel UTC).  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:** 2–3 testes de integração (testcontainers ou DB de CI) para aporte concorrente e `listarPorUsuario` com `periodo`.  
- **Teste sugerido:** ver snippets nas fases 1 (DEV-1-01 / DEV-1-03).

#### DEV-3-02 — Teste Flutter de dinheiro **fixa** o bug do ponto decimal

- **Tipo:** gap / teste que não protege  
- **Evidência:** `mobile/test/transactions_test.dart:56-60` só `parseMoney('R\$ 1.234,50')`  
- **Cenário:** `10.50` e `10,50` não são exercitados. DEV-2-02 permanece verde.  
- **Impacto:** o teste “moeda BRL formata no padrão da Web” dá falsa segurança.  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:**

```dart
expect(parseMoney('10.50'), 10.50);
expect(parseMoney('10,50'), 10.50);
expect(parseMoney('1.234,50'), 1234.5);
```

#### DEV-3-03 — Teste web **especifica** que `/auth/me` não deve refresh — documenta DEV-2-01

- **Tipo:** gap (teste de regressão invertido)  
- **Evidência:** `web/tests/unit/services/api.test.js:116-125`  
- **Cenário:** alguém “corrigindo” o bootstrap quebraria este teste de propósito. O comportamento nocivo está **protegido**.  
- **Impacto:** reforça logout no F5 após 15 min.  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:** inverter o caso: 401 em `/auth/me` **deve** POST refresh + retry; AuthBootstrap não dá `clearUser` se refresh ok.  
- **Teste sugerido:** copiar o caso de `/transacoes` (`api.test.js:54-68`) para `/auth/me`.

#### DEV-3-04 — Recorrência: `FREQ=DAILY` ignorado como “ok”; sem assert de transferência

- **Tipo:** gap  
- **Evidência:** `recurringTransactions.test.js:129-137` espera **não** criar para `FREQ=DAILY`; `criar` não é chamado com `recursoDestino` em nenhum caso  
- **Impacto:** DEV-1-02 invisível; DAILY pode ser desejável no futuro e o teste impede.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** caso explícito `tipo: 'TRANSFERENCIA', recursoDestino: 'POUPANCA'`.  
- **Teste sugerido:** `expect(transactionRepository.criar).toHaveBeenCalledWith(expect.objectContaining({ recursoDestino: 'POUPANCA' }))`.

#### DEV-3-05 — Contrato `/grupos`: teste Flutter feliz; API desligada

- **Tipo:** gap de contrato  
- **Evidência:** `trips_groups_test.dart:60-73` vs `api/src/routes/index.js:39`  
- **Cenário:** o teste prova o parser JSON, não o servidor.  
- **Impacto:** DEV-2-04 não quebra CI.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** teste de contrato (Pact) ou skip/feature flag; adapter 404.  
- **Teste sugerido:** 404 → `ApiException` com mensagem estável.

#### DEV-3-06 — Sem teste de refresh rotation / OAuth replay

- **Tipo:** gap  
- **Evidência:** `authService.test.js` cobre login/format; não há dois `refreshAccessToken` paralelos nem segundo `exchangeOAuthSession`  
- **Impacto:** DEV-1-09 e DEV-1-10 sem rede de segurança.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** unitário com fake timers + mock de `findRefreshToken` revogado no segundo call.  
- **Teste sugerido:** segundo exchange com mesmo JWT → 401 depois de implementar jti.

#### DEV-3-07 — Pages web cobrem pouco o caminho de erro Premium / grupo

- **Tipo:** gap  
- **Evidência:** `tripsPage.test.jsx` / `goalsPage.test.jsx` existem; `TripsPage.jsx:70-77` `Promise.all` + `grupoService.catch(() => [])` — viagens **não** têm catch individual  
- **Impacto:** 403 Premium ou falha de catálogo não tem teste de empty/upsell.  
- **Severidade:** Média · **Confiança:** Média  
- **Recomendação:** mock `listarViagens` 403 + `obterCatalogo` 200; a página ainda mostra conversor.  
- **Teste sugerido:** user `plano: 'FREE'`.

### Dívida de suíte

#### DEV-3-08 — 19 testes Flutter ≠ qualidade de tela

- **Tipo:** dívida  
- **Evidência:** `widget_test.dart` (senha, e-mail, deep link, api_client); `transactions_test.dart` (utils + repository scripted); sem `pumpWidget` de `TransactionFormScreen` / `TripFormScreen`  
- **Impacto:** `flutter analyze` limpo não pega payload sem `destinoMeta`.  
- **Severidade:** Baixa · **Confiança:** Alta  
- **Recomendação:** 1 widget test por form crítico (transação valor, viagem destino).  
- **Teste sugerido:** submit viagem com só texto → snack da API mock 400.

## 4. Pontos positivos

- Filtros e paginação de transação têm testes de serviço (`transactionService.test.js`).  
- Metas: prazo passado, conclusão por aporte, regras de status (`metaService.test.js`).  
- Middleware de erro/validação/cron auth cobertos.  
- Web: mutex de refresh concorrente **bem** testado (`api.test.js:71-92`) — só não inclui `/auth/me`.  
- Flutter: `locationFromAuthUri` e senha alinhada à web (`widget_test.dart`).  
- Providers de viagem (Duffel, GeoNames, catálogo) têm unitários — úteis, mas fora do núcleo financeiro.

## 5. Quick wins

1. Inverter o teste `/auth/me` (DEV-3-03) junto do fix DEV-2-01.  
2. Três expects em `parseMoney` (DEV-3-02).  
3. Um caso de transferência no job (DEV-3-04).  
4. Mock 404 grupos no Flutter (DEV-3-05).

## 6. Roadmap e riscos

| Prazo | Itens |
|-------|--------|
| Imediato | DEV-3-02, DEV-3-03, DEV-3-04 (baratos, travam bugs reais) |
| Curto | Integração aporte + `periodo` UTC (DEV-3-01) |
| Estrutural | um e2e login → transação → meta; contrato OpenAPI compartilhado |
| Residual | cobertura alta de utils de design-system **não** substitui os gaps acima |

**N/A:** testes de propriedade/fuzz; e2e Playwright (ausentes).

Assertions que **passariam com o bug**: parseMoney só BR; `/auth/me` sem refresh; GroupRepository 200; recorrência sem `recursoDestino`.

---

**Contagem fase 3:** Crítica 0 · Alta 3 · Média 4 · Baixa 1
