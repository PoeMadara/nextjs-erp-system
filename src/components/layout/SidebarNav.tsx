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
  ChevronRight
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

const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/proveedores', label: 'Proveedores', icon: Truck },
  { href: '/dashboard/empleados', label: 'Empleados', icon: Briefcase },
  { href: '/dashboard/productos', label: 'Productos', icon: Package },
  { 
    label: 'Facturas', 
    icon: FileText,
    subItems: [
      { href: '/dashboard/facturas/ventas', label: 'Ventas' },
      { href: '/dashboard/facturas/compras', label: 'Compras' },
      { href: '/dashboard/facturas', label: 'Todas las Facturas' },
    ]
  },
  { href: '/dashboard/almacen', label: 'Almacén', icon: Warehouse },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [openAccordion, setOpenAccordion] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const activeParent = mainNavItems.find(item => 
      item.subItems?.some(subItem => pathname === subItem.href || pathname?.startsWith(subItem.href + '/'))
    );
    if (activeParent) {
      setOpenAccordion(activeParent.label);
    }
  }, [pathname]);


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
              <AccordionItem value={item.label} key={item.label} className="border-none">
                <AccordionTrigger 
                  className={cn(
                    "flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring",
                    item.subItems.some(sub => pathname === sub.href || pathname?.startsWith(sub.href + '/')) ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
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
                        {subItem.label}
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
                    (pathname === item.href || pathname?.startsWith(item.href + '/')) && item.href !== '/dashboard/facturas' // avoid highlighting main facturas if subitem active
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
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
          Log Out
        </Button>
      </div>
    </div>
  );
}
