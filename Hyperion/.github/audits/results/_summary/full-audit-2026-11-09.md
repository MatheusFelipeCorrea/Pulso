# Auditoria consolidada — Pulso (Hyperion)

**Data:** 2026-11-09  
**Locale:** pt-BR  
**Kit:** `Hyperion/` — saídas em `Hyperion/.github/audits/results/`  
**Produto:** monorepo Pulso — destaque Sprint 6 (Insights, Chatbot, seed/reseed-tester)

---

## Relatórios desta execução

| Dimensão | Arquivo |
|----------|---------|
| Arquitetura | `architecture/architecture-2026-11-09.md` |
| Segurança | `application-security/security-2026-11-09.md` |
| DevOps | `devops/devops-2026-11-09.md` |
| Code review | `code-review/code-review-2026-11-09.md` |
| Product Owner | `product-owner/product-owner-2026-11-09.md` |
| UX / Design | `ux-design/ux-design-2026-11-09.md` |

---

## Tabela de achados por severidade

| ID | Dimensão | Severidade | Título resumido |
|----|----------|------------|-----------------|
| ARCH-002 | Arquitetura | **Alta** | Rota `/notificacoes` desligada com serviços ainda gerando notificações |
| OPS-001 | DevOps | **Alta** | Deploy de produção não definido no repositório |
| OPS-005 | DevOps | **Alta** | `reseed-tester` pode apagar dados sem trava de ambiente |
| SEC-001 | Segurança | **Alta** | Chave Gemini na query string das chamadas HTTP |
| SEC-004 | Segurança | **Alta** | Senha e contas previsíveis no seed (risco em staging público) |
| ARCH-001 | Arquitetura | Média | `project.yml` desatualizado (grupos, Socket.IO Flutter) |
| ARCH-004 | Arquitetura | Média | Uma chave Gemini compartilhada (PDF, chat, insights) |
| ARCH-005 | Arquitetura | Média | Crons no mesmo processo da API |
| ARCH-006 | Arquitetura | Média | Reseed tester poderoso para demo |
| OPS-002 | DevOps | Média | Commands nulos no contrato Hyperion |
| OPS-003 | DevOps | Média | Jobs duplicados se API escalar horizontalmente |
| SEC-002 | Segurança | Média | URLs de educação do LLM sem validação |
| SEC-003 | Segurança | Média | Confirmação de transação proposta pelo chatbot |
| DEV-001 | Code review | Média | Testes chatbot incompletos |
| DEV-002 | Code review | Média | Sem testes Flutter insights/chatbot |
| DEV-005 | Code review | Média | `seed.js` muito grande |
| DEV-006 | Code review | Média | Rotas TEMP/notificações |
| PO-002 | Product Owner | Média | RF-035 parcial |
| PO-003 | Product Owner | Média | Rastreabilidade Hyperion vs código |
| UX-003 | UX | Média | Densidade da tela Insights |
| UX-006 | UX | Média | Links externos sem padrão de aviso |
| SEC-005 | Segurança | Baixa | Guardrails regex bypassável |
| OPS-006 | DevOps | Baixa | RabbitMQ opcional em dev |
| DEV-003 | Code review | Baixa | Parse proposta via comentário HTML |
| PO-004 | Product Owner | Baixa | RF-056 backlog |

---

## Temas transversais

1. **IA híbrida bem arquitetada** — engines determinísticos + Gemini + cache (`InsightSnapshot`) e histórico chat; documentado em `docs/7.solucao.md` e `api/Documents/Readme.md`.
2. **Contrato de governança defasado** — `.github/project.yml` não reflete código pós-Sprint 5/6; afeta PO, arquitetura e agentes Hyperion.
3. **Notificações “meio implementadas”** — criação no backend vs rota HTTP comentada; impacta RF-035 e experiência unificada.
4. **Operação pré-produção** — CI madura, mas falta pipeline de deploy, proteção de scripts destrutivos e estratégia para crons multi-instância.
5. **Segurança LLM** — auth e rate limit corretos; melhorar secrets na chamada Gemini, URLs de educação e confirmação de transações.

---

## Ações priorizadas (ordem sugerida)

| # | Ação | Dono provável | Esforço |
|---|------|---------------|---------|
| 1 | Atualizar `.github/project.yml` (`/discover`) | Tech lead | Baixo |
| 2 | Proteger `reseed-tester.js` (env guard) | Backend | Baixo |
| 3 | Mover API key Gemini para header / SDK | Backend | Baixo |
| 4 | Decisão PO: fechar RF-035 ou habilitar `/notificacoes` | PO + Backend | Médio |
| 5 | Validar URLs `educacao` (https + allowlist) | Backend | Baixo |
| 6 | Documentar e automatizar deploy (Vercel/Neon) | DevOps | Médio |
| 7 | Testes Flutter mínimos insights/chatbot | Mobile | Médio |
| 8 | UX: aviso links externos + simplificar dobra Insights | Web/Mobile | Baixo |

---

## Destaques positivos (Sprint 6)

- RF-048–061 e RF-015 marcados entregues com evidência em `docs/3.requisitos.md`.
- Paridade web + Flutter para `/insights` e `/chatbot` + quick-add.
- `npm run db:reseed-tester` popula demo completa para apresentação.
- CI: API/web/mobile + RabbitMQ smoke + segurança TruffleHog.
- Chatbot com `aria-live`, histórico persistido, rate limit 20/min.

---

## Limitações desta auditoria

- Sem execução de testes ou scans nesta sessão (evidência estática).
- Produção real (URL, secrets, branch protection) parcialmente fora do repo.
- Mobile UX inferida por código, não por sessão visual.

---

*Gerado por auditoria Hyperion unattended — alterações apenas em `Hyperion/.github/audits/results/`.*
