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
- exportação CSV de compras e vendas para análise em planilhas.

Ainda estão pendentes backup criptografado, testes automatizados, validação
offline completa e refinamento mobile.

## Stack

- React
- TypeScript
- Vite
- Dexie / IndexedDB
- i18next / react-i18next
- React Router
- Oxlint

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
- `src/services/bitcoinPrice/`: provedor de preço BTC e cache.
- `src/utils/calculations.ts`: cálculos financeiros.
- `src/i18n/index.ts`: traduções.
- `src/types/index.ts`: tipos compartilhados.

## Documentação

- [`DOCUMENTAÇÃO.md`](./DOCUMENTAÇÃO.md): plano de produto, arquitetura desejada,
  roadmap e critérios do MVP.
- [`IMPLEMENTAÇÃO.md`](./IMPLEMENTAÇÃO.md): registro do que foi efetivamente
  implementado, arquivos envolvidos, testes executados e pendências.

Para manutenção futura, atualize `IMPLEMENTAÇÃO.md` junto com cada entrega.
