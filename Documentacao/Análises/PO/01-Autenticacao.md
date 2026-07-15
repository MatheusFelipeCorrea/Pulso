# 🔐 Módulo 01 — Autenticação — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md) — achados de infraestrutura que afetam este e outros módulos.
> Fontes cruzadas: `Documentacao/Requisitos/Readme.md` (RF-001–006), `Documentacao/Regras de Negocio/RegrasDeNegocio.md` (RN-131–143), `Documentacao/Roadmap/Roadmap.md` (Fase 3).
> Código auditado: `api/src/{controllers,services,repositories,routes,schemas,middlewares,utils}/*auth*`, `api/prisma/schema.prisma` (models `Usuario`, `ConfiguracaoUsuario`, `TokenRenovacao`), `web/src/{pages/Login.jsx,pages/Register.jsx,services/authService.js,services/api.js,store/slices/authSlice.js,components/routing/AuthBootstrap.jsx}`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** o README marca Autenticação como **✅ 6/6 (100%)**. Funcionalmente, os 6 RFs realmente funcionam (registro, Google OAuth, verificação de email, recuperação de senha, JWT+refresh, logout). Mas a auditoria encontrou **2 desvios sérios entre o que a documentação garante e o que o código faz**: (a) sessão guardada em `localStorage` em vez do `httpOnly cookie` documentado em RN-135 — risco de roubo de sessão via XSS; (b) a regra RN-140 ("bloquear login após 5 tentativas falhas por 15 min") **não existe no código** — o que existe é um rate-limit de IP genérico e compartilhado entre 9 rotas diferentes, com efeito colateral de bloquear ações não relacionadas. Por outro lado, a criptografia dos tokens do Google (AES-256-GCM) **já está implementada**, contrariando o próprio `Analise-Produto.md`, que ainda lista isso como gap aberto — é um caso de documentação desatualizada "para pior", não "para melhor".

