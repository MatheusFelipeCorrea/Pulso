# 📋 Pulso — Requisitos do Sistema

Documento de rastreamento de todos os requisitos funcionais e não funcionais do sistema **Pulso**.

> **Última revisão:** código alinhado a **ago/2026** — Dashboard (RF-007–014) e importação core (RF-155–158, RF-160) entregues; pendentes **RF-139** (quick-add/chatbot) e **RF-159** (aprendizado de categorização na importação).  
> Auditoria PO: [03-Auditorias/Product Owner/00-Sumario-Executivo.md](../03-Auditorias/Product%20Owner/00-Sumario-Executivo.md) · Técnico: [Web](../02-Engenharia/Web/Readme.md) · [API](../02-Engenharia/API/Readme.md) · [Banco](../02-Engenharia/API/Database.md) · Agents: [`.github/INDEX.md`](../../.github/INDEX.md)

---

## 📊 Progresso Geral

| Categoria | Total | Concluídos | Progresso |
|---|---|---|---|
| Requisitos Funcionais | 195 | 107 | ~55% |
| Requisitos Não Funcionais | 16 | 10 | ~63% |
| **Total** | **211** | **117** | **~55%** |

Contagem considera requisitos **implementados e utilizáveis**. Escopo TI5: auth, dashboard, transações, orçamento, calendário/lembretes, dívidas, metas, viagens + moedas, grupos (Premium + Socket.IO), homepage, notificações, planejamento de compra, divisão de despesas, importação de extratos, planos Free/Premium e mensageria RabbitMQ (alerts, reminders, emails).

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
| 🤖 Insights | 9 | 0 |  |
| 💬 Chatbot | 5 | 0 |  |
| 📅 Lembretes | 5 | 5 | ✅ |
| 👤 Perfil e Configurações | 13 | 1 | 🟡 |
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

> **Dashboard:** `GET /dashboard` + `DashboardPage` — saldos, gráficos, alertas, metas e saúde financeira. Destino pós-login: **`/dashboard`**. Pendente: **RF-139** (quick-add → chatbot).  
> **Importação:** fluxo upload → preview → confirmar (OFX/CSV/XLSX + PDF via Gemini) no modal do dashboard. Pendente: **RF-159** (aprendizado com ajustes do usuário). RF-160 (mapeamento manual de CSV) entregue.

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
| - [ ] | RF-139 | O sistema deve exibir um botão de acesso rápido (quick-add) no dashboard que abre o chatbot para registro de transação em linguagem natural | 🟡 Importante |

**Implementação:** `api/src/services/dashboardService.js` · `web/src/pages/DashboardPage.jsx` · destino pós-login `/dashboard`.

---

## 💳 Módulo 03 — Gestão de Transações

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-015 | O sistema deve permitir registrar receitas informando valor, data, categoria e origem (salário, VA, VR, VT, extra) | 🔴 Essencial |
| - [x] | RF-016 | O sistema deve permitir registrar despesas informando valor, data, categoria e recurso utilizado | 🔴 Essencial |
| - [x] | RF-017 | O sistema deve oferecer categorias padrão (alimentação, transporte, lazer, educação, moradia, saúde, etc.) | 🔴 Essencial |
| - [x] | RF-018 | O sistema deve permitir o usuário criar categorias personalizadas | 🟡 Importante |
| - [x] | RF-019 | O sistema deve permitir adicionar tags livres às transações | 🟢 Desejável |
| - [x] | RF-020 | O sistema deve permitir registrar transações recorrentes com frequência configurável (semanal, mensal, etc.) | 🔴 Essencial |
| - [x] | RF-021 | O sistema deve gerar automaticamente transações recorrentes nas datas programadas | 🔴 Essencial |
| - [x] | RF-022 | O sistema deve permitir editar e excluir transações já registradas | 🔴 Essencial |
| - [x] | RF-023 | O sistema deve permitir filtrar transações por período, categoria, tipo (receita/despesa) e recurso | 🟡 Importante |
| - [x] | RF-024 | O sistema deve permitir buscar transações por descrição ou tag | 🟡 Importante |
| - [x] | RF-025 | O sistema deve validar compatibilidade entre recurso (VA/VR) e categoria da despesa | 🟡 Importante |
| - [x] | RF-140 | O sistema deve permitir registrar transferência entre recursos (ex: dinheiro → poupança) sem contabilizar como receita ou despesa nos totais | 🟡 Importante |
| - [x] | RF-141 | O sistema deve sugerir automaticamente a categoria de uma transação com base no histórico de descrições semelhantes do próprio usuário | 🟡 Importante |

