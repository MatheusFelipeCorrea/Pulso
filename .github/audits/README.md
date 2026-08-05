# Auditorias — prompts, scanners e resultados

Hub operacional de auditorias do repositório. **Prompts e novos resultados ficam aqui**; relatórios históricos (ago/2026) permanecem em [`Documentacao/03-Auditorias/`](../../Documentacao/03-Auditorias/README.md).

## Estrutura

```
.github/audits/
├── README.md           ← você está aqui
├── manifest.yml        ← mapa audit → skill → prompt → scanner → saída
├── prompts/            ← protocolos completos (spec para agentes)
├── scanners/           ← scanners automáticos (CI) + índice
└── results/            ← novos relatórios gerados por agentes
    ├── product-owner/
    ├── application-security/
    ├── devops/
    ├── code-review/
    ├── ux-design/
    └── architecture/
```

## Fluxo

| Tipo | Como rodar | Onde salvar |
|------|------------|-------------|
| **Automático** | Push/PR/schedule via GitHub Actions | Logs no Actions; achados manuais triados em `results/` |
| **Agente (Cursor)** | Skill em `.github/skills/*-audit/` ou colar prompt | `.github/audits/results/<tipo>/` |

## Invocar via skill

```
Audite o módulo 04 Metas com po-audit
Execute Fase 1 da security-audit
```

Auditorias **multi-fase**: uma fase por sessão; aguardar OK entre fases.

## Integração com cards

Após auditoria PO, atualizar epic em [`.github/plans/cards/`](../plans/cards/) — seções **Correções PO** e **Rastreamento de Implementação**.

## Histórico vs. novos resultados

| Local | Conteúdo |
|-------|----------|
| `Documentacao/03-Auditorias/` | Auditoria PO ago/2026 e demais relatórios já entregues |
| `.github/audits/results/` | **Novas** execuções a partir desta organização |

Não mover arquivos antigos — apenas passar a gravar novos achados em `results/`.
