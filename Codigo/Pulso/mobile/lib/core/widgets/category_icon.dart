import 'package:flutter/material.dart';

/// Mapeia os nomes Lucide persistidos em `Categoria.icone` (mesmos da Web).
IconData iconFromLucide(String? name) {
  switch (name) {
    case 'HandCoins':
      return Icons.payments_outlined;
    case 'Target':
      return Icons.gps_fixed;
    case 'Settings':
      return Icons.settings_outlined;
    case 'Lightbulb':
      return Icons.lightbulb_outline;
    case 'Layers':
      return Icons.layers_outlined;
    case 'LogOut':
      return Icons.logout;
    case 'Pencil':
      return Icons.edit_outlined;
    case 'Trash2':
      return Icons.delete_outline;
    case 'Plus':
      return Icons.add;
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
    case 'Bed':
      return Icons.hotel_outlined;
    case 'MapPin':
      return Icons.place_outlined;
    case 'FileText':
      return Icons.description_outlined;
    case 'ShieldAlert':
      return Icons.health_and_safety_outlined;
    case 'Clapperboard':
      return Icons.movie_outlined;
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
    case 'RefreshCw':
      return Icons.autorenew;
    case 'Crown':
      return Icons.workspace_premium_outlined;
    case 'Play':
      return Icons.play_arrow_outlined;
    case 'Pause':
      return Icons.pause_outlined;
    case 'CheckCircle':
      return Icons.check_circle_outline;
    case 'XCircle':
      return Icons.cancel_outlined;
    case 'Clock':
      return Icons.schedule;
    case 'ArrowUp':
      return Icons.arrow_upward;
    case 'ArrowDown':
      return Icons.arrow_downward;
    case 'Minus':
      return Icons.remove;
    case 'User':
      return Icons.person_outline;
    case 'CalendarCheck':
      return Icons.event_available_outlined;
    case 'Hourglass':
      return Icons.hourglass_empty;
    case 'Sprout':
      return Icons.eco_outlined;
    case 'BarChart3':
      return Icons.bar_chart;
    case 'Info':
      return Icons.info_outline;
    default:
      return Icons.label_outline;
  }
}

class CategoryGlyph extends StatelessWidget {
  const CategoryGlyph({
    super.key,
    required this.icone,
    required this.color,
    this.size = 40,
  });

  final String? icone;
  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.16),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(iconFromLucide(icone), size: size * 0.48, color: color),
    );
  }
}
