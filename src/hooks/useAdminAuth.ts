import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminAccessCheck {
  authenticated: boolean;
  user_id: string | null;
  email: string | null;
  is_admin: boolean;
  role_name: string;
  timestamp: string;
}

/**
 * Checks if current user has admin access via the SECURITY DEFINER function.
 * This bypasses RLS so it always returns accurate results.
 */
export function useAdminAccessCheck() {
  return useQuery({
    queryKey: ['admin-access-check'],
    queryFn: async (): Promise<AdminAccessCheck> => {
      const { data, error } = await supabase.rpc('check_admin_access');
      if (error) {
        console.error('[AdminAuth] check_admin_access RPC failed:', error.message);
        // Fallback: try has_role_by_name directly
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { authenticated: false, user_id: null, email: null, is_admin: false, role_name: 'none', timestamp: new Date().toISOString() };

        const { data: isAdmin } = await supabase.rpc('has_role_by_name', {
          _user_id: user.id,
          _role_name: 'Administrator',
        });

        return {
          authenticated: true,
          user_id: user.id,
          email: user.email || null,
          is_admin: !!isAdmin,
          role_name: isAdmin ? 'Administrator' : 'unknown',
          timestamp: new Date().toISOString(),
        };
      }
      return data as unknown as AdminAccessCheck;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

interface AdminStats {
  total_users: number;
  new_users_7d: number;
  new_users_30d: number;
  new_users_today: number;
  total_organizations: number;
  active_subscriptions: number;
  paid_subscriptions: number;
  active_apps: number;
  errors_today: number;
  unresolved_errors: number;
  webhooks_today: number;
  total_ai_requests_7d: number;
  total_ai_cost_7d: number;
  open_service_requests: number;
  total_leads: number;
  total_partners: number;
  mrr_cents: number;
}

/**
 * Fetches comprehensive admin stats via SECURITY DEFINER RPC.
 * This bypasses RLS and always returns full data for admins.
 */
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats-rpc'],
    queryFn: async (): Promise<AdminStats | null> => {
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) {
        console.error('[AdminStats] get_admin_stats RPC failed:', error.message);
        return null;
      }
      if (data && typeof data === 'object' && 'error' in (data as any)) {
        console.warn('[AdminStats] Not admin:', (data as any).message);
        return null;
      }
      return data as unknown as AdminStats;
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
}
