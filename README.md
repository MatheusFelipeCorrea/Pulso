# 💜 Pulso

**Pulso** é um sistema de gestão financeira pessoal desenvolvido para estagiários, estudantes e jovens em início de carreira que estão aprendendo a lidar com dinheiro. O sistema diferencia recursos reais (salário) de benefícios com restrição de uso (VA, VR), oferece insights inteligentes via IA (Google Gemini), planejamento de viagens com câmbio integrado, e funcionalidade de grupos para planejamento compartilhado. Tudo isso com uma interface moderna em modo claro e escuro, 100% gratuito.

O nome "Pulso" remete à ideia de manter o pulso firme nas finanças, monitorar a saúde financeira como um batimento cardíaco e criar o hábito diário de controle — cada registro é uma batida, cada dia é um passo rumo à estabilidade.

## Alunos integrantes da equipe

* Matheus Felipe
* Alice Shikida
* Maria Clara
* Sofia Vasconcelos
* Vinicius Simões

## Professores responsáveis

* Leonardo Vilela
* João Paulo Aramuni
* Arthur Mol

## Instruções de utilização

API e Web já sobem localmente (`Codigo/Pulso/api` e `Codigo/Pulso/web`). Detalhes em cada README da pasta. Hospedagem pública em breve.

## Cards (Hyperion / GitHub Project)

O markdown em `Hyperion/.github/cards/` é a fonte do board. A pipeline **só no `main`** manda o repo para o Project.

- Mexeu **no board** → `npm run cards:reverse` **antes** de commitar (igual `git pull`).
- Mexeu **só no arquivo** → commit no `main` (ou PR) e a Action sincroniza.
- Não faça push de card direto de uma branch velha para o `main` sem puxar o board; o YAML antigo pisa no que a equipe moveu no Project.
