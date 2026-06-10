# [EPIC] Orçamento Mensal

Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Planejamento, Frontend, Backend, Banco de Dados
Relator:     (preencher)
Pai:         —
Data Limite: (preencher)

## 📋 Descrição Geral

Sistema completo de **Orçamento Mensal** que permite ao usuário definir limites de gasto por categoria, acompanhar em tempo real quanto já foi consumido vs. limite planejado, e receber notificações automáticas quando atingir **80%** ou **100%** do orçamento definido.

O módulo introduz também o **sistema de notificações persistentes** com sininho na navbar, dropdown de notificações, e toasts temporários para alertas em tempo real.

---

## 🎯 Visão do Módulo

### Funcionalidades Principais

#### 1. **Gestão de Orçamento Mensal**
- Usuário define limite de gasto por categoria (opcional — pode escolher quais categorias monitorar)
- Orçamentos são **mensais** (Janeiro/2026, Fevereiro/2026, etc.)
- Usuário pode:
  - Criar novo orçamento para o mês corrente
  - Editar orçamento existente
  - **Copiar orçamento do mês anterior** como template
  - Visualizar orçamentos de meses passados
- Sistema calcula automaticamente quanto já foi gasto no mês (soma de transações do tipo DESPESA na categoria)

#### 2. **Tela de Orçamento Mensal** (`/budget`)
- **Visão geral do orçamento:**
  - Total do orçamento definido (soma de todos os limites)
  - Sua renda mensal planejada (vem de `ConfiguracaoUsuario.rendaMensalPlanejada`)
  - Sobra planejada (renda - orçamento total)
  - % do orçamento já utilizado (barra de progresso geral)

- **Orçamento por categoria:**
  - Lista de categorias com limite definido
  - Para cada categoria:
    - Nome e ícone
    - Valor gasto / Valor limite
    - % de uso
    - Barra de progresso (cores: verde <80%, amarelo 80-100%, vermelho >100%)
    - Badge de alerta (🔔 80% | ⚠️ 100%)

- **Categorias sem orçamento definido:**
  - Lista de categorias do usuário que ainda não têm limite
  - Botão "Definir limite" para cada uma

- **Modal de Edição de Limites:**
  - Lista de categorias com inputs de valor (R$)
  - Resumo do orçamento:
    - Orçamento total definido
    - Sua renda mensal
    - Sobra planejada
    - Validação: alerta se orçamento > renda (permite salvar, mas avisa)
  - Adicionar categoria (select + input valor)
  - Remover categoria do orçamento (X vermelho)
  - Botões: "Cancelar" | "Salvar Limites"

#### 3. **Sistema de Notificações Persistentes** 🔔

- **Sininho na navbar** (desktop e mobile):
  - Badge com contador de notificações não lidas
  - Dropdown com lista de notificações (últimas 10)
  - Click em notificação: marca como lida e redireciona (se aplicável)
  - Link "Ver todas" no final do dropdown → página de notificações (futura)

- **Tipos de notificação (orçamento):**
  - **ALERTA_ORCAMENTO** (80%): "Você atingiu 80% do limite de [Categoria] (R$ X / R$ Y)"
  - **ORCAMENTO_ESTOURADO** (100%): "Orçamento de [Categoria] estourado! Você gastou R$ X de R$ Y planejados."

- **Notificações salvas no banco:**
  - Tabela `Notificacao` com campos: tipo, título, mensagem, lida, data, link de ação
  - Usuário pode ver histórico de notificações

- **Toast temporário:**
  - Quando notificação é criada, exibe toast na tela (warning para 80%, danger para 100%)
  - Toast some após alguns segundos, mas notificação fica visível no sininho

#### 4. **Job de Verificação de Limites** (Background)

- Job agendado que roda **de hora em hora**
- Para cada usuário que tem orçamento no mês corrente:
  - Calcula quanto foi gasto em cada categoria
  - Se atingiu 80% pela primeira vez → cria notificação ALERTA_ORCAMENTO
  - Se estourou 100% pela primeira vez → cria notificação ORCAMENTO_ESTOURADO
- Evita duplicatas (verifica se já existe notificação do mesmo tipo/categoria/mês)

---

## 📱 Telas e Fluxos

### Tela: Orçamento Mensal (`/budget`)

**Header da página:**
- Título: "Orçamento Mensal"
- Selector de mês (dropdown: "Maio de 2025", "Junho de 2025", etc.)
- Botão: "Editar Limites" (abre modal)

**Visão Geral:**
- Card 1: Total do orçamento → R$ 5.000,00
- Card 2: Total já gasto → R$ 2.950,75
- Card 3: Restante disponível → R$ 2.049,25
- Barra de progresso: 59% do orçamento utilizado

**Orçamento por Categoria:**
- Lista de categorias com limites definidos (ordenar por % de uso, decrescente)
- Para cada categoria:
  ```
  [Ícone] Alimentação
  R$ 280,00 / R$ 400,00      70%      [Barra verde]
  ```
  ```
  [Ícone] Lazer                              🔔 80%
  R$ 180,00 / R$ 150,00      120%     [Barra vermelha]   ⚠️ Estourou!
  ```

**Categorias sem orçamento definido:**
- Seção colapsável (expandir/recolher)
- Cada categoria sem limite:
  ```
  [Ícone] Manutenção                      + Definir limite
  ```
  - Click em "Definir limite" → abre modal de edição já com essa categoria selecionada

---

### Modal: Editar Limites de Orçamento

**Header:**
- Título: "Editar Limites de Orçamento"
- Botão fechar (X)

**Info Box:**
- ℹ️ "Defina quanto pretende gastar no máximo por categoria este mês"
- "Você será alertado ao atingir **80%** do limite"

**Limites por Categoria:**
- Lista de categorias com limite já definido:
  ```
  [Ícone] Alimentação      R$ [400,00]      [X]
  [Ícone] Transporte       R$ [200,00]      [X]
  [Ícone] Lazer            R$ [150,00]      [X]
  ```
  - Input numérico (formato R$)
  - Botão [X] para remover categoria do orçamento

**Adicionar Categoria:**
- ➕ "Adicionar categoria"
- Select: "Selecionar categoria..."
- Input: R$ [valor]
- Botão: "+ Adicionar"

**Resumo do Orçamento:**
- 📊 Orçamento total definido: **R$ 2.400,00**
- 💰 Sua renda mensal: **R$ 3.000,00**
- 📈 Sobra planejada: **R$ 600,00 (20%)**
- ✅ "Ótimo! Seu orçamento está dentro da sua renda."
- (Se orçamento > renda: ⚠️ "Atenção: seu orçamento está acima da sua renda mensal.")

**Footer:**
- Botão: "Cancelar" (ghost)
- Botão: "Salvar Limites" (primary)

---

### Sininho de Notificações (Navbar)

**Componente:** `NotificationBell.jsx`

**Desktop:**
- Ícone de sino (lucide `Bell`)
- Badge com contador (ex: "3") se houver não lidas
- Hover → tooltip "Notificações"
- Click → abre dropdown

**Mobile:**
- Mesmo componente, posicionado no header do `MainLayout`

**Dropdown de Notificações:**
- Header: "Notificações" | "Marcar todas como lidas"
- Lista de notificações (últimas 10):
  ```
  [Ícone] Orçamento de Alimentação atingiu 80%
          R$ 320,00 de R$ 400,00 gastos
          Há 2 horas                           [•] (não lida)
  ```
  - Click na notificação: marca como lida + redireciona para `/budget`
