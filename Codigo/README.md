# Código do projeto

Monorepo das três aplicações do Pulso. Ainda placeholders (sem scaffold).

| Pasta | App | Stack |
|-------|-----|--------|
| [`api/`](api/) | Backend | Node.js + Express |
| [`web/`](web/) | Cliente web | React |
| [`mobile/`](mobile/) | App nativo | Flutter |

Web e Mobile consomem a **mesma API REST** (e Socket.IO quando houver tempo real).
