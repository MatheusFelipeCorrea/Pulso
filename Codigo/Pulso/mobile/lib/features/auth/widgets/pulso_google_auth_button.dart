import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:pulso/core/config/app_config.dart';
import 'package:pulso/core/theme/pulso_colors.dart';
import 'package:pulso/features/auth/google/google_auth_client.dart';
import 'package:pulso/features/auth/google/web_oauth_launch.dart';
import 'package:pulso/features/auth/state/auth_controller.dart';
import 'package:pulso/features/auth/widgets/auth_extras.dart';

class PulsoGoogleAuthButton extends StatefulWidget {
  const PulsoGoogleAuthButton({
    super.key,
    required this.label,
    required this.onIdToken,
  });

  final String label;
  final Future<void> Function(String idToken) onIdToken;

  @override
  State<PulsoGoogleAuthButton> createState() => _PulsoGoogleAuthButtonState();
}

class _PulsoGoogleAuthButtonState extends State<PulsoGoogleAuthButton> {
  bool _loading = false;

  Future<void> _pressed() async {
    if (kIsWeb) {
      launchPulsoGoogleOAuth(AppConfig.apiBaseUrl);
      return;
    }

    setState(() => _loading = true);
    try {
      final idToken = await GoogleAuthClient.instance.signInForIdToken();
      if (idToken == null || !mounted) return;
      await widget.onIdToken(idToken);
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(AuthController.messageOf(error))));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!kIsWeb && !GoogleAuthClient.instance.isConfigured) {
      return Text(
        GoogleAuthClient.instance.missingConfigMessage,
        textAlign: TextAlign.center,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: Theme.of(context).brightness == Brightness.dark
              ? PulsoColors.darkSecondary
              : PulsoColors.lightSecondary,
        ),
      );
    }

    return GoogleSignInButton(
      label: widget.label,
      loading: _loading,
      onPressed: _pressed,
    );
  }
}
