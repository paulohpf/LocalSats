// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import '../../i18n'
import { BackupPage } from './BackupPage'

afterEach(() => cleanup())

describe('BackupPage', () => {
  it('renders the main backup actions', () => {
    render(<BackupPage />)

    expect(screen.getByRole('heading', { name: 'Backup' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Export backup' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Import backup' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Encrypted backup' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Export CSV' })).toBeInTheDocument()
  })

  it('opens and closes the encrypted backup export modal', async () => {
    const user = userEvent.setup()
    render(<BackupPage />)

    await user.click(screen.getByRole('button', { name: 'Export encrypted' }))

    const dialog = screen.getByRole('dialog', { name: 'Encrypted backup' })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText('If you lose this password, LocalSats cannot recover your data.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog', { name: 'Encrypted backup' })).not.toBeInTheDocument()
  })

  it('validates short encrypted backup passwords', async () => {
    const user = userEvent.setup()
    render(<BackupPage />)

    await user.click(screen.getByRole('button', { name: 'Export encrypted' }))
    const dialog = screen.getByRole('dialog', { name: 'Encrypted backup' })
    await user.type(within(dialog).getByLabelText('Password'), 'short')
    await user.type(within(dialog).getByLabelText('Confirm password'), 'short')
    await user.click(within(dialog).getByRole('button', { name: 'Export encrypted' }))

    expect(screen.getByText('Password must have at least 8 characters.')).toBeInTheDocument()
  })

  it('validates mismatched encrypted backup passwords', async () => {
    const user = userEvent.setup()
    render(<BackupPage />)

    await user.click(screen.getByRole('button', { name: 'Export encrypted' }))
    const dialog = screen.getByRole('dialog', { name: 'Encrypted backup' })
    await user.type(within(dialog).getByLabelText('Password'), 'long-password')
    await user.type(within(dialog).getByLabelText('Confirm password'), 'different-password')
    await user.click(within(dialog).getByRole('button', { name: 'Export encrypted' }))

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument()
  })
})
