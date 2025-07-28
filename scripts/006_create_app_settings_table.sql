-- ===========================================
-- 006_create_app_settings_table.sql
-- Maakt de tabel 'app_settings' voor algemene applicatie-instellingen
-- ===========================================

-- Tabel 'app_settings'
create table if not exists public.app_settings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  setting_name text not null unique, -- Bijv. 'show_donation_banner'
  setting_value text not null -- Bijv. 'true' of 'false'
);

-- RLS inschakelen
alter table public.app_settings enable row level security;

-- Beleidsregels voor 'app_settings'
-- Iedereen mag de instellingen lezen
create policy "Allow public read access to app_settings"
  on public.app_settings for select
  using (true);

-- Alleen admins (of via een Server Action) mogen instellingen updaten
-- Voor nu laten we dit beperkt, je kunt later een specifieke policy toevoegen voor admin-gebruikers
-- of een Server Action maken om dit veilig te updaten.
-- Voor nu kun je het direct in de Supabase UI aanpassen.

-- Voeg een standaardinstelling toe voor de donatiebanner
INSERT INTO public.app_settings (setting_name, setting_value)
VALUES ('show_donation_banner', 'true')
ON CONFLICT (setting_name) DO NOTHING; -- Voorkom duplicaten bij herhaaldelijk uitvoeren
