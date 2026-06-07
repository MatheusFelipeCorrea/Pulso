# [EPIC] Gerenciamento de Transações

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Transações, Frontend, Backend
Relator:     (preencher)
Pai:         —
Data Limite: (preencher)

## Descrição

Esta epic implementa o **módulo completo de gerenciamento de transações financeiras** do Pulso, permitindo que usuários registrem, visualizem, filtrem, editem e excluam suas receitas e despesas de forma intuitiva e eficiente.

### Telas e Funcionalidades Principais

#### 📊 Tela de Transações

A tela principal de transações é organizada em três seções principais:

**1. Cards de Resumo (Header)**
- **Receitas** - Exibe o valor total de receitas no período, número de lançamentos e seta verde indicando crescimento
- **Despesas** - Exibe o valor total de despesas no período, número de lançamentos e seta vermelha indicando gastos
- **Saldo** - Exibe o saldo líquido (receitas - despesas) no período com ícone de copy para copiar o valor
- Os cards calculam em tempo real conforme os filtros são aplicados

**2. Sistema de Filtros Avançado**
- **Busca por descrição ou tag** - Campo de texto para buscar transações por descrição ou nome da tag
- **Filtro de Período** - Seletor de mês e ano (exemplo: "Maio de 2025")
- **Filtro de Categoria** - Dropdown com todas as categorias do usuário + opção "Todas"
- **Filtro de Tipo** - Dropdown com opções: Todos, Receita, Despesa
- **Filtro de Recurso** - Dropdown com opções: Todos, Dinheiro, VA, VR, VT
- **Botão "Filtrar"** - Inicialmente DESABILITADO, habilita quando qualquer filtro é alterado
- **Comportamento do botão:**
  - Estado inicial: "Filtrar" (desabilitado, cinza)
  - Após alterar filtros: "Filtrar" (habilitado, roxo primário)
  - Após aplicar filtros: "Limpar filtros" (habilitado, com ícone de spinner/refresh)
  - Ao clicar em "Limpar filtros": reseta todos os filtros e volta ao estado inicial

**3. Lista de Transações**
- Exibe transações agrupadas por data (formato: "23 de Maio de 2025")
- Cada transação mostra:
  - Ícone colorido da categoria (circular)
  - Descrição da transação
  - Badge do recurso (Dinheiro, VT, VR, VA) com cores diferentes
  - Valor (verde para receitas com "+", vermelho para despesas com "-")
  - Ações: Editar (ícone de lápis) e Excluir (ícone de lixeira)
- **Paginação** na parte inferior com números de página clicáveis
- **Transações recorrentes** - Não têm indicador visual especial na lista (o ícone de refresh foi bug do protótipo)

#### ➕ Modal "Nova Transação"

Modal centralizado com os seguintes campos:

- **Toggle Receita/Despesa** - Botão toggle no topo, alterna entre verde (Receita) e vermelho (Despesa)
- **Valor** - Campo de entrada numérica com máscara de moeda (R$ 0,00)
- **Data** - Seletor de data (padrão: data atual)
- **Categoria** - Dropdown com categorias filtradas por tipo (receita ou despesa)
- **Descrição** - Campo de texto opcional (exemplo: "Ex: Almoço no RU")
- **Recurso de origem** - Dropdown com opções: Dinheiro, VA, VR, VT (filtrado conforme modo de uso do usuário)
- **Tags** - Campo multi-select com chips:
  - Exibe tags existentes do usuário em um dropdown
  - Permite criar novas tags digitando e pressionando Enter
  - Tags selecionadas aparecem como chips com "X" para remover
  - Aceita múltiplas tags por transação (exemplo: "faculdade", "almoço", "RU")
- **Checkbox "Repetir automaticamente"** - Ao marcar, expande campos de recorrência:
  - **Frequência** - Dropdown: Semanal, Quinzenal, Mensal, Anual
  - **Até quando** - Dropdown: Sem fim, Data específica
  - Se "Data específica": exibe seletor de data

**Validações do Modal:**
- Valor obrigatório e maior que zero
- Data obrigatória
- Categoria obrigatória
- Recurso obrigatório
- **Validação cruzada (Regras RN-032, RN-035, RN-038, RN-039):**
  - VA só pode ser usado com categorias de tipo "Alimentação" ou "Compras"
  - VR só pode ser usado com categoria "Alimentação"
  - VT só pode ser usado com categoria "Transporte"
  - VT NUNCA pode ser usado com categoria "Alimentação"
  - Se validação falhar: exibir mensagem de erro em vermelho abaixo do campo

#### ✏️ Modal "Editar Transação"

Idêntico ao modal de criação, mas:
- Título: "Editar Transação"
- Campos pré-preenchidos com os dados da transação
- Botão "Excluir" em vermelho na parte inferior esquerda
- Ao clicar em "Excluir":
  - Se transação não é recorrente: confirmar exclusão
  - Se transação é recorrente: perguntar "Excluir só esta ou todas as futuras?" (RN-052)
- Mesmas validações do modal de criação

### Regras de Negócio Aplicadas

- **RN-026 a RN-031:** Benefícios cumulativos/não cumulativos (não afeta esta tela diretamente, mas valida saldo disponível)
- **RN-032 a RN-045:** Regras de validação de recurso x categoria (implementadas no backend e frontend)
- **RN-046 a RN-054:** Regras de transações (valor positivo, recurso obrigatório, validação cruzada, recorrência, streak de gamificação)
- **RN-159 a RN-168:** Regras gerais (valores com 2 casas decimais, categorias padrão criadas no registro)

### Comportamento de Categorias Padrão (RN-165)

Ao registrar uma nova conta, as seguintes categorias padrão são criadas automaticamente:
- **Receitas:** Salário, Freelance, Investimentos, Outros
- **Despesas:** Alimentação, Transporte, Lazer, Educação, Moradia, Saúde, Compras, Outros

Categorias padrão não podem ser excluídas, apenas ocultas.

### Protótipos Visuais