- Footer: "Ver todas"
- Estado vazio: "🔕 Nenhuma notificação nova"

---

## 🗄️ Modelo de Dados (Resumo)

### Tabela: `Orcamento`
- `id` (UUID)
- `usuarioId` (FK → Usuario)
- `categoriaId` (FK → Categoria)
- `mesReferencia` (Date — primeiro dia do mês, ex: 2026-05-01)
- `limiteValor` (Decimal 12,2)
- `criadoEm`, `atualizadoEm`
- **Unique:** `(usuarioId, categoriaId, mesReferencia)` — um limite por categoria por mês

### Tabela: `Notificacao`
- `id` (UUID)
- `usuarioId` (FK → Usuario)
- `tipo` (TipoNotificacao — ENUM)
- `titulo` (String 120)
- `mensagem` (String 500)
- `lida` (Boolean, default false)
- `linkAcao` (String 255, nullable — ex: "/budget")
- `metadados` (JSON, nullable — ex: `{ categoriaId, mesReferencia, percentual }`)
- `criadoEm`

### Enum: `TipoNotificacao`
- `RECEITA_REGISTRADA`
- `DESPESA_REGISTRADA`
- `META_ATINGIDA`
- `ALERTA_ORCAMENTO` ← novo
- `ORCAMENTO_ESTOURADO` ← novo
- `LEMBRETE_VENCIMENTO`
- `STREAK`
- `CONQUISTA`
- `GRUPO_ATIVIDADE`
- `DIVIDA_COBRANCA`
- `INSIGHT_IA`

### Novo campo em `ConfiguracaoUsuario`:
- `rendaMensalPlanejada` (Decimal 12,2, nullable) — renda que o usuário quer usar para planejamento (pode ser diferente do `valorSalario`)

---

## 🔗 Dependências e Integrações

### Backend → Frontend
- `GET /api/orcamentos?mes=2026-05` → lista orçamentos do mês
- `POST /api/orcamentos` → cria/atualiza limites (upsert em batch)
- `GET /api/orcamentos/status?mes=2026-05` → resumo do orçamento + status por categoria (gasto, limite, %)
- `GET /api/notificacoes` → lista notificações do usuário (paginado, filtro `lida=false`)
- `PATCH /api/notificacoes/:id/marcar-lida` → marca notificação como lida
- `PATCH /api/notificacoes/marcar-todas-lidas` → marca todas como lidas

### Job → Backend
- `jobs/budgetAlertJob.js` roda de hora em hora (cron: `0 * * * *` — a cada hora no minuto 0)
- Chama `budgetService.verificarLimitesENotificar()` para cada usuário

### Frontend → Notificações
- Hook: `useNotifications()` → carrega notificações não lidas para o sininho
- Componente: `NotificationBell.jsx` → sininho + dropdown
- Store (opcional): `notificationSlice.js` ou estado local via hook

---

## 🎨 Protótipos Fornecidos

1. **Tela de listagem de orçamento** — barras de progresso por categoria, resumo geral
2. **Modal de edição de limites** — inputs por categoria, resumo do orçamento
3. **Versões desktop e mobile** — layouts responsivos

---

## 🚀 Critérios de Aceite Gerais (Epic)

→ Usuário consegue definir limites de orçamento por categoria para o mês corrente
→ Usuário vê em tempo real quanto já gastou vs. limite (barra de progresso)
→ Sistema envia notificação ao atingir 80% do limite de uma categoria
→ Sistema envia notificação ao estourar 100% do limite de uma categoria
→ Notificações aparecem como toast + persistem no sininho da navbar
→ Usuário pode copiar orçamento do mês anterior como template
→ Usuário pode editar/remover limites de categorias
→ Usuário pode adicionar categorias ao orçamento via modal
→ Página de orçamento exibe resumo geral: total definido, total gasto, restante disponível
→ Sininho na navbar exibe contador de notificações não lidas
→ Dropdown de notificações permite marcar como lida e redirecionar
→ Job agendado verifica diariamente os limites e cria notificações automaticamente
→ Sistema valida se orçamento total > renda mensal (alerta, mas permite salvar)

---

**Próximos passos:**
- Story Database (SQL)
- Story Backend (rotas, controllers, services, schemas, job)
- Story Frontend (página, componentes, hooks, services, sininho)

---

# [STORY DATABASE] Orçamento Mensal — Banco de Dados

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Banco de Dados
Relator:     (preencher)
Pai:         [EPIC] Orçamento Mensal
Data Limite: (preencher)

## 📝 História de Usuário

**Como sistema**, eu quero que o banco de dados suporte **orçamentos mensais por categoria** e **notificações persistentes**, para que o usuário possa definir limites de gasto, acompanhar o consumo em tempo real, e receber alertas automáticos ao atingir 80% ou estourar 100% do orçamento.

---

## 🛠️ SQL a executar

### **1. Enum: TipoNotificacao** [NOVO ENUM]

```sql
-- Enum para tipos de notificação (já existem alguns tipos definidos no frontend, agora vamos persistir no banco)
CREATE TYPE "TipoNotificacao" AS ENUM (
  'RECEITA_REGISTRADA',
  'DESPESA_REGISTRADA',
  'META_ATINGIDA',
  'ALERTA_ORCAMENTO',
  'ORCAMENTO_ESTOURADO',
  'LEMBRETE_VENCIMENTO',
  'STREAK',
  'CONQUISTA',
  'GRUPO_ATIVIDADE',
  'DIVIDA_COBRANCA',
  'INSIGHT_IA'
);
```

---

### **2. Tabela: Orcamento** [NOVA TABELA]

```sql
-- Tabela de orçamentos mensais por categoria
-- Um limite por categoria por mês
CREATE TABLE "orcamentos" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "usuario_id" TEXT NOT NULL,
  "categoria_id" TEXT NOT NULL,
  "mes_referencia" DATE NOT NULL, -- Primeiro dia do mês (ex: 2026-05-01)
  "limite_valor" DECIMAL(12,2) NOT NULL CHECK ("limite_valor" > 0),
  "criado_em" TIMESTAMP NOT NULL DEFAULT NOW(),
  "atualizado_em" TIMESTAMP NOT NULL,

  CONSTRAINT "orcamentos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE,
  CONSTRAINT "orcamentos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE CASCADE,
  CONSTRAINT "orcamentos_usuario_categoria_mes_unique" UNIQUE ("usuario_id", "categoria_id", "mes_referencia")
);

-- Índices para performance
CREATE INDEX "orcamentos_usuario_id_mes_idx" ON "orcamentos"("usuario_id", "mes_referencia");
CREATE INDEX "orcamentos_categoria_id_idx" ON "orcamentos"("categoria_id");
```

---

### **3. Tabela: Notificacao** [NOVA TABELA]

```sql
-- Tabela de notificações persistentes (sininho na navbar)
CREATE TABLE "notificacoes" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "usuario_id" TEXT NOT NULL,
  "tipo" "TipoNotificacao" NOT NULL,
  "titulo" VARCHAR(120) NOT NULL,
  "mensagem" VARCHAR(500),
  "lida" BOOLEAN NOT NULL DEFAULT false,
  "link_acao" VARCHAR(255), -- Ex: "/budget", "/transactions", null
  "metadados" JSONB, -- Ex: { "categoriaId": "xyz", "mesReferencia": "2026-05-01", "percentual": 85 }
  "criado_em" TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT "notificacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX "notificacoes_usuario_id_lida_idx" ON "notificacoes"("usuario_id", "lida");
CREATE INDEX "notificacoes_usuario_id_criado_em_idx" ON "notificacoes"("usuario_id", "criado_em" DESC);
CREATE INDEX "notificacoes_tipo_idx" ON "notificacoes"("tipo");
```

