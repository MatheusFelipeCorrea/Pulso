# 🏗️ Sumário — Fase 2

## 1. Contexto e Boundaries do Escopo

Esta fase cobre integrações externas, jobs, cron, runtime serverless e o comportamento da SPA no front. O recorte foi validado contra os epics de [Lembretes e Google Agenda](.github/plans/cards/[EPIC]%20Lembretes%20e%20Google%20Agenda.md), [Viagens e Moedas](.github/plans/cards/[EPIC]%20Viagens%20e%20Moedas.md) e [Orçamento Mensal](.github/plans/cards/[EPIC]%20Orçamento%20Mensal.md), além dos providers, jobs e hooks reais do código.

O backend opera em modo serverless com cron protegido por segredo em header, e o front faz polling periódico para notificações e mensagens de grupo. Isso significa que a arquitetura real precisa sobreviver a múltiplas instâncias, cold starts e rotas parcialmente em placeholder.

## 2. Top Riscos Arquiteturais da Fase

- Caches e rate limits vivem em memória local de instância; isso reduz a previsibilidade sob escala horizontal.
- Integrações externas usam timeout, mas não há uma política arquitetural uniforme de retry, circuit breaker ou fallback documentado por domínio.
- O front faz polling contínuo em notificações e chat, o que aumenta custo de leitura e amplifica qualquer inconsistência de sincronização.
- Várias rotas autenticadas ainda são placeholders com `InDevelopmentPage`, o que cria diferença entre backlog funcional e experiência entregue.

## 3. Auditoria de Status (README vs. Realidade Arquitetural)

- O epic de lembretes afirma correção de falha Google na criação sem rollback, e o backend já preserva o lembrete com `sincronizado: false` no fluxo de sync.
- O epic de viagens descreve cache de cotações em memória; o provider real confirma esse comportamento.
- O front já opera com sessão em cookies httpOnly e restauração via `/auth/me`, então a navegação autenticada depende de bootstrap de sessão, não de token local.
- A página autenticada padrão é `/transactions`, e o app monta diversas rotas reais, mas ainda mapeia uma lista explícita de rotas para `InDevelopmentPage`.

## 4. Diagnóstico Detalhado por Domínio

### ARCH-2-01 - Cache de integração vive por instância e não por sistema

| Campo | Conteúdo |
|---|---|
| Severidade | 🟠 Alta |
| Problema | O provider de cotações em [awesomeApiProvider.js](Codigo/Pulso/api/src/providers/awesomeApiProvider.js) mantém `cache = new Map()` em memória, com TTL de 5 minutos, e o provider de GeoNames em [geonamesProvider.js](Codigo/Pulso/api/src/providers/geonamesProvider.js) faz o mesmo com TTL de 15 minutos. |
| Impacto | Em ambiente serverless, cada instância possui seu próprio cache. O comportamento observado em produção passa a depender de cold start, afinidade da requisição e concorrência horizontal. Isso reduz a efetividade do cache, aumenta chamadas a terceiros e torna a taxa de sucesso menos previsível. |
| Evidência | O provider de AwesomeAPI usa `axios.get(..., { timeout: 8000 })` e grava em `Map`; GeoNames também faz timeout de 8s e retorna fallback sem um cache compartilhado entre instâncias. |
| Recomendação | Se o volume justificar, mover o cache para um store compartilhado, como Redis/Upstash. Se ainda for cedo, documentar o comportamento como best effort e ajustar limites de uso dos provedores. |
| Trade-off | Cache compartilhado adiciona custo e uma nova dependência; manter em memória é simples, mas incoerente sob escala horizontal e menos confiável em produção. |

### ARCH-2-02 - Rate limit e proteção de cron são válidos, mas continuam best effort de infraestrutura

