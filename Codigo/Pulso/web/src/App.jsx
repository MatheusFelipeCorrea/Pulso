import { Routes, Route } from 'react-router-dom'

function App() {
  return (
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
              </div>
            </div>
          } />
        </Routes>
      </div>
  )
}

export default App