-- CreateTable
CREATE TABLE IF NOT EXISTS "metas" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "valor_alvo" DECIMAL(12,2) NOT NULL,
    "valor_atual" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "prazo" TIMESTAMP(3) NOT NULL,
    "tipo" "TipoMeta" NOT NULL,
    "status" "StatusMeta" NOT NULL DEFAULT 'ATIVA',
    "prioridade" "Prioridade",
    "descricao" VARCHAR(500),
    "concluida_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "aportes_meta" (
    "id" TEXT NOT NULL,
    "meta_id" TEXT NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aportes_meta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "metas_usuario_id_status_idx" ON "metas"("usuario_id", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "metas_usuario_id_prazo_idx" ON "metas"("usuario_id", "prazo");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "aportes_meta_meta_id_data_idx" ON "aportes_meta"("meta_id", "data" DESC);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'metas_usuario_id_fkey'
    ) THEN
        ALTER TABLE "metas" ADD CONSTRAINT "metas_usuario_id_fkey"
            FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'aportes_meta_meta_id_fkey'
    ) THEN
        ALTER TABLE "aportes_meta" ADD CONSTRAINT "aportes_meta_meta_id_fkey"
            FOREIGN KEY ("meta_id") REFERENCES "metas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
