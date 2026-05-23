# 📐 Pulso — Regras de Negócio

Documento que define todas as regras de negócio do sistema **Pulso**, organizadas por módulo e por modo de uso.

---

## 🎭 Regras por Modo de Uso

### 🎓 Estagiário

| Regra | Descrição |
|---|---|
| RN-001 | Estagiário recebe bolsa auxílio (não tem descontos INSS/IRRF) |
| RN-002 | Estagiário pode receber VA, VR e VT como benefícios |
| RN-003 | VT de estagiário pode ser vendido (funcionalidade habilitada) |
| RN-004 | Estagiário não tem 13º salário nem férias remuneradas obrigatórias |
| RN-005 | A bolsa auxílio não tem desconto, valor líquido = valor bruto |

### 💼 CLT

| Regra | Descrição |
|---|---|
| RN-006 | CLT tem salário bruto com descontos explícitos |
| RN-007 | Descontos obrigatórios de CLT: INSS + IRRF (calculados por faixa) |
| RN-008 | Descontos opcionais de CLT: VT (6% do salário bruto), plano de saúde, vale farmácia, etc. |
| RN-009 | O sistema deve permitir cadastrar descontos personalizados com nome e valor |
| RN-010 | O sistema deve calcular e exibir: Salário Bruto - Descontos = Salário Líquido |
| RN-011 | CLT tem direito a 13º salário (sistema deve considerar como receita extra em Nov/Dez) |
| RN-012 | CLT tem férias remuneradas (sistema deve permitir planejar o adicional de 1/3) |
| RN-013 | VT de CLT é descontado em folha (6% do salário bruto), não pode ser vendido |
| RN-014 | FGTS (8%) não é descontado do salário mas deve ser informativo (patrimônio acumulado) |

### 💻 PJ / Freelancer

| Regra | Descrição |
|---|---|
| RN-015 | PJ tem renda variável (pode ter meses com R$0 e meses altos) |
| RN-016 | O sistema deve sugerir separar % da receita para IR (reserva fiscal) |
| RN-017 | Percentual sugerido de reserva IR: 15-27% dependendo da faixa |
| RN-018 | PJ não recebe VA, VR nem VT (funcionalidades ocultas) |
| RN-019 | O sistema deve permitir registrar múltiplas fontes de receita por mês |
| RN-020 | O sistema deve calcular a média de receita dos últimos 3-6 meses como referência |
| RN-021 | Gastos com CNPJ (MEI, contador, etc.) devem ser categorizáveis separadamente |

### 👤 Pessoa Física

| Regra | Descrição |
|---|---|
| RN-022 | Pessoa Física tem experiência simplificada (sem VA/VR/VT/descontos) |
| RN-023 | Apenas "Dinheiro" como recurso disponível |
| RN-024 | Não exibe funcionalidades de benefícios corporativos |
| RN-025 | Foco apenas em receita vs despesa simples |

---

## 💰 Regras de Benefícios (VA, VR, VT)

### Cumulativo vs Não Cumulativo

| Regra | Descrição |
|---|---|
| RN-026 | O sistema deve permitir configurar cada benefício como CUMULATIVO ou NÃO CUMULATIVO |
| RN-027 | Benefício CUMULATIVO: saldo do mês anterior soma com o novo mês (ex: VA sobrou R$100, próximo mês terá R$100 + valor novo) |
| RN-028 | Benefício NÃO CUMULATIVO: saldo zera no início do mês e recebe valor novo (perde o que não usou) |
| RN-029 | Se não cumulativo, o sistema deve alertar X dias antes do reset: "Seu VA zera em [X] dias. Restam R$ [Y] para usar" |
| RN-030 | O sistema deve registrar histórico de quanto foi perdido por não uso (benefício não cumulativo) |
| RN-031 | Na configuração inicial (onboarding), perguntar: "Seu VA acumula?" [Sim/Não] para cada benefício |

### Vale Alimentação (VA)

