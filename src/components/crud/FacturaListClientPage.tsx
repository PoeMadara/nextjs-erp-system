"use client";
import type { ReactNode } from 'react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search, Eye } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import type { Factura, FacturaTipo } from '@/types';
import { getFacturas } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';

interface FacturaListClientPageProps {
  pageTitleKey: string;
  pageDescriptionKey: string;
  newButtonTextKey: string;
  newButtonLink: string;
  invoiceTypeFilter?: FacturaTipo;
  hideNewButton?: boolean;
}

export default function FacturaListClientPage({
  pageTitleKey,
  pageDescriptionKey,
  newButtonTextKey,
  newButtonLink,
  invoiceTypeFilter,
  hideNewButton = false,
}: FacturaListClientPageProps) {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchFacturas() {
      setIsLoading(true);
      try {
        const data = await getFacturas();
        setFacturas(data);
      } catch (error) {
        toast({ title: t('common.error'), description: t('facturas.failFetch'), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchFacturas();
  }, [toast, t]);

  const filteredFacturas = useMemo(() => {
    let currentFacturas = facturas;
    if (invoiceTypeFilter) {
      currentFacturas = facturas.filter(factura => factura.tipo === invoiceTypeFilter);
    }
    return currentFacturas.filter(factura =>
      factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (factura.clienteNombre && factura.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (factura.proveedorNombre && factura.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      factura.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [facturas, searchTerm, invoiceTypeFilter]);

  const getBadgeVariant = (estado: Factura['estado']) => {
    switch (estado) {
      case 'Pagada': return 'default'; 
      case 'Pendiente': return 'secondary'; 
      case 'Cancelada': return 'destructive';
      default: return 'outline';
    }
  };

  const translateStatus = (status: Factura['estado']) => {
    switch (status) {
      case 'Pagada': return t('facturas.statusPaid');
      case 'Pendiente': return t('facturas.statusPending');
      case 'Cancelada': return t('facturas.statusCancelled');
      default: return status;
    }
  }

  const translateType = (type: Factura['tipo']) => {
     switch (type) {
      case 'Venta': return t('facturas.typeSale');
      case 'Compra': return t('facturas.typePurchase');
      default: return type;
    }
  }

  if (isLoading) {
     return (
      <>
        <PageHeader title={t(pageTitleKey)} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-36" />} />
        <div className="mb-4">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(7)].map((_, i) => <TableHead key={i}><Skeleton className="h-6 w-24" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t(pageTitleKey)}
        description={t(pageDescriptionKey)}
        actionButton={
          !hideNewButton ? (
            <Button asChild className="shadow-sm" disabled>
              <Link href={newButtonLink}>
                <PlusCircle className="mr-2 h-4 w-4" /> {t(newButtonTextKey)}
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('facturas.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-10 shadow-sm"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('facturas.tableNumber')}</TableHead>
              <TableHead>{t('facturas.tableDate')}</TableHead>
              <TableHead>{t('facturas.tableType')}</TableHead>
              <TableHead>{t('facturas.tableClientSupplier')}</TableHead>
              <TableHead>{t('facturas.tableTotal')}</TableHead>
              <TableHead>{t('facturas.tableStatus')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFacturas.length > 0 ? (
              filteredFacturas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell className="font-medium">{factura.id}</TableCell>
                  <TableCell>{format(new Date(factura.fecha), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={factura.tipo === 'Venta' ? 'outline' : 'secondary'}>
                      {translateType(factura.tipo)}
                    </Badge>
                  </TableCell>
                  <TableCell>{factura.clienteNombre || factura.proveedorNombre || '-'}</TableCell>
                  <TableCell>${factura.totalFactura.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(factura.estado)}>
                      {translateStatus(factura.estado)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t('common.actions')}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/facturas/${factura.id}/view`}>
                            <Eye className="mr-2 h-4 w-4" /> {t('common.viewDetails')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <Edit className="mr-2 h-4 w-4" /> {t('common.edit')} ({t('common.underConstruction').toLowerCase()})
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')} ({t('common.underConstruction').toLowerCase()})
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t('facturas.noFacturasFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
