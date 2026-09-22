# Auth Flutter na mesma API Node

## Discovery

Explore na Sprint-2: a API em `Codigo/Pulso/api` já cobre RF-001–006. O app nativo ainda é placeholder em `Codigo/Pulso/mobile`. Apostila: RF-140 + mecanismos 3.4 (JWT cookie na web, secure storage no mobile).

## User Story

Como **usuário do app Flutter**,
eu quero **cadastrar, entrar, recuperar senha e autenticar com Google na mesma API Node da Web**,
para que **a regra de negócio não seja duplicada e a sessão no telefone use secure storage**.

## Acceptance Criteria (high-level)

- [ ] Cadastro, verificação de e-mail, login, refresh, logout e `/me` usam `POST/GET /api/auth/*` existentes
- [ ] Access JWT via `Authorization: Bearer`; refresh via body `refreshToken` (já lidos em `authCookies.js`)
- [ ] Login/refresh/oauth devolvem tokens no JSON para o cliente nativo; Web continua só com cookie
- [ ] Tokens no Flutter ficam em secure storage, nunca em SharedPreferences em texto
- [ ] Google no app usa SDK nativo + validação no Node (não o redirect Passport da SPA)
- [ ] Links de e-mail (verify/reset) abrem o app ou a Web sem quebrar o fluxo já entregue

## Out of Scope

- Outros módulos (dashboard, transações, grupos)
- Segundo backend / BaaS (Firebase Auth, Supabase)
- Alterar o fluxo cookie da Web
- Push notifications / PWA
