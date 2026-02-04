import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Euro, 
  TrendingUp, 
  Users, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  UserMinus,
  Plus,
  Send,
  FileText,
  RefreshCw
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useDashboardStats, useRecentActivity } from '@/hooks/useDashboardStats';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const revenueData = [
  { month: 'Jan', revenue: 4200, mrr: 3800 },
  { month: 'Feb', revenue: 4800, mrr: 4100 },
  { month: 'Mär', revenue: 5100, mrr: 4500 },
  { month: 'Apr', revenue: 4900, mrr: 4600 },
  { month: 'Mai', revenue: 5800, mrr: 5200 },
  { month: 'Jun', revenue: 6200, mrr: 5800 },
  { month: 'Jul', revenue: 7100, mrr: 6400 },
  { month: 'Aug', revenue: 7800, mrr: 7000 },
  { month: 'Sep', revenue: 8200, mrr: 7500 },
  { month: 'Okt', revenue: 8900, mrr: 8100 },
  { month: 'Nov', revenue: 9400, mrr: 8600 },
  { month: 'Dez', revenue: 10200, mrr: 9200 },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, refetch } = useDashboardStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('upgrade') || action.includes('Upgrade')) return <ArrowUpRight className="h-4 w-4 text-primary" />;
    if (action.includes('cancel') || action.includes('Kündigung')) return <ArrowDownRight className="h-4 w-4 text-destructive" />;
    if (action.includes('support') || action.includes('ticket')) return <Send className="h-4 w-4 text-chart-4" />;
    return <Users className="h-4 w-4 text-chart-2" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
            <p className="text-muted-foreground">
              Willkommen zurück! Hier ist die Übersicht Ihrer Plattform.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Aktualisieren
            </Button>
            <Button size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Bericht erstellen
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statsLoading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <KPICard
                title="MRR"
                value={formatCurrency(stats?.mrr || 0)}
                change={{ value: '+8.2%', trend: 'up' }}
                icon={TrendingUp}
              />
              <KPICard
                title="ARR"
                value={formatCurrency(stats?.arr || 0)}
                change={{ value: '+15.3%', trend: 'up' }}
                icon={CreditCard}
              />
              <KPICard
                title="Aktive Nutzer"
                value={String(stats?.totalUsers || 0)}
                change={{ value: '+4.3%', trend: 'up' }}
                icon={Users}
              />
              <KPICard
                title="Aktive Abos"
                value={String(stats?.activeSubscriptions || 0)}
                change={{ value: '+12.5%', trend: 'up' }}
                icon={Euro}
              />
              <KPICard
                title="Churn Rate"
                value={`${stats?.churnRate || 0}%`}
                change={{ value: '-0.4%', trend: 'up' }}
                icon={UserMinus}
              />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Umsatzentwicklung</CardTitle>
              <CardDescription>Monatlicher Umsatz & MRR der letzten 12 Monate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }}
                      formatter={(value) => [`€${value}`, '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Umsatz"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="mrr" 
                      stroke="hsl(var(--chart-2))" 
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      name="MRR"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Aktuelle Systemauslastung</CardDescription>
                </div>
                <Activity className="h-5 w-5 text-chart-2 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Gateway</span>
                  <Badge variant="default">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Datenbank</span>
                  <Badge variant="default">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auth Service</span>
                  <Badge variant="default">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Stripe Webhook</span>
                  <Badge variant="default">Aktiv</Badge>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-bold text-chart-2">99.9%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Letzte Aktivitäten</CardTitle>
              <CardDescription>Neueste Admin-Logs auf der Plattform</CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 6).map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          {getActivityIcon(activity.action)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.user_email || 'System'}</p>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {activity.created_at 
                          ? format(new Date(activity.created_at), 'dd.MM. HH:mm', { locale: de })
                          : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Keine Aktivitäten vorhanden
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Schnellaktionen</CardTitle>
              <CardDescription>Häufig verwendete Funktionen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">Neues Produkt</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Benutzer einladen</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs">Rabatt erstellen</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Bericht exportieren</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Send className="h-5 w-5" />
                  <span className="text-xs">Newsletter senden</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Activity className="h-5 w-5" />
                  <span className="text-xs">System-Check</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
