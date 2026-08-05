# Plans — cards e implementações

## Índice de Epics

Legenda: **✅ Entregue** · **🟡 Parcial** · **📋 Card detalhado (pré-implementação)** · **❌ Sem card**

| Epic | Card | RFs | Status código | Auditoria PO |
|------|------|-----|---------------|--------------|
| Autenticação | [Autenticacao.md](./cards/[EPIC]%20Autenticacao.md) | 001–006 | ✅ | [M01](../../Documentacao/03-Auditorias/Product Owner/01-Autenticacao.md) |
| Transações | [Gerenciamento de Transacoes.md](./cards/[EPIC]%20Gerenciamento%20de%20Transacoes.md) | 015–025, 140–141 | ✅ | [M03](../../Documentacao/03-Auditorias/Product Owner/03-Transacoes.md) |
| Vale Transporte | [Gestao de Vale Transporte.md](./cards/[EPIC]%20Gestao%20de%20Vale%20Transporte.md) | 059–066 | ✅ | [M08](../../Documentacao/03-Auditorias/Product Owner/08-Vale-Transporte.md) |
| Orçamento | [Orçamento Mensal.md](./cards/[EPIC]%20Orçamento%20Mensal.md) | 109–114 | ✅ | [M14](../../Documentacao/03-Auditorias/Product Owner/14-Orcamento-Mensal.md) |
| Dívidas | [Dívidas - Empréstimos.md](./cards/[EPIC]%20Dívidas%20-%20Empréstimos.md) | 126–132 | ✅ | [M17](../../Documentacao/03-Auditorias/Product Owner/17-Dividas-Pessoais.md) |
| Metas | [Metas Financeiras.md](./cards/[EPIC]%20Metas%20Financeiras.md) | 026–032 | ✅ | [M04](../../Documentacao/03-Auditorias/Product Owner/04-Metas-Financeiras.md) |
| Viagens + Moedas | [Viagens e Moedas.md](./cards/[EPIC]%20Viagens%20e%20Moedas.md) | 033–043 | ✅ | [M05](../../Documentacao/03-Auditorias/Product Owner/05-Viagens-e-Moedas.md) |
| Lembretes / Google | [Lembretes e Google Agenda.md](./cards/[EPIC]%20Lembretes%20e%20Google%20Agenda.md) | 054–058 | ✅ | [M07](../../Documentacao/03-Auditorias/Product Owner/07-Lembretes-e-Google-Agenda.md) |
| Homepage | [Homepage Publica.md](./cards/[EPIC]%20Homepage%20Publica.md) | 084–087 | ✅ | [M12](../../Documentacao/03-Auditorias/Product Owner/12-Homepage.md) |
| Grupos | [Grupos.md](./cards/[EPIC]%20Grupos.md) | 088–102 | ✅ | [M13](../../Documentacao/03-Auditorias/Product Owner/13-Grupos.md) |
| Divisão de Despesas | [Divisao de Despesas.md](./cards/[EPIC]%20Divisao%20de%20Despesas.md) | 115–120 | ✅ | [M15](../../Documentacao/03-Auditorias/Product Owner/15-Divisao-de-Despesas.md) |
| Calendário | [Calendario Financeiro.md](./cards/[EPIC]%20Calendario%20Financeiro.md) | 121–125 | ✅ | [M16](../../Documentacao/03-Auditorias/Product Owner/16-Calendario-Financeiro.md) |
| Planej. Compra | [Planejamento de Compra.md](./cards/[EPIC]%20Planejamento%20de%20Compra.md) | 133–138 | ✅ | [M18](../../Documentacao/03-Auditorias/Product Owner/18-Planejamento-de-Compra.md) |
| Design System | [Design System - Pulso.md](./cards/[EPIC]%20Design%20System%20-%20Pulso.md) | — | 🟡 Contínuo | — |
| Sidebar / Layout | [Sidebar.md](./cards/[EPIC]%20Sidebar.md) | — | 🟡 Contínuo | — |
| Perfil e Configurações | — | 073–078 | ⚠️ Parcial | [M10](../../Documentacao/03-Auditorias/Product Owner/10-Perfil-e-Configuracoes.md) |
| Dashboard | — | 007–014 | 🟡 Entregue (revisão PO) | [M02](../../Documentacao/03-Auditorias/Product Owner/02-Dashboard.md) |
| Auditoria PO | [META Auditoria PO 2026-08.md](./cards/[META]%20Auditoria%20PO%202026-08.md) | transversal | ✅ Correções | [Sumário](../../Documentacao/03-Auditorias/Product Owner/00-Sumario-Executivo.md) |

---

## Formato dos cards

### Cards “clássicos” (pré-implementação)

Epics longos com `[STORY BACKEND]`, `[STORY FRONTEND]`, critérios Given/When/Then — ex.: Autenticação, Transações (escritos antes/durante a implementação).

### Cards “entregue” (pós-implementação)

Epics com banner de status, rastreamento por camada, stories DATABASE/BACKEND/FRONTEND, seção **`## 🛠️ Implementação (o que foi feito)`** com cada arquivo `(EXISTENTE — IMPLEMENTADO)`, métodos, endpoints e Given/When/Then — ex.: [Metas Financeiras](./cards/[EPIC]%20Metas%20Financeiras.md) (~500 linhas).

Template compacto legado: [`_TEMPLATE-epic-entregue.md`](./_TEMPLATE-epic-entregue.md) — **não usar** para módulos entregues; preferir formato completo acima.

---

## Implementations

Planos gerados pelo [implementation-plan agent](../agents/implementation-plan.agent.md) ficam em `implementations/`:

```
implementations/
  YYYY-MM-DD-nome-da-feature.md
```

Não versionar planos descartáveis; manter só os que documentam decisões importantes.

---

## Como criar um card novo

1. Copie `_TEMPLATE-epic-entregue.md` ou duplique um epic do mesmo tipo.
2. Preencha cabeçalho (`Tipo`, `Refs`, links PO).
3. Atualize esta tabela de índice.
4. Commit: `docs(plans): adicionar epic <nome>` + `Refs: RF-xxx`
