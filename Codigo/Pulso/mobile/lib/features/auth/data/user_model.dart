class PulsoUser {
  const PulsoUser({
    required this.id,
    required this.nome,
    required this.email,
    this.urlAvatar,
    this.plano = 'FREE',
  });

  final String id;
  final String nome;
  final String email;
  final String? urlAvatar;
  final String plano;

  factory PulsoUser.fromJson(Map<String, dynamic> json) {
    return PulsoUser(
      id: json['id'] as String,
      nome: json['nome'] as String? ?? '',
      email: json['email'] as String? ?? '',
      urlAvatar: json['urlAvatar'] as String?,
      plano: json['plano'] as String? ?? 'FREE',
    );
  }
}

class AuthSession {
  const AuthSession({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
  });

  final PulsoUser user;
  final String accessToken;
  final String refreshToken;
}
