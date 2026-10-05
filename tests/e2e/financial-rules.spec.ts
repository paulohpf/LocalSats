import { expect, test, type Page } from '@playwright/test'

async function openNewPurchase(page: Page) {
  await page.getByRole('link', { name: /Purchases/i }).click()
  await page.route('https://api.coingecko.com/api/v3/simple/price**', (route) => route.abort())
  await page.getByRole('button', { name: /New purchase/i }).click()
  return page.getByRole('dialog', { name: /New purchase/i })
}

async function createBuy(page: Page) {
  const dialog = await openNewPurchase(page)
  await dialog.getByLabel('Date').fill('2026-03-10')
  await dialog.getByLabel('Invested amount').fill('100')
  await dialog.getByLabel('Bitcoin price').fill('100000')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('BRL 100.00')).toBeVisible()
  await expect(page.getByText('0.00100000')).toBeVisible()
}

async function fillSaleAboveBalance(page: Page) {
  await page.getByRole('button', { name: /New purchase/i }).click()
  await page.getByRole('dialog', { name: /New purchase/i }).getByRole('button', { name: 'Sell' }).click()
  const dialog = page.getByRole('dialog', { name: /New sale/i })
  await dialog.getByLabel('Date').fill('2026-03-20')
  await dialog.getByLabel('BTC sold').fill('0.002')
  await dialog.getByLabel('Bitcoin price').fill('120000')
  return dialog
}

test.describe('LocalSats financial rules', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('rejects invalid buy and sell forms', async ({ page }) => {
    const buyDialog = await openNewPurchase(page)
    await buyDialog.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Enter a valid date, amount, and Bitcoin price.')).toBeVisible()
    await buyDialog.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByText('No purchases registered yet.')).toBeVisible()

    await page.getByRole('button', { name: /New purchase/i }).click()
    const purchaseDialog = page.getByRole('dialog', { name: /New purchase/i })
    await purchaseDialog.getByRole('button', { name: 'Sell' }).click()
    const sellDialog = page.getByRole('dialog', { name: /New sale/i })
    await sellDialog.getByLabel('Date').fill('2026-03-20')
    await sellDialog.getByLabel('Bitcoin price').fill('120000')
    await sellDialog.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Enter a valid date, amount, and Bitcoin price.')).toBeVisible()
    await sellDialog.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByText('No purchases registered yet.')).toBeVisible()
  })

  test('does not create sale above balance when confirmation is cancelled', async ({ page }) => {
    await createBuy(page)
    const dialog = await fillSaleAboveBalance(page)

    page.once('dialog', async (nativeDialog) => {
      expect(nativeDialog.type()).toBe('confirm')
      expect(nativeDialog.message()).toBe('This sale is larger than the recorded balance. Continue?')
      await nativeDialog.dismiss()
    })
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByText('BRL 240.00')).not.toBeVisible()
    await expect(page.getByText('0.00200000')).not.toBeVisible()
    await expect(page.getByText('BRL 100.00')).toBeVisible()
    await expect(page.getByText('0.00100000')).toBeVisible()
  })

  test('creates sale above balance when confirmation is accepted', async ({ page }) => {
    await createBuy(page)
    const dialog = await fillSaleAboveBalance(page)

    page.once('dialog', async (nativeDialog) => {
      expect(nativeDialog.type()).toBe('confirm')
      expect(nativeDialog.message()).toBe('This sale is larger than the recorded balance. Continue?')
      await nativeDialog.accept()
    })
    await dialog.getByRole('button', { name: 'Save' }).click()

    await expect(dialog).not.toBeVisible()
    await expect(page.getByText('BRL 240.00').first()).toBeVisible()
    await expect(page.locator('strong').filter({ hasText: '0.00200000' })).toBeVisible()

    await page.getByRole('link', { name: /Dashboard/i }).click()
    await expect(page.locator('strong').filter({ hasText: /-R\$\s*140,00/ })).toBeVisible()
    await expect(page.locator('strong').filter({ hasText: '-0.00100000 BTC' })).toBeVisible()
  })
})
