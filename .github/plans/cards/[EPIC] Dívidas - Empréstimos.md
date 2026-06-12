# [EPIC] Dívidas — Gerenciamento de Empréstimos

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      (preencher)  
**Categoria:**   Múltiplas (Database, Backend, Frontend)  
**Relator:**     (preencher)  
**Pai:**         —  
**Data Limite:** (preencher)

---

## 📝 Descrição do Módulo

O módulo de **Dívidas** permite ao usuário gerenciar empréstimos de forma completa, controlando tanto o dinheiro que ele empresta (Me devem) quanto o dinheiro que ele pega emprestado (Eu devo). O sistema oferece visibilidade sobre prazos de devolução, notificações automáticas quando os prazos se aproximam, e histórico completo de quitações.

### Funcionalidades Principais

**Tela Principal — Visão Geral:**
- 2 cards de resumo com valores totais:
  - **Me devem:** Total a receber de terceiros
  - **Eu devo:** Total a pagar para terceiros
- 3 tabs para filtrar a lista:
  - **Me devem:** Empréstimos onde o usuário é credor (emprestou dinheiro)
  - **Eu devo:** Empréstimos onde o usuário é devedor (pegou emprestado)
  - **Quitadas:** Histórico de dívidas pagas

**Lista de Empréstimos:**
- Foto ou avatar da pessoa
- Nome da pessoa envolvida
- Valor do empréstimo
- Data do empréstimo
- Prazo de devolução (se definido)
- Status visual de vencimento:
  - 🟢 **Vence em mais de 2 dias** (status normal)
  - 🟡 **Vence em 2 dias** (alerta amarelo)
  - 🔴 **Vence hoje** (alerta vermelho)
  - 🔴 **Vencido há X dias** (status crítico)
- Ações rápidas:
  - ✅ Marcar como pago/quitado
  - ✏️ Editar empréstimo (apenas se não quitado)
  - 🗑️ Deletar empréstimo (apenas se não quitado)

**Modal de Novo Empréstimo:**
- **Direção:** Escolha entre "Emprestei (me devem)" ou "Peguei emprestado (eu devo)"
- **Nome da pessoa:** Para quem você emprestou ou de quem você pegou emprestado
- **Valor:** Quantia do empréstimo
- **Data do empréstimo:** Quando o empréstimo foi feito
- **Prazo de devolução (opcional):** Quando deve ser devolvido
  - Toggle para ativar/desativar
  - Se ativado, permite selecionar data
  - Se desativado, empréstimo fica sem prazo definido
- **Observação (opcional):** Detalhes adicionais (limite: 250 caracteres)
- **Resumo dinâmico:** Exibe visualmente quem deve para quem e o valor

**Filtros e Busca:**
- Busca por: nome da pessoa, valor ou data
- Ordenação por valor: menor para maior ou maior para menor
- Filtro por período: seleção de intervalo de datas (DateRangePicker)

**Notificações Automáticas:**
- Sistema envia notificação interna (sininho no layout) quando:
  - Prazo de devolução está a **2 dias** de vencer
  - Prazo de devolução **vence hoje**
- Notificações aparecem no painel do usuário com link direto para a tela de dívidas

**Histórico e Auditoria:**
- Dívidas quitadas ficam disponíveis na tab "Quitadas"
- Registro de quando foi marcado como pago
- Dívidas quitadas **não podem ser editadas**
- Job automático limpa dívidas quitadas há mais de **180 dias** do banco

**Regras de Negócio:**
- ❌ Não pode editar dívida já quitada
- ❌ Não pode deletar dívida quitada manualmente (job automático cuida disso)
- ✅ Pode criar empréstimo sem prazo de devolução (fica sem alertas)
- ✅ Observação limitada a 250 caracteres
- ✅ Valor sem limites mínimo/máximo
- ✅ Notificações apenas para empréstimos com prazo definido

**Integrações (Planejadas):**
- 🔮 **Transações:** Estudar possibilidade de criar transação automaticamente ao marcar como pago (a definir)
- 🔮 **Gamificação:** Badges e conquistas relacionadas a empréstimos (implementar depois)
- ✅ **Notificações:** Já implementado, usar tipo `DIVIDA_COBRANCA` existente

---

# [STORY DATABASE] Dívidas — Banco de Dados

**Tipo:**        Story  
**Prioridade:**  🔺 Highest  
**Sprint:**      (preencher)  
**Categoria:**   Banco de Dados  
**Relator:**     (preencher)  
**Pai:**         [EPIC] Dívidas — Gerenciamento de Empréstimos  
**Data Limite:** (preencher)

---

## 📝 Descrição

Como sistema, eu quero que o banco de dados suporte o armazenamento completo de empréstimos (dívidas), para que os usuários possam gerenciar quem lhes deve e a quem eles devem, com controle de prazos, valores e histórico de quitação.

---

## 🗄️ SQL a executar

```sql
-- **1. Criar enum DirecaoDivida** [NOVO ENUM]

CREATE TYPE "DirecaoDivida" AS ENUM ('ME_DEVEM', 'EU_DEVO');

-- **2. Criar tabela dividas** [NOVA TABELA]

CREATE TABLE "dividas" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "usuario_id" TEXT NOT NULL,
  "direcao" "DirecaoDivida" NOT NULL,
  "nome_pessoa" VARCHAR(120) NOT NULL,
  "valor" DECIMAL(12,2) NOT NULL,
  "data_emprestimo" TIMESTAMP(3) NOT NULL,
  "prazo_devolucao" TIMESTAMP(3),
  "observacao" VARCHAR(250),
  "quitada" BOOLEAN NOT NULL DEFAULT false,
  "data_quitacao" TIMESTAMP(3),
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "atualizado_em" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "dividas_usuario_id_fkey" FOREIGN KEY ("usuario_id") 
    REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- **3. Criar índices para performance** [NOVOS ÍNDICES]

CREATE INDEX "dividas_usuario_id_idx" ON "dividas"("usuario_id");
CREATE INDEX "dividas_usuario_id_quitada_idx" ON "dividas"("usuario_id", "quitada");
CREATE INDEX "dividas_usuario_id_prazo_devolucao_idx" ON "dividas"("usuario_id", "prazo_devolucao");
CREATE INDEX "dividas_quitada_data_quitacao_idx" ON "dividas"("quitada", "data_quitacao");
```

