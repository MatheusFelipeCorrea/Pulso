# 📑 Relatório de Análise — Sistema Pulso
**Papel:** PO Sênior / Eng. de Requisitos · Foco em regras de negócio, fluxos e usabilidade
**Base:** README (`Documentacao/Requisitos/Readme.md`, código alinhado jun/2026) cruzado com o código real em `Codigo/Pulso` na branch `Sprint-5` (15/jul/2026), incluindo o trabalho ainda não commitado do módulo Divisão de Despesas e as mudanças em Lembretes/Cron.

> Este relatório substitui a versão anterior deste arquivo. Os achados foram verificados linha a linha no código (não apenas no README) por meio de auditorias dirigidas aos módulos que mudaram nesta sprint (Divisão de Despesas, Lembretes/Cron, Autenticação) e à verificação do estado real de Dashboard e Perfil/Configurações.

---

## 🎯 Sumário Executivo — Top 10 Riscos

| # | Risco | Impacto | Onde |
|---|---|---|---|
| 1 | **RNF-002 marcado ✅ mas é falso**: bcrypt está com `SALT_ROUNDS = 10`, não ≥12 | 🔴 Alto — segurança / compliance da própria documentação | `authService.js:18` |
| 2 | **Lembrete de cobrança pode ficar órfão e nunca é encerrado** quando a divisão é excluída ou o participante paga | 🔴 Alto — usuário recebe cobrança de dívida já quitada/inexistente | `expenseSplitService.js`, model `Lembrete` |
| 3 | **Loop infinito em job de cron** se `repetirCadaDias = 0` chegar ao banco (hoje só mitigado por um schema Zod que não cobre todas as rotas de escrita) | 🔴 Alto — travaria `/api/cron/daily` inteiro (bloqueia limpeza de notificações, chat, expense-split e transações recorrentes) | `reminderRecurrenceJob.js:76-79` |
| 4 | **Editar uma divisão de despesa reenviando participantes reverte pagamentos já marcados** para PENDENTE silenciosamente | 🔴 Alto — perda de dado financeiro / inconsistência de saldo | `expenseSplitService.js` (editarDivisao → substituirParticipantes) |
| 5 | **README diverge do código em pontos que ele mesmo documentou nesta sprint**: (a) vínculo `Lembrete.divisaoParticipanteId` (FK) foi trocado por M2M sem atualizar a nota do Módulo 15; (b) nota "RF-103/104: `modoUso` no cadastro/onboarding" não corresponde ao código — não há campo de modo de uso no cadastro | 🟡 Médio — documentação não é fonte confiável para decisões futuras | Módulo 15, Módulo 10 |
| 6 | **Refresh token sem rotação nem detecção de reuse** — token vazado é válido por até 30 dias sem qualquer sinal de comprometimento | 🟡 Médio — janela longa de exposição | `authService.js:270-286` |
| 7 | **Rate limiting real é 5 req/min por IP em 4 rotas**, não "100 req/min por usuário" como o RNF-004 propõe, e não cobre `/refresh`, `/logout`, `/reset-password`, `/verify-email`, OAuth | 🟡 Médio — brute-force contornável, rota de auth mais sensível sem proteção | `middlewares/authRateLimit.js`, `routes/authRoutes.js` |
| 8 | **Perfil e Configurações está 100% vazio** (`Profile.jsx` e `userRoutes.js` sem uma linha de código) — não existe forma de trocar `modoUso`, editar dados ou excluir conta | 🔴 Alto — bloqueia RF-074/077/103/104 e é pré-requisito de outros módulos futuros (Onboarding, Freelancer/CLT) | Módulo 10 |
| 9 | **Dashboard tem componentes de UI prontos e órfãos** (`BalanceCards`, `CategoryChart`, `HealthScore` etc.) sem nenhuma página consumindo, sem integração com API, sem testes | 🟡 Médio — esforço já investido não entrega valor; risco de retrabalho/descarte | Módulo 02 |
| 10 | **Tokens Google armazenados em texto puro**, apesar do comentário no schema dizer "criptografado em repouso" — achado da análise anterior, ainda não resolvido | 🔴 Alto — vazamento expõe agenda do usuário; risco LGPD | `schema.prisma:259`, `googleCalendarService.js` |

