import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { Building2, Palette, Save, Mail, Webhook, Key, Users, Plus } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: 'Einstellungen gespeichert', description: 'Ihre Änderungen wurden übernommen.' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihre Plattform-Einstellungen</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Allgemein</TabsTrigger>
            <TabsTrigger value="email">E-Mail Templates</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="api">API-Keys</TabsTrigger>
            <TabsTrigger value="team">Team & Rollen</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /><CardTitle>Unternehmensdaten</CardTitle></div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Firmenname</Label><Input placeholder="Ihr Firmenname" /></div>
                <div className="space-y-2"><Label>E-Mail</Label><Input defaultValue={user?.email || ''} /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><div className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /><CardTitle>Erscheinungsbild</CardTitle></div></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div><Label>Dark Mode</Label><p className="text-sm text-muted-foreground">Dunklen Modus aktivieren</p></div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end"><Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Speichern</Button></div>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader><div className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /><CardTitle>E-Mail Templates</CardTitle></div></CardHeader>
              <CardContent className="p-12 text-center">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine E-Mail Templates</h3>
                <p className="text-muted-foreground mb-4">
                  E-Mail Templates werden angezeigt, sobald ein E-Mail-Dienst (z.B. Brevo) konfiguriert ist.
                </p>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Template erstellen
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card>
              <CardHeader><div className="flex items-center gap-2"><Webhook className="h-5 w-5 text-primary" /><CardTitle>Webhooks</CardTitle></div></CardHeader>
              <CardContent className="p-12 text-center">
                <Webhook className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Webhooks</h3>
                <p className="text-muted-foreground mb-4">
                  Webhooks ermöglichen es, externe Systeme über Ereignisse zu benachrichtigen.
                </p>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Neuer Webhook
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader><div className="flex items-center gap-2"><Key className="h-5 w-5 text-primary" /><CardTitle>API-Keys</CardTitle></div></CardHeader>
              <CardContent className="p-12 text-center">
                <Key className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine API-Keys</h3>
                <p className="text-muted-foreground mb-4">
                  API-Keys ermöglichen den programmatischen Zugriff auf Ihre Daten.
                </p>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Neuer API-Key
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader><div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><CardTitle>Team & Rollen</CardTitle></div></CardHeader>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Team-Mitglieder</h3>
                <p className="text-muted-foreground mb-4">
                  Laden Sie Team-Mitglieder ein, um gemeinsam an der Plattform zu arbeiten.
                </p>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Mitglied einladen
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}