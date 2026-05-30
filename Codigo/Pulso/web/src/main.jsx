import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import App from './App'
// Design System - Foundation (devem ser importados antes do globals.css)
import './design-system/styles/tokens.css'
import './design-system/styles/base.css'
import './design-system/styles/animations.css'
import './styles/globals.css'
import './styles/pulso-components.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
)