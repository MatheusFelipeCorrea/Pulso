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

O app nativo envia o ID token para `POST /api/auth/google/mobile`. O Client ID **web** da API (`GOOGLE_CLIENT_ID`) deve ir em `GOOGLE_SERVER_CLIENT_ID` (audiência do ID token).

```bash
flutter run --dart-define=GOOGLE_SERVER_CLIENT_ID=seu_client_id_web.apps.googleusercontent.com --dart-define=GOOGLE_IOS_CLIENT_ID=seu_client_id_ios.apps.googleusercontent.com
```

Esses valores **não** são gerados pelo app. Crie os OAuth clients no [Google Cloud Console](https://console.cloud.google.com/apis/credentials) do mesmo projeto da API e copie os IDs.

### Android

1. Crie um client OAuth **Android** com o package `br.pucminas.pulso.pulso` (`applicationId` em `android/app/build.gradle.kts`).
2. Cadastre o SHA-1 do keystore de debug:

```bash
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

3. Na API, opcional: `GOOGLE_ANDROID_CLIENT_ID=` com o client Android (audiência extra do `POST /api/auth/google/mobile`).

O SHA-1 de release é o da keystore de produção — outro client Android, ou o mesmo client com os dois fingerprints.

### iOS

1. Crie um client OAuth **iOS** com o bundle id `br.pucminas.pulso.pulso`.
2. Passe o client iOS em `--dart-define=GOOGLE_IOS_CLIENT_ID=...` (o plugin usa isso no `GIDClientID`).
3. No Xcode, em *URL Types*, adicione o **reversed client ID** do iOS (`com.googleusercontent.apps.XXXX`). Sem isso o SDK nativo não volta do Safari/Google.
4. Na API, opcional: `GOOGLE_IOS_CLIENT_ID=` com o mesmo valor.

## Deep links

O app abre:

- `pulso://verify-email?token=` e `pulso://reset-password?token=`
- `http(s)://localhost` e `127.0.0.1` com `/verify-email/:token` e `/reset-password/:token` (dev)

Os e-mails da API continuam com o CTA em `FRONTEND_URL` (fluxo Web se o app não estiver instalado) e incluem um segundo link `pulso://` para abrir no app.

Em produção, acrescente o host público no `AndroidManifest.xml` (`intent-filter` https) e o Associated Domain no iOS (`applinks:seu-dominio`) apontando para o mesmo `FRONTEND_URL`.

## Telas (mesmo copy da Web)

- Login, cadastro, termos de uso, política de privacidade
- E-mail enviado, verificar e-mail
- Recuperar senha, reset, senha alterada
- Home autenticada (placeholder — sem marketing)
