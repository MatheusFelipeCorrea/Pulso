import { useEffect, useMemo, useState } from 'react'
import { CircleDollarSign, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { CurrencySearchPicker } from '@/components/features/trips/CurrencySearchPicker.jsx'

export function AddFavoriteCurrencyModal({
  open,
  onClose,
  onSubmit,
  catalog = [],
  favoritas = [],
  submitting = false,
}) {
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')

  const favoritasSet = useMemo(
    () => new Set(favoritas.map((item) => item.code)),
    [favoritas]
  )

  const availableCount = useMemo(
    () => catalog.filter((item) => !favoritasSet.has(item.code)).length,
    [catalog, favoritasSet]
  )

  useEffect(() => {
    if (!open) return
    setError('')
    const first = catalog.find((item) => !favoritasSet.has(item.code))
    setCodigo(first?.code ?? '')
  }, [open, catalog, favoritasSet])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!codigo) {
      setError('Selecione uma moeda para adicionar.')
      return
    }

    try {
      await onSubmit?.(codigo)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível adicionar a moeda.')
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="trip-favorite-modal">
      <form className="trip-favorite-form" onSubmit={handleSubmit} noValidate>
        <header className="trip-favorite-form__header">
          <div>
            <h2>Adicionar moeda favorita</h2>
            <p>Escolha uma moeda para acompanhar a cotação em tempo real.</p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="trip-favorite-form__body">
          {availableCount === 0 ? (
            <p className="trip-favorite-form__empty">
              Todas as moedas disponíveis já estão nos seus favoritos.
            </p>
          ) : (
            <CurrencySearchPicker
              catalog={catalog}
              value={codigo}
              onChange={setCodigo}
              filterItems={(item) => !favoritasSet.has(item.code)}
              label={
                <FormFieldLabel icon={CircleDollarSign} tone="purple">
                  Moeda
                </FormFieldLabel>
              }
            />
          )}

          {error ? <p className="trip-favorite-form__error">{error}</p> : null}
        </div>

        <footer className="trip-favorite-form__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            disabled={!availableCount}
          >
            Adicionar favorita
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
