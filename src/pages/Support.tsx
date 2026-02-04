import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, MessageSquare, Book, Search, Plus, Clock, CheckCircle } from 'lucide-react';

export default function Support() {
  const [search, setSearch] = useState('');
  const [isNewFAQOpen, setIsNewFAQOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Support & FAQ</h1>
            <p className="text-muted-foreground">Verwalten Sie Support-Tickets und die Wissensdatenbank</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Offene Tickets</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dringend</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-chart-2/10">
                  <CheckCircle className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Heute gelöst</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">FAQ Artikel</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tickets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="faq">FAQ / Knowledge Base</TabsTrigger>
            <TabsTrigger value="auto">Auto-Antworten</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tickets durchsuchen..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Tickets</h3>
                <p className="text-muted-foreground">
                  Support-Tickets werden hier angezeigt, sobald Kunden Anfragen stellen.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="FAQ durchsuchen..." className="pl-9" />
              </div>
              <Dialog open={isNewFAQOpen} onOpenChange={setIsNewFAQOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Neuer Artikel
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Neuer FAQ-Artikel</DialogTitle>
                    <DialogDescription>Erstellen Sie einen neuen Eintrag in der Wissensdatenbank</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Frage</Label>
                      <Input placeholder="Wie kann ich...?" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Kategorie</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Kategorie wählen" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="billing">Abrechnung</SelectItem>
                          <SelectItem value="technical">Technisch</SelectItem>
                          <SelectItem value="data">Daten</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Antwort</Label>
                      <Textarea rows={6} placeholder="Ausführliche Antwort..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewFAQOpen(false)}>Abbrechen</Button>
                    <Button>Veröffentlichen</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-12 text-center">
                <Book className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine FAQ-Artikel</h3>
                <p className="text-muted-foreground mb-4">
                  Erstellen Sie FAQ-Artikel, um häufige Fragen Ihrer Kunden zu beantworten.
                </p>
                <Button onClick={() => setIsNewFAQOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ersten Artikel erstellen
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Antworten</CardTitle>
                <CardDescription>Automatische Antworten basierend auf Schlüsselwörtern</CardDescription>
              </CardHeader>
              <CardContent className="p-12 text-center">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Keine Auto-Antworten</h3>
                <p className="text-muted-foreground mb-4">
                  Erstellen Sie automatische Antworten für häufige Anfragen.
                </p>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Neue Auto-Antwort
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}