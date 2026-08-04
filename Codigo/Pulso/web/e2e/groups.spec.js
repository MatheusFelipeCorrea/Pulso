import { test, expect } from '@playwright/test'

const DEMO_EMAIL = process.env.E2E_EMAIL || 'demo.clt@pulso.app'
const DEMO_PASSWORD = process.env.E2E_PASSWORD || 'Pulso@123'

async function login(page) {
  await page.goto('/login')
  await page.getByLabel(/e-mail|email|identificador/i).fill(DEMO_EMAIL)
  await page.getByLabel(/^senha$/i).fill(DEMO_PASSWORD)
  await page.getByRole('button', { name: /entrar/i }).click()
  await page.waitForURL(/\/(transactions|dashboard|budget)/, { timeout: 20_000 })
}

test.describe('Grupos', () => {
  test('redireciona visitante não autenticado', async ({ page }) => {
    await page.goto('/groups')
    await expect(page).toHaveURL(/\/login/)
  })

  test('modal criar grupo exibe seletor de foto', async ({ page }) => {
    test.skip(!process.env.E2E_API_READY, 'Defina E2E_API_READY=1 com API + seed rodando')

    await login(page)
    await page.goto('/groups')
    await page.getByRole('button', { name: /criar grupo/i }).click()

    await expect(page.getByRole('heading', { name: /criar novo grupo/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /escolher da galeria/i })).toBeVisible()
    await expect(page.getByText(/jpg, png ou webp/i)).toBeVisible()
  })

  test('detalhe do grupo — admin vê alterar foto', async ({ page }) => {
    test.skip(!process.env.E2E_API_READY, 'Defina E2E_API_READY=1 com API + seed rodando')

    await login(page)
    await page.goto('/groups')

    const primeiroGrupo = page.locator('.group-card').first()
    if ((await primeiroGrupo.count()) === 0) {
      await page.getByRole('button', { name: /criar grupo/i }).click()
      await page.getByLabel(/nome do grupo/i).fill(`E2E Grupo ${Date.now()}`)
      await page.getByRole('button', { name: /^criar grupo$/i }).click()
      await page.waitForTimeout(1500)
      await page.goto('/groups')
    }

    await page.locator('.group-card').first().click()
    await expect(page.getByRole('button', { name: /alterar foto/i })).toBeVisible()
  })
})
