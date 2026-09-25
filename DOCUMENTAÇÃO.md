# LocalSats — Plano de Execução

## 1. Visão do produto

O **LocalSats** será uma aplicação web progressiva (PWA) para acompanhamento de compras recorrentes de Bitcoin.

O objetivo principal é permitir que o usuário registre seu histórico de DCA, acompanhe evolução patrimonial, organize compras por carteira e mantenha seus dados sob seu próprio controle.

O princípio central do produto é:

**Your Bitcoin. Your data.**  
**Seu Bitcoin. Seus dados.**

O LocalSats não dependerá de contas, login ou banco de dados no servidor.

Os dados pessoais e financeiros do usuário permanecerão armazenados localmente no dispositivo.

---

# 2. Princípios do projeto

## 2.1 Local-first

Todos os dados do usuário devem permanecer no dispositivo.

O aplicativo não deve enviar para servidores próprios:

- histórico de compras;
- valores investidos;
- quantidade de Bitcoin;
- carteiras;
- endereços Bitcoin;
- observações;
- configurações pessoais.

O servidor será responsável apenas por distribuir os arquivos estáticos da aplicação.

---

## 2.2 Sem cadastro

O LocalSats não terá:

- login;
- senha de usuário;
- conta;
- e-mail;
- perfil remoto;
- sincronização obrigatória.

O usuário deve conseguir abrir a aplicação e começar a usar imediatamente.

---

## 2.3 Privacidade por padrão

Nenhum endereço Bitcoin deverá ser obrigatório.

Uma carteira poderá ser simplesmente uma categoria local.

Exemplo:

- Cold Wallet
- Sparrow
- BlueWallet
- Exchange
- Wallet DCA

Consultas on-chain serão opcionais e deverão deixar claro quando dados forem enviados a um serviço externo.

---

## 2.4 Portabilidade

O usuário deve conseguir exportar todos os seus dados para um arquivo local.

O backup deve permitir restaurar completamente o estado do LocalSats.

A aplicação nunca deve ser o único lugar onde os dados podem existir.

---

# 3. Escopo inicial

A primeira versão deverá conter quatro áreas principais:

1. Dashboard
2. Compras
3. Carteiras
4. Backup e configurações

A aplicação será inicialmente disponível em:

- English — EN
- Português do Brasil — PT-BR

Moedas iniciais:

- BRL
- USD

---

# 4. Stack recomendada

## Frontend

- React
- TypeScript
- Vite

O Vite é adequado para o projeto porque permite uma aplicação completamente estática, rápida e simples de hospedar.

---

## Estilização

Sugestão:

- Tailwind CSS

ou

- CSS Modules

Para o MVP, Tailwind pode acelerar bastante o desenvolvimento da interface.

---

## Internacionalização

Utilizar:

- i18next
- react-i18next

Estrutura sugerida:

```text
src/
  i18n/
    en/
      common.json
      dashboard.json
      purchases.json
      wallets.json
      backup.json

    pt-BR/
      common.json
      dashboard.json
      purchases.json
      wallets.json
      backup.json
```

Nenhum texto visível ao usuário deverá ficar hardcoded nos componentes.

---

# 5. Persistência local

## IndexedDB

IndexedDB será o armazenamento principal.

Ela deverá armazenar:

- compras;
- carteiras;
- configurações;
- versão do schema;
- metadados de backup.

Pode ser utilizada uma biblioteca como:

```text
Dexie.js
```

Isso simplifica bastante o uso de IndexedDB.

---

## localStorage

Usar apenas para informações simples, como:

- idioma selecionado;
- tema;
- moeda preferida;
- último menu aberto.

Os dados financeiros principais devem ficar no IndexedDB.

---

# 6. Modelo de dados

## Carteira

```ts
type Wallet = {
  id: string;
  name: string;
  address?: string;
  xpub?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
```

Endereço e XPUB serão opcionais.

---

## Compra

```ts
type DcaPurchase = {
  id: string;

  date: string;

  fiatAmount: number;
  fiatCurrency: "BRL" | "USD";

  btcPrice: number;
  btcAmount: number;

  feeFiat?: number;

  walletId?: string;

  notes?: string;

  createdAt: string;
  updatedAt: string;
};
```

