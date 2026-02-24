-- Organisation für Fintutto erstellen
INSERT INTO public.organizations (id, name, slug, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Fintutto',
  'fintutto',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Admin Rolle für alexander@deibel.info zuweisen
-- Uses dynamic SQL because user_roles schema in types.ts differs from actual DB
DO $$
DECLARE
  col_list text;
  val_list text;
  dyn_sql text;
BEGIN
  SELECT
    string_agg(c.column_name, ', ' ORDER BY c.ordinal_position),
    string_agg(
      CASE c.column_name
        WHEN 'user_id' THEN '''49695d31-7673-4a3b-b5be-3aaaef120faf''::uuid'
        WHEN 'role_id' THEN '''abaaf645-d667-46eb-8805-b06ef9093a73''::uuid'
        WHEN 'org_id' THEN '''00000000-0000-0000-0000-000000000001''::uuid'
        WHEN 'role' THEN '''Administrator'''
        WHEN 'role_name' THEN '''Administrator'''
        WHEN 'assigned_at' THEN 'now()'
        WHEN 'created_at' THEN 'now()'
        ELSE 'NULL'
      END,
      ', ' ORDER BY c.ordinal_position
    )
  INTO col_list, val_list
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'user_roles'
    AND c.column_name != 'id'
    AND c.is_generated = 'NEVER'
    AND (c.column_default IS NULL OR c.column_name IN ('user_id', 'role_id', 'org_id', 'role', 'role_name'));

  IF col_list IS NOT NULL THEN
    dyn_sql := 'INSERT INTO public.user_roles (' || col_list || ') VALUES (' || val_list || ') ON CONFLICT DO NOTHING';
    EXECUTE dyn_sql;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'user_roles insert skipped: %', SQLERRM;
END $$;