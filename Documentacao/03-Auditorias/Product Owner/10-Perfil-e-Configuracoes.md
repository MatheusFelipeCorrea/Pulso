# 👤 Módulo 10 — Perfil e Configurações — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-068–077, RF-073–104, RF-075–149), `RegrasDeNegocio.md` (RN-001–025, RN-164), `Analise-Produto.md`.
> Código auditado: `api/src/routes/index.js` (nenhuma rota de perfil/config montada), `api/src/{controllers,services,routes}/user*.js` (scaffold morto, T1), `api/src/services/authService.js`, `api/src/utils/fixedIncomeUtils.js`, `web/src/pages/Profile.jsx` (vazio), `web/src/pages/Register.jsx`, `web/src/components/layouts/Sidebar/UserInfoCard.jsx`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** o README marca este módulo como **🟡 parcial**, com a nota "`modoUso`, renda fixa, VA/VR/VT e preferências existem no banco mas não têm tela". **A auditoria não confirma que `modoUso` seja setável:** não existe, em lugar nenhum do código atual, uma forma de um usuário definir seu `modoUso`. Nem o cadastro (`Register.jsx` não pergunta o modo), nem qualquer outra rota. **Todo usuário cadastrado no Pulso hoje é permanentemente `CLT`** (o valor padrão do schema, `ConfiguracaoUsuario.modoUso @default(CLT)`), sem nenhum caminho de UI ou API para mudar isso. Isso significa que toda a segmentação de experiência por modo de uso — Estagiário, PJ/Freelancer, Pessoa Física, e as ~20 regras de negócio associadas (RN-001 a RN-025) — está **funcionalmente inacessível** para 100% dos usuários reais do produto hoje, não "parcial".

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-068 | Editar nome, email, foto | ❌ | Confirmado ausente — nenhuma rota de perfil |
| RF-069 | Alterar senha (conta email/senha) | ❌ | Confirmado ausente — só existe o fluxo de "esqueci minha senha" (Módulo 01), não uma troca autenticada direta |
| RF-070 | Configurar receitas fixas mensais (salário, VA, VR, VT) | ❌ | Confirmado ausente como tela; os campos existem em `ConfiguracaoUsuario` mas não há endpoint de escrita |
| RF-071 | Alternar tema claro/escuro (área autenticada) | 🟡 | Toggle existe na landing e no `UserMenu` autenticado |
| RF-072 | Excluir conta e todos os dados | ❌ | Confirmado ausente |
| RF-073 | Selecionar modo de uso (Estagiário/CLT/Freelancer) | ❌ | **Confirmado ausente — e mais grave do que "ausente como tela": não há nenhum caminho de API para setar `modoUso` em lugar nenhum do sistema atual.** Ver achado crítico na seção 3 |
| RF-074 | Adaptar UI conforme modo | 🟡 | A **leitura** de `modoUso` já é usada em filtros de sidebar — mas como `modoUso` nunca muda do padrão `CLT`, essa adaptação nunca é exercitada na prática para os outros modos |
| RF-075–149 | Regras específicas de Freelancer/CLT (reserva de imposto, renda irregular, 13º/férias, FGTS informativo) | ❌ | Confirmado ausente — dependem inteiramente de RF-073 estar resolvido primeiro |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Toda a segmentação de modo de uso do produto é, na prática, morta.** O Pulso foi desenhado com personalização por perfil (CLT vs PJ vs Pessoa Física, benefícios VA/VR, etc.) — mas como não existe caminho para setar `modoUso`, **nenhum usuário real experimenta essa personalização hoje**, exceto a experiência CLT padrão.
2. **A sidebar já mostra um badge de modo de uso** (`UserInfoCard.jsx`) que hoje sempre vai exibir "CLT" para todo mundo, sem que o usuário tenha escolhido isso conscientemente — pode ser lido como uma informação errada/enganosa para um usuário que na verdade é estagiário ou autônomo.
3. **Sem tela de exclusão de conta (RF-072/RN-142/143), o usuário não tem controle sobre seus próprios dados** — um requisito de conformidade básica (direito de exclusão, relevante para LGPD) está ausente, não apenas incompleto.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado crítico — Não existe nenhum caminho para definir `modoUso`

