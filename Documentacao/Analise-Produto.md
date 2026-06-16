# Análise de produto — gaps e oportunidades

> **Junho/2026** — visão baseada no código em `Codigo/Pulso/` e no schema Prisma.

## O que já é sólido

- **Core financeiro:** auth (email + Google), transações com recorrência, categorias, tags, orçamento com alertas.
- **Operacional:** vale transporte por `modoUso`, calendário + lembretes + sync Google Calendar.
- **Planejamento:** metas com aportes, dívidas com pagamentos parciais, viagens com despesas/observações.
- **Viagens (diferencial):** busca GeoNames, estimativas sazonais (avião/ônibus/trem), cotação Duffel opcional, conversor de moedas.
- **Qualidade:** testes extensos na API (services, jobs, providers) e boa cobertura em utils/services do web.

## Gaps principais

### 1. Navegação vs realidade

A sidebar lista **todos** os módulos, mas `/dashboard` (rota padrão) e vários itens ainda abrem `InDevelopmentPage`. O usuário cai em placeholder ao explorar o menu.

**Sugestão:** entregar dashboard mínimo ou esconder links não prontos até lançar.

### 2. Perfil e configurações

`modoUso` (Estagiário/CLT/PJ/PF), renda fixa, VA/VR/VT e preferências existem no banco mas **não têm tela**. VT e regras de benefício dependem disso.

**Sugestão:** `/settings` com modo de uso + renda + tema + exclusão de conta (RF-073–077, RF-103–104).

### 3. IA prometida, não implementada

`GEMINI_API_KEY` no `.env`, modelos `MensagemChat` e `HistoricoScore`, landing citando insights — **zero provider** no `api/src`.

**Sugestão (MVP):** insights mensais no dashboard (“gastou X% a mais em alimentação”) antes do chatbot completo.

### 4. Gamificação órfã

Schema `Conquista`, `Sequencia`, seed básico — sem API, sem `/achievements`, sem notificação `CONQUISTA` / `STREAK`.

**Sugestão:** streak ao registrar transação + 3 conquistas iniciais (primeira meta, 7 dias seguidos, orçamento no verde).

### 5. Grupos sociais

Prisma completo (`Grupo`, `ViagemGrupo`, …), seletor de grupo **desabilitado** no formulário de viagem.

**Sugestão:** epic separado após dashboard + perfil; alto esforço, alto valor social.

### 6. Documentação e testes defasados

Requisitos e READMEs foram revisados em jun/2026. `viagemService` ainda com poucos testes de integração.

### 7. Integrações opcionais

| Integração | Gap |
|------------|-----|
| Duffel live | Conta + token `duffel_live_` para preços reais |
| GeoNames | Ativar “Free Web Services” na conta |
| Tags | Sem editar/excluir (aceitável no MVP) |
| `META_ATINGIDA` | Enum existe; job/notificação não dispara |

## Funcionalidades legais para implementar

### Curto prazo (reuso máximo do que existe)

1. **Dashboard** — cards: saldo do mês, orçamento, meta mais próxima, próxima viagem, lembretes.
2. **Notificação de meta atingida** — ao cruzar 100% em `metaService`.
3. **Links externos de passagem** — ClickBus/Buser/Google Flights com origem/destino/data (sem scrape).
4. **Histórico de cotação na viagem** — salvar snapshot semanal da estimativa aérea para ver tendência.
5. **Perfil/settings** — destrava VT e onboarding de renda fixa.

### Médio prazo

6. **Relatórios** — PDF/CSV (deps já instaladas: `recharts`, `@react-pdf/renderer`, `papaparse`).
7. **Insights Gemini** — resumo mensal + alertas (“categoria X estourou 2 meses seguidos”).
8. **Chatbot contextual** — perguntas sobre saldo, metas e viagem ativa.
9. **Gamificação leve** — conquistas + desafio mensal.
10. **Tags CRUD** — editar/excluir se usuários pedirem.

### Longo prazo

11. **Grupos** — viagem compartilhada, despesas divididas, meta coletiva.
12. **Divisão de despesas** e **planejamento de compra** — ainda só na sidebar.
13. **Criptografia** dos tokens Google em repouso.
14. **Rate limit global** (RNF-004) além de auth.

## Prioridade sugerida

| # | Entrega | Por quê |
|---|---------|---------|
| 1 | Dashboard | Primeira tela após login deixa de ser placeholder |
| 2 | Perfil / `modoUso` | Desbloqueia regras já codificadas |
| 3 | Meta atingida + polish viagens | Fecha loop metas/viagens |
| 4 | Gemini insights MVP | Diferencial prometido na landing |
| 5 | Gamificação mínima | Engajamento com schema pronto |
| 6 | Grupos | Epic social |

## Lógicas que já funcionam bem (manter)

- Estimativas de transporte com **ajuste sazonal** por data da viagem (sem depender de API paga).
- **Fallback em camadas:** Duffel → Amadeus → estimativa regional.
- **GeoNames + catálogo** híbrido para destinos.
- Jobs de orçamento, lembretes e dívidas com notificações no sino.

---

*Atualize este documento quando um gap for fechado ou uma nova prioridade surgir.*
