# 🎨 Pulso — Ideias de Protótipos

Documento com wireframes conceituais e ideias visuais para cada tela do sistema **Pulso**. Serve como guia para a construção das interfaces.

---

## 🗂️ Índice

- [Layout Base](#-layout-base)
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
- [Chatbot](#-chatbot)
- [Componentes Reutilizáveis](#-componentes-reutilizáveis)
- [Responsividade](#-responsividade)

---

## 📐 Layout Base

### AuthLayout (Login, Cadastro, Recuperação)

┌──────────────────────────────────────────────────────────────┐
│                                                              │
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
│ 💳 Trans │  │                                             │   │
│ 🎯 Metas │  │                                             │   │
│ 🌍 Viag. │  │           [ CONTEÚDO DA PÁGINA ]            │   │
│ 🤖 Insig │  │                                             │   │
│ 📅 Lemb. │  │                                             │   │
│ 🚌 VT    │  │                                             │   │
│ 📈 Relat │  │                                             │   │
│          │  └─────────────────────────────────────────────┘   │
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

┌──────────┐
│          │
│ 📊 Dash  │  ← ativo: fundo primary-light, texto primary
│ 💳 Trans │  ← inativo: texto text-secondary
│ 🎯 Metas │
│ 🌍 Viag. │
│ 🤖 Insig │
│ 📅 Lemb. │
│ 🚌 VT    │
│ 📈 Relat │
│          │
│ ──────── │  ← divisor
│          │
│ 👤 Perfil│
│ 🚪 Sair  │
│          │
│    « ◁   │  ← botão colapsar (fica só ícones)
└──────────┘

→ Largura expandida: 240px
→ Largura colapsada: 64px (só ícones)
→ Item ativo: bg primary/10, borda esquerda primary, texto primary
→ Hover: bg surface
→ Ícones: Lucide React

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
│          │                                                     │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

→ Botão "+ Nova Transação": abre modal
→ Badge de recurso: cor correspondente (VR laranja, VT azul, VA verde, 💵 roxo)
→ Receitas em verde, despesas em vermelho
→ Badge 🔄 para transações recorrentes
→ Ícones de editar e excluir à direita de cada item
→ Agrupamento por data
→ Paginação no rodapé da lista

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
│                                      │
└──────────────────────────────────────┘

→ Toggle receita/despesa: muda cor do formulário inteiro
→ Select de recurso: mostra saldo disponível ao lado de cada opção
→ Se despesa de alimentação + VT selecionado: erro inline vermelho
→ Checkbox recorrente: expande campo de frequência

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
│          │  │ 💡 Guarde R$ 231,00/mês para atingir no prazo│   │
│          │  │                                             │   │
│          │  │ [+ Aporte]  [⏸️ Pausar]  [✏️]  [🗑️]        │   │
│          │  └─────────────────────────────────────────────┘   │
│          │                                                     │
│          │  ┌─────────────────────────────────────────────┐   │
│          │  │ 💻 Notebook Novo                            │   │
│          │  │ Longo prazo · Vence em 20/12/2026           │   │
│          │  │                                             │   │
│          │  │ R$ 900,00 de R$ 3.000,00                    │   │
│          │  │ ▓▓▓▓▓▓░░░░░░░░░░░░░░░ 30%                  │   │
│          │  │                                             │   │
│          │  │ 💡 Guarde R$ 262,50/mês para atingir no prazo│   │
│          │  │                                             │   │
│          │  │ [+ Aporte]  [⏸️ Pausar]  [✏️]  [🗑️]        │   │
│          │  └─────────────────────────────────────────────┘   │
│          │                                                     │
│          │  ┌─────────────────────────────────────────────┐   │
│          │  │ 🎓 Curso de Inglês              ✅ CONCLUÍDA│   │
│          │  │ Curto prazo · Concluída em 10/03/2026       │   │
│          │  │                                             │   │
│          │  │ R$ 800,00 de R$ 800,00                      │   │
│          │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% 🎉             │   │
│          │  └─────────────────────────────────────────────┘   │
│          │                                                     │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

→ Cards de meta: borda esquerda com cor do status (primary=ativa, warning=pausada, success=concluída)
→ Dica de economia calculada automaticamente
→ Barra de progresso: primary (andamento), success (concluída)
→ Badge "CONCLUÍDA" com confete 🎉 na barra 100%
→ Botão "+ Aporte": abre mini modal com campo de valor

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
│          │  │                                              │  │
│          │  │ 📋 Pretensões                                │  │
│          │  │ 🚗 Transporte         R$ 500,00             │  │
│          │  │ 🏨 Hospedagem         R$ 700,00             │  │
│          │  │ 🍽️ Alimentação        R$ 400,00             │  │
│          │  │ 🎡 Passeios           R$ 300,00             │  │
│          │  │ 🛍️ Compras            R$ 200,00             │  │
│          │  │ ─────────────────────────────                │  │
│          │  │ 💰 TOTAL:             R$ 2.100,00           │  │
│          │  │ 🎯 Meta vinculada:    Viagem Macaé (67% ✓)  │  │
│          │  │                                              │  │
│          │  │ [+ Pretensão]  [✏️]  [🗑️]                   │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 🌍 Viagem: Buenos Aires - ARG               │  │
│          │  │ 📅 Dezembro/2026 · 💱 ARS                   │  │
│          │  │                                              │  │
│          │  │ 📋 Pretensões (em ARS)                      │  │
│          │  │ ✈️ Passagem            ARS 80.000            │  │
│          │  │ 🏨 Hospedagem         ARS 50.000            │  │
│          │  │ 🍽️ Alimentação        ARS 40.000            │  │
│          │  │ ─────────────────────────────                │  │
│          │  │ 💰 TOTAL ARS:         ARS 170.000           │  │
│          │  │ 💰 TOTAL BRL:         R$ 935,00             │  │
│          │  │ 🎯 Meta vinculada:    Nenhuma [+ Vincular]  │  │
│          │  │                                              │  │
│          │  │ [+ Pretensão]  [✏️]  [🗑️]                   │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  📈 HISTÓRICO DE COTAÇÃO                            │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ [USD ▾]   [7d] [30d] [90d]                  │  │
│          │  │                                              │  │
│          │  │      ╱╲                                      │  │
│          │  │  ___╱  ╲___╱╲____                            │  │
│          │  │                   ╲___                        │  │
│          │  │                                              │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

→ Conversor rápido sempre visível no topo
→ Cards de moeda favorita com variação diária (verde ▲ / vermelho ▼)
→ Cards de viagem expandíveis com lista de pretensões
→ Total calculado automaticamente
→ Conversão BRL em tempo real para viagens internacionais
→ Gráfico de histórico com seletor de período

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
│          │  │                                              │  │
│          │  │ "Neste mês você gastou R$ 1.843 no total.   │  │
│          │  │  Sua maior categoria foi Alimentação com    │  │
│          │  │  R$ 423 (38% do total), um aumento de 12%   │  │
│          │  │  em relação a Março. Seus gastos com Lazer  │  │
│          │  │  diminuíram 25% — ótimo progresso! Seu VA   │  │
│          │  │  está sendo bem utilizado, mas atenção:     │  │
│          │  │  no ritmo atual ele acaba dia 26."          │  │
│          │  │                                              │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  ┌──────────────────────┐ ┌──────────────────────┐ │
│          │  │ 📊 Categorias vs     │ │ ❤️ Saúde Financeira  │ │
│          │  │    Mês Anterior      │ │                      │ │
│          │  │                      │ │      78/100          │ │
│          │  │ 🍽️ Aliment. ▲ +12%  │ │  ▓▓▓▓▓▓▓▓▓▓░░░░░   │ │
│          │  │ 🚌 Transp.  ▼ -5%   │ │      "Bom"          │ │
│          │  │ 🎮 Lazer    ▼ -25%  │ │                      │ │
│          │  │ 📚 Educação ── 0%   │ │ Critérios:           │ │
│          │  │                      │ │ ✅ Registra gastos   │ │
│          │  │                      │ │ ✅ Tem metas ativas  │ │
│          │  │                      │ │ ⚠️ VA acima do ritmo │ │
│          │  │                      │ │ ✅ Streak > 7 dias   │ │
│          │  └──────────────────────┘ └──────────────────────┘ │
│          │                                                     │
│          │  💡 SUGESTÕES                                       │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 1. Reduza delivery em 15% — economia de     │  │
│          │  │    ~R$ 63/mês baseado no seu padrão          │  │
│          │  │                                              │  │
│          │  │ 2. Seu VR rende mais se almoçar no RU da    │  │
│          │  │    faculdade (R$ 3,50 vs R$ 18 em média)     │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  ⚠️ ALERTAS PREDITIVOS                              │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 🟡 No ritmo atual, seu VA acaba dia 26      │  │
│          │  │ 🔴 Gastos com lazer 40% acima do mês passado│  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

→ Resumo em card com fundo surface, texto em linguagem natural
→ Botão "Gerar" para regenerar insights sob demanda
→ Comparativo com setas coloridas (verde ▼ = gastou menos = bom)
→ Score com gauge visual e breakdown de critérios
→ Sugestões numeradas em card com fundo success/5
→ Alertas com cor por severidade (amarelo, vermelho)

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
│          │  │ ⚡ Fatura cartão          25/04/2026         │  │
│          │  │    R$ 450,00              📅 Sincronizado    │  │
│          │  │    Antecedência: 1 dia                ✏️ 🗑️  │  │
│          │  ├──────────────────────────────────────────────┤  │
│          │  │ 💡 Conta de luz           30/04/2026         │  │
│          │  │    R$ 85,00               📅 Sincronizado    │  │
│          │  │    Antecedência: 3 dias               ✏️ 🗑️  │  │
│          │  ├──────────────────────────────────────────────┤  │
│          │  │ 🏠 Aluguel                05/05/2026         │  │
│          │  │    R$ 600,00              ⏳ Pendente        │  │
│          │  │    Antecedência: 1 dia                ✏️ 🗑️  │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

→ Card do Google Calendar no topo com status de conexão
→ Lembretes ordenados por data
→ Badge: 📅 Sincronizado (verde) ou ⏳ Pendente (amarelo)
→ Ícone por tipo (raio, lâmpada, casa)

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
│          │  │ ─────────────────────────────                │  │
│          │  │ 💰 Saldo:       R$ 52,00                    │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  PRÓXIMA VENDA                                      │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ ⏳ Disponível em 12 dias                     │  │
│          │  │ ████████████░░░░░░░░░  60%                  │  │
│          │  │ Data estimada: 04/05/2026                    │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  AÇÕES          [+ Registrar Uso] [+ Registrar Venda│
│          │                                                     │
│          │  HISTÓRICO DE VENDAS                                │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │  Data   │ Comprador │ Nominal │ Recebido│Diff│  │
│          │  │─────────│──────────│─────────│────────│────│  │
│          │  │ 05/04   │ João     │ R$60    │ R$50   │-R$10│  │
│          │  │ 05/03   │ Maria    │ R$60    │ R$55   │-R$ 5│  │
│          │  │ 03/02   │ João     │ R$80    │ R$70   │-R$10│  │
│          │  │─────────│──────────│─────────│────────│────│  │
│          │  │ TOTAL   │          │ R$200   │ R$175  │-R$25│  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

→ Card de saldo com cores azuis (paleta VT)
→ Contador regressivo com barra de progresso
→ Tabela de histórico com totais acumulados
→ Diferença: verde se ganhou, vermelho se perdeu

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
│          │  │                     │ │                     │  │
│          │  │    ╭──────╮         │ │  ██                 │  │
│          │  │   ╱ 38%   ╲        │ │  ██ ██              │  │
│          │  │  │Alimenta│        │ │  ██ ██ ██           │  │
│          │  │   ╲ 22%  ╱         │ │  ██ ██ ██ ██        │  │
│          │  │    ╰──────╯        │ │  Jan Fev Mar Abr    │  │
│          │  │                     │ │                     │  │
│          │  │ 🟪 Aliment.  38%   │ │  💚 Receitas        │  │
│          │  │ 🩵 Transp.  22%   │ │  ❤️ Despesas        │  │
│          │  │ 🩷 Lazer    18%   │ │                     │  │
│          │  │ 🟨 Educação 12%   │ │                     │  │
│          │  │ 🟩 Saúde     6%   │ │                     │  │
│          │  │ 🟦 Outros    4%   │ │                     │  │
│          │  └─────────────────────┘ └─────────────────────┘  │
│          │                                                     │
│          │  📈 EVOLUÇÃO DO SALDO                               │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │                          ╱╲                  │  │
│          │  │              ╱╲      ___╱  ╲                 │  │
│          │  │  ___________╱  ╲____╱       ╲___             │  │
│          │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │  │
│          │  │ Jan    Fev    Mar    Abr                     │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  EXPORTAR                                           │
│          │  ┌──────────────┐  ┌──────────────┐               │
│          │  │ 📄 Exportar  │  │ 📊 Exportar  │               │
│          │  │    PDF       │  │    CSV       │               │
│          │  └──────────────┘  └──────────────┘               │
│          │                                                     │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

→ Seletor de mês no topo
→ Cards de resumo com cores (verde, vermelho, roxo)
→ Gráfico de pizza com legenda colorida
→ Gráfico de barras comparativo (até 6 meses)
→ Gráfico de linha com área preenchida roxo translúcido
→ Botões de exportação: PDF e CSV

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
│          │  │  ┌────┐                                      │  │
│          │  │  │ 👤 │  João Silva                          │  │
│          │  │  │foto│  joao@email.com                      │  │
│          │  │  └────┘  Membro desde Março/2026              │  │
│          │  │                                              │  │
│          │  │  [✏️ Editar perfil]  [🔒 Alterar senha]      │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  RECEITAS FIXAS MENSAIS                             │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │  💵 Salário    R$ [1.500,00]  Dia [5  ]     │  │
│          │  │  🍎 VA         R$ [450,00  ]  Dia [5  ]     │  │
│          │  │  🍽️ VR         R$ [600,00  ]  Dia [5  ]     │  │
│          │  │  🚌 VT         R$ [220,00  ]  Dia [5  ]     │  │
│          │  │                                              │  │
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
│          │  │ 🏆 Conquistas: 5 de 12 desbloqueadas         │  │
│          │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐         │  │
│          │  │ │ 🌟 │ │ 🔥 │ │ 💰 │ │ ✈️ │ │ 🎯 │         │  │
│          │  │ │7dia│ │30di│ │1ºmê│ │1ªvi│ │1ªme│         │  │
│          │  │ └────┘ └────┘ └────┘ └────┘ └────┘         │  │
│          │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐                │  │
│          │  │ │ 🔒 │ │ 🔒 │ │ 🔒 │ │ 🔒 │                │  │
│          │  │ │90di│ │Inve│ │Zero│ │Estr│                │  │
│          │  │ └────┘ └────┘ └────┘ └────┘                │  │
│          │  │                                              │  │
│          │  │ 🎯 Desafio do mês:                           │  │
│          │  │ "Gaste 10% menos em delivery"                │  │
│          │  │ ▓▓▓▓▓▓▓▓░░░░░░░░ 52%                        │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
│          │  ZONA DE PERIGO                                     │
│          │  ┌──────────────────────────────────────────────┐  │
│          │  │ 🗑️ Excluir minha conta e todos os dados      │  │
│          │  │ [🔴 Excluir conta]                           │  │
│          │  └──────────────────────────────────────────────┘  │
│          │                                                     │
├──────────┴─────────────────────────────────────────────────────┤
│ FOOTER                                                         │
└────────────────────────────────────────────────────────────────┘

→ Seções separadas por cards
→ Receitas fixas: inputs editáveis com botão salvar
→ Toggles de preferência estilo switch
→ Conquistas: grid de badges (coloridas ou cinzas se bloqueadas)
→ Desafio do mês com barra de progresso
→ Zona de perigo: fundo danger/5, borda danger, botão vermelho

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
│                        │
│ Conteúdo               │  → body do card
│                        │
│ ────────────────────── │  → divisor
│ Ações            link→ │  → footer do card
└────────────────────────┘

→ bg: surface | border: border | radius: xl | shadow: sm
→ Hover: shadow-md (sutil)

### Barra de Progresso

Em andamento:
▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░ 67%  → cor: primary (#7C3AED)

Concluída:
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% → cor: success (#10B981)

Score (dinâmico):
0-30:  ▓▓▓░░░░░░░░░░░░░░ → danger
31-50: ▓▓▓▓▓▓░░░░░░░░░░░ → warning
51-70: ▓▓▓▓▓▓▓▓▓░░░░░░░░ → info
71-90: ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░ → success
91-100:▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ → primary

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