Ver imagens anexadas:
- [Imagem 1] Tela principal com filtros, cards de resumo e lista de transações
- [Imagem 2] Modal "Nova Transação" e "Editar Transação" com todos os campos
- [Imagem 3] Validação de erro ao tentar usar VT para despesa de alimentação
- [Imagem 4] Vista em tela ampla mostrando paginação

---

# [STORY BACKEND] Gerenciamento de Transações — Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Gerenciamento de Transações
Data Limite: (preencher)

## 📝 Descrição

Como sistema, eu quero implementar todos os endpoints necessários para gerenciar transações financeiras (criar, listar, editar, excluir), calcular resumos e aplicar filtros avançados, para que o frontend possa oferecer uma experiência completa de gestão financeira.

---

## ✅ Critérios de Aceite

### Cenário 1 — Listar transações com filtros
**Dado** que o usuário autenticado possui transações registradas,  
**Quando** GET /api/transacoes é chamado com query params `?periodo=2025-05&categoria=id123&tipo=DESPESA&recurso=VT&busca=almoço&pagina=1&limite=10`,  
**Então** retorna 200 com array de transações filtradas, cada uma contendo:
```json
{
  "id": "cuid",
  "tipo": "DESPESA",
  "recurso": "VT",
  "valor": "27.45",
  "descricao": "Vale Transporte",
  "data": "2025-05-22T00:00:00.000Z",
  "recorrente": false,
  "categoria": {
    "id": "cuid",
    "nome": "Transporte",
    "icone": "Bus",
    "cor": "#3B82F6"
  },
  "tags": [
    {
      "id": "cuid",
      "nome": "faculdade",
      "icone": "GraduationCap",
      "cor": "#8B5CF6"
    }
  ]
}
```
* **E** retorna headers de paginação: `X-Total-Count`, `X-Total-Pages`, `X-Current-Page`
* **E** transações são ordenadas por data decrescente (mais recentes primeiro)
* **Se** busca fornecida: filtra por `descricao ILIKE %busca%` OU tags que contenham a busca
* **Se** nenhuma transação encontrada: retorna 200 com array vazio `[]`

### Cenário 2 — Calcular resumo do período
**Dado** que o usuário possui transações no período selecionado,  
**Quando** GET /api/transacoes/resumo é chamado com query params `?periodo=2025-05&categoria=id123&tipo=TODOS&recurso=TODOS`,  
**Então** retorna 200 com:
```json
{
  "receitas": {
    "total": "7850.00",
    "quantidade": 12
  },
  "despesas": {
    "total": "3289.25",
    "quantidade": 18
  },
  "saldo": "4560.75"
}
```
* **E** valores são calculados considerando os mesmos filtros aplicados na listagem
* **Se** filtros mudarem: recalcula o resumo em tempo real

### Cenário 3 — Criar transação simples (não recorrente)
**Dado** que o usuário está autenticado,  
**Quando** POST /api/transacoes é chamado com payload:
```json
{
  "tipo": "DESPESA",
  "categoriaId": "cuid_categoria_alimentacao",
  "recurso": "VR",
  "valor": 25.00,
  "descricao": "Almoço no RU",
  "data": "2025-05-15T00:00:00.000Z",
  "tags": ["cuid_tag_faculdade", "cuid_tag_almoco"],
  "recorrente": false
}
```
**Então** retorna 201 com a transação criada (inclui id, criadoEm, atualizadoEm).
* **Se** categoria não existe ou não pertence ao usuário: retorna 404 "Categoria não encontrada"
* **Se** tag não existe: retorna 404 "Tag '{nome}' não encontrada"
* **Se** validação cruzada recurso x categoria falhar: retorna 400 com mensagem específica (ver Cenário 6)

### Cenário 4 — Criar transação recorrente
**Dado** que o usuário está autenticado,  
**Quando** POST /api/transacoes é chamado com payload:
```json
{
  "tipo": "RECEITA",
  "categoriaId": "cuid_categoria_salario",
  "recurso": "DINHEIRO",
  "valor": 3850.00,
  "descricao": "Salário mensal",
  "data": "2025-05-05T00:00:00.000Z",
  "tags": [],
  "recorrente": true,
  "regraRecorrencia": "FREQ=MONTHLY;INTERVAL=1;UNTIL=20251231T235959Z"
}
```
**Então** retorna 201 com a transação "mãe" criada (paiId = null, regraRecorrencia preenchida).
* **E** transações filhas são geradas automaticamente pelo job cron no dia programado (não criadas imediatamente)
* **E** cada transação filha terá `paiId` apontando para a transação mãe

### Cenário 5 — Editar transação
**Dado** que a transação "cuid123" existe e pertence ao usuário autenticado,  
**Quando** PATCH /api/transacoes/cuid123 é chamado com payload:
```json
{
  "valor": 30.00,
  "descricao": "Almoço no RU - atualizado",
  "tags": ["cuid_tag_faculdade"]
}
```
**Então** retorna 200 com a transação atualizada.
* **Se** transação não existe ou não pertence ao usuário: retorna 404 "Transação não encontrada"
* **Se** tentar editar transação recorrente filha: apenas a instância específica é editada (não afeta as futuras)
* **Se** validação cruzada recurso x categoria falhar: retorna 400 com mensagem específica

### Cenário 6 — Validação cruzada recurso x categoria
**Dado** que o usuário tenta criar/editar uma transação,  
**Quando** a combinação recurso + categoria viola as regras de negócio (RN-032, RN-035, RN-038, RN-039),  
**Então** retorna 400 com mensagem específica:
* **VA + categoria não "Alimentação" ou "Compras":** "VA só pode ser usado em despesas de Alimentação ou Compras"
* **VR + categoria não "Alimentação":** "VR só pode ser usado em despesas de Alimentação"
* **VT + categoria não "Transporte":** "VT só pode ser usado em despesas de Transporte"
* **VT + categoria "Alimentação":** "Não é possível usar VT para despesas de alimentação"

### Cenário 7 — Excluir transação simples
**Dado** que a transação "cuid123" existe, pertence ao usuário e não é recorrente,  
**Quando** DELETE /api/transacoes/cuid123 é chamado,  
**Então** retorna 204 (sem conteúdo) e a transação é excluída.
* **Se** transação não existe ou não pertence ao usuário: retorna 404 "Transação não encontrada"

