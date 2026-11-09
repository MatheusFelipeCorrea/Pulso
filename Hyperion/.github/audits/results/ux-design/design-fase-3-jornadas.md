# Auditoria UX — Fase 3: jornadas e informação

**Produto:** Pulso  
**Locale:** pt-BR  
**Overlay:** nenhum  
**Data:** 2026-09-30  
**IDs:** `UX-3-NN`  
**Escopo desta fase:** navegação e IA web vs mobile, auth, transações, metas, viagens/moedas, empty/error/loading de tela, destinos pós-login, links mortos, alinhamento a `docs/5.wireframe.md` e `docs/prototipos/`.

---

## 1. Resumo executivo

O recorte documentado é claro: **auth → transações, metas, viagens e moedas** (`docs/5.wireframe.md:12`). A web implementa essas três áreas autenticadas com densidade próxima aos exports. O Flutter cobre as mesmas jornadas com **IA achatada**, **Grupos visíveis** (API ainda desligada) e **Início** mais útil que o Dashboard web.

A barreira mais grave é de **arquitetura de informação, não de layout**: Perfil e Configurações na sidebar/user menu apontam para rotas **inexistentes**; o catch-all manda o usuário à **landing pública**. Pós-login web cai num **Dashboard stub**. Premium: a web **esconde** Viagens; o Flutter **mostra** o item e um beco “são Premium”. Copy: **pretensão** (web/protótipo) vs **despesa** (Flutter).

Padronizar a árvore de navegação do recorte e **não oferecer destinos mortos**.

---

## 2. Escopo e contexto detectado

### Rotas autenticadas reais

| Cliente | Rotas ligadas |
|---------|----------------|
| Web `App.jsx:66-73` | `/dashboard`, `/transactions`, `/goals`, `/trips`, `/trips/:id` |
| Flutter `app_router.dart` | `/dashboard` (Início), `/transactions` (+ new/id), `/categories`, `/tags`, `/goals` (+ form), `/trips` (+ new/id/edit), `/groups` (+ new) |

Auth (ambos): login, register, verify-email, forgot/reset password, termos, privacidade, callback Google.

### IA observada

| Fonte | Itens |
|-------|--------|
| Protótipo (sidebar das PNGs) | Dashboard, Transações, Carteiras, Metas, Orçamentos, Relatórios, Planejamento, Categorias, Configurações + promo recorrência |
| Wireframe recorte | Auth, Transações, Metas, Viagens e Moedas |
| Web `sidebarNavigation.js:6-45` | Dashboard; Financeiro → Transações; Planejamento & Metas → Metas Financeiras, Viagens e Moedas; footer Perfil, Configurações, Sair. Grupos **comentados** |
| Flutter `app_shell.dart:205-234` | Transações, Início, Metas, Viagens e moedas, Grupos (lista plana) |

### Jornadas mapeadas (código, não inventadas)

1. **Auth:** login/cadastro/Google → (web) `/dashboard` ou (Flutter) `/transactions`; recuperar senha; verificar e-mail.
2. **Transações:** listar, filtrar, CRUD modal/tela, categorias/tags, excluir (+ recorrência no Flutter).
3. **Metas:** tabs status, busca, CRUD, aporte, pausar/retomar, excluir.
4. **Viagens:** conversor + favoritas + lista (web); gate Premium (Flutter UI / web nav); detalhe pretensões e observações (web completo; Flutter reduzido).

**N/A no recorte atual:** Carteiras, Orçamentos, Relatórios, Chatbot, Insights, notificações (bell comentado em `MainLayout.jsx:7-8`). Não são inconsistências a “corrigir na UI” — são **fora do recorte**.

---

## 3. Achados priorizados

### UX-3-01 — Perfil e Configurações levam à landing (beco autenticado)

- **Evidência:** `sidebarNavigation.js:41-44` (`/profile`, `/settings`). `UserMenu.jsx:76-94` (`Link to="/profile"` e `/settings`). `App.jsx:66-76` (rotas autenticadas **sem** profile/settings; `path="*"` → `Navigate to="/"`). `appRoutes.js:17-18` (títulos “em desenvolvimento” **não usados** nesses links).
- **Constatação:** Clique em Conta **desloga visualmente o contexto** (landing). Não há página placeholder.
- **Impacto:** Perda de sessão percebida, abandono, suporte. Crítico porque o controle está no chrome global.
- **Severidade:** Crítica  
- **Confiança:** Alta  
- **Recomendação:** **Canônico:** não renderizar o link até a rota existir **ou** rota autenticada “Em breve” que permanece no `MainLayout`. Nunca `*` → `/` para usuário logado (redirecionar para `/transactions`).
- **Critério de validação:** logado, clicar Perfil/Config ou URL inventada não mostra a landing; Flutter já não oferece esses itens — manter assim até existirem.

### UX-3-02 — Destino pós-login: Dashboard vazio na web vs Transações no Flutter

