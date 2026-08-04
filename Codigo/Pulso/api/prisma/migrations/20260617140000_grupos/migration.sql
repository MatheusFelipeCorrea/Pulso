-- PapelGrupo
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PapelGrupo') THEN
        CREATE TYPE "PapelGrupo" AS ENUM ('ADMIN', 'MEMBRO');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "grupos" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" VARCHAR(500),
    "codigo_convite" TEXT NOT NULL,
    "criador_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "grupos_codigo_convite_key" ON "grupos"("codigo_convite");
CREATE INDEX IF NOT EXISTS "grupos_criador_id_idx" ON "grupos"("criador_id");

CREATE TABLE IF NOT EXISTS "membros_grupo" (
    "id" TEXT NOT NULL,
    "grupo_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "papel" "PapelGrupo" NOT NULL DEFAULT 'MEMBRO',
    "entrou_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "membros_grupo_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "membros_grupo_grupo_id_usuario_id_key" ON "membros_grupo"("grupo_id", "usuario_id");
CREATE INDEX IF NOT EXISTS "membros_grupo_usuario_id_idx" ON "membros_grupo"("usuario_id");

CREATE TABLE IF NOT EXISTS "viagens_grupo" (
    "id" TEXT NOT NULL,
    "grupo_id" TEXT NOT NULL,
    "destino" VARCHAR(120) NOT NULL,
    "moeda" VARCHAR(3) NOT NULL,
    "data_prevista" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "viagens_grupo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "viagens_grupo_grupo_id_idx" ON "viagens_grupo"("grupo_id");

CREATE TABLE IF NOT EXISTS "despesas_viagem_grupo" (
    "id" TEXT NOT NULL,
    "viagem_grupo_id" TEXT NOT NULL,
    "adicionado_por_id" TEXT NOT NULL,
    "categoria" "CategoriaDespesaViagem" NOT NULL,
    "descricao" VARCHAR(255),
    "valor_estimado" DECIMAL(12,2) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "despesas_viagem_grupo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "despesas_viagem_grupo_viagem_grupo_id_idx" ON "despesas_viagem_grupo"("viagem_grupo_id");

CREATE TABLE IF NOT EXISTS "metas_grupo" (
    "id" TEXT NOT NULL,
    "grupo_id" TEXT NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "valor_alvo" DECIMAL(12,2) NOT NULL,
    "valor_atual" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "prazo" TIMESTAMP(3) NOT NULL,
    "status" "StatusMeta" NOT NULL DEFAULT 'ATIVA',
    "descricao" VARCHAR(500),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "metas_grupo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "metas_grupo_grupo_id_status_idx" ON "metas_grupo"("grupo_id", "status");

CREATE TABLE IF NOT EXISTS "aportes_meta_grupo" (
    "id" TEXT NOT NULL,
    "meta_grupo_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "aportes_meta_grupo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "aportes_meta_grupo_meta_grupo_id_data_idx" ON "aportes_meta_grupo"("meta_grupo_id", "data" DESC);
CREATE INDEX IF NOT EXISTS "aportes_meta_grupo_usuario_id_idx" ON "aportes_meta_grupo"("usuario_id");

CREATE TABLE IF NOT EXISTS "mensagens_chat_grupo" (
    "id" TEXT NOT NULL,
    "grupo_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mensagens_chat_grupo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "mensagens_chat_grupo_grupo_id_criado_em_idx" ON "mensagens_chat_grupo"("grupo_id", "criado_em" DESC);

ALTER TABLE "grupos" DROP CONSTRAINT IF EXISTS "grupos_criador_id_fkey";
ALTER TABLE "grupos" ADD CONSTRAINT "grupos_criador_id_fkey" FOREIGN KEY ("criador_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "membros_grupo" DROP CONSTRAINT IF EXISTS "membros_grupo_grupo_id_fkey";
ALTER TABLE "membros_grupo" ADD CONSTRAINT "membros_grupo_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "membros_grupo" DROP CONSTRAINT IF EXISTS "membros_grupo_usuario_id_fkey";
ALTER TABLE "membros_grupo" ADD CONSTRAINT "membros_grupo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "viagens_grupo" DROP CONSTRAINT IF EXISTS "viagens_grupo_grupo_id_fkey";
ALTER TABLE "viagens_grupo" ADD CONSTRAINT "viagens_grupo_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "despesas_viagem_grupo" DROP CONSTRAINT IF EXISTS "despesas_viagem_grupo_viagem_grupo_id_fkey";
ALTER TABLE "despesas_viagem_grupo" ADD CONSTRAINT "despesas_viagem_grupo_viagem_grupo_id_fkey" FOREIGN KEY ("viagem_grupo_id") REFERENCES "viagens_grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "despesas_viagem_grupo" DROP CONSTRAINT IF EXISTS "despesas_viagem_grupo_adicionado_por_id_fkey";
ALTER TABLE "despesas_viagem_grupo" ADD CONSTRAINT "despesas_viagem_grupo_adicionado_por_id_fkey" FOREIGN KEY ("adicionado_por_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "metas_grupo" DROP CONSTRAINT IF EXISTS "metas_grupo_grupo_id_fkey";
ALTER TABLE "metas_grupo" ADD CONSTRAINT "metas_grupo_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "aportes_meta_grupo" DROP CONSTRAINT IF EXISTS "aportes_meta_grupo_meta_grupo_id_fkey";
ALTER TABLE "aportes_meta_grupo" ADD CONSTRAINT "aportes_meta_grupo_meta_grupo_id_fkey" FOREIGN KEY ("meta_grupo_id") REFERENCES "metas_grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "aportes_meta_grupo" DROP CONSTRAINT IF EXISTS "aportes_meta_grupo_usuario_id_fkey";
ALTER TABLE "aportes_meta_grupo" ADD CONSTRAINT "aportes_meta_grupo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "mensagens_chat_grupo" DROP CONSTRAINT IF EXISTS "mensagens_chat_grupo_grupo_id_fkey";
ALTER TABLE "mensagens_chat_grupo" ADD CONSTRAINT "mensagens_chat_grupo_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mensagens_chat_grupo" DROP CONSTRAINT IF EXISTS "mensagens_chat_grupo_usuario_id_fkey";
ALTER TABLE "mensagens_chat_grupo" ADD CONSTRAINT "mensagens_chat_grupo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
