-- CreateIndex (RN-072: uma meta só pode estar vinculada a uma viagem)
CREATE UNIQUE INDEX "viagens_meta_id_key" ON "viagens"("meta_id");