| Regra | Descrição |
|---|---|
| RN-032 | VA só pode ser gasto em despesas da categoria "Alimentação" ou "Compras (mercado)" |
| RN-033 | O sistema deve alertar se o VA está acabando antes do fim do mês |
| RN-034 | Cálculo de "VA por dia": saldo restante ÷ dias restantes no mês |

### Vale Refeição (VR)

| Regra | Descrição |
|---|---|
| RN-035 | VR só pode ser gasto em despesas da categoria "Alimentação" (restaurantes, lanches) |
| RN-036 | O sistema deve calcular "VR por refeição": saldo ÷ dias úteis restantes |
| RN-037 | Pode diferenciar dias úteis vs fins de semana (VR geralmente usado em dias de trabalho) |

### Vale Transporte (VT)

| Regra | Descrição |
|---|---|
| RN-038 | VT só pode ser gasto em despesas da categoria "Transporte" |
| RN-039 | Despesas de alimentação NUNCA podem usar recurso VT |
| RN-040 | VT pode ser vendido (somente para modo Estagiário) |
| RN-041 | Ao vender VT, o valor recebido entra como receita do tipo "Dinheiro" |
| RN-042 | O intervalo entre vendas de VT é configurável (padrão: 30 dias) |
| RN-043 | O sistema deve bloquear nova venda antes do intervalo configurado |
| RN-044 | Saldo VT = Recebido no mês - Usado - Vendido (nominal) |
| RN-045 | CLT não pode vender VT (desconto de 6% em folha, uso obrigatório) |

---

## 💳 Regras de Transações

| Regra | Descrição |
|---|---|
| RN-046 | Toda transação deve ter: valor, data, categoria, recurso e tipo (receita/despesa) |
| RN-047 | Valor deve ser positivo e maior que zero |
| RN-048 | Recurso é obrigatório (Dinheiro, VA, VR ou VT) |
| RN-049 | Validação cruzada: categoria + recurso devem ser compatíveis (ex: não pode usar VT pra alimentação) |
| RN-050 | Transações recorrentes geram automaticamente via cron no dia programado |
| RN-051 | O usuário pode cancelar a recorrência a qualquer momento |
| RN-052 | Ao excluir uma transação recorrente, perguntar: "Excluir só esta ou todas as futuras?" |
| RN-053 | Cada transação registrada incrementa o streak de gamificação (1 por dia, não importa quantas) |
| RN-054 | Transação não pode ter data futura (exceto recorrentes programadas) |

---

## 📊 Regras de Orçamento Mensal

| Regra | Descrição |
|---|---|
| RN-055 | O limite de orçamento é definido POR CATEGORIA e reseta todo mês |
| RN-056 | Alertar quando gasto atingir 80% do limite da categoria |
| RN-057 | Alertar (mais forte) quando gasto ESTOURAR o limite (100%+) |
| RN-058 | O orçamento NÃO bloqueia o registro de transação (apenas alerta) |
| RN-059 | Se orçamento total definido > renda, exibir warning permanente |
| RN-060 | Categorias sem limite definido não geram alertas |

---

## 🎯 Regras de Metas

| Regra | Descrição |
|---|---|
| RN-061 | Prazo da meta deve ser uma data FUTURA |
| RN-062 | Valor do aporte não pode ultrapassar o que falta pra atingir a meta |
| RN-063 | Se aporte igualar o valor alvo, meta muda automaticamente pra status CONCLUÍDA |
| RN-064 | Meta PAUSADA não recebe aportes (botão desabilitado) |
| RN-065 | Meta CANCELADA não pode ser reativada (criar nova) |
| RN-066 | Meta CONCLUÍDA não pode receber mais aportes |
| RN-067 | Cálculo sugerido: (valor_alvo - valor_atual) ÷ meses_até_prazo = valor mensal necessário |
| RN-068 | Se prazo da meta já passou e não atingiu: alertar "Meta vencida" (não cancela automaticamente) |

---

## 🌍 Regras de Viagens

