import { getCurrencyFlagCode, getCurrencyFlagUrl } from '@/utils/currencyFlags.js'

export function CurrencyFlag({ code, size = 20, className = '' }) {
  const flagCode = getCurrencyFlagCode(code)
  const src = getCurrencyFlagUrl(code)

  if (!src) {
    return (
      <span
        className={`currency-flag currency-flag--fallback ${className}`.trim()}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}
        aria-hidden
      >
        {flagCode ?? String(code ?? '').slice(0, 2)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={`currency-flag ${className}`.trim()}
      loading="lazy"
      decoding="async"
    />
  )
}

export function buildCurrencySelectOptions(catalog = [], { exclude = [] } = {}) {
  const excluded = new Set(exclude.map((code) => String(code).toUpperCase()))

  return catalog
    .filter((item) => !excluded.has(item.code))
    .map((item) => ({
      value: item.code,
      label: `${item.code} - ${item.name}`,
      icon: <CurrencyFlag code={item.code} size={18} />,
    }))
}
