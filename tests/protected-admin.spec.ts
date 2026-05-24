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

test('redirects anonymous user from protected page to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
})

test('non-admin user is redirected away from admin routes', async ({ page }) => {
  await signup(page)
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/dashboard/)
})
