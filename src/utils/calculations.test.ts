import { describe, expect, it } from 'vitest'
import type { Purchase } from '../types'
import {
  accumulationHistory,
  averagePrice,
  calculateBtc,
  currentValue,
  investmentHistory,
  profit,
  profitPercentage,
  totalBTC,
  totalInvested,
  totalSats,
  totalSold,
} from './calculations'

const purchases: Purchase[] = [
  { id: 1, type: 'buy', date: '2026-01-10', amount: 1000, currency: 'BRL', bitcoinPrice: 100000, btcAmount: 0.01, fee: 10, walletId: 1, note: 'first buy' },
  { id: 2, type: 'buy', date: '2026-01-20', amount: 2000, currency: 'BRL', bitcoinPrice: 200000, btcAmount: 0.01, walletId: 1 },
  { id: 3, type: 'sell', date: '2026-02-01', amount: 750, currency: 'BRL', bitcoinPrice: 150000, btcAmount: 0.005, walletId: 1 },
  { id: 4, type: 'buy', date: '2026-02-10', amount: 100, currency: 'USD', bitcoinPrice: 50000, btcAmount: 0.002 },
]

describe('financial calculations', () => {
  it('calculates BTC from fiat amount and bitcoin price', () => {
    expect(calculateBtc(1000, 100000)).toBe(0.01)
    expect(calculateBtc(0, 100000)).toBe(0)
    expect(calculateBtc(1000, 0)).toBe(0)
  })

  it('calculates net invested, BTC balance, sold total and sats', () => {
    expect(totalInvested(purchases, 'BRL')).toBe(2250)
    expect(totalBTC(purchases, 'BRL')).toBe(0.015)
    expect(totalSold(purchases, 'BRL')).toBe(750)
    expect(totalSats(purchases, 'BRL')).toBe(1_500_000)
  })

  it('calculates average price using buys only', () => {
    expect(averagePrice(purchases, 'BRL')).toBe(150000)
    expect(averagePrice([], 'BRL')).toBe(0)
  })

  it('calculates current value, profit and profit percentage', () => {
    expect(currentValue(purchases, 200000, 'BRL')).toBe(3000)
    expect(profit(purchases, 200000, 'BRL')).toBe(750)
    expect(profitPercentage(purchases, 200000, 'BRL')).toBeCloseTo(33.333333, 5)
    expect(profitPercentage([], 200000, 'BRL')).toBe(0)
  })

  it('filters calculations by currency', () => {
    expect(totalInvested(purchases, 'USD')).toBe(100)
    expect(totalBTC(purchases, 'USD')).toBe(0.002)
    expect(averagePrice(purchases, 'USD')).toBe(50000)
  })

  it('creates ordered investment and accumulation histories including sales', () => {
    expect(investmentHistory([...purchases].reverse(), 'BRL')).toEqual([
      { label: '2026-01-10', value: 1000 },
      { label: '2026-01-20', value: 3000 },
      { label: '2026-02-01', value: 2250 },
    ])
    expect(accumulationHistory([...purchases].reverse(), 'BRL')).toEqual([
      { label: '2026-01-10', value: 0.01 },
      { label: '2026-01-20', value: 0.02 },
      { label: '2026-02-01', value: 0.015 },
    ])
  })
})
