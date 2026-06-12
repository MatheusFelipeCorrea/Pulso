-- AlterTable
ALTER TABLE "lembretes" ADD COLUMN "repetir_mensal" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "lembretes" ADD COLUMN "dia_recorrencia" INTEGER;
ALTER TABLE "lembretes" ADD COLUMN "lembrete_template_id" TEXT;

-- CreateIndex
CREATE INDEX "lembretes_repetir_mensal_idx" ON "lembretes"("repetir_mensal");
CREATE INDEX "lembretes_lembrete_template_id_idx" ON "lembretes"("lembrete_template_id");

-- AddForeignKey
ALTER TABLE "lembretes" ADD CONSTRAINT "lembretes_lembrete_template_id_fkey" FOREIGN KEY ("lembrete_template_id") REFERENCES "lembretes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
