# 🚌 Módulo 08 — Gestão de Vale Transporte — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-059–066), `RegrasDeNegocio.md` (RN-013, RN-040–045).
> Código auditado: `api/src/services/transportService.js`, `api/src/repositories/transportRepository.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** README marca **✅ 6/6**. A auditoria confirma a funcionalidade central, mas encontrou o achado mais claro e mais grave até agora em termos de regra de negócio mal aplicada: **duas regras de negócio documentadas de forma explícita e redundante (RN-013 e RN-045) dizem que usuário CLT não pode vender VT — mas o código permite a venda normalmente, apenas exibindo um aviso em texto** ("CLT: VT é descontado em folha (6%). Venda pode gerar irregularidades."). Não é uma omissão silenciosa: o próprio código reconhece a irregularidade na mensagem e mesmo assim deixa a ação prosseguir. Também foi encontrada uma checagem de saldo em padrão "verificar-depois-agir" (mesma classe de risco de concorrência já vista em outros módulos), que aqui tem uma consequência mais concreta: pode gerar saldo de VT negativo de verdade.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-059 | Registrar valor mensal recebido de VT | ✅ | Confirmado — calculado a partir de `configuracoes_usuario.valor_vt` via `periodUtils`, não uma tabela própria de "recebimentos" |
| RF-060 | Registrar uso real do VT | ✅ | Confirmado, `registrarUsoVt` |
| RF-061 | Registrar venda de VT (comprador, data, nominal, recebido) | ✅ | Confirmado, `registrarVendaVt` — mas ver achado crítico na seção 3 |
| RF-062 | Histórico de vendas | ✅ | Confirmado, `listarVendas`, com paginação e totais do período |
| RF-063 | Calcular diferença nominal vs. recebido | ✅ | Confirmado, `mapVenda:75-86` (`diferenca`) |
| RF-066 | Saldo atual (recebido − usado − vendido) | ✅ | Confirmado, `obterSaldoVt:59` — fórmula bate exatamente com RN-044 |

**RF-064/065 (removidos):** confirmado que não há nenhum código de intervalo entre vendas ou contador regressivo — consistente com a nota do README de que foram retirados do escopo.

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Aviso de irregularidade não impede a ação, e é fácil de não notar.** O `warning` retornado em `registrarVendaVt` (`:150-152`) só aparece no payload da resposta da API — cabe ao frontend decidir exibir isso com destaque (toast, modal de confirmação) ou deixar passar como um texto pequeno. Não auditamos o frontend deste fluxo especificamente, mas o fato de a proteção estar inteiramente do lado de "confiar que a tela vai mostrar o aviso" (em vez de bloquear no backend, que é a camada que a regra de negócio realmente protege) é frágil por natureza — qualquer chamada direta à API (ou um bug futuro na tela) contorna a proteção por completo.
2. **Mensagens de bloqueio por modo de uso são claras e específicas** (`MSG_BLOQUEIO_PJ` vs `MSG_BLOQUEIO`, diferenciando "seu modo não usa VT" de "habilite o VT nas configurações") — ponto positivo de UX que vale reconhecer.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado crítico — CLT pode vender VT, contrariando RN-013 e RN-045 explicitamente

**Regras documentadas (redundantes, duas vezes no mesmo documento):**
- RN-013: *"VT de CLT é descontado em folha (6% do salário bruto), não pode ser vendido"*
- RN-045: *"CLT não pode vender VT (desconto de 6% em folha, uso obrigatório)"*

**Código (`transportService.js:26-40`):**
```js
const podeUsarVt = (config) => {
    if (MODOS_VT_AUTOMATICOS.has(config.modoUso)) return true; // inclui CLT e ESTAGIARIO
    if (config.modoUso === 'PJ') return config.vtHabilitado === true;
    return false;
};

