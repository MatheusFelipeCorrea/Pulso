# 🎮 Módulo 11 — Gamificação — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-079–083, RF-105–106), `RegrasDeNegocio.md` (RN-101–110), `Analise-Produto.md` (gap #4).
> Código auditado: `api/src/services/gamificationService.js`, `api/src/services/{authService,transactionService}.js` (pontos de integração), `api/prisma/schema.prisma` (models `Sequencia`, `Conquista`, `ConquistaUsuario`, `DesafioMensal`), `web/src/pages/Achievements.jsx` (vazio), `web/src/components/features/gamification/**` (vazios).

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **0/7**, e o `Analise-Produto.md` já registra "backend sim, UI não". A auditoria confirma que existe backend real (`gamificationService.js`), mas encontrou que ele é **muito mais limitado do que RN-101–110 descreve** — não é "backend completo esperando UI", é um MVP estreito com lacunas de regra de negócio que vão continuar existindo mesmo depois que a tela for construída. Achados centrais: (1) o catálogo de conquistas tem **apenas 3 itens hardcoded** (de um sistema que RF-080 sugere ser mais amplo); (2) o **sistema de níveis (RN-106) não existe** — todo usuário fica "Iniciante" para sempre, porque nada recalcula `nivel` a partir do XP; (3) a maior parte dos gatilhos de XP de RN-105 (transação +5, quiz +20, marco de streak +50, meta completa +100, desafio +100) **não está implementada** — só 3 eventos específicos (primeira transação, primeira meta, 7 dias de streak) dão XP, com valores que nem batem com os documentados; (4) o toggle "desativar gamificação" (RN-109/110) **não tem efeito nenhum no backend** — mesmo que existisse uma tela para isso, a lógica de streak/conquista roda incondicionalmente.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-079 | Rastrear streak de dias consecutivos | ❌ (README) | 🟡 **Na verdade já implementado** (Módulo 03, `transactionService.incrementarStreak`) — o README subestima isso; é backend completo e correto (RN-101/102 ✅) |
| RF-080 | Conquistas ao atingir marcos | ❌ (README) | 🟡 Parcialmente implementado — só 3 conquistas existem no catálogo (`PRIMEIRA_TRANSACAO`, `STREAK_7`, `PRIMEIRA_META`); os exemplos do próprio RF-080 ("30 dias de streak") não têm conquista correspondente |
| RF-081 | Nível financeiro (Iniciante→Consciente→Estrategista→Investidor) | ❌ | Confirmado ausente **de verdade** — não é só falta de tela, o campo `nivel` é setado uma vez (`INICIANTE`) na criação da conta e nunca mais recalculado em nenhum lugar do código |
| RF-082 | Desafios mensais personalizados | ❌ | Confirmado ausente — zero código, só a tabela `DesafioMensal` existe no schema (mesmo padrão do `HistoricoScore` no Módulo 06: schema pronto, lógica zero) |
| RF-083 | Painel de conquistas | ❌ | Confirmado ausente (tela vazia) |
| RF-105 | Dicas educativas contextualizadas | ❌ | Confirmado ausente |
| RF-106 | Quizzes semanais com XP | ❌ | Confirmado ausente |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Notificações de gamificação já disparam para uma tela que não existe.** As notificações `CONQUISTA` e `STREAK` (`gamificationService.js:69-75,87-93`) usam `linkAcao: '/achievements'` — um usuário que clica nessas notificações hoje cai direto no `InDevelopmentPage`. É a mesma classe de problema já visto em outros módulos (link para o nada), mas aqui é pior porque a notificação **já está sendo enviada em produção** (o gatilho existe e roda de verdade), então usuários reais já estão clicando nesse link morto.
2. **Streak de 3 e 14 dias notifica, mas não gera conquista nem XP.** `notificarStreak` (`:80-94`) dispara uma notificação genérica nos marcos `[3, 7, 14, 30]`, mas `desbloquearConquista('STREAK_7')` só é chamado explicitamente quando `sequenciaDepois >= 7` (`processarAposTransacao:102-104`) — os marcos 3, 14 e 30 **nunca desbloqueiam conquista nem dão XP**, apesar de gerarem uma notificação que parece comemorar uma "conquista". Do ponto de vista do usuário, ele recebe "30 dias seguidos! Continue assim!" mas isso não aparece em lugar nenhum como conquista permanente.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado — Sistema de níveis (RF-081/RN-106) inexistente, apesar de ter enum e valor inicial no schema

RN-106 define 4 faixas de XP → nível. Busca exaustiva por `nivel`/`INICIANTE`/`CONSCIENTE`/`ESTRATEGISTA`/`INVESTIDOR` em todo `api/src` só encontra ocorrências em `authService.js`, **todas no momento de criação da conta** (`sequencia: { create: { nivel: 'INICIANTE' } } }`). Nenhum código recalcula o nível depois que XP é incrementado (`gamificationService.js:64-67`, `prisma.sequencia.updateMany({ data: { xp: { increment } } })` nunca atualiza `nivel` na mesma operação nem em nenhum lugar subsequente). **Um usuário pode acumular 5.000 XP e o sistema continuará dizendo "Iniciante".**

### Achado — Maioria dos gatilhos de XP de RN-105 não implementada, e os valores existentes não batem com o documento

