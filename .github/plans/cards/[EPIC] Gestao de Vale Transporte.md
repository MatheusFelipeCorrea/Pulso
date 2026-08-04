# [EPIC] Gestão de Vale Transporte

> **Status (ago/2026):** ✅ Entregue (jun/2026) · revisado auditoria PO M08  
> **Correções PO:** decisão B (CLT vende VT com aviso), transações Serializable em venda/uso, remoção RF-064/065 (intervalo entre vendas)  
> **Refs:** RF-059–063, RF-066 · [PO M08](../../Documentacao/03-Auditorias/Product%20Owner/08-Vale-Transporte.md) · [META Auditoria](./[META]%20Auditoria%20PO%202026-08.md)

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Vale Transporte, Frontend, Backend, Banco de Dados  
**Relator:**     —  
**Pai:**         —  
**Data Limite:** —

---

## 📋 Descrição do Epic

Módulo completo de **gestão de Vale Transporte (VT)** para Estagiários, CLT e PJ com opt-in: acompanhar saldo mensal (recebido − usado − vendido nominal), registrar usos de passagens, registrar vendas de VT excedente com cálculo de diferença nominal/recebido, consultar históricos paginados e countdown até a próxima recarga mensal.

### 🎯 Objetivos do Epic

- ✅ Saldo VT mensal com 4 métricas + card de próxima recarga (RN-044)
- ✅ Registrar uso de passagens (quantidade × valor unitário) com valor padrão opcional
- ✅ Registrar venda de VT (comprador, data, nominal, recebido) + receita DINHEIRO automática (RN-041)
- ✅ Histórico de vendas e usos com filtro por período, totais e paginação
- ✅ Diferença nominal vs. recebido (perda/ganho) em venda e totais do período (RF-063)
- ✅ CLT pode vender com aviso explícito — decisão de produto B (RN-013/040/045)
- ✅ PJ opt-in (`vtHabilitado`); Pessoa Física sem acesso à rota
- ✅ Integridade de saldo com transações Serializable (RNF-NOVO-H1)

### 🎭 Telas e Fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/transport-voucher` | Vale Transporte | Cards saldo, ações registrar uso/venda, tabs histórico |
| — | Opt-in PJ (`VtOptInScreen`) | "Você recebe VT?" → habilita ou oculta menu |
| — | VT desabilitado (`VtDisabledScreen`) | PJ que optou "Não recebo" — reabilitar |
| Modal | Registrar venda | Comprador, data, nominal, recebido, preview diferença/saldo |
| Modal | Registrar uso | Stepper passagens, valor unitário, data, salvar padrão |

**Comportamento por modo de uso:**

| Modo | Sidebar | Saldo/usos/vendas | Venda VT |
|------|---------|-------------------|----------|
| Estagiário | ✅ Visível | ✅ Completo | ✅ Sem restrição |
| CLT | ✅ Visível | ✅ Completo | ✅ Com `warning` no payload + toast |
| PJ | ✅ Se `vtHabilitado !== false` | ✅ Se habilitado | ✅ Se habilitado |
| Pessoa Física | ❌ Oculto | ❌ Redirect `/dashboard` | ❌ |

---

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Transações | `recebido` = soma RECEITA recurso `VT` no período; venda cria RECEITA `DINHEIRO` categoria Outros |
| Configurações | `valorVt`, `diaVt`, `valorPadraoPassagem`, `vtHabilitado`, `modoUso` em `ConfiguracaoUsuario` |
| Recebimentos fixos | `fixedIncomeUtils.obterRecebimentosFixosConfig` inclui VT quando perfil permite |
| Categorias | `categoryRepository.buscarPorNome('Outros', 'RECEITA')` na venda |
| Regras recurso | `recursoCategoriaRules` — VT só em despesas Transporte (RN-038/039) |
| Navegação | `filterSidebarNavForUser` oculta item VT conforme modo/opt-in |
| Auth | JWT em `authMiddleware`; `vtHabilitado` exposto no login via `authService` |

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Database | ✅ | `schema.prisma` (`VendaVt`, `UsoVt`, campos VT em `ConfiguracaoUsuario`), migration `20260613120000_remove_vt_venda_interval` |
| Backend | ✅ | `transportRoutes.js`, `transportController.js`, `transportService.js`, `transportRepository.js`, `transportSchemas.js` |
| Utils API | ✅ | `periodUtils.js` (`calcularProximaRecarga`), `fixedIncomeUtils.js`, `recursoCategoriaRules.js` |
| Frontend | ✅ | `TransportVoucherPage.jsx`, 9 componentes em `components/features/transport/`, `transportService.js`, `transportUtils.js`, `styles/transport.css` |
| Testes API | ✅ | `api/tests/unit/services/transportService.test.js` |
| Testes Web | ✅ | `web/tests/unit/services/transportService.test.js`, `web/tests/unit/utils/transportUtils.test.js` |
| Seed | ✅ | `prisma/seed.js` — receitas VT mensais, usos/vendas demo |

