# Auditoria Product Owner — Pulso

**Data:** 2026-11-09  
**Fonte primária:** `docs/3.requisitos.md`, `docs/7.solucao.md`, código Sprint 6

---

## 1. Resumo executivo

Rastreabilidade da **Sprint 6 é forte**: RF-048–RF-061 e RF-015 marcados implementados com notas que citam rotas, Gemini e modelos Prisma. Documentação de solução (`7.solucao.md` §7.6) alinhada ao código. Lacunas relevantes: **RF-035 notificações**, **RF-056 revisão semanal em backlog**, **contrato Hyperion desatualizado**, e **protótipos Sprint 5/6** ainda pendentes em `docs/prototipos/`.

Conclusão: produto **entregável para demo e avaliação** com IA; pendências são majoritariamente **não bloqueantes para Sprint 6**, exceto consistência de notificações se o time prometer inbox unificada.

---

## 2. Escopo e contexto detectado

- Requisitos: `docs/3.requisitos.md` (tabela RF por sprint)
- Solução: `docs/7.solucao.md` (incl. reseed tester)
- API README produto: `Codigo/Pulso/api/Documents/Readme.md` (mapa Insights/Chatbot)
- Contrato projeto: `.github/project.yml`

---

## 3. Achados priorizados

### PO-001 — Sprint 6 essenciais fechados com evidência cruzada

- **Evidência:** `docs/3.requisitos.md:87-105` (RF-048–060, RF-015 `[x]`); `docs/7.solucao.md:56-63`; rotas `routes/index.js:44-45`; telas `web/src/pages/InsightsPage.jsx`, `ChatbotPage.jsx`; Flutter `insights_screen.dart`, `chatbot_screen.dart`.
- **Constatação:** Requisitos essenciais de IA têm implementação web + mobile + API.
- **Impacto:** Positivo — sprint auditável.
- **Severidade:** N/A
- **Recomendação:** Manter coluna “evidência” no 3.requisitos ao fechar sprint.
- **Critério de aceite:** Cada RF Sprint 6 com path citado.

### PO-002 — RF-035 notificações parcial vs expectativa de produto

- **Evidência:** `docs/3.requisitos.md:64` — API cria notificação, rota comentada; `routes/index.js:46-47`.
- **Constatação:** Usuário não vê meta atingida na inbox se UI depende de `/notificacoes`.
- **Impacto:** Quebra promessa desejável; insights seed referencia tipo `INSIGHT_IA` (`seed.js` ~1462).
- **Severidade:** Média | **Confiança:** Alta
- **Recomendação:** Fechar RF-035 ou rebaixar escopo na tabela para “somente backend”.
- **Critério de aceite:** GET lista notificações autenticada + tela web/Flutter.

### PO-003 — `project.yml` contradiz requisitos (rastreabilidade quebrada)

- **Evidência:** `.github/project.yml:94-95` vs `routes/index.js:41` e mobile Socket (`group_chat_socket.dart:7-8`).
- **Constatação:** Ferramenta de gestão Hyperion reporta estado falso.
- **Impacto:** PO perde confiança no board/automação.
- **Severidade:** Média | **Confiança:** Alta
- **Recomendação:** `/discover` após Sprint 6.
- **Critério de aceite:** `uncertainties` vazio ou só itens reais (deploy).

### PO-004 — RF-056 revisão semanal ainda backlog

- **Evidência:** `docs/3.requisitos.md:95` — `[ ]` Backlog.
- **Constatação:** Fora do escopo entregue; não confundir com insights mensais (RF-048).
- **Impacto:** Baixo para encerramento Sprint 6.
- **Severidade:** Baixa | **Confiança:** Alta
- **Recomendação:** Mover para sprint futura ou cortar com justificativa.
- **Critério de aceite:** RF atualizado ou épico novo.

### PO-005 — Demo operacional documentada (reseed-tester)

- **Evidência:** `docs/7.solucao.md:67`; `api/Documents/Readme.md` seção seed; `reseed-tester.js:1-8`.
- **Constatação:** Critério de demo objetivo para banca/cliente (`tester@mail.com`).
- **Impacto:** Positivo para apresentação Sprint 6 com dados ricos (insights + chat).
- **Severidade:** N/A
- **Recomendação:** Incluir no roteiro de demo RF-048 e RF-057 em sequência.
- **Critério de aceite:** README time com comando único.

### PO-006 — RF-140 parity mobile declarada completa; incerteza Hyperion diz o oposto

- **Evidência:** `docs/3.requisitos.md:244` `[x]` parity; `.github/project.yml:95` Socket Flutter ausente.
- **Constatação:** Documentação de requisitos mais atual que contrato kit.
- **Impacto:** Risco de comunicação externa incorreta.
- **Severidade:** Baixa | **Confiança:** Alta
- **Recomendação:** Fonte única: requisitos + discover.
- **Critério de aceite:** Uma linha verdadeira em ambos arquivos.

---

## 4. Pontos positivos

- Matriz RF com sprint, prioridade e checkbox.
- `7.solucao.md` descreve Sprint 6 em linguagem de produto.
- RF-015 quick-add rastreável web (`DashboardChatbotFab`) e mobile (`app_shell.dart:138`).

---

## 5. Quick wins

1. Atualizar `.github/project.yml`.
2. Nota em RF-035 com data alvo ou “Won’t fix” explícito.
3. Checklist demo Sprint 6 no `1.apresentacao.md` (se existir seção demo).

---

## 6. Roadmap e riscos

| Prazo | Entrega sugerida |
|-------|------------------|
| Curto | RF-035 ou escopo ajustado |
| Médio | RF-056 ou remoção |
| Longo | Protótipos PNG Sprint 5/6 em `docs/prototipos/` (`7.solucao.md:5`) |

**Questão aberta:** URL pública produção — bloqueia validação RF não-funcionais de disponibilidade?
