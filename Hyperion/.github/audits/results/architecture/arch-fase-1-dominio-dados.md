# Auditoria arquitetural — Fase 1: domínio e dados

**Produto:** Pulso  
**Locale:** pt-BR  
**Overlay:** nenhum (`audits.overlay: null` em `.github/project.yml`)  
**Data:** 2026-09-30  
**Escopo desta fase:** boundaries de domínio, ownership de dados, schema Prisma, consistência, migrations e alinhamento código × modelo.

---

## 1. Resumo executivo

A Pulso observa um **monólito de API em camadas** (Express → controllers → services → repositories → Prisma/PostgreSQL) com três clientes (React, Flutter, kit Hyperion). O **modelo de dados já cobre um domínio amplo** (usuário, transações por tipo de recurso, metas, viagens, grupos, orçamentos, dívidas, divisão, planejamento de compra, notificações, gamificação, chat). A **superfície HTTP ativa é estreita**: auth, transações, categorias, tags, cron, metas, moedas e viagens.

O risco dominante desta fase não é a falta de modelo — é o **descompasso entre o schema persistido, as rotas ligadas e os clientes**. Tabelas de grupos (e de vários outros módulos) existem e recebem migrations, mas `/api/grupos` permanece comentada e o arquivo de rotas correspondente **não está neste tree**. Metas mantêm `valorAtual` denormalizado ao lado de `AporteMeta` **sem transação Prisma**. Aportes **não geram `Transacao`**, então o saldo por recurso (DINHEIRO/VA/VR/VT/POUPANCA) e o “dinheiro em meta” são ledgers paralelos.

Capacidade de evolução: **boa no núcleo financeiro pessoal já ligado**; **frágil** para colaboração (grupos) e para qualquer módulo cujo schema já migrou mas o serviço não existe neste repositório.

---

## 2. Escopo e contexto detectado

### Sistemas e boundaries

| Unidade | Path | Papel observado |
|---------|------|-----------------|
| API | `Codigo/Pulso/api` | Source of truth REST; Prisma + PostgreSQL |
| Web | `Codigo/Pulso/web` | SPA React/Vite; cookies `httpOnly` |
| Mobile | `Codigo/Pulso/mobile` | Flutter 3.x; Dio + Bearer |
| Kit | `Hyperion/` | Skills, cards, memória — fora do runtime do produto |
| Broker (opcional) | `Codigo/Pulso/api/docker-compose.yml` | RabbitMQ local; **não faz parte do domínio persistido** |

**Trust boundary principal:** usuário autenticado (`usuarioId` no JWT/`req.user`). Dados financeiros são por conta. Grupos (quando existirem) cruzam essa boundary (membros, convites).

### Stack de dados

- ORM: Prisma 5.22, PostgreSQL, `DATABASE_URL` + `DIRECT_URL` (`schema.prisma:7-11`).
- Adapter Neon em runtime Vercel (`database.js:44-54`).
- Migrations em `Codigo/Pulso/api/prisma/migrations/` (init até `add_plano_freemium`).
- Dinheiro no banco: `@db.Decimal(12, 2)` em transações, metas, aportes, etc.

### Intenção documentada vs implementação

- **Documentado** (`docs/3.requisitos.md`, `Hyperion/.github/memory/DOMAIN.md`, diagramas): grupos, Gemini, orçamento, Socket.IO, RabbitMQ.
- **Observado nesta fase:** schema de grupos presente; **nenhum** `grupoRoutes.js` / `grupoService.js` na API; rotas comentadas em `routes/index.js`.
- **Fora de escopo declarado** (`docs/3.requisitos.md:285`): vale-transporte, gamificação — mas o schema **inclui** `VendaVt`, `UsoVt`, `Sequencia`, `Conquista`.

### N/A nesta fase

- Particionamento/sharding, CQRS, event sourcing — porte acadêmico; não há evidência de carga que justifique.
- Cache distribuído de domínio (Redis): ausente; caches observados são in-memory nos providers (Fase 2).
- Retenção/LGPD operacional (jobs de exclusão de conta): não há fluxo de apagamento além de `onDelete: Cascade` no Prisma.

