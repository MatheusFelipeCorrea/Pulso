# 💜 Pulso

**Pulso** é um sistema de gestão financeira pessoal desenvolvido para estagiários, estudantes e jovens em início de carreira que estão aprendendo a lidar com dinheiro. O sistema diferencia recursos reais (salário) de benefícios com restrição de uso (VA, VR), oferece insights inteligentes via IA (Google Gemini), planejamento de viagens com câmbio integrado, e funcionalidade de grupos para planejamento compartilhado. Interface moderna em modo claro e escuro, com modelo **freemium** na landing (Free R$ 0 · Premium R$ 50/mês — gate de módulos Premium na API, sem gateway de pagamento no escopo TI5).

O nome "Pulso" remete à ideia de manter o pulso firme nas finanças, monitorar a saúde financeira como um batimento cardíaco e criar o hábito diário de controle — cada registro é uma batida, cada dia é um passo rumo à estabilidade.

## Alunos integrantes da equipe

* Matheus Felipe Correa da Silva
* Alice Shikida Salomão
* Maria Clara Gomes Silva de Oliveira
* Sofia Vasconcelos Moreira e Silva
* Vinícius Simões Viana

## Professores responsáveis

- Leonardo Vilela Cardoso
- Artur Martins Mol
- João Paulo Carneiro Aramuni

## Contribuição

Branches de trabalho nascem da **sprint vigente** (`sprint-6` agora), não da `main`. Fluxo: **Main ← Sprint ← demais branches**. Detalhes: [CONTRIBUTING.md](CONTRIBUTING.md). Conduta: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Instruções de utilização

API e Web sobem localmente (`Codigo/Pulso/api` e `Codigo/Pulso/web`). Detalhes em cada README da pasta.

**Hospedagem demo (live):**

| Peça | URL |
| --- | --- |
| Web | https://pulso-psi-five.vercel.app |
| API | https://pulso-api-aldu.onrender.com |
| Guia | [docs/hospedagem-demo.md](docs/hospedagem-demo.md) |

Login demo: `tester@mail.com` / `Pulso@123`. Downloads Android/iOS na homepage (`/downloads/`).

## Cards (Hyperion / GitHub Project)

O markdown em `Hyperion/.github/cards/` é a fonte do board. A pipeline **só no `main`** manda o repo para o Project.

- Mexeu **no board** → `npm run cards:reverse` **antes** de commitar (igual `git pull`).
- Mexeu **só no arquivo** → commit no `main` (ou PR) e a Action sincroniza.
- Não faça push de card direto de uma branch velha para o `main` sem puxar o board; o YAML antigo pisa no que a equipe moveu no Project.
