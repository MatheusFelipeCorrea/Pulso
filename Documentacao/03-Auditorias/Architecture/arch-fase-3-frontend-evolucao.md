# 🏗️ Sumário — Fase 3

## 1. Contexto e Boundaries do Escopo

Esta fase cobre escalabilidade, multi-tenancy/isolamento, observabilidade, testabilidade arquitetural e o caminho técnico para evolução do produto. O recorte foi validado contra os docs de módulos planejados em [19-25-Modulos-Planejados.md](../Product%20Owner/19-25-Modulos-Planejados.md) e contra os artefatos reais de logging, testes, jobs e agregações do backend e do frontend.

O que aparece aqui não é um bug isolado, mas a qualidade do sistema para crescer sem perder rastreabilidade. O código já está funcional, porém ainda depende demais de processo local, polling, logs textuais e cobertura de teste que não representa todos os serviços críticos.

## 2. Top Riscos Arquiteturais da Fase

- Observabilidade fraca para investigar falhas distribuídas: falta correlação de requisições e estrutura de log.
- A cobertura de testes declarada não representa integralmente o que é mais sensível no domínio, porque vários services relevantes estão excluídos do cálculo.
- Há duplicação de agregações de leitura em mais de um service, o que aumenta risco de drift entre dashboard, calendário e insights.
- O plano técnico dos módulos 19–25 ainda depende de requisitos não escritos e de decisões que hoje só existem como intenção de backlog.
- A orquestração de jobs segue duas superfícies diferentes, local e cron via endpoint, o que fragiliza a previsibilidade operacional.

## 3. Auditoria de Status (README vs. Realidade Arquitetural)

