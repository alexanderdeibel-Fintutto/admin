import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/use-toast';
import { Building2, Bell, Palette, Save, Mail, Webhook, Key, Users, Plus, Pencil, Trash2, Copy, Eye, EyeOff } from 'lucide-react';

const mockTeam = [
  { id: '1', name: 'Max Müller', email: 'max@fintutto.de', role: 'owner', status: 'active' },
  { id: '2', name: 'Lisa Schmidt', email: 'lisa@fintutto.de', role: 'admin', status: 'active' },
  { id: '3', name: 'Peter Weber', email: 'peter@fintutto.de', role: 'editor', status: 'active' },
];

const mockAPIKeys = [
  { id: '1', name: 'Production API', key: 'fnt_prod_xxxxxxxxxxxx', created: '01.01.2024', lastUsed: 'vor 5 Min.', permissions: ['read', 'write'] },
  { id: '2', name: 'Development', key: 'fnt_dev_xxxxxxxxxxxx', created: '15.01.2024', lastUsed: 'vor 2 Std.', permissions: ['read'] },
];

const mockWebhooks = [
  { id: '1', url: 'https://api.example.com/webhooks', events: ['user.created'], active: true, lastTriggered: 'vor 1 Std.' },
];

const emailTemplates = [
  { id: 'welcome', name: 'Willkommens-E-Mail', subject: 'Willkommen bei Fintutto!', active: true },
  { id: 'password_reset', name: 'Passwort zurücksetzen', subject: 'Ihr Passwort zurücksetzen', active: true },
  { id: 'invoice', name: 'Rechnung', subject: 'Ihre Rechnung', active: true },
];

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [showKey, setShowKey] = useState<string | null>(null);

  const handleSave = () => {
    toast({ title: 'Einstellungen gespeichert', description: 'Ihre Änderungen wurden übernommen.' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Kopiert!' });
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
                <div className="space-y-2"><Label>Firmenname</Label><Input defaultValue="Fintutto GmbH" /></div>
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
              <CardHeader><div className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /><CardTitle>E-Mail Templates (Brevo)</CardTitle></div></CardHeader>
              <CardContent className="space-y-4">
                {emailTemplates.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div><p className="font-medium">{t.name}</p><p className="text-sm text-muted-foreground">{t.subject}</p></div>
                    <div className="flex gap-2"><Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button><Switch checked={t.active} /></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card>
              <CardHeader><div className="flex items-center gap-2"><Webhook className="h-5 w-5 text-primary" /><CardTitle>Webhooks</CardTitle></div></CardHeader>
              <CardContent className="space-y-4">
                {mockWebhooks.map(w => (
                  <div key={w.id} className="p-4 border rounded-lg">
                    <code className="text-sm">{w.url}</code>
                    <div className="flex gap-2 mt-2">{w.events.map(e => <Badge key={e} variant="outline">{e}</Badge>)}</div>
                  </div>
                ))}
                <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Neuer Webhook</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader><div className="flex items-center gap-2"><Key className="h-5 w-5 text-primary" /><CardTitle>API-Keys</CardTitle></div></CardHeader>
              <CardContent className="space-y-4">
                {mockAPIKeys.map(k => (
                  <div key={k.id} className="p-4 border rounded-lg">
                    <p className="font-medium">{k.name}</p>
                    <div className="flex items-center gap-2 mt-2 bg-muted p-2 rounded">
                      <code className="flex-1 text-sm">{showKey === k.id ? k.key : '••••••••••••'}</code>
                      <Button variant="ghost" size="icon" onClick={() => setShowKey(showKey === k.id ? null : k.id)}>{showKey === k.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(k.key)}><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Neuer API-Key</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader><div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><CardTitle>Team & Rollen</CardTitle></div></CardHeader>
              <CardContent className="space-y-4">
                {mockTeam.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">{m.name.split(' ').map(n => n[0]).join('')}</div>
                      <div><p className="font-medium">{m.name}</p><p className="text-sm text-muted-foreground">{m.email}</p></div>
                    </div>
                    <Badge variant={m.role === 'owner' ? 'default' : 'outline'}>{m.role}</Badge>
                  </div>
                ))}
                <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Mitglied einladen</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
