# [EPIC] Gestão de Vale Transporte

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Vale Transporte, Frontend, Backend
Relator:     (preencher)
Pai:         —
Data Limite: (preencher)

## Descrição

Esta epic implementa o **módulo completo de gerenciamento de Vale Transporte** do Pulso, permitindo que usuários (especialmente Estagiários e CLT) acompanhem o saldo, registrem usos, vendam VT excedente e visualizem todo o histórico de movimentações.

### Funcionalidades Principais

#### 📊 Tela de Vale Transporte

A tela principal é organizada em três seções:

**1. Cards de Resumo (Header)**
- **Saldo do mês** - Card principal com 4 métricas:
  - **Recebido** - Valor de VT recebido no mês (R$ 220,00) com ícone de seta para baixo
  - **Usado** - Valor gasto em passagens (R$ 48,00) com subtexto "10 passagens"
  - **Vendido (nominal)** - Valor nominal total vendido (R$ 120,00) com subtexto "Valor nominal total"
  - **Saldo restante** - Saldo disponível para uso (R$ 52,00) com subtexto "Disponível para uso"

**2. Botões de Ação**
- **+ Registrar Uso** - Botão outline (borda roxa, fundo transparente)
- **+ Registrar Venda** - Botão preenchido (fundo roxo)
- Ambos posicionados lado a lado abaixo dos cards de resumo

**3. Histórico com Tabs**

Navegação por abas:
- **Histórico de vendas** (aba padrão)
- **Histórico de usos**

**Aba "Histórico de vendas":**
- Filtro de período (mês/ano) no canto superior direito
- Tabela com colunas:
  - **Data** - Formato DD/MM/YYYY
  - **Comprador** - Nome da pessoa que comprou
  - **Nominal** - Valor nominal vendido (R$ 22,00)
  - **Recebido** - Valor efetivamente recebido (R$ 20,00, R$ 22,00, R$ 23,00)
  - **Diferença** - Perda/ganho na venda:
    - Vermelho com "-" se perda (- R$ 2,00)
    - Verde com "+" se ganho (+ R$ 1,00)
    - Cinza "R$ 0,00" se igual
- Linha de TOTAL na parte inferior:
  - Total Nominal: R$ 176,00
  - Total Recebido: R$ 168,00
  - Perda total: - R$ 8,00 (em vermelho com subtexto "Perda total")
- **Paginação** na parte inferior

**Aba "Histórico de usos":**
- Filtro de período (mês/ano)
- Tabela com colunas:
  - **Data** - Formato DD/MM/YYYY
  - **Quantidade** - Número de passagens usadas
  - **Valor por passagem** - Valor unitário (R$ 4,80)
  - **Total** - Quantidade × Valor (- R$ 9,60)
- Linha de TOTAL na parte inferior
- **Paginação**

#### ➕ Modal "Registrar Venda de VT"

Modal centralizado com:

**Header informativo (card azul):**
- Ícone de ônibus
- "Saldo VT disponível para venda: R$ 172,00"

**Campos:**
- **Comprador** - Input de texto (Nome ou apelido do comprador)
- **Data da venda** - DatePicker (padrão: data atual)
- **Valor nominal vendido** - Input numérico com máscara R$ (valor de face do VT que está vendendo)
  - Texto auxiliar: "Valor de face do VT que está vendendo"
  - Ícone de info ao lado
- **Valor recebido** - Input numérico com máscara R$ (quanto o comprador pagou)
  - Texto auxiliar: "Quanto o comprador te pagou"
  - Ícone de info ao lado

**Resumo da transação (card cinza):**
- Valor nominal: R$ 60,00
- Valor recebido: R$ 50,00
- Diferença: **-R$ 10,00 (perda)** (em vermelho)
- Novo saldo VT após venda: **R$ 112,00** (em azul)
- Próxima venda disponível em: **04/05/2026 (30 dias)** (em azul, com ícone de calendário)

- **Cancelar** (outline)
- **Registrar Venda** (preenchido roxo)

**Estados especiais:**
- **Se intervalo não passou:** Modal abre mas campos desabilitados, status "🔒 Próxima venda disponível em X dias" em amarelo
- **Se saldo insuficiente:** Ao tentar vender mais do que tem, exibir erro vermelho: "Saldo insuficiente. Você tem apenas R$ X,XX disponível."

#### ➕ Modal "Registrar Uso de VT"

Modal centralizado com:
saldo insuficiente:** Ao tentar vender mais do que tem, exibir erro vermelho: "Saldo insuficiente. Você tem apenas R$ X,XX disponível."
- **Múltiplas vendas permitidas:** Usuário pode vender "picado" para várias pessoas no mesmo mês
- Ícone de ônibus
- "Saldo VT atual: R$ 172,00"
- "Passagens usadas este mês: 10"

**Campos:**
- **Quantidade de passagens** - Stepper (+ e -) com valor numérico no centro (padrão: 2)
  - Texto auxiliar: "Informe quantas passagens você utilizou"
  - Mínimo: 1
  
- **Valor por passagem** - Input numérico com máscara R$ (padrão: R$ 4,80)
  - Texto auxiliar: "Valor padrão da sua região"
  - Ícone de info ao lado
  
- **Data** - DatePicker (padrão: data atual)
  - Texto auxiliar: "Data em que você utilizou o VT"

**Resumo do uso (card azul claro):**
- Ícone de calculadora
- Total do uso: **R$ 4,80 × 2 = R$ 9,60** (fórmula visível)
- Novo saldo VT: **R$ 162,40** (em azul)

**Toggle (switch):**
- ☑️ "Salvar valor da passagem como padrão"
- Texto auxiliar: "Usar este valor como padrão nas próximas vezes"
- Estado: ligado por padrão

**Botões:**
- **Cancelar** (outline)
- **Registrar Uso** (preenchido roxo)

---

### Regras de Negócio Aplicadas

- **RN-003:** Estagiário recebe VA, VR e VT como benefícios (VT pode ser vendido)
- **RN-038:** VT só pode ser gasto em despesas da categoria "Transporte"
- **RN-039:** Despesas de alimentação NUNCA podem usar recurso VT
- **RN-040:** VT pode ser vendido (somente para modo Estagiário - múltiplas vendas permitidas)
- **RN-041:** Ao vender VT, o valor recebido entra como receita do tipo "Dinheiro"
- **RN-044:** Saldo VT = Recebido no mês - Usado - Vendido (nominal)
- **RN-045:** CLT não pode vender VT (desconto de 6% em folha, uso obrigatório)
- **RN-018:** PJ não recebe VA, VR nem VT (funcionalidades ocultas - mas pode ter exceções)
- **RN-023:** Pessoa Física: não exibe funcionalidades de benefícios corporativos (mas pode ter exceções)

