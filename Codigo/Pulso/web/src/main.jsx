import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import App from './App'
import { AppErrorBoundary } from './components/AppErrorBoundary.jsx'
import { ThemeProvider } from './components/ThemeProvider.jsx'
// Design System - Foundation (devem ser importados antes do globals.css)
import './design-system/styles/tokens.css'
import './design-system/styles/base.css'
import './design-system/styles/components.css'
import './design-system/styles/animations.css'
import './styles/globals.css'
import './styles/auth.css'
import './styles/legal.css'
import './styles/pulso-components.css'
import './styles/sidebar.css'
import './styles/transactions.css'
import './styles/transport.css'
import './styles/landing.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppErrorBoundary>
            <Provider store={store}>
                <BrowserRouter>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </BrowserRouter>
            </Provider>
        </AppErrorBoundary>
    </StrictMode>
)