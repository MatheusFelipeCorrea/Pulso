# 🧭 Módulos 19–25 (planejados para jul/2026) — Auditoria de Prontidão de Escopo

> Diferente dos relatórios anteriores, estes módulos **não têm código** — só especificação (`Requisitos/Readme.md`). Por isso, esta auditoria não é "README vs. código", é uma **revisão de engenharia de requisitos**: a especificação está completa, consistente entre si, consistente com o que já existe implementado, e pronta para virar ticket de implementação sem ambiguidade?
> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Módulos cobertos: 19 (Onboarding), 20 (Importação de Dados), 21 (Cartão de Crédito e Faturas), 22 (Integrações e Bots), 23 (Modo Casal/Família), 24 (PWA e Notificações Push), 25 (Veículos & FIPE).

---

## 📋 Sumário

1. [Achado transversal a estes 7 módulos: ausência total de Regras de Negócio (RN)](#1-achado-transversal-ausência-total-de-regras-de-negócio-rn)
2. [Módulo a módulo — prontidão de escopo](#2-módulo-a-módulo--prontidão-de-escopo)
3. [Dependências cruzadas entre módulos planejados e módulos já auditados](#3-dependências-cruzadas)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

---

## 1. Achado transversal: ausência total de Regras de Negócio (RN)

Todos os 18 módulos já entregues (1–18) têm, além da lista de RFs, uma seção correspondente de **Regras de Negócio** em `RegrasDeNegocio.md` (RN-001 a RN-170) detalhando comportamento de edge case, fórmulas exatas e transições de estado. **Nenhum dos 7 módulos planejados (RF-151 a RF-197) tem uma única RN correspondente** — confirmado por busca exaustiva no documento de regras (só há uma menção passageira a "onboarding" em RN-031, sobre uma pergunta de configuração de VA, não sobre o fluxo do Módulo 19 como um todo).

**Por que isso importa:** os RFs destes módulos descrevem o **quê** ("o sistema deve permitir cadastrar um cartão de crédito..."), mas não o **como exatamente** nos casos de borda — exatamente o tipo de informação que, nos módulos 1–18, preveniu ambiguidade de implementação (ex.: RN-163 "se o dia configurado não existe no mês, gera no último dia" evitou uma classe inteira de bugs de data). Sem esse nível de detalhe, cada um dos 7 módulos abaixo corre risco de repetir, na implementação, os mesmos tipos de lacuna que esta auditoria encontrou nos módulos já existentes (ex.: o que fazer quando uma fatura de cartão é editada depois de paga; o que fazer se a API da FIPE está fora do ar ao cadastrar um veículo).

**Recomendação geral:** antes de abrir qualquer ticket de implementação destes módulos, escrever a seção de RN correspondente — não depois. O formato já validado nos módulos 1–18 (regra + descrição objetiva, numerada, testável) é reutilizável diretamente.

---

## 2. Módulo a módulo — prontidão de escopo

### Módulo 19 — Onboarding (RF-151–154)

- **Prontidão:** Boa clareza de objetivo ("eliminar o cold start"), mas as 4 RFs são de alto nível — falta detalhar a ordem exata dos passos do wizard, o que acontece se o usuário sair no meio (estado parcial salvo?), e se é possível refazer o onboarding depois.
- **Dependência crítica confirmada nesta auditoria:** RF-153 ("selecionar modo de uso durante o onboarding") é **exatamente** o caminho de escrita de `modoUso` que o [Módulo 10](./10-Perfil-e-Configuracoes.md) identificou como **inexistente hoje em qualquer lugar do sistema**. Isso eleva a prioridade deste módulo: não é "mais uma feature bacana", é o único lugar planejado onde o gap mais grave do Módulo 10 seria resolvido. Se o Módulo 19 atrasar, o gap do Módulo 10 (todo usuário travado em CLT) persiste por tempo indefinido.
- **Falta especificar:** o que acontece se o usuário pular o onboarding (RF-154 permite pular) e nunca mais voltar — ele fica permanentemente sem `modoUso` definido (ou seja, sem resolver o gap do Módulo 10) a menos que exista uma segunda via de acesso a essa configuração pela tela de Perfil (Módulo 10) depois.

### Módulo 20 — Importação de Dados (RF-155–160)

- **Prontidão:** Boa — o "Fluxo previsto" descrito no README (upload → parse → normalização → dedupe → categorização → preview → confirmação) já é quase um desenho técnico, incomum em positivo para este conjunto de módulos.
- **Consistência confirmada:** a intenção de reaproveitar o motor de sugestão de categoria do RF-141 é tecnicamente viável — confirmei no [Módulo 03](./03-Transacoes.md) que `categorySuggestionService.js` já existe com lógica real (similaridade de texto via bigramas), então esta dependência é concreta, não especulativa.
- **Falta especificar:** o que acontece quando o "mapeamento manual de colunas" (RF-160) é usado mas o CSV tem uma coluna de valor com formato ambíguo (ex.: "1.234,56" vs "1,234.56") — risco real de importar valores 1000x errados sem detecção.

### Módulo 21 — Cartão de Crédito e Faturas (RF-161–168)

- **Prontidão:** Média — cobre o ciclo de vida básico, mas falta descrever explicitamente o que esta auditoria encontrou como bug real no Módulo 03 (Transações): RF-163 ("gerar automaticamente as parcelas futuras") é estruturalmente idêntico ao mecanismo de transações recorrentes já implementado — e aquele mecanismo teve um bug real de exclusão (Módulo 03, achado crítico A). **Recomenda-se, ao especificar a RN deste módulo, escrever explicitamente a regra de "excluir uma compra parcelada" (só a parcela, ou a compra toda com todas as parcelas futuras/passadas)** — exatamente o tipo de ambiguidade que já causou um bug real em Transações.
- **Falta especificar:** o que acontece se o usuário editar o dia de fechamento do cartão depois de já existirem faturas abertas — as parcelas já alocadas são realocadas retroativamente ou só as futuras?

### Módulo 22 — Integrações e Bots (RF-169–173)

- **Prontidão:** Baixa-Média — depende inteiramente de um "parser de linguagem natural" que, segundo o [Módulo 06](./06-Insights-e-Chatbot.md), **não existe em nenhuma forma hoje** (nem o Gemini, nem um parser rule-based). RF-171 ("registrar transações via bot em linguagem natural") pressupõe a mesma capacidade de NLP que o Chatbot precisaria, mas nenhum dos dois módulos declara essa dependência compartilhada explicitamente.
- **Falta especificar:** RN de pareamento de conta (RF-173, "token/código de pareamento seguro") — não há menção a expiração do token de pareamento, nem ao que acontece se o mesmo código for usado por duas contas Telegram diferentes (tentativa de sequestro de vínculo).

### Módulo 23 — Modo Casal/Família (RF-174–179)

- **Prontidão:** Média — a decisão de reaproveitar a infraestrutura de Grupos (`tipo = FAMILIA`) é sólida e reduz risco de implementação, mas herda também os achados de concorrência do [Módulo 13](./13-Grupos.md) (enumeração de código de convite, checagem de limites sem constraint de banco) — que devem ser corrigidos **antes** ou **junto** da extensão para Família, não depois, já que espaços "Família" são contínuos e de longo prazo (mais tempo de exposição ao mesmo risco que um grupo de viagem pontual).
- **Falta especificar:** RF-176 ("dividir despesas... proporcional à renda de cada membro") pressupõe que o sistema saiba a renda de cada membro do espaço — mas RN-116 (herdada de Grupos) diz que dados pessoais nunca são visíveis a outros membros. Existe uma contradição em potencial aqui que precisa ser resolvida na especificação: como calcular rateio proporcional à renda sem expor a renda de cada um?

### Módulo 24 — PWA e Notificações Push (RF-180–184)

- **Prontidão:** Boa clareza técnica (VAPID, service worker), mas a especificação não menciona onde as inscrições de push (subscriptions) serão armazenadas. Dado o achado [T5](./00-Achados-Transversais.md#t5--caches-e-contadores-em-memória-mapmemorystore-não-sobrevivem-entre-invocações-serverless) (memória de processo não sobrevive entre invocações serverless), é importante que a especificação já deixe explícito que as subscriptions **devem** ser persistidas no banco (não em memória), para não repetir o mesmo padrão de fragilidade já visto duas vezes no sistema.
- **Falta especificar:** RN de deduplicação de push (o que acontece se o mesmo evento, ex. "fatura a vencer", tentar disparar em duas execuções próximas do job) — mesmo tipo de proteção que já existe para notificações em-app (`verificarNotificacaoDuplicada`, Módulo 14) precisa ser replicado para push.

### Módulo 25 — Veículos & FIPE (RF-185–197)

- **Prontidão:** Alta — é o módulo planejado com a especificação mais detalhada e cuidadosa de todos (fórmula de custo mensal médio já escrita, filosofia de custo explícita, integrações mapeadas). Mas falta um paralelo ao que já existe para as tabelas de INSS/IRRF (RN-150/151: *"tabelas devem ser atualizáveis"* e *"o sistema deve informar que tabelas podem estar desatualizadas com disclaimer"*) — RF-192 (estimar IPVA por estado) vai precisar de tabelas de alíquota por estado que também mudam anualmente, e a especificação atual não menciona nem atualização nem disclaimer para essas tabelas, apesar do precedente já existir no próprio documento para um caso análogo.
- **Falta especificar:** comportamento quando a API da FIPE (BrasilAPI/Parallelum) está fora do ar no momento de cadastrar um veículo novo — bloqueia o cadastro, ou permite cadastrar sem valor FIPE e busca depois?

---

## 3. Dependências cruzadas

| Módulo planejado | Depende de (já auditado) | Status da dependência |
|---|---|---|
| 19 — Onboarding | 10 — Perfil/Configurações (escrita de `modoUso`) | ❌ Não existe hoje |
| 20 — Importação | 03 — Transações (`categorySuggestionService`) | ✅ Existe e é reaproveitável |
| 21 — Cartão de Crédito | 03 — Transações (padrão de recorrência, incluindo o bug já encontrado) | 🟡 Existe, mas com um bug a não repetir |
| 22 — Bots | 06 — Chatbot (parser de linguagem natural) | ❌ Não existe hoje (nem para o próprio Chatbot) |
| 23 — Casal/Família | 13 — Grupos (infraestrutura de espaços compartilhados) | 🟡 Existe, mas herda achados de concorrência (T7) a corrigir |
| 24 — PWA/Push | 07/14 — Padrão de dedup de notificação; T5 (armazenamento serverless) | 🟡 Padrão de dedup existe e é reaproveitável; precisa ser DB-backed, não em memória |
| 25 — Veículos/FIPE | Nenhuma dependência de módulo já implementado — módulo mais autocontido | ✅ |

---

## 4. 💡 Novos Requisitos Propostos

### Não funcionais

- **RNF-NOVO-Q1 (Processo)** — Escrever a seção de Regras de Negócio (RN) para os módulos 19–25 antes de qualquer implementação, seguindo o formato já validado nos módulos 1–18. Priorizar Cartão de Crédito (21) e Casal/Família (23), que herdam diretamente riscos já identificados nesta auditoria (recorrência de parcelas, concorrência de espaços compartilhados).
- **RNF-NOVO-Q2** — Ao escrever a RN do Módulo 21, incluir explicitamente a regra de exclusão de compra parcelada (só a parcela vs. compra inteira), evitando repetir o achado crítico do Módulo 03.
- **RNF-NOVO-Q3** — Ao escrever a RN do Módulo 24, exigir explicitamente que subscriptions de push sejam armazenadas no banco (não em memória de processo), referenciando o achado T5.
- **RNF-NOVO-Q4** — Ao escrever a RN do Módulo 25, replicar o padrão já usado para tabelas INSS/IRRF (RN-150/151: atualizável + disclaimer) para as alíquotas de IPVA por estado.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🔴 Resolver a contradição de RF-176 (rateio proporcional à renda vs. RN-116 privacidade) antes de especificar RN do Módulo 23 | Contradição de requisito, não só lacuna — precisa de decisão de produto antes de qualquer código | Decisão de produto |
| 2 | 🟡 Escrever RN do Módulo 21 com atenção ao bug já conhecido de exclusão de recorrência (Módulo 03) | Mais barato prevenir na especificação do que corrigir depois de implementado | Baixo (documentação) |
| 3 | 🟡 Escrever RN do Módulo 19 amarrando explicitamente à resolução do gap do Módulo 10 | Já é a prioridade #1 do Módulo 10 nesta auditoria | Baixo (documentação) |
| 4 | 🟢 Escrever RN dos módulos 20, 22, 24, 25 com os pontos de atenção listados acima | Reduz retrabalho na implementação | Baixo (documentação) |

---

## ❓ Perguntas clarificadoras

1. Módulo 23 (RF-176): como o rateio "proporcional à renda de cada membro" deveria funcionar sem violar RN-116 (privacidade de dados pessoais dentro de espaços compartilhados)? Precisa de uma decisão de produto explícita — por exemplo, cada membro informar apenas um "percentual de contribuição" sem revelar o valor absoluto da renda.
2. Existe uma ordem de prioridade definida entre os 7 módulos planejados, ou a ordem numérica do README (19→25) reflete a intenção real de sequenciamento?

---

*Próxima seção: Requisitos Não Funcionais (transversal a todos os 25 módulos).*
