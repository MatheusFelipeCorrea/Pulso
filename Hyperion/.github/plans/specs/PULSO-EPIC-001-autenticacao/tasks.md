# Tasks — Autenticação

## From Spec

| # | Scenario | Task | Layer | Card | Complexity |
|---|----------|------|-------|------|------------|
| 1 | 1–5 | Prisma + register/verify/resend + telas | API + Web | FEAT-001 / TASK-001–003 | Medium |
| 2 | 6, 8–11 | Login, cookies, refresh, logout, `/me` | API + Web | FEAT-002 / TASK-004–005 | High |
| 3 | 12 | Passport Google + exchange | API + Web | FEAT-003 / TASK-006–007 | High |
| 4 | 14–15 | Forgot/reset + UX e-mail sent | API + Web | FEAT-004 / TASK-008–009 | Medium |
| 5 | 11, 16–17 | Middleware, rate limit, Protected/Guest | API + Web | FEAT-005 / TASK-010–012 | Medium |
| 6 | 7, 9–10, 13 | JSON mobile + Flutter + Google nativo | API + Mobile | FEAT-107 / TASK-160–162 | High |

Detalhe Flutter: `Hyperion/.github/plans/specs/PULSO-107-auth-flutter/`.

## Implementation Order

1. Modelagem + cadastro/verificação
2. Sessão JWT + cookies + guards
3. Google Web
4. Recuperação de senha
5. Cliente Flutter na mesma API

## Código âncora

| Área | Path |
|------|------|
| Rotas | `Codigo/Pulso/api/src/routes/authRoutes.js` |
| Cookies / Bearer | `Codigo/Pulso/api/src/utils/authCookies.js` |
| Web | `Codigo/Pulso/web/src/pages/{Login,Register,ForgotPassword,ResetPassword,AuthCallback}*` |
| Guards | `Codigo/Pulso/web/src/components/routing/` |
| Flutter | `Codigo/Pulso/mobile/` |
