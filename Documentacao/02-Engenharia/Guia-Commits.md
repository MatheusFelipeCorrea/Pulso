# Guia de commits — Pulso

Padrão adotado a partir de **ago/2026**, baseado em [Conventional Commits](https://www.conventionalcommits.org/), adaptado ao vocabulário do projeto (RFs, RNs, módulos PO).

Objetivo: **rastreabilidade** — saber *o quê* mudou, *por quê* e ligar o commit a requisitos, auditorias ou cards.

---

## Formato

```
<tipo>(<escopo>): <assunto>

[corpo — opcional, mas recomendado em mudanças grandes]

Refs: <referência>

[BREAKING CHANGE: <impacto e ação necessária>]
```

| Parte | Regra |
|-------|--------|
| **Assunto** | Imperativo, presente, ≤ 72 caracteres, sem ponto final |
| **Corpo** | O *porquê* e agrupamento lógico (módulo a módulo); evite listar arquivos |
| **Refs** | Ticket, tag de auditoria, RF/RN ou card GitHub |
| **BREAKING CHANGE** | Só quando há migration obrigatória, API quebrada ou deploy especial |

---

## Tipos

| Tipo | Uso |
|------|-----|
| `feat` | Nova funcionalidade ou RF entregue |
| `fix` | Correção de bug ou achado de auditoria |
| `docs` | Apenas documentação |
| `refactor` | Código sem mudar comportamento observável |
| `test` | Testes (novos ou ajustes) |
| `chore` | Tooling, deps, CI, scripts |
| `perf` | Melhoria de performance |
| `style` | Formatação, CSS, sem lógica |

---

## Escopos sugeridos

Use o **módulo** ou a **camada** mais específica:

| Escopo | Exemplos |
|--------|----------|
| `auth` | Login, OAuth, sessão, cookies |
| `transactions` | CRUD, recorrência, categorias |
| `vt` | Vale Transporte |
| `budget` | Orçamento mensal |
| `goals` | Metas |
| `trips` | Viagens e moedas |
| `groups` | Grupos |
| `reminders` | Lembretes / Google Calendar |
| `debts` | Dívidas pessoais |
| `purchase-planning` | Planejamento de compra |
| `expense-split` | Divisão de despesas |
| `web` | Frontend transversal |
| `api` | Backend transversal |
| `db` | Prisma schema / migrations |
| `docs` | Documentação |
| `po-audit` | Pacote amplo pós-auditoria PO |

Um commit pode usar escopo amplo (`po-audit`) quando agrupa vários módulos de uma mesma entrega; prefira escopos finos em commits menores.

---

## Referências (`Refs`)

Formato livre, mas **consistente**:

| Padrão | Quando |
|--------|--------|
| `Refs: PO-AUDIT-2026-08` | Rodada de auditoria PO |
| `Refs: RF-NOVO-C1` | Requisito funcional novo da auditoria |
| `Refs: RN-135` | Regra de negócio |
| `Refs: #42` | Issue GitHub |
| `Refs: card/dashboard-mvp` | Card em `.github/plans/cards/` |

Várias referências: `Refs: PO-AUDIT-2026-08, RF-NOVO-C1, RN-052`

---

## Exemplos

### Commit pequeno (fix isolado)

```
fix(transactions): preservar histórico ao excluir recorrentes futuras

Aplica UNTIL na mãe e delete só de filhas com data >= corte.

Refs: RF-NOVO-C1, RN-052
```

### Commit de feature

```
feat(groups): rate limit em preview e entrar por código

Limite 20 req/min por usuário autenticado.

Refs: PO-AUDIT-2026-08
```

### Commit só documentação

```
docs(auth): documentar arquitetura de sessão no Database.md

Cookie httpOnly vs persistência opaca em tokens_renovacao.

Refs: RN-135
```

### Commit com breaking change

```
feat(db): unique em viagem.meta_id e viagem_grupo.grupo_id

Refs: PO-AUDIT-2026-08

BREAKING CHANGE: rodar `prisma migrate deploy` (20260804130000, 20260804140000).
```

### Commit amplo (referência real — ago/2026)

```
feat(po-audit): aplicar correções da auditoria PO (M01–M18)

Auth: cookies httpOnly, mutex refresh, loop F5, rate limit por rota,
cadastro resiliente a falha SMTP e job de limpeza de contas não verificadas.

Transações: exclusão recorrente preserva histórico (UNTIL), grupoBeneficio
para categorias custom com VA/VR/VT.

VT: venda CLT com aviso (decisão B), saldo em transação Serializable.
Viagens/Grupos: unique metaId e grupoId, rate limit em preview/entrar,
criação de metas atômica.

Orçamento (orcamentoExcedeRenda), dívidas (reabrir ao excluir pagamento),
planejamento de compra (RN-088/093), lembretes, metas, homepage.

Docs: relatórios PO 00–18, RegrasDeNegocio, prompts, Database/Readme sessão,
redirect pós-login para /transactions.

Refs: PO-AUDIT-2026-08

BREAKING CHANGE: executar `prisma migrate deploy` para migrations
20260804120000, 20260804130000 e 20260804140000.
```

Commit: `5c5fa0c` — usar como modelo para entregas grandes multi-módulo.

---

## Quando dividir commits

| Situação | Preferência |
|----------|-------------|
| Fix urgente em produção | `fix(<escopo>)` sozinho |
| Feature + docs da mesma feature | `feat` + `docs` no mesmo commit ou `docs` logo em seguida |
| Auditoria com 10+ módulos | Um commit amplo **ou** um `feat`/`fix` por módulo — evite misturar refactor não relacionado |
| Migration destrutiva | Sempre `BREAKING CHANGE` explícito |

---

## O que evitar

- `commit`, `ajustes`, `fixss`, `WIP` — sem tipo nem escopo
- Assunto vago: *"correções"* sem escopo
- Corpo que só repete nomes de arquivos (o diff já mostra isso)
- `BREAKING CHANGE` sem instrução de deploy/migration

---

## Comando (PowerShell / Git Bash)

```bash
git commit -m "$(cat <<'EOF'
feat(auth): descrição curta

Corpo opcional com contexto.

Refs: RN-135
EOF
)"
```

No PowerShell, use um here-string:

```powershell
git commit -m @"
feat(auth): descrição curta

Corpo opcional.

Refs: RN-135
"@
```

---

## Onde documentar

Toda documentação markdown do projeto vive em **`Documentacao/`**:

| Pasta | Conteúdo |
|-------|----------|
| `01-Produto/` | Requisitos, regras, roadmap |
| `02-Engenharia/` | API, Web, deploy, módulos técnicos |
| `03-Auditorias/` | Relatórios PO e prompts |
| `04-Diagramas/` · `05-Prototipos/` | UML e telas PNG |

Índice: [../README.md](../README.md) · Commits só de docs: `docs(estrutura): …`
