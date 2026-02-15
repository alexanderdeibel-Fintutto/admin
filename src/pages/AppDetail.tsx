import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Euro,
  Building2,
  Gauge,
  Users,
  LayoutGrid,
  Wrench,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  Server,
  Database,
  Shield,
  Globe,
  RefreshCw,
  Settings,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

interface AppConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  status: 'online' | 'maintenance' | 'offline';
  version: string;
  activeUsers: number;
  uptime: string;
  url: string;
  techStack: string[];
  database: string;
  lastDeployment: string;
  region: string;
  responseTime: string;
  errorRate: string;
  requestsPerDay: string;
  storageUsed: string;
  features: string[];
  endpoints: { name: string; status: 'healthy' | 'degraded' | 'down' }[];
  usageData: { day: string; requests: number; errors: number }[];
}

const appsConfig: Record<string, AppConfig> = {
  fintutto: {
    id: 'fintutto',
    name: 'Fintutto',
    description: 'Finanz-Dashboard & Buchhaltung',
    icon: Euro,
    iconColor: 'text-emerald-500 bg-emerald-500/10',
    status: 'online',
    version: '2.4.1',
    activeUsers: 1248,
    uptime: '99.9%',
    url: 'https://app.fintutto.com',
    techStack: ['React', 'TypeScript', 'Supabase', 'Stripe'],
    database: 'PostgreSQL (Supabase)',
    lastDeployment: '14.02.2026, 09:32',
    region: 'EU-West (Frankfurt)',
    responseTime: '142ms',
    errorRate: '0.02%',
    requestsPerDay: '45.200',
    storageUsed: '2.8 GB',
    features: ['Kontoübersicht', 'Buchungserfassung', 'Steuerberichte', 'Export-Funktionen', 'Multi-Währung'],
    endpoints: [
      { name: 'API Gateway', status: 'healthy' },
      { name: 'Auth Service', status: 'healthy' },
      { name: 'Payment Service', status: 'healthy' },
      { name: 'Reporting Engine', status: 'healthy' },
    ],
    usageData: [
      { day: 'Mo', requests: 6200, errors: 12 },
      { day: 'Di', requests: 7100, errors: 8 },
      { day: 'Mi', requests: 6800, errors: 15 },
      { day: 'Do', requests: 7400, errors: 6 },
      { day: 'Fr', requests: 6500, errors: 9 },
      { day: 'Sa', requests: 3200, errors: 3 },
      { day: 'So', requests: 2800, errors: 2 },
    ],
  },
  vermietify: {
    id: 'vermietify',
    name: 'Vermietify',
    description: 'Immobilienverwaltung & Mietmanagement',
    icon: Building2,
    iconColor: 'text-blue-500 bg-blue-500/10',
    status: 'online',
    version: '3.1.0',
    activeUsers: 856,
    uptime: '99.8%',
    url: 'https://vermietify.fintutto.com',
    techStack: ['React', 'TypeScript', 'Supabase', 'FinAPI'],
    database: 'PostgreSQL (Supabase)',
    lastDeployment: '13.02.2026, 16:45',
    region: 'EU-West (Frankfurt)',
    responseTime: '168ms',
    errorRate: '0.05%',
    requestsPerDay: '32.800',
    storageUsed: '5.1 GB',
    features: ['Objektverwaltung', 'Mietverträge', 'Nebenkostenabrechnung', 'Dokumentenmanagement', 'Mieter-Kommunikation'],
    endpoints: [
      { name: 'API Gateway', status: 'healthy' },
      { name: 'Auth Service', status: 'healthy' },
      { name: 'Document Service', status: 'healthy' },
      { name: 'Notification Service', status: 'healthy' },
    ],
    usageData: [
      { day: 'Mo', requests: 4800, errors: 18 },
      { day: 'Di', requests: 5200, errors: 12 },
      { day: 'Mi', requests: 4900, errors: 22 },
      { day: 'Do', requests: 5100, errors: 9 },
      { day: 'Fr', requests: 4600, errors: 14 },
      { day: 'Sa', requests: 2100, errors: 5 },
      { day: 'So', requests: 1800, errors: 3 },
    ],
  },
  zaehler: {
    id: 'zaehler',
    name: 'Zähler',
    description: 'Zählerstandsmanagement & Abrechnung',
    icon: Gauge,
    iconColor: 'text-amber-500 bg-amber-500/10',
    status: 'online',
    version: '1.8.3',
    activeUsers: 634,
    uptime: '99.7%',
    url: 'https://zaehler.fintutto.com',
    techStack: ['React', 'TypeScript', 'Supabase'],
    database: 'PostgreSQL (Supabase)',
    lastDeployment: '12.02.2026, 11:20',
    region: 'EU-West (Frankfurt)',
    responseTime: '135ms',
    errorRate: '0.03%',
    requestsPerDay: '18.400',
    storageUsed: '1.4 GB',
    features: ['Zählererfassung', 'Verbrauchsanalyse', 'Abrechnungsgenerierung', 'IoT-Integration', 'Historische Daten'],
    endpoints: [
      { name: 'API Gateway', status: 'healthy' },
      { name: 'Auth Service', status: 'healthy' },
      { name: 'Metering Service', status: 'healthy' },
      { name: 'IoT Bridge', status: 'healthy' },
    ],
    usageData: [
      { day: 'Mo', requests: 2800, errors: 5 },
      { day: 'Di', requests: 3100, errors: 8 },
      { day: 'Mi', requests: 2900, errors: 4 },
      { day: 'Do', requests: 3200, errors: 6 },
      { day: 'Fr', requests: 2600, errors: 3 },
      { day: 'Sa', requests: 1200, errors: 1 },
      { day: 'So', requests: 900, errors: 1 },
    ],
  },
  mieterapp: {
    id: 'mieterapp',
    name: 'MieterApp',
    description: 'Mieterportal & Self-Service',
    icon: Users,
    iconColor: 'text-violet-500 bg-violet-500/10',
    status: 'online',
    version: '2.0.5',
    activeUsers: 3421,
    uptime: '99.9%',
    url: 'https://mieter.fintutto.com',
    techStack: ['React', 'TypeScript', 'Supabase', 'PWA'],
    database: 'PostgreSQL (Supabase)',
    lastDeployment: '14.02.2026, 14:10',
    region: 'EU-West (Frankfurt)',
    responseTime: '98ms',
    errorRate: '0.01%',
    requestsPerDay: '78.500',
    storageUsed: '3.2 GB',
    features: ['Schadensmeldung', 'Dokumenteneinsicht', 'Mietzahlungen', 'Kommunikation', 'Push-Benachrichtigungen'],
    endpoints: [
      { name: 'API Gateway', status: 'healthy' },
      { name: 'Auth Service', status: 'healthy' },
      { name: 'Push Service', status: 'healthy' },
      { name: 'File Storage', status: 'healthy' },
    ],
    usageData: [
      { day: 'Mo', requests: 11200, errors: 8 },
      { day: 'Di', requests: 12400, errors: 11 },
      { day: 'Mi', requests: 11800, errors: 6 },
      { day: 'Do', requests: 12100, errors: 9 },
      { day: 'Fr', requests: 10900, errors: 7 },
      { day: 'Sa', requests: 8200, errors: 4 },
      { day: 'So', requests: 7600, errors: 3 },
    ],
  },
  portal: {
    id: 'portal',
    name: 'Fintutto-Portal',
    description: 'Zentraler Tools & Services Hub',
    icon: LayoutGrid,
    iconColor: 'text-pink-500 bg-pink-500/10',
    status: 'maintenance',
    version: '1.2.0',
    activeUsers: 412,
    uptime: '98.5%',
    url: 'https://portal.fintutto.com',
    techStack: ['React', 'TypeScript', 'Supabase', 'Vercel'],
    database: 'PostgreSQL (Supabase)',
    lastDeployment: '11.02.2026, 08:55',
    region: 'EU-West (Frankfurt)',
    responseTime: '210ms',
    errorRate: '0.12%',
    requestsPerDay: '8.900',
    storageUsed: '0.8 GB',
    features: ['App-Übersicht', 'SSO-Integration', 'Benachrichtigungszentrale', 'Onboarding-Wizard', 'Hilfecenter'],
    endpoints: [
      { name: 'API Gateway', status: 'healthy' },
      { name: 'Auth Service', status: 'healthy' },
      { name: 'SSO Provider', status: 'degraded' },
      { name: 'Notification Hub', status: 'healthy' },
    ],
    usageData: [
      { day: 'Mo', requests: 1400, errors: 18 },
      { day: 'Di', requests: 1600, errors: 22 },
      { day: 'Mi', requests: 1500, errors: 15 },
      { day: 'Do', requests: 1300, errors: 28 },
      { day: 'Fr', requests: 1200, errors: 12 },
      { day: 'Sa', requests: 600, errors: 8 },
      { day: 'So', requests: 400, errors: 5 },
    ],
  },
  hausmeister: {
    id: 'hausmeister',
    name: 'Hausmeister',
    description: 'Facility Management & Aufträge',
    icon: Wrench,
    iconColor: 'text-orange-500 bg-orange-500/10',
    status: 'online',
    version: '1.5.2',
    activeUsers: 189,
    uptime: '99.6%',
    url: 'https://hausmeister.fintutto.com',
    techStack: ['React', 'TypeScript', 'Supabase', 'PWA'],
    database: 'PostgreSQL (Supabase)',
    lastDeployment: '10.02.2026, 12:30',
    region: 'EU-West (Frankfurt)',
    responseTime: '155ms',
    errorRate: '0.04%',
    requestsPerDay: '5.600',
    storageUsed: '1.1 GB',
    features: ['Auftragsmanagement', 'Routenplanung', 'Materialverwaltung', 'Protokollierung', 'Mobile App'],
    endpoints: [
      { name: 'API Gateway', status: 'healthy' },
      { name: 'Auth Service', status: 'healthy' },
      { name: 'Task Engine', status: 'healthy' },
      { name: 'Geo Service', status: 'healthy' },
    ],
    usageData: [
      { day: 'Mo', requests: 980, errors: 4 },
      { day: 'Di', requests: 1050, errors: 3 },
      { day: 'Mi', requests: 1020, errors: 5 },
      { day: 'Do', requests: 1100, errors: 2 },
      { day: 'Fr', requests: 900, errors: 4 },
      { day: 'Sa', requests: 320, errors: 1 },
      { day: 'So', requests: 180, errors: 0 },
    ],
  },
};