---

## 1️⃣ [Gaps Encontrados] — Divergências entre README e Código

### 1.1 Status marcado ✅ que não resiste à leitura do código

| Item README | O que o README diz | O que o código faz | Veredito |
|---|---|---|---|
| **RNF-002** ✅ | "hash bcrypt com salt rounds ≥ 12" | `SALT_ROUNDS = 10` (`authService.js:18`, usado nas linhas 53 e 369) | ❌ **Falso** — rebaixar para 🟡 ou corrigir o código |
| **RNF-013** ✅ | "JWT expiram em 15 minutos, refresh de 7 dias" | Confirmado: `ACCESS_TOKEN_TTL='15m'`, `REFRESH_TOKEN_TTL_MS=7d` (30d com "lembrar-me") | ✅ Correto |
| **RF-006** ✅ | "logout com invalidação de sessão" | Logout revoga o **refresh token** no banco (`authRepository.js:57-71`), mas o **access token JWT continua válido** até expirar (não há blacklist) | 🟡 Parcial — aceitável dado o TTL curto, mas vale documentar a limitação |
| **RNF-004** (já marcado ⏳ corretamente) | "apenas rotas de auth" têm rate limit | Confirmado, mas mais estreito ainda: só `/register`, `/login`, `/forgot-password`, `/resend-verification` (5/min por IP). `middlewares/rateLimitMiddleware.js` existe mas está **vazio/morto** | Nota do README subestima a lacuna — atualizar |
| **RF-095 / Grupos** ✅ | "toggle Por pretensão/Divisão igual persistido" | Confirmado no código, mas a nota já reconhece que "quem paga quem" real depende do Módulo 15 | Consistente com o README — sem gap aqui |

### 1.2 Notas do README que já estão desatualizadas por causa do trabalho desta sprint

- **Nota do Módulo 15 (linha 313 do README)**: descreve o vínculo do lembrete de cobrança como `Lembrete.divisaoParticipanteId` (FK escalar). O código hoje usa uma **relação M2M implícita** (`_DivisaoParticipanteToLembrete`), criada pela migração `20260715130000_lembrete_divisao_m2m`, que **substituiu** a migração anterior (`20260714163000`) que de fato criava a FK descrita no README. A nota precisa ser reescrita para refletir a M2M — e mais importante, o comportamento de "quem cuida do lembrete quando a divisão é excluída" mudou de `ON DELETE SET NULL` (lembrete preservado, mas sinalizado como órfão via campo nulo) para uma junção `ON DELETE CASCADE` que **remove só a linha de junção e deixa o `Lembrete` inteiramente intacto e ativo** — pior para o usuário, pois o lembrete nem sinaliza que perdeu a referência (ver 3.3).
- **Nota do Módulo 10 (linha 519 do README)**: "`modoUso` no cadastro/onboarding e na API de VT; sidebar já oculta VT conforme modo". A leitura de `modoUso` na API de VT está correta (`authService.js:212-227`), mas **não existe nenhum campo de `modoUso` no cadastro** — nem em `Register.jsx`, nem nos schemas de registro do backend. Toda conta nasce com `@default(CLT)` no Prisma. Ou seja, hoje **nenhum usuário real consegue ser "Estagiário" ou "Freelancer"** — todos são CLT por padrão, sem terem escolhido. Isso invalida silenciosamente qualquer teste manual de RF-103/104 feito achando que o seletor existe.
- **Cron / GitHub Actions**: o README já marca isso como "planejado", então não é um gap de status — mas vale registrar que **nenhum workflow em `.github/workflows/` chama os endpoints de cron** ainda; só existem `ci.yml`, `labeler.yml`, `security.yml`. O `cronAuthMiddleware` (Bearer `CRON_SECRET`) já está pronto para receber essa migração quando ela vier.

### 1.3 "Pronto" que é raso ou frágil

