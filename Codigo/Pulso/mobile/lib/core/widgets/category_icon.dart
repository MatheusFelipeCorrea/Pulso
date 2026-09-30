import 'package:flutter/material.dart';

/// Mapeia os nomes Lucide persistidos em `Categoria.icone` (mesmos da Web).
IconData iconFromLucide(String? name) {
  switch (name) {
    case 'Tag':
      return Icons.label_outline;
    case 'Banknote':
      return Icons.payments_outlined;
    case 'Briefcase':
      return Icons.work_outline;
    case 'TrendingUp':
      return Icons.trending_up;
    case 'CircleDollarSign':
    case 'DollarSign':
      return Icons.attach_money;
    case 'UtensilsCrossed':
    case 'Utensils':
      return Icons.restaurant;
    case 'Bus':
      return Icons.directions_bus;
    case 'Gamepad2':
      return Icons.sports_esports_outlined;
    case 'GraduationCap':
      return Icons.school_outlined;
    case 'Home':
      return Icons.home_outlined;
    case 'HeartPulse':
      return Icons.favorite_outline;
    case 'ShoppingBag':
      return Icons.shopping_bag_outlined;
    case 'Shirt':
      return Icons.checkroom_outlined;
    case 'Sparkles':
      return Icons.auto_awesome;
    case 'Smartphone':
      return Icons.smartphone;
    case 'Landmark':
      return Icons.account_balance_outlined;
    case 'PawPrint':
      return Icons.pets_outlined;
    case 'Plane':
      return Icons.flight;
    case 'Gift':
      return Icons.card_giftcard;
    case 'Car':
      return Icons.directions_car_outlined;
    case 'CreditCard':
      return Icons.credit_card;
    case 'Users':
      return Icons.group_outlined;
    case 'Building2':
      return Icons.apartment;
    case 'Laptop':
      return Icons.laptop_mac;
    case 'Calendar':
      return Icons.calendar_today_outlined;
    case 'Star':
      return Icons.star_outline;
    case 'Diamond':
      return Icons.diamond_outlined;
    case 'Apple':
      return Icons.apple;
    case 'PiggyBank':
      return Icons.savings_outlined;
    case 'ArrowLeftRight':
      return Icons.swap_horiz;
    default:
      return Icons.label_outline;
  }
}

class CategoryGlyph extends StatelessWidget {
  const CategoryGlyph({
    super.key,
    required this.icone,
    required this.color,
    this.size = 18,
  });

  final String? icone;
  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      backgroundColor: color.withValues(alpha: 0.16),
      foregroundColor: color,
      child: Icon(iconFromLucide(icone), size: size),
    );
  }
}
