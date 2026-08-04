-- Reorganiza categorias de itens de planejamento de compra:
-- funde TECNOLOGIA em ELETRONICOS e adiciona CASA_ELETRODOMESTICOS,
-- VESTUARIO e VEICULO para cobrir melhor os itens de desejo comuns.

-- 1. Renomeia o enum atual para poder recriar do zero
ALTER TYPE "CategoriaItemCompra" RENAME TO "CategoriaItemCompra_old";

-- 2. Cria o enum novo com o conjunto final de categorias
CREATE TYPE "CategoriaItemCompra" AS ENUM (
  'ELETRONICOS',
  'CASA_ELETRODOMESTICOS',
  'VESTUARIO',
  'VEICULO',
  'ACESSORIOS',
  'OUTROS'
);

-- 3. Migra a coluna, remapeando TECNOLOGIA -> ELETRONICOS
ALTER TABLE "itens_planejamento_compra"
  ALTER COLUMN "categoria" DROP DEFAULT,
  ALTER COLUMN "categoria" TYPE "CategoriaItemCompra"
    USING (
      CASE "categoria"::text
        WHEN 'TECNOLOGIA' THEN 'ELETRONICOS'
        ELSE "categoria"::text
      END
    )::"CategoriaItemCompra",
  ALTER COLUMN "categoria" SET DEFAULT 'OUTROS';

-- 4. Remove o enum antigo
DROP TYPE "CategoriaItemCompra_old";