---

## Configurações

```ts
type UserSettings = {
  language: "en" | "pt-BR";

  currency: "BRL" | "USD";

  theme:
    | "light"
    | "dark"
    | "system";

  btcDisplay:
    | "btc"
    | "sats";
};
```

---

# 7. Dashboard

O Dashboard deverá responder rapidamente três perguntas:

1. Quanto investi?
2. Quanto Bitcoin acumulei?
3. Quanto vale hoje?

---

## Cards principais

Exibir:

### Total investido

Exemplo:

```text
R$ 24.000,00
```

### BTC acumulado

```text
0.07458321 BTC
```

Também:

```text
7,458,321 sats
```

### Valor atual

```text
R$ 28.920,00
```

### Resultado

```text
+ R$ 4.920
+20,50%
```

### Preço médio

```text
R$ 321.788 / BTC
```

### Preço atual do Bitcoin

```text
R$ 387.760
```

---

# 8. Métricas

Calcular automaticamente:

## Total investido

Soma de todos os valores utilizados nas compras.

---

## BTC acumulado

Soma de:

```text
btcAmount
```

---

## Preço médio de aquisição

Fórmula:

```text
totalInvested / totalBTC
```

Pode-se decidir posteriormente se taxas entram ou não nesse cálculo.

---

## Valor atual

```text
totalBTC × currentBTCPrice
```

---

## Resultado financeiro

```text
currentValue - totalInvested
```

---

## Resultado percentual

```text
(currentValue / totalInvested - 1) × 100
```

---

# 9. Gráficos

O Dashboard deverá inicialmente possuir dois gráficos.

## Evolução patrimonial

Comparar:

- capital investido acumulado;
- valor da posição.

Eixo horizontal:

```text
tempo
```

Eixo vertical:

```text
valor em moeda fiduciária
```

---

## Acumulação de Bitcoin

Mostrar crescimento de:

```text
BTC acumulado
```

ou:

```text
sats acumulados
```

---

# 10. Área de compras

Tela:

```text
Compras
```

ou:

```text
Purchases
```

---

## Tabela principal

Colunas:

```text
Data
Investido
Preço BTC
BTC comprado
Taxa
Carteira
Valor atual
Resultado
```

---

## Filtros

Adicionar:

- carteira;
- ano;
- período;
- busca.

Posteriormente:

- moeda;
- resultado positivo/negativo.

---

# 11. Nova compra

O formulário deverá abrir preferencialmente em um painel lateral ou modal.

Campos:

```text
Data
Valor investido
Preço do Bitcoin
Quantidade de BTC
Taxas
Carteira
Observação
```

---

## Automatizações

Quando o usuário preencher:

```text
valor investido
```

e:

```text
preço BTC
```

o aplicativo poderá calcular:

```text
quantidade de BTC
```

automaticamente.

Também deverá ser possível fazer o contrário.

---

# 12. Carteiras

Carteiras serão um conceito interno do LocalSats.

Uma compra poderá ser associada a uma carteira através de:

```text
walletId
```

---

## Informações exibidas

Cada carteira poderá mostrar:

```text
Nome
BTC acumulado
Valor atual
Total investido
Preço médio
Quantidade de compras
Resultado
```

---

## Exemplo

```text
Cold Wallet

0.04120500 BTC
R$ 15.978

Investido:
R$ 13.100

Preço médio:
R$ 318.420 / BTC

Resultado:
+21,97%
```

---

# 13. Endereço e XPUB

Esses campos serão opcionais.

Por padrão, a carteira poderá existir apenas como categoria.

Exemplo:

```text
Nome:
Cold Wallet
```

sem nenhum endereço Bitcoin associado.

---

# 14. Níveis de acompanhamento de carteira

No futuro poderão existir três modos.

## Modo privado

Padrão.

Nenhuma consulta externa.

A carteira funciona apenas como categoria.

---

## Modo Explorer

O usuário poderá opcionalmente fornecer:

- endereço;
- XPUB.

O LocalSats poderá consultar um explorador externo.

Antes disso, deverá existir um aviso de privacidade.

