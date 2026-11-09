# Auditoria UX — Fase 1: fundamentos e tokens

**Produto:** Pulso  
**Locale:** pt-BR  
**Overlay:** nenhum (`audits.overlay: null` em `.github/project.yml`)  
**Data:** 2026-09-30  
**IDs:** `UX-1-NN`  
**Escopo desta fase:** cores, tipografia, espaçamento, raios, sombras, temas claro/escuro, densidade, iconografia e alinhamento web × Flutter × protótipos.

---

## 1. Resumo executivo

O Pulso **já tem um sistema de tokens real**, não um palpite de marca. Web centraliza variáveis em `tokens.css` (prefixo `--ds-*`, temas `:root` e `.dark`); Flutter espelha os mesmos hex e a escala 4/8/12/16 em `PulsoColors` / `PulsoTokens`, com Inter via Google Fonts. Protótipos em `docs/prototipos/` confirmam o violeta `#7C3AED`, superfícies zinc e o par claro/escuro.

A inconsistência dominante **não é a paleta** — é **sair do token**. Folhas de feature (`goals.css`, `trips.css`) e hovers de botão no DS usam verdes/vermelhos Tailwind (`#16a34a`, `#22c55e`, `#DC2626`) em vez de `--ds-color-success` / `--ds-color-danger`. Há um **segundo catálogo** em `globals.css` (`@theme`) e literais `rem` no CSS de componente. Locale do documento web está em inglês (`lang="en"`) num produto pt-BR.

Padronizar tokens (uma fonte, zero hex de semântica nas features) resolve a maior parte da deriva visual **sem redesenhar**.

---

## 2. Escopo e contexto detectado

| Unidade | Path | Papel observado |
|---------|------|-----------------|
| Web DS | `Codigo/Pulso/web/src/design-system/styles/tokens.css` | Tokens CSS light/dark |
| Web Tailwind | `Codigo/Pulso/web/src/styles/globals.css` | `@theme` paralelo (mesmos hex de marca) |
| Web features | `Codigo/Pulso/web/src/styles/{auth,transactions,goals,trips,sidebar}.css` | Overrides de jornada; muitos hex |
| Flutter | `Codigo/Pulso/mobile/lib/core/theme/{pulso_tokens,pulso_colors,pulso_theme,theme_controller}.dart` | ThemeData M3 alinhado ao CSS |
| Protótipos | `docs/prototipos/` (Auth, Transações, Metas, Viagens e Moedas × claro/escuro) | Referência visual do recorte |
| Wireframe | `docs/5.wireframe.md` | Inventário de telas do recorte atual |

**Frameworks:** React + Vite + CSS variables + Tailwind v4; Flutter Material 3 + `google_fonts` Inter.  
**Temas:** classe `.dark` no `<html>` (web); `ThemeMode` + `SharedPreferences` (Flutter).  
**N/A:** Storybook/Chromatic, tokens de motion além de duração, RTL, densidade compact/comfortable como escala nomeada, auditoria contrastivista instrumental (só inferência pelos hex).

### Inventário de tokens (fonte canônica observada)

| Família | Web (`tokens.css`) | Flutter | Notas |
|---------|--------------------|---------|--------|
| Primary | `#7C3AED` / light `#A78BFA` | iguais | Dark troca primary para `#A78BFA`; **botão** permanece `#7C3AED` |
| Superfície light | bg `#FAFAFA`, card `#FFFFFF`, surface `#F4F4F5` | iguais | |
| Superfície dark | bg `#09090B`, card/surface `#18181B` | iguais | |
| Texto | `#18181B` / secondary `#71717A` | iguais | Dark texto `#FAFAFA` / `#A1A1AA` |
| Semântica | success `#10B981`, danger `#EF4444`, warning `#F59E0B`, info `#3B82F6`, orange `#EA580C` | iguais (+ variantes Dark) | Features **não** usam isso de forma uniforme |
| Espaço | 4–64 px (`--ds-space-*`) | `space1`–`space16` | |
| Raio | 4 / 8 / 12 / 16 / 999 | iguais | Cards Flutter usam `radiusXl` |
| Tipo | Inter; 12–32 px | Inter; mesmos tamanhos | Mono: Fira (tokens) vs JetBrains (`globals.css`) |
| Sombra | sm–xl light; **none** no `.dark` | `shadowSm/Md` vazios no dark | Alinhado |
| Motion | 150 / 200 / 300 ms | `durationFast/Normal/Slow` | `prefers-reduced-motion` em `animations.css`, `auth.css`, `sidebar.css` |

---

## 3. Achados priorizados

### UX-1-01 — Três catálogos de cor em paralelo (CSS vars, Tailwind `@theme`, hex de feature)