### Limitações

- Sem dump de produção nem métricas de volume; índices avaliados só pelo schema.
- Jobs de orçamento/dívida referenciados no messaging **não existem** neste tree (Fase 2).

---

## 3. Achados priorizados

### ARCH-1-01 — Schema persistido muito à frente da API ligada

- **Evidência:** `Codigo/Pulso/api/src/routes/index.js:10-43` (comentário “demais módulos ainda não estão neste repo”; `/grupos`, `/orcamentos`, `/notificacoes`, `/lembretes`, `/calendario`, `/dividas`, `/divisoes`, `/planejamento-compra`, `/sync`, `/dashboard`, `/importacoes` comentados). `Codigo/Pulso/api/prisma/schema.prisma:693-810` (modelos `Grupo`, `MembroGrupo`, `ViagemGrupo`, `MetaGrupo`, `MensagemChatGrupo`). Glob da API: **não há** `grupoRoutes.js`.
- **Constatação:** O banco já modela bounded contexts (grupos, orçamento, dívidas, divisão, compras, notificações) que a API **não expõe**. Clientes já falam `/grupos` (Fase 3). Migrations de grupos (`20260617140000_grupos` e seguintes) estão no repositório.
- **Impacto:** Evolução: ligar um módulo parece “só descomentar”, mas o serviço não está no tree — risco de `require` quebrando o boot. Consistência: schema vira contrato implícito sem dono de API. Operação: tabelas órfãs em ambientes migrados.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Tratar o schema como **backlog versionado**: (1) lista explícita “persistido / API ligada / cliente”; (2) só reativar rota quando o módulo (routes + service + repository) existir; (3) não criar novas tabelas sem fatia HTTP no mesmo PR.
- **Trade-offs:** Congelar schema reduz dívida, mas atrasa prototipação. Manter schema antecipado acelera o dia do “uncomment”, mas aumenta drift e superfície de dados mortos. Alternativa: branch/schema feature-flagged — custo de dual-migration alto para o porte.

### ARCH-1-02 — Aporte de meta e `valorAtual` em duas escritas sem transação

- **Evidência:** `Codigo/Pulso/api/src/services/metaService.js:317-326` (`criarAporte` depois `atualizar` `valorAtual`). `Codigo/Pulso/api/src/repositories/metaRepository.js:128-141` (create/delete isolados). Grep em `Codigo/Pulso/api`: **zero** usos de `prisma.$transaction`.
- **Constatação:** O progresso da meta tem **duas fontes**: soma implícita de `AporteMeta` e coluna `Meta.valorAtual`. Atualização não é atômica. Falha entre as duas escritas (crash, timeout Vercel) deixa saldo de meta inconsistente. `excluirAporte` (`metaService.js:353-374`) repete o padrão.
- **Impacto:** Consistência financeira do domínio “metas”. Relatórios e conclusão automática (`sincronizarConclusao`, linhas 67-78) leem `valorAtual`.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Envolver create/update (e o inverso na exclusão) em `$transaction`. Preferível: **eliminar o snapshot** e calcular `valorAtual` como `SUM(aportes)` (ou trigger/view). Manter snapshot só com constraint e job de reconciliação.
- **Trade-offs:** Transação Prisma: custo baixo, ganho alto. Remover `valorAtual`: leituras de listagem ficam mais caras (agregação) ou exigem include; ganhos de verdade única. Trigger no PostgreSQL: consistência no banco, menos portátil entre ambientes e mais opaco para o time.

### ARCH-1-03 — Aportes de meta não entram no ledger de recursos

