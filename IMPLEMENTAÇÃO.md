# LocalSats — Registro de Implementação

Este arquivo registra o que foi efetivamente implementado no projeto. Ele deve
ser atualizado junto com cada entrega e não substitui o plano descrito em
[`DOCUMENTAÇÃO.md`](./DOCUMENTAÇÃO.md).

## Como atualizar

Após cada implementação:

1. atualize o status da funcionalidade correspondente;
2. registre a alteração no histórico abaixo, com a data;
3. informe os arquivos principais envolvidos;
4. registre os testes executados e eventuais pendências.

## Status do projeto

**Estado atual:** Fases 1 a 6 parcialmente implementadas; compras/vendas,
dashboard, preço/cache BTC, backup JSON, exportação CSV, i18n, base
criptográfica de backup e testes automatizados funcionais; integração do backup
criptografado na interface, refinamento mobile e validação offline ainda
pendentes.

**Última atualização:** 03/10/2026

A aplicação já possui base técnica local-first, CRUD de carteiras, registro de
compras e vendas, dashboard com métricas financeiras, integração de preço do
Bitcoin via CoinGecko, testes de preço/cache, exportação/importação de backup
JSON, exportação CSV, base criptográfica para backup com senha, recursos de i18n
testáveis e testes automatizados com Vitest e IndexedDB simulado.

## Resumo do que já foi feito

Até o momento, o LocalSats possui uma base funcional com React, TypeScript e
Vite, utilizando IndexedDB via Dexie para persistência local dos dados.

A aplicação permite criar, editar, listar e excluir carteiras; registrar compras
e vendas de Bitcoin; associar movimentações a carteiras; calcular quantidade de
BTC automaticamente; registrar taxas; e adicionar observações.

O dashboard calcula investimento líquido, saldo líquido em BTC ou satoshis,
total vendido, preço médio, valor atual estimado, resultado financeiro e
percentual. Também exibe gráficos de histórico de investimento e de acumulação
de Bitcoin.

A consulta de preço atual do Bitcoin foi abstraída por serviço próprio, com
integração ao CoinGecko Free Tier, cache local, deduplicação de requisições,
fallback para o último preço conhecido e atualização manual pelo usuário.

Ainda não foram implementados integração do backup criptografado na interface,
testes de componentes React, refinamento mobile completo e validação offline
final.

## Como a implementação está organizada

- `src/database/`: configuração do Dexie/IndexedDB e persistência local de
  dados, configurações e preços.
- `src/features/wallets/`: tela e serviço de carteiras, incluindo CRUD local.
- `src/features/purchases/`: tela e serviço de movimentações de compra e venda.
- `src/features/dashboard/`: dashboard principal, cards de métricas e gráficos.
- `src/services/bitcoinPrice/`: abstração de provedor de preço, integração com
  CoinGecko, cache e fallback local.
- `src/utils/calculations.ts`: cálculos financeiros e históricos usados pelo
  dashboard.
- `src/i18n/index.ts`: traduções PT-BR e EN.
- `src/types/index.ts`: tipos centrais da aplicação.

## Pendências principais

- Integrar backup criptografado na interface de exportação/importação.
- Ampliar testes automatizados para componentes React.
- Criar testes para preenchimento automático de preço no modal.
- Decidir se vendas acima do saldo devem gerar apenas aviso ou bloqueio.
- Validar funcionamento offline completo.
- Refinar responsividade mobile.
- Realizar revisão de privacidade e segurança.

## Progresso por fase

### Fase 1 — Fundação

- [x] Projeto React + TypeScript criado
- [x] Vite configurado
- [x] Estrutura de pastas criada
- [x] Sistema visual configurado
- [x] Roteamento configurado
- [x] IndexedDB/Dexie configurado
- [x] Internacionalização configurada
- [x] Idioma PT-BR disponível
- [x] Idioma EN disponível
- [x] Temas claro e escuro disponíveis
- [x] PWA configurada

### Fase 2 — Carteiras

- [x] Criar carteira
- [x] Listar carteiras
- [x] Editar carteira
- [x] Excluir carteira
- [x] Observação da carteira
- [x] Endereço opcional

### Fase 3 — Compras

- [x] Criar compra
- [x] Listar compras
- [x] Editar compra
- [x] Excluir compra
- [x] Associar carteira
- [x] Calcular BTC
- [x] Registrar taxa
- [x] Adicionar observação
- [x] Registrar venda
- [x] Calcular saldo líquido após vendas
- [x] Atualizar gráficos com vendas

### Fase 4 — Dashboard

- [x] Total investido
- [x] Total de BTC
- [x] Total em satoshis
- [x] Preço médio
- [x] Valor atual
- [x] Resultado
- [x] Gráfico de investimento
- [x] Gráfico de acumulação

### Fase 5 — Preço atual

