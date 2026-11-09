# Code review — Fase 2: frontend (web + Flutter)

**Projeto:** Pulso · **Locale:** pt-BR · **IDs:** `DEV-2-NN`  
**Escopo:** React (`Codigo/Pulso/web`) e Flutter (`Codigo/Pulso/mobile/lib/features/` + `app_router.dart`).  
**Não editado:** somente auditoria.

## 1. Resumo executivo

A web cobre transações, metas e viagens com abort de requests e mutex de refresh **para APIs de negócio**. O buraco mais grave está no **bootstrap**: `GET /auth/me` **não** dispara refresh, então um reload após expirar o cookie de access (15 min) **desloga** mesmo com refresh cookie válido. No Flutter, o interceptor de 401 é melhor, mas o app **cria viagens incompatíveis com a API**, **parseia dinheiro de forma perigosa** e **expõe Grupos contra rota comentada**.

## 2. Escopo e contexto detectado

| App | Rotas relevantes | Auth |
|-----|------------------|------|
| Web | `/transactions`, `/goals`, `/trips`, `/trips/:id` — **sem** `/groups`, `/profile`, `/settings` | cookies httpOnly + axios |
| Flutter | features auth, transactions, goals, trips, groups, currency | `X-Pulso-Client: mobile` + Bearer |
| Contrato quebrado | `grupoService.js` e `GroupRepository` → `/grupos` (router API comentado em `routes/index.js:39`) | |

N/A: SSR, hidratação, Socket.IO no Flutter (incerteza já em `project.yml`).

## 3. Achados priorizados

### Bugs

#### DEV-2-01 — Reload da web após 15 min encerra sessão (não refresha no bootstrap)

- **Tipo:** bug confirmado  
- **Evidência:** `web/src/services/api.js:61-73` (`isSessionProbeRequest` inclui `/auth/me`) + `AuthBootstrap.jsx:15-20` (`getMe().catch → clearUser`)  
- **Cenário:** usuário autenticado; cookie `pulso_access` expira (`authCookies.js:6-7`, 15 min); refresh cookie ainda válido. F5. `GET /auth/me` sem access → 401. Interceptor **recusa** refresh (teste em `api.test.js:116-125` **congela** esse comportamento). Redux `clearUser`.  
- **Impacto:** logout inesperado; pior que ficar na SPA (aí um 401 em `/transacoes` **sim** refresha).  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:** no 401 de `/auth/me`, chamar `refreshSession()` e repetir o GET; só então `clearUser`.

```javascript
if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
  // isAuthRequest NÃO deve incluir /auth/me
}
```

- **Teste sugerido:** interceptor 401 em `/auth/me` deve POST `/auth/refresh` e retry; AuthBootstrap não dispara `clearUser` se o refresh passar.

#### DEV-2-02 — `parseMoney` no Flutter trata `.` como milhar (`10.50` → `1050`)

- **Tipo:** bug confirmado  
- **Evidência:** `mobile/lib/features/transactions/utils/formatters.dart:87-96`  
- **Cenário:** teclado numérico Android/iOS insere `10.50`. `replaceAll('.', '')` depois `',' → '.'` produz `1050`. Usado em transações e no diálogo de despesa da viagem (`trip_detail_screen.dart:80`).  
- **Impacto:** valor 100× maior gravado na API.  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:** se houver uma vírgula, pontos são milhar; se só um ponto e nenhuma vírgula, tratar como decimal.

```dart
double? parseMoney(String raw) {
  var s = raw.trim().replaceAll('R\$', '').replaceAll(' ', '');
  if (s.contains(',') && s.contains('.')) {
    s = s.replaceAll('.', '').replaceAll(',', '.');
  } else if (s.contains(',')) {
    s = s.replaceAll(',', '.');
  }
  return double.tryParse(s);
}
```

- **Teste sugerido:** `parseMoney('10.50') == 10.50` e `parseMoney('1.234,50') == 1234.5`.

#### DEV-2-03 — Formulário Flutter de viagem não envia `destinoMeta` (API 400)