---

## 🎯 Módulo 04 — Metas Financeiras

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-026 | O sistema deve permitir criar metas com nome, valor-alvo, prazo e descrição opcional | 🔴 Essencial |
| - [x] | RF-027 | O sistema deve permitir registrar aportes manuais em cada meta | 🔴 Essencial |
| - [x] | RF-028 | O sistema deve exibir o progresso da meta com barra visual e percentual | 🔴 Essencial |
| - [x] | RF-029 | O sistema deve calcular e sugerir quanto guardar por mês/semana para atingir a meta no prazo | 🟡 Importante |
| - [x] | RF-030 | O sistema deve permitir categorizar metas como curto prazo ou longo prazo | 🟡 Importante |
| - [x] | RF-031 | O sistema deve permitir pausar, editar e concluir metas | 🟡 Importante |
| - [x] | RF-032 | O sistema deve notificar quando uma meta for atingida | 🟢 Desejável |
| - [x] | RF-142 | O sistema deve oferecer uma meta especial de "Reserva de Emergência", sugerindo o valor-alvo com base em X meses do gasto médio mensal do usuário | 🟡 Importante |

---

## 🌍 Módulo 05 — Viagens e Simulador de Moedas

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-033 | O sistema deve exibir cotações atualizadas das principais moedas (USD, EUR, GBP, ARS, etc.) | 🔴 Essencial |
| - [x] | RF-034 | O sistema deve permitir converter um valor em BRL para qualquer moeda disponível e vice-versa | 🔴 Essencial |
| - [x] | RF-035 | O sistema deve exibir gráfico de histórico de cotação de uma moeda selecionada | 🟡 Importante |
| - [x] | RF-036 | O sistema deve permitir salvar moedas favoritas para acesso rápido | 🟢 Desejável |
| - [x] | RF-037 | O sistema deve permitir criar um planejamento de viagem com nome do destino, moeda local e data prevista | 🔴 Essencial |
| - [x] | RF-038 | O sistema deve permitir adicionar pretensões de gastos por categoria dentro da viagem (transporte, hospedagem, alimentação, passeios, compras) | 🔴 Essencial |
| - [x] | RF-039 | O sistema deve calcular o custo total da viagem somando todas as pretensões cadastradas | 🔴 Essencial |
| - [x] | RF-040 | O sistema deve converter o custo total da viagem para BRL com base na cotação atual da moeda do destino | 🔴 Essencial |
| - [x] | RF-041 | O sistema deve permitir editar e remover pretensões individuais dentro da viagem | 🟡 Importante |
| - [x] | RF-042 | O sistema deve permitir criar múltiplas viagens simultâneas | 🟡 Importante |
| - [x] | RF-043 | O sistema deve vincular uma viagem a uma meta financeira existente para acompanhar o progresso | 🟢 Desejável |

> **Nota (jul/2026):** RF-033 usa fonte gratuita (AwesomeAPI/Frankfurter) com **cache de 5 minutos por instância** (memória local). Em serverless o cache efetivo pode ser menor — ver achado T5. Termo "tempo real" foi removido.

---

## 🤖 Módulo 06 — Inteligência (Insights e Chatbot)

