import { Palette, Shapes } from 'lucide-react'
import { cn } from '@/design-system/utils/cn.js'
import { resolveBadgeIcon } from '@/components/badges/iconRegistry.jsx'

function SectionLabel({ icon: Icon, children }) {
  return (
    <span className="category-icon-picker__label">
      <Icon size={15} strokeWidth={2} aria-hidden />
      <span>{children}</span>
    </span>
  )
}

export function CategoryIconPicker({ icones = [], cores = [], valueIcon, valueCor, onChangeIcon, onChangeCor }) {
  return (
    <div className="category-icon-picker">
      <section className="category-icon-picker__card">
        <SectionLabel icon={Shapes}>Ícone</SectionLabel>
        <div
          className="category-icon-picker__grid"
          role="radiogroup"
          aria-label="Ícone da categoria"
        >
          {icones.map((icone) => {
            const selected = valueIcon === icone
            return (
              <button
                key={icone}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={icone}
                className={cn('category-icon-picker__icon', selected && 'category-icon-picker__icon--selected')}
                style={
                  selected
                    ? {
                        color: valueCor,
                        background: `color-mix(in srgb, ${valueCor} 18%, transparent)`,
                        borderColor: valueCor,
                        boxShadow: `0 0 0 1px color-mix(in srgb, ${valueCor} 35%, transparent)`,
                      }
                    : undefined
                }
                onClick={() => onChangeIcon?.(icone)}
                title={icone}
              >
                {resolveBadgeIcon(icone, { size: 17 })}
              </button>
            )
          })}
        </div>
      </section>

      <section className="category-icon-picker__card">
        <SectionLabel icon={Palette}>Cor</SectionLabel>
        <div className="category-icon-picker__colors" role="radiogroup" aria-label="Cor da categoria">
          {cores.map((cor) => {
            const selected = valueCor === cor
            return (
              <button
                key={cor}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={cor}
                className={cn('category-icon-picker__color', selected && 'category-icon-picker__color--selected')}
                style={{
                  background: cor,
                  ...(selected
                    ? { boxShadow: `0 0 0 2px var(--ds-color-modal-bg), 0 0 0 4px ${cor}` }
                    : {}),
                }}
                onClick={() => onChangeCor?.(cor)}
                title={cor}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
