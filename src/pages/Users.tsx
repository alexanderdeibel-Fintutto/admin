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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type UserStatus = 'active' | 'inactive' | 'pending';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: UserStatus;
  subscription: string;
  createdAt: string;
}

const mockUsers: User[] = [
  { id: '1', email: 'max.mueller@example.com', name: 'Max Müller', role: 'Admin', status: 'active', subscription: 'Pro', createdAt: '2024-01-15' },
  { id: '2', email: 'lisa.schmidt@example.com', name: 'Lisa Schmidt', role: 'Benutzer', status: 'active', subscription: 'Basic', createdAt: '2024-02-20' },
  { id: '3', email: 'peter.weber@example.com', name: 'Peter Weber', role: 'Benutzer', status: 'inactive', subscription: 'Free', createdAt: '2024-03-10' },
  { id: '4', email: 'anna.braun@example.com', name: 'Anna Braun', role: 'Benutzer', status: 'active', subscription: 'Enterprise', createdAt: '2024-01-05' },
  { id: '5', email: 'thomas.fischer@example.com', name: 'Thomas Fischer', role: 'Moderator', status: 'pending', subscription: 'Pro', createdAt: '2024-04-01' },
  { id: '6', email: 'julia.wagner@example.com', name: 'Julia Wagner', role: 'Benutzer', status: 'active', subscription: 'Basic', createdAt: '2024-02-28' },
  { id: '7', email: 'stefan.koch@example.com', name: 'Stefan Koch', role: 'Benutzer', status: 'active', subscription: 'Free', createdAt: '2024-03-15' },
  { id: '8', email: 'maria.bauer@example.com', name: 'Maria Bauer', role: 'Benutzer', status: 'inactive', subscription: 'Basic', createdAt: '2024-01-22' },
];

interface FormData {
  email: string;
  name: string;
  role: string;
  status: UserStatus;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({ email: '', name: '', role: 'Benutzer', status: 'active' });

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser: User = {
        id: String(Date.now()),
        ...formData,
        subscription: 'Free',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
    }
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({ email: '', name: '', role: 'Benutzer', status: 'active' });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ email: user.email, name: user.name, role: user.role, status: user.status });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'E-Mail' },
    { key: 'role', header: 'Rolle' },
    {
      key: 'status',
      header: 'Status',
      render: (user: User) => (
        <Badge variant={user.status === 'active' ? 'default' : user.status === 'inactive' ? 'secondary' : 'outline'}>
          {user.status === 'active' ? 'Aktiv' : user.status === 'inactive' ? 'Inaktiv' : 'Ausstehend'}
        </Badge>
      ),
    },
    {
      key: 'subscription',
      header: 'Abonnement',
      render: (user: User) => (
        <Badge variant="outline">{user.subscription}</Badge>
      ),
    },
    { key: 'createdAt', header: 'Erstellt am' },
    {
      key: 'actions',
      header: '',
      render: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(user)}>
              <Pencil className="mr-2 h-4 w-4" />
              Bearbeiten
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Löschen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Benutzer</h1>
            <p className="text-muted-foreground">Verwalten Sie alle Benutzer der Plattform</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingUser(null);
              setFormData({ email: '', name: '', role: 'Benutzer', status: 'active' });
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Benutzer hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}</DialogTitle>
                <DialogDescription>
                  {editingUser ? 'Bearbeiten Sie die Benutzerinformationen.' : 'Fügen Sie einen neuen Benutzer hinzu.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Rolle</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                      <SelectItem value="Benutzer">Benutzer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktiv</SelectItem>
                      <SelectItem value="inactive">Inaktiv</SelectItem>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
                <Button onClick={handleSave}>Speichern</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable<User>
          data={users}
          columns={columns}
          searchKey="email"
          searchPlaceholder="Nach E-Mail suchen..."
        />
      </div>
    </DashboardLayout>
  );
}