---

### **4. Alterar ConfiguracaoUsuario: adicionar rendaMensalPlanejada** [ALTERAR TABELA EXISTENTE]

```sql
-- Novo campo para renda mensal planejada (usada no cálculo da sobra do orçamento)
-- Separado de valorSalario para permitir flexibilidade (usuário pode querer planejar com renda líquida, freelancer com renda variável, etc.)
ALTER TABLE "configuracoes_usuario"
ADD COLUMN "renda_mensal_planejada" DECIMAL(12,2);

-- Opcional: migrar valor inicial de valorSalario para rendaMensalPlanejada (se desejar)
-- UPDATE "configuracoes_usuario" SET "renda_mensal_planejada" = "valor_salario" WHERE "renda_mensal_planejada" IS NULL;
```

---

## ⚙️ Após executar o SQL

### Usando Prisma (padrão do projeto):

```bash
# 1. Editar prisma/schema.prisma manualmente com as definições acima
# 2. Criar migration
npx prisma migrate dev --name add_budget_and_notifications

# 3. Gerar Prisma Client
npm run db:generate

# 4. (Opcional) Rodar seed se necessário
npm run db:seed
```

---

## 📐 Diagrama Atualizado

**OBS: ATUALIZAR NO DIAGRAMA**

### Tabelas afetadas:
- **NOVA:** `orcamentos`
  - Colunas: `id`, `usuario_id` (FK), `categoria_id` (FK), `mes_referencia`, `limite_valor`, `criado_em`, `atualizado_em`

- **NOVA:** `notificacoes`
  - Colunas: `id`, `usuario_id` (FK), `tipo`, `titulo`, `mensagem`, `lida`, `link_acao`, `metadados` (JSONB), `criado_em`

- **ALTERADA:** `configuracoes_usuario`
  - Nova coluna: `renda_mensal_planejada` (Decimal 12,2, nullable)

### Enums novos:
- `TipoNotificacao` (11 valores)

### Relacionamentos:
- `Usuario` 1:N `Orcamento` (um usuário tem múltiplos orçamentos)
- `Categoria` 1:N `Orcamento` (uma categoria pode ter múltiplos orçamentos, um por mês)
- `Usuario` 1:N `Notificacao` (um usuário tem múltiplas notificações)

---

## ✅ Critérios de Aceite

→ Enum `TipoNotificacao` criado com todos os tipos listados (incluindo ALERTA_ORCAMENTO e ORCAMENTO_ESTOURADO)

→ Tabela `orcamentos` criada com:
  - Relacionamentos corretos (FK para Usuario e Categoria)
  - Constraint UNIQUE para `(usuario_id, categoria_id, mes_referencia)` — evita duplicatas
  - Check constraint: `limite_valor > 0`
  - Índices para performance em queries por usuário + mês

→ Tabela `notificacoes` criada com:
  - Relacionamento correto (FK para Usuario)
  - Campo `tipo` usando o enum `TipoNotificacao`
  - Campo `lida` com default `false`
  - Campo `metadados` JSONB para flexibilidade (armazena contexto da notificação)
  - Índices para queries de notificações não lidas e ordenação por data

→ Campo `renda_mensal_planejada` adicionado em `configuracoes_usuario` (nullable, Decimal 12,2)

→ Migrations Prisma executadas com sucesso

→ Prisma Client regenerado e reconhece os novos modelos

→ Diagrama de banco de dados atualizado com as novas tabelas e relacionamentos

---

# [STORY BACKEND] Orçamento Mensal — Backend

Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Backend
Relator:     (preencher)
Pai:         [EPIC] Orçamento Mensal
Data Limite: (preencher)

## 📝 Descrição

**Como sistema backend**, eu quero fornecer APIs para **gestão de orçamento mensal** (CRUD de limites por categoria), **cálculo de status de orçamento** (quanto foi gasto vs. limite), **notificações persistentes** (listar, marcar como lida), e **job agendado** para verificar limites e criar alertas automaticamente, para que o frontend possa exibir a tela de orçamento e o sininho de notificações.

---

## ✅ Critérios de Aceite

### Cenário 1 — Listar Orçamentos do Mês
**Dado** que o usuário está autenticado,
**Quando** `GET /api/orcamentos?mes=2026-05` é chamado,
**Então** retorna `200` com array de orçamentos do mês especificado:
```json
[
  {
    "id": "uuid",
    "categoriaId": "uuid",
    "categoriaNome": "Alimentação",
    "categoriaIcone": "Utensils",
    "categoriaCor": "#10B981",
    "mesReferencia": "2026-05-01",
    "limiteValor": 400.00,
    "criadoEm": "2026-05-01T10:00:00Z",
    "atualizadoEm": "2026-05-01T10:00:00Z"
  }
]
```
* **Se** `mes` não fornecido: usa mês corrente
* **Se** formato de `mes` inválido: retorna `400` "Formato de mês inválido. Use YYYY-MM"

---

### Cenário 2 — Obter Status do Orçamento (Resumo + Status por Categoria)
**Dado** que o usuário possui orçamentos e transações no mês,
**Quando** `GET /api/orcamentos/status?mes=2026-05` é chamado,
**Então** retorna `200` com:
```json
{
  "mesReferencia": "2026-05-01",
  "rendaMensalPlanejada": 3000.00,
  "resumo": {
    "orcamentoTotal": 2400.00,
    "gastoTotal": 1450.75,
    "restanteTotal": 949.25,
    "percentualUsado": 60.4
  },
  "categorias": [
    {
      "categoriaId": "uuid",
      "categoriaNome": "Alimentação",
      "categoriaIcone": "Utensils",
      "categoriaCor": "#10B981",
      "limiteValor": 400.00,
      "gastoValor": 320.00,
      "restanteValor": 80.00,
      "percentualUsado": 80.0,
      "status": "alerta" // "normal" | "alerta" | "estourado"
    },
    {
      "categoriaId": "uuid",
      "categoriaNome": "Lazer",
      "categoriaIcone": "Gamepad2",
      "categoriaCor": "#8B5CF6",
      "limiteValor": 150.00,
      "gastoValor": 180.00,
      "restanteValor": -30.00,
      "percentualUsado": 120.0,
      "status": "estourado"
    }
  ],
  "categoriasSemOrcamento": [
    {
      "id": "uuid",
      "nome": "Manutenção",
      "icone": "Wrench",
      "cor": "#EF4444"
    }
  ]
}
```
* **Status da categoria:**
  - `"normal"`: < 80%
  - `"alerta"`: >= 80% e < 100%
  - `"estourado"`: >= 100%

---

