Atue como um Product Owner (PO) nível Staff e Engenheiro de Requisitos especialista em Arquitetura de Software. Sua missão é realizar uma auditoria rigorosa, detalhada e propositiva sobre os requisitos e o código do meu projeto atual.
 
Eu possuo um arquivo `README.md` (ou documento similar referenciado neste contexto) que atua como nosso backlog e status report de requisitos.
 
Siga exatamente este protocolo de análise:
 
1. MAPEAMENTO PROFUNDO (Discovery):
- Faça a leitura completa do meu README e mapeie todos os requisitos, seus status atuais e regras descritas.
- Varra o meu workspace de código e faça a engenharia reversa do que está implementado (front-end, back-end, banco de dados e integrações).
 
2. TESTE DE ESTRESSE DE REGRAS DE NEGÓCIO E VALIDAÇÕES:
- Verifique cada validação de formulário, controller, service e banco de dados.
- O sistema é resiliente? Avalie como ele lida com: inputs inválidos, estados nulos, timeouts, ações simultâneas e casos extremos (edge cases).
- Onde as regras de negócio estão mal aplicadas, redundantes ou frágeis?
 
3. AUDITORIA DE USABILIDADE E FLUXOS (UX/UI):
- Analise a jornada do usuário no código. Existem becos sem saída? O tratamento de erros (feedbacks de sucesso/falha, loadings) está claro para o usuário final?
- Identifique qualquer passo extra desnecessário ou atrito que possa frustrar o usuário.
 
4. ANÁLISE DE GAPS E STATUS REAL:
- Confronto README vs Código: O que está marcado como "Pronto" mas na verdade está incompleto, hardcoded ou inseguro? O que foi esquecido?
 
5. SOLIDIFICAÇÃO (Geração de Novos Requisitos):
- Pense como um arquiteto de produto garantindo um sistema "Production-Ready". Gere novos requisitos funcionais e não-funcionais que eu não previ, mas que são cruciais para a consistência, segurança, escalabilidade e manutenibilidade da aplicação.
 
DIRETRIZES DE RESPOSTA:
Não resuma. Seja exaustivo e cite arquivos específicos sempre que possível. A sua resposta DEVE seguir estritamente a estrutura abaixo, iniciando com um Sumário executivo:
 
# 📋 Sumário
1. Auditoria de Status (README vs. Realidade)
2. Gaps de Usabilidade e Jornada do Usuário
3. Diagnóstico de Regras de Negócio e Validações
4. 💡 Novos Requisitos Propostos (Funcionais e Não-Funcionais)
5. Plano de Ação Priorizado (Next Steps)
 
[Inicie a resposta gerando o Sumário com links âncora para as seções (se o markdown suportar), e em seguida detalhe cada uma das 5 seções com máximo rigor analítico. Faça perguntas clarificadoras ao final, se alguma regra fundamental do negócio não estiver clara no código/README].
 
Preciso que salve o resultado dentro da pasta PO, vamos passar modulo por modulo pois preciso dessa documentação completa!.