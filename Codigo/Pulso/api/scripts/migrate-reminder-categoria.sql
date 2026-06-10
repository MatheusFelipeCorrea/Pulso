-- Migração: tipo → categoria (enum expandido)
-- Execute uma vez se o db push falhar com dados legados.

-- 1) Renomear coluna se ainda for "tipo"
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lembretes' AND column_name = 'tipo'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lembretes' AND column_name = 'categoria'
  ) THEN
    ALTER TABLE lembretes RENAME COLUMN tipo TO categoria;
  END IF;
END $$;
