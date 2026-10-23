import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Info,
  Link2,
  Loader2,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { AvatarGroup } from '@/design-system/components/data-display/Avatar/AvatarGroup.jsx'
import * as grupoService from '@/services/grupoService.js'
import {
  codigoGrupoCompleto,
  codigoGrupoParcial,
  formatarCodigoGrupoInput,
  normalizarCodigoGrupo,
} from '@/utils/groupInvite.js'
import { limparNomeGrupoMembro } from '@/utils/groupFormat.js'
import { GroupThumbnail } from '@/components/features/groups/GroupThumbnail.jsx'

/** idle | partial | searching | found | error | already_member */
function resolveJoinState({ codigo, loading, preview, error, searched }) {
  if (loading) return 'searching'
  if (error && searched) return 'error'
  if (preview?.jaMembro) return 'already_member'
  if (preview && searched) return 'found'
  if (codigoGrupoParcial(codigo)) return 'partial'
  return 'idle'
}

export function JoinGroupModal({ open, onClose, initialCodigo = '', onJoined }) {
  const navigate = useNavigate()
  const [codigo, setCodigo] = useState('')
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const seed = formatarCodigoGrupoInput(initialCodigo || '')
    setCodigo(seed)
    setPreview(null)
    setError('')
    setSearched(false)
    setLoading(false)
    setJoining(false)
  }, [open, initialCodigo])

  const fetchPreview = useCallback(async (value) => {
    const normalized = normalizarCodigoGrupo(value)
    if (!codigoGrupoCompleto(normalized)) {
      setPreview(null)
      setError('')
      setSearched(false)
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    setSearched(false)

    try {
      const data = await grupoService.previewGrupoPorCodigo(normalized)
      setPreview(data)
      setSearched(true)
    } catch (err) {
      setPreview(null)
      setError(err.response?.data?.message ?? 'Código inválido ou grupo não encontrado')
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!codigoGrupoCompleto(codigo)) {
      setPreview(null)
      setError('')
      setSearched(false)
      setLoading(false)
      return undefined
    }

    debounceRef.current = setTimeout(() => {
      fetchPreview(codigo)
    }, 450)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [codigo, open, fetchPreview])

  const state = resolveJoinState({ codigo, loading, preview, error, searched })

  const handleChange = (event) => {
    setCodigo(formatarCodigoGrupoInput(event.target.value))
  }

  const handleJoin = async () => {
    if (state === 'already_member' && preview?.id) {
      onClose?.()
      navigate(`/groups/${preview.id}`)
      return
    }

    if (!preview || !codigoGrupoCompleto(codigo)) return

    setJoining(true)
    try {
      const grupo = await grupoService.entrarNoGrupo(codigo)
      onJoined?.(grupo)
      onClose?.()
      navigate(`/groups/${grupo.id}`)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível entrar no grupo')
      setSearched(true)
    } finally {
      setJoining(false)
    }
  }

  const primaryDisabled =
    joining ||
    loading ||
    state === 'idle' ||
    state === 'partial' ||
    state === 'error' ||
    state === 'searching'

  const primaryLabel =
    state === 'already_member'
      ? 'Ir para o grupo'
      : state === 'found'
        ? 'Entrar neste grupo'
        : 'Entrar'

  const showIdleHint = state === 'idle' && !codigo.trim()

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="group-join-modal">
      <header className="group-join-modal__header">
        <h2>Entrar em um Grupo</h2>
        <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
      </header>

      <div className="group-join-modal__body">
        {showIdleHint ? (
          <div className="group-join-modal__idle" aria-hidden>
            <span className="group-join-modal__idle-icon">
              <Link2 size={36} strokeWidth={1.5} />
            </span>
            <p>Cole o código de convite que recebeu</p>
            <small>O código tem formato PULSO-XXXX</small>
          </div>
        ) : null}

        <InputText
          className="group-join-modal__input"
          value={codigo}
          onChange={handleChange}
          placeholder="PULSO-XXXX"
          leftIcon={<Link2 size={16} />}
          error={state === 'error' ? error : undefined}
          autoFocus
        />

        {state === 'partial' ? (
          <div className="group-join-modal__hint group-join-modal__hint--info" role="status">
            <Info size={16} aria-hidden />
            <span>Digite o código completo para buscar o grupo</span>
          </div>
        ) : null}

        {state === 'searching' ? (
          <div className="group-join-modal__searching" role="status">
            <Loader2 size={28} className="group-join-modal__spinner animate-spin" aria-hidden />
            <p>Buscando grupo...</p>
          </div>
        ) : null}

        {(state === 'found' || state === 'already_member') && preview ? (
          <>
            <article className="group-join-modal__preview">
              <GroupThumbnail nome={preview.nome} size="sm" className="group-join-modal__preview-thumb" />
              <div className="group-join-modal__preview-copy">
                <h3>{preview.nome}</h3>
                <p>{preview.quantidadeMembros} membros</p>
                <AvatarGroup
                  avatars={(preview.membrosPreview ?? []).map((m) => ({
                    name: limparNomeGrupoMembro(m.nome),
                    src: m.urlAvatar,
                    id: m.id,
                  }))}
                  max={4}
                  size="sm"
                />
                {preview.criador ? (
                  <p className="group-join-modal__preview-creator">
                    Criado por: {limparNomeGrupoMembro(preview.criador.nome)}
                  </p>
                ) : null}
              </div>
            </article>

            {state === 'already_member' ? (
              <div className="group-join-modal__hint group-join-modal__hint--success" role="status">
                <CheckCircle2 size={16} aria-hidden />
                <span>Você já faz parte deste grupo</span>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <footer className="group-join-modal__footer">
        <Button
          type="button"
          variant="primary"
          fullWidth
          onClick={handleJoin}
          loading={joining}
          disabled={primaryDisabled && state !== 'already_member'}
          rightIcon={state === 'already_member' ? <ArrowRight size={16} /> : undefined}
        >
          {primaryLabel}
        </Button>
        <Button type="button" variant="ghost" fullWidth className="group-join-modal__cancel" onClick={onClose} disabled={joining}>
          Cancelar
        </Button>
      </footer>
    </Modal>
  )
}