### Cenário 8 — Excluir transação recorrente (apenas instância)
**Dado** que a transação "cuid123" é uma instância filha de transação recorrente,  
**Quando** DELETE /api/transacoes/cuid123 é chamado,  
**Então** retorna 204 e apenas aquela instância é excluída (futuras não são afetadas).

### Cenário 9 — Excluir transação recorrente (todas as futuras)
**Dado** que a transação "cuid_mae" é a transação mãe recorrente,  
**Quando** DELETE /api/transacoes/cuid_mae?excluirFuturas=true é chamado,  
**Então** retorna 204 e a transação mãe + todas as instâncias filhas são excluídas.

---

## 🛠️ Implementação

### transactionController.js (EXISTENTE — MODIFICAR)

**O arquivo existe mas está vazio. Criar todos os métodos abaixo:**

Métodos NOVOS a adicionar:
* `listarTransacoes()` → GET /api/transacoes
* `obterResumo()` → GET /api/transacoes/resumo
* `criarTransacao()` → POST /api/transacoes
* `editarTransacao()` → PATCH /api/transacoes/:id
* `excluirTransacao()` → DELETE /api/transacoes/:id

**Responsabilidades:**
- Validar schemas com Zod (transactionSchemas.js)
- Extrair userId do req.user (middleware de autenticação)
- Chamar métodos do service
- Retornar respostas HTTP padronizadas
- Capturar erros e passar para errorMiddleware

### transactionService.js (EXISTENTE — MODIFICAR)

**O arquivo existe mas está vazio. Criar toda a lógica de negócio abaixo:**

Lógica NOVA a adicionar:

**`listarTransacoes(usuarioId, filtros)`**
→ Aplica filtros (período, categoria, tipo, recurso, busca)  
→ Busca por descrição OU tags (ILIKE)  
→ Inclui relacionamentos: categoria, tags  
→ Ordena por data DESC  
→ Implementa paginação  
→ Retorna { transacoes, total, paginas }

**`calcularResumo(usuarioId, filtros)`**
→ Filtra transações do usuário no período  
→ Agrupa por tipo (RECEITA, DESPESA)  
→ Calcula SUM(valor) e COUNT(*) para cada tipo  
→ Calcula saldo: receitas.total - despesas.total  
→ Retorna { receitas: { total, quantidade }, despesas: { total, quantidade }, saldo }

**`criarTransacao(usuarioId, dados)`**
→ Valida que categoria pertence ao usuário  
→ Valida que tags pertencem ao usuário  
→ **Aplica validação cruzada recurso x categoria (RN-032, RN-035, RN-038, RN-039)**  
→ Se recorrente: valida regraRecorrencia (formato RFC 5545)  
→ Cria transação via repository  
→ Vincula tags via repository  
→ Se recorrente: agenda job cron para gerar instâncias futuras (RN-050)  
→ Incrementa streak de gamificação (RN-053) via gamificationService  
→ Retorna transação criada com relacionamentos

**`editarTransacao(usuarioId, transacaoId, dados)`**
→ Busca transação e valida ownership  
→ Se alterar categoria ou recurso: valida cruzamento novamente  
→ Se alterar tags: remove vinculações antigas e cria novas  
→ Atualiza transação via repository  
→ Retorna transação atualizada

**`excluirTransacao(usuarioId, transacaoId, excluirFuturas)`**
→ Busca transação e valida ownership  
→ Se `excluirFuturas=true` e transação é mãe: exclui todas as filhas  
→ Se `excluirFuturas=false` ou transação é filha: exclui apenas a instância  
→ Remove via repository

**`validarRecursoCategoria(recurso, categoria)`** (método auxiliar privado)
→ Implementa lógica de validação cruzada conforme RN-032, RN-035, RN-038, RN-039  
→ Lança AppError(400, mensagem específica) se validação falhar  
→ Exemplos de mensagens:
  - "VA só pode ser usado em despesas de Alimentação ou Compras"
  - "VR só pode ser usado em despesas de Alimentação"
  - "VT só pode ser usado em despesas de Transporte"
  - "Não é possível usar VT para despesas de alimentação"

### transactionRepository.js (EXISTENTE — MODIFICAR)

**O arquivo existe mas está vazio. Criar todos os métodos de acesso a dados abaixo:**

Métodos NOVOS a adicionar:

**`listarPorUsuario(usuarioId, filtros, { pagina, limite })`**
→ Query Prisma com where dinâmico  
→ Filtros: período (data between), categoriaId, tipo, recurso, busca (descricao ILIKE OR tags.nome ILIKE)  
→ Include: categoria, tags (via TransacaoTag)  
→ orderBy: data desc  
→ skip/take para paginação  
→ Retorna transacoes + count total

**`calcularAgregados(usuarioId, filtros)`**
→ Query Prisma com agregação:
```javascript
prisma.transacao.groupBy({
  by: ['tipo'],
  where: { usuarioId, ...filtros },
  _sum: { valor: true },
  _count: { id: true }
})
```
→ Retorna array com [{ tipo: 'RECEITA', _sum: { valor }, _count: { id } }, ...]

**`criar(dados)`**
→ Cria transação com prisma.transacao.create  
→ Retorna transação criada

**`vincularTags(transacaoId, tagIds)`**
→ Cria vínculos em TransacaoTag via createMany  
→ Retorna void

**`desvincularTags(transacaoId)`**
→ Remove todos os vínculos de tags da transação  
→ Retorna void

**`buscarPorId(transacaoId, usuarioId)`**
→ Busca transação com validação de ownership  
→ Include: categoria, tags  
→ Retorna transacao ou null

**`atualizar(transacaoId, dados)`**
→ Atualiza transação via prisma.transacao.update  
→ Retorna transação atualizada

**`excluir(transacaoId)`**
→ Exclui transação via prisma.transacao.delete  
→ Retorna void

**`excluirRecorrentesFilhas(paiId)`**
→ Exclui todas as transações com `paiId = paiId`  
→ Retorna void

**`buscarPorPaiId(paiId)`**
→ Lista todas as transações filhas de uma recorrente  
→ Retorna array de transacoes

