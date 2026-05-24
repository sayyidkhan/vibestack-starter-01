import { expect, test } from '@playwright/test'

test('user can signup and access dashboard', async ({ page }) => {
  await page.goto('/signup')
  const email = `user_${Date.now()}@vibestack.dev`

  await page.getByLabel('Name').fill('Playwright User')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('user12345')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByText('Operator Cockpit')).toBeVisible()
  await expect(page.getByRole('button', { name: /quick actions/i })).toBeVisible()

  await page.keyboard.press('ControlOrMeta+K')
  const quickSearch = page.getByPlaceholder('Search actions or routes...')
  await expect(quickSearch).toBeVisible()
  await quickSearch.fill('notes')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/notes/)
})
