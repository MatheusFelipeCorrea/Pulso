-- CreateEnum
CREATE TYPE "TipoNotificacao" AS ENUM (
  'RECEITA_REGISTRADA',
  'DESPESA_REGISTRADA',
  'META_ATINGIDA',
  'ALERTA_ORCAMENTO',
  'ORCAMENTO_ESTOURADO',
  'LEMBRETE_VENCIMENTO',
  'STREAK',
  'CONQUISTA',
  'GRUPO_ATIVIDADE',
  'DIVIDA_COBRANCA',
  'INSIGHT_IA'
);

-- CreateTable
CREATE TABLE "notificacoes" (
  "id" TEXT NOT NULL,
  "usuario_id" TEXT NOT NULL,
  "tipo" "TipoNotificacao" NOT NULL,
  "titulo" VARCHAR(120) NOT NULL,
  "mensagem" VARCHAR(500),
  "lida" BOOLEAN NOT NULL DEFAULT false,
  "link_acao" VARCHAR(255),
  "metadados" JSONB,
  "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notificacoes_usuario_id_lida_idx" ON "notificacoes"("usuario_id", "lida");

-- CreateIndex
CREATE INDEX "notificacoes_usuario_id_criado_em_idx" ON "notificacoes"("usuario_id", "criado_em" DESC);

-- CreateIndex
CREATE INDEX "notificacoes_tipo_idx" ON "notificacoes"("tipo");

-- AddForeignKey
ALTER TABLE "notificacoes"
  ADD CONSTRAINT "notificacoes_usuario_id_fkey"
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
