-- TI5 freemium: plano FREE | PREMIUM (default FREE, sem quebrar usuários existentes)
CREATE TYPE "Plano" AS ENUM ('FREE', 'PREMIUM');

ALTER TABLE "configuracoes_usuario" ADD COLUMN "plano" "Plano" NOT NULL DEFAULT 'FREE';
