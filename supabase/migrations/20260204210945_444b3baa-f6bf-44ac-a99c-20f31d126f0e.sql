-- Organisation für Fintutto erstellen
INSERT INTO public.organizations (id, name, slug, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Fintutto',
  'fintutto',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Admin Rolle für alexander@deibel.info zuweisen
-- Actual user_roles schema: id (uuid, auto), user_id (uuid), role (app_role enum),
-- created_at (timestamptz, default now()), role_id (uuid, nullable), assigned_at (timestamptz, default now())
-- Only user_id and role_id need to be provided; id, created_at, assigned_at have defaults.
-- role column is app_role enum (default 'mieter') - do NOT pass 'Administrator' as text.
INSERT INTO public.user_roles (user_id, role_id)
VALUES (
  '49695d31-7673-4a3b-b5be-3aaaef120faf',
  'abaaf645-d667-46eb-8805-b06ef9093a73'
) ON CONFLICT DO NOTHING;