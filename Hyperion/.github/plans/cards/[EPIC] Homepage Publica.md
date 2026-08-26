# [EPIC] Homepage Pública — rollup Hyperion

> **Formato:** cards em `Hyperion/.github/cards/` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em `Backlog` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
| Epic | PULSO-EPIC-007 | Homepage Pública |
| Feature | PULSO-FEAT-036 | Shell e roteamento público |
| Feature | PULSO-FEAT-037 | Seções de marketing e módulos |
| Feature | PULSO-FEAT-038 | Header, footer, mobile e estilos |
| Feature | PULSO-FEAT-039 | QA — testes da homepage |
| Task | PULSO-TASK-073–080 | Landing, seções, chrome, CSS, legal, QA |

---

---
card_id: PULSO-EPIC-007
title: "Homepage Pública"
status: Backlog
type: Epic
priority: High
sprint: null
story_points: null
reporter: null
parent: null
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [EPIC] Homepage Pública

> **Contexto:** Landing page pública em `/` apresentando o Pulso — hero, funcionalidades, público-alvo, benefícios, depoimentos, CTAs e download do app; sem backend dedicado.

**Refs:** RF-084–087

## 🎯 Objetivos

- Homepage pública acessível sem autenticação (RF-084)
- CTAs "Começar Grátis" → `/register` e "Entrar" → `/login` (RF-085)
- Seções dos principais módulos com badges "Em breve"/"Beta" onde aplicável (RF-086)
- Layout responsivo com paleta Vital Purple e dark mode (RF-087)
- Redirect usuário autenticado via `DEFAULT_AUTHENTICATED_ROUTE`
- Navegação por âncoras (`#funcionalidades`, `#para-quem`, etc.) + hash scroll
- Header público compartilhado com login/cadastro
- Páginas legais `/termos` e `/privacidade` linkadas no footer
- Preview ilustrativo do dashboard e mockup mobile na landing

## 🎭 Telas e fluxos

| Rota | Tela | Fluxos principais |
|------|------|-------------------|
| `/` | Landing Page | Scroll seções; CTA cadastro; redirect se logado |
| `/termos` | Termos de uso | Documento legal estático |
| `/privacidade` | Política de privacidade | Documento legal estático |

## 🔗 Integrações

| Módulo | Integração |
|--------|------------|
| Autenticação | `GuestRoute`, `LandingPage` redirect, `PublicHeader` em login/register |
| Design System | `Button`, `PulsoBrand`, `useTheme`, tokens Vital Purple |
| App downloads | Arquivos em `public/downloads/` (.apk, .ipa) |

## 🔗 Sub-issues

- PULSO-FEAT-036
- PULSO-FEAT-037
- PULSO-FEAT-038
- PULSO-FEAT-039

## 📋 Resumo

### ✅ Concluído
- Escopo RF-084–087 mapeado
- Hierarquia Epic → 4 Features → 8 Tasks definida

### ⏳ Pendente
- Implementar landing completa frontend
- Alinhar badges de módulos conforme roadmap evoluir

---
---
card_id: PULSO-FEAT-036
title: "Shell e roteamento público"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-007
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [FEATURE] Shell e roteamento público

> **Contexto:** Página raiz `/` pública com redirect para usuários autenticados e CTAs de conversão.

**Refs:** RF-084 · RF-085

## 📝 Descrição

Implementar `LandingPage` como rota pública em `App.jsx` com comportamento de guest e navegação por hash.

## ✅ Critérios de Aceite

- Rota `/` renderiza landing sem `MainLayout`
- Se `sessionChecked && isAuthenticated` → `Navigate` para `DEFAULT_AUTHENTICATED_ROUTE`
- Hash na URL (`/#funcionalidades`) faz scroll suave na montagem
- Login/register envolvidos por `GuestRoute` com mesmo redirect
- Estrutura: `PublicHeader` + `<main>` seções + `LandingFooter`

## 🔗 Sub-issues

- PULSO-TASK-073

## 📋 Resumo

### ✅ Concluído
- Fluxos de roteamento e redirect definidos

