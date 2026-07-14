# 📋 Pulso — Requisitos do Sistema

Documento de rastreamento de todos os requisitos funcionais e não funcionais do sistema **Pulso**.

> **Última revisão:** código alinhado a junho/2026 · planejamento de expansão jul/2026.  
> Documentação técnica: [Frontend](../../Codigo/Pulso/web/Documents/Readme.md) · [API](../../Codigo/Pulso/api/Documents/Readme.md) · [Banco de dados](../../Codigo/Pulso/api/Documents/Database.md)

---

## 📊 Progresso Geral

| Categoria | Total | Concluídos | Progresso |
|---|---|---|---|
| Requisitos Funcionais | 195 | 87 | ~45% |
| Requisitos Não Funcionais | 16 | 10 | ~63% |
| **Total** | **211** | **97** | **~46%** |

Contagem considera requisitos **implementados e utilizáveis**. Módulos entregues: auth, transações, VT, orçamento, calendário/lembretes, dívidas, **metas**, **viagens + moedas**, **grupos**, homepage e notificações (orçamento, lembretes, dívidas, transações, gamificação MVP, insights rule-based).

**Novos módulos planejados (jul/2026):** Onboarding guiado, Importação de Dados, Cartão de Crédito e Faturas, Integrações e Bots (Telegram/Discord), Modo Casal/Família, PWA + Notificações Push e **Veículos & FIPE**.

**Fora da lista de RF (entregue):** busca global de destinos (GeoNames), estimativas de passagem com ajuste sazonal, integração opcional Duffel/Amadeus, observações na viagem.

---

## 📊 Progresso por Módulo

| Módulo | Total | Concluídos | Progresso |
|---|---|---|---|
| 🔐 Autenticação | 6 | 6 | ✅ |
| 📊 Dashboard | 9 | 0 |  |
| 💳 Transações | 13 | 13 | ✅ |
| 🎯 Metas | 8 | 8 | ✅ |
| 🌍 Viagens e Moedas | 11 | 11 | ✅ |
| 🤖 Insights | 9 | 0 |  |
| 💬 Chatbot | 5 | 0 |  |
| 📅 Lembretes | 5 | 5 | ✅ |
| 🚌 Vale Transporte | 6 | 6 | ✅ |
| 📈 Relatórios | 6 | 0 |  |
| 👤 Perfil e Configurações | 13 | 0 | 🟡 |
| 🎮 Gamificação | 7 | 0 |  |
| 🏠 Homepage | 4 | 4 | ✅ |
| 👥 Grupos | 15 | 15 | ✅ |
| ⚙️ Não Funcionais | 16 | 10 | 🟡 |
| 📊 Orçamento Mensal | 7 | 7 | ✅ |
| 💸 Divisão de Despesas | 6 | 0 |  |
| 📅 Calendário Financeiro | 5 | 5 | ✅ |
| 🤝 Dívidas Pessoais | 7 | 7 | ✅ |
| 🛒 Planejamento de Compra | 6 | 6 | ✅ |
| 🚀 Onboarding | 4 | 0 | ⏳ |
| 📥 Importação de Dados | 6 | 0 | ⏳ |
| 💳 Cartão de Crédito e Faturas | 8 | 0 | ⏳ |
| 🤖 Integrações e Bots | 5 | 0 | ⏳ |
| 👨‍👩‍👧 Modo Casal/Família | 6 | 0 | ⏳ |
| 📱 PWA e Notificações Push | 5 | 0 | ⏳ |
| 🚗 Veículos & FIPE | 13 | 0 | ⏳ |

**Legenda:** ✅ módulo entregue · 🟡 parcial (UI ou backend incompleto) · ⏳ aguardando prototipação/implementação

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
| - [ ] | RF-007 | O sistema deve exibir o saldo total disponível do mês corrente | 🔴 Essencial |
| - [ ] | RF-008 | O sistema deve exibir saldos separados por tipo de recurso (dinheiro, VA, VR, VT) | 🔴 Essencial |
| - [ ] | RF-009 | O sistema deve exibir um gráfico de receitas vs despesas do mês | 🔴 Essencial |
| - [ ] | RF-010 | O sistema deve exibir um gráfico de gastos por categoria no dashboard | 🔴 Essencial |
| - [ ] | RF-011 | O sistema deve exibir um resumo das últimas transações registradas | 🟡 Importante |
| - [ ] | RF-012 | O sistema deve exibir alertas visuais quando o gasto ultrapassar um limite definido | 🟡 Importante |
| - [ ] | RF-013 | O sistema deve exibir o progresso resumido das metas ativas | 🟡 Importante |
| - [ ] | RF-014 | O sistema deve exibir o score de saúde financeira do usuário | 🟢 Desejável |
| - [ ] | RF-139 | O sistema deve exibir um botão de acesso rápido (quick-add) no dashboard que abre o chatbot para registro de transação em linguagem natural | 🟡 Importante |

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
| - [x] | RF-025 | O sistema deve impedir que o usuário registre despesas de alimentação usando recurso do tipo VT | 🟡 Importante |
| - [x] | RF-140 | O sistema deve permitir registrar transferência entre recursos (ex: dinheiro → poupança) sem contabilizar como receita ou despesa nos relatórios | 🟡 Importante |
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

