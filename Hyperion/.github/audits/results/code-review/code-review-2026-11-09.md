# Auditoria Code Review (Dev Sênior) — Pulso

**Data:** 2026-11-09  
**Foco:** Sprint 6 — insights, chatbot, seed/reseed

---

## 1. Resumo executivo

Qualidade do código da Sprint 6 é **sólida**: separação controller → service → provider, schemas de validação nas rotas, testes unitários para `insightEngines` e `chatbotService`, parity web/Flutter nos repositórios de dados. Débitos: **testes Flutter ausentes** para features novas, **parse frágil de proposta LLM**, comentários `TEMP` no router, e **mega-seed** difícil de manter (arquivo muito grande).

---

## 2. Escopo e contexto detectado

- Backend: `insightService.js`, `insightEngines.js`, `chatbotService.js`, `insightContextService.js`, `chatbotContextService.js`
- Frontend web: `InsightsPage.jsx`, `ChatbotPage.jsx`, services dedicados
- Mobile: `insights_screen.dart`, `chatbot_screen.dart`, repositories
- Testes: `tests/unit/services/insightEngines.test.js`, `chatbotService.test.js`

---

## 3. Achados priorizados

### DEV-001 — Testes unitários API para chatbot sem cenários de confirmação de transação

- **Evidência:** `tests/unit/services/chatbotService.test.js` — mocks pesados; sem casos de `confirmarTransacao` / proposta inválida (amostra linhas 37-50).
- **Cenário:** Regressão em validação de proposta JSON do LLM.
- **Impacto:** Lançamentos incorretos em produção.
- **Severidade:** Média | **Confiança:** Alta
- **Recomendação:** Casos para `extractProposta`, off-topic, conversa de outro usuário (404).
- **Teste sugerido:** Proposta sem `valor` → `proposta: null`.

### DEV-002 — Zero testes Flutter para insights e chatbot

- **Evidência:** busca em `Codigo/Pulso/mobile/test` sem matches para insights/chatbot (2026-11-09).
- **Cenário:** Mudança em `InsightPayload.fromJson` quebra tela silenciosamente.
- **Impacto:** Paridade mobile degradada vs web.
- **Severidade:** Média | **Confiança:** Alta
- **Recomendação:** Widget tests mínimos (loading, empty, error) + unit do repository com JSON fixture.
- **Teste sugerido:** `insight_repository_test.dart` com payload do snapshot seed.

### DEV-003 — `extractProposta` depende de regex HTML comment

- **Evidência:** `chatbotService.js:34-49`.
- **Cenário:** Modelo emite JSON malformado ou múltiplos blocos.
- **Impacto:** Proposta ignorada ou parse parcial.
- **Severidade:** Baixa | **Confiança:** Alta
- **Recomendação:** Fallback JSON mode nativo Gemini (`responseSchema`) se disponível.
- **Teste sugerido:** Mensagem com dois blocos `PROPOSTA_TX`.

### DEV-004 — Limite de regeneração de insights coerente

- **Evidência:** `insightService.js:9,159-161,226` — `REGEN_LIMIT = 3`.
- **Cenário:** Usuário esgota cota no mês.
- **Impacto:** Comportamento correto e previsível (custo Gemini controlado).
- **Severidade:** N/A (positivo)
- **Recomendação:** Expor mensagem amigável na web/Flutter (verificar se já faz).
- **Teste sugerido:** Já coberto parcialmente — expandir.

### DEV-005 — `seed.js` monolito (~1800+ linhas)

- **Evidência:** `prisma/seed.js` orquestra mega-seed, `seedExtras.js` complementar.
- **Cenário:** Conflito de merge; difícil revisar idempotência.
- **Impacto:** Manutenção e bugs em dados demo (incl. insights INSIGHT_IA em notificações seed linha ~1462).
- **Severidade:** Média | **Confiança:** Alta
- **Recomendação:** Manter modularização atual (`seedDadosCompletos`, extras); evitar mais lógica inline.
- **Teste sugerido:** Script CI opcional que roda seed em SQLite/ephemeral (se viável).

### DEV-006 — Rotas comentadas geram falsa sensação de “feature off”

- **Evidência:** `routes/index.js:46-47` notificações; serviços ainda chamam `notificationService` em insights.
- **Impacto:** Confusão dev; possível código morto.
- **Severidade:** Média | **Confiança:** Alta
- **Recomendação:** Habilitar rota ou remover writes de notificação até RF-035 fechar.
- **Teste sugerido:** Integração GET notificações quando habilitado.

---

## 4. Pontos positivos

- **Engines testáveis:** `insightEngines.test.js` cobre lógica determinística Sprint 6.
- **Validação nas bordas:** `insightRoutes.js`, `chatbotRoutes.js` + schemas.
- **Web insights UX:** `InsightsPage.jsx` usa design-system (`EmptyState`, `MonthPicker`, tokens).
- **reseed-tester reutiliza funções do seed:** DRY em `reseed-tester.js:11-16`.

---

## 5. Quick wins

1. +3 testes `chatbotService` (off-topic, proposta inválida, título conversa).
2. Fixture JSON insights em `mobile/test/fixtures/`.
3. Comentário no router explicando status de `/notificacoes`.

---

## 6. Roadmap e riscos

- **Imediato:** testes Flutter mínimos Sprint 6.
- **Médio:** schema Gemini estruturado para insights (já pede JSON no prompt).
- **Risco:** mudança de modelo `gemini-3.1-flash-lite` quebra parse sem testes de contrato provider.
