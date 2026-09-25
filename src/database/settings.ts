import { db } from './db'
import type { Settings } from '../types'

export const defaultSettings: Settings = {
  id: 'current',
  language: 'pt-BR',
  currency: 'BRL',
  theme: 'dark',
}

export async function getSettings(): Promise<Settings> {
  const saved = await db.settings.get('current')
  if (saved) return saved
  await db.settings.put(defaultSettings)
  return defaultSettings
}

export async function updateSettings(changes: Partial<Omit<Settings, 'id'>>): Promise<Settings> {
  const current = await getSettings()
  const next = { ...current, ...changes }
  await db.settings.put(next)
  return next
}