> **Nota (jul/2026):** RF-033 teve o termo "tempo real" trocado por "atualizadas" — fonte gratuita (AwesomeAPI/Frankfurter) com **cache diário**, evitando dependência de API paga de cotação tick-a-tick.

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

---

## 🚌 Módulo 08 — Gestão de Vale Transporte

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-059 | O sistema deve permitir registrar o valor mensal recebido de VT | 🔴 Essencial |
| - [x] | RF-060 | O sistema deve permitir registrar uso real do VT (passagens utilizadas) | 🔴 Essencial |
| - [x] | RF-061 | O sistema deve permitir registrar venda do VT informando: comprador, data da venda, valor nominal vendido e valor recebido | 🔴 Essencial |
| - [x] | RF-062 | O sistema deve manter um histórico de vendas de VT com todos os detalhes registrados | 🟡 Importante |
| - [x] | RF-063 | O sistema deve calcular a diferença entre valor nominal e valor recebido na venda (perda/ganho) | 🟡 Importante |
| - [x] | RF-066 | O sistema deve exibir saldo atual de VT (recebido – usado – vendido) | 🟡 Importante |

---

## 📈 Módulo 09 — Relatórios e Histórico

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-067 | O sistema deve gerar relatório mensal com total de receitas, despesas e saldo | 🔴 Essencial |
| - [ ] | RF-068 | O sistema deve exibir gráfico de pizza com distribuição de gastos por categoria | 🔴 Essencial |
| - [ ] | RF-069 | O sistema deve exibir gráfico de barras comparando meses anteriores | 🟡 Importante |
| - [ ] | RF-070 | O sistema deve exibir gráfico de evolução temporal do saldo | 🟡 Importante |
| - [ ] | RF-071 | O sistema deve permitir exportar relatórios em PDF | 🟡 Importante |
| - [ ] | RF-072 | O sistema deve permitir exportar transações em CSV | 🟢 Desejável |

---

## 👤 Módulo 10 — Perfil e Configurações

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-073 | O sistema deve permitir o usuário editar nome, email e foto de perfil | 🔴 Essencial |
| - [ ] | RF-074 | O sistema deve permitir alteração de senha para contas com email/senha | 🔴 Essencial |
| - [ ] | RF-075 | O sistema deve permitir configurar receitas fixas mensais (salário, VA, VR, VT) para preenchimento automático | 🔴 Essencial |
| - [ ] | RF-076 | O sistema deve permitir alternar entre tema claro e escuro | 🟡 Importante |
| - [ ] | RF-077 | O sistema deve permitir o usuário excluir sua conta e todos os dados associados | 🔴 Essencial |
| - [ ] | RF-078 | O sistema deve permitir ativar/desativar o módulo de gamificação | 🟡 Importante |
| - [ ] | RF-103 | O sistema deve permitir selecionar o modo de uso: Estagiário, CLT ou Freelancer | 🔴 Essencial |
| - [ ] | RF-104 | O sistema deve adaptar a interface e funcionalidades visíveis conforme o modo selecionado (ex: VT só aparece no modo Estagiário) | 🟡 Importante |
| - [ ] | RF-145 | (Freelancer) O sistema deve permitir configurar reserva automática de um percentual de cada receita para impostos (DAS/INSS), separando esse valor do saldo disponível | 🟡 Importante |
| - [ ] | RF-146 | (Freelancer) O sistema deve tratar renda irregular usando média móvel dos últimos meses em vez de salário fixo nas projeções e sugestões | 🟡 Importante |
| - [ ] | RF-147 | (Freelancer) O sistema deve permitir separar contas/recursos PJ e PF | 🟢 Desejável |
| - [ ] | RF-148 | (CLT) O sistema deve prever 13º salário e férias como receitas futuras no calendário e nas projeções | 🟡 Importante |
| - [ ] | RF-149 | (CLT) O sistema deve permitir registrar o saldo de FGTS de forma informativa (não contabilizado no saldo disponível) | 🟢 Desejável |

