import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { ChangeGroupImageModal } from '@/components/features/groups/ChangeGroupImageModal.jsx'
import { CreateGroupGoalsModal } from '@/components/features/groups/CreateGroupGoalsModal.jsx'
import { DeleteGroupModal } from '@/components/features/groups/DeleteGroupModal.jsx'
import { EditGroupModal } from '@/components/features/groups/EditGroupModal.jsx'
import { GroupContributionModal } from '@/components/features/groups/GroupContributionModal.jsx'
import { InviteGroupModal } from '@/components/features/groups/InviteGroupModal.jsx'
import { LeaveGroupModal } from '@/components/features/groups/LeaveGroupModal.jsx'
import { ManageGroupMembersModal } from '@/components/features/groups/ManageGroupMembersModal.jsx'
import { TripFormModal } from '@/components/features/trips/TripFormModal.jsx'
import { TripExpenseFormModal } from '@/components/features/trips/TripExpenseFormModal.jsx'
import { DeleteTripExpenseModal } from '@/components/features/trips/DeleteTripExpenseModal.jsx'
import { GroupDetailChatCard } from '@/components/features/groups/detail/GroupDetailChatCard.jsx'
import { GroupDetailGoalCard } from '@/components/features/groups/detail/GroupDetailGoalCard.jsx'
import { GroupDetailHeader } from '@/components/features/groups/detail/GroupDetailHeader.jsx'
import { GroupDetailMembersCard } from '@/components/features/groups/detail/GroupDetailMembersCard.jsx'
import { GroupDetailTripCard } from '@/components/features/groups/detail/GroupDetailTripCard.jsx'
import * as grupoService from '@/services/grupoService.js'
import * as moedaService from '@/services/moedaService.js'
import * as viagemService from '@/services/viagemService.js'

