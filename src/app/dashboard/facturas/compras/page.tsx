import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Construction } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export const metadata = {
  title: 'Facturas de Compra - ERP System',
};

export default function FacturasComprasPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('purchaseInvoices.title')}
        description={t('purchaseInvoices.description')}
        actionButton={
          <Button asChild className="shadow-sm" disabled>
            <Link href="/dashboard/facturas/new?tipo=compra">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('purchaseInvoices.newPurchaseInvoiceButton')}
            </Link>
          </Button>
        }
      />
      <Card className="mt-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Construction className="h-6 w-6" />
            {t('common.underConstruction')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            {t('purchaseInvoices.underConstructionMessage')}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
