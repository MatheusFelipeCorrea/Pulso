Atue como um Designer de Produto Sênior (UX/UI) especialista em Design Systems, com profunda experiência em padronização de interface, design tokens, bibliotecas de componentes, consistência visual em escala e acessibilidade (WCAG). Sua missão é realizar uma auditoria de design rigorosa e propositiva, com FOCO PRINCIPAL EM PADRONIZAÇÃO, executada em FASES.

Contexto: já existe uma paleta definida (Vital Purple — modos claro/escuro, cores de gráfico, cards de recurso, score de saúde) no `README.md`, e o código-fonte do front-end (React/Vite) no workspace, com telas já implementadas (`/transactions`, `/budget`, `/calendar`, `/debts`, `/goals`, `/trips`, `/groups`, landing, etc.). A prioridade NÃO é redesenhar, e sim **padronizar o que existe** e criar um Design System coeso que suporte os 25 módulos.

## 🔧 PROTOCOLO DE EXECUÇÃO EM FASES (OBRIGATÓRIO)

Auditoria dividida em 3 fases + consolidação. Regras invioláveis:

- **Execute UMA fase por vez.** Ao final de cada fase, PARE e aguarde meu "OK, próxima fase". NÃO adiante fases.
- **Cada fase gera UM arquivo `.md` próprio** em `Documentacao/03-Auditorias/UX Design/` (nomes abaixo).
- **Não resuma. Seja exaustivo.** Se atingir o limite, continue automaticamente ("Parte 2"...) até concluir a fase.
- **Cite arquivo/componente específico** sempre que possível (ex: `Button.jsx`, `theme.css`, `LandingPage.jsx`). Para CADA inconsistência descreva: (a) onde/como aparece hoje (o "antes"), (b) por que quebra a padronização/impacto no usuário, (c) severidade, (d) esforço, (e) o padrão recomendado (o "depois") com exemplo concreto (token, snippet, regra).
- **Escala consistente:** Severidade 🔴 Quebra de consistência crítica · 🟠 Inconsistência relevante · 🟡 Divergência menor · 🟢 Refinamento · Esforço Baixo/Médio/Alto.
- **ID único por achado:** formato `UX-<FASE>-<NN>` (ex: `UX-1-01`) para rastreabilidade entre arquivos.
- **Regra de ouro da auditoria:** todo achado de inconsistência deve terminar em UMA decisão canônica ("a partir de agora, o padrão é X"). Padronização = eliminar as variações, não catalogá-las.

## 📐 ESTRUTURA DE SAÍDA (repetir em TODA fase)

Cada arquivo deve seguir esta estrutura, iniciando com Sumário com links âncora:

# 🎨 Sumário — Fase N
1. Inventário do Estado Atual (o que existe no escopo da fase — variações encontradas)
2. Inconsistências Mapeadas (achados `UX-N-NN` com antes → depois)
3. Padrão Canônico Definido (a "fonte da verdade" resultante desta fase)
4. Tabela de Tokens/Regras (pronta para virar código/config)
5. 💡 Novos Requisitos Propostos (formato de tabela do README: Status, Código, Requisito, Categoria, Prioridade — numerar a partir de RNF-016 quando NF)
6. Perguntas Clarificadoras específicas da fase

---

## 📂 FASE 1 — Fundamentos e Design Tokens (a base da padronização)
**Arquivo de saída:** `Documentacao/03-Auditorias/UX Design/design-fase-1-fundamentos-tokens.md`

Escopo obrigatório:
- **Cores:** auditar o uso real da paleta Vital Purple no código vs README. Há cores hardcoded (hex solto em componente) em vez de tokens/variáveis CSS? Cores fora da paleta? O mapeamento semântico (success/danger/warning/info) é usado com consistência (ex: despesa sempre `danger`, receita sempre `success`)? Consolidar num conjunto único de **design tokens** (nomeados semanticamente, não por valor).
- **Modo claro/escuro:** todos os tokens têm par claro/escuro? Há componentes que quebram no dark mode (contraste, cor fixa)? Estratégia de tema (CSS vars vs props).
- **Tipografia:** existe escala tipográfica definida (família, tamanhos, pesos, line-height)? Ou tamanhos aleatórios espalhados? Definir **type scale** canônica (ex: display/h1/h2/body/caption).
- **Espaçamento e layout:** há escala de espaçamento (4/8px base) ou margens/paddings arbitrários? Grid/container widths padronizados? Definir **spacing scale**.
- **Raios, sombras, bordas:** border-radius, box-shadow e border-width consistentes ou variados por tela? Definir tokens de elevação/raio.
- **Iconografia:** uso do Lucide é consistente (tamanho, stroke, cor)? Há mistura de bibliotecas? Padrão de tamanho de ícone por contexto.
- **Cores de dados:** a paleta de 8 cores de gráfico e as cores dos cards de recurso (Salário/VA/VR/VT) são aplicadas de forma consistente em TODAS as telas que mostram esses dados?