- **Evidência:** `schema.prisma:337-366` (`Transacao` com `TipoRecurso` DINHEIRO/VA/VR/VT/POUPANCA). `schema.prisma:428-438` (`AporteMeta` só `metaId` + `valor` + `data` — **sem** `transacaoId`). `metaService.js:297-351` cria aporte sem chamar `transactionService`. Saldos saem de transações (`resourceBalanceUtils.js:7-30`).
- **Constatação:** Guardar em meta **não reduz** DINHEIRO/POUPANCA. O usuário pode ter R$ 1.000 em “saldo de conta” e R$ 1.000 “na meta” com o mesmo dinheiro. `ItemPlanejamentoCompra.transacaoId` (`schema.prisma:974`) mostra que o time **já sabe** ligar planejamento a transação — metas pessoais não usam o mesmo padrão.
- **Impacto:** Consistência do produto (salário vs benefício vs poupança vs meta). Qualquer dashboard futuro que some “livre + metas” infla patrimônio. Isolamento de VA/VR fica incoerente se aportes saírem de benefício sem transação.
- **Severidade:** Alta  
- **Confiança:** Alta (comportamento de código); Média quanto à regra de negócio pretendida (não há ADR).
- **Recomendação:** Decidir em ADR: (A) aporte é só planejamento (não mexe no caixa) — então a UI deve deixar isso explícito; (B) aporte é transferência para “envelope” — criar `TRANSFERENCIA` para POUPANCA/meta ou vínculo `transacaoId`. Não misturar os dois sem documentação.
- **Trade-offs:** (A) simples, mas mente sobre liquidez. (B) correto contabilmente, exige UX de recurso de origem e regras VA/VR. Envelope virtual sem transação: mais um ledger.

### ARCH-1-04 — Duplicação de agregado: viagem/meta pessoal vs grupo

- **Evidência:** `schema.prisma:453-505` (`Viagem`, `DespesaViagem`, `ObservacaoViagem`) vs `729-761` (`ViagemGrupo`, `DespesaViagemGrupo` — **sem** observações). `403-438` (`Meta`, `AporteMeta`) vs `763-796` (`MetaGrupo`, `AporteMetaGrupo`). `Viagem.metaId` unique (`469`); `ViagemGrupo.grupoId` unique (`742`).
- **Constatação:** Dois modelos quase paralelos em vez de um agregado com `escopo` (pessoal | grupo). Chat de grupo (`MensagemChatGrupo`) não reutiliza `MensagemChat`. Quando a API de grupos for ligada, regras de despesa/câmbio/premium terão de ser copiadas ou divergirão.
- **Impacto:** Manutenção e evolução (duas implementações de “pretensão de viagem”). Risco de invariantes diferentes (grupo não tem `observacoes` nem `metaId` pessoal).
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Antes de ligar `/grupos`, decidir: (1) manter dual-table (mais simples no curto prazo, dívida certa); (2) unificar `Viagem` com `grupoId` nullable + política de ACL. Não introduzir terceira variante.
- **Trade-offs:** Unificar agora custa migração e reescrita de `viagemService`. Dual-table entrega o RF de grupos mais rápido e replica bugs. Shared kernel (funções de mapeamento) reduz divergência sem merge de tabelas.

### ARCH-1-05 — Decimal no banco, `Number` na borda

- **Evidência:** `schema.prisma:344` (`valor Decimal @db.Decimal(12, 2)`). `metaBalanceUtils.js:3` (`Math.round(Number(value) * 100) / 100`). `metaMapper.js:10-24`. `resourceBalanceUtils.js:17`. `docs/3.requisitos.md` RNF-016 (decimal, nunca float).
- **Constatação:** Persistência está correta; o **domínio em JS** converte para IEEE-754. Rateios futuros (grupos/divisão) e câmbio em `moedaService.js:97-99` (`amount * rateFrom.bid`) herdam o risco.
- **Impacto:** Confiabilidade monetária; desalinhamento com RNF-016. Para 2 casas e valores típicos de estagiário o erro é pequeno; em soma de muitos lançamentos e FX, acumula.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Usar `decimal.js` (já em `package.json`) **ou** inteiros em centavos no service layer; Prisma `Decimal` até a serialização `toFixed(2)`.
- **Trade-offs:** `decimal.js` em todo caminho: verboso, correto. Centavos: simples, exige disciplina de UI. Manter `Number`: rápido, viola o RNF.

### ARCH-1-06 — Exclusão do criador do grupo apaga o agregado compartilhado

