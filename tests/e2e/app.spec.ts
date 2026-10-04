import { expect, test } from '@playwright/test'

test.describe('LocalSats core flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('starts in English and navigates through main areas', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Bitcoin. Your data.' })).toBeVisible()

    await page.getByRole('link', { name: /Purchases/i }).click()
    await expect(page.getByRole('heading', { name: 'Purchases' })).toBeVisible()

    await page.getByRole('link', { name: /Wallets/i }).click()
    await expect(page.getByRole('heading', { name: 'Wallets' })).toBeVisible()

    await page.getByRole('link', { name: /Backup/i }).click()
    await expect(page.getByRole('heading', { name: 'Backup', exact: true })).toBeVisible()
  })

  test('toggles language and theme', async ({ page }) => {
    await page.getByRole('button', { name: 'Alterar idioma' }).click()
    await expect(page.getByRole('heading', { name: 'Seu Bitcoin. Seus dados.' })).toBeVisible()

    await page.getByRole('button', { name: 'Alterar tema' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  test('validates encrypted backup password rules', async ({ page }) => {
    await page.getByRole('link', { name: /Backup/i }).click()
    await page.getByRole('button', { name: 'Export encrypted' }).click()

    const dialog = page.getByRole('dialog', { name: 'Encrypted backup' })
    await expect(dialog).toBeVisible()

    await dialog.getByLabel('Password', { exact: true }).fill('short')
    await dialog.getByLabel('Confirm password').fill('short')
    await dialog.getByRole('button', { name: 'Export encrypted' }).click()
    await expect(page.getByText('Password must have at least 8 characters.')).toBeVisible()

    await dialog.getByLabel('Password', { exact: true }).fill('long-password')
    await dialog.getByLabel('Confirm password').fill('different-password')
    await dialog.getByRole('button', { name: 'Export encrypted' }).click()
    await expect(page.getByText('Passwords do not match.')).toBeVisible()
  })
})
