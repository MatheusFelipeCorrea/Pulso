# [EPIC] Homepage Pública

> **Status (ago/2026):** ✅ Entregue (jul/2026) · revisado auditoria PO M12  
> **Correções PO:** redirect pós-login → `/transactions` (não `/dashboard` placeholder); badges alinhados ao produto real  
> **Refs:** RF-084–087 · [PO M12](../../Documentacao/03-Auditorias/Product Owner/12-Homepage.md) · [META Auditoria](./[META]%20Auditoria%20PO%202026-08.md)

**Tipo:**        Epic  
**Prioridade:**  🔺 Highest  
**Sprint:**      Concluído  
**Categoria:**   Marketing, Landing, Frontend  
**Relator:**     —  
**Pai:**         —  
**Data Limite:** —

---

## 📋 Descrição do Epic

Landing page pública na rota `/` apresentando o Pulso: hero, funcionalidades, público-alvo, benefícios, depoimentos, CTAs Cadastrar/Entrar, tema claro/escuro (Vital Purple), layout responsivo. Usuários autenticados são redirecionados para a área logada.

### 🎯 Objetivos do Epic

- ✅ Landing estática sem backend dedicado
- ✅ Navegação por âncoras (`#funcionalidades`, `#para-quem`, etc.)
- ✅ Badges honestos: **Em breve** (Dashboard, Chatbot), **Beta** (IA Insights)
- ✅ Mockups phone + dashboard preview
- ✅ Redirect autenticado → `DEFAULT_AUTHENTICATED_ROUTE` (`/transactions`)
- ✅ Header público reutilizado em páginas auth + footer

### 🎭 Seções (`landingData.js`)

| Seção | ID âncora | Conteúdo |
|-------|-----------|----------|
| Hero | — | Título, subtítulo, CTAs, mockup phone + dashboard preview |
| Highlights | — | 4 destaques rápidos (IA, Gratuito, Segurança, Para você) |
| Features | `#funcionalidades` | Grid 8 funcionalidades com badges |
| Audience | `#para-quem` | 4 personas (Estagiários, CLT, PJ, PF) |
| Benefits | `#diferenciais` | 8 benefícios numerados |
| Mobile | — | Downloads APK/IPA |
| Testimonials | — | 3 depoimentos marketing |
| CTA final | `#precos` | Call-to-action gradient |
| Footer | `#roadmap` | Links navegação + social |

---

## 🗄️ Modelo de Dados

**Sem modelos Prisma** — todo conteúdo estático em `landingData.js`. Nenhuma API backend dedicada.

---

## 🔗 Integrações

| Sistema | Integração |
|---------|------------|
| Auth | `LandingPage` redirect se `isAuthenticated` → `/transactions` |
| Tema | CSS variables light/dark via `.dark .landing-page` |
| Auth pages | `PublicHeader` compartilhado em `/login`, `/register` |
| App autenticado | Badges separados: landing usa `.landing-badge`; app usa `PulsoBadge` + `badgeCatalog.js` |

---

## 📊 Rastreamento de Implementação

| Camada | Status | Arquivos principais |
|--------|--------|---------------------|
| Database | ➖ | N/A — conteúdo hardcoded |
| Backend | ➖ | N/A — sem endpoints |
| Frontend | ✅ | `LandingPage.jsx`, 8 componentes `features/landing/`, `landingData.js`, `landing.css` |
| Rotas | ✅ | `App.jsx` rota `/` pública; `GuestRoute`/`ProtectedRoute` para auth |
| Testes | ❌ | Nenhum teste automatizado para landing |

---

## 🔧 Correções PO (ago/2026)

| ID | Correção | Onde |
|----|----------|------|
| RF-NOVO-B1 / L1 | Pós-login não redireciona para `/dashboard` inexistente | `DEFAULT_AUTHENTICATED_ROUTE = '/transactions'` em auth config |
| Copy IA/Gamificação | Textos não prometem features ausentes | `landingData.js` FEATURES badges |

---

## ⏳ Pendências