---

## Modo Node próprio

Versão futura.

Permitir conexão a infraestrutura configurada pelo usuário.

Por exemplo:

```text
Bitcoin Core
Electrum
Esplora
```

Esse modo será voltado para usuários avançados.

---

# 15. Backup

O backup é uma funcionalidade central do produto.

O usuário deve ser frequentemente lembrado de que não existe recuperação através de servidor.

Mensagem sugerida:

```text
Seus dados ficam somente neste dispositivo.

O LocalSats não possui uma cópia dos seus dados.

Faça backups regularmente.
```

---

# 16. Formato de backup

O formato principal deverá ser JSON.

Exemplo:

```json
{
  "format": "localsats-backup",
  "version": 1,
  "exportedAt": "2026-09-25T12:00:00Z",

  "settings": {
    "language": "pt-BR",
    "currency": "BRL"
  },

  "wallets": [],

  "purchases": []
}
```

---

## Versionamento

Sempre incluir:

```text
version
```

Isso permitirá migrar backups antigos caso o modelo de dados seja alterado.

---

# 17. Backup criptografado

Após o backup simples estar funcionando, implementar backup protegido por senha.

Utilizar:

```text
Web Crypto API
```

Todo o processo deverá acontecer localmente.

A senha nunca deverá sair do navegador.

---

# 18. Importação

O usuário deverá conseguir selecionar um backup.

Antes de restaurar, a aplicação deverá:

1. validar formato;
2. verificar versão;
3. verificar integridade;
4. mostrar resumo;
5. solicitar confirmação.

Exemplo:

```text
Este backup contém:

124 compras
3 carteiras
Configurações

Deseja restaurar?
```

---

# 19. Exportação CSV

Separada do backup.

Objetivo:

permitir análise em:

- Excel;
- LibreOffice;
- Google Sheets;
- ferramentas próprias.

CSV não será considerado formato principal de backup.

---

# 20. Internacionalização

Desde o primeiro commit, toda a interface deve estar preparada para múltiplos idiomas.

Idiomas iniciais:

```text
en
pt-BR
```

---

## Idioma padrão

Fluxo:

1. verificar preferência salva;
2. se não existir, detectar navegador;
3. se idioma for português brasileiro, utilizar PT-BR;
4. caso contrário, utilizar EN.

Fallback:

```text
EN
```

---

# 21. Idioma e moeda independentes

Idioma não deverá determinar moeda.

Exemplos válidos:

```text
Interface: EN
Currency: BRL
```

ou:

```text
Interface: PT-BR
Currency: USD
```

---

# 22. Formatação

Utilizar:

```text
Intl.NumberFormat
```

para moedas.

Utilizar:

```text
Intl.DateTimeFormat
```

para datas.

---

## Bitcoin

BTC deverá ser exibido com até oito casas:

```text
0.01234567 BTC
```

Satoshis:

```text
1,234,567 sats
```

---

# 23. Navegação desktop

Menu principal:

```text
LocalSats

Dashboard
Purchases
Wallets
Backup
```

No lado direito:

```text
Language
Currency
Theme
```

---

# 24. Navegação mobile

Utilizar menu inferior.

Exemplo:

```text
Home
Purchases
Wallets
More
```

Botão central ou flutuante:

```text
+
```

para adicionar compra.

---

# 25. Aparência

Direção visual:

- minimalista;
- limpa;
- Bitcoin-native;
- sem aparência de banco;
- sem excesso de gráficos;
- bastante espaço em branco.

---

## Cores

Base:

- branco/cinza no modo claro;
- preto/cinza escuro no modo escuro.

Bitcoin orange deve ser utilizado para:

- ações principais;
- logo;
- destaques.

Verde/vermelho apenas para:

- valorização;
- desvalorização.

---

# 26. Temas

Implementar:

```text
Light
Dark
System
```

Salvar escolha localmente.

---

# 27. PWA

O LocalSats deverá funcionar como Progressive Web App.

Implementar:

- manifest;
- ícones;
- service worker;
- instalação;
- funcionamento offline.

Depois que a aplicação estiver carregada uma vez, operações locais deverão continuar funcionando sem internet.

