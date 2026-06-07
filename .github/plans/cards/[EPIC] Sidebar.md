# [EPIC] Sidebar de Navegação

Tipo:        Epic  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Frontend, UI/UX, Navegação  
Relator:     (preencher)  
Pai:         —  
Data Limite: (preencher)

---

## 📋 Descrição do Epic

Sistema completo de navegação lateral (sidebar) para o Pulso, com suporte a modo claro/escuro, colapso/expansão, submenus dropdown, busca, e versão mobile (drawer). A sidebar é o principal ponto de navegação da aplicação e deve ser responsiva, acessível e performática.

### 🎯 Objetivos do Epic

- ✅ Implementar sidebar colapsável com 3 estados (colapsada, expandida, expandida com submenus)
- ✅ Implementar sistema de navegação com React Router v6
- ✅ Implementar submenus dropdown animados
- ✅ Implementar user info card com avatar, nome e badge de modo de uso
- ✅ Implementar busca de itens na sidebar
- ✅ Implementar versão mobile com drawer (overlay)
- ✅ Persistir estado colapsado/expandido no localStorage
- ✅ Suportar modo claro e escuro automaticamente

### 🎭 Funcionalidades (Features)

Este Epic é dividido em **3 Features principais**:

1. **[FEATURE] Componente Sidebar Base**
   - Sidebar colapsável (desktop)
   - User info card com avatar + nome + badge
   - Busca de itens
   - Logo e header

2. **[FEATURE] Sistema de Navegação**
   - Itens de menu com ícones Lucide
   - Submenus dropdown animados
   - Highlight do item ativo (baseado na rota atual)
   - Menu "Conta" no rodapé (Perfil, Configurações, Sair)

3. **[FEATURE] Responsividade e Estados**
   - Drawer mobile (overlay com backdrop)
   - Persist do estado colapsado no localStorage
   - Transições animadas suaves
   - Fechamento automático de outros submenus ao abrir um novo

### 📊 Estrutura de Navegação (Dados)

A estrutura já está definida em `sidebarNavigation.js`:

| Menu | Submenus |
|---|---|
| Dashboard | — |
| Financeiro | Transações, Vale Transporte, Orçamento Mensal, Calendário Financeiro, Dívidas |
| Planejamento & Metas | Metas Financeiras, Viagens e Moedas, Grupos, Planejamento de Compra, Divisão de Despesas |
| Inteligência & Relatórios | Relatórios, **Insights**, **Chatbot**, Gamificação |
| Ferramentas | Agenda e Lembretes |
| Conta (rodapé) | Perfil, Configurações, Sair |

**Total:** 6 menus principais, 19 submenus.

### 🎨 Estados Visuais da Sidebar

| Estado | Largura | Conteúdo Visível |
|---|---|---|
| Colapsada | 72px | Apenas ícones + botão expandir |
| Expandida | 280px | Ícones + labels + submenus |
| Mobile (Drawer) | 280px | Full overlay com backdrop |

### 🎨 Sistema de Cores (conforme protótipos)

**Modo Escuro:**
- Background sidebar: `#09090B`
- Background item ativo: `#7C3AED` (roxo sólido)
- Background hover: `#18181B`
- Text primary: `#FAFAFA`
- Text secondary: `#A1A1AA`
- Border: `#27272A`

**Modo Claro:**
- Background sidebar: `#FFFFFF`
- Background item ativo: `#7C3AED/10` (roxo 10% opacidade)
- Background hover: `#F4F4F5`
- Text primary: `#18181B`
- Text secondary: `#71717A`
- Border: `#E4E4E7`

**Badges de Modo de Uso:**
| Modo | Cor (Light) | Cor (Dark) |
|---|---|---|
| Estagiário | `#7C3AED` (roxo) | `#A78BFA` (roxo claro) |
| CLT | `#2563EB` (azul) | `#60A5FA` (azul claro) |
| PJ/Freelancer | `#0891B2` (ciano) | `#22D3EE` (ciano claro) |
| Pessoa Física | `#71717A` (cinza) | `#A1A1AA` (cinza claro) |

### 📦 Componentes Necessários

**Do Design System (já existem):**
- ✅ `InputSearch` — busca na sidebar
- ✅ `Avatar` — foto do usuário
- ✅ `Badge` — modo de uso
- ✅ `Button` / `IconButton` — botão colapsar

**A criar:**
- 🆕 `Drawer` — componente genérico para mobile (design-system)
- 🆕 `Sidebar` — componente principal
- 🆕 `SidebarItem` — item de menu
- 🆕 `SidebarSubmenu` — dropdown de subitens
- 🆕 `UserInfoCard` — card com avatar + nome + badge
- 🆕 `MainLayout` — layout que usa a sidebar

### 🔧 Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| React 18 | Componentes |
| React Router v6 | Navegação (useLocation, useNavigate, Link) |
| Lucide React | Ícones (150+ ícones já instalados) |
| Tailwind CSS v4.2 | Estilização |
| clsx / tailwind-merge | Composição de classes |
| Framer Motion | Animações suaves (opcional, ou usar CSS transitions) |
| localStorage | Persistência do estado colapsado |

### ✅ Critérios de Aceite Gerais do Epic

→ Sidebar renderiza corretamente em desktop e mobile  
→ Sidebar colapsa/expande ao clicar no botão toggle  
→ Estado colapsado persiste após reload da página  
→ Submenus abrem/fecham com animação suave  
→ Item ativo destacado visualmente conforme rota atual  
→ Busca filtra itens em tempo real  
→ Versão mobile (drawer) abre/fecha com backdrop  
→ Modo claro/escuro aplicado automaticamente  
→ Todos os ícones renderizados corretamente (Lucide)  
→ Navegação funciona sem erros (React Router)  
→ Logout funciona (limpa tokens e redireciona)  

---

# [FEATURE] Componente Sidebar Base

---

## [STORY FRONTEND] Sidebar Colapsável e Header

Tipo:        Story  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Frontend  
Relator:     (preencher)  
Pai:         [FEATURE] Componente Sidebar Base  
Data Limite: (preencher)

---

### 📝 Descrição

Como usuário do Pulso, eu quero uma sidebar de navegação colapsável, para que eu possa economizar espaço na tela quando necessário e ainda acessar facilmente os menus principais.

---

## ✅ Critérios de Aceite

### Cenário 1 — Carregar Sidebar Expandida (Desktop)

