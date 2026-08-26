# Módulos planejados (escopo TI5) — Auditoria de Prontidão

> Escopo TI5 de **planejados**: apenas **Onboarding**. Cartão de crédito, bots, modo casal/família, PWA e Veículos/FIPE **não** fazem parte do fork de entrega.
>
> Importação de extratos (RF-155–160) já está parcialmente entregue na UI/API; o gap restante é RF-159 (aprendizado), não um módulo “só no papel”.
>
> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md)

---

## 1. Módulo 19 — Onboarding (RF-151–154)

- **Prontidão:** Boa clareza de objetivo ("eliminar o cold start"), mas as 4 RFs são de alto nível — falta detalhar a ordem exata dos passos do wizard, o que acontece se o usuário sair no meio (estado parcial salvo?), e se é possível refazer o onboarding depois.
- **Dependência crítica:** RF-153 ("selecionar modo de uso durante o onboarding") é o caminho de escrita de `modoUso` que o [Módulo 10](./10-Perfil-e-Configuracoes.md) identificou como inexistente hoje. Se o Onboarding atrasar, o gap do Perfil (usuário travado em CLT) persiste.
- **Falta especificar:** o que acontece se o usuário pular o onboarding (RF-154) e nunca mais voltar — ele fica sem `modoUso` definido a menos que exista configuração pela tela de Perfil depois.
- **Recomendação:** escrever RN do Onboarding antes de implementar, amarrando explicitamente à resolução do gap de `modoUso` do Módulo 10.

---

## 2. Importação (contexto, não “planejado do zero”)

- Fluxo upload → parse → preview → confirmação já existe.
- Gap conhecido: RF-159 (aprendizado de categorização) ainda não entregue.
- Dependência de `categorySuggestionService` permanece válida para evoluir o aprendizado.

---

## 3. Plano de ação (TI5)

| # | Ação | Por quê |
|---|---|---|
| 1 | Priorizar Onboarding + escrita de `modoUso` | Desbloqueia Perfil/calendário de recebimentos fixos |
| 2 | Escrever RN do Módulo 19 antes do código | Evita ambiguidade de wizard / skip / reentrada |
| 3 | Tratar RF-159 como evolução da Importação já existente | Não reabrir módulo 20 como greenfield |

---

## Perguntas em aberto

1. **`modoUso`** — onboarding primeiro ou também tela de Perfil como fallback?

---

*Arquivo enxugado para escopo TI5 (Onboarding). Seções 21–25 (cartão, bots, casal, PWA, FIPE) removidas deste fork.*
