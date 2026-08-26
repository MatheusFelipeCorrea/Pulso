# 🌍 Módulo 05 — Viagens e Simulador de Moedas — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md) (achado T5 é diretamente relevante a este módulo)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-037–043), `RegrasDeNegocio.md` (RN-069–074).
> Código auditado: `api/src/services/{viagemService,moedaService}.js`, `api/src/providers/awesomeApiProvider.js`, `api/prisma/schema.prisma` (models `Viagem`, `DespesaViagem`, `ObservacaoViagem`).

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** módulo robusto e o mais funcionalmente rico auditado até agora (resolução de destino via GeoNames + catálogo + aeroportos, conversor de moedas com cruzamento de pares, histórico, favoritas). README marca **✅ 11/11**, confirmado. **Correções aplicadas (ago/2026):** RN-074 atualizada para 10 categorias; nota de cache RF-037 alinhada (5 min/memória); constraint `@unique` em `Viagem.metaId` + migration + mapeamento P2002 → 409. Pendente: performance na criação (capa assíncrona) e cache compartilhado (T5).

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-037 | Cotações atualizadas (USD, EUR, GBP, ARS etc.) | ✅ | Confirmado, `moedaService.listarCotacoes` via `awesomeApiProvider` |
| RF-038 | Converter BRL ↔ qualquer moeda | ✅ | Confirmado, `moedaService.converter` (`:58-102`) — trata inclusive conversão via par cruzado quando não há par direto com BRL |
| RF-039 | Gráfico de histórico de cotação | ✅ | Confirmado, `obterHistorico` (`:104-153`), inclusive mescla o ponto de hoje com a cotação ao vivo |
| RF-040 | Moedas favoritas | ✅ | Confirmado, `listarFavoritas`/`adicionarFavorita` (limite de 8, tratamento correto de `P2002` — ver ponto positivo na seção 3) |
| RF-041 | Criar planejamento de viagem (destino, moeda, data) | ✅ | Confirmado, `criarViagem` |
| RF-042 | Pretensões por categoria | ✅ | Confirmado — 10 categorias (RN-074 corrigida) |
| RF-043 | Custo total somando pretensões | ✅ | Não visto diretamente neste service (provavelmente em `mapViagem`/`viagemRepository`) — presumir correto, não auditado a fundo aqui |
| RF-044 | Converter custo total para BRL | ✅ | Idem — depende de `mapViagem`, não aprofundado |
| RF-045 | Editar/remover pretensões individuais | ✅ | Confirmado, `editarDespesa`/`excluirDespesa` |
| RF-046 | Múltiplas viagens simultâneas | ✅ | Confirmado — sem limite de quantidade |
| RF-047 | Vincular viagem a uma meta | ✅ | Confirmado — 1:1 com `@unique` em `metaId` (RN-072) |

**Fora da lista de RF, mas mencionado no README como entregue:** busca global de destinos (GeoNames), estimativas de passagem, Duffel/Amadeus opcional, observações — todos confirmados presentes no código (`resolverDestinoPayload`, `tripFlightPriceService`, `criarObservacao`).

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Criação de viagem depende de 2-3 chamadas externas em sequência/paralelo (GeoNames + imagem de capa + preço de passagem), sem indicação clara de qual etapa está lenta.** `criarViagem` chama `resolverDestinoPayload` (pode envolver `geonamesProvider.getPlace`) e depois `attachCoverImage` (busca de imagem externa) antes de gravar no banco. Se qualquer uma dessas APIs de terceiros estiver lenta, o `POST /viagens` inteiro fica lento — e não há timeout curto nem fallback assíncrono (ex.: salvar a viagem primeiro e buscar a capa depois, em background). Isso é uma tensão direta com RNF-001 (resposta em até 2s).
2. **Mensagens de erro de destino são um pouco técnicas para o usuário final.** Ex.: "O destino informado não corresponde à opção selecionada." (`viagemService.js:152,169`) — aparece quando o texto digitado diverge da opção clicada no autocomplete; para o usuário, isso pode parecer um bug de digitação em vez de uma explicação clara do que fazer (ex.: "Selecione o destino novamente na lista de sugestões").
3. **Sem aviso de fallback quando GeoNames não está configurado.** `listarDestinosViagem` retorna `source: 'catalog'` quando `geonamesProvider.hasCredentials()` é falso (`:499-500`) — o frontend recebe essa informação, mas não está claro (não auditado no frontend) se isso é comunicado ao usuário como "busca limitada a destinos populares" ou se passa despercebido, fazendo destinos menos comuns parecerem "não existir".