**Registro rotas:** `Codigo/Pulso/api/src/routes/index.js` → `router.use('/transporte', transportRoutes)`  
**Base URL API:** `/api/transporte`

---

## 🔧 Correções pós-auditoria PO (ago/2026)

| ID | Correção | Onde |
|----|----------|------|
| RF-NOVO-H1 | Decisão **B**: CLT pode vender VT com aviso — RNs 013/040/045 reescritas | `transportService.js` (`MSG_CLT_WARNING`), docs requisitos |
| RNF-NOVO-H1 | Transações `Serializable` em venda/uso — elimina saldo negativo por concorrência | `transportRepository.js` (`criarVendaComTransacao`, `criarUsoVtAtomico`) |
| RF-064/065 | Removidos — sem intervalo mínimo entre vendas; múltiplas vendas no mês permitidas | migration `20260613120000_remove_vt_venda_interval`, frontend sem countdown de venda |
| UX-CLT | Toast `warning` após venda CLT no frontend | `TransportVoucherPage.jsx:207-208` |

---

## ⏳ Pendências

- [ ] Testes E2E / componente da página `TransportVoucherPage` (só unitários de service/utils hoje)
- [ ] `VtBlockedScreen.jsx` existe mas não está referenciado — consolidar ou remover
- [ ] RF-059 parcialmente via recebimentos fixos/config — UI dedicada para editar `valorVt`/`diaVt` na tela VT (hoje via onboarding/config geral)
- [ ] React Query hooks (padrão do projeto usa `transportService` + `useState` + `useCallback`)

---

## 🚀 Critérios de Aceite Gerais (Epic)

→ Usuário Estagiário/CLT ou PJ habilitado vê saldo VT do mês (recebido, usado, vendido nominal, restante)  
→ Saldo = recebido − usado − vendido nominal (RN-044)  
→ Usuário registra uso com quantidade ≥ 1; saldo insuficiente retorna 400  
→ Usuário registra venda; cria receita DINHEIRO; diferença calculada; múltiplas vendas no mês OK  
→ CLT recebe aviso na resposta e toast no frontend ao vender  
→ PJ sem opt-in vê tela de pergunta; PJ opt-out não vê item no menu  
→ Históricos filtráveis por `YYYY-MM` com totais e paginação  
→ Venda/uso atômicos — saldo validado dentro de transação Serializable  

---

# [STORY DATABASE] Gestão de Vale Transporte — Banco de Dados

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Gestão de Vale Transporte

---

## 📝 Descrição

**Como sistema**, quero persistir vendas e usos de VT e campos de configuração relacionados, para calcular saldo mensal, históricos e preferências de perfil PJ.

---

## 🗄️ Modelo Prisma (resumo)

**Arquivo:** `Codigo/Pulso/api/prisma/schema.prisma`

### `VendaVt` → tabela `vendas_vt`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | String @id cuid | PK |
| `usuarioId` | String | FK → `usuarios`, CASCADE |
| `nomeComprador` | VarChar(120) | |
| `dataVenda` | DateTime | |
| `valorNominal` | Decimal(12,2) | Descontado do saldo VT |
| `valorRecebido` | Decimal(12,2) | Entra como receita DINHEIRO |
| `criadoEm` | DateTime | |

**Índice:** `[usuarioId, dataVenda DESC]`

### `UsoVt` → tabela `usos_vt`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | String @id cuid | PK |
| `usuarioId` | String | FK → `usuarios`, CASCADE |
| `quantidade` | Int | Passagens |
| `valorPorPassagem` | Decimal(10,2) | |
| `data` | DateTime | |
| `criadoEm` | DateTime | |

**Índice:** `[usuarioId, data DESC]`

### Campos VT em `ConfiguracaoUsuario`

| Campo | Map | Uso |
|-------|-----|-----|
| `valorVt` | `valor_vt` | Valor mensal configurado (RF-059 via recebimentos fixos) |
| `diaVt` | `dia_vt` | Dia de recarga |
| `valorPadraoPassagem` | `valor_padrao_passagem` | Default no modal de uso |
| `vtHabilitado` | `vt_habilitado` | Opt-in PJ (`null` = pendente, `true`/`false`) |

---

## 🗄️ SQL relevante

