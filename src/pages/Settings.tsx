import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { Building2, Bell, Shield, Palette, Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Einstellungen gespeichert',
      description: 'Ihre Änderungen wurden erfolgreich übernommen.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground">Verwalten Sie Ihre Plattform-Einstellungen</p>
        </div>

        <div className="grid gap-6">
          {/* Company Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Unternehmensdaten</CardTitle>
              </div>
              <CardDescription>Grundlegende Informationen zu Ihrem Unternehmen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firmenname</Label>
                  <Input id="companyName" defaultValue="Fintutto GmbH" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Kontakt-E-Mail</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://fintutto.de" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support">Support-E-Mail</Label>
                  <Input id="support" type="email" defaultValue="support@fintutto.de" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Erscheinungsbild</CardTitle>
              </div>
              <CardDescription>Passen Sie das Aussehen der Plattform an</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Aktivieren Sie den dunklen Modus für die Oberfläche</p>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Kompakte Ansicht</Label>
                  <p className="text-sm text-muted-foreground">Reduzieren Sie den Abstand zwischen Elementen</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Benachrichtigungen</CardTitle>
              </div>
              <CardDescription>Konfigurieren Sie Ihre Benachrichtigungseinstellungen</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>E-Mail-Benachrichtigungen</Label>
                  <p className="text-sm text-muted-foreground">Erhalten Sie wichtige Updates per E-Mail</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Neue Anmeldungen</Label>
                  <p className="text-sm text-muted-foreground">Benachrichtigung bei neuen Benutzerregistrierungen</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Umsatzberichte</Label>
                  <p className="text-sm text-muted-foreground">Wöchentliche Umsatzübersicht per E-Mail</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Sicherheit</CardTitle>
              </div>
              <CardDescription>Sicherheitseinstellungen für Ihr Konto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Zwei-Faktor-Authentifizierung</Label>
                  <p className="text-sm text-muted-foreground">Zusätzliche Sicherheit für Ihr Konto</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session-Timeout</Label>
                  <p className="text-sm text-muted-foreground">Automatische Abmeldung nach Inaktivität</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Passwort ändern</Label>
                <div className="flex gap-2">
                  <Input type="password" placeholder="Neues Passwort" className="max-w-xs" />
                  <Button variant="outline">Ändern</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            <Save className="mr-2 h-4 w-4" />
            Einstellungen speichern
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
