# [EPIC] Design System — Pulso

```
Tipo:        Epic
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         —
Data Limite: (preencher)
```

## Descrição

Implementação completa do Design System do Pulso — biblioteca de componentes UI dividida em duas camadas:

**Camada Genérica (`src/design-system/`)** — componentes agnósticos de projeto, portáveis, que não conhecem regras de negócio, não acessam store e não fazem HTTP. Recebem tudo via props. Usam CSS variables para temas (plug & play em qualquer projeto React + Tailwind).

**Camada Pulso (`src/components/`)** — componentes que consomem o design-system genérico e adicionam contexto de negócio: mensagens específicas por entidade, acesso à store Redux, integrações com serviços.

**Regras absolutas do design-system genérico:**
- ❌ Nunca importa nada de fora de `src/design-system/`
- ❌ Nunca acessa Redux, Context ou store
- ❌ Nunca faz chamadas HTTP
- ✅ Recebe tudo via props
- ✅ Cores via CSS variables (`--ds-color-*`)
- ✅ Suporte a dark/light mode via classe `.dark` no `<html>`

**Módulos deste Epic:**
1. **Fundação** — tokens, estilos base, animações, hooks genéricos, utils
2. **Inputs & Selectors** — InputText, InputPassword, InputMoney, InputNumber, InputSearch, Textarea, Select, SelectSearch, MultiSelect, MultiSelectSearch, TagsInput, Pickers
3. **Modais de Confirmação** — ConfirmModal genérico + wrappers Pulso por entidade
4. **Botões e Ações** — Button (5 variantes × 3 tamanhos × 5 estados) + IconButton circular
5. **Feedback e Alertas** — Toast (4 tipos, progress bar, stacking), Alert, Spinner, Skeleton
6. **Estados Vazios e de Erro** — EmptyState genérico + wrappers Pulso (transações, metas, grupos, busca, filtro)
7. **Exibição de Dados** — Avatar, AvatarGroup, Badge, Tooltip, Card (+ accent variant), ProgressBar, ProgressCircle, Table + ResourceCard Pulso
8. **Navegação e Fluxo** — Tabs, Breadcrumbs, Pagination
9. **Sobreposições** — Drawer, Dropdown
10. **Painel de Notificações Pulso** — NotificationPanel (13 tipos, Pulso-specific)

---

# [FEATURE] Fundação do Design System

```
Tipo:        Feature
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [EPIC] Design System — Pulso
Data Limite: (preencher)
```

Implementação da camada base do design system: tokens de design (CSS variables), estilos globais, animações, hook de tema dark/light, e utilitários genéricos. **Pré-requisito de todos os outros Stories.**

---

# [STORY] Tokens CSS, Estilos Base e Animações

```
Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Fundação do Design System
Data Limite: (preencher)
```

## 📝 Descrição

Como sistema, eu quero que todos os componentes do design-system usem variáveis CSS centralizadas, para que a troca de tema (dark/light) e a portabilidade para outros projetos funcionem sem alterar nenhum componente individualmente.

---

## ✅ Critérios de Aceite

### Cenário 1 — Modo claro ativo por padrão
**Dado** que o usuário acessa a aplicação sem preferência salva,
**Quando** o HTML é renderizado,
**Então** os tokens do modo claro estão ativos (background `#FAFAFA`, surface `#F4F4F5`, etc.).

### Cenário 2 — Modo escuro ativado
**Dado** que a classe `.dark` é adicionada ao `<html>`,
**Quando** qualquer componente do design-system é renderizado,
**Então** ele exibe automaticamente as cores do modo escuro sem alteração de código.

### Cenário 3 — Portabilidade
**Dado** que outro projeto copia a pasta `design-system/`,
**Quando** ele sobrescreve os tokens em seu próprio CSS,
**Então** todos os componentes respeitam as novas cores automaticamente.

### Cenário 4 — Animações disponíveis
**Dado** que um componente usa `animate-fade-in` ou `animate-slide-up`,
**Quando** ele é montado no DOM,
**Então** a animação é executada suavemente.

---

## 🛠️ Implementação

### `tokens.css` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/styles/tokens.css`

Variáveis CSS — modo claro em `:root`, modo escuro em `.dark`:

```css
/* Cores principais */
--ds-color-primary          → light: #7C3AED  | dark: #A78BFA
--ds-color-primary-light    → light: #A78BFA  | dark: #C4B5FD
--ds-color-primary-dark     → light: #5B21B6  | dark: #7C3AED

/* Background e superfície */
--ds-color-background       → light: #FAFAFA  | dark: #09090B
--ds-color-surface          → light: #F4F4F5  | dark: #18181B

/* Texto */
--ds-color-text             → light: #18181B  | dark: #FAFAFA
--ds-color-text-secondary   → light: #71717A  | dark: #A1A1AA

/* Bordas */
--ds-color-border           → light: #E4E4E7  | dark: #27272A

/* Inputs */
--ds-color-input-bg         → light: #FFFFFF  | dark: #27272A
--ds-color-input-border     → light: #E4E4E7  | dark: #27272A
--ds-color-input-focus      → light: #7C3AED  | dark: #7C3AED
--ds-color-placeholder      → light: #A1A1AA  | dark: #71717A
--ds-color-input-disabled   → light: #F4F4F5  | dark: #18181B
--ds-color-hover            → light: #F4F4F5  | dark: #27272A

/* Semânticas */
--ds-color-success          → light: #10B981  | dark: #34D399
--ds-color-danger           → light: #EF4444  | dark: #F87171
--ds-color-warning          → light: #F59E0B  | dark: #FBBF24
--ds-color-info             → light: #3B82F6  | dark: #60A5FA

/* Overlay / Modal */
--ds-color-overlay          → light: rgba(0,0,0,0.4)  | dark: rgba(0,0,0,0.6)
--ds-color-modal-bg         → light: #FFFFFF           | dark: #18181B

/* Spacing */
--ds-space-1: 4px  | --ds-space-2: 8px  | --ds-space-3: 12px
--ds-space-4: 16px | --ds-space-5: 20px | --ds-space-6: 24px
--ds-space-8: 32px | --ds-space-10: 40px| --ds-space-12: 48px

/* Border radius */
--ds-radius-sm: 4px | --ds-radius-md: 8px | --ds-radius-lg: 12px
--ds-radius-xl: 16px | --ds-radius-full: 999px

/* Typography */
--ds-font-sans: (projeto define) | --ds-font-mono: (projeto define)
--ds-font-size-xs: 12px | --ds-font-size-sm: 14px | --ds-font-size-md: 16px
--ds-font-size-lg: 18px | --ds-font-size-xl: 24px | --ds-font-size-2xl: 32px

/* Sombras */
--ds-shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--ds-shadow-md: 0 4px 6px rgba(0,0,0,0.1)
--ds-shadow-lg: 0 10px 15px rgba(0,0,0,0.15)

/* Transições */
--ds-transition-fast: 150ms ease
--ds-transition-normal: 200ms ease
--ds-transition-slow: 300ms ease

/* Z-index */
--ds-z-dropdown: 100 | --ds-z-modal: 200
--ds-z-toast: 300    | --ds-z-tooltip: 400
```

### `base.css` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/styles/base.css`

→ Reset CSS minimalista (box-sizing, margin 0, padding 0)
→ `body`: `background-color: var(--ds-color-background)`, `color: var(--ds-color-text)`, font-family via token
→ Scrollbar customizada (dark/light)
→ `*:focus-visible`: outline usando `--ds-color-primary`
→ Seleção de texto: background `--ds-color-primary` com opacidade

### `animations.css` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/styles/animations.css`

Keyframes a implementar:
→ `@keyframes fade-in`: opacity 0 → 1
→ `@keyframes fade-out`: opacity 1 → 0
→ `@keyframes slide-up`: translateY(8px) opacity 0 → translateY(0) opacity 1
→ `@keyframes slide-down`: translateY(-8px) opacity 0 → translateY(0) opacity 1
→ `@keyframes scale-in`: scale(0.95) opacity 0 → scale(1) opacity 1
→ `@keyframes shake`: translateX oscillation (para erros de validação)
→ Classes utilitárias: `.animate-fade-in`, `.animate-slide-up`, `.animate-scale-in`, `.animate-shake`
→ `duration-fast` (150ms), `duration-normal` (200ms), `duration-slow` (300ms)

### `main.jsx` / entry CSS (NOTA)

> Verificar em: `src/main.jsx` — importar os 3 arquivos de estilo:
```js
import './design-system/styles/tokens.css'
import './design-system/styles/base.css'
import './design-system/styles/animations.css'
```

---

## 🚫 Regras de Negócio
* NUNCA usar cores hexadecimais hardcoded nos componentes do design-system — sempre `var(--ds-color-*)`
* O projeto Pulso DEVE sobrescrever os tokens em seu próprio arquivo CSS global
* A classe `.dark` deve ser aplicada no `<html>` (não no `<body>`) para garantir que overlays e portals sejam afetados

---

# [STORY] Hooks e Utils Genéricos

```
Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Fundação do Design System
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero um conjunto de hooks e utilitários genéricos prontos para uso, para que eu não precise reimplementar lógicas comuns (tema, debounce, clipboard, etc.) em cada componente ou feature.

---

## ✅ Critérios de Aceite

### Cenário 1 — useTheme persiste preferência
**Dado** que o usuário troca para modo escuro,
**Quando** ele recarrega a página,
**Então** o modo escuro continua ativo (lido do localStorage via `useLocalStorage`).

### Cenário 2 — cn() compõe classes corretamente
**Dado** que um componente chama `cn('base', condition && 'active', 'other')`,
**Quando** `condition` é `false`,
**Então** retorna `'base other'` sem classes falsas ou conflitos Tailwind.

### Cenário 3 — formatCurrency formata em BRL
**Dado** que `formatCurrency(1500.5, 'pt-BR', 'BRL')` é chamado,
**Quando** executado,
**Então** retorna `'R$ 1.500,50'`.

### Cenário 4 — useDebounce atrasa atualização
**Dado** que um input chama `useDebounce(value, 300)`,
**Quando** o valor muda rapidamente,
**Então** o valor debounced só é atualizado após 300ms de inatividade.

### Cenário 5 — useClickOutside detecta clique externo
**Dado** que um dropdown está aberto e tem um ref registrado,
**Quando** o usuário clica fora do elemento,
**Então** o callback `onOutside` é chamado.

---

## 🛠️ Implementação

### `cn.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/utils/cn.js`

```js
// Combina clsx + tailwind-merge
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs) { return twMerge(clsx(inputs)) }
```

### `formatCurrency.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/utils/formatCurrency.js`

→ `formatCurrency(value, locale = 'pt-BR', currency = 'BRL')` → string formatada
→ Usa `Intl.NumberFormat`
→ Trata `null`, `undefined`, `NaN` → retorna `'—'`

### `formatDate.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/utils/formatDate.js`

→ `formatDate(date, formatStr = 'dd/MM/yyyy')` → usa `date-fns/format`
→ `formatDateRelative(date)` → "hoje", "ontem", "há 3 dias" (usa `date-fns/formatDistance`)
→ Trata datas inválidas → retorna `'—'`

### `formatNumber.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/utils/formatNumber.js`

→ `formatNumber(value, options?)` → usa `Intl.NumberFormat`
→ Trata `null`, `undefined` → retorna `'—'`

### `utils/index.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/utils/index.js`

→ Exporta: `cn`, `formatCurrency`, `formatDate`, `formatDateRelative`, `formatNumber`

---

### `useTheme.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/hooks/useTheme.js`

→ Lê tema inicial do localStorage (chave: `'ds-theme'`), fallback `'light'`
→ Aplica/remove classe `.dark` no `document.documentElement`
→ Retorna: `{ theme, toggleTheme, setTheme }`
→ Sincroniza com `prefers-color-scheme` do sistema se não houver preferência salva

### `useLocalStorage.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/hooks/useLocalStorage.js`

→ `useLocalStorage(key, initialValue)` → `[value, setValue]`
→ Serializa/deserializa JSON automaticamente
→ Trata erros de parse silenciosamente

### `useDebounce.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/hooks/useDebounce.js`

→ `useDebounce(value, delay)` → `debouncedValue`

### `useClickOutside.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/hooks/useClickOutside.js`

→ `useClickOutside(ref, callback)` → adiciona listener `mousedown` + `touchstart`
→ Remove listener no cleanup

### `useDebounce.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/hooks/useDebounce.js`

→ `useDebounce(value, delay = 300)` → `debouncedValue`

### `useMediaQuery.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/hooks/useMediaQuery.js`

→ `useMediaQuery(query)` → `boolean`
→ Exports de conveniência: `useIsMobile()` (< 768px), `useIsTablet()` (< 1024px), `useIsDesktop()` (>= 1024px)

### `useKeyboard.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/hooks/useKeyboard.js`

→ `useKeyboard(handlers)` — ex: `{ Escape: () => close(), Enter: () => confirm() }`
→ Adiciona/remove `keydown` listener no `document`

### `useCopyToClipboard.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/hooks/useCopyToClipboard.js`

→ `useCopyToClipboard()` → `{ copy(text), copied }` — `copied` vira `true` por 2s após cópia

### `useToggle.js` (NOVO — CRIAR)

> Criar em: `src/design-system/hooks/useToggle.js`
> ⚠️ Arquivo não existe ainda — mencionado no README mas não foi criado

→ `useToggle(initial = false)` → `[isOpen, toggle, open, close]`

### `hooks/index.js` (EXISTENTE — PREENCHER)

> Criar em: `src/design-system/hooks/index.js`

→ Exporta todos os hooks: `useTheme`, `useLocalStorage`, `useDebounce`, `useClickOutside`, `useMediaQuery`, `useKeyboard`, `useCopyToClipboard`, `useToggle`

---

## 🚫 Regras de Negócio
* `useTheme` é o único ponto de controle do tema — nenhum outro componente altera `document.documentElement` diretamente
* `cn()` deve ser usado em TODOS os componentes no lugar de template strings para classNames
* Utils não lançam exceções — tratam entradas inválidas com fallback silencioso

---

# [FEATURE] Inputs & Selectors

```
Tipo:        Feature
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [EPIC] Design System — Pulso
Data Limite: (preencher)
```

Implementação dos componentes de entrada de dados: inputs de texto, senha, valor monetário, número, busca, textarea, selects simples e com busca, multi-seleção, tags e pickers de data/hora.

**Dependência:** [STORY] Tokens CSS, Estilos Base e Animações deve estar concluída.

---

# [STORY] Componentes de Input

```
Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Inputs & Selectors
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero componentes de input genéricos, parametrizáveis e com suporte a dark/light mode, para que eu possa usá-los em qualquer formulário do Pulso ou de outro projeto sem hardcodar estilos.

---

## ✅ Critérios de Aceite

### Cenário 1 — InputText: estados visuais
**Dado** que um `InputText` é renderizado,
**Quando** está em cada estado,
**Então**:
* **DEFAULT**: borda `--ds-color-border`, fundo `--ds-color-input-bg`, label normal
* **FOCUS**: borda `--ds-color-input-focus` (roxo), label na cor primary, outline visível
* **FILLED**: igual ao default com valor preenchido
* **ERROR**: borda `--ds-color-danger`, label em `--ds-color-danger`, ícone de alerta (⚠) à direita, mensagem de erro abaixo em vermelho
* **DISABLED**: fundo `--ds-color-input-disabled`, texto e ícones opacos (opacity 50%), não interativo
* **COM ÍCONE**: aceita `leftIcon` e `rightIcon`; variante com botão X (clear) à direita quando `onClear` é fornecido

### Cenário 2 — InputText: dark/light automático
**Dado** que a classe `.dark` é ativada,
**Quando** o InputText é renderizado,
**Então** aplica automaticamente as cores do modo escuro via CSS variables.

### Cenário 3 — InputPassword: toggle de visibilidade
**Dado** que um `InputPassword` é renderizado,
**Quando** o usuário clica no ícone do olho,
**Então** alterna entre `type="password"` e `type="text"`, e o ícone troca de Eye para EyeOff.

### Cenário 4 — InputPassword: checklist em tempo real
**Dado** que `InputPassword` recebe `showValidation={true}` e `validationRules`,
**Quando** o usuário digita,
**Então** exibe abaixo do campo uma lista de critérios com ícone ✅ (verde) para aprovados e ❌ (vermelho) para pendentes, atualizando em tempo real.

### Cenário 5 — InputPassword: estado ERROR
**Dado** que `error` é passado ao `InputPassword`,
**Quando** renderizado,
**Então** exibe borda vermelha, ícone do olho em `--ds-color-danger` e mensagem de erro abaixo.

### Cenário 6 — InputMoney: máscara automática
**Dado** que um `InputMoney` está focado e o usuário digita `150000`,
**Quando** cada tecla é pressionada,
**Então** o valor exibido é formatado em tempo real como `1.500,00` (máscara `#.##0,00`).

### Cenário 7 — InputMoney: prefixo não editável
**Dado** que um `InputMoney` é renderizado,
**Quando** o usuário tenta editar o prefixo `R$`,
**Então** o prefixo permanece fixo à esquerda (não editável), separado por borda vertical.

### Cenário 8 — InputMoney: variante LARGE
**Dado** que `InputMoney` recebe `size="large"`,
**Quando** renderizado,
**Então** a altura é 56px, o prefixo fica centralizado acima, o valor é exibido em fonte grande centralizada — ideal para modais de aporte.

### Cenário 9 — InputMoney: texto de contexto
**Dado** que `InputMoney` recebe `helperText` e/ou `conversionText`,
**Quando** renderizado,
**Então** exibe texto auxiliar abaixo (ex: "Saldo disponível: R$ 2.356,40") e/ou conversão de moeda em azul (ex: "≈ $ 267,86 USD").

### Cenário 10 — InputMoney: valor numérico
**Dado** que o usuário digita no `InputMoney`,
**Quando** `onChange` é chamado,
**Então** retorna o valor como `number` (ex: `1500.00`), não como string formatada.

### Cenário 11 — InputNumber: layout de 3 partes
**Dado** que um `InputNumber` é renderizado,
**Quando** exibido,
**Então** apresenta 3 seções na mesma linha: botão `−` (círculo 40px) | campo numérico centralizado | botão `+` (círculo 40px), dentro de um container de 160px × 44px com borda arredondada.

### Cenário 12 — InputNumber: botões no limite
**Dado** que `InputNumber` tem `min={1}` e `max={10}`,
**Quando** o valor é igual ao mínimo,
**Então** o botão `−` fica desabilitado (opacidade reduzida, não clicável);
**Quando** o valor é igual ao máximo,
**Então** o botão `+` fica desabilitado.

### Cenário 13 — InputNumber: hover nos botões
**Dado** que o componente está habilitado,
**Quando** o cursor passa sobre o botão `−` ou `+`,
**Então** o fundo do botão muda para `--ds-color-hover` e aparece borda sutil na cor primary com opacidade 30%.

### Cenário 14 — InputNumber: componente desabilitado
**Dado** que `disabled={true}` é passado,
**Quando** renderizado,
**Então** o componente inteiro fica com opacity 0.5 e nenhuma interação é possível.

### Cenário 15 — InputSearch: botão X e limpeza
**Dado** que um `InputSearch` tem valor digitado,
**Quando** o botão X é clicado,
**Então** o campo é limpo, `onClear()` é chamado e o foco retorna ao input.

### Cenário 16 — InputSearch: dropdown de resultados
**Dado** que `InputSearch` recebe `results` e o campo tem valor,
**Quando** resultados existem,
**Então** abre um dropdown com cada resultado renderizado via `renderResult`; no rodapé do dropdown exibe link "Ver todos os resultados para '${value}'" quando `onViewAll` é fornecido.

### Cenário 17 — InputSearch: estado sem resultados
**Dado** que `results` é um array vazio após busca,
**Quando** o dropdown é exibido,
**Então** mostra ícone de busca vazio + "Nenhum resultado encontrado" + "Tente buscar por outro termo."

### Cenário 18 — InputSearch: variação compacta (sidebar)
**Dado** que `InputSearch` recebe `size="compact"`,
**Quando** renderizado,
**Então** o campo fica menor (padding reduzido, sem label), ideal para uso em sidebars.

### Cenário 19 — Textarea: contador de caracteres
**Dado** que `Textarea` recebe `maxLength={500}` e o valor tem 65 caracteres,
**Quando** renderizado,
**Então** exibe `"65/500"` no canto inferior direito em `--ds-color-text-secondary`.

