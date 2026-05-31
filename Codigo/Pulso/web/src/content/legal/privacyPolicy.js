export const privacyPolicySections = [
  {
    title: '1. Quem somos',
    content: `O Pulso é uma aplicação de gestão financeira pessoal. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).`,
  },
  {
    title: '2. Dados que coletamos',
    content: `Coletamos: (a) dados de cadastro — nome, email, senha (armazenada apenas em formato hash), foto de perfil quando fornecida; (b) dados financeiros inseridos por você — transações, categorias, tags, metas, viagens, lembretes, configurações salariais e preferências; (c) dados de uso — logs de acesso, interações com funcionalidades e preferências de tema; (d) dados de integrações opcionais — identificadores OAuth do Google, eventos de calendário quando você autorizar sincronização; (e) dados de comunicação — emails transacionais de verificação e recuperação de senha.`,
  },
  {
    title: '3. Finalidades do tratamento',
    content: `Utilizamos seus dados para: criar e autenticar sua conta; prestar as funcionalidades financeiras do Pulso; enviar comunicações essenciais (verificação de email, reset de senha); gerar relatórios, insights e respostas do chatbot com base exclusivamente nos seus dados financeiros; operar gamificação; melhorar segurança, desempenho e experiência do produto; cumprir obrigações legais.`,
  },
  {
    title: '4. Bases legais (LGPD)',
    content: `O tratamento ocorre com fundamento em: execução de contrato (prestação do serviço); cumprimento de obrigação legal; legítimo interesse (segurança, prevenção a fraudes e melhoria do produto, respeitados seus direitos); e consentimento, quando exigido — por exemplo, para integrações opcionais com Google Calendar ou uso de cookies não essenciais, quando aplicável.`,
  },
  {
    title: '5. Compartilhamento de dados',
    content: `Não vendemos seus dados pessoais. Podemos compartilhar informações apenas com: provedores de infraestrutura (hospedagem em nuvem, banco de dados); serviços de email transacional; provedores de autenticação Google, quando você optar por login social; APIs de cotação de moedas para funcionalidades de viagem; serviços de IA (Google Gemini) exclusivamente para gerar insights e respostas do chatbot contextualizadas aos seus dados financeiros. Esses parceiros são contratualmente obrigados a proteger seus dados.`,
  },
  {
    title: '6. Armazenamento e segurança',
    content: `Seus dados são armazenados em servidores seguros com criptografia em trânsito (HTTPS). Senhas são protegidas com hash bcrypt. Tokens de sessão e verificação possuem expiração definida. Adotamos controles de acesso, monitoramento e boas práticas de desenvolvimento seguro. Nenhum sistema é 100% invulnerável; recomendamos o uso de senha forte e única.`,
  },
  {
    title: '7. Retenção',
    content: `Mantemos seus dados enquanto sua conta estiver ativa ou enquanto necessário para cumprir finalidades descritas nesta política. Após encerramento da conta, dados podem ser retidos pelo período exigido por lei ou para resolução de disputas, sendo eliminados ou anonimizados quando não houver mais base legal para conservação.`,
  },
  {
    title: '8. Seus direitos',
    content: `Nos termos da LGPD, você pode solicitar: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; informação sobre compartilhamentos; revogação de consentimento; e oposição a tratamentos realizados com base em legítimo interesse, quando aplicável. Solicitações podem ser feitas pelos canais de contato disponíveis na plataforma.`,
  },
  {
    title: '9. Cookies e armazenamento local',
    content: `Utilizamos armazenamento local do navegador para manter preferências (como tema claro/escuro) e tokens de autenticação necessários ao funcionamento da aplicação. Não utilizamos cookies de rastreamento publicitário.`,
  },
  {
    title: '10. Menores de idade',
    content: `O Pulso não se destina a menores de 18 anos. Se identificarmos cadastro indevido, a conta poderá ser encerrada e os dados eliminados conforme aplicável.`,
  },
  {
    title: '11. Alterações desta Política',
    content: `Esta Política de Privacidade pode ser atualizada periodicamente. A data da última revisão será indicada no topo do documento. Alterações relevantes serão comunicadas por meio da plataforma ou email cadastrado.`,
  },
  {
    title: '12. Contato',
    content: `Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato pelo email de suporte informado na plataforma ou pelo canal indicado nas configurações da sua conta.`,
  },
]

export const privacyPolicyMeta = {
  title: 'Política de Privacidade',
  updatedAt: '31 de maio de 2026',
  intro:
    'Transparência sobre como o Pulso trata seus dados financeiros e pessoais, em conformidade com a LGPD.',
  badge: 'Privacidade',
  backTo: '/register',
  backLabel: 'Voltar ao cadastro',
  relatedLink: { label: 'Termos de Uso', href: '/termos' },
}
