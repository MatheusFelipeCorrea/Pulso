# 🗺️ Pulso — Roadmap de Implementação

Guia de ordem de desenvolvimento do sistema Pulso, do zero até o deploy.

---

## 📋 Visão Geral das Fases

| Fase | O que | Estimativa |
|---|---|---|
| Fase 0 | Setup (já feito ✅) | — |
| Fase 1 | Design System (componentes base) | 1-2 semanas |
| Fase 2 | Layouts + Navegação | 3-5 dias |
| Fase 3 | Autenticação (front + back) | 1 semana |
| Fase 4 | Core Financeiro | 2-3 semanas |
| Fase 5 | Módulos Secundários | 2-3 semanas |
| Fase 6 | IA e Inteligência | 1-2 semanas |
| Fase 7 | Social (Grupos) | 1-2 semanas |
| Fase 8 | Gamificação | 1 semana |
| Fase 9 | Homepage + Onboarding | 3-5 dias |
| Fase 10 | Testes + Polish + Deploy | 1-2 semanas |

---

## Fase 0 — Setup ✅ (já feito)

```
✅ Repositório criado
✅ Estrutura de pastas (web + api)
✅ Dependências instaladas
✅ Prisma configurado + migrations
✅ Banco de dados no Neon
✅ .env configurado
✅ Servidor rodando (Express + Vite)
✅ Arquivos base (app.js, server.js, main.jsx, App.jsx)
```

---

## Fase 1 — Design System (componentes base)

> **Por que primeiro?** Tudo no sistema usa esses componentes. Se construir eles bem agora, todas as telas ficam consistentes e o desenvolvimento acelera MUITO.

### 1.1 — Fundação CSS
```
- [ ] globals.css com @theme (paleta Vital Purple light + dark)
- [ ] Configurar dark/light mode toggle
- [ ] Fontes (Inter + JetBrains Mono)
- [ ] Variáveis CSS de espaçamento, radius, shadows
```

### 1.2 — Componentes de Input
```
- [ ] Input Text (com todos os estados)
- [ ] Input Password (com toggle + validação)
- [ ] Input Monetário (máscara R$)
- [ ] Input Number (+/-)
- [ ] Input Search
- [ ] Textarea
- [ ] TimePicker
```

### 1.3 — Selects e Pickers
```
- [ ] Select/Dropdown simples
- [ ] Select com busca (single)
- [ ] Select com busca (multiple)
- [ ] Multiple select sem busca
- [ ] Multi-select com chips/tags
- [ ] DatePicker
- [ ] DateRangePicker
- [ ] MonthPicker
```

### 1.4 — Botões e Ações
```
- [ ] Button (primary, secondary, ghost, danger, success)
- [ ] Icon Button
- [ ] Loading state nos botões
- [ ] Toggle/Switch
- [ ] Checkbox
- [ ] Radio Button
```

### 1.5 — Feedback e Notificações
```
- [ ] Toast (success, error, warning, info)
- [ ] Cards de notificação (13 tipos)
- [ ] Tooltips
- [ ] Loading Spinner
- [ ] Skeleton/Placeholder
```

### 1.6 — Cards e Dados
```
- [ ] Card padrão (com header, body, footer)
- [ ] Card de recurso (VA, VR, VT, Dinheiro)
- [ ] Badges/Tags (todos os tipos)
- [ ] Avatar (com fallback)
- [ ] Barra de progresso (linear)
- [ ] Barra de progresso (circular)
- [ ] Tabela (com sort, hover)
```

### 1.7 — Navegação
```
- [ ] Tabs (underline, pills, com contador)
- [ ] Breadcrumbs
- [ ] Paginação
```

### 1.8 — Estados
```
- [ ] Empty State
- [ ] Error State
- [ ] Skeleton loading por contexto
```

---

## Fase 2 — Layouts + Navegação

> **Por que segundo?** Com os componentes prontos, monta os layouts que todas as páginas vão usar.

### 2.1 — Layouts
```
- [ ] AuthLayout (centralizado, sem sidebar)
- [ ] MainLayout (header + sidebar + conteúdo + footer)
- [ ] HomepageLayout (navbar + conteúdo + footer, sem sidebar)
```

