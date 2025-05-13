
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Truck,
  Briefcase,
  Package,
  FileText,
  Warehouse,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  Bell // Added Bell for Notifications
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErpLogo } from '@/components/icons/ErpLogo';
import { useAuth } from '@/contexts/AuthContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import * as React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export function SidebarNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Added user from useAuth
  const { t } = useTranslation();
  const [openAccordion, setOpenAccordion] = React.useState<string | undefined>(undefined);

  const mainNavItems = React.useMemo(() => {
    const items = [
      { href: '/dashboard', labelKey: 'sidebar.dashboard', icon: LayoutDashboard },
      { href: '/dashboard/clientes', labelKey: 'sidebar.clientes', icon: Users },
      { href: '/dashboard/proveedores', labelKey: 'sidebar.proveedores', icon: Truck },
      { href: '/dashboard/empleados', labelKey: 'sidebar.empleados', icon: Briefcase },
      { href: '/dashboard/productos', labelKey: 'sidebar.productos', icon: Package },
      { 
        labelKey: 'sidebar.facturas', 
        icon: FileText,
        subItems: [
          { href: '/dashboard/facturas/ventas', labelKey: 'sidebar.facturasVentas' },
          { href: '/dashboard/facturas/compras', labelKey: 'sidebar.facturasCompras' },
          { href: '/dashboard/facturas', labelKey: 'sidebar.facturasTodas' },
        ]
      },
      { href: '/dashboard/almacen', labelKey: 'sidebar.almacen', icon: Warehouse },
    ];

    if (user && (user.role === 'admin' || user.role === 'moderator')) {
      items.push({ href: '/dashboard/notificaciones', labelKey: 'sidebar.notificaciones', icon: Bell });
    }
    return items;
  }, [t, user]); 

  React.useEffect(() => {
    const activeParent = mainNavItems.find(item => 
      item.subItems?.some(subItem => pathname === subItem.href || pathname?.startsWith(subItem.href + '/'))
    );
    if (activeParent) {
      setOpenAccordion(t(activeParent.labelKey));
    } else {
      const directActiveItem = mainNavItems.find(item => pathname === item.href || pathname?.startsWith(item.href + '/'));
      if (directActiveItem && !directActiveItem.subItems) {
        setOpenAccordion(undefined); // Close accordion if a direct link is active
      }
    }
  }, [pathname, mainNavItems, t]);


  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-md">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard" legacyBehavior>
          <a className="flex items-center gap-2">
            <ErpLogo />
          </a>
        </Link>
      </div>
      <nav className="flex-grow px-2 py-4 space-y-1 overflow-y-auto">
        <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion} className="w-full">
          {mainNavItems.map((item) =>
            item.subItems ? (
              <AccordionItem value={t(item.labelKey)} key={t(item.labelKey)} className="border-none">
                <AccordionTrigger 
                  className={cn(
                    "flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring",
                    item.subItems.some(sub => pathname === sub.href || pathname?.startsWith(sub.href + '/')) ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {t(item.labelKey)}
                </AccordionTrigger>
                <AccordionContent className="pl-6 pb-0 pt-0">
                  {item.subItems.map((subItem) => (
                    <Link key={subItem.href} href={subItem.href} legacyBehavior>
                      <a
                        className={cn(
                          'flex items-center px-3 py-2 my-1 rounded-md text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-1 focus:ring-sidebar-ring',
                          (pathname === subItem.href || pathname?.startsWith(subItem.href + '/'))
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground/80'
                        )}
                      >
                        <ChevronRight className="mr-3 h-4 w-4 text-sidebar-accent-foreground/50" />
                        {t(subItem.labelKey)}
                      </a>
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Link key={item.href} href={item.href} legacyBehavior>
                <a
                  className={cn(
                    'flex items-center px-3 py-2.5 rounded-md text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring',
                    (pathname === item.href || (pathname?.startsWith(item.href + '/') && item.href !== '/dashboard')) || (pathname === '/dashboard' && item.href === '/dashboard')
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {t(item.labelKey)}
                </a>
              </Link>
            )
          )}
        </Accordion>
      </nav>
      <div className="p-4 mt-auto border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          {t('sidebar.logout')}
        </Button>
      </div>
    </div>
  );
}
