# 🛒 Módulo 18 — Planejamento de Compra — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [14-Orcamento-Mensal.md](./14-Orcamento-Mensal.md) (divergência de cálculo de renda entre módulos)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-133–138), `RegrasDeNegocio.md` (RN-087–093).
> Código auditado: `api/src/services/purchasePlanningService.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **✅ 6/6**. A auditoria confirma a funcionalidade central, mas encontrou **duas regras de negócio documentadas e não implementadas como escritas**: (1) RN-093 ("se tem meta vinculada e clicar 'Comprei!', a meta é concluída automaticamente") **não acontece** — `marcarComprado` cria a transação e marca o item como comprado, mas nunca toca na meta vinculada; (2) RN-088 ("sobra mensal = receita − despesa, média dos últimos 3 meses") está implementada usando **apenas o mês atual**, não uma média de 3 meses — o que pode distorcer fortemente a estimativa de "quanto tempo para comprar" em meses atípicos. Também foi encontrada uma divergência silenciosa entre este módulo e o de Orçamento (Módulo 14) na fórmula de "renda mensal" quando o usuário não tem `rendaMensalPlanejada` configurada.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-133 | Registrar item desejado (nome, valor, prioridade) | ✅ | Confirmado, `criarItem` |
| RF-134 | Calcular tempo para comprar baseado na sobra mensal | ✅ | Confirmado o cálculo existe, mas ver achado crítico (RN-088) na seção 3 |
| RF-135 | Simular à vista vs. parcelado | ✅ | Confirmado, `calcComprometimento` (não aprofundado, mas referenciado corretamente) |
| RF-136 | Alertar % da renda comprometido com parcelas | ✅ | Confirmado, `mediaImpactoRenda` no resumo |
| RF-137 | Vincular a uma meta financeira | ✅ | Confirmado, `resolverMeta`/`vincularMeta`/`desvincularMeta` — inclusive com opção de criar a meta na hora |
| RF-138 | Marcar como "comprado" e registrar transação automaticamente | 🟡 | A transação **é** criada corretamente (`marcarComprado`) — mas ver achado crítico sobre RN-093 (conclusão automática da meta) na seção 3 |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **"Comprei!" não fecha a meta vinculada, mesmo a documentação dizendo que deveria.** Um usuário que vinculou "Comprar um notebook" a uma meta de R$ 3.000, atingiu o valor via aportes, e finalmente clica "Comprei!" espera (pela própria regra de negócio documentada, RN-093) que a meta seja marcada como concluída automaticamente. Isso não acontece — a meta continua "ATIVA" indefinidamente, exigindo que o usuário va até o módulo de Metas e conclua manualmente (se lembrar de fazer isso).
2. **Estimativa de "tempo para comprar" pode ficar distorcida em meses atípicos.** Como `calcularSobraMensal` usa só o mês corrente (ver achado na seção 3), um mês com uma despesa grande e pontual (ex.: um conserto de carro) faz a "sobra mensal" cair para perto de zero ou negativo, fazendo todo item da lista de desejos parecer "impossível de comprar" mesmo que a média real dos últimos meses mostre folga financeira saudável.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado crítico — RN-093 (conclusão automática da meta ao marcar "Comprei!") não implementada

**Código (`marcarComprado`, `:314-349`):** cria a transação de despesa e atualiza o item para `status: 'COMPRADO'` — em nenhum momento lê ou atualiza `item.metaId`, nem chama qualquer função do `metaService` (ex.: uma equivalente a completar a meta). RN-093 é explícita: *"Se tem meta vinculada e clicar 'Comprei!': meta é concluída automaticamente."* Isso está documentado e não implementado.
**Severidade:** Média-Alta — quebra a promessa de integração entre os dois módulos (Planejamento de Compra ↔ Metas), que é justamente o diferencial de ter RF-137 (vincular a uma meta).
**Correção sugerida:** em `marcarComprado`, se `item.metaId` existir, chamar a lógica equivalente de "completar meta" (reaproveitando o padrão já usado em `metaService.sincronizarConclusao`, Módulo 04) após criar a transação.

### Achado crítico — RN-088 (sobra mensal = média de 3 meses) implementada como "só o mês atual"

**Código (`calcularSobraMensal`, `:66-91`):** consulta agregados de transações **apenas do mês corrente** (`mesReferenciaFromQuery(mesAtualString())`), calcula `sobra = rendaMensal - despesasDoMesAtual`. RN-088 documenta: *"Sobra mensal = receita total - despesas totais (**média dos últimos 3 meses**)."* Não há nenhuma janela de 3 meses nem média sendo calculada — é uma leitura de um único mês.
**Severidade:** Média — o cálculo em si é internamente consistente (não quebra nada), mas diverge da regra documentada e é mais sensível a outliers mensais do que o método de média pretendido.
**Nota de consistência:** esta é a mesma regra de "média de 3 meses" que RN-020 (PJ) e RN-128 (Insights, projeções) também mencionam — se a correção for feita aqui, vale reaproveitar a mesma função de "gasto médio dos últimos N meses" em todos os três lugares (ela já existe de forma similar em `metaService.sugerirReservaEmergencia`, Módulo 04, que sim usa `MESES_HISTORICO_GASTO_MEDIO = 3` corretamente).

### Achado — Divergência silenciosa na fórmula de "renda mensal" entre módulos

| Módulo | Fórmula quando `rendaMensalPlanejada` não está definida |
|---|---|
| Orçamento (Módulo 14, `obterRendaMensalPlanejada`) | `valorSalario` apenas |
| Planejamento de Compra (`obterRendaMensal`, `:47-64`) | `valorSalario + valorVa + valorVr` |

Os dois módulos calculam "renda mensal" de formas diferentes a partir dos mesmos campos de configuração. Isso significa que, hoje, o mesmo usuário pode ver dois valores de "renda mensal" diferentes dependendo de qual tela está olhando — um sintoma direto de não haver uma função compartilhada de "renda mensal do usuário" (mesma recomendação já feita nos Módulos 09/16 para lógica de agregação).

### Resiliência a estados extremos (itens que funcionam corretamente)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Editar/enviar imagem/vincular meta em item já comprado | Bloqueado consistentemente nos 3 pontos (`editarItem`, `enviarImagemItem`, `vincularMeta`) | ✅ |
| Vincular a uma meta já concluída/cancelada | Bloqueado (`resolverMeta:157-159`, só aceita ATIVA/PAUSADA) | ✅ |
| Categoria "Compras" não encontrada ao marcar como comprado sem especificar categoria | Erro claro em vez de falha silenciosa (`buscarCategoriaCompras:307-312`) | ✅ |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-P1 (correção)** — Implementar RN-093: ao marcar um item como comprado, se houver meta vinculada, concluí-la automaticamente (reaproveitando a lógica de conclusão do Módulo 04).

### Não funcionais

- **RNF-NOVO-P1 (correção)** — Ajustar `calcularSobraMensal` para usar média dos últimos 3 meses, conforme RN-088, reaproveitando o padrão já correto em `metaService.sugerirReservaEmergencia`.
- **RNF-NOVO-P2 (Reuso)** — Centralizar o cálculo de "renda mensal do usuário" numa única função compartilhada entre Orçamento, Planejamento de Compra e futuros módulos (Dashboard, Relatórios), eliminando a divergência de fórmula hoje existente entre os dois módulos já implementados.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟡 Concluir meta automaticamente ao marcar item como comprado (RF-NOVO-P1) | Regra de negócio documentada e ausente; quebra a integração-chave entre dois módulos | Baixo |
| 2 | 🟡 Corrigir `calcularSobraMensal` para média de 3 meses (RNF-NOVO-P1) | Regra documentada não implementada; hoje sensível a outliers de um único mês | Baixo (função de referência já existe no Módulo 04) |
| 3 | 🟡 Unificar fórmula de "renda mensal" entre Orçamento e Planejamento de Compra (RNF-NOVO-P2) | Elimina divergência de dado visível ao mesmo usuário em telas diferentes | Baixo-Médio |

---

## ❓ Perguntas clarificadoras

1. A divergência de fórmula de renda mensal (com ou sem VA/VR) entre Orçamento e Planejamento de Compra foi intencional (cada módulo pensando em "renda disponível" de um jeito diferente para seu propósito específico) ou é uma inconsistência não percebida?

---

*Próximo bloco: Módulos 19–25 (planejados para jul/2026, ainda sem código) — auditoria de prontidão de escopo, não de implementação.*