### Cenário 20 — Textarea: contador próximo do limite
**Dado** que o valor tem 470 de 500 caracteres (>90%),
**Quando** o contador é exibido,
**Então** muda para a cor `--ds-color-warning` (#FBBF24).

### Cenário 21 — Textarea: contador no limite
**Dado** que o valor atingiu exatamente `maxLength`,
**Quando** o contador é exibido,
**Então** muda para `--ds-color-danger` e o input não aceita mais caracteres.

### Cenário 22 — Textarea: altura responsiva
**Dado** que um `Textarea` é renderizado,
**Quando** o usuário digita múltiplas linhas,
**Então** cresce verticalmente (resize: vertical) com min-height 100px e max-height 300px, após o qual o scroll interno é ativado.

---

## 🎨 Visual e UX

### Especificações comuns (InputText, InputPassword, InputMoney)
* **Altura padrão:** 44px
* **Padding:** 12px 16px
* **Border-radius:** 8px
* **Transição de borda:** `--ds-transition-fast` (150ms)
* **Ícones:** 20px, cor `--ds-color-placeholder` no default, `--ds-color-primary` no focus/visible, `--ds-color-danger` no error

### InputMoney — variante LARGE
* **Altura:** 56px
* **Alinhamento do valor:** à direita (default) / centralizado (large)
* **Prefixo:** separado por `border-right: 1px solid --ds-color-border`
* **Fonte large:** ~32px, peso bold

### InputPassword — checklist
* Aparece somente quando `showValidation={true}`
* Cada item: ícone (CheckCircle verde / XCircle vermelho) + texto descritivo
* Usa `--ds-color-success` e `--ds-color-danger`

### InputNumber — layout
* **Container:** 160px × 44px, border-radius 8px, borda `--ds-color-border`
* **Botões:** círculo 40px, border-radius 50%, fundo `--ds-color-input-bg`
* **Hover botão:** fundo `--ds-color-hover`, borda `rgba(var(--ds-color-primary-rgb), 0.3)` (primary com 30% opacidade)
* **Desabilitado:** botão com `--ds-color-input-disabled`, ícone `--ds-color-placeholder` (sem hover)
* **Componente disabled:** opacity 0.5 no wrapper inteiro
* **Valor:** texto centralizado, `--ds-color-text`, fonte padrão

### InputSearch — dropdown de resultados
* **Dropdown:** posição absolute abaixo do campo, borda `--ds-color-border`, fundo `--ds-color-surface`, border-radius 8px, sombra `--ds-shadow-md`
* **Cada resultado:** ícone colorido (32px) + título com keyword em `--ds-color-primary` + subtítulo em `--ds-color-text-secondary`
* **Hover linha:** `--ds-color-hover`
* **Rodapé:** separador + ícone Search + texto em `--ds-color-text-secondary` + seta → à direita
* **Estado vazio:** ícone Search grande (opacity 40%) + "Nenhum resultado encontrado" + subtítulo

### InputSearch — variação compacta
* Mesmos estados (default, focus, digitando + X)
* Padding interno menor, sem label acima

### Textarea — contador de caracteres
* **Posição:** canto inferior direito dentro do campo
* **Normal (< 90%):** `--ds-color-text-secondary`
* **Próximo do limite (≥ 90%):** `--ds-color-warning`
* **No limite (100%):** `--ds-color-danger`
* **Formato:** `"X/maxLength"` — aparece somente quando `maxLength` é fornecido
* **Resize:** somente vertical, alça de resize no canto inferior direito (cor `--ds-color-border`)

---

## 🛠️ Implementação

### `InputText/InputText.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/inputs/InputText/InputText.jsx`
> Seguir padrão de styles em: `InputText.styles.jsx`

Props:
```
label          string    — label acima do campo
placeholder    string    — texto placeholder
value          string    — valor controlado
onChange       function  — callback (event)
error          string    — mensagem de erro (ativa estado error)
disabled       boolean   — desabilita o campo
required       boolean   — marca label com asterisco
leftIcon       ReactNode — ícone à esquerda
rightIcon      ReactNode — ícone à direita
onClear        function  — se fornecido, exibe botão X e chama ao clicar
type           string    — "text" | "email" | "url" etc. (default: "text")
id             string    — id do input (acessibilidade)
className      string    — classes extras no wrapper
...rest        —         — repassados ao <input>
```

### `InputText/InputText.styles.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/inputs/InputText/InputText.styles.jsx`

→ Usar CVA para as variants do wrapper do input
→ Variants: `error` (boolean), `disabled` (boolean), `focused` (boolean)
→ Todos os valores de cor via `var(--ds-color-*)` — sem hex hardcoded

### `inputs/index.js` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/inputs/index.js`

→ Exporta: `InputText`, `InputPassword`, `InputMoney`, `InputNumber`, `InputSearch`, `Textarea`

---

### `InputPassword/InputPassword.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/inputs/InputPassword/InputPassword.jsx`
> Criar em: `src/design-system/components/inputs/InputPassword/InputPassword.styles.jsx`
> Seguir padrão de: `InputText/InputText.jsx` (quando implementado)

Props:
```
label           string    — label acima do campo
placeholder     string    — default "••••••••"
value           string    — valor controlado
onChange        function  — callback (event)
error           string    — mensagem de erro
disabled        boolean
showValidation  boolean   — exibe checklist em tempo real abaixo do campo
validationRules array     — [{ label: string, test: (value) => boolean }]
                            default: mínimo 8 chars, pelo menos 1 número, 1 maiúscula
id              string
className       string
```

Estados internos:
→ `isVisible` (boolean) — alterna type password ↔ text
→ Ícone esquerdo: `LockKeyhole` (20px, fixo)
→ Ícone direito: `Eye` / `EyeOff` (20px, clicável) — cor primary quando visível, placeholder quando oculto

Checklist (quando `showValidation={true}`):
→ Renderiza lista abaixo do campo
→ Cada item: `{ label, test(value) }` — se `test(value)` retorna true → CheckCircle verde, senão XCircle vermelho
→ Regras default exportadas como constante `DEFAULT_PASSWORD_RULES`

---

### `InputMoney/InputMoney.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/inputs/InputMoney/InputMoney.jsx`
> Criar em: `src/design-system/components/inputs/InputMoney/InputMoney.styles.jsx`

Props:
```
label          string    — label acima do campo
value          number    — valor numérico controlado (não a string formatada)
onChange       function  — (numericValue: number) => void
error          string    — mensagem de erro
disabled       boolean
size           "default" | "large"   — padrão "default"
prefix         string    — prefixo monetário, default "R$"
locale         string    — locale para formatação, default "pt-BR"
currency       string    — código de moeda, default "BRL"
helperText     string    — texto abaixo (ex: "Saldo disponível: R$ 2.356,40")
conversionText string    — texto de conversão em azul (ex: "≈ $ 267,86 USD")
placeholder    string    — default "0,00"
id             string
className      string
```

Lógica de máscara:
→ Input armazena string interna formatada; `onChange` emite `number`
→ Ao digitar: remove não-dígitos, divide por 100, formata com `Intl.NumberFormat` (minimumFractionDigits: 2)
→ Máscara: `#.##0,00` (pontos como separador de milhar, vírgula decimal)
→ Backspace: remove último dígito da string bruta antes de reformatar

Variante LARGE:
→ Height 56px, prefixo centralizado acima, valor em fonte 32px bold, centralizado
→ Border: `--ds-color-input-focus` (sempre visível na large, indicando campo principal)

---

### `InputNumber/InputNumber.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/inputs/InputNumber/InputNumber.jsx`
> Criar em: `src/design-system/components/inputs/InputNumber/InputNumber.styles.jsx`

Props:
```
label      string
value      number
onChange   (value: number) => void
min        number         — se definido, botão − desabilita ao atingir
max        number         — se definido, botão + desabilita ao atingir
step       number         — default 1
error      string
disabled   boolean        — opacity 0.5 em todo o componente
id         string
className  string
```

Layout: 3 partes horizontais em um container único
→ **Container:** 160px × 44px, border-radius 8px, border `--ds-color-border`, fundo `--ds-color-input-bg`
→ **Botão −:** círculo 40px (border-radius 50%), ícone `Minus` 16px
→ **Valor:** flex-1, texto centralizado, tipo `number`, sem spinners nativos (`-moz-appearance: textfield`, `::-webkit-inner-spin-button { display: none }`)
→ **Botão +:** círculo 40px (border-radius 50%), ícone `Plus` 16px

Estados dos botões:
→ **DEFAULT:** fundo transparente, ícone `--ds-color-text-secondary`
→ **HOVER:** fundo `--ds-color-hover`, borda sutil `rgba(primary, 0.3)` — usa `--ds-color-primary` com opacidade 30%
→ **DESABILITADO (no limite):** fundo `--ds-color-input-disabled`, ícone `--ds-color-placeholder`, sem cursor pointer, sem hover
→ **COMPONENTE DISABLED:** wrapper inteiro com `opacity: 0.5`, pointer-events none

Interações:
→ Clique no `+`: incrementa por `step`, não ultrapassa `max`
→ Clique no `−`: decrementa por `step`, não vai abaixo de `min`
→ Digitação direta: aceita número, valida `min`/`max` no `onBlur`, chama `onChange(clampedValue)`

---

### `InputSearch/InputSearch.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/inputs/InputSearch/InputSearch.jsx`
> Criar em: `src/design-system/components/inputs/InputSearch/InputSearch.styles.jsx`

Props:
```
placeholder    string      — default "Pesquisar..."
value          string
onChange       (value: string) => void
onClear        function    — chamado ao clicar X; se omitido, X não aparece
debounce       number      — ms para debounce interno (default 0 = desabilitado)
size           "default" | "compact"  — compact: padding menor, sem label, para sidebars
disabled       boolean
className      string

— Props do dropdown de resultados (opcionais — se omitidos, sem dropdown) —
results        any[]       — array de resultados a exibir
renderResult   (item, index) => ReactNode  — render customizado por item
onSelectResult (item) => void              — callback ao clicar em um resultado
onViewAll      () => void  — se fornecido, exibe rodapé "Ver todos os resultados"
viewAllLabel   string      — default: "Ver todos os resultados para '${value}'"
loading        boolean     — exibe Spinner no lugar dos resultados
emptyMessage   string      — default "Nenhum resultado encontrado"
emptySubtitle  string      — default "Tente buscar por outro termo."
```

Estados visuais:
→ **DEFAULT:** ícone `Search` à esquerda em `--ds-color-placeholder`, borda `--ds-color-border`
→ **FOCUS:** borda `--ds-color-input-focus`, ícone `Search` em `--ds-color-primary`
→ **DIGITANDO:** igual ao focus + botão `X` à direita (ícone `X`, 16px) — clique limpa e chama `onClear`
→ **COM RESULTADOS:** dropdown abre abaixo do campo com `position: absolute`
→ **SEM RESULTADOS:** dropdown com empty state (ícone Search grande + mensagens)
→ **COMPACTO:** mesmos estados, campo menor, sem label

Dropdown:
→ Posição: `absolute`, largura = largura do trigger, z-index `--ds-z-dropdown`
→ Fundo `--ds-color-surface`, borda `--ds-color-border`, border-radius 8px, sombra `--ds-shadow-md`
→ Cada item: renderizado por `renderResult` — componente pai define o layout (ícone, título, subtítulo)
→ Hover por item: `--ds-color-hover`
→ Rodapé (quando `onViewAll`): separador + ícone `Search` + `viewAllLabel` + ícone `ChevronRight`, clicável
→ Fecha ao clicar fora (`useClickOutside`) ou pressionar Esc

Nota de uso no Pulso:
→ O `renderResult` é responsabilidade da camada Pulso — o design-system não conhece as entidades
→ Exemplo de uso: busca global na sidebar passa `results={hits}` e `renderResult={(item) => <SearchResultItem item={item} />}`

---

### `Textarea/Textarea.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/inputs/Textarea/Textarea.jsx`
> Criar em: `src/design-system/components/inputs/Textarea/Textarea.styles.jsx`

Props:
```
label       string
value       string
onChange    (event) => void
error       string
disabled    boolean
required    boolean
maxLength   number    — exibe contador "X/maxLength" quando fornecido
resize      "none" | "vertical" | "both"  — default "vertical"
placeholder string
id          string
className   string
```

Estados visuais:
→ **DEFAULT:** borda `--ds-color-border`, fundo `--ds-color-input-bg`, placeholder em `--ds-color-placeholder`
→ **FOCUS:** borda `--ds-color-input-focus`, sem mudança de fundo
→ **FILLED (normal):** igual ao default com texto; contador em `--ds-color-text-secondary`
→ **FILLED (próximo do limite ≥ 90% de `maxLength`):** contador muda para `--ds-color-warning`
→ **FILLED (no limite = 100%):** contador muda para `--ds-color-danger`, não aceita mais input
→ **ERROR:** borda `--ds-color-danger`, contador também em danger, mensagem de erro abaixo
→ **DISABLED:** fundo `--ds-color-input-disabled`, opacity reduzida, sem interação

Especificações:
→ **Min-height:** 100px
→ **Max-height:** 300px — após isso, scroll interno ativado (`overflow-y: auto`)
→ **Padding:** 12px 16px
→ **Border-radius:** 8px
→ **Resize:** apenas vertical (`resize: vertical`) — alça de resize visível em `--ds-color-border`
→ **Quebras de linha:** permitidas
→ **Contador:** posicionado `absolute` no canto inferior direito dentro do campo — z-index acima do texto
→ Formato do contador: `"${value.length}/${maxLength}"`
→ Lógica de cor: `< 90%` → text-secondary | `>= 90%` → warning | `=== 100%` → danger

---

## 🚫 Regras de Negócio
* Todos os componentes são **controlados** (controlled) — não gerenciam estado interno de valor
* `InputMoney.onChange` sempre retorna `number`, nunca string
* `InputPassword` com `showValidation` exibe checklist ABAIXO do campo, não substitui o `error`
* `InputNumber` não exibe spinners nativos do browser — usar `appearance: none` no CSS
* `InputNumber.onChange` é chamado apenas com valores válidos (respeitando min/max/step)
* `InputSearch` com `results` é genérico — o layout de cada item é responsabilidade do `renderResult` passado pelo pai; o design-system não conhece as entidades do Pulso
* `InputSearch` fecha o dropdown ao clicar fora (`useClickOutside`) e ao pressionar Esc (`useKeyboard`)
* `Textarea` bloqueia digitação ao atingir `maxLength` (atributo nativo `maxLength` no `<textarea>`)
* `Textarea` não usa `rows` prop — altura controlada por `min-height`/`max-height` via CSS
* Nenhum componente usa `useEffect` para sincronizar valores — responsabilidade do pai
* Acessibilidade: todo input deve ter `id` e `label` associados via `htmlFor`; erros vinculados via `aria-describedby`

---

# [STORY] Componentes de Select

```
Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Inputs & Selectors
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero componentes de seleção genéricos com suporte a ícones nas opções, busca embutida, múltipla seleção com checkboxes e tags livres com sugestões, para que formulários complexos do Pulso (categorias, tags, moedas, membros) sejam construídos com consistência visual e comportamental.

---

## ✅ Critérios de Aceite

### Cenário 1 — Select: abre e fecha dropdown
**Dado** que um `Select` é renderizado,
**Quando** o usuário clica no trigger,
**Então** o dropdown abre (chevron rotaciona 180°, trigger ganha borda primary); ao clicar fora (`useClickOutside`) ou pressionar Esc (`useKeyboard`), o dropdown fecha.

### Cenário 2 — Select: seleciona opção e exibe no trigger
**Dado** que o dropdown está aberto,
**Quando** o usuário clica em "Alimentação",
**Então** o dropdown fecha, o trigger exibe o ícone + label da opção selecionada, e `onChange('alimentacao')` é chamado.

### Cenário 3 — Select: estados internos das opções
**Dado** que o dropdown está aberto,
**Quando** o cursor passa sobre uma opção não selecionada,
**Então** ela recebe fundo `--ds-color-hover`;
**Quando** a opção já está selecionada,
**Então** ela exibe fundo `--ds-color-primary/10`, texto `--ds-color-primary` e ícone de check (✓) à direita.

### Cenário 4 — Select: suporte a ícones nas opções
**Dado** que as opções têm `{ icon, iconColor }`,
**Quando** o dropdown está aberto e ao exibir a opção selecionada no trigger,
**Então** ícone colorido de 20px é exibido à esquerda do label em ambos os contextos.

### Cenário 5 — Select: max-height e scroll
**Dado** que há mais opções do que cabem no dropdown,
**Quando** o dropdown está aberto,
**Então** a lista tem max-height de 240px e scroll vertical interno (sem aumentar o dropdown).

### Cenário 6 — SelectSearch: busca embutida no dropdown
**Dado** que um `SelectSearch` está aberto,
**Quando** o usuário digita no campo de busca fixo no topo do dropdown,
**Então** as opções são filtradas em tempo real (case-insensitive); a opção selecionada mantém o checkmark na lista filtrada.

### Cenário 7 — SelectSearch: sem resultados
**Dado** que a busca não encontra nenhuma opção,
**Quando** o dropdown está aberto com busca ativa,
**Então** exibe ícone de busca + "Nenhum resultado para 'xyz'" + "Tente outro termo."

### Cenário 8 — MultiSelectSearch: exibe chips no trigger
**Dado** que `MultiSelectSearch` tem 2 itens selecionados,
**Quando** fechado,
**Então** o trigger exibe os chips com ícone + label + X para cada selecionado, seguidos do chevron.

### Cenário 9 — MultiSelectSearch: exibe contador quando muitos selecionados
**Dado** que `MultiSelectSearch` tem 3 ou mais itens selecionados e não cabem no trigger,
**Quando** fechado,
**Então** o trigger exibe `"[N selecionados]"` com tooltip/hover mostrando quais são.

### Cenário 10 — MultiSelectSearch: checkboxes e ações em lote
**Dado** que o `MultiSelectSearch` está aberto,
**Quando** renderizado,
**Então** cada opção tem checkbox; no rodapé do dropdown exibe "Selecionar todos" | "Limpar seleção" (links) e botão "Aplicar" (primary) para confirmar; o trigger só atualiza após clicar "Aplicar".

### Cenário 11 — MultiSelectSearch: contador no trigger quando aberto
**Dado** que `MultiSelectSearch` está aberto com N de M selecionados,
**Quando** renderizado,
**Então** o trigger mostra `"N de M selecionados"` com borda primary e chevron rotacionado.

### Cenário 12 — TagsInput: adicionar chip via Enter ou vírgula
**Dado** que um `TagsInput` é renderizado,
**Quando** o usuário digita e pressiona Enter ou vírgula,
**Então** um chip é criado inline (fundo primary/20, texto primary-light, border-radius 999px), `onAdd(tag)` é chamado; input é limpo.

### Cenário 13 — TagsInput: sugestões ao digitar
**Dado** que `TagsInput` recebe `suggestions` e o usuário está digitando,
**Quando** há sugestões correspondentes,
**Então** abre dropdown com as sugestões (label + "Existente" à direita) e uma última linha "Criar nova tag 'text'" com ícone `+` e instrução "Pressione Enter ou ,".

### Cenário 14 — TagsInput: remover chip
**Dado** que chips estão presentes,
**Quando** o usuário clica no X de um chip ou pressiona Backspace com o input vazio,
**Então** o último chip é removido e `onRemove(tag)` é chamado; hover no chip escurece o fundo.

### Cenário 15 — TagsInput: limite máximo de tags
**Dado** que `max={5}` e 5 chips já foram adicionados,
**Quando** o limite é atingido,
**Então** o contador acima à direita exibe `"Máximo de 5 tags ⓘ"` em `--ds-color-warning`; o input de digitação fica desabilitado; mensagem abaixo: "Você atingiu o limite máximo de N tags. Remova alguma para adicionar novas."

### Cenário 16 — Todos os selects: estado error
**Dado** que `error` é passado,
**Quando** renderizado,
**Então** o trigger exibe borda `--ds-color-danger` e mensagem de erro abaixo.

### Cenário 17 — Todos os selects: dark/light automático
**Dado** que `.dark` está ativo,
**Quando** o dropdown estiver aberto,
**Então** dropdown bg usa `--ds-color-surface`, hover usa `--ds-color-hover`, opção selecionada usa `primary/10`.

---

## 🎨 Visual e UX

### Select — especificações
* **Trigger:** altura 44px, padding 12px 16px, border-radius 8px, borda `--ds-color-border`
* **Trigger aberto:** borda `--ds-color-input-focus`, chevron rotacionado 180°
* **Dropdown:** fundo `--ds-color-surface` (distinto do trigger), border-radius 8px, borda `--ds-color-border`, sombra `--ds-shadow-md`, max-height 240px, scroll interno auto
* **Opção normal:** padding 12px 16px, texto `--ds-color-text`
* **Opção hover:** fundo `--ds-color-hover`
* **Opção selecionada:** fundo `--ds-color-primary/10`, texto `--ds-color-primary`, ícone `Check` 16px à direita
* **Ícone de opção:** 20px, cor definida por `iconColor` na opção
* **Chevron:** 20px, transição `--ds-transition-fast`

### SelectSearch — especificações adicionais
* Campo de busca fixo no **topo** do dropdown (não é o trigger que vira input)
* Campo de busca: border-bottom `--ds-color-border`, padding 8px 12px, ícone `Search` 16px, botão X para limpar busca
* Empty state: ícone Search (40px, opacity 40%) + título + subtítulo

### MultiSelectSearch — especificações adicionais
* **Trigger com poucos selecionados:** chips inline (ícone + label + X) + chevron
* **Trigger com muitos:** texto `"[N selecionados]"` + tooltip no hover
* **Trigger aberto:** `"N de M selecionados"` + chevron rotacionado + borda primary
* **Dropdown rodapé:** linha separadora + "Selecionar todos" | "Limpar seleção" (links text-secondary) + botão "Aplicar" (variant primary, small)
* Checkboxes: usar `Checkbox` do design-system (quando implementado) ou estilo inline

### TagsInput — especificações
* **Container:** min-height 44px, padding 10px 12px, border-radius 8px, wrap habilitado (chips quebram linha)
* **Chip:** padding 6px 12px, border-radius 999px, fundo `--ds-color-primary/20`, texto `--ds-color-primary-light`
* **Chip hover:** fundo `--ds-color-primary/30`
* **Chip X:** ícone 14px, `--ds-color-primary-light`
* **Separador:** `|` vertical entre chips e input (cor `--ds-color-border`)
* **Placeholder:** "Digite e aperte Enter..." quando vazio
* **Sugestão — linha existente:** ícone Tag 16px + label + "Existente" à direita (text-secondary)
* **Sugestão — criar nova:** ícone `+` 16px em primary + `"Criar nova tag '${text}'"` + "Pressione Enter ou ," à direita
* **Aviso de limite:** posicionado acima à direita em `--ds-color-warning`

---

## 🛠️ Implementação

### `Select/Select.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/selects/Select/Select.jsx`
> Criar em: `src/design-system/components/selects/Select/Select.styles.jsx`

Props:
```
options      { value: string, label: string, icon?: ReactNode, iconColor?: string, disabled?: boolean }[]
value        string | null
onChange     (value: string) => void
placeholder  string     — default "Selecione..."
error        string
disabled     boolean
label        string
required     boolean
id           string
className    string
```

→ Dropdown: `position: absolute`, z-index `--ds-z-dropdown`, max-height 240px, overflow-y auto
→ Ícone `ChevronDown` à direita, transição `rotate-180` quando aberto
→ Opção selecionada: fundo `primary/10`, texto `--ds-color-primary`, ícone `Check` 16px à direita
→ Trigger fechado com seleção: exibe `option.icon + option.label`
→ Teclado: `ArrowUp`/`Down` navega, `Enter` seleciona, `Esc` fecha

### `Select/Select.styles.jsx` (NOVO — CRIAR)

→ CVA para trigger: variants `open` (boolean), `error` (boolean), `disabled` (boolean)
→ CVA para option: variants `selected` (boolean), `highlighted` (boolean — para navegação por teclado)
→ Todos os valores de cor via `var(--ds-color-*)`

---

### `SelectSearch/SelectSearch.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/selects/SelectSearch/SelectSearch.jsx`
> Criar em: `src/design-system/components/selects/SelectSearch/SelectSearch.styles.jsx`
> Seguir padrão de: `Select/Select.jsx`

Props (herda todas do `Select` +):
```
searchPlaceholder  string    — default "Buscar..."
loading            boolean   — Spinner no lugar das opções
emptyMessage       string    — default "Nenhum resultado para '${query}'"
emptySubtitle      string    — default "Tente outro termo."
```

Layout do dropdown:
→ **Topo fixo:** campo de busca (ícone Search + input + botão X) com border-bottom
→ **Lista:** opções filtradas com mesmo layout do `Select` (icon + label + check se selecionado)
→ **Sem resultados:** ícone Search (40px, opacity 40%) + `emptyMessage` + `emptySubtitle`
→ Filtra localmente por padrão (case-insensitive, `label.toLowerCase().includes(query)`)

---

### `MultiSelectSearch/MultiSelectSearch.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/selects/MultiSelectSearch/MultiSelectSearch.jsx`
> Criar em: `src/design-system/components/selects/MultiSelectSearch/MultiSelectSearch.styles.jsx`

Props:
```
options           { value: string, label: string, icon?: ReactNode, iconColor?: string }[]
values            string[]
onChange          (values: string[]) => void     — chamado SOMENTE ao clicar "Aplicar"
placeholder       string
error             string
disabled          boolean
label             string
searchPlaceholder string     — default "Buscar..."
maxChipsVisible   number     — qtos chips exibir no trigger antes de colapsar (default 2)
loading           boolean
emptyMessage      string
className         string
```

Estado interno: `pendingValues` (cópia dos `values` enquanto o dropdown está aberto — só comitado ao "Aplicar")

Trigger (fechado):
→ Até `maxChipsVisible` chips: exibe chip com ícone + label + X (cada X chama onChange imediatamente)
→ Acima do limite: exibe `"[N selecionados]"` + tooltip com lista no hover

Trigger (aberto):
→ Exibe `"N de M selecionados"` com borda primary + chevron 180°

Dropdown:
→ Topo: campo de busca (igual ao SelectSearch)
→ Lista: opções com checkbox + ícone + label
→ Rodapé fixo: "Selecionar todos" | "Limpar seleção" (links) + botão "Aplicar" (primary, small)

---

### `TagsInput/TagsInput.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/selects/TagsInput/TagsInput.jsx`
> Criar em: `src/design-system/components/selects/TagsInput/TagsInput.styles.jsx`

Props:
```
tags          string[]
onAdd         (tag: string) => void
onRemove      (tag: string) => void
placeholder   string     — default "Digite e aperte Enter..."
max           number     — limite de tags; se atingido, input desabilita
suggestions   string[]   — lista de sugestões existentes para mostrar ao digitar (opcional)
error         string
disabled      boolean
label         string
className     string
```

Layout:
→ Container flexível com wrap; chips renderizados antes do input
→ Separador `|` (1px height, cor `--ds-color-border`) entre último chip e input
→ Input ocupa o espaço restante na linha

Chip:
→ padding 6px 12px, border-radius 999px, fundo `rgba(--ds-color-primary, 0.2)`, texto `--ds-color-primary-light`
→ Ícone X 14px à direita; hover: fundo `rgba(--ds-color-primary, 0.3)`

Dropdown de sugestões (aparece quando `suggestions` fornecido e `inputValue.length > 0`):
→ `position: absolute`, mesmos estilos de dropdown dos selects
→ Cada sugestão existente: ícone `Tag` 16px + label + "Existente" (text-secondary) à direita
→ Última linha (sempre): ícone `Plus` 16px (cor primary) + `"Criar nova tag '${inputValue}'"` + "Pressione Enter ou ," à direita
→ Clicar em sugestão existente: chama `onAdd(suggestion)` e fecha dropdown
→ Clicar em "Criar nova tag": chama `onAdd(inputValue)` e fecha dropdown

Limite máximo:
→ Quando `tags.length === max`: input `disabled`, exibe `"Máximo de ${max} tags ⓘ"` em `--ds-color-warning` acima à direita + mensagem abaixo do container

Separadores para adicionar tag: `Enter` e `,` (vírgula) — `e.preventDefault()` na vírgula para não inserir no valor

### `MultiSelect/MultiSelect.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/selects/MultiSelect/MultiSelect.jsx`
> Criar em: `src/design-system/components/selects/MultiSelect/MultiSelect.styles.jsx`

> ⚠️ **Diferente do `MultiSelectSearch`**: sem campo de busca, seleção imediata (sem "Aplicar"), para listas pequenas de 3–8 opções. Dropdown permanece aberto enquanto o usuário interage.

Props:
```
options          { value: string, label: string, icon?: ReactNode, iconColor?: string }[]
values           string[]
onChange         (values: string[]) => void   — chamado IMEDIATAMENTE a cada toggle
placeholder      string     — default "Selecione..."
error            string
disabled         boolean
label            string
className        string
```

Trigger (fechado):
→ Sem seleção: placeholder em text-secondary
→ Com seleção: chips (ícone + label + X), chevron à direita
→ X em chip: remove imediatamente chamando `onChange`

Dropdown (fica aberto durante interação):
→ Topo: checkbox "Selecionar todos" — quando todos marcados exibe checkmark; clicar alterna entre marcar/desmarcar tudo
→ Lista: cada opção com checkbox 20×20px + ícone (opcional, 20px) + label
→ Altura do item: 44px, padding 12px 16px
→ Hover: fundo `--ds-color-hover`
→ Fechamento: somente ao clicar fora (`useClickOutside`) ou Esc — **não fecha ao selecionar opção**

Especificações visuais:
→ Checkbox checked: `--ds-color-primary`, borda primary
→ Chip: padding 6px 12px, border-radius 999px, fundo `--ds-color-primary/20`, texto `--ds-color-primary-light`
→ Max recomendado: 8 opções — para listas maiores, usar `MultiSelectSearch`

---

### `selects/index.js` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/selects/index.js`

→ Exporta: `Select`, `SelectSearch`, `MultiSelect`, `MultiSelectSearch`, `TagsInput`

---

## 🚫 Regras de Negócio
* Todos os dropdowns fecham ao clicar fora (`useClickOutside`) e ao pressionar Esc (`useKeyboard`)
* **`MultiSelect`** (sem busca): seleção imediata, dropdown permanece aberto, para 3–8 opções
* **`MultiSelectSearch`** (com busca): estado `pendingValues`, `onChange` só dispara ao confirmar "Aplicar"; cancelar descarta pendências — para listas grandes
* `TagsInput` não permite tags duplicadas — compara `tag.trim().toLowerCase()` antes de chamar `onAdd`
* `Select`, `SelectSearch`, `MultiSelect` e `MultiSelectSearch` usam `position: absolute` — **sem portals** por ora
* `TagsInput.suggestions` é responsabilidade do componente pai — o design-system apenas renderiza e gerencia a interação

---

# [STORY] Componentes de Picker

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Inputs & Selectors
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero componentes de seleção de datas e horários genéricos baseados em `date-fns`, para que formulários de transações, metas, viagens e lembretes do Pulso usem um picker consistente com o design system.

---

## ✅ Critérios de Aceite

### Cenário 1 — DatePicker: seleciona data única
**Dado** que um `DatePicker` é renderizado,
**Quando** o usuário clica no campo e depois em uma data do calendário,
**Então** o campo exibe `"22/04/2026"`, `onChange(Date)` é chamado e o calendário fecha.

### Cenário 2 — DatePicker: dia selecionado
**Dado** que um dia está selecionado,
**Quando** o calendário está aberto,
**Então** o dia selecionado tem círculo preenchido em `--ds-color-primary` com texto branco.

### Cenário 3 — DatePicker: dia atual
**Dado** que hoje é dia 22,
**Quando** o calendário está aberto e o dia 22 não está selecionado,
**Então** exibe apenas a borda do círculo em `--ds-color-primary` (anel, sem preenchimento).

### Cenário 4 — DatePicker: hover nos dias
**Dado** que o calendário está aberto,
**Quando** o cursor passa sobre um dia habilitado,
**Então** exibe fundo `--ds-color-hover` arredondado.

### Cenário 5 — DatePicker: dias desabilitados
**Dado** que `disablePast={true}` ou `minDate`/`maxDate` são definidos,
**Quando** o calendário é exibido,
**Então** datas fora do intervalo exibem opacity 30%, não respondem a hover e não são clicáveis.

### Cenário 6 — DatePicker: dias de meses adjacentes
**Dado** que o calendário exibe Abril 2026,
**Quando** renderizado,
**Então** os dias de Março e Maio visíveis nas bordas da grade têm cor `--ds-color-text-secondary` e não são selecionáveis.

### Cenário 7 — DatePicker: link "Hoje"
**Dado** que o calendário está em um mês diferente do atual,
**Quando** o usuário clica em "Hoje" no rodapé,
**Então** o calendário navega para o mês atual sem selecionar a data.

### Cenário 8 — DatePicker: navegação de mês
**Dado** que o calendário está aberto em Abril 2026,
**Quando** o usuário clica `>`,
**Então** exibe Maio 2026 com os mesmos dias animados.

### Cenário 9 — DateRangePicker: seleção em 2 cliques
**Dado** que o `DateRangePicker` está aberto,
**Quando** o usuário clica em dia 1 (início),
**Então** o dia 1 fica com círculo primary; ao mover o cursor, os dias entre o início e o cursor ficam com fundo `primary/10` (preview); ao clicar no dia 30 (fim), o range é fechado e ambos ficam com círculo preenchido.

### Cenário 10 — DateRangePicker: atalhos rápidos
**Dado** que o `DateRangePicker` está aberto,
**Quando** o usuário clica em "Este mês",
**Então** o preset preenche o range automaticamente (01/04/2026 → 30/04/2026), o atalho fica com checkmark e destaque primary; o trigger exibe `"Abr 2026"` com chevron.

### Cenário 11 — DateRangePicker: confirmar com Aplicar
**Dado** que o range está selecionado,
**Quando** o usuário clica em "Aplicar",
**Então** `onChange({ start, end })` é chamado e o dropdown fecha; "Limpar" reseta o range sem fechar.

### Cenário 12 — DateRangePicker: erro de validação
**Dado** que a data final é anterior à data inicial,
**Quando** o componente valida,
**Então** exibe borda danger no trigger e mensagem: `"A data final deve ser igual ou posterior à inicial."`

### Cenário 13 — DateRangePicker: variação mobile
**Dado** que `useIsMobile()` retorna true,
**Quando** o picker é aberto,
**Então** exibe apenas 1 mês (sem duplo calendário), presets colapsados, botões "Limpar" e "Aplicar" na parte inferior.

### Cenário 14 — MonthPicker: seleciona mês/ano
**Dado** que um `MonthPicker` é renderizado,
**Quando** o usuário navega entre anos e seleciona um mês,
**Então** `onChange({ month, year })` é chamado.

### Cenário 15 — TimePicker: seleciona horário
**Dado** que um `TimePicker` é renderizado,
**Quando** o usuário ajusta hora e minuto,
**Então** `onChange('HH:mm')` é chamado respeitando `minuteStep`.

### Cenário 16 — Todos os pickers: dark/light
**Dado** que `.dark` está ativo,
**Quando** qualquer picker é aberto,
**Então** o fundo do calendário usa `--ds-color-surface`, dia selecionado usa `--ds-color-primary`, hover usa `--ds-color-hover`.

---

## 🛠️ Implementação

### `DatePicker/DatePicker.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/pickers/DatePicker/DatePicker.jsx`
> Criar em: `src/design-system/components/pickers/DatePicker/DatePicker.styles.jsx`

Props:
```
value        Date | null
onChange     (date: Date) => void
placeholder  string       — default "DD/MM/AAAA"
minDate      Date         — datas antes disso ficam desabilitadas
maxDate      Date
disablePast  boolean      — atalho para minDate = hoje
error        string
disabled     boolean
label        string
format       string       — default "dd/MM/yyyy" (date-fns)
locale       Locale       — default ptBR de date-fns/locale
id           string
className    string
```

Trigger:
→ Largura padrão: 240px, altura 44px, border-radius 8px
→ Ícone `Calendar` 20px à direita, cor `--ds-color-placeholder`; ao abrir, cor primary
→ Aberto: trigger recebe borda `--ds-color-input-focus`
→ Animação de abertura: fade + slide (150ms)

Calendário (dropdown):
→ Fundo `--ds-color-surface`, border-radius 8px, sombra `--ds-shadow-md`, max-height automática (até 340px)
→ **Cabeçalho:** `<` | `"Abril 2026"` (clicável → MonthPicker inline) | `>`
→ **Grade:** 7 colunas com rótulos D S T Q Q S S (iniciando domingo), 6 linhas de dias
→ **Dia normal:** hover → círculo `--ds-color-hover`
→ **Dia selecionado:** círculo preenchido `--ds-color-primary`, texto branco
→ **Dia de hoje (não selecionado):** círculo com apenas borda `--ds-color-primary` (anel)
→ **Dias do mês anterior/próximo:** visíveis mas `--ds-color-text-secondary`, opacity 60%, não clicáveis
→ **Dias desabilitados:** opacity 30%, sem cursor pointer, sem hover
→ **Rodapé:** link "Hoje" em `--ds-color-primary` — navega ao mês atual sem selecionar

`date-fns` functions a usar: `format`, `startOfMonth`, `endOfMonth`, `eachDayOfInterval`, `isSameDay`, `isToday`, `isBefore`, `isAfter`, `addMonths`, `subMonths`, `getDay`, `startOfWeek`

### `DateRangePicker/DateRangePicker.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/pickers/DateRangePicker/DateRangePicker.jsx`
> Criar em: `src/design-system/components/pickers/DateRangePicker/DateRangePicker.styles.jsx`
> Seguir padrão de: `DatePicker/DatePicker.jsx`

Props:
```
startDate      Date | null
endDate        Date | null
onChange       ({ start: Date, end: Date }) => void   — chamado ao clicar "Aplicar"
presets        { label: string, icon?: ReactNode, getValue: () => { start: Date, end: Date } }[]
               — default: Hoje, Últimos 7 dias, Este mês, Mês passado, Últimos 3 meses, Últimos 6 meses
minDate        Date
maxDate        Date
error          string
disabled       boolean
label          string
locale         Locale     — default ptBR
className      string
```

Trigger:
→ Campo único: ícone `Calendar` 20px à esquerda + `"Data início → Data fim"` (placeholder)
→ Preenchido com datas específicas: `"01/04/2026 → 30/04/2026"`
→ Preenchido com preset de mês inteiro: `"Abr 2026"` com `ChevronDown` à direita
→ Em digitação parcial: `"01/04/2026 → Data fim"` com X para limpar
→ Erro: borda danger + mensagem `"A data final deve ser igual ou posterior à inicial."`
→ Disabled: ícone de cadeado, opacity reduzida, sem interação

Dropdown (desktop):
→ **Esquerda:** painel de atalhos rápidos (presets)
  - Cada preset: ícone + label; preset ativo → fundo primary/10, texto primary, checkmark
→ **Direita:** dois calendários lado a lado (mês atual + próximo mês)
→ **Rodapé:** botão `"Limpar"` (ghost) + botão `"Aplicar"` (primary) — `onChange` só dispara no "Aplicar"

Dropdown (mobile — detectado via `useIsMobile()`):
→ Apenas 1 calendário
→ Presets colapsados (accordion ou suprimidos)
→ Botões "Limpar" e "Aplicar" na parte inferior

Seleção de range (estado interno):
→ `pendingStart` e `pendingEnd` — só viram `startDate`/`endDate` ao "Aplicar"
→ **Passo 1:** clique → `pendingStart` definido, círculo primary no início
→ **Passo 2:** hover → dias entre `pendingStart` e cursor recebem fundo `primary/10` (preview)
→ **Passo 3:** clique → `pendingEnd` definido; start e end com círculo preenchido; dias entre com `primary/10`
→ **Aplicar:** `onChange({ start: pendingStart, end: pendingEnd })`
→ **Limpar:** reseta `pendingStart` e `pendingEnd` sem fechar

`date-fns` functions adicionais: `isWithinInterval`, `isSameMonth`, `addMonths`

### `MonthPicker/MonthPicker.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/pickers/MonthPicker/MonthPicker.jsx`
> Criar em: `src/design-system/components/pickers/MonthPicker/MonthPicker.styles.jsx`

Props:
```
value          { month: number, year: number } | null
onChange       ({ month, year }) => void
minYear        number     — ano mínimo navegável
maxYear        number     — ano máximo navegável
disableFuture  boolean    — desabilita meses após o mês atual
placeholder    string     — default "Selecione um mês..."
error          string
disabled       boolean
label          string
locale         Locale     — default ptBR (nomes dos meses em pt)
id             string
className      string
```

Trigger:
→ Ícone `Calendar` 20px + label formatado `"Maio/2026"` + `ChevronDown`
→ Aberto: borda `--ds-color-input-focus`, chevron rotacionado 180°

Dropdown — grid 4 colunas × 3 linhas:
→ **Cabeçalho:** `<` | `"2026"` (ano em bold) | `>` — navegam o ano
→ **Grade:** Jan Fev Mar | Abr Mai Jun | Jul Ago Set | Out Nov Dez
→ **Item altura:** 44px, gap 8px entre itens, border-radius 8px
→ **Mês normal:** hover → fundo `--ds-color-hover` arredondado
→ **Mês selecionado:** fundo `--ds-color-primary` preenchido, texto branco, border-radius 8px
→ **Mês atual (não selecionado):** borda `--ds-color-primary` (anel), sem preenchimento
→ **Mês desabilitado (futuro):** opacity 30%, sem hover, sem clique

Animação de troca de ano:
→ Grid desliza lateralmente ao trocar o ano: 200ms ease
→ Ano seguinte: desliza da direita para esquerda
→ Ano anterior: desliza da esquerda para direita

Lógica de `disableFuture`:
→ Meses posteriores ao mês atual no ano atual ficam desabilitados
→ Todos os meses de anos futuros ficam desabilitados
→ A seta `>` fica desabilitada quando `currentYear >= hoje.getFullYear()` se `disableFuture=true`

### `TimePicker/TimePicker.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/pickers/TimePicker/TimePicker.jsx`
> Criar em: `src/design-system/components/pickers/TimePicker/TimePicker.styles.jsx`

Props:
```
value        string        — "HH:mm" (24h) ou "HH:mm AM/PM" (12h)
onChange     (time: string) => void
format       "24h" | "12h" — default "24h"
minuteStep   number        — default 5 (gera: 00, 05, 10...55)
variant      "dropdown" | "inline"  — default "dropdown"
error        string
disabled     boolean
label        string
disabledLabel string       — default "Não disponível" (exibido sob o campo quando disabled)
id           string
className    string
```

**Variante `dropdown`:**
→ Trigger: ícone `Clock` 20px + valor (ou placeholder `"HH:MM"`) + `ChevronDown`
→ Foco: borda `--ds-color-input-focus`

Dropdown (colunas de scroll estilo drum/wheel):
→ **24h:** 2 colunas — HORA (00–23) | MINUTO (00, 05...55)
→ **12h:** 3 colunas — HORA (1–12) | MINUTO (00, 05...55) | PERÍODO (AM / PM)
→ Cada coluna: lista vertical scrollável, ítem selecionado centralizado com fundo `--ds-color-primary` + texto branco
→ Ítens visíveis ao redor (cima/baixo): text-secondary, clicando neles ou com scroll navega a lista
→ Separador `:` entre colunas HORA e MINUTO
→ Rodapé: texto `"Formato 24 horas"` ou `"Formato 12 horas"` em text-secondary
→ Seleção fecha o dropdown automaticamente

Keyboard/mouse:
→ Scroll do mouse: navega a coluna sob o cursor
→ Tab: move foco entre colunas (HORA → MINUTO → PERÍODO)
→ ArrowUp/Down: navega dentro da coluna focada
→ Enter/Click: seleciona e fecha
→ Esc: fecha sem selecionar

**Variante `inline`** (sem dropdown):
→ Dois campos numéricos lado a lado separados por `:`
→ Cada campo tem botões `∧` (acima) e `∨` (abaixo) para incrementar/decrementar
→ Tab navega entre hora e minuto
→ Validação imediata (hora 0–23, minuto deve ser múltiplo de `minuteStep`)

**Estados:**
→ FOCUS: borda `--ds-color-input-focus` no trigger
→ ERROR: borda `--ds-color-danger`, mensagem de erro abaixo (ex: `"Horário inválido"`)
→ DISABLED: opacity reduzida, cursor not-allowed, exibe `disabledLabel` abaixo

### `pickers/index.js` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/pickers/index.js`

→ Exporta: `DatePicker`, `DateRangePicker`, `MonthPicker`, `TimePicker`

---

## 🚫 Regras de Negócio
* Pickers usam `date-fns` (já instalado no projeto) — não instalar moment.js ou outras libs de data
* Locale padrão: `ptBR` de `date-fns/locale`
* `DatePicker.onChange` e `DateRangePicker.onChange` retornam objetos `Date` nativos
* `MonthPicker.onChange` retorna `{ month: number (1-12), year: number }` — **month é 1-indexed** (Janeiro = 1)
* `TimePicker.onChange` retorna string `"HH:mm"` (24h) ou `"HH:mm AM"` / `"HH:mm PM"` (12h)
* `TimePicker` com `variant="dropdown"` fecha ao selecionar; `variant="inline"` chama `onChange` a cada alteração
* Internamente, formatação para exibição usa `date-fns/format` — não `toLocaleDateString`

---

# [STORY] Componentes de Forms

```
Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Inputs & Selectors
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero componentes de formulário genéricos (Toggle, Checkbox, Radio, FormField) com suporte a dark/light mode, para que configurações do Pulso sejam construídas com consistência visual e comportamental.

---

## ✅ Critérios de Aceite

### Cenário 1 — Toggle: estados OFF/ON
**Dado** que um `Toggle` está renderizado,
**Quando** está OFF,
**Então** o track exibe `--ds-color-hover` (cinza) e o thumb é branco à esquerda;
**Quando** está ON,
**Então** o track exibe `--ds-color-primary` (roxo) e o thumb desliza para a direita; transição 200ms ease.

### Cenário 2 — Toggle: hover
**Dado** que o Toggle está habilitado,
**Quando** o cursor passa sobre o componente,
**Então** o track fica ligeiramente mais escuro/claro sem alterar o estado.

### Cenário 3 — Toggle: disabled
**Dado** que `disabled={true}`,
**Quando** renderizado,
**Então** o cursor é `not-allowed`, o componente fica com opacity reduzida e não é interativo; tanto OFF quanto ON desabilitados mantm suas cores mas esmaecidas.

### Cenário 4 — Toggle: label e descrição
**Dado** que `label="Gamificação"` e `description="Ativa streaks, conquistas e desafios"` são passados,
**Quando** renderizado,
**Então** exibe toggle à esquerda, label em text-primary + descrição em text-secondary à direita.

### Cenário 5 — Toggle: tamanho compacto
**Dado** que `size="compact"`,
**Quando** renderizado,
**Então** o track é menor e o thumb é menor, mantendo as mesmas proporções e comportamento.

### Cenário 6 — Toggle: dark/light automático
**Dado** que `.dark` está ativo,
**Quando** renderizado,
**Então** Track OFF usa `--ds-color-hover` (#27272A dark / #E5E7EB light), Track ON usa `--ds-color-primary` (mesmo em ambos os modos).

### Cenário 7 — Checkbox: estados principais
**Dado** que um `Checkbox` é renderizado,
**Quando** está `unchecked`,
**Então** exibe box com borda `#71717A` e label `#A1A1AA`;
**Quando** em hover (unchecked),
**Então** borda muda para `#A78BFA` e fundo recebe `#7C3AED` com opacity 10%;
**Quando** está `checked`,
**Então** fundo `#7C3AED`, checkmark branco, animação scale(0.9) → scale(1) em 150ms;
**Quando** está `indeterminate`,
**Então** fundo `#7C3AED` com ícone dash `—` branco centralizado.

### Cenário 8 — Checkbox: disabled e error
**Dado** que `disabled={true}`,
**Quando** renderizado em qualquer estado,
**Então** opacity 0.4, cursor not-allowed, nenhuma interação;
**Dado** que `error` é fornecido,
**Quando** renderizado,
**Então** borda `#F87171`, mensagem de erro abaixo em `#F87171`.

### Cenário 9 — Checkbox: variação com descrição
**Dado** que `description` é fornecido,
**Quando** renderizado,
**Então** exibe label em texto normal e description em text-secondary logo abaixo do label.

### Cenário 10 — Radio: estados
**Dado** que um `Radio` é renderizado,
**Quando** não selecionado,
**Então** exibe círculo 20px com borda 2px `#71717A` e label `#A1A1AA`;
**Quando** em hover (não selecionado),
**Então** borda `#A78BFA`, fundo `#7C3AED/10`;
**Quando** selecionado,
**Então** borda `#7C3AED`, dot interno 10px `#7C3AED` preenchido com animação scale(0) → scale(1) em 150ms;
**Quando** disabled,
**Então** opacity 0.4, cursor not-allowed em ambos os estados.

### Cenário 11 — Radio: variações de grupo
**Dado** que `orientation="vertical"`,
**Quando** renderizado,
**Então** opções empilhadas verticalmente (seleção exclusiva — apenas uma por vez);
**Dado** que `orientation="horizontal"`,
**Quando** renderizado,
**Então** opções em linha com espaçamento entre elas;
**Dado** que `variant="card"`,
**Quando** renderizado,
**Então** card inteiro é clicável; selecionado exibe borda `#7C3AED` + fundo `#7C3AED/10`.

### Cenário 12 — FormField: wrapper de validação (prototipar depois)
> ⚠️ Awaiting prototype — implementar após receber imagem de referência

---

## 🎨 Visual e UX

### Toggle — especificações
* **Track padrão:** 44px (largura) × 24px (altura), border-radius 999px
* **Thumb padrão:** 20px (círculo), border-radius 50%, cor `#FAFAFA`
* **Track compacto:** 32px × 18px, thumb 14px
* **Track OFF:** `--ds-color-hover` (escuro dark: #27272A / light: #E5E7EB)
* **Track ON:** `--ds-color-primary` (#7C3AED em ambos os modos)
* **Track OFF hover:** ligeiramente mais claro/escuro que OFF (opacity 80%)
* **Track ON hover:** mantm primary, opacity ligeiramente maior
* **Disabled OFF:** track `--ds-color-hover`, opacity 0.5, cursor not-allowed
* **Disabled ON:** track primary mais claro (opacity 0.5), cursor not-allowed
* **Transição:** 200ms ease (thumb deslizamento + troca de cor do track)
* **Border:** 1px solid `#3F3F46` (dark) / `#F3F4F6` (light) — sutil no estado OFF

### Checkbox — especificações
* **Box:** 20px × 20px, border-radius 4px, border-width 2px
* **UNCHECKED:** borda `#71717A`, label `#A1A1AA`, fundo transparente
* **HOVER (unchecked):** borda `#A78BFA`, fundo `#7C3AED` 10% de opacity
* **CHECKED:** fundo `#7C3AED`, borda `#7C3AED`, ícone `Check` branco (`#FAFAFA`) 14px
* **INDETERMINATE:** fundo `#7C3AED`, borda `#7C3AED`, ícone dash `Minus` branco 14px
* **DISABLED (qualquer estado):** opacity 0.4, cursor not-allowed, sem hover
* **ERROR:** borda `#F87171` (`--ds-color-danger`), mensagem abaixo em `#F87171`
* **Animação check/indeterminate:** scale(0.9) → scale(1), 150ms ease
* **Cursor:** pointer (exceto disabled)
* **Ícones (lucide-react):** `Check` (checked) / `Minus` (indeterminate)

### Radio — especificações
* **Círculo outer:** diâmetro 20px, border-radius 50%, borda 2px
* **Dot inner:** diâmetro 10px, border-radius 50%, preenchido
* **UNSELECTED:** borda `#71717A`, label `#A1A1AA`
* **HOVER (unselected):** borda `#A78BFA`, fundo `#7C3AED/10`
* **SELECTED:** borda `#7C3AED`, dot `#7C3AED` visível, label `#FAFAFA` (dark) / `#1F2937` (light)
* **DISABLED:** opacity 0.4, cursor not-allowed em ambos os estados (selected/unselected)
* **Animação dot:** scale(0) → scale(1), 150ms ease
* **Variante Card:** card inteiro clicável (padding 12px, border-radius 8px), selected = borda `#7C3AED` 2px + fundo `#7C3AED/10`; não selected = borda `--ds-color-border`

---

## 🛠️ Implementação

### `Toggle/Toggle.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/forms/Toggle/Toggle.jsx`
> Criar em: `src/design-system/components/forms/Toggle/Toggle.styles.jsx`

Props:
```
checked      boolean
onChange     (checked: boolean) => void
label        string     — texto ao lado direito do toggle
description  string     — subtexto abaixo do label (opcional)
disabled     boolean
size         "default" | "compact"  — default "default"
id           string
className    string
```

Implementação:
→ Elemento base: `<button role="switch" aria-checked={checked}>`
→ Estrutura interna: `<span>` track + `<span>` thumb
→ Track e thumb posicionados com CSS (`position: relative` / `absolute`)
→ Thumb: `transform: translateX(0)` OFF → `transform: translateX(20px)` ON (padrão) / `translateX(14px)` (compacto)
→ CVA no styles.jsx: variants `checked` (boolean), `disabled` (boolean), `size` (default/compact)
→ `onClick`: chama `onChange(!checked)` se não disabled

Layout (quando label/description fornecidos):
→ `<div>` flex com gap 12px: toggle à esquerda, `<div>` com label + description à direita
→ Label: texto 14px, `--ds-color-text`
→ Description: texto 12px, `--ds-color-text-secondary`

### `Checkbox/Checkbox.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/forms/Checkbox/Checkbox.jsx`
> Criar em: `src/design-system/components/forms/Checkbox/Checkbox.styles.jsx`

Props:
```
checked        boolean
indeterminate  boolean    — exibe dash; sobrescreve checked visualmente
onChange       (checked: boolean) => void
label          string
description    string     — subtexto abaixo do label
error          string     — mensagem de erro
disabled       boolean
id             string
className      string
```

Implementação:
→ Elemento base: `<input type="checkbox">` oculto + `<div>` visual 20×20px
→ `indeterminate` definido via `ref.current.indeterminate = true` no input nativo
→ Ícone `Check` (checked) ou `Minus` (indeterminate) de `lucide-react`, 14px, branco
→ CVA no styles.jsx: variants `checked`, `indeterminate`, `disabled`, `error`
→ Animação: ao marcar/desmarcar, `scale(0.9) → scale(1)` via CSS keyframe 150ms
→ Layout com descrição: label texto 14px + description 12px `--ds-color-text-secondary`
→ Error: mensagem abaixo em `--ds-color-danger` texto 12px

### `Radio/Radio.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/forms/Radio/Radio.jsx`
> Criar em: `src/design-system/components/forms/Radio/Radio.styles.jsx`

Props (item individual):
```
value          string     — valor desta opção
checked        boolean
onChange       (value: string) => void
label          string
description    string     — subtexto (variação C)
disabled       boolean
id             string
className      string
```

Implementação do item:
→ Elemento base: `<input type="radio">` oculto + `<div>` visual circular 20×20px
→ Dot interno: `<span>` 10px centralizado, scale(0) → scale(1) 150ms ease
→ CVA: variants `checked`, `disabled`

### `RadioGroup/RadioGroup.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/forms/Radio/RadioGroup.jsx`

Props:
```
value          string     — valor selecionado
onChange       (value: string) => void
options        Array<{ value: string, label: string, description?: string }>
orientation    "vertical" | "horizontal"  — default "vertical"
variant        "default" | "card"         — default "default"
disabled       boolean
name           string     — atributo name do grupo (acessibilidade)
className      string
```

Implementação:
→ `role="radiogroup"` no container
→ Variante `"card"`: cada opção envolvida em `<label>` card clicável (padding 12px, radius 8px); selected = borda `#7C3AED` 2px + fundo `#7C3AED/10`
→ Variante `"default"`: spacing 8px entre itens (vertical) ou 16px (horizontal)
→ CVA no Radio.styles.jsx: variant `card` altera layout do label/container

### `FormField/FormField.jsx` (NOVO — CRIAR) ⚠️ Awaiting prototype

> Criar em: `src/design-system/components/forms/FormField/FormField.jsx`
> Detalhamento pendente — será adicionado após receber protótipo

### `forms/index.js` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/forms/index.js`

→ Exporta: `Toggle`, `Checkbox`, `Radio`, `RadioGroup`, `FormField`

---

## 🚫 Regras de Negócio
* `Toggle` usa `<button role="switch">` para acessibilidade (não `<input type="checkbox">`)
* `Checkbox` e `Radio` usam `<input>` nativo oculto + div visual — garante funcionalidade de formulário e acessibilidade
* `Checkbox` é **controlado** — `checked` vem de fora; `onChange` notifica o pai
* `Radio` individual não controla estado próprio — `RadioGroup` é o componente de uso padrão
* `indeterminate` no Checkbox é definido via `inputRef.current.indeterminate` (não via prop HTML)
* Todos os componentes de forms são acessíveis: `aria-checked`, `aria-disabled`, `htmlFor`/`id` vinculados, `role` correto

---

# [FEATURE] Modais de Confirmação

```
Tipo:        Feature
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System, Pulso
Relator:     (preencher)
Pai:         [EPIC] Design System — Pulso
Data Limite: (preencher)
```

Implementação do padrão de confirmação de ações destrutivas. Dividido em duas camadas: o componente genérico (reutilizável) no design-system e os wrappers contextuais específicos do Pulso.

**Protótipos disponíveis:** imagens de referência anexadas (dark e light mode).

---

# [STORY] ConfirmModal Genérico

```
Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Modais de Confirmação
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero um componente `ConfirmModal` genérico no design-system, para que qualquer confirmação de ação destrutiva — em qualquer projeto — possa ser construída com aparência e comportamento consistentes, sem depender de contexto específico do Pulso.

---

## ✅ Critérios de Aceite

### Cenário 1 — Renderização básica
**Dado** que `ConfirmModal` é montado com `isOpen={true}`,
**Quando** renderizado,
**Então** exibe overlay escuro, card centralizado, ícone circular, título "Tem certeza?", mensagem customizável, botão "Cancelar" (outlined) e botão de confirmação (danger por padrão).

### Cenário 2 — Fechar ao cancelar ou clicar no overlay
**Dado** que o modal está aberto,
**Quando** o usuário clica em "Cancelar" ou no overlay,
**Então** `onClose()` é chamado e o modal fecha.

### Cenário 3 — Confirmar ação
**Dado** que o modal está aberto,
**Quando** o usuário clica no botão de confirmação,
**Então** `onConfirm()` é chamado; se `loading={true}` for passado, o botão exibe spinner e fica desabilitado.

### Cenário 4 — Fechar com Esc
**Dado** que o modal está aberto,
**Quando** o usuário pressiona a tecla Esc,
**Então** `onClose()` é chamado.

### Cenário 5 — Variante CRITICAL (confirmação por texto)
**Dado** que `ConfirmModal` recebe `variant="critical"` e `confirmationText="EXCLUIR"`,
**Quando** renderizado,
**Então** exibe campo de input com label "Digite 'EXCLUIR' para confirmar"; o botão de confirmação fica desabilitado até que o usuário digite exatamente `"EXCLUIR"`.

### Cenário 6 — Dark/light automático
**Dado** que `.dark` está ativo,
**Quando** o modal é renderizado,
**Então** overlay usa `--ds-color-overlay`, card usa `--ds-color-modal-bg`, ícone circular usa danger com opacidade 15%.

### Cenário 7 — Animação de entrada/saída
**Dado** que `isOpen` muda de `false` para `true`,
**Quando** o modal aparece,
**Então** o overlay faz fade-in e o card faz `animate-scale-in`; ao fechar, animação reversa antes de desmontar.

---

## 🎨 Visual e UX

### Layout (baseado nos protótipos)
* **Overlay:** cobre a tela, `--ds-color-overlay` (rgba com opacidade)
* **Card:** max-width 400px, padding 32px, border-radius `--ds-radius-xl`, sombra `--ds-shadow-lg`
* **Ícone circular:** 72px, fundo danger com opacity 15% (`--ds-color-danger`/15), ícone danger 32px
* **Título:** `"Tem certeza?"`, fonte 20px bold, `--ds-color-text`
* **Mensagem:** fonte 14px, `--ds-color-text-secondary`, centralizado, max ~2 linhas
* **Botões:** linha horizontal, botão Cancelar (ghost/outlined, full width), botão Confirmar (danger, full width)
* **Gap entre botões:** 8px

### Variante CRITICAL
* Mesma estrutura, mas entre mensagem e botões:
  → Label em danger: `"Digite 'EXCLUIR' para confirmar"`
  → Input de texto com border `--ds-color-danger`
  → Botão de confirmação desabilitado enquanto texto ≠ `confirmationText`

---

## 🛠️ Implementação

### `Modal/ConfirmModal.jsx` (NOVO — CRIAR)

> Criar em: `src/design-system/components/overlays/Modal/ConfirmModal.jsx`
> Criar em: `src/design-system/components/overlays/Modal/ConfirmModal.styles.jsx`
> Criar em: `src/design-system/components/overlays/Modal/Modal.jsx` (base modal com overlay, portal, animação)
> Criar em: `src/design-system/components/overlays/Modal/Modal.styles.jsx`

**`Modal.jsx` (base):** gerencia overlay, portal (`ReactDOM.createPortal` → `document.body`), animação de entrada/saída, fecha no Esc e no clique no overlay.

Props do `Modal`:
```
isOpen        boolean
onClose       function
size          "sm" | "md" | "lg"  — default "md"
closeOnOverlay boolean             — default true
children      ReactNode
className     string
```

**`ConfirmModal.jsx`:** usa `Modal` base internamente.

Props do `ConfirmModal`:
```
isOpen           boolean
onClose          function
onConfirm        function
title            string     — default "Tem certeza?"
message          string     — mensagem descritiva
confirmLabel     string     — default "Excluir"
cancelLabel      string     — default "Cancelar"
variant          "danger" | "warning"  — default "danger"
loading          boolean    — exibe spinner no botão de confirmação
icon             ReactNode  — default: ícone de lixeira (Trash2)
variant          "default" | "critical"
confirmationText string     — obrigatório quando variant="critical", ex: "EXCLUIR"
```

### `overlays/index.js` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/overlays/index.js`

→ Exporta: `Modal`, `ConfirmModal`, `Drawer`, `Dropdown`

### `components/index.js` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/index.js`

→ Re-exporta tudo: `export * from './inputs'`, `export * from './selects'`, `export * from './pickers'`, `export * from './buttons'`, `export * from './feedback'`, `export * from './data-display'`, `export * from './navigation'`, `export * from './overlays'`, `export * from './forms'`

---

## 🚫 Regras de Negócio
* `ConfirmModal` não conhece o Pulso — não importa nada de fora do design-system
* `onConfirm` não é chamado automaticamente — o componente pai controla o fluxo (loading, fechar após sucesso)
* `variant="critical"`: comparação do texto é case-sensitive e sem trim — o usuário deve digitar exatamente o valor de `confirmationText`
* O modal usa `ReactDOM.createPortal` para renderizar fora do fluxo DOM normal — garante que z-index funcione corretamente

---

# [STORY] Wrappers de Confirmação Pulso

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Pulso
Relator:     (preencher)
Pai:         [FEATURE] Modais de Confirmação
Data Limite: (preencher)
```

## 📝 Descrição

Como usuário do Pulso, eu quero modais de confirmação com mensagens contextuais para cada tipo de exclusão, para que eu entenda exatamente o que será perdido antes de confirmar uma ação destrutiva.

---

## ✅ Critérios de Aceite

### Cenário 1 — DeleteTransactionModal
**Dado** que o usuário clica em "Excluir" em uma transação chamada "Almoço no RU",
**Quando** o modal é aberto,
**Então** exibe: `"A transação 'Almoço no RU' será excluída permanentemente."` com botão "Excluir".

### Cenário 2 — DeleteGoalModal
**Dado** que o usuário clica em "Excluir" em uma meta chamada "Viagem Macaé",
**Quando** o modal é aberto,
**Então** exibe: `"A meta 'Viagem Macaé' e todos os aportes serão excluídos."` com botão "Excluir".

### Cenário 3 — DeleteTripModal
**Dado** que o usuário clica em "Excluir" em uma viagem chamada "Macaé 2026",
**Quando** o modal é aberto,
**Então** exibe: `"A viagem 'Macaé 2026' e todos os dados relacionados serão excluídos."` com botão "Excluir".

### Cenário 4 — DeleteReminderModal
**Dado** que o usuário clica em "Excluir" em um lembrete chamado "Pagar faculdade",
**Quando** o modal é aberto,
**Então** exibe: `"O lembrete 'Pagar faculdade' será excluído permanentemente."` com botão "Excluir".

### Cenário 5 — DeleteGroupModal
**Dado** que o usuário clica em "Excluir" em um grupo chamado "Viagem Macaé 2026",
**Quando** o modal é aberto,
**Então** exibe: `"O grupo 'Viagem Macaé 2026' e todos os dados serão excluídos."` com botão "Excluir".

### Cenário 6 — LeaveGroupModal
**Dado** que o usuário clica em "Sair" de um grupo chamado "Viagem Macaé 2026",
**Quando** o modal é aberto,
**Então** exibe: `"Você sairá do grupo 'Viagem Macaé 2026'. Você pode entrar novamente depois."` com botão "Sair do grupo".

### Cenário 7 — DeleteAccountModal (crítico)
**Dado** que o usuário acessa "Excluir minha conta",
**Quando** o modal é aberto,
**Então** exibe: `"Sua conta e TODOS os seus dados serão excluídos permanentemente. Esta ação não pode ser desfeita."` com campo de confirmação (digitar "EXCLUIR") e botão "Excluir minha conta" — desabilitado até a confirmação correta.

### Cenário 8 — Loading durante exclusão
**Dado** que o usuário confirma a exclusão,
**Quando** a requisição está em andamento,
**Então** o botão exibe spinner e fica desabilitado; o modal não fecha até a conclusão.

### Cenário 9 — Dark/light herdado
**Dado** que qualquer wrapper está aberto em dark mode,
**Quando** renderizado,
**Então** herda automaticamente o tema do `ConfirmModal` genérico.

---

## 🎨 Visual e UX

Conforme os protótipos anexados. Todos os wrappers usam `ConfirmModal` com `variant="danger"` (exceto LeaveGroupModal que pode usar `variant="warning"`).

---

## 🛠️ Implementação

> **Todos os arquivos abaixo são NOVO — CRIAR**
> Dependência: `ConfirmModal` do design-system deve estar implementado

### `DeleteTransactionModal/DeleteTransactionModal.jsx` (NOVO — CRIAR)

> Criar em: `src/components/features/transactions/DeleteTransactionModal/DeleteTransactionModal.jsx`

Props:
```
isOpen           boolean
onClose          function
onConfirm        function  — (transactionId: string) => Promise<void>
transactionName  string    — nome da transação para exibir na mensagem
transactionId    string
loading          boolean
```

→ Usa `ConfirmModal` com mensagem: `"A transação '${transactionName}' será excluída permanentemente."`

---

### `DeleteGoalModal/DeleteGoalModal.jsx` (NOVO — CRIAR)

> Criar em: `src/components/features/goals/DeleteGoalModal/DeleteGoalModal.jsx`

Props:
```
isOpen      boolean
onClose     function
onConfirm   function  — (goalId: string) => Promise<void>
goalName    string
goalId      string
loading     boolean
```

→ Mensagem: `"A meta '${goalName}' e todos os aportes serão excluídos."`

---

### `DeleteTripModal/DeleteTripModal.jsx` (NOVO — CRIAR)

> Criar em: `src/components/features/trips/DeleteTripModal/DeleteTripModal.jsx`

Props:
```
isOpen      boolean
onClose     function
onConfirm   function  — (tripId: string) => Promise<void>
tripName    string
tripId      string
loading     boolean
```

→ Mensagem: `"A viagem '${tripName}' e todos os dados relacionados serão excluídos."`

---

### `DeleteReminderModal/DeleteReminderModal.jsx` (NOVO — CRIAR)

> Criar em: `src/components/features/reminders/DeleteReminderModal/DeleteReminderModal.jsx`

Props:
```
isOpen        boolean
onClose       function
onConfirm     function  — (reminderId: string) => Promise<void>
reminderName  string
reminderId    string
loading       boolean
```

→ Mensagem: `"O lembrete '${reminderName}' será excluído permanentemente."`

---

### `DeleteGroupModal/DeleteGroupModal.jsx` (NOVO — CRIAR)

> Criar em: `src/components/features/groups/DeleteGroupModal/DeleteGroupModal.jsx`

Props:
```
isOpen      boolean
onClose     function
onConfirm   function  — (groupId: string) => Promise<void>
groupName   string
groupId     string
loading     boolean
```

→ Mensagem: `"O grupo '${groupName}' e todos os dados serão excluídos."`

---

### `LeaveGroupModal/LeaveGroupModal.jsx` (NOVO — CRIAR)

> Criar em: `src/components/features/groups/LeaveGroupModal/LeaveGroupModal.jsx`

Props:
```
isOpen      boolean
onClose     function
onConfirm   function  — (groupId: string) => Promise<void>
groupName   string
groupId     string
loading     boolean
```

→ Usa `ConfirmModal` com `confirmLabel="Sair do grupo"`, `variant="warning"`
→ Mensagem: `"Você sairá do grupo '${groupName}'. Você pode entrar novamente depois."`

---

### `DeleteAccountModal/DeleteAccountModal.jsx` (NOVO — CRIAR)

> Criar em: `src/components/features/auth/DeleteAccountModal/DeleteAccountModal.jsx`

Props:
```
isOpen     boolean
onClose    function
onConfirm  function  — () => Promise<void>
loading    boolean
```

→ Usa `ConfirmModal` com `variant="critical"`, `confirmationText="EXCLUIR"`, `confirmLabel="Excluir minha conta"`
→ Mensagem: `"Sua conta e TODOS os seus dados serão excluídos permanentemente. Esta ação não pode ser desfeita."`

---

## 🚫 Regras de Negócio
* Wrappers Pulso **não contêm lógica de requisição** — `onConfirm` é passado pelo pai (page/hook) e retorna uma Promise
* O modal fecha somente após `onConfirm` resolver com sucesso — controlado pelo estado `loading` passado de fora
* `LeaveGroupModal` usa `variant="warning"` (laranja) — usuário pode rejoinar o grupo
* `DeleteAccountModal` é o único que usa `variant="critical"` com campo de confirmação por texto
* Wrappers **podem** importar do design-system (`ConfirmModal`) — não são agnósticos de projeto

---

# [FEATURE] Botões e Ações

```
Tipo:        Feature
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [EPIC] Design System — Pulso
Data Limite: (preencher)
```

Implementação do sistema completo de botões do design system: variantes semânticas (Primary, Secondary, Ghost, Danger, Success), tamanhos (sm, md, lg), todos os estados interativos (default, hover, active, disabled, loading), e o IconButton circular com suporte a ícone isolado ou com label.

**Dependência:** [STORY] Tokens CSS, Estilos Base e Animações deve estar concluída.

---

# [STORY] Button e IconButton

```
Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Botões e Ações
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero um componente `Button` genérico com variantes semânticas, tamanhos e estados completos, para que todas as ações da interface do Pulso (e de qualquer outro projeto) sejam construídas com consistência visual sem hardcoding de estilos.

---

## ✅ Critérios de Aceite

### Cenário 1 — PRIMARY: estados visuais
**Dado** que um `Button` com `variant="primary"` é renderizado,
**Quando** está em cada estado,
**Então**:
* **DEFAULT**: fundo `--ds-color-primary`, texto branco, sem borda
* **HOVER**: fundo `--ds-color-primary-dark`, leve elevação (`--ds-shadow-sm`), cursor pointer
* **ACTIVE/PRESSED**: fundo mais escuro que hover, scale 0.98, sem sombra
* **DISABLED**: opacity 0.5, cursor not-allowed, nenhum efeito hover/active
* **LOADING**: spinner `animate-spin` no lugar do leftIcon (ou antes do texto se sem ícone), botão não clicável, mesma largura

### Cenário 2 — SECONDARY: estados visuais
**Dado** que `variant="secondary"` é usado,
**Quando** está em cada estado,
**Então**:
* **DEFAULT**: fundo transparente, borda 1.5px `--ds-color-primary`, texto `--ds-color-primary`
* **HOVER**: fundo `--ds-color-primary/10`, borda mantida
* **ACTIVE**: fundo `--ds-color-primary/20`, borda mantida
* **DISABLED**: opacity 0.5, sem interação
* **LOADING**: spinner em `--ds-color-primary`

### Cenário 3 — GHOST: estados visuais
**Dado** que `variant="ghost"` é usado,
**Quando** está em cada estado,
**Então**:
* **DEFAULT**: sem fundo, sem borda, texto `--ds-color-text`
* **HOVER**: fundo `--ds-color-hover`
* **ACTIVE**: fundo `--ds-color-hover` mais intenso
* **DISABLED**: opacity 0.5
* **LOADING**: spinner em `--ds-color-text-secondary`

### Cenário 4 — DANGER: estados visuais
**Dado** que `variant="danger"` é usado,
**Quando** está em cada estado,
**Então**:
* **DEFAULT**: fundo `--ds-color-danger`, texto branco
* **HOVER**: fundo mais escuro que danger via `filter: brightness(0.9)`
* **ACTIVE**: `filter: brightness(0.8)`, scale 0.98
* **DISABLED**: opacity 0.5
* **LOADING**: spinner branco

### Cenário 5 — SUCCESS: estados visuais
**Dado** que `variant="success"` é usado,
**Quando** está em cada estado,
**Então**:
* **DEFAULT**: fundo `--ds-color-success`, texto branco
* **HOVER**: `filter: brightness(0.9)`
* **ACTIVE**: `filter: brightness(0.8)`, scale 0.98
* **DISABLED**: opacity 0.5
* **LOADING**: spinner branco

### Cenário 6 — Tamanhos corretos
**Dado** que `Button` recebe diferentes valores de `size`,
**Quando** renderizado,
**Então**:
* **sm**: altura 32px, fonte 12px, padding 8px 12px
* **md** (padrão): altura 40px, fonte 14px, padding 10px 16px
* **lg**: altura 48px, fonte 16px, padding 12px 24px

### Cenário 7 — Button com ícone
**Dado** que `Button` recebe `leftIcon` ou `rightIcon`,
**Quando** renderizado,
**Então** o ícone exibe à esquerda ou direita do texto com gap 8px; ao LOADING, spinner substitui `leftIcon` mantendo o texto.

### Cenário 8 — Button full width
**Dado** que `fullWidth={true}` é passado,
**Quando** renderizado,
**Então** o botão ocupa 100% do container pai.

### Cenário 9 — Dark/light automático
**Dado** que `.dark` está ativo,
**Quando** qualquer variante é renderizada,
**Então** cores de hover/active adaptam via CSS variables sem alteração de código.

### Cenário 10 — IconButton: circular com ícone
**Dado** que um `IconButton` é renderizado sem `label`,
**Quando** exibido,
**Então** o botão é perfeitamente circular (`border-radius: 50%`), contém apenas o ícone centralizado; tamanhos: sm 32px, md 40px, lg 48px.

### Cenário 11 — IconButton: com label
**Dado** que `IconButton` recebe `label="Editar"`,
**Quando** renderizado,
**Então** o ícone aparece à esquerda do label com gap 6px; border-radius muda para `--ds-radius-full` (pill).

### Cenário 12 — IconButton: variantes semânticas
**Dado** que `IconButton` recebe `variant`,
**Quando** renderizado,
**Então** aplica exatamente as mesmas regras de cor e estado do `Button` para cada variante.

---

## 🎨 Visual e UX

### Button — especificações de tamanho

| Tamanho | Altura | Font-size | Padding | Border-radius |
|---|---|---|---|---|
| sm | 32px | 12px | 8px 12px | `--ds-radius-md` (8px) |
| md | 40px | 14px | 10px 16px | `--ds-radius-md` (8px) |
| lg | 48px | 16px | 12px 24px | `--ds-radius-md` (8px) |

* **Font-weight:** 600 (semi-bold)
* **Transição:** `--ds-transition-fast` (150ms ease) para bg, color, shadow, transform
* **Spinner loading:** ícone `Loader2` de `lucide-react` com `animate-spin`; tamanho: 14px (sm), 16px (md), 18px (lg)

### IconButton — especificações de tamanho

| Tamanho | Diâmetro (sem label) | Ícone | Border-radius (com label) |
|---|---|---|---|
| sm | 32px | 16px | `--ds-radius-full` |
| md | 40px | 20px | `--ds-radius-full` |
| lg | 48px | 24px | `--ds-radius-full` |

* **Com label:** padding lateral 8px 16px, layout flex com gap 6px

---

## 🛠️ Implementação

### `Button/Button.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/buttons/Button/Button.jsx`
> Criar: `src/design-system/components/buttons/Button/Button.styles.jsx`

Props:
```
variant    "primary" | "secondary" | "ghost" | "danger" | "success"   — default "primary"
size       "sm" | "md" | "lg"                                          — default "md"
leftIcon   ReactNode    — ícone à esquerda do texto
rightIcon  ReactNode    — ícone à direita do texto
loading    boolean      — exibe spinner, desabilita clique
disabled   boolean
fullWidth  boolean      — width: 100%
type       "button" | "submit" | "reset"                              — default "button"
onClick    function
children   ReactNode    — texto do botão
className  string
...rest    —            — repassados ao <button>
```

Implementação:
→ Elemento base: `<button type={type}>`
→ `disabled` ou `loading`: adiciona `disabled` nativo + `aria-disabled` + `pointer-events: none`
→ `loading`: substitui `leftIcon` por `<Loader2 className="animate-spin">` — se não houver `leftIcon`, spinner aparece antes de `children`
→ CVA no `Button.styles.jsx`: variants `variant`, `size`, `fullWidth`, `loading`
→ Todos os valores de cor via `var(--ds-color-*)` — sem hex hardcoded

### `IconButton/IconButton.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/buttons/IconButton/IconButton.jsx`
> Criar: `src/design-system/components/buttons/IconButton/IconButton.styles.jsx`

Props:
```
icon       ReactNode    — ícone a exibir (obrigatório)
label      string       — texto ao lado do ícone (opcional; se omitido, botão circular)
variant    "primary" | "secondary" | "ghost" | "danger" | "success"  — default "ghost"
size       "sm" | "md" | "lg"    — default "md"
loading    boolean
disabled   boolean
tooltip    string       — texto do tooltip nativo (acessibilidade quando sem label)
onClick    function
className  string
aria-label string       — OBRIGATÓRIO quando sem label para acessibilidade
...rest
```

→ Sem `label`: `border-radius: 50%`, dimensão fixa por `size`
→ Com `label`: `border-radius: --ds-radius-full`, padding lateral, layout flex

### `buttons/index.js` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/buttons/index.js`

→ Exporta: `Button`, `IconButton`

---

## 🚫 Regras de Negócio
* `Button` e `IconButton` são componentes **puros de apresentação** — não acessam store, não fazem HTTP
* O estado `loading` desabilita automaticamente o clique — o pai não precisa checar isso separadamente
* `IconButton` sem `label` DEVE receber `aria-label` ou `tooltip` para acessibilidade
* A prop `loading` não altera a largura do botão — dimensões são fixadas no render (sem layout shift)
* Hover/active de `danger` e `success` usam `filter: brightness()` no CSS — sem valores hex hardcoded

---

# [FEATURE] Feedback e Alertas

```
Tipo:        Feature
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [EPIC] Design System — Pulso
Data Limite: (preencher)
```

Implementação dos componentes de feedback ao usuário: `Toast` (notificação flutuante com auto-dismiss, progress bar e stacking), `Alert` (mensagem inline semântica), `Spinner` (indicador de carregamento) e `Skeleton` (placeholder animado durante carregamento de dados).

**Dependência:** [STORY] Tokens CSS, Estilos Base e Animações + [STORY] Button e IconButton.

---

# [STORY] Toast

```
Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Feedback e Alertas
Data Limite: (preencher)
```

## 📝 Descrição

Como usuário, eu quero receber feedbacks não-invasivos no canto superior direito da tela, para que eu saiba o resultado das minhas ações (salvar, excluir, erros) sem interromper o fluxo de trabalho.

---

## ✅ Critérios de Aceite

### Cenário 1 — Exibe e auto-fecha em 4s
**Dado** que `toast.success("Transação salva com sucesso")` é chamado,
**Quando** o Toast aparece,
**Então** desliza da direita em 200ms, exibe ícone verde + título "Sucesso" + mensagem; após 4s, fecha com animação de saída.

### Cenário 2 — Progress bar de tempo
**Dado** que um Toast está visível,
**Quando** o tempo passa,
**Então** a barra de progresso na parte inferior do card encolhe da direita para a esquerda em 4s; a barra tem a cor semântica do tipo.

### Cenário 3 — Fechar manualmente
**Dado** que um Toast está visível,
**Quando** o usuário clica no botão X,
**Então** o Toast fecha imediatamente com animação de saída.

### Cenário 4 — Empilhamento (máx. 3 visíveis)
**Dado** que 3 toasts já estão visíveis,
**Quando** um 4º toast é disparado,
**Então** o mais antigo desaparece e o novo aparece; nunca mais de 3 visíveis simultaneamente; empilhados verticalmente com gap 8px.

### Cenário 5 — 4 tipos semânticos
**Dado** que `toast.success()`, `toast.error()`, `toast.warning()` e `toast.info()` são chamados,
**Quando** cada um aparece,
**Então**:
* **success**: ícone `CheckCircle` círculo `--ds-color-success`, título "Sucesso", barra verde
* **error**: ícone `XCircle` círculo `--ds-color-danger`, título "Erro", barra vermelha
* **warning**: ícone `AlertTriangle` círculo `--ds-color-warning`, título "Atenção", barra âmbar
* **info**: ícone `Info` círculo `--ds-color-info`, título "Informação", barra azul

### Cenário 6 — Pause no hover
**Dado** que um Toast está visível com auto-dismiss ativo,
**Quando** o cursor entra no Toast,
**Então** o timer pausa (barra para de encolher); ao sair, o timer retoma de onde parou.

### Cenário 7 — Dark/light automático
**Dado** que `.dark` está ativo,
**Quando** um Toast aparece,
**Então** fundo usa `--ds-color-modal-bg` (#09090B dark), ícone e barra mantêm cores semânticas.

### Cenário 8 — Toast com ação
**Dado** que o toast é criado com `action: { label: "Ver", onClick: fn }`,
**Quando** exibido,
**Então** aparece um link clicável abaixo da mensagem; clicar chama `onClick` e fecha o toast.

---

## 🎨 Visual e UX

### Especificações (baseadas no protótipo)
* **Posição:** `position: fixed`, `top: 16px`, `right: 16px`, z-index `--ds-z-toast` (300)
* **Max-width:** 360px
* **Padding:** 16px
* **Border-radius:** `--ds-radius-lg` (12px)
* **Sombra:** `--ds-shadow-lg`
* **Animação entrada:** slide da direita + fade-in, 200ms ease
* **Animação saída:** slide para direita + fade-out, 200ms ease
* **Gap entre toasts empilhados:** 8px
* **Border left:** 4px solid `[cor semântica]` — accent lateral esquerdo

### Estrutura interna de cada Toast
```
[ícone circular 48px] [título + mensagem] [botão X]
[barra de progresso (bottom, largura encolhendo)]
[ação opcional]
```

* **Ícone:** círculo 48px, fundo `[cor]/15`, ícone `[cor]` 24px centralizado
* **Título:** 14px bold, cor semântica
* **Mensagem:** 13px, `--ds-color-text-secondary`
* **Botão X:** `IconButton` ghost 20px, `--ds-color-text-secondary`
* **Progress bar:** height 4px, `border-radius: 0 0 12px 12px`, trilha `[cor]/30`, barra `[cor semântica]`

---

## 🛠️ Implementação

### `Toast/Toast.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/feedback/Toast/Toast.jsx`
> Criar: `src/design-system/components/feedback/Toast/Toast.styles.jsx`
> Criar: `src/design-system/components/feedback/Toast/ToastContainer.jsx`
> Criar: `src/design-system/hooks/useToast.js`

Props do `Toast` (item individual):
```
id          string    — gerado automaticamente
type        "success" | "error" | "warning" | "info"   — default "info"
title       string    — se omitido, usa título padrão do tipo
message     string
duration    number    — ms para auto-dismiss (default 4000; 0 = não fecha automaticamente)
onClose     function
action      { label: string, onClick: function }  — opcional
```

`useToast.js`:
→ Exporta `{ toast }` onde `toast.success(msg)`, `toast.error(msg)`, `toast.warning(msg)`, `toast.info(msg)`
→ Cada chamada cria `{ id, type, message, title? }` e adiciona à fila
→ Máximo 3 visíveis: 4º remove o mais antigo
→ `toast.dismiss(id)` remove um toast específico
→ Implementado com `useState` + `ToastContext` + `ToastProvider`

`ToastContainer.jsx`:
→ `ReactDOM.createPortal(container, document.body)`
→ `position: fixed`, `top: 16px`, `right: 16px`, z-index `var(--ds-z-toast)`
→ Renderiza lista de `<Toast>` com animações de entrada/saída

### `feedback/index.js` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/feedback/index.js`

→ Exporta: `Toast`, `ToastContainer`, `Alert`, `Spinner`, `Skeleton`, `EmptyState`, `ErrorState`

### `hooks/index.js` (EXISTENTE — PREENCHER)

→ Adicionar export: `useToast`

---

## 🚫 Regras de Negócio
* `useToast` é o único ponto de disparo de toasts — componentes não instanciam `<Toast>` diretamente
* `ToastContainer` deve ser montado uma única vez no topo da árvore (`App.jsx`) usando portal
* Auto-dismiss pausa quando o cursor está sobre o toast (preserva o tempo restante)
* Toast com `duration=0` não fecha automaticamente — somente via X ou `toast.dismiss(id)`
* Máximo de 3 toasts visíveis; o 4º remove o mais antigo da fila (FIFO)

---

# [STORY] Alert, Spinner e Skeleton

```
Tipo:        Story
Prioridade:  🔺 Highest
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Feedback e Alertas
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero componentes de feedback inline (Alert), indicadores de carregamento (Spinner) e placeholders animados (Skeleton), para que estados de loading, erros e avisos dentro de formulários e listas sejam comunicados visualmente de forma padronizada.

---

## ✅ Critérios de Aceite

### Cenário 1 — Alert: 4 tipos semânticos
**Dado** que `Alert` é renderizado com `type="success"`,
**Quando** exibido,
**Então** exibe fundo `--ds-color-success/10`, borda lateral 4px `--ds-color-success`, ícone `CheckCircle` 20px verde, título e mensagem na cor semântica.

### Cenário 2 — Alert: tipos disponíveis
**Dado** que `type` é definido,
**Quando** renderizado,
**Então**: `success` → verde | `error` → vermelho | `warning` → âmbar | `info` → azul.

### Cenário 3 — Alert: fechável
**Dado** que `Alert` recebe `dismissible={true}`,
**Quando** o usuário clica no X,
**Então** some com fade-out 150ms e `onDismiss()` é chamado.

### Cenário 4 — Alert: apenas mensagem (sem título)
**Dado** que `Alert` não recebe `title`,
**Quando** renderizado,
**Então** exibe apenas ícone + mensagem em uma única linha.

### Cenário 5 — Spinner: tamanhos
**Dado** que `Spinner` é renderizado,
**Quando** em diferentes `size`,
**Então**: sm 16px (border 2px) | md 24px (border 3px, padrão) | lg 40px (border 4px) | xl 64px (border 5px); cor padrão `--ds-color-primary`; `animate-spin` 600ms linear infinite.

### Cenário 6 — Spinner: fullscreen overlay
**Dado** que `SpinnerOverlay` é renderizado,
**Quando** uma operação assíncrona está em andamento,
**Então** exibe overlay escuro (`#09090B` com 80% opacity) cobrindo toda a tela, spinner xl (64px) centralizado na cor `#7C3AED`, texto opcional abaixo do spinner ("Carregando..."), e bloqueia interação com o conteúdo abaixo.

### Cenário 7 — Spinner: dots (3 pontinhos)
**Dado** que `SpinnerDots` é renderizado,
**Quando** usado em contextos com restrição de espaço (botões, inputs, cards),
**Então** exibe 3 pontos (8px cada com espaçamento 4px) pulsando em sequência, cores: `#7C3AED` (spinner), `#A78BFA` (spinner alt), `#A1A1AA` (track); animação pulse com 1.2s de duração, timing ease-in-out, repeat infinito.

### Cenário 8 — Skeleton: placeholder com shimmer
**Dado** que `Skeleton` é renderizado,
**Quando** exibido,
**Então** mostra retângulo com fundo `--ds-color-border` e animação de shimmer (gradiente deslizando da esquerda para direita continuamente em 1.5s).

### Cenário 7 — Skeleton: variantes de forma
**Dado** que `Skeleton` recebe `variant`,
**Quando** renderizado,
**Então**:
* **text**: altura 14px, border-radius 4px
* **title**: altura 20px, border-radius 4px
* **avatar**: círculo, tamanho via `size` prop
* **card**: retângulo com border-radius 8px
* **button**: altura 40px (md), border-radius 8px

---

## 🎨 Visual e UX

### Alert
* **Padding:** 16px | **Border-radius:** `--ds-radius-md` | **Border-left:** 4px solid `[cor]`
* **Fundo:** `[cor]/10` | **Ícone:** 20px | **Título:** 14px bold | **Mensagem:** 13px `--ds-color-text`

### Spinner
* **Spinner circular:** Implementado com `<span>` + CSS border — sem SVG; `border-top-color: transparent`, resto `currentColor`; cor via prop `color` ou herança
* **Spinner fullscreen (overlay):** `position: fixed`, `inset: 0`, `z-index: 9999`, fundo `#09090B/80`, spinner xl (64px) centralizado com cor `#7C3AED`, texto opcional abaixo
* **Spinner dots (3 pontinhos):** 3 `<span>` inline com animação pulse defasada (0s, 0.2s, 0.4s); cada dot tem 8px de diâmetro, border-radius 50%, espaçamento 4px; cores: `#7C3AED` (spinner), `#A78BFA` (spinner alt), `#A1A1AA` (track)

### Skeleton
* **Shimmer keyframe:** `translateX(-100%) → translateX(100%)`, 1.5s linear infinite
* Gradiente: `linear-gradient(90deg, transparent, [shimmer-highlight] 50%, transparent)`
* Base dark: `--ds-color-border` | Highlight dark: `--ds-color-surface` mais claro
* Base light: `--ds-color-border` (#E4E4E7) | Highlight light: `#FFFFFF`

---

## 🛠️ Implementação

### `Alert/Alert.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/feedback/Alert/Alert.jsx`
> Criar: `src/design-system/components/feedback/Alert/Alert.styles.jsx`

Props:
```
type         "success" | "error" | "warning" | "info"   — default "info"
title        string    — opcional; se omitido, layout single-line
message      string    — ou usar children
dismissible  boolean
onDismiss    function
icon         ReactNode — sobrescreve ícone padrão
className    string
children     ReactNode
```

### `Spinner/Spinner.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/feedback/Spinner/Spinner.jsx`

Props:
```
size      "sm" | "md" | "lg" | "xl" | number  — default "md"
color     string                             — CSS color; default "var(--ds-color-primary)"
label     string                             — aria-label; default "Carregando..."
className string
```

→ Elemento: `<span role="status" aria-label={label}>` com CSS puro

### `SpinnerOverlay/SpinnerOverlay.jsx` (NOVO — CRIAR)

> Criar: `src/design-system/components/feedback/SpinnerOverlay/SpinnerOverlay.jsx`

Props:
```
text      string    — texto opcional abaixo do spinner
label     string    — aria-label; default "Carregando..."
className string
```

→ Overlay fullscreen com Portal React + spinner centralizado xl (64px)
→ `position: fixed`, `inset: 0`, `z-index: 9999`, fundo `#09090B/80`
→ Spinner na cor `#7C3AED`

### `SpinnerDots/SpinnerDots.jsx` (NOVO — CRIAR)

> Criar: `src/design-system/components/feedback/SpinnerDots/SpinnerDots.jsx`

Props:
```
label     string    — aria-label; default "Carregando..."
className string
```

→ 3 dots (8px cada) pulsando em sequência
→ Cores: `#7C3AED`, `#A78BFA`, `#A1A1AA` (track)
→ Animação: pulse 1.2s ease-in-out infinite, com delay 0s/0.2s/0.4s

### `Skeleton/Skeleton.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/feedback/Skeleton/Skeleton.jsx`

Props:
```
variant   "text" | "title" | "avatar" | "card" | "button"  — default "text"
width     string | number
height    string | number
size      number    — para variant="avatar": diâmetro (default 40)
className string
```

→ `aria-hidden="true"` — elemento decorativo
→ Shimmer via pseudoelemento `::after` com keyframe `shimmer`

---

## 🚫 Regras de Negócio
* `Alert` é para feedback **inline** (dentro de form/card) — para feedback global/flutuante usar `Toast`
* `Spinner` circular não exibe texto — usar `aria-label` para screen readers
* `SpinnerOverlay` bloqueia interação com a página — usar apenas para operações críticas (login, pagamento, envio de dados)
* `SpinnerDots` é recomendado para contextos compactos (botões carregando, inputs com autocomplete, mini-cards)
* `Skeleton` deve ter as mesmas dimensões do conteúdo que vai substituir (sem layout shift)
* `Skeleton` é `aria-hidden` — não deve ser anunciado por screen readers

---

# [FEATURE] Estados Vazios e de Erro

```
Tipo:        Feature
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [EPIC] Design System — Pulso
Data Limite: (preencher)
```

Implementação de `EmptyState` e `ErrorState`: componentes de estado que aparecem quando uma lista não tem dados ou quando uma requisição falha.

---

# [STORY] EmptyState e ErrorState

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Estados Vazios e de Erro
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero componentes padronizadas de estado vazio e estado de erro, para que listas sem dados e falhas de requisição tenham aparência consistente em todas as páginas do Pulso.

---

## ✅ Critérios de Aceite

### Cenário 1 — EmptyState: layout padrão
**Dado** que uma lista retorna 0 itens,
**Quando** `EmptyState` é renderizado,
**Então** exibe: ícone centralizado (60px, `--ds-color-text-secondary`) + título bold + descrição em text-secondary + botão de ação opcional (`Button` primary).

### Cenário 2 — EmptyState: tamanho compacto
**Dado** que `size="compact"` é passado,
**Quando** renderizado em card pequeno ou dropdown,
**Então** ícone reduz para 40px, fontes e espaçamento reduzem.

### Cenário 3 — ErrorState: layout padrão
**Dado** que uma requisição falha,
**Quando** `ErrorState` é renderizado,
**Então** exibe: ícone `AlertCircle` 60px `--ds-color-danger` + título "Algo deu errado" + mensagem de erro + botão "Tentar novamente" (`Button` variant="secondary").

### Cenário 4 — ErrorState: callback de retry
**Dado** que `ErrorState` recebe `onRetry`,
**Quando** o usuário clica em "Tentar novamente",
**Então** `onRetry()` é chamado.

---

## 🎨 Visual e UX

* **Alinhamento:** `flex column, align-items center, justify-content center`
* **Gap entre elementos:** 12px
* **Padding:** 32px (padrão) / 16px (compact)
* **Título:** 16px semi-bold, `--ds-color-text`
* **Descrição:** 14px, `--ds-color-text-secondary`, max-width 300px, text-align center

---

## 🛠️ Implementação

### `EmptyState/EmptyState.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/feedback/EmptyState/EmptyState.jsx`

Props:
```
icon         ReactNode    — default: ícone `Inbox` de lucide-react
title        string       — default "Nenhum item encontrado"
description  string
action       { label: string, onClick: function, variant?: string }
size         "default" | "compact"
className    string
```

### `ErrorState/ErrorState.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/feedback/ErrorState/ErrorState.jsx`

Props:
```
title        string     — default "Algo deu errado"
message      string
onRetry      function
retryLabel   string     — default "Tentar novamente"
size         "default" | "compact"
className    string
```

---

## 🚫 Regras de Negócio
* `EmptyState` é puramente apresentacional — sem estado interno
* `ErrorState` não captura erros JS — `ErrorBoundary` é responsabilidade do app
* Ambos herdam o background do pai — sem `background-color` própria

---

# [FEATURE] Exibição de Dados

```
Tipo:        Feature
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [EPIC] Design System — Pulso
Data Limite: (preencher)
```

Implementação dos componentes de exibição de dados: `Avatar`, `AvatarGroup`, `Badge`, `Tooltip`, `Card`, `ProgressBar`, `ProgressCircle` e `Table`.

**Dependência:** [STORY] Tokens CSS, Estilos Base e Animações.

---

# [STORY] Avatar, Badge e Tooltip

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Exibição de Dados
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero componentes de exibição pontual (Avatar, Badge, Tooltip) padronizados, para que esses elementos sejam consistentes em todas as telas do Pulso.

---

## ✅ Critérios de Aceite

### Cenário 1 — Avatar: imagem com fallback
**Dado** que `Avatar` recebe `src` com URL válida,
**Quando** a imagem carrega,
**Então** exibe foto circular; **se** a imagem falha ou `src` não é fornecido, exibe iniciais do `name` com fundo gerado por hash do nome (cor consistente para o mesmo nome) em `primary/20` e texto primary.

### Cenário 2 — Avatar: tamanhos
**Dado** que `Avatar` recebe `size`,
**Quando** renderizado,
**Então**: xs 24px | sm 32px | md 40px (padrão) | lg 48px | xl 64px.

### Cenário 3 — Avatar: indicador de status
**Dado** que `Avatar` recebe `status="online"`,
**Quando** exibido,
**Então** dot 10px `--ds-color-success` no canto inferior direito com borda 2px `--ds-color-background`.

### Cenário 4 — AvatarGroup: truncamento
**Dado** que `AvatarGroup` recebe 5 usuários com `max={3}`,
**Quando** renderizado,
**Então** exibe 3 avatares sobrepostos (margin-left negativo) + badge "+2" no final.

### Cenário 5 — Badge: variantes semânticas
**Dado** que `Badge` recebe `variant`,
**Quando** renderizado,
**Então**: success | danger | warning | info | primary → fundo `[cor]/15`, texto `[cor]`; default → fundo `--ds-color-surface`, texto `--ds-color-text-secondary`, borda `--ds-color-border`.

### Cenário 6 — Badge: dot e tamanhos
**Dado** que `Badge` é configurado,
**Quando** renderizado,
**Então**: sm (font 11px, padding 2px 6px) | md (font 12px, padding 4px 8px, padrão) | lg (font 13px, padding 4px 10px); `dot={true}` → círculo 6px da cor semântica antes do texto.

### Cenário 6.1 — Badge: shape pill vs rounded
**Dado** que `Badge` recebe `shape`,
**Quando** renderizado,
**Então**: `pill` (padrão) → `border-radius: 999px` (cápsula completa); `rounded` → `border-radius: 6px` (bordas suaves quadradas).

### Cenário 6.2 — Badge: categorias Pulso-specific
**Dado** que o projeto Pulso define 10 categorias de badges com cores fixas (Recurso, Status Meta, Tipo de Meta, Prioridade, Perfil/Modo, Papel no Grupo, Sincronização, Transação, Nível Financeiro, Genérico),
**Quando** usados no Pulso,
**Então** cada categoria usa cores específicas conforme prototipos (ex: VA verde, VR laranja, VT azul, Admin roxo, etc.) declaradas em wrappers Pulso-specific que consomem o `Badge` genérico.

### Cenário 7 — Tooltip: aparece no hover com delay
**Dado** que um elemento tem `Tooltip` como wrapper,
**Quando** o cursor entra no elemento,
**Então** após 300ms aparece tooltip com texto; posicionado acima por padrão; arrow triangular aponta para o elemento.

### Cenário 8 — Tooltip: posicionamento
**Dado** que `Tooltip` recebe `placement`,
**Quando** renderizado,
**Então** aceita `"top"` (padrão), `"bottom"`, `"left"`, `"right"`.

---

## 🎨 Visual e UX

### Avatar
* `border-radius: 50%`, overflow hidden
* Fallback: `stringToHue(name)` gera hue 0–360 consistente; fundo `hsl(hue, 60%, 30%)` dark / `hsl(hue, 60%, 90%)` light; iniciais em maiúsculo (máx. 2 letras)
* Status dot: `position: absolute; bottom: 0; right: 0`

### Badge
* **Shape pill (padrão):** `border-radius: 999px` (cápsula completa, extremidades totalmente arredondadas)
* **Shape rounded:** `border-radius: 6px` (bordas suaves quadradas)
* **Font-weight:** 600, `line-height: 1`
* **Categorias Pulso:** wrappers específicos importam `Badge` genérico + aplicam cores fixas (ex: `ResourceBadge`, `StatusMetaBadge`, `PrioridadeBadge`, etc.)

### Tooltip
* **Max-width:** 200px | **Padding:** 6px 10px | **Font:** 12px
* **Background:** `--ds-color-tooltip-bg` (invertido do modo) | **Texto:** `--ds-color-tooltip-text`
* **Arrow:** triângulo CSS 6px | **z-index:** `--ds-z-tooltip` (400) | **Delay:** 300ms

---

## 🛠️ Implementação

### `Avatar/Avatar.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/data-display/Avatar/Avatar.jsx`
> Criar: `src/design-system/components/data-display/Avatar/AvatarGroup.jsx`

Props do `Avatar`:
```
src        string
name       string    — para fallback e alt
size       "xs" | "sm" | "md" | "lg" | "xl" | number  — default "md"
status     "online" | "busy" | "offline" | null
className  string
```

Props do `AvatarGroup`:
```
users      { src?: string, name: string }[]
max        number    — default 3
size       string
className  string
```

Lógica do fallback:
→ `stringToHue(name)`: soma charCodes, módulo 360
→ Iniciais: `name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()`
→ Usar `onError` no `<img>` para acionar fallback

### `Badge/Badge.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/data-display/Badge/Badge.jsx`
> Criar: `src/design-system/components/data-display/Badge/Badge.styles.jsx`

Props:
```
variant   "success" | "danger" | "warning" | "info" | "primary" | "default"  — default "default"
size      "sm" | "md" | "lg"   — default "md"
shape     "pill" | "rounded"  — default "pill"
dot       boolean
icon      ReactNode
children  ReactNode
className string
```

### `Tooltip/Tooltip.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/data-display/Tooltip/Tooltip.jsx`

Props:
```
content    string | ReactNode
placement  "top" | "bottom" | "left" | "right"  — default "top"
delay      number    — default 300ms
disabled   boolean
children   ReactNode
className  string
```

→ `useRef` + `useState` + `setTimeout` para delay
→ `position: absolute` relativo ao wrapper (`position: relative`)

### `data-display/index.js` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/data-display/index.js`

→ Exporta: `Avatar`, `AvatarGroup`, `Badge`, `Tooltip`, `Card`, `ProgressBar`, `ProgressCircle`, `Table`

---

## 🚫 Regras de Negócio
* `Avatar` com `src` inválido/quebrado DEVE exibir fallback — `onError` no `<img>`
* `AvatarGroup` exibe `+N` quando `users.length > max` (N = users.length - max)
* `Badge` é somente leitura — sem interação click nativa
* `Badge` genérico não define cores fixas para categorias Pulso — wrappers Pulso-specific (`ResourceBadge`, `StatusMetaBadge`, etc.) importam `Badge` e aplicam cores conforme prototipos
* `Tooltip` não funciona em elementos `disabled` nativos — envolver em `<span>` no pai

---

# [STORY] Card, ProgressBar e ProgressCircle

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Exibição de Dados
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero componentes de container (Card) e de progresso (ProgressBar, ProgressCircle), para que cards do dashboard e indicadores de metas/orçamentos sejam construídos com consistência visual.

---

## ✅ Critérios de Aceite

### Cenário 1 — Card: container genérico
**Dado** que `Card` envolve qualquer conteúdo,
**Quando** renderizado,
**Então** exibe container com fundo `--ds-color-surface`, border-radius `--ds-radius-lg` (12px), `--ds-shadow-sm` (light) / sem sombra (dark), padding padrão 20px.

### Cenário 2 — Card: variantes
**Dado** que `Card` recebe `variant`,
**Quando** renderizado,
**Então**: **default** → surface + shadow | **outlined** → borda `--ds-color-border`, sem sombra | **elevated** → `--ds-shadow-md` | **ghost** → transparente, sem borda | **accent** → borda lateral esquerda 4px colorida (cor definida por `accentColor`).

### Cenário 2.1 — Card: variante accent com cores semânticas
**Dado** que `Card` recebe `variant="accent"` e `accentColor="success"`,
**Quando** renderizado,
**Então** exibe borda lateral 4px `--ds-color-success`; aceita `"primary"`, `"success"`, `"warning"`, `"danger"`, `"info"` ou valor CSS direto.

### Cenário 3 — Card: header e footer com bordas
**Dado** que `Card` recebe `header` e/ou `footer`,
**Quando** renderizado,
**Então** header tem `border-bottom: 1px solid --ds-color-border`; footer tem `border-top`.

### Cenário 4 — ProgressBar: preenchimento dinâmico
**Dado** que `ProgressBar` recebe `value={65}` e `max={100}`,
**Quando** renderizado,
**Então** exibe trilha `--ds-color-border` com barra 65% da largura; transição `width 300ms ease` ao mudar valor.

### Cenário 5 — ProgressBar: variantes de cor
**Dado** que `ProgressBar` recebe `variant`,
**Quando** renderizado,
**Então**: primary | success | warning | danger → cada um com sua cor semântica.

### Cenário 6 — ProgressBar: overflow em danger
**Dado** que `value > max`,
**Quando** renderizado,
**Então** barra fica 100% preenchida e muda automaticamente para `variant="danger"`.

### Cenário 7 — ProgressCircle: anel SVG
**Dado** que `ProgressCircle` recebe `value={75}`,
**Quando** renderizado,
**Então** anel de fundo `--ds-color-border` + anel de progresso 75% no sentido horário; centro exibe `children` (ex: "75%").

### Cenário 8 — ProgressCircle: tamanhos
**Dado** que `ProgressCircle` recebe `size`,
**Quando** renderizado,
**Então**: sm 48px | md 80px (padrão) | lg 120px | xl 160px; stroke-width escala proporcionalmente.

---

## 🎨 Visual e UX

### Card
* **Padding variants:** none (0) | sm (12px) | default (20px) | lg (32px)
* **Card clicável:** `onClick` ativa `cursor: pointer` + hover fundo `--ds-color-hover`

### ProgressBar
* **Altura:** sm 4px | md 8px (padrão) | lg 12px
* **Border-radius:** `--ds-radius-full` nas extremidades
* **Label:** quando `showLabel`, exibe "X%" à direita em `--ds-color-text-secondary`

### ProgressCircle
* **SVG nativo:** `stroke-dasharray` + `stroke-dashoffset` animado em 500ms ease
* **stroke-linecap:** `round` (extremidades arredondadas)
* **Trilha:** `--ds-color-border` | **Progresso:** cor do `variant`

---

## 🛠️ Implementação

### `Card/Card.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/data-display/Card/Card.jsx`
> Criar: `src/design-system/components/data-display/Card/Card.styles.jsx`

Props:
```
variant      "default" | "outlined" | "elevated" | "ghost" | "accent"  — default "default"
accentColor  string    — quando variant="accent": "primary" | "success" | "warning" | "danger" | "info" ou CSS color
padding      "none" | "sm" | "default" | "lg"               — default "default"
radius       string
header       ReactNode
footer       ReactNode
onClick      function
className    string
children     ReactNode
```

→ `Card` com `onClick`: adicionar `role="button"` e `tabIndex={0}`

### `ProgressBar/ProgressBar.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/data-display/ProgressBar/ProgressBar.jsx`

Props:
```
value      number
max        number    — default 100
variant    "primary" | "success" | "warning" | "danger"  — default "primary"
size       "sm" | "md" | "lg"  — default "md"
showLabel  boolean
className  string
```

### `ProgressCircle/ProgressCircle.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/data-display/ProgressCircle/ProgressCircle.jsx`

Props:
```
value       number
max         number    — default 100
variant     "primary" | "success" | "warning" | "danger"  — default "primary"
size        "sm" | "md" | "lg" | "xl" | number  — default "md"
strokeWidth number    — padrão proporcional ao size
children    ReactNode — conteúdo central
className   string
```

→ `radius = (size / 2) - strokeWidth`
→ `circumference = 2 * Math.PI * radius`
→ `strokeDashoffset = circumference * (1 - value / max)`

---

## 🚫 Regras de Negócio
* `Card` não define altura — cresce com o conteúdo
* `Card` com `variant="accent"` e `accentColor`: se `accentColor` é chave semântica ("success"), usa `var(--ds-color-success)`; se é valor CSS (#FF0000), usa direto
* `ProgressBar` com `value > max`: renderiza 100% + muda `variant` internamente para `"danger"`
* `ProgressCircle` usa SVG nativo — sem biblioteca de charts
* `ProgressCircle` com `value > max` ou `value < 0`: clampa em [0, max]

---

# [STORY] ResourceCard (Pulso)

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Pulso
Relator:     (preencher)
Pai:         [FEATURE] Exibição de Dados
Data Limite: (preencher)
```

## 📝 Descrição

Como usuário do Pulso, eu quero visualizar meus recursos financeiros (Dinheiro, VA, VR, VT, Saldo total) em cards grandes e coloridos, para que eu identifique rapidamente quanto tenho disponível em cada categoria.

---

## ✅ Critérios de Aceite

### Cenário 1 — ResourceCard: estrutura visual
**Dado** que `ResourceCard` recebe `type="DINHEIRO"` e `value={2356.40}`,
**Quando** renderizado,
**Então** exibe: ícone grande 64px colorido em fundo matching (`--ds-color-primary/15`) + label "Dinheiro" + valor R$ 2.356,40 em fonte grande colorida (`--ds-color-primary`) + subtexto "Disponível" com dot verde.

### Cenário 2 — ResourceCard: 5 tipos com cores específicas
**Dado** que `type` é definido,
**Quando** renderizado,
**Então** cada tipo usa cores conforme Readme.md:
* **DINHEIRO**: `--ds-color-primary` (#7C3AED / #A78BFA)
* **VA**: `#059669` / `#34D399` (green)
* **VR**: `#EA580C` / `#FB923C` (orange)
* **VT**: `#2563EB` / `#60A5FA` (blue)
* **SALDO_TOTAL**: `--ds-color-primary`

### Cenário 3 — ResourceCard: subtexto dinâmico
**Dado** que `ResourceCard` recebe `subtitle`,
**Quando** renderizado,
**Então** exibe abaixo do valor: dot 8px (verde "Disponível" | amarelo "Sugestão de uso: R$ 24,90 por dia" | verde com seta "↑ 8,2% em relação a abril").

### Cenário 4 — ResourceCard: estados visuais (hover)
**Dado** que a tela é desktop e `onClick` é fornecido,
**Quando** o cursor passa sobre o card,
**Então** fundo muda para `--ds-color-hover`, cursor `pointer`, borda sutil `rgba(primary, 0.3)`.

### Cenário 5 — Dark/light automático
**Dado** que `.dark` está ativo,
**Quando** renderizado,
**Então** fundo usa `--ds-color-surface`, cores dos ícones/valores adaptam automaticamente.

---

## 🎨 Visual e UX

### Layout (baseado no protótipo)
* **Container:** padding 32px, border-radius `--ds-radius-xl` (16px), fundo `--ds-color-surface`, `--ds-shadow-sm` (light mode) / sem sombra (dark mode)
* **Ícone:** 64px, fundo `[cor]/15`, ícone `[cor]` 32px centralizado no círculo
* **Label:** 16px, `--ds-color-text-secondary`, margin-top 16px
* **Valor:** 40px bold, `[cor do tipo]`, margin-top 8px
* **Subtexto:** 14px, `--ds-color-text-secondary`, margin-top 8px, layout flex com dot 8px + texto

### Ícones por tipo (lucide-react)

| Tipo | Ícone | Cor (light) | Cor (dark) |
|---|---|---|---|
| DINHEIRO | `Banknote` | #7C3AED | #A78BFA |
| VA | `Apple` | #059669 | #34D399 |
| VR | `Utensils` | #EA580C | #FB923C |
| VT | `Bus` | #2563EB | #60A5FA |
| SALDO_TOTAL | `Coins` | #7C3AED | #A78BFA |

### Subtexto — dot colors
* Verde (#10B981): "Disponível"
* Amarelo (#F59E0B): sugestão de uso
* Verde com seta: crescimento percentual

---

## 🛠️ Implementação

### `ResourceCard/ResourceCard.jsx` (NOVO — CRIAR)

> Criar em: `src/components/features/dashboard/ResourceCard/ResourceCard.jsx`
> Criar em: `src/components/features/dashboard/ResourceCard/ResourceCard.styles.jsx`
> Criar em: `src/components/features/dashboard/ResourceCard/resourceConfig.js`

Props:
```
type         "DINHEIRO" | "VA" | "VR" | "VT" | "SALDO_TOTAL"
value        number
subtitle     string    — ex: "Disponível", "Disponível · Sugestão de uso: R$ 24,90 por dia", "↑ 8,2% em relação a abril"
subtitleDot  "available" | "suggestion" | "growth"  — default "available"
onClick      function
loading      boolean   — exibe Skeleton no lugar do valor
className    string
```

`resourceConfig.js`:
→ Mapa `TipoRecurso → { label: string, icon: LucideIcon, colorLight: string, colorDark: string }`
→ Ex: `DINHEIRO: { label: 'Dinheiro', icon: Banknote, colorLight: '#7C3AED', colorDark: '#A78BFA' }`
→ Centraliza cores inline (VA, VR, VT não têm tokens globais) — declaradas como `--ds-resource-*` no CSS do Pulso

Lógica:
→ Usa `formatCurrency()` do design-system para formatar `value`
→ Dot color: `available` → success | `suggestion` → warning | `growth` → success
→ Loading: substitui valor por `<Skeleton variant="title" width="60%">`

---

## 🚫 Regras de Negócio
* `ResourceCard` é **Pulso-specific** — em `src/components/`, não no `design-system/`
* Cores inline declaradas como tokens extras `--ds-resource-va`, `--ds-resource-vr`, `--ds-resource-vt` no CSS do Pulso
* `value` é sempre `number` — formatação via `formatCurrency` do design-system
* `onClick` opcional — se fornecido, card vira clicável com hover; se omitido, apenas exibe dados

---

# [STORY] Empty State Wrappers (Pulso)

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Pulso
Relator:     (preencher)
Pai:         [FEATURE] Estados Vazios e de Erro
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero wrappers do `EmptyState` genérico com mensagens e ações específicas para cada contexto do Pulso (transações, metas, grupos, busca, filtro), para que eu não precise repetir props em cada página e mantenha consistência nas mensagens exibidas.

---

## ✅ Critérios de Aceite

### Cenário 1 — NoTransactionsEmpty
**Dado** que a lista de transações está vazia,
**Quando** `NoTransactionsEmpty` é renderizado,
**Então** exibe ícone `ClipboardList`, título "Nenhuma transação encontrada", descrição "Registre sua primeira receita ou despesa", botão "Nova Transação" (primary) que chama `onCreateTransaction()`.

### Cenário 2 — NoGoalsEmpty
**Dado** que a lista de metas está vazia,
**Quando** renderizado,
**Então** exibe ícone `Target`, título "Você ainda não tem metas", descrição "Crie sua primeira meta financeira e comece a guardar!", botão "Criar Meta" (primary) que chama `onCreateGoal()`.

### Cenário 3 — NoGroupsEmpty
**Dado** que a lista de grupos está vazia,
**Quando** renderizado,
**Então** exibe ícone `Users`, título "Nenhum grupo ainda", descrição "Crie um grupo ou entre com um código de convite", dois botões: "Criar Grupo" (primary) e "Entrar com código" (secondary).

### Cenário 4 — NoSearchResultsEmpty
**Dado** que a busca não retornou resultados,
**Quando** renderizado,
**Então** exibe ícone `SearchX`, título "Nenhum resultado", descrição "Tente buscar por outro termo", link "Limpar filtros" que chama `onClearFilters()`.

### Cenário 5 — NoFilterDataEmpty
**Dado** que o filtro aplicado não retornou dados,
**Quando** renderizado,
**Então** exibe ícone `BarChart3`, título "Sem dados para este período", descrição "Selecione outro período ou registre transações".

### Cenário 6 — Size compacto
**Dado** que qualquer wrapper recebe `size="compact"`,
**Quando** renderizado,
**Então** usa layout reduzido do `EmptyState` base (ícone 40px, fontes menores, padding 16px).

---

## 🎨 Visual e UX

Todos os wrappers usam o `EmptyState` genérico do design-system, apenas pré-configuram props:

### Especificações herdadas do EmptyState base
* **Alinhamento:** flex column, align-items center, justify-content center
* **Gap entre elementos:** 12px
* **Padding:** 32px (default) / 16px (compact)
* **Ícone:** 60px (default) / 40px (compact), `--ds-color-text-secondary`
* **Título:** 16px semi-bold, `--ds-color-text`
* **Descrição:** 14px, `--ds-color-text-secondary`, max-width 300px, text-align center
* **Ações:** `Button` do design-system com variantes apropriadas

---

## 🛠️ Implementação

### Wrappers a criar (TODOS NOVOS — CRIAR)

> Criar em: `src/components/features/transactions/NoTransactionsEmpty.jsx`
> Criar em: `src/components/features/goals/NoGoalsEmpty.jsx`
> Criar em: `src/components/features/groups/NoGroupsEmpty.jsx`
> Criar em: `src/components/shared/NoSearchResultsEmpty.jsx` (compartilhado — usado em múltiplos contextos)
> Criar em: `src/components/shared/NoFilterDataEmpty.jsx` (compartilhado)

Cada wrapper:
→ Props mínimas: `onAction`, `onSecondaryAction?`, `size?`, `className?`
→ Renderiza `<EmptyState>` do design-system com icon/title/description/action pré-configurados
→ Sem lógica de estado interno — puramente apresentacional

Exemplo de `NoTransactionsEmpty.jsx`:
```jsx
import { EmptyState } from '@/design-system'
import { ClipboardList } from 'lucide-react'

export const NoTransactionsEmpty = ({ onCreateTransaction, size, className }) => (
  <EmptyState
    icon={<ClipboardList />}
    title="Nenhuma transação encontrada"
    description="Registre sua primeira receita ou despesa"
    action={{
      label: 'Nova Transação',
      onClick: onCreateTransaction,
      variant: 'primary'
    }}
    size={size}
    className={className}
  />
)
```

---

## 🚫 Regras de Negócio
* Wrappers são **Pulso-specific** — não vão no `design-system/`
* Wrappers compartilhados (`NoSearchResultsEmpty`, `NoFilterDataEmpty`) ficam em `src/components/shared/`
* Cada wrapper importa `EmptyState` do design-system — sem reimplementação de layout
* Mensagens e ícones definidos internamente — não customizáveis por props (para manter consistência)
* `onAction` callbacks não disparam navegação internamente — o pai (page/hook) controla

---

# [STORY] Table

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Exibição de Dados
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero um componente `Table` genérico com cabeçalho ordenável, estados de loading/vazio/erro e suporte a ações por linha, para que listagens do Pulso (transações, lembretes, metas) sejam construídas com consistência.

---

## ✅ Critérios de Aceite

### Cenário 1 — Renderização básica
**Dado** que `Table` recebe `columns` e `data`,
**Quando** renderizado,
**Então** exibe tabela com cabeçalho definido por `columns` e uma linha por item de `data`, usando o `render` de cada coluna.

### Cenário 2 — Coluna ordenável
**Dado** que uma coluna tem `sortable: true`,
**Quando** o usuário clica no cabeçalho,
**Então** `onSort({ key, direction })` é chamado; ícone `ChevronUp`/`Down` indica a direção.

### Cenário 3 — Estado de loading
**Dado** que `loading={true}`,
**Quando** renderizado,
**Então** exibe linhas de `Skeleton` no lugar dos dados (5 linhas × altura 44px por padrão).

### Cenário 4 — Estado vazio
**Dado** que `data` é array vazio e `loading={false}`,
**Quando** renderizado,
**Então** exibe `EmptyState` com ícone e mensagem configuráveis.

### Cenário 5 — Hover nas linhas
**Dado** que a tabela tem dados,
**Quando** o cursor passa sobre uma linha,
**Então** o fundo muda para `--ds-color-hover`.

### Cenário 6 — Seleção de linhas
**Dado** que `selectable={true}`,
**Quando** o usuário clica no checkbox,
**Então** linha fica com fundo `--ds-color-primary/10`; `onSelectionChange(selectedIds)` é chamado.

### Cenário 7 — Dark/light automático
**Dado** que `.dark` está ativo,
**Quando** renderizado,
**Então** header usa `--ds-color-surface`, linhas `--ds-color-background`, hover `--ds-color-hover`.

---

## 🎨 Visual e UX

* **Header:** fundo `--ds-color-surface`, font 12px uppercase, `--ds-color-text-secondary`, `border-bottom: --ds-color-border`
* **Linha:** altura 56px, padding horizontal 16px, `border-bottom: --ds-color-border/50`
* **Overflow horizontal:** `overflow-x: auto` no container (scroll em mobile)
* **Coluna de seleção:** width 48px | **Coluna de ações:** `text-align: right`
* **Ordenação ativa:** header text + ícone em `--ds-color-primary`

---

## 🛠️ Implementação

### `Table/Table.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/data-display/Table/Table.jsx`
> Criar: `src/design-system/components/data-display/Table/Table.styles.jsx`

Props:
```
columns      Array<{
               key: string,
               header: string,
               render?: (row, index) => ReactNode,
               sortable?: boolean,
               width?: string,
               align?: "left" | "center" | "right",
               hideOnMobile?: boolean,
               type?: "actions"
             }>
data         any[]
loading      boolean
selectable   boolean
selectedIds  string[]
onSelectionChange (ids: string[]) => void
idKey        string       — default "id"
onSort       ({ key, direction }) => void
sortKey      string
sortDirection "asc" | "desc"
emptyIcon    ReactNode
emptyTitle   string
emptyDescription string
skeletonRows number       — default 5
className    string
```

---

## 🚫 Regras de Negócio
* `Table` não pagina nem ordena dados internamente — chama `onSort` e o pai atualiza `data`
* `selectable` com `selectedIds` é controlado pelo pai
* `render` de cada coluna recebe `(row, index)` — o pai formata os dados
* `Table` não paginada internamente — usar `Pagination` do design-system separadamente

---

# [FEATURE] Navegação e Fluxo

```
Tipo:        Feature
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [EPIC] Design System — Pulso
Data Limite: (preencher)
```

Implementação dos componentes de navegação intra-tela: `Tabs`, `Breadcrumbs` e `Pagination`.

---

# [STORY] Tabs, Breadcrumbs e Pagination

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Navegação e Fluxo
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero componentes de navegação padronizados (Tabs para seções, Breadcrumbs para localização, Pagination para listagens), para que a navegação dentro das telas do Pulso seja consistente e acessível.

---

## ✅ Critérios de Aceite

### Cenário 1 — Tabs: variante underline
**Dado** que `Tabs` é renderizado com `variant="underline"`,
**Quando** tab é selecionada,
**Então** tab ativa: borda inferior 2px `--ds-color-primary`, texto `--ds-color-primary`; outras: texto `--ds-color-text-secondary`; `onChange(activeKey)` é chamado.

### Cenário 2 — Tabs: variante pill
**Dado** que `variant="pill"`,
**Quando** tab é selecionada,
**Então** tab ativa: fundo `--ds-color-primary`, texto branco, `--ds-radius-full`; outras: transparentes.

### Cenário 3 — Tabs: com ícone e contador
**Dado** que tab recebe `icon` e/ou `count`,
**Quando** renderizada,
**Então** ícone à esquerda do label; badge/contador à direita.

### Cenário 4 — Tabs: scroll horizontal em mobile
**Dado** que há mais tabs do que cabem na largura,
**Quando** em tela pequena,
**Então** container faz scroll horizontal; tab ativa fica visível após seleção.

### Cenário 4.1 — Tabs: orientação vertical
**Dado** que `Tabs` recebe `orientation="vertical"`,
**Quando** renderizado,
**Então** tabs empilhadas verticalmente, indicador lateral à esquerda (underline) ou fundo preenchido (pill); ícone + label + count mantidos na mesma ordem; ideal para menus laterais ou settings.

### Cenário 5 — Breadcrumbs: trilha de navegação
**Dado** que `Breadcrumbs` recebe array de itens,
**Quando** renderizado,
**Então** `Home > Transações > Editar` com separador configurável; último item em `--ds-color-text` (não é link); itens anteriores em `--ds-color-primary` (clicáveis).

### Cenário 6 — Breadcrumbs: colapso em mobile
**Dado** que há mais de `maxItems` itens e `useIsMobile()` retorna true,
**Quando** renderizado,
**Então** exibe primeiro + último com `...` no meio; clicar em `...` expande todos.

### Cenário 7 — Pagination: controles de página
**Dado** que `page=3`, `totalPages=10`,
**Quando** renderizado,
**Então** `<` | `1 ... 2 3 4 ... 10` | `>`; página atual com fundo `--ds-color-primary`, texto branco; outras chamam `onChange(page)` ao clicar.

### Cenário 8 — Pagination: prev/next desabilitados
**Dado** que `page=1` ou `page=totalPages`,
**Quando** renderizado,
**Então** botão `<` (prev) desabilitado na primeira página; `>` (next) na última.

### Cenário 9 — Pagination: tamanho de página
**Dado** que `showPageSize={true}`,
**Quando** renderizado,
**Então** Select "Itens por página: 10" com opções 10/25/50/100; `onPageSizeChange(size)` ao mudar.

---

## 🎨 Visual e UX

### Tabs
* **Underline horizontal:** altura 40px, padding 12px 16px, separador `border-bottom: 1px solid --ds-color-border`
* **Underline vertical:** largura flex-1, padding 12px 16px, indicador `border-left: 2px solid --ds-color-primary` quando ativa
* **Pill horizontal:** container com `--ds-color-surface`, padding 4px, `--ds-radius-lg`; tab ativa padding 8px 16px, `--ds-radius-md`
* **Pill vertical:** mesma estrutura, stack vertical com gap 4px; tab ativa full width com padding 12px 16px
* **Transição:** indicador desliza 200ms
* **Vertical ideal para:** menus laterais (Settings, Preferências), sidebars com navegação

### Breadcrumbs
* **Separador:** `/` padrão (configurável)
* **Último item:** `--ds-color-text`, font-weight 500, não clicável
* **Itens anteriores:** `--ds-color-primary`; hover: underline
* **Font-size:** 14px, gap 8px

### Pagination
* **Botões:** 36px × 36px, `--ds-radius-md`
* **Página ativa:** fundo `--ds-color-primary`, texto branco
* **Hover:** `--ds-color-hover`
* **Reticências:** não clicável, `--ds-color-text-secondary`
* **Janela:** 5 páginas ao redor da ativa

---

## 🛠️ Implementação

### `Tabs/Tabs.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/navigation/Tabs/Tabs.jsx`
> Criar: `src/design-system/components/navigation/Tabs/Tabs.styles.jsx`

Props:
```
tabs          Array<{ key: string, label: string, icon?: ReactNode, count?: number, disabled?: boolean }>
activeKey     string
onChange      (key: string) => void
variant       "underline" | "pill"  — default "underline"
orientation   "horizontal" | "vertical"  — default "horizontal"
size          "sm" | "md"           — default "md"
className     string
```

### `Breadcrumbs/Breadcrumbs.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/navigation/Breadcrumbs/Breadcrumbs.jsx`

Props:
```
items      Array<{ label: string, onClick?: function, icon?: ReactNode }>
separator  ReactNode    — default "/"
maxItems   number       — colapsa acima deste valor em mobile (default 3)
className  string
```

→ Elemento: `<nav aria-label="breadcrumbs">` com `<ol>` + `<li>`
→ Último item: `aria-current="page"`
→ Usa `<button>` com `onClick` (não `<a>`) para compatibilidade com qualquer roteador

### `Pagination/Pagination.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/navigation/Pagination/Pagination.jsx`

Props:
```
page             number
totalPages       number
onChange         (page: number) => void
showPageSize     boolean
pageSize         number
onPageSizeChange (size: number) => void
pageSizeOptions  number[]    — default [10, 25, 50, 100]
showInfo         boolean     — "1–10 de 143 itens"
totalItems       number
className        string
```

### `navigation/index.js` (EXISTENTE — PREENCHER)

→ Exporta: `Tabs`, `Breadcrumbs`, `Pagination`

---

## 🚫 Regras de Negócio
* `Tabs` é **controlado** — `activeKey` vem de fora
* `Pagination` não conhece os dados — apenas controla número de página
* `Breadcrumbs` usa `<button>` com `onClick`, não `<a>` nativo

---

# [FEATURE] Sobreposições

```
Tipo:        Feature
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [EPIC] Design System — Pulso
Data Limite: (preencher)
```

Implementação de `Drawer` (painel lateral deslizante) e `Dropdown` (menu flutuante genérico). O componente `Modal` e `ConfirmModal` já foram implementados na Feature anterior.

**Dependência:** [STORY] Tokens CSS + [STORY] Button e IconButton.

---

# [STORY] Drawer e Dropdown

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Design System
Relator:     (preencher)
Pai:         [FEATURE] Sobreposições
Data Limite: (preencher)
```

## 📝 Descrição

Como desenvolvedor, eu quero um `Drawer` para painéis laterais e um `Dropdown` para menus contextuais flutuantes, para que esses padrões sejam consistentes e acessíveis em todas as telas do Pulso.

---

## ✅ Critérios de Aceite

### Cenário 1 — Drawer: abre da direita
**Dado** que `isOpen={true}` e `placement="right"`,
**Quando** renderizado,
**Então** painel desliza da direita (300ms ease), overlay escuro cobre o conteúdo, header com título + botão X de fechar no topo.

### Cenário 2 — Drawer: fecha ao overlay ou Esc
**Dado** que o Drawer está aberto,
**Quando** o usuário clica no overlay ou pressiona Esc,
**Então** `onClose()` é chamado; painel desliza de volta (250ms) antes de desmontar.

### Cenário 3 — Drawer: tamanhos e posicionamentos
**Dado** que `Drawer` recebe `size` e `placement`,
**Quando** renderizado,
**Então**: size: sm 320px | md 480px (padrão) | lg 640px | full 100vw; placement: right (padrão) | left | bottom (bottom sheet com border-radius top).

### Cenário 4 — Drawer: footer fixo
**Dado** que `Drawer` recebe `footer`,
**Quando** renderizado,
**Então** footer fica fixo na parte inferior com `border-top: 1px solid --ds-color-border`, padding 16px.

### Cenário 5 — Dropdown: menu de contexto
**Dado** que `Dropdown` envolve um trigger,
**Quando** o trigger é clicado,
**Então** painel flutuante abre abaixo (ou acima se sem espaço) com lista de itens; fecha ao clicar fora ou Esc.

### Cenário 6 — Dropdown: itens com ícone, separator e danger
**Dado** que `items` inclui ícones e separadores,
**Quando** o dropdown está aberto,
**Então** cada item exibe ícone 16px + label; `separator: true` → `border-top: 1px solid --ds-color-border`; `variant: "danger"` → ícone + label em `--ds-color-danger`.

### Cenário 7 — Dropdown: item desabilitado
**Dado** que item tem `disabled: true`,
**Quando** renderizado,
**Então** opacity 0.4, sem hover, sem clique.

### Cenário 8 — Dark/light automático
**Dado** que `.dark` está ativo,
**Quando** Drawer ou Dropdown são abertos,
**Então** painéis usam `--ds-color-modal-bg`/`--ds-color-surface`, overlay usa `--ds-color-overlay`.

---

## 🎨 Visual e UX

### Drawer
* **Fundo:** `--ds-color-modal-bg`
* **Overlay:** `--ds-color-overlay`
* **Header:** padding 16px 24px, `border-bottom: 1px solid --ds-color-border`; título 18px bold + `IconButton` X ghost à direita
* **Body:** `overflow-y: auto`, padding 24px
* **Animações:** right: `translateX(100%) → translateX(0)` | left: `translateX(-100%) → 0` | bottom: `translateY(100%) → 0`; 300ms ease
* **Bottom sheet:** `border-radius: --ds-radius-xl --ds-radius-xl 0 0`; handle decorativo 40px × 4px no topo

### Dropdown
* **Fundo:** `--ds-color-surface` | **Borda:** `--ds-color-border` | **Radius:** `--ds-radius-md`
* **Sombra:** `--ds-shadow-md` | **Min-width:** 180px | **Max-width:** 280px
* **Item:** altura 40px, padding 8px 16px, flex gap 8px
* **Item hover:** `--ds-color-hover` | **Item danger hover:** `--ds-color-danger/10`
* **z-index:** `--ds-z-dropdown` (100)

---

## 🛠️ Implementação

### `Drawer/Drawer.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/overlays/Drawer/Drawer.jsx`
> Criar: `src/design-system/components/overlays/Drawer/Drawer.styles.jsx`

Props:
```
isOpen         boolean
onClose        function
title          string
size           "sm" | "md" | "lg" | "full"  — default "md"
placement      "right" | "left" | "bottom"  — default "right"
closeOnOverlay boolean                       — default true
footer         ReactNode
className      string
children       ReactNode
```

→ `ReactDOM.createPortal(content, document.body)`
→ `useKeyboard({ Escape: onClose })` quando `isOpen`
→ Animação via CSS transition com `transform`, controlada por classe `is-open`

### `Dropdown/Dropdown.jsx` (EXISTENTE — PREENCHER)

> Preencher: `src/design-system/components/overlays/Dropdown/Dropdown.jsx`
> Criar: `src/design-system/components/overlays/Dropdown/Dropdown.styles.jsx`

Props:
```
trigger    ReactNode
items      Array<{
             label: string,
             icon?: ReactNode,
             onClick?: function,
             disabled?: boolean,
             separator?: boolean,
             variant?: "default" | "danger"
           }>
placement  "bottom-start" | "bottom-end" | "top-start" | "top-end"  — default "bottom-start"
className  string
```

→ `useClickOutside` para fechar ao clicar fora
→ `useKeyboard({ Escape: close })` quando aberto
→ `position: absolute` relativo ao wrapper com `position: relative`

### `overlays/index.js` (EXISTENTE — PREENCHER)

→ Exporta: `Modal`, `ConfirmModal`, `Drawer`, `Dropdown`

---

## 🚫 Regras de Negócio
* `Drawer` usa `ReactDOM.createPortal` — garante z-index e overlay corretos
* `Dropdown` usa `position: absolute` (sem portal) — componentes pai devem ter `overflow: visible`
* Ambos implementam **focus trap** (foco preso dentro enquanto abertos) para acessibilidade
* `Drawer` fecha com animação — não desmonta imediatamente ao `onClose`

---

# [FEATURE] Painel de Notificações Pulso

```
Tipo:        Feature
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Pulso
Relator:     (preencher)
Pai:         [EPIC] Design System — Pulso
Data Limite: (preencher)
```

Implementação do painel de notificações específico do Pulso: lista de 13 tipos de eventos (transações, metas, alertas, gamificação, grupos e erros), com marcação de lidas e cores semânticas por tipo.

**Camada:** `src/components/` (Pulso-specific).
**Dependência:** [STORY] Tokens CSS + [STORY] Button e IconButton + [STORY] Avatar, Badge e Tooltip.

---

# [STORY] NotificationPanel

```
Tipo:        Story
Prioridade:  🔼 High
Sprint:      (preencher)
Categoria:   Frontend, Pulso
Relator:     (preencher)
Pai:         [FEATURE] Painel de Notificações Pulso
Data Limite: (preencher)
```

## 📝 Descrição

Como usuário do Pulso, eu quero ver todas as minhas notificações em um painel com cores e ícones por tipo de evento, para que eu identifique rapidamente o que aconteceu na minha conta.

---

## ✅ Critérios de Aceite

### Cenário 1 — Renderiza lista com 13 tipos
**Dado** que `NotificationPanel` recebe notificações,
**Quando** renderizado,
**Então** cada item exibe: borda lateral colorida 4px (cor por tipo) + ícone circular (cor/10 de fundo) + título em CAPS bold + descrição + timestamp relativo.

### Cenário 2 — Cores por tipo (baseadas no protótipo e Readme.md)
**Dado** que cada notificação tem um `type`,
**Quando** renderizada,
**Então** a cor da borda e do ícone segue:
* `RECEITA_REGISTRADA`: `--ds-color-success`
* `DESPESA_REGISTRADA`: `--ds-color-danger`
* `META_ATINGIDA`: `--ds-color-primary`
* `ALERTA_ORCAMENTO`: `--ds-color-warning`
* `ORCAMENTO_ESTOURADO`: `--ds-color-danger`
* `LEMBRETE_VENCIMENTO`: `--ds-color-info`
* `STREAK`: `--ds-color-warning`
* `CONQUISTA`: `--ds-color-primary`
* `GRUPO_ATIVIDADE`: `#06B6D4` / `#22D3EE` (cyan — sem token, usar valor inline apenas no `notificationConfig.js`)
* `DIVIDA_COBRANCA`: `#F97316` / `#FB923C` (orange — idem)
* `INSIGHT_IA`: `#8B5CF6` / `#C4B5FD` (violet — idem)
* `ACAO_CONCLUIDA`: `--ds-color-success`
* `ERRO`: `--ds-color-danger`

### Cenário 3 — Header com "Marcar todas como lidas"
**Dado** que o painel está aberto e há notificações não lidas,
**Quando** renderizado,
**Então** exibe header: ícone `Bell` + "Notificações" + link "Marcar todas como lidas" (ícone `Check` + texto em `--ds-color-primary`); ao clicar, `onMarkAllRead()` é chamado.

### Cenário 4 — Notificação não lida vs lida
**Dado** que `notification.read === false`,
**Quando** renderizada,
**Então** fundo levemente destacado (`--ds-color-primary/5`); lidas têm fundo padrão.

### Cenário 5 — Clicar em notificação
**Dado** que o usuário clica em uma notificação não lida,
**Quando** clicado,
**Então** `onRead(id)` é chamado; destaque some.

### Cenário 6 — Lista vazia
**Dado** que não há notificações,
**Quando** renderizado,
**Então** `EmptyState` com ícone `Bell` + "Nenhuma notificação" + "Você está em dia com tudo!".

### Cenário 7 — Dark/light automático
**Dado** que `.dark` está ativo,
**Quando** renderizado,
**Então** fundo `--ds-color-modal-bg`, bordas `--ds-color-border`, texto `--ds-color-text`.

---

## 🎨 Visual e UX

### Layout geral (baseado no protótipo)
* **Container:** min-width 360px, max-width 440px, `--ds-color-modal-bg`, `--ds-radius-lg`, `--ds-shadow-lg`
* **Header:** padding 16px 20px, `border-bottom: 1px solid --ds-color-border`
  * Esquerda: ícone `Bell` 20px `--ds-color-primary` + "Notificações" 16px bold
  * Direita: ícone `Check` 14px + "Marcar todas como lidas" 13px, ambos em `--ds-color-primary`
* **Lista:** scroll vertical, max-height 520px, `overflow-y: auto`

### Cada item
* **Altura mínima:** 64px | **Padding:** 12px 16px | **Layout:** flex row
* **Borda lateral:** `border-left: 4px solid [cor do tipo]`
* **Ícone:** círculo 40px, fundo `[cor]/10`, ícone 20px da cor do tipo
* **Conteúdo:** flex-1, flex-column, gap 2px
  * Título: 12px, font-weight 700, `--ds-color-text`, uppercase
  * Descrição: 13px, `--ds-color-text-secondary`; valores monetários coloridos no texto da descrição
* **Timestamp:** 11px, `--ds-color-text-secondary`, alinhado ao topo direito
* **Não lida:** fundo `rgba(var(--ds-color-primary-rgb), 0.05)`
* **Hover:** `--ds-color-hover`
* **Separador:** `border-bottom: 1px solid --ds-color-border/50`

### Ícones por tipo (lucide-react)

| Tipo | Ícone |
|---|---|
| RECEITA_REGISTRADA | `TrendingUp` |
| DESPESA_REGISTRADA | `TrendingDown` |
| META_ATINGIDA | `PartyPopper` |
| ALERTA_ORCAMENTO | `AlertTriangle` |
| ORCAMENTO_ESTOURADO | `AlarmClock` |
| LEMBRETE_VENCIMENTO | `Bell` |
| STREAK | `Flame` |
| CONQUISTA | `Trophy` |
| GRUPO_ATIVIDADE | `Users` |
| DIVIDA_COBRANCA | `Wallet` |
| INSIGHT_IA | `Bot` |
| ACAO_CONCLUIDA | `CheckCircle` |
| ERRO | `XCircle` |

---

## 🛠️ Implementação

### `NotificationPanel/NotificationPanel.jsx` (NOVO — CRIAR)

> Criar em: `src/components/features/dashboard/NotificationPanel/NotificationPanel.jsx`
> Criar em: `src/components/features/dashboard/NotificationPanel/NotificationItem.jsx`
> Criar em: `src/components/features/dashboard/NotificationPanel/NotificationPanel.styles.jsx`
> Criar em: `src/components/features/dashboard/NotificationPanel/notificationConfig.js`

Props do `NotificationPanel`:
```
notifications        Notification[]
onMarkAllRead        function
onRead               (id: string) => void
onNotificationClick  (notification: Notification) => void
loading              boolean
className            string
```

Tipo `Notification`:
```js
{
  id:          string,
  type:        NotificationType,  // enum dos 13 tipos
  title:       string,
  description: string,
  timestamp:   Date | string,
  read:        boolean,
  metadata?:   object
}
```

`notificationConfig.js`:
→ Mapa `NotificationType → { cssVar: string, icon: LucideIcon }`
→ Ex: `RECEITA_REGISTRADA: { cssVar: '--ds-color-success', icon: TrendingUp }`
→ Para cyan/orange/violet (sem token global): `cssVar: 'var(--ds-notification-grupo)'` e declarar esses 3 tokens extras no arquivo de tokens do projeto Pulso
→ Centraliza todas as regras de cor/ícone — sem switch/if espalhados

`NotificationItem.jsx`:
→ Recebe `notification`, `onRead`, `onClick`
→ Usa `notificationConfig[notification.type]` para cor e ícone
→ Formata timestamp com `formatDateRelative()` do design-system utils

---

## 🚫 Regras de Negócio
* `NotificationPanel` é **Pulso-specific** — em `src/components/`, não no `design-system/`
* `onRead` e `onMarkAllRead` não disparam mutação internamente — o pai (TanStack Query) controla
* Timestamp formatado via `formatDateRelative` (ex: "Há 2 min", "Hoje", "Ontem", "Há 1 dia")
* Valores monetários na `description` são passados já formatados — o componente não formata
* Cores de cyan/orange/violet declaradas como tokens extras no CSS do Pulso (`--ds-notification-*`) — não hex hardcoded nos componentes