RN-105: *"XP é concedido por: registrar transação (+5), completar quiz (+20), atingir marco de streak (+50), completar meta (+100), completar desafio (+100)"*. Realidade:
- **Registrar transação:** não concede XP nenhum diretamente — só concede XP indiretamente na **primeira** transação, via a conquista `PRIMEIRA_TRANSACAO` (+10 XP, não +5, e só uma vez, não por transação).
- **Completar quiz:** não existe quiz no sistema — 0 XP possível.
- **Atingir marco de streak:** só o marco de 7 dias dá XP, e é via a conquista `STREAK_7` (+25 XP), não +50 como documentado, e não a cada marco (3/14/30 não dão XP).
- **Completar meta:** **não implementado** — `metaService.registrarAporte` (Módulo 04) não chama nenhuma função de gamificação quando uma meta é concluída (`status: 'CONCLUIDA'`). A única integração com Metas é `processarAposCriarMeta`, chamada em `criarMeta`, que premia **criar** a primeira meta (+15 XP via `PRIMEIRA_META`), não **completar** uma meta como RN-105 pede.
- **Completar desafio:** não existe desafio no sistema — 0 XP possível.

Ou seja, de 5 gatilhos de XP documentados, **apenas 2 existem de fato (parcialmente)**, e nenhum dos dois valores de XP bate com o documento.

### Achado — Toggle de desativar gamificação (RN-109/110) não tem efeito no backend

O campo `configuracoes_usuario.gamificacao_ativa` existe (default `true`), mas **nenhuma função em `gamificationService.js` ou nos pontos de chamada (`transactionService.criarTransacao`, `metaService.criarMeta`) verifica esse valor antes de rodar streak/conquista**. Mesmo que uma tela de configurações permitisse desativar (o que, pelo Módulo 10, também não existe ainda), a lógica de gamificação continuaria rodando exatamente igual — o campo é decorativo hoje.

### Resiliência a estados extremos (itens que funcionam corretamente)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Desbloquear a mesma conquista duas vezes | `desbloquearConquista` verifica `conquistaUsuario.findUnique` antes de criar — idempotente (RN-104 ✅) | ✅ |
| Conquista/catálogo ainda não existe no banco na primeira chamada | `garantirCatalogoConquistas` faz upsert antes de checar — auto-seeding, resiliente a ambientes novos | ✅ Boa prática |
| Streak que pula de 5 para 8 (2 transações no mesmo dia não incrementam duas vezes) | Tratado em `transactionService.incrementarStreak` (Módulo 03), que já verifica "mesmo dia" antes de incrementar | ✅ |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-K1** — Implementar o cálculo de nível (RF-081/RN-106) como uma função pura derivada do XP total (não precisa de coluna própria recalculada por job — pode ser calculado on-the-fly na leitura), evitando que "Iniciante" fique congelado para sempre.
- **RF-NOVO-K2** — Conceder XP na conclusão de metas (RN-105, "+100"), hoje ausente — gancho natural em `metaService.registrarAporte`/`sincronizarConclusao` (Módulo 04).
- **RF-NOVO-K3** — Expandir o catálogo de conquistas para cobrir os marcos de streak já notificados (3/14/30 dias), hoje "comemorados" só via notificação efêmera sem registro permanente.

### Não funcionais

- **RNF-NOVO-K1** — Fazer todas as funções de `gamificationService` respeitarem `gamificacaoAtiva` antes de rodar (RN-109/110), preparando o terreno para quando a tela de configurações (Módulo 10) permitir o toggle.
- **RNF-NOVO-K2** — Corrigir os valores de XP no código para bater com RN-105 (ou, se os valores atuais (10/15/25) forem a decisão real, atualizar RN-105 para refletir isso — mesma lógica de "documentação vs. código" já aplicada em outros módulos).

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟡 Implementar cálculo de nível a partir do XP (RF-NOVO-K1) | Feature central do módulo (RF-081) hoje totalmente inerte, apesar do enum e do campo já existirem | Baixo |
| 2 | 🟡 Conceder XP em conclusão de meta (RF-NOVO-K2) | Gap de regra de negócio documentada e não implementada | Baixo |
| 3 | 🟢 Fazer o toggle `gamificacaoAtiva` ter efeito real (RNF-NOVO-K1) | Pré-requisito para a tela de configurações do Módulo 10 fazer sentido quando existir | Baixo |
| 4 | 🟢 Reconciliar valores de XP entre código e RN-105 (RNF-NOVO-K2) | Higiene de documentação/especificação | Trivial |
| 5 | 🟢 Expandir catálogo de conquistas de streak (RF-NOVO-K3) | Completa a experiência que já é parcialmente prometida via notificação | Baixo |

---

## ❓ Perguntas clarificadoras

1. Os valores de XP documentados em RN-105 (+5/+20/+50/+100/+100) são a intenção real de produto, ou os valores já implementados (10/15/25, só para 3 eventos específicos) refletem uma decisão mais recente e o RN está desatualizado?
2. Vale a pena expandir o catálogo de conquistas antes ou depois de construir a tela `/achievements` — ou seja, a prioridade é ter mais conquistas reais primeiro, ou uma tela bonita exibindo as 3 que já existem?

---

*Próximo módulo sugerido: 12 — Homepage (Landing Page), o único módulo restante nesta primeira leva que o README já marca como 100% concluído sem qualquer gap conhecido — bom para confirmar rapidamente e seguir para os módulos mais complexos (Grupos, Orçamento).*
