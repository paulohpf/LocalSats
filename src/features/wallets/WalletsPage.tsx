import { useLiveQuery } from 'dexie-react-hooks'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '../../components/ui/EmptyState'
import { createWallet, deleteWallet, listWallets, updateWallet, type WalletInput } from './wallets.service'
import type { Wallet } from '../../types'

const emptyForm: WalletInput = { name: '', note: '', address: '' }

export function WalletsPage() {
  const { t } = useTranslation()
  const wallets = useLiveQuery(listWallets, [])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Wallet | null>(null)
  const [form, setForm] = useState<WalletInput>(emptyForm)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setIsFormOpen(true)
  }

  function openEdit(wallet: Wallet) {
    setEditing(wallet)
    setForm({ name: wallet.name, note: wallet.note ?? '', address: wallet.address ?? '' })
    setError('')
    setIsFormOpen(true)
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const input = { name: form.name.trim(), note: form.note?.trim(), address: form.address?.trim() }
    if (!input.name) {
      setError(t('walletNameRequired'))
      return
    }
    setIsSaving(true)
    try {
      if (editing?.id) await updateWallet(editing.id, input)
      else await createWallet(input)
      setIsFormOpen(false)
    } catch {
      setError(t('walletSaveError'))
    } finally {
      setIsSaving(false)
    }
  }

  async function remove(wallet: Wallet) {
    if (!wallet.id || !window.confirm(t('walletDeleteConfirm'))) return
    try { await deleteWallet(wallet.id) } catch { window.alert(t('walletHasPurchases')) }
  }

  return <main className="content">
    <div className="page-heading"><div><p className="eyebrow">LocalSats</p><h1>{t('wallets')}</h1><p className="muted">{t('walletsDescription')}</p></div><button className="primary" onClick={openCreate}>+ {t('newWallet')}</button></div>
    {wallets === undefined ? <section className="panel empty"><span className="muted">{t('loading')}</span></section> : wallets.length === 0 ? <section className="panel"><EmptyState message={t('noWallets')} detail={t('noWalletsDetail')} /></section> : <section className="wallet-grid">{wallets.map((wallet) => <article className="wallet-card" key={wallet.id}><div className="wallet-card-heading"><span className="wallet-icon">₿</span><div><h2>{wallet.name}</h2><span className="muted">{new Date(wallet.createdAt).toLocaleDateString()}</span></div></div>{wallet.address && <p className="wallet-address" title={wallet.address}>{wallet.address}</p>}{wallet.note && <p className="wallet-note">{wallet.note}</p>}<div className="wallet-actions"><button className="text-button" onClick={() => openEdit(wallet)}>{t('edit')}</button><button className="text-button danger" onClick={() => void remove(wallet)}>{t('delete')}</button></div></article>)}</section>}
    {isFormOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsFormOpen(false) }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="wallet-form-title"><div className="modal-heading"><h2 id="wallet-form-title">{editing ? t('editWallet') : t('newWallet')}</h2><button className="close-button" aria-label={t('close')} onClick={() => setIsFormOpen(false)}>×</button></div><form onSubmit={(event) => void save(event)}><label>{t('walletName')}<input autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={t('walletNamePlaceholder')} />{error && <span className="field-error">{error}</span>}</label><label>{t('walletNote')}<textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} rows={3} /></label><label>{t('walletAddress')}<input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="bc1..." /></label><div className="modal-actions"><button type="button" className="secondary" onClick={() => setIsFormOpen(false)}>{t('cancel')}</button><button type="submit" className="primary" disabled={isSaving}>{isSaving ? t('saving') : t('save')}</button></div></form></section></div>}
  </main>
}