- **Evidência:** `schema.prisma:704` (`criador Usuario @relation(..., onDelete: Cascade)`). Membros e viagens/metas do grupo cascateiam a partir de `Grupo` (`705-708`, `721`).
- **Constatação:** Se o admin apagar a conta, o **grupo inteiro** some para os demais membros. Não há transferência de papel nem `criadorId` nullable.
- **Impacto:** Integridade do bounded context colaborativo (ainda não ligado, mas o schema já define a regra).
- **Severidade:** Média  
- **Confiança:** Alta no schema; o runtime de exclusão de usuário não foi auditado como endpoint (não há rota de delete-account nas rotas ativas).
- **Recomendação:** `onDelete: Restrict` no criador + fluxo “promover admin / dissolver grupo”. Ou soft-delete de usuário.
- **Trade-offs:** Restrict impede apagar conta até resolver grupos (atrito LGPD). Cascade é simples e destrutivo. Soft-delete aumenta complexidade de unique email.

### ARCH-1-07 — Notificações persistidas sem API de leitura

- **Evidência:** `transactionService.js:86-97`, `286-287` (`criarNotificacao` + insight). `metaService.js:332-339` (`META_ATINGIDA`). `notificationService.js:43-54`. `routes/index.js:12,34` (`notificationRoutes` comentado). `insightService.js:55-64` grava `tipo: 'INSIGHT_IA'` com `geradoPor: 'regras'`.
- **Constatação:** O domínio de notificação **escreve** no PostgreSQL; o cliente **não lista**. Insight “IA” é regra de maior categoria do mês, não Gemini.
- **Impacto:** Dados órfãos; usuários não veem alertas. Módulo Insights documentado como IA fica semanticamente falso (`INSIGHT_IA`).
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Ou ligar GET `/notificacoes` com o service já existente, ou não persistir até haver inbox. Renomear tipo para `INSIGHT_REGRA` até haver Gemini.
- **Trade-offs:** Ligar listagem é barato (service pronto) mas puxa UI. Parar de gravar evita lixo; perde histórico quando a tela existir.

### ARCH-1-08 — Schema inclui contextos declarados fora de escopo

- **Evidência:** `docs/3.requisitos.md:285` (fora: vale-transporte, gamificação). `schema.prisma:563-657` (`VendaVt`, `UsoVt`, `Sequencia`, `Conquista`, `DesafioMensal`). `TipoRecurso.VT` (`schema.prisma:32`).
- **Constatação:** O modelo de dados **não reflete** o recorte da disciplina. VT ainda entra em `RECURSOS_SALDO_ACUMULADO` (`transactionService.js:17`).
- **Impacto:** Evolução: time implementa “o que o schema pede”. Documentação e código divergem (mesmo problema da Fase 3).
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** ADR: VT/gamificação são dívida de schema a ignorar, ou voltam ao escopo. Não expor rotas “porque a tabela existe”.
- **Trade-offs:** Dropar tabelas exige migration destrutiva. Deixar quieto é o que o repo já faz — ok se o time não seedar esses módulos.

### ARCH-1-09 — Saldo por recurso materializa todas as transações na aplicação

- **Evidência:** `transactionRepository.js:197-221` (`findMany` de todas as txs do recurso). `transactionService.js:24-40`, `213-224` (loop por recurso no modo carteira).
- **Impacto:** Escala e consistência operacional: custo O(n) em memória por request de resumo. Sem evidência de volume de produção; risco cresce com histórico.
- **Severidade:** Média  
- **Confiança:** Alta no código; Baixa na urgência (carga desconhecida).
- **Recomendação:** Agregar no SQL (`SUM` com `CASE` tipo/recurso) ou tabela de saldo atualizada na escrita (aí sim com `$transaction`).
- **Trade-offs:** Snapshot de saldo: leituras O(1), escrita mais complexa e precisa de reconciliação. SQL aggregate: suficiente para dezenas de milhares de linhas. Premature snapshot seria over-engineering hoje.

### ARCH-1-10 — Poupança existe no enum mas some do “total disponível”

