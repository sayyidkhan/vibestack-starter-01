import { expect, test } from '@playwright/test'

async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@vibestack.dev')
  await page.getByLabel('Password').fill('admin12345')
  await page.getByRole('main').getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

async function waitForRouteAvailability(
  page: import('@playwright/test').Page,
  path: '/items' | '/admin/content',
  readyCheck: () => Promise<void>,
) {
  for (let attempt = 0; attempt < 16; attempt += 1) {
    await page.goto(path)
    try {
      await readyCheck()
      return
    } catch {
      await page.waitForTimeout(300)
    }
  }
  throw new Error(`Route ${path} stayed unavailable`)
}

test.describe.serial('admin and crud action confirmations', () => {
  test('admin can toggle a user role and restore original state', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/users')

    const userRow = page.locator('tbody tr', { hasText: 'user@vibestack.dev' })
    await expect(userRow).toBeVisible()

    const roleCell = userRow.locator('td').nth(2)
    const initialRole = (await roleCell.textContent())?.trim() || 'user'

    try {
      await userRow.getByRole('button', { name: /Make (Admin|User)/ }).click()
      const expectedRole = initialRole === 'admin' ? 'user' : 'admin'
      await expect(roleCell).toHaveText(expectedRole)
    } finally {
      const currentRole = (await roleCell.textContent())?.trim() || ''
      if (currentRole !== initialRole) {
        await userRow.getByRole('button', { name: /Make (Admin|User)/ }).click()
        await expect(roleCell).toHaveText(initialRole)
      }
    }
  })

  test('crud and admin content actions require confirmation and complete successfully', async ({ page }) => {
    await loginAsAdmin(page)
    const itemTitle = `confirm-item-${Date.now()}`

    await waitForRouteAvailability(page, '/items', async () => {
      await expect(page.getByRole('heading', { name: 'Example CRUD Items' })).toBeVisible()
    })
    await page.getByPlaceholder('New item title').fill(itemTitle)
    await page.getByRole('main').getByRole('button', { name: 'Create', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Item created' }).first()).toBeVisible()

    const itemRow = page.locator(`li.item-row:has(input[value="${itemTitle}"])`)
    await expect(itemRow).toBeVisible()

    await itemRow.getByRole('button', { name: 'Delete' }).click()
    const deleteDialog = page.getByRole('dialog', { name: 'Delete item' })
    await expect(deleteDialog).toBeVisible()
    await deleteDialog.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByRole('button', { name: 'Item deleted' })).toBeVisible()
    await expect(page.locator(`li.item-row:has(input[value="${itemTitle}"])`)).toHaveCount(0)

    await page.getByPlaceholder('New item title').fill(itemTitle)
    await page.getByRole('main').getByRole('button', { name: 'Create', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Item created' }).first()).toBeVisible()

    await waitForRouteAvailability(page, '/admin/content', async () => {
      await expect(page.getByRole('heading', { name: 'Manage Example Content' })).toBeVisible()
    })
    const contentRow = page.locator('tbody tr', { hasText: itemTitle })
    await expect(contentRow).toBeVisible()
    await contentRow.getByRole('button', { name: 'Publish' }).click()
    const publishDialog = page.getByRole('dialog', { name: 'Change content visibility' })
    await expect(publishDialog).toBeVisible()
    await publishDialog.getByRole('button', { name: 'Apply' }).click()
    await expect(contentRow.getByText('published', { exact: true })).toBeVisible()
  })
})
