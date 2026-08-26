# 🏗️ Sumário — Fase 1

## 1. Contexto e Boundaries do Escopo

Esta fase cobre domínio, camadas da API, modelo de dados e consistência transacional. O escopo foi comparado com o mapa real de rotas do backend em [routes/index.js](Codigo/Pulso/api/src/routes/index.js), com o schema Prisma em [schema.prisma](Codigo/Pulso/api/prisma/schema.prisma) e com as regras de negócio em [RegrasDeNegocio.md](Documentacao/01-Produto/Regras-de-Negocio/RegrasDeNegocio.md).

O runtime real do backend expõe estes limites principais: auth, transações, categorias, tags, orçamento, notificações, lembretes, calendário, dívidas, divisão de despesas, metas, moedas, viagens, grupos, planejamento de compra, cron, sync, messaging (RabbitMQ) e Socket.IO. Em paralelo, os cards de planejamento em [.github/plans/cards](.github/plans/cards) mostram um backlog maior, com módulos que ainda não aparecem como fronteira técnica explícita no backend, como insights, homepage, perfil e configurações.

A documentação da API em [Codigo/Pulso/api/README.md](Codigo/Pulso/api/README.md) está vazia, então a verdade arquitetural hoje está no código e nos cards, não no README.

## 2. Top Riscos Arquiteturais da Fase

- A fronteira entre aplicação e persistência não é uniforme: alguns domínios seguem repository pattern, outros leem e escrevem Prisma direto dentro de services.
- A escrita de transações financeiras e seus efeitos colaterais não é atômica; notificações e insights podem ficar fora de sincronia sob falha parcial ou concorrência.
- O objeto `ConfiguracaoUsuario` concentra regras e flags de vários domínios em uma única linha, o que aumenta acoplamento entre perfil, auth, orçamento e calendário.
- Regras centrais dependem demais de strings, presets e validação em memória, em vez de serem parcialmente garantidas no banco.

## 3. Auditoria de Status (README vs. Realidade Arquitetural)

- O README da API não descreve a arquitetura viva.
- Sessão passou a ser cookie httpOnly em [authCookies.js](Codigo/Pulso/api/src/utils/authCookies.js) e o front opera com `withCredentials` em [api.js](Codigo/Pulso/web/src/services/api.js).
- O destino autenticado padrão já é `/transactions` em [defaultAuthenticatedRoute.js](Codigo/Pulso/web/src/config/defaultAuthenticatedRoute.js).
- `grupoBeneficio` já existe no schema e nas regras de categoria, o que confirma que a compatibilidade recurso × categoria virou uma decisão de domínio persistida, não apenas uma regra de UI.
- Há rate limit parcial em auth e grupos, mas ele ainda é best effort de instância, não um controle compartilhado de cluster.

## 4. Diagnóstico Detalhado por Domínio

### ARCH-1-01 - Fronteira de domínio inconsistente entre services e repositories

| Campo | Conteúdo |
|---|---|
| Severidade | 🟠 Alta |
| Problema | Parte do backend respeita uma camada de repository explícita, mas vários services falam direto com Prisma. Em [categoryService.js](Codigo/Pulso/api/src/services/categoryService.js) a persistência fica encapsulada por repository, enquanto [budgetService.js](Codigo/Pulso/api/src/services/budgetService.js), [calendarService.js](Codigo/Pulso/api/src/services/calendarService.js) e [transactionService.js](Codigo/Pulso/api/src/services/transactionService.js) acessam Prisma diretamente. |
| Impacto | Isso enfraquece a leitura dos bounded contexts, aumenta o custo de teste e torna mais difícil centralizar invariantes de domínio. Hoje não está claro quando a regra pertence ao repository, ao service ou ao schema. |
| Evidência | O agregador de rotas em [routes/index.js](Codigo/Pulso/api/src/routes/index.js) mostra a API como conjunto de domínios separados, mas os services não seguem o mesmo padrão de encapsulamento. |
| Recomendação | Escolher uma convenção única por contexto: ou repository obrigatório para escrita e consulta de domínio, ou application services com Prisma explícito, mas sem mistura informal entre os dois. Se o objetivo é reduzir boilerplate, limitar repository aos agregados que têm invariantes reais e documentar a exceção. |
| Trade-off | Mais boilerplate e mais arquivos se o padrão for unificado; menos boilerplate, porém menos clareza e mais risco de regra espalhada, se a mistura continuar. |

