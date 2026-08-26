# 📋 Pulso — Requisitos do Sistema

Documento de rastreamento dos requisitos funcionais e não funcionais do **Pulso** no escopo **TI5-pack**.

> **Última revisão:** ago/2026 (branch `TI5-pack`) — fora do escopo: VT, Relatórios produto, Gamificação, cartão/faturas, bots, casal/família, PWA/push, veículos/FIPE.  
> Dashboard (RF-007–015) e importação core (RF-134–137, RF-139) entregues; pendentes **RF-015** (quick-add/chatbot) e **RF-138** (aprendizado na importação).  
> Auditoria PO: [03-Auditorias/Product Owner/00-Sumario-Executivo.md](../03-Auditorias/Product%20Owner/00-Sumario-Executivo.md) · Técnico: [Web](../02-Engenharia/Web/Readme.md) · [API](../02-Engenharia/API/Readme.md) · [Banco](../02-Engenharia/API/Database.md) · Agents: [`.github/INDEX.md`](../../.github/INDEX.md)

---

## 📊 Progresso Geral

| Categoria | Total | Concluídos | Progresso |
|---|---|---|---|
| Requisitos Funcionais | 139 | 108 | ~78% |
| Requisitos Não Funcionais | 16 | 10 | ~63% |
| **Total** | **155** | **118** | **~76%** |

Contagem = linhas `RF-*` / `RNF-*` listadas neste documento (escopo TI5). Implementado = checkbox `[x]` (utilizável na UI/API desta branch).

**No escopo TI5:** auth, dashboard, transações, orçamento, calendário/lembretes, dívidas, metas, viagens + moedas, grupos (Premium + Socket.IO), homepage, notificações in-app, planejamento de compra, divisão de despesas, importação de extratos, Insights/Chatbot (planejados), Perfil (parcial), Onboarding (planejado), planos Free/Premium e RabbitMQ (alerts, reminders, emails).

**Módulos ainda planejados (TI5):** Onboarding guiado.

**Fora da lista de RF (entregue):** busca global de destinos (GeoNames), estimativas de passagem com ajuste sazonal, integração opcional Duffel/Amadeus, observações na viagem, tema claro/escuro na área autenticada (`UserMenu`).

---

## 📊 Progresso por Módulo

| Módulo | Total | Concluídos | Progresso |
|---|---|---|---|
| 🔐 Autenticação | 6 | 6 | ✅ |
| 📊 Dashboard | 9 | 8 | 🟡 |
| 💳 Transações | 13 | 13 | ✅ |
| 🎯 Metas | 8 | 8 | ✅ |
| 🌍 Viagens e Moedas | 11 | 11 | ✅ |
| 🤖 Insights | 9 | 0 | ⏳ |
| 💬 Chatbot | 5 | 0 | ⏳ |
| 📅 Lembretes | 6 | 6 | ✅ |
| 👤 Perfil e Configurações | 12 | 1 | 🟡 |
| 🏠 Homepage | 4 | 4 | ✅ |
| 👥 Grupos | 15 | 15 | ✅ |
| ⚙️ Não Funcionais | 16 | 10 | 🟡 |
| 📊 Orçamento Mensal | 7 | 7 | ✅ |
| 💸 Divisão de Despesas | 6 | 6 | ✅ |
| 📅 Calendário Financeiro | 5 | 5 | ✅ |
| 🤝 Dívidas Pessoais | 7 | 7 | ✅ |
| 🛒 Planejamento de Compra | 6 | 6 | ✅ |
| 🚀 Onboarding | 4 | 0 | ⏳ |
| 📥 Importação de Dados | 6 | 5 | 🟡 |


**Legenda:** ✅ módulo entregue · 🟡 parcial (UI ou backend incompleto) · ⏳ aguardando prototipação/implementação

> **Dashboard:** `GET /dashboard` + `DashboardPage` — saldos, gráficos, alertas, metas e saúde financeira. Destino pós-login: **`/dashboard`**. Pendente: **RF-015** (quick-add → chatbot).  
> **Importação:** fluxo upload → preview → confirmar (OFX/CSV/XLSX + PDF via Gemini) no modal do dashboard. Pendente: **RF-138** (aprendizado com ajustes do usuário). RF-139 (mapeamento manual de CSV) entregue.

---
## 🔐 Módulo 01 — Autenticação

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-001 | O sistema deve permitir cadastro com email e senha | 🔴 Essencial |
| - [x] | RF-002 | O sistema deve permitir login via Google OAuth 2.0 | 🔴 Essencial |
| - [x] | RF-003 | O sistema deve enviar email de confirmação ao cadastrar com email/senha | 🔴 Essencial |
| - [x] | RF-004 | O sistema deve permitir recuperação de senha via email | 🔴 Essencial |
| - [x] | RF-005 | O sistema deve manter a sessão ativa via token JWT com refresh token | 🔴 Essencial |
| - [x] | RF-006 | O sistema deve permitir logout com invalidação de sessão | 🔴 Essencial |

---

