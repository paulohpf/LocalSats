import { db } from './db'
import type { Settings } from '../types'

export const defaultSettings: Settings = {
  id: 'current',
  language: 'en',
  currency: 'BRL',
  theme: 'dark',
  btcDisplayUnit: 'BTC',
}

export async function getSettings(): Promise<Settings> {
  const saved = await db.settings.get('current')
  if (saved) return { ...defaultSettings, ...saved }
  await db.settings.put(defaultSettings)
  return defaultSettings
}

export async function updateSettings(changes: Partial<Omit<Settings, 'id'>>): Promise<Settings> {
  const current = await getSettings()
  const next = { ...current, ...changes }
  await db.settings.put(next)
  return next
}
