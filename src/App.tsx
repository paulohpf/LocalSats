import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Route, Routes } from 'react-router-dom'
import { db } from './database/db'
import { getSettings, updateSettings } from './database/settings'
import type { Settings } from './types'
import i18n from './i18n'
import { EmptyState } from './components/ui/EmptyState'
import { WalletsPage } from './features/wallets/WalletsPage'
import './App.css'

function applyTheme(theme: Settings['theme']) {
  document.documentElement.dataset.theme = theme
}

function Dashboard() {
  const { t } = useTranslation()
  const purchases = useLiveQuery(() => db.purchases.toArray(), []) ?? []
  const wallets = useLiveQuery(() => db.wallets.toArray(), []) ?? []
  const invested = purchases.reduce((total, purchase) => total + purchase.amount, 0)
  const btc = purchases.reduce((total, purchase) => total + purchase.btcAmount, 0)

  return <main className="content">
    <div className="page-heading"><div><p className="eyebrow">{t('overview')}</p><h1>{t('welcome')}</h1><p className="muted">{t('welcomeText')}</p></div><button className="primary">+ {t('purchases')}</button></div>
    <section className="stats-grid"><Stat label={t('totalInvested')} value={`R$ ${invested.toFixed(2)}`} /><Stat label={t('totalBtc')} value={`${btc.toFixed(8)} BTC`} accent /><Stat label={t('purchasesCount')} value={String(purchases.length)} /><Stat label={t('walletsCount')} value={String(wallets.length)} /></section>
    <section className="panel"><div className="panel-heading"><h2>{t('recentPurchases')}</h2><span className="muted">{t('localFirst')}</span></div>{purchases.length === 0 ? <EmptyState message={t('noPurchases')} detail={t('localFirstText')} /> : <div className="purchase-list">{purchases.slice(-5).reverse().map((purchase) => <div className="purchase-row" key={purchase.id}><span>{new Date(purchase.date).toLocaleDateString()}</span><strong>{purchase.btcAmount.toFixed(8)} BTC</strong><span>R$ {purchase.amount.toFixed(2)}</span></div>)}</div>}</section>
  </main>
}

function Placeholder({ title }: { title: string }) { return <main className="content"><p className="eyebrow">LocalSats</p><h1>{title}</h1><section className="panel"><EmptyState message="Esta área será implementada nas próximas etapas." /></section></main> }
function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) { return <article className="stat-card"><span className="muted">{label}</span><strong className={accent ? 'accent' : ''}>{value}</strong></article> }

export default function App() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    let active = true
    void getSettings().then((saved) => {
      if (!active) return
      setSettings(saved)
      applyTheme(saved.theme)
      if (i18n.language !== saved.language) void i18n.changeLanguage(saved.language)
    })
    return () => { active = false }
  }, [])

  async function toggleLanguage() {
    const language = i18n.language === 'pt-BR' ? 'en' : 'pt-BR'
    await i18n.changeLanguage(language)
    const saved = await updateSettings({ language })
    setSettings(saved)
  }

  async function cycleTheme() {
    const next = settings?.theme === 'light' ? 'dark' : 'light'
    const saved = await updateSettings({ theme: next })
    setSettings(saved)
    applyTheme(next)
  }

  const navigation = [['/', 'dashboard'], ['/purchases', 'purchases'], ['/wallets', 'wallets'], ['/backup', 'backup']]
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">₿</span><span>Local<span className="accent">Sats</span></span></div><nav>{navigation.map(([path, label]) => <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-dot" />{t(label)}</NavLink>)}</nav><div className="sidebar-footer"><span className="status-dot" /> {t('localFirst')}</div></aside><div className="main-area"><header className="topbar"><span className="mobile-brand">Local<span className="accent">Sats</span></span><div className="topbar-actions"><button aria-label="Alterar idioma" onClick={() => void toggleLanguage()}>EN / PT</button><button aria-label="Alterar tema" onClick={() => void cycleTheme()}>☼ {settings?.theme ?? 'dark'}</button></div></header><Routes><Route path="/" element={<Dashboard />} /><Route path="/purchases" element={<Placeholder title={t('purchases')} />} /><Route path="/wallets" element={<WalletsPage />} /><Route path="/backup" element={<Placeholder title={t('backup')} />} /></Routes></div></div>
}
