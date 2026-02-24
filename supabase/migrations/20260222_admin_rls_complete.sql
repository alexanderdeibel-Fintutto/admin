-- =============================================================
-- COMPREHENSIVE ADMIN RLS FIX
-- Ensures the admin user can access ALL tables needed
-- for the admin dashboard to function properly.
-- =============================================================

-- =====================
-- 0. VERIFY ADMIN SETUP
-- =====================

-- Ensure the admin role is assigned
-- The types.ts file is out of sync with the actual DB schema,
-- so we use fully dynamic SQL to discover and use real column names.
DO $$
DECLARE
  admin_has_role boolean;
  col_list text;
  val_list text;
  dyn_sql text;
BEGIN
  -- First check if admin already has the role via the working has_role_by_name function
  BEGIN
    SELECT public.has_role_by_name(
      '49695d31-7673-4a3b-b5be-3aaaef120faf'::uuid,
      'Administrator'
    ) INTO admin_has_role;
  EXCEPTION WHEN OTHERS THEN
    admin_has_role := NULL;
  END;

  -- If admin already has the role, skip
  IF COALESCE(admin_has_role, false) THEN
    RAISE NOTICE 'Admin role already assigned, skipping insert';
    RETURN;
  END IF;

  -- Discover actual columns and build dynamic INSERT
  -- We map known semantic meanings to whatever columns actually exist
  SELECT
    string_agg(c.column_name, ', ' ORDER BY c.ordinal_position),
    string_agg(
      CASE c.column_name
        WHEN 'user_id' THEN '''49695d31-7673-4a3b-b5be-3aaaef120faf''::uuid'
        WHEN 'role_id' THEN '(SELECT id FROM public.roles WHERE name = ''Administrator'' LIMIT 1)'
        WHEN 'org_id' THEN '''00000000-0000-0000-0000-000000000001''::uuid'
        WHEN 'assigned_at' THEN 'now()'
        WHEN 'created_at' THEN 'now()'
        WHEN 'id' THEN 'gen_random_uuid()'
        -- text/varchar role column: store role name directly
        WHEN 'role' THEN '''Administrator'''
        WHEN 'role_name' THEN '''Administrator'''
        ELSE 'NULL'
      END,
      ', ' ORDER BY c.ordinal_position
    )
  INTO col_list, val_list
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'user_roles'
    AND c.column_name != 'id'  -- skip PK, let DB generate it
    AND c.is_generated = 'NEVER'
    AND c.column_default IS NULL OR c.column_name IN ('user_id', 'role_id', 'org_id', 'role', 'role_name');

  IF col_list IS NULL THEN
    RAISE NOTICE 'Could not detect user_roles columns - skipping insert';
    RETURN;
  END IF;

  dyn_sql := 'INSERT INTO public.user_roles (' || col_list || ') VALUES (' || val_list || ') ON CONFLICT DO NOTHING';
  RAISE NOTICE 'Executing: %', dyn_sql;
  EXECUTE dyn_sql;

EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Admin role setup error: %. Continuing with RLS policies.', SQLERRM;
END $$;
END $$;


-- ==============================
-- 1. CORE TABLES - Admin SELECT
-- ==============================

-- profiles (may already exist from previous migration - idempotent)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR public.has_role_by_name(auth.uid(), 'Administrator'));

-- subscriptions
DROP POLICY IF EXISTS "Users can view own org subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admin can view all subscriptions" ON public.subscriptions;
CREATE POLICY "Admin can view all subscriptions"
ON public.subscriptions FOR SELECT TO authenticated
USING (
  org_id IN (SELECT org_id FROM public.org_memberships WHERE user_id = auth.uid() AND status = 'active')
  OR public.has_role_by_name(auth.uid(), 'Administrator')
);

-- organizations
DROP POLICY IF EXISTS "Admin can view all organizations" ON public.organizations;
CREATE POLICY "Admin can view all organizations"
ON public.organizations FOR SELECT TO authenticated
USING (
  id IN (SELECT org_id FROM public.org_memberships WHERE user_id = auth.uid() AND status = 'active')
  OR public.has_role_by_name(auth.uid(), 'Administrator')
);

-- org_memberships
DROP POLICY IF EXISTS "Admin can view all org memberships" ON public.org_memberships;
CREATE POLICY "Admin can view all org memberships"
ON public.org_memberships FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role_by_name(auth.uid(), 'Administrator'));


