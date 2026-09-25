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

**Estado atual:** Fundação concluída

**Última atualização:** 25/09/2026

A fundação inicial da aplicação foi criada. As áreas de carteiras, compras e
backup ainda são placeholders.

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

- [ ] Criar carteira
- [ ] Listar carteiras
- [ ] Editar carteira
- [ ] Excluir carteira
- [ ] Observação da carteira
- [ ] Endereço opcional

### Fase 3 — Compras

- [ ] Criar compra
- [ ] Listar compras
- [ ] Editar compra
- [ ] Excluir compra
- [ ] Associar carteira
- [ ] Calcular BTC
- [ ] Registrar taxa
- [ ] Adicionar observação

### Fase 4 — Dashboard

- [ ] Total investido
- [ ] Total de BTC
- [ ] Total em satoshis
- [ ] Preço médio
- [ ] Valor atual
- [ ] Resultado
- [ ] Gráfico de investimento
- [ ] Gráfico de acumulação

### Fase 5 — Preço atual

- [ ] Abstração de provedor de preço
- [ ] Consulta de preço online
- [ ] Armazenamento local do último preço
- [ ] Atualização manual de preço

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

## Modelo para novas implementações

Copiar este modelo para o início do histórico:

```markdown
### DD/MM/AAAA — Título da implementação

- **Implementação:** descrição objetiva do que foi feito.
- **Arquivos:** lista dos arquivos criados ou alterados.
- **Testes:** comandos ou verificações executados e seus resultados.
- **Pendências:** limitações, decisões futuras ou itens restantes.
```
