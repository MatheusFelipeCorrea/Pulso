# Prompt — Diagrama de Arquitetura Pulso (Gemini)

Prompt **mega detalhado** no estilo do diagrama C4 Container (referência: diagrama em camadas com boundary do backend, middlewares nomeados, lista de services, jobs em caixa amarela, integrações externas tracejadas e fluxos numerados).

Use no **Gemini** (Imagen / geração de imagem) ou peça *"crie um infográfico técnico em PNG"*.

---

## Prompt principal (copiar e colar)

```
Crie um diagrama de arquitetura de software EXTREMAMENTE DETALHADO, no estilo C4 Model Nível 2 (Container Diagram), para o sistema "PULSO" — plataforma brasileira de gestão financeira pessoal com **app web (React)**, **backend (Node.js)** e **app mobile (Flutter)**, todos consumindo a **mesma API REST**.

REFERÊNCIA VISUAL OBRIGATÓRIA:
- Layout similar a diagramas acadêmicos/TCC de arquitetura em camadas (tipo "Solução de Arquitetura - Backend")
- Caixa grande com borda tracejada envolvendo todo o "Pulso Backend System Boundary"
- Sub-caixas coloridas por camada (verde=abstração, azul=container, amarelo=processos background, roxo tracejado=externos)
- Ícones oficiais: React, Flutter, Node.js, PostgreSQL, RabbitMQ, Google, Gmail/SMTP
- Setas com rótulos de protocolo (HTTPS/JSON, JWT Bearer, OAuth 2.0, REST, WebSocket)
- Caixa de LEGENDA no canto explicando cores e níveis C4
- Lista numerada de fluxos principais (1, 2, 3…) em caixa lateral
- Título grande no topo: "SOLUÇÃO DE ARQUITETURA — PULSO"
- Subtítulo: "C4 Model — Level 2: Container Diagram"
- Proporção paisagem 16:9, alta resolução, texto legível em A4
- Cor de marca: roxo #7C3AED (Pulso). Fundo claro profissional

═══════════════════════════════════════════════════════════════
ESQUERDA — USUÁRIOS E CLIENTES (WEB + MOBILE)
═══════════════════════════════════════════════════════════════

[Ícone Usuário] "Usuário / Cliente"
  → duas setas paralelas para os clientes abaixo

─── CLIENTE 1: Web App (React + Vite) — badge ✅ Implementado — cor roxa clara ───
  Tecnologias:
  • React 19 + Vite 6 (SPA)
  • React Router v7 (rotas públicas + autenticadas)
  • Redux Toolkit (authSlice, themeSlice)
  • Axios (services HTTP → /api)
  • Design System próprio (--ds-* tokens, componentes UI)
  • React Hook Form + Zod (formulários)
  • date-fns, Lucide React, Recharts (gráficos)
  • Tailwind CSS v4
  • socket.io-client (chat grupos Premium)

  Módulos web: Auth | Dashboard | Transações | Orçamento | Calendário | Dívidas
  | Metas | Viagens | Grupos (Socket.IO) | Expense-split | Planejamento compra
  | Insights/Chatbot (badge em breve)

  → HTTPS/JSON + Bearer JWT → Backend Node
  → WebSocket → /api/socket.io

─── CLIENTE 2: Mobile App (Flutter) — badge ✅ Implementado (Sprint-3: auth, transações, metas, viagens/moedas) — cor azul clara ───
  Tecnologias:
  • Flutter (Dart) — iOS + Android
  • HTTP client (dio ou http) → mesma API REST /api/*
  • Gerenciamento de estado (Provider / Riverpod / Bloc — genérico no diagrama)
  • Secure storage para tokens JWT (access + refresh)
  • Google Sign-In nativo (OAuth → backend)
  • Socket.IO ainda não no Flutter (RF-140 parcial)

  Escopo mobile (paridade gradual com web):
  • Auth, Dashboard, Transações, Orçamento, Metas, Notificações
  • Grupos + chat (Premium), Viagens (Premium)
  • Mesmas regras de negócio — **zero lógica duplicada no mobile**

  → HTTPS/JSON + Bearer JWT → Backend Node (API única)
  → WebSocket → /api/socket.io

Anotação visual entre os dois clientes:
  "Backend único (Node.js + Express) — contrato REST compartilhado Web + Mobile"

Deploy: Web = SPA estática (dist/) | Mobile = stores (APK/IPA) | API = processo long-running (Socket.IO + RabbitMQ)

═══════════════════════════════════════════════════════════════
CENTRO — PULSO BACKEND SYSTEM BOUNDARY (borda tracejada azul)
═══════════════════════════════════════════════════════════════

Entrada: "Express Server (Node.js)" — ícone Node
  Subtexto: "server.js — API única para Web + Mobile (TI5)"
  Roteamento: prefixo global /api + Socket.IO em /api/socket.io
  Contrato: JSON REST + JWT; CORS multi-origem (web + app Flutter)

─── CAMADA: Middlewares (caixa verde clara) ───
Listar cada um:
  • helmet (security headers)
  • cors (CORS_ORIGIN multi-domínio)
  • express.json
  • passport.initialize (Google OAuth)
  • authMiddleware (JWT access token)
  • authRateLimit (rotas sensíveis de auth)
  • validateMiddleware (schemas Zod)
  • cronAuthMiddleware (CRON_SECRET para /api/cron/*)
  • errorMiddleware (AppError → JSON padronizado)

─── CAMADA: Controllers — padrão MVC (caixa verde) ───
Listar todos:
  authController | transactionController | categoryController | tagController
  budgetController | reminderController | calendarController | notificationController
  debtController | metaController | viagemController | grupoController
  moedaController | dashboardController | importController | cronController

  Função: receber HTTP, delegar ao Service, retornar status + JSON

─── CAMADA: Domain Services — regras de negócio (caixa verde maior) ───
Listar TODOS os services com agrupamento por módulo:

  [Auth & Conta]
  • authService — registro, login, refresh token rotativo, bcrypt, verificação e-mail
  • categoryService — categorias padrão no registro (RN-165)

  [Financeiro]
  • transactionService — CRUD, validação recurso×categoria (VA/VR; VT legado rejeitado)
  • transactionFilterService — filtros, paginação, resumo
  • budgetService — limites mensais, cópia mês anterior, % gasto
  • debtService — dívidas EU_DEVO/ME_DEVEM, pagamentos parciais

  [Organização]
  • reminderService — CRUD lembretes, marcar pago, recorrência mensal
  • calendarService — visão mês/dia, agregação transações+lembretes
  • notificationService — criar/listar/marcar lida, linkAcao
  • reminderAlertService | debtAlertService — alertas para jobs

  [Planejamento]
  • metaService — metas, aportes, status ATIVA/CONCLUIDA
  • viagemService — viagens, pretensões de gasto, observações (checklist/link)
  • moedaService — moedas favoritas, conversão
  • tripFlightPriceService — preços de passagem (Amadeus)

  [Integrações]
  • googleCalendarService — OAuth Calendar, tokens criptografados (Premium)
  • googleCalendarSyncService — sync lembretes ↔ eventos Google
  • tagService | grupoService | dashboardService | importService

─── CAMADA: Messaging — TI5 (caixa verde) ───
  • rabbit.js — filas pulso.alerts, pulso.reminders, pulso.emails
  • jobBridge.js — publish/consume ou modo direto (fail-soft)
  • socket/groupChat.js — Socket.IO /api/socket.io

─── CAMADA: Middleware Premium (caixa verde pequena) ───
  • requirePremium — Grupos, Viagens, Google Calendar sync

─── CAMADA: Providers — adaptadores externos (caixa verde) ───
  • emailProvider + templates (verificação, reset senha) → SMTP
  • awesomeApiProvider → cotações USD/EUR/ARS (AwesomeAPI Economia)
  • amadeusProvider → preços de voos (Amadeus API)

─── CAMADA: Repositories — acesso a dados (caixa verde) ───
  "Prisma ORM + Repositories"
  Listar: authRepository, transactionRepository, budgetRepository,
  reminderRepository, notificationRepository,
  debtRepository, metaRepository, viagemRepository, grupoRepository,
  moedaFavoritaRepository, categoryRepository, tagRepository

─── CAMADA: Views / Response (caixa verde pequena) ───
  "JSON padronizado + headers de paginação"
  X-Total-Count | X-Total-Pages | X-Current-Page

─── BANCO DE DADOS (dentro do boundary, ícone PostgreSQL) ───
  "PostgreSQL (Neon — serverless)"
  • Prisma schema + migrations
  • DATABASE_URL (pooler) + DIRECT_URL (migrations)
  Principais tabelas (listar agrupado):
    usuarios, configuracoes_usuario, tokens_renovacao
    transacoes, categorias, tags, transacoes_tags
    orcamentos, notificacoes, lembretes
    metas, aportes_meta, viagens, despesas_viagem, observacoes_viagem, moedas_favoritas
    grupos, membros_grupo, mensagens_chat_grupo, metas_grupo
    dividas, pagamentos_divida, divisoes, itens_planejamento_compra

─── MESSAGE BROKER (dentro ou adjacente ao boundary — ícone RabbitMQ laranja) ───
  Caixa destacada "RabbitMQ" (CloudAMQP ou broker dedicado):
  • Fila pulso.alerts — alertas de orçamento, dívidas
  • Fila pulso.reminders — lembretes e recorrências
  • Fila pulso.emails — e-mails transacionais assíncronos
  • jobBridge.js publica/consome; fail-soft sem RABBITMQ_URL (modo direto)
  Setas bidirecionais: Jobs ↔ RabbitMQ ↔ Services

═══════════════════════════════════════════════════════════════
DIREITA — PROCESSO EM BACKGROUND (caixa AMARELA)
═══════════════════════════════════════════════════════════════

Título: "Background Process"
Subtítulo: "node-cron (agendador) + RabbitMQ consumers"

Rotas protegidas:
  GET /api/cron/tick (a cada 20 min — opcional)
  GET /api/cron/daily (1×/dia — Bearer CRON_SECRET)

Jobs (listar com ícone relógio):
  • budgetAlertJob — verifica 80% e 100% do orçamento → notificações
  • tokenCleanupJob — remove tokens expirados/revogados
  • recurringTransactionsJob — gera lançamentos RRULE (RFC 5545)
  • reminderAlertJob — alertas de vencimento de lembretes
  • reminderRecurrenceJob — gera lembretes mensais recorrentes
  • debtAlertJob — alertas de dívidas
  • debtCleanupJob — limpeza de dívidas quitadas antigas

Fluxo numerado dentro da caixa amarela:
  1. Cron dispara GET /api/cron/daily (Bearer CRON_SECRET)
  2. jobBridge publica nas filas RabbitMQ (ou executa direto se indisponível)
  3. Consumers executam budgetAlertJob, reminderAlertJob, etc.
  4. Services consultam Prisma; notificationService persiste alertas
  5. Web e Mobile exibem badge no sino / push local (futuro)

═══════════════════════════════════════════════════════════════
EXTREMA DIREITA — EXTERNAL API INTEGRATIONS (borda tracejada ROXA)
═══════════════════════════════════════════════════════════════

Caixa tracejada "External API Integrations":

  [RabbitMQ — Message Broker] — DESTAQUE VISUAL (ícone coelho laranja)
    → Filas: pulso.alerts | pulso.reminders | pulso.emails
    → Seta bidirecional com jobBridge.js e Jobs
    → Anotar: "opcional — fail-soft sem RABBITMQ_URL"

  [Google OAuth 2.0]
    → Login social (/api/auth/google)
    → seta bidirecional com authService

  [Google Calendar API]
    → Sync lembretes (/api/calendario/google/*)
    → seta com googleCalendarSyncService

  [SMTP — Gmail / Mailtrap]
    → E-mails transacionais (verificação, reset senha)
    → seta com emailProvider

  [AwesomeAPI Economia]
    → Cotações diárias de moedas (viagens)
    → seta com awesomeApiProvider + TripExchangeChart no frontend

  [Amadeus API]
    → Preços médios de passagens aéreas
    → seta com amadeusProvider + tripFlightPriceService

  [Google Gemini API] — badge "parcial / planejado"
    → Insights no calendário, chatbot financeiro
    → seta tracejada (futuro)

  NÃO incluir Vercel ou plataforma de hosting genérica — foco em RabbitMQ como infra de mensageria.

═══════════════════════════════════════════════════════════════
FLUXOS NUMERADOS (caixa lateral inferior — OBRIGATÓRIO)
═══════════════════════════════════════════════════════════════

Incluir lista detalhada:

Fluxo 1 — Autenticação JWT (Web ou Mobile):
  1. Cliente (React ou Flutter) envia credenciais → authController
  2. authService valida bcrypt + verificação e-mail (ou Google OAuth)
  3. Gera access token (curto) + refresh token (rotativo em tokens_renovacao)
  4. Web: Redux + cookies httpOnly | Mobile: secure storage + Bearer header
  5. Ambos os clientes chamam /api/* com JWT nas requisições

Fluxo 2 — Transação financeira:
  1. TransactionFormModal valida recurso×categoria no frontend
  2. POST /api/transacoes → validateMiddleware (Zod)
  3. transactionService aplica validação VA/VR (VT legado rejeitado)
  4. transactionRepository persiste via Prisma
  5. Resposta JSON → atualiza lista e cards de resumo

Fluxo 3 — Orçamento e alertas (RabbitMQ):
  1. Usuário define limites → POST /api/orcamentos
  2. budgetService calcula gastos reais das transações do mês
  3. Cron publica em pulso.alerts (ou budgetAlertJob direto)
  4. Consumer processa: ≥ 80% ALERTA_ORCAMENTO | ≥ 100% ORCAMENTO_ESTOURADO
  5. NotificationPanel exibe no sino com linkAcao → /budget

Fluxo 4 — Viagem e cotações:
  1. Usuário cria viagem (destino, moeda, data)
  2. Cadastra pretensões de gasto por categoria
  3. moedaService consulta AwesomeAPI para histórico
  4. Frontend renderiza TripExchangeChart (Recharts) + conversor rápido
  5. Opcional: vincular meta financeira à viagem

Fluxo 5 — Google Calendar:
  1. Usuário conecta em /calendar → OAuth scope Calendar
  2. Tokens salvos criptografados em configuracoes_usuario
  3. POST /api/calendario/google/sync
  4. googleCalendarSyncService cria/atualiza eventos
  5. lembrete.googleEventId persistido no banco

Fluxo 6 — Chat de grupo (Socket.IO — Web ou Mobile):
  1. Cliente Premium (React ou Flutter) conecta em /api/socket.io
  2. Entra na room do grupo
  3. Mensagens em tempo real + histórico via REST

Fluxo 7 — RabbitMQ (mensageria TI5):
  1. Cron ou evento de domínio publica em pulso.alerts, pulso.reminders ou pulso.emails
  2. jobBridge.js enfileira mensagem no RabbitMQ
  3. Consumer dedicado processa (orçamento, lembretes, e-mails)
  4. Sem RABBITMQ_URL → fail-soft: jobs rodam em modo direto no mesmo processo

═══════════════════════════════════════════════════════════════
LEGENDA (canto inferior)
═══════════════════════════════════════════════════════════════

  🔵 Azul — Container C4 (Web React, Mobile Flutter, Backend Node)
  🟢 Verde — Camadas de abstração internas do backend
  🟡 Amarelo — Processos background / cron + consumers RabbitMQ
  🟠 Laranja — RabbitMQ (message broker)
  🟣 Roxo tracejado — Sistemas externos (APIs)
  ✅ Implementado | ⏳ Planejado (usar badges)

═══════════════════════════════════════════════════════════════
RESTRIÇÕES FINAIS
═══════════════════════════════════════════════════════════════

- Mostrar **dois clientes** (Web React + Mobile Flutter) apontando para o **mesmo** backend Node
- Flutter com badge ✅ Implementado (paridade parcial); React com badge ✅ Implementado
- Não incluir Vercel no diagrama
- Destacar RabbitMQ com ícone e as 3 filas (pulso.alerts, pulso.reminders, pulso.emails)
- Texto em português brasileiro
- Não inventar tecnologias que não existem no projeto
- Gerar UMA imagem única, coesa, profissional, pronta para TCC/documentação
```

