-- Organisation für Fintutto erstellen
INSERT INTO public.organizations (id, name, slug, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Fintutto',
  'fintutto',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Admin Rolle für alexander@deibel.info zuweisen
INSERT INTO public.user_roles (user_id, org_id, role_id, assigned_at)
VALUES (
  '49695d31-7673-4a3b-b5be-3aaaef120faf',
  '00000000-0000-0000-0000-000000000001',
  'abaaf645-d667-46eb-8805-b06ef9093a73',
  now()
) ON CONFLICT DO NOTHING;