**Migration:** `Codigo/Pulso/api/prisma/migrations/20260613120000_remove_vt_venda_interval/migration.sql`

```sql
-- RF-064/065 removidos: sem intervalo entre vendas

ALTER TABLE "configuracoes_usuario" DROP COLUMN IF EXISTS "dias_intervalo_venda_vt";
ALTER TABLE "vendas_vt" DROP COLUMN IF EXISTS "proxima_data_venda";
```

---

## ✅ Critérios de Aceite (Database)

→ Tabelas `vendas_vt` e `usos_vt` com FK cascade para `usuarios`  
→ Índices por usuário + data (venda/uso) para listagens DESC  
→ Campos `valor_padrao_passagem` e `vt_habilitado` em `configuracoes_usuario`  
→ Colunas legadas de intervalo de venda removidas  

---

# [STORY BACKEND] Gestão de Vale Transporte — Backend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Backend  
**Pai:**         [EPIC] Gestão de Vale Transporte

---

## 📝 Descrição

**Como sistema backend**, quero API REST para saldo, vendas, usos e preferência VT de PJ, com validação de modo de uso, saldo e integridade transacional.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Obter saldo VT
**Dado** usuário Estagiário/CLT ou PJ com VT habilitado,  
**Quando** `GET /api/transporte/saldo?periodo=2026-05`,  
**Então** retorna `200` com `{ recebido, usado, passagensUsadas, vendidoNominal, saldoRestante, valorPadraoPassagem, proximaRecarga }`.  
* `saldoRestante` = recebido − usado − vendidoNominal (RN-044)  
* PJ sem VT habilitado → `403` com `MSG_BLOQUEIO_PJ`

### Cenário 2 — Registrar venda (Estagiário)
**Dado** saldo VT R$ 172,00,  
**Quando** `POST /api/transporte/vendas` com `{ nomeComprador, dataVenda, valorNominal, valorRecebido }`,  
**Então** retorna `201` com venda, `diferenca`, `novoSaldoVt`; cria `VendaVt` + transação RECEITA DINHEIRO (RN-041).  
* Saldo insuficiente → `400` "Saldo insuficiente. Você tem apenas R$ X,XX disponível."  
* Múltiplas vendas no mesmo mês permitidas

### Cenário 3 — Registrar venda (CLT com aviso)
**Dado** usuário CLT,  
**Quando** `POST /api/transporte/vendas`,  
**Então** retorna `201` com campo `warning` (`MSG_CLT_WARNING` reforçada).

### Cenário 4 — Registrar uso
**Quando** `POST /api/transporte/usos` com `{ quantidade, valorPorPassagem, data, salvarValorPadrao }`,  
**Então** retorna `201` com `{ id, totalUsado, novoSaldoVt }`; opcionalmente atualiza `valorPadraoPassagem`.  
* `quantidade` < 1 → `400`  
* Saldo insuficiente → `400`

### Cenário 5 — Listar vendas
**Quando** `GET /api/transporte/vendas?periodo=2026-04&pagina=1&limite=10`,  
**Então** retorna `{ vendas[], totais: { totalNominal, totalRecebido, perdaTotal }, paginacao }`.  
* `diferenca` por linha = recebido − nominal (RF-063)

### Cenário 6 — Listar usos
**Quando** `GET /api/transporte/usos?periodo=2026-05&pagina=1&limite=10`,  
**Então** retorna `{ usos[], totais: { totalPassagens, totalGasto }, paginacao }`.

### Cenário 7 — Opt-in PJ
**Quando** `PATCH /api/transporte/vt-habilitado` com `{ vtHabilitado: true }`,  
**Então** retorna `200` `{ vtHabilitado }`.  
* Usuário não-PJ → `400`

### Cenário 8 — Concorrência de saldo
**Dado** duas requisições paralelas de venda/uso,  
**Quando** saldo só cobre uma operação,  
**Então** uma succeeds e a outra retorna `400` — sem saldo negativo (Serializable).

---

## 🛠️ Implementação (o que foi feito)

### transportController.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/controllers/transportController.js`

* `obterSaldoVt()` → `GET /saldo`
* `registrarVendaVt()` → `POST /vendas` — `201`
* `listarVendas()` → `GET /vendas`
* `registrarUsoVt()` → `POST /usos` — `201`
* `listarUsos()` → `GET /usos`
* `atualizarVtHabilitado()` → `PATCH /vt-habilitado`

---

### transportService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/services/transportService.js`

