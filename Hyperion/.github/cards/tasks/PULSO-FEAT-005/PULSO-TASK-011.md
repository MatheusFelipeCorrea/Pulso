---
card_id: PULSO-TASK-011
title: "Frontend — guardas de rota autenticada"
status: Done
type: Task
priority: High
sprint: null
story_points: null
reporter: "Matheus Felipe Correa"
parent: PULSO-FEAT-005
due_date: null
categories:
  - Frontend
  - Web
  - Cibersegurança
  - UX / UI
---

# [TASK] Frontend — guardas de rota autenticada

> **Contexto:** Separar área pública, auth e app logado no React Router.

## 📝 Descrição

Garantir que rotas financeiras exijam sessão válida e rotas de login/cadastro redirecionem usuários já autenticados.

## ✅ Critérios de Aceite

### Cenário 1 — Protegida
**Dado** `sessionChecked=true` e `isAuthenticated=false`,  
**Quando** acessa rota sob `ProtectedRoute`,  
**Então** `<Navigate to="/login" state={{ from }} />`.

### Cenário 2 — Guest
**Dado** usuário autenticado,  
**Quando** acessa `/login` ou `/register`,  
**Então** redirect `/transactions`.

### Cenário 3 — Loading
**Dado** `sessionChecked=false`,  
**Então** render `null` (aguarda `AuthBootstrap`).

## 🛠️ Implementação

### Componentes (NOVO — CRIAR)

| Arquivo | Export |
|---------|--------|
| `Codigo/web/src/components/routing/ProtectedRoute.jsx` | `ProtectedRoute`, `GuestRoute` |
| `Codigo/web/src/components/routing/AuthBootstrap.jsx` | Wrapper de sessão |
| `Codigo/web/src/config/appRoutes.js` | Paths centralizados do app |
| `Codigo/web/src/App.jsx` | Árvore de rotas pública vs `MainLayout` protegido |

### Prefixos guest em `api.js` (NOVO — CRIAR)

`GUEST_PATH_PREFIXES` — evitar redirect agressivo em telas auth durante refresh falho

## 🔗 Pull Requests

- [#286](https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/pull/286) — Login, sessão e guards (`feat/15`)

## 👤 Responsável

- Matheus Felipe Correa (`MatheusFelipeCorrea`)

## 📋 Resumo

### ✅ Concluído
- Spec de guards e árvore de rotas definida

### ⏳ Pendente
- Nenhum