### Cenário 3 — Criar/Atualizar Orçamentos (Upsert em Batch)
**Dado** que o usuário está autenticado,
**Quando** `POST /api/orcamentos` é chamado com payload:
```json
{
  "mesReferencia": "2026-05-01",
  "limites": [
    { "categoriaId": "uuid-1", "limiteValor": 400.00 },
    { "categoriaId": "uuid-2", "limiteValor": 200.00 }
  ]
}
```
**Então** retorna `200` com orçamentos criados/atualizados (upsert por categoria + mês):
```json
{
  "mesReferencia": "2026-05-01",
  "orcamentos": [
    { "id": "uuid", "categoriaId": "uuid-1", "limiteValor": 400.00, ... },
    { "id": "uuid", "categoriaId": "uuid-2", "limiteValor": 200.00, ... }
  ]
}
```
* **Se** `limiteValor <= 0`: retorna `400` "Limite deve ser maior que zero"
* **Se** `categoriaId` não pertence ao usuário: retorna `403` "Categoria não pertence ao usuário"
* **Se** `mesReferencia` inválido: retorna `400` "Formato de mês inválido"

---

### Cenário 4 — Remover Limite de Categoria
**Dado** que o usuário possui orçamento para uma categoria no mês,
**Quando** `DELETE /api/orcamentos/:id` é chamado,
**Então** retorna `204` (sem conteúdo) e remove o orçamento.
* **Se** orçamento não pertence ao usuário: retorna `403` "Acesso negado"
* **Se** orçamento não encontrado: retorna `404` "Orçamento não encontrado"

---

### Cenário 5 — Copiar Orçamento do Mês Anterior
**Dado** que o usuário possui orçamentos em Abril/2026,
**Quando** `POST /api/orcamentos/copiar` é chamado com payload:
```json
{
  "mesOrigem": "2026-04-01",
  "mesDestino": "2026-05-01"
}
```
**Então** retorna `200` com orçamentos copiados:
```json
{
  "mesDestino": "2026-05-01",
  "orcamentos": [ ... ],
  "quantidadeCopiada": 5
}
```
* **Se** mês de destino já possui orçamentos: retorna `409` "Mês de destino já possui orçamentos. Edite-os ou remova antes de copiar."
* **Se** mês de origem não possui orçamentos: retorna `404` "Nenhum orçamento encontrado no mês de origem"

---

### Cenário 6 — Listar Notificações do Usuário
**Dado** que o usuário está autenticado,
**Quando** `GET /api/notificacoes?lida=false&limite=10` é chamado,
**Então** retorna `200` com lista de notificações não lidas (últimas 10):
```json
[
  {
    "id": "uuid",
    "tipo": "ALERTA_ORCAMENTO",
    "titulo": "Orçamento de Alimentação atingiu 80%",
    "mensagem": "Você gastou R$ 320,00 de R$ 400,00 planejados.",
    "lida": false,
    "linkAcao": "/budget",
    "metadados": {
      "categoriaId": "uuid",
      "mesReferencia": "2026-05-01",
      "percentual": 80
    },
    "criadoEm": "2026-05-15T14:30:00Z"
  }
]
```
* **Query params:**
  - `lida` (opcional): `true` | `false` (default: todas)
  - `limite` (opcional): número de resultados (default: 10, max: 50)
  - `pagina` (opcional): paginação (default: 1)
* Headers de resposta: `X-Total-Count`, `X-Total-Pages`, `X-Current-Page`

---

### Cenário 7 — Marcar Notificação como Lida
**Dado** que o usuário possui uma notificação não lida,
**Quando** `PATCH /api/notificacoes/:id/marcar-lida` é chamado,
**Então** retorna `200` com notificação atualizada:
```json
{
  "id": "uuid",
  "lida": true,
  ...
}
```
* **Se** notificação não pertence ao usuário: retorna `403` "Acesso negado"
* **Se** notificação não encontrada: retorna `404` "Notificação não encontrada"

---

### Cenário 8 — Marcar Todas as Notificações como Lidas
**Dado** que o usuário possui notificações não lidas,
**Quando** `PATCH /api/notificacoes/marcar-todas-lidas` é chamado,
**Então** retorna `200` com quantidade de notificações marcadas:
```json
{
  "quantidadeMarcada": 5
}
```

---

### Cenário 9 — Job de Verificação de Limites (Horário)
**Dado** que o job `budgetAlertJob` está configurado para rodar de hora em hora,
**Quando** o job é executado,
**Então**:
- Para cada usuário com orçamento no mês corrente:
  - Calcula gasto atual de cada categoria
  - Se atingiu 80% pela primeira vez → cria notificação `ALERTA_ORCAMENTO`
  - Se estourou 100% pela primeira vez → cria notificação `ORCAMENTO_ESTOURADO`
- Evita duplicatas (verifica se já existe notificação do mesmo tipo/categoria/mês para o usuário)
- Loga quantidade de notificações criadas

---

## 🛠️ Implementação

### budgetController.js (NOVO — CRIAR)

**Criar em:** `src/controllers/budgetController.js`  
**Seguir padrão de:** `src/controllers/transactionController.js` (ver arquitetura do projeto)

Métodos:
* `listarOrcamentos()` → GET /api/orcamentos
* `obterStatusOrcamento()` → GET /api/orcamentos/status
* `salvarOrcamentos()` → POST /api/orcamentos (upsert batch)
* `removerOrcamento()` → DELETE /api/orcamentos/:id
* `copiarOrcamento()` → POST /api/orcamentos/copiar

---

### budgetService.js (NOVO — CRIAR)

**Criar em:** `src/services/budgetService.js`  
**Seguir padrão de:** `src/services/transactionService.js`

Lógica de negócio:
→ Validar `mesReferencia` (formato YYYY-MM-DD, primeiro dia do mês)
→ `listarOrcamentos(usuarioId, mesReferencia)` — busca orçamentos + join com categoria (nome, ícone, cor)
→ `obterStatusOrcamento(usuarioId, mesReferencia)` — calcula:
  - Soma de limites (orçamento total)
  - Soma de transações DESPESA do mês por categoria (gasto total)
  - % de uso por categoria
  - Status (normal / alerta / estourado)
  - Lista categorias do usuário sem orçamento definido no mês
→ `salvarOrcamentos(usuarioId, mesReferencia, limites[])` — upsert em batch (Prisma `upsert` ou `createMany` + `updateMany`)
→ `removerOrcamento(usuarioId, orcamentoId)` — valida ownership + deleta
→ `copiarOrcamento(usuarioId, mesOrigem, mesDestino)` — busca orçamentos do mês origem + cria cópias no mês destino (validar se destino está vazio)
→ `verificarLimitesENotificar()` — usado pelo job:
  - Busca todos os usuários com orçamento no mês corrente
  - Para cada usuário + categoria:
    - Calcula % de uso
    - Se >= 80% e < 100% e não existe notificação `ALERTA_ORCAMENTO` para essa categoria/mês → cria notificação
    - Se >= 100% e não existe notificação `ORCAMENTO_ESTOURADO` para essa categoria/mês → cria notificação
  - Retorna quantidade de notificações criadas

---

### budgetRepository.js (NOVO — CRIAR)

**Criar em:** `src/repositories/budgetRepository.js`  
**Seguir padrão de:** `src/repositories/transactionRepository.js`

Métodos de acesso ao banco (Prisma):
→ `buscarPorUsuarioEMes(usuarioId, mesReferencia)` — lista orçamentos com join de categoria
→ `upsert(data)` — cria ou atualiza orçamento (único por usuário + categoria + mês)
→ `deletar(id)` — remove orçamento
→ `buscarUsuariosComOrcamentoNoMes(mesReferencia)` — retorna lista de usuários que têm orçamento no mês (usado pelo job)
→ `calcularGastosPorCategoria(usuarioId, mesReferencia)` — query agregada:
  ```js
  SELECT categoria_id, SUM(valor) as total_gasto
  FROM transacoes
  WHERE usuario_id = ? AND tipo = 'DESPESA' AND data >= ? AND data < ?
  GROUP BY categoria_id
  ```