→ `obterSaldoVt(usuarioId, periodo)` — agrega recebido/usado/vendido, `calcularProximaRecarga`  
→ `registrarVendaVt(usuarioId, dados)` — valida modo, data, saldo transacional, warning CLT  
→ `listarVendas(usuarioId, { periodo, pagina, limite })` — totais do período completo  
→ `registrarUsoVt(usuarioId, dados)` — uso atômico + valor padrão opcional  
→ `listarUsos(usuarioId, { periodo, pagina, limite })`  
→ `atualizarVtHabilitado(usuarioId, vtHabilitado)` — só PJ  

**Helpers:** `podeUsarVt`, `assertModoPermitido`, `mapVenda`, `assertSaldoVtSuficiente`  
**Constantes:** `MSG_BLOQUEIO`, `MSG_BLOQUEIO_PJ`, `MSG_CLT_WARNING`

---

### transportRepository.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/repositories/transportRepository.js`

→ `calcularSaldoRestanteTx(tx, ...)` — fórmula RN-044 dentro da transação  
→ `criarVendaComTransacao({ vendaData, transacaoData, inicio, fim })` — Serializable  
→ `criarUsoVtAtomico({ usoData, inicio, fim, totalUsado })` — Serializable  
→ `calcularRecebidoVt` / `calcularUsadoVt` / `calcularVendidoNominalVt`  
→ `listarVendas` / `listarUsos` — paginação + totais do período  
→ `buscarConfiguracao`, `atualizarValorPadraoPassagem`, `atualizarVtHabilitado`

---

### transportSchemas.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/schemas/transportSchemas.js`

**Schemas Zod:** `obterSaldoQuerySchema`, `registrarVendaSchema`, `listarVendasQuerySchema`, `registrarUsoSchema`, `listarUsosQuerySchema`, `atualizarVtHabilitadoSchema`

---

### transportRoutes.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/api/src/routes/transportRoutes.js`  
**Base URL:** `/api/transporte`

| Method | Path | Handler |
|--------|------|---------|
| GET | `/saldo` | `obterSaldoVt` |
| POST | `/vendas` | `registrarVendaVt` |
| GET | `/vendas` | `listarVendas` |
| POST | `/usos` | `registrarUsoVt` |
| GET | `/usos` | `listarUsos` |
| PATCH | `/vt-habilitado` | `atualizarVtHabilitado` |

---

## 🚫 Regras de Negócio (Backend)

* RN-013/045: CLT pode registrar venda com aviso — responsabilidade do usuário  
* RN-040: Estagiário sem restrição; CLT com aviso  
* RN-041: Valor recebido na venda → RECEITA recurso DINHEIRO  
* RN-044: Saldo = recebido − usado − vendido (nominal)  
* RN-038/039: VT em despesas só categoria Transporte (módulo transações)  
* PJ/Pessoa Física: bloqueio via `assertModoPermitido` (PJ precisa `vtHabilitado === true`)  
* Sem intervalo entre vendas (RF-064/065 removidos)  
* Validação Zod: valores positivos, quantidade ≥ 1, período `YYYY-MM`

---

# [STORY FRONTEND] Gestão de Vale Transporte — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Gestão de Vale Transporte

---

## 📝 Descrição

**Como usuário**, quero gerenciar VT na rota `/transport-voucher` com cards de saldo, modais de uso/venda, históricos tabulados e fluxo de opt-in para PJ.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Carregar página (Estagiário/CLT)
**Dado** usuário autenticado com VT permitido,  
**Quando** acessa `/transport-voucher`,  
**Então** exibe cards (Recebido, Usado, Vendido nominal, Saldo restante), card Próxima recarga, botões Registrar Uso/Venda, aba vendas ativa com tabela paginada.  
* Loading: skeletons em cards e tabela

### Cenário 2 — Opt-in PJ
**Dado** usuário PJ com `vtHabilitado == null`,  
**Quando** acessa a rota,  
**Então** exibe `VtOptInScreen` ("Sim, recebo" / "Não recebo"); atualiza Redux auth + sidebar.

### Cenário 3 — PJ desabilitado
**Dado** PJ com `vtHabilitado === false`,  
**Então** exibe `VtDisabledScreen` com opção de reabilitar.

### Cenário 4 — Pessoa Física
**Então** redirect para rota autenticada padrão (`Navigate`).

### Cenário 5 — Registrar venda
**Quando** preenche modal e confirma,  
**Então** `POST /transporte/vendas`, toast sucesso, recarrega saldo + histórico; se CLT → toast warning adicional.

### Cenário 6 — Erro saldo insuficiente
**Quando** nominal > saldo disponível,  
**Então** erro inline no modal (validação local + mensagem API); modal permanece aberto.

