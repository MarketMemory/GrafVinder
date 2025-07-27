-- ===========================================
-- 002_add_example_graves.sql
-- Voegt voorbeeldgraven toe voor demonstratie
-- ===========================================

-- Voeg een dummy gebruiker toe voor de voorbeeldgraven
-- (In een echte situatie zouden deze graven door echte gebruikers worden toegevoegd)
INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo@grafvinder.nl', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Voeg voorbeeldgraf 2 toe
INSERT INTO public.graves (
  id,
  created_at,
  name,
  birth_date,
  death_date,
  biography,
  grave_photo_url,
  deceased_photo_url,
  location_latitude,
  location_longitude,
  location_description,
  user_id
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  now(),
  'Anna Maria van der Velde (Duplicaat 2)',
  '1932-08-15',
  '2021-11-10',
  'Anna Maria van der Velde (Duplicaat 2) was een gepassioneerde bibliothecaresse die haar hele leven heeft gewijd aan het delen van kennis. Geboren in een klein dorpje in Gelderland, verhuisde ze op jonge leeftijd naar Amsterdam waar ze haar carrière begon. Ze was bekend om haar uitgebreide kennis van Nederlandse literatuur en hielp talloze studenten bij hun onderzoek. Naast haar werk was ze een fervent schaakster en organiseerde ze jarenlang schaaktoernooien voor kinderen. Haar vriendelijkheid en geduld maakten haar geliefd bij iedereen die haar kende.',
  '/placeholder.svg?height=160&width=160',
  '/placeholder.svg?height=160&width=160',
  52.3676,
  4.9041,
  'Begraafplaats Zorgvlied, Amsterdam, Vak D, Rij 8, Graf 12',
  '00000000-0000-0000-0000-000000000001'
);

-- Voeg voorbeeldgraf 3 toe
INSERT INTO public.graves (
  id,
  created_at,
  name,
  birth_date,
  death_date,
  biography,
  grave_photo_url,
  deceased_photo_url,
  location_latitude,
  location_longitude,
  location_description,
  user_id
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  now(),
  'Anna Maria van der Velde (Duplicaat 3)',
  '1928-03-22',
  '2019-07-05',
  'Anna Maria van der Velde (Duplicaat 3) was een toegewijde verpleegster die meer dan 40 jaar heeft gewerkt in het plaatselijke ziekenhuis. Geboren tijdens de economische crisis, leerde ze al vroeg de waarde van hard werken en compassie. Ze specialiseerde zich in de zorg voor kinderen en was geliefd om haar zachte aanpak en troostende woorden. Ook na haar pensionering bleef ze actief als vrijwilliger bij het Rode Kruis. Ze was een getalenteerde breister en maakte warme truien voor kinderen in nood. Haar nalatenschap leeft voort in de vele levens die ze heeft geraakt.',
  '/placeholder.svg?height=160&width=160',
  '/placeholder.svg?height=160&width=160',
  51.9225,
  4.4792,
  'Algemene Begraafplaats Rotterdam, Vak F, Rij 15, Graf 23',
  '00000000-0000-0000-0000-000000000001'
);

-- Voeg enkele herinneringen toe aan de voorbeeldgraven
INSERT INTO public.memories (
  id,
  created_at,
  text,
  date,
  author,
  grave_id,
  user_id
) VALUES 
  (
    '33333333-3333-3333-3333-333333333333',
    now(),
    'Mevrouw Anna was de beste bibliothecaresse die ik ooit heb ontmoet. Ze hielp me altijd met het vinden van de perfecte boeken voor mijn scriptie.',
    '2021-12-01',
    'Student Lisa',
    '11111111-1111-1111-1111-111111111111',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    now(),
    'Haar schaaktoernooien waren het hoogtepunt van mijn jeugd. Ze leerde me niet alleen schaken, maar ook eerlijkheid en respect.',
    '2022-01-15',
    'Voormalig schaakstudent Mark',
    '11111111-1111-1111-1111-111111111111',
    null
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    now(),
    'Zuster Anna zorgde voor mij toen ik als kind in het ziekenhuis lag. Haar vriendelijke glimlach maakte alles beter.',
    '2019-08-20',
    'Dankbare patiënt Emma',
    '22222222-2222-2222-2222-222222222222',
    null
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    now(),
    'De truien die ze breide voor mijn kinderen waren niet alleen warm, maar gemaakt met zoveel liefde. We missen haar enorm.',
    '2020-02-14',
    'Moeder van drie Sarah',
    '22222222-2222-2222-2222-222222222222',
    null
  );
