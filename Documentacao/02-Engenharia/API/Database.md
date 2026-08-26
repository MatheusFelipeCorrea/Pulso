# 🗄️ Pulso — Dicionário de Dados

Documento de referência das entidades do banco de dados do **Pulso**.

> **Fonte de verdade:** `Codigo/Pulso/api/prisma/schema.prisma`  
> **Última revisão:** ago/2026 — alinhado ao schema Prisma 5.x (PostgreSQL / Neon)

---

## 📊 Estado do schema vs API

| Camada | Situação |
|--------|----------|
| **Prisma** | Modelos no schema · documentados abaixo |
| **API em uso** | Auth, transações, categorias, tags, orçamento, notificações, lembretes, calendário, dívidas, metas, viagens, moedas, planejamento de compra, grupos (Premium + Socket.IO), divisão de despesas, dashboard, importação |
| **Pendente na API** | IA (chat/insights) completo |
| **TI5** | Planos Free/Premium · RabbitMQ (alerts + reminders + emails) · Socket.IO |

Tabelas físicas usam **snake_case** via `@@map` (ex.: `usuarios`, `transacoes`, `configuracoes_usuario`).

> **Fora do escopo produto TI5:** tabelas/campos legados de gestão de vale-transporte (`VendaVt`, `UsoVt`), gamificação (`Sequencia`, `Conquista`, …) e relatórios produto — podem existir no schema histórico; não são módulos do produto documentado.

---

## 📑 Sumário