- **Evidência:** `Codigo/Pulso/web/src/design-system/styles/tokens.css:15-71` (`--ds-color-*`). `Codigo/Pulso/web/src/styles/globals.css:8-37` (`@theme` com `--color-primary-500: #7C3AED` e escalas success/danger). `Codigo/Pulso/web/src/styles/goals.css:171-177` (`#16a34a`, `#22c55e`, `#d97706`). `Codigo/Pulso/web/src/styles/trips.css:50` (`background: #22c55e`). `Codigo/Pulso/mobile/lib/core/theme/pulso_colors.dart:3-24` (comentário de espelho do CSS).
- **Constatação:** A intenção documentada é “componentes usam `--ds-*`” (`tokens.css:5-8`). Features e `@theme` reintroduzem a paleta por outro nome. Flutter permanece alinhado ao CSS, não ao Tailwind.
- **Impacto:** Mesmo estado (sucesso, pausa, cotação positiva) muda de verde entre transações (token) e metas/viagens (hex). Dark mode das features não acompanha `--ds-color-success` (`#34D399`).
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** **Canônico:** `--ds-*` / `PulsoColors` únicos. `@theme` só como alias (`--color-success-500: var(--ds-color-success)`). Proibir hex semântico em `styles/*.css` de feature.
- **Critério de validação:** grep `#16a34a|#22c55e|#DC2626|#059669` em `web/src` = 0 (exceto `tokens.css` / `globals.css` alias).

### UX-1-02 — Semântica de sucesso/perigo fora do token no próprio DS

- **Evidência:** `Codigo/Pulso/web/src/design-system/styles/base.css:419-443` (`.btn-danger:hover` `#DC2626`, active `#B91C1C`; `.btn-success:hover` `#059669`, active `#047857`). `tokens.css:66-67` (success/danger sem tokens de hover).
- **Constatação:** Primary já tem `--ds-color-button-primary-hover`. Danger/success improvisam a rampa no CSS do botão.
- **Impacto:** Hover de excluir/confirmar diverge do restante do tema escuro (danger vira `#F87171` no dark, hover continua vermelho-600 de light).
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Adicionar `--ds-color-danger-hover` / `--ds-color-success-hover` (light e `.dark`) e apontar `.btn-danger`/`.btn-success` para eles.
- **Critério de validação:** nenhum hex em `base.css` na seção de botões além de `white`.

### UX-1-03 — Idioma da página e do Material divergem do produto pt-BR

- **Evidência:** `Codigo/Pulso/web/index.html:2` (`<html lang="en">`). `Codigo/Pulso/mobile/lib/app.dart:58-65` (`MaterialApp.router` sem `locale` / `supportedLocales`). Conteúdo e `formatCurrency.js:20` usam `pt-BR`.
- **Constatação:** Leitores de tela e widgets nativos (datas, “OK/Cancel” de pickers Flutter) herdam inglês. O produto, protótipos e copy são pt-BR.
- **Impacto:** WCAG 3.1.1 (idioma da página). Contraste de compreensão, não de cor.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** `lang="pt-BR"` no HTML. Flutter: `locale: Locale('pt', 'BR')` + delegates `GlobalMaterialLocalizations`.
- **Critério de validação:** `document.documentElement.lang === 'pt-BR'`; date picker Flutter em português.

### UX-1-04 — Grade de breakpoints local contradiz o hook do DS

- **Evidência:** `Codigo/Pulso/web/src/design-system/hooks/useMediaQuery.js:53-62` (mobile &lt; 768, tablet 768–1023, desktop ≥ 1024). `goals.css:1201-1363` (1100 / 768 / 480). `trips.css:2986-3005` (1100 / 720). `transactions.css:517-535` (1024 / 768). `landing.css:1864-1911` (900 / 1024 / 899 / 640). `components.css:635,1673,1867` (640 / 768 / 480).
- **Constatação:** Não há tokens `--ds-bp-*`. Cada folha escolhe um “quase tablet”.
- **Impacto:** Sidebar (1024) e lista de metas (1100) quebram em larguras diferentes; 720 vs 768 na viagem.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** **Canônico:** 480 (narrow), 768, 1024 — os mesmos do hook. Substituir 1100/720/899/900.
- **Critério de validação:** media queries de produto só nesses três valores (landing pode permanecer exceção documentada).

### UX-1-05 — Preferência de tema “sistema” existe no storage e some na UI

- **Evidência:** `Codigo/Pulso/web/src/design-system/hooks/useTheme.js:28-36,65,87-90` (`preference` `system|light|dark`). `Codigo/Pulso/web/src/components/layouts/UserMenu/UserMenu.jsx:96-117` (só Claro/Escuro). `Codigo/Pulso/mobile/lib/core/theme/theme_controller.dart:10-21` (lê `'system'` mas `setMode` força light/dark). `Codigo/Pulso/mobile/lib/core/widgets/app_shell.dart:243-252` (SegmentedButton Claro/Escuro).
- **Constatação:** Boot web respeita `prefers-color-scheme` se a preferência for `system`; o menu **não oferece** Sistema e, ao clicar Claro/Escuro, grava overide. Flutter até descarta system ao salvar.
- **Impacto:** Quem escolheu “seguir o OS” (default do hook) perde o modo ao usar o toggle. Cross-client: mesma chave `ds-theme-preference`, comportamentos diferentes.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Três opções visíveis: Claro, Escuro, Sistema — web e Flutter. `setMode` Flutter deve persistir `'system'`.
- **Critério de validação:** UI com três estados; OS dark + preferência system ⇒ `.dark` / `ThemeMode.system`.

