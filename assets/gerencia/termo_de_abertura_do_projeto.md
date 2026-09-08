# Termo de Abertura de Projeto (TAP) no.: 9999

**Nome da empresa:** Pulso

**Data:** 22/08/2026

**Integrantes:**

Alice Shikida, alice.salomao@pucminas.edu.br

Matheus Felipe, Matheus.silva.882564@pucminas.edu.br

Maria Clara Gomes, Maria.oliveira.1337652@sga.pucminas.br

Sofia Vasconcelos, sofia.silva.1525938@pucminas.edu.br

Vinícius Simões, vinicius.simoes@sga.pucminas.br

---

**Professores:**

Prof. Artur Martins Mol  
Prof. João Paulo Carneiro Aramuni  
Prof. Leonardo Vilela Cardoso  

---

_Curso de Engenharia de Software, Unidade Coração Eucarístico_  
_Instituto de Informática e Ciências Exatas – Pontifícia Universidade Católica de Minas Gerais (PUC MINAS), Belo Horizonte – MG – Brasil_  

---

## 1. IDENTIFICAÇÃO DO PROJETO

**1.1 Nome do Projeto:**  
Pulso - Ecossistema Inteligente de Gestão Financeira Pessoal e Colaborativa

**1.2 Gerente do Projeto:**  
Alice Shikida (Product Owner / Líder de Projeto)

**1.3 Cliente do Projeto:**  
Professores orientadores e usuários finais (trabalhadores CLT, estagiários, freelancers e grupos de jovens adultos).

**1.4 Tipo de Projeto:**  

[ ] Manutenção em produto existente  
[X] Desenvolvimento de novo produto  
[ ] Outro: __________________________________________________  

**1.5 Objetivo do projeto:**  
Desenvolver uma aplicação web e móvel de gestão e planejamento financeiro voltada ao mercado brasileiro, permitindo o controle unificado de saldos por tipo de recurso (salário, VA, VR), a divisão colaborativa de despesas em grupo, o planejamento de viagens e a leitura inteligente de extratos financeiros (PDF, OFX, CSV) com suporte de IA.

**1.6 Benefícios que justificam o projeto:**  
Centralização do controle orçamentário em uma só interface, eliminação de atritos sociais e cobranças manuais no rateio de despesas em grupo, automação na entrada de dados via leitura de extratos e facilidade no acompanhamento de gastos restritos a benefícios corporativos (VA/VR).

**1.7 Qualidade esperada do produto final (requisitos de qualidade):**  
- **Segurança:** Autenticação via JWT, senhas criptografadas com bcrypt, uso estrito de HTTPS e conformidade com a LGPD.
- **Usabilidade e Acessibilidade:** Interface com orientações de uso e rápido aprendizado das ferramentas oferecidas, adaptada para telas móveis e desktop.
- **Desempenho e Precisão:** Resposta ágil nas consultas e cálculo financeiro com precisão decimal exata (`Decimal(12,2)`), evitando erros de arredondamento.

---

## 2. ESCOPO PRELIMINAR E PREMISSAS

**2.1 O que será feito (escopo do projeto)**
- Módulo de autenticação segura (email/senha e Google OAuth 2.0).
- Dashboard com indicadores financeiros e separação de saldos por tipo de recurso (salário, VA, VR, dinheiro).
- Gestão de transações (receitas, despesas, transferências e recorrências).
- Módulo de metas financeiras e reservas de emergência.
- Módulo de planejamento de viagens com conversão de moedas.
- Módulo de grupos e divisão colaborativa de despesas.
- Módulo de lembretes e integração com Google Calendar.
- Leitura e importação de extratos bancários (OFX, CSV, PDF) utilizando IA (Gemini API).

**2.2 O que não será feito no projeto (contra-escopo)**
- Processamento direto de transações bancárias, PIX ou pagamentos dentro da plataforma.
- Atuação como instituição financeira, concessão de crédito ou empréstimos.
- Consultoria formal ou recomendação de investimentos em ativos de mercado.

**2.3 Resultados / serviços / produtos a serem entregues**

| **1.** | Aplicação Web e Móvel funcional (Front-end em React + Back-end em Node.js com banco PostgreSQL) |
| --- | --- |
| **2.** | Documentação de Arquitetura de Software completa (Seções 1 a 4) e Histórias de Usuário |
| **3.** | Manual de Implantação e Repositório do Código-Fonte no GitHub |

**2.4 Condições para início do projeto**
- Aprovação do escopo e do Termo de Abertura do Projeto na reunião de *Kick-off*.
- Definição do repositório no GitHub e organização inicial da equipe.
- Disponibilidade do ambiente de desenvolvimento e serviços em nuvem (Vercel, Neon, Gemini API).

---

## 3. ESTIMATIVA DE PRAZO

**3.1 Prazo previsto (horas):** 1.200 horas (considerando o esforço acumulado dos 5 integrantes ao longo do semestre).

**3.2 Data prevista de início:** 22/08/2026  
**3.3 Data prevista de término:** 15/12/2026  

---

## 4. ESTIMATIVA DE CUSTO

| Item de custo | Qtd. horas | Valor / hora | Valor total |
| --- | --- | --- | --- |
| **4.1 Recursos Humanos (5 Desenvolvedores/Estudantes):** | 1.200h | R$ 0,00 (Acadêmico) | R$ 0,00 |
| **4.2 Hardware (Notebooks e dispositivos móveis pessoais dos integrantes):** | N/A | N/A | R$ 0,00 |
| **4.3 Rede e serviços de hospedagem (Vercel / Neon / Railway Free Tier):** | N/A | N/A | R$ 0,00 |
| **4.4 Software de terceiros (Gemini API Free Tier / GitHub / Figma):** | N/A | N/A | R$ 0,00 |
| **4.5 Serviços e treinamento:** | N/A | N/A | R$ 0,00 |
| **4.6 Total Geral:** | **1.200h** | -- | **R$ 0,00** |

---

## 5. PARTES INTERESSADAS

| Nome | Papel no projeto | Assinatura |
| --- | --- | --- |
| Alice Shikida | Product Owner / Desenvolvedora | |
| Matheus Felipe | Desenvolvedor Back-end / Secretário | |
| Maria Clara Gomes | Desenvolvedora Front-end / UI | |
| Sofia Vasconcelos | Desenvolvedora Front-end / QA | |
| Vinícius Simões | Desenvolvedor Back-end / DevOps | |

**Observações:**

- As estimativas de prazo e custo são aproximadas e podem variar ao longo do projeto, devendo ser revistas após o detalhamento dos requisitos.
- Este documento, após ser completamente preenchido, deve ser assinado digitalmente (Gov.br) pelos responsáveis do projeto.
- Este documento, se aprovado na **reunião de *kickoff***, autoriza o início do projeto de acordo com a especificação supra e as normas da empresa.
