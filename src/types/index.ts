export interface Wallet {
  id?: number
  name: string
  note?: string
  address?: string
  createdAt: string
}

export interface Purchase {
  id?: number
  date: string
  amount: number
  currency: 'BRL' | 'USD'
  bitcoinPrice: number
  btcAmount: number
  fee?: number
  walletId?: number
  note?: string
}

export interface Settings {
  id: 'current'
  language: 'pt-BR' | 'en'
  currency: 'BRL' | 'USD'
  theme: 'light' | 'dark' | 'system'
}
