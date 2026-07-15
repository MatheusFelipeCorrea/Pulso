-- Defesa em profundidade: repetir_cada_dias = 0 travaria o loop de avancarRepeticaoPorDias
-- (reminderRecurrenceJob) indefinidamente. A validação de aplicação (Zod) já impede isso
-- na criação via Divisão de Despesas, mas não há constraint de banco cobrindo todo caminho de escrita.
ALTER TABLE "lembretes"
    ADD CONSTRAINT "lembretes_repetir_cada_dias_positive"
    CHECK ("repetir_cada_dias" IS NULL OR "repetir_cada_dias" > 0);