### ⏳ Pendente
- PULSO-TASK-073 — LandingPage e rotas

---
---
card_id: PULSO-FEAT-037
title: "Seções de marketing e módulos"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-007
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [FEATURE] Seções de marketing e módulos

> **Contexto:** Conteúdo da landing — hero, cards de funcionalidades, público, benefícios e depoimentos.

**Refs:** RF-086

## 📝 Descrição

Implementar seções visuais com dados centralizados em `landingData.js` e preview do produto.

## ✅ Critérios de Aceite

- **Hero:** título, subtítulo, CTA primário `/register`, scroll secundário
- **Highlights:** 4 destaques (IA, gratuito, privacidade, perfis)
- **Features:** 8 cards (Dashboard, Metas, Viagens, IA, Chatbot, Gamificação, Grupos, Calendário) com badges opcionais
- **Audience:** 4 personas (estagiário, CLT, PJ, pessoa física)
- **Benefits:** lista com checkmarks
- **Testimonials:** 3 depoimentos
- **CTA final:** `#precos` com link cadastro
- **Preview:** `LandingDashboardPreview` mock da sidebar/dashboard

## 🔗 Sub-issues

- PULSO-TASK-074
- PULSO-TASK-075
- PULSO-TASK-076

## 📋 Resumo

### ✅ Concluído
- Mapa de seções e dados RF-086 definido

### ⏳ Pendente
- PULSO-TASK-074–076 — data, hero e sections

---
---
card_id: PULSO-FEAT-038
title: "Header, footer, mobile e estilos"
status: Backlog
type: Feature
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-007
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [FEATURE] Header, footer, mobile e estilos

> **Contexto:** Chrome público reutilizável, download mobile, páginas legais e CSS responsivo.

**Refs:** RF-085 · RF-087

## 📝 Descrição

Implementar header/footer compartilhados, seção mobile, termos/privacidade e folha de estilos Vital Purple.

## ✅ Critérios de Aceite

- `PublicHeader`: nav âncoras, toggle tema claro/escuro, CTAs Entrar/Cadastrar; prop `activeAuth` para login/register
- `LandingFooter`: colunas navegação/recursos/comunidade; `#roadmap` anchor
- `LandingMobile`: botões download APK/IPA de `APP_DOWNLOADS`
- `LandingPhoneHomeMockup`: showcase visual mobile
- `/termos` e `/privacidade` via `LegalDocumentLayout`
- `landing.css`: breakpoints mobile/tablet/desktop; gradientes purple

## 🔗 Sub-issues

- PULSO-TASK-077
- PULSO-TASK-078
- PULSO-TASK-079
- PULSO-TASK-080

## 📋 Resumo

### ✅ Concluído
- Componentes chrome e legal spec definidos

### ⏳ Pendente
- PULSO-TASK-077–080 — header, mobile, CSS e legal

---
---
card_id: PULSO-FEAT-039
title: "QA — testes da homepage"
status: Backlog
type: Feature
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-007
due_date: null
categories:
  - QA / Testes
  - Frontend
  - Web
---

# [FEATURE] QA — testes da homepage

> **Contexto:** Regressão para render, CTAs, redirect autenticado e seções principais.

## 📝 Descrição

Implementar suites Web cobrindo fluxos críticos documentados no epic.

## 🔗 Sub-issues

- PULSO-TASK-080

## 📋 Resumo

### ✅ Concluído
- Matriz de testes definida

### ⏳ Pendente
- PULSO-TASK-080 — implementar suites

---
---
card_id: PULSO-TASK-073
title: "Frontend — LandingPage e rotas públicas"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-036
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — LandingPage e rotas públicas

> **Contexto:** Shell da landing em `/` com redirect autenticado e integração ao router.

## 📝 Descrição

Implementar página raiz e registrar rotas públicas no `App.jsx`.

## 🛠️ Implementação

### Arquivos (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/LandingPage.jsx` | Composição seções; redirect auth; hash scroll |
| `config/defaultAuthenticatedRoute.js` | Constante central de redirect pós-login |
| `App.jsx` | `Route path="/"` → LandingPage; `/termos`, `/privacidade` |
| `components/routing/ProtectedRoute.jsx` | `GuestRoute` redirect autenticado |

