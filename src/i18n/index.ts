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
      walletsDescription: 'Organize suas compras por carteira ou categoria.', newWallet: 'Nova carteira', editWallet: 'Editar carteira',
      noWallets: 'Nenhuma carteira cadastrada.', noWalletsDetail: 'Crie sua primeira carteira para organizar suas compras.', loading: 'Carregando...',
      walletName: 'Nome', walletNamePlaceholder: 'ex.: Cold Wallet', walletNote: 'Observação', walletAddress: 'Endereço Bitcoin (opcional)',
      walletNameRequired: 'Informe um nome para a carteira.', walletSaveError: 'Não foi possível salvar a carteira.', walletDeleteConfirm: 'Excluir esta carteira?',
      edit: 'Editar', delete: 'Excluir', close: 'Fechar', cancel: 'Cancelar', save: 'Salvar', saving: 'Salvando...',
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
      walletsDescription: 'Organize your purchases by wallet or category.', newWallet: 'New wallet', editWallet: 'Edit wallet',
      noWallets: 'No wallets registered yet.', noWalletsDetail: 'Create your first wallet to organize your purchases.', loading: 'Loading...',
      walletName: 'Name', walletNamePlaceholder: 'e.g. Cold Wallet', walletNote: 'Note', walletAddress: 'Bitcoin address (optional)',
      walletNameRequired: 'Enter a name for the wallet.', walletSaveError: 'Could not save the wallet.', walletDeleteConfirm: 'Delete this wallet?',
      edit: 'Edit', delete: 'Delete', close: 'Close', cancel: 'Cancel', save: 'Save', saving: 'Saving...',
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