---

### Comportamento por Modo de Uso

| Modo | Acesso à Tela | Registrar Uso | Registrar Venda |
|------|--------------|---------------|----------------|
| **Estagiário** | ✅ Completo | ✅ Sim | ✅ Sim (sem restrições) |
| **CLT** | ✅ Completo | ✅ Sim | ⚠️ Sim, mas com aviso: "CLT: VT é descontado em folha (6%). Venda pode gerar irregularidades." |
| **PJ** | ⚠️ Acesso com aviso | ❌ Desabilitado | ❌ Desabilitado |
| **Pessoa Física** | ⚠️ Acesso com aviso | ❌ Desabilitado | ❌ Desabilitado |

**Aviso para PJ e Pessoa Física:**
"Esta funcionalidade está disponível apenas para Estagiários e CLT. Caso você tenha acordo com sua empresa que inclui Vale Transporte, entre em contato com o suporte para habilitar."

---

### Cálculos e Fórmulas

**Saldo VT (RN-044):**
```
Saldo = Recebido - Usado - Vendido (nominal)

Exemplo:
Recebido: R$ 220,00
Usado: R$ 48,00 (10 passagens × R$ 4,80)
Vendido: R$ 120,00 (nominal total de vendas)
Saldo = 220 - 48 - 120 = R$ 52,00
```

**Diferença na venda:**
```
Diferença = Valor recebido - Valor nominal

Exemplo 1 (Perda):
Nominal: R$ 60,00
Recebido: R$ 50,00
Diferença: 50 - 60 = -R$ 10,00 (perda)

Exemplo 2 (Ganho):
Nominal: R$ 22,00
Recebido: R$ 23,00
Diferença: 23 - 22 = +R$ 1,00 (ganho)
```

**Total do uso:**
```
Total = Quantidade de passagens × Valor por passagem

Exemplo:
Quantidade: 2 passagens
Valor: R$ 4,80
Total = 2 × 4,80 = R$ 9,60
```

**Valor "Recebido" no card:**
```
Recebido = Soma de todas as transações do tipo RECEITA com recurso VT no mês atual
```

---

### Protótipos Visuais

Ver imagens anexadas:
- [Imagem 1 e 4] Tela principal - modo claro e escuro
- [Imagem 2 e 5] Modal "Registrar Venda de VT" - modo claro e escuro
- [Imagem 3 e 6] Modal "Registrar Uso de VT" - modo claro e escuro

---

# [STORY BACKEND] Gestão de Vale Transporte — Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Gestão de Vale Transporte
Data Limite: (preencher)

## 📝 Descrição

Como sistema, eu quero implementar todos os endpoints necessários para gerenciar o Vale Transporte (calcular saldo, registrar usos, registrar vendas, obter históricos), para que o frontend possa oferecer uma experiência completa de gestão de VT.

---

## ✅ Critérios de Aceite

### Cenário 1 — Obter saldo e resumo do VT no mês
**Dado** que o usuário autenticado está no modo Estagiário ou CLT,  
**Quando** GET /api/transporte/saldo é chamado com query param `?periodo=2026-05`,  
**Então** retorna 200 com:
```json
{
  "recebido": "220.00",
  "usado": "48.00",
  "passagensUsadas": 10,
  "vendidoNominal": "120.00",
  "saldoRestante": "52.00"
}
```
* **E** "recebido" é calculado somando transações RECEITA com recurso VT no período
* **E** "usado" é calculado somando todos os UsoVt no período
* **E** "vendidoNominal" é calculado somando valorNominal de todas as VendaVt no período
* **E** "saldoRestante" = recebido - usado - vendidoNominal (RN-044)
* **Se** usuário é PJ ou Pessoa Física: retorna 403 "Funcionalidade disponível apenas para Estagiários e CLT"

### Cenário 2 — Registrar venda de VT (sucesso)
**Dado** que o usuário é Estagiário e tem saldo VT de R$ 172,00,  
**Quando** POST /api/transporte/vendas é chamado com payload:
```json
{
  "nomeComprador": "Lucas Martins",
  "dataVenda": "2026-04-23T00:00:00.000Z",
  "valorNominal": 60.00,
  "valorRecebido": 50.00
}
```
**Então** retorna 201 com a venda criada:
```json
{
  "id": "cuid_venda",
  "nomeComprador": "Lucas Martins",
  "dataVenda": "2026-04-23T00:00:00.000Z",
  "valorNominal": "60.00",
  "valorRecebido": "50.00",
  "diferenca": "-10.00",
  "novoSaldoVt": "112.00"
}
```
* **E** cria registro em VendaVt
* **E** cria transação do tipo RECEITA, recurso DINHEIRO, valor = valorRecebido, categoria = "Outros", descrição = "Venda de VT para {nomeComprador}" (RN-041)
* **E** retorna diferenca = valorRecebido - valorNominal
* **E** retorna novoSaldoVt = saldoAtual - valorNominal
* **E** múltiplas vendas no mesmo mês são permitidas (pode vender "picado" para várias pessoas)

### Cenário 3 — Registrar venda de VT (CLT com aviso)
**Dado** que o usuário é CLT,  
**Quando** POST /api/transporte/vendas é chamado,  
**Então** retorna 200 com warning no campo adicional:
```json
{
  "id": "cuid_venda",
  ...,
  "warning": "CLT: VT é descontado em folha (6%). Venda pode gerar irregularidades."
}
```
* **E** a venda é registrada normalmente

### Cenário 4 — Bloquear venda com saldo insuficiente
**Dado** que o saldo VT é R$ 52,00,  
**Quando** POST /api/transporte/vendas é chamado com valorNominal = 60.00,  
**Então** retorna 400 com mensagem:
```json
{
  "error": "Saldo insuficiente. Você tem apenas R$ 52,00 disponível."
}
```

