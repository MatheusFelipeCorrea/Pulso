import {
    ArrowLeftRight,
    CalendarDays,
    HandCoins,
    Landmark,
    LayoutGrid,
    PieChart,
    Plane,
    ShoppingCart,
    Split,
    Target,
    Users,
    Wallet,
} from 'lucide-react'

export const REPO_URL = 'https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti5-6904100-pulso'

export const NAV_LINKS = [
    { id: 'funcionalidades', label: 'Funcionalidades' },
    { id: 'para-quem', label: 'Para quem' },
    { id: 'diferenciais', label: 'Diferenciais' },
    { id: 'precos', label: 'Preços' },
]

export const HIGHLIGHTS = [
    {
        icon: Wallet,
        title: 'Em reais (BRL)',
        description: 'Valores, saldos e metas no Real',
    },
    {
        icon: HandCoins,
        title: 'VA, VR e dinheiro',
        description: 'Benefícios separados do saldo real',
    },
    {
        icon: Target,
        title: 'Grátis para começar',
        description: 'Core financeiro no plano Free',
    },
    {
        icon: Users,
        title: 'Feito para você',
        description: 'Estagiários, CLT, PJ e pessoa física',
    },
]

export const FEATURES = [
    {
        icon: LayoutGrid,
        title: 'Dashboard',
        description: 'Saldo do mês, categorias, alertas de orçamento e saúde financeira em reais.',
        tone: 'purple',
    },
    {
        icon: ArrowLeftRight,
        title: 'Transações',
        description: 'Receitas, despesas e transferências entre dinheiro, VA e VR.',
        tone: 'green',
    },
    {
        icon: PieChart,
        title: 'Orçamento mensal',
        description: 'Limites por categoria e alertas quando o mês começa a apertar.',
        tone: 'blue',
    },
    {
        icon: CalendarDays,
        title: 'Calendário financeiro',
        description: 'Vencimentos, lembretes e compromissos do mês.',
        tone: 'indigo',
    },
    {
        icon: Landmark,
        title: 'Dívidas pessoais',
        description: 'O que você deve e o que ainda tem a receber, com status e prazos.',
        tone: 'violet',
    },
    {
        icon: Target,
        title: 'Metas',
        description: 'Objetivos em reais e progresso mês a mês.',
        tone: 'teal',
    },
    {
        icon: Split,
        title: 'Divisão de despesas',
        description: 'Divida uma conta, marque quem pagou e acompanhe o saldo.',
        tone: 'pink',
    },
    {
        icon: ShoppingCart,
        title: 'Planejamento de compra',
        description: 'Liste o que quer comprar e veja o impacto no orçamento.',
        tone: 'orange',
    },
    {
        icon: Users,
        title: 'Grupos',
        description: 'Metas compartilhadas, convites e chat com a galera.',
        tone: 'teal',
        badge: 'Premium',
    },
    {
        icon: Plane,
        title: 'Viagens e moedas',
        description: 'Planeje a viagem com orçamento e câmbio.',
        tone: 'indigo',
        badge: 'Premium',
    },
]

export const AUDIENCE = [
    {
        title: 'Estagiários',
        tag: 'Primeiro salário',
        description:
            'Separe benefícios (VA, VR) do dinheiro real e entenda quanto sobra de verdade no mês.',
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
    'Separa dinheiro real de benefícios (VA e VR)',
    'Dashboard, orçamento e calendário no plano Free',
    'Dívidas e divisão de despesas no dia a dia',
    'Grupos e viagens no plano Premium',
    'Valores sempre em reais (BRL)',
    'Dark mode e integração com Google Calendar',
    'Comece grátis — sem cartão de crédito',
]

export const PRICING = [
    {
        id: 'free',
        name: 'Free',
        price: 'R$ 0',
        period: 'para sempre',
        description: 'O core financeiro para organizar o mês.',
        highlighted: false,
        features: [
            'Dashboard e transações',
            'Orçamento e calendário',
            'Metas, dívidas e divisão de despesas',
            'Planejamento de compra',
        ],
        cta: 'Criar conta grátis',
        to: '/register',
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 'R$ 50',
        period: '/mês',
        description: 'Grupos e viagens para quem precisa de mais.',
        highlighted: true,
        features: [
            'Tudo do plano Free',
            'Grupos com convite e chat',
            'Viagens e moedas',
            'Cobrança mensal em reais',
        ],
        cta: 'Começar no Free',
        to: '/register',
    },
]

export const TESTIMONIALS = [
    {
        name: 'Juliana Silva',
        role: 'Estagiária',
        quote: 'Finalmente consigo separar o que é benefício do que é meu dinheiro. O dashboard salvou meu mês!',
        initials: 'JS',
        tone: 'purple',
    },
    {
        name: 'Ricardo Mendes',
        role: 'CLT',
        quote: 'Uso todo dia para saber quanto posso gastar sem estourar o orçamento. Simples e direto ao ponto.',
        initials: 'RM',
        tone: 'green',
    },
    {
        name: 'Camila Oliveira',
        role: 'Freelancer',
        quote: 'Com renda variável, o Pulso me ajuda a reservar para impostos e ainda sobra para lazer.',
        initials: 'CO',
        tone: 'orange',
    },
]

export const FOOTER_LINKS = {
    navegacao: [
        { label: 'Funcionalidades', href: '#funcionalidades' },
        { label: 'Para quem', href: '#para-quem' },
        { label: 'Preços', href: '#precos' },
    ],
    recursos: [
        { label: 'Repositório', href: REPO_URL, external: true },
        { label: 'Documentação', href: `${REPO_URL}#readme`, external: true },
        { label: 'Termos de uso', to: '/termos' },
        { label: 'Privacidade', to: '/privacidade' },
    ],
    comunidade: [{ label: 'GitHub', href: REPO_URL, external: true }],
}
