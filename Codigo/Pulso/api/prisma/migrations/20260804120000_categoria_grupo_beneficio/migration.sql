-- CreateEnum
CREATE TYPE "GrupoBeneficioCategoria" AS ENUM ('ALIMENTACAO', 'COMPRAS', 'TRANSPORTE');

-- AlterTable
ALTER TABLE "categorias" ADD COLUMN "grupo_beneficio" "GrupoBeneficioCategoria";

-- Backfill categorias padrão de despesa
UPDATE "categorias"
SET "grupo_beneficio" = 'ALIMENTACAO'
WHERE "tipo" = 'DESPESA' AND "nome" = 'Alimentação';

UPDATE "categorias"
SET "grupo_beneficio" = 'COMPRAS'
WHERE "tipo" = 'DESPESA' AND "nome" = 'Compras';

UPDATE "categorias"
SET "grupo_beneficio" = 'TRANSPORTE'
WHERE "tipo" = 'DESPESA' AND "nome" = 'Transporte';
