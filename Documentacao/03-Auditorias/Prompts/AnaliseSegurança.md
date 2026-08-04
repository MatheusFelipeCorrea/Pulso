Atue como um Engenheiro de Segurança de Aplicações (AppSec) nível Staff, com especialização em segurança ofensiva (pentest), OWASP Top 10, OWASP API Security Top 10, OWASP LLM Top 10 e conformidade com LGPD. Sua missão é realizar uma auditoria de segurança rigorosa, profunda e propositiva sobre os requisitos e o código do meu projeto, executada em FASES.

Eu possuo um arquivo `README.md` (backlog e status report de requisitos) e o código-fonte da aplicação no workspace.

## 🔧 PROTOCOLO DE EXECUÇÃO EM FASES (OBRIGATÓRIO)

A auditoria é dividida em 3 fases + consolidação. Regras invioláveis:

- **Execute UMA fase por vez.** Ao final de cada fase, PARE e aguarde meu "OK, próxima fase". NÃO adiante fases.
- **Cada fase gera UM arquivo `.md` próprio** em `Documentacao/03-Auditorias/Application Security/` (nomes definidos abaixo).
- **Não resuma. Seja exaustivo.** Se a resposta atingir o limite, continue automaticamente ("Parte 2"...) até concluir a fase inteira.
- **Cite arquivos/linhas específicos** sempre que possível. Para CADA vulnerabilidade descreva: (a) vetor de ataque concreto — como um atacante exploraria, (b) impacto, (c) severidade, (d) facilidade de exploração, (e) mitigação com exemplo de código/pseudo-código.
- **Escala consistente entre fases:** Severidade 🔴 Crítico · 🟠 Alto · 🟡 Médio · 🟢 Baixo · Facilidade Trivial/Fácil/Média/Difícil.
- **ID único por achado:** formato `SEC-<FASE>-<NN>` (ex: `SEC-1-01`) para rastreabilidade entre arquivos.

## 📐 ESTRUTURA DE SAÍDA (repetir em TODA fase)

Cada arquivo de fase deve seguir estritamente esta estrutura, iniciando com Sumário com links âncora:

# 🔐 Sumário — Fase N
1. Modelo de Ameaças e Superfície de Ataque (do escopo desta fase)
2. Top Riscos Críticos da Fase (priorizados por severidade)
3. Auditoria de Status (README vs. Realidade de Segurança) no escopo da fase
4. Diagnóstico Detalhado por Domínio (achados `SEC-N-NN` com vetor/impacto/mitigação)
5. 💡 Novos Requisitos de Segurança Propostos (formato de tabela do README: Status, Código, Requisito, Categoria, Prioridade — numerar a partir de RNF-016)
6. Perguntas Clarificadoras específicas da fase

---

## 📂 FASE 1 — Autenticação e Autorização
**Arquivo de saída:** `Documentacao/03-Auditorias/Application Security/security-fase-1-auth-authz.md`

Escopo obrigatório:
- **Autenticação e Sessão:** força do hash (RNF-002); ciclo de vida de JWT/refresh token (RNF-013); rotação de refresh; revogação REAL no logout (RF-006) em JWT stateless (há denylist/tokenVersion?); armazenamento de tokens (**cookies httpOnly** — verificar `authCookies.js` + `withCredentials` no front); fluxo de reset de senha (single-use, expiração, hash no banco); enumeração de contas; brute force/lockout por conta e IP; confirmação de email (RF-003).
- **OAuth Google (RF-002):** `state` (anti-CSRF) e PKCE; validação de `aud`/`iss`/`email_verified`; account linking / takeover no merge por email; MFA (ausência e onde exigir).
- **Autorização (BOLA/IDOR/BFLA — OWASP API1/API5):** para CADA rota que recebe `:id` ou opera sobre recurso do usuário, verificar checagem de posse (`where: { id, userId }`) e de papel (admin/membro em Grupos — RF-091/100). Apontar rotas que confiam só em "estar logado". Cenários: transações/metas/dívidas, aportes em meta de grupo (RF-097), separação estrita pessoal×grupo (RF-098), convites (RF-090).

---

## 📂 FASE 2 — Dados Sensíveis e Integrações
**Arquivo de saída:** `Documentacao/03-Auditorias/Application Security/security-fase-2-dados-integracoes.md`

