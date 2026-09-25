import type { BitcoinPriceProvider, PriceCurrency } from './bitcoinPrice.types'

const API_URL = 'https://api.coingecko.com/api/v3/simple/price'
const apiKey = import.meta.env.VITE_COINGECKO_API_KEY as string | undefined

export class CoinGeckoProvider implements BitcoinPriceProvider {
  async getCurrentPrice(currency: PriceCurrency) {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10_000)
    try {
      const response = await fetch(`${API_URL}?ids=bitcoin&vs_currencies=${currency.toLowerCase()}`, {
        headers: apiKey ? { 'x-cg-demo-api-key': apiKey } : undefined,
        signal: controller.signal,
      })
      if (!response.ok) throw new Error(`CoinGecko request failed: ${response.status}`)
      const data = await response.json() as { bitcoin?: Record<string, unknown> }
      const price = data.bitcoin?.[currency.toLowerCase()]
      if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) throw new Error('Invalid CoinGecko response')
      return price
    } finally {
      window.clearTimeout(timeout)
    }
  }
}
