# 📋 Pulso — Requisitos do Sistema

Documento de rastreamento de todos os requisitos funcionais e não funcionais do sistema **Pulso**.

> **Última revisão:** alinhado ao código em junho/2026.  
> Documentação técnica: [Frontend](../../Codigo/Pulso/web/Documents/Readme.md) · [API](../../Codigo/Pulso/api/Documents/Readme.md) · [Banco de dados](../../Codigo/Pulso/api/Documents/Database.md)

---

## 📊 Progresso Geral

| Categoria | Total | Concluídos | Progresso |
|---|---|---|---|
| Requisitos Funcionais | 138 | 41 | ~30% |
| Requisitos Não Funcionais | 15 | 6 | ~40% |
| **Total** | **153** | **47** | **~31%** |

Contagem considera apenas requisitos **implementados e utilizáveis** no código atual. Módulos entregues: auth, transações (incl. categorias personalizadas), vale transporte, orçamento, calendário/lembretes (incl. Google Calendar bidirecional parcial), homepage pública e notificações (orçamento + lembretes).

---

## 📊 Progresso por Módulo

| Módulo | Total | Concluídos | Progresso |
|---|---|---|---|
| 🔐 Autenticação | 6 | 6 | ✅ |
| 📊 Dashboard | 8 | 0 |  |
| 💳 Transações | 11 | 11 | ✅ |
| 🎯 Metas | 7 | 0 |  |
| 🌍 Viagens e Moedas | 11 | 0 |  |
| 🤖 Insights | 7 | 0 |  |
| 💬 Chatbot | 5 | 0 |  |
| 📅 Lembretes | 5 | 5 | ✅ |
| 🚌 Vale Transporte | 8 | 8 | ✅ |
| 📈 Relatórios | 6 | 0 |  |
| 👤 Perfil e Configurações | 8 | 0 | 🟡 |
| 🎮 Gamificação | 7 | 0 |  |
| 🏠 Homepage | 4 | 4 | ✅ |
| 👥 Grupos | 15 | 0 |  |
| ⚙️ Não Funcionais | 15 | 6 | 🟡 |
| 📊 Orçamento Mensal | 6 | 6 | ✅ |
| 💸 Divisão de Despesas | 6 | 0 |  |
| 📅 Calendário Financeiro | 5 | 5 | 🟡 |
| 🤝 Dívidas Pessoais | 7 | 0 |  |
| 🛒 Planejamento de Compra | 6 | 0 |  |

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

---

## 🎯 Módulo 04 — Metas Financeiras

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-026 | O sistema deve permitir criar metas com nome, valor-alvo, prazo e descrição opcional | 🔴 Essencial |
| - [ ] | RF-027 | O sistema deve permitir registrar aportes manuais em cada meta | 🔴 Essencial |
| - [ ] | RF-028 | O sistema deve exibir o progresso da meta com barra visual e percentual | 🔴 Essencial |
| - [ ] | RF-029 | O sistema deve calcular e sugerir quanto guardar por mês/semana para atingir a meta no prazo | 🟡 Importante |
| - [ ] | RF-030 | O sistema deve permitir categorizar metas como curto prazo ou longo prazo | 🟡 Importante |
| - [ ] | RF-031 | O sistema deve permitir pausar, editar e concluir metas | 🟡 Importante |
| - [ ] | RF-032 | O sistema deve notificar quando uma meta for atingida | 🟢 Desejável |

---

## 🌍 Módulo 05 — Viagens e Simulador de Moedas

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-033 | O sistema deve exibir cotações em tempo real das principais moedas (USD, EUR, GBP, ARS, etc.) | 🔴 Essencial |
| - [ ] | RF-034 | O sistema deve permitir converter um valor em BRL para qualquer moeda disponível e vice-versa | 🔴 Essencial |
| - [ ] | RF-035 | O sistema deve exibir gráfico de histórico de cotação de uma moeda selecionada | 🟡 Importante |
| - [ ] | RF-036 | O sistema deve permitir salvar moedas favoritas para acesso rápido | 🟢 Desejável |
| - [ ] | RF-037 | O sistema deve permitir criar um planejamento de viagem com nome do destino, moeda local e data prevista | 🔴 Essencial |
| - [ ] | RF-038 | O sistema deve permitir adicionar pretensões de gastos por categoria dentro da viagem (transporte, hospedagem, alimentação, passeios, compras) | 🔴 Essencial |
| - [ ] | RF-039 | O sistema deve calcular o custo total da viagem somando todas as pretensões cadastradas | 🔴 Essencial |
| - [ ] | RF-040 | O sistema deve converter o custo total da viagem para BRL com base na cotação atual da moeda do destino | 🔴 Essencial |
| - [ ] | RF-041 | O sistema deve permitir editar e remover pretensões individuais dentro da viagem | 🟡 Importante |
| - [ ] | RF-042 | O sistema deve permitir criar múltiplas viagens simultâneas | 🟡 Importante |
| - [ ] | RF-043 | O sistema deve vincular uma viagem a uma meta financeira existente para acompanhar o progresso | 🟢 Desejável |

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

