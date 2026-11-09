# Auditoria UX — Fase 2: componentes e padrões

**Produto:** Pulso  
**Locale:** pt-BR  
**Overlay:** nenhum  
**Data:** 2026-09-30  
**IDs:** `UX-2-NN`  
**Escopo desta fase:** botões, inputs, overlays, empty/loading/error, feedback, API do DS vs duplicatas nas features, estados de interação, a11y de componente.

---

## 1. Resumo executivo

O design system web **existe e é usado de verdade**: `Button`, `InputText`/`InputPassword`, `Modal`/`ConfirmModal`, `Toast`, `SpinnerDots`, `Tabs`, `Pagination`, `EmptyState`, selects e pickers. Transações, metas e viagens importam esses primitivos. Flutter tem um núcleo menor (`PulsoTheme`, `PulsoEmptyState`, `showPulsoConfirm`, `PulsoIconButton`) e cai em `AlertDialog` + `TextField` crus nas jornadas de aporte e pretensão.

Os buracos de padronização: (1) **EmptyState e Pagination não entram no barrel** `design-system/components/index.js`; (2) **Modal sem focus trap nem `aria-labelledby`**; (3) login usa **placeholder no lugar de label**; (4) criar/editar é **modal na web** e **rota cheia no Flutter**, com **perda de campos** no diálogo de aporte/despesa móvel; (5) loading web = três pontos do protótipo, Flutter = `CircularProgressIndicator` — aceitável por plataforma se o **rótulo acessível** for o mesmo.

Não redesenhar botões. Fechar a API pública do DS e copiar o **mesmo conjunto de campos** entre modal web e formulário Flutter.

---

## 2. Escopo e contexto detectado

### Biblioteca web (`design-system/components`)

| Família | Exportado no barrel `index.js` | Usado nas jornadas |
|---------|--------------------------------|--------------------|
| Button, IconButton | Sim | Sim |
| Spinner, SpinnerDots, Toast, Alert | Sim (EmptyState **não**) | EmptyState importado por path direto |
| InputText, InputPassword | Sim | Auth, forms |
| InputSearch | Não (path direto em `GoalsPage.jsx`) | Metas |
| Checkbox, Radio, Toggle, FormField | Sim | Auth |
| Modal, ConfirmModal | Sim | Deletes + forms |
| Tabs, Pagination, Breadcrumbs | **Comentado TODO** em `index.js:50-52`; arquivos existem | Tabs em metas; Pagination em transações/metas |
| Tooltip, Avatar | Parcial (Avatar path direto no UserMenu) | Sim |

### Biblioteca Flutter

`lib/core/widgets/`: `app_shell`, `pulso_feedback`, `pulso_badge`, `category_icon`. Sem espelho 1:1 de Modal/Toast/Tabs. SnackBar = toast. `AlertDialog` = confirm e forms curtos.

### Padrões de overlay observados

| Ação | Web | Flutter |
|------|-----|---------|
| Nova transação / meta / viagem | `*FormModal` | rota `/transactions/new`, `/goals/form`, `/trips/new` |
| Excluir | `Delete*Modal` (ConfirmModal por baixo) | `showPulsoConfirm` / `showDeleteTransactionDialog` |
| Aporte | `GoalContributionModal` | `AlertDialog` só com valor (`goals_screen.dart:46-60`) |
| Pretensão | `TripExpenseFormModal` (categoria, valor, preview) | `AlertDialog` 4 categorias (`trip_detail_screen.dart:43-77`) |

**N/A:** testes visuais de componente, documentação Storybook, skeleton exportado (mencionado no comentário de `feedback/index.js:4` mas não exportado).

---

## 3. Achados priorizados

### UX-2-01 — EmptyState canônico existe, mas a API pública e as CTAs divergem

