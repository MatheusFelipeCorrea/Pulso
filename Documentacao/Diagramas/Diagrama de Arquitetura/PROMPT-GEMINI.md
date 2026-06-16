# Prompt — Diagrama de Arquitetura Pulso (Gemini)

Prompt **mega detalhado** no estilo do diagrama C4 Container (referência: diagrama em camadas com boundary do backend, middlewares nomeados, lista de services, jobs em caixa amarela, integrações externas tracejadas e fluxos numerados).

Use no **Gemini** (Imagen / geração de imagem) ou peça *"crie um infográfico técnico em PNG"*.

---

## Prompt principal (copiar e colar)

```
Crie um diagrama de arquitetura de software EXTREMAMENTE DETALHADO, no estilo C4 Model Nível 2 (Container Diagram), para o sistema "PULSO" — aplicativo web brasileiro de gestão financeira pessoal.

REFERÊNCIA VISUAL OBRIGATÓRIA:
- Layout similar a diagramas acadêmicos/TCC de arquitetura em camadas (tipo "Solução de Arquitetura - Backend")
- Caixa grande com borda tracejada envolvendo todo o "Pulso Backend System Boundary"
- Sub-caixas coloridas por camada (verde=abstração, azul=container, amarelo=processos background, roxo tracejado=externos)
- Ícones oficiais: React, Node.js, PostgreSQL, Vercel, Google, Gmail/SMTP
- Setas com rótulos de protocolo (HTTPS/JSON, JWT Bearer, OAuth 2.0, REST)
- Caixa de LEGENDA no canto explicando cores e níveis C4
- Lista numerada de fluxos principais (1, 2, 3…) em caixa lateral
- Título grande no topo: "SOLUÇÃO DE ARQUITETURA — PULSO"
- Subtítulo: "C4 Model — Level 2: Container Diagram"
- Proporção paisagem 16:9, alta resolução, texto legível em A4
- Cor de marca: roxo #7C3AED (Pulso). Fundo claro profissional

═══════════════════════════════════════════════════════════════
ESQUERDA — USUÁRIO E FRONTEND
═══════════════════════════════════════════════════════════════

[Ícone Usuário] "Usuário / Cliente"
  → seta "HTTPS / JSON" →

Caixa "Frontend App (React + Vite)" — cor roxa clara:
  Tecnologias internas (listar em bullets):
  • React 19 + Vite 6 (SPA)
  • React Router v7 (rotas públicas + autenticadas)
  • Redux Toolkit (authSlice, themeSlice)
  • Axios (services HTTP → /api)
  • Design System próprio (--ds-* tokens, componentes UI)
  • React Hook Form + Zod (formulários)
  • date-fns, Lucide React, Recharts (gráficos)
  • Tailwind CSS v4

  Páginas implementadas (agrupar visualmente):
  • Auth: Login, Registro, OAuth callback, Reset senha, Verificar e-mail
  • Financeiro: Transações, Orçamento, Calendário, Dívidas, Vale Transporte
  • Planejamento: Metas, Viagens (+ detalhe), Moedas favoritas
  • Layout: MainLayout, Sidebar colapsável, NotificationPanel (sino)
  • Em desenvolvimento (badge "em breve"): Dashboard, Grupos, Relatórios, Insights, Chatbot, Gamificação

  Feature modules (components/features/):
  transactions | budget | calendar | debts | transport | goals | trips | auth | dashboard

  → seta "HTTPS/JSON API Requests\nAuthorization: Bearer JWT" para o backend
  ← seta "JSON Responses" do backend

Deploy frontend: Vercel (build estático dist/) — anotar no rodapé da caixa

═══════════════════════════════════════════════════════════════
CENTRO — PULSO BACKEND SYSTEM BOUNDARY (borda tracejada azul)
═══════════════════════════════════════════════════════════════

Entrada: "Express Server (Node.js)" — ícone Node
  Subtexto: "api/index.js (Vercel serverless) | server.js (dev local)"
  Roteamento: prefixo global /api

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
  transportController | debtController | metaController | viagemController
  moedaController | cronController

  Função: receber HTTP, delegar ao Service, retornar status + JSON

─── CAMADA: Domain Services — regras de negócio (caixa verde maior) ───
Listar TODOS os services com agrupamento por módulo:

  [Auth & Conta]
  • authService — registro, login, refresh token rotativo, bcrypt, verificação e-mail
  • categoryService — categorias padrão no registro (RN-165)

  [Financeiro]
  • transactionService — CRUD, validação recurso×categoria (VA/VR/VT)
  • transactionFilterService — filtros, paginação, resumo
  • budgetService — limites mensais, cópia mês anterior, % gasto
  • debtService — dívidas EU_DEVO/ME_DEVEM, pagamentos parciais
  • transportService — vendas VT, usos VT, saldo (só ESTAGIARIO/CLT)

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
  • googleCalendarService — OAuth Calendar, tokens criptografados
  • googleCalendarSyncService — sync lembretes ↔ eventos Google
  • tagService

─── CAMADA: Providers — adaptadores externos (caixa verde) ───
  • emailProvider + templates (verificação, reset senha) → SMTP
  • awesomeApiProvider → cotações USD/EUR/ARS (AwesomeAPI Economia)
  • amadeusProvider → preços de voos (Amadeus API)

─── CAMADA: Repositories — acesso a dados (caixa verde) ───
  "Prisma ORM + Repositories"
  Listar: authRepository, transactionRepository, budgetRepository,
  reminderRepository, notificationRepository, transportRepository,
  debtRepository, metaRepository, viagemRepository, moedaFavoritaRepository,
  categoryRepository, tagRepository

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
    vendas_vt, usos_vt, dividas, pagamentos_divida
    (futuro: grupos, conquistas, mensagens_chat)

═══════════════════════════════════════════════════════════════
DIREITA — PROCESSO EM BACKGROUND (caixa AMARELA)
═══════════════════════════════════════════════════════════════

Título: "Background Process"
Subtítulo: "Vercel Cron (prod) | node-cron (dev local)"

Rotas protegidas:
  GET /api/cron/tick (a cada 20 min — dev / cron-job.org opcional)
  GET /api/cron/daily (1×/dia — Vercel Hobby)

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
  2. cronController orquestra jobs em paralelo
  3. Services consultam Prisma
  4. notificationService persiste alertas
  5. Frontend exibe badge no sino (polling/contador)

═══════════════════════════════════════════════════════════════
EXTREMA DIREITA — EXTERNAL API INTEGRATIONS (borda tracejada ROXA)
═══════════════════════════════════════════════════════════════

Caixa tracejada "External API Integrations":

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

  [Vercel Platform]
    → Hosting SPA + Serverless + Cron

═══════════════════════════════════════════════════════════════
FLUXOS NUMERADOS (caixa lateral inferior — OBRIGATÓRIO)
═══════════════════════════════════════════════════════════════

Incluir lista detalhada:

Fluxo 1 — Autenticação JWT:
  1. Usuário envia credenciais → authController
  2. authService valida bcrypt + verificação e-mail
  3. Gera access token (curto) + refresh token (rotativo em tokens_renovacao)
  4. Redux armazena credenciais; Axios injeta Bearer em todas as requisições

Fluxo 2 — Transação financeira:
  1. TransactionFormModal valida recurso×categoria no frontend
  2. POST /api/transacoes → validateMiddleware (Zod)
  3. transactionService aplica RN-038..045 (VT só Transporte, VR só Alimentação…)
  4. transactionRepository persiste via Prisma
  5. Resposta JSON → atualiza lista e cards de resumo

Fluxo 3 — Orçamento e alertas:
  1. Usuário define limites → POST /api/orcamentos
  2. budgetService calcula gastos reais das transações do mês
  3. Cron executa budgetAlertJob
  4. Se gasto ≥ 80%: ALERTA_ORCAMENTO | Se ≥ 100%: ORCAMENTO_ESTOURADO
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

Fluxo 6 — Vale Transporte (Estagiário):
  1. Registrar venda VT → gera receita DINHEIRO (RN-041)
  2. Registrar uso de passagens → debita saldo VT
  3. Bloqueio para PJ/Pessoa Física (403)

═══════════════════════════════════════════════════════════════
LEGENDA (canto inferior)
═══════════════════════════════════════════════════════════════

  🔵 Azul — Container C4 (aplicações deployáveis)
  🟢 Verde — Camadas de abstração internas
  🟡 Amarelo — Processos background / cron
  🟣 Roxo tracejado — Sistemas externos
  ✅ Implementado | ⏳ Planejado (usar badges)

═══════════════════════════════════════════════════════════════
RESTRIÇÕES FINAIS
═══════════════════════════════════════════════════════════════


- Texto em português brasileiro
- Não inventar tecnologias que não existem no projeto
- Gerar UMA imagem única, coesa, profissional, pronta para TCC/documentação
```

---

## Prompt de refinamento (se a 1ª versão ficar simples demais)

Cole depois da primeira imagem:

```
Refine o diagrama anterior para ficar MAIS denso e detalhado:
- Aumente a lista de Domain Services (todos os 19 services do backend)
- Adicione caixa amarela "Background Process" com os 7 jobs nomeados
- Adicione borda tracejada "External API Integrations" com 6 integrações
- Inclua os 6 fluxos numerados em caixa lateral
- Use ícones React, Node.js, PostgreSQL, Vercel
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

Salvar como: `Documentacao/Diagramas/Diagrama de Arquitetura/Arquitetura Pulso V1.png`

---

## Referências do código

| Área | Caminho |
|------|---------|
| Deploy Vercel | `Documentacao/Deploy/Hospedagem.md` |
| Rotas API | `Codigo/Pulso/api/src/routes/index.js` |
| Services | `Codigo/Pulso/api/src/services/` |
| Jobs | `Codigo/Pulso/api/src/jobs/` |
| Providers | `Codigo/Pulso/api/src/providers/` |
| Schema DB | `Codigo/Pulso/api/prisma/schema.prisma` |
| Frontend | `Codigo/Pulso/web/src/` |