### Cenário 5 — Bloquear venda para PJ/Pessoa Física
**Dado** que o usuário é PJ ou Pessoa Física,  
**Quando** POST /api/transporte/vendas é chamado,  
**Então** retorna 403 com mensagem:
```json
{
  "error": "Funcionalidade disponível apenas para Estagiários e CLT. Entre em contato com o suporte se você tem acordo que inclui VT."
}
```

### Cenário 6 — Registrar uso de VT (sucesso)
**Dado** que o usuário autenticado tem saldo VT disponível,  
**Quando** POST /api/transporte/usos é chamado com payload:
```json
{
  "quantidade": 2,
  "valorPorPassagem": 4.80,
  "data": "2026-05-15T00:00:00.000Z",
  "salvarValorPadrao": true
}
```
**Então** retorna 201 com o uso criado:
```json
{
  "id": "cuid_uso",
  "quantidade": 2,
  "valorPorPassagem": "4.80",
  "data": "2026-05-15T00:00:00.000Z",
  "totalUsado": "9.60",
  "novoSaldoVt": "162.40"
}
```
* **E** cria registro em UsoVt
* **E** se salvarValorPadrao = true: atualiza ConfiguracaoUsuario.valorPadraoPassagem com o valor informado
* **E** retorna totalUsado = quantidade × valorPorPassagem
* **E** retorna novoSaldoVt = saldoAtual - totalUsado

### Cenário 7 — Validar quantidade mínima de passagens
**Dado** que o usuário tenta registrar uso,  
**Quando** POST /api/transporte/usos é chamado com quantidade = 0,  
**Então** retorna 400 "Quantidade de passagens deve ser pelo menos 1"

### Cenário 8 — Validar valor negativo ou zero na venda
**Dado** que o usuário tenta registrar venda,  
**Quando** POST /api/transporte/vendas é chamado com valorNominal = 0 ou valorRecebido = 0,  
**Então** retorna 400 "Valor nominal e valor recebido devem ser maiores que zero"

### Cenário 9 — Listar histórico de vendas com filtro e paginação
**Dado** que o usuário possui vendas registradas,  
**Quando** GET /api/transporte/vendas é chamado com query params `?periodo=2026-04&pagina=1&limite=10`,  
**Então** retorna 200 com:
```json
{
  "vendas": [
    {
      "id": "cuid",
      "dataVenda": "2026-04-23T00:00:00.000Z",
      "nomeComprador": "Lucas Martins",
      "valorNominal": "22.00",
      "valorRecebido": "20.00",
      "diferenca": "-2.00"
    },
    ...
  ],
  "totais": {
    "totalNominal": "176.00",
    "totalRecebido": "168.00",
    "perdaTotal": "-8.00"
  },
  "paginacao": {
    "total": 25,
    "paginas": 3,
    "paginaAtual": 1
  }
}
```
* **E** vendas são ordenadas por dataVenda DESC
* **E** filtro de período é aplicado (formato YYYY-MM)
* **E** diferenca = valorRecebido - valorNominal
* **E** totais são calculados apenas para as vendas do período filtrado

### Cenário 10 — Listar histórico de usos com filtro e paginação
**Dado** que o usuário possui usos registrados,  
**Quando** GET /api/transporte/usos é chamado com query params `?periodo=2026-05&pagina=1&limite=10`,  
**Então** retorna 200 com:
```json
{
  "usos": [
    {
      "id": "cuid",
      "data": "2026-05-14T00:00:00.000Z",
      "quantidade": 2,
      "valorPorPassagem": "4.80",
      "total": "9.60"
    },
    ...
  ],
  "totais": {
    "totalPassagens": 10,
    "totalGasto": "48.00"
  },
  "paginacao": {
    "total": 8,
    "paginas": 1,
    "paginaAtual": 1
  }
}
```
* **E** usos são ordenados por data DESC
* **E** total = quantidade × valorPorPassagem

---

## 🛠️ Implementação

### transportController.js (EXISTENTE — MODIFICAR)

**O arquivo já existe. Verificar métodos existentes e adicionar os novos:**

Métodos NOVOS a adicionar:
* `obterSaldoVt()` → GET /api/transporte/saldo
* `registrarVendaVt()` → POST /api/transporte/vendas
* `listarVendas()` → GET /api/transporte/vendas
* `registrarUsoVt()` → POST /api/transporte/usos
* `listarUsos()` → GET /api/transporte/usos

**Responsabilidades:**
- Validar schemas com Zod (transportSchemas.js)
- Extrair userId do req.user
- Validar modo de uso do usuário (Estagiário/CLT/PJ/Pessoa Física)
- Chamar métodos do service
- Retornar respostas HTTP com warnings quando aplicável

### transportService.js (EXISTENTE — MODIFICAR)

**O arquivo já existe. Verificar lógica existente e adicionar:**

Lógica NOVA a adicionar:

**`obterSaldoVt(usuarioId, periodo)`**
→ Calcula "recebido" somando transações RECEITA com recurso VT no período  
→ Calcula "usado" somando UsoVt.quantidade × valorPorPassagem no período  
→ Calcula "vendidoNominal" somando VendaVt.valorNominal no período  
→ Calcula "saldoRestante" = recebido - usado - vendidoNominal (RN-044)  
→ Retorna objeto completo

**`registrarVendaVt(usuarioId, dados)`**
→ Busca modo de uso do usuário  
→ Se PJ ou Pessoa Física: lança AppError(403, "Funcionalidade disponível apenas para Estagiários e CLT...")  
→ Calcula saldo atual usando obterSaldoVt()  
→ Valida saldo suficiente (RN-043)  
→ Busca última venda e valida intervalo (RN-042, RN-043)  
→ Busca diasIntervaloVendaVt da ConfiguracaoUsuario  
→ Calcula proximaDataVenda = dataVenda + intervalo  
→ Cria VendaVt via repository  
→ Cria transação RECEITA tipo DINHEIRO com valor = valorRecebido (RN-041)  
→ Se usuário é CLT: adicio 
→ Cria VendaVt via repository  
→ Cria transação RECEITA tipo DINHEIRO com valor = valorRecebido (RN-041)  
→ Se usuário é CLT: adiciona warning na resposta  
→ Calcula diferenca e novoSaldoVt  
→ Retorna venda criada  
→ **Múltiplas vendas no mesmo período são permitidas** (não há intervalo mínimo)ais + paginação

