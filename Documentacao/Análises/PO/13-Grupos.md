# 👥 Módulo 13 — Grupos — Auditoria PO/Engenharia de Requisitos

> Ver também: [00-Achados-Transversais.md](./00-Achados-Transversais.md), [Modulos/Grupos.md](../Modulos/Grupos.md) (documentação técnica já existente, usada como base e não repetida aqui)
> Fontes cruzadas: `Requisitos/Readme.md` (RF-088–102), `RegrasDeNegocio.md` (RN-111–120).
> Código auditado: `api/src/services/grupoService.js`, `api/src/utils/grupoMapper.js`, `api/src/routes/grupoRoutes.js`.

---

## 📋 Sumário

1. [Auditoria de Status (README vs. Realidade)](#1-auditoria-de-status-readme-vs-realidade)
2. [Gaps de Usabilidade e Jornada do Usuário](#2-gaps-de-usabilidade-e-jornada-do-usuário)
3. [Diagnóstico de Regras de Negócio e Validações](#3-diagnóstico-de-regras-de-negócio-e-validações)
4. [💡 Novos Requisitos Propostos](#4-novos-requisitos-propostos)
5. [Plano de Ação Priorizado](#5-plano-de-ação-priorizado)

**Resumo executivo:** este é o módulo mais complexo do sistema, já com documentação técnica própria (`Modulos/Grupos.md`) que é precisa e não precisa ser repetida aqui — os gaps já conhecidos (chat sem WebSocket real, integração pendente com `/expense-split`) permanecem corretos e não são reavaliados neste documento. A auditoria de código focou no que aquele documento não cobre: regras de negócio e concorrência. Achados: (1) o isolamento de dados pessoais (RN-098/116, a regra mais sensível do módulo) está **corretamente implementado** — nenhum dado financeiro pessoal vaza para o mapeamento de grupo; (2) a lógica de admin único/saída do grupo (RN-113) está correta, incluindo o caso extremo de o último membro sair (grupo é excluído); (3) foi encontrada uma **superfície de enumeração de grupos privados**: o endpoint de preview por código de convite não tem rate limit dedicado, e o espaço de códigos (`PULSO-XXXX`, alfabeto de 32 caracteres) tem "apenas" ~1 milhão de combinações — qualquer usuário autenticado pode, em tese, varrer códigos e descobrir nome/descrição/membros de grupos aos quais nunca foi convidado; (4) as mesmas checagens "verificar-depois-agir" já vistas em outros módulos aparecem aqui para os limites de "uma viagem por grupo" e "máximo 5 metas ativas".

---

## 1. Auditoria de Status (README vs. Realidade)

Todos os RF-088 a RF-102 já são detalhados requisito a requisito em `Modulos/Grupos.md`, com status ✅ confirmado para os 15. A leitura direta do `grupoService.js` confere com essa tabela — não há nenhum RF marcado como pronto que se revele scaffold morto ou incompleto. Este módulo, ao lado de Metas e Viagens, é um dos mais confiáveis do sistema em termos de "o que o README diz bater com o código".

---

## 2. Gaps de Usabilidade e Jornada do Usuário

1. **Preview de grupo por código não tem limite de tentativas dedicado.** `GET /grupos/preview?codigo=` (`grupoRoutes.js:29`) exige apenas estar autenticado (`authMiddleware`), sem nenhum rate limit específico (a limitação de RNF-004 já documentada como "apenas rotas de auth" se aplica aqui também). Combinado ao espaço de códigos (`PULSO-` + 4 caracteres de um alfabeto de 32 sem ambíguos, ou seja, 32⁴ ≈ 1.048.576 combinações possíveis — `grupoService.js:11`), um usuário malicioso autenticado (lembrando que o cadastro é aberto e gratuito) pode, em tese, varrer códigos sequencialmente e obter nome, descrição e preview de membros de grupos privados dos quais nunca participou ou foi convidado. Isso não expõe dados financeiros (RN-116 protege isso), mas expõe metadados sociais (quem está em qual grupo, nome do grupo) sem consentimento.
2. **Erros de código inválido e grupo não encontrado usam a mesma mensagem genérica** ("Código inválido ou grupo não encontrado", `:575,580,589,594`) — bom do ponto de vista de segurança (não revela se um código existe mas está mal formatado vs. simplesmente não existe), mas seria interessante confirmar se o frontend usa isso para dar um feedback amigável de "verifique o código" sem parecer um erro genérico de sistema.

---

## 3. Diagnóstico de Regras de Negócio e Validações

### Achado — Falta de rate limit dedicado ao preview/entrada por código (ver gap #1 acima)

Já coberto na seção 2. Vale reforçar aqui como um item de regra/segurança, não só UX: RN-111 define o formato do código mas não define nenhuma proteção contra varredura — vale considerar isso como uma lacuna de especificação, não só de implementação.

### Achado — Padrão "verificar-depois-agir" nos limites de negócio (viagem única e máx. 5 metas)

- `criarViagemGrupo` (`:271-277`) verifica `contarViagens(grupoId) > 0` antes de criar — duas requisições simultâneas de "vincular viagem" (ex.: dois admins clicando ao mesmo tempo) podem ambas passar na checagem e criar 2 viagens para o mesmo grupo, quebrando a suposição de `grupoMapper.mapViagemGrupo` de que existe **uma** viagem (`grupo.viagens?.[0]`) — a segunda viagem criada ficaria "invisível" (dado que só a primeira do array é usada), um bug silencioso de dado órfão.
- `criarMetasGrupo` (`:327-343`) verifica `contarMetasAtivas(grupoId) >= 5` antes de criar — mesma classe de risco, ainda que de impacto menor (só ultrapassaria o limite de 5 documentado, não perderia dados).

Esse é o mesmo padrão de concorrência já observado em outros módulos (cadastro de usuário, vínculo viagem-meta, saldo de VT) — reforça que vale uma revisão transversal de todos os "check-then-act" do sistema, não só deste módulo.

### Resiliência a estados extremos (itens que funcionam corretamente)

| Cenário | Comportamento | Resiliente? |
|---|---|---|
| Único admin tenta sair do grupo com outros membros presentes | Bloqueado com mensagem clara (RN-113 ✅, `sairDoGrupo:184-189`) | ✅ |
| Único membro (admin) sai do grupo | Grupo inteiro é excluído em vez de ficar "órfão" (`:193-196`) | ✅ Bom tratamento de edge case não documentado explicitamente em nenhum RN, mas correto |
| Rebaixar o único admin para membro | Bloqueado (`alterarPapelMembro:242-247`) | ✅ |
| Entrar em um grupo do qual já é membro (reenviar o mesmo código) | Idempotente — retorna o grupo sem duplicar associação (`entrarPorCodigo:597-600`) | ✅ |
| Admin tenta remover a si mesmo via endpoint de remoção de membro | Bloqueado com mensagem orientando usar "sair do grupo" (`removerMembroGrupo:209-211`) | ✅ |
| Vincular viagem pessoal (com despesas/meta já associadas) ao grupo | Copia apenas destino/moeda/data/imagem — não vaza despesas pessoais nem vínculo de meta pessoal para o grupo (RN-098/116 ✅) | ✅ |
| Geração de código de convite colidindo com um já existente | `gerarCodigoUnico` tenta até 12 vezes e verifica unicidade antes de usar (`:40-47`) | ✅ Boa prática, embora ainda tecnicamente check-then-act (aceitável dado o baixíssimo volume de criação de grupos) |

---

## 4. 💡 Novos Requisitos Propostos

### Não funcionais

- **RNF-NOVO-M1 (Segurança/Privacidade)** — Aplicar rate limit dedicado (por usuário, não só por IP) em `GET /grupos/preview` e `POST /grupos/entrar`, para impedir varredura do espaço de códigos de convite.
- **RNF-NOVO-M2 (Integridade de dados)** — Adicionar constraint única (ex.: índice único em `ViagemGrupo.grupoId`) para que "um grupo só pode ter uma viagem" seja garantido pelo banco, eliminando a janela de corrida em `criarViagemGrupo`.
- **RNF-NOVO-M3** — Mesma lógica do item anterior para o limite de 5 metas ativas por grupo — se o negócio considerar esse limite crítico, vale reforçar com uma verificação atômica (ex.: transação com `SELECT ... FOR UPDATE` ou constraint condicional).

---

## 5. Plano de Ação Priorizado (Next Steps)

| # | Ação | Por quê | Esforço estimado |
|---|---|---|---|
| 1 | 🟡 Rate limit dedicado para preview/entrada por código (RNF-NOVO-M1) | Único achado deste módulo com potencial real de abuso (enumeração de grupos privados) | Baixo |
| 2 | 🟡 Constraint única para "uma viagem por grupo" (RNF-NOVO-M2) | Elimina risco de dado órfão silencioso em caso de duplo clique/concorrência | Baixo |
| 3 | 🟢 Reforçar limite de 5 metas ativas com verificação atômica (RNF-NOVO-M3) | Impacto menor, mas mesma classe de risco | Baixo, não urgente |

Os demais gaps deste módulo (chat em tempo real, integração com `/expense-split`) já estão corretamente priorizados em `Modulos/Grupos.md` e não são repetidos aqui.

---

## ❓ Perguntas clarificadoras

1. A ausência de rate limit dedicado em `/grupos/preview` foi uma omissão, ou existe alguma proteção em outra camada (ex.: WAF da Vercel, Cloudflare) que eu não teria visibilidade lendo só o código da aplicação?
2. Vale a pena priorizar a constraint única de "uma viagem por grupo" agora, ou o volume de uso atual torna esse risco de concorrência puramente teórico por enquanto?

---

*Próximo módulo sugerido: 14 — Orçamento Mensal.*