### categoryRepository.js (EXISTENTE — MODIFICAR)

**O arquivo já existe e tem métodos. Verificar se possui o método abaixo:**

Métodos possivelmente NOVOS a adicionar (se não existirem):

**`buscarPorId(categoriaId)`**
→ Busca categoria por ID  
→ Retorna categoria com campo `tipo` (RECEITA ou DESPESA)

### tagRepository.js (NOVO — CRIAR)

**Este arquivo NÃO existe no projeto.**

Criar em: `src/repositories/tagRepository.js`  
Seguir padrão de: `src/repositories/transactionRepository.js`

Métodos necessários:

**`listarPorUsuario(usuarioId)`**
→ Lista todas as tags do usuário  
→ orderBy: nome ASC  
→ Retorna array de tags

**`buscarPorIds(tagIds, usuarioId)`**
→ Busca múltiplas tags por ID validando ownership  
→ Retorna array de tags

**`criar(usuarioId, dados)`**
→ Cria nova tag para o usuário  
→ Retorna tag criada

**`buscarOuCriar(usuarioId, nome, icone, cor)`**
→ Busca tag por nome (case insensitive)  
→ Se não existe: cria nova  
→ Retorna tag

---

## 📐 Schemas (Zod)

### transactionSchemas.js (EXISTENTE — MODIFICAR)

**O arquivo existe mas está vazio. Criar todos os schemas abaixo:**

Schemas NOVOS a adicionar:

**`criarTransacaoSchema`:**
```javascript
{
  tipo: z.enum(['RECEITA', 'DESPESA']),
  categoriaId: z.string().cuid(),
  recurso: z.enum(['DINHEIRO', 'VA', 'VR', 'VT']),
  valor: z.number().positive('Valor deve ser maior que zero'),
  descricao: z.string().max(255).optional(),
  data: z.string().datetime().or(z.date()),
  tags: z.array(z.string().cuid()).optional().default([]),
  recorrente: z.boolean().default(false),
  regraRecorrencia: z.string().optional() // validação RFC 5545 adicional no service
}
```

**`editarTransacaoSchema`:**
```javascript
{
  tipo: z.enum(['RECEITA', 'DESPESA']).optional(),
  categoriaId: z.string().cuid().optional(),
  recurso: z.enum(['DINHEIRO', 'VA', 'VR', 'VT']).optional(),
  valor: z.number().positive().optional(),
  descricao: z.string().max(255).optional(),
  data: z.string().datetime().or(z.date()).optional(),
  tags: z.array(z.string().cuid()).optional()
}
```

**`listarTransacoesQuerySchema`:**
```javascript
{
  periodo: z.string().regex(/^\d{4}-\d{2}$/).optional(), // YYYY-MM
  categoria: z.string().cuid().optional(),
  tipo: z.enum(['RECEITA', 'DESPESA', 'TODOS']).optional().default('TODOS'),
  recurso: z.enum(['DINHEIRO', 'VA', 'VR', 'VT', 'TODOS']).optional().default('TODOS'),
  busca: z.string().optional(),
  pagina: z.coerce.number().int().positive().default(1),
  limite: z.coerce.number().int().positive().max(100).default(10)
}
```

**`excluirTransacaoQuerySchema`:**
```javascript
{
  excluirFuturas: z.coerce.boolean().optional().default(false)
}
```

---

## 🛣️ Rotas

### transactionRoutes.js (EXISTENTE — MODIFICAR)

**O arquivo existe mas está vazio. Criar todas as rotas abaixo:**

Rotas NOVAS a adicionar:
* GET /api/transacoes → transactionController.listarTransacoes  
  Middlewares: authMiddleware, validateQuery(listarTransacoesQuerySchema)

* GET /api/transacoes/resumo → transactionController.obterResumo  
  Middlewares: authMiddleware, validateQuery(listarTransacoesQuerySchema)

* POST /api/transacoes → transactionController.criarTransacao  
  Middlewares: authMiddleware, validateBody(criarTransacaoSchema), rateLimitMiddleware

* PATCH /api/transacoes/:id → transactionController.editarTransacao  
  Middlewares: authMiddleware, validateBody(editarTransacaoSchema)

* DELETE /api/transacoes/:id → transactionController.excluirTransacao  
  Middlewares: authMiddleware, validateQuery(excluirTransacaoQuerySchema)

**Registrar em: src/routes/index.js**
```javascript
app.use('/api/transacoes', transactionRoutes);
```

---

## 🚫 Regras de Negócio

* **RN-032:** VA só pode ser gasto em despesas da categoria "Alimentação" ou "Compras (mercado)"
* **RN-035:** VR só pode ser gasto em despesas da categoria "Alimentação" (restaurantes, lanches)
* **RN-038:** VT só pode ser gasto em despesas da categoria "Transporte"
* **RN-039:** Despesas de alimentação NUNCA podem usar recurso VT
* **RN-046:** Toda transação deve ter: valor, data, categoria, recurso e tipo (receita/despesa)
* **RN-047:** Valor deve ser positivo e maior que zero
* **RN-048:** Recurso é obrigatório (Dinheiro, VA, VR ou VT)
* **RN-049:** Validação cruzada: categoria + recurso devem ser compatíveis
* **RN-050:** Transações recorrentes geram automaticamente via cron no dia programado
* **RN-051:** O usuário pode cancelar a recorrência a qualquer momento (excluindo a transação mãe)
* **RN-052:** Ao excluir uma transação recorrente, perguntar: "Excluir só esta ou todas as futuras?"
* **RN-053:** Cada transação registrada incrementa o streak de gamificação (1 por dia, não importa quantas)
* **RN-054:** Transação não pode ter data futura (exceto recorrentes programadas)
* **RN-159:** Todos os valores monetários são armazenados com 2 casas decimais
* **RN-165:** Categorias padrão são criadas no registro da conta (Alimentação, Transporte, Lazer, Educação, Moradia, Saúde, Compras, Outros)

---

## 🔄 Job de Transações Recorrentes

### recurringTransactions.js (EXISTENTE — VERIFICAR)

**O arquivo já existe em `src/jobs/recurringTransactions.js`.**

