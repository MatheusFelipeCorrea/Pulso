# Código — Mobile (Flutter)

App nativo do Pulso. Consome a **mesma API Node** da Web (`Codigo/Pulso/api`) — RF-140.

Não há landing page no app: a sessão começa no **login**.

## Pré-requisitos

- Flutter 3.47+ (`flutter doctor`)
- API local em `http://localhost:3333` (`npm run dev` em `Codigo/Pulso/api`)

## Rodar

```bash
cd Codigo/Pulso/mobile
flutter pub get
flutter run
```

Emulador Android usa `http://10.0.2.2:3333`. Simulador iOS usa `http://localhost:3333`.

Para apontar para outra API:

```bash
flutter run --dart-define=API_BASE_URL=https://sua-api.exemplo
```

## Google Sign-In

No **preview web**, o botão usa o mesmo OAuth redirect da Web (`GET /api/auth/google`). A origem do Flutter precisa estar em `CORS_ORIGIN` da API (já inclui `http://127.0.0.1:8080`). Não é necessário cadastrar JavaScript origin no Google Cloud para esse fluxo — o callback continua `GOOGLE_CALLBACK_URL` da API.

O app nativo envia o ID token para `POST /api/auth/google/mobile`:

```bash
flutter run --dart-define=GOOGLE_SERVER_CLIENT_ID=seu_client_id_web.apps.googleusercontent.com
```

No Android/iOS, cadastre também os client IDs nativos. Na API, opcional:

```
GOOGLE_ANDROID_CLIENT_ID=
GOOGLE_IOS_CLIENT_ID=
```

## Deep links

O app abre `pulso://verify-email?token=` e `pulso://reset-password?token=` (e paths `/verify-email/:token` / `/reset-password/:token`). Os e-mails da API continuam apontando para `FRONTEND_URL`; se o app não estiver instalado, o fluxo Web segue valendo.

## Telas (mesmo copy da Web)

- Login, cadastro, e-mail enviado, verificar e-mail
- Recuperar senha, reset, senha alterada
- Home autenticada (placeholder — sem marketing)
