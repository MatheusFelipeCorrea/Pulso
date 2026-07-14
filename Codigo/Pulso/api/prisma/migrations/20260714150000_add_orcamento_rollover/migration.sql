-- AlterTable
ALTER TABLE "orcamentos" ADD COLUMN     "rollover_ativo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "valor_rollover" DECIMAL(12,2) NOT NULL DEFAULT 0;
