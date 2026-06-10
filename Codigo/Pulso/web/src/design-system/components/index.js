/**
 * Design System - Components
 * 
 * Biblioteca de componentes UI genéricos e reutilizáveis
 * 
 * ❌ REGRAS ABSOLUTAS:
 * - Nunca importar de fora de src/design-system/
 * - Nunca acessar Redux, Context ou store
 * - Nunca fazer chamadas HTTP
 * - Receber tudo via props
 * - Cores via CSS variables (--ds-color-*)
 * - Suporte a dark/light via classe .dark no <html>
 */

// ============================================================
// BUTTONS
// ============================================================
export { Button, IconButton } from './buttons/index.js'

// ============================================================
// FEEDBACK
// ============================================================
export { 
  Spinner, 
  SpinnerDots, 
  SpinnerFullscreen,
  Toast,
  ToastContainer,
  ToastProvider,
  useToast,
  Alert
} from './feedback/index.js'

// ============================================================
// DATA DISPLAY
// ============================================================
export { Tooltip } from './data-display/index.js'

// ============================================================
// INPUTS
// ============================================================
export { InputText, InputPassword, DEFAULT_PASSWORD_RULES } from './inputs/index.js'

// ============================================================
// FORMS
// ============================================================
export { Checkbox, Radio, RadioGroup, Toggle, FormField } from './forms/index.js'

// ============================================================
// NAVIGATION (TODO)
// ============================================================
// export { Tabs, Breadcrumbs, Pagination } from './navigation/index.js'

// ============================================================
// OVERLAYS
// ============================================================
export { Modal, ConfirmModal } from './overlays/index.js'
