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

No **preview web**, o botão usa o mesmo OAuth redirect da Web (`GET /api/auth/google`). A origem do Flutter precisa estar em `CORS_ORIGIN` da API (já inclui `http://127.0.0.1:8080`).

O app nativo envia o ID token para `POST /api/auth/google/mobile`. O Client ID **web** da API já está como default de `GOOGLE_SERVER_CLIENT_ID` no Flutter; o client iOS também.

Package / bundle do app: **`pulso.pulso`** — o mesmo valor dos clients Android e iOS no Google Cloud.

### Android

Client OAuth **Android** no mesmo projeto (`pulso-494118`), package `pulso.pulso`, SHA-1 do debug:

```bash
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

A API lê `GOOGLE_ANDROID_CLIENT_ID` (audiência extra). SHA-1 de release é outro fingerprint.

### iOS

Client OAuth **iOS** com bundle `pulso.pulso`. O `Info.plist` já tem `GIDClientID` e o URL scheme reversed.

Para sobrescrever os IDs:

```bash
flutter run --dart-define=GOOGLE_SERVER_CLIENT_ID=... --dart-define=GOOGLE_IOS_CLIENT_ID=...
```

## Deep links

O app abre:

- `pulso://verify-email?token=` e `pulso://reset-password?token=`
- `http(s)://localhost` e `127.0.0.1` com `/verify-email/:token` e `/reset-password/:token` (dev)

Os e-mails da API continuam com o CTA em `FRONTEND_URL` (fluxo Web se o app não estiver instalado) e incluem um segundo link `pulso://` para abrir no app.

Em produção, acrescente o host público no `AndroidManifest.xml` (`intent-filter` https) e o Associated Domain no iOS (`applinks:seu-dominio`) apontando para o mesmo `FRONTEND_URL`.

## Telas (parity com a Web — Sprint 5 + 6)

Sem landing/marketing: a sessão começa no **login**.

- Auth: login, cadastro, termos, privacidade, e-mail enviado, verificar, recuperar/reset senha
- Conta: perfil, configurações (tema, senha) e **apagar conta** (`APAGAR` → `DELETE /auth/me`)
- Dashboard (hero, recursos, gráficos, saúde, metas, últimas tx) + importação de extrato
- Transações, categorias, tags
- Metas, viagens e moedas
- Calendário / lembretes (Google Calendar Premium)
- Orçamento mensal e planejamento de compra
- Grupos (CRUD, convite, imagem, **chat Socket.IO**)
- Dívidas pessoais e divisão de despesas
- **Insights Inteligentes** (`/insights`) — Sprint 6
- **Chatbot** (`/chatbot`) — Sprint 6