---

### notificationService.js (NOVO — CRIAR)

**Criar em:** `src/services/notificationService.js`  
**Seguir padrão de:** `src/services/transactionService.js`

Lógica de notificações:
→ `listarNotificacoes(usuarioId, filtros)` — busca notificações com filtros (lida, tipo, paginação)
→ `marcarComoLida(usuarioId, notificacaoId)` — valida ownership + atualiza
→ `marcarTodasLidas(usuarioId)` — atualiza todas não lidas do usuário
→ `criarNotificacao(usuarioId, tipo, titulo, mensagem, linkAcao, metadados)` — cria nova notificação
→ `verificarNotificacaoDuplicada(usuarioId, tipo, metadados)` — evita duplicatas de notificações de orçamento (mesma categoria + mês)
→ `contarNaoLidas(usuarioId)` — retorna contador para o badge do sininho

---

### notificationRepository.js (NOVO — CRIAR)

**Criar em:** `src/repositories/notificationRepository.js`  
**Seguir padrão de:** `src/repositories/transactionRepository.js`

Métodos Prisma:
→ `criar(data)`
→ `listar(usuarioId, filtros, paginacao)`
→ `atualizar(id, data)`
→ `marcarTodasLidas(usuarioId)`
→ `contarNaoLidas(usuarioId)`
→ `buscarPorId(id)`
→ `buscarDuplicada(usuarioId, tipo, metadados)` — verifica se já existe notificação com mesmo tipo + categoria + mês (usando JSONB query)

---

## 📐 Schemas (Zod)

### budgetSchemas.js (NOVO — CRIAR)

**Criar em:** `src/schemas/budgetSchemas.js`  
**Seguir padrão de:** `src/schemas/transactionSchemas.js`

Schemas de validação:
→ `salvarOrcamentosSchema`:
  - `mesReferencia`: string().regex(/^\d{4}-\d{2}-01$/, "Formato inválido. Use YYYY-MM-01") (primeiro dia do mês)
  - `limites`: array().min(1).of(object({
      categoriaId: string().uuid(),
      limiteValor: number().positive("Limite deve ser maior que zero")
    }))

→ `copiarOrcamentoSchema`:
  - `mesOrigem`: string().regex(/^\d{4}-\d{2}-01$/)
  - `mesDestino`: string().regex(/^\d{4}-\d{2}-01$/)

→ `queryMesSchema`:
  - `mes`: string().regex(/^\d{4}-\d{2}$/, "Formato inválido. Use YYYY-MM").optional()

---

### notificationSchemas.js (NOVO — CRIAR)

**Criar em:** `src/schemas/notificationSchemas.js`  
**Seguir padrão de:** `src/schemas/transactionSchemas.js`

Schemas de validação:
→ `queryNotificacoesSchema`:
  - `lida`: boolean().optional()
  - `limite`: number().int().min(1).max(50).optional().default(10)
  - `pagina`: number().int().min(1).optional().default(1)

---

## 🛣️ Rotas

### budgetRoutes.js (NOVO — CRIAR)

**Criar em:** `src/routes/budgetRoutes.js`  
**Registrar em:** `src/routes/index.js` (adicionar linha: `app.use('/api/orcamentos', budgetRoutes)`)

Rotas (todas 🔒 requerem autenticação):
* GET `/` → `budgetController.listarOrcamentos` (validateMiddleware com `queryMesSchema`)
* GET `/status` → `budgetController.obterStatusOrcamento` (validateMiddleware com `queryMesSchema`)
* POST `/` → `budgetController.salvarOrcamentos` (validateMiddleware com `salvarOrcamentosSchema`)
* DELETE `/:id` → `budgetController.removerOrcamento`
* POST `/copiar` → `budgetController.copiarOrcamento` (validateMiddleware com `copiarOrcamentoSchema`)

---

### notificationRoutes.js (NOVO — CRIAR)

**Criar em:** `src/routes/notificationRoutes.js`  
**Registrar em:** `src/routes/index.js` (adicionar linha: `app.use('/api/notificacoes', notificationRoutes)`)

Rotas (todas 🔒 requerem autenticação):
* GET `/` → `notificationController.listar` (validateMiddleware com `queryNotificacoesSchema`)
* GET `/contador` → `notificationController.contarNaoLidas` (retorna `{ quantidade: 5 }`)
* PATCH `/:id/marcar-lida` → `notificationController.marcarComoLida`
* PATCH `/marcar-todas-lidas` → `notificationController.marcarTodasLidas`

---

### notificationController.js (NOVO — CRIAR)

**Criar em:** `src/controllers/notificationController.js`  
**Seguir padrão de:** `src/controllers/transactionController.js`

Métodos:
* `listar()` → GET /api/notificacoes
* `contarNaoLidas()` → GET /api/notificacoes/contador
* `marcarComoLida()` → PATCH /api/notificacoes/:id/marcar-lida
* `marcarTodasLidas()` → PATCH /api/notificacoes/marcar-todas-lidas

---

## ⚙️ Jobs

### budgetAlertJob.js (NOVO — CRIAR)

**Criar em:** `src/jobs/budgetAlertJob.js`  
**Seguir padrão de:** `src/jobs/recurringTransactions.js`

Implementação:
→ Usar `node-cron` (já presente no projeto)
→ Agendar job para rodar de hora em hora: `cron.schedule('0 * * * *', runBudgetAlertJob)`
→ Função `runBudgetAlertJob()`:
  - Chama `budgetService.verificarLimitesENotificar()`
  - Loga resultado (quantidade de notificações criadas)
  - Trata erros com `logger.error()`

→ Iniciar job em `src/server.js` (importar e chamar junto com os outros jobs)

---

## 🚫 Regras de Negócio

* Orçamento é único por **usuário + categoria + mês** (constraint UNIQUE no banco)
* Limite deve ser **maior que zero**
* Usuário só pode gerenciar orçamentos de **suas próprias categorias**
* Copiar orçamento só funciona se **mês de destino estiver vazio**
* Notificações de orçamento são criadas **apenas uma vez** por tipo/categoria/mês (evitar duplicatas)
* Job de verificação de limites roda **de hora em hora** e não envia notificações duplicadas
* Notificações são **persistentes** — ficam no banco mesmo após toast ser fechado
* Contador do sininho mostra apenas notificações **não lidas**
* Usuário pode marcar notificações como lidas individualmente ou todas de uma vez

---

# [STORY FRONTEND] Orçamento Mensal — Frontend

Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend
Relator:     (preencher)
Pai:         [EPIC] Orçamento Mensal
Data Limite: (preencher)

## 📝 Descrição

**Como usuário**, eu quero **visualizar e gerenciar meu orçamento mensal**, **acompanhar quanto já gastei de cada categoria**, e **receber notificações visuais** quando atingir 80% ou estourar 100% do limite, para que eu tenha **controle proativo dos meus gastos** e possa ajustar meu comportamento financeiro antes de comprometer minhas metas.

---

## ✅ Critérios de Aceite