| Regra | Descrição |
|---|---|
| RN-069 | Custo total da viagem = soma de todas as pretensões |
| RN-070 | Se moeda do destino != BRL, converter usando cotação em tempo real (AwesomeAPI) |
| RN-071 | A cotação exibida deve ter timestamp de quando foi consultada |
| RN-072 | Viagem pode ser vinculada a UMA meta financeira (relação 1:1) |
| RN-073 | Se meta vinculada for excluída, viagem perde o vínculo (não é excluída) |
| RN-074 | Pretensões podem ser de 6 categorias: Transporte, Hospedagem, Alimentação, Passeios, Compras, Outros |

---

## 🤝 Regras de Dívidas Pessoais

| Regra | Descrição |
|---|---|
| RN-075 | Dívida tem direção: "Emprestei" (me devem) ou "Peguei emprestado" (eu devo) |
| RN-076 | Ao marcar como paga/quitada, registra a data de quitação |
| RN-077 | Se tem prazo definido: alertar X dias antes do vencimento |
| RN-078 | Dívida vencida (passou o prazo sem quitar): badge "Vencida" em vermelho |
| RN-079 | Dívida NÃO gera transação automaticamente (é informativo/controle) |
| RN-080 | Saldo consolidado: total que me devem - total que eu devo |

---

## 💸 Regras de Divisão de Despesas

| Regra | Descrição |
|---|---|
| RN-081 | Uma divisão tem: valor total, participantes, quem pagou |
| RN-082 | Divisão igualitária: valor total ÷ número de participantes |
| RN-083 | Divisão personalizada: soma dos valores individuais deve = valor total |
| RN-084 | O organizador (quem criou) é incluído automaticamente como participante |
| RN-085 | Ao marcar todos como "pago", a divisão é automaticamente movida para "Quitada" |
| RN-086 | "Cobrar pendentes" cria um LEMBRETE (não envia mensagem direta) |

---

## 🛒 Regras de Planejamento de Compra

| Regra | Descrição |
|---|---|
| RN-087 | Cálculo de tempo: valor_item ÷ sobra_mensal_atual = meses necessários |
| RN-088 | Sobra mensal = receita total - despesas totais (média dos últimos 3 meses) |
| RN-089 | Simulação de parcela: valor_item ÷ nº_parcelas = valor_parcela |
| RN-090 | Comprometimento = valor_parcela ÷ renda_mensal × 100 |
| RN-091 | Alertar se comprometimento total de parcelas > 30% da renda |
| RN-092 | Ao clicar "Comprei!": opção de registrar como transação automaticamente |
| RN-093 | Se tem meta vinculada e clicar "Comprei!": meta é concluída automaticamente |

---

## 📅 Regras de Lembretes e Calendário

| Regra | Descrição |
|---|---|
| RN-094 | Lembrete com antecedência "1 dia antes": gera alerta no dia anterior |
| RN-095 | Lembrete com antecedência "3 dias antes": gera alerta 3 dias antes |
| RN-096 | Sincronização com Google Calendar é OPT-IN (usuário escolhe ativar) |
| RN-097 | Se Google Calendar desconectado, lembretes ficam como "Pendente" (não sincronizado) |
| RN-098 | Lembrete recorrente gera novo lembrete automaticamente no próximo mês |
| RN-099 | Ao "Marcar como pago" no lembrete: NÃO gera transação automática (apenas muda status) |
| RN-100 | Calendário financeiro mostra SOMENTE transações já registradas + lembretes futuros |

---

## 🎮 Regras de Gamificação