Verificar se implementa a lógica abaixo. Se não, adicionar:

**Lógica esperada:**
- Executa diariamente às 00:05 (cron: `5 0 * * *`)
- Busca todas as transações recorrentes (paiId = null, recorrente = true)
- Para cada transação mãe:
  - Parse da regraRecorrencia (RFC 5545)
  - Verifica se hoje é um dia de ocorrência
  - Se sim: cria nova transação filha com os mesmos dados da mãe, mas `paiId` apontando para a mãe
- Registra logs de sucesso/erro

---

# [STORY FRONTEND] Gerenciamento de Transações — Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Gerenciamento de Transações
Data Limite: (preencher)

## 📝 Descrição

Como usuário, eu quero visualizar, filtrar, criar, editar e excluir minhas transações financeiras através de uma interface intuitiva, para que eu possa gerenciar minhas receitas e despesas de forma eficiente.

---

## ✅ Critérios de Aceite

### Cenário 1 — Carregar página de transações
**Dado** que o usuário está autenticado,  
**Quando** acessa a página /transacoes,  
**Então** a página carrega exibindo:
* Três cards de resumo no topo: Receitas (verde), Despesas (vermelho), Saldo (roxo)
* Filtros com valores padrão: período = mês atual, tipo = "Todos", categoria = "Todas", recurso = "Todos", busca = vazia
* Botão "Filtrar" DESABILITADO (cinza)
* Lista de transações do mês atual ordenadas por data decrescente
* Paginação na parte inferior
* **E** enquanto carrega: exibir skeleton/spinner nos cards de resumo e na lista
* **E** se não há transações: exibir empty state com ilustração e texto "Nenhuma transação encontrada. Comece registrando uma!"

### Cenário 2 — Alterar filtros sem aplicar
**Dado** que a página está carregada,  
**Quando** o usuário altera qualquer filtro (categoria, tipo, recurso, período ou busca),  
**Então** o botão "Filtrar" é HABILITADO e muda para a cor primária (roxo).
* **E** os dados na tela NÃO mudam ainda (aguarda clicar em "Filtrar")

### Cenário 3 — Aplicar filtros
**Dado** que o usuário alterou filtros e o botão "Filtrar" está habilitado,  
**Quando** clica no botão "Filtrar",  
**Então** exibe spinner no botão durante o carregamento,  
**E** faz requisição GET /api/transacoes com os filtros selecionados,  
**E** faz requisição GET /api/transacoes/resumo com os mesmos filtros,  
**E** atualiza os cards de resumo com os novos valores,  
**E** atualiza a lista de transações,  
**E** o botão muda para "Limpar filtros" com ícone de spinner/refresh.

### Cenário 4 — Limpar filtros
**Dado** que o usuário aplicou filtros,  
**Quando** clica em "Limpar filtros",  
**Então** todos os filtros voltam aos valores padrão,  
**E** o botão volta para "Filtrar" DESABILITADO,  
**E** os dados são recarregados sem filtros (mês atual, todos os tipos, todas as categorias, todos os recursos).

### Cenário 5 — Buscar por descrição ou tag
**Dado** que o usuário está na página de transações,  
**Quando** digita "almoço" no campo de busca e clica em "Filtrar",  
**Então** exibe apenas transações que:
* Tenham "almoço" na descrição (case insensitive) OU
* Tenham uma tag com nome "almoço"
* **E** os cards de resumo são recalculados considerando apenas as transações filtradas

### Cenário 6 — Abrir modal "Nova Transação"
**Dado** que o usuário está na página de transações,  
**Quando** clica no botão "+ Nova Transação",  
**Então** abre o modal "Nova Transação" com:
* Toggle Receita/Despesa selecionado em "Receita" (padrão)
* Campo Valor vazio (R$ 0,00)
* Data preenchida com a data atual
* Categoria vazia (placeholder "Selecione uma categoria")
* Descrição vazia (placeholder "Ex: Almoço no RU")
* Recurso vazio (placeholder "Selecione o recurso")
* Tags vazio
* Checkbox "Repetir automaticamente" desmarcado
* Botão "Salvar" habilitado

### Cenário 7 — Criar transação simples (sucesso)
**Dado** que o modal "Nova Transação" está aberto,  
**Quando** o usuário preenche:
* Tipo: Despesa
* Valor: R$ 25,00
* Data: 15/05/2025
* Categoria: Alimentação
* Descrição: Almoço no RU
* Recurso: VR
* Tags: "faculdade", "almoço"
**E** clica em "Salvar",  
**Então** exibe spinner no botão "Salvar",  
**E** faz POST /api/transacoes com o payload correto,  
**E** fecha o modal,  
**E** exibe toast de sucesso "Transação criada com sucesso! 💜",  
**E** atualiza a lista de transações e os cards de resumo automaticamente (via invalidateQueries do TanStack Query).

### Cenário 8 — Criar transação com validação de recurso x categoria (erro)
**Dado** que o modal "Nova Transação" está aberto,  
**Quando** o usuário preenche:
* Tipo: Despesa
* Recurso: VT
* Categoria: Alimentação
**E** clica em "Salvar",  
**Então** a requisição retorna 400 com mensagem "Não é possível usar VT para despesas de alimentação",  
**E** exibe a mensagem de erro em vermelho abaixo do campo "Recurso",  
**E** o modal NÃO fecha,  
**E** o usuário pode corrigir e tentar novamente.

### Cenário 9 — Criar transação recorrente
**Dado** que o modal "Nova Transação" está aberto,  
**Quando** o usuário:
* Preenche os campos normalmente
* Marca o checkbox "Repetir automaticamente"
* Seleciona Frequência: "Mensal"
* Seleciona "Até quando": "Sem fim"
**E** clica em "Salvar",  
**Então** faz POST /api/transacoes com `recorrente: true` e `regraRecorrencia` no formato RFC 5545,  
**E** exibe toast "Transação recorrente criada! Ela será gerada automaticamente todo mês 🔄",  
**E** fecha o modal e atualiza a lista.

