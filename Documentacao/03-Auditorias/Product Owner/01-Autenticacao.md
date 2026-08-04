# 🔐 Módulo 01 — Autenticação — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md) — achados de infraestrutura que afetam este e outros módulos.
> Fontes cruzadas: `Documentacao/01-Produto/Requisitos/Readme.md` (RF-001–006), `Documentacao/01-Produto/Regras-de-Negocio/RegrasDeNegocio.md` (RN-131–143), `Documentacao/01-Produto/Roadmap/Roadmap.md` (Fase 3).
> Código auditado: `api/src/{controllers,services,repositories,routes,schemas,middlewares,utils}/*auth*`, `api/prisma/schema.prisma` (models `Usuario`, `ConfiguracaoUsuario`, `TokenRenovacao`), `web/src/{pages/Login.jsx,pages/Register.jsx,services/authService.js,services/api.js,store/slices/authSlice.js,components/routing/AuthBootstrap.jsx}`.

---

## ✅ Status de implementação (pós-auditoria)

| Item | Ref. | Status | Onde |
|---|---|---|---|
| Sessão em cookie `httpOnly` | T3 / RNF-NOVO-A1 / RN-135 | ✅ Implementado | `api/src/utils/authCookies.js`, `authController.js`, `authMiddleware.js`; front: `api.js` (`withCredentials`), remoção de `localStorage`, OAuth via `?exchange=` + `POST /auth/oauth/exchange` |
| Mutex no refresh token | T4 / RNF-NOVO-A2 | ✅ Implementado | `web/src/services/api.js` — `refreshPromise` deduplica `POST /auth/refresh` |
| Cadastro não deleta conta se email falhar | T6 / RF-NOVO-A3 | ✅ Implementado | `authService.registerUser` retorna `emailPendente: true` |
| P2002 → 409 no cadastro | Gap #2 / T7 | ✅ Implementado | `prismaErrors.js`, `authService.registerUser`, `errorMiddleware.js` |
| RN-140 (bloqueio por conta) | RF-NOVO-A1 | 🗑️ **Removida do escopo** (2026-06) — doc alinhado ao rate-limit de IP existente | `RegrasDeNegocio.md` RN-140 reescrita |
| Rate-limit/cache serverless (Redis) | T5 | ⏸️ **Adiado** — best effort por ora | — |
| Rate-limit separado por rota | RNF-NOVO-A3 | ✅ Implementado | `authRateLimit.js` — 9 instâncias independentes |
| Job limpeza contas não verificadas (30 dias) | RF-NOVO-A3 | ✅ Implementado | `unverifiedAccountCleanupJob.js` + cron daily |
| Loop F5 em sessão expirada | — | ✅ Implementado | `api.js`: `/auth/me` não dispara refresh/redirect agressivo |
| Indicador força de senha no cadastro | RF-NOVO-A4 | ✅ Implementado | `PasswordStrengthHints` + `Register.jsx` |
| Cobertura authController | RNF-NOVO-A4 | ✅ Implementado | `tests/unit/controllers/authController.test.js` |
| Higiene scaffold T1 (API) | T1 | ✅ Implementado | Arquivos `.js` vazios removidos de `api/src/` |
| Doc Google crypto | — | ✅ Atualizado | `Analise-Produto.md`, `Requisitos/Readme.md` |
| "Lembrar-me" 30 dias documentado | RN-134 | ✅ Documentado | `RegrasDeNegocio.md` |

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** o README marca Autenticação como **✅ 6/6 (100%)**. Funcionalmente, os 6 RFs funcionam (registro, Google OAuth, verificação de email, recuperação de senha, JWT+refresh, logout). Pós-auditoria (2026-06 + ago/2026): sessão em cookies `httpOnly` (RN-135 ✅), mutex no refresh (T4 ✅), cadastro resiliente a falha de SMTP (T6 ✅), P2002→409 no cadastro ✅, loop F5 em `/auth/me` corrigido em `api.js`. A regra **RN-140** (bloqueio por conta após 5 falhas) foi **removida do escopo** — proteção de auth fica no rate-limit de IP. Criptografia dos tokens Google (AES-256-GCM) implementada e documentada.

