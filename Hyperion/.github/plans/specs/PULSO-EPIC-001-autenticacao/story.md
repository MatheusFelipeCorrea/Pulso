# Autenticação (épico)

## Discovery

Base de segurança do Pulso. Cards em `Hyperion/.github/cards/epics/PULSO-EPIC-001.md`.
Spec Flutter já existe em `Hyperion/.github/plans/specs/PULSO-107-auth-flutter/` — esta pasta cobre o épico inteiro (Web + API + mobile).

## User Story

Como **usuário do Pulso (Web ou Flutter)**,
eu quero **cadastrar, verificar e-mail, entrar, recuperar senha e autenticar com Google**,
para que **minha sessão fique segura (cookie httpOnly na Web; secure storage no app) na mesma API Node**.

## Acceptance Criteria (high-level)

- [x] Cadastro e-mail/senha, verificação 24h, seed de categorias, `ConfiguracaoUsuario`
- [x] Login e-mail/nome + senha, “Lembrar-me”, access 15min + refresh rotativo
- [x] Cookies `pulso_access` / `pulso_refresh` na Web
- [x] Google OAuth Passport (SPA) + `POST /auth/google/mobile` (Flutter)
- [x] Recuperação de senha (token 1h) + revoga refresh
- [x] `authMiddleware`, rate limit por rota, replay de refresh → 401 e revoga tudo
- [x] Flutter: `X-Pulso-Client: mobile` devolve tokens no JSON; deep links `pulso://`
- [ ] Job diário de contas e-mail não verificadas > 30 dias (controller slim na Sprint-3 não chama esse job)

## Rastreio

| Card | PR | Status local |
|------|-----|--------------|
| PULSO-EPIC-001 | — | In Progress (cards Web ainda “In Progress”; código na Sprint-2/main) |
| PULSO-FEAT-001 Cadastro | [#284](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/284) | In Progress* |
| PULSO-FEAT-002 Login/JWT | [#286](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/286) | In Progress* |
| PULSO-FEAT-003 Google Web | [#287](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/287) | In Progress* |
| PULSO-FEAT-004 Recuperação | [#288](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/288) [#289](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/289) | In Progress* |
| PULSO-FEAT-005 Guards | [#284](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/284) [#286](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/286) | In Progress* |
| PULSO-FEAT-107 Flutter | [#296](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/296) · issues [#292](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/292)–[#295](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/295) | Done |

\*Código Web/API entregue nos PRs da Sprint-2; o YAML do card não foi marcado Done (Project ainda não sincronizou).

Issue do épico: [#1](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/issues/1).

## Out of Scope

- Módulos financeiros (transações, orçamento, grupos)
- Segundo backend / Firebase Auth
- Trocar o fluxo cookie da Web por localStorage