- [x] Abstração de provedor de preço
- [x] Integrar CoinGecko Free Tier para consulta de preço do Bitcoin
- [x] Armazenamento local do último preço
- [x] Atualização manual de preço

### Fase 6 — Backup

- [x] Exportação de backup JSON
- [x] Importação de backup JSON
- [x] Validação do formato
- [x] Validação da versão
- [x] Resumo antes da restauração
- [ ] Backup criptografado
- [x] Exportação CSV

### Fase 7 — PWA offline

- [ ] Carregamento offline
- [ ] Operações locais offline
- [ ] Registro e edição de compras offline
- [ ] Backup offline
- [ ] Gráficos offline
- [ ] Traduções disponíveis offline

### Fase 8 — Refinamento mobile

- [ ] Cards responsivos
- [ ] Tabelas responsivas
- [ ] Modais responsivos
- [ ] Navegação mobile
- [ ] Filtros responsivos

### Fase 9 — Segurança e testes

- [ ] Revisão de privacidade
- [ ] Nenhum dado financeiro em logs
- [ ] Nenhum envio remoto de dados pessoais
- [x] Testes dos cálculos financeiros
- [x] Testes de backup
- [x] Testes de internacionalização

## Histórico de implementações

### 03/10/2026 — Base criptográfica do backup protegido por senha

- **Implementação:** tipos para backup criptografado, validação do formato
  externo, criptografia local com PBKDF2/SHA-256 e AES-GCM, descriptografia e
  validação do backup interno. A senha não é armazenada e a funcionalidade ainda
  não foi integrada à interface.
- **Arquivos:** `src/features/backup/backup.types.ts`,
  `src/features/backup/backup.crypto.ts`,
  `src/features/backup/backup.crypto.test.ts`, `README.md` e
  `IMPLEMENTAÇÃO.md`.
- **Testes:** `npm run test`, `npm run build` e `npm run lint` concluídos com
  sucesso.
- **Pendências:** adicionar fluxo visual para exportar e importar backup
  criptografado, incluindo mensagens de senha obrigatória, senha perdida e erro
  de descriptografia.

### 03/10/2026 — Testes de internacionalização

- **Implementação:** separação dos recursos de tradução para um módulo testável
  e criação de testes para garantir paridade de chaves entre PT-BR e EN,
  ausência de traduções vazias e presença de chaves críticas de navegação,
  backup, validação e preço.
- **Arquivos:** `src/i18n/resources.ts`, `src/i18n/index.ts`,
  `src/i18n/resources.test.ts`, `README.md` e `IMPLEMENTAÇÃO.md`.
- **Testes:** `npm run test`, `npm run build` e `npm run lint` concluídos com
  sucesso.
- **Pendências:** manter `resources.test.ts` atualizado sempre que novas chaves
  críticas forem adicionadas.

### 03/10/2026 — Testes do serviço de preço e CoinGecko

- **Implementação:** testes automatizados para o provider CoinGecko e para o
  serviço de preço/cache, cobrindo consulta por moeda, resposta HTTP inválida,
  payload inválido, armazenamento de snapshot, uso de cache fresco, fallback
  para cache antigo em erro do provider e deduplicação de requisições
  simultâneas.
- **Arquivos:** `src/services/bitcoinPrice/coinGeckoProvider.test.ts`,
  `src/services/bitcoinPrice/bitcoinPrice.service.test.ts` e
  `IMPLEMENTAÇÃO.md`.
- **Testes:** `npm run test`, `npm run build` e `npm run lint` concluídos com
  sucesso.
- **Pendências:** testar integração do preenchimento automático de preço no modal
  de compras em etapa futura.

### 03/10/2026 — Testes de backup com IndexedDB simulado

- **Implementação:** adição do `fake-indexeddb`, configuração de setup do
  Vitest, testes de integração do serviço de backup com banco local simulado,
  cobrindo criação de backup, restauração de dados e exportação CSV a partir das
  tabelas IndexedDB.
- **Arquivos:** `package.json`, `package-lock.json`, `vitest.config.ts`,
  `tsconfig.node.json`, `src/test/setup.ts`,
  `src/features/backup/backup.indexeddb.test.ts`, `README.md` e
  `IMPLEMENTAÇÃO.md`.
- **Testes:** `npm run test`, `npm run build` e `npm run lint` concluídos com
  sucesso.
- **Pendências:** adicionar testes para serviços de preço/cache, componentes
  React e internacionalização em etapas futuras.

### 03/10/2026 — Primeira rodada de testes automatizados

- **Implementação:** configuração do Vitest, scripts de teste, testes para
  cálculos financeiros, validação e resumo de backup, escape de células CSV e
  geração de CSV de compras e vendas. A geração de CSV foi separada em função
  pura para facilitar testes sem IndexedDB.