## 📊 Módulo 02 — Dashboard Principal

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-007 | O sistema deve exibir o saldo total disponível do mês corrente | 🔴 Essencial |
| - [x] | RF-008 | O sistema deve exibir saldos separados por tipo de recurso (dinheiro, VA, VR) | 🔴 Essencial |
| - [x] | RF-009 | O sistema deve exibir um gráfico de receitas vs despesas do mês | 🔴 Essencial |
| - [x] | RF-010 | O sistema deve exibir um gráfico de gastos por categoria no dashboard | 🔴 Essencial |
| - [x] | RF-011 | O sistema deve exibir um resumo das últimas transações registradas | 🟡 Importante |
| - [x] | RF-012 | O sistema deve exibir alertas visuais quando o gasto ultrapassar um limite definido | 🟡 Importante |
| - [x] | RF-013 | O sistema deve exibir o progresso resumido das metas ativas | 🟡 Importante |
| - [x] | RF-014 | O sistema deve exibir o score de saúde financeira do usuário | 🟢 Desejável |
| - [ ] | RF-015 | O sistema deve exibir um botão de acesso rápido (quick-add) no dashboard que abre o chatbot para registro de transação em linguagem natural | 🟡 Importante |

**Implementação:** `api/src/services/dashboardService.js` · `web/src/pages/DashboardPage.jsx` · destino pós-login `/dashboard`.

---

## 💳 Módulo 03 — Gestão de Transações

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-016 | O sistema deve permitir registrar receitas informando valor, data, categoria e origem (salário, VA, VR, extra) | 🔴 Essencial |
| - [x] | RF-017 | O sistema deve permitir registrar despesas informando valor, data, categoria e recurso utilizado | 🔴 Essencial |
| - [x] | RF-018 | O sistema deve oferecer categorias padrão (alimentação, transporte, lazer, educação, moradia, saúde, etc.) | 🔴 Essencial |
| - [x] | RF-019 | O sistema deve permitir o usuário criar categorias personalizadas | 🟡 Importante |
| - [x] | RF-020 | O sistema deve permitir adicionar tags livres às transações | 🟢 Desejável |
| - [x] | RF-021 | O sistema deve permitir registrar transações recorrentes com frequência configurável (semanal, mensal, etc.) | 🔴 Essencial |
| - [x] | RF-022 | O sistema deve gerar automaticamente transações recorrentes nas datas programadas | 🔴 Essencial |
| - [x] | RF-023 | O sistema deve permitir editar e excluir transações já registradas | 🔴 Essencial |
| - [x] | RF-024 | O sistema deve permitir filtrar transações por período, categoria, tipo (receita/despesa) e recurso | 🟡 Importante |
| - [x] | RF-025 | O sistema deve permitir buscar transações por descrição ou tag | 🟡 Importante |
| - [x] | RF-026 | O sistema deve validar compatibilidade entre recurso (VA/VR) e categoria da despesa | 🟡 Importante |
| - [x] | RF-027 | O sistema deve permitir registrar transferência entre recursos (ex: dinheiro → poupança) sem contabilizar como receita ou despesa nos totais | 🟡 Importante |
| - [x] | RF-028 | O sistema deve sugerir automaticamente a categoria de uma transação com base no histórico de descrições semelhantes do próprio usuário | 🟡 Importante |

---

## 🎯 Módulo 04 — Metas Financeiras

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-029 | O sistema deve permitir criar metas com nome, valor-alvo, prazo e descrição opcional | 🔴 Essencial |
| - [x] | RF-030 | O sistema deve permitir registrar aportes manuais em cada meta | 🔴 Essencial |
| - [x] | RF-031 | O sistema deve exibir o progresso da meta com barra visual e percentual | 🔴 Essencial |
| - [x] | RF-032 | O sistema deve calcular e sugerir quanto guardar por mês/semana para atingir a meta no prazo | 🟡 Importante |
| - [x] | RF-033 | O sistema deve permitir categorizar metas como curto prazo ou longo prazo | 🟡 Importante |
| - [x] | RF-034 | O sistema deve permitir pausar, editar e concluir metas | 🟡 Importante |
| - [x] | RF-035 | O sistema deve notificar quando uma meta for atingida | 🟢 Desejável |
| - [x] | RF-036 | O sistema deve oferecer uma meta especial de "Reserva de Emergência", sugerindo o valor-alvo com base em X meses do gasto médio mensal do usuário | 🟡 Importante |

---

## 🌍 Módulo 05 — Viagens e Simulador de Moedas

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-037 | O sistema deve exibir cotações atualizadas das principais moedas (USD, EUR, GBP, ARS, etc.) | 🔴 Essencial |
| - [x] | RF-038 | O sistema deve permitir converter um valor em BRL para qualquer moeda disponível e vice-versa | 🔴 Essencial |
| - [x] | RF-039 | O sistema deve exibir gráfico de histórico de cotação de uma moeda selecionada | 🟡 Importante |
| - [x] | RF-040 | O sistema deve permitir salvar moedas favoritas para acesso rápido | 🟢 Desejável |
| - [x] | RF-041 | O sistema deve permitir criar um planejamento de viagem com nome do destino, moeda local e data prevista | 🔴 Essencial |
| - [x] | RF-042 | O sistema deve permitir adicionar pretensões de gastos por categoria dentro da viagem (transporte, hospedagem, alimentação, passeios, compras) | 🔴 Essencial |
| - [x] | RF-043 | O sistema deve calcular o custo total da viagem somando todas as pretensões cadastradas | 🔴 Essencial |
| - [x] | RF-044 | O sistema deve converter o custo total da viagem para BRL com base na cotação atual da moeda do destino | 🔴 Essencial |
| - [x] | RF-045 | O sistema deve permitir editar e remover pretensões individuais dentro da viagem | 🟡 Importante |
| - [x] | RF-046 | O sistema deve permitir criar múltiplas viagens simultâneas | 🟡 Importante |
| - [x] | RF-047 | O sistema deve vincular uma viagem a uma meta financeira existente para acompanhar o progresso | 🟢 Desejável |

