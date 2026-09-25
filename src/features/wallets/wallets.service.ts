import { db } from '../../database/db'
import type { Wallet } from '../../types'

export type WalletInput = Pick<Wallet, 'name' | 'note' | 'address'>

export function listWallets() {
  return db.wallets.orderBy('createdAt').reverse().toArray()
}

export async function createWallet(input: WalletInput) {
  return db.wallets.add({
    ...input,
    createdAt: new Date().toISOString(),
  })
}

export async function updateWallet(id: number, input: WalletInput) {
  await db.wallets.update(id, input)
}

export async function deleteWallet(id: number) {
  await db.wallets.delete(id)
}
