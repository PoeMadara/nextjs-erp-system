"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { getFacturaById } from "@/lib/mockData";
import type { Factura } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Printer, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';

export default function ViewFacturaPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      const fetchFactura = async () => {
        setIsLoading(true);
        try {
          const data = await getFacturaById(id);
          if (data) {
            setFactura(data);
          } else {
            toast({ title: "Error", description: "Factura not found.", variant: "destructive" });
            router.push("/dashboard/facturas");
          }
        } catch (error) {
          toast({ title: "Error", description: "Failed to fetch factura details.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchFactura();
    } else {
      router.push("/dashboard/facturas");
    }
  }, [id, router, toast]);

  if (isLoading) {
    return (
      <>
        <PageHeader title="View Factura" description="Loading factura details..." />
        <Card className="max-w-4xl mx-auto">
          <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-1/3 ml-auto" />
          </CardContent>
          <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
        </Card>
      </>
    );
  }

  if (!factura) {
    return <PageHeader title="Error" description="Factura not found or failed to load." />;
  }
  
  const getBadgeVariant = (estado: Factura['estado']) => {
    switch (estado) {
      case 'Pagada': return 'default';
      case 'Pendiente': return 'secondary';
      case 'Cancelada': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <>
      <PageHeader 
        title={`Factura #${factura.id}`}
        description={`Details for ${factura.tipo} invoice dated ${format(new Date(factura.fecha), 'PPP')}.`}
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/facturas">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Facturas
              </Link>
          </Button>
        }
      />
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Factura {factura.id}</CardTitle>
              <CardDescription>
                Tipo: <Badge variant={factura.tipo === 'Venta' ? 'outline' : 'secondary'}>{factura.tipo}</Badge> | 
                Estado: <Badge variant={getBadgeVariant(factura.estado)}>{factura.estado}</Badge>
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="font-semibold">Fecha: {format(new Date(factura.fecha), 'PPP')}</p>
              {factura.tipo === 'Venta' && factura.clienteNombre && <p>Cliente: {factura.clienteNombre}</p>}
              {factura.tipo === 'Compra' && factura.proveedorNombre && <p>Proveedor: {factura.proveedorNombre}</p>}
              <p>Empleado: {factura.empleadoNombre || 'N/A'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detalles de la Factura</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">IVA (%)</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factura.detalles.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productoNombre || item.productoId}</TableCell>
                    <TableCell className="text-center">{item.cantidad}</TableCell>
                    <TableCell className="text-right">${item.precioUnitario.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.porcentajeIva.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">${(item.cantidad * item.precioUnitario).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Separator className="my-6" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <div className="col-span-2 md:col-span-1 md:col-start-3 space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Imponible:</span>
                <span className="font-semibold">${factura.baseImponible.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total IVA:</span>
                <span className="font-semibold">${factura.totalIva.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total Factura:</span>
                <span className="font-bold text-primary">${factura.totalFactura.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button disabled>
                <Download className="mr-2 h-4 w-4" /> Download PDF (Soon)
            </Button>
        </CardFooter>
      </Card>
    </>
  );
}
