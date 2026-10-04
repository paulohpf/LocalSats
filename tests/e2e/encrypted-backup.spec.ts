import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'

async function createWallet(page: Page, name: string) {
  await page.getByRole('link', { name: /Wallets/i }).click()
  await page.getByRole('button', { name: /New wallet/i }).click()
  const dialog = page.getByRole('dialog', { name: /New wallet/i })
  await dialog.getByLabel('Name').fill(name)
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('heading', { name })).toBeVisible()
}

async function createBuy(page: Page, walletName: string) {
  await page.getByRole('link', { name: /Purchases/i }).click()
  await page.route('https://api.coingecko.com/api/v3/simple/price**', (route) => route.abort())
  await page.getByRole('button', { name: /New purchase/i }).click()
  const dialog = page.getByRole('dialog', { name: /New purchase/i })
  await dialog.getByLabel('Date').fill('2026-02-10')
  await dialog.getByLabel('Invested amount').fill('700')
  await dialog.getByLabel('Bitcoin price').fill('100000')
  await dialog.getByLabel('Wallet').selectOption({ label: walletName })
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('BRL 700.00')).toBeVisible()
  await expect(page.getByText('0.00700000')).toBeVisible()
}

test.describe('LocalSats encrypted backup flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('exports encrypted backup, rejects wrong password, and restores with correct password', async ({ page }) => {
    const password = 'correct-password'

    await createWallet(page, 'Encrypted Wallet')
    await createBuy(page, 'Encrypted Wallet')

    await page.getByRole('link', { name: /Backup/i }).click()
    const encryptedDownload = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Export encrypted' }).click()

    const exportDialog = page.getByRole('dialog', { name: 'Encrypted backup' })
    await exportDialog.getByLabel('Password', { exact: true }).fill(password)
    await exportDialog.getByLabel('Confirm password').fill(password)
    await exportDialog.getByRole('button', { name: 'Export encrypted' }).click()

    const encryptedBackup = await encryptedDownload
    expect(encryptedBackup.suggestedFilename()).toMatch(/^localsats-encrypted-backup-.*\.json$/)
    const encryptedPath = await encryptedBackup.path()
    expect(encryptedPath).toBeTruthy()
    const encryptedContent = await readFile(encryptedPath!, 'utf8')
    const encryptedJson = JSON.parse(encryptedContent) as {
      format: string
      version: number
      encryptedAt: string
      kdf: { name: string; hash: string; iterations: number; salt: string }
      cipher: { name: string; iv: string }
      payload: string
    }

    expect(encryptedJson).toEqual(expect.objectContaining({
      format: 'localsats-encrypted-backup',
      version: 1,
      encryptedAt: expect.any(String),
      payload: expect.any(String),
    }))
    expect(encryptedJson.kdf).toEqual(expect.objectContaining({
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: 250000,
      salt: expect.any(String),
    }))
    expect(encryptedJson.cipher).toEqual(expect.objectContaining({
      name: 'AES-GCM',
      iv: expect.any(String),
    }))

    await createWallet(page, 'Temporary Wallet')

    await page.getByRole('link', { name: /Backup/i }).click()
    await page.locator('input[type="file"]').setInputFiles({
      name: encryptedBackup.suggestedFilename(),
      mimeType: 'application/json',
      buffer: Buffer.from(encryptedContent, 'utf8'),
    })

    const importDialog = page.getByRole('dialog', { name: 'Unlock encrypted backup' })
    await expect(importDialog).toBeVisible()
    await importDialog.getByLabel('Password', { exact: true }).fill('wrong-password')
    await importDialog.getByRole('button', { name: 'Unlock backup' }).click()
    await expect(page.getByText('Wrong password or invalid encrypted backup.')).toBeVisible()

    await importDialog.getByLabel('Password', { exact: true }).fill(password)
    await importDialog.getByRole('button', { name: 'Unlock backup' }).click()
    await expect(page.getByText('Backup decrypted. Review the summary before restoring.')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Backup ready to restore' })).toBeVisible()

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm')
      await dialog.accept()
    })
    await page.getByRole('button', { name: 'Restore backup' }).click()
    await expect(page.getByText('Backup restored successfully.')).toBeVisible()

    await page.getByRole('link', { name: /Wallets/i }).click()
    await expect(page.getByRole('heading', { name: 'Encrypted Wallet' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Temporary Wallet' })).not.toBeVisible()

    await page.getByRole('link', { name: /Purchases/i }).click()
    await expect(page.getByText('BRL 700.00')).toBeVisible()
    await expect(page.getByText('0.00700000')).toBeVisible()
    await expect(page.getByText('Encrypted Wallet')).toBeVisible()
  })
})
