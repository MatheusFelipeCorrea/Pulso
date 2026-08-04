# 🤖 Módulo 06 — Inteligência (Insights e Chatbot) — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-044–053, RF-107/108, RF-143/144), `RegrasDeNegocio.md` (RN-121–130), `Analise-Produto.md` (gap #3).
> Código auditado: `api/src/services/insightService.js`, `api/src/routes/index.js`, `api/src/providers/geminiProvider.js` (vazio), `api/prisma/schema.prisma` (models `MensagemChat`, `HistoricoScore`, `DesafioMensal`), `web/src/services/chatbotService.js` (vazio), `web/src/components/features/chatbot/**` (vazios), `web/src/pages/Insights.jsx`/`Chatbot` (rota inexistente, cai em `InDevelopmentPage`).

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** o README já marca Insights e Chatbot como **0/9 e 0/5**, e a auditoria confirma isso — mas com uma nuance importante que vale destacar por cima do que `Analise-Produto.md` já registra ("Hoje: regra simples na API"). **Chatbot é 100% inexistente**: nenhuma rota é registrada em `routes/index.js`, `geminiProvider.js` está vazio (0 bytes), o service de frontend `chatbotService.js` está vazio, e todos os componentes de chat (`ChatWindow`, `ChatInput`, `ChatMessage`) estão vazios — não há nem scaffold funcional, é ausência total. **Insights não é "parcial" no sentido de ter uma versão simplificada rodando em produção visível ao usuário via tela própria — é uma única função interna, automática, sem endpoint HTTP, que gera no máximo 1 notificação por mês** com o texto fixo "Seu maior gasto do mês está em [categoria]". Ela roda como efeito colateral de registrar uma transação, é rotulada `tipo: 'INSIGHT_IA'` mas seus próprios metadados dizem `geradoPor: 'regras'` — ou seja, o rótulo "IA" na notificação que o usuário vê é, tecnicamente, published como IA sem nenhuma IA por trás.

---

## 1. Auditoria de Status (README vs. Realidade)

### Insights

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-044 | Resumo mensal em linguagem natural | ❌ | Confirmado ausente — a única saída de texto existente é a frase fixa de maior gasto, não um resumo gerado |
| RF-045 | Categorias com gasto maior que mês anterior | ❌ | Confirmado ausente — `insightService.js` não compara com mês anterior, só pega o maior gasto do mês atual |
| RF-046 | Sugestões personalizadas de economia | ❌ | Confirmado ausente |
| RF-047 | Alertas preditivos ("VA acaba dia 22") | ❌ | Confirmado ausente |
| RF-048 | Score de saúde financeira (0-100) | ❌ | Confirmado ausente — **e mais**: existe uma tabela `HistoricoScore` inteira no schema (`schema.prisma`, relação `Usuario.historicoScore`) sem nenhum código em toda a API que leia ou escreva nela. É um "órgão fantasma" no banco — schema pronto, zero lógica |
| RF-107/108 | Projeções (3 cenários), "ficará negativo em X dias" | ❌ | Confirmado ausente |
| RF-143/144 | "Você vs você mesmo", revisão semanal guiada | ❌ | Confirmado ausente |

**O que de fato existe (não documentado com esse nível de detalhe em nenhum RF):** `gerarInsightParaUsuario` (`insightService.js:24-66`) roda automaticamente dentro de `transactionService.criarTransacao` (via `tentarGerarInsightAposTransacao`, chamado com `try/catch` silencioso — se falhar, não quebra o registro da transação). Ele: (1) verifica se já gerou um insight `INSIGHT_IA` neste mês (olhando as últimas 5 notificações desse tipo); (2) se não, agrupa despesas do mês por categoria, pega a de maior valor, e cria uma notificação com o texto fixo. **Não existe nenhuma rota HTTP para insights** (nem no `routes/index.js`, nem em nenhum outro arquivo) — o único jeito de um insight aparecer é através do sino de notificações, nunca de uma tela dedicada.

