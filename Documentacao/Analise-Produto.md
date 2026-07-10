# Análise de produto — gaps e oportunidades

> **Julho/2026** — visão baseada no código em `Codigo/Pulso/` e no schema Prisma.

## O que já é sólido

- **Core financeiro:** auth (email + Google), transações com recorrência, categorias, **tags (CRUD)**, orçamento com alertas.
- **Operacional:** vale transporte por `modoUso`, calendário + lembretes + sync Google Calendar.
- **Planejamento:** metas com aportes, dívidas com pagamentos parciais, viagens com despesas/observações.
- **Viagens (diferencial):** GeoNames, estimativas sazonais, Duffel opcional, conversor de moedas.
- **Grupos (social):** lista + detalhe, membros, viagem compartilhada, pretensões, metas, aportes, chat paginado, notificações de grupo — ver [Modulos/Grupos.md](./Modulos/Grupos.md).
- **Notificações:** sino paginado (20 + “Ver mais”), retenção 30d lidas, tipos RECEITA/DESPESA/STREAK/CONQUISTA/INSIGHT (MVP rule-based).
- **Qualidade:** testes extensos na API e boa cobertura em utils/services do web.

## Gaps principais

### 1. Navegação vs realidade

A sidebar lista módulos que ainda abrem `InDevelopmentPage`: `/dashboard`, `/purchase-planning`, **`/expense-split`**, `/reports`, `/insights`, `/chatbot`, `/achievements`, `/profile`, `/settings`.

**Sugestão:** dashboard mínimo ou ocultar links até lançar.

### 2. Perfil e configurações

`modoUso`, renda fixa, VA/VR/VT e preferências existem no banco mas **não têm tela**. VT depende disso.

**Sugestão:** `/settings` (RF-073–077, RF-103–104).

### 3. IA prometida, parcial

Landing + enum `INSIGHT_IA`. Hoje: regra simples na API (maior gasto do mês). **Gemini** e chatbot (`MensagemChat`) ainda sem provider.

### 4. Gamificação — backend sim, UI não

API: streak/conquistas ao registrar transação/meta; notificações apontam para `/achievements` (placeholder).

**Sugestão:** tela mínima de conquistas + streak.

### 5. Divisão de despesas (`/expense-split`)

Módulo **não implementado** (RF-115–120). O detalhe do grupo tem **MVP RF-095** (pretensão + divisão igual, só UI). Quando `/expense-split` existir, **vincular** ou migrar essa lógica — não duplicar split bill no card de viagem.

### 6. Grupos — gaps reais restantes

Upload de imagem (arquivo) e UX de foto no criar/editar **já foram entregues** — ver [Modulos/Grupos.md](./Modulos/Grupos.md). Restam:

| Gap | Prioridade |
|-----|------------|
| Chat tempo real | Média |
| RF-095 completo via expense-split | Média (após módulo) |
| Testes E2E grupos | Média |

Detalhe: [Modulos/Grupos.md](./Modulos/Grupos.md).

### 7. Integrações opcionais

| Integração | Gap |
|------------|-----|
| Duffel live | Token `duffel_live_` |
| GeoNames | Ativar “Free Web Services” |
| Storage de imagens | Upload de perfil (grupo já usa multer) |
| Tokens Google | Criptografia em repouso |

## Prioridade sugerida

| # | Entrega | Por quê |
|---|---------|---------|
| 1 | Dashboard | Primeira tela útil pós-login |
| 2 | Perfil / `modoUso` | Desbloqueia VT e onboarding |
| 3 | `/achievements` mínimo | Fecha loop notificações gamificação |
| 4 | Gemini insights MVP | Diferencial landing |
| 5 | **`/expense-split`** | RF-095 completo + sidebar coerente |

## Lógicas que já funcionam bem (manter)

- Estimativas de transporte com ajuste sazonal.
- Fallback Duffel → Amadeus → estimativa regional.
- GeoNames + catálogo híbrido.
- Jobs orçamento, lembretes, dívidas, limpeza notificações.
- Grupos: fallback imagem viagem → capa destino.

---

*Atualize este documento quando um gap for fechado ou uma nova prioridade surgir.*