**`registrarUsoVt(usuarioId, dados)`**
→ Valida quantidade >= 1  
→ Cria UsoVt via repository  
→ Se salvarValorPadrao = true: atualiza ConfiguracaoUsuario.valorPadraoPassagem  
→ Calcula totalUsado = quantidade × valorPorPassagem  
→ Calcula novoSaldoVt  
→ Retorna uso criado

**`listarUsos(usuarioId, periodo, pagina, limite)`**
→ Busca usos do usuário no período via repository  
→ Calcula total para cada uso  
→ Calcula totais (totalPassagens, totalGasto)  
→ Retorna usos + totais + paginação

### transportRepository.js (EXISTENTE — MODIFICAR)

**O arquivo já existe. Verificar métodos existentes e adicionar:**

Métodos NOVOS a adicionar:

**`calcularRecebidoVt(usuarioId, periodoInicio, periodoFim)`**
→ Query Prisma:
```javascript
prisma.transacao.aggregate({
  where: {
    usuarioId,
    tipo: 'RECEITA',
    recurso: 'VT',
    data: { gte: periodoInicio, lte: periodoFim }
  },
  _sum: { valor: true }
})
```
→ Retorna total ou 0

**`calcularUsadoVt(usuarioId, periodoInicio, periodoFim)`**
→ Query Prisma:
```javascript
prisma.usoVt.findMany({
  where: {
    usuarioId,
    data: { gte: periodoInicio, lte: periodoFim }
  },
  select: { quantidade: true, valorPorPassagem: true }
})
```
→ Soma quantidade × valorPorPassagem de cada registro  
→ Retorna total

**`calcularVendidoNominalVt(usuarioId, periodoInicio, periodoFim)`**
→ Query Prisma:
```javascript
prisma.vendaVt.aggregate({
  where: {
    usuarioId,
    dataVenda: { gte: periodoInicio, lte: periodoFim }
  },
  _sum: { valorNominal: true }
})
```
→ Retorna total ou 0