### Chatbot

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-049 | O sistema deve disponibilizar um chatbot financeiro acessível via interface de chat | 🔴 Essencial |
| - [ ] | RF-050 | O sistema deve permitir perguntas em linguagem natural sobre transações, saldos, metas e categorias | 🔴 Essencial |
| - [ ] | RF-051 | O sistema deve contextualizar as respostas do chatbot com os dados reais do usuário | 🔴 Essencial |
| - [ ] | RF-052 | O sistema deve limitar o chatbot a responder apenas sobre finanças, recusando perguntas fora do escopo | 🟡 Importante |
| - [ ] | RF-053 | O sistema deve exibir histórico da conversa do chatbot na sessão atual | 🟢 Desejável |

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
| - [x] | RF-064 | O sistema deve permitir configurar o intervalo de dias entre vendas de VT | 🟡 Importante |
| - [x] | RF-065 | O sistema deve exibir um contador regressivo informando em quantos dias o usuário poderá vender o VT novamente | 🟡 Importante |
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

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-088 | O sistema deve permitir criar um grupo com nome e descrição | 🔴 Essencial |
| - [ ] | RF-089 | O sistema deve gerar um link/código de convite para o grupo | 🔴 Essencial |
| - [ ] | RF-090 | O sistema deve permitir entrar em um grupo via link/código de convite | 🔴 Essencial |
| - [ ] | RF-091 | O sistema deve permitir que o criador do grupo defina um papel para cada membro (admin ou membro) | 🟡 Importante |
| - [ ] | RF-092 | O sistema deve permitir vincular uma viagem ao grupo para planejamento compartilhado | 🔴 Essencial |
| - [ ] | RF-093 | O sistema deve permitir que membros do grupo adicionem pretensões de gastos na viagem compartilhada | 🔴 Essencial |
| - [ ] | RF-094 | O sistema deve calcular o custo total da viagem do grupo somando pretensões de todos os membros | 🔴 Essencial |
| - [ ] | RF-095 | O sistema deve exibir quanto cada membro deve contribuir para a viagem | 🟡 Importante |
| - [ ] | RF-096 | O sistema deve permitir criar metas financeiras compartilhadas no grupo | 🟡 Importante |
| - [ ] | RF-097 | O sistema deve permitir que cada membro faça aportes individuais na meta do grupo | 🟡 Importante |
| - [ ] | RF-098 | O sistema deve manter os perfis e finanças pessoais completamente separados dos dados do grupo | 🔴 Essencial |
| - [ ] | RF-099 | O sistema deve permitir o membro sair do grupo a qualquer momento | 🔴 Essencial |
| - [ ] | RF-100 | O sistema deve permitir o admin remover membros do grupo | 🟡 Importante |
| - [ ] | RF-101 | O sistema deve exibir um painel do grupo com resumo das viagens e metas compartilhadas | 🟡 Importante |
| - [ ] | RF-102 | O sistema deve permitir chat/mensagens dentro do grupo | 🟢 Desejável |

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
| - [~] | RF-123 | O sistema deve exibir os dias de recebimento fixo (salário, VA, VR, VT) destacados no calendário | 🟡 Importante |
| - [x] | RF-124 | O sistema deve exibir vencimentos de contas/lembretes no calendário | 🟡 Importante |
| - [x] | RF-125 | O sistema deve permitir clicar em um dia para ver o detalhe das transações daquele dia | 🔴 Essencial |
---
## 🤝 Módulo 17 — Dívidas Pessoais

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-126 | O sistema deve permitir registrar um empréstimo feito a alguém (quem me deve) com valor, pessoa e data | 🔴 Essencial |
| - [ ] | RF-127 | O sistema deve permitir registrar um empréstimo recebido de alguém (quem eu devo) com valor, pessoa e data | 🔴 Essencial |
| - [ ] | RF-128 | O sistema deve permitir definir prazo de devolução para cada dívida | 🟡 Importante |
| - [ ] | RF-129 | O sistema deve permitir marcar uma dívida como paga/devolvida | 🔴 Essencial |
| - [ ] | RF-130 | O sistema deve exibir saldo consolidado: total que me devem vs total que eu devo | 🔴 Essencial |
| - [ ] | RF-131 | O sistema deve exibir histórico completo de empréstimos (ativos e quitados) | 🟡 Importante |
| - [ ] | RF-132 | O sistema deve alertar quando uma dívida estiver próxima do vencimento | 🟢 Desejável |
---
## 🛒 Módulo 18 — Planejamento de Compra

