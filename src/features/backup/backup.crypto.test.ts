import { describe, expect, it } from 'vitest'
import { BACKUP_FORMAT, BACKUP_VERSION, ENCRYPTED_BACKUP_FORMAT, type LocalSatsBackup } from './backup.types'
import { decryptBackup, encryptBackup, validateEncryptedBackup } from './backup.crypto'
import { validateBackup } from './backup.service'

const backup: LocalSatsBackup = {
  format: BACKUP_FORMAT,
  version: BACKUP_VERSION,
  exportedAt: '2026-10-03T12:00:00.000Z',
  settings: { id: 'current', language: 'pt-BR', currency: 'BRL', theme: 'dark', btcDisplayUnit: 'BTC' },
  wallets: [{ id: 1, name: 'Cold Wallet', createdAt: '2026-01-01T00:00:00.000Z' }],
  purchases: [{ id: 1, type: 'buy', date: '2026-01-10', amount: 1000, currency: 'BRL', bitcoinPrice: 100000, btcAmount: 0.01, walletId: 1, note: 'private note' }],
}

describe('encrypted backup crypto', () => {
  it('encrypts and decrypts a valid backup', async () => {
    const encrypted = await encryptBackup(backup, 'correct horse battery staple')
    const decrypted = await decryptBackup(encrypted, 'correct horse battery staple')

    expect(encrypted.format).toBe(ENCRYPTED_BACKUP_FORMAT)
    expect(encrypted.payload).not.toContain('Cold Wallet')
    expect(decrypted).toEqual(backup)
    expect(validateBackup(decrypted)).toEqual(backup)
  })

  it('fails with the wrong password', async () => {
    const encrypted = await encryptBackup(backup, 'right password')

    await expect(decryptBackup(encrypted, 'wrong password')).rejects.toThrow()
  })

  it('fails when payload is invalid', async () => {
    const encrypted = await encryptBackup(backup, 'password')

    await expect(decryptBackup({ ...encrypted, payload: 'invalid' }, 'password')).rejects.toThrow()
  })

  it('validates encrypted backup format and version', async () => {
    const encrypted = await encryptBackup(backup, 'password')

    expect(validateEncryptedBackup(encrypted)).toEqual(encrypted)
    expect(() => validateEncryptedBackup({ ...encrypted, format: 'other' })).toThrow('INVALID_ENCRYPTED_FORMAT')
    expect(() => validateEncryptedBackup({ ...encrypted, version: 2 })).toThrow('UNSUPPORTED_ENCRYPTED_VERSION')
    expect(() => validateEncryptedBackup({ ...encrypted, kdf: { ...encrypted.kdf, salt: 123 } })).toThrow('INVALID_ENCRYPTED_BACKUP')
  })

  it('uses different salt, iv and payload for each encryption', async () => {
    const first = await encryptBackup(backup, 'password')
    const second = await encryptBackup(backup, 'password')

    expect(first.kdf.salt).not.toBe(second.kdf.salt)
    expect(first.cipher.iv).not.toBe(second.cipher.iv)
    expect(first.payload).not.toBe(second.payload)
  })

  it('requires a password', async () => {
    await expect(encryptBackup(backup, '')).rejects.toThrow('PASSWORD_REQUIRED')
    await expect(decryptBackup(await encryptBackup(backup, 'password'), '')).rejects.toThrow('PASSWORD_REQUIRED')
  })
})