### Insights

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-044 | O sistema deve gerar um resumo mensal em linguagem natural analisando receitas, despesas e padrões | 🔴 Essencial |
| - [ ] | RF-045 | O sistema deve identificar categorias onde o gasto aumentou em relação ao mês anterior | 🔴 Essencial |
| - [ ] | RF-046 | O sistema deve gerar sugestões personalizadas de economia com base no perfil e histórico | 🟡 Importante |
| - [ ] | RF-047 | O sistema deve gerar alertas preditivos (ex: "No ritmo atual, seu VA acaba dia 22") | 🟡 Importante |
| - [ ] | RF-048 | O sistema deve gerar um score de saúde financeira (0-100) com base nos hábitos do usuário | 🟡 Importante |
| - [ ] | RF-107 | O sistema deve gerar projeções futuras em 3 cenários (otimista, atual, pessimista) para 3, 6 e 12 meses | 🟡 Importante |
| - [ ] | RF-108 | O sistema deve exibir em quanto tempo o usuário ficará negativo caso mantenha o ritmo atual de gastos | 🟡 Importante |
| - [ ] | RF-143 | O sistema deve exibir comparações "você vs você mesmo" (mês atual vs média dos meses anteriores, por categoria e no total) | 🟡 Importante |
| - [ ] | RF-144 | O sistema deve oferecer uma revisão semanal guiada com resumo da semana e confirmação/ajuste das transações registradas | 🟡 Importante |

### Chatbot

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-049 | O sistema deve disponibilizar um chatbot financeiro acessível via interface de chat | 🔴 Essencial |
| - [ ] | RF-050 | O sistema deve permitir perguntas em linguagem natural sobre transações, saldos, metas e categorias | 🔴 Essencial |
| - [ ] | RF-051 | O sistema deve contextualizar as respostas do chatbot com os dados reais do usuário | 🔴 Essencial |
| - [ ] | RF-052 | O sistema deve limitar o chatbot a responder apenas sobre finanças, recusando perguntas fora do escopo | 🟡 Importante |
| - [ ] | RF-053 | O sistema deve exibir histórico da conversa do chatbot na sessão atual | 🟢 Desejável |

> **Nota de custo (jul/2026):** IA via **Gemini Flash** (free tier). Resumos mensais são **cacheados** (gerados 1×/mês, não a cada abertura) e o chatbot tem rate limit por usuário. Insights simples continuam **rule-based** (fora do LLM) sempre que possível.

---

## 📅 Módulo 07 — Lembretes e Google Agenda

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-054 | O sistema deve permitir o usuário conectar sua conta Google para integração com o Google Calendar | 🔴 Essencial |
| - [x] | RF-055 | O sistema deve permitir criar lembretes de contas a pagar com data e valor | 🔴 Essencial |
| - [x] | RF-056 | O sistema deve sincronizar lembretes criados como eventos no Google Calendar | 🔴 Essencial |
| - [x] | RF-057 | O sistema deve permitir o usuário ativar/desativar a integração com Google Agenda a qualquer momento | 🔴 Essencial |
| - [x] | RF-058 | O sistema deve permitir configurar antecedência do lembrete (1 dia antes, no dia, etc.) | 🟡 Importante |
| - [x] | RF-058b | O sistema deve importar alterações feitas no Google Calendar de volta para o Pulso (título, data) ao abrir o mês ou após sync manual | 🟡 Importante |

> **Nota (ago/2026):** RF-058b formaliza a importação Google → Pulso já implementada em `importarAlteracoesDoGoogle`. Correção RF-NOVO-G1: falha de sync na **criação** preserva o lembrete com `sincronizado: false` (RN-097).

---

