---
card_id: "PULSO-TASK-061"
title: "Banco de dados — Lembrete e config Google"
status: "Backlog"
type: "Task"
priority: "Highest"
sprint: null
story_points: null
reporter: null
parent: "PULSO-FEAT-030"
due_date: null
board_sync_at: "2026-08-26T15:31:49.000Z"
categories:
  - "Banco de Dados"
  - "Regra de Negócio"
---


# [TASK] Banco de dados — Lembrete e config Google

> **Contexto:** Modelagem persistente para lembretes e tokens Google Calendar.

## 📝 Descrição

Criar model `Lembrete` e campos Google em `ConfiguracaoUsuario`.

## 🛠️ Implementação

### `schema.prisma` (NOVO — CRIAR)

**Lembrete:** titulo, valor?, dataVencimento, horaLembrete, antecedencia, categoria, pago, googleEventId?, sincronizado, repetirMensal, diaRecorrencia?, repetirCadaDias?, lembreteTemplateId?

**Enums:** `AntecedenciaLembrete`, `CategoriaLembrete` (52 valores)

**ConfiguracaoUsuario:** googleCalendarAtivo, googleCalendarId, googleCalendarEmail, tokensGoogle (Json criptografado)

**Índices:** `[usuarioId, dataVencimento]`, sincronizado, repetirMensal

**Migrations:** `20260609120000_lembrete_recorrencia`, `20260707165414_add_hora_lembrete`, `20260715160000_lembrete_repetir_cada_dias_check`

## 📋 Resumo

### ✅ Concluído
- Spec de models definida

### ⏳ Pendente
- Criar/aplicar migrations Prisma
