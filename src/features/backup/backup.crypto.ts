import { validateBackup } from './backup.service'
import {
  ENCRYPTED_BACKUP_FORMAT,
  ENCRYPTED_BACKUP_VERSION,
  type EncryptedLocalSatsBackup,
  type LocalSatsBackup,
} from './backup.types'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const iterations = 250_000

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function base64ToBytes(base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

async function deriveKey(password: string, salt: Uint8Array, iterationCount: number) {
  const baseKey = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: iterationCount, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export function validateEncryptedBackup(value: unknown): EncryptedLocalSatsBackup {
  if (!isRecord(value)) throw new Error('INVALID_ENCRYPTED_BACKUP')
  if (value.format !== ENCRYPTED_BACKUP_FORMAT) throw new Error('INVALID_ENCRYPTED_FORMAT')
  if (value.version !== ENCRYPTED_BACKUP_VERSION) throw new Error('UNSUPPORTED_ENCRYPTED_VERSION')
  if (typeof value.encryptedAt !== 'string') throw new Error('INVALID_ENCRYPTED_BACKUP')
  if (!isRecord(value.kdf)
    || value.kdf.name !== 'PBKDF2'
    || value.kdf.hash !== 'SHA-256'
    || typeof value.kdf.iterations !== 'number'
    || !Number.isFinite(value.kdf.iterations)
    || value.kdf.iterations <= 0
    || typeof value.kdf.salt !== 'string') throw new Error('INVALID_ENCRYPTED_BACKUP')
  if (!isRecord(value.cipher)
    || value.cipher.name !== 'AES-GCM'
    || typeof value.cipher.iv !== 'string') throw new Error('INVALID_ENCRYPTED_BACKUP')
  if (typeof value.payload !== 'string') throw new Error('INVALID_ENCRYPTED_BACKUP')

  return value as unknown as EncryptedLocalSatsBackup
}

export async function encryptBackup(backup: LocalSatsBackup, password: string): Promise<EncryptedLocalSatsBackup> {
  if (!password) throw new Error('PASSWORD_REQUIRED')
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt, iterations)
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv.buffer as ArrayBuffer }, key, encoder.encode(JSON.stringify(backup)))

  return {
    format: ENCRYPTED_BACKUP_FORMAT,
    version: ENCRYPTED_BACKUP_VERSION,
    encryptedAt: new Date().toISOString(),
    kdf: {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations,
      salt: bytesToBase64(salt),
    },
    cipher: {
      name: 'AES-GCM',
      iv: bytesToBase64(iv),
    },
    payload: bytesToBase64(new Uint8Array(encrypted)),
  }
}

export async function decryptBackup(encryptedBackup: EncryptedLocalSatsBackup, password: string): Promise<LocalSatsBackup> {
  if (!password) throw new Error('PASSWORD_REQUIRED')
  const encrypted = validateEncryptedBackup(encryptedBackup)
  const key = await deriveKey(password, base64ToBytes(encrypted.kdf.salt), encrypted.kdf.iterations)
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(encrypted.cipher.iv).buffer as ArrayBuffer },
    key,
    base64ToBytes(encrypted.payload),
  )
  return validateBackup(JSON.parse(decoder.decode(decrypted)) as unknown)
}
