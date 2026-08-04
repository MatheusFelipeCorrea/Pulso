Atue como um Desenvolvedor de Software Sênior/Especialista (full-stack), com profunda experiência em revisão de código (code review) rigorosa, refactoring, qualidade de teste e caça a bugs sutis. Sua missão é fazer uma auditoria de implementação profunda do meu código — no nível de linha, função e componente — executada em FASES. Não é análise de arquitetura macro (isso já foi feito), e sim revisão de PR em escala: bugs, edge cases, code smells, resiliência e qualidade real.

Eu possuo um arquivo `README.md` (backlog e status report) e o código-fonte completo no workspace (front-end React/Vite, back-end Node em camadas, Prisma, jobs).

## 🔧 PROTOCOLO DE EXECUÇÃO EM FASES (OBRIGATÓRIO)

Auditoria dividida em 3 fases + consolidação. Regras invioláveis:

- **Execute UMA fase por vez.** Ao final de cada fase, PARE e aguarde meu "OK, próxima fase". NÃO adiante fases.
- **Cada fase gera UM arquivo `.md` próprio** em `Documentacao/03-Auditorias/Code Review/` (nomes abaixo).
- **Não resuma. Seja exaustivo.** Se atingir o limite, continue automaticamente ("Parte 2"...) até concluir a fase.
- **Cite arquivo:linha e mostre o trecho** sempre que possível. Para CADA achado descreva: (a) o código problemático (snippet), (b) por que é um problema / como quebra na prática (input concreto que causa o bug), (c) severidade, (d) esforço, (e) a correção sugerida com **código pronto** (não só descrição).
- **Escala consistente:** Severidade 🔴 Bug/Quebra · 🟠 Risco alto · 🟡 Code smell · 🟢 Nitpick/estilo · Esforço Baixo/Médio/Alto.
- **ID único por achado:** formato `DEV-<FASE>-<NN>` (ex: `DEV-1-01`) para rastreabilidade entre arquivos.
- **Priorize impacto real.** Prefira 1 bug que corrompe saldo a 20 nitpicks de estilo. Separe claramente "bugs" de "melhorias".

## 📐 ESTRUTURA DE SAÍDA (repetir em TODA fase)

Cada arquivo deve seguir esta estrutura, iniciando com Sumário com links âncora:

# 👨‍💻 Sumário — Fase N
1. Mapeamento do Escopo (arquivos/módulos revisados nesta fase)
2. 🐛 Bugs e Quebras Confirmados (achados `DEV-N-NN`, com input que dispara o bug)
3. ⚠️ Riscos e Edge Cases Não Tratados (nulos, timeouts, concorrência, estados vazios)
4. 🧹 Code Smells e Refactors (duplicação, funções longas, complexidade, dead code)
5. 🧪 Qualidade de Testes (o que a cobertura ~95% NÃO cobre de verdade)
6. 💡 Novos Requisitos/Correções Propostos (formato de tabela do README: Status, Código, Requisito, Categoria, Prioridade — numerar a partir de RNF-016 quando NF)
7. Perguntas Clarificadoras específicas da fase

---

## 📂 FASE 1 — Back-end (API, Services, Repositories, Prisma)
**Arquivo de saída:** `Documentacao/03-Auditorias/Code Review/dev-fase-1-backend.md`

Escopo obrigatório:
- **Camadas (RNF-011):** vazamento de lógica (regra de negócio no controller, query fora do repository); services acoplados; funções que fazem coisas demais. Cite os arquivos onde quebra.
- **Tratamento de erro:** try/catch faltando ou engolindo erro silenciosamente; erros genéricos vs específicos; `async/await` sem tratamento; promises não-aguardadas; retorno de status HTTP inconsistente; vazamento de stack trace na resposta.
- **Validação de entrada:** cada controller valida payload (schema/DTO) ou confia no cliente? Campos obrigatórios, tipos, ranges, coerção. O RNF-005 (sanitização) é real em todas as rotas ou só em algumas?
- **Prisma / dados:** N+1 queries; falta de `select`/`include` controlado (over-fetching); operações sem `transaction` que deveriam ser atômicas (ex: gerar parcelas, aportes, importação em lote RF-158); race conditions em updates concorrentes (ex: dois aportes simultâneos na mesma meta); uso de float para dinheiro; falta de índice em campo filtrado.
- **Regras de negócio no código:** validar RF-025 (bloqueio VT×alimentação), RF-140 (transferência fora dos totais), RF-066 (saldo VT), RF-063 (perda/ganho venda VT), cálculos de orçamento (RF-109-114), recorrências (RF-021). Os cálculos batem? Há arredondamento errado? Off-by-one em datas/ciclos?
- **Jobs (`fixedIncomeUtils`, DIVIDA_COBRANCA, orçamento, lembretes):** idempotência real no código; o que acontece se rodar 2×; tratamento de fuso horário/data.
- **Código morto / hardcoded:** valores mágicos, TODOs, código comentado, endpoints não usados, credenciais/URLs hardcoded.

