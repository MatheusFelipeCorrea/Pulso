# Auditoria UX Pulso — Sumário executivo e decisões canônicas

**Produto:** Pulso  
**Locale:** pt-BR  
**Kit:** Hyperion `ux-audit` (unattended: fases 1–3 + consolidação)  
**Overlay:** nenhum  
**Data:** 2026-09-30  
**Código:** sem alterações de UI (somente relatórios)  
**Fontes:** `Codigo/Pulso/web/src`, `Codigo/Pulso/mobile/lib`, `docs/prototipos/`, `docs/5.wireframe.md`, `.github/project.yml`

Relatórios:

- [Fase 1 — fundamentos e tokens](./design-fase-1-fundamentos-tokens.md)
- [Fase 2 — componentes e padrões](./design-fase-2-componentes-padroes.md)
- [Fase 3 — jornadas](./design-fase-3-jornadas.md)

---

## 1. Experiência geral

O Pulso **já tem linguagem visual própria** (violeta `#7C3AED`, Inter, zinc, par claro/escuro) e um DS web usado nas jornadas do recorte. Flutter **espelha os tokens**. Os exports em `docs/prototipos/` (Auth, Transações, Metas, Viagens e Moedas × claro/escuro) são uma referência sólida; a web chega perto nas listas de transações, metas e viagens.

O que quebra a consistência não é a marca — é **sair do contrato**: hex nas features, barrel do DS incompleto, IA diferente entre web e app, e **links globais para páginas que não existem**. Acessibilidade básica (WCAG AA) está a meio caminho: focus-visible e `aria-label` em icon buttons vs `lang="en"`, modal sem trap, auth só com placeholder.

**Objetivo desta auditoria:** uma decisão canônica por inconsistência. Sem redesign.

---

## 2. Contagem por severidade

| Severidade | Qtde | IDs |
|------------|------|-----|
| Crítica | **1** | UX-3-01 |
| Alta | **10** | UX-1-01, UX-1-03, UX-2-01, UX-2-02, UX-2-03, UX-2-04, UX-3-02, UX-3-03, UX-3-04, UX-3-05 |
| Média | **13** | UX-1-02, UX-1-04, UX-1-05, UX-1-06, UX-1-07, UX-2-05, UX-2-06, UX-2-07, UX-2-08, UX-2-09, UX-3-06, UX-3-07, UX-3-08 |
| Baixa | **3** | UX-1-08, UX-2-10, UX-3-09 |
| **Total** | **27** | Fases 1 (8) · 2 (10) · 3 (9) |

Pontos positivos (não contam como achado): tokens web↔Flutter alinhados; botão primário fixo no dark; toasts; SpinnerDots; Tabs de metas; detalhe de viagem como página; Semantics de valor no tile Flutter; protótipos light/dark.

---

## 3. Decisões canônicas

Cada item abaixo **substitui** as variações encontradas. Implementação é outro passo.