- **Divisão de Despesas (✅ 6/6)**: as regras felizes descritas nos RF-115 a RF-120 estão implementadas e testadas, mas a robustez frente a edição/exclusão é frágil (ver seção 3). O módulo está "pronto" no sentido de MVP funcional, não no sentido de "seguro contra estados inconsistentes".
- **Dashboard (🔲 0/9 no README, mas com trabalho invisível já feito)**: o README reporta corretamente 0% de conclusão, porém esconde que já existe uma pasta inteira de componentes (`BalanceCards`, `CategoryChart`, `GoalsProgress`, `HealthScore`, `IncomeExpenseChart`, `RecentTransactions`, `ResourceBalanceCard`, `ResourceCard`) sem nenhum consumidor — nem a página `Dashboard.jsx` (vazia) os importa. Isso é um gap de **rastreabilidade de esforço**: alguém já começou o módulo e o trabalho não está refletido em lugar nenhum do progresso, correndo risco de ficar esquecido ou reescrito do zero por outra pessoa.
- **Perfil e Configurações (🟡 0/13 no README)**: a legenda 🟡 sugere "parcial (UI ou backend incompleto)", mas na prática é **zero**: `Profile.jsx` vazio, `userRoutes.js` vazio, nenhuma rota de usuário registrada. Deveria ser ⏳, não 🟡 — o status visual está mais otimista do que a realidade.
- **POUPANCA (RF-140, ✅)**: o recurso existe no enum e é usado em transações/transferências, mas **não aparece em nenhum resumo de saldo** (nem no `resourceConfig.js` órfão do dashboard, nem em `TransactionSummaryCards.jsx`). Continua sendo o mesmo gap já apontado na análise anterior — ainda não resolvido.

---

## 2️⃣ [Fluxos e Usabilidade]

### 2.1 Fricções identificadas nesta rodada

| Fluxo | Problema | Sugestão |
|---|---|---|
| **Editar despesa dividida** | O modal de edição (`ExpenseSplitFormModal.jsx`) não exibe o status de pagamento dos participantes atuais — o usuário não tem como saber, ao editar, que está prestes a reverter um pagamento já confirmado | Exibir badge "já pago" ao lado de cada participante no formulário de edição; bloquear ou exigir confirmação explícita ao remover/alterar alguém que já pagou |
| **Validação de soma personalizada** | O formulário de divisão personalizada não valida em tempo real se a soma bate com o total — só descobre no erro 400 do backend após submit | Validação client-side reativa (soma parcial exibida enquanto o usuário digita, com o restante a distribuir destacado) |
| **Lembrete de cobrança duplicado** | Clicar "enviar lembrete de cobrança" (RF-120) mais de uma vez para o mesmo participante não é bloqueado — gera múltiplos eventos no calendário/Google Agenda para a mesma cobrança | Desabilitar o botão ou trocar o label para "lembrete já criado" após o primeiro clique |
| **Tema escuro inacessível após login** | O toggle de tema só existe na landing pública e na tela de demo do design system — desaparece assim que o usuário entra no app autenticado | Adicionar o toggle na sidebar/MainLayout (isso já era um risco levantado na análise anterior, ainda não resolvido) |
| **Modo de uso invisível no cadastro** | Como não há campo de `modoUso` no signup, o usuário nunca é perguntado "Estagiário, CLT ou Freelancer?" — a interface some funcionalidades (ex: VT) sem que o usuário entenda por quê, já que ele nunca fez essa escolha conscientemente | Priorizar RF-103 no cadastro ou no onboarding antes de expandir mais módulos dependentes de `modoUso` |

### 2.2 Becos sem saída (novos, além dos já mapeados na análise anterior)

- **Cobrança "fantasma"**: se o organizador cria um lembrete de cobrança e depois o participante paga (via `marcarParticipantePago`), o lembrete permanece ativo no calendário e sincronizado com o Google Agenda — o usuário recebe uma notificação de cobrança de algo já quitado, sem qualquer ação disponível para reconciliar isso além de excluir o lembrete manualmente (se souber que ele existe).
- **Divisão excluída com lembrete pendente**: excluir uma divisão de despesas não avisa o organizador que existe(m) lembrete(s) de cobrança vinculados que vão sobreviver soltos no calendário. Não há um passo de confirmação do tipo "esta divisão tem 2 lembretes de cobrança ativos — deseja removê-los também?".

---

## 3️⃣ [Regras de Negócio] — O que está bom, o que está frágil

### 3.1 O que está bom

