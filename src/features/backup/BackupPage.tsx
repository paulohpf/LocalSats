import { useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { backupFileName, createBackup, createPurchasesCsv, csvFileName, restoreBackup, summarizeBackup, validateBackup } from './backup.service'
import type { BackupSummary, LocalSatsBackup } from './backup.types'

function downloadJson(fileName: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

function downloadCsv(fileName: string, data: string) {
  const blob = new Blob([`\uFEFF${data}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export function BackupPage() {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [pendingBackup, setPendingBackup] = useState<LocalSatsBackup | null>(null)
  const [summary, setSummary] = useState<BackupSummary | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function exportBackup() {
    setIsExporting(true)
    setError('')
    setMessage('')
    try {
      const backup = await createBackup()
      downloadJson(backupFileName(), backup)
      setMessage(t('backupExported'))
    } catch {
      setError(t('backupExportError'))
    } finally {
      setIsExporting(false)
    }
  }

  async function exportCsv() {
    setIsExportingCsv(true)
    setError('')
    setMessage('')
    try {
      const csv = await createPurchasesCsv()
      downloadCsv(csvFileName(), csv)
      setMessage(t('csvExported'))
    } catch {
      setError(t('csvExportError'))
    } finally {
      setIsExportingCsv(false)
    }
  }

  async function readBackupFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError('')
    setMessage('')
    try {
      const parsed = JSON.parse(await file.text()) as unknown
      const backup = validateBackup(parsed)
      setPendingBackup(backup)
      setSummary(summarizeBackup(backup))
    } catch (caught) {
      const code = caught instanceof Error ? caught.message : 'INVALID_BACKUP'
      setError(t(code === 'UNSUPPORTED_VERSION' ? 'backupUnsupportedVersion' : code === 'INVALID_FORMAT' ? 'backupInvalidFormat' : 'backupInvalid'))
      setPendingBackup(null)
      setSummary(null)
    }
  }

  async function confirmRestore() {
    if (!pendingBackup || !window.confirm(t('backupRestoreConfirm'))) return
    setIsRestoring(true)
    setError('')
    setMessage('')
    try {
      await restoreBackup(pendingBackup)
      setPendingBackup(null)
      setSummary(null)
      setMessage(t('backupRestored'))
    } catch {
      setError(t('backupRestoreError'))
    } finally {
      setIsRestoring(false)
    }
  }

  return <main className="content">
    <div className="page-heading"><div><p className="eyebrow">LocalSats</p><h1>{t('backup')}</h1><p className="muted">{t('backupDescription')}</p></div></div>
    <section className="notice backup-warning"><strong>{t('backupWarningTitle')}</strong><span>{t('backupWarningText')}</span></section>
    {(message || error) && <section className={error ? 'notice backup-error' : 'notice backup-success'}>{error || message}</section>}
    <div className="backup-grid">
      <section className="panel backup-card">
        <span className="backup-icon">↓</span>
        <h2>{t('exportBackup')}</h2>
        <p className="muted">{t('exportBackupDescription')}</p>
        <button className="primary" onClick={() => void exportBackup()} disabled={isExporting}>{isExporting ? t('exportingBackup') : t('downloadBackup')}</button>
      </section>
      <section className="panel backup-card">
        <span className="backup-icon">↑</span>
        <h2>{t('importBackup')}</h2>
        <p className="muted">{t('importBackupDescription')}</p>
        <input ref={inputRef} className="hidden-file-input" type="file" accept="application/json,.json" onChange={(event) => void readBackupFile(event)} />
        <button className="secondary" onClick={() => inputRef.current?.click()}>{t('selectBackupFile')}</button>
      </section>
      <section className="panel backup-card">
        <span className="backup-icon">↗</span>
        <h2>{t('exportCsv')}</h2>
        <p className="muted">{t('exportCsvDescription')}</p>
        <button className="secondary" onClick={() => void exportCsv()} disabled={isExportingCsv}>{isExportingCsv ? t('exportingCsv') : t('downloadCsv')}</button>
      </section>
    </div>
    {summary && <section className="panel backup-summary">
      <div><p className="eyebrow">{t('backupSummary')}</p><h2>{t('backupReadyToRestore')}</h2></div>
      <dl>
        <div><dt>{t('backupExportedAt')}</dt><dd>{new Date(summary.exportedAt).toLocaleString()}</dd></div>
        <div><dt>{t('backupVersion')}</dt><dd>{summary.version}</dd></div>
        <div><dt>{t('wallets')}</dt><dd>{summary.walletsCount}</dd></div>
        <div><dt>{t('purchases')}</dt><dd>{summary.purchasesCount}</dd></div>
      </dl>
      <div className="modal-actions"><button className="secondary" onClick={() => { setPendingBackup(null); setSummary(null) }}>{t('cancel')}</button><button className="primary" onClick={() => void confirmRestore()} disabled={isRestoring}>{isRestoring ? t('restoringBackup') : t('restoreBackup')}</button></div>
    </section>}
  </main>
}
