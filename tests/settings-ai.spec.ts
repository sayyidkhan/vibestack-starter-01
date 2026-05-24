import { expect, test } from '@playwright/test'

async function signup(page: import('@playwright/test').Page) {
  await page.goto('/signup')
  const email = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@vibestack.dev`
  await page.getByLabel('Name').fill('Playwright User')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('user12345')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

async function openSettingsWithRetry(page: import('@playwright/test').Page) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await page.goto('/settings')
    if (/\/settings$/.test(page.url())) return
    await page.waitForTimeout(400)
  }
  await expect(page).toHaveURL(/\/settings$/)
}

async function openProfileWithActivityRetry(page: import('@playwright/test').Page) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await page.goto('/profile')
    if ((await page.getByRole('heading', { name: 'Activity History' }).count()) > 0) return
    await page.waitForTimeout(400)
  }
  await expect(page.getByRole('heading', { name: 'Activity History' })).toBeVisible()
}

test('user can update settings and use AI assistant', async ({ page }) => {
  await signup(page)

  await openSettingsWithRetry(page)
  await page.getByLabel('Display Name').fill('Operator User')
  await page.getByRole('button', { name: 'Save settings' }).click()
  await expect(page.getByLabel('Display Name')).toHaveValue('Operator User')

  await page.goto('/ai/assistant')
  await page.getByRole('button', { name: 'Run Prompt' }).click()
  await expect(page.getByText(/\[openai:.*\].*prioritize leverage/i)).toBeVisible()

  await openProfileWithActivityRetry(page)
  await expect(page.getByText(/update_profile|ai_prompt/i).first()).toBeVisible()
})
