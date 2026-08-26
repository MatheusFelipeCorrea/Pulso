---
card_id: PULSO-FEAT-084
title: "Solução — telas do sistema construído"
status: Backlog
type: Feature
priority: Low
sprint: null
story_points: null
reporter: null
parent: PULSO-EPIC-014
due_date: null
categories:
  - Documentação
  - UX / UI
---

# [FEATURE] Solução — telas do sistema construído

> **Contexto:** `docs/7.solucao.md` pede as **telas do sistema construído**, não o Figma. Fica depois da implementação das UIs; os protótipos (`PULSO-EPIC-015`) alimentam o `docs/5`, não esta seção.

**Arquivo:** `docs/7.solucao.md`

## 📖 Histórias

- Como **equipe**, quero capturas das interfaces implementadas com descrição sucinta, para a seção 7 mostrar o que o software de fato entrega.
- Como **avaliador**, quero cada tela principal identificada (rota + propósito), para distinguir protótipo de produto.

## ✅ Critérios de Aceite

### Cenário 1 — Fonte
**Então** as imagens vêm do app (local ou deploy), não só do Figma; se ainda não houver build, a feature permanece pendente (não preencher com mock genérico).

### Cenário 2 — Cobertura
**Então** descreve as telas equivalentes aos módulos prototipados que já existirem na implementação (auth, dashboard, transações, etc.), com uma frase de o que a interface faz.

### Cenário 3 — Consistência
**Então** nomes de rota e módulos batem com os cards de produto; VA/VR, sem VT.

### Cenário 4 — Separação
**Então** não duplica a seção 5: 5 = estrutura/protótipo; 7 = UI construída.

## 📋 Resumo

### ✅ Concluído
- Papel da seção 7 vs. 5 definido

### ⏳ Pendente
- Screenshots quando houver frontend
