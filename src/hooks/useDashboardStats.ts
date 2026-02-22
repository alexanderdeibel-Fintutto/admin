import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  mrr: number;
  arr: number;
  churnRate: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Fetch total users
      const { count: totalUsers, error: profilesErr } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (profilesErr) console.warn('[DashboardStats] profiles:', profilesErr.message);

      // Fetch active subscriptions with MRR calculation
      const { data: subscriptions, error: subsErr } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('status', 'active');
      if (subsErr) console.warn('[DashboardStats] subscriptions:', subsErr.message);

      // Fetch prices for MRR calculation
      const { data: prices, error: pricesErr } = await supabase
        .from('stripe_prices')
        .select('*');
      if (pricesErr) console.warn('[DashboardStats] stripe_prices:', pricesErr.message);

      // Calculate MRR from active subscriptions
      let mrr = 0;
      if (subscriptions && prices) {
        subscriptions.forEach(sub => {
          const price = prices.find(p => p.id === sub.stripe_price_id);
          if (price?.unit_amount) {
            const monthlyAmount = price.recurring_interval === 'year'
              ? price.unit_amount / 12
              : price.unit_amount;
            mrr += monthlyAmount / 100; // Convert cents to euros
          }
        });
      }

      // Fetch cancelled subscriptions for churn rate
      const { count: cancelledCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .not('cancelled_at', 'is', null);

      const totalSubs = subscriptions?.length || 1;
      const churnRate = ((cancelledCount || 0) / (totalSubs + (cancelledCount || 0))) * 100;

      return {
        totalUsers: totalUsers || 0,
        activeSubscriptions: subscriptions?.length || 0,
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(mrr * 12 * 100) / 100,
        churnRate: Math.round(churnRate * 10) / 10,
      };
    },
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      // Try v_recent_activity view first (may have SECURITY DEFINER)
      const { data: viewData, error: viewErr } = await supabase
        .from('v_recent_activity' as any)
        .select('*')
        .order('activity_time', { ascending: false })
        .limit(10);

      if (!viewErr && viewData && viewData.length > 0) {
        return viewData.map((a: any) => ({
          id: a.entity_id || Math.random().toString(),
          action: a.description || a.activity_type || '',
          user_email: a.details?.user_email || 'System',
          created_at: a.activity_time,
        }));
      }

      // Fallback to admin_logs table
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) console.warn('[RecentActivity] admin_logs:', error.message);

      return data || [];
    },
  });
}

export function useErrorStats() {
  return useQuery({
    queryKey: ['error-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(50);
      if (error) console.warn('[ErrorStats] error_logs:', error.message);

      return data || [];
    },
  });
}