**`buscarUltimaVenda(usuarioId)`**
→ Query Prisma:
```etorna venda criada

**`listarVendas(usuarioId, periodoInicio, periodoFim, skip, take)`**
→ Query Prisma com where, orderBy dataVenda desc, skip, take  
→ Retorna vendas + count total

**`criarUsoVt(dados)`**
→ Cria UsoVt com prisma.usoVt.create  
→ Retorna uso criado

**`listarUsos(usuarioId, periodoInicio, periodoFim, skip, take)`**
→ Query Prisma com where, orderBy data desc, skip, take  
→ Retorna usos + count total

### userRepository.js (EXISTENTE — MODIFICAR)

**Verificar se já existe método para buscar configuração do usuário. Se não:**

Métodos possivelmente NOVOS a adicionar:

**`buscarConfiguracaoUsuario(usuarioId)`**
→ Busca ConfiguracaoUsuario incluindo modoUso, diasIntervaloVendaVt, valorPadraoPassagem  
→ Retorna configuração

**`atualizarValorPadraoPassagem(usuarioId, valor)`**
→ Atualiza ConfiguracaoUsuario.valorPadraoPassagem  
→ Retorna void

### transactionService.js (EXISTENTE — VERIFICAR)

**Verificar se já existe método para criar transação. Se sim, apenas usar. Se não:**

Métodos possivelmente NOVOS a adicionar:

**`criarTransacaoInterna(usuarioId, dados)`**
→ Cria transação sem validações complexas (usada por outros serviços)  
→ Retorna transação criada

---

## 📐 Schemas (Zod)

### transportSchemas.js (EXISTENTE — MODIFICAR)

**O arquivo já existe. Verificar schemas existentes e adicionar:**

Schemas NOVOS a adicionar:

**`obterSaldoQuerySchema`:**
```javascript
{
  periodo: z.string().regex(/^\d{4}-\d{2}$/).optional() // YYYY-MM
}
```

**`registrarVendaSchema`:**
```javascript
{
  nomeComprador: z.string().min(1).max(120),
  dataVenda: z.string().datetime().or(z.date()),
  valorNominal: z.number().positive('Valor nominal deve ser maior que zero'),
  valorRecebido: z.number().positive('Valor recebido deve ser maior que zero')
}
```

**`listarVendasQuerySchema`:**
```javascript
{
  periodo: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  pagina: z.coerce.number().int().positive().default(1),
  limite: z.coerce.number().int().positive().max(100).default(10)
}
```

**`registrarUsoSchema`:**
```javascript
{
  quantidade: z.number().int().min(1, 'Quantidade de passagens deve ser pelo menos 1'),
  valorPorPassagem: z.number().positive('Valor por passagem deve ser maior que zero'),
  data: z.string().datetime().or(z.date()),
  salvarValorPadrao: z.boolean().default(false)
}
```

**`listarUsosQuerySchema`:**
```javascript
{
  periodo: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  pagina: z.coerce.number().int().positive().default(1),
  limite: z.coerce.number().int().positive().max(100).default(10)
}
```

---

## 🛣️ Rotas

### transportRoutes.js (EXISTENTE — MODIFICAR)

**O arquivo já existe. Verificar rotas existentes e adicionar:**

Rotas NOVAS a adicionar:
* GET /api/transporte/saldo → transportController.obterSaldoVt  
  Middlewares: authMiddleware, validateQuery(obterSaldoQuerySchema)

* POST /api/transporte/vendas → transportController.registrarVendaVt  
  Middlewares: authMiddleware, validateBody(registrarVendaSchema), rateLimitMiddleware

* GET /api/transporte/vendas → transportController.listarVendas  
  Middlewares: authMiddleware, validateQuery(listarVendasQuerySchema)

* POST /api/transporte/usos → transportController.registrarUsoVt  
  Middlewares: authMiddleware, validateBody(registrarUsoSchema), rateLimitMiddleware

* GET /api/transporte/usos → transportController.listarUsos  
  Middlewares: authMiddleware, validateQuery(listarUsosQuerySchema)

**Observação:** As rotas devem estar registradas em src/routes/index.js como:
```javascript
app.use('/api/transporte', transportRoutes);
```

---

## 🚫 Regras de Negócio

* **RN-003:** Estagiário recebe VT como benefício e pode vendê-lo
* **RN-038:** VT só pode ser gasto em despesas da categoria "Transporte"
* **RN-039:** Despesas de alimentação NUNCA podem usar recurso VT
* **RN-040:** VT pode ser vendido (somente para modo Estagiário - CLT com aviso)
* **RN-041:** Ao vender VT, o valor recebido entra como receita do tipo "Dinheiro"
* **RN-042:** O intervalo entre vendas de VT é configurável (padrão: 30 dias) - vem de diasIntervaloVendaVt
* **RN-043:** O sistema deve bloquear nova venda antes do intervalo configurado
* **RN-044:** Saldo VT = Recebido no mês - Usado - Vendido (nominal)
* **RN-045:** CLT não pode vender VT sem aviso (desconto de 6% em folha)
* **RN-018:** PJ não recebe VT (funcionalidade bloqueada - mas pode ter exceções)
* **RN-023:** Pessoa Física não tem benefícios corporativos (func (múltiplas vendas permitidas)
* **RN-038:** VT só pode ser gasto em despesas da categoria "Transporte"
* **RN-039:** Despesas de alimentação NUNCA podem usar recurso VT
* **RN-040:** VT pode ser vendido (somente para modo Estagiário - CLT com aviso) - **múltiplas vendas no mês permitidas**
* **RN-041:** Ao vender VT, o valor recebido entra como receita do tipo "Dinheiro"

**Adicionar novo campo:**

```prisma
model ConfiguracaoUsuario {
  // ... campos existentes
  
  valorPadraoPassagem Decimal? @db.Decimal(10, 2) @map("valor_padrao_passagem")
  
  // ... resto do modelo
}
```

**Após adicionar o campo, executar:**
```bash
npx prisma migrate dev --name add_valor_padrao_passagem
```

**OU se usar migrate reset:**
```bash
npx prisma db push
```

---

# [STORY FRONTEND] Gestão de Vale Transporte — Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Gestão de Vale Transporte
Data Limite: (preencher)

## 📝 Descrição

Como usuário, eu quero visualizar meu saldo de Vale Transporte, registrar usos e vendas, e acompanhar todo o histórico de movimentações, para que eu possa gerenciar meu VT de forma eficiente.

---

## ✅ Critérios de Aceite

### Cenário 1 — Carregar página de Vale Transporte (Estagiário/CLT)
**Dado** que o usuário está autenticado e é Estagiário ou CLT,  
**Quando** acessa a página /vale-transporte,  
**Então** a página carrega exibindo:
* Card "Saldo do mês" com 4 métricas: Recebido, Usado (com passagens), Vendido (nominal), Saldo restante
* Card "Próxima venda" com progresso, dias restantes e data estimada
* Botões "+ Registrar Uso" e "+ Registrar Venda"
* Aba "Histórico de vendas" selecionada por padrão
* Tabela de vendas com dados do mês atual
* **E** enquanto carrega: exibir skeletons nos cards e tabela
* **E** se não há vendas: exibir empty state na tabela "Nenhuma venda registrada ainda"

### Cenário 2 — Carregar página de Vale Transporte (PJ/Pessoa Física)
**Dado** que o usuário é PJ ou Pessoa Física,  
**Quando** acessa a página /vale-transporte,  
**Então** exibe tela bloqueada com:
* Ícone de cadeado ou aviso
* Título: "Funcionalidade indisponível"
* Mensagem: "Esta funcionalidade está disponível apenas para Estagiários e CLT. Caso você tenha acordo com sua empresa que inclui Vale Transporte, entre em contato com o suporte para habilitar."
* Botão "Falar com suporte" (abre chat ou email)
* **E** não carrega dados nem exibe os botões de ação

### Cenário 3 — Abrir modal "Registrar Venda" (disponível para vender)
**Dado** que o usuário é Estagiário e passou 
**Dado** que o usuário é Estagiário,  
**Quando** clica em "+ Registrar Venda",  
**Então** abre o modal com:
* Header azul mostrando saldo disponível
* Campos habilitados: Comprador, Data da venda, Valor nominal vendido, Valor recebido
* Resumo da transação calculando diferença e novo saldo em tempo real
* Botões "Cancelar" e "Registrar Venda"

### Cenário 4o modal "Registrar Venda" está aberto e disponível,  
**Quando** o usuário preenche:
* Comprador: Lucas Martins
* Data da venda: 23/04/2026
* Valor nominal: R$ 60,00
* Valor recebido: R$ 50,00
**E** clica em "Registrar Venda",  
**Então** exibe spinner no botão,  
**E** faz POST /api/transporte/vendas,  
**E** fecha o modal,  
**E** exibe toast de sucesso "Venda registrada com sucesso! 💜",  
**E** atualiza cards de saldo e histórico automaticamente (invalidateQueries),  
**E** atualiza o card "Próxima venda" com a nova data.

### Cenário 6 — Registrar venda CLT com aviso
**Dado** que o usuário é CLT,  
**Quando** registra uma venda com sucesso,  
**Então** exibe toast de warning com ícone de alerta:  
"⚠️ CLT: VT é descontado em folha (6%). Venda pode gerar irregularidades."

### Cenário 6 — Erro ao registrar venda (saldo insuficiente)
**Dado** que o saldo VT é R$ 52,00,  
**Quando** o usuário tenta vender R$ 60,00 nominal,  
**Então** a requisição retorna 400,  mpo "Valor nominal vendido":  
"Saldo insuficiente. Você tem apenas R$ 52,00 disponível."  
**E** o modal NÃO fecha,  
**E** o usuá5io pode corrigir o valor.

### Cenário 7 — Cálculo automático de diferença e novo saldo
**Dado** que o modal "Registrar Venda" está aberto,  
**Quando** o usuário digita:
* Valor nominal: R$ 60,00
* Valor recebido: R$ 50,00
**Então** o resumo é atualizado em tempo real mostrando:
* Valor nominal: R$ 60,00
* Valor recebido: R$ 50,00
* Diferença: **-R$ 10,00 (perda)** em vermelho
* Novo saldo VT: R$ 112,00 (calculado: saldo atual - nominal)

### Cenário 9 — Abrir modal "Registrar Uso"
**Dado** que8o usuário está na página de Vale Transporte,  
**Quando** clica em "+ Registrar Uso",  
**Então** abre o modal com:
* Header azul mostrando saldo VT atual e passagens usadas no mês
* Campo "Quantidade de passagens" com stepper (padrão: 2)
* Campo "Valor por passagem" preenchido com valor padrão do usuário ou R$ 4,80
* Campo "Data" preenchido com data atual
* Resumo do uso mostrando fórmula e novo saldo
* Toggle "Salvar valor da passagem como padrão" ligado
* Botões "Cancelar" e "Registrar Uso"

### Cenário 10 — Registrar uso com sucesso
**Dado** que9 modal "Registrar Uso" está aberto,  
**Quando** o usuário preenche:
* Quantidade: 2 passagens
* Valor por passagem: R$ 4,80
* Data: 15/05/2026
* Toggle "Salvar como padrão": ligado
**E** clica em "Registrar Uso",  
**Então** exibe spinner no botão,  
**E** faz POST /api/transporte/usos com salvarValorPadrao = true,  
**E** fecha o modal,  
**E** exibe toast "Uso registrado com sucesso! 💜",  
**E** atualiza cards de saldo,  
**E** atualiza aba "Histórico de usos".

### Cenário 11 — Cálculo automático do total do uso
**Dado** que 0 modal "Registrar Uso" está aberto,  
**Quando** o usuário altera:
* Quantidade: 3 passagens
* Valor: R$ 5,00
**Então** o resumo é atualizado em tempo real mostrando:
* Total do uso: R$ 5,00 × 3 = R$ 15,00
* Novo saldo VT: R$ 157,00 (saldo atual - total)

### Cenário 11 — Alternar entre abas de histórico
**Dado** que o usuário está na aba "Histórico de vendas",  
**Quando** clica na aba "Histórico de usos",  
**Então** a tabela é trocada instantaneamente mostrando:
* Colunas: Data, Quantidade, Valor por passagem, Total
* Dados dos usos do período
* Linha de TOTAL na parte inferior
* **E** mantém o filtro de período aplicado em ambas as abas

### Cenário 12 — Filtrar histórico por período
**Dado** que o usuário está na aba "Histórico de vendas",  
**Quando** seleciona o período "Março de 2026" no filtro,  
**Então** faz GET /api/transporte/vendas?periodo=2026-03,  
**E** atualiza a tabela com as vendas de março,  
**E** atualiza a linha de TOTAL com os valores do período.

### Cenário 13 — Paginação do histórico
**Dado** que há mais de 10 vendas no período,  
**Quando** o usuário clica em "2" na paginação,  
**Então** faz GET /api/transporte/vendas?periodo=2026-04&pagina=2&limite=10,  
**E** atualiza a tabela com os resultados da página 2,  
**E** destaca o número "2" como página ativa.

### Cenário 14 — Exibir diferença com cores corretas
**Dado** que o usuário está visualizando o histórico de vendas,  
**Quando** uma venda tem:
* Nominal R$ 22,00, Recebido R$ 20,00 → Diferença: **- R$ 2,00** em vermelho
* Nominal R$ 22,00, Recebido R$ 23,00 → Diferença: **+ R$ 1,00** em verde
* Nominal R$ 22,00, Recebido R$ 22,00 → Diferença: **R$ 0,00** em cinza
**Então** as cores são aplicadas corretamente em cada linha.

### Cenário 15 — Registrar múltiplas vendas no mesmo mês
**Dado** que o usuário já vendeu R$ 100,00 de VT no mês,  
**Quando** registra outra venda de R$ 50,00 para outra pessoa,  
**Então** ambas as vendas são registradas com sucesso,  
**E** o histórico mostra as duas vendas separadamente,  
**E** o card "Vendido (nominal)" soma ambas: R$ 150,00,  
**E** não há restrição de quantidade de vendas por período.

---

## 🎨 Visual e UX

### Cards de Resumo

**Card "Saldo do mês" (principal):**
- Fundo branco (modo claro) ou cinza escuro (modo escuro)
- Layout em grid 2×2
- Cada métrica tem:
  - Ícone colorido à esquerda
  - Label em cinza
  - Valor grande em negrito
  - Subtexto adicional (ex: "10 passagens")
- **Recebido:** Ícone seta para baixo (azul)
- **Usado:** Ícone de ônibus (roxo)
- **Vendido:** Ícone de seta para cima (laranja)
- **Saldo restante:** Ícone de carteira (verde)

### Botões de Ação
- **Registrar Uso:** Outline roxo, fundo transparente, hover com fundo roxo claro
- **Registrar Venda:** Preenchido roxo, hover com roxo mais escuro
- Ambos com ícone "+" à esquerda

### Tabs de Histórico
- Design Material-UI padrão
- Borda inferior roxa na aba ativa
- Texto cinza nas inativas, roxo na ativa
- Transição suave ao trocar

### Tabelas
- Header com fundo cinza claro
- Linhas alternadas (zebra striping)
- Hover em cada linha com fundo roxo muito claro
- Linha de TOTAL em negrito com fundo cinza
- Valores monetários alinhados à direita
- Diferenças com cores: verde (+), vermelho (-), cinza (0)

### Modal "Registrar Venda"
- Largura: 600px
- Header informativo (card azul claro) no topo:
  - Ícone de ônibus azul
  - Saldo disponível em destaque
  - Última venda e status com ícone
- Campos organizados verticalmente
- Labels à esquerda, inputs ocupando largura total
- Textos auxiliares em cinza abaixo dos campos
- Ícones de info com tooltip
- Resumo da transação em card cinza claro:
  - Layout em lista vertical
  - Diferença em destaque (verde ou vermelho)
  - Novo saldo em azul
  - Próxima venda em azul com ícone de calendário
- Aviso informativo em card azul claro no final
- Botões no footer: Cancelar (esquerda), Registrar Venda (direita)

### Modal "Registrar Uso"
- Largura: 500px (menor que venda)
- Header informativo (card azul claro)
- Stepper de quantidade:
  - Botão "-" à esquerda
  - Número grande no centro
  - Botão "+" à direita
  - Botões circulares roxos
- Resumo do uso em card azul claro:
  - Ícone de calculadora
  - Fórmula visível: "R$ 4,80 × 2 = R$ 9,60"
  - Novo saldo em azul
- Toggle personalizado (switch Material-UI)
- Layout responsivo

### Responsividade
- Desktop (>1024px): Cards lado a lado, tabela completa
- Tablet (768-1024px): Cards empilhados, tabela com scroll horizontal
- Mobile (<768px): Tudo empilhado, modais ocupam 95% da largura

### Tela Bloqueada (PJ/Pessoa Física)
- Centralizada vertical e horizontalmente
- Ícone de cadeado grande (roxo)
- Título em negrito
- Mensagem explicativa
- Botão "Falar com suporte" em destaque

---

## ⚙️ Integração Técnica

### Hooks (TanStack Query)

#### useTransport.js (EXISTENTE — MODIFICAR)

**O arquivo já existe. Verificar hooks existentes e adicionar:**

Hooks NOVOS a adicionar:

**`useGetVtSaldo(periodo)`**
→ Query key: `['transport', 'saldo', periodo]`  
→ Query fn: transportService.obterSaldo(periodo)  
→ Retorna: { data: { recebido, usado, passagensUsadas, vendidoNominal, saldoRestante, proximaVenda }, isLoading, isError }  
→ Configuração: staleTime 30 segundos, refetchInterval 60 segundos (para atualizar progresso da próxima venda)

**`useGetVtVendas(periodo, pagina, limite)`**
→ Query key: `['transport', 'vendas', periodo, pagina]`  
→ Query fn: transportService.listarVendas(periodo, pagina, limite)  
→ Retorna: { data: { vendas, totais, paginacao }, isLoading, isError }   }, isLoading, isError }  
→ Configuração: staleTime 30 segundos

**`useGetVtUsos(periodo, pagina, limite)`**
→ Query key: `['transport', 'usos', periodo, pagina]`  
→ Query fn: transportService.listarUsos(periodo, pagina, limite)  
→ Retorna: { data: { usos, totais, paginacao }, isLoading, isError }  
→ Configuração: staleTime 1 min

**`useRegistrarVendaVt()`**
→ Mutation fn: transportService.registrarVenda(dados)  
→ onSuccess: invalidateQueries(['transport', 'saldo'], ['transport', 'vendas']), toast sucesso, se CLT exibir warning  
→ onError: toast erro com mensagem do backend  
→ Retorna: { mutate, isLoading }

**`useRegistrarUsoVt()`**
→ Mutation fn: transportService.registrarUso(dados)  
→ onSuccess: invalidateQueries(['transport', 'saldo'], ['transport', 'usos']), toast sucesso  
→ onError: toast erro  
→ Retorna: { mutate, isLoading }

### Services

#### transportService.js (EXISTENTE — MODIFICAR)

**O arquivo já existe. Verificar métodos existentes e adicionar:**

Métodos NOVOS a adicionar:

**`obterSaldo(periodo)`**
→ GET /api/transporte/saldo  
→ Query params: periodo (YYYY-MM)  
→ Retorna: { recebido, usado, passagensUsadas, vendidoNominal, saldoRestante, proximaVenda }

**`listarVendas(periodo, pagina, limite)`**
→ GET /api/transporte/vendas  
→ Query params: periodo, pagina, limite  
→ Retorna: { vendas, totais, paginacao }

**`listarUsos(periodo, pagina, limite)`**
→ GET /api/transporte/usos  
→ Query params: periodo, pagina, limite  
→ Retorna: { usos, totais, paginacao }

**`registrarVenda(dados)`**
→ POST /api/transporte/vendas  
→ Body: { nomeComprador, dataVenda, valorNominal, valorRecebido }  
→ Retorna: venda criada com diferenca, novoSaldoVt, proximaDataVenda, warning (se CLT)

**`registrarUso(dados)`**
→ POST /api/transporte/usos  
→ Body: { quantidade, valorPorPassagem, data, salvar
→ Retorna: uso criado com totalUsado, novoSaldoVt

### Componentes

#### Transport/ (EXISTENTE — MODIFICAR)

**O arquivo `Transport.jsx` existe mas pode estar vazio ou básico. Criar estrutura completa:**

**Estrutura:**
```jsx
<TransportPageContainer>
  {modoUso === 'PJ' || modoUso === 'PESSOA_FISICA' ? (
    <TelaBloqueda />
  ) : (
    <>
      <PageHeader>
        <Title>Vale Transporte</Title>
        <Subtitle>Acompanhe seu saldo, usos e vendas do vale transporte.</Subtitle>
      </PageHeader>
      
      <BalanceSection>
        <VTBalanceCard saldo={saldo} />
      </BalanceSection>
      
      <ActionsSection>
        <Button variant="outline" onClick={abrirModalUso}>
          + Registrar Uso
        </Button>
        <Button variant="filled" onClick={abrirModalVenda}>
          + Registrar Venda
        </Button>
      </ActionsSection>
      
      <HistorySection>
        <Tabs value={abaAtiva} onChange={setAbaAtiva}>
          <Tab value="vendas" label="Histórico de vendas" />
          <Tab value="usos" label="Histórico de usos" />
        </Tabs>
        
        <FiltroPeriodo value={periodo} onChange={setPeriodo} />
        
        {abaAtiva === 'vendas' ? (
          <VTSaleHistory vendas={vendas} totais={totaisVendas} />
        ) : (
          <VTUsageHistory usos={usos} totais={totaisUsos} />
        )}
        
        <Pagination {...paginacao} />
      </HistorySection>
      
      {modalVendaAberto && (
        <VTSaleForm
          saldo={saldo}
          proximaVenda={proximaVenda}
          onClose={fecharModalVenda}
          onSubmit={handleRegistrarVenda}
        />
      )}
      
      {modalUsoAberto && (
        <VTUsageForm
          saldo={saldo}
          passagensUsadas={passagensUsadas}
          valorPadrao={valorPadraoPassagem}
          onClose={fecharModalUso}
          onSubmit={handleRegistrarUso}
        />
      )}
    </>
  )}
