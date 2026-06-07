# 🗄️ Pulso — Dicionário de Dados

Documento de referência das entidades do banco de dados do **Pulso**.

> **Fonte de verdade:** `Codigo/Pulso/api/prisma/schema.prisma`  
> **Última revisão:** maio/2026 — alinhado ao schema Prisma 5.x (PostgreSQL / Neon)

---

## 📊 Estado do schema vs API

| Camada | Situação |
|--------|----------|
| **Prisma** | 28 modelos mapeados (todas as áreas do produto) |
| **API em uso** | `Usuario`, `TokenRenovacao`, `ConfiguracaoUsuario`, `Categoria`, `Transacao`, `Tag`, `TransacaoTag`, `VendaVt`, `UsoVt`, `Sequencia` |
| **Pendente na API** | Metas, viagens, lembretes, VT, grupos, IA, etc. |

Tabelas físicas usam **snake_case** via `@@map` (ex.: `usuarios`, `transacoes`, `configuracoes_usuario`).

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
- [🚌 VendaVt](#-vendavt)
- [🎫 UsoVt](#-usovt)
- [🔥 Sequencia](#-sequencia)
- [🏆 Conquista](#-conquista)
- [🎖️ ConquistaUsuario](#️-conquistausuario)
- [🎲 DesafioMensal](#-desafiomensal)
- [💬 MensagemChat](#-mensagemchat)
- [📊 HistoricoScore](#-historicoscore)
- [👥 Grupo](#-grupo)
- [👤 MembroGrupo](#-membrogrupo)
- [✈️ ViagemGrupo](#️-viagemgrupo)
- [🧳 DespesaViagemGrupo](#-despesaviagemgrupo)
- [🎯 MetaGrupo](#-metagrupo)
- [💵 AporteMetaGrupo](#-aportemetagrupo)
- [💬 MensagemChatGrupo](#-mensagemchatgrupo)
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
| `valorVt` | Decimal(12,2) | Valor do Vale Transporte |
| `diaVt` | Int | Dia em que cai o VT |
| `diasIntervaloVendaVt` | Int | Intervalo em dias entre vendas de VT (default 30) |
| `tema` | Enum | `CLARO` ou `ESCURO` |
| `gamificacaoAtiva` | Boolean | Módulo de gamificação ativo? |
| `googleCalendarAtivo` | Boolean | Integração com Google Calendar? |
| `tokensGoogle` | Json | Tokens OAuth do Google (criptografados) |
| `limiteGastos` | Decimal(12,2) | Limite de gastos pra alerta |
| `valorPadraoPassagem` | Decimal(10,2) | Valor padrão da passagem de VT (uso) |
| `modoUso` | Enum | `ESTAGIARIO`, `CLT`, `PJ`, `PESSOA_FISICA` (RF-103) |
| `criadoEm` / `atualizadoEm` | DateTime | Timestamps |

---

## 🔑 TokenRenovacao

Controle de sessões ativas (refresh tokens). Tabela: `tokens_renovacao`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `token` | String único | Valor do refresh token (hasheado) |
| `expiraEm` | DateTime | Quando expira (7 dias) |
| `revogado` | Boolean | Se foi invalidado |
| `criadoEm` | DateTime | Criação |
| `revogadoEm` | DateTime | Quando foi revogado |

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
| `categoriaId` | String (FK) | ✅ | Categoria vinculada |
| `tipo` | Enum | ✅ | `RECEITA` ou `DESPESA` |
| `recurso` | Enum | ✅ | `DINHEIRO`, `VA`, `VR`, `VT` |
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
| `antecedencia` | Enum | ✅ | `NO_DIA`, `UM_DIA`, `TRES_DIAS` |
| `googleEventId` | String | ❌ | ID do evento no Calendar |
| `sincronizado` | Boolean | ✅ | Sincronizado com Google? |
| `criadoEm` / `atualizadoEm` | DateTime | ✅ | Timestamps |

---

## 🚌 VendaVt

Registro de VT vendido pelo usuário.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `nomeComprador` | VarChar(120) | Nome de quem comprou |
| `dataVenda` | DateTime | Data da venda |
| `valorNominal` | Decimal(12,2) | Valor "de face" do VT |
| `valorRecebido` | Decimal(12,2) | Valor realmente recebido |
| `proximaDataVenda` | DateTime | Próxima data permitida pra vender |
| `criadoEm` | DateTime | Timestamp |

**Regra**: `valorRecebido` geralmente é menor que `valorNominal` (diferença = perda na venda).

---

## 🎫 UsoVt

Registro de passagens efetivamente usadas.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `quantidade` | Int | Qtd de passagens |
| `valorPorPassagem` | Decimal(10,2) | Valor unitário |
| `data` | DateTime | Data do uso |
| `criadoEm` | DateTime | Timestamp |

---

## 🔥 Sequencia

Streak + XP + Nível de gamificação.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK único) | Dono |
| `sequenciaAtual` | Int | Dias consecutivos atuais |
| `maiorSequencia` | Int | Recorde pessoal |
| `xp` | Int | Pontos acumulados |
| `nivel` | Enum | `INICIANTE`, `CONSCIENTE`, `ESTRATEGISTA`, `INVESTIDOR` |
| `ultimaAtividade` | DateTime | Último dia com registro |
| `atualizadoEm` | DateTime | Timestamp |

---

## 🏆 Conquista

Catálogo global de conquistas (seed).

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `codigo` | VarChar(60) único | Identificador técnico (ex: `PRIMEIRA_META`) |
| `nome` | VarChar(100) | Nome visível (ex: "Sonhador") |
| `descricao` | VarChar(255) | Descrição da conquista |
| `icone` | VarChar(40) | Nome do ícone lucide |
| `criterio` | Json | Regras de desbloqueio |
| `recompensaXp` | Int | XP ao desbloquear |

---

## 🎖️ ConquistaUsuario

Conquistas desbloqueadas por cada usuário.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `conquistaId` | String (FK) | Qual conquista |
| `desbloqueadaEm` | DateTime | Quando desbloqueou |

---

## 🎲 DesafioMensal

Desafios personalizados gerados pela Gemini.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | String | Identificador |
| `usuarioId` | String (FK) | Dono |
| `titulo` | VarChar(120) | Título do desafio |
| `descricao` | VarChar(500) | Descrição |
| `criterio` | Json | Regras de avaliação |
| `mes` | Int (1-12) | Mês |
| `ano` | Int | Ano |
| `progresso` | Decimal(5,2) | Percentual (0-100) |
| `concluido` | Boolean | Foi concluído? |
| `concluidoEm` | DateTime | Quando concluiu |
| `criadoEm` | DateTime | Timestamp |

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

## 📊 Resumo Geral

| # | Categoria | Entidades | Total |
|---|---|---|---|
| 1 | 👤 Usuário | Usuario, ConfiguracaoUsuario, TokenRenovacao | 3 |
| 2 | 💳 Financeiro | Categoria, Transacao, Tag, TransacaoTag | 4 |
| 3 | 🎯 Metas | Meta, AporteMeta | 2 |
| 4 | ✈️ Viagens | Viagem, DespesaViagem | 2 |
| 5 | 💱 Câmbio | MoedaFavorita | 1 |
| 6 | 📅 Lembretes | Lembrete | 1 |
| 7 | 🚌 VT | VendaVt, UsoVt | 2 |
| 8 | 🎮 Gamificação | Sequencia, Conquista, ConquistaUsuario, DesafioMensal | 4 |
| 9 | 🤖 IA | MensagemChat, HistoricoScore | 2 |
| 10 | 👥 Grupos | Grupo, MembroGrupo, ViagemGrupo, DespesaViagemGrupo, MetaGrupo, AporteMetaGrupo, MensagemChatGrupo | 7 |
| | | **TOTAL** | **28** |

---

## 🎨 Enums Disponíveis

| Enum | Valores |
|---|---|
| `ProvedorAuth` | `EMAIL`, `GOOGLE` |
| `TipoTransacao` | `RECEITA`, `DESPESA` |
| `TipoRecurso` | `DINHEIRO`, `VA`, `VR`, `VT` |
| `StatusMeta` | `ATIVA`, `PAUSADA`, `CONCLUIDA`, `CANCELADA` |
| `TipoMeta` | `CURTO_PRAZO`, `LONGO_PRAZO` |
| `TipoCategoria` | `RECEITA`, `DESPESA` |
| `CategoriaDespesaViagem` | `TRANSPORTE`, `HOSPEDAGEM`, `ALIMENTACAO`, `PASSEIOS`, `COMPRAS`, `OUTROS` |
| `Tema` | `CLARO`, `ESCURO` |
| `AntecedenciaLembrete` | `NO_DIA`, `UM_DIA`, `TRES_DIAS` |
| `PapelGrupo` | `ADMIN`, `MEMBRO` |
| `NivelFinanceiro` | `INICIANTE`, `CONSCIENTE`, `ESTRATEGISTA`, `INVESTIDOR` |
| `ModoUso` | `ESTAGIARIO`, `CLT`, `PJ`, `PESSOA_FISICA` |
| `Prioridade` | `ALTA`, `MEDIA`, `BAIXA` |

---

## 🔗 Relações Importantes

```
Usuario (1) ──── (1) ConfiguracaoUsuario
  (1) ──── (1) Sequencia
  (1) ──── (N) Transacao ──── (N) Categoria
                        └──── (N:N) Tag
  (1) ──── (N) Meta ──── (N) AporteMeta
                    └──── (0:1) Viagem
  (1) ──── (N) Viagem ──── (N) DespesaViagem
  (1) ──── (N) Lembrete
  (1) ──── (N) VendaVt, UsoVt
  (1) ──── (N) MoedaFavorita
  (1) ──── (N) ConquistaUsuario ──── (N) Conquista
  (1) ──── (N) DesafioMensal
  (1) ──── (N) MensagemChat
  (1) ──── (N) HistoricoScore
  (N:N) ── Grupo (via MembroGrupo)

Grupo ──── (N) ViagemGrupo ──── (N) DespesaViagemGrupo
──── (N) MetaGrupo ──── (N) AporteMetaGrupo
──── (N) MensagemChatGrupo
```

---

## 📝 Notas

- **Fonte de verdade:** alterações de modelo → editar `prisma/schema.prisma` e rodar `npm run db:migrate`
- **Timestamps:** `criadoEm` e `atualizadoEm` gerenciados pelo Prisma (`@default(now())`, `@updatedAt`)
- **IDs:** `cuid()` em todas as entidades
- **Valores monetários:** `Decimal(12,2)` (ou `Decimal(10,2)` em `UsoVt.valorPorPassagem`)
- **Cores:** hex `#RRGGBB` (7 caracteres)
- **Ícones:** string com nome Lucide (ex: `UtensilsCrossed`, `Banknote`) — ver `web/src/components/badges/iconRegistry.jsx`
- **Moedas:** ISO 4217, 3 letras (`USD`, `BRL`, `EUR`)
- **Tokens Google:** criptografar em repouso antes de persistir em `tokensGoogle`
- **Recorrência:** `regraRecorrencia` armazena JSON (`frequencia`, `ateQuando`, `dataFim`), não RRULE RFC 5545
- **Nomes de tabela:** ver `@@map` em cada model no schema Prisma