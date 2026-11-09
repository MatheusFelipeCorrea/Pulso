# Auditoria de segurança — Fase 2: dados sensíveis e integrações

**Produto:** Pulso  
**Locale:** pt-BR  
**Data:** 2026-09-30  
**Overlay:** nenhum  
**Escopo:** API (`Codigo/Pulso/api`), web, mobile — persistência Prisma, PII, Gemini, Google, Duffel/GeoNames, uploads  
**Método:** revisão estática. Sem extração de segredos; apenas tipo e localização.

---

## 1. Resumo executivo

O isolamento de dados financeiros **está implementado no backend** (filtro `usuarioId` em transações, metas, viagens, categorias e tags). Prisma usa queries parametrizadas; o único `$queryRaw` é `SELECT 1` de keepalive. **Não há IDOR confirmado** nesses recursos.

Os problemas desta fase são de **privacidade/LGPD**, **superfície de integração** e **abuso de custo**, não de SQL injection:

- a política de privacidade descreve Gemini, chatbot, Calendar e tokens em `localStorage`, mas o runtime atual não corresponde;
- não há API de exclusão/portabilidade de conta;
- emails aparecem em logs de aviso;
- rotas autenticadas de viagem disparam GeoNames (HTTP por padrão), Wikipedia e Duffel **sem rate limit de aplicação**.

Gemini: chave e modelo existem em configuração; rotas de importação PDF **não estão montadas**. Prompt injection em LLM **N/A no código ativo**.

---

## 2. Escopo e contexto detectado

### Persistência

PostgreSQL (Neon) via Prisma 5.22. Modelos ativos na API: `Usuario`, `ConfiguracaoUsuario`, `TokenRenovacao`, `Transacao`, `Categoria`, `Tag`, `Meta`, `AporteMeta`, `Viagem`, `DespesaViagem`, `ObservacaoViagem`, `MoedaFavorita`, `Notificacao` (via insight). Demais modelos no `schema.prisma` (grupos, dívidas, etc.) **não têm rotas montadas**.

### Integrações descobertas no código ativo

| Integração | Onde | Auth |
|------------|------|------|
| Google OAuth (login) | `passport.js`, `googleOAuth.js` | client id/secret |
| Google ID token (mobile) | `POST /auth/google/mobile` | audiências web/Android/iOS |
| GeoNames | `geonamesProvider.js` | `GEONAMES_USERNAME` |
| Duffel | `duffelProvider.js` | `DUFFEL_ACCESS_TOKEN` |
| Amadeus (legado) | `amadeusProvider.js` | client id/secret |
| AwesomeAPI / Frankfurter | `awesomeApiProvider.js` | pública |
| Wikipedia / Commons | `tripDestinationImageService.js` | User-Agent fixo |
| SMTP | `emailBridge` | `SMTP_*` |
| AES-256-GCM tokens Google Calendar | `googleTokenCrypto.js` | `GOOGLE_TOKENS_ENCRYPTION_KEY` — **rotas de calendário comentadas** |

### Gemini

- Config: `Codigo/Pulso/api/src/config/env.js:55` (`GEMINI_API_KEY_PDF`, `GEMINI_PDF_MODEL`).  
- Exemplo: `Codigo/Pulso/api/.env.example:46-51`.  
- **Uso em `src/`:** nenhum (`grep` sem cliente Generative).  
- Importação: `routes/index.js:21` comenta `importRoutes`.  
- Insights: `insightService.js:55-64` gera texto local (`geradoPor: 'regras'`), tipo `INSIGHT_IA`.

### Itens N/A

- Upload de extrato PDF / prompt injection LLM (código não montado).  
- Webhooks assinados (não há).  
- XSS DOM (`dangerouslySetInnerHTML` ausente no Código).  
- SQL injection via concatenação (não encontrada).

---

## 3. Achados priorizados