### UX-1-06 — Token de empty-icon muda de significado no escuro

- **Evidência:** `tokens.css:97` light `--ds-color-empty-icon: var(--ds-color-primary)`. `tokens.css:249` dark `--ds-color-empty-icon: #71717A`.
- **Constatação:** Empty states do DS usam ilustração na cor primária no claro e cinza no escuro. Flutter `PulsoEmptyState` usa `PulsoColors.accent` nos dois temas (`pulso_feedback.dart:56`).
- **Impacto:** Empty de metas/viagens “some” no dark; Flutter permanece violeta.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** **Canônico:** empty-icon = primary (ou primary-light no dark), nos dois clientes. Cinza só para ícones decorativos muted.
- **Critério de validação:** screenshot empty metas light/dark com o mesmo papel de destaque.

### UX-1-07 — Anel de foco não é um token; reset global remove outline

- **Evidência:** `base.css:71-78` (`*:focus { outline: none }` + `*:focus-visible` 2px primary). `components.css:66-68` (input: ring 3px mix 12%). `components.css:142-144` (textarea: box-shadow 1px na borda de focus). `Button.styles.jsx:13` (`focus:outline-none` no CVA).
- **Constatação:** Três receitas de foco. O reset `*:focus { outline: none }` é seguro só se **todo** controle tiver `:focus-visible` equivalente — campos nativos e botões de confirm (`ConfirmModal.jsx:115-119` `focus-visible:outline-none`) falham.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** **Canônico:** 2px `var(--ds-color-primary)` / offset 2px em `:focus-visible`. Inputs podem **somar** o ring 3px, não substituir sem contraste. Não zerar outline em confirm/input.
- **Critério de validação:** Tab em login, modal, lista de transações — anel visível em todos os alvos.

### UX-1-08 — Tipografia mono e rampa de espaço parcialmente fora da escala

- **Evidência:** `tokens.css:131` Fira Code. `globals.css:37` JetBrains Mono. `components.css:12` `gap: 0.375rem` (6px, fora de `--ds-space-*`). `pulso_theme.dart:182` padding vertical de input `14` (não está na escala 4).
- **Constatação:** Inter e tamanhos 12–32 estão alinhados. Detalhes de densidade escapam da escala de 4px.
- **Impacto:** Baixo visualmente; alto para “o token é lei”.
- **Severidade:** Baixa  
- **Confiança:** Alta  
- **Recomendação:** Um mono (Inter já é o display; mono só para códigos — **JetBrains** se Tailwind for o alias, ou Fira se o DS for a lei). Espaço só `--ds-space-*` / `PulsoTokens.space*`.
- **Critério de validação:** uma família mono no CSS gerado; grep `0.375rem` justificado ou removido.

---

## 4. Pontos positivos

- Espelho explícito web → Flutter (`pulso_tokens.dart:3`, `pulso_colors.dart:3`) com a mesma primária e botão fixo no dark (`tokens.css:186-190` vs `pulso_theme.dart:17-26`).
- Separação **primary de tema** vs **botão** evita CTA ilegível no escuro (primary vira lilás claro; fill permanece `#7C3AED`).
- Sombras desligadas no dark (`tokens.css:256-260`) — decisão consciente, não esquecimento.
- `prefers-reduced-motion` em animações do DS (`design-system/styles/animations.css:380`).
- Protótipos cobrem **claro e escuro** para o recorte (`docs/5.wireframe.md:10-12`).
- Formatação monetária padrão `pt-BR` / BRL (`formatCurrency.js:18-22`).

---

## 5. Quick wins

1. `index.html`: `lang="pt-BR"`.
2. Trocar `#16a34a` / `#22c55e` em `goals.css` por `var(--ds-color-success)`.
3. `--ds-color-empty-icon` no `.dark` = `var(--ds-color-primary)`.
4. Flutter `MaterialApp.router(locale: Locale('pt','BR'), ...)`.

---

## 6. Roadmap e riscos

| Ordem | Ação | Risco se ignorar |
|-------|------|------------------|
| 1 | Congelar `--ds-*` como contrato web+Flutter | Deriva a cada tela nova (viagens já é o pior arquivo) |
| 2 | Tokens de hover semântico | Danger no dark “pisca” para vermelho-light |
| 3 | Breakpoints 768/1024 | QA visual impossível (“funciona no meu 1100”) |
| 4 | Tema Sistema na UI | Preferência do OS mentida |

**Pergunta (só se alterar a marca):** o laranja de badge VR `#EA580C` (`pulso_colors.dart:4,23`) deve continuar distinto de `--ds-color-warning` `#F59E0B`? Hoje os dois coexistirem está correto para semântica de recurso vs alerta — **manter**.
