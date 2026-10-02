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
      accumulatedBalance: 'Saldo acumulado',
      netInvested: 'Investimento líquido', totalSold: 'Total vendido', buy: 'Compra', sell: 'Venda', newSale: 'Nova venda', editSale: 'Editar venda',
      amountInvested: 'Valor investido', btcSold: 'BTC vendido', calculatedAmount: 'Valor recebido',
      saleExceedsBalance: 'Esta venda é maior que o saldo registrado. Deseja continuar?',
      priceUnavailable: 'Preço atual indisponível', investmentHistory: 'Evolução do investimento', btcHistory: 'Evolução do BTC',
      mixedCurrencies: 'Os indicadores estão filtrados para a moeda', viewAll: 'Ver todas',
      updatePrice: 'Atualizar preço', updatingPrice: 'Atualizando...', cachedPrice: 'Preço local', updatedPrice: 'Atualizado',
      purchasesDescription: 'Registre e acompanhe seu histórico de compras de Bitcoin.', newPurchase: 'Nova compra', editPurchase: 'Editar compra',
      noPurchasesDetail: 'Registre sua primeira compra para começar seu histórico.', date: 'Data', amount: 'Valor', btc: 'BTC', wallet: 'Carteira',
      withoutWallet: 'Sem carteira', currency: 'Moeda', bitcoinPrice: 'Preço do Bitcoin', fee: 'Taxa', note: 'Observação', calculatedBtc: 'BTC calculado',
      purchaseInvalid: 'Informe data, valor e preço do Bitcoin válidos.', purchaseSaveError: 'Não foi possível salvar a compra.', purchaseDeleteConfirm: 'Excluir esta compra?',
      backupDescription: 'Exporte e restaure seus dados locais quando precisar trocar de dispositivo ou criar uma cópia de segurança.',
      backupWarningTitle: 'Seus dados ficam somente neste dispositivo.', backupWarningText: 'O LocalSats não possui uma cópia dos seus dados. Faça backups regularmente.',
      exportBackup: 'Exportar backup', exportBackupDescription: 'Baixe um arquivo JSON com configurações, carteiras e movimentações.', exportingBackup: 'Exportando...', downloadBackup: 'Baixar backup JSON', backupExported: 'Backup exportado com sucesso.', backupExportError: 'Não foi possível exportar o backup.',
      importBackup: 'Importar backup', importBackupDescription: 'Selecione um arquivo JSON exportado anteriormente pelo LocalSats.', selectBackupFile: 'Selecionar arquivo', backupInvalid: 'Arquivo de backup inválido.', backupInvalidFormat: 'Este arquivo não é um backup do LocalSats.', backupUnsupportedVersion: 'Esta versão de backup ainda não é suportada.',
      backupSummary: 'Resumo do backup', backupReadyToRestore: 'Backup pronto para restauração', backupExportedAt: 'Exportado em', backupVersion: 'Versão', restoreBackup: 'Restaurar backup', restoringBackup: 'Restaurando...', backupRestoreConfirm: 'Restaurar este backup substituirá carteiras, compras, vendas e configurações atuais. Deseja continuar?', backupRestored: 'Backup restaurado com sucesso.', backupRestoreError: 'Não foi possível restaurar o backup.',
      exportCsv: 'Exportar CSV', exportCsvDescription: 'Baixe compras e vendas em CSV para análise em planilhas. CSV não substitui o backup JSON.', exportingCsv: 'Exportando...', downloadCsv: 'Baixar CSV', csvExported: 'CSV exportado com sucesso.', csvExportError: 'Não foi possível exportar o CSV.',
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
      accumulatedBalance: 'Accumulated balance',
      netInvested: 'Net invested', totalSold: 'Total sold', buy: 'Buy', sell: 'Sell', newSale: 'New sale', editSale: 'Edit sale',
      amountInvested: 'Invested amount', btcSold: 'BTC sold', calculatedAmount: 'Received amount',
      saleExceedsBalance: 'This sale is larger than the recorded balance. Continue?',
      priceUnavailable: 'Current price unavailable', investmentHistory: 'Investment history', btcHistory: 'BTC accumulation',
      mixedCurrencies: 'Indicators are filtered to', viewAll: 'View all',
      updatePrice: 'Update price', updatingPrice: 'Updating...', cachedPrice: 'Local price', updatedPrice: 'Updated',
      purchasesDescription: 'Record and track your Bitcoin purchase history.', newPurchase: 'New purchase', editPurchase: 'Edit purchase',
      noPurchasesDetail: 'Record your first purchase to start your history.', date: 'Date', amount: 'Amount', btc: 'BTC', wallet: 'Wallet',
      withoutWallet: 'No wallet', currency: 'Currency', bitcoinPrice: 'Bitcoin price', fee: 'Fee', note: 'Note', calculatedBtc: 'Calculated BTC',
      purchaseInvalid: 'Enter a valid date, amount, and Bitcoin price.', purchaseSaveError: 'Could not save the purchase.', purchaseDeleteConfirm: 'Delete this purchase?',
      backupDescription: 'Export and restore your local data when you need to change devices or create a safety copy.',
      backupWarningTitle: 'Your data stays only on this device.', backupWarningText: 'LocalSats does not keep a copy of your data. Back up regularly.',
      exportBackup: 'Export backup', exportBackupDescription: 'Download a JSON file with settings, wallets, and movements.', exportingBackup: 'Exporting...', downloadBackup: 'Download JSON backup', backupExported: 'Backup exported successfully.', backupExportError: 'Could not export the backup.',
      importBackup: 'Import backup', importBackupDescription: 'Select a JSON file previously exported by LocalSats.', selectBackupFile: 'Select file', backupInvalid: 'Invalid backup file.', backupInvalidFormat: 'This file is not a LocalSats backup.', backupUnsupportedVersion: 'This backup version is not supported yet.',
      backupSummary: 'Backup summary', backupReadyToRestore: 'Backup ready to restore', backupExportedAt: 'Exported at', backupVersion: 'Version', restoreBackup: 'Restore backup', restoringBackup: 'Restoring...', backupRestoreConfirm: 'Restoring this backup will replace current wallets, purchases, sales, and settings. Continue?', backupRestored: 'Backup restored successfully.', backupRestoreError: 'Could not restore the backup.',
      exportCsv: 'Export CSV', exportCsvDescription: 'Download purchases and sales as CSV for spreadsheet analysis. CSV does not replace the JSON backup.', exportingCsv: 'Exporting...', downloadCsv: 'Download CSV', csvExported: 'CSV exported successfully.', csvExportError: 'Could not export the CSV.',
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