---

## 🎮 Módulo 11 — Gamificação

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-079 | O sistema deve rastrear streak de dias consecutivos com registro de transação | 🟡 Importante |
| - [ ] | RF-080 | O sistema deve conceder conquistas ao atingir marcos (ex: "Primeiro mês no positivo", "30 dias de streak") | 🟡 Importante |
| - [ ] | RF-081 | O sistema deve atribuir um nível financeiro ao usuário (Iniciante → Consciente → Estrategista → Investidor) | 🟢 Desejável |
| - [ ] | RF-082 | O sistema deve gerar desafios mensais personalizados (ex: "Gaste 10% menos em delivery") | 🟢 Desejável |
| - [ ] | RF-083 | O sistema deve exibir um painel de conquistas desbloqueadas e pendentes | 🟡 Importante |
| - [ ] | RF-105 | O sistema deve oferecer dicas educativas contextualizadas baseadas nos hábitos do usuário (módulo ativável/desativável) | 🟡 Importante |
| - [ ] | RF-106 | O sistema deve oferecer quizzes financeiros semanais com XP como recompensa | 🟢 Desejável |

---

## 🏠 Módulo 12 — Homepage (Landing Page)

> **Status:** landing pública implementada em `LandingPage.jsx` com hero, features, benefícios, depoimentos e CTAs.

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-084 | O sistema deve exibir uma homepage pública apresentando o Pulso, suas funcionalidades e benefícios | 🔴 Essencial |
| - [x] | RF-085 | A homepage deve conter botões de chamada para ação (Cadastrar e Entrar) | 🔴 Essencial |
| - [x] | RF-086 | A homepage deve exibir seções com os principais módulos do sistema (dashboard, metas, viagens, insights, chatbot, gamificação) | 🟡 Importante |
| - [x] | RF-087 | A homepage deve ser responsiva e atraente visualmente com a paleta Vital Purple | 🔴 Essencial |

---

## 👥 Módulo 13 — Grupos

> Detalhamento técnico e gaps: [Modulos/Grupos.md](../Modulos/Grupos.md)

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

**RF-102:** chat com polling rápido (~3s, pausado quando a aba não está visível). WebSocket tradicional não é viável enquanto a API rodar como funções serverless na Vercel — ver detalhe em Modulos/Grupos.md.

> **Nota (jul/2026):** a infraestrutura de Grupos (membros, convites, papéis, notificações, chat) será **reaproveitada** pelo Modo Casal/Família (Módulo 23) via um "tipo" de espaço (`VIAGEM` vs `FAMILIA`).

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
| - [ ] | RF-115 | O sistema deve permitir registrar uma despesa compartilhada informando valor total e participantes | 🔴 Essencial |
| - [ ] | RF-116 | O sistema deve calcular automaticamente quanto cada participante deve | 🔴 Essencial |
| - [ ] | RF-117 | O sistema deve permitir divisão igualitária ou por valores personalizados | 🟡 Importante |
| - [ ] | RF-118 | O sistema deve permitir marcar quem já pagou sua parte | 🔴 Essencial |
| - [ ] | RF-119 | O sistema deve exibir saldo consolidado (quanto me devem vs quanto eu devo) | 🟡 Importante |
| - [ ] | RF-120 | O sistema deve permitir enviar lembrete de cobrança para participantes do grupo | 🟢 Desejável |
---
## 📅 Módulo 16 — Calendário Financeiro

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-121 | O sistema deve exibir um calendário mensal visual com marcadores de transações por dia | 🔴 Essencial |
| - [x] | RF-122 | O sistema deve diferenciar visualmente dias com receitas (verde), despesas (vermelho) e ambos (roxo) | 🔴 Essencial |
| - [x] | RF-123 | O sistema deve exibir os dias de recebimento fixo (salário, VA, VR, VT) destacados no calendário | 🟡 Importante |
| - [x] | RF-124 | O sistema deve exibir vencimentos de contas/lembretes no calendário | 🟡 Importante |
| - [x] | RF-125 | O sistema deve permitir clicar em um dia para ver o detalhe das transações daquele dia | 🔴 Essencial |
---
## 🤝 Módulo 17 — Dívidas Pessoais

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-126 | O sistema deve permitir registrar um empréstimo feito a alguém (quem me deve) com valor, pessoa e data | 🔴 Essencial |
| - [x] | RF-127 | O sistema deve permitir registrar um empréstimo recebido de alguém (quem eu devo) com valor, pessoa e data | 🔴 Essencial |
| - [x] | RF-128 | O sistema deve permitir definir prazo de devolução para cada dívida | 🟡 Importante |
| - [x] | RF-129 | O sistema deve permitir marcar uma dívida como paga/devolvida | 🔴 Essencial |
| - [x] | RF-130 | O sistema deve exibir saldo consolidado: total que me devem vs total que eu devo | 🔴 Essencial |
| - [x] | RF-131 | O sistema deve exibir histórico completo de empréstimos (ativos e quitados) | 🟡 Importante |
| - [x] | RF-132 | O sistema deve alertar quando uma dívida estiver próxima do vencimento | 🟢 Desejável |
---
## 🛒 Módulo 18 — Planejamento de Compra

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [x] | RF-133 | O sistema deve permitir registrar um item desejado com nome, valor e prioridade | 🔴 Essencial |
| - [x] | RF-134 | O sistema deve calcular em quanto tempo o usuário poderá comprar o item baseado na sobra mensal atual | 🔴 Essencial |
| - [x] | RF-135 | O sistema deve simular cenários de compra à vista vs parcelado (com quantidade de parcelas) | 🟡 Importante |
| - [x] | RF-136 | O sistema deve alertar sobre o percentual da renda comprometido com parcelas | 🟡 Importante |
| - [x] | RF-137 | O sistema deve permitir vincular um planejamento de compra a uma meta financeira | 🟢 Desejável |
| - [x] | RF-138 | O sistema deve permitir marcar um item como "comprado" e registrar a transação automaticamente | 🟡 Importante |
---
## 🚀 Módulo 19 — Onboarding

