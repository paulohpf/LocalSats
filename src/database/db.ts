import Dexie, { type Table } from 'dexie'
import type { Purchase, Settings, Wallet } from '../types'

export class LocalSatsDatabase extends Dexie {
  wallets!: Table<Wallet, number>
  purchases!: Table<Purchase, number>
  settings!: Table<Settings, string>

  constructor() {
    super('localsats')
    this.version(1).stores({
      wallets: '++id, name, createdAt',
      purchases: '++id, date, walletId',
      settings: 'id',
    })
  }
}

export const db = new LocalSatsDatabase()
