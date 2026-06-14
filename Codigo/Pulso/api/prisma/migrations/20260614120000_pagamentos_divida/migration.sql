-- CreateTable
CREATE TABLE "pagamentos_divida" (
    "id" TEXT NOT NULL,
    "divida_id" TEXT NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "data_pagamento" TIMESTAMP(3) NOT NULL,
    "observacao" VARCHAR(250),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagamentos_divida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pagamentos_divida_divida_id_data_pagamento_idx" ON "pagamentos_divida"("divida_id", "data_pagamento" DESC);

-- AddForeignKey
ALTER TABLE "pagamentos_divida" ADD CONSTRAINT "pagamentos_divida_divida_id_fkey" FOREIGN KEY ("divida_id") REFERENCES "dividas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
