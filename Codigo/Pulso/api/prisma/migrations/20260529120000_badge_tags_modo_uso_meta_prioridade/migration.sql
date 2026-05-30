-- CreateEnum
CREATE TYPE "ModoUso" AS ENUM ('ESTAGIARIO', 'CLT', 'PJ', 'PESSOA_FISICA');

-- CreateEnum
CREATE TYPE "Prioridade" AS ENUM ('ALTA', 'MEDIA', 'BAIXA');

-- AlterTable
ALTER TABLE "configuracoes_usuario" ADD COLUMN "modo_uso" "ModoUso" NOT NULL DEFAULT 'CLT';

-- AlterTable
ALTER TABLE "tags" ADD COLUMN "icone" VARCHAR(40),
ADD COLUMN "cor" VARCHAR(7) NOT NULL DEFAULT '#71717A';

-- AlterTable
ALTER TABLE "metas" ADD COLUMN "prioridade" "Prioridade";