---

## 📂 FASE 2 — Biblioteca de Componentes e Padrões de Interação
**Arquivo de saída:** `Documentacao/03-Auditorias/UX Design/design-fase-2-componentes-padroes.md`

Escopo obrigatório:
- **Inventário de componentes:** listar os componentes de UI existentes (botões, inputs, selects, modais, cards, tabelas, tabs, toasts, badges, barras de progresso). Há **duplicatas** (3 botões diferentes, 2 modais)? Consolidar em um componente único com variantes (`variant`, `size`, `state`).
- **Estados de componente (padronização crítica):** cada componente interativo cobre TODOS os estados de forma consistente? default, hover, focus, active, disabled, loading, error, empty. Botão tem estado "salvando" padronizado? Input tem estado de erro padronizado?
- **Padrões de feedback:** sucesso/erro/aviso são comunicados do MESMO jeito em todo o app (toast? inline? banner?) ou cada tela faz diferente? Definir o padrão único de feedback.
- **Loading & Empty states:** skeleton vs spinner — qual o padrão? Empty states (crítico pós-onboarding pulado) seguem um template visual único (ilustração + texto + CTA)?
- **Padrões de formulário:** posição de label, validação (inline vs submit), mensagens de erro, botões de ação (primário à direita/esquerda?), máscara de moeda/data — tudo padronizado?
- **Padrões de dados financeiros:** formatação de moeda (R$ 1.234,56), datas, percentuais, sinais +/− e cor para valores positivos/negativos — MESMA regra em toda parte? Componente único de "valor monetário"?
- **Navegação:** sidebar, header, breadcrumbs, tabs, back-button — padrão consistente? A adaptação por `modoUso` (ocultar VT) mantém a coerência visual?
- **Modais vs páginas vs drawers:** quando usar cada um? Há critério ou é caótico?

---

## 📂 FASE 3 — Consistência entre Telas, Responsividade e Acessibilidade
**Arquivo de saída:** `Documentacao/03-Auditorias/UX Design/design-fase-3-consistencia-a11y.md`

Escopo obrigatório:
- **Consistência inter-telas:** comparar telas equivalentes (ex: lista de transações × lista de dívidas × lista de metas). O layout de "página de lista", "página de detalhe", "card de resumo" segue **templates repetíveis** ou cada módulo reinventou? Definir **page templates/layouts canônicos**.
- **Densidade e hierarquia visual:** títulos, espaçamentos e agrupamentos são consistentes entre módulos? A hierarquia guia o olho da mesma forma?
- **Responsividade (RNF-006, 360px→1920px):** os breakpoints são padronizados? Componentes quebram em 360px? Tabelas viram cards no mobile de forma consistente? Sidebar colapsa igual em todo lugar?
- **Acessibilidade visual (RNF-010, mirar AA não só A):** contraste real da paleta (`#7C3AED`/`#A78BFA` sobre fundos) atinge 4.5:1? Diferenciação só por cor (RF-122 calendário verde/vermelho/roxo; 8 cores de gráfico) — precisa de ícone/padrão/rótulo para daltônicos. Foco visível padronizado. Tamanho mínimo de alvo de toque (44px).
- **Microinterações e movimento:** transições/animações são consistentes (duração, easing) ou cada tela tem a sua? Definir tokens de motion. Respeitar `prefers-reduced-motion`.
- **Voz e tom (UX Writing):** títulos, labels, mensagens de erro e vazios seguem um tom único? Glossário de termos (VA/VR/VT/POUPANCA — leigo não distingue) padronizado com tooltips?
- **Preparação para escala (25 módulos):** o sistema atual aguenta adicionar Cartão, Veículos, Família sem virar colcha de retalhos? Onde estão os pontos de ruptura da padronização ao crescer?

---

## 📊 CONSOLIDAÇÃO (só quando eu disser "consolidar")
**Arquivo de saída:** `Documentacao/03-Auditorias/UX Design/design-system-guia-canonico.md`

Este é o entregável-mãe: um **Guia de Design System / Style Guide** consolidado e canônico, contendo: todos os design tokens (cor/tipografia/espaçamento/raio/sombra/motion), a biblioteca de componentes com variantes e estados, os page templates, as regras de formatação de dados financeiros, o padrão de feedback/loading/empty, as regras de acessibilidade AA e o UX writing. Incluir o Top 10 de inconsistências corrigidas (IDs `UX-x-yy`), matriz severidade × esforço e um roadmap de adoção (como migrar as telas atuais para o padrão sem quebrar tudo de uma vez).

---

**Comece agora pela FASE 1** e salve em `Documentacao/03-Auditorias/UX Design/design-fase-1-fundamentos-tokens.md`. Ao terminar, pare e aguarde meu "OK, próxima fase".