| Regra | Descrição |
|---|---|
| RN-101 | Streak incrementa +1 por dia que o usuário registrar PELO MENOS 1 transação |
| RN-102 | Streak zera se passar 1 dia completo (00:00-23:59) sem nenhum registro |
| RN-103 | Conquistas são desbloqueadas automaticamente ao atingir o critério |
| RN-104 | Conquistas NÃO podem ser perdidas uma vez desbloqueadas |
| RN-105 | XP é concedido por: registrar transação (+5), completar quiz (+20), atingir marco de streak (+50), completar meta (+100), completar desafio (+100) |
| RN-106 | Níveis por XP: Iniciante (0-249), Consciente (250-999), Estrategista (1000-2499), Investidor (2500+) |
| RN-107 | Desafio mensal é gerado pela Gemini baseado nos padrões de gasto do usuário |
| RN-108 | Desafio mensal reseta no dia 1 de cada mês |
| RN-109 | Módulo de gamificação pode ser DESATIVADO pelo usuário (sem penalidade) |
| RN-110 | Se desativado: streak, XP e conquistas ficam "pausados" (não perdem progresso) |

---

## 👥 Regras de Grupos

| Regra | Descrição |
|---|---|
| RN-111 | Código de convite é gerado automaticamente no formato "PULSO-XXXX" (4 chars alfanuméricos) |
| RN-112 | Criador do grupo é automaticamente ADMIN |
| RN-113 | Deve existir pelo menos 1 admin no grupo (admin não pode sair se for o único) |
| RN-114 | Admin pode: remover membros, excluir grupo, gerenciar viagem/meta do grupo |
| RN-115 | Membro pode: adicionar pretensões, fazer aportes, sair do grupo |
| RN-116 | Dados pessoais (transações, saldos, benefícios) NUNCA são visíveis no grupo |
| RN-117 | Ao sair do grupo: pretensões do membro permanecem (não são excluídas) |
| RN-118 | Meta do grupo: aportes são individuais e rastreados por membro |
| RN-119 | Meta do grupo concluída quando valor_atual >= valor_alvo (soma de todos os aportes) |
| RN-120 | Se admin excluir o grupo: todos os dados do grupo são removidos (membros notificados) |

---

## 🤖 Regras de IA / Chatbot

| Regra | Descrição |
|---|---|
| RN-121 | Chatbot só responde perguntas relacionadas a finanças do usuário |
| RN-122 | Se pergunta fora do escopo: "Só posso te ajudar com assuntos financeiros 💜" |
| RN-123 | Chatbot TEM ACESSO aos dados reais do usuário (transações, saldos, metas) para contextualizar |
| RN-124 | Chatbot NÃO tem acesso a dados de outros usuários ou do grupo |
| RN-125 | Insights são gerados automaticamente no fim de cada mês |
| RN-126 | Insights podem ser regenerados sob demanda (botão "Regenerar") |
| RN-127 | Score de saúde é recalculado diariamente |
| RN-128 | Projeção futura usa: média dos últimos 3 meses de gastos/receitas como base |
| RN-129 | Rate limit do chatbot: 20 mensagens/minuto por usuário |
| RN-130 | Histórico do chat é mantido por sessão (limpa ao deslogar ou após 24h) |

---

## 🔐 Regras de Autenticação e Segurança

| Regra | Descrição |
|---|---|
| RN-131 | Senha mínima: 8 caracteres, 1 número, 1 maiúscula |
| RN-132 | Hash com bcrypt, salt rounds = 12 |
| RN-133 | Access token expira em 15 minutos |
| RN-134 | Refresh token expira em 7 dias (rotativo: cada refresh gera novo token) |
| RN-135 | Refresh token é armazenado como httpOnly cookie |
| RN-136 | Ao alterar senha: todos os refresh tokens são invalidados (logout global) |
| RN-137 | Conta só é ativada após confirmação do email |
| RN-138 | Login com Google: cria conta automaticamente se email não existe |
| RN-139 | Login com Google: vincula à conta existente se email já cadastrado |
| RN-140 | Após 5 tentativas de login falhas: bloquear por 15 minutos |
| RN-141 | Token de recuperação de senha expira em 1 hora |
| RN-142 | Exclusão de conta: remove TODOS os dados permanentemente (cascade) |
| RN-143 | Exclusão de conta requer confirmação digitando "EXCLUIR" |

---