</TransportPageContainer>
```

**Estado local:**
```javascript
const { data: usuario } = useAuth();
const modoUso = usuario?.configuracoes?.modoUso;
const [periodo, setPeriodo] = useState(mesAtual); // YYYY-MM
const [abaAtiva, setAbaAtiva] = useState('vendas');
const [pagina, setPagina] = useState(1);
const [modalVendaAberto, setModalVendaAberto] = useState(false);
const [modalUsoAberto, setModalUsoAberto] = useState(false);

const { data: saldo } = useGetVtSaldo(periodo);
const { data: vendasData } = useGetVtVendas(periodo, pagina, 10);
const { data: usosData } = useGetVtUsos(periodo, pagina, 10);
```

#### VTBalanceCard/ (EXISTENTE — MODIFICAR)

**Verificar se existe e está implementado. Se vazio, criar:**

Props:
```typescript
{
  saldo: {
    recebido: string,
    usado: string,
    passagensUsadas: number,
    vendidoNominal: string,
    saldoRestante: string
  }
}
```

**Componentes internos:**
- Grid 2×2 com 4 cards de métrica
- Cada métrica: ícone, label, valor, subtexto

#### VTNextSaleCountdown/ (EXISTENTE — MODIFICAR)

**O arquivo existe. Verificar se está implementado:**

Props:
```typescript
{
  saldo: { saldoRestante: string, ... },
  proximaVenda: { disponivel: boolean, ... },
  onClose: () => void,
  onSubmit: (dados) => void
}
```

**Estado local:**
```javascript
const [nomeComprador, setNomeComprador] = useState('');
const [dataVenda, setDataVenda] = useState(new Date());
const [valorNominal, setValorNominal] = useState('');
const [valorRecebido, setValorRecebido] = useState('');
const [erro, setErro] = useState('');