### Cenário 10 — Criar nova tag no modal
**Dado** que o modal "Nova Transação" está aberto,  
**Quando** o usuário digita "nova-tag" no campo de tags e pressiona Enter,  
**Então** cria um chip visual com "nova-tag",  
**E** ao salvar: faz POST para criar a tag (se não existir) e vincula à transação.

### Cenário 11 — Editar transação
**Dado** que o usuário está visualizando uma transação na lista,  
**Quando** clica no ícone de lápis (editar),  
**Então** abre o modal "Editar Transação" com todos os campos pré-preenchidos,  
**E** botão "Excluir" em vermelho na parte inferior esquerda,  
**E** ao alterar os dados e clicar em "Salvar":
* Faz PATCH /api/transacoes/:id
* Fecha o modal
* Exibe toast "Transação atualizada com sucesso!"
* Atualiza a lista

### Cenário 12 — Excluir transação simples
**Dado** que o modal "Editar Transação" está aberto e a transação não é recorrente,  
**Quando** o usuário clica em "Excluir",  
**Então** exibe modal de confirmação "Tem certeza que deseja excluir esta transação?",  
**E** ao confirmar:
* Faz DELETE /api/transacoes/:id
* Fecha o modal
* Exibe toast "Transação excluída"
* Atualiza a lista

### Cenário 13 — Excluir transação recorrente
**Dado** que o modal "Editar Transação" está aberto e a transação é uma instância de recorrente,  
**Quando** o usuário clica em "Excluir",  
**Então** exibe modal com duas opções:
* "Excluir só esta"
* "Excluir esta e todas as futuras"
**E** ao selecionar "Excluir só esta":
* Faz DELETE /api/transacoes/:id
**E** ao selecionar "Excluir esta e todas as futuras":
* Faz DELETE /api/transacoes/:id_mae?excluirFuturas=true
**E** fecha o modal, exibe toast e atualiza a lista

### Cenário 14 — Paginação
**Dado** que há mais de 10 transações no período,  
**Quando** o usuário clica em "2" na paginação,  
**Então** faz GET /api/transacoes?pagina=2&limite=10 com os filtros aplicados,  
**E** atualiza a lista com os resultados da página 2,  
**E** destaca o número "2" como página ativa.

### Cenário 15 — Cards de resumo calculam em tempo real
**Dado** que o usuário aplicou filtros (ex: apenas categoria "Alimentação"),  
**Quando** os dados são carregados,  
**Então** os cards de resumo exibem:
* Receitas: soma apenas das receitas de "Alimentação" + quantidade
* Despesas: soma apenas das despesas de "Alimentação" + quantidade
* Saldo: diferença entre receitas e despesas filtradas
* **E** se nenhum filtro aplicado: calcula com todas as transações do período

---

## 🎨 Visual e UX

### Cards de Resumo
* **Receitas:** Fundo verde claro, texto verde escuro, ícone de seta para cima
* **Despesas:** Fundo vermelho claro, texto vermelho escuro, ícone de seta para baixo
* **Saldo:** Fundo roxo claro (cor primária), texto roxo escuro, ícone de copy
* Valores formatados como moeda brasileira (R$ 7.850,00)
* Número de lançamentos em texto menor abaixo do valor

