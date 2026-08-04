-- CreateEnum
CREATE TYPE "StatusItemCompra" AS ENUM ('DESEJADO', 'COMPRADO');
CREATE TYPE "CategoriaItemCompra" AS ENUM ('TECNOLOGIA', 'ELETRONICOS', 'ACESSORIOS', 'OUTROS');

-- CreateTable
CREATE TABLE "itens_planejamento_compra" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "valor_estimado" DECIMAL(12,2) NOT NULL,
    "prioridade" "Prioridade" NOT NULL DEFAULT 'MEDIA',
    "categoria" "CategoriaItemCompra" NOT NULL DEFAULT 'OUTROS',
    "observacoes" VARCHAR(300),
    "link_produto" VARCHAR(500),
    "simular_parcelas" BOOLEAN NOT NULL DEFAULT true,
    "parcelas" INTEGER NOT NULL DEFAULT 12,
    "meta_id" TEXT,
    "status" "StatusItemCompra" NOT NULL DEFAULT 'DESEJADO',
    "comprado_em" TIMESTAMP(3),
    "transacao_id" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itens_planejamento_compra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "itens_planejamento_compra_transacao_id_key" ON "itens_planejamento_compra"("transacao_id");

-- CreateIndex
CREATE INDEX "itens_planejamento_compra_usuario_id_status_idx" ON "itens_planejamento_compra"("usuario_id", "status");

-- CreateIndex
CREATE INDEX "itens_planejamento_compra_usuario_id_criado_em_idx" ON "itens_planejamento_compra"("usuario_id", "criado_em" DESC);

-- AddForeignKey
ALTER TABLE "itens_planejamento_compra" ADD CONSTRAINT "itens_planejamento_compra_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_planejamento_compra" ADD CONSTRAINT "itens_planejamento_compra_meta_id_fkey" FOREIGN KEY ("meta_id") REFERENCES "metas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_planejamento_compra" ADD CONSTRAINT "itens_planejamento_compra_transacao_id_fkey" FOREIGN KEY ("transacao_id") REFERENCES "transacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