> **Objetivo:** eliminar o "cold start" — o usuário não pode ver tudo zerado no dia 1. Guiar a carga inicial de dados de forma rápida e opcional.

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-151 | O sistema deve exibir um wizard de onboarding guiado após o primeiro login/cadastro | 🔴 Essencial |
| - [ ] | RF-152 | O sistema deve permitir informar o saldo inicial atual por recurso (dinheiro, VA, VR, VT) manualmente | 🔴 Essencial |
| - [ ] | RF-153 | O sistema deve permitir selecionar o modo de uso (Estagiário/CLT/Freelancer) durante o onboarding | 🔴 Essencial |
| - [ ] | RF-154 | O onboarding deve oferecer duas rotas de carga inicial: (a) importar extratos (banco/VA/VR/VT) ou (b) informar saldos manualmente — permitindo pular a etapa | 🔴 Essencial |
---
## 📥 Módulo 20 — Importação de Dados

> **Objetivo:** ser o "Open Banking dos pobres" — carga inicial e recorrente de transações a partir de arquivos, sem custo de integração bancária. Usado tanto no onboarding quanto continuamente.

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-155 | O sistema deve permitir importar extrato bancário nos formatos OFX e CSV | 🔴 Essencial |
| - [ ] | RF-156 | O sistema deve permitir importar extratos de VA, VR e VT (CSV/planilha), atribuindo as transações ao recurso correto | 🟡 Importante |
| - [ ] | RF-157 | O sistema deve exibir um preview editável das transações detectadas antes de confirmar a importação | 🔴 Essencial |
| - [ ] | RF-158 | O sistema deve detectar e sinalizar transações potencialmente duplicadas (mesma data, valor e descrição), permitindo ignorá-las | 🔴 Essencial |
| - [ ] | RF-159 | O sistema deve categorizar automaticamente as transações importadas por regras de descrição (ex: "IFOOD" → Alimentação), aprendendo com ajustes do usuário | 🟡 Importante |
| - [ ] | RF-160 | O sistema deve permitir o mapeamento manual de colunas (data, valor, descrição) para CSVs de formato desconhecido | 🟡 Importante |

**Fluxo previsto:** upload → parse (OFX nativo / CSV com detecção de delimitador e encoding) → normalização → dedupe (hash de data+valor+descrição, comparando com transações existentes) → categorização por regras → **preview editável** → confirmação → gravação em lote. Regras de categorização ficam num dicionário editável por usuário (alimenta o RF-141).

---
## 💳 Módulo 21 — Cartão de Crédito e Faturas

