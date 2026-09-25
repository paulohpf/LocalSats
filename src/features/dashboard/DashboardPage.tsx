import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '../../components/ui/EmptyState'
import { db } from '../../database/db'
import { accumulationHistory, averagePrice, currentValue, investmentHistory, profit, profitPercentage, purchasesInCurrency, totalBTC, totalInvested, totalSats, totalSold } from '../../utils/calculations'
import type { Purchase } from '../../types'
import { getBitcoinPrice } from '../../services/bitcoinPrice/bitcoinPrice.service'
import { updateSettings } from '../../database/settings'

function formatMoney(value: number, currency: Purchase['currency']) {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', { style: 'currency', currency }).format(value)
}

function Stat({ label, value, detail, accent = false }: { label: string; value: string; detail?: string; accent?: boolean }) {
  return <article className="stat-card"><span className="muted">{label}</span><strong className={accent ? 'accent' : ''}>{value}</strong>{detail && <small className="muted">{detail}</small>}</article>
}

function HistoryChart({ title, points, color, formatter }: { title: string; points: { label: string; value: number }[]; color: string; formatter: (value: number) => string }) {
  const width = 620
  const height = 190
  const max = Math.max(...points.map((point) => point.value), 1)
  const coordinates = points.map((point, index) => `${points.length === 1 ? width / 2 : (index / (points.length - 1)) * width},${height - (point.value / max) * (height - 24) - 12}`).join(' ')
  return <section className="panel chart-panel"><div className="panel-heading"><h2>{title}</h2>{points.length > 0 && <span className="muted">{formatter(points[points.length - 1].value)}</span>}</div>{points.length < 2 ? <div className="chart-empty"><span className="muted">Mais dados aparecerão após novas compras.</span></div> : <div className="chart-wrap"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} preserveAspectRatio="none"><polyline points={coordinates} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />{points.map((point, index) => { const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width; const y = height - (point.value / max) * (height - 24) - 12; return <circle key={`${point.label}-${index}`} cx={x} cy={y} r="4" fill={color} /> })}</svg></div>}</section>
}

export function DashboardPage() {
  const { t } = useTranslation()
  const purchases = useLiveQuery(() => db.purchases.toArray(), [])
  const wallets = useLiveQuery(() => db.wallets.toArray(), []) ?? []
  const settings = useLiveQuery(() => db.settings.get('current'), [])
  const currency = settings?.currency ?? 'BRL'
  const price = useLiveQuery(() => db.prices.get(`current-${currency}`), [currency])
  const [refreshing, setRefreshing] = useState(false)
  const [priceError, setPriceError] = useState(false)
  const [fromCache, setFromCache] = useState(false)
  const allPurchases = purchases ?? []
  const filtered = purchasesInCurrency(allPurchases, currency)
  const invested = totalInvested(allPurchases, currency)
  const sold = totalSold(allPurchases, currency)
  const btc = totalBTC(allPurchases, currency)
  const sats = totalSats(allPurchases, currency)
  const average = averagePrice(allPurchases, currency)
  const mixedCurrencies = new Set(allPurchases.map((purchase) => purchase.currency)).size > 1
  const money = (value: number) => formatMoney(value, currency)

  async function refreshPrice() {
    setRefreshing(true)
    setPriceError(false)
    try {
      const result = await getBitcoinPrice(currency)
      setFromCache(result.fromCache)
    } catch { setPriceError(true) } finally { setRefreshing(false) }
  }
  const current = price ? currentValue(filtered, price.price) : 0
  const result = price ? profit(filtered, price.price) : 0
  const resultPercentage = price ? profitPercentage(filtered, price.price) : 0

  if (purchases === undefined) return <main className="content"><section className="panel empty"><span className="muted">{t('loading')}</span></section></main>
  if (allPurchases.length === 0) return <main className="content"><div className="page-heading"><div><p className="eyebrow">{t('overview')}</p><h1>{t('welcome')}</h1></div><Link className="primary link-button" to="/purchases">+ {t('newPurchase')}</Link></div><section className="panel"><EmptyState message={t('noPurchases')} detail={t('noPurchasesDetail')} /></section></main>

  const displayUnit = settings?.btcDisplayUnit ?? 'BTC'
  async function toggleBtcUnit() { await updateSettings({ btcDisplayUnit: displayUnit === 'BTC' ? 'sats' : 'BTC' }) }
  return <main className="content"><div className="page-heading"><div><p className="eyebrow">{t('overview')}</p><h1>{t('welcome')}</h1><p className="muted">{t('welcomeText')}</p></div><Link className="primary link-button" to="/purchases">+ {t('newPurchase')}</Link></div>{mixedCurrencies && <div className="notice">{t('mixedCurrencies')} <strong>{currency}</strong>.</div>}<section className="price-bar"><div><span className="muted">{t('bitcoinPrice')}</span><strong>{price ? money(price.price) : '—'}</strong><small className="muted">{price ? `${fromCache ? t('cachedPrice') : t('updatedPrice')} · ${new Date(price.timestamp).toLocaleString()}` : priceError ? t('priceUnavailable') : t('priceUnavailable')}</small></div><button className="secondary" onClick={() => void refreshPrice()} disabled={refreshing}>{refreshing ? t('updatingPrice') : t('updatePrice')}</button></section><section className="stats-grid"><Stat label={t('netInvested')} value={money(invested)} detail={currency} /><article className="stat-card"><span className="muted">{t('accumulatedBalance')}</span><strong className="accent">{displayUnit === 'BTC' ? `${btc.toFixed(8)} BTC` : `${sats.toLocaleString()} sats`}</strong><button className="unit-toggle" onClick={() => void toggleBtcUnit()}>{displayUnit === 'BTC' ? 'BTC → sats' : 'sats → BTC'}</button></article><Stat label={t('totalSold')} value={money(sold)} detail={currency} /><Stat label={t('averagePrice')} value={money(average)} /><Stat label={t('currentValue')} value={price ? money(current) : '—'} detail={price ? currency : t('priceUnavailable')} /><Stat label={t('result')} value={price ? money(result) : '—'} detail={price ? `${resultPercentage.toFixed(2)}%` : t('priceUnavailable')} /></section><div className="dashboard-grid"><HistoryChart title={t('investmentHistory')} points={investmentHistory(filtered, currency)} color="#f7931a" formatter={money} /><HistoryChart title={t('btcHistory')} points={accumulationHistory(filtered, currency)} color="#58b982" formatter={(value) => `${value.toFixed(8)} BTC`} /></div><section className="panel"><div className="panel-heading"><h2>{t('recentPurchases')}</h2><Link className="panel-link" to="/purchases">{t('viewAll')}</Link></div><div className="purchase-list">{allPurchases.slice(-5).reverse().map((purchase) => <div className="purchase-row" key={purchase.id}><span>{new Date(`${purchase.date}T00:00:00`).toLocaleDateString()}</span><strong>{purchase.type === 'sell' ? '-' : '+'}{purchase.btcAmount.toFixed(8)} BTC</strong><span>{purchase.type === 'sell' ? '-' : '+'}{purchase.currency} {purchase.amount.toFixed(2)}</span></div>)}</div><span className="dashboard-meta">{filtered.length} {t('purchasesCount').toLowerCase()} · {wallets.length} {t('walletsCount').toLowerCase()}</span></section></main>
}
