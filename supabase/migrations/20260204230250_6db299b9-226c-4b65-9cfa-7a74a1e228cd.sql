-- =============================================================
-- SECURITY FIX: Address multiple error-level security findings
-- =============================================================

-- 1. FIX: user_roles table has "allow_all" policy - CRITICAL VULNERABILITY
-- Remove the dangerous allow_all policy and add proper admin-only policies
DROP POLICY IF EXISTS "allow_all" ON public.user_roles;

-- Create proper policies for user_roles table
-- Only admins can manage user roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'))
WITH CHECK (public.has_role_by_name(auth.uid(), 'Administrator'));

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 2. FIX: profiles table - Allow admins to update other profiles
-- First drop the existing update policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new policy: Users can update their own profile OR admins can update any profile
CREATE POLICY "Users can update own profile or admins can update any"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id 
  OR public.has_role_by_name(auth.uid(), 'Administrator')
)
WITH CHECK (
  auth.uid() = id 
  OR public.has_role_by_name(auth.uid(), 'Administrator')
);

-- Allow admins to view all profiles (needed for admin dashboard)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id 
  OR public.has_role_by_name(auth.uid(), 'Administrator')
);

-- Drop old select policy and ensure the new one covers all cases
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 3. FIX: subscriptions table - Remove overly permissive "true" policy
DROP POLICY IF EXISTS "Authenticated users can view subscriptions" ON public.subscriptions;

-- Create proper policy: Users can only view subscriptions for their org
CREATE POLICY "Users can view own org subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.org_memberships 
    WHERE user_id = auth.uid() AND status = 'active'
  )
  OR public.has_role_by_name(auth.uid(), 'Administrator')
);

-- 4. Ensure user_profiles table has admin access for dashboard
-- Add admin SELECT policy
CREATE POLICY "Admins can view all user profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid() 
  OR public.has_role_by_name(auth.uid(), 'Administrator')
);

-- Drop old policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;

-- 5. Ensure bank_accounts table has admin access
CREATE POLICY "Admins can view all bank accounts"
ON public.bank_accounts
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR public.has_role_by_name(auth.uid(), 'Administrator')
);

-- Drop old policy
DROP POLICY IF EXISTS "Users can view own bank accounts" ON public.bank_accounts;

-- 6. Ensure tenants table has proper admin access
CREATE POLICY "Admins can view all tenants"
ON public.tenants
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR is_org_member(auth.uid(), org_id)
  OR public.has_role_by_name(auth.uid(), 'Administrator')
);

-- Drop old policy
DROP POLICY IF EXISTS "Tenants can view own data" ON public.tenants;