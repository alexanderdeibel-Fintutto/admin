import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Cpu, DollarSign, Zap, Users, Settings } from 'lucide-react';

export default function AICenter() {
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
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Keine Daten</p>
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
                  <p className="text-2xl font-bold">€0.00</p>
                  <p className="text-xs text-muted-foreground">Keine Daten</p>
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
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Keine Daten</p>
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
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Keine Daten</p>
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
            <Card>
              <CardContent className="p-12 text-center">
                <Cpu className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Token-Nutzung</h3>
                <p className="text-muted-foreground">
                  Token-Verbrauch wird angezeigt, sobald KI-Features genutzt werden.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <Card>
              <CardContent className="p-12 text-center">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Kostendaten</h3>
                <p className="text-muted-foreground">
                  Kosten werden erfasst, sobald KI-APIs genutzt werden.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine KI-Nutzer</h3>
                <p className="text-muted-foreground">
                  Top-Nutzer werden angezeigt, sobald KI-Features verwendet werden.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4">
            <Card>
              <CardContent className="p-12 text-center">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Rate Limits konfiguriert</h3>
                <p className="text-muted-foreground">
                  Rate Limits können nach der Einrichtung von KI-Features konfiguriert werden.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}