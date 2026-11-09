# Auditoria arquitetural — Sumário executivo

**Produto:** Pulso (monorepo `Codigo/Pulso/{api,web,mobile}` + kit `Hyperion/`)  
**Locale:** pt-BR · **Overlay:** nenhum  
**Contrato:** `.github/project.yml` (nome Pulso; prefixo `ARCH`)  
**Data:** 2026-09-30  
**Fases:** 1 domínio/dados · 2 integrações/runtime · 3 clientes/evolução (sessão única, a pedido)

Relatórios:  
`Hyperion/.github/audits/results/architecture/arch-fase-1-dominio-dados.md`  
`Hyperion/.github/audits/results/architecture/arch-fase-2-integracoes-runtime.md`  
`Hyperion/.github/audits/results/architecture/arch-fase-3-clientes-evolucao.md`

---

## 1. Resumo executivo

A Pulso é um **monólito Node/Express + Prisma/PostgreSQL** com SPA React e app Flutter no **mesmo REST**. O núcleo ligado (auth, transações por recurso VA/VR/dinheiro, metas, moedas, viagens Premium) tem camadas claras, validação Zod, JWT em cookie (web) e Bearer (mobile), e integrações síncronas com fallback (AwesomeAPI→Frankfurter; Duffel→Amadeus→catálogo).

Três riscos estruturais dominam:

1. **Topologia de runtime ambígua** — o código se comporta como Vercel serverless (desliga `node-cron` e Socket.IO) **sem** `vercel.json` de crons no git, e ao mesmo tempo documenta RabbitMQ + processo longo. Ligar `RABBITMQ_URL` enfileira e-mails **sem consumer**.
2. **Contrato partido** — o schema Prisma (grupos, orçamento, dívidas, chat…) está **anos-luz** à frente das rotas ativas; Flutter já navega grupos; a API comenta `/api/grupos` e **não contém** `grupoRoutes.js`; a web tem service sem tela.
3. **Dois ledgers de dinheiro** — aportes de meta atualizam `valorAtual` sem `$transaction` e **não geram** `Transacao`; saldo de carteira e “valor na meta” não se encontram.

A evolução é viável **sem** microserviços: fechar o as-is, escolher um deploy, atomicidade Prisma, OpenAPI do que está ligado, e fatia vertical de grupos **ou** esconder a UI. Diagrama/Gemini/Socket.IO/RabbitMQ são **alvo**, não o sistema observado.

---

## 2. Escopo e contexto detectado

| Item | Valor |
|------|--------|
| Apps | API Express/Prisma/PG; Web React/Vite; Mobile Flutter 3.47 / Dio / go_router |
| Overlay | nenhum |
| Fatos verificados | `/api/grupos` comentado em `routes/index.js`; RabbitMQ opcional e workers **não** iniciados; Flutter no mesmo REST (auth, transações, metas, moedas, viagens; grupos só client); Socket.IO **não** no Flutter **nem** no processo API |
| N/A | Mesh, CQRS, sharding, billing real, APM obrigatório |

**Limitações:** carga e hospedagem pública não observáveis (`project.yml` uncertainties). Avaliação ATAM em `docs/8` é template (Rails/Angular), ignorada como prova.

---

## 3. Achados priorizados (visão cruzada)

Ordenados por severidade global. IDs nas fases.

| ID | Fase | Sev. | Tema |
|----|------|------|------|
| ARCH-2-01 | 2 | Crítica | Vercel desliga cron; `vercel.json` ausente |
| ARCH-1-01 | 1 | Alta | Schema × API (grupos e módulos TEMP) |
| ARCH-1-02 | 1 | Alta | Aporte + `valorAtual` sem transação |
| ARCH-1-03 | 1 | Alta | Meta fora do ledger de `Transacao` |
| ARCH-2-02 | 2 | Alta | Fila de e-mail sem consumer se `RABBITMQ_URL` |
| ARCH-2-03 | 2 | Alta | `jobBridge` require de jobs inexistentes |
| ARCH-2-04 | 2 | Alta | Socket.IO documentado; módulo ausente; incompatível com serverless |
| ARCH-2-05 | 2 | Alta | `PATCH /me/plano` bypassa Premium |
| ARCH-3-01 | 3 | Alta | Sem OpenAPI; três cópias do contrato |
| ARCH-3-02 | 3 | Alta | Grupos: Flutter UI ≠ web página ≠ API |
| ARCH-3-03 | 3 | Alta | Docs/diagramas ≠ código |

Demais achados: Média/Baixa nas fases (decimal/`Number`, caches `Map`, CI sem Flutter, nav morta, ADRs vazias, etc.).

---

## 4. Pontos positivos (arquitetura que já funciona)

- Camadas API reais + isolamento `usuarioId` nas queries ligadas.
- `Decimal(12,2)` no PostgreSQL; índices de listagem.
- Dual auth cookie/Bearer; refresh coordenado nos dois clientes.
- Helmet, CORS, rate limit de auth, cron HTTP com segredo.
- FX e voos **fail-soft** (não derrubam o app se a API externa sumir).
- Flutter por features; design system web; proxy Vite.
- Tela de grupos no Flutter **declara** que a API não está ligada.
- `publishOrRun` é o padrão certo de mensageria — hoje só o ramo direto é seguro.

---

## 5. Quick wins (alto retorno, baixo teatro)

1. **Não** setar `RABBITMQ_URL` até existir worker no mesmo tipo de processo que a API.
2. `$transaction` em aporte/exclusão de meta.
3. Health/ready com `SELECT 1`; parar de logar `/api/docs` inexistente.
4. Esconder grupos no Flutter **ou** ligar 3 endpoints; tirar `/profile` `/settings` da sidebar.
5. Inventário de uma tabela: model Prisma → rota → web → Flutter.
6. Job `flutter test` no GHA; limpar excludes fantasmas do Vitest.
7. ADR de uma página: deploy (Node vs Vercel) + “aporte é caixa ou envelope?”.

---

## 6. Roadmap e riscos

```text
Estabilizar (1–2 sprints)
  ├─ Uma topologia de runtime + crons testáveis
  ├─ Writes compostos atômicos
  └─ Chrome de cliente honesta (nav = rotas reais)

Decidir (ADRs)
  ├─ Serverless XOR Socket.IO/Rabbit no mesmo processo
  ├─ Grupos: dual-table (já no schema) vs Viagem.grupoId
  ├─ Ledger de metas vs planejamento puro
  └─ Grátis vs Premium demo (PATCH)

Estruturar
  ├─ OpenAPI das rotas vivas
  ├─ Fatia grupos API+web+Flutter junta
  ├─ Agregação SQL de saldos (se o histórico crescer)
  └─ Gemini/import só quando a rota existir

Não fazer
  └─ Microserviços, segundo broker, Socket só no Flutter
```

**Riscos residuais:** dependência de AwesomeAPI/Frankfurter sem SLA; Premium honor-system; schema de VT/gamificação fora do recorte da disciplina; possível **subset** de um código maior (services comentados) voltando a explodir o drift.

**Perguntas que mudam o plano:** (1) produção será Vercel? (2) aporte deve debitar recurso? (3) este tree é o recorte final do semestre?

---

## Contagem por arquivo

Ver tabela entregue ao final da sessão (severidade × arquivo × top 3 riscos).
