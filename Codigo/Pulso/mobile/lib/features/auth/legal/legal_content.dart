class LegalSection {
  const LegalSection({required this.title, required this.content});

  final String title;
  final String content;
}

class LegalMeta {
  const LegalMeta({
    required this.title,
    required this.updatedAt,
    required this.intro,
    required this.badge,
    required this.relatedLabel,
    required this.relatedPath,
  });

  final String title;
  final String updatedAt;
  final String intro;
  final String badge;
  final String relatedLabel;
  final String relatedPath;
}

const termsOfUseMeta = LegalMeta(
  title: 'Termos de Uso',
  updatedAt: '31 de maio de 2026',
  intro: 'Leia atentamente estes termos antes de utilizar o Pulso — o pulso da sua vida financeira.',
  badge: 'Termos de uso',
  relatedLabel: 'Política de Privacidade',
  relatedPath: '/privacidade',
);

const privacyPolicyMeta = LegalMeta(
  title: 'Política de Privacidade',
  updatedAt: '31 de maio de 2026',
  intro:
      'Transparência sobre como o Pulso trata seus dados financeiros e pessoais, em conformidade com a LGPD.',
  badge: 'Privacidade',
  relatedLabel: 'Termos de Uso',
  relatedPath: '/termos',
);

const termsOfUseSections = <LegalSection>[
  LegalSection(
    title: '1. Aceitação dos Termos',
    content:
        'Ao criar uma conta ou utilizar o Pulso, você concorda com estes Termos de Uso e com nossa Política de Privacidade. O Pulso é uma plataforma de monitoramento e gestão financeira pessoal desenvolvida para ajudar você a organizar receitas, despesas, metas, viagens, lembretes e demais informações financeiras de forma clara e segura.',
  ),
  LegalSection(
    title: '2. Elegibilidade e Cadastro',
    content:
        'Para utilizar o Pulso, você deve ter pelo menos 18 anos ou a idade mínima exigida pela legislação aplicável. Ao se cadastrar, você declara que as informações fornecidas são verdadeiras, completas e atualizadas. Cada pessoa física pode manter apenas uma conta principal, salvo autorização expressa do Pulso.',
  ),
  LegalSection(
    title: '3. Descrição do Serviço',
    content:
        'O Pulso oferece ferramentas para registro de transações financeiras, categorização de gastos, definição de metas, planejamento de viagens, lembretes de pagamentos, insights automatizados, chat em grupos, planos Free/Premium e assistente de chat com foco em finanças pessoais. Funcionalidades podem ser alteradas, ampliadas ou descontinuadas conforme evolução do produto.',
  ),
  LegalSection(
    title: '4. Responsabilidades do Usuário',
    content:
        'Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta. Os dados financeiros inseridos no Pulso são de sua responsabilidade quanto à veracidade e atualização. O Pulso não substitui assessoria contábil, jurídica ou de investimentos. Decisões financeiras tomadas com base em informações, projeções ou sugestões exibidas na plataforma são de sua exclusiva responsabilidade.',
  ),
  LegalSection(
    title: '5. Integrações de Terceiros',
    content:
        'O Pulso pode integrar serviços de terceiros, como login via Google, envio de emails transacionais, cotações de moedas, sincronização com Google Calendar e processamento de linguagem natural para insights e chatbot. Ao utilizar essas integrações, você também estará sujeito aos termos dos respectivos provedores. Você pode revogar integrações quando disponível nas configurações da conta.',
  ),
  LegalSection(
    title: '6. Propriedade Intelectual',
    content:
        'A marca Pulso, logotipos, interface, código, textos e demais elementos da plataforma são protegidos por direitos de propriedade intelectual. É vedada a reprodução, engenharia reversa ou exploração comercial não autorizada do serviço. Os dados financeiros inseridos por você permanecem seus; você concede ao Pulso licença limitada para processá-los com a finalidade de prestar o serviço.',
  ),
  LegalSection(
    title: '7. Disponibilidade e Limitações',
    content:
        'Empregamos esforços razoáveis para manter o Pulso disponível e seguro, porém não garantimos operação ininterrupta ou livre de erros. Manutenções programadas, falhas de conectividade ou eventos de força maior podem afetar temporariamente o acesso. Insights gerados por inteligência artificial são informativos e podem conter imprecisões.',
  ),
  LegalSection(
    title: '8. Suspensão e Encerramento',
    content:
        'Podemos suspender ou encerrar contas que violem estes termos, apresentem uso fraudulento, abusivo ou que comprometam a segurança da plataforma. Você pode solicitar o encerramento de sua conta a qualquer momento pelos canais disponíveis no aplicativo, observadas obrigações legais de retenção mínima de dados quando aplicável.',
  ),
  LegalSection(
    title: '9. Alterações destes Termos',
    content:
        'Estes Termos de Uso podem ser atualizados periodicamente. Quando houver mudanças relevantes, informaremos por meio da plataforma ou por email. O uso continuado do Pulso após a publicação das alterações constitui aceitação dos novos termos.',
  ),
  LegalSection(
    title: '10. Legislação Aplicável',
    content:
        'Estes termos são regidos pelas leis da República Federativa do Brasil. Eventuais controvérsias serão dirimidas no foro da comarca do domicílio do usuário, salvo disposição legal em contrário.',
  ),
];