**Dado** que o usuário está em desktop (>1024px)  
**Quando** a página carrega pela primeira vez  
**Então** exibe:
- Sidebar expandida (280px de largura)
- Header com:
  - Logo Pulso (ícone coração roxo + texto "Pulso")
  - Tagline: "Seu monitoramento financeiro"
  - Botão toggle (ícone `←` para colapsar)
- Campo de busca: placeholder "Buscar..."
- User Info Card (avatar + nome + badge)
- Lista de menus principais
- Menu "Conta" fixo no rodapé
- Transição suave (300ms) ao renderizar

---

### Cenário 2 — Colapsar Sidebar (Desktop)

**Dado** que a sidebar está expandida  
**Quando** o usuário clica no botão toggle (ícone `←`)  
**Então**:
- Sidebar colapsa para 72px de largura
- Texto "Pulso" some (apenas ícone fica visível)
- Tagline some
- Botão toggle vira `→` (para expandir)
- Labels dos menus somem (apenas ícones visíveis)
- Campo de busca some
- User Info Card mostra apenas avatar (sem nome nem badge)
- Transição suave (300ms)
- Estado salvo no localStorage (`sidebar_collapsed: true`)

---

### Cenário 3 — Expandir Sidebar Colapsada (Desktop)

**Dado** que a sidebar está colapsada  
**Quando** o usuário clica no botão toggle (ícone `→`)  
**Então**:
- Sidebar expande para 280px
- Todos os elementos voltam a aparecer (texto, labels, busca, user card completo)
- Transição suave (300ms)
- Estado salvo no localStorage (`sidebar_collapsed: false`)

---

### Cenário 4 — Persistir Estado Colapsado

**Dado** que o usuário colapsou a sidebar  
**Quando** recarrega a página ou navega para outra rota  
**Então**:
- Sidebar carrega no estado colapsado (lê do localStorage)
- Mantém estado até o usuário clicar no toggle novamente

---

### Cenário 5 — Hover em Item Colapsado (Desktop)

**Dado** que a sidebar está colapsada  
**Quando** o usuário passa o mouse sobre um item  
**Então**:
- Exibe tooltip com o nome do item ao lado do ícone
- Tooltip aparece após 300ms de hover
- Tooltip some ao tirar o mouse

---

### Cenário 6 — Mobile (< 1024px)

**Dado** que o usuário está em mobile ou tablet  
**Quando** a página carrega  
**Então**:
- Sidebar fica OCULTA por padrão
- Botão hambúrguer (☰) aparece no header principal
- Ao clicar no hambúrguer: abre drawer com a sidebar (ver próxima Story)

---

## 🎨 Visual e UX

### Protótipos Fornecidos

✅ **3 estados da sidebar** (modo escuro + claro):
- Estado 1: Colapsada (72px)
- Estado 2: Expandida (280px)
- Estado 3: Expandida com submenus abertos

### Layout da Sidebar (Expandida)

```
┌──────────────────────────┐
│ [❤️] Pulso          [←] │  ← Header (60px altura)
│ Seu monitoramento fin.   │
├──────────────────────────┤
│ 🔍 Buscar...            │  ← Busca (40px altura)
├──────────────────────────┤
│ [🧑] Matheus F. Correa  │  ← User Info Card (80px)
│      Estagiário         │
├──────────────────────────┤
│ 🏠 Dashboard            │  ← Itens de menu
│ 💰 Financeiro        ▼  │
│ 🎯 Planejamento...   ▼  │
│ 🧠 Inteligência...   ▼  │
│ 🔧 Ferramentas       ▼  │
│ ...                     │
│ (espaço expansível)     │
├──────────────────────────┤
│ 👤 Conta             ▼  │  ← Rodapé fixo
└──────────────────────────┘
```

### Layout da Sidebar (Colapsada)

```
┌──────┐
│ [❤️] │  ← Logo (apenas ícone)
│  →   │  ← Toggle (expandir)
├──────┤
│      │  ← Busca OCULTA
├──────┤
│ [🧑] │  ← Avatar apenas
├──────┤
│ 🏠  │  ← Ícones
│ 💰  │
│ 🎯  │
│ 🧠  │
│ 🔧  │
├──────┤
│ 👤  │  ← Conta (ícone)
└──────┘
```

### Componentes do Design System Usados

- ✅ `InputSearch` — busca (com ícone 🔍)
- ✅ `IconButton` — botão toggle
- ✅ `Avatar` — foto do usuário
- ✅ `Badge` — modo de uso

---

## ⚙️ Integração Técnica

### Componentes

#### Sidebar/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/layouts/Sidebar/Sidebar.jsx`  
**Seguir padrão de:** componentes do design-system (estrutura limpa)

**Props:**
```typescript
interface SidebarProps {
  isOpen?: boolean          // Para mobile (drawer)
  onClose?: () => void      // Para mobile (fechar drawer)
  className?: string        // Classes adicionais
}
```

**Estados internos:**
```javascript
const [isCollapsed, setIsCollapsed] = useState(false)  // Desktop: colapsado ou não
const [searchQuery, setSearchQuery] = useState('')     // Busca
const [openSubmenu, setOpenSubmenu] = useState(null)   // Qual submenu está aberto
```

**Estrutura:**
```jsx
<aside className={sidebarVariants({ collapsed: isCollapsed })}>
  {/* Header */}
  <div className="sidebar-header">
    <Logo collapsed={isCollapsed} />
    <IconButton onClick={toggleCollapse} icon={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} />
  </div>

  {/* Search (só se expandida) */}
  {!isCollapsed && (
    <div className="sidebar-search">
      <InputSearch value={searchQuery} onChange={setSearchQuery} placeholder="Buscar..." />
    </div>
  )}

  {/* User Info Card */}
  <UserInfoCard collapsed={isCollapsed} />

  {/* Navigation */}
  <nav className="sidebar-nav">
    {SIDEBAR_NAV.map(item => (
      <SidebarItem key={item.id} item={item} collapsed={isCollapsed} />
    ))}
  </nav>

  {/* Footer (Conta) */}
  <div className="sidebar-footer">
    <SidebarItem item={{ ...accountMenu }} collapsed={isCollapsed} />
  </div>
</aside>
```

**Lógica de colapso:**
```javascript
// Ler do localStorage ao montar
useEffect(() => {
  const collapsed = localStorage.getItem('sidebar_collapsed') === 'true'
  setIsCollapsed(collapsed)
}, [])

// Salvar no localStorage ao mudar
const toggleCollapse = () => {
  setIsCollapsed(prev => {
    const newState = !prev
    localStorage.setItem('sidebar_collapsed', String(newState))
    return newState
  })
}
```