## 👤 Módulo 10 — Perfil e Configurações

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-073 | O sistema deve permitir o usuário editar nome, email e foto de perfil | 🔴 Essencial |
| - [ ] | RF-074 | O sistema deve permitir alteração de senha para contas com email/senha | 🔴 Essencial |
| - [ ] | RF-075 | O sistema deve permitir configurar receitas fixas mensais (salário, VA, VR, VT) para preenchimento automático | 🔴 Essencial |
| - [x] | RF-076 | O sistema deve permitir alternar entre tema claro e escuro | 🟡 Importante |
| - [ ] | RF-077 | O sistema deve permitir o usuário excluir sua conta e todos os dados associados | 🔴 Essencial |
| - [ ] | RF-103 | O sistema deve permitir selecionar o modo de uso: Estagiário, CLT ou Freelancer | 🔴 Essencial |
| - [ ] | RF-104 | O sistema deve adaptar a interface e funcionalidades visíveis conforme o modo selecionado (ex: benefícios VA/VR ocultos no modo Pessoa Física) | 🟡 Importante |
| - [ ] | RF-145 | (Freelancer) O sistema deve permitir configurar reserva automática de um percentual de cada receita para impostos (DAS/INSS), separando esse valor do saldo disponível | 🟡 Importante |
| - [ ] | RF-146 | (Freelancer) O sistema deve tratar renda irregular usando média móvel dos últimos meses em vez de salário fixo nas projeções e sugestões | 🟡 Importante |
| - [ ] | RF-147 | (Freelancer) O sistema deve permitir separar contas/recursos PJ e PF | 🟢 Desejável |
| - [ ] | RF-148 | (CLT) O sistema deve prever 13º salário e férias como receitas futuras no calendário e nas projeções | 🟡 Importante |
| - [ ] | RF-149 | (CLT) O sistema deve permitir registrar o saldo de FGTS de forma informativa (não contabilizado no saldo disponível) | 🟢 Desejável |

---

## 🏠 Módulo 12 — Homepage (Landing Page)

> **Status:** landing pública implementada em `LandingPage.jsx` com hero, features, benefícios, depoimentos e CTAs.

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-084 | O sistema deve exibir uma homepage pública apresentando o Pulso, suas funcionalidades e benefícios | 🔴 Essencial |
| - [x] | RF-085 | A homepage deve conter botões de chamada para ação (Cadastrar e Entrar) | 🔴 Essencial |
| - [x] | RF-086 | A homepage deve exibir seções com os principais módulos do sistema (dashboard, metas, viagens, insights, chatbot, grupos) | 🟡 Importante |
| - [x] | RF-087 | A homepage deve ser responsiva e atraente visualmente com a paleta Vital Purple | 🔴 Essencial |

---

## 👥 Módulo 13 — Grupos

> Detalhamento técnico e gaps: [Modulos/Grupos.md](../../02-Engenharia/Modulos/Grupos.md)

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-088 | O sistema deve permitir criar um grupo com nome e descrição | 🔴 Essencial |
| - [x] | RF-089 | O sistema deve gerar um link/código de convite para o grupo | 🔴 Essencial |
| - [x] | RF-090 | O sistema deve permitir entrar em um grupo via link/código de convite | 🔴 Essencial |
| - [x] | RF-091 | O sistema deve permitir que o criador do grupo defina um papel para cada membro (admin ou membro) | 🟡 Importante |
| - [x] | RF-092 | O sistema deve permitir vincular uma viagem ao grupo para planejamento compartilhado | 🔴 Essencial |
| - [x] | RF-093 | O sistema deve permitir que membros do grupo adicionem pretensões de gastos na viagem compartilhada | 🔴 Essencial |
| - [x] | RF-094 | O sistema deve calcular o custo total da viagem do grupo somando pretensões de todos os membros | 🔴 Essencial |
| - [x] | RF-095 | O sistema deve exibir quanto cada membro deve contribuir para a viagem | 🟡 Importante |
| - [x] | RF-096 | O sistema deve permitir criar metas financeiras compartilhadas no grupo | 🟡 Importante |
| - [x] | RF-097 | O sistema deve permitir que cada membro faça aportes individuais na meta do grupo | 🟡 Importante |
| - [x] | RF-098 | O sistema deve manter os perfis e finanças pessoais completamente separados dos dados do grupo | 🔴 Essencial |
| - [x] | RF-099 | O sistema deve permitir o membro sair do grupo a qualquer momento | 🔴 Essencial |
| - [x] | RF-100 | O sistema deve permitir o admin remover membros do grupo | 🟡 Importante |
| - [x] | RF-101 | O sistema deve exibir um painel do grupo com resumo das viagens e metas compartilhadas | 🟡 Importante |
| - [x] | RF-102 | O sistema deve permitir chat/mensagens dentro do grupo | 🟢 Desejável |

