import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, Users, Activity, Target, Calendar } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, FunnelChart, Funnel, LabelList
} from 'recharts';

const appUsageData = [
  { name: 'Mietrechner Pro', users: 847, sessions: 2341, avgTime: '12:34' },
  { name: 'Finanzplaner', users: 623, sessions: 1856, avgTime: '18:22' },
  { name: 'Steuer-Assistent', users: 412, sessions: 987, avgTime: '8:45' },
  { name: 'Portfolio Manager', users: 298, sessions: 756, avgTime: '15:12' },
  { name: 'Budget Tracker', users: 189, sessions: 423, avgTime: '6:30' },
];

const featureUsageData = [
  { feature: 'Dashboard', usage: 95, category: 'Core' },
  { feature: 'Berechnungen', usage: 87, category: 'Core' },
  { feature: 'Export PDF', usage: 72, category: 'Export' },
  { feature: 'KI-Assistent', usage: 68, category: 'AI' },
  { feature: 'Datenimport', usage: 54, category: 'Data' },
  { feature: 'API Zugang', usage: 31, category: 'Developer' },
  { feature: 'Team-Features', usage: 28, category: 'Collaboration' },
  { feature: 'Automatisierung', usage: 22, category: 'Advanced' },
];

const conversionFunnel = [
  { name: 'Website-Besucher', value: 10000, fill: 'hsl(var(--chart-1))' },
  { name: 'Registrierungen', value: 2500, fill: 'hsl(var(--chart-2))' },
  { name: 'Free Trial', value: 1800, fill: 'hsl(var(--chart-3))' },
  { name: 'Paid Conversion', value: 450, fill: 'hsl(var(--chart-4))' },
  { name: 'Pro/Enterprise', value: 120, fill: 'hsl(var(--primary))' },
];

const retentionData = [
  { week: 'Woche 1', retention: 100 },
  { week: 'Woche 2', retention: 78 },
  { week: 'Woche 3', retention: 65 },
  { week: 'Woche 4', retention: 58 },
  { week: 'Woche 5', retention: 52 },
  { week: 'Woche 6', retention: 48 },
  { week: 'Woche 7', retention: 45 },
  { week: 'Woche 8', retention: 43 },
];

const monthlyActiveUsers = [
  { month: 'Jan', mau: 1200, dau: 340 },
  { month: 'Feb', mau: 1350, dau: 380 },
  { month: 'Mär', mau: 1480, dau: 420 },
  { month: 'Apr', mau: 1520, dau: 450 },
  { month: 'Mai', mau: 1680, dau: 510 },
  { month: 'Jun', mau: 1750, dau: 540 },
  { month: 'Jul', mau: 1847, dau: 580 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--primary))'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Usage</h1>
            <p className="text-muted-foreground">Detaillierte Einblicke in die Plattformnutzung</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Letzte 7 Tage</SelectItem>
                <SelectItem value="30d">Letzte 30 Tage</SelectItem>
                <SelectItem value="90d">Letzte 90 Tage</SelectItem>
                <SelectItem value="12m">Letztes Jahr</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">MAU</p>
                  <p className="text-2xl font-bold">1.847</p>
                  <p className="text-xs text-chart-2">+5.5% vs. Vormonat</p>
                </div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">DAU</p>
                  <p className="text-2xl font-bold">580</p>
                  <p className="text-xs text-chart-2">+7.4% vs. Vormonat</p>
                </div>
                <Activity className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Session</p>
                  <p className="text-2xl font-bold">12:34</p>
                  <p className="text-xs text-chart-2">+2:15 vs. Vormonat</p>
                </div>
                <Target className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion</p>
                  <p className="text-2xl font-bold">4.5%</p>
                  <p className="text-xs text-chart-2">+0.8% vs. Vormonat</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usage">App-Nutzung</TabsTrigger>
            <TabsTrigger value="features">Feature-Usage</TabsTrigger>
            <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nutzer nach App</CardTitle>
                  <CardDescription>Aktive Nutzer pro Produkt</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={appUsageData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" className="text-xs" />
                        <YAxis dataKey="name" type="category" className="text-xs" width={120} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                          }}
                        />
                        <Bar dataKey="users" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>MAU vs DAU Trend</CardTitle>
                  <CardDescription>Monatlich aktive vs. täglich aktive Nutzer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyActiveUsers}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                          }}
                        />
                        <Area type="monotone" dataKey="mau" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name="MAU" />
                        <Area type="monotone" dataKey="dau" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.2} name="DAU" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>App-Übersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appUsageData.map((app, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-sm text-muted-foreground">{app.sessions} Sessions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{app.users} Nutzer</p>
                          <p className="text-sm text-muted-foreground">Ø {app.avgTime} min</p>
                        </div>
                        <Badge variant="outline">{Math.round(app.users / 18.47)}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature-Usage Heatmap</CardTitle>
                <CardDescription>Nutzungsintensität der verschiedenen Features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {featureUsageData.map((item, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg border transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: `hsl(var(--primary) / ${item.usage / 100 * 0.3})`,
                        borderColor: `hsl(var(--primary) / ${item.usage / 100})`
                      }}
                    >
                      <p className="font-medium text-sm">{item.feature}</p>
                      <p className="text-2xl font-bold">{item.usage}%</p>
                      <Badge variant="outline" className="mt-1 text-xs">{item.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Von Website-Besuch bis Premium-Kunde</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnel.map((step, index) => {
                    const prevValue = index > 0 ? conversionFunnel[index - 1].value : step.value;
                    const convRate = ((step.value / prevValue) * 100).toFixed(1);
                    const totalRate = ((step.value / conversionFunnel[0].value) * 100).toFixed(1);
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{step.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="font-bold">{step.value.toLocaleString()}</span>
                            {index > 0 && (
                              <Badge variant="outline">{convRate}% vom Vorschritt</Badge>
                            )}
                          </div>
                        </div>
                        <div className="h-8 rounded-lg overflow-hidden bg-muted">
                          <div 
                            className="h-full rounded-lg transition-all"
                            style={{ 
                              width: `${totalRate}%`,
                              backgroundColor: step.fill
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retention" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Retention Analyse</CardTitle>
                <CardDescription>Nutzer-Bindung über 8 Wochen</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={retentionData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="week" className="text-xs" />
                      <YAxis className="text-xs" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                        formatter={(value) => [`${value}%`, 'Retention']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="retention" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Woche 1</p>
                    <p className="text-xl font-bold">100%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Woche 4</p>
                    <p className="text-xl font-bold">58%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Woche 8</p>
                    <p className="text-xl font-bold">43%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