- **Arquivos:** `package.json`, `package-lock.json`,
  `src/utils/calculations.test.ts`,
  `src/features/backup/backup.service.ts`,
  `src/features/backup/backup.service.test.ts`, `README.md` e
  `IMPLEMENTAÇÃO.md`.
- **Testes:** `npm run test`, `npm run build` e `npm run lint` concluídos com
  sucesso.
- **Pendências:** testar serviços de preço e componentes React em etapa futura.

### 02/10/2026 — Exportação CSV de movimentações

- **Implementação:** exportação CSV de compras e vendas a partir da tela de
  backup, com colunas para tipo, data, valor, moeda, preço do Bitcoin,
  quantidade de BTC, taxa, nome da carteira, ID da carteira e observação. O CSV
  foi tratado como formato analítico, sem substituir o backup JSON.
- **Arquivos:** `src/features/backup/backup.service.ts`,
  `src/features/backup/BackupPage.tsx`, `src/App.css`, `src/i18n/index.ts`,
  `README.md` e `IMPLEMENTAÇÃO.md`.
- **Testes:** `npm run build` e `npm run lint` concluídos com sucesso.
- **Pendências:** adicionar testes automatizados para geração de CSV e manter o
  backup JSON como formato oficial de restauração.

### 02/10/2026 — Fase 6: Backup JSON

- **Implementação:** tela real de backup, aviso local-first, exportação JSON de
  configurações, carteiras e movimentações, importação de arquivo JSON,
  validação de formato e versão, resumo antes da restauração e confirmação antes
  de substituir os dados locais.
- **Arquivos:** `src/features/backup/`, `src/App.tsx`, `src/App.css`,
  `src/i18n/index.ts`, `README.md` e `IMPLEMENTAÇÃO.md`.
- **Testes:** `npm run build` e `npm run lint` concluídos com sucesso.
- **Pendências:** implementar backup criptografado, exportação CSV e testes
  automatizados para exportação/importação e validação de backups.

### 02/10/2026 — Consolidação da documentação de implementação

- **Implementação:** atualização do registro de implementação para refletir o
  estado real do projeto, incluindo resumo do que já foi feito, organização do
  código e pendências principais para manutenção futura.
- **Arquivos:** `IMPLEMENTAÇÃO.md` e `README.md`.
- **Testes:** não aplicável; alteração documental.
- **Pendências:** manter este arquivo atualizado a cada nova entrega.

### 25/09/2026 — Registro inicial

- **Implementação:** criação deste arquivo de acompanhamento.
- **Arquivos:** `IMPLEMENTAÇÃO.md`.
- **Testes:** não aplicável.
- **Pendências:** nenhuma no momento do registro; a execução foi iniciada em
  seguida.

### 25/09/2026 — Fundação da aplicação

- **Implementação:** criação do projeto React + TypeScript com Vite, layout
  inicial, navegação, dashboard, internacionalização e banco local IndexedDB.
- **Arquivos:** `package.json`, `src/App.tsx`, `src/App.css`, `src/index.css`,
  `src/main.tsx`, `src/database/db.ts`, `src/i18n/index.ts` e
  `src/types/index.ts`.
- **Testes:** `npm run build` concluído com sucesso.
- **Pendências:** criar o PWA, implementar troca persistente de tema, CRUD de
  carteiras, CRUD de compras e telas de backup.

### 25/09/2026 — Conclusão da fundação

- **Implementação:** configurações persistentes no Dexie, temas claro e escuro,
  manifest, ícone, service worker, cache offline e componentes base
  de interface.
- **Arquivos:** `src/database/settings.ts`, `src/components/ui/`, `public/`,
  `index.html`, `src/App.tsx`, `src/App.css` e `src/main.tsx`.
- **Testes:** `npm run build` e `npm run lint` concluídos com sucesso.
- **Pendências:** implementar CRUD de carteiras e compras; os dados de idioma,
  moeda e tema já possuem estrutura persistente local.

### 25/09/2026 — Simplificação dos temas

- **Implementação:** tema escuro definido como padrão inicial e alternância
  restrita aos temas escuro e claro.
- **Arquivos:** `src/types/index.ts`, `src/database/settings.ts`,
  `src/App.tsx` e `IMPLEMENTAÇÃO.md`.
- **Testes:** pendente de execução.
- **Pendências:** nenhuma relacionada aos temas.

### 25/09/2026 — Fase 2: CRUD de carteiras

- **Implementação:** serviço de carteiras, listagem responsiva, estado vazio,
  formulário compartilhado de criação e edição, validação do nome e confirmação
  de exclusão.
- **Arquivos:** `src/features/wallets/wallets.service.ts`,
  `src/features/wallets/WalletsPage.tsx`, `src/App.tsx`, `src/App.css` e
  `src/i18n/index.ts`.