---

## Prompt de refinamento (se a 1ª versão ficar simples demais)

Cole depois da primeira imagem:

```
Refine o diagrama anterior para ficar MAIS denso e detalhado:
- Aumente a lista de Domain Services (todos os services do backend)
- Adicione caixa amarela "Background Process" com os jobs + consumers RabbitMQ
- Destaque RabbitMQ (3 filas) como container/integração externa com ícone
- Adicione borda tracejada "External API Integrations" (Google, SMTP, AwesomeAPI, Amadeus, Gemini)
- Inclua os 7 fluxos numerados em caixa lateral
- Use ícones React, Flutter, Node.js, PostgreSQL, RabbitMQ
- Mostre Web (React) e Mobile (Flutter) como containers separados no C4
- NÃO inclua Vercel
- Mantenha estilo C4 Level 2 Container Diagram acadêmico
- Cor de destaque #7C3AED (roxo Pulso)
- Não remova texto — quero nível de detalhe de diagrama de TCC
```

---

## Prompt com imagem de referência

Se o Gemini aceitar upload de imagem, anexe o diagrama de referência (Agrofarm) e adicione:

```
Replique EXATAMENTE este estilo visual e nível de detalhe, mas com o conteúdo do sistema Pulso (gestão financeira pessoal) conforme o prompt acima. Mesma hierarquia de caixas, mesmas cores por camada, mesma legenda C4, mesmos fluxos numerados na lateral.
```

---

## Export

Salvar como: `Documentacao/04-Diagramas/Diagrama de Arquitetura/Arquitetura Pulso TI5.png`

---

## Referências do código

| Área | Caminho |
|------|---------|
| Deploy / hospedagem | `Documentacao/02-Engenharia/Deploy/` |
| RabbitMQ | `Codigo/Pulso/api/src/messaging/rabbit.js` |
| Rotas API | `Codigo/Pulso/api/src/routes/index.js` |
| Services | `Codigo/Pulso/api/src/services/` |
| Jobs | `Codigo/Pulso/api/src/jobs/` |
| Providers | `Codigo/Pulso/api/src/providers/` |
| Schema DB | `Codigo/Pulso/api/prisma/schema.prisma` |
| Frontend Web | `Codigo/Pulso/web/src/` |
| Mobile Flutter | `Codigo/Pulso/mobile` — REST (auth, transações, metas, viagens); Socket.IO ainda não |
