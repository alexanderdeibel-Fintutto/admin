import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Euro,
  Building2,
  Gauge,
  Users,
  LayoutGrid,
  Wrench,
  ExternalLink,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppInfo {
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
}

const apps: AppInfo[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

const statusConfig = {
  online: { label: 'Online', variant: 'default' as const, icon: CheckCircle2, color: 'text-chart-2' },
  maintenance: { label: 'Wartung', variant: 'secondary' as const, icon: Clock, color: 'text-chart-4' },
  offline: { label: 'Offline', variant: 'destructive' as const, icon: AlertCircle, color: 'text-destructive' },
};

export default function Apps() {
  const onlineCount = apps.filter((a) => a.status === 'online').length;
  const totalUsers = apps.reduce((sum, a) => sum + a.activeUsers, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Apps-Verwaltung</h1>
            <p className="text-muted-foreground">
              Übersicht und Verwaltung aller Fintutto-Anwendungen
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-chart-2/10 p-3">
                  <CheckCircle2 className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Apps Online</p>
                  <p className="text-2xl font-bold">{onlineCount} / {apps.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gesamte Nutzer</p>
                  <p className="text-2xl font-bold">{totalUsers.toLocaleString('de-DE')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-chart-4/10 p-3">
                  <Activity className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Durchschn. Uptime</p>
                  <p className="text-2xl font-bold">99.6%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => {
            const status = statusConfig[app.status];
            const StatusIcon = status.icon;
            return (
              <Card key={app.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('rounded-lg p-2.5', app.iconColor)}>
                        <app.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{app.name}</CardTitle>
                        <CardDescription className="text-xs">{app.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={status.variant} className="text-xs">
                      <StatusIcon className={cn('mr-1 h-3 w-3', status.color)} />
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-semibold">{app.activeUsers.toLocaleString('de-DE')}</p>
                        <p className="text-[10px] text-muted-foreground">Nutzer</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{app.uptime}</p>
                        <p className="text-[10px] text-muted-foreground">Uptime</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">v{app.version}</p>
                        <p className="text-[10px] text-muted-foreground">Version</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/apps/${app.id}`}>
                          Details
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={app.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
