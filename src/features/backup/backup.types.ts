import type { Purchase, Settings, Wallet } from '../../types'

export const BACKUP_FORMAT = 'localsats-backup'
export const BACKUP_VERSION = 1

export interface LocalSatsBackup {
  format: typeof BACKUP_FORMAT
  version: typeof BACKUP_VERSION
  exportedAt: string
  settings: Settings
  wallets: Wallet[]
  purchases: Purchase[]
}

export interface BackupSummary {
  exportedAt: string
  version: number
  walletsCount: number
  purchasesCount: number
}
