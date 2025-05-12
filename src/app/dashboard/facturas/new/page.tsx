
"use client";
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function NewFacturaPage() {
  const searchParams = useSearchParams();
  const [tipoFactura, setTipoFactura] = useState<'Venta' | 'Compra' | 'General'>('General');

  useEffect(() => {
    const tipo = searchParams.get('tipo');
    if (tipo === 'venta') {
      setTipoFactura('Venta');
    } else if (tipo === 'compra') {
      setTipoFactura('Compra');
    } else {
      setTipoFactura('General');
    }
  }, [searchParams]);

  const pageTitle = tipoFactura === 'General' ? "Create New Factura" : `Create New Factura de ${tipoFactura}`;
  const pageDescription = tipoFactura === 'General' 
    ? "Specify details for the new invoice."
    : `Enter details for the new factura de ${tipoFactura.toLowerCase()}.`;

  return (
    <>
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actionButton={
          <Button variant="outline" asChild>
            <Link href="/dashboard/facturas">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Facturas
            </Link>
          </Button>
        }
      />
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Construction className="h-6 w-6" />
            Form Under Construction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            The form to create a new factura ({tipoFactura.toLowerCase()}) is currently under development.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">Planned Sections:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Invoice Header (Date, Number, {tipoFactura === 'Venta' ? 'Cliente' : tipoFactura === 'Compra' ? 'Proveedor' : 'Cliente/Proveedor'}, etc.)</li>
              <li>Invoice Line Items (Products/Services, Quantity, Price, IVA)</li>
              <li>Totals (Subtotal, IVA, Total)</li>
              <li>Payment Information (if applicable)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