### 2.2 — Sidebar
```
- [ ] Sidebar expandida (com dropdowns)
- [ ] Sidebar colapsada (só ícones)
- [ ] Toggle colapsar/expandir
- [ ] Menus com dropdown (Financeiro, Planejamento, etc.)
- [ ] Item ativo com highlight
- [ ] Tag de modo abaixo do nome
- [ ] Seção Conta (Perfil, Configurações, Sair)
- [ ] Responsivo: hamburger no mobile
```

### 2.3 — Header
```
- [ ] Logo clicável
- [ ] Streak counter
- [ ] Score de saúde mini
- [ ] Avatar + dropdown (perfil, config, sair)
- [ ] Toggle tema (dark/light)
- [ ] Notificações (sino com badge de contagem)
```

### 2.4 — Navegação
```
- [ ] React Router configurado (todas as rotas)
- [ ] PrivateRoute (redireciona se não logado)
- [ ] PublicRoute (redireciona se já logado)
- [ ] 404 page
```

---

## Fase 3 — Autenticação (Front + Back)

> **Por que terceiro?** Precisa estar logado pra acessar qualquer coisa. É a porta de entrada.

### 3.1 — Backend Auth
```
- [ ] POST /auth/register (criar conta com email/senha)
- [ ] POST /auth/login (gerar JWT + refresh token)
- [ ] POST /auth/refresh (rotação de tokens)
- [ ] POST /auth/logout (invalidar refresh)
- [ ] GET /auth/verify?token= (confirmar email)
- [ ] POST /auth/forgot-password
- [ ] POST /auth/reset-password
- [ ] GET /auth/google (redirect OAuth)
- [ ] GET /auth/google/callback
- [ ] Middleware authMiddleware (validar JWT)
- [ ] Rate limiting nas rotas de auth (10 req/min)
- [ ] Envio de email (Nodemailer + Mailtrap)
```

### 3.2 — Frontend Auth
```
- [ ] Tela de Login
- [ ] Tela de Cadastro (com select de modo)
- [ ] Tela Esqueci a Senha
- [ ] Tela Redefinir Senha
- [ ] Tela Verificar Email
- [ ] authSlice (Redux)
- [ ] authService (Axios)
- [ ] Interceptor de refresh automático
- [ ] Proteção de rotas (PrivateRoute)
- [ ] Persistência do token (httpOnly cookie)
```

### 3.3 — Onboarding (primeiro acesso)
```
- [ ] Detectar primeiro login
- [ ] Step 1: Boas-vindas
- [ ] Step 2: Escolher perfil
- [ ] Step 3: Receitas fixas
- [ ] Step 4: Orçamento (opcional)
- [ ] Step 5: Preferências
- [ ] Step 6: Tudo pronto
- [ ] Salvar configurações no banco
```

---

## Fase 4 — Core Financeiro

> **O coração do sistema.** Transações, saldos, categorias.

### 4.1 — Categorias (Backend + Frontend)
```
- [ ] CRUD de categorias
- [ ] Seed de categorias padrão (Alimentação, Transporte, etc.)
- [ ] Categorias personalizadas
- [ ] Ícone + cor por categoria
```

### 4.2 — Transações (Backend)
```
- [ ] CRUD completo (/transactions)
- [ ] Filtros: período, categoria, tipo, recurso
- [ ] Busca por descrição/tag
- [ ] Transações recorrentes (RRULE)
- [ ] Cron job: gerar recorrentes (node-cron)
- [ ] Validação: recurso x categoria (VT ≠ alimentação)
- [ ] Cálculo de saldos por recurso
```

### 4.3 — Transações (Frontend)
```
- [ ] Tela de Transações (lista + filtros)
- [ ] Modal Nova/Editar Transação
- [ ] Modal Confirmar Exclusão
- [ ] transactionSlice + transactionService
- [ ] Tags (multi-select chips)
```

### 4.4 — Dashboard
```
- [ ] Cards de saldo por recurso (VA, VR, VT, Dinheiro)
- [ ] Card saldo total
- [ ] Gráfico receitas vs despesas (Recharts)
- [ ] Gráfico gastos por categoria (donut)
- [ ] Últimas transações (mini tabela)
- [ ] Metas ativas (preview)
- [ ] Score de saúde (mini)
- [ ] Streak (mini)
```

