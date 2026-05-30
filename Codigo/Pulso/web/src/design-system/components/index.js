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
  SpinnerOverlay,
  SpinnerFullscreen,
  Toast,
  ToastContainer,
  ToastProvider,
  useToast,
  Alert,
  Skeleton,
  EmptyState,
  ErrorState
} from './feedback/index.js'

// ============================================================
// DATA DISPLAY
// ============================================================
export {
  Tooltip,
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ProgressBar,
  ProgressCircle,
  Table,
} from './data-display/index.js'

// ============================================================
// INPUTS
// ============================================================
export { InputText, InputPassword, DEFAULT_PASSWORD_RULES, InputMoney, InputNumber, InputSearch, Textarea } from './inputs/index.js'

// ============================================================
// SELECTS
// ============================================================
export { Select, SelectSearch, MultiSelect, MultiSelectSearch, TagsInput } from './selects/index.js'

// ============================================================
// PICKERS
// ============================================================
export { DatePicker, DateRangePicker, MonthPicker, TimePicker } from './pickers/index.js'

// ============================================================
// FORMS
// ============================================================
export { Toggle, Checkbox, Radio, RadioGroup, FormField } from './forms/index.js'

// ============================================================
// NAVIGATION
// ============================================================
export { Tabs, Breadcrumbs, Pagination } from './navigation/index.js'

// ============================================================
// OVERLAYS
// ============================================================
export { Modal, ConfirmModal } from './overlays/index.js'