### Cenário 1 — Carregar Página de Orçamento Mensal
**Dado** que o usuário está autenticado e acessa `/budget`,
**Quando** a página carrega,
**Então**:
* Exibe título "Orçamento Mensal"
* Exibe seletor de mês (dropdown) com mês corrente selecionado por padrão
* Exibe botão "Editar Limites" (abre modal de edição)
* Exibe seção "Visão Geral do Orçamento" com 3 cards:
  - **Card 1:** Total do orçamento (soma de todos os limites)
  - **Card 2:** Total já gasto (soma de despesas do mês)
  - **Card 3:** Restante disponível (orçamento - gasto)
* Exibe barra de progresso geral (% do orçamento utilizado)
* Exibe seção "Orçamento por Categoria" com lista de categorias ordenadas por % de uso (maior primeiro)
* Exibe seção "Categorias sem Orçamento Definido" (colapsável) com lista de categorias sem limite + botão "Definir limite"
* Spinner de carregamento enquanto busca dados
* Mensagem de estado vazio: "Você ainda não definiu limites de orçamento. Clique em 'Editar Limites' para começar."

---

### Cenário 2 — Visualizar Status de Categoria Normal (<80%)
**Dado** que a categoria "Transporte" tem limite R$ 200,00 e gasto R$ 95,00 (47%),
**Quando** a página exibe essa categoria,
**Então**:
* Mostra ícone da categoria (ex: 🚗)
* Mostra nome: "Transporte"
* Mostra valores: "R$ 95,00 / R$ 200,00"
* Mostra percentual: "47%"
* Barra de progresso em **verde** (47% preenchido)
* **NÃO** exibe badge de alerta

---

### Cenário 3 — Visualizar Status de Categoria em Alerta (80-100%)
**Dado** que a categoria "Alimentação" tem limite R$ 400,00 e gasto R$ 320,00 (80%),
**Quando** a página exibe essa categoria,
**Então**:
* Barra de progresso em **amarelo** (80% preenchido)
* Exibe badge "🔔 80%" (cor amarela, ícone de sino)
* Tooltip ao hover: "Você atingiu 80% do limite desta categoria"

---

### Cenário 4 — Visualizar Status de Categoria Estourada (>100%)
**Dado** que a categoria "Lazer" tem limite R$ 150,00 e gasto R$ 180,00 (120%),
**Quando** a página exibe essa categoria,
**Então**:
* Mostra valores: "R$ 180,00 / R$ 150,00"
* Mostra percentual: "120%"
* Barra de progresso em **vermelho** (100% preenchido, overflow visual)
* Exibe badge "⚠️ Estourou!" (cor vermelha)
* Destaque visual (ex: borda vermelha ou background levemente vermelho)

---

### Cenário 5 — Abrir Modal de Edição de Limites
**Dado** que o usuário clica em "Editar Limites",
**Quando** o modal abre,
**Então**:
* Exibe título: "Editar Limites de Orçamento"
* Exibe info box: "ℹ️ Defina quanto pretende gastar no máximo por categoria este mês. Você será alertado ao atingir **80%** do limite."
* Exibe lista de categorias com limite definido:
  - Cada linha: [Ícone] [Nome] [Input R$] [Botão X remover]
  - Inputs preenchidos com valores atuais
* Exibe seção "Adicionar Categoria":
  - Select com categorias sem limite
  - Input de valor
  - Botão "+ Adicionar"
* Exibe resumo do orçamento:
  - Orçamento total definido (soma dos inputs)
  - Sua renda mensal (vem de `ConfiguracaoUsuario.rendaMensalPlanejada`)
  - Sobra planejada (renda - orçamento)
  - Validação visual:
    - ✅ "Ótimo! Seu orçamento está dentro da sua renda." (se orçamento <= renda)
    - ⚠️ "Atenção: seu orçamento está acima da sua renda mensal." (se orçamento > renda)
* Exibe botões: "Cancelar" (fecha modal) | "Salvar Limites" (salva e recarrega dados)

---

### Cenário 6 — Salvar Limites de Orçamento
**Dado** que o usuário editou valores no modal e clica em "Salvar Limites",
**Quando** a requisição `POST /api/orcamentos` é enviada,
**Então**:
* Exibe spinner no botão "Salvando..."
* Se sucesso (200):
  - Fecha modal
  - Exibe toast de sucesso: "✅ Limites de orçamento salvos com sucesso!"
  - Recarrega dados da página (chama `GET /api/orcamentos/status` novamente)
* Se erro (400, 403, 500):
  - Exibe toast de erro: "❌ Erro ao salvar limites: [mensagem do backend]"
  - Mantém modal aberto

---

### Cenário 7 — Remover Categoria do Orçamento
**Dado** que o usuário clica no botão "X" ao lado de uma categoria no modal,
**Quando** a categoria é removida,
**Então**:
* Remove a linha da categoria da lista
* Recalcula o resumo do orçamento (diminui o total)
* Ao salvar, envia apenas as categorias restantes (backend não recebe a removida, então é deletada)

---

### Cenário 8 — Adicionar Categoria ao Orçamento
**Dado** que o usuário seleciona uma categoria sem limite no select e digita um valor,
**Quando** clica em "+ Adicionar",
**Então**:
* Adiciona a categoria à lista de limites (acima)
* Limpa o select e input
* Recalcula o resumo do orçamento

---

### Cenário 9 — Mudar Mês no Seletor
**Dado** que o usuário está visualizando o orçamento de Maio/2026,
**Quando** seleciona Abril/2026 no dropdown,
**Então**:
* Recarrega dados do orçamento de Abril (`GET /api/orcamentos/status?mes=2026-04`)
* Atualiza todos os cards, barras de progresso, e categorias
* Se Abril não tem orçamento definido: exibe mensagem de estado vazio

---

### Cenário 10 — Copiar Orçamento do Mês Anterior
**Dado** que o usuário está no orçamento de Maio/2026 (vazio),
**Quando** clica em "Copiar do Mês Anterior",
**Então**:
* Envia `POST /api/orcamentos/copiar { mesOrigem: "2026-04-01", mesDestino: "2026-05-01" }`
* Se sucesso (200):
  - Exibe toast: "✅ Orçamento de Abril copiado para Maio com sucesso!"
  - Recarrega dados da página
* Se erro (404 — mês anterior sem orçamento):
  - Exibe toast: "ℹ️ Nenhum orçamento encontrado em Abril. Crie um novo."
* Se erro (409 — mês destino já tem orçamento):
  - Exibe toast: "⚠️ Maio já possui orçamentos. Edite-os ou remova antes de copiar."

---

### Cenário 11 — Sininho de Notificações na Navbar (Desktop)
**Dado** que o usuário está autenticado e possui 3 notificações não lidas,
**Quando** a navbar é renderizada,
**Então**:
* Exibe ícone de sino (`Bell` do Lucide) no canto superior direito
* Exibe badge com número "3" (cor primária, pequeno círculo vermelho)
* Hover no sino: tooltip "Notificações"
* Click no sino: abre dropdown de notificações

---

