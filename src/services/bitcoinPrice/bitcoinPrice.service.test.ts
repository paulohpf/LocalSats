import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../database/db'
import type { PriceCurrency } from './bitcoinPrice.types'

const getCurrentPriceMock = vi.hoisted(() => vi.fn<(currency: PriceCurrency) => Promise<number>>())

vi.mock('./coinGeckoProvider', () => ({
  CoinGeckoProvider: class {
    getCurrentPrice = getCurrentPriceMock
  },
}))

async function clearPrices() {
  await db.prices.clear()
}

beforeEach(async () => {
  getCurrentPriceMock.mockReset()
  await clearPrices()
})

describe('bitcoin price service', () => {
  it('refreshes and stores the current price', async () => {
    getCurrentPriceMock.mockResolvedValue(350000)
    const { getCachedPrice, refreshBitcoinPrice } = await import('./bitcoinPrice.service')

    const snapshot = await refreshBitcoinPrice('BRL')

    expect(snapshot).toMatchObject({ id: 'current-BRL', price: 350000, currency: 'BRL', provider: 'coingecko' })
    expect(new Date(snapshot.timestamp).toString()).not.toBe('Invalid Date')
    await expect(getCachedPrice('BRL')).resolves.toEqual(snapshot)
  })

  it('returns a fresh cached price without calling the provider', async () => {
    const { getBitcoinPrice } = await import('./bitcoinPrice.service')
    const timestamp = new Date().toISOString()
    await db.prices.put({ id: 'current-USD', price: 65000, currency: 'USD', timestamp, provider: 'coingecko' })

    await expect(getBitcoinPrice('USD')).resolves.toEqual({
      snapshot: { id: 'current-USD', price: 65000, currency: 'USD', timestamp, provider: 'coingecko' },
      fromCache: true,
    })
    expect(getCurrentPriceMock).not.toHaveBeenCalled()
  })

  it('falls back to stale cached price when provider fails', async () => {
    const { getBitcoinPrice } = await import('./bitcoinPrice.service')
    await db.prices.put({ id: 'current-BRL', price: 340000, currency: 'BRL', timestamp: '2026-10-03T11:00:00.000Z', provider: 'coingecko' })
    getCurrentPriceMock.mockRejectedValue(new Error('network error'))

    await expect(getBitcoinPrice('BRL')).resolves.toEqual({
      snapshot: { id: 'current-BRL', price: 340000, currency: 'BRL', timestamp: '2026-10-03T11:00:00.000Z', provider: 'coingecko' },
      fromCache: true,
    })
  })

  it('deduplicates simultaneous requests for the same currency', async () => {
    const { getBitcoinPrice } = await import('./bitcoinPrice.service')
    let resolvePrice: (price: number) => void = () => undefined
    getCurrentPriceMock.mockReturnValue(new Promise((resolve) => { resolvePrice = resolve }))

    const first = getBitcoinPrice('USD', { force: true })
    const second = getBitcoinPrice('USD', { force: true })
    resolvePrice(64000)

    const results = await Promise.all([first, second])
    expect(results[0]).toMatchObject({ snapshot: { id: 'current-USD', price: 64000, currency: 'USD', provider: 'coingecko' }, fromCache: false })
    expect(results[1]).toEqual(results[0])
    expect(getCurrentPriceMock).toHaveBeenCalledTimes(1)
  })
})
