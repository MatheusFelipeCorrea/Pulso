import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, MapPin, Plane, Search } from 'lucide-react'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'

function formatTripDate(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function DestinationSearchPicker({
  destino = '',
  destinoMeta = null,
  onChange,
  onSearch,
  label = null,
  className = '',
  disabled = false,
  loading = false,
  totalDestinos = null,
  placeholder = 'Busque cidade ou país...',
  existingTrips = [],
  linkedTripId = null,
  onSelectExistingTrip,
}) {
  const listboxId = useId()
  const containerRef = useRef(null)
  const debounceRef = useRef(null)
  const requestRef = useRef(0)
  const [query, setQuery] = useState(destino)
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const selectedEntry = useMemo(() => {
    if (!destinoMeta?.catalogId) return null
    return (
      suggestions.find((item) => item.id === destinoMeta.catalogId) ?? {
        id: destinoMeta.catalogId,
        label: destinoMeta.label,
        subtitle: destinoMeta.countryName,
        destino,
      }
    )
  }, [destinoMeta, suggestions, destino])

  const matchingTrips = useMemo(() => {
    if (!existingTrips.length) return []
    const term = query.trim().toLowerCase()
    const filtered = term
      ? existingTrips.filter((trip) => trip.destino?.toLowerCase().includes(term))
      : existingTrips
    return filtered.slice(0, 6)
  }, [existingTrips, query])

  const dropdownItems = useMemo(() => {
    const items = matchingTrips.map((trip) => ({ type: 'trip', trip }))
    suggestions.forEach((entry) => items.push({ type: 'destination', entry }))
    return items
  }, [matchingTrips, suggestions])

  useEffect(() => {
    setQuery(destino || selectedEntry?.destino || '')
  }, [destino, selectedEntry?.destino])

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!onSearch) return undefined

    const term = query.trim()
    if (!open || term.length === 0) {
      setSuggestions([])
      setSearching(false)
      return undefined
    }

    const requestId = requestRef.current + 1
    requestRef.current = requestId
    setSearching(true)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      onSearch(term)
        .then((results) => {
          if (requestRef.current !== requestId) return
          setSuggestions(results ?? [])
        })
        .catch(() => {
          if (requestRef.current !== requestId) return
          setSuggestions([])
        })
        .finally(() => {
          if (requestRef.current !== requestId) return
          setSearching(false)
        })
    }, 280)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, open, onSearch])

  useEffect(() => {
    setHighlightIndex(0)
  }, [query, dropdownItems, open])

  const handleSelect = (entry) => {
    setQuery(entry.destino)
    setOpen(false)
    onSelectExistingTrip?.(null)
    onChange?.({
      destino: entry.destino,
      destinoMeta: {
        source: entry.source ?? (entry.geonameId ? 'geonames' : 'catalog'),
        geonameId: entry.geonameId ?? null,
        catalogId: entry.id,
        iata: entry.iata,
        label: entry.label,
        region: entry.subtitle?.split(',')[0]?.trim() || null,
        countryCode: entry.countryCode,
        countryName: entry.countryName,
        moedaSugerida: entry.moedaSugerida,
        domestic: entry.domestic,
      },
      moedaSugerida: entry.moedaSugerida,
    })
  }

  const handleSelectTrip = (trip) => {
    setQuery(trip.destino)
    setOpen(false)
    onSelectExistingTrip?.(trip)
  }

  const handleInputChange = (event) => {
    const nextQuery = event.target.value
    setQuery(nextQuery)
    setOpen(true)

    if (!nextQuery.trim()) {
      setSuggestions([])
      onSelectExistingTrip?.(null)
      onChange?.({ destino: '', destinoMeta: null, moedaSugerida: null })
    } else if ((selectedEntry && nextQuery !== selectedEntry.destino) || linkedTripId) {
      onSelectExistingTrip?.(null)
      onChange?.({ destino: nextQuery, destinoMeta: null, moedaSugerida: null })
    }
  }

  const handleKeyDown = (event) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      setOpen(true)
      return
    }

    if (!open || dropdownItems.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightIndex((index) => (index + 1) % dropdownItems.length)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightIndex((index) => (index - 1 + dropdownItems.length) % dropdownItems.length)
    }

    if (event.key === 'Enter') {
      const item = dropdownItems[highlightIndex]
      if (!item) return
      event.preventDefault()
      if (item.type === 'trip') handleSelectTrip(item.trip)
      else handleSelect(item.entry)
    }

    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const showDropdown =
    open && !loading && (query.trim().length > 0 || matchingTrips.length > 0)
  const helperText = loading
    ? 'Carregando destinos...'
    : linkedTripId
      ? 'Viagem existente selecionada'
      : selectedEntry
        ? `${selectedEntry.label} · ${selectedEntry.subtitle}`
        : existingTrips.length > 0
          ? 'Vincule uma viagem existente ou busque um novo destino'
          : totalDestinos
            ? `Busque cidades e países do mundo`
            : 'Digite e selecione um destino da lista'

  return (
    <div className={`trip-destination-picker ${className}`.trim()} ref={containerRef}>
      {label}

      <div className="trip-destination-picker__input-wrap">
        <InputText
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onClear={() => {
            setQuery('')
            setOpen(false)
            setSuggestions([])
            onSelectExistingTrip?.(null)
            onChange?.({ destino: '', destinoMeta: null, moedaSugerida: null })
          }}
          placeholder={placeholder}
          leftIcon={<Search size={18} />}
          disabled={disabled}
          helperText={helperText}
          aria-autocomplete="list"
          aria-controls={showDropdown ? listboxId : undefined}
          aria-expanded={showDropdown}
        />

        {showDropdown ? (
          <div
            id={listboxId}
            className="trip-destination-picker__dropdown"
            role="listbox"
            aria-label="Sugestões de destino"
          >
            {searching ? (
              <div className="trip-destination-picker__empty">
                <Search size={22} aria-hidden />
                <p>Buscando destinos...</p>
              </div>
            ) : dropdownItems.length === 0 ? (
              <div className="trip-destination-picker__empty">
                <MapPin size={22} aria-hidden />
                <p>Nenhum destino encontrado</p>
                <span>Tente outro nome de cidade ou país.</span>
              </div>
            ) : (
              dropdownItems.map((item, index) => {
                if (item.type === 'trip') {
                  const trip = item.trip
                  const selected = trip.id === linkedTripId
                  const highlighted = index === highlightIndex

                  return (
                    <button
                      key={`trip-${trip.id}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={`trip-destination-picker__option trip-destination-picker__option--trip${
                        selected ? ' trip-destination-picker__option--selected' : ''
                      }${highlighted ? ' trip-destination-picker__option--highlighted' : ''}`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelectTrip(trip)}
                      onMouseEnter={() => setHighlightIndex(index)}
                    >
                      <span className="trip-destination-picker__option-icon" aria-hidden>
                        <Plane size={16} />
                      </span>
                      <span className="trip-destination-picker__option-copy">
                        <strong>{trip.destino}</strong>
                        <span>
                          Minha viagem · {formatTripDate(trip.dataPrevista)} · {trip.moeda}
                        </span>
                      </span>
                      {selected ? (
                        <Check size={16} className="trip-destination-picker__option-check" aria-hidden />
                      ) : null}
                    </button>
                  )
                }

                const entry = item.entry
                const selected = entry.id === destinoMeta?.catalogId
                const highlighted = index === highlightIndex

                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`trip-destination-picker__option${
                      selected ? ' trip-destination-picker__option--selected' : ''
                    }${highlighted ? ' trip-destination-picker__option--highlighted' : ''}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(entry)}
                    onMouseEnter={() => setHighlightIndex(index)}
                  >
                    <span className="trip-destination-picker__option-icon" aria-hidden>
                      <MapPin size={16} />
                    </span>
                    <span className="trip-destination-picker__option-copy">
                      <strong>{entry.label}</strong>
                      <span>{entry.subtitle}</span>
                    </span>
                    {selected ? (
                      <Check size={16} className="trip-destination-picker__option-check" aria-hidden />
                    ) : null}
                  </button>
                )
              })
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