---

## 🔄 Após executar o SQL

Execute os seguintes comandos para atualizar o Prisma Client:

```bash
cd Codigo/Pulso/api
npm run db:pull      # Sincroniza schema.prisma com o banco
npm run db:generate  # Gera Prisma Client atualizado
```

---

## 📊 OBS: ATUALIZAR NO DIAGRAMA

**Tabelas e colunas afetadas:**

- **Nova tabela:** `dividas`
  - `id` (PK, TEXT)
  - `usuario_id` (FK → usuarios.id)
  - `direcao` (ENUM: ME_DEVEM | EU_DEVO)
  - `nome_pessoa` (VARCHAR 120)
  - `valor` (DECIMAL 12,2)
  - `data_emprestimo` (TIMESTAMP)
  - `prazo_devolucao` (TIMESTAMP, nullable)
  - `observacao` (VARCHAR 250, nullable)
  - `quitada` (BOOLEAN, default false)
  - `data_quitacao` (TIMESTAMP, nullable)
  - `criado_em` (TIMESTAMP)
  - `atualizado_em` (TIMESTAMP)

- **Relacionamento:** `dividas` N:1 `usuarios` (ON DELETE CASCADE)

- **Novo enum:** `DirecaoDivida` com valores `ME_DEVEM`, `EU_DEVO`

---

## ✅ Critérios de Aceite

→ Enum `DirecaoDivida` criado com valores `ME_DEVEM` e `EU_DEVO`  
→ Tabela `dividas` criada com todas as colunas especificadas  
→ FK para `usuarios` com cascade delete configurado  
→ Índices criados para otimizar queries por usuário, status de quitação e prazos  
→ Prisma Client regenerado com sucesso após `npm run db:pull && npm run db:generate`  
→ Tipos TypeScript disponíveis para `DirecaoDivida` e modelo `Divida`

---

# [STORY BACKEND] Dívidas — Backend

**Tipo:**        Story  
**Prioridade:**  🔺 Highest  
**Sprint:**      (preencher)  
**Categoria:**   Backend  
**Relator:**     (preencher)  
**Pai:**         [EPIC] Dívidas — Gerenciamento de Empréstimos  
**Data Limite:** (preencher)

---

## 📝 Descrição

Como sistema backend, eu quero fornecer API completa para gerenciamento de empréstimos (dívidas), incluindo CRUD, cálculo de resumos, filtros avançados, jobs de limpeza automática e notificações de vencimento, para que o frontend possa oferecer uma experiência rica de gerenciamento de dívidas.

---

## ✅ Critérios de Aceite

### Cenário 1 — Listar dívidas com filtros
**Dado** que o usuário está autenticado,  
**Quando** `GET /api/dividas?direcao=ME_DEVEM&quitada=false&periodo=2026-06&busca=João&ordenarValor=desc&pagina=1&limite=10` é chamado,  
**Então** retorna 200 com lista paginada de dívidas filtradas, headers `X-Total-Count`, `X-Total-Pages`, `X-Current-Page`.

* **Se** não houver dívidas: Retorna 200 com array vazio.
* **Se** `periodo` inválido: Retorna 400 "Período deve estar no formato YYYY-MM".
* **Se** `quitada` não for boolean: Retorna 400 "Quitada deve ser true ou false".

### Cenário 2 — Obter resumo de dívidas
**Dado** que o usuário está autenticado,  
**Quando** `GET /api/dividas/resumo` é chamado,  
**Então** retorna 200 com JSON:
```json
{
  "meDevem": {
    "total": "1250.00",
    "quantidade": 5
  },
  "euDevo": {
    "total": "380.00",
    "quantidade": 2
  }
}
```

* **Se** não houver dívidas: Retorna totais zerados.

### Cenário 3 — Criar nova dívida
**Dado** que o usuário está autenticado,  
**Quando** `POST /api/dividas` é chamado com:
```json
{
  "direcao": "ME_DEVEM",
  "nomePessoa": "João Silva",
  "valor": 250.00,
  "dataEmprestimo": "2026-05-15T00:00:00.000Z",
  "prazoDevolucao": "2026-06-30T00:00:00.000Z",
  "observacao": "Empréstimo para emergência"
}
```
**Então** retorna 201 com a dívida criada (incluindo `id`, `quitada: false`, `dataQuitacao: null`, timestamps).

* **Se** `direcao` não for `ME_DEVEM` ou `EU_DEVO`: Retorna 400 "Direção inválida".
* **Se** `nomePessoa` vazio ou > 120 chars: Retorna 400 "Nome da pessoa é obrigatório e deve ter no máximo 120 caracteres".
* **Se** `valor` <= 0: Retorna 400 "Valor deve ser maior que zero".
* **Se** `dataEmprestimo` no futuro: Retorna 400 "Data do empréstimo não pode ser futura".
* **Se** `prazoDevolucao` fornecido e anterior a `dataEmprestimo`: Retorna 400 "Prazo de devolução deve ser posterior à data do empréstimo".
* **Se** `observacao` > 250 chars: Retorna 400 "Observação deve ter no máximo 250 caracteres".