- **Evidência:** `resourceBalanceUtils.js:1`, `33-34` (`RECURSOS_DASHBOARD = DINHEIRO, VA, VR`; `saldoTotalDisponivel` ignora VT e POUPANCA).
- **Constatação:** Ownership do conceito “disponível” está hardcoded e **exclui** poupança. Metas não debitam poupança (ARCH-1-03), então o total do dashboard e o envelope de meta não se encontram.
- **Impacto:** Interpretação de saldo no futuro dashboard (hoje stub na web).
- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Recomendação:** Documentar a regra (disponível = liquidez operacional) ou incluir POUPANCA com label separado.
- **Trade-offs:** Incluir poupança infla “o que posso gastar”. Separar cards (livre / benefícios / reservado) é o desenho alinhado ao glossário VA/VR.

### ARCH-1-11 — Recorrência gera filha + tags sem unidade transacional

- **Evidência:** `jobs/recurringTransactions.js:70-86` (`criar` depois `vincularTags`).
- **Impacto:** Filha sem tags se a segunda escrita falhar; job diário pode duplicar no dia seguinte se a checagem `existente` (`58-68`) já vir a filha.
- **Severidade:** Baixa  
- **Confiança:** Média (janela de falha estreita).
- **Recomendação:** `$transaction` no job; idempotência por `(paiId, data)` unique.
- **Trade-offs:** Unique constraint impede duplicata mesmo com dois crons (Vercel + node-cron) — ver Fase 2.

---

## 4. Pontos positivos

- **Camadas reais, não só pastas:** rotas Zod + `authMiddleware`; serviços com regras; repositórios Prisma. Ex.: `metaRoutes.js:15-61`, `viagemRoutes.js:22-23`.
- **Dinheiro tipado no PostgreSQL:** `Decimal(12,2)` em `Transacao.valor`, `Meta.valorAlvo`, aportes (`schema.prisma:344`, `407-408`, `431`).
- **Índices alinhados a listagens:** `transacoes` por `(usuarioId, data)` (`schema.prisma:360-364`); metas por status/prazo (`422-423`).
- **Isolamento por dono nas queries ativas:** `buscarPorId` de meta exige `usuarioId` (`metaRepository.js:111-114`). Viagem valida vínculo único de meta (`viagemService.js:65-78`).
- **Recursos restritos no núcleo:** enum `TipoRecurso` + `validarRecursoCategoria` (`transactionService.js:254`).
- **Histórico de schema via migrations** (não só `db push`).
- **Unicidade útil:** `Viagem.metaId` unique evita uma meta em duas viagens pessoais (`schema.prisma:469`).

---

## 5. Quick wins

1. Envolver aporte + `valorAtual` em `$transaction` (ARCH-1-02) — mudança local, alto retorno.
2. Unique `(paiId, data::date)` em filhas recorrentes (ARCH-1-11) antes de ligar cron duplicado.
3. Inventário de uma página: tabela Prisma → rota HTTP → tela web → tela Flutter (ARCH-1-01).
4. Parar de persistir `INSIGHT_IA` ou ligar listagem mínima (ARCH-1-07).
5. Comentário/ADR de uma frase: “aporte não mexe no caixa” até decidir ARCH-1-03.

---

## 6. Roadmap e riscos

| Horizonte | Ação | Risco residual |
|-----------|------|----------------|
| Estabilizar | Transações Prisma nos writes compostos; inventário schema×API | Drift continua se novos models entrarem sem API |
| Decisão/ADR | Ledger de metas (planejamento vs envelope); dual-table grupos vs unificar | Unificar tarde custa mais |
| Estrutural | Agregação SQL de saldos; decimal.js na borda | Sem carga medida, prioridade média |
| Não fazer agora | Microserviços por contexto, event store | Complexidade sem tráfego |

**Pergunta que altera recomendação:** aportes devem debitar um `TipoRecurso`? Se sim, ARCH-1-03 sobe de “modelo paralelo” para **defeito de domínio**. Se não, a UI precisa dizer que meta não é caixa.
