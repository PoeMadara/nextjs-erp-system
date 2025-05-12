
"use client";
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewProveedorPage() {
  // Similar to NewClientePage but for Proveedores
  return (
    <>
      <PageHeader
        title="Create New Proveedor"
        description="Add a new supplier to your records."
        actionButton={
          <Button variant="outline" asChild>
            <Link href="/dashboard/proveedores">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Proveedores
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
            The form to create a new Proveedor is currently under development.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">Planned Fields:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Nombre del Proveedor</li>
              <li>NIF/CIF</li>
              <li>Email de Contacto</li>
              <li>Teléfono</li>
              <li>Dirección Completa</li>
              <li>Persona de Contacto</li>
              <li>Condiciones de Pago</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