### 4.5 — Orçamento Mensal
```
- [ ] Backend: limites por categoria
- [ ] Frontend: tela de orçamento
- [ ] Modal: editar limites
- [ ] Cálculo % de uso
- [ ] Alertas (80% e 100%+)
```

### 4.6 — Calendário Financeiro + Lembretes
```
- [ ] Backend: CRUD lembretes
- [ ] Backend: Google Calendar sync (provider)
- [ ] Frontend: tela calendário (grid mensal)
- [ ] Frontend: painel de detalhe do dia
- [ ] Frontend: lista de lembretes
- [ ] Modal: novo/editar lembrete
- [ ] Cron job: lembrete sync (cada 6h)
```

---

## Fase 5 — Módulos Secundários

### 5.1 — Metas Financeiras
```
- [ ] Backend: CRUD metas + aportes
- [ ] Frontend: tela de metas (lista com filtros)
- [ ] Modal: nova/editar meta
- [ ] Modal: aporte
- [ ] Cálculo sugerido mensal
- [ ] Auto-concluir ao atingir alvo
```

### 5.2 — Vale Transporte
```
- [ ] Backend: CRUD vendas + usos
- [ ] Frontend: tela VT (saldo, countdown, histórico)
- [ ] Modal: registrar venda
- [ ] Modal: registrar uso
- [ ] Lógica de intervalo entre vendas
- [ ] Cálculo: saldo = recebido - usado - vendido
```

### 5.3 — Viagens e Moedas
```
- [ ] Backend: CRUD viagens + pretensões
- [ ] Backend: provider AwesomeAPI (cotações)
- [ ] Frontend: tela viagens (lista + conversor)
- [ ] Frontend: tela detalhe da viagem
- [ ] Modal: nova viagem
- [ ] Modal: nova pretensão
- [ ] Modal: observação
- [ ] Moedas favoritas
- [ ] Gráfico histórico de cotação
```

### 5.4 — Dívidas Pessoais
```
- [ ] Backend: CRUD dívidas
- [ ] Frontend: tela dívidas (tabs: me devem / eu devo / quitadas)
- [ ] Modal: nova dívida
- [ ] Marcar como paga
- [ ] Alertas de vencimento
```

### 5.5 — Divisão de Despesas
```
- [ ] Backend: CRUD divisões + participantes
- [ ] Frontend: tela divisões
- [ ] Modal: nova divisão
- [ ] Modal: lembrete de cobrança
- [ ] Cálculo igualitário e personalizado
- [ ] Saldo consolidado
```

### 5.6 — Planejamento de Compra
```
- [ ] Backend: CRUD itens
- [ ] Frontend: tela planejamento
- [ ] Modal: novo item
- [ ] Modal: vincular meta
- [ ] Simulação de parcelamento
- [ ] Cálculo de comprometimento de renda
- [ ] Ação "Comprei!"
```

### 5.7 — Relatórios
```
- [ ] Backend: endpoints de relatório (monthly, categories, comparison, evolution)
- [ ] Frontend: tela relatórios
- [ ] Gráficos: pizza, barras comparativas, linha de evolução
- [ ] Gastos por recurso
- [ ] Top 5 maiores gastos
- [ ] Métricas rápidas
- [ ] Exportar PDF (@react-pdf/renderer)
- [ ] Exportar CSV (PapaParse)
```

### 5.8 — Perfil e Configurações
```
- [ ] Backend: endpoints de user/settings
- [ ] Frontend: tela perfil
- [ ] Frontend: tela configurações
- [ ] Modal: alterar senha
- [ ] Modal: sessões ativas
- [ ] Edição de receitas fixas
- [ ] Troca de modo (Estagiário/CLT/PJ/Pessoal)
- [ ] Toggles de preferências
- [ ] Exclusão de conta (com confirmação)
```

---

## Fase 6 — IA e Inteligência

