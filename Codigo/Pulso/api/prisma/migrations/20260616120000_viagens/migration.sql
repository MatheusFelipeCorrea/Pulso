-- CreateEnum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CategoriaDespesaViagem') THEN
        CREATE TYPE "CategoriaDespesaViagem" AS ENUM (
            'TRANSPORTE',
            'HOSPEDAGEM',
            'ALIMENTACAO',
            'PASSEIOS',
            'COMPRAS',
            'OUTROS'
        );
    END IF;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "viagens" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "destino" VARCHAR(120) NOT NULL,
    "moeda" VARCHAR(3) NOT NULL,
    "data_prevista" TIMESTAMP(3) NOT NULL,
    "meta_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "viagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "despesas_viagem" (
    "id" TEXT NOT NULL,
    "viagem_id" TEXT NOT NULL,
    "categoria" "CategoriaDespesaViagem" NOT NULL,
    "categoria_id" TEXT,
    "descricao" VARCHAR(255),
    "valor_estimado" DECIMAL(12,2) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "despesas_viagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "moedas_favoritas" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "codigo" VARCHAR(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moedas_favoritas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "viagens_usuario_id_data_prevista_idx" ON "viagens"("usuario_id", "data_prevista");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "despesas_viagem_viagem_id_idx" ON "despesas_viagem"("viagem_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "moedas_favoritas_usuario_id_codigo_key" ON "moedas_favoritas"("usuario_id", "codigo");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "moedas_favoritas_usuario_id_idx" ON "moedas_favoritas"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "viagens_meta_id_key" ON "viagens"("meta_id") WHERE "meta_id" IS NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'viagens_usuario_id_fkey') THEN
        ALTER TABLE "viagens" ADD CONSTRAINT "viagens_usuario_id_fkey"
            FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'viagens_meta_id_fkey') THEN
        ALTER TABLE "viagens" ADD CONSTRAINT "viagens_meta_id_fkey"
            FOREIGN KEY ("meta_id") REFERENCES "metas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'despesas_viagem_viagem_id_fkey') THEN
        ALTER TABLE "despesas_viagem" ADD CONSTRAINT "despesas_viagem_viagem_id_fkey"
            FOREIGN KEY ("viagem_id") REFERENCES "viagens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'despesas_viagem_categoria_id_fkey') THEN
        ALTER TABLE "despesas_viagem" ADD CONSTRAINT "despesas_viagem_categoria_id_fkey"
            FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'moedas_favoritas_usuario_id_fkey') THEN
        ALTER TABLE "moedas_favoritas" ADD CONSTRAINT "moedas_favoritas_usuario_id_fkey"
            FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