- **Precisão monetária no rateio (RNF-016)**: `expenseSplitUtils.js` implementa divisão em centavos inteiros com distribuição determinística do resto (ex.: R$100/3 → `33.34/33.33/33.33`, sempre na mesma ordem), testado e replicado de forma idêntica no frontend. Isso confirma que a nota do README sobre RNF-016 já cumprida é real, e o novo módulo segue o padrão corretamente.
- **Validações de valor** (total > 0, soma personalizada = total, pagador precisa existir na lista, mínimo de 2 participantes) estão implementadas no **backend** (Zod + service), não só no frontend — correto por design.
- **Recorrência mensal de lembretes (`repetirMensal`)** já resolve corretamente o edge case "editar afeta só o futuro, excluir preserva o passado" apontado na análise anterior: cada instância é uma cópia independente, e o template usa `onDelete: SetNull`, então apagar o template não deleta instâncias já geradas.
- **Segurança do endpoint de cron**: `cronAuthMiddleware` exige `Bearer CRON_SECRET`, retorna 401/503 adequadamente — pronto para quando a migração a GitHub Actions acontecer.
- **Recuperação de senha**: token de 32 bytes, TTL de 1h, uso único (zerado após consumo), resposta genérica que não revela se o e-mail existe — bem implementado.

### 3.2 O que está frágil — Divisão de Despesas

1. **Nomes duplicados de participantes não são checados.** Se dois participantes tiverem o mesmo nome do pagador, ambos são marcados `PAGO` na criação, o que pode quitar a divisão prematuramente via `sincronizarStatusDivisao`.
2. **Editar reenviando `participantes` reverte pagamentos.** `substituirParticipantes` faz `deleteMany` + `createMany`, recalculando status apenas a partir de quem é o pagador atual — qualquer pagamento manual anterior de outro participante é apagado silenciosamente. Nenhum teste cobre esse cenário.
3. **Editar só `valorTotal` sem reenviar participantes não recalcula os valores individuais** — brecha de API que viola RNF-016 se algum cliente futuro (ou uma chamada direta via Postman/integração) fizer esse PATCH parcial. Hoje mitigado só porque o frontend sempre reenvia a lista completa.
4. **Lembrete de cobrança nunca é sincronizado com o pagamento** — nem quando o participante paga, nem quando a divisão é excluída.
5. **Sem checagem de lembrete duplicado** ao clicar "cobrar" mais de uma vez para o mesmo participante.

**Proposta de correções concretas:**
- Adicionar validação de nomes únicos (case-insensitive, trim) em `construirParticipantes`.
- Em `editarDivisao`, preservar o status `PAGO` de participantes cujo nome já constava como pago antes do `substituirParticipantes` (merge, não replace destrutivo) — ou, no mínimo, bloquear a edição se algum participante já pagou e exigir um fluxo de "ajuste" separado.
- Em `marcarParticipantePago`, atualizar (ou remover) o(s) `Lembrete`(s) vinculados ao participante (ex.: marcar `pago=true` no lembrete).
- Em `excluirDivisao`, antes do cascade, buscar e cancelar/excluir os lembretes vinculados aos participantes da divisão (ou perguntar ao usuário).
- Em `criarLembreteCobranca`, checar se já existe um lembrete ativo para aquele `participanteId` antes de criar outro.

### 3.3 O que está frágil — Lembretes / Cron

1. **Loop potencialmente infinito**: `avancarRepeticaoPorDias` usa um `while` sem limite de iterações; se `repetirCadaDias` chegar como `0` ao banco, o passo em milissegundos é `0` e o loop nunca termina, travando toda a rota `/api/cron/daily` (que também dispara limpeza de notificações, chat, expense-split e transações recorrentes na mesma chamada). A proteção hoje é só um `z.coerce.number().int().positive()` no schema da rota de expense-split — a rota genérica de lembretes nem declara o campo, então a proteção é incidental, não uma constraint de banco.
   **Correção proposta:** adicionar `CHECK (repetir_cada_dias > 0)` no schema/migration, e um teto de iterações (`while` com contador máximo, ex. 1000) como defesa em profundidade.
2. **`repetirCadaDias` não tem histórico de ocorrências** (diferente do `repetirMensal`) — é uma única linha mutável, sem instâncias passadas registradas. Se o objetivo é ter paridade de comportamento entre os dois tipos de recorrência, vale documentar essa diferença como intencional ou unificar o modelo.

