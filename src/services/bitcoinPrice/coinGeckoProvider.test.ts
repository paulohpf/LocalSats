import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CoinGeckoProvider } from './coinGeckoProvider'

describe('CoinGeckoProvider', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches the bitcoin price for the requested currency', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ bitcoin: { brl: 350000 } }) })
    vi.stubGlobal('fetch', fetchMock)

    await expect(new CoinGeckoProvider().getCurrentPrice('BRL')).resolves.toBe(350000)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('throws when the HTTP response is not successful', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429, json: async () => ({}) }))

    await expect(new CoinGeckoProvider().getCurrentPrice('USD')).rejects.toThrow('CoinGecko request failed: 429')
  })

  it('throws when the response payload is invalid', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ bitcoin: { usd: 0 } }) }))

    await expect(new CoinGeckoProvider().getCurrentPrice('USD')).rejects.toThrow('Invalid CoinGecko response')
  })
})