> **Nota (jul/2026):** RF-037 usa fonte gratuita (AwesomeAPI/Frankfurter) com **cache de 5 minutos por instância** (memória local). Em serverless o cache efetivo pode ser menor — ver achado T5. Termo "tempo real" foi removido.

---

## 🤖 Módulo 06 — Inteligência (Insights e Chatbot)

### Insights

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-048 | O sistema deve gerar um resumo mensal em linguagem natural analisando receitas, despesas e padrões | 🔴 Essencial |
| - [ ] | RF-049 | O sistema deve identificar categorias onde o gasto aumentou em relação ao mês anterior | 🔴 Essencial |
| - [ ] | RF-050 | O sistema deve gerar sugestões personalizadas de economia com base no perfil e histórico | 🟡 Importante |
| - [ ] | RF-051 | O sistema deve gerar alertas preditivos (ex: "No ritmo atual, seu VA acaba dia 22") | 🟡 Importante |
| - [ ] | RF-052 | O sistema deve gerar um score de saúde financeira (0-100) com base nos hábitos do usuário | 🟡 Importante |
| - [ ] | RF-053 | O sistema deve gerar projeções futuras em 3 cenários (otimista, atual, pessimista) para 3, 6 e 12 meses | 🟡 Importante |
| - [ ] | RF-054 | O sistema deve exibir em quanto tempo o usuário ficará negativo caso mantenha o ritmo atual de gastos | 🟡 Importante |
| - [ ] | RF-055 | O sistema deve exibir comparações "você vs você mesmo" (mês atual vs média dos meses anteriores, por categoria e no total) | 🟡 Importante |
| - [ ] | RF-056 | O sistema deve oferecer uma revisão semanal guiada com resumo da semana e confirmação/ajuste das transações registradas | 🟡 Importante |

### Chatbot

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-057 | O sistema deve disponibilizar um chatbot financeiro acessível via interface de chat | 🔴 Essencial |
| - [ ] | RF-058 | O sistema deve permitir perguntas em linguagem natural sobre transações, saldos, metas e categorias | 🔴 Essencial |
| - [ ] | RF-059 | O sistema deve contextualizar as respostas do chatbot com os dados reais do usuário | 🔴 Essencial |
| - [ ] | RF-060 | O sistema deve limitar o chatbot a responder apenas sobre finanças, recusando perguntas fora do escopo | 🟡 Importante |
| - [ ] | RF-061 | O sistema deve exibir histórico da conversa do chatbot na sessão atual | 🟢 Desejável |

> **Nota de custo (jul/2026):** IA via **Gemini Flash** (free tier). Resumos mensais são **cacheados** (gerados 1×/mês, não a cada abertura) e o chatbot tem rate limit por usuário. Insights simples continuam **rule-based** (fora do LLM) sempre que possível.

---

## 📅 Módulo 07 — Lembretes e Google Agenda

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-062 | O sistema deve permitir o usuário conectar sua conta Google para integração com o Google Calendar | 🔴 Essencial |
| - [x] | RF-063 | O sistema deve permitir criar lembretes de contas a pagar com data e valor | 🔴 Essencial |
| - [x] | RF-064 | O sistema deve sincronizar lembretes criados como eventos no Google Calendar | 🔴 Essencial |
| - [x] | RF-065 | O sistema deve permitir o usuário ativar/desativar a integração com Google Agenda a qualquer momento | 🔴 Essencial |
| - [x] | RF-066 | O sistema deve permitir configurar antecedência do lembrete (1 dia antes, no dia, etc.) | 🟡 Importante |
| - [x] | RF-067 | O sistema deve importar alterações feitas no Google Calendar de volta para o Pulso (título, data) ao abrir o mês ou após sync manual | 🟡 Importante |

> **Nota (ago/2026):** RF-067 formaliza a importação Google → Pulso já implementada em `importarAlteracoesDoGoogle`. Correção RF-NOVO-G1: falha de sync na **criação** preserva o lembrete com `sincronizado: false` (RN-097).

## 👤 Módulo 08 — Perfil e Configurações

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-068 | O sistema deve permitir o usuário editar nome, email e foto de perfil | 🔴 Essencial |
| - [ ] | RF-069 | O sistema deve permitir alteração de senha para contas com email/senha | 🔴 Essencial |
| - [ ] | RF-070 | O sistema deve permitir configurar receitas fixas mensais (salário, VA, VR) para preenchimento automático | 🔴 Essencial |
| - [x] | RF-071 | O sistema deve permitir alternar entre tema claro e escuro | 🟡 Importante |
| - [ ] | RF-072 | O sistema deve permitir o usuário excluir sua conta e todos os dados associados | 🔴 Essencial |
| - [ ] | RF-073 | O sistema deve permitir selecionar o modo de uso: Estagiário, CLT ou Freelancer | 🔴 Essencial |
| - [ ] | RF-074 | O sistema deve adaptar a interface e funcionalidades visíveis conforme o modo selecionado (ex: benefícios VA/VR ocultos no modo Pessoa Física) | 🟡 Importante |
| - [ ] | RF-075 | (Freelancer) O sistema deve permitir configurar reserva automática de um percentual de cada receita para impostos (DAS/INSS), separando esse valor do saldo disponível | 🟡 Importante |
| - [ ] | RF-076 | (Freelancer) O sistema deve tratar renda irregular usando média móvel dos últimos meses em vez de salário fixo nas projeções e sugestões | 🟡 Importante |
| - [ ] | RF-077 | (Freelancer) O sistema deve permitir separar contas/recursos PJ e PF | 🟢 Desejável |
| - [ ] | RF-078 | (CLT) O sistema deve prever 13º salário e férias como receitas futuras no calendário e nas projeções | 🟡 Importante |
| - [ ] | RF-079 | (CLT) O sistema deve permitir registrar o saldo de FGTS de forma informativa (não contabilizado no saldo disponível) | 🟢 Desejável |