- **Evidência:** `defaultAuthenticatedRoute.js:1-2` (`/dashboard`, comentário RF-007). `DashboardPage.jsx:3-12` (stub, padding inline, link para transações). `Login.jsx:98` `navigate(DEFAULT_AUTHENTICATED_ROUTE)`. `app_router.dart:35,50-51` (login → `/transactions`; `/home` → `/dashboard`). `home_screen.dart:37-60` (saudação + resumo de transações + CTAs).
- **Constatação:** O primeiro ecrã web autenticado **não entrega o recorte**. Flutter acerta o núcleo. Comentário RF-007 conflita com o estado do Dashboard.
- **Impacto:** Primeira impressão “produto quebrado” na web; modelo mental diferente entre clientes.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** **Canônico até o Dashboard existir:** `/transactions` nos dois. Manter item “Dashboard”/“Início” visível com stub honesto **ou** esconder o item. Quando o resumo existir, aí sim default `/dashboard`.
- **Critério de validação:** login web e Flutter abrem a mesma jornada útil (transações).

### UX-3-03 — Árvore de navegação desalinhada (grupos, ordem, agrupamento, labels)

- **Evidência:** `sidebarNavigation.js:6-36` (grupos, Transações dentro de Financeiro, “Metas Financeiras”). `app_shell.dart:205-234` (ordem: Transações → Início → Metas → Viagens → **Grupos**). `groups_screen.dart:52-54` (aviso de API não ligada). `project.yml` uncertainties: grupos no client, rota API comentada.
- **Constatação:** Flutter expõe um módulo **fora do recorte wireframe** e **fora da web**. Labels: “Metas Financeiras” vs “Metas”; “Viagens e Moedas” vs “Viagens e moedas”; “Dashboard” vs “Início”.
- **Impacto:** Usuário multi-dispositivo não encontra o mesmo mapa. Grupos geram erro/empty técnico.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** **IA canônica do recorte:**  
  1. Início (ou Dashboard)  
  2. Transações  
  3. Metas  
  4. Viagens e Moedas (Premium)  
  Rodapé: Sair; tema; **sem** Grupos/Perfil/Config até existirem.  
  Agrupamento web “Financeiro / Planejamento” pode ficar **só na web larga**; Flutter lista plana **na mesma ordem**. Título de página Metas: “Metas Financeiras”; item de nav: **Metas**.
- **Critério de validação:** mesmos quatro destinos, mesma ordem, Grupos oculto no Flutter.

### UX-3-04 — Premium: esconder na web vs beco no Flutter

- **Evidência:** `useSidebarState.js:8-20` (`PREMIUM_PATHS` inclui `/trips`; FREE não vê o item). `App.jsx:71` (`/trips` ainda roteável). `trips_screen.dart:31-38` (empty “Viagens são Premium” **sem** CTA de upgrade). Nav Flutter **sempre** mostra Viagens (`app_shell.dart:223-227`).
- **Constatação:** Deep link web `/trips` em FREE: API 403 + toast, lista vazia/erro — não há empty de plano. Flutter comunica o plano mas o item de nav parece disponível.
- **Impacto:** Expectativa quebrada; empty sem próximo passo (upgrade).
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** **Canônico:** (1) esconder na nav se FREE (web já faz); Flutter igual. (2) se a rota for aberta, **EmptyState** de upgrade com mensagem única (“Recurso do plano Premium”) + ação se existir fluxo de plano; senão só texto, **sem** fingir lista.
- **Critério de validação:** FREE não vê Viagens na nav nos dois; URL direta mostra o mesmo empty.

### UX-3-05 — Vocabulário da viagem: pretensão vs despesa vs filename do protótipo

- **Evidência:** Protótipo e `docs/5.wireframe.md:132` “Nova pretensão”. `TripExpenseFormModal` / `TripDetailPage.jsx:199` “pretensão”. Flutter `trip_detail_screen.dart:51` “Nova despesa”. Arquivo `Nova Pretenção.png` (cedilha errada no nome; UI do PNG usa **Pretensão**).
- **Constatação:** O domínio (RF-042) e a web usam **pretensão**. Flutter traduz para despesa no detalhe.
- **Impacto:** Dois produtos mentais; busca na ajuda/docs falha.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** **Canônico:** Pretensão (de gasto). “Despesa” só se um dia houver lançamento real no ledger da viagem. Corrigir filename do export quando republicar (conteúdo já está certo).
- **Critério de validação:** zero “Nova despesa” na UI de viagens; grep Flutter.

### UX-3-06 — Empty/error/loading de lista não formam um padrão de jornada

- **Evidência:** Transações web: empty sem CTA (`TransactionList.jsx:128-135`); erro só toast (`TransactionsPage.jsx:90-92`); loading dots. Transações Flutter: empty+CTA, error+retry (`transactions_screen.dart:158-171`). Metas web: empty com CTA (`GoalList.jsx:35-45`); erro toast. Metas Flutter: empty com CTA; error **sem** retry (`goals_screen.dart:153-154`). Viagens web: empty com CTA; detalhe loading `SpinnerDots`.
- **Constatação:** O DS tem EmptyState; a jornada não aplica a tríade **loading / vazio / erro recuperável**.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** **Canônico:**  
  - Loading: padrão Fase 2 (dots / circular + label).  
  - Vazio: EmptyState + CTA de criar (se a ação existe na página).  
  - Erro de carga: EmptyState “Não foi possível carregar” + **Tentar de novo** (padrão Flutter transações). Toast só para mutação (salvar/excluir).