> **Correção (pós-verificação):** uma versão anterior deste relatório afirmava que os testes de Auth tinham 0% de cobertura real, com base nos arquivos `api/src/tests/{controllers,services,integration}/auth*.spec.js`, que de fato estão vazios (0 bytes). Investigação adicional (ver [00-Achados-Transversais.md § T2](./00-Achados-Transversais.md#t2--suíte-de-testes-real-da-api-vive-em-outro-diretório-do-que-o-scaffold-morto)) encontrou que a suíte de testes **real** da API vive em `api/tests/unit/**/*.test.js` (não em `api/src/tests/**/*.spec.js`, que é scaffold morto do achado T1) — `api/tests/unit/authService.test.js` existe, tem 531 linhas, e é executado normalmente pelo Jest (`testMatch: ['**/tests/**/*.test.js']` em `jest.config.js`). RNF-015 (cobertura de testes) **não é invalidada** por este módulo — a ressalva sobre cobertura foi movida para a auditoria transversal de Requisitos Não Funcionais.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código | Veredito |
|---|---|---|---|---|
| RF-001 | Cadastro email/senha | ✅ | `authService.registerUser` (`authService.js:41-106`) — completo, com hash bcrypt(12), token de verificação, seed de categorias padrão | ✅ Confirmado |
| RF-002 | Login Google OAuth 2.0 | ✅ | `authService.authenticateGoogle` (`:406-460`) + Passport strategy — completo, com merge de conta por email | ✅ Confirmado |
| RF-003 | Email de confirmação no cadastro | ✅ | `emailProvider.sendVerificationEmail` chamado em `registerUser`; se falhar, a conta **permanece** com `emailPendente: true` e mensagem orientando reenvio | ✅ Confirmado (corrigido pós-auditoria) |
| RF-004 | Recuperação de senha via email | ✅ | `requestPasswordReset` / `resetPassword` (`:328-404`) — token de 1h, invalida todos os refresh tokens ao trocar a senha (RN-136 ✅) | ✅ Confirmado |
| RF-005 | Sessão via JWT + refresh token | ✅ | Access 15min, refresh rotativo; cookies httpOnly + mutex no interceptor axios | ✅ Confirmado (T3/T4 corrigidos) |
| RF-006 | Logout com invalidação de sessão | ✅ | `logoutUser` revoga o refresh token apresentado (`:310-316`) | 🟡 Parcial — revoga só o token atual, não "todas as sessões"; aceitável para RF-006 como escrito, mas não há opção de "encerrar todas as sessões" em nenhum lugar (nem faria sentido sem tela de perfil) |

**Nota sobre testes:** `api/tests/unit/authService.test.js` (531 linhas) cobre o service de autenticação de forma real e é executado pelo Jest — não avaliamos aqui se cobre também `authController`/o fluxo de integração ponta-a-ponta, mas a alegação de "módulo sem testes" de uma revisão anterior deste documento estava incorreta (baseada nos arquivos mortos de `api/src/tests/`, não na suíte real em `api/tests/`).

**Regras de negócio (RN-131–143) — aderência real:**

| RN | Regra | Realidade |
|---|---|---|
| RN-131 | Senha mín. 8 caracteres, 1 número, 1 maiúscula | 🟡 **Mais estrita que o documentado**: o regex real (`SENHA_FORTE_REGEX`, `authService.js:15-16` e replicado em `authSchemas.js:3-4`) também exige 1 caractere especial (`@$!%*?&#`). Ou a regra de negócio está desatualizada, ou a mensagem de erro/UX não deixa claro esse requisito extra em todos os pontos (ver §2) |
| RN-132 | bcrypt salt rounds = 12 | ✅ `SALT_ROUNDS = 12` (`authService.js:18`) |
| RN-133 | Access token expira em 15 min | ✅ `ACCESS_TOKEN_TTL = '15m'` |
| RN-134 | Refresh expira em 7 dias, rotativo | ✅ confirmado, e ainda existe variante "lembrar-me" de 30 dias (não documentada em nenhum RF/RN) |
| RN-135 | Refresh token em cookie httpOnly | ✅ **Corrigido (2026-06).** Cookies `pulso_access` / `pulso_refresh` (`httpOnly`, `Secure` em prod, `SameSite`) setados em login/refresh/OAuth; front usa `withCredentials` e não persiste tokens em `localStorage` |
| RN-136 | Troca de senha invalida todos os refresh tokens | ✅ `resetPassword` chama `revokeAllRefreshTokensForUser` (`:399`) |
| RN-137 | Conta só ativa após confirmação de email | ✅ `loginUser` rejeita login se `!usuario.verificado` (`:248-253`) |
| RN-138/139 | Login Google cria conta nova / vincula existente | ✅ ambos os branches implementados e testados na lógica (`authenticateGoogle`) |
| RN-140 | Rate-limit de IP nas rotas sensíveis de auth (5 req/min) | ✅ `authSensitiveRateLimit` em `authRoutes.js`. *Bloqueio por conta (5 falhas / 15 min) removido do escopo em 2026-06.* |
| RN-141 | Token de recuperação expira em 1h | ✅ `TOKEN_RESET_TTL_MS = 60*60*1000` |
| RN-142/143 | Exclusão de conta com confirmação "EXCLUIR" | ⏳ Não avaliável ainda — pertence ao Módulo 10 (Perfil), que está 0% implementado. **O README não faz essa ligação**: RN-142/143 aparecem como regra "ativa" no documento de regras, mas dependem de uma tela que nem existe |

**Achado de documentação (resolvido ago/2026):** `Requisitos/Readme.md` e `Analise-Produto.md` já refletem criptografia AES-256-GCM dos tokens Google (`googleTokenCrypto.js`). **Validar em produção:** variável `GOOGLE_TOKENS_ENCRYPTION_KEY` configurada — sem ela, `getKey()` lança exceção.

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. ~~**Cadastro com falha de envio de email destrói a conta silenciosamente.**~~ ✅ **Corrigido (2026-06):** conta permanece com `emailPendente: true`; usuário pode reenviar verificação.
2. ~~**Erro genérico de 500 na concorrência de cadastro.**~~ ✅ **Corrigido (2026-06):** `P2002` → 409 "Este email já está cadastrado".
3. **Nenhum feedback de força de senha em tempo real.** A regra exige maiúscula + minúscula + número + caractere especial (mais estrita do que RN-131 documenta), mas nada nos formulários acusados (`web/src/schemas/authSchemas.js`, telas de cadastro/reset) indica ter um indicador visual de força/checklist — o usuário só descobre o requisito de caractere especial ao errar e ler a mensagem de validação. Atrito evitável.
4. **Double-submit não bloqueado de forma robusta.** Em `Login.jsx`, o botão usa `disabled={!canSubmit}` e `loading={isSubmitting}` — isso cobre o caso comum, mas como o rate limit de IP é compartilhado entre rotas (achado T da seção 1), um usuário que erra a senha 2x, tenta "esqueci minha senha" 2x, e volta pro login uma 5ª vez dentro do mesmo minuto recebe "Muitas tentativas. Aguarde um minuto" mesmo nunca tendo dado 5 tentativas de **login**. A mensagem de erro não deixa claro *por que* ele foi bloqueado, criando confusão real de UX.
5. **Componentes de formulário de Auth (`LoginForm.jsx`, `RegisterForm.jsx`, `ForgotPasswordForm.jsx`, `ResetPasswordForm.jsx`, `VerifyEmailCard.jsx`, `GoogleLoginButton.jsx` e seus `.styles.jsx`) existem no repositório mas estão vazios e não são importados em lugar nenhum** — as páginas (`pages/Login.jsx`, etc.) implementam tudo inline. Não é um bug funcional (confirmado via grep, zero referências), mas é uma pegadinha de manutenção: um dev (ou uma IA) que abrir esses arquivos pensando que ali está a implementação vai editar código morto e não ver efeito nenhum.
6. **Login por "nome de usuário" é ambíguo.** `authRepository.findByEmailOrNome` (`authRepository.js:35-51`) permite logar tanto por email quanto por `nome` (usando `findFirst` com `mode: insensitive`). Como `nome` **não é único** no schema (`Usuario.nome` não tem `@unique`), dois usuários podem se cadastrar com o mesmo nome de exibição, e o login por nome vai sempre pro primeiro que o banco retornar — o segundo usuário nunca conseguirá logar pelo nome, só pelo email, sem nenhum aviso disso em nenhum lugar da UI.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Resiliência a estados extremos

| Cenário testado (leitura de código) | Comportamento observado | Resiliente? |
|---|---|---|
| Refresh token reapresentado após já ter sido usado (replay de token roubado) | `authService.js:277-282` detecta `stored.revogado` e revoga **toda** a sessão do usuário como medida de segurança | ✅ Correto e documentado no próprio código |
| Duas chamadas de API expiram ao mesmo tempo (access token vencido, 2+ requests em paralelo) | Mutex no interceptor axios deduplica refresh | ✅ **Corrigido (2026-06)** — ver T4 |
| Token de verificação de email expirado | `verifyEmail` (`authService.js:108-136`) trata corretamente: distingue "já verificado" de "expirado" com mensagens diferentes | ✅ |
| Reset de senha com token de outra sessão/já usado | Token é anulado (`tokenResetSenha: null`) após uso — reuso subsequente cai no branch de "inválido ou expirado" | ✅ |
| Cadastro com `senha !== confirmarSenha` | Validado tanto no schema Zod (`authSchemas.js:21-24`) quanto no service (`authService.js:42-44`) — dupla camada, redundante mas não prejudicial | ✅ (validação duplicada front/schema/service — ok, é defesa em profundidade, não é frágil) |
| Muitas tentativas de login incorretas seguidas | Rate-limit de IP (5 req/min nas rotas sensíveis) — sem bloqueio por conta | 🟡 Proteção por IP apenas; RN-140 de bloqueio por conta foi removida do escopo |
| Login com conta Google tentando usar "esqueci minha senha" | `requestPasswordReset` verifica `usuario.provedorAuth !== 'EMAIL'` e retorna a mensagem genérica de sucesso sem enviar nada (`authService.js:337-339`) — previne enumeração de contas Google via forgot-password | ✅ Bom design de segurança (não revela se o email existe nem o provedor) |
| Conta criada por Google tenta logar com "email/senha" | `loginUser` falha em `!usuario.senhaHash` (`:244`) com a mesma mensagem genérica "Email ou senha incorretos" — não revela que a conta é Google-only | ✅ Bom design |
| Timeout do provedor de email no reenvio de verificação | `resendVerificationEmail` propaga erro 503 mas **não deleta a conta** (diferente do fluxo de registro) — inconsistência de tratamento entre os dois fluxos, mas a inconsistência favorece o reenvio (não destrutivo), o que é o comportamento correto; o inconsistente é o registro ser destrutivo | 🟡 Ver gap #1 da seção 2 |

### Validação cruzada e integridade

- **Redundância aceitável:** a validação de senha forte roda em 3 camadas (Zod no schema de rota, regex no service, e presumivelmente no frontend via `web/src/schemas/authSchemas.js`) — isso é defesa em profundidade correta, não uma "regra frágil", desde que as 3 regex fiquem sincronizadas (risco: se uma mudar e as outras não, mensagens de erro divergem entre front e back).
- **Regra frágil identificada:** a checagem de unicidade de email é feita via `findByEmail` **antes** do insert, não via `try/catch` na constraint do banco — isso é uma TOCTOU (time-of-check-to-time-of-use) clássica, coberta na seção 2, gap #2.
- **Regra ausente:** não há verificação de "email descartável"/domínio de lixo eletrônico no cadastro — fora de escopo do MVP provavelmente, mas vale registrar como não-requisito hoje.

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- ~~**RF-NOVO-A1** — Bloqueio de conta por tentativas de login.~~ 🗑️ **Removido do escopo (2026-06)** — decisão: manter só rate-limit de IP (RN-140 reescrita).
- **RF-NOVO-A2** — O sistema deve oferecer "Encerrar todas as sessões" no perfil (depende do Módulo 10), reaproveitando `revokeAllRefreshTokensForUser`, que já existe e está testado no fluxo de troca de senha.
- ~~**RF-NOVO-A3** — Cadastro resiliente a falha de SMTP.~~ ✅ **Implementado (2026-06)** — falta apenas job opcional de limpeza de contas não verificadas após N dias.
- **RF-NOVO-A4** — O sistema deve exibir um indicador de força de senha em tempo real nos formulários de cadastro e redefinição de senha, refletindo exatamente a regra vigente (maiúscula, minúscula, número, caractere especial, 8+ caracteres).

### Não funcionais

- ~~**RNF-NOVO-A1** — Cookies httpOnly.~~ ✅ **Implementado (2026-06)**
- ~~**RNF-NOVO-A2** — Mutex no refresh.~~ ✅ **Implementado (2026-06)**
- **RNF-NOVO-A3 (Segurança)** — ~~Separar o rate limit de autenticação por rota~~ ✅ **Implementado (2026-06)**
- **RNF-NOVO-A4 (Qualidade)** — Confirmar com `--coverage` que `authController` e o fluxo de integração de auth (não só `authService`, que já tem 531 linhas de teste real em `api/tests/unit/authService.test.js`) têm cobertura equivalente — não encontramos um `authController.test.js` dedicado na suíte real, o que vale confirmar antes de considerar o módulo totalmente coberto.
- **RNF-NOVO-A5 (Observabilidade)** — Logar (sem PII sensível) tentativas de login falhas e bloqueios de rate-limit para permitir detecção de credential stuffing — hoje `logger.warn` só é chamado em falhas de envio de email, não em falhas de autenticação.
- **RNF-NOVO-A6 (Operação)** — Validar em startup (não só em uso) que `GOOGLE_TOKENS_ENCRYPTION_KEY` está presente e tem 32 bytes hex — hoje o erro só aparece na primeira tentativa de criptografar/descriptografar um token Google em produção.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🔴 Corrigir armazenamento de sessão para `httpOnly cookie` (RNF-NOVO-A1) | Maior divergência doc↔código do módulo; risco de segurança real (roubo de sessão via XSS) afeta o app inteiro, não só Auth | Médio-Alto (exige mudanças coordenadas front+back+CORS) | ✅ **Feito** |
| 2 | ~~Implementar RN-140 (bloqueio por tentativas)~~ | Removido do escopo — doc alinhado ao rate-limit de IP | — | 🗑️ **Removido** |
| 3 | 🟢 Confirmar cobertura de `authController` (RNF-NOVO-A4) | `authService` já tem teste real substancial; `authController` fica fora do escopo de `collectCoverageFrom` do Jest (que mede só services/utils/jobs/middlewares) — não é uma lacuna crítica, mas vale confirmar que a lógica de tratamento HTTP (status codes, mapeamento de erro) está coberta em algum nível | Baixo |
| 4 | 🟡 Corrigir a race condition de refresh concorrente (RNF-NOVO-A2) | Causa logout inesperado de usuários legítimos; vai piorar conforme mais telas disparem chamadas paralelas (ex.: Dashboard futuro) | Baixo-Médio | ✅ **Feito** |
| 5 | 🟡 Trocar hard-delete por estado "pendente" no cadastro com falha de email (RF-NOVO-A3) | Elimina um beco-sem-saída real de onboarding | Baixo | ✅ **Feito** |
| 6 | 🟡 Separar rate-limit por rota/sensibilidade (RNF-NOVO-A3) | Elimina bloqueios cruzados confusos entre rotas não relacionadas | Baixo | ✅ **Feito** |
| 7 | 🟢 Corrigir docs quanto à criptografia dos tokens Google | Doc alinhada em ago/2026 | Trivial | ✅ **Feito** |
| 8 | 🟢 Remover arquivos mortos do scaffold inicial (componentes/controllers/testes vazios) — ver T1 | Higiene de repositório; elimina risco de confusão em auditorias/manutenções futuras | Baixo, mas transversal a todos os módulos — melhor tratar de uma vez ao final da auditoria completa |
| 9 | 🟢 Adicionar indicador de força de senha (RF-NOVO-A4) | Reduz atrito de cadastro | Baixo | ✅ **Feito** |

---

## 💬 Itens ainda pendentes (fora do escopo desta rodada)

### T5 — Redis/Upstash (rate-limit + cache serverless)

**O que é:** rate-limit e cache de cotação em memória local por instância serverless.

**Decisão atual:** adiar — best effort suficiente para MVP.

### T7 — Viagens e Grupos (regras "só pode existir 1")

**✅ Resolvido (ago/2026):** `@unique(metaId)` em Viagem; `@unique(grupoId)` em ViagemGrupo; metas de grupo com transação Serializable. Ver [05-Viagens-e-Moedas.md](./05-Viagens-e-Moedas.md) e [13-Grupos.md](./13-Grupos.md).

> **Nota de domínio:** VT, VA e VR são **carteiras de benefício** — saldo **não deve ficar negativo**. **Saldo em conta (`DINHEIRO`)** pode ser negativo (comportamento esperado). Prioridade: **integridade de benefícios (VT ✅; VA/VR ainda sem checagem de saldo nas transações)**.

### Futuro

- **"Encerrar todas as sessões"** — depende do Módulo 10 (Perfil); backend (`revokeAllRefreshTokensForUser`) já existe.

---

## ❓ Perguntas clarificadoras

1. O "lembrar-me" (30 dias de refresh token) existe no código mas não está em nenhum RF/RN — é intencional e deveria virar requisito documentado, ou é resquício de uma decisão de implementação não formalizada?
2. Confirma que devo tratar os arquivos vazios do scaffold inicial (T1) como seguros para remoção, ou algum deles é usado por outro processo/branch que eu não veja neste snapshot (ex.: Storybook, testes E2E externos)?

---

*Próximo módulo sugerido: 02 — Dashboard (0% implementado — vale confirmar se há algo além do `InDevelopmentPage` antes de escrever o relatório).*
