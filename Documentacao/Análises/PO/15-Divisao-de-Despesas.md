# 💸 Módulo 15 — Divisão de Despesas — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [07-Lembretes-e-Google-Agenda.md](./07-Lembretes-e-Google-Agenda.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-115–120), `RegrasDeNegocio.md` (RN-081–086, RNF-016).
> Código auditado: `api/src/services/expenseSplitService.js`, `api/src/utils/expenseSplitUtils.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **✅ 6/6**, e este é o módulo com a engenharia mais cuidadosa encontrada até agora na auditoria — os próprios comentários no código (`expenseSplitService.js:204,268-272`) documentam explicitamente edge cases de estado (reabertura de divisão quitada, lembretes cobrindo múltiplos participantes) que em outros módulos passaram despercebidos. Rateio determinístico por centavos (RNF-016) está corretamente implementado, e a exclusão de uma divisão limpa corretamente os lembretes de cobrança associados — o inverso exato do problema de "lembrete órfão" identificado como risco em outros lugares. Nenhum achado de severidade alta neste módulo; os pontos abaixo são de baixo risco e em sua maioria já mitigados por outra camada.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-115 | Registrar despesa compartilhada (valor total + participantes) | ✅ | Confirmado, `criarDivisao` |
| RF-116 | Calcular quanto cada participante deve | ✅ | Confirmado, `splitEqual`/personalizado |
| RF-117 | Divisão igualitária ou personalizada | ✅ | Confirmado, ambos os tipos tratados |
| RF-118 | Marcar quem já pagou | ✅ | Confirmado, `marcarParticipantePago`/`desmarcarParticipantePago` |
| RF-119 | Saldo consolidado (me devem vs. devo) | ✅ | Confirmado, `calcularResumo` |
| RF-120 | Lembrete de cobrança para participantes | ✅ | Confirmado, `criarLembreteCobranca`, reaproveitando o módulo de Lembretes corretamente |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Nenhum gap de severidade relevante identificado.** As mensagens de erro são específicas e orientam a ação correta (ex.: "Não é possível alterar participantes ou valores: já existe pagamento registrado... Desfaça os pagamentos primeiro ou crie uma nova divisão", `:224-227`) — um padrão de UX que outros módulos poderiam seguir.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Confirmação positiva — Rateio determinístico por centavos (RNF-016)

`splitEqual` (`expenseSplitUtils.js:3-14`) opera inteiramente em centavos inteiros (`Math.round(valor * 100)`), distribuindo o resto da divisão inteira para os primeiros participantes — exatamente o algoritmo que evita o erro clássico de ponto flutuante em rateios (ex.: R$100 ÷ 3 = R$33,33 + R$33,33 + R$33,34, sem sobra nem falta de 1 centavo). `validarSomaPersonalizada` (`:16-20`) usa a mesma lógica de centavos inteiros para validar divisões personalizadas, evitando falsos negativos de arredondamento (ex.: 33.33+33.33+33.34 sendo rejeitado por comparação de float).

### Confirmação positiva — Limpeza de lembretes órfãos ao excluir divisão

`excluirDivisao` (`:329-346`) remove explicitamente todos os lembretes de cobrança vinculados **antes** de excluir a divisão, com um comentário no próprio código explicando o motivo ("Sem isso, o lembrete de cobrança sobrevive órfão no calendário/Google Agenda"). Isso é o cuidado exato que faltou em outros fluxos de exclusão auditados anteriormente — vale como referência de boa prática a replicar.

### Achado menor — Mesmo padrão "verificar-depois-agir" já catalogado (T7)

`criarLembreteCobranca` (`:371-383`) verifica se já existe lembrete ativo para os participantes selecionados antes de criar um novo — mesma classe de concorrência já documentada em [00-Achados-Transversais.md § T7](./00-Achados-Transversais.md#t7--padrão-recorrente-regras-de-só-pode-existir-1-ou-saldo-suficiente-checadas-na-aplicação-nunca-no-banco). Risco baixo aqui (ação pouco frequente, um único organizador por vez).

### Achado menor — Reaproveitamento de `reminderService.criarLembrete` herda o risco já documentado no Módulo 07

`criarLembreteCobranca` chama `reminderService.criarLembrete` (Módulo 07) para criar o lembrete de cobrança. Se a tela permitir marcar "sincronizar com Google Agenda" para esse lembrete específico e a sincronização falhar (ex.: Google desconectado), o mesmo bug já reportado no Módulo 07 se aplicaria aqui: o lembrete de cobrança seria apagado silenciosamente em vez de criado como pendente. Não é um novo achado — é uma confirmação de que a correção proposta no Módulo 07 (RF-NOVO-G1) também beneficia este módulo.

### Resiliência a estados extremos (itens que funcionam corretamente)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Marcar todos os participantes como pagos | Divisão move automaticamente para `QUITADA` (RN-085 ✅, `sincronizarStatusDivisao`) | ✅ |
| Desmarcar um pagamento de uma divisão já quitada | Reabre a divisão automaticamente (`:111-113`) | ✅ Bom tratamento, não documentado explicitamente em RN mas correto |
| Editar valor total sem reenviar participantes | Bloqueado com mensagem explicando o motivo (`:216-221`) | ✅ |
| Excluir divisão já quitada | Bloqueado, orientando que a limpeza é automática após 180 dias | ✅ |
| Nome de participante duplicado ou igual a "Você" | Bloqueado (`:40-50`) | ✅ |
| Criar lembrete de cobrança para quem já pagou | Bloqueado com mensagem nominal específica (`:363-369`) | ✅ |
| Soma de valores personalizados diferente do total | Bloqueado via comparação em centavos inteiros | ✅ |

---

## 4. 💡 Novos Requisitos Propostos

Nenhum requisito novo específico deste módulo — os únicos itens de ação já estão cobertos pelas correções propostas no Módulo 07 (RF-NOVO-G1) e pela nota transversal T7.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟢 Nenhuma ação prioritária isolada — beneficia-se automaticamente da correção do Módulo 07 (RF-NOVO-G1) quando implementada | Reaproveita `reminderService.criarLembrete` | — |

---

## ❓ Perguntas clarificadoras

Nenhuma pergunta específica deste módulo — implementação madura e consistente com a documentação.

---

*Próximo módulo sugerido: 16 — Calendário Financeiro.*
