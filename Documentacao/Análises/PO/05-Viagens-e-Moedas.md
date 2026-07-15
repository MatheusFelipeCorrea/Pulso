# 🌍 Módulo 05 — Viagens e Simulador de Moedas — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md) (achado T5 é diretamente relevante a este módulo)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-033–043), `RegrasDeNegocio.md` (RN-069–074).
> Código auditado: `api/src/services/{viagemService,moedaService}.js`, `api/src/providers/awesomeApiProvider.js`, `api/prisma/schema.prisma` (models `Viagem`, `DespesaViagem`, `ObservacaoViagem`).

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** módulo robusto e o mais funcionalmente rico auditado até agora (resolução de destino via GeoNames + catálogo + aeroportos, conversor de moedas com cruzamento de pares, histórico, favoritas). README marca **✅ 11/11**, confirmado. Os achados aqui são mais sutis que nos módulos anteriores: (1) o cache de cotação é de **5 minutos em memória de processo**, não "cache diário" como o README alega — e, por rodar em serverless (achado T5), provavelmente é bem menos eficaz do que os dois documentos sugerem; (2) a regra RN-074 (6 categorias de pretensão) está **desatualizada** — o código já suporta 10 categorias; (3) o vínculo 1:1 Viagem↔Meta (RN-072) é garantido só por checagem de aplicação, sem constraint única no banco — mesma classe de fragilidade de concorrência encontrada no cadastro de usuário (Módulo 01).

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-033 | Cotações atualizadas (USD, EUR, GBP, ARS etc.) | ✅ | Confirmado, `moedaService.listarCotacoes` via `awesomeApiProvider` |
| RF-034 | Converter BRL ↔ qualquer moeda | ✅ | Confirmado, `moedaService.converter` (`:58-102`) — trata inclusive conversão via par cruzado quando não há par direto com BRL |
| RF-035 | Gráfico de histórico de cotação | ✅ | Confirmado, `obterHistorico` (`:104-153`), inclusive mescla o ponto de hoje com a cotação ao vivo |
| RF-036 | Moedas favoritas | ✅ | Confirmado, `listarFavoritas`/`adicionarFavorita` (limite de 8, tratamento correto de `P2002` — ver ponto positivo na seção 3) |
| RF-037 | Criar planejamento de viagem (destino, moeda, data) | ✅ | Confirmado, `criarViagem` |
| RF-038 | Pretensões por categoria | ✅ | Confirmado — mas ver gap de documentação (RN-074) na seção 3 |
| RF-039 | Custo total somando pretensões | ✅ | Não visto diretamente neste service (provavelmente em `mapViagem`/`viagemRepository`) — presumir correto, não auditado a fundo aqui |
| RF-040 | Converter custo total para BRL | ✅ | Idem — depende de `mapViagem`, não aprofundado |
| RF-041 | Editar/remover pretensões individuais | ✅ | Confirmado, `editarDespesa`/`excluirDespesa` |
| RF-042 | Múltiplas viagens simultâneas | ✅ | Confirmado — sem limite de quantidade |
| RF-043 | Vincular viagem a uma meta | ✅ | Confirmado, com checagem de 1:1 (ver achado seção 3) |