| Status | Código | Requisito | Prioridade |
|---|---|---|---|
| - [ ] | RF-133 | O sistema deve permitir registrar um item desejado com nome, valor e prioridade | 🔴 Essencial |
| - [ ] | RF-134 | O sistema deve calcular em quanto tempo o usuário poderá comprar o item baseado na sobra mensal atual | 🔴 Essencial |
| - [ ] | RF-135 | O sistema deve simular cenários de compra à vista vs parcelado (com quantidade de parcelas) | 🟡 Importante |
| - [ ] | RF-136 | O sistema deve alertar sobre o percentual da renda comprometido com parcelas | 🟡 Importante |
| - [ ] | RF-137 | O sistema deve permitir vincular um planejamento de compra a uma meta financeira | 🟢 Desejável |
| - [ ] | RF-138 | O sistema deve permitir marcar um item como "comprado" e registrar a transação automaticamente | 🟡 Importante |
---
## ⚙️ Requisitos Não Funcionais

| Status | Código | Requisito | Categoria | Prioridade |
|---|---|---|---|---|
| - [ ] | RNF-001 | O sistema deve responder a qualquer requisição em no máximo 2 segundos em condições normais | Performance | 🔴 Essencial |
| - [x] | RNF-002 | O sistema deve armazenar senhas com hash bcrypt com salt rounds ≥ 12 | Segurança | 🔴 Essencial |
| - [ ] | RNF-003 | Toda comunicação deve ser feita via HTTPS | Segurança | 🔴 Essencial |
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
| - [ ] | RNF-015 | O sistema deve manter cobertura mínima de 85% de testes unitários nas camadas de serviço, podendo ser superior | Qualidade | 🔴 Essencial |

---

## 📌 Notas de implementação (junho/2026)

| Item | Situação |
|------|----------|
| RF-018 | CRUD de categorias personalizadas com **ícone e cor** (padrão Lucide + paleta). UI em Transações → **Categorias** |
| RF-123 | **Parcial:** marcador azul de recebimento no calendário quando `valorSalario` / `valorVa` / `valorVr` / `valorVt` > 0 em `configuracoes_usuario`. Dias vêm de `diaSalario`, `diaVa`, etc. — **sem onboarding ainda**, então só aparece após configurar valores (futuro onboarding/RF-075) |
| RF-076 | Toggle claro/escuro via `useTheme()` no **mobile**; tela Configurações ainda não existe |
| RF-103 / RF-104 | `modoUso` usado na API de VT; UI de perfil/configurações ainda pendente |
| Páginas implementadas | `/` (landing), `/transactions`, `/transport-voucher`, `/budget`, `/calendar` |
| Notificações | Orçamento (`ALERTA_ORCAMENTO`, `ORCAMENTO_ESTOURADO`) + **lembretes** (`LEMBRETE_VENCIMENTO`) via jobs diários (10:00 BRT) + sino no layout |
| Google Calendar | Sync Pulso → Google na criação/edição; **importação Google → Pulso** ao abrir o mês e após sync manual; marcar pago remove evento |
| Lembretes recorrentes | UI “Repetir todo mês” enviada ao backend; job diário gera instâncias mensais |
| Tags | Criar na digitação + listar no catálogo — **sem editar/excluir** (suficiente para MVP; ver observação abaixo) |
| Calendário + IA | Tela entregue; integração com IA (Gemini) na página do calendário **pendente** |
| Banco completo | Schema Prisma com 30+ entidades; API expõe auth, transações, categorias, VT, orçamento, lembretes, calendário e notificações |

### Implementações técnicas fora da lista de RF (dívida / melhorias futuras)

| Item | Situação |
|------|----------|
| Rate limiting global (RNF-004) | Apenas rotas de auth |
| Tokens Google em repouso | JSON sem criptografia (schema prevê criptografia) |
| Cron Vercel (Hobby) | Jobs diários 1×/dia; orçamento local roda a cada 20 min |
| Cobertura de testes (RNF-015) | Apenas auth/tokens — expandir para serviços críticos |
| Tags CRUD completo | Opcional pós-MVP; criação sob demanda cobre o fluxo atual |

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

Contagem apenas dos **138 requisitos funcionais** (RF-001 a RF-138).

| Prioridade | Quantidade | Percentual |
|---|---|---|
| 🔴 Essencial | 71 | 51% |
| 🟡 Importante | 53 | 38% |
| 🟢 Desejável | 14 | 10% |
| **Total** | **138** | **100%** |

---

## 🔮 Roadmap Futuro

- [ ] 🌐 Multi-idioma (i18n) — PT-BR, EN, ES
- [ ] 📱 PWA — Instalável no celular
- [ ] 🔔 Notificações push no navegador
- [ ] 📊 Dashboard customizável (drag and drop de widgets)
- [ ] 🏦 Integração com Open Banking
- [ ] 📸 OCR de cupons fiscais (foto → transação)
- [ ] 📱 Tabela FIPE Sistema de gestão de veiculos e busca de veiculos
- [ ] 📱 Integração com bot whatsapp
- [ ] 🏦 Botão de importar extrato de banco, Vale Refeição, Vale Alimentação