### SEC-2-01 — Sem exclusão nem portabilidade de conta (LGPD)

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/web/src/content/legal/privacyPolicy.js:28`, `Codigo/Pulso/web/src/content/legal/privacyPolicy.js:32`, `Codigo/Pulso/web/src/content/legal/termsOfUse.js:32`, `Codigo/Pulso/web/src/utils/confirmDeleteMessages.js:47`, `Codigo/Pulso/api/src/routes/authRoutes.js` (sem DELETE `/me`), `Codigo/Pulso/api/src/repositories/authRepository.js:134` (`deleteUser` só no repositório)  
- **Cenário:** Termos e política prometem encerramento e direitos de eliminação/portabilidade. A UI tem mensagem de exclusão de conta. A API autenticada não expõe delete de usuário; o job `unverifiedAccountCleanupJob.js` existe mas **não é chamado** por `cronController.js` nem por `server.js`.  
- **Impacto:** Inconformidade prática com arts. 18 da LGPD quando o produto for público; dados financeiros ficam até intervenção manual no banco.  
- **Recomendação:** `DELETE /api/auth/me` autenticado (cascade Prisma já tem `onDelete: Cascade` em vários relations) + export JSON. Ligar o cleanup de não verificados no cron diário.  
- **Validação:** Conta some do banco; job diário remove não verificados com mais de 30 dias.

### SEC-2-02 — Política de privacidade desalinhada do runtime (Gemini, tokens, Calendar)

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/web/src/content/legal/privacyPolicy.js:9` (tokens em armazenamento local), `privacyPolicy.js:12` (chatbot/insights IA), `privacyPolicy.js:20` (compartilhamento com Gemini), `insightService.js:63` (`geradoPor: 'regras'`), `Codigo/Pulso/web/src/services/authService.js:72` (tokens **não** vão ao localStorage)  
- **Cenário:** A política afirma cookies/localStorage de tokens, Gemini para insights/chatbot e Calendar. A web usa cookies httpOnly; insights são regras locais; Calendar e import PDF não estão montados. A chave Gemini ainda é variável de ambiente (tipo: API key de modelo; arquivo local `Codigo/Pulso/api/.env`, ignorado pelo gitignore da API).  
- **Impacto:** Base legal e transparência incorretas; usuário consentiria a um tratamento que não ocorre (ou, no futuro, ocorreria sem atualizar a política). Superfície de segredo Gemini existe mesmo sem código.  
- **Recomendação:** Atualizar a política ao que o código faz **hoje**. Remover `GEMINI_API_KEY_PDF` até a feature existir. Quando ligar Gemini, minimização (não enviar PII desnecessária) e isolamento de prompt.  
- **Validação:** Política casa com rotas montadas; env de produção sem chave Gemini se a feature estiver off.

### SEC-2-03 — PII (email) em logs de aplicação

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/services/authService.js:94`, `Codigo/Pulso/api/src/services/authService.js:167`, `Codigo/Pulso/api/src/services/authService.js:349`, `Codigo/Pulso/api/src/utils/logger.js:3`  
- **Cenário:** Falhas de SMTP logam o email em claro. Winston em produção está em `warn`; o transporte é console (agregadores de log da Vercel retêm PII). Já existe `maskEmail` (linhas 31-38) usado só no forgot-password.  
- **Impacto:** Vazamento de emails em incidentes de log, suporte e retenção de provedor de cloud.  
- **Recomendação:** Sempre `maskEmail`; nunca logar tokens, `exchange`, Authorization.  
- **Validação:** Grep de `logger.*email` sem máscara = zero.

### SEC-2-04 — Integrações pagas/pesadas sem rate limit de API

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/routes/viagemRoutes.js:22` (auth+premium, sem limiter), `Codigo/Pulso/api/src/providers/duffelProvider.js:50`, `Codigo/Pulso/api/src/providers/geonamesProvider.js:91`, `Codigo/Pulso/api/src/services/tripDestinationImageService.js:95`, `Codigo/Pulso/api/src/middlewares/authRateLimit.js` (só rotas `/auth/*` listadas)  
- **Cenário:** Usuário PREMIUM (ou FREE após SEC-1-02) pode martelar `/viagens/destinos` e `/viagens/:id/media-passagem`. Há cache in-memory (ineficaz entre isolates). Duffel cobra por request; GeoNames tem cota; Wikipedia pode rate-limitar o IP da Vercel.  
- **Impacto:** Custo financeiro, esgotamento de cota, DoS da função serverless (`maxDuration`).  
- **Recomendação:** Rate limit por `usuarioId` (Redis) nessas rotas; teto diário Duffel; timeout já existe (bom).  
- **Validação:** N-ésima cotação no mesmo minuto retorna 429.

### SEC-2-05 — GeoNames em HTTP por padrão

