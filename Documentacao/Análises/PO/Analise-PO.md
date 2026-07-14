# 📑 Relatório de Análise — Sistema Pulso
**Papel:** PO Sênior / Eng. de Requisitos · Foco em UX + Arquitetura
**Base:** README (código jun/2026 · planejamento jul/2026)

---

## 🎯 Sumário Executivo — Top 7 Riscos

Antes do detalhamento, estes são os pontos que, se não resolvidos, geram retrabalho ou bugs de dados difíceis de reverter:

| # | Risco | Impacto | Onde |
|---|---|---|---|
| 1 | **Cartão de crédito: competência vs. caixa não definido** — compra parcelada conta como despesa quando? Ao comprar ou ao pagar a fatura? | 🔴 Alto — risco de **contabilização dupla** | Mód. 21 |
| 2 | **Tipos de recurso inconsistentes** — `POUPANCA` (RF-140) entregue, mas Dashboard/Onboarding ainda listam só dinheiro/VA/VR/VT | 🔴 Alto — dados incompletos | RF-008, 152 |
| 3 | **Contradição: rateio proporcional à renda (RF-176) exige ver a renda alheia × preservar privacidade (RF-177)** | 🔴 Alto — regra impossível como está | Mód. 23 |
| 4 | **"Quem deve a quem" fragmentado em 3 módulos** (Grupos RF-095, Divisão RF-115-120, Família RF-179) | 🟡 Médio — inconsistência de saldo | Mód. 13/15/23 |
| 5 | **Ausência total de requisitos de LGPD/consentimento/precisão monetária** | 🔴 Alto — compliance + bug financeiro | Geral |
| 6 | **Free tier × ambição** — 500 usuários simultâneos + Gemini free tier + chat por polling + push | 🟡 Médio — estouro de quota | RNF-007, Mód. 06/22 |
| 7 | **Grupos marcado ✅, mas acerto de contas depende do Mód. 15 (não feito)** | 🟡 Médio — "pronto" incompleto | RF-095 |

---

## 1️⃣ Análise de Requisitos e Regras de Negócio

### 1.1 Ambiguidades e requisitos vagos

| Req. | Problema | Recomendação |
|---|---|---|
| **RF-142** | "X meses do gasto médio" — X não definido; **cold start**: usuário novo não tem histórico de gasto | Definir default (ex: 6 meses), tornar configurável, e fallback quando não há histórico |
| **RF-104** | "adaptar interface conforme modo" é vago. Freelancer vê VA/VR/VT? A nota diz "VA/VR só CLT/Estagiário; VT conforme modo" — mas não há **matriz explícita** | Criar tabela definitiva: `Modo × Recursos/Features visíveis` |
| **RF-025** | Só bloqueia "alimentação com VT". E o inverso (transporte com VA)? Vale para **categorias customizadas** (RF-018)? | Definir a matriz completa `Recurso × Categorias permitidas` e o comportamento com categorias custom |
| **RF-048 vs RF-014** | Score aparece em Insights (cálculo) e Dashboard (exibição) — são o mesmo? | Declarar RF-014 como **dependente** de RF-048; não duplicar lógica |
| **RF-047** | "seu VA acaba dia 22" pressupõe burn-rate diário, mas VA reseta mensalmente | Definir se a previsão respeita o ciclo de recarga mensal |
| **RF-145** | "separando do saldo disponível" — é segregação **virtual** ou transferência real p/ `POUPANCA`? | Definir; se real, reusar RF-140 |
| **RF-159** | "aprendendo com ajustes" — a implementação (coef. de Dice) é **similaridade**, não aprendizado | Alinhar expectativa: é dicionário de regras + similaridade, não ML |
| **RF-192** | Alíquota IPVA varia por estado, tipo de veículo e isenções (idade/PCD) | Documentar escopo (só carro? ignora isenções?) |

### 1.2 Contradições

