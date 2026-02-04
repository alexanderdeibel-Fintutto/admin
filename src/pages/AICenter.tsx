import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot, Cpu, DollarSign, Zap, Users, TrendingUp, Settings, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const tokenUsageData = [
  { date: '01.01', tokens: 125000, cost: 2.50 },
  { date: '02.01', tokens: 189000, cost: 3.78 },
  { date: '03.01', tokens: 156000, cost: 3.12 },
  { date: '04.01', tokens: 234000, cost: 4.68 },
  { date: '05.01', tokens: 198000, cost: 3.96 },
  { date: '06.01', tokens: 267000, cost: 5.34 },
  { date: '07.01', tokens: 312000, cost: 6.24 },
];

const modelUsage = [
  { model: 'GPT-4', tokens: 1250000, percentage: 45, cost: 37.50 },
  { model: 'GPT-3.5', tokens: 980000, percentage: 35, cost: 1.96 },
  { model: 'Claude-3', tokens: 420000, percentage: 15, cost: 6.30 },
  { model: 'Custom', tokens: 140000, percentage: 5, cost: 0.70 },
];

const topUsers = [
  { email: 'power.user@example.com', tokens: 234000, requests: 1234, plan: 'Enterprise' },
  { email: 'heavy.usage@example.com', tokens: 198000, requests: 987, plan: 'Pro' },
  { email: 'analyst@example.com', tokens: 156000, requests: 756, plan: 'Pro' },
  { email: 'developer@example.com', tokens: 123000, requests: 543, plan: 'Enterprise' },
  { email: 'researcher@example.com', tokens: 98000, requests: 432, plan: 'Basic' },
];

const rateLimits = [
  { tier: 'Free', requestsPerMin: 10, tokensPerDay: 10000, concurrent: 1 },
  { tier: 'Basic', requestsPerMin: 30, tokensPerDay: 50000, concurrent: 3 },
  { tier: 'Pro', requestsPerMin: 60, tokensPerDay: 200000, concurrent: 5 },
  { tier: 'Enterprise', requestsPerMin: 200, tokensPerDay: 1000000, concurrent: 20 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function AICenter() {
  const [editingLimit, setEditingLimit] = useState<typeof rateLimits[0] | null>(null);

  const totalTokens = tokenUsageData.reduce((sum, d) => sum + d.tokens, 0);
  const totalCost = tokenUsageData.reduce((sum, d) => sum + d.cost, 0);
  const avgTokensPerDay = Math.round(totalTokens / tokenUsageData.length);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">KI-Center</h1>
            <p className="text-muted-foreground">Überwachen Sie KI-Nutzung, Kosten und Rate Limits</p>
          </div>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            KI-Einstellungen
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tokens (7 Tage)</p>
                  <p className="text-2xl font-bold">{(totalTokens / 1000000).toFixed(2)}M</p>
                  <p className="text-xs text-chart-2">+18% vs. Vorwoche</p>
                </div>
                <Cpu className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kosten (7 Tage)</p>
                  <p className="text-2xl font-bold">€{totalCost.toFixed(2)}</p>
                  <p className="text-xs text-chart-2">Ø €{(totalCost / 7).toFixed(2)}/Tag</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Requests</p>
                  <p className="text-2xl font-bold">12.4K</p>
                  <p className="text-xs text-chart-2">+5.2% vs. Vorwoche</p>
                </div>
                <Zap className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktive KI-Nutzer</p>
                  <p className="text-2xl font-bold">847</p>
                  <p className="text-xs text-muted-foreground">45.8% aller Nutzer</p>
                </div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usage">Token-Verbrauch</TabsTrigger>
            <TabsTrigger value="costs">Kosten-Übersicht</TabsTrigger>
            <TabsTrigger value="users">Top-Nutzer</TabsTrigger>
            <TabsTrigger value="limits">Rate Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Token-Verbrauch (7 Tage)</CardTitle>
                  <CardDescription>Täglicher Token-Verbrauch über alle Modelle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tokenUsageData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000}k`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                          }}
                          formatter={(value: number) => [`${(value / 1000).toFixed(0)}k Tokens`, 'Verbrauch']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="tokens" 
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
                  <CardTitle>Modell-Verteilung</CardTitle>
                  <CardDescription>Token-Nutzung nach KI-Modell</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={modelUsage}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="percentage"
                          nameKey="model"
                          label={({ model, percentage }) => `${model}: ${percentage}%`}
                        >
                          {modelUsage.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Modell-Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelUsage.map((model, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                          <span className="font-medium">{model.model}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{(model.tokens / 1000000).toFixed(2)}M Tokens</span>
                          <Badge variant="outline">€{model.cost.toFixed(2)}</Badge>
                        </div>
                      </div>
                      <Progress value={model.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Kostenentwicklung</CardTitle>
                <CardDescription>Tägliche KI-Kosten in Euro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tokenUsageData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(v) => `€${v}`} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                        formatter={(value: number) => [`€${value.toFixed(2)}`, 'Kosten']}
                      />
                      <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">Geschätzt (Monat)</p>
                  <p className="text-3xl font-bold">€{(totalCost / 7 * 30).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">basierend auf 7-Tage-Durchschnitt</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">Kosten pro Nutzer</p>
                  <p className="text-3xl font-bold">€{(totalCost / 847).toFixed(3)}</p>
                  <p className="text-xs text-muted-foreground">pro aktivem KI-Nutzer</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">Kosten pro 1K Tokens</p>
                  <p className="text-3xl font-bold">€{((totalCost / totalTokens) * 1000).toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">Durchschnitt alle Modelle</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top KI-Nutzer</CardTitle>
                <CardDescription>Nutzer mit dem höchsten Token-Verbrauch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.requests.toLocaleString()} Requests</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{(user.tokens / 1000).toFixed(0)}K Tokens</p>
                          <p className="text-sm text-muted-foreground">≈ €{(user.tokens * 0.00002).toFixed(2)}</p>
                        </div>
                        <Badge variant={user.plan === 'Enterprise' ? 'default' : user.plan === 'Pro' ? 'secondary' : 'outline'}>
                          {user.plan}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rate Limits nach Tier</CardTitle>
                <CardDescription>Konfigurieren Sie die API-Limits für jeden Abonnement-Typ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {rateLimits.map((limit, index) => (
                    <Card key={index} className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{limit.tier}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Requests/Min</span>
                          <span className="font-medium">{limit.requestsPerMin}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tokens/Tag</span>
                          <span className="font-medium">{(limit.tokensPerDay / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Concurrent</span>
                          <span className="font-medium">{limit.concurrent}</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full mt-2">
                              Bearbeiten
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rate Limits: {limit.tier}</DialogTitle>
                              <DialogDescription>Passen Sie die Limits für diesen Tier an</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label>Requests pro Minute</Label>
                                <Input type="number" defaultValue={limit.requestsPerMin} />
                              </div>
                              <div className="grid gap-2">
                                <Label>Tokens pro Tag</Label>
                                <Input type="number" defaultValue={limit.tokensPerDay} />
                              </div>
                              <div className="grid gap-2">
                                <Label>Gleichzeitige Anfragen</Label>
                                <Input type="number" defaultValue={limit.concurrent} />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Abbrechen</Button>
                              <Button>Speichern</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  <div>
                    <p className="font-medium">Rate Limit Warnungen</p>
                    <p className="text-sm text-muted-foreground">3 Nutzer haben heute 80% ihres Limits erreicht</p>
                  </div>
                  <Button variant="outline" className="ml-auto">Details anzeigen</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