### 3.4 O que está frágil — Autenticação

1. **`SALT_ROUNDS = 10`**, não ≥12 (ver item 1 do sumário executivo).
2. **Refresh token sem rotação/single-use** — mesmo token pode ser reapresentado indefinidamente até expirar ou logout explícito; sem detecção de reuse de token revogado.
3. **Rate limit não cobre `/refresh`, `/logout`, `/reset-password/:token`, `/verify-email/:token`, rotas OAuth** — superfície de brute-force/abuso maior do que o README sugere.
4. **Enumeração de e-mail** em `POST /register` (409 explícito "e-mail já cadastrado") e em `resendVerificationEmail` (404/400 distintos).
5. **Tokens Google em texto puro** apesar do comentário `// criptografado em repouso` no schema — nenhuma função de encrypt/decrypt existe no código que lê/grava `tokensGoogle`.

**Proposta de correções concretas:**
- Subir `SALT_ROUNDS` para 12 (reavaliar custo de CPU em produção, mas é o valor documentado).
- Implementar rotação de refresh token (novo token a cada refresh, invalidando o anterior) com detecção de reuse (se um token já revogado for reapresentado, revogar toda a "família" de tokens daquele usuário/dispositivo).
- Estender rate limiting às rotas sensíveis restantes; remover ou implementar de fato `rateLimitMiddleware.js` (hoje é código morto).
- Resposta genérica no registro (não confirmar/negar existência do e-mail de forma tão explícita) — ou aceitar o trade-off de UX conscientemente e documentar.
- Implementar criptografia simétrica (ex. AES-GCM com chave em variável de ambiente) para `tokensGoogle` antes de qualquer uso em produção com usuários reais — é o achado de maior risco LGPD ainda em aberto desde a análise anterior.

### 3.5 Riscos herdados da análise anterior que **continuam válidos** (não resolvidos nesta sprint)

- Competência vs. caixa não definida para o futuro módulo de Cartão de Crédito (Mód. 21, ainda não iniciado).
- Contradição RF-176 × RF-177 (rateio proporcional à renda vs. privacidade) no futuro Modo Casal/Família — ainda não iniciado, mas vale resolver **antes** de começar, já que reaproveitará a mesma base de "espaços compartilhados" de Grupos.
- Ausência de requisitos formais de LGPD (consentimento, portabilidade, esquecimento) e de um RNF explícito de criptografia de tokens de terceiros.
- Tensão free tier (RNF-001/007/009) — sem mudança.
- "Quem deve a quem" fragmentado entre Grupos (RF-095), Divisão de Despesas (RF-115-120) e futuro Módulo Família (RF-179) — a integração entre o toggle de Grupos e o novo módulo de Divisão de Despesas, mencionada no README como "a vincular depois", **continua não vinculada**.

---

## 4️⃣ [Plano de Ação]

### 4.1 Correções imediatas (bugs/segurança, antes de qualquer nova feature)

1. **Corrigir `SALT_ROUNDS` para 12** em `authService.js:18` — trivial, alto valor de segurança e de honestidade documental (RNF-002).
2. **Adicionar teto de iterações e validação `> 0`** em `avancarRepeticaoPorDias` (`reminderRecurrenceJob.js`) e constraint de banco para `repetirCadaDias` — evita travar o cron inteiro.
3. **Sincronizar `Lembrete` de cobrança com o ciclo de vida da divisão**: marcar/excluir o lembrete quando o participante paga ou quando a divisão é excluída (`expenseSplitService.js` → `marcarParticipantePago`, `excluirDivisao`).
4. **Bloquear ou proteger a edição de divisão pós-pagamento**: preservar status de pagamento em `editarDivisao`/`substituirParticipantes`, ou exigir confirmação explícita quando houver reversão de status.
5. **Checar lembrete duplicado** antes de criar um novo em `criarLembreteCobranca`.
6. **Atualizar a nota do Módulo 15 no README** para refletir o desenho M2M real (`_DivisaoParticipanteToLembrete`), substituindo a menção à FK `divisaoParticipanteId`.

