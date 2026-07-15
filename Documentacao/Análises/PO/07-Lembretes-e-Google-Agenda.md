# 📅 Módulo 07 — Lembretes e Google Agenda — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-054–058), `RegrasDeNegocio.md` (RN-094–100, RN-169).
> Código auditado: `api/src/services/{reminderService,reminderAlertService,googleCalendarSyncService}.js`, `api/src/jobs/{reminderRecurrenceJob,reminderAlertJob}.js`, `api/src/utils/googleTokenCrypto.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** módulo tecnicamente o mais sofisticado auditado até agora — integração real com a API do Google Calendar (criação de calendário dedicado "Pulso", import bidirecional de alterações, refresh de token com persistência automática e criptografia, tratamento fino de erros do Google mapeados para mensagens amigáveis) e jobs de cron com proteções de segurança bem pensadas (teto de iterações no avanço de recorrência por dias). README marca **✅ 5/5**, confirmado. A auditoria encontrou **um defeito concreto e reproduzível**: ao **criar** um lembrete com sincronização Google ativada, se a sincronização falhar por qualquer motivo — inclusive o caso mais comum, o usuário ter o Google Agenda desconectado — **o lembrete inteiro é apagado**, em vez de ser salvo como "pendente de sincronização", que é exatamente o que RN-097 determina. O mesmo cenário, quando ocorre numa **edição** (não criação), é tratado corretamente (o lembrete é preservado, só marcado como não sincronizado).

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-054 | Conectar conta Google para Google Calendar | ✅ | Confirmado (fluxo de OAuth do Calendar, distinto do OAuth de login — `GOOGLE_CALENDAR_CALLBACK_URL` próprio) |
| RF-055 | Criar lembretes com data e valor | ✅ | Confirmado, `criarLembrete` |
| RF-056 | Sincronizar lembretes como eventos no Google Calendar | ✅ | Confirmado e sofisticado — cria um calendário "Pulso" dedicado (`garantirCalendarioPulso`), não polui o calendário pessoal do usuário |
| RF-057 | Ativar/desativar integração a qualquer momento | ✅ | Confirmado — `aplicarSyncGoogle` remove o evento do Google quando `wantsSync=false` |
| RF-058 | Configurar antecedência do lembrete | ✅ | Confirmado, `ANTECEDENCIA_DIAS`/`ANTECEDENCIA_MINUTOS`, usado tanto no alerta interno (`reminderAlertService`) quanto no popup do evento do Google (`buildEventBody`) |

**Achado extra de robustez (positivo, não documentado como RF mas presente):** `importarAlteracoesDoGoogle` (`googleCalendarSyncService.js:341-397`) importa de volta alterações feitas diretamente no Google Calendar (mudança de título/data) para o Pulso — isso vai além do que RF-054–058 pedem e está mencionado apenas en passant nas "Notas de implementação" do README ("importação Google → Pulso ao abrir o mês"). Vale formalizar como requisito próprio, já que é uma funcionalidade real e não trivial.

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Criar um lembrete com sync ativado e o Google desconectado apaga o lembrete inteiro.** Ver detalhe técnico na seção 3. Do ponto de vista do usuário: ele cria um lembrete de conta a pagar, marca "sincronizar com Google Agenda" (talvez por hábito, ou porque já usou antes e a conexão expirou sem ele perceber), a chamada falha, e **o lembrete simplesmente não existe** — sem nenhuma indicação clara de que o problema foi a sincronização e não os dados do lembrete em si. O usuário precisa recriar tudo.
2. **Erros do Google são bem tratados e comunicados** (`mapGoogleError`, `googleCalendarSyncService.js:26-48`) — mensagens específicas para escopo insuficiente, sessão expirada, sem permissão. Isso é um ponto forte que vale reconhecer explicitamente, para contrastar com o gap #1.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado crítico — Falha de sincronização na criação apaga o lembrete, violando RN-097

**Código (`reminderService.js:78-110`):**
```js
const criarLembrete = async (usuarioId, body) => {
    // ...cria o lembrete localmente...
    const lembrete = await reminderRepository.criar({ ... });

    if (!wantsSync) return mapLembreteComContagem(lembrete);

    try {
        const syncData = await aplicarSyncGoogle(usuarioId, lembrete, true);
        // ...
    } catch (error) {
        await reminderRepository.deletar(lembrete.id);  // <-- apaga o lembrete recém-criado
        throw error;
    }
};
```
E `aplicarSyncGoogle` (`:47-62`) lança `AppError('Conecte o Google Agenda para sincronizar lembretes.', 400)` sempre que `wantsSync=true` e o usuário não está conectado — **esse é o caminho de erro mais fácil de disparar** (usuário desconectou o Google em outra sessão, token expirou, ou simplesmente nunca conectou mas deixou o toggle marcado por engano), não um caso raro de falha de rede.
RN-097 é explícita: *"Se Google Calendar desconectado, lembretes ficam como 'Pendente' (não sincronizado)"* — ou seja, a regra de negócio documentada prevê exatamente esse cenário e diz que o lembrete deveria sobreviver, só sem sync. O código faz o oposto na criação.
**Contraste interno:** a função `atualizarLembrete` (`:112-160`), que lida com o mesmo tipo de falha, faz o correto — no `catch`, apenas marca `sincronizado: false` e preserva o registro (`:154-158`). A inconsistência entre os dois fluxos (criar vs. editar) para o mesmo tipo de erro é a evidência mais forte de que o comportamento em `criarLembrete` é um descuido, não uma decisão de design.
**Severidade:** Alta — perda de dados do usuário num cenário comum, contradizendo uma regra de negócio explícita.

### Resiliência a estados extremos (demais itens verificados)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Dia de recorrência mensal não existe no mês (ex.: dia 31 em fevereiro) | Tratado — `gerarInstanciasMensais` usa `Math.min(diaRecorrencia, ultimoDia)` (`reminderRecurrenceJob.js:23`), consistente com RN-163 (regra geral do sistema para receitas fixas, reaproveitada aqui) | ✅ |
| "Repetir a cada N dias" com lembrete muito atrasado (ex.: sistema fora do ar por meses) | Protegido por teto de iterações (`MAX_ITERACOES_AVANCO = 10_000`, `:60,92-102`), evita loop travando o cron | ✅ Boa engenharia defensiva |
| `repetirCadaDias` inválido (0 ou negativo) chegando ao banco | Guard explícito que ignora e loga, em vez de travar o job inteiro (`:82-87`) | ✅ |
| Evento apagado diretamente no Google (fora do Pulso) | `sincronizarLembrete` trata `404`/`410` na atualização e recria o evento (`googleCalendarSyncService.js:224-227`) em vez de propagar erro | ✅ |
| Token do Google expirado durante uma chamada | Listener `client.on('tokens', ...)` persiste o token renovado automaticamente, já criptografado (`getCalendarApi:87-93`) | ✅ Bem projetado |
| Job de alerta rodando sobre toda a tabela de lembretes (todos os usuários, sem paginação) | `verificarLembretesENotificar` faz `findMany({ where: { pago: false } })` sem limite — funciona bem no volume atual, mas é uma varredura completa da tabela a cada execução, sem paginação/lote | 🟡 Ponto de atenção para escala (RNF-007), não um bug hoje |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- **RF-NOVO-G1 (correção)** — Alinhar `criarLembrete` ao comportamento de `atualizarLembrete`: se a sincronização com o Google falhar, preservar o lembrete localmente com `sincronizado: false`, em vez de excluí-lo. Aplica-se principalmente ao caso de "Google desconectado", já previsto e resolvido pela própria RN-097.
- **RF-NOVO-G2** — Formalizar como requisito a importação de alterações do Google → Pulso (`importarAlteracoesDoGoogle`), hoje só citada en passant nas notas do README.

### Não funcionais

- **RNF-NOVO-G1 (Escalabilidade)** — Se o volume de lembretes crescer, paginar/batch a varredura do job de alertas por usuário ou por lote, em vez de carregar todos os lembretes não pagos do sistema inteiro a cada execução.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🔴 Corrigir `criarLembrete` para não apagar o lembrete em falha de sync (RF-NOVO-G1) | Perda de dados real, em cenário comum, contradizendo RN-097 explicitamente | Baixo |
| 2 | 🟢 Formalizar a importação Google→Pulso como requisito documentado (RF-NOVO-G2) | Já existe e funciona; só falta reconhecimento formal | Trivial |
| 3 | 🟢 Avaliar paginação do job de alertas antes de crescer a base de usuários (RNF-NOVO-G1) | Preventivo, não urgente | Baixo, não priorizar agora |

---

## ❓ Perguntas clarificadoras

1. O comportamento de apagar o lembrete na criação quando a sincronização falha foi uma decisão consciente (ex.: "se pediu sync e não deu, não quero o lembrete") ou reflete o mesmo tipo de descuido encontrado no cadastro de usuário (Módulo 01)? A divergência com o tratamento em `atualizarLembrete` sugere fortemente que é descuido.
2. Vale a pena documentar formalmente a importação Google→Pulso como um RF novo, já que é uma funcionalidade não trivial e já entregue?

---

*Próximo módulo sugerido: 08 — Gestão de Vale Transporte.*