---

# 28. Comportamento offline

Sem internet o usuário ainda deverá conseguir:

- abrir o LocalSats;
- registrar compras;
- editar compras;
- criar carteiras;
- consultar histórico;
- visualizar métricas baseadas no último preço disponível;
- fazer backup.

Recursos dependentes de internet deverão indicar estado offline.

---

# 29. Preço do Bitcoin

No MVP, poderão existir duas fontes.

## Preço online

Buscar através de API pública.

Guardar localmente:

```text
price
currency
timestamp
provider
```

---

## Preço manual

O usuário poderá atualizar manualmente.

Isso preserva a possibilidade de funcionamento totalmente offline.

---

# 30. Privacidade da consulta de preço

Buscar apenas preço BTC não exige enviar os dados do usuário.

Ainda assim, a aplicação deverá evitar qualquer envio desnecessário de:

- compras;
- saldo;
- carteiras;
- endereços.

---

# 31. Estrutura sugerida do código

```text
src/

  app/

  components/
    ui/
    layout/

  features/

    dashboard/
      components/
      hooks/
      services/

    purchases/
      components/
      services/
      types/

    wallets/
      components/
      services/
      types/

    backup/
      services/

    settings/

  database/
    db.ts
    schema.ts
    migrations/

  i18n/
    en/
    pt-BR/

  services/
    bitcoinPrice/

  utils/
    bitcoin.ts
    currency.ts
    dates.ts
    calculations.ts

  types/

  App.tsx
  main.tsx
```

---

# 32. Fase 1 — Fundação

Objetivo:

criar a base técnica.

Implementar:

- projeto React + TypeScript;
- Vite;
- estrutura de pastas;
- Tailwind ou sistema visual;
- roteamento;
- IndexedDB;
- Dexie;
- i18n;
- PT-BR;
- EN;
- tema claro/escuro;
- configuração PWA.

Resultado:

aplicação instalada e funcionando localmente.

---

# 33. Fase 2 — Carteiras

Criar CRUD de carteiras.

Funcionalidades:

- adicionar;
- editar;
- excluir;
- listar.

Campos iniciais:

```text
Nome
Observação
Endereço opcional
```

XPUB poderá entrar posteriormente.

---

# 34. Fase 3 — Compras

Implementar CRUD completo.

Permitir:

- adicionar compra;
- editar compra;
- excluir compra;
- associar carteira;
- calcular BTC;
- registrar taxa;
- adicionar observação.

---

# 35. Fase 4 — Dashboard

Implementar cálculos.

Cards:

- investido;
- BTC;
- sats;
- preço médio;
- valor atual;
- resultado.

Criar também:

- gráfico de investimento;
- gráfico de acumulação.

---

# 36. Fase 5 — Preço atual

Criar abstração:

```ts
interface BitcoinPriceProvider {
  getCurrentPrice(
    currency: "BRL" | "USD"
  ): Promise<number>;
}
```

Assim será possível trocar o provedor sem alterar o restante da aplicação.

---

# 37. Fase 6 — Backup

Implementar:

```text
Export backup
Import backup
```

Depois:

```text
Encrypted backup
```

---

# 38. Fase 7 — PWA offline

Testar funcionamento completamente offline.

Verificar:

- carregamento;
- IndexedDB;
- novas compras;
- edição;
- backup;
- gráficos;
- traduções.

---

# 39. Fase 8 — Refinamento mobile

Adaptar:

- cards;
- tabelas;
- modais;
- navegação;
- filtros.

Em telas pequenas, tabela de compras poderá virar cards.

---

# 40. Fase 9 — Segurança

Executar revisão específica.

Garantir:

- nenhum dado financeiro em logs;
- nenhum analytics invasivo;
- nenhum endereço Bitcoin enviado automaticamente;
- nenhum dado armazenado remotamente;
- backups validados;
- criptografia implementada corretamente.

---

# 41. Analytics

No MVP, recomendação:

**não utilizar analytics tradicional.**

Caso métricas anônimas sejam adicionadas no futuro, deverão ser:

- opcionais;
- sem dados financeiros;
- sem carteira;
- sem endereço Bitcoin.

---