const privacyPolicySections = <LegalSection>[
  LegalSection(
    title: '1. Quem somos',
    content:
        'O Pulso é uma aplicação de gestão financeira pessoal. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).',
  ),
  LegalSection(
    title: '2. Dados que coletamos',
    content:
        'Coletamos: (a) dados de cadastro — nome, email, senha (armazenada apenas em formato hash), foto de perfil quando fornecida; (b) dados financeiros inseridos por você — transações, categorias, tags, metas, viagens, lembretes, configurações salariais e preferências; (c) dados de uso — logs de acesso, interações com funcionalidades e preferências de tema; (d) dados de integrações opcionais — identificadores OAuth do Google, eventos de calendário quando você autorizar sincronização; (e) dados de comunicação — emails transacionais de verificação e recuperação de senha.',
  ),
  LegalSection(
    title: '3. Finalidades do tratamento',
    content:
        'Utilizamos seus dados para: criar e autenticar sua conta; prestar as funcionalidades financeiras do Pulso; enviar comunicações essenciais (verificação de email, reset de senha); gerar insights e respostas do chatbot com base exclusivamente nos seus dados financeiros; melhorar segurança, desempenho e experiência do produto; cumprir obrigações legais.',
  ),
  LegalSection(
    title: '4. Bases legais (LGPD)',
    content:
        'O tratamento ocorre com fundamento em: execução de contrato (prestação do serviço); cumprimento de obrigação legal; legítimo interesse (segurança, prevenção a fraudes e melhoria do produto, respeitados seus direitos); e consentimento, quando exigido — por exemplo, para integrações opcionais com Google Calendar ou uso de cookies não essenciais, quando aplicável.',
  ),
  LegalSection(
    title: '5. Compartilhamento de dados',
    content:
        'Não vendemos seus dados pessoais. Podemos compartilhar informações apenas com: provedores de infraestrutura (hospedagem em nuvem, banco de dados); serviços de email transacional; provedores de autenticação Google, quando você optar por login social; APIs de cotação de moedas para funcionalidades de viagem; serviços de IA (Google Gemini) exclusivamente para gerar insights e respostas do chatbot contextualizadas aos seus dados financeiros. Esses parceiros são contratualmente obrigados a proteger seus dados.',
  ),
  LegalSection(
    title: '6. Armazenamento e segurança',
    content:
        'Seus dados são armazenados em servidores seguros com criptografia em trânsito (HTTPS). Senhas são protegidas com hash bcrypt. Tokens de sessão e verificação possuem expiração definida. Adotamos controles de acesso, monitoramento e boas práticas de desenvolvimento seguro. Nenhum sistema é 100% invulnerável; recomendamos o uso de senha forte e única.',
  ),
  LegalSection(
    title: '7. Retenção',
    content:
        'Mantemos seus dados enquanto sua conta estiver ativa ou enquanto necessário para cumprir finalidades descritas nesta política. Após encerramento da conta, dados podem ser retidos pelo período exigido por lei ou para resolução de disputas, sendo eliminados ou anonimizados quando não houver mais base legal para conservação.',
  ),
  LegalSection(
    title: '8. Seus direitos',
    content:
        'Nos termos da LGPD, você pode solicitar: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; informação sobre compartilhamentos; revogação de consentimento; e oposição a tratamentos realizados com base em legítimo interesse, quando aplicável. Solicitações podem ser feitas pelos canais de contato disponíveis na plataforma.',
  ),
  LegalSection(
    title: '9. Cookies e armazenamento local',
    content:
        'Utilizamos armazenamento local do navegador para manter preferências (como tema claro/escuro) e tokens de autenticação necessários ao funcionamento da aplicação. Não utilizamos cookies de rastreamento publicitário.',
  ),
  LegalSection(
    title: '10. Menores de idade',
    content:
        'O Pulso não se destina a menores de 18 anos. Se identificarmos cadastro indevido, a conta poderá ser encerrada e os dados eliminados conforme aplicável.',
  ),
  LegalSection(
    title: '11. Alterações desta Política',
    content:
        'Esta Política de Privacidade pode ser atualizada periodicamente. A data da última revisão será indicada no topo do documento. Alterações relevantes serão comunicadas por meio da plataforma ou email cadastrado.',
  ),
  LegalSection(
    title: '12. Contato',
    content:
        'Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato pelo email de suporte informado na plataforma ou pelo canal indicado nas configurações da sua conta.',
  ),
];
