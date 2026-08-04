---
name: po-audit
description: >-
  Auditoria Product Owner módulo a módulo: confronta requisitos (Documentacao/01-Produto)
  com código real (api/web/prisma), gera achados e plano de ação em Documentacao/03-Auditorias/Product Owner/.
  Use ao auditar um módulo, revisar gaps RF/RN, ou antes de fechar um epic em plans/cards/.
---

# PO Audit — Auditoria de Requisitos vs Código

## Quando usar

- Auditar **um módulo** por vez (Autenticação, Metas, Viagens, etc.)
- Validar se README/Web/API reflete a realidade
- Gerar ou atualizar docs em `Documentacao/03-Auditorias/Product Owner/`
- Alimentar cards em `.github/plans/cards/` com correções PO

## Protocolo completo (obrigatório)

Leia e siga **integralmente**:

`Documentacao/03-Auditorias/Prompts/AnalisePO.md`

## Variáveis de execução

| Variável | Default | Descrição |
|----------|---------|-----------|
| `${MODULE_NUM}` | (usuário informa) | Ex.: `04`, `05` |
| `${MODULE_SLUG}` | (usuário informa) | Ex.: `Metas-Financeiras` |
| `${MODULE_NAME}` | (usuário informa) | Ex.: `Metas Financeiras` |
| `${OUTPUT_FILE}` | `Documentacao/03-Auditorias/Product Owner/${MODULE_NUM}-${MODULE_SLUG}.md` | Arquivo de saída |

## Fontes obrigatórias

1. `Documentacao/01-Produto/Requisitos/Readme.md` — RFs do módulo
2. `Documentacao/01-Produto/Regras-de-Negocio.md` — RNs relacionadas
3. `Documentacao/02-Engenharia/API/Readme.md` e `Web/Readme.md`
4. Código: `Codigo/Pulso/api/src/`, `Codigo/Pulso/web/src/`, `prisma/schema.prisma`
5. Card epic: `.github/plans/cards/[EPIC] *.md` (se existir)

## Regras de execução

1. **Um módulo por sessão** — não auditar 25 módulos de uma vez
2. **Não resumir** — ser exaustivo; citar arquivos e linhas
3. **Salvar** o resultado em `${OUTPUT_FILE}` (não só no chat)
4. Estrutura de saída conforme protocolo (Sumário + 5 seções + perguntas)
5. Após salvar: sugerir atualização do card epic em `.github/plans/cards/` (seção Correções PO)

## Integração com o repo

- Índice PO: `Documentacao/03-Auditorias/Product Owner/00-Sumario-Executivo.md`
- Commits: `Refs: PO-AUDIT-2026-08` ou `Refs: RF-xxx` — ver `Documentacao/02-Engenharia/Guia-Commits.md`
- Cards entregues: formato completo em `.github/plans/cards/` com rastreamento de implementação

## Exemplo de invocação

> Audite o módulo 04 Metas Financeiras. Salve em `Documentacao/03-Auditorias/Product Owner/04-Metas-Financeiras.md`.