# 42. Telemetria

Por padrão:

```text
OFF
```

---

# 43. Testes

Implementar testes para cálculos financeiros.

Especialmente:

```text
totalInvested
totalBTC
averagePrice
currentValue
profit
profitPercentage
```

Esses cálculos devem ter cobertura alta.

---

# 44. Testes de backup

Criar testes para:

- exportar;
- importar;
- backup vazio;
- dados inválidos;
- versão antiga;
- campos ausentes;
- backup criptografado.

---

# 45. Testes de internacionalização

Verificar que nenhuma tela apresente:

```text
translation.key.name
```

ao usuário.

Também testar:

- datas;
- números;
- moeda;
- fallback.

---

# 46. MVP 1.0

A versão 1.0 poderá ser considerada pronta quando o usuário conseguir:

1. instalar o LocalSats;
2. escolher EN/PT-BR;
3. selecionar BRL/USD;
4. criar carteiras;
5. registrar compras;
6. editar e excluir compras;
7. associar compra a uma carteira;
8. acompanhar BTC acumulado;
9. ver total investido;
10. ver preço médio;
11. ver valor atual;
12. ver resultado percentual;
13. acompanhar gráfico;
14. exportar backup;
15. restaurar backup;
16. utilizar offline.

---

# 47. Funcionalidades pós-MVP

Depois da versão 1.0 poderão ser adicionadas:

## Metas

Exemplo:

```text
Goal:
0.1 BTC
```

Progresso:

```text
0.074 BTC / 0.1 BTC
74%
```

---

## DCA planejado

Exemplo:

```text
R$ 500 por semana
```

Comparar planejado versus realizado.

---

## Projeções

Simular:

```text
R$ 500/mês
R$ 1.000/mês
```

sem apresentar previsão de preço como certeza.

---

## Análise por carteira

Comparar:

- BTC;
- valor;
- preço médio;
- resultado.

---

## Tags

Exemplo:

```text
DCA
Lump Sum
Mining
Salary
Gift
```

---

## Importação CSV

Permitir trazer histórico de outras ferramentas.

---

## Múltiplas moedas

Adicionar futuramente:

```text
EUR
GBP
CAD
AUD
JPY
```

---

## Novos idiomas

Estrutura preparada para:

```text
ES
DE
FR
IT
```

---

# 48. Integração on-chain futura

Manter fora do MVP.

Posteriormente:

```text
Address tracking
XPUB tracking
Electrum
Esplora
Bitcoin Core
```

A privacidade deve continuar sendo prioridade.

---

# 49. Roadmap recomendado

## Etapa 1

Base técnica + i18n + PWA.

## Etapa 2

Carteiras.

## Etapa 3

Compras.

## Etapa 4

Cálculos.

## Etapa 5

Dashboard.

## Etapa 6

Preço BTC.

## Etapa 7

Backup.

## Etapa 8

Offline e PWA.

## Etapa 9

Mobile.

## Etapa 10

Segurança e testes.

## Etapa 11

Release MVP.

---

# 50. Ordem de desenvolvimento recomendada

Não começar pelo Dashboard.

A melhor ordem é:

```text
Database
    ↓
Wallets
    ↓
Purchases
    ↓
Calculations
    ↓
Dashboard
    ↓
Backup
    ↓
PWA
```

O Dashboard depende de praticamente todo o restante.

---

# 51. Decisão arquitetural principal

A regra mais importante do projeto deve permanecer:

> O LocalSats deve continuar sendo útil mesmo se o servidor desaparecer.

O servidor entrega o aplicativo.

O usuário possui os dados.

O navegador executa os cálculos.

O backup pertence ao usuário.

Essa filosofia deve orientar todas as futuras funcionalidades.

---

# 52. Definição resumida do produto

**LocalSats** é um tracker privado de DCA em Bitcoin, local-first e não custodial.

Ele permite registrar compras, organizar Bitcoin por carteira, acompanhar evolução e valorização e manter backups sob controle do próprio usuário.

Sem conta.

Sem banco de dados remoto.

Sem custódia.

Sem dependência do LocalSats para recuperar os próprios dados.

**Your Bitcoin. Your data.**