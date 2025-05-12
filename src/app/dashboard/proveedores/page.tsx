import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Proveedores - ERP Simplified',
};

export default function ProveedoresPage() {
  return (
    <>
      <PageHeader
        title="Proveedores"
        description="Manage your supplier records."
        actionButton={
          <Button asChild className="shadow-sm" disabled>
            <Link href="/dashboard/proveedores/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Proveedor
            </Link>
          </Button>
        }
      />
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Construction className="h-6 w-6" />
            Under Construction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            The Proveedores management section is currently under development.
            Please check back later for full CRUD functionality.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">Planned Features:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>View, search, and filter suppliers.</li>
              <li>Add new suppliers with detailed information.</li>
              <li>Edit existing supplier data.</li>
              <li>Delete suppliers (with appropriate checks).</li>
              <li>Link suppliers to purchase orders and invoices.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
