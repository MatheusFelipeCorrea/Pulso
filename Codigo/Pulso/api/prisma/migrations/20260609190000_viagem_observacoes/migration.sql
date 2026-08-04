CREATE TYPE "TipoObservacaoViagem" AS ENUM ('GERAL', 'CHECKLIST', 'LINK', 'DICA', 'DOCUMENTOS');

CREATE TABLE IF NOT EXISTS "observacoes_viagem" (
    "id" TEXT NOT NULL,
    "viagem_id" TEXT NOT NULL,
    "titulo" VARCHAR(120) NOT NULL,
    "conteudo" VARCHAR(1000),
    "tipo" "TipoObservacaoViagem" DEFAULT 'GERAL',
    "link_url" VARCHAR(500),
    "checklist" JSONB,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "observacoes_viagem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "observacoes_viagem_viagem_id_idx" ON "observacoes_viagem"("viagem_id");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'observacoes_viagem_viagem_id_fkey') THEN
        ALTER TABLE "observacoes_viagem" ADD CONSTRAINT "observacoes_viagem_viagem_id_fkey"
            FOREIGN KEY ("viagem_id") REFERENCES "viagens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
