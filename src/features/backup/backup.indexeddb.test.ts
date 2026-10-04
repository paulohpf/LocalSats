import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../database/db'
import { createBackup, createPurchasesCsv, restoreBackup } from './backup.service'
import { BACKUP_FORMAT, BACKUP_VERSION, type LocalSatsBackup } from './backup.types'

const backup: LocalSatsBackup = {
  format: BACKUP_FORMAT,
  version: BACKUP_VERSION,
  exportedAt: '2026-10-03T12:00:00.000Z',
  settings: { id: 'current', language: 'en', currency: 'USD', theme: 'light', btcDisplayUnit: 'sats' },
  wallets: [
    { id: 10, name: 'Cold Wallet', createdAt: '2026-01-01T00:00:00.000Z' },
  ],
  purchases: [
    { id: 20, type: 'buy', date: '2026-01-10', amount: 1000, currency: 'USD', bitcoinPrice: 50000, btcAmount: 0.02, walletId: 10, note: 'restored buy' },
    { id: 21, type: 'sell', date: '2026-02-10', amount: 300, currency: 'USD', bitcoinPrice: 60000, btcAmount: 0.005, walletId: 10 },
  ],
}

beforeEach(async () => {
  await db.transaction('rw', db.wallets, db.purchases, db.settings, db.prices, async () => {
    await Promise.all([
      db.wallets.clear(),
      db.purchases.clear(),
      db.settings.clear(),
      db.prices.clear(),
    ])
  })
})

describe('backup service with IndexedDB', () => {
  it('creates a backup from local database data', async () => {
    await db.settings.put({ id: 'current', language: 'pt-BR', currency: 'BRL', theme: 'dark', btcDisplayUnit: 'BTC' })
    await db.wallets.add({ id: 1, name: 'Sparrow', createdAt: '2026-01-01T00:00:00.000Z' })
    await db.purchases.add({ id: 2, type: 'buy', date: '2026-01-02', amount: 500, currency: 'BRL', bitcoinPrice: 100000, btcAmount: 0.005, walletId: 1 })

    const created = await createBackup()

    expect(created.format).toBe(BACKUP_FORMAT)
    expect(created.version).toBe(BACKUP_VERSION)
    expect(created.settings.currency).toBe('BRL')
    expect(created.wallets).toEqual([{ id: 1, name: 'Sparrow', createdAt: '2026-01-01T00:00:00.000Z' }])
    expect(created.purchases).toEqual([{ id: 2, type: 'buy', date: '2026-01-02', amount: 500, currency: 'BRL', bitcoinPrice: 100000, btcAmount: 0.005, walletId: 1 }])
  })

  it('restores backup data replacing current wallets, purchases and settings', async () => {
    await db.settings.put({ id: 'current', language: 'pt-BR', currency: 'BRL', theme: 'dark', btcDisplayUnit: 'BTC' })
    await db.wallets.add({ id: 1, name: 'Old Wallet', createdAt: '2026-01-01T00:00:00.000Z' })
    await db.purchases.add({ id: 2, type: 'buy', date: '2026-01-02', amount: 500, currency: 'BRL', bitcoinPrice: 100000, btcAmount: 0.005, walletId: 1 })

    await restoreBackup(backup)

    expect(await db.settings.get('current')).toEqual(backup.settings)
    expect(await db.wallets.toArray()).toEqual(backup.wallets)
    expect(await db.purchases.orderBy('id').toArray()).toEqual(backup.purchases)
  })

  it('creates CSV from local database data', async () => {
    await restoreBackup(backup)

    expect(await createPurchasesCsv()).toBe([
      '"type";"date";"amount";"currency";"bitcoinPrice";"btcAmount";"fee";"walletName";"walletId";"note"',
      '"buy";"2026-01-10";"1000";"USD";"50000";"0.02";"";"Cold Wallet";"10";"restored buy"',
      '"sell";"2026-02-10";"300";"USD";"60000";"0.005";"";"Cold Wallet";"10";""',
    ].join('\n'))
  })
})
