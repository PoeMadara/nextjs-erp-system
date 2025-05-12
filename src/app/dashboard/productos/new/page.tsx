
"use client";
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewProductoPage() {
  return (
    <>
      <PageHeader
        title="Create New Producto"
        description="Add a new product to the catalog."
        actionButton={
          <Button variant="outline" asChild>
            <Link href="/dashboard/productos">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Productos
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
            The form to create a new Producto is currently under development.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">Planned Fields:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Nombre del Producto</li>
              <li>Descripción</li>
              <li>Precio de Compra</li>
              <li>Precio de Venta</li>
              <li>Porcentaje de IVA</li>
              <li>Stock Inicial</li>
              <li>Categoría</li>
              <li>Referencia/SKU</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