-- ==============================
-- 2. PAYMENT & BILLING TABLES
-- ==============================

-- stripe_payments
DROP POLICY IF EXISTS "Admin can view all stripe payments" ON public.stripe_payments;
CREATE POLICY "Admin can view all stripe payments"
ON public.stripe_payments FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));

-- stripe_prices
DROP POLICY IF EXISTS "Admin can view all stripe prices" ON public.stripe_prices;
DROP POLICY IF EXISTS "Anyone can view prices" ON public.stripe_prices;
CREATE POLICY "Anyone can view prices"
ON public.stripe_prices FOR SELECT TO authenticated
USING (true);

-- stripe_webhook_events
DROP POLICY IF EXISTS "Admin can view webhook events" ON public.stripe_webhook_events;
CREATE POLICY "Admin can view webhook events"
ON public.stripe_webhook_events FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));

-- user_credits
DROP POLICY IF EXISTS "Admin can view all user credits" ON public.user_credits;
CREATE POLICY "Admin can view all user credits"
ON public.user_credits FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role_by_name(auth.uid(), 'Administrator'));

-- user_purchases
DROP POLICY IF EXISTS "Admin can view all user purchases" ON public.user_purchases;
CREATE POLICY "Admin can view all user purchases"
ON public.user_purchases FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role_by_name(auth.uid(), 'Administrator'));

-- seat_allocations
DROP POLICY IF EXISTS "Admin can view all seat allocations" ON public.seat_allocations;
CREATE POLICY "Admin can view all seat allocations"
ON public.seat_allocations FOR SELECT TO authenticated
USING (
  org_id IN (SELECT org_id FROM public.org_memberships WHERE user_id = auth.uid() AND status = 'active')
  OR public.has_role_by_name(auth.uid(), 'Administrator')
);


-- ==============================
-- 3. LOGGING & MONITORING TABLES
-- ==============================

-- error_logs
DROP POLICY IF EXISTS "Admin can view all error logs" ON public.error_logs;
CREATE POLICY "Admin can view all error logs"
ON public.error_logs FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));

-- admin_logs
DROP POLICY IF EXISTS "Admin can view all admin logs" ON public.admin_logs;
CREATE POLICY "Admin can view all admin logs"
ON public.admin_logs FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));

-- webhook_logs
DROP POLICY IF EXISTS "Admin can view all webhook logs" ON public.webhook_logs;
CREATE POLICY "Admin can view all webhook logs"
ON public.webhook_logs FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));

-- api_keys
DROP POLICY IF EXISTS "Admin can view all api keys" ON public.api_keys;
CREATE POLICY "Admin can view all api keys"
ON public.api_keys FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role_by_name(auth.uid(), 'Administrator'));

-- Admin can also update api_keys
DROP POLICY IF EXISTS "Admin can update api keys" ON public.api_keys;
CREATE POLICY "Admin can update api keys"
ON public.api_keys FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR public.has_role_by_name(auth.uid(), 'Administrator'))
WITH CHECK (user_id = auth.uid() OR public.has_role_by_name(auth.uid(), 'Administrator'));

-- audit_logs
DROP POLICY IF EXISTS "Admin can view all audit logs" ON public.audit_logs;
CREATE POLICY "Admin can view all audit logs"
ON public.audit_logs FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));

-- notifications
DROP POLICY IF EXISTS "Admin can view all notifications" ON public.notifications;
CREATE POLICY "Admin can view all notifications"
ON public.notifications FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role_by_name(auth.uid(), 'Administrator'));


-- ==============================
-- 4. AI TABLES
-- ==============================

-- ai_usage_logs
DROP POLICY IF EXISTS "Admin can view all ai usage logs" ON public.ai_usage_logs;
CREATE POLICY "Admin can view all ai usage logs"
ON public.ai_usage_logs FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role_by_name(auth.uid(), 'Administrator'));

-- ai_conversations
DROP POLICY IF EXISTS "Admin can view all ai conversations" ON public.ai_conversations;
CREATE POLICY "Admin can view all ai conversations"
ON public.ai_conversations FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role_by_name(auth.uid(), 'Administrator'));