| Itens | Contradição | Ação |
|---|---|---|
| **RF-176 × RF-177** | Dividir proporcional à renda exige expor a renda; mas o req. pede preservar privacidade individual | Decidir: ou renda declarada explicitamente para rateio (opt-in), ou só divisão igualitária/por peso manual |
| **RF-075 × RF-020/021** | Renda fixa (config) e transação recorrente podem gerar **o mesmo salário duas vezes** | Definir fonte única de verdade para receitas fixas |
| **RNF-001/007/009 × free tier** | Já reconhecido como aspiracional | ✔️ Ótima autoconsciência — **reescrever o RNF** excluindo cold start, não deixar como meta "falsa" |
| **RNF-004 (100 req/min) × RNF-007 (500 simultâneos) × Gemini free tier** | 500 usuários no chatbot/insights estouram RPM/RPD do Gemini Flash | Definir quota por usuário + fila + fallback rule-based explícito |
| **RF-098 × RF-176** | Separação estrita pessoal/compartilhado vs. rateio que precisa cruzar dados | Ver item 1.2 linha 1 |

### 1.3 Edge cases não mapeados (alto valor)

| Área | Caso não coberto |
|---|---|
| **Cartão (Mód. 21)** | **Pagamento parcial / rotativo** — realidade dominante no Brasil, ausente. Só há "marcar como paga" (RF-167) |
| **Cartão** | Estorno/chargeback; compra parcelada cancelada; parcelas já lançadas em faturas futuras |
| **Moedas (RF-040)** | Cache **diário** para **ARS** (hiperinflação) pode dar erro grosseiro; e falha da API de cotação? |
| **Grupos** | **Único admin sai/exclui conta** → grupo órfão. Não há transferência de propriedade nem "excluir grupo" |
| **Conta (RF-077)** | Exclusão de conta com dívidas ativas, sendo admin de grupo, ou com saldo em split — cascata indefinida |
| **Recorrentes (RF-021)** | Usuário inativo 3 meses: gera retroativo tudo de uma vez? |
| **Edição recorrente** | Editar/excluir recorrência afeta instâncias **passadas** ou só futuras? |
| **VT (RF-066)** | `usado + vendido > recebido` → saldo negativo permitido? Para onde vai o dinheiro recebido na venda (RF-061/063)? Vira receita? |
| **Categorias (RF-018)** | Excluir categoria com transações vinculadas → órfãs |
| **Import (RF-158)** | Duplicata **legítima** (2 cafés iguais no mesmo dia) marcada como dupe — falso positivo |
| **Import** | Falha no meio da gravação em lote → rollback? |
| **Metas** | Excluir meta vinculada a viagem (RF-043)/veículo (RF-197)/compra (RF-137) — cascata |
| **Veículo (RF-190)** | **Cold start da depreciação**: veículo recém-cadastrado não tem histórico FIPE → como estimar depreciação no dia 1? |
| **Google Calendar (RF-057)** | Desativar integração → eventos já sincronizados ficam órfãos no Google |

### 1.4 Categorias de requisitos AUSENTES (gap crítico)

> Não encontrei nenhum requisito sobre estes temas — recomendo criá-los antes de escalar:

- **LGPD / Privacidade:** consentimento, política de privacidade, **envio de dados financeiros ao Gemini** (Google) precisa de base legal + aviso ao usuário, portabilidade de dados, direito ao esquecimento (só há RF-077 exclusão, sem export completo — RF-072 CSV é "desejável").
- **Precisão monetária:** nenhum requisito exige uso de **inteiros (centavos) ou decimal** em vez de float. Em finanças isso é regra de ouro — **explicitar** para evitar erros de arredondamento em rateios/parcelas/câmbio.
- **Auditoria / integridade:** histórico financeiro deve ser imutável/auditável? Log de alterações?
- **Segurança de tokens de terceiros:** já anotado como dívida (tokens Google em texto puro) — deveria ser um RNF formal.

---

## 2️⃣ Avaliação de Usabilidade (UX)

### Pontos de atrito cognitivo

