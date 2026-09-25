import type { Purchase } from '../types'

export function purchasesInCurrency(purchases: Purchase[], currency: Purchase['currency']) {
  return purchases.filter((purchase) => purchase.currency === currency)
}

export function calculateBtc(amount: number, bitcoinPrice: number) {
  if (amount <= 0 || bitcoinPrice <= 0) return 0
  return amount / bitcoinPrice
}

export function totalInvested(purchases: Purchase[], currency?: Purchase['currency']) {
  const source = currency ? purchasesInCurrency(purchases, currency) : purchases
  return source.reduce((total, purchase) => total + purchase.amount, 0)
}

export function totalBTC(purchases: Purchase[], currency?: Purchase['currency']) {
  const source = currency ? purchasesInCurrency(purchases, currency) : purchases
  return source.reduce((total, purchase) => total + purchase.btcAmount, 0)
}

export function totalSats(purchases: Purchase[], currency?: Purchase['currency']) {
  return Math.round(totalBTC(purchases, currency) * 100_000_000)
}

export function averagePrice(purchases: Purchase[], currency?: Purchase['currency']) {
  const btc = totalBTC(purchases, currency)
  return btc === 0 ? 0 : totalInvested(purchases, currency) / btc
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
    accumulated += purchase.amount
    return { label: purchase.date, value: accumulated }
  })
}

export function accumulationHistory(purchases: Purchase[], currency?: Purchase['currency']): HistoryPoint[] {
  let accumulated = 0
  const source = currency ? purchasesInCurrency(purchases, currency) : purchases
  return [...source].sort((a, b) => a.date.localeCompare(b.date)).map((purchase) => {
    accumulated += purchase.btcAmount
    return { label: purchase.date, value: accumulated }
  })
}
