import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Euro, 
  TrendingUp, 
  Users, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 4800 },
  { month: 'Mär', revenue: 5100 },
  { month: 'Apr', revenue: 4900 },
  { month: 'Mai', revenue: 5800 },
  { month: 'Jun', revenue: 6200 },
  { month: 'Jul', revenue: 7100 },
];

const subscriptionData = [
  { name: 'Free', count: 847 },
  { name: 'Basic', count: 312 },
  { name: 'Pro', count: 156 },
  { name: 'Enterprise', count: 23 },
];

const recentActivity = [
  { user: 'max.mueller@example.com', action: 'Upgrade auf Pro', time: 'vor 5 Min.' },
  { user: 'lisa.schmidt@example.com', action: 'Neues Abo (Basic)', time: 'vor 23 Min.' },
  { user: 'peter.weber@example.com', action: 'Kündigung', time: 'vor 1 Std.' },
  { user: 'anna.braun@example.com', action: 'Neues Abo (Free)', time: 'vor 2 Std.' },
  { user: 'thomas.fischer@example.com', action: 'Upgrade auf Enterprise', time: 'vor 3 Std.' },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Willkommen zurück! Hier ist die Übersicht Ihrer Plattform.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Gesamtumsatz"
            value="€47.234"
            change={{ value: '+12.5%', trend: 'up' }}
            icon={Euro}
          />
          <KPICard
            title="MRR"
            value="€7.100"
            change={{ value: '+8.2%', trend: 'up' }}
            icon={TrendingUp}
          />
          <KPICard
            title="Aktive Nutzer"
            value="1.338"
            change={{ value: '+4.3%', trend: 'up' }}
            icon={Users}
          />
          <KPICard
            title="Aktive Abos"
            value="491"
            change={{ value: '-2.1%', trend: 'down' }}
            icon={CreditCard}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Umsatzentwicklung</CardTitle>
              <CardDescription>Monatlicher Umsatz der letzten 7 Monate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }}
                      formatter={(value) => [`€${value}`, 'Umsatz']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Abonnements nach Typ</CardTitle>
              <CardDescription>Verteilung der aktiven Abonnements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }}
                      formatter={(value) => [value, 'Nutzer']}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Letzte Aktivitäten</CardTitle>
            <CardDescription>Neueste Benutzeraktionen auf der Plattform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      {activity.action.includes('Upgrade') && (
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      )}
                      {activity.action.includes('Kündigung') && (
                        <ArrowDownRight className="h-4 w-4 text-destructive" />
                      )}
                      {activity.action.includes('Neues') && (
                        <Users className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
