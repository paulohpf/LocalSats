export type PriceCurrency = 'BRL' | 'USD'

export interface BitcoinPriceSnapshot {
  id: string
  price: number
  currency: PriceCurrency
  timestamp: string
  provider: string
}

export interface BitcoinPriceProvider {
  getCurrentPrice(currency: PriceCurrency): Promise<number>
}
