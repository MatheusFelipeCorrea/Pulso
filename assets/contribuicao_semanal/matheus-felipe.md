# Matheus Felipe

**Papel:** Back-end / secretário (ata) / Hyperion e board

# Sprint 1

### Semana 1 (25/08 - 31/08)

- Organização do repositório no GitHub (ação da ata).
- Setup Hyperion, Project #726, sync de cards e correções de matching/`reverse`.
- Apresentação do Pulso na apostila (`docs/1`).
- Requisitos na apostila (`docs/3`) **com Alice Shikida** (RF, RNF, restrições, mecanismos).
- Anexar diagramas do Pulso em `docs/4` (artefatos com Vinícius).

**Horas:** 16h

### Semana 2 (01/09 - 07/09)

- Epic de Chatbot no board (`PULSO-EPIC-016`, features 100–105, tasks, protótipo 106) alinhado com Alice.
- Sync reverse/forward e ligação com o quick-add do dashboard.

**Horas:** 12h

### Semana 3 (08/09)

- Reverse sync dos status que o time atualizou no Project; commit `#13/cards`.

**Horas:** 3h

**Total Sprint 1:** 31h

# Sprint 2

- Auth Flutter na mesma API Node (`PULSO-FEAT-107`, tasks 160–162): sessão `X-Pulso-Client: mobile`, secure storage, termos/privacidade, deep links `pulso://`, Google nativo (`pulso.pulso`).
- PR [#296](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/296) → Sprint-2; issues [#292](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/292)–[#295](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/295).
- Cards Hyperion do épico de autenticação e spec `PULSO-107-auth-flutter`.

**Horas:** 18h

**Total Sprint 2:** 18h

# Sprint 3 (16/09 a 30/09)

### Semana 1 (16/09 - 22/09)

- Camada API de transações (`PULSO-FEAT-012`): service, repository, rotas, schemas, filtros — PR [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298).
- Abertura e conferência dos PRs do time na Sprint-3: [#298](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/298)–[#302](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/302) (Alice 013, Sofia 014+017, Maria 016, Vinícius 015).
- Wire-up do módulo na Sprint-3 (rotas, job de recorrência, MainLayout, `/transactions`) — PR [#307](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/307).
- Cards: FEAT-012–017 e **FEAT-108** (mobile + protótipos) · issues [#303](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/303)–[#306](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/306).
- Specs de rastreio: `PULSO-EPIC-003-transacoes` e `PULSO-EPIC-001-autenticacao`.
- Flutter de transações — PR [#309](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/309).

**Horas:** 22h

### Semana 2 (23/09 - 30/09)

- Viagens no web (`PULSO-FEAT-027`/`028`) — PR [#312](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/312).
- Religa metas, viagens e moedas (rotas API, páginas, sidebar) — PRs [#317](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/317)–[#319](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/319).
- Flutter: telas de viagens e grupos + nav (`PULSO-FEAT-110` / TASK-172) — PR [#324](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/324).
- Board Project #726: pente-fino local × board; cards entregues em In Revision; FEAT-109 e FEAT-110 (Flutter metas / viagens e moedas).

**Horas:** 20h

**Total Sprint 3:** 42h

# Sprint 4 (01/10 a 14/10)

### Semana 1 (01/10 - 07/10)

- Desbloqueio do lint da API e do web na pipeline — PR [#347](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/347); reverse sync de status e sprint do Project para os cards.
- Calendário e lembretes no web (`PULSO-FEAT-034`) — PR [#348](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/348) · issue [#47](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/47).
- Religamento de lembretes, calendário, orçamento e planejamento de compra (rotas API, jobs, filas RabbitMQ, páginas, CSS e sidebar) — PR [#353](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/353).
- Flutter: telas de calendário financeiro e lembretes (`PULSO-FEAT-111` / TASK-174) — PR [#356](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/356); ajuste visual de calendário, orçamento e compras para ficar igual à web.
- Abertura e conferência dos PRs do time na Sprint-4 ([#348](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/348)–[#358](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/358)) e cards FEAT-111–113.

**Horas:** 22h

### Semana 2 (08/10 - 14/10)

- Código de conduta, guia de contribuição e fluxo de branch a partir da sprint — PRs [#359](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/359) e [#360](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/360).
- Product CI: Flutter na pipeline, audit fix sem breaking change, cobertura mínima de 89% de linhas por app (API, web e mobile), checagem de formatação e smoke test do RabbitMQ — PRs [#362](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/362) e [#363](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/363).
- Sync de cards automático entre markdown e board (merge por campo, snapshot, duplicatas) — PR [#363](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/363).
- Reversão dos templates de issue enviados por upload — PR [#361](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/361).
- Protótipos de calendário, orçamento e planejamento de compra (claro e escuro) publicados em `docs/prototipos/`.

**Horas:** 20h

**Total Sprint 4:** 42h

# Sprint 5 (15/10 a 04/11)

### Semana 1 (15/10 - 21/10)

- Abertura da branch `Sprint-5` e alinhamento do escopo: dashboard, grupos, dívidas, divisão de despesas e parity Flutter × web.
- Planejamento da ordem de PRs (API/web primeiro, mobile visual depois, parity final).

**Horas:** 8h

### Semana 2 (22/10 - 28/10)

- Dashboard principal (API + web) — PR [#370](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/370).
- Módulos de grupos (API [#371](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/371), web [#372](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/372)), dívidas [#373](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/373) e divisão de despesas [#374](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/374); religamento [#375](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/375) e cobertura/format [#376](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/376).
- Flutter com visual da web: grupos [#377](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/377), dashboard [#378](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/378), dívidas [#379](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/379), divisão [#380](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/380).
- Landing freemium em reais (Free R$ 0 / Premium R$ 50/mês) — PR [#382](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/382); fix de cores [#381](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/381).
- Parity Flutter Sprint-5 (chat Socket.IO, imagem de grupo, import de extrato, gráficos) — PR [#384](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/384); `npm audit fix` — PR [#385](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/385).

**Horas:** 28h

### Semana 3 (29/10 - 04/11) — parcial até 03/11

- UX de conta: perfil + configurações alinhados web × Flutter; exclusão de conta com modal crítico (digitar `APAGAR`) e `DELETE /api/auth/me`.
- Redesign do dashboard Flutter (hero, cards de recurso, barras, donut, saúde, metas, transações) no padrão da web; correção de layout (botões com `minimumSize` infinito).
- Novo `npm audit fix` local nos locks de api/web (sem `--force`); atualização da apostila/relatórios da Sprint 5.
- Aguardando publicação dos protótipos Sprint 5 em `docs/prototipos/` para amarrar na mesma branch de commit.

**Horas:** 18h

**Total Sprint 5:** 54h

# Sprint 6 (05/11 a 18/11) — parcial até 09/11

### Semana 1 (05/11 - 11/11)

Commits (12): `32747b4`, `ca0909d`, `e4d2984`, `fec4035`, `e8b61fb`, `367a3d2`, `0adf04d`, `e883d08`, `2b33c10`, `9d464d9`, `88c574f`, `0aab775`.

- Flutter Sprint 6 (nav, extrato, metas/UX) — PR [#398](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/398).
- Schema/env do Assistente; tela Flutter dos Insights; remoção da cota de regeneração e normalização de projeções na API.
- Prep de hospedagem (Render blueprint + Vercel) — PR [#402](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/402).
- Desbloqueio do Product CI sprint-6 → main (lint, Prettier, teste/cobertura) e merge [#401](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/401).
- Auditoria Hyperion (fases de arquitetura, DevOps e code review).

**Horas:** 24h

**Total Sprint 6 (parcial até 09/11):** 24h
