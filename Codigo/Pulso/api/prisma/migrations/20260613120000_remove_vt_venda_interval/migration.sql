-- Remove campos legados de intervalo entre vendas de VT (RF-064/065 removidos)

ALTER TABLE "configuracoes_usuario" DROP COLUMN IF EXISTS "dias_intervalo_venda_vt";

ALTER TABLE "vendas_vt" DROP COLUMN IF EXISTS "proxima_data_venda";