---

#### Sidebar.styles.jsx (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/layouts/Sidebar/Sidebar.styles.jsx`

Usar `cva` (class-variance-authority) para variantes:

```javascript
import { cva } from 'class-variance-authority'

export const sidebarVariants = cva(
  // Base
  'sidebar flex h-screen flex-col border-r bg-background transition-all duration-300',
  {
    variants: {
      collapsed: {
        true: 'w-[72px]',
        false: 'w-[280px]'
      }
    },
    defaultVariants: {
      collapsed: false
    }
  }
)

export const sidebarHeaderVariants = cva(
  'sidebar-header flex h-[60px] items-center gap-3 border-b px-4',
  {
    variants: {
      collapsed: {
        true: 'justify-center px-2',
        false: 'justify-between'
      }
    }
  }
)
```

---

#### UserInfoCard/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/layouts/Sidebar/UserInfoCard.jsx`

**Props:**
```typescript
interface UserInfoCardProps {
  collapsed?: boolean  // Se true, mostra apenas avatar
}
```

**Estrutura:**
```jsx
<div className={userInfoCardVariants({ collapsed })}>
  <Avatar src={user?.urlAvatar} alt={user?.nome} size={collapsed ? 'md' : 'lg'} />
  
  {!collapsed && (
    <div className="user-info-text">
      <p className="user-name">{user?.nome}</p>
      <Badge variant={getBadgeVariant(user?.modoUso)}>
        {translateModoUso(user?.modoUso)}
      </Badge>
    </div>
  )}
</div>
```

**Lógica:**
```javascript
import { useSelector } from 'react-redux'

const UserInfoCard = ({ collapsed }) => {
  const user = useSelector(state => state.auth.user)
  
  const getBadgeVariant = (modo) => {
    const variants = {
      ESTAGIARIO: 'purple',
      CLT: 'blue',
      PJ: 'cyan',
      PESSOA_FISICA: 'gray'
    }
    return variants[modo] || 'gray'
  }
  
  const translateModoUso = (modo) => {
    const labels = {
      ESTAGIARIO: 'Estagiário',
      CLT: 'CLT',
      PJ: 'PJ',
      PESSOA_FISICA: 'Pessoa Física'
    }
    return labels[modo] || modo
  }
  
  // ...
}
```

---

#### Logo/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/layouts/Sidebar/Logo.jsx`

Componente simples que renderiza o logo do Pulso:

```jsx
<div className={logoVariants({ collapsed })}>
  <HeartPulseIcon className="text-primary" size={32} />
  {!collapsed && (
    <div>
      <h1 className="text-lg font-bold">Pulso</h1>
      <p className="text-xs text-muted-foreground">Seu monitoramento financeiro</p>
    </div>
  )}
</div>
```

---

### Hooks

Nenhum hook novo necessário. Usa Redux para pegar dados do usuário:

```javascript
import { useSelector } from 'react-redux'

const user = useSelector(state => state.auth.user)
// { id, nome, email, urlAvatar, modoUso }
```

---

### Configuração

#### sidebarNavigation.js (EXISTENTE — NÃO ALTERAR)

**Arquivo:** `Codigo/Pulso/web/src/config/sidebarNavigation.js`

Já está completo com:
- `SIDEBAR_NAV` — array de menus principais
- `SIDEBAR_NAV_FOOTER` — array de itens do rodapé (Conta)

**Estrutura de cada item:**
```javascript
{
  id: 'string',           // Identificador único
  label: 'string',        // Texto exibido
  path: '/route',         // Rota do React Router (opcional se tem children)
  icon: 'IconName',       // Nome do ícone Lucide (string)
  children: [             // Submenus (opcional)
    { id, label, path, icon }
  ],
  action: 'logout'        // Ação especial (opcional, só para "Sair")
}
```

---

## 🚫 Regras de Negócio

* Sidebar colapsada tem 72px de largura, expandida tem 280px
* Estado colapsado persiste no localStorage (chave: `sidebar_collapsed`)
* Em mobile (<1024px), sidebar vira drawer (overlay)
* Tooltip aparece em itens colapsados após 300ms de hover
* Transições suaves de 300ms ao colapsar/expandir
* User info card mostra dados do Redux (`state.auth.user`)
* Badge de modo de uso usa cores específicas por tipo

---

## 🛠️ Refinamento

* **Estado Local**: useState para isCollapsed, searchQuery, openSubmenu
* **Estado Global**: Redux para dados do usuário (auth.user)
* **Persistência**: localStorage para estado colapsado
* **Animações**: CSS transitions (300ms) ou Framer Motion
* **Responsividade**: useMediaQuery para detectar mobile
* **Ícones**: Lucide React (importar dinamicamente ou usar objeto map)

---

## [STORY FRONTEND] Sistema de Submenus Dropdown

Tipo:        Story  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Frontend  
Relator:     (preencher)  
Pai:         [FEATURE] Sistema de Navegação  
Data Limite: (preencher)

---

### 📝 Descrição

Como usuário, eu quero clicar em itens de menu com submenus para expandir/colapsar a lista de subitens, para que eu possa navegar facilmente entre as seções do sistema.

---

## ✅ Critérios de Aceite

### Cenário 1 — Clicar em Menu com Submenu (Fechado)

**Dado** que o menu "Financeiro" está fechado  
**Quando** o usuário clica no item "Financeiro"  
**Então**:
- Submenu se expande suavemente (animação slide-down 200ms)
- Ícone chevron muda de `▼` para `▲`
- Exibe os 5 subitens:
  - Transações
  - Vale Transporte
  - Orçamento Mensal
  - Calendário Financeiro
  - Dívidas
- Cada subitem tem ícone + label (se expandida) ou apenas ícone (se colapsada)
- Background do item pai fica destacado (roxo claro/escuro)

---

### Cenário 2 — Clicar em Menu com Submenu (Aberto)

**Dado** que o menu "Financeiro" está aberto  
**Quando** o usuário clica novamente no item "Financeiro"  
**Então**:
- Submenu colapsa suavemente (animação slide-up 200ms)
- Ícone chevron volta para `▼`
- Subitens somem
- Background do item pai volta ao normal

---

### Cenário 3 — Abrir Outro Submenu (Fecha Anterior)

**Dado** que o menu "Financeiro" está aberto  
**Quando** o usuário clica em "Planejamento & Metas"  
**Então**:
- Menu "Financeiro" fecha automaticamente
- Menu "Planejamento & Metas" abre
- Apenas 1 submenu aberto por vez (accordion behavior)

