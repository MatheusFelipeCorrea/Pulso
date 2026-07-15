# 🎯 Módulo 04 — Metas Financeiras — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-026–032, RF-142), `RegrasDeNegocio.md` (RN-061–068).
> Código auditado: `api/src/services/metaService.js`, `api/src/utils/metaBalanceUtils.js`, `api/prisma/schema.prisma` (models `Meta`, `AporteMeta`, `Viagem`), `web/src/services/metaService.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** este é o módulo com a implementação mais madura encontrada até agora na auditoria — README marca **✅ 8/8**, e o código confere ponto a ponto, com bom tratamento de estados (pausada/concluída/cancelada), cálculo correto de progresso e sugestão mensal, e vínculo bidirecional correto com Viagens (RN-073, `onDelete: SetNull`, verificado no schema). A auditoria encontrou **um defeito real e concreto**: a função de excluir um aporte (`excluirAporte`) **bloqueia a exclusão exatamente quando a meta está concluída**, mas a mensagem de erro exibida ao usuário diz o oposto — instrui a "remover aportes antes de reabrir uma meta concluída", uma ação que o próprio código impede de acontecer. Na prática, isso significa que **um aporte lançado por engano numa meta que já bateu o valor-alvo nunca pode ser corrigido/removido** — um beco sem saída de dados.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-026 | Criar meta (nome, valor-alvo, prazo, descrição opcional) | ✅ | Confirmado, `criarMeta` (`metaService.js:222-239`) |
| RF-027 | Aportes manuais | ✅ | Confirmado, `registrarAporte` (`:300-354`) |
| RF-028 | Progresso com barra visual e percentual | ✅ | Confirmado no cálculo (`calcProgressoMeta`); a barra em si é responsabilidade do frontend, não auditada aqui |
| RF-029 | Sugestão de valor mensal/semanal | ✅ | Confirmado, `calcValorMensalSugerido` (RN-067 ✅, fórmula exata: `valorRestante / diffMesesAte(prazo)`) |
| RF-030 | Curto/longo prazo | ✅ | Confirmado, `inferirTipoMeta` — corte em 6 meses (`diffMesesAte(prazo) <= 6`), não documentado explicitamente no RN mas é uma regra de negócio implícita razoável |
| RF-031 | Pausar/editar/concluir | ✅ | Confirmado com boas transições de estado (`editarMeta:274-294`) — só permite pausar ativa, retomar pausada, concluir quando `valorRestante <= 0` |
| RF-032 | Notificar meta atingida | ✅ | Confirmado (`registrarAporte:335-343`, cria notificação `META_ATINGIDA`) |
| RF-142 | Meta de Reserva de Emergência sugerida por X meses de gasto médio | ✅ | Confirmado, `sugerirReservaEmergencia` (`:194-220`) — usa média de 3 meses de despesas × N meses configurável (padrão 6) |

Nenhum RF deste módulo é scaffold morto (T1) — todos batem com implementação real.

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Aporte lançado por engano numa meta já concluída não pode ser corrigido — beco sem saída confirmado.** Ver detalhe técnico na seção 3. Do ponto de vista do usuário: ele registra um aporte que (por erro de valor, ou por já ter outro aporte pendente de confirmação) faz a meta baixar para `valorRestante <= 0` e virar `CONCLUIDA` automaticamente (RN-063). Se esse aporte estava errado, **não existe nenhuma forma de desfazer isso pela função de excluir aporte** — a própria função de exclusão está bloqueada quando a meta está concluída. A única saída não documentada seria uma edição direta no banco.
2. **Mensagem de erro contraditória.** A mensagem "Remova aportes antes de reabrir uma meta concluída" (`metaService.js:365`) é exibida exatamente quando o usuário está *tentando* remover um aporte — soa como se fosse uma instrução de próximo passo, mas na verdade é o próprio bloqueio. Isso confunde mais do que orienta.
3. **Não há como "reabrir" uma meta concluída por engano.** Mesmo que o usuário quisesse restaurar a meta para `ATIVA` manualmente (ex.: via edição), `editarMeta` bloqueia qualquer alteração em meta `CONCLUIDA` a menos que a própria alteração seja `status: 'CONCLUIDA'` (`:248-250`) — ou seja, reversão de conclusão simplesmente não existe como fluxo, nem por edição direta nem por remoção de aporte.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado crítico — `excluirAporte` bloqueia exatamente o cenário que sua própria mensagem de erro descreve

**Código (`metaService.js:356-380`):**
```js
const excluirAporte = async (usuarioId, metaId, aporteId) => {
    const meta = await buscarMetaComAportes(metaId, usuarioId);
    const aporte = await metaRepository.buscarAporte(aporteId, metaId, usuarioId);

    if (!aporte) {
        throw new AppError('Aporte não encontrado', 404);
    }

    if (meta.status === 'CONCLUIDA') {
        throw new AppError('Remova aportes antes de reabrir uma meta concluída', 400);
    }

    await metaRepository.excluirAporte(aporteId);
    // ...recalcula valorAtual e, se necessário, reabre a meta para ATIVA
```
A função **tem lógica pronta e correta logo depois do guard** para lidar com a reabertura (recalcula `valorAtual`, e mais abaixo — `:373-377` — até reverte `status` de `CONCLUIDA` para `ATIVA` se for o caso). Ou seja, **o código sabe como reabrir uma meta ao excluir um aporte** — mas o `if (meta.status === 'CONCLUIDA') throw` no início impede que esse caminho seja alcançado justamente no único caso em que ele seria necessário (remover um aporte de uma meta já concluída). Isso tem cheiro de guard invertido ou copiado de outro contexto sem revisão — o comportamento e a intenção do próprio código (a lógica de reabertura mais abaixo) contradizem o bloqueio.
**Severidade:** Alta — é uma regra que fecha uma porta permanentemente para um erro de operação comum (aporte duplicado/errado no momento exato em que a meta bate 100%), sem nenhuma via de correção alternativa documentada.
**Correção sugerida:** remover o guard, ou trocá-lo por uma janela de tolerância (ex.: só bloquear exclusão de aporte se a meta estiver concluída **há mais de N dias**, preservando a integridade de metas antigas já "fechadas" enquanto permite corrigir erros recentes).

### Resiliência a estados extremos (demais itens verificados)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Prazo da meta no passado (criação/edição) | Bloqueado — `validarPrazoFuturo` (RN-061 ✅) | ✅ |
| Aporte com data futura | Bloqueado — `validarDataAporte` (`:48-58`), regra não documentada explicitamente em RN mas coerente com RN-054 de Transações | ✅ (boa consistência entre módulos) |
| Aporte que excede o valor restante | Bloqueado — RN-062 ✅ | ✅ |
| Aporte que iguala exatamente o valor restante | Auto-conclui via `sincronizarConclusao` — RN-063 ✅ | ✅ |
| Editar `valorAlvo` para menos do que já foi acumulado | Bloqueado (`:259-265`) — regra sensata não documentada explicitamente em nenhum RN/RN, mas previne um estado inconsistente (`valorAtual > valorAlvo`) | ✅ (boa proteção "extra" além do documentado) |
| Meta vencida (prazo passou, não concluída) | `metaEstaVencida` calcula corretamente, mas é preciso confirmar se o **frontend** de fato exibe o alerta "Meta vencida" (RN-068) — não auditado neste módulo | 🟡 A confirmar no frontend |
| Excluir meta vinculada a uma viagem | Schema usa `onDelete: SetNull` em `Viagem.meta` — a viagem perde o vínculo sem ser excluída, exatamente como RN-073 pede | ✅ Confirmado correto |
| Cancelar meta | `editarMeta` bloqueia mudar `status` para `CANCELADA` via edição (`:275-277`, orienta usar exclusão) — ou seja, "cancelar" e "excluir" são a mesma ação na prática, o que é consistente com RN-065 ("Meta CANCELADA não pode ser reativada — criar nova") já que excluir também é irreversível | ✅ Design coerente, ainda que a nomenclatura "CANCELADA" no enum pareça sugerir algo diferente de "excluída" |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-D1 (correção)** — Permitir a exclusão de aportes em metas concluídas dentro de uma janela de tolerância (ex.: até 7 dias após a conclusão automática), reaproveitando a lógica de reabertura que já existe no código mas está inacessível.
- **RF-NOVO-D2** — Exibir, na tela de meta concluída, uma ação explícita "Isso foi um engano? Corrigir aporte" que direciona para a exclusão do aporte causador, com aviso claro de que isso reabre a meta.

### Não funcionais

- **RNF-NOVO-D1 (Qualidade)** — Adicionar teste de regressão cobrindo "excluir aporte de meta concluída deve reabrir a meta corretamente" — hoje o bloqueio provavelmente nunca foi exercitado por um teste, senão o comportamento contraditório teria sido percebido.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🔴 Corrigir o guard de `excluirAporte` (RF-NOVO-D1) | Beco sem saída real de dados — usuário não tem como corrigir um erro comum (aporte incorreto que bate a meta) | Baixo |
| 2 | 🟡 Ajustar a mensagem de erro para não contradizer o comportamento, enquanto a correção do item 1 não sobe | Reduz confusão imediata | Trivial |
| 3 | 🟢 Confirmar no frontend se RN-068 (alerta "Meta vencida") está de fato visível na tela de metas | Fechar a lacuna de verificação ponta-a-ponta deste módulo | Baixo (é só uma checagem) |
| 4 | 🟢 Teste de regressão para o cenário de reabertura via exclusão de aporte (RNF-NOVO-D1) | Evita reincidência | Baixo |

---

## ❓ Perguntas clarificadoras

1. O bloqueio de `excluirAporte` em metas concluídas foi uma decisão consciente (ex.: "meta concluída é um registro histórico imutável, ponto final") ou é um bug de guard invertido, como a evidência do código sugere (a lógica de reabertura existe logo abaixo do bloqueio, sem ser alcançável)?
2. Existe alguma tela dedicada a "reabrir" uma meta concluída fora do fluxo de aportes que eu não tenha visto neste módulo (ex.: ação administrativa)?

---

*Próximo módulo sugerido: 05 — Viagens e Simulador de Moedas.*
