# Downloads do app Pulso

Arquivos servidos pela homepage em `/downloads/`:

| Arquivo | Plataforma | Como instalar |
|---------|------------|---------------|
| `pulso-android.apk` | Android | Abrir o APK no aparelho e permitir instalação de fontes desconhecidas. |
| `pulso-ios.ipa` | iOS | Assinar/instalar com Sideloadly ou AltStore. Em seguida: **Ajustes → Geral → VPN e Gerenciamento de Dispositivo** → confiar no perfil. |

Os builds apontam para a API de demonstração (`https://pulso-api-aldu.onrender.com`).

## Regenerar

```bash
cd Codigo/Pulso/mobile

# Android
flutter build apk --release \
  --dart-define=API_BASE_URL=https://pulso-api-aldu.onrender.com
cp build/app/outputs/flutter-apk/app-release.apk \
  ../web/public/downloads/pulso-android.apk

# iOS (requer macOS + Xcode)
flutter build ipa --release --no-codesign \
  --dart-define=API_BASE_URL=https://pulso-api-aldu.onrender.com
# Empacote o .app em .ipa e copie para pulso-ios.ipa
```
