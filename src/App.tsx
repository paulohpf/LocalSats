import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Route, Routes } from 'react-router-dom'
import { getSettings, updateSettings } from './database/settings'
import type { Settings } from './types'
import i18n from './i18n'
import { WalletsPage } from './features/wallets/WalletsPage'
import { PurchasesPage } from './features/purchases/PurchasesPage'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { BackupPage } from './features/backup/BackupPage'
import './App.css'

function applyTheme(theme: Settings['theme']) {
  document.documentElement.dataset.theme = theme
}

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
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">₿</span><span>Local<span className="accent">Sats</span></span></div><nav>{navigation.map(([path, label]) => <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-dot" />{t(label)}</NavLink>)}</nav><div className="sidebar-footer"><span className="status-dot" /> {t('localFirst')}</div></aside><div className="main-area"><header className="topbar"><span className="mobile-brand">Local<span className="accent">Sats</span></span><div className="topbar-actions"><button aria-label="Alterar idioma" onClick={() => void toggleLanguage()}>EN / PT</button><button aria-label="Alterar tema" onClick={() => void cycleTheme()}>☼ {settings?.theme ?? 'dark'}</button></div></header><Routes><Route path="/" element={<DashboardPage />} /><Route path="/purchases" element={<PurchasesPage />} /><Route path="/wallets" element={<WalletsPage />} /><Route path="/backup" element={<BackupPage />} /></Routes></div></div>
}
