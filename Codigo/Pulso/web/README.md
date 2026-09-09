# Código — Web

Cliente web do Pulso (`Codigo/Pulso/web`).

- Stack: **React + Vite**
- Consome a API em `Codigo/Pulso/api` (`VITE_API_URL`, cookies com `withCredentials`)

## Como rodar

```bash
cd Codigo/Pulso/web
cp .env.example .env   # VITE_API_URL=http://localhost:3333/api
npm install
npm run dev
```

SPA: `http://localhost:5173` (a API precisa estar no ar).
