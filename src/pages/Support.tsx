import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, MessageSquare, Book, Search, Plus, Pencil, Trash2, Clock, User, CheckCircle } from 'lucide-react';

type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Ticket {
  id: string;
  subject: string;
  user: string;
  status: TicketStatus;
  priority: TicketPriority;
  created: string;
  lastUpdate: string;
  category: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
  helpful: number;
}

const mockTickets: Ticket[] = [
  { id: 'T-001', subject: 'Kann meine Rechnung nicht herunterladen', user: 'max@example.com', status: 'open', priority: 'high', created: '15.01.2024', lastUpdate: 'vor 2 Std.', category: 'Abrechnung' },
  { id: 'T-002', subject: 'API Key funktioniert nicht', user: 'dev@example.com', status: 'in_progress', priority: 'urgent', created: '15.01.2024', lastUpdate: 'vor 30 Min.', category: 'Technisch' },
  { id: 'T-003', subject: 'Frage zur Datenmigration', user: 'enterprise@example.com', status: 'waiting', priority: 'medium', created: '14.01.2024', lastUpdate: 'vor 1 Tag', category: 'Onboarding' },
  { id: 'T-004', subject: 'Feature Request: Dark Mode in App', user: 'user@example.com', status: 'resolved', priority: 'low', created: '12.01.2024', lastUpdate: 'vor 3 Tagen', category: 'Feature Request' },
  { id: 'T-005', subject: 'Login Probleme nach Passwort-Reset', user: 'helpme@example.com', status: 'open', priority: 'high', created: '15.01.2024', lastUpdate: 'vor 1 Std.', category: 'Account' },
];

const mockFAQs: FAQItem[] = [
  { id: '1', question: 'Wie kann ich mein Passwort zurücksetzen?', answer: 'Klicken Sie auf der Login-Seite auf "Passwort vergessen". Sie erhalten dann eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts.', category: 'Account', views: 1234, helpful: 89 },
  { id: '2', question: 'Wie upgrade ich mein Abonnement?', answer: 'Gehen Sie zu Einstellungen > Abonnement und wählen Sie den gewünschten Plan. Die Änderung wird sofort wirksam und anteilig berechnet.', category: 'Abrechnung', views: 987, helpful: 76 },
  { id: '3', question: 'Kann ich meine Daten exportieren?', answer: 'Ja, unter Einstellungen > Daten > Export können Sie alle Ihre Daten als CSV oder JSON herunterladen.', category: 'Daten', views: 756, helpful: 65 },
  { id: '4', question: 'Wie funktioniert die API-Authentifizierung?', answer: 'Generieren Sie einen API-Key unter Einstellungen > API. Verwenden Sie diesen als Bearer Token in Ihren Anfragen.', category: 'Technisch', views: 543, helpful: 54 },
  { id: '5', question: 'Was passiert bei Kündigung mit meinen Daten?', answer: 'Nach Kündigung haben Sie 30 Tage Zeit, Ihre Daten zu exportieren. Danach werden alle Daten unwiderruflich gelöscht.', category: 'Account', views: 432, helpful: 43 },
];

const autoResponses = [
  { trigger: 'passwort', response: 'Für Passwort-Probleme: Nutzen Sie die "Passwort vergessen" Funktion auf der Login-Seite.' },
  { trigger: 'rechnung', response: 'Rechnungen finden Sie unter Einstellungen > Abrechnung > Rechnungshistorie.' },
  { trigger: 'kündigung', response: 'Zur Kündigung gehen Sie zu Einstellungen > Abonnement > Kündigen. Ihre Daten bleiben 30 Tage verfügbar.' },
  { trigger: 'api', response: 'API-Dokumentation: docs.fintutto.de/api - Bei Problemen prüfen Sie den API-Key und die Rate Limits.' },
];

export default function Support() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [faqs, setFaqs] = useState<FAQItem[]>(mockFAQs);
  const [search, setSearch] = useState('');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isNewFAQOpen, setIsNewFAQOpen] = useState(false);

  const getStatusBadge = (status: TicketStatus) => {
    const config: Record<TicketStatus, { variant: 'default' | 'secondary' | 'outline' | 'destructive', label: string }> = {
      open: { variant: 'destructive', label: 'Offen' },
      in_progress: { variant: 'default', label: 'In Bearbeitung' },
      waiting: { variant: 'outline', label: 'Warten auf Antwort' },
      resolved: { variant: 'secondary', label: 'Gelöst' }
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    const config: Record<TicketPriority, string> = {
      low: 'bg-gray-500',
      medium: 'bg-blue-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500'
    };
    return <Badge className={`${config[priority]} text-white`}>{priority.toUpperCase()}</Badge>;
  };

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const urgentTickets = tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length;

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
                  <p className="text-2xl font-bold">{openTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={urgentTickets > 0 ? 'border-destructive' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dringend</p>
                  <p className="text-2xl font-bold">{urgentTickets}</p>
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
                  <p className="text-2xl font-bold">12</p>
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
                  <p className="text-2xl font-bold">{faqs.length}</p>
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
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {tickets.filter(t => 
                    t.subject.toLowerCase().includes(search.toLowerCase()) ||
                    t.user.toLowerCase().includes(search.toLowerCase())
                  ).map((ticket) => (
                    <div key={ticket.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{ticket.id}</span>
                            {getPriorityBadge(ticket.priority)}
                            <Badge variant="outline">{ticket.category}</Badge>
                          </div>
                          <p className="font-medium">{ticket.subject}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {ticket.user}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {ticket.lastUpdate}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(ticket.status)}
                          <Button variant="outline" size="sm">Öffnen</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

            <div className="grid gap-4">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">{faq.category}</Badge>
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span>{faq.views} Aufrufe</span>
                      <span>{faq.helpful} fanden dies hilfreich</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="auto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Antworten</CardTitle>
                <CardDescription>Automatische Antworten basierend auf Schlüsselwörtern</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {autoResponses.map((response, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">Trigger: "{response.trigger}"</Badge>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{response.response}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Neue Auto-Antwort
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