**Evidência (busca exaustiva confirmada):**
- `web/src/pages/Register.jsx` — sem nenhuma referência a `modoUso` no formulário de cadastro.
- `api/src/routes/index.js` — nenhuma rota de usuário/perfil/configurações é montada (`userRoutes.js` é scaffold morto, T1).
- `api/src/services/authService.js` — **lê** `usuario.configuracoes?.modoUso` para formatar a resposta de login/registro (`formatUserResponse`), mas a criação de conta (`registerUser`, `authenticateGoogle`) sempre usa os defaults do Prisma (`ConfiguracaoUsuario.modoUso @default(CLT)`), nunca aceita um valor vindo do cadastro.
- Nenhum endpoint tipo `PATCH /usuarios/modo-uso` ou similar existe em nenhuma rota montada.

**Impacto nas regras de negócio RN-001 a RN-025 (Estagiário/CLT/PJ/Pessoa Física):** todas essas ~25 regras de negócio pressupõem que o usuário tenha escolhido um modo. Hoje, **na prática, apenas o comportamento CLT é alcançável em produção** — as regras de Estagiário, PJ (incl. reserva de IR) e Pessoa Física (experiência simplificada) ficam inacessíveis ao usuário final enquanto não houver escrita de `modoUso`. (O módulo dedicado de gestão de vale-transporte foi removido do escopo TI5.)

### Resiliência a estados extremos

Não aplicável — não há fluxo de escrita para testar. O único ponto de resiliência observável é que os *defaults* do Prisma garantem que nenhuma conta fica num estado nulo/inválido de `modoUso` (sempre `CLT`), o que evita crashes, mas não resolve o gap de produto.

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-J1 (prioridade máxima)** — Adicionar, no mínimo, um endpoint `PATCH` para `modoUso` (mesmo antes de existir uma tela de Perfil completa), desbloqueando ao menos via uma implementação mínima a segmentação de produto que já está pronta no restante do backend. Pode ser entregue como parte do onboarding (Módulo 16) ou como uma tela de configurações mínima — mas precisa existir em algum lugar antes de qualquer um dos outros RFs deste módulo fazer sentido.
- **RF-NOVO-J2** — Tela de Perfil/Configurações mínima cobrindo RF-068 (editar nome/foto), RF-070 (receitas fixas) e RF-073 (modo de uso), priorizando esses três por serem os que desbloqueiam onboarding e cálculo de descontos CLT.

### Não funcionais

- **RNF-NOVO-J1 (Conformidade)** — Priorizar RF-072 (exclusão de conta) tendo em vista requisitos de privacidade/LGPD — hoje o sistema coleta dados financeiros sensíveis sem oferecer ao usuário uma forma de exercer o direito de exclusão.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🔴 Criar o caminho de escrita para `modoUso` (RF-NOVO-J1) | Sem isso, todo o investimento já feito em segmentação por modo de uso (Estagiário/PJ/Pessoa Física) é software morto em produção — é o maior gap de "valor entregue mas inacessível" encontrado na auditoria até agora | Baixo (endpoint simples) a Médio (se acoplado a onboarding completo) |
| 2 | 🔴 Tela mínima de Perfil/Configurações (RF-NOVO-J2) | Desbloqueia RF-070 (receitas fixas, também usadas em outros módulos) e fecha o gap #2 do `Analise-Produto.md` | Médio |
| 3 | 🟡 Exclusão de conta (RNF-NOVO-J1) | Requisito de conformidade básica ainda ausente | Médio |
| 4 | 🟢 Alteração de senha autenticada (RF-069) — hoje só existe via "esqueci a senha" | Conveniência, não bloqueante | Baixo |

---

## ❓ Perguntas clarificadoras

1. Existe algum motivo para `modoUso` nunca ter sido exposto para escrita (ex.: decisão de esperar o onboarding completo do Módulo 16 antes de expor isso) ou é uma lacuna não percebida? Isso muda se a correção deveria vir isolada (endpoint simples agora) ou só junto do onboarding.
2. Dado que **hoje nenhum usuário real pode estar em modo Estagiário ou PJ**, os RFs desses modos (venda de VT para Estagiário, reserva de IR para PJ) já foram testados manualmente alguma vez (ex.: setando o campo direto no banco), ou ainda não foram validados de ponta a ponta nem uma vez?

---

*Próximo módulo sugerido: 12 — Homepage.*
