# 📋 Pulso — Auditoria Completa de Requisitos e Arquitetura (PO + Engenharia)

> **Leia este documento primeiro.** Ele sintetiza a auditoria dos 25 módulos do sistema (18 com código, 7 planejados) e dos Requisitos Não Funcionais. Cada achado aqui referencia o relatório de módulo correspondente, onde está o detalhe técnico completo (arquivo, linha, reprodução).
> Índice completo de documentos: [00-Achados-Transversais.md](./00-Achados-Transversais.md).
> Metodologia: leitura direta do código-fonte (`Codigo/Pulso/api` e `Codigo/Pulso/web`) confrontada com `Documentacao/Requisitos/Readme.md`, `Documentacao/Regras de Negocio/RegrasDeNegocio.md` e demais documentos de produto — não inclui execução de testes, análise dinâmica (DAST) nem verificação visual em navegador.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado (Next Steps)](#5-plano-de-ação-priorizado-next-steps)

---

## Como ler esta auditoria

O README do Pulso é, no geral, **honesto** sobre o que está pronto e o que não está — os módulos marcados ✅ quase sempre têm implementação real por trás (18 dos 18 módulos com código auditados bateram com o status declarado, no nível "existe e funciona"). O valor desta auditoria não está em desmentir isso, e sim em três camadas mais profundas que o README não podia capturar sozinho:

1. **Regras de negócio documentadas e não implementadas como escritas** — não "faltando", mas escritas de um jeito e codificadas de outro, silenciosamente.
2. **Padrões de risco que se repetem entre módulos sem relação aparente** — encontrados de forma independente em 3 a 4 lugares cada, o que sugere hábito de equipe/IA, não um bug isolado.
3. **Uma auto-correção no meio do processo**: a própria auditoria concluiu, num primeiro momento, que a cobertura de testes era ~0% — e essa conclusão estava **errada**, causada por um scaffold morto que confundiu a leitura. Isso está documentado com transparência porque é, em si, uma lição sobre o achado T1 (arquivos mortos no repositório enganam até auditorias cuidadosas).

---

## 1. Auditoria de Status (README vs. Realidade)

| # | Módulo | Status README | Veredito da auditoria |
|---|---|---|---|
| 01 | Autenticação | ✅ 6/6 | ✅ Confirmado, com 2 desvios sérios de segurança (ver §3) |
| 02 | Dashboard | ❌ 0/9 | ✅ Confirmado — e é o destino forçado de 4 fluxos de login diferentes |
| 03 | Transações | ✅ 13/13 | ✅ Confirmado, com 1 bug de perda de dados e 1 regra de negócio neutralizada |
| 04 | Metas Financeiras | ✅ 8/8 | ✅ Confirmado, com 1 beco-sem-saída de dados |
| 05 | Viagens e Moedas | ✅ 11/11 | ✅ Confirmado, com divergências menores de documentação |
| 06 | Insights e Chatbot | ❌ 0/9, 0/5 | ✅ Confirmado — Chatbot é 100% inexistente; Insights é 1 regra fixa, não "IA" |
| 07 | Lembretes e Google Agenda | ✅ 5/5 | ✅ Confirmado, engenharia sofisticada, com 1 bug de perda de dados |
| 08 | Vale Transporte | ✅ 6/6 | ✅ Confirmado — **achado mais grave da auditoria** (ver §3) |
| 09 | Relatórios | ❌ 0/6 | ✅ Confirmado, scaffold morto real, nada escondido |
| 10 | Perfil e Configurações | 🟡 Parcial | ⚠️ **Mais grave do que "parcial"** — `modoUso` não é setável em lugar nenhum |
| 11 | Gamificação | ❌ 0/7 | 🟡 README subestima RF-079 (streak, já funciona); superestima o resto (níveis não existem de fato) |
| 12 | Homepage | ✅ 4/4 | ✅ Confirmado, mas anuncia 3 features não prontas como se estivessem |
| 13 | Grupos | ✅ 15/15 | ✅ Confirmado, módulo maduro, 1 achado de enumeração |
| 14 | Orçamento Mensal | ✅ 7/7 | ✅ Confirmado — um dos módulos com melhor engenharia do sistema |
| 15 | Divisão de Despesas | ✅ 6/6 | ✅ Confirmado — o módulo com a engenharia mais cuidadosa de todos |
| 16 | Calendário Financeiro | ✅ 5/5 | ✅ Confirmado, sem achados relevantes |
| 17 | Dívidas Pessoais | ✅ 7/7 | ✅ Confirmado, 1 inconsistência de exibição menor |
| 18 | Planejamento de Compra | ✅ 6/6 | ✅ Confirmado, com 2 regras de negócio não implementadas como escritas |
| 19–25 | Módulos planejados (jul/2026) | ⏳ Sem código | Especificação de RF existe; **zero Regras de Negócio documentadas** para nenhum dos 7 |

**Conclusão da seção:** dos 18 módulos com código, **nenhum** teve seu status geral (✅/❌/🟡) contestado — mas **10 dos 18** tiveram pelo menos um achado de severidade média-alta ou superior. O README informa bem "o que existe"; esta auditoria acrescenta "o que existe, mas não faz exatamente o que a regra de negócio diz".

---

## 2. Gaps de Usabilidade e Jornada do Usuário

### O achado de maior impacto de experiência: a porta de entrada do produto está quebrada

Confirmado em **4 pontos independentes do código** (`Login.jsx`, `AuthCallback.jsx`, `GuestRoute`, `LandingPage.jsx`): todo login bem-sucedido, cadastro verificado, callback do Google OAuth, ou visita à home já autenticado **redireciona para `/dashboard`**, que é 100% `InDevelopmentPage`. Hoje, literalmente **todo usuário que entra no Pulso vê uma tela de "em construção"** como primeira experiência pós-login — mesmo havendo 9+ módulos financeiros inteiros e funcionais escondidos atrás do menu lateral. É o gap de UX mais barato de corrigir (trocar o destino do redirect) e o mais visível de todos. Detalhe: [Módulo 02](./02-Dashboard.md).

### A landing page vende funcionalidades que não existem

`landingData.js` anuncia "Dashboard", "IA Insights" e "Chatbot" com a mesma confiança visual dos módulos que de fato funcionam (Metas, Viagens, Grupos, Calendário). Um visitante que se cadastra atraído pelo Chatbot ("tire dúvidas em linguagem natural") encontra zero código por trás dessa promessa. Detalhe: [Módulo 12](./12-Homepage.md).

### Outros gaps de jornada relevantes

- **Cadastro apagado por falha transitória de email** (Módulo 01) e **lembrete apagado por falha de sincronização com Google** (Módulo 07) — o mesmo anti-padrão (T6) em dois pontos de entrada diferentes: o usuário perde o que acabou de criar por causa de um efeito colateral opcional que falhou.
- **Meta concluída por engano não pode ser corrigida** (Módulo 04) — mensagem de erro que contradiz o próprio bloqueio que ela descreve.
- **Categorias personalizadas quebram silenciosamente VA/VR/VT** (Módulo 03) — uma combinação de duas features "prontas" que não funcionam juntas.
- **Bloqueio de rate-limit cruzado e confuso** (Módulo 01) — usuário bloqueado em "login" por ter tentado "esqueci minha senha" antes, sem explicação clara.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### 🥇 O achado mais grave: regra de negócio escrita duas vezes, e violada mesmo assim

**Módulo 08 (Vale Transporte):** RN-013 e RN-045 dizem, de forma redundante e explícita, que **usuário CLT não pode vender VT** (é desconto em folha, uso obrigatório por lei). O código **permite a venda normalmente** e só exibe um aviso em texto reconhecendo a irregularidade ("Venda pode gerar irregularidades"). Isso não é uma lacuna — é uma regra escrita com clareza e não implementada como bloqueio.

### 🥈 Perda de dados financeiros reais

**Módulo 03 (Transações):** o botão "Excluir esta e futuras" numa transação recorrente apaga também o **histórico passado** — o oposto exato do que o texto do botão promete, porque a transação-filha nunca é gerada com data futura (só no dia em que ocorre), então "as futuras" que existem no momento da exclusão são, na prática, as já ocorridas.

### 🥉 Feature de segmentação de produto inteiramente inacessível

**Módulo 10 (Perfil):** não existe, em nenhum lugar do sistema (cadastro, API de VT, ou qualquer outro endpoint), uma forma de definir `modoUso` além do padrão `CLT`. Toda a segmentação Estagiário/PJ/Pessoa Física — e as ~25 regras de negócio associadas (RN-001 a RN-025) — está implementada no backend, mas **inalcançável por qualquer usuário real hoje**.

### Padrões recorrentes (não incidentes isolados)

| Padrão | Onde apareceu | Achado |
|---|---|---|
| Falha de efeito colateral opcional apaga o recurso principal | Auth (cadastro), Lembretes (criação) | [T6](./00-Achados-Transversais.md#t6) |
| Regra de "só 1"/"saldo suficiente" checada só na aplicação, nunca no banco | Auth (email único), Viagens (vínculo meta), VT (saldo), Grupos (viagem única, limite de metas) | [T7](./00-Achados-Transversais.md#t7) |
| Cache/rate-limit em memória de processo, não sobrevive a serverless | Auth (rate-limit), Moedas (cache de cotação) | [T5](./00-Achados-Transversais.md#t5) |
| Fórmula documentada (ex.: "média de 3 meses") implementada como "só o mês atual" | Planejamento de Compra (RN-088) | [Módulo 18](./18-Planejamento-de-Compra.md) |
| Integração entre dois módulos "prontos" que não conversam entre si | Transações × VA/VR/VT (categorias personalizadas), Planejamento de Compra × Metas (RN-093 não implementada) | [Módulo 03](./03-Transacoes.md), [Módulo 18](./18-Planejamento-de-Compra.md) |

### A correção mais importante desta própria auditoria

Uma leitura inicial (registrada no relatório do Módulo 01) concluiu que a cobertura de testes da API era ~0%, com base em 25 arquivos de teste vazios. Essa conclusão **estava errada**: a suíte real (`api/tests/unit/`, 84 arquivos, 6.800 linhas) existe, é executada pelo Jest, e a alegação de RNF-015 (~95%) não foi refutada. Isso está documentado com transparência em [00-Achados-Transversais.md § T2](./00-Achados-Transversais.md#t2--suíte-de-testes-real-da-api-vive-em-outro-diretório-do-que-o-scaffold-morto) e em [20-Requisitos-Nao-Funcionais.md](./20-Requisitos-Nao-Funcionais.md) — a correção em si é evidência de quão real é o risco do achado T1 (scaffold morto confunde análise, não só estética).

---

## 4. 💡 Novos Requisitos Propostos

Lista consolidada dos itens de maior impacto — a lista completa, por módulo, está nos relatórios individuais.

### Funcionais (Top 6)

1. **Corrigir o destino pós-login** de `/dashboard` para uma rota funcional até o Dashboard mínimo existir ([Módulo 02](./02-Dashboard.md)).
2. **Bloquear de fato (ou reescrever a regra) a venda de VT para CLT** ([Módulo 08](./08-Vale-Transporte.md)).
3. **Corrigir a exclusão de transação recorrente** para não apagar o histórico passado ([Módulo 03](./03-Transacoes.md)).
4. **Criar um caminho de escrita para `modoUso`** — mesmo antes de uma tela de Perfil completa ([Módulo 10](./10-Perfil-e-Configuracoes.md)).
5. **Permitir corrigir aportes em metas concluídas** dentro de uma janela de tolerância ([Módulo 04](./04-Metas-Financeiras.md)).
6. **Implementar RN-093** (concluir meta ao marcar item de compra como comprado) ([Módulo 18](./18-Planejamento-de-Compra.md)).

### Não funcionais (Top 6)

1. **Migrar sessão de `localStorage` para cookie `httpOnly`** — maior risco de segurança sistêmico encontrado ([Módulo 01](./01-Autenticacao.md)).
2. **Desacoplar validação recurso×categoria do nome em texto** — hoje quebra silenciosamente com categorias personalizadas ([Módulo 03](./03-Transacoes.md)).
3. **Corrigir CORS fail-open** quando `CORS_ORIGIN` está ausente em produção ([NFR](./20-Requisitos-Nao-Funcionais.md)).
4. **Adicionar rate-limit dedicado para enumeração de códigos de convite de Grupos** ([Módulo 13](./13-Grupos.md)).
5. **Remover os 25 arquivos de teste/scaffold morto** que já confundiram esta própria auditoria ([T1](./00-Achados-Transversais.md#t1)).
6. **Escrever as Regras de Negócio (RN) para os módulos 19–25** antes de qualquer implementação ([Módulos 19-25](./19-25-Modulos-Planejados.md)).

---

## 5. Plano de Ação Priorizado (Next Steps)

| Prioridade | Ação | Módulo | Esforço |
|---|---|---|---|
| 🔴 1 | Trocar destino pós-login de `/dashboard` para rota funcional | 02 | Trivial |
| 🔴 2 | Resolver contradição CLT/venda de VT (bloquear ou reescrever regra) | 08 | Baixo |
| 🔴 3 | Corrigir exclusão de transação recorrente (não apagar passado) | 03 | Baixo-Médio |
| 🔴 4 | Criar caminho de escrita para `modoUso` | 10 | Baixo-Médio |
| 🔴 5 | Migrar sessão para cookie `httpOnly` | 01 | Médio-Alto |
| 🟡 6 | Corrigir guard invertido de exclusão de aporte em meta concluída | 04 | Baixo |
| 🟡 7 | Desacoplar validação VA/VR/VT de nome de categoria em texto | 03 | Médio |
| 🟡 8 | Implementar RN-093 (concluir meta ao comprar item) | 18 | Baixo |
| 🟡 9 | Corrigir CORS fail-open em produção | NFR | Baixo |
| 🟡 10 | Corrigir `criarLembrete` para não apagar em falha de sync | 07 | Baixo |
| 🟢 11 | Rate-limit dedicado para preview/entrada de Grupos por código | 13 | Baixo |
| 🟢 12 | Remover scaffold morto (T1) — controllers/services/testes vazios | Transversal | Baixo |
| 🟢 13 | Corrigir `calcularSobraMensal` para média de 3 meses (RN-088) | 18 | Baixo |
| 🟢 14 | Unificar fórmula de "renda mensal" entre módulos | 14, 18 | Baixo-Médio |
| 🟢 15 | Escrever RN para os módulos 19–25 antes de implementar | 19-25 | Documentação |
| 🟢 16 | Rodar `jest --coverage` e confirmar cobertura de `viagemService`/`purchasePlanningService` | NFR | Baixo |
| 🟢 17 | Indicador visual "em breve" nos itens de menu/landing incompletos | 02, 12 | Trivial |

---

## Perguntas em aberto para a equipe (consolidadas)

As perguntas específicas de cada módulo estão nos respectivos relatórios. As mais estruturais, que valem decisão antes de qualquer código:

1. **`localStorage` vs. cookie `httpOnly`** — decisão consciente de MVP ou dívida técnica não percebida?
2. **Venda de VT por CLT** — a regra de negócio (bloquear) ou o comportamento atual (permitir com aviso) é a intenção real de produto?
3. **`modoUso` nunca setável** — por que esse gap nunca foi percebido, dado que o restante do backend já sabe lidar com múltiplos modos?
4. **Módulo 23 (Casal/Família)** — como reconciliar "rateio proporcional à renda" com "dados pessoais nunca visíveis" (RN-116)? É uma contradição de requisito, não só uma lacuna.
5. Existe pipeline de CI rodando `jest --coverage` de fato, ou o número de RNF-015 é reportado manualmente?

---

*Auditoria realizada por leitura completa do código-fonte de 18 módulos implementados e revisão de escopo de 7 módulos planejados, mais auditoria transversal de 16 Requisitos Não Funcionais. 20 documentos de detalhamento em `Documentacao/PO/`.*