**Hash scroll:** `useEffect` em `#funcionalidades`, `#para-quem`, etc.

**Sem backend:** módulo 100% estático/SPA

## 📋 Resumo

### ✅ Concluído
- Fluxo de rotas especificado

### ⏳ Pendente
- Implementar LandingPage e wiring de rotas

---
---
card_id: PULSO-TASK-074
title: "Frontend — landingData.js"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-037
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — landingData.js

> **Contexto:** Fonte única de conteúdo marketing — módulos, badges e links.

## 📝 Descrição

Centralizar dados estáticos da landing para fácil manutenção de copy e badges RF-086.

## 🛠️ Implementação

### `landingData.js` (NOVO — CRIAR)

| Export | Conteúdo |
|--------|----------|
| `NAV_LINKS` | Âncoras header (funcionalidades, para-quem, diferenciais, preços, roadmap) |
| `HIGHLIGHTS` | 4 cards destaque |
| `FEATURES` | 8 módulos com `tone`, `badge` opcional ("Em breve", "Beta") |
| `AUDIENCE` | 4 personas |
| `BENEFITS` | Lista diferenciais |
| `TESTIMONIALS` | 3 depoimentos |
| `FOOTER_LINKS` | navegacao, recursos, comunidade |
| `APP_DOWNLOADS` | APK/IPA paths em `public/downloads/` |

**Badges:** Dashboard e Chatbot "Em breve"; IA Insights "Beta"

## 📋 Resumo

### ✅ Concluído
- Estrutura de dados RF-086 definida

### ⏳ Pendente
- Implementar landingData.js

---
---
card_id: PULSO-TASK-075
title: "Frontend — LandingHero e DashboardPreview"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-037
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — LandingHero e DashboardPreview

> **Contexto:** Hero principal com CTAs RF-085 e mock visual do produto.

## 📝 Descrição

Implementar seção hero e preview ilustrativo da interface autenticada.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `LandingHero.jsx` | Badge gratuito, título gradient, CTAs, social proof |
| `LandingDashboardPreview.jsx` | Mock sidebar + cards recursos (VA/VR/VT) |

**CTAs:**
- Primário: `Link` → `/register` com `Button` primary
- Secundário: scroll → `#funcionalidades`

**Visual:** preview estático (não consome API)

## 📋 Resumo

### ✅ Concluído
- Layout hero e preview especificados

### ⏳ Pendente
- Implementar LandingHero e LandingDashboardPreview

---
---
card_id: PULSO-TASK-076
title: "Frontend — LandingSections"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-037
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — LandingSections

> **Contexto:** Seções intermediárias da landing com IDs de âncora.

## 📝 Descrição

Implementar componentes de seção exportados de `LandingSections.jsx`.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Export | ID âncora | Conteúdo |
|--------|-----------|----------|
| `LandingHighlights` | — | Grid 4 destaques |
| `LandingFeatures` | `#funcionalidades` | Grid 8 módulos + badges |
| `LandingAudience` | `#para-quem` | Grid personas |
| `LandingBenefits` | `#diferenciais` | Lista checkmarks |
| `LandingTestimonials` | — | Grid depoimentos |
| `LandingCta` | `#precos` | CTA final cadastro |

Consome dados de `landingData.js`; ícones `lucide-react`

## 📋 Resumo

### ✅ Concluído
- Mapa de seções definido

### ⏳ Pendente
- Implementar LandingSections.jsx

---
---
card_id: PULSO-TASK-077
title: "Frontend — PublicHeader e LandingFooter"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-038
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
---

# [TASK] Frontend — PublicHeader e LandingFooter

> **Contexto:** Chrome público reutilizado na landing, login e cadastro.

## 📝 Descrição

Implementar header com navegação, tema e CTAs; footer com links e social.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `PublicHeader.jsx` | Nav âncoras; `useTheme` toggle Sun/Moon; Entrar/Começar Grátis |
| `LandingFooter.jsx` | Brand, colunas FOOTER_LINKS, social icons, copyright |