### Cenário 12 — Dropdown de Notificações (Lista)
**Dado** que o usuário clicou no sininho,
**Quando** o dropdown abre,
**Então**:
* Exibe header: "Notificações" | Link "Marcar todas como lidas" (à direita)
* Exibe lista de notificações (últimas 10):
  - Cada notificação:
    - Ícone (baseado no tipo: `AlertTriangle` para ALERTA_ORCAMENTO, `AlarmClock` para ORCAMENTO_ESTOURADO)
    - Título em negrito (ex: "Orçamento de Alimentação atingiu 80%")
    - Mensagem (ex: "Você gastou R$ 320,00 de R$ 400,00 planejados.")
    - Timestamp relativo (ex: "Há 2 horas", "Ontem")
    - Indicador de não lida (bolinha azul à direita)
  - Hover: background levemente cinza
  - Click: marca como lida + redireciona para `/budget` (se `linkAcao` presente)
* Exibe footer: Link "Ver todas" (redireciona para página de notificações — futura)
* Se nenhuma notificação: exibe "🔕 Nenhuma notificação nova"

---

### Cenário 13 — Marcar Notificação como Lida
**Dado** que o usuário clica em uma notificação não lida,
**Quando** a notificação é marcada,
**Então**:
* Envia `PATCH /api/notificacoes/:id/marcar-lida`
* Remove a bolinha azul (indicador de não lida)
* Decrementa o contador do badge (-1)
* Fecha o dropdown
* Redireciona para `/budget` (ou link especificado em `linkAcao`)

---

### Cenário 14 — Marcar Todas como Lidas
**Dado** que o usuário clica em "Marcar todas como lidas" no header do dropdown,
**Quando** a requisição é enviada,
**Então**:
* Envia `PATCH /api/notificacoes/marcar-todas-lidas`
* Remove todas as bolinhas azuis
* Zera o contador do badge
* Exibe toast: "✅ Todas as notificações foram marcadas como lidas"

---

### Cenário 15 — Toast Automático ao Atingir 80% do Limite (Simulação)
**Dado** que o sistema criou uma notificação de `ALERTA_ORCAMENTO` (via job ou após salvar transação),
**Quando** o frontend detecta nova notificação (via polling ou websocket — simplificado: ao recarregar),
**Então**:
* Exibe toast **warning**: "⚠️ Você atingiu 80% do limite de Alimentação (R$ 320,00 / R$ 400,00)"
* Toast some após 5 segundos
* Notificação permanece no sininho

---

## 🎨 Visual e UX

### Página de Orçamento
- **Layout:** Centralizado, max-width 1200px
- **Header:** Título + selector de mês (à direita) + botão "Editar Limites"
- **Visão Geral:** 3 cards lado a lado (desktop) ou empilhados (mobile)
- **Barra de Progresso Geral:** Largura total, altura 24px, cores: verde (<80%), amarelo (80-100%), vermelho (>100%)
- **Categoria (item da lista):**
  - Grid: `[Ícone 48px] [Nome | R$ X / R$ Y | %] [Barra de Progresso] [Badge]`
  - Barra: altura 16px, bordas arredondadas, cores dinâmicas
  - Badge: pequeno, arredondado, ícone + texto
- **Responsividade:** Mobile stack vertical, desktop grid 2 colunas

### Modal de Edição
- **Largura:** 600px (desktop), 90vw (mobile)
- **Altura:** Auto, max-height 80vh, scroll interno
- **Layout:** Vertical, seções separadas por dividers
- **Inputs:** Format de moeda (R$), validação em tempo real
- **Resumo:** Card destacado com bordas, background levemente colorido (verde se ok, amarelo se alerta)

### Sininho e Dropdown
- **Sininho:** 24x24px, posicionado no canto superior direito da navbar (ao lado do avatar/tema)
- **Badge:** 16x16px, círculo vermelho com número branco, posição absoluta no canto superior direito do sino
- **Dropdown:** 360px largura, max-height 480px, sombra elevada, scroll interno
- **Notificação (item):** Padding 12px, hover background, cursor pointer, borda inferior sutil
- **Ícones de tipo:** 20x20px, cor dinâmica (amarelo para alerta, vermelho para estourado)
- **Timestamp:** Texto pequeno (12px), cor cinza

---

## ⚙️ Integração Técnica

### Hooks (TanStack Query)

#### useBudgetQueries.js (NOVO — CRIAR)

**Criar em:** `src/hooks/useBudgetQueries.js`  
**Seguir padrão de:** hooks de dados com TanStack Query (se implementado no projeto) ou custom hooks com useState + useEffect

Hooks:
→ `useBudgetStatus(mesReferencia)`:
  - Chama `GET /api/orcamentos/status?mes={mes}`
  - Retorna: `{ data, isLoading, isError, refetch }`

→ `useBudgetList(mesReferencia)`:
  - Chama `GET /api/orcamentos?mes={mes}`
  - Retorna: `{ data, isLoading, isError }`

→ `useSaveBudget()`:
  - Mutation para `POST /api/orcamentos`
  - Retorna: `{ mutate, isLoading }`

→ `useCopyBudget()`:
  - Mutation para `POST /api/orcamentos/copiar`
  - Retorna: `{ mutate, isLoading }`

→ `useDeleteBudget()`:
  - Mutation para `DELETE /api/orcamentos/:id`
  - Retorna: `{ mutate, isLoading }`

---

#### useNotifications.js (NOVO — CRIAR)

**Criar em:** `src/hooks/useNotifications.js`  
**Seguir padrão de:** hooks de dados do projeto

Hooks:
→ `useNotificationList(filtros)`:
  - Chama `GET /api/notificacoes?lida=false&limite=10`
  - Polling opcional (refetch a cada 30 segundos)
  - Retorna: `{ data, isLoading, refetch }`

→ `useNotificationCount()`:
  - Chama `GET /api/notificacoes/contador`
  - Retorna: `{ data: { quantidade }, isLoading, refetch }`

→ `useMarkAsRead()`:
  - Mutation para `PATCH /api/notificacoes/:id/marcar-lida`
  - Retorna: `{ mutate, isLoading }`

→ `useMarkAllAsRead()`:
  - Mutation para `PATCH /api/notificacoes/marcar-todas-lidas`
  - Retorna: `{ mutate, isLoading }`

---

### Componentes

#### BudgetPage/ (NOVO — CRIAR)

**Criar em:** `src/pages/BudgetPage.jsx`  
**Seguir padrão de:** `src/pages/TransactionsPage.jsx`

Estrutura:
→ Estado: `mesAtual` (default: mês corrente), `modalAberto`
→ Hook: `useBudgetStatus(mesAtual)`
→ Renderiza:
  - Header (título + selector de mês + botão "Editar Limites")
  - `BudgetSummaryCards` (visão geral)
  - `BudgetCategoryList` (lista de categorias com barras)
  - `BudgetCategoriesWithoutLimit` (lista colapsável)
  - `BudgetEditModal` (modal de edição, aberto condicionalmente)
  - Estados: loading, empty, error

---

#### BudgetSummaryCards/ (NOVO — CRIAR)

**Criar em:** `src/components/features/budget/BudgetSummaryCards.jsx`  
**Seguir padrão de:** `src/components/features/transactions/TransactionSummaryCards.jsx`

Props: `{ orcamentoTotal, gastoTotal, restanteTotal, percentualUsado }`

Renderiza: 3 cards (total orçamento, total gasto, restante) + barra de progresso geral

---

#### BudgetCategoryList/ (NOVO — CRIAR)

**Criar em:** `src/components/features/budget/BudgetCategoryList.jsx`  
**Seguir padrão de:** lista de itens com design do projeto

Props: `{ categorias }` (array de objetos com categoriaId, nome, ícone, cor, limiteValor, gastoValor, percentualUsado, status)

