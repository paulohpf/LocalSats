import { db } from '../../database/db'
import { getSettings } from '../../database/settings'
import type { Purchase, Settings, Wallet } from '../../types'
import { BACKUP_FORMAT, BACKUP_VERSION, type BackupSummary, type LocalSatsBackup } from './backup.types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isSettings(value: unknown): value is Settings {
  if (!isRecord(value)) return false
  return value.id === 'current'
    && (value.language === 'pt-BR' || value.language === 'en')
    && (value.currency === 'BRL' || value.currency === 'USD')
    && (value.theme === 'light' || value.theme === 'dark')
    && (value.btcDisplayUnit === 'BTC' || value.btcDisplayUnit === 'sats')
}

function isWallet(value: unknown): value is Wallet {
  if (!isRecord(value)) return false
  return (value.id === undefined || isNumber(value.id))
    && isString(value.name)
    && (value.note === undefined || isString(value.note))
    && (value.address === undefined || isString(value.address))
    && isString(value.createdAt)
}

function isPurchase(value: unknown): value is Purchase {
  if (!isRecord(value)) return false
  return (value.id === undefined || isNumber(value.id))
    && (value.type === 'buy' || value.type === 'sell')
    && isString(value.date)
    && isNumber(value.amount)
    && (value.currency === 'BRL' || value.currency === 'USD')
    && isNumber(value.bitcoinPrice)
    && isNumber(value.btcAmount)
    && (value.fee === undefined || isNumber(value.fee))
    && (value.walletId === undefined || isNumber(value.walletId))
    && (value.note === undefined || isString(value.note))
}

export async function createBackup(): Promise<LocalSatsBackup> {
  const [settings, wallets, purchases] = await Promise.all([
    getSettings(),
    db.wallets.toArray(),
    db.purchases.toArray(),
  ])

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
    wallets,
    purchases,
  }
}

export function csvCell(value: unknown): string {
  if (value === undefined || value === null) return ''
  const text = String(value)
  return `"${text.replaceAll('"', '""')}"`
}

export function purchasesToCsv(purchases: Purchase[], wallets: Wallet[]): string {
  const walletNameById = new Map(wallets.map((wallet) => [wallet.id, wallet.name]))
  const headers = ['type', 'date', 'amount', 'currency', 'bitcoinPrice', 'btcAmount', 'fee', 'walletName', 'walletId', 'note']
  const rows = purchases.map((purchase) => [
    purchase.type,
    purchase.date,
    purchase.amount,
    purchase.currency,
    purchase.bitcoinPrice,
    purchase.btcAmount,
    purchase.fee ?? '',
    purchase.walletId ? walletNameById.get(purchase.walletId) ?? '' : '',
    purchase.walletId ?? '',
    purchase.note ?? '',
  ])
  return [headers, ...rows].map((row) => row.map(csvCell).join(';')).join('\n')
}

export async function createPurchasesCsv(): Promise<string> {
  const [wallets, purchases] = await Promise.all([
    db.wallets.toArray(),
    db.purchases.orderBy('date').toArray(),
  ])
  return purchasesToCsv(purchases, wallets)
}

export function validateBackup(value: unknown): LocalSatsBackup {
  if (!isRecord(value)) throw new Error('INVALID_BACKUP')
  if (value.format !== BACKUP_FORMAT) throw new Error('INVALID_FORMAT')
  if (value.version !== BACKUP_VERSION) throw new Error('UNSUPPORTED_VERSION')
  if (!isString(value.exportedAt)) throw new Error('INVALID_BACKUP')
  if (!isSettings(value.settings)) throw new Error('INVALID_BACKUP')
  if (!Array.isArray(value.wallets) || !value.wallets.every(isWallet)) throw new Error('INVALID_BACKUP')
  if (!Array.isArray(value.purchases) || !value.purchases.every(isPurchase)) throw new Error('INVALID_BACKUP')

  return value as unknown as LocalSatsBackup
}

export function summarizeBackup(backup: LocalSatsBackup): BackupSummary {
  return {
    exportedAt: backup.exportedAt,
    version: backup.version,
    walletsCount: backup.wallets.length,
    purchasesCount: backup.purchases.length,
  }
}

export async function restoreBackup(backup: LocalSatsBackup) {
  await db.transaction('rw', db.wallets, db.purchases, db.settings, async () => {
    await Promise.all([
      db.wallets.clear(),
      db.purchases.clear(),
      db.settings.clear(),
    ])
    await db.settings.put(backup.settings)
    if (backup.wallets.length > 0) await db.wallets.bulkPut(backup.wallets)
    if (backup.purchases.length > 0) await db.purchases.bulkPut(backup.purchases)
  })
}

export function backupFileName(date = new Date()) {
  return `localsats-backup-${date.toISOString().slice(0, 10)}.json`
}

export function csvFileName(date = new Date()) {
  return `localsats-movements-${date.toISOString().slice(0, 10)}.csv`
}
