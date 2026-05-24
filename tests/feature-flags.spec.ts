import { expect, test } from '@playwright/test'

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@vibestack.dev')
  await page.getByLabel('Password').fill('admin12345')
  await page.getByRole('main').getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

async function withFlagDisabled(
  page: import('@playwright/test').Page,
  flag: 'AUDIT_LOGS' | 'USER_SETTINGS' | 'EXAMPLE_CRUD',
  run: () => Promise<void>,
) {
  await page.goto('/admin/settings')
  const toggle = page.getByLabel(flag)
  await expect(toggle).toBeVisible()
  const initial = await toggle.isChecked()

  try {
    if (initial) {
      await toggle.click()
      await expect(page.getByRole('button', { name: `Updated ${flag}` })).toBeVisible()
    }
    await run()
  } finally {
    await page.goto('/admin/settings')
    const current = await page.getByLabel(flag).isChecked()
    if (current !== initial) {
      await page.getByLabel(flag).click()
      await expect(page.getByRole('button', { name: `Updated ${flag}` })).toBeVisible()
    }
  }
}

test.describe.serial('feature-flag runtime gates', () => {
  test('disabling AUDIT_LOGS flag gates admin audit route', async ({ page }) => {
    await loginAsAdmin(page)
    await withFlagDisabled(page, 'AUDIT_LOGS', async () => {
      await page.goto('/admin/audit-logs')
      await expect(page).toHaveURL(/\/dashboard/)
    })
  })

  test('disabling USER_SETTINGS flag gates settings route', async ({ page }) => {
    await loginAsAdmin(page)
    await withFlagDisabled(page, 'USER_SETTINGS', async () => {
      await page.goto('/settings')
      await expect(page).toHaveURL(/\/dashboard/)
    })
  })

  test('disabling EXAMPLE_CRUD flag gates items route and nav visibility', async ({ page }) => {
    await loginAsAdmin(page)
    await withFlagDisabled(page, 'EXAMPLE_CRUD', async () => {
      await page.goto('/items')
      await expect(page).toHaveURL(/\/dashboard/)
      await expect(page.getByRole('link', { name: 'Items' })).toHaveCount(0)
    })
  })
})
