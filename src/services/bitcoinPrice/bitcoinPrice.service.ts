import { db } from '../../database/db'
import type { BitcoinPriceSnapshot, PriceCurrency } from './bitcoinPrice.types'
import { CoinGeckoProvider } from './coinGeckoProvider'

const provider = new CoinGeckoProvider()
const providerName = 'coingecko'
const cacheTtl = 5 * 60 * 1000
const minimumRequestInterval = 30 * 1000
const inFlight = new Map<PriceCurrency, Promise<{ snapshot: BitcoinPriceSnapshot; fromCache: boolean }>>()
const lastRequestAt = new Map<PriceCurrency, number>()

export async function getCachedPrice(currency: PriceCurrency) {
  return db.prices.get(`current-${currency}`)
}

export async function refreshBitcoinPrice(currency: PriceCurrency): Promise<BitcoinPriceSnapshot> {
  const price = await provider.getCurrentPrice(currency)
  const snapshot: BitcoinPriceSnapshot = {
    id: `current-${currency}`,
    price,
    currency,
    timestamp: new Date().toISOString(),
    provider: providerName,
  }
  await db.prices.put(snapshot)
  return snapshot
}

export async function getBitcoinPrice(currency: PriceCurrency, options: { force?: boolean } = {}) {
  const cached = await getCachedPrice(currency)
  const cacheIsFresh = cached && Date.now() - new Date(cached.timestamp).getTime() < cacheTtl
  const recentlyRequested = Date.now() - (lastRequestAt.get(currency) ?? 0) < minimumRequestInterval
  if (cached && (cacheIsFresh || (options.force && recentlyRequested))) return { snapshot: cached, fromCache: true }
  const existingRequest = inFlight.get(currency)
  if (existingRequest) return existingRequest

  const request = (async () => {
    lastRequestAt.set(currency, Date.now())
    try {
      return { snapshot: await refreshBitcoinPrice(currency), fromCache: false }
    } catch (error) {
      if (cached) return { snapshot: cached, fromCache: true }
      throw error
    } finally {
      inFlight.delete(currency)
    }
  })()
  inFlight.set(currency, request)
  return request
}
