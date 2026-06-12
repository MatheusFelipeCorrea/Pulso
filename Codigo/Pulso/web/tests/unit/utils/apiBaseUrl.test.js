import { afterEach, describe, expect, it } from 'vitest'

import { getApiBaseUrl } from '@/utils/apiBaseUrl.js'

const originalUrl = import.meta.env.VITE_API_URL
const originalProd = import.meta.env.PROD

describe('utils/apiBaseUrl', () => {
  afterEach(() => {
    import.meta.env.VITE_API_URL = originalUrl
    import.meta.env.PROD = originalProd
  })

  it('prioriza VITE_API_URL e remove barra final', () => {
    import.meta.env.VITE_API_URL = 'https://api.example.com/'
    import.meta.env.PROD = false

    expect(getApiBaseUrl()).toBe('https://api.example.com')
  })

  it('usa /api em produção quando variável não existe', () => {
    import.meta.env.VITE_API_URL = ''
    import.meta.env.PROD = true

    expect(getApiBaseUrl()).toBe('/api')
  })

  it('usa localhost no ambiente de desenvolvimento', () => {
    import.meta.env.VITE_API_URL = ''
    import.meta.env.PROD = false

    expect(getApiBaseUrl()).toBe('http://localhost:3333/api')
  })
})