### ARCH-1-02 - `ConfiguracaoUsuario` está virando um mega-aggregate de perfil

| Campo | Conteúdo |
|---|---|
| Severidade | 🟠 Alta |
| Problema | O model [schema.prisma](Codigo/Pulso/api/prisma/schema.prisma) em `ConfiguracaoUsuario` concentra salário, VA, VR, VT (tipos de recurso), tema, plano Free/Premium, calendário Google, renda planejada, modo de uso e timestamps em uma única entidade. |
| Impacto | Mudanças de um módulo passam a tocar a mesma linha e a mesma migration. Isso aumenta acoplamento entre perfil, auth, orçamento, transporte, calendário e experiências corporativas, além de tornar mais provável conflito de edição entre fluxos independentes. |
| Evidência | As linhas do schema mostram a reunião de campos que pertencem a domínios distintos: finanças pessoais, benefícios, UI e integração externa. |
| Recomendação | Separar a configuração por subdomínios: perfil/uso, benefícios, calendário e preferências de UI. Se a separação completa ainda for cedo demais, pelo menos isolar as partes mais voláteis em tabelas menores ou em um JSON bem delimitado com ownership explícito. |
| Trade-off | Mais joins e mais migrations no curto prazo; em troca, o app reduz a chance de virar um formulário monolítico de preferências e ganha autonomia por módulo. |

### ARCH-1-03 - Transação financeira e efeitos colaterais não estão sob uma fronteira atômica

| Campo | Conteúdo |
|---|---|
| Severidade | 🔴 Crítica |
| Problema | Em [transactionService.js](Codigo/Pulso/api/src/services/transactionService.js) a criação da transação acontece antes de vincular tags, notificar e gerar insight — efeitos colaterais fora de uma unidade atômica compartilhada. |
| Impacto | Se qualquer etapa posterior falhar, o ledger financeiro fica salvo mas parte dos efeitos derivados não. Em concorrência, dois lançamentos no mesmo intervalo podem ler a mesma `sequenciaAtual` e gravar um valor final menor do que o devido. Isso afeta consistência de métricas, badges e notificações, além de dificultar reprocessamento confiável. |
| Evidência | A sequência de criação em `criarTransacao` é linear e sem bloco transacional. O helper `incrementarStreak` lê `sequencia`, calcula novo valor e depois atualiza a mesma linha em chamadas separadas. |
| Recomendação | Separar claramente o que é parte do commit do domínio financeiro do que é efeito colateral. A transação de banco deve cobrir o estado que precisa ser consistente; notificações e insights podem sair para pós-commit ou fila. O streak precisa de proteção contra corrida, idealmente com update atômico ou versão otimista. |
| Trade-off | Fazer tudo dentro de uma transação aumenta lock e duração da escrita; jogar tudo para fora melhora throughput, mas exige retry/idempotência. O ponto correto é deixar atômico apenas o que realmente precisa ser consistente em leitura imediata. |

### ARCH-1-04 - Regra recurso × categoria depende demais de nome, preset e validação em memória

| Campo | Conteúdo |
|---|---|
| Severidade | 🟡 Média |
| Problema | O schema guarda `grupoBeneficio` como opcional em [schema.prisma](Codigo/Pulso/api/prisma/schema.prisma), enquanto [recursoCategoriaRules.js](Codigo/Pulso/api/src/utils/recursoCategoriaRules.js) valida a compatibilidade usando `grupoBeneficio` e, como fallback, inferência por nome e aliases. O seed de categorias padrão em [defaultCategories.js](Codigo/Pulso/api/src/constants/defaultCategories.js) também carrega esse grupo por convenção. |
| Impacto | A regra central fica sensível a rename, seed e novos presets. Se um nome ou alias mudar, a validação pode aceitar ou rejeitar combinações diferentes sem nenhuma mudança explícita no schema. Isso cria dívida de manutenção e aumenta o risco de regressão silenciosa em VA, VR e VT. |
| Evidência | `validarRecursoCategoria` usa fallback por nome quando `grupoBeneficio` está ausente, e `categoryService.js` permite categoria customizada sem grupo para criação e atualização. |
| Recomendação | Tratar o grupo de benefício como dado de domínio explícito, não como heurística. Se o nome for só apresentação, a regra deve depender de enum/lookup estável, com seed e presets como conveniência, não como fonte da verdade. |
| Trade-off | Uma estrutura mais explícita reduz flexibilidade de categoria livre, mas evita dependência implícita de strings e mantém a compatibilidade em longo prazo. |