---

### Cenário 4 — Clicar em Subitem (Navega)

**Dado** que o menu "Financeiro" está aberto  
**Quando** o usuário clica em "Transações"  
**Então**:
- Navega para `/transactions`
- Item "Transações" fica destacado (background roxo)
- Menu "Financeiro" continua aberto
- Em mobile: fecha o drawer automaticamente

---

### Cenário 5 — Item sem Submenu (Navega Direto)

**Dado** que o usuário clica em "Dashboard" (sem submenu)  
**Quando** o clique ocorre  
**Então**:
- Navega para `/dashboard` imediatamente
- Item "Dashboard" fica destacado
- Nenhum submenu se abre

---

### Cenário 6 — Submenu em Sidebar Colapsada (Desktop)

**Dado** que a sidebar está colapsada  
**Quando** o usuário passa o mouse sobre um item com submenu (ex: "Financeiro")  
**Então**:
- Exibe tooltip com o nome do menu
- NÃO abre o submenu automaticamente
- Ao clicar: expande a sidebar primeiro, depois abre o submenu

---

### Cenário 7 — Highlight do Item Ativo (Baseado na Rota)

**Dado** que o usuário está em `/transactions`  
**Quando** a página carrega  
**Então**:
- Item "Transações" fica destacado (background roxo)
- Menu pai "Financeiro" abre automaticamente
- Outros menus ficam fechados

---

### Cenário 8 — Menu "Conta" no Rodapé

**Dado** que o usuário está na sidebar  
**Quando** visualiza o rodapé  
**Então**:
- Exibe item "Conta" fixo no final
- Ao clicar: abre submenu com:
  - Perfil (navega para `/profile`)
  - Configurações (navega para `/settings`)
  - Sair (dispara ação de logout)

---

### Cenário 9 — Ação de Logout

**Dado** que o usuário clica em "Sair" dentro do menu "Conta"  
**Quando** o clique ocorre  
**Então**:
- Dispara `useLogout()` mutation
- Remove tokens do localStorage
- Limpa estado do Redux
- Redireciona para `/login`
- Exibe toast: "Logout realizado com sucesso"

---

## 🎨 Visual e UX

### Animações

- **Abertura de submenu**: slide-down + fade-in (200ms)
- **Fechamento de submenu**: slide-up + fade-out (200ms)
- **Highlight do item ativo**: transição suave de background (150ms)
- **Hover**: transição de background (150ms)

### Estrutura Visual (Expandida)

```
💰 Financeiro ▲  ← Item pai (aberto)
  ⇄ Transações  ← Subitem (destacado se ativo)
  🚌 Vale Transporte
  📊 Orçamento Mensal
  📅 Calendário Financeiro
  🏛️ Dívidas
```

### Estrutura Visual (Colapsada)

```
💰  ← Apenas ícone (tooltip ao hover)
```

---

## ⚙️ Integração Técnica

### Componentes

#### SidebarItem/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/layouts/Sidebar/SidebarItem.jsx`

**Props:**
```typescript
interface SidebarItemProps {
  item: {
    id: string
    label: string
    path?: string
    icon: string
    children?: Array<SubItem>
    action?: 'logout'
  }
  collapsed?: boolean
  level?: number  // 0 = pai, 1 = filho (indentação)
}
```

**Estrutura:**
```jsx
<div className="sidebar-item-wrapper">
  {/* Item clicável */}
  <button
    onClick={handleClick}
    className={sidebarItemVariants({ active: isActive, level })}
  >
    <Icon name={item.icon} size={20} />
    {!collapsed && <span>{item.label}</span>}
    {!collapsed && hasChildren && (
      <ChevronIcon className={cn('transition', isOpen && 'rotate-180')} />
    )}
  </button>

  {/* Submenu (se tiver children) */}
  {hasChildren && isOpen && !collapsed && (
    <div className="sidebar-submenu">
      {item.children.map(child => (
        <SidebarItem key={child.id} item={child} level={1} />
      ))}
    </div>
  )}

  {/* Tooltip (se colapsada) */}
  {collapsed && <Tooltip content={item.label} side="right" />}
</div>
```

**Lógica:**
```javascript
import { useLocation, useNavigate } from 'react-router-dom'
import { useLogout } from '@/hooks/useAuthMutations'

const SidebarItem = ({ item, collapsed, level = 0 }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const [isOpen, setIsOpen] = useState(false)
  
  // Verificar se este item ou algum filho está ativo
  const isActive = useMemo(() => {
    if (item.path && location.pathname === item.path) return true
    if (item.children) {
      return item.children.some(child => location.pathname === child.path)
    }
    return false
  }, [location.pathname, item])
  
  // Abrir submenu automaticamente se um filho estiver ativo
  useEffect(() => {
    if (isActive && item.children) {
      setIsOpen(true)
    }
  }, [isActive])
  
  const handleClick = () => {
    // Se tem ação especial (logout)
    if (item.action === 'logout') {
      logoutMutation.mutate()
      return
    }
    
    // Se tem submenu
    if (item.children) {
      if (collapsed) {
        // Em sidebar colapsada: expande primeiro
        // (dispara evento para Sidebar.jsx expandir)
        return
      }
      setIsOpen(prev => !prev)
      return
    }
    
    // Se tem path: navega
    if (item.path) {
      navigate(item.path)
    }
  }
  
  // ...
}
```

---

#### SidebarSubmenu/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/layouts/Sidebar/SidebarSubmenu.jsx`

Componente wrapper para animação de submenu:

```jsx
import { AnimatePresence, motion } from 'framer-motion'

const SidebarSubmenu = ({ isOpen, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="sidebar-submenu overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**Alternativa sem Framer Motion (CSS puro):**
```jsx
<div 
  className={cn(
    'sidebar-submenu grid transition-all duration-200',
    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
  )}
>
  <div className="overflow-hidden">
    {children}
  </div>
</div>
```

---

### Hooks

#### useAuthMutations.js (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/hooks/useAuthMutations.js`

Hook `useLogout()` já existe (criado no Epic de Autenticação). Apenas usar:

```javascript
import { useLogout } from '@/hooks/useAuthMutations'

const logoutMutation = useLogout()

// Ao clicar em "Sair":
logoutMutation.mutate()
```

---

### Utilitários

#### Icon Resolver (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/utils/iconResolver.js`

Resolve nomes de ícones (string) para componentes Lucide:

```javascript
import * as LucideIcons from 'lucide-react'

export const resolveIcon = (iconName) => {
  const Icon = LucideIcons[iconName]
  if (!Icon) {
    console.warn(`Icon "${iconName}" not found in Lucide. Using default.`)
    return LucideIcons.CircleHelp
  }
  return Icon
}

// Uso:
const Icon = resolveIcon('LayoutGrid')
return <Icon size={20} />
```

---

### Rotas

Usa React Router v6 (`<Link>`, `useNavigate`, `useLocation`):

```javascript
import { Link, useLocation, useNavigate } from 'react-router-dom'

// Navegação programática:
const navigate = useNavigate()
navigate('/transactions')

// Rota atual:
const location = useLocation()
const isActive = location.pathname === '/transactions'

// Link declarativo:
<Link to="/transactions">Transações</Link>
```

---

## 🚫 Regras de Negócio

* Apenas 1 submenu aberto por vez (accordion)
* Item ativo destacado com background roxo
* Menu pai abre automaticamente se filho estiver ativo
* Em sidebar colapsada: não abre submenu ao passar o mouse, só ao clicar
* Ao clicar em subitem: navega + em mobile fecha o drawer
* Menu "Conta" sempre fixo no rodapé
* Logout limpa tokens, estado do Redux e redireciona para /login

---

## 🛠️ Refinamento

* **Animações**: Framer Motion para slide-down/up suave, ou CSS grid rows
* **Ícones**: Resolver dinamicamente via `iconResolver.js`
* **Estado**: Cada SidebarItem gerencia seu próprio isOpen
* **Highlight**: Usar `useLocation()` para comparar pathname
* **Accordion**: Sidebar.jsx controla qual submenu está aberto (state.openSubmenu)

---

## [STORY FRONTEND] Busca de Itens na Sidebar

Tipo:        Story  
Prioridade:  🔼 High  
Sprint:      (preencher)  
Categoria:   Frontend  
Relator:     (preencher)  
Pai:         [FEATURE] Componente Sidebar Base  
Data Limite: (preencher)

---

### 📝 Descrição

Como usuário, eu quero buscar itens na sidebar digitando no campo de busca, para que eu possa encontrar rapidamente a funcionalidade que preciso sem precisar navegar pelos menus.

---

## ✅ Critérios de Aceite

### Cenário 1 — Buscar Item (Encontra Resultado)

**Dado** que a sidebar está expandida  
**Quando** o usuário digita "transaç" no campo de busca  
**Então**:
- Filtra itens em tempo real (enquanto digita)
- Exibe apenas itens que contêm "transaç" no label (case-insensitive)
- Resultado:
  - "Transações" (menu Financeiro)
- Subitens aparecem mesmo se o pai não corresponder à busca
- Menus sem resultados ficam ocultos

---

### Cenário 2 — Buscar Item (Nenhum Resultado)

**Dado** que o usuário digita "xyzabc"  
**Quando** nenhum item corresponde  
**Então**:
- Exibe estado vazio:
  - Ícone de lupa barrada
  - Texto: "Nenhum resultado encontrado"
  - Sugestão: "Tente buscar por outro termo"

---

### Cenário 3 — Limpar Busca

**Dado** que há resultados filtrados  
**Quando** o usuário apaga todo o texto do campo de busca  
**Então**:
- Exibe todos os itens novamente
- Menus voltam ao estado anterior (abertos/fechados como estavam)

---

### Cenário 4 — Clicar em Item Filtrado (Navega)

**Dado** que a busca retornou "Transações"  
**Quando** o usuário clica no item  
**Então**:
- Navega para `/transactions`
- Limpa o campo de busca automaticamente
- Fecha outros menus e abre o menu pai "Financeiro"
- Item fica destacado

---

### Cenário 5 — Busca em Sidebar Colapsada (Não Exibe Campo)

**Dado** que a sidebar está colapsada  
**Quando** o usuário visualiza a sidebar  
**Então**:
- Campo de busca fica oculto
- Ao expandir: campo reaparece vazio

---

### Cenário 6 — Busca com Ícone X (Limpar)

**Dado** que há texto no campo de busca  
**Quando** o usuário clica no ícone X (limpar)  
**Então**:
- Campo fica vazio
- Todos os itens voltam a aparecer
- Foco volta para o campo de busca

---

### Cenário 7 — Busca Ignora Acentos (Opcional)

**Dado** que o usuário digita "transacao" (sem ç)  
**Quando** existe item "Transações"  
**Então**:
- Opcional: encontra mesmo sem acento (normalizar strings)
- Se não implementar: não encontra (exige escrita exata)

---

## 🎨 Visual e UX

### Campo de Busca

```
┌──────────────────────────┐
│ 🔍 Buscar...        [X] │  ← Placeholder + ícone limpar (se houver texto)
└──────────────────────────┘
```

### Estado Vazio (Nenhum Resultado)

```
┌──────────────────────────┐
│         🔍 /            │
│                         │
│ Nenhum resultado        │
│ encontrado              │
│                         │
│ Tente buscar por        │
│ outro termo             │
└──────────────────────────┘
```

---

## ⚙️ Integração Técnica

### Componentes

#### Sidebar.jsx (EXISTENTE — MODIFICAR)

Adicionar lógica de filtro:

```javascript
const [searchQuery, setSearchQuery] = useState('')

// Filtrar itens baseado na busca
const filteredItems = useMemo(() => {
  if (!searchQuery.trim()) return SIDEBAR_NAV
  
  const query = searchQuery.toLowerCase()
  
  return SIDEBAR_NAV.map(item => {
    // Se o item pai corresponde: retorna tudo
    if (item.label.toLowerCase().includes(query)) {
      return item
    }
    
    // Se tem filhos: filtra os filhos
    if (item.children) {
      const filteredChildren = item.children.filter(child =>
        child.label.toLowerCase().includes(query)
      )
      
      // Se algum filho corresponde: retorna item pai com filhos filtrados
      if (filteredChildren.length > 0) {
        return { ...item, children: filteredChildren }
      }
    }
    
    return null
  }).filter(Boolean)
}, [searchQuery])

// Renderizar filteredItems em vez de SIDEBAR_NAV
```

---

#### EmptySearchState/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/layouts/Sidebar/EmptySearchState.jsx`

Componente de estado vazio:

```jsx
import { SearchX } from 'lucide-react'

const EmptySearchState = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center">
    <SearchX size={48} className="text-muted-foreground opacity-50" />
    <div>
      <p className="font-medium text-foreground">Nenhum resultado encontrado</p>
      <p className="text-sm text-muted-foreground">Tente buscar por outro termo</p>
    </div>
  </div>
)
```