---

## 🏠 Módulo 09 — Homepage (Landing Page)

> **Status:** landing pública implementada em `LandingPage.jsx` com hero, features, benefícios, depoimentos e CTAs.

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-080 | O sistema deve exibir uma homepage pública apresentando o Pulso, suas funcionalidades e benefícios | 🔴 Essencial |
| - [x] | RF-081 | A homepage deve conter botões de chamada para ação (Cadastrar e Entrar) | 🔴 Essencial |
| - [x] | RF-082 | A homepage deve exibir seções com os principais módulos do sistema (dashboard, metas, viagens, insights, chatbot, grupos) | 🟡 Importante |
| - [x] | RF-083 | A homepage deve ser responsiva e atraente visualmente com a paleta Vital Purple | 🔴 Essencial |

---

## 👥 Módulo 10 — Grupos

> Detalhamento técnico e gaps: [Modulos/Grupos.md](../../02-Engenharia/Modulos/Grupos.md)

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-084 | O sistema deve permitir criar um grupo com nome e descrição | 🔴 Essencial |
| - [x] | RF-085 | O sistema deve gerar um link/código de convite para o grupo | 🔴 Essencial |
| - [x] | RF-086 | O sistema deve permitir entrar em um grupo via link/código de convite | 🔴 Essencial |
| - [x] | RF-087 | O sistema deve permitir que o criador do grupo defina um papel para cada membro (admin ou membro) | 🟡 Importante |
| - [x] | RF-088 | O sistema deve permitir vincular uma viagem ao grupo para planejamento compartilhado | 🔴 Essencial |
| - [x] | RF-089 | O sistema deve permitir que membros do grupo adicionem pretensões de gastos na viagem compartilhada | 🔴 Essencial |
| - [x] | RF-090 | O sistema deve calcular o custo total da viagem do grupo somando pretensões de todos os membros | 🔴 Essencial |
| - [x] | RF-091 | O sistema deve exibir quanto cada membro deve contribuir para a viagem | 🟡 Importante |
| - [x] | RF-092 | O sistema deve permitir criar metas financeiras compartilhadas no grupo | 🟡 Importante |
| - [x] | RF-093 | O sistema deve permitir que cada membro faça aportes individuais na meta do grupo | 🟡 Importante |
| - [x] | RF-094 | O sistema deve manter os perfis e finanças pessoais completamente separados dos dados do grupo | 🔴 Essencial |
| - [x] | RF-095 | O sistema deve permitir o membro sair do grupo a qualquer momento | 🔴 Essencial |
| - [x] | RF-096 | O sistema deve permitir o admin remover membros do grupo | 🟡 Importante |
| - [x] | RF-097 | O sistema deve exibir um painel do grupo com resumo das viagens e metas compartilhadas | 🟡 Importante |
| - [x] | RF-098 | O sistema deve permitir chat/mensagens dentro do grupo | 🟢 Desejável |

**RF-091:** toggle *Por pretensão* / *Divisão igual* no card viagem, persistido no servidor (`grupos.modo_divisao`). "Quem paga quem" (acerto de contas) e split custom por % → módulo **Divisão de Despesas** (`/expense-split`, RF-106–120), a vincular depois.

**RF-098:** chat em tempo real via **Socket.IO** (API long-running). Grupos exigem plano **Premium**. Ver [Modulos/Grupos.md](../../02-Engenharia/Modulos/Grupos.md) e [TI5-Hospedagem.md](../../02-Engenharia/Deploy/TI5-Hospedagem.md).

---
## 📊 Módulo 11 — Orçamento Mensal

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-099 | O sistema deve permitir definir um limite mensal de gasto por categoria | 🔴 Essencial |
| - [x] | RF-100 | O sistema deve exibir barra de progresso do gasto atual vs limite definido por categoria | 🔴 Essencial |
| - [x] | RF-101 | O sistema deve alertar quando o gasto atingir 80% do limite de uma categoria | 🟡 Importante |
| - [x] | RF-102 | O sistema deve alertar quando o gasto estourar o limite de uma categoria | 🔴 Essencial |
| - [x] | RF-103 | O sistema deve permitir editar os limites de orçamento a qualquer momento | 🟡 Importante |
| - [x] | RF-104 | O sistema deve exibir um resumo visual de quanto ainda pode gastar por categoria no mês | 🔴 Essencial |
| - [x] | RF-105 | O sistema deve permitir "rollover" de orçamento: o valor não gasto de uma categoria acumula no limite do mês seguinte (ativável por categoria) | 🟡 Importante |
---
## 💸 Módulo 12 — Divisão de Despesas

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-106 | O sistema deve permitir registrar uma despesa compartilhada informando valor total e participantes | 🔴 Essencial |
| - [x] | RF-107 | O sistema deve calcular automaticamente quanto cada participante deve | 🔴 Essencial |
| - [x] | RF-108 | O sistema deve permitir divisão igualitária ou por valores personalizados | 🟡 Importante |
| - [x] | RF-109 | O sistema deve permitir marcar quem já pagou sua parte | 🔴 Essencial |
| - [x] | RF-110 | O sistema deve exibir saldo consolidado (quanto me devem vs quanto eu devo) | 🟡 Importante |
| - [x] | RF-111 | O sistema deve permitir enviar lembrete de cobrança para participantes do grupo | 🟢 Desejável |

