# Documentação do Pulso

**Índice da pasta `Documentacao/`** — produto, engenharia, auditorias, diagramas e protótipos.  
Visão geral do repositório: [README na raiz](../README.md)

```
Documentacao/
├── README.md                 ← você está aqui
├── 01-Produto/               Requisitos, regras, roadmap, análise
├── 02-Engenharia/            API, Web, deploy, módulos técnicos, commits
├── 03-Auditorias/            Relatórios históricos + redirect para .github/audits
├── 04-Diagramas/             UML, DER, arquitetura
├── 05-Prototipos/            Telas de referência (PNG)
└── Histórias de Usuário/     → [01-Produto/Historias-de-Usuario/](./01-Produto/Historias-de-Usuario/) (reservado)
```

Código-fonte: [`Codigo/`](../Codigo/) · Epics: [`.github/plans/`](../.github/plans/)

---

## 01 — Produto

| Documento | Conteúdo |
|-----------|----------|
| [Requisitos/Readme.md](./01-Produto/Requisitos/Readme.md) | RFs/RNFs, progresso por módulo |
| [Regras-de-Negocio/RegrasDeNegocio.md](./01-Produto/Regras-de-Negocio/RegrasDeNegocio.md) | Regras de negócio |
| [Roadmap/Roadmap.md](./01-Produto/Roadmap/Roadmap.md) | Fases de implementação |
| [Analise-Produto.md](./01-Produto/Analise-Produto.md) | Gaps e prioridades |

→ [Índice completo da seção](./01-Produto/README.md)

---

## 02 — Engenharia

| Documento | Conteúdo |
|-----------|----------|
| [API/Readme.md](./02-Engenharia/API/Readme.md) | Backend — rotas, services, jobs |
| [API/Database.md](./02-Engenharia/API/Database.md) | Dicionário de dados (Prisma) |
| [Web/Readme.md](./02-Engenharia/Web/Readme.md) | Frontend — rotas, páginas, DS |
| [Deploy/Hospedagem.md](./02-Engenharia/Deploy/Hospedagem.md) | Vercel, Neon, cron |
| [Modulos/Grupos.md](./02-Engenharia/Modulos/Grupos.md) | Deep dive — Grupos |
| [Guia-Commits.md](./02-Engenharia/Guia-Commits.md) | Padrão de mensagens de commit |

Design System (no código): [`Codigo/Pulso/web/src/design-system/README.md`](../Codigo/Pulso/web/src/design-system/README.md)

→ [Índice completo da seção](./02-Engenharia/README.md)

---

## 03 — Auditorias

| Pasta | Conteúdo |
|-------|----------|
| [Product Owner/](./03-Auditorias/Product%20Owner/) | Relatórios PO por módulo (ago/2026) |
| [Application Security/](./03-Auditorias/Application%20Security/) | Fases AppSec (SEC-N-NN) |
| [DevOps/](./03-Auditorias/DevOps/) | CI/CD, cron, FinOps (OPS-N-NN) |
| [Code Review/](./03-Auditorias/Code%20Review/) | Revisão profunda (DEV-N-NN) |
| [UX Design/](./03-Auditorias/UX%20Design/) | Padronização DS (UX-N-NN) |
| [Architecture/](./03-Auditorias/Architecture/) | Arquitetura (ARCH-N-NN) |
| [`.github/audits/`](../.github/audits/) | **Prompts, scanners CI e novos resultados** |

→ [Índice completo da seção](./03-Auditorias/README.md)

---

## 04 — Diagramas · 05 — Protótipos

| Seção | Índice |
|-------|--------|
| Diagramas UML/DER | [04-Diagramas/Readme.md](./04-Diagramas/Readme.md) |
| Telas PNG | [05-Prototipos/Readme.md](./05-Prototipos/Readme.md) |

---

## Atalhos rápidos

| Preciso de… | Vá para… |
|-------------|----------|
| Status dos RFs | [01-Produto/Requisitos/Readme.md](./01-Produto/Requisitos/Readme.md) |
| Como rodar a API | [02-Engenharia/API/Readme.md](./02-Engenharia/API/Readme.md#-como-rodar) |
| Como rodar o front | [02-Engenharia/Web/Readme.md](./02-Engenharia/Web/Readme.md) |
| Schema do banco | [02-Engenharia/API/Database.md](./02-Engenharia/API/Database.md) |
| Deploy produção | [02-Engenharia/Deploy/Hospedagem.md](./02-Engenharia/Deploy/Hospedagem.md) |
| Padrão de commit | [02-Engenharia/Guia-Commits.md](./02-Engenharia/Guia-Commits.md) |