**RF-095:** toggle *Por pretensão* / *Divisão igual* no card viagem, persistido no servidor (`grupos.modo_divisao`). "Quem paga quem" (acerto de contas) e split custom por % → módulo **Divisão de Despesas** (`/expense-split`, RF-115–120), a vincular depois.

**RF-102:** chat em tempo real via **Socket.IO** (API long-running). Grupos exigem plano **Premium**. Ver [Modulos/Grupos.md](../../02-Engenharia/Modulos/Grupos.md) e [TI5-Hospedagem.md](../../02-Engenharia/Deploy/TI5-Hospedagem.md).

---
## 📊 Módulo 14 — Orçamento Mensal

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-109 | O sistema deve permitir definir um limite mensal de gasto por categoria | 🔴 Essencial |
| - [x] | RF-110 | O sistema deve exibir barra de progresso do gasto atual vs limite definido por categoria | 🔴 Essencial |
| - [x] | RF-111 | O sistema deve alertar quando o gasto atingir 80% do limite de uma categoria | 🟡 Importante |
| - [x] | RF-112 | O sistema deve alertar quando o gasto estourar o limite de uma categoria | 🔴 Essencial |
| - [x] | RF-113 | O sistema deve permitir editar os limites de orçamento a qualquer momento | 🟡 Importante |
| - [x] | RF-114 | O sistema deve exibir um resumo visual de quanto ainda pode gastar por categoria no mês | 🔴 Essencial |
| - [x] | RF-150 | O sistema deve permitir "rollover" de orçamento: o valor não gasto de uma categoria acumula no limite do mês seguinte (ativável por categoria) | 🟡 Importante |
---
## 💸 Módulo 15 — Divisão de Despesas

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-115 | O sistema deve permitir registrar uma despesa compartilhada informando valor total e participantes | 🔴 Essencial |
| - [x] | RF-116 | O sistema deve calcular automaticamente quanto cada participante deve | 🔴 Essencial |
| - [x] | RF-117 | O sistema deve permitir divisão igualitária ou por valores personalizados | 🟡 Importante |
| - [x] | RF-118 | O sistema deve permitir marcar quem já pagou sua parte | 🔴 Essencial |
| - [x] | RF-119 | O sistema deve exibir saldo consolidado (quanto me devem vs quanto eu devo) | 🟡 Importante |
| - [x] | RF-120 | O sistema deve permitir enviar lembrete de cobrança para participantes do grupo | 🟢 Desejável |

