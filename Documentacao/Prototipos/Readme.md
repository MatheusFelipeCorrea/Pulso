# 🎨 Pulso — Ideias de Protótipos

Documento com wireframes conceituais e ideias visuais para cada tela do sistema **Pulso**. Serve como guia para a construção das interfaces.

---

## 🗂️ Índice

- [Layout Base](#-layout-base)
- [Homepage (Landing Page)](#-homepage-landing-page)
- [Tela de Login](#-tela-de-login)
- [Tela de Cadastro](#-tela-de-cadastro)
- [Dashboard](#-dashboard)
- [Transações](#-transações)
- [Metas](#-metas)
- [Viagens e Moedas](#-viagens-e-moedas)
- [Insights](#-insights)
- [Lembretes](#-lembretes)
- [Vale Transporte](#-vale-transporte)
- [Relatórios](#-relatórios)
- [Perfil e Configurações](#-perfil-e-configurações)
- [Grupos](#-grupos)
- [Chatbot](#-chatbot)
- [Componentes Reutilizáveis](#-componentes-reutilizáveis)
- [Responsividade](#-responsividade)
- [Mapeamento Completo de Telas](#️-mapeamento-completo-de-telas)

---

## 📐 Layout Base

### AuthLayout (Login, Cadastro, Recuperação)

┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│                    💜 pulso.                                  │
│                    "O pulso da sua vida financeira"           │
│                                                              │
│                    ┌──────────────────────┐                  │
│                    │                      │                  │
│                    │   [ FORMULÁRIO ]      │                  │
│                    │                      │                  │
│                    └──────────────────────┘                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘

→ Tela centralizada, sem sidebar nem header
→ Fundo: background (#FAFAFA light / #09090B dark)
→ Logo do Pulso no topo
→ Card centralizado com formulário
→ Responsivo: card ocupa 100% em mobile

### MainLayout (Todas as páginas logadas)

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
│ 💜 pulso.    🔥12   ❤️78   🔍 busca    👤 João    🌙        │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │  CONTEÚDO                                           │
│          │                                                     │
│ 📊 Dash  │  ┌─────────────────────────────────────────────┐   │
│ � Fin.▾ │  │                                             │   │
│  💳 Trans│  │                                             │   │
│  🚌 VT   │  │           [ CONTEÚDO DA PÁGINA ]            │   │
│  📈 Relat│  │                                             │   │
│ 🎯 Plan.▾│  │                                             │   │
│  🎯 Metas│  │                                             │   │
│  🌍 Viag.│  │                                             │   │
│  📅 Lemb.│  └─────────────────────────────────────────────┘   │
│ 🤖 IA  ▾ │                                                     │
│  🤖 Insig│                                                     │
│ 👥 Grupos│                                                     │
│          │                                                     │
│ ──────── │                                                     │
│ 👤 Perfil│                                                     │
│ 🚪 Sair  │                                                     │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER          Pulso v1.0 — Feito com 💜                     │
└────────────────────────────────────────────────────────────────┘

→ Header fixo no topo
→ Sidebar fixa à esquerda (colapsável em mobile → hamburger)
→ Conteúdo scrollável
→ Footer fixo no rodapé
→ Chatbot flutuante no canto inferior direito (em todas as páginas)

### Header — Detalhado

┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  💜 pulso.     🔥 12 dias    ❤️ Score: 78     👤 João ▾   🌙 │
│               (streak)      (saúde)          (menu)  (tema)   │
│                                                                │
└────────────────────────────────────────────────────────────────┘

→ Logo clicável (volta pro dashboard)
→ Streak com ícone de fogo e contagem
→ Score de saúde com coraçãozinho e valor
→ Avatar + nome com dropdown (perfil, configurações, sair)
→ Toggle de tema (sol/lua)

### Sidebar — Detalhada

┌──────────────────────────┐
│                          │
│  📊 Dashboard            │  ← ativo: fundo primary-light, texto primary
│                          │
│  💰 Financeiro       ▾   │  ← dropdown
│     💳 Transações        │
│     🚌 Vale Transporte   │
│     📈 Relatórios        │
│                          │
│  🎯 Planejamento     ▾   │  ← dropdown
│     🎯 Metas             │
│     🌍 Viagens           │
│     📅 Lembretes         │
│                          │
│  🤖 Inteligência     ▾   │  ← dropdown
│     🤖 Insights          │
│                          │
│  👥 Grupos               │  ← link direto
│                          │
│  ──────────              │  ← divisor
│                          │
│  👤 Perfil               │
│  🚪 Sair                 │
│                          │
│     « ◁                  │  ← botão colapsar (fica só ícones)
└──────────────────────────┘

Colapsada (64px — só ícones):
┌────┐
│ 📊 │
│ 💰▾│
│ 🎯▾│
│ 🤖▾│
│ 👥 │
│ ── │
│ 👤 │
│ 🚪 │
│ «  │
└────┘

→ Largura expandida: 240px
→ Largura colapsada: 64px (só ícones)
→ Item ativo: bg primary/10, borda esquerda primary, texto primary
→ Hover: bg surface
→ Ícones: Lucide React
→ Grupos (Financeiro, Planejamento, Inteligência): dropdown expansível com submenus

---

## 🏠 Homepage (Landing Page)

┌────────────────────────────────────────────────────────────────┐
│ NAV                                                            │
│ 💜 pulso.                              [Entrar] [Cadastrar]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    HERO SECTION                                 │
│                                                                │
│              💜 pulso.                                          │
│              O pulso da sua vida financeira.                    │
│                                                                │
│              Controle seus gastos, planeje viagens,             │
│              receba insights inteligentes e alcance             │
│              suas metas — tudo em um só lugar.                  │
│                                                                │
│              [💜 Começar Grátis]    [Saiba mais ↓]             │
│                                                                │
│              ┌──────────────────────────────┐                  │
│              │  📸 Preview do Dashboard      │                  │
│              │  (screenshot ou mockup)       │                  │
│              └──────────────────────────────┘                  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    FUNCIONALIDADES                              │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ 📊       │  │ 🎯       │  │ 🌍       │  │ 🤖       │     │
│  │Dashboard │  │ Metas    │  │ Viagens  │  │ IA       │     │
│  │ Visão    │  │ Defina   │  │ Planeje  │  │ Insights │     │
│  │ completa │  │ e acomp. │  │ e simule │  │ e chat   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ 🚌       │  │ 📅       │  │ 🎮       │  │ 👥       │     │
│  │ Vale     │  │ Lemb.    │  │ Gamific. │  │ Grupos   │     │
│  │ Transp.  │  │ Google   │  │ Streaks  │  │ Viagens  │     │
│  │ Controle │  │ Agenda   │  │ e Badges │  │ em grupo │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    PARA QUEM É?                                 │
│                                                                │
│  "Feito para estagiários, estudantes e jovens que              │
│   estão começando a lidar com dinheiro."                       │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ 🎓       │  │ 💼       │  │ 💑       │                    │
│  │Estudantes│  │Estagiár. │  │ Casais   │                    │
│  │          │  │          │  │          │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    DIFERENCIAS                                  │
│                                                                │
│  ✅ Separa dinheiro real de benefícios (VA, VR, VT)            │
│  ✅ IA que entende o contexto de estagiário                    │
│  ✅ Planejamento de viagem com câmbio integrado                │
│  ✅ Gamificação para criar hábito                              │
│  ✅ Grupos para planejar viagens juntos                        │
│  ✅ 100% gratuito                                              │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    CTA FINAL                                   │
│                                                                │
│              Comece agora a ter pulso firme                     │
│              nas suas finanças.                                 │
│                                                                │
│              [💜 Criar Conta Grátis]                            │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│ FOOTER                                                         │
│ 💜 pulso.  ·  Feito com 💜  ·  GitHub  ·  © 2026             │
└────────────────────────────────────────────────────────────────┘

→ Navbar fixa com logo e botões Entrar/Cadastrar
→ Hero section com slogan, descrição e CTA principal
→ Preview do dashboard (screenshot ou ilustração)
→ Grid de funcionalidades com ícones e descrições curtas
→ Seção "Para quem é" com perfis do público-alvo
→ Lista de diferenciais com checkmarks
→ CTA final antes do footer
→ Footer com links e créditos
→ Toda a página usa a paleta Vital Purple
→ Animações suaves no scroll (fade-in dos cards)
→ Totalmente responsiva

---

## 🔐 Tela de Login

┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                       💜 pulso.                              │
│              "O pulso da sua vida financeira"                 │
│                                                              │
│              ┌────────────────────────────┐                  │
│              │                            │                  │
│              │  📧 Email                  │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │ seu@email.com        │  │                  │
│              │  └──────────────────────┘  │                  │
│              │                            │                  │
│              │  🔒 Senha                  │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │ ••••••••         👁️  │  │                  │
│              │  └──────────────────────┘  │                  │
│              │                            │                  │
│              │  Esqueceu a senha?  →      │                  │
│              │                            │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │    💜 ENTRAR         │  │                  │
│              │  └──────────────────────┘  │                  │
│              │                            │                  │
│              │  ─────── ou ───────        │                  │
│              │                            │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │  G  Entrar com Google│  │                  │
│              │  └──────────────────────┘  │                  │
│              │                            │                  │
│              │  Não tem conta? Cadastre-se│                  │
│              │                            │                  │
│              └────────────────────────────┘                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘

→ Card com shadow-lg, border-radius xl
→ Botão "Entrar": bg primary, texto branco, full width
→ Botão Google: outline, ícone do Google à esquerda
→ Link "Esqueceu a senha": texto primary, alinhado à direita
→ Link "Cadastre-se": texto primary, centralizado
→ Ícone olho no campo senha: toggle visibilidade
→ Validação inline (borda vermelha + mensagem abaixo do campo)

---

## 📝 Tela de Cadastro

┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                       💜 pulso.                              │
│                    Crie sua conta                             │
│                                                              │
│              ┌────────────────────────────┐                  │
│              │                            │                  │
│              │  👤 Nome completo          │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │ João Silva           │  │                  │
│              │  └──────────────────────┘  │                  │
│              │                            │                  │
│              │  📧 Email                  │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │ joao@email.com       │  │                  │
│              │  └──────────────────────┘  │                  │
│              │                            │                  │
│              │  🔒 Senha                  │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │ ••••••••         👁️  │  │                  │
│              │  └──────────────────────┘  │                  │
│              │  ✅ 8+ chars ✅ 1 número   │                  │
│              │  ✅ 1 maiúscula            │                  │
│              │                            │                  │
│              │  🔒 Confirmar senha        │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │ ••••••••         👁️  │  │                  │
│              │  └──────────────────────┘  │                  │
│              │                            │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │   💜 CADASTRAR       │  │                  │
│              │  └──────────────────────┘  │                  │
│              │                            │                  │
│              │  ─────── ou ───────        │                  │
│              │                            │                  │
│              │  ┌──────────────────────┐  │                  │
│              │  │  G  Cadastrar c Google│  │                  │
│              │  └──────────────────────┘  │                  │
│              │                            │                  │
│              │  Já tem conta? Entrar      │                  │
│              │                            │                  │
│              └────────────────────────────┘                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘

→ Checklist de requisitos da senha atualiza em tempo real
→ Checks ficam verdes conforme o usuário digita
→ Confirmação de senha: borda verde se igual, vermelha se diferente
→ Após cadastro: tela de "Verifique seu email" com ícone de envelope

---

## 📊 Dashboard

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  ⚠️ Alerta: Seu VA está 40% acima do ritmo normal  │
│          │                                                     │
│          │  SALDOS POR RECURSO                                 │
│          │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│          │  │💵 Salário│ │🍎 VA     │ │🍽️ VR     │ │🚌 VT   ││
│          │  │          │ │          │ │          │ │        ││
│          │  │R$ 1.200  │ │R$ 320    │ │R$ 480    │ │R$ 52   ││
│          │  │de 1.500  │ │de 450    │ │de 600    │ │de 220  ││
│          │  │▓▓▓▓▓▓░░░ │ │▓▓▓▓▓░░░░ │ │▓▓▓▓▓▓░░░ │ │▓░░░░░░ ││
│          │  └──────────┘ └──────────┘ └──────────┘ └────────┘│
│          │                                                     │
│          │  ┌─────── SALDO TOTAL ────────┐                    │
│          │  │     💰 R$ 2.052,00          │                    │
│          │  │     disponível este mês     │                    │
│          │  └────────────────────────────┘                    │
│          │                                                     │
│          │  ┌─────────────────┐ ┌─────────────────┐           │
│          │  │ 📊 Receita x    │ │ 🥧 Gastos por   │           │
│          │  │    Despesa      │ │    Categoria     │           │
│          │  │                 │ │                  │           │
│          │  │  ██             │ │    ╭───╮         │           │
│          │  │  ██  ██        │ │   ╱ 38% ╲        │           │
│          │  │  ██  ██  ██   │ │  │Aliment│        │           │
│          │  │  ██  ██  ██   │ │   ╲ 22% ╱        │           │
│          │  │  Mar Abr Mai  │ │    ╰───╯         │           │
│          │  │               │ │  🟪🩵🩷🟨       │           │
│          │  └────────────────┘ └─────────────────┘           │
│          │                                                     │
│          │  ┌─────────────────┐ ┌─────────────────┐           │
│          │  │ 📋 Últimas      │ │ 🎯 Metas        │           │
│          │  │    Transações   │ │    Ativas        │           │
│          │  │                 │ │                  │           │
│          │  │ 🍽️ Almoço  -12 │ │ ✈️ Viagem Macaé  │           │
│          │  │ 🚌 Uber    -18 │ │ ▓▓▓▓▓▓░░░ 67%   │           │
│          │  │ 💵 Salário+1500│ │                  │           │
│          │  │ 🛒 Mercado -47 │ │ 💻 Notebook      │           │
│          │  │ 🎮 Steam  -120 │ │ ▓▓▓░░░░░░ 30%   │           │
│          │  │                 │ │                  │           │
│          │  │ Ver todas →     │ │ Ver todas →      │           │
│          │  └────────────────┘ └─────────────────┘           │
│          │                                                     │
│          │  ┌─────── SAÚDE FINANCEIRA ────────┐               │
│          │  │                                   │               │
│          │  │         ❤️ 78/100                 │               │
│          │  │     ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░          │               │
│          │  │         "Bom"                     │               │
│          │  │  Dica: Reduza delivery em 15%     │               │
│          │  │                                   │               │
│          │  └───────────────────────────────────┘               │
│          │                                                     │
│          │                                    💬 Chatbot →     │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

→ AlertsBanner no topo: fundo warning/10, borda warning, ícone ⚠️
→ Cards de recurso: cada um com sua cor (roxo, verde, laranja, azul)
→ Mini progress bar dentro de cada card de recurso
→ Card de saldo total: destaque, tamanho maior
→ Gráficos lado a lado (2 colunas desktop, 1 coluna mobile)
→ Últimas transações: lista compacta, ícone + descrição + valor
→ Metas: barra de progresso com percentual
→ Score de saúde: barra grande com cor dinâmica

---

## 💳 Transações

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  Transações                    [+ Nova Transação]   │
│          │                                                     │
│          │  FILTROS                                            │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 📅 Período    📂 Categoria   💰 Tipo         │  │
│          │  │ [Abril 2026]  [Todas ▾]     [Todos ▾]       │  │
│          │  │                                              │  │
│          │  │ 💳 Recurso    🔍 Buscar                      │  │
│          │  │ [Todos ▾]     [Pesquisar descrição ou tag...] │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  RESUMO DO PERÍODO                                  │
│          │  ┌────────────┐ ┌────────────┐ ┌────────────┐     │
│          │  │ 💚 Receitas│ │ ❤️ Despesas│ │ 💜 Saldo   │     │
│          │  │ R$ 2.770   │ │ R$ 1.843   │ │ R$ 927     │     │
│          │  └────────────┘ └────────────┘ └────────────┘     │
│          │                                                     │
│          │  LISTA DE TRANSAÇÕES                                │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 📅 22/04/2026                                │  │
│          │  │                                              │  │
│          │  │ 🍽️ Almoço no RU          -R$ 3,50    [VR]   │  │
│          │  │    Alimentação                        ✏️ 🗑️  │  │
│          │  │                                              │  │
│          │  │ 🚌 Passagem ônibus       -R$ 4,80    [VT]   │  │
│          │  │    Transporte                         ✏️ 🗑️  │  │
│          │  ├──────────────────────────────────────────────┤  │
│          │  │ 📅 21/04/2026                                │  │
│          │  │                                              │  │
│          │  │ 🛒 Mercado Extra         -R$ 87,00   [VA]   │  │
│          │  │    Alimentação                        ✏️ 🗑️  │  │
│          │  │                                              │  │
│          │  │ 🎮 Steam - jogo          -R$ 120,00  [💵]   │  │
│          │  │    Lazer                              ✏️ 🗑️  │  │
│          │  │                                              │  │
│          │  │ 💵 Salário              +R$ 1.500,00 [💵]   │  │
│          │  │    Salário                    🔄 mensal      │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  ◀ 1  2  3  4  5 ▶                                 │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

### Modal — Nova Transação

┌──────────────────────────────────────┐
│  Nova Transação                   ✕  │
├──────────────────────────────────────┤
│                                      │
│  TIPO                                │
│  ┌──────────┐ ┌──────────┐          │
│  │ 💚 Receita│ │ ❤️ Despesa│          │
│  └──────────┘ └──────────┘          │
│                                      │
│  💰 Valor                            │
│  ┌────────────────────────────┐     │
│  │ R$ 0,00                    │     │
│  └────────────────────────────┘     │
│                                      │
│  📅 Data                             │
│  ┌────────────────────────────┐     │
│  │ 22/04/2026            📅   │     │
│  └────────────────────────────┘     │
│                                      │
│  📝 Descrição                        │
│  ┌────────────────────────────┐     │
│  │ Ex: Almoço no RU           │     │
│  └────────────────────────────┘     │
│                                      │
│  📂 Categoria                        │
│  ┌────────────────────────────┐     │
│  │ Alimentação            ▾   │     │
│  └────────────────────────────┘     │
│                                      │
│  💳 Recurso de origem                │
│  ┌────────────────────────────┐     │
│  │ Vale Refeição (VR)     ▾   │     │
│  └────────────────────────────┘     │
│                                      │
│  🏷️ Tags (opcional)                  │
│  ┌────────────────────────────┐     │
│  │ faculdade, almoço          │     │
│  └────────────────────────────┘     │
│                                      │
│  🔄 Transação recorrente             │
│  [ ] Repetir automaticamente         │
│      Frequência: [Mensal ▾]          │
│                                      │
│  ┌────────────────────────────┐     │
│  │      💜 SALVAR              │     │
│  └────────────────────────────┘     │
└──────────────────────────────────────┘

---

## 🎯 Metas

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  Metas Financeiras                  [+ Nova Meta]   │
│          │                                                     │
│          │  FILTRO: [Todas ▾] [Ativas] [Pausadas] [Concluídas]│
│          │                                                     │
│          │  ┌─────────────────────────────────────────────┐   │
│          │  │ ✈️ Viagem para Macaé                        │   │
│          │  │ Curto prazo · Vence em 15/07/2026           │   │
│          │  │                                             │   │
│          │  │ R$ 1.407,00 de R$ 2.100,00                  │   │
│          │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░ 67%                 │   │
│          │  │                                             │   │
│          │  │ 💡 Guarde R$ 231,00/mês para atingir        │   │
│          │  │                                             │   │
│          │  │ [+ Aporte]  [⏸️ Pausar]  [✏️]  [🗑️]        │   │
│          │  └─────────────────────────────────────────────┘   │
│          │                                                     │
│          │  ┌─────────────────────────────────────────────┐   │
│          │  │ 🎓 Curso de Inglês              ✅ CONCLUÍDA│   │
│          │  │ R$ 800,00 de R$ 800,00                      │   │
│          │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% 🎉             │   │
│          │  └─────────────────────────────────────────────┘   │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

---

## 🌍 Viagens e Moedas

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  Viagens e Moedas                  [+ Nova Viagem]  │
│          │                                                     │
│          │  CONVERSOR RÁPIDO                                   │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 💱 R$ [1.000,00]  →  [USD ▾]  =  $ 178,57  │  │
│          │  │    Cotação: 1 USD = R$ 5,60 (14:22 hoje)    │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  MOEDAS FAVORITAS ⭐                                │
│          │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│          │  │🇺🇸 USD  │ │🇪🇺 EUR  │ │🇦🇷 ARS  │ │🇬🇧 GBP  │     │
│          │  │R$ 5,60  │ │R$ 6,12  │ │R$ 0,005│ │R$ 7,23  │     │
│          │  │ ▲ 0,3%  │ │ ▼ 0,1%  │ │ ▲ 1,2% │ │ ▼ 0,5%  │     │
│          │  └────────┘ └────────┘ └────────┘ └────────┘     │
│          │                                                     │
│          │  MINHAS VIAGENS                                     │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 🌍 Viagem: Macaé - RJ                       │  │
│          │  │ 📅 Julho/2026 · 💱 BRL                      │  │
│          │  │ 📋 Pretensões                                │  │
│          │  │ 🚗 Transporte         R$ 500,00             │  │
│          │  │ 🏨 Hospedagem         R$ 700,00             │  │
│          │  │ 🍽️ Alimentação        R$ 400,00             │  │
│          │  │ ─────────────────────────────                │  │
│          │  │ 💰 TOTAL:             R$ 2.100,00           │  │
│          │  │ 🎯 Meta vinculada:    Viagem Macaé (67% ✓)  │  │
│          │  │ [+ Pretensão]  [✏️]  [🗑️]                   │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  📈 HISTÓRICO DE COTAÇÃO                            │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ [USD ▾]   [7d] [30d] [90d]                  │  │
│          │  │      ╱╲                                      │  │
│          │  │  ___╱  ╲___╱╲____                            │  │
│          │  │                   ╲___                        │  │
│          │  └──────────────────────────────────────────────┘  │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

---

## 🤖 Insights

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  Insights Inteligentes                   [🔄 Gerar] │
│          │                                                     │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 🤖 Resumo de Abril/2026                     │  │
│          │  │ "Neste mês você gastou R$ 1.843 no total.   │  │
│          │  │  Sua maior categoria foi Alimentação com    │  │
│          │  │  R$ 423 (38% do total), um aumento de 12%   │  │
│          │  │  em relação a Março."                        │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  ┌──────────────────────┐ ┌──────────────────────┐ │
│          │  │ 📊 Categorias vs     │ │ ❤️ Saúde Financeira  │ │
│          │  │    Mês Anterior      │ │      78/100          │ │
│          │  │ 🍽️ Aliment. ▲ +12%  │ │  ▓▓▓▓▓▓▓▓▓▓░░░░░   │ │
│          │  │ 🚌 Transp.  ▼ -5%   │ │      "Bom"          │ │
│          │  │ 🎮 Lazer    ▼ -25%  │ │ ✅ Registra gastos   │ │
│          │  └──────────────────────┘ └──────────────────────┘ │
│          │                                                     │
│          │  💡 SUGESTÕES                                       │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 1. Reduza delivery em 15% — economia ~R$63  │  │
│          │  │ 2. Almoce no RU (R$3,50 vs R$18 média)      │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  ⚠️ ALERTAS PREDITIVOS                              │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 🟡 No ritmo atual, seu VA acaba dia 26      │  │
│          │  │ 🔴 Gastos com lazer 40% acima do mês passado│  │
│          │  └──────────────────────────────────────────────┘  │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

---

## 📅 Lembretes

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  Lembretes                        [+ Novo Lembrete] │
│          │                                                     │
│          │  GOOGLE CALENDAR                                    │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 📅 Google Agenda: 🟢 Conectado               │  │
│          │  │    joao@gmail.com          [Desconectar]     │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  PRÓXIMOS LEMBRETES                                 │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ ⚡ Fatura cartão     25/04  📅 Sincronizado  │  │
│          │  │    R$ 450,00                          ✏️ 🗑️  │  │
│          │  ├──────────────────────────────────────────────┤  │
│          │  │ 💡 Conta de luz      30/04  📅 Sincronizado  │  │
│          │  │    R$ 85,00                           ✏️ 🗑️  │  │
│          │  ├──────────────────────────────────────────────┤  │
│          │  │ 🏠 Aluguel           05/05  ⏳ Pendente      │  │
│          │  │    R$ 600,00                          ✏️ 🗑️  │  │
│          │  └──────────────────────────────────────────────┘  │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

---

## 🚌 Vale Transporte

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  Vale Transporte — Abril/2026                       │
│          │                                                     │
│          │  SALDO                                              │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 💳 Recebido:    R$ 220,00                   │  │
│          │  │ 🚌 Usado:       R$ 48,00  (10 passagens)    │  │
│          │  │ 💸 Vendido:     R$ 120,00 (nominal)         │  │
│          │  │ 💰 Saldo:       R$ 52,00                    │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  PRÓXIMA VENDA                                      │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ ⏳ Disponível em 12 dias                     │  │
│          │  │ ████████████░░░░░░░░░  60%                  │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  AÇÕES       [+ Registrar Uso] [+ Registrar Venda] │
│          │                                                     │
│          │  HISTÓRICO DE VENDAS                                │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │  Data  │ Comprador│ Nominal│ Recebido│ Diff  │  │
│          │  │ 05/04  │ João     │ R$60   │ R$50   │ -R$10 │  │
│          │  │ 05/03  │ Maria    │ R$60   │ R$55   │ -R$ 5 │  │
│          │  │ TOTAL  │          │ R$200  │ R$175  │ -R$25 │  │
│          │  └──────────────────────────────────────────────┘  │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

---

## 📈 Relatórios

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  Relatórios            📅 [Abril/2026 ▾]           │
│          │                                                     │
│          │  RESUMO MENSAL                                      │
│          │  ┌────────────┐ ┌────────────┐ ┌────────────┐     │
│          │  │ 💚 Receitas│ │ ❤️ Despesas│ │ 💜 Saldo   │     │
│          │  │ R$ 2.770   │ │ R$ 1.843   │ │ R$ 927     │     │
│          │  └────────────┘ └────────────┘ └────────────┘     │
│          │                                                     │
│          │  ┌─────────────────────┐ ┌─────────────────────┐  │
│          │  │ 🥧 Gastos por       │ │ 📊 Comparativo      │  │
│          │  │    Categoria        │ │    Mensal           │  │
│          │  │    ╭──────╮         │ │  ██ ██ ██ ██        │  │
│          │  │   ╱ 38%   ╲        │ │  Jan Fev Mar Abr    │  │
│          │  │  │Alimenta│        │ │  💚 Receitas        │  │
│          │  │   ╲ 22%  ╱         │ │  ❤️ Despesas        │  │
│          │  │    ╰──────╯        │ │                     │  │
│          │  └─────────────────────┘ └─────────────────────┘  │
│          │                                                     │
│          │  📈 EVOLUÇÃO DO SALDO                               │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │              ╱╲      ___╱╲                   │  │
│          │  │  ___________╱  ╲____╱     ╲___               │  │
│          │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓             │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  EXPORTAR                                           │
│          │  ┌──────────────┐  ┌──────────────┐               │
│          │  │ 📄 PDF       │  │ 📊 CSV       │               │
│          │  └──────────────┘  └──────────────┘               │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

---

## 👤 Perfil e Configurações

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  Meu Perfil                                         │
│          │                                                     │
│          │  DADOS PESSOAIS                                     │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │  ┌────┐  João Silva                          │  │
│          │  │  │ 👤 │  joao@email.com                      │  │
│          │  │  └────┘  Membro desde Março/2026              │  │
│          │  │  [✏️ Editar perfil]  [🔒 Alterar senha]      │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  RECEITAS FIXAS MENSAIS                             │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │  💵 Salário    R$ [1.500,00]  Dia [5  ]     │  │
│          │  │  🍎 VA         R$ [450,00  ]  Dia [5  ]     │  │
│          │  │  🍽️ VR         R$ [600,00  ]  Dia [5  ]     │  │
│          │  │  🚌 VT         R$ [220,00  ]  Dia [5  ]     │  │
│          │  │  [💜 Salvar configurações]                   │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  PREFERÊNCIAS                                       │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │  🌙 Tema escuro              [  ○━━━]  ON   │  │
│          │  │  🎮 Gamificação              [  ○━━━]  ON   │  │
│          │  │  🚌 Intervalo venda VT       [30 ▾] dias    │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  🎮 GAMIFICAÇÃO                                     │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 🔥 Streak: 12 dias                           │  │
│          │  │ 📊 Nível: Consciente (450 XP)                │  │
│          │  │ ▓▓▓▓▓▓▓▓▓░░░░░░ 450/1000 XP                 │  │
│          │  │                                              │  │
│          │  │ 🏆 Conquistas: 5 de 12                       │  │
│          │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐         │  │
│          │  │ │ 🌟 │ │ 🔥 │ │ 💰 │ │ ✈️ │ │ 🎯 │         │  │
│          │  │ └────┘ └────┘ └────┘ └────┘ └────┘         │  │
│          │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐                │  │
│          │  │ │ 🔒 │ │ 🔒 │ │ 🔒 │ │ 🔒 │                │  │
│          │  │ └────┘ └────┘ └────┘ └────┘                │  │
│          │  │                                              │  │
│          │  │ 🎯 Desafio: "Gaste 10% menos em delivery"   │  │
│          │  │ ▓▓▓▓▓▓▓▓░░░░░░░░ 52%                        │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  ZONA DE PERIGO                                     │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 🗑️ Excluir minha conta e todos os dados      │  │
│          │  │ [🔴 Excluir conta]                           │  │
│          │  └──────────────────────────────────────────────┘  │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

---

## 👥 Grupos

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  Meus Grupos                        [+ Novo Grupo]  │
│          │                                                     │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 👥 Viagem Macaé 2026                        │  │
│          │  │ 👑 João (você)  👤 Maria  👤 Pedro          │  │
│          │  │ 📋 Código: PULSO-X7K2     [📋 Copiar]      │  │
│          │  │                                              │  │
│          │  │ [Ver grupo →]                                │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 👥 Finanças do Casal                        │  │
│          │  │ 👑 João (você)  👤 Ana                      │  │
│          │  │ 📋 Código: PULSO-M3R1     [📋 Copiar]      │  │
│          │  │                                              │  │
│          │  │ [Ver grupo →]                                │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  ENTRAR EM UM GRUPO                                 │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 🔗 Cole o código de convite:                 │  │
│          │  │ ┌────────────────────────┐                  │  │
│          │  │ │ PULSO-XXXX             │  [Entrar]        │  │
│          │  │ └────────────────────────┘                  │  │
│          │  └──────────────────────────────────────────────┘  │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

### Detalhe do Grupo

┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
├──────────┬─────────────────────────────────────────────────────┤
│ SIDEBAR  │                                                     │
│          │  ← Voltar    👥 Viagem Macaé 2026                   │
│          │                                                     │
│          │  MEMBROS                                            │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 👑 João (admin)  👤 Maria  👤 Pedro         │  │
│          │  │ 📋 Código: PULSO-X7K2                       │  │
│          │  │ [👤 Convidar]  [⚙️ Gerenciar membros]       │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  🌍 VIAGEM DO GRUPO: Macaé - RJ                    │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 📋 Pretensões por membro                    │  │
│          │  │                                              │  │
│          │  │ 👤 João                                      │  │
│          │  │ 🚗 Transporte    R$ 200  (vai dirigir)      │  │
│          │  │ 🏨 Hospedagem    R$ 250  (1/3 airbnb)       │  │
│          │  │                                              │  │
│          │  │ 👤 Maria                                     │  │
│          │  │ 🏨 Hospedagem    R$ 250  (1/3 airbnb)       │  │
│          │  │ 🍽️ Alimentação   R$ 300                     │  │
│          │  │                                              │  │
│          │  │ 👤 Pedro                                     │  │
│          │  │ 🏨 Hospedagem    R$ 250  (1/3 airbnb)       │  │
│          │  │ 🎡 Passeios      R$ 400  (ingressos)        │  │
│          │  │ ─────────────────────────────                │  │
│          │  │ 💰 TOTAL DO GRUPO:    R$ 1.650,00           │  │
│          │  │ 👤 João deve:         R$ 450,00             │  │
│          │  │ 👤 Maria deve:        R$ 550,00             │  │
│          │  │ 👤 Pedro deve:        R$ 650,00             │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  🎯 META DO GRUPO                                   │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ Juntar R$ 1.650,00                           │  │
│          │  │ ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░ 62%                     │  │
│          │  │ João: R$300 ✓  Maria: R$320 ✓  Pedro: R$400 │  │
│          │  │ [+ Fazer aporte]                             │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  [🚪 Sair do grupo]                                 │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

→ Lista de grupos na tela principal
→ Card por grupo com membros e código
→ Campo para entrar em grupo via código
→ Detalhe do grupo: membros, viagem compartilhada, meta do grupo
→ Pretensões separadas por membro
→ Total por membro calculado automaticamente
→ Meta do grupo com aporte individual de cada membro
→ Admin pode gerenciar membros (remover)
→ Qualquer membro pode sair
→ Dados pessoais NUNCA aparecem no grupo

---

## 💬 Chatbot

→ Flutuante no canto inferior direito de TODAS as páginas
→ Botão circular roxo com ícone 💬
→ Ao clicar, expande a janela de chat

BOTÃO (fechado):

                                        ┌────┐
                                        │ 💬 │
                                        └────┘

JANELA (aberta):

                          ┌──────────────────────────────┐
                          │ 🤖 Pulso Assistente    ─  ✕  │
                          ├──────────────────────────────┤
                          │                              │
                          │  🧑 "Quanto gastei dia 15?"  │
                          │                              │
                          │  🤖 No dia 15/04 você        │
                          │  registrou 3 gastos:         │
                          │  • 🍽️ Almoço — R$ 3,50 (VR) │
                          │  • 🚌 Passagem — R$ 4,80(VT)│
                          │  • 🛒 Mercado — R$ 47 (VA)  │
                          │  Total: R$ 55,30             │
                          │                              │
                          │  🧑 "Meu VA vai durar?"     │
                          │                              │
                          │  🤖 No ritmo atual, seu VA   │
                          │  acaba por volta do dia 26.  │
                          │  Sugiro reduzir ~R$8/dia     │
                          │  pra fechar o mês! 💡        │
                          │                              │
                          ├──────────────────────────────┤
                          │ Pergunte ao Pulso... [Enviar]│
                          └──────────────────────────────┘

→ Janela com max-height: 500px, max-width: 380px
→ Mensagens do usuário: alinhadas à direita, fundo primary/10, texto primary
→ Mensagens do bot: alinhadas à esquerda, fundo surface, texto text-primary
→ Header com nome, botão minimizar (─) e fechar (✕)
→ Input no rodapé com botão enviar
→ Enter para enviar
→ Animação de digitando... enquanto espera resposta da Gemini
→ Scroll automático para última mensagem

---

## 🧩 Componentes Reutilizáveis

### Badge de Recurso

[💵 Salário]  → fundo roxo/10, texto roxo, borda roxo/20
[🍎 VA]       → fundo verde/10, texto verde, borda verde/20
[🍽️ VR]       → fundo laranja/10, texto laranja, borda laranja/20
[🚌 VT]       → fundo azul/10, texto azul, borda azul/20

### Badge de Status (Meta)

[🟢 Ativa]    → fundo success/10, texto success
[🟡 Pausada]  → fundo warning/10, texto warning
[✅ Concluída] → fundo primary/10, texto primary
[🔴 Cancelada] → fundo danger/10, texto danger

### Card Padrão

┌────────────────────────┐
│ Título           ícone │  → header do card
│ ────────────────────── │  → divisor
│ Conteúdo               │  → body do card
│ ────────────────────── │  → divisor
│ Ações            link→ │  → footer do card
└────────────────────────┘

→ bg: surface | border: border | radius: xl | shadow: sm
→ Hover: shadow-md (sutil)

### Barra de Progresso

Em andamento: ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░ 67%  → cor: primary
Concluída:    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% → cor: success

Score (dinâmico):
0-30:   ▓▓▓░░░░░░░░░░░░░░ → danger
31-50:  ▓▓▓▓▓▓░░░░░░░░░░░ → warning
51-70:  ▓▓▓▓▓▓▓▓▓░░░░░░░░ → info
71-90:  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░ → success
91-100: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ → primary

### Toast Notification

Sucesso: fundo success/10, ícone ✅, borda success
Erro:    fundo danger/10, ícone ❌, borda danger
Info:    fundo info/10, ícone ℹ️, borda info
Warning: fundo warning/10, ícone ⚠️, borda warning

→ Posição: topo direito
→ Duração: 4 segundos
→ Animação: slide-in da direita

---

## 📱 Responsividade

### Desktop (1920px — 1024px)

→ Sidebar expandida (240px)
→ Conteúdo em grid de 2-3 colunas
→ Gráficos lado a lado
→ Chatbot no canto inferior direito

### Tablet (1024px — 768px)

→ Sidebar colapsada (64px, só ícones)
→ Conteúdo em grid de 2 colunas
→ Gráficos empilhados quando necessário
→ Chatbot mantém posição

### Mobile (768px — 360px)

→ Sidebar oculta (abre com botão hamburger ☰)
→ Overlay escuro ao abrir sidebar
→ Conteúdo em 1 coluna
→ Cards de recurso: 2x2 grid ou scroll horizontal
→ Gráficos: largura total, um abaixo do outro
→ Tabelas: scroll horizontal
→ Chatbot: tela cheia ao expandir
→ Header simplificado (logo + hamburger + avatar)

Mobile — Header:
┌────────────────────────────────┐
│ ☰  💜 pulso.        👤 🌙    │
└────────────────────────────────┘

Mobile — Sidebar (overlay):
┌──────────────┬─────────────────┐
│              │░░░░░░░░░░░░░░░░░│
│  💜 pulso.   │░░ OVERLAY ░░░░░░│
│              │░░ (fecha ao ░░░░│
│  📊 Dash     │░░  clicar)  ░░░░│
│  💳 Trans    │░░░░░░░░░░░░░░░░░│
│  🎯 Metas    │░░░░░░░░░░░░░░░░░│
│  🌍 Viag.    │░░░░░░░░░░░░░░░░░│
│  🤖 Insig    │░░░░░░░░░░░░░░░░░│
│  📅 Lemb.    │░░░░░░░░░░░░░░░░░│
│  🚌 VT       │░░░░░░░░░░░░░░░░░│
│  📈 Relat    │░░░░░░░░░░░░░░░░░│
│  👥 Grupos   │░░░░░░░░░░░░░░░░░│
│              │░░░░░░░░░░░░░░░░░│
│  👤 Perfil   │░░░░░░░░░░░░░░░░░│
│  🚪 Sair     │░░░░░░░░░░░░░░░░░│
└──────────────┴─────────────────┘

---

## 🎯 Diretrizes Visuais Gerais

- **Fonte principal:** Inter (Google Fonts)
- **Fonte mono:** JetBrains Mono (valores monetários)
- **Border radius:** xl (12px) para cards, lg (8px) para inputs e botões
- **Shadows:** sm para cards em repouso, md para hover
- **Animações:** transições suaves de 200ms (hover, toggle, abertura de modal)
- **Espaçamento:** múltiplos de 4px (Tailwind padrão)
- **Ícones:** Lucide React em todo o sistema
- **Gráficos:** Recharts com cores da paleta Vital Purple
- **Paleta:** Vital Purple (ver README de Requisitos)
- **Acessibilidade:** contraste WCAG 2.1 AA, focus visible, aria-labels

---

## 🗺️ Mapeamento Completo de Telas

### 🔓 Públicas (sem autenticação) — 6 telas

| # | Tela | Rota | Tipo | Layout |
|---|---|---|---|---|
| 01 | Homepage | `/` | Landing Page | Próprio |
| 02 | Login | `/login` | Formulário | AuthLayout |
| 03 | Cadastro | `/register` | Formulário | AuthLayout |
| 04 | Esqueci a Senha | `/forgot-password` | Formulário | AuthLayout |
| 05 | Redefinir Senha | `/reset-password/:token` | Formulário | AuthLayout |
| 06 | Verificar Email | `/verify-email/:token` | Confirmação | AuthLayout |

### 🔒 Privadas (autenticadas) — 14 telas

| # | Tela | Rota | Tipo | CRUD? |
|---|---|---|---|---|
| 07 | Dashboard | `/dashboard` | Visualização | ❌ |
| 08 | Transações | `/transactions` | Lista + Filtros | ✅ CRUD |
| 09 | Metas | `/goals` | Lista + Cards | ✅ CRUD |
| 10 | Viagens | `/trips` | Lista + Cards | ✅ CRUD |
| 11 | Detalhe da Viagem | `/trips/:id` | Detalhe + Sub-CRUD | ✅ CRUD |
| 12 | Insights | `/insights` | Visualização IA | ❌ |
| 13 | Lembretes | `/reminders` | Lista | ✅ CRUD |
| 14 | Vale Transporte | `/transport` | Dashboard + Lista | Parcial |
| 15 | Relatórios | `/reports` | Visualização + Export | ❌ |
| 16 | Perfil | `/profile` | Formulário + Config | Parcial |
| 17 | Grupos | `/groups` | Lista | ✅ CRUD |
| 18 | Detalhe do Grupo | `/groups/:id` | Detalhe + Sub-CRUD | ✅ CRUD |
| 19 | Gamificação | `/achievements` | Visualização | ❌ |
| 20 | 404 | `*` | Erro | ❌ |

### 📦 Modais — 13

| # | Modal | Onde abre | Tipo |
|---|---|---|---|
| M1 | Nova/Editar Transação | Tela 08 (Transações) | Create/Edit |
| M2 | Nova/Editar Meta | Tela 09 (Metas) | Create/Edit |
| M3 | Aporte na Meta | Tela 09 (Metas) | Create |
| M4 | Nova/Editar Viagem | Tela 10 (Viagens) | Create/Edit |
| M5 | Nova Pretensão | Tela 11 (Detalhe Viagem) | Create/Edit |
| M6 | Novo/Editar Lembrete | Tela 13 (Lembretes) | Create/Edit |
| M7 | Registrar Venda VT | Tela 14 (VT) | Create |
| M8 | Registrar Uso VT | Tela 14 (VT) | Create |
| M9 | Novo Grupo | Tela 17 (Grupos) | Create |
| M10 | Entrar no Grupo | Tela 17 (Grupos) | Action |
| M11 | Convidar pro Grupo | Tela 18 (Detalhe Grupo) | Action |
| M12 | Editar Perfil | Tela 16 (Perfil) | Edit |
| M13 | Alterar Senha | Tela 16 (Perfil) | Edit |

### 💬 Componentes Flutuantes

| # | Componente | Onde aparece |
|---|---|---|
| F1 | Chatbot | Todas as telas privadas (canto inferior direito) |

### 📊 Contagem Final

| Categoria | Quantidade |
|---|---|
| 🔓 Telas Públicas | 6 |
| 🔒 Telas Privadas | 14 |
| 📦 Modais | 13 |
| 💬 Flutuantes | 1 |
| **TOTAL DE INTERFACES** | **34** |

**CRUDs completos (6):** Transações, Metas, Viagens (+ Pretensões), Lembretes, Grupos (+ Membros), VT (create vendas/uso + read)

**Visualizações sem CRUD (5):** Dashboard, Insights, Relatórios, Gamificação, Homepage

**Formulários auth (4):** Login, Cadastro, Esqueci a Senha, Redefinir Senha

**Configuração (1):** Perfil + Settings