| Campo | Conteúdo |
|---|---|
| Severidade | 🟡 Média |
| Problema | O rate limit de auth em [authRateLimit.js](Codigo/Pulso/api/src/middlewares/authRateLimit.js) é por rota e por IP, com 5 requisições por minuto, e o rate limit de convite em [grupoInviteRateLimit.js](Codigo/Pulso/api/src/middlewares/grupoInviteRateLimit.js) alterna para `req.user.id` quando autenticado. O cron em [cronAuthMiddleware.js](Codigo/Pulso/api/src/middlewares/cronAuthMiddleware.js) depende de `Authorization: Bearer <CRON_SECRET>`. |
| Impacto | Esses mecanismos funcionam, mas não compõem uma camada de proteção distribuída. Em múltiplas instâncias, o rate limit por IP não representa um limite global, e o cron passa a depender totalmente da configuração correta do segredo de ambiente e do invocador externo. |
| Evidência | O middleware reconhece explicitamente que cada rota sensível tem contador próprio por IP e que o cron falha com 503 se `CRON_SECRET` não existir. |
| Recomendação | Tratar essas proteções como defesa de borda, não como garantia forte do sistema. Se houver crescimento de tráfego ou abuso, migrar para store compartilhado para rate limit e para observabilidade de execução do cron. |
| Trade-off | A solução atual é leve e barata; a alternativa distribuída é mais robusta, porém exige infraestrutura adicional e padronização operacional. |

### ARCH-2-03 - Lembretes e calendário Google já estão bem encapsulados, mas a política de resiliência ainda é parcial

| Campo | Conteúdo |
|---|---|
| Severidade | 🟠 Alta |
| Problema | Em [googleCalendarService.js](Codigo/Pulso/api/src/services/googleCalendarService.js) e [googleCalendarSyncService.js](Codigo/Pulso/api/src/services/googleCalendarSyncService.js), a integração com Google Calendar já trata vários erros específicos e preserva o lembrete local quando o sync falha. O fluxo faz upsert de tokens, tenta criar calendário “Pulso” e usa `withGoogleHandling`, mas não há política única de retry/circuit breaker para todo o módulo. |
| Impacto | A integração é funcional, porém ainda depende de heurísticas locais por método. Sem uma política explícita de reprocessamento e sem retries padronizados, o comportamento diante de instabilidade do Google fica disperso e mais difícil de operar. |
| Evidência | O serviço de sincronização mapeia erros de 401, 403 e `invalid_grant`, e o callback do Google já atualiza a configuração do usuário e cria o calendário dedicado. |
| Recomendação | Consolidar a estratégia de resiliência por tipo de operação: criação, atualização, sync em massa e desconexão. Vale documentar quais chamadas são idempotentes, quais têm retry e quais devem falhar de forma seca. |
| Trade-off | Uma política uniforme reduz variação operacional, mas pode aumentar o esforço de implementação em integrações que hoje já estão estáveis o suficiente para o MVP. |

### ARCH-2-04 - O front depende de polling para atualizações que poderiam ser empurradas por evento

| Campo | Conteúdo |
|---|---|
| Severidade | 🟠 Alta |
| Problema | O hook [useNotifications.js](Codigo/Pulso/web/src/hooks/useNotifications.js) faz polling a cada 30s para contagem, listagem e toasts de notificação. Em [GroupDetailPage.jsx](Codigo/Pulso/web/src/pages/GroupDetailPage.jsx) o chat do grupo também faz polling a cada 3s quando a aba está visível. |
| Impacto | Isso aumenta volume de leitura e torna a experiência sensível à latência da API. Em escala horizontal, o polling amplifica custo e pode mascarar problemas de sincronização, além de dar uma sensação de “quase tempo real” que depende de constante reconsulta. |
| Evidência | O hook de notificações usa `window.setInterval`, e a página de grupo mantém duas rotinas periódicas: uma para buscar o grupo e outra para sincronizar mensagens recentes do chat. |
| Recomendação | Para chat e notificações, avaliar push real ou, no mínimo, um contrato de invalidação mais claro. Se a escolha continuar sendo polling, documentar explicitamente o limite esperado de atraso e o custo aceito por usuário ativo. |
| Trade-off | Polling é simples e compatível com serverless; push melhora UX e reduz chamadas repetidas, mas introduz maior complexidade operacional e de infraestrutura. |

### ARCH-2-05 - O SPA expõe o backlog real por roteamento placeholder

