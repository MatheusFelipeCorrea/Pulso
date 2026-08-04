# _TEMPLATE — Epic entregue (compacto)

> Copie para `cards/[EPIC] Nome do Modulo.md` ao documentar módulo **já implementado**.

---

# [EPIC] Nome do Módulo

Tipo:        Epic  
Status:      ✅ Entregue (YYYY-MM)  
Prioridade:  🔺 Highest | 🔼 High | 🔽 Low  
Categoria:   (tags)  
Refs:        RF-xxx–yyy · PO-AUDIT-2026-08  
Pai:         —

---

## Descrição

(Uma frase: o que o módulo faz para o usuário.)

## RFs cobertos

| RF | Descrição curta | Status |
|----|-----------------|--------|
| RF-xxx | … | ✅ |

---

## Entregue

### Backend (`Codigo/Pulso/api/`)

- Rotas: `GET/POST …`
- Services / regras principais
- Jobs / integrações

### Frontend (`Codigo/Pulso/web/`)

- Rotas: `/…`
- Páginas / modais principais

### Banco (Prisma)

- Models / migrations relevantes

---

## Correções pós-auditoria PO

| ID | Correção | Commit / Ref |
|----|----------|--------------|
| RF-NOVO-x | … | PO-AUDIT-2026-08 |

---

## Pendências

- [ ] Item ainda aberto
- [ ] Integração futura com outro módulo

---

## Documentação

- Auditoria: [Documentacao/03-Auditorias/Product Owner/xx-….md](../../Documentacao/03-Auditorias/Product Owner/)
- Técnico: [Documentacao/02-Engenharia/](../../Documentacao/02-Engenharia/README.md)
- Requisitos: [Documentacao/01-Produto/Requisitos/Readme.md](../../Documentacao/01-Produto/Requisitos/Readme.md)

---

## Histórico

| Data | Evento |
|------|--------|
| YYYY-MM | Implementação inicial |
| YYYY-MM | Auditoria PO + correções |