> **Objetivo:** cobrir o maior gap funcional para o público brasileiro — parcelamento e fatura. Integra-se ao Calendário (vencimento) e ao Planejamento de Compra (RF-135).

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-161 | O sistema deve permitir cadastrar um cartão de crédito com nome, limite, dia de fechamento e dia de vencimento | 🔴 Essencial |
| - [ ] | RF-162 | O sistema deve permitir registrar uma compra no cartão, à vista ou parcelada (informando o número de parcelas) | 🔴 Essencial |
| - [ ] | RF-163 | O sistema deve gerar automaticamente as parcelas futuras, alocando cada uma na fatura correspondente | 🔴 Essencial |
| - [ ] | RF-164 | O sistema deve consolidar as despesas do cartão em faturas mensais, respeitando a data de fechamento | 🔴 Essencial |
| - [ ] | RF-165 | O sistema deve exibir o limite disponível do cartão (limite – fatura atual – parcelas futuras comprometidas) | 🟡 Importante |
| - [ ] | RF-166 | O sistema deve exibir o vencimento da fatura no calendário financeiro | 🟡 Importante |
| - [ ] | RF-167 | O sistema deve permitir marcar a fatura como paga, registrando a despesa no recurso escolhido | 🔴 Essencial |
| - [ ] | RF-168 | O sistema deve sugerir o "melhor dia de compra" com base na data de fechamento da fatura | 🟢 Desejável |
---
## 🤖 Módulo 22 — Integrações e Bots

> **Objetivo:** reduzir o atrito do registro diário. Decisão de arquitetura: **Telegram e Discord** (Bot APIs 100% gratuitas). WhatsApp foi **descartado** por exigir número próprio + Evolution API (infra/custo/risco de bloqueio).

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-169 | O sistema deve disponibilizar um bot no Telegram integrado à conta Pulso | 🟡 Importante |
| - [ ] | RF-170 | O sistema deve disponibilizar um bot no Discord integrado à conta Pulso | 🟢 Desejável |
| - [ ] | RF-171 | O sistema deve permitir registrar transações via bot em linguagem natural (ex: "gastei 30 no almoço") | 🟡 Importante |
| - [ ] | RF-172 | O sistema deve permitir consultar saldo, resumo do mês e progresso de metas via bot | 🟡 Importante |
| - [ ] | RF-173 | O sistema deve vincular a conta Pulso ao bot por meio de um token/código de pareamento seguro | 🔴 Essencial |
---
## 👨‍👩‍👧 Módulo 23 — Modo Casal/Família

> **Objetivo:** finanças compartilhadas **contínuas** (diferente de Grupos, que é focado em viagem/evento pontual). **Reaproveita** a infraestrutura de Grupos (membros, convites, papéis, notificações) via um tipo de espaço `FAMILIA`.

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-174 | O sistema deve permitir criar um espaço financeiro compartilhado contínuo (casal ou família) | 🟡 Importante |
| - [ ] | RF-175 | O sistema deve distinguir despesas compartilhadas de despesas individuais dentro do espaço | 🟡 Importante |
| - [ ] | RF-176 | O sistema deve permitir dividir as despesas compartilhadas de forma igualitária ou proporcional à renda de cada membro | 🟢 Desejável |
| - [ ] | RF-177 | O sistema deve exibir uma visão consolidada do orçamento familiar, preservando a privacidade dos dados individuais de cada membro | 🟡 Importante |
| - [ ] | RF-178 | O sistema deve permitir cadastrar despesas fixas/recorrentes compartilhadas (aluguel, mercado, contas), gerando lançamentos automáticos já rateados entre os membros | 🟡 Importante |
| - [ ] | RF-179 | O sistema deve exibir o acerto de contas do espaço (quem deve a quem) e permitir marcar as quitações | 🟡 Importante |

> **Nota de arquitetura (jul/2026):** um mesmo motor de "espaços compartilhados" atende Grupos (`tipo = VIAGEM`, pontual) e Casal/Família (`tipo = FAMILIA`, contínuo). Convites, papéis (admin/membro), notificações e a separação estrita entre finanças pessoais e compartilhadas (RF-098) são herdados de Grupos; as telas e regras de rateio recorrente são específicas do modo Família.

---
## 📱 Módulo 24 — PWA e Notificações Push