**Notas:** módulo standalone (`/expense-split`), participantes por nome livre (mesmo padrão de Dívidas Pessoais — sem exigir conta Pulso); rateio igual usa aritmética de centavos determinística (RNF-016); "lembrete de cobrança" (RN-086) cria um `Lembrete` de calendário real pro organizador (autolembrete), vinculado a 1+ participantes via relação N:N (`Lembrete.divisaoParticipantes`, tabela `_DivisaoParticipanteToLembrete`) — um único lembrete pode cobrir vários participantes pendentes de uma mesma divisão. O lembrete é cancelado automaticamente quando todos os participantes que ele cobre quitam suas partes, e é excluído junto se a divisão for excluída antes de ser quitada. Integração com o toggle de RF-091 (Grupos) fica para depois, como já documentado em [Modulos/Grupos.md](../../02-Engenharia/Modulos/Grupos.md).
---
## 📅 Módulo 13 — Calendário Financeiro

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-112 | O sistema deve exibir um calendário mensal visual com marcadores de transações por dia | 🔴 Essencial |
| - [x] | RF-113 | O sistema deve diferenciar visualmente dias com receitas (verde), despesas (vermelho) e ambos (roxo) | 🔴 Essencial |
| - [x] | RF-114 | O sistema deve exibir os dias de recebimento fixo (salário, VA, VR) destacados no calendário | 🟡 Importante |
| - [x] | RF-115 | O sistema deve exibir vencimentos de contas/lembretes no calendário | 🟡 Importante |
| - [x] | RF-116 | O sistema deve permitir clicar em um dia para ver o detalhe das transações daquele dia | 🔴 Essencial |
---
## 🤝 Módulo 14 — Dívidas Pessoais

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-117 | O sistema deve permitir registrar um empréstimo feito a alguém (quem me deve) com valor, pessoa e data | 🔴 Essencial |
| - [x] | RF-118 | O sistema deve permitir registrar um empréstimo recebido de alguém (quem eu devo) com valor, pessoa e data | 🔴 Essencial |
| - [x] | RF-119 | O sistema deve permitir definir prazo de devolução para cada dívida | 🟡 Importante |
| - [x] | RF-120 | O sistema deve permitir marcar uma dívida como paga/devolvida | 🔴 Essencial |
| - [x] | RF-121 | O sistema deve exibir saldo consolidado: total que me devem vs total que eu devo | 🔴 Essencial |
| - [x] | RF-122 | O sistema deve exibir histórico completo de empréstimos (ativos e quitados) | 🟡 Importante |
| - [x] | RF-123 | O sistema deve alertar quando uma dívida estiver próxima do vencimento | 🟢 Desejável |
---
## 🛒 Módulo 15 — Planejamento de Compra

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-124 | O sistema deve permitir registrar um item desejado com nome, valor e prioridade | 🔴 Essencial |
| - [x] | RF-125 | O sistema deve calcular em quanto tempo o usuário poderá comprar o item baseado na sobra mensal atual | 🔴 Essencial |
| - [x] | RF-126 | O sistema deve simular cenários de compra à vista vs parcelado (com quantidade de parcelas) | 🟡 Importante |
| - [x] | RF-127 | O sistema deve alertar sobre o percentual da renda comprometido com parcelas | 🟡 Importante |
| - [x] | RF-128 | O sistema deve permitir vincular um planejamento de compra a uma meta financeira | 🟢 Desejável |
| - [x] | RF-129 | O sistema deve permitir marcar um item como "comprado" e registrar a transação automaticamente | 🟡 Importante |
---
## 🚀 Módulo 16 — Onboarding

> **Objetivo:** eliminar o "cold start" — o usuário não pode ver tudo zerado no dia 1. Guiar a carga inicial de dados de forma rápida e opcional.

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-130 | O sistema deve exibir um wizard de onboarding guiado após o primeiro login/cadastro | 🔴 Essencial |
| - [ ] | RF-131 | O sistema deve permitir informar o saldo inicial atual por recurso (dinheiro, VA, VR) manualmente | 🔴 Essencial |
| - [ ] | RF-132 | O sistema deve permitir selecionar o modo de uso (Estagiário/CLT/Freelancer) durante o onboarding | 🔴 Essencial |
| - [ ] | RF-133 | O onboarding deve oferecer duas rotas de carga inicial: (a) importar extratos (banco/VA/VR) ou (b) informar saldos manualmente — permitindo pular a etapa | 🔴 Essencial |
---
## 📥 Módulo 17 — Importação de Dados

