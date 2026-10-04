import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'

async function createWallet(page: Page, name = 'Cold Wallet') {
  await page.getByRole('link', { name: /Wallets/i }).click()
  await page.getByRole('button', { name: /New wallet/i }).click()
  const dialog = page.getByRole('dialog', { name: /New wallet/i })
  await dialog.getByLabel('Name').fill(name)
  await dialog.getByLabel('Note').fill('E2E wallet')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('heading', { name })).toBeVisible()
}

async function openNewPurchase(page: Page) {
  await page.getByRole('link', { name: /Purchases/i }).click()
  await page.route('https://api.coingecko.com/api/v3/simple/price**', (route) => route.abort())
  await page.getByRole('button', { name: /New purchase/i }).click()
  return page.getByRole('dialog', { name: /New purchase/i })
}

async function createBuy(page: Page) {
  const dialog = await openNewPurchase(page)
  await dialog.getByLabel('Date').fill('2026-01-10')
  await dialog.getByLabel('Invested amount').fill('1000')
  await dialog.getByLabel('Bitcoin price').fill('100000')
  await dialog.getByLabel('Fee').fill('10')
  await dialog.getByLabel('Wallet').selectOption({ label: 'Cold Wallet' })
  await dialog.getByLabel('Note').fill('E2E buy')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('BRL 1000.00')).toBeVisible()
  await expect(page.getByText('0.01000000')).toBeVisible()
}

async function createSell(page: Page) {
  await page.getByRole('button', { name: /New purchase/i }).click()
  await page.getByRole('dialog', { name: /New purchase/i }).getByRole('button', { name: 'Sell' }).click()
  const dialog = page.getByRole('dialog', { name: /New sale/i })
  await dialog.getByLabel('Date').fill('2026-01-20')
  await dialog.getByLabel('BTC sold').fill('0.002')
  await dialog.getByLabel('Bitcoin price').fill('120000')
  await dialog.getByLabel('Wallet').selectOption({ label: 'Cold Wallet' })
  await dialog.getByLabel('Note').fill('E2E sell')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('BRL 240.00').first()).toBeVisible()
  await expect(page.locator('strong').filter({ hasText: '0.00200000' })).toBeVisible()
}

function backupFixture() {
  return {
    format: 'localsats-backup',
    version: 1,
    exportedAt: '2026-01-30T00:00:00.000Z',
    settings: {
      id: 'current',
      language: 'en',
      currency: 'BRL',
      theme: 'dark',
      btcDisplayUnit: 'BTC',
    },
    wallets: [
      {
        id: 1,
        name: 'Restored Wallet',
        note: 'Restored by Playwright',
        address: '',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    purchases: [
      {
        id: 1,
        type: 'buy',
        date: '2026-01-15',
        amount: 500,
        currency: 'BRL',
        bitcoinPrice: 100000,
        btcAmount: 0.005,
        fee: 0,
        walletId: 1,
        note: 'Restored buy',
      },
    ],
  }
}

test.describe('LocalSats data flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('creates wallet, buy and sell movements', async ({ page }) => {
    await createWallet(page)
    await createBuy(page)
    await createSell(page)

    await page.getByRole('link', { name: /Dashboard/i }).click()
    await expect(page.locator('strong').filter({ hasText: /760,00/ })).toBeVisible()
    await expect(page.locator('strong').filter({ hasText: '0.00800000 BTC' })).toBeVisible()
  })

  test('exports JSON backup and CSV after creating data', async ({ page }) => {
    await createWallet(page)
    await createBuy(page)

    await page.getByRole('link', { name: /Backup/i }).click()
    const backupDownload = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download JSON backup' }).click()
    const backup = await backupDownload
    expect(backup.suggestedFilename()).toMatch(/^localsats-backup-.*\.json$/)
    const backupPath = await backup.path()
    expect(backupPath).toBeTruthy()
    const backupContent = JSON.parse(await readFile(backupPath!, 'utf8')) as { format: string; wallets: Array<{ name: string }>; purchases: Array<{ note?: string }> }
    expect(backupContent.format).toBe('localsats-backup')
    expect(backupContent.wallets).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'Cold Wallet' })]))
    expect(backupContent.purchases).toEqual(expect.arrayContaining([expect.objectContaining({ note: 'E2E buy' })]))

    const csvDownload = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download CSV' }).click()
    const csv = await csvDownload
    expect(csv.suggestedFilename()).toMatch(/^localsats-movements-.*\.csv$/)
    const csvPath = await csv.path()
    expect(csvPath).toBeTruthy()
    const csvContent = await readFile(csvPath!, 'utf8')
    expect(csvContent).toContain('"type";"date";"amount";"currency";"bitcoinPrice";"btcAmount";"fee";"walletName";"walletId";"note"')
    expect(csvContent).toContain('"buy";"2026-01-10";"1000";"BRL";"100000";"0.01";"10";"Cold Wallet";"1";"E2E buy"')
  })

  test('persists wallet and purchase data after reload', async ({ page }) => {
    await createWallet(page)
    await createBuy(page)

    await page.reload()
    await page.getByRole('link', { name: /Wallets/i }).click()
    await expect(page.getByRole('heading', { name: 'Cold Wallet' })).toBeVisible()

    await page.getByRole('link', { name: /Purchases/i }).click()
    await expect(page.getByText('BRL 1000.00')).toBeVisible()
    await expect(page.getByText('0.01000000')).toBeVisible()
    await expect(page.getByText('Cold Wallet')).toBeVisible()
  })

  test('imports JSON backup and restores data', async ({ page }) => {
    await createWallet(page, 'Wallet before restore')

    await page.getByRole('link', { name: /Backup/i }).click()
    await page.locator('input[type="file"]').setInputFiles({
      name: 'localsats-backup-restore.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(backupFixture()), 'utf8'),
    })

    await expect(page.getByRole('heading', { name: 'Backup ready to restore' })).toBeVisible()
    await expect(page.getByText('1').nth(1)).toBeVisible()

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm')
      await dialog.accept()
    })
    await page.getByRole('button', { name: 'Restore backup' }).click()
    await expect(page.getByText('Backup restored successfully.')).toBeVisible()

    await page.getByRole('link', { name: /Wallets/i }).click()
    await expect(page.getByRole('heading', { name: 'Restored Wallet' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Wallet before restore' })).not.toBeVisible()

    await page.getByRole('link', { name: /Purchases/i }).click()
    await expect(page.getByText('BRL 500.00')).toBeVisible()
    await expect(page.getByText('0.00500000')).toBeVisible()
    await expect(page.getByText('Restored Wallet')).toBeVisible()
  })
})