Renderiza: Lista de `BudgetCategoryItem`

---

#### BudgetCategoryItem/ (NOVO — CRIAR)

**Criar em:** `src/components/features/budget/BudgetCategoryItem.jsx`

Props: `{ categoria }`

Renderiza:
- Ícone (usando `PulsoBadge` ou ícone Lucide)
- Nome e valores
- Barra de progresso (usando `ProgressBar` do design-system ou custom)
- Badge de status (se >= 80%)

---

#### BudgetEditModal/ (NOVO — CRIAR)

**Criar em:** `src/components/features/budget/BudgetEditModal.jsx`  
**Seguir padrão de:** `src/components/features/transactions/TransactionFormModal.jsx`

Props: `{ aberto, onFechar, mesReferencia, orcamentos, rendaMensal, onSalvar }`

Estado:
- `limites` (array de { categoriaId, limiteValor })
- `categoriaAdicionarSelecionada`
- `valorAdicionar`

Renderiza:
- Lista de inputs de valor por categoria
- Seção "Adicionar Categoria"
- Resumo do orçamento (calculado em tempo real)
- Botões de ação

Ao salvar:
- Chama `onSalvar(limites)`
- Fecha modal após sucesso

---

#### BudgetCategoriesWithoutLimit/ (NOVO — CRIAR)

**Criar em:** `src/components/features/budget/BudgetCategoriesWithoutLimit.jsx`

Props: `{ categorias, onDefinirLimite }`

Renderiza: Seção colapsável (Accordion) com lista de categorias sem limite + botão "Definir limite"

Click em "Definir limite": chama `onDefinirLimite(categoriaId)` → abre modal de edição com essa categoria pré-selecionada

---

#### NotificationBell/ (NOVO — CRIAR)

**Criar em:** `src/components/layouts/NotificationBell/NotificationBell.jsx`  
**Seguir padrão de:** componentes de navegação do projeto

Estrutura:
→ Usa hook `useNotificationCount()` para exibir badge
→ Estado: `dropdownAberto`
→ Renderiza:
  - Ícone `Bell` com badge (se count > 0)
  - Dropdown `NotificationDropdown` (aberto condicionalmente)
→ Click outside: fecha dropdown

---

#### NotificationDropdown/ (NOVO — CRIAR)

**Criar em:** `src/components/layouts/NotificationBell/NotificationDropdown.jsx`

Props: `{ aberto, onFechar }`

Estrutura:
→ Usa hook `useNotificationList({ lida: false, limite: 10 })`
→ Renderiza:
  - Header (título + link "Marcar todas como lidas")
  - Lista de `NotificationItem`
  - Footer (link "Ver todas")
  - Estado vazio

---

#### NotificationItem/ (NOVO — CRIAR)

**Criar em:** `src/components/layouts/NotificationBell/NotificationItem.jsx`

Props: `{ notificacao, onMarcarLida }`

Renderiza:
- Ícone (baseado em `notificacao.tipo`)
- Título e mensagem
- Timestamp relativo (usar `date-fns` — `formatDistanceToNow()`)
- Indicador de não lida (bolinha azul)

Click: chama `onMarcarLida(notificacao.id)` + redireciona

---

### Services

#### budgetService.js (NOVO — CRIAR)

**Criar em:** `src/services/budgetService.js`  
**Seguir padrão de:** `src/services/transactionService.js`

Métodos (wrapper de API):
→ `obterStatusOrcamento(mes)` → GET /api/orcamentos/status?mes={mes}
→ `listarOrcamentos(mes)` → GET /api/orcamentos?mes={mes}
→ `salvarOrcamentos(mesReferencia, limites)` → POST /api/orcamentos { mesReferencia, limites }
→ `removerOrcamento(id)` → DELETE /api/orcamentos/:id
→ `copiarOrcamento(mesOrigem, mesDestino)` → POST /api/orcamentos/copiar { mesOrigem, mesDestino }

---

#### notificationService.js (NOVO — CRIAR)

**Criar em:** `src/services/notificationService.js`  
**Seguir padrão de:** `src/services/transactionService.js`

Métodos:
→ `listarNotificacoes(filtros)` → GET /api/notificacoes?lida={lida}&limite={limite}
→ `contarNaoLidas()` → GET /api/notificacoes/contador
→ `marcarComoLida(id)` → PATCH /api/notificacoes/:id/marcar-lida
→ `marcarTodasLidas()` → PATCH /api/notificacoes/marcar-todas-lidas

---

### Endpoints Consumidos

#### Orçamento
- `GET /api/orcamentos?mes=2026-05` — listar orçamentos do mês
- `GET /api/orcamentos/status?mes=2026-05` — obter resumo + status por categoria
- `POST /api/orcamentos` — salvar limites (upsert batch)
- `DELETE /api/orcamentos/:id` — remover limite de categoria
- `POST /api/orcamentos/copiar` — copiar orçamento de um mês para outro

#### Notificações
- `GET /api/notificacoes?lida=false&limite=10` — listar notificações não lidas
- `GET /api/notificacoes/contador` — contar notificações não lidas (badge)
- `PATCH /api/notificacoes/:id/marcar-lida` — marcar uma notificação como lida
- `PATCH /api/notificacoes/marcar-todas-lidas` — marcar todas as notificações como lidas

---

## 🚫 Regras de Negócio

* Orçamento é mensal — usuário pode visualizar e editar orçamentos de meses passados, mas o sistema calcula gasto apenas de transações do mês correspondente
* Usuário pode escolher quais categorias quer monitorar — orçamento é **opcional** por categoria
* Percentual de uso é calculado como: `(gasto / limite) * 100`
* Status da categoria:
  - **Normal:** < 80% (barra verde)
  - **Alerta:** >= 80% e < 100% (barra amarela + badge 🔔)
  - **Estourado:** >= 100% (barra vermelha + badge ⚠️)
* Sistema valida se orçamento total > renda mensal (alerta visual, mas permite salvar)
* Notificações são criadas automaticamente pelo job horário (backend)
* Toast de notificação aparece apenas quando notificação é criada (não ao abrir a página)
* Contador do sininho mostra apenas notificações **não lidas**
* Dropdown de notificações exibe últimas 10 não lidas por padrão

---

## 🛠️ Refinamento

* **Estado Global:** Considerar Redux ou Zustand para armazenar contador de notificações (evitar refetch constante)
* **Validação:** Zod para validação de formulário de edição de limites (client-side)
* **Toasts:** Usar sistema de toast do design-system (`useToast()`)
* **Responsividade:** Mobile-first, breakpoints: 640px (sm), 768px (md), 1024px (lg)
* **Acessibilidade:** ARIA labels em botões de ícone, navegação por teclado no dropdown de notificações
* **Performance:** Polling de notificações a cada 30 segundos (ou websocket no futuro)
* **UX:** Animações suaves ao abrir/fechar modal e dropdown (CSS transitions)
* **Integração futura:** Página dedicada de notificações (`/notifications`) com lista completa e filtros

---

## 🎉 Cards Prontas para Uso!

Todas as decisões foram definidas:
- ✅ **Renda mensal planejada**: campo separado de `valorSalario`
- ✅ **Job de verificação**: roda **de hora em hora** (cron: `0 * * * *`)
- ✅ **Dropdown de notificações**: últimas 10 não lidas

**As cards estão prontas para serem copiadas para o board do projeto! 🚀**

---

**FIM DO README**
