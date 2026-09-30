# Recorte Sprint-3 — achados feitos (módulos já entregues)

Data: 2026-09-30  
Branch: `fix/auditoria-completa-achados`  
Fora de escopo: hospedagem (Vercel/URL/CD), API de Grupos, Socket.IO, OpenAPI, CI Flutter, LGPD, billing.

Os IDs abaixo passaram de **Vale agora** (ou duplicata barata do mesmo recorte) para **Feito**. Relatórios em `results/` continuam o snapshot estático de 30/09; este overlay é o status operacional.

| ID | O quê |
|----|--------|
| ARCH-1-02 | Aporte de meta atômico (`FOR UPDATE`) |
| ARCH-1-11 | Recorrência: filha + tags na mesma transação |
| ARCH-2-02 | Consumers Rabbit sobem com `RABBITMQ_URL` (fail-soft) |
| ARCH-2-03 | `jobBridge` só referencia jobs existentes |
| ARCH-2-05 | `PATCH /auth/me/plano` 403 sem billing |
| SEC-1-01 | Tokens JSON só com cliente mobile de verdade |
| SEC-1-02 | Auto-upgrade Premium bloqueado |
| SEC-1-03 | Exchange OAuth no hash + jti consume-once |
| OPS-2-04 | Recorrência Serializable / concorrência |
| OPS-2-05 | Job de contas não verificadas no cron |
| OPS-2-07 | Rabbit fail-soft (PR #343) |
| DEV-1-01 | Aporte atômico |
| DEV-1-02 | Job copia `recursoDestino` |
| DEV-1-03 | Filtro `periodo` em `America/Sao_Paulo` |
| DEV-1-04 | MONTHLY dia 31 em meses curtos |
| DEV-1-06 | Notificação pós-INSERT não vira 500 |
| DEV-1-08 | Plano Premium sem billing |
| DEV-1-09 | Exchange jti de uso único |
| DEV-1-11 | Cleanup de contas no cron |
| DEV-2-01 | Refresh no bootstrap `/auth/me` |
| DEV-2-02 | `parseMoney` decimal vs milhar |
| DEV-2-03 | Flutter envia `destinoMeta` |
| DEV-2-04 | Grupos escondidos no Flutter |
| DEV-2-07 | Web não vincula grupo após criar viagem |
| DEV-2-08 | Sidebar sem rotas mortas |
| DEV-2-09 | `/trips` FREE não quebra a página |
| DEV-3-02 | Teste Flutter do ponto decimal |
| DEV-3-03 | Teste web de refresh em `/auth/me` |
| DEV-3-04 | Teste `FREQ=DAILY` e transferência |
| PO-001 | Flutter sem Grupos na nav |
| PO-002 | Landing: Grupos/Calendário “Em breve” |
| PO-003 | Pós-login → `/transactions` |
| PO-008 | Perfil e Configurações autenticados |
| PO-018 | Destino autenticado Web = Flutter |
| UX-1-03 | `lang=pt-BR` e Material pt-BR |
| UX-3-01 | Perfil/Config não caem na landing |
| UX-3-02 | Destino pós-login alinhado |
| UX-3-03 | Árvore de navegação do recorte |
| UX-3-04 | Premium: web esconde / Flutter redireciona |
| UX-3-05 | Vocabulário pretensão na viagem |
