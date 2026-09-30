# Tasks — Auth Flutter na mesma API Node

## From Spec

| # | Scenario | Task | Layer | Complexity |
|---|----------|------|-------|------------|
| 1 | 1, 2, 8 | Devolver tokens no JSON quando `X-Pulso-Client: mobile` | API (`authController`) | Low |
| 2 | 1–4, 9 | Init Flutter + Dio + secure storage + interceptor 401 | Mobile | Medium |
| 3 | 1, 5, 6 | Telas cadastro, login, verify, forgot/reset | Mobile | Medium |
| 4 | 7 | `POST /api/auth/google/mobile` + `google_sign_in` | API + Mobile | High |
| 5 | 2, 3, 8 | Testes: JSON mobile vs cookie web; replay refresh | QA | Medium |

## Implementation Order

1. API — JSON de sessão nativa (`respondWithAuthSession` / `refresh`)
2. Flutter scaffold (`Codigo/Pulso/mobile`)
3. Fluxo e-mail/senha (RF-001, 003–006)
4. Deep link ou WebView para verify/reset (e-mails já usam `FRONTEND_URL`)
5. Google nativo (RF-002)
6. Testes unitários API + widget/integration Flutter