- **Evidência:** `EmptyState.jsx:25-46` (variantes default / inline-list / rows / suggestion; `action`). `feedback/index.js:7-14` (não exporta EmptyState). `design-system/components/index.js:23-32` (idem). `TransactionList.jsx:128-135` (empty **sem** `action`). `GoalList.jsx:35-45` e `TripList.jsx:34-42` (com CTA). `pulso_feedback.dart:36-70` (Flutter sempre permite `actionLabel`). `transactions_screen.dart:165-171` (empty com “Nova transação”).
- **Constatação:** O padrão visual do protótipo de metas (empty com “Criar meta”) está no DS. Transações web omitem a ação. Consumidores importam por path absoluto — o barrel mente.
- **Impacto:** Lista vazia de transações na web não ensina o próximo passo; Flutter sim.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Exportar `EmptyState`. **Canônico:** title + description + CTA primária quando a página tem ação de criar. Transações: `action={{ label: 'Nova Transação', onClick }}`.
- **Critério de validação:** empty de transações/metas/viagens com o mesmo bloco DS (web) / `PulsoEmptyState` (Flutter) e CTA visível.

### UX-2-02 — Modal sem nome acessível, sem trap de foco, sem retorno de foco

- **Evidência:** `Modal.jsx:32-46` (`role="dialog"` `aria-modal="true"`; **sem** `aria-labelledby` / `aria-label`; click overlay; Esc via `useKeyboard`). Nenhum `focus()` no conteúdo. `ConfirmModal.jsx:65-81` (título `h2` não ligado ao dialog).
- **Constatação:** WCAG 2.4.3 / 2.1.2 em overlays customizados. Teclado continua na página atrás; leitores não anunciam o título.
- **Impacto:** Formulários longos (nova viagem, transação) são o núcleo do recorte.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** Trap (primeiro/último focável), focar o título ou o primeiro campo ao abrir, restaurar o gatilho ao fechar, `aria-labelledby` no `h2`.
- **Critério de validação:** Tab não escapa do modal; VoiceOver/NVDA lê o título; fechar devolve foco ao “Nova Transação”.

### UX-2-03 — Campos de autenticação só com placeholder (web e Flutter)

- **Evidência:** `Login.jsx:165-168` (`InputText` `placeholder="E-mail ou Nome de Usuário"` **sem** `label`). `Login.jsx:186-187` senha idem. `pulso_fields.dart:35-36` (`hintText: hint`, sem `labelText`). Protótipo `docs/prototipos/Auth/Modo Claro/Login.png` também usa placeholder no campo — mas WCAG 3.3.2 pede nome visível persistente; placeholder some ao digitar.
- **Constatação:** `InputText.jsx:68-72` **já implementa** `<label htmlFor>`. Login não passa a prop. Flutter auth fields não usam `labelText` (goals search sim: `goals_screen.dart:114-116`).
- **Impacto:** Erro de credencial (`credentialsError` no identificador) compete com o nome do campo desaparecido.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** **Canônico:** `label` visível = texto atual do placeholder; placeholder opcional mais curto ou omitido. Flutter: `labelText` + `hintText` auxiliar. Visual do protótipo: label pode ser a mesma linha acima do input (padrão DS), sem inventar floating novo.
- **Critério de validação:** login/cadastro/recuperar senha com label associado (`htmlFor` / `InputDecoration.labelText`) após o valor preenchido.

### UX-2-04 — Criar/editar: mesmo fluxo, conjuntos de campos diferentes no mobile