### Cenário 7 — Registrar uso
**Quando** informa passagens e valor,  
**Então** preview fórmula (qtd × valor), `POST /transporte/usos`, atualiza cards e aba usos.

### Cenário 8 — Filtrar período
**Quando** seleciona mês no `MonthPicker` e clica Filtrar,  
**Então** recarrega saldo e histórico ativo para `YYYY-MM`; botão Limpar filtros volta ao mês atual.

### Cenário 9 — Histórico com cores
**Então** diferença negativa vermelha, positiva verde, zero neutro (`formatDiferenca`).

### Cenário 10 — Paginação
**Dado** > 10 registros no período,  
**Então** `Pagination` troca página sem perder filtro de período.

---

## 🛠️ Implementação (o que foi feito)

### transportService.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/services/transportService.js`

→ `obterSaldo(periodo, options)` → `GET /transporte/saldo`  
→ `listarVendas(periodo, pagina, limite, options)` → `GET /transporte/vendas`  
→ `listarUsos(periodo, pagina, limite, options)` → `GET /transporte/usos`  
→ `registrarVenda(payload)` → `POST /transporte/vendas`  
→ `registrarUso(payload)` → `POST /transporte/usos`  
→ `atualizarVtHabilitado(vtHabilitado)` → `PATCH /transporte/vt-habilitado`

---

### TransportVoucherPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/TransportVoucherPage.jsx`  
**Rota:** `/transport-voucher` (`App.jsx`, sidebar `sidebarNavigation.js`)

Orquestra: opt-in/disabled/redirect PF, filtro período, saldo, tabs vendas/usos, modais, AbortController, Redux `setUser` após opt-in.

---

### Componentes (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/components/features/transport/`

| Componente | Responsabilidade |
|------------|------------------|
| `VtBalanceCards.jsx` | Grid 4 métricas + card próxima recarga / countdown |
| `VtSaleHistory.jsx` | Tabela vendas + totais + empty state |
| `VtUsageHistory.jsx` | Tabela usos + totais + empty state |
| `VtSaleModal.jsx` | Form venda, preview diferença/novo saldo |
| `VtUsageModal.jsx` | Stepper passagens, valor, toggle salvar padrão |
| `VtOptInScreen.jsx` | Opt-in PJ |
| `VtDisabledScreen.jsx` | PJ opt-out — reabilitar |
| `VtFieldLabel.jsx` | Label + hint reutilizável nos modais |
| `VtBlockedScreen.jsx` | Tela bloqueada genérica (**não referenciada**) |

---

### Utils e estilos (EXISTENTE — IMPLEMENTADO)

| Arquivo | Função |
|---------|--------|
| `web/src/utils/transportUtils.js` | Modo VT, sidebar filter, reset countdown, `formatDiferenca`, datas ISO |
| `web/src/styles/transport.css` | Estilos `.vt-page`, cards, tabelas, modais, blocked |
| `web/src/config/sidebarNavigation.js` | Item `{ id: 'vale-transporte', path: '/transport-voucher' }` |

---

### Rotas e navegação (EXISTENTE — IMPLEMENTADO)

**`web/src/App.jsx`:** `<Route path="transport-voucher" element={<TransportVoucherPage />} />`  
**Sidebar:** filtrada por `filterSidebarNavForUser` em `useSidebarState.js`

---

### Endpoints consumidos

* `GET /api/transporte/saldo` · `GET /api/transporte/vendas` · `GET /api/transporte/usos`
* `POST /api/transporte/vendas` · `POST /api/transporte/usos`
* `PATCH /api/transporte/vt-habilitado`

---

## 📐 Protótipos

**Pasta:** `Documentacao/05-Prototipos/Financeiro/Vale Transporte/`

- Painel principal (claro/escuro): `PainelValeTransp.png`
- Modal registrar venda: `RegistVenda.png`
- Modal registrar uso: `RegistUso.png`

---

## 📚 Documentação

- [PO M08](../../Documentacao/03-Auditorias/Product%20Owner/08-Vale-Transporte.md)
- [Requisitos RF-059–063, RF-066](../../Documentacao/01-Produto/Requisitos/Readme.md)
- [Web Readme](../../Documentacao/02-Engenharia/Web/Readme.md)
- [API Readme](../../Documentacao/02-Engenharia/API/Readme.md)

---

## 📅 Histórico

| Data | Evento |
|------|--------|
| abr/2026 | Schema inicial VT + evolução Prisma |
| jun/2026 | Backend `/api/transporte` + frontend `/transport-voucher` entregues |
| jun/2026 | Migration remove intervalo venda VT (RF-064/065) |
| ago/2026 | Auditoria PO M08 — decisão B CLT, Serializable, docs alinhados |
