import { useRef, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { decryptBackup, encryptBackup, validateEncryptedBackup } from './backup.crypto'
import { backupFileName, createBackup, createPurchasesCsv, csvFileName, restoreBackup, summarizeBackup, validateBackup } from './backup.service'
import { ENCRYPTED_BACKUP_FORMAT, type BackupSummary, type EncryptedLocalSatsBackup, type LocalSatsBackup } from './backup.types'

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

function encryptedBackupFileName(date = new Date()) {
  return `localsats-encrypted-backup-${date.toISOString().slice(0, 10)}.json`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function BackupPage() {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingEncrypted, setIsExportingEncrypted] = useState(false)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [pendingBackup, setPendingBackup] = useState<LocalSatsBackup | null>(null)
  const [pendingEncryptedBackup, setPendingEncryptedBackup] = useState<EncryptedLocalSatsBackup | null>(null)
  const [summary, setSummary] = useState<BackupSummary | null>(null)
  const [exportPassword, setExportPassword] = useState('')
  const [exportPasswordConfirmation, setExportPasswordConfirmation] = useState('')
  const [importPassword, setImportPassword] = useState('')
  const [isExportPasswordOpen, setIsExportPasswordOpen] = useState(false)
  const [isImportPasswordOpen, setIsImportPasswordOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function closeExportPasswordModal() {
    setIsExportPasswordOpen(false)
    setExportPassword('')
    setExportPasswordConfirmation('')
  }

  function closeImportPasswordModal() {
    setIsImportPasswordOpen(false)
    setImportPassword('')
    setPendingEncryptedBackup(null)
  }

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

  async function exportEncryptedBackup() {
    setError('')
    setMessage('')
    if (exportPassword.length < 8) {
      setError(t('encryptedBackupPasswordTooShort'))
      return
    }
    if (exportPassword !== exportPasswordConfirmation) {
      setError(t('encryptedBackupPasswordMismatch'))
      return
    }
    setIsExportingEncrypted(true)
    try {
      const backup = await createBackup()
      const encrypted = await encryptBackup(backup, exportPassword)
      downloadJson(encryptedBackupFileName(), encrypted)
      closeExportPasswordModal()
      setMessage(t('encryptedBackupExported'))
    } catch {
      setError(t('encryptedBackupExportError'))
    } finally {
      setIsExportingEncrypted(false)
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
      if (isRecord(parsed) && parsed.format === ENCRYPTED_BACKUP_FORMAT) {
        const encrypted = validateEncryptedBackup(parsed)
        setPendingEncryptedBackup(encrypted)
        setImportPassword('')
        setIsImportPasswordOpen(true)
        setPendingBackup(null)
        setSummary(null)
        return
      }
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

  async function decryptPendingBackup() {
    if (!pendingEncryptedBackup) return
    setError('')
    setMessage('')
    if (!importPassword) {
      setError(t('encryptedBackupPasswordRequired'))
      return
    }
    setIsRestoring(true)
    try {
      const backup = await decryptBackup(pendingEncryptedBackup, importPassword)
      setPendingBackup(backup)
      setSummary(summarizeBackup(backup))
      closeImportPasswordModal()
      setMessage(t('encryptedBackupDecrypted'))
    } catch {
      setError(t('encryptedBackupDecryptError'))
    } finally {
      setIsRestoring(false)
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
        <span className="backup-icon">🔒</span>
        <h2>{t('exportEncryptedBackup')}</h2>
        <p className="muted">{t('exportEncryptedBackupDescription')}</p>
        <button className="secondary" onClick={() => { setError(''); setMessage(''); setIsExportPasswordOpen(true) }}>{t('exportEncryptedBackupButton')}</button>
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
    {isExportPasswordOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeExportPasswordModal() }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="encrypted-export-title"><div className="modal-heading"><h2 id="encrypted-export-title">{t('exportEncryptedBackup')}</h2><button className="close-button" aria-label={t('close')} onClick={closeExportPasswordModal}>×</button></div><p className="muted password-warning">{t('encryptedBackupPasswordWarning')}</p><label>{t('password')}<input autoFocus type="password" value={exportPassword} onChange={(event) => setExportPassword(event.target.value)} /></label><label>{t('confirmPassword')}<input type="password" value={exportPasswordConfirmation} onChange={(event) => setExportPasswordConfirmation(event.target.value)} /></label><div className="modal-actions"><button type="button" className="secondary" onClick={closeExportPasswordModal}>{t('cancel')}</button><button type="button" className="primary" onClick={() => void exportEncryptedBackup()} disabled={isExportingEncrypted}>{isExportingEncrypted ? t('exportingBackup') : t('exportEncryptedBackupButton')}</button></div></section></div>}
    {isImportPasswordOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeImportPasswordModal() }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="encrypted-import-title"><div className="modal-heading"><h2 id="encrypted-import-title">{t('unlockEncryptedBackup')}</h2><button className="close-button" aria-label={t('close')} onClick={closeImportPasswordModal}>×</button></div><p className="muted password-warning">{t('unlockEncryptedBackupDescription')}</p><label>{t('password')}<input autoFocus type="password" value={importPassword} onChange={(event) => setImportPassword(event.target.value)} /></label><div className="modal-actions"><button type="button" className="secondary" onClick={closeImportPasswordModal}>{t('cancel')}</button><button type="button" className="primary" onClick={() => void decryptPendingBackup()} disabled={isRestoring}>{isRestoring ? t('decryptingBackup') : t('unlockBackup')}</button></div></section></div>}
  </main>
}
