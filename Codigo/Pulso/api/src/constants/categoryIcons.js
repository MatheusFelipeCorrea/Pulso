/** Ícones Lucide permitidos em categorias (mesmo conjunto do frontend iconRegistry) */
const CATEGORY_ICONS = [
    'Tag',
    'Banknote',
    'Briefcase',
    'TrendingUp',
    'CircleDollarSign',
    'UtensilsCrossed',
    'Bus',
    'Gamepad2',
    'GraduationCap',
    'Home',
    'HeartPulse',
    'ShoppingBag',
    'Shirt',
    'Sparkles',
    'Smartphone',
    'Landmark',
    'PawPrint',
    'Plane',
    'Gift',
    'Car',
    'CreditCard',
    'Users',
    'Building2',
    'Laptop',
    'Calendar',
    'Star',
    'Diamond',
];

const CATEGORY_COLORS = [
    '#7C3AED',
    '#10B981',
    '#3B82F6',
    '#EF4444',
    '#F59E0B',
    '#6366F1',
    '#14B8A6',
    '#EC4899',
    '#A855F7',
    '#D946EF',
    '#F472B6',
    '#0EA5E9',
    '#059669',
    '#F97316',
    '#06B6D4',
    '#E11D48',
    '#64748B',
    '#FB923C',
    '#475569',
    '#71717A',
];

const isIconeValido = (icone) => CATEGORY_ICONS.includes(icone);
const isCorValida = (cor) => /^#[0-9A-Fa-f]{6}$/.test(cor);

module.exports = {
    CATEGORY_ICONS,
    CATEGORY_COLORS,
    isIconeValido,
    isCorValida,
};