**Fora da lista de RF, mas mencionado no README como entregue:** busca global de destinos (GeoNames), estimativas de passagem, Duffel/Amadeus opcional, observações — todos confirmados presentes no código (`resolverDestinoPayload`, `tripFlightPriceService`, `criarObservacao`).

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Criação de viagem depende de 2-3 chamadas externas em sequência/paralelo (GeoNames + imagem de capa + preço de passagem), sem indicação clara de qual etapa está lenta.** `criarViagem` chama `resolverDestinoPayload` (pode envolver `geonamesProvider.getPlace`) e depois `attachCoverImage` (busca de imagem externa) antes de gravar no banco. Se qualquer uma dessas APIs de terceiros estiver lenta, o `POST /viagens` inteiro fica lento — e não há timeout curto nem fallback assíncrono (ex.: salvar a viagem primeiro e buscar a capa depois, em background). Isso é uma tensão direta com RNF-001 (resposta em até 2s).
2. **Mensagens de erro de destino são um pouco técnicas para o usuário final.** Ex.: "O destino informado não corresponde à opção selecionada." (`viagemService.js:152,169`) — aparece quando o texto digitado diverge da opção clicada no autocomplete; para o usuário, isso pode parecer um bug de digitação em vez de uma explicação clara do que fazer (ex.: "Selecione o destino novamente na lista de sugestões").
3. **Sem aviso de fallback quando GeoNames não está configurado.** `listarDestinosViagem` retorna `source: 'catalog'` quando `geonamesProvider.hasCredentials()` é falso (`:499-500`) — o frontend recebe essa informação, mas não está claro (não auditado no frontend) se isso é comunicado ao usuário como "busca limitada a destinos populares" ou se passa despercebido, fazendo destinos menos comuns parecerem "não existir".

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado — RN-074 desatualizada (6 categorias documentadas vs. 10 implementadas)

`RegrasDeNegocio.md` (RN-074): *"Pretensões podem ser de 6 categorias: Transporte, Hospedagem, Alimentação, Passeios, Compras, Outros."* O código (`viagemService.js:20-31`, `CATEGORIAS_DESPESA`) já suporta **10**: as 6 originais mais `DOCUMENTACAO`, `SAUDE`, `EMERGENCIAS`, `ENTRETENIMENTO`. Não é um bug — é uma melhoria não documentada. Baixa severidade, mas deve ser corrigido no documento de regras para não gerar confusão em futuras auditorias/onboarding de devs.

### Achado — Vínculo 1:1 Viagem↔Meta sem constraint de banco

`validarMetaVinculo` (`viagemService.js:65-79`) impede vincular a mesma meta a duas viagens fazendo um `SELECT` (`viagemRepository.buscarPorMetaId`) antes do `INSERT`/`UPDATE`. O schema **não tem `@unique` em `Viagem.metaId`** — a regra de negócio (RN-072, relação 1:1) existe **apenas na camada de aplicação**, checada de forma check-then-act (mesma classe de problema do cadastro de usuário no Módulo 01: duas requisições simultâneas de "vincular meta X à viagem A" e "vincular meta X à viagem B" podem passar ambas na checagem antes de qualquer uma gravar). Baixa probabilidade de ocorrer na prática (ação pouco frequente, de um único usuário, dificilmente disparada 2x em paralelo), mas é uma regra de negócio importante (RN-072) sem garantia estrutural no banco.

### Achado — Cache de cotação: 5 minutos em memória, não "cache diário"