- [👤 Usuario](#-usuario)
- [⚙️ ConfiguracaoUsuario](#️-configuracaousuario)
- [🔑 TokenRenovacao](#-tokenrenovacao)
- [🏷️ Categoria](#️-categoria)
- [💳 Transacao](#-transacao)
- [🏷️ Tag](#️-tag)
- [🔗 TransacaoTag](#-transacaotag)
- [🎯 Meta](#-meta)
- [💰 AporteMeta](#-aportemeta)
- [✈️ Viagem](#️-viagem)
- [🧳 DespesaViagem](#-despesaviagem)
- [💱 MoedaFavorita](#-moedafavorita)
- [📅 Lembrete](#-lembrete)
- [🛒 ItemPlanejamentoCompra](#-itemplanejamentocompra)
- [🚌 VendaVt / UsoVt (legado)](#-vendavt--usovt-legado-schema)
- [🔥 Sequencia / Conquistas (legado)](#-sequencia--conquista--conquistausuario--desafio-mensal-legado-schema)
- [💬 MensagemChat](#-mensagemchat)
- [📊 HistoricoScore](#-historicoscore)
- [👥 Grupo](#-grupo)
- [👤 MembroGrupo](#-membrogrupo)
- [✈️ ViagemGrupo](#️-viagemgrupo)
- [🧳 DespesaViagemGrupo](#-despesaviagemgrupo)
- [🎯 MetaGrupo](#-metagrupo)
- [💵 AporteMetaGrupo](#-aportemetagrupo)
- [💬 MensagemChatGrupo](#-mensagemchatgrupo)
- [💸 Divisao](#-divisao)
- [🙋 DivisaoParticipante](#-divisaoparticipante)
- [📊 Orcamento](#-orcamento)
- [🔔 Notificacao](#-notificacao)
- [📊 Resumo Geral](#-resumo-geral)
- [🎨 Enums Disponíveis](#-enums-disponíveis)
- [🔗 Relações Importantes](#-relações-importantes)

---

## 👤 Usuario

Dados principais da conta do usuário. Tabela: `usuarios`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String (cuid) | ✅ | Identificador único |
| `nome` | VarChar(120) | ✅ | Nome completo |
| `email` | VarChar(180) | ✅ | Email único |
| `senhaHash` | String | ❌ | Senha hasheada (bcrypt). Nulo se Google |
| `urlAvatar` | String | ❌ | URL da foto de perfil |
| `provedorAuth` | Enum | ✅ | `EMAIL` ou `GOOGLE` |
| `googleId` | String | ❌ | ID único do Google (se OAuth) |
| `verificado` | Boolean | ✅ | Email já confirmado? |
| `tokenVerificacaoEmail` | VarChar(64) | ❌ | Token de confirmação de email |
| `tokenVerificacaoExpira` | DateTime | ❌ | Expiração do token de verificação |
| `tokenResetSenha` | VarChar(64) | ❌ | Token de recuperação de senha |
| `tokenResetExpira` | DateTime | ❌ | Expiração do token de reset |
| `criadoEm` | DateTime | ✅ | Data de cadastro |
| `atualizadoEm` | DateTime | ✅ | Última atualização |

---

## ⚙️ ConfiguracaoUsuario

Preferências e receitas fixas recorrentes do usuário. Tabela: `configuracoes_usuario`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK único) | Dono das configs |
| `valorSalario` | Decimal(12,2) | Valor mensal do salário |
| `diaSalario` | Int (1-31) | Dia do mês em que cai |
| `valorVa` | Decimal(12,2) | Valor do Vale Alimentação |
| `diaVa` | Int | Dia em que cai o VA |
| `valorVr` | Decimal(12,2) | Valor do Vale Refeição |
| `diaVr` | Int | Dia em que cai o VR |
| `valorVt` | Decimal(12,2) | Valor de benefício VT (tipo de recurso) |
| `diaVt` | Int | Dia em que cai o VT |
| `tema` | Enum | `CLARO` ou `ESCURO` |
| `plano` | Enum | `FREE` ou `PREMIUM` (TI5) |
| `googleCalendarAtivo` | Boolean | Integração com Google Calendar? |
| `googleCalendarId` | String | ID do calendário dedicado no Google |
| `googleCalendarEmail` | VarChar(180) | E-mail da conta Google conectada (OAuth) |
| `tokensGoogle` | Json | Tokens OAuth do Google (criptografados) |
| `limiteGastos` | Decimal(12,2) | Limite de gastos pra alerta |
| `rendaMensalPlanejada` | Decimal(12,2) | Renda mensal planejada (orçamento) |
| `modoUso` | Enum | `ESTAGIARIO`, `CLT`, `PJ`, `PESSOA_FISICA` (RF-073) |
| `criadoEm` / `atualizadoEm` | DateTime | Timestamps |

---

## 🔑 TokenRenovacao

Controle de sessões ativas (refresh tokens opacos). Tabela: `tokens_renovacao`

### Arquitetura de sessão (RN-134, RN-135, RN-136)

| Camada | Comportamento |
|--------|----------------|
| **Cliente (browser)** | Cookies `pulso_access` (JWT, ~15 min) e `pulso_refresh` (`httpOnly`, `Secure` em prod, `SameSite=none` prod / `lax` dev, `path=/api`). Front usa `withCredentials` — **não** persiste tokens em `localStorage`. Implementação: `utils/authCookies.js`. |
| **Transporte alternativo** | Header `Authorization: Bearer` (access) ou body `refreshToken` em `/auth/refresh` e `/auth/logout` — fallback para scripts/OAuth exchange; fluxo normal do SPA é só cookie. |
| **Banco (`tokens_renovacao`)** | Valor opaco do refresh (96 hex chars, `crypto.randomBytes(48)`) armazenado **em texto** em `token` — lookup por igualdade exata, como ID de sessão. **Não é hasheado** (diferente de senha). Mitigação: cookie `httpOnly` + rotação single-use + revogação em reuse. |
| **Rotação** | Cada `POST /auth/refresh` revoga o token apresentado e emite outro, mantendo `expiraEm` original da sessão. |
| **Reuse detectado** | Reapresentar refresh já revogado → `revokeAllRefreshTokensForUser` (logout global da sessão). |
| **Logout** | `POST /auth/logout` revoga o refresh atual e limpa cookies. |
| **Troca de senha** | Invalida todos os refresh tokens do usuário (RN-136). |

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `token` | String único | Valor opaco do refresh (texto no banco — ver tabela acima) |
| `expiraEm` | DateTime | 7 dias (padrão) ou 30 dias com "Lembrar-me" no login |
| `revogado` | Boolean | Se foi invalidado (rotação, logout ou reuse) |
| `criadoEm` | DateTime | Criação |
| `revogadoEm` | DateTime | Quando foi revogado |

> **Endurecimento futuro (opcional):** persistir apenas hash (ex.: SHA-256) do refresh no banco exigiria alterar `authRepository.findRefreshToken` / rotação — hoje não implementado; cookie `httpOnly` + rotação cobrem o risco principal para MVP.

---

## 🏷️ Categoria

Categorias de receitas/despesas por usuário. Tabela: `categorias`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `nome` | VarChar(60) | ✅ | Ex: "Alimentação" |
| `icone` | VarChar(40) | ❌ | Nome Lucide (ex: `UtensilsCrossed`, `Bus`) |
| `cor` | VarChar(7) | ✅ | Hex `#RRGGBB` (default `#7C3AED`) |
| `tipo` | Enum | ✅ | `RECEITA` ou `DESPESA` |
| `padrao` | Boolean | ✅ | `true` = categoria do catálogo inicial (RN-165) |
| `grupoBeneficio` | Enum? | ❌ | `ALIMENTACAO`, `COMPRAS`, `TRANSPORTE` — compatibilidade VA/VR/VT (RF-NOVO-C2); null = sem grupo |
| `usuarioId` | String | ❌ | FK do dono (null permitido no schema; seed usa id do usuário) |
| `criadoEm` | DateTime | ✅ | Timestamp |

**Índice único:** `(usuarioId, nome, tipo)`

---

## 💳 Transacao

Receitas e despesas. Tabela: `transacoes`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Dono |
| `categoriaId` | String (FK) | ❌ | Categoria vinculada — nula em transferências (RF-027) |
| `tipo` | Enum | ✅ | `RECEITA`, `DESPESA` ou `TRANSFERENCIA` |
| `recurso` | Enum | ✅ | `DINHEIRO`, `VA`, `VR`, `VT`, `POUPANCA` |
| `recursoDestino` | Enum | ❌ | Recurso de destino — usado apenas quando `tipo = TRANSFERENCIA` (RF-027) |
| `valor` | Decimal(12,2) | ✅ | Valor (sempre > 0) |
| `descricao` | VarChar(255) | ❌ | Descrição livre |
| `data` | DateTime | ✅ | Data da transação |
| `recorrente` | Boolean | ✅ | Se repete periodicamente |
| `regraRecorrencia` | String | ❌ | JSON com frequência, `ateQuando`, `dataFim` |
| `paiId` | String | ❌ | Transação “mãe” se gerada por recorrência |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

**Regras de negócio (validação recurso × categoria):**
- ❌ Alimentação **não** pode usar `VT`
- ❌ `VT` só com categoria Transporte (despesas)
- ❌ `VR` só com Alimentação; `VA` com Alimentação ou Compras
- ✅ Valor sempre > 0
- **Transferência (RF-027):** `tipo = TRANSFERENCIA` exige `recursoDestino` diferente de `recurso` e não tem `categoriaId`; excluída dos totais de receita/despesa (`calcularAgregados`/`montarResumo`) e dos marcadores do Calendário
- **Sugestão de categoria (RF-028):** endpoint `GET /transacoes/sugestao-categoria` compara a descrição informada com o histórico do usuário (mesmo `tipo`) via similaridade de bigramas (`categorySuggestionUtils.js`), sem persistir nada

---

## 🏷️ Tag

Etiquetas do usuário para classificar transações. Tabela: `tags`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `nome` | VarChar(40) | Nome da tag (único por usuário) |
| `icone` | VarChar(40) | Nome Lucide (default `Tag`) |
| `cor` | VarChar(7) | Hex `#RRGGBB` (default `#71717A`) |
| `usuarioId` | String (FK) | Dono |

---

## 🔗 TransacaoTag

Relação N:N entre Transação ↔ Tags. Tabela: `transacoes_tags`

| Campo | Descrição |
|---|---|
| `transacaoId` | FK da transação |
| `tagId` | FK da tag |

---

## 🎯 Meta

Objetivos de economia do usuário.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Dono |
| `nome` | VarChar(100) | ✅ | Ex: "Viagem Japão" |
| `valorAlvo` | Decimal(12,2) | ✅ | Valor a atingir |
| `valorAtual` | Decimal(12,2) | ✅ | Já guardado (default 0) |
| `prazo` | DateTime | ✅ | Data limite |
| `tipo` | Enum | ✅ | `CURTO_PRAZO` ou `LONGO_PRAZO` |
| `status` | Enum | ✅ | `ATIVA`, `PAUSADA`, `CONCLUIDA`, `CANCELADA` |
| `prioridade` | Enum | ❌ | `ALTA`, `MEDIA`, `BAIXA` |
| `descricao` | VarChar(500) | ❌ | Descrição opcional |
| `concluidaEm` | DateTime | ❌ | Data da conclusão |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

---

## 💰 AporteMeta

Histórico de aportes em cada meta.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `metaId` | String (FK) | Meta vinculada |
| `valor` | Decimal(12,2) | Valor do aporte |
| `data` | DateTime | Data do aporte |
| `criadoEm` | DateTime | Timestamp |

---

## ✈️ Viagem

Planejamento de viagens com orçamento.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Dono |
| `destino` | VarChar(120) | ✅ | Ex: "Tóquio" |
| `moeda` | VarChar(3) | ✅ | Código ISO (USD, JPY, EUR) |
| `dataPrevista` | DateTime | ✅ | Data prevista da viagem |
| `metaId` | String | ❌ | FK opcional — meta vinculada |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

---

## 🧳 DespesaViagem

Pretensões de gastos dentro da viagem.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `viagemId` | String (FK) | Viagem |
| `categoria` | Enum | `TRANSPORTE`, `HOSPEDAGEM`, `ALIMENTACAO`, `PASSEIOS`, `COMPRAS`, `OUTROS` |
| `categoriaId` | String | FK opcional — vincular a Categoria do usuário |
| `descricao` | VarChar(255) | Descrição |
| `valorEstimado` | Decimal(12,2) | Valor estimado na moeda local |
| `criadoEm` | DateTime | Timestamp |

---

## 💱 MoedaFavorita

Moedas favoritas do usuário para acesso rápido.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `codigo` | VarChar(3) | Código ISO (USD, EUR, ARS) |
| `criadoEm` | DateTime | Timestamp |

---

## 📅 Lembrete

Lembretes de contas a pagar (sincronizáveis com Google Calendar).

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Dono |
| `titulo` | VarChar(120) | ✅ | Título do lembrete |
| `valor` | Decimal(12,2) | ❌ | Valor opcional |
| `dataVencimento` | DateTime | ✅ | Data de vencimento |
| `horaLembrete` | String | ✅ | Horário (`HH:MM`, padrão `10:00`) usado no evento sincronizado com o Google Agenda |
| `antecedencia` | Enum | ✅ | `NO_DIA`, `UM_DIA`, `TRES_DIAS`, `CINCO_DIAS`, `UMA_SEMANA` |
| `categoria` | Enum | ✅ | `CategoriaLembrete` (ex.: `ALUGUEL`, `LUZ`, `FATURA_CARTAO`, `OUTRO`) |
| `pago` | Boolean | ✅ | Já foi pago? |
| `googleEventId` | String | ❌ | ID do evento no Calendar |
| `sincronizado` | Boolean | ✅ | Sincronizado com Google? |
| `repetirMensal` | Boolean | ✅ | Recria o lembrete automaticamente todo mês |
| `diaRecorrencia` | Int | ❌ | Dia do mês (1–28) para a recorrência |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

---

## 🛒 ItemPlanejamentoCompra

Itens de uma lista de desejos, com simulação de parcelamento e vínculo opcional a uma meta. Tabela: `itens_planejamento_compra`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Dono |
| `nome` | VarChar(120) | ✅ | Nome do item desejado |
| `valorEstimado` | Decimal(12,2) | ✅ | Valor estimado do item |
| `prioridade` | Enum | ✅ | `Prioridade` (`ALTA`, `MEDIA`, `BAIXA`) |
| `categoria` | Enum | ✅ | `CategoriaItemCompra`, inferida automaticamente pelo nome (default `OUTROS`) |
| `observacoes` | VarChar(300) | ❌ | Notas livres |
| `linkProduto` | VarChar(500) | ❌ | Link da loja |
| `imagemUrl` | VarChar(2048) | ❌ | Imagem (upload próprio ou sugerida) |
| `simularParcelas` | Boolean | ✅ | Se deve simular parcelamento |
| `parcelas` | Int | ✅ | Quantidade de parcelas simuladas (padrão 12) |
| `metaId` | String (FK) | ❌ | Meta vinculada, opcional |
| `status` | Enum | ✅ | `StatusItemCompra` (`DESEJADO`, `COMPRADO`) |
| `compradoEm` | DateTime | ❌ | Quando foi marcado como comprado |
| `transacaoId` | String (FK, único) | ❌ | Transação gerada ao marcar "Comprei!" |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

**Regra de comprometimento (RN-090/RN-091):** `parcela ÷ renda_mensal × 100` — ≤20% saudável, 21–30% atenção, >30% arriscado.

---

## 🚌 VendaVt / UsoVt (legado schema)

> **Fora do escopo TI5.** Tabelas históricas (`VendaVt`, `UsoVt`); não há módulo de produto correspondente.

---

## 🔥 Sequencia / 🏆 Conquista / 🎖️ ConquistaUsuario / 🎲 DesafioMensal (legado schema)

> **Fora do escopo TI5.** Entidades históricas de engajamento; não fazem parte do produto documentado.

---

## 💬 MensagemChat

Histórico do chatbot Gemini.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `papel` | VarChar(20) | `user` ou `assistant` |
| `conteudo` | Text | Conteúdo da mensagem |
| `criadoEm` | DateTime | Timestamp |

---

## 📊 HistoricoScore

Evolução do score de saúde financeira.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `score` | Int (0-100) | Valor calculado |
| `detalhes` | Json | Breakdown do cálculo |
| `criadoEm` | DateTime | Timestamp |

**Faixas do score:**

| Faixa | Label | Indicador |
|---|---|---|
| 0-30 | Crítico | 🔴 |
| 31-50 | Alerta | 🟡 |
| 51-70 | Regular | 🔵 |
| 71-90 | Bom | 🟢 |
| 91-100 | Excelente | 🟣 |

---

## 👥 Grupo

Grupos para metas/viagens coletivas.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `nome` | VarChar(100) | ✅ | Nome do grupo |
| `descricao` | VarChar(500) | ❌ | Descrição |
| `codigoConvite` | String único | ✅ | Código/link de convite |
| `criadorId` | String (FK) | ✅ | Quem criou |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

---

## 👤 MembroGrupo

Relação N:N entre Usuários ↔ Grupos.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `grupoId` | String (FK) | Grupo |
| `usuarioId` | String (FK) | Membro |
| `papel` | Enum | `ADMIN` ou `MEMBRO` |
| `entrouEm` | DateTime | Quando entrou |

---

## ✈️ ViagemGrupo

Viagens planejadas pelo grupo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `grupoId` | String (FK) | Grupo |
| `destino` | VarChar(120) | Destino |
| `moeda` | VarChar(3) | Moeda local |
| `dataPrevista` | DateTime | Data prevista |
| `criadoEm` / `atualizadoEm` | DateTime | Timestamps |

---

## 🧳 DespesaViagemGrupo

Pretensões de cada membro na viagem do grupo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `viagemGrupoId` | String (FK) | Viagem do grupo |
| `adicionadoPorId` | String (FK) | Quem adicionou |
| `categoria` | Enum | Mesma de DespesaViagem |
| `descricao` | VarChar(255) | Descrição |
| `valorEstimado` | Decimal(12,2) | Valor estimado |
| `criadoEm` | DateTime | Timestamp |

---

## 🎯 MetaGrupo

Metas coletivas do grupo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `grupoId` | String (FK) | Grupo |
| `nome` | VarChar(100) | Nome |
| `valorAlvo` | Decimal(12,2) | Valor-alvo |
| `valorAtual` | Decimal(12,2) | Já guardado |
| `prazo` | DateTime | Prazo |
| `status` | Enum | `ATIVA`, `PAUSADA`, `CONCLUIDA`, `CANCELADA` |
| `descricao` | VarChar(500) | Descrição |
| `criadoEm` / `atualizadoEm` | DateTime | Timestamps |

---

## 💵 AporteMetaGrupo

Quem contribuiu e com quanto em cada meta do grupo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `metaGrupoId` | String (FK) | Meta do grupo |
| `usuarioId` | String (FK) | Quem contribuiu |
| `valor` | Decimal(12,2) | Valor |
| `data` | DateTime | Data |
| `criadoEm` | DateTime | Timestamp |

---

## 💬 MensagemChatGrupo

Chat interno do grupo.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `grupoId` | String (FK) | Grupo |
| `usuarioId` | String (FK) | Autor |
| `conteudo` | Text | Mensagem |
| `criadoEm` | DateTime | Timestamp |

---

## 💸 Divisao

Despesa compartilhada com participantes por nome livre (sem exigir conta Pulso — mesmo padrão de Dívidas Pessoais). Tabela: `divisoes`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `usuarioId` | String (FK) | ✅ | Organizador (dono do registro) |
| `titulo` | VarChar(120) | ✅ | Ex: "Jantar no Outback" |
| `valorTotal` | Decimal(12,2) | ✅ | Valor total da despesa |
| `tipo` | Enum | ✅ | `TipoRateioDivisao`: `IGUAL` ou `PERSONALIZADA` |
| `status` | Enum | ✅ | `StatusDivisao`: `ATIVA` ou `QUITADA` |
| `data` | Date | ✅ | Data da despesa |
| `icone` | VarChar(40) | ❌ | Ícone Lucide |
| `cor` | VarChar(20) | ❌ | Cor do card |
| `observacao` | VarChar(250) | ❌ | Notas livres |
| `quitadaEm` | DateTime | ❌ | Quando todos os participantes pagaram |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

**Regras:** rateio em aritmética de centavos determinística (RNF-016); passa para `QUITADA` automaticamente quando todos os participantes ficam `PAGO`, e reabre se algum pagamento for desfeito; edição de participantes/valores bloqueada se já houver pagamento manual registrado; exclusão bloqueada se quitada (limpeza automática após 180 dias via `expenseSplitCleanupJob`).

---

## 🙋 DivisaoParticipante

Cada pessoa envolvida em uma `Divisao`, incluindo o organizador (linha com `ehOrganizador = true`, exibida como "Você"). Tabela: `divisao_participantes`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | String | ✅ | Identificador |
| `divisaoId` | String (FK) | ✅ | Divisão à qual pertence |
| `nome` | VarChar(120) | ✅ | Nome livre, único (case-insensitive) por divisão e diferente de "Você" |
| `valor` | Decimal(12,2) | ✅ | Parte do participante nesta divisão |
| `ehOrganizador` | Boolean | ✅ | `true` para a linha do próprio usuário dono |
| `pagouAConta` | Boolean | ✅ | Se foi quem adiantou o valor total |
| `status` | Enum | ✅ | `StatusParticipanteDivisao`: `PENDENTE` ou `PAGO` |
| `dataPagamento` | DateTime | ❌ | Quando foi marcado como pago |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

**Relação com Lembrete:** N:N (`divisaoParticipantes` ↔ `Lembrete.divisaoParticipantes`, tabela de junção `_DivisaoParticipanteToLembrete`, `ON DELETE CASCADE` nos dois lados) — um único lembrete de cobrança (RF-111) pode cobrir 1+ participantes pendentes. O lembrete é cancelado automaticamente quando todos os participantes que ele cobre já pagaram, e removido junto se a `Divisao` for excluída.

---

## 📊 Orcamento

Limite mensal por categoria de despesa. Tabela: `orcamentos`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `categoriaId` | String (FK) | Categoria de despesa |
| `mesReferencia` | Date | Primeiro dia do mês de referência |
| `limiteValor` | Decimal(12,2) | Valor máximo planejado |
| `criadoEm` / `atualizadoEm` | DateTime | Timestamps |

**Constraint:** único por `(usuarioId, categoriaId, mesReferencia)`.

---

## 🔔 Notificacao

Alertas in-app para o usuário. Tabela: `notificacoes`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Destinatário |
| `tipo` | Enum | `TipoNotificacao` (ex.: `ALERTA_ORCAMENTO`, `ORCAMENTO_ESTOURADO`) |
| `titulo` | VarChar(120) | Título exibido |
| `mensagem` | VarChar(500) | Corpo opcional |
| `lida` | Boolean | Já foi lida? |
| `linkAcao` | VarChar(255) | Rota de destino no frontend |
| `metadados` | Json | Dados extras (categoria, percentual, etc.) |
| `criadoEm` | DateTime | Timestamp |

---

## 📊 Resumo Geral

| # | Categoria | Entidades | Total |
|---|---|---|---|
| 1 | 👤 Usuário | Usuario, ConfiguracaoUsuario, TokenRenovacao | 3 |
| 2 | 💳 Financeiro | Categoria, Transacao, Tag, TransacaoTag | 4 |
| 3 | 🎯 Metas | Meta, AporteMeta | 2 |
| 4 | ✈️ Viagens | Viagem, DespesaViagem | 2 |
| 5 | 💱 Câmbio | MoedaFavorita | 1 |
| 6 | 📅 Lembretes | Lembrete | 1 |
| 7 | 📊 Orçamento & Alertas | Orcamento, Notificacao | 2 |
| 8 | 🤖 IA | MensagemChat, HistoricoScore | 2 |
| 9 | 👥 Grupos | Grupo, MembroGrupo, ViagemGrupo, DespesaViagemGrupo, MetaGrupo, AporteMetaGrupo, MensagemChatGrupo | 7 |
| 10 | 🛒 Planejamento de Compra | ItemPlanejamentoCompra | 1 |
| 11 | 💸 Divisão de Despesas | Divisao, DivisaoParticipante | 2 |
| — | 📦 Legado (fora TI5) | VendaVt, UsoVt, Sequencia, Conquista, ConquistaUsuario, DesafioMensal | 6 |

---

## 🎨 Enums Disponíveis

| Enum | Valores |
|---|---|
| `ProvedorAuth` | `EMAIL`, `GOOGLE` |
| `TipoTransacao` | `RECEITA`, `DESPESA`, `TRANSFERENCIA` |
| `TipoRecurso` | `DINHEIRO`, `VA`, `VR`, `VT`, `POUPANCA` |
| `StatusMeta` | `ATIVA`, `PAUSADA`, `CONCLUIDA`, `CANCELADA` |
| `TipoMeta` | `CURTO_PRAZO`, `LONGO_PRAZO` |
| `TipoCategoria` | `RECEITA`, `DESPESA` |
| `CategoriaDespesaViagem` | `TRANSPORTE`, `HOSPEDAGEM`, `ALIMENTACAO`, `PASSEIOS`, `COMPRAS`, `OUTROS` |
| `Tema` | `CLARO`, `ESCURO` |
| `AntecedenciaLembrete` | `NO_DIA`, `UM_DIA`, `TRES_DIAS`, `CINCO_DIAS`, `UMA_SEMANA` |
| `CategoriaItemCompra` | `ELETRONICOS`, `CASA_ELETRODOMESTICOS`, `VESTUARIO`, `VEICULO`, `ACESSORIOS`, `OUTROS` |
| `StatusItemCompra` | `DESEJADO`, `COMPRADO` |
| `PapelGrupo` | `ADMIN`, `MEMBRO` |
| `NivelFinanceiro` | `INICIANTE`, `CONSCIENTE`, `ESTRATEGISTA`, `INVESTIDOR` |
| `ModoUso` | `ESTAGIARIO`, `CLT`, `PJ`, `PESSOA_FISICA` |
| `Prioridade` | `ALTA`, `MEDIA`, `BAIXA` |
| `TipoRateioDivisao` | `IGUAL`, `PERSONALIZADA` |
| `StatusDivisao` | `ATIVA`, `QUITADA` |
| `StatusParticipanteDivisao` | `PENDENTE`, `PAGO` |
| `CategoriaLembrete` | `ALUGUEL`, `CONDOMINIO`, `IPTU`, `LUZ`, `AGUA`, `GAS`, `INTERNET`, `FATURA_CARTAO`, `OUTRO`, … (ver schema) |
| `TipoNotificacao` | `RECEITA_REGISTRADA`, `DESPESA_REGISTRADA`, `TRANSFERENCIA_REGISTRADA`, `META_ATINGIDA`, `ALERTA_ORCAMENTO`, `ORCAMENTO_ESTOURADO` |

---

## 🔗 Relações Importantes

```
Usuario (1) ──── (1) ConfiguracaoUsuario
  (1) ──── (N) Transacao ──── (0:1) Categoria [nula em TRANSFERENCIA]
                        └──── (N:N) Tag
  (1) ──── (N) Meta ──── (N) AporteMeta
                    └──── (0:1) Viagem
  (1) ──── (N) Viagem ──── (N) DespesaViagem
  (1) ──── (N) Lembrete
  (1) ──── (N) ItemPlanejamentoCompra ──── (0:1) Meta
                                     └──── (0:1) Transacao
  (1) ──── (N) Orcamento ──── (N) Categoria
  (1) ──── (N) Notificacao
  (1) ──── (N) MoedaFavorita
  (1) ──── (N) MensagemChat
  (1) ──── (N) HistoricoScore
  (N:N) ── Grupo (via MembroGrupo)
  (1) ──── (N) Divisao ──── (N) DivisaoParticipante ──── (N:N) Lembrete

Grupo ──── (N) ViagemGrupo ──── (N) DespesaViagemGrupo
──── (N) MetaGrupo ──── (N) AporteMetaGrupo
──── (N) MensagemChatGrupo
```

---

## 📝 Notas

- **Fonte de verdade:** alterações de modelo → editar `prisma/schema.prisma` e rodar `npm run db:migrate`
- **Timestamps:** `criadoEm` e `atualizadoEm` gerenciados pelo Prisma (`@default(now())`, `@updatedAt`)
- **IDs:** `cuid()` em todas as entidades
- **Valores monetários:** `Decimal(12,2)` (ou `Decimal(10,2)` em campos unitários)
- **Cores:** hex `#RRGGBB` (7 caracteres)
- **Ícones:** string com nome Lucide (ex: `UtensilsCrossed`, `Banknote`) — ver `web/src/components/badges/iconRegistry.jsx`
- **Moedas:** ISO 4217, 3 letras (`USD`, `BRL`, `EUR`)
- **Tokens Google:** criptografados em repouso (AES-256-GCM, `utils/googleTokenCrypto.js`) antes de persistir em `tokensGoogle` — chave via env `GOOGLE_TOKENS_ENCRYPTION_KEY`
- **Refresh tokens (sessão):** transporte em cookie `httpOnly` (`pulso_refresh`); persistência opaca em `tokens_renovacao.token` (texto, não hash) — ver seção [TokenRenovacao](#-tokenrenovacao)
- **Recorrência:** `regraRecorrencia` armazena JSON (`frequencia`, `ateQuando`, `dataFim`), não RRULE RFC 5545
- **Nomes de tabela:** ver `@@map` em cada model no schema Prisma