- [ ] Atualizar screenshots quando Dashboard existir (M02)
- [ ] Badge "em breve" na sidebar autenticada para Dashboard (RNF-NOVO-B1)
- [ ] CMS ou i18n (futuro)
- [ ] Testes E2E landing (smoke anônimo + redirect autenticado)

---

## 🚀 Critérios de Aceite Gerais (Epic)

→ Visitante anônimo vê landing completa em `/`  
→ CTAs levam a `/register` e `/login`  
→ Tema claro/escuro funciona  
→ Mobile responsivo  
→ Usuário logado em `/` → redirect `/transactions`  
→ Features futuras marcadas com badge "Em breve" ou "Beta"

---

# [STORY DATABASE] Homepage — Banco de Dados

**Tipo:**        Story · **➖ N/A**  
**Prioridade:**  —  
**Categoria:**   Banco de Dados  
**Pai:**         [EPIC] Homepage Pública

---

## 📝 Descrição

Epic **não possui persistência** — conteúdo marketing estático. Nenhuma migration Prisma associada.

**Fonte de dados:** `Codigo/Pulso/web/src/components/features/landing/landingData.js`

**Exports estáticos:**
- `NAV_LINKS` — 5 âncoras de navegação
- `HIGHLIGHTS` — 4 cards destaque
- `FEATURES` — 8 cards com `tone` + `badge?` (Dashboard/Chatbot "Em breve", IA "Beta")
- `AUDIENCE` — 4 personas
- `BENEFITS` — 8 bullets
- `TESTIMONIALS` — 3 depoimentos
- `FOOTER_LINKS` — navegação, recursos, comunidade
- `APP_DOWNLOADS` — URLs APK/IPA em `public/downloads/`

---

# [STORY BACKEND] Homepage — Backend

**Tipo:**        Story · **➖ N/A**  
**Categoria:**   Backend  
**Pai:**         [EPIC] Homepage Pública

---

## 📝 Descrição

Não há backend dedicado. Redirect pós-auth é responsabilidade do frontend (`LandingPage`, `GuestRoute`, `ProtectedRoute`).

**Constante compartilhada:** `DEFAULT_AUTHENTICATED_ROUTE` → `/transactions` (config auth do web app).

---

# [STORY FRONTEND] Homepage — Frontend

**Tipo:**        Story · **✅ Implementado**  
**Prioridade:**  🔺 Highest  
**Categoria:**   Frontend  
**Pai:**         [EPIC] Homepage Pública

---

## 📝 Descrição

**Como visitante**, quero ver uma landing page profissional em `/` com informações do produto e CTAs para cadastro/login; **como usuário autenticado**, devo ser redirecionado automaticamente para `/transactions`.

---

## ✅ Critérios de Aceite (Given/When/Then)

### Cenário 1 — Visitante anônimo
**Dado** usuário não autenticado,  
**Quando** acessa `/`,  
**Então** renderiza landing completa: header, hero, highlights, features, audience, benefits, testimonials, CTA, footer.

### Cenário 2 — Redirect autenticado
**Dado** sessão válida (`isAuthenticated && sessionChecked`),  
**Quando** acessa `/`,  
**Então** `<Navigate to={DEFAULT_AUTHENTICATED_ROUTE} />` → `/transactions` (não `/dashboard`).

### Cenário 3 — Navegação âncoras
**Quando** clica link nav "Funcionalidades",  
**Então** scroll suave para `#funcionalidades`.  
**Quando** URL tem hash `#diferenciais`,  
**Então** `useEffect` scrolla ao mount.

### Cenário 4 — CTAs hero
**Quando** clica "Começar grátis" ou "Entrar",  
**Então** navega para `/register` ou `/login` respectivamente.

### Cenário 5 — Badges features
**Quando** visualiza grid funcionalidades,  
**Então** Dashboard e Chatbot exibem badge "Em breve"; IA Insights exibe "Beta" (CSS `.landing-feature__badge`).

### Cenário 6 — Tema claro/escuro
**Quando** alterna tema no header,  
**Então** `.landing-page` aplica variables dark via `.dark .landing-page` em `landing.css`.

---

## 🛠️ Implementação (o que foi feito)