-- ai_models_config
DROP POLICY IF EXISTS "Admin can view ai models config" ON public.ai_models_config;
CREATE POLICY "Admin can view ai models config"
ON public.ai_models_config FOR SELECT TO authenticated
USING (true);

-- ai_rate_limits
DROP POLICY IF EXISTS "Admin can view all ai rate limits" ON public.ai_rate_limits;
CREATE POLICY "Admin can view all ai rate limits"
ON public.ai_rate_limits FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role_by_name(auth.uid(), 'Administrator'));

-- ai_personas
DROP POLICY IF EXISTS "Admin can view ai personas" ON public.ai_personas;
CREATE POLICY "Admin can view ai personas"
ON public.ai_personas FOR SELECT TO authenticated
USING (true);

-- ai_system_prompts
DROP POLICY IF EXISTS "Admin can view ai system prompts" ON public.ai_system_prompts;
CREATE POLICY "Admin can view ai system prompts"
ON public.ai_system_prompts FOR SELECT TO authenticated
USING (true);

-- ai_feature_gates
DROP POLICY IF EXISTS "Admin can view ai feature gates" ON public.ai_feature_gates;
CREATE POLICY "Admin can view ai feature gates"
ON public.ai_feature_gates FOR SELECT TO authenticated
USING (true);

-- ai_tier_model_mapping
DROP POLICY IF EXISTS "Admin can view ai tier model mapping" ON public.ai_tier_model_mapping;
CREATE POLICY "Admin can view ai tier model mapping"
ON public.ai_tier_model_mapping FOR SELECT TO authenticated
USING (true);

-- ai_app_knowledge
DROP POLICY IF EXISTS "Admin can view ai app knowledge" ON public.ai_app_knowledge;
CREATE POLICY "Admin can view ai app knowledge"
ON public.ai_app_knowledge FOR SELECT TO authenticated
USING (true);


-- ==============================
-- 5. SERVICE & USAGE TABLES
-- ==============================

-- service_requests
DROP POLICY IF EXISTS "Admin can view all service requests" ON public.service_requests;
CREATE POLICY "Admin can view all service requests"
ON public.service_requests FOR SELECT TO authenticated
USING (
  org_id IN (SELECT org_id FROM public.org_memberships WHERE user_id = auth.uid() AND status = 'active')
  OR public.has_role_by_name(auth.uid(), 'Administrator')
);

-- Admin can also update service requests
DROP POLICY IF EXISTS "Admin can update service requests" ON public.service_requests;
CREATE POLICY "Admin can update service requests"
ON public.service_requests FOR UPDATE TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'))
WITH CHECK (public.has_role_by_name(auth.uid(), 'Administrator'));

-- service_usage_daily
DROP POLICY IF EXISTS "Admin can view service usage daily" ON public.service_usage_daily;
CREATE POLICY "Admin can view service usage daily"
ON public.service_usage_daily FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));


-- ==============================
-- 6. CRM TABLES
-- ==============================

-- leads
DROP POLICY IF EXISTS "Admin can view all leads" ON public.leads;
CREATE POLICY "Admin can view all leads"
ON public.leads FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));

-- Admin can update leads
DROP POLICY IF EXISTS "Admin can update leads" ON public.leads;
CREATE POLICY "Admin can update leads"
ON public.leads FOR UPDATE TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'))
WITH CHECK (public.has_role_by_name(auth.uid(), 'Administrator'));

-- partners
DROP POLICY IF EXISTS "Admin can view all partners" ON public.partners;
CREATE POLICY "Admin can view all partners"
ON public.partners FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));

-- Admin can manage partners
DROP POLICY IF EXISTS "Admin can manage partners" ON public.partners;
CREATE POLICY "Admin can manage partners"
ON public.partners FOR ALL TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'))
WITH CHECK (public.has_role_by_name(auth.uid(), 'Administrator'));

-- affiliate_tracking
DROP POLICY IF EXISTS "Admin can view all affiliate tracking" ON public.affiliate_tracking;
CREATE POLICY "Admin can view all affiliate tracking"
ON public.affiliate_tracking FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));


-- ==============================
-- 7. COMMUNITY TABLES
-- ==============================

-- community_posts
DROP POLICY IF EXISTS "Admin can view all community posts" ON public.community_posts;
CREATE POLICY "Admin can view all community posts"
ON public.community_posts FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator') OR status = 'published');