// Cálculos em tempo real
const diferenca = parseFloat(valorRecebido) - parseFloat(valorNominal);
const novoSaldo = parseFloat(saldo.saldoRestante) - parseFloat(valorNominal);
const proximaDataVenda = addDays(dataVenda, 30); // ou diasIntervaloVendaVt
```

**Validações locais:**
- Se valorNominal > saldo.saldoRestante: exibir erro imediatamente
- Se valorNominal <= 0 ou valorRecebido <= 0: erro
- 
#### VTUsageForm/ (EXISTENTE — MODIFICAR)

**O arquivo existe. Verificar implementação:**

Props:
```typescript
{
  saldo: { saldoRestante: string, ... },
  passagensUsadas: number,
  valorPadrao: number | null,
  onClose: () => void,
  onSubmit: (dados) => void
}
```

**Estado local:**
```

**Validações locais:**
- Se valorNominal > saldo.saldoRestante: exibir erro imediatamente
- Se valorNominal <= 0 ou valorRecebido <= 0: erro
const totalUsado = quantidade * valorPorPassagem;
const novoSaldo = parseFloat(saldo.saldoRestante) - totalUsado;
```

**Stepper:**
- Botão "-" chama `setQuantidade(q => Math.max(1, q - 1))`
- Botão "+" chama `setQuantidade(q => q + 1)`

#### VTSaleHistory/ (EXISTENTE — MODIFICAR)

**Verificar se existe. Se vazio, criar:**

Props:
```typescript
{
  vendas: Array<Venda>,
  totais: {
    totalNominal: string,
    totalRecebido: string,
    perdaTotal: string
  }
}
```

**Tabela:**
- Colunas: Data, Comprador, Nominal, Recebido, Diferença
- Formatação da diferença com cores:
  - `diferenca < 0` → vermelho
  - `diferenca > 0` → verde
  - `diferenca === 0` → cinza
- Linha de TOTAL no footer

#### VTUsageHistory/ (NOVO — CRIAR)

**Este componente NÃO existe.**

Criar em: `src/components/features/transport/VTUsageHistory/VTUsageHistory.jsx`  
Seguir padrão de: VTSaleHistory

Props:
```typescript
{
  usos: Array<Uso>,
  totais: {
    totalPassagens: number,
    totalGasto: string
  }
}
```

**Tabela:**
- Colunas: Data, Quantidade, Valor por passagem, Total
- Total = quantidade × valorPorPassagem
- Linha de TOTAL no footer

#### TelaBloqueda/ (NOVO — CRIAR)

**Este componente NÃO existe.**

Criar em: `src/components/features/transport/TelaBloqueda/TelaBloqueda.jsx`

**Estrutura:**
```jsx
<Container>
  <Icon>🔒</Icon>
  <Title>Funcionalidade indisponível</Title>
  <Message>
    Esta funcionalidade está disponível apenas para Estagiários e CLT.
    Caso você tenha acordo com sua empresa que inclui Vale Transporte,
    entre em contato com o suporte para habilitar.
  </Message>
  <Button onClick={abrirChat}>Falar com suporte</Button>