- **Tipo:** bug confirmado  
- **Evidência:** `trip_form_screen.dart:60-80` + `trip_repository.dart:56-72` (só `destino`, `moeda`, `dataPrevista`) vs `viagemService.js:171-178` (`Selecione um destino da lista de sugestões`) e o picker da web (`TripFormModal.jsx:235-237`)  
- **Cenário:** usuário digita “Lisboa” e salva. Sem `destinoMeta`/`catalogId`, `resolveDestinationAirport` falha para a maioria dos textos livres.  
- **Impacto:** criar/editar viagem no mobile é inutilizável vs web.  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:** reutilizar `listarDestinos` já existente no `TripRepository` e mandar o payload da sugestão (`catalogId`/`geonameId`/`iata`/…).  
- **Teste sugerido:** widget/repository POST body contém `destinoMeta`.

#### DEV-2-04 — Feature Grupos no Flutter chama API inexistente

- **Tipo:** bug confirmado (contrato)  
- **Evidência:** `group_repository.dart:28-32`; `app_router.dart:198-201`; API `routes/index.js:17-39` (`grupoRoutes` comentado). `project.yml` uncertainties já registra o gap.  
- **Cenário:** usuário abre `/groups` → GET `/grupos` → 404. `GroupsController` mostra `error`.  
- **Impacto:** tela morta; testes (`trips_groups_test.dart:60-73`) **assumem 200** e não pegam o contrato real.  
- **Severidade:** Alta · **Confiança:** Alta  
- **Recomendação:** esconder a rota até o backend existir, ou empty state explícito “em breve” sem request.  
- **Teste sugerido:** adapter 404 → mensagem de produto, não crash.

#### DEV-2-05 — Edição Flutter de transação depende só de `extra` (deep link = formulário novo)

- **Tipo:** bug confirmado  
- **Evidência:** `app_router.dart:133-138`; `transaction_form_screen.dart:50-51` (`isEdit => widget.transacao != null`); nenhum GET `/transacoes/:id`  
- **Cenário:** abrir `/transactions/:id` sem `state.extra` (histórico, restore). Tela de **criação**. Salvar cria outra transação.  
- **Impacto:** dados errados; ID na URL ignorado. O mesmo padrão em `/trips/:id/edit` e `/goals/form`.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** GET por id no `initState` quando `pathParameters['id']` existir.  
- **Teste sugerido:** rota com id e `extra: null` carrega a transação.

#### DEV-2-06 — Helper “conversão em BRL” na pretensão web não converte

- **Tipo:** bug confirmado (UX/dados)  
- **Evidência:** `TripExpenseFormModal.jsx:151-164` (`formatCurrency(form.valorEstimado)` com o **mesmo** número); `calcTripTotalInCurrency` em `tripDetailUtils.js:41-47` assume que `totalBrl` já é BRL  
- **Cenário:** viagem em USD; usuário lê “≈ R$ 100,00 (conversão em BRL)” ao digitar 100 — não usa cotação.  
- **Impacto:** planejamento em moeda local vs BRL misturado; totais da API (`viagemMapper.js:53-66`) somam `valorEstimado` rotulado `totalBrl`.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** ou o input é BRL e o helper mostra `valor / bid` na moeda da viagem, ou o input é na moeda da viagem e o POST converte com `/moedas/converter`.  
- **Teste sugerido:** com `bid=5`, 100 USD → preview R$ 500 (ou o inverso, conforme regra única).

#### DEV-2-07 — Após criar viagem, web tenta vincular grupo (404) e pode duplicar viagem

- **Tipo:** bug confirmado  
- **Evidência:** `TripsPage.jsx:117-127` (`criarViagem` depois `grupoService.criarViagemGrupo`); `TripFormModal.jsx:248-260` (`grupoId`)  
- **Cenário:** toggle vincular grupo + submit. Viagem já persistida; POST `/grupos/:id/viagem` falha. Modal permanece (erro no catch do form); usuário reenvia → segunda viagem.  
- **Impacto:** viagens órfãs duplicadas.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** esconder vincular grupo enquanto `/grupos` estiver off; ou transação compensatória / não fechar só depois do vínculo.  
- **Teste sugerido:** mock 404 no grupo; assert uma única `criarViagem`.

#### DEV-2-08 — Sidebar web aponta para rotas que não existem

