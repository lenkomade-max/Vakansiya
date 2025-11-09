-- CREATE LEYLA USER FOR PARSER

-- 1. Create auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'leyla@vakansiya.az',
  crypt('leyla-parser-2025', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Leyla"}',
  NOW(),
  NOW()
);

-- 2. Create profile
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Leyla', 'user'
FROM auth.users
WHERE email = 'leyla@vakansiya.az'
ON CONFLICT (id) DO NOTHING;

-- 3. GET UUID - COPY THIS!
SELECT id, email FROM auth.users WHERE email = 'leyla@vakansiya.az';
