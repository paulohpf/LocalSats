import type { Purchase, Settings, Wallet } from '../../types'

export const BACKUP_FORMAT = 'localsats-backup'
export const BACKUP_VERSION = 1
export const ENCRYPTED_BACKUP_FORMAT = 'localsats-encrypted-backup'
export const ENCRYPTED_BACKUP_VERSION = 1

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

export interface EncryptedLocalSatsBackup {
  format: typeof ENCRYPTED_BACKUP_FORMAT
  version: typeof ENCRYPTED_BACKUP_VERSION
  encryptedAt: string
  kdf: {
    name: 'PBKDF2'
    hash: 'SHA-256'
    iterations: number
    salt: string
  }
  cipher: {
    name: 'AES-GCM'
    iv: string
  }
  payload: string
}