### Cenário 4 — Editar dívida não quitada
**Dado** que o usuário está autenticado e a dívida existe e não está quitada,  
**Quando** `PATCH /api/dividas/:id` é chamado com:
```json
{
  "valor": 300.00,
  "prazoDevolucao": "2026-07-15T00:00:00.000Z"
}
```
**Então** retorna 200 com a dívida atualizada.

* **Se** dívida não existe: Retorna 404 "Dívida não encontrada".
* **Se** dívida já quitada: Retorna 400 "Não é possível editar uma dívida já quitada".
* **Se** validações falharem (mesmo do cenário 3): Retorna 400 com mensagem apropriada.

### Cenário 5 — Marcar dívida como quitada
**Dado** que o usuário está autenticado e a dívida existe e não está quitada,  
**Quando** `PATCH /api/dividas/:id/quitar` é chamado,  
**Então** retorna 200 com a dívida atualizada (`quitada: true`, `dataQuitacao: <agora>`).

* **Se** dívida não existe: Retorna 404 "Dívida não encontrada".
* **Se** dívida já quitada: Retorna 400 "Dívida já está quitada".

### Cenário 6 — Deletar dívida não quitada
**Dado** que o usuário está autenticado e a dívida existe e não está quitada,  
**Quando** `DELETE /api/dividas/:id` é chamado,  
**Então** retorna 204 sem conteúdo.

* **Se** dívida não existe: Retorna 404 "Dívida não encontrada".
* **Se** dívida já quitada: Retorna 400 "Não é possível deletar uma dívida quitada. A limpeza é automática após 180 dias".

### Cenário 7 — Job de limpeza de dívidas antigas
**Dado** que existem dívidas quitadas há mais de 180 dias,  
**Quando** o job `debtCleanupJob` é executado,  
**Então** remove do banco todas as dívidas quitadas cuja `dataQuitacao` seja anterior a 180 dias atrás.

* Log gerado: `"🧹 Job limpeza dívidas: X dívida(s) removida(s)"`

### Cenário 8 — Job de alertas de vencimento
**Dado** que existem dívidas não quitadas com `prazoDevolucao` definido,  
**Quando** o job `debtAlertJob` é executado,  
**Então**:
- Cria notificação tipo `DIVIDA_COBRANCA` para dívidas que vencem **hoje** (se não houver notificação duplicada)
- Cria notificação tipo `DIVIDA_COBRANCA` para dívidas que vencem em **2 dias** (se não houver notificação duplicada)
- Notificações contêm título, mensagem, linkAcao `/debts`, metadados `{ dividaId, nomePessoa, valor, prazoDevolucao, direcao }`

* Log gerado: `"🔔 Job alertas dívidas: X notificação(ões) criadas (Y dívidas verificadas)"`

---

## 🛠️ Implementação

### debtController.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/api/src/controllers/debtController.js`  
**Seguir padrão de:** `transactionController.js` (ver exemplars.md)

**Métodos a implementar:**

* `listar()` → `GET /api/dividas`
  - Chama `debtService.listarDividas(req.user.id, req.query)`
  - Retorna headers de paginação + JSON array

* `obterResumo()` → `GET /api/dividas/resumo`
  - Chama `debtService.calcularResumo(req.user.id)`
  - Retorna JSON `{ meDevem: { total, quantidade }, euDevo: { total, quantidade } }`

* `criar()` → `POST /api/dividas`
  - Chama `debtService.criarDivida(req.user.id, req.body)`
  - Retorna 201 + JSON da dívida criada

* `editar()` → `PATCH /api/dividas/:id`
  - Chama `debtService.editarDivida(req.user.id, req.params.id, req.body)`
  - Retorna 200 + JSON atualizado

* `quitar()` → `PATCH /api/dividas/:id/quitar`
  - Chama `debtService.quitarDivida(req.user.id, req.params.id)`
  - Retorna 200 + JSON atualizado

* `excluir()` → `DELETE /api/dividas/:id`
  - Chama `debtService.excluirDivida(req.user.id, req.params.id)`
  - Retorna 204

---

### debtService.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/api/src/services/debtService.js`  
**Seguir padrão de:** `transactionService.js` (ver exemplars.md)

**Lógica de negócio a implementar:**

→ **listarDividas(usuarioId, filtros):**
  - Valida filtros (direcao, quitada, periodo, busca, ordenarValor)
  - Chama `debtRepository.listarPorUsuario(usuarioId, filtros, { pagina, limite })`
  - Retorna `{ dividas, total, paginas, pagina }`

→ **calcularResumo(usuarioId):**
  - Chama `debtRepository.calcularAgregados(usuarioId)`
  - Agrupa por `direcao` (ME_DEVEM, EU_DEVO)
  - Retorna totais e quantidades separados

→ **criarDivida(usuarioId, dados):**
  - Valida `dataEmprestimo` não futura
  - Valida `prazoDevolucao` posterior a `dataEmprestimo` (se fornecido)
  - Valida `observacao` <= 250 caracteres
  - Chama `debtRepository.criar({ usuarioId, ...dados })`
  - Retorna dívida criada

→ **editarDivida(usuarioId, dividaId, dados):**
  - Busca dívida com `debtRepository.buscarPorId(dividaId, usuarioId)`
  - Se não encontrada: `throw new AppError('Dívida não encontrada', 404)`
  - Se `quitada === true`: `throw new AppError('Não é possível editar uma dívida já quitada', 400)`
  - Valida campos modificados (mesmas validações do criar)
  - Chama `debtRepository.atualizar(dividaId, usuarioId, dados)`
  - Retorna dívida atualizada

→ **quitarDivida(usuarioId, dividaId):**
  - Busca dívida com `debtRepository.buscarPorId(dividaId, usuarioId)`
  - Se não encontrada: `throw new AppError('Dívida não encontrada', 404)`
  - Se `quitada === true`: `throw new AppError('Dívida já está quitada', 400)`
  - Chama `debtRepository.quitar(dividaId, usuarioId)`
  - Retorna dívida atualizada com `quitada: true` e `dataQuitacao`