> **Objetivo:** ser o "Open Banking dos pobres" — carga inicial e recorrente de transações a partir de arquivos, sem custo de integração bancária. Usado tanto no onboarding quanto continuamente.

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-134 | O sistema deve permitir importar extrato bancário nos formatos PDF, OFX e CSV | 🔴 Essencial |
| - [x] | RF-135 | O sistema deve permitir importar extratos de VA e VR (CSV/planilha/PDF), atribuindo as transações ao recurso correto | 🟡 Importante |
| - [x] | RF-136 | O sistema deve exibir um preview editável das transações detectadas antes de confirmar a importação | 🔴 Essencial |
| - [x] | RF-137 | O sistema deve detectar e sinalizar transações potencialmente duplicadas (mesma data, valor e descrição), permitindo ignorá-las | 🔴 Essencial |
| - [ ] | RF-138 | O sistema deve categorizar automaticamente as transações importadas por regras de descrição (ex: "IFOOD" → Alimentação), aprendendo com ajustes do usuário | 🟡 Importante |
| - [x] | RF-139 | O sistema deve permitir o mapeamento manual de colunas (data, valor, descrição) para CSVs de formato desconhecido | 🟡 Importante |

**Fluxo previsto:** upload → parse (OFX nativo / CSV com detecção de delimitador e encoding) → normalização → dedupe (hash de data+valor+descrição, comparando com transações existentes) → categorização por regras → **preview editável** → confirmação → gravação em lote. Regras de categorização ficam num dicionário editável por usuário (alimenta o RF-028).

**Status atual (ago/2026):** `POST /importacoes/analisar` + `POST /importacoes/confirmar` · parsers OFX/CSV/XLSX · PDF via **Gemini** (`GEMINI_API_KEY_PDF`) · preview editável no dashboard · dedupe RF-137 · categorização inicial por regras + histórico (RF-028).

---
## ⚙️ Requisitos Não Funcionais

| Status | Código | Requisito | Categoria | Prioridade |
|---|---|---|---|---|
| - [ ] | RNF-001 | O sistema deve responder a qualquer requisição em no máximo 2 segundos em condições normais | Performance | 🔴 Essencial |
| - [x] | RNF-002 | O sistema deve armazenar senhas com hash bcrypt com salt rounds ≥ 12 | Segurança | 🔴 Essencial |
| - [x] | RNF-003 | Toda comunicação deve ser feita via HTTPS | Segurança | 🔴 Essencial |
| - [ ] | RNF-004 | O sistema deve implementar rate limiting para prevenir abuso de APIs (máx. 100 req/min por usuário) | Segurança | 🔴 Essencial |
| - [x] | RNF-005 | O sistema deve validar e sanitizar toda entrada de dados no backend para prevenir SQL Injection e XSS | Segurança | 🔴 Essencial |
| - [x] | RNF-006 | O front-end deve ser responsivo e funcional em telas de 360px até 1920px | Usabilidade | 🔴 Essencial |
| - [ ] | RNF-007 | O sistema deve suportar no mínimo 500 usuários simultâneos dentro do free tier | Escalabilidade | 🟡 Importante |
| - [ ] | RNF-008 | O banco de dados deve ter backup automático (recurso nativo do Neon) | Confiabilidade | 🔴 Essencial |
| - [ ] | RNF-009 | O sistema deve ter disponibilidade mínima de 95% mensal | Disponibilidade | 🟡 Importante |
| - [ ] | RNF-010 | O sistema deve seguir padrões de acessibilidade WCAG 2.1 nível A (contraste, navegação por teclado, aria-labels) | Acessibilidade | 🟡 Importante |
| - [x] | RNF-011 | O código deve seguir arquitetura em camadas com separação clara entre controllers, services e repositories | Manutenibilidade | 🔴 Essencial |
| - [x] | RNF-012 | O sistema deve utilizar variáveis de ambiente para todas as chaves e credenciais sensíveis | Segurança | 🔴 Essencial |
| - [x] | RNF-013 | Os tokens JWT devem expirar em 15 minutos com refresh token de 7 dias | Segurança | 🔴 Essencial |
| - [x] | RNF-014 | O sistema deve implementar CORS configurado apenas para origens permitidas | Segurança | 🔴 Essencial |
| - [x] | RNF-015 | O sistema deve manter cobertura mínima de 85% de testes unitários nas camadas de serviço, podendo ser superior | Qualidade | 🔴 Essencial |
| - [x] | RNF-016 | Todo valor monetário deve ser armazenado como decimal de precisão fixa (nunca float/double), para evitar erros de arredondamento em rateios, parcelas e câmbio | Confiabilidade | 🔴 Essencial |

> **⚠️ Tensão free tier (jul/2026):** RNF-001 (≤2s "sempre"), RNF-007 (500 simultâneos) e RNF-009 (95% uptime) são **aspiracionais** no free tier (Vercel Hobby + Neon com autosuspend/cold start). Documentado como limite conhecido; metas serão revisadas se/quando houver upgrade de infra.
>
> **RNF-003:** Vercel provisiona TLS e força HTTPS automaticamente em todos os domínios (produção e preview); não há configuração própria a fazer.
>
> **RNF-016:** já cumprida desde o schema inicial — todo campo monetário no Prisma usa `Decimal @db.Decimal(12,2)` (nunca `Float`), inclusive em rateios/parcelas/câmbio.

---

## 📌 Notas de implementação (atualizado ago/2026 — TI5-pack)

