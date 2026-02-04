import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, MoreHorizontal, Tag, Calendar, Percent } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type OfferStatus = 'active' | 'scheduled' | 'expired' | 'draft';
type DiscountType = 'percentage' | 'fixed';

interface Offer {
  id: string;
  name: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: OfferStatus;
  applicableProducts: string[];
}

const mockOffers: Offer[] = [
  { id: '1', name: 'Neujahrs-Rabatt', code: 'NEUJAHR2024', description: '20% auf alle Produkte', discountType: 'percentage', discountValue: 20, minPurchase: 0, maxUses: 500, usedCount: 234, startDate: '2024-01-01', endDate: '2024-01-31', status: 'expired', applicableProducts: [] },
  { id: '2', name: 'Frühjahrs-Aktion', code: 'FRÜHLING24', description: '15% auf Pro Abonnements', discountType: 'percentage', discountValue: 15, minPurchase: 0, maxUses: 1000, usedCount: 89, startDate: '2024-03-01', endDate: '2024-05-31', status: 'active', applicableProducts: ['pro'] },
  { id: '3', name: '10€ Neukunden-Rabatt', code: 'WELCOME10', description: '10€ Rabatt für Neukunden', discountType: 'fixed', discountValue: 10, minPurchase: 20, maxUses: 0, usedCount: 1523, startDate: '2024-01-01', endDate: '2025-12-31', status: 'active', applicableProducts: [] },
  { id: '4', name: 'Black Friday', code: 'BLACK2024', description: '30% auf Enterprise', discountType: 'percentage', discountValue: 30, minPurchase: 0, maxUses: 200, usedCount: 0, startDate: '2024-11-25', endDate: '2024-11-30', status: 'scheduled', applicableProducts: ['enterprise'] },
];

interface FormData {
  name: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  minPurchase: string;
  maxUses: string;
  startDate: string;
  endDate: string;
  status: OfferStatus;
}

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '0',
    maxUses: '0',
    startDate: '',
    endDate: '',
    status: 'draft',
  });

  const handleSave = () => {
    const offerData: Omit<Offer, 'id' | 'usedCount'> = {
      name: formData.name,
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue) || 0,
      minPurchase: parseFloat(formData.minPurchase) || 0,
      maxUses: parseInt(formData.maxUses) || 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      applicableProducts: [],
    };

    if (editingOffer) {
      setOffers(offers.map(o => o.id === editingOffer.id ? { ...o, ...offerData } : o));
    } else {
      setOffers([...offers, { id: String(Date.now()), ...offerData, usedCount: 0 }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingOffer(null);
    setFormData({ name: '', code: '', description: '', discountType: 'percentage', discountValue: '', minPurchase: '0', maxUses: '0', startDate: '', endDate: '', status: 'draft' });
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name,
      code: offer.code,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: String(offer.discountValue),
      minPurchase: String(offer.minPurchase),
      maxUses: String(offer.maxUses),
      startDate: offer.startDate,
      endDate: offer.endDate,
      status: offer.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  const getStatusBadge = (status: OfferStatus) => {
    const variants: Record<OfferStatus, { variant: 'default' | 'secondary' | 'outline' | 'destructive', label: string }> = {
      active: { variant: 'default', label: 'Aktiv' },
      scheduled: { variant: 'outline', label: 'Geplant' },
      expired: { variant: 'secondary', label: 'Abgelaufen' },
      draft: { variant: 'outline', label: 'Entwurf' },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const columns = [
    { key: 'name', header: 'Angebot', render: (offer: Offer) => (
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
          <Tag className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{offer.name}</p>
          <p className="text-xs text-muted-foreground">{offer.description}</p>
        </div>
      </div>
    )},
    { key: 'code', header: 'Code', render: (offer: Offer) => (
      <code className="rounded bg-muted px-2 py-1 text-sm font-mono">{offer.code}</code>
    )},
    { key: 'discountValue', header: 'Rabatt', render: (offer: Offer) => (
      <div className="flex items-center gap-1">
        <Percent className="h-3 w-3 text-muted-foreground" />
        <span className="font-semibold">
          {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `€${offer.discountValue}`}
        </span>
      </div>
    )},
    { key: 'usage', header: 'Nutzung', render: (offer: Offer) => (
      <span>{offer.usedCount} / {offer.maxUses || '∞'}</span>
    )},
    { key: 'period', header: 'Zeitraum', render: (offer: Offer) => (
      <div className="flex items-center gap-1 text-sm">
        <Calendar className="h-3 w-3 text-muted-foreground" />
        <span>{offer.startDate} - {offer.endDate}</span>
      </div>
    )},
    { key: 'status', header: 'Status', render: (offer: Offer) => getStatusBadge(offer.status) },
    { key: 'actions', header: '', render: (offer: Offer) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(offer)}>
            <Pencil className="mr-2 h-4 w-4" />Bearbeiten
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(offer.id)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />Löschen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Angebote</h1>
            <p className="text-muted-foreground">Verwalten Sie Rabattaktionen und Gutscheincodes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Angebot erstellen</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingOffer ? 'Angebot bearbeiten' : 'Neues Angebot'}</DialogTitle>
                <DialogDescription>
                  Erstellen Sie einen Rabattcode oder eine Sonderaktion.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Code</Label>
                    <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="uppercase" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="discountType">Rabattart</Label>
                    <Select value={formData.discountType} onValueChange={(value) => setFormData({ ...formData, discountType: value as DiscountType })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Prozent</SelectItem>
                        <SelectItem value="fixed">Festbetrag (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discountValue">Wert</Label>
                    <Input id="discountValue" type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Startdatum</Label>
                    <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Enddatum</Label>
                    <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="minPurchase">Mindestbestellwert (€)</Label>
                    <Input id="minPurchase" type="number" value={formData.minPurchase} onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxUses">Max. Nutzungen (0 = unbegrenzt)</Label>
                    <Input id="maxUses" type="number" value={formData.maxUses} onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as OfferStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktiv</SelectItem>
                      <SelectItem value="scheduled">Geplant</SelectItem>
                      <SelectItem value="draft">Entwurf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>Abbrechen</Button>
                <Button onClick={handleSave}>Speichern</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable<Offer>
          data={offers}
          columns={columns}
          searchKey="code"
          searchPlaceholder="Nach Code suchen..."
        />
      </div>
    </DashboardLayout>
  );
}
