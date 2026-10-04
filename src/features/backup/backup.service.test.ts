import { describe, expect, it } from 'vitest'
import type { Purchase, Wallet } from '../../types'
import { BACKUP_FORMAT, BACKUP_VERSION, type LocalSatsBackup } from './backup.types'
import { csvCell, purchasesToCsv, summarizeBackup, validateBackup } from './backup.service'

const wallets: Wallet[] = [
  { id: 1, name: 'Cold Wallet', note: 'Main', address: 'bc1...', createdAt: '2026-01-01T00:00:00.000Z' },
]

const purchases: Purchase[] = [
  { id: 1, type: 'buy', date: '2026-01-10', amount: 1000, currency: 'BRL', bitcoinPrice: 100000, btcAmount: 0.01, fee: 10, walletId: 1, note: 'Compra "DCA"; semanal' },
  { id: 2, type: 'sell', date: '2026-02-01', amount: 750, currency: 'BRL', bitcoinPrice: 150000, btcAmount: 0.005, note: 'Venda\nparcial' },
]

const validBackup: LocalSatsBackup = {
  format: BACKUP_FORMAT,
  version: BACKUP_VERSION,
  exportedAt: '2026-10-03T12:00:00.000Z',
  settings: { id: 'current', language: 'pt-BR', currency: 'BRL', theme: 'dark', btcDisplayUnit: 'BTC' },
  wallets,
  purchases,
}

describe('backup validation and summary', () => {
  it('accepts a valid backup', () => {
    expect(validateBackup(validBackup)).toBe(validBackup)
  })

  it('rejects invalid format, unsupported version and missing fields', () => {
    expect(() => validateBackup({ ...validBackup, format: 'other' })).toThrow('INVALID_FORMAT')
    expect(() => validateBackup({ ...validBackup, version: 2 })).toThrow('UNSUPPORTED_VERSION')
    expect(() => validateBackup({ ...validBackup, purchases: [{ type: 'buy' }] })).toThrow('INVALID_BACKUP')
  })

  it('summarizes backup metadata', () => {
    expect(summarizeBackup(validBackup)).toEqual({
      exportedAt: '2026-10-03T12:00:00.000Z',
      version: 1,
      walletsCount: 1,
      purchasesCount: 2,
    })
  })
})

describe('CSV export', () => {
  it('escapes CSV cells', () => {
    expect(csvCell('Compra "DCA"; semanal')).toBe('"Compra ""DCA""; semanal"')
    expect(csvCell(undefined)).toBe('')
  })

  it('exports purchases and sales with wallet names', () => {
    expect(purchasesToCsv(purchases, wallets)).toBe([
      '"type";"date";"amount";"currency";"bitcoinPrice";"btcAmount";"fee";"walletName";"walletId";"note"',
      '"buy";"2026-01-10";"1000";"BRL";"100000";"0.01";"10";"Cold Wallet";"1";"Compra ""DCA""; semanal"',
      '"sell";"2026-02-01";"750";"BRL";"150000";"0.005";"";"";"";"Venda\nparcial"',
    ].join('\n'))
  })
})