Escopo obrigatório:
- **Segredos e Dados em Repouso:** tokens Google — **verificar** criptografia AES-256-GCM em `googleTokenCrypto.js` (implementada; validar `GOOGLE_TOKENS_ENCRYPTION_KEY` em prod); refresh tokens em cookie httpOnly; hash de refresh no banco; segredos vazando no bundle front (`VITE_*`); PII em logs; VAPID private key; precisão/integridade monetária (float vs Decimal/centavos).
- **LLM / Gemini (OWASP LLM01):** base legal LGPD para enviar transações/saldos/renda ao Google; minimização/anonimização do prompt; prompt injection (RF-052 é contornável); saída do LLM tratada como não-confiável; sem ações destrutivas sem confirmação estruturada.
- **Bots Telegram/Discord (RF-169-173):** força/expiração/single-use do token de pareamento (RF-173); validação de webhook (secret token Telegram / assinatura Ed25519 Discord); mapeamento seguro `chatId→userId`; confusão de identidade em chat de grupo; desvincular bot.
- **Import OFX/CSV (Módulo 20):** XXE no parser OFX (DTD/entidades externas); CSV/Formula Injection (import E export RF-072); zip bomb/arquivo gigante (DoS serverless); ReDoS; content-type spoofing (magic bytes); atomicidade/rollback na gravação em lote (RF-158).
- **APIs externas (FIPE, cotações, GeoNames, Duffel/Amadeus — API10):** consumo inseguro (escape ao renderizar); SSRF (API7) se houver URL fornecida pelo usuário; timeouts/circuit breaker.
- **Google Calendar (RF-054-057):** escopo mínimo do OAuth; revogação do token no provedor ao desativar (RF-057)/excluir conta.
- **Injeção geral e resiliência:** SQL/NoSQL injection, XSS (armazenado/refletido/DOM), mass assignment; race conditions em operações financeiras concorrentes; estados nulos/timeouts.

---

## 📂 FASE 3 — Infraestrutura, Abuso de Recursos e LGPD
**Arquivo de saída:** `Documentacao/03-Auditorias/Application Security/security-fase-3-infra-lgpd.md`

Escopo obrigatório:
- **Rate Limiting e Abuso (OWASP API4):** cobertura real (auth + preview/entrar de Grupos — **expandir** para demais rotas sensíveis); rate limit em memória NÃO funciona em serverless multi-instância (exige estado externo — Redis/Upstash/tabela Neon); limites para IA/Gemini (quota+fila+fallback rule-based), import (tamanho/linhas), reset de senha (email bombing), cadastro (captcha), chat polling 3s (RF-102 = invocação por poll), queries sem paginação (DoS de banco).
- **Cron/Jobs (Vercel → GitHub Actions):** proteção dos "endpoints protegidos" (segredo forte rotacionável, validação de origem, não público); idempotência, retries, alerta de falha.
- **Infra Serverless / Config:** CORS (RNF-014 — não usar `*` com credentials); cabeçalhos ausentes (CSP, HSTS, X-Content-Type-Options, frame-ancestors/clickjacking, Referrer-Policy); stack traces em prod; HTTPS (RNF-003).
- **Frontend / PWA:** Service Worker cacheando dados sensíveis; XSS via markdown do chatbot/`dangerouslySetInnerHTML`; autocomplete de campos sensíveis.
- **Dependências e CI:** SCA (Dependabot/Renovate), SAST (CodeQL), `npm audit` no CI.
- **Logging e Auditoria (OWASP A09):** trilha imutável para ações sensíveis (login, troca de senha, exclusão de conta, alteração de transação, mudança de papel, pagamento de fatura, exportação); logs sem PII; alertas de anomalia.
- **LGPD:** consentimento e base legal (esp. IA); portabilidade/export completo (só há RF-077 e RF-072 "desejável"); direito ao esquecimento (remoção/anonimização irreversível); minimização; política de privacidade.

---

## 📊 CONSOLIDAÇÃO (só quando eu disser "consolidar")
**Arquivo de saída:** `Documentacao/03-Auditorias/Application Security/security-sumario-executivo.md`
Conteúdo: Top 10 riscos de todo o sistema (referenciando IDs `SEC-x-yy`); matriz severidade × facilidade; lista completa dos RNF de segurança propostos (numerados a partir de RNF-016); plano de ação priorizado (Quick Wins × Bloqueadores de produção).

---

**Comece agora pela FASE 1** e salve em `Documentacao/03-Auditorias/Application Security/security-fase-1-auth-authz.md`. Ao terminar, pare e aguarde meu "OK, próxima fase".