| ID | Decisão | Substitui | Achados |
|----|---------|-----------|---------|
| **CD-01** | Fonte única de cor/espaço/tipo: `--ds-*` (`tokens.css`) e `PulsoColors` / `PulsoTokens`. Tailwind `@theme` só **alias** para as mesmas vars. Features sem hex semântico. | Hex `#16a34a`, `#22c55e`, `#DC2626`, catálogo paralelo em `globals.css` | UX-1-01, UX-1-02 |
| **CD-02** | Hover de danger/success é token (`--ds-color-*-hover`) nos dois temas, não hex no `.btn-*`. | Hover hardcoded em `base.css` | UX-1-02 |
| **CD-03** | Idioma do produto: **pt-BR** (`html lang`, Flutter `Locale('pt','BR')` + delegates). | `lang="en"`; Material sem locale | UX-1-03 |
| **CD-04** | Breakpoints: **480 / 768 / 1024** (iguais a `useMediaQuery`). | 1100, 720, 899, 900, 640 como “tablet” de feature | UX-1-04 |
| **CD-05** | Tema na UI: **Claro · Escuro · Sistema** nos dois clientes; persistir `system` de verdade. | Toggle binário que apaga system | UX-1-05 |
| **CD-06** | Ícone de empty = **primary** (light e dark). | `--ds-color-empty-icon: #71717A` no dark | UX-1-06 |
| **CD-07** | Foco visível: **2px** `var(--ds-color-primary)`, offset 2px, `:focus-visible`. Inputs podem somar ring; não zerar outline em confirm/campos. | `*:focus { outline: none }` + 3 receitas de ring | UX-1-07 |
| **CD-08** | Escala de espaço só `--ds-space-*` / `PulsoTokens.space*`. Uma família mono (alinhar Fira vs JetBrains — **escolher JetBrains** se Tailwind for o alias de código). | `0.375rem`, padding 14 soltos, dois monos | UX-1-08 |
| **CD-09** | Empty: componente DS (`EmptyState` / `PulsoEmptyState`) no barrel. Sempre **título + descrição**; **CTA primária** se a tela tem criar. | Empty de transações web sem ação; imports por path | UX-2-01, UX-3-06 |
| **CD-10** | Modal: `aria-labelledby`, focus trap, focar título/primeiro campo, devolver foco ao gatilho. | Dialog “mudo” | UX-2-02 |
| **CD-11** | Campos de auth (e equivalentes): **label visível persistente** + `htmlFor` / `labelText`. Placeholder não substitui label. | Login só com placeholder/hint | UX-2-03 |
| **CD-12** | Forms longos: **modal DS na web**, **tela ou sheet no Flutter**. **Mesmos campos e copy**. Confirmação curta: `ConfirmModal` / `showPulsoConfirm`. Diálogo extra só para recorrência. | AlertDialog mínimo de aporte/pretensão; `TripDetailModal` morto | UX-2-04, UX-2-05, UX-2-09, UX-3-07 |
| **CD-13** | Loading de lista: web **SpinnerDots**; Flutter **CircularProgressIndicator** + Semantics. Frase: “Carregando {transações\|metas\|viagem}...”. | Spinner sem nome; misturar famílias sem regra | UX-2-07 |
| **CD-14** | Barrel DS exporta Tabs, Pagination, EmptyState, InputSearch, Avatar. Features não importam o `.jsx` interno desses primitivos. | `index.js` com NAVIGATION TODO | UX-2-08 |
| **CD-15** | Alvo de toque de icon actions: **≥ 40px** (visual sm 32 ok com padding de hit). | `iconbtn-sm` 32 + `shrinkWrap` | UX-2-06 |
| **CD-16** | **IA do recorte** (não a sidebar antiga do PNG): Início/Dashboard → Transações → Metas → Viagens e Moedas (Premium). Ordem igual na lista Flutter. Nav item **Metas**; H1 **Metas Financeiras**. **Viagens e Moedas** (M maiúsculo). Sem Grupos, Perfil, Configurações até existirem. Header mobile web com o título da seção. | Grupos no app; Perfil/Config mortos; “Início” vs “Dashboard” no meio da lista; título “Pulso” | UX-2-10, UX-3-01, UX-3-03, UX-3-08 |
| **CD-17** | Pós-login **enquanto Dashboard for stub:** `/transactions` (web e Flutter). Item Dashboard/Início só se mostrar conteúdo no nível da `HomeScreen` Flutter — senão ocultar. Catch-all autenticado → `/transactions`, **nunca** landing. | `DEFAULT_AUTHENTICATED_ROUTE = '/dashboard'`; `*` → `/` | UX-3-01, UX-3-02, UX-3-09 |
| **CD-18** | Premium: **esconder** Viagens na nav se FREE (web já faz; Flutter igual). Deep link: EmptyState de plano, mesma copy, sem fingir lista. | Item visível + beco “são Premium” | UX-3-04 |
| **CD-19** | Gasto planejado em viagem chama-se **pretensão** (nunca “Nova despesa” nessa jornada). | Copy Flutter; filename `Pretenção` nos assets | UX-3-05 |
| **CD-20** | Erro de **carga de lista:** EmptyState + **Tentar de novo**. Toast para **mutação**. | Só toast na web; error sem retry em metas Flutter | UX-3-06 |
| **CD-21** | Sidebar extra dos PNGs (Carteiras, Orçamentos, Relatórios, promo recorrência): **fora do recorte** — não reintroduzir na nav. | Tentação de copiar o Figma completo | UX-3-08 |

Laranja de badge VR `#EA580C` **permanece** distinto de `--ds-color-warning` (recurso vs alerta) — não é inconsistência a fundir.

---

## 4. Quick wins (alto impacto, baixo desenho)

1. `lang="pt-BR"`; Flutter locale pt-BR.  
2. Remover/desabilitar `/profile` e `/settings`; autenticado `*` → `/transactions`.  
3. Default pós-login = `/transactions`.  
4. CTA no empty de transações web; esconder Grupos no Flutter.  
5. “Nova pretensão” no detalhe Flutter.  
6. `--ds-color-empty-icon` no dark = primary; greens de `goals.css` → `var(--ds-color-success)`.  
7. Exportar EmptyState/Tabs/Pagination no barrel; `label` no Login.

---

## 5. Roadmap incremental

| Fase | Foco | Saída verificável |
|------|------|-------------------|
| A — Chrome | Links mortos, default login, IA recorte, Premium nav Flutter | Ninguém cai na landing logado; mesmos quatro destinos |
| B — A11y base | lang, labels, modal trap, empty-icon, focus | Login e um modal passam teclado + AT |
| C — Tokens | Hex de feature → `--ds-*`; hover semântico; breakpoints | grep de verdes soltos = 0 |
| D — Paridade de jornada | Aporte/pretensão Flutter = campos web; tríade loading/empty/error | Checklist do PNG de pretensão no app |
| E — DS hygiene | Barrel, hit-area 40px, tema Sistema | Imports só pelo `components/index.js` |

Risco de adoção: telas novas de viagens (`trips.css` já é o maior repositório de hex) tendem a **não** usar token se CD-01 não for lint/convenção de PR.

---

## 6. Limitações desta auditoria

- Contraste WCAG calculado por inspeção de hex, sem medição em runtime (tema, overlays, imagens de capa de viagem).  
- Protótipos avaliados pelos PNGs + wireframe; nomes de arquivo com encoding (`Pretenção`) não alteram a decisão de copy.  
- Sem Storybook/Chromatic.  
- Dashboard, grupos, perfil, billing de Premium: jornadas incompletas por produto, não por “variação estética”.

Nenhuma pergunta adicional bloqueia as decisões **CD-01–CD-21**; a única dependência de produto já está escrita em CD-17 (quando o Dashboard deixar de ser stub, o default pós-login volta para `/dashboard`).
