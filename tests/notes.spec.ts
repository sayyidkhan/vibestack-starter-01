import { expect, test } from '@playwright/test'

async function signup(page: import('@playwright/test').Page) {
  await page.goto('/signup')
  const email = `notes_${Date.now()}_${Math.floor(Math.random() * 10000)}@vibestack.dev`
  await page.getByLabel('Name').fill('Notes User')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('user12345')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
}

test('user can create, pin, and delete notes', async ({ page }) => {
  await signup(page)

  await page.goto('/notes')
  await expect(page.getByRole('heading', { name: 'Notes Workspace' })).toBeVisible()

  const title = `Playbook Note ${Date.now()}`
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Body').fill('This note validates end-to-end saved notes behavior.')
  await page.getByRole('button', { name: 'Add Note' }).click()

  await expect(page.getByRole('button', { name: 'Note created' })).toBeVisible()
  await expect(page.locator(`input[value="${title}"]`)).toBeVisible()

  await page.getByRole('button', { name: 'Pin' }).first().click()
  await expect(page.getByRole('button', { name: 'Note pinned' })).toBeVisible()

  await page.getByRole('button', { name: 'Delete' }).first().click()
  await page.getByRole('dialog', { name: 'Delete note' }).getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByRole('button', { name: 'Note deleted' })).toBeVisible()
  await expect(page.locator(`input[value="${title}"]`)).toHaveCount(0)
})