> **Objetivo:** presença "de app" no celular a **custo zero** (sem app store), servindo de ponte até o app nativo (roadmap). Web Push (VAPID) é gratuito e depende da base PWA (service worker).

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-180 | O sistema deve ser instalável como PWA (manifest + service worker), permitindo "adicionar à tela inicial" em mobile e desktop | 🟡 Importante |
| - [ ] | RF-181 | O sistema deve funcionar parcialmente offline, exibindo os dados já carregados (cache) quando sem conexão | 🟢 Desejável |
| - [ ] | RF-182 | O sistema deve solicitar permissão e habilitar notificações push no navegador via Web Push (VAPID) | 🟡 Importante |
| - [ ] | RF-183 | O sistema deve enviar notificações push para eventos financeiros relevantes (fatura a vencer, meta atingida, orçamento estourado, VA/VR/VT acabando) | 🟡 Importante |
| - [ ] | RF-184 | O sistema deve permitir ao usuário gerenciar quais tipos de notificação push deseja receber | 🟢 Desejável |

> **Nota (jul/2026):** o envio dos push de eventos agendados (fatura, dívida, orçamento) reutiliza os mesmos jobs migrados para GitHub Actions. A geração de conteúdo continua rule-based, sem custo de LLM.

---
## 🚗 Módulo 25 — Veículos & FIPE

> **Objetivo:** dar ao usuário a visão do **Custo Total de Propriedade (TCO)** do veículo — não só a parcela, mas o quanto o carro *realmente* sangra por mês (depreciação invisível + combustível + IPVA + seguro + manutenção). O grande diferencial é responder à pergunta que quase todo mundo erra: *"quanto meu carro me custa de verdade?"* e *"vale a pena trocar?"*.
>
> **Filosofia de custo:** 100% gratuito. Tabela FIPE via **BrasilAPI** ou **Parallelum/FIPE** (grátis) com **cache agressivo** (a FIPE atualiza 1×/mês, então o valor de um modelo é consultado no máximo mensalmente). Preço de combustível informado pelo usuário. Sem dependências pagas.

### A) Cadastro e valor de mercado

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-185 | O sistema deve permitir cadastrar um veículo (marca, modelo, ano e versão via FIPE; placa e apelido opcionais) | 🔴 Essencial |
| - [ ] | RF-186 | O sistema deve buscar e exibir o valor FIPE atual do veículo cadastrado | 🔴 Essencial |
| - [ ] | RF-187 | O sistema deve registrar o histórico mensal do valor FIPE e exibir a curva de desvalorização do veículo ao longo do tempo | 🟡 Importante |
| - [ ] | RF-188 | O sistema deve estimar a depreciação projetada (quanto o veículo deve valer em 12/24/36 meses) com base na tendência do histórico FIPE | 🟢 Desejável |

### B) Custos recorrentes e custo mensal médio (coração do módulo)

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-189 | O sistema deve permitir registrar despesas do veículo por tipo (combustível, manutenção, seguro, IPVA, licenciamento, estacionamento, multas, financiamento) | 🔴 Essencial |
| - [ ] | RF-190 | O sistema deve calcular o custo mensal médio do veículo, consolidando a média histórica de gastos recorrentes somada à depreciação mensal estimada | 🔴 Essencial |
| - [ ] | RF-191 | O sistema deve permitir registrar abastecimentos (litros, valor pago, hodômetro) e calcular consumo médio (km/l) e custo por km rodado | 🟡 Importante |
| - [ ] | RF-192 | O sistema deve estimar o IPVA anual com base no valor FIPE e na alíquota do estado do usuário | 🟢 Desejável |

### C) Manutenção e documentos (integra com Calendário/Lembretes)

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-193 | O sistema deve permitir registrar manutenções programadas (ex: troca de óleo a cada X km, revisões) com alerta por quilometragem ou data | 🟡 Importante |
| - [ ] | RF-194 | O sistema deve registrar vencimentos do veículo (IPVA, licenciamento, seguro) e exibi-los no Calendário Financeiro e via lembrete/push | 🟡 Importante |

### D) Comparativo e decisão de compra/troca

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-195 | O sistema deve comparar dois ou mais veículos (que possuo × que pretendo comprar) lado a lado: custo mensal médio, custo por km, depreciação e gasto anual estimado | 🔴 Essencial |
| - [ ] | RF-196 | O sistema deve simular a troca de veículo: valor de venda do atual (FIPE) + entrada + financiamento do novo, exibindo o impacto no orçamento mensal | 🟡 Importante |
| - [ ] | RF-197 | O sistema deve permitir vincular a intenção de compra de um veículo a uma meta (RF-142) e ao Planejamento de Compra (RF-135) | 🟢 Desejável |

**Cálculo do custo mensal médio (RF-190):** `custo_mensal = média_gastos_recorrentes_dos_últimos_N_meses + depreciação_mensal_estimada`, onde a depreciação mensal deriva da variação do histórico FIPE (RF-187). Gastos anuais (IPVA, seguro, licenciamento) são diluídos em 12 meses para não distorcer o mês em que foram pagos.