export default function GroupDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const [grupo, setGrupo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [tripOpen, setTripOpen] = useState(false)
  const [goalsOpen, setGoalsOpen] = useState(false)
  const [contributionOpen, setContributionOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [tripSubmitting, setTripSubmitting] = useState(false)
  const [tripCatalog, setTripCatalog] = useState([])
  const [viagensUsuario, setViagensUsuario] = useState([])
  const [goalsSubmitting, setGoalsSubmitting] = useState(false)
  const [contributionSubmitting, setContributionSubmitting] = useState(false)
  const [imageOpen, setImageOpen] = useState(false)
  const [imageSubmitting, setImageSubmitting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)
  const [manageLoadingId, setManageLoadingId] = useState(null)
  const [selectedMetaId, setSelectedMetaId] = useState(null)
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [expenseTarget, setExpenseTarget] = useState(null)
  const [expenseSubmitting, setExpenseSubmitting] = useState(false)
  const [deleteExpenseOpen, setDeleteExpenseOpen] = useState(false)
  const [deleteExpenseTarget, setDeleteExpenseTarget] = useState(null)
  const [deletingExpense, setDeletingExpense] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [chatMensagens, setChatMensagens] = useState([])
  const [chatPagina, setChatPagina] = useState(1)
  const [chatPaginas, setChatPaginas] = useState(1)
  const [loadingOlderChat, setLoadingOlderChat] = useState(false)

  const carregar = useCallback(async (signal) => {
    setLoading(true)
    try {
      const data = await grupoService.buscarGrupo(id, { signal })
      setGrupo(data)
    } catch (err) {
      if (!signal?.aborted) {
        toastRef.current.error(err.response?.data?.message ?? 'Grupo não encontrado')
        navigate('/groups', { replace: true })
      }
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    const controller = new AbortController()
    carregar(controller.signal)
    return () => controller.abort()
  }, [carregar])

  useEffect(() => {
    if (!id || loading) return undefined

    const interval = setInterval(async () => {
      try {
        const data = await grupoService.buscarGrupo(id)
        setGrupo(data)
      } catch {
        // polling silencioso
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [id, loading])

  const applyGrupo = (data) => {
    setGrupo(data)
    setChatMensagens(data.mensagens ?? [])
  }

  useEffect(() => {
    if (!id) return undefined

    const syncChat = async () => {
      try {
        const data = await grupoService.listarMensagensGrupo(id, { pagina: 1, limite: 20 })
        setChatMensagens(data.mensagens ?? [])
        setChatPagina(data.pagina ?? 1)
        setChatPaginas(data.paginas ?? 1)
      } catch {
        // silencioso
      }
    }

    syncChat()
    const interval = setInterval(syncChat, 10000)
    return () => clearInterval(interval)
  }, [id])

  const carregarMensagensAntigas = async () => {
    if (loadingOlderChat || chatPagina >= chatPaginas) return
    setLoadingOlderChat(true)
    try {
      const nextPage = chatPagina + 1
      const data = await grupoService.listarMensagensGrupo(id, { pagina: nextPage, limite: 20 })
      setChatMensagens((prev) => [...(data.mensagens ?? []), ...prev])
      setChatPagina(nextPage)
      setChatPaginas(data.paginas ?? chatPaginas)
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao carregar mensagens')
    } finally {
      setLoadingOlderChat(false)
    }
  }

  const copyCode = async (text, message = 'Código copiado!') => {
    try {
      await navigator.clipboard.writeText(text)
      toastRef.current.success(message)
    } catch {
      toastRef.current.error('Não foi possível copiar')
    }
  }

  const handleEditGroup = async (payload) => {
    setEditSubmitting(true)
    try {
      const data = await grupoService.editarGrupo(id, payload)
      applyGrupo(data)
      setEditOpen(false)
      toastRef.current.success('Grupo atualizado!')
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao atualizar grupo')
      throw err
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleRemoveMember = async (usuarioId) => {
    setManageLoadingId(usuarioId)
    try {
      await grupoService.removerMembroGrupo(id, usuarioId)
      const data = await grupoService.buscarGrupo(id)
      applyGrupo(data)
      toastRef.current.success('Membro removido.')
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao remover membro')
      throw err
    } finally {
      setManageLoadingId(null)
    }
  }

  const handleChangeMemberRole = async (usuarioId, papel) => {
    setManageLoadingId(usuarioId)
    try {
      const data = await grupoService.alterarPapelMembroGrupo(id, usuarioId, papel)
      applyGrupo(data)
      toastRef.current.success(papel === 'ADMIN' ? 'Novo administrador definido.' : 'Papel atualizado.')
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao alterar papel')
      throw err
    } finally {
      setManageLoadingId(null)
    }
  }

  const handleRegenerateCode = async () => {
    try {
      const data = await grupoService.renovarCodigoConviteGrupo(id)
      applyGrupo(data)
      toastRef.current.success('Novo código de convite gerado!')
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao renovar código')
    }
  }

  const metasAtivas =
    grupo?.metasLista?.filter((m) => m.status === 'ATIVA') ??
    (grupo?.meta?.status === 'ATIVA' ? [grupo.meta] : [])

  const openContribution = (metaId) => {
    setSelectedMetaId(
      metaId ?? metasAtivas[0]?.id ?? grupo?.meta?.primaryMetaId ?? grupo?.meta?.id ?? null
    )
    setContributionOpen(true)
  }

  useEffect(() => {
    if (!tripOpen) return undefined

    let active = true

    Promise.all([moedaService.obterCatalogo(), viagemService.listarViagens()])
      .then(([catalogData, viagensData]) => {
        if (!active) return
        setTripCatalog(catalogData.moedas ?? [])
        setViagensUsuario(viagensData ?? [])
      })
      .catch(() => {
        if (!active) {
          setTripCatalog([])
          setViagensUsuario([])
        }
      })

    return () => {
      active = false
    }
  }, [tripOpen])

  const handleLinkTrip = async (payload) => {
    setTripSubmitting(true)
    try {
      const data = await grupoService.criarViagemGrupo(id, {
        viagemId: payload.viagemId ?? undefined,
        destino: payload.destino,
        destinoMeta: payload.destinoMeta ?? undefined,
        moeda: payload.moeda,
        dataPrevista: payload.dataPrevista,
      })
      applyGrupo(data)
      setTripOpen(false)
      toastRef.current.success('Viagem vinculada ao grupo!')
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao vincular viagem')
      throw err
    } finally {
      setTripSubmitting(false)
    }
  }

  const handleChangeImage = async ({ urlImagem }) => {
    setImageSubmitting(true)
    try {
      const data = await grupoService.editarGrupo(id, { urlImagem })
      applyGrupo(data)
      setImageOpen(false)
      toastRef.current.success(
        urlImagem ? 'Imagem do grupo atualizada!' : 'Imagem da viagem restaurada!'
      )
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao atualizar imagem')
      throw err
    } finally {
      setImageSubmitting(false)
    }
  }

  const handleCreateGoals = async (metas) => {
    setGoalsSubmitting(true)
    try {
      const data = await grupoService.criarMetasGrupo(id, metas)
      applyGrupo(data)
      setGoalsOpen(false)
      toastRef.current.success(metas.length === 1 ? 'Meta criada!' : 'Metas criadas!')
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao criar metas')
      throw err
    } finally {
      setGoalsSubmitting(false)
    }
  }

  const openNewExpense = () => {
    if (!grupo?.viagem) {
      toastRef.current.info('Vincule uma viagem ao grupo antes de adicionar pretensões.')
      return
    }
    setExpenseTarget(null)
    setExpenseOpen(true)
  }

  const openEditExpense = (despesa) => {
    setExpenseTarget(despesa)
    setExpenseOpen(true)
  }

  const openDeleteExpense = (despesa) => {
    setDeleteExpenseTarget(despesa)
    setDeleteExpenseOpen(true)
  }

  const handleExpenseSubmit = async (payload) => {
    setExpenseSubmitting(true)
    try {
      const data = expenseTarget
        ? await grupoService.editarDespesaViagemGrupo(id, expenseTarget.id, payload)
        : await grupoService.criarDespesaViagemGrupo(id, payload)

      applyGrupo(data)
      setExpenseOpen(false)
      setExpenseTarget(null)
      toastRef.current.success(expenseTarget ? 'Pretensão atualizada!' : 'Pretensão adicionada!')
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Não foi possível salvar a pretensão')
      throw err
    } finally {
      setExpenseSubmitting(false)
    }
  }

  const confirmDeleteExpense = async () => {
    if (!deleteExpenseTarget) return

    setDeletingExpense(true)
    try {
      const data = await grupoService.excluirDespesaViagemGrupo(id, deleteExpenseTarget.id)
      applyGrupo(data)
      setDeleteExpenseOpen(false)
      setDeleteExpenseTarget(null)
      setExpenseOpen(false)
      setExpenseTarget(null)
      toastRef.current.success('Pretensão removida!')
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao excluir pretensão')
    } finally {
      setDeletingExpense(false)
    }
  }

  const handleContribution = async (payload) => {
    const metaId = payload.metaId ?? selectedMetaId ?? grupo?.meta?.primaryMetaId ?? grupo?.meta?.id
    if (!metaId) return

    setContributionSubmitting(true)
    try {
      const data = await grupoService.registrarAporteGrupo(id, metaId, {
        valor: payload.valor,
        data: payload.data,
      })
      applyGrupo(data)
      setContributionOpen(false)
      toastRef.current.success('Aporte registrado!')
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao registrar aporte')
      throw err
    } finally {
      setContributionSubmitting(false)
    }
  }

  const handleSendMessage = async (conteudo) => {
    setSendingMessage(true)
    try {
      const data = await grupoService.enviarMensagemGrupo(id, { conteudo })
      applyGrupo(data)
      setChatMensagens(data.mensagens ?? [])
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao enviar mensagem')
      throw err
    } finally {
      setSendingMessage(false)
    }
  }

  const confirmarExcluir = async () => {
    if (!grupo) return
    setDeleting(true)
    try {
      await grupoService.excluirGrupo(grupo.id)
      toastRef.current.success('Grupo excluído!')
      navigate('/groups', { replace: true })
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao excluir grupo')
    } finally {
      setDeleting(false)
    }
  }

  const confirmarSair = async () => {
    if (!grupo) return
    setLeaving(true)
    try {
      await grupoService.sairDoGrupo(grupo.id)
      toastRef.current.success('Você saiu do grupo.')
      navigate('/groups', { replace: true })
    } catch (err) {
      toastRef.current.error(err.response?.data?.message ?? 'Erro ao sair do grupo')
    } finally {
      setLeaving(false)
    }
  }

  if (loading) {
    return (
      <div className="group-detail-page group-detail-page--loading">
        <SpinnerDots center label="Carregando grupo..." />
      </div>
    )
  }

  if (!grupo) return null

  const isAdmin = grupo.meuPapel === 'ADMIN'

  return (
    <div className="group-detail-page">
      <GroupDetailHeader
        grupo={grupo}
        onCopyCode={copyCode}
        onChangeImage={() => setImageOpen(true)}
        onEdit={() => setEditOpen(true)}
        isAdmin={isAdmin}
        onDelete={() => setDeleteOpen(true)}
        onLeave={() => setLeaveOpen(true)}
      />

      <div className="group-detail-page__grid">
        <GroupDetailMembersCard
          grupo={grupo}
          onInvite={() => setInviteOpen(true)}
          onManage={() => setManageOpen(true)}
        />
        <GroupDetailTripCard
          grupoId={grupo.id}
          viagem={grupo.viagem}
          membros={grupo.membros}
          onLinkTrip={() => setTripOpen(true)}
          onAddExpense={openNewExpense}
          onEditExpense={openEditExpense}
        />
        <GroupDetailGoalCard
          meta={grupo.meta}
          metasLista={grupo.metasLista}
          membros={grupo.membros}
          onCreateGoal={() => setGoalsOpen(true)}
          onContribute={openContribution}
          canAddMeta={metasAtivas.length < 5}
        />
        <GroupDetailChatCard
          mensagens={chatMensagens}
          onSend={handleSendMessage}
          sending={sendingMessage}
          hasOlder={chatPagina < chatPaginas}
          onLoadOlder={carregarMensagensAntigas}
          loadingOlder={loadingOlderChat}
        />
      </div>

      <InviteGroupModal
        open={inviteOpen}
        grupo={grupo}
        onClose={() => setInviteOpen(false)}
        onCopyCode={copyCode}
        isAdmin={isAdmin}
        onRegenerateCode={handleRegenerateCode}
      />

      <TripFormModal
        open={tripOpen}
        onClose={() => setTripOpen(false)}
        onSubmit={handleLinkTrip}
        grupo={grupo}
        groupMode
        catalog={tripCatalog}
        existingTrips={viagensUsuario}
        submitting={tripSubmitting}
      />

      <TripExpenseFormModal
        open={expenseOpen}
        onClose={() => {
          setExpenseOpen(false)
          setExpenseTarget(null)
        }}
        viagem={grupo.viagem}
        despesa={expenseTarget}
        totalAtual={grupo.viagem?.totalGrupo ?? 0}
        previewTotalLabel="Total do grupo com esta pretensão:"
        onSubmit={handleExpenseSubmit}
        onDelete={expenseTarget ? () => openDeleteExpense(expenseTarget) : undefined}
        submitting={expenseSubmitting}
      />

      <DeleteTripExpenseModal
        open={deleteExpenseOpen}
        onClose={() => {
          setDeleteExpenseOpen(false)
          setDeleteExpenseTarget(null)
        }}
        despesa={deleteExpenseTarget}
        onConfirm={confirmDeleteExpense}
        loading={deletingExpense}
      />

      <CreateGroupGoalsModal
        open={goalsOpen}
        grupo={grupo}
        slotsRestantes={5 - metasAtivas.length}
        onClose={() => setGoalsOpen(false)}
        onSubmit={handleCreateGoals}
        loading={goalsSubmitting}
      />

      <GroupContributionModal
        open={contributionOpen}
        grupo={grupo}
        metasAtivas={metasAtivas}
        selectedMetaId={selectedMetaId}
        onMetaChange={setSelectedMetaId}
        onClose={() => setContributionOpen(false)}
        onSubmit={handleContribution}
        loading={contributionSubmitting}
      />

      <EditGroupModal
        open={editOpen}
        grupo={grupo}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditGroup}
        loading={editSubmitting}
      />

      <ManageGroupMembersModal
        open={manageOpen}
        grupo={grupo}
        onClose={() => setManageOpen(false)}
        onRemoveMember={handleRemoveMember}
        onChangeRole={handleChangeMemberRole}
        loadingId={manageLoadingId}
      />

      <ChangeGroupImageModal
        open={imageOpen}
        grupo={grupo}
        onClose={() => setImageOpen(false)}
        onSubmit={handleChangeImage}
        loading={imageSubmitting}
      />

      <DeleteGroupModal
        open={deleteOpen}
        grupo={grupo}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmarExcluir}
        loading={deleting}
      />

      <LeaveGroupModal
        open={leaveOpen}
        grupo={grupo}
        onClose={() => setLeaveOpen(false)}
        onConfirm={confirmarSair}
        loading={leaving}
      />
    </div>
  )
}
