/**
 * TestFoundation - Componente temporário para testar Design System Foundation
 * 
 * Remove após validação.
 */

import { useState } from 'react'
import { 
  useTheme, 
  useToggle, 
  useCopyToClipboard,
  useIsMobile,
  useIsDesktop,
} from '../design-system/hooks'
import { 
  cn, 
  formatCurrency, 
  formatDate, 
  formatDateRelative,
  formatNumber,
} from '../design-system/utils'

export function TestFoundation() {
  const { theme, toggleTheme } = useTheme()
  const [isOpen, toggle, open, close] = useToggle()
  const { copy, copied } = useCopyToClipboard()
  const isMobile = useIsMobile()
  const isDesktop = useIsDesktop()
  
  const [counter, setCounter] = useState(0)

  return (
    <div className="min-h-screen p-8 bg-[var(--ds-color-background)] text-[var(--ds-color-text)] transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-[var(--ds-font-size-2xl)] font-bold">
            🎨 Design System Foundation Test
          </h1>
          <p className="text-[var(--ds-color-text-secondary)]">
            Validando tokens CSS, hooks, utils e animações
          </p>
        </div>

        {/* Tema */}
        <section className={cn(
          'p-6 rounded-lg border',
          'bg-[var(--ds-color-surface)]',
          'border-[var(--ds-color-border)]',
          'animate-fade-in'
        )}>
          <h2 className="text-xl font-semibold mb-4">🌗 Tema (useTheme)</h2>
          <div className="space-y-3">
            <p>
              <strong>Tema atual:</strong> 
              <span className="ml-2 px-3 py-1 rounded-full bg-[var(--ds-color-primary)] text-white">
                {theme}
              </span>
            </p>
            <button
              onClick={toggleTheme}
              className={cn(
                'px-4 py-2 rounded-lg font-medium',
                'bg-[var(--ds-color-primary)] text-white',
                'hover:bg-[var(--ds-color-primary-dark)]',
                'transition-colors'
              )}
            >
              {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
            </button>
          </div>
        </section>

        {/* Cores Semânticas */}
        <section className="p-6 rounded-lg border bg-[var(--ds-color-surface)] border-[var(--ds-color-border)] animate-slide-up">
          <h2 className="text-xl font-semibold mb-4">🎨 Cores Semânticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-[var(--ds-color-primary)]" />
              <p className="text-sm text-[var(--ds-color-text-secondary)]">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-[var(--ds-color-success)]" />
              <p className="text-sm text-[var(--ds-color-text-secondary)]">Success</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-[var(--ds-color-danger)]" />
              <p className="text-sm text-[var(--ds-color-text-secondary)]">Danger</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-[var(--ds-color-warning)]" />
              <p className="text-sm text-[var(--ds-color-text-secondary)]">Warning</p>
            </div>
          </div>
        </section>

        {/* Animações */}
        <section className="p-6 rounded-lg border bg-[var(--ds-color-surface)] border-[var(--ds-color-border)]">
          <h2 className="text-xl font-semibold mb-4">🎬 Animações</h2>
          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className="px-4 py-2 bg-[var(--ds-color-primary)] text-white rounded animate-fade-in">
                Fade In
              </div>
              <div className="px-4 py-2 bg-[var(--ds-color-success)] text-white rounded animate-slide-up">
                Slide Up
              </div>
              <div className="px-4 py-2 bg-[var(--ds-color-warning)] text-white rounded animate-scale-in">
                Scale In
              </div>
              <div className="px-4 py-2 bg-[var(--ds-color-info)] text-white rounded animate-bounce">
                Bounce
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-6 h-6 border-4 border-[var(--ds-color-primary)] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[var(--ds-color-text-secondary)]">Spinner</span>
            </div>
          </div>
        </section>

        {/* Utils - Formatação */}
        <section className="p-6 rounded-lg border bg-[var(--ds-color-surface)] border-[var(--ds-color-border)]">
          <h2 className="text-xl font-semibold mb-4">🛠️ Utils - Formatação</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="p-3 bg-[var(--ds-color-background)] rounded">
              <strong>formatCurrency(1500.50):</strong>
              <span className="ml-2 text-[var(--ds-color-success)]">
                {formatCurrency(1500.50)}
              </span>
            </div>
            <div className="p-3 bg-[var(--ds-color-background)] rounded">
              <strong>formatDate(new Date()):</strong>
              <span className="ml-2 text-[var(--ds-color-info)]">
                {formatDate(new Date())}
              </span>
            </div>
            <div className="p-3 bg-[var(--ds-color-background)] rounded">
              <strong>formatDateRelative(new Date()):</strong>
              <span className="ml-2 text-[var(--ds-color-info)]">
                {formatDateRelative(new Date())}
              </span>
            </div>
            <div className="p-3 bg-[var(--ds-color-background)] rounded">
              <strong>formatNumber(1234567.89):</strong>
              <span className="ml-2 text-[var(--ds-color-warning)]">
                {formatNumber(1234567.89, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </section>

        {/* useToggle */}
        <section className="p-6 rounded-lg border bg-[var(--ds-color-surface)] border-[var(--ds-color-border)]">
          <h2 className="text-xl font-semibold mb-4">🔘 useToggle</h2>
          <div className="space-y-4">
            <p>
              <strong>Estado:</strong> 
              <span className={cn(
                'ml-2 px-3 py-1 rounded',
                isOpen ? 'bg-[var(--ds-color-success)]' : 'bg-[var(--ds-color-border)]',
                'text-white'
              )}>
                {isOpen ? 'Aberto' : 'Fechado'}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={toggle}
                className="px-4 py-2 rounded bg-[var(--ds-color-primary)] text-white"
              >
                Toggle
              </button>
              <button
                onClick={open}
                className="px-4 py-2 rounded bg-[var(--ds-color-success)] text-white"
              >
                Abrir
              </button>
              <button
                onClick={close}
                className="px-4 py-2 rounded bg-[var(--ds-color-danger)] text-white"
              >
                Fechar
              </button>
            </div>
          </div>
        </section>

        {/* useCopyToClipboard */}
        <section className="p-6 rounded-lg border bg-[var(--ds-color-surface)] border-[var(--ds-color-border)]">
          <h2 className="text-xl font-semibold mb-4">📋 useCopyToClipboard</h2>
          <div className="flex gap-2">
            <button
              onClick={() => copy('Texto copiado com sucesso! 🎉')}
              className={cn(
                'px-4 py-2 rounded font-medium transition-colors',
                copied 
                  ? 'bg-[var(--ds-color-success)] text-white' 
                  : 'bg-[var(--ds-color-primary)] text-white'
              )}
            >
              {copied ? '✓ Copiado!' : 'Copiar Texto'}
            </button>
          </div>
        </section>

        {/* useMediaQuery */}
        <section className="p-6 rounded-lg border bg-[var(--ds-color-surface)] border-[var(--ds-color-border)]">
          <h2 className="text-xl font-semibold mb-4">📱 useMediaQuery</h2>
          <div className="space-y-2">
            <p>
              <strong>Mobile (&lt; 768px):</strong> 
              <span className={cn(
                'ml-2 px-3 py-1 rounded',
                isMobile ? 'bg-[var(--ds-color-success)]' : 'bg-[var(--ds-color-border)]',
                'text-white'
              )}>
                {isMobile ? 'Sim' : 'Não'}
              </span>
            </p>
            <p>
              <strong>Desktop (≥ 1024px):</strong> 
              <span className={cn(
                'ml-2 px-3 py-1 rounded',
                isDesktop ? 'bg-[var(--ds-color-success)]' : 'bg-[var(--ds-color-border)]',
                'text-white'
              )}>
                {isDesktop ? 'Sim' : 'Não'}
              </span>
            </p>
          </div>
        </section>

        {/* cn() - Class Names */}
        <section className="p-6 rounded-lg border bg-[var(--ds-color-surface)] border-[var(--ds-color-border)]">
          <h2 className="text-xl font-semibold mb-4">🎨 cn() - Class Composition</h2>
          <div className="space-y-4">
            <p className="text-[var(--ds-color-text-secondary)]">
              Botão que muda de cor baseado no contador (usa cn() para composição)
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCounter(c => c + 1)}
                className={cn(
                  'px-6 py-3 rounded-lg font-semibold transition-all',
                  counter % 3 === 0 && 'bg-[var(--ds-color-primary)] text-white',
                  counter % 3 === 1 && 'bg-[var(--ds-color-success)] text-white',
                  counter % 3 === 2 && 'bg-[var(--ds-color-warning)] text-white',
                  'hover:scale-105'
                )}
              >
                Clique aqui ({counter})
              </button>
              <button
                onClick={() => setCounter(0)}
                className="px-4 py-2 rounded bg-[var(--ds-color-border)] hover:bg-[var(--ds-color-hover)] transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* Status Final */}
        <section className="p-6 rounded-lg border-2 border-[var(--ds-color-success)] bg-[var(--ds-color-success)]/10">
          <h2 className="text-xl font-semibold mb-2 text-[var(--ds-color-success)]">
            ✅ Foundation OK!
          </h2>
          <p className="text-[var(--ds-color-text-secondary)]">
            Todos os recursos da Foundation estão funcionando corretamente.
            Pronto para implementar componentes visuais! 🚀
          </p>
        </section>

      </div>
    </div>
  )
}