- **Severidade:** Média  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/providers/geonamesProvider.js:4`, `Codigo/Pulso/api/.env.example:102`  
- **Cenário:** `GEONAMES_BASE_URL` default `http://api.geonames.org`. Username via query. MITM na saída da API pode alterar destinos/coordenadas. `GEONAMES_BASE_URL` é só env, não input do usuário — **não é SSRF clássico**.  
- **Impacto:** Integridade de destinos; username visível em claro na rede.  
- **Recomendação:** Default `https://secure.geonames.org` (ou HTTPS oficial). Não permitir URL arbitrária sem allowlist.  
- **Validação:** Tráfego de busca só em HTTPS.

### SEC-2-06 — Uploads estáticos sem autenticação (dev)

- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/app.js:40`  
- **Cenário:** Fora da Vercel, `/api/uploads/grupos` e `/api/uploads/compras` são `express.static` públicos. Módulo grupos está comentado; risco se arquivos forem colocados nessas pastas.  
- **Impacto:** Leitura de arquivos se o nome for conhecido (IDOR de objeto estático).  
- **Recomendação:** Não servir uploads sem auth; em produção usar Blob com URLs assinadas.  
- **Validação:** GET anônimo → 401.

### SEC-2-07 — Job de limpeza de contas não verificadas não está no cron

- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/jobs/unverifiedAccountCleanupJob.js:10`, `Codigo/Pulso/api/src/controllers/cronController.js:1`  
- **Cenário:** Contas EMAIL não verificadas permanecem indefinidamente (exceto se alguém ligar o job). Combina com enumeração (SEC-1-07) e retenção.  
- **Impacto:** Acúmulo de PII e emails “reservados”.  
- **Recomendação:** Incluir no `daily`.  
- **Validação:** Cron daily incrementa `removidas` em fixtures.

### SEC-2-08 — GET de reset devolve email em claro

- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Evidência:** `Codigo/Pulso/api/src/services/authService.js:369`  
- **Cenário:** Quem possui o token (link de email) vê o email. Redundante e aumenta PII se o GET vazar em log (SEC-1-09).  
- **Impacto:** Confirmação de email associado ao token.  
- **Recomendação:** `{ valid: true }` sem email.  
- **Validação:** Corpo sem PII.

---

## 4. Pontos positivos

- **IDOR:** listagens e mutações amarradas a `usuarioId` (`transactionRepository.js:19-20`, `metaRepository.js:10-11,111-115`, `viagemRepository.js:22-32`, `validarMetaVinculo` em `viagemService.js:65-78`). Serviços de categoria/tag checam dono antes de `update`/`delete`.  
- **Prisma parametrizado:** `$queryRaw` apenas `SELECT 1` (`database.js:30`). Filtros `contains` via Prisma, não string SQL.  
- **Validação Zod** em transações (`transactionSchemas.js`, `limite` max 100), metas (repositório cap 100), viagens.  
- **Criptografia em repouso para tokens Google Calendar:** AES-256-GCM (`googleTokenCrypto.js:4-42`) — pronta para quando o módulo voltar; legado plaintext tratado em `decryptTokens`.  
- **Forgot-password** mascara email na resposta (`authService.js:31-38,331`).  
- **Insights sem envio a LLM** no código atual (`insightService.js:63`).  
- **Timeouts** em GeoNames (8s) e Wikipedia (5s). URLs wiki construídas no servidor (`tripDestinationImageService.js:108-110`), não a partir de URL crua do cliente (SSRF limitado).  
- **Erro 500 genérico** (`errorMiddleware.js:33-36`); stack só no log.

---

## 5. Quick wins

1. `maskEmail` em todos os `logger.warn` de SMTP.  
2. HTTPS no default GeoNames.  
3. Atualizar `privacyPolicy.js` (remover Gemini/localStorage de tokens até existirem).  
4. Rate limit em `/viagens/destinos` e `/media-passagem`.  
5. Ligar `runUnverifiedAccountCleanup` no cron daily.

---

## 6. Roadmap e riscos

| Prazo | Itens |
|-------|--------|
| Imediato | SEC-2-02 (texto legal), SEC-2-03, SEC-2-04 |
| Curto | SEC-2-01, SEC-2-05 |
| Depois | SEC-2-06 a SEC-2-08; threat model Gemini quando import PDF voltar (prompt injection, vazamento de extrato) |

**Riscos residuais:** `xlsx` / `pdfjs-dist` / `multer` ainda nas dependências da API (fase 3) aumentam a chance de reativar parsing inseguro. `tokensGoogle` no schema pode conter legado em claro até migração.

**Pergunta:** haverá go-live com Gemini/import antes da próxima sprint? Se sim, a fase 2 precisa de reauditoria do pipeline PDF (não presente agora).