| Campo | Conteúdo |
|---|---|
| Severidade | 🟡 Média |
| Problema | O roteamento em [App.jsx](Codigo/Pulso/web/src/App.jsx) usa `APP_ROUTE_PATHS` e injeta `InDevelopmentPage` para várias rotas autenticadas ainda não materializadas. O destino padrão autenticado continua em `/transactions` em [defaultAuthenticatedRoute.js](Codigo/Pulso/web/src/config/defaultAuthenticatedRoute.js). |
| Impacto | A navegação deixa claro quais módulos existem como intenção de produto, mas ainda não como experiência completa. Isso é útil para o backlog, porém pode confundir usuários e gera uma superfície com aparência de entrega parcial. |
| Evidência | O app já renderiza transações, orçamento, calendário, dívidas, metas, viagens, grupos, planejamento e divisão de despesas, mas o resto cai em placeholder automaticamente. |
| Recomendação | Diferenciar de forma explícita rotas “em desenvolvimento” e rotas “planejadas”, ou esconder as não entregues em produção até que tenham fluxo mínimo utilizável. |
| Trade-off | Mostrar placeholders ajuda descoberta e demo; ocultar reduz ruído e expectativa errada, mas torna o roadmap menos visível dentro da UI. |

### ARCH-2-06 - Cron e jobs existem, mas a operação ainda está centralizada em um único disparo diário

| Campo | Conteúdo |
|---|---|
| Severidade | 🟡 Média |
| Problema | Em [cronController.js](Codigo/Pulso/api/src/controllers/cronController.js), o endpoint `daily` executa vários jobs em lote: orçamento, lembretes, dívidas, limpezas, recorrências e transações recorrentes. O roteamento em [cronRoutes.js](Codigo/Pulso/api/src/routes/cronRoutes.js) expõe apenas `tick` e `daily` sob autenticação por segredo. |
| Impacto | Concentrar tudo em um único disparo simplifica operação, mas cria um ponto de acoplamento entre jobs de natureza diferente. Se um job ficar lento ou falhar, o lote inteiro passa a depender da mesma janela de execução. |
| Evidência | O comentário no controller já caracteriza o `daily` como um “hobby Vercel” diário, e o fluxo chama jobs distintos em sequência. |
| Recomendação | Separar a intenção operacional por categoria de job: manutenção, recorrência, alertas e limpeza. Isso permite escalonar ou reexecutar só a parte necessária sem depender de um superjob diário. |
| Trade-off | Um único entrypoint é simples de manter; vários jobs especializados aumentam a superfície operacional, mas deixam a arquitetura mais resiliente e observável. |

## 5. Novos Requisitos Arquiteturais Propostos

- RNF-I1: todo cache em integração externa deve declarar se é local, compartilhado ou revalidado por request.
- RNF-I2: rate limits e cron precisam ter estratégia de escala documentada: best effort local ou proteção distribuída.
- RNF-I3: chat e notificações devem ter política explícita de atualização: polling, long polling, push ou fallback.
- RNF-I4: jobs devem ser classificados por criticidade e reexecução, não apenas agrupados em um único endpoint diário.
- ADR-I1: decidir se o runtime do produto vai continuar dependente de polling para mensagens e notificações ou se isso será substituído por push em uma etapa posterior.

## 6. Perguntas Clarificadoras específicas da fase

- O cache de cotações e GeoNames pode continuar em memória por enquanto, ou já existe expectativa de compartilhamento entre instâncias?
- O polling de 30s em notificações e 3s no chat é um compromisso intencional do produto, ou isso deve ser reduzido ou substituído por push?
- O cron diário único é uma decisão final de operação, ou os jobs devem ser quebrados por domínio em uma próxima etapa?
- As rotas placeholder devem continuar expostas ao usuário final, ou só servem como scaffold de navegação durante o desenvolvimento?
- A equipe quer uma política formal de retry/circuit breaker para Google Calendar, ou o tratamento atual por método é suficiente para o porte do sistema?

## 7. Alinhamentos do time

- O cache de cotações e GeoNames pode continuar em memória por enquanto; a decisão de store compartilhado fica para estudo futuro, considerando o plano gratuito da Vercel.
- O polling de notificações e chat ainda vai ser estudado antes de padronizar; a direção desejada é ter um padrão único de atualização.
- O cron diário único existe por necessidade do modelo de execução no Vercel, então a consolidação em uma camada única é a estratégia atual.
- As rotas placeholder servem como scaffold por agora e devem ser removidas futuramente.
- Para Google Calendar, a sugestão é adotar retry com limite e backoff pequeno, combinado com tratamento de falha por operação e sem retry agressivo em cadeia.