---

## 3. Diagnóstico de Regras de Negócio e Validações

### ✅ Corrigido — RN-074 (10 categorias)

`RegrasDeNegocio.md` RN-074 atualizada para refletir as 10 categorias em `viagemService.js:20-31`: Transporte, Hospedagem, Alimentação, Passeios, Compras, Documentação, Saúde, Emergências, Entretenimento, Outros.

### ✅ Corrigido — Vínculo 1:1 Viagem↔Meta (RN-072)

Migration `20260804130000_viagem_meta_id_unique` adiciona `@@unique([metaId])` no schema Prisma. `validarMetaVinculo` continua como checagem antecipada; violações de corrida retornam 409 via `mapPrismaUniqueViolation` (`meta_id`).

### ✅ Corrigido — Cache de cotação documentado (RF-037)

Nota do `Requisitos/Readme.md` alinhada: cache de **5 minutos por instância** (memória), não "cache diário". Em serverless o TTL efetivo pode ser menor (achado T5).

### Resiliência a estados extremos (demais itens verificados)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Data prevista da viagem no passado | Bloqueado (`validarDataFutura`) | ✅ |
| Moeda não suportada | Bloqueado (`validarMoeda`/`isSupportedCurrency`) tanto em viagens quanto no conversor | ✅ |
| Cotação indisponível (API externa fora do ar) | `obterCotacaoMoeda` retorna 502 explícito em vez de travar/500 genérico (`:510-516`) | ✅ Bom tratamento |
| Conversão com `de === para` | Tratada como caso especial, taxa 1.0, sem chamar a API externa à toa (`moedaService.js:71-80`) | ✅ Boa otimização |
| Adicionar moeda favorita já existente (corrida) | `P2002` do Prisma **é tratado** e convertido em erro 409 amigável (`moedaService.js:181-185`) | ✅ |
| Vincular mesma meta a duas viagens (corrida) | `@unique(metaId)` + 409 amigável | ✅ |
| Excluir pretensão/observação inexistente | 404 tratado corretamente em todos os casos | ✅ |
| Link de observação inválido (URL malformada) | Validado via `new URL()` com try/catch (`validarObservacao`) | ✅ |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- Nenhum RF novo relevante identificado — o módulo já é maduro; os ajustes propostos abaixo são de robustez, não de escopo.

### Não funcionais

- **RNF-NOVO-E1 (Performance)** — Desacoplar a busca de imagem de capa (`attachCoverImage`) do fluxo síncrono de criação/edição de viagem: gravar a viagem imediatamente e enriquecer a capa em background (job ou próxima leitura), evitando que uma API de imagem lenta atrase o `POST/PATCH /viagens`.
- ~~**RNF-NOVO-E2 (Integridade de dados)**~~ — ✅ `@unique` em `Viagem.metaId` (migration `20260804130000`).
- ~~**RNF-NOVO-E3 (Documentação)**~~ — ✅ RN-074 atualizada (10 categorias).
- ~~**RNF-NOVO-E4 (Correção de doc)**~~ — ✅ Nota RF-037 corrigida (5 min/memória).

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status | Esforço |
|---|---|---|---|
| 1 | Constraint única `Viagem.metaId` (RNF-NOVO-E2) | ✅ Feito | — |
| 2 | Corrigir documentação RN-074 e cache RF-037 (RNF-NOVO-E3/E4) | ✅ Feito | — |
| 3 | Mover busca de imagem de capa para background (RNF-NOVO-E1) | 🟢 Pendente | Médio |
| 4 | Cache compartilhado de cotações (achado T5) | 🟢 Pendente | A tratar globalmente |

> **Deploy:** rodar `prisma migrate deploy` para aplicar `20260804130000_viagem_meta_id_unique`.

---

## ❓ Perguntas clarificadoras

1. ~~TTL de 5 minutos vs cache diário~~ — **Resolvido:** documentação alinhada ao código (5 min); aumentar TTL ou cache externo fica ligado a T5.
2. Existe algum plano de adicionar uma camada de cache compartilhado (Redis/Upstash) já no roadmap de infraestrutura, ou isso ainda não foi discutido?

---

*Próximo módulo sugerido: 06 — Insights e Chatbot.*