</Container>
```

### Endpoints consumidos

* GET /api/transporte/saldo → Obter saldo e resumo do VT
* POST /api/transporte/vendas → Registrar venda de VT
* GET /api/transporte/vendas → Listar histórico de vendas
* POST /api/transporte/usos → Registrar uso de VT
* GET /api/transporte/usos → Listar histórico de usos

---

## 🚫 Regras de Negócio

* **RN-003:** Estagiário recebe VT como benefício e pode vendê-lo
* **RN-038:** VT só pode ser gasto em despesas da categoria "Transporte"
* **RN-039:** Despesas de alimentação NUNCA podem usar recurso VT
* **RN-040:** VT pode ser vendido (Estagiário sem restrições)
* **RN-041:** Ao vender VT, o valor recebido entra como receita DINHEIRO
* **RN-042:** Intervalo entre vendas configurável (padrão 30 dias)
* **RN-043:** Sistema bloqueia nova venda antes do intervalo
* **RN-044:** Saldo VT = Recebido - Usado - Vendido (nominal)
* **RN-045:** CLT pode vender mas com aviso (desconto 6% em folha)
* **RN-018:** PJ não recebe VT (tela bloqueada, mas pode ter exceções)
* **RN-023:** Pessoa Física sem benefícios corporativos (tela bloqueada, mas pode ter exceções)

---

## 🛠️ Refinamento

* **Estado Global:** TanStack Query para cache de saldo, vendas e usos
* **Estado Local:** useState para filtros, abas, paginação, modais dentro do componente Transport
* **Validação:** Zod no backend + validação local no frontend para feedback imediato
* **Máscaras:** react-number-format para campos de valor (R$ 0,00)
* **DatePicker:** Material-UI DatePicker ou react-datepicker
* **Cálculos em tempo real:** useEffect ou useMemo para recalcular diferença, novo saldo, progresso
* **Tratamento de Erros:** Toast para erros globais + mensagem inline no formulário
* **Loading States:** Skeletons nos cards e tabelas, spinners nos botões de ação
* **Empty States:** Ilustração + texto quando não há vendas ou usos
* **Responsividade:** Mobile-first, modais em fullscreen no mobile
* **Acessibilidade:** Labels nos inputs, aria-labels nos botões, navegação por teclado
* **Atualização automática:** refetchInterval no hook de saldo para atualizar progresso da próxima venda a cada 60 segundos

---
Múltiplas vendas:** Não há restrição de quantidade de vendas por período - usuário pode vender "picado" para várias pessoa