→ **excluirDivida(usuarioId, dividaId):**
  - Busca dívida com `debtRepository.buscarPorId(dividaId, usuarioId)`
  - Se não encontrada: `throw new AppError('Dívida não encontrada', 404)`
  - Se `quitada === true`: `throw new AppError('Não é possível deletar uma dívida quitada. A limpeza é automática após 180 dias', 400)`
  - Chama `debtRepository.excluir(dividaId, usuarioId)`

---

### debtRepository.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/api/src/repositories/debtRepository.js`  
**Seguir padrão de:** `transactionRepository.js` (ver exemplars.md)

**Métodos de acesso ao banco:**

→ `listarPorUsuario(usuarioId, filtros, { pagina, limite })` — findMany com where dinâmico, orderBy, skip, take, count

→ `calcularAgregados(usuarioId)` — groupBy por `direcao`, filtra apenas `quitada: false`, retorna `_sum.valor` e `_count.id`

→ `criar(dados)` — prisma.divida.create()

→ `buscarPorId(dividaId, usuarioId)` — findFirst com where `{ id: dividaId, usuarioId }`

→ `atualizar(dividaId, usuarioId, dados)` — prisma.divida.update() com where `{ id: dividaId, usuarioId }`

→ `quitar(dividaId, usuarioId)` — update setando `{ quitada: true, dataQuitacao: new Date() }`

→ `excluir(dividaId, usuarioId)` — prisma.divida.delete() com where `{ id: dividaId, usuarioId }`

→ `excluirQuitadasAntigas(diasLimite)` — deleteMany onde `quitada: true` e `dataQuitacao < data limite`

→ `buscarParaAlertas()` — findMany onde `quitada: false`, `prazoDevolucao` não nulo, filtra datas (hoje e 2 dias)

---

## 📐 Schemas (Zod)

### debtSchemas.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/api/src/schemas/debtSchemas.js`  
**Seguir padrão de:** `transactionSchemas.js` (ver exemplars.md)

**Schemas a criar:**

→ **criarDividaSchema:**
```javascript
z.object({
  body: z.object({
    direcao: z.enum(['ME_DEVEM', 'EU_DEVO']),
    nomePessoa: z.string().min(1).max(120),
    valor: z.number().positive('Valor deve ser maior que zero'),
    dataEmprestimo: z.union([z.string().datetime(), z.coerce.date()]),
    prazoDevolucao: z.union([z.string().datetime(), z.coerce.date()]).optional(),
    observacao: z.string().max(250).optional(),
  }),
})
```

→ **editarDividaSchema:**
```javascript
z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    nomePessoa: z.string().min(1).max(120).optional(),
    valor: z.number().positive().optional(),
    dataEmprestimo: z.union([z.string().datetime(), z.coerce.date()]).optional(),
    prazoDevolucao: z.union([z.string().datetime(), z.coerce.date()]).optional(),
    observacao: z.string().max(250).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  }),
})
```

→ **listarDividasQuerySchema:**
```javascript
z.object({
  query: z.object({
    direcao: z.enum(['ME_DEVEM', 'EU_DEVO', 'TODOS']).optional().default('TODOS'),
    quitada: z.enum(['true', 'false']).optional().transform(v => v === 'true'),
    periodo: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    busca: z.string().optional(),
    ordenarValor: z.enum(['asc', 'desc']).optional(),
    pagina: z.coerce.number().int().positive().optional().default(1),
    limite: z.coerce.number().int().positive().max(100).optional().default(10),
  }),
})
```

→ **dividaIdParamSchema:**
```javascript
z.object({
  params: z.object({ id: z.string().min(1) }),
})
```

---

## 🛣️ Rotas

### debtRoutes.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/api/src/routes/debtRoutes.js`  
**Registrar em:** `Codigo/Pulso/api/src/routes/index.js` (adicionar `app.use('/dividas', debtRoutes)`)  
**Seguir padrão de:** `transactionRoutes.js` (ver exemplars.md)

**Rotas a criar:**

* `GET /api/dividas/resumo` → authMiddleware + debtController.obterResumo
* `GET /api/dividas` → authMiddleware + validateMiddleware(listarDividasQuerySchema) + debtController.listar
* `POST /api/dividas` → authMiddleware + validateMiddleware(criarDividaSchema) + debtController.criar
* `PATCH /api/dividas/:id` → authMiddleware + validateMiddleware(editarDividaSchema) + debtController.editar
* `PATCH /api/dividas/:id/quitar` → authMiddleware + validateMiddleware(dividaIdParamSchema) + debtController.quitar
* `DELETE /api/dividas/:id` → authMiddleware + validateMiddleware(dividaIdParamSchema) + debtController.excluir

---

## ⚙️ Jobs

### debtCleanupJob.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/api/src/jobs/debtCleanupJob.js`  
**Seguir padrão de:** `tokenCleanupJob.js` (ver exemplars.md)

**Função:**
- Remove dívidas quitadas há mais de 180 dias
- Chama `debtRepository.excluirQuitadasAntigas(180)`
- Loga resultado: `logger.info('🧹 Job limpeza dívidas: X dívida(s) removida(s)', { removidas })`

---

### debtAlertJob.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/api/src/jobs/debtAlertJob.js`  
**Seguir padrão de:** `reminderAlertJob.js` (ver exemplars.md)

