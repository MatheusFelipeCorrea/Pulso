-- AlterEnum
ALTER TYPE "TipoTransacao" ADD VALUE 'TRANSFERENCIA';

-- AlterEnum
ALTER TYPE "TipoRecurso" ADD VALUE 'POUPANCA';

-- AlterEnum
ALTER TYPE "TipoNotificacao" ADD VALUE 'TRANSFERENCIA_REGISTRADA';

-- AlterTable
ALTER TABLE "transacoes" ALTER COLUMN "categoria_id" DROP NOT NULL;
ALTER TABLE "transacoes" ADD COLUMN "recurso_destino" "TipoRecurso";