const statusConfig = {
  online: { label: 'Online', variant: 'default' as const, icon: CheckCircle2, color: 'text-chart-2' },
  maintenance: { label: 'Wartung', variant: 'secondary' as const, icon: Clock, color: 'text-chart-4' },
  offline: { label: 'Offline', variant: 'destructive' as const, icon: AlertCircle, color: 'text-destructive' },
};

const endpointStatusColor = {
  healthy: 'text-chart-2',
  degraded: 'text-chart-4',
  down: 'text-destructive',
};

const endpointStatusLabel = {
  healthy: 'Gesund',
  degraded: 'Beeinträchtigt',
  down: 'Ausgefallen',
};

export default function AppDetail() {
  const { appId } = useParams<{ appId: string }>();
  const app = appId ? appsConfig[appId] : undefined;

  if (!app) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">App nicht gefunden</h2>
          <p className="text-muted-foreground mb-4">Die angeforderte Anwendung existiert nicht.</p>
          <Button asChild>
            <Link to="/apps">Zurück zur Übersicht</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const status = statusConfig[app.status];
  const StatusIcon = status.icon;
  const AppIcon = app.icon;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/apps">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className={cn('rounded-lg p-3', app.iconColor)}>
            <AppIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{app.name}</h1>
              <Badge variant={status.variant}>
                <StatusIcon className={cn('mr-1 h-3 w-3', status.color)} />
                {status.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">{app.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Neustarten
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Konfiguration
            </Button>
            <Button size="sm" asChild>
              <a href={app.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Öffnen
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Aktive Nutzer</p>
                  <p className="text-xl font-bold">{app.activeUsers.toLocaleString('de-DE')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Response Time</p>
                  <p className="text-xl font-bold">{app.responseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Error Rate</p>
                  <p className="text-xl font-bold">{app.errorRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Requests/Tag</p>
                  <p className="text-xl font-bold">{app.requestsPerDay}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Chart + Endpoints */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Requests & Fehler (letzte 7 Tage)</CardTitle>
              <CardDescription>Tägliche API-Anfragen und Fehlerrate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={app.usageData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                      name="Requests"
                    />
                    <Area
                      type="monotone"
                      dataKey="errors"
                      stroke="hsl(var(--destructive))"
                      fill="hsl(var(--destructive))"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      name="Fehler"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Health</CardTitle>
              <CardDescription>Status aller Endpunkte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {app.endpoints.map((endpoint) => (
                  <div key={endpoint.name} className="flex items-center justify-between">
                    <span className="text-sm">{endpoint.name}</span>
                    <div className="flex items-center gap-2">
                      <div className={cn('h-2 w-2 rounded-full', {
                        'bg-chart-2': endpoint.status === 'healthy',
                        'bg-chart-4': endpoint.status === 'degraded',
                        'bg-destructive': endpoint.status === 'down',
                      })} />
                      <span className={cn('text-xs font-medium', endpointStatusColor[endpoint.status])}>
                        {endpointStatusLabel[endpoint.status]}
                      </span>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Gesamte Uptime</span>
                  <span className="font-bold text-chart-2">{app.uptime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technische Details</CardTitle>
              <CardDescription>Infrastruktur & Konfiguration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Server className="h-4 w-4" />
                    Version
                  </div>
                  <span className="text-sm font-medium">v{app.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Database className="h-4 w-4" />
                    Datenbank
                  </div>
                  <span className="text-sm font-medium">{app.database}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    Region
                  </div>
                  <span className="text-sm font-medium">{app.region}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Speicherverbrauch
                  </div>
                  <span className="text-sm font-medium">{app.storageUsed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Letztes Deployment
                  </div>
                  <span className="text-sm font-medium">{app.lastDeployment}</span>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Tech-Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {app.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Aktive Features</CardTitle>
              <CardDescription>Freigeschaltete Funktionen dieser App</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {app.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-chart-2 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
