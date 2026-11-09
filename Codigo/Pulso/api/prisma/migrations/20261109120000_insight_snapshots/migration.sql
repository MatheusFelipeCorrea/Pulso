-- Snapshots mensais do painel Insights Inteligentes

CREATE TABLE IF NOT EXISTS "insight_snapshots" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "mes_referencia" VARCHAR(7) NOT NULL,
    "payload" JSONB NOT NULL,
    "gerado_por" VARCHAR(20) NOT NULL DEFAULT 'gemini',
    "regeneracoes" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insight_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "insight_snapshots_usuario_id_mes_referencia_key"
    ON "insight_snapshots"("usuario_id", "mes_referencia");

CREATE INDEX IF NOT EXISTS "insight_snapshots_usuario_id_atualizado_em_idx"
    ON "insight_snapshots"("usuario_id", "atualizado_em" DESC);

ALTER TABLE "insight_snapshots" DROP CONSTRAINT IF EXISTS "insight_snapshots_usuario_id_fkey";
ALTER TABLE "insight_snapshots"
    ADD CONSTRAINT "insight_snapshots_usuario_id_fkey"
    FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
