# Overlay Pulso — contexto de domínio para auditorias

Complemento opcional aos prompts genéricos em [`.github/audits/prompts/`](../prompts/README.md).  
**Não** substitui o checklist do prompt. Use só o que for relevante à auditoria em curso.

Índice de overlays: [`README.md`](./README.md) · Config: [`.github/project.yml`](../../project.yml) · Pack: [`.github/INDEX.md`](../../INDEX.md).

Paths e IDs abaixo são do produto Pulso (gestão financeira pessoal).

---

## Comum a todas as auditorias

- **Domínio:** finanças pessoais — receitas, despesas, metas, viagens/moedas, grupos, orçamento, dívidas, vale-transporte, calendário, divisão de despesas, insights/IA, importação.
- **LGPD:** dados financeiros e de identidade; base legal para IA; exportação/esquecimento; minimização ao enviar dados a provedores.
- **Requisitos:** `Documentacao/01-Produto/Requisitos/Readme.md` — prefixos `RF` / `RNF`.
- **Código:** `Codigo/Pulso/api`, `Codigo/Pulso/web`; schema Prisma em `Codigo/Pulso/api/prisma/schema.prisma`.
- **Stack observada:** Vercel (serverless), Neon (PostgreSQL), Prisma, Express, React/Vite, GitHub Actions; integrações Google (OAuth, Calendar), Gemini/IA, bots Telegram/Discord (planejados/parciais), importação OFX/CSV/PDF.
- **Design:** paleta Vital Purple (claro/escuro), design system em `Codigo/Pulso/web/src/design-system/`.
- **Histórico de auditorias:** `Documentacao/03-Auditorias/` (não gravar novos relatórios aí).

---

## Product Owner (`product-owner`)

- Confrontar RFs/RNFs e cards em `.github/plans/cards/` com comportamento real em API/Web.
- Módulos com UI+API utilizáveis (referência ago/2026): autenticação, dashboard, transações, metas, viagens/moedas, lembretes+Google Agenda, VT, orçamento, divisão de despesas, calendário, dívidas, planejamento de compra, homepage, grupos.
- Parciais / placeholder: perfil (RF-073–078), importação (RF-155–158), insights/chatbot (RF-044–053, RF-139), gamificação, relatórios, onboarding (RF-151–154), bots.
- Separação pessoal × grupo (RF-098) e convites/papéis em Grupos.
- Após achados: atualizar seções **Correções PO** / **Rastreamento** nos epics correspondentes.

---

## Application Security (`application-security`)

- Auth: cookies httpOnly, refresh, reset de senha, confirmação de e-mail (RF-003/006); OAuth Google (RF-002) — `state`/PKCE, account linking.
- Autorização: posse por `usuarioId` / papéis em grupos (RF-091/100); aportes em meta de grupo (RF-097); BOLA/IDOR em rotas com `:id`.
- Tokens Google em repouso (AES); rate limit parcial (auth + convites) — limitações de estado em memória no serverless.
- LLM/Gemini (RF-052): LGPD no prompt, injection, saída não confiável.
- Bots Telegram/Discord (RF-169–173): pareamento, webhooks, mapeamento chat↔usuário.
- Import OFX/CSV (módulo 20 / RF-155–158): XXE, formula injection, DoS de arquivo, atomicidade em lote.
- Google Calendar (RF-054–057): escopo OAuth e revogação.
- Jobs/cron protegidos (Vercel → Actions); CORS com credentials (RNF-014).
- LGPD: consentimento IA, portabilidade (RF-072/077), esquecimento.

---

## DevOps / SRE (`devops`)

- Deploy Vercel + banco Neon; migrations Prisma em produção (`migrate deploy` vs `db push`).
- CI: `.github/workflows/ci.yml`, `.github/workflows/security.yml`; Dependabot em `.github/dependabot.yml`.
- Jobs: recorrências (RF-021), lembretes, dívidas (`DIVIDA_COBRANCA`), orçamento, sync Google — idempotência sob retry/schedule.
- Cold start / autosuspend Neon vs SLAs aspiracionais (RNF-001, RNF-009); pooling.
- Free tier: Vercel Hobby, Neon, Actions, Gemini — risco de estouro e FinOps.
- Backup/PITR Neon (RNF-008) e estratégia de restore.

---

## Code Review / Dev Senior (`code-review`)

- Camadas API: controllers → services → repositories (RNF-011); vazamento de Prisma; validação/sanitização (RNF-005).
- Dinheiro e datas: precisão, parcelamentos (RF-135/162), “quem deve a quem” (RF-095/115–120/179), VT (RF-025/063/066), orçamento (RF-109–114), transferências (RF-140), recorrências (RF-021).
- Front: a11y (RNF-010), tema claro/escuro (RF-076), contraste Vital Purple, calendário só-por-cor (RF-122).
- Duplicação transversal de cálculos de parcela/divisão/moeda.

---

## UX / Design System (`ux-design`)

- Padronizar o existente; não redesenhar do zero — ~25 módulos no backlog de produto.
- Tokens Vital Purple vs hex solto; semântica success/danger/warning/info (despesa/receita).
- Telas de referência: `/transactions`, `/budget`, `/calendar`, `/debts`, `/goals`, `/trips`, `/groups`, landing.
- Responsividade RNF-006 (360px→1920px); sidebar; contraste `#7C3AED` / `#A78BFA`; diferenciação além da cor no calendário (RF-122).

---

## Architecture (`architecture`)

- SPA React + API Express em monorepo `Codigo/Pulso/{api,web}`.
- Persistência Prisma/PostgreSQL (Neon); jobs serverless e cold start.
- Multi-tenancy por usuário; domínio pessoal × grupo; convites/preview.
- Integrações externas: Google, IA/Gemini, (planejado) Telegram/Discord, importação em lote, cotações/FIPE quando presentes no código.
- Diagramas de referência em `Documentacao/04-Diagramas/`; engenharia em `Documentacao/02-Engenharia/`.
