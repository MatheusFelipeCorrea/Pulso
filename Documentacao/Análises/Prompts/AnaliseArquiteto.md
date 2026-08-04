Atue como um Arquiteto de Software nível Staff, com especialização em arquitetura de sistemas distribuídos, modelagem de domínio (DDD), integração de APIs, persistência relacional (PostgreSQL/Prisma) e front-end SPA (React). Sua missão é realizar uma auditoria arquitetural rigorosa, profunda e propositiva sobre os requisitos e o código do meu projeto, executada em FASES.

Eu possuo um `README.md` (backlog e status report de requisitos), documentação em `Documentacao/` e o código-fonte completo no workspace (`Codigo/Pulso/api`, `Codigo/Pulso/web`).

## 🔧 PROTOCOLO DE EXECUÇÃO EM FASES (OBRIGATÓRIO)

A auditoria é dividida em 3 fases + consolidação. Regras:

- **Execute UMA fase por vez.** Ao final de cada fase, PARE e aguarde meu "OK, próxima fase". NÃO adiante fases.
- **Cada fase gera UM arquivo `.md` próprio** dentro da pasta `xx/` (nomes definidos abaixo).
- **Não resuma. Seja exaustivo.** Se a resposta atingir o limite, continue automaticamente ("Parte 2"...) até concluir a fase inteira.
- **Cite arquivos/linhas específicos** sempre que possível. Para CADA achado descreva: (a) problema arquitetural concreto, (b) impacto em manutenção/escala/consistência, (c) severidade, (d) recomendação com trade-offs explícitos.
- **Escala consistente:** 🔴 Crítico · 🟠 Alto · 🟡 Médio · 🟢 Baixo.
- **ID único por achado:** formato `ARCH-<FASE>-<NN>` (ex: `ARCH-1-01`).

## 📐 ESTRUTURA DE SAÍDA (repetir em TODA fase)

Cada arquivo de fase deve seguir estritamente:

# 🏗️ Sumário — Fase N
1. Contexto e Boundaries do Escopo
2. Top Riscos Arquiteturais da Fase
3. Auditoria de Status (README vs. Realidade Arquitetural)
4. Diagnóstico Detalhado por Domínio (achados `ARCH-N-NN`)
5. 💡 Novos Requisitos Arquiteturais Propostos (RNF ou ADRs sugeridos)
6. Perguntas Clarificadoras específicas da fase

---

## 📂 FASE 1 — Domínio, Camadas e Modelo de Dados
**Arquivo de saída:** `xx/arch-fase-1-dominio-dados.md`

Escopo obrigatório:
- **Boundaries e módulos:** mapa dos 25 módulos vs. bounded contexts reais no código; acoplamento indevido entre domínios (ex.: Orçamento ↔ Planejamento de Compra ↔ Perfil).
- **Camadas API:** controllers → services → repositories — vazamento de Prisma para cima? lógica de negócio no controller? duplicação entre services?
- **Schema Prisma:** normalização, índices, constraints (`@unique`, FKs), enums vs. strings livres; migrations pendentes vs. código; integridade referencial em exclusões em cascata.
- **Regras de negócio:** centralização (`RegrasDeNegocio.md` vs. código); regras espalhadas ou duplicadas (ex.: validação recurso×categoria, limites de metas, VT).
- **Consistência transacional:** onde faltam transações; isolamento Serializable vs. Read Committed; race conditions em saldo, metas de grupo, VT.
- **Estado atual relevante (ago/2026):** cookies httpOnly para sessão; `grupoBeneficio` em categorias; redirects pós-login para `/transactions`; rate limit parcial (auth + grupos).

---

## 📂 FASE 2 — Integrações, Jobs e Runtime Serverless
**Arquivo de saída:** `xx/arch-fase-2-integracoes-runtime.md`

Escopo obrigatório:
- **Integrações externas:** Google OAuth/Calendar, cotações, GeoNames, FIPE, SMTP, Gemini (futuro) — contratos, timeouts, retries, circuit breaker, fallbacks.
- **Jobs e cron:** `recurringTransactions`, limpeza de contas, sync Google — idempotência, proteção de endpoints, cold start Vercel.
- **Serverless constraints:** polling de chat (~3s) vs. WebSocket; rate limit em memória por instância; cache de cotações; implicações de escala horizontal.
- **Front-end:** estrutura de rotas, Redux vs. fetch local, composição de features, `DEFAULT_AUTHENTICATED_ROUTE`, placeholders (`InDevelopmentPage`).
- **API design:** versionamento, paginação consistente, códigos HTTP, shape de erros, DTOs vs. entidades expostas.

---

## 📂 FASE 3 — Escalabilidade, Observabilidade e Evolução
**Arquivo de saída:** `xx/arch-fase-3-escala-evolucao.md`

Escopo obrigatório:
- **Escalabilidade:** gargalos em queries N+1, agregações duplicadas (Dashboard futuro vs. Relatórios), índices ausentes.
- **Multi-tenancy / isolamento:** `usuarioId` em todas as queries; separação pessoal×grupo (RF-098); convites e preview.
- **Observabilidade:** logging estruturado, correlação de requests, métricas de jobs, alertas de falha de sync.
- **Testabilidade arquitetural:** cobertura por camada; testes de integração vs. unitários; mocks de Prisma.
- **Roadmap técnico:** módulos 19–25 (onboarding, import, cartões); decisões ADR pendentes (Redis/Upstash, Dashboard MVP, integração Grupos↔expense-split).
- **Dívida técnica transversal:** scaffolds vazios (T1), concorrência otimista, cache compartilhado (T5).

---

## 📊 CONSOLIDAÇÃO (só quando eu disser "consolidar")
**Arquivo de saída:** `xx/arch-sumario-executivo.md`

Conteúdo: mapa C4 simplificado (contexto + containers); top 10 achados (`ARCH-x-yy`); ADRs recomendados; plano de ação (quick wins × refactors estruturais); dependências entre módulos para Dashboard, Perfil e Insights.

---

**Comece agora pela FASE 1** e gere `xx/arch-fase-1-dominio-dados.md`. Ao terminar, pare e aguarde meu "OK, próxima fase".