---

### Componentes do Design System

- ✅ `InputSearch` — já existe (com ícone de lupa e X para limpar)

Usar exatamente como está:

```jsx
import { InputSearch } from '@/design-system/components'

<InputSearch
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Buscar..."
  onClear={() => setSearchQuery('')}
/>
```

---

### Utilitários (Opcional)

#### normalizeString.js (NOVO — CRIAR — OPCIONAL)

**Criar em:** `Codigo/Pulso/web/src/utils/normalizeString.js`

Para ignorar acentos na busca:

```javascript
/**
 * Remove acentos de uma string
 * Ex: "Transações" -> "transacoes"
 */
export const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// Uso na busca:
const query = normalizeString(searchQuery)
const match = normalizeString(item.label).includes(query)
```

---

## 🚫 Regras de Negócio

* Busca é case-insensitive
* Busca em tempo real (debounce de 300ms recomendado para performance)
* Ao encontrar subitem: exibe mesmo que o pai não corresponda
* Ao clicar em item filtrado: limpa busca automaticamente
* Sidebar colapsada: campo de busca fica oculto
* Estado vazio exibe mensagem amigável

---

## 🛠️ Refinamento

* **Debounce**: Usar `useDebounce` para evitar filtrar a cada tecla (300ms)
* **Normalização**: Opcional — ignorar acentos para melhor UX
* **Performance**: Usar `useMemo` para cachear itens filtrados
* **Highlight**: Opcional — destacar termo buscado no resultado (bold ou background)

---

## [STORY FRONTEND] Drawer Mobile e Responsividade

Tipo:        Story  
Prioridade:  🔼 High  
Sprint:      (preencher)  
Categoria:   Frontend  
Relator:     (preencher)  
Pai:         [FEATURE] Responsividade e Estados  
Data Limite: (preencher)

---

### 📝 Descrição

Como usuário em dispositivo móvel ou tablet, eu quero acessar a sidebar através de um menu drawer (overlay), para que eu possa navegar facilmente mesmo em telas pequenas.

---

## ✅ Critérios de Aceite

### Cenário 1 — Mobile: Sidebar Oculta por Padrão

**Dado** que o usuário está em mobile (< 1024px)  
**Quando** a página carrega  
**Então**:
- Sidebar fica OCULTA (não renderizada ou off-screen)
- Header principal exibe botão hambúrguer (☰) no canto superior esquerdo
- Conteúdo principal ocupa toda a largura da tela

---

### Cenário 2 — Abrir Drawer (Mobile)

**Dado** que a sidebar está oculta  
**Quando** o usuário clica no botão hambúrguer (☰)  
**Então**:
- Drawer desliza da esquerda (animação slide-in 300ms)
- Backdrop escuro (opacity 50%) cobre o conteúdo principal
- Drawer tem largura de 280px
- Sidebar renderizada dentro do drawer (igual ao desktop, sempre expandida)
- Body scroll fica bloqueado (overflow: hidden)

---

### Cenário 3 — Fechar Drawer (Clique no Backdrop)

**Dado** que o drawer está aberto  
**Quando** o usuário clica no backdrop (área escura fora do drawer)  
**Então**:
- Drawer desliza para fora (animação slide-out 300ms)
- Backdrop desaparece (fade-out)
- Body scroll volta ao normal

---

### Cenário 4 — Fechar Drawer (Clique em Item)

**Dado** que o drawer está aberto  
**Quando** o usuário clica em qualquer item de menu (ex: "Transações")  
**Então**:
- Navega para a rota
- Drawer fecha automaticamente
- Backdrop desaparece

---

### Cenário 5 — Fechar Drawer (Botão X)

**Dado** que o drawer está aberto  
**Quando** o usuário clica no botão X (fechar) dentro do drawer  
**Então**:
- Drawer fecha com animação
- Backdrop desaparece

---

### Cenário 6 — Fechar Drawer (Swipe)

**Dado** que o drawer está aberto  
**Quando** o usuário faz swipe da direita para a esquerda (gesto de fechar)  
**Então**:
- Drawer fecha seguindo o dedo (drag gesture)
- Se soltar antes de 50% da largura: volta ao estado aberto
- Se soltar após 50%: fecha completamente

---

### Cenário 7 — Tablet (768px - 1024px)

**Dado** que o usuário está em tablet (largura entre 768px e 1024px)  
**Quando** a página carrega  
**Então**:
- Sidebar pode ficar visível OU usar drawer (decisão de design)
- Recomendação: usar drawer também para manter consistência

---

### Cenário 8 — Desktop (>1024px)

**Dado** que o usuário está em desktop  
**Quando** a página carrega  
**Então**:
- Drawer não é usado
- Sidebar renderizada diretamente (colapsável como visto nas Stories anteriores)

---

## 🎨 Visual e UX

### Estrutura do Drawer (Mobile)

```
┌────────────┬─────────────────────┐
│            │ [Backdrop escuro]   │
│  DRAWER    │                     │
│  280px     │                     │
│            │                     │
│ [Sidebar]  │   [Conteúdo]        │
│            │   (bloqueado)       │
│            │                     │
│            │                     │
└────────────┴─────────────────────┘
```

### Animações

- **Abertura**: slide-in da esquerda (transform: translateX(-100%) -> 0)
- **Fechamento**: slide-out para esquerda (transform: translateX(0) -> -100%)
- **Backdrop**: fade-in/out (opacity: 0 -> 0.5 -> 0)
- **Duração**: 300ms
- **Easing**: ease-in-out

---

## ⚙️ Integração Técnica

### Componentes do Design System

#### Drawer/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/design-system/components/overlays/Drawer/Drawer.jsx`

Componente genérico para drawer (pode ser reutilizado em outros lugares):

**Props:**
```typescript
interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  side?: 'left' | 'right'  // default: 'left'
  width?: string           // default: '280px'
  children: ReactNode
}
```

**Estrutura:**
```jsx
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'

const Drawer = ({ isOpen, onClose, side = 'left', width = '280px', children }) => {
  // Bloquear scroll do body quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])
  
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: side === 'left' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'left' ? '-100%' : '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ width }}
            className={cn(
              'fixed top-0 z-50 h-full bg-background shadow-xl',
              side === 'left' ? 'left-0' : 'right-0'
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
```

---

### Componentes do Projeto

#### MainLayout.jsx (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/components/layouts/MainLayout/MainLayout.jsx`