- **Testes:** `npm run build` e `npm run lint` concluídos com sucesso.
- **Pendências:** definir o comportamento de compras associadas ao excluir uma
  carteira antes da implementação da Fase 3.

### 25/09/2026 — Fase 3: CRUD de compras

- **Implementação:** funções de cálculo, serviço de compras, criação, edição,
  listagem, exclusão, associação opcional a carteiras, taxas, observações e
  cálculo automático de BTC. A exclusão de carteiras com compras associadas foi
  bloqueada.
- **Arquivos:** `src/utils/calculations.ts`,
  `src/features/purchases/`, `src/features/wallets/`, `src/App.tsx`,
  `src/App.css` e `src/i18n/index.ts`.
- **Testes:** `npm run build` e `npm run lint` concluídos com sucesso.
- **Pendências:** implementar testes unitários dos cálculos e continuar com a
  Fase 4 — Dashboard.

### Requisito registrado — Preço do Bitcoin

- Integrar o **CoinGecko Free Tier** nas próximas etapas para capturar o preço
  atual do Bitcoin.
- A integração deverá utilizar a abstração `BitcoinPriceProvider` prevista na
  documentação.
- O preço, moeda, horário da consulta e provedor deverão ser armazenados
  localmente, sem enviar dados de compras, carteiras ou saldos.

### 25/09/2026 — Fase 4: Dashboard

- **Implementação:** cálculos financeiros centralizados, cards de indicadores,
  filtro por moeda, estados de dados vazios e preço indisponível, histórico de
  investimento e histórico de acumulação de BTC em gráficos SVG.
- **Arquivos:** `src/utils/calculations.ts`,
  `src/features/dashboard/DashboardPage.tsx`, `src/App.tsx`, `src/App.css` e
  `src/i18n/index.ts`.
- **Testes:** `npm run build` e `npm run lint` concluídos com sucesso.
- **Pendências:** conectar o CoinGecko Free Tier na Fase 5 para habilitar valor
  atual, resultado e percentual de resultado.

### 25/09/2026 — Fase 5: Preço atual do Bitcoin

- **Implementação:** abstração de provedor, integração com CoinGecko Free Tier,
  timeout, validação da resposta, cache local por moeda, fallback para o último
  preço disponível, atualização manual e integração do valor atual e resultado
  no dashboard.
- **Arquivos:** `src/services/bitcoinPrice/`, `src/database/db.ts`,
  `src/features/dashboard/DashboardPage.tsx`, `src/App.css`,
  `src/i18n/index.ts` e `.env.example`.
- **Testes:** `npm run build` e `npm run lint` concluídos com sucesso.
- **Pendências:** configurar `VITE_COINGECKO_API_KEY` quando uma chave do Demo
  API estiver disponível e adicionar testes do provedor e dos cálculos.

### 25/09/2026 — Otimização de preço e unidade do saldo

- **Implementação:** cache de cinco minutos, intervalo mínimo entre consultas,
  deduplicação de requisições simultâneas e preenchimento automático do preço no
  modal de compras. Os controles dos campos numéricos foram ocultados e BTC e
  satoshis foram unificados em um card com unidade persistida pelo usuário.
- **Arquivos:** `src/services/bitcoinPrice/bitcoinPrice.service.ts`,
  `src/features/dashboard/DashboardPage.tsx`,
  `src/features/purchases/PurchasesPage.tsx`, `src/database/settings.ts`,
  `src/types/index.ts`, `src/App.css` e `src/i18n/index.ts`.
- **Testes:** `npm run build` e `npm run lint` concluídos com sucesso.
- **Pendências:** adicionar testes automatizados para cache, preço no modal e
  preferência de unidade.

### 25/09/2026 — Compras e vendas

- **Implementação:** movimentações de compra e venda na mesma estrutura, cálculo
  do valor recebido em vendas, saldo líquido de BTC, investimento líquido,
  total vendido e atualização dos gráficos e do dashboard.
- **Arquivos:** `src/types/index.ts`, `src/database/db.ts`,
  `src/features/purchases/`, `src/utils/calculations.ts`,
  `src/features/dashboard/DashboardPage.tsx`, `src/App.css` e
  `src/i18n/index.ts`.
- **Testes:** `npm run build` e `npm run lint` concluídos com sucesso.
- **Pendências:** adicionar testes automatizados para movimentações e decidir se
  vendas acima do saldo devem gerar apenas aviso ou bloqueio.

## Modelo para novas implementações

Copiar este modelo para o início do histórico:

```markdown
### DD/MM/AAAA — Título da implementação

- **Implementação:** descrição objetiva do que foi feito.
- **Arquivos:** lista dos arquivos criados ou alterados.
- **Testes:** comandos ou verificações executados e seus resultados.
- **Pendências:** limitações, decisões futuras ou itens restantes.
```