- **Critério de validação:** desligar API: metas/transações/viagens mostram retry, não só toast sumindo.

### UX-3-07 — Aporte e pretensão no Flutter quebram a jornada do protótipo

- **Evidência:** PNG `Aporte Meta.png` / `Nova Pretenção.png` (formulários completos). `GoalsPage.jsx` abre `GoalContributionModal`. `goals_screen.dart:44-70` diálogo de um campo. `trip_detail_screen.dart:43-97` diálogo reduzido vs `TripDetailExpensesSection` web.
- **Constatação:** A jornada mobile **existe** mas não percorre os mesmos passos (categoria, preview, notas).
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Igual UX-2-04: paridade de campos; plataforma pode ser sheet em vez de modal desktop.
- **Critério de validação:** checklist do PNG de pretensão (categoria, descrição opcional, valor, conversão) no Flutter.

### UX-3-08 — Catch-all e Dashboard competem com o recorte dos protótipos de nav

- **Evidência:** Protótipos de Transações/Metas/Viagens mostram sidebar **completa** (Carteiras, Orçamentos…). `sidebarNavigation.js:19-35` comenta orçamento/calendário/dívidas/grupos. `MainLayout.jsx:36-39` título mobile genérico “Pulso”, não o nome da seção (Flutter AppBar muda por rota `app_shell.dart:48-54`).
- **Constatação:** Exports Figma = visão de produto ampla; código = recorte. Título mobile web não identifica a jornada.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** **Canônico:** IA do **wireframe recorte**, não da sidebar do PNG antigo. Header mobile web: mesmo título da AppBar Flutter (Transações / Metas / Viagens e Moedas). Promo “Nova recorrência” do PNG: N/A até a feature.
- **Critério de validação:** nenhuma entrada de nav para módulo comentado; `main-layout__mobile-title` dinâmico.

### UX-3-09 — Início Flutter vs Dashboard web: duas “homes”

- **Evidência:** `home_screen.dart:40-60`. `DashboardPage.jsx:4-12`. Nav: web “Dashboard” primeiro; Flutter “Transações” primeiro e Início no meio.
- **Constatação:** Home Flutter já é um mini-dashboard de transações. Web não.
- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Recomendação:** Enquanto o Dashboard for stub, **não** ser o default (UX-3-02). Conteúdo canônico mínimo do Início = o da `HomeScreen` Flutter (saudação + resumo + atalho). Web copia isso ou esconde o item.
- **Critério de validação:** se o item Início/Dashboard aparece, mostra o mesmo bloco de resumo.

---

## 4. Pontos positivos

- Auth alinhada ao protótipo (copy “Bem-vindo de volta!”, Google, lembrar-me, recuperar senha) — `Login.jsx` e `login_screen.dart`.
- Transações web: filtros, resumo, agrupamento por data pt-BR, paginação, CTA “Nova Transação” (`TransactionsPage.jsx:247`).
- Metas web: tabs Todas/Ativas/Pausadas/Concluídas como o PNG; sidebar de resumo.
- Viagens web: conversor, favoritas, lista com capa, histórico de cotação — corresponde ao PNG “Gerenciar Viagens e Moedas”.
- Detalhe de viagem web é **página** (`TripDetailPage.jsx`), como o wireframe, não o modal morto.
- Flutter transações: pull-to-refresh, infinite scroll, filtros em sheet, Semantics de valor.
- Premium nav filter na web evita clique inútil em Viagens para FREE.
- Light/dark nos dois clientes e nos exports.

---

## 5. Quick wins

1. Remover ou desabilitar links `/profile` e `/settings`; `*` autenticado → `/transactions`.
2. `DEFAULT_AUTHENTICATED_ROUTE = '/transactions'`.
3. Ocultar Grupos no Flutter.
4. Trocar “Nova despesa” → “Nova pretensão”.
5. Título da AppBar mobile web por rota.

---

## 6. Roadmap e riscos

| Ordem | Ação | Risco se ignorar |
|-------|------|------------------|
| 1 | Matar links mortos | Usuário “é deslogado” para o marketing site |
| 2 | Default login = transações | Web parece não ter produto |
| 3 | IA recorte compartilhada | Grupos/Premium geram tickets falsos |
| 4 | Paridade aporte/pretensão | Recorte “web only” na prática |
| 5 | Tríade empty/error/loading | Falha de rede = tela em branco + toast |

**Pergunta material:** quando o Dashboard RF-007 for real, o default pós-login volta para `/dashboard`? **Sim**, desde que o Dashboard não seja stub. Até lá, transações.
