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

**Estado atual:** Fases 1 a 5 implementadas; compras/vendas e dashboard
funcionais; backup, testes, refinamento mobile e validação offline ainda
pendentes.

**Última atualização:** 02/10/2026

A aplicação já possui base técnica local-first, CRUD de carteiras, registro de
compras e vendas, dashboard com métricas financeiras e integração de preço do
Bitcoin via CoinGecko. A área de backup ainda é placeholder.

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

Ainda não foram implementados backup/importação, exportação CSV, testes
automatizados, refinamento mobile completo e validação offline final.

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

- Implementar exportação e importação de backup JSON.
- Validar formato e versão dos backups antes da restauração.
- Exibir resumo antes de restaurar backup.
- Implementar backup criptografado.
- Implementar exportação CSV.
- Criar testes automatizados para cálculos financeiros.
- Criar testes para preço, cache, CoinGecko e preenchimento automático no modal.
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

- [ ] Exportação de backup JSON
- [ ] Importação de backup JSON
- [ ] Validação do formato
- [ ] Validação da versão
- [ ] Resumo antes da restauração
- [ ] Backup criptografado
- [ ] Exportação CSV

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
- [ ] Testes dos cálculos financeiros
- [ ] Testes de backup
- [ ] Testes de internacionalização

## Histórico de implementações

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
