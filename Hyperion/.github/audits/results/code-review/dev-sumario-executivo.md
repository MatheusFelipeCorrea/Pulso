# Code review — Sumário executivo

**Projeto:** Pulso · **Locale:** pt-BR  
**Fases:** 1 backend · 2 frontend (web + Flutter) · 3 testes  
**Modo:** unattended (sem patch)  
**Relatórios:** `dev-fase-1-backend.md`, `dev-fase-2-frontend.md`, `dev-fase-3-testes-integracao.md`

## Qualidade geral

O monorepo tem camadas claras na API, validação Zod e um cliente web maduro em transações/metas. Os defeitos que importam estão em **dinheiro e sessão**: aportes sem isolamento, recorrência que quebra transferência, mês filtrado em UTC no mobile, **logout na web ao recarregar após 15 minutos**, e **parse de valor no Flutter** que pode multiplicar por 100. A suíte de testes está verde exatamente porque **não exercita** esses caminhos.

## Contagem por severidade

| Severidade | Fase 1 | Fase 2 | Fase 3 | **Total** |
|------------|--------|--------|--------|-----------|
| Crítica    | 0      | 0      | 0      | **0**     |
| Alta       | 4      | 4      | 3      | **11**    |
| Média      | 6      | 6      | 4      | **16**    |
| Baixa      | 2      | 2      | 1      | **5**     |
| **Soma**   | **12** | **12** | **8**  | **32**    |

Nenhum achado “Crítica” no sentido de RCE/SQL injection no escopo; o pior impacto é **financeiro + sessão** (Alta).

## Piores bugs confirmados

1. **DEV-2-01** — `GET /auth/me` não dispara refresh; `AuthBootstrap` interpreta 401 como logout. Reload depois que o cookie de access (15 min) some, com refresh ainda válido, **desloga**. Evidência: `web/src/services/api.js:61-73`, `AuthBootstrap.jsx:15-20`. O teste `api.test.js:116-125` **cristaliza** o erro.

2. **DEV-2-02** — `parseMoney` remove todos os `.` antes de converter vírgula. `10.50` no teclado vira **1050** na API. Evidência: `formatters.dart:87-96`.

3. **DEV-1-01** — Aportes em meta: read-modify-write sem `prisma.$transaction`. Dois POSTs simultâneos estouram `valorAlvo`. Evidência: `metaService.js:297-326`.

4. **DEV-1-02** — Job diário de recorrência cria filhas **sem** `recursoDestino`. Transferência recorrente só debita a origem. Evidência: `recurringTransactions.js:70-81`.

5. **DEV-1-03** — Query `periodo=YYYY-MM` (Flutter) usa `new Date(year, month-1, 1)` no fuso do **processo** (UTC na Vercel), não `America/Sao_Paulo`. Transações mudam de mês. Evidência: `transactionRepository.js:30-35`.

6. **DEV-1-08** — `PATCH /auth/me/plano` com `{ plano: "PREMIUM" }` zera o `requirePremium` de `/viagens`. Evidência: `authRoutes.js:78`, `authService.js:540-555`.

7. **DEV-2-03** — Flutter envia viagem só com texto de destino; a API exige sugestão/catálogo (`destinoMeta`). Criar viagem no app falha. Evidência: `trip_repository.dart:56-72` vs `viagemService.js:171-178`.

8. **DEV-2-04** — Flutter `/groups` → `GET /grupos` com a rota **comentada** no backend. Evidência: `group_repository.dart:28-32`, `routes/index.js:39`.

## O que os testes não pegam

- Aportes concorrentes e `periodo` em UTC (DEV-3-01).  
- `parseMoney('10.50')` (DEV-3-02).  
- Refresh no bootstrap web (DEV-3-03 **protege o bug**).  
- Transferência no job de recorrência (DEV-3-04).  
- 19 testes Flutter + analyze limpo **não** cobrem forms nem 404 de grupos.

## Quick wins (ordem sugerida)

1. Refresh em `/auth/me` + inverter teste Vitest.  
2. `parseMoney` + três expects.  
3. Copiar `recursoDestino` no cron.  
4. `periodo` via `dateTimezone`.  
5. Feature-flag em `PATCH /me/plano`.  
6. Esconder Grupos no Flutter / toggle grupo na web.  
7. try/catch na notificação pós-create de transação.

## Roadmap

| Janela | Foco |
|--------|------|
| Agora | Sessão web, parse Flutter, recorrência, plano demo |
| Esta sprint | Transação Prisma nos aportes; timezone insight/job; destinos no form mobile |
| Depois | jti OAuth, grace no refresh, e2e login→transação→meta, ligar `/grupos` ou remover UI |

## Limitações desta auditoria

- Sem execução de testes nesta sessão (revisão estática + evidência `path:line`).  
- Overlay Hyperion: `null`.  
- Módulos HTTP ainda comentados (orçamento, notificações, grupos) avaliados só onde o cliente já chama.

Arquivos gerados em `Hyperion/.github/audits/results/code-review/`.
