-- Conversas persistentes do Pulso Assistente

CREATE TABLE IF NOT EXISTS "conversas_chat" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "titulo" VARCHAR(120) NOT NULL DEFAULT 'Nova conversa',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversas_chat_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "conversas_chat_usuario_id_atualizado_em_idx"
    ON "conversas_chat"("usuario_id", "atualizado_em" DESC);

ALTER TABLE "conversas_chat" DROP CONSTRAINT IF EXISTS "conversas_chat_usuario_id_fkey";
ALTER TABLE "conversas_chat"
    ADD CONSTRAINT "conversas_chat_usuario_id_fkey"
    FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "mensagens_chat" (
    "id" TEXT NOT NULL,
    "conversa_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "papel" VARCHAR(20) NOT NULL,
    "conteudo" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagens_chat_pkey" PRIMARY KEY ("id")
);

-- Se a tabela já existia sem conversa_id (schema antigo sem migration), adiciona a coluna
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'mensagens_chat'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'mensagens_chat' AND column_name = 'conversa_id'
    ) THEN
        ALTER TABLE "mensagens_chat" ADD COLUMN "conversa_id" TEXT;
        DELETE FROM "mensagens_chat" WHERE "conversa_id" IS NULL;
        ALTER TABLE "mensagens_chat" ALTER COLUMN "conversa_id" SET NOT NULL;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS "mensagens_chat_conversa_id_criado_em_idx"
    ON "mensagens_chat"("conversa_id", "criado_em");

CREATE INDEX IF NOT EXISTS "mensagens_chat_usuario_id_criado_em_idx"
    ON "mensagens_chat"("usuario_id", "criado_em" DESC);

ALTER TABLE "mensagens_chat" DROP CONSTRAINT IF EXISTS "mensagens_chat_conversa_id_fkey";
ALTER TABLE "mensagens_chat"
    ADD CONSTRAINT "mensagens_chat_conversa_id_fkey"
    FOREIGN KEY ("conversa_id") REFERENCES "conversas_chat"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "mensagens_chat" DROP CONSTRAINT IF EXISTS "mensagens_chat_usuario_id_fkey";
ALTER TABLE "mensagens_chat"
    ADD CONSTRAINT "mensagens_chat_usuario_id_fkey"
    FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