### 4.2 Curto prazo (antes de expandir o roadmap jul/2026)

7. **Corrigir o status do Módulo 10 no README** de 🟡 para ⏳ (0/13 real, sem UI nem backend).
8. **Priorizar Perfil e Configurações** (RF-103/104 primeiro): sem campo de `modoUso` no cadastro, nenhum usuário real testa os modos Estagiário/Freelancer — é pré-requisito para Onboarding (Mód. 19) e para os RFs específicos de Freelancer/CLT (RF-145-149).
9. **Decidir o destino dos componentes órfãos do Dashboard**: reaproveitar (`BalanceCards`, `CategoryChart` etc. já existem, faltando só a página + integração com API) ou descartar deliberadamente — hoje é esforço invisível e sem dono.
10. **Estender rate limiting** a `/refresh`, `/logout`, `/reset-password/:token`, `/verify-email/:token` e implementar rotação de refresh token.
11. **Criptografar `tokensGoogle` em repouso** antes de qualquer exposição a usuários reais fora do time de desenvolvimento.
12. **Vincular o toggle de Grupos (RF-095) ao módulo de Divisão de Despesas** — hoje são dois sistemas de rateio paralelos sem integração, como o próprio README já registra como pendência.

### 4.3 Sequência sugerida (atualiza a sequência da análise anterior)

```
1. Correções de segurança/robustez desta sprint (4.1, itens 1-6) — baixo esforço, alto risco se ignorados
2. Perfil/Configurações (Mód. 10)          ──► desbloqueia modoUso, renda fixa, tema, exclusão de conta
3. Dashboard (Mód. 02)                     ──► reaproveita componentes já construídos
4. Integração Grupos × Divisão de Despesas (RF-095 × RF-115-120)
5. Importação de Dados (Mód. 20) → Onboarding (Mód. 19)
6. Cartão de Crédito (Mód. 21) — maior gap BR, exige spike de modelagem antes de codar
7. Insights/Chatbot (Mód. 06) — só após rate limiting global + consentimento LGPD
8. Modo Casal/Família (Mód. 23) — resolver RF-176 × RF-177 antes de iniciar
9. PWA/Push (24) · Bots (22) · Gamificação (11) · Veículos (25)
```

---

## ✅ Pontos fortes a preservar

- **Precisão monetária (RNF-016)** aplicada corretamente e de forma consistente no novo módulo de Divisão de Despesas — mesmo padrão determinístico do backend replicado no frontend.
- **Reuso de utilitários** entre Dívidas Pessoais e Divisão de Despesas (`formatPersonName`, `roundMoney`) — evita duplicação e inconsistência de formatação.
- **Segurança do cron já pronta** para a migração futura a GitHub Actions (`cronAuthMiddleware` bem implementado).
- **Recorrência mensal de lembretes** trata corretamente o edge case passado/futuro que a análise anterior apontava como não mapeado.
- **Recuperação de senha** bem implementada (token único, TTL curto, sem enumeração de e-mail).
- **Cobertura de testes alta** nos módulos novos (ainda que concentrada em caminho feliz — ver 3.2).

---

## ❓ Perguntas para validar antes de fechar decisões

1. O lembrete de cobrança (RF-120) deveria ser **automaticamente cancelado** quando o participante paga, ou o organizador deve fazer isso manualmente por design (ex.: para manter um "recibo" no calendário)?
2. Editar uma divisão de despesas depois que alguém já pagou deveria ser **bloqueado**, ou existe um cenário legítimo de correção pós-pagamento que precise de um fluxo dedicado (ex.: "reabrir e recalcular")?
3. `modoUso` deve ser perguntado **no cadastro** (fricção dia 1) ou **no onboarding** (Mód. 19, ainda não construído)? Isso muda a prioridade entre Perfil e Onboarding.
4. Existe prazo/pressão para reduzir `SALT_ROUNDS` de 12 para 10 (custo de CPU em free tier) ou foi apenas um débito técnico não intencional?

---

**Próximo passo sugerido:** tratar a seção 4.1 (6 correções) antes de comitar o módulo de Divisão de Despesas, já que são bugs de consistência de dado financeiro — exatamente o tipo de problema mais caro de corrigir depois que há usuários reais com histórico.