| Ponto | Atrito | Melhoria sugerida |
|---|---|---|
| **Recursos VA/VR/VT/POUPANCA** | Usuário leigo não distingue VA (alimentação) de VR (refeição) | Labels claros + tooltip/ícone + glossário no onboarding |
| **Modo rígido (RF-103)** | Realidade não cabe em 3 caixas: **CLT + freela**, estudante sem renda, aposentado, PJ | Considerar **feature-toggles** em vez de modo único, ou permitir modo híbrido |
| **Cartão — modelo mental** | Confusão entre "gastei R$500 no cartão" e "meu saldo em conta" | UI que separe visualmente **fatura (a pagar)** de **saldo (dinheiro real)** |
| **Veículo — custo mensal (RF-190)** | "Meu carro custa R$2.000/mês?" (depreciação invisível assusta) | **Breakdown explícito**: caixa (combustível/manutenção) vs. depreciação (não desembolsada) |
| **Quick-add via chatbot (RF-139)** | Abrir chat p/ registrar gasto simples é mais pesado que um form | Quick-add estruturado com NL como **opção**, sempre com **preview/confirmação** antes de salvar |
| **Calendário (RF-122)** | Diferenciação **só por cor** (verde/vermelho/roxo) falha para daltônicos | Adicionar ícones/padrões (WCAG) |
| **Gráficos (paleta 8 cores)** | Cores próximas confundem daltônicos | Testar em simulador de daltonismo; usar rótulos diretos |
| **Notificações multi-canal** | Sino + Push + Telegram + Discord + Email = **fadiga e duplicação** | **Central única** de preferências de notificação por evento × canal |
| **Tema (RF-076)** | Toggle só na landing; some ao entrar (autenticado pendente) | Persistir preferência; prioritizar toggle na sidebar |
| **25 módulos** | Sobrecarga de navegação | Progressive disclosure + dashboard customizável (já no roadmap) |

### Melhorias de acessibilidade
- **RNF-010 mira só WCAG 2.1 nível A.** O padrão prático é **AA** (contraste 4.5:1, foco visível). Verificar contraste de `#7C3AED`/`#A78BFA` sobre fundos.
- Garantir **undo** em ações destrutivas (excluir transação, sair de grupo).
- **Empty states guiados** em todos os módulos (crítico pós-onboarding-pulado).

---

## 3️⃣ Validação dos Fluxos de Usuário

### 🚧 Becos sem saída (dead ends)

| Fluxo | Beco | Correção |
|---|---|---|
| **Onboarding pulado (RF-154)** | Dashboard 100% zerado → usuário perdido | Empty states com CTAs ("Adicione seu 1º gasto", "Importe extrato") |
| **Grupo com 1 admin** | Admin sai/exclui conta → grupo travado | Auto-promoção de membro ou transferência de propriedade + fluxo "excluir grupo" |
| **Chatbot fora de escopo (RF-052)** | Recusa seca = frustração | Redirecionar com sugestão ("Só falo de finanças — quer ver seu resumo?") |
| **Venda de VT (RF-061)** | Valor recebido não tem destino claro no saldo | Definir se gera receita e em qual recurso |
| **Família — rateio proporcional (RF-176)** | Sem fluxo para coletar renda preservando privacidade | Definir input de renda opt-in (ver 1.2) |

### 🔁 Redundâncias / transições confusas

| Situação | Observação |
|---|---|
| **Compra parcelada** aparece em RF-135 (Planejamento), RF-162 (Cartão) e roadmap (financiamentos) | Unificar a **matemática de parcelamento** em um serviço único |
| **RF-138** (marcar item comprado → transação) não conversa com Cartão (RF-162) | Se compra for no cartão, deve rotear para o fluxo de fatura, não virar despesa à vista |
| **Fatura paga (RF-167)** vs. compras já lançadas no orçamento | Definir reconciliação para não contar 2× |
| **Import → correção de categoria** alimenta RF-141/159 | ✔️ **Loop bem fechado**, mantenha |

---

## 4️⃣ Plano de Ação (por Status)

### 4.1 Itens ✅ "Prontos" / 🟡 "Em andamento" — riscos imediatos a revisar