**Função:**
- Busca dívidas não quitadas com `prazoDevolucao` que vence hoje ou em 2 dias
- Para cada dívida:
  - Verifica se já existe notificação duplicada (usando `notificationService.verificarNotificacaoDuplicadaDivida()`)
  - Se não houver, cria notificação tipo `DIVIDA_COBRANCA`:
    ```javascript
    {
      tipo: 'DIVIDA_COBRANCA',
      titulo: 'Vencimento de dívida',
      mensagem: `A dívida com ${divida.nomePessoa} vence ${diasRestantes === 0 ? 'hoje' : 'em 2 dias'}. Valor: R$ ${divida.valor}`,
      linkAcao: '/debts',
      metadados: {
        dividaId: divida.id,
        nomePessoa: divida.nomePessoa,
        valor: divida.valor,
        prazoDevolucao: divida.prazoDevolucao,
        direcao: divida.direcao,
        dataAlerta: hoje.toISOString(),
      }
    }
    ```
- Loga resultado: `logger.info('🔔 Job alertas dívidas: X notificação(ões) criadas (Y dívidas verificadas)', { criadas, verificadas })`

---

### Atualização em cronScheduler.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/api/src/utils/cronScheduler.js` (ou onde os jobs são agendados)

**NOVO a adicionar:**

```javascript
const { runDebtCleanupJob } = require('../jobs/debtCleanupJob');
const { runDebtAlertJob } = require('../jobs/debtAlertJob');

// Job de limpeza: roda todo dia às 02:00 AM
cron.schedule('0 2 * * *', async () => {
  try {
    await runDebtCleanupJob();
  } catch (error) {
    logger.error('Erro no job de limpeza de dívidas:', error);
  }
});

// Job de alertas: roda todo dia às 08:00 AM
cron.schedule('0 8 * * *', async () => {
  try {
    await runDebtAlertJob();
  } catch (error) {
    logger.error('Erro no job de alertas de dívidas:', error);
  }
});
```

---

### Atualização em notificationService.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/api/src/services/notificationService.js`

**Métodos existentes (não alterar):**
- `listarNotificacoes()`
- `contarNaoLidas()`
- `marcarComoLida()`
- `marcarTodasLidas()`
- `criarNotificacao()`
- `verificarNotificacaoDuplicada()` — para orçamento
- `verificarNotificacaoDuplicadaLembrete()` — para lembretes

**Método NOVO a adicionar:**

```javascript
const verificarNotificacaoDuplicadaDivida = async (usuarioId, tipo, metadados) => {
  if (!metadados?.dividaId || !metadados?.dataAlerta) return null;
  return notificationRepository.buscarDuplicadaDivida(
    usuarioId,
    tipo,
    metadados.dividaId,
    metadados.dataAlerta
  );
};

module.exports = {
  // ...existentes,
  verificarNotificacaoDuplicadaDivida, // NOVO
};
```

---

### Atualização em notificationRepository.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/api/src/repositories/notificationRepository.js`

**Métodos existentes (não alterar):**
- `listar()`
- `contarNaoLidas()`
- `buscarPorId()`
- `marcarComoLida()`
- `marcarTodasLidas()`
- `criar()`
- `buscarDuplicadaOrcamento()`
- `buscarDuplicadaLembrete()`

**Método NOVO a adicionar:**

```javascript
const buscarDuplicadaDivida = async (usuarioId, tipo, dividaId, dataAlerta) => {
  const inicio = new Date(dataAlerta);
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date(dataAlerta);
  fim.setHours(23, 59, 59, 999);

  return prisma.notificacao.findFirst({
    where: {
      usuarioId,
      tipo,
      criadoEm: {
        gte: inicio,
        lte: fim,
      },
      metadados: {
        path: ['dividaId'],
        equals: dividaId,
      },
    },
  });
};

module.exports = {
  // ...existentes,
  buscarDuplicadaDivida, // NOVO
};
```

---

## 🚫 Regras de Negócio

* Data do empréstimo não pode ser futura
* Prazo de devolução (se fornecido) deve ser posterior à data do empréstimo
* Observação limitada a 250 caracteres
* Não pode editar dívida já quitada
* Não pode deletar dívida quitada manualmente
* Apenas dívidas com `prazoDevolucao` definido recebem notificações de vencimento
* Notificações geradas apenas para vencimentos "hoje" e "em 2 dias"
* Job de limpeza remove dívidas quitadas há mais de 180 dias
* Filtro de período aplica-se à `dataEmprestimo`
* Busca procura em `nomePessoa` (case-insensitive)
* Ordenação por valor pode ser `asc` ou `desc`

---

## 🔮 Integrações Futuras (não implementar agora)

* **Transações:** Ao marcar dívida como quitada, perguntar ao usuário se deseja criar transação (tipo RECEITA se ME_DEVEM, DESPESA se EU_DEVO). Requer modal de confirmação no frontend.
* **Gamificação:** Badges "Emprestador confiável", "Devedor pontual", conquistas por quitar todas as dívidas, etc.

---

# [STORY FRONTEND] Dívidas — Frontend

**Tipo:**        Story  
**Prioridade:**  🔼 High  
**Sprint:**      (preencher)  
**Categoria:**   Frontend  
**Relator:**     (preencher)  
**Pai:**         [EPIC] Dívidas — Gerenciamento de Empréstimos  
**Data Limite:** (preencher)

---

## 📝 Descrição

Como usuário final, eu quero uma interface completa para gerenciar meus empréstimos (quem me deve e a quem eu devo), com filtros, busca, notificações visuais de vencimento, modais para criar/editar/quitar dívidas, e histórico de quitações, para que eu possa manter controle financeiro completo sobre empréstimos pessoais.

---

## ✅ Critérios de Aceite