## 💵 Regras de Cálculo — Descontos CLT

### Tabela INSS 2026 (referência)

| Faixa Salarial | Alíquota |
|---|---|
| Até R$ 1.518,00 | 7,5% |
| R$ 1.518,01 a R$ 2.793,88 | 9% |
| R$ 2.793,89 a R$ 4.190,83 | 12% |
| R$ 4.190,84 a R$ 8.157,41 | 14% |

> Cálculo é PROGRESSIVO (cada faixa aplica só sobre a parcela correspondente)

### Tabela IRRF 2026 (referência)

| Base de Cálculo | Alíquota | Dedução |
|---|---|---|
| Até R$ 2.259,20 | Isento | - |
| R$ 2.259,21 a R$ 2.826,65 | 7,5% | R$ 169,44 |
| R$ 2.826,66 a R$ 3.751,05 | 15% | R$ 381,44 |
| R$ 3.751,06 a R$ 4.664,68 | 22,5% | R$ 662,77 |
| Acima de R$ 4.664,68 | 27,5% | R$ 896,00 |

> Base IRRF = Salário Bruto - INSS - Dependentes (R$ 189,59 por dependente)

| Regra | Descrição |
|---|---|
| RN-144 | O sistema deve permitir informar salário BRUTO e calcular descontos automaticamente |
| RN-145 | OU o sistema deve permitir informar salário LÍQUIDO diretamente (sem calcular) |
| RN-146 | Se informar bruto: exibir breakdown de descontos (INSS, IRRF, VT 6%, outros) |
| RN-147 | Descontos personalizados (plano saúde, farmácia, etc.) são cadastráveis pelo usuário |
| RN-148 | O cálculo de INSS é PROGRESSIVO (não é alíquota fixa sobre o total) |
| RN-149 | O cálculo de IRRF considera: Base = Bruto - INSS - Dependentes |
| RN-150 | Tabelas de INSS/IRRF devem ser atualizáveis (mudam todo ano) |
| RN-151 | O sistema deve informar que tabelas podem estar desatualizadas com disclaimer |

---

## 📈 Regras de Relatórios

| Regra | Descrição |
|---|---|
| RN-152 | Relatórios mostram dados de QUALQUER período (não só mês atual) |
| RN-153 | Comparativo sempre usa o período ANTERIOR como referência (maio vs abril) |
| RN-154 | Variação percentual: ((atual - anterior) / anterior) × 100 |
| RN-155 | Se período anterior = 0: não calcular variação (exibir "Sem dados anteriores") |
| RN-156 | Exportação PDF inclui: resumo, gráficos como imagem, lista de transações |
| RN-157 | Exportação CSV inclui: todas as transações com colunas (data, descrição, categoria, tipo, recurso, valor) |
| RN-158 | Relatórios NÃO incluem dados de grupos (são pessoais) |

---

## ⚙️ Regras Gerais do Sistema

| Regra | Descrição |
|---|---|
| RN-159 | Todos os valores monetários são armazenados com 2 casas decimais |
| RN-160 | Moeda padrão do sistema: BRL (Real Brasileiro) |
| RN-161 | Datas são armazenadas em UTC e exibidas no fuso do usuário |
| RN-162 | O sistema gera receitas fixas automaticamente no dia configurado de cada mês |
| RN-163 | Se o dia configurado não existe no mês (ex: dia 31 em fevereiro): gera no último dia do mês |
| RN-164 | Ao trocar de modo (ex: Estagiário → CLT): funcionalidades mudam mas dados NÃO são excluídos |
| RN-165 | Categorias padrão são criadas no registro da conta (Alimentação, Transporte, Lazer, Educação, Moradia, Saúde, Compras, Outros) |
| RN-166 | Categorias padrão não podem ser excluídas, apenas ocultas |
| RN-167 | Categorias personalizadas podem ser criadas, editadas e excluídas |
| RN-168 | Ao excluir categoria personalizada com transações vinculadas: mover transações para "Outros" |