### Filtros
* Dispostos em linha horizontal abaixo dos cards de resumo
* Campo de busca com ícone de lupa à esquerda
* Dropdowns com ícones de calendário (período), categoria, tipo, recurso
* Botão "Filtrar" com largura fixa, alinhado à direita
* Estados do botão:
  - Desabilitado: cinza (#9CA3AF), cursor not-allowed
  - Habilitado: roxo primário (#7C3AED), cursor pointer
  - Com spinner: roxo primário, spinner branco à esquerda do texto

### Lista de Transações
* Agrupamento por data: texto em cinza médio, formato "23 de Maio de 2025"
* Cada transação em card horizontal com:
  - Ícone circular colorido à esquerda (icone da categoria, cor da categoria)
  - Descrição em negrito
  - Badge do recurso (Dinheiro, VT, VR, VA) com cores específicas:
    * Dinheiro: verde
    * VT: azul
    * VR: laranja
    * VA: roxo
  - Valor à direita: verde se receita (+R$ 3.850,00), vermelho se despesa (-R$ 25,00)
  - Ícones de ação à direita: editar (lápis) e excluir (lixeira) em cinza, hover roxo

### Modal "Nova Transação" / "Editar Transação"
* Largura: 600px, centralizado vertical e horizontalmente
* Fundo branco com sombra
* Header com título e botão X para fechar
* Toggle Receita/Despesa: pill switch, verde quando Receita, vermelho quando Despesa
* Campos com labels à esquerda e inputs à direita
* Tags exibidas como chips roxos com X para remover
* Checkbox "Repetir automaticamente" com ícone de refresh
* Ao marcar o checkbox: expande seção de recorrência com animação suave
* Botão "Salvar" roxo primário, botão "Cancelar" cinza
* Botão "Excluir" (no modal de edição) em vermelho, alinhado à esquerda

### Responsividade
* Desktop (>1024px): filtros em linha, lista com 3 colunas
* Tablet (768-1024px): filtros em 2 linhas, lista com 2 colunas
* Mobile (<768px): filtros empilhados, lista em 1 coluna, modal ocupa 95% da largura

---

## ⚙️ Integração Técnica

### Hooks (TanStack Query)

#### useTransactions.js (EXISTENTE — MODIFICAR)

**O arquivo existe mas está vazio. Criar todos os hooks abaixo:**

Hooks NOVOS a adicionar:

**`useGetTransactions(filtros)`**
→ Query key: `['transactions', 'list', filtros]`  
→ Query fn: transactionService.buscarTransacoes(filtros)  
→ Retorna: { data: { transacoes, total, paginas }, isLoading, isError, error }  
→ Configuração: staleTime 1 min, refetchOnWindowFocus false

**`useGetTransactionsSummary(filtros)`**
→ Query key: `['transactions', 'summary', filtros]`  
→ Query fn: transactionService.obterResumo(filtros)  
→ Retorna: { data: { receitas, despesas, saldo }, isLoading, isError }  
→ Configuração: staleTime 1 min

**`useCreateTransaction()`**
→ Mutation fn: transactionService.criar(dados)  
→ onSuccess: invalidateQueries(['transactions', 'list'], ['transactions', 'summary']), toast sucesso  
→ onError: toast erro com mensagem do backend  
→ Retorna: { mutate, isLoading }

**`useUpdateTransaction()`**
→ Mutation fn: transactionService.atualizar(id, dados)  
→ onSuccess: invalidateQueries(['transactions']), toast sucesso  
→ onError: toast erro  
→ Retorna: { mutate, isLoading }

**`useDeleteTransaction()`**
→ Mutation fn: transactionService.excluir(id, excluirFuturas)  
→ onSuccess: invalidateQueries(['transactions']), toast sucesso  
→ onError: toast erro  
→ Retorna: { mutate, isLoading }

### Services

#### transactionService.js (EXISTENTE — MODIFICAR)

**O arquivo existe mas está vazio. Criar todos os métodos abaixo:**

Métodos NOVOS a adicionar:

**`buscarTransacoes(filtros)`**
→ GET /api/transacoes  
→ Query params: periodo, categoria, tipo, recurso, busca, pagina, limite  
→ Retorna: { transacoes, total, paginas }

**`obterResumo(filtros)`**
→ GET /api/transacoes/resumo  
→ Query params: periodo, categoria, tipo, recurso  
→ Retorna: { receitas, despesas, saldo }

**`criar(dados)`**
→ POST /api/transacoes  
→ Body: { tipo, categoriaId, recurso, valor, descricao, data, tags, recorrente, regraRecorrencia }  
→ Retorna: transacao criada

**`atualizar(id, dados)`**
→ PATCH /api/transacoes/:id  
→ Body: campos a atualizar  
→ Retorna: transacao atualizada

**`excluir(id, excluirFuturas = false)`**
→ DELETE /api/transacoes/:id?excluirFuturas={true|false}  
→ Retorna: void (204)

### Componentes

#### Transactions/ (EXISTENTE — MODIFICAR)

**O arquivo `Transactions.jsx` existe mas está vazio.**

Criar estrutura completa da página:

**Estrutura:**
```jsx
<TransactionsPageContainer>
  <PageHeader>
    <Title>Transações</Title>
    <Button onClick={abrirModalCriar}>+ Nova Transação</Button>
  </PageHeader>
  
  <SummaryCards>
    <SummaryCard tipo="receitas" {...resumo.receitas} />
    <SummaryCard tipo="despesas" {...resumo.despesas} />
    <SummaryCard tipo="saldo" valor={resumo.saldo} />
  </SummaryCards>
  
  <TransactionFilters
    filtros={filtros}
    onChange={handleFiltrosChange}
    onFiltrar={handleFiltrar}
    onLimpar={handleLimpar}
    botaoHabilitado={filtrosAlterados}
    filtrosAplicados={filtrosAplicados}
  />
  
  <TransactionList
    transacoes={transacoes}
    isLoading={isLoading}
    onEdit={abrirModalEditar}
    onDelete={handleExcluir}
  />
  
  <Pagination
    paginaAtual={pagina}
    totalPaginas={totalPaginas}
    onChange={setPagina}
  />
  
  {modalAberto && (
    <TransactionForm
      modo={modoModal} // 'criar' | 'editar'
      transacao={transacaoSelecionada}
      onClose={fecharModal}
      onSubmit={handleSubmit}
    />
  )}
</TransactionsPageContainer>
```

**Estado local:**
```javascript
const [filtros, setFiltros] = useState({
  periodo: mesAtual, // formato YYYY-MM
  categoria: null,
  tipo: 'TODOS',
  recurso: 'TODOS',
  busca: ''
});
const [filtrosAplicados, setFiltrosAplicados] = useState(false);
const [filtrosAlterados, setFiltrosAlterados] = useState(false);
const [pagina, setPagina] = useState(1);
const [modalAberto, setModalAberto] = useState(false);
const [modoModal, setModoModal] = useState('criar'); // 'criar' | 'editar'
const [transacaoSelecionada, setTransacaoSelecionada] = useState(null);
```

**Lógica:**
- Ao alterar qualquer filtro: `setFiltrosAlterados(true)`
- Ao clicar em "Filtrar": `setFiltrosAplicados(true)`, `setFiltrosAlterados(false)`, busca dados
- Ao clicar em "Limpar filtros": reseta filtros, `setFiltrosAplicados(false)`, `setFiltrosAlterados(false)`
- useGetTransactions é chamado com `filtros` e `pagina` como dependências
- useGetTransactionsSummary é chamado com `filtros` como dependência

#### TransactionFilters/ (EXISTENTE — MODIFICAR)

**O arquivo `TransactionFilters.jsx` existe mas está vazio.**

Props:
```typescript
{
  filtros: {
    periodo: string, // YYYY-MM
    categoria: string | null,
    tipo: 'TODOS' | 'RECEITA' | 'DESPESA',
    recurso: 'TODOS' | 'DINHEIRO' | 'VA' | 'VR' | 'VT',
    busca: string
  },
  onChange: (novosFiltros) => void,
  onFiltrar: () => void,
  onLimpar: () => void,
  botaoHabilitado: boolean,
  filtrosAplicados: boolean
}
```

**Componentes internos:**
- Input de busca com ícone de lupa
- Select de período (mês/ano)
- Select de categoria (busca categorias do usuário via useGetCategories hook)
- Select de tipo (Todos, Receita, Despesa)
- Select de recurso (Todos, Dinheiro, VA, VR, VT)
- Botão que alterna entre "Filtrar" e "Limpar filtros" com spinner

**Lógica do botão:**
```javascript
const textoBotao = filtrosAplicados ? 'Limpar filtros' : 'Filtrar';
const iconeBotao = filtrosAplicados ? <Spinner /> : null;
const handleClick = filtrosAplicados ? onLimpar : onFiltrar;
const disabled = !filtrosAplicados && !botaoHabilitado;
```

#### TransactionForm/ (EXISTENTE — MODIFICAR)

**O arquivo `TransactionForm.jsx` existe mas está vazio.**

Props:
```typescript
{
  modo: 'criar' | 'editar',
  transacao: Transaction | null, // se modo 'editar'
  onClose: () => void,
  onSubmit: (dados) => void
}
```

**Estado local:**
```javascript
const [tipo, setTipo] = useState('RECEITA');
const [valor, setValor] = useState('');
const [data, setData] = useState(new Date());
const [categoriaId, setCategoriaId] = useState('');
const [descricao, setDescricao] = useState('');
const [recurso, setRecurso] = useState('');
const [tags, setTags] = useState([]);
const [recorrente, setRecorrente] = useState(false);
const [frequencia, setFrequencia] = useState('MENSAL');
const [ateQuando, setAteQuando] = useState('SEM_FIM');
const [dataFim, setDataFim] = useState(null);
const [erros, setErros] = useState({});
```

**Componentes internos:**
- Toggle Receita/Despesa
- Input de valor com máscara de moeda (usar react-number-format ou similar)
- DatePicker para data
- Select de categoria (filtrado por tipo)
- Input de descrição
- Select de recurso
- Multi-select de tags com criação dinâmica (usar Autocomplete do MUI com freeSolo)
- Checkbox "Repetir automaticamente" que expande campos de frequência
- Botão "Cancelar" e "Salvar"
- Se modo 'editar': Botão "Excluir" em vermelho

**Validações:**
- Valor > 0 (obrigatório)
- Data obrigatória
- Categoria obrigatória
- Recurso obrigatório
- Validação cruzada recurso x categoria (local + backend):
  - Se VT + Alimentação: erro imediato "VT não pode ser usado para alimentação"
  - Se VA + não (Alimentação ou Compras): erro
  - Se VR + não Alimentação: erro
  - Se VT + não Transporte: erro

**Lógica de submit:**
```javascript
const handleSubmit = async () => {
  // Validações locais
  if (!validarCampos()) return;
  
  // Monta payload
  const payload = {
    tipo,
    categoriaId,
    recurso,
    valor: parseFloat(valor),
    descricao,
    data: data.toISOString(),
    tags: tags.map(t => t.id),
    recorrente,
    regraRecorrencia: recorrente ? montarRRule() : null
  };
  
  // Chama mutation (criar ou atualizar)
  if (modo === 'criar') {
    await criarMutation.mutateAsync(payload);
  } else {
    await atualizarMutation.mutateAsync({ id: transacao.id, dados: payload });
  }
  
  onClose();
};
```

#### TransactionList/ (EXISTENTE — MODIFICAR)

**O arquivo `TransactionList.jsx` existe mas está vazio.**

Props:
```typescript
{
  transacoes: Transaction[],
  isLoading: boolean,
  onEdit: (transacao) => void,
  onDelete: (transacao) => void
}
```

**Estrutura:**
- Se isLoading: exibir skeletons
- Se transacoes vazio: exibir EmptyState com ilustração
- Se transacoes com dados:
  - Agrupar por data (usando groupBy ou reduce)
  - Para cada grupo:
    - Header da data: "23 de Maio de 2025"
    - Lista de TransactionItem

#### TransactionItem/ (EXISTENTE — MODIFICAR)

**Verificar se já existe. Se vazio, criar:**

Props:
```typescript
{
  transacao: Transaction,
  onEdit: () => void,
  onDelete: () => void
}
```

**Estrutura:**
```jsx
<TransactionItemContainer>
  <CategoryIcon icon={transacao.categoria.icone} color={transacao.categoria.cor} />
  <TransactionContent>
    <Description>{transacao.descricao || transacao.categoria.nome}</Description>
    <Tags>
      {transacao.tags.map(tag => <PulsoBadge key={tag.id} {...tag} />)}
    </Tags>
  </TransactionContent>
  <ResourceBadge type={transacao.recurso} />
  <Value tipo={transacao.tipo}>
    {transacao.tipo === 'RECEITA' ? '+' : '-'} R$ {formatarValor(transacao.valor)}
  </Value>
  <Actions>
    <IconButton onClick={onEdit}><Edit /></IconButton>
    <IconButton onClick={onDelete}><Delete /></IconButton>
  </Actions>
</TransactionItemContainer>
```

#### RecurringBadge/ (EXISTENTE — VERIFICAR)

**Este componente existe mas não será usado (ícone de refresh foi bug do protótipo). Pode ignorar ou remover.**

### Endpoints consumidos

* GET /api/transacoes → Lista transações com filtros
* GET /api/transacoes/resumo → Calcula resumo (receitas, despesas, saldo)
* POST /api/transacoes → Cria nova transação
* PATCH /api/transacoes/:id → Atualiza transação
* DELETE /api/transacoes/:id → Exclui transação

---

## 🚫 Regras de Negócio

* **RN-032:** VA só pode ser gasto em despesas da categoria "Alimentação" ou "Compras"
* **RN-035:** VR só pode ser gasto em despesas da categoria "Alimentação"
* **RN-038:** VT só pode ser gasto em despesas da categoria "Transporte"
* **RN-039:** Despesas de alimentação NUNCA podem usar recurso VT
* **RN-046 a RN-054:** Regras de transações aplicadas no backend e validadas no frontend
* **RN-165:** Categorias padrão já existem no sistema (não precisa criar no frontend)

---

## 🛠️ Refinamento

* **Estado Global:** TanStack Query para cache de transações, categorias e tags
* **Estado Local:** useState para filtros, modais, paginação dentro do componente Transactions
* **Validação:** Zod no backend + validação local no frontend para feedback imediato
* **Máscaras:** react-number-format para campo de valor (R$ 0,00)
* **DatePicker:** Material-UI DatePicker ou react-datepicker
* **Multi-select de Tags:** Material-UI Autocomplete com `freeSolo` para criação dinâmica
* **Tratamento de Erros:** Exibir mensagens de erro do backend em toast + inline no formulário
* **Loading States:** Skeletons nos cards de resumo e lista, spinners nos botões de ação
* **Empty States:** Ilustração + texto quando não há transações
* **Responsividade:** Mobile-first, filtros empilhados em mobile, lista em coluna única
* **Acessibilidade:** Labels nos inputs, aria-labels nos botões de ação, navegação por teclado nos modals

---
