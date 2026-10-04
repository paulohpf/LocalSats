import { describe, expect, it } from 'vitest'
import { resources, type TranslationKey } from './resources'

const ptBr = resources['pt-BR'].translation
const en = resources.en.translation

describe('i18n resources', () => {
  it('keeps PT-BR and EN with the same translation keys', () => {
    expect(Object.keys(ptBr).sort()).toEqual(Object.keys(en).sort())
  })

  it('does not contain empty translation values', () => {
    for (const [language, resource] of Object.entries(resources)) {
      for (const [key, value] of Object.entries(resource.translation)) {
        expect(value.trim(), `${language}.${key}`).not.toBe('')
      }
    }
  })

  it('contains critical product, navigation, backup and validation keys', () => {
    const criticalKeys: TranslationKey[] = [
      'welcome',
      'localFirst',
      'dashboard',
      'purchases',
      'wallets',
      'backup',
      'exportBackup',
      'exportEncryptedBackup',
      'importBackup',
      'restoreBackup',
      'exportCsv',
      'backupInvalid',
      'backupRestoreConfirm',
      'priceUnavailable',
      'purchaseInvalid',
      'walletHasPurchases',
    ]

    for (const key of criticalKeys) {
      expect(ptBr[key]).toBeDefined()
      expect(en[key]).toBeDefined()
    }
  })
})
