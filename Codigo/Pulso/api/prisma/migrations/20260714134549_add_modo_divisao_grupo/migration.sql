-- CreateEnum
CREATE TYPE "ModoDivisaoGrupo" AS ENUM ('PRETENSAO', 'IGUAL');

-- AlterTable
ALTER TABLE "grupos" ADD COLUMN "modo_divisao" "ModoDivisaoGrupo" NOT NULL DEFAULT 'PRETENSAO';
