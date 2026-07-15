# 🏠 Módulo 12 — Homepage (Landing Page) — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [02-Dashboard.md](./02-Dashboard.md), [06-Insights-e-Chatbot.md](./06-Insights-e-Chatbot.md), [11-Gamificacao.md](./11-Gamificacao.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-084–087).
> Código auditado: `web/src/pages/LandingPage.jsx`, `web/src/components/features/landing/landingData.js`, `web/src/components/features/landing/LandingHero.jsx`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **✅ 4/4**, confirmado tecnicamente — a landing existe, é responsiva, tem CTAs e seções de funcionalidades. O achado desta auditoria não é sobre a implementação da homepage em si, mas sobre **o que ela promete**: a seção "Funcionalidades" (`landingData.js:44-93`) lista 8 módulos com descrições em tempo presente e confiante, mas **3 deles (Dashboard, Chatbot, e parte de Gamificação/Insights) estão em 0% ou próximo disso**, conforme confirmado nos Módulos 02, 06 e 11 desta auditoria. Um visitante que se cadastra atraído por "Chatbot: Tire dúvidas sobre suas finanças em linguagem natural" ou "Dashboard: Visão em tempo real das suas finanças" encontra, hoje, uma tela "em desenvolvimento" para ambos.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-084 | Homepage pública apresentando o Pulso | ✅ | Confirmado, `LandingPage.jsx` monta hero + seções + footer |
| RF-085 | CTAs (Cadastrar e Entrar) | ✅ | Confirmado (não aprofundado no `LandingHero`/`PublicHeader`, mas presente na estrutura) |
| RF-086 | Seções com os principais módulos (dashboard, metas, viagens, insights, chatbot, gamificação) | ✅ | Confirmado que as seções existem — mas ver achado crítico na seção 3 sobre a precisão do que é anunciado |
| RF-087 | Responsiva, paleta Vital Purple | ✅ | Não auditado pixel a pixel neste módulo (fora do escopo de leitura de código estático), mas a estrutura de componentes segue o padrão do design system usado em todo o app |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **A homepage já reforça o problema do Módulo 02.** `LandingPage.jsx:30-32` redireciona qualquer usuário já autenticado direto para `/dashboard` — a quarta ocorrência confirmada nesta auditoria do mesmo destino quebrado (as outras três: `Login.jsx`, `AuthCallback.jsx`, `GuestRoute`). Reforça que a correção proposta no Módulo 02 (trocar o destino padrão) tem efeito amplo, tocando múltiplos pontos de entrada.
2. **Nenhuma seção da landing indica "em breve" para os módulos não implementados.** Isso é uma escolha de marketing legítima em fases iniciais de produto (comum em MVPs "aspiracionais"), mas tem custo real de expectativa: um usuário que se cadastra hoje pela promessa do Chatbot ou do Dashboard tem uma primeira experiência de produto pior do que a esperada pela landing — o oposto do que a landing deveria fazer.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado — Descompasso entre a seção "Funcionalidades" da landing e o estado real dos módulos

| Feature anunciada (`landingData.js:44-93`) | Texto de marketing | Estado real (confirmado nesta auditoria) |
|---|---|---|
| Dashboard | "Visão em tempo real das suas finanças, receitas, despesas e saldo." | **0% implementado** ([Módulo 02](./02-Dashboard.md)) — cai em `InDevelopmentPage` |
| Metas | "Defina objetivos e acompanhe o progresso mês a mês." | ✅ Implementado de verdade ([Módulo 04](./04-Metas-Financeiras.md)) |
| Viagens | "Planeje viagens com câmbio, orçamento e metas dedicadas." | ✅ Implementado de verdade ([Módulo 05](./05-Viagens-e-Moedas.md)) |
| IA Insights | "Dicas automáticas baseadas no seu perfil e hábitos." | **~0% implementado** ([Módulo 06](./06-Insights-e-Chatbot.md)) — existe 1 notificação de regra fixa ("maior gasto do mês"), não "dicas" (plural) nem baseadas em "perfil e hábitos" |
| Chatbot | "Tire dúvidas sobre suas finanças em linguagem natural." | **0% absoluto** ([Módulo 06](./06-Insights-e-Chatbot.md)) — nenhuma rota, nenhum provider, nenhum componente com conteúdo |
| Gamificação | "Sequências, conquistas e desafios para manter o foco." | 🟡 Parcial — sequências (streak) funcionam de verdade; conquistas existem mas só 3 no catálogo; **desafios não existem** ([Módulo 11](./11-Gamificacao.md)) |
| Grupos | "Metas compartilhadas com amigos, família ou colegas." | ✅ Implementado de verdade ([Módulo 13](./13-Grupos.md), a auditar) |
| Calendário | "Vencimentos, lembretes e compromissos financeiros." | ✅ Implementado de verdade ([Módulo 07](./07-Lembretes-e-Google-Agenda.md), [Módulo 16](./16-Calendario-Financeiro.md), a auditar) |

**Severidade:** Média-Alta — não é uma regra de negócio no sentido técnico, mas é uma questão de credibilidade de produto: 3 de 8 promessas da vitrine principal do produto não correspondem à experiência real pós-cadastro. Isso tem relação direta com RF-151 (onboarding, "eliminar o cold start") — se o onboarding um dia existir, ele herda a expectativa que a landing já criou.

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-L1** — Adicionar um indicador discreto ("em breve"/"beta") nos cards de Dashboard e Chatbot na seção de Funcionalidades da landing, até que esses módulos tenham ao menos uma versão mínima funcional — reduz o descompasso de expectativa sem precisar remover a visão de produto da vitrine.
- **RF-NOVO-L2** — Ajustar o texto de "IA Insights" para refletir o que existe hoje (um alerta de maior gasto do mês) até que o Gemini seja integrado, evitando prometer "dicas" (plural, personalizadas) que ainda não existem.

### Não funcionais

- Nenhum item de infraestrutura identificado neste módulo além dos já cobertos em Dashboard/Insights/Gamificação.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟡 Adicionar indicador "em breve" nos cards de Dashboard e Chatbot (RF-NOVO-L1) | Alinha expectativa de marketing com a experiência real pós-cadastro, sem exigir nenhuma mudança de escopo de produto | Trivial |
| 2 | 🟢 Ajustar o texto de "IA Insights" para não prometer mais do que a regra fixa atual entrega (RF-NOVO-L2) | Mesma lógica do item 1, granularidade menor | Trivial |
| 3 | 🟢 Corrigir os 4 pontos de redirecionamento pós-login para não caírem no Dashboard vazio — já proposto no Módulo 02, reforçado aqui por mais uma ocorrência confirmada | Ver Módulo 02 para o plano completo | Ver Módulo 02 |

---

## ❓ Perguntas clarificadoras

1. A estratégia de marketing atual é deliberadamente "vender a visão completa do produto" mesmo com módulos ainda não entregues (comum em landing pages de MVP em fase de captação), ou vocês preferem que a landing reflita com mais precisão o que já está disponível hoje?

---

*Próximo módulo sugerido: 13 — Grupos (o módulo social mais complexo do sistema, com documentação técnica própria em `Modulos/Grupos.md` para cruzar).*
