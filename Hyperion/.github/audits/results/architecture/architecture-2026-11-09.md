# Auditoria de Arquitetura — Pulso

**Data:** 2026-11-09  
**Escopo:** Monorepo `Codigo/Pulso/{api,web,mobile}` + kit Hyperion  
**Foco:** Sprint 6 (Insights Inteligentes, Chatbot), seed/reseed-tester, evolução documentada

---

## 1. Resumo executivo

O Pulso mantém uma arquitetura **monólito Node/Express + PostgreSQL (Prisma)** servindo **SPA React** e **Flutter** no mesmo contrato REST, com **Socket.IO** para chat de grupos e **RabbitMQ** para alertas assíncronos. A Sprint 6 adicionou um padrão consistente de **IA híbrida**: engines determinísticos (`insightEngines.js`) + enriquecimento opcional via **Gemini**, com **cache persistido** (`InsightSnapshot`) e **histórico de chat** (`ConversaChat` / `MensagemChat`).

Os riscos dominantes são **divergência de documentação de contrato** (`.github/project.yml` desatualizado), **acoplamento operacional à mesma chave Gemini** para PDF/chatbot/insights, e **módulos ainda “meio ligados”** (rota de notificações comentada enquanto serviços criam notificações). A capacidade de evolução é **boa** no backend (rotas modulares, services, schemas Zod/Joi), com débito concentrado em jobs comentados e paridade cliente.

---

## 2. Escopo e contexto detectado

| Item | Evidência |
|------|-----------|
| Layout monorepo | `.github/project.yml:13-27` |
| API Express | `Codigo/Pulso/api/src/app.js`, `src/routes/index.js` |
| Clientes | `Codigo/Pulso/web`, `Codigo/Pulso/mobile` |
| Persistência | `Codigo/Pulso/api/prisma/schema.prisma` |
| IA Sprint 6 | `insightService.js`, `chatbotService.js`, providers Gemini |
| CI | `.github/workflows/hyperion-product-ci.yml` |
| Locale relatório | `pt-BR` (`.github/project.yml:11`) |

**Limitações:** topologia de produção não versionada (incerteza explícita em `.github/project.yml:92-96`). Carga e métricas de runtime não observáveis no repositório.

**N/A:** microserviços, filas de eventos de domínio, service mesh.

---

## 3. Achados priorizados

### ARCH-001 — Contrato Hyperion desatualizado vs código real

- **Evidência:** `.github/project.yml:94-96` afirma `/api/grupos` comentada e Socket.IO ausente no Flutter; `Codigo/Pulso/api/src/routes/index.js:41` monta `/grupos`; `Codigo/Pulso/mobile/lib/features/groups/data/group_chat_socket.dart:7-8` implementa Socket.IO.
- **Constatação:** O overlay de incertezas contradiz a implementação atual, distorcendo auditorias e onboarding.
- **Impacto:** Decisões erradas de escopo, retrabalho em documentação e cards.
- **Severidade:** Média | **Confiança:** Alta
- **Recomendação:** Atualizar `uncertainties` e `/discover` no `project.yml` após validação manual.
- **Trade-offs:** Pouco esforço; exige sanity check rápido em staging.

### ARCH-002 — Superfície de rotas “TEMP” incompleta

- **Evidência:** `Codigo/Pulso/api/src/routes/index.js:21-23,46-47` comenta `notificationRoutes` e `syncRoutes`; `Codigo/Pulso/api/src/server.js:21-23` comenta jobs de limpeza de notificação/chat.
- **Constatação:** Notificações são geradas em serviços, mas o boundary HTTP de consumo permanece desligado.
- **Impacto:** Clientes não consomem notificações de forma uniforme; regra de produto parcial (RF-035).
- **Severidade:** Alta | **Confiança:** Alta
- **Recomendação:** Habilitar `/notificacoes` ou documentar descontinuação explícita; alinhar web/mobile.
- **Trade-offs:** Esforço médio; reduz inconsistência produto × arquitetura.

### ARCH-003 — Padrão híbrido IA (determinístico + LLM) bem delimitado na Sprint 6