- O documento de módulos planejados reconhece que 19–25 ainda estão sem RN formais, então não existe prontidão plena para implementação sem lacunas de comportamento.
- Os configs de teste do backend e do frontend mostram thresholds claros, mas também mostram exclusões explícitas de serviços importantes em [jest.config.js](Codigo/Pulso/api/jest.config.js#L8-L44) e [vite.config.js](Codigo/Pulso/web/vite.config.js#L16-L49).
- O logger atual em [logger.js](Codigo/Pulso/api/src/utils/logger.js#L3-L21) é funcional, mas ainda é apenas textual e sem contexto de correlação.
- O app já expõe rotas reais e placeholders em [App.jsx](Codigo/Pulso/web/src/App.jsx#L71-L105), então a evolução da SPA já é uma mistura de entrega e scaffold.

## 4. Diagnóstico Detalhado por Domínio

### ARCH-3-01 - Observabilidade textual sem correlação de requisição

| Campo | Conteúdo |
|---|---|
| Severidade | 🟠 Alta |
| Problema | O logger em [logger.js](Codigo/Pulso/api/src/utils/logger.js#L3-L21) escreve timestamp, nível e mensagem em texto plano. O middleware de erro em [errorMiddleware.js](Codigo/Pulso/api/src/middlewares/errorMiddleware.js) e os jobs em [server.js](Codigo/Pulso/api/src/server.js) também logam só mensagens soltas, sem `requestId`, `correlationId`, usuário, jobId ou contexto estruturado. |
| Impacto | Investigar falhas intermitentes entre API, cron, jobs e front fica mais lento e menos confiável. Em ambiente com múltiplas requisições simultâneas, a leitura do log não preserva o encadeamento causal entre um request, seus efeitos colaterais e os jobs que executaram depois. |
| Evidência | Não há middleware de correlação encontrado, nem padrão de JSON log, nem propagação de identificador de request para services e jobs. |
| Recomendação | Adotar logs estruturados com um identificador de correlação por request e contexto adicional por job. Em seguida, padronizar a passagem desse contexto para services e repositórios que executam efeitos colaterais. |
| Trade-off | JSON log e correlação aumentam verbosidade e exigem disciplina operacional, mas aceleram diagnóstico, auditoria e pós-mortem em produção. |

### ARCH-3-02 - Cobertura de testes declarada não inclui parte dos serviços mais sensíveis

| Campo | Conteúdo |
|---|---|
| Severidade | 🟠 Alta |
| Problema | O backend declara thresholds globais em [jest.config.js](Codigo/Pulso/api/jest.config.js#L8-L44), mas exclui explicitamente `insightService.js`, `googleCalendarService.js`, `googleCalendarSyncService.js`, `purchasePlanningService.js` e `viagemService.js` do cálculo. O frontend faz o mesmo em [vite.config.js](Codigo/Pulso/web/vite.config.js#L20-L49), excluindo `viagemService.js`, `moedaService.js`, `syncService.js`, `purchasePlanningService.js` e `expenseSplitService.js`. |
| Impacto | O número de cobertura continua útil como métrica geral, mas deixa de representar exatamente os serviços que concentram regras mais delicadas, integrações externas e leitura agregada. Isso reduz a confiança na cobertura como indicador de prontidão real para evolução. |
| Evidência | Tanto API quanto web têm listas explícitas de exclusão de cobertura, o que desloca o percentual para um subconjunto mais confortável do código. |
| Recomendação | Separar o que é infraestrutura daquilo que é negócio crítico no relatório de cobertura. No mínimo, acompanhar métricas específicas para services excluídos e revisar se as exclusões ainda são justificáveis. |
| Trade-off | Remover exclusões torna a meta mais difícil, mas também mais honesta. Manter a configuração atual protege a métrica de ruído, porém pode esconder dívida real. |

### ARCH-3-03 - Agregações de leitura estão duplicadas entre serviços e podem virar drift de leitura

| Campo | Conteúdo |
|---|---|
| Severidade | 🟡 Média |
| Problema | As mesmas tabelas de transação e saldo são agregadas em mais de um ponto do backend: [calendarService.js](Codigo/Pulso/api/src/services/calendarService.js) soma receitas e despesas por dia/mês; [insightService.js](Codigo/Pulso/api/src/services/insightService.js) calcula o maior gasto do mês; [purchasePlanningService.js](Codigo/Pulso/api/src/services/purchasePlanningService.js) calcula sobra mensal por três meses. |
| Impacto | Isso não é um bug imediato, mas é uma rota clássica para drift semântico quando o Dashboard e futuros painéis passarem a reutilizar essas mesmas noções de saldo, gasto top e média mensal. Também aumenta o custo de manutenção das regras de leitura. |
| Evidência | Cada service mantém sua própria interpretação do mesmo ledger, com consultas agregadas e fórmulas semelhantes, mas sem uma camada de read model unificada. |
| Recomendação | Introduzir um serviço de leitura compartilhado ou uma camada de read model para métricas recorrentes, especialmente para dashboard e insights. |
| Trade-off | Centralizar leitura reduz duplicação e divergência, mas pode adicionar complexidade e uma camada extra de abstração sobre queries já simples. |

### ARCH-3-04 - Orquestração de jobs depende de duas superfícies diferentes e com cadências distintas

| Campo | Conteúdo |
|---|---|
| Severidade | 🟠 Alta |
| Problema | O bootstrap local em [server.js](Codigo/Pulso/api/src/server.js) agenda jobs diretamente com `node-cron`, enquanto o runtime de produção expõe os endpoints `tick` e `daily` em [cronController.js](Codigo/Pulso/api/src/controllers/cronController.js#L14-L67). As duas superfícies não são idênticas: o local roda alertas e limpezas por cron nativo; o endpoint `daily` agrega uma lista diferente de jobs e o `tick` executa só budget + token cleanup. |
| Impacto | A manutenção de jobs passa a depender do ambiente. Se alguém alterar uma rotina em um caminho e esquecer o outro, o comportamento local e o de produção podem divergir. Isso complica depuração, validação e evolução de agendas operacionais. |
| Evidência | Em produção serverless, o código pula o cron local e delega ao `/api/cron/*`; localmente, as rotinas vivem no processo Node. |
| Recomendação | Consolidar uma única fonte de verdade para o catálogo de jobs, mesmo que com adaptadores diferentes para local e serverless. O que mudar deve mudar uma vez, não em dois fluxos paralelos. |
| Trade-off | A duplicação de entrypoints facilita implantação híbrida; a centralização reduz chance de drift e torna os jobs mais fáceis de auditar. |

### ARCH-3-05 - O roadmap 19–25 ainda não está pronto para virar implementação sem ADRs de comportamento

| Campo | Conteúdo |
|---|---|
| Severidade | 🟡 Média |
| Problema | No escopo TI5, [19-25-Modulos-Planejados.md](../Product%20Owner/19-25-Modulos-Planejados.md) ficou só com **Onboarding** (e contexto de importação). Ainda faltam Regras de Negócio formais para esse planejado. |
| Impacto | Sem RN/ADR mínimos de onboarding, a implementação tende a começar com ambiguidades (modo de uso, receitas fixas, primeiro login). |
| Evidência | O documento TI5 registra Onboarding como único planejado e a ausência de RN correspondente. |
| Recomendação | Antes de codar onboarding, formalizar RN/ADRs mínimos do fluxo de primeiro uso. |
| Trade-off | Antecipar ADRs reduz ambiguidade e retrabalho, mas exige parar para decisão antes de velocidade de implementação. |

## 5. Novos Requisitos Arquiteturais Propostos

- RNF-E1: todo request relevante deve carregar um identificador de correlação propagado até logs e jobs associados.
- RNF-E2: cobertura de teste deve ser reportada por categoria de risco, não apenas por percentual global.
- RNF-E3: métricas de leitura recorrente devem ter uma camada compartilhada para evitar drift entre dashboard e insights.
- RNF-E4: jobs devem ter uma única fonte de verdade para agenda e composição, com adaptadores por ambiente.
- ADR-E1: Onboarding (único planejado TI5 em 19–25) precisa de RN/ADRs mínimos antes de entrar em implementação.

## 6. Perguntas Clarificadoras específicas da fase

- O time quer adotar correlação de requisição via middleware agora, ou isso só entra quando houver tracing distribuído completo?
- As exclusões de coverage em API e web são temporárias ou fazem parte da estratégia de métricas do projeto?
- Existe intenção de consolidar consultas agregadas em um read model comum para dashboard e insights?
- O catálogo de jobs deve ser unificado em uma só camada, ou a separação local/serverless é uma decisão permanente?
- Os módulos 19–25 vão ganhar RN/ADRs antes de qualquer história de implementação, ou o time prefere implementar e detalhar depois?

## 7. Alinhamentos do time

- A correlação de requisição via middleware é a direção preferida agora, não só uma etapa futura de tracing.
- As exclusões de coverage podem continuar por métrica, considerando o contexto de plano gratuito, mas precisam ficar explicitadas como decisão de medição, não como cobertura integral.
- Ainda não há intenção de consolidar um read model comum para dashboard e insights.
- Os jobs podem seguir sendo disparados em uma única camada por conta do Vercel, desde que a agenda fique centralizada e previsível.
- Os módulos 19–25 devem entrar como histórias, mas apoiados por RN/ADRs mínimos antes da implementação para reduzir ambiguidade.