### Chatbot

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-049–053 (todos) | Chatbot financeiro, linguagem natural, contexto de dados reais, escopo restrito, histórico de sessão | ❌ | **Ausência total confirmada**: nenhuma rota `/chatbot` existe; `geminiProvider.js` (backend) e `chatbotService.js` (frontend) estão vazios; os 3 componentes de UI de chat (`ChatWindow`, `ChatInput`, `ChatMessage`) estão vazios. Não há nem um esqueleto não funcional — é zero linhas em toda a cadeia |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **A notificação "Insight IA" é uma alegação de marca sem lastro técnico ainda.** O `tipo: 'INSIGHT_IA'` e o título "Insight IA" (`insightService.js:56-57`) aparecem no sino de notificações do usuário como se fossem gerados por inteligência artificial — mas o próprio campo `metadados.geradoPor: 'regras'` (`:63`) admite que é uma regra fixa. Não é enganoso de forma grave (é uma frase verdadeira: "seu maior gasto foi X"), mas cria uma expectativa de sofisticação que a landing page (que já promete Insights com IA, segundo `Analise-Produto.md`) reforça sem entregar ainda.
2. **Menu lateral oferece "Insights" e "Chatbot" como links de primeira classe** (`sidebarNavigation.js:42-44`) que levam direto para `InDevelopmentPage` — mesma classe de problema já registrada no Módulo 02 (Dashboard), mas aqui pelo menos não é o destino forçado pós-login, só um clique eventual do usuário explorando o menu.
3. **Nenhuma forma de "regenerar" insight (RN-126) é sequer possível hoje**, porque não existe endpoint. Se/quando a tela de Insights for construída, o botão "Regenerar" citado em RN-126 vai exigir uma mudança na regra atual de "no máximo 1 por mês" (`jaGerouInsightNoMes`) — hoje a lógica ativamente impede uma segunda geração no mesmo mês, o oposto de "regenerar sob demanda".

---

## 3. Diagnóstico de Regras de Negócio e Validações

| RN | Regra | Realidade |
|---|---|---|
| RN-121/122 | Chatbot só responde finanças; recusa fora do escopo com frase padrão | ⏳ Não avaliável — não existe implementação |
| RN-123/124 | Chatbot acessa dados reais do usuário, mas nunca de outros usuários/grupo | ⏳ Não avaliável — não existe implementação |
| RN-125 | Insights gerados automaticamente no fim de cada mês | 🟡 **Parcialmente diferente do implementado**: a regra real não roda "no fim do mês" via job/cron — roda a qualquer momento, disparada pelo **registro de uma transação**, com uma trava de "1x por mês" verificada por consulta às notificações recentes. Ou seja, se o usuário não registrar nenhuma transação em um mês, **nenhum insight é gerado** naquele mês, mesmo estando "no fim do mês" |
| RN-126 | Insights podem ser regenerados sob demanda | ❌ Não implementado, e a lógica atual (`jaGerouInsightNoMes`) é o oposto — impede múltiplas gerações |
| RN-127 | Score recalculado diariamente | ❌ Não implementado — não existe cálculo de score em lugar nenhum |
| RN-128 | Projeção usa média dos últimos 3 meses | ❌ Não implementado |
| RN-129 | Rate limit do chatbot: 20 msg/min | ❌ Não aplicável — não há chatbot |
| RN-130 | Histórico do chat mantido por sessão, limpo ao deslogar/24h | ❌ Não aplicável — não há chatbot; mas nota-se que o job `chatCleanupJob.js` encontrado no diretório de jobs é para o **chat de Grupos** (retenção de 180 dias), não para o chatbot pessoal — pode gerar confusão de nomenclatura em auditorias futuras (dois "chats" completamente diferentes no sistema: chat de grupo, já entregue, e chatbot de IA, inexistente) |

