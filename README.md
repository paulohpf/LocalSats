# LocalSats

LocalSats é uma aplicação web local-first para acompanhamento de compras
recorrentes de Bitcoin. O objetivo é permitir que o usuário registre seu
histórico de DCA, organize movimentações por carteira, acompanhe evolução
patrimonial e mantenha os próprios dados sob controle local.

Princípio do produto:

> Your Bitcoin. Your data.

## Estado atual

O projeto já possui:

- base React + TypeScript + Vite;
- persistência local com Dexie/IndexedDB;
- internacionalização PT-BR/EN;
- temas claro e escuro;
- PWA inicialmente configurada;
- CRUD de carteiras;
- registro de compras e vendas;
- associação opcional de movimentações a carteiras;
- cálculo automático de BTC;
- dashboard com métricas financeiras;
- gráficos de investimento e acumulação;
- consulta de preço BTC via CoinGecko Free Tier;
- cache local e fallback para último preço conhecido;
- exportação e importação de backup JSON com validação e confirmação;
- exportação e importação de backup protegido por senha;
- exportação CSV de compras e vendas para análise em planilhas;
- PWA com service worker gerado por Workbox;
- navegação e telas principais ajustadas para mobile.

Ainda estão pendentes validação offline manual completa e testes de componentes.

## Stack

- React
- TypeScript
- Vite
- Dexie / IndexedDB
- i18next / react-i18next
- React Router
- Oxlint
- Vitest
- fake-indexeddb

## Scripts

Instalar dependências:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar build de produção:

```bash
npm run build
```

Executar lint:

```bash
npm run lint
```

Executar testes automatizados:

```bash
npm run test
```

Executar testes em modo observação:

```bash
npm run test:watch
```

Pré-visualizar build:

```bash
npm run preview
```

## Configuração de preço do Bitcoin

A integração com CoinGecko pode usar uma chave de API opcional através da
variável de ambiente:

```bash
VITE_COINGECKO_API_KEY=
```

Sem chave configurada, a aplicação usa o fluxo disponível para a camada gratuita,
mantendo cache local e fallback para o último preço salvo.

## Privacidade e segurança

- Os dados financeiros ficam no IndexedDB local do navegador.
- Não há login, conta de usuário ou banco de dados remoto da aplicação.
- A única chamada externa esperada é para o CoinGecko, enviando apenas a moeda
  desejada para consulta de preço BTC.
- Carteiras, compras, vendas, notas, endereços e backups não são enviados pelo
  LocalSats para servidores próprios.
- Backups JSON, backups criptografados e CSVs são gerados localmente via
  navegador.
- Backups criptografados usam Web Crypto API com PBKDF2/SHA-256 e AES-GCM.
- Senhas de backup não são armazenadas. Se a senha for perdida, o backup
  criptografado não poderá ser recuperado.
- O service worker faz cache de assets estáticos e pode cachear respostas
  públicas de preço do CoinGecko, sem dados do usuário.

## Organização principal

- `src/database/`: banco local, schema e configurações persistidas.
- `src/features/wallets/`: carteiras.
- `src/features/purchases/`: compras e vendas.
- `src/features/dashboard/`: dashboard, métricas e gráficos.
- `src/features/backup/`: exportação, validação, resumo, restauração de backup e
  exportação CSV.
- `src/features/backup/backup.crypto.ts`: criptografia e descriptografia local de
  backups protegidos por senha.
- `src/features/backup/backup.indexeddb.test.ts`: testes do fluxo de backup com
  IndexedDB simulado.
- `src/services/bitcoinPrice/`: provedor de preço BTC e cache.
- `src/services/bitcoinPrice/*.test.ts`: testes do provider CoinGecko e do
  serviço de preço/cache.
- `src/utils/calculations.ts`: cálculos financeiros.
- `src/utils/calculations.test.ts`: testes dos cálculos financeiros.
- `src/i18n/resources.ts`: recursos de tradução PT-BR/EN.
- `src/i18n/resources.test.ts`: testes de paridade e chaves críticas de i18n.
- `src/i18n/index.ts`: inicialização do i18next.
- `src/types/index.ts`: tipos compartilhados.
- `vite.config.ts`: configuração Vite e PWA/Workbox.

## Validação offline manual

Após gerar o build e servir a aplicação em modo produção, validar no navegador:

1. abrir a aplicação uma vez online;
2. instalar como PWA, quando disponível;
3. desativar a rede;
4. recarregar a aplicação;
5. navegar entre Dashboard, Compras, Carteiras e Backup;
6. criar/editar dados locais;
7. exportar backup JSON, backup criptografado e CSV;
8. confirmar que idioma, tema e dados persistidos continuam disponíveis.

## Validação mobile manual

Validar em larguras próximas de 390px, 430px, 768px e 1024px:

1. navegação inferior;
2. cards de compras;
3. criação/edição de compra e venda;
4. modais de carteira, compra e backup criptografado;
5. dashboard, gráficos e cards;
6. tela de backup com JSON, criptografado e CSV.

## Documentação

- [`DOCUMENTAÇÃO.md`](./DOCUMENTAÇÃO.md): plano de produto, arquitetura desejada,
  roadmap e critérios do MVP.
- [`IMPLEMENTAÇÃO.md`](./IMPLEMENTAÇÃO.md): registro do que foi efetivamente
  implementado, arquivos envolvidos, testes executados e pendências.

Para manutenção futura, atualize `IMPLEMENTAÇÃO.md` junto com cada entrega.
