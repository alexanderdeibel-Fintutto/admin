import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Layers, 
  Tag, 
  Settings,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Benutzer', path: '/users' },
  { icon: Package, label: 'Produkte', path: '/products' },
  { icon: Layers, label: 'Bundles', path: '/bundles' },
  { icon: Tag, label: 'Angebote', path: '/offers' },
  { icon: Settings, label: 'Einstellungen', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">F</span>
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">Fintutto</span>
        <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-medium text-primary">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="flex-1 justify-start gap-2 text-sidebar-foreground"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Hell' : 'Dunkel'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-sidebar-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