| Item | Situação |
|------|----------|
| RF-019 | CRUD de categorias personalizadas com **ícone e cor** (padrão Lucide + paleta). UI em Transações → **Categorias** |
| RF-027 | Transferência unificada na própria tabela `Transacao` (`tipo = TRANSFERENCIA`, `recursoDestino`, `categoriaId` nulo); novo recurso `POUPANCA`. Excluída dos totais de receita/despesa (`montarResumo`) e dos marcadores do Calendário |
| RF-114 | Lógica em `fixedIncomeUtils.js`: marcador azul no grid + lista no painel do dia conforme `configuracoes_usuario` (valor/dia por tipo). VA/VR conforme `modoUso`. **Coleta dos dados:** onboarding (RF-070/RF-130); sem tela de config manual por enquanto |
| RF-071 | Toggle claro/escuro na **landing** (`PublicHeader`) e na área autenticada (**`UserMenu`**); preferência em `ds-theme-preference` (legado `ds-theme`) |
| RF-073 / RF-074 | `modoUso` no cadastro/onboarding; sidebar filtra itens por modo (`filterSidebarByUser`); tela de perfil/configurações ainda pendente |
| RF-015 | Quick-add planejado como FAB no dashboard, reutilizando o parser em linguagem natural do chatbot (Gemini Flash) |
| RF-028 | Sugestão de categoria via similaridade de texto (coeficiente de Dice sobre bigramas) com o histórico do próprio usuário. Preenchimento automático discreto no formulário de transação (apenas ao criar) |
| RF-134–137 / RF-139 | Importação entregue — `POST /importacoes/analisar` + `/confirmar`, parsers OFX/CSV/XLSX/PDF, preview no dashboard, dedupe, mapeamento manual de colunas |
| RF-138 (futuro) | Import de extratos deve reaproveitar/alimentar o mesmo motor de sugestão do RF-028 (aprendizado com ajustes) |
| Cron / jobs agendados | Jobs diários via cron; com `RABBITMQ_URL`, alertas/lembretes/e-mails passam pelas filas `pulso.alerts`, `pulso.reminders`, `pulso.emails` (fail-soft) |
| Cotações (RF-037) | Fonte gratuita (AwesomeAPI/Frankfurter) com cache de **5 minutos** por instância (memória) |
| OCR de cupons | **Descartado** — custo/complexidade sem retorno para o escopo gratuito |
| Open Banking | **Descartado** — substituído pelo módulo de Importação (OFX/CSV/PDF) |
| Páginas implementadas | `/` (landing), **`/dashboard`**, `/transactions`, `/budget`, `/calendar`, `/debts`, `/goals`, `/trips`, **`/groups`**, **`/groups/:id`**, **`/expense-split`**, **`/purchase-planning`** |
| Grupos (RF-084–102) | Lista, detalhe, membros, metas, viagem compartilhada, RF-091, **chat Socket.IO**, **Premium**, rate limit em preview/entrar — acerto de contas em **`/expense-split`** — [Modulos/Grupos.md](../../02-Engenharia/Modulos/Grupos.md) |
| Metas (RF-029–031) | CRUD, aportes, pausar/concluir, vínculo viagem; `META_ATINGIDA` pessoal e grupo |
| Viagens (RF-037–043) | Moedas, CRUD, despesas por categoria, total em BRL, observações, GeoNames, estimativas de passagem; **Premium** no gate desta branch |
| Dívidas (RF-117–132) | CRUD em `/debts`; job `DIVIDA_COBRANCA`; limpeza de quitadas após 180 dias |
| Notificações | Orçamento, lembretes, dívidas, transações, insight MVP, grupos — sino paginado (20), retenção 30d lidas |
| Google Calendar | Sync Pulso ↔ Google; marcar pago remove evento; sync detalhado de mês exige Premium nesta branch |
| Lembretes recorrentes | UI "Repetir todo mês"; job diário gera instâncias mensais |
| Tags | CRUD em Transações → **Tags**; criação sob demanda na transação |
| Calendário + IA | Tela entregue; integração com IA (Gemini) na página do calendário **pendente** |
| Banco / API | Schema Prisma; API expõe auth, transações, orçamento, lembretes, calendário, dívidas, metas, viagens, moedas, dashboard, importações, planejamento de compra, grupos (Premium), notificações |
| Planos Free/Premium | Gate Premium em grupos (+ chat) e viagens; demo via `PATCH /auth/me/plano` (sem billing) |

### Infraestrutura TI5 (fora da numeração clássica de RF)

| Item | Situação |
|------|----------|
| RabbitMQ | Filas `pulso.alerts`, `pulso.reminders` e `pulso.emails`; fallback modo direto sem `RABBITMQ_URL` |
| Socket.IO | Chat de grupos em tempo real (`/api/socket.io`) |
| Hospedagem | Web Vercel + API long-running — [TI5-Hospedagem.md](../../02-Engenharia/Deploy/TI5-Hospedagem.md) |

### Implementações técnicas fora da lista de RF (dívida / melhorias futuras)

| Item | Situação |
|------|----------|
| Rate limiting global (RNF-004) | Auth + **preview/entrar de Grupos** (`grupoInviteCodeRateLimit`, 20/min por usuário) |
| Renda mensal unificada | `userFinanceUtils.obterRendaMensalPlanejada` — Orçamento + Planejamento de Compra |
| Pós-login | `DEFAULT_AUTHENTICATED_ROUTE` = **`/dashboard`** |
| Migrations | Incluem freemium (`plano`) e demais — aplicar com `prisma migrate deploy` |
| Tokens Google em repouso | ✅ AES-256-GCM (`api/src/utils/googleTokenCrypto.js`) |
| Cobertura de testes (RNF-015) | API: limiares Jest (~85%+ em services/utils/jobs selecionados); Web: Vitest (~65%+) |
| Tags CRUD completo | Entregue; merge de duplicatas opcional pós-MVP |