const assertModoPermitido = (config) => {
    if (podeUsarVt(config)) return;
    // ...bloqueia apenas quem NÃO PODE USAR vt, não quem não pode VENDER
};
```
`registrarVendaVt` chama apenas `assertModoPermitido` — que verifica se o modo pode **usar** VT (RN-002, correto), não se pode **vender**. Como `MODOS_VT_AUTOMATICOS` inclui CLT, um usuário CLT passa livremente por essa checagem e a venda é registrada normalmente. A única concessão à regra de negócio é esta linha:
```js
if (config.modoUso === 'CLT') {
    resposta.warning = MSG_CLT_WARNING; // "Venda pode gerar irregularidades."
}
```
Ou seja, **o sistema sabe que a ação é irregular (o texto do próprio aviso admite isso) e permite mesmo assim**. Isso não é uma omissão de teste de borda — é uma regra de negócio deliberadamente documentada duas vezes e não implementada como bloqueio, só como aviso.
**Severidade:** Alta — é exatamente o tipo de "regra de negócio mal aplicada" que o protocolo desta auditoria pede para caçar: existe, está escrita com clareza, e o código faz diferente do que ela manda.
**Correção sugerida:** decidir entre duas rotas — (a) bloquear de fato a venda para CLT (`throw new AppError`) em vez de só avisar, alinhando ao RN-013/045 como escritos; ou (b) se o negócio decidiu conscientemente permitir "por flexibilidade" (ex.: o usuário pode ter vendido informalmente e só quer registrar para controle pessoal), então **as próprias regras RN-013/RN-045 é que precisam ser reescritas** para refletir "permitido com aviso", não "não pode ser vendido".

### Achado — Checagem de saldo em padrão "verificar-depois-agir" pode gerar saldo negativo real

`registrarVendaVt` e `registrarUsoVt` calculam `saldoAtual` via `obterSaldoVt` (uma leitura agregada fresca) e só então decidem se há saldo suficiente, sem nenhum lock/transação que impeça duas requisições concorrentes de passarem na checagem ao mesmo tempo (ex.: usuário com duas abas abertas, ou duplo clique com uma UI que não desabilita o botão a tempo). Diferente das outras ocorrências desse padrão já registradas na auditoria (que eram sobre unicidade/vínculo), aqui o efeito é **financeiro direto**: duas vendas simultâneas, cada uma dentro do saldo individualmente, mas cuja soma excede o saldo real, resultam num `saldoRestante` negativo de fato — o que a fórmula RN-044 não impede de exibir, só não deveria ter sido permitido acontecer.
**Severidade:** Média — baixa probabilidade de ocorrência (ação pouco frequente, mesmo usuário), mas o impacto é um dado financeiro incorreto, sem nenhuma trava.

### Resiliência a estados extremos (demais itens verificados)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Venda/uso de VT para modo que não usa VT (PJ sem habilitar, Pessoa Física) | Bloqueado com mensagem específica (`assertModoPermitido`) | ✅ |
| Criação de venda de VT + transação de receita | Atômico via `prisma.$transaction` (`transportRepository.js:62-67`) — se uma falhar, a outra não fica órfã | ✅ Boa prática |
| Alternar `vtHabilitado` fora do modo PJ | Bloqueado explicitamente (`atualizarVtHabilitado:310-315`) | ✅ |
| Data de venda/uso inválida | Validada (`Number.isNaN(data.getTime())`) | ✅ |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-H1 (decisão de produto necessária)** — Resolver a contradição entre RN-013/RN-045 e o comportamento real: bloquear venda de VT para CLT de fato, ou formalizar "permitido com aviso" como a regra oficial (e atualizar a documentação).

### Não funcionais

- **RNF-NOVO-H1 (Integridade financeira)** — Adicionar uma validação atômica de saldo (ex.: `SELECT ... FOR UPDATE` dentro da mesma transação da criação da venda/uso, ou uma constraint de banco que impeça saldo negativo) para eliminar a janela de corrida entre checar e gravar.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🔴 Resolver a contradição CLT/venda de VT (RF-NOVO-H1) — decisão de produto primeiro, depois código ou doc | É a regra de negócio mais claramente violada encontrada na auditoria até agora — redundante em dois RNs e ainda assim não implementada como bloqueio | Baixo (código) uma vez decidido |
| 2 | 🟡 Adicionar proteção transacional contra saldo negativo por concorrência (RNF-NOVO-H1) | Risco financeiro direto, ainda que de baixa frequência | Médio |

---

## ❓ Perguntas clarificadoras

1. A permissão de venda de VT para CLT com apenas um aviso foi uma decisão consciente de produto (ex.: "não é nosso papel policiar isso, só alertar") ou reflete que a regra de negócio nunca foi de fato implementada como bloqueio? A redundância de RN-013 e RN-045 no documento de regras sugere que a intenção original era bloquear.
2. Existe alguma expectativa de volume de uso simultâneo (múltiplos dispositivos da mesma pessoa) que justifique priorizar a correção de concorrência do saldo de VT, ou é um risco aceitável no estágio atual?

---

*Próximo módulo sugerido: 09 — Relatórios e Histórico (README marca 0% — confirmar se `reportService.js` é o scaffold morto (T1) ou tem conteúdo real).*
