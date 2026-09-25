import Dexie, { type Table } from 'dexie'
import type { Purchase, Settings, Wallet } from '../types'
import type { BitcoinPriceSnapshot } from '../services/bitcoinPrice/bitcoinPrice.types'

export class LocalSatsDatabase extends Dexie {
  wallets!: Table<Wallet, number>
  purchases!: Table<Purchase, number>
  settings!: Table<Settings, string>
  prices!: Table<BitcoinPriceSnapshot, string>

  constructor() {
    super('localsats')
    this.version(1).stores({
      wallets: '++id, name, createdAt',
      purchases: '++id, date, walletId',
      settings: 'id',
    })
    this.version(2).stores({
      wallets: '++id, name, createdAt',
      purchases: '++id, date, walletId',
      settings: 'id',
      prices: 'id, currency, timestamp',
    })
    this.version(3).stores({
      wallets: '++id, name, createdAt',
      purchases: '++id, date, walletId',
      settings: 'id',
      prices: 'id, currency, timestamp',
    }).upgrade((transaction) => transaction.table('purchases').toCollection().modify((purchase) => {
      purchase.type = purchase.type ?? 'buy'
    }))
  }
}

export const db = new LocalSatsDatabase()
