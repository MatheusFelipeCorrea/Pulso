import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Check,
    ChevronRight,
    Crown,
    FileText,
    LogOut,
    Moon,
    Settings,
    Shield,
    Sun,
    Trash2,
    User,
} from 'lucide-react'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { PulsoBadge } from '@/components/badges/PulsoBadge.jsx'
import { badgeKindFromModoUso } from '@/components/badges/enumMappers'
import { useTheme } from '@/design-system/hooks/useTheme.js'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearUser } from '@/store/slices/authSlice'
import {
    clearAuthTokens,
    deleteAccount as deleteAccountApi,
    logout as logoutApi,
} from '@/services/authService'
import { getUserDisplayName } from '@/utils/userDisplayName'

const DELETE_CONFIRMATION = 'APAGAR'

const FREE_FEATURES = [
    'Dashboard e transações',
    'Orçamento e calendário',
    'Metas, dívidas e divisão',
    'Planejamento de compra',
]

const PREMIUM_FEATURES = [
    'Tudo do plano Free',
    'Grupos com convite e chat',
    'Viagens e moedas',
    'R$ 50/mês em reais',
]

const MODO_USO_LABEL = {
    ESTAGIARIO: 'Estagiário',
    CLT: 'CLT',
    PJ: 'PJ / Freelancer',
    PESSOA_FISICA: 'Pessoa física',
}

function FieldRow({ label, value }) {
    return (
        <div className="account-page__row">
            <dt>{label}</dt>
            <dd>{value}</dd>
        </div>
    )
}

