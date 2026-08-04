import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link2, Plus, Users } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { GroupList } from '@/components/features/groups/GroupList.jsx'
import { GroupsJoinBanner } from '@/components/features/groups/GroupsJoinBanner.jsx'
import { CreateGroupModal } from '@/components/features/groups/CreateGroupModal.jsx'
import { InviteGroupModal } from '@/components/features/groups/InviteGroupModal.jsx'
import { DeleteGroupModal } from '@/components/features/groups/DeleteGroupModal.jsx'
import { JoinGroupModal } from '@/components/features/groups/JoinGroupModal.jsx'
import { LeaveGroupModal } from '@/components/features/groups/LeaveGroupModal.jsx'
import * as grupoService from '@/services/grupoService.js'

export default function GroupsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [grupos, setGrupos] = useState([])
  const [loading, setLoading] = useState(true)
  const [bannerCode, setBannerCode] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const [joinOpen, setJoinOpen] = useState(false)
  const [joinSeed, setJoinSeed] = useState('')

  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteGrupo, setInviteGrupo] = useState(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [leaveOpen, setLeaveOpen] = useState(false)
  const [leaveTarget, setLeaveTarget] = useState(null)
  const [leaving, setLeaving] = useState(false)

  const recarregar = useCallback(async (signal) => {
    setLoading(true)
    try {
      const data = await grupoService.listarGrupos({ signal })
      setGrupos(data ?? [])
    } catch (err) {
      if (!signal?.aborted) {
        toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar grupos')
      }
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    recarregar(controller.signal)
    return () => controller.abort()
  }, [recarregar])

  useEffect(() => {
    const convite = searchParams.get('convite')
    if (!convite) return
    setJoinSeed(convite)
    setJoinOpen(true)
    setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  const copyToClipboard = async (text, successMessage = 'Código copiado!') => {
    try {
      await navigator.clipboard.writeText(text)
      toastRef.current.success(successMessage)
    } catch {
      toastRef.current.error('Não foi possível copiar')
    }
  }

  const handleCreate = async ({ nome, descricao, imagemFile }) => {
    setCreating(true)
    try {
      let grupo = await grupoService.criarGrupo({ nome, descricao })
      if (imagemFile) {
        grupo = await grupoService.enviarImagemGrupo(grupo.id, imagemFile)
      }
      toastRef.current.success('Grupo criado com sucesso!')
      setCreateOpen(false)
      await recarregar()
      const detalhe = await grupoService.buscarGrupo(grupo.id)
      setInviteGrupo(detalhe)
      setInviteOpen(true)
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao criar grupo')
    } finally {
      setCreating(false)
    }
  }

  const openInvite = async (grupo) => {
    try {
      const detalhe = await grupoService.buscarGrupo(grupo.id)
      setInviteGrupo(detalhe)
      setInviteOpen(true)
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar convite')
    }
  }

  const openJoin = (seed = '') => {
    setJoinSeed(seed)
    setJoinOpen(true)
  }

  const abrirExcluir = (grupo) => {
    setDeleteTarget(grupo)
    setDeleteOpen(true)
  }

  const abrirSair = (grupo) => {
    setLeaveTarget(grupo)
    setLeaveOpen(true)
  }

  const confirmarSair = async () => {
    if (!leaveTarget) return
    setLeaving(true)
    try {
      await grupoService.sairDoGrupo(leaveTarget.id)
      toastRef.current.success('Você saiu do grupo.')
      setLeaveOpen(false)
      setLeaveTarget(null)
      await recarregar()
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao sair do grupo')
    } finally {
      setLeaving(false)
    }
  }

  const confirmarExcluir = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await grupoService.excluirGrupo(deleteTarget.id)
      toastRef.current.success('Grupo excluído!')
      setDeleteOpen(false)
      setDeleteTarget(null)
      await recarregar()
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao excluir grupo')
    } finally {
      setDeleting(false)
    }
  }

  const handleBannerJoin = () => {
    if (!bannerCode.trim()) {
      openJoin()
      return
    }
    openJoin(bannerCode)
  }

  const hasGrupos = grupos.length > 0
  const showEmpty = !loading && !hasGrupos
  const showJoinBanner = !loading && (showEmpty || hasGrupos)

  return (
    <div className="groups-page">
      <header className="groups-page__header">
        <div>
          <h1 className="groups-page__title">Meus Grupos</h1>
          <p className="groups-page__subtitle">
            Gerencie e participe dos seus grupos financeiros.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
          Novo Grupo
        </Button>
      </header>

      <div className="groups-page__panel">
        {loading ? (
          <div className="groups-page__loading">
            <SpinnerDots center label="Carregando grupos..." />
          </div>
        ) : showEmpty ? (
          <EmptyState
            className="groups-page__empty"
            icon={<Users size={28} strokeWidth={1.5} />}
            title="Você ainda não participa de nenhum grupo"
            description="Crie um grupo ou entre com um código de convite para organizar finanças em conjunto."
            action={{
              label: 'Criar grupo',
              onClick: () => setCreateOpen(true),
              leftIcon: <Plus size={16} />,
            }}
            secondaryAction={{
              label: 'Entrar com código',
              onClick: () => openJoin(),
              leftIcon: <Link2 size={16} />,
            }}
          />
        ) : (
          <>
            <h2 className="groups-page__section-title">Meus grupos</h2>
            <GroupList
              grupos={grupos}
              onOpen={(grupo) => navigate(`/groups/${grupo.id}`)}
              onInvite={openInvite}
              onCopyCode={(code) => copyToClipboard(code)}
              onDelete={abrirExcluir}
              onLeave={abrirSair}
            />
          </>
        )}
      </div>

      {showJoinBanner ? (
        <GroupsJoinBanner
          code={bannerCode}
          onCodeChange={setBannerCode}
          onJoin={handleBannerJoin}
        />
      ) : null}

      <CreateGroupModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        loading={creating}
      />

      <JoinGroupModal
        open={joinOpen}
        initialCodigo={joinSeed}
        onClose={() => setJoinOpen(false)}
        onJoined={() => recarregar()}
      />

      <InviteGroupModal
        open={inviteOpen}
        grupo={inviteGrupo}
        onClose={() => setInviteOpen(false)}
        onCopyCode={(text, message) => copyToClipboard(text, message ?? 'Código copiado!')}
      />

      <DeleteGroupModal
        open={deleteOpen}
        grupo={deleteTarget}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={confirmarExcluir}
        loading={deleting}
      />

      <LeaveGroupModal
        open={leaveOpen}
        grupo={leaveTarget}
        onClose={() => {
          setLeaveOpen(false)
          setLeaveTarget(null)
        }}
        onConfirm={confirmarSair}
        loading={leaving}
      />
    </div>
  )
}
