import { MapPin } from 'lucide-react'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'

export function TripOriginPicker({ value, onChange, options = [], disabled = false }) {
  if (!options.length) return null

  return (
    <div className="trip-origin-picker">
      <label className="trip-origin-picker__label" htmlFor="trip-origin-select">
        <MapPin size={14} aria-hidden />
        Saindo de
      </label>
      <Select
        id="trip-origin-select"
        value={value}
        onChange={onChange}
        options={options}
        disabled={disabled}
        placeholder="Escolha sua cidade"
        className="trip-origin-picker__select"
      />
      <p className="trip-origin-picker__hint">
        As estimativas de passagem usam esta cidade como ponto de partida.
      </p>
    </div>
  )
}
