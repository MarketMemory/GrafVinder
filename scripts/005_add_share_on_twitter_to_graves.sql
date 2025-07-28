-- ===========================================
-- 005_add_share_on_twitter_to_graves.sql
-- Voegt de kolom 'share_on_twitter' toe aan de 'graves' tabel
-- ===========================================

ALTER TABLE public.graves
ADD COLUMN share_on_twitter BOOLEAN DEFAULT FALSE;

-- Optioneel: Voeg een index toe als je verwacht hier vaak op te filteren
-- CREATE INDEX IF NOT EXISTS idx_graves_share_on_twitter ON public.graves (share_on_twitter);