| Item | Risco | Ação |
|---|---|---|
| **Grupos (✅)** | RF-095 é só "divisão igual MVP"; acerto de contas depende do Mód. 15 (não feito) | Rebaixar para 🟡 ou documentar claramente o gap no card do progresso |
| **Grupos — chat polling 3s** | Em serverless (Vercel), cada poll = invocação → estoura free tier com poucos usuários | Aumentar intervalo/backoff; considerar pausa agressiva; monitorar quota |
| **Viagens (✅) — ARS** | Cache diário para moeda hiperinflacionária engana o usuário | Alerta de "cotação pode estar desatualizada" para moedas voláteis |
| **RNF-003 (HTTPS) marcado ❌** | Vercel já entrega HTTPS automático — provavelmente **já satisfeito** | Verificar e marcar; não é dívida real |
| **RNF-004 (rate limit só em auth)** | Chatbot/insights sem limite → estoura Gemini | **Bloqueante** antes de lançar Mód. 06 |
| **Tokens Google em texto puro** | Vazamento = acesso a agenda do usuário; risco LGPD | Priorizar criptografia em repouso (schema já prevê) |
| **RF-140 `POUPANCA` (✅)** | Dashboard/Onboarding ainda ignoram o recurso | Incluir na definição do Dashboard antes de codar |
| **Perfil marcado 🟡 com 0/13** | Inconsistência: legenda 🟡 = parcial, mas nenhum RF concluído | Alinhar status; o "parcial" real é `modoUso` no signup sem tela de config |

### 4.2 Itens ⏳ "A Fazer" — como estruturar antes de codar

| Módulo | Pré-requisito de definição (fazer ANTES do código) |
|---|---|
| **10 · Perfil/Config** | 🔑 **Desbloqueador** — contém modoUso (RF-103/104), renda fixa (RF-075), exclusão (RF-077), tema (RF-076). Muitos módulos dependem dele. **Priorizar.** Hoje o usuário não consegue **trocar** o modo escolhido no signup |
| **21 · Cartão** | Resolver **competência vs. caixa** + modelar **máquina de estados da fatura** (aberta→fechada→paga/parcial/rotativo). É o módulo mais complexo — fazer **spike de modelagem de dados** primeiro |
| **02 · Dashboard** | Definir **contrato de agregação** consumindo todos os módulos; incluir POUPANCA + cartão; declarar dependência do score (RF-048) |
| **06 · Insights/Chatbot** | Definir **orçamento de quota Gemini**, cache, rate limit, fronteira rule-based × LLM, **consentimento LGPD** para enviar dados financeiros ao Google, sanitização de prompt (RF-052) |
| **15 · Divisão de Despesas** | Construir como **serviço de "ledger/acerto" compartilhado** reutilizável por Grupos (RF-095) e Família (RF-179) — não como silo |
| **23 · Família** | Reusar motor de espaços de Grupos; **resolver RF-176 × RF-177** antes de tudo |
| **20 · Importação** | Definir lib de parse, detecção de encoding/delimitador, estratégia de hash de dedupe, **limite de linhas por import**, rollback em falha, scanning de arquivo |
| **19 · Onboarding** | **Depende de Perfil + Importação** — construir esses dois primeiro |
| **25 · Veículos/FIPE** | Resolver **cold start da depreciação**; definir cache FIPE; é grande (13 RF) — fatiar em A/B/C/D como já está |
| **22 · Bots** | Segurança do token de pareamento (RF-173); reusar parser NL do chatbot; mapear user externo→Pulso |
| **24 · PWA/Push** | Estratégia de cache do service worker; VAPID; **dedupe de notificação** com sino/email/bot |

### 4.3 Sequência de desenvolvimento sugerida

```
1. Perfil/Config (10)  ──►  desbloqueia modo, renda fixa, tema, exclusão
2. Dashboard (02)      ──►  entrega valor imediato, valida agregações
3. Importação (20)     ──►  resolve cold start de dados
4. Onboarding (19)     ──►  amarra 10 + 20
5. Cartão (21)         ──►  maior gap BR; exige spike de dados antes
6. Relatórios (09)     ──►  reaproveita agregações do Dashboard
7. Insights/Chatbot (06) ► só após rate limit (RNF-004) + consentimento LGPD
8. Divisão (15) → Família (23) → serviço de acerto unificado
9. PWA/Push (24) · Bots (22) · Gamificação (11) · Veículos (25)
```

---

## ✅ Pontos fortes a preservar

