# Código do projeto

Monorepo das três aplicações do Pulso, em `Codigo/Pulso/`.

| Pasta | App | Stack |
|-------|-----|--------|
| [`Pulso/api/`](Pulso/api/) | Backend | Node.js + Express |
| [`Pulso/web/`](Pulso/web/) | Cliente web | React |
| [`Pulso/mobile/`](Pulso/mobile/) | App nativo | Flutter |

Web e Mobile consomem a **mesma API REST** (e Socket.IO quando houver tempo real).
