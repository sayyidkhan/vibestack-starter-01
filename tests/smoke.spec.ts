import { expect, test } from '@playwright/test'

test('landing page renders and primary CTA is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /build faster, operate smarter/i })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Start Building' })).toBeVisible()
})

test('unknown route renders not found page', async ({ page }) => {
  await page.goto('/definitely-not-a-real-route')
  await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Back to Home' })).toBeVisible()
})

test('theme toggle persists selected theme', async ({ page }) => {
  await page.goto('/')
  const themeToggle = page.locator('.theme-toggle')
  await expect(themeToggle).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'forest')

  await themeToggle.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
})