- **Autoconsciência de custo/free tier** excepcional (notas jul/2026) — raro e valioso.
- **Reuso arquitetural** Grupos → Família via `tipo` de espaço — decisão sólida.
- **Cobertura de testes ~95%** já acima do RNF-015.
- **Loop de aprendizado** Import ↔ RF-141/159 bem desenhado.
- Rastreabilidade de requisitos removidos (RF-064/065) e descartados (Open Banking/OCR/WhatsApp) — documentação madura.

---

# 📝 User Stories com Critérios de Aceite (Gherkin)

> Ordenadas pela sequência de desenvolvimento recomendada. Formato: **User Story** + cenários em Gherkin (`Dado / Quando / Então`). Inclui os edge cases mapeados na análise.

---

## Épico 1 · Perfil e Configurações (Módulo 10) 🔑 Desbloqueador

### US-10.1 — Alterar modo de uso após o cadastro (RF-103/104)
> **Como** usuário que escolheu um modo no cadastro,
> **quero** trocar meu modo de uso (Estagiário/CLT/Freelancer) nas configurações,
> **para que** a interface reflita minha situação atual sem precisar recriar a conta.

```
gherkin
Cenário: Trocar de Estagiário para CLT
Dado que estou logado com modoUso = "Estagiário"
E acesso a tela de Configurações
Quando seleciono o modo "CLT" e confirmo
Então o sistema salva modoUso = "CLT"
E a sidebar passa a ocultar o menu de Vale Transporte
E as features de 13º/férias (RF-148) ficam visíveis

Cenário: Aviso ao trocar de modo com dados existentes
Dado que possuo transações de VT registradas
Quando troco para um modo que não exibe VT
Então o sistema exibe aviso "Seus dados de VT serão ocultados, mas não apagados"
E as transações permanecem no banco

Cenário: Matriz de visibilidade por modo
Dado o modo selecionado
Então o sistema aplica a matriz canônica:
  | Modo        | Salário | VA | VR | VT | Poupança | PJ/PF | 13º/Férias | Impostos |
  | Estagiário  | sim     | sim| sim| sim| sim      | não   | não        | não      |
  | CLT         | sim     | sim| sim| não| sim      | não   | sim        | não      |
  | Freelancer  | sim     | não| não| não| sim      | sim   | não        | sim      |
```

### US-10.2 — Configurar receitas fixas mensais (RF-075) — fonte única de verdade
> **Como** usuário,
> **quero** cadastrar minhas receitas fixas (salário, VA, VR, VT) com valor e dia,
> **para que** o sistema preencha automaticamente sem gerar duplicidade com transações recorrentes.

```
gherkin
Cenário: Cadastrar salário fixo
Dado que estou em Configurações → Receitas Fixas
Quando informo "Salário" = R$ 3.000,00 e dia = 5
Então o sistema registra a receita fixa
E o dia 5 aparece destacado no Calendário (RF-123)

Cenário: Prevenir salário duplicado (RF-075 × RF-020/021)
Dado que já existe uma receita fixa de salário para o mês
Quando uma transação recorrente de mesma origem tentar gerar receita no mesmo mês
Então o sistema não cria o lançamento duplicado
E registra a receita fixa como fonte única de verdade
```

### US-10.3 — Alternar tema claro/escuro na área autenticada (RF-076)
```
gherkin
Cenário: Persistir preferência de tema
Dado que estou logado
Quando ativo o tema escuro na sidebar
Então a preferência é salva no meu perfil
E ao reabrir a sessão em qualquer dispositivo o tema escuro é mantido
```

### US-10.4 — Excluir conta e dados associados (RF-077) — cascata definida
```
gherkin
Cenário: Bloqueio quando sou único admin de grupo
Dado que sou o único admin de um ou mais grupos
Quando solicito exclusão de conta
Então o sistema impede a exclusão
E exige que eu transfira a propriedade ou exclua os grupos primeiro

Cenário: Exclusão com dívidas/splits em aberto
Dado que tenho dívidas ativas ou saldos em divisão de despesas
Quando confirmo a exclusão
Então o sistema exibe o impacto e exige dupla confirmação
E, ao confirmar, anonimiza minhas referências em espaços compartilhados
E remove definitivamente meus dados pessoais

Cenário: Exportação antes de excluir (LGPD)
Dado que iniciei o fluxo de exclusão
Quando avanço
Então o sistema me oferece exportar todos os meus dados antes de apagar
```

