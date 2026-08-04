---
name: security-audit
description: >-
  Auditoria AppSec em 3 fases (auth, dados/integrações, infra/LGPD). OWASP Top 10,
  OWASP API Security, LGPD. Gera achados SEC-N-NN em Documentacao/03-Auditorias/Application Security/.
  Execute UMA fase por vez; aguarde OK do usuário entre fases.
---

# Security Audit — AppSec em Fases

## Protocolo completo

`Documentacao/03-Auditorias/Prompts/AnaliseSegurança.md`

## Variáveis

| Variável | Valores |
|----------|---------|
| `${PHASE}` | `1` \| `2` \| `3` \| `consolidar` |
| `${OUTPUT_DIR}` | `Documentacao/03-Auditorias/Application Security/` |

## Arquivos de saída por fase

| Fase | Arquivo |
|------|---------|
| 1 | `${OUTPUT_DIR}/security-fase-1-auth-authz.md` |
| 2 | `${OUTPUT_DIR}/security-fase-2-dados-integracoes.md` |
| 3 | `${OUTPUT_DIR}/security-fase-3-infra-lgpd.md` |
| consolidar | `${OUTPUT_DIR}/security-sumario-executivo.md` |

## Regras invioláveis

- **UMA fase por vez** — parar e aguardar "OK, próxima fase"
- ID achados: `SEC-<FASE>-<NN>`
- Cada achado: vetor de ataque, impacto, severidade, facilidade, mitigação com código
- Criar pasta `${OUTPUT_DIR}` se não existir

## Escopo do projeto Pulso (contexto)

- Auth: cookies httpOnly, refresh mutex — `authCookies.js`, `authService.js`
- Google tokens: AES-256-GCM — `googleTokenCrypto.js`
- Rate limit parcial: auth + convites grupo
- Serverless Vercel — rate limit em memória é limitação conhecida

## Exemplo

> Execute Fase 1 da auditoria de segurança. Salve em Documentacao/03-Auditorias/Application Security/
