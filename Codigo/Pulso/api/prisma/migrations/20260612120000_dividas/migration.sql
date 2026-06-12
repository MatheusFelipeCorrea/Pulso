-- CreateEnum
CREATE TYPE "DirecaoDivida" AS ENUM ('ME_DEVEM', 'EU_DEVO');

-- CreateTable
CREATE TABLE "dividas" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "direcao" "DirecaoDivida" NOT NULL,
    "nome_pessoa" VARCHAR(120) NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "data_emprestimo" TIMESTAMP(3) NOT NULL,
    "prazo_devolucao" TIMESTAMP(3),
    "observacao" VARCHAR(250),
    "quitada" BOOLEAN NOT NULL DEFAULT false,
    "data_quitacao" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dividas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dividas_usuario_id_idx" ON "dividas"("usuario_id");
CREATE INDEX "dividas_usuario_id_quitada_idx" ON "dividas"("usuario_id", "quitada");
CREATE INDEX "dividas_usuario_id_prazo_devolucao_idx" ON "dividas"("usuario_id", "prazo_devolucao");
CREATE INDEX "dividas_quitada_data_quitacao_idx" ON "dividas"("quitada", "data_quitacao");

-- AddForeignKey
ALTER TABLE "dividas" ADD CONSTRAINT "dividas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
