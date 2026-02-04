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
import { Plus, Pencil, Trash2, MoreHorizontal, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly' | 'one_time';
  status: 'active' | 'inactive' | 'draft';
  stripeProductId: string;
  stripePriceId: string;
  features: string[];
}

const mockProducts: Product[] = [
  { id: '1', name: 'Free', description: 'Kostenloser Einstieg in die Finanzwelt', price: 0, interval: 'monthly', status: 'active', stripeProductId: 'prod_free', stripePriceId: 'price_free', features: ['1 Benutzer', 'Grundfunktionen', 'Community Support'] },
  { id: '2', name: 'Basic', description: 'Für Einsteiger und kleine Teams', price: 9.99, interval: 'monthly', status: 'active', stripeProductId: 'prod_basic', stripePriceId: 'price_basic', features: ['5 Benutzer', 'Alle Free Features', 'E-Mail Support', 'Monatliche Berichte'] },
  { id: '3', name: 'Pro', description: 'Für wachsende Unternehmen', price: 29.99, interval: 'monthly', status: 'active', stripeProductId: 'prod_pro', stripePriceId: 'price_pro', features: ['25 Benutzer', 'Alle Basic Features', 'Priority Support', 'API Zugang', 'Erweiterte Analysen'] },
  { id: '4', name: 'Enterprise', description: 'Maßgeschneiderte Lösungen für Großkunden', price: 99.99, interval: 'monthly', status: 'active', stripeProductId: 'prod_enterprise', stripePriceId: 'price_enterprise', features: ['Unbegrenzte Benutzer', 'Alle Pro Features', 'Dedizierter Account Manager', 'SLA', 'Custom Integrationen'] },
  { id: '5', name: 'Jahresabo Pro', description: 'Pro Paket mit Jahresrabatt', price: 299.99, interval: 'yearly', status: 'active', stripeProductId: 'prod_pro_yearly', stripePriceId: 'price_pro_yearly', features: ['Alle Pro Features', '2 Monate gratis'] },
];

interface FormData {
  name: string;
  description: string;
  price: string;
  interval: 'monthly' | 'yearly' | 'one_time';
  status: 'active' | 'inactive' | 'draft';
  features: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    interval: 'monthly',
    status: 'draft',
    features: '',
  });

  const handleSave = () => {
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      interval: formData.interval,
      status: formData.status,
      features: formData.features.split('\n').filter(f => f.trim()),
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        ...productData,
        stripeProductId: `prod_${Date.now()}`,
        stripePriceId: `price_${Date.now()}`,
      };
      setProducts([...products, newProduct]);
    }
    resetForm();
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', interval: 'monthly', status: 'draft', features: '' });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      interval: product.interval,
      status: product.status,
      features: product.features.join('\n'),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const formatPrice = (price: number, interval: string) => {
    if (price === 0) return 'Kostenlos';
    const suffix = interval === 'monthly' ? '/Monat' : interval === 'yearly' ? '/Jahr' : '';
    return `€${price.toFixed(2)}${suffix}`;
  };

  const columns = [
    { key: 'name', header: 'Produkt' },
    { key: 'description', header: 'Beschreibung', render: (product: Product) => (
      <span className="max-w-[200px] truncate block">{product.description}</span>
    )},
    { key: 'price', header: 'Preis', render: (product: Product) => formatPrice(product.price, product.interval) },
    { key: 'interval', header: 'Intervall', render: (product: Product) => (
      <Badge variant="outline">
        {product.interval === 'monthly' ? 'Monatlich' : product.interval === 'yearly' ? 'Jährlich' : 'Einmalig'}
      </Badge>
    )},
    { key: 'status', header: 'Status', render: (product: Product) => (
      <Badge variant={product.status === 'active' ? 'default' : product.status === 'inactive' ? 'secondary' : 'outline'}>
        {product.status === 'active' ? 'Aktiv' : product.status === 'inactive' ? 'Inaktiv' : 'Entwurf'}
      </Badge>
    )},
    { key: 'stripeProductId', header: 'Stripe', render: (product: Product) => (
      <Button variant="ghost" size="sm" className="h-8 px-2">
        <ExternalLink className="mr-1 h-3 w-3" />
        {product.stripeProductId.slice(0, 12)}...
      </Button>
    )},
    { key: 'actions', header: '', render: (product: Product) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(product)}>
            <Pencil className="mr-2 h-4 w-4" />
            Bearbeiten
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Löschen
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
            <h1 className="text-3xl font-bold tracking-tight">Produkte</h1>
            <p className="text-muted-foreground">Verwalten Sie Ihre Produkte und Stripe-Preise</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Produkt erstellen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt'}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Bearbeiten Sie die Produktinformationen.' : 'Erstellen Sie ein neues Produkt mit Stripe-Integration.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Beschreibung</Label>
                  <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Preis (€)</Label>
                    <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="interval">Intervall</Label>
                    <Select value={formData.interval} onValueChange={(value) => setFormData({ ...formData, interval: value as FormData['interval'] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monatlich</SelectItem>
                        <SelectItem value="yearly">Jährlich</SelectItem>
                        <SelectItem value="one_time">Einmalig</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as FormData['status'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktiv</SelectItem>
                      <SelectItem value="inactive">Inaktiv</SelectItem>
                      <SelectItem value="draft">Entwurf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="features">Features (eine pro Zeile)</Label>
                  <Textarea id="features" rows={4} value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>Abbrechen</Button>
                <Button onClick={handleSave}>Speichern</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable<Product>
          data={products}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Nach Produktname suchen..."
        />
      </div>
    </DashboardLayout>
  );
}
