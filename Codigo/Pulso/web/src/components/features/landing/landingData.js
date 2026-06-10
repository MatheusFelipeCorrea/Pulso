import {
  Brain,
  CalendarDays,
  Gamepad2,
  LayoutGrid,
  MessageCircle,
  Plane,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'

export const NAV_LINKS = [
  { id: 'funcionalidades', label: 'Funcionalidades' },
  { id: 'para-quem', label: 'Para quem' },
  { id: 'diferenciais', label: 'Diferenciais' },
  { id: 'precos', label: 'Preços' },
  { id: 'roadmap', label: 'Roadmap' },
]

export const HIGHLIGHTS = [
  {
    icon: Brain,
    title: 'IA Inteligente',
    description: 'Insights personalizados',
  },
  {
    icon: Sparkles,
    title: '100% Gratuito',
    description: 'Sem pegadinhas',
  },
  {
    icon: Target,
    title: 'Seus dados seguros',
    description: 'Privacidade em primeiro lugar',
  },
  {
    icon: Users,
    title: 'Feito para você',
    description: 'Estagiários, CLT, PJ, pessoa física e mais',
  },
]

export const FEATURES = [
  {
    icon: LayoutGrid,
    title: 'Dashboard',
    description: 'Visão em tempo real das suas finanças, receitas, despesas e saldo.',
    tone: 'purple',
  },
  {
    icon: Target,
    title: 'Metas',
    description: 'Defina objetivos e acompanhe o progresso mês a mês.',
    tone: 'green',
  },
  {
    icon: Plane,
    title: 'Viagens',
    description: 'Planeje viagens com câmbio, orçamento e metas dedicadas.',
    tone: 'blue',
  },
  {
    icon: Sparkles,
    title: 'IA Insights',
    description: 'Dicas automáticas baseadas no seu perfil e hábitos.',
    tone: 'violet',
  },
  {
    icon: MessageCircle,
    title: 'Chatbot',
    description: 'Tire dúvidas sobre suas finanças em linguagem natural.',
    tone: 'pink',
  },
  {
    icon: Gamepad2,
    title: 'Gamificação',
    description: 'Sequências, conquistas e desafios para manter o foco.',
    tone: 'orange',
  },
  {
    icon: Users,
    title: 'Grupos',
    description: 'Metas compartilhadas com amigos, família ou colegas.',
    tone: 'teal',
  },
  {
    icon: CalendarDays,
    title: 'Calendário',
    description: 'Vencimentos, lembretes e compromissos financeiros.',
    tone: 'indigo',
  },
]

export const AUDIENCE = [
  {
    title: 'Estagiários',
    tag: 'Primeiro salário',
    description:
      'Separe benefícios (VA, VR, VT) do dinheiro real e entenda quanto sobra de verdade no mês.',
    tone: 'purple',
    icon: 'graduation',
  },
  {
    title: 'CLT',
    tag: 'Carteira assinada',
    description:
      'Acompanhe salário líquido, descontos e benefícios com clareza do que entra e do que sai.',
    tone: 'green',
    icon: 'briefcase',
  },
  {
    title: 'PJ & Freelancers',
    tag: 'Renda variável',
    description:
      'Organize honorários, impostos e reservas — saiba quanto guardar e quanto pode usar.',
    tone: 'orange',
    icon: 'laptop',
  },
  {
    title: 'Pessoa Física',
    tag: 'Finanças pessoais',
    description:
      'Controle gastos, metas e orçamento no dia a dia, com ou sem vínculo de trabalho fixo.',
    tone: 'blue',
    icon: 'user',
  },
]

export const BENEFITS = [
  'Separa dinheiro real de benefícios (VA, VR, VT)',
  'IA que entende o contexto de estagiário e CLT',
  'Planejamento de viagens com moedas e metas',
  'Gamificação para manter o hábito financeiro',
  'Dark mode lindo (você está vendo!)',
  'Integração com Google Calendar',
  'Relatórios e insights automáticos',
  '100% gratuito, sem cartão de crédito',
]

export const TESTIMONIALS = [
  {
    name: 'Juliana Silva',
    role: 'Estagiária',
    quote:
      'Finalmente consigo separar o que é benefício do que é meu dinheiro. O controle de VT salvou meu mês!',
    initials: 'JS',
    tone: 'purple',
  },
  {
    name: 'Ricardo Mendes',
    role: 'CLT',
    quote:
      'Uso todo dia para saber quanto posso gastar sem estourar o orçamento. Simples e direto ao ponto.',
    initials: 'RM',
    tone: 'green',
  },
  {
    name: 'Camila Oliveira',
    role: 'Freelancer',
    quote:
      'Com renda variável, o Pulso me ajuda a reservar para impostos e ainda sobra para lazer.',
    initials: 'CO',
    tone: 'orange',
  },
]

export const FOOTER_LINKS = {
  navegacao: [
    { label: 'Funcionalidades', href: '#funcionalidades' },
    { label: 'Para quem', href: '#para-quem' },
    { label: 'Preços', href: '#precos' },
    { label: 'Roadmap', href: '#roadmap' },
  ],
  recursos: [
    { label: 'Documentação', to: '/design-system' },
    { label: 'Termos de uso', to: '/termos' },
    { label: 'Privacidade', to: '/privacidade' },
  ],
  comunidade: [
    { label: 'GitHub', href: 'https://github.com', external: true },
    { label: 'Instagram', href: 'https://instagram.com', external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
  ],
}

/** Links de download direto do app — arquivos em public/downloads/ */
export const APP_DOWNLOADS = [
  {
    id: 'android',
    label: 'Android',
    hint: 'Arquivo .apk',
    href: '/downloads/pulso-android.apk',
    filename: 'pulso-android.apk',
  },
  {
    id: 'ios',
    label: 'iOS',
    hint: 'Arquivo .ipa',
    href: '/downloads/pulso-ios.ipa',
    filename: 'pulso-ios.ipa',
  },
]