**Integrações naturais:**
- **Transações:** abastecimentos e manutenções (RF-189/191) podem virar transações normais marcadas com o veículo → entram em relatórios e orçamento.
- **Calendário/Lembretes/Push:** vencimentos (RF-194) e manutenção por km (RF-193) usam o fluxo já existente de lembretes e Módulo 24.
- **Metas + Planejamento de Compra:** juntar para a entrada / trocar de carro (RF-196/197).
- **Insights:** alimenta frases como "seu carro consumiu 22% da sua renda este mês" ou "gasto com combustível +30% vs média".

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

## 📌 Notas de implementação (atualizado jul/2026)

| Item | Situação |
|------|----------|
| RF-018 | CRUD de categorias personalizadas com **ícone e cor** (padrão Lucide + paleta). UI em Transações → **Categorias** |
| RF-140 | Transferência unificada na própria tabela `Transacao` (`tipo = TRANSFERENCIA`, `recursoDestino`, `categoriaId` nulo); novo recurso `POUPANCA`. Excluída dos totais de receita/despesa (`montarResumo`) e dos marcadores do Calendário |
| RF-123 | Lógica em `fixedIncomeUtils.js`: marcador azul no grid + lista no painel do dia conforme `configuracoes_usuario` (valor/dia por tipo). VA/VR só CLT/Estagiário; VT conforme `modoUso`/`vtHabilitado`. **Coleta dos dados:** onboarding (RF-075/RF-151); sem tela de config manual por enquanto |
| RF-064 / RF-065 | **Removidos** — intervalo entre vendas de VT e contador regressivo de venda não fazem mais parte do escopo |
| RF-076 | Toggle claro/escuro na **landing** (`PublicHeader`); área autenticada ainda sem controle na sidebar — tela Configurações pendente |
| RF-103 / RF-104 | `modoUso` no cadastro/onboarding e na API de VT; sidebar já oculta VT conforme modo (`filterSidebarByUser`); tela de perfil/configurações ainda pendente |
| RF-139 | Quick-add planejado como FAB no dashboard, reutilizando o parser em linguagem natural do chatbot (Gemini Flash) |
| RF-141 | Sugestão de categoria via similaridade de texto (coeficiente de Dice sobre bigramas, hand-rolled/sem dependência) comparando a descrição digitada com o histórico do próprio usuário (mesmo tipo). Preenchimento automático discreto no formulário de transação (apenas ao criar), sem sobrescrever escolha manual |
| RF-159 (futuro) | Import de extratos deve reaproveitar/alimentar o mesmo motor de sugestão do RF-141 quando implementado |
| RF-174–179 (Casal/Família) | Reaproveita o motor de espaços compartilhados de Grupos (`tipo = FAMILIA`); específico: rateio recorrente e acerto de contas contínuo |
| RF-180–184 (PWA/Push) | Base PWA (manifest + service worker) habilita instalação e Web Push (VAPID, gratuito); envio de eventos usa os jobs do GitHub Actions |
| RF-185–197 (Veículos/FIPE) | Tabela FIPE via BrasilAPI/Parallelum (gratuita) com cache mensal; custo mensal médio (RF-190) = média histórica de gastos + depreciação mensal derivada do histórico FIPE (RF-187); despesas do veículo podem espelhar em Transações; vencimentos e manutenção por km reutilizam Calendário/Lembretes/Push |
| Cron / jobs agendados | **Migração planejada Vercel Cron (Hobby, 1×/dia) → GitHub Actions** (schedule grátis, múltiplas execuções/dia) chamando endpoints protegidos — resolve imprecisão de RF-047/111/132/166/183/194 |
| Cotações (RF-033) | Fonte gratuita (AwesomeAPI/Frankfurter) com cache diário; termo "tempo real" removido |
| Bots (RF-169–173) | Telegram + Discord (Bot APIs gratuitas); WhatsApp/Evolution **descartado** |
| OCR de cupons | **Descartado** — custo/complexidade sem retorno para o escopo gratuito |
| Open Banking | **Descartado** — custo de integração/certificação incompatível com projeto gratuito; substituído pelo módulo de Importação (OFX/CSV) |
| Páginas implementadas | `/` (landing), `/transactions`, `/transport-voucher`, `/budget`, `/calendar`, `/debts`, `/goals`, `/trips`, **`/groups`**, **`/groups/:id`** |
| Grupos (RF-088–102) | Lista, detalhe, gerenciar membros, editar grupo, metas múltiplas, RN-119, notificações GRUPO/META, chat paginado + polling (~3s), viagem pessoal→grupo, RF-095 (toggle *Por pretensão*/*Divisão igual* persistido em `grupos.modo_divisao`) — acerto de contas ("quem paga quem") fica no módulo **Divisão de Despesas** (RF-115–120), ainda não construído — [Modulos/Grupos.md](../Modulos/Grupos.md) |
| Metas (RF-026–031) | CRUD, aportes, pausar/concluir, vínculo viagem; `META_ATINGIDA` pessoal e grupo |
| Viagens (RF-033–043) | Moedas (cotações, conversor, histórico, favoritas), CRUD de viagens, despesas por categoria, total em BRL, observações, busca GeoNames, estimativas de passagem (avião/ônibus/trem) com ajuste sazonal; Duffel/Amadeus opcionais |
| Dívidas (RF-126–132) | CRUD em `/debts` com tabs Me devem / Eu devo / Quitadas; resumo consolidado; filtros (busca, valor, DateRangePicker); job `DIVIDA_COBRANCA` (vence hoje / em 2 dias); limpeza automática de quitadas após 180 dias |
| Notificações | Orçamento, lembretes, dívidas, transações (RECEITA/DESPESA), streak/conquista, insight MVP, grupos — sino paginado (20), retenção 30d lidas |
| Google Calendar | Sync Pulso → Google na criação/edição; **importação Google → Pulso** ao abrir o mês e após sync manual; marcar pago remove evento |
| Lembretes recorrentes | UI "Repetir todo mês" enviada ao backend; job diário gera instâncias mensais |
| Tags | CRUD em Transações → **Tags**; criação sob demanda na transação |
| Calendário + IA | Tela entregue; integração com IA (Gemini) na página do calendário **pendente** |
| Banco completo | Schema Prisma com 30+ entidades; API expõe auth, transações, VT, orçamento, lembretes, calendário, dívidas, **metas**, **viagens**, **moedas** e notificações |

### Implementações técnicas fora da lista de RF (dívida / melhorias futuras)

| Item | Situação |
|------|----------|
| Rate limiting global (RNF-004) | Apenas rotas de auth |
| Tokens Google em repouso | JSON sem criptografia (schema prevê criptografia) |
| Cron Vercel (Hobby) → GitHub Actions | Migração planejada; hoje jobs diários 1×/dia; orçamento local roda a cada 20 min |
| Cobertura de testes (RNF-015) | API ~95% linhas / ~94% statements (Jest); Web ~97% linhas (Vitest) — services, utils, jobs, middlewares |
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
| 🚌 VT | `#EFF6FF` | `#BFDBFE` | `#2563EB` | `#172554` | `#1E40AF` | `#60A5FA` |

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

Contagem dos **195 requisitos funcionais** ativos (RF-001 a RF-197, excluindo RF-064/RF-065 removidos).

| Prioridade | Quantidade | Percentual |
|---|---|---|
| 🔴 Essencial | 89 | 46% |
| 🟡 Importante | 82 | 42% |
| 🟢 Desejável | 24 | 12% |
| **Total** | **195** | **100%** |

---

## 🔮 Roadmap Futuro

- [ ] 🌐 Multi-idioma (i18n) — PT-BR, EN, ES
- [ ] 📊 Dashboard customizável (drag and drop de widgets)
- [ ] 📺 Gestão de Assinaturas — detectar assinaturas recorrentes, alertar "assinaturas fantasma" e somar custo anual (candidato a módulo formal; reaproveita RF-020/021)
- [ ] 📈 Patrimônio & Investimentos — patrimônio líquido (ativos − passivos), cotações via brapi.dev/CoinGecko (grátis)
- [ ] 🏦 Simulador de Financiamentos — SAC vs Price, comparar propostas, simular antecipação/quitação
- [ ] 📱 **App mobile nativo** (Flutter ou React Native) — reaproveitando a API REST existente; PWA (Módulo 24) cobre o curto prazo, app nativo é objetivo de longo prazo (push nativo, biometria, widgets de tela inicial)

> **Itens promovidos a módulo formal (jul/2026):** PWA e Notificações Push → **Módulo 24**. Tabela FIPE / gestão de veículos → **Módulo 25** (Veículos & FIPE).
>
> **Itens descartados (jul/2026):** Open Banking (custo), OCR de cupons (custo/complexidade), bot WhatsApp (exige número próprio + Evolution). Import de extrato e bots migraram para módulos formais (20 e 22).