**Achado de nomenclatura a observar:** o schema tem `MensagemChat` (chat com o bot, ligado a `Usuario`) e `MensagemChatGrupo` (chat social dentro de um grupo, Módulo 13) — duas tabelas com nomes parecidos e propósitos totalmente diferentes. Vale reforçar essa distinção na documentação para não confundir escopo ao planejar o Módulo 06.

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-F1** — Antes de integrar o Gemini de verdade, entregar uma tela mínima de Insights que **exiba** o que já existe (o insight de "maior gasto do mês", hoje só visível no sino de notificações) em uma superfície própria — aproveitando 100% do backend já pronto, sem custo de LLM.
- **RF-NOVO-F2** — Ao desenhar o endpoint de insights com IA, já prever o botão "Regenerar" (RN-126) mudando a trava atual de "1x/mês automático" para "1x/mês automático + N regenerações manuais/mês" (para controlar custo de LLM sem contradizer a regra de negócio documentada).
- **RF-NOVO-F3** — Reexaminar RN-125: decidir explicitamente se a geração deve continuar "disparada por transação" (implementação atual) ou migrar para um job agendado de fim de mês (como o texto da regra sugere) — isso muda o comportamento para usuários que passam um mês inteiro sem lançar nenhuma transação.

### Não funcionais

- **RNF-NOVO-F1 (Documentação)** — Corrigir `Analise-Produto.md`/`Requisitos/Readme.md` para deixar explícito que o Chatbot está em **0% absoluto** (nenhum arquivo com conteúdo, nem placeholder funcional), evitando qualquer leitura de que "existe algo básico" — hoje a redação ("Hoje: regra simples na API... chatbot ainda sem provider") mistura o status de Insights (tem uma regra rodando) com o de Chatbot (não tem nada), o que pode levar a subestimar o esforço de implementação do Chatbot.
- **RNF-NOVO-F2 (Custo/Arquitetura)** — Ao implementar o Gemini de fato, isolar toda chamada de LLM atrás de um cache/fila que sobreviva ao achado T5 (memória não persiste em serverless) — caso contrário, o controle de custo mencionado no README ("rate limit por usuário", "cacheado 1×/mês") corre o mesmo risco de ineficácia já visto no rate-limit de Auth e no cache de cotação.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟡 Expor o insight já gerado (maior gasto do mês) numa tela própria, sem esperar o Gemini (RF-NOVO-F1) | Aproveita 100% do backend existente a custo zero, tira o módulo de "0% visível" para "MVP visível" | Baixo |
| 2 | 🟡 Decidir e documentar RN-125 (trigger por transação vs. job de fim de mês) (RF-NOVO-F3) | Impacta diretamente o desenho do endpoint de insights com IA, que é o próximo passo grande do roadmap de jul/2026 | Decisão, não código |
| 3 | 🟢 Corrigir a documentação para refletir Chatbot = 0% absoluto (RNF-NOVO-F1) | Evita subestimar esforço de planejamento da Fase 6 do Roadmap | Trivial |
| 4 | 🟢 Planejar o botão "Regenerar" com controle de custo desde o desenho inicial do endpoint de IA (RF-NOVO-F2, RNF-NOVO-F2) | Mais barato resolver no desenho do que depois de o endpoint já estar em produção | A tratar quando a Fase 6 (IA) for iniciada |

---

## ❓ Perguntas clarificadoras

1. A intenção de RN-125 é mesmo "insights automáticos de fim de mês" (exigindo um job/cron dedicado, independente de o usuário lançar transações) ou o comportamento atual (disparado por transação, "1x/mês") é aceitável e a regra documentada é que precisa ser ajustada?
2. Existe alguma estimativa de orçamento/quota do Gemini Flash free tier já validada para o volume de usuários esperado, ou isso ainda está em aberto?
3. O rótulo "Insight IA" na notificação atual (que hoje não usa IA nenhuma) é aceitável como está até o Gemini entrar, ou preferem renomear para algo como "Alerta de Gasto" enquanto não há LLM de fato por trás?

---

*Próximo módulo sugerido: 07 — Lembretes e Google Agenda.*