Gerenciar estado do drawer mobile:

```jsx
import { useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Sidebar from './Sidebar/Sidebar'
import Drawer from '@/design-system/components/overlays/Drawer'
import Header from './Header/Header'

const MainLayout = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')
  
  return (
    <div className="flex h-screen">
      {/* Desktop: Sidebar fixa */}
      {!isMobile && <Sidebar />}
      
      {/* Mobile: Drawer */}
      {isMobile && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          <Sidebar 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
          />
        </Drawer>
      )}
      
      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col">
        <Header onMenuClick={() => setIsDrawerOpen(true)} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

#### Header.jsx (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/components/layouts/Header/Header.jsx`

Adicionar botão hambúrguer (mobile):

```jsx
import { Menu } from 'lucide-react'
import { IconButton } from '@/design-system/components'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const Header = ({ onMenuClick }) => {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4">
      {/* Botão hambúrguer (só mobile) */}
      {isMobile && (
        <IconButton
          icon={Menu}
          onClick={onMenuClick}
          variant="ghost"
          aria-label="Abrir menu"
        />
      )}
      
      {/* Resto do header (logo, busca, notificações, etc.) */}
      <div className="flex flex-1 items-center justify-between">
        {/* ... */}
      </div>
    </header>
  )
}
```

---

#### Sidebar.jsx (EXISTENTE — MODIFICAR)

Adicionar prop `onClose` para fechar drawer ao clicar em item:

```jsx
const Sidebar = ({ isOpen, onClose }) => {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  
  // Ao navegar: fecha drawer em mobile
  const handleNavigate = (path) => {
    navigate(path)
    if (isMobile && onClose) {
      onClose()
    }
  }
  
  // Passar handleNavigate para SidebarItem
  // ...
}
```

---

### Hooks

#### useMediaQuery (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/hooks/useMediaQuery.js`

Hook para detectar breakpoints:

```javascript
import { useState, useEffect } from 'react'

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [matches, query])
  
  return matches
}

// Uso:
const isMobile = useMediaQuery('(max-width: 1024px)')
```

---

## 🚫 Regras de Negócio

* Mobile (<1024px): usa drawer (overlay)
* Desktop (>=1024px): usa sidebar fixa colapsável
* Drawer tem 280px de largura (igual à sidebar expandida)
* Backdrop tem opacity 50% (black)
* Ao navegar: fecha drawer automaticamente em mobile
* Body scroll bloqueado enquanto drawer aberto
* Swipe para fechar (opcional, melhoria de UX)

---

## 🛠️ Refinamento

* **Animações**: Framer Motion para slide-in/out suave
* **Portal**: Usar `createPortal` para renderizar drawer no body (z-index correto)
* **Bloqueio de scroll**: `document.body.style.overflow = 'hidden'`
* **Cleanup**: Restaurar scroll ao desmontar
* **Backdrop**: Clicar fecha o drawer
* **Swipe**: Usar biblioteca como `react-swipeable` ou gestures do Framer Motion

---

## [STORY FRONTEND] MainLayout e Integração

Tipo:        Story  
Prioridade:  🔺 Highest  
Sprint:      (preencher)  
Categoria:   Frontend  
Relator:     (preencher)  
Pai:         [FEATURE] Responsividade e Estados  
Data Limite: (preencher)

---

### 📝 Descrição

Como desenvolvedor, eu quero um componente MainLayout que integre Sidebar, Header e conteúdo principal, para que todas as páginas logadas do Pulso usem o mesmo layout consistente.

---

## ✅ Critérios de Aceite

### Cenário 1 — Renderizar Layout Completo

**Dado** que uma página usa `<MainLayout>`  
**Quando** a página renderiza  
**Então**:
- Desktop: Sidebar fixa à esquerda + Header no topo + Conteúdo à direita
- Mobile: Header com hambúrguer + Conteúdo full-width + Drawer (quando aberto)
- Layout responsivo e adaptável

---

### Cenário 2 — Páginas que Usam MainLayout

**Dado** que as seguintes páginas existem  
**Quando** o usuário navega para elas  
**Então** todas usam `<MainLayout>`:
- Dashboard (`/dashboard`)
- Transações (`/transactions`)
- Metas (`/goals`)
- Viagens (`/trips`)
- Insights (`/insights`)
- Chatbot (`/chatbot`)
- Relatórios (`/reports`)
- Perfil (`/profile`)
- Configurações (`/settings`)
- ... (todas as páginas logadas)

---

### Cenário 3 — Páginas que NÃO Usam MainLayout

**Dado** que as seguintes páginas existem  
**Quando** o usuário navega para elas  
**Então** NÃO usam `<MainLayout>` (têm layout próprio):
- Homepage (`/`) — landing page
- Login (`/login`)
- Cadastro (`/register`)
- Recuperação de senha (`/forgot-password`)
- Reset de senha (`/reset-password/:token`)
- Verificação de email (`/verify-email/:token`)
- Termos de Uso (`/terms-of-use`)
- Política de Privacidade (`/privacy-policy`)

---

### Cenário 4 — Proteção de Rotas (PrivateRoute)

**Dado** que o usuário NÃO está autenticado  
**Quando** tenta acessar `/dashboard`  
**Então**:
- É redirecionado para `/login`
- Exibe toast: "Você precisa estar logado para acessar esta página"

**Dado** que o usuário ESTÁ autenticado  
**Quando** acessa `/dashboard`  
**Então**:
- Renderiza normalmente com MainLayout

---

### Cenário 5 — Scroll Independente

**Dado** que o conteúdo principal é longo  
**Quando** o usuário scrolla  
**Então**:
- Sidebar permanece fixa (não scrolla)
- Header permanece fixo (não scrolla)
- Apenas o conteúdo principal scrolla

---

### Cenário 6 — Redimensionamento de Tela

**Dado** que o usuário está em desktop com sidebar expandida  
**Quando** redimensiona a janela para mobile (< 1024px)  
**Então**:
- Sidebar some (vira drawer)
- Header exibe botão hambúrguer
- Layout se reorganiza responsivamente

---

## 🎨 Visual e UX

### Estrutura do MainLayout (Desktop)

```
┌──────────┬────────────────────────────────────┐
│          │ Header (fixo, 64px altura)         │
│          ├────────────────────────────────────┤
│ Sidebar  │                                    │
│ (280px)  │     Conteúdo Principal             │
│ fixa     │     (scrollável)                   │
│          │                                    │
│          │                                    │
└──────────┴────────────────────────────────────┘
```

