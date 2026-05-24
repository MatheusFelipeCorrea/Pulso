# 🎨 Design System

Biblioteca de componentes UI genéricos, reutilizáveis e agnósticos de projeto. Funciona com qualquer sistema que use React + Tailwind CSS. Basta copiar a pasta e sobrescrever os tokens de cor.

---

## 🗂️ Índice

- [Filosofia](#-filosofia)
- [Como usar em outro projeto](#-como-usar-em-outro-projeto)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Tokens (Temas)](#-tokens-temas)
- [Componentes](#-componentes)
- [Hooks Genéricos](#-hooks-genéricos)
- [Utils](#-utils)

---

## 🧠 Filosofia

| Regra | Descrição |
|---|---|
| ❌ Não conhece negócio | Nunca importa nada de fora da pasta design-system |
| ❌ Não acessa store | Sem Redux, sem contextos de projeto |
| ❌ Não faz HTTP | Sem axios, sem fetch, sem services |
| ✅ Recebe tudo via props | Dados, callbacks, estados — tudo vem de fora |
| ✅ Usa CSS variables | Cores e tokens via variáveis CSS (plug & play) |
| ✅ É portável | Copia a pasta pra outro projeto e funciona |

---

## 🚀 Como usar em outro projeto

1. Copie a pasta `design-system/` para o `src/` do novo projeto
2. Importe os estilos base no seu `globals.css`:

```css
@import "../design-system/styles/tokens.css";
@import "../design-system/styles/base.css";
@import "../design-system/styles/animations.css";
```

3. Sobrescreva os tokens com as cores do seu projeto:

```css
:root {
--ds-color-primary: #SUA_COR;
--ds-color-background: #SUA_COR;
/* ... */
}
```

4. Importe e use os componentes:

```jsx
import { Button, InputText, Select } from '@/design-system/components'
```

Pronto. Todos os componentes respeitam as novas cores automaticamente.

---

## 📁 Estrutura de Pastas

```
design-system/
├── components/
│   ├── inputs/
│   │   ├── InputText/
│   │   │   ├── InputText.jsx
│   │   │   └── InputText.styles.jsx
│   │   ├── InputPassword/
│   │   ├── InputMoney/
│   │   ├── InputNumber/
│   │   ├── InputSearch/
│   │   ├── Textarea/
│   │   └── index.js
│   │
│   ├── selects/
│   │   ├── Select/
│   │   ├── SelectSearch/
│   │   ├── MultiSelect/
│   │   ├── MultiSelectSearch/
│   │   ├── TagsInput/
│   │   └── index.js
│   │
│   ├── pickers/
│   │   ├── DatePicker/
│   │   ├── DateRangePicker/
│   │   ├── MonthPicker/
│   │   ├── TimePicker/
│   │   └── index.js
│   │
│   ├── buttons/
│   │   ├── Button/
│   │   ├── IconButton/
│   │   └── index.js
│   │
│   ├── feedback/
│   │   ├── Toast/
│   │   ├── Alert/
│   │   ├── Spinner/
│   │   ├── Skeleton/
│   │   ├── EmptyState/
│   │   ├── ErrorState/
│   │   └── index.js
│   │
│   ├── data-display/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── ProgressBar/
│   │   ├── ProgressCircle/
│   │   ├── Table/
│   │   ├── Tooltip/
│   │   ├── Card/
│   │   └── index.js
│   │
│   ├── navigation/
│   │   ├── Tabs/
│   │   ├── Breadcrumbs/
│   │   ├── Pagination/
│   │   └── index.js
│   │
│   ├── overlays/
│   │   ├── Modal/
│   │   ├── Drawer/
│   │   ├── Dropdown/
│   │   └── index.js
│   │
│   ├── forms/
│   │   ├── Toggle/
│   │   ├── Checkbox/
│   │   ├── Radio/
│   │   ├── FormField/
│   │   └── index.js
│   │
│   └── index.js              ← exporta TUDO
│
├── hooks/
│   ├── useTheme.js
│   ├── useMediaQuery.js
│   ├── useClickOutside.js
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   ├── useKeyboard.js
│   ├── useCopyToClipboard.js
│   ├── useToggle.js
│   └── index.js
│
├── utils/
│   ├── cn.js
│   ├── formatCurrency.js
│   ├── formatDate.js
│   ├── formatNumber.js
│   └── index.js
│
├── styles/
│   ├── tokens.css
│   ├── base.css
│   └── animations.css
│
└── README.md
```

---

## 🎨 Tokens (Temas)

Os componentes usam variáveis CSS ao invés de cores hardcoded. O projeto que consome o design system define os valores.

### tokens.css (variáveis genéricas)

```css
:root {
/* Cores semânticas — o projeto DEVE sobrescrever */
--ds-color-primary: ;
--ds-color-primary-light: ;
--ds-color-primary-dark: ;
--ds-color-background: ;
--ds-color-surface: ;
--ds-color-text: ;
--ds-color-text-secondary: ;
--ds-color-border: ;
--ds-color-input-bg: ;
--ds-color-hover: ;
--ds-color-success: ;
--ds-color-danger: ;
--ds-color-warning: ;
--ds-color-info: ;

/* Spacing */
--ds-space-1: 4px;
--ds-space-2: 8px;
--ds-space-3: 12px;
--ds-space-4: 16px;
--ds-space-5: 20px;
--ds-space-6: 24px;
--ds-space-8: 32px;
--ds-space-10: 40px;
--ds-space-12: 48px;

/* Radius */
--ds-radius-sm: 4px;
--ds-radius-md: 8px;
--ds-radius-lg: 12px;
--ds-radius-xl: 16px;
--ds-radius-full: 999px;

/* Font */
--ds-font-sans: ;
--ds-font-mono: ;
--ds-font-size-xs: 12px;
--ds-font-size-sm: 14px;
--ds-font-size-md: 16px;
--ds-font-size-lg: 18px;
--ds-font-size-xl: 24px;
--ds-font-size-2xl: 32px;

/* Shadows */
--ds-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--ds-shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--ds-shadow-lg: 0 10px 15px rgba(0,0,0,0.15);

/* Transitions */
--ds-transition-fast: 150ms ease;
--ds-transition-normal: 200ms ease;
--ds-transition-slow: 300ms ease;

/* Z-index */
--ds-z-dropdown: 100;
--ds-z-modal: 200;
--ds-z-toast: 300;
--ds-z-tooltip: 400;
}
```

### Exemplo de tema (Pulso)

```css
:root {
--ds-color-primary: #7C3AED;
--ds-color-primary-light: #A78BFA;
--ds-color-primary-dark: #5B21B6;
--ds-color-background: #FAFAFA;
--ds-color-surface: #F4F4F5;
--ds-color-text: #18181B;
--ds-color-text-secondary: #71717A;
--ds-color-border: #E4E4E7;
--ds-color-input-bg: #FFFFFF;
--ds-color-hover: #F4F4F5;
--ds-color-success: #10B981;
--ds-color-danger: #EF4444;
--ds-color-warning: #F59E0B;
--ds-color-info: #3B82F6;
--ds-font-sans: 'Inter', sans-serif;
--ds-font-mono: 'JetBrains Mono', monospace;
}

.dark {
--ds-color-primary: #A78BFA;
--ds-color-primary-light: #C4B5FD;
--ds-color-primary-dark: #7C3AED;
--ds-color-background: #09090B;
--ds-color-surface: #18181B;
--ds-color-text: #FAFAFA;
--ds-color-text-secondary: #A1A1AA;
--ds-color-border: #27272A;
--ds-color-input-bg: #27272A;
--ds-color-hover: #27272A;
--ds-color-success: #34D399;
--ds-color-danger: #F87171;
--ds-color-warning: #FBBF24;
--ds-color-info: #60A5FA;
}
```

---

## 🧩 Componentes

### Inputs

| Componente | Props principais | Descrição |
|---|---|---|
| InputText | label, placeholder, value, onChange, error, disabled, icon | Campo de texto padrão |
| InputPassword | label, value, onChange, error, showToggle | Senha com toggle de visibilidade |
| InputMoney | label, value, onChange, error, currency, locale | Monetário com máscara automática |
| InputNumber | label, value, onChange, min, max, step | Numérico com botões +/- |
| InputSearch | placeholder, value, onChange, onClear | Busca com ícone e clear |
| Textarea | label, value, onChange, error, maxLength, rows | Texto multilinha com contador |

### Selects

| Componente | Props principais | Descrição |
|---|---|---|
| Select | options, value, onChange, placeholder, error | Dropdown simples (single) |
| SelectSearch | options, value, onChange, searchPlaceholder | Dropdown com campo de busca |
| MultiSelect | options, values, onChange, placeholder | Múltipla seleção sem busca |
| MultiSelectSearch | options, values, onChange, searchPlaceholder | Múltipla seleção com busca |
| TagsInput | tags, onAdd, onRemove, placeholder, max | Input de chips/tags |

### Pickers

| Componente | Props principais | Descrição |
|---|---|---|
| DatePicker | value, onChange, minDate, maxDate, placeholder | Seletor de data única |
| DateRangePicker | startDate, endDate, onChange, presets | Seletor de período |
| MonthPicker | value, onChange, minYear, maxYear | Seletor de mês/ano |
| TimePicker | value, onChange, format, minuteStep | Seletor de hora |

### Buttons

| Componente | Props principais | Descrição |
|---|---|---|
| Button | variant, size, loading, disabled, icon, children | Botão com variantes (primary, secondary, ghost, danger, success) |
| IconButton | icon, variant, size, tooltip | Botão circular só com ícone |

### Feedback

| Componente | Props principais | Descrição |
|---|---|---|
| Toast | type, title, message, duration, onClose | Notificação temporária (success, error, warning, info) |
| Alert | type, title, message, closable | Banner de alerta inline |
| Spinner | size, color | Indicador de loading circular |
| Skeleton | width, height, variant | Placeholder de carregamento |
| EmptyState | icon, title, description, action | Estado vazio com CTA |
| ErrorState | icon, title, description, onRetry | Estado de erro com retry |

### Data Display

| Componente | Props principais | Descrição |
|---|---|---|
| Badge | variant, color, size, children | Tag/etiqueta colorida |
| Avatar | src, name, size, status | Imagem de perfil com fallback de iniciais |
| ProgressBar | value, max, color, size, label | Barra de progresso linear |
| ProgressCircle | value, max, color, size, label | Barra de progresso circular |
| Table | columns, data, sortable, onSort, loading | Tabela com sort e loading |
| Tooltip | content, position, delay, children | Dica flutuante |
| Card | header, footer, padding, hoverable, children | Container com variantes |

### Navigation

| Componente | Props principais | Descrição |
|---|---|---|
| Tabs | items, active, onChange, variant | Tabs (underline, pills, com contador) |
| Breadcrumbs | items, separator | Navegação hierárquica |
| Pagination | total, current, perPage, onChange | Paginação numérica |

### Overlays

| Componente | Props principais | Descrição |
|---|---|---|
| Modal | isOpen, onClose, title, size, children | Modal com overlay |
| Drawer | isOpen, onClose, position, size, children | Painel lateral deslizante |
| Dropdown | trigger, items, align | Menu suspenso |

### Forms

| Componente | Props principais | Descrição |
|---|---|---|
| Toggle | checked, onChange, label, description, disabled | Switch on/off |
| Checkbox | checked, onChange, label, indeterminate, error | Caixa de seleção |
| Radio | value, selected, onChange, label, description | Botão de opção |
| FormField | label, error, required, description, children | Wrapper: label + input + error msg |

---

## 🪝 Hooks Genéricos

| Hook | Retorno | Descrição |
|---|---|---|
| useTheme | { theme, toggleTheme, setTheme } | Controla tema dark/light |
| useMediaQuery | boolean | Detecta breakpoints (mobile, tablet, desktop) |
| useClickOutside | ref | Detecta clique fora de um elemento |
| useDebounce | debouncedValue | Atrasa atualização de valor (busca) |
| useLocalStorage | [value, setValue] | Lê/escreve no localStorage |
| useKeyboard | — | Escuta atalhos de teclado (Esc, Enter, etc.) |
| useCopyToClipboard | { copy, copied } | Copia texto para clipboard |
| useToggle | [isOpen, toggle, open, close] | Toggle booleano simples |

---

## 🔧 Utils

| Função | Uso | Descrição |
|---|---|---|
| cn(...classes) | `cn('base', condition && 'active')` | Merge de classnames (compatível com Tailwind) |
| formatCurrency(value, locale, currency) | `formatCurrency(1500, 'pt-BR', 'BRL')` → "R$ 1.500,00" | Formata valor monetário |
| formatDate(date, format) | `formatDate(date, 'DD/MM/YYYY')` → "22/04/2026" | Formata data |
| formatNumber(value, options) | `formatNumber(1500)` → "1.500" | Formata número com separadores |

---

## 📐 Convenções

| Convenção | Padrão |
|---|---|
| Nomenclatura de componente | PascalCase (InputText, DatePicker) |
| Nomenclatura de arquivo | PascalCase (InputText.jsx) |
| Estilos | NomeComponente.styles.jsx |
| Exportação | Named exports (não default) |
| Props | Destructuring no parâmetro |
| CSS variables | Prefixo `--ds-` |
| Testes | NomeComponente.spec.jsx |

---

## 🧪 Testando componentes

```jsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/design-system/components'

test('renders button with text', () => {
render(<Button>Click me</Button>)
expect(screen.getByText('Click me')).toBeInTheDocument()
})

test('shows spinner when loading', () => {
render(<Button loading>Click me</Button>)
expect(screen.getByRole('status')).toBeInTheDocument()
})
```

---

## ✅ Checklist para copiar pro próximo projeto

- [ ] Copiar pasta `design-system/` para `src/`
- [ ] Importar estilos no `globals.css`
- [ ] Sobrescrever tokens com cores do novo projeto
- [ ] Configurar alias `@/design-system` no vite/webpack
- [ ] Instalar dependências peer: `react`, `tailwindcss`, `lucide-react`, `date-fns`
- [ ] Pronto!