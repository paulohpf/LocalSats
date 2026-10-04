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
- base criptográfica para backup protegido por senha;
- exportação CSV de compras e vendas para análise em planilhas.

Ainda estão pendentes integração do backup criptografado na interface, validação
offline completa e refinamento mobile.

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

## Documentação

- [`DOCUMENTAÇÃO.md`](./DOCUMENTAÇÃO.md): plano de produto, arquitetura desejada,
  roadmap e critérios do MVP.
- [`IMPLEMENTAÇÃO.md`](./IMPLEMENTAÇÃO.md): registro do que foi efetivamente
  implementado, arquivos envolvidos, testes executados e pendências.

Para manutenção futura, atualize `IMPLEMENTAÇÃO.md` junto com cada entrega.