---

## Épico 2 · Dashboard (Módulo 02)

### US-02.1 — Saldos por tipo de recurso incluindo POUPANCA (RF-008 / RF-140)
> **Como** usuário,
> **quero** ver meu saldo separado por recurso (dinheiro, VA, VR, VT, poupança),
> **para** entender de onde posso gastar.

```
gherkin
Cenário: Exibir todos os recursos ativos
Dado que possuo saldos em dinheiro, VA e poupança
Quando abro o Dashboard
Então vejo um card por recurso com o saldo correto
E o card de POUPANCA é exibido (não pode ser ignorado)

Cenário: Recurso oculto por modo de uso
Dado que meu modoUso não exibe VT
Quando abro o Dashboard
Então o card de VT não é exibido
Mas seu saldo permanece preservado no banco

Cenário: Transferência não afeta receita/despesa
Dado que fiz uma transferência de dinheiro → poupança (RF-140)
Quando o Dashboard calcula receitas e despesas do mês
Então a transferência não é contabilizada em nenhum dos dois totais
```

### US-02.2 — Empty state guiado (dead end de onboarding pulado)
```
gherkin
Cenário: Dashboard sem dados
Dado que sou um usuário novo que pulou o onboarding
Quando abro o Dashboard
Então cada seção exibe um empty state com CTA
E vejo botões "Adicionar 1º gasto", "Importar extrato" e "Configurar renda fixa"
```

---

## Épico 3 · Importação de Dados (Módulo 20)

### US-20.1 — Importar extrato com preview editável (RF-155/157)
```
gherkin
Cenário: Upload OFX válido
Dado que envio um arquivo OFX de extrato bancário
Quando o sistema faz o parse
Então exibo um preview com data, valor, descrição e categoria sugerida por linha
E posso editar qualquer campo antes de confirmar

Cenário: CSV de formato desconhecido (RF-160)
Dado que envio um CSV sem cabeçalho reconhecido
Quando o parser não identifica as colunas
Então o sistema me permite mapear manualmente data, valor e descrição
```

### US-20.2 — Detecção de duplicatas com tratamento de falso positivo (RF-158)
```
gherkin
Cenário: Marcar duplicata provável
Dado que uma transação importada tem mesma data, valor e descrição de uma existente
Quando o preview é gerado
Então a linha é sinalizada como "possível duplicata"
E vem desmarcada para importação por padrão

Cenário: Duplicata legítima (2 cafés iguais no mesmo dia)
Dado que uma linha foi marcada como possível duplicata
Quando eu a marco manualmente como "não é duplicata"
Então ela é incluída normalmente na importação
```

### US-20.3 — Gravação em lote atômica (edge case: falha no meio)
```
gherkin
Cenário: Falha durante a gravação em lote
Dado que confirmei a importação de 200 transações
Quando ocorre um erro na transação de número 120
Então nenhuma das 200 é persistida (rollback total)
E o sistema informa o erro e permite tentar novamente
```

---

## Épico 4 · Onboarding (Módulo 19)

### US-19.1 — Wizard com duas rotas de carga inicial (RF-151/154)
```
gherkin
Cenário: Rota manual de saldos
Dado que é meu primeiro login
Quando o wizard inicia
Então escolho "Informar saldos manualmente"
E informo saldo por recurso (incluindo POUPANCA)
E o Dashboard passa a refletir esses saldos

Cenário: Rota de importação
Dado que estou no wizard
Quando escolho "Importar extrato"
Então sou levado ao fluxo do Módulo 20 (US-20.1)

Cenário: Pular onboarding
Dado que estou no wizard
Quando clico em "Pular"
Então caio no Dashboard com empty states guiados (US-02.2)
```

---

## Épico 5 · Cartão de Crédito e Faturas (Módulo 21) — 🔴 mais complexo

> **Decisão obrigatória antes de codar:** adotar **regime de competência para o orçamento/categoria** (a parcela impacta o mês em que ocorre) e **regime de caixa para o saldo em conta** (só sai dinheiro quando a fatura é paga). Isto evita a **contabilização dupla**.