### 6.1 — Insights
```
- [ ] Backend: provider Gemini (prompt engineering)
- [ ] Backend: endpoint /insights (summary, suggestions, alerts, score)
- [ ] Frontend: tela Insights
- [ ] Resumo mensal (linguagem natural)
- [ ] Categorias vs mês anterior
- [ ] Score de saúde financeira
- [ ] Projeção futura (3 cenários)
- [ ] Sugestões personalizadas
- [ ] Alertas preditivos
- [ ] Botão "Regenerar"
```

### 6.2 — Chatbot
```
- [ ] Backend: endpoint /chatbot/message
- [ ] Backend: contexto financeiro no prompt (dados reais do user)
- [ ] Backend: limitação de escopo (só finanças)
- [ ] Frontend: tela Chatbot (dedicada)
- [ ] Mensagens user vs bot
- [ ] Chips de sugestão
- [ ] Indicador "digitando..."
- [ ] Histórico da sessão
- [ ] Rate limit (20 msg/min)
```

---

## Fase 7 — Social (Grupos)

```
- [ ] Backend: CRUD grupos + membros
- [ ] Backend: gerar código de convite
- [ ] Backend: viagens de grupo + pretensões por membro
- [ ] Backend: metas de grupo + aportes por membro
- [ ] Backend: chat do grupo
- [ ] Frontend: tela Grupos (lista)
- [ ] Frontend: tela Detalhe do Grupo
- [ ] Modal: novo grupo
- [ ] Modal: entrar no grupo
- [ ] Modal: convidar
- [ ] Modal: meta do grupo
- [ ] Modal: aporte no grupo
- [ ] Cálculo: total por membro
- [ ] Ações: sair do grupo, excluir (admin)
```

---

## Fase 8 — Gamificação

```
- [ ] Backend: streak (calcular, incrementar, resetar)
- [ ] Backend: conquistas (seed + verificação automática)
- [ ] Backend: desafio mensal (gerar via Gemini)
- [ ] Backend: XP e níveis
- [ ] Frontend: tela Gamificação/Conquistas
- [ ] Grid de badges (desbloqueadas/bloqueadas)
- [ ] Desafio do mês com progresso
- [ ] Educação financeira (quizzes)
- [ ] Modal: quiz
- [ ] Toast de conquista ao desbloquear
```

---

## Fase 9 — Homepage + Onboarding

```
- [ ] Frontend: Homepage (landing page pública)
- [ ] Navbar, Hero, Funcionalidades, Para Quem, Diferenciais, CTA, Footer
- [ ] Responsividade da homepage
- [ ] Revisão do onboarding (já feito na Fase 3)
```

---

## Fase 10 — Testes + Polish + Deploy

### 10.1 — Testes
```
- [ ] Testes unitários: services do backend (85%+ cobertura)
- [ ] Testes unitários: slices e hooks do frontend
- [ ] Testes de integração: fluxos críticos (auth, transações, metas)
- [ ] Testes de componentes (Testing Library)
```

### 10.2 — Polish
```
- [ ] Responsividade: testar 360px a 1920px
- [ ] Acessibilidade: aria-labels, focus, contraste
- [ ] Animações e transições suaves
- [ ] Tratamento de erros em TODAS as telas
- [ ] Loading states em TODAS as telas
- [ ] Empty states em TODAS as listas
```

### 10.3 — Deploy
```
- [ ] Frontend: deploy na Vercel
- [ ] Backend: deploy no Render
- [ ] Banco: já no Neon ✅
- [ ] Variáveis de ambiente em produção
- [ ] HTTPS forçado
- [ ] Domínio personalizado (se tiver)
- [ ] README de apresentação do repositório
```

---

## 🎯 Ordem resumida (o que fazer AGORA)

```
1º → Design System (componentes)
2º → Layouts (sidebar, header, footer)
3º → Auth (login, cadastro, JWT)
4º → Transações + Dashboard (core do app)
5º → Tudo o resto em ordem de prioridade
```

> 💡 DICA: Sempre que terminar uma fase, faça commit + push. Não acumule código sem versionar.

---

## 📌 Regra de Ouro

```
Componente → Tela → Backend → Integração → Teste

1. Cria o componente isolado (design system)
2. Monta a tela usando os componentes
3. Cria o endpoint no backend
4. Integra front ↔ back (service + slice)
5. Escreve o teste
```

Seguindo essa ordem, o projeto cresce de forma organizada e sustentável.