- **Tipo:** bug confirmado  
- **Evidência:** `sidebarNavigation.js:41-44` (`/profile`, `/settings`) vs `App.jsx:66-76` (só dashboard/transactions/goals/trips) + `path="*"` → landing  
- **Cenário:** autenticado clica Perfil ou Configurações → cai em `/` (landing).  
- **Impacto:** navegação quebrada; logout ainda funciona (`action: 'logout'`).  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** remover itens ou adicionar páginas stub.  
- **Teste sugerido:** rotas do footer resolvem componente autenticado.

#### DEV-2-09 — Deep link `/trips` para plano FREE: página quebra inteira

- **Tipo:** bug confirmado  
- **Evidência:** `ProtectedRoute.jsx:6-19` só checa auth, não plano; `TripsPage.jsx:70-74` `Promise.all` inclui `listarViagens()` (403 `PREMIUM_REQUIRED`); Flutter `trips_screen.dart:31-37` **bloqueia** na UI  
- **Cenário:** usuário FREE cola `/trips`. 403 derruba catálogo e favoritas no mesmo `all`.  
- **Impacto:** tela de erro genérico; moedas nem carregam.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** gate no `ProtectedRoute` (como sidebar `PREMIUM_PATHS`) e `Promise.allSettled` para não misturar 403 de viagem com GET de moedas.  
- **Teste sugerido:** user FREE em `/trips` vê upsell, não toast de falha total.

### Riscos

#### DEV-2-10 — Bootstrap Flutter apaga a sessão em qualquer erro de `/auth/me`

- **Tipo:** risco  
- **Evidência:** `auth_controller.dart:32-38` (`catch (_) { await _storage.clear(); }`)  
- **Cenário:** timeout/5xx no boot. Interceptor até refresha 401, mas **rede** também limpa tokens.  
- **Impacto:** logout em flaky network.  
- **Severidade:** Média · **Confiança:** Alta  
- **Recomendação:** só `clear` em 401 após refresh falhar; em erro de rede manter `unknown` e retry.  
- **Teste sugerido:** `me()` com `connectionTimeout` não chama `clear`.

#### DEV-2-11 — DatePicker de viagem Flutter permite data passada

- **Tipo:** risco de UX (400 da API)  
- **Evidência:** `trip_form_screen.dart:118-124` `firstDate: DateTime(2020)` vs `viagemService.js:47-54`  
- **Cenário:** usuário escolhe ontem → 400 “Data prevista deve ser futura”.  
- **Severidade:** Baixa · **Confiança:** Alta  
- **Recomendação:** `firstDate: DateTime.now().add(Duration(days: 1))`.

### Dívida

#### DEV-2-12 — Web não tem tela de Grupos; Flutter tem — divergência de produto

- **Tipo:** dívida  
- **Evidência:** `sidebarNavigation.js:32-33` grupos comentados; Flutter `AppShell` + rota `/groups`  
- **Impacto:** dois clientes, um contrato. Relacionado a DEV-2-04.  
- **Severidade:** Baixa · **Confiança:** Alta  

## 4. Pontos positivos

- Mutex `refreshPromise` na web para 401 de recursos (`api.js:41-49`).  
- `AbortController` em transações/metas (`TransactionsPage.jsx:102-106`, `GoalsPage.jsx:95-105`).  
- Flutter envia `X-Pulso-Client` e recebe tokens no body (`authController.js:115-118`).  
- Flutter Premium gate na lista de viagens (`trips_screen.dart:31-37`).  
- Web DestinationSearchPicker alinhado ao contrato `destinoMeta`.  
- `isoDate` no Flutter usa meio-dia local → UTC (`formatters.dart:56-59`), compatível com Zod datetime.

## 5. Quick wins

1. Permitir refresh no 401 de `/auth/me` (DEV-2-01).  
2. Corrigir `parseMoney` (DEV-2-02).  
3. Esconder Grupos no Flutter (DEV-2-04).  
4. Esconder vincular grupo na web (DEV-2-07).  
5. Footer da sidebar só com rotas reais (DEV-2-08).

## 6. Roadmap e riscos

| Prazo | Itens |
|-------|--------|
| Imediato | DEV-2-01, DEV-2-02, DEV-2-03 |
| Curto | grupos, deep link transação, pretensão/FX, FREE `/trips` |
| Estrutural | um contrato de destino/moeda compartilhado web/mobile |
| Residual | Socket.IO RF-140 no Flutter; páginas perfil/config |

---

**Contagem fase 2:** Crítica 0 · Alta 4 · Média 6 · Baixa 2
