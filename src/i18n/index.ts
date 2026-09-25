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
      walletHasPurchases: 'Esta carteira possui compras associadas e não pode ser excluída.',
      totalSats: 'Satoshis acumulados', averagePrice: 'Preço médio', currentValue: 'Valor atual', result: 'Resultado',
      priceUnavailable: 'Preço atual indisponível', investmentHistory: 'Evolução do investimento', btcHistory: 'Evolução do BTC',
      mixedCurrencies: 'Os indicadores estão filtrados para a moeda', viewAll: 'Ver todas',
      purchasesDescription: 'Registre e acompanhe seu histórico de compras de Bitcoin.', newPurchase: 'Nova compra', editPurchase: 'Editar compra',
      noPurchasesDetail: 'Registre sua primeira compra para começar seu histórico.', date: 'Data', amount: 'Valor', btc: 'BTC', wallet: 'Carteira',
      withoutWallet: 'Sem carteira', currency: 'Moeda', bitcoinPrice: 'Preço do Bitcoin', fee: 'Taxa', note: 'Observação', calculatedBtc: 'BTC calculado',
      purchaseInvalid: 'Informe data, valor e preço do Bitcoin válidos.', purchaseSaveError: 'Não foi possível salvar a compra.', purchaseDeleteConfirm: 'Excluir esta compra?',
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
      walletHasPurchases: 'This wallet has associated purchases and cannot be deleted.',
      totalSats: 'Accumulated satoshis', averagePrice: 'Average price', currentValue: 'Current value', result: 'Result',
      priceUnavailable: 'Current price unavailable', investmentHistory: 'Investment history', btcHistory: 'BTC accumulation',
      mixedCurrencies: 'Indicators are filtered to', viewAll: 'View all',
      purchasesDescription: 'Record and track your Bitcoin purchase history.', newPurchase: 'New purchase', editPurchase: 'Edit purchase',
      noPurchasesDetail: 'Record your first purchase to start your history.', date: 'Date', amount: 'Amount', btc: 'BTC', wallet: 'Wallet',
      withoutWallet: 'No wallet', currency: 'Currency', bitcoinPrice: 'Bitcoin price', fee: 'Fee', note: 'Note', calculatedBtc: 'Calculated BTC',
      purchaseInvalid: 'Enter a valid date, amount, and Bitcoin price.', purchaseSaveError: 'Could not save the purchase.', purchaseDeleteConfirm: 'Delete this purchase?',
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