### Estrutura do MainLayout (Mobile)

```
┌────────────────────────────────────────────┐
│ Header (hambúrguer + logo + perfil)       │
├────────────────────────────────────────────┤
│                                            │
│     Conteúdo Principal                     │
│     (full-width, scrollável)               │
│                                            │
│                                            │
└────────────────────────────────────────────┘
```

---

## ⚙️ Integração Técnica

### Componentes

#### MainLayout.jsx (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/components/layouts/MainLayout/MainLayout.jsx`

Implementação completa:

```jsx
import { useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import Sidebar from './Sidebar/Sidebar'
import Header from './Header/Header'
import Drawer from '@/design-system/components/overlays/Drawer'

const MainLayout = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar (Desktop) */}
      {!isMobile && <Sidebar />}
      
      {/* Drawer (Mobile) */}
      {isMobile && (
        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </Drawer>
      )}
      
      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setIsDrawerOpen(true)} isMobile={isMobile} />
        
        {/* Main content (scrollável) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
```

---

#### PrivateRoute/ (NOVO — CRIAR)

**Criar em:** `Codigo/Pulso/web/src/components/PrivateRoute.jsx`

Componente para proteger rotas privadas:

```jsx
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  
  if (!isAuthenticated) {
    toast.error('Você precisa estar logado para acessar esta página')
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default PrivateRoute
```

---

### Rotas (App.jsx)

#### App.jsx (EXISTENTE — MODIFICAR)

**Arquivo:** `Codigo/Pulso/web/src/App.jsx`

Estrutura de rotas com React Router v6:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layouts/MainLayout/MainLayout'
import PrivateRoute from '@/components/PrivateRoute'

// Páginas públicas
import Homepage from '@/pages/Homepage'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import VerifyEmail from '@/pages/VerifyEmail'

// Páginas privadas
import Dashboard from '@/pages/Dashboard'
import Transactions from '@/pages/Transactions'
import Goals from '@/pages/Goals'
import Trips from '@/pages/Trips'
import Insights from '@/pages/Insights'
import Chatbot from '@/pages/Chatbot'
import Reports from '@/pages/Reports'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
// ... demais páginas

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas (sem layout) */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        
        {/* Rotas privadas (com MainLayout) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <MainLayout>
                <Transactions />
              </MainLayout>
            </PrivateRoute>
          }
        />
        {/* ... demais rotas privadas */}
        
        {/* Redirect raiz logada */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 🚫 Regras de Negócio

* Todas as páginas logadas usam MainLayout
* Páginas de autenticação (login, cadastro, etc.) NÃO usam MainLayout
* Rotas privadas protegidas com PrivateRoute
* Usuário não autenticado → redireciona para /login
* Sidebar fixa em desktop, drawer em mobile
* Header fixo em ambos os casos
* Conteúdo principal scrollável independente

---

## 🛠️ Refinamento

* **Proteção de Rotas**: Usar PrivateRoute wrapper
* **Estado Auth**: Redux (`state.auth.isAuthenticated`)
* **Responsividade**: useMediaQuery para detectar mobile
* **Container**: Usar classe `container mx-auto` para centralizar conteúdo
* **Padding**: Adaptar padding por breakpoint (p-4 mobile, p-8 desktop)

---

# 🎉 Conclusão do Epic

Este Epic cobre toda a implementação da Sidebar de Navegação do Pulso, incluindo estados colapsado/expandido, submenus dropdown, busca, versão mobile com drawer, e integração completa com MainLayout.

## ✅ Checklist de Implementação

### Design System
- [ ] Criar componente `Drawer` genérico
- [ ] Criar componente `Tooltip` (se não existir)

### Componentes do Projeto
- [ ] Implementar `Sidebar.jsx` completo
- [ ] Implementar `SidebarItem.jsx` com dropdown
- [ ] Implementar `UserInfoCard.jsx`
- [ ] Implementar `Logo.jsx`
- [ ] Implementar `EmptySearchState.jsx`
- [ ] Implementar `MainLayout.jsx` completo
- [ ] Implementar `PrivateRoute.jsx`
- [ ] Modificar `Header.jsx` (adicionar hambúrguer mobile)

### Utilitários
- [ ] Criar `iconResolver.js` (resolver ícones Lucide)
- [ ] Criar `useMediaQuery.js` hook
- [ ] Criar `normalizeString.js` (opcional, para busca sem acentos)

### Estados e Lógica
- [ ] Implementar lógica de colapso/expansão
- [ ] Implementar persistência no localStorage
- [ ] Implementar abertura/fechamento de submenus (accordion)
- [ ] Implementar busca com filtro em tempo real
- [ ] Implementar highlight de item ativo (baseado na rota)
- [ ] Implementar drawer mobile com backdrop

### Rotas
- [ ] Configurar todas as rotas no `App.jsx`
- [ ] Proteger rotas privadas com `PrivateRoute`
- [ ] Testar navegação entre páginas
- [ ] Testar logout (limpa estado e redireciona)

### Estilos
- [ ] Implementar variantes CSS com `cva`
- [ ] Testar modo claro e escuro
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Implementar animações suaves (slide, fade)

### Testes
- [ ] Testes unitários: `Sidebar.spec.jsx`
- [ ] Testes unitários: `SidebarItem.spec.jsx`
- [ ] Testes de integração: navegação completa
- [ ] Testes E2E: fluxo de login → dashboard → navegação

---

## 📊 Estimativa de Esforço

| Story | Complexidade | Estimativa |
|---|---|---|
| [STORY FRONTEND] Sidebar Colapsável e Header | Média | 4h |
| [STORY FRONTEND] Sistema de Submenus Dropdown | Alta | 6h |
| [STORY FRONTEND] Busca de Itens | Média | 3h |
| [STORY FRONTEND] Drawer Mobile | Média | 4h |
| [STORY FRONTEND] MainLayout e Integração | Alta | 5h |
| **TOTAL** | — | **22h** (~3 dias) |

---

## 🚀 Próximos Passos Sugeridos

Após concluir este Epic, recomenda-se:

1. **Implementar Header Completo** — Com busca global, notificações, streak, score
2. **Implementar Dashboard** — Tela principal com widgets e resumos
3. **Implementar Páginas de Conteúdo** — Transações, Metas, etc.
4. **Configurar Testes E2E** — Cypress ou Playwright para navegação
5. **Otimizar Performance** — Lazy loading de páginas, code splitting

---

**Fim do Epic de Sidebar** 🎉