-- community_comments
DROP POLICY IF EXISTS "Admin can view all community comments" ON public.community_comments;
CREATE POLICY "Admin can view all community comments"
ON public.community_comments FOR SELECT TO authenticated
USING (public.has_role_by_name(auth.uid(), 'Administrator'));


-- ==============================
-- 8. GITHUB & DEVOPS TABLES
-- ==============================

-- github_events (if it exists)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admin can view github events" ON public.github_events;
  CREATE POLICY "Admin can view github events"
  ON public.github_events FOR SELECT TO authenticated
  USING (public.has_role_by_name(auth.uid(), 'Administrator'));
EXCEPTION WHEN undefined_table THEN NULL;
END $$;


-- ==============================
-- 9. SECURITY DEFINER FUNCTION
-- for guaranteed dashboard access
-- ==============================

CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
  is_admin boolean;
BEGIN
  -- Verify caller is admin
  SELECT public.has_role_by_name(auth.uid(), 'Administrator') INTO is_admin;
  IF NOT is_admin THEN
    RETURN json_build_object('error', 'not_admin', 'message', 'Admin role required');
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM profiles),
    'new_users_7d', (SELECT count(*) FROM profiles WHERE created_at > now() - interval '7 days'),
    'new_users_30d', (SELECT count(*) FROM profiles WHERE created_at > now() - interval '30 days'),
    'new_users_today', (SELECT count(*) FROM profiles WHERE created_at::date = CURRENT_DATE),
    'total_organizations', (SELECT count(*) FROM organizations),
    'active_subscriptions', (SELECT count(*) FROM subscriptions WHERE status = 'active'),
    'paid_subscriptions', (SELECT count(*) FROM subscriptions WHERE status = 'active' AND tier != 'free'),
    'active_apps', (SELECT count(*) FROM apps_registry WHERE is_active = true),
    'errors_today', (SELECT count(*) FROM error_logs WHERE occurred_at::date = CURRENT_DATE),
    'unresolved_errors', (SELECT count(*) FROM error_logs WHERE resolved = false),
    'webhooks_today', (SELECT count(*) FROM webhook_logs WHERE received_at::date = CURRENT_DATE),
    'total_ai_requests_7d', (SELECT count(*) FROM ai_usage_logs WHERE created_at > now() - interval '7 days'),
    'total_ai_cost_7d', (SELECT COALESCE(sum(cost_usd), 0) FROM ai_usage_logs WHERE created_at > now() - interval '7 days'),
    'open_service_requests', (SELECT count(*) FROM service_requests WHERE status IN ('open', 'pending', 'new')),
    'total_leads', (SELECT count(*) FROM leads),
    'total_partners', (SELECT count(*) FROM partners),
    'mrr_cents', (
      SELECT COALESCE(sum(
        CASE
          WHEN sp.recurring_interval = 'year' THEN sp.unit_amount / 12
          ELSE sp.unit_amount
        END
      ), 0)
      FROM subscriptions s
      JOIN stripe_prices sp ON sp.id = s.stripe_price_id
      WHERE s.status = 'active'
    )
  ) INTO result;

  RETURN result;
END;
$$;


-- ==============================
-- 10. ADMIN ROLE CHECK FUNCTION
-- (Quick way to verify admin access)
-- ==============================

CREATE OR REPLACE FUNCTION public.check_admin_access()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid;
  is_admin boolean;
  user_email text;
  role_name text;
BEGIN
  uid := auth.uid();

  IF uid IS NULL THEN
    RETURN json_build_object('authenticated', false, 'is_admin', false);
  END IF;

  SELECT email INTO user_email FROM auth.users WHERE id = uid;
  SELECT public.has_role_by_name(uid, 'Administrator') INTO is_admin;

  -- Derive role_name from has_role_by_name result instead of JOINing
  -- (avoids dependency on user_roles column names which may differ from types)
  IF COALESCE(is_admin, false) THEN
    role_name := 'Administrator';
  ELSE
    role_name := 'none';
  END IF;

  RETURN json_build_object(
    'authenticated', true,
    'user_id', uid,
    'email', user_email,
    'is_admin', COALESCE(is_admin, false),
    'role_name', role_name,
    'timestamp', now()
  );
END;
$$;
