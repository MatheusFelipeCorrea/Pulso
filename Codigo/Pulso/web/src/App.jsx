import { Routes, Route, Link } from 'react-router-dom'
import { ToastProvider } from './design-system/components/feedback/index.js'
import DesignSystemDemo from './pages/DesignSystemDemo'

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary-500 mb-2">
                  💜 Pulso
                </h1>
                <p className="text-gray-500">
                  O pulso da sua vida financeira
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  Front rodando com sucesso!
                </p>
                <Link 
                  to="/design-system" 
                  className="inline-block mt-6 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  🎨 Ver Design System
                </Link>
              </div>
            </div>
          } />
          <Route path="/design-system" element={<DesignSystemDemo />} />
        </Routes>
      </div>
    </ToastProvider>
  )
}

export default App