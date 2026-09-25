import type { Purchase } from '../types'

export function purchasesInCurrency(purchases: Purchase[], currency: Purchase['currency']) {
  return purchases.filter((purchase) => purchase.currency === currency)
}

function isSale(purchase: Purchase) {
  return purchase.type === 'sell'
}

export function purchasesOfType(purchases: Purchase[], type: Purchase['type']) {
  return purchases.filter((purchase) => (purchase.type ?? 'buy') === type)
}

export function calculateBtc(amount: number, bitcoinPrice: number) {
  if (amount <= 0 || bitcoinPrice <= 0) return 0
  return amount / bitcoinPrice
}

export function totalInvested(purchases: Purchase[], currency?: Purchase['currency']) {
  const source = currency ? purchasesInCurrency(purchases, currency) : purchases
  return source.reduce((total, purchase) => total + (isSale(purchase) ? -purchase.amount : purchase.amount), 0)
}

export function totalBTC(purchases: Purchase[], currency?: Purchase['currency']) {
  const source = currency ? purchasesInCurrency(purchases, currency) : purchases
  return source.reduce((total, purchase) => total + (isSale(purchase) ? -purchase.btcAmount : purchase.btcAmount), 0)
}

export function totalSold(purchases: Purchase[], currency?: Purchase['currency']) {
  const source = currency ? purchasesInCurrency(purchases, currency) : purchases
  return source.reduce((total, purchase) => total + (isSale(purchase) ? purchase.amount : 0), 0)
}

export function totalSats(purchases: Purchase[], currency?: Purchase['currency']) {
  return Math.round(totalBTC(purchases, currency) * 100_000_000)
}

export function averagePrice(purchases: Purchase[], currency?: Purchase['currency']) {
  const buys = purchasesOfType(currency ? purchasesInCurrency(purchases, currency) : purchases, 'buy')
  const btc = buys.reduce((total, purchase) => total + purchase.btcAmount, 0)
  const invested = buys.reduce((total, purchase) => total + purchase.amount, 0)
  return btc === 0 ? 0 : invested / btc
}

export function currentValue(purchases: Purchase[], currentPrice: number, currency?: Purchase['currency']) {
  return totalBTC(purchases, currency) * currentPrice
}

export function profit(purchases: Purchase[], currentPrice: number, currency?: Purchase['currency']) {
  return currentValue(purchases, currentPrice, currency) - totalInvested(purchases, currency)
}

export function profitPercentage(purchases: Purchase[], currentPrice: number, currency?: Purchase['currency']) {
  const invested = totalInvested(purchases, currency)
  return invested === 0 ? 0 : (profit(purchases, currentPrice, currency) / invested) * 100
}

export interface HistoryPoint {
  label: string
  value: number
}

export function investmentHistory(purchases: Purchase[], currency?: Purchase['currency']): HistoryPoint[] {
  let accumulated = 0
  const source = currency ? purchasesInCurrency(purchases, currency) : purchases
  return [...source].sort((a, b) => a.date.localeCompare(b.date)).map((purchase) => {
    accumulated += isSale(purchase) ? -purchase.amount : purchase.amount
    return { label: purchase.date, value: accumulated }
  })
}

export function accumulationHistory(purchases: Purchase[], currency?: Purchase['currency']): HistoryPoint[] {
  let accumulated = 0
  const source = currency ? purchasesInCurrency(purchases, currency) : purchases
  return [...source].sort((a, b) => a.date.localeCompare(b.date)).map((purchase) => {
    accumulated += isSale(purchase) ? -purchase.btcAmount : purchase.btcAmount
    return { label: purchase.date, value: accumulated }
  })
}
