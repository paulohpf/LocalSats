import { db } from '../../database/db'
import { calculateBtc } from '../../utils/calculations'
import type { Purchase } from '../../types'

export type PurchaseInput = Pick<Purchase, 'type' | 'date' | 'amount' | 'currency' | 'bitcoinPrice' | 'btcAmount' | 'fee' | 'walletId' | 'note'>

export function listPurchases() {
  return db.purchases.orderBy('date').reverse().toArray()
}

export async function createPurchase(input: PurchaseInput) {
  return db.purchases.add({ ...input, amount: input.type === 'buy' ? input.amount : input.btcAmount * input.bitcoinPrice, btcAmount: input.type === 'buy' ? calculateBtc(input.amount, input.bitcoinPrice) : input.btcAmount })
}

export async function updatePurchase(id: number, input: PurchaseInput) {
  await db.purchases.update(id, { ...input, amount: input.type === 'buy' ? input.amount : input.btcAmount * input.bitcoinPrice, btcAmount: input.type === 'buy' ? calculateBtc(input.amount, input.bitcoinPrice) : input.btcAmount })
}

export async function deletePurchase(id: number) {
  await db.purchases.delete(id)
}

export function purchasesForWallet(walletId: number) {
  return db.purchases.where('walletId').equals(walletId).count()
}