### Tags — posicionamento

O fluxo atual (criar tag ao digitar na transação, reutilizar no catálogo, ícone/cor padrão) é **adequado para o MVP**. Edição/exclusão e merge de tags duplicadas podem entrar com a tela de configurações.

---

## 🎨 Paleta de Cores — Vital Purple

### ☀️ Modo Claro

| Token | Hex | Uso |
|---|---|---|
| primary | `#7C3AED` | Cor principal, botões, links, destaques |
| primary-light | `#A78BFA` | Hover, estados secundários |
| primary-dark | `#5B21B6` | Texto sobre fundo claro, ênfase |
| background | `#FAFAFA` | Fundo geral da aplicação |
| surface | `#F4F4F5` | Fundo de cards e containers |
| text-primary | `#18181B` | Texto principal |
| text-secondary | `#71717A` | Texto secundário, labels |
| border | `#E4E4E7` | Bordas de cards, inputs, divisores |
| success | `#10B981` | Receitas, metas concluídas, positivo |
| danger | `#EF4444` | Despesas, alertas críticos, erros |
| warning | `#F59E0B` | Alertas, atenção |
| info | `#3B82F6` | Informações, dicas, links secundários |

### 🌙 Modo Escuro

| Token | Hex | Uso |
|---|---|---|
| primary | `#A78BFA` | Cor principal luminosa |
| primary-light | `#C4B5FD` | Hover, estados secundários |
| primary-dark | `#7C3AED` | Base, ênfase |
| background | `#09090B` | Fundo geral |
| surface | `#18181B` | Fundo de cards |
| text-primary | `#FAFAFA` | Texto principal |
| text-secondary | `#A1A1AA` | Texto secundário |
| border | `#27272A` | Bordas |
| success | `#34D399` | Receitas, positivo |
| danger | `#F87171` | Despesas, erros |
| warning | `#FBBF24` | Alertas |
| info | `#60A5FA` | Informações |

### 📊 Cores para Gráficos

| Ordem | Nome | Light | Dark |
|---|---|---|---|
| 1 | Roxo | `#7C3AED` | `#A78BFA` |
| 2 | Ciano | `#06B6D4` | `#22D3EE` |
| 3 | Rosa | `#EC4899` | `#F472B6` |
| 4 | Âmbar | `#F59E0B` | `#FBBF24` |
| 5 | Verde | `#10B981` | `#34D399` |
| 6 | Azul | `#3B82F6` | `#60A5FA` |
| 7 | Laranja | `#F97316` | `#FB923C` |
| 8 | Teal | `#14B8A6` | `#2DD4BF` |

### 💳 Cores dos Cards de Recurso

| Card | BG Light | Border Light | Ícone Light | BG Dark | Border Dark | Ícone Dark |
|---|---|---|---|---|---|---|
| 💵 Salário | `#F5F3FF` | `#DDD6FE` | `#7C3AED` | `#1E1B4B` | `#3730A3` | `#A78BFA` |
| 🍎 VA | `#ECFDF5` | `#A7F3D0` | `#059669` | `#022C22` | `#065F46` | `#34D399` |
| 🍽️ VR | `#FFF7ED` | `#FED7AA` | `#EA580C` | `#431407` | `#9A3412` | `#FB923C` |

### 💚 Score de Saúde Financeira

| Faixa | Label | Cor Light | Cor Dark |
|---|---|---|---|
| 0-30 | Crítico | `#EF4444` | `#F87171` |
| 31-50 | Alerta | `#F59E0B` | `#FBBF24` |
| 51-70 | Regular | `#3B82F6` | `#60A5FA` |
| 71-90 | Bom | `#10B981` | `#34D399` |
| 91-100 | Excelente | `#7C3AED` | `#A78BFA` |

---

## 📊 Distribuição por Prioridade

Contagem dos **139 requisitos funcionais** ativos no escopo TI5 (linhas RF deste arquivo).

| Prioridade | Quantidade | Percentual |
|---|---|---|
| 🔴 Essencial | 73 | 53% |
| 🟡 Importante | 54 | 39% |
| 🟢 Desejável | 12 | 9% |
| **Total** | **139** | **100%** |

---

## 🔮 Roadmap Futuro

- [ ] 🌐 Multi-idioma (i18n) — PT-BR, EN, ES
- [ ] 📊 Dashboard customizável (drag and drop de widgets)
- [ ] 📺 Gestão de Assinaturas — detectar assinaturas recorrentes, alertar "assinaturas fantasma" e somar custo anual (candidato a módulo formal; reaproveita RF-021/021)
- [ ] 📈 Patrimônio & Investimentos — patrimônio líquido (ativos − passivos), cotações via brapi.dev/CoinGecko (grátis)
- [ ] 🏦 Simulador de Financiamentos — SAC vs Price, comparar propostas, simular antecipação/quitação
- [ ] 📱 **App mobile nativo** (Flutter) — mesma API REST + Socket.IO (objetivo do trabalho)

> **Fora do escopo TI5:** cartão/faturas, bots, modo casal/família, PWA/push web, veículos/FIPE; também fora: gestão de vale-transporte, relatórios produto e gamificação.
>
> **Itens descartados:** Open Banking (custo), OCR de cupons (custo/complexidade), bot WhatsApp.