- **Evidência:** `Codigo/Pulso/api/src/services/insightService.js:35-57` monta payload base via engines; `chatbotService.js:18-29` system prompt com guardrails; migrations `20261109120000_insight_snapshots`, `20261107120000_chatbot_conversas`.
- **Constatação:** Fallback determinístico evita dependência total do LLM; snapshot reduz custo e latência.
- **Impacto:** Positivo para resiliência e custo; risco residual se Gemini indisponível sem UX clara.
- **Severidade:** Baixa (risco) | **Confiança:** Alta
- **Recomendação:** Manter contrato de degradência documentado em `api/Documents/Readme.md`.
- **Trade-offs:** Já implementado; só reforçar observabilidade de falhas Gemini.

### ARCH-004 — Acoplamento de configuração Gemini compartilhada

- **Evidência:** `Codigo/Pulso/api/src/config/env.js:55-80` reutiliza `GEMINI_API_KEY_PDF` para chatbot e insights.
- **Constatação:** Uma chave/modelo atende PDF, chatbot e insights — blast radius operacional único.
- **Impacto:** Quota ou revogação derruba três capacidades; difícil rate limit por feature.
- **Severidade:** Média | **Confiança:** Alta
- **Recomendação:** Chaves separadas por ambiente/produto em produção; quotas distintas no Google Cloud.
- **Trade-offs:** Mais secrets para gerir; melhor isolamento.

### ARCH-005 — Orquestração server com múltiplos schedulers in-process

- **Evidência:** `Codigo/Pulso/api/src/server.js:25-80+` — vários `cron.schedule` no mesmo processo Node.
- **Constatação:** Jobs críticos (recorrência, alertas, limpeza) compartilham runtime com API HTTP.
- **Impacto:** Em escala horizontal, jobs duplicam; em serverless (Vercel), comportamento pode diferir do dev local.
- **Severidade:** Média | **Confiança:** Média
- **Recomendação:** Documentar modelo de deploy (worker dedicado vs cron externo) antes de produção pública.
- **Trade-offs:** Worker separado aumenta custo; evita double-run.

### ARCH-006 — Ferramenta `reseed-tester` como boundary de dados de demo

- **Evidência:** `Codigo/Pulso/api/scripts/reseed-tester.js:1-71`, `package.json:20`; `docs/7.solucao.md:67`.
- **Constatação:** Script apaga e recria `tester@mail.com` com mega-seed incluindo insights/chatbot/grupos.
- **Impacto:** Positivo para demos e testes manuais Sprint 6; risco se executado em ambiente compartilhado sem guarda.
- **Severidade:** Média (operacional) | **Confiança:** Alta
- **Recomendação:** Bloquear script em `NODE_ENV=production` ou exigir flag explícita.
- **Trade-offs:** Uma linha de proteção; evita wipe acidental.

---

## 4. Pontos positivos

- **Modularidade de rotas Sprint 6:** `insightRoutes.js`, `chatbotRoutes.js` plugados em `routes/index.js:44-45`.
- **Monorepo alinhado ao produto:** `docs/7.solucao.md:56-63` descreve parity web × Flutter para insights e chatbot.
- **Prisma com modelos dedicados:** `schema.prisma` — `InsightSnapshot`, `ConversaChat`, `HistoricoScore`.
- **Messaging assíncrono:** `server.js:10-16` integra RabbitMQ para alertas sem bloquear request path.

---

## 5. Quick wins

1. Atualizar `.github/project.yml` incertezas (grupos, Socket.IO Flutter).
2. Documentar fluxo degradado insights/chatbot sem Gemini em `api/Documents/Readme.md`.
3. Adicionar guard de ambiente em `reseed-tester.js`.

---

## 6. Roadmap e riscos

| Horizonte | Ação |
|-----------|------|
| Curto | Habilitar ou retirar `/notificacoes`; ADR de deploy (Vercel + Neon + cron). |
| Médio | Separar chaves Gemini; extrair schedulers para worker se houver múltiplas instâncias. |
| Longo | Revisar necessidade de `syncRoutes` ou remover código morto comentado. |

**Riscos residuais:** deploy indefinido; duplicação de cron em múltiplas réplicas; dependência de API externa (Gemini, cotações).

---

*Auditoria somente leitura — nenhum artefato de aplicação foi alterado.*