> **Correção (pós-verificação):** uma versão anterior deste relatório afirmava que os testes de Auth tinham 0% de cobertura real, com base nos arquivos `api/src/tests/{controllers,services,integration}/auth*.spec.js`, que de fato estão vazios (0 bytes). Investigação adicional (ver [00-Achados-Transversais.md § T2](./00-Achados-Transversais.md#t2--suíte-de-testes-real-da-api-vive-em-outro-diretório-do-que-o-scaffold-morto)) encontrou que a suíte de testes **real** da API vive em `api/tests/unit/**/*.test.js` (não em `api/src/tests/**/*.spec.js`, que é scaffold morto do achado T1) — `api/tests/unit/authService.test.js` existe, tem 531 linhas, e é executado normalmente pelo Jest (`testMatch: ['**/tests/**/*.test.js']` em `jest.config.js`). RNF-015 (cobertura de testes) **não é invalidada** por este módulo — a ressalva sobre cobertura foi movida para a auditoria transversal de Requisitos Não Funcionais.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código | Veredito |
|---|---|---|---|---|
| RF-001 | Cadastro email/senha | ✅ | `authService.registerUser` (`authService.js:41-106`) — completo, com hash bcrypt(12), token de verificação, seed de categorias padrão | ✅ Confirmado |
| RF-002 | Login Google OAuth 2.0 | ✅ | `authService.authenticateGoogle` (`:406-460`) + Passport strategy — completo, com merge de conta por email | ✅ Confirmado |
| RF-003 | Email de confirmação no cadastro | ✅ | `emailProvider.sendVerificationEmail` chamado em `registerUser`; se falhar, a conta é **excluída** (`:83-100`) | ⚠️ Confirmado, mas com efeito colateral (ver §2) |
| RF-004 | Recuperação de senha via email | ✅ | `requestPasswordReset` / `resetPassword` (`:328-404`) — token de 1h, invalida todos os refresh tokens ao trocar a senha (RN-136 ✅) | ✅ Confirmado |
| RF-005 | Sessão via JWT + refresh token | ✅ | Access 15min (`tokenUtils.js:5`), refresh 7d (30d se "lembrar-me", `:6-7`), rotação single-use (`authService.js:294-302`) | ✅ Confirmado, mas ver **T3** (localStorage) e **T4** (race de refresh) |
| RF-006 | Logout com invalidação de sessão | ✅ | `logoutUser` revoga o refresh token apresentado (`:310-316`) | 🟡 Parcial — revoga só o token atual, não "todas as sessões"; aceitável para RF-006 como escrito, mas não há opção de "encerrar todas as sessões" em nenhum lugar (nem faria sentido sem tela de perfil) |

**Nota sobre testes:** `api/tests/unit/authService.test.js` (531 linhas) cobre o service de autenticação de forma real e é executado pelo Jest — não avaliamos aqui se cobre também `authController`/o fluxo de integração ponta-a-ponta, mas a alegação de "módulo sem testes" de uma revisão anterior deste documento estava incorreta (baseada nos arquivos mortos de `api/src/tests/`, não na suíte real em `api/tests/`).

**Regras de negócio (RN-131–143) — aderência real:**

| RN | Regra | Realidade |
|---|---|---|
| RN-131 | Senha mín. 8 caracteres, 1 número, 1 maiúscula | 🟡 **Mais estrita que o documentado**: o regex real (`SENHA_FORTE_REGEX`, `authService.js:15-16` e replicado em `authSchemas.js:3-4`) também exige 1 caractere especial (`@$!%*?&#`). Ou a regra de negócio está desatualizada, ou a mensagem de erro/UX não deixa claro esse requisito extra em todos os pontos (ver §2) |
| RN-132 | bcrypt salt rounds = 12 | ✅ `SALT_ROUNDS = 12` (`authService.js:18`) |
| RN-133 | Access token expira em 15 min | ✅ `ACCESS_TOKEN_TTL = '15m'` |
| RN-134 | Refresh expira em 7 dias, rotativo | ✅ confirmado, e ainda existe variante "lembrar-me" de 30 dias (não documentada em nenhum RF/RN) |
| RN-135 | Refresh token em cookie httpOnly | ❌ **Não confere.** Ambos os tokens vão para `localStorage` (`web/src/services/authService.js:71-77`, consumidos em `web/src/services/api.js:14,41`). Nenhuma rota do backend seta cookies (`Set-Cookie` não aparece em nenhum controller de auth) |
| RN-136 | Troca de senha invalida todos os refresh tokens | ✅ `resetPassword` chama `revokeAllRefreshTokensForUser` (`:399`) |
| RN-137 | Conta só ativa após confirmação de email | ✅ `loginUser` rejeita login se `!usuario.verificado` (`:248-253`) |
| RN-138/139 | Login Google cria conta nova / vincula existente | ✅ ambos os branches implementados e testados na lógica (`authenticateGoogle`) |
| RN-140 | Bloquear após 5 tentativas falhas por 15 min | ❌ **Não existe.** Não há campo de tentativas no schema (`Usuario` não tem `tentativasFalhas`/`bloqueadoAte`), nenhuma lógica de contagem por conta. O que existe é `authSensitiveRateLimit` — rate limit de **IP** (não de conta), 5 req/min (não 15 min), e a **mesma instância de middleware é compartilhada entre 9 rotas diferentes** (`authRoutes.js`: register, login, refresh, logout, forgot-password, reset-password GET+POST, verify-email, resend-verification) |
| RN-141 | Token de recuperação expira em 1h | ✅ `TOKEN_RESET_TTL_MS = 60*60*1000` |
| RN-142/143 | Exclusão de conta com confirmação "EXCLUIR" | ⏳ Não avaliável ainda — pertence ao Módulo 10 (Perfil), que está 0% implementado. **O README não faz essa ligação**: RN-142/143 aparecem como regra "ativa" no documento de regras, mas dependem de uma tela que nem existe |

**Achado de documentação "para melhor" (raro, mas relevante):** `Analise-Produto.md` linha 62 e `Requisitos/Readme.md` linha 548 listam *"Tokens Google em repouso: JSON sem criptografia (schema prevê criptografia)"* como dívida técnica em aberto. O código mostra o oposto: `api/src/utils/googleTokenCrypto.js` implementa AES-256-GCM com versionamento de envelope (`__enc`) e fallback explícito para dados legados em texto puro — ou seja, **a criptografia já foi implementada e inclusive contempla migração gradual dos tokens antigos**. Isso precisa ser corrigido no `Analise-Produto.md`, mas também levanta a pergunta: a variável de ambiente `GOOGLE_TOKENS_ENCRYPTION_KEY` está de fato configurada em produção? Se a chave não existir, `getKey()` lança exceção (`googleCalendarService.js` via `googleTokenCrypto.js:7-13`) — precisa validação em produção, não só no código.

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Cadastro com falha de envio de email destrói a conta silenciosamente.** Em `registerUser` (`authService.js:83-100`), se `emailProvider.sendVerificationEmail` falhar por qualquer motivo transitório (rate limit do provedor SMTP, timeout, etc.), o backend **deleta o usuário recém-criado** (`authRepository.deleteUser`) e retorna erro genérico 503. Do ponto de vista do usuário: ele preencheu o formulário, recebeu "cadastro não concluído", tenta de novo — e se o provedor de email estiver com problema recorrente (ex.: Mailtrap free tier com limite diário, mencionado no próprio Roadmap), o usuário fica preso em um loop de "tenta cadastrar → falha → conta apagada" sem nenhuma opção de "cadastrar sem verificar agora" ou fila de retry. Esse é exatamente o tipo de "beco sem saída" que o protocolo pede para mapear.
2. **Erro genérico de 500 na concorrência de cadastro.** Se duas requisições de `/auth/register` com o mesmo email chegarem quase simultaneamente (usuário clica duas vezes no botão, ou dá duplo-submit por lentidão de rede), a checagem `findByEmail` (`authService.js:48`) passa para ambas antes que a constraint única do banco seja violada. A segunda `createUser` estoura um erro do Prisma (`P2002`) que **não é um `AppError`** — cai no branch genérico do `errorMiddleware.js:20-27` e retorna "Erro interno do servidor" (500), em vez de "Este email já está cadastrado" (409). Trata-se de uma falha de tratamento de estado concorrente que o protocolo pede para testar explicitamente.
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
| Duas chamadas de API expiram ao mesmo tempo (access token vencido, 2+ requests em paralelo) | Ver **T4** em achados transversais — race condition entre os dois `POST /auth/refresh`, o segundo é tratado como replay e derruba a sessão inteira mesmo sendo o mesmo usuário/dispositivo | ❌ **Não resiliente** — falso positivo de "token roubado" |
| Token de verificação de email expirado | `verifyEmail` (`authService.js:108-136`) trata corretamente: distingue "já verificado" de "expirado" com mensagens diferentes | ✅ |
| Reset de senha com token de outra sessão/já usado | Token é anulado (`tokenResetSenha: null`) após uso — reuso subsequente cai no branch de "inválido ou expirado" | ✅ |
| Cadastro com `senha !== confirmarSenha` | Validado tanto no schema Zod (`authSchemas.js:21-24`) quanto no service (`authService.js:42-44`) — dupla camada, redundante mas não prejudicial | ✅ (validação duplicada front/schema/service — ok, é defesa em profundidade, não é frágil) |
| 5 tentativas de login incorretas seguidas | RN-140 diz que deveria bloquear a conta por 15 min | ❌ **Não implementado** — nenhuma proteção por conta, só rate-limit de IP genérico (ver seção 1) |
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

- **RF-NOVO-A1** — O sistema deve implementar bloqueio de conta por tentativas de login falhas (RN-140 já existe no documento de regras, mas nunca foi implementado): contador de tentativas por `Usuario`, reset no login bem-sucedido, bloqueio de 15 min após a 5ª falha consecutiva, com mensagem clara ao usuário informando quando pode tentar novamente.
- **RF-NOVO-A2** — O sistema deve oferecer "Encerrar todas as sessões" no perfil (depende do Módulo 10), reaproveitando `revokeAllRefreshTokensForUser`, que já existe e está testado no fluxo de troca de senha.
- **RF-NOVO-A3** — O sistema deve permitir que o usuário tente novamente o envio do email de verificação **sem perder os dados de cadastro já preenchidos**, eliminando o hard-delete da conta em caso de falha transitória de SMTP (trocar por: manter conta em estado "aguardando verificação", permitir reenvio manual, e só expirar/limpar contas não verificadas após N dias via job).
- **RF-NOVO-A4** — O sistema deve exibir um indicador de força de senha em tempo real nos formulários de cadastro e redefinição de senha, refletindo exatamente a regra vigente (maiúscula, minúscula, número, caractere especial, 8+ caracteres).

### Não funcionais

- **RNF-NOVO-A1 (Segurança)** — Migrar o armazenamento de `accessToken`/`refreshToken` de `localStorage` para cookie `httpOnly` + `Secure` + `SameSite=Strict/Lax`, conforme já documentado em RN-135 mas não implementado. Prioridade alta: é a maior divergência entre documentação de segurança e código real encontrada neste módulo.
- **RNF-NOVO-A2 (Confiabilidade)** — Adicionar mutex/deduplicação de refresh no interceptor do axios (`web/src/services/api.js`) para eliminar a race condition descrita em T4, evitando logout falso-positivo por concorrência.
- **RNF-NOVO-A3 (Segurança)** — Separar o rate limit de autenticação por rota (ou ao menos por classe de sensibilidade: login/register vs. verify/resend), com uma chave de rate-limit que combine IP + rota, para não bloquear ações não relacionadas entre si.
- **RNF-NOVO-A4 (Qualidade)** — Confirmar com `--coverage` que `authController` e o fluxo de integração de auth (não só `authService`, que já tem 531 linhas de teste real em `api/tests/unit/authService.test.js`) têm cobertura equivalente — não encontramos um `authController.test.js` dedicado na suíte real, o que vale confirmar antes de considerar o módulo totalmente coberto.
- **RNF-NOVO-A5 (Observabilidade)** — Logar (sem PII sensível) tentativas de login falhas e bloqueios de rate-limit para permitir detecção de credential stuffing — hoje `logger.warn` só é chamado em falhas de envio de email, não em falhas de autenticação.
- **RNF-NOVO-A6 (Operação)** — Validar em startup (não só em uso) que `GOOGLE_TOKENS_ENCRYPTION_KEY` está presente e tem 32 bytes hex — hoje o erro só aparece na primeira tentativa de criptografar/descriptografar um token Google em produção.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🔴 Corrigir armazenamento de sessão para `httpOnly cookie` (RNF-NOVO-A1) | Maior divergência doc↔código do módulo; risco de segurança real (roubo de sessão via XSS) afeta o app inteiro, não só Auth | Médio-Alto (exige mudanças coordenadas front+back+CORS) |
| 2 | 🔴 Implementar RN-140 (bloqueio por tentativas) de fato (RF-NOVO-A1) | Regra de negócio já documentada e "esperada" pelo time, mas inexistente — risco de segurança + risco de auditoria externa encontrar a mesma discrepância | Baixo-Médio |
| 3 | 🟢 Confirmar cobertura de `authController` (RNF-NOVO-A4) | `authService` já tem teste real substancial; `authController` fica fora do escopo de `collectCoverageFrom` do Jest (que mede só services/utils/jobs/middlewares) — não é uma lacuna crítica, mas vale confirmar que a lógica de tratamento HTTP (status codes, mapeamento de erro) está coberta em algum nível | Baixo |
| 4 | 🟡 Corrigir a race condition de refresh concorrente (RNF-NOVO-A2) | Causa logout inesperado de usuários legítimos; vai piorar conforme mais telas disparem chamadas paralelas (ex.: Dashboard futuro) | Baixo-Médio |
| 5 | 🟡 Trocar hard-delete por estado "pendente" no cadastro com falha de email (RF-NOVO-A3) | Elimina um beco-sem-saída real de onboarding | Baixo |
| 6 | 🟡 Separar rate-limit por rota/sensibilidade (RNF-NOVO-A3) | Elimina bloqueios cruzados confusos entre rotas não relacionadas | Baixo |
| 7 | 🟢 Corrigir `Analise-Produto.md`/`Requisitos/Readme.md` quanto à criptografia dos tokens Google (já implementada) | Doc desatualizada "para pior" — má impressão gratuita em qualquer auditoria futura | Trivial (é só atualizar o markdown) |
| 8 | 🟢 Remover arquivos mortos do scaffold inicial (componentes/controllers/testes vazios) — ver T1 | Higiene de repositório; elimina risco de confusão em auditorias/manutenções futuras | Baixo, mas transversal a todos os módulos — melhor tratar de uma vez ao final da auditoria completa |
| 9 | 🟢 Adicionar indicador de força de senha (RF-NOVO-A4) | Reduz atrito de cadastro | Baixo |

---

## ❓ Perguntas clarificadoras

1. **`localStorage` foi uma decisão consciente** (ex.: simplicidade para MVP, ou incompatibilidade de cookie cross-site entre domínios Vercel do front e back) **ou é dívida técnica não percebida**? Isso muda a prioridade do item #1 do plano de ação.
2. RN-140 (bloqueio após 5 tentativas) ainda é uma regra que vocês querem manter no roadmap, ou foi conscientemente substituída pelo rate-limit de IP e o documento de regras de negócio só não foi atualizado?
3. O "lembrar-me" (30 dias de refresh token) existe no código mas não está em nenhum RF/RN — é intencional e deveria virar requisito documentado, ou é resquício de uma decisão de implementação não formalizada?
4. Confirma que devo tratar os arquivos vazios do scaffold inicial (T1) como seguros para remoção, ou algum deles é usado por outro processo/branch que eu não veja neste snapshot (ex.: Storybook, testes E2E externos)?

---

*Próximo módulo sugerido: 02 — Dashboard (0% implementado — vale confirmar se há algo além do `InDevelopmentPage` antes de escrever o relatório).*