### LandingPage.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/pages/LandingPage.jsx`  
**Rota:** `/` (pública, fora de ProtectedRoute)

→ Composição: `PublicHeader`, `LandingHero`, seções de `LandingSections`, `LandingFooter`  
→ Auth guard: redirect `<Navigate>` se autenticado  
→ Hash scroll: `#section-id` no mount

---

### landingData.js (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/components/features/landing/landingData.js`

→ `NAV_LINKS`, `HIGHLIGHTS`, `FEATURES` (8 items + badges), `AUDIENCE`, `BENEFITS`, `TESTIMONIALS`, `FOOTER_LINKS`, `APP_DOWNLOADS`

**Badges FEATURES:**
- Dashboard → `"Em breve"`
- IA Insights → `"Beta"`
- Chatbot → `"Em breve"`

---

### Componentes (EXISTENTE — IMPLEMENTADO)

**Pasta:** `Codigo/Pulso/web/src/components/features/landing/`

| Componente | Responsabilidade |
|------------|------------------|
| `PublicHeader.jsx` | Header sticky: nav âncoras, theme toggle, CTAs login/register |
| `LandingHeader.jsx` | Re-export alias de `PublicHeader` |
| `LandingHero.jsx` | Hero: badge, headline, CTAs, social proof, dashboard preview |
| `LandingDashboardPreview.jsx` | Mockup estático dashboard (`.ldash`) |
| `LandingPhoneHomeMockup.jsx` | Mockup mobile phone light/dark |
| `LandingSections.jsx` | Exporta 7 seções: Highlights, Features, Audience, Benefits, Mobile, Testimonials, Cta |
| `LandingFooter.jsx` | Footer: brand, links, social, copyright |

---

### landing.css (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/styles/landing.css` (~1960 linhas)  
**Import:** `web/src/main.jsx`

→ Variables light/dark · header · hero · `.ldash` preview · features grid (`.landing-feature__badge`) · audience · benefits · `.lphone` mockup · testimonials · CTA gradient · footer · breakpoints responsivos

---

### Rotas App.jsx (EXISTENTE — IMPLEMENTADO)

**Arquivo:** `Codigo/Pulso/web/src/App.jsx`

| Rota | Element | Guard |
|------|---------|-------|
| `/` | `LandingPage` | Pública |
| `/login`, `/register` | Auth pages | `GuestRoute` → redirect `/transactions` se autenticado |
| `*` | `<Navigate to="/" />` | Fallback |

**Auth flow:**
- `ProtectedRoute` — não autenticado → `/login`
- `GuestRoute` — autenticado → `DEFAULT_AUTHENTICATED_ROUTE` (`/transactions`)
- `LandingPage` — autenticado → mesmo redirect

---

### Reuso PublicHeader (EXISTENTE — IMPLEMENTADO)

`PublicHeader.jsx` reutilizado em páginas de autenticação (`/login`, `/register`) para consistência visual landing ↔ auth.

---

## 🧪 Arquivos de teste (Frontend)

**Nenhum teste automatizado** — gap conhecido (pendência epic).

Sugestão futura: Playwright smoke em `/` (render + CTAs) e redirect autenticado.

---

## 🚫 Regras de Negócio (Frontend)

* Landing 100% estática — sem fetch API
* Badges landing (`.landing-badge`, `.landing-feature__badge`) **independentes** do sistema `PulsoBadge` autenticado
* Redirect autenticado sempre para `/transactions` (nunca `/dashboard` placeholder)
* Hash navigation preservada no mount
* Tema segue provider global (classe `.dark` no root)

---

## 📚 Documentação

- [PO M12](../../Documentacao/03-Auditorias/Product Owner/12-Homepage.md)
- [Protótipos Auth](../../Documentacao/05-Prototipos/)
- [Web Readme](../../Documentacao/02-Engenharia/Web/Readme.md)

---

## 📅 Histórico

| Data | Evento |
|------|--------|
| jul/2026 | Landing `/` entregue com mockups e tema |
| ago/2026 | Auditoria PO M12 — badges honestos + redirect `/transactions` |
