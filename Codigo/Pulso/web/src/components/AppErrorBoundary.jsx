import { Component } from 'react'

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('AppErrorBoundary:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            background: '#fafafa',
            color: '#18181b',
          }}
        >
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Algo deu errado</h1>
            <p style={{ color: '#71717a', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {this.state.error?.message || 'Erro ao carregar a página.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                background: '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Recarregar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