### Cenário 1 — Carregamento da página
**Dado** que o usuário acessa `/debts`,  
**Quando** a página carrega,  
**Então**:
- Exibe 2 cards de resumo no topo: "Me devem R$ X,XX" (verde) e "Eu devo R$ X,XX" (vermelho)
- Exibe 3 tabs: "Me devem", "Eu devo", "Quitadas" (tab "Me devem" ativa por padrão)
- Lista dívidas da categoria selecionada (inicialmente "Me devem")
- Cada item mostra: foto/avatar, nome da pessoa, valor, data do empréstimo, prazo de devolução (se houver), status visual (badge colorido), botões de ação
- Exibe skeleton/loading enquanto carrega dados
- Se não houver dívidas: Exibe estado vazio com ilustração e botão "+ Novo Empréstimo"

### Cenário 2 — Alternar entre tabs
**Dado** que a página está carregada,  
**Quando** o usuário clica na tab "Eu devo",  
**Então**:
- Lista é recarregada mostrando apenas dívidas onde `direcao === "EU_DEVO"` e `quitada === false`
- Cards de resumo permanecem os mesmos (totais gerais)
- Filtros aplicados são mantidos

### Cenário 3 — Tab "Quitadas"
**Dado** que a página está carregada,  
**Quando** o usuário clica na tab "Quitadas",  
**Então**:
- Lista mostra dívidas com `quitada === true`, independente da direção
- Cada item mostra badge "Quitada em DD/MM/YYYY" (verde)
- Botões de editar e deletar estão ocultos
- Apenas botão "Ver detalhes" (opcional) ou nenhum botão de ação

### Cenário 4 — Status visual de vencimento
**Dado** que a dívida tem `prazoDevolucao` definido,  
**Quando** a lista é exibida,  
**Então**:
- Se vence em mais de 2 dias: Badge verde "Vence em DD/MM/YYYY"
- Se vence em exatamente 2 dias: Badge amarelo "⚠️ Vence em 2 dias"
- Se vence hoje: Badge vermelho "🔴 Vence hoje"
- Se venceu (prazo passado): Badge vermelho "🔴 Vencido há X dias"
- Se não tem prazo: Badge cinza "Sem prazo definido"

### Cenário 5 — Filtros e busca
**Dado** que a página está carregada,  
**Quando** o usuário:
- Digita "João" no campo de busca → filtra por `nomePessoa` contendo "João"
- Seleciona "Menor para maior" no ordenar por valor → ordena por `valor` ASC
- Seleciona período "01/06/2026 - 30/06/2026" no DateRangePicker → filtra por `dataEmprestimo` no intervalo
**Então** a lista é recarregada aplicando todos os filtros simultaneamente.

### Cenário 6 — Criar nova dívida
**Dado** que o usuário clica no botão "+ Novo Empréstimo",  
**Quando** o modal abre,  
**Então**:
- Exibe seção "1. DIREÇÃO" com 2 cards selecionáveis: "Emprestei (me devem)" e "Peguei emprestado (eu devo)"
- Exibe seção "2. DADOS DO EMPRÉSTIMO" com campos:
  - Nome da pessoa (input text, obrigatório, max 120 chars)
  - Valor (input number, obrigatório, > 0, formato R$ X,XX)
  - Data do empréstimo (date picker, obrigatório, não pode ser futura)
  - Toggle "Definir prazo de devolução?" (opcional)
    - Se ativado: Exibe date picker para prazo (obrigatório se toggle ligado, deve ser posterior à data do empréstimo)
  - Observação (textarea, opcional, max 250 chars, contador "X/250")
- Exibe seção "3. RESUMO" com prévia visual: "João te deve R$ 250,00" ou "Você deve R$ 250,00 para João" + "Devolução até: 30/06/2026" (se prazo definido)
- Botões: "Cancelar" e "Registrar"

**Quando** o usuário preenche o formulário e clica "Registrar",  
**Então**:
- Valida campos (exibe erros em vermelho abaixo de cada campo)
- Se válido: Envia `POST /api/dividas`, fecha modal, exibe toast de sucesso, recarrega lista
- Se erro da API: Exibe toast de erro com mensagem retornada

### Cenário 7 — Editar dívida não quitada
**Dado** que o usuário clica no botão "✏️ Editar" de uma dívida não quitada,  
**Quando** o modal abre,  
**Então**:
- Campos são pré-preenchidos com dados atuais da dívida
- Direção não pode ser alterada (campo desabilitado ou oculto)
- Usuário pode modificar: nome, valor, data do empréstimo, prazo, observação
- Botões: "Cancelar" e "Salvar Alterações"

**Quando** o usuário salva,  
**Então**:
- Envia `PATCH /api/dividas/:id`, fecha modal, exibe toast de sucesso, recarrega lista

### Cenário 8 — Marcar como quitada
**Dado** que o usuário clica no botão "✅ Marcar como paga" de uma dívida não quitada,  
**Quando** modal de confirmação abre,  
**Então**:
- Exibe mensagem: "Tem certeza que deseja marcar esta dívida como quitada? [Nome da pessoa] — R$ X,XX. Esta ação não pode ser desfeita."
- Botões: "Cancelar" e "Confirmar"

**Quando** o usuário confirma,  
**Então**:
- Envia `PATCH /api/dividas/:id/quitar`, fecha modal, exibe toast de sucesso "Dívida marcada como quitada!", recarrega lista

### Cenário 9 — Deletar dívida não quitada
**Dado** que o usuário clica no botão "🗑️ Deletar" de uma dívida não quitada,  
**Quando** modal de confirmação abre,  
**Então**:
- Exibe mensagem: "Tem certeza que deseja excluir esta dívida? Esta ação não pode ser desfeita."
- Botões: "Cancelar" e "Excluir"

**Quando** o usuário confirma,  
**Então**:
- Envia `DELETE /api/dividas/:id`, fecha modal, exibe toast de sucesso "Dívida excluída!", recarrega lista

