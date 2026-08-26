# 📅 Módulo 07 — Lembretes e Google Agenda — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-062–058, RF-067), `RegrasDeNegocio.md` (RN-094–100, RN-169).
> Código auditado: `api/src/services/{reminderService,reminderAlertService,googleCalendarSyncService}.js`, `api/src/jobs/{reminderRecurrenceJob,reminderAlertJob}.js`, `api/src/utils/googleTokenCrypto.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** módulo tecnicamente sofisticado — integração real com Google Calendar (calendário dedicado "Pulso", import bidirecional, refresh de token criptografado, jobs de cron com teto de iterações). README marca **✅ 5/5 + RF-067**, confirmado. **Correção aplicada (ago/2026):** `criarLembrete` preserva o lembrete com `sincronizado: false` quando a sync falha (RN-097 / RF-NOVO-G1), alinhado a `atualizarLembrete`.

---

## 1. Auditoria de Status (README vs. Realidade)

| RF | Descrição | Status README | Realidade no código |
|---|---|---|---|
| RF-062 | Conectar conta Google para Google Calendar | ✅ | Confirmado (fluxo de OAuth do Calendar, distinto do OAuth de login — `GOOGLE_CALENDAR_CALLBACK_URL` próprio) |
| RF-063 | Criar lembretes com data e valor | ✅ | Confirmado, `criarLembrete` |
| RF-064 | Sincronizar lembretes como eventos no Google Calendar | ✅ | Confirmado — cria calendário "Pulso" dedicado (`garantirCalendarioPulso`) |
| RF-065 | Ativar/desativar integração a qualquer momento | ✅ | Confirmado — `aplicarSyncGoogle` remove o evento do Google quando `wantsSync=false` |
| RF-066 | Configurar antecedência do lembrete | ✅ | Confirmado, `ANTECEDENCIA_DIAS`/`ANTECEDENCIA_MINUTOS` |
| RF-067 | Importar alterações Google → Pulso | ✅ | Confirmado, `importarAlteracoesDoGoogle` — formalizado no README |

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. ~~**Criar lembrete com sync ativado e Google desconectado apaga o lembrete.**~~ **✅ Corrigido** — lembrete é preservado com `sincronizado: false`; usuário pode reconectar e sincronizar depois.
2. **Erros do Google são bem tratados e comunicados** (`mapGoogleError`) — mensagens específicas para escopo insuficiente, sessão expirada, sem permissão. Ponto forte do módulo.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### ✅ Corrigido — Falha de sync na criação (RN-097 / RF-NOVO-G1)

**Código atual (`reminderService.js:102-111`):**
```js
try {
    const syncData = await aplicarSyncGoogle(usuarioId, lembrete, true);
    const atualizado = await reminderRepository.atualizar(lembrete.id, syncData);
    return mapLembreteComContagem(atualizado);
} catch (error) {
    return mapLembreteComContagem({
        ...lembrete,
        sincronizado: false,
        googleEventId: null,
    });
}
```
Comportamento alinhado a RN-097 e consistente com `atualizarLembrete`.

### Resiliência a estados extremos (demais itens verificados)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Dia de recorrência mensal não existe no mês (ex.: dia 31 em fevereiro) | Tratado — `gerarInstanciasMensais` usa `Math.min(diaRecorrencia, ultimoDia)` | ✅ |
| "Repetir a cada N dias" com lembrete muito atrasado | Protegido por teto de iterações (`MAX_ITERACOES_AVANCO = 10_000`) | ✅ |
| `repetirCadaDias` inválido (0 ou negativo) | Guard explícito que ignora e loga | ✅ |
| Evento apagado diretamente no Google | `sincronizarLembrete` recria o evento em 404/410 | ✅ |
| Token do Google expirado durante chamada | Listener `client.on('tokens', ...)` persiste token renovado criptografado | ✅ |
| Job de alerta sobre toda a tabela | Varredura completa sem paginação — atenção para escala (RNF-007) | 🟡 |

---

## 4. 💡 Novos Requisitos Propostos

### Funcionais

- ~~**RF-NOVO-G1 (correção)**~~ — ✅ `criarLembrete` preserva lembrete em falha de sync.
- ~~**RF-NOVO-G2**~~ — ✅ Formalizado como **RF-067** no README.

### Não funcionais

- **RNF-NOVO-G1 (Escalabilidade)** — Paginar/batch a varredura do job de alertas se o volume crescer.

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Status | Esforço |
|---|---|---|---|
| 1 | Corrigir `criarLembrete` (RF-NOVO-G1) | ✅ Feito | — |
| 2 | Formalizar importação Google→Pulso (RF-NOVO-G2 / RF-067) | ✅ Feito | — |
| 3 | Paginação do job de alertas (RNF-NOVO-G1) | 🟢 Pendente | Baixo, preventivo |

---

## ❓ Perguntas clarificadoras

1. ~~Apagar lembrete na falha de sync~~ — **Resolvido:** era descuido; corrigido para preservar registro.
2. ~~Documentar importação Google→Pulso~~ — **Resolvido:** RF-067 no README.

---

*Próximo módulo sugerido: 10 — Perfil e Configurações.*
