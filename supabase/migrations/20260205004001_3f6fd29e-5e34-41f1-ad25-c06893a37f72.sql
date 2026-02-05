-- Create profile for current admin user
INSERT INTO public.profiles (id, email, full_name, role, status, created_at, updated_at)
VALUES (
  '49695d31-7673-4a3b-b5be-3aaaef120faf',
  'alexander@deibel.info',
  'Alexander Deibel',
  'admin',
  'active',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Also create a trigger to auto-create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user',
    'active',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();