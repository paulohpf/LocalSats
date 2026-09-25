import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  'pt-BR': {
    translation: {
      dashboard: 'Dashboard', purchases: 'Compras', wallets: 'Carteiras', backup: 'Backup',
      overview: 'Visão geral', welcome: 'Seu Bitcoin. Seus dados.',
      welcomeText: 'Acompanhe suas compras recorrentes com privacidade e simplicidade.',
      totalInvested: 'Total investido', totalBtc: 'BTC acumulado', purchasesCount: 'Compras',
      walletsCount: 'Carteiras', recentPurchases: 'Compras recentes', noPurchases: 'Nenhuma compra registrada ainda.',
      localFirst: '100% local', localFirstText: 'Seus dados permanecem neste dispositivo.',
    },
  },
  en: {
    translation: {
      dashboard: 'Dashboard', purchases: 'Purchases', wallets: 'Wallets', backup: 'Backup',
      overview: 'Overview', welcome: 'Your Bitcoin. Your data.',
      welcomeText: 'Track recurring purchases with privacy and simplicity.',
      totalInvested: 'Total invested', totalBtc: 'Accumulated BTC', purchasesCount: 'Purchases',
      walletsCount: 'Wallets', recentPurchases: 'Recent purchases', noPurchases: 'No purchases registered yet.',
      localFirst: '100% local', localFirstText: 'Your data stays on this device.',
    },
  },
}

const browserLanguage = navigator.language === 'pt-BR' ? 'pt-BR' : 'en'

void i18n.use(initReactI18next).init({
  resources,
  lng: browserLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
