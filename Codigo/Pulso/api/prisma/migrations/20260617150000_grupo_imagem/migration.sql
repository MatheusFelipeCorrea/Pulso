-- Imagem personalizada do grupo (admin) e meta do destino na viagem do grupo
ALTER TABLE "grupos" ADD COLUMN "url_imagem" VARCHAR(2048);

ALTER TABLE "viagens_grupo" ADD COLUMN "destino_meta" JSONB;
