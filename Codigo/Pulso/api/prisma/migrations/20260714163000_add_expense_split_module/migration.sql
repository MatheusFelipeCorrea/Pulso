-- CreateEnum
CREATE TYPE "TipoRateioDivisao" AS ENUM ('IGUAL', 'PERSONALIZADA');

-- CreateEnum
CREATE TYPE "StatusDivisao" AS ENUM ('ATIVA', 'QUITADA');

-- CreateEnum
CREATE TYPE "StatusParticipanteDivisao" AS ENUM ('PENDENTE', 'PAGO');

-- CreateTable
CREATE TABLE "divisoes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "titulo" VARCHAR(120) NOT NULL,
    "valor_total" DECIMAL(12,2) NOT NULL,
    "tipo" "TipoRateioDivisao" NOT NULL DEFAULT 'IGUAL',
    "status" "StatusDivisao" NOT NULL DEFAULT 'ATIVA',
    "data" DATE NOT NULL,
    "icone" VARCHAR(40),
    "cor" VARCHAR(20),
    "observacao" VARCHAR(250),
    "quitada_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "divisoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divisao_participantes" (
    "id" TEXT NOT NULL,
    "divisao_id" TEXT NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "eh_organizador" BOOLEAN NOT NULL DEFAULT false,
    "pagou_a_conta" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusParticipanteDivisao" NOT NULL DEFAULT 'PENDENTE',
    "data_pagamento" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "divisao_participantes_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "lembretes" ADD COLUMN     "divisao_participante_id" TEXT;

-- CreateIndex
CREATE INDEX "divisoes_usuario_id_idx" ON "divisoes"("usuario_id");

-- CreateIndex
CREATE INDEX "divisoes_usuario_id_status_idx" ON "divisoes"("usuario_id", "status");

-- CreateIndex
CREATE INDEX "divisoes_status_quitada_em_idx" ON "divisoes"("status", "quitada_em");

-- CreateIndex
CREATE INDEX "divisao_participantes_divisao_id_idx" ON "divisao_participantes"("divisao_id");

-- CreateIndex
CREATE INDEX "divisao_participantes_divisao_id_status_idx" ON "divisao_participantes"("divisao_id", "status");

-- CreateIndex
CREATE INDEX "lembretes_divisao_participante_id_idx" ON "lembretes"("divisao_participante_id");

-- AddForeignKey
ALTER TABLE "divisoes" ADD CONSTRAINT "divisoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divisao_participantes" ADD CONSTRAINT "divisao_participantes_divisao_id_fkey" FOREIGN KEY ("divisao_id") REFERENCES "divisoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lembretes" ADD CONSTRAINT "lembretes_divisao_participante_id_fkey" FOREIGN KEY ("divisao_participante_id") REFERENCES "divisao_participantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
