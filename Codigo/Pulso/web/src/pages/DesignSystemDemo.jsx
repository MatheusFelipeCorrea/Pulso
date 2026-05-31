import { useState } from 'react'
import { Edit, Trash, X, Plus, Check } from 'lucide-react'
import { Button, IconButton } from '../design-system/components/buttons/index.js'
import { Spinner, SpinnerDots, SpinnerFullscreen, useToast, Alert } from '../design-system/components/feedback/index.js'
import { Tooltip } from '../design-system/components/data-display/index.js'

/**
 * Página de demonstração do Design System
 * Para testar componentes: Button, IconButton, Spinner, Tooltip
 */
export default function DesignSystemDemo() {
  const [darkMode, setDarkMode] = useState(false)
  const [loadingButtons, setLoadingButtons] = useState({})
  const toast = useToast()

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Simula loading em um botão específico
  const handleLoadingDemo = (id) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setLoadingButtons((prev) => ({ ...prev, [id]: false }))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[var(--ds-color-background)] text-[var(--ds-color-text)] p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[var(--ds-color-primary)] mb-2">
              💜 Pulso Design System
            </h1>
            <p className="text-[var(--ds-color-text-secondary)]">
              Biblioteca de componentes UI genéricos e reutilizáveis
            </p>
          </div>
          <Button
            variant={darkMode ? 'secondary' : 'primary'}
            onClick={toggleDarkMode}
          >
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* ============================================================
            SECTION: BUTTONS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Botões
          </h2>

          {/* Variantes */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Variantes
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            {/* Tamanhos */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Tamanhos
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">Small (32px)</Button>
                <Button variant="primary" size="md">Medium (40px)</Button>
                <Button variant="primary" size="lg">Large (48px)</Button>
              </div>
            </div>

            {/* Estados */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Estados
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" disabled>Disabled</Button>
                <Button
                  variant="primary"
                  loading={loadingButtons.btn1}
                  onClick={() => handleLoadingDemo('btn1')}
                >
                  {loadingButtons.btn1 ? 'Carregando...' : 'Clique para Loading'}
                </Button>
              </div>
            </div>

            {/* Com ícones */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Com Ícones
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" leftIcon={<Plus size={20} />}>
                  Criar novo
                </Button>
                <Button variant="success" rightIcon={<Check size={20} />}>
                  Confirmar
                </Button>
                <Button variant="danger" leftIcon={<Trash size={20} />}>
                  Excluir
                </Button>
              </div>
            </div>

            {/* Full Width */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Full Width
              </h3>
              <Button variant="primary" fullWidth>
                Botão 100% largura
              </Button>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: ICON BUTTONS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Icon Buttons (Circulares)
          </h2>

          <div className="space-y-6">
            {/* Variantes */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Variantes
              </h3>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Editar">
                  <IconButton variant="primary" icon={<Edit size={20} />} ariaLabel="Editar" />
                </Tooltip>
                <Tooltip content="Fechar">
                  <IconButton variant="secondary" icon={<X size={20} />} ariaLabel="Fechar" />
                </Tooltip>
                <Tooltip content="Adicionar">
                  <IconButton variant="ghost" icon={<Plus size={20} />} ariaLabel="Adicionar" />
                </Tooltip>
                <Tooltip content="Excluir">
                  <IconButton variant="danger" icon={<Trash size={20} />} ariaLabel="Excluir" />
                </Tooltip>
                <Tooltip content="Confirmar">
                  <IconButton variant="success" icon={<Check size={20} />} ariaLabel="Confirmar" />
                </Tooltip>
              </div>
            </div>

            {/* Tamanhos */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Tamanhos
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Tooltip content="Small (32px)">
                  <IconButton variant="primary" size="sm" icon={<Edit size={16} />} ariaLabel="Small" />
                </Tooltip>
                <Tooltip content="Medium (40px)">
                  <IconButton variant="primary" size="md" icon={<Edit size={20} />} ariaLabel="Medium" />
                </Tooltip>
                <Tooltip content="Large (48px)">
                  <IconButton variant="primary" size="lg" icon={<Edit size={20} />} ariaLabel="Large" />
                </Tooltip>
              </div>
            </div>

            {/* Estados */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Estados
              </h3>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Desabilitado">
                  <IconButton variant="primary" icon={<Edit size={20} />} disabled ariaLabel="Disabled" />
                </Tooltip>
                <Tooltip content="Loading">
                  <IconButton
                    variant="primary"
                    icon={<Check size={20} />}
                    loading={loadingButtons.icon1}
                    onClick={() => handleLoadingDemo('icon1')}
                    ariaLabel="Loading"
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: SPINNER
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Spinner (Circular - SVG)
          </h2>

          <div className="space-y-6">
            {/* Tamanhos */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Tamanhos (conforme protótipo)
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">SM (16px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="md" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">MD (24px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="lg" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">LG (40px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="xl" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">XL (64px)</span>
                </div>
              </div>
            </div>

            {/* Variantes de cor */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Variantes de Cor
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Spinner variant="primary" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">Primary</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner variant="success" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">Success</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner variant="danger" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">Danger</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner variant="warning" />
                  <span className="text-xs text-[var(--ds-color-text-secondary)]">Warning</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-[var(--ds-color-primary)] p-4 rounded-lg">
                  <Spinner variant="white" />
                  <span className="text-xs text-white">White</span>
                </div>
              </div>
            </div>

            {/* Track visível */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Com Track Visível (fundo cinza)
              </h3>
              <div className="flex items-center gap-4">
                <Spinner size="lg" />
                <span className="text-sm text-[var(--ds-color-text-secondary)]">
                  → Note o círculo de fundo (#27272A com opacity 20%)
                </span>
              </div>
            </div>

            {/* Centralizado */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Centralizado (center prop)
              </h3>
              <div className="h-32 bg-[var(--ds-color-surface)] rounded-lg">
                <Spinner center size="lg" label="Carregando dados..." />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: SPINNER DOTS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Spinner Dots (3 pontinhos)
          </h2>

          <div className="space-y-6">
            {/* Exemplo padrão */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Padrão
              </h3>
              <div className="flex items-center gap-4">
                <SpinnerDots />
                <span className="text-sm text-[var(--ds-color-text-secondary)]">
                  3 pontos pulsando em sequência
                </span>
              </div>
            </div>

            {/* Com texto ao lado */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Uso em Contexto
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[var(--ds-color-surface)] rounded-lg">
                  <SpinnerDots />
                  <span className="text-sm text-[var(--ds-color-text-secondary)]">
                    Buscando transações...
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[var(--ds-color-surface)] rounded-lg">
                  <SpinnerDots />
                  <span className="text-sm text-[var(--ds-color-text-secondary)]">
                    Gerando insights...
                  </span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[var(--ds-color-surface)] rounded-lg">
                  <SpinnerDots />
                  <span className="text-sm text-[var(--ds-color-text-secondary)]">
                    Sincronizando com Google Calendar...
                  </span>
                </div>
              </div>
            </div>

            {/* Centralizado */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Centralizado
              </h3>
              <div className="h-32 bg-[var(--ds-color-surface)] rounded-lg">
                <SpinnerDots center label="Carregando..." />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: SPINNER FULLSCREEN (DEMO BUTTON)
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Spinner Fullscreen (Overlay)
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Demonstração (clique para ativar)
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    // Simula loading fullscreen
                    const overlay = document.createElement('div')
                    overlay.id = 'demo-fullscreen-spinner'
                    document.body.appendChild(overlay)
                    
                    // Monta componente manualmente (demo purposes)
                    import('react-dom/client').then(({ createRoot }) => {
                      const root = createRoot(overlay)
                      root.render(<SpinnerFullscreen text="Carregando..." />)
                      
                      setTimeout(() => {
                        root.unmount()
                        overlay.remove()
                      }, 3000)
                    })
                  }}
                >
                  Exibir Fullscreen (3s)
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    const overlay = document.createElement('div')
                    overlay.id = 'demo-fullscreen-spinner-success'
                    document.body.appendChild(overlay)
                    
                    import('react-dom/client').then(({ createRoot }) => {
                      const root = createRoot(overlay)
                      root.render(<SpinnerFullscreen text="Salvando..." variant="success" />)
                      
                      setTimeout(() => {
                        root.unmount()
                        overlay.remove()
                      }, 2000)
                    })
                  }}
                >
                  Exibir Fullscreen Success
                </Button>
              </div>
            </div>

            {/* Preview estático */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Preview (não interativo)
              </h3>
              <div className="relative h-64 bg-[var(--ds-color-surface)] rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#09090B] bg-opacity-80">
                  <Spinner size="xl" variant="primary" />
                  <p className="mt-6 text-[var(--ds-color-placeholder)] text-base font-medium">
                    Carregando...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: TOAST NOTIFICATIONS
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Toast Notifications
          </h2>

          <div className="space-y-6">
            {/* Tipos */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                4 Tipos (clique para testar)
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="success"
                  onClick={() => toast.success('Transação salva com sucesso')}
                >
                  Toast Success
                </Button>
                <Button
                  variant="danger"
                  onClick={() => toast.error('Não foi possível salvar. Tente novamente.')}
                >
                  Toast Error
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast.warning('Seu orçamento de alimentação atingiu 80%')}
                  style={{ backgroundColor: '#F59E0B', color: 'white', borderColor: '#F59E0B' }}
                >
                  Toast Warning
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => toast.info('Sua meta foi atualizada automaticamente')}
                  style={{ backgroundColor: '#3B82F6', color: 'white', borderColor: '#3B82F6' }}
                >
                  Toast Info
                </Button>
              </div>
            </div>

            {/* Com títulos customizados */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Com Títulos Customizados
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="success"
                  onClick={() => toast.success('Seus dados foram sincronizados', 'Sincronização concluída')}
                >
                  Success + Título
                </Button>
                <Button
                  variant="danger"
                  onClick={() => toast.error('Verifique sua conexão com a internet', 'Falha na conexão')}
                >
                  Error + Título
                </Button>
              </div>
            </div>

            {/* Duração customizada */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Duração Customizada
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="ghost"
                  onClick={() => toast.info('Esta mensagem fica 2 segundos', null, 2000)}
                >
                  Toast 2s
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => toast.info('Esta mensagem fica 8 segundos', null, 8000)}
                >
                  Toast 8s
                </Button>
              </div>
            </div>

            {/* Empilhamento (máx. 3) */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Empilhamento (máx. 3 visíveis)
              </h3>
              <Button
                variant="primary"
                onClick={() => {
                  toast.success('Toast 1 - Primeira notificação')
                  setTimeout(() => toast.info('Toast 2 - Segunda notificação'), 200)
                  setTimeout(() => toast.warning('Toast 3 - Terceira notificação'), 400)
                  setTimeout(() => toast.error('Toast 4 - Quarta notificação (oculta até liberar espaço)'), 600)
                }}
              >
                Disparar 4 Toasts Sequenciais
              </Button>
              <p className="text-sm text-[var(--ds-color-text-secondary)] mt-2">
                → Note que apenas 3 toasts são visíveis por vez (canto superior direito)
              </p>
            </div>

            {/* Contextos reais */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Exemplos de Contextos Reais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--ds-color-surface)] rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-[var(--ds-color-text)]">Transações</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      fullWidth
                      variant="success"
                      onClick={() => toast.success('Transação de R$ 250,00 criada com sucesso')}
                    >
                      Criar Transação
                    </Button>
                    <Button
                      size="sm"
                      fullWidth
                      variant="danger"
                      onClick={() => toast.error('Saldo insuficiente para esta transação')}
                    >
                      Simular Erro
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-[var(--ds-color-surface)] rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-[var(--ds-color-text)]">Metas</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      fullWidth
                      variant="success"
                      onClick={() => toast.success('Meta "Viagem para Macaé" atualizada')}
                    >
                      Atualizar Meta
                    </Button>
                    <Button
                      size="sm"
                      fullWidth
                      variant="ghost"
                      onClick={() => toast.warning('Faltam apenas R$ 200,00 para atingir sua meta!')}
                    >
                      Alerta de Meta
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-[var(--ds-color-surface)] rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-[var(--ds-color-text)]">Sincronização</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      fullWidth
                      variant="ghost"
                      onClick={() => toast.info('Sincronizado com Google Calendar', 'Sincronização concluída')}
                    >
                      Sync Google Calendar
                    </Button>
                    <Button
                      size="sm"
                      fullWidth
                      variant="danger"
                      onClick={() => toast.error('Falha ao conectar com Google Calendar', 'Erro de sincronização')}
                    >
                      Simular Erro Sync
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-[var(--ds-color-surface)] rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm text-[var(--ds-color-text)]">Gamificação</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      fullWidth
                      variant="success"
                      onClick={() => toast.success('Você ganhou 50 XP!', '🏆 Conquista desbloqueada')}
                    >
                      Desbloquear Conquista
                    </Button>
                    <Button
                      size="sm"
                      fullWidth
                      variant="ghost"
                      onClick={() => toast.info('Você subiu para o nível 5!', '⬆️ Level Up')}
                    >
                      Level Up
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: ALERT
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Alert (Alerta Inline)
          </h2>

          <div className="space-y-6">
            {/* 4 Tipos */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                4 Tipos (Info, Success, Warning, Error)
              </h3>
              <div className="space-y-4">
                <Alert
                  type="info"
                  title="Informação"
                  message="Esta é uma mensagem informativa inline. Diferente do Toast, o Alert permanece no fluxo da página."
                />
                <Alert
                  type="success"
                  title="Sucesso"
                  message="Sua operação foi concluída com sucesso!"
                />
                <Alert
                  type="warning"
                  title="Atenção"
                  message="Seu orçamento de alimentação atingiu 80%. Revise seus gastos."
                />
                <Alert
                  type="error"
                  title="Erro"
                  message="Não foi possível salvar os dados. Verifique sua conexão e tente novamente."
                />
              </div>
            </div>

            {/* Sem título */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Sem Título (apenas mensagem)
              </h3>
              <div className="space-y-4">
                <Alert type="info" message="Mensagem simples sem título" />
                <Alert type="success" message="Transação criada com sucesso!" />
              </div>
            </div>

            {/* Dismissible (pode fechar) */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Dismissible (com botão X)
              </h3>
              <div className="space-y-4">
                <Alert
                  type="info"
                  message="Este alerta pode ser fechado pelo usuário"
                  dismissible
                  onDismiss={() => console.log('Alert fechado')}
                />
                <Alert
                  type="warning"
                  title="Lembrete"
                  message="Não esqueça de revisar suas metas mensais"
                  dismissible
                />
              </div>
            </div>

            {/* Casos de uso reais */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Exemplos de Contextos Reais
              </h3>
              <div className="space-y-4">
                <Alert
                  type="warning"
                  title="Meta próxima do prazo"
                  message='Sua meta "Viagem para Macaé" vence em 3 dias. Faltam R$ 200,00.'
                  dismissible
                />
                <Alert
                  type="info"
                  title="Sincronização pendente"
                  message="Há lembretes não sincronizados com Google Calendar. Conecte-se para sincronizar."
                />
                <Alert
                  type="success"
                  message="Você atingiu 100% da sua meta de economia mensal! 🎉"
                  dismissible
                />
                <Alert
                  type="error"
                  title="Falha na transação"
                  message="O valor inserido excede seu saldo disponível. Ajuste o valor ou selecione outra conta."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION: TOOLTIP
            ============================================================ */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[var(--ds-color-text)]">
            Tooltip
          </h2>

          <div className="space-y-6">
            {/* Posições */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Posições
              </h3>
              <div className="flex flex-wrap gap-8 items-center justify-center py-12">
                <Tooltip content="Tooltip no topo" position="top">
                  <Button variant="secondary">Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip embaixo" position="bottom">
                  <Button variant="secondary">Bottom</Button>
                </Tooltip>
                <Tooltip content="Tooltip à esquerda" position="left">
                  <Button variant="secondary">Left</Button>
                </Tooltip>
                <Tooltip content="Tooltip à direita" position="right">
                  <Button variant="secondary">Right</Button>
                </Tooltip>
              </div>
            </div>

            {/* Em IconButtons */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Tooltip em IconButtons
              </h3>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Editar item">
                  <IconButton variant="primary" icon={<Edit size={20} />} ariaLabel="Editar" />
                </Tooltip>
                <Tooltip content="Excluir permanentemente">
                  <IconButton variant="danger" icon={<Trash size={20} />} ariaLabel="Excluir" />
                </Tooltip>
                <Tooltip content="Adicionar novo">
                  <IconButton variant="success" icon={<Plus size={20} />} ariaLabel="Adicionar" />
                </Tooltip>
              </div>
            </div>

            {/* Tooltip desabilitado */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--ds-color-text-secondary)] uppercase mb-3">
                Tooltip Desabilitado
              </h3>
              <div className="flex flex-wrap gap-4">
                <Tooltip content="Este tooltip não aparece" disabled>
                  <Button variant="ghost">Passe o mouse (tooltip disabled)</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[var(--ds-color-border)]">
        <p className="text-center text-[var(--ds-color-text-secondary)] text-sm">
          ✨ Design System implementado com sucesso! • Foundation: Tokens, Hooks, Utils • Componentes: Button, IconButton, Spinner (circular + dots + fullscreen), Toast (4 tipos + stacking), Alert (4 tipos inline), Tooltip
        </p>
      </div>
    </div>
  )
}
