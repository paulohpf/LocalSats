import { db } from '../../database/db'
import { calculateBtc } from '../../utils/calculations'
import type { Purchase } from '../../types'

export type PurchaseInput = Pick<Purchase, 'date' | 'amount' | 'currency' | 'bitcoinPrice' | 'fee' | 'walletId' | 'note'>

export function listPurchases() {
  return db.purchases.orderBy('date').reverse().toArray()
}

export async function createPurchase(input: PurchaseInput) {
  return db.purchases.add({ ...input, btcAmount: calculateBtc(input.amount, input.bitcoinPrice) })
}

export async function updatePurchase(id: number, input: PurchaseInput) {
  await db.purchases.update(id, { ...input, btcAmount: calculateBtc(input.amount, input.bitcoinPrice) })
}

export async function deletePurchase(id: number) {
  await db.purchases.delete(id)
}

export function purchasesForWallet(walletId: number) {
  return db.purchases.where('walletId').equals(walletId).count()
}