### US-21.1 — Cadastrar cartão (RF-161)
```
gherkin
Cenário: Criar cartão
Dado que estou no módulo Cartões
Quando informo nome, limite, dia de fechamento e dia de vencimento
Então o cartão é criado com fatura corrente "aberta"
```

### US-21.2 — Compra parcelada aloca parcelas nas faturas certas (RF-162/163/164)
```
gherkin
Cenário: Compra parcelada em 3x
Dado um cartão com fechamento dia 20
Quando registro uma compra de R$ 300 em 3x no dia 15
Então são geradas 3 parcelas de R$ 100
E cada parcela é alocada na fatura do mês correspondente
E o limite disponível é reduzido em R$ 300 imediatamente (RF-165)

Cenário: Competência vs. caixa (evitar dupla contagem)
Dado que a compra parcelada foi registrada
Quando o orçamento por categoria é calculado
Então cada parcela impacta o mês da sua competência
Mas o saldo em conta só é reduzido quando a fatura for paga (US-21.4)
```

### US-21.3 — Pagamento parcial / rotativo (edge case dominante no Brasil)
```
gherkin
Cenário: Pagamento parcial da fatura
Dado uma fatura fechada de R$ 1.000
Quando pago apenas R$ 400
Então o sistema registra R$ 400 como despesa no recurso escolhido
E o saldo devedor de R$ 600 entra em rotativo na próxima fatura
E o sistema sinaliza incidência de juros a informar

Cenário: Estorno de compra parcelada
Dado uma compra parcelada com parcelas futuras já alocadas
Quando registro o estorno
Então as parcelas futuras não pagas são removidas das faturas
E o limite é restituído proporcionalmente
```

### US-21.4 — Pagar fatura sem duplicar despesa (RF-167)
```
gherkin
Cenário: Marcar fatura como paga
Dado uma fatura fechada de R$ 1.000
Quando marco como paga usando o recurso "dinheiro"
Então é registrada uma única saída de R$ 1.000 do saldo em conta
E as compras individuais já lançadas não são contabilizadas novamente no saldo
```

### US-21.5 — Roteamento de compra planejada para o cartão (RF-138 × RF-162)
```
gherkin
Cenário: Item comprado no cartão
Dado um item do Planejamento de Compra marcado como "comprado"
Quando escolho pagar com um cartão de crédito
Então a transação segue o fluxo de fatura (não vira despesa à vista)
```

---

## Épico 6 · Insights e Chatbot (Módulo 06) — só após RNF-004 + LGPD

### US-06.1 — Consentimento LGPD para uso de IA (requisito ausente — criar)
```
gherkin
Cenário: Primeiro uso do chatbot/insights com IA
Dado que nunca aceitei o uso de IA
Quando abro o chatbot ou peço um insight gerado por LLM
Então o sistema exibe um aviso sobre envio de dados ao provedor de IA (Gemini)
E só prossegue após meu consentimento explícito
E registro do consentimento é armazenado com data
```

### US-06.2 — Rate limit e fallback rule-based (RNF-004 × Gemini free tier)
```
gherkin
Cenário: Usuário excede a cota de IA
Dado que atingi meu limite de chamadas de IA no período
Quando envio outra pergunta ao chatbot
Então o sistema informa o limite atingido
E oferece a resposta rule-based quando disponível

Cenário: Resumo mensal cacheado
Dado que meu resumo mensal já foi gerado neste mês
Quando reabro a tela de insights
Então o resumo é servido do cache (não gera nova chamada de IA)
```

### US-06.3 — Chatbot fora de escopo redireciona (RF-052) — sem dead end
```
gherkin
Cenário: Pergunta fora de finanças
Dado que pergunto algo não financeiro ao chatbot
Quando o sistema detecta que está fora do escopo
Então recusa educadamente
E sugere uma ação financeira ("Posso mostrar seu resumo do mês?")
```

---

## Épico 7 · Serviço Unificado de Acerto de Contas (Módulos 13/15/23)

> Construir como **um único ledger de acerto** reutilizável por Grupos (RF-095), Divisão (RF-115-120) e Família (RF-179) — evita a fragmentação apontada no risco #4.

