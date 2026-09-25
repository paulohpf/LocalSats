import { useLiveQuery } from 'dexie-react-hooks'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { db } from '../../database/db'
import { EmptyState } from '../../components/ui/EmptyState'
import { calculateBtc } from '../../utils/calculations'
import { createPurchase, deletePurchase, listPurchases, updatePurchase, type PurchaseInput } from './purchases.service'
import type { Purchase } from '../../types'

const today = new Date().toISOString().slice(0, 10)
const emptyForm: PurchaseInput = { date: today, amount: 0, currency: 'BRL', bitcoinPrice: 0, fee: 0, walletId: undefined, note: '' }

export function PurchasesPage() {
  const { t } = useTranslation()
  const purchases = useLiveQuery(listPurchases, [])
  const wallets = useLiveQuery(() => db.wallets.orderBy('name').toArray(), []) ?? []
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Purchase | null>(null)
  const [form, setForm] = useState<PurchaseInput>(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function openForm(purchase?: Purchase) {
    setEditing(purchase ?? null)
    setForm(purchase ? { date: purchase.date, amount: purchase.amount, currency: purchase.currency, bitcoinPrice: purchase.bitcoinPrice, fee: purchase.fee ?? 0, walletId: purchase.walletId, note: purchase.note ?? '' } : emptyForm)
    setError('')
    setFormOpen(true)
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.date || form.amount <= 0 || form.bitcoinPrice <= 0 || (form.fee ?? 0) < 0) {
      setError(t('purchaseInvalid'))
      return
    }
    setSaving(true)
    try {
      if (editing?.id) await updatePurchase(editing.id, form)
      else await createPurchase(form)
      setFormOpen(false)
    } catch { setError(t('purchaseSaveError')) } finally { setSaving(false) }
  }

  async function remove(purchase: Purchase) {
    if (purchase.id && window.confirm(t('purchaseDeleteConfirm'))) await deletePurchase(purchase.id)
  }

  const btcPreview = calculateBtc(form.amount, form.bitcoinPrice)
  return <main className="content"><div className="page-heading"><div><p className="eyebrow">LocalSats</p><h1>{t('purchases')}</h1><p className="muted">{t('purchasesDescription')}</p></div><button className="primary" onClick={() => openForm()}>+ {t('newPurchase')}</button></div>
    {purchases === undefined ? <section className="panel empty"><span className="muted">{t('loading')}</span></section> : purchases.length === 0 ? <section className="panel"><EmptyState message={t('noPurchases')} detail={t('noPurchasesDetail')} /></section> : <section className="panel purchase-panel"><div className="purchase-table"><div className="purchase-header"><span>{t('date')}</span><span>{t('amount')}</span><span>{t('btc')}</span><span>{t('wallet')}</span><span /></div>{purchases.map((purchase) => <div className="purchase-row" key={purchase.id}><span>{new Date(`${purchase.date}T00:00:00`).toLocaleDateString()}</span><span>{purchase.currency} {purchase.amount.toFixed(2)}</span><strong>{purchase.btcAmount.toFixed(8)}</strong><span>{wallets.find((wallet) => wallet.id === purchase.walletId)?.name ?? t('withoutWallet')}</span><span className="row-actions"><button className="text-button" onClick={() => openForm(purchase)}>{t('edit')}</button><button className="text-button danger" onClick={() => void remove(purchase)}>{t('delete')}</button></span></div>)}</div></section>}
    {formOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false) }}><section className="modal purchase-modal" role="dialog" aria-modal="true" aria-labelledby="purchase-form-title"><div className="modal-heading"><h2 id="purchase-form-title">{editing ? t('editPurchase') : t('newPurchase')}</h2><button className="close-button" aria-label={t('close')} onClick={() => setFormOpen(false)}>×</button></div><form onSubmit={(event) => void save(event)}><div className="form-columns"><label>{t('date')}<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label>{t('currency')}<select value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value as PurchaseInput['currency'] })}><option value="BRL">BRL</option><option value="USD">USD</option></select></label></div><div className="form-columns"><label>{t('amount')}<input type="number" min="0" step="0.01" value={form.amount || ''} onChange={(event) => setForm({ ...form, amount: Number(event.target.value) })} /></label><label>{t('bitcoinPrice')}<input type="number" min="0" step="0.01" value={form.bitcoinPrice || ''} onChange={(event) => setForm({ ...form, bitcoinPrice: Number(event.target.value) })} /></label></div><div className="form-columns"><label>{t('fee')}<input type="number" min="0" step="0.01" value={form.fee || ''} onChange={(event) => setForm({ ...form, fee: Number(event.target.value) })} /></label><label>{t('wallet')}<select value={form.walletId ?? ''} onChange={(event) => setForm({ ...form, walletId: event.target.value ? Number(event.target.value) : undefined })}><option value="">{t('withoutWallet')}</option>{wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}</select></label></div><label>{t('note')}<textarea rows={2} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label><div className="btc-preview"><span>{t('calculatedBtc')}</span><strong>{btcPreview.toFixed(8)} BTC</strong></div>{error && <p className="field-error">{error}</p>}<div className="modal-actions"><button type="button" className="secondary" onClick={() => setFormOpen(false)}>{t('cancel')}</button><button type="submit" className="primary" disabled={saving}>{saving ? t('saving') : t('save')}</button></div></form></section></div>}
  </main>
}