**Notas:** módulo standalone (`/expense-split`), participantes por nome livre (mesmo padrão de Dívidas Pessoais — sem exigir conta Pulso); rateio igual usa aritmética de centavos determinística (RNF-016); "lembrete de cobrança" (RN-086) cria um `Lembrete` de calendário real pro organizador (autolembrete), vinculado a 1+ participantes via relação N:N (`Lembrete.divisaoParticipantes`, tabela `_DivisaoParticipanteToLembrete`) — um único lembrete pode cobrir vários participantes pendentes de uma mesma divisão. O lembrete é cancelado automaticamente quando todos os participantes que ele cobre quitam suas partes, e é excluído junto se a divisão for excluída antes de ser quitada. Integração com o toggle de RF-095 (Grupos) fica para depois, como já documentado em [Modulos/Grupos.md](../../02-Engenharia/Modulos/Grupos.md).
---
## 📅 Módulo 16 — Calendário Financeiro

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-121 | O sistema deve exibir um calendário mensal visual com marcadores de transações por dia | 🔴 Essencial |
| - [x] | RF-122 | O sistema deve diferenciar visualmente dias com receitas (verde), despesas (vermelho) e ambos (roxo) | 🔴 Essencial |
| - [x] | RF-123 | Lógica em `fixedIncomeUtils.js`: marcador azul no grid + lista no painel do dia conforme `configuracoes_usuario` (valor/dia por tipo). VA/VR/VT conforme `modoUso`. **Coleta dos dados:** onboarding (RF-075/RF-151); sem tela de config manual por enquanto |
| RF-076 | Toggle claro/escuro na **landing** (`PublicHeader`) e na área autenticada (**`UserMenu`**); preferência em `ds-theme-preference` (legado `ds-theme`) |
| RF-103 / RF-104 | `modoUso` no cadastro/onboarding; sidebar filtra itens por modo (`filterSidebarByUser`); tela de perfil/configurações ainda pendente |
| RF-139 | Quick-add planejado como FAB no dashboard, reutilizando o parser em linguagem natural do chatbot (Gemini Flash) |
| RF-141 | Sugestão de categoria via similaridade de texto (coeficiente de Dice sobre bigramas, hand-rolled/sem dependência) comparando a descrição digitada com o histórico do próprio usuário (mesmo tipo). Preenchimento automático discreto no formulário de transação (apenas ao criar), sem sobrescrever escolha manual |
| RF-155–158 / RF-160 | Importação entregue — `POST /importacoes/analisar` + `/confirmar`, parsers OFX/CSV/XLSX/PDF, preview no dashboard, dedupe, mapeamento manual de colunas |
| RF-159 (futuro) | Import de extratos deve reaproveitar/alimentar o mesmo motor de sugestão do RF-141 quando implementado (aprendizado com ajustes) |
| Cron / jobs agendados | **Migração planejada Vercel Cron (Hobby, 1×/dia) → GitHub Actions** (schedule grátis, múltiplas execuções/dia) chamando endpoints protegidos — resolve imprecisão de RF-047/111/132/166/183/194 |
| Cotações (RF-033) | Fonte gratuita (AwesomeAPI/Frankfurter) com cache de **5 minutos** por instância (memória); ver T5 para cache compartilhado futuro |
| OCR de cupons | **Descartado** — custo/complexidade sem retorno para o escopo gratuito |
| Open Banking | **Descartado** — custo de integração/certificação incompatível com projeto gratuito; substituído pelo módulo de Importação (OFX/CSV/PDF) |
| Páginas implementadas | `/` (landing), **`/dashboard`**, `/transactions`, `/budget`, `/calendar`, `/debts`, `/goals`, `/trips`, **`/groups`**, **`/groups/:id`**, **`/expense-split`**, **`/purchase-planning`** |
| Grupos (RF-088–102) | Lista, detalhe, gerenciar membros (incl. remover / alterar papel), editar grupo, metas múltiplas, RN-119, notificações GRUPO/META, **chat Socket.IO**, viagem pessoal→grupo, RF-095 (toggle *Por pretensão*/*Divisão igual*), **Premium**, **rate limit** em preview/entrar — acerto de contas em **`/expense-split`** — [Modulos/Grupos.md](../../02-Engenharia/Modulos/Grupos.md) |
| Metas (RF-026–031) | CRUD, aportes, pausar/concluir, vínculo viagem; `META_ATINGIDA` pessoal e grupo |
| Viagens (RF-033–043) | Moedas (cotações, conversor, histórico, favoritas), CRUD de viagens, despesas por categoria, total em BRL, observações, busca GeoNames, estimativas de passagem (avião/ônibus/trem) com ajuste sazonal; Duffel/Amadeus opcionais; capa em `destinoMeta.coverImageUrl` (resolvida no criar/editar) |
| Dívidas (RF-126–132) | CRUD em `/debts` com tabs Me devem / Eu devo / Quitadas; resumo consolidado; filtros (busca, valor, DateRangePicker); job `DIVIDA_COBRANCA` (vence hoje / em 2 dias); limpeza automática de quitadas após 180 dias |
| Notificações | Orçamento, lembretes, dívidas, transações (RECEITA/DESPESA), insight MVP, grupos — sino paginado (20), retenção 30d lidas |
| Google Calendar | Sync Pulso → Google na criação/edição; **importação Google → Pulso** ao abrir o mês e após sync manual; marcar pago remove evento |
| Lembretes recorrentes | UI "Repetir todo mês" enviada ao backend; job diário gera instâncias mensais |
| Tags | CRUD em Transações → **Tags**; criação sob demanda na transação |
| Calendário + IA | Tela entregue; integração com IA (Gemini) na página do calendário **pendente** |
| Banco / API | Schema Prisma; API expõe auth, transações, orçamento, lembretes, calendário, dívidas, **metas**, **viagens**, **moedas**, **dashboard**, **importações**, planejamento de compra, grupos (Premium), notificações; RabbitMQ opcional (alerts + reminders + emails) |
| Planos Free/Premium | Gate Premium em grupos; demo via `setPlano` (sem billing) — TI5 |

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
| Migrations | Incluem `viagens_meta_id_unique`, `viagem_grupo_grupo_id_unique`, `categoria_grupo_beneficio` — aplicar com `prisma migrate deploy` no ambiente |
| Tokens Google em repouso | ✅ AES-256-GCM implementado (`api/src/utils/googleTokenCrypto.js`) |
| Cron Vercel (Hobby) → GitHub Actions | Migração planejada; hoje jobs diários 1×/dia; orçamento local roda a cada 20 min |
| Cobertura de testes (RNF-015) | API: limiares Jest (~85%+ statements/lines em services/utils/jobs selecionados); Web: limiares Vitest (~65%+). Alguns services grandes excluídos do collectCoverage (`viagemService`, `grupoService`, …) |
| Tags CRUD completo | Entregue (jun/2026); merge de duplicatas opcional pós-MVP |

### Tags — posicionamento (jun/2026)

O fluxo atual (criar tag ao digitar na transação, reutilizar no catálogo, ícone/cor padrão) é **adequado para o MVP**. Edição/exclusão e merge de tags duplicadas podem entrar quando houver tela de configurações ou volume alto de tags por usuário.

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
| warning | `#F59E0B` | Alertas, streaks, atenção |
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
| warning | `#FBBF24` | Alertas, streaks |
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

Contagem dos **175 requisitos funcionais** ativos no escopo TI5.

| Prioridade | Quantidade | Percentual |
|---|---|---|
| 🔴 Essencial | 89 | 46% |
| 🟡 Importante | 82 | 42% |
| 🟢 Desejável | 24 | 12% |
| **Total** | **175** | **100%** |

---

## 🔮 Roadmap Futuro

- [ ] 🌐 Multi-idioma (i18n) — PT-BR, EN, ES
- [ ] 📊 Dashboard customizável (drag and drop de widgets)
- [ ] 📺 Gestão de Assinaturas — detectar assinaturas recorrentes, alertar "assinaturas fantasma" e somar custo anual (candidato a módulo formal; reaproveita RF-020/021)
- [ ] 📈 Patrimônio & Investimentos — patrimônio líquido (ativos − passivos), cotações via brapi.dev/CoinGecko (grátis)
- [ ] 🏦 Simulador de Financiamentos — SAC vs Price, comparar propostas, simular antecipação/quitação
- [ ] 📱 **App mobile nativo** (Flutter ou React Native) — reaproveitando a API REST existente; app nativo Flutter é objetivo do trabalho (mesma API REST + Socket.IO)

> **Fora do escopo TI5:** cartão/faturas, bots, modo casal/família, PWA/push web, veículos/FIPE; também fora: gestão de vale-transporte, relatórios produto e gamificação.
>
> **Itens descartados:** Open Banking (custo), OCR de cupons (custo/complexidade), bot WhatsApp.