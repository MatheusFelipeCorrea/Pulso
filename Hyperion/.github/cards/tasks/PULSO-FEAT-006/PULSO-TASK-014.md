---
card_id: PULSO-TASK-014
title: "Backend — controller, routes e mount /dashboard"
status: Backlog
type: Task
priority: Highest
sprint: null
story_points: null
reporter: null
parent: PULSO-FEAT-006
due_date: null
categories:
  - Backend
---

# [TASK] Backend — controller, routes e mount /dashboard

> **Contexto:** Expor o service de dashboard via REST autenticado.

## 📝 Descrição

Criar camada HTTP fina: controller → service, rota protegida por `authMiddleware`.

## ✅ Critérios de Aceite

| Método | Rota | Comportamento |
|--------|------|---------------|
| `GET` | `/api/dashboard` | `authMiddleware` → `obterDashboard(req.user.id, req.query)` → `200` |

Query opcional: `mes=YYYY-MM`

## 🛠️ Implementação

### `dashboardController.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/controllers/dashboardController.js`

- `obterDashboard(req, res, next)`

### `dashboardRoutes.js` (NOVO — CRIAR)

Criar em: `Codigo/Pulso/api/src/routes/dashboardRoutes.js`

```javascript
router.get('/', authMiddleware, dashboardController.obterDashboard)
```

### `routes/index.js` (EXISTENTE — MODIFICAR)

Adicionar: `router.use('/dashboard', dashboardRoutes)`

## 📋 Resumo

### ✅ Concluído
- Contrato HTTP definido

### ⏳ Pendente
- Implementar controller e routes
- Registrar mount em `routes/index.js`
