-- ===========================================
-- 004_remove_example_graves.sql
-- Verwijdert de voorbeeld graven (duplicaten)
-- ===========================================

-- Verwijder eerst de herinneringen die gekoppeld zijn aan de voorbeeld graven
DELETE FROM public.memories 
WHERE grave_id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222'
);

-- Verwijder de voorbeeld graven zelf
DELETE FROM public.graves 
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222'
);

-- Verwijder de dummy gebruiker (optioneel - alleen als er geen andere graven aan gekoppeld zijn)
DELETE FROM auth.users 
WHERE id = '00000000-0000-0000-0000-000000000001'
AND NOT EXISTS (
  SELECT 1 FROM public.graves WHERE user_id = '00000000-0000-0000-0000-000000000001'
);
