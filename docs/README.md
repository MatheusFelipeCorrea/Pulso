# Pulso

**Alice Shikida, alice.salomao@pucminas.edu.br**

**Matheus Felipe, Matheus.silva.882564@pucminas.edu.br**

**Maria Clara Gomes, Maria.oliveira.1337652@sga.pucminas.br**

**Sofia Vasconcelos, sofia.silva.1525938@pucminas.edu.br**

**Vinícius Simões, vinicius.simoes@sga.pucminas.br**

---

Professores:

**Artur Martins Mol**

**João Paulo Carneiro Aramuni**

**Leonardo Vilela Cardoso**

---

_Curso de Engenharia de Software, Campus Lourdes_

_Instituto de Informática e Ciências Exatas – Pontifícia Universidade de Minas Gerais (PUC MINAS), Belo Horizonte – MG – Brasil_

---

_**Resumo**.
O controle orçamentário pessoal no Brasil enfrenta desafios estruturais devido à fragmentação de rendas com restrições de uso, como salários e benefícios corporativos (VA e VR), e à gestão descentralizada de despesas compartilhadas. Este trabalho apresenta o projeto arquitetural do Pulso, uma aplicação de gestão e planejamento financeiro (Web React, API Node.js e app Flutter) voltada ao contexto brasileiro. Desenvolvido sobre uma arquitetura em camadas com React, Node.js, Prisma e Flutter, o sistema integra a gestão de saldos por tipo de recurso, dashboard unificado, grupos com chat em tempo real, dívidas e divisão de despesas, planejamento de viagens, importação de extratos assistida por IA (Gemini) e modelo freemium demonstrável (Free / Premium sem gateway de pagamento). Como resultado, a solução estabelece um ecossistema seguro e em conformidade com a LGPD — inclusive com exclusão de conta —, que reduz o esforço manual na consolidação de dados e elimina atritos sociais no rateio de despesas, promovendo previsibilidade e autonomia financeira ao usuário._

---

## SUMÁRIO

1. [Apresentação](1.apresentacao.md#apresentacao "Apresentação") <br />
   1.1. Problema <br />
   1.2. Objetivos do trabalho <br />
   1.3. Definições e Abreviaturas <br />

2. [Nosso Produto](2.nosso_produto.md#produto "Nosso Produto") <br />
   2.1. Visão do Produto <br />
   2.2. Nosso Produto <br />
   2.3. Personas <br />

3. [Requisitos](3.requisitos.md#requisitos "Requisitos") <br />
   3.1. Requisitos Funcionais <br />
   3.2. Requisitos Não-Funcionais <br />
   3.3. Restrições Arquiteturais <br />
   3.4. Mecanismos Arquiteturais <br />

4. [Modelagem](4.modelagem.md#modelagem "Modelagem e projeto arquitetural") <br />
   4.1. Histórias de usuário e casos de uso <br />
   4.2. Visão lógica <br />
   4.3. Modelo de dados <br />
   4.4. Comportamento e fluxos <br />

5. [Wireframes](5.wireframe.md#wireframes "Wireframes") <br />

6. [Avaliação Heuristica](6.avaliacao_heuristica.md#solucao "Projeto da Solução") <br />

7. [Solução](7.solucao.md#solucao "Projeto da Solução") <br />

8. [Avaliação Arquitetura](8.avaliacao_arquitetura.md#avaliacao "Avaliação da Arquitetura") <br />
   8.1. Cenários <br />
   8.2. Avaliação <br />

[Ferramentas](#ferramentas "Ferramentas")<br />

<a name="ferramentas"></a>

# Ferramentas

| Ambiente              | Plataforma | Link de Acesso |
| --------------------- | ---------- | -------------- |
| Repositório de código | GitHub     | https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso |
| Código das apps       | GitHub     | https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso/tree/main/Codigo |
| Hospedagem (web)      | Vercel     | https://pulso-psi-five.vercel.app |
| Hospedagem (API)      | Render     | https://pulso-api-aldu.onrender.com |
| Guia de demo          | Docs       | [`docs/hospedagem-demo.md`](hospedagem-demo.md) |
| Protótipos (export)   | Apostila   | [`docs/prototipos/`](prototipos/) — Figma em breve |