### Cenário 10 — Tentativa de editar/deletar dívida quitada
**Dado** que a dívida está quitada,  
**Quando** o usuário tenta editar ou deletar (botões devem estar ocultos, mas caso haja tentativa via URL direta),  
**Então**:
- API retorna 400 "Não é possível editar/deletar uma dívida já quitada"
- Frontend exibe toast de erro com a mensagem

### Cenário 11 — Notificações de vencimento
**Dado** que existem dívidas com prazo de vencimento próximo,  
**Quando** o job backend cria notificações tipo `DIVIDA_COBRANCA`,  
**Então**:
- Sininho no layout (NotificationPanel) exibe badge com contador de não lidas
- Ao abrir painel: notificação aparece com ícone `Wallet`, cor laranja, título "Vencimento de dívida", mensagem "A dívida com [Nome] vence [hoje|em 2 dias]. Valor: R$ X,XX"
- Ao clicar na notificação: redireciona para `/debts`, marca notificação como lida

### Cenário 12 — Loading e erro
**Dado** que a API está demorando ou retornou erro,  
**Quando** a requisição está em andamento,  
**Então**: Exibe skeleton/spinner nos cards e lista

**Se** a API retorna erro 500 ou falha de rede,  
**Então**: Exibe estado de erro com botão "Tentar novamente"

---

## 🎨 Visual e UX

### Referência de Layout

Seguir protótipos fornecidos:
- Tela principal com 2 cards de resumo no topo (Me devem em verde, Eu devo em vermelho)
- Tabs para filtrar categorias (Me devem, Eu devo, Quitadas)
- Lista de dívidas com foto circular, nome, valor, datas, badges de status, botões de ação
- Modal de criar/editar com 3 seções visuais: Direção, Dados, Resumo

### Componentes e Estilo

* **Cards de resumo:**
  - Background gradient (verde para "Me devem", vermelho para "Eu devo")
  - Ícone grande (ArrowDownLeft para "Me devem", ArrowUpRight para "Eu devo")
  - Valor em destaque (font-size grande, bold)
  - Label "Total a receber" / "Total a pagar"

* **Tabs:**
  - Design system: `<Tabs>` com `variant="underline"`
  - Indicador ativo abaixo da tab

* **Lista de dívidas:**
  - Cada item: Card com padding, hover:shadow
  - Avatar à esquerda (circular, 48px)
  - Info no centro: nome (bold), valor (verde ou vermelho conforme direção), datas (small text, gray)
  - Badge de status à direita (cores: verde, amarelo, vermelho, cinza)
  - Botões de ação no canto direito (ícones: CheckCircle, Edit, Trash)

* **Modal:**
  - Largura max 600px, centralizado
  - Seção 1 (Direção): 2 cards lado a lado, seleção visual (borda grossa quando selecionado)
  - Seção 2 (Dados): Formulário vertical, labels em cima dos campos, validação inline
  - Seção 3 (Resumo): Card destacado com cor de fundo suave, ícone de coração verde, texto resumo
  - Botões no rodapé: Cancelar (ghost) e Registrar/Salvar (primary)

* **Responsividade:**
  - Desktop: Layout 2 colunas (cards de resumo lado a lado)
  - Tablet/Mobile: Layout 1 coluna (cards empilhados), modal ocupa largura quase total

---

## ⚙️ Integração Técnica

### Services

#### debtService.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/services/debtService.js`  
**Seguir padrão de:** `transactionService.js` (ver exemplars.md)

**Métodos a implementar:**

→ `buscarDividas(filtros, options)` → `GET /api/dividas?...` (retorna `{ dividas, total, paginas, pagina }`)

→ `obterResumo(options)` → `GET /api/dividas/resumo` (retorna `{ meDevem: { total, quantidade }, euDevo: { total, quantidade } }`)

→ `criarDivida(payload)` → `POST /api/dividas` (retorna dívida criada)

→ `atualizarDivida(id, payload)` → `PATCH /api/dividas/${id}` (retorna dívida atualizada)

→ `quitarDivida(id)` → `PATCH /api/dividas/${id}/quitar` (retorna dívida atualizada)

→ `excluirDivida(id)` → `DELETE /api/dividas/${id}` (sem retorno)

---

### Hooks (TanStack Query)

#### useDebts.js (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/hooks/useDebts.js`  
**Seguir padrão de:** Hooks similares com TanStack Query (se houver exemplar, use; caso contrário, seguir padrão de `useNotifications.js` ou `useReminders.js`)

**Hooks a implementar:**

→ `useDebtsList(filtros)` — useQuery que chama `debtService.buscarDividas(filtros)`

→ `useDebtsSummary()` — useQuery que chama `debtService.obterResumo()`

→ `useCreateDebt()` — useMutation que chama `debtService.criarDivida()`, invalida queries `['debts']` e `['debts-summary']`

→ `useUpdateDebt()` — useMutation que chama `debtService.atualizarDivida()`, invalida queries

→ `useSettleDebt()` — useMutation que chama `debtService.quitarDivida()`, invalida queries

→ `useDeleteDebt()` — useMutation que chama `debtService.excluirDivida()`, invalida queries

---

### Páginas

#### DebtsPage.jsx (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/pages/DebtsPage.jsx`  
**Seguir padrão de:** `TransactionsPage.jsx` (ver exemplars.md)

**Estrutura:**
- Estado local: `tabAtiva` (ME_DEVEM, EU_DEVO, QUITADAS), `filtros` (busca, ordenarValor, periodoInicio, periodoFim)
- Usa hooks: `useDebtsSummary()`, `useDebtsList(filtros)`
- Renderiza: `<DebtSummaryCards>`, `<DebtTabs>`, `<DebtFilters>`, `<DebtList>`, `<DebtFormModal>`, `<DeleteDebtModal>`, `<SettleDebtModal>`

