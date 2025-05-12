"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search, Eye } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import type { Factura } from '@/types';
import { getFacturas } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchFacturas() {
      setIsLoading(true);
      try {
        const data = await getFacturas();
        setFacturas(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch facturas.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchFacturas();
  }, [toast]);

  const filteredFacturas = useMemo(() => {
    return facturas.filter(factura =>
      factura.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (factura.clienteNombre && factura.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (factura.proveedorNombre && factura.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      factura.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [facturas, searchTerm]);

  const getBadgeVariant = (estado: Factura['estado']) => {
    switch (estado) {
      case 'Pagada': return 'default'; // Default is usually primary
      case 'Pendiente': return 'secondary'; // Or another variant like outline
      case 'Cancelada': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
     return (
      <>
        <PageHeader title="Todas las Facturas" description="View and manage all invoices." actionButton={<Skeleton className="h-10 w-36" />} />
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
        title="Todas las Facturas"
        description="View and manage all your sales and purchase invoices."
        actionButton={
          <Button asChild className="shadow-sm" disabled>
            <Link href="/dashboard/facturas/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Factura
            </Link>
          </Button>
        }
      />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search facturas by ID, client/supplier name, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-10 shadow-sm"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cliente/Proveedor</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                      {factura.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{factura.clienteNombre || factura.proveedorNombre || '-'}</TableCell>
                  <TableCell>${factura.totalFactura.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(factura.estado)}>
                      {factura.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/facturas/${factura.id}/view`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <Edit className="mr-2 h-4 w-4" /> Edit (Coming soon)
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete (Coming soon)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No facturas found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