### US-15.1 — Registrar despesa compartilhada e calcular saldos (RF-115/116/119)
```
gherkin
Cenário: Divisão igualitária
Dado uma despesa de R$ 120 entre 3 participantes
Quando registro com divisão igual
Então cada participante deve R$ 40
E o saldo consolidado exibe quanto me devem e quanto eu devo

Cenário: Precisão monetária em rateio (requisito ausente — criar)
Dado uma despesa de R$ 100 dividida entre 3 pessoas
Quando o sistema calcula as partes
Então usa aritmética de centavos (inteiros), nunca float
E distribui o centavo residual de forma determinística (ex: 33,34 / 33,33 / 33,33)
```

### US-23.1 — Rateio proporcional à renda preservando privacidade (RF-176 × RF-177)
> Resolve a contradição: renda usada apenas como **peso opt-in**, sem expor o valor.

```
gherkin
Cenário: Peso de rateio sem expor renda
Dado um espaço Família com rateio "proporcional à renda"
Quando cada membro informa sua renda de forma privada (opt-in)
Então o sistema calcula apenas o percentual de rateio de cada um
E nenhum membro vê o valor da renda do outro
E apenas o percentual/valor devido é exibido

Cenário: Membro recusa informar renda
Dado que um membro não deu opt-in de renda
Quando o espaço tenta usar rateio proporcional
Então o sistema faz fallback para divisão igualitária
E avisa que o rateio proporcional está indisponível
```

---

## Épico 8 · Grupos — correções de dead end (Módulo 13)

### US-13.1 — Evitar grupo órfão (edge case: único admin sai)
```
gherkin
Cenário: Único admin tenta sair
Dado que sou o único admin de um grupo com outros membros
Quando tento sair
Então o sistema exige que eu promova outro membro a admin antes
Ou ofereça a opção de excluir o grupo

Cenário: Excluir grupo
Dado que sou admin
Quando escolho excluir o grupo
Então todos os membros são notificados
E os dados compartilhados do grupo são removidos, preservando as finanças pessoais (RF-098)
```

---

## Épico 9 · Veículos & FIPE (Módulo 25)

### US-25.1 — Cold start da depreciação (edge case RF-190)
```
gherkin
Cenário: Veículo recém-cadastrado sem histórico FIPE
Dado que acabei de cadastrar um veículo
E ainda não há histórico mensal de FIPE
Quando o custo mensal médio é calculado
Então a depreciação usa uma estimativa de mercado por faixa/idade como fallback
E o sistema sinaliza "estimativa provisória até formar histórico"

Cenário: Breakdown de custo (UX RF-190)
Dado um veículo com gastos registrados
Quando visualizo o custo mensal médio
Então vejo separado: desembolso em caixa (combustível/manutenção/IPVA diluído)
E depreciação estimada (valor não desembolsado)
```

---

## Épico transversal · Requisitos Não Funcionais ausentes (criar)

### RNF-NOVO-1 — Precisão monetária
```
gherkin
Cenário: Armazenamento de valores
Dado qualquer valor monetário no sistema
Então é armazenado como inteiro (centavos) ou decimal de precisão fixa
E nunca como ponto flutuante (float/double)
```

### RNF-NOVO-2 — Criptografia de tokens de terceiros
```
gherkin
Cenário: Token do Google em repouso
Dado que conectei minha conta Google
Quando o token é persistido
Então é armazenado criptografado em repouso
E nunca em texto puro
```

### RNF-NOVO-3 — LGPD: portabilidade e esquecimento
```
gherkin
Cenário: Exportar todos os dados
Dado que solicito meus dados
Quando confirmo
Então recebo um arquivo com todas as minhas informações financeiras

Cenário: Direito ao esquecimento
Dado que excluo minha conta (RF-077)
Então todos os meus dados pessoais são removidos ou anonimizados de forma irreversível
```

---

**Próximo passo sugerido:** priorizar o Épico 1 (Perfil/Config) e o Épico 5 (Cartão) para refinamento em sprint, pois são, respectivamente, o **desbloqueador** e o **maior risco de dados** do roadmap. Posso detalhar tarefas técnicas (subtasks) e o modelo de dados da fatura do cartão se quiser.
```
`