---

### Componentes

#### components/features/debts/ (NOVA PASTA — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/features/debts/`  
**Seguir padrão de:** `components/features/transactions/` (ver exemplars.md)

**Componentes a criar:**

→ **DebtSummaryCards.jsx:**
  - Recebe: `summary` (`{ meDevem, euDevo }`)
  - Renderiza: 2 cards lado a lado com gradientes, ícones, valores

→ **DebtTabs.jsx:**
  - Recebe: `tabAtiva`, `onChangeTab`
  - Renderiza: `<Tabs>` com 3 tabs (Me devem, Eu devo, Quitadas)

→ **DebtFilters.jsx:**
  - Recebe: `filtros`, `onChangeFiltro`, `onLimpar`
  - Renderiza: Input de busca, Select de ordenar valor, DateRangePicker de período, botões Filtrar/Limpar

→ **DebtList.jsx:**
  - Recebe: `dividas` (array), `loading`, `onEdit`, `onSettle`, `onDelete`
  - Renderiza: Lista de `<DebtCard>` ou estado vazio

→ **DebtCard.jsx:**
  - Recebe: `divida`, `onEdit`, `onSettle`, `onDelete`
  - Renderiza: Avatar, nome, valor, datas, badge de status, botões de ação (condicionalmente exibidos se não quitada)

→ **DebtFormModal.jsx:**
  - Recebe: `open`, `onClose`, `divida` (para edição, opcional)
  - Estados: direção, nomePessoa, valor, dataEmprestimo, prazoDevolucao, observacao, togglePrazo
  - Validação: React Hook Form + Zod
  - Usa: `useCreateDebt()` ou `useUpdateDebt()`

→ **SettleDebtModal.jsx:**
  - Recebe: `open`, `onClose`, `divida`
  - Modal de confirmação simples
  - Usa: `useSettleDebt()`

→ **DeleteDebtModal.jsx:**
  - Recebe: `open`, `onClose`, `divida`
  - Modal de confirmação simples
  - Usa: `useDeleteDebt()`

---

### Componentes do Design System (já existem, reutilizar)

- `<Button>`, `<Input>`, `<Select>`, `<Modal>`, `<Tabs>`, `<Badge>`, `<Card>`, `<Textarea>`, `<Toggle>`, `<DatePicker>` / `<DateRangePicker>` (se não existir DateRangePicker, criar ou usar biblioteca externa)

---

### Badges de Status

**Criar lógica em:** `Codigo/Pulso/web/src/utils/debtStatusUtils.js`

**Função:** `getDebtStatusBadge(divida)`

Retorna objeto:
```javascript
{
  label: "Vence em 5 dias" | "⚠️ Vence em 2 dias" | "🔴 Vence hoje" | "🔴 Vencido há 3 dias" | "Sem prazo definido" | "✅ Quitada em 12/06/2026",
  variant: "success" | "warning" | "error" | "neutral",
  color: "green" | "yellow" | "red" | "gray"
}
```

---

## 📐 Rotas

### Atualização em appRoutes.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/config/appRoutes.js`

**Rotas existentes (não alterar):**
- `/`, `/login`, `/register`, `/transactions`, `/budget`, `/calendar`, etc.

**Rota NOVA a adicionar:**

```javascript
{
  path: '/debts',
  element: <DebtsPage />,
  protected: true, // Requer autenticação
}
```

---

### Atualização em sidebarNavigation.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/config/sidebarNavigation.js`

**Item JÁ EXISTE no sidebar:**
```javascript
{ id: 'dividas', label: 'Dívidas', path: '/debts', icon: 'Landmark' }
```

**Ação:** Nenhuma modificação necessária (rota já configurada, apenas remover placeholder e ativar página real).

---

### Endpoints consumidos

* `GET /api/dividas` — Listar dívidas com filtros
* `GET /api/dividas/resumo` — Obter totais (Me devem, Eu devo)
* `POST /api/dividas` — Criar nova dívida
* `PATCH /api/dividas/:id` — Editar dívida
* `PATCH /api/dividas/:id/quitar` — Marcar como quitada
* `DELETE /api/dividas/:id` — Excluir dívida

---

## 🚫 Regras de Negócio

* Data do empréstimo não pode ser futura (validação no formulário)
* Prazo de devolução (se fornecido) deve ser posterior à data do empréstimo
* Observação limitada a 250 caracteres (contador visual)
* Não pode editar dívida já quitada (botão oculto)
* Não pode deletar dívida quitada (botão oculto)
* Tab "Quitadas" mostra apenas dívidas com `quitada === true`
* Notificações de vencimento aparecem apenas para dívidas com prazo definido

---

## 🛠️ Refinamento

* **Estado Global:** Não usar Redux para dívidas; TanStack Query gerencia cache de server state
* **Validação:** React Hook Form + Zod (schemas `createDebtSchema`, `updateDebtSchema`)
* **Toasts:** Usar `<Toast>` do design system para feedback de sucesso/erro
* **Acessibilidade:** Labels em todos os inputs, modais com foco trap, botões com aria-label
* **Performance:** Debounce no campo de busca (300ms), paginação na lista (limite 10 por padrão)
* **Responsividade:** Mobile-first, breakpoints em `sm:`, `md:`, `lg:`

---

## 🔮 Integrações Futuras (não implementar agora)

* **Modal de confirmação ao quitar:** Perguntar se deseja criar transação automática (tipo RECEITA se ME_DEVEM, DESPESA se EU_DEVO)
* **Gamificação:** Exibir badges e conquistas relacionadas a empréstimos na página de perfil
* **Exportação:** Botão para exportar lista de dívidas em PDF ou CSV
* **Gráficos:** Visão gráfica de evolução de dívidas ao longo do tempo

---

**FIM DO EPIC**
