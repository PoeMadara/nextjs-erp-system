import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Productos - ERP Simplified',
};

export default function ProductosPage() {
  return (
    <>
      <PageHeader
        title="Productos"
        description="Manage your product catalog and inventory."
        actionButton={
          <Button asChild className="shadow-sm" disabled>
            <Link href="/dashboard/productos/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Producto
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
            The Productos management section is currently under development.
          </p>
           <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">Planned Features:</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Detailed product information including pricing, stock levels, and descriptions.</li>
              <li>Categorization and variant management.</li>
              <li>Stock movement tracking.</li>
              <li>Integration with sales and purchasing modules.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