- **Evidência:** Web aporte `GoalContributionModal` (página de metas). Flutter `goals_screen.dart:46-60` (só `Valor (R$)`). Web pretensão `TripExpenseFormModal.jsx` + protótipo “Nova Pretensão” (categoria completa, descrição 0/100, preview BRL). Flutter `trip_detail_screen.dart:55-61` (dropdown TRANSPORTE/HOSPEDAGEM/ALIMENTACAO/OUTROS — **sem** passeios/compras etc. de `tripExpenseCategories.js`). Flutter título `'Nova despesa'` (`trip_detail_screen.dart:51`) vs web/protótipo **Pretensão**.
- **Constatação:** Plataforma diferente (modal vs tela) é aceitável. **Omitir campos** não é. Termo “despesa” quebra o modelo mental do recorte.
- **Impacto:** Usuário premium no app planeja viagem com vocabulário e categorias incompletos.
- **Severidade:** Alta  
- **Confiança:** Alta  
- **Recomendação:** **Canônico de conteúdo:** os campos do modal web/protótipo. Flutter: tela ou bottom sheet com o mesmo form, não `AlertDialog` mínimo. Copy: **Pretensão**.
- **Critério de validação:** mesmas categorias e labels em `TripExpenseFormModal` e no form Flutter; aporte com data se a web tiver data.

### UX-2-05 — Três famílias de confirmação destrutiva

- **Evidência:** `ConfirmModal.jsx:14-32` (tone, critical + digitar texto). `DeleteTransactionModal`, `DeleteGoalModal`, `DeleteTripModal` (wrappers de feature). Flutter `showPulsoConfirm` (`pulso_feedback.dart:84-113`) e `delete_transaction_dialog.dart` (recorrência).
- **Constatação:** Visual web está padronizado no ConfirmModal — wrappers são ok se forem só copy. Flutter genérico perde o padrão “digite para confirmar” e o ícone DS.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Web: sempre `ConfirmModal`. Flutter: `showPulsoConfirm` para simples; diálogo específico **só** quando há escolha extra (excluir futuras). Não criar quarto visual.
- **Critério de validação:** grep de `window.confirm` / `AlertDialog` de delete fora de `pulso_feedback` + transação recorrente = 0.

### UX-2-06 — Alvo de toque 32px nos icon buttons

- **Evidência:** `base.css:475-477` (`.iconbtn-sm` 2rem = 32px). `TransactionList.jsx:95-108` (`IconButton` `size="sm"` editar/excluir). `pulso_feedback.dart:26-29` (`minimumSize` 32, `shrinkWrap`). WCAG 2.2 Target Size (AA) = 24px CSS; recomendação de produto toque = 44px.
- **Constatação:** 32px passa AA 2.2 mínimo, falha conforto móvel web (drawer + lista) e Material (`kMinInteractiveDimension` 48).
- **Severidade:** Média  
- **Confiança:** Média  
- **Recomendação:** **Canônico:** `sm` visual 32 com hit-area 40–44 (`min-width/height` + padding). Flutter: não usar `shrinkWrap` em ações de linha; 40dp.
- **Critério de validação:** box de hit ≥ 40px nas ações de transação em viewport 375px.

### UX-2-07 — Loading: dois idiomas visuais sem contrato de rótulo

- **Evidência:** `SpinnerDots.jsx:6-12,38-44` (protótipo, `role="status"`, label). `TripDetailPage.jsx:311-314` (dots + “Carregando viagem...”). Flutter `transactions_screen.dart:148-155` (`CircularProgressIndicator` + Semantics). Metas Flutter `goals_screen.dart:148-151` (**sem** Semantics).
- **Constatação:** Dots na web vs circular no Flutter é idiomático. Inconsistência é **ausência de nome** em vários spinners Flutter e possível uso paralelo de `Spinner` vs `SpinnerDots`.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Web: **SpinnerDots** em listas/páginas (protótipo). Flutter: `CircularProgressIndicator` + `Semantics(label: ...)`. Mesma frase: “Carregando transações|metas|viagens...”.
- **Critério de validação:** nenhum loading de lista sem nome acessível.

### UX-2-08 — Barrel do DS desatualizado (Tabs/Pagination “TODO”)

