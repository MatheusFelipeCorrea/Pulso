# ⚙️ Requisitos Não Funcionais — Auditoria Transversal

> Este documento audita RNF-001 a RNF-016 (`Requisitos/Readme.md`) de forma consolidada, cruzando achados já registrados nos 18 módulos com código e nos achados transversais T1–T7, além de verificações novas feitas especificamente para esta seção.
> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md).

---

## 📋 Sumário

1. [Auditoria RNF a RNF](#1-auditoria-rnf-a-rnf)
2. [Achado destacado: a alegação de cobertura de testes é real, mas com pontos cegos precisos](#2-achado-destacado-cobertura-de-testes)
3. [💡 Novos Requisitos Não Funcionais Propostos](#3-novos-requisitos-não-funcionais-propostos)
4. [Plano de Ação Priorizado](#4-plano-de-ação-priorizado)

---

## 1. Auditoria RNF a RNF

| RNF | Descrição | Status README | Veredito da auditoria |
|---|---|---|---|
| RNF-001 | Resposta ≤ 2s em condições normais | ❌ (aspiracional) | O próprio README já assume isso como aspiracional no free tier (Vercel Hobby + Neon com cold start). A auditoria encontrou pelo menos um ponto que agrava isso: criação de Viagem (Módulo 05) encadeia chamadas síncronas a GeoNames + busca de imagem de capa antes de gravar no banco — sem timeout curto nem fallback assíncrono. Concordamos com o README: não está cumprido, e há um ponto concreto (Viagens) que poderia ser otimizado primeiro. |
| RNF-002 | bcrypt salt rounds ≥ 12 | ✅ | Confirmado (`authService.js`, `SALT_ROUNDS = 12`) — [Módulo 01](./01-Autenticacao.md) |
| RNF-003 | Toda comunicação via HTTPS | ✅ | Não verificável por leitura de código (é infraestrutura da Vercel) — a nota do próprio README ("Vercel força HTTPS automaticamente") é consistente com a plataforma declarada. Sem achado contrário. |
| RNF-004 | Rate limiting para prevenir abuso de API | 🟡 (só rotas de auth, já documentado como dívida) | Confirmado e **agravado** por dois achados desta auditoria: (a) [T5](./00-Achados-Transversais.md#t5) — o rate-limit que existe roda em `MemoryStore`, pouco eficaz em ambiente serverless; (b) [Módulo 13](./13-Grupos.md) — a ausência de rate limit fora de `/auth` tem uma consequência concreta e nomeada: enumeração do espaço de códigos de convite de Grupos (~1M combinações) por qualquer usuário autenticado. |
| RNF-005 | Sanitizar entrada no backend (SQLi/XSS) | ✅ | SQL injection: mitigado estruturalmente pelo uso do Prisma ORM (queries parametrizadas; nenhuma query raw SQL encontrada em nenhum dos 18 módulos auditados). XSS: nenhuma ocorrência de `dangerouslySetInnerHTML` encontrada em todo `web/src` — bom indicador, ainda que não prove ausência de XSS refletido/DOM-based sem uma varredura dinâmica (ex.: OWASP ZAP). Validação de entrada via Zod em praticamente todas as rotas auditadas. Considerar cumprido com boa margem. |
| RNF-006 | Responsivo 360px–1920px | ✅ (não verificável por leitura estática) | Não avaliável com rigor apenas lendo código (depende de CSS computado/breakpoints em runtime) — recomenda-se validação visual (`/verify` ou teste manual em viewport) antes de considerar 100% confirmado. Sem achado contrário. |
| RNF-007 | 500 usuários simultâneos no free tier | ❌ (aspiracional, já documentado) | Reforçado pelo achado T5 — caches/rate-limits em memória por instância tendem a piorar, não melhorar, sob carga distribuída entre múltiplas instâncias serverless. |
| RNF-008 | Backup automático do banco (Neon) | ✅ | Recurso nativo do provedor, não verificável por código. Sem achado contrário. |
| RNF-009 | Disponibilidade mínima 95% mensal | ❌ (aspiracional, já documentado) | Mesma tensão de free tier já reconhecida pelo README. Sem achado adicional. |
| RNF-010 | WCAG 2.1 nível A (contraste, teclado, aria-labels) | 🟡 | Encontramos **565 ocorrências de atributos `aria-*`** distribuídas em 178 arquivos do frontend — densidade razoável, melhor do que o esperado para um projeto neste estágio. Isso não confirma conformidade WCAG completa (contraste de cores e navegação por teclado ponta-a-ponta não são verificáveis por grep) — recomenda-se uma auditoria automatizada (axe-core/Lighthouse) para fechar este item com confiança, mas não há evidência de negligência total como se poderia temer. |
| RNF-011 | Arquitetura em camadas (controller/service/repository) | ✅ | **Confirmado consistentemente nos 18 módulos com código auditados** — todos seguem o padrão controller→service→repository sem misturar responsabilidades (ex.: nenhum controller acessa o Prisma diretamente nos módulos revisados). Um dos pontos mais fortes e consistentes de todo o sistema. |
| RNF-012 | Variáveis de ambiente para credenciais | ✅ | Confirmado — [Módulo 01](./01-Autenticacao.md): `env.js` valida presença das variáveis obrigatórias no boot, sem nenhum fallback hardcoded de secret encontrado em lugar nenhum do código auditado. |
| RNF-013 | JWT expira em 15 min, refresh em 7 dias | ✅ | Confirmado exatamente — [Módulo 01](./01-Autenticacao.md), `tokenUtils.js`. |
| RNF-014 | CORS restrito a origens permitidas | 🟡 | Implementado corretamente **quando a variável `CORS_ORIGIN` está de fato presente** (`app.js:18-26`, aceita uma origem única ou lista). Achado novo desta auditoria: como `env.js` **não encerra o processo** quando uma variável obrigatória falta especificamente em produção na Vercel (comentário no próprio código: *"Não usar `process.exit` no load do módulo — quebra bundle/build serverless"*), um `CORS_ORIGIN` ausente em produção resultaria em `corsOrigins = []` → `origin: undefined` → o pacote `cors` interpreta isso como liberar todas as origens (`*`). Ou seja, a falha do requisito obrigatório de ambiente **falha aberto** (permissivo) em vez de fechado (restritivo) especificamente no cenário de produção Vercel — o único cenário em que essa variável realmente importa. |
| RNF-015 | Cobertura mínima de 85% de testes | 🟡 (plausível, com ressalvas) | Ver seção 2, com correção importante de um achado anterior desta própria auditoria. |
| RNF-016 | Valores monetários como decimal de precisão fixa | ✅ | Confirmado — todo campo monetário do `schema.prisma` **atual** usa `Decimal @db.Decimal(12,2)` (nenhum `Float`). A única exceção encontrada é a migration inicial morta (achado T1), que usa `DOUBLE PRECISION` — mas essa migration não corresponde a nenhuma tabela viva hoje, então não invalida o requisito. Reforçado por implementações corretas de aritmética em centavos inteiros em pelo menos dois módulos ([Divisão de Despesas](./15-Divisao-de-Despesas.md) e [Metas](./04-Metas-Financeiras.md)). |

---

## 2. Achado destacado: cobertura de testes

Esta seção existe porque, durante a auditoria módulo a módulo, uma primeira leitura (registrada no relatório do Módulo 01) concluiu — incorretamente — que a cobertura de testes da API era próxima de 0%, com base nos arquivos `api/src/tests/**/*.spec.js` (25 arquivos, todos vazios). Uma investigação mais ampla, feita especificamente para esta auditoria de NFR, encontrou a suíte de testes **real**: `api/tests/unit/**/*.test.js`, com **84 arquivos e 6.800 linhas**, nenhum vazio, efetivamente executada pelo Jest (`jest.config.js: testMatch: ['**/tests/**/*.test.js']`). O relatório do Módulo 01 e o achado transversal T2 já foram corrigidos para refletir isso.

**Conclusão revisada, com evidência concreta:**
- A alegação de RNF-015 para a API (~95% linhas/~94% statements) **não foi refutada** por esta auditoria — ao contrário, há evidência concreta de uma suíte substancial e real.
- O frontend também tem suíte real: **56 arquivos de teste em `web/tests/`** (não em `web/src/`, onde uma busca ingênua não encontraria nada), configurados via `vite.config.js` (`test.include: ['tests/**/*.test.{js,jsx}', ...]`).
- **Duas ressalvas concretas, não refutações:**
  1. O `collectCoverageFrom` do `jest.config.js` **exclui explicitamente** `gamificationService.js`, `insightService.js`, `googleCalendarService.js` e `googleCalendarSyncService.js` do cálculo de cobertura — todos com lógica de negócio real e não trivial (confirmado nos Módulos 06, 07 e 11). O "~95%" é medido sobre um subconjunto que já deixa de fora essas peças.
  2. Não foi encontrado teste dedicado para `viagemService.js` ([Módulo 05](./05-Viagens-e-Moedas.md)) nem `purchasePlanningService.js` ([Módulo 18](./18-Planejamento-de-Compra.md)) na suíte real, apesar de nenhum dos dois estar na lista de exclusão do Jest — ou seja, se a alegação de 90%+ (o threshold configurado) está realmente sendo atingida, esses dois arquivos substanciais (530 e 380 linhas de service, respectivamente) precisam estar sendo cobertos por algum caminho que não localizamos, ou o número real de cobertura é mais baixo do que o threshold configurado permite.

**Recomendação prática:** rodar `npx jest --coverage` de fato (não foi executado nesta auditoria, que se baseou em leitura estática de código) para obter o número real e confirmar especificamente `viagemService.js`/`purchasePlanningService.js`.

**Lição para o processo de auditoria em si:** este é um bom exemplo de por que a existência de arquivos scaffold mortos (achado T1) é perigosa além de "só" sujeira de repositório — ela **enganou esta própria auditoria** na primeira passada. Reforça a recomendação de remoção do T1 com mais urgência do que uma questão só estética.

---

## 3. 💡 Novos Requisitos Não Funcionais Propostos

- **RNF-NOVO-R1 (Segurança)** — `env.js` deve falhar de forma fechada (bloquear requisições, não permitir CORS aberto) quando uma variável de ambiente obrigatória de segurança (`CORS_ORIGIN`, `JWT_SECRET`, etc.) estiver ausente em produção — mesmo no cenário serverless da Vercel em que `process.exit` é evitado. Uma alternativa é o `app.js` verificar essas variáveis específicas no boot e, se ausentes, responder 503 a todas as rotas em vez de operar com defaults permissivos.
- **RNF-NOVO-R2 (Qualidade)** — Adicionar teste dedicado para `viagemService.js` e `purchasePlanningService.js`, os dois services de maior porte identificados sem cobertura confirmada na suíte real.
- **RNF-NOVO-R3 (Qualidade)** — Rodar `npx jest --coverage` regularmente (ex.: como gate de CI) em vez de reportar o número de cobertura como uma alegação de documentação — evita que RNF-015 vire uma afirmação não verificada, como quase aconteceu nesta própria auditoria.
- **RNF-NOVO-R4 (Higiene)** — Remover os 25 arquivos `api/src/tests/**/*.spec.js` vazios (T1) — sua existência já causou uma conclusão incorreta nesta auditoria e continuará confundindo quem não souber da distinção entre os dois diretórios de teste.
- **RNF-NOVO-R5 (Acessibilidade)** — Rodar uma auditoria automatizada (axe-core ou Lighthouse) para confirmar RNF-010 com evidência, complementando a densidade razoável de `aria-*` já encontrada por leitura estática.

---

## 4. Plano de Ação Priorizado

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🔴 Corrigir o comportamento fail-open de CORS quando `CORS_ORIGIN` está ausente em produção (RNF-NOVO-R1) | Risco de segurança real, ainda que dependente de uma falha de configuração — vale eliminar a possibilidade | Baixo |
| 2 | 🟡 Rodar `npx jest --coverage` de fato e confirmar/desmentir a cobertura de `viagemService`/`purchasePlanningService` (RNF-NOVO-R2/R3) | Fecha a única lacuna real e concreta encontrada na alegação de RNF-015 | Baixo (é só rodar o comando; escrever teste se faltar é médio) |
| 3 | 🟡 Remover os 25 `.spec.js` vazios do scaffold morto (RNF-NOVO-R4) | Já causou um erro de leitura nesta própria auditoria; risco de repetir para qualquer pessoa/ferramenta futura | Baixo |
| 4 | 🟢 Auditoria automatizada de acessibilidade (RNF-NOVO-R5) | Fecha RNF-010 com evidência real em vez de inferência por densidade de atributos | Baixo-Médio |
| 5 | 🟢 Considerar migrar rate-limit/cache para um store compartilhado (Redis/Upstash) quando o achado T5 for endereçado | Resolve RNF-004/007 de forma mais estrutural | Médio (depende de decisão de infraestrutura) |

---

## ❓ Perguntas clarificadoras

1. Existe pipeline de CI configurado rodando `jest --coverage` e falhando o build abaixo do threshold (90%), ou o número de cobertura é medido/reportado manualmente de tempos em tempos? Isso muda a confiança que se pode ter no número atualmente documentado.
2. Sobre RNF-014 (CORS fail-open): esse comportamento specific de "não travar o processo em produção Vercel para não quebrar o build" é uma escolha bem entendida pelo time (ex.: sabem que isso abre uma janela de risco se uma env var obrigatória faltar), ou vale reconsiderar a estratégia de startup para esse caso específico?

---

*Próximo passo: consolidação final — sumário executivo cross-módulo, cobrindo os 25 módulos + achados transversais + NFRs.*
