Atue como um Engenheiro de DevOps / Platform Engineering nível Staff, com especialização em CI/CD, Infrastructure as Code, SRE (confiabilidade), observabilidade e FinOps (otimização de custo em free tier). Sua missão é realizar uma auditoria de engenharia de plataforma rigorosa, profunda e propositiva sobre a pipeline, a infraestrutura e a operação do meu projeto, executada em FASES.

Eu possuo um arquivo `README.md` (backlog e status report) e o código-fonte completo no workspace, incluindo configs de deploy (Vercel), workflows (GitHub Actions), schema/migrations do Prisma e scripts de jobs/cron.

## 🔧 PROTOCOLO DE EXECUÇÃO EM FASES (OBRIGATÓRIO)

Auditoria dividida em 3 fases + consolidação. Regras invioláveis:

- **Execute UMA fase por vez.** Ao final de cada fase, PARE e aguarde meu "OK, próxima fase". NÃO adiante fases.
- **Cada fase gera UM arquivo `.md` próprio** em `Documentacao/03-Auditorias/DevOps/` (nomes abaixo).
- **Não resuma. Seja exaustivo.** Se atingir o limite, continue automaticamente ("Parte 2"...) até concluir a fase.
- **Cite arquivos/linhas específicos** sempre que possível (`.github/workflows/*.yml`, `vercel.json`, `prisma/schema.prisma`, `prisma/migrations/`, scripts de job, `package.json`). Para CADA achado descreva: (a) sintoma concreto no repo, (b) impacto (confiabilidade/custo/velocidade de entrega/risco operacional), (c) severidade, (d) esforço de correção, (e) solução recomendada com exemplo de config/pseudo-código (YAML, script, etc.).
- **Escala consistente:** Severidade 🔴 Crítico · 🟠 Alto · 🟡 Médio · 🟢 Baixo · Esforço Baixo/Médio/Alto.
- **ID único por achado:** formato `OPS-<FASE>-<NN>` (ex: `OPS-1-01`) para rastreabilidade entre arquivos.

## 📐 ESTRUTURA DE SAÍDA (repetir em TODA fase)

Cada arquivo deve seguir esta estrutura, iniciando com Sumário com links âncora:

# ⚙️ Sumário — Fase N
1. Mapeamento do Estado Atual (o que existe hoje no escopo da fase)
2. Diagrama de Fluxo (build→deploy, jobs, ambientes — em texto/mermaid)
3. Gaps e Riscos Priorizados (achados `OPS-N-NN` com sintoma/impacto/solução)
4. Comparativo "Atual × Recomendado" (tabela)
5. 💡 Novos Requisitos Não-Funcionais Propostos (formato de tabela do README: Status, Código, Requisito, Categoria, Prioridade — numerar a partir de RNF-016)
6. Perguntas Clarificadoras específicas da fase

---

## 📂 FASE 1 — CI/CD, Ambientes e Release Management
**Arquivo de saída:** `Documentacao/03-Auditorias/DevOps/devops-fase-1-cicd-ambientes.md`

Escopo obrigatório:
- **Pipeline CI/CD:** mapear o fluxo real (build → lint → type-check → test → deploy). O que existe/falta? Gates obrigatórios (lint bloqueante, gate de cobertura ≥85% RNF-015, type-check, testes) rodam no PR ou só localmente?
- **Qualidade no CI:** testes rodam no pipeline (API Jest ~95% / Web Vitest ~97%)? Há cache de dependências, paralelização, matriz de versões? Tempo de pipeline é aceitável?
- **Deploy (Vercel):** análise de `vercel.json` e config — preview environments por PR, deploy de produção, promoção manual vs automática, proteção de deploy.
- **Migrations Prisma:** como as migrations são aplicadas em produção? Rodam automaticamente no deploy? Há risco de migration destrutiva sem revisão? Estratégia de `migrate deploy` vs `db push`? Seed?
- **Rollback:** existe estratégia de rollback de código E de banco? Migrations são reversíveis?
- **Branching e proteção:** fluxo de branches/PR/merge; proteção de branch `main`; review obrigatório; checks obrigatórios antes do merge; conventional commits/semver.
- **Gestão de ambientes:** separação dev/staging/prod real? Gestão de secrets por ambiente (Vercel env vars por scope); paridade entre ambientes; `.env.example` documentado.

---

## 📂 FASE 2 — Jobs/Cron, Confiabilidade e Resiliência (SRE)
**Arquivo de saída:** `Documentacao/03-Auditorias/DevOps/devops-fase-2-jobs-confiabilidade.md`