export default function AccountPage({ mode = 'profile' }) {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const toast = useToast()
    const user = useAppSelector((state) => state.auth.user)
    const { theme, setThemePreference } = useTheme()
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const isSettings = mode === 'settings'
    const nome = getUserDisplayName(user?.nome)
    const email = user?.email ?? '—'
    const isPremium = (user?.plano ?? 'FREE').toUpperCase() === 'PREMIUM'
    const modoKey = user?.modoUso ?? 'CLT'
    const modoLabel = MODO_USO_LABEL[modoKey] ?? modoKey.replaceAll('_', ' ')
    const badgeKind = badgeKindFromModoUso(modoKey) ?? 'perfil.clt'
    const features = isPremium ? PREMIUM_FEATURES : FREE_FEATURES

    const clearLocalSession = () => {
        clearAuthTokens()
        dispatch(clearUser())
        navigate('/login', { replace: true })
    }

    const handleLogout = async () => {
        try {
            await logoutApi()
        } catch {
            /* ignore */
        }
        clearLocalSession()
    }

    const handleDeleteAccount = async () => {
        setDeleting(true)
        try {
            await deleteAccountApi()
            setDeleteOpen(false)
            toast.success('Conta apagada. Seus dados foram removidos.')
            clearLocalSession()
        } catch (err) {
            toast.error(err.response?.data?.message ?? 'Não foi possível apagar a conta.')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className={`account-page${isSettings ? ' account-page--settings' : ''}`}>
            <header className="account-page__header">
                <div>
                    <p className="account-page__eyebrow">Conta</p>
                    <h1 className="account-page__title">
                        {isSettings ? 'Configurações' : 'Perfil'}
                    </h1>
                    <p className="account-page__subtitle">
                        {isSettings
                            ? 'Aparência, documentos e sessão neste dispositivo.'
                            : 'Seus dados e o plano ativo no Pulso.'}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={isSettings ? <User size={14} /> : <Settings size={14} />}
                    onClick={() => navigate(isSettings ? '/profile' : '/settings')}
                >
                    {isSettings ? 'Perfil' : 'Configurações'}
                </Button>
            </header>

            {isSettings ? (
                <>
                    <button
                        type="button"
                        className="account-page__mini-profile"
                        onClick={() => navigate('/profile')}
                    >
                        <Avatar
                            src={user?.urlAvatar ?? null}
                            name={nome}
                            size="lg"
                            fallback="primary"
                        />
                        <span className="account-page__mini-copy">
                            <span className="account-page__mini-name">{nome}</span>
                            <span className="account-page__mini-meta">
                                {email}
                                <span aria-hidden>·</span>
                                {isPremium ? 'Premium' : 'Free'}
                            </span>
                        </span>
                        <span className="account-page__mini-action">
                            Ver perfil
                            <ChevronRight size={16} aria-hidden />
                        </span>
                    </button>

                    <section className="account-page__card account-page__card--theme">
                        <div className="account-page__section-head">
                            <h3 className="account-page__section-title">Aparência</h3>
                            <p className="account-page__section-copy">
                                Escolha o tema da interface. Também fica no menu do avatar.
                            </p>
                        </div>

                        <div className="account-page__theme-grid" role="group" aria-label="Tema da interface">
                            <button
                                type="button"
                                className={`account-page__theme-card${theme === 'light' ? ' account-page__theme-card--active' : ''}`}
                                onClick={() => setThemePreference('light')}
                                aria-pressed={theme === 'light'}
                            >
                                <span className="account-page__theme-preview account-page__theme-preview--light" aria-hidden>
                                    <span />
                                    <span />
                                    <span />
                                </span>
                                <span className="account-page__theme-meta">
                                    <Sun size={16} strokeWidth={2} aria-hidden />
                                    Claro
                                    {theme === 'light' ? <Check size={14} className="account-page__theme-check" /> : null}
                                </span>
                            </button>

                            <button
                                type="button"
                                className={`account-page__theme-card${theme === 'dark' ? ' account-page__theme-card--active' : ''}`}
                                onClick={() => setThemePreference('dark')}
                                aria-pressed={theme === 'dark'}
                            >
                                <span className="account-page__theme-preview account-page__theme-preview--dark" aria-hidden>
                                    <span />
                                    <span />
                                    <span />
                                </span>
                                <span className="account-page__theme-meta">
                                    <Moon size={16} strokeWidth={2} aria-hidden />
                                    Escuro
                                    {theme === 'dark' ? <Check size={14} className="account-page__theme-check" /> : null}
                                </span>
                            </button>
                        </div>
                    </section>

                    <section className="account-page__card account-page__card--list">
                        <div className="account-page__section-head account-page__section-head--pad">
                            <h3 className="account-page__section-title">Documentos</h3>
                            <p className="account-page__section-copy">Termos e privacidade do Pulso.</p>
                        </div>
                        <div className="account-page__list">
                            <Link className="account-page__list-item" to="/termos">
                                <span className="account-page__list-icon" aria-hidden>
                                    <FileText size={16} />
                                </span>
                                <span className="account-page__list-copy">
                                    <span className="account-page__list-title">Termos de uso</span>
                                    <span className="account-page__list-hint">Regras de uso da plataforma</span>
                                </span>
                                <ChevronRight size={16} aria-hidden />
                            </Link>
                            <Link className="account-page__list-item" to="/privacidade">
                                <span className="account-page__list-icon" aria-hidden>
                                    <Shield size={16} />
                                </span>
                                <span className="account-page__list-copy">
                                    <span className="account-page__list-title">Política de privacidade</span>
                                    <span className="account-page__list-hint">Como tratamos seus dados</span>
                                </span>
                                <ChevronRight size={16} aria-hidden />
                            </Link>
                        </div>
                    </section>

                    <section className="account-page__card account-page__card--danger">
                        <div className="account-page__section-head">
                            <h3 className="account-page__section-title">Zona de risco</h3>
                            <p className="account-page__section-copy">
                                Sair encerra só este navegador. Apagar remove a conta e os dados
                                financeiros de forma permanente.
                            </p>
                        </div>
                        <div className="account-page__danger-actions">
                            <Button
                                variant="outline"
                                leftIcon={<LogOut size={16} />}
                                onClick={handleLogout}
                                fullWidth
                            >
                                Sair da conta
                            </Button>
                            <Button
                                variant="danger"
                                leftIcon={<Trash2 size={16} />}
                                onClick={() => setDeleteOpen(true)}
                                fullWidth
                            >
                                Apagar minha conta
                            </Button>
                        </div>
                    </section>

                    <ConfirmModal
                        isOpen={deleteOpen}
                        onClose={() => !deleting && setDeleteOpen(false)}
                        onConfirm={handleDeleteAccount}
                        title="Apagar sua conta?"
                        message="Isso remove permanentemente seus dados financeiros, grupos criados e preferências. Não dá para desfazer."
                        confirmLabel="Apagar conta"
                        cancelLabel="Manter conta"
                        tone="danger"
                        variant="critical"
                        confirmationText={DELETE_CONFIRMATION}
                        loading={deleting}
                        icon={<Trash2 size={24} strokeWidth={1.75} aria-hidden />}
                    />
                </>
            ) : (
                <>
                    <section className="account-page__card account-page__card--identity">
                        <div className="account-page__identity">
                            <Avatar
                                src={user?.urlAvatar ?? null}
                                name={nome}
                                size="xl"
                                fallback="primary"
                                className="account-page__avatar"
                            />
                            <div className="account-page__identity-copy">
                                <h2 className="account-page__name">{nome}</h2>
                                <p className="account-page__email">{email}</p>
                                <div className="account-page__badges">
                                    <PulsoBadge kind={badgeKind} size="sm" />
                                    <span
                                        className={`account-page__plan-pill${isPremium ? ' account-page__plan-pill--premium' : ''}`}
                                    >
                                        {isPremium ? (
                                            <Crown size={13} aria-hidden />
                                        ) : (
                                            <Shield size={13} aria-hidden />
                                        )}
                                        {isPremium ? 'Premium' : 'Free'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <dl className="account-page__rows">
                            <FieldRow label="Nome" value={nome} />
                            <FieldRow label="E-mail" value={email} />
                            <FieldRow label="Perfil de uso" value={modoLabel} />
                            <FieldRow label="Plano" value={isPremium ? 'Premium' : 'Free'} />
                        </dl>
                    </section>

                    <section
                        className={`account-page__card account-page__card--plan${isPremium ? ' account-page__card--plan-premium' : ''}`}
                    >
                        <div className="account-page__plan-head">
                            <h3 className="account-page__section-title">
                                {isPremium ? 'Incluído no Premium' : 'Incluído no Free'}
                            </h3>
                            <p className="account-page__section-copy">
                                {isPremium
                                    ? 'Grupos e viagens liberados nesta conta.'
                                    : 'Core financeiro liberado. Premium adiciona grupos e viagens por R$ 50/mês.'}
                            </p>
                        </div>
                        <ul className="account-page__features">
                            {features.map((feature) => (
                                <li key={feature}>
                                    <Check size={15} strokeWidth={2.4} aria-hidden />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </>
            )}
        </div>
    )
}
