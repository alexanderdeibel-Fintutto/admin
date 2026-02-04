import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, Users, Activity, Target, Calendar, BarChart3 } from 'lucide-react';

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
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Keine Daten</p>
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
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Keine Daten</p>
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
                  <p className="text-2xl font-bold">--:--</p>
                  <p className="text-xs text-muted-foreground">Keine Daten</p>
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
                  <p className="text-2xl font-bold">0%</p>
                  <p className="text-xs text-muted-foreground">Keine Daten</p>
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
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Nutzungsdaten</h3>
                <p className="text-muted-foreground">
                  Analytics-Daten werden angezeigt, sobald Nutzer die Plattform verwenden.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Feature-Daten</h3>
                <p className="text-muted-foreground">
                  Feature-Usage wird erfasst, sobald Nutzer Features verwenden.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnel" className="space-y-4">
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Kein Conversion-Funnel</h3>
                <p className="text-muted-foreground">
                  Funnel-Daten werden verfügbar, sobald Conversions stattfinden.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retention" className="space-y-4">
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Retention-Daten</h3>
                <p className="text-muted-foreground">
                  Retention-Analysen werden verfügbar, sobald genügend Nutzer-Aktivitäten vorhanden sind.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}