Ver detalhe em [00-Achados-Transversais.md § T5](./00-Achados-Transversais.md#t5--caches-e-contadores-em-memória-mapmemorystore-não-sobrevivem-entre-invocações-serverless). `awesomeApiProvider.js:5` define `CACHE_TTL_MS = 5 * 60 * 1000` (5 minutos) — a nota do README (`Requisitos/Readme.md:142`) fala em "cache diário". Isso é uma divergência de fato entre a intenção documentada e o valor real configurado, agravada pelo fato de o cache ser em memória de processo (T5) — ou seja, na prática pode ser efetivamente **menor que 5 minutos** em produção serverless, não maior.

### Resiliência a estados extremos (demais itens verificados)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Data prevista da viagem no passado | Bloqueado (`validarDataFutura`) | ✅ |
| Moeda não suportada | Bloqueado (`validarMoeda`/`isSupportedCurrency`) tanto em viagens quanto no conversor | ✅ |
| Cotação indisponível (API externa fora do ar) | `obterCotacaoMoeda` retorna 502 explícito em vez de travar/500 genérico (`:510-516`) | ✅ Bom tratamento |
| Conversão com `de === para` | Tratada como caso especial, taxa 1.0, sem chamar a API externa à toa (`moedaService.js:71-80`) | ✅ Boa otimização |
| Adicionar moeda favorita já existente (corrida) | `P2002` do Prisma **é tratado** e convertido em erro 409 amigável (`moedaService.js:181-185`) | ✅ **Contraste positivo** com o gap de concorrência do cadastro de usuário (Módulo 01) — aqui a mesma classe de problema foi tratada corretamente |
| Excluir pretensão/observação inexistente | 404 tratado corretamente em todos os casos (`editarDespesa`, `excluirDespesa`, `editarObservacao`, `excluirObservacao`) | ✅ |
| Link de observação inválido (URL malformada) | Validado via `new URL()` com try/catch (`validarObservacao`) | ✅ |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- Nenhum RF novo relevante identificado — o módulo já é maduro; os ajustes propostos abaixo são de robustez, não de escopo.

### Não funcionais

- **RNF-NOVO-E1 (Performance)** — Desacoplar a busca de imagem de capa (`attachCoverImage`) do fluxo síncrono de criação/edição de viagem: gravar a viagem imediatamente e enriquecer a capa em background (job ou próxima leitura), evitando que uma API de imagem lenta atrase o `POST/PATCH /viagens`.
- **RNF-NOVO-E2 (Integridade de dados)** — Adicionar `@unique` em `Viagem.metaId` (ou um índice único parcial "uma meta só pode estar em uma viagem ativa") para que RN-072 seja garantida pelo banco, não só pela aplicação.
- **RNF-NOVO-E3 (Documentação)** — Atualizar RN-074 para refletir as 10 categorias reais de pretensão.
- **RNF-NOVO-E4 (Correção de doc)** — Corrigir a nota de `Requisitos/Readme.md` sobre RF-033: o cache real é de 5 minutos (em memória, por instância), não diário — e avaliar se 5 minutos é de fato a intenção ou se o TTL deveria ser aumentado para reduzir chamadas à AwesomeAPI em produção serverless (ligado a T5).

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟡 Adicionar constraint única para `Viagem.metaId` (RNF-NOVO-E2) | Fecha a lacuna de concorrência na regra RN-072 com custo muito baixo (é uma migration simples) | Baixo |
| 2 | 🟡 Corrigir a documentação (RN-074 e nota de cache do RF-033) (RNF-NOVO-E3/E4) | Higiene de documentação — pequeno, mas evita confusão em auditorias futuras | Trivial |
| 3 | 🟢 Avaliar mover a busca de imagem de capa para background (RNF-NOVO-E1) | Melhoria de performance percebida na criação de viagem; não é crítico hoje mas cresce em risco à medida que mais integrações externas forem adicionadas ao fluxo | Médio |
| 4 | 🟢 Revisitar TTL do cache de cotações à luz do achado T5 (mover para cache externo compartilhado, se/quando isso for endereçado globalmente) | Ligado à correção arquitetural maior do achado transversal T5 — não precisa ser resolvido isoladamente aqui | A tratar junto de T5 |

---

## ❓ Perguntas clarificadoras

1. O TTL de 5 minutos no cache de cotação foi uma escolha consciente (ex.: equilíbrio entre atualidade e limite de requisições da AwesomeAPI) ou a intenção real sempre foi "cache diário" como o README descreve? Isso muda se o item 4 é uma correção de código ou só de documentação.
2. Existe algum plano de adicionar uma camada de cache compartilhado (Redis/Upstash) já no roadmap de infraestrutura, ou isso ainda não foi discutido?

---

*Próximo módulo sugerido: 06 — Insights e Chatbot (ambos em 0%, mas o backend de Insights (`insightService.js`) já tem conteúdo real segundo o achado T1 — vale confirmar o que já existe antes de assumir 0% de código).*