**PublicHeader:**
- Em `/`: botões scroll para seções
- Em outras rotas: `Link` para `/#secao`
- Prop `activeAuth`: `'login' | 'register' | null`

**Footer:** `#roadmap` id para nav

Reutilizar `PulsoBrand` do design system

## 📋 Resumo

### ✅ Concluído
- Comportamento header/footer especificado

### ⏳ Pendente
- Implementar PublicHeader e LandingFooter

---
---
card_id: PULSO-TASK-078
title: "Frontend — seção mobile e phone mockup"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-038
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — seção mobile e phone mockup

> **Contexto:** Download direto do app e showcase visual mobile.

## 📝 Descrição

Implementar seção "Leve o Pulso com você" com botões de download e mockup de tela.

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `LandingMobile` (em LandingSections.jsx) | Texto + botões download |
| `LandingPhoneHomeMockup.jsx` | Showcase `LandingPhoneHomeShowcase` |

**Downloads:** links `href` + `download` para `/downloads/pulso-android.apk` e `.ipa`

**Nota iOS:** texto sobre VPN e Gerenciamento de Dispositivo

Assets em `public/downloads/` (NOVO — CRIAR placeholders se necessário)

## 📋 Resumo

### ✅ Concluído
- Spec download e mockup definida

### ⏳ Pendente
- Implementar seção mobile e mockup

---
---
card_id: PULSO-TASK-079
title: "Frontend — landing.css responsivo"
status: Backlog
type: Task
priority: High
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-038
due_date: null
categories:
  - Frontend
  - Web
  - UX / UI
  - Mobile
---

# [TASK] Frontend — landing.css responsivo

> **Contexto:** Estilos da landing com paleta Vital Purple e suporte dark mode (RF-087).

## 📝 Descrição

Implementar folha de estilos completa para todas as seções da homepage.

## 🛠️ Implementação

### `styles/landing.css` (NOVO — CRIAR)

**Seções estilizadas:**
- `.landing-page`, `.landing-container`
- Hero: grid 2 colunas → stack mobile; gradient title
- Features: cards coloridos por `tone` (purple, green, blue, etc.)
- Header: nav collapse/hamburger em mobile
- Theme toggle, footer grid, testimonials, CTA banner
- Download buttons Android/iOS

**Tokens:** CSS variables do design system (Vital Purple)

Importar em `LandingPage.jsx` ou entry global

## 📋 Resumo

### ✅ Concluído
- Mapa de classes e breakpoints definido

### ⏳ Pendente
- Implementar landing.css

---
---
card_id: PULSO-TASK-080
title: "Frontend — páginas legais e QA"
status: Backlog
type: Task
priority: Medium
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-039
due_date: null
categories:
  - Frontend
  - Web
  - QA / Testes
---

# [TASK] Frontend — páginas legais e QA

> **Contexto:** Termos/privacidade linkados no footer e testes de regressão da landing.

## 📝 Descrição

Implementar páginas legais estáticas e suites de teste da homepage.

## 🛠️ Implementação

### Páginas legais (NOVO — CRIAR)

| Arquivo | Função |
|---------|--------|
| `pages/TermsOfUse.jsx` | Termos de uso |
| `pages/PrivacyPolicy.jsx` | Política de privacidade |
| `pages/LegalDocumentLayout.jsx` | Layout compartilhado |
| `content/legal/termsOfUse.js` | Seções termos |
| `content/legal/privacyPolicy.js` | Seções privacidade |

### Web tests — `web/tests/` (NOVO — CRIAR)

| Arquivo | Escopo |
|---------|--------|
| `unit/pages/landingPage.test.jsx` | Render seções, CTAs `/register` |
| `unit/pages/landingPage.redirect.test.jsx` | Redirect se autenticado |
| `unit/components/publicHeader.test.jsx` | Nav links, theme toggle |

## 📋 Resumo

### ✅ Concluído
- Matriz legal + QA definida

### ⏳ Pendente
- Implementar páginas legais e testes

---