### ARCH-1-05 - Orçamento e categorias ainda fazem guarda de integridade na aplicação, não no banco

| Campo | Conteúdo |
|---|---|
| Severidade | 🟡 Média |
| Problema | [categoryService.js](Codigo/Pulso/api/src/services/categoryService.js) bloqueia exclusão manualmente quando a categoria já está em uso, e [budgetService.js](Codigo/Pulso/api/src/services/budgetService.js) valida categoria por consulta antes de gravar limites. O banco tem FKs e unique, mas o comportamento de negócio ainda depende de checks prévios em código. |
| Impacto | A integridade funciona hoje, mas a regra está distribuída entre service, repository e schema. Isso é aceitável no MVP, porém dificulta migrar comportamento ou reaproveitar o mesmo uso de categoria em fluxos novos sem duplicar a checagem. |
| Evidência | `contarUso` soma transações e orçamentos na aplicação; o schema não tem uma estratégia de soft delete para categorias em uso. |
| Recomendação | Definir explicitamente o lifecycle da categoria: ou exclusão dura com bloqueio forte e mensagem de domínio, ou soft delete com ocultação e migração gradual. Manter o estado da decisão em um único lugar reduz duplicação futura. |
| Trade-off | Soft delete aumenta complexidade de leitura e filtros; exclusão dura é mais simples, mas exige que a UX aceite bloqueio definitivo quando houver dependências. |

## 5. Novos Requisitos Arquiteturais Propostos

- RNF-A1: padronizar a fronteira de persistência por contexto, com decisão explícita sobre quando usar repository e quando o service pode falar com Prisma diretamente.
- RNF-A2: todo fluxo que cria ou altera ledger financeiro relevante deve declarar se é atômico, eventual ou pós-commit; efeitos colaterais devem ser idempotentes.
- RNF-A3: dividir `ConfiguracaoUsuario` em subconfigurações por domínio, ou justificar formalmente a permanência do agregado único até a próxima revisão de arquitetura.
- RNF-A4: transformar `grupoBeneficio` em regra explícita e estável, sem fallback baseado em nome para invariantes críticos.
- ADR-A1: definir o contrato arquitetural entre auth, perfil, orçamento e calendário, porque hoje eles compartilham a mesma estrutura de configuração.

## 6. Perguntas Clarificadoras específicas da fase

- `ConfiguracaoUsuario` deve continuar como uma entidade única por simplicidade, ou já existe intenção de separar preferências de perfil, benefícios e integrações em tabelas distintas?
- O streak e as notificações de transação precisam ser consistentes no mesmo request, ou podem ser processados de forma eventual desde que o ledger fique salvo?
- A exclusão de categoria deve continuar proibida quando há uso, ou o produto prefere soft delete para permitir limpeza histórica sem quebrar referências?
- A equipe quer repository como padrão obrigatório em todos os contextos, ou alguns módulos podem usar Prisma direto por decisão arquitetural explícita?
- `grupoBeneficio` será sempre derivado de enum estável, ou o nome das categorias continuará fazendo parte da regra de compatibilidade?

## 7. Alinhamentos do time

- `ConfiguracaoUsuario` pode continuar unificada no curto prazo, mas o direcionamento é separar preferências de perfil, benefícios e integrações futuramente para reduzir acoplamento e melhorar escalabilidade.
- O streak e as notificações de transação devem permanecer consistentes no mesmo request, junto do ledger salvo.
- Exclusão de categoria continua proibida quando há uso, porque isso afeta diretamente uma regra de negócio.
- Repository passa a ser o padrão arquitetural desejado para os contextos do backend.
- `grupoBeneficio` deve trabalhar com enum estável e também com sugestão por nome, para facilitar a classificação automática quando o usuário cadastrar algo como “Mercado”.
