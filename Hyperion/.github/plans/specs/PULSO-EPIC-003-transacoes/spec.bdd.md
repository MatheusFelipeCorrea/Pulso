# Spec BDD — Gerenciamento de Transações

## Feature: transações na API Pulso

Contrato: `Codigo/Pulso/api/src/routes/transactionRoutes.js` (prefixo `/api/transacoes`).
Categorias/tags: `categoryRoutes.js`, `tagRoutes.js`.
Regras VA/VR: `utils/recursoCategoriaRules.js`. Recorrência: `jobs/recurringTransactions.js`.
Todas as rotas de transação exigem `authMiddleware`.

### Scenario 1: Criar receita
Given sessão autenticada e uma categoria de tipo `RECEITA`
When `POST /api/transacoes` com `{ tipo: RECEITA, categoriaId, recurso: DINHEIRO, valor > 0, data }`
Then retorna `201` e a transação persistida do usuário
And o resumo do período incrementa receitas (não despesas)

### Scenario 2: Criar despesa compatível com VA
Given categoria com `grupoBeneficio` Alimentação ou Compras
When `POST /api/transacoes` com `tipo: DESPESA` e `recurso: VA`
Then a transação é criada
And despesa em `VR` só passa se o grupo for Alimentação

### Scenario 3: VT rejeitado
Given qualquer payload com `recurso: VT`
When cria ou edita
Then a API retorna `400` "VT não está disponível"

### Scenario 4: Despesa incompatível com benefício
Given categoria sem grupo VA/VR compatível
When `POST /api/transacoes` despesa em `VA` ou `VR`
Then retorna `400` com mensagem de incompatibilidade

### Scenario 5: Transferência
Given `tipo: TRANSFERENCIA`, `recurso` ≠ `recursoDestino`
When cria sem `categoriaId`
Then persiste a transferência
And `GET /api/transacoes/resumo` não soma o valor em receita nem despesa

### Scenario 6: Transferência inválida
Given origem igual ao destino ou destino ausente
When `POST /api/transacoes`
Then validação Zod/service recusa (`400`)

### Scenario 7: Listar e filtrar
Given transações no mês
When `GET /api/transacoes?periodo=YYYY-MM&tipo=&recurso=&categoria=&busca=&pagina=&limite=`
Then retorna página do usuário autenticado
And `GET /api/transacoes/resumo` usa os mesmos filtros
And `GET /api/transacoes/filtros` devolve opções de categoria, tag e recurso

### Scenario 8: Editar
Given transação do próprio usuário
When `PATCH /api/transacoes/:id` com ao menos um campo
Then atualiza só o que veio no body
And transação de outro usuário não é visível (`404`/`403`)

### Scenario 9: Excluir simples
Given transação não recorrente (ou “só esta”)
When `DELETE /api/transacoes/:id`
Then o registro some da listagem
And o histórico de outras ocorrências permanece

### Scenario 10: Excluir esta e futuras
Given série recorrente
When `DELETE /api/transacoes/:id?excluirFuturas=true&dataCorte=`
Then ocorrências a partir do corte são removidas
And ocorrências anteriores permanecem

### Scenario 11: Recorrência automática
Given transação com `recorrente=true` e `regraRecorrencia` (FREQ semanal/quinzenal/mensal/anual)
When o job `runRecurringTransactions` roda no dia da ocorrência
Then cria a ocorrência do dia sem duplicar
And o scheduler local dispara às 00:05 (fora da Vercel)

### Scenario 12: Sugestão de categoria
Given histórico do usuário
When `GET /api/transacoes/sugestao-categoria?tipo=DESPESA&descricao=`
Then devolve categoria sugerida ou vazio
And a Web marca `categoriaAutoSugerida` no formulário

### Scenario 13: Sem sessão
Given request sem cookie e sem Bearer
When qualquer rota de `/api/transacoes`
Then `401`

## Feature: página Web `/transactions`

Layout: `MainLayout` + `TransactionsPage` (rotas em `web/src/App.jsx`).
Componentes em `web/src/components/{transactions,categories,tags}/`.

### Scenario 14: Entrar autenticado
Given login válido
When navega para `/transactions`
Then vê cards de resumo, filtros e lista agrupada por data
And dashboard stub aponta para essa rota

### Scenario 15: CRUD na UI
Given `/transactions`
When abre o modal, preenche e salva
Then chama `POST/PATCH /api/transacoes` e a lista atualiza
And exclusão usa `DeleteTransactionModal` (simples ou futuras)

### Scenario 16: Gestão de categorias e tags
Given os modais de categoria/tag
When cria/edita/exclui
Then usa `/api/categorias` e `/api/tags`
And tags podem ser criadas inline no formulário da transação

## Feature: mobile e protótipos (FEAT-108 — pendente)

### Scenario 17: Lista Flutter
Given sessão Bearer (`X-Pulso-Client: mobile`)
When abre Transações no app
Then `GET /api/transacoes` e `/resumo` alimentam lista e cards
And não existe segundo backend

### Scenario 18: Protótipos na apostila
Given frames de `PULSO-FEAT-089`
When a documentação é publicada
Then `docs/5.wireframe.md` inclui lista, modal, exclusão e temas