---

## 📂 FASE 2 — Front-end (React, Hooks, Estado, Performance, A11y no código)
**Arquivo de saída:** `Documentacao/03-Auditorias/Code Review/dev-fase-2-frontend.md`

Escopo obrigatório:
- **Padrões React:** componentes gigantes (God components); lógica duplicada que deveria ser custom hook; prop drilling excessivo; `useEffect` mal usado (deps faltando/erradas, loops, fetch sem cleanup/AbortController, race de requisições concorrentes); estado derivado guardado indevidamente.
- **Gestão de estado assíncrono:** loading/error/empty states tratados em CADA fetch? Ou só o happy path? Feedback de sucesso/erro ao usuário (toast/inline)? Botões sem estado de "salvando" (permitem duplo-clique → duplicação — ligar com race no back).
- **Performance:** re-renders desnecessários; falta de `memo`/`useMemo`/`useCallback` onde importa (listas grandes de transações, calendário); listas sem virtualização; recomputo pesado no render; bundle inchado (imports que puxam libs inteiras).
- **Formulários:** validação client-side alinhada com o back; máscara/parse de moeda (float no input → erro); submit duplo; reset após erro; acessibilidade de labels.
- **Acessibilidade no código (RNF-010):** falta de `aria-label`, foco não gerenciado em modais, ordem de tab, diferenciação só por cor (RF-122 calendário verde/vermelho/roxo), contraste da paleta Vital Purple; navegação por teclado.
- **Tema (RF-076):** toggle claro/escuro — persistência real, flash de tema errado (FOUC), tokens de cor hardcoded vs variáveis.
- **Tratamento de erro de rede:** o que a UI mostra quando a API cai/timeout? Retry? Dead ends de navegação (telas sem "voltar", pós-ação sem redirect claro).

---

## 📂 FASE 3 — Qualidade Transversal (Testes, Consistência, Dívida Técnica)
**Arquivo de saída:** `Documentacao/03-Auditorias/Code Review/dev-fase-3-qualidade-testes.md`

Escopo obrigatório:
- **Qualidade dos testes (não a %):** a cobertura ~95% API / ~97% Web testa comportamento ou só executa linhas? Há asserts fracos (só `toBeTruthy`)? Testam happy path e ignoram erros/edge cases? Mocks escondendo bugs reais? Falta teste de: autorização (usuário A × recurso de B), concorrência, arredondamento monetário, ciclos de recorrência, importação com arquivo malformado. Seguem padrão AAA/nomenclatura consistente?
- **Testes ausentes de alto valor:** listar os cenários críticos SEM teste (por módulo), priorizados.
- **Consistência de código:** mistura de idioma PT/EN (`montarResumo`, `modoUso`, `fixedIncomeUtils`, `/transactions`); estilos de nomenclatura divergentes; padrões de resposta de API inconsistentes entre módulos antigos e novos.
- **Duplicação transversal:** matemática de parcelamento (RF-135/162), cálculo "quem deve a quem" (RF-095/115-120/179), formatação de moeda/data espalhada — deveriam ser utils/serviços únicos.
- **Dependências:** libs desatualizadas, duplicadas ou desnecessárias; `package.json` (deps vs devDeps corretas); imports não usados; tree-shaking.
- **Type safety:** uso de `any`, tipos frouxos, contratos front↔back não tipados/compartilhados; validação em runtime vs tipos em compile-time.
- **Manutenibilidade:** complexidade ciclomática alta, funções longas, aninhamento profundo, comentários desatualizados; áreas de "bus factor" (código que só uma pessoa entende).

---

## 📊 CONSOLIDAÇÃO (só quando eu disser "consolidar")
**Arquivo de saída:** `Documentacao/03-Auditorias/Code Review/dev-sumario-executivo.md`

Conteúdo: Top 10 bugs/riscos de todo o código (referenciando IDs `DEV-x-yy`); matriz severidade × esforço; lista dos cenários críticos sem teste; backlog de refactors priorizado; lista dos RNF/correções propostos (numerados a partir de RNF-016). Separe claramente "corrigir antes de produção" de "melhoria contínua".

---

**Comece agora pela FASE 1** e salve em `Documentacao/03-Auditorias/Code Review/dev-fase-1-backend.md`. Ao terminar, pare e aguarde meu "OK, próxima fase".
