-- DropForeignKey
ALTER TABLE "lembretes" DROP CONSTRAINT "lembretes_divisao_participante_id_fkey";

-- DropIndex
DROP INDEX "lembretes_divisao_participante_id_idx";

-- AlterTable
ALTER TABLE "lembretes" DROP COLUMN "divisao_participante_id",
ADD COLUMN     "repetir_cada_dias" INTEGER;

-- CreateTable
CREATE TABLE "_DivisaoParticipanteToLembrete" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DivisaoParticipanteToLembrete_AB_unique" ON "_DivisaoParticipanteToLembrete"("A", "B");

-- CreateIndex
CREATE INDEX "_DivisaoParticipanteToLembrete_B_index" ON "_DivisaoParticipanteToLembrete"("B");

-- AddForeignKey
ALTER TABLE "_DivisaoParticipanteToLembrete" ADD CONSTRAINT "_DivisaoParticipanteToLembrete_A_fkey" FOREIGN KEY ("A") REFERENCES "divisao_participantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DivisaoParticipanteToLembrete" ADD CONSTRAINT "_DivisaoParticipanteToLembrete_B_fkey" FOREIGN KEY ("B") REFERENCES "lembretes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