Escopo obrigatório:
- **Migração Cron (Vercel Hobby → GitHub Actions):** avaliar a estratégia planejada. Os workflows de schedule são resilientes? GitHub Actions `schedule` tem atraso/skip conhecido sob carga — há tolerância a isso?
- **Idempotência dos jobs:** geração de transações recorrentes (RF-021), lembretes mensais, dívidas (`DIVIDA_COBRANCA`), orçamento, push. Se um job rodar 2× ou for retriado, duplica dados? Há chave de idempotência/lock?
- **Falha parcial:** o que acontece se um job falhar no meio (ex: gerou 50 de 100 recorrências)? Há checkpoint, retry, dead-letter, alerta de falha?
- **Usuário inativo / catch-up:** geração retroativa de recorrentes para usuário ausente 3 meses — gera tudo de uma vez? Há bounding?
- **Confiabilidade de dados:** backup automático do Neon (RNF-008) está configurado e testado? Existe teste de restore (backup não testado = inexistente)? Point-in-time recovery? Retenção?
- **Disaster Recovery:** RPO/RTO definidos? Runbook de incidente? O que fazer se Neon/Vercel cair?
- **Cold start / autosuspend Neon:** impacto do autosuspend na confiabilidade dos jobs e requisições (RNF-001 ≤2s, RNF-009 95% uptime — já reconhecidos como aspiracionais). Estratégias de mitigação (warm-up, connection pooling — PgBouncer/Prisma Data Proxy/Neon pooler).
- **Connection pooling:** serverless abre muitas conexões → esgota limite do Postgres. Como está o pooling hoje?
- **Graceful degradation:** falha de API externa (FIPE, cotações, Gemini) derruba a feature ou degrada com fallback/cache?

---

## 📂 FASE 3 — Observabilidade, FinOps e Automação Operacional
**Arquivo de saída:** `Documentacao/03-Auditorias/DevOps/devops-fase-3-observabilidade-finops.md`

Escopo obrigatório:
- **Logging:** há logging estruturado (JSON) e centralizado? Correlação por request-id? Níveis de log? Logs de serverless são retidos ou somem? (sem PII — cruzar com auditoria de segurança).
- **Métricas:** há métricas de aplicação (latência, taxa de erro, throughput) e de negócio? Como medir os SLAs (RNF-001/009) sem instrumentação?
- **Tracing:** rastreamento de requisição ponta a ponta (front → API → banco → API externa)?
- **Health checks & alertas:** endpoint de health/readiness? Alertas para: deploy falho, job falho, taxa de erro alta, quota de API externa (Gemini/cotações) perto do limite, banco indisponível. Para onde vão os alertas?
- **Monitoramento de uptime:** há monitor externo (ex: cron-job.org/UptimeRobot free) validando os 95% (RNF-009)?
- **FinOps / Free tier:** mapear TODOS os limites do free tier em uso (Vercel Hobby: execuções/GB-hours/bandwidth; Neon: compute-hours/storage; GitHub Actions: minutos; Gemini: RPM/RPD/TPD; email provider). Onde está o risco de estouro primeiro? Há visibilidade de consumo? Alerta antes do limite? Estratégia se estourar (degradar vs pagar).
- **Otimização de custo/recursos:** bundle size do front (impacta bandwidth), cache agressivo (cotações diárias, FIPE mensal — já previsto), N+1 queries no Prisma (impacta compute Neon), imagens/assets.
- **Automação operacional:** tarefas manuais que deveriam ser automatizadas (limpeza de dados — ex: quitadas 180d, notificações 30d; rotação de secrets; renovação de tokens). Há scripts documentados?
- **Documentação operacional:** existe runbook/README de operação? Onboarding de novo dev (como subir localmente, rodar migrations, seed)? Bus factor.

---

## 📊 CONSOLIDAÇÃO (só quando eu disser "consolidar")
**Arquivo de saída:** `Documentacao/03-Auditorias/DevOps/devops-sumario-executivo.md`

Conteúdo: Top 10 riscos operacionais de todo o sistema (referenciando IDs `OPS-x-yy`); matriz severidade × esforço; mapa de limites de free tier com "distância do estouro"; lista completa dos RNF propostos (numerados a partir de RNF-016); roadmap de maturidade DevOps (nível atual → alvo) e plano de ação priorizado (Quick Wins × Investimentos estruturais).

---

**Comece agora pela FASE 1** e salve em `Documentacao/03-Auditorias/DevOps/devops-fase-1-cicd-ambientes.md`. Ao terminar, pare e aguarde meu "OK, próxima fase".
