import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Facturas de Compra - ERP Simplified',
};

export default function FacturasComprasPage() {
  return (
    <>
      <PageHeader
        title="Facturas de Compra"
        description="Manage your purchase invoices."
        actionButton={
          <Button asChild className="shadow-sm" disabled>
            <Link href="/dashboard/facturas/new?tipo=compra">
              <PlusCircle className="mr-2 h-4 w-4" /> New Purchase Invoice
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
            The Purchase Invoices section is currently under development. You can view all invoices in the main "Facturas" section.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