- **Evidência:** `design-system/components/index.js:50-52`. `navigation/index.js:1-3` (exporta Tabs, Breadcrumbs, Pagination). `GoalsPage.jsx:4-5` e `TransactionsPage.jsx:4` importam Pagination por path. `GoalTabs.jsx:1` importa Tabs por path.
- **Constatação:** O código do padrão já é o canônico; o índice público diz que não existe.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Exportar Tabs, Pagination, EmptyState, InputSearch, Avatar no barrel. Breadcrumbs só quando houver hierarquia de página (detalhe de viagem já tem back próprio).
- **Critério de validação:** features não importam `@/design-system/components/.../X.jsx` para primitivos listados.

### UX-2-09 — `TripDetailModal` morto ao lado de `TripDetailPage`

- **Evidência:** `TripDetailModal.jsx:11` (export). Grep: **nenhum** import fora do próprio arquivo. Jornada real: `App.jsx:72` + `TripDetailPage.jsx`.
- **Constatação:** Dois layouts de detalhe (modal vs página). Protótipo e wireframe são **página**.
- **Severidade:** Média  
- **Confiança:** Alta  
- **Recomendação:** Página `/trips/:id` canônica. Remover ou não reativar o modal (decisão de código fora desta auditoria; UX: não voltar ao modal).
- **Critério de validação:** uma superfície de detalhe; protótipo Detalhes da Viagem = página.

### UX-2-10 — Menu de usuário: papéis de menu incompletos e tema só no header

- **Evidência:** `UserMenu.jsx:52-75` (`aria-haspopup="menu"`, `aria-expanded`; dropdown `role="menu"`). Itens `Link` `role="menuitem"` sem setas de teclado. Tema **não** está na sidebar web (só no menu). Flutter tema na **drawer** (`app_shell.dart:241-252`), sem Perfil/Config.
- **Constatação:** Padrão de menu aplicativos ≠ menu ARIA completo. Cross-client: controle de tema em sítios diferentes — ok se ambos existirem; web sidebar footer não tem tema.
- **Severidade:** Baixa  
- **Confiança:** Média  
- **Recomendação:** Escape fecha (já click-out). Setas opcionais. **Canônico de IA:** tema acessível em ≤2 cliques em ambos (já verdade). Não duplicar Perfil na drawer Flutter até a rota existir (Fase 3).
- **Critério de validação:** Esc fecha o UserMenu; Flutter e web mudam tema sem sair da sessão.

---

## 4. Pontos positivos

- `Button` com loading que desabilita clique (`Button.jsx:55-65,93-97`); variantes hover/focus em `base.css`.
- `IconButton` exige `ariaLabel` na API (`IconButton.jsx:23,77`).
- Toast com `role="alert"` (`Toast.jsx:72-73`) e tipos success/error/warning/info.
- GoalTabs usa `Tabs` do DS com `aria-label="Status das metas"` (`GoalTabs.jsx:19-25`).
- Flutter `TransactionTile` anuncia receita/despesa além da cor (`transaction_tile.dart:41-43`) — não só cor.
- ConfirmModal com modo critical + label no input (`ConfirmModal.jsx:94-98`).
- `SpinnerDots` alinhado ao protótipo (3 dots, token placeholder).

---

## 5. Quick wins

1. Exportar EmptyState + Pagination + Tabs no barrel.
2. CTA no empty de transações web (cópia do Flutter).
3. `aria-labelledby` no Modal apontando para o título do form.
4. `label` nos quatro campos de Login/Register.

---

## 6. Roadmap e riscos

| Ordem | Ação | Risco se ignorar |
|-------|------|------------------|
| 1 | A11y Modal + labels auth | Bloqueio de teclado/AT nas jornadas mais usadas |
| 2 | Paridade de campos aporte/pretensão | Mobile vira “versão pobre” permanente |
| 3 | Empty + barrel | Cada feature inventa um empty novo |
| 4 | Hit-area 40px | Erro de exclusão acidental no celular |

**Pergunta:** manter modal na web e tela cheia no Flutter para forms longos? **Sim** — decisão canônica de plataforma, desde que o **schema de campos